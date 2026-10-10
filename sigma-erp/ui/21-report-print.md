## 21. Report print

> **Status: Canonical** — `shared/service/report-print.service.ts`

Print is a first-class output, not an afterthought.

**`window.print()` on its own is not enough.** Metronic ships the rule that
strips the application shell, but it is opt-in via a body class. From
`assets/sass/core/layout/base/_print.scss`:

```scss
// Add .app-print-content-only class to body element in order to allow printing only the content area
@media print {
  .app-print-content-only {
    .app-wrapper, .app-page, .app-content, .app-container { padding: 0 !important; margin: 0 !important; }
    .app-aside, .app-sidebar, .app-header, .app-footer, .app-toolbar,
    .drawer, .scrolltop, .btn { display: none !important; }
  }
}
```

Without that class the app header, sidebar and toolbar print alongside the
report. `ReportPrintService` owns adding it, invoking the browser print dialog,
and removing it after print or cancel. Report components must not call
`window.print()`, inject `DOCUMENT`, or register their own `afterprint` cleanup:

```ts
private readonly reportPrint = inject(ReportPrintService);

print(): void {
  this.reportPrint.print();
}
```

For a reviewed report with controlled local pagination, use the shared preparation
session instead of repeating frame scheduling, a mutable print flag and destroy cleanup:

```ts
private readonly printSession = inject(ReportPrintService).createSession(inject(DestroyRef));
readonly printing = this.printSession.printing;

print(): void {
  if (this.report() && !this.loadingReport()) this.printSession.print();
}
```

Bind every applicable grid's paginator and scrollable inputs to `!printing()`,
disable the report form during preparation and ignore paging events until it ends.
`createSession(DestroyRef)` guards repeat clicks, waits one render frame, delegates to
the existing print owner, restores its readonly signal on afterPrint or a false
print result, and cancels a pending frame on destroy. Controlled offsets and sizes
stay feature-owned and are retained. Plain `print(options)` remains compatible for
other confirmed output lifecycles; no reference screen is rewritten solely to adopt
this helper. This is source-verified preparation behavior, not browser acceptance.

**Dialog reports (2026-10-03).** A read-only EditorDialog preview can opt into shared print
isolation with `dialogClass="sigma-report-print-dialog"` (alongside its feature class) and
`printSession.print({ bodyClasses: ['sigma-dialog-print'] })`. The shared stylesheet hides the
application root, other portal dialog masks and the report header/footer, releases only the
mask containing `sigma-report-print-dialog` and its content bounds, and
uses white paper with dark text. `ReportPrintSession.print(options?)` forwards body classes and
calls an optional caller `afterPrint` after restoring its signal; existing no-argument callers
retain their lifecycle. The report's bounded layers still carry `sigma-print-flow`.
Keep the Print action in the fixed dialog footer via `editorDialogHint`, mark inline state/error
messages `no-print` and disable printing until applicable data loads finish. Do not add a private
body-class lifecycle or duplicate dialog scroll-release rules in feature SCSS. Movement Check
Card adopts this helper; existing printing consumers are unchanged.

Mark every non-report element `no-print` in the template — filters, toolbars,
inline errors. `appReportActions` already supplies `no-print` to its host:

```html
<form class="statement-filters no-print" …>
```

Every bounded height or scroll container of the report (the results section, a table frame,
a scroll wrapper) carries the shared class `sigma-print-flow` (`src/styles.scss`, 2026-10-01).
In print it releases `height`, `max-height`, `min-height` and `overflow`, so the whole report
flows onto paper instead of being clipped to one viewport. The universal page reset and
action hiding belong to `appReportPage` and `appReportActions`. An opt-in
`app-form-section.sigma-print-flow` releases its internal fill/content bounds in the shared
component stylesheet, using white paper and dark text. Mark the shared host rather than
piercing its internals with feature `ng-deep` rules; existing sections retain their default
screen behavior. Hide inline errors with
`no-print`:

```html
<section class="statement-ledger-section sigma-print-flow">
  <div class="statement-ledger-scroll sigma-print-flow">…</div>
</section>
<div class="statement-error no-print">…</div>
```

For a tabbed report (blocks 13/20), mark the tab strip `no-print`, retain every
mode-applicable panel in the DOM and hide inactive panels only inside
`@media screen`. Print all applicable sections with their headings, independent
of the active tab. Feature print rules may separate sections and keep a heading
with its table; shared `sigma-print-flow` still owns releasing the scroll bounds.
Do not select a different tab or fetch data merely to print the full report.

When the owner removes a duplicate heading already supplied by a tab label,
hide that panel heading only in screen media. Keep the panel's tab-based
accessible name and retain the heading in print, where the navigation is hidden.

Shared-grid reports (block 6) must render every response row with
`paginator=false` and `scrollable=false` during printing. A screen grid using
fill=true binds scrollable to the inverse of its print-preparation signal; this
selects the shared flow variant and removes the fill class for print. Print
section layouts use normal document flow and bounded layers carry sigma-print-flow.
For reviewed locally paginated reports, use the `createSession(DestroyRef)` owner
shown above for preparation, restoration and destroy cancellation. Keep controlled
section offsets/sizes unchanged and ignore preparation-time paging events so closing
or cancelling print returns to the same pages. No API request is needed for already
loaded report arrays; export always uses those full arrays. CSS hiding of the pager
alone cannot restore rows that were sliced out of the DOM.

The shared flow variant hides pager controls during print and releases internal
wrapper bounds and owns white print cells, normal wrapping and table width;
the external report frame still carries `sigma-print-flow`. Features do not
copy these PrimeNG print rules into their own stylesheets.

A feature `@media print` rule remains only for print-specific content (a print header, a
page break). Existing per-feature scroll-release rules are replaced by the class during the
screen's review.

**Check:** print goes through `ReportPrintService` · every bounded container carries
`sigma-print-flow` · no feature-level
`window.print()`, `DOCUMENT`, body-class or `afterprint` code · filters, action
toolbar and inline errors hidden · every scroll container switched to
`height: auto` + `overflow: visible` · dark surfaces forced to white with dark
text · totals footer prints with the rows · the printed scope is the full
report, not the visible page.

---

