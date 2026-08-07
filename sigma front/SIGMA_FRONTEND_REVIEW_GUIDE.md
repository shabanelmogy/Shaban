# Sigma Frontend Review Guide

Use this single guide for every Sigma Angular screen: grid/list, normal form,
modal, step form, report, export, lookup, nested editor, and upload screen.

The goal is a professional review and the smallest safe correction inside the
current Sigma pattern. Apply the current architecture boundary in Section 1.

## Mandatory AI execution contract

This section controls how an AI must use the guide. It is not an optional
summary.

1. Read according to review depth before inspecting or changing source:
   - **Full feature pass:** read this guide completely.
   - **Targeted patch:** read this execution contract, Section 1, the canonical
     rule registry, Sections 18.1-18.3, every directly applicable detailed
     section, Section 16, and Section 17.0. Expand reading when evidence
     expands the affected area.
   Never rely on memory, a previous review, or only a checklist.
   Section 18 is the determinism layer: it fixes the file set, the surface
   decomposition, and the inspection order so that two independent reviewers of
   the same feature produce the same evidence and the same findings. Apply it
   before Section 2 shape analysis.
2. Confirm the requested mode independently from review depth:
   - **Review mode:** inspect and report confirmed in-scope findings without
     editing.
   - **Implementation mode:** edit the requested scope, implement its confirmed
     findings, and review the scoped diff. Words such as `fix`, `implement`,
     `refactor`, `match`, or `complete` normally authorize editing, but they do
     not automatically turn a narrow request into a full-feature audit.
3. Confirm **targeted patch** or **full feature pass** using the Review depth
   rules below. Never infer full-feature scope from one verb alone.
4. Record the feature boundary, screen shape, supplied screenshots, workflow
   notes/video, owner verification boundary, frontend path, and directly
   related backend contract path before making findings or edits.
5. For a full feature pass or targeted visual/interaction change, inspect the
   closest applicable approved reference in Section 3. A targeted nonvisual
   compile/contract fix may mark the reference `Not applicable` with a reason.
   When used, inspect actual source; do not copy from memory.
6. Treat every supplied screenshot as visual acceptance criteria for the
   shown state. Match its structure, density, spacing, controls, table chrome,
   actions, scrolling, and modal proportions. Do not redesign it.
7. For a full feature pass, review the entire requested screen, including
   non-default tabs, conditional sections, menus, dialogs, states, responsive
   rules, dark theme, and RTL. For a targeted patch, review the requested
   element and the directly affected states/interactions only.
8. Apply contract and security rules before styling. Visual matching never
   permits a permission bypass, mismatched payload, client-owned protected
   field, unsafe total, or lost child collection.
9. In implementation mode, make controlled source patches only within the
   requested feature and directly related contracts. Preserve unrelated owner
   changes and the existing Sigma architecture.
10. Before handoff, complete the checklist required by the selected review
    depth and review the scoped source diff. Do not say `complete` while an
    applicable in-scope item remains unimplemented or unclassified.
11. State verification honestly. Source review is not build, runtime, browser,
    visual, API, or database proof.

### Review depth: targeted patch versus full feature pass

Review depth controls coverage and artifacts; it does not weaken security,
contract correctness, or verification honesty.

| Depth | Select when | Required coverage | Required artifacts |
|---|---|---|---|
| Targeted patch | The owner identifies one bounded defect or visual change, such as button padding, icon color, one dropdown alignment, one close handler, or one compile error | The named element/handler and directly affected template, style, state, theme/RTL/responsive behavior, contract, or caller as applicable | Short evidence note, controlled patch, targeted checklist in Section 17, scoped diff review, risks, owner verification status |
| Full feature pass | The owner requests `full review`, `implement all`, `whole screen`, `refactor <feature path>` without a narrower issue, or requests coordinated list/form/service/backend changes | Entire requested feature, all operations/tabs/dialogs/states, and directly related backend contracts | Approved-reference record, visual ledger, endpoint matrix, complete field ledger, applicable screen-shape checklists, complete scoped diff review, full handoff |

An explicit `targeted fix only` instruction always selects targeted depth unless
the requested patch cannot be made safely without a named contract/security
decision. A bare feature-level request such as `refactor
src/app/modules/Fleet/Vehicle` selects a full feature pass. Do not use diff line
count as the primary gate: a one-line permission or payload defect can require
high-risk contract analysis, while a larger mechanical style patch may still
be targeted.

During a targeted patch:

- do not build the complete endpoint matrix, field ledger, visual ledger, or
  90-item checklist unless the target actually changes those areas;
- inspect direct dependencies needed to prove the patch is safe;
- if a separate serious issue is discovered, report it with evidence and do
  not silently expand the requested scope;
- use the targeted completion checklist in Section 17 and a concise handoff.

During a full feature pass, every applicable detailed section and screen-shape
checklist remains mandatory.

### Decision precedence

When sources appear to conflict, use this order and record any unresolved
conflict instead of silently choosing:

1. Explicit owner instruction and confirmed business workflow.
2. Permission, security, data integrity, and backend contract requirements.
3. Supplied screenshot for the visual state it shows.
4. This guide's mandatory rules and canonical semantic colors.
5. The closest approved Sigma reference implementation.
6. Existing feature behavior that is not contradicted above.

The screenshot controls appearance, not unsafe business behavior. The approved
reference controls implementation pattern when the screenshot cannot reveal
behavior, theme, responsive, RTL, accessibility, loading, or error handling.

### Guide map

| Need | Canonical section |
|---|---|
| Scope, mode, evidence, severity, verification boundary | Sections 1 and 16 |
| Choose list/form/modal/step/report shape | Section 2 |
| Approved code references and confirmations | Section 3 |
| Screenshot matching and feature title | Section 4 |
| Colors, typography, buttons, and icons | Sections 5 and 6 |
| Frontend/backend field ledger and payload rules | Section 7 |
| Complete grid/list specification and example | Section 8 |
| Normal forms and modal forms | Section 9 |
| Step forms and fixed action footer | Section 10 |
| Dates, enums, numbers, dropdowns, and lookups | Section 11 |
| Child editors, documents, and uploads | Section 12 |
| Reports, print, export, totals, and paging | Section 13 |
| Theme, responsive, RTL, keyboard, and accessibility | Section 14 |
| Loading, errors, request cancellation, and authentication | Section 15 |
| Review report format | Section 16 |
| Final master and screen-shape checklists | Section 17 |
| Real feature anatomy, deterministic file sweep, worked example | Section 18 |

### Canonical cross-cutting rule registry

Each rule below has one canonical owner. Other sections and checklists should
reference the rule ID instead of redefining it. When wording appears to differ,
the canonical owner wins and the duplicate wording must be corrected.

| Rule ID | Canonical owner | Rule |
|---|---|---|
| `VERIFY-BOUNDARY` | Section 1, Owner verification boundary | Source review must not be represented as build/runtime/browser/API/database proof |
| `CONFIRM-SHARED` | Section 3, Reusable confirmation-dialog reference | Every confirmation-only workflow uses the shared Sigma confirmation service/component; input workflows use a typed form dialog |
| `ICON-SOLID` | Section 6, Solid icon surfaces | An icon glyph on a solid semantic surface is explicitly white; neutral/outlined surfaces keep a contrasting semantic icon color |
| `DATE-ONLY` | Section 11 | Date-only values preserve calendar components and are not shifted through UTC serialization |
| `DROPDOWN-INTERNAL` | Section 11 | Searchable/clearable dropdowns use built-in filtering and internal clear controls without companion search/delete/clear buttons |
| `PAGER-SHARED` | Section 8.8 | Use the approved shared footer or one correctly configured server-backed paginator inside the table surface |
| `SCROLL-OWNER` | Section 14.2 | The table owns necessary horizontal scroll, the dialog/step body owns necessary vertical scroll, and the page avoids competing scroll regions |
| `OVERLAY-SCOPE` | Section 9.4, Body-appended overlay styling | A PrimeNG overlay appended to `body` owns its variables and deep overrides through a unique overlay class; it must not depend on component-host inheritance |
| `AUTH-INTERCEPTOR` | Section 15, Authenticated request review gate | Protected requests use the shared interceptor's injector scope; feature services do not add manual Authorization headers |
| `REF-PRECISION` | Section 3, Reference precision rule | References resolve at feature-root precision, never to a parent module folder, and never to a non-reference legacy sibling |
| `FEATURE-ANATOMY` | Section 18.1 | The reviewed file set is derived from the canonical Sigma feature folder anatomy, not from judgement about what looks related |
| `SHAPE-COMPOSITE` | Section 18.2 | A feature root that owns several shapes is decomposed into named surfaces, and each surface is reviewed under its own screen-shape section |
| `SWEEP-ORDER` | Section 18.3 | Feature files are inspected in one fixed order so two reviewers reach the same evidence set |
| `FORM-DIALOG` | Section 18.4 | An input-collecting dialog uses the approved PrimeNG dialog pattern with appended overlay, focus trap, and Escape handling; a hand-rolled backdrop is a confirmed finding |
| `TOTAL-AUTHORITATIVE` | Section 18.5 | The paginator total comes from the backend total field only; a client-side reconstruction from page count is a confirmed finding |
| `EXPORT-ATOMIC` | Section 18.5 | A multi-page export fails loudly on any failed page and never reduces to a partial file |
| `PERM-ARCH` | Section 18.6 | Permission findings are stated against the mechanism the project actually has; an absent mechanism is a single architecture gap, not a per-control defect |

Rule IDs are maintenance anchors, not checklist shortcuts. The selected review
depth still determines where each canonical rule is applicable.

## Quick review workflow

Use this order and apply the detailed rules in the referenced sections:

1. Identify the route, operation, and screen shape (Section 2).
2. Inspect the closest approved Sigma reference (Section 3).
3. Trace the files required by the selected depth: all directly related
   component/template/SCSS/model/service/permission/translation/backend files
   for a full pass, or only the target and proven direct dependencies for a
   targeted patch (Sections 7-15).
4. For a full pass, build the endpoint and complete field contract ledger. For
   a targeted patch, build only the affected contract slice when the request
   touches a payload, response, permission, lookup, or endpoint (Section 7).
5. Review correctness and security in the priority order below before visual
   styling.
6. Review loading, empty, error, unauthorized, and duplicate-submission states
   in the applicable screen-shape section and Section 15.
7. Review light, dark, RTL, responsive, keyboard, and accessibility behavior
   (Sections 4-6 and 14).
8. Produce evidence-backed findings ordered by severity and scale the report
   to the selected depth (Sections 1 and 16).
9. In review mode, list the smallest required source changes. In
   implementation mode, implement every confirmed in-scope change using
   controlled patches inside the current Sigma architecture, then review the
   complete scoped diff (Sections 1 and 17).
10. Leave runtime, build, test, and visual verification to the owner when the
    owner verification boundary is reserved (Section 1).

### Review priority

Perform the review in this priority:

1. Permission and protected context.
2. Request/response contract correctness.
3. Data-loss and duplicate-submission risks.
4. Create/Edit/Delete and child-collection behavior.
5. Reports, paging, totals, and exports.
6. Dates, enums, decimals, and lookups.
7. Loading, errors, and state cleanup.
8. Accessibility, keyboard, RTL, responsive, and theme.
9. Visual consistency and maintainability.

A visual mismatch must not hide a more serious contract or workflow defect.

## 1. Review rule

Follow the Quick review workflow and stop at the requested feature and its
directly related contracts. Review-only is the default. Change code only when
the request explicitly asks for a fix.

### Evidence-first findings

Before writing a finding, confirm it from the actual route, component,
template, SCSS, model, service, permission, translation, backend contract, or
supplied screenshot. Do not report an issue based only on:

- naming assumptions;
- a field that only appears unused;
- a legacy reference implementation;
- a screenshot state that was not supplied;
- framework convention without checking the current project behavior.

When evidence is incomplete, report the item under `Contract decision needed`
or `Owner verification required` instead of presenting it as a confirmed
defect. Do not classify preferences as defects.

### Severity definitions

- **Critical:** permission bypass, tenant or protected-context manipulation,
  sensitive-data exposure, destructive data loss, or a frontend action that
  can corrupt persisted business data.
- **High:** broken Create/Edit/Delete workflow, wrong API contract, lost child
  data, incorrect full-report/export result, duplicate financial or business
  submission, or a primary workflow that cannot complete safely.
- **Medium:** incorrect paging, filtering, sorting, date handling,
  loading/error state, accessibility behavior, or a significant
  responsive/theme defect.
- **Low:** visual inconsistency, maintainability, naming, duplicated styles, or
  minor UX friction that does not produce incorrect business data.

### Owner verification boundary (`VERIFY-BOUNDARY`)

This boundary is mandatory. When the owner says they will verify, or asks not
to test/build:

- do not run `ng build`, `ng test`, `ngc`, or TypeScript compilation;
- do not substitute lint verification, browser QA, or an application-server
  start/restart for the owner-reserved verification;
- limit the pass to source inspection, the requested edits, and a source diff
  review;
- state clearly in the handoff which of the following were not performed:
  Angular build, TypeScript compilation, unit tests, browser QA, runtime visual
  comparison, and backend execution.

Do not reinterpret a refactor request as permission to override an explicit
owner-reserved verification boundary. Never claim that source inspection proves
runtime behavior.

### Current architecture boundary

Prefer the smallest safe correction using existing Sigma patterns and approved
references. Do not introduce:

- NgRx or another state-management framework;
- a new validation framework;
- a new component library or design system;
- a generic form or table abstraction;
- a new shared component for a single screen;
- broad refactoring unrelated to a confirmed finding.

### Review stop conditions

Stop expanding scope when:

- the requested feature and its directly related contracts have been reviewed;
- an issue belongs to a shared global component already tracked separately;
- a possible improvement has no demonstrated correctness, accessibility,
  security, or performance impact;
- a fix would require a new architecture or broad redesign;
- evidence cannot be confirmed from the supplied sources.

Shared issues may be referenced, but do not duplicate them as feature findings
unless the target feature bypasses or worsens them.

## 2. Choose the screen shape

| Shape | Use it when | Required parts |
|---|---|---|
| Grid/list | Users search, filter, page, and act on records | Page heading, primary action, search/filters, table, row actions, empty/loading/error states, paginator |
| Normal routed form | One logical group fits comfortably on a page and the workflow benefits from navigation/deep linking | Page header, typed reactive form, inline validation, Cancel and Save |
| Simple modal form | A short single-section task should finish without leaving the parent screen | Accessible dialog title, focused body, Cancel and Save; restore focus on close |
| Grouped/tabbed modal | A parent/child record has a few peer sections such as Detail, Payment Plan, and Documents that do not require ordered progression | Dialog header, one draft form, accessible tabs/sections, one scroll body, validation, fixed footer |
| Routed/page step form | The record has several ordered logical groups, child collections, files, dependencies, or a long aggregate workflow | Header, one parent form, stepper, validation summary, one scroll area, Back/Next/Save |
| Step modal (exception) | The supplied screenshot or approved existing workflow explicitly requires ordered steps inside a dialog and it remains usable within the content viewport | Non-full-screen responsive dialog, stepper, one scroll body, fixed footer, focus trap, complete step validation |
| Report | Users choose filters and inspect, print, or export results | Filter toolbar, Run/Search action, result area, totals, empty/loading/error states, print/export |

Preserve the feature's current shape unless the supplied design or workflow
clearly requires another. Do not turn a short form into a stepper. Do not force
a long nested editor into a small modal.

### Mandatory Create/View/Edit shape analysis

Before a full Create/View/Edit refactor, new editor, or any change to the
container/route/tabs/stepper/save ownership, inspect the existing screen and
write a shape decision. A targeted style/handler patch inside an unchanged
shape records only the existing shape and does not need the full candidate
analysis. Do not choose a modal, tabs, or steps from field count alone.

Review these decision factors:

- supplied screenshot and workflow sequence;
- whether parent-screen context must remain visible;
- need for a route/deep link, refresh recovery, or browser Back behavior;
- number of real business groups, not merely number of fields;
- whether groups are peers that can be visited in any order or ordered stages
  with prerequisites;
- child collections, payment plans, documents/uploads, calculations, and
  conditional sections;
- one-save aggregate versus independent section saves;
- validation scope and need to navigate users to invalid groups;
- expected viewport fit, dialog width/height, fixed footer, and scroll
  ownership at desktop/tablet/mobile sizes;
- accessibility, focus trap/return, body-appended overlays, app-header/sidebar
  boundaries, dark theme, and RTL;
- current approved Sigma reference and existing feature architecture.

Use these decisions:

| Choose | Confirmed signals | Do not choose when |
|---|---|---|
| Normal routed form | The form is one coherent page, needs a route/deep link, or does not need parent context behind it | The task is a very short parent-owned edit that should close back to the same row |
| Simple modal | One short section fits comfortably in the supported viewport with no complex child grid or documents workflow | The content needs tabs, ordered steps, multiple scroll regions, or large aggregate editing |
| Grouped/tabbed modal | A few peer sections share one Save and users may visit them in any order; examples: Detail, Payment Plan, Documents | Later sections depend on earlier completion or the content cannot fit with one body scroll and fixed footer |
| Routed/page step form | Ordered stages, several groups, children/files, cross-step validation, or long aggregate editing justify guided navigation | The record is short or groups are independent peers better represented by tabs |
| Step modal | Only when the screenshot/current approved workflow explicitly requires it and every step remains usable in a bounded responsive dialog | It would become full-screen by accident, cover the app header/sidebar, create nested scrollbars, or hide the footer |

Tabs organize peer content; steps communicate sequence and progress. Do not use
tabs to hide an ordered workflow, and do not use steps for independent sections
that users should visit freely. Documents may be a tab in a grouped modal or a
step in a long aggregate form depending on that workflow analysis.

Default to a routed/page step form instead of a step modal when the aggregate
is long, needs reliable deep linking/recovery, or cannot fit inside one dialog
body with a fixed footer. Do not redesign the existing screen shape when the
screenshot and confirmed workflow already choose a safe shape.

Every review/implementation report must include:

```markdown
## Create/View/Edit shape decision

- Existing shape: Normal form / Simple modal / Grouped modal / Step form /
  Step modal
- Candidate shapes considered: ...
- Chosen shape: ...
- Evidence: screenshot, workflow, groups, dependencies, children/documents,
  route need, viewport and scrolling
- Rejected shapes and reasons: ...
- Save ownership: one aggregate Save / section Save (contract evidence)
- Owner verification required: viewport, focus, overlays, runtime workflow
```

### Screen-shape review gates

These gates are completion checks; use the full detailed sections for the
underlying rules.

- **Grid/list gate (Section 8):** confirm backend or local paging behavior,
  filter and sort scope, total-count source, last-page deletion behavior,
  action permissions, and full-result export behavior.
- **Normal/modal form gate (Section 9):** confirm Create/View/Edit
  initialization, payload construction, disabled-control behavior, duplicate
  Save protection, API failure recovery, and Cancel/close behavior.
- **Step-form gate (Section 10):** confirm one parent form contract, step
  validation scope, navigation to invalid controls, child-collection
  persistence, reachable footer actions, and view-mode mutation protection.
- **Report gate (Section 13):** confirm typed filters, database filtering before
  paging and aggregation, total calculations, full-result export, print
  behavior, and consistent rules across screen, print, nested dialog, and
  export.

## 3. Approved implementation references

Select the closest reference before reviewing or changing a screen:

| Shape | Reference root | Main implementation |
|---|---|---|
| Grid/list and table footer | `src/app/modules/Sales/Fleet` | `components/list` using the shared `table-list`, `app-action-button`, filter grid, report/export/search toolbar, and shared paginator/footer behavior |
| CRUD with step form | `src/app/modules/Customers/Companies/CompanyPartner` | `components/details` with its route, list, models, service, and child sections |
| Grouped child modal | `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers` | `drivers.component.ts`, `.html`, and `.scss` |
| Report | `src/app/modules/Customers/BalancesSummary` | `components/list` with its route, models, and service |

These are structural and visual references, not unquestionable contract
copies. Apply the field parity, date, export, tenant, accessibility, and error
rules in this guide even when a reference currently contains legacy behavior.

### Reference precision rule

Every reference above is addressed at **feature-root** precision, meaning the
folder that owns a routes file. Never resolve a reference to a parent module
folder, because a Sigma module can contain several sibling feature roots built
at different times to contradictory standards.

`Customers/Companies` is the case that proves the rule. It contains four
sibling feature roots. Only `CompanyPartner` is approved. The other three are
abandoned scaffolding, and `Company` sorts first alphabetically, so a reviewer
who resolves the reference to the module folder is likely to open the worst
file in it first.

When a reference is cited as `<Module>/<FeatureRoot>`, inspect only that
feature root. Do not inspect, average, or copy from its siblings.

### Non-reference legacy siblings

The following feature roots are **explicitly not references**. Do not copy any
pattern from them, do not cite them as evidence, and do not treat their
behaviour as approved. They remain routed in `src/app/pages/routing.ts` and
their services remain in the `LayoutModule` providers array, so they are
reachable code and not compiler-dead, but no navigation links to them.

| Not a reference | Verified disqualifying markers |
|---|---|
| `Customers/Companies/Company` | Legacy scaffolding, see marker list below |
| `Customers/Companies/CompanyContactPerson` | Legacy scaffolding, see marker list below |
| `Customers/Companies/CompanyDriver` | Legacy scaffolding, see marker list below |

All three share these confirmed markers. Any one of them disqualifies a file
from being used as a reference:

- imports resolved through the package folder,
  `from 'node_modules/ms-lib'`, instead of the package name `'ms-lib'`;
- `data: any[]` with `columns` and `moreActions` as plain mutable fields rather
  than typed signals;
- seven row actions whose bodies are empty or contain only
  `console.log("Delete2")`, including a live-looking `Delete` action that
  deletes nothing;
- grid columns copy-pasted from an unrelated menu/products screen, such as
  `displayName: "modifiers.reference"`, `colName: "categoryName"`, and
  `path: "/menu/products/details"`;
- `goCreate` navigating to an `inventory/...` route that does not belong to the
  Customers area;
- `DialogModule` and `ButtonModule` imported with no dialog in a template of
  under 210 bytes, and an unused `visible` flag;
- `console.log` of response entities, and a commented-out `fixUrl` block;
- 0-byte component SCSS files;
- no `app-feature-title`, no filter form, no paging, no total count, and no
  shared confirmation dialog;
- routes limited to `''`, `details/:id`, and `create`, with no `data.mode`, so
  there is no View/Edit mode contract;
- in `Company` and `CompanyContactPerson`, the same service injected twice in
  one constructor, the second time under the misleading name
  `discountService`.

Contrast with the approved sibling `CompanyPartner`, which uses signals,
`app-feature-title`, a typed filter form, `p-dropdown` with
`[showClear]="true"`, `[filter]="true"` and `appendTo="body"`, remote paging
through `tableList.dt`, the shared confirmation dialog, and four route modes
carrying `data.mode`.

If a reviewed feature currently resembles the legacy markers above, that is a
finding about the reviewed feature. It is never a justification, and "the
sibling module does it this way" is not valid evidence under Decision
precedence.

### Approved-reference availability and divergence gate

Before using a reference, confirm that its documented path exists and inspect
its current source. If it has been renamed, deleted, partially migrated, or is
not available in the supplied workspace:

1. Search only the documented module parent and project map for an intentional
   replacement; do not start a full-solution scan.
2. Record `Approved reference unavailable` with the attempted path and
   evidence.
3. Ask for or report an owner/reference decision when no approved replacement
   is documented. Do not reconstruct the pattern from memory.
4. Continue only with rules that can be confirmed from this guide, supplied
   screenshots, the current feature architecture, and available shared
   components. Mark remaining visual/behavior decisions explicitly.

If two approved references disagree on a shared pattern:

- apply Decision precedence from the Mandatory AI execution contract;
- prefer the reference matching the target screen shape and current shared
  component architecture;
- apply canonical cross-cutting rule IDs over legacy local differences;
- record the divergence and chosen evidence in `Approved reference used`;
- do not modify either reference unless it is explicitly in scope.

A stale reference is a guide-maintenance finding, not permission to invent a
new abstraction or visual style.

### Grid/list reference

Use the Sales/Fleet list for:

- one feature card containing the feature title, filter grid, toolbar, table,
  row actions, and table-owned footer;
- labelled text inputs and searchable/clearable PrimeNG dropdown filters;
- report/export/search actions aligned as one toolbar;
- the shared `table-list` and `app-action-button` integration when the target
  feature uses that architecture;
- paginator placement, rows-per-page control, current range text, icon
  direction, and light/dark/RTL styling;
- keeping the table footer inside the same bordered table surface instead of
  building a disconnected custom pager.

Copy the reference pattern only after confirming the target list's backend
paging, total-count, filters, columns, actions, and permissions. Do not copy
Fleet-specific fields or pretend a server-paged list is locally paged.

### CRUD step-form reference

Use the `CompanyPartner` editor,
`Customers/Companies/CompanyPartner/components/details`, for:

- separate list and Create/View/Edit routes;
- one parent reactive form split into meaningful steps;
- header, back/edit action, and progress track using the step state rules in
  Section 6;
- the blocking-validation summary and invalid-field navigation from Section 6;
- step navigation to the first invalid control;
- dedicated section components for details, contacts, billing, documents, and
  drivers;
- one content scroll region and persistent Previous/Next/Cancel/Save footer;
- view mode that allows step navigation but prevents mutation;
- responsive step labels and horizontal step navigation on narrow screens.

Use the `CompanyPartner` visual pattern for steps and validation, with Section 6
as the canonical color and icon rule. Build write payloads from the reviewed API
contract; do not copy client-supplied tenant, number, audit, or other
server-owned fields from a legacy payload.

### Grouped-modal reference

The approved reference is the drivers child section **inside** the
`CompanyPartner` editor:
`Customers/Companies/CompanyPartner/components/detalisForm/drivers`.

This is **not** the `Customers/Companies/CompanyDriver` feature root, which is a
non-reference legacy sibling. Confirm the `detalisForm` path segment before
inspecting, and stop if the path you opened lacks it.

Use that drivers child section for:

- an editable parent `FormArray` displayed as a compact child table;
- Add/Edit opening one draft `FormGroup` in a PrimeNG modal;
- preserving the parent row until modal Save succeeds;
- a clear dialog header with icon, title, and description;
- logical field groups such as Identity, Contact, Address, and Additional;
- a small tab split such as Detail and Documents;
- responsive three/two/one-column field grids;
- inline error icon/text, labelled inputs, clear buttons, and body-appended
  dropdown/date overlays;
- Cancel/Save footer and reset-on-close behavior.

Before copying the pattern, confirm:

- the draft has only client-editable fields;
- Add/Edit/Remove semantics match the backend child contract;
- document IDs and existing values are preserved safely;
- date-only values follow Section 11;
- focus enters the dialog, remains trapped, and returns to the opener;
- the dialog remains usable at the smallest supported viewport;
- canonical colors and icon rules in Sections 5 and 6 override any older
  literal color.

### Reusable confirmation-dialog reference (`CONFIRM-SHARED`)

Use the shared `ConfirmationDialogService` and
`ConfirmationDialogComponent` for every confirmation-only interaction. The
Supplier list `confirmDelete` implementation is the approved configuration
reference. This rule applies to delete, approve, reject without a required
reason, unapprove, finalize/post, status transition, and every other action
that asks the user to confirm before continuing.

Do not create a feature-specific `p-dialog`, call PrimeNG
`ConfirmationService` directly, or use the browser `confirm()` API for these
scenarios. Configure the shared dialog with translated title, message, labels,
appropriate severity and icons, and enough record context to identify the
target. Add a subtitle and warning for destructive or irreversible actions.
A workflow that must collect a reason or other input is a form dialog, not a
confirmation-only dialog.

### Report reference

Use BalancesSummary for:

- typed reactive filters and lookup loading;
- explicit Search/Refresh behavior;
- date-range validation and the date-only rules in Section 11;
- separate report, lookup, and nested-statement loading/error state;
- server page number, page size, count, and total pages;
- stable columns, selected-row action, total footer, and paginator;
- nested statement dialog with its own filters, errors, rows, and totals;
- light/dark variables, responsive layout, fixed report chrome, and print CSS;
- translated labels and safe empty/loading/error states.

For a server-paged report, apply the sorting, full-result export, and
cross-surface consistency rules in Section 13.

## 4. Visual reference matching

Treat the supplied screenshot as the visual acceptance reference. Match:

- page/card width, height, padding, and visible scroll areas;
- title, subtitle, primary action, and icon placement;
- search/filter height and alignment;
- table header, row height, column order, action menu, and paginator;
- dialog width, header, steps/tabs, content spacing, and footer;
- font family already loaded by Sigma, font size, weight, and line height;
- border radius, border color, surface color, shadow, and hover/focus states;
- light and dark equivalents rather than copying a light-only color;
- LTR and RTL logical alignment using `inline-start` and `inline-end`.

Shared feature title rule:

- Use the reusable `app-feature-title` for feature headings so the icon, title,
  subtitle, actions, and light/dark colors stay consistent.
- Keep the title inside the feature's primary card or panel; do not duplicate
  it in the shared Metronic toolbar.
- Keep title spacing uniform: the shared title uses
  `margin: 8px 8px 16px` (8px top, left, and right; 16px below).
  Panels that already provide inner padding must use compensating responsive
  offsets so the visible title inset remains exactly 8px on every screen.

When a screenshot does not show a state, use the closest approved Sigma
implementation. The `CompanyPartner` and `IndividualPartner` editor pattern,
`Customers/Companies/CompanyPartner` and
`Customers/Individual/IndividualPartner`, is the reference for step icons and
validation presentation. Do not invent a third visual style.

Every review must include this record:

```markdown
## Visual verification status

- Screenshot supplied: Yes/No
- Source compared with approved reference: Yes/No
- Light theme reviewed from source: Yes/No
- Dark theme reviewed from source: Yes/No
- RTL reviewed from source: Yes/No
- Responsive source rules reviewed: Yes/No
- Runtime visual verification: Owner pending/Completed
```

Do not declare an exact visual match from source inspection alone. State which
visual states still require owner verification.

### Visual measurement ledger

For a screenshot-driven full feature pass, create this complete ledger before
styling. For a targeted patch, record only the affected ledger rows and direct
states. Use the screenshot's visible values and the closest approved
reference's source values for states the screenshot cannot show. Do not write
only `looks similar`.

| Area | Measure/record | Acceptance source | Implemented source |
|---|---|---|---|
| Application content | Offset below app header, sidebar/content boundary, usable width | Screenshot/app shell | Component/page SCSS |
| Page/card | Width, min/max height, padding, border, radius, shadow, surface | Screenshot | Page/panel class |
| Feature title | Icon tile, title/subtitle size, action position, outer spacing | Screenshot/`app-feature-title` | Template/title inputs |
| Filter grid | Column count/spans, row/column gaps, field order, responsive collapse | Screenshot/reference | Form grid SCSS |
| Controls | Height, border, radius, padding, label gap, clear/trigger/icon position | Screenshot/reference | Input/PrimeNG overrides |
| Toolbar/buttons | Order, height, padding, gaps, icon size/color, solid/outlined state | Screenshot/reference | Semantic button classes |
| Table viewport | Width/height, scroll owner, header visibility, body empty space | Screenshot/reference | Table wrapper SCSS |
| Table header/rows | Header/row height, cell padding, borders, zebra/hover, type | Screenshot/reference | Table/shared list styles |
| Row actions | Column position/width, button size/color, menu width/offset/z-index | Screenshot/reference | Action component/styles |
| Footer/paginator | Border ownership, height/padding, controls/order, rows selector, range alignment | Sales/Fleet reference | Shared table/paginator |
| Dialog | Top offset, width/max width, height/max height, header/body/footer, scroll owner | Screenshot/reference | Dialog styleClass/SCSS |
| Tabs/steps/documents | Height, selected text/indicator, section padding, empty state | Screenshot/reference | Tab/section styles |

Record responsive, dark, RTL, hover, focus, disabled, loading, empty, error,
and overlay behavior separately when those states are not visible in the
primary screenshot. Any value that cannot be confirmed is `Owner verification
required`, not an invented measurement.

## 5. Canonical colors and type

Use the existing feature variables or shared tokens when they already map to
these values. Do not scatter duplicate literals through multiple components.

The preferred columns are the default. An `Accepted existing alternative` may
be retained only when it already exists in the selected approved reference;
do not choose alternatives arbitrarily or mix them within one feature.

| Use | Light preferred | Light accepted existing alternative | Dark preferred | Dark accepted existing alternative |
|---|---|---|---|---|
| Page canvas | `#f1f3f7` | `#f4f6f8` | `#111820` | `#16222d` |
| Card surface | `#ffffff` | — | `#19232d` | `#1d2a37` |
| Toolbar/sub-panel | `#fbfcfd` | `#f4f6f8` | `#151e27` | `#182631` |
| Primary border | `#e8edf2` | `#dce4eb` | `#2f4050` | `#344557` |
| Primary title | `#3f5871` | `#172332` | `#e4edf5` | — |
| Secondary title | `#0f7375` | — | `#59d5dd` | `#78c9ed` |
| Muted text | `#5f7185` | — | `#9dafbf` | `#8194a5` |
| Body/label text | `#48627d` | `#34495e` | `#cbd7e3` | `#e5edf4` |
| Save/primary action | `#1478b5` | — | `#1773ae` | — |
| Secondary action | `#0f7375` | — | `#126f75` | — |
| Active tab indicator | `#0f7375` | — | `#31c4cf` | — |
| Input background | `#ffffff` | — | `#182631` | — |
| Input border | `#b9c7d2` | — | `#405364` | — |
| Table header | `#f8fafc` | — | `#223443` | `#243441` |
| Row hover | `#f1f5f9` | — | `#243746` | — |

Semantic states:

| State | Light text | Light surface | Light border | Dark text | Dark surface | Dark border |
|---|---|---|---|---|---|---|
| Success | `#157347` | `#eaf8f1` | `#9ed8bd` | `#48d39b` | `#1b3a31` | `#397d65` |
| Information | `#1769aa` | `#eef8ff` | `#9ed3f0` | `#5ab0ff` | `#1c3446` | `#3c718f` |
| Warning | `#67430f` | `#fff8e8` | `#efc171` | `#f2b84b` | `#382d1b` | `#8b6728` |
| Error | `#b4232d` | `#fff5f5` | `#f1b8bd` | `#ff9aa2` | `#39262c` | `#70464e` |
| Disabled | `#738493` | `#eef3f6` | `#d0dbe3` | `#9baebb` | `#23333f` | `#405364` |

Type rules:

- inherit the application's current font; do not add another font for a feature;
- page title and section hierarchy must match the closest approved screen;
- body text remains regular; labels and column headers use the established
  medium weight;
- button text, validation counts, and validation field badges use a clear
  semibold/bold weight (`600` or `700`);
- do not use tiny or low-contrast text to imitate a screenshot.

### Button normalization gate

- Inventory every button in the page, every tab, conditional section, table
  row, nested dialog, and footer. Reviewing only the visible or default tab is
  incomplete.
- Do not leave raw legacy classes such as `btn-primary`, `btn-danger`,
  `btn-info`, or `btn-secondary` unless the selected approved reference uses
  that exact class and appearance intentionally.
- Use the selected approved reference's semantic action patterns consistently:
  Add/Save/Search use the approved primary action; Cancel/Close use the
  approved secondary action; Delete/Remove use the approved destructive
  action; Upload/Information use the approved accent or information action.
- Remove obsolete classes instead of masking their colors with `!important`.
  A feature-specific semantic class may coexist with a framework base class
  only when the base class supplies structure without overriding the approved
  palette.
- Verify default, hover, `:focus-visible`, active, and disabled states in light
  and dark themes. Apply the RTL and responsive rules to button groups and
  icon placement.
- Apply `ICON-SOLID` from Section 6 to every button/icon state.
- Before completion, search the complete reviewed feature for legacy button
  classes and list every intentional exception in the review report. An
  unexplained legacy class is a confirmed visual-consistency finding.

## 6. Validation and icon colors

Blocking validation is an error, not a warning:

- error text: `#b4232d` light and `#ff9aa2` dark;
- summary: light surface `#fff5f5`, light border `#f1b8bd`, dark surface
  `#39262c`, and dark border `#70464e`;
- count/field badges: light surface `#ffe3e5`, light border `#e29aa1`, light
  text `#9f303a`, dark surface `#56343b`, dark border `#70464e`, and dark text
  `#ffc4ca`;
- validation badges and their text are bold;
- validation icon circle: `#df5662` light and `#ef9da5` dark, with a white icon;
- amber `#e9a23b` is only a short focus/navigation highlight after the user
  selects an invalid field. It must not be the error badge or error text color.

Stepper icons:

- inactive icon uses the muted icon color on the inactive surface;
- active step icon is white on the blue active circle;
- completed check icon is white on the teal/green completed circle;
- an error step icon, when used, is white on the red error circle;
- icon meaning must also have text, `aria-current`, status, or another
  non-color cue.

### Solid icon surfaces (`ICON-SOLID`)

- every icon glyph placed on a solid primary, accent, success, information,
  warning, or error background is white in both light and dark themes;
- target the actual glyph element (`i`, `.p-button-icon`, SVG, or equivalent),
  because icon-library rules may override a white color inherited from its
  parent;
- primary action, Save/Search/Refresh, title icon tiles, status/summary icon
  circles, validation icons, and active/completed/error indicators all follow
  this rule;
- icons on transparent, white, or other neutral surfaces must use the
  appropriate contrasting text/semantic token instead of being forced white.

Every field error names the field and failed rule. Required markers, invalid
borders, summaries, and icons must not rely on color alone.

## 7. Frontend/backend field contract

### Backend source and tracing boundary

For a full feature pass with backend source available, trace each used
operation through only its directly related path:

1. Angular typed model/form/payload and feature service call.
2. Route, HTTP verb, URL, wrapper, and authorization requirement.
3. Backend controller/minimal endpoint action and permission/policy.
4. Request DTO plus validator/boundary validation.
5. Application/business service and domain invariant/state transition.
6. Direct mapper/profile or explicit projection.
7. Direct entity, EF configuration/query/repository, calculated fields, child
   reconciliation, and transaction when the operation reads/writes them.
8. Response DTO/wrapper returned to the Angular model.

Use the companion [Sigma Backend Review Guide](./SIGMA_BACKEND_REVIEW_GUIDE.md)
as the canonical backend rule source. Resolve this link relative to the
frontend guide's location; do not use a machine-specific absolute path.
Confirm the relative target exists before starting backend review. If the
guides move, update the relative link in the same change. Stop at directly
related Vehicle/Customer/etc. files; do not scan unrelated controllers,
repositories, entities, or migrations. Interceptor registration is a frontend
injector concern under `AUTH-INTERCEPTOR`; endpoint authorization and
tenant/ownership validation are backend concerns.

If the companion guide is missing or inaccessible, apply the Section 3
approved-reference availability gate: do not reconstruct it from memory, do
not block frontend-only work, and classify backend-dependent conclusions as
`BACKEND_UNVERIFIED`. The tracing boundary and missing-source rules in this
section remain the minimum frontend-side safety contract until the owner
supplies the backend guide/source.

For a targeted visual/interaction patch, trace backend code only when the
target changes or depends on an endpoint, payload, permission, lookup, state
transition, total, or persistence rule.

When backend source is unavailable, incomplete, generated externally, or not
placed in scope:

- inspect only the frontend service/model and supplied API documentation or
  captured contract evidence;
- classify backend-dependent conclusions as `BACKEND_UNVERIFIED` or `Contract
  decision needed`;
- do not claim tenant validation, persistence, authorization, transaction,
  calculation ownership, or DTO parity was confirmed;
- list the exact controller/DTO/service/entity evidence needed from the owner;
- continue with frontend-only findings that can be proven safely.

### Field ledger depth

For a full feature pass, build one complete field ledger for Add, Update,
Detail, List, filters, children, and custom actions. Do not sample fields. For a
targeted patch, build only the affected field/endpoint slice unless evidence
shows the requested fix changes the broader contract.

For every field record:

- template/form/grid name;
- TypeScript request and response property/type;
- backend request and response property/type;
- required/optional/null/default behavior;
- min/max length, regex, range, precision, enum, and date rules;
- sent, persisted, returned, displayed, or UI-only direction.

Use these results:

| Result | Meaning |
|---|---|
| `MATCHED` | Both layers agree and use the field |
| `FRONTEND_ONLY` | UI sends or expects a field absent from the API |
| `BACKEND_ONLY` | API requires or returns a field absent from the UI model |
| `TYPE_MISMATCH` | Types cannot safely serialize or preserve the value |
| `NULLABILITY_MISMATCH` | Required, optional, empty, omitted, or default behavior differs |
| `NAME_OR_CASING_MISMATCH` | JSON names or paths differ |
| `ENUM_OR_DATE_MISMATCH` | Enum/date representation differs |
| `DIRECTION_MISMATCH` | Field exists in the wrong Add/Update/List/Detail direction |
| `UNUSED` | Contract field exists but is ignored |
| `INTENTIONAL_UI_ONLY` | Presentation state that must not be sent |
| `SERVER_OWNED` | Tenant, number, audit, totals, and protected status values |
| `BACKEND_UNVERIFIED` | Frontend expectation exists, but backend source or authoritative contract evidence was unavailable |

Check disabled controls because Angular excludes them from `form.value`. Build
the payload deliberately; do not send the entire form or detail response.
Never trust local storage values for tenant, number, audit, or calculated data.

Every full feature review report must include a complete-accounting summary.
A targeted patch includes only the affected contract rows when applicable. For
example:

```markdown
## Field parity summary

- MATCHED: 28
- SERVER_OWNED: 4
- INTENTIONAL_UI_ONLY: 3
- NULLABILITY_MISMATCH: 2
- TYPE_MISMATCH: 1
```

For a full feature pass, the detailed matrix must include every mismatch,
server-owned field, unused field, backend-unverified field, and contract
decision. Fully matched fields may be grouped when they share behavior, but
the group count and field names must account for all of them. A targeted patch
must account for every field it changes or depends on. Never silently sample
within the declared depth.

## 8. Grid/list specification

This section is the canonical grid/list specification. An AI must review every
subsection, even when the screenshot shows only the initial list state. Mark a
subsection `Not applicable` with a reason; do not silently skip it.

### 8.1 Required visual and DOM order

Use this order unless the supplied screenshot explicitly shows another order:

1. Primary feature card/panel.
2. `app-feature-title` with icon, title, subtitle, and primary Create/Add
   action.
3. Filter form.
4. Report, export, refresh, reset, and Search actions in the screenshot order.
5. Error or validation summary when applicable.
6. One bordered table region containing header, rows/states, horizontal and
   vertical scroll areas, and footer/paginator.
7. Related dialogs or editors, hidden until opened.

Do not split the filters, table, and paginator into visually unrelated cards
when the screenshot shows one surface. Do not add a second page title in the
shared app toolbar.

### 8.2 Page, panel, and title styling

- Match the screenshot's page canvas, panel width, padding, border, shadow,
  title inset, and vertical density.
- Keep the feature within the application content width. The feature must not
  render under the sidebar or above/over the app header.
- Use `app-feature-title` and its established 8px/8px/16px visible spacing
  rule from Section 4.
- Place the primary Create/Add action in the title action slot and preserve
  its permission check, translated label, and white glyph on the solid action
  background.
- Do not create arbitrary blank height to imitate an empty screenshot. Empty
  space must come from the approved table viewport or screen layout.

### 8.3 Filter form and controls

Structure filters as a labelled responsive grid using the closest approved
reference. Review all of the following:

- Each visible label has a real `for`/`inputId` association or equivalent
  accessible name.
- Text inputs, number inputs, date controls, and dropdowns in the same filter
  row have the same rendered height and aligned baselines.
- Labels use consistent font size, line height, and label-to-control spacing.
- Column widths, spans, row gaps, and field order match the screenshot. Related
  fields stay together, and large accidental blank gaps are removed.
- When a field must appear below another field, put it immediately after that
  field in the template and use explicit grid placement only when required;
  preserve the intended order at tablet/mobile breakpoints.
- Each filter field owns its validation/help message below the control. An
  error message must not push an adjacent control or the Search button out of
  alignment; reserve or structure the message area consistently.
- The Search button aligns with the control row, not the label row or an error
  message row.
- Apply `DROPDOWN-INTERNAL` from Section 11 to every lookup dropdown.
- A clearable dropdown's clear icon remains inside the control, does not cover
  the selected text, and remains correctly positioned in LTR and RTL.
- Body-appended dropdown/calendar overlays use `appendTo="body"` when required
  by the approved reference and remain above the feature dialog but below
  higher application overlays.
- Date-range controls display and serialize the expected range without UTC
  day shifting. Invalid or incomplete ranges block Search with a translated
  field-level message.
- Required filters show the required marker and cannot submit an invalid
  request. Optional empty filters serialize as the API expects: omitted,
  `null`, empty string, or explicit boolean.
- Search is explicit unless the approved workflow requires live search.
  Changing filters resets the page to 1 when Search runs.
- Reset/Clear is included only when the screenshot or approved workflow has
  it. Reset restores documented defaults and page 1.
- Enter submits the filter form once; it must not cause duplicate requests.

### 8.4 Filter action toolbar

- Match the screenshot's action order, spacing, height, borders, and
  alignment. Do not move actions to a different row merely for convenience.
- Report/Export are secondary actions unless the screenshot/reference makes
  them primary. Search/Refresh use the approved primary action.
- Button icons apply `ICON-SOLID` from Section 6.
- Disable the action that is currently running and show the established
  spinner/icon state. Prevent duplicate Search, report, or export requests.
- At narrow widths, wrap or horizontally scroll only the toolbar when needed;
  keep actions reachable and preserve their logical order in RTL.

### 8.5 Table surface, header, columns, and rows

- Keep the table header, body, scrollbar, and paginator/footer inside one
  bordered table surface.
- Match the screenshot/reference header background, text weight, border,
  height, padding, sort indicator, row height, zebra/hover behavior, and grid
  lines in light and dark themes.
- Use the exact required column order. Each displayed property must exist in
  the list VM; remove unused list fields unless they are the minimum identity
  or action-state fields required by the row.
- Column labels, values, dates, currency, decimals, enums, and status badges
  are translated/formatted consistently. Do not render raw enum codes unless
  the screenshot explicitly represents them.
- Use a deterministic row key/identity. Do not use a row index as the business
  identity for view, edit, delete, selection, or menu actions.
- Long text may use ellipsis only when the full value is available by title,
  tooltip, accessible description, or details action.
- Numeric and currency alignment follows the screenshot and remains logical
  in RTL. Status meaning must not depend on color alone.
- The table owns horizontal scrolling when real columns cannot fit. The page,
  sidebar, and app header must not scroll sideways because of the table.
- Use a table-body vertical scroll only when the screenshot/reference shows a
  fixed grid viewport. Keep the header and footer visible according to that
  pattern and avoid a second page-level vertical scrollbar.
- Do not force a fixed height that clips the row action menu, empty message,
  focus outline, or footer. If the action menu overlays the grid, give it the
  approved z-index and overflow behavior.

### 8.6 Row action button and action menu

- Put the action column where the screenshot/reference places it. Preserve
  logical start/end behavior in RTL.
- Use the shared `app-action-button`/row action pattern when the feature uses
  the shared table architecture. Do not invent a visually similar local menu.
- Match the approved action button size, solid background, white gear/menu
  glyph, white label/caret when present, hover, focus, active, and disabled
  states.
- The menu must identify the current row by its stable ID, open adjacent to
  that row, remain above the table, and never be clipped by the table viewport.
- Close the menu on action, outside click, Escape, route/dialog close, and data
  refresh. Restore focus to the row action button when appropriate.
- Re-evaluate permission and row state when the menu opens/clicks. Hide or
  disable actions that are not valid for the current row; do not rely only on
  an earlier list response.
- Every mutating action applies `CONFIRM-SHARED` from Section 3.
- View/Edit/Delete/Approve/Reject/Unapprove/Print/custom actions use translated
  labels and the correct semantic icon/color.

#### Mandatory row-action lifecycle

For a full feature pass, review every action through this complete cycle. For a
targeted patch to one action, apply the cycle only to that action and its direct
permission/endpoint/state dependencies. Do not verify only that a menu item is
visible or that a click handler exists.

| Stage | Required checks |
|---|---|
| 1. Define | Stable action key, translated label, semantic icon/style, required permission, valid row-state predicate, mutation/read-only classification, and intended confirmation or input dialog are explicit |
| 2. Open | The clicked row is captured by stable business ID; menu position, z-index, focus, keyboard state, and RTL alignment are correct; permissions and row state are re-evaluated |
| 3. Select | The selected action uses the current row rather than a stale/index row; the menu closes appropriately; invalid/disabled actions cannot continue |
| 4. Confirm or collect input | Read-only View/Print actions proceed directly; confirmation-only mutations use the shared Sigma confirmation dialog; reason/date/note/input actions use a typed form dialog; Cancel/X/Escape performs no mutation |
| 5. Execute once | Call the exact typed endpoint with the stable row ID and required payload/context; enable a per-row/action busy guard; prevent double click, repeated confirmation, and duplicate request |
| 6. Success | Show the established translated success feedback, close action/dialog state, clear busy state, and refresh using the current normalized filters/sort/page |
| 7. Reconcile page | Keep the current page when still valid; after delete/status/filter-changing mutations, move to the last valid page when the current page becomes empty; update total count and row action state |
| 8. Failure | Clear busy state, retain the current list/form/input, show translated validation/business/network feedback, avoid false success, and allow safe retry |
| 9. Cleanup | Clear selected row/action, close menu/overlay, release subscriptions/effects, ignore stale responses, and restore focus on outside click, Escape, dialog close, navigation, refresh, or destroy |

For a full feature pass, record the matrix below. Give every mutating,
conditional, status-transition, and custom action its own row. Standard
read-only actions may be grouped only when permission, valid states, endpoint
behavior, busy guard, and failure handling are identical; list every grouped
action name. This keeps the matrix complete without duplicating identical
low-risk rows.

```markdown
| Action | Permission | Valid row states | Confirmation/input | Endpoint | Busy guard | Success refresh/page rule | Failure recovery |
|---|---|---|---|---|---|---|---|
| View | Vehicle.View | Any visible row | None | GET detail | Row/open guard | No list mutation | Keep list and show detail error |
| Delete | Vehicle.Delete | Deletable only | Shared confirmation | DELETE by stable ID | Per-row delete guard | Refresh; correct empty last page | Keep row; clear busy; translated error |
```

The action definition, menu predicate, frontend handler, typed service method,
backend authorization/state transition, and refreshed row state must describe
the same rule. A menu item hidden only in the UI does not secure the endpoint.

### 8.7 Loading, empty, error, permission, and transition states

The table region must have an intentional presentation for:

- initial state before the first explicit Search, when applicable;
- loading with the previous data retained or cleared according to the
  approved pattern;
- successful rows;
- valid zero-result/empty state;
- validation failure;
- API/business error with retry where useful;
- unauthorized/forbidden/no-permission;
- stale response ignored after a newer Search;
- last row removed from a page;
- page corrected after add/edit/delete changes the result count.

State text is translated and appears inside the table/result region. Do not
leave a blank grid that looks broken, and do not show raw API or SQL details.
Loading overlays must not permanently block row actions or the page.

### 8.8 Table footer and paginator (`PAGER-SHARED`)

The Sales/Fleet shared list is the approved footer reference.

- Prefer the existing shared `table-list` footer when the target feature uses
  that architecture. Do not duplicate its pager with a second local footer.
- If the feature already owns a PrimeNG paginator, configure it from server
  state: `first = (pageNo - 1) * pageSize`, `rows = pageSize`,
  `totalRecords = totalCount`, approved rows-per-page options,
  `showCurrentPageReport = true`, and a translated current-page template.
- Convert the PrimeNG zero-based page event to the API's declared page number
  exactly once. Update page size and page number together when rows-per-page
  changes.
- The backend `totalCount` is authoritative. Derive display range safely:
  zero rows shows zero-to-zero; a partial last page never reports beyond the
  total; filtered counts do not reuse an unfiltered total.
- Place the footer directly under the rows inside the same table border. Match
  the approved first/previous/page/next/last buttons, active page, rows selector,
  `items per page`/current range text, padding, height, and alignment.
- Do not hand-build paginator arrows, page inputs, or count text when the
  shared table/paginator already supplies them.
- Paginator icons on neutral surfaces keep the approved contrasting color;
  active solid-page icons/text use white where applicable.
- In dark theme, footer surface, borders, text, selected page, dropdown, and
  icons use the approved dark tokens. In RTL, order/direction and arrow glyphs
  are correct without mirroring text.
- The footer remains visible/reachable at supported viewport sizes and does
  not float outside the table or below a clipped fixed-height container.

### 8.9 Search, filter, sort, paging, report, and export behavior

- Correct route, permission, title, primary action, and deep link are wired.
- Search behavior matches documented backend search fields.
- Database-backed lists send every supported search/filter/sort/page value to
  the backend using exact API names and representations.
- PrimeNG/local filtering and sorting must not claim to search or sort records
  outside the loaded server page.
- Page number and size restore intentionally and reset when filters change.
- Refresh keeps the current page when valid and corrects it when the total
  shrinks.
- Paginator uses backend `totalCount` and, when returned, `totalPages`.
- Report/print/export use the same normalized filters and status rules as the
  displayed list, cover the intended full result rather than only the visible
  page, and follow Section 13.

### 8.10 Responsive, RTL, theme, keyboard, and accessibility

- Review the table and every body-appended overlay in light, dark, and system
  themes.
- At application breakpoints, filter columns reduce predictably without
  changing the logical field order. Inputs retain equal heights and buttons
  remain reachable.
- Use logical `margin-inline`, `padding-inline`, `inset-inline`, and text
  alignment. Verify filter controls, clear icons, action menus, sort icons,
  horizontal scrolling, and paginator arrows in RTL.
- Every control and row action is keyboard reachable with a visible focus
  state. Icon-only controls have accessible names.
- Table headers expose correct header semantics and sortable state. Menus use
  button/menu semantics compatible with the existing shared component.
- Contrast, status meaning, hover, focus, disabled, and selected states meet
  Section 14 and never rely only on color.

### 8.11 Approved list examples

Use the shared list structure when the target feature already uses it:

```html
<section class="feature-page">
  <div class="feature-panel">
    <app-feature-title
      [title]="'feature.listTitle' | translate"
      [subtitle]="'feature.manage' | translate"
      icon="bi bi-list"
    >
      <button type="button" class="feature-primary-button" (click)="openCreate()">
        <i class="bi bi-plus-lg" aria-hidden="true"></i>
        {{ 'feature.create' | translate }}
      </button>
    </app-feature-title>

    <form class="feature-filters" [formGroup]="filterForm" (ngSubmit)="search()">
      <!-- Labelled, equal-height controls in screenshot order. -->
      <!-- Search/report/export actions follow the approved toolbar pattern. -->
    </form>

    <div class="feature-grid">
      <app-action-button
        [moreActions]="moreActions()"
        (SendActionTemplate)="setActionTemplate($event)"
      ></app-action-button>

      <table-list
        [columns]="columns()"
        [list]="data()"
        [moreActions]="moreActions()"
      ></table-list>
    </div>
  </div>
</section>
```

When the current feature intentionally owns a PrimeNG paginator instead of
`table-list`, use one server-backed paginator inside the table surface:

```html
<p-paginator
  [first]="(pageNo() - 1) * pageSize()"
  [rows]="pageSize()"
  [totalRecords]="totalCount()"
  [rowsPerPageOptions]="[10, 25, 50]"
  [showCurrentPageReport]="true"
  [currentPageReportTemplate]="'feature.showingEntries' | translate"
  (onPageChange)="onPageChange($event)"
></p-paginator>
```

Examples show structure, not permission, contract, column, or style values to
copy blindly. Match the supplied screenshot and closest approved reference.

## 9. Normal form and modal specification

### 9.1 Choose the correct container

- Complete the mandatory Create/View/Edit shape decision in Section 2 before
  changing the container, route, tabs, stepper, or save ownership.
- Use a normal routed form when the workflow needs page navigation, deep
  linking, or enough space that a dialog would create nested scrolling.
- Use a modal only for a bounded task that belongs to the parent screen.
- Use a grouped/tabbed modal when Detail/Documents or a few related sections
  belong to one child workflow. Use a step form for a long aggregate editor.
- Match the supplied screenshot's container type. Do not maximize a compact
  modal to full screen or squeeze a long form into a small centered dialog.

### 9.2 Form layout and field styling

- Use one typed reactive form whose controls and validators match the reviewed
  Add/Update contract. Do not use template-driven state beside the same form.
- Arrange fields in screenshot order using the approved responsive grid.
  Preserve logical grouping, column spans, label alignment, equal input
  heights, and consistent vertical gaps.
- Labels use real `for`/`inputId` associations; required markers, help text,
  validation text, and character counts remain associated with the control.
- Text, numeric, dropdown, calendar, textarea, checkbox, upload, and read-only
  controls use the approved light/dark surfaces, borders, focus state, and
  disabled/read-only appearance.
- Dropdowns apply `DROPDOWN-INTERNAL` from Section 11 when applicable.
- A clear icon does not overlap the value or dropdown trigger and remains
  correct in RTL.
- Textareas match the screenshot's width/minimum height, resize behavior, and
  character limit. They do not create unexplained empty space above the action
  footer.
- Inline errors appear after touch/submit, name the field/rule, and do not
  unpredictably shift adjacent controls. Use Section 6 colors and icons.
- Conditional fields add/remove visibility, validators, enabled state, and
  payload properties together.

### 9.3 Create, view, and edit modes

- Create initializes documented defaults exactly once.
- View loads the requested ID, is fully read-only, and hides Save and all
  mutating actions. Tabs, scrolling, documents, and Close remain usable.
- Edit loads before patching and does not overwrite user changes from a later
  stale response. Existing child IDs, files, and date values are preserved.
- Invalid/missing route or dialog IDs fail safely with a translated state and
  predictable navigation/close behavior.
- Disabled controls are deliberately included or excluded from the payload;
  do not assume `form.value` contains them.
- Use one Save workflow for Create/Update when the current pattern does so,
  but build distinct typed payloads when their contracts differ.

### 9.4 Modal geometry, header, body, scrolling, and footer

- Open the dialog below the application header and within the content area;
  it must not render under the sidebar or cover the app header unless the
  supplied reference explicitly uses a global full-screen workflow.
- Match screenshot width, maximum width, top offset, height, border, shadow,
  header height, and padding. Use responsive `max-width`/`max-height`; do not
  use `100vw`/`100vh` for a compact dialog.
- For every modal—simple, grouped/tabbed, step, child-editor, lookup, or report—
  calculate the desktop dialog width from its widest required content state,
  including tabs, conditional sections, editable rows, child tables, and action
  groups, not only from the initially visible state. Use one stable dialog
  width with a responsive maximum so opening or switching content cannot clip
  fields, add horizontal dialog scrolling, or leave controls unusably narrow.
  Do not rely on a state-dependent width that the overlay may cache when it
  first opens.
- Within an editable modal row or child table, controls on the same row use the
  same explicit control height. Give columns intentional widths/minimum widths
  based on their content; do not allow browser auto-sizing to make dropdowns,
  dates, or text inputs visibly different heights or too narrow to operate.
- Header contains a translated title and, when shown by the reference, an icon
  and short description. The built-in close button and explicit Close/Cancel
  action both work.
- Dialog scrolling applies `SCROLL-OWNER` from Section 14.2.
- Tabs/header and action footer remain fixed while the body scrolls when the
  screenshot/reference requires a fixed footer.
- Remove artificial spacer height above Cancel/Save. The footer follows the
  content or stays at the dialog bottom using the approved flex layout.
- Footer buttons use screenshot order and logical RTL order. Cancel/Close and
  Save include their approved icons; every icon on a solid action is white.
- Body-appended dropdown/calendar/menu overlays remain above the dialog body
  and below later modal layers. App-header menus must appear above the feature
  dialog when opened.
- Focus enters the dialog, remains trapped, Escape follows the documented
  close rule, and focus returns to the opener.

#### Body-appended overlay styling (`OVERLAY-SCOPE`)

PrimeNG dialogs, dropdown panels, calendars, menus, and other overlays using
`appendTo="body"` are moved outside the feature component's host element.
Therefore they do **not** inherit CSS custom properties declared only on
`:host`, and selectors such as `:host ::ng-deep .some-dialog` may not match the
rendered overlay. This commonly causes boxed controls to reappear, active-tab
colors to fall back, required markers to duplicate, or a Save button to become
white text/icon on a transparent background.

For every body-appended feature overlay:

1. Assign a unique feature `styleClass` to the overlay root. Use the matching
   panel class input for independently appended dropdown/menu panels when the
   component provides one.
2. Declare every feature CSS variable needed by projected content on that
   overlay root as well as on `:host`; do not assume host inheritance survives
   `appendTo="body"`.
3. Scope deep PrimeNG overrides through the unique overlay class, for example
   `::ng-deep .vehicle-editor-dialog .p-dropdown`. Do not use an unscoped
   global `.p-dropdown`, `.primary-button`, or `.required` workaround.
4. When a global required-marker rule exists, explicitly prevent a second
   `::before`/`::after` marker on the feature field wrapper and keep one marker
   beside the label.
5. Confirm from source that the dialog footer uses the approved footer slot or
   flex region, the primary action has an explicit solid background, and its
   icon/text use `ICON-SOLID`. Undefined variables must not make the action
   invisible.
6. Apply the same overlay-root variables and scoped selectors for dark theme,
   RTL direction, responsive sizing, and child dialogs. Preserve the z-index
   ordering already required by Section 9.4.

Do not respond to an appended-overlay styling failure by repeatedly changing
field dimensions. First verify overlay ownership, variable inheritance, and
selector reach; then compare screenshot measurements.

### 9.5 Tabs and document sections

- Use tabs only for distinct groups such as Detail, Payment Plan, and
  Documents. The selected tab text and indicator must be clear in light and
  dark themes.
- Changing tabs must not freeze the screen, submit the form, lose values, or
  create a second page scrollbar.
- Use accessible tab semantics, keyboard navigation, linked panels, and a
  non-color selected-state cue.
- A Documents tab uses the document rules in Section 12: clear header,
  description, Add/Upload action, empty state, existing-file rows, loading,
  error, download, replace, and confirmed remove states as applicable.
- Button labels must have enough width and must not wrap into clipped fragments
  such as `Add Docu...` unless the supported mobile layout intentionally uses
  an icon-only button with an accessible name.

### 9.6 Save, cancel, close, confirmation, and request states

- Cancel has predictable navigation/close behavior and never mutates data.
- Save validates the required scope, focuses the first invalid control, is
  protected from duplicate clicks, and is re-enabled after API failure.
- Server validation/business errors remain visible without clearing entered
  values. Loading state never leaves the footer permanently disabled.
- Close/X/Escape and every confirmation-only interaction apply
  `CONFIRM-SHARED` from Section 3. Mutation starts only after the service emits
  `true`; Cancel, close, or Escape never performs it.
- A workflow requiring a rejection reason, note, date, or other input is a
  typed form dialog, not confirmation-only UI.

### 9.7 Normal/modal form completion example

```html
<form [formGroup]="form" (ngSubmit)="save()" class="feature-form">
  <div class="feature-form__body">
    <!-- Labelled responsive field groups and tab panels. -->
  </div>

  <footer class="feature-form__footer">
    <button type="button" class="feature-secondary-button" (click)="cancel()">
      <i class="bi bi-x-lg" aria-hidden="true"></i>
      {{ 'general.cancel' | translate }}
    </button>
    <button type="submit" class="feature-primary-button" [disabled]="saving()">
      <i class="bi bi-floppy" aria-hidden="true"></i>
      {{ 'general.save' | translate }}
    </button>
  </footer>
</form>
```

The example fixes structure only. Use the feature's approved semantic classes,
permissions, contract, and screenshot geometry.

## 10. Step-form specification

### 10.1 Structure and visual layout

- Use steps for real logical groups, child collections, documents, or a long
  workflow; do not create steps only to distribute a small field count.
- Use the `CompanyPartner` editor,
  `Customers/Companies/CompanyPartner/components/details`, as the structural
  reference: one feature header, one step track, one validation summary, one
  content viewport, and one persistent action footer.
- Match screenshot/reference card width, step spacing, icon size, connector,
  label weight, active/completed/error state, content padding, and footer
  height in light/dark themes.
- Active, completed, and error step glyphs are white on their solid semantic
  circles. Inactive glyphs use the muted token. State also has text/ARIA and
  never relies only on color.
- The card owns one vertical content scroll area. Keep the application page,
  step content, child tables, and document section from creating competing
  vertical scrollbars.
- The footer remains visible/reachable and is not covered by content, browser
  zoom, mobile viewport controls, or body-appended overlays.

### 10.2 Form ownership and step behavior

- One typed parent reactive form owns the complete save contract. Section
  components receive explicit groups/arrays; they do not construct competing
  payloads or save independently unless the backend workflow explicitly does.
- Step state is stable across Create, View, and Edit. View allows navigation
  while preventing mutation.
- Back/Next are `type="button"` and never submit accidentally. Final Save is
  the only submit action unless the documented workflow has intermediate API
  operations.
- Next validates its required scope. Save validates the complete contract.
- Conditional steps/fields update validators and payloads without orphaning
  values or making a required step unreachable.
- Revisiting a step preserves entered values, child rows, document selection,
  touched state, and applicable server errors.

### 10.3 Validation summary and navigation

- The blocking summary lists every current invalid field with translated step
  and field names and removes each item when valid.
- Selecting an invalid item moves to its step, scrolls and focuses the control,
  and uses only the temporary amber navigation highlight from Section 6.
- Required/error badges remain red and bold. The summary does not claim a
  hidden or disabled field is invalid unless it is part of the save contract.
- If a tab-style stepper is used, implement `tablist`, linked `tabpanel`,
  roving focus, Arrow/Home/End, Enter/Space, selected state, and focus return.
  Otherwise use simpler navigation semantics rather than false tab semantics.

### 10.4 Children, overlays, requests, and responsive behavior

- Child rows, nested dialogs, and uploads follow Section 12 and preserve parent
  state on failure.
- Dropdown/calendar/menu overlays are not clipped and use the correct dialog,
  theme, and z-index context.
- Save is protected from duplicate submission, remains disabled only during
  the active request, and recovers after validation/business/network failure.
- At application breakpoints, step navigation may scroll horizontally or
  compact according to the approved reference; step order and labels remain
  understandable in LTR and RTL.
- Reduced-motion preferences disable nonessential step animation.

For completion, inspect every step and every Create/View/Edit state, not only
the initial step.

## 11. Dates, enums, numbers, and lookups

- `DATE-ONLY`: Date-only business values must preserve `yyyy-MM-dd` calendar components.
  Do not pass them through UTC `toISOString()` and shift the day.
- Timestamps follow the explicit API UTC contract.
- Existing Edit values must patch into the date control type it expects.
- Issue/expiry and start/end ordering must be validated in both UI and backend.
- Dropdown enum values must match backend numeric/string serialization exactly.
- Reject or display unknown enum values safely.
- Numeric inputs must match backend range, precision, scale, and rounding.
- Autocomplete controls must normalize selected objects to IDs once.
- `DROPDOWN-INTERNAL`: When a dropdown already provides built-in filtering and `showClear`, use
  those controls. Do not add separate search, open, delete, or clear buttons
  beside the dropdown.
- Lookup IDs must not be accepted merely because their labels exist in UI
  state; the backend remains authoritative.

## 12. Child rows, nested dialogs, documents, and uploads

### 12.1 Editable child collections

For every child collection review:

- Add, View, Update, Remove, omitted, empty, and default-row behavior;
- new versus existing child IDs and stable row identity;
- duplicate rows and business uniqueness;
- typed row form and row validation before parent submit;
- calculated/read-only child fields versus client-editable inputs;
- removed-item representation expected by the backend;
- explicit aggregate reconciliation instead of silently replacing children;
- child dialog Save/Cancel/close/focus behavior;
- parent values are not lost if child validation or a request fails;
- row action icons, status, disabled state, responsive table/card layout, and
  empty state follow the approved grouped-modal pattern.

Edit a draft child group in the dialog and copy it to the parent collection
only after dialog Save succeeds. Cancel must leave the original row unchanged.

### 12.2 Documents tab visual pattern

A Documents tab/section is a complete stateful surface, not an empty panel
with an upload button. Match the screenshot/reference and include applicable:

- tab label with clear selected state in light/dark themes;
- section header with document icon, translated title, short description, and
  Add/Upload action aligned without clipped or wrapped button text;
- bordered content surface with consistent header/body padding;
- empty state with icon, title, explanatory text, and Add/Upload action;
- loading state and recoverable error/retry state;
- existing document rows/cards showing safe display name, type, size/date when
  required, download/view action, replace action, and confirmed remove action;
- Add, Upload, Download/View, Replace, and Remove controls use their approved
  semantic surfaces, and every glyph on a solid surface applies `ICON-SOLID`;
- keyboard/focus behavior and accessible names for icon-only file actions;
- responsive wrapping that keeps filename and primary actions readable;
- when the screenshot shows one document row at the supported desktop width,
  size the modal and row grid so all fields and actions remain on that row
  without clipping or a horizontal dialog scrollbar; wrap only at the defined
  tablet/mobile breakpoint;
- RTL logical alignment and body-appended menu/overlay placement;
- fixed dialog/footer behavior without large unused space below the documents.

Do not create placeholder document UI when no backend/file contract exists.
Classify it as a contract decision and identify the required endpoint/DTO or
existing shared document service before implementation.

### 12.3 Upload and file contract

Uploads require:

- visible allowed type/size rules and translated validation;
- client precheck only as convenience, never as security;
- authenticated backend validation of tenant/parent ownership, size,
  extension, MIME/signature, safe name, and storage path;
- a typed upload response containing only required file identity/display data;
- stable existing file when no replacement is selected;
- replacement failure and orphan cleanup behavior;
- safe confirmed delete behavior and a clear missing-file state;
- loading/progress state that prevents duplicate upload without freezing the
  complete parent form;
- object URL/subscription cleanup using the existing project pattern.

Never persist, return, log, route, or export CVV. Collect it only for an
immediate authorization flow when the business flow truly requires it.

## 13. Report, print, and export specification

### 13.1 Report screen and filters

- Use the BalancesSummary report as the approved structure: feature title,
  typed filter area, explicit Run/Search action, result surface, totals, and
  table-owned paginator/footer when paged.
- Match screenshot/reference filter columns, control heights, toolbar order,
  report button styling, card spacing, and responsive wrapping. Apply the
  filter rules in Section 8.3.
- Confirm route/menu permission, backend authorization, default filters,
  required date/status/lookup values, optional Reset, and translated labels.
- Filters submit one normalized request and do not trigger duplicate requests
  from value changes plus form submit.

### 13.2 Result table, grouping, totals, and states

- Result table styling follows Sections 8.5-8.8: one bordered surface, stable
  columns, row actions when applicable, loading/empty/error states, scroll
  ownership, and correct paginator/footer.
- Confirm result columns, grouping keys, subtotals, grand totals, currency,
  decimal precision, date formatting, and negative/zero representation.
- Backend filters apply before aggregation, count, sort, and paging. Displayed
  totals state whether they represent the page, filtered result, or full
  report and must match the backend contract.
- Nested statement/detail dialogs have their own typed filters, loading,
  error, rows, totals, scrolling, fixed footer, theme, RTL, and focus behavior.

### 13.3 Cross-surface consistency

The same normalized business filters, permissions, status rules, date
boundaries, tenant context, ordering, and calculation rules must apply to:

- displayed table;
- nested detail/statement dialog;
- printable view;
- exported file;
- count and total endpoints.

Document any intentional difference. A screen total and export total produced
from different rules is a confirmed contract defect.

### 13.4 Print

- Print hides filters, interactive controls, menus, sticky/fixed action bars,
  and non-report navigation while preserving title, filter summary, headings,
  rows, totals, and required footer information.
- Use print-specific width, overflow, page-break, repeated-header, color, and
  RTL rules. A horizontally scrollable screen table must become printable
  without clipped columns or browser UI artifacts.
- Print uses the intended full result, not only the currently rendered page,
  unless the workflow explicitly says `Print current page`.

### 13.5 Export

- Export uses the same approved filters/status/sort scope as the displayed
  report and covers all intended rows, not only the visible page.
- If export gathers multiple server pages, any failed page fails the complete
  export; do not silently produce a partial file.
- Filename, format, translated headings, column order, date/number formatting,
  sensitive columns, row limits, progress, cancellation, and error message
  follow the existing project convention.
- Disable duplicate export while active and release loading state on success,
  failure, cancellation, or component destruction.

## 14. Theme, responsive, RTL, and accessibility

### 14.1 Theme coverage

Review light, dark, and `system` theme using the application's actual
`data-bs-theme` ownership on `<html>`. Do not create a feature-local theme flag.
Review every surface, including body-appended dropdown, calendar, autocomplete,
dialog, menu, confirmation, tooltip, toast, table, paginator, upload, and
validation overlay.

- Use existing variables/tokens and Section 5 precedence. Avoid broad
  `!important` color patches that hide the wrong base class.
- Check canvas, cards, sub-panels, headers, rows, hover, selected, active tab,
  inputs, disabled/read-only fields, borders, text, icons, status badges,
  validation, footer, and scrollbar contrast.
- Selected tab text must remain clearly readable in dark mode; the indicator
  alone is not enough.
- App-header dropdowns and global overlays remain readable and appear above
  feature dialogs in both themes.

### 14.2 Responsive behavior and scroll ownership (`SCROLL-OWNER`)

Use the application's existing Bootstrap/Metronic breakpoints. Do not invent
feature-specific breakpoints when an application breakpoint fits. Verify
desktop, tablet, and the smallest supported mobile viewport. If the minimum is
undocumented, record an owner decision instead of inventing it.

- The feature stays inside the content area and never extends under the
  sidebar or app header.
- Filter/form grids reduce columns without changing logical reading order.
  Controls retain equal heights; labels, errors, and buttons stay aligned.
- Tables own necessary horizontal scrolling. Dialog bodies own their vertical
  scrolling. Avoid page + panel + child nested scrollbars.
- Fixed/sticky headers, tabs, and footers do not cover controls or rows and
  remain reachable with zoom and mobile viewport changes.
- Body-appended overlays remain on-screen, correctly sized, and above their
  owner at the narrowest viewport.
- Button labels do not clip. Toolbars wrap/scroll in the approved order, and
  primary actions stay reachable.

### 14.3 RTL

- Use logical CSS properties (`inline-start`, `inline-end`, logical margins,
  padding, borders, and inset) for feature layout.
- Verify title actions, filter order, text/numeric alignment, input icons,
  dropdown clear/trigger icons, calendar buttons, table action column, action
  menu placement, horizontal scrolling, tabs/steps, footer buttons, and
  paginator arrows.
- Mirror directional navigation icons only; do not mirror semantic icons,
  numbers, dates, text, or complete components blindly.
- Body-appended overlays inherit direction and align to the triggering control.

### 14.4 Keyboard, focus, semantics, and contrast

- Every interactive element has a visible `:focus-visible` state in light and
  dark themes.
- Icon-only buttons have accessible names; decorative icons are hidden from
  assistive technology.
- Every form control has a real label/equivalent accessible name and linked
  help/error description.
- Verify keyboard operation and focus restoration for menus, dialogs,
  confirmations, tabs, steps, sortable headers, pagination, child editors,
  documents, uploads, and Cancel/Save.
- Normal/large text, borders, focus indicators, disabled state, and semantic
  status colors retain sufficient contrast. Meaning never relies only on
  color, position, or icon.
- Dynamic loading/error/success state uses the existing live-region/status
  pattern where user action requires announcement.
- `prefers-reduced-motion` disables nonessential decorative transitions.

Shared table/overlay styles belong in `src/styles.scss` only when multiple
features require the same fix and shared ownership is confirmed. Feature-only
rules stay in the feature SCSS; do not move them globally for convenience.

## 15. Errors, loading, and state cleanup

- Handle success, business failure, validation failure, unauthorized,
  forbidden, not found, timeout/network failure, and unexpected response.
- Never show raw stack/SQL details.
- Do not leave buttons, spinners, or dialogs permanently busy.
- Search, filter, lookup, and report requests must cancel or ignore obsolete
  responses using the project's existing Angular/RxJS pattern, such as
  `switchMap`, a request sequence/version, or the existing cancellation
  mechanism. Do not introduce a new state-management or request abstraction
  solely for this rule.
- Clean subscriptions/effects using the project's existing Angular pattern.
- Preserve entered data after a recoverable API error.
- Translate user-facing labels, validation messages, states, and actions.

### Authenticated request review gate (`AUTH-INTERCEPTOR`)

- For every protected endpoint, confirm the feature request uses an
  `HttpClient` from an injector where the project's token interceptor is
  registered. A route guard proves navigation access only; it does not prove
  that API requests contain an authentication header.
- In the current Sigma architecture, `tokenInterceptor` is registered in
  `LayoutModule`. A feature service declared only with `providedIn: 'root'`
  can resolve the root `HttpClient` and bypass that lazy-module interceptor.
  Either provide the feature service in `LayoutModule`, following the existing
  Sigma service pattern, or deliberately register the interceptor at the root
  application scope as part of an approved shared-architecture change.
- Do not add manual `Authorization` headers inside individual feature
  services. Authentication remains owned by the shared interceptor.
- When a protected endpoint returns `401`, distinguish a missing Bearer header
  from an expired, malformed, or rejected token. The owner-run network
  acceptance check must confirm that the request contains
  `Authorization: Bearer <token>` without recording or exposing the token
  value in the review report or screenshots.

## 16. Review output

### Reporting scale

Do the required review work, but do not paste the complete guide or repeat
every checked rule in the final report.

- **Targeted patch:** use the compact structure below. Include only affected
  contract rows, canonical rules, risks, and verification states.
- **Full feature pass:** use the complete review structure and required
  ledgers. Group fully matched fields and `Reviewed - no finding` areas by
  name/count; list full detail for mismatches, findings, decisions, and risks.
- Report checklist completion by section number and exceptions, using the
  matching Required targeted-patch or full-feature completion record. Do not
  reproduce all checklist text.
- Visual and field ledgers may be maintained during the work; the handoff may
  summarize confirmed measurements/counts and list only mismatches/decisions.

Targeted patch report:

```markdown
# <Feature> Targeted Patch

## Requested scope and evidence
## Files changed and exact behavior
## Directly affected contract/canonical-rule checks
## Risks and owner decisions
## Owner verification pending
## Targeted checklist result
## Scoped diff status and commands not run
```

Full feature review report:

```markdown
# <Feature> Frontend Review

## Scope and screen shape
## Request and component flow
## Approved reference used
## Visual verification status
## Endpoint matrix
## Field parity summary
## Contract mismatches
## Findings by severity
## Query, paging, and export observations
## Theme, RTL, responsive, and accessibility observations
## Owner-run acceptance scenarios
## Contract decisions needed
## Files requiring the smallest fix
## Coverage summary
```

For implementation mode, append this handoff structure:

```markdown
## Files changed
## Frontend implementation
## Direct contract/backend implementation
## Visual and interaction implementation
## Guide checklist result
## Possible compile/runtime risks
## Manual owner-verification steps
## Commands intentionally not run
```

List real changed files and concrete behavior. Do not write `updated UI` or
`fixed backend` without naming the screen, state, or contract that changed.

Use `Reviewed - no finding` for a reviewed area with no confirmed defect. Use
`Not applicable` when an area does not apply to the selected screen shape.

Order findings by Critical, High, Medium, and Low. Every finding must use a
stable category identifier, for example:

```text
FE-CONTRACT-001
FE-BEHAVIOR-001
FE-SECURITY-001
FE-DATA-001
FE-UI-001
FE-A11Y-001
FE-PERF-001
```

Keep an identifier stable when updating the same finding. Do not combine
unrelated problems into one finding. Every finding must contain:

- ID and severity;
- screen, operation, and state;
- exact file and tight line evidence;
- observed behavior;
- business or user impact;
- the smallest safe fix inside the current Sigma pattern;
- affected frontend and backend files;
- one owner-run acceptance scenario.

Example:

```markdown
### FE-BEHAVIOR-004 - Medium - List paginator uses loaded-row count

- Screen/operation/state: Vehicle list, filtered page 2.
- Evidence: `components/list/list.component.html` binds `totalRecords` to
  `rows.length`; the service response exposes `totalCount`.
- Observed behavior: the paginator reports only the current page and cannot
  navigate to remaining backend rows.
- Impact: users cannot reach valid records and displayed/exported scopes can
  appear inconsistent.
- Smallest safe fix: bind the existing paginator to response `totalCount`,
  preserve API page/pageSize conversion, and keep the approved Sales/Fleet
  footer style.
- Affected files: list component, template, response model, and service only.
- Owner acceptance: search a filter with more than one page, navigate to the
  last partial page, change rows-per-page, and confirm range/total/RTL arrows.
```

Use the evidence-first classifications from Section 1 when a point is not a
confirmed defect. Apply the field-accounting rules and summary from Section 7.

## 17. Final completion checklists

For a **targeted patch**, complete Section 17.0 plus only the directly
applicable canonical/screen-shape items. For a **full feature pass**, complete
Sections 17.1-17.11 and every applicable screen-shape subsection. Copy the
matching targeted or full completion record at the end into the handoff. A
checked item means it was confirmed from source or implemented and reviewed;
it does not mean owner runtime verification was performed.

### 17.0 Targeted patch checklist

- [ ] The request identifies one bounded issue/element/handler and targeted
      depth is recorded; no unrelated full-feature audit is implied.
- [ ] Exact source evidence and the directly affected files/states/callers are
      identified before editing.
- [ ] The closest applicable screenshot/reference and canonical rule IDs are
      checked only where they affect the requested patch.
- [ ] If the patch touches an endpoint, payload, permission, lookup, status,
      total, or persistence rule, the affected contract slice is traced under
      Section 7; otherwise no full endpoint/field ledger is required.
- [ ] Direct light/dark, RTL, responsive, keyboard/focus, loading/error, and
      accessibility effects are checked when relevant to the target.
- [ ] The smallest safe controlled patch is applied without unrelated
      refactoring or owner-change reversal.
- [ ] The complete targeted diff is reviewed for stale imports/types,
      contract/caller mismatch, translations, merge markers, and whitespace.
- [ ] Discovered out-of-scope serious issues are reported with evidence rather
      than silently added to the patch.
- [ ] Concise handoff includes the Required targeted-patch completion record,
      exact changes, direct risks, owner verification, scoped diff status, and
      prohibited/unperformed commands.

### 17.1 Scope, evidence, and reference checklist

- [ ] The complete guide was read before review/editing.
- [ ] Review mode or implementation mode was identified correctly.
- [ ] The Section 18.1 feature file set and Section 18.2 surface inventory were
      recorded before shape analysis, and the Section 18.3 inspection order was
      followed.
- [ ] Requested feature, route, operation, frontend path, directly related
      backend contracts, screenshot states, and workflow notes were recorded.
- [ ] The screen shape and every applicable sub-screen/dialog/tab were listed.
- [ ] Create/View/Edit shape decision records existing/candidate/chosen shape,
      workflow evidence, rejected alternatives, save ownership, viewport and
      owner-verification needs before any modal/tab/step refactor.
- [ ] The closest approved reference was inspected in source at feature-root
      precision: `Sales/Fleet` list, `Customers/Companies/CompanyPartner` step
      form, its `detalisForm/drivers` child modal, or
      `Customers/BalancesSummary` report.
- [ ] No pattern, evidence, or justification was taken from a Section 3
      non-reference legacy sibling (`Customers/Companies/Company`,
      `CompanyContactPerson`, `CompanyDriver`).
- [ ] Missing, renamed, or divergent approved references follow the Section 3
      availability/divergence gate and are never reconstructed from memory.
- [ ] Findings are evidence-backed, severity-classified, and use stable IDs.
- [ ] Unconfirmed items are under Contract decision needed or Owner
      verification required, not presented as defects.
- [ ] Review stop conditions were respected; unrelated shared issues and
      refactors were not pulled into scope.

### 17.2 Architecture, routing, permissions, and translations checklist

- [ ] Current Sigma architecture and component-library patterns were
      preserved; no unnecessary state framework, generic abstraction, or new
      design system was introduced.
- [ ] Route path, lazy loading, deep links, route IDs, create/view/edit mode,
      back/cancel navigation, and invalid-ID handling are correct.
- [ ] Page, primary action, row actions, tabs, dialogs, report/export, and
      backend endpoints enforce applicable permissions.
- [ ] Protected requests comply with `AUTH-INTERCEPTOR` from Section 15.
- [ ] All visible labels, actions, validation, status, empty/loading/error
      text, confirmation text, table headings, and paginator/report text are
      translated in every supported locale.
- [ ] Permission denial, unauthorized, and forbidden states do not expose
      protected data or leave a misleading editable screen.

### 17.3 Frontend/backend contract checklist

- [ ] Backend source availability and review depth are recorded; unavailable
      backend evidence is classified `BACKEND_UNVERIFIED` without unsupported
      authorization/persistence/validation claims.
- [ ] The endpoint matrix includes every list/detail/add/update/delete/custom
      action/lookup/document/report/export request used by the feature.
- [ ] Every frontend and backend field is classified and accounted for in the
      field ledger and parity summary.
- [ ] List VM contains only displayed list properties plus minimum identity
      and action-state fields.
- [ ] Add/Update DTOs contain client-editable inputs only; Detail DTO contains
      only data required by the details UI.
- [ ] Tenant, number, audit, approval/status transitions, persisted calculated
      values, and other server-owned fields are not trusted from the client.
- [ ] Typed models/forms/payloads match JSON names, types, nullability,
      wrappers, enums, dates, decimals, defaults, and disabled-control rules.
- [ ] Dates preserve date-only calendar values; timestamps follow the declared
      UTC contract; ranges and ordering are validated.
- [ ] Lookups normalize selected objects to IDs, and backend ownership,
      existence, duplicate, transition, and invariant validation remains
      authoritative.
- [ ] Children/files use explicit Add/Update/Remove/reconciliation semantics
      and preserve existing IDs/data safely.

### 17.4 Visual, buttons, icons, theme, RTL, and accessibility checklist

- [ ] Supplied screenshots were treated as acceptance criteria for all shown
      states; the UI was matched rather than redesigned.
- [ ] Visual measurement ledger records application offsets, page/card,
      filters, controls, toolbar, table, actions, footer, dialogs, and tabs for
      every supplied screenshot state.
- [ ] Page/card size, title, subtitle, padding, spacing, surface, border,
      shadow, typography, and visible scroll areas match the screenshot or
      closest approved reference.
- [ ] Every button in default/non-default tabs, conditional sections, tables,
      dialogs, and footers uses the approved semantic style; no unexplained
      legacy button color remains.
- [ ] Buttons and icons comply with `ICON-SOLID` from Section 6.
- [ ] Error states are red and bold where required; amber is only temporary
      invalid-field navigation highlight.
- [ ] Light, dark, and system theme cover cards, controls, overlays, menus,
      dialogs, tabs, tables, paginators, validation, uploads, and app-header
      overlay stacking.
- [ ] Desktop, tablet, and smallest supported mobile layouts were reviewed;
      content does not render under the sidebar/app header or create page-wide
      horizontal scrolling.
- [ ] RTL uses logical properties and correct field order, clear/trigger icon
      placement, menus, tabs/steps, action buttons, footers, and directional
      icons.
- [ ] Labels, accessible names, keyboard behavior, focus trap/return,
      `:focus-visible`, contrast, live state announcement, and reduced motion
      are covered.
- [ ] Visual verification status explicitly separates source comparison from
      owner runtime visual verification.

### 17.5 Grid/list checklist

Complete this entire subsection for every grid/list or report result table.

#### Filters and toolbar

- [ ] Feature title and permitted Create/Add action are inside the primary
      panel in screenshot order.
- [ ] Filter field order, spans, widths, row gaps, labels, equal control
      heights, required markers, and date ranges match the reference.
- [ ] Validation/help text belongs to its field and does not move adjacent
      controls or misalign the Search button.
- [ ] Search button aligns with control inputs and submits once; filter changes
      reset the page intentionally.
- [ ] Lookup dropdowns comply with `DROPDOWN-INTERNAL` from Section 11.
- [ ] Clear and dropdown trigger icons do not overlap values and work in RTL.
- [ ] Report/export/refresh/reset/search actions have correct order, height,
      icon color, loading/disabled state, and responsive behavior.

#### Table and row actions

- [ ] Header background, typography, height, padding, borders, sort indicators,
      row height, zebra/hover state, and column grid match the reference.
- [ ] Column order, labels, formatting, status, identity, and accessible long
      text are correct; list properties match the displayed columns.
- [ ] Table owns necessary horizontal/vertical scrolling without moving the
      page/sidebar/header or clipping focus/menu/state content.
- [ ] Row action column and button match size, solid color, explicit white
      glyph/text/caret, hover/focus/disabled states, and RTL placement.
- [ ] Action menu uses the stable row ID, current permissions/state, correct
      z-index, outside-click/Escape cleanup, focus return, and is not clipped.
- [ ] Every row action completes the mandatory define/open/select/confirm-or-
      input/execute-once/success/page-reconcile/failure/cleanup lifecycle, and
      its action matrix matches frontend and backend rules.
- [ ] Every row action complies with `CONFIRM-SHARED` from Section 3.

#### States and footer

- [ ] Initial, loading, rows, empty/zero-result, validation, API error/retry,
      unauthorized/no-permission, stale response, and last-page-delete states
      are intentional and translated inside the result region.
- [ ] Table header, rows, scrollbar, and footer/paginator share one bordered
      table surface.
- [ ] Shared `table-list` footer is used when applicable; no duplicate or
      hand-built pager exists.
- [ ] Owned PrimeNG paginator uses correct `first`, `rows`, backend
      `totalRecords`, rows options, translated range, zero-based event
      conversion, and page-size reset behavior.
- [ ] First/previous/page/next/last controls, active page, rows selector,
      items-per-page/current range, height, padding, borders, light/dark style,
      RTL arrows, and responsive reachability match Sales/Fleet.
- [ ] Search/filter/sort/page/report/export scopes are consistent; no local
      page operation pretends to cover the full backend result.

### 17.6 Normal form and modal checklist

- [ ] Normal page, compact modal, grouped modal, or step form is the correct
      shape for the workflow and screenshot.
- [ ] Tabs are used for peer sections; steps are used for ordered progression;
      a step modal is used only with explicit screenshot/workflow evidence and
      remains bounded with one scroll body and fixed footer.
- [ ] Create/View/Edit initialize safely; view is read-only; edit preserves
      existing values, IDs, files, and later user changes.
- [ ] Typed reactive form validators, conditional fields, payload construction,
      disabled controls, inline errors, and first-invalid focus match contract.
- [ ] Field order, groups, column spans, equal heights, dropdown clear/search,
      textareas, errors, and responsive collapse match the reference.
- [ ] Modal opens below the app header, inside the content area, at the
      screenshot width/top/height; it is not unnecessarily full screen.
- [ ] Every modal is sized from its widest required content state rather than
      only its initial/default state; later tabs, conditional sections, child
      rows, and action groups are not clipped and do not introduce a horizontal
      dialog scrollbar at the supported desktop width.
- [ ] Editable-row/table controls have one explicit height and intentional
      usable column widths; dropdowns and inputs do not render at mismatched
      heights or collapse into narrow controls.
- [ ] Header/close, tabs, one body scroll area, overlay z-index, fixed footer,
      and removal of unused footer whitespace are correct.
- [ ] `OVERLAY-SCOPE` is satisfied for every `appendTo="body"` dialog/panel:
      unique overlay class, overlay-owned variables, scoped deep overrides,
      one required marker, visible primary action, and dark/RTL coverage.
- [ ] Cancel/Close/Save button order, icons, white solid-button glyphs, dirty
      close behavior, duplicate Save protection, and API failure recovery are
      correct.
- [ ] Focus enters/traps/returns; Escape and X behave predictably and never
      mutate data.

### 17.7 Step-form checklist

- [ ] Steps are logical and every step/tab/conditional section was inspected
      in Create/View/Edit.
- [ ] One typed parent form owns the complete contract; section components and
      child arrays preserve state.
- [ ] Step track, icons, connector, labels, validation summary, content
      viewport, and fixed action footer match the `CompanyPartner` reference.
- [ ] Back/Next do not submit; scoped/full validation and invalid-field
      navigation work; summary items update as fields become valid.
- [ ] One content scroll region, reachable footer, overlay placement,
      responsive/RTL step navigation, keyboard semantics, and reduced motion
      are covered.
- [ ] Final Save is duplicate-protected and preserves values after recoverable
      server failure.

### 17.8 Child editor, Documents, and upload checklist

- [ ] Child Add/View/Edit/Remove/default/empty/duplicate/ID/reconciliation and
      row validation behavior matches the backend aggregate contract.
- [ ] Child modal edits a draft and mutates the parent only after Save; Cancel
      leaves the original row unchanged.
- [ ] Documents tab has clear selected state, header/description, unwrapped Add
      action, bordered content, loading/error, empty state, and existing-file
      rows/actions as applicable.
- [ ] When required by the reference, a desktop document row remains on one
      row without clipping; it wraps only at the documented responsive
      breakpoint.
- [ ] File type/size guidance, client precheck, backend ownership/signature/path
      validation, typed response, replacement/orphan behavior, confirmed
      removal, progress, retry, and cleanup are covered.
- [ ] Document/file actions are keyboard accessible, responsive, themed, RTL
      correct, and do not create large unused modal space.
- [ ] Document Add/Upload/View/Replace/Remove surfaces use the approved
      semantic colors and their solid-surface glyphs satisfy `ICON-SOLID`.

### 17.9 Report, print, and export checklist

- [ ] Typed report filters, defaults, explicit Run/Search, permissions,
      loading/empty/error/retry, and no duplicate request behavior are correct.
- [ ] Result grouping, subtotals, grand totals, currency/decimals/dates, count,
      sort, paging, and total scope are explicit and backend-owned.
- [ ] Screen, nested detail, print, export, count, and totals use consistent
      normalized filters, permissions, status, date, tenant, ordering, and
      calculation rules.
- [ ] Print hides interactive chrome and preserves title/filter summary,
      repeated headings, rows, totals, page breaks, widths, and RTL for the
      intended full scope.
- [ ] Export covers the intended full result, fails on any missing page, uses
      correct filename/format/headings/order/formatting/sensitive-field limits,
      and cleans loading state on all outcomes.

### 17.10 Loading, errors, cleanup, and confirmation checklist

- [ ] Success, validation, business failure, unauthorized, forbidden, not
      found, timeout/network, unexpected response, and retry paths release all
      busy UI and preserve recoverable input.
- [ ] Obsolete search/filter/lookup/report responses are cancelled or ignored
      using the existing project pattern.
- [ ] Subscriptions/effects, object URLs, overlays, menus, temporary state, and
      dialogs clean up on close/destroy/navigation.
- [ ] Every confirmation scenario complies with `CONFIRM-SHARED` from Section
      3, including translated context/consequence and explicit consent.
- [ ] No raw stack, SQL, token, sensitive file path, CVV, or protected data is
      shown, logged, routed, printed, or exported.

### 17.11 Source diff and handoff checklist

- [ ] In implementation mode, every confirmed in-scope finding was implemented
      in one pass or explicitly reported as blocked/owner decision.
- [ ] The complete scoped Git diff was reviewed, including untracked/modified
      target files, without reverting unrelated owner changes.
- [ ] Source-only checks found no merge markers, whitespace errors, stale
      imports/types, missing route/module wiring, missing translation keys,
      contract mismatch, inappropriate mapping, or accidental broad style.
- [ ] No prohibited build, TypeScript compilation, test, lint, browser,
      backend execution, database, migration, commit, push, or deployment
      command was run when the owner reserved verification.
- [ ] Final report lists changed files, frontend changes, contract/backend
      changes where applicable, risks, owner decisions, and manual acceptance
      scenarios.
- [ ] Handoff explicitly lists Angular build, TypeScript compilation, unit
      tests, browser QA, runtime visual comparison, API/backend execution, and
      database verification as completed or owner pending.
- [ ] `Complete` is used only when every applicable source item is implemented
      and the scoped diff is reviewed; owner runtime verification remains
      clearly pending when not performed.

### Required targeted-patch completion record

Append this abbreviated record to a targeted review/implementation handoff:

```markdown
## Targeted checklist result

- Mode: Review / Implementation
- Review depth: Targeted patch
- Requested issue/element: ...
- Target surface (Section 18.2 inventory): ...
- Section 17.0 completed: Yes/No
- Section 18.8 determinism checklist completed: Yes/No
- Directly applicable sections and canonical rule IDs checked: ...
- Affected contract slice: Verified / Not applicable / BACKEND_UNVERIFIED
- Out-of-scope serious findings reported: None / IDs
- Owner verification pending: build / TypeScript / tests / browser visual /
  API/backend / database (remove completed or non-applicable values)
- Targeted diff reviewed: Yes/No
- Completion status: Targeted source-complete / Review-only / Blocked
```

Do not add full-pass field counts, screen-shape inventories, or unrelated
contract decisions to this record.

### Required full-feature completion record

Append this record to a full feature review/implementation handoff:

```markdown
## Guide checklist result

- Mode: Review / Implementation
- Review depth: Full feature pass
- Create/View/Edit shape chosen and evidence: ...
- Screen shapes reviewed: Grid/List, Normal Form, Modal, Step Form, Report,
  Child Editor, Documents (remove non-applicable values)
- Surfaces in the Section 18.2 inventory: <count>, all reviewed: Yes/No
- Applicable checklist sections completed: 17.1, 17.2, ..., 18.8
- Not applicable sections and reasons: ...
- Confirmed findings implemented: <count>
- Remaining contract decisions: <count and IDs>
- Owner verification pending: build / TypeScript / tests / browser visual /
  API/backend / database (remove completed values)
- Scoped diff reviewed: Yes/No
- Completion status: Source-complete / Review-only / Blocked
```

## 18. Real feature anatomy and deterministic review sweep

Sections 1-17 define *what* is correct. This section defines *how* two
independent reviewers arrive at the same file set, the same surface list, the
same inspection order, and therefore the same findings. Apply it before the
Section 2 shape analysis and before opening any file.

All paths below are relative to `SiGmaAngularFrontEnd/src/app/modules`.

### 18.1 Canonical feature anatomy (`FEATURE-ANATOMY`)

A Sigma Angular feature root is a folder containing a routes file. Derive the
reviewed file set from this anatomy instead of judging what looks related:

| Slot | Path pattern | Present in |
|---|---|---|
| Routes | `<Feature>/<feature>.routes.ts` | Every feature root |
| List surface | `<Feature>/components/list/list.component.{ts,html,scss}` | Features with a grid |
| Editor surface | `<Feature>/components/details/details.component.{ts,html,scss}` | Features with Create/View/Edit |
| Child sections | `<Feature>/components/<detalisForm|detailsForm>/<section>/` | Step/grouped editors only |
| List/grid model | `<Feature>/models/list.ts` | Features with a grid |
| Write model | `<Feature>/models/create.ts` | Features with Create/Update |
| Detail model | `<Feature>/models/details.ts` | Features with a detail read |
| Feature service | `<Feature>/services/<feature>.service.ts` | Every feature root |
| Specs | `*.component.spec.ts` beside each component | Optional |

Confirmed examples of this exact anatomy: `Staff/Staff`, `Sales/Fleet`,
`Suppliers/Supplier`, `Fleet/Vehicle`, `Customers/Companies/CompanyPartner`.

A module folder is not a feature root. `Customers/Companies` contains four
sibling feature roots, so a request naming the module resolves to four separate
file sets. Ask which feature root is in scope, or scope to the one the request
actually describes, and apply `REF-PRECISION` plus the Section 3 non-reference
legacy sibling list before treating any sibling as evidence.

Shared dependencies are **not** part of the feature scope and must not be
edited unless the owner places them in scope. Record them as dependencies:

| Dependency | Real path |
|---|---|
| Grid component | `TableListComponent`, selector `table-list`, from the `ms-lib` package |
| Row action menu | `shared/components/action-button/action-button.component.ts` |
| Feature heading | `shared/components/feature-title/feature-title.component.ts` |
| Confirmation dialog | `shared/service/confirmation-dialog.service.ts` and `shared/components/confirmation-dialog/confirmation-dialog.component.ts` |
| Component base | `shared/service/base-component.service.ts` (supplies `loading`, `router`, `activatedRoute`, `subscriptionId`) |
| Service base | `shared/service/base-service.service.ts` |
| Response wrappers | `shared/models/result.ts` and `shared/models/results.ts` |
| Row action model | `shared/models/action-list.ts` |
| Excel export helper | `_metronic/layout/core/utilities` -> `onExportToExcel` |
| Auth interceptor | `shared/interceptores/token.interceptor.ts`, registered in `_metronic/layout/layout.module.ts` |
| Translations | `i18n/vocabs/*.ts` |
| Shared styles | `src/styles.scss` |

`table-list` comes from a compiled package, not from `src`. Its internals are
not reviewable source. Review only the feature's bindings to it and the
`tableList.dt` PrimeNG table it exposes. Never report a finding against
`table-list` internals.

Record this block before any finding:

```markdown
## Feature file set

- Feature root: ...
- Routes: ...
- Surfaces found: list / details / child sections (list actual folders)
- Models found: list.ts / create.ts / details.ts (list actual files)
- Service: ...
- Shared dependencies (out of scope): ...
- Anatomy deviations: none / list them
```

An anatomy deviation, such as a missing routes file or a model that holds two
slots at once, is recorded here and reviewed. It is not silently normalized.

### 18.2 Surface decomposition (`SHAPE-COMPOSITE`)

Section 2 assigns a shape to a *surface*, not to a feature root. A single
feature root frequently owns several surfaces, and a single component file
frequently owns more than one. Reviewing "the screen" as one shape is the most
common source of divergent reviews.

Before shape analysis, enumerate every surface:

1. Read the routes file. Every distinct `path` plus its `data.mode` is a
   surface, even when several paths share one component.
2. Read each component template top to bottom. Every region guarded by `@if`,
   `*ngIf`, `p-dialog`, a backdrop element, or a tab case is a surface.
3. Any inline dialog inside a list component is its own surface with its own
   shape, even though it lives in the list file.

Then assign one shape per surface and apply that shape's section:

| Surface kind | Shape | Governing sections |
|---|---|---|
| Route with a grid | Grid/list | 8, 17.5 |
| Route with `mode: create/view/edit` | Normal form or step form | 9 or 10, 17.6 or 17.7 |
| Inline dialog collecting input | Form dialog | 9.4, 18.4, 17.6 |
| Inline dialog only asking yes/no | Confirmation | `CONFIRM-SHARED`, 17.10 |
| Child collection editor | Grouped modal | 12, 17.8 |
| Route producing filtered output | Report | 13, 17.9 |

Record the decomposition:

```markdown
## Surface inventory

| # | Surface | Trigger | Shape | Sections | In scope |
|---|---|---|---|---|---|
| 1 | List grid | route `''` | Grid/list | 8, 17.5 | Yes |
| 2 | Salary revision dialog | `@if (reviseVisible())` in list template | Form dialog | 9.4, 18.4 | Yes |
| 3 | Create editor | route `create` | Step form | 10, 17.7 | Yes |
```

A full feature pass covers every surface in the inventory. A targeted patch
names the single surface it touches and marks the rest `Not reviewed - out of
requested scope`. Either way the inventory is complete, so scope is explicit
rather than accidental.

### 18.3 Fixed inspection order (`SWEEP-ORDER`)

Inspect in exactly this order. Do not start from the template, and do not start
from whichever file the request happens to mention.

1. `<feature>.routes.ts` - paths, `data.mode`, component reuse, deep links.
2. `models/list.ts` - list VM, filter type, query type.
3. `models/create.ts` - write payload types.
4. `models/details.ts` - detail read type.
5. `services/<feature>.service.ts` - every endpoint, verb, URL, params,
   wrapper, and the injector registration facts required by 18.6.
6. `components/list/list.component.ts` - signals, columns, actions, request
   flow, paging, export, dialog state.
7. `components/list/list.component.html` - DOM order, surfaces, bindings.
8. `components/list/list.component.scss` - only rules reachable from step 7.
9. `components/details/details.component.ts`, then `.html`, then `.scss`.
10. Child section folders, in template declaration order.
11. Translation keys referenced by steps 6-10, checked against `i18n/vocabs`.
12. Directly related backend contract files, per Section 7.

Steps 2-5 before steps 6-10 is mandatory. The contract must be known before the
behaviour is judged, otherwise a reviewer rationalises the payload from the
template instead of testing the template against the payload.

Skip a step only when the file does not exist, and record it as `Absent`.

### 18.4 Form dialog construction (`FORM-DIALOG`)

`CONFIRM-SHARED` covers yes/no interactions. It explicitly does not cover a
dialog that collects input, which leaves the construction of input dialogs
undefined and lets two reviewers reach opposite verdicts on the same code. This
subsection closes that gap.

Every input-collecting dialog inside a feature uses the approved PrimeNG
pattern demonstrated by the grouped-modal reference
`Customers/Companies/CompanyPartner/components/detalisForm/drivers`:

- `p-dialog` with `[modal]="true"`, `appendTo="body"`, a unique `styleClass`,
  `[draggable]="false"`, and a responsive `[style]`/`[breakpoints]` width;
- `DialogModule` imported by the standalone component;
- projected dropdown and calendar overlays also using `appendTo="body"` with a
  panel class, per `OVERLAY-SCOPE`;
- footer template holding Cancel and Save in approved order;
- reset of the draft form on close.

A hand-rolled dialog built from a plain backdrop element plus `role="dialog"`
is a confirmed finding, not a style preference, because it silently loses
behaviour the shared pattern provides. When you find one, verify and report
each of these consequences individually:

| Lost behaviour | What to check in the hand-rolled markup |
|---|---|
| Focus entry | Is focus moved into the dialog on open? |
| Focus trap | Can Tab leave the dialog into the list behind it? |
| Focus return | Does focus return to the row action that opened it? |
| Escape | Is there a keyboard handler closing the dialog? |
| Background inertness | Is the page behind still scrollable and clickable? |
| Overlay stacking | Are dropdown/calendar overlays clipped by the backdrop? |
| Theme and RTL | Do dark tokens and logical properties reach a non-appended node? |

Report the dialog as one finding with these consequences enumerated. Do not
raise seven unrelated findings, and do not reduce it to "uses custom markup".

The correct smallest safe fix is migration to `p-dialog` with the reference's
inputs, not incremental addition of a focus trap to bespoke markup.

### 18.5 Paging total and multi-page export

Two patterns recur across Sigma list components and must receive the same
verdict every time.

**`TOTAL-AUTHORITATIVE`.** Section 8.8 states the backend total is
authoritative. Some list components additionally reconstruct a total from
`totalPages` and `pageSize` when the total field is absent. That reconstruction
is a confirmed finding at Medium severity:

- it produces a fabricated total whenever the backend omits the field;
- `totalPages * pageSize` overstates the count on every partial last page;
- the fabricated value then drives paginator range text and navigation.

The smallest safe fix is to bind the paginator to the backend total field only,
treat an absent total as zero rows with a translated state, and raise the
missing total as a backend contract finding under Section 7. Do not keep a
defensive reconstruction because it looks harmless.

**`EXPORT-ATOMIC`.** Section 13.5 requires a multi-page export to fail on any
failed page. A gather loop built with `expand` plus `reduce` that stops
expanding on a failed page still emits the pages already accumulated, so the
user receives a silently truncated file. This is a confirmed High finding
because the exported result misrepresents the business data.

The smallest safe fix is to raise an error from the gather pipeline when a page
reports failure, so the export surfaces a translated error and produces no
file. Verify the loading state is released on that error path.

### 18.6 Permission and interceptor verdicts (`PERM-ARCH`)

Both checks below are frequently answered inconsistently. Resolve them by
inspection, in the stated order, and record the verdict verbatim.

**Permissions.** Section 17.2 requires permission enforcement on pages,
actions, and endpoints. Before writing any permission finding, establish what
the frontend actually has:

1. Search the route configuration for `canActivate`, `canMatch`, or a
   `CanActivateFn`. Search the plain string `canActivate` too — a guard class
   that omits `implements CanActivate` will not match the other patterns.
2. Search `shared` for a permission service, directive, or guard.
3. Search the reviewed feature for any permission predicate on its create
   action and row actions.

Verified state, 2026-08-06: `app-routing.module.ts` guards the whole layout with
`canActivate: [AuthGuard]`, and `modules/auth/services/auth.guard.ts` is an
**authentication** guard only — it checks `authService.currentUserValue` and logs
out when absent. There is no permission service, no permission directive, no
role or claim check in `auth.service.ts`, and no per-feature guard. Note the
guard class does not implement `CanActivate` explicitly, so a search for
`CanActivateFn` or `implements CanActivate` misses it; search for `canActivate`
instead.

So a reviewed feature has authentication but no frontend *authorization*
mechanism available to it. In that situation:

- record one architecture-level observation that frontend authorization is absent
  project-wide and is owned by the backend endpoint, while noting that
  authentication is covered by the layout-level `AuthGuard`;
- do **not** raise a separate finding for each unguarded button, row action, or
  route, and do not invent a permission API that does not exist;
- do confirm under Section 7 that the backend endpoint enforces authorization,
  and classify it `BACKEND_UNVERIFIED` when backend source is out of scope.

If a permission mechanism is found, the normal Section 17.2 requirements apply
in full and this relaxation does not.

**`AUTH-INTERCEPTOR` verdict.** The decorator alone does not settle the rule. A
feature service marked `providedIn: 'root'` is compliant when it is *also*
listed in the `LayoutModule` providers array, because components rendered
inside the layout then resolve the layout-scoped instance whose `HttpClient`
carries `tokenInterceptor`. Resolve it like this:

1. Read the service decorator.
2. Search `_metronic/layout/layout.module.ts` for the service class in its
   `providers` array.
3. Confirm the feature route is rendered within the layout.

| Decorator | Listed in `LayoutModule` providers | Verdict |
|---|---|---|
| `providedIn: 'root'` | Yes | `Reviewed - no finding`, record both facts |
| `providedIn: 'root'` | No | Confirmed finding: root instance can bypass the lazy interceptor |
| No `providedIn` | Yes | `Reviewed - no finding` |
| No `providedIn` | No | Confirmed finding: service is unresolvable or unscoped |

Record the verdict as `AUTH-INTERCEPTOR: <verdict> (decorator: ...,
LayoutModule providers: present/absent)`. Never conclude from the decorator by
itself.

### 18.7 Worked reference pass: `Staff/Staff`

This is the calibration example. Reviewing `Staff/Staff` with this guide must
reproduce the classifications below. If your pass diverges, the divergence is
in your application of the guide, not in the guide, unless the source has since
changed. Verify against current source before reusing any line of it.

**File set (18.1).** Anatomy complete: `staff.routes.ts`;
`components/list/*`; `components/details/*`; `models/list.ts`,
`models/create.ts`, `models/details.ts`; `services/staff.service.ts`. One
deviation: `models/branch.ts` holds a two-property lookup type that is not one
of the four canonical model slots. Record it; it is not a defect.

**Surface inventory (18.2).** Four surfaces, from one routes file and one list
template:

| # | Surface | Trigger | Shape |
|---|---|---|---|
| 1 | Staff list grid | route `''` | Grid/list |
| 2 | Salary revision dialog | `@if (reviseVisible())` in the list template | Form dialog |
| 3 | Delete confirmation | `confirmDelete` via shared service | Confirmation |
| 4 | Create/View/Edit editor | routes `create`, `view/:id`, `edit/:id`, `details/:id` | Editor, shape per Section 2 |

Surface 2 living inside the list file is exactly the case `SHAPE-COMPOSITE`
exists for. A reviewer who assigns only "grid/list" to this feature will miss
it.

**Endpoints (18.3 step 5).** `GET Staff` with `Filters[...]`, `pageNo`,
`pageSize`; `GET Staff/GetByWithNavigationsId/{id}`; `POST Staff`;
`PUT Staff`; `DELETE Staff?id=`; `GET Staff/{id}/SalaryPackage`;
`PUT Staff/{id}/SalaryPackage`.

**Reproducible verdicts.**

| Area | Verdict | Evidence |
|---|---|---|
| `CONFIRM-SHARED` | Reviewed - no finding | `confirmDelete` uses the shared service with severity, title, subtitle, message, warning, record context, and labels |
| `DATE-ONLY` | Reviewed - no finding | `toDateInput` extracts `yyyy-MM-dd` by regex and otherwise builds from local parts, avoiding UTC shift |
| `PAGER-SHARED` | Reviewed - no finding | Footer is owned by `table-list`; the feature configures `tableList.dt` lazily and converts `first`/`rows` to a one-based page once |
| `AUTH-INTERCEPTOR` | Reviewed - no finding | `providedIn: 'root'` **and** `StaffService` is present in the `LayoutModule` providers array |
| `PERM-ARCH` | Architecture observation | No route guard or shared permission mechanism exists project-wide; enforcement is backend-owned |
| List VM field `staffDesignationId` | `UNUSED` | Declared on `StaffDTO`, never read by the list component or template; only `staffDesignation` is projected to `designationLabel` |
| Revision `gross` | `SERVER_OWNED` | Computed client-side in `saveRevision` and sent in the payload; a total the client must not own |
| `TOTAL-AUTHORITATIVE` | Confirmed finding, Medium | `resolveTotalRecords` reconstructs a total from `totalPages * pageSize` when the backend total is absent |
| `EXPORT-ATOMIC` | Confirmed finding, High | `getAllList` uses `expand` and stops on `!page.isSuccess`, then `reduce` emits the pages already gathered as a complete file |
| `FORM-DIALOG` | Confirmed finding, Medium | Surface 2 is a hand-rolled `staff-modal-backdrop` with `role="dialog"`; no focus entry, trap, or return, and no Escape handler |

Findings for surfaces 1-3, using the Section 16 identifier format:

```text
FE-DATA-001    High    Multi-page Excel export can emit a partial file
FE-BEHAVIOR-001 Medium Paginator total reconstructed from page count
FE-A11Y-001    Medium  Salary revision dialog is hand-rolled, losing focus and Escape behaviour
FE-CONTRACT-001 Low    List VM carries an unused staffDesignationId field
FE-CONTRACT-002 Low    Client computes and submits the revision gross total
```

Severity rationale, so severities are reproducible rather than felt: the export
defect misrepresents business data and is therefore High under Section 1; the
total and the dialog affect paging correctness and accessibility behaviour and
are therefore Medium; the two contract items produce no incorrect persisted
data on their own and are therefore Low.

Surface 4, the editor, is a separate and considerably larger pass. Reviewing it
requires the Section 2 shape decision plus Sections 10 and 12, and it is
deliberately excluded from this calibration example. A full feature pass on
`Staff/Staff` must cover it and must not present these five findings as the
whole feature.

### 18.8 Determinism checklist

- [ ] The feature file set was derived from the 18.1 anatomy table and
      recorded, with deviations named.
- [ ] Shared dependencies were listed as out of scope and not edited.
- [ ] No finding was raised against `table-list` internals.
- [ ] The surface inventory is complete, including inline dialogs inside list
      or editor templates, and each surface has one shape and its sections.
- [ ] Files were inspected in the 18.3 order, with contract files before
      behaviour files, and absent files recorded as `Absent`.
- [ ] Every input-collecting dialog was checked against `FORM-DIALOG`, and a
      hand-rolled dialog was reported as one finding with enumerated
      consequences.
- [ ] The paginator total and any multi-page export were checked against
      `TOTAL-AUTHORITATIVE` and `EXPORT-ATOMIC`.
- [ ] Permission and interceptor verdicts were recorded in the `PERM-ARCH`
      format, from inspection rather than from the decorator or an assumed
      guard.
- [ ] Severities were justified against the Section 1 definitions rather than
      assigned by impression.
