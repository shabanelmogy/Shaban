# Link Accounts corrective action

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Scope / evidence / inventory

Owner requests an explicit corrective operation for the invalid retained links in12345.PNG and a common reference for subsequent creation. Screenshot is functional evidence: nine Manual rows include Rental Roof/Tyre linked to prepaid interest/buildings, four banks linked to CustomerDefault, stale customer-group dimensions, invalid prepaid source and unsuitable workshop inventory account. Truncated messages do not prove missing classifications or valid replacement IDs. Existing LinkAccountsAutoLinkService, catalog, selection policy and guard already own generation, validity and preservation; keep these rather than duplicate provisioning. UI06 tabbed settings and existing auto-link action dialog are approved owners. No historical journal, account type/category, fiscal setting or account balance correction is authorized by this settings operation.

## Impact / decisions

| Area | Decision | Outcome |
|---|---|---|
| AccountSelectionPolicy and catalog | Keep | Same semantic type and seed-code rules in normal completion, setup and repair |
| BuildPlanAsync | Extend | Accept a server-only explicit canonical slot set; reuse matching/creation/type selection |
| AccountSetupLinkSelectionGuard | Keep | Normal completion still preserves invalid retained selections; repair consumes its diagnostics |
| Corrective action | Create within existing service | Preview invalid retained links only, old/new labels, metadata normalization, token checked apply |
| UI / model / API | Extend | Separate Repair action, same shared preview dialog and confirmation; new authenticated GET/POST routes |
| New database / chart setup | Keep | Uses same catalog/policy/planner; missing links continue through existing creation pipeline |
| Existing account metadata / postings | Keep | Replace configuration reference only; never retype/move accounts or rewrite journals |
| Unresolvable sources / duplicate rows | Keep manual | No deletion, merging, source substitution or inferred account-type backfill |

Alternatives: automatic replacement on every seed rejected because it overwrites deliberate customer selections; manual-only leaves the owner without the requested corrective action; explicit preview/apply reusing the current owners selected. Existing seed/run remains non-corrective. Required business choices are derived conservatively from existing canonical identities and owner-approved account roles. Invalid prepaid source cannot identify another source: manual, reported. HRM remains its separate workflow and is out of the screenshot/current screen scope.

## Execution / compatibility

Contract in LINK_ACCOUNTS_REPAIR_DOMAIN_API_CONTRACT_FREEZE.md. Phases0/1/3/4/5/6; existing complete local table, no server grid/paging contract change. PLAN-00 and applicable phase packets checked current. No entity/EF/schema/migration, extra DI service, route navigation or permissions API. Backend/frontend release together. Source-only reconciliation, no build/test/browser/database commands. Existing unrelated changes preserved. Root owns backend and integration; one bounded frontend worker after freeze, disjoint ownership.

Owner journeys: preview makes no writes; valid custom links omitted; metadata-only correction keeps valid target; invalid target reused/created with correct role; duplicates/deleted source/invalid prepaid source remain manual; cancel no writes; stale preview rejected; apply atomic, repeat no new correction; new chart seed maps Roof/Tyre to correct Income leaves; invalid old GL retains its transactions unchanged.
