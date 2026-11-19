import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { SelectedItem } from 'src/app/modules/shared/models/selected-item';
import { EDarbTollsAccountDTO } from '../../models/e-darb-tolls-account';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { DialogService } from 'primeng/dynamicdialog';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { DarbSettingsService } from '../../services/darb.service';
import { MasterDarbSettingsService } from '../../services/master-darb.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { MasterDarbSettingsDTO } from '../../models/e-darb';
import { TollAuthorityEnum } from 'src/app/_metronic/shared/enums/tollAuthority';
import { tollsInvoice } from 'src/app/_metronic/shared/enums/tollsInvoice';
import { EditProfileDialogComponent } from 'src/app/modules/shared/interceptores/error.interceptor';

@Component({
  selector: 'app-e-darb',
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
  templateUrl: './e-darb.component.html',
  styleUrl: './e-darb.component.scss',
  providers: [DatePipe, EnumToArrayPipe]
})
export class EDarbComponent extends BaseComponentService {
  //#region properties
  form!: FormGroup;
  accountForm!: FormGroup;
  authorityList = signal<SelectedItem[]>([]);
  invoiceTypeList = signal<SelectedItem[]>([]);
  tollsAccountsList = signal<EDarbTollsAccountDTO[]>([]);
  dialogVisible = false;
  dialogMode: 'create' | 'edit' = 'create';
  private isNew = true;

  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];

  readonly createButtons: ButtonModel[] = [
    { id: 'btn-create', text: 'settings.eDarbModel.createNewTollsAccount', type: 'primary', icon: 'bi bi-plus' },
  ];
  //#endregion

  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly datePipe = inject(DatePipe);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly masterDarbSettingsService = inject(MasterDarbSettingsService);
  private readonly tollsAccountService = inject(DarbSettingsService);
  private readonly enumToArrayPipe = inject(EnumToArrayPipe);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  //#endregion

  //#region lifecycle
  ngOnInit(): void {
    this.loadDropdowns();
    this.initForm();
    this.getMasterDarbSettings();
    this.getTollsAccounts();
  }
  //#endregion

  //#region form initialization
  initForm(): void {
    this.form = this.fb.group({
      id: [0],
      surcharge: [0.0001, [Validators.required, Validators.min(0.0001)]],
      invoice: [0],
      cutOffDate: [null],
      dontCreateReceivableOnWorkshop: [true],
      dateAsPostingDate: [true],
      makeAllPostingGroupsOptional: [true],
      enableVehicleMappedApplicableDate: [true],
      processDarbTollsInSpeedDataSharing: [true],
      autoProcessAfterDownloading: [true],
      enableCompanyCodeInDarbAccount: [true],
    });
  }
  //#endregion

  getMasterDarbSettings(): void {
    this.loading.startLoading();
    this.masterDarbSettingsService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<MasterDarbSettingsDTO>) => {
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
  }

  getTollsAccounts(): void {
    this.loading.startLoading();
    this.tollsAccountService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<EDarbTollsAccountDTO>) => {
          if (res.isSuccess) {
            this.tollsAccountsList.set(res.entities || []);
          }
        },
      });
  }

  createTollsAccountForm(account?: EDarbTollsAccountDTO): FormGroup {
    return this.fb.group({
      id: [account?.id ?? 0],
      name: [account?.name ?? ''],
      authority: [account?.authority ?? '', Validators.required],
      userName: [account?.userName ?? '', [Validators.required]],
      password: [account?.password ?? '', Validators.required],
      lastDownloadDate: [account?.lastDownloadDate ? new Date(account.lastDownloadDate) : null, Validators.required],
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
      this.accountForm.controls[key].markAsDirty();
    })
    if (this.accountForm.invalid) {
      return;
    }
    this.loading.startLoading();
    const formValue = this.accountForm.getRawValue();
    const payload = {
      ...formValue,
      lastDownloadDate: this.datePipe.transform(formValue.lastDownloadDate, 'yyyy-MM-dd'),
      subscriptionId: this.subscriptionId
    } as EDarbTollsAccountDTO;

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
      const message = this.translateService.instant('settings.eDarbModel.errorControlDarbSettings');
      const header = this.translateService.instant('settings.eDarbModel.errorHeader');
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
    } as MasterDarbSettingsDTO;

    const request$ = this.isNew
      ? this.masterDarbSettingsService.post(payload)
      : this.masterDarbSettingsService.put(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getMasterDarbSettings();
          }
        },
      });
  }
  //#endregion
}
