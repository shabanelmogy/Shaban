## 20. Report page

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

The shared bounded variant uses `host: { class: 'sigma-route-host sigma-print-flow' }`,
`section[appReportPage].sigma-report-page--fill.sigma-print-flow`, and
`.sigma-report-panel.sigma-print-flow`. These opt-in global classes reuse the
application's existing page/panel values; features do not copy page/panel SCSS or
subtract shell heights. Other report consumers retain their existing layout until reviewed.

For a sectioned read-only document, every section table is a typed
`app-data-table`. For a proven complete response in full-document flow and
print, one outer `.sigma-report-table-frame.sigma-print-flow` may own the report
flow; bind each grid `scrollable=false` so the complete arrays remain in that
outer document. An existing paged response keeps `lazy=true`, server paging and
its authoritative counts; importing the shared grid does not turn it into a
complete flow document.
Keep title, filters, inline warnings/contact metadata and existing backend totals
outside the frame. In a bounded screen layout with independently visible
sections, do not force one global row scroller: each section's layout boundary
uses `overflow: hidden` and passes its remaining size to its shared grid
(`fill=true`, `scrollable=true`), whose row wrapper owns that section's vertical
and horizontal scrolling. This applies to complete all-row sections with
`paginator=false` as well as complete sections using a local paginator; a frozen
paged transport keeps its server paginator/count contract. Summary and detail
panes may therefore scroll independently.

The former native report classes `.sigma-report-table`, `.sigma-report-number`
and `.sigma-report-empty` remain compatibility styles for out-of-scope existing
consumers until each report is reviewed; new or reviewed work uses the shared
grid and its documented inputs/tokens. The shared grid and global styles own
compact rows, sticky themed headers, logical alignment, row surfaces/hover and
white print surfaces. Trial Balance remains the reference for panel/title
spacing, header density and accounting values; do not add a feature palette or
override the shared grid's row treatment to imitate a legacy body surface. The
shared report panel retains that reference's insets, radius and subtle shadow.
Feature SCSS owns section placement only; do not add feature-owned table markup
or PrimeNG wrapper scroll rules. Statement of Account now adopts this shared
variant; its earlier `statement-*` filter/palette/height styles remain legacy
examples only.

#### Title and filter card width

**Explicit owner choice, 2026-10-02:** Customer Statement of Account and
Receivable Age Analysis keep the title card the same width as the filter card,
with both inline edges aligned. Their existing `.sigma-report-panel` also uses
`sigma-report-panel--aligned-title`. The shared rule in `src/styles.scss` sets
only its direct `app-feature-title` child's `margin-inline: 0`, matching the
report filter strip's zero inline margins. Both cards stretch to the same panel
content width in LTR and RTL, including the responsive panel-padding change.

Keep the existing title block spacing, panel padding, colors and scroll owners.
Do not add a fixed width, a feature-local margin override or compensating filter
padding. This modifier is a reusable opt-in capability; the owner decision is
scoped to these two reports, and other consumers retain their existing title
presentation until explicitly approved. This supersedes the earlier Trial
Balance title-inline comparison for these two consumers only. Actual visual
acceptance remains owner verification when the change is reviewed from source.

Every report filter strip and accounting summary uses the shared global classes in
`src/styles.scss` (reference: `Accounts/TrailBalance`, `Accounts/BalanceSheet`). A report
writes no filter or totals CSS of its own:

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

The strip owns its layout, the 34px control height (`--sigma-filter-control-height`), focus,
dark theme, RTL and narrow-screen stacking. The actions use the shared variants
`sigma-report-action--search` (primary), `--refresh` (quiet primary), `--reset` (neutral) and
`--export` (neutral secondary). Export uses global strong-border, text and soft-surface
tokens; hover/focus uses the primary border, balance text and a 7% primary/surface mix.
Both themes resolve these same rules through their tokens, without a later dark base
overriding interactive states. Its icon inherits the label colour; Excel does not require
a green button. This shared palette follows the owner's 2026-10-02 correction and applies
to both ordinary and specialized exports. Features never add an export palette of their own.
Search may use `app-primary-action-button type="submit"`; its shared
report-strip context uses those same compact dimensions. Direct secondary buttons
use `btn btn-secondary` with the corresponding report variant, as in Trial Balance.
`sigma-report-action-group` supplies the same wrapping and narrow-screen two-column
layout as the existing `app-buttons` group. Report semantics still follow block 4: labels are associated with their controls,
Search submits the real filter form, and the strip is never a second vertical scroll owner.
A list screen uses the filter panel of block 4 instead; the two shared strips are not mixed.

Accounting report totals use the shared summary bar above (also used by financial editors,
block 14): shared surface/border/radius, tabular numerals, and semantic
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
visible, the routed report may be bounded to the available shell height. Each
visible section chooses its own layout boundary and shared-grid row viewport;
keep the feature title, filter strip, lookup/error messages and accounting
summary outside those scrolling regions. The active grid owns vertical rows and
any required horizontal overflow, and its header remains sticky inside that
grid. Do not put vertical scroll on the surrounding card/results container or
introduce a nested hierarchy scrollbar. Printing releases each section's bounds
so the full report can flow across pages.

### Tabbed report sections

**Explicit presentation choice, 2026-10-02:** Follow Up uses two shared workspace
tabs, Details and Summary, after the owner requests one tab per section. Details
is initial; Summary uses a responsive maximum inline width of 960px at logical
start within the bounded result area. This supersedes the provisional 520px
example for Follow Up only; it is not a shared tab default. Both typed grids
retain complete arrays with paginator=false, the active grid owns row scrolling,
and the public shared-grid minimum width allows the expanded Summary metrics to
overflow horizontally on narrow windows without page scroll. Existing shared
`sigma-report-summary-bar`, `sigma-report-totals` and `sigma-report-total`
classes present the four server-owned additive operational KPI cards. Comparison
bars are custom cells in the shared grid renderer with presentation-only max
scaling, and the user cell's shared secondary action drills into the exact raw
username filter value; null/blank groups remain label-only. Ordinary Excel follows
the active complete section and its current columns; full print includes the KPI
cards and both Summary/Details arrays regardless of selection, then restores
selection and form state. Keep busy, printing and filter-invalidation gates.
Metric formulas, scopes and reference-date semantics remain in the frozen Follow
Up contract/review and are not universal report defaults. No new shared
disclosure capability or feature-owned tab/card palette is required.

**Explicit presentation choice, 2026-10-02:** the owner requests every Customer
Statement section table to match BalancesSummary's shared grid. That report
uses typed `app-data-table` columns with lazy=false and owner-approved local
pagination (block 6), retaining full response arrays and backend totals. To keep
the paginator at the card bottom, it uses fill=true and scrollable=!printing():
the external report frame is a flex layout boundary with overflow hidden and the
active shared grid row wrapper owns both scroll axes. Pass shrinking flex height
through the visible panel. The tab label identifies the section on screen; the
owner removes its duplicate table heading, which remains visible only in print.
Panel aria-labelledby still points to the tab. Every section
keeps independent controlled paging; print preparation turns pagination and
scrolling off and restores them after print/cancel/failure (block 21). Print
panel layout returns to block flow. Every report section follows this shared-grid
baseline when the report is reviewed. Existing out-of-scope consumers migrate at
their own review; no feature table palette is added.

When the owner approves tabs for an existing sectioned report, reuse
`app-editor-tabs` with `appearance="workspace"` (block 13), typed keys, existing
translation labels and optional response-row counts. Keep this `no-print`
navigation outside the bounded results area, below the filters and
backend totals. Each feature panel follows the shared ID/aria-labelledby
contract and remains keyboard focusable. The shared component owns tab styling
and keyboard navigation; feature CSS owns only section layout and visibility.

Preserve the report's mode-specific section conditions and existing radio/select
mode controls. Switching sections changes presentation without another API call,
server paging or changed accounting. Ordinary Excel follows the selected section's
complete array and current columns (block 8); print still covers every applicable
section (block 21). Empty
sections remain inspectable without a fabricated response. Resetting filters
selects the primary section; a Refresh of the same filters retains selection.
Reset the actual row viewport when selecting a section without moving keyboard
focus off the selected tab. Flow reports reset the outer frame; filling
shared grids use `DataTableComponent.scrollToStart()` (block 6), never a feature
query of PrimeNG internals.

Keep all sections applicable to the chosen report mode in the DOM and hide
inactive panels with screen-media CSS only. Do not use `@switch`, conditional
rendering or `[hidden]` for the active-section selection: full-report printing
requires all applicable panels, independently of the selected tab (block 21).
Existing mode conditions still govern which sections belong to the report.

### Dense accounting tree/report table visual invariant

`Accounts/TrailBalance/components/list/` is the canonical visual reference for a
dense accounting report that renders hierarchical rows (its existing source uses
`p-treeTable`) or for a flat accounting report whose table serves the same
read-only role. New and reviewed reports with this UI role still use
`app-data-table`; add any missing hierarchy capability to that shared component
within the scoped report task. Preserve the same compact visual grammar rather
than inventing a feature-specific table treatment:

- keep each bounded section inside its layout boundary; the shared grid's row
  viewport is that section's scroll owner, never the surrounding report card;
- keep the table header sticky inside that grid and visually distinct with a
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
  second nested vertical scrollbar inside the shared grid's hierarchy viewport;
- sticky-header, row-density and hierarchy styling must use logical properties
  (`inline-start`/`inline-end`) so Arabic RTL and English LTR remain equivalent;
- print mode removes height/overflow bounds and lets the complete table flow.

Use these rules for Trial Balance-like accounting reports and for any other
report with the same dense read-only tree/table role. The interaction model may
change shared-grid inputs or require a shared capability, but it does not permit
a feature-owned table or flattening the hierarchy; record the required shared
extension in review evidence.

`Accounts/TrailBalance/components/list/` is the reference consumer. A report review fails
final reconciliation if it reintroduces feature-local filter-strip or accounting
total-card styling when these shared classes fit the same UI role.

### Required report review evidence

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

These are focused read-path checks, not permission to run builds/tests/browser/DB
commands or to modify unrelated consumers. A known mismatch remains a finding;
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
- for a single-day report, use one `p-calendar`, default it to today, require
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

Default the range to the **current month**, from the 1st to its last day, the same as lists
(owner rule 2026-09-24, block 17): `dateRange: this.fb.control<Date[] | string | null>(currentMonthRange())`.

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
