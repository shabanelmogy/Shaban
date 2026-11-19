import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { NotificationsSettingsService } from '../../services/notifications.service';
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { NotificationsSettingsDTO } from '../../models/notifications';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CheckboxModule } from "primeng/checkbox";
import { ButtonsComponent } from "src/app/modules/shared/components/buttons/buttons.component";
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { Result } from 'src/app/modules/shared/models/result';
import { BookingActionEnum } from 'src/app/_metronic/shared/enums/bookingAction';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MockDataFormsModule, ɵInternalFormsSharedModule, ReactiveFormsModule, CheckboxModule, ButtonsComponent, TranslateModule, TableModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsSettingsComponent extends BaseComponentService implements OnInit {

  private readonly notificationsSettingsService = inject(NotificationsSettingsService)
  private readonly fb = inject(FormBuilder)
  private readonly destroyRef = inject(DestroyRef)


  notificationsForm !: FormGroup
  notificationsData = signal<NotificationsSettingsDTO | null>(null)
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion
  ngOnInit(): void {
    this.initForm();
    this.buildRentalBookingNotifications();
    this.getLastSetting();
  }

  getLastSetting() {
    this.loading.startLoading()
    this.notificationsSettingsService.get<NotificationsSettingsDTO>().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading())).subscribe({
      next: (data) => {
        this.notificationsData.set(data)
        this.fillForm(data)
      }
    })
  }

  private buildRentalBookingNotifications(): void {
    const RentalBookingArray = this.rentalBookingNotifications;
    RentalBookingArray.clear();

    Object.values(BookingActionEnum)
      .filter(v => typeof v === 'number')
      .forEach(action => {
        RentalBookingArray.push(
          this.fb.group({
            action: [action],
            emailNotification: [false],
            sendToCustomer: [false],
            sendToAdmin: [false],
          })
        );
      });
  }

  get rentalBookingNotifications(): FormArray {
    return this.notificationsForm.get(
      'rentalBookingNotifications'
    ) as FormArray;
  }

  initForm() {
    this.notificationsForm = this.fb.group({
      // Check Card
      emailOnAgreementOpening: [false],
      emailOnAgreementClosing: [false],
      emailCheckCard: [false],
      emailAlerts: [false],

      // WhatsApp
      whatsAppUtilityTemplates: [false],

      // Rental Booking
      rentalBookingNotifications: this.fb.array([]),

    })
  }

  fillForm(data: NotificationsSettingsDTO) {
    const checkCard = this.LastItem(data.checkCardSettings);
    const whatsapp = this.LastItem(data.whatsAppSettings);

    this.notificationsForm.patchValue({
      // Check Card
      emailOnAgreementOpening: checkCard?.emailOnAgreementOpening ?? false,
      emailOnAgreementClosing: checkCard?.emailOnAgreementClosing ?? false,
      emailCheckCard: checkCard?.emailCheckCard ?? false,
      emailAlerts: checkCard?.emailAlerts ?? false,

      // WhatsApp
      whatsAppUtilityTemplates: whatsapp?.whatsAppUtilityTemplates ?? false,


    });

    // Rental Booking
    if (data.rentalBookingNotifications?.length) {
      data.rentalBookingNotifications.forEach(item => {
        const fg = this.rentalBookingNotifications.controls.find(
          c => c.get('action')?.value === item.action
        );
        fg?.patchValue({
          emailNotification: item.emailNotification,
          sendToCustomer: item.sendToCustomer,
          sendToAdmin: item.sendToAdmin,
        });
      });
    }
  }

  private LastItem<T>(arr: T[]): T | null {
    return arr && arr.length ? arr[arr.length - 1] : null;
  }

  onButtonClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
    };
    actions[buttonId]?.();
  }

  save() {
    if (this.notificationsForm.invalid) return;
    this.loading.startLoading();
    const formValue = this.notificationsForm.value;
    const payload: NotificationsSettingsDTO = {
      checkCardSettings: [{
        emailOnAgreementOpening: formValue.emailOnAgreementOpening ?? false,
        emailOnAgreementClosing: formValue.emailOnAgreementClosing ?? false,
        emailCheckCard: formValue.emailCheckCard ?? false,
        emailAlerts: formValue.emailAlerts ?? false,
      }],
      whatsAppSettings: [{
        whatsAppUtilityTemplates: formValue.whatsAppUtilityTemplates ?? false,
      }],
      rentalBookingNotifications: formValue.rentalBookingNotifications,
    };

    this.notificationsSettingsService
      .post<Result<NotificationsSettingsDTO>>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: () => { this.getLastSetting() }
      });
  }


}
