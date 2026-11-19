# Sales Review Fixes — Contract Freeze

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-04 |
| Request | "نفذ الإصلاحات المؤكدة لـ Sales" — implement findings S01–S20 of `SALES_FEATURE_REVIEW.md` |
| Baseline | `SALES_CYCLE_CONTRACT_FREEZE.md` (Frozen 2026-10-03) — amended here, not rewritten |
| Owner rules applied | Business-correct over easy; decide and record; test data is no blocker |

## 1. Decisions

| ID | Finding | Decision | Evidence / reason |
|---|---|---|---|
| F1 | S01, S04, S16 | Every sales-cycle write that reads state and then writes it runs inside the shared tenant lock `UnitOfWork.ExecuteUniqueWriteAsync<SalesAgreement>`: agreement add/update/remove/cancel/invoice/deliver/close, and receipt add/update/remove/void/unvoid when the receipt (before or after the change) links a sales agreement or a sales quotation. All checks are re-read inside the lock. Equipment add/update run inside `ExecuteUniqueWriteAsync<Equipment>`, so the duplicate-plate check and the write are serialized. State columns are EF concurrency tokens (no schema change): `SalesAgreement.Status`, `SalesQuotation.Status`, `Equipment.SaleStatus`, `Equipment.IsActive`; quotation update marks the root modified so a child-only edit still checks `Status`. | BE 14 "check/save concurrency is a separate reason for isolation"; existing references `JobService.CloseAsync` (lock) and `QuotationConfig` (state tokens). A unique plate index is **not** added: normalization of existing plates is an owner decision; the lock closes the race without a migration |
| F2 | S02 | Quotation update removes omitted rows from the tracked collection before recalculating payment terms | `TotalAmountWithTax` filters `IsDeleted`, which is only set at save |
| F3 | S03 | Update keeps the stored `TaxPercent`; the settings rate is resolved on Create only (direct agreement) | Contract §3: the agreement keeps the rate it was priced with |
| F4 | S05 | Voiding, deleting or editing a receipt of a Closed agreement reopens it to Delivered when an outstanding balance appears. Unvoid re-runs the same eligibility as Add (agreement Open/Invoiced/Delivered and amount ≤ outstanding; quotation receipt: quotation approved/converted and no other live down-payment receipt). A receipt of a Cancelled agreement cannot be unvoided | A bounced cheque after closing must be recordable (business-correct), and the agreement state must follow the balance |
| F5 | S06 | Equipment delete is refused when the unit has any sales-agreement item, sales delivery note or equipment-rental delivery note; its documents and warranties are soft-deleted with it | BE 8 dependency-aware delete; backlog 23/31 stays for the generic engine |
| F6 | S07 | Update releases every unit that was on the agreement before and is not on it after (old set minus new set), including a unit swapped on a retained row | — |
| F7 | S11 | Installment amount = remaining ÷ count **rounded down** to the money decimals; the last installment takes the remainder, so no row is ever negative. Same formula in the quotation, the agreement domain and every frontend preview | Supersedes contract §3 "rounded" per-installment |
| F8 | S13 | Backend rejects (instead of silently ignoring) a purchase-cost change on a Sold/Delivered unit. Frontend: quotation-owned terms (down payment, installments, terms text) are read-only on an agreement made from a quotation; agreement date and first-installment date are read-only once a receipt exists; purchase cost is read-only for Sold/Delivered units | Field state must match ownership |
| F9 | S19 | Due-installments report is computed in the database: rows in the range only, each row's paid amount = clamp(received − amount of the rows before it, 0, amount) through correlated sums; filter, totals, count, sort and page in SQL | Allocation semantics unchanged; work bounded by the page plus aggregates |
| F10 | S20 | Allocation order: down payment first, then installments by date, then serial number (numeric). Same order in details, report and the receipt default row | Contract D11 wording wins over the implementation |
| F11 | Fleet grid | `EquipmentListVM` drops `engineCapacity` and `fuelTankCapacity` (not displayed); print shows the same columns as the grid | AGENTS.md list-VM rule |
| F12 | Due report | `ToDate` at `DateTime.MaxValue.Date` no longer overflows (exclusive end capped) | — |
| F13 | S08–S10, S12, S14, S15, S17, S18, SA-C1 | Frontend only, through the existing shared owners: per-line VAT preview equal to backend lines; settings rate applied to pristine new rows after load; manual schedule dates kept by SrNo when the terms that produce dates did not change; shared upload/cleanup lifecycle with busy-exit refusal and cleanup-only retry; retry of the actual source; document number/dates required with strict expiry > issue; one error-feedback owner per call; server-corrected page number applied; action dialog content-sized with an inner scroll owner | UI 13/17/19/20/22 |

## 2. Contract changes

| Surface | Change |
|---|---|
| `EquipmentListVM` | − `engineCapacity`, − `fuelTankCapacity` |
| Agreement / quotation schedule amounts | Formula F7 (values only; shape unchanged) |
| Agreement detail and due-report paid amounts | Order F10 (values only) |
| Errors | New key `SalesAgreementUnitCostLocked` (en/ar). Unvoid reuses the existing collection messages; Equipment delete uses the generic in-use message of `RemoveWithChildrenAsync` (implementation note 2026-10-04: the two other planned keys were not needed) |
| Concurrency failures | A stale write now fails with the existing localized 409 (`ConcurrentWriteConflict` lock timeout, or the central `DbUpdateConcurrencyException` handler) |

## 3. Migration

No table or column changes. The concurrency tokens change the EF model, so the owner runs `Add-Migration SalesConcurrencyTokens` to bring the model snapshot in line (expected: empty `Up`/`Down`); without it EF reports pending model changes.

## 4. Implementation record (2026-10-04, source-only — status of this handoff: Implemented — source-only)

| Item | Result |
|---|---|
| Backend | F1–F12 implemented: `SalesAgreementService`, `ReceiptService`, `EquipmentService`, `SalesQuotationService`, `SalesAgreement`/`SalesQuotation` domain, `FinancialNumberPolicy.FloorMoney`, three EF configs (tokens), `EquipmentListVM`, resx key. Locked-terms branch now also keeps the quotation's terms (frontend mismatch 1) |
| Frontend | S08–S18, F7, F8, F11, SA-C1 and quotation date-range validation implemented by the frontend worker; S20 needed no frontend change (no client-side allocation) |
| Recorded deviation | S08 follows the backend per-line VAT rounding of `SalesQuotationItem`; UI 19 "never sum rounded per-line taxes" and BE backlog 24 stay the owners of a future per-rate document VAT change |
| Open owner decisions | Fleet document upload folder (`PartnerDocuments` vs `CustomerDocuments`); Fleet editor still the legacy modal (type 02 routed editor is a separate refactor); unique plate index after plate normalization |
| Pending | `Add-Migration SalesConcurrencyTokens`; builds; runtime race, reversal, rounding, print/RTL/dark verification |

## 5. Re-review follow-ups (2026-10-04, source-only)

| Remaining item | Fix |
|---|---|
| Quotation down-payment receipt could exceed the agreement balance, even after Closed | Receipt add/update/unvoid through a quotation that has a live agreement apply the agreement's collection rule (Open/Invoiced/Delivered, amount ≤ outstanding): `ReceiptService.ValidateQuotationAgreementAsync` |
| Equipment cost edit vs invoice | `Equipment.PurchaseCost` is also a concurrency token: a stale invoice or a stale cost edit fails with 409 instead of posting a cost that changed |
| Quotation unapprove vs collection | `SalesQuotationService.UnapproveAsync` runs in the tenant sales lock, the same lock receipt writers take |
| Due report loaded every in-range row | Filter, totals (`GroupBy(_ => 1)` over joined grouped derived tables), count, sort and `Skip/Take` run in SQL; only the page is materialized. Overdue-days sort uses the equivalent due-date key |
| Fleet cleanup retry lost its destination; last-page clamp | Frontend worker (follow-up) |

Translation risk to verify at runtime: the due-report query (cross join grouped per payment, `Concat` + `GroupBy` for received, left joins, aggregate over the joined columns) is source-reviewed only.

## 6. Second re-review follow-ups (2026-10-04, source-only)

| Remaining item | Fix |
|---|---|
| Concurrent relink of a receipt could leave a Closed agreement with a balance | Receipt update, delete and void/unvoid always take the tenant sales lock and read the receipt's current links inside it; the reopen check runs on the links before and after the change |
| Reducing a receipt of a Closed agreement was refused | `ResolveSalesAgreementAsync` accepts an edit of a live receipt of the same Closed agreement when the amount does not increase; the agreement reopens to Delivered after the save (F4 as frozen). New money on a Closed agreement stays refused |
| Fleet stayed on an empty page after an external delete | `EquipmentService.GetManyAsync` clamps `PageNo` to the last page and returns it; the frontend already follows the returned page |

## Due report translation repair — 2026-10-08

Owner reported DueInstallments load failure and supplied InvalidOperationException with stack at SalesAgreementService.GetDueInstallmentsAsync line579. Runtime evidence confirms LINQ translation failure before totals FirstOrDefaultAsync; SQL execution/data absence/authentication are not the cause of this supplied failure. The rejected predicate includes r != null / b != null over left-joined anonymous grouped aggregate projections. Source diagnosis: these object null tests must become nullable scalar amount handling; previous source-only report had explicitly left this query's translation acceptance pending. Frozen repair within the existing authorized Sales implementation: received and allocated-before Amount projections use nullable decimal sums; left=(r.Amount ??0m)-(b.Amount ??0m). No AsEnumerable/early materialization, correlated aggregate rewrite, new query engine, formula/order/date/filter/page/receipt/tenant/status/API changes. Canonical BE17 owns database aggregation; Microsoft EF complex-query docs explain translation depends on recognized shapes. Guide workflow stays the same; reconcile/update the due-topic note with the unchanged zero-allocation semantics. No workers (one sequential query fix), builds/tests/runtime/database/browser/migrations or commits. Owner endpoint execution/translation/financial boundary acceptance required. Attachment credentials will not be copied into review artifacts.

Packet refresh — 2026-10-08: at the owner's request, regenerated all derivative recipe packets from the canonical Master/UI/Backend books using `Generate-SigmaRecipes.ps1`; `-Check` now returns OK for PLAN-00 and PHASE-00 through PHASE-06. This supersedes prior stale-packet notes in this review's earlier historical entries; generated files remain derivative and were not edited directly. The current Sales review uses the refreshed Phase 01 domain/API, Phase 02 report/grid, Phase 03 editor/write, Phase 04 action, Phase 05 integration and Phase 06 reconciliation packets.

DueInstallments summary layout follow-up — 2026-10-08: switched the report totals to the shared `app-summary-cards` `slim` density and added a 12px host margin before the table. The Agreement No filter now fills its field width for consistent alignment with the other controls. Only scoped FE template/component style and the existing Sales guide text changed; no API, backend, schema, calculation, or shared-component contract changed. Source-only validation remains owner-pending for build/runtime and visual acceptance.

DueInstallments filter alignment follow-up — 2026-10-08: the filter strip now uses the shared inline grid with four filter columns and the report actions in the same desktop row. Agreement No uses the standard form-control surface plus shared filter tokens for matching border, focus, height and width. Responsive behavior remains owned by the shared report-filter breakpoints; no API, backend or calculation contract changed.

DueInstallments visual correction — 2026-10-08: aligned the filter strip with the canonical inline report pattern by reserving the actions caption track, grouping the action controls, using an explicit three-field plus checkbox/actions grid, and switching Agreement No to the shared PrimeNG input-text control. This corrects the cramped checkbox/action spacing while preserving responsive shared breakpoints and all report behavior.

DueInstallments checkbox alignment follow-up — 2026-10-08: vertically offset the Include paid installments control to the same baseline as the labeled date/customer/agreement inputs in the inline strip, with a mobile reset at the shared stacked breakpoint. No behavior or contract change.
