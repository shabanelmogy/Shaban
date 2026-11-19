import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ApprovalsService } from '../../services/approvals.service';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { ApprovalsDTO } from '../../models/approvals';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { VoucherTypeEnum } from 'src/app/_metronic/shared/enums/voucherType';
import { Results } from 'src/app/modules/shared/models/results';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Result } from 'src/app/modules/shared/models/result';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { CommonModule } from '@angular/common';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { DropdownModule } from "primeng/dropdown";

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [MockDataFormsModule, ɵInternalFormsSharedModule, ReactiveFormsModule, TranslateModule, ButtonsComponent, CommonModule, DropdownModule],
  templateUrl: './approvals.component.html',
  styleUrl: './approvals.component.scss',
  providers: [EnumToArrayPipe]
})
export class ApprovalsComponent extends BaseComponentService implements OnInit {
  //#region injectors
  private readonly approvalsService = inject(ApprovalsService)
  private readonly enumToArrayPipe = inject(EnumToArrayPipe)
  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder)
  //#endregion

  //#region properties
  approvalsData = signal<ApprovalsDTO[]>([])
  approvalForm!: FormGroup
  voucherTypesOptions = computed<{ value: string, id: number }[]>(() =>
    this.enumToArrayPipe.transform(VoucherTypeEnum).map(item => ({
      value: item.value,
      id: item.id
    }))
  )
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion



  ngOnInit(): void {
    this.initForm();
    this.getLastSetting();
  }

  initForm() {
    this.approvalForm = this.fb.group({
      voucherType: [null],
      items: this.fb.array([])
    });
  }

  fillForm() {
    this.getItems.clear();
    if (this.approvalsData()) {
      this.approvalForm.patchValue({ voucherType: this.approvalsData()[0]?.voucherType });
      this.approvalsData().forEach(item => {
        const fb = this.createApprovalsItems();
        fb.patchValue(item);
        this.getItems.push(fb);
      });

    }
  }

  get getItems(): FormArray {
    return this.approvalForm.get('items') as FormArray;
  }

  addItems() {
    this.getItems.push(this.createApprovalsItems());
  }

  removeItem(index: number) {
    this.getItems.removeAt(index);
  }

  private createApprovalsItems(): FormGroup {
    return this.fb.group({
      levelName: [''],
      user: [''],
    });
  }

  getLastSetting() {
    this.loading.startLoading()
    this.approvalsService.get<Results<ApprovalsDTO>>()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.approvalsData.set(res.entities)
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
    if (this.approvalForm.invalid) return;
    this.loading.startLoading();
    const { voucherType, items } = this.approvalForm.getRawValue();

    const payload = {
      items: items.map(item => ({
        ...item,
        voucherType,
      })),
    };
    this.approvalsService
      .addSettingList<Result<ApprovalsDTO>>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: () => { this.getLastSetting() }
      });
  }

}
