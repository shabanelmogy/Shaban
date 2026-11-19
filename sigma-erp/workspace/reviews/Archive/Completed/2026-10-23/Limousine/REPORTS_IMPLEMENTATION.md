| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

# Limousine report implementation

Frozen handoff: `../LIMOUSINE_REPORTS_CONTRACT_FREEZE.md`. Ownership is limited to UtilizationReport, ChauffeurForcedAllocationsReport and limousineTariffReport folders. No backend changes.

## Conformance evidence before edits

| Concern | Owning book | Actual reference / shared owner | Target match |
|---|---|---|---|
| Bounded report/title | UI1/3/20 | StatementOfAccount list template; ReportPageComponent; styles.scss sigma-report-page--fill/sigma-report-panel; FeatureTitleComponent | Adopt exact shared chain; no copied surface, inset or viewport calculation |
| Grid/output | UI5/6/20/21 | DataTableComponent actual exported DataTableColumn, dataTableExportRows; ReportPrintService.createSession | Complete arrays lazy=false; unpaginated fill grids for first two reports; one shared document frame with non-scrolling grids for ordered tariff sections; print releases all bounds |
| Summary | UI24 | SummaryCard from summary-card.model; SummaryCardsComponent public cards/density/layout/minCardWidth/maxHeight | Server Utilization.summary supplies all three cards; no frontend sum |
| Dates/feedback | UI17/19 | DatePickerDirective; date-utils currentMonthRange/parseDateRange/dateRangeValidator; FieldErrorComponent reserveMessage; focusField | Shared current-month dates, manual input and validator; required range only; no date parser copies |
| Error ownership/recovery | UI2/16/22 | BaseService.getSelectList({skipErrorInterceptor:true}); apiErrorMessage; ReportActionsComponent | Report requests suppress interceptor for one inline owner; lookup failures block dependent search with explicit Retry |
| Export/i18n | UI8/23 | DataTable exported formatter; onExportToExcel; tsconfig es2018 | Build translated headers on click; preserve full source/summary and tariff section order |

Source-only inspection; build, tests, lint, browser, database and runtime verification remain owner-pending. Root owns packet drift check and final integration.

## Applied decisions and final reconciliation

| Concern | Final source evidence | Result |
|---|---|---|
| Shape / regions | All three route components retain BaseComponentService and use sigma-route-host/sigma-print-flow, appReportPage and direct sigma-report-panel title. First two use one sigma-list-table + fill DataTable row viewport; tariff uses one accessible sigma-report-table-frame with scrollable=false section grids | Matches UI1/3/6/20. Feature SCSS retains only summary host separation and tariff section placement/heading print control |
| Grids / response | Utilization columns date, conditional hour, tripsCount, kmsCount, chargesSum match row model date/hour/tripsCount/kmsCount/chargesSum. Chauffeur columns tripNo/pickUpDateTime/dropOffDateTime/pickUpLocation/dropOffLocation/chauffeurName/reason exactly match row model. Tariff location columns location1/location2/vehicleType/rateType/rate and standard vehicleType/rateType/rate match its item model | lazy=false, paginator=false; no server paging, sort, row action or selection introduced; no ListVM exists for these reports |
| Complete data proof | TripBookingService.GetUtilizationReportAsync materializes grouped rows then BuildDailyRows/BuildHourlyRows and authoritative server Summary. GetChauffeurForcedAllocationsReportAsync orders and materializes all matching rows, Reason=x.Notes. LimousineTariffService.GenerateReportAsync materializes all active tariffs and allowed sections/items in source order; no Skip/Take | All reachable response rows remain in grid, print and Excel. No API defaults/formula change |
| Summary | Utilization.summaryCards reads only report.summary.tripsCount/kmsCount/chargesSum and shared public compact/row/min190/max100 sizing, with 12px host separation | Server-owned figures retained. Frontend does not sum operational or monetary totals |
| Date defaults / transport | Both ranged reports use Date[]\|string\|null, currentMonthRange, required + dateRangeValidator, parseDateRange and toFilterParams; p-calendar appDatePicker has range/two months/keepInvalid/manual input/clear and reserved FieldError | Inclusive local yyyy-MM-dd transport preserved; old today-only / three-year UI defaults replaced by the frozen current-month rule. No UTC conversion/private parsers |
| Search / output scope | One ngSubmit path; submit validates/touches/focuses the actual field. Report requests guard duplicate starts and disable form with emitEvent=false. On success appliedFilter captures request; every filter edit/reset clears report and appliedFilter | No stale successful report can be printed/exported under edited filters. Automatic first load remains, now after required lookup success |
| Lookup recovery | Utilization forkJoin reads Branch/Customer/VehicleType actual select wrappers; tariff Customer select uses DropDownSelect and validates selected membership. Each uses skipErrorInterceptor, local busy, both failure channels and explicit Retry | Failed lookups remain failed, never successful empty data; dependent Search blocked until success. Successful empty tariff customer select still permits Base |
| Error/loading lifecycle | Three getReport/generateReport calls use X-Skip-Error-Interceptor with inline StateMessage, response.message or apiErrorMessage; auxiliary lookup failures use one shared alert with Retry. All requests use takeUntilDestroyed/finalize; main requests pair global loading start/end | Single error owner for business and HTTP failures; local/global busy and disabled-form state released on completion/destruction |
| Print | ReportPrintService.createSession(DestroyRef), printing-bound busy form effect and action guards; all grids bind printAllRows; fill grids switch scrollable=false and all bounded layers carry sigma-print-flow | Complete unpaginated source and summary print; shared session restores afterPrint/cancel/failure without private timer/body/window handling |
| Excel / translated values | Utilization and Chauffeur call dataTableExportRows at click time; Utilization appends the authoritative summary. Tariff traverses every ordered section with typed for-of/push, a translated section column and fixed complete export columns; known server rate labels translated in one grid/export callback | ES2018-compatible; no cached translated headings or page slicing. Unknown server rate labels retain source text |
| Wiring / access | Existing three route files and in-scope lazy route imports inspected and retained; root handles toolbar exclusion/translation integration | No new provider/HttpClient/permission API. Authorization candidates: none (read-only reports) |

## Exact files changed

All paths below are relative to `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Limousine/`:

| Report | Changed files |
|---|---|
| UtilizationReport | components/utilization-report.component.ts; components/utilization-report.component.html; components/utilization-report.component.scss; models/utilization-report.model.ts; services/utilization-report.service.ts |
| ChauffeurForcedAllocationsReport | components/chauffeur-forced-allocations-report.component.ts; components/chauffeur-forced-allocations-report.component.html; components/chauffeur-forced-allocations-report.component.scss; models/chauffeur-forced-allocations-report.model.ts; services/chauffeur-forced-allocations-report.service.ts |
| limousineTariffReport | components/limousine-tariff-report.component.ts; components/limousine-tariff-report.component.html; components/limousine-tariff-report.component.scss; services/limousine-tariff-report.service.ts |

Review artifact: `F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/Limousine/REPORTS_IMPLEMENTATION.md`.

## Scope / verification / integration

Phases 2 (read/grid/filter/output) and applicable 5 (standalone consumer/wiring checks) applied against the root's frozen Phase1 contract; Phase6 bounded source reconciliation completed for owned paths. Phases3/4 skipped: no detail/write/domain-action workflow. Backend, mapping, domain calculations and database schema unchanged; no migration is needed. No screenshots were supplied. No missing business/API decision was invented.

Root integration requests: add EN/AR `limousineUtilizationReport.lookupLoadError`; `limousineTariffReport.loadError`, `lookupLoadError`, `tariffType`, `oneTime`, `halfDay`, `weekly`, `twoWayTransfer`, `threeWayTransfer`, and `rateTypes.oneTime/perKm/extraHour`. Tariff source RateType is producer text `One Time`, `/Km`, `/Extra Hour`, not a newly inferred enum. Root owns the parity check and all shared/translation edits; these requests must be reconciled before overall completion. A short repeated report busy/form effect was reported to root for the shared-extraction gate; all visual, date, query, formatting, error and print ownership already reuse existing shared pieces.

Source checks: scoped model/service consumer search; actual exported shared symbols and standalone registration/public input names; ES2018 library contract; complete producer and existing route inspection; complete owned TS/model/service and template diff review; feature SCSS replacement inspection; obsolete native table, ngModel, parser, viewport, deep-selector, cached-export and silent-error searches; git diff --check. Git only reports existing LF/CRLF normalization notices, with no whitespace errors. No build, tests, lint, browser automation, app/runtime verification, database command, migration, Sigma MCP, commit, push or deployment was run.

Owner acceptance: compile Angular; exercise picker and manually typed complete/partial/reversed ranges; Search, Reset, failed report/lookup and Retry; verify one feedback owner and loader restoration; edit filters after success; print a whole month hourly report and all tariff sections/cancel print; compare Excel row count/summary and headers after language switch; verify keyboard, narrow layouts, LTR/RTL and light/dark with only the documented internal content scroll.

Suggested frontend commit: `refactor(limousine): align operational reports with shared report patterns`.


Focused continuation audit (2026-10-07): reviewed current three-report TS/templates/services/models and their actual shared/public PrimeNG declarations, complete backend response producers, server summary, applied-filter invalidation, whole print/Excel and both lookup/report failure channels. Removed the redundant 10px tariff section wrapper padding so each full-width section grid shares the result-frame edges under UI20; section spacing and print heading flow remain. No report query, values or output scope changed. Syntax/local named-export path inspection across all 38 owned master/report TS files reports zero findings; scoped whitespace inspection is clean. This establishes source/syntax evidence only; Angular type checking, compilation, visual/browser/runtime acceptance remain owner-pending. Masters follow-up repairs and root integration are recorded in MASTERS_IMPLEMENTATION.md.
