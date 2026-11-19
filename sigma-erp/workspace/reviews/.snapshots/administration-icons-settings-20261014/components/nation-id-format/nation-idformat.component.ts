import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { NationIdFormatService } from '../../services/nation-id-format.service';
import { NationIDFormatDTO } from '../../models/nation-id-format';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { Results } from 'src/app/modules/shared/models/results';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Result } from 'src/app/modules/shared/models/result';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nation-idformat',
  standalone: true,
  imports: [MockDataFormsModule, ɵInternalFormsSharedModule, ReactiveFormsModule, TranslateModule, ButtonsComponent,CommonModule],
  templateUrl: './nation-idformat.component.html',
  styleUrl: './nation-idformat.component.scss'
})
export class NationIDFormatComponent extends BaseComponentService implements OnInit {
  //#region injectors

  private readonly nationIdFormatService = inject(NationIdFormatService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder)
  //#endregion

  //#region properties
  nationIdFormatDate = signal<NationIDFormatDTO[]>([])
  nationIdFormatForm: FormGroup
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion

  ngOnInit(): void {
    this.initForm();
    this.getLastSetting();
  }

  initForm() {
    this.nationIdFormatForm = this.fb.group({
      items: this.fb.array([])
    })
  }

  get detailsCountryFormats(): FormArray {
    return this.nationIdFormatForm.get('items') as FormArray;
  }

  private createCountryFormatForm(): FormGroup {
    return this.fb.group({
      country: [''],
      format: [''],
    });
  }


  addCountryFormat(): void {
    this.detailsCountryFormats.push(this.createCountryFormatForm());
  }

  removeCountryFormat(index: number): void {
    this.detailsCountryFormats.removeAt(index);
  }

  fillForm(): void {
    this.detailsCountryFormats.clear();
    if (this.nationIdFormatDate()) {

      this.nationIdFormatDate().forEach(item => {
        const fg = this.createCountryFormatForm();
        fg.patchValue(item);
        this.detailsCountryFormats.push(fg);
      });
    }
  }

  getLastSetting() {
    this.loading.startLoading()
    this.nationIdFormatService.get<Results<NationIDFormatDTO>>()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.nationIdFormatDate.set(res.entities)
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
    if (this.nationIdFormatForm.invalid) return;
    this.loading.startLoading();
    const payload = {items:this.nationIdFormatForm.getRawValue().items};
    this.nationIdFormatService
      .updateList<Result<NationIDFormatDTO>>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: () => { this.getLastSetting() }
      });
  }


}
