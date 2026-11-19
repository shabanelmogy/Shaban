# Leave and Holiday filter spacing

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |

## Scope and freeze before implementation

Explicit owner requests: enlarge Leave Staff and Leave Type, move Rejected slightly and reduce space beside Pending Approval; reduce Holiday Name and Date Range widths, place fields/actions in one desktop row and preserve responsive layout. No screenshot supplied. Frontend presentation only; keep field order, values, labels, validations, filters, requests, grid and actions unchanged. Existing working-tree changes must remain intact.

Leave: use existing sigma-filter-field--wide for Staff and Leave Type, retain Date Range wide, and select nine main tracks (2+2+2+1+1+1) rather than seven. Reduce public columnGap from8 to6px. This gives dropdowns more width and reduces the space allocated to each status check; no local checkbox offsets or CSS.

Holiday: retain two ordinary field tracks and select the existing validated inline-actions composition (inlineActions=true, inlineActionCaption=general.actions). Reset, Refresh, Excel and Search share the filter row beside Name and Date Range. Their existing auto-sized toolbar consumes width previously allocated entirely to the two fields. Retain stableLayout=true and reserved date feedback. Reuse shared <=720px stacking of fields/actions and toolbar button wrapping, without fixed widths or feature CSS.

## Conformance evidence

Selected UI shapes: existing Leave type02 list/routed editor and Holiday type01 list/modal editor; only their shared list filter strips are in scope. Master guide and sigma-screen-refactor skill UI4 digest apply. Recipe -Check passed all eight packets; PHASE-02-read-grid owns this presentation slice. No backend or API implementation needed.

| Concern | Book/reference/shared owner | Target comparison |
|---|---|---|
| Filter shell and field width | UI4; Workshop/Job/components/list; FilterPanelComponent/SCSS | Same form projection and stable fields; Leave uses public mainColumns, columnGap and existing span2 modifier |
| Validated inline actions | UI4; FilterPanelComponent inlineActions/inlineActionCaption and template | Holiday uses existing default-off option; caption aligns buttons independently of date error |
| Responsive/RTL/theme | UI4/25; shared panel SCSS <=720px and logical properties | Existing stacking, wrapping, 34px controls and themed tokens retained; no local style |
| Guide | Master7; HRM_LEAVES_TOPICS | Update the existing /Leave and /Holiday filter explanations in EN/AR under /UserGuide/hrm |

No business contracts, types, imports, translations, mappings, calculations or schema changes. No migration required. Existing shared capability covers both requests, so no new extraction or book/skill update is needed. No subagents: two small template edits and one shared guide file are faster sequentially.

## Reconciliation

Implemented the frozen public sizing choices in Leave/components/list/list.component.html and Holiday/components/list/list.component.html, plus the two bilingual topic explanations in UserGuide/content/hrm-leaves-topics.ts. Reviewed the complete scoped diff in F:/My Work/Sigma/SiGmaAngularFrontEnd, preserving the pre-existing rejection dialog and all unrelated guide/workflow changes. Scoped git diff --check passed and no merge markers were found.

Final conformance matches the table: existing shared span2 tracks and six-pixel horizontal gap in Leave; existing two-field validated inline composition in Holiday; shared single-column/action stacking at <=720px and button wrapping. No new controls, styles, imports or framework APIs. Guide topics /Leave and /Holiday remain included through hrm-guide.ts and the existing sidebar userGuide.hrmMenuEntry → /UserGuide/hrm.

Phases0/1 scoped discovery/freeze, Phase2 filter presentation and Phase6 source reconciliation applied. Editor/action/backend/wiring phases skipped because unaffected. No migration is required. No builds, tests, lint, browser/application verification, database commands, migrations, commits, pushes, deployment, Sigma MCP or Graphify ran. No new canonical source or packet changes; no regeneration needed after the passing check.

Owner acceptance: inspect both strips at desktop and narrow widths, EN/AR and light/dark themes; ensure selected names/date text fit, date feedback does not move buttons or checks, buttons wrap accessibly, and existing Search/Reset/Refresh/Excel retain their behavior. Build, runtime and actual appearance remain pending, not certified by source inspection. The separate Leave HTTP500 investigation remains pending Response/backend exception and is not resolved by presentation work.

Suggested frontend commit (only this task's hunks): fix(hrm): refine leave and holiday filter spacing.

## Responsive correction frozen before editing — 2026-10-11

Owner reports broken layout from1365x874 down to720x874 and explicitly wants Leave's three checkboxes on one row below720. Source confirms the late inline-actions selector overrides the standard1250px grid fallback, retaining nine Leave columns alongside the action toolbar until720px. Previous source-only acceptance did not establish actual fit.

Freeze: extend the existing FilterPanel owner with optional responsiveColumns (null default retains all other consumers). Opted-in inline strips put actions beneath the full-width main grid at <=1365px, hide the empty action-caption track and use the configured responsiveColumns; <=720px selects one field column. Leave selects6 intermediate tracks for its three span2 fields; Holiday selects2 for Name/Date Range. Leave groups the same three checks in shared sigma-filter-checks: three equal child columns, span3 on desktop and a full-row group at <=1365px, including <=720px. Labels may wrap within their column; checkbox items never stack separately. Remove the empty heading reservation when the group is on its own row. Preserve native15px checks,34px control track,6px Leave gaps, labels/form bindings/actions/error reservation and DOM order.

Conformance extension: UI4 owns the new optional responsive composition and checkbox-group layout; shared FilterPanelComponent/SCSS owns all geometry, consumer templates only select inputs/classes. Existing Job reference and default public values stay unchanged. UI4/skill/history and packets must be synchronized through the generator. No feature styling, backend/API/mapping/schema or formula changes. Existing /Leave and /Holiday guide steps will reflect intermediate action placement and the one-row narrow checkbox group. Small sequential shared-owner change; no agents. Runtime/visual acceptance remains pending under the execution boundary.

### Responsive correction reconciliation

Implemented in shared FilterPanel TS/SCSS, Leave/Holiday list HTML and the same guide file. Added typed responsiveColumns with null default and gated the modifier to inline consumers without an advanced template. Final cascade source review: >1365 retains prior desktop nine/two tracks with actions alongside;1365 through721 uses six/two full-width tracks and actions below, including the existing1250 breakpoint;720 and below explicitly overrides the intermediate rule with one field track. Existing wide-field reset applies on mobile. The check group remains three minmax(0,1fr) tracks at all widths and spans the full row at1365 and below. Its standalone heading row is removed and labels may grow the minimum34px track instead of being clipped. Shared no-page-scroll shell and DataTable owner unchanged.

Reviewed complete scoped frontend diffs and public input bindings; git diff --check passed. Pre-existing workflow/guide changes preserved. UI4 and skill rule/history synchronized; all eight packets regenerated only with the generator and subsequent -Check passed. Semantic review confirms the standard Job reference and untouched consumer defaults, default-off responsive extension, shared geometry ownership and pending actual visual acceptance; PHASE-02 provenance now includes the updated UI4 hash. No new translation keys, model/API/mapping/calculation/schema changes or migration. No prohibited runtime/build/test/lint/database/migration/browser/commit/push/deploy/Sigma MCP/Graphify commands ran.

Owner visual checks remain1366/1365/1250/1024/721/720 and narrow widths at874px height, EN/AR and both themes, with selected long names and date feedback; confirm all three checks occupy one mobile row and fields/actions remain accessible. Guide /UserGuide/hrm now describes intermediate actions below fields and the narrow one-row status group. Suggested frontend commit: fix(hrm): correct intermediate filter responsiveness. Suggested documentation commit: docs(ui): document responsive inline filters and grouped checks.

## Owner-requested general responsive documentation gate — 2026-10-11

Owner explicitly asks that Responsive documentation require confirmation of element consistency at all screen sizes. Updated canonical UI29 with the responsive consistency gate and matrix requirements, Master5 with its cross-layer gate reference, and skill section10 plus revision history. The rule covers each supported layout interval, breakpoint boundaries and intermediate sizes; usable widths, heights/edges/spacing, unclipped values, coherent action/check groups, validation/states, Arabic/themes and internal scrolling. Source review cannot certify appearance: record pending visual acceptance until verification is authorized. No extra application changes in this documentation amendment.

| Viewport width at874px height | Expected current arrangement | Source evidence | Visual status |
|---|---|---|---|
| >1365, including1366 | Leave9 tracks/grouped checks and Holiday2 fields; actions alongside | Default inline rules and desktop spans | Pending |
| 1365 through721, including1250/1024 | Leave3 equal span2 fields in6 tracks; checks full row; Holiday2 fields; actions below | Opted-in1365 rule overrides default inline and1250 grid rule | Pending |
| <=720, including720 and narrower supported widths | Ordinary fields stack; Leave checks remain3 columns on one row; actions below/wrap | Later720 responsive override, existing wide-field reset and check-group tracks | Pending |

Check both sides of each actual viewport/container boundary and resize between matrix samples during owner acceptance, with long selected labels, dates, validation and EN/AR themes. These are source conformance results and pending visual checks, not runtime proof. Packet regeneration and final drift check follow this amendment.

Documentation reconciliation: reviewed the complete scoped diff separately in the documentation repository F:/My Work/Shaban Documents/Shaban; git diff --check passed. All eight packets regenerated through the generator and -Check returned OK. Semantic review confirms Master5 routes to UI29's exact gate without widening runtime authorization; Phase02 contains refreshed Master5/UI29 provenance. Application source review above remains current. Suggested additional documentation commit: docs(ui): require responsive consistency across supported sizes.

## Header Add action correction frozen before implementation — 2026-10-11

Owner requests keeping Add on the title row whenever space permits and a small size reduction on small screens. Scope: current Leave/Holiday title actions. UI3 shared FeatureTitle currently forces column layout below650px, even when a single Add fits. UI24 shared PrimaryActionButton owns35px minimum height,16px inline padding,11px text and6px gap. Approved Job header composition inspected; preserve title/icon/translated label, action order and handlers.

Freeze: add default-false responsiveActions input to FeatureTitle, opt in only Leave/Holiday. At <=650px use row flex-wrap with120px flexible title basis and a wrapping bounded actions group, moving actions only when their natural combined width cannot fit. Reduce the scoped shared primary action to32px minimum height,10px inline padding,10px font and4px icon gap at the same breakpoint. No icon-only substitution, feature CSS, changed workflow or universal change to other headers. UI3 owns composition, UI24 owns button sizing; synchronize their guidance, skill/history and packets, and update both guide topics. UI29 requires650 boundary/intermediate/narrow EN/AR/theme acceptance, which remains pending under source-only scope. No agents: small sequential shared-owner change.

Header amendment reconciliation: implemented FeatureTitle TS/SCSS default-off option and PrimaryActionButton scoped sizing, selected by the two list templates. Added a bilingual note to each /Leave and /Holiday topic in the existing /UserGuide/hrm guide. Source compares final values to the frozen UI3/UI24 decision; named input is declared on the existing imported standalone component, context styling reaches projected Add through its existing shared owner, and prior handlers/order/states remain intact. At >650 sizing/layout defaults remain; at650 and below only opted-in headers wrap naturally and reduce primary geometry. Leave's Dashboard may require the coherent header action group to wrap sooner than Holiday's single Create; this preserves existing action order. No guarantee of actual fit from source review.

Reviewed complete scoped frontend and documentation diffs separately, rereading the guide diff alone after aggregate output truncation. Both scoped diff --check commands passed (only existing Git line-ending conversion notices). UI3/UI24 and skill/history synchronized; all eight packets regenerated with generator and -Check passed. Semantic review: default-off extension and shared ownership preserve reference/default consumers, public sizes match frozen values, UI29 acceptance remains pending. No backend/schema/mapping/formula changes, migration or prohibited commands. Applied scoped0/1 freeze, Phase2 presentation and Phase6 reconciliation; editor/action/backend phases unaffected. Verify651/650/649 and narrow widths, long translated title/labels, focus/loading, both header actions, RTL/themes and existing header/card alignment during owner acceptance. Suggested frontend commit: fix(hrm): keep create beside titles when space allows. Suggested documentation commit: docs(ui): document responsive title actions.
