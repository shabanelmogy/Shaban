# Workshop continuation contract — 2026-10-09

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Nine live Workshop frontend areas and directly related UserGuide integration |
| Request | Review Workshop and implement confirmed documentation fixes |
| Authority | AGENTS.md; frozen Workshop plan/handoff and amendments; Master4/5/7; UI1/4/10/14/17/22/23/28; generated PLAN00/PHASE00–06 after eight successful drift checks |
| Screenshots | None supplied |

This handoff extends the existing Frozen Workshop contract without changing APIs, states, persisted inputs, tax rules, derived ownership, tariff replacement semantics or schema. Existing unrelated frontend/backend edits are preserved. Application builds, tests, lint, browser, database, migrations, snapshots, commits and pushes remain prohibited.

## Manifest and decisions

UI shapes: Job/JobEstimation/WorkOrder/Lubrication routed documents (UI02); Category/Activities modal records (UI01); tariff settings workspace (UI06); estimation/labour reports (UI07); Job actions (UI09); vehicles read-only compatibility workspace. Backend evidence uses normal entity, existing aggregate, settings and report patterns. Authentication remains AuthGuard plus the interceptor-enabled root client, with no new authorization mechanism.

Source evidence and before-edit conformance:

| Concern | Book / actual reference / shared owner | Frozen target |
|---|---|---|
| Pending route discard | UI10; current Movements/Custody and Lease routed editors; shared freezeFormState | Job, Estimate, Lubrication, WorkOrder and tariff defer confirmation until subscription, recheck identity/busy/pending state, freeze controls without events, restore only a cancelled still-current editable instance. Successful Save bypasses discard. Cancel/Back/navigation share one route decision. |
| Pending modal discard | UI10/13; controlled EditorDialog and current Movements examples | Category/Activities and writable Job/Estimate dialogs freeze the captured form during decision, guard replacements and preserve dirty values/disabled subtrees on Cancel. Upload cleanup retains its existing gate and may not re-enable committed controls. |
| Child removal | UI14; shared EditableRows.confirmationPending/freezeParentOnConfirmation | Reuse existing shared owner, gate parent Save/Add/navigation while removal pending, re-resolve the row, freeze parent controls; no payload/omission changes. |
| Calendar hydration | UI17; shared toPickerDate | Replace repeated date-only hydration in reviewed Workshop with shared helper; datetime fields retain datetime transport/precision. |
| Filter alignment | UI4; Job list and FilterPanel.stableLayout | Category and Activities enable stableLayout. Existing local class hooks have no styling and are harmless; sigma-list-header is canonical and is retained. |
| Guide completion | Master7; existing UserGuide reader/model and guide content | Add bilingual Workshop section, eight menu topics plus Lubrication/action topics, register in existing reader and Workshop menu with matching translations. Steps reflect actual persisted conversion/action behavior. |

Backend audit's WorkOrder soft-delete finding was rejected before final implementation: Repository.Query defaults includeDeleted=false and already applies IsDeleted!=true. Its proposed duplicate predicate was removed. No backend edit is warranted. Local list CSS hooks are not a design violation when they carry no rules; initial cleanup was withdrawn. Empty existing SCSS files stay untouched.

Grid/filter/write/action/route contracts remain those of WORKSHOP_FRONTEND_CONTRACT_FREEZE.md (including owner amendments) and actual source. No contract member removed or added. Shared-extraction decision: reuse freezeFormState, EditableRows, dates, filter components and UserGuide reader; no new shared capability or book rule is needed.

Root owns integration, Job/action dialogs, translations, guide, artifacts and final diff. Isolated workers may own (A) Estimate/Lubrication and (B) Category/Activities/WorkOrder/tariff, with no overlap or shared-owner edits. Phases0/1 freeze,2 alignment,3 editor lifecycle,4 existing action-dialog safety,5 wiring and6 source reconciliation apply. Runtime acceptance stays owner-pending.
