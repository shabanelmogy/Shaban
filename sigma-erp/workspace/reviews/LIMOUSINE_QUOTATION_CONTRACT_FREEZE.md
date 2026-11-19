# LimoQuotation — frozen handoff

| Status | Frozen |
|---|---|
| Owner verification pending | yes |

Root implementation amendment (2026-10-07): the existing custom write validation now overrides UpdateCoreAsync, preserving the generic UpdateAsync uniqueness boundary. Tax resolution validates request inputs before mapping; existing tracked rows save directly for edit/state changes. These are BE5/8 persistence conformance corrections, not new approval/tax rules. The unused declaration-only FullListVM was removed after targeted consumer searches. State predicates and one-save behavior remain unchanged; compiler/runtime/concurrency acceptance stays pending.

## Decisions — 2026-10-07

Source: LimoQuotationService/Controller, Add/Update/Detail/List VMs and frontend feature. UI02 routed record because approval transitions and charges/tax totals require it (UI13 D4-2). Keep same single persisted status and business actions; no accounting/schema decisions.

- List columns: actions, no, createdAt, customerName, internalApproval (derived label from status), customerApproval (derived label from status). Minimum ListVM id/no/createdAt/customerId/customerName/status; retain inherited base read metadata where base architecture requires it, remove feature-specific editor/nested graphs. Direct GET should project CustomerName from owner instead of loading customer IDs to fabricate labels.
- Filters preserve existing semantics: quotationNo substring, customerId exact, inclusive createdAt calendar fromDate/toDate, internalApproval pending/approved/rejected and customerApproval pending/approved/revised. Existing frontend customerRejected label `revised` stays compatibility display; server persisted CustomerRejected enum is not changed. Apply predicates before CountAsync and page through generic NormalizePaging/shared helper. Exact pageNo/pageSize and totalCount; initial UI15. New backend read override/filter projection is justified by existing UI filters/oversized graph, not a new workflow.
- Add/Update inputs: customerId,tripTypeId,roundTrip,pickUpLocationId,dropOffLocationId,tariffGroupId,fuelCharge,charges,tax,notes; update adds id. Tenant/no/status/audit excluded. IDs nullable according to VMs; notes max2000, money nonnegative, fuel enum0/1. Backend tax policy/settings authoritative; view keeps stored tax rather than recalculating historical display.
- Detail uses navigation-capable endpoint to render backend lookup names in View; Create/Edit uses existing owning select endpoints, merges legitimate saved choices where necessary and blocks failed lookup/detail state with retry. Preserve current typed data and both failure channels.
- Routes list/create/view/:id/edit/:id with data.mode; legacy details/:id becomes redirect/compatibility if needed. Return with list filters/page state. Revise mutates status then opens Edit on same record (no copy/revision inferred).

| Action | Legal source -> target | Exact route / UI |
|---|---|---|
| View / Print | any saved state | owning routed View; ReportPrintService; complete printable fields |
| Edit / Delete | Pending | PUT base / DELETE {id}; Delete shared confirmation |
| Internal approve/reject | Pending -> InternallyApproved/InternallyRejected | PUT {id}/internally-approve or internally-reject; shared confirmation |
| Customer approve/reject | InternallyApproved -> CustomerApproved/CustomerRejected | PUT {id}/approve-by-customer or reject-by-customer; shared confirmation |
| Revise | InternallyApproved -> Pending | PUT {id}/revise; confirm, refresh then Edit same id |

Reference UI7 actions Unapprove/agreements/master agreements/receipts Not Applicable: no target route/state/downstream aggregate. Every mutation guarded, backend revalidates, interceptor owns success/error, current page refreshed (step back after last-row delete). No new can flags necessary for current public enum.

## Conformance before implementation

| Concern | Book | Reference / shared owner | Correction |
|---|---|---|---|
| List/filter/grid | UI1–8/28 | Workshop/Job list, FilterPanel/DataTable, toListParams/resolveListPaging | replace ms-lib/local allData paging and private DOM access with switchMap server queries |
| Editor/totals | UI1/13/15/19/24 | Workshop/Job editor shared shell, FormSection/FieldError/SummaryCards/Money | replace raw embedded modal/bespoke CSS; typed form; backend saved figures in View |
| Actions | UI7/9/10/22 | SalesQuotation action inventory, shared ConfirmDialogService | keep target smaller source-supported action set, shared confirms, guarded errors/refresh |
| Read contract | BE3/5/7/9 | generic Service normalized paging and branch/reference projection pattern | minimal ListVM and supported predicates/projection; justify each override |

Worker owns LimoQuotation frontend folder and directly related backend LimoQuotation service/VM/profile/controller/interface files only as needed. Never edit entity/EF/migrations/snapshots. Shared files, translations/config/provider edits belong to root. Inspect exact producer symbols before edits; any unexpected material contract disagreement stops that slice and is reported to root.

## Contract amendment — 2026-10-07, source constraint audit

The root authorized removal of inherited ListBaseVm plumbing after inspecting the generic Service/IService/controller constraints: TListVm has no ListBaseVm requirement. This supersedes only the earlier compatibility allowance for base read metadata. Final quotation ListVM is explicit Id, No, CreatedAt, CustomerId, CustomerName, Status. All consumed grid/action fields are retained; tenant/flags/GUID/unused creator metadata are removed. Frontend list model already matches this exact shape, so no extra client change is required. API routes, filters, statuses, calculations and write contracts are unchanged.
