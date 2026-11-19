# Authorization 211–220 — scoped operation freeze (2026-11-14)

| Field | Decision |
|---|---|
| Status | Frozen for source-supported permissions and legacy-child containment; independent business gaps identified below remain pending owner decisions |
| Scope | Actual UI routes 211–220, parent-owned children, access lifecycle and direct HTTP grants; preserve existing financial/stock and approval contracts |
| Boundary | No synthetic grant, financial formula, journal posting, source conversion or database/schema changes; no replacement of the parent aggregate with a child editor |
| Verification | Source, scoped build/tests separately recorded; browser/SQL and real-grant revoke acceptance remain pending |

## Existing handoffs

The inventory row 212 `/Payment` is adopted under `PAYMENT_ACCESS_ADOPTION_CONTRACT_FREEZE.md` and `PAYMENT_ACCESS_ADOPTION_FINAL_RECONCILIATION.md`; its nested dated amount rows are owned by `PaymentService` and the payment editor. Rows 214 `/Provision` and 215 `/ProvisionDetail` follow `PROVISIONS_ACCESS_CONTRACT_FREEZE.md`, `PROVISIONS_ACCESS_RECONCILIATION.md` and `PROVISION_DETAIL_RETIREMENT_HANDOFF.md`. Provision's remaining branch-definition decision is not inferred here. The request detail child 218 `/PurchaseRequestDetail` already uses an Angular redirect to `/PurchaseRequest` and has no standalone controller.

## Retired independent children — 211, 213 and 220

`MiscInvoiceItem` is a charge row of a `MiscellaneousInvoice`. The parent `MiscellaneousInvoiceService.Read` loads its charges only through the invoice detail, and the parent update controls child identity and financial calculations (`NOTES_CORE_MISC_ACCESS_COMPLETION_CONTRACT_FREEZE.md:16–18`). The inherited generic `MiscInvoiceItemController` formerly allowed independent list/detail/select reads even when its writes were rejected; the generic child service had no owning-invoice/branch read filter. All of its inherited operations, reads included, are nonassignable and return HTTP 405 even for administrators, with direct service denial before repository access. Historical Angular `/MiscInvoiceItem/**` entries redirect to the owning `/MiscellaneousInvoice` list; the old child identifier is never interpreted as a parent identifier. Do not create a `MiscInvoiceItem.View` grant to read a parent invoice.

`PaymentDetail` has no current controller; the old Angular scaffold requested a nonexistent independent HTTP resource. The effective owner is `Payment` and its dated amount rows under the existing payment contract. Historical `/PaymentDetail/**` entries redirect to `/Payment` without mapping a child id to a parent id; no independent child grant or write is introduced.

`PurchaseReturnDetail` has no current controller and its generated CRUD screen is not the owner of return allocations or goods lines. Retire its standalone root/scaffold without mapping child identifiers; keep database/DTO types consumed by `PurchaseReturn` and only edit lines within that aggregate. Keep the actual parent accounting/source rules.

## Active purchase documents — 216, 217, 219

The following keys are the actual server catalogue keys. The Angular route may only open after these requirements are met; each mutation is revalidated at HTTP, saved state and branch scope. View cannot implicitly grant independent approval, create or financial actions.

| Route/action | Required grants or boundary |
|---|---|
| `/PurchaseOrder`, `view/:id`, `details/:id`→view | `PurchaseOrder.View` |
| `/PurchaseOrder/create` | `PurchaseOrder.Create`, plus required editor reference lookup grants for the reads it actually performs |
| `/PurchaseOrder/edit/:id` | `PurchaseOrder.View` + `PurchaseOrder.Update`, plus required editor reference lookups |
| PurchaseOrder approval decision | `PurchaseOrder.View` + `PurchaseOrder.ManageApproval`; approval and log reads: View |
| PO `POST /search` | `PurchaseOrder.Search`, independently from list `GET /PurchaseOrder` (View) |
| PO from-job/from-requests/LeaseQuotation | `PurchaseOrder.Create`; actual Job route also requires `Job.View`, batch requests require `PurchaseRequests.View`, and a LeaseQuotation-linked add requires `LeaseQuotation.View`; source integrity and branch are rechecked in the service |
| `/PurchaseRequest`, `view/:id`, `details/:id`→view | `PurchaseRequests.View` (resolver maps singular controller name to plural permission resource) |
| `/PurchaseRequest/create` | `PurchaseRequests.Create`, plus required editor lookups |
| `/PurchaseRequest/edit/:id` | `PurchaseRequests.View` + `PurchaseRequests.Update`, plus required editor lookups |
| Purchase request approval and action log | `PurchaseRequests.View`; decision additionally `PurchaseRequests.ManageApproval` |
| PR create-order draft and action | `PurchaseRequests.CreatePurchaseOrder` and source `PurchaseRequests.View`, with parent PO Create and source/reference checks as separately supported by HTTP |
| `/PurchaseReturn` list | `PurchaseReturn.View`; supplier or branch filter additionally needs the applied Lookup |
| `/PurchaseReturn/view/:id`, `details/:id`→view | `PurchaseReturn.View`; saved financial detail additionally `JournalVoucher.View`, saved goods and goods-credit detail additionally `GoodsReceivedNote.View` and `Bill.View` to protect source numbers |
| `/PurchaseReturn/goods/view/:id` | `PurchaseReturn.View` + `GoodsReceivedNote.View` + `Bill.View` |
| `/PurchaseReturn/create` | `PurchaseReturn.Create` plus financial editor references, including `JournalVoucher.View` for sourced movement descriptions |
| `/PurchaseReturn/edit/:id` | `PurchaseReturn.View` + `PurchaseReturn.Update` plus financial editor references including `JournalVoucher.View` |
| `/PurchaseReturn/goods/create` | `PurchaseReturn.CreateGoods`, `PurchaseReturn.GoodsSources`, `GoodsReceivedNote.View`, `Bill.View`, `Supplier.Lookup`, `Branch.Lookup` |
| `/PurchaseReturn/goods/edit/:id` | `PurchaseReturn.View`, `PurchaseReturn.UpdateGoods`, and the same goods-source requirements |
| PurchaseReturn approval decision | `PurchaseReturn.View` + `PurchaseReturn.ManageApproval`; log and approval read View |
| PurchaseReturn void | `PurchaseReturn.View` + `PurchaseReturn.Update` per actual `POST /{id}/void` annotation; use server state checks |
| Goods credit | `PurchaseReturn.View` + `PurchaseReturn.CreateGoodsCredit` + `GoodsReceivedNote.View` + `Bill.View` |
| Goods sources read | `PurchaseReturn.GoodsSources` + `GoodsReceivedNote.View` + `Bill.View` + `Supplier.Lookup` + `Branch.Lookup` |
| Eligible financial movement read | `PurchaseReturn.GetEligibleMovements` + `JournalVoucher.View` + `Supplier.Lookup` + `Branch.Lookup` |

Use `BranchOperationRules` and `BranchScopeRegistry` for the authoritative stored and new branch checks. PurchaseOrder and PurchaseRequest source quantities are derived by their existing parent aggregate writers under `ExecuteUniqueWriteAsync<PurchaseRequest>`; do not rely on a frontend status hint or introduce a new quantity formula. Their internal reservation reads must span all nondeleted orders of the tenant, including hidden branches; never surface hidden order IDs or amounts to unrelated readers. `IgnoreQueryFilters()` in a composed EF subquery can disable the outer branch filter: all parent request list and remaining-capacity queries explicitly reassert the visible branch and tenant predicates (`SiGmaDbContext.PreservePurchaseRequestReadScope`). PurchaseReturn financial and goods writes use the current aggregate locks (financial `ExecuteUniqueWriteAsync<JournalVoucherAllocation>`, goods nested ItemRequisition/PurchaseRequest) and derive balances from all effective allocations, bills, and goods returns of the tenant; source-document lists and descriptive details keep their scoped read grants. Return list composition likewise reasserts parent scope (`PreservePurchaseReturnReadScope`). Any missing branch/supplier active-state, visibility or source proof is a separate backend finding; a UI requirement alone does not repair it.

For each active list: `View` is sufficient for the list itself; if a user actually applies a filter using an independently protected lookup, that lookup grant is checked before exposing its source. Revoke cancels outstanding reads, clears results and print/export, closes read-only children and prevents initiating another action. A dirty child draft retains a locally confirmed discard path even after View/action revoke. Once an HTTP mutation was sent, let its result settle without replay and fence stale notifications. Print/Excel must be tied to the query generation that produced rows, including the page/full export distinction.

## Owner and reference gaps

The Speed 2026-10-28 Vouchers sidebar documents the parent Payment, purchase order/request, provision and purchase return workflows, rather than independent PaymentDetail/MiscInvoiceItem editors. In particular Speed purchase returns lists Excel, print and report actions; the current Sigma purchase-return list has none. Do not invent a print or report HTTP permission: implementing those functional outputs requires a separately confirmed output contract and reconciliation with the parent. Provision's historical branch-definition ownership decision stays with its earlier freeze. Runtime tests of revoke, posted writes and branch balances must be exercised with correctly granted tenant/branch fixtures; source or build success alone is not that acceptance.
