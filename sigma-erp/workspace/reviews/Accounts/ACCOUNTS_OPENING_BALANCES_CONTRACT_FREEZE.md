# Accounts — Opening Balances frontend handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date: 2026-10-05. Authorized request: review src/app/modules/Accounts and apply guide fixes. This handoff freezes existing accounting/API semantics for the frontend conformance refactor; it does not reopen historical business decisions in OPENING_BALANCES_FEATURE_REVIEW.md.

UI shape 05 financial collection editor; backend Pattern 3 with financial effect. References: actual openingBalances components/details and tab editors, shared EditableCollectionTable public inputs, EditableRows, SummaryCards, Workshop Job editor controls. Owning blocks UI1/3/10/14/16/17/19/22/24/27/28 and BE15. Packets regenerated and all eight -Check OK before source work.

## Existing domain/API contract

Each existing OpeningBalance{Account,CostCenter,Customer,Supplier,Staff,Stock,Prepaid,Deposit} GET returns its rows; POST AddList sends {expectedVersion, items} and replaces that source's entire set. Preserve the exact existing bulk API, version, row mapping and posting/lock rules. OpeningBalanceState GET owns version/isLocked/lockReason, not frontend flags. OpeningBalanceBatch GET/PUT owns first-fiscal-day openingDate; no client date entry. Tenant/ledger totals/JV state remain server-owned.

| Tab | Client row inputs (models/create.ts ↔ backend *AddVM) |
|---|---|
| Account | accountId; nullable branchId/costCenterId; detail; debit/credit |
| Cost center | accountId, branchId, costCenterGroupId, costCenterId, detail, debit/credit |
| Customer | optional saved id, customerId, voucherDate, voucherDetail, agreementNo, debit/credit |
| Supplier | supplierId, voucherDate, voucherDetail, debit/credit |
| Staff | staffId, voucherDate, voucherDetail, debit/credit |
| Stock | itemId, integer quantity (1..int.MaxValue), description, debit/credit |
| Prepaid | accountId, vehicleId, voucherDetail, debit/credit |
| Deposit | optional saved id, agreementNo/contactCode, customerId, depositType 0/1, amount, notes |

Keep existing limits (detail/notes 1000, references 100), exactly one positive debit/credit side, monetary precision from FinancialNumberPolicyService. Source voucherDate is document metadata, never GL openingDate. Fix frontend real-date validation/serialization with shared owner without changing server date policy. Totals during editing remain labelled preview values and never enter the write payload. No new prepaid dates, amortization rules, settlement actions or deposit voucher metadata are in scope.

## Confirmed conformance repairs

| Concern | Book/reference/shared owner | Target resolution |
|---|---|---|
| Page/panel/scroll | UI1/14; existing global sigma editor shell, EditableCollectionTable fillHeight/stickyHeader | Remove feature viewport subtraction, palette and shared table internal overrides; bounded host and one row scroll owner, fixed totals/save |
| Total cards | UI24; shared SummaryCards | Replace eight feature total markup copies using typed descriptors and money format; preserve current preview calculations |
| Rows/removal | UI14; EditableRows.requestRemove | Typed row add/remove/replace, saved identity for confirmation, busy/lock recheck after confirmation; no saved row removed as an untouched new row |
| Validation/controls | UI16/17/19/27; shared FieldError/DatePicker/numeric appearance | Stable dropdown column widths, accessible actual input IDs, real dates, shared errors and focus; preserve existing stock Quantity widget changes |
| Failure ownership | UI22; interceptor/apiErrorMessage | Eliminate duplicate API toast; local validation/conflict-discard workflow remains distinct; required lookup/load failure blocks save and has retry |
| Dirty exit | UI10; shared confirmDiscard | Tabs/route exit protect drafts, busy prevents mutation, no ordinary Save confirmation |

Reference actions: row Add/Remove and Save are Supported; View/account conversion/approval/posting/void belong to other surfaces and are Not Applicable here. Save is gated on loaded rows/state/lookups and busy/lock; failure keeps entered rows. Successful Save has one final feature feedback after mandatory rows/state refresh, using existing skipSuccessToast. No draft reset on failed refresh; report recovery separately.

Initial user edits: stock.component.ts/html already modified (Quantity widget). Preserve both; baseline timestamps recorded at C:/Users/user/AppData/Local/Temp/sigma-accounts-discovery.json. Other Accounts files initially clean. Do not change unrelated modules, backend semantics, migrations or snapshots. Source-only verification; no build/test/lint/browser/database/commit/push/deploy. Any contract conflict returns to root before affected edits.

## Owner-approved opening latency amendment — 2026-10-05

Owner accepts the preceding source diagnosis and authorizes the proposed improvement. Frozen scope: extend GET OpeningBalanceState with optional sourceKey equal to one of the existing eight entity/source keys. Omitted key keeps the existing all-eight response/order; a valid key returns the unchanged Result<List<OpeningBalanceTabStateVM>> envelope containing only that source; unknown keys fail400 without executing source queries. Keep existing tenant/live/marker predicates, lock precedence, journal/allocation checks, complete rows and version hash serialization. Selected-source state reads reuse the same successfully validated batch list inside ComputeVersionAsync; write-side callers continue independently querying batches and checking the identical hash.

DetailsComponent must prepare/configure the existing batch, invalidate stale client state, and mount the active tab without waiting for all-source state. Each active editor requests its own source through the shared base in its existing parallel row/lookup/policy load. Save remains blocked until its own valid state/version/rows/lookups load. Existing after-save mandatory rows and forced-state refresh remains. Frontend request cache is partitioned by source (including legacy all-source key), merges successful selected states, and clears every cached source on batch preparation or forced post-save refresh. Late invalidated requests cannot update fresh state/cache. Failed requests remain retryable. No same-DbContext parallel queries, financial formula/posting/change/migration, omitted-row payload change or application-wide cache framework.

Impact classification: Extend controller/interface/state read to optional selected-source; Extend shared frontend state cache; Refactor parent load ordering; Reuse known batch projection within version reads. Keep all eight editors, AddList writers, serialized replacement locks, dirty navigation, expectedVersion verification, templates, rows/forms/preview totals, GET batch/configuration API and original all-source compatibility. Five selected-state query materializations replace41 in the initial all-source critical path before allocation checks; elapsed-time benefit requires owner runtime measurement. No agent delegation: these files share one tightly coupled producer/consumer/cache contract.
