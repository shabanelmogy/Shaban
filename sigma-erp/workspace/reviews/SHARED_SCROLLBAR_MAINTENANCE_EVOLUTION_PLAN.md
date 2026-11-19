# Shared scrollbar presentation

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Tier | L — shared presentation, bounded CSS slice |

## Outcome and authority

The owner requested a better scrollbar appearance. Master5's standing general
presentation decision authorizes inheritance by current consumers. Implement
through the existing global stylesheet, with no per-screen opt-in. UI24/25 own
presentation/theme; UI1 retains scroll geometry. No business decision is open.

## Existing state, impact and classification

| Owner / consumers | Evidence | Decision / impact |
|---|---|---|
| `src/styles.scss` | Global Sigma palette; separate dialog/report scrollbar declarations; dark dropdown-only WebKit skin | Extend global styling; remove competing dropdown skin |
| Shared DataTable, shell/sidebar, editor/form panes, reports, body-appended dropdowns | Real scroll containers already own overflow and sizing; several component styles set native thin/color locally | Keep scroll ownership; shared CSS controls paint only |
| Shared guide reader | Every module overview renders SHARED_SCREEN_GUIDANCE | Extend existing bilingual guidance |
| API, EF, data, calculations, authorization, integrations | CSS-only request | Keep; no contract, migration or rollout dependency |

## Alternatives and ambiguity register

| Option | Decision / reason |
|---|---|
| Per-screen scrollbar rules | Rejected: duplicates shared presentation and misses overlays |
| Native standard colors only | Retained for engines without WebKit scrollbar selectors |
| One global skin with native fallback | Selected: rounded thumb, transparent track and consistent hover/drag colors; preserves native scrolling |

Confirmed: apply generally, preserve themes/directions and all existing scroll
owners. Derived low-risk visual choices: 10px desktop track, 2px transparent thumb
inset, 999px radius, 40px minimum thumb extent, neutral idle and blue interaction.
No Missing, Conflicting or Uncertain business/API decisions.

## Frozen target contract and compatibility

- One Sass partial imported by `src/styles.scss`, outside the linked RTL asset.
- Reuse Sigma palette tokens; apply to vertical and horizontal scrollbars and
  appended overlays without changing overflow, dimensions, gutters or direction.
- Mouse/fine-pointer presentation: custom WebKit thumb where supported;
  standards-based thin scrollbar otherwise. Reset standard scrollbar properties
  to auto in the WebKit branch so they do not suppress pseudo-element paint.
- Shared scrollbar properties alone may use `!important` to beat existing
  component-scoped scrollbar-color/width declarations; do not change component
  layouts or other CSS properties through that override.
- Touch/coarse/no-hover and forced-colors retain automatic native scrollbars.
- Remove obsolete global dark-dropdown-only scrollbar rules. Existing local
  declarations are compatibility source, overridden by the shared paint owner.
- No API, grid/DTO, route/provider/event, permissions or persistence changes.
- Revert the import/partial and dropdown removal to roll back the skin; no data action.

## Pre-edit conformance

| Concern | Book | Actual reference / shared owner | Frozen target |
|---|---|---|---|
| Geometry | UI1 | Layout `.sigma-shell__content`; DataTable `.p-datatable-table-container` | Keep overflow/min-height/gutter unchanged |
| Palette and shared paint | Master5; UI24/25 | `styles.scss` root/dark Sigma tokens | One shared scrollbar owner consuming those tokens |
| Overlay inheritance | UI24/25 | Existing global dark Select/MultiSelect overlay skin | Same scrollbar paint as other regions |
| Guide | Master7 | GuideReader sharedScreenGuidance loop | One bilingual shared overview paragraph |

## Execution and verification

Plan frozen before source edits. Phase0 inventories shared owners; Phase1 records
API/backend as not applicable; Phases2–4 have no changed grid/write/action contract;
Phase5 owns global stylesheet integration; Phase6 reviews the complete scoped
diff and guide. Source verification only. Owner checks: light/dark, Arabic/English,
vertical/horizontal table scroll, sidebar, dialog, dropdown, hover/drag, keyboard,
touch and forced-colors; no new document scroll. Builds/tests/lint/browser are not
authorized. Implementation and evidence are recorded in SHARED_SCROLLBAR_FEATURE_REVIEW.md.
