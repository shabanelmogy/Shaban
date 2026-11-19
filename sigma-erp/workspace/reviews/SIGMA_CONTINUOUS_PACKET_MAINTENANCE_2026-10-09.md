# Continuous generated-packet maintenance — 2026-10-09

Status: Implemented — documentation/source-only. Owner explicitly requests a
standing rule to keep packets updated continuously. This is derivative
documentation maintenance, without changing application execution boundaries.

## Rule and authority

Master block 8 owns the rule. AGENTS.md, Master preamble1.28, the required
sigma-screen-refactor skill and its revision history are synchronized. Initial
recipe drift and subsequent canonical/template/manifest changes trigger a
generator-only refresh in the same task, semantic source/reference-role review,
and final Check before use/handoff. Routine refresh no longer remains pending
for the owner. A missing source/unresolved canonical conflict keeps the affected
packet out of use and is reported precisely. Standing authorization includes
derivative maintenance during source-read-only reviews, without application
source edits or new canonical business decisions. Unrelated changes are retained.

## Changed documentation

- `F:/My Work/Sigma/AGENTS.md`: continuous maintenance section, updated date and
  explicit direct-edit prohibition for generated packets.
- `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md`: operational
  checklist and revision-history entry citing Master8.
- Canonical documentation at
  `F:/My Work/Shaban Documents/Shaban/sigma-erp`: Master0/8 and CHANGELOG;
  recipe manifest; PLAN00 and PHASE00–06 templates; all eight generated packets.
- Workspace entry point remains a pointer to the authoritative AGENTS.md.

The documentation repository already held owner/peer changes in its manifest,
several templates, generated packets, changelog and Master preamble. Their
content was extended in place. Generated files were written only by
Generate-SigmaRecipes.ps1; none was edited manually.

## Semantic review and evidence

Initial Check: PLAN00 and PHASE00/02–06 stale, PHASE01 current. Captured the
current eight generated files before refreshing, then compared the complete
generated diff against that baseline. Packet-body changes consist of the
maintenance paragraph and Phase03 reference correction; remaining changes are
source fingerprints/dependency declarations. Existing phase scope, frozen
contract gates, CRUD/action/financial ownership and source-only limits remain.

| Concern | Canonical evidence | Final packet/template/manifest comparison |
|---|---|---|
| Authority and maintenance | Master0/8; AGENTS standing owner authorization | All eight packets retain derivative authority, require Check/refresh/semantic review/final Check, and state source-read-only application boundary. |
| Dependency closure | Master8 owns the maintenance paragraph | All eight manifest entries declare Master8; generated provenance includes master.8. No unresolved template placeholders. |
| Modal reference role | UI13 explicitly states Fleet/VehicleService is routed; screen catalog01 uses shared modal composition | Removed Fleet/VehicleService from Phase03 approvedReferences and replaced the stale ordinary-modal claim with UI13 controlled composition and shared EditorDialog/EditorTabs. Retained routed Job, step-form CompanyPartner and shared owners. |
| Existing source drift | UI2/22 optional CommonSettings inline feedback; UI10/14 form-state freeze; UI17 saved-date hydration | Updated fingerprints reflect current canonical rules. Packet process statements retain their existing validation/loading/dirty/full-snapshot ownership and do not conflict with those optional/shared contracts. |
| Other reference roles | Catalog and canonical backend/UI per-shape references | Phase01 backend references, Phase02 list/report owners, Phase04 confirmations/transition owners and Phase05 actual routing/client wiring remain in their original roles. |

Regenerated IDs: `plan-00-maintenance-evolution`, `phase-00-discovery-evidence`,
`phase-01-domain-api`, `phase-02-read-grid`, `phase-03-detail-write`,
`phase-04-domain-actions`, `phase-05-integration-runtime`,
`phase-06-final-reconciliation`. Final generator Check reports OK for all eight.
Scoped documentation whitespace checks pass. This synchronization does not
claim application compiler, runtime, browser or visual acceptance.

The optional full-book reference checker reports four existing path-style
references: UI2 `SettingsCommonModel/GetMySetting`, UI16 `ClauseType/GetSelect`,
UI20 `stockReports/shared/StockReportPage`, and UI28 `@angular/core/index.d.ts`.
The first two are endpoint/symbol labels, not missing packet source blocks;
the others remain outside this amendment. None is introduced by the policy or
Phase03 reference correction. The checker is not reported as passing; its
source/path classification remains documentation follow-up. All declared
packet sources resolve and generator Check still passes for all eight packets.

No migration, build, tests, lint, database, commit/push, Graphify or Sigma MCP
command. No subagent: the amendment and generator reconciliation are sequential.
Suggested documentation commit:
`docs(recipe-system): require continuous packet maintenance`.

The existing documentation-system evolution plan remains the historical owner
of that broader program; this report records only the requested standing rule
and current refresh. No new architecture or business-rule pilot is introduced.
