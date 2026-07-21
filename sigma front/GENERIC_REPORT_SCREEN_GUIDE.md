# Generic Report Screen Guide

Use this guide when creating or refactoring a report screen in the Sigma Angular application. The tariff report is the reference implementation, but the rules below are generic and apply to list, summary, grouped, and detailed reports.

Reference implementation:

- `src/app/modules/Limousine/limousineTariffReport`
- Backend endpoint: `LimousineTariff/GenerateReport`

## 1. Recommended Feature Structure

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

## 2. Confirm the Backend Contract First

Before building the UI, verify:

- Controller route and HTTP method.
- Authentication requirement.
- Supported filter names and enum values.
- Whether filters are normal query parameters or a `Filters` dictionary.
- Response wrapper (`Result<T>`, `Results<T>`, or direct response).
- Empty-report behavior.
- Which sections and columns are conditional.

For a specification request using a `Filters` dictionary, the query format is:

```text
Filters[customerId]=360
Filters[tariffCategory]=2
```

Do not guess enum values. Copy the exact numeric values from the backend C# enum.

## 3. Define Strongly Typed Models

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

## 4. Build the Report Service

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

## 5. Authentication Is Mandatory

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

Verify the browser request contains:

```text
Authorization: Bearer <token>
```

Never solve `401` by adding `[AllowAnonymous]` to a protected report endpoint.

## 6. Component State and Loading

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

## 7. Filter Toolbar UI

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

## 8. Report Content

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

### Scrolling and fixed report chrome

Confirmed project rules for long reports:

- Do not add a page-level vertical scrollbar to report screens.
- Keep the report body/results area as the only vertical scrolling container.
- Keep the table header outside the scrolling body so column headings remain visible.
- Keep summary/footer totals outside the scrolling body so totals remain visible.
- Use the same table layout and column widths for the header, body, and summary so every total stays under its corresponding column.
- When centered presentation is specified, center column headings, row content, and summary values consistently.
- Allow horizontal scrolling only inside the report/table container when columns do not fit.

Do not make names clickable unless navigation is an explicit report requirement.

## 9. Empty, Loading, and Error States

Always distinguish these states:

1. Loading: spinner and disabled actions.
2. Success with data: render report sections.
3. Success without rows: show a translated empty state.
4. HTTP/business failure: stop loading and show the global error dialog.

Do not silently swallow a failed response. The user must receive feedback.

## 10. Print Behavior

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

  .report-section {
    break-inside: avoid;
  }

  table {
    min-width: 0;
    font-size: 9pt;
  }
}
```

Before completion, verify:

- Filter buttons are hidden in print preview.
- Tables fit printable width.
- Section headings remain with their table where possible.
- Colors remain readable in grayscale.

## 11. Translation and RTL

Add all new labels to both:

- `src/app/modules/i18n/vocabs/en.ts`
- `src/app/modules/i18n/vocabs/ar.ts`

Never display a raw key such as `general.required` or `report.rate`.

RTL rules:

- Prefer `margin-inline-start/end` and `padding-inline-start/end`.
- Prefer `inset-inline-start/end` for positioned controls.
- Use `text-align: start/end` instead of fixed left/right.
- Verify icon/text spacing and dropdown clear buttons in Arabic.

## 12. Routing and Menu Integration

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

## 13. Verification Checklist

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

UI:

- [ ] Search and Print are in the same row.
- [ ] Action icons are white and centered.
- [ ] Icon/text spacing works in LTR and RTL.
- [ ] Tables use consistent row heights.
- [ ] Wide reports scroll inside their table container.
- [ ] The page itself does not scroll vertically; long report results scroll inside their report container, and wide tables scroll horizontally inside their table container.
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
- [ ] TypeScript validation passes.
- [ ] Angular development build passes.

Run:

```powershell
npm.cmd exec -- tsc --noEmit --project tsconfig.app.json
npm.cmd run build -- --configuration=development
```

## 14. Common Failures

### Search does nothing

Check the browser Network tab. If the request exists, the click handler works. Inspect its status and response instead of changing the button blindly.

### `401 Unauthorized`

The request is missing or using an invalid Bearer token. Register the report service in the same injector scope as `tokenInterceptor`.

### Infinite loader

Move loader cleanup into RxJS `finalize` and confirm the error handler does not start another request.

### `404 Not Found`

Confirm the controller/action route and ensure the URL does not contain a double slash.

### Search succeeds but displays no rows

Verify response wrapper fields, filter enum values, customer/category rules, and whether the backend intentionally returned empty sections.

### Raw translation keys appear

Add the key to both English and Arabic vocabularies and verify the template path matches the vocabulary hierarchy.
