# Branch data-scope core coverage

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Explicit EF query filters, original/current write guards, and guarded set-based writes |
| Runtime evidence | Final focused backend suite: 170/170, including immutability/overflow and receivable/source-owner regressions. UI suite: 77/77 and final development app build passed. Earlier core SQL Server owner-move race and HTTP acceptance remain historical core evidence. New Asset/Sales schema is not applied; no new DB posting or visual acceptance is claimed. |

## Registered direct owners

The registry explicitly covers delivery notes, equipment, vehicles, revaluation
headers/lines, opening-balance account/cost-center rows, rental quotations,
banking movements, PDC documents, limousine trips, vehicle movements, purchasing
roots, stock issue/return/transfer roots and transfer lines, tariff settings,
accrual/amortization rows, financial document roots, rental invoice snapshots,
sale/work orders, journal headers, and branch selection itself. Nullable branch
ownership fails closed for an ordinary user; tenant administrators bypass branch
edges but never tenant ownership.

`ForTransactions` changes the context parameter from read branches to transaction
branches. `Vehicle` and `Equipment` branch changes require `CanTransfer` on the
persisted source and write access on the destination. The guard reloads originals
without query filters, authorizes old and new ownership, and pins EF concurrency
originals to that authorized persisted value so a later race still conflicts.

## Aggregate and inherited coverage

| Shape | Read rule | Write rule |
|---|---|---|
| Journal voucher | Whole document = header plus every effective line edge; report-effects = permitted effective lines only | Original/current header and line edges, tracked new parent fallback, FK/branch concurrency |
| Generated rental accrual, reversal and amortization journal | A generated journal of the reviewed type without a header branch must have at least one live line, and every line must be within the reader's scope | Preserve tenant ownership and require every original/current effective branch. Manual or unproven branchless journals stay admin-only |
| Saved accrual and amortization runs | Header requires every saved line's branch. Amortization also proves the schedule and branch agree | Run operations use transaction branches. Accrual preparation and commit recheck the complete company-month input set before reserving or approving it |
| Stock transfer | Destination plus every source line, including direct child queries | Original/current graph and `source → destination` transfer ability |
| Invoice | Header plus every persisted `RentalInvoiceItem.BranchId`; header reports remain all-of | Header writes recheck historical line snapshots; line writes check snapshot plus invoice header |
| Booking | Pickup and drop-off branches | Both endpoints and tracked/persisted parent resolution |
| Agreement | Current vehicle branch; lease also includes all historical replacement endpoints | Vehicle writes own transfer check; replacement/document/log parent links and historical edges guarded |
| Transportation agreement | Vehicle branch plus all item pickup/drop-off endpoints | Header/item original/current edges and parent vehicle |
| Equipment master agreement | Every rate's equipment branch; a master with no rate has no ordinary branch owner | Rate equipment edges and full persisted rate graph |
| Purchasing/financial children | Explicit parent branch paths only | Original/current FK owner, including detached reparenting |
| Stock issue/return children | Owning transaction branch despite absent CLR child navigation | Batched parent loads plus tracked aggregate fallback |
| Cash deposit | Header branch plus every detail's discriminator-selected receipt/payment branch; direct child reads use the same whole-document graph | Persisted aggregate graph plus original/current header, parent FK, discriminator and source FK edges |
| Customer deposit | Exactly one of receipt, PDC, or opening-balance/JV source; optional booking adds both endpoints; every usage branch participates in the all-of document graph | Same complete source/usage graph; opening JV uses whole-document edges |
| Booking charge | Every populated explicit EF shadow owner (`BookingId` and/or `AgreementId`) must be visible; no name inference or OR bypass | All populated shadow FK originals/current values and tracked collection owners are checked |
| Opening-balance customer/deposit/prepaid/staff/stock/supplier | Required journal owner plus every effective journal-line branch; null journal ownership fails closed | Original/current journal FK and whole-journal graph |
| Provision and detail | Provision journal owner plus every effective journal-line branch; details inherit the same whole graph | Provision original/current journal owner and detail original/current parent FK |
| Bank reconciliation and line | At least one persisted line owner and all effective referenced journal-detail branches; header and direct child reads share the complete graph | Original/current reconciliation parent and journal-detail FKs; ownerless records fail closed |
| Equipment sale preparation | Saved TransferJournal and optional DepreciationJournal, each complete effective graph; no dependence on the equipment's later branch; missing/foreign/zero owner closed for ordinary users | Original/current equipment branch, same-tenant asset and linked journal graphs; source-first and depreciation-first stages remain valid before the required final transfer journal; uses shared journal guard |
| Asset and depreciation | Asset has required branch on all new/edit/import paths; ordinary users cannot read an unclassified legacy asset. Existing depreciation history follows its saved complete journal graph | Original/current branch, source/destination transfer capabilities before history; historical valuation/branch changes locked. Preview token includes branch and save revalidates before one journal per branch in the same transaction |
| Sales agreement and descendants | Every live unit's saved sale branch, independent of its later current equipment branch; direct item/payment/delivery/invoice/allocation reads inherit the complete agreement graph | Original/current parent and source unit checks; snapshot is server-owned and immutable for the same unit; financial history locks unit substitution and non-open item mutations |
| Sales invoice and charge children | Complete agreement and allocation branch graph, including legacy agreement InvoiceId; direct MiscInvoiceItem queries use the real shadow parent FK | Batched original/current shadow parent checks; saved Sales charges, links and allocations cannot be changed or reparented, including by adding new charge children; tracked Added aggregate supported |
| Sales invoice allocation | Immutable per-unit saved branch/net/tax/total, all-of parent access | Same-tenant invoice/item/branch relationships, remaining net/tax budgets, stable shared rounding; no legacy allocation inference |

## Set-based boundary

`DemandBranchWriteScopeAsync` accepts either a tenant-bounded predicate or an
already unfiltered tenant target query. It materializes the target originals as
a batch and validates each ownership graph; it does not compare counts through a
single `IgnoreQueryFilters` query and does not rely on ChangeTracker originals.
The caller retains its transaction and must invoke the demand before its first
`ExecuteUpdate`/`ExecuteDelete`.

## Intentional exclusions and remaining adoption

- Shared company definitions (`Partner`/customers/suppliers, payment methods,
  items and other catalogues) remain tenant-scoped according to the owner
  decision; their incidental branch-like fields are not operational row grants.
- `QrLabel.Branch` and free-text bank/payment-instruction branch labels remain
  excluded because the source does not establish branch-FK ownership.
- Secondary purchasing provenance links do not automatically become access
  edges; the frozen owner document is the authorizer unless a source-specific
  full-content contract says otherwise.
- Report-effects mode is deliberately limited to journal line effects. Invoice
  header totals stay all-of because the current invoice writer groups one branch
  per generated invoice and historical `RentalInvoiceItem.BranchId` remains the
  authoritative line snapshot.
- Runtime SQL translation, migration/model reconciliation, full test execution,
  and owner acceptance remain root-owned. No build, test, migration, database,
  commit, push, or deployment command was run by this worker.

## Root integration outcome — 2026-11-06

The registered core passed 73 tests after expansion and the SQL Server race:
the Vehicle branch UPDATE stayed blocked until the RentalAgreementDocument
commit, then committed second. Full RentalAgreement/direct-document translation
is covered after removing the sibling TypeIs. CustomerDeposit source cardinality,
same-tenant Booking existence, direct usage reads and nullable live JV lines
have regressions. Dashboard workflow counts are WholeDocument reads, not a
journal effect scope. Snapshot/model relational differences are zero after the
authorized isolated migration and metadata synchronization.

This is **registered-core acceptance**, not whole-application completion.
Vehicle operational records without a saved branch await the recorded owner
decision. Asset/depreciation and Sales ownership decisions were subsequently
resolved and implemented as described in the 2026-11-07 continuation below.
EquipmentSalePreparation now uses its
required transfer journal and optional depreciation journal; a later equipment
move cannot rewrite that history. The active legacy Guid-based
NonRentalMovement CRUD and approval permissions are temporarily non-assignable;
the actual MVC filter and session tests reject even an old direct grant, while
the current NRM is unchanged. This is fail-closed pending source repair, not
invented Guid mapping or completion of the legacy workflow. The final
reconciliation records UI/browser limits and actual
HTTP query/timing measurements. Services launched for acceptance were stopped
after verifying their current executable paths and launcher identities.

## Root continuation — 2026-11-07

The owner required a branch for each asset, the unit's branch at sale time for
sales history, and one invoice proportionally allocated to those saved branches,
including amount-only stages. The corresponding source, query/write guards,
allocation builder and actual service preflight are implemented. The 170 backend
tests include the latest MiscInvoiceItem tracked-new-parent, immutable source,
oversized amount, source-owned invoice and receivable branch fixes; the 77 UI tests
include canonical report/import landing paths and read/draft/write lifetimes.
These tests do not prove SQL Server posting on the unapplied model.

The model-only difference contains exactly 12 operations for
`AddAssetAndSalesBranchOwnership`: Asset and SalesAgreementItem branch columns,
their two indexes/FKs, two tenant/id alternate keys, and the allocation table
with its constraints, FKs and three indexes. No migration or snapshot was
generated or edited and no DB connection was opened by this check. The old
zero-difference statement above applies to the earlier core checkpoint only.
Runtime new-schema, multi-line customer-receivable integration, SQL plans,
performance timings and visual acceptance remain separately pending.
