from pathlib import Path
import re
r=Path('F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental')
def read(p): return p.read_text(encoding='utf-8-sig')
def put(p,s): p.write_text(s,encoding='utf-8',newline='\n')
p=r/'Agreement/components/details/details.component.ts';s=read(p)
s="import { BookingService } from '../../../Booking/services/booking.service';\n"+s
s=s.replace('  private readonly vehicleService = inject(VehicleService);','  private readonly bookingOptionsService = inject(BookingService);')
for line in ["import { CompanyDriverService }", "import { VehicleService }", "import { CarModelService }"]:
 s=re.sub(re.escape(line)+r'[^\n]*\n','',s)
s=re.sub(r'  private readonly (driverService|carModelService) = inject\([^\n]*\n','',s)
s=s.replace('vehicles: this.vehicleService.get<Results<any>>(),\n      carModels: this.carModelService.get<Results<any>>(),','vehicleOptions: this.bookingOptionsService.getOptions(),')
s=s.replace('      drivers: this.driverService.get<Results<any>>(),\n','')
s=s.replace('result.vehicles, result.carModels,','result.vehicleOptions,').replace('result.drivers, ','')
a=s.index('        this.vehicles.set(');b=s.index('        this.staff.set(',a)
s=s[:a]+'''        if (!result.vehicleOptions.entity) { this.loadError.set('rentalAgreement.errors.options'); return; }
        this.vehicles.set(result.vehicleOptions.entity.vehicles);
        this.carModels.set(result.vehicleOptions.entity.carModels);
        this.customers.set(this.mapOptions(result.customers.entities));
        this.drivers.set(result.vehicleOptions.entity.drivers);
'''+s[b:]
s=re.sub(r'  private personName[^\n]*\n','',s)
# Every simple select is inline-owned.
s=s.replace('getSelectList<Results<DropDownSelect>>()','getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true })')
s=s.replace('this.loadingPage.set(true);\n    this.loading.startLoading();','this.loadingPage.set(true);\n    this.loadError.set(\'\');\n    this.countriesError.set(\'\');\n    this.loading.startLoading();')
s=s.replace("labelKey: 'rentalAgreement.totalCharges'", "labelKey: 'rentalAgreement.subTotal'",1).replace("labelKey: 'rentalAgreement.discount'","labelKey: 'rentalAgreement.discountAmount'").replace("labelKey: 'rentalAgreement.grandTotal'","labelKey: 'rentalAgreement.totalCharges'")
s=s.replace("value: this.isView() ? (this.agreement()?.totalCharges ?? 0) : this.subTotal()",'value: this.subTotal()')
put(p,s)
p=r/'Booking/components/details/details.component.ts';s=read(p)
s=s.replace("labelKey: 'rentalBooking.totalCharges'","labelKey: 'rentalBooking.subTotal'",1).replace("labelKey: 'rentalBooking.discount'","labelKey: 'rentalBooking.discountAmount'").replace("labelKey: 'rentalBooking.grandTotal'","labelKey: 'rentalBooking.totalCharges'")
s=s.replace("value: this.isView() ? (this.booking()?.totalCharges ?? 0) : this.subTotal()",'value: this.subTotal()')
s=s.replace("    ];\n  }\n\n  subTotal", "      ...(this.booking() ? [{ id: 'deposit', labelKey: 'rentalBooking.receivedDeposit', icon: 'bi bi-cash-coin', accent: 'neutral' as const, value: this.booking()?.receivedDeposit ?? 0, format: 'money' as const }] : []),\n    ];\n  }\n\n  subTotal")
put(p,s)

def div_bounds(s,start):
 depth=0
 for m in re.finditer(r'</?div\b[^>]*>',s[start:]):
  if m.group(0).startswith('</'): depth-=1
  else: depth+=1
  if depth==0: return start,start+m.end()
 raise Exception('div unbalanced')
for feature in ['Agreement','Booking']:
 p=r/feature/'components/details/details.component.html';s=read(p);a=feature.lower();prefix='rental'+feature if feature=='Booking' else 'rentalAgreement'
 # Shared container-fill chain.
 s=s.replace(f'class="rental-{a}-editor-page"',f'class="sigma-editor-page rental-{a}-editor-page"')
 s=s.replace(f'class="rental-{a}-'+('page-card' if feature=='Booking' else 'editor-card')+'"','class="sigma-editor-panel"')
 s=s.replace(f'class="{a}-editor-content"' if feature=='Agreement' else 'class="rental-booking-editor-content"','class="sigma-editor-form"')
 s=s.replace(f'class="rental-{a}-form"','class="sigma-editor-form"')
 s=s.replace(f'class="{a}-workspace"','class="sigma-editor-body"')
 s=s.replace(f'class="{a}-details-groups"','class="sigma-editor-scroll"')
 s=s.replace(f'class="{a}-tab-panel"','class="sigma-editor-body"')
 s=s.replace(f'class="{a}-form-grid', 'class="sigma-editor-grid')
 s=s.replace(f'class="{a}-form-field', 'class="sigma-field')
 s=s.replace(' span-all"',' sigma-field--full"')
 s=s.replace(f'class="{a}-editor-footer"','class="sigma-editor-footer"')
 s=s.replace(f'class="{a}-back-button"','class="sigma-secondary-button sigma-icon-button"').replace(f'class="{a}-secondary-button"','class="sigma-secondary-button"')
 # One scroll region around document sections; sections retain intrinsic content, table owns horizontal overflow only.
 s=s.replace(f'class="{a}-details-section"','').replace(f'class="{a}-charges-section"','')
 s=s.replace(' [fill]="true"','').replace(' [fillHeight]="true"','').replace('maxHeight="100%"','maxHeight="none"')
 s=s.replace('<div class="sigma-editor-body">\n'+ ('          ' if feature=='Agreement' else '                ')+'<app-form-section', '<div class="sigma-editor-body">\n<div class="sigma-editor-scroll">\n<app-form-section',1)
 # Close added scroll just before closing workspace original div (after last charges section).
 marker='</app-form-section>\n'+('        </div>' if feature=='Agreement' else '              </div>')
 s=s.replace(marker,'</app-form-section>\n</div>\n'+('        </div>' if feature=='Agreement' else '              </div>'),1)
 # Nested former details scroll is now intrinsic content, global sections own chrome.
 s=s.replace('<div class="sigma-editor-scroll">\n'+ ('              ' if feature=='Agreement' else '                    ')+'<section','<div>\n<section',1)
 # shared states for handcrafted body alerts.
 s=re.sub(r'<div class="'+a+r'-editor-state"[^>]*>.*?</div>', '<app-state-message kind="loading" />',s,flags=re.S)
 s=re.sub(r'<div class="'+a+r'-editor-state is-error"[^>]*>.*?</div>', '<app-state-message kind="error" [message]="loadError()" /><button class="sigma-secondary-button" type="button" (click)="initialize()">{{ \'general.retry\' | translate }}</button>',s,flags=re.S)
 for err in ['saveError','tariffError','countriesError']:
  s=re.sub(r'<div class="'+a+r'-alert is-(?:error|warning)"[^>]*>[^<]*(?:<i[^>]*></i>)[^<]*{{\s*'+err+r'\(\).*?</div>', '<app-state-message kind="error" [message]="'+err+'()" />',s,flags=re.S)
 s=re.sub(r'<div class="booking-alert"><i.*?</div>', '<app-state-message kind="loading" message="rentalBooking.charges.loading" />',s,flags=re.S)
 # Calendars gain directive-owned format/manual validation/overlay defaults.
 def calendar(m):
  tag=m.group(0).replace('<p-calendar','<p-calendar appDatePicker').replace(' [showIcon]="true"','').replace('dateFormat="yy-mm-dd"','dateFormat="dd/mm/yy"')
  if '[showTime]="true"' not in tag: tag=tag[:-1]+' [dateInputMask]="true" placeholder="DD/MM/YYYY">'
  return tag
 s=re.sub(r'<p-calendar\b[^>]*>',calendar,s)
 s=s.replace('<input type="number"','<input appNumericFocus type="number"')
 s=re.sub(r'(<input\b[^>]*?) type="number"', lambda m:m.group(1)+' type="number"' if 'appNumericFocus' in m.group(1) else m.group(1)+' appNumericFocus type="number"',s)
 # Shared error presentation for existing individual validator hints.
 s=re.sub(r'@if \(form\.controls\.(\w+)\.[^\n]*?\) \{ <small>.*?</small> \}', lambda m:'<app-field-error [control]="form.controls.'+m.group(1)+'" [messages]="fieldMessages" />',s)
 s=re.sub(r'<small class="'+a+r'-charge-validation"[^>]*>.*?</small>','<app-field-error [control]="control.controls.rate" />',s,flags=re.S)
 # Avoid duplicate per-field error hosts formerly separating date-required/order.
 s=re.sub(r'(<app-field-error[^>]+/>)(\s*<app-field-error[^>]+/>)+',r'\1',s)
 # Shared translated options.
 names=['agreementTypes','fuelLevels','bookingTypes','documentTypes']
 for name in names:
  s=s.replace(f'[options]="{name}"',f'[options]="{name} | translateOptions" optionLabel="label"')
 s=s.replace('optionLabel="label" optionLabel="value"','optionLabel="label"').replace('driverType.value | translate','driverType.key | translate').replace('customerType.label | translate','customerType.key | translate')
 s=re.sub(r'<ng-template pTemplate="(?:selectedItem|item)" let-option>.*?</ng-template>','',s,flags=re.S)
 # Numeric read/derived badge belongs to shared table.
 s=s.replace(f'class="{a}-charge-total-value"','class="app-editable-collection-table__value app-editable-collection-table__value--highlight"')
 # Keep validated totals inputs in scroll but move the summary to the fixed outside region.
 for m in list(re.finditer(r'<div class="'+a+r'-total-card\b',s))[::-1]:
  x,y=div_bounds(s,m.start());s=s[:x]+s[y:]
 # Duration cards use public SummaryCards.
 if feature=='Booking':
  m=re.search(r'<div class="booking-duration-card\b',s)
  if m:
   x,y=div_bounds(s,m.start());s=s[:x]+'''<app-summary-cards [cards]="durationCards()" [ariaLabel]="'rentalBooking.totalDays' | translate" density="slim" layout="row" [minCardWidth]="140" [maxHeight]="80" />'''+s[y:]
 # Fixed totals below form region.
 footer=s.index('    @if (!loadingPage()')
 s=s[:footer]+f'''    @if (!loadingPage() && !loadError()) {{
      <app-summary-cards [cards]="summaryCards()" [ariaLabel]="'{prefix}.totalCharges' | translate" density="slim" layout="row" [minCardWidth]="140" [maxHeight]="80" />
    }}
'''+s[footer:]
 s=s.replace(f'class="{a}-totals-grid"','class="sigma-editor-grid"')
 if feature=='Booking':
  x=s.index('                          <div class="booking-document-path-control">'); y=s.index('\n                        </td>',x)
  s=s[:x]+'''                          <app-file-field [inputId]="'booking-document-file-' + index" folder="BookingDocuments" [control]="control.controls.documentPath" />'''+s[y:]
  s=s.replace('formControlName="documentType"', '[inputId]="\'booking-document-type-\' + index" formControlName="documentType"')
  s=s.replace('[primaryActionDisabled]', '[primaryActionDisabled]')
  s=s.replace('[disabled]="loadingTariff() || uploadingDocumentIndex() !== null"','[disabled]="!isEditable()"')
  s=s.replace('(activeTabChange)', '[disabled]="saving() || cleanupKind() !== null || uploads.uploading() !== null || uploads.cleaning() || documentRows.confirmationPending()" (activeTabChange)')
  s=s.replace('@if (saveError()) {','''@if (cleanupKind()) {
            <app-state-message kind="error" [message]="cleanupKind() === 'save' ? 'rentalBooking.savedCleanupPending' : 'rentalBooking.fileCleanupFailed'" />
            <button type="button" class="sigma-secondary-button" [disabled]="uploads.cleaning()" (click)="retryCleanup()">{{ 'general.retry' | translate }}</button>
          }
          @if (saveError()) {''')
 put(p,s)
 # Drop all local shell/control/card/table theme rules; retain print layout and business-specific detail arrangement only.
 p=r/feature/'components/details/details.component.scss';css=read(p)
 printcss=css[css.index('@media print'):]
 printcss=printcss.replace('.rental-booking-page-card > :not(.booking-print-only)', '.sigma-editor-panel > :not(.booking-print-only)').replace('.rental-agreement-editor-card > :not(.agreement-print-only)', '.sigma-editor-panel > :not(.agreement-print-only)')
 css='''/* Shared shell, fields, tables, summary and controls own their appearance. */
:host { min-height: 0; }
.booking-print-only, .agreement-print-only { display: none; }
.booking-secondary-fields, .booking-schedule-fields-grid { display: contents; }
.booking-charge-detail-row, .agreement-charge-detail-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.booking-charge-rate, .agreement-charge-rate { display: flex; align-items: center; gap: 8px; }
.booking-status-strip, .agreement-status-strip { display: flex; align-items: center; gap: 8px; }
.booking-radio-group, .agreement-radio-group { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.booking-field-group, .agreement-field-group { display: contents; }
'''+printcss
 put(p,css)
 # Supporting typed card content/messages.
 p=r/feature/'components/details/details.component.ts';s=read(p)
 s=s.replace('  summaryCards(): ReadonlyArray<SummaryCard> {',f"  readonly fieldMessages = {{ dateRange: '{prefix}.errors.dateRange', sameDriver: '{prefix}.errors.sameDriver' }};\n\n  summaryCards(): ReadonlyArray<SummaryCard> {{")
 if feature=='Booking':
  s=s.replace('  durationDays(): number {', '''  durationCards(): ReadonlyArray<SummaryCard> {
    return [
      { id: 'days', labelKey: 'rentalBooking.totalDays', icon: 'bi bi-calendar', accent: 'neutral', value: this.isView() ? (this.booking()?.totalDays ?? 0) : this.durationDays() },
      { id: 'hours', labelKey: 'rentalBooking.hours', icon: 'bi bi-clock', accent: 'neutral', value: this.isView() ? (this.booking()?.hours ?? 0) : this.durationHours() },
    ];
  }

  durationDays(): number {''')
 put(p,s)
