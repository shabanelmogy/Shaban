# Sigma UI Pattern Book — Draft Canonical

| | |
|---|---|
| Status | **Draft canonical.** Binding for new work; open items in block 30 |
| Version | 1.51 |
| Last verified against source | 2026-09-21 (shared `data-table`, `editor-dialog`, `feature-title`, `base-component.service.ts`, `loading.service.ts`, and `src/styles.scss` re-checked 2026-09-28) |
| Last content change | 2026-10-02 — Follow Up adopts the frozen professional Summary extension in its existing Details/Summary workspace tabs: responsive 960px maximum, shared server-owned additive KPI cards, shared-grid comparison cells and raw-username drill-down, with active-section Excel and full-document print preserving state. Feature formulas remain in the frozen contract/review. UI 20 and skill synchronized; source-only, owner visual/runtime acceptance pending. History in `../CHANGELOG.md` |
| Verified by | source inspection only — no build, test, or browser run |

One page per UI building block. Every block has a **reference file** you can
open, a **copy-this** snippet from real code, and a short **check** list.

Paths are relative to `SiGmaAngularFrontEnd/src/app/modules`.

This book answers "how do I build the next screen so it matches", and it is the
single authority for Angular work. The companion for server-side work is
`SIGMA_BACKEND_PATTERNS.md`; the two share the ListVM, filter and payload
contracts, so a change to either side is a change to both.

Review orchestration, screenshot evidence, phase ownership, contract artifacts,
and final reconciliation are defined by `SIGMA_FEATURE_REVIEW_MASTER.md`. This
book remains the Angular implementation authority incorporated by that master.
Screenshots supply functional and content evidence only; they do not override
this book's component, layout, accessibility, RTL, theme, or responsive rules.

### Application-wide visual consistency invariant

Sigma uses one visual language across the application. For the same UI role,
features must consume the same shared component, appearance variant, design
tokens, density, border radius, focus treatment, icon treatment, RTL behavior
and dark-theme behavior. A feature must not invent a second visual treatment for
Tabs, Dropdowns, Inputs, Buttons, Filters, Tables, Cards, Dialogs, Confirmations,
Loading/Error states or other repeated controls merely because local CSS can
produce it.

When an approved screen exposes a reusable visual pattern, move that pattern to
the owning shared component or shared token first, then make all in-scope
consumers use it. Do not copy the reference feature's CSS into another feature.
`app-editor-tabs appearance="workspace"` is the canonical routed-workspace tab
appearance used by Opening Balances and Link Accounts. Canonical PrimeNG
Dropdowns use one wrapper border, `6px` radius, shared surface/text/border
tokens, the common primary focus ring, and the shared `34px` filter height or
`36px` editable-row height according to context.

Existing legacy screens may still contain older visual forks. Treat those as
unification debt: do not copy them, and replace them with the canonical shared
pattern when the feature is reviewed or modified. A deliberate visual exception
must be named by UI shape in this book with a concrete usability/business reason;
feature preference alone is not an exception.

**Definition-of-Done gate:** every frontend review/reconciliation must compare
repeated controls against their canonical shared owner. A scoped feature is not
visually complete while it keeps feature-local duplicate tab/dropdown/button
styling that the shared component or token already owns.

### Generation packets

Coding models should not load this entire book when a reviewed phase or task
packet exists. Use the generated packet under `recipe-system/generated/` and
the approved reference named by that packet. Generated packets are derivative:
this book remains authoritative when they disagree.

`recipe-system/Generate-SigmaRecipes.ps1 -Check` verifies that each generated
packet still carries the current fingerprints of its canonical source blocks.
Tasks without a matching recipe use the smallest applicable block dependency
closure from this book.

## Shared owner per shape

Do not read one feature as the reference for everything. **Screen-level reference
implementations live in one place only: `ui/screens/00-catalog.md`** (list, routed editor, step
form, tree, financial collection, settings workspace, report, financial document, action dialog).
This table names the shared piece each shape is built on and what the feature keeps.

| Shape | Shared owner | The feature owns |
|---|---|---|
| Solid primary action | `shared/components/primary-action-button/` (button/submit semantics, tokens, icon, busy state, focus, RTL arrows) | translated label and behaviour |
| List, grid, paging | `shared/components/data-table/` (`[fill]`, column `type`, `dataTableExportRows`) + the `sigma-list-*` shell (block 1) | typed columns, server paging, sorting, errors, refresh state |
| List filters | `shared/components/filter-panel/` (strip, *More filters*, Reset, dark/RTL, responsive); reports use the `sigma-report-filter-*` strip | fields, order, width, form and search logic |
| Step form | `shared/components/step-form/` + `shared/components/form-validation-summary/` | one parent form, step gating, invalid-field focus, persistence |
| Form section | `shared/components/form-section/` (section card, heading, header actions, density, fill height, light/dark) | form controls, validation, behaviour |
| Add/View/Edit modal, with or without tabs | `shared/components/editor-dialog/` + `shared/components/editor-tabs/` | content, typed tab state, forms, validation, dirty-close, persistence |
| Routed document editor | the shared editor shell (`src/styles.scss`, block 1) + `shared/utils/editable-rows.ts` + `app-field-error` | workspace layout, forms, persistence |
| Editable child collection | `shared/components/editable-collection-table/` (chrome, headers, Add/Remove, empty state, `fillHeight` scroll, light/dark); consumers `Customers/Companies/CompanyPartner/components/detalisForm/{contact-persons,credit-cards,documents,drivers}` | typed rows, projected cells and actions, validation, confirmation, persistence |
| Nested child draft | editor dialog + editor tabs; consumer `Customers/Companies/CompanyPartner/components/detalisForm/drivers` | draft isolation, dirty-close approval, parent commit on Save only |
| Confirmation and discard | `shared/service/confirmation-dialog.service.ts` (block 9, 10); `requestClose()` in `Workshop/Job/components/editor` (routed) and `Fleet/Vehicle/components/details` (dialog) | when to ask, and what happens after |
| Report | `shared/components/report-page/` + `shared/components/report-actions/` + shared print coordination | typed filter, sections, totals |

Shared pieces added in the shared-first rewrite (2026-10-01): `app-field-error` (block 19),
`app-state-message` (block 22), `enumOptions` (16), `parseDateValue`/`parseDateRange`/
`currentMonthRange` (17), `toListParams`/`fetchAllPages` (2, 8), the `money` pipe (14, 20),
`sigma-danger-button` (24), `sigma-print-flow` (21), editable-table `stickyHeader` (14) and the
filter panel `--check`/`--choice` fields (4). A block that shows older feature markup uses it
for semantics only; the presentation is the shared piece.

## Pattern status

Every block is labelled. Check the label before copying.

| Label | Meaning |
|---|---|
| **Canonical** | Copy this. It is the intended pattern. |
| **Transitional** | Works and is consistent, but a better shared solution is planned in block 30. Match existing screens; do not spread it further than needed. |
| **Legacy — do not copy** | Present in source, kept working, but wrong. Never use as a model. |
| **Governance** | Tracking information, not an implementation pattern. |

Nothing in this book is "copy exactly" without reading its label first.

### Reusable replacement invariant

When a Canonical block names an approved shared component as a mandatory
replacement, every scoped review, fix, or refactor must replace the legacy
implementation in the existing feature before completion. A request to restore
or preserve the previous appearance applies only to feature-owned layout,
filter placement, and styling; it never authorizes restoring a legacy wrapper,
copying shared internals, or treating Git history as the component authority.

If the required appearance cannot be expressed through the shared component's
public inputs, outputs, content projection, or supported CSS variables, report
the missing shared capability and improve that component in scope. Do not
silently revert the consumer to the legacy implementation.

## Contents

**Structure**

| # | Block | Status | Reference |
|---|---|---|---|
| 1 | [Feature folders and wiring](01-feature-folders-and-wiring.md) | Canonical | `CompanyPartner/` |
| 2 | [Service and response wrappers](02-service-and-response-wrappers.md) | Canonical | `shared/utils/list-query.ts` + `Workshop/Job/services/job.service.ts` |

**Main page**

| # | Block | Status | Reference |
|---|---|---|---|
| 3 | [Header](03-header.md) | Canonical | `Workshop/Job/components/list/list.component.html` |
| 4 | [Filters](04-filters.md) | Canonical | `shared/components/filter-panel/` + `Workshop/Job/components/list` |
| 5 | [Columns](05-columns.md) | Canonical | `Fleet/VehicleService/components/list/list.component.ts` |
| 6 | [Grid and footer](06-grid-and-footer.md) | Canonical | `shared/components/data-table/` + `Workshop/Job/components/list` |
| 7 | [Action button cycle](07-action-button-cycle.md) | Canonical + quotation specialization | `shared/components/action-button/` + `Sales/SalesQuotation/components/list` |
| 8 | [Export to Excel](08-export-to-excel.md) | Canonical | `fetchAllPages` + `dataTableExportRows`, Job list |

**Dialogs**

| # | Block | Status | Reference |
|---|---|---|---|
| 9 | [Confirm: delete](09-confirm-delete.md) | Canonical | list `confirmDelete` |
| 10 | [Confirm: discard](10-confirm-discard.md) | Canonical | `Fleet/Vehicle` + Company editor |
| 11 | [Small modal on top](11-small-modal-on-top.md) | Canonical | drivers `deleteDriver` |

**Create and edit**

| # | Block | Status | Reference |
|---|---|---|---|
| 12 | [Step form](12-step-form.md) | Canonical composite | shared step navigation + form sections + CompanyPartner details |
| 13 | [Modal with tabs](13-modal-with-tabs.md) | Canonical composite | `shared/components/editor-dialog/` + `shared/components/editor-tabs/` + `Fleet/VehicleService/components/details` + block 10 close lifecycle |
| 14 | [Editable collection table](14-editable-collection-table.md) | Canonical | shared editable collection, VehicleService details |
| 15 | [View mode](15-view-mode.md) | Canonical | editor + child sections |

**Controls**

| # | Block | Status | Reference |
|---|---|---|---|
| 16 | [Dropdowns, lookups, enums](16-dropdowns-lookups-enums.md) | Canonical | `shared/utils/enum-options.ts` + Job editor |
| 17 | [Dates](17-dates.md) | Canonical | `shared/utils/date-utils.ts` + Job list/editor |
| 18 | [Documents and upload](18-documents-and-upload.md) | Canonical | `shared/components/file-field/` + `DocumentUploadTracker` + `detalisForm/documents/` |
| 19 | [Validation messages](19-validation-messages.md) | Canonical | `shared/components/field-error/`; *Money and tax in forms* section |

**Reports**

| # | Block | Status | Reference |
|---|---|---|---|
| 20 | [Report page](20-report-page.md) | Canonical composite | shared report page/actions + `sigma-report-*` classes + `Accounts/TrailBalance/` (Statement of Account for semantics) |
| 21 | [Report print](21-report-print.md) | Canonical | `shared/service/report-print.service.ts` |

**Cross-cutting**

| # | Block | Status | Reference |
|---|---|---|---|
| 22 | [Loading, empty, error, toast](22-loading-empty-error-toast.md) | Canonical | `errorInterceptor`, `LoadingService`, `shared/components/state-message/` |
| 23 | [Translations](23-translations.md) | Canonical | `i18n/vocabs/en.ts`, `ar.ts` |
| 24 | [Colors, icons, buttons](24-colors-icons-buttons.md) | Canonical | global `--sigma-*` tokens + `primary-action-button` + `sigma-secondary-button`/`sigma-danger-button` |
| 25 | [RTL and dark theme](25-rtl-and-dark-theme.md) | Canonical | `translation.service.ts` |

**Governance**

| # | Block | Status | Reference |
|---|---|---|---|
| 26 | [Permissions and route access](26-permissions-and-route-access.md) | Transitional | `auth.guard.ts`, `app-routing.module.ts` |
| 27 | [Focus and keyboard](27-focus-and-keyboard.md) | Canonical | shared confirmation, `p-dialog` |
| 28 | [Request cancellation and stale responses](28-request-cancellation-and-stale-responses.md) | Canonical | list + dialog components |
| 29 | [Verification expectations](29-verification-expectations.md) | Canonical | — |
| 30 | [Unification backlog](30-backlog-by-priority.md) | Governance | app-wide |

---
