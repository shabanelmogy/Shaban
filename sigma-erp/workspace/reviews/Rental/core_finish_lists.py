exec(open('F:/My Work/Sigma/reviews/Rental/core_refactor.py',encoding='utf-8').read().split('for feature,prefix')[0])

for feature in ['Agreement','Booking','RentalQuotation','MasterAgreement']:
    p=ROOT/feature/'components/list/list.component.ts'; s=read(p)
    s=s.replace('data-table/data-table.export','data-table/data-table.component')
    s=s.replace("link: { label: (row) => row.no || String(row.id), action: (row) => this.view(row)", "link: { activate: (row) => this.view(row)")
    if feature!='Agreement': s=s.replace(', formatDisplayDate }',' }')
    s=re.sub(r'\n\s*\n\s*\n','\n\n',s)
    if feature=='MasterAgreement':
        s=s.replace('private activeFilters: MasterAgreementListFilters = {};',"private activeFilters: MasterAgreementListFilters = { masterAgreementNo: null, approvalStatus: null, quotationRefNo: null, fromDate: null, toDate: null, customerId: null };")
        s=s.replace("field: 'approvalStatus', header: 'masterAgreement.approvalStatus', sortable: true", "field: 'approvalStatus', header: 'masterAgreement.approvalStatus'")
    if feature=='RentalQuotation':
        # Existing currentFilters still read dateRange directly until this migration.
        s=s.replace('this.toLocalDate(value.dateRange?.[0])','parseDateRange(value.dateRange)[0]').replace('this.toLocalDate(value.dateRange?.[1])','parseDateRange(value.dateRange)[1]')
        # Full export owns a distinct busy state; list state is solely the request stream owner.
        s=s.replace("  readonly actionSubmitting = signal(false);", "  readonly exporting = signal(false);\n  readonly actionSubmitting = signal(false);")
        a=s.index('  exportToExcel()'); b=s.index('  approvalClass(',a)
        c=s[a:b].replace('this.loadingList.set(true)','this.exporting.set(true)').replace('this.loadingList.set(false)','this.exporting.set(false)')
        c=c.replace("          onExportToExcel(signal(rows), 'RentalQuotations');", "          if (!rows.length) {\n            if (this.totalCount() > 0) this.errorMessage.set('rentalQuotation.errors.export');\n            return;\n          }\n          onExportToExcel(signal(rows), 'RentalQuotations');")
        s=s[:a]+c+s[b:]
        s=s.replace('return this.loadingList() || this.actionSubmitting()', 'return this.loadingList() || this.exporting() || this.actionSubmitting()')
    if feature=='Booking':
        s=s.replace("if (rows.length > 0) onExportToExcel(signal(dataTableExportRows(rows, this.columns, (key) => this.translate.instant(key))), 'RentalBookings');", "if (!rows.length) {\n            if (this.totalRecords() > 0) this.errorMessage.set('rentalBooking.errors.export');\n            return;\n          }\n          onExportToExcel(signal(dataTableExportRows(rows, this.columns, (key) => this.translate.instant(key))), 'RentalBookings');")
    # Mutations on Agreement/Booking retain the interceptor owner and local state only.
    if feature in ['Agreement','Booking']:
        a=s.index('  private runMutation('); b=s.index('  private ',a+15)
        c=s[a:b]
        c=re.sub(r'this.errorMessage.set\(result.message \|\| \'[^\']+\'\);', '// The interceptor owns the business failure.',c)
        c=re.sub(r'error: \(error: HttpErrorResponse\) =>\s*this.errorMessage.set\(composedReadErrorMessage\(error, \'[^\']+\'\)\)',"error: () => this.mutationId.set(null)",c)
        s=s[:a]+c+s[b:]
    if feature=='Agreement':
        s=s.replace('getSelectList<Results<DropDownSelect>>()','getSelectList<Results<DropDownSelect>>({ skipErrorInterceptor: true })')
    if feature in ['Agreement','Booking']: s=s.replace('  private loadOptions():','  loadOptions():')
    if feature=='MasterAgreement': s=s.replace('  private loadCustomers():','  loadCustomers():')
    if feature=='RentalQuotation': s=s.replace('  private loadLookups():','  loadLookups():')
    write(p,s)
    hp=p.with_suffix('.html'); h=read(hp)
    if feature in ['Agreement','Booking']:
        h=h.replace('    @if (errorMessage()) {', '      <button type="button" class="sigma-secondary-button" [disabled]="loadingOptions()" (click)="loadOptions()">{{ \'general.retry\' | translate }}</button>\n    @if (errorMessage()) {',1)
        # retry belongs only to the lookup warning condition
        h=h.replace('      </div>\n    }\n      <button','      </div>\n      <button',1).replace("{{ 'general.retry' | translate }}</button>\n    @if", "{{ 'general.retry' | translate }}</button>\n    }\n    @if",1)
    write(hp,h)

for feature,servicefile in [('Agreement','agreement'),('Booking','booking'),('RentalQuotation','rentalquotation'),('MasterAgreement','masteragreement')]:
    p=ROOT/feature/f'services/{servicefile}.service.ts'; s=read(p)
    if feature in ['Agreement','Booking']:
        if feature=='Booking': s=s.replace('import { HttpParams }', 'import { HttpHeaders, HttpParams }')
        s=s.replace('      params: this.buildListParams(query),', "      params: this.buildListParams(query),\n      headers: new HttpHeaders().set('X-Skip-Error-Interceptor', 'true'),",1)
        s=s.replace('    return toListParams(query);', "    return toListParams(query).delete('pageNo').delete('pageSize')\n      .set('PageNo', String(query.pageNo)).set('PageSize', String(query.pageSize));")
        if feature=='Agreement':
            s=s.replace('import { toListParams }', 'import { fetchAllPages, toListParams }')
            anchor='  getDetails('
            s=s.replace(anchor,"  getAllList(query: RentalAgreementListQuery): Observable<RentalAgreementListDTO[]> {\n    return fetchAllPages(\n      (pageNo) => this.getList({ ...query, pageNo, pageSize: 200 }),\n      'rentalAgreement.errors.export',\n    );\n  }\n\n"+anchor,1)
        else:
            s=s.replace("return this.http.get<Result<BookingOptionsDTO>>(`${this.endpoint}/options`);", "return this.http.get<Result<BookingOptionsDTO>>(`${this.endpoint}/options`, {\n      headers: new HttpHeaders().set('X-Skip-Error-Interceptor', 'true'),\n    });")
            for name,typ,verb in [('createBooking','BookingCreateDTO','post'),('updateBooking','BookingUpdateDTO','put')]:
                s=method(s,name,f'''  {name}(payload: {typ}, options?: {{ skipSuccessToast?: boolean }}): Observable<Result<null>> {{
    return this.http.{verb}<Result<null>>(this.endpoint, payload,
      options?.skipSuccessToast ? {{ headers: {{ 'X-Skip-Success-Toast': 'true' }} }} : {{}});
  }}''')
    else:
        sorttype='RentalQuotationSortField' if feature=='RentalQuotation' else 'MasterAgreementSortField'
        s=s.replace(f'  {feature}ListQuery,',f'  {feature}ListQuery,\n  {sorttype},')
        s=s.replace(f'    filters: {feature}ListFilters,',f"    filters: {feature}ListFilters,\n    sortField: {sorttype} = 'date',\n    sortOrder: 1 | -1 = -1,")
        s=s.replace("pageSize: 200, sortField: 'date', sortOrder: -1",'pageSize: 200, sortField, sortOrder')
    write(p,s)
