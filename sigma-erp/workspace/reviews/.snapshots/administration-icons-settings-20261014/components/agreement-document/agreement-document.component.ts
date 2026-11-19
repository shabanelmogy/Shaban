import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormGroup,
  NonNullableFormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { finalize, forkJoin, Observable } from 'rxjs';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { Results } from 'src/app/modules/shared/models/results';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { AgreementDocumentDTO } from '../../models/agreement-document';
import { AgreementDocumentService } from '../../services/agreement-document.service';

@Component({
  selector: 'app-agreement-document',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonsComponent,
    CheckboxModule,
    InputTextModule,
    DragDropModule,
  ],
  templateUrl: './agreement-document.component.html',
  styleUrl: './agreement-document.component.scss',
})
export class AgreementDocumentComponent
  extends BaseComponentService
  implements OnInit {
  //#region properties
  form: FormGroup;
  deletedIds: number[] = [];
  readonly buttons: ButtonModel[] = [
    {
      id: 'btn-save',
      text: 'general.save',
      type: 'primary',
      class: 'me-2',
      icon: 'bi bi-save',
    },
  ];
  //#endregion

  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly agreementDocumentService = inject(AgreementDocumentService);
  //#endregion

  //#region methods
  ngOnInit(): void {
    this.initForm();
    this.getAgreementDocuments();
  }

  initForm() {
    this.form = this.fb.group({
      documents: this.fb.array([]),
    });
  }

  get documents() {
    return this.form.get('documents') as FormArray;
  }

  addDocument(data?: AgreementDocumentDTO) {
    const docForm = this.fb.group({
      id: [data?.id || 0],
      subscriptionId: [data?.subscriptionId || this.subscriptionId],
      name: [data?.name || '', [Validators.required]],
      isRequired: [data?.isRequired || false],
      printWithInvoice: [data?.printWithInvoice || false],
    });
    this.documents.push(docForm);
  }

  removeDocument(index: number) {
    const id = this.documents.at(index).get('id')?.value;
    if (id > 0) {
      this.deletedIds.push(id);
    }
    this.documents.removeAt(index);
  }

  drop(event: CdkDragDrop<any[]>) {
    const fromIndex = event.previousIndex;
    const toIndex = event.currentIndex;
    if (fromIndex === toIndex) return;

    const control = this.documents.at(fromIndex);
    this.documents.removeAt(fromIndex);
    this.documents.insert(toIndex, control);
  }

  getAgreementDocuments() {
    this.loading.startLoading();
    this.agreementDocumentService
      .get<Results<AgreementDocumentDTO>>()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading())
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess && res.entities?.length > 0) {
            this.documents.clear();
            this.deletedIds = [];
            res.entities.forEach((doc) => this.addDocument(doc));
          } else if (this.documents.length === 0) {
            this.addDocument();
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
    if (this.form.invalid) {
      return;
    }
    this.loading.startLoading();

    const observables: Observable<any>[] = [];

    // Add/Update
    this.documents.controls.forEach((control) => {
      const payload = control.value;
      if (payload.id === 0) {
        observables.push(this.agreementDocumentService.post(payload));
      } else {
        observables.push(this.agreementDocumentService.put(payload));
      }
    });

    // Deletions
    this.deletedIds.forEach((id) => {
      observables.push(this.agreementDocumentService.delete(id.toString()));
    });

    if (observables.length === 0) {
      this.loading.endLoading();
      return;
    }

    forkJoin(observables)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.endLoading())
      )
      .subscribe({
        next: () => {
          this.getAgreementDocuments();
        },
      });
  }
  //#endregion
}
