# Limousine accounting writer implementation

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

2026-10-07. Bounded worker slice under `LIMOUSINE_INVOICE_CONTRACT_FREEZE.md`. Root integration and whole-feature reconciliation remain separate.

## Owned files

- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VouchersServices/InvoiceService.cs`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Dtos/GenerateInvoiceRequest.cs`

No other application files modified by this worker. Existing unrelated/user/peer edits preserved.

## Contract and source conformance

| Concern | Canonical/reference owner | Producer implementation |
|---|---|---|
| Multi-save accounting boundary | BE15; existing InvoiceService + JournalVoucherResolver | Limo Generate/Update/UpdateList/Remove serialize using the existing `ExecuteUniqueWriteAsync<LimousineInvoice>` tenant/type transaction. Nested accounting transactions open only when no outer transaction exists; only their owner commits. Failure results return without committing the lock owner's transaction. Limo exceptions propagate for central safe/concurrency handling. |
| Trip source and cap | BE5/8/15/18; root-owned ILimousineBillingService | PriceAsync runs on live tenant Repository trip snapshots under the lock, accepts requested gross, excludes self for edits, and supplies saved-source net/tax/precision. Customer, driver, branch, pickup, vehicle/location labels and description come from the trip. |
| Shared journal implementation | BE15; InvoiceService.BuildAndPostInvoiceJVAsync / JournalVoucherResolver.SaveAndPostJVAsync | Existing customer Dr/revenue Cr/tax Cr account mapping and fiscal/balance rules retained. Optional `persist:false` composes the same builder for limo account/fiscal/balance readiness before invoice first save. Posting/account validity is checked again by the resolver during final persistence; all saves roll back together on failure. No second journal builder introduced. |
| Saved tax ownership | BE15; InvoiceBase.SetTaxExplicit | Limo invoices set policy-provided net and explicit allocated saved trip tax. They are excluded from current-rate RecalculateTotals. Pure limo batches do not fetch current tax settings to reprice saved source tax. |
| State and history | BE8/15 J-1 | Limo posted/approved/voided or missing linked journals and active allocations reject Update/Delete. Unposted edits refresh old/new trip fully-billed flags; delete refresh excludes the deleted invoice. Other invoice types preserve their existing workflow. |
| Tenant and references | BE8/18; Repository ordinary read/write | Replaced direct Context limousine/trip validation reads with tenant/live Repository queries; pricing validates source customer/driver, header helper validates other references and rejects supplied nonpositive optional IDs on limo. |

## Changed inputs and compatibility

`GenerateInvoiceRequest.LimousineTotalAmount` is nullable requested GROSS. Omission bills the authoritative remaining balance (the former full amount when no invoices exist). `BranchId` is an optional source-context field, but limo construction overwrites it from `trip.Vehicle?.BranchId`. Existing non-limo grouping and request/amount handling remain.

Root approved optional `InvoiceUpdateVM.LimousineTotalAmount` in its own file: when supplied it is requested gross. If absent and legacy Amount is unchanged, saved TotalAmount is preserved; otherwise legacy requested gross is Amount + saved invoice Tax. Pricing always excludes the invoice itself. A partial invoice is never reset to trip.Charges as before. InvoiceDate is the requested local FromDate.Date on the limo branch.

Multiple invoices for the same trip are permitted across requests; duplicate normalized TripNo within one Generate submission remains rejected. Generic UpdateList target IDs that include limo participate in one lock and call the accounting core for every row, returning failure for the whole submission when any row fails. Lists containing no limo preserve the inherited bulk path.

Inherited InvoiceService.Add/AddList map InvoiceAddVM to the concrete rental `Invoice`, not `LimousineInvoice`; InvoiceAddVM has neither TripNo nor InvoiceType. Dedicated limousine writers are owned by the root. No explicit constructors of InvoiceService were found by targeted symbol search; dependency injection registration of ILimousineBillingService is root-owned.

## Localization integration required

Root owns both resource files. New keys used here:

- LimousineInvoiceTripRequired
- LimousineInvoiceDateRequired
- LimousineInvoiceDuplicateTrip
- LimousineInvoiceTripNotFound
- LimousineInvoiceAccountingLocked
- LimousineInvoiceReferenceInvalid

Existing neutral InvalidId and success resource ownership retained. Existing shared journal/account/fiscal helper messages remain with their existing owner as directed by the root; no broad unrelated localization refactor.

## Verification and limitations

Source-only complete scoped Git diff reviewed; targeted searches show no direct Context.Set<TripBooking>/Context.Set<LimousineInvoice> access and no prior one-invoice-per-trip rejection in the owned service. `git diff --check` passed for both owned files. DTO/policy method names compared against actual interface/record/domain declarations. No source consumer constructs InvoiceService directly. This does not certify compilation, SQL behavior, or financial race acceptance.

No schema/entity/EF change; Add-Migration is not required by this slice. The cooperative application lock protects participating writers, not arbitrary SQL/future bypass writers. The lock's owner commits successful operations; a caller supplying an already-existing outer transaction remains responsible for rollback on failure, following the shared UOW contract. Whole-feature root audit must include all dedicated/generic trip price/lifecycle writers and resource integration.

Owner verification: partial invoices in successive requests; exact-final balance and tax residue; scale/negative/zero/over-remaining requests; mixed valid/invalid batch atomic rollback; concurrent billing and trip price/Finish edits; missing accounts/fiscal period failure after earlier saved rows; tenant/soft-delete isolation; posted/approved/allocated edit/delete rejection; generic UpdateList atomicity and no non-limo regression; latest source compiler acceptance.

Phases1/3/4/5 applied for frozen DTO/accounting/write integration; frontend/read-grid and whole-feature Phase6 are root/other-worker owned. No screenshot supplied. Suggested backend commit message: `fix(limousine): enforce partial invoice balance in accounting writers` (suggestion only).

Agent utilization: one bounded complex accounting worker, inherited parent model, two exclusive application files; root owns the shared policy, dedicated service/trip guards, resources and reconciliation. Delegation splits non-overlapping work and reduces wall-clock time without a separate business-rule owner.

No builds, tests, lint, runtime/browser checks, database commands, migrations/model snapshots, Graphify, Sigma MCP, commits, pushes or deployments run.

## Root audit follow-up — dispute-only writer (2026-10-07)

Root identified `ToggleDisputeStatusAsync` as another participating full-row writer: its former Repository.Update could overwrite a newer limousine amount/source while saving only a dispute change. Limo subtype detection is now an untracked tenant read; the method takes the same `ExecuteUniqueWriteAsync<LimousineInvoice>` lock, rereads inside it with cancellation, and saves only the changed tracked dispute fields. Non-limo behavior remains unchanged. Existing dispute feedback remains with its shared owner; no new resource keys.

A targeted source search reviewed all remaining Repository.Update(invoice)/UpdateRange and SaveChanges paths in this file: monetary/source full-row writes are Generate/Update, covered by the shared limo lock; inherited UpdateList is intercepted for limo IDs; allocation writes update allocation/journal entities rather than invoice money/source fields. No additional invoice full-row writer identified in this owned file. Scoped diff whitespace check passed again. Runtime concurrency acceptance remains pending.

## Integration decision — description source (2026-10-07)

Root accepted the integration audit mismatch and selected `trip.Notes ?? trip.GuestOtherDetail` as the common description source, matching the candidate producer. Both generation and unposted update now save this source. This supersedes the prior GuestOtherDetail-only description source; no monetary formula, payload field, schema or resource key changed. Scoped diff whitespace check passed after correction.
