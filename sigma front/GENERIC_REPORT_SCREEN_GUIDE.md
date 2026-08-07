# Generic Report Screen Guide

Use this guide when creating or refactoring a report screen in the Sigma Angular application. The tariff report is the reference implementation, but the rules below are generic and apply to list, summary, grouped, and detailed reports.

Reference implementation:

- `src/app/modules/Limousine/limousineTariffReport`
- Backend endpoint: `LimousineTariff/GenerateReport`

Follow the guide in this order:

1. Match and verify the frontend design without depending on live report data.
2. Connect the verified screen to the backend contract and business logic.

This separation prevents API issues from being mistaken for layout issues and
keeps visual acceptance independent from data-contract acceptance.

## Part I - Frontend Design Match

Complete this part first. Use representative mock data when the endpoint is not
ready, but keep the mock data local and remove it before backend integration.

### 1. Recommended Feature Structure

Create one feature folder for each report:

```text
featureReport/
├── components/
│   ├── feature-report.component.ts
│   ├── feature-report.component.html
│   └── feature-report.component.scss
├── models/
│   └── feature-report.model.ts
├── services/
│   └── feature-report.service.ts
└── featureReport.routes.ts
```

Keep API models, HTTP calls, UI behavior, and styles separated. Do not place report-specific code in shared components unless it is genuinely reusable by multiple reports.

### 2. Component State and Loading

Use explicit state for filters, results, and loading:

```ts
readonly report = signal<ReportResponse | null>(null);
readonly loadingReport = signal(false);

search(): void {
  if (this.loadingReport()) return;

  this.loadingReport.set(true);
  this.loading.startLoading();

  this.reportService.generateReport(this.buildFilter())
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.loadingReport.set(false);
        this.loading.endLoading();
      }),
    )
    .subscribe({
      next: response => {
        this.report.set(
          response.isSuccess && response.entity
            ? response.entity
            : null,
        );
      },
      error: () => this.report.set(null),
    });
}
```

Required behavior:

- Start loading immediately before the request.
- Stop loading in `finalize`, including errors and non-success responses.
- Disable Search while loading to prevent duplicate requests.
- Show a spinner inside the Search button.
- Let the global error interceptor display HTTP and business errors.
- Do not leave the page in an infinite loading state.

### 3. Filter Toolbar UI

The standard toolbar should contain:

- Filter label and control.
- Clear action where appropriate.
- Search button.
- Print button in the same row as Search.

Example:

```html
<div class="filter-row no-print">
  <div class="filter-control">
    <!-- dropdown/input/date controls -->
  </div>

  <button type="button" class="report-action search-action" (click)="search()">
    <i class="fas fa-search"></i>
    {{ 'general.search' | translate }}
  </button>

  <button type="button" class="report-action print-action" (click)="print()">
    <i class="fas fa-print"></i>
    {{ 'general.print' | translate }}
  </button>
</div>
```

Toolbar rules:

- Keep Search and Print visually aligned.
- Use white icons on colored action buttons.
- Add `margin-inline-end` between the icon and text for both LTR and RTL.
- Use `type="button"` so buttons do not submit an outer form unexpectedly.
- Use a searchable dropdown for large lookup lists.
- Clear should reset the filter and, when required, reload the default report.
- Stack controls only at narrow mobile breakpoints.

#### PrimeNG dropdown border rule

PrimeNG applies the `.p-inputtext` class to the inner dropdown label as well as
normal text inputs. Do not style every `.p-inputtext` inside the report when the
same selector also contains a `p-dropdown`; otherwise both the outer dropdown
and its inner label receive borders, producing a double border or a rounded
input inside the dropdown.

Scope input styling to the real input component and explicitly keep the
dropdown label borderless:

```scss
.report-page .p-dropdown,
.report-page .p-calendar .p-inputtext {
  min-height: 32px;
  border: 1px solid var(--report-border);
}

.report-page .p-dropdown .p-dropdown-label {
  min-height: 0;
  height: auto;
  border: 0 !important;
  border-radius: 0;
  background: transparent;
  box-shadow: none !important;
  outline: 0;
}
```

Apply hover, focus, and dark-theme input selectors to
`.p-calendar .p-inputtext` or the relevant real input rather than to a broad
`.report-page .p-inputtext` selector. The dropdown must display one border on
its outer `.p-dropdown` element only.

### 4. Report Content

Choose the smallest suitable presentation:

- Simple table for flat rows.
- Grouped sections for categories or tariff types.
- Summary cards only for important totals.
- Tree table only when the response is truly hierarchical.

Grouped report rules:

- Give every section a translated heading.
- Keep column headers consistent across sections.
- Show conditional columns only where applicable.
- Keep numeric columns aligned consistently; use end alignment by default unless the report design explicitly calls for centered values.
- Use horizontal scrolling for wide tables; do not force the whole page wider.
- Use consistent row height and subtle alternating row backgrounds.
- Show a translated no-data row when a section is empty.

#### Scrolling and fixed report chrome

For a bounded desktop report shell:

- Keep the report body/results area as the only vertical scrolling container
  when the shell provides a reliable available height.
- On mobile, zoomed layouts, or an unbounded embedded screen, allow normal page
  flow instead of trapping content in a small nested scroller.
- Keep the table header outside the scrolling body so column headings remain visible.
- Keep summary/footer totals outside the scrolling body so totals remain visible.
- Use the same table layout and column widths for the header, body, and summary so every total stays under its corresponding column.
- When centered presentation is specified, center column headings, row content, and summary values consistently.
- Allow horizontal scrolling only inside the report/table container when columns do not fit.

Do not make names clickable unless navigation is an explicit report requirement.

### 5. Empty, Loading, and Error States

Always distinguish these states:

1. Loading: spinner and disabled actions.
2. Success with data: render report sections.
3. Success without rows: show a translated empty state.
4. HTTP/business failure: stop loading and show the global error dialog.

Do not silently swallow a failed response. The user must receive feedback.

### 6. Print Behavior

Use the browser print flow unless a PDF/download endpoint is required:

```ts
print(): void {
  window.print();
}
```

Print CSS requirements:

```scss
@media print {
  .no-print {
    display: none !important;
  }

  .report-summary,
  .report-compact-block,
  tr {
    break-inside: avoid;
  }

  table {
    min-width: 0;
    font-size: 9pt;
  }

  thead {
    display: table-header-group;
  }
}
```

Do not apply `break-inside: avoid` to an arbitrarily large report section; it
can create blank space or overflow a printable page. Keep compact summaries
together and allow long tables/sections to paginate.

Before completion, verify:

- Filter buttons are hidden in print preview.
- Tables fit printable width.
- Section headings remain with their table where possible.
- Colors remain readable in grayscale.

### 7. Export behavior

Export is optional unless the screen requirement includes it. When it exists,
define one explicit contract:

```ts
export interface ReportExportRequest extends ReportFilter {
  format: 'xlsx' | 'csv' | 'pdf';
}
```

Rules:

- Search, Print, and Export use the same normalized effective filters and
  authorization rules.
- Prefer a dedicated backend export endpoint for large or sensitive reports.
- The backend revalidates permissions, tenant scope, filters, row visibility,
  and field-level sensitivity; it never trusts rows sent back by the browser.
- Bound synchronous exports by row count, duration, and memory. Use an existing
  streaming/background pattern when those limits can be exceeded.
- Return a server-generated safe filename and an explicit content type.
- Disable repeat Export clicks, show progress/busy state, allow cancellation
  where supported, and surface HTTP/business failures.
- Never produce a file from only the currently visible page unless the action
  is explicitly labelled **Export current page**.
- Do not include tenant, audit, CVV, secrets, internal IDs, or other sensitive
  columns unless an approved business export contract explicitly requires
  them.

If the complete approved dataset is already loaded and bounded in the browser,
a client workbook is acceptable. Otherwise do not loop through unbounded pages
without a documented maximum.

### 8. Accessibility

- Associate every filter label with its control.
- Give the report region a translated accessible name.
- Use semantic tables with column/row headers and `scope` where applicable.
- Announce loading and empty/error results without relying on color.
- Move focus to the result heading or error summary after an explicit Search
  when that helps keyboard/screen-reader navigation.
- Ensure icon-only Search, Print, Export, and Clear controls have translated
  accessible names.
- Preserve visible focus, logical tab order, RTL order, reflow, and keyboard
  access at mobile/zoomed widths.

### 9. Translation and RTL

Add all new labels to both:

- `src/app/modules/i18n/vocabs/en.ts`
- `src/app/modules/i18n/vocabs/ar.ts`

Never display a raw key such as `general.required` or `report.rate`.

RTL rules:

- Prefer `margin-inline-start/end` and `padding-inline-start/end`.
- Prefer `inset-inline-start/end` for positioned controls.
- Use `text-align: start/end` instead of fixed left/right.
- Verify icon/text spacing and dropdown clear buttons in Arabic.

### 10. Routing and Menu Integration

Create a lazy route file:

```ts
export const FeatureReport_Routes: Routes = [
  {
    path: '',
    component: FeatureReportComponent,
  },
];
```

Register it in `src/app/pages/routing.ts` and connect the existing sidebar item in:

```text
src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts
```

Use a real route such as `/FeatureReport`; do not leave production menu items linked to `#`.

Avoid adding a second page title inside the report when the global toolbar already displays the route title.

### 11. Frontend Design Acceptance

Complete these checks before connecting the live endpoint:

- [ ] Screen proportions, spacing, controls, columns, and sections match the reference.
- [ ] Search, Print, Export, and Clear actions are positioned correctly.
- [ ] PrimeNG dropdowns display one clean outer border.
- [ ] A bounded desktop report uses one internal results scroller; mobile and
  zoomed layouts reflow without hiding content.
- [ ] Headers and summary totals stay visible and aligned.
- [ ] Empty and loading states do not change the accepted layout.
- [ ] Light, dark, LTR, RTL, responsive, and print layouts are verified.
- [ ] Temporary mock data is clearly isolated and ready to be removed.

Do not alter an accepted layout merely to accommodate an inconvenient backend
response. Normalize the response in the service or mapping layer.

## Part II - Backend Contract and Report Logic

Start this part only after the frontend structure and visual behavior are
accepted. Replace temporary data with the real endpoint and verify every filter,
row, total, and conditional section against backend rules.

### 1. Confirm the Backend Contract

Before connecting the UI, verify:

- Controller route and HTTP method.
- Authentication requirement.
- Supported filter names and enum values.
- Whether filters are normal query parameters or a `Filters` dictionary.
- Response wrapper (`Result<T>`, `Results<T>`, or direct response).
- Empty-report behavior.
- Which sections and columns are conditional.
- Server-side calculation rules for balances, ageing buckets, subtotals, and totals.
- Whether dates are inclusive and which timezone/date boundary the endpoint uses.
- Tenant and soft-delete scope for every base and joined entity.
- Server-side permission for viewing and exporting sensitive columns.
- Maximum date range, result size, timeout, cancellation, and synchronous
  export limits.

For a specification request using a `Filters` dictionary, the query format is:

```text
Filters[customerId]=360
Filters[tariffCategory]=2
```

Do not guess enum values. Copy the exact numeric values from the backend C# enum
or return select/enum options from the backend when the values are configurable.

### 2. Define Strongly Typed Models

Create interfaces matching the backend JSON response exactly:

```ts
export interface ReportItem {
  id: number;
  name: string | null;
  amount: number | null;
}

export interface ReportSection {
  title: string;
  items: ReportItem[];
}

export interface ReportResponse {
  sections: ReportSection[];
}

export interface ReportFilter {
  customerId: number | null;
}
```

Rules:

- Use `null` where the backend can return `null`.
- Avoid `any` in report models and services.
- Use frontend enums only when they match backend enum values exactly.
- Keep filter models separate from result models.
- Map backend property names once in the service when backward compatibility is required.
- Do not place balance, ageing, allocation, or subtotal calculations in the template.

### 3. Build the Report Service

Use `HttpParams` so filter values are encoded correctly:

```ts
@Injectable({ providedIn: 'root' })
export class FeatureReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  generateReport(filter: ReportFilter): Observable<Result<ReportResponse>> {
    let params = new HttpParams();

    if (filter.customerId !== null) {
      params = params.set('Filters[customerId]', String(filter.customerId));
    }

    return this.http.get<Result<ReportResponse>>(
      `${this.baseUrl}ControllerName/GenerateReport`,
      { params },
    );
  }
}
```

Important URL rule:

- `environment.baseUrl` already ends with `/`.
- Use `${this.baseUrl}Controller/Action`.
- Do not create `${this.baseUrl}/Controller/Action`, which produces a double slash.

This trailing-slash rule describes the current Sigma environment contract.
Before copying it into another application, inspect that application's
environment values or normalize the URL in one shared service.

Integration rules:

- Build request parameters in one method so Search, Export, and Print use the same filters.
- Convert dates at the API boundary and confirm inclusive start/end behavior.
- Keep response normalization in the service, not in the HTML template.
- Remove all temporary mock report rows when the real endpoint is connected.
- Treat backend totals as authoritative unless the contract explicitly requires client calculation.

### 4. Authentication Is Mandatory

Report endpoints normally inherit `[Authorize]`. A report request returning `401 Unauthorized` usually means the service is using an `HttpClient` outside the injector scope containing `tokenInterceptor`.

In this project, authenticated interceptors are registered in `LayoutModule`:

```ts
provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor]))
```

Follow the existing project pattern:

1. Import the report service in `src/app/_metronic/layout/layout.module.ts`.
2. Add the service to `LayoutModule.providers`.

```ts
import { FeatureReportService } from '.../feature-report.service';

providers: [
  FeatureReportService,
]
```

This is a Sigma compatibility rule caused by the current root
`HttpClientModule` plus child `LayoutModule` interceptor scope. It is not a
general Angular rule for every application. Do not register additional
feature-level `HttpClient` providers or duplicate service instances casually;
if the application later moves interceptors to the root injector, remove the
Layout-specific service registration consistently.

Verify the browser request contains:

```text
Authorization: Bearer <token>
```

Never solve `401` by adding `[AllowAnonymous]` to a protected report endpoint.

### 5. Backend and Data Acceptance

Verify the endpoint independently before diagnosing the UI:

- [ ] Route and HTTP method are correct.
- [ ] Request includes its Bearer token.
- [ ] Query parameter names and enum values match the server contract.
- [ ] Date boundaries and timezone conversion return the expected records.
- [ ] Every displayed column maps to the intended response property.
- [ ] Ledger/outstanding or other report modes apply distinct documented rules.
- [ ] Filters affect both rows and totals consistently.
- [ ] Summary totals reconcile with the returned rows and backend rules.
- [ ] Empty results are valid for the tested filters, not caused by mapping errors.
- [ ] Export and Print receive the same effective filters as Search.
- [ ] Temporary development overrides and mock data have been removed.
- [ ] Every query is tenant- and soft-delete-scoped before joins/projection.
- [ ] Filters apply before totals, ordering, paging, grouping, and export.
- [ ] Ordering is deterministic and date/range/result-size limits are bounded.
- [ ] List/report queries project only approved columns and avoid N+1 or
  premature in-memory filtering.
- [ ] Export rechecks authorization and never exposes fields hidden from the
  corresponding approved report.
- [ ] Cancellation/timeout behavior follows the existing Sigma convention.

### 6. Owner-run Final Verification Checklist

Do not build, test, run, or inspect live Sigma traffic unless the owner
explicitly requests it in the current task. Supply this checklist and record
only evidence returned by the owner.

Functional:

- [ ] Report route opens correctly.
- [ ] Lookup filters load.
- [ ] Search sends the expected query parameters.
- [ ] Request includes the Bearer token.
- [ ] Base/default filters work.
- [ ] Customer/category-dependent filters work.
- [ ] Clear resets the expected state.
- [ ] Loading always stops.
- [ ] HTTP and non-success responses show an error.
- [ ] Empty results show the translated empty state.
- [ ] Print preview is readable.
- [ ] Export uses the effective Search filters, returns the approved format and
  filename, and never silently exports only the visible page.
- [ ] Export failure/cancellation leaves no partial file presented as complete.

UI:

- [ ] Search and Print are in the same row.
- [ ] Action icons are white and centered.
- [ ] Icon/text spacing works in LTR and RTL.
- [ ] Tables use consistent row heights.
- [ ] Wide reports scroll inside their table container.
- [ ] A bounded desktop shell uses one vertical report scroller; mobile,
  zoomed, or unbounded layouts reflow without trapping content.
- [ ] Mobile controls remain usable.
- [ ] No duplicate page title is shown.

Code:

- [ ] Models match the backend contract.
- [ ] No unnecessary `any` types were introduced.
- [ ] Service URL has no double slash.
- [ ] Service is registered in the authenticated injector scope.
- [ ] All subscriptions use `takeUntilDestroyed`.
- [ ] Loading cleanup uses `finalize`.
- [ ] English and Arabic keys are present.
- [ ] Owner-run TypeScript validation passes.
- [ ] Owner-run Angular development build passes.

Commands the owner may run:

```powershell
npm.cmd exec -- tsc --noEmit --project tsconfig.app.json
npm.cmd run build -- --configuration=development
```

### 7. Common Failures

#### Search does nothing

Check the browser Network tab. If the request exists, the click handler works. Inspect its status and response instead of changing the button blindly.

#### `401 Unauthorized`

The request is missing or using an invalid Bearer token. Register the report service in the same injector scope as `tokenInterceptor`.

#### Infinite loader

Move loader cleanup into RxJS `finalize` and confirm the error handler does not start another request.

#### `404 Not Found`

Confirm the controller/action route and ensure the URL does not contain a double slash.

#### Search succeeds but displays no rows

Verify response wrapper fields, filter enum values, customer/category rules, and whether the backend intentionally returned empty sections.

#### Raw translation keys appear

Add the key to both English and Arabic vocabularies and verify the template path matches the vocabulary hierarchy.
