# Report tree expand/collapse controls

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Owner instruction2026-10-05: every report that contains a tree must expose open/close controls, and establish this in documentation. Interpreted as Expand All / Collapse All, including every nested branch; these are reversible local presentation actions. UI shape catalog07 report, backend pattern5/read contract untouched. Select canonical UI6 hierarchy + UI20 report actions, actual TrailBalance/Customer Statement/ReportActions references, required skill6.1 and PHASE02. Recipe Check: eight current.

| Concern | Book/reference source | Shared owner | Frozen decision |
|---|---|---|---|
| Common accessible controls | UI20 actual ReportActions native toolbar; UI6 hierarchy | New ReportTreeActionsComponent over existing ReportActions and sigma-secondary-button | Two translated native type=button controls, 34px shared button treatment, wrapping/RTL/themes, no-print, empty/loading disabled; one UI owner |
| Complete recursive expansion | UI6 DataTableHierarchy initialized/expanded key sets; TrailBalance config | DataTableComponent | Automatic controls when hierarchy present; recurse complete source, explicitly initialize every key before collapse so defaultExpanded cannot reopen hidden nodes; rebuild once, return scroll to start; no row/total mutation |
| Print/output independence | UI6 printAllRows and existing family complete export | Existing hierarchy materialization/export | Controls hidden during print, actions guarded during loading/print; printAllRows keeps complete descendants and screen state; export still reads original source |
| Existing dynamic tree reports | ReportsComponent TreeNode branch +12 isTree=true producers, ProfitAndLoss/VehiclePurchase recursive maps | Existing shared ReportsComponent | Same toolbar; recursively clone existing TreeNode topology/metadata/data and set expanded flags only. Repeated action works after individual toggles; new source array resets local bulk override. Existing root paginator/min-width/toggler preserved |
| Runtime/translations | UI1 explicit files; UI23 EN/AR | tsconfig.app.json and reports keys | Register new runtime component explicitly; no broad includes/specs, add three shared translations |

Inventory: eleven Accounts hierarchical report configs flow through one DataTable family template; three flat Accounts reports retain no tree controls. Existing shared dynamic Reports adapter supports twelve tree configurations. No private tree-report tables were found beyond that compatibility adapter. Source search scoped to hierarchy/template consumers and isTree producers only; no full-solution scan.

Scope is additive shared tree controls. The owner explicitly requests all report trees, including existing dynamic consumers; preserve their existing legacy TreeTable body and paging for this bounded view-action change rather than inventing a dataset/pager conversion. That body remains compatibility-only, not a new canonical reference, and full report-body migration remains governed by UI6/20 in its own review. No legacy table is introduced or restored. No data completeness/API/business invariant is inferred or changed. This compatibility boundary is frozen before implementation, not justified retrospectively by documentation.

No screenshots, missing material decision, new business/API/DTO/permission/financial calculation/schema/AutoMapper contract or migration. Phases0/1 discovery/presentation freeze,2 shared capability,5 imports/runtime entry and6 source reconciliation; backend/editor/domain-action work inapplicable. No agents: one small capability with tightly coupled shared UI/expansion owners and translations; parallel ownership would add coordination. Preserve all pending source. Builds/tests/lint/browser/application/DB/migrations/commits/push/deploy/SigmaMCP/Graphify prohibited; source parsing/diffs only, owner runtime/visual verification pending.


## Final reconciliation — 2026-10-05

| Frozen concern | Final source evidence | Result |
|---|---|---|
| Single controls owner | New report-tree-actions/report-tree-actions.component.ts over ReportActions; two translated native secondary buttons, type=button, disabled input, boolean expansionChange output; print hides both host and toolbar | Match |
| Recursive DataTable commands | Existing initialized/expanded sets updated over all original descendants; collapsed hidden identities initialized; one rebuild/scrollToStart; no input-row write | Match in source |
| Automatic Accounts coverage | Shared DataTable template detects hierarchy; eleven configs use family binding; flat/indent-only modes show no controls | Match |
| Legacy dynamic coverage | ReportsComponent imports same toolbar, binds local computed treeRows; recursively clones TreeNode metadata/data/children with only expanded changes; source-reference guard resets override; new command object allows repeated operation after row toggles | Match |
| Busy/print behavior | DataTable loading/printAllRows guard; dynamic adapter global loader AsyncPipe disabled and method value guard; shared host print hiding | Match |
| Output scope | Canonical printAllRows and family exporters unchanged; original rows/figures untouched; dynamic adapter has no Print/Excel implementation and retains its existing output/body/pager contract | Match to scoped compatibility boundary; native legacy full-output acceptance not claimed |
| Wiring/translations | Explicit tsconfig runtime file, both standalone imports, three unique reports keys in EN/AR, icons confirmed in installed Bootstrap font CSS | Match |
| Documentation | UI6/20, skill6.1 and dated history, CHANGELOG; eight regenerated recipe Check current | Synchronized |

Eight application files: new ReportTreeActions component; DataTable TS/HTML; shared Reports TS/HTML; EN/AR vocabularies; tsconfig.app.json. No feature-specific report templates/configs or CSS changed, no API/backend/schema/DTO/AutoMapper/domain calculations/migrations. Tree rows/columns/filters/totals/navigation/export scope preserved. Dynamic Reports retains its legacy five-root paginator/min70rem/toggler body for this frozen additive compatibility change; it is not presented as the canonical report-body pattern. Existing pending source, including report width/gutter/loader and hierarchy changes, preserved.

Source verification: root reviewed complete scoped grid/report/runtime Git diffs and new untracked component, plus all current-task source deltas against immediate pre-edit snapshots. EN/AR current diffs contain exactly three new keys each, proved by snapshot equality after their removal; historical vocabulary edits preserved. Five TS syntax parses, two external Angular templates and new inline template parse clean. Explicit runtime entry exists exactly once, translation keys unique in both reports objects; merge-marker/whitespace checks clean. These parsers do not establish TypeScript semantic compilation or runtime appearance. No tests/build/lint/application/browser/DB commands run. Documentation rule/control/legacy compatibility details reconcile with final source; all eight regenerated packets current.

Owner verification: open BalanceSheet/CashFlow/TrailBalance and other tree Accounts reports; expand all levels, collapse all, open one parent and confirm nested branches remain collapsed, repeat buttons after manual toggles. Check empty/no-branch/loading states, no toolbar on flat reports, keyboard/EN/AR/RTL/themes, long rows/internal scroll and retained table/card edges. Print canonical family after collapse must still include all descendants and restore collapse; Excel remains complete. For a dynamic tree report such as ProfitAndLoss/VehiclePurchase, verify recursive expansion, repeated commands and fresh Search source replacement with existing paginator and figures. Legacy native print is an existing compatibility behavior, not a newly verified complete-report print feature. Build/runtime/visual/print acceptance pending.

Phases0/1,2,5,6 applied; backend/detail/domain-state phases inapplicable. No screenshot or unresolved material business contract; no migration. No agents used because the shared presentation/state adapters were tightly coupled and small; root integrated sequentially. Suggested FE commit: feat(reports): add shared expand and collapse tree controls. Suggested documentation commit: docs(reports): require expand and collapse actions for every tree report. No prohibited build/test/lint/browser/application/DB/migration/commit/push/deployment/Graphify/SigmaMCP command used.
