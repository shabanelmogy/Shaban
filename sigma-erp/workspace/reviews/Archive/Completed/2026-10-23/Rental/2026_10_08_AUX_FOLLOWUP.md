# Rental auxiliary frontend follow-up — 2026-10-08

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `RentalTariff`, `TariffCard`, `DriverTimeSheet`, `RentalPlanner` frontend only |
| Contract | `RENTAL_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md`; prior `RENTAL_AUX_UI_CONTRACT_FREEZE.md` |
| Verification boundary | Source-only; no build, test, lint, browser, database, migration, commit, or push |

## Governance and current packet state

The required recipe check on 2026-10-08 reports PLAN-00 and phases 00/01/02/04/05/06 current; generated `PHASE-03-detail-write.md` remains stale. This follow-up therefore uses the canonical Master/UI books and the frozen Rental contracts directly and does not edit generated packets. No screenshots or new business requirements were supplied. Backend APIs, DTOs, calculations, permissions, schema, the Planner grouped timeline matrix, and the RentalTariff dense configuration dialog remain frozen.

## Before-edit evidence and conformance

| Concern | Canonical owner | Actual reference / shared symbol | Current target evidence | Decision |
|---|---|---|---|---|
| Deferred dirty route exit | UI10 `Pending discard decision`; UI28 | `Movements/collectionMovement/components/details/DetailsComponent.canDeactivate`; RxJS `defer`, `of`, identity/busy recheck, form freeze/finalize restore | `DriverTimeSheetComponent.canDeactivate()` is `async`, calls `firstValueFrom(confirmDiscard(...))`, sets the pending flag and opens the prompt immediately, and leaves reactive controls enabled during the decision | Confirmed defect. Return `boolean | Observable<boolean>`, defer prompt creation until subscription, recheck agreement/row identity and busy state, freeze without emissions, and restore the same form state on cancel/stale completion. |
| Agreement selector discard | UI10 | Same confirmation owner and local agreement identity | `onAgreementChange()` rolls the selector back before prompting and already gates UI through `discardPending`, but it does not disable the reactive form during the pending decision | Confirmed related defect. Reuse the same local freeze/restore helper; recheck captured agreement/row identity before applying the replacement selection. |
| Saved date-only hydration | UI17 `Hydrate saved calendar dates through the shared owner` | `shared/utils/date-utils.ts::toPickerDate` | `RentalPlannerComponent.selectedRange()` parses to `yyyy-MM-dd` and reconstructs both endpoints with `new Date(value + 'T00:00:00')` | Confirmed defect. Hydrate both parsed endpoints through `toPickerDate`; retain the current local-day, inclusive-range, zoom and API query behavior. |
| Saved date-time hydration | UI17 date-time wall-clock exception | `toApiDateTime`; `dateTimeValueValidator` | TariffCard `fromDateTime`/`toDateTime` are time-enabled controls; `parseServerDate()` preserves the time component through the existing wall-clock API contract | Justified deviation. Do not replace with date-only `toPickerDate`, which would discard time. No change. |
| Global loader and inline errors | UI22; UI28 | Workshop Job `bindListQueries`; `LoadingService`; `apiErrorMessage`; `app-state-message` | Tariff and TariffCard list/detail/save/delete, DriverTimeSheet row load/save, and Planner search pair primary loading with `finalize`; inline requests opt out of interceptor errors and handle Result plus transport failures. Lookup-only loads use local busy/error/retry state. No `error: () => undefined` occurs in the four owned roots. | Conforming. Preserve current request/API behavior; no source change. |
| Planner specialized matrix | Frozen Planner contract | `RENTAL_PLANNER_DISCOVERY_CONTRACT_FREEZE.md` | Grouped date/hour headings, vehicle-type row spans, status codes and matrix scroll remain feature-owned | Frozen exception. Date hydration fix must not alter matrix presentation or persistence. |

## Planned source changes

| Finding | Owned files |
|---|---|
| Deferred DriverTimeSheet discard and control freeze | `src/app/modules/Rental/DriverTimeSheet/components/list/list.component.ts` |
| Shared RentalPlanner date-only hydration | `src/app/modules/Rental/RentalPlanner/components/list/list.component.ts` |

Final scoped diff evidence and source-only reconciliation will be appended after implementation. Runtime, visual, RTL, theme, input, navigation and compiler acceptance remain pending for the owner.

## Final source reconciliation

| Concern | Final source evidence | Result |
|---|---|---|
| Deferred dirty route exit | `DriverTimeSheetComponent.canDeactivate()` now returns `boolean | Observable<boolean>` and wraps the confirmation in `defer`. The subscribed path rechecks saving/loading/pending, dirty state, selected agreement and `rowsVersion` before opening. | Matched UI10/UI28. Calling the guard without subscription has no side effect; stale/duplicate decisions fail closed. |
| Pending form freeze | `freezeFormForDiscard()` disables the typed form with `emitEvent:false`, restores it once, and re-disables the previously disabled holiday controls. `canDeactivate()` restores only the same agreement/row version; agreement-selector confirmation uses the same helper and identity check. | Matched UI10. Values and dirty state are retained on Cancel; server-owned holiday controls remain disabled. |
| Planner date-only hydration | `RentalPlannerComponent.selectedRange()` keeps `parseDateRange` validation then calls `toPickerDate` for both endpoints. | Matched UI17. Local calendar days, inclusive query dates, month default, grouped matrix and zoom behavior are unchanged. |
| Loading/error ownership | Re-audit found no changed requirement: primary list/detail/save/action requests retain paired global loader/finalize; lookup-only reads retain local busy/error/retry; both Result and transport failures remain handled inline where the service opts out of the interceptor. | Matched UI22/UI28; no extra source edit. |
| Frozen exceptions/contracts | No RentalTariff dense-dialog, TariffCard date-time transport, DriverTimeSheet payload/overtime behavior, Planner matrix, API, domain, translation, shared wiring or backend source changed. | Preserved. |

Changed application files:

- `src/app/modules/Rental/DriverTimeSheet/components/list/list.component.ts`
- `src/app/modules/Rental/RentalPlanner/components/list/list.component.ts`

Review artifact:

- `reviews/Archive/Completed/2026-10-23/Rental/2026_10_08_AUX_FOLLOWUP.md`

Source-only checks completed: complete scoped Git diff for all four owned folders; `git diff --check`; exact scans for merge markers, `firstValueFrom`, private `T00:00:00` hydration, `toISOString()`, and `error: () => undefined`. The final scoped application diff contains only the two files listed above. Build, test, lint, browser, runtime, database, migration, model snapshot, commit, push, Graphify and Sigma MCP were not run. Owner compiler/navigation/input/RTL/theme/visual acceptance remains pending.

## Root integration continuation — 2026-10-09

The earlier bounded audit missed pending-discard reactive-control freezes in
TariffCard and RentalTariff. Root source audit found and corrected them: TariffCard
restores via applyMode/syncDependentControls only for the same visible editable
identity, and RentalTariff freezes both typed configuration and standalone
selection controls; its restore helper retains periodic disabled sections through
applyTypeShape. Selection replacement and close recheck vehicle/loaded-selection
identity. All remaining auxiliary queueMicrotask callbacks now use timer(0) with
destroy teardown. Driver and Planner changes remain as audited above. These
root corrections supersede any earlier broad conformance/no-change claim for
those two dialogs. Source-only; owner acceptance remains pending.
