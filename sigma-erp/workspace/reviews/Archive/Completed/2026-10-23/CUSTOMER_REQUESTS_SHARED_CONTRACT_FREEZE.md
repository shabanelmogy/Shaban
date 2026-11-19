# Customer Requests shared contract

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Owner requests review and implementation according to canonical documents, with
three customer-request screenshots. Authority: AGENTS; Master2/4/5/7; UI01 list
with single-section modal editor (UI1–10/13/15/16/19/22–29); backend pattern1
BranchService, base Service hooks. Recipe initial -Check: all eight pass.

## Evidence and scope

Image1: explicit Customer/Status filters, Create/Refresh, empty grid with Request
No, Customer, Date & Time, Detail, Status. Image2: explicit Create modal with
Customer, Detail, Cancel/Save. Image3: explicit saved row and Edit/Close Request/
Delete Request actions. Styling is legacy reference evidence, not design authority.
Closed behavior/requiredness not pictured: use minimal current-source contracts
under Master2 owner standing rule. No new access restrictions/accounting effects.

Frontend CustomerRequests source has no existing scoped dirty changes. Backend
CustomerRequest entity/config/VM/profile/service/controller also clean. Existing
shared vocabularies/guide may contain unrelated edits; preserve them. Feature
currently has nonfunctional console-only saves, disconnected customer lookup,
legacy ms-lib grid, no filters/status/close. Existing generic CRUD API retained.

## Frozen API and UI contracts

- UI: /CustomerRequest list route only; list mounts existing details component
  as controlled create/view/edit modal. Old create/details child routes retire.
  Title/header, FilterPanel stable layout/Reset, DataTable fill and shared editor
  shell own presentation. No feature styles or copied table/modal markup.
- Grid (actions first): id (number, request number/current stable identity),
  customerName (text), createdAt (dateTime), detail (wrapped text), status (badge).
  ListVM exactly int Id, string? CustomerName, DateTime? CreatedAt, string? Detail,
  CustomerRequestStatus Status. Sort stored id/createdAt/detail/status; customer
  name non-sortable to avoid a second computed sort implementation.
- GET CustomerRequest: pageNo/pageSize and Filters[customerId], Filters[status],
  Filters[sortField], Filters[sortOrder]; base counts/pages/sorts; default15 rows,
  id descending. Initial status Open; clear status means all; Reset restores Open.
  Applied snapshot owns paging/actions/export; draft filter edits require Search.
- Detail GET CustomerRequest/GetById/{id}: Id, CustomerId?, CustomerName?, Detail?,
  CreatedAt?, Status only. Customer name/date/status read-only contextual values.
- POST CustomerRequest: customerId:number|null, detail:string|null only.
  PUT CustomerRequest: same plus id:number. Preserve current nullable customer/
  detail and detail maximum1000; validate selected customer through tenant-scoped
  reference checks. No tenant/audit/GUID/flags/status in writes.
- Customer choices use existing shared CustomerService GET Customer/GetSelect,
  Results<DropDownSelect> id/value; inline failure/retry. View displays historical
  customerName as text; editing does not manufacture missing current choices.
- Persist new enum CustomerRequestStatus Open=0, Closed=1 in own Helpers file;
  entity Status defaults named Open, database default Open for legacy rows. This
  extends existing owner, not a second request system. No new number generator.
- POST CustomerRequest/{id}/Close, empty body, Result: tenant/live row, Open→Closed,
  idempotent if already Closed. No reopen, reason, dates or financial side effects.
  Closed stays editable/deletable under existing CRUD behavior; UI hides Close on
  Closed only. Status never changes through ordinary editing. Preserve status
  under edit/close races with tracked updates of changed inputs only; close
  modifies only status. One scoped SaveChanges and implicit transaction per write.
- Delete retains generic soft-delete behavior, shared danger confirmation names
  request id/customer; no invented reference blockers. Close uses warning
  confirmation. View/Edit/Create/Excel supported; Job-specific invoicing, labour,
  gate passes, quality checks and cancellation N/A to this fields-only request.
- Modal busy/dirty exits share deferred discard confirmation and form freezing;
  route guard uses same decision. Failure retains draft; successful save closes
  then refreshes applied list, empty-page recovery for delete/close with status
  filter. Single success owner is global interceptor, inline errors suppress
  global error interceptor only for those owned reads/writes.
- Guide: existing UserGuide administration section (/UserGuide/administration)
  and existing sidebar entry, new bilingual topic links /CustomerRequest.

## Impact and evolution classification

Keep generic CRUD endpoints, customer lookup, tenancy/soft delete and1000 limit.
Extend entity/state/API and existing Administration guide. Replace legacy grid
and routed stub with shared list/modal composition. Refactor VMs/profile/service
and typed frontend forms/payload. Remove dead route/spec/style scaffolding and
unused FullListVM only after direct-consumer evidence. Create enum/close endpoint
and review verification evidence; no parallel viewer/state framework.

Alternatives: IsActive-as-closed rejected (unrelated activation semantics); new
request entity rejected (current owner exists); routed form rejected (UI13
fields-only rule); nonpersisted status rejected (filters/actions need durable
state). Unknown historic closed states cannot be recovered; owner checks existing
data before migration. No destructive data change approved or performed.

## Conformance and boundaries

| Concern | Book | Actual reference/shared owner | Target |
|---|---|---|---|
| List fill/filter/grid | UI1/4/6 | Workshop/Job list html/ts; FilterPanel/DataTable | sigma-route-host/list-page/panel/table, stableLayout, controlled paging |
| Modal | UI13/15 | shared EditorDialog public declarations | controlled single-section, contentPadded, explicit mode, shared actions |
| Controls/error | UI16/19/22 | CustomerService, FieldError, StateMessage | id/value choices, max1000, both failure channels |
| Discard | UI10/28 | ConfirmationDialogService/freezeFormState | same deferred close/guard, identity and busy gates |
| Read/write backend | BE3/4/7/9/13 | BranchService, Service, lean detail base | narrow contracts, directional maps, ProjectTo navigation label |
| State persistence | BE18/Master4 | scoped tracked entity/UoW | minimum named state, Close endpoint, no activation overload |

Phases0/1 freeze first, then backend and frontend independently, integration and
final reconciliation root-owned. AGENTS explicitly supports two independent
workstreams after freeze; backend agent owns backend feature files/localization,
root frontend/guide/artifacts. No migrations/snapshot/build/test/lint/browser/DB/
commit/push/deployment commands. Source checks only; owner runtime/build pending.
Migration required: Add-Migration ChangeCustomerRequestCustomerReferenceAndAddStatus
(check name uniqueness before final report). New column default0 treats legacy
records as Open; owner reviews historical status before applying. Do not edit
migrations yourself.

## Customer ownership amendment — 2026-10-14

Discovery proves Customer/GetSelect returns Partner IDs limited to Individual/
Company; old CustomerRequest.Customer instead points at legacy Customer:PersonBase.
Owner answered the data question: table is empty or test data. Frozen correction
retargets CustomerRequest.Customer to Partner, retaining nullable CustomerId and
validating current tenant Individual/Company customer type before writes.
CustomerName follows actual lookup label: Partner.Name, then Partner.No, then
CUS00 + Id. Detail/List project that exact source; no invented DisplayName.
Migration suggestion now ChangeCustomerRequestCustomerReferenceAndAddStatus.
Owner inspects/removes or remaps any test-only legacy FK values before applying;
source changes do not authorize migration/data deletion. No FK IDs copied blindly.
