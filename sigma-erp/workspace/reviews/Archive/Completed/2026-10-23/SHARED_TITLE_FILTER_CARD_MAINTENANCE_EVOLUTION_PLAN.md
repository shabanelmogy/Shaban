| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |

# Shared title / filter card presentation

Owner request: "عدل style بشكل عام الخاص ب title يكون زى كارت الفلتر". This explicitly authorizes a shared presentation change across app-feature-title consumers, including report title/filter alignment. It supersedes the earlier scoped alignment-only rule; no business/API decision is required.

Authority: F:/My Work/Sigma/AGENTS.md; Master1/4/5/7, UI3/4/20/24/25, sigma-screen-refactor skill, PLAN-00 and Phase6 packets after the eight-packet drift check passed. No screenshot supplied. Source-only execution.

## Existing owner and impact map

| Area | Actual owner / existing values | Decision / target |
|---|---|---|
| Title card | F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/components/feature-title/feature-title.component.scss: plain independent surface/border, padding10px/12px, radius8px, min-height64px | Refactor: same shared filter background, border, shadow, inline-start3px primary accent, radius8px and padding8px/10px. Keep text/icon/action layout and 64px minimum height. |
| List filters | F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/components/filter-panel/filter-panel.component.scss: 135deg primary5% wash to transparent42%, theme surface/border/shadow; padding8px/10px | Keep appearance; adopt a single shared background token instead of repeating the gradient. |
| Report filter | F:/My Work/Sigma/SiGmaAngularFrontEnd/src/styles.scss: same gradient/surface/border/radius/accent, fixed light shadow | Reuse the background and themed shadow owner. Existing filter geometry/control behavior retained. |
| Report title width | Same stylesheet: direct title margin -8px -6px 16px; aligned-title modifier sets inline0 | Extend approved alignment to the canonical report-panel default: -8px 0 16px. Retain modifier as compatible alias; do not edit individual screens. |
| Theme/RTL/print | Global data-bs-theme tokens, logical inline-start accent, shared title print owner | Theme background token declared at root and dark-theme scopes so nested theme values resolve correctly. Print title card stays white/readable without shadow. |
| Other source/API/data | Existing feature consumers and backend | Keep; no route, form, action, translation, API, persistence or migration change. |

## Options and frozen choice

Per-screen styling was rejected because the request is general and shared owners already exist. A second title component was rejected because it would duplicate the established owner. Select the existing feature-title plus one shared filter-card background token consumed by title/list filter/report filter. The global canonical report panel supplies edge alignment; out-of-scope legacy feature layout overrides are not bulk rewritten.

## Reference conformance before implementation

| Concern / book | Actual reference / shared owner | Required final comparison |
|---|---|---|
| List header/filter — UI3/4 | F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/list/list.component.html; FeatureTitleComponent/FilterPanelComponent | Same filter surface/border/shadow/accent/radius; title and list filter retain matching8px inline inset. No feature CSS or reference edit. |
| Report card — UI20 | F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Accounts/TrailBalance/components/list/list.component.html; sigma-report-filter-panel | Same shared filter-card paint; canonical sigma-report-panel title aligns with filter inline0. Legacy reference layout is not rewritten. |
| Dark/RTL — UI24/25 | Global --sigma-filter-* tokens / data-bs-theme; existing logical layout | No local palette copy for title card; accent follows inline-start. Caption/icon presentation retained; print uses shared component rule. |

## Implementation and verification

Order: frozen presentation → shared CSS/token edits → owning UI3/4/20 and skill/history/changelog → generator regeneration → scoped source reconciliation. Phases0/1 presentation discovery/freeze,2 shared header/filter presentation,5 stylesheet integration and6 reconciliation apply. Backend, editor behavior, domain actions and schema phases do not apply. No subagents: the small changes are coupled to one shared visual owner and do not meet the delegation gate.

Review task hunks against captured pre-change source, preserving the already-dirty global stylesheet. Check token definitions and all three consumers, dark-theme resolution, report inline alignment and compatible modifier, component wrapping/print, merge markers and whitespace. Owner verifies light/dark, Arabic RTL/English LTR, narrow widths, header actions and report print. No build/test/lint/browser/database/migration/commit/push/deployment.
