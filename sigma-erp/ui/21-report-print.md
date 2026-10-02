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

When a report temporarily loads all filtered rows, pass cleanup as the callback
and wait for rendering before opening print:

```ts
this.printData.set(allRows);
requestAnimationFrame(() =>
  this.reportPrint.print({ afterPrint: () => this.printData.set([]) }),
);
```

Mark every non-report element `no-print` in the template — filters, toolbars,
inline errors. `appReportActions` already supplies `no-print` to its host:

```html
<form class="statement-filters no-print" …>
```

Every bounded height or scroll container of the report (the results section, a table frame,
a scroll wrapper) carries the shared class `sigma-print-flow` (`src/styles.scss`, 2026-10-01).
In print it releases `height`, `max-height`, `min-height` and `overflow`, so the whole report
flows onto paper instead of being clipped to one viewport. The universal page reset and
action hiding belong to `appReportPage` and `appReportActions`; hide inline errors with
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
If screen pagination is
enabled, bind it to a feature print-preparation signal, set that signal and wait
one render frame before calling `ReportPrintService`. Restore it with `afterPrint`
and when `print()` returns false. Keep controlled section offsets/sizes unchanged
and ignore preparation-time paging events so closing or cancelling print returns
to the same pages. Cancel a scheduled print-preparation frame when the feature is
destroyed. No API request is needed for already loaded report arrays; export
always uses those full arrays. CSS hiding of the pager alone cannot restore rows
that were sliced out of the DOM.

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

