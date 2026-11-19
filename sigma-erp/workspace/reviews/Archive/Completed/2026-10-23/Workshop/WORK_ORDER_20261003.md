# Work Order frontend source reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |

Owned scope: `SiGmaAngularFrontEnd/src/app/modules/Workshop/WorkOrder/**`. Root owns shared integration, translations and any separately recorded backend correction. No supplied screenshot; the frozen Workshop plan/handoff and historical Work Order source are evidence. Initial owned Git diff was empty.

Selected shape: UI type02, routed document editor because totals and acceptance workflow trigger UI13 D4-2. Backend pattern2 master-detail, no confirmed accounting posting. Canonical AGENTS, sigma-screen-refactor skill, Master4/5, UI1–10/13–17/19/21–30 and phase2/3/4 packets apply; root ran the passed recipe drift check.

## Reference comparison before edits

| Concern | Owning blocks | Actual reference symbols | Shared owner | Target decision |
|---|---|---|---|---|
| List bounds/title/filters | UI1/3/4 | Job list template and JobsComponent | sigma-route-host/list shell, FeatureTitle, FilterPanel | Replace WorkOrder page/filter/panel copies; max six primary controls, advanced remainder, Reset |
| Grid/query/paging/export | UI5/6/8/28 | JobsComponent.bindListQueries/onLazyLoad/export; WorkOrderService.GetManyAsync | DataTable, resolveListPaging, toListParams, fetchAllPages | Typed columns, skip unchanged paging, switchMap/defer, applied filters, all-page export; no sort because backend orders by Id only |
| Routed sections/rows | UI1/13/14 | JobEditorComponent and editor template | FormSection, EditableCollectionTable, EditableRows | Single header/child editor, bounded header and row scroll, fixed footer |
| Modes/errors/discard | UI10/15/19/22 | JobEditorComponent.save/requestClose and Job invoice route guard | ConfirmationDialog.confirmDiscard, StateMessage, FieldError, apiErrorMessage | Route modes, loaded-snapshot gate, retry, save lock, route deactivation guard |
| Totals/print | UI21/24 | ReportPrintService.createSession; SummaryCardsComponent | SummaryCards, MoneyPipe, roundMoney, print session | Absolute tax amount retained; read stored totals in View; preview excluded from writes; full data print |

## Producer findings returned to root before edits

WorkOrderService.UpdateAsync blocks Accepted only; AcceptAsync can accept Rejected; frozen historical frontend policy is pending-only. Current `Math.Round(decimal,2)` midpoint-to-even conflicts with canonical shared roundMoney midpoint-away-from-zero; root instructed shared roundMoney at producer-confirmed line/header boundaries and owns producer reconciliation. Update currently Mapper.Map replaces children without explicit ownership reconciliation. Add/Update VMs retain totals and state despite recomputation. Root owns these backend decisions; worker edits no backend.

## Final frontend contracts and evidence

Grid order is **Actions, no, date, customer, customerNo, branch, vehicle, totalAmount, discount, netAmount, status**. `WorkOrderListModel` properties beside that order: **id, no, date, customer, customerNo, branch, vehicle, totalAmount, discount, netAmount, status, acceptanceStatus**. Id targets actions; acceptanceStatus supplies the badge in No and pending-only action availability. No extra list properties were added. No-column export fallback includes its translated acceptance badge text. Dates/money/status use shared column types. No sortable column is advertised: inspected producer uses descending Id only.

| Filter/control | Serialized/backend key | Parser/default |
|---|---|---|
| Work Order No | `Filters[workOrderNo]` | trimmed text, empty omitted; producer historically searches Id text |
| Customer PO No | `Filters[customerPONo]` | trimmed text, empty omitted |
| Status | `Filters[status]` | enum identity 0/1, null omitted; zero retained |
| Acceptance | `Filters[acceptanceStatus]` | enum identity 0/1/2, null omitted; zero retained |
| Customer | `Filters[customerId]` | numeric select id, null omitted |
| Date range | `Filters[dateFrom]`, `Filters[dateTo]` | shared real complete ordered range; local yyyy-MM-dd; current month default; clear omits both |
| Vehicle, advanced | `Filters[vehicleId]` | numeric select id, null omitted |
| Branch, advanced | `Filters[branchId]` | numeric select id, null omitted |
| Chassis, advanced | `Filters[chassisNo]` | trimmed text, empty omitted |

`toListParams` owns serialization. Six primary controls, three advanced controls and Reset use FilterPanel. `activeFilters` updates only after valid Search/Reset; paging, row-action refresh, editor handoff, report/Excel use that snapshot. `readListRoute`/`writeListRoute` preserve page, size, applied filters and explicit cleared date-range state (`dateRangeSet=1`). `resolveListPaging` compares prior state before writes: identical page/size skips, size-only change fetches, switchMap/defer cancels prior queries. Shared default size is 15; producer page clamp is 1–100, CountAsync and TotalPages are authoritative. Delete of one-row nonfirst page moves back one page before refresh.

| Details/form | Write payload | Validation and ownership |
|---|---|---|
| date `Date|string|null` | local `date` | required + shared real-date validator + structured mask |
| customerPONo, notes strings | trimmed string or null | editable historical inputs |
| customerId, branchId `number|null` | selected IDs | required historical frontend validation; current select endpoint for editing; saved detail names in View |
| discount number | discount | required/nonnegative; absolute monetary input |
| each child id | update-only saved id | EditableRows.savedId; new rows omit id |
| each child description string | description trimmed | required/nonwhitespace/max500, source max500 |
| each child vehicleId `number|null` | optional selected ID | no invented required vehicle |
| each child amount/tax numbers | amount/tax | required/nonnegative; tax remains an absolute amount |
| no, status, acceptanceStatus | omitted | backend state and read-only display |
| child amountPlusTax, header totalAmount/netAmount | omitted | authoritative detail values in View; roundMoney display preview only in Create/Edit |

Full snapshot sends every remaining child; saved rows carry identity and missing rows are absent. An empty collection blocks Save rather than inventing a default replacement. Totals are a shared typed SummaryCard region (amount/tax/gross/discount/net), outside the bounded row scroll; getters recalculate from current form values. Net is no longer clamped to zero because the inspected producer subtracts discount without that clamp. Root is reconciling canonical rounding while retaining two decimals and absolute tax.

| Action | UI state | Endpoint / effect | Recovery/refresh |
|---|---|---|---|
| Create/View/Edit | Create; any record View; pending-only Edit | routed existing DetailsComponent, mode from route data | list query returned unchanged |
| Accept | NotAccepted only | POST WorkOrder/{id}/accept, {} | shared confirmation naming record; local guard before confirmation/execution; inline safe backend message; applied-page refresh |
| Reject | NotAccepted only | POST WorkOrder/{id}/reject, {} | same guard/failure/refresh mechanics |
| Delete | historical any state | DELETE WorkOrder?id=id | shared danger preset; producer Job-reference restriction; previous-page recovery |
| Create Job | historical deferred | no supported endpoint/workflow approved | enabled no-op omitted; deferral unchanged |
| Print record | any saved record | routed View with print=1 | detail load must succeed before shared print session |
| Save and Print | mutable create/edit | ordinary save then authoritative View by response id | no preview printed; standard success toast owned by interceptor; detail failure blocks print |
| Report / Excel | applied filtered set | fetchAllPages, max100 each page | total metadata followed; failed page aborts output; current translated column values; Print restores paging/filters |

All API inline messages use X-Skip-Error-Interceptor; lookup requests use inherited skip option and local loading/Retry. Both Result and transport failures retain retryable user data. Standard mutation success has no manual toast. Detail failure leaves form disabled and Save unavailable with Retry. Save captures getRawValue first, disables form without emitting, and mutation methods/callbacks use canMutate; shared EditableRows.canMutate rechecks pending removal after confirmation. Save failure restores eligible form; success marks pristine and retains disabled cleanup state. CanDeactivate covers Cancel/Back/sidebar/router/browser-history exits; beforeunload covers browser exit; no invented permissions.

## Final reference conformance

| Concern | Final consumer/producer and comparison | Outcome |
|---|---|---|
| Bounds/header | WorkOrdersComponent host/list template consumes sigma-route-host/list shell; DetailsComponent host/template consumes editor shell; same shared owners as Job. Only workspace row proportions/header-scroll placement remains local | source matched; runtime pending |
| Filters | six main fields + appFilterAdvanced/appFilterActions; Reset handler; DatePicker shared range current month; no filter SCSS | source matched |
| Grid | exactly one shared DataTable, fill=true; authoritative Count; previous-state paging resolver; switchMap/defer; error-aware empty; actions first; same formatting in export | source matched |
| Child rows | FormSection title with section-header Add; shared table headingVisible=false/fillHeight/stickyHeader; fixed vehicle column230; row binds once via formGroup then formControlName; EditableRows for add/remove/replace/savedId | source matched |
| State/modes/save | form.disabled by mode/load/state/save; View skips select lookups and reads detail names; retry/save gate; route canDeactivate uses shared discard preset; app-field-error under every validated control; shared focusField resolves actual ids | source matched |
| Summaries/print | readonly typed SummaryCard region dense/row/min140/max150, MoneyPipe; View uses returned line/header totals; ReportPrintService session, sigma-print-flow, all pages for report | matched subject to root FormSection print release integration; runtime pending |
| Translation/wiring | existing pages/routing.ts lazy WorkOrder unchanged; owned four mode routes plus details redirect; existing component path reused, no speculative tsconfig root | root integrates fourteen new keys and shared FormSection print release |

Shared extraction: consumed existing shell, filter panel, row helper, field error, money/summary, date, paging, state routing, confirmation and print owners. Root added reusable real-date/range validators and the optional row-mutation callback. No new feature-local generic helper is needed.

## Source review and owner acceptance

Owned files changed: both existing list/details templates/TypeScript/styles; existing spec imports corrected to their real components (tests were not run or expanded); models/create.ts, details.ts, list.ts; service and routes. Scoped Git diff reviewed against actual frontend repository, including model/service/route and removal of local styling. A concurrent external HEAD update to 9549b83 was reported by root and preserved; this worker performed no commit. Root reviews whole integration separately.

Source checks: no private date parser, window.print, derived write fields, any contract, native date input, page-height calc, palette/filter/table deep CSS, merge marker, duplicate modal owner, speculative sort or permission API. Existing no-op conversion action removed from presentation. Whitespace diff check passed. Runtime/compilation not claimed. No schema/entity changes here; no Add-Migration needed for frontend. Suggested frontend commit: `refactor(workshop): align work order routes and aggregate editor with shared patterns`.

Phases: Phase2 list/read/print/export, Phase3 detail/write, Phase4 confirmed accept/reject/delete, owned Phase5 route wiring applied. Root owns Phase6 and shared/backend reconciliation. No screenshot fields newly invented. Authorization candidates: accept/reject/delete at the exact endpoints above; authentication-only route architecture preserved.

Owner acceptance pending: compile; create/edit/view and pending/accepted/rejected route entry; failed detail Retry and disabled Save; dirty exit by all navigation paths; removal confirmation resolving while saving; nonnegative/whitespace/date validation and focus; rapid search/page/size changes; last-page delete; filtered Excel/report >100 records; record and Save-and-Print using saved totals; one success/error notification; local Cairo dates; keyboard, Arabic/RTL, dark, narrow viewport with internal header/row scroll and fixed actions. This worker ran no build/test/lint/browser/database/migration/commit/push/deploy command.

## Frozen backend amendment implementation — 2026-10-03

Root subsequently assigned the directly related backend correction under WORKSHOP_FRONTEND_CONTRACT_FREEZE source-confirmed amendment 2. The earlier frontend-only ownership and producer findings above remain historical evidence. Selected backend shape is BE14 Pattern2 tracked aggregate with explicit pending-only actions; no accounting posting, currency lookup, tax percentage policy or schema change.

| Concern | Owning block / actual reference | Final WorkOrder match |
|---|---|---|
| Editable inputs and lean reads | BE3; actual AddBaseVm/UpdateBaseVm, base IService/Service/controller constraints | Header Add/Update omit totals/state; isolated WorkOrderLineAdd/Update omit amountPlusTax; ListVM explicit Id/No + displayed/action fields; DetailVM explicit consumed fields with lean line and name/no/plateNo references |
| Input references/validation | BE8; Service.InvalidInputAsync/MissingReferenceAsync; IndividualPartnerService.UpdateCoreAsync | Optional nullable customer/branch/vehicle retained, supplied references validated recursively; decimal invariant Range(0, decimal.MaxValue) matches frontend minima; max500 optional description preserved, no new API requiredness |
| Tracked owned snapshot | BE14; IndividualPartnerService.UpdateCoreAsync; Service.OwnsAll/RemoveDroppedAsync/ReconcileOwned/SaveUpdateAsync | Filtered live items loaded tracked; minimum one enforced; negative/duplicate/foreign saved ids rejected before mapping; dropped usage checks then scalar map with items ignored; retained rows mapped onto saved instances, new rows added, omissions soft-deleted; one save |
| Delete | BE8/14; IndividualPartnerService.RemoveAsync and RemoveWithChildrenAsync | Existing Job usage predicate retained; shared dependency checks and owned item removal now run with header removal |
| Deep read | BE5; Service.DetailWithNavigationsAsync and repository isolated GetByIdDeepAsync | Redundant feature deep-read override removed; Customer/Branch/Item.Vehicle display supplied through inherited deep read, lean directional mappings |
| Money ownership | Frozen amendment 2; FinancialNumberPolicy.RoundMoney | Absolute Tax unchanged; each live line gross rounded at 2 decimals, header sums rounded gross and rounds Discount/Net at 2; shared AwayFromZero; removed tracked rows excluded before sum |
| Legal actions | Historical WORK_ORDER_FULL_STACK_REVIEW and frozen amendment 2 | Update/Accept/Reject only NotAccepted; Accept targets Accepted, Reject targets Rejected; no status transition or numbering change; tracked save only |
| Paging/read shape | BE9 shared NormalizePaging; current fixed Id-desc producer | Count and metadata authoritative; supplied page>=1,size1–100; both absent now canonical unpaged 0/0 metadata and 0-or-1 TotalPages; no speculative sort/filter |

Backend grid properties beside displayed columns: columns Actions/no/date/customer/customerNo/branch/vehicle/totalAmount/discount/netAmount/status; explicit WorkOrderListVM Id/No/Date/Customer/CustomerNo/Branch/Vehicle/TotalAmount/Discount/NetAmount/Status/AcceptanceStatus. Deleted items no longer supply displayed first vehicle. Historical No display is Id.ToString in List and Detail; no numbering write changed.

Compatibility isolation: root instructed preservation of retained standalone WorkOrderItem endpoints and DTOs because only the live parent aggregate contract is frozen. New WorkOrderLineAddVM/WorkOrderLineUpdateVM/WorkOrderLineDetailVM and WorkOrderReferenceVM/WorkOrderVehicleReferenceVM live under WorkOrder, and WorkOrderProfiler owns their directional maps. WorkOrderItemService, every old WorkOrderItem VM and WorkOrderItemProfiler are untouched. That standalone API remains future-review scope. WorkOrderFullListVM/DeleteVM unused compatibility types are untouched. Header and line names remain identical in JSON, so the reviewed Angular payload shape is unchanged. Unknown old derived/state JSON members are ignored by current deserialization, never trusted.

AutoMapper: removed WorkOrder profile ReverseMap calls; read maps only entity-to-UI; Add only editable-VM-to-entity; Update ignores only WorkOrderItems because shared tracked reconciliation owns it. No mapping from read DTO into entity remains. No local request trim/parser/helper duplicates. GeneralMessage.resx and GeneralMessage.ar-SA.resx receive additive parity keys WorkOrderItemsRequired/WorkOrderNotFound/WorkOrderEditLocked/WorkOrderTransitionLocked/WorkOrderUsedByJob; existing localized save result keys used; generated designer unchanged. Existing resource BOM preserved.

Changed backend files: SiGma.Business/Services/WorkShopServices/WorkOrderService.cs; SiGma.Business/MapperConfig/WorkOrderProfiler.cs; SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderAddVm.cs, WorkOrderUpdateVm.cs, WorkOrderDetailVm.cs, WorkOrderListVm.cs; new WorkOrderLineAddVM.cs, WorkOrderLineUpdateVM.cs, WorkOrderLineDetailVM.cs, WorkOrderReferenceVM.cs, WorkOrderVehicleReferenceVM.cs; SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx. No entity/EF/interface/controller/migration change. Suggested backend commit: `fix(workshop): reconcile work order lines and enforce pending workflow`.

Residual source risks: state predicates are checked on tracked loads, but no workflow rowversion/conditional action token exists in the frozen schema. Concurrent edit/accept/reject may race; no stronger guarantee is claimed. Job usage check can race concurrent Job creation; shared deletion also checks dependent relations but no cross-writer transaction design was invented. Generic batch helpers are not used by this live UI and still bypass custom Add/Update cores; root is notified for scope classification. Decimal arithmetic can overflow at extreme supported decimal limits; no unsupported monetary cap is introduced. Deep-read/query and AutoMapper behavior require owner runtime acceptance.

Root frontend integration adds selected saved lookup labels, actual View text instead of disabled edit boxes, FormSection print release, translations and historical default Open filter with explicit status=all persistence. Save completion is marked before navigation; route guard blocks departure during in-flight saving and allows post-success View/print handoff; print-detail Retry does not repeat the successful write.

Source-only verification: scoped WorkOrder removed-member/type references were searched across directly related backend producers and consumers; no stale total/state write use or old child write-type assignment remains. Full owned backend diff and new source files reviewed, resource diff restricted to five additive keys each; scoped whitespace check passes. Complete frontend owned diff reviewed in per-file chunks, including removed bespoke SCSS and old modal/date/total code. Root final integration and Phase6 remain separate. Owner must compile and exercise saved/new/omitted line identity, malformed/foreign/duplicate saved ids, optional-null/nonpositive/deleted references, negative monetary inputs, midpoint rounding, state locks/repeated actions, item soft deletion/history, Job dependency, unpaged+paged metadata, Arabic messages and deep read. No Add-Migration is needed; worker ran no prohibited commands.

## Root contract amendment and final integration — 2026-10-04

Frozen amendment5 supersedes earlier absolute editable Tax and amendment6 supersedes the participating-state race note. Owner confirmed the same Workshop settings rate. WorkOrder Add/Update now omit Tax; service injects ITaxPolicyService and uses VatPolicy.AllocateDocumentTax at historical precision2 on rounded line Amount. Backend persists Tax/AmountPlusTax/TotalAmount/NetAmount; Discount remains the absolute post-tax deduction. GET WorkOrder/options provides effectiveTaxRatePercent for preview; unavailable options block Save and show unavailable preview values. View/print use saved historical amounts, with no backfill or schema change. Root made Tax read text and omitted it from frontend payloads too.

Root wraps Update/Accept/Reject/Remove in existing tenant/type ExecuteUniqueWriteAsync; state is reloaded inside it and saved once. This serializes participating WorkOrder paths without a rowversion migration. Concurrent Job creation, retained standalone child APIs and inherited batch APIs do not participate; their residual boundaries remain documented. WorkOrderReferenceVM no longer carries unconsumed No; vehicle reference frontend shape matches returned plateNo without requiring name. Root added options VM/interface/controller and completed both repository diffs. No migration is required. Updated suggested backend commit: fix(workshop): calculate work order tax and reconcile owned lines. Owner tax/rounding/concurrency/API acceptance remains pending.