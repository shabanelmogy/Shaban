# Limousine partial invoice reconciliation

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

2026-10-07. User approved trip-based invoice generation, then required several partial invoices with their sum never exceeding the trip total. This resolves the historical Invoice Blocked decision in the feature review. Current source, explicit user decisions and canonical books are the evidence; no screenshots supplied. Existing unrelated working-tree changes are preserved.

## Result and calculation ownership

The routed generation workspace permits a positive gross portion for each selected trip. Backend rereads the live tenant trip and all live tenant limousine invoices under the existing tenant/type application lock before accepting it. Trip total = Charges − Discount + stored Tax; billed = sum of persisted live invoice TotalAmount; remaining = max(0,total−billed). Unposted invoices consume capacity too. Voided invoices conservatively continue consuming capacity while live; soft-deleted rows do not. Existing overbilling or inconsistent tax balances fail closed without rewriting history.

Requested gross must be positive, within the actual base-currency scale, and no greater than remaining. Allocate stored trip tax proportionally using the existing financial rounding policy, cap it to remaining tax, and consume exact remaining tax on the final portion. Saved net = requested gross−allocated tax. Current tax settings never reprice the saved trip source. For a total1000 and existing billed400, a new portion may be at most600. The writer checks again regardless of the screen snapshot.

All known participating monetary writers share `ExecuteUniqueWriteAsync<LimousineInvoice>`: dedicated Generate/Add/AddList/AddFromScreen/Update/UpdateList/Remove, generic InvoiceService limousine generation/update/batch/delete/dispute, and trip price Update/UpdateList/Finish/Cancel/Delete. Actual eligibility is reread inside the transaction. Generation reuses the existing InvoiceService journal/account builder and resolver, including a nonpersisting preflight; invoice, derived trip flag and linked journal saves commit together only on whole success. No second journal writer is introduced. Source inspection found no remaining participating bypass in these owned paths. The lock coordinates these writers, not arbitrary SQL or future bypass code; race/rollback behavior still needs owner runtime acceptance.

Trip Fully invoiced now means a positive total covered by actual billed gross. It is readonly and absent from trip Add/Update payloads. Update/Finish cannot reduce total below billed or make remaining tax inconsistent. Cancel/Delete reject a trip with any positive invoice amount, including partial. Both plain/deep trip detail, paged list, invoiced filters and existing candidate readers derive actual balance, avoiding legacy first-invoice flags.

## Frozen producer/consumer contracts

| Surface | Exact contract / behavior |
|---|---|
| List | GET LimousineInvoice; pageNo/pageSize default15/cap100, exact metadata; tripNo/customerId/fromDate/toDate filters on pickup calendar dates |
| Grid versus ListVM | Columns no,tripNo,invoiceDate,pickupDateTime,customerName,driverName,amount,tax,totalAmount; ListVM exactly these +id for View/Print |
| View | GET LimousineInvoice/GetByWithNavigationsId/{id}; list fields +vehicleType,pickupLocation,dropoffLocation,description,branchName; displays persisted amounts |
| Candidates | GET LimousineInvoice/Candidates; Filters[fromDate,toDate,customerId,branchId]; complete eligible collection with actual billedAmount/remainingAmount and readonly source identity/labels/charges/tax/discount/total |
| Generate | POST LimousineInvoice/Generate; invoiceDate local yyyy-MM-dd, items[{tripBookingId,totalAmount}]; positive unique trip IDs per submission; gross amount only; result created IDs in id, no entity; dedicated Angular result matches |
| Legacy writes | Existing dedicated payloads remain compatible requests; customer/driver/branch/source text/price/tax are reconstructed from the trip and shared policy. Legacy unspecified generic requested gross bills actual remaining |
| Legacy candidate reads | Existing TripBooking endpoints/routes retained; actual remaining determines eligibility; billed/remaining fields added and Angular compatibility DTO matched |
| Source fields | Customer/driver/branch, vehicle/location text, pickup and Description=Notes??GuestOtherDetail belong to the trip; client cannot replace them in new generation |

Customer/driver names use existing invoice reference reads. If an external driver's saved reference is absent, list and both detail methods use the current live same-tenant trip's external driver name. This is a current label fallback, not an immutable historical driver-name snapshot; no entity field/schema was added. Monetary values, vehicle/location/description snapshots remain the saved invoice source.

## Actions, wiring and conformance

| Concern | Decision and source evidence |
|---|---|
| Actions | Create/Generate, View, Print and full filtered Excel Supported. New Edit/Delete controls intentionally absent from the generation surface. Existing unposted compatibility edits/deletes still validate the cap. Posted/approved/voided/missing-linked-journal or allocated invoice changes are rejected under BE15 J-1; posted corrections belong to the existing voucher lifecycle |
| Routes/providers | Existing pages/routing.ts lazy LimousineInvoice entry retained; list/create/view/:id and details/:id compatibility redirect. Existing AuthGuard/interceptors and providedIn root service retained; no invented permission API. Toolbar suppresses duplicate feature title |
| UI shapes | UI1/3/4/6 normal shared paged list, UI13 readonly routed View, UI14 financial collection workspace. Workshop Job list/editor and actual OpeningBalances financial table/shared declarations are approved comparison owners |
| Collection | Typed selected/requested-gross rows; source fields readonly; only selected amounts enabled, required/finite/positive/max/actual precision. Fixed title/date/filter/summary/footer and one bounded table row scroll owner; shared styles only |
| Errors/lifetime | UI10/19/22/28; inline read failures +Retry and skipped global read interceptor; shared mutation feedback owner; frozen submitted controls, same-editor cold one-use discard, preserved failed Save input, identity-safe reused View reads/auto-print |
| Print/export | UI8/21; click-time applied filter snapshot, actual all-page fetch, no partial output on failure, separate print rows/shared ReportPrintService and full ancestor sigma-print-flow. Saved View values are authoritative |
| Backend shape | BE3/5/8/15/18; lean one-way read maps, existing generic base hooks, one authoritative balance/pricing owner and existing accounting writer. Named C# DTO/record/interface each has its own file. Unused LimousineInvoiceFullListVM removed after targeted search |
| Registration | Actual DependencyResolver assembly scan registers the public billing implementation as its interface; resolver/UOW dependencies are already registered. No direct InvoiceService constructors found |
| Localization | 18 backend billing/accounting keys plus invoice UI and fully-invoiced text integrated in EN/AR; existing unrelated locale content preserved |
| Learning | Feature-specific source/cap decisions recorded in the freeze and this report. No new reusable general rule established, so no owning-book/skill learning change required |

## Source verification, files and phase reconciliation

Actual repositories are SiGmaAngularFrontEnd and SigmaBackend, not the coordination folder. Complete scoped diffs were reviewed by bounded owners and root, with new contracts read separately. Final root audit corrected stale cancellation flags, plain/deep detail balance, safe tax multiplication ordering, external-driver display, description consistency, compatibility candidate eligibility and the batch result shape. No remaining confirmed source mismatch was found in reviewed paths.

- Whole scoped TypeScript/Angular syntax and local-import audit:70 runtime TS files,18 templates,0 errors. This is parsing only, not TypeScript/template type checking or compilation.
- Literal translation audit:0 missing EN/AR. Canonical twelve-block Check-Translations:439 keys in each language,0 missing/0 case differences. Both backend resource XMLs parse:766 keys each,0 duplicates.
- Scoped git diff --check passed both repositories. LF/CRLF normalization notices are informational. New records/DTOs/controller/interface and source policy read individually. No source merge markers or stale removed runtime imports found in touched invoice/trip paths.
- Exact combined feature inventory:105 frontend and47 backend scoped working-tree paths in FILES_CHANGED.md. Counts include earlier broad Limousine work and shared translations, not just this invoice amendment. Invoice worker evidence is in INVOICE_FRONTEND_IMPLEMENTATION.md and INVOICE_WRITER_IMPLEMENTATION.md; shared contract is LIMOUSINE_INVOICE_CONTRACT_FREEZE.md.
- Phases0/1 discovery/freeze,2 read/grid,3 detail/write,4 supported domain/accounting guards,5 integration and6 source reconciliation applied. Screenshot extraction skipped (none supplied). New permission/void workflow, schema redesign and live-driver/grid-consumer invention Not Applicable.
- Recipe drift remains:phase01 current; PLAN00/phases00/02–06 need owner regeneration and semantic review. Canonical books were used; generated packets untouched.
- No entity/EF/schema change: Add-Migration not required. Builds/tests/lint/runtime/browser/database/migrations/model snapshots/Graphify/Sigma MCP/commits/push/deploy not run, under Sigma execution boundaries.

## Owner acceptance still required

Compile Angular/.NET and verify AutoMapper/EF aggregate projections. Exercise successive partials, exact-final tax residue, zero/negative/invalid scale/over-remaining amounts, a balance changed since screen load, same-trip concurrent submissions and concurrent trip pricing/Finish. Verify an invalid row or failed account/fiscal/journal persistence rolls back the whole batch, including earlier invoice saves and flags. Check live tenant/soft-deleted isolation, legacy stale flags, fully-billed filters, unposted legacy edits preserving partial values, posted/approved/allocated edit/delete rejection and non-limousine regression. Verify readonly saved View, reused id/delayed print, failed lookups/Retry/dirty decisions and full filtered print/Excel, Arabic/theme/narrow/keyboard and one scroll owner.

No existing-data repair or arbitrary-writer cap guarantee is claimed. Implementation is source-only; owner acceptance is pending. Suggested commits (not executed): frontend `feat(limousine): generate partial trip invoices from remaining balances`; backend `fix(limousine): enforce partial invoice balance in accounting writers`.

## Agent utilization

After the shared contract was Frozen, two reused bounded agents worked on exclusive files: invoice_frontend owned the Invoice frontend folder; invoice_writer owned InvoiceService.cs and GenerateInvoiceRequest.cs and then a read-only root integration audit. Both inherited the parent model, preserved peer/user changes and produced source-only fragments. Root retained business decisions, shared policy/dedicated service/trip guards/translation/shell integration and whole-feature closure. Parallel execution reduced overlap without duplicate accounting ownership; no cost or elapsed-time estimate is invented.
