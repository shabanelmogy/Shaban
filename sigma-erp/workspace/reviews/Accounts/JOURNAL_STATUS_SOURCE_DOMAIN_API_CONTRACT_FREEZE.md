# Journal report — status, filter and movement source

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner first asks about Journal versus Ledger, then authorizes status badges,
posting filter, opening movement source and moving Journal buttons below filters.
No source changes were authorized for the initial comparison alone; the later
instructions authorize this bounded feature. TierM report extension. Existing
Journal is a paged line register, Ledger is one-account posted running balances.
Do not change default Journal population: all live-parent/live-detail states.
Ledger stays unchanged. No approval/post/void action, accounting or schema change.

## Frozen report contract and source evidence

GET AccountReports/Journals keeps existing filters and paging (1-based,1–100),
Results<JournalsLineVm> metadata and existing grid-filter path. Add optional
Filters[postingStatus], values posted/unposted/voided, absent/empty means all.
Reject other values with IsSuccess=false and actionable message. Precedence:
voided when JV.IsVoided; otherwise posted when IsPosted; otherwise unposted.
Posted excludes voided; unposted excludes voided. This makes current all-state
register explicit and explains why only Posted matches the Ledger population.
Filter before materialization/paging; grid filter/export must retain it.

Add response fields only for actual consumption: PostingStatus:string for
badge/column filter/export, JournalVoucherId:int for source/fallback identity,
SourceKind:string? and SourceId:int? for confirmed source navigation. No client
tenant or state input. DTO columns side by side: date/accountCode/accountName/
contact/type/voucherNo/postingStatus/plateNo/description/debit/credit; minimum
navigation fields journalVoucherId/sourceKind/sourceId. All existing columns
stay; postingStatus is placed beside voucherNo. One status value, not redundant
raw flags. Shared DataTable type=status with stable choices and translated
success/warning/danger badges; server owns derivation. Reset clears the new
filter; paging and fetchAllPages Excel preserve the applied snapshot/status.

Movement opening uses voucherNo cell's existing DataTable.link. Positive source
IDs must come from live tenant-scoped reverse JournalVoucherId FKs, never parsing
document numbers. Resolve only returned page's distinct JV IDs, one batched
query per supported source family, no per-row query. Primary confirmed sources:
Receipt, Payment, InvoiceBase family, Bill, CreditNote, DebitNote, PurchaseReturn,
CashDeposit, CardTransactionBankTransfer and Provision. Invoice kind follows
actual CLR subtype before InvoiceCreatingType (same evidence as InvoiceProfiler),
not VoucherType string alone. SourceKind allowlist: receipt/payment/bill/
creditNote/debitNote/purchaseReturn/cashDeposit/cardTransfer/provision and
invoice:rental/lease/taxAdvance/workshop/limousineBulk/equipmentRental/
transportation/miscellaneous. For missing, unsupported, deleted or ambiguous
original sources use the actual JournalVoucher details as explicitly labelled
fallback; do not guess an original record. Multiple candidates fall back rather
than selecting an arbitrary first. Source metadata is navigation-only and must
not become an unsupported grid-filter choice.

Frontend invoice navigation reuses invoiceViewPath/INVOICE_ROUTE_REGISTRY from
Invoices/Invoice/models/invoice-route-registry.ts (read-only approved source).
Other confirmed routes: /Receipt/details/:id, /Payment/details/:id,
/Bill/details/:id, /CreditNote/details/:id, /DebitNote/details/:id,
/PurchaseReturn/view/:id, /CashDeposit/view/:id,
/CardTransactionBankTransfer/view/:id, /Provision/details/:id. Fallback:
/JournalVoucher/details/:journalVoucherId. Existing view/readonly ownership and
server write guards remain; navigation neither grants access nor posts a journal.
Use one allowlisted report-owned route helper, no arbitrary server URL.

Journal main strip grows to six fields (adds posting status); action wrapper
uses existing sigma-field--full and no invisible caption on its own row.
Use shared report-template six tracks without a spare auto action track;
1250px three-track and640px single-column fallback remains. No new global CSS,
private skin, route, provider, confirmation or permission mechanism.

## Workstream ownership and validation

Root owns discovery/freeze, all Journal frontend/models/helpers, EN/AR vocab,
guide and reconciliation. Backend worker owns GetJournalsAsync only within
AccountReportsService, JournalsLineVm/RequestDto and new report-local source
resolver/projection files if needed. Preserve all prior user/peer changes.
No shared file overlap. Namespace/import/SDK inclusion must be checked.

Patterns: UI screen07/UI5/6/20/21, BE3/9/17; exact shared DataTable status/link,
ReportActions and route registry inspected. Phases0/1 discovery+this freeze,
2 read/filter/export,5 navigation/wiring,6 reconciliation. No editor/actions.
Recipe Check all8 OK, no canonical change needed for feature-specific policy.
Source-only verification; no builds/tests/lint/browser/DB/migrations/snapshots/
commits/deployment. No migration. Owner runtime checks: all three statuses,
empty/invalid/all filters, same source on every line, page/export coverage,
valid original/fallback routes, deleted/ambiguous source behavior, EN/AR and
narrow-layout actions. Existing date, vehicle, currencies and journal grouping
limitations are outside the newly authorized scope; record instead of rewriting.

## Source-registry reconciliation clarification — 2026-10-23

The inspected canonical invoice registry's SOURCE_VIEW_ROUTES also maps
limousineSingle to the same LimousineInvoice view route as limousineBulk.
Include invoice:limousineSingle in the allowlist using that existing route
owner; there is no reason to fall back for this known subtype. This completes
the exact InvoiceProfiler discriminator correspondence without a new route or
business policy. Root applies this small integration correction after the
backend worker's bounded handoff; no concurrent file editing.
