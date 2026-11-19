import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { LimousineService } from '../../services/limousine.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { Result } from 'src/app/modules/shared/models/result';
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: 'app-limousine',
  standalone: true,
  imports: [MockDataFormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonsComponent,
    CheckboxModule
],
  templateUrl: './limousine.component.html',
  styleUrl: './limousine.component.scss'
})
export class LimousineComponent extends BaseComponentService implements OnInit {

  //#region injectors
  private readonly limousineService = inject(LimousineService);
  private readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  //#endregion

  //#region properties
  limousineForm!: FormGroup;
  limousineSettingData = signal<any | null>(null);

  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion

  ngOnInit(): void {
    this.initForm();
    this.getLastSetting();
  }

  initForm(): void {
    this.limousineForm = this.fb.group({
      userDefinedLocations: [false],
      restrictLocationsToTariffLocations: [false],
      customerSignatureOnFinish: [false],
      cancelTripInvoicingCorporateCustomers: [false],
      makeDropOffLocationOptionalIf: [false],
      limoDiscount: [false],
      limoCustomField1: [false],
      selectOnlyAvailableVehicleInLimoTrip: [false],
      createMultipleTripsFromLimoQuotation: [false],
      assigningStepForLimoTripBeforeDispatching: [false],
      bypassTimeOverlappingValidationDuringDispatching: [false],
      showOpenStaffCarNRMVehicleInTrips: [false],
      separateDateAndTimeIncludingTentativeProvision: [false],
      stopAutoInvoicingForIndividualCustomer: [false],
      customerExperienceInTripReport: [false],
      allowTaxEditingInLimoTrip: [false],
      trackMileage: [false],
      showChargesInTripEditing: [false],
      allowStatusChangeInTripEditing: [false],
      showTripFinishNotesInMobileApp: [false],
      limoCustomField: [false],
      allowTripDispatchSubStatus: [false],
      allowQuantityAndRateColumnInLimoQuotationAndTrip: [false],
      canSaveLimoInvoiceWithZeroCharges: [false],
      showTripNoInEmailSubject: [false],
      manuallySetPickUpAndDropOffDateTime: [false],
      showOnlyManualTripNoInSOA: [false],
      descriptionColumnInChargesGrid: [false],
      sendEmailToContactPersonsFromTrip: [false],
      monthlyTripHistoryInLimoApp: [false],
    });
  }

  fillForm(): void {
    if (!this.limousineSettingData()) return;

    this.limousineForm.patchValue(this.limousineSettingData());
  }

  getLastSetting(): void {
    this.loading.startLoading();
    this.limousineService.getMine<Result<any>>()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading())
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess && res.entity) {
            const lastSetting = res.entity;
            this.limousineSettingData.set(lastSetting);
            this.fillForm();
          }
        }
      });
  }

  onButtonClick(buttonId: string): void {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
    };
    actions[buttonId]?.();
  }

  save(): void {
    if (this.limousineForm.invalid) return;

    this.loading.startLoading();
    const payload = {
      ...this.limousineForm.value,
    };

    this.limousineService.saveMine<Result<unknown>>(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading())
      )
      .subscribe({
        next: () => {
          this.getLastSetting();
        }
      });
  }
}
