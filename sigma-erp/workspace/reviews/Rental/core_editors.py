exec(open('F:/My Work/Sigma/reviews/Rental/core_refactor.py',encoding='utf-8').read().split('for feature,prefix')[0])

p=ROOT/'Agreement/components/list/list.component.ts'; s=read(p).replace('if (!result.isSuccess) { // The interceptor owns the business failure. return; }','if (!result.isSuccess) {\n            // The interceptor owns the business failure.\n            return;\n          }'); write(p,s)
p=ROOT/'RentalQuotation/components/list/list.component.ts'; s=read(p).replace('this.toLocalDate(dateRange?.[0])','parseDateRange(dateRange)[0]').replace('this.toLocalDate(dateRange?.[1])','parseDateRange(dateRange)[1]'); write(p,s)

folder=ROOT/'RentalQuotation/components/details'
p=folder/'details.component.ts'; s=read(p)
s="""import { DatePickerDirective } from 'src/app/modules/shared/directives/date-picker.directive';
import { NumericFocusDirective } from 'src/app/modules/shared/directives/numeric-focus.directive';
import { QuantityInputDirective } from 'src/app/modules/shared/directives/quantity-input.directive';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldErrorComponent } from 'src/app/modules/shared/components/field-error/field-error.component';
import { StateMessageComponent } from 'src/app/modules/shared/components/state-message/state-message.component';
import { SummaryCardsComponent } from 'src/app/modules/shared/components/summary-cards/summary-cards.component';
import { SummaryCard } from 'src/app/modules/shared/components/summary-cards/summary-card.model';
import { MoneyPipe } from 'src/app/modules/shared/pipes/money.pipe';
import { dateValueValidator, parseDateValue, toApiDate } from 'src/app/modules/shared/utils/date-utils';
import { composedReadErrorMessage } from 'src/app/modules/shared/utils/api-error';
import { EditableRows } from 'src/app/modules/shared/utils/editable-rows';
import { focusField } from 'src/app/modules/shared/utils/focus-field';
import { mergeSelectOptions } from 'src/app/modules/shared/utils/select-options';
"""+s
s=s.replace('  standalone: true,',"  standalone: true,\n  host: { class: 'sigma-route-host' },",1)
s=s.replace('imports: [CommonModule,','imports: [DatePickerDirective, NumericFocusDirective, QuantityInputDirective, InputNumberModule, FieldErrorComponent, StateMessageComponent, SummaryCardsComponent, MoneyPipe, CommonModule,',1)
s=s.replace('date: this.fb.control<Date | null>(new Date(), Validators.required)','date: this.fb.control<Date | string | null>(new Date(), [Validators.required, dateValueValidator])')
s=s.replace("minWidth: '250px', required: true", "width: '250px', required: true").replace("minWidth: '220px', required: true", "width: '220px', required: true")
s=s.replace('numeric: true','numeric: true, align: \'center\'')
anchor='  constructor() {'
s=s.replace(anchor,"""  readonly lineRows = new EditableRows<FormGroup<LineControls>, LineSeed>({
    array: this.form.controls.rentalQuotationItems,
    parent: this.form,
    create: (seed) => this.createLine(seed),
    confirmation: this.confirmationDialog,
    destroyRef: this.destroyRef,
    removeTitle: 'rentalQuotation.confirm.removeItemTitle',
    removeMessage: 'rentalQuotation.confirm.removeItemMessage',
    focusId: (index) => `rental-quotation-model-${index}`,
    canMutate: () => this.isEditable(),
  });

  summaryCards(): ReadonlyArray<SummaryCard> {
    return [
      { id: 'subtotal', labelKey: 'rentalQuotation.subtotal', value: this.subtotal(), format: 'money', icon: 'bi bi-calculator', accent: 'neutral' },
      { id: 'tax', labelKey: 'rentalQuotation.tax5', value: this.tax(), format: 'money', icon: 'bi bi-receipt', accent: 'info' },
      { id: 'total', labelKey: 'rentalQuotation.total', value: this.total(), format: 'money', icon: 'bi bi-cash-stack', accent: 'neutral' },
      { id: 'grandTotal', labelKey: 'rentalQuotation.grandTotal', value: this.grandTotal(), format: 'money', icon: 'bi bi-wallet2', accent: 'primary' },
    ];
  }

"""+anchor,1)
s=s.replace("!this.loadError(); }","!this.loadError() && !this.closeConfirmationPending() && !this.lineRows.confirmationPending(); }")
s=method(s,'addItem',"  addItem(): void {\n    if (!this.isEditable()) return;\n    this.lineRows.add();\n  }")
s=method(s,'requestRemoveItem',"  requestRemoveItem(index: number): void {\n    this.lineRows.requestRemove(index);\n  }")
s=s.replace('if (this.saving() || this.closeConfirmationPending()) return;','if (this.saving() || this.closeConfirmationPending() || this.lineRows.confirmationPending()) return;')
s=s.replace('    this.saving.set(true); this.loading.startLoading();','    this.saving.set(true);\n    this.form.disable({ emitEvent: false });\n    this.loading.startLoading();')
s=s.replace('finalize(() => { this.saving.set(false); this.loading.endLoading(); })','finalize(() => {\n      this.saving.set(false);\n      if (!this.isView()) this.form.enable({ emitEvent: false });\n      this.loading.endLoading();\n    })')
s=s.replace('this.parseDate(detail.date)',"parseDateValue(detail.date) ? new Date(`${parseDateValue(detail.date)}T00:00:00`) : null")
s=method(s,'parseDate',''); s=method(s,'formatLocalDate','')
s=s.replace('    const rentalQuotationItems = this.createItemPayloads(raw.rentalQuotationItems);','    const date = toApiDate(raw.date);\n    if (!date) return null;\n    const rentalQuotationItems = this.createItemPayloads(raw.rentalQuotationItems);')
s=s.replace('date: this.formatLocalDate(raw.date)','date')
s=method(s,'errorMessageFrom',''); s=s.replace('this.errorMessageFrom(','composedReadErrorMessage(')
s=s.replace("import { HttpErrorResponse } from '@angular/common/http';\n",'')
s=s.replace("return message.startsWith('rentalQuotation.') ? this.translate.instant(message) : message;","return this.translate.instant(message);")
s=s.replace("'.rental-quotation-editor-page .ng-invalid:not(form)'", "'.sigma-editor-page .ng-invalid:not(form)'")
s=s.replace('      target?.focus();','      if (target?.id) focusField(target.id, { openOverlay: false });')
# Saved selections retain labels from their own source DTO after current lookup merge.
s=s.replace('    this.items.clear({ emitEvent: false });\n    detail.rentalQuotationItems',"""    this.customers.set(mergeSelectOptions(this.customers(), detail.customerName ? [{ id: detail.customerId, value: detail.customerName }] : []));
    this.branches.set(mergeSelectOptions(this.branches(), detail.branchName ? [{ id: detail.branchId, value: detail.branchName }] : []));
    this.salesPersons.set(mergeSelectOptions(this.salesPersons(), detail.salesPersonId && detail.salesPersonName ? [{ id: detail.salesPersonId, value: detail.salesPersonName }] : []));
    this.items.clear({ emitEvent: false });
    detail.rentalQuotationItems""")
write(p,s)
p=folder/'details.component.html'; h=read(p)
h=h.replace('class="rental-quotation-editor-page"','class="sigma-editor-page"').replace('class="rental-quotation-page-card"','class="sigma-editor-panel"')
h=h.replace('class="rental-quotation-page-back"','class="sigma-secondary-button sigma-icon-button"').replace('class="rental-quotation-secondary-action"','class="sigma-secondary-button"')
h=h.replace('class="rental-quotation-editor-content"','class="sigma-editor-form"')
h=re.sub(r'<div class="editor-state" role="status">.*?</div>', '<app-state-message kind="loading" message="rentalQuotation.loading" />',h,flags=re.S)
h=re.sub(r'<div class="editor-state is-error" role="alert">.*?</div>', '<app-state-message kind="error" [message]="loadError()" />\n        <button type="button" class="sigma-secondary-button" (click)="initialize()">{{ \'general.retry\' | translate }}</button>',h,flags=re.S)
h=h.replace('class="rental-quotation-form"','class="sigma-editor-form" (ngSubmit)="save()"')
h=re.sub(r'<div class="editor-error" role="alert">.*?</div>', '<app-state-message kind="error" [message]="saveError()" />',h,flags=re.S)
h=h.replace('          <app-form-section','          <div class="sigma-editor-body">\n          <div class="rental-quotation-header-area">\n          <app-form-section',1)
h=h.replace('            title="rentalQuotation.details"','            title="rentalQuotation.details" [fill]="true"',1)
h=h.replace('            <div class="form-grid">','            <div class="sigma-editor-scroll">\n            <div class="sigma-editor-grid">',1)
h=h.replace('          </app-form-section>','            </div>\n          </app-form-section>\n          </div>',1)
h=h.replace('class="form-field form-field--wide"','class="sigma-field sigma-field--full"').replace('class="form-field"','class="sigma-field"').replace('class="read-value"','class="sigma-field__read"')
h=h.replace('<p-calendar','<p-calendar appDatePicker [dateInputMask]="true" placeholder="dd/mm/yyyy"').replace('dateFormat="yy-mm-dd"','dateFormat="dd/mm/yy"').replace('[readonlyInput]="true"','[readonlyInput]="false" [keepInvalid]="true"')
h=re.sub(r'\s*\[showIcon\]="true"','',h)
h=h.replace('                  inputId="rentalQuotationDate"','                  panelStyleClass="sigma-datepicker-panel" inputId="rentalQuotationDate"')
h=h.replace('                maxHeight="clamp(120px, calc(100dvh - 540px), 240px)"','                [stickyHeader]="true"')
# Shared field errors retain the existing validation messages and trigger timing.
h=re.sub(r'@if \((form|line)\.controls\.(\w+)\.touched && \1\.controls\.\2\.invalid\) \{\s*<small>.*?</small>\s*\}',lambda m:f'<app-field-error [control]="{m[1]}.controls.{m[2]}" />',h,flags=re.S)
h=re.sub(r'@if \(contactsError\(\)\) \{\s*<small class="validation-error">.*?</small>\s*\}', '<app-field-error [message]="contactsError()" />\n                @if (contactsError()) { <button type="button" class="sigma-secondary-button" [disabled]="contactsLoading()" (click)="retryContacts()">{{ \'general.retry\' | translate }}</button> }',h,flags=re.S)
h=re.sub(r'@if \(submitted\(\) && items.invalid\) \{\s*<small class="validation-error">.*?</small>\s*\}', '<app-field-error [control]="items" [messages]="{ minlength: \'rentalQuotation.validation.itemsRequired\' }" />',h,flags=re.S)
h=h.replace('<input\n                        type="number"','<input appNumericFocus\n                        type="number"')
# Units is the actual quantity; months/rate retain their numeric roles.
h=re.sub(r'<input appNumericFocus\s+type="number"\s+min="1"\s+max="2147483647"\s+formControlName="units"\s+\[attr.aria-invalid\]="[^"]+"\s*/>', '<p-inputNumber appQuantityInput [min]="1" [max]="2147483647" [step]="1" [maxFractionDigits]="0" formControlName="units" [inputId]="\'rental-quotation-units-\' + index" [ariaLabel]="\'rentalQuotation.units\' | translate" />',h)
h=h.replace('                        formControlName="carModelId"','                        [inputId]="\'rental-quotation-model-\' + index" formControlName="carModelId"')
# Numeric readonly/derived cells consume the existing blue badge and money pipe.
for value in ['line.controls.units.value','line.controls.periodInMonths.value','line.controls.ratePerMonth.value']:
    h=h.replace('{{ '+value+(" | number: '1.2-2'" if 'ratePerMonth' in value else '')+' }}', '<span class="app-editable-collection-table__value app-editable-collection-table__value--highlight">{{ '+value+(' | money' if 'ratePerMonth' in value else '')+' }}</span>')
for func in ['lineSubtotal','lineTax','lineCharges']:
    h=h.replace("<td>{{ "+func+"(line) | number: '1.2-2' }}</td>",'<td><span class="app-editable-collection-table__value app-editable-collection-table__value--highlight">{{ '+func+'(line) | money }}</span></td>')
# Replace custom summary cards with the typed summary owner; discount stays a real field outside row scroll.
a=h.index('            <div class="quotation-summary"'); b=h.index('          </app-form-section>',a)
h=h[:a]+'''          </app-form-section>
          </div>
          <div class="sigma-editor-grid rental-quotation-summary" aria-live="polite">
            <div class="sigma-field">
              <label for="rentalQuotationDiscount">{{ 'rentalQuotation.discount' | translate }} (%)</label>
              <input appNumericFocus id="rentalQuotationDiscount" type="number" min="0" max="100" step="0.01" formControlName="discount" />
              <app-field-error [control]="form.controls.discount" [messages]="{ min: 'rentalQuotation.validation.discountRange', max: 'rentalQuotation.validation.discountRange' }" />
            </div>
            <app-summary-cards class="sigma-field--full" [cards]="summaryCards()" [ariaLabel]="'rentalQuotation.total' | translate" density="slim" layout="row" [minCardWidth]="140" [maxHeight]="80" />
          </div>
''' +h[b+len('          </app-form-section>'):]
h=h.replace('class="rental-quotation-page-actions"','class="sigma-editor-footer"')
h=h.replace('[disabled]="loadingPage() || !!loadError()"','[disabled]="!isEditable()"')
write(p,h)
write(folder/'details.component.scss','''/* Feature workspace bounds only; shared owners supply all shell/control/card styling. */
.rental-quotation-header-area {
  flex: 0 1 40%;
  min-height: 0;
  overflow: hidden;
}
.rental-quotation-items-table-area {
  min-height: 0;
  flex: 1 1 auto;
  overflow: hidden;
}
.rental-quotation-summary {
  flex: 0 0 auto;
}
@media print {
  .rental-quotation-header-area,
  .rental-quotation-items-table-area {
    flex: none;
    overflow: visible;
    height: auto;
  }
}
''')
