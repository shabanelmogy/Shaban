## 20. Report page

> **Status: Canonical composite** — shared page/actions plus shared report filter/summary visual language; feature-owned contracts, data and calculations

A report is **not** a list. It does not use the direct list `p-table` shape,
has no row actions and has no server
paging. The user picks filters, presses Search, and gets one document with
sections and totals. Reference:
`Customers/StatementOfAccount/components/list/`.

Sibling reports that follow the same shape: `Customers/BalancesSummary`,
`Customers/ReceivableAgeAnalysis`, `Suppliers/SupplierStatementOfAccount`,
`Staff/StaffStatementOfAccount`.

### Shared shell — mandatory replacement

Every report route imports `ReportPageComponent` and places `appReportPage` on
its outer `section`. Every report action group imports `ReportActionsComponent`
and uses `appReportActions`; this supplies the toolbar role, translated accessible
name, wrapping, spacing and print hiding. Do not recreate those host rules in a
feature and do not restore a legacy bare wrapper during review or refactor:

```html
<section appReportPage class="customer-statement-page">
  …feature-owned filters and report sections…
  <div
    appReportActions
    class="statement-actions"
    [ariaLabel]="'general.actions' | translate"
  >
    …Search, Print and Export buttons…
  </div>
</section>
```

```ts
imports: [
  ReportPageComponent,
  ReportActionsComponent,
  …
]
```

`shared/components/reports/` already applies both hosts, so its consumers must
not add another report page or action wrapper around `app-reports`. These shared
hosts own page/action presentation. API contracts, calculations, report sections,
data mapping, loading/error state and export mapping remain feature-owned. The
visual language for repeated report filters and accounting totals is shared and
must not be recreated feature-by-feature.

### Report filter + totals visual invariant

Opening Balances is the visual reference for compact accounting filters and
Debit/Credit/Balance summaries. Reports use the shared classes defined in
`src/styles.scss`, not copied feature CSS:

```html
<form class="sigma-filter-form sigma-report-filter-panel no-print" ...>
  <div class="sigma-report-filter-field">...</div>
  <label class="sigma-report-filter-check">...</label>
  <div appReportActions class="sigma-report-filter-actions">...</div>
</form>

<div class="sigma-report-summary-bar">
  <div class="sigma-report-totals">
    <div class="sigma-report-total sigma-report-total--debit">...</div>
    <div class="sigma-report-total sigma-report-total--credit">...</div>
    <!-- add --balance/--net only when the response owns that total -->
  </div>
</div>
```

The filter strip consumes the complete accounting-filter visual contract from
block 14 rather than restating or forking it here: compact wrapping layout,
logical inline-start primary accent, themed soft surface/gradient, shared control
height/radius/focus treatment, dark/RTL equivalents and the same narrow-screen
stacking rules. Report semantics still follow block 4: labels remain associated
with controls and Search submits the real filter form. Search is the primary
action; Refresh may use a quieter primary-tinted treatment; Reset is neutral;
Excel/export uses the approved export treatment. The group must not create a
second vertical scroll owner.

Accounting report totals use the same compact summary bar/card language as
Opening Balances: shared surface/border/radius, tabular numerals, and semantic
Debit/Credit/Balance-or-Net accents. The **numbers still come from the backend
response**; shared styling never authorizes client-side recomputation of
accounting totals. Keep the summary as small as the report needs: Trial Balance
uses only **Total Debit** and **Total Credit**. Do not add Beginning/Ending/Net
cards merely because the line model exposes those values. Add Balance or Net
summary cards only when they are a deliberate report KPI owned by the backend
contract and useful to the user.
If a report has a non-accounting KPI layout that genuinely needs another visual
shape, document the reason in its review evidence instead of silently forking the
filter/summary pattern.

For an explicitly approved dense accounting report that keeps its controls
visible, the routed report may be bounded to the available shell height and use
one internal **table-frame** vertical scroll owner. Keep the feature title,
filter strip, lookup/error messages and accounting summary outside that scrolling
frame. The table frame owns vertical row scrolling and any required horizontal
overflow, and the table header remains sticky at the top of that frame. Do not
put the vertical scroll on the surrounding card/results container and do not
introduce a nested TreeTable vertical scrollbar. Printing releases those bounds
so the full report can flow across pages.

### Dense accounting tree/report table visual invariant

`Reports/TrailBalance/components/list/` is the canonical visual reference for a
dense accounting report that renders hierarchical rows (`p-treeTable`) or for a
flat accounting report whose table serves the same read-only role. Reports with
this same UI role must keep the same compact visual grammar rather than inventing
a feature-specific table treatment:

- keep the table inside one bordered report table frame; the **table frame** is
  the row-scroll owner, never the surrounding report card;
- keep the table header sticky inside that frame and visually distinct with a
  soft themed surface, strong text, subtle vertical separators and a slightly
  stronger bottom rule; do not use an oversized or card-like header;
- target a compact header around `34px` high and compact data rows around `30px`
  high, with roughly `5-6px` header block padding and `3px` row block padding;
- numeric headers and cells align to logical end and use tabular numerals;
- the first account/description column aligns to logical start and receives the
  width needed to prevent hierarchy controls from crushing the label;
- hierarchy togglers stay compact (about `22px`) and must not inflate row height;
- when account code and account name are both shown, render them as separate
  visual parts: code is quieter/smaller, name is the primary readable label;
- hierarchy indentation must stay tight enough for dense accounting data. Do not
  add decorative nested cards, large left padding, or oversized tree icons;
- top-level hierarchy rows may receive a **subtle** weight/surface emphasis only;
  deeper levels rely on indentation and the tree control, not progressively
  louder backgrounds;
- preserve horizontal overflow when required by financial columns, but avoid a
  second nested vertical scrollbar inside the TreeTable itself;
- sticky-header, row-density and hierarchy styling must use logical properties
  (`inline-start`/`inline-end`) so Arabic RTL and English LTR remain equivalent;
- print mode removes height/overflow bounds and lets the complete table flow.

Use these rules for Trial Balance-like accounting reports and for any other
report with the same dense read-only tree/table role. A different table style is
valid only when the interaction model is materially different (for example an
editable collection, paged CRUD grid, or KPI dashboard), and that difference
must be recorded in review evidence.

`Reports/TrailBalance/components/list/` is the current report consumer and
Opening Balances remains the approved visual reference. A report review fails
final reconciliation if it reintroduces feature-local filter-strip or accounting
total-card styling when these shared classes fit the same UI role.

### Contract

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
service is thin — one `GET`, same `Filters[key]` convention, `Result<T>` not
`Results<T>` because there is no paging:

```ts
@Injectable({ providedIn: 'root' })
export class CustomerStatementOfAccountService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}Customer/Statement`;

  getStatement(filter: CustomerStatementFilter): Observable<Result<CustomerStatement>> {
    const params = new HttpParams()
      .set('Filters[customerId]', String(filter.customerId))
      .set('Filters[fromDate]', filter.fromDate)
      .set('Filters[toDate]', filter.toDate)
      .set('Filters[reportType]', filter.reportType)
      .set('Filters[includeInactive]', String(filter.includeInactive));
    return this.http.get<Result<CustomerStatement>>(this.endpoint, { params });
  }
}
```

### Derived operational summary reports

A report that combines KPI-style summary sections with a detail table still
uses this report pattern. It is not a paged list and must not be converted to
`app-data-table`, `table-list`, or a client-side collection of placeholder
totals. Use one typed response containing every ordered summary section and the
detail rows. The template only formats values returned by the backend.

When the supplied evidence shows summary labels but not their calculations,
freeze a named backend derivation before implementing the screen. Record every
proxy (for example, how internal versus outside work or open versus closed jobs
is identified), the date boundary, the source entity, and the age buckets in
the feature handoff. Never fill an unconfirmed section with zeroes or derive a
different total for screen, print, and export.

Use the shared report shell and the current filter/action style:

- keep `app-feature-title` inside the report panel;
- place the complete typed filter form in one `no-print` row;
- for a single-day report, use one `p-calendar`, default it to today, require
  the value, and serialize it from local year/month/day parts;
- place Print, Export and Refresh/Search in one `appReportActions` toolbar;
- use a native semantic table for report rows and responsive horizontal
  scrolling, not list paging or row actions;
- show loading, inline error, empty-summary, and empty-detail states; and
- make solid action and title icons explicitly white in light and dark themes.

`Fleet/DailyServiceLogs/` is the baseline for the single-date operational
summary shape. Its ordered response arrays carry stable metric codes so labels
remain translated while calculation ownership stays on the backend.

### Filter bar

Date range as one control, `no-print` on the whole form, every control disabled
while the report runs:

```html
<form class="statement-filters no-print" [formGroup]="filterForm" (ngSubmit)="search()">
  <div class="statement-filter-grid">
    <div class="statement-field statement-date-field">
      <label for="statementDateRange">{{ 'customerStatement.dateRange' | translate }}</label>
      <p-calendar
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
      ></p-calendar>
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
<p-calendar selectionMode="range" [hideOnDateTimeSelect]="false"></p-calendar>
```

Keep the range value date-based and make both dates easy to choose when the
range spans more than one month:

```html
<p-calendar
  selectionMode="range"
  dataType="date"
  [numberOfMonths]="2"
  rangeSeparator=" - "
></p-calendar>
```

Default the range to month-to-date so the page is useful on arrival:

```ts
private defaultDateRange(): Date[] {
  const toDate = new Date();
  toDate.setHours(0, 0, 0, 0);
  const fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
  return [fromDate, toDate];
}
```

Serialize dates from local parts, never `toISOString()` (block 17):

```ts
private formatApiDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

### Search: validate, then run

Report filters are validated inline into `errorMessage`, not as a toast, because
the message belongs beside the filters:

```ts
search(): void {
  if (this.loadingReport()) return;

  const values = this.filterForm.getRawValue();
  const fromDate = values.dateRange?.[0] ?? null;
  const toDate = values.dateRange?.[1] ?? null;

  if (!fromDate || !toDate || fromDate.getTime() > toDate.getTime()) {
    this.errorMessage.set(this.translate.instant('customerStatement.invalidDateRange'));
    return;
  }
  if (values.customerId === null || values.customerId === '') {
    this.errorMessage.set(this.translate.instant('customerStatement.customerRequired'));
    return;
  }

  const filter: CustomerStatementFilter = {
    customerId: values.customerId,
    fromDate: this.formatApiDate(fromDate),
    toDate: this.formatApiDate(toDate),
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

Amounts always `| number: '1.2-2'`. Blanks always `—`. Truncated text carries a
`[title]`. Conditional columns appear in header, body **and** footer together:

```html
<td class="description-cell" [title]="line.description || ''">{{ line.description || '—' }}</td>
<td>{{ line.debit | number: '1.2-2' }}</td>
@if (isOutstanding()) {
  <td>{{ line.dueAmount | number: '1.2-2' }}</td>
}
```

The empty row distinguishes "no result" from "not run yet":

```html
} @empty {
  <tr>
    <td [attr.colspan]="isOutstanding() ? 11 : 10" class="statement-empty-row">
      {{ (hasSearched() ? 'customerStatement.noData'
                        : 'customerStatement.selectCustomerPrompt') | translate }}
    </td>
  </tr>
}
```

### Totals footer

A separate summary table reusing the same `<colgroup>` via
`*ngTemplateOutlet`, so columns stay aligned with the scrolling body:

```html
<div class="statement-table-summary">
  <table class="statement-table statement-ledger-table" [class.outstanding-table]="isOutstanding()">
    <ng-container *ngTemplateOutlet="ledgerColumns"></ng-container>
    <tfoot>
      <tr>
        <td colspan="7" class="summary-caption">{{ 'customerStatement.summary' | translate }}</td>
        <td class="summary-value">
          <span>{{ 'customerStatement.totalDebit' | translate }}</span>
          <strong>{{ report()?.totalDebit || 0 | number: '1.2-2' }}</strong>
        </td>
        …
      </tr>
    </tfoot>
  </table>
</div>
```

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
current language (block 8):

```ts
private buildExportRows(): Array<Record<string, string | number>> {
  return this.ledgerLines().map((line) => ({
    [this.translate.instant('customerStatement.date')]: this.formatDisplayDate(line.date),
    [this.translate.instant('customerStatement.debit')]: line.debit,
    …
  }));
}

exportToExcel(): void {
  const rows = this.buildExportRows();
  if (rows.length) {
    onExportToExcel(signal(rows), 'CustomerStatementOfAccount');
  }
}
```

The existing Statement of Account source memoises translated object keys in a
`computed()`. That is **Legacy — do not copy**: `translate.instant()` reads no
signal, so a language switch does not invalidate those cached headers.

A second export may aggregate the same lines — group in a `Map`, never a second
request:

```ts
readonly chargesTypewiseTotals = computed(() => {
  const totals = new Map<string, { voucherType: string; debit: number; credit: number; balance: number }>();
  this.ledgerLines().forEach((line) => { … });
  return Array.from(totals.values()); // neutral data; translate headers on click
});
```

**Check:** typed filter and one typed response · totals from the response, never
summed in the template · required filters validated into `errorMessage` before
the request · `hasSearched` distinguishes empty from not-run · every action
disabled while loading · export and print disabled with no data · amounts
`1.2-2` · `—` for blanks · conditional columns added to header, body and footer
together · dates serialized from local parts · one outer `appReportPage` · each
report action group uses `appReportActions` with a translated accessible name.

---

