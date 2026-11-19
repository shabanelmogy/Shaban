# Job invoice customer action — frozen handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Contract owner | Root reviewer; existing Job/MiscellaneousInvoice owners |
| Scope | Standalone Invoice on Customer action; E1 321.PNG |

## Domain/API

| Contract | Frozen rule |
|---|---|
| Read | Reuse GET Job/closing/{jobId}; typed JobClosingDto, add customerCode from Partner.Customer.Code |
| Mutation | POST Job/invoice-customer/{jobId:int}; body JobCloseInvoiceVM: invoiceDate, details, lines |
| Line | chargeType (only WorkshopItems, WorkshopLabour, WorkshopMisc, WorkshopExternalWork), optional vehicleId, optional description, amount > 0, settings taxPercent or optional 0 |
| Response | Existing Result, success Id = created MiscellaneousInvoice.Id and standard localized success message |
| Server-owned | CustomerId from Job; JobNo from Job; Module Workshop; document number, tenant, audit, totals, journal and Job state never accepted from client |
| State | Open ordinary Job, valid customer/number, no live Invoice or MiscellaneousInvoice linked by JobNo; success creates invoice and posted journal, leaves Status/ClosedAt unchanged |
| Duplicate | Repeat returns localized 409; participating new invoice and Close workflows use existing ExecuteUniqueWriteAsync<Job>, recheck inside lock; no blind retry |
| Atomicity | Existing multi-save invoice/journal must join caller transaction, commit/rollback only when owned; Close may also save its status in the same Job transaction |
| Validation | Required date and nonempty lines; enum/amount/rate/length annotations on existing invoice VMs plus service checks for internal callers; customer/vehicle live tenant references; legal Job state and allowed workshop types |
| Totals | FinancialNumberPolicy rounded line amounts; VatPolicy.AllocateDocumentTax for Workshop invoices; totals amount + allocated tax; frontend documentTax preview only, derived fields excluded from payload |
| Failures | Safe localized business Result, 404 missing Job, 409 closed/invoiced/conflicting write; preserve HTTP failure code from delegate |

The fixed customer and editable charges follow owner-approved Close Job invoice decisions C3–C5, rather than introducing a new receivable policy. Closed Job invoicing, multiple invoices, insurance allocation, refunds and permissions are outside this handoff.

## UI / integration

| Concern | Frozen rule |
|---|---|
| Action | job.actions.invoiceCustomer, receipt/document icon, ordinary Job + Open + !hasInvoice |
| Route | /Job/invoice-customer/:id, routed financial editor; back/save return /Job with the existing query parameters |
| Fields | Date/time; fixed customer name/code; details; lines charge type / vehicle / description / amount / tax / amount+tax |
| Defaults | Current local date/time; details contain job number; existing nonzero charge-group totals, selected job vehicle and backend/settings rate; no invented data labels |
| Preview | Shared money display, document tax, compact shared net/tax/gross cards; amount in words from confirmed tenant currency labels, never screenshot currency hardcoded |
| Controls | Calendar appDatePicker (time); TranslateOptionsPipe; EditableRows; app-field-error; body-appended overlays |
| Async | takeUntilDestroyed + cancelled/stale read protection; global loader for detail/save; required lookups warn/retry and never silently fail; disabled form and mutations during save |
| Feedback | Global interceptor owns standard save success/failure; inline request opts out of error interceptor explicitly when used; no duplicate toast |
| Exit | Pristine leaves silently; dirty uses shared confirmDiscard; saving blocks exit; success returns to reloaded list |
| Appearance | Shared sigma-editor classes, FormSection, shared table/summary/buttons/state; bounded scroll and fixed header/footer; no bespoke colors or screenshot layout cloning |

## Grid and references

Displayed grid columns remain No, RecordType, Status, EstimationNo, Vehicle, CustomerName, CustomerCode, CreatedBy, TotalCharges, DateAndTime, EstimatedCompletionTime, Branch, InsuranceCompany, with shared Actions first. JobGridRowDto has those fields plus Id/RecordKey and HasInvoice only for action state. Both Job and LubricationJob selectors assign HasInvoice explicitly (false for lubrication).

New action reference coverage: Close's invoice input reused; Close-only state change Not Applicable to Invoice on Customer; Labour Time/Delete/View/Edit remain their existing actions. AuthGuard, [Authorize], root JobService and environment.baseUrl HttpClient stay their owners. No provider or AutoMapper addition is required.

## Evidence classification

| E1 item | Classification | Resolution |
|---|---|---|
| Invoice on Customer, Job number, date/time/customer/details | Explicit | New action + read-only context; header title/subtitle |
| Six line columns, add/remove, tax/gross totals, amount in words | Explicit | Typed form and shared table/summary; settings-backed currency labels |
| Close/Save | Explicit | Return/discard and typed financial save |
| Exact source/target status, duplicate policy, journal | Screenshot Uncertain; source Confirmed | Existing C2–C5 owners; source-derived open/uninvoiced guard and shared concurrency boundary |
| Screenshot palette/geometry | Visual only | Canonical UI08/13 |

No required Missing or Conflicting business decisions remain for this bounded slice. Source compilation, concurrent writes, journal reconciliation and visual acceptance remain owner-pending.

## Source integration addendum — 2026-10-03

The final source trace confirmed `FinancialNumberPolicyResolver.GetBaseCurrencyDecimalPlacesAsync`
reads `Currency.IsBase.DecimalPrecision`, while CommonDTO.currencyDecimals is display precision.
The invoice read context therefore also returns `moneyDecimalPlaces` from the existing resolver;
the new editor uses it for input scale, row/header tax and gross previews. This response-only field
does not enter the payload. Invalid/incompatible ledger precision returns the existing resolver
failure before offering an invoice draft. This is an additive technical correction required by
the already-frozen backend-matching preview rule; no rounding policy or schema changes.

Because Close Job calls the same Workshop invoice pricing owner, its existing invoice row
gross preview also adopts shared `allocateDocumentTax` and the returned ledger precision.
Only this calculation consumer is reconciled; the existing Close dialog workflow/layout is
not redesigned in this action task.
## 2026-10-03 owner extension — invoice badge and filter

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authority | Owner requested an Invoiced badge and invoice filter, then specified a separate column immediately after JobNo. This additive handoff supersedes only the earlier unchanged-column/filter decision. |

UI shape remains the existing UI02 Job list with routed document editor. Backend remains the stateful Job aggregate's existing mixed Job/LubricationJob read projection, a justified custom query rather than generic CRUD. UI4/5/6/8/16/23 and BE7/9 own this read extension; Phase02 recipe drift check passed for all eight packets before use. No new workflow, persistence, accounting or permission rule is introduced.

| Concern | Book / reference symbol | Shared owner | Frozen target |
|---|---|---|---|
| Badge column | UI5; JobsComponent.jobStatus/initColumns | DataTableColumn.type=status, sigma-status-badge | no followed immediately by hasInvoice; success Invoiced / neutral Not Invoiced, translated in grid and Excel |
| Filter | UI4/16; existing Job filter form and FilterPanelComponent.countActive | appFilterPanel, TranslateOptionsPipe | First advanced filter; nullable boolean hasInvoice. null = all, true = invoiced, false = not invoiced. false counts as an active advanced filter. Existing six main fields remain. |
| Request / backend | UI2/8, BE9; shared toListParams/fetchAllPages, FilterHelper.GetBool | Shared serializers and all-pages collector | Filters[hasInvoice]=true/false; absent/empty/malformed means no invoice restriction. Preserve false. Apply to combined HasInvoice projection before CountAsync, sort and paging. |
| State / sorting | UI5/6; existing route handoff and resolveListPaging | Route query state, shared paging helper | Restore literal true/false, preserve both across paging/editor return/export; Reset sets null and page1. Add backend-supported hasInvoice sort with existing identity tie-breakers. |

Grid order: shared Actions, no, hasInvoice, recordType, status, estimationNo, vehicle, customerName, customerCode, createdBy, totalCharges, dateAndTime, estimatedCompletionTime, branch, insuranceCompany. JobGridRowDto/JobListRow already expose all business fields plus id/recordKey; HasInvoice now serves display as well as action visibility. No new DTO property or mapping is needed. HasInvoice retains its established live tenant Invoice/MiscellaneousInvoice JobNo derivation; lubrication rows remain false and appear under Not Invoiced. Filter and badge use exactly the same source flag, without an independent frontend derivation.

Scope: Job list TS/HTML/model/service, matching en/ar Job keys, existing GetWorkshopGridAsync filter/sort and DTO comments, this handoff and feature review. Reuse shared paging/serialization/export helpers instead of retaining private copies in the changed consumers. No other screen, editor, invoice writer, entity or EF configuration is in scope. Source-only checks; owner compilation, provider SQL translation and visual/runtime acceptance remain pending. No subagent is needed for this small sequential extension.

