import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ButtonsComponent } from "src/app/modules/shared/components/buttons/buttons.component";
import { HrmService } from '../../services/hrm.service';
import { Result } from 'src/app/modules/shared/models/result';
import { HrmDTO } from '../../models/hrm';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';

@Component({
  selector: 'app-hrm',
  standalone: true,
  imports: [MockDataFormsModule, ɵInternalFormsSharedModule, TranslateModule, CheckboxModule, ReactiveFormsModule, ButtonsComponent],
  templateUrl: './hrm.component.html',
  styleUrl: './hrm.component.scss'
})
export class HrmComponent extends BaseComponentService implements OnInit {
  //#region injectors
  private readonly hrmSettingService = inject(HrmService)
  private readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);

  //#endregion

  //#region properties
  hrmFrom: FormGroup;
  hrmSettingData = signal<HrmDTO | null>(null);
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion



  ngOnInit(): void {
    this.initForm();
    this.getLastSetting();
  }



  initForm() {
    this.hrmFrom = this.fb.group({
      isPreviousMonthOvertimeForPayrollProcess: [false],
      isPreviousMonthSalesCommissionForPayrollProcess: [false],
      isBusinessUnitsWisePayrollProcess: [false],
    })
  }

  fillForm() {
    if (this.hrmSettingData()) {
      this.hrmFrom.patchValue({
        isPreviousMonthOvertimeForPayrollProcess: this.hrmSettingData().isPreviousMonthOvertimeForPayrollProcess,
        isPreviousMonthSalesCommissionForPayrollProcess: this.hrmSettingData().isPreviousMonthSalesCommissionForPayrollProcess,
        isBusinessUnitsWisePayrollProcess: this.hrmSettingData().isBusinessUnitsWisePayrollProcess,
      })
    }
  }

  getLastSetting() {
    this.loading.startLoading()
    this.hrmSettingService.getMine<Result<HrmDTO>>()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            let lastHrmSetting = res.entity
            this.hrmSettingData.set(lastHrmSetting)
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

    if (this.hrmFrom.invalid) return;
    this.loading.startLoading();
    const payload = {
      ...this.hrmFrom.value,
    };
    this.hrmSettingService
      .saveMine<Result<HrmDTO>>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: () => { this.getLastSetting() }
      });
  }
}
