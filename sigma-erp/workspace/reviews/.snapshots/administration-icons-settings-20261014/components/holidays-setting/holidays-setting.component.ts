import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, computed, DestroyRef, inject, OnInit, signal, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { HolidaysSettingService } from '../../services/holidays-setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HolidaysSettingDTO } from '../../models/holidays-setting';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ColType, ListCol, TableListComponent } from 'ms-lib';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Results } from 'src/app/modules/shared/models/results';
import { finalize } from 'rxjs';
import { ActionList } from 'src/app/modules/shared/models/action-list';
import { ButtonsComponent } from "src/app/modules/shared/components/buttons/buttons.component";

@Component({
  selector: 'app-holidays-setting',
  standalone: true,
  imports: [MockDataFormsModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    TableListComponent,
    DialogModule,
    ButtonModule,
    ButtonsComponent,
  ],
  templateUrl: './holidays-setting.component.html',
  styleUrl: './holidays-setting.component.scss'
})
export class HolidaysSettingComponent extends BaseComponentService implements OnInit {
  actionTemplate = viewChild<TemplateRef<any>>('actionTemplate');

  //#region injectors
  private readonly holidaysSettingService = inject(HolidaysSettingService);
  private readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  //#endregion

  //#region Properties
  data = signal<HolidaysSettingDTO[]>([]);
  columns = computed<ListCol[]>(() => [
    {
      displayName: 'general.actions',
      colName: 'actions',
      type: ColType.template,
      celTemp: this.actionTemplate()
    },
    {
      displayName: 'settings.holidaysModel.name',
      colName: 'name',
      isShowSearch: false
    },
    {
      displayName: 'settings.holidaysModel.date',
      colName: 'date',
      isShowSearch: false
    },
  ]);
  moreActions = computed<ActionList[]>(() => [
    {
      title: 'general.edit',
      icon: 'bi fs-3 bi-pencil',
      action: (item: HolidaysSettingDTO) => {
        this.HolidaysSettingData.set(item);
        this.fillForm();
        this.visibleDialog.set(true);
        this.switchCreateAndUpdate.set(true);
      },
    },
    {
      title: 'general.delete',
      icon: 'bi fs-3 bi-trash',
      action: (item: HolidaysSettingDTO) => {
        this.deleteHoliday(item.id);
      },
    },
  ])
  HolidaysSettingData = signal<HolidaysSettingDTO | null>(null);
  HolidaysSettingForm!: FormGroup;
  readonly Buttons: ButtonModel[] = [
    { id: 'btn-cancel', text: 'general.cancel', type: 'danger', class: 'me-2', icon: 'bi bi-x-lg' },
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];

  visibleDialog = signal<boolean>(false)
  switchCreateAndUpdate = signal<boolean>(false)
  //#endregion


  ngOnInit(): void {
    this.initForm();
    this.getListItems();
  }


  initForm() {
    this.HolidaysSettingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      date: ['', [Validators.required]]
    })
  }

  fillForm() {
    if (this.HolidaysSettingData()) {
      this.HolidaysSettingForm.patchValue({
        name: this.HolidaysSettingData().name,
        date: this.HolidaysSettingData().date,
      })

    }
  }

  getListItems() {
    this.loading.startLoading();
    this.holidaysSettingService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<HolidaysSettingDTO>) => {
          if (res.isSuccess) {
            this.data.set(res.entities);
          }

        }
      })
  }
  onButtonClick(buttonId: string) {
    switch (buttonId) {
      case 'btn-save':
        this.save();
        break;
      case 'btn-cancel':
        this.cancel();
        break;

    }
  }

  showDialog() {
    this.switchCreateAndUpdate.set(false);
    this.HolidaysSettingData.set(null);
    this.HolidaysSettingForm.reset();
    this.visibleDialog.set(true);
  }

  deleteHoliday(id: number) {
    this.loading.startLoading();
    this.holidaysSettingService.delete(id.toString())
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        // DELETE returns one Result (UI block 2), not a list.
        next: (res) => {
          if (res.isSuccess) {
            this.getListItems();
          }

        }
      })
  }

  cancel() {
    this.visibleDialog.set(false)
  }

  save() {
    if (this.HolidaysSettingForm.invalid) return
    let payload = this.HolidaysSettingForm.getRawValue()
    this.switchCreateAndUpdate() ? this.updateHoliday(payload) : this.createHoliday(payload)
  }

  createHoliday(payload: HolidaysSettingDTO) {
    this.holidaysSettingService.post(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.visibleDialog.set(false)
            this.getListItems();

          }
        },
      });
  }

  updateHoliday(payload: HolidaysSettingDTO) {
    let date = {
      subscriptionId: this.subscriptionId,
      id: this.HolidaysSettingData().id,
      ...payload
    }
    this.holidaysSettingService.put(date)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.visibleDialog.set(false)
            this.getListItems();

          }
        },
      });
  }
}
