import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Results } from './../../../../shared/models/results';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { CheckboxModule } from 'primeng/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { EquipmentService } from '../../services/equipment.service';
import { EquipmentDTO } from '../../models/equipment';
import { Result } from 'src/app/modules/shared/models/result';
import { EditProfileDialogComponent } from 'src/app/modules/shared/interceptores/error.interceptor';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CheckboxModule,
    ButtonsComponent
  ],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent extends BaseComponentService implements OnInit {
  equipmentForm: FormGroup;

  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly equipmentService = inject(EquipmentService);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    this.initForm();
    this.getEquipmentSettings();
  }

  initForm() {
    this.equipmentForm = this.fb.group({
      id: [0],
      isTimeSheetMandatoryForRentalInvoicing: [false],
    });
  }

  getEquipmentSettings() {
    this.loading.startLoading();
    this.equipmentService.get<Results<EquipmentDTO>>().pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading())).subscribe({
        next: (res) => {
          if (res) {
            this.equipmentForm.patchValue(res);
          }
        },
      });
  }

  onButtonClick(buttonId: string) {
    if (buttonId === 'btn-save') {
      this.save();
    }
  }

  save() {
    if (this.equipmentForm.invalid) {
      const message = this.translateService.instant('validationMessages.formInvalid');
      const header = this.translateService.instant('settings.profileModel.errorHeader') || 'Error';
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

    const payload: EquipmentDTO = {
      ...this.equipmentForm.value,
      subscriptionId: this.subscriptionId,
    };


    this.equipmentService.post<Result<EquipmentDTO>>(payload).pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getEquipmentSettings();
          }
        },
      });
  }
}
