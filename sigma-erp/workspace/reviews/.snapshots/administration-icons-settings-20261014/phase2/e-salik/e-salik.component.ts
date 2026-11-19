import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { TollsAccountDTO } from '../../models/tolls-account';
import { TagModule } from 'primeng/tag';
import { DialogService } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { SelectedItem } from 'src/app/modules/shared/models/selected-item';
import { TollAuthorityEnum } from 'src/app/_metronic/shared/enums/tollAuthority';
import { DropdownModule } from 'primeng/dropdown';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tollsInvoice } from 'src/app/_metronic/shared/enums/tollsInvoice';
import { tollsSurchargeEnum } from 'src/app/_metronic/shared/enums/tollsSurcharge';
import { SalikSettingsService } from '../../services/salik.service';
import { finalize } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { EditProfileDialogComponent } from 'src/app/modules/shared/interceptores/error.interceptor';
import { MasterSalikSettingsDTO } from '../../models/e-salik';
import { DividerModule } from 'primeng/divider';
import { MasterSalikSettingsService } from '../../services/master-salik.service';

@Component({
  selector: 'app-e-salik',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonsComponent,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    TagModule,
    CalendarModule,
    PasswordModule,
    DialogModule,
    DropdownModule,
    DividerModule
  ],
  templateUrl: './e-salik.component.html',
  styleUrl: './e-salik.component.scss',
  providers: [DatePipe, EnumToArrayPipe]
})
export class ESalikComponent extends BaseComponentService {
  //#region properties
  form!: FormGroup;
  accountForm!: FormGroup;
  authorityList = signal<SelectedItem[]>([]);
  invoiceTypeList = signal<SelectedItem[]>([]);
  surchargeTypeList = signal<SelectedItem[]>([]);
  tollsAccountsList = signal<TollsAccountDTO[]>([]);
  dialogVisible = false;
  dialogMode: 'create' | 'edit' = 'create';
  private isNew = true;
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-check2-circle' },
  ];

  readonly createButtons: ButtonModel[] = [
    { id: 'btn-create', text: 'settings.eSalikModel.createNewTollsAccount', type: 'primary', icon: 'bi bi-plus-lg' },
  ];
  //#endregion

  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly datePipe = inject(DatePipe);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly masterSalikSettingsService = inject(MasterSalikSettingsService);
  private readonly tollsAccountService = inject(SalikSettingsService);
  private readonly enumToArrayPipe = inject(EnumToArrayPipe);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  //#endregion

  //#region lifecycle
  ngOnInit(): void {
    this.loadDropdowns();
    this.initForm();
    this.getMasterSalikSettings();
    this.getTollsAccounts();
  }
  //#endregion

  //#region form initialization
  initForm(): void {
    this.form = this.fb.group({
      id: [0],
      surchargeType: [0],
      surchargeValue: [0.0001, [Validators.required, Validators.min(0.0001)]],
      invoice: [0],
      cutOffDate: [null],
      enableCompanyCodeInSalikAccount: [true],
      makeAllPostingGroupsOptional: [true],
      dontCreateReceivableOnWorkshop: [true],
      dateAsPostingDate: [true],
      downloadSingleAccountAtATime: [true],
      downloadUnchargedSalikTolls: [true],
      autoProcessAfterDownloading: [true],
      processSalikTollsInSpeedDataSharing: [true],
    });
  }

  getMasterSalikSettings(): void {
    this.loading.startLoading();
    this.masterSalikSettingsService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<MasterSalikSettingsDTO>) => {
          if (res.isSuccess && res.entities?.[0]) {
            const data = res.entities[0];
            this.form.patchValue({
              ...data,
              cutOffDate: data.cutOffDate ? new Date(data.cutOffDate) : null
            });
            this.isNew = false;
          } else {
            this.isNew = true;
          }
        },
      });
  }

  loadDropdowns() {
    this.authorityList.set(this.enumToArrayPipe.transform(TollAuthorityEnum));
    this.invoiceTypeList.set(this.enumToArrayPipe.transform(tollsInvoice));
    this.surchargeTypeList.set(this.enumToArrayPipe.transform(tollsSurchargeEnum));
  }

  getTollsAccounts(): void {
    this.loading.startLoading();
    this.tollsAccountService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<TollsAccountDTO>) => {
          if (res.isSuccess) {
            this.tollsAccountsList.set(res.entities || []);
          }
        },
      });
  }

  createTollsAccountForm(account?: TollsAccountDTO): FormGroup {
    return this.fb.group({
      id: [account?.id ?? 0],
      name: [account?.name ?? ''],
      authority: [account?.authority ?? '', Validators.required],
      userName: [account?.userName ?? '', Validators.required],
      password: [account?.password ?? '', Validators.required],
      lastDownloadDate: [account?.lastDownloadDate ? new Date(account.lastDownloadDate) : null, Validators.required],
      parkingLastDownloadDate: [account?.parkingLastDownloadDate ? new Date(account.parkingLastDownloadDate) : null],
      isRTA: [account?.isRTA ?? true],
      active: [account?.active ?? true],
    });
  }

  //#endregion


  //#region button actions
  onButtonClick(buttonId: string): void {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.saveGeneralSettings(),
      'btn-create': () => this.openCreate(),
    };
    actions[buttonId]?.();
  }
  //#endregion

  //#region dialog operations
  openCreate(): void {
    this.dialogMode = 'create';
    this.accountForm = this.createTollsAccountForm(undefined);
    this.dialogVisible = true;
    this.setupAuthorityListener();
  }

  openEdit(index: number): void {
    this.dialogMode = 'edit';
    const accountData = this.tollsAccountsList()[index];
    this.accountForm = this.createTollsAccountForm(accountData);

    // Clear password field for editing (security best practice)
    this.accountForm.patchValue({ password: '' });
    this.setupAuthorityListener();
    this.dialogVisible = true;
  }

  closeAccountDialog(): void {
    this.dialogVisible = false;
    this.accountForm.reset();
  }

  setupAuthorityListener(): void {
    this.accountForm.get('authority')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(authorityId => {
        if (authorityId !== null && authorityId !== undefined && authorityId !== '') {
          const numericId = typeof authorityId === 'string' ? parseInt(authorityId, 10) : authorityId;
          const selectedAuthority = this.authorityList().find(item => item.id === numericId);
          if (selectedAuthority) {
            this.accountForm.patchValue({ name: selectedAuthority.key }, { emitEvent: false });
          }
        } else {
          this.accountForm.patchValue({ name: '' }, { emitEvent: false });
        }
      });
  }

  saveAccount(): void {
    Object.keys(this.accountForm.controls).forEach(key => {
      this.accountForm.get(key)?.markAsTouched();
    });

    if (this.accountForm.invalid) {
      return;
    }
    this.loading.startLoading();
    const formValue = this.accountForm.getRawValue();
    const payload = {
      ...formValue,
      lastDownloadDate: this.datePipe.transform(formValue.lastDownloadDate, 'yyyy-MM-dd'),
      parkingLastDownloadDate: this.datePipe.transform(formValue.parkingLastDownloadDate, 'yyyy-MM-dd'),
      subscriptionId: this.subscriptionId
    } as TollsAccountDTO;

    const request$ = this.dialogMode === 'create'
      ? this.tollsAccountService.post(payload)
      : this.tollsAccountService.put(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getTollsAccounts();
            this.closeAccountDialog();
          }
        }
      });
  }


  deleteAccount(index: number): void {
    const account = this.tollsAccountsList()[index];
    this.loading.startLoading();
    this.tollsAccountService.delete(account.id.toString())
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getTollsAccounts();
          }
        }
      });
  }

  saveGeneralSettings() {
    if (this.form.invalid) {
      const message = this.translateService.instant('settings.eSalikModel.errorControlSalikSettings');
      const header = this.translateService.instant('settings.eSalikModel.errorHeader');
      this.dialogService.open(EditProfileDialogComponent, {
        header: header,
        width: '600px',
        data: {
          message: message,
        },
      });
      return;
    }
    this.loading.startLoading();
    const formValue = this.form.getRawValue();
    const payload = {
      ...formValue,
      cutOffDate: this.datePipe.transform(formValue.cutOffDate, 'yyyy-MM-dd'),
      subscriptionId: this.subscriptionId
    } as MasterSalikSettingsDTO;
    const request$ = this.isNew
      ? this.masterSalikSettingsService.post(payload)
      : this.masterSalikSettingsService.put(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getMasterSalikSettings();
          }
        },
      });
  }
  //#endregion

}
