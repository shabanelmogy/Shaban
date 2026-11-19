# Driver Time Sheet — Feature Review and Contract Freeze

## Current bounded maintenance — 2026-10-28

Owner requests no horizontal scroll in Rental Driver Time Sheet and includes both Driver and Working Hours in the width adjustment. Tier S, Frozen presentation correction: active pages/routing /DriverTimeSheet -> driver-time-sheet.routes -> list DriverTimeSheetComponent, a stateful agreement-period collection editor (not generic paged CRUD/financial posting). Reuse existing shared EditableCollectionTable.fitWidth introduced under UI14's explicitly approved no-horizontal-scroll variant. Replace fixed1350px table and column minima (Driver450px, Working Hours240px) with proportional12/28/8/16/18/18percent for Day/Driver/Holiday/Working Hours/Driver OT/Invoice OT. Retain full wrapped driver names beside the fixed edit action, all six fields and typed row/control identities. Shared container640px labelled full-width cells handle small widths; all projected cells provide existing translated column labels. Numeric preview/calculation/holiday/editability/validation/Save/discard/API contracts unchanged. No new tabs, data hiding, overflow-x:hidden, feature table skin or backend/schema work.

Authority: current AGENTS/skill, Master1/5/7, UI14 fitWidth/1/19/22/29 and checked Phase03, all8 recipes pass. Analysis gate: entry references/speed-analysis/README.md; dated2026-10-28 sidebar09 screen08, route R0301 and controller C0780 (source raw/application.js extraction header) read for agreement/day/driver/hours/save context. Only frontend declarations accepted; foreign time-in/out, directory dialogs, calculations and server eligibility excluded. Relevant2026-10-27 guide searched for driver timesheet; no dedicated explanation/source found, so original-screen explanation is unavailable rather than invented. Existing frozen contract and /UserGuide/rental DriverTimeSheet topic compared. Current source/business ownership prevails; no unresolved business decision for sizing.

Loading/cache/performance: required DriverTimeSheet/agreements and Driver/GetSelect bootstrap is finite forkJoin with ReferenceLookupStatus page owner, both failure channels/Retry/finalize/DestroyRef. DriverService has no source cache opt-in and keeps its direct documented read; agreement choices and GetDriverTimeSheetsByAgreement/{id} are operational period/eligibility reads, AddList/EditList writes remain fresh, no new source cache/watch/invalidation changes. Row read already starts global loading and ends in finalize; remove its duplicate inline loading StateMessage while retaining conditional table mounting, busy/error/Retry. Save existing global owner unchanged. Width changes issue no resize/per-row requests and do not change response volume/query/count/page/tenant/history/pricing. No new index justified for this presentation-only fix; existing scoped query/timing/SQL-plan results remain unmeasured, pending owner cold/warm same-agreement/dataset/build/network conditions. No new canonical/skill/packet rule required: existing fitWidth contract covers this adoption. No agent used for one small sequential consumer change. Final source reconciliation follows below; older review/date below retained as historical context.

Final source result: adopted existing shared fitWidth with six percent widths totaling100 and removed1350px minimum. All six td labels point to existing EN/AR column keys; Driver retains same select/edit handler/options/value/validation, full wrapped current name and nonshrinking edit button. Working Hours retains typed numeric input/min/step/readonly/error/ID; holidays and both overtime values retain existing source/read-only semantics and formatting. Shared existing table container reflow/headers/vertical frame scroll owns responsive layout; totals and footer stay outside the row frame. Removed only duplicate inline row progress, keeping global subscribed start/finalize, busy gates and load failure Retry. Bilingual UserGuide/content/rental-guide.ts topic /DriverTimeSheet under /UserGuide/rental updated. Complete scoped frontend HTML/TS/SCSS diffs and guide delta reviewed in frontend repository; whitespace/conflict checks pass. Existing shared component input and percent/label contract source-confirmed; no service/import/backend/DTO/mapping/domain/schema/index/migration change. No new canonical/skill/generated edits; all8 initial recipe checks pass. Owner checks pending: wide/sidebar/narrow/RTL/theme views, long driver names, edit selector/clear/validation, hours entry and dirty confirmation, six retained fields/no horizontal overflow, vertical rows with visible totals/Save, loading/error/Retry and locked days. Source conformance does not establish visual/runtime/compiler acceptance. No builds/tests/lint/typecheck/browser/DB/migration/snapshot/Graphify/Sigma MCP/commit/push/deploy run. Suggested frontend commit: fix(rental): fit driver timesheet columns to available width. Reference cycle evidence C0780 raw202335–202562 remains frontend-only; no reference business rule imported.

Date: 2026-09-01  
Scope: `SiGmaAngularFrontEnd/src/app/modules/Rental/DriverTimeSheet` and the directly related DriverTimeSheet API/service/view-model files.

## Authority and evidence

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`, `SIGMA_UI_PATTERNS.md`, and `SIGMA_BACKEND_PATTERNS.md`.
- The generated phase packets were checked with `Generate-SigmaRecipes.ps1 -Check`; PHASE-00 through PHASE-06 reported stale derivative packets. The canonical guides were used directly and the generated packets were not edited.
- `a1.PNG` and `a2.PNG` are functional screenshot evidence. Their visible fields and workflow are explicit evidence; layout details are subordinate to the canonical UI pattern.

## Frozen functional contract

| Area | Decision | Evidence |
|---|---|---|
| Feature shape | Stateful agreement editor, not a generic paged CRUD grid | Screenshots show one agreement selector and one row per agreement day with one Save action. |
| Agreement selector | Show agreement number, customer name/number, and editability state | `a1.PNG` shows `Agreement No/Customer`; existing `RentalAgreement` contains the referenced fields. |
| Rows | Generate the inclusive agreement period, including days without a persisted child | `a1.PNG`/`a2.PNG` show a continuous daily range. Existing service already generated missing days. |
| Editable values | Working Hours and the row Driver are editable | `a1.PNG` shows editable working-hours inputs and a driver edit affordance. |
| Read-only values | Holiday, Driver OT Hours, and Invoice OT Hours are displayed but not client-editable | `a1.PNG`/`a2.PNG` show holiday state and OT columns without editable controls. No supported overtime calculation rule exists in the inspected source. |
| Holiday source | Recalculate from tenant-scoped `SettingsHolidayModel` records | Existing service already derived `IsHoliday`; client input is ignored on save. |
| Invoiced state | Include invoiced agreements when their option is available, but make the editor read-only and reject save | `a2.PNG` explicitly says editing is disabled for an invoiced period. |
| Closed state | Include closed agreements only when `SettingsCommonModel.GetCloseAgreementsForDriverTimeSheet` is enabled | The setting exists in the domain model; this is the smallest source-supported interpretation of its name. |
| Save semantics | Submit the complete inclusive period for one agreement and reconcile persisted children | Existing `AddList`/`EditList` API and the aggregate relationship establish the bulk workflow. |
| Empty/partial payload | Reject empty, partial, duplicate, out-of-period, cross-agreement, cross-tenant, and foreign-row payloads | Aggregate child reconciliation and tenant ownership are required by the backend pattern. |
| Single-row routes | Keep route compatibility but do not permit generic single-row mutation | The screen is a complete agreement-period editor; allowing generic Add/Update would bypass its invariants. |

## API contract

### Read

- `GET /DriverTimeSheet/agreements`
  - Returns `Results<DriverTimeSheetAgreementOptionVm>`.
  - Uses the tenant-scoped repository and orders by agreement identity descending.
- `GET /DriverTimeSheet/GetDriverTimeSheetsByAgreement/{id}`
  - Returns `Result<List<DriverTimeSheetRowVm>>`.
  - Returns one row for every date from `RentalAgreement.DateAndTime.Date` through `ReturnDateAndTime.Date` inclusive.

### Write

- `POST /DriverTimeSheet/AddList` accepts only client-editable row inputs for a new complete period: `AgreementId`, `DriverId`, `WorkDay`, and `WorkingHours`.
- `PUT /DriverTimeSheet/EditList` accepts the same inputs plus the existing child `Id`.
- The frontend does not send `SubscriptionId`, `No`, `IsHoliday`, or overtime values.
- The backend owns tenant identity, holiday state, created metadata, and overtime values. Existing overtime values are preserved; new rows start at zero because no source-supported overtime formula was found.

## Backend decisions

- Canonical backend shape: service/controller base with a feature-specific aggregate-child override for read projection and bulk reconciliation.
- `Repository.Query<T>()` is used for all tenant-scoped reads and writes. Direct unscoped `DbSet` access is not used by the feature service.
- Existing child IDs are checked against the selected tenant-scoped agreement before mutation.
- The tracked agreement-period child set is reconciled and saved through one `SaveChangesAsync` call, using EF Core's implicit transaction boundary.
- AutoMapper keeps entity-to-legacy VM maps for inherited compatibility and uses explicit input maps that ignore server-owned/navigation fields. The new row projection is manually assembled so the API returns only the screen contract.
- No entity shape or EF configuration changed; no migration is required.

## Frontend decisions

- Canonical UI shape: full-page fixed editor shell with a bounded shared `app-editable-collection-table`, matching the approved Rental editor pattern.
- The legacy generic `table-list` and standalone single-row editor route are no longer used by the feature entry point.
- The table owns its internal vertical/horizontal scrolling; the page shell and document body remain bounded.
- Save remains disabled until an editable agreement has loaded, the complete row collection is valid, and a change exists.
- Both result failures (`isSuccess: false`) and HTTP error callbacks render a translated or returned message.

## Unresolved business rule

The inspected source does not define how Driver OT Hours or Invoice OT Hours are calculated from Working Hours, holidays, or time settings. This refactor preserves existing persisted overtime values and displays them read-only. A future overtime rule must be supplied before implementing a calculation.
