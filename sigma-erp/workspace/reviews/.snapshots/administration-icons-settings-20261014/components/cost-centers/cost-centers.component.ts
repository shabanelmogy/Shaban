import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { SelectedItem } from 'src/app/modules/shared/models/selected-item';
import { PaymentMethodService } from '../../../PaymentMethods/services/paymentmethod.service';
import { ApiKeyService } from '../../services/api-key.service';
import { DropdownModule } from 'primeng/dropdown';
import { SettingsCostCentersModelService } from '../../services/settings-cost-centers-model.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { Results } from 'src/app/modules/shared/models/results';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { finalize } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { CostCentersModel } from '../../models/costCenters';

@Component({
  selector: 'app-cost-centers',
  standalone: true,
  imports: [MockDataFormsModule, CommonModule, ReactiveFormsModule, TranslateModule, DropdownModule,
    ButtonsComponent, CheckboxModule
  ],
  templateUrl: './cost-centers.component.html',
  styleUrl: './cost-centers.component.scss'
})
export class CostCentersComponent extends BaseComponentService {
  costCentersForm: FormGroup;
  CostCentersList = signal<SelectedItem[]>([]);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly settingsCostCentersModelService = inject(SettingsCostCentersModelService);

  CostCentersData = signal<CostCentersModel | null>(null);
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadDropdown()
     this.getLastSetting()
  }
  initForm() {
    this.costCentersForm = this.fb.group({
      isMandatory: [false],
      costCenterId: [null],
    })
  }
  onButtonClick(buttonId: string) {
    if (buttonId === 'btn-save') {
      this.save();
    }
  }
  fillForm() {
    if (this.CostCentersData()) {
      this.costCentersForm.patchValue({
        isMandatory: this.CostCentersData().isMandatory,
        costCenterId: this.CostCentersData().costCenterId,
      })
    };
  }

  loadDropdown() {
    this.loading.startLoading()
    this.settingsCostCentersModelService.getSelectList<Results<DropDownSelect>>()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          this.CostCentersList.set(
            res.entities.map((row) => {
              return {
                key: row.value,
                value: row.id
              }
            })
          )
        }
      });
  }
  getLastSetting() {
    this.loading.startLoading()
    this.settingsCostCentersModelService.get<Results<CostCentersModel>>()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
           console.log(res);
          if (res.isSuccess) {
            let lastItem = res.entities[res.entities.length - 1]
            this.CostCentersData.set(lastItem);
            this.fillForm();
          }
        }
      })

  }

  save() {
    this.loading.startLoading()
    let payload = this.costCentersForm.value
    this.settingsCostCentersModelService.post(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getLastSetting()
          }
        }
      })

  }
}
