// Authoring only: emits source patches for apply_patch; never compiles/runs the application.
const fs = require('fs');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental';
const changes = [];
const read = file => fs.readFileSync(`${root}/${file}`, 'utf8').replace(/\r\n/g, '\n');
const record = (file, value) => changes.push({ path: `${root}/${file}`, old: read(file), value });
function method(text, name, value) {
  const re = new RegExp(`^  (?:private |public |async )*${name}\\([^]*?^  \\}`, 'm');
  if (!re.test(text)) throw new Error(`Missing method ${name}`);
  return text.replace(re, value);
}
const shared = name => `src/app/modules/shared/${name}`;
for (const kind of ['history', 'journal']) {
  if (process.argv[2] && !`Booking/components/${kind}/`.includes(process.argv[2])) continue;
  const file = `Booking/components/${kind}/${kind}.component.ts`;
  let text = read(file).replace(/import \{ CommonModule[^]*?from '@angular\/common';/, "import { CommonModule } from '@angular/common';");
  text = text.replace("import { TranslateModule }", "import { TranslateModule, TranslateService }");
  text = `import { DataTableComponent, DataTableColumn } from '${shared('components/data-table/data-table.component')}';\nimport { StateMessageComponent } from '${shared('components/state-message/state-message.component')}';\nimport { apiErrorMessage } from '${shared('utils/api-error')}';\n` + text;
  text = text.replace(/imports: \[[^]*?\],/, 'imports: [CommonModule, DataTableComponent, StateMessageComponent, EditorDialogComponent, TranslateModule' + (kind === 'journal' ? ', SummaryCardsComponent' : '') + '],');
  text = text.replace('  ngOnInit(): void {', `  ngOnInit(): void { this.load(); }\n\n  load(): void {\n    if (this.loading()) return;\n    this.errorMessage.set('');`);
  text = text.replace('this.extractError(error,', 'apiErrorMessage(error,');
  text = method(text, 'extractError', '');
  if (kind === 'history') {
    text = text.replace('  readonly loading =', `  private readonly translate = inject(TranslateService);\n  readonly columns: ReadonlyArray<DataTableColumn<BookingHistoryDTO>> = [\n    { field: 'createdAt', header: 'rentalBooking.history.date', type: 'dateTime' },\n    { field: 'action', header: 'rentalBooking.history.action', value: row => this.translate.instant(this.actionKey(row.action)) },\n    { field: 'fromStatus', header: 'rentalBooking.history.fromStatus', value: row => this.translate.instant(this.statusKey(row.fromStatus)) },\n    { field: 'toStatus', header: 'rentalBooking.history.toStatus', value: row => this.translate.instant(this.statusKey(row.toStatus)) },\n    { field: 'createdBy', header: 'rentalBooking.history.user', value: row => row.createdBy || '—' },\n    { field: 'notes', header: 'rentalBooking.history.notes', value: row => row.notes || '—' },\n  ];\n\n  readonly loading =`);
  } else {
    text = `import { SummaryCardsComponent, SummaryCard } from '${shared('components/summary-cards/summary-cards.component')}';\n` + text;
    text = text.replace('  readonly loading =', `  readonly columns: ReadonlyArray<DataTableColumn<BookingJournalLineDTO>> = [\n    { field: 'date', header: 'rentalBooking.journal.date', type: 'date' },\n    { field: 'accountCode', header: 'rentalBooking.journal.accountCode', value: row => row.accountCode || '—' },\n    { field: 'accountName', header: 'rentalBooking.journal.accountName', value: row => row.accountName || '—' },\n    { field: 'contact', header: 'rentalBooking.journal.contact', value: row => row.contact || '—' },\n    { field: 'voucherNo', header: 'rentalBooking.journal.voucher', value: row => row.voucherNo || row.type || '—' },\n    { field: 'description', header: 'rentalBooking.journal.description', value: row => row.description || '—' },\n    { field: 'debit', header: 'rentalBooking.journal.debit', type: 'money' },\n    { field: 'credit', header: 'rentalBooking.journal.credit', type: 'money' },\n  ];\n  readonly summaryCards = computed<ReadonlyArray<SummaryCard>>(() => [\n    { id: 'debit', labelKey: 'rentalBooking.journal.debit', value: this.debitTotal(), valueType: 'money', icon: 'bi bi-arrow-down-left', accent: 'primary' },\n    { id: 'credit', labelKey: 'rentalBooking.journal.credit', value: this.creditTotal(), valueType: 'money', icon: 'bi bi-arrow-up-right', accent: 'neutral' },\n  ]);\n  readonly loading =`);
  }
  record(file, text);
  record(`Booking/components/${kind}/${kind}.component.html`, `<app-editor-dialog [visible]="true" [title]="'rentalBooking.${kind}.title' | translate" [subtitle]="'rentalBooking.${kind}.subtitle' | translate: { no: booking.no }" icon="bi bi-${kind === 'history' ? 'clock-history' : 'journal-text'}" mode="view" width="${kind === 'history' ? '980' : '1100'}px" [contentPadded]="true" [primaryActionVisible]="false" [closeLabel]="'general.close' | translate" (closeRequested)="closed.emit()" (escapeRequested)="closed.emit()">\n  <div class="sigma-editor-scroll">\n    @if (errorMessage()) {\n      <app-state-message kind="error" [message]="errorMessage()" />\n      <button type="button" class="sigma-secondary-button" [disabled]="loading()" (click)="load()">{{ 'general.retry' | translate }}</button>\n    } @else {\n      <app-data-table [value]="rows()" [columns]="columns" [loading]="loading()" [lazy]="false" [paginator]="false" [scrollable]="false" emptyMessage="rentalBooking.${kind}.empty" />\n      ${kind === 'journal' ? `<app-summary-cards [cards]="summaryCards()" [ariaLabel]="'rentalBooking.journal.total' | translate" density="slim" layout="row" [minCardWidth]="140" [maxHeight]="80" />` : ''}\n    }\n  </div>\n</app-editor-dialog>\n`);
  record(`Booking/components/${kind}/${kind}.component.scss`, '/* Shared dialog, scrolling body, DataTable and summary owners. */\n');
}
for (const kind of ['void', 'sales-person']) {
  if (process.argv[2] && !`Agreement/components/${kind}/`.includes(process.argv[2])) continue;
  const file = `Agreement/components/${kind}/${kind}.component.ts`;
  let text = read(file).replace("import { HttpErrorResponse } from '@angular/common/http';\n", '');
  text = `import { FieldErrorComponent } from '${shared('components/field-error/field-error.component')}';\nimport { StateMessageComponent } from '${shared('components/state-message/state-message.component')}';\nimport { apiErrorMessage } from '${shared('utils/api-error')}';\n` + text;
  text = text.replace('imports: [', 'imports: [FieldErrorComponent, StateMessageComponent, ');
  text = text.replace('    this.saving.set(true);', '    this.form.disable({ emitEvent: false });\n    this.saving.set(true);');
  text = text.replace('finalize(() => this.saving.set(false))', 'finalize(() => { this.saving.set(false); this.form.enable({ emitEvent: false }); })');
  text = text.replace('this.extractErrorMessage(error)', `apiErrorMessage(error, '${kind === 'void' ? 'rentalAgreement.void' : 'rentalAgreement.salesPersonDialog'}.errors.save')`);
  text = method(text, 'extractErrorMessage', '');
  if (kind === 'sales-person') text = text.replace('    this.form.controls.salesPersonId.setValue(null);', '    this.form.controls.salesPersonId.setValue(null);\n    this.form.markAsDirty();');
  record(file, text);
  const prefix = kind === 'void' ? 'rentalAgreement.void' : 'rentalAgreement.salesPersonDialog';
  record(`Agreement/components/${kind}/${kind}.component.html`, `<app-editor-dialog [visible]="true" [title]="'${prefix}.title' | translate" [subtitle]="'${prefix}.${kind === 'void' ? 'subtitle' : 'agreementNo'}' | translate: { no: agreementNo || '—' }" icon="bi bi-${kind === 'void' ? 'slash-circle' : 'person-gear'}" mode="create" width="${kind === 'void' ? '560' : '520'}px" [contentPadded]="true" [focusOnShow]="false" [closeDisabled]="editorLocked()" [primaryActionDisabled]="editorLocked()" [saving]="saving()" [cancelLabel]="'general.cancel' | translate" [saveLabel]="'${kind === 'void' ? prefix + '.action' : 'general.save'}' | translate" (closeRequested)="requestClose()" (escapeRequested)="requestClose()" (saveRequested)="save()">\n  <form class="sigma-editor-scroll" [formGroup]="form" (ngSubmit)="save()" novalidate>\n    @if (errorMessage()) { <app-state-message kind="error" [message]="errorMessage()" /> }\n    ${kind === 'void' ? `<p>{{ '${prefix}.prompt' | translate }}</p>\n    <div class="sigma-field"><label class="required" for="rental-agreement-void-reason">{{ '${prefix}.reason' | translate }}</label><textarea id="rental-agreement-void-reason" rows="5" maxlength="500" formControlName="reason" [attr.aria-invalid]="form.controls.reason.touched && form.controls.reason.invalid"></textarea><app-field-error [control]="form.controls.reason" [messages]="{ required: '${prefix}.reasonRequired' }" /></div>` : `<div class="sigma-field"><label for="rental-agreement-sales-person">{{ '${prefix}.label' | translate }}</label><p-dropdown inputId="rental-agreement-sales-person" formControlName="salesPersonId" [options]="salesPeople" optionLabel="value" optionValue="id" [filter]="true" [showClear]="true" appendTo="body" [emptyMessage]="'${prefix}.emptyOptions' | translate" /></div>`}\n  </form>\n</app-editor-dialog>\n`);
  record(`Agreement/components/${kind}/${kind}.component.scss`, '/* Shared form, state and EditorDialog owners. */\n');
}
for (const kind of ['discounts', 'billing-history', 'logs-dialog', 'print']) {
  if (process.argv[2] && !`Agreement/components/${kind}/`.includes(process.argv[2])) continue;
  const file = `Agreement/components/${kind}/${kind}.component.ts`;
  let text = read(file);
  text = `import { StateMessageComponent } from '${shared('components/state-message/state-message.component')}';\nimport { apiErrorMessage } from '${shared('utils/api-error')}';\n` + text;
  text = text.replace('imports: [', 'imports: [StateMessageComponent, ');
  if (kind === 'logs-dialog') {
    text = text.replace('  providers: [DatePipe],\n', '').replace('  private readonly datePipe = inject(DatePipe);\n', '');
    text = text.replace("value: (row) => this.datePipe.transform(row.dateTime, 'dd/MM/yyyy HH:mm') ?? row.dateTime,", "type: 'dateTime',");
    text = text.replace('  private loadLogs(id: number): void {', '  retryLoad(): void { if (this.agreementId && !this.loading()) this.loadLogs(this.agreementId); }\n\n  private loadLogs(id: number): void {');
    text = text.replace("error.error?.message || error.message || 'rentalAgreement.logs.errors.load'", "apiErrorMessage(error, 'rentalAgreement.logs.errors.load')");
  } else {
    text = text.replace('this.extractErrorMessage(', 'apiErrorMessage(');
    text = method(text, 'extractErrorMessage', '');
    if (kind === 'discounts') {
      text = `import { formatDisplayDate } from '${shared('utils/date-utils')}';\n` + text;
      text = method(text, 'formatDate', '  formatDate(value: string): string { return formatDisplayDate(value) || value; }');
      text = text.replace('  private loadDiscounts(): void {', '  loadDiscounts(): void {\n    if (this.loading()) return;');
    }
    if (kind === 'print') {
      text = text.replace('  private loadAgreement(): void {', '  loadAgreement(): void {\n    if (this.loading()) return;').replace('this.service.getDetails(this.agreementId)', 'this.service.getDetails(this.agreementId, { skipErrorInterceptor: true })');
    }
    if (kind === 'billing-history') {
      text = `import { SummaryCardsComponent, SummaryCard } from '${shared('components/summary-cards/summary-cards.component')}';\nimport { computed } from '@angular/core';\n` + text;
      text = text.replace('imports: [', 'imports: [SummaryCardsComponent, ');
      text = text.replace('  ngOnInit(): void {', `  readonly summaryCards = computed<ReadonlyArray<SummaryCard>>(() => {\n    const summary = this.billingHistory();\n    return summary ? [\n      { id: 'charges', labelKey: 'rentalAgreement.billingHistory.totalCharges', value: summary.totalCharges, valueType: 'money', icon: 'bi bi-cash-stack', accent: 'primary' },\n      { id: 'received', labelKey: 'rentalAgreement.billingHistory.received', value: summary.received, valueType: 'money', icon: 'bi bi-wallet2', accent: 'success' },\n      { id: 'due', labelKey: 'rentalAgreement.billingHistory.due', value: summary.due, valueType: 'money', icon: 'bi bi-bank', accent: 'warning' },\n    ] : [];\n  });\n\n  ngOnInit(): void { this.load(); }\n\n  load(): void {\n    this.loading.set(true);\n    this.errorMessage.set('');`);
    }
  }
  record(file, text);
  const htmlFile = `Agreement/components/${kind}/${kind}.component.html`;
  let html = read(htmlFile);
  if (kind === 'billing-history') {
    html = `<app-editor-dialog [visible]="true" [title]="'rentalAgreement.billingHistory.title' | translate" [subtitle]="'rentalAgreement.billingHistory.agreementNo' | translate: { no: agreementNo || billingHistory()?.agreementNo || '—' }" icon="bi bi-clock-history" mode="view" width="650px" [contentPadded]="true" [primaryActionVisible]="false" [closeLabel]="'general.close' | translate" (closeRequested)="close()" (escapeRequested)="close($event)">\n  <div class="sigma-editor-scroll">\n    @if (loading()) { <app-state-message kind="loading" message="rentalAgreement.billingHistory.loading" /> }\n    @else if (errorMessage()) { <app-state-message kind="error" [message]="errorMessage()" /><button type="button" class="sigma-secondary-button" (click)="load()">{{ 'general.retry' | translate }}</button> }\n    @else if (billingHistory()) { <app-summary-cards [cards]="summaryCards()" [ariaLabel]="'rentalAgreement.billingHistory.title' | translate" density="slim" layout="row" [minCardWidth]="140" [maxHeight]="80" /> }\n    @else { <app-state-message kind="empty" message="rentalAgreement.billingHistory.empty" /> }\n  </div>\n</app-editor-dialog>\n`;
  } else if (kind === 'logs-dialog') {
    html = `<app-editor-dialog [visible]="true" [title]="'rentalAgreement.logs.title' | translate" [subtitle]="'rentalAgreement.logs.subtitle' | translate: { no: agreementNo || '—' }" icon="bi bi-clock-history" mode="view" width="720px" [contentPadded]="true" [primaryActionVisible]="false" [closeLabel]="'general.close' | translate" (closeRequested)="close()" (escapeRequested)="close()">\n  <div class="sigma-editor-scroll">\n    @if (errorMessage()) { <app-state-message kind="error" [message]="errorMessage()" /><button type="button" class="sigma-secondary-button" [disabled]="loading()" (click)="retryLoad()">{{ 'general.retry' | translate }}</button> }\n    @else { <app-data-table [value]="rows()" [columns]="columns" [lazy]="false" [paginator]="false" [loading]="loading()" [scrollable]="false" emptyMessage="rentalAgreement.logs.empty" /> }\n  </div>\n</app-editor-dialog>\n`;
  } else if (kind === 'discounts') {
    html = html.replace('  width="540px"', '  width="540px" [contentPadded]="true"');
    html = html.replace('class="rental-agreement-discounts"', 'class="sigma-editor-scroll"');
    html = html.replace(/<div class="rental-agreement-discounts__message[^]*?<\/div>/, '<app-state-message kind="error" [message]="errorMessage()" /><button type="button" class="sigma-secondary-button" [disabled]="loading()" (click)="loadDiscounts()">{{ \'general.retry\' | translate }}</button>');
    html = html.replace(/<div class="rental-agreement-discounts__state[^]*?<\/div>/, '<app-state-message kind="loading" message="rentalAgreement.discounts.loading" />');
    html = html.replace('          maxHeight="min(46dvh, 420px)"', '');
    html = html.replace('<td class="is-number">{{ discount.discount | number: \'1.2-2\' }}</td>', '<td><span class="app-editable-collection-table__value app-editable-collection-table__value--highlight">{{ discount.discount | number: \'1.2-2\' }}</span></td>');
  } else {
    html = html.replace('  width="1040px"', '  width="1040px" [contentPadded]="true"');
    html = html.replace('class="rental-agreement-print-button"', 'class="sigma-secondary-button"');
    html = html.replace(/<div class="rental-agreement-print-message[^]*?<\/div>/, '<app-state-message kind="error" [message]="errorMessage()" /><button type="button" class="sigma-secondary-button" [disabled]="loading()" (click)="loadAgreement()">{{ \'general.retry\' | translate }}</button>');
    html = html.replace(/<div class="rental-agreement-print-state[^]*?<\/div>/, '<app-state-message kind="loading" message="rentalAgreement.loading" />');
  }
  record(htmlFile, html);
  const cssFile = `Agreement/components/${kind}/${kind}.component.scss`;
  let css = '/* Shared dialog, state, table/summary and body scroll owners. */\n';
  if (kind === 'print') {
    css = read(cssFile).slice(read(cssFile).indexOf('.rental-agreement-print-document {'));
    css = `/* The existing printed agreement document is feature-owned; the dialog chrome is shared. */\n.rental-agreement-print-shell { display: flex; min-width: 0; min-height: 0; flex: 1 1 0; flex-direction: column; overflow: hidden; gap: 10px; }\n.rental-agreement-print-toolbar { display: flex; justify-content: flex-end; flex: 0 0 auto; }\n` + css;
    css = css.replace('  max-height: min(68dvh, 720px);', '  min-height: 0;\n  flex: 1 1 0;');
  }
  record(cssFile, css);
}
const file = 'Agreement/components/documents/documents.component.html';
if (!process.argv[2] || 'Agreement/components/documents/'.includes(process.argv[2])) {
let html = read(file).replace('class="rental-agreement-documents"', 'class="sigma-editor-scroll"');
html = html.replace(/<div class="rental-agreement-documents__message[^]*?<\/div>/, '<app-state-message kind="info" message="rentalAgreement.documents.readOnly" />');
html = html.replace(' maxHeight="min(46dvh, 420px)"', '').replace('          maxHeight="min(46dvh, 420px)"', '');
html = html.replace('rental-agreement-documents__upload-action', '');
html = html.replace('<app-state-message kind="error" [message]="errorMessage()" />', '<app-state-message kind="error" [message]="errorMessage()" /><button type="button" class="sigma-secondary-button" [disabled]="loading()" (click)="loadDocuments()">{{ \'general.retry\' | translate }}</button>');
record(file, html);
record('Agreement/components/documents/documents.component.ts', read('Agreement/components/documents/documents.component.ts').replace('  private loadDocuments(): void {', '  loadDocuments(): void {\n    if (this.loading()) return;'));
record('Agreement/components/documents/documents.component.scss', '/* Shared dialog, FileField, row actions, table and state owners. */\n.rental-agreement-documents__name { display: block; }\n');
}
console.log(JSON.stringify(process.argv[2] ? changes.filter(change => change.path.includes(process.argv[2])) : changes.map(change => change.path)));
