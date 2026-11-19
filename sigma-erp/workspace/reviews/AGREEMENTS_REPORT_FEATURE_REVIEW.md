# Agreements Report — review and reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Contract | [Frozen contract](AGREEMENTS_REPORT_CONTRACT_FREEZE.md) |

## Outcome and scope

The existing Reports sidebar destination incorrectly opened `/Agreement`.
A dedicated `/Reports/AgreementsReport` now reads rental, lease and chauffeur
operational documents. It preserves all twelve screenshot filters, seventeen
columns, full-result Count, Search and Excel. No notes, extra cards or print
action were introduced. The title/subtitle and distinct filter/column labels
follow the screenshot; date columns preserve times.

Phases0/1 discovery and contract freeze,2 read/grid,5 integration and6 source
reconciliation apply. Phases3/4 writes and domain transitions are not applicable.
UI07/UI20 and BE17 own this report shape; the canonical shared reference is
Customers/StatementOfAccount/components/list, not an earlier report as authority.
Recipe drift check passed8/8; packets remain unedited. The final reconciliation
packet is read as a derivative checklist under the canonical books.

## Evidence coverage

| Element | Evidence / Sigma producer | Disposition |
|---|---|---|
| Screenshot filters and17columns | Supplied Agreements Report screenshot; controller C0967 | Matched source; contract lists every property beside its column |
| Optional date range; Open removes dates | Speed C0967 dateRangeCheck/statusChanged; existing AgreementService uses start DateAndTime | Matched; explicit checkbox can enable dates again |
| Rental/Lease/Chauffeur | Speed Reports/22, R0587 and C0967; owner “زى الصورة” | RentalAgreement/LeaseAgreement/TripBooking, not master or transportation contracts |
| Prices and totals | Agreement.TotalCharges/RecalculateTotals; selected BookingCharge.Rate; TripBookingService and LimousineBillingService | Backend-owned persisted totals / trip net fare; missing or duplicate Rent rate stays absent |
| End date and status | Saved rental return date, lease EndDate, trip dropoff; IsClosed / Finished | Scheduled/saved end and independent closure; expected dates do not prove returns |
| Fleet categories | Actual Sigma FleetType enum | Rental/Replacement/Staff supported; unsupported Speed enum values are not fabricated |
| Cancelled/NoShow | Native trip status and voided contract flags | Excluded from operational-contract population; complimentary rental remains included |
| Guide, explanation and cycle | Speed2026-10-27 guide/catalog;2026-10-28 rental/lease cycle and Reports/22 | No exact report explanation in original catalog; frontend reference cannot establish server finance |
| Complementary source | Pinned Odoo19 comparison matrix and create_rental_order.rst | Confirms different order lifecycle; no specialized chauffeur/report pricing mapping. Not imported as Sigma rule |

The exact dated controller is
`references/speed-analysis/2026-10-28/readable/controllers/C0967--tenant.views.agreementsReport.index.js`,
raw application.js262821–263142, SHA256
`CED10BD74A1C27F9006095EA014F0C7C071EEE02157531E228476D98463795F5`.
The original catalog contains rental/lease explanations, not an exact report
article. No remote reference collection or login was executed.

## Implementation ownership

| Concern | Canonical owner | Final implementation |
|---|---|---|
| Route and shell | UI1/3/20/24 | Reports route → AgreementsReportComponent host sigma-route-host → appReportPage fill → sigma-report-panel → shared fixed filter region and fill DataTable; no feature SCSS/height override |
| Filters and columns | UI5/6/16/17/19 | Typed form; bound text lengths/year/integer enums; paired optional ISO dates; same applied-filter snapshot for read/export; exact money strings |
| Request lifecycle | UI20/22/26/28 | createReportReadState; one page LoadingService lease per options/read/export, finalize and context cancellation; disabled form/busy/aria-busy, closed overlays on expiry; compact error and Search/Retry |
| Permission | UI26/BE6/9 | AgreementsReports.Read; Export additionally needs AgreementsReports.Export; Options uses Read. Explicit PermissionCatalogAction and PermissionPrerequisites; BranchOperationRules lists all3report reads |
| Related-record privacy | BE9 | QueryReport tenant/deletion/branch/structural ownership; VisiblePartners filters customer/driver/staff labels and customer/staff options by read branches. Selected reference IDs validated against the same option populations |
| Calculation and precision | BE15/UI19 | Existing Agreement total and Rent rate; existing limousine Charges+Tax−Discount; one valid base currency; shared converters and precision checks. No client financial sum or NaN |
| Dependency registration | BE5 | IAgreementsReportService supplied by existing FromAssemblyOf<AccountService>/AsImplementedInterfaces scoped registration |
| Output | UI20/21 | Fresh Export request with full applied filters; complete rows and authoritative count, local paging only; no partial-page export. Print unavailable and not transported |
| Mapping/persistence | BE3/4/17 | Scalar report projections; no AutoMapper/CRUD overrides; no new persisted entity, schema/migration or database changes |

Frontend files: `Reports/AgreementsReport/agreements-report.component.ts`, template,
service; reports.routes; route-access-policy; the single sidebar destination;
`i18n/vocabs/agreements-report.ts` with en/ar registration; explicit four runtime
entries in tsconfig.app.json. Existing unrelated dirty report changes were preserved.

Backend files: `AgreementsReportService` and its Rows/Options partials,
`AgreementsReportSource`, `IAgreementsReportService`, five report DTOs and
`AgreementsReportsController`; two scoped authorization additions. New source
specifications cover mixed-source identity/count and saved totals, final-day
filtering, conflicting Rent rates, branch leakage and export prerequisites.

## Cache / loading / speed evidence

| URL and symbol | Classification and lifetime |
|---|---|
| GET AgreementsReports/Options → options() | Direct contextual operational reference populations. Finite page-loader bootstrap; not opted into shared reference caching. Depends on saved rental/lease/trip and branch/partner/staff/origin data; no cached replay or new watcher. Source writes are picked up by fresh bootstrap/remount; session/branch/access revisions cancel and rebootstrap |
| GET AgreementsReports/Read → state.search() | Direct operational/financial read; no cache. Response valid only for applied filters and captured actor/access context; edits clear prior output |
| GET AgreementsReports/Export → exportToExcel() | Fresh complete authorized read, same filters and exact precision; cancel on context loss; client only formats full output |

Options uses four sequential scalar list commands. Read validates selected IDs,
resolves one currency, then executes at most two scalar row queries (contract and
trip populations); no Includes, per-row calls, query inside client loops or shared
DbContext parallelism. Unique Rent grouping cannot multiply contracts. Sorting
and count occur over the complete accepted set, not the visible page.

Existing snapshot indexes are individual Agreement FK indexes including VehicleId,
CustomerId and SalesPersonId; TripBooking has BranchId and reference FK indexes;
BookingCharge has AgreementId/BookingId. No explicit date composite was found in
these configurations/snapshot blocks. No index was added without plan evidence.
If real plans show scans, evaluate Agreement `(SubscriptionId,DateAndTime,Id)`
INCLUDE `(VehicleId,CustomerId,SalesPersonId,IsDeleted,IsClosed)` and TripBooking
`(SubscriptionId,BranchId,PickUpDateAndTime,Id)` INCLUDE `(Status,IsDeleted,VehicleId)`.
For large Rent grouping, evaluate `(SubscriptionId,AgreementId,ChargeType,IsSelected,IsActive)`
INCLUDE `(Rate,IsDeleted)` against the existing AgreementId FK index. These are
unapplied candidates: weigh extra write/storage cost and overlap; retain live-null
IsDeleted semantics rather than a filter that loses NULL rows.

No measured before/after speed claim. Owner verification should use the same
tenant/actor/branch, current-month and dates-disabled filters at small/large data
volumes; record Options/Read/Export round trips, SQL command counts/plans, elapsed
time, payload and render time. Compare selected vs all categories. Browser loader
visibility, narrow/RTL/dark/sidebar-open layouts and fixed paginator remain pending.

## Verification and handoff

Source reviews: complete scoped diffs inspected separately in frontend/backend
repositories; shared dirty-file additions distinguished from earlier work;
git diff --check passed. API DTO/consumer properties, module paths, namespaces,
translation registrations, explicit runtime entries, route/sidebar, permission
prerequisites and full-output scope reconciled. No source issue remained in the
bounded independent backend audit. Angular upper date bound matches API rejection
of9999-12-31; dates retain screenshot time values.

Backend build executed:
`dotnet build tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj --no-restore --output F:/My Work/Sigma/.codex/builds/agreements-report-backend`.
API and specification compilation succeeded:0errors,41pre-existing warnings,
elapsed3:07.52. Log `.codex/agreements-report-backend-build.log`.
This compiles specifications; it does not execute them or establish SQL translation.

Angular strict template/compiler check executed with the installed compiler:
`node --max-old-space-size=4096 node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js -p tsconfig.app.json`.
Exit0; `.codex/agreements-report-ngc.log` contains no diagnostics. Emitted report
component/service, vocab and guide were present; the emitted template and component
include the final distinct filter labels, dateTime fields and upper date guard.
The first application bundle attempt stopped with esbuild `The service was stopped`,
without a source diagnostic; its remaining failed-build process was stopped by
verified task command line only. An intervening no-sourcemap attempt ended without
a result after interruption and is not counted as successful. Final bundle retry
uses one build worker,4GB heap and no source maps as command-line flags only;
project configuration is unchanged.

Final application bundle succeeded, exit0,102.076seconds at2026-11-18T19:48:49.985Z:
`node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng.js build --configuration=development --source-map=false --output-path=F:/My Work/Sigma/.codex/builds/agreements-report-frontend-verified`.
Log `.codex/agreements-report-frontend-verified-build.log`. The output contains
`reports.routes-E7JMFMVF.js`; the final report/template labels and date-time
rendering are present. Eight scoped source/config files match the SHA256 manifest
captured before the successful build, with no intervening edits. Source maps were
disabled only for this memory-bounded bundle; the separate Angular compiler emitted
the source-checked component/service/guide/vocab successfully. No runtime acceptance
is implied by either build.

In-app guide: `UserGuide/content/agreements-report-topic.ts`, registered once in
`reports-guide.ts`, available at `/UserGuide/reports` through the existing Reports
guide menu. Covers filters, dates/states, populations, saved amounts,17columns,
count/paging, permission/branch scope, errors and complete Excel. Source conformance
is verified; actual guide/report rendering remains pending.

Team: root owns discovery/freeze/backend/integration and final diff/build checks;
reused vehicle_expense_final_review agent owns nonoverlapping Angular files and a
subsequent read-only backend audit, inherited model. Parallel frontend/backend work
avoids duplicate discovery and reduces time without overlapping mutations.

No tests, lint, browser automation/application execution, DB changes, migrations,
commits, pushes or deployments were run. No Sigma MCP, Graphify, retired guides or
full-solution scans were used. Restart the API with the updated build before owner
acceptance. Verify all12filters,17columns and external/internal chauffeur rows,
branch-restricted access, duplicate/missing-rate blanks, final-day inclusion,
optional dates, live context changes, empty/error recovery and full Excel export.

Suggested frontend commit: `feat(reports): add agreements report with scoped filters and full Excel`.
Suggested backend commit: `feat(reports): read rental lease and chauffeur agreements with scoped access`.

## Follow-up — filter alignment from owner screenshot112233

The owner reported unbalanced filter rows. TierS presentation-only correction,
2026-11-18: no new financial, API, permission or filter-behavior contract. The
previously reviewed Speed evidence and the frozen12field/17column contract remain
applicable; Odoo supplies no layout authority for this correction. Sigma skill and
systematic-debugging apply. Recipe check passed8/8 again; packets were not edited.

Verified causes in the actual template/shared sources: Date Range placed the
34px-minimum `.sigma-report-filter-check` above the date control while other
labels use a compact caption; `FieldError.reserveMessage` also retained invisible
validation height below that field. The actions wrapper used the inline-wide
span2 modifier in a four-column grid, centering its controls in half the report.

Corrected only `agreements-report.component.html`: the date label now shares its
row with other labels; the checkbox sits beside its calendar using existing
sigma flex utilities. Removed only the reserved hidden message, retaining real
validation errors and date enable/disable behavior. Action and error wrappers use
the canonical `sigma-field--full` full-grid span. Count precedes a growing spacer
and Search/Excel remain at logical end on the same full-width row. The4column,
1250px3column and640px1column shared breakpoints remain owned by the shared strip.
No feature CSS, shared-owner mutation or extra report elements were added.

UI20 explicitly documents full action rows through `sigma-field--full`.
UI19/22 preserve real validation and compact failures; UI24/shared utilities own
geometry/RTL/theme. No requests, cache eligibility/watch, loading ownership,
calculations, data or indexes changed. Existing in-app Reports topic remains
accurate because this changes placement only. No subagent was used: this is one
small template fix. Browser/visual acceptance remains pending under the existing
boundary.

Affected Angular development build succeeded, exit0,120.509seconds,
2026-11-18T20:03:29.457Z. Command uses the same one-worker/4GB/no-source-map CLI
flags as the prior successful verification, output
`.codex/builds/agreements-report-filter-layout`, log
`.codex/agreements-report-filter-layout-build.log`. Compiled report bundles contain
the full-span action wrapper, shared date flex layout and checkbox/input IDs.
Template SHA256 before/after build is unchanged:
`BEC95F9E6AE184C80EC80758564AE4864025C89C62B22661022276F7201DDBD5`.
Scoped diff/source review and `git diff --check` passed. No tests or browser were
run; no backend build is required for this HTML-only correction.
