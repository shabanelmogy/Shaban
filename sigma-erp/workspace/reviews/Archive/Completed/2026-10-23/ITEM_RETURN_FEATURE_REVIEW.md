| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Item Return feature review — 2026-10-04

Frozen handoff: ITEM_RETURN_DOMAIN_API_CONTRACT_FREEZE.md. Scope completed against canonical UI screen01 and BE pattern2. Generated phase packets stale; owner regeneration/semantic review pending. Screenshots are Explicit field/action evidence, not design authority; validation and full-snapshot ownership are source-supported reviewer decisions under the standing owner rule.

## Implemented files and behavior

FE Stock/ItemReturn: list TS/HTML; details TS/HTML; create/details/list models; typed service; routes; new report TS/HTML. Shared EN/AR itemReturn block; directly related ItemReturnService duplicate layout providers removed and toolbar title suppressed. Existing empty SCSS remains empty/unreferenced. Existing unrelated working-tree changes preserved.

List shows Actions first, then no/dateAndTime(dateTime)/jobName. ListVM exactly id/no/dateAndTime/jobName; removed job graph, child graph, reason, audit/tenant/flags from the list. No/Job/date range filters use applied query snapshots, server pages and translated export headers; all matching pages loaded for Excel/report. Default month and15 rows; Reset included. SwitchMap cancels stale list requests; both error channels handled with loader finalize and inline retries. Controlled modal create/view/edit owns the sole editor; legacy URLs redirect to the list. Dirty discard is shared and guards route/X/Cancel/Escape.

Details keep DateTime, Job, Notes/ReturnReason and Item/Quantity collection. One initial row; typed validators and focus; integer Quantity stepping1..2147483647; View Quantity uses centered blue badge beneath matching header. Full update sends saved lineids/new0. Notes optional and trimmed. View needs no lookups; deleted historical names remain readable via same-tenant detail projection and are not reintroduced into live selections.

BE files: ItemReturnService; ItemReturnController; ItemReturnProfiler; ItemReturnItemProfiler; ItemReturn Add/Update/Detail/List VMs; dedicated new ItemReturnLineDetailVM; shared ItemReturnItem Add/Update positive-int contracts; GeneralMessage EN/ar-SA six keys. Unconsumed ItemReturnFullListVm retired. Entities/EF/schema unchanged: **Add-Migration not required**.

## Decisions and source conformance

| Concern | Final producer/consumer | Evidence/result |
|---|---|---|
| List shell | list HTML sigma-list-page/panel/header/table; host sigma-route-host | Workshop Job shared reference; one fill DataTable, title in card, no feature CSS |
| Filters | appFilterPanel mainColumns3/stableLayouttrue; reserved date error | UI4/19 owner same-line rule, widths and responsive logic shared |
| Modal | details EditorDialog contentPaddedtrue/focusOnShowfalse; form/body/scroll flex-fill | UI13/VehicleService; body owns content-sized internal scroll, footer fixed |
| Rows | details columns Item360px / Quantity150px numeric center; shared EditableRows/Table | UI14/27, no bespoke chrome; Quantity InputNumber+directive; View highlight class |
| Read contract | service GET + MaterializeList ProjectTo; navigation detail projection | FE and BE fields match; tenant boundaries maintained; child Detail API kept compatible |
| Write contract | explicit typed payload + Add/Update VMs | no No/tenant/audit/parent input; positive live tenant FKs, >=1 unique item line |
| Reconciliation | UpdateCore tracked filtered include + OwnsAll/RemoveDropped/ReconcileOwned/SaveUpdate | existing retained rows mapped; dropped rows usage-checked and soft-deleted; one save |
| Delete | shared confirm + RemoveWithChildrenAsync | usage-aware whole-aggregate soft delete; no unconfirmed direct delete |
| State/calculation | no status or ItemIssue link in entity | no invented transitions, journal or stock-balance effect; no totals/formulas |
| Authentication | existing AuthGuard/API Authorize | no invented permission system; UI controls are not security claims |

Necessary overrides: ApplyListFilters dates; ApplyListOrder computed jobName/whitelist; MaterializeList lean projection; legacy GetAllWithNavigations lean projection; consumed DetailWithNavigations projection; Add/AddList aggregate validation; UpdateCore owned reconciliation; UpdateList refuses detached bulk replacement; Remove owned delete. Others inherited. Mapping directions explicit; sole Ignore is manually reconciled collection. PurchaseOrder approve/bill transitions Not Applicable: ItemReturn has no approval/billing state. PurchaseOrder financial totals/tax Not Applicable. Add/Update/Delete supported, domain-action phase has no extra transitions.

Root correction: agent initially blocked standalone ItemReturnItem mutations outside assigned scope; that service was restored exactly to its previous source. Existing standalone child read/write API remains. Residual legacy child bulk writers bypass DataAnnotations and remain a separately owned legacy boundary; no new access restriction introduced. Full parent API is validated. Nullable historic references/quantity remain readable; invalid records require correction before editing.

## Reconciliation

Source diffs reviewed separately in FE and BE, including new report/lineDTO source; scoped whitespace checks passed; static key comparison found zero missing itemReturn keys in EN/AR. Typed payload/read/service/route imports reconciled, no stale ms-lib, canEdit, tenant inputs or merge markers in feature. No build/test/runtime/database/visual claims. Existing wrong-target scaffold specs are untouched; no new mirror tests introduced.

Phases0–3 and5–6 applied; ordinary delete confirmed in Phase4; no extra transitions. Agents after freeze: return_editor (inherited model) owned editorTS/HTML; return_backend (gpt-5.6-sol, per AGENTS complex persistence routing) owned BE; root integrated contracts/list/report/translations and audited results. Parallel disjoint work reduced latency; unauthorized child service change corrected before completion.

Owner verify: build FE/API; create; view; update unchanged/add/remove line and preservedIDs; reject duplicate/item or job deleted/foreign lineIDs; dirty close/route exit; delete dependency and last page; inclusive date/job/no filter sort/paging; report and Excel counts beyond100; AR/RTL/light/dark/narrow/keyboard/stepping. No migration needed. Compile/runtime remains unverified per AGENTS.
Suggested commits (not run): FE `refactor(stock): standardize item return list and modal`; BE `fix(stock): validate and reconcile item return aggregates`.
No prohibited commands executed: no builds/tests/lint/browser/DB/migrations/snapshots/commits/push/deploy/Graphify/SigmaMCP.
