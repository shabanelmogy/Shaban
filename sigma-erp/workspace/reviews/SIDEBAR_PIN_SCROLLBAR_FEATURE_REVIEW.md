| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Scope / tier | S: sidebar Pin clearance beside the menu scrollbar |

## Decision and evidence

Owner reports intermittent overlap with the scrollbar. The original menu viewport used `overflow: auto`, .5rem horizontal padding and no stable gutter. The exact browser symptom has not been reproduced. UI shape is the UI1 authenticated-shell sidebar exception, owned by `SidebarMenuComponent` within `LayoutComponent`; no CRUD/backend shape applies.

Before editing, the decision was recorded in `APPBAR_SHORTCUTS_FEATURE_REVIEW.md`. Concurrent documentation maintenance moved that file to `Archive/Completed/2026-10-23/APPBAR_SHORTCUTS_FEATURE_REVIEW.md`, including its frozen amendment. This current report records the completed implementation without rewriting that historical record. Target: vertical-only menu scrolling, stable scrollbar gutter, 1rem logical-end inset, unchanged .5rem start inset and shrinkable host/viewport. Extra inset protects overlay-scrollbar clearance where a stable gutter reserves no space.

## Conformance and reconciliation

| Concern | Book | Actual owner / compared contract | Result |
|---|---|---|---|
| Scroll clearance | UI1, Master5 | `LayoutComponent` aside/drawer → `.sigma-menu-scroll` | `min-inline-size: 0`, `overflow-x: hidden`, `overflow-y: auto`, `scrollbar-gutter: stable`, `padding-inline-end: 1rem`; one menu scroll owner retained. |
| Pin / row | UI1/25/27 | Custom PanelMenu item template, `.sigma-panel-item-link`, `.sigma-menu-appbar-pin` | Retain shrinking/truncated label, 1.75rem pin, 14px nested indentation, third-level 8px end margin, trailing chevron and independent pin events/focus. Installed PrimeNG21/PrimeUIX wrappers inspected. |
| Concurrent selection styling | UI1 | Same shared row, updated by other work during this task | Preserve selection class, tokens and border styling; 7px padding + 1px border, and 5px start padding + 3px border retain the original effective 8px inset. No revert of compatible peer changes. |
| User guidance | Master7 | `SHARED_SCREEN_GUIDANCE` → `GuideReaderComponent.sharedScreenGuidance` → overview `guideText` paragraphs | New EN/AR paragraph explains pin/unpin, hover/Tab/touch and scrolling. Existing `/UserGuide/:sectionId` readers and module sidebar entries, e.g. `/UserGuide/customers`, remain. No new route/key required. |

Responsive matrix: >=992px uses the 280px desktop aside; below992px uses the same component in the bounded `min(320px,90vw)` drawer. The rules have no additional breakpoints and use logical spacing in both directions. Labels remain ellipsized and theme tokens remain unchanged. Source conformance only; narrow/deeply nested labels, scrollbar modes and visual fit remain owner acceptance.

## Changed files and verification

- Frontend changes owned here: `src/app/layout/components/sidebar/sidebar-menu/sidebar-menu.component.scss` (host/menu viewport rules only), and one paragraph in `src/app/modules/UserGuide/content/shared-screen-guidance.ts`. Prior Reports/login guidance and all other dirty source changes were preserved. Reviewed complete scoped frontend diffs, including the compatible concurrent selection styling. Whitespace check passed; no stale imports/types introduced by this CSS/content-only change.
- Documentation: UI1 authenticated-shell disclosure records the clearance contract; `.agents/skills/sigma-screen-refactor/SKILL.md` adds its check and revision row. The initial decision is retained in the moved historical review; this file is the active handoff.
- Initial packet check reported eight stale packets. Inspected template/manifest authority and reference roles, including Phase5's standalone root owners and Phase6's source-only/user-guide gates. By the pre-generation snapshot, packets were already synchronized except for this task's UI1 edit. Generator changed only UI1 fingerprint metadata in `phase-00-discovery-evidence`, `phase-02-read-grid`, `phase-03-detail-write`, `phase-05-integration-runtime`; remaining outputs were idempotent. No new template/manifest edits were needed. Final check passed all eight packets. Scoped documentation whitespace check passed. Existing unrelated documentation changes remain preserved.
- Applied focused discovery, UI1 shell correction and proportional Phase5/6 reconciliation. Backend, grid, editor and domain-action phases do not apply. No screenshot was supplied; no unresolved business/API contract. No backend, DTO, AutoMapper, calculation, authorization or schema change; no migration required.
- No subagents: one small sequential styling task does not meet the delegation gate.
- Builds, tests, lint, browser/application verification, database commands, migrations, commits, pushes and deployment were not run.

## Owner acceptance

Check long/nested menus at 320/375px, both sides of 992px and desktop widths, in Arabic/English and light/dark themes. Hover and Tab to pin/unpin while scrolling, using classic and overlay scrollbars. Confirm the pin is reachable, labels truncate, chevrons remain last and only menu content scrolls. Compilation, runtime and visual acceptance remain pending; source review cannot prove browser placement.

Suggested frontend commit, only this task's styling/content hunks: `fix(sidebar): keep pin buttons clear of the scrollbar`.

Suggested documentation commit, only this task's UI1/skill/packet metadata hunks: `docs(ui-book): record sidebar pin scrollbar clearance`.

## Owner follow-up: third-level pin containment — 2026-10-24

Owner reports the button that pins a third-level sidebar entry to the top bar extends outside its row. Tier S correction in the same SidebarMenuComponent; no backend shape. The top bar has no nested per-entry pin control, so this request targets the existing sidebar action. Initial eight-packet drift check passes.

Frozen target: constrain the installed PanelMenu's expanding grid to a zero-minimum column, allow its content wrappers and actual nested list hosts to shrink, and explicitly reserve the existing fixed pin/icon/chevron widths while the text truncates. Preserve the current third-level 8px pin clearance, nesting, events, focus outlines, active styling and single vertical scrollbar. Do not hide the symptom with row clipping or add another menu renderer. Installed PrimeNG PanelMenu uses a grid motion container and native ul[pPanelMenuSub] hosts; PrimeUIX leaves the grid column implicit. Current menu CSS does not bound those intrinsic widths. Visual root cause is not reproduced under the source-only boundary.

| Concern | Canonical rule / actual reference | Target match |
|---|---|---|
| Shared shell and width ownership | UI1; SidebarMenuComponent SCSS/template; installed PanelMenu/PrimeUIX styles | Bounded grid track, shrinkable wrappers/nested list hosts |
| Pin and label geometry | UI1/25/27; existing .sigma-panel-item-link / .sigma-menu-appbar-pin | Label shrinks; fixed controls remain visible with original spacing |
| Guide | Master7; SHARED_SCREEN_GUIDANCE current reader | Clarify deep/long labels and accessible pin behavior in EN/AR |

Only source review and scoped whitespace checks are authorized. No agents: this small CSS correction is sequential. Final reconciliation follows implementation.

### Follow-up reconciliation

Implemented the bounded grid column and zero-minimum content/list widths in the existing shared SCSS. Row text now has a zero flex basis and minimum inline size, icons do not shrink, and the existing1.75rem pin has explicit zero padding and centered contents. The original third-level8px end margin, chevron position, nesting indentation, scroll gutter and active-row styling remain. No extra clipping, HTML/TypeScript events, routing, API, business or schema changes. Actual publisher list selector confirmed as ul[pPanelMenuSub]; no custom-element display workaround is needed.

Reviewed the complete scoped frontend diff and existing shared template/guide consumer; scoped whitespace check passed. Existing group-reveal guidance was preserved while the EN/AR pin explanation now covers nested levels and long-label truncation. UI1 and the skill/revision row record the reusable width constraint. Generator refresh changed only UI1 provenance in PHASE-00, PHASE-02, PHASE-03 and PHASE-05; other packet outputs remained identical. Semantics and existing reference roles retained, final eight-packet check passed. Focused discovery and UI/Phase5/6 reconciliation apply; backend/read-grid/detail/domain-action work is out of scope. No prohibited commands ran.

Owner acceptance pending: hover/Tab/touch Pin at third and deeper levels, long Arabic/English names, open/closed groups, desktop and mobile Drawer, light/dark themes and both scrollbar modes. Source review cannot prove rendered fit. Suggested frontend commit: `fix(sidebar): constrain nested rows to keep pin actions visible`.

## Owner amendment: full wrapped sidebar labels — 2026-10-24

The owner explicitly replaces truncated sidebar labels with full multiline text. Tier S, existing UI1 shared sidebar owner; keep the bounded widths, fixed Pin/icon/chevron and vertical-only viewport from the prior correction. Freeze normal whitespace with overflow-wrap:anywhere on the shrinkable label, no ellipsis/clipping or line clamp; rows grow naturally and controls remain centered. Applies to all levels in desktop aside and mobile Drawer. No API/backend, business or schema change, separate freeze artifact or delegation needed. Existing historical truncation decisions above remain as evidence of the superseded presentation.

Conformance: UI1/25 existing SidebarMenuComponent label span → wrapping within its zero-minimum width; UI27 existing fixed action/focus owners unchanged; Master7 existing bilingual shared guide → full-label explanation. Source-only verification and owner visual acceptance apply.

Implemented and reconciled: the label span now uses white-space:normal and overflow-wrap:anywhere, with its prior zero flex basis/minimum width retained. Removed overflow:hidden/text-overflow:ellipsis from sidebar labels; no fixed row height or line clamp. Both group buttons and page anchors share this span rule; fixed Pin/icon/chevron, logical indentation and menu-scroll bounds remain. Updated EN/AR shared guidance and confirmed the current GuideReader consumer. Reviewed the scoped frontend diff and whitespace checks (frontend plus scoped documentation) passed. Canonical UI1 and skill record the owner's superseding decision; generated packets refreshed, UI1 provenance/reference semantics retained and all eight final checks passed. Focused UI/Phase5/6 source reconciliation only; no backend/API/schema changes, no migration and no subagents. Builds/tests/lint/runtime/browser/database/commits were not run. Owner acceptance pending for full Arabic/English long/unbroken names at third/deeper levels, fixed controls, natural row heights and internal scrolling on desktop/Drawer in both themes. Suggested frontend commit: `fix(sidebar): wrap long menu labels in full`.
