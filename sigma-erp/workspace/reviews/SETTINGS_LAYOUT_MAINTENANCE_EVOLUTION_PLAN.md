# Settings presentation maintenance

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-01 |

Owner first requested a source review of Settings formatting, then explicitly
authorized confirmed layout fixes and appropriate internal vertical tabs.
Tier L because the routed Settings container serves 24 consumers. This plan
freezes presentation only; backend/API/domain changes are outside this slice.

## Existing state and impact

Active route: pages/routing.ts → Administration/Settings/settings.routes.ts →
SettingsLayoutComponent → 24 lazy children. Frontend scoped tree was clean at
discovery. Documentation repository already contains unrelated edits; preserve
them. Workspace reviews are local records outside the application repository.

| Area | Decision | Evidence/target |
|---|---|---|
| Route shell | Refactor | Only API Key currently bounds the parent; all children need the UI1 route/page/panel chain |
| Page chrome | Refactor | 22 children lack FeatureTitle; use shared title and fixed actions, remove legacy outer cards |
| Long forms | Extend | Common, Document Number, Fields: preserve semantic groups and introduce internal vertical EditorTabs |
| Small forms/collections | Keep/Refactor | Keep fields and existing actions; put body in one bounded content viewport |
| Shared owners | Extend | Existing global shell styles own settings child allocation and reusable vertical section layout; EditorTabs owns interaction/paint |
| Styling | Remove | Fields and Charges private palettes; use Sigma tokens and existing field/state owners |
| Persistence/API | Keep | BE16 settings shape; no tab creates a separate settings save/key |
| Guide | Extend | Existing Administration guide/reader, bilingual Settings instructions |

## Decision and alternatives

Keep one long scroll: smallest code change but leaves unrelated groups difficult
to locate. Copy local sidebar tabs: duplicates accessible/theme owners. Selected:
reuse EditorTabs vertical with shared layout, preserve parent forms and keep
panels mounted/hidden so controls, draft and child collections survive selection.
No new framework, route, endpoint, cache opt-in, permission or financial rule.

## Frozen target

Use the existing routed workspace pattern (screen06; UI1/3/13), approved
LinkAccounts reference and actual shared EditorTabs/FeatureTitle/footer.
Parent owns the only page/card; children fill its outlet. Each child keeps title
and Save outside its body scroll. Route links remain real route navigation;
internal section tabs use separate stable IDs and active state. Common is grouped
by current setting topic; Document Number by document families; Fields by its
existing entity blocks. Small pages are not given unnecessary tabs.

Hidden panels preserve model/control instances. Invalid Save marks controls
touched, activates the owning section and uses shared focusField. Existing
validation rules and save payloads remain authoritative. The selected panel and
vertical nav have separately bounded scroll regions. Below700px they stack with
zero-minimum tracks; no fallback page scrolling. Tokens own RTL/theme paint.

## Reference gate and ambiguity

Read local Speed entry; 2026-10-27 guide chapter17; 2026-10-28 Administration
screen38 Settings (tenant.settings, R0103/C0431). It declares separate common,
numbering, required-field and other settings saves; this supports topic grouping,
not a new API or accounting rule. Sigma's actual controls and settings contracts
remain the source of fields and saves. S191 (date/time/zone), S187/S188 (fields/
documents) are the relevant original explanation candidates; coverage and exact
read evidence are reconciled in the feature review. No screenshot supplied.
Unknown server/permission/financial behavior is not resolved by frontend evidence.

No material decision blocks this presentation slice. Existing backend legacy
conformance debt is recorded separately rather than silently converted during
layout work. No schema/data migration or rollout/backfill is needed here.

## Ordered implementation and verification

1. Freeze consumed UI/persistence boundary (this plan and UI contract).
2. Bound parent and child layouts, adopt shared titles/fixed actions.
3. Add internal vertical sections to the three long pages; retain all bindings.
4. Reconcile labels, theme tokens, invalid-section focus and shared loading host.
5. Update Administration guide and owning UI block/skill; regenerate packets.
6. Review scoped frontend/documentation diffs; Angular template/TS syntax and
   binding-inventory source checks, no builds/tests/lint/browser/database.

Owner acceptance: all24 routes, long EN/AR names, LTR/RTL, light/dark, narrow,
intermediate and short viewport, pointer/keyboard tabs, draft retention, invalid
Save from another section, existing save/failure recovery and one visible loader.
Timing/network and SQL-plan evidence remain pending; layout source proves no
latency improvement. No new index proposed by this presentation-only change.
