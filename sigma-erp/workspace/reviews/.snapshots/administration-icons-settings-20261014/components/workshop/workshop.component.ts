import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { WorkshopSettingService } from '../../services/workshop.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { JobTypeEnum } from 'src/app/_metronic/shared/enums/jobType';
import { Results } from 'src/app/modules/shared/models/results';
import { WorkshopSettingDTO } from '../../models/workshop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Result } from 'src/app/modules/shared/models/result';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [MockDataFormsModule, TranslateModule, CheckboxModule, ReactiveFormsModule, ButtonsComponent, MultiSelectModule],
  templateUrl: './workshop.component.html',
  styleUrl: './workshop.component.scss',
  providers: [EnumToArrayPipe]
})
export class WorkshopSettingComponent extends BaseComponentService implements OnInit {


  //#region injectors
  private readonly workshopSettingService = inject(WorkshopSettingService)
  private readonly enumToArrayPipe = inject(EnumToArrayPipe);
  private readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);

  //#endregion

  //#region properties
  workshopSettingForm: FormGroup;
  workshopSettingData = signal<WorkshopSettingDTO | null>(null);
  JobTypesOptions = signal<{ label: string, value: number }[]>([]);
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion



  ngOnInit(): void {
    this.initForm();
    this.getLastSetting();
    this.loadDropdown()
  }

  loadDropdown() {
    this.JobTypesOptions.set(this.enumToArrayPipe.transform(JobTypeEnum).map((item) => ({ label: item.value, value: item.id })))
  }

  initForm() {
    this.workshopSettingForm = this.fb.group({
      selectedJobTypes: [null],
      insteadOfItemsSelectionAllowAnyItemName: [false],
      externalWorkshopChargesInJC: [false],
      allowClosedJobsInBillings: [false],
      generateJobInvoiceInRoundedDecimal: [false],
      allowEditJobType: [false],
      forwardVehicleDetailsFromStockIRToPR: [false],
    })
  }

  fillForm() {
    if (this.workshopSettingData()) {
      this.workshopSettingForm.patchValue({
      selectedJobTypes: this.workshopSettingData().selectedJobTypes,
      insteadOfItemsSelectionAllowAnyItemName: this.workshopSettingData().insteadOfItemsSelectionAllowAnyItemName,
      externalWorkshopChargesInJC: this.workshopSettingData().externalWorkshopChargesInJC,
      allowClosedJobsInBillings: this.workshopSettingData().allowClosedJobsInBillings,
      generateJobInvoiceInRoundedDecimal: this.workshopSettingData().generateJobInvoiceInRoundedDecimal,
      allowEditJobType: this.workshopSettingData().allowEditJobType,
      forwardVehicleDetailsFromStockIRToPR: this.workshopSettingData().forwardVehicleDetailsFromStockIRToPR,
      })
    }
  }

  getLastSetting() {
    this.loading.startLoading()
    this.workshopSettingService.getMine<Result<WorkshopSettingDTO>>()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            let lastitem = res.entity
            this.workshopSettingData.set(lastitem)
            this.fillForm()
          }
        }
      });
  }


  onButtonClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
    };
    actions[buttonId]?.();
  }

  save() {

    if (this.workshopSettingForm.invalid) return;
    this.loading.startLoading();
    const payload = {
      ...this.workshopSettingForm.value,
    };
    this.workshopSettingService
      .saveMine<Result<WorkshopSettingDTO>>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: () => { this.getLastSetting() }
      });
  }

}
