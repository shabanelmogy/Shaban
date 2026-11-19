# Leave Opening Balance — frozen full-stack handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

2026-10-11. Decision source: user “ضيف صفحة جديدة تحت : src\\app\\modules\\HRM\\Administration وحاول توقع البيزنس الناقص” and “وحسب البيزنس المتبع فى التطبيقات المشابهة بشكل عام”; Master 2 standing rule. Implementing files below are pending until reconciliation.

## Manifest and evidence

Scope: new LeaveOpeningBalance feature in Angular HRM/Administration, corresponding .NET entity/configuration/DTOs/service/controller/map, direct route/sidebar/toolbar/translations/UserGuide integration. Existing unrelated changes in both repositories (HRM settings/departments/account linking/staff roles/payroll and migration files) are pre-existing and preserved.

Screenshot E1: C:/Users/user/Desktop/Capture.PNG, English/LTR, 1723×168, current acceptance content; role/capture date/version unknown, selection-before-results state.

| Evidence | Classification | Behavior | Phase |
|---|---|---|---|
| Leave Opening Balance / Manage Leave Opening Balance | Explicit | Translated in-card shared FeatureTitle | 2 |
| Leave Type dropdown | Explicit | Existing type lookup, applies list context | 2 |
| Employee/day/date records and persistence | Reviewer decision (owner standing rule), not screenshot evidence | Dedicated baseline CRUD | 1/3 |
| Annual accrual, carry-forward expiry, payroll/encashment | Uncertain, excluded | No automatic rules or changes to existing Leave snapshots | — |

UI shape 01 list with modal editor (fields only, no children/totals). Backend Pattern 1 normal entity. Approved list reference Workshop/Job/components/list; editor shared EditorDialog controlled composition UI13. Backend BranchService. Additional Department/Leave consumers supply current helper integration facts only, not authority. AuthGuard authenticated route, no permission API.

## Domain/API/write contract

LeaveOpeningBalance : EntityBase. StaffId and LeaveTypeId required int FKs; EffectiveDate required DateOnly; OpeningDays required decimal(9,2), inclusive 0..9999999.99 and exact two-decimal precision; Notes nullable max1000; RowVersion SQL rowversion concurrency token. Unique live key (SubscriptionId, StaffId, LeaveTypeId), filtered IsDeleted=0. This is one migration baseline per employee/type, not one annual allowance. Dates are explicit calendar days, no timezone conversion/default allocation/backfill. New records default form date today and days zero (only saved on explicit Save).

Add VM: staffId, leaveTypeId, effectiveDate (yyyy-MM-dd), openingDays, notes. Update VM: same plus id and rowVersion (base64 string JSON byte[]). Detail: id, staffId, staffName, leaveTypeId, leaveTypeName, effectiveDate, openingDays, notes, rowVersion. List: id, staffName, leaveTypeName, effectiveDate, openingDays, notes only. Tenant/audit/status/totals/number are never writable. Names come from referenced entities, not duplicated persistence. All tenant-scoped references validated. Duplicate conflicts and optimistic update conflicts are localized failures. No new business state machine, numbering, pay calculation or accounting entries.

GET /LeaveOpeningBalance: ListSmBase PageNo/PageSize plus Filters[leaveTypeId], Filters[staffId], optional Filters[search] across staff/type/notes; defaults all baseline records, page1/size10. Base hooks count/page/project; ordinary stored columns/navigation sorts use existing generic owner. GET /LeaveOpeningBalance/GetByWithNavigationsId/{id}; POST/PUT root; DELETE root?id=... soft deletion with UI confirmation. Reads Results<List>; detail Result<Detail>; writes Result. Optional export uses same applied filters across all pages. No custom search endpoint/provider/HttpClient/tenant payload.

Concurrency: read RowVersion in detail; PUT requires that version, never overwrites a newer record. Duplicate inserts protected by unique index. Delete is ordinary soft-delete with explicit confirmation; no database execution or historical data cleanup is authorized by this task.

## Grid and filter contracts

| Grid order | Angular field | ListVM | Type |
|---|---|---|---|
| Actions | id target | Id | view/edit/delete actions first |
| Staff | staffName | StaffName | text |
| Leave Type | leaveTypeName | LeaveTypeName | text |
| Balance Date | effectiveDate | EffectiveDate | calendar date display |
| Opening Balance (days) | openingDays | OpeningDays | number, 0..2 decimals |
| Notes | notes | Notes | text |

| Filter | Form value | Serialized key | Parser/default |
|---|---|---|---|
| Leave Type | number/null | Filters[leaveTypeId] | int, empty=all |
| Staff | number/null | Filters[staffId] | int, empty=all |

Search applies a frozen snapshot for paging/refresh/export; Reset clears context. Shared currentPageReport uses {first}/{last}/{totalRecords}. Details/Add/Update consume exactly the fields above. Required employee/type/date/days; finite/nonnegative/two-decimal days, real complete date and notes length validated both sides. Failed options/details block Save and expose Retry; failure keeps entered drafts. Create can inherit applied type filter. View shows persisted names and values without edit-only lookups. Edit loads options and merges legitimate saved labels if absent. Dirty X/Cancel/Escape/route departure share deferred confirmation and frozen form-state helper. Save disables draft controls, successful Save refreshes applied list context.

## Conformance and integration

| Concern | Book | Reference/shared owner | Target |
|---|---|---|---|
| bounded list and header | UI1/3/6 | Job list; styles.scss; FeatureTitle | sigma-route-host/list-page/list-panel/header/table; no local SCSS |
| Filters | UI4/16 | FilterPanel, existing owning selects | stableLayout, mandatory Reset, numeric ID options, body overlays |
| modal | UI13/15 | shared EditorDialog | controlled mode/visibility, padded content, subtitle below title |
| validation/date/number | UI17/19/27 | DatePicker, date-utils, FieldError, NumericFocus | typed Date|string|null and decimal input, no native date/UTC |
| failure/cancellation | UI2/22/28 | apiErrorMessage, interceptor opt-out, switchMap/finalize | both failure channels, one list request, destroy cleanup |
| dirty state | UI10 | freezeFormState, ConfirmationDialog | one deferred decision including route guard |
| backend | BE1–10/13/18 | BranchService, generic Service/controller | only justified validation/projection/concurrency overrides |
| translation/theme | UI23–27 | both vocabs/shared theme controls | matching keys; no feature colors/permission API |

Route /LeaveOpeningBalance lazy-loads one list route with canDeactivate delegation. Sidebar HRM > Administration adds label/icon/link. Toolbar suppresses duplicate feature title. Service providedIn root on environment.baseUrl; existing authenticated/interceptor-equipped client only. Existing /UserGuide/hrm and HRM guide menu reused; new bilingual screen topic records purpose, filters, create/view/edit/delete, validation, retry/discard, baseline semantics and absence of automatic accrual/payroll. Guide source: src/app/modules/UserGuide/content/hrm-guide.ts.

Actions: Create/View/Edit/Save/Search/Reset/Retry/Delete/export supported; reference Job-specific cancel/approval/close/invoice/gate-pass/labour/log actions N/A because baseline is not a workshop document or stateful aggregate. No separate Phase4 domain transition. Mapping entity→list/detail and add/update→entity; Ignore RowVersion on mapping update only because EF OriginalValue owns the check. No ReverseMap, calculated values or journal.

Schema requires owner Add-Migration AddLeaveOpeningBalances; no migration/snapshot generated or edited. Source-only verification and full scoped diff in each actual repository required before final report. Packets PLAN00/PHASE00/01/02/03/05/06: generator -Check passed 2026-10-11, no drift or refresh needed. No unresolved required contract in this handoff; excluded future policies remain separate scope.

## Source-backed correction during integration, 2026-10-11

The earlier default page1/size10 description is superseded: Angular sends explicit page1 and shared DEFAULT_PAGE_SIZE=15 (UI6 owner default). Generic Service.NormalizePaging leaves both omitted values unpaged; one omitted value on a paged request defaults to page1/size10, with backend clamp1..100. Inherit this behavior and do not override GetManyAsync merely for defaults. Screen and export always send both paging values. This correction preserves canonical generic ownership without changing existing consumers.

Detail projection is a justified override: returning only baseline fields and Staff/LeaveType names avoids deep-loading the referenced Staff aggregate. Add performs business checks then delegates mapping/persistence to base.AddAsync inside the existing shared ExecuteUniqueWriteAsync guard; update uses a tracked entity and OriginalValue RowVersion. The shared unique-write helper owns its transaction/application lock; the feature introduces no local transaction or SQL. Inherited GetById/GetAllWithNavigations/GetSelect/CheckUnique/handleActivate remain generic compatibility endpoints without new UI consumers; no AddList/UpdateList API or feature consumer exists. No feature activation workflow is introduced.
