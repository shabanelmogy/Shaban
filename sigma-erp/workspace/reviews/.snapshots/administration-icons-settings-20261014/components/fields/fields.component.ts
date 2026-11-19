import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { FieldsService } from '../../services/fields.service';
import { FieldsDTO } from '../../models/fields';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CheckboxModule,
    TabViewModule,
    ButtonModule,
    ButtonsComponent
  ],
  templateUrl: './fields.component.html',
  styleUrl: './fields.component.scss'
})
export class FieldsComponent extends BaseComponentService implements OnInit {
  fieldsSettings: FieldsDTO = {} as FieldsDTO;

  readonly buttons: ButtonModel[] = [
    {
      id: 'btn-save',
      text: 'general.save',
      type: 'primary',
      class: 'me-2',
      icon: 'bi bi-save',
    },
  ];

  private readonly fieldsService = inject(FieldsService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadFields();
  }

  loadFields() {
    this.loading.startLoading();
    this.fieldsService.get<any>()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading())
      )
      .subscribe((res) => {
        if (res) {
          this.fieldsSettings = res;
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
    this.fieldsService.post(this.fieldsSettings)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading())
      )
      .subscribe(() => {
        this.loadFields();
      });
  }

  isSystemField(key: any): boolean {
    const systemFields = ['id', 'isActive', 'isValid', 'isChanged', 'no', 'guid', 'createdAt', 'createdBy'];
    return systemFields.includes(key);
  }

  getMandatoryKeys(obj: any): string[] {
    if (!obj) return [];
    return Object.keys(obj).filter(key => !this.isSystemField(key) && key.endsWith('Mandatory'));
  }

  getAdditionalKeys(obj: any): string[] {
    if (!obj) return [];
    return Object.keys(obj).filter(key => !this.isSystemField(key) && !key.endsWith('Mandatory'));
  }

  getFieldName(key: string): string {
    return key.endsWith('Mandatory') ? key.replace('Mandatory', '') : key;
  }
}
