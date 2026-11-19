# Sales Cycle Completion — 2026-10-04

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | راجع على src\app\modules\Sales وعدل كل المطلوب عشان الدورة تشتغل بشكل كامل وايه العوائق اللى ممكن تعطلها; وظبط Cycle الخاصة ب sales agreement |
| Authorization | Review and implement confirmed Sales fixes; SalesAgreement cycle is the priority |
| Scope | FE SalesQuotation, SalesAgreement, Fleet, DueInstallments, direct Receipt consumer; owning BE Equipment, quotations, agreements, receipts/invoice dependencies and DTOs/configuration. Preserve unrelated dirty Workshop/Fleet vehicle changes |
| Frozen baseline | SALES_CYCLE_CONTRACT_FREEZE.md; SALES_REVIEW_FIXES_CONTRACT_FREEZE.md Sections1–6; subsequent quotation action/navigation amendments in SALES_FEATURE_REVIEW.md. No accounting/state/schema contract invented |
| Sources | Canonical AGENTS.md, Master4/5/7, UI shape catalog and applicable owning blocks, BE14/15/17, required sigma-screen-refactor skill |
| Recipe check | PHASE01/03/04 stale, other five OK. Use canonical sources; no derivative edits |
| Evidence | Current source, scoped diffs and owner's reported failures; no new screenshot/video. Existing migration files now include SalesConcurrencyTokens; database application status Unknown, no migration/snapshot execution or edits |

## Frozen implementation decisions

- Keep quotation Pending→InternallyApproved→CustomerApproved→Converted with existing reject/revise/unapprove guards; Open Agreement creates only from a valid CustomerApproved offer and views the persisted existing agreement otherwise.
- Agreement Open→Invoiced→Delivered→Closed. Cancel/Delete only Open without live collections; restore quotation and release units. Invoice validates positive costs, active/reserved owned units, account mapping and open period; creates the confirmed miscellaneous invoice and atomic posted balanced JV. Delivery creates sales-specific notes. Close requires zero outstanding; accepted receipt reversal restores Delivered.
- Preserve F1 shared tenant sales lock and state/cost concurrency predicates, F3 saved tax rate, F7/F10 installment rounding/order, F8 receipt-owned/quotation-owned locked terms, and F13 per-line quotation VAT compatibility. Fix concrete inconsistencies within those contracts.
- All totals/status/tenant/number remain backend-owned; write DTOs contain editable inputs with full child snapshots. List/detail navigation fields remain minimum typed read metadata; no permission mechanism invented.
- UI shapes: Quotation/Agreement type02 routed aggregate with shared editor/header/rows/feedback; invoice BE15 accounting specialization. Sales Fleet has Documents+Warranties and therefore uses canonical type02 routed modes. Due remains a frozen server-paged BE17/UI20 report (full-filtered totals and complete export/print scope), using report hosts rather than a CRUD shell. Shared components own appearance/controls/RTL/theme/internal scroll.
- Reconcile every supported reference action to its existing backend interface/controller/request/state and visible UI. Extend only an existing owner; do not create parallel engines or change missing accounting policy.
- No builds/tests/lint/browser/runtime/database/migrations/snapshot writes/commits/push/deployment/Graphify/Sigma MCP. Source syntax/diff/contract checks only; operational acceptance remains owner-pending.

## Work ownership

Root owns backend agreement/quotation/receipt lifecycle, cross-layer decisions, wiring integration and final evidence. Bounded independent frontend work may proceed after the Frozen contracts above: quotation/agreement controls/actions; Sales Fleet editor; Due report presentation. Each worker preserves user/peer edits and reports verified changes and residual blockers; root reconciles the complete scoped result.

Implementation and final source reconciliation follow. Operational acceptance is still pending.

## Confirmed implementation slice — agreement lifecycle

| Finding | Frozen correction and evidence |
|---|---|
| Invoice accepts units that became inactive, unreserved, incomplete or out on rental since agreement save | Recheck the already-frozen unit eligibility at Invoice; require one live Reserved unit per owned item and unchanged model/chassis snapshot. Equipment writes take Sales→Equipment locks so reservation/invoice cannot race Equipment mutations. No new accounting policy or schema. |
| Deliver silently emits a note with a missing unit | Require a live linked Sales invoice and its posted, nonvoid journal, valid delivery date, every Sold unit, no earlier live sales notes; then mutate the complete aggregate. |
| Invoice saves ignore rejected write results | Return localized failure and allow the owning Sales-lock transaction to roll back; validate open period before adding the invoice. Positive costs must remain positive at currency precision. |
| QueryReport owning convention | Due uses QueryReport for its three read-only source sets, with existing filters/allocations unchanged. |
| Quotation receipt equality uses fixed 2-decimal rounding | Use the existing resolver's base-currency precision. Existing live quotation receipt can retain its amount while agreement Closed; unvoid/new collection still checks collection state. |
| UI action availability | Agreement View uses the same shared ActionButton and typed lifecycle dialogs as list; reload after accepted mutation. Keep invoice/receipt navigation and delivery rows/print; no nonexistent delivery-note route. |

Fleet worker confirmed CustomerDocuments is the canonical new-upload folder accepted by Media/FileStore; preserve all historical paths. Fleet type02 reference and Due UI20 report conformance remain required. Agreement preview obtains currency precision from the existing FinancialNumberPolicy read owner; quotation preview retains its existing backend two-place per-line calculation. Backend saved results always prevail.

### Direct rental writer dependency (Frozen)

The DeliveryNote API writes the Equipment-rental availability fact used by SalesAgreement.Prepare/Invoice, but previously inherited Add/Update without a sales-state guard or shared lock. Add/Update now take the same SalesAgreement lock and reject opening/reopening an unreturned equipment delivery for an inactive or Reserved/Sold/Delivered unit. Existing returned/history edits retain generic behavior. This enforces the already-frozen free-stock invariant at both writers; it introduces no rental workflow, permission or accounting change.

Frontend preview precision uses the verified existing `FinancialNumberPolicyService.load` → `Currency/GetFinancialNumberPolicy` → `currencyDecimalPlaces`; no new endpoint/DTO. Shared MoneyPipe/grid display still follows the approved two-place formatter, which remains a presentation limitation for other base-currency precisions.

## Reconciliation refinements and implementation evidence

These are source-supported corrections within the existing cycle, not a new accounting engine or a change to posted historical amounts.

| Concern | Decision and final producer/consumer evidence |
|---|---|
| Mixed quotation VAT | `PrepareAsync` refuses a quotation with distinct line tax rates with `SalesAgreementQuotationTaxMismatch`. Agreement/invoice expose one snapshot `TaxPercent`; taking the first rate silently reprices other lines. Keep quotation's F13 per-line VAT compatibility; multi-rate agreement support requires a separately approved domain/schema design. |
| Fully prepaid quotation | Quotation requires a positive nominal installment count, but Agreement `ValidateFinancials` requires zero when nothing remains. `EffectiveInstallments`/Prepare and FE `applyQuotation` normalize a zero-balance quotation to zero installments. Keep the down-payment row, amounts and quotation itself unchanged. |
| Long quotation terms | Quotation accepts 10000 characters; Agreement DTO/EF permit 2000. Prepare now checks the effective quotation-owned terms and returns `SalesAgreementTermsTooLong`, instead of a database truncation failure. No silent truncation or schema expansion. |
| Schedule inputs | Prepare validates count 0–120, known generated serials, duplicate serials, default override dates and representable monthly date range. Domain BuildSchedule returns early for count zero. FE preview caps rendered count at 120 while original invalid input remains subject to validation. Dates/cheques/bank remain the only client-editable schedule metadata; amounts stay generated by the domain. |
| Positive prices | Require each price to remain positive after currency rounding, rather than accepting a positive input that rounds to a free unit. Invoice applies the same check to purchase costs. |
| Collection reversal | Receipt Update reads previous links under the sales lock; accepted reduction/relink/deletion/void re-evaluates both affected balances. A Closed agreement with a restored balance becomes Delivered. A failed reopen save causes transaction rollback; unvoid/new receipts still recheck status and outstanding. Existing quotation receipt can keep its amount while Closed; exact down-payment equality still applies. |
| Fleet editor | Routed Create/Edit/View with shared header, tabs, typed child arrays, fixed footer and one form scroll owner. Retain make/model creation in small typed dialogs; their mutation failures use interceptor feedback and lookup reload failures use inline feedback. Routes preserve filters/page/sort. Documents use shared row validation/payloads, FileField/FileLink and DocumentUploadTracker, including cleanup-only Retry. Required document number/dates now match the existing API annotations. |
| Dates and action races | Fleet uses structured manual date entry and shared parse/transport/validation, not feature Date parsing. Quotation/Agreement list date ranges validate before Search. Pending confirmations and mutations disable competing actions; backend state guards remain authoritative. |
| Complete report output | Fleet and Due use `fetchAllPages` and translated `dataTableExportRows`; a failed page aborts output. Print sessions temporarily supply every filtered row to the same shared DataTable, with scrolling/paginator disabled, and release every bounded host via sigma-print-flow. Restore the screen dataset after print. No native duplicate print table. |

New localized BE keys are present in both GeneralMessage resources: SalesAgreementQuotationTaxMismatch, SalesAgreementScheduleInvalid, SalesAgreementTermsTooLong.

## Grid/read contracts

| Screen | Displayed columns (order) | List/read properties and minimum action metadata | Filters / paging / output |
|---|---|---|---|
| Quotation | No, Date, Valid Until, Customer, Customer Code, Amount, Status | Id plus No, Date, ValidUntil, CustomerName, CustomerCode, Amount, Status; nullable SalesAgreementId for navigation. FE and BE match. | no/dateFrom/dateTo/customerId/status; existing sort whitelist and server paging, clamped response page; export all applied-filter pages. UnApprove is CustomerApproved only; an existing agreement link opens even after conversion/expiry. |
| Agreement | No, Date, Customer, Customer Code, Total Charges, Outstanding, Status | Id plus No, Date, CustomerName, CustomerCode, TotalCharges, OutstandingAmount, Status. No child/audit/unused fields added. | no/dateFrom/dateTo/customerId/status; existing sort whitelist, server paging and all-filtered export. Outstanding computed from live direct and quotation receipts. |
| Sales Fleet | Plate, Make, Model, Vehicle Type, Interior Color, Active Status, Sale Status, Branch, Chassis, Engine No, Purchase Date, Purchase Cost | Id plus PlateNo, Make, Model, VehicleType, InteriorColor, IsActive, SaleStatus, Branch, ChassisNo, EngineNo, PurchaseDate, PurchaseCost. Removed list-only EngineCapacity/FuelTankCapacity; editor fields retained. | plateNo/chassisNo/carModelId/isActive/saleStatus; advanced interiorColor/vehicleTypeId/branchId; typed whitelist sort, SQL paging/clamp; all-filtered print/Excel. |
| Due Installments | Agreement No, Customer, Plate, Serial, Type, Due Date, Amount, Paid, Remaining, Status, Overdue Days, Cheque, Bank | PaymentId/AgreementId identity plus AgreementNo, CustomerName, PlateNo, SrNo, Type, DueDate, Amount, PaidAmount, RemainingAmount, Status, OverdueDays, ChequeNo, BankName. Report envelope contains full-filtered totals/count and page metadata. | required fromDate/toDate, customerId/agreementNo/includePaid; frozen direct query parameters, sort whitelist and server paging 1–100. SQL totals/count cover all filtered rows; print/Excel fetch all pages of the applied query. |

## Detail/write, action and integration contracts

- Preserve the frozen editable Add/Update contracts; omit tenant, status, numbering, calculated tax/totals, received/outstanding and schedule amounts. Reconcile owned child identities at the service boundary. Financial inputs lock after live collection; quotation-owned customer/terms/prices/down payment/count remain locked.
- Agreement View and list share the state helpers: Invoice in Open; Receipt in Open/Invoiced/Delivered while outstanding; Deliver in Invoiced; Close in Delivered with zero outstanding; Cancel/Delete in Open with no live direct agreement receipts. Typed date/reason workflows use existing dialogs; confirmation-only operations use ConfirmationDialogService. Success reloads server state. These controls express workflow, not authorization.
- Invoice creates the existing Sales MiscellaneousInvoice, then balanced posted journal and Sold/inactive units in the owning transaction. Deliver requires that live posted invoice/JV and all Sold units, creates one SalesDeliveryNote per unit, then Delivered. Close and accepted reversals preserve the frozen state machine.
- Direct Receipt embedded consumer still receives salesAgreementId/agreementNo (or salesQuotationId for quotation down payment); its saved/closed events reload the owner. Existing invoice/receipt view routes remain the navigable records. SalesDeliveryNote has no invented standalone route; view/print it from Agreement.
- Existing lazy feature routes Fleet, SalesQuotation, SalesAgreement, DueInstallments are retained. Create/Edit/View compatibility paths have typed modes and editor exit guards. Fleet list now navigates to its routed editor; no embedded editor remains on that list. Service/DI/controller interfaces remain unchanged; no new permission/provider engine.
- Existing AuthGuard protects entry; the application has no permission API. No permission contract invented.
- AutoMapper: explicit Ignore only for Quotation.SalesAgreementId, selected from live tenant agreements by the owning read service. Preserve aggregate child mapping and ordinary projection profiles; no ReverseMap added.

## Reference conformance reconciliation

Reference reads and canonical selection preceded implementation. Paths below are relative to the frontend repo unless stated otherwise; source conformance does not constitute visual/runtime acceptance.

| Concern | Owning book / approved reference symbol | Shared owner | Final target / comparison |
|---|---|---|---|
| List shell and bounds | UI1/3/6; Workshop/Job/components/list template and host | styles.scss sigma-route-host/list-page/list-panel/list-table; FeatureTitle | Three Sales lists use the same container-fill, fixed title/filter and grid-fill chain; feature list palette/frame SCSS removed. Shared 8px inset and 34px controls remain owned by shared styles. |
| Routed aggregate | UI13/14; Workshop/Job/components/editor template/form chain | sigma-editor-page/panel/form/body/scroll/footer, EditorTabs | Quote/Agreement/Fleet routed modes; Fleet now has the same clipped flex chain with one form scroll and fixed action footer, shared workspace tabs. Three-pane Workshop preference was not copied to Sales. |
| Repeated rows | UI14/19; Job editor and Customers/Individual document rows | EditableCollectionTable, EditableRows, FieldError | Existing form arrays are authoritative; shared add/focus/identity-based confirmation/removal. Fleet Documents/Warranties metadata retained, required markers match current API; no local table/card appearance. |
| Documents | UI18 G5; Customer document consumer and Media/FileStore source | FileField/FileLink, createDocumentRow/documentPayload, DocumentUploadTracker | Fleet new folder CustomerDocuments; historical paths retained; save/discard cleanup and retry preserve input and never repeat accepted save. Agreement shares tracker with its existing path-list DTO. |
| Summary size | UI14/24 plus owner's compact master-detail preference | SummaryCards | Quote and Agreement use slim/row/min140/max80; values remain backend-owned in View. No feature card internals or new formula. |
| Filters/date/feedback | UI4/17/19/22/28; Job list | FilterPanel, DatePicker, FieldError, apiErrorMessage, shared confirmation and HTTP interceptor | Stable Quotation/Agreement filters; invalid range retains applied search; Fleet structured date and document dates; reads inline with Retry, mutations interceptor-owned; switchMap keeps latest read and finalize balances loader. |
| Report shell/print | BE17/UI20/21; Accounts/TrailBalance list, report semantics Customers/StatementOfAccount | ReportPage/ReportActions, sigma-report-panel/filter strip, DataTable, fetchAllPages, ReportPrintSession | Due uses UI20 report shell, not CRUD panel. Frozen server-paged response retained; existing sigma-list-table reused solely as shared flex grid region, not as a list shell. Explicit print release and scrollable=false render complete rows. Fleet print also uses shared grid. |
| Backend aggregate/action | BE14/15; PurchaseOrderService aggregate and InvoiceService posting | existing UOW/tenant repository/numbering/resolver/posting/lock | Preserve inherited generic operations where adequate; feature overrides only owned projection, child reconciliation and lifecycle/eligibility. No new accounting module, new class inside service, migrations or snapshot changes. |

Compatibility deviations/limits: quotation retains existing per-line two-place VAT (F13), while agreement invoice uses one document snapshot rate and currency policy. Differences in rounding can still affect edge-case conversion totals; owner accounting acceptance is required. Due keeps its frozen paged response instead of changing API to an unpaged report. Make/model mini dialogs remain small action forms inside the routed Fleet editor. No shared-owner redesign was needed this round.

## Remaining operational blockers and constraints

| Blocker/constraint | Effect / owner resolution |
|---|---|
| Database schema application Unknown | Existing owner files 20261004014650_SalesCycleCompletion and 20261004061905_SalesConcurrencyTokens are present. Review/apply the intended migrations and verify database state before accepting the cycle. This round adds no schema; do not create a duplicate migration from this report. No migration/snapshot was created, modified or executed by this continuation. |
| Missing/invalid account mappings or closed period | Invoice/receipt posting cannot succeed without the existing customer AR, sales revenue, VAT (when applicable), cost-of-sales and stock leaf mappings and an open posting period. Configure/verify them; backend refuses partial posting. |
| Unit eligibility / carrying cost | Missing model/chassis, duplicate/unavailable/inactive units, open rental delivery, or purchase cost that is not positive at money precision blocks invoice. Correct Fleet facts before invoicing. If a Reserved unit's identity changed, review/update the Open agreement snapshot. Backend refuses stale snapshot invoice. |
| Quotation approval/expiry/ownership | Create from an approved valid live quotation, with matching models/quantities and no other live agreement. UnApprove refuses linked agreement/collection; this is a business guard, not a missing button. Existing agreement still opens after conversion/expiry. |
| Mixed VAT or excessive quotation terms | Multi-rate quotations cannot be represented by the current single-rate agreement; source now fails clearly. Terms over 2000 cannot fit the current agreement. Review quote terms/rates before conversion; supporting them without limits needs a separate approved contract/schema change. |
| Per-line versus document rounding | Even with one rate, quotation tax sums rounded lines, agreement tax rounds the document. The frozen compatibility choice remains; assess small-value/full-prepayment boundary examples before production. Never silently overwrite an existing collection or accounting amount. |
| Money precision beyond 2 | Agreement calculations/preview use currency policy, while quotation and existing shared display are two-place and existing persisted money columns are precision(18,2). Non-two-place deployments need a separately approved schema/presentation precision review; this round does not claim to solve it. |
| Outstanding collection | Close is unavailable until delivered and fully collected. Voided/deleted/reduced linked collection may reopen Closed to Delivered. Receipt allocation rules may block reversal until allocations are dealt with by the existing voucher workflow. |
| SQL translation/concurrency not executed | Due joined allocation aggregates, lock ordering, token conflicts, numbering/rollback and cross-service races require runtime checks against SQL Server. Syntax/source review cannot prove those behaviors. |
| Output consistency while data changes | Complete output fetches paged reads; it is not an atomic historical snapshot. Check full output on stable data and compare totals/rows; live concurrent changes can change page membership. |
| Documents/media | Media upload/read/delete availability and cleanup retry must be exercised; local source checks do not prove external file availability or historical path accessibility. |
| Documentation drift | Regenerate and semantically review PHASE01/03/04 packets from canonical books. Generated packets were not edited. |

## Source verification and handoff

- Phases 0–6 applied in the authorized Sales scope: discovery/frozen contract, read/grid, detail/write, conditional lifecycle actions, integration and final reconciliation. Schema execution, builds/tests/lint, browser/runtime, DB, commits/push/deploy were skipped under AGENTS.md, not treated as passed.
- Scoped diffs reviewed separately in the two application repositories using per-command safe.directory. Preserved unrelated pre-existing Workshop/Fleet/other changes; historical Sales baseline changes remain recorded in their older freeze/review files. No commits or resets.
- TypeScript and external/inline Angular parsing: 39 active Sales source/template files, zero syntax errors. Relative/src imports resolve; this-member AST scan has no unresolved member except recognized inherited owners. Source parsing is not Angular type/template compilation.
- Translation source check: 322 referenced Sales/general/validation keys resolve in both en/ar. New BE resource XML parses and has zero duplicate data keys.
- Roslyn syntax parsing: 14 scoped BE services/model/VM/profile/configuration files, zero syntax errors. No C# semantic compilation or SQL execution.
- Source check confirmed lazy routes, action endpoints/DTOs, nullable agreement navigation read metadata, direct receipt events and generic base method signatures. No stale imports, merge markers or whitespace errors in the final scoped source checks. Owner build is still needed to detect semantic/compiler issues.
- Agents: bounded frontend-cycle, Fleet and Due explorers were delegated after Frozen contracts with disjoint ownership, to reduce discovery time. They reported findings but ended with usage-limit errors before completed implementation; root integrated discovery and implemented/reconciled the remaining changes. No claim that workers completed their slices; exact cost/usage is unavailable.

Owner acceptance sequence: build FE/BE; verify intended database/migrations; prepare eligible units/costs and mappings/open period; approve quote → create agreement → invoice → receive → deliver → close. Also test direct agreement, fully prepaid quote, cancel/release/reconvert, receipt reduction/void/unvoid with reopen, deleted/inactive/rented unit races, >9 same-date installments, very small balances/rounding, invalid dates/count/serials, stale page after deletion, all-page report output, documents cleanup retry, narrow widths, keyboard focus, Arabic/RTL and dark theme.

Suggested commits (suggestions only):
- Frontend: `fix(sales): complete agreement actions, routed fleet editor and due report output`
- Backend: `fix(sales): enforce agreement lifecycle, unit eligibility and collection consistency`

## Changed source inventory

This continuation's frontend implementation: Sales/Fleet/components/details (ts/html/scss), components/list (ts/html), services/fleet.service.ts and fleet.routes.ts; Sales/SalesAgreement/components/details (ts/html), components/list (ts/html); Sales/SalesQuotation/components/details.component.html and list.component.ts; Sales/DueInstallments/components/list (ts/html). Earlier scoped Sales changes (models, action dialog, route guards, service error options, installment-preview and baseline list/legacy cleanup) are retained and reconciled, not presented as newly authored here. Frontend vocabularies already contained the used keys and were checked rather than overwritten.

Backend implementation in this continuation: SalesAgreementService, EquipmentService, DeliveryNoteService, ReceiptService, SalesAgreement domain BuildSchedule and GeneralMessage en/ar-SA resources. Earlier scoped SalesQuotation service/profile/read DTO, Equipment ListVM and state-token configurations are retained/reconciled. Shared FinancialNumberPolicy.FloorMoney is the earlier frozen installment owner, unchanged by this continuation. Existing migration/snapshot dirty state belongs to the owner and was preserved.

Follow-up DueInstallments translation failure — 2026-10-08: owner supplied the actual InvalidOperationException from SalesAgreementService.GetDueInstallmentsAsync line 579. The failed SQL translation is caused by object null checks (`r != null` / `b != null`) on left-joined grouped aggregate projections in the totals query, before database execution; it is not an empty-result condition. Fixed in `SiGma.Business/Services/SalesAgreementService.cs` by projecting received and allocated-before sums as nullable scalar decimals through `AsQueryable().Sum(...)`, then coalescing `r.Amount`/`b.Amount` to zero. This keeps database aggregation, allocation order, paid/remaining clamp, totals, filter, sort, page and export/print contracts unchanged and avoids client materialization. Source grep confirms no old grouped-object null predicate remains; scoped backend diff/whitespace review passed. Backend compilation and endpoint execution remain owner-pending because builds/runtime are prohibited; no UI/guide change was needed because visible behavior and workflow are unchanged. Suggested backend commit: `fix(sales): make due installment aggregates translatable`. The supplied log contained an Authorization bearer token; it was not copied into project artifacts.

Packet refresh — 2026-10-08: at the owner's request, regenerated all derivative recipe packets from the canonical Master/UI/Backend books using `Generate-SigmaRecipes.ps1`; `-Check` now returns OK for PLAN-00 and PHASE-00 through PHASE-06. This supersedes prior stale-packet notes in this review's earlier historical entries; generated files remain derivative and were not edited directly. The current Sales review uses the refreshed Phase 01 domain/API, Phase 02 report/grid, Phase 03 editor/write, Phase 04 action, Phase 05 integration and Phase 06 reconciliation packets.

DueInstallments summary layout follow-up — 2026-10-08: switched the report totals to the shared `app-summary-cards` `slim` density and added a 12px host margin before the table. The Agreement No filter now fills its field width for consistent alignment with the other controls. Only scoped FE template/component style and the existing Sales guide text changed; no API, backend, schema, calculation, or shared-component contract changed. Source-only validation remains owner-pending for build/runtime and visual acceptance.

DueInstallments filter alignment follow-up — 2026-10-08: the filter strip now uses the shared inline grid with four filter columns and the report actions in the same desktop row. Agreement No uses the standard form-control surface plus shared filter tokens for matching border, focus, height and width. Responsive behavior remains owned by the shared report-filter breakpoints; no API, backend or calculation contract changed.

DueInstallments visual correction — 2026-10-08: aligned the filter strip with the canonical inline report pattern by reserving the actions caption track, grouping the action controls, using an explicit three-field plus checkbox/actions grid, and switching Agreement No to the shared PrimeNG input-text control. This corrects the cramped checkbox/action spacing while preserving responsive shared breakpoints and all report behavior.

DueInstallments checkbox alignment follow-up — 2026-10-08: vertically offset the Include paid installments control to the same baseline as the labeled date/customer/agreement inputs in the inline strip, with a mobile reset at the shared stacked breakpoint. No behavior or contract change.
