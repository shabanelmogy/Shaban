import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { DDAService } from '../../services/dda.service';
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { DdaDTO } from '../../models/DDA';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { Results } from 'src/app/modules/shared/models/results';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Result } from 'src/app/modules/shared/models/result';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonsComponent } from "src/app/modules/shared/components/buttons/buttons.component";
import { CalendarModule } from "primeng/calendar";

@Component({
  selector: 'app-dda',
  standalone: true,
  imports: [MockDataFormsModule, ɵInternalFormsSharedModule, ReactiveFormsModule, TranslateModule, CheckboxModule, ButtonsComponent, CalendarModule],
  templateUrl: './dda.component.html',
  styleUrl: './dda.component.scss'
})
export class DDAComponent extends BaseComponentService implements OnInit {



  //#region injectors
  private readonly DDAService = inject(DDAService)
  private readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);

  //#endregion

  //#region properties
  ddaFrom: FormGroup;
  ddaSettingData = signal<DdaDTO>(null);
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  //#endregion

  ngOnInit(): void {
    this.initForm();
    this.getLastSetting();
  }

  initForm() {
    this.ddaFrom = this.fb.group({
      ddaNo: [''],
      credit: [''],
      date: [''],
      description: [''],
      ddaNoRequired: [false],
      creditRequired: [false],
      dateRequired: [false],
      descriptionRequired: [false],
    })
  }

  fillForm() {
    if (this.ddaSettingData()) {
      this.ddaFrom.patchValue({
        ddaNo: this.ddaSettingData().ddaNo,
        credit: this.ddaSettingData().credit,
        date: this.ddaSettingData().date,
        description: this.ddaSettingData().description,
        ddaNoRequired: this.ddaSettingData().ddaNoRequired,
        creditRequired: this.ddaSettingData().creditRequired,
        dateRequired: this.ddaSettingData().dateRequired,
        descriptionRequired: this.ddaSettingData().descriptionRequired,
      })
    }
  }

  getLastSetting() {
    this.loading.startLoading()
    this.DDAService.getMine<Result<DdaDTO>>()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            let lastItem = res.entity
            this.ddaSettingData.set(lastItem)
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

    if (this.ddaFrom.invalid) return;
    this.loading.startLoading();
    const payload = {
      ...this.ddaFrom.value,
    };
    this.DDAService
      .saveMine<Result<DdaDTO>>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading()))
      .subscribe({
        next: () => { this.getLastSetting() }
      });
  }









}
