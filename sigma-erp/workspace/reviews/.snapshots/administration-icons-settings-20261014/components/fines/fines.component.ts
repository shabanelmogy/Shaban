import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { FinesService } from '../../services/fines.service';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from "primeng/table";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { FinesDTO } from '../../models/fines';
import { Validators } from '@angular/forms';
import { data } from 'jquery';

@Component({
  selector: 'app-fines',
  standalone: true,
  imports: [MockDataFormsModule, ReactiveFormsModule,
    TranslateModule,
    ButtonsComponent, DropdownModule, DialogModule, TableModule],
  templateUrl: './fines.component.html',
  styleUrl: './fines.component.scss'
})
export class FinesComponent extends BaseComponentService implements OnInit {
  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly finesService = inject(FinesService);
  private dialogService = inject(DialogService);

  // private readonly enumToArrayPipe = inject(EnumToArrayPipe);
  //#endregion

  //#region properties + Signals 
  trafficFileForm: FormGroup
  finesData = signal<FinesDTO[]>([]);
  trafficFileData = signal(null);
  dialogVisible = signal<boolean>(false);
  dialogMode = signal<'create' | 'edit'>('create');
  readonly createButtons: ButtonModel[] = [
    { id: 'btn-create', text: 'settings.finesModel.createNewTrafficFile', type: 'primary', icon: 'bi bi-plus' },
  ];


  ngOnInit(): void {
    this.initForm();
    this.getItemsList();
  }

  initForm() {
    this.trafficFileForm = this.fb.group({
      fileID: ['', [Validators.required]],
      state: ['', [Validators.required]],
      rtaUserName: [''],
    })
  }

  fillForm(item?: FinesDTO) {
    if (item) {
      this.trafficFileForm.patchValue({
        fileID: item.fileID,
        state: item.state,
        rtaUserName: item.rtaUserName,
      })
    }
  }

  gettrafficFileItem(id: number) {
    this.loading.startLoading();
    this.finesService.getByIdWithNavigation<FinesDTO>(id.toString())
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: FinesDTO) => {
          this.trafficFileData.set(res);
          this.fillForm();
        },
      });
  }

  onButtonClick(buttonId: string): void {
    const actions: Record<string, () => void> = {
      'btn-create': () => this.openCreate(),
    };
    actions[buttonId]?.();
  }

  openEdit(item: FinesDTO): void {
    this.dialogMode.set('edit');
    this.fillForm(item);
    this.dialogVisible.set(true);
  }

  openCreate(): void {
    this.trafficFileForm.reset();
    this.dialogMode.set('create');
    this.trafficFileData.set(null);
    this.dialogVisible.set(true);
  }

  closeAccountDialog(): void {
    this.trafficFileForm.reset();
    this.dialogVisible.set(false);
  }

  getItemsList(): void {
    this.loading.startLoading();
    this.finesService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<FinesDTO>) => {
          if (res.isSuccess) {
            this.finesData.set(res.entities || []);
          }
        },
      });
  }

  saveTrafficFile(): void {
    if (this.trafficFileForm.invalid) return;
    this.loading.startLoading();
    const payload = {
      ...this.trafficFileForm.value,
    };
    this.finesService.post<FinesDTO>(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getItemsList();
            this.dialogVisible.set(false);
          }
        },
      });
  }

  deletefines(index: number): void {
    const item = this.finesData()[index];
    this.loading.startLoading();
    this.finesService.delete(item.id.toString())
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getItemsList();
          }
        }
      });
  }
}
