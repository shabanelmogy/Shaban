# Customer Requests feature review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Request and evidence

The owner asked to review `Administration/CustomerRequests` and apply the three
attached screenshots. Images are functional/content evidence: the list shows
Customer and Status filters, Create and Refresh, Request No/Customer/Date & Time/
Detail/Status columns; the create editor shows Customer and Detail with Save /
Cancel; the populated state shows row actions Edit, Close Request and Delete.
The existing visual skin was not copied over the canonical shared shell.

## Decisions and implementation

The screen is UI type 01 (list with modal editor), backend pattern 1 (normal
entity). The complete frozen API/UI contract, including the owner answer that
the table contains only empty/test data, is in
`CUSTOMER_REQUESTS_SHARED_CONTRACT_FREEZE.md`. The maintenance classification and
alternatives are in `CUSTOMER_REQUESTS_MAINTENANCE_EVOLUTION_PLAN.md`.

Frontend now uses `app-feature-title`, `appFilterPanel`, typed customer/status
filters, `app-data-table`, typed row actions, full-result Excel export, the
controlled shared `app-editor-dialog`, `app-form-section`, shared validation,
loading/error states and deferred dirty-close confirmation. Create/Edit/View share
one form. Save is manual after optional mock-data fill; close is a confirmed
Open→Closed action; delete is confirmed; closed requests cannot be reopened by
editing. List state is preserved in query parameters.

Backend now targets the current Individual/Company `Partner` customer choices,
projects the exact Partner.Name/No/CUS00+Id display label, adds durable
Open/Closed status and an idempotent typed Close endpoint, uses directional maps,
lean List/Detail contracts, validates tenant customer type, and maps only
editable fields on tracked updates so a concurrent Close is not overwritten.
Unused FullListVM and invalid empty component specs/styles were removed.

## Verification and handoff

TypeScript parsing (10 changed frontend TS/vocab files), Angular template parsing
(2 templates), CustomerRequest EN/AR translation parity (35 keys each), scoped
Git diff review and whitespace checks passed. Backend agent reviewed the owned
diff, XML resources and stale FullList references; no merge markers were found.
No build, test, lint, runtime/browser, database, migration, commit, push or
deployment command was run.

Required owner action: inspect/remap any legacy test FK values, then create/apply
`Add-Migration ChangeCustomerRequestCustomerReferenceAndAddStatus`; do not apply
it blindly. Run the frontend/backend build and manually verify list filters,
Create/View/Edit, validation, dirty Cancel, Close, Delete, Refresh, paging and
Excel after the migration. Production visual/RTL/dark/narrow acceptance remains
pending. Suggested commits: `refactor(customer-requests): align list and modal
workflow` (frontend), `feat(customer-requests): add status and close action`
(backend), and `docs(customer-requests): record screen contract` (documentation).

Guide handoff: `modules/UserGuide/content/administration-guide.ts`, existing
`/UserGuide/administration` route and Administration sidebar entry now include a
bilingual Customer Requests topic covering filters, form, actions, validation,
status lifecycle and mock-data/manual-save behavior.

No subagent was used for frontend; backend was delegated after the shared
contract froze because backend/API and frontend work were independent. Backend
agent owned only CustomerRequest server files and localization; root integrated
the frontend, guide and evidence. Prohibited commands were not run.

## Final source reconciliation

| Path | Final evidence |
|---|---|
| Grid ↔ ListVM | Actions precede id(number), customerName(text), createdAt(dateTime), detail(wrapped text), status(badge); server VM exactly Id/CustomerName/CreatedAt/Detail/Status |
| Editor ↔ Detail | CustomerId/CustomerName/Detail/CreatedAt/Status plus inherited int Id; create/edit inputs are customerId:number|null and detail:string|null, update adds numeric id |
| Filter ↔ server | toListParams emits customerId/status and sortField/sortOrder; inherited EF column matching, CountAsync, NormalizePaging and stored-column ordering remain; default15, stable id tie-breaker |
| Applied query | Search snapshots controls; paging, refresh, actions and complete-page export retain applied values; URL uses status=all to distinguish cleared status from defaultOpen |
| Save/error | Typed create/update calls, max1000 and available-customer validation; failure retains draft and inline message, successful mutation closes and refreshes once; global interceptor owns success, X-Skip-Error-Interceptor gives local error ownership |
| Actions | View/Create/Edit, confirmed Close and Delete; Close visible onOpen only, backend idempotently closes; closed edit/delete stays existing contract, no reopen or accounting effect |
| Routes/exit | Only list route, controlled inline details component; route/X/Cancel/scopedEscape use same deferred dirty confirmation; freezeFormState preserves disabled state; accepted confirmation may close before finalize clears flag |
| Customer principal | Source CustomerService.SelectAsync128–156 returns Partner Individual/Company; EF principal and tenant subtype validation now agree; old FK data is owner migration concern |
| Mapping | Four directional feature maps; only read maps flatten labels. Write VMs omit status/tenant/audit/number; tracked UpdateCore changes editable inputs only |
| Transactions | Add/base save, tracked edit and Close each one UoW save with EF implicit transaction; no extra explicit transaction/numbering generator |
| Guides | Existing Administration section/menu; new Customer Requests topic in EN/AR matches final routes, optional inputs/max1000, no reopen, actions, dirty exits, Excel/applied filters and manual mock Save |

Override justification: AddAsync adds allowed customer subtype rule then delegates;
MaterializeListAsync uses ProjectTo for navigation label without overriding paging;
DetailAsync projects the label needed by GetById; UpdateCoreAsync maps to the tracked
instance without whole-row Update so concurrent Close status cannot be reverted.
Controller declares only new Close method; inherited CRUD unchanged. No calculation,
child collection, upload or AutoMapper reverse map. Unique business key N/A.
Authorization candidates: DELETE CustomerRequest and POST CustomerRequest/{id}/Close;
current inherited Authorize/AuthGuard only, no invented per-action authorization.
Job-specific labour/invoice/gate-pass/quality/cancellation actions N/A (no matching
request entity contracts). Screenshot Edit/Close/Delete all have complete slices.

Changed frontend files: existing CustomerRequests list/detail TS+HTML, models
create/details/list, service and routes; removed two invalid specs and two empty
styles. Shared source changes are limited to CustomerRequest vocabulary blocks and
the new guide topic/overview. Other concurrently authored Branch/Country/import
vocabulary and guide changes were retained and excluded from this task's claims.
Changed backend files: feature entity/config/detail/list VMs/profile/service/
interface/controller, new Enum/CustomerRequestStatus.cs, removed unused FullListVM,
three localized keys each in GeneralMessage.resx/ar-SA. Existing Add/Update VMs
remain nullable/max1000. Status property/default/index and Customer→Partner FK/
Restrict relationship are schema changes: owner migration required; existing
Detail max1000 is unchanged and EF repeats that limit explicitly. No existing
entity column removed, migrations/model snapshots untouched.

Phases0/1 (evidence/freeze),2 (paged reads/grid),3 (write/modal),4 (Close/delete),
5 (route/services),6 (source reconciliation) applied. Financial/report/upload/
child workflows skipped as N/A; runtime execution stays owner-only.
Shared-extraction gate: all recurring presentation/query/error/confirmation/export/
mock behaviors reuse existing owners; no new duplicated framework/helper. Reusable
lookup identity provenance is promoted together to UI16/BE8/skill §8 plus revision
history and CHANGELOG. All8 generated packets refreshed through generator and
-Check passes; source policy/dependency/reference roles remain semantically aligned.

Additional source evidence: CUSTOMER_REQUESTS_SOURCE_VERIFICATION.json records
exact named local import exports, no unused named import, required standalone
registrations,42 actually referenced EN/AR keys, exact List/Detail/input contracts,
single modal route and guide coverage, with zero findings. XML resources parse;
source comparisons prove syntax/contracts only, not application compilation.

Responsive source matrix: owner image widths1717/1724 and445 are evidence sizes,
not design breakpoints. Desktop≥1251 uses two filter tracks;1250/1251 switches
shared default three tracks;1199/1200 includes shared filter collapse;720/721
stacks fields/actions. Editor uses shared1099/1100 and767/768 bounds, default
1040 width/max viewport; field grid2→1 at700/701. FeatureTitle wraps at650/651.
Representative360/445/600/900/1024/1366/1717 widths, short-height/long text/validation,
LTR/RTL/light/dark and keyboard/focus-return remain manual owner acceptance.
Source uses existing shared logical/theme/scroll owners, flex-fill intrinsic
modal links, full-width Customer/Detail, no feature viewport math or CSS override.

Suggested scoped commits:
- Frontend: refactor(customer-requests): align list and modal workflow
- Backend: feat(customer-requests): add status and close action
- Documentation: docs(customer-requests): record contract and lookup identity

## Owner migration failure — 2026-10-14

Owner reports `FK_CustomerRequest_Customer_CustomerId is not a constraint` / `Could not drop constraint`. Source discovery identifies the first Up operation in owner-generated `20261014050321_FilterBranchNameUniqueIndex.cs` as the failing DropForeignKey on CustomerRequest. Despite its name this migration includes the Customer→Partner FK retargeting, request Status/index and Country length/index changes alongside Branch's filtered index. The following `20261014050857_ChangeCountryNameContractAndAddUniqueIndex.cs` has empty Up/Down because those model changes were already captured by the earlier scaffold.

Previous committed snapshot records CustomerRequest.Customer→legacy Customer; current frozen contract intentionally targets Partner after owner-approved empty/test-data decision. Actual database FK naming/schema/history remains Missing: source snapshots do not prove deployed schema. The runtime error establishes the named FK is unavailable on the target table, but does not distinguish renamed FK, absent FK, already-correct Partner FK or wrong database/schema. Do not remove the operation blindly or assume every operation in the combined migration already applied.

Prepared `CUSTOMER_REQUESTS_MIGRATION_DIAGNOSTICS.sql` under reviews for owner-run read-only metadata: actual CustomerId foreign keys (any schema/name), touched columns/defaults/indexes and today's migration history. No database commands, migrations or model-snapshot changes were executed. Migration correction remains pending the diagnostic output and explicit authorization to edit this existing migration, because AGENTS Migration boundary prohibits creating/editing/running migrations. Follow-up is a bounded migration diagnosis, not a reopening of business contracts. Microsoft EF documentation confirms scaffolding compares models/snapshots; SQL Server sys.foreign_keys/foreign_key_columns are the metadata owners. No application behavior, guide, translations or unrelated changes modified in this diagnosis.
