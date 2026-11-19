# Equipment Rental operations — bounded source audit

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-27 |
| Authorization | Source-read-only review; this artifact only |
| Scope | DeliveryNote, TimeSheet, independent EquipmentRentalInvoice; Equipment redirects |
| Execution | No build, tests, lint, browser, runtime, SQL, migration or source edits |

## Conceptual evidence for the owner's delivery-cycle question

The existing objects do not establish a complete billable rental cycle. DeliveryNote is the strongest operational owner: its real foreign keys identify the equipment, agreement, customer Partner and branch, and it stores delivery, return and invoicing-start dates. Its routed screen currently lists and views saved facts only. TimeSheet has three independently selected identifiers; it does not enforce a delivery/agreement relationship. EquipmentRentalInvoice currently exposes a six-field CRUD slice, despite inheriting the full financial InvoiceBase. No delivery/time-sheet conversion, remaining billable period, duplicate billing or return-based invoice cutoff was established in these three services.

A proposed future contract can use agreement commercial terms → actual delivery/unit/date → execution evidence when required → invoice for the unbilled accepted period, with a separately defined return/stop event. This is a recommendation, not verified current behavior or implementation authorization. Hours/day/month pricing, minimums, overtime/break handling, substitutions, approval, partial billing/overlap, tax and ledger effects require explicit business decisions. The root owns screenshot classification and the commercial Sale Orders decision.

Actual invoice inheritance was checked by namespace: `SiGma.Helpers.Models.Vouchers.EquipmentRentalInvoice` resolves `SiGma.Helpers.Models.Vouchers.InvoiceBase`, not the similarly named `SiGma.Helpers.EntityBases.InvoiceBase`. The correct base declares MasterAgreementNo, Currency/CurrencyId, CustomerId, FromDate/ToDate, Amount/Tax/TotalAmount and JournalVoucherId. Do not infer an absent-property compiler issue or erase these stored fields when reviewing its legacy UI.

## Confirmed findings

### OP1 — P1: TimeSheet customer options identify a different principal from the write FK

Trigger: select an ordinary Company/Individual customer in a TimeSheet create/edit dialog. `TimeSheet/components/details/details.component.ts:330–332` calls `CustomerService.getSelectList`; backend `Services/Customers/CustomerService.cs:132–158` projects Partner.Id restricted to Individual/Company. `Models/Staffs/TimeSheet.cs:12–13` instead declares a navigation to the separate `Models.Customers.Customer` entity. The snapshot confirms `TimeSheet.CustomerId → Models.Customers.Customer` at `Migrations/SiGmaDbContextModelSnapshot.cs:36633–36639`; Partner itself has a separate CustomerId relationship (`Configuration/PartnerConfig.cs:14–18`).

The generic write guard checks the FK principal from EF (`Services/Bases/Service.cs:267–284`). A selected Partner id is therefore rejected when no Customer with that integer exists, or associates an unrelated legacy Customer when ids coincide. This is identity incompatibility, not insufficient dropdown validation. BE8 explicitly requires producer/principal agreement. Recommendation: settle the authoritative customer identity and existing-data mapping before retargeting any FK; then align read/write/selection contracts. Data migration and deletion decisions remain with the owner.

### OP2 — P2: TimeSheet delivery and master agreement references are not enforced

Trigger: direct POST/PUT supplies positive nonexistent or mismatched delivery/agreement ids. `Models/Staffs/TimeSheet.cs:10–15` contains integer properties but comments out both navigations; `Configuration/TimeSheetConfig.cs:5–8` adds only the table mapping. `Services/TimeSheetService.cs:5–12` delegates to generic CRUD, whose reference checks only enumerate EF foreign keys (`Service.cs:269–277`). The dropdown membership guard in `details.component.ts:235–237,364–371` protects the browser only. Neither existence nor association to the selected delivery/customer/agreement is enforced for these fields.

Recommendation: first freeze which DeliveryNote and EquipmentMasterAgreement identities these fields represent and how historical records map, then enforce tenant/live existence and the confirmed association at the backend boundary. Do not assume a new approval, pricing or billing policy. Missing parent existence is a confirmed technical gap; exact cross-record business rules remain decisions.

### OP3 — P2: approved Customer/Branch cache consumers omit active watch/context behavior

`DeliveryNote/components/list/list.component.ts:166–179` performs finite cached Customer and Branch bootstraps only; there is no watch binding or context reset. `TimeSheet/components/details/details.component.ts:318–362` similarly reads cached Customer once and retains saved ids as fallback labels. The source services explicitly opt in (`shared/service/customer.service.ts:9`, `Administration/Branches/services/branch.service.ts:16`). Neither consumer uses `watchSelectList`/ReferenceLookupBindings. An open screen therefore keeps stale options after successful writer/topic invalidation or expiry, and does not clear its arrays on a cache context reset. The shared cache alone cannot push new values into a completed finite subscription.

Recommendation: adopt the existing separate watch after successful finite bootstrap, with selected-label/draft preservation, explicit context clearing, retained-data failure/Retry and teardown. Do not enable caching on DeliveryNote or EquipmentMasterAgreement document choices without source opt-in. This is existing UI2 adoption drift, not a new caching policy.

### OP4 — P2: DeliveryNote filter bootstrap uses control-local progress

`DeliveryNote/components/list/list.component.ts:166–179` owns only loadingLookups; it does not lease the page loader or use ReferenceLookupStatus. The template attaches `[loading]="loadingLookups()"` directly to both filter Selects at `list.component.html:8,11`. If the list settles before a slow lookup, the remaining required routed bootstrap has no page loading owner. This conflicts with the 2026-10-26 owner clarification/UI22. Recommendation: required filter bootstrap uses the existing page-scoped ReferenceLookupStatus; retained refresh remains silent. Preserve Select disabled/busy semantics and error/Retry.

### OP5 — P3: DeliveryNote ListVM and entity materialization exceed the grid contract

The grid uses eleven display fields plus Id (`DeliveryNote/components/list/list.component.ts:88–100`). Backend `DeliveryNoteListVm.cs:19–22` additionally ships Type, PONo, Ownership and OperatorProvidedBy, which are filter inputs/detail fields and not displayed or used by a list action. `DeliveryNoteService.cs:74–80,204–212` includes and materializes full Customer, Branch, MasterAgreement and Equipment entities before mapping; the mapper consumes only Customer.Name/No and Branch.Name (`DeliveryNoteProfiler.cs:11–14`). MasterAgreement/Equipment are not needed by the list projection. The detail path repeats the same unused Includes at service lines225–244.

Recommendation: scope the ListVM to its real display/action fields and use a no-tracking scalar projection for the existing names. Preserve filter predicates, historical scalar labels, count/page/order and detail identities. Savings are a source-supported hypothesis; no elapsed-time improvement was measured. This is BE7 list-scope/projection drift, related to known BE backlog item5.

## Observed grid/filter/write contracts

| Screen | Displayed and action fields | Applied filters and ordering | Paging/export |
|---|---|---|---|
| DeliveryNote | Id; DeliveryNoteNo, MasterAgreementNo, PlateNo, CustomerName/Code, DeliveryNoteDate, DeliveryDate, ReturnDate, InvoicingStartDate, Status, BranchName; View only | deliveryNoteNo (also No), masterAgreementNo, branchId, plateNo (also ChassisNo), fromDate/toDate using DeliveryDate then DeliveryNoteDate fallback, type/status/customerId/poNo/ownership/operatorProvidedBy; reserved grid; declared displayed sort fields with Id tie-break | GET DeliveryNote; count then clamp page then bounded 1–200 page; export fetchAllPages at200 with identical applied filters/grid/sort. Current-month/default branch initial filters; Reset clears branch and retains current month. |
| TimeSheet | Id, Date, DateRangeStart/End, DeliveryId, CustomerId, MasterAgreementId, HoursToInvoice, BreakHours, StartHM, EndingHM, OperatorOvertimeHours; View/Edit/Delete | Every displayed field except Id is also a top/advanced filter; dates are exact-date predicates, not from/to interval bounds; shared generic scalar filtering/grid/order | GET TimeSheet; shared count then 1–100 page; export/print fetchAllPages at100. UI corrects an empty out-of-range page. Full print rows use shared ReportPrintSession. |
| EquipmentRentalInvoice | Id, MasterAgreementNo, DeliveryNoteNo, EquipmentDetail, StartDate, InvoicingRule, Period; View/Edit/Delete | Six exposed fields as filters; StartDate exact date; shared grid/order | GET EquipmentRentalInvoice; shared count then 1–100 page; export fetchAllPages at100 using frozen applied filter snapshot. |

TimeSheet writes exactly its eleven fields (three dates, three ids, five integers), plus Id on Update. Frontend required dates/positive ids/integer range validation is explicit (`details.component.ts:97–108,240–258`); backend VMs have no corresponding date-order/required-positive annotations (`TimeSheetAddVm.cs:7–17`, Update same). Negative hours and reversed dates are currently accepted by the int/date contracts. Whether these represent corrections or invalid operations needs a frozen business rule; do not silently invent nonnegative hours, hour-meter or time-of-day semantics.

Invoice writes exactly MasterAgreementNo, DeliveryNoteNo, EquipmentDetail, StartDate, InvoicingRule, Period, plus Id on Update; text max lengths100/500 and required valid StartDate in UI. Its VMs do not expose monetary/customer/posting inputs. `EquipmentRentalInvoiceService.cs:35–59` blocks settled-document Update/Delete/batch Update through InvoiceSettlementWriteGuard and one lock; it does not supply pricing/posting/generation semantics. A create through this slice retains inherited defaults rather than creating a demonstrated priced invoice. This is incomplete business scope, not permission to build a financial writer.

DeliveryNote has no UI writer. Backend nevertheless inherits CRUD and has explicit Add/Update sales-availability checks (`DeliveryNoteService.cs:35–65`) under the shared SalesAgreement lock. This guard checks active Equipment.SaleStatus.Available when an open dated rental fact is written. It does not check another live rental note for the same unit. SalesAgreement reads open DeliveryNote facts (`SalesAgreementService.cs:1393–1395`); any rental uniqueness/overlap invariant and direct bulk writer coverage must be frozen before alteration. Generic EF FK validation checks positive/live/tenant identities individually, not agreement/customer/equipment consistency.

## Cache/read inventory

URLs below are relative to environment.baseUrl.

| Actual URL/service | Class and source owner | Consumer behavior and invalidation evidence |
|---|---|---|
| DeliveryNote GET and /{id}; DeliveryNoteService | Direct operational paged/detail read; no reference cache | List switchMap and dialog switchMap; no cache of facts or availability. |
| TimeSheet GET, /GetById/{id}; TimeSheetService | Direct operational read | Modal read cancels on close/destroy; list cancels replaced reads. |
| EquipmentRentalInvoice GET, /GetById/{id}; EquipmentRentalInvoiceService | Direct document read | Shared financial state is not a reference cache. |
| Customer/GetSelect; shared CustomerService | Approved reference; ReferenceLookupCacheService via BaseService cacheSelect=true | DeliveryNote filter and TimeSheet editor finite bootstrap; OP3 missing separate watch. Canonical source producers are Company/IndividualPartner successful writes and positive-row imports, plus lookup-customers topic; root owns final producer reconciliation. |
| Branch/GetSelect; BranchService | Approved reference; same shared cache | DeliveryNote finite bootstrap only. Branch typed writes use invalidateSelectOnSuccess (`branch.service.ts:40–53`); root owns topic/import reconciliation. |
| DeliveryNote/GetSelect; DeliveryNoteService | Direct reference, source has no cacheSelect opt-in | TimeSheet editor finite read. This is a document source; no new cache adoption required. |
| EquipmentMasterAgreement/GetSelect; EquipmentMasterAgreementService | Direct reference, source has no cacheSelect opt-in | TimeSheet editor finite read. Eligibility remains source-owned; generic labels do not prove business eligibility. |
| Currency/GetFinancialNumberPolicy; DocumentCurrency→FinancialNumberPolicyService.load | Existing direct financial policy service/cache contract, excluded from reference cache | Invoice editor template passes code/persisted only; no customer/supplier currency request is triggered. Shared DocumentCurrency always loads base policy once; uses ReferenceLookupStatus with dialog scope. FinancialNumberPolicyService.load/invalidate and successful Currency writers own refresh; no reference watch is appropriate. |

## Loading, cancellation and user recovery

| Operation | Actual ownership / lifetime | Disposition |
|---|---|---|
| All three list/search/page reads | defer inside switchMap; immediate busy; global startLoading/finalize endLoading; takeUntilDestroyed | Source request cancellation and lease release conform. Root must reconcile effective shell showPageLoading and rendered host. None of these feature routes declares Dashboard's silent exception. |
| Complete export; TimeSheet report data | Explicit global start/finalize; takeUntilDestroyed; fetchAllPages rejects failed pages | Source ownership conforms; full-output completeness and rendering require runtime check. |
| DeliveryNote required filter lookups | forkJoin, inline failure/Retry, destroy teardown; only local Select spinner | OP4; no page lease. |
| DeliveryNote dialog detail | switchMap id/null, close cancels and clears detail; local StateMessage and Retry; also global start/finalize (`list.ts:216–232`, html33–36) | Shared body-appended EditorDialog has local progress visible above overlay. The extra page lease is unnecessary and should be reconciled to UI22's dialog-read owner; do not claim two visible indicators without runtime. |
| TimeSheet/invoice dialog detail | local StateMessage+Retry; global start/finalize; close/destroy cancellation; read result checks recordId | Same page/local ownership reconciliation. Both disable closing during details and protect writes independently. |
| TimeSheet dialog lookups | forkJoin, individual recover preserving successes, local StateMessage+Retry, Save blocked on pending/error, close/destroy cancellation | Local scope is appropriate; approved Customer watch adoption remains missing. |
| TimeSheet/invoice Save/Delete | Global start/finalize, typed payload, both failure channels, retained draft; disable repeated action; shared confirmation for Delete | No feature success toast duplicates; standard mutation interceptor owns feedback. Writes cancel on destruction only and route dirty guard blocks departure while Save is active. |

Shared DataTable suppresses its own loader when globalLoading is true (`data-table.component.html:36–37`); PrimaryActionButton has the same shared suppression. Do not report duplicate table/button loading merely because the feature binds loading. EditorDialog supplies dialog lookup scope (`editor-dialog.component.ts:21`) and body-appended modal ownership. Runtime overlay/shell visibility is pending.

Both modal lists remount details by identity with `@for (id of [editorId()]; track id)` (TimeSheet html91–95; invoice html55–59). Therefore a route id change does not retain the previous child's form. Their controlled close paths preserve dirty confirmation, version fencing, beforeunload and focus. No stale-id finding is asserted.

## Query and index gate

Source query counts are boundaries, not measured SQL commands or latency. DeliveryNote list does CountAsync then one bounded entity materialization with four reference Includes. TimeSheet and invoice use shared count+page materialization; invoice materializes inherited financial columns through TPT InvoiceBase even though the list needs seven fields. Detail is one saved row; invoice adds one currency scalar query. Generic write checks run one existence read per modeled supplied FK; TimeSheet presently checks Customer only. No per-grid-row action reads were found. GetSelect document sources use generic GetDropdownAsync which materializes all eligible entity rows before selecting id/label/No (`Repository.cs:568–654`), so TimeSheet edit loads all delivery/agreement document entities; direct operational eligibility and projection deserve a later source-owned review.

| Query/table | Verified source coverage | Candidate / disposition | Benefit hypothesis, cost and owner verification |
|---|---|---|---|
| DeliveryNote tenant/live range + default DeliveryDate fallback ordering | Config has only four FKs; snapshot8998–9113 declares PK and BranchId/CustomerId/EquipmentId/MasterAgreementId indexes, no tenant/date composite | Do not add an index blindly: date predicate ORs DeliveryDate and DeliveryNoteDate, ordering uses DeliveryDate ?? CreatedAt. First project/measure and inspect plan. Candidate `(SubscriptionId, DeliveryDate DESC, Id DESC) INCLUDE (DeliveryNoteDate)` only after proving useful for dominant nonnull date branch. An independent null-date branch may need `(SubscriptionId, DeliveryNoteDate DESC, Id DESC)` with `DeliveryDate IS NULL`; unfiltered avoids IsDeleted-null mismatch. | May bound range work; does not guarantee satisfying COALESCE ordering or Contains searches. Two indexes increase insert/date-update/storage cost; compare actual plans/cardinality/IO before deciding. No schema recommendation is applied. |
| DeliveryNote open-rental unit fact used by SalesAgreement | Existing EquipmentId FK index supports unit equality, but tenant/ReturnDate/date predicates remain residual | Candidate `(SubscriptionId, EquipmentId, ReturnDate) INCLUDE (DeliveryDate, DeliveryNoteDate)` unfiltered; no uniqueness implied | May reduce tenant open-rental scan/lookup, overlaps EquipmentId FK but different leading key. Add/return updates incur maintenance. Inspect actual SQL/IO for tenant size and sale checks; don't drop FK coverage automatically. |
| TimeSheet tenant/live default Date/Id order | Snapshot24303–24385 PK plus CustomerId FK only | Candidate `(SubscriptionId, IsDeleted, Date DESC, Id DESC)`; query ListQuery requires IsDeleted=false, so equality key matches this path | May support bounded tenant/date page and exact Date filter; five numeric filters are residual. Additional index write/storage cost; test small/large tenants, selective customer/delivery filters, count/page and all-page export; consider a filtered IsDeleted=0 index only for this exact path and preserve other null/history consumers. |
| Invoice list TPT InvoiceBase→EquipmentRentalInvoice, StartDate order | Snapshot32938–32961 subtype PK/TPT and base28936–29077 PK plus six FK indexes | No new index justified from source alone: tenant/live predicate is on InvoiceBase, StartDate on subtype. A subtype-only `(StartDate DESC, Id DESC)` cannot guarantee tenant-first paging. First project and inspect join plan/cardinality; avoid an imagined tenant column on subtype. | Any base tenant/live/Id index overlaps all financial document consumers and requires scoped wider impact review. Keep proposal pending until plan shows the expensive side; no index-per-filter strategy. |

Reproducible owner measurement: same tenant/user/branch/language, data cardinalities and applied filters; cold and warm initial entry, repeated search, late-page navigation, dialog view/edit, lookup failure/Retry, canceled search, complete export/print. Record request count/payload, SQL command count and logical IO, count/page/detail timing and first usable/render timing over repeated comparable samples. No before/after result exists because this is a read-only source review; all SQL/timing/runtime acceptance remains pending.

## Additional conformance and limits

TimeSheet/Invoice mapping profiles retain unnecessary ReverseMap read/write directions (`TimeSheetProfiler.cs:10–13`, `EquipmentRentalInvoiceProfiler.cs:10–15`), matching known BE backlog21. Their unused FullListVMs require second-consumer proof before removal (BE backlog7). DeliveryNote list-specific extras are OP5. No migration or snapshot edits were made; existing user changes are not owned by this audit.

Equipment route aliases redirect root/create/view/edit/details to Fleet (`Equipment/equipment.routes.ts:3–24`); no duplicate Equipment implementation was reviewed. The broad authorization absence, generic delete-usage boundary and missing backend cancellation-token propagation are already known UI/BE backlog items, not newly discovered vulnerabilities. No permission system or financial lifecycle was inferred. In-app guide updates remain outside this read-only request.
