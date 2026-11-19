# Create Leave field alignment

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and frozen decision — 2026-10-11

The owner requests Date Range on the same row as Leave Type and Staff in Create Leave. Written requirement is Explicit; no screenshot was supplied. Scope is the request-details field grid and its existing bilingual user guide. No unresolved requirements.

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Target: `src/app/modules/HRM/Leaves/Leave/components/details/details.component.html`; guide: `src/app/modules/UserGuide/content/hrm-leaves-topics.ts`. Both already contain working-tree changes; preserve them and all unrelated work.

UI shape: type 02 routed editor, supported by existing approval workflow and saved summary (UI13 D4-2). Create/Edit/View share LeaveDetailsComponent through leave.routes.ts. Backend shape is outside this presentation-only task; no API, model, mapping, calculation or schema changes. Preserve the existing date control, validation and save behavior.

Freeze: set `--sigma-editor-columns: 3` on the request-details grid and remove `sigma-field--full` from Date Range. Retain full-width Reason. Use the existing shared 2-column fallback at <=1024px and 1-column fallback at <=700px. Shared Create/Edit/View content receives the same layout. No feature CSS or shared styling change is needed.

## Conformance evidence before implementation

| Concern | Owning block | Reference/source and shared owner | Target decision |
|---|---|---|---|
| Routed shell | UI1, UI13 | Workshop/Job/components/editor/editor.component.html; src/styles.scss editor page/body/scroll/footer | Keep existing single form scroll owner and fixed footer |
| Field geometry | UI1 | src/styles.scss `.sigma-editor-grid`: repeat(var(--sigma-editor-columns,4),minmax(0,1fr)), gap 7px/16px, align-items start; `.sigma-field--full`: 1/-1 | Select public column token 3 only on request-details; Date Range becomes ordinary field |
| Responsive layout | UI1, UI25 | src/styles.scss <=1024px repeat(2), <=700px minmax(0,1fr); field min-width 0 and controls width 100% | Reuse shared responsive rules and source order, no physical-direction or theme overrides |
| Section | UI13 | shared/components/form-section/form-section.component.scss compact section/content | Preserve existing compact section and projected fields |
| User guide | Master7 | HRM_LEAVES_TOPICS, hrm-guide.ts spread, sidebar `userGuide.hrmMenuEntry` → /UserGuide/hrm | Update Leave requests topic with bilingual editor row explanation |

Recipe drift check passed all packets. Applicable packet: PHASE-03-detail-write, whose routed shell/shared control rules agree with UI1/UI13 and the inspected references. Phases 0/1 are limited to source discovery and freezing this layout choice; Phase3 owns implementation; scoped reconciliation follows. Phases2/4/5 and backend implementation are skipped because no list/action/wiring/API change is requested.

Shared-extraction gate: the existing shared grid already supplies this capability through its public column token. No new repeated implementation or reusable lesson qualifies for extraction or book/skill changes. Subagents are not used: this is a small sequential fix below the delegation gate.

## Reconciliation

Implemented the frozen two-line template change and one bilingual guide step. The first request-details grid selects three columns; Leave Type, Staff and Date Range are ordinary fields in that order, while Reason retains full-row placement. The decision-audit grid retains its prior defaults. The existing shared fallback rules, read-only rendering, calendar configuration, labels, controls and errors remain intact. Final conformance rows match the inspected shared values; visual/runtime acceptance remains pending.

Reviewed the complete scoped diff of both changed files in the verified frontend repository. Existing and concurrent decision-workflow/automatic-acceptance changes remain intact and are not attributed to this task. `git diff --check` passed; scoped merge-marker search found none. No new imports, types, translation keys, routes, services, payloads, AutoMapper mappings, calculations, entities or EF configuration were introduced. No migration is required. Guide topic `leaveReview.title` at `/Leave` now explains the same editor geometry in English and Arabic; existing `/UserGuide/hrm` and sidebar `userGuide.hrmMenuEntry` remain its navigation owners.

Owner visual acceptance must cover wide/narrow screens, English/Arabic and light/dark themes, complete date display, calendar overlay, validation alignment, fixed footer and form-only scrolling. No new compile API is introduced; remaining practical risk is visual date-text fit at reduced widths. Builds, tests, lint, browser/runtime, database, migrations, commits, pushes and deployments were not run.

Suggested frontend commit for this task's changes in the two named files only: `fix(leave): align date range with leave type and staff`. This message does not cover their unrelated existing working-tree changes.

## Follow-up frozen layout decision — 2026-10-11

The owner now requests the screen in two columns instead of two stacked rows. Source-supported interpretation: request details (and saved decision audit where present) form the main column, while policy notice and the existing eight-card saved summary form the second column. Retain the previously authorized three-field row inside request details. This extends the outer section placement and does not supersede the prior field contract.

Freeze before implementation: reuse the routed editor shell and existing single `sigma-editor-scroll` owner. Feature-owned workspace layout, expressly allowed by UI1 ("The feature keeps only its workspace layout"), uses two tracks in 2:1 proportion, the shared body-equivalent 10px gap, shrinking logical widths and top alignment. A named inline-size container on the existing scroll region stacks the columns at <=1100px available width; narrow layout restores source order. No second scroll region, page height calculation, panel/control styling or theme override. Add the existing empty feature stylesheet to component metadata. Keep SummaryCards public dense/row/min140 configuration and its shared wrapping; do not alter card internals.

| Concern | Owning block | Inspected producer/reference | Target comparison |
|---|---|---|---|
| Outer workspace placement | UI1, UI13 | Workshop/Job/components/editor; src/styles.scss editor body 10px gap and bounded scroll chain | Preserve shell/scroll/footer; only Leave section grouping differs under explicit owner request |
| Responsive container | UI1, UI25 | Shared Job three-pane inline-size container and logical min widths in src/styles.scss | Reuse container mechanism for this two-section feature layout; feature threshold 1100px preserves space for existing three-field row |
| Summary content/wrap | UI24 | summary-cards.component.scss row host inline-size container, <=1100px auto-fit min width; LeaveDetailsComponent.summary eight entries | Retain eight entries and public dense/row/min140 settings in side column |
| Guide | Master7 | Existing HRM_LEAVES_TOPICS topic, /UserGuide/hrm and HRM sidebar entry | Explain two-column placement and narrow stacking in both languages |

Recipe -Check passed all packets again. PHASE-03 remains applicable. No backend/API/schema phase is added. No extraction qualifies: shell, section, summary and date owners already exist; only this screen's section placement is new. Subagents remain unnecessary for the sequential layout fix. Follow-up reconciliation is pending.

### Owner steering during implementation

The owner's latest instruction puts every field in the first column beneath the previous field and widens the second column. This explicitly supersedes the earlier three-field row and 2:1 main/summary ratio. Freeze: first/second columns become 1:2; request-details and saved-decision grids use shared `sigma-editor-grid sigma-editor-pane-fields`, whose existing two-class specificity selects one column across breakpoints. Reason/rejection text retain existing full-row semantics. The wider second column retains the policy notice and eight summary cards, shared card wrapping and the <=1100px outer stacking rule.

### Follow-up final reconciliation

Implemented — source-only. Changed files: Leave details HTML, its existing empty SCSS, component TS metadata (`styleUrl` only for this task), and the existing bilingual HRM leaves guide. The two-column workspace is 1:2, first-column fields use the shared single-column owner, and sections stack at <=1100px of available editor width. Section/control/card chrome remains shared. The single scroll owner and outside fixed footer remain intact; no CSS height arithmetic, colours, physical direction rules or nested overflow were added.

Reviewed complete scoped Git diffs including pre-existing changes; preserved the concurrent Leave decision and Leave Type guide work. `git diff --check` passed and merge-marker search found none. Component stylesheet path exists and `styleUrl` is already supported by the approved Job reference. Final conformance matches the amended owner decision and the inspected shared rules; remaining owner checks are visual fit, English/Arabic order, dark/light appearance, calendar overlay, narrow stacking and reachable footer. No build/test/lint/browser/runtime/database/migration/commit/push/deployment command was run.

The guide's `leaveReview.title` topic now describes vertical first-column fields and a wider second-column summary in both languages, retaining `/Leave`, `/UserGuide/hrm` and `userGuide.hrmMenuEntry`. No backend, payload, mapping, financial calculation or schema change; migration not required. Applicable scope remains Phase3 with limited discovery/freeze and final source reconciliation; other phases remain excluded. No unresolved contract or new reusable extraction. Suggested frontend commit for these layout/guide changes only: `fix(leave): use stacked fields beside a wider summary column`.

### Full-height owner amendment

Owner requests the design fill all available height. Frozen before edits: the shared bounded editor body becomes the named workspace container, and its two-column grid fills remaining height with minmax(0,1fr) rows. Both columns reuse `sigma-editor-pane` and `app-form-section [fill]=true`; each section projects one `sigma-editor-scroll` as its content scroll owner. Request fields and existing decision history stay in the first pane, policy notice and saved summary in the wider second pane. At <=1100px, both panes stack into bounded equal rows, retaining internal scrolling and the fixed footer. Remove the previous outer scroll owner. No viewport height formula or outer-page scroll.

Source evidence: UI1 shared pane min-inline/block-size0, flex column, overflow hidden and `sigma-editor-pane > app-form-section` flex1; UI13 section fill contract; inspected FormSectionComponent.fill input, template fill modifier and SCSS shrinking flex content; Job editor projects `sigma-editor-scroll` inside filled FormSection. All business content and summary values remain unchanged. This reuses existing shared fill/scroll capabilities, so no extraction or book/skill change is needed.

Full-height reconciliation: implemented the amended bounded grid and shared fill/pane/scroll composition. Both panes now consume remaining editor body height, with one content scroll owner per pane and the footer outside the body. In saved modes, the existing decision-history section follows the fields inside the first pane's scroll area. At narrow widths, two bounded rows retain internal scrolling. The source chain has no page-height calculation and preserves field/card controls, values, actions and validations. The guide adds the full-height/internal-scroll explanation in English and Arabic. Reviewed the final scoped HTML/SCSS diff and metadata/guide wiring; whitespace check passed. Owner visual/runtime/compilation acceptance remains pending, particularly short-height and narrow screens, calendar overlay, complete scrolling to audit/summary content, RTL/theme and fixed Save/Cancel. No prohibited execution was performed. Suggested frontend commit for the four scoped layout/guide files: `fix(leave): fill editor height with fields and summary panes`.

### Summary and Reason presentation amendment — 2026-10-11

Owner explicitly requests better Leave Summary distribution/colours and a Reason box extending to the bottom of the first column. Freeze before edits: use existing SummaryCards comfortable/grid/min260 inputs instead of dense/row/min140, providing larger icons/figures and responsive auto-fit cards. Preserve all eight values, order, empty-value semantics and saved-value caveats. Choose only existing SummaryCard accents and Bootstrap Icons: request days primary/calendar3; saved limit info/speedometer2; currently booked warning/calendar2-event; previously booked neutral/clock-history; saved balance primary/wallet2; paid days success/cash-coin; half-paid info/circle-half; unpaid warning/dash-circle. Colours group figures and do not assert approval, availability or a changed business rule.

Reason uses existing Bootstrap `d-flex`, `flex-column`, `align-items-stretch` and `flex-fill` utilities on the request field collection, reason group and textarea/read-value host. The existing shared textarea/field appearance, 1000-character rule, error component, single pane scroll and fixed footer remain. Natural minimum content height preserves scrolling on short screens. Saved status/history remain reachable following request content. No feature override of card or field internals and no new shared capability.

Conformance: UI24 shared SummaryCards public inputs/typed accents own all card internals, palette, auto-fit and 12px comfortable gap; actual summary-card model/component/SCSS inspected. UI1/UI13 still own the filled pane and scroll chain; inspected installed Bootstrap utility declarations supply important flex-fill/display/direction rules, with align-items-stretch preventing the existing grid's start alignment from narrowing fields. Master7 guide gets bilingual presentation guidance. Recipe -Check passed all packets; PHASE-03 remains applicable. Backend, API, mapping, calculations, schema and list/action/wiring phases remain out of scope. No screenshot or unresolved business requirement. No new extraction/book/skill rule qualifies because the requested presentation reuses existing owners. No subagents: the scoped changes are small and sequential.

Summary/Reason reconciliation: implemented the comfortable responsive min260 grid and eight typed icon/accent definitions, preserving authoritative values/ordering/notes. Request collection, Reason group and Reason textarea/read-value now use the existing flex-fill chain, with stretched field widths and unchanged validation. Reviewed complete scoped HTML/TS/guide diffs in the verified frontend repository, retaining prior/concurrent business changes. `git diff --check` passed; merge-marker scan found none. Verified all eight icons in installed Bootstrap Icons CSS, imported by style.angular.scss, and utility availability through style.scss → core components → bootstrap/scss/bootstrap. No shared component, feature stylesheet, translation vocabulary, contract, backend or schema change was needed for this amendment. No migration. Guide content remains HRM_LEAVES_TOPICS under /UserGuide/hrm with HRM sidebar userGuide.hrmMenuEntry; the new EN/AR step matches final source.

Owner acceptance pending: Reason expands to remaining space in Create, editing/validation remains usable at short heights, saved status/history remain reachable, cards wrap without clipping at wide/narrow widths, and icons/colours remain legible in English/Arabic and light/dark themes. Source review does not certify build/runtime/visual behavior. Prohibited commands were not run. Suggested frontend commit for this amendment's three scoped files: `fix(leave): improve summary cards and expand reason field`.
