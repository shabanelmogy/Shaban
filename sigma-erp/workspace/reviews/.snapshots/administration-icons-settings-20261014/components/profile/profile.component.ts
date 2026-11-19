import { MockDataFormsModule } from 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/modules/shared/components/buttons/buttons.component';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { BaseComponentService } from 'src/app/modules/shared/service/base-component.service';
import { ButtonModel } from 'src/app/modules/shared/models/button-model';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsProfileModelService } from '../../services/profile.service';
import { ProfileDTO } from '../../models/profile';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';
import { Results } from 'src/app/modules/shared/models/results';
import { Result } from 'src/app/modules/shared/models/result';
import { FileUploadService } from 'src/app/modules/shared/service/file-upload.service';
import { environment } from 'src/environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { EditProfileDialogComponent } from 'src/app/modules/shared/interceptores/error.interceptor';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MockDataFormsModule,
    CommonModule,
    TranslateModule,
    ButtonsComponent,
    ReactiveFormsModule,
    FileUploadModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends BaseComponentService {
  //#region properties
  profileForm: FormGroup;
  readonly buttons: ButtonModel[] = [
    { id: 'btn-save', text: 'general.save', type: 'primary', class: 'me-2', icon: 'bi bi-save' },
  ];
  private isNew = true;
  baseUrl = environment.baseUrl;
  //#endregion

  //#region injectors
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly profileService = inject(SettingsProfileModelService);
  private fileService = inject(FileUploadService);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);

  //#endregion

  //#region methods
  ngOnInit(): void {
    this.initForm();
    this.getProfileSettings();
  }

  initForm() {
    this.profileForm = this.fb.group({
      id: [0],
      letterHeadPath: ['', Validators.required],
      logoPath: ['', Validators.required],
    });
  }

  getProfileSettings() {
    this.loading.startLoading();
    this.profileService.get()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res: Results<ProfileDTO>) => {
          if (res.isSuccess && res.entities?.[0]) {
            const data = res.entities[0];
            this.profileForm.patchValue(data);
            this.isNew = false;
          } else {
            this.isNew = true;
          }
        },
      });
  }

  uploadFiles(files: File[], controlName: string, event: any) {
    this.loading.startLoading();

    const uploadRequest = files.map((file: File) =>
      this.fileService.uploadFile('settings-profile', file)
    );

    forkJoin(uploadRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results: string[]) => {
          const validPaths = results.filter(p =>
            p &&
            !p.startsWith('Upload failed') &&
            !p.startsWith('Invalid') &&
            !p.startsWith('File too large')
          );

          const path = validPaths[0] ?? '';

          this.profileForm.patchValue({
            [controlName]: path
          });

          this.loading.endLoading();

          event.options?.clear && event.options.clear();
        },
      });

  }

  uploadLogo(event: any) {
    this.uploadFiles(event.files, 'logoPath', event);
  }

  uploadLetterHead(event: any) {
    this.uploadFiles(event.files, 'letterHeadPath', event);
  }

  clearControl(controlName: string, fileUpload?: FileUpload) {
    this.profileForm.get(controlName)?.setValue(null);
    fileUpload?.clear();
  }


  onButtonClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      'btn-save': () => this.save(),
    };
    actions[buttonId]?.();
  }

  save() {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((key, index) => {
        const control = this.profileForm.get(key);
        if (control && control.invalid) {
          const message = this.translateService.instant('settings.profileModel.errorInField', { key });
          const header = this.translateService.instant('settings.profileModel.errorHeader');
          this.dialogService.open(EditProfileDialogComponent, {
            header: header,
            width: '600px',
            data: {
              message: message,
            },
          });
        }
      });
      return;
    }

    this.loading.startLoading();
    const payload = this.profileForm.getRawValue() as ProfileDTO;
    payload.subscriptionId = this.subscriptionId;

    const request$ = this.isNew
      ? this.profileService.post(payload)
      : this.profileService.put(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.endLoading()))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.getProfileSettings();
          }
        },
      });
  }
  //#endregion
}
