import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { PaymentGatewaySettingService } from '../../services/payment-gateway-setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaymentMethodService } from '../../../PaymentMethods/services/paymentmethod.service';
import { PaymentGatewaySettingDTO } from '../../models/payment-gateway-setting';
import { DropDownSelect } from 'src/app/modules/shared/models/dropdown-select';
import { finalize, forkJoin } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { Result } from 'src/app/modules/shared/models/result';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from "primeng/dropdown";
import { ButtonModel } from 'src/app/modules/shared/models/button-model';

@Component({
  selector: 'app-payment-gateway-setting',
  standalone: true,
  imports: [MockDataFormsModule, TranslateModule, ReactiveFormsModule, ButtonsComponent, DropdownModule],
  templateUrl: './payment-gateway-setting.component.html',
  styleUrl: './payment-gateway-setting.component.scss'
})
export class PaymentGatewaySettingComponent extends BaseComponentService implements OnInit {

  private readonly paymentGatewaySettingService = inject(PaymentGatewaySettingService);
  private readonly fb = inject(FormBuilder);
  private readonly paymentMethodService = inject(PaymentMethodService);
  private readonly destroyRef = inject(DestroyRef);


  paymentGatewayData = signal<PaymentGatewaySettingDTO | null>(null);
  paymentGatewayForm!: FormGroup;
  paymentMethodOption = signal<{ value: string, id: string }[]>([])
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];





  ngOnInit(): void {
    this.initForm();
    this.loadDropdown();
    this.getLastSetting();
  }



  initForm() {
    this.paymentGatewayForm = this.fb.group({
      bookingPluginPaymentMethod: [''],
      publicKey: [''],
      secretKey: [''],
      paymentLink: [''],
    });
  }

  fillForm() {
    if (this.paymentGatewayData()) {
      this.paymentGatewayForm.patchValue({
        bookingPluginPaymentMethod: this.paymentGatewayData().bookingPluginPaymentMethod,
        publicKey: this.paymentGatewayData().publicKey,
        secretKey: this.paymentGatewayData().secretKey,
        paymentLink: this.paymentGatewayData().paymentLink,
      })
    };
  }


  loadDropdown() {
    this.loading.startLoading()
    this.paymentMethodService.getSelectList<Results<DropDownSelect>>()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.paymentMethodOption.set(res.entities.map((item) => ({ value: item.value, id: item.id.toString() })))
          }
        }
      });
  }

  getLastSetting() {
    this.loading.startLoading()
    this.paymentGatewaySettingService.getMine<Result<PaymentGatewaySettingDTO>>()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            let lastItem = res.entity
            this.paymentGatewayData.set(lastItem);
            this.fillForm();
          }
        }
      })

  }






  onButtonClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
    };
    actions[buttonId]?.();
  }


  save() {
    this.loading.startLoading()
    let payload = this.paymentGatewayForm.value
    this.paymentGatewaySettingService.saveMine<Result<unknown>>(payload)
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
