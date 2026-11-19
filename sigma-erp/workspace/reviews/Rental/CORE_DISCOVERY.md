# Rental core discovery — Agreement, Booking, RentalQuotation, MasterAgreement

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Review boundary | Read-only discovery for live Rental `Agreement`, `Booking`, `RentalQuotation`, and `MasterAgreement` frontend roots; directly related .NET contracts inspected read-only |
| Governing plan | `F:/My Work/Sigma/reviews/RENTAL_MAINTENANCE_EVOLUTION_PLAN.md` (Frozen) |
| Authority | `AGENTS.md`, Master blocks 1/4/5/7, canonical UI blocks 1/3/4/6/8/13/14/15/16/22/23/24/25/27/28/30, backend blocks 3–10/13–15, and `sigma-screen-refactor/SKILL.md` |
| Packet state | Recipe `-Check`: `phase-01-domain-api` OK; PLAN-00 and PHASE-00, 02, 03, 04, 05, 06 stale. Canonical books govern; regeneration and semantic review remain pending. |
| Runtime status | Source-only. No build, test, lint, browser, database, migration, commit, push, or deployment command was run. |

## Scope and existing ownership

The live frontend roots are:

| Root | Routes and current shape | Source owner |
|---|---|---|
| `Rental/Agreement` | `/RentalAgreement`, `/create`, `/view/:id`, `/edit/:id`; paged list plus routed aggregate editor with charges, documents, and totals | `Agreement/components/list`, `Agreement/components/details`, child dialogs and `agreement.service.ts` |
| `Rental/Booking` | `/RentalBooking`, `/create`, `/view/:id`, `/edit/:id`; paged list plus routed aggregate editor with charges, documents, deposits, history and journal | `Booking/components/list`, `Booking/components/details`, child dialogs and `booking.service.ts` |
| `Rental/RentalQuotation` | `/RentalQuotation`, `/create`, `/view/:id`, `/edit/:id`; paged approval list plus routed aggregate editor with quotation items/totals; custom Master Agreement and rejection dialogs | `RentalQuotation/components/*`, `rentalquotation.service.ts` |
| `Rental/MasterAgreement` | `/MasterAgreement`, `/create`, `/view/:id`; paged list plus routed create/view component | `MasterAgreement/components/*`, `masteragreement.service.ts` |

The frozen plan also retires five unused CRUD roots (`BookingCharge`, `BookingNotificationFlags`, `RentalBookingNotification`, `RentalNotificationEvents`, and `RentalQuotationSettings`). They are outside this bounded workstream; live Booking/Agreement tariff and notification consumers remain authoritative. Root-owned `routing.ts`, `layout.module.ts`, toolbar, translations, and config are excluded from this workstream.

## Screen and backend shape decisions

| Feature | Canonical UI shape | Backend pattern | Decision evidence | Status |
|---|---|---|---|---|
| Agreement | Type 02 routed document editor; list uses shared list shell/grid; editor uses routed editor plus editable collection table and shared summary cards | Pattern 2/3 aggregate depending on receipt/deposit boundary; existing service owns tariff and journal effects | Agreement has multiple child/charge/document regions, totals, and state actions; current routes already expose list/create/view/edit | Confirmed |
| Booking | Type 02 routed document editor; shared list shell/grid; routed editor with tabs, child collections, deposits/journal and totals | Pattern 2/3 aggregate; `BookingService` calculates charges/tax and owns deposit journal path | Booking has charges, documents, deposits, status transitions and totals; current routes already expose list/create/view/edit | Confirmed |
| RentalQuotation | Type 02 routed document editor; shared list shell/grid; editable child collection and shared summary cards; reason dialog remains typed form dialog | Pattern 2 quotation aggregate/action lifecycle | Current editor has a child collection and totals; current backend saves and recalculates aggregate lines and exposes six explicit transitions | Confirmed; historical 2026 quotation artifact called it modal and is superseded for this review by current UI13 D4-2 |
| MasterAgreement list | Shared list shell/grid | Pattern 2/simple aggregate read | Paged server list with approval action and stable filters | Confirmed |
| MasterAgreement create/view | Shape decision is blocked for mutation; current routed form is source behavior | Pattern 2 | Current entity/API has `StartDate`, `EndDate`, `CustomerId`, optional `QuotationId`, `Notes`, approval and linked agreements. Historical screenshot contract asks for Date/PO No/Payment Terms. Do not invent a conversion. | Conflicting / Blocked |

## Confirmed frontend fixes

These are guide-confirmed presentation/integration fixes and do not require a domain or schema decision.

| Finding | Evidence | Files/workstream owner | Safe implementation boundary |
|---|---|---|---|
| Replace local list shells with the shared route/list shell | Agreement, Booking, RentalQuotation, and MasterAgreement list templates use feature page/panel classes; their SCSS owns page background, panel border/shadow, filter control colors, alerts, responsive margins, and dark-theme copies. List components have no `host: { class: 'sigma-route-host' }`; templates do not use `sigma-list-page`, `sigma-list-panel`, `sigma-list-header`, `sigma-list-table`, `sigma-alert`, or `form[appFilterPanel]`. Booking/Quotation explicitly use `overflow: visible`. | Four list `*.html`, `*.ts`, `*.scss` files | Adopt shared shell and `appFilterPanel`; keep feature-owned field order, widths, query assembly, actions and translations. Remove page/panel/filter/alert/table styling from feature SCSS; retain only public table variables and genuine feature cell/layout rules. Bind `[fill]="true"` to every live list `app-data-table`. |
| Replace hand-built list action/filter controls with shared owners | Each list duplicates secondary action CSS and local form grids. Agreement has three export/report buttons and reset/search inside a local action row; Booking/Quotation/MasterAgreement follow similar local patterns. | Four list templates/SCSS; shared filter and button components | Preserve action availability and handlers. Use the shared filter panel/reset output and shared secondary/primary action components. No change to API keys or action semantics. |
| Replace list export loops with shared full-result/export contracts | `BookingService.getAllList`, `RentalQuotationService.getAllList`, and `MasterAgreementService.getAllList` each copy an `expand`/`reduce` page loop. UI8 requires `fetchAllPages`. Agreement has a separate equivalent full export path. Booking, RentalQuotation, and MasterAgreement list components hand-map rows; Agreement hand-maps ordinary and detailed exports. | Four list components/services; `shared/utils/list-query` and `dataTableExportRows` are shared owners | Use the existing all-pages helper, fail on any page, preserve applied filters and server page-size clamp. For exports matching visible grid columns, call `dataTableExportRows` with click-time translations. Keep Agreement's separately named detailed export only if its column contract is explicitly different; document the difference. |
| Move aggregate editor shells to the canonical routed editor chain | Agreement and Booking templates begin with local `<section>`/card shells and local feature title/footer; RentalQuotation does the same. Their SCSS owns route sizing, custom card/header/footer, multiple feature palettes, responsive overflow, and in places page-height/inset behavior. No editor uses the shared routed `sigma-editor-form` → `sigma-editor-body` → `sigma-editor-scroll` chain or the canonical page footer. | Agreement/Booking/RentalQuotation details templates, components, and SCSS | Preserve current forms, tabs, child IDs, save/dirty-close guards, print output and API payloads. Use shared editor/form sections, collection table, editor footer and one internal scroll owner. Do not reimplement the shared shell in feature SCSS. |
| Replace local totals/KPI cards with `app-summary-cards` | Agreement, Booking, and RentalQuotation render feature-local total card markup (`agreement-total-card`, `booking-total-card`, `quotation-metric`/`grand-total`). UI24 requires one typed `SummaryCard[]` owner; server totals and current formulas remain unchanged. | Three detail templates/components/SCSS | Pass only authoritative display values/labels and public summary density/layout/min width/height. Do not move calculation ownership to the client or alter money formatting/DrCr semantics. |
| Adopt shared numeric/quantity controls and numeric focus contract | Agreement, Booking and RentalQuotation templates contain native numeric inputs and custom charge inputs; e.g. Booking `details.component.html` has `type="number"` discount/tax and charge amount fields. Existing code calculates previews with local numeric formulas. UI27/UI14 require application numeric replacement focus and `p-inputNumber appQuantityInput` for editable Quantity/Qty roles; shared numeric read text owns centered blue highlight. | Three details components/templates; shared numeric/quantity owners | Classify each input by role first. Migrate editable quantity controls and reviewed numeric read cells; preserve min/max/step, validators, formulas and payload nullability. Tax rate and totals remain server-authoritative. |
| Consolidate composed read-error formatting where the reviewed screen opts out of the interceptor | RentalQuotation and MasterAgreement services send `X-Skip-Error-Interceptor`; their components own repeated `errorMessageFrom` helpers. Agreement/Booking also repeat feature extractors. UI22 and the 2026-10-06 shared `composedReadErrorMessage` rule require one failure owner and consistent Result/HTTP formatting. | List/detail component error helpers and service headers | Preserve intentional skip-header behavior and exactly one message owner. Use the shared formatter for read/export/options paths; keep mutation-specific messages and existing retry/inline state contracts. |

## Current frozen frontend contracts

### List/grid and ListVM alignment

The backend ListVMs contain the displayed fields plus identity/action state. `RentalAgreementListVM` inherits `Id`, `No`, and `CreatedBy` from `ListBaseVm`; its service projection also supplies the displayed status and action flags. The frontend models mirror the JSON names. No ListVM reduction is authorized in this discovery.

| Feature | Exact grid order after the shared Actions column | Backend ListVM / action state | Contract |
|---|---|---|---|
| Agreement | `no`, `status`, `poNo`, `type`, `vehicleType`, `vehiclePlateNo`, `makeAndModel`, `notes`, `customerType`, `customer`, `customerCode`, `driver`, `dateAndTime`, `returnDateAndTime`, `rate`, `branch`, `salesPerson`, `saleOrigin`, `createdBy`, `totalCharges`, `advance`, `deposit` | `RentalAgreementListVM` matching fields, inherited `Id`/`No`/`CreatedBy`, `CanEdit`, `CanDelete`, `CanUnclose`, `CanVoid` | Confirmed source match |
| Booking | `no`, `plateNo`, `vehicleType`, `pickUp`, `pickUpLocation`, `makeAndModel`, `customer`, `customerCode`, `createdBy`, `salesPerson`, `saleOrigin`, `status` | `BookingListVM` matching fields, `Id`, `CanEdit`, `CanDelete`, `CanConfirm`, `CanCancel`, `CanNoShow`, `CanAddDeposit`, `HasJournal` | Confirmed source match |
| RentalQuotation | `no`, `date`, `customerName`, `customerCode`, `amount`, `internalApproval`, `customerApproval` | `RentalQuotationListVM` matching fields, `Id`, and `CanEdit`, `CanDelete`, `CanApproveInternally`, `CanRejectInternally`, `CanApproveByCustomer`, `CanRejectByCustomer`, `CanRevise`, `CanUnapprove`, `CanCreateMasterAgreement` | Confirmed source match |
| MasterAgreement | `masterAgreementNo` template over `no`, `date`, `customerName`, `customerCode`, `quotationNo`, `approvalStatus` | `RentalMasterAgreementListVM` inherits `Id`/`No`, plus `Date`, `ApprovalStatus`, `CustomerName`, `CustomerCode`, `QuotationNo` | Confirmed source match; frontend display alias is feature-owned |

All four backend list services clamp page sizes, count before paging, and use stable `Id` tie-breakers in source. The frontend query serializers use `PageNo`/`PageSize` plus `Filters[sortField]`, `Filters[sortOrder]`, and feature filter keys. RentalQuotation and MasterAgreement use lowercase `pageNo`/`pageSize`; ASP.NET binding currently accepts them and backend reads the same `ListSmBase` shape. Preserve casing until an explicit shared contract change is frozen.

### Filters

| Feature | Angular controls and serialized keys | Backend evidence |
|---|---|---|
| Agreement | Agreement/manual/PO/master number, plate, branch, customer, type/status, date range (`fromDate`/`toDate`), createdBy, sales person, sale origin, project, ownership, complimentary, permanent, overdue closing, checked-in; exact keys are in `Agreement/models/list.ts` and service serializer | `RentalAgreementService.GetManyAsync` reads the same keys with `FilterHelper`, including date and boolean behavior |
| Booking | booking no, plate, type, date field/range, status, customer, createdBy, salesperson, sale origin, branch | `BookingService.GetManyAsync` reads the matching `FilterHelper` keys and applies status/date semantics |
| RentalQuotation | quotation no, customer, branch, date range, internal/customer approval | `RentalQuotationService.GetManyAsync` reads matching keys and validates enum states |
| MasterAgreement | agreement no, approval status, quotation ref no, date range, customer | `RentalMasterAgreementService.GetManyWithNavigationsAsync` reads matching keys and validates approval enum |

Reset must remain present. Date filters must use the shared date/range helpers and retain local calendar semantics; no API `toISOString()` or feature parser should be introduced.

### Detail/write contracts

| Aggregate | Detail data | Client editable inputs | Server-owned/derived values |
|---|---|---|---|
| Agreement | Header references, dates, selected vehicle/driver/customer, charges, documents and current action state | Current typed Agreement form and child snapshots; discount, advance, deposit, notes, selected charges | Number, status, tariff charge totals, resolved tax rate and `TotalCharges`; `RentalAgreementService.ValidateAndCalculateAsync` resolves tax and persists authoritative totals |
| Booking | Header schedule/references, charges, documents, deposit summary and action state | Current typed Booking form and full charge/document snapshots; discount, advance, deposit, notes | Status, total days/hours, charge totals, resolved tax and `TotalCharges`; `BookingService.ValidateAndCalculateAsync` recalculates |
| RentalQuotation | Header/customer/contact/branch, line details, persisted `Total`, `GrandTotal`, approvals | Date/type/customer/contact/branch, notes, discount, full line snapshot | Number, totals, approval axes/reasons/action flags; `RentalQuotationService` recalculates and checks totals |
| MasterAgreement | Start/end, approval, customer, quotation, notes and linked agreement display | Current Add VM fields only (`StartDate`, `EndDate`, `CustomerId`, `QuotationId`, `Notes`) | Number, approval, linked children and audit; `ApproveAsync` owns transition |

The frontend preview formulas are usability-only. They must never replace the backend response or add total/tax/approval fields to write payloads. Existing Add/Update VMs accept `TaxPercent` for Agreement/Booking, and services call `ResolveTaxRateAsync`; tax-rate editability remains a backend contract detail and should not be broadened during shell refactoring.

## Backend evidence and material blockers

| Contract | Evidence | Result |
|---|---|---|
| Agreement API | `RentalAgreementController` inherits generic CRUD and adds documents, discounts, deposit, unclose, void, billing history, delivery-date, salesperson and logs. `RentalAgreementService` projects paged ListVMs, clamps pages, validates filters, recalculates tariff/tax/total and exposes action flags. | API is sufficient for frontend refactor; no backend edit is confirmed in this slice. |
| Booking API | `BookingController` inherits CRUD and adds confirm/cancel/no-show/deposit/options/history/journal/report. `BookingService` calculates charges/tax/totals and projects action flags including deposit/journal state. | API is sufficient; no backend edit confirmed. |
| RentalQuotation API | Controller exposes six explicit approval/revision routes. `RentalQuotationService` overrides aggregate Add/Update/Delete/detail/list and recalculates lines/totals, validates action source states, and projects all action flags. | Existing lifecycle is frozen; retain action matrix and no Sales-only receipt behavior. |
| MasterAgreement API | Controller overrides paged navigation list and exposes `POST /{id}/approve`; service Add/Update/Delete/list/detail exists. Add requires valid date order and a quotation. | Current API is internally coherent but conflicts with historical screenshot creation fields. Master Agreement mutation redesign remains blocked. |
| Mapping | Rental Agreement/Booking/Quotation/MasterAgreement profiler files explicitly map detail/list fields and ignore/recompute calculated/action fields where applicable. | Keep existing AutoMapper decisions; do not add blanket `Ignore()` or `ReverseMap()`. |
| Transactions | Agreement/Booking/Quotation services calculate and save tracked aggregates; quotation and agreement action paths contain domain-specific state/dependency checks. | Do not add transaction or schema work based on UI findings alone; owner must review any financial path separately. |

Material blocked contracts are limited to the MasterAgreement workflow shape (current Start/End/Quotation vs historical Date/PO/Payment Terms), any change to RentalQuotation's existing master-agreement handoff, and any tax/discount ownership change. These require an explicit frozen contract or the existing owner decision; reviewer assumptions cannot invent persisted fields, numbering, accounting effects, or transitions.

## Conformance evidence before implementation

| Concern | Canonical block | Approved reference/shared owner | Current target evidence | Disposition |
|---|---|---|---|---|
| List shell/scroll | UI1/3/6 | Workshop/Job list; shared styles/DataTable | Four local page/panel classes, local styles, no `sigma-route-host`; Booking/Quotation panel `overflow: visible`; no `[fill]` found on list tables | Confirmed fix |
| Filter strip/reset | UI4/17 | `form[appFilterPanel]`, shared filter panel/date helpers | Four local grids and action rows; filters are typed and API keys are usable | Migrate shell, retain keys |
| Export | UI8 | `fetchAllPages`, `dataTableExportRows` | Three feature `expand` loops and hand mappers; Agreement has hand-mapped basic/detailed exports | Confirmed adapter fix; detailed Agreement export requires preserving its distinct contract |
| Routed editor | UI13/14/15 | Workshop/Job editor; shared form/collection/table | Agreement, Booking, RentalQuotation local cards/headers/footers and custom overflow; child collection/totals prove routed shape | Confirmed shell fix |
| Summary totals | UI24 | `app-summary-cards` | Feature-local total card markup in all three aggregate editors | Confirmed shared extraction |
| Errors/loading/stale reads | UI22/28 | shared formatter, interceptor boundary, stale request sequence | Both failure channels generally exist; RentalQuotation/MasterAgreement opt out and own formatting; Agreement/Booking have local extractors; RentalQuotation list lacks a request sequence guard while `switchMap` cancels subscription | Consolidate formatter; preserve skip-header owners; review stale result behavior in implementation |
| Numeric input/focus | UI14/27 | GlobalNumericFocusService, QuantityInputDirective, shared numeric value | Native/custom numeric fields and feature number styles remain in Agreement/Booking/Quotation | Confirmed role-by-role adoption |
| RTL/dark/theme | UI25 | shared tokens and logical properties | Local feature palettes, raw colors and per-feature dark blocks are widespread; some use deprecated/unguaranteed fallbacks | Remove shell/theme copies; retain semantic child styles only where shared owner has no capability |

## Proposed implementation ownership

| Workstream | Files owned | Deliverable |
|---|---|---|
| Agreement list | `Rental/Agreement/components/list/{list.component.ts,html,scss}`, `Rental/Agreement/services/agreement.service.ts` | Shared list/filter shell, `[fill]`, export helper/all-pages adapter; preserve 23 displayed columns and Agreement-specific detailed export |
| Booking list/editor | `Rental/Booking/components/list/*`, `Booking/components/details/*`, `Booking/services/booking.service.ts` | Shared list/export adapters and routed editor shell; preserve charge/document/deposit/journal contracts |
| RentalQuotation list/editor/dialogs | `RentalQuotation/components/list/*`, `details/*`, `master-agreement-dialog/*`, `rejection-dialog/*`, `services/rentalquotation.service.ts` | Shared list/export adapters, routed aggregate editor, shared EditorDialog for typed rejection/master handoff only within current fields; preserve approval matrix |
| MasterAgreement list | `MasterAgreement/components/list/*`, `MasterAgreement/services/masteragreement.service.ts` | Shared list/export adapters and shell; no mutation shape redesign until blocked contract is resolved |
| MasterAgreement create/view | `MasterAgreement/components/create/*` | Only shell/accessibility cleanup that preserves current fields. Any Date/PO/Payment Terms redesign remains blocked. |
| Root-owned integration | `src/app/pages/routing.ts`, `layout.module.ts`, toolbar, translations/config | Root agent owns route/provider/key/config changes; this workstream supplies requested exact symbols/keys only. |

No source files were edited by this discovery agent. The artifact itself is the only new file. Owner build, runtime, browser, RTL, dark-theme, print, database, and migration verification remain pending.

