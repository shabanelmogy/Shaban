import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { RegistrationSettingsService } from '../../services/UM-registration.service';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { UserManagementDTO } from '../../models/user-management';
import { EditProfileDialogComponent } from 'src/app/modules/shared/interceptores/error.interceptor';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonsComponent,
    CheckboxModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent extends BaseComponentService {
  //#region properties
  form: FormGroup;

  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  private isNew = true;
  //#endregion
  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly basicService = inject(RegistrationSettingsService);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  //#endregion

  //#region methods
  ngOnInit(): void {
    this.initForm();
    this.getUserManagementSettings();
  }

  initForm() {
    this.form = this.fb.group({
      id: [0],
      allowUserRegistration: [true],
      newUsersActiveByDefault: [true],
      useSecurityImageQuestion: [true],
      emailConfirmationRequiredForLogin: [true],
    });
  }

  getUserManagementSettings() {
    this.loading.startLoading();
    this.basicService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<UserManagementDTO>) => {
          if (res.isSuccess && res.entities?.[0]) {
            const data = res.entities[0];
            this.form.patchValue(data);
            this.isNew = false;
          } else {
            this.isNew = true;
          }
        },
      });
  }

  onButtonClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
    };
    actions[buttonId]?.();
  }

  save() {
    if (this.form.invalid) {
      const message = this.translateService.instant('settings.userManagement.errorControlUserManagement');
      const header = this.translateService.instant('settings.userManagement.errorHeader');
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
    const payload = this.form.getRawValue() as UserManagementDTO;
    payload.subscriptionId = this.subscriptionId;
    const request$ = this.isNew
      ? this.basicService.post(payload)
      : this.basicService.put(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getUserManagementSettings();
          }
        },
      });
  }
}
