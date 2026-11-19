# Shared percentage column reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Implemented the frozen SHARED_PERCENTAGE_COLUMN_MAINTENANCE_EVOLUTION_PLAN.md
through the existing shared DataTable/format owner. Installed PrimeNG ProgressBar
declaration and host/value DOM inspected before use. ProgressBarModule belongs
to the real standalone table imports; no new runtime file/compile root needed.
PR consumptionPercent and PO receiptPercent now declare type percentage rather
than duplicating toFixed callbacks. Existing descriptors continue to supply
numeric filters; PO report copies the descriptor, both screen exports use
dataTableExportRows. No business calculation, DTO/HTTP/schema or migration change.

| Concern | Canonical reference / final source |
|---|---|
| Presentation | UI6/24; DataTableComponent existing render branches, installed ProgressBar; 52px/4px track,8px gap,20px minimum, tokens and logical origin |
| Value | data-table.format dataTablePercentage/dataTableCellText; finite numbers only, percent points,2decimals;0 preserved, missing dash; clamp bar only |
| Filter | UI6; private local cells store raw finite number and resolve numeric type for empty/local/lazy rows; existing server numeric fields untouched |
| Export | UI8; current dataTableExportRows formatter used by both list outputs; percent string retained |
| Composition | Existing callbacks/templates/hierarchy/link/indent precedence unchanged; percentage visual branch follows those specialized owners |
| Accessibility/print | Visible text always retained; decorative bar aria-hidden/no animation; print hides bar, logical-start fill for RTL |
| Guide | Master7; SHARED_SCREEN_GUIDANCE EN/AR consumed by existing GuideReader overview |
| Reuse | Existing DataTable extended instead of a second component or feature-specific markup; UI6 and skill updated together |

Scope classification: Keep business/list/API/grid ownership; Extend shared
column format/render/filter type; Replace two repeated callbacks; no new shared
service or feature palettes. No unresolved material policy. Focused discovery,
frozen shared read-column contract, UI read-grid/integration/final source
reconciliation; backend/write/action phases do not apply. No screenshot supplied.
No agents because the formatter/template/filter chain is coupled and two
consumer edits are tiny. Existing dirty work remains preserved.

Verification: review scoped source diff and unknown/zero/negative/over100 handling;
source inspection only. Owner should check0/partial/100/unavailable, long tables,
numeric filters, PO report/print/export, narrow widths, RTL and both themes.
Build/tests/lint/runtime/browser/database/migrations/commits were not run.
Suggested frontend commit: `feat(table): show shared percentage progress cells`.
Suggested docs commit: `docs(ui): define shared percentage column behavior`.

Final source reconciliation: reviewed shared format/renderer/style/filter diff
and the two consumer descriptor replacements; directly confirmed both existing
exports call dataTableExportRows and PO report reuses its column descriptor.
Numeric0 uses the explicit null comparison (not a truthiness guard); only the
fill clamps, while raw finite values remain in local filter cells. Existing
callback/template branches and other column types are unchanged. Installed
ProgressBarModule export, same-host theme variables and actual value child were
checked. Shared EN/AR guide's current reader consumer remains registered.
Scoped frontend/documentation whitespace checks passed. Generator changed only
UI6 provenance in PHASE-02, with zero non-provenance changes; canonical source
and approved shared-table reference roles reconciled, final all-eight check
passed. No runtime/visual/print or compiler pass is claimed.
