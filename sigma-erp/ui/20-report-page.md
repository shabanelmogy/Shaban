## 20. Report page

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Accounts family composition](20/01-accounts-family.md)
- [Shared shell, filter/totals visual invariant and title width](20/02-shell-and-visual-invariants.md)
- [Shared summary/KPI cards](20/03-summary-cards.md)
- [Tabbed report sections](20/04-tabbed-sections.md)
- [Dense accounting tree/report table](20/05-accounting-tree-table.md)

> **Status: Canonical composite** — shared page/actions plus shared report filter/summary visual language; feature-owned contracts, data and calculations

A report is **not** a CRUD list. The canonical document shape has no row actions
or server paging. The user picks filters, presses Search, and gets one document with
sections and totals. Reference:
`Customers/StatementOfAccount/components/list/`.

Sibling reports that follow the same shape: `Customers/BalancesSummary`,
`Customers/ReceivableAgeAnalysis`, `Suppliers/SupplierStatementOfAccount`,
`Staff/StaffStatementOfAccount`.

An existing report API can paginate its response; inspect it before adopting the
unpaged document presentation. That transport contract is not changed by importing
a shared grid. Preserve/freeze the existing request, counts and totals scope, then
choose server paging or an explicitly complete collection for local presentation
paging. Do not introduce server paging into an already complete report merely to
reuse a grid, or infer completeness from Result<T> rather than Results<T>.

**Owner-requested incremental transport.** An explicit request to
load a report while scrolling may introduce an additive paged read alongside its
complete read after freezing the filter, slot/order/count/summary/output contract.
It remains a read-only report. Limousine Utilization is the scoped adoption:
first120 chronological calendar rows, then append on scroll using UI6's shared
incremental capability. Retain zero-activity calendar slots and the366-day bound.
The first response returns authoritative totals for the whole filter period;
later windows do not recompute or replace that summary. A partial collection
never supplies whole-report local column filtering/sorting. Changing filters or
tenant clears rows/summary/errors, cancels reads and rejects stale/duplicate or
out-of-order windows. Failure of a later page retains accepted rows with Retry.
Every data read owns UI22's page loader; references retain their current owners.

Print/Excel explicitly read and validate the complete report for the applied
filter, even if only the first window has loaded. Never export the partial view
or derive the total by summing loaded rows. Print uses a separate full-output
array under ReportPrintSession, preserves the screen collection and releases
print state on afterPrint/cancel/context. A live multi-request operational report
is not a transactionally frozen database snapshot; a new Search refreshes its
summary/windows, and complete output uses its own fresh complete response. Do not
introduce a report/financial cache or invented snapshot token to conceal this.
Record payload/render/query tradeoffs and pending timings under UI29.

Every report table in new or reviewed report work uses typed `app-data-table`
columns. Existing reports migrate when their report is in scope; this rule does
not authorize a bulk rewrite of reports outside the current review. The shared
grid does not change the report's semantics: for a proven complete response use
`lazy=false`; for an existing paged response preserve `lazy=true`, server
paging and authoritative counts. Keep the complete dataset proof where the
report promises full output, backend-owned totals, section hierarchy, print
flow and applied-filter scope.
When a report needs a capability the shared grid does not yet provide, extend
the shared component in that report's scoped implementation. Do not flatten a
hierarchy or silently authorize a feature-owned table.


### Required report review evidence

For a reviewed family of reports with the same read-only lifecycle, a typed
feature-family composition may share the form/request/print/export code and
template while each consumer owns its columns, filters, lookups and returned
totals. It still composes the canonical ReportPage, FeatureTitle, DataTable and
SummaryCards owners; it does not create a second visual pattern or infer data
completeness. StockReports uses `stockReports/shared/StockReportPage` and its
typed `StockReportConfig` for eight consumers (2026-10-04). Every reader requests
the frozen complete-response opt-in, and the composition checks both the flag
and matching row count before enabling output. Adapt DataTable's typed
`pageSize` event to the `rows` input expected by `resolveListPaging` before
writing local paging state. Backend formulas and source limitations remain in
the feature contract. This adoption is source-only; owner runtime and visual
acceptance remain pending.

Record these rows in the existing feature review, with actual frontend/backend
file symbols, the confirmed contract and a match/finding/Uncertain result. Phase 2
produces them and Phase 6 compares them against final source; imports/class names
and a previous review's "Matched" claim do not supply the evidence (Master 5).

| Concern | Required source comparison |
|---|---|
| Dataset and totals scope | Actual request page/size and backend clamp/Skip/Take (or absence), response rows/count/page metadata and scope of each total. For local paging prove the collection complete; for server paging use actual counts. Trace print/Excel to all matching rows with the same applied filter, including failure of any later page (6/8/21, BE 17). |
| Conditional filter controls | Trace every formControlName, including @if/tab/expanded filters, to its actual FormGroup ancestor and typed control. Do not close the form before projected conditional controls without explicitly binding that same group. Keep one Search submit contract. |
| Applied filter lifetime | Freeze valid filters on Search. Disable/enable the reactive form through its API around requests, with emitEvent=false; template disabled bindings alone are not the reactive busy contract. On user filter changes invalidate rows/totals and disable print/Excel until the next successful Search, unless an explicit applied-filter display identifies retained results. Reset not-run/error/paging state and prevent late responses restoring invalidated output (28). |
| Conditional business filters | Record toggle-off/default behavior, types and validation. Custom aging boundaries are positive increasing integers checked at both boundaries (BE 17); their effective applied values label grid, summary, print and Excel. Do not label custom values with fixed default ranges or send hidden custom values as effective defaults. The feature owns its exact boundaries/formula. |
| Dates and language | Confirm appDatePicker plus the required single-date dateInputMask/placeholder recipe (17), valid control state and shared serialization before Search. Resolve dropdown enum labels, display statuses and export headers in the active language rather than storing translated labels only at initialization (16/23). |
| Busy, failure and empty states | Trace declared and transport failures for report and lookups, one feedback owner and the matching skip header for inline errors (22), visible recovery, and distinct not-run/empty/error output. Mark narrow-layout and print/runtime acceptance pending unless actually authorized and performed (29). |

These are focused read-path checks; they add no permission beyond the standing
scoped build/test/lint permission (Master5) and do not authorize browser/DB
commands or changes to unrelated consumers. A known mismatch remains a finding;
updating this book does not repair the application.

### Unpaged document contract example

One typed filter, one typed response holding every section:

```ts
export interface CustomerStatementFilter {
  customerId: number | string;
  fromDate: string;
  toDate: string;
  reportType: CustomerStatementReportType;   // 'ledger' | 'outstanding'
  includeInactive: boolean;
}

export interface CustomerStatement {
  contact: CustomerStatementContact;
  beginningBalance: number;
  totalDebit: number;
  totalCredit: number;
  endingBalanceTill: number;
  currentBalance: number;
  outstandingTotal: number;
  ageingSummary: StatementAgeingSummary | null;
  ledgerLines: StatementLedgerLine[];
  deposits: StatementDeposit[];
  pendingPDCs: StatementPendingPDC[];
  advanceTaxInvoiceLines: StatementLedgerLine[];
}
```

**All totals come from the response**, never summed in the template. A report
service is thin — one `GET`, same `Filters[key]` convention. This unpaged example
uses `Result<T>`; inspect existing endpoints rather than treating that type as proof
that their rows are complete:

```ts
@Injectable({ providedIn: 'root' })
export class CustomerStatementOfAccountService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}Customer/Statement`;

  getStatement(filter: CustomerStatementFilter): Observable<Result<CustomerStatement>> {
    return this.http.get<Result<CustomerStatement>>(this.endpoint, {
      params: toFilterParams(filter),
      headers: { 'X-Skip-Error-Interceptor': 'true' }, // inline report error owner (block 22)
    });
  }
}
```

### Derived operational summary reports

A report that combines KPI-style summary sections with a detail table still
uses this report pattern. It is not a paged list, and its detail table uses
typed `app-data-table` columns with the complete response rows. Use one typed
response containing every ordered summary section and the detail rows. The
template only formats values returned by the backend.

When the supplied evidence shows summary labels but not their calculations,
freeze a named backend derivation before implementing the screen. Record every
proxy (for example, how internal versus outside work or open versus closed jobs
is identified), the date boundary, the source entity, and the age buckets in
the feature handoff. Never fill an unconfirmed section with zeroes or derive a
different total for screen, print, and export.

Use the shared report shell and the current filter/action style:

- keep `app-feature-title` inside the report panel;
- place the complete typed filter form in one `no-print` row;
- for a single-day report, use one `p-datepicker`, default it to today, require
  the value, and serialize it from local year/month/day parts;
- place Print, Export and Refresh/Search in one `appReportActions` toolbar;
- use typed `app-data-table` columns for report rows and the shared responsive
  scroll/print inputs, not list paging or row actions;
- show loading, inline error, empty-summary, and empty-detail states; and
- make solid action and title icons explicitly white in light and dark themes.

`Fleet/DailyServiceLogs/` is the baseline for the single-date operational
summary shape. Its ordered response arrays carry stable metric codes so labels
remain translated while calculation ownership stays on the backend.

### Filter bar

Date range as one control, `no-print` on the whole form, and the form disabled while the report
runs. Disable it with `filterForm.disable({ emitEvent: false })` and re-enable it in `finalize`,
not with `[disabled]` on a reactive control. The snippet shows the semantics of the Statement of
Account; its `statement-*` presentation classes are legacy, and a reviewed report uses the shared
strip above:

```html
<form class="statement-filters no-print" [formGroup]="filterForm" (ngSubmit)="search()">
  <div class="statement-filter-grid">
    <div class="statement-field statement-date-field">
      <label for="statementDateRange">{{ 'customerStatement.dateRange' | translate }}</label>
      <p-datepicker
        inputId="statementDateRange"
        formControlName="dateRange"
        selectionMode="range"
        [numberOfMonths]="2"
        dateFormat="dd/mm/yy"
        [readonlyInput]="false"
        [keepInvalid]="true"
        [showClear]="true"
        [showButtonBar]="true"
        [hideOnDateTimeSelect]="false"
        panelStyleClass="sigma-datepicker-panel statement-range-picker"
        [disabled]="loadingReport()"
        appendTo="body"
      ></p-datepicker>
    </div>
    …customer dropdown, include-inactive checkbox…
  </div>

  <div class="statement-filter-footer">
    <div class="statement-report-types">
      <label>
        <p-radioButton formControlName="reportType" value="ledger"
                       [disabled]="loadingReport()"></p-radioButton>
        <span>{{ 'customerStatement.ledgerReport' | translate }}</span>
      </label>
      …outstanding…
    </div>

    <div
      appReportActions
      class="statement-actions"
      [ariaLabel]="'general.actions' | translate"
    >
      <button type="button" (click)="print()" [disabled]="!report() || loadingReport()">…</button>
      <button type="button" (click)="exportToExcel()"
              [disabled]="!ledgerLines().length || loadingReport()">…</button>
      <button type="button" (click)="refresh()" [disabled]="loadingReport()">…</button>
    </div>
  </div>
</form>
```

For a range calendar, keep the popup open after the first date is selected so
the user can select the end date from the same control:

```html
<p-datepicker selectionMode="range" [hideOnDateTimeSelect]="false"></p-datepicker>
```

Keep the range value date-based and make both dates easy to choose when the
range spans more than one month:

```html
<p-datepicker
  selectionMode="range"
  dataType="date"
  [numberOfMonths]="2"
  rangeSeparator=" - "
></p-datepicker>
```

Default the range to the **current month**, from the 1st to its last day, the same as lists: `dateRange: this.fb.control<Date[] | string | null>(currentMonthRange())`.

**Explicit owner exception, 2026-10-02:** Customer Statement starts and resets with
null date range/customer, so the user can inspect its empty table layout. The
existing selected-mode table headers and empty messages render before Search;
response/contact/KPIs remain absent and print/export stay disabled. An empty
ageing section must not manufacture zero balances. Search still requires valid
dates and a customer. Keep this documented exception scoped to that report;
other report defaults remain current month unless explicitly overridden.

Serialize with the shared helpers, never `toISOString()` and never a private copy (block 17):
`const [fromDate, toDate] = parseDateRange(values.dateRange);` gives `yyyy-MM-dd` strings
(null when invalid).

### Search: validate, then run

Report filters are validated inline into `errorMessage`, not as a toast, because
the message belongs beside the filters:

```ts
search(): void {
  if (this.loadingReport()) return;

  const values = this.filterForm.getRawValue();
  const [fromDate, toDate] = parseDateRange(values.dateRange);   // yyyy-MM-dd or null

  if (!fromDate || !toDate || fromDate > toDate) {
    this.errorMessage.set(this.translate.instant('customerStatement.invalidDateRange'));
    return;
  }
  if (values.customerId === null || values.customerId === '') {
    this.errorMessage.set(this.translate.instant('customerStatement.customerRequired'));
    return;
  }

  const filter: CustomerStatementFilter = {
    customerId: values.customerId,
    fromDate,
    toDate,
    reportType: values.reportType,
    includeInactive: values.includeInactive,
  };

  this.errorMessage.set('');
  this.hasSearched.set(true);
  this.loadingReport.set(true);
  this.loading.startLoading();

  this.statementService.getStatement(filter)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.loadingReport.set(false); this.loading.endLoading(); }),
    )
    .subscribe({
      next: (response) => {
        if (response.isSuccess && response.entity) { this.report.set(response.entity); return; }
        this.report.set(null);
        this.errorMessage.set(response.message
          || this.translate.instant('customerStatement.loadError'));
      },
      error: () => {
        this.report.set(null);
        this.errorMessage.set(this.translate.instant('customerStatement.loadError'));
      },
    });
}
```

Changing the report type clears the previous result rather than showing stale
numbers under a new heading:

```ts
this.filterForm.controls.reportType.valueChanges
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe((reportType) => {
    this.selectedReportType.set(reportType);
    this.report.set(null);
    this.hasSearched.set(false);
    this.errorMessage.set('');
  });
```

### Sections from computed slices

Each section reads one `computed` off the single response, so the template never
touches `report()?.x?.y` chains:

```ts
readonly ledgerLines        = computed(() => this.report()?.ledgerLines ?? []);
readonly deposits           = computed(() => this.report()?.deposits ?? []);
readonly pendingPDCs        = computed(() => this.report()?.pendingPDCs ?? []);
readonly advanceTaxInvoices = computed(() => this.report()?.advanceTaxInvoiceLines ?? []);
readonly isOutstanding      = computed(() => this.selectedReportType() === 'outstanding');
```

### Rows, numbers, empty state

Amounts always use `| money` (`shared/pipes/money.pipe.ts`: 2 decimals, Latin
digits, the backend rounding, and the same text as a grid money column). Blanks
always render as `—`. Truncated text carries a `[title]`. Define typed
`app-data-table` columns so conditional fields remain aligned in the column
definition, body and any shared summary presentation. The shared grid owns the
loading and empty states; bind its empty visibility to the report's
`hasSearched`/error state so "no result", "not run yet" and "error" remain
distinct. Do not add a feature-owned `<table>` or a second row renderer.

### Totals footer

Keep report totals in the response and the shared report summary bar, outside the
grid rows. If a future section requires a grid-integrated total row, add that
capability to the shared component within the scoped report task before using
it; do not document or invent feature-owned summary inputs, add a feature-owned
table footer, or recompute totals in the template.

Signed balances render as magnitude plus a Dr/Cr marker, not a minus sign:

```ts
balanceDirection(value: number | null | undefined): string {
  return (value ?? 0) >= 0
    ? this.translate.instant('customerStatement.debitShort')
    : this.translate.instant('customerStatement.creditShort');
}
absoluteAmount(value: number | null | undefined): number {
  return Math.abs(value ?? 0);
}
```

### Export

Build export objects when Export is clicked so translated property names use the
current language (block 8). For a tabbed report, dispatch from the active typed
key to that section's complete array and existing grid columns. Use the shared
formatter; never slice the local page or require ledger rows to export a populated
secondary section. Customer Statement's source uses:

```ts
private buildExportRows(): Array<Record<string, string | number>> {
  const translate = (key: string) => this.translate.instant(key);
  switch (this.activeTab()) {
    case 'ledger':
      return dataTableExportRows(this.ledgerLines(), this.ledgerColumns(), translate);
    case 'deposits':
      return dataTableExportRows(this.deposits(), this.depositColumns, translate);
    case 'pending-pdcs':
      return dataTableExportRows(this.pendingPDCs(), this.pendingPDCColumns, translate);
    case 'advance-tax':
      return dataTableExportRows(this.advanceTaxInvoices(), this.advanceTaxColumns(), translate);
    case 'ageing':
      return dataTableExportRows(this.ageingRows(), this.ageingColumns, translate);
  }
}

exportToExcel(): void {
  const rows = this.buildExportRows();
  if (rows.length) {
    onExportToExcel(signal(rows),
      `CustomerStatementOfAccount_${this.selectedReportType()}_${this.activeTab()}`);
  }
}
```

Memoising translated object keys in a
`computed()` is **Legacy — do not copy**: `translate.instant()` reads no
signal, so a language switch does not invalidate those cached headers.

A second export may aggregate the selected applicable lines — group in a Map,
never a second request. Customer Statement uses its active ledger/outstanding or
advance invoice lines through chargeLines; the action is unavailable on deposits,
PDCs and ageing because those models have no voucher-type debit/credit fields.
Keep the existing confirmed grouping formula; this changes data selection only:

```ts
readonly chargesTypewiseTotals = computed(() => {
  const totals = new Map<string, { voucherType: string; debit: number; credit: number; balance: number }>();
  this.chargeLines().forEach((line) => { … });
  return Array.from(totals.values()); // neutral data; translate headers on click
});
```

**Check:** typed filter and one typed response · totals from the response, never
summed in the template · required filters validated into `errorMessage` before
the request · `hasSearched` distinguishes empty from not-run · every action
disabled while loading · export and print disabled with no data · amounts
with `| money` · `—` for blanks · conditional columns added to header, body and footer
together · default range the current month · dates serialized with `parseDateRange`/`toApiDate` · form
disabled with `disable()`, not `[disabled]` · one outer `appReportPage` · each
report action group uses `appReportActions` with a translated accessible name.

---
