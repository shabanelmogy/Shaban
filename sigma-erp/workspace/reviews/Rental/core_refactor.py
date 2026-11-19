from pathlib import Path
import re

ROOT=Path('F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Rental')
SHARED='src/app/modules/shared/'
def read(p): return p.read_text(encoding='utf-8-sig')
def write(p,s): p.write_text(s,encoding='utf-8',newline='\n')
def method(s,name,replacement):
    pattern=r'^  (?:private |protected )?'+re.escape(name)+r'\([^\n]*'
    m=re.search(pattern,s,re.M)
    if not m: raise Exception('missing '+name)
    # Function body begins after its return type, which may contain generic braces only in other functions.
    start=s.index('{',m.end()-1) if '{' not in m.group() else m.start()+m.group().index('{')
    depth=1; i=start+1
    while depth:
        if s[i]=='{': depth+=1
        elif s[i]=='}': depth-=1
        i+=1
    return s[:m.start()]+replacement+s[i:]

for feature,prefix,reset,signalcols in [('Agreement','rentalAgreement','reset',False),('Booking','rentalBooking','clearFilters',False),('RentalQuotation','rentalQuotation','resetFilters',True),('MasterAgreement','masterAgreement','resetFilters',True)]:
    folder=ROOT/feature/'components/list'
    hp=folder/'list.component.html'; h=read(hp)
    h=re.sub(r'<section class="[^"]+-page">','<section class="sigma-list-page">',h,count=1)
    h=re.sub(r'<div class="(?:rental-agreement-panel|rental-booking-panel|quotation-panel|master-agreement-panel)">','<div class="sigma-list-panel">',h,count=1)
    h=h.replace('    <app-feature-title','    <header class="sigma-list-header">\n    <app-feature-title',1)
    # close title may be non-self-closing in all four.
    marker='</app-feature-title>'
    h=h.replace(marker,marker+'\n    </header>',1)
    h=re.sub(r'\bclass="(?:agreement-filter-field|rental-booking-filter-field|quotation-filter-field|master-agreement-filter-field)[^"]*"','class="sigma-filter-field"',h)
    # Boolean filter wrappers share checkbox presentation and explicit labels.
    h=re.sub(r'<label class="agreement-checkbox-field[^"]*" for="([^"]+)">\s*(<input[^>]+>)\s*<span>(.*?)</span>\s*</label>',r'<div class="sigma-filter-field sigma-filter-field--check">\n        \2\n        <label for="\1">\3</label>\n      </div>',h,flags=re.S)
    # Existing local advanced wrapper becomes shared projection; earlier excess fields join it.
    if feature=='Agreement':
        h=re.sub(r'\s*<details class="agreement-advanced-filter">\s*<summary>.*?</summary>\s*<div class="agreement-advanced-grid">','',h,flags=re.S)
        h=h.replace('        </div>\n      </details>','')
        # Main six: number/manual/branch/plate/permanent/date. Remaining fields are advanced.
        h=h.replace('      <div class="sigma-filter-field">\n        <label for="agreementCustomer">','      <ng-template appFilterAdvanced>\n      <div class="sigma-filter-field">\n        <label for="agreementCustomer">',1)
        h=h.replace('      <div class="rental-agreement-filter-actions">','      </ng-template>\n      <ng-container appFilterActions>')
        h=re.sub(r'\s*<button\b[^>]*\(click\)="reset\(\)".*?</button>','',h,flags=re.S)
        h=h.replace('      </div>\n    </form>','      </ng-container>\n    </form>',1)
        advanced=['customerId','status','type','masterAgreementNo','createdBy','salesPersonId','poNo','ownership','saleOriginId','projectId','overDueClosing','vehicleCheckedInButAgreementDueToClose','isComplimentary']
    elif feature=='Booking':
        h=h.replace('      <div class="sigma-filter-field">\n        <label for="booking-customer-filter">','      <ng-template appFilterAdvanced>\n      <div class="sigma-filter-field">\n        <label for="booking-customer-filter">',1)
        h=h.replace('      <div class="rental-booking-filter-actions">','      </ng-template>\n      <ng-container appFilterActions>')
        h=re.sub(r'\s*<button\b[^>]*\(click\)="clearFilters\(\)".*?</button>','',h,flags=re.S)
        h=h.replace('      </div>\n    </form>','      </ng-container>\n    </form>',1)
        advanced=['customerId','createdBy','salesPersonId','saleOriginId','branchId']
    else:
        h=re.sub(r'<div class="(?:quotation-filter-actions|master-agreement-filter-actions)">','<ng-container appFilterActions>',h)
        h=h.replace('      </div>\n    </form>','      </ng-container>\n    </form>',1)
        advanced=[]
    formattrs=f'appFilterPanel [stableLayout]="true" [busy]="loadingList()" (resetRequested)="{reset}()"'
    if advanced: formattrs+=' [advancedControls]="advancedFilterNames" [(advancedOpen)]="advancedFiltersVisible"'
    h=h.replace('[formGroup]="filterForm"',formattrs+'\n      [formGroup]="filterForm"',1)
    h=re.sub(r'class="(?:agreement-secondary-action|rental-booking-secondary-action|quotation-secondary-button|master-agreement-secondary-button|quotation-error-retry)"','class="sigma-secondary-button"',h)
    h=re.sub(r'class="(?:agreement-alert|rental-booking-alert) is-warning"','class="sigma-alert sigma-alert--warning"',h)
    h=re.sub(r'class="(?:agreement-alert|rental-booking-alert) is-error"','class="sigma-alert"',h)
    h=h.replace('class="quotation-list-error"','class="sigma-alert"').replace('class="master-agreement-error"','class="sigma-alert"')
    h=h.replace('<p-calendar','<p-calendar appDatePicker').replace('[readonlyInput]="true"','[readonlyInput]="false" [keepInvalid]="true"')
    h=re.sub(r'\s*\[showIcon\]="true"','',h)
    if '[numberOfMonths]' not in h: h=h.replace('selectionMode="range"','selectionMode="range" [numberOfMonths]="2"')
    if 'panelStyleClass="sigma-datepicker-panel"' not in h: h=h.replace('selectionMode="range"','panelStyleClass="sigma-datepicker-panel" selectionMode="range"')
    if '[showButtonBar]' not in h: h=h.replace('selectionMode="range"','[showButtonBar]="true" selectionMode="range"')
    h=re.sub(r'(</p-calendar>)',r'\1\n        <app-field-error [control]="filterForm.controls.dateRange" reserveMessage="validationMessages.date" />',h)
    # Shared types replace formatting-only cell templates/status chrome.
    h=re.sub(r'\s*<ng-template #(statusTemplate|dateTemplate|amountTemplate|internalApprovalTemplate|customerApprovalTemplate|masterAgreementNoTemplate)\b.*?</ng-template>','',h,flags=re.S)
    h=re.sub(r'\s*<ng-template #numberTemplate\b.*?</ng-template>','',h,flags=re.S)
    h=h.replace('    <app-data-table','    <div class="sigma-list-table">\n    <app-data-table [fill]="true"',1)
    h=h.replace('</app-data-table>','</app-data-table>\n    </div>',1)
    write(hp,h)
    write(folder/'list.component.scss','')
    tp=folder/'list.component.ts'; s=read(tp)
    imports=f"import {{ FilterPanelComponent, FilterAdvancedDirective, FilterActionsDirective }} from '{SHARED}components/filter-panel/filter-panel.component';\nimport {{ DatePickerDirective }} from '{SHARED}directives/date-picker.directive';\nimport {{ FieldErrorComponent }} from '{SHARED}components/field-error/field-error.component';\nimport {{ currentMonthRange, dateRangeValidator, parseDateRange, formatDisplayDate }} from '{SHARED}utils/date-utils';\nimport {{ composedReadErrorMessage }} from '{SHARED}utils/api-error';\nimport {{ dataTableExportRows }} from '{SHARED}components/data-table/data-table.export';\n"
    s=imports+s
    s=s.replace("import { DEFAULT_PAGE_SIZE }", "import { DEFAULT_PAGE_SIZE, resolveListPaging }")
    s=s.replace('  standalone: true,','  standalone: true,\n  host: { class: \'sigma-route-host\' },',1)
    s=s.replace('  imports: [','  imports: [\n    FilterPanelComponent, FilterAdvancedDirective, FilterActionsDirective, DatePickerDirective, FieldErrorComponent,',1)
    s=re.sub(r'  readonly rowsPerPageOptions = \[[^\]]+\];','  readonly rowsPerPageOptions = [10, 15, 20, 50, 100];',s)
    s=re.sub(r'(dateRange: this\.(?:fb|formBuilder)\.control)<Date\[\] \| null>\([^\n]+\),',r'\1<Date[] | string | null>(currentMonthRange(), dateRangeValidator),',s)
    if advanced: s=s.replace('  readonly filterForm =',f'  readonly advancedFilterNames = {advanced!r};\n  advancedFiltersVisible = false;\n\n  readonly filterForm =',1)
    s=s.replace('dateRange: null,','dateRange: currentMonthRange(),')
    s=s.replace('this.activeFilters = {};','this.activeFilters = this.buildFilters();')
    # Initial request applies defaults (Agreement/Booking already own an applied query snapshot).
    if feature in ['Agreement','Booking']:
        s=s.replace('    this.loadOptions();\n    this.requestList();','    this.loadOptions();\n    this.activeFilters = this.buildFilters();\n    this.requestList();',1)
    s=s.replace('  search(): void {','  search(): void {\n    if (this.filterForm.invalid) {\n      this.filterForm.markAllAsTouched();\n      return;\n    }',1)
    cols='this.columns()' if signalcols else 'this.columns'
    typ={'Agreement':'RentalAgreementSortField','Booking':'BookingSortField','RentalQuotation':'RentalQuotationSortField','MasterAgreement':'MasterAgreementSortField'}[feature]
    s=method(s,'onLazyLoad',f'''  onLazyLoad(event: TableLazyLoadEvent): void {{
    const paging = resolveListPaging(event, {{ pageNo: this.pageNo(), pageSize: this.pageSize() }});
    const candidate = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    const field = this.isSortField(candidate) ? candidate : this.sortField();
    const order = event.sortOrder === 1 || event.sortOrder === -1 ? event.sortOrder : this.sortOrder();
    if (!paging.changed && field === this.sortField() && order === this.sortOrder()) return;
    this.pageNo.set(paging.pageNo);
    this.pageSize.set(paging.pageSize);
    this.sortField.set(field);
    this.sortOrder.set(order);
    this.requestList();
  }}''')
    s=method(s,'isSortField',f'''  private isSortField(value: unknown): value is {typ} {{
    return {cols}.some((column) => column.sortable && column.field === value);
  }}''')
    # Remove custom message formatter and call the shared safe composed-read formatter.
    for name in ['extractErrorMessage','errorMessageFrom']:
        if re.search(r'^  private '+name+r'\(',s,re.M): s=method(s,name,'')
        s=s.replace('this.'+name+'(','composedReadErrorMessage(')
    # Common date transport instead of feature local parsing.
    if feature in ['Agreement','Booking']:
        s=s.replace('const [dateFrom, dateTo] = value.dateRange ?? [];','const [dateFrom, dateTo] = parseDateRange(value.dateRange);')
        s=s.replace('this.formatDateFilter(dateFrom)','dateFrom').replace('this.formatDateFilter(dateTo)','dateTo')
        s=method(s,'formatDateFilter','')
        s=s.replace("import { CommonModule, DatePipe }", "import { CommonModule }")
        s=s.replace('  providers: [DatePipe],\n','').replace('  private readonly datePipe = inject(DatePipe);\n','')
        s=re.sub(r'value: \(row\) => this\.(?:datePipe\.transform\(row\.pickUp, \'dd/MM/yyyy HH:mm\'\) \?\? \'\'|formatDate\(row\.(?:dateAndTime|returnDateAndTime)\))',"type: 'dateTime'",s)
    if feature in ['RentalQuotation','MasterAgreement']:
        # Shared date range is snapshotted on Search so edits do not alter paging/export.
        filtertype='RentalQuotationListFilters' if feature=='RentalQuotation' else 'MasterAgreementListFilters'
        s=s.replace('  private requestSequence = 0;','  private requestSequence = 0;')
        anchor='  readonly filterForm ='
        s=s.replace(anchor,f'  private activeFilters: {filtertype} = {{}};\n\n'+anchor,1)
        s=s.replace('    this.pageNo.set(1);\n    this.requestList();','    this.activeFilters = this.currentFilters();\n    this.pageNo.set(1);\n    this.requestList();',1)
        # First request follows the initially defined defaults.
        s=s.replace('    this.requestList();\n  }\n\n  ', '    this.activeFilters = this.currentFilters();\n    this.requestList();\n  }\n\n  ',1)
        s=s.replace('filters: this.currentFilters(),','filters: { ...this.activeFilters },')
        s=s.replace('.getAllList(this.currentFilters())','.getAllList(this.activeFilters, this.sortField(), this.sortOrder())')
        s=s.replace('fromDate: this.toLocalDate(dateRange?.[0]),','fromDate: parseDateRange(dateRange)[0],').replace('toDate: this.toLocalDate(dateRange?.[1]),','toDate: parseDateRange(dateRange)[1],')
        if re.search(r'^  private toLocalDate\(',s,re.M): s=method(s,'toLocalDate','')
        resetbody='quotationNo: \'\', customerId: null, branchId: null, dateRange: currentMonthRange(), internalApproval: null, customerApproval: null' if feature=='RentalQuotation' else "masterAgreementNo: '', approvalStatus: null, quotationRefNo: '', dateRange: currentMonthRange(), customerId: null"
        s=s.replace('  search(): void {',f'''  resetFilters(): void {{
    this.filterForm.reset({{ {resetbody} }});
    this.search();
  }}

  search(): void {{''',1)
    # Format-only templates are no longer needed.
    s=re.sub(r'  @ViewChild\([^\n]+\)\s*(?:protected[^;]+;)', '',s)
    s=re.sub(r'\n    const statusColumn = this.columns.find.*?\n\n','\n',s,flags=re.S)
    # DataTableStatus inference remains contextual through column property.
    if feature=='Agreement':
        s=s.replace("sortable: true, value: (row) => this.translate.instant(this.statusKey(row.status))", "sortable: true, type: 'status', status: (row) => ({ label: this.statusKey(row.status), tone: row.status === 'Open' ? 'success' : row.status === 'Voided' ? 'danger' : row.status === 'Invoiced' ? 'info' : 'neutral' })")
        for field in ['rate','totalCharges','advance','deposit']:
            s=re.sub(r"(field: '"+field+r"', header: '[^']+', sortable: true)(?:, value: \(row\) => row\.rate)?",r"\1, type: 'money'",s)
        s=method(s,'formatDate',"  private formatDate(value: string | null | undefined): string {\n    return formatDisplayDate(value, true);\n  }")
        s=method(s,'mapExportRow','')
        s=method(s,'exportRowsToExcel','''  private exportRowsToExcel(detailed: boolean): void {
    if (this.exporting() || this.loadingList()) return;
    this.exporting.set(true);
    this.errorMessage.set('');
    this.loading.startLoading();
    this.agreementService.getAllList(this.listQuery()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.exporting.set(false);
        this.loading.endLoading();
      }),
    ).subscribe({
      next: (items) => {
        if (!items.length) {
          if (this.totalRecords() > 0) this.errorMessage.set('rentalAgreement.errors.export');
          return;
        }
        const rows = detailed
          ? items.map((row) => this.mapDetailedExportRow(row))
          : dataTableExportRows(items, this.columns, (key) => this.translate.instant(key));
        onExportToExcel(signal(rows), detailed ? 'RentalAgreementsDetailed' : 'RentalAgreements');
      },
      error: (error: unknown) => this.errorMessage.set(composedReadErrorMessage(error, 'rentalAgreement.errors.export')),
    });
  }''')
        # Use authoritative server count only.
        s=re.sub(r'    // Keep the paginator useful.*?    if \(rows.length',"    const total = Math.max(0, Number(result.totalCount ?? 0));\n    if (rows.length",s,flags=re.S)
        s=s.replace('this.totalRecords.set(total || rows.length);','this.totalRecords.set(total);')
    elif feature=='Booking':
        s=s.replace("      value: (row) => this.translate.instant(this.statusKey(row.status)),","      type: 'status',\n      status: (row) => ({ label: this.statusKey(row.status), tone: row.status === BookingStatus.Confirmed ? 'success' : row.status === BookingStatus.Cancelled || row.status === BookingStatus.NoShow ? 'danger' : 'neutral' }),")
        s=s.replace('signal(this.mapExportRows(rows))','signal(dataTableExportRows(rows, this.columns, (key) => this.translate.instant(key)))')
        s=method(s,'mapExportRows','')
        s=re.sub(r'error instanceof Error && error.message\s*\? error.message\s*: this.translate.instant\(\'rentalBooking.errors.export\'\)',"composedReadErrorMessage(error, 'rentalBooking.errors.export')",s)
    elif feature=='RentalQuotation':
        s=s.replace('cellTemplate: this.numberTemplate',"value: (row) => row.no || String(row.id), link: { label: (row) => row.no || String(row.id), action: (row) => this.view(row), enabled: () => !this.listBusy() }")
        s=s.replace('cellTemplate: this.dateTemplate',"type: 'date'").replace('cellTemplate: this.amountTemplate',"type: 'money'")
        for axis in ['internal','customer']:
            s=s.replace('cellTemplate: this.'+axis+'ApprovalTemplate',"type: 'status', status: (row) => ({ label: this."+axis+"ApprovalKey(row."+axis+"Approval), tone: this.approvalClass(row."+axis+"Approval) === 'is-approved' ? 'success' : this.approvalClass(row."+axis+"Approval) === 'is-rejected' ? 'danger' : 'neutral' })")
        s=re.sub(r'          const rows = items.map\(\(row\) => \(\{.*?          \}\)\);',"          const rows = dataTableExportRows(items, this.columns(), (key) => this.translate.instant(key));",s,flags=re.S)
    else:
        s=s.replace('cellTemplate: this.masterAgreementNoTemplate,',"value: (row) => row.masterAgreementNo,").replace('cellTemplate: this.dateTemplate,',"type: 'dateTime',")
        # Freeze includes approvalStatus as a distinct final column.
        s=s.replace("        field: 'quotationNo',", "        field: 'quotationNo',",1)
        start=s.index('  private initColumns()'); stop=s.index('  private initActions()',start)
        chunk=s[start:stop].replace('    ]);',"      { field: 'approvalStatus', header: 'masterAgreement.approvalStatus', sortable: true, type: 'status', status: (row) => ({ label: this.statusKey(row.approvalStatus), tone: row.approvalStatus === ApprovalStatus.Approved ? 'success' : row.approvalStatus === ApprovalStatus.Rejected ? 'danger' : 'neutral' }) },\n    ]);")
        s=s[:start]+chunk+s[stop:]
        s=re.sub(r'          const rows = items.map\(\(row\) => \(\{.*?          \}\)\);',"          const rows = dataTableExportRows(items.map((row) => this.toGridRow(row)), this.columns(), (key) => this.translate.instant(key));",s,flags=re.S)
        s=method(s,'defaultDateRange','')
        s=method(s,'formatDate','')
        s=re.sub(r'          this.showSuccess\([^\n]+\);\n','',s)
        s=method(s,'showSuccess','')
    # Shared inline errors (read headers handled below); mutation errors are interceptor-owned.
    if feature in ['MasterAgreement','RentalQuotation']:
        s=method(s,'showError','  private showError(message: string): void {\n    this.errorMessage.set(message);\n  }')
        s=s.replace("import { MessageService } from 'primeng/api';\n",'').replace('  private readonly messageService = inject(MessageService);\n','')
    # All global counters finalize, even stale reads; deferred construction follows Job's request owner.
    s=s.replace('switchMap((query) => {','switchMap((query) => defer(() => {')
    s=s.replace('        }),\n        takeUntilDestroyed', '        })),\n        takeUntilDestroyed')
    s=s.replace('      }),\n      takeUntilDestroyed', '      })),\n      takeUntilDestroyed')
    s=s.replace('              if (sequence !== this.requestSequence) return;\n              this.loadingList.set(false);\n              this.loading.endLoading();','              this.loading.endLoading();\n              if (sequence === this.requestSequence) this.loadingList.set(false);')
    if 'defer' not in re.search(r"import \{[^}]+\} from 'rxjs';",s,re.S).group():
        s=s.replace('Subject, catchError,','Subject, defer, catchError,')
    # Clean unused template declarations/types from imports.
    for symbol in ['DataTableCellContext','TemplateRef','ViewChild']:
        s=re.sub(r'\b'+symbol+r',\s*','',s)
    write(tp,s)
