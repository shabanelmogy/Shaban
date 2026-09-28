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

Feature `@media print` rules are still required only for feature-specific fixed
heights and scroll containers, so the whole report flows onto paper instead of
being clipped to one viewport. Universal page reset and action hiding belong to
`appReportPage` and `appReportActions`, not copied feature rules:

```scss
@media print {
  :host,
  .customer-statement-page,
  .customer-statement-panel {
    height: auto;
    min-height: 0;
    padding: 0;
    color: #222;
    background: #fff;
    box-shadow: none;
    overflow: visible;
  }

  .no-print,
  .statement-error {
    display: none !important;
  }

  .statement-ledger-section,
  .statement-ledger-scroll,
  .statement-supporting-scroll,
  .supporting-table-frame {
    height: auto;
    min-height: 0;
    overflow: visible;
  }
}
```

**Check:** print goes through `ReportPrintService` · no feature-level
`window.print()`, `DOCUMENT`, body-class or `afterprint` code · filters, action
toolbar and inline errors hidden · every scroll container switched to
`height: auto` + `overflow: visible` · dark surfaces forced to white with dark
text · totals footer prints with the rows · the printed scope is the full
report, not the visible page.

---

