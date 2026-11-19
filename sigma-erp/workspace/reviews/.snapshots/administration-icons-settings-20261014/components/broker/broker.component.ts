import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { BrokerService } from '../../services/broker.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { Results } from 'src/app/modules/shared/models/results';
import { BrokerDTO } from '../../models/broker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Result } from 'src/app/modules/shared/models/result';
import { BrokerContactGroupEnum } from 'src/app/_metronic/shared/enums/brokerContactGroup';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';

@Component({
  selector: 'app-broker',
  standalone: true,
  imports: [MockDataFormsModule, DropdownModule, TranslateModule, CheckboxModule, ReactiveFormsModule, ButtonsComponent],
  templateUrl: './broker.component.html',
  styleUrl: './broker.component.scss',
  providers: [EnumToArrayPipe]
})
export class BrokerComponent extends BaseComponentService implements OnInit {
  //#region injectors
  private readonly brokerService = inject(BrokerService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder);
  private readonly enumToArrayPipe = inject(EnumToArrayPipe)
  //#endregion


  //#region properties
  brokerdata = signal<BrokerDTO | null>(null);
  brokerForm: FormGroup
  brokerContactGroupOptions = signal<{ value: string, id: number }[]>([])
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion


  ngOnInit(): void {
    this.initForm();
    this.getLastSetting();
    this.loadDropdown();
  }
  
  loadDropdown() {
    this.brokerContactGroupOptions.set(this.enumToArrayPipe.transform(BrokerContactGroupEnum).map((item) => ({ value: item.value, id: item.id })))
  }

  initForm() {
    this.brokerForm = this.fb.group({
      brokerContactGroup: [null],
      showDriverNameAndDetailInsteadOfCustomer: [false],
      hideRatesIfCustomerIsBroker: [false],
    })
  }

  fillForm() {
    if (this.brokerdata()) {
      this.brokerForm.patchValue({
        brokerContactGroup: this.brokerdata().brokerContactGroup,
        showDriverNameAndDetailInsteadOfCustomer: this.brokerdata().showDriverNameAndDetailInsteadOfCustomer,
        hideRatesIfCustomerIsBroker: this.brokerdata().hideRatesIfCustomerIsBroker,
      })

    }
  }

  getLastSetting() {
    this.loading.startLoading()
    this.brokerService.getMine<Result<BrokerDTO>>()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            let lastitem = res.entity
            this.brokerdata.set(lastitem)
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

    if (this.brokerForm.invalid) return;
    this.loading.startLoading();
    const payload = {
      ...this.brokerForm.value,
    };
    this.brokerService
      .saveMine<Result<BrokerDTO>>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: () => { this.getLastSetting() }
      });
  }



}
