# Complete vendor style inventory

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `SiGmaAngularFrontEnd/src`, excluding `src/app/_metronic` |
| Authority | `COMPLETE_VENDOR_RETIREMENT_MAINTENANCE_EVOLUTION_PLAN.md`; UI blocks 24 and 25 |
| Review date | 2026-10-22 |
| Verification | Read-only `rg` inventory; no build, test, or runtime verification |

## Result

The application has already moved the primary shared list/editor controls to
PrimeNG and Sigma-owned wrappers, but feature templates still contain a large
Bootstrap/Metronic presentation surface. The remaining work is primarily a
template and shared-style migration; it does not require API, payload, or
business-rule changes. The inventory deliberately excludes the live/obsolete
Metronic tree under `src/app/_metronic`, which is owned by the root migration.

The following counts are lexical occurrences in HTML, SCSS, and TypeScript
under `src` (not unique DOM controls). They were collected with `rg`, excluding
`**/_metronic/**`; overlapping classes therefore count in more than one group.

| Group | Occurrences | Files | Dominant old selectors/classes |
|---|---:|---:|---|
| Bootstrap buttons | 1,428 | 151 | `btn`, `btn-sm`, `btn-primary`, `btn-secondary`, `btn-danger`, `btn-light`, `btn-link` |
| Forms | 1,630 | 121 | `form-control`, `form-select`, `form-check`, `form-group`, `input-group` |
| Grid utilities | 11,910 | 696 | `row`, `col-md-*`, `col-lg-*`, `col-sm-*` |
| Cards | 1,101 | 262 | `card`, `card-body`, `card-header`, `card-footer` |
| Tables | 2,603 | 823 | `table`, `table-striped`, `table-hover`, `table-responsive` |
| Modal markup | 322 | 48 | `modal`, `modal-dialog`, `modal-content`, `modal-header`, `modal-body`, `modal-footer` |
| Navigation/dropdowns | 1,247 | 343 | `navbar`, `nav`, `nav-link`, `nav-item`, `dropdown`, `dropdown-menu`, `dropdown-item`, `breadcrumb` |

These totals include the repository-owned compatibility Sass under
`src/assets/sass/vendor/bootstrap` and Metronic-compatible Sass under
`src/assets/sass/core`; those files are style owners to retire after their
consumer migration, not feature consumers themselves.

## Concrete feature inventory

### Plain forms and grid markup

The clearest legacy pattern is generated detail markup such as
`<form class="row">`, `<div class="form-group col-md-12 col-lg-6 p-4">`, and
`<input class="form-control">`. Confirmed representative files are:

- `src/app/modules/Agreements Dashboard 2/Clause/components/details/details.component.html`
- `src/app/modules/Agreements Dashboard 2/PreTerminationRule/components/details/details.component.html`
- `src/app/modules/Agreements Dashboard 2/ProvisionDetail/components/details/details.component.html`
- `src/app/modules/Billing/BillSettings/components/details/details.component.html`
- `src/app/modules/Billing/BillingInvoice/components/details/details.component.html`
- `src/app/modules/Workshop/workshopVehicles/components/list/list.component.html`

The same pattern appears across Administration, Accounts, Assets, Fleet,
HRM, Stock, Vouchers, Workshop, and other generated detail/list screens. The
selectors to remove or replace are `row`, `col-*-*`, `form-group`, `form-control`,
`form-select`, `form-check`, `p-*`, `m-*`, and the associated `fw-*`/`text-*`
utility classes. Existing typed reactive forms and field names remain the
feature contract.

### Plain buttons and report actions

Direct raw Bootstrap actions remain in feature templates, including:

- `src/app/modules/shared/components/reports/reports.component.html` — raw
  `btn btn-sm fw-bold btn-secondary` and `btn btn-sm fw-bold btn-primary`.
- `src/app/modules/Suppliers/SupplierStatementOfAccount/components/list/list.component.html` —
  repeated `btn btn-secondary` refresh/reset/print/export actions.
- `src/app/modules/errors/error404/error404.component.html` and
  `src/app/modules/errors/error500/error500.component.html` — `btn btn-sm btn-primary`.

The remaining feature-wide button selectors include `btn-primary` (13),
`btn-secondary` (96), `btn-danger` (8), `btn-light` (3), and `btn-link` (24)
occurrences after excluding `_metronic`. `btn` also occurs as the base of
legacy class combinations. Replace solid primary actions with
`app-primary-action-button`; use `sigma-secondary-button` and
`sigma-danger-button` for secondary/destructive actions. Preserve action IDs,
disabled/loading guards, labels, icons, and confirmations.

### Plain cards, tables, nav, and modal markup

Representative residual markup includes:

- `src/app/modules/errors/errors.component.html` — Metronic-style
  `card card-flush`, `card-body`, and spacing utilities.
- `src/app/modules/Administration/Settings/components/holidays-setting/holidays-setting.component.html` —
  direct `p-dialog` owned by the settings feature and requiring the shared
  dialog migration/conformance pass.
- `src/app/modules/Administration/Settings/components/fines/fines.component.html`,
  `e-salik/e-salik.component.html`, and `e-darb/e-darb.component.html` — direct
  `p-table`/`p-dialog` feature markup that should converge on shared
  `app-data-table` and `app-editor-dialog` where the existing contract allows.
- `src/app/modules/shared/components/reports/reports.component.html` — direct
  PrimeNG tables mixed with Bootstrap form/button classes; this is a shared
  owner and should be migrated before feature-by-feature cleanup.

The old table lexemes are widespread (`table` 2,603 occurrences); only four
`table-responsive` occurrences and 32 `table-striped` occurrences remain in
the scanned source. Do not replace semantic HTML table rows in
`app-editable-collection-table` or `app-data-table` by blind string rewrite;
their shared owners preserve keyboard, paging, print, RTL, and scroll behavior.

### Feature SCSS selectors

Only six application feature SCSS files directly define or target old vendor
selectors (excluding `assets/sass`):

- `src/app/modules/Administration/Settings/components/fields/fields.component.scss`
- `src/app/modules/Administration/Settings/components/settings-layout/settings-layout.component.scss`
- `src/app/modules/Banking/Card Transactions Bank Transfers/CardTransactionBankTransfer/components/details/details.component.scss`
- `src/app/modules/Vouchers/Invoices/Invoice/components/details/details.component.scss`
- `src/app/modules/Vouchers/Invoices/Invoice/components/rental-details/rental-details.component.scss`
- `src/app/layout/components/header/appbar-shortcuts/appbar-shortcuts.component.scss`

The first five need selector-by-selector conversion to the owning shared
component or logical Sigma tokens. The header shortcut file is shell-owned and
must follow the Appbar hierarchy in UI24; it should not be converted by a
feature-level utility rewrite.

### Class-bound TypeScript

No application TypeScript code was found that imports `@ng-bootstrap` or uses
`Ngb*` controls. The remaining class-bound DOM code is mostly intentional
Sigma/PrimeNG behavior:

- `src/app/modules/shared/service/global-input-clear.service.ts` owns
  `sigma-input-clear-button`, `sigma-clearable-input`, and PrimeNG
  `.p-iconfield` compatibility hooks.
- `src/app/modules/shared/directives/quantity-input.directive.ts` owns
  PrimeNG `.p-inputnumber-*` hooks.
- `src/app/modules/errors/errors.component.ts` owns body classes for the error
  shell.
- `src/app/modules/shared/service/report-print.service.ts` owns print body
  classes.

These are not old Bootstrap consumers and should be retained while checking
the migrated DOM. The only package-level vendor residue found in `package.json`
is `@popperjs/core`; no source import remains outside `_metronic`, so removal is
an owner graph/package-manager step after the root migration proves legacy KT
roots are gone.

## Replacement ownership and migration order

| Old surface | Replacement owner | Migration rule |
|---|---|---|
| `btn*`, `fw-*`, output buttons | `PrimaryActionButtonComponent`, `sigma-secondary-button`, shared report/output actions | Preserve labels, icons, loading, disabled state, confirmation, print behavior |
| `form-control`, `form-select`, `form-check`, `input-group` | Native inputs plus PrimeNG `p-select`, `p-datepicker`, `p-inputnumber`, `p-checkbox`, `p-radiobutton`; shared field styles | Migrate control-by-control; retain typed forms and validation slots |
| `row`, `col-*`, spacing utilities | Shared `FilterPanel`, `FormSection`, editor grid, logical Sigma layout tokens | Do not invent per-feature palettes or page-height calculations |
| `card*`, KPI/summary cards | `app-summary-cards`, `app-form-section`, feature panel owners | Preserve content and scroll owner; use UI24 shared tokens |
| `table*`, table paging/actions | `app-data-table`, `app-editable-collection-table` | Keep exact columns, row identity, paging, export, print, and action contracts |
| raw modal markup / direct dialogs | `app-editor-dialog`, `app-confirmation-dialog`, PrimeNG `p-dialog` only where a shared owner is not applicable | Body-appended overlays receive global style class and UI24/25 theme/RTL rules |
| `navbar`, `nav`, `dropdown*` | `ShellHeader`, sidebar menu, `EditorTabs`, PrimeNG `p-menu`/`p-popover` | Preserve Appbar visual hierarchy and direction-aware focus/overlay behavior |
| `text-*`, `bg-*`, `shadow`, `rounded` | Global `--sigma-*` tokens and shared component classes | No feature palette copies; use `:host-context` for feature domain dark values |

The smallest source-supported implementation approach is dependency ordered:
first finish shared `reports`, shared form/dialog/table owners, and the six
feature SCSS files; then migrate repeated generated detail templates by screen
shape (editor/list/report), using the canonical shared owner for each shape.
Finally remove unused vendor Sass/plugin selectors and packages only after a
fresh import/class inventory proves no consumer remains. A global
find-and-replace is unsafe because the same `table`, `row`, and `form-*`
lexemes also occur in semantic shared components and test fixtures.

## Evidence and limitations

The scan was source-only and did not run a build, browser, visual, RTL, theme,
or accessibility check. Counts are lexical and include test/spec source where
the extension matched; they are an inventory baseline, not proof that every
occurrence renders. The root agent should rerun the same exclusions after each
migration and separately inspect generated assets and package imports before
deleting vendor Sass, Popper, Bootstrap Icons, or `data-bs-theme` support.
