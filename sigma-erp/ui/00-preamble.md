# Sigma UI Pattern Book — Draft Canonical

| | |
|---|---|
| Status | **Draft canonical.** Binding for new work; open items in block 30 |
| Version | 0.71 |
| Last verified against source | 2026-09-21 (shared `data-table`, `editor-dialog`, `feature-title`, `base-component.service.ts`, `loading.service.ts`, and `src/styles.scss` re-checked 2026-09-28) |
| Last content change | 2026-09-28 — block 6 *Current page report format* (`currentPageReport="<feature>.showingEntries"`). History in `../CHANGELOG.md` |
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

## Reference per shape

Do not read one feature as the reference for everything. Each shape has its own,
and they differ deliberately.

| Shape | Canonical reference | Why |
|---|---|---|
| Solid primary action | `shared/components/primary-action-button/` | Shared `app-primary-action-button` owns button/submit semantics, primary tokens, icon placement, busy state, focus visibility, and RTL arrows; features supply translated labels and behavior |
| List, grid, paging | `shared/components/data-table/` + `Fleet/VehicleService/components/list` | Shared `app-data-table` owns PrimeNG rendering and table styling; the feature owns typed columns, server paging, sorting, errors, and refresh state |
| List filters | `Accounts/openingBalances/components/details` + `Customers/Individual/IndividualPartner/components/list` | Opening Balances is the canonical reference for the compact filter strip that a new screen uses; IndividualPartner remains the reference for the retained flat 12-column list-filter grid. List paging, sorting, actions and table integration remain owned by their own blocks and references |
| Step form | `shared/components/step-form/` + `shared/components/form-validation-summary/` + `Customers/Companies/CompanyPartner/components/details` | Shared `app-step-form` owns progress navigation and `app-form-validation-summary` owns the accessible invalid-field summary; the feature owns one parent form, step gating, invalid-field discovery/focus, content, actions, and persistence |
| Form section | `shared/components/form-section/` + `Customers/Companies/CompanyPartner/components/details` | Shared `app-form-section` owns the repeated section card, translated heading, optional description/icon, projected header actions, compact density, fill-height mode, responsive layout, and light/dark styling; the feature projects its form controls and owns validation and behavior |
| Ordinary Add/View/Edit modal | `shared/components/editor-dialog/` + `Fleet/VehicleService/components/details` | Shared `app-editor-dialog` owns the controlled PrimeNG shell and mode-aware footer; the feature owns content, forms, validation, dirty-close and persistence |
| Tabbed Add/View/Edit modal | `shared/components/editor-dialog/` + `shared/components/editor-tabs/` + `Fleet/VehicleService/components/details` | Use `app-editor-dialog` for the shell and `app-editor-tabs` for accessible navigation; the feature owns typed tab state, panels, bounded content and forms |
| Editable child collection | `shared/components/editable-collection-table/` + `Fleet/VehicleService/components/details` + `Customers/Companies/CompanyPartner/components/detalisForm/{contact-persons,credit-cards,documents,drivers}` | Shared `app-editable-collection-table` owns collection chrome, required headers, optional heading, Add/default Remove or projected row actions, empty state, responsive table behavior, bounded `fillHeight` scrolling, and light/dark styling; the feature owns typed rows, projected cells/actions, validation, confirmation, mutation, and persistence |
| Hierarchy tree workspace | `Accounts/Account/components/list` + `components/details` | Canonical routed tree editor for true parent/child master data: feature title + compact tree toolbar + bounded internal tree scroll + embedded detail pane; preserve hierarchy semantics instead of converting the tree to a flat Grid |
| Financial collection editor | `Accounts/openingBalances/components/details` + tab editors + `shared/components/editable-collection-table/` | Routed accounting workspace for dense editable financial rows: immutable/server-owned context in the feature header, compact tabs/filters, grow-until-cap card, internal row scroll with sticky headers, visible Debit/Credit totals plus optional backend-owned Balance/Net when useful, and Save action |
| Tabbed settings workspace | `Accounts/Link Accounts/LinkAccounts/components/details` + `shared/components/editor-tabs/` | Routed settings/account-mapping workspace: shared workspace tabs, fixed route surface with no main-page vertical scroll, one internal content scroll owner, and Save outside that scroll region |
| Nested child draft | `shared/components/editor-dialog/` + `shared/components/editor-tabs/` + `Customers/Companies/CompanyPartner/components/detalisForm/drivers` | Shared dialog/tab/section components own presentation and accessible navigation; the feature owns draft isolation, dirty-close approval and parent commit on Save only |
| Confirmation and discard | `shared/service/confirmation-dialog.service.ts`, `Fleet/Vehicle` `requestClose()` | Single shared dialog for every yes/no |
| Report | `shared/components/report-page/` + `shared/components/report-actions/` + `Customers/StatementOfAccount/components/list` + `Reports/TrailBalance/components/list` | Shared page/action chrome around a typed filter, sectioned response and totals; Trial Balance is the canonical dense accounting tree/table visual variant; shared print coordination |

Where a block shows Company/Individual markup for a filter concern, use it only
for the filter shape. `shared/components/data-table` owns the reusable table
shell, while `Fleet/VehicleService` remains the canonical paged-grid feature
integration.

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
| 2 | [Service and response wrappers](02-service-and-response-wrappers.md) | Transitional | `services/companypartner.service.ts` |

**Main page**

| # | Block | Status | Reference |
|---|---|---|---|
| 3 | [Header](03-header.md) | Canonical | `components/list/list.component.html` |
| 4 | [Filters](04-filters.md) | Canonical | `Accounts/openingBalances/components/details` (compact strip) + `Customers/Individual/IndividualPartner/components/list` (retained flat grid) |
| 5 | [Columns](05-columns.md) | Canonical | `Fleet/VehicleService/components/list/list.component.ts` |
| 6 | [Grid and footer](06-grid-and-footer.md) | Canonical | `shared/components/data-table/` + `Fleet/VehicleService/components/list` |
| 7 | [Action button cycle](07-action-button-cycle.md) | Transitional + canonical quotation specialization | `shared/components/action-button/` + `Sales/SalesQuotation/components/list` |
| 8 | [Export to Excel](08-export-to-excel.md) | Canonical | list `exportToExcel` |

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
| 16 | [Dropdowns, lookups, enums](16-dropdowns-lookups-enums.md) | Canonical | filters + drivers |
| 17 | [Dates](17-dates.md) | Canonical | drivers, documents |
| 18 | [Documents and upload](18-documents-and-upload.md) | Transitional | `detalisForm/documents/` |
| 19 | [Validation messages](19-validation-messages.md) | Canonical | child sections |

**Reports**

| # | Block | Status | Reference |
|---|---|---|---|
| 20 | [Report page](20-report-page.md) | Canonical composite | shared report page/actions + `Customers/StatementOfAccount/` + `Reports/TrailBalance/` |
| 21 | [Report print](21-report-print.md) | Canonical | `shared/service/report-print.service.ts` |

**Cross-cutting**

| # | Block | Status | Reference |
|---|---|---|---|
| 22 | [Loading, empty, error, toast](22-loading-empty-error-toast.md) | Canonical | list + dialogs |
| 23 | [Translations](23-translations.md) | Canonical | `i18n/vocabs/en.ts`, `ar.ts` |
| 24 | [Colors, icons, buttons](24-colors-icons-buttons.md) | Transitional | `shared/components/primary-action-button/` + approved composite controls |
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

