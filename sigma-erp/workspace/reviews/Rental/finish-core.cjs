const fs = require('fs');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental';
const read = file => fs.readFileSync(`${root}/${file}`, 'utf8').replace(/\r\n/g, '\n');
const write = (file, text) => fs.writeFileSync(`${root}/${file}`, text);
function method(text, name, replacement) {
  const regex = new RegExp(`^  (?:private |public |async )*${name}\\([^]*?^  \\}`, 'm');
  if (!regex.test(text)) throw new Error(`Missing ${name}`);
  return text.replace(regex, replacement);
}
const imports = `import { CalendarModule } from 'primeng/calendar';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { FormSectionComponent } from 'src/app/modules/shared/components/form-section/form-section.component';
import { dateValueValidator, toApiDate, formatDisplayDate } from 'src/app/modules/shared/utils/date-utils';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
`;
for (const file of ['MasterAgreement/components/create/create.component.ts', 'RentalQuotation/components/master-agreement-dialog/master-agreement-dialog.component.ts']) {
  const routed = file.startsWith('MasterAgreement');
  let text = imports + read(file);
  text = text.replace("import { DialogModule } from 'primeng/dialog';\n", "import { EditorDialogComponent } from 'src/app/modules/shared/components/editor-dialog/editor-dialog.component';\n");
  text = text.replace('  ViewEncapsulation,\n', '').replace('  encapsulation: ViewEncapsulation.None,\n', '');
  text = text.replace("import { MessageService } from 'primeng/api';\n", '').replace('  private readonly messageService = inject(MessageService);\n', '');
  text = text.replace('imports: [CommonModule', 'imports: [CalendarModule, DatePickerDirective, FieldErrorComponent, StateMessageComponent, FormSectionComponent, CommonModule').replace('TranslateModule, DialogModule]', 'TranslateModule, EditorDialogComponent]');
  text = text.replace("startDate: ['', Validators.required]", "startDate: this.fb.control<Date | string | null>(null, [Validators.required, dateValueValidator])").replace("endDate: ['', Validators.required]", "endDate: this.fb.control<Date | string | null>(null, [Validators.required, dateValueValidator])");
  text = text.replace(/function dateOrderValidator\([^]*?\n}/, `function dateOrderValidator(control: AbstractControl): ValidationErrors | null {
  const start = toApiDate(control.get('startDate')?.value);
  const end = toApiDate(control.get('endDate')?.value);
  return start && end && start > end ? { dateOrder: true } : null;
}`);
  text = text.replace('    const payload: RentalMasterAgreementCreateDTO = {', `    const startDate = toApiDate(value.startDate);
    const endDate = toApiDate(value.endDate);
    if (!startDate || !endDate) return;
    const payload: RentalMasterAgreementCreateDTO = {`);
  text = text.replace('startDate: value.startDate,', 'startDate,').replace('endDate: value.endDate,', 'endDate,');
  text = text.replace('this.toInputDate(result.entity.date)', "toApiDate(result.entity.date) ? new Date(toApiDate(result.entity.date)! + 'T00:00:00') : null");
  text = method(text, 'toInputDate', '');
  text = method(text, 'errorMessageFrom', '');
  text = text.replaceAll('this.errorMessageFrom(', 'apiErrorMessage(');
  text = method(text, 'showError', `  private showError(messageOrKey: string): void {
    ${routed ? 'this.saveError' : 'this.errorMessage'}.set(messageOrKey);
  }`);
  if (routed) {
    text = text.replace('  standalone: true,', "  standalone: true,\n  host: { class: 'sigma-route-host' },");
    text = text.replace("import { finalize } from 'rxjs';", "import { Observable, finalize, of, tap } from 'rxjs';\nimport { ConfirmationDialogService } from 'src/app/modules/shared/service/confirmation-dialog.service';");
    text = text.replace('  readonly loadError = signal', "  private readonly confirmation = inject(ConfirmationDialogService);\n  private allowNavigation = false;\n  readonly closeConfirmationPending = signal(false);\n  readonly saveError = signal('');\n  readonly loadError = signal");
    text = text.replace('this.viewMode() || this.submitting()', 'this.viewMode() || this.submitting() || this.loadingQuotation() || this.closeConfirmationPending()');
    text = text.replace('    this.submitting.set(true);', "    this.saveError.set('');\n    this.form.disable({ emitEvent: false });\n    this.submitting.set(true);");
    text = text.replace('          this.submitting.set(false);', '          this.submitting.set(false);\n          this.form.enable({ emitEvent: false });');
    text = text.replace("          void this.router.navigate(['/MasterAgreement']);", "          this.allowNavigation = true;\n          this.form.markAsPristine();\n          queueMicrotask(() => this.cancel());");
    text = method(text, 'formatDateOnly', `  formatDateOnly(value: string | null | undefined): string {
    return formatDisplayDate(value);
  }`);
    text = text.replace('  cancel(): void {', `  canDeactivate(): boolean | Observable<boolean> {
    if (this.allowNavigation) return true;
    if (this.submitting() || this.loadingQuotation() || this.closeConfirmationPending()) return false;
    if (this.viewMode() || this.form.pristine) return true;
    this.closeConfirmationPending.set(true);
    return this.confirmation.confirmDiscard('masterAgreement').pipe(
      tap(confirmed => { if (confirmed) this.allowNavigation = true; }),
      finalize(() => this.closeConfirmationPending.set(false)),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  retryLoad(): void {
    const id = this.viewMode() ? Number(this.route.snapshot.paramMap.get('id')) : this.quotationId();
    if (!id || this.loadingAgreement() || this.loadingQuotation()) return;
    this.loadError.set('');
    this.saveError.set('');
    if (this.viewMode()) this.loadAgreement(id); else this.loadQuotation(id);
  }

  cancel(): void {`);
    text = text.replace("          this.showError('masterAgreement.errors.quotationRequired');", "          this.loadError.set('masterAgreement.errors.quotationRequired');");
    text = text.replace("            this.showError(result.message || 'masterAgreement.errors.quotation');", "            this.loadError.set(result.message || 'masterAgreement.errors.quotation');");
    text = text.replace("error: (error) => this.showError(apiErrorMessage(error, 'masterAgreement.errors.quotation'))", "error: (error) => this.loadError.set(apiErrorMessage(error, 'masterAgreement.errors.quotation'))");
    text = text.replace('          this.form.patchValue({', '          this.form.reset({');
  } else {
    text = text.replace('  readonly loading = signal', "  readonly errorMessage = signal('');\n  readonly loading = signal");
    text = text.replace('if (this.submitting() || this.loading()) return;', 'if (this.submitting() || this.loading() || this.closeConfirmationPending()) return;');
    text = text.replace('    this.submitting.set(true);', "    this.errorMessage.set('');\n    this.form.disable({ emitEvent: false });\n    this.submitting.set(true);");
    text = text.replace('finalize(() => this.submitting.set(false))', 'finalize(() => { this.submitting.set(false); this.form.enable({ emitEvent: false }); })');
    text = text.replace('if (confirmed) this.finishClose();', 'if (confirmed && !this.submitting()) this.finishClose();');
    text = text.replace('    this.loading.set(true);', "    this.errorMessage.set('');\n    this.loading.set(true);");
    text = text.replace('  private loadQuotation(id: number): void {', '  loadQuotation(id: number): void {');
  }
  write(file, text);
}
const fields = prefix => `
  <div class="sigma-field">
    <label class="required" for="${prefix}-start">{{ 'masterAgreement.startDate' | translate }}</label>
    <p-calendar appDatePicker [dateInputMask]="true" placeholder="dd/mm/yyyy" inputId="${prefix}-start" formControlName="startDate" />
    <app-field-error [control]="form.controls.startDate" />
  </div>
  <div class="sigma-field">
    <label class="required" for="${prefix}-end">{{ 'masterAgreement.endDate' | translate }}</label>
    <p-calendar appDatePicker [dateInputMask]="true" placeholder="dd/mm/yyyy" inputId="${prefix}-end" formControlName="endDate" />
    <app-field-error [control]="form.controls.endDate" />
  </div>
  @if (form.hasError('dateOrder') && (form.touched || form.dirty)) { <app-field-error message="masterAgreement.validation.dateOrder" /> }
  <div class="sigma-field sigma-field--full">
    <label for="${prefix}-notes">{{ 'masterAgreement.notes' | translate }}</label>
    <textarea id="${prefix}-notes" rows="3" maxlength="2000" formControlName="notes"></textarea>
    <app-field-error [control]="form.controls.notes" />
  </div>`;
const context = `<div class="sigma-field"><label>{{ 'masterAgreement.quotationNo' | translate }}</label><span class="sigma-field__read">{{ quotation()?.no || '' }}</span></div>
  <div class="sigma-field"><label>{{ 'masterAgreement.quotationDate' | translate }}</label><span class="sigma-field__read">{{ quotation()?.date | date:'dd/MM/yyyy' }}</span></div>
  <div class="sigma-field"><label>{{ 'masterAgreement.customer' | translate }}</label><span class="sigma-field__read">{{ quotation()?.customerName || '' }}</span></div>`;
write('RentalQuotation/components/master-agreement-dialog/master-agreement-dialog.component.html', `<app-editor-dialog [visible]="visible" [title]="'masterAgreement.createTitle' | translate" [subtitle]="quotation()?.no || ''"
  icon="bi bi-file-earmark-plus" width="680px" [contentPadded]="true" [focusOnShow]="false" mode="create"
  [saving]="submitting()" [closeDisabled]="submitting() || closeConfirmationPending()"
  [primaryActionDisabled]="loading() || submitting() || closeConfirmationPending() || !quotation()"
  [closeLabel]="'general.close' | translate" [cancelLabel]="'general.cancel' | translate" [saveLabel]="'general.save' | translate"
  (closeRequested)="close()" (escapeRequested)="close()" (saveRequested)="submit()">
  @if (loading()) { <app-state-message kind="loading" message="rentalQuotation.loading" /> }
  @else {
    @if (errorMessage()) {
      <app-state-message kind="error" [message]="errorMessage()" />
      @if (!quotation() && quotationId) { <button type="button" class="sigma-secondary-button" (click)="loadQuotation(quotationId)">{{ 'general.retry' | translate }}</button> }
    }
    @if (quotation()) {
      <form [formGroup]="form" class="sigma-editor-grid" style="--sigma-editor-columns: 2" (ngSubmit)="submit()" novalidate>
        ${context}
        ${fields('rental-master-dialog')}
      </form>
    }
  }
</app-editor-dialog>
`);
write('RentalQuotation/components/master-agreement-dialog/master-agreement-dialog.component.scss', '/* Shared dialog and field owners. */\n');
let file = 'RentalQuotation/components/rejection-dialog/rejection-dialog.component.ts';
let text = read(file).replace("import { DialogModule } from 'primeng/dialog';", "import { EditorDialogComponent } from 'src/app/modules/shared/components/editor-dialog/editor-dialog.component';\nimport { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';");
text = text.replace('  ViewEncapsulation,\n', '').replace('  encapsulation: ViewEncapsulation.None,\n', '').replace('TranslateModule, DialogModule]', 'TranslateModule, EditorDialogComponent, FieldErrorComponent]');
text = text.replace('if (confirmed) this.finishClose();', 'if (confirmed && !this.submitting) this.finishClose();');
text = text.replace("    if (changes['visible']?.currentValue === true) this.form.reset();", "    if (changes['visible']?.currentValue === true) this.form.reset();\n    if (this.submitting || this.closeConfirmationPending()) this.form.disable({ emitEvent: false });\n    else this.form.enable({ emitEvent: false });");
write(file, text);
write('RentalQuotation/components/rejection-dialog/rejection-dialog.component.html', `<app-editor-dialog [visible]="visible" [title]="'rentalQuotation.rejection.title' | translate"
  [subtitle]="'rentalQuotation.rejection.prompt' | translate: { no: quotationNo }" icon="bi bi-x-circle" width="520px"
  mode="edit" [contentPadded]="true" [focusOnShow]="false" [saving]="submitting"
  [closeDisabled]="submitting || closeConfirmationPending()" [primaryActionDisabled]="submitting || closeConfirmationPending()"
  [closeLabel]="'general.close' | translate" [cancelLabel]="'general.cancel' | translate" [saveLabel]="'rentalQuotation.actions.reject' | translate"
  (closeRequested)="close()" (escapeRequested)="close()" (saveRequested)="submit()">
  <form [formGroup]="form" class="sigma-editor-grid" (ngSubmit)="submit()">
    <div class="sigma-field sigma-field--full">
      <label class="required" for="rentalQuotationRejectionReason">{{ 'rentalQuotation.rejection.reason' | translate }}</label>
      <textarea id="rentalQuotationRejectionReason" formControlName="reason" rows="5" maxlength="500"></textarea>
      <app-field-error [control]="form.controls.reason" [messages]="{ required: 'rentalQuotation.validation.reasonRequired', minlength: 'rentalQuotation.validation.reasonMinLength' }" />
      <span>{{ form.controls.reason.value.length }} / 500</span>
    </div>
  </form>
</app-editor-dialog>
`);
write('RentalQuotation/components/rejection-dialog/rejection-dialog.component.scss', '/* Shared dialog and field owners. */\n');
file = 'MasterAgreement/components/create/create.component.html';
const source = read(file);
let view = source.slice(source.indexOf('          <section'), source.indexOf('          </div>\n        }'));
view = view.replace(/<section class="master-agreement-detail-section" aria-labelledby="[^"]+">\s*<h2[^>]*>{{ '([^']+)' \| translate }}<\/h2>/g, '<app-form-section title="$1" icon="bi bi-file-earmark-text" density="compact">').replaceAll('</section>', '</app-form-section>');
view = view.replaceAll('class="master-agreement-detail-grid"', 'class="sigma-editor-grid"').replaceAll('class="master-agreement-detail-field"', 'class="sigma-field"').replaceAll('class="master-agreement-detail-label"', '').replaceAll('<span >', '<label>').replaceAll('</span>', '</label>');
view = view.replaceAll('<strong', '<span class="sigma-field__read"').replaceAll('</strong>', '</span>');
view = view.replace(/\s+class="master-agreement-status"\s+\[class.is-approved\][^]*?\[class.is-pending\]="[^"]+"/, '');
view = view.replace('class="master-agreement-notes"', 'class="sigma-field__read"');
write(file, `<section class="sigma-editor-page">
  <div class="sigma-editor-panel">
    <app-feature-title [title]="(viewMode() ? 'masterAgreement.detailTitle' : 'masterAgreement.createTitle') | translate"
      [subtitle]="viewMode() ? agreementNo() : ('masterAgreement.createSubtitle' | translate)" icon="bi bi-file-earmark-text">
      <button feature-title-leading type="button" class="sigma-secondary-button sigma-icon-button" [disabled]="submitting() || closeConfirmationPending()" [attr.aria-label]="'general.back' | translate" (click)="cancel()"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
    </app-feature-title>
    @if (loadingQuotation() || loadingAgreement()) { <app-state-message kind="loading" message="masterAgreement.loading" /> }
    @else if (loadError()) {
      <app-state-message kind="error" [message]="loadError()" />
      <button type="button" class="sigma-secondary-button" (click)="retryLoad()">{{ 'general.retry' | translate }}</button>
    } @else if (viewMode()) {
      @if (agreement(); as detail) { <div class="sigma-editor-body"><div class="sigma-editor-scroll">${view}</div></div> }
    } @else {
      <form class="sigma-editor-form" [formGroup]="form" (ngSubmit)="save()" novalidate>
        @if (saveError()) { <app-state-message kind="error" [message]="saveError()" /> }
        <div class="sigma-editor-body"><div class="sigma-editor-scroll">
          <app-form-section title="masterAgreement.quotationContext" icon="bi bi-file-earmark-text" density="compact"><div class="sigma-editor-grid">${context}</div></app-form-section>
          <app-form-section title="masterAgreement.details" icon="bi bi-card-checklist" density="compact"><div class="sigma-editor-grid">${fields('rental-master')}</div></app-form-section>
        </div></div>
        <footer class="sigma-editor-footer">
          <button type="button" class="sigma-secondary-button" [disabled]="submitting() || closeConfirmationPending()" (click)="cancel()">{{ 'general.cancel' | translate }}</button>
          <app-primary-action-button type="submit" [label]="'general.save' | translate" icon="bi bi-check2" [loading]="submitting()" [disabled]="loadingQuotation() || closeConfirmationPending() || !quotation()" />
        </footer>
      </form>
    }
  </div>
</section>
`);
write('MasterAgreement/components/create/create.component.scss', '/* Shared routed editor, sections and fields. */\n');
file = 'MasterAgreement/masteragreement.routes.ts';
text = read(file).replace("import { Routes }", "import { CanDeactivateFn, Routes }");
text = text.replace('export const MasterAgreementRoutes', 'const preventUnsavedExit: CanDeactivateFn<CreateComponent> = component => component.canDeactivate();\n\nexport const MasterAgreementRoutes').replaceAll('component: CreateComponent,', 'component: CreateComponent, canDeactivate: [preventUnsavedExit],');
write(file, text);
file = 'RentalQuotation/components/details/details.component.ts';
text = read(file);
text = text.replace("Observable, finalize, forkJoin, of", "Observable, finalize, forkJoin, of, tap");
text = method(text, 'requestClose', `  canDeactivate(): boolean | Observable<boolean> {
    if (this.saving() || this.loadingPage() || this.closeConfirmationPending() || this.lineRows.confirmationPending()) return false;
    if (this.form.pristine || this.isView()) return true;
    this.closeConfirmationPending.set(true);
    return this.confirmationDialog.confirm({ severity: 'warning', title: { key: 'rentalQuotation.unsaved.title' }, message: { key: 'rentalQuotation.unsaved.message' }, confirmLabel: { key: 'rentalQuotation.unsaved.discard' }, cancelLabel: { key: 'general.cancel' } }).pipe(
      tap(confirmed => { if (confirmed) this.form.markAsPristine(); }),
      finalize(() => this.closeConfirmationPending.set(false)),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  requestClose(): void { this.leave(); }`);
write(file, text);
file = 'RentalQuotation/rentalquotation.routes.ts';
text = read(file).replace("import { Routes }", "import { CanDeactivateFn, Routes }");
text = text.replace('export const RentalQuotation_Routes', 'const preventUnsavedExit: CanDeactivateFn<DetailsComponent> = component => component.canDeactivate();\n\nexport const RentalQuotation_Routes').replaceAll('component: DetailsComponent,', 'component: DetailsComponent, canDeactivate: [preventUnsavedExit],');
write(file, text);
