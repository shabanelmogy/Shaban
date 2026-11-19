# Sales review and client walkthrough — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | Review src/app/modules/Sales, implement confirmed documentation fixes, write the actual Sales cycle for client explanation |
| Baseline | SALES_CYCLE_CONTRACT_FREEZE.md and SALES_REVIEW_FIXES_CONTRACT_FREEZE.md, including subsequent amendments; source facts must be checked anew |
| Scope | SalesQuotation, SalesAgreement, Fleet, DueInstallments and directly owning backend services/contracts; preserve unrelated files |
| Recipe check | PHASE01 current; PLAN00 and PHASE00/02–06 stale, canonical blocks govern; regeneration and semantic review pending |

## Frozen review boundary

Reuse the existing endpoints, state transitions, ownership and accounting contracts. Implement confirmed deviations in current source from canonical patterns and frozen contracts; do not invent new business or change financial policy. Quotation/Agreement are type02 routed aggregate editors, action forms type09; Fleet has Documents/Warranties and therefore type02 under UI13, migrating existing modal rendering through shared owners if confirmed; DueInstallments retains its frozen paged operational report exception (UI20/BE17). No build/tests/lint/browser/database/migrations/snapshot edits/commits/push/deploy/Graphify/Sigma MCP. Source parsing/diff inspection only. Existing schema/concurrency migrations remain owner work until verified by the owner. Reference modules are read-only.

## Ownership and required evidence

Root owns integration, Fleet/DueInstallments, final reconciliation and Arabic client walkthrough under reviews. Bounded agents own Quotation and Agreement audits/confirmed repairs in their respective module and owning service/contracts, without overlapping shared/translation files. Before editing each workstream records concern → canonical block → actual reference file/symbol → shared owner → target match/deviation in its evidence artifact. Preserve global shared components and API shapes unless a source-confirmed narrow change is recorded. Missing material decisions pause only that slice. Client explanation must distinguish quotation approval, reservation, invoicing, actual Receipt collection, delivery and balance-based closure; no promises of nonexistent invoice/credit/refund automation.

No new screenshot requirements; historical123.PNG concerns Rental only and is irrelevant to Sales. Translation additions, if needed, are root-integrated. Applicable phases0/1 contract comparison then2/3/4 repairs as findings require,5 wiring and6 source reconciliation; scope-specific dispositions follow after review.

## DueInstallments conformance and frozen repairs

| Concern | Book | Actual source/reference/shared owner | Frozen target |
|---|---|---|---|
| Report strip stability | UI20/19 | StatementOfAccount list shared sigma-report-filter-field/ReportActions; styles.scss sigma-report-filter-panel--stable direct-field align-self and width bounds | Direct field children under the existing shared strip, opt into stable top alignment, reserve existing date feedback string; no local geometry CSS |
| Invalid Search focus | UI19/27 | Existing focusField utility, required dateRange control and UI19 submit rule | markAllAsTouched and focus the actual due-installments-date-range input; existing form/range validators retained |
| Snapshot/output | UI20/21/28, BE17 | Due list appliedQuery/fetchAllPages/ReportPrintService and same endpoint response | Existing server page/count/totals and complete print/Excel preserved; guard Reset during pending output/loading |

Grid columns are agreementNo, customerName, plateNo, srNo, type, dueDate, amount, paidAmount, remainingAmount, status, overdueDays, chequeNo, bankName. Backend row/FE shape adds only paymentId (row identity) and agreementId (existing navigation identity) to those fields. Filters: required inclusive fromDate/toDate from dateRange, optional customerId/agreementNo and includePaid; sort whitelist/paging remains unchanged. Totals cover all filtered rows, not a page. Existing Search auto-runs on current month, customer lookup has warning/retry, inline Result/HTTP errors are owned locally. Due report is a frozen paged exception, not migrated to unpaged. Reference source and shared modifiers were inspected before this edit.

## Client explanation evidence

Final Fleet query adjudication: the frozen last-page clamp still requires the owning GetManyAsync adapter. Root replaced its duplicated column predicates with shared ListQuery over the same eight validated filter keys. Existing ApplySorting is retained as a compatibility exception: it preserves the frozen direction-dependent identity tie-breaker and fallback, unlike the current generic order hook. NormalizePaging and ProjectTo are reused. No extra filter or write policy is introduced.

`SALES_CLIENT_WALKTHROUGH_AR.md` is the client-facing Arabic deliverable: main flow, nine stages, status tables, actual receipt-vs-schedule distinction, a transparent hypothetical100000/5% example, FAQ and live-demo sequence. Quotation worker confirmed approvals/preparation behavior from current source; the guide explicitly distinguishes Revise InternallyApproved→Pending, UnApprove CustomerApproved→InternallyApproved with dependency checks, InternallyRejected edit→Pending and the absence of a CustomerRejected revision action. After conversion, receipt demo uses the Agreement action; quotation's list no longer displays Generate Receipt. Agreement worker confirmed cancellation blocks direct live agreement receipts, while financial locking/paid calculation counts direct and quotation receipts. No nonexistent customer/email/finance/refund automation is promised; user-facing guide contains no source implementation checklist.

Root source wiring: pages/routing.ts loads Fleet_Routes/SalesAgreement_Routes/SalesQuotation_Routes/dueInstallmentsRoutes at Fleet/SalesAgreement/SalesQuotation/DueInstallments. Existing LayoutModule service provider aliases and root interceptor chain are retained; no new client provider. Due filter/form/service shape remains compatible with the existing controller query. Root parsed32 non-test Sales TypeScript files and9 external/inline Angular templates without syntax errors at integration checkpoint; this is source-only and not type/build certification.

## Final reconciliation — 2026-10-08

The initial shape/ownership description is corrected by actual discovery: Fleet was already routed with stale modal code, so this task completes routed adoption. After the common contracts were frozen, Fleet was delegated to its own bounded worker; root retained DueInstallments, shared translation integration, final adjudication and client delivery. No screenshot-derived Sales requirement exists. The earlier Rental screenshot remains outside scope.

| Concern | Implemented result and source evidence | Acceptance |
|---|---|---|
| Quotation editor | Bounded header at reference40%, fill-height item viewport, header Add, fixed shared summaries/footer; quantity widget, numeric badges, valid dates/integers/bounds, persisted amounts in View and selected customer code | Source matched UI13/14/17/19/27 and actual RentalQuotation/Job owners; visual pending |
| Agreement editor/actions | Shared collection-confirmation gates, date feedback/focus, section Add, fixed dropdown widths, highlighted numbers, disabled/frozen reason/discard forms and guarded navigation/print | Source matched shared owners; many-row/RTL/theme/dialog acceptance pending |
| Fleet editor | Explicit route modes and legacy View redirect, correct form/body chain, bounded document/warranty viewports, translated enum IDs, saved View labels, upload/remove/discard gates, shared feedback and numeric appearance | Source matched Job/partner/shared owners; cleanup and narrow-layout acceptance pending |
| Fleet catalog creation | Typed existing CarMake/CarModel POST calls suppress only premature success toast; one success after options refresh/selection. If refresh fails, Retry repeats the read and never repeats a successful POST | UI22 source ownership checked against interceptor; runtime failure scenario pending |
| Due report | Stable direct filter fields, reserved feedback string, first-invalid focus and guarded Reset | Existing paged SQL report/all-page export contract preserved |
| Aggregate ownership/history | Equipment uses OwnsAll, RemoveDroppedAsync and ReconcileOwned on tracked children; root-only Modified preserves child delete state. Quotation rejects negative/foreign/duplicate saved IDs and keeps deleted lines attached to their quotation while excluding them from totals | BE8/14 source review; persistence verification pending |
| Backend result localization | 41 Quotation,9 Equipment,1 Due and6 Sales Receipt keys added bilingually; Receipt shared unrelated Failure helper unchanged | XML parsed, no duplicate names;90 literal service result keys checked in both languages |
| Lean read shapes/mapping | Quotation root/item and Equipment root DetailVMs drop unused inherited metadata; retained consumed identity/state/labels/children. Obsolete No/SubscriptionId write ignores removed; aggregate children still ignored before tracked reconciliation | Producers, generic class constraints and scoped consumers traced; owner compilation pending |
| Concurrency/calculation | Quotation catch blocks rethrow DbUpdateConcurrencyException to existing localized409 middleware. Agreement preview rounds each price and down payment before schedule preview | Backend remains authoritative; frozen accounting/state/receipt caps retained |
| Wiring/translations | Existing parent AuthGuard/routes/providers/interceptors retained.32 runtime TS files and9 templates parsed; scoped imports resolve;346 static/dynamic translation keys exist in EN/AR | Source-only passed, no authorization mechanism invented |

Root follow-up amendment: Quotation's existing positive-ID check silently treated a negative child ID as a new line. Shared OwnsAll now rejects it while the existing duplicate-ID message stays distinct. Removed rows previously left the owner navigation; they now retain that navigation with IsDeleted=true before recalculation. SalesQuotation.TotalAmount/TotalTax/TotalAmountWithTax already exclude IsDeleted lines, preserving F2 amounts and soft-delete history. This changes neither VAT policy nor the calculation formula.

## Visible grid and read-contract comparison

Actions are the shared automatic first column and require no additional payload property.

| Screen | Visible data columns, in order | ListVM properties | Filters/exception |
|---|---|---|---|
| Fleet | plateNo,make,model,vehicleType,interiorColor,isActive,saleStatus,branch,chassisNo,engineNo,purchaseDate,purchaseCost | Same columns +id | plateNo,chassisNo,carModelId,isActive,saleStatus,interiorColor,vehicleTypeId,branchId; applied server paging/sort and frozen last-page clamp |
| Quotation | no,date,validUntil,customerName,customerCode,amount,status | Same columns +id,salesAgreementId | no,customerId,dateFrom,dateTo,status; live agreement identity supports Open Agreement |
| Agreement | no,date,customerName,customerCode,totalCharges,outstandingAmount,status | Same columns +id | no,customerId,dateFrom,dateTo,status; outstanding is backend receipt-derived |
| Due Installments | agreementNo,customerName,plateNo,srNo,type,dueDate,amount,paidAmount,remainingAmount,status,overdueDays,chequeNo,bankName | Same columns +paymentId,agreementId | Inclusive fromDate/toDate,customerId,agreementNo,includePaid; paged operational-report exception, all-result totals/export |

Write DTOs remain existing editable inputs/full snapshots; calculated amounts, numbers, tenant, state and posting remain backend-owned. Detail metadata removal is a read-shape cleanup with no endpoint/envelope/write-shape change. Named SalesQuotationItemInput moved to its own existing-layer file. AutoMapper has no new ReverseMap or ignores unrelated to consumed mappings. Compatibility adapters retained for custom filtered/live-agreement quotation projections, Fleet last-page clamp/direction-dependent order and paged Due report. Existing attachment folder CustomerDocuments is retained; a storage migration is not authorized.

## Changed files

Frontend root: `F:/My Work/Sigma/SiGmaAngularFrontEnd` —21 files:

- `src/app/modules/Sales/DueInstallments/components/list/list.component.ts`, `.html`.
- `src/app/modules/Sales/Fleet/components/details/details.component.ts`, `.html`, `.scss`; `Fleet/fleet.routes.ts`; `Fleet/services/fleet.service.ts`.
- `src/app/modules/Sales/SalesQuotation/components/details/details.component.ts`, `.html`, new `.scss`; `components/list/list.component.ts`, `.html`; `salesquotation.routes.ts`.
- `src/app/modules/Sales/SalesAgreement/components/details/details.component.ts`, `.html`; `components/action-dialog/action-dialog.component.ts`; `components/list/list.component.ts`; `salesagreement.routes.ts`.
- `src/app/modules/Sales/shared/reason-dialog/reason-dialog.component.ts`.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts`: Fleet keys only in this task; unrelated pre-existing vocabulary changes preserved.

Backend root: `F:/My Work/Sigma/SigmaBackend` —13 files:

- `SiGma.Business/Services/EquipmentService.cs`, `SalesQuotationService.cs`, new `SalesQuotationItemInput.cs`, `SalesAgreementService.cs`, `VouchersServices/ReceiptService.cs` (Sales-only messages).
- `SiGma.Business/MapperConfig/EquipmentProfiler.cs`, `SalesQuotationProfiler.cs`, `SalesQuotationItemProfiler.cs`.
- `SiGma.ViewModels/ViewModels/Equipment/EquipmentDetailVm.cs`, `SalesQuotation/SalesQuotationDetailVm.cs`, `SalesQuotationItem/SalesQuotationItemDetailVm.cs`.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `GeneralMessage.ar-SA.resx`:57 task keys; unrelated baseline resource changes preserved.

Local deliverables remain outside the application Git repositories: this report, the three workstream evidence files, the bilingual key inventory JSON and `SALES_CLIENT_WALKTHROUGH_AR.md`.

## Decisions, phases and limitations

Phases0/1 compared current source with existing freezes and selected canonical shapes;2/3 repaired lists/editors/read/write contracts;4 reconciled stateful actions and pending confirmations;5 checked routes/providers/interceptors;6 reviewed complete scoped diffs separately in both repositories and reconciled the evidence. Screenshot extraction, permission changes, new business states, new financial policy and migrations are not applicable. No new shared mechanism or verified reusable guidance was introduced, so no book/skill amendment was needed.

No new Add-Migration is required by this task: no entity/EF/schema changes. Earlier owner handoffs `SalesCycleCompletion` and `SalesConcurrencyTokens` remain pending until their actual migration/deployment history is verified by the owner. No migration or model snapshot was created, edited or run.

Known limits are explicit:

- Framework/API annotation/model-binding failures may remain English: inspected shared MVC setup has no annotation/localized invalid-model-state owner. Feature service messages are bilingual; a shared API localization change requires its own scope. No per-screen replacement pipeline was invented.
- Quotation keeps the frozen per-line VAT rounding policy (F13). This is the recorded legacy deviation from per-rate document VAT guidance, not a new policy change.
- Generated PLAN00 and PHASE00/02–06 packets are stale; canonical books governed this work. Owner regeneration and semantic review remain pending; generated packets were not edited.
- Source parsers do not certify Angular template type checking, .NET/AutoMapper compilation or SQL behavior. Those remain owner checks. No material unknown was resolved by inventing an API, permission or accounting effect.

## Owner verification and suggested commits

1. Compile frontend/backend in the owner environment and verify the existing migration history before business acceptance.
2. Exercise invalid dates and quantities, foreign/negative child IDs, remove/save/route races, failed Save retaining values and Cancel discard preserving disabled financial fields.
3. In Fleet, check document soft-delete history, cost/activation lock after sale, upload cleanup-only retry, and catalog POST success followed by lookup failure; retry must not create duplicates.
4. Run the client guide scenario: approvals, conversion/unit reservation, receipt<=outstanding including quote receipts, invoice/posting, delivery, all-page Due report export, zero-balance Close and receipt reversal reopening.
5. Check narrow/desktop layout, large collections, EN/AR/RTL, light/dark and print with the fixed title/filter/footer and internal scroll owners.

Suggested commits only: frontend `fix(sales): align editors and guard sales workflows`; backend `fix(sales): reconcile owned rows and localize sales feedback`. No commit was made.

## Agent integration and verification record

Three bounded workers used inherited models with no explicit override: quotation (aggregate frontend/service/profile/DTO), agreement (editor/actions/reason dialog/service and later authorized Sales-only Receipt messages), Fleet (routed editor/catalog/service/profile/DTO). Ownership did not overlap; root alone integrated vocab/resources and owned Due/report/client guide. Parallel work reduced review time for independent frozen module contracts; root performed final decisions/diff review and the two additional quotation ownership/history corrections. Evidence files capture actual references and per-slice findings. Fleet's final source was reconciled by root after worker edits, with the custom-query exception corrected here.

Final source checks:32 runtime TypeScript and9 Angular external/inline templates parsed with zero diagnostics; every scoped relative/src import resolved;346 translation keys checked with none missing; both RESX files parsed with no duplicate names and90 scoped service keys present; scoped git diff --check passed in both repositories. Root inspected tracked differences and new SCSS/C# record directly; stale type/import/mapping/route/feedback contracts checked. No builds, tests, lint, runtime/browser/database commands, migrations/snapshots, commits/pushes/deployments, Graphify or Sigma MCP ran. Implementation is source-only; overall runtime acceptance is deliberately owner-pending.
