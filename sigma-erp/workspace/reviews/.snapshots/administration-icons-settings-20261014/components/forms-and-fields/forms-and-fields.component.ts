import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { FormsAndFieldsService } from '../../services/forms-fields.service';
import { FormTypeEnum } from 'src/app/_metronic/shared/enums/formType';
import { EnumToArrayPipe } from 'src/app/modules/shared/enums/enum-to-array.pipe';
import { FormFieldTypeEnum } from 'src/app/_metronic/shared/enums/formFieldType';
import { SelectedItem } from 'src/app/modules/shared/models/selected-item';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forms-and-fields',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DropdownModule,
    ButtonsComponent,
    CheckboxModule,
  ],
  templateUrl: './forms-and-fields.component.html',
  styleUrl: './forms-and-fields.component.scss',
  providers: [EnumToArrayPipe],
})
export class FormsAndFieldsComponent
  extends BaseComponentService
  implements OnInit
{
  //#region Properties
  formsAndFieldsForm!: FormGroup;
  readonly buttons: ButtonModel[] = [
    {
      id: 'btn-save',
      text: 'general.save',
      type: 'primary',
      class: 'me-2',
      icon: 'bi bi-save',
    },
  ];
  formOptions = signal<SelectedItem[]>([]);
  mandatoryFields: any[] = [];
  additionalFields: any[] = [];
  documents: any[] = [];
  settingsId = 0;
  currentFormId = 0;

  private readonly fb = inject(FormBuilder);
  private readonly formsAndFieldsService = inject(FormsAndFieldsService);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly enumToArray = inject(EnumToArrayPipe);
  //#endregion

  ngOnInit(): void {
    this.initForm();
    this.loadFormOptions();
  }

  initForm() {
    this.formsAndFieldsForm = this.fb.group({
      form: [null],
    });

    this.formsAndFieldsForm
      .get('form')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (val !== null) {
          this.loadFields(val);
        } else {
          this.mandatoryFields = [];
          this.additionalFields = [];
        }
      });
  }

  loadFormOptions() {
    this.formOptions.set(
      this.enumToArray.transform(FormTypeEnum).map((row) => {
        return {
          key: row.key,
          value: row.value,
        };
      })
    );
  }

  loadFields(formType: number) {
    this.formsAndFieldsService
      .getByType<any>(formType)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        let foundForm: any = null;
        if (res.isSuccess && res.entity) {
          this.settingsId = res.entity.id || 0;
          foundForm = res.entity;
        }

        if (foundForm) {
          this.currentFormId = foundForm.id || 0;
          this.documents = foundForm.documents || [];
          this.mandatoryFields = foundForm.mandatoryFields || [];
          this.additionalFields = foundForm.additionalFields || [];
        } else {
          this.currentFormId = 0;
          this.documents = [];
          this.mandatoryFields = [];
          this.additionalFields = [];
        }
      });
  }

  onButtonClick(buttonId: string) {
    if (buttonId === 'btn-save') {
      this.save();
    }
  }

  save() {
    this.loading.startLoading();
    const data = {
      subscriptionId: this.subscriptionId,
      id: this.currentFormId,
      formType: this.formsAndFieldsForm.get('form')?.value,
      mandatoryFields: this.mandatoryFields.map((f) => ({
        subscriptionId: this.subscriptionId,
        id: f.id || 0,
        fieldName: f.fieldName,
        isEnabled: f.isEnabled,
      })),
      additionalFields: this.additionalFields.map((f) => ({
        subscriptionId: this.subscriptionId,
        id: f.id || 0,
        fieldName: f.fieldName,
        isEnabled: f.isEnabled,
      })),
    };

    this.formsAndFieldsService
      .put(data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading())
      )
      .subscribe(() => {
        next: () => {
          this.loadFields(this.formsAndFieldsForm.get('form')?.value);
        };
      });
  }
}
