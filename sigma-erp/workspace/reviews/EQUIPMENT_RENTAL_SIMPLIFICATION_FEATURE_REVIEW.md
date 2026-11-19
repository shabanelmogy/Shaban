# Equipment Rental simplification and quotation unit rows

Status: implemented in source, 2026-10-27. Build, schema application, runtime/browser acceptance and performance measurements remain owner-pending. No data deleted. Frozen scope: `EQUIPMENT_RENTAL_SIMPLIFICATION_CONTRACT_FREEZE.md`; the financial completion report remains authoritative for invoice accounting and receipts. This report supersedes the compulsory execution-order continuation in earlier operational contracts.

## Outcome, evidence and decisions

Owner approved simplifying the cycle, clarified that all data is experimental, chose financial actions only through delivery invoices, and required quotation quantities to become one agreement row per actual unit. Normal path:

Approved quotation -> master agreement draft -> approved rates -> create delivery note -> actual delivery and billing start -> approved hours or elapsed duration -> delivery invoice actions -> posting and effective approved collection -> physical return and financial close.

No separate mandatory equipment rental order or standalone invoice menu. Customer commercial PO links and supplier Create Po retain their existing owners. Used rental fleet sales remain under Sales, not Equipment Rental.

| Evidence | Classification / adopted result |
|---|---|
| Owner's quantity clarification | Confirmed business input: quantity 3 prepares 3 individual equipment-selection rows |
| Delivery screenshots | Functional fields, physical dates, source agreement and per-equipment identity; not an implementation/layout authority |
| Sale Orders screenshot | Association of existing customer commercial documents; not proof of an equipment dispatch-order stage |
| TimeSheet screenshot | Delivery-owned operational records, unchanged approved net-hour billing policy |
| Stored Speed analysis chapter6/20; S028/S175/S269/S206 | Customer PO distinction and master-to-physical-delivery corroboration. Leasing individual agreements are analogous evidence, not an Equipment Rental model to copy |
| `QuotationDetailsVM` / `QuotationProfiler` and `QuotationService.GetDetailAsync` | Existing response contains live detail quantities, model/type labels and quotation basis; no new API needed |
| Source ambiguity: with/without operator | No automatic monetary choice. Price remains explicit in each agreement row, preserving the accepted financial contract |

No unresolved material decision in the implemented slice. This is initial draft preparation, not a new exact-quantity or model-allocation enforcement policy. Saved agreements are never rebuilt from the quotation. Existing duplicate actual-unit validation remains in UI and backend.

## Applied phases and source owners

Tier L simplification followed the existing maintenance plan: Phase00 evidence, Phase01 frozen source/write/state contracts, Phase02 list/source filtering, Phase03 editor and quantity rows, Phase04 guarded cancellation/retirement, Phase05 route/menu integration and Phase06 source reconciliation. The quantity clarification is a bounded type02 routed editor change with the existing pattern2 aggregate. Delivery remains the controlled shared modal/action editor; no reference module changed. All eight generated packets passed read-only `-Check`; no canonical rule change or regeneration needed in this slice.

Frontend files in `SiGmaAngularFrontEnd/src/app/modules/Equipment Rental/`:

- `EquipmentMasterAgreement/components/{details,list}` and `models/{list,quotation-reference}.ts`: direct delivery actions, open-state visibility, one blank actual-unit row per quoted unit, source labels and unambiguous day/week/month basis. No automatic actual-unit allocation or price selection. Positive integer quantity total limited to the existing 200-rate writer bound; invalid sources surface Retry. Same-source Retry preserves prices, selected identities and removed rows.
- `DeliveryNote/components/{details,list}`, `models/list.ts`, `services/deliverynote.service.ts`: agreement-scoped creation and history, site/contact, explicit equipment/branch choice, immutable saved source IDs, guarded removal of undelivered preparation. Existing invoice actions remain the financial entry point.
- `EquipmentMasterAgreement/components/finance`: remove obsolete open-order count card, retain real financial blockers.
- `EquipmentRentalOrder` routes/list/details: old history and views remain; Create/Edit redirect and mutation controls removed.
- Shared sidebar removes only the execution-order menu. Bilingual vocabularies add the direct-delivery, cancellation and quantity guidance. Equipment Rental and Sales in-app guides explain the revised cycle.

Backend files in `SigmaBackend`:

- `SiGma.Helpers/Models/DeliveryNote.cs`, `SiGma.DataAccess/Configuration/DeliveryNoteConfig.cs`: nullable max500 site/contact. Existing historical source FK and filtered uniqueness retained.
- `SiGma.ViewModels/ViewModels/DeliveryNote/` and `EquipmentMasterAgreement/EquipmentMasterAgreementListVM.cs`: matching inputs/details, advisory CanDelete and existing IsClosed source state.
- `SiGma.Business/Services/DeliveryNoteService.cs`, corresponding interface/controller/profiler: positive agreement-scoped operational sources and exact list filter; authoritative agreement/customer/rate checks; new notes reject historical order-line inputs. Prepared and actual custody still share the Sales lock. Recorded actual delivery cannot be erased or deleted. Site/contact trim/limits and source immutability enforced in the writer.
- `SiGma.Business/Services/VouchersServices/SaleOrderService.RentalWrites.cs`: four equipment-order writers explicitly reject the retired workflow. Generic customer-order locking, helper reads and generic writer guards remain.
- `EquipmentMasterAgreementService.Finance.cs`: no unfulfilled execution-order requirement; deprecated response count is zero. Actual custody, sheet approval, coverage, posting, settlement and reasoned closure remain.
- `AssetsServices/EquipmentSalePreparationService.cs`: physical/prepared custody still blocks sale transfer; old confirmed order demand no longer blocks it.
- Both GeneralMessage resources: retirement/direct-source/history messages and corrected physical-custody guidance.

AutoMapper keeps conventional same-name SiteContact/IsClosed mapping, explicit historical-site fallback and derived CanDelete. Add/Update requests contain no calculated prices, postings, allocation amounts or closure state. New fields use the current namespace/project relationships; interface/controller/service parameter order and result envelopes match. Generic customer SaleOrder is not retired.

## Grid, source and action reconciliation

| Screen | Visible column order beside ListVM source |
|---|---|
| Delivery | Actions; deliveryNoteNo/DeliveryNoteNo, masterAgreementNo/MasterAgreementNo, plateNo/PlateNo, customerName/CustomerName, customerCode/CustomerCode, deliveryNoteDate/DeliveryNoteDate(date), deliveryDate/DeliveryDate(date), returnDate/ReturnDate(date), invoicingStartDate/InvoicingStartDate(date), status/Status(status), branchName/BranchName. Id targets actions; CanDelete is advisory action state only |
| Master agreement | Actions; approvalStatus/ApprovalStatus(status), masterAgreementNo from No, date/Date(date), customerName/CustomerName, customerCode/CustomerCode, quotationNo/QuotationNo with QuotationRefNo fallback, po/PO, createdBy/CreatedBy, createdAt/CreatedAt(dateTime). Id targets actions; IsClosed controls creation eligibility |

Existing filters/sort/page/count/export contracts remain. Delivery adds exact `agreementId`; Master actions omit date restriction and default branch restriction to show all its deliveries. A reload without an explicit branch filter preserves that agreement scope. User-selected branch filters still apply.

| Contract | Source result |
|---|---|
| GET DeliveryNote/OperationalSources | `orderLineId?, agreementId?, cancellationToken`; direct mode requires positive agreementId and returns one approved open agreement with eligible agreed actual equipment. Legacy order-line mode is saved-history compatibility |
| New direct delivery | Fixed agreement/customer, selected available agreed unit and active branch, dated preparation, required site and optional contact; backend revalidates under lock |
| Actual delivery / return | Cannot erase actual delivery; future/impossible date order, conflicting custody and sheet/invoice history rejected. Physical return remains billing cutoff |
| Remove preparation | Existing DELETE after shared confirmation; only before actual delivery, on open agreement, without dependent sheets/finance/history. No automatic cleanup performed |
| Invoice finance | Existing delivery -> invoices -> financial status -> post/receipt path. No new financial menu, total/tax/proration policy or receipt-settlement rule |
| Quotation creation route | `/EquipmentMasterAgreement/create?quotationId=N`; existing detail API seeds once. Manual agreement creation and saved edit/view do not reseed |
| Legacy rental orders | Historical list/view; mutation entry points removed and typed writer endpoints reject explicitly. Generic writer bypass guards preserved |

## Loading and cache conformance

Actual sidebar/routes import the reviewed components; no duplicate legacy feature was mistaken for the current route. Operational reads stay fresh. Route metadata does not disable page progress on these routes; Layout's `showPageLoading` host remains the visible page owner. Query-only list writes preserve its pending lease through the shared LoadingService route-path lifetime.

| Actual URL / service | Classification, consumer and lifecycle evidence |
|---|---|
| Customer/GetSelect — CustomerService via agreement service and delivery list | Approved reference cache (`cacheSelect=true`), shared ReferenceLookupCacheService. Finite successful bootstrap before separate ReferenceLookupBindings watches; selected customer label retained. Shared successful-writer/import invalidation and realtime/auth/language/tenant scope notifications retained |
| Branch/GetSelect — BranchService | Same approved shared cache. Delivery list and local editor bootstrap/watch separately; selected branch labels retained, context cleared and teardown destroys watchers. Existing shared writer/import invalidation retained |
| Equipment/GetSelect — FleetService | Direct reference without source opt-in (`cacheSelect=false` inherited), used by agreement editor. No new cache/watcher or eligibility policy introduced |
| Quotation/GetSelect — EquipmentQuotationService | Direct source without cache opt-in; agreement selection list remains fresh |
| Quotation/GetByWithNavigationsId/N — agreement getQuotationReference | Direct operational approval/customer/quantity read. Existing request only; switchMap + version check + context cancellation/destroy and finalize, Retry and approval validation retained. No extra request per unit |
| DeliveryNote/OperationalSources?agreementId=N, optional saved orderLineId | Direct operational availability/rate source, finite editor forkJoin; never cached. Context/close/destroy cancellation, error/Retry, saved labels and immutable identity retained |
| DeliveryNote list/detail/save/delete/export and agreement financial status/actions | Direct operational reads/writes, no financial-policy cache. Page/list/export/save/delete have paired subscribed global leases and finalize. Body-appended detail/source reads use the editor's existing local StateMessage / ReferenceLookupStatus scope |

The changed finite lookup batches now normalize empty completion to their existing failure/Retry path before enabling a source-less editor; context cancellation still aborts the outer work. Retained cache refresh stays silent. New preparation removal blocks parallel delivery/financial entry during its pending decision/write. No new loading wrapper, timer, local cache or reference writer was created. Source conformance is checked; rendered overlay progress, cross-tab invalidation and cancellation timing require owner runtime acceptance.

## Query, volume and index evidence

Direct operational equipment options are bounded by one agreement's rates, rather than scanning/materializing every approved agreement. Server subqueries exclude busy units; two finite no-tracking projected reads return only the selected agreement and its available agreed equipment. Existing legacy read is finite. List stays Count + ordered page (max200); export remains matching pages. Quotation expansion is local O(total quoted units), capped at200, zero additional/per-row requests. Financial closure and sale preparation remove execution-demand queries while retaining current-custody/financial checks; this is a source change, not a measured latency claim.

Existing `(SubscriptionId, EquipmentMasterAgreementId, EquipmentId)` unique live rate index covers agreement equipment identity; primary agreement/quotation keys cover source selection. Existing FK indexes and historical order-line uniqueness are retained. No new unique agreement/equipment constraint: a returned unit can be hired again.

Optional SQL-plan candidates, proposals only (not applied):

| Candidate | Expected use / overlap / cost |
|---|---|
| DeliveryNote `(SubscriptionId, MasterAgreementId, DeliveryDate DESC, Id DESC)` INCLUDE `(DeliveryNoteDate, EquipmentId, ReturnDate, InvoicingStartDate)` WHERE `IsDeleted=0` | Agreement-scoped history page and finance custody reads. Overlaps the narrower FK index; assess replacing/retaining it from plans. More storage and writes on actual delivery/return |
| DeliveryNote `(SubscriptionId, EquipmentId)` INCLUDE `(DeliveryDate, DeliveryNoteDate)` WHERE `IsDeleted=0 AND ReturnDate IS NULL` | Busy-unit existence/availability. No uniqueness assumption; narrower active-custody scan than equipment FK. Overlaps equipment FK, adds write work when reserving/returning |

Owner measurements pending: compare identical tenant/agreement/data volume with cold and warm cache, normal network and equivalent hardware; capture request count/payload, SQL plans/logical reads and page/render timings. Use 1/20/200 agreed units and a quotation with quantities2+3. Verify one existing quotation read produces5 independent rows, no repeated initialization on Retry, and source/list filters remain scoped. No baseline/after runtime samples were available, so no speed percentage is claimed.

## Verification, guide and owner handoff

Source checks passed: 82 scoped TypeScript sources,24 external templates and2 inline templates parsed with zero syntax/template errors, missing local imports or duplicate imported identifiers. Bounded no-emit semantic analysis of both guides, guide model and quotation reference: zero diagnostics. Roslyn5 parsed20 directly related C# sources with zero syntax errors. Both resources parse as XML with zero duplicate keys. Scoped Git whitespace checks pass in each real repository; LF/CRLF conversion notices are informational. Reviewed touched tracked diffs and new directly related source separately; unrelated pending work was preserved. These checks do not prove an application build or runtime.

In-app guide updated: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/equipment-rental-guide.ts`, existing reader route `/UserGuide/equipment-rental` and existing section/menu. Covers quantity expansion, two tabs, direct delivery, site/contact, preparation cancellation, approved hours/duration, delivery-only invoice actions and financial close. `sales-guide.ts` reconciles the physical-custody boundary. Required notes fields remain valid. Existing routes/menu need no new guide reader. Owner should verify both languages, RTL/theme, scrolling and keyboard focus.

Schema handoff: owner must create/apply a migration for DeliveryNote Site/SiteContact (max500 nullable), suggested name `SimplifyEquipmentRentalDeliveries`. Reconcile with the un-applied schema additions already documented by prior operational and financial completion reports; no migration/snapshot edited here. The quotation row preparation itself requires no schema change.

Suggested commits (not executed): frontend `Simplify equipment delivery flow and expand quoted units into agreement rows`; backend `Allow direct agreement deliveries and retire rental execution writes`.

Manual owner acceptance: approved quotation with quantities2+3 -> five blank unit rows and proper basis; fill distinct units/prices, remove/edit then Retry without losing draft; save/reopen without reseeding. Duplicate units and invalid quantities fail explicitly. Approve -> create delivery with exact agreement/customer and available units -> save preparation -> cancel before actual delivery, or record actual handover and billing start -> approved time sheets/duration invoice -> post and effective approved collection -> physical return -> financial close. Verify prepared/actual competing custody and sale preparation exclusion; historical links stay readable and cannot be rewritten through retired endpoints.

Agent utilization: initial bounded backend/frontend delegation was attempted after freeze, but both workers failed on usage limits before doing work. Root completed and integrated the changes locally. The later quantity row fix is tightly scoped and stayed local. No builds, tests, lint, browser automation, database commands, migrations, snapshot changes, data deletions, commits, pushes or deployment performed.
