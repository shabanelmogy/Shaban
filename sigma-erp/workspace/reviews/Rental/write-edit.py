from pathlib import Path
import re
r=Path('F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental')
shared='src/app/modules/shared/'
def read(p): return p.read_text(encoding='utf-8-sig')
def put(p,s): p.write_text(s,encoding='utf-8',newline='\n')
def imports(s,names):
    for symbol,path in names:
        s=f"import {{ {symbol} }} from '{shared}{path}';\n"+s
    return s
for feature in ['Agreement','Booking']:
 p=r/feature/'components/details/details.component.ts';s=read(p)
 s=imports(s,[('StateMessageComponent','components/state-message/state-message.component'),('FieldErrorComponent','components/field-error/field-error.component'),('SummaryCardsComponent','components/summary-cards/summary-cards.component'),('SummaryCard','components/summary-cards/summary-card.model'),('DatePickerDirective','directives/date-picker.directive'),('NumericFocusDirective','directives/numeric-focus.directive'),('TranslateOptionsPipe','pipes/translate-options.pipe'),('apiErrorMessage','utils/api-error'),('dateValueValidator, dateTimeValueValidator, toApiDate, toApiDateTime','utils/date-utils')])
 s=s.replace('imports: [','host: { class: \'sigma-route-host\' },\n  imports: [\n    StateMessageComponent, FieldErrorComponent, SummaryCardsComponent, DatePickerDirective, NumericFocusDirective, TranslateOptionsPipe,',1)
 s=re.sub(r'  private errorMessageFrom\(error: HttpErrorResponse, fallback: string\): string \{.*?\n  \}', '',s,flags=re.S)
 s=s.replace('this.errorMessageFrom(', 'apiErrorMessage(')
 s=s.replace("this.fb.control<Date | null>(null, Validators.required)","this.fb.control<Date | null>(null, [Validators.required, dateTimeValueValidator])")
 prefix='rentalAgreement' if feature=='Agreement' else 'rentalBooking'
 entity='agreement' if feature=='Agreement' else 'booking'
 s=s.replace("readonly loadError = signal('');", "readonly loadError = signal('');\n  private allowNavigation = false;")
 if feature=='Agreement':
  s=imports(s,[('ConfirmationDialogService','service/confirmation-dialog.service')])
  s=s.replace('Subject, catchError','Observable, Subject, catchError')
  s=s.replace('finalize, forkJoin, map','finalize, forkJoin, map, tap')
  s=s.replace('private readonly reportPrint = inject(ReportPrintService);','private readonly reportPrint = inject(ReportPrintService);\n  private readonly confirmationDialog = inject(ConfirmationDialogService);\n  readonly closeConfirmationPending = signal(false);')
  s=s.replace('!this.saving() && !this.loadError()', '!this.saving() && !this.loadingTariff() && !this.closeConfirmationPending() && !this.loadError()')
  s=s.replace("void this.router.navigate(['/RentalAgreement']);","this.close();")
  s=re.sub(r'  requestClose\(\): void \{.*?\n  \}', '''  canDeactivate(): boolean | Observable<boolean> {
    if (this.allowNavigation) return true;
    if (this.saving() || this.loadingPage() || this.loadingTariff() || this.closeConfirmationPending()) return false;
    if (this.isView() || this.form.pristine) return true;
    this.closeConfirmationPending.set(true);
    return this.confirmationDialog.confirmDiscard('rentalAgreement').pipe(
      tap(confirmed => { if (confirmed) this.allowNavigation = true; }),
      finalize(() => this.closeConfirmationPending.set(false)),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  requestClose(): void { this.close(); }
  private close(): void {
    void this.router.navigate(['/RentalAgreement'], { queryParams: this.route.snapshot.queryParams });
  }''',s,flags=re.S)
  s=s.replace('start.toISOString()', 'toApiDateTime(start)!').replace('end.toISOString()', 'toApiDateTime(end)!')
  s=s.replace('row.deliveryDateAndTime?.toISOString() ?? null','toApiDateTime(row.deliveryDateAndTime)')
  s=s.replace('value.dateAndTime!.toISOString()','toApiDateTime(value.dateAndTime)!').replace('value.returnDateAndTime!.toISOString()','toApiDateTime(value.returnDateAndTime)!')
  s=s.replace('deliveryDateAndTime: this.fb.control(', 'deliveryDateAndTime: this.fb.control(')
  # Enum option keys belong to the translator owner.
  s=s.replace("label: 'rentalAgreement.","key: 'rentalAgreement.").replace('?.label ??','?.key ??')
 else:
  s=imports(s,[('DocumentUploadTracker','service/document-upload-tracker.service'),('EditableRows','utils/editable-rows'),('FileFieldComponent','components/file-field/file-field.component')])
  s="import { MessageService } from 'primeng/api';\n"+s
  s=s.replace('merge, of, switchMap','merge, of, switchMap, map, tap')
  s=s.replace('host: {', 'providers: [DocumentUploadTracker],\n  host: {',1)
  s=s.replace('StateMessageComponent, FieldErrorComponent,', 'FileFieldComponent, StateMessageComponent, FieldErrorComponent,',1)
  s=s.replace('private readonly fileService = inject(FileUploadService);','readonly uploads = inject(DocumentUploadTracker);\n  private readonly messages = inject(MessageService);\n  private pendingSaveSuccess: string | null = null;\n  readonly cleanupKind = signal<\'save\' | \'discard\' | null>(null);')
  s=re.sub(r"  readonly uploadingDocumentIndex = signal<number \| null>\(null\);\n  private readonly pendingDocumentPaths.*?\n  private readonly removedDocumentPaths[^\n]*\n",'  readonly uploadingDocumentIndex = this.uploads.uploading;\n',s,flags=re.S)
  s=s.replace('!this.saving() && !this.loadError()', '!this.saving() && !this.loadingTariff() && !this.closeConfirmationPending() && !this.documentRows.confirmationPending() && this.uploads.uploading() === null && !this.uploads.cleaning() && !this.cleanupKind() && !this.loadError()')
  s=s.replace('  constructor() {','''  readonly documentRows = new EditableRows<FormGroup<DocumentControls>, BookingDocumentDetailsDTO>({
    array: this.form.controls.documents, parent: this.form,
    create: row => this.createDocumentGroup(row), confirmation: this.confirmationDialog,
    destroyRef: this.destroyRef, focusId: index => `booking-document-type-${index}`,
    removeTitle: 'rentalBooking.confirmations.removeDocument.title',
    removeMessage: 'rentalBooking.confirmations.removeDocument.message',
    canMutate: () => this.isEditable(),
  });

  constructor() {''',1)
  s=s.replace('this.bookingService.createBooking(payload)','this.bookingService.createBooking(payload, { skipSuccessToast: true })').replace('this.bookingService.updateBooking({ ...payload, id: this.bookingId })','this.bookingService.updateBooking({ ...payload, id: this.bookingId }, { skipSuccessToast: true })')
  s=s.replace('this.saving.set(false);\n        this.loading.endLoading();','this.saving.set(false);\n        this.loading.endLoading();\n        if (this.cleanupKind() === \'save\') this.retryCleanup();',1)
  s=s.replace('''        this.deleteRemovedDocumentFiles();
        this.pendingDocumentPaths.clear();
        this.form.markAsPristine();
        void this.router.navigate(['/RentalBooking']);''','''        this.form.markAsPristine();
        this.form.disable({ emitEvent: false });
        this.pendingSaveSuccess = result.message || null;
        this.cleanupKind.set('save');''')
  start=s.index('  addDocument(): void {');end=s.index('  durationDays(): number {',start)
  s=s[:start]+'''  addDocument(): void { if (this.isEditable()) this.documentRows.add(); }

  removeDocument(index: number): void {
    if (!this.isEditable()) return;
    // Original saved paths are reconciled only after persistence succeeds.
    this.documentRows.requestRemove(index);
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.allowNavigation) return true;
    if (this.loadingPage() || this.loadingTariff() || this.saving() || this.closeConfirmationPending()
      || this.documentRows.confirmationPending() || this.uploads.uploading() !== null
      || this.uploads.cleaning() || this.cleanupKind()) return false;
    if (this.isView()) return true;
    this.closeConfirmationPending.set(true);
    const decision = this.form.dirty ? this.confirmationDialog.confirm({
      severity: 'warning', title: { key: 'rentalBooking.confirmations.discard.title' },
      message: { key: 'rentalBooking.confirmations.discard.message' },
      confirmLabel: { key: 'rentalBooking.confirmations.discard.confirm' },
      cancelLabel: { key: 'general.cancel' },
    }) : of(true);
    return decision.pipe(switchMap(confirmed => {
      if (!confirmed) return of(false);
      this.cleanupKind.set('discard');
      return this.uploads.discard().pipe(map(failed => {
        if (failed.length) { this.saveError.set('rentalBooking.fileCleanupFailed'); return false; }
        this.allowNavigation = true;
        return true;
      }));
    }), finalize(() => this.closeConfirmationPending.set(false)), takeUntilDestroyed(this.destroyRef));
  }

  requestClose(): void { this.close(); }
  private close(): void {
    void this.router.navigate(['/RentalBooking'], { queryParams: this.route.snapshot.queryParams });
  }

  retryCleanup(): void {
    const kind = this.cleanupKind();
    if (!kind || this.uploads.cleaning() || this.saving()) return;
    let complete = false;
    const cleanup = kind === 'save'
      ? this.uploads.finishSave(this.documents.controls.map(row => row.controls.documentPath.value))
      : this.uploads.discard();
    cleanup.pipe(finalize(() => {
      if (!complete) return;
      this.allowNavigation = true;
      if (kind === 'save' && this.pendingSaveSuccess) {
        this.messages.add({ key: 'global', severity: 'success',
          summary: this.translate.instant('general.success'), detail: this.pendingSaveSuccess, life: 3500 });
        this.pendingSaveSuccess = null;
      }
      this.close();
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: failed => {
        if (failed.length) { this.saveError.set('rentalBooking.fileCleanupFailed'); return; }
        complete = true;
      },
      error: () => this.saveError.set('rentalBooking.fileCleanupFailed'),
    });
  }

''' +s[end:]
  s=re.sub(r'  private isUploadFailure\(.*?\n  private createPayload', '  private createPayload',s,flags=re.S)
  # Reconcile removed originals using the stable successful aggregate snapshot.
  s=s.replace('    const payload = this.createPayload();','''    const payload = this.createPayload();
    const retained = new Set(payload.documents.map(row => row.documentPath));
    (this.booking()?.documents ?? []).forEach(row => {
      if (row.documentPath && !retained.has(row.documentPath)) this.uploads.markRemoved(row.documentPath);
    });''')
  s=s.replace('this.dateToIso(', 'toApiDateTime(')
  s=s.replace('issueDate: document.issueDate ? toApiDateTime(document.issueDate) : null','issueDate: toApiDate(document.issueDate)').replace('expiryDate: document.expiryDate ? toApiDateTime(document.expiryDate) : null','expiryDate: toApiDate(document.expiryDate)')
  s=s.replace('pickUp: toApiDateTime(value.pickUp!),','pickUp: toApiDateTime(value.pickUp)!,').replace('dropOff: toApiDateTime(value.dropOff!),','dropOff: toApiDateTime(value.dropOff)!,')
  s=s.replace('toApiDateTime(pickUp),','toApiDateTime(pickUp)!,').replace('toApiDateTime(dropOff),','toApiDateTime(dropOff)!,')
  s=re.sub(r'  private dateToIso[^\n]*\n','',s)
  s=s.replace('this.fb.control(row?.issueDate ? new Date(row.issueDate) : null)', 'this.fb.control(row?.issueDate ? new Date(row.issueDate) : null, dateValueValidator)').replace('this.fb.control(row?.expiryDate ? new Date(row.expiryDate) : null)', 'this.fb.control(row?.expiryDate ? new Date(row.expiryDate) : null, dateValueValidator)')
  s=s.replace("value: 'rentalBooking.","key: 'rentalBooking.")
  s=s.replace('  setActiveTab(tab: BookingEditorTab): void { this.activeTab.set(tab); }', '  setActiveTab(tab: BookingEditorTab): void {\n    if (!this.saving() && !this.cleanupKind() && !this.documentRows.confirmationPending() && this.uploads.uploading() === null && !this.uploads.cleaning()) this.activeTab.set(tab);\n  }')
  s=s.replace("import { FileUploadService } from 'src/app/modules/shared/service/file-upload.service';\n",'')
 # Valid date controls protect calculation methods from PrimeNG partial string values.
 if feature=='Booking':
  for method,nextmethod in [('durationDays','durationHours'),('durationHours','subTotal'),('billableDays','emptyOptions')]:
   pass
 s=s.replace('if (!start || !end || end <= start) return 0;', 'if (!(start instanceof Date) || !(end instanceof Date) || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return 0;')
 s=s.replace('if (!start || !end) return 1;', 'if (!(start instanceof Date) || !(end instanceof Date) || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return 1;')
 s=s.replace('if (!vehicleTypeId || !pickUp || !dropOff || dropOff <= pickUp)', 'if (!vehicleTypeId || this.form.controls.pickUp.invalid || this.form.controls.dropOff.invalid || !pickUp || !dropOff || dropOff <= pickUp)')
 s=s.replace('if (!typeId || !start || !end || end <= start)', 'if (!typeId || this.form.controls.dateAndTime.invalid || this.form.controls.returnDateAndTime.invalid || !start || !end || end <= start)')
 s=s.replace('if (!pickUp || !dropOff) return false;', 'if (!pickUp || !dropOff || this.form.controls.pickUp.invalid || this.form.controls.dropOff.invalid) return false;')
 s=s.replace('if (!start || !end || end <= start) {', 'if (!start || !end || this.form.controls.dateAndTime.invalid || this.form.controls.returnDateAndTime.invalid || end <= start) {')
 # Shared totals use current authoritative values in View, previews otherwise.
 s=s.replace('  subTotal(): number {',f'''  summaryCards(): ReadonlyArray<SummaryCard> {{
    return [
      {{ id: 'subtotal', labelKey: '{prefix}.totalCharges', icon: 'bi bi-receipt', accent: 'neutral', value: this.isView() ? (this.{entity}()?.totalCharges ?? 0) : this.subTotal(), format: 'money' }},
      {{ id: 'discount', labelKey: '{prefix}.discount', icon: 'bi bi-percent', accent: 'warning', value: this.discountAmount(), format: 'money' }},
      {{ id: 'tax', labelKey: '{prefix}.taxAmount', icon: 'bi bi-percent', accent: 'info', value: this.taxAmount(), format: 'money' }},
      {{ id: 'total', labelKey: '{prefix}.grandTotal', icon: 'bi bi-cash-stack', accent: 'primary', value: this.isView() ? (this.{entity}()?.totalCharges ?? 0) : this.grandTotal(), format: 'money' }},
    ];
  }}

  subTotal(): number {{''',1)
 put(p,s)
 # Feature-owned guards require no new runtime file.
 p=r/feature/(feature.lower()+'.routes.ts');s=read(p).replace("import { Routes }", "import { CanDeactivateFn, Routes }")
 marker='export const '
 i=s.index(marker);s=s[:i]+"const preventUnsavedExit: CanDeactivateFn<DetailsComponent> = component => component.canDeactivate();\n\n"+s[i:]
 s=s.replace('component: DetailsComponent,', 'component: DetailsComponent, canDeactivate: [preventUnsavedExit],')
 put(p,s)
