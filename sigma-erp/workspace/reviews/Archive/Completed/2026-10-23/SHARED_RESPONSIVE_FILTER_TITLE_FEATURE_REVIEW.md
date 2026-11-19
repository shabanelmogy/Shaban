# Shared responsive filter and title behavior

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and authority — 2026-10-11

The owner explicitly requests general shared-component behavior: filter cards can collapse below1200px; Add stays beside the title when space permits, with slightly smaller buttons on small screens. The owner also establishes that reusable presentation ideas should apply generally through their shared owner, not through individual screen opt-ins.

Apply Master4/5/7, UI3/4/24/29 and sigma-screen-refactor. Initial recipe check: all eight packets current. Small sequential shared change; no delegation needed.

## Frozen presentation contract

- Every form[appFilterPanel] gains a labelled native type=button disclosure below1200px. Initially expanded, preserving initial access to existing filters/actions. Collapse is presentation only: mounted fields, form values/dirty state and advancedOpen survive; no reset/search/submit event is emitted. At1200px and above, all currently expanded main/advanced content and actions remain visible regardless of narrow-screen collapse state. Unique aria-controls/aria-expanded and keyboard focus remain shared.
- Every FeatureTitle uses the existing wrapping row under650px, retaining text and all projected actions. The existing primary-button small-screen context (32px height,10px padding/font,4px gap) applies to all shared titles. Wrap only when the title/action group cannot fit; no clipping or hidden action.
- Shared EN/AR in-app guide guidance is added to the existing reader's overview for every module. No backend/query/payload/permission/route change.

## Reference conformance before implementation

| Concern | Book | Actual reference / shared owner | Target / authorized difference |
|---|---|---|---|
| Filter projection/form/actions | UI4 | Workshop/Job/components/list/list.component.html; FilterPanelComponent/template | Retain form,34px fields, projected Search/Export, mandatory Reset and independent More filters. Add shared disclosure on explicit owner instruction. |
| Inline/stable filter cascade | UI4 | FilterPanel component SCSS | Preserve existing direct grid/toolbar children and inline/responsive rules; hidden body only below1200px. |
| Title and primary action | UI3/24 | Job list FeatureTitle/PrimaryActionButton; shared FeatureTitle and PrimaryActionButton styles | Extend existing Leave/Holiday opt-in behavior to every title per owner instruction. |
| User guide | Master7 | UserGuide reader, GuideTextPipe/GuideText model | Reuse reader overview with authored bilingual common guidance. |

## Verification boundary

Source-only. Owner visual/keyboard/form-state verification pending at1201/1200/1199,1365/720,651/650/649 and narrow intermediate widths, long EN/AR titles, multiple actions, inline/stable/advanced filters and both themes. No builds/tests/lint/browser/database/migrations/commits/deployment authorized or run.

## Final reconciliation

The frozen decision above preceded source changes. Source reviewed separately in the frontend and canonical-document Git repositories; existing unrelated HRM, translations and documentation changes retained. Authoritative AGENTS/skill/review remain local coordination artifacts. No backend changes or schema work; API/ListVM/filter keys, domain calculations and mapping are unchanged. Phases0/1 presentation discovery/freeze,2 shared filter/header implementation and6 source reconciliation applied; backend/detail/domain-action/runtime execution skipped as out of scope.

| Path | Final source evidence | Result |
|---|---|---|
| FilterPanel TS/template | collapsed=false signal; type=button only updates it; unique main/toolbar IDs and conditional advanced ID; no form mutation/output | Matches frozen presentation contract |
| FilterPanel styles | Default disclosure display:none; screen max1199.98 displays a full-width first-row toggle; final collapsed selector overrides inline grid/toolbar display only there | Direct children and existing layout preserved; desktop/print ignore collapsed state |
| FeatureTitle / PrimaryActionButton | All titles use <=650 wrapping row, flexible120px left group and bounded wrapping action group; app-feature-title context owns32px/10px/10px/4px primary sizing | Global default; removed input/class and both consumer bindings; scoped source search finds no stale consumer |
| Translations / guide | general.filters/expandFilters/collapseFilters in both vocabularies; typed shared-screen-guidance.ts imported by GuideReader and rendered through existing GuideTextPipe in every module overview | EN/AR source coverage; reader/guide routes and sidebar retained |
| Instructions / books / skill | General preference in AGENTS and Master5; owning UI3/4/24, UI preamble1.97, CHANGELOG and skill/history synchronized | Current canonical rule supersedes previous title opt-in; historical decision retained |

Responsive source matrix: >=1200 normal filter body/no disclosure; <1200 expanded body+disclosure or collapsed disclosure only, existing1250/1365/720 field rules retained; <=650 title/actions wrap only when combined bases cannot fit and primary buttons compact; >650 existing title row retained. Visible geometry, keyboard interaction, viewport resize and print remain owner-pending, not claimed verified.

User guide: `src/app/modules/UserGuide/content/shared-screen-guidance.ts` covers common filter collapse and title actions; existing `/UserGuide/:sectionId` overview and existing module Guide entries expose it. No new route/menu registration required.

All eight generated packets refreshed through the generator (PLAN-00 and PHASE-00 through PHASE-06); semantic review retains reference roles and current owning-block dependencies. Final -Check: all current. Scoped diff --check passed in both repositories (line-ending normalization warnings only). No subagents: small sequential shared-owner work has no useful independent implementation stream.

Suggested commits only: frontend `feat(shared): add responsive filter collapse and title actions`; docs `docs(sigma): generalize shared presentation guidance`. Owner acceptance: toggle filters with edited values and advanced fields, resize across1200, keyboard-focus disclosure, inspect title/action wrapping at650 and intermediate widths in EN/AR and light/dark, and confirm print content is unaffected.
