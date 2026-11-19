# Companies saved lookup presentation — 2026-10-02

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Company editor and nested driver; one shared pure select-option utility |

## Existing state and impact

Company DetailsComponent already preserves saved options through a private merge and a lookup-completion merge. Driver fields instead replace country options with the select response; a saved nationality/address country absent from that response has no visible selected label. Individual has a similar private Company-style merge, but it is an approved reference outside this task and is not modified. Root HttpClient and server select routes stay unchanged. No entity, DTO, persisted data, calculation, authorization or report contract changes.

| Area | Classification | Decision/evidence |
|---|---|---|
| Company lookup merge | Refactor | Reuse a pure shared merge with the same incoming-first order; avoid numeric/string ID duplicates supported by DropDownSelect.id |
| Nested driver options | Extend | Retain the saved nationality/country pairs from the existing detail-derived draft when merging fetched options |
| Shared owner | Create | `shared/utils/select-options.ts`, imported by both in-scope consumers; no new API or component |
| Other screens | Keep | Existing copies migrate during their own review; no bulk edits |

## Options and ambiguity register

| Option | Effect | Decision |
|---|---|---|
| Local driver copy of Company merge | Correct label but duplicate reusable behavior | Rejected by Master 5 extraction gate |
| Invent labels or fetch another detail endpoint | New unsupported contract and requests | Rejected |
| Pure shared merge, fallback from actual saved detail | Keeps identity/labels and eliminates scoped duplication | Selected |

All needed rules are Confirmed/Derived from UI 16/22 and actual Company/Individual source: fetched options take precedence; preserve fallback entries with distinct IDs; compare IDs through String(id), because DropDownSelect explicitly allows number/string. No owner business-policy decision is required. An absent saved label is not fabricated. A fallback enables presentation only; backend reference validation still decides write validity.

## Target, compatibility and implementation

`mergeSelectOptions(incoming, saved)` returns a new DropDownSelect[] in incoming order followed by saved IDs not already present. It does not mutate either input, call the API, normalize stored form IDs or invent data. Adopt it in Company and Driver only. Driver retains current null/clear and readonly behavior, using existing seed nationality/country names. Document the reusable owner in UI 16, the required skill and changelog in the same task.

No migration/backfill/rollout step; imports own utility compilation, no tsconfig root addition. Recovery is normal local source revert before owner acceptance. Phases: PLAN-00/Frozen → Phase 1 existing contract reaffirmed → Phase 3 implementation → Phase 5 imports/lifetime → Phase 6 scoped diff/reconciliation. Verify source input order, ID equality, seed preservation, dropdown values and readonly labels; owner checks delayed lookups, missing saved selections, and number/string ID responses. Builds/tests/browser/DB remain owner-pending.
