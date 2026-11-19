# Rental auxiliary implementation — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Scope: frontend RentalTariff, TariffCard, DriverTimeSheet, RentalPlanner. Frozen handoff: RENTAL_AUX_UI_CONTRACT_FREEZE.md. Backend read-only; no build/test/lint/browser/database/migration/commit/push.

## Before-edit source conformance

| Concern | Book | Actual reference/shared owner | Target comparison / decision |
|---|---|---|---|
| Route/list shell and title | UI1/3 | Workshop/Job list metadata host sigma-route-host; HTML sigma-list-page/panel/header/table | Four targets have private shell/palette copies; replace with same shared chain. Planner matrix exception stays. |
| Filter/reset | UI4/17/19 | Job list FilterPanel stableLayout true, resetRequested, shared FieldError reserveMessage; date-utils dateRangeValidator | Tariff search becomes shared single-column panel; Planner shared range/make/plate/zoom fields. Driver selection gets shared workspace panel and dirty discard. |
| Pager | UI6/28 | Job pageSize DEFAULT_PAGE_SIZE15, options10/15/20/50/100, resolveListPaging, switchMap | Tariff/Card retain server paging and counts; replace5/10/25/50 choices/private paging. |
| Dialog | UI10/13/15 | EditorDialog contentPadded input / controlled visibility; VehicleService reference inspected (current source is routed) | Existing approved tariff dense-dialog exception preserved by frozen handoff. Card modal retains supported View→Edit action. Shared body/fields/states. |
| Collections | UI14/27 | EditableRows.requestRemove same-row re-resolution/canMutate/pending; shared table numeric value highlight; SummaryCards slim | Tariff child removal and settings replace local mechanics; Driver hours native NumericFocus appearance, overtime shared numeric text, totals SummaryCards. |
| Errors/dates | UI17/22 | apiErrorMessage + X-Skip-Error-Interceptor; date-utils toApiDateTime/formatDisplayDate | Replace private copies, suppress duplicate mutation success. Card UTC suffix/serialization removed under local-time contract. |
| Planner matrix | Frozen planner contract/UI1/24/25 | Existing grouped two-row headings/type rowspan/status codes | Preserve specialized p-table width/sticky/overlap semantics; shared shell/filter tokens/state, matrix only retains feature styling. |

No screenshots were supplied. No API, permission, calculation, schema or business redesign is authorized. TypeScript explicit lib es2018/dom inspected; no ES2019 APIs planned. All scoped folders were clean at implementation entry.

## Final reconciliation

Root completed the partial worker changes and reconciled all four live roots: shared shells/paging/filter reset, typed local dates and shared errors/retry, collection removal/Add focus, numeric roles and SummaryCards. Tariff remains the Frozen configuration dialog; Planner retains its grouped matrix and begins its initial search after successful make loading. Four unreachable DriverTimeSheet details/spec files were retired under the AUX handoff. TariffCard failed list reads have explicit Retry. Backend contracts and calculation ownership are unchanged.

Final conformance and owner checks: `F:/My Work/Sigma/reviews/RENTAL_FEATURE_REVIEW.md`. Parser/import/template/vocabulary/whitespace evidence: `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/Rental/FINAL_SOURCE_VERIFICATION.md`. Runtime/visual/build acceptance remains pending; no prohibited commands ran.
