const fs = require('fs');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental';
const read = file => fs.readFileSync(`${root}/${file}`, 'utf8').replace(/\r\n/g, '\n');
const write = (file, text) => fs.writeFileSync(`${root}/${file}`, text);
function method(text, name, replacement) {
  const regex = new RegExp(`^  (?:private |public |async )*${name}\\([^]*?^  \\}`, 'm');
  if (!regex.test(text)) throw new Error(`Missing ${name}`);
  return text.replace(regex, replacement);
}
// Single failure owner in typed editors/dialogs; existing list-only domain actions retain interceptor ownership.
let file = 'Agreement/services/agreement.service.ts';
let text = read(file).replace('  private readonly endpoint =', "  private readonly inlineOptions = { headers: new HttpHeaders().set('X-Skip-Error-Interceptor', 'true') };\n  private readonly endpoint =");
text = text.replace('{ params },', '{ params, ...this.inlineOptions },');
text = text.replace('this.http.post<Result<null>>(this.endpoint, payload)', 'this.http.post<Result<null>>(this.endpoint, payload, this.inlineOptions)').replace('this.http.put<Result<null>>(this.endpoint, payload)', 'this.http.put<Result<null>>(this.endpoint, payload, this.inlineOptions)');
for (const endpoint of ['discounts', 'billing-history', 'logs', 'delivery-date-context']) text = text.replace('`${this.endpoint}/${id}/' + endpoint + '`,\n', '`${this.endpoint}/${id}/' + endpoint + '`, this.inlineOptions,\n');
text = text.replace('this.http.post<Result<null>>(`${this.endpoint}/${id}/void`, payload)', 'this.http.post<Result<null>>(`${this.endpoint}/${id}/void`, payload, this.inlineOptions)');
for (const endpoint of ['delivery-date', 'sales-person']) text = text.replace('`${this.endpoint}/${id}/' + endpoint + '`,\n      payload,', '`${this.endpoint}/${id}/' + endpoint + '`,\n      payload, this.inlineOptions,');
text = text.replace('    payload: RentalAgreementDepositCreateDTO,\n', '    payload: RentalAgreementDepositCreateDTO,\n    options?: { skipSuccessToast?: boolean },\n');
text = text.replace('this.http.post<Result<null>>(`${this.endpoint}/${id}/deposit`, payload)', `this.http.post<Result<null>>(
      \`\${this.endpoint}/\${id}/deposit\`, payload,
      { headers: this.inlineOptions.headers.set('X-Skip-Success-Toast', String(!!options?.skipSuccessToast)) },
    )`);
text = text.replace('  private buildListParams(', `  getDepositPaymentMethod(id: number): Observable<Result<import('../models/deposits').RentalAgreementDepositPaymentMethodDetails>> {
    return this.http.get<Result<import('../models/deposits').RentalAgreementDepositPaymentMethodDetails>>(
      \`\${environment.baseUrl}PaymentMethod/GetById/\${id}\`, this.inlineOptions,
    );
  }

  private buildListParams(`);
write(file, text);
file = 'Booking/services/booking.service.ts';
text = read(file).replace('  private readonly endpoint =', "  private readonly inlineOptions = { headers: new HttpHeaders().set('X-Skip-Error-Interceptor', 'true') };\n  private readonly endpoint =");
text = text.replace('`${this.endpoint}/GetByWithNavigationsId/${id}`,', '`${this.endpoint}/GetByWithNavigationsId/${id}`, this.inlineOptions,').replace('{ params },', '{ params, ...this.inlineOptions },');
text = text.replaceAll("options?.skipSuccessToast ? { headers: { 'X-Skip-Success-Toast': 'true' } } : {}", "{ headers: this.inlineOptions.headers.set('X-Skip-Success-Toast', String(!!options?.skipSuccessToast)) }");
for (const endpoint of ['history', 'journal']) text = text.replace('`${this.endpoint}/${id}/' + endpoint + '`)', '`${this.endpoint}/${id}/' + endpoint + '`, this.inlineOptions)');
text = text.replace('`${this.endpoint}/${id}/deposit`, payload)', '`${this.endpoint}/${id}/deposit`, payload, this.inlineOptions)');
write(file, text);
file = 'Booking/components/details/details.component.ts';
text = read(file).replace('result.message || null', "result.message || this.translate.instant('rentalBooking.saveSuccess')");
write(file, text);
file = 'Booking/components/details/details.component.html';
text = read(file).replace('optionLabel="label"\n                            optionLabel="value"', 'optionLabel="label"');
text = text.replace(/<div class="booking-alert is-error"[^]*?<\/div>/, '<app-state-message kind="error" [message]="saveError()" />');
text = text.replace(' maxHeight="clamp(180px, calc(100dvh - 320px), 620px)"', ' [stickyHeader]="true"');
write(file, text);
file = 'Agreement/components/details/details.component.scss';
text = read(file);
text = text.slice(0, text.indexOf('\n@media (min-width: 992px)'));
text = text.replace(' .agreement-print-only', ' .rental-agreement-print-only').replaceAll('.rental-agreement-editor-page', '.sigma-editor-page').replaceAll('.rental-agreement-editor-card', '.sigma-editor-panel');
write(file, text);
file = 'Agreement/components/documents/documents.component.html';
text = read(file).replaceAll('[closeDisabled]="uploadingDocumentId() !== null"', '[closeDisabled]="uploadingDocumentId() !== null || closeConfirmationPending()"').replace('[primaryActionDisabled]="!selectedFile.value"', '[primaryActionDisabled]="!selectedFile.value || closeConfirmationPending()"');
text = text.replace('[title]="\'rentalAgreement.documents.uploadTitle\' | translate"', '[title]="\'rentalAgreement.documents.uploadTitle\' | translate"\n        [subtitle]="document.name"');
write(file, text);
file = 'Booking/components/deposit/deposit.component.ts';
text = `import { CalendarModule } from 'primeng/calendar';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { NumericFocusDirective } from 'src/app/modules/shared/directives/numeric-focus.directive';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { dateValueValidator, monthValueValidator, parseMonthValue, toApiDate } from 'src/app/modules/shared/utils/date-utils';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
` + read(file);
text = text.replace('imports: [CommonModule', 'imports: [CalendarModule, DatePickerDirective, NumericFocusDirective, FieldErrorComponent, StateMessageComponent, CommonModule');
text = text.replace('  readonly saving =', '  readonly closeConfirmationPending = signal(false);\n  readonly saving =');
text = text.replace('this.fb.nonNullable.control(this.today(), Validators.required)', 'this.fb.control<Date | string | null>(new Date(), [Validators.required, dateValueValidator])');
text = text.replace("expiry: this.fb.nonNullable.control('')", 'expiry: this.fb.control<Date | string | null>(null, monthValueValidator)');
text = text.replace('this.form.invalid || this.saving()', 'this.form.invalid || this.saving() || this.closeConfirmationPending()');
text = text.replace('date: value.date,', 'date: toApiDate(value.date)!,');
text = text.replace('    this.saving.set(true);', '    this.form.disable({ emitEvent: false });\n    this.saving.set(true);');
text = text.replace('finalize(() => this.saving.set(false))', 'finalize(() => { this.saving.set(false); this.form.enable({ emitEvent: false }); })');
text = text.replace('if (this.saving()) return;', 'if (this.saving() || this.closeConfirmationPending()) return;').replace('    this.confirmationDialog.confirm({', '    this.closeConfirmationPending.set(true);\n    this.confirmationDialog.confirm({');
text = text.replace('.pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe((confirmed)', '.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.closeConfirmationPending.set(false)))\n      .subscribe((confirmed)').replace('if (confirmed) this.closed.emit(false);', 'if (confirmed && !this.saving()) this.closed.emit(false);');
text = text.replace("this.form.controls.expiry.reset('',", 'this.form.controls.expiry.reset(null,');
text = method(text, 'cardExpiryDate', `  private cardExpiryDate(value: Date | string | null): string | null {
    const monthValue = parseMonthValue(value);
    if (!monthValue) return null;
    const [year, month] = monthValue.split('-').map(Number);
    const date = new Date(0);
    date.setFullYear(year, month, 0);
    return toApiDate(date);
  }`);
text = method(text, 'extractError', '').replaceAll('this.extractError(', 'apiErrorMessage(');
text = method(text, 'today', '');
write(file, text);
file = 'Booking/components/deposit/deposit.component.html';
text = read(file).replace('[closeDisabled]="saving()"', '[closeDisabled]="saving() || closeConfirmationPending()"').replace('[primaryActionDisabled]="form.invalid"', '[primaryActionDisabled]="saving() || closeConfirmationPending()"');
text = text.replace('  width="900px"', '  width="900px" [contentPadded]="true" [focusOnShow]="false"');
text = text.replace(/<div class="booking-deposit-alert"[^]*?<\/div>/, '<app-state-message kind="error" [message]="errorMessage()" />');
text = text.replace('class="booking-deposit-grid"', 'class="sigma-editor-grid"').replace('class="booking-deposit-field span-2"', 'class="sigma-field sigma-field--full"').replace('class="booking-deposit-field"', 'class="sigma-field"');
text = text.replace('<input id="booking-deposit-date" type="date" formControlName="date" />', '<p-calendar appDatePicker [dateInputMask]="true" placeholder="dd/mm/yyyy" inputId="booking-deposit-date" formControlName="date" />');
text = text.replace('<input id="booking-deposit-expiry" type="month" formControlName="expiry" />', '<p-calendar appDatePicker [dateInputMask]="true" placeholder="mm/yyyy" view="month" dateFormat="mm/yy" inputId="booking-deposit-expiry" formControlName="expiry" />');
text = text.replace(/<input([^>]*type="number"[^>]*)\/>/g, '<input appNumericFocus$1/>');
text = text.replace(/(<(?:input|p-dropdown|p-calendar|textarea)[^>]*formControlName="(\w+)"[^>]*(?:\/>|><\/(?:p-dropdown|textarea)>))/g, '$1\n        <app-field-error [control]="form.controls.$2" />');
write(file, text);
write('Booking/components/deposit/deposit.component.scss', '/* Shared dialog, fields, states and numeric input. */\n');
// Delivery date remains date-only and bounded by the persisted agreement end date.
file = 'Agreement/components/delivery-date/delivery-date.component.ts';
text = `import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { dateValueValidator, toApiDate } from 'src/app/modules/shared/utils/date-utils';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
` + read(file);
text = text.replace('  imports: [', '  imports: [DatePickerDirective, FieldErrorComponent, StateMessageComponent,');
text = text.replace('this.fb.control<Date | null>(null, Validators.required)', 'this.fb.control<Date | string | null>(null, [Validators.required, dateValueValidator])');
text = text.replace('const deliveryDate = this.form.controls.deliveryDate.value;', 'const deliveryDate = toApiDate(this.form.controls.deliveryDate.value);').replace('!deliveryDate || Number.isNaN(deliveryDate.getTime())', "!deliveryDate || (this.endDate() && deliveryDate > toApiDate(this.endDate())!)").replace('deliveryDate: this.toApiDate(deliveryDate)', 'deliveryDate');
text = text.replace('this.parseLocalDate(result.entity.deliveryDate)', "toApiDate(result.entity.deliveryDate) ? new Date(toApiDate(result.entity.deliveryDate)! + 'T00:00:00') : null").replace('this.parseLocalDate(result.entity.endDate)', "toApiDate(result.entity.endDate) ? new Date(toApiDate(result.entity.endDate)! + 'T00:00:00') : null");
for (const name of ['parseLocalDate', 'toApiDate', 'extractErrorMessage']) text = method(text, name, '');
text = text.replace('this.extractErrorMessage(error)', "apiErrorMessage(error, 'rentalAgreement.deliveryDate.errors.save')").replaceAll('this.extractErrorMessage(', 'apiErrorMessage(');
text = text.replace('    this.saving.set(true);', '    this.form.disable({ emitEvent: false });\n    this.saving.set(true);').replace('finalize(() => this.saving.set(false))', 'finalize(() => { this.saving.set(false); this.form.enable({ emitEvent: false }); })');
write(file, text);
file = 'Agreement/components/delivery-date/delivery-date.component.html';
text = read(file).replace('  [focusOnShow]', '  [contentPadded]="true"\n  [focusOnShow]').replace('class="rental-agreement-delivery-date"', 'class="sigma-editor-grid"').replace('class="rental-agreement-delivery-date__fields"', 'class="sigma-editor-grid sigma-field--full"').replace('class="rental-agreement-delivery-date__field"', 'class="sigma-field"').replace('class="rental-agreement-delivery-date__readonly"', 'class="sigma-field__read"');
text = text.replace(/<div class="rental-agreement-delivery-date__message[^]*?<\/div>/g, match => match.includes('role="alert"') ? '<app-state-message kind="error" [message]="errorMessage()" />' : '<app-state-message kind="loading" message="rentalAgreement.deliveryDate.loading" />');
text = text.replace('<p-calendar', '<p-calendar appDatePicker [dateInputMask]="true" placeholder="dd/mm/yyyy"').replace('          [showIcon]="true"\n', '').replace('          [showOnFocus]="true"\n', '').replace('[readonlyInput]="true"', '[readonlyInput]="false" [keepInvalid]="true"');
text = text.replace(/@if \(form.controls.deliveryDate.touched[^]*?<\/small>\s*}/, '<app-field-error [control]="form.controls.deliveryDate" />');
write(file, text); write('Agreement/components/delivery-date/delivery-date.component.scss', '/* Shared dialog, date, field and state owners. */\n');
// Deposit uploads use the existing editor-scoped tracker. Removed/replaced pending files are cleaned after Save/discard.
file = 'Agreement/components/deposit/deposit.component.ts';
text = `import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { NumericFocusDirective } from 'src/app/modules/shared/directives/numeric-focus.directive';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { FileFieldComponent } from 'src/app/modules/shared/components/file-field/file-field.component';
import { DocumentUploadTracker } from 'src/app/modules/shared/service/document-upload-tracker.service';
import { EditableRows } from 'src/app/modules/shared/utils/editable-rows';
import { dateValueValidator, dateTimeValueValidator, toApiDate, toApiDateTime } from 'src/app/modules/shared/utils/date-utils';
import { apiErrorMessage } from 'src/app/modules/shared/utils/api-error';
` + read(file);
text = text.replace("import { FileUploadService } from 'src/app/modules/shared/service/file-upload.service';\n", '');
text = text.replace('  standalone: true,', '  standalone: true,\n  providers: [DocumentUploadTracker],').replace('  imports: [', '  imports: [CalendarModule, DatePickerDirective, NumericFocusDirective, FieldErrorComponent, StateMessageComponent, FileFieldComponent,');
text = text.replace('documentPath: FormControl<string>;', 'documentPath: FormControl<string | null>;').replace('date: FormControl<string>;', 'date: FormControl<Date | string | null>;').replace('expiry: FormControl<string | null>;', 'expiry: FormControl<Date | string | null>;');
text = text.replace(/  private static readonly allowedExtensions[^]*?\n\n/, '');
text = text.replace('  private readonly fileUploadService = inject(FileUploadService);', '  readonly uploads = inject(DocumentUploadTracker);\n  private readonly messages = inject(MessageService);');
text = text.replace('  readonly uploadingDocumentIndex = signal<number | null>(null);\n  readonly documentCleanupRunning = signal(false);', "  readonly cleanupKind = signal<'save' | 'discard' | null>(null);\n  private savedPrint = false;\n  private savedMessage = '';");
text = text.replace('this.uploadingDocumentIndex() !== null', 'this.uploads.uploading() !== null').replace('this.documentCleanupRunning()', 'this.uploads.cleaning() || this.cleanupKind() !== null');
text = text.replace('  private readonly pendingDocumentPaths = new Set<string>();', `  readonly documentRows = new EditableRows<FormGroup<DepositDocumentFormControls>>({
    array: this.depositForm.controls.documents, parent: this.depositForm,
    confirmation: this.confirmationDialog, destroyRef: this.destroyRef,
    removeTitle: 'rentalBooking.confirmations.removeDocument.title', removeMessage: 'rentalBooking.confirmations.removeDocument.message',
    canMutate: () => !this.editorLocked(),
  });`);
// Form must be initialized before the helper it owns.
const helperStart = text.indexOf('  readonly documentRows =');
const helperEnd = text.indexOf('\n  });', helperStart) + '\n  });'.length;
const helper = text.slice(helperStart, helperEnd);
text = text.slice(0, helperStart) + text.slice(helperEnd);
text = text.replace('  ngOnInit(): void {', helper + '\n\n  ngOnInit(): void {');
text = text.replace('      || this.closeConfirmationPending(),', '      || this.closeConfirmationPending()\n      || this.documentRows.confirmationPending(),');
text = text.replace('this.fb.nonNullable.control(this.toDateOnly(new Date()), Validators.required)', 'this.fb.control<Date | string | null>(new Date(), [Validators.required, dateValueValidator])').replace('expiry: this.fb.control<string | null>(null)', 'expiry: this.fb.control<Date | string | null>(null, dateTimeValueValidator)');
text = text.replace('if (!this.depositForm.dirty) {\n      this.close(false);', 'if (!this.depositForm.dirty) {\n      this.cleanupPendingDocumentsThenClose();');
text = text.replace('if (confirmed) this.cleanupPendingDocumentsThenClose();', 'if (confirmed && !this.saving()) this.cleanupPendingDocumentsThenClose();');
text = text.replace('    this.currentTab.set(tab);', '    if (!this.editorLocked()) this.currentTab.set(tab);');
text = text.replace('    this.saving.set(true);', "    this.depositForm.disable({ emitEvent: false });\n    this.saving.set(true);");
text = text.replace('this.service.addDeposit(this.agreementId, this.buildPayload())', 'this.service.addDeposit(this.agreementId, this.buildPayload(), { skipSuccessToast: true })');
text = text.replace('finalize(() => this.saving.set(false))', "finalize(() => {\n          this.saving.set(false);\n          if (this.cleanupKind() === 'save') this.retryCleanup();\n          else this.depositForm.enable({ emitEvent: false });\n        })");
text = text.replace('          this.pendingDocumentPaths.clear();', "          this.cleanupKind.set('save');\n          this.savedPrint = saveAndPrint;\n          this.savedMessage = result.message || this.translate.instant('general.success');");
text = text.replace("          if (saveAndPrint) this.reportPrint.print({ bodyClasses: ['rental-agreement-deposit-print'] });\n          this.close(true);", '');
text = text.replace("documentPath: this.fb.nonNullable.control('', Validators.required)", 'documentPath: this.fb.control<string | null>(null, Validators.required)');
text = method(text, 'removeDocument', '  removeDocument(index: number): void { this.documentRows.requestRemove(index); }');
for (const name of ['onDocumentSelected', 'isAllowedDocument', 'isUploadFailure', 'deletePendingDocument', 'isDeleteFailure', 'toDateOnly', 'extractErrorMessage']) text = method(text, name, '');
text = method(text, 'cleanupPendingDocumentsThenClose', `  private cleanupPendingDocumentsThenClose(): void {
    this.cleanupKind.set('discard');
    this.retryCleanup();
  }

  retryCleanup(): void {
    const kind = this.cleanupKind();
    if (!kind || this.uploads.cleaning() || this.saving()) return;
    const cleanup = kind === 'save'
      ? this.uploads.finishSave(this.documents.controls.map(row => row.controls.documentPath.value))
      : this.uploads.discard();
    let complete = false;
    cleanup.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      if (!complete) return;
      if (kind === 'save') {
        this.messages.add({ key: 'global', severity: 'success', summary: this.translate.instant('general.success'), detail: this.savedMessage, life: 3500 });
        if (this.savedPrint) this.reportPrint.print({ bodyClasses: ['rental-agreement-deposit-print'] });
      }
      this.close(kind === 'save');
    })).subscribe({
      next: failed => {
        if (failed.length) { this.errorMessage.set('rentalAgreement.depositDialog.errors.documentCleanup'); return; }
        complete = true;
      },
      error: () => this.errorMessage.set('rentalAgreement.depositDialog.errors.documentCleanup'),
    });
  }`);
text = text.replaceAll('this.extractErrorMessage(', 'apiErrorMessage(');
text = text.replace('date: raw.date,', 'date: toApiDate(raw.date)!,').replace('expiry: this.isCardPaymentMethod() ? raw.expiry : null', 'expiry: this.isCardPaymentMethod() ? toApiDateTime(raw.expiry) : null').replace('document.documentPath.trim()', "document.documentPath?.trim() ?? ''");
text = text.replaceAll('getSelectList<Results<DropDownSelect>>()', 'getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true })');
text = text.replace('this.paymentMethodService\n            .getById<Result<RentalAgreementDepositPaymentMethodDetails>>(String(id))', 'this.service\n            .getDepositPaymentMethod(id)');
write(file, text);
file = 'Agreement/components/deposit/deposit.component.html';
text = read(file).replace('  width="980px"', '  width="980px" [contentPadded]="true" [focusOnShow]="false"');
text = text.replace('<span>{{ errorMessage() }}</span>', '<span>{{ errorMessage() | translate }}</span>');
text = text.replace('      <app-editor-tabs', `      @if (cleanupKind()) {
        <app-state-message kind="error" [message]="cleanupKind() === 'save' ? 'rentalAgreement.depositDialog.savedCleanupPending' : 'rentalAgreement.depositDialog.errors.documentCleanup'" />
        <button type="button" class="sigma-secondary-button" [disabled]="uploads.cleaning()" (click)="retryCleanup()">{{ 'general.retry' | translate }}</button>
      }
      <app-editor-tabs [disabled]="editorLocked()"`);
text = text.replace(/<input id="rental-deposit-date"[^>]+\/>/, '<p-calendar appDatePicker [dateInputMask]="true" placeholder="dd/mm/yyyy" inputId="rental-deposit-date" formControlName="date" />');
text = text.replace(/<input id="rental-deposit-expiry"[^>]+\/>/, '<p-calendar appDatePicker inputId="rental-deposit-expiry" formControlName="expiry" [showTime]="true" hourFormat="24" />');
text = text.replace(/<input([^>]*type="number"[^>]*)\/>/g, '<input appNumericFocus$1/>');
text = text.replace(/@if \(fieldInvalid\(([^)]+)\)\) \{\s*<small[^]*?<\/small>\s*}/g, '<app-field-error [control]="$1" [messages]="{ wholeNumber: \'rentalAgreement.depositDialog.validation.wholeNumber\', pattern: \'rentalAgreement.depositDialog.validation.lastFourDigits\' }" />');
text = text.replace(/class="rental-agreement-deposit__grid[^"\n]*"/g, 'class="sigma-editor-grid"').replace(/class="rental-agreement-deposit__field[^"\n]*"/g, 'class="sigma-field"').replace('class="rental-agreement-deposit__readonly"', 'class="sigma-field__read"');
text = text.replace(/<div class="rental-agreement-deposit__message[^]*?<\/div>/, '<app-state-message kind="error" [message]="errorMessage()" />');
text = text.replace(/<div class="rental-agreement-deposit__state"[^]*?<\/div>/, '<app-state-message kind="loading" message="rentalAgreement.depositDialog.loading" />');
text = text.replace('class="rental-agreement-deposit__document-add"', 'class="sigma-secondary-button"').replace('class="rental-agreement-deposit__document-delete"', 'class="sigma-secondary-button sigma-icon-button"');
text = text.replace(/<label class="rental-agreement-deposit__document-upload"[^]*?<input[^>]*\(change\)="onDocumentSelected\(\$event, index\)" \/>/, '<app-file-field [inputId]="\'rental-deposit-document-file-\' + index" [control]="document.controls.documentPath" folder="ReceiptDocuments" />');
write(file, text);
write('Agreement/components/deposit/deposit.component.scss', `/* Only workspace/attachment placement; shared dialog, tabs, fields and file controls own styling. */
.rental-agreement-deposit, .rental-agreement-deposit__form { display: flex; flex-direction: column; min-height: 0; flex: 1 1 0; overflow: hidden; gap: 10px; }
.rental-agreement-deposit__tab-panel { min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: 10px; }
.rental-agreement-deposit__documents-header, .rental-agreement-deposit__document-row, .rental-agreement-deposit__document-actions { display: flex; align-items: center; gap: 8px; }
.rental-agreement-deposit__document-content { flex: 1 1 0; min-width: 0; }
.rental-agreement-deposit__document-list { display: grid; gap: 8px; }
`);
