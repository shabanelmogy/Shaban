# Rental auxiliary UI handoff — 2026-10-06

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Source-backed clarification — 2026-10-06

Planner's historical exception freezes its grouped timeline matrix, not its two-day default filter. The current backend accepts a date range without a two-day restriction. Apply UI17 `currentMonthRange()` and shared `dateRangeValidator`/calendar transport; preserve the approved matrix, zoom semantics and internal scroll owner. No new endpoint, business limit or state transition is introduced. Owner verifies monthly matrix performance at the existing hour zoom.

DriverTimeSheet's only live route imports its agreement workspace list. Its old `components/details` editor has no runtime import or explicit app compilation entry; it copies the obsolete generic booking workflow and uses untyped payloads. Retire those four unreachable component/spec files instead of maintaining a second writer. Keep the live workspace, service and models. Route exits use the same shared dirty-confirmation owner as agreement-selector changes.

Root approved `Rental/AUX_DISCOVERY.md` source/API evidence and confirmed UI fixes, under the Frozen Rental maintenance plan. Scope: RentalTariff, TariffCard, DriverTimeSheet, RentalPlanner frontend only. Existing related backend remains read-only.

| Feature | Frozen contract / UI shape |
|---|---|
| RentalTariff | VehicleType paged grid `id/name/detail/notes`; configure action, existing Tariff/GetEditor and Add/Update four-child full snapshots, saved IDs/type/card selection. Shared list + existing dense configuration editor. TariffSetting replacement semantics remain current API; no redesign to omission behavior in this UI task. |
| TariffCard | Existing typed normal-entity list/modal; grid columns equal ListVM; exact name/period/discount nullable inputs preserved; backend guards referenced delete. |
| DriverTimeSheet | Existing operational agreement selector and all-days collection; GET agreements + GetDriverTimeSheetsByAgreement, AddList/EditList; payload only agreement/driver/workday/workingHours/id, server holiday/overtime/canEdit retained. Shared workspace/editable collection/numeric controls. WorkingHours is hours, not quantity; use existing numeric focus appearance, preserve decimal/precision and validators. |
| RentalPlanner | Explicit historical grouped timeline exception preserved. GET inclusive local startDate/endDate, optional carMakeId/plateNo; zoom presentation-only; make lookup CarMake/GetSelect; no paging/actions or persistence. Keep matrix and bounded scroll, migrate shared route/title/filter/date/errors only. |

Adopt shared shells/filter Reset+stableLayout, DataTable fill/resolveListPaging/default page15 (standard10/15/20/50/100), shared typed formatting/export/error/date/confirmation utilities, SummaryCards/EditableRows where applicable, same numeric role/validation/API semantics. Inline failure requests explicitly opt out of error interceptor; mutation success interceptor-owned. Mode-aware dialogs use contentPadded and hide primary action for View when no edit action is supported. Preserve dirty discard, required lookup recovery, cancellation, print, existing fields.

Do not invent missing tariff selection/calculation/protection rules, new units or permissions. No screenshot/new business requested. Equipment Rental/TimeSheet is outside Rental and its finding is excluded; no source retirement or repair in that unrelated folder. Master/API DTO/entity/EF/migration changes excluded.

Aux worker owns all files in the four scoped Rental folders. Root owns shared routing/providers/toolbar/config/translations and final integration. Workers preserve peer/user edits and coordinate missing shared capabilities rather than editing shared owners concurrently.
