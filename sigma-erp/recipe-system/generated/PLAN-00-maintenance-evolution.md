<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: plan-00-maintenance-evolution | Status: canonical-planning -->
<!-- Source: recipe-manifest.json + templates/PLAN-00-maintenance-evolution.template.md -->
# PLAN 0: Maintenance / Evolution Planning

Use this packet before implementation when an existing Sigma capability is being
extended, corrected, replaced, or made cross-cutting and the target behavior is
not already frozen. It turns the current system into a reviewable change plan;
it does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:38d22849a6d25f64baa38c14562b4c85f08b29199ca287825471c3cfdacaf0e7
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:19e4710cabe88f26cc45a10219fc9e19830eae0d722ca8c6e4bdbbf4ac28524a
- master.8: ## 8. Packet generation and governance | sha256:685e9463fc13be9a9d9d7ed261ee88f5aee17f3ded08472af4daf0587aa945b1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:1ee143e6e852683c791622ef3af32d881d057bf39cd40e075837d578707c646b
- ui.29: ## 29. Verification expectations | sha256:e167960f8e5261f686e1f814e7b72c810aa26533fe5b419607c8f709429be865
- ui.30: ## 30. Backlog, by priority | sha256:40f660b87620c32c9dc93dad29af8974f968dc210f6957179c41d6a4023d0fca
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:8a1b6fc2fa0bedff7a3245f9b349945a955c10cfa4a4fc4c76896841aab53cdc
- backend.18: ## 18. Edge cases | sha256:ac57e18f32891be679ab03e00c127257a4f54d2fbae1fa05863723837b0edc77
- backend.19: ## 19. Backlog | sha256:b7b2b40c39735d0f149c7df2b3280c32f8c2cb0fdc04b425cd0bafa3a8c1af30

Approved references are selected only after the affected UI/backend shapes are
known:



The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop using a packet that disagrees with canonical sources. Follow
Master block 8: run recipe `-Check` before use; reconcile initial drift or changed
book/template/manifest claims, regenerate affected packets through the generator,
semantically review their source rules and approved-reference roles, then rerun
`-Check` before use or handoff. Record packet IDs and review evidence. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Use canonical sources and report a precise blocker for unresolved conflicts.

## Purpose

- Understand what Sigma already owns before adding a parallel concept.
- Surface ambiguous or contradictory business logic before coding.
- Decide whether each affected area should be kept, extended, refactored,
  replaced, created, or removed.
- Compare viable designs and freeze one target contract with explicit trade-offs.
- Define migration, compatibility, implementation order, and verification before
  the first source change.

## When this plan is required

Use it when the request crosses established features/modules, changes shared
domain concepts, affects persisted/historical data, changes shared contracts or
calculations, or contains business logic that is Missing, Conflicting, or
Uncertain. Examples include currency, tax, pricing, numbering, approvals,
posting, inventory valuation, permissions, and shared integration behavior.

## Explicit exclusions

- Implementing the proposed solution.
- Generating or applying migrations/data fixes.
- Inventing business rules because the current source is incomplete.
- Copying a reference feature before the target ownership and contracts are known.
- Treating a screenshot or legacy implementation as architectural authority.

## Required inputs

- Requested business outcome and known constraints.
- Current Sigma source for the affected writers, readers, persistence, UI,
  reports, and integrations.
- Relevant canonical documentation and existing feature review artifacts.
- Known production/data constraints when available.
- Existing working-tree changes in the affected scope.

## Procedure

1. Define the requested outcome, non-goals, affected workflows, and success
   conditions.
2. Audit the current capability end to end: domain/entity/configuration,
   persistence, writers, readers, calculations, API, Angular, reports,
   permissions/tenancy, integrations, migrations, and documentation.
3. Record every unclear rule in the Logic Ambiguity Register as Confirmed,
   Derived, Missing, Conflicting, or Uncertain. Name the evidence or owner needed
   to resolve each non-confirmed rule.
4. Build the impact map across producers, consumers, shared contracts, persisted
   data, calculations, reports, integrations, and deployment/migration behavior.
5. Classify every affected area as `Keep`, `Extend`, `Refactor`, `Replace`,
   `Create`, or `Remove`, with evidence and reason.
6. Compare materially different viable options. Evaluate business correctness,
   ownership clarity, maintainability, future extension, compatibility,
   migration/data risk, runtime risk, and implementation complexity. When the
   alternatives change business semantics, present them to the business/system
   owner and record the explicit decision instead of selecting a policy by
   technical preference.
7. Select the target and freeze domain/API/UI/calculation/authorization contracts.
   Select canonical references per shape only after those shapes are known.
8. Define schema/data/API compatibility, defaults/backfill, rollout order, and any
   owner-run migration or data-correction requirement.
9. Split implementation into dependency-ordered slices and map each slice to the
   applicable PHASE packets. A slice must not depend on an unresolved upstream
   decision.
10. Define verification before coding: source reconciliation, focused tests,
    runtime journeys, browser/UI checks, migration/data checks, and recovery or
    rollback evidence appropriate to the risk.
11. Mark the plan `Frozen` only when the first implementation slice has no
    required Missing/Conflicting/Uncertain decisions and downstream impact is
    understood. Otherwise mark it `Blocked` with the exact unresolved decision.

## Required outputs

### Existing-State Inventory

| Concern | Current owner/source | Current behavior | Consumers | Known debt/constraint | Evidence |
|---|---|---|---|---|---|
| | | | | | |

### Logic Ambiguity Register

| Rule/question | Current evidence | Status | Why it matters | Required decision/source | Owner |
|---|---|---|---|---|---|
| | | Confirmed / Derived / Missing / Conflicting / Uncertain | | | |

### Impact Map

| Area | Producer/owner | Consumers | Data/calculation impact | Compatibility risk | Required phase |
|---|---|---|---|---|---|
| | | | | | |

### Gap Decision Table

| Area | Current state | Decision | Target responsibility | Reason/evidence |
|---|---|---|---|---|
| | | Keep / Extend / Refactor / Replace / Create / Remove | | |

### Option / Decision Matrix

| Option | Business correctness | Maintainability | Compatibility/migration | Future extension | Complexity/risk | Decision |
|---|---|---|---|---|---|---|
| | | | | | | |

### Decision Review

| Decision requiring owner input | Options presented | Trade-offs explained | Owner decision | Evidence/date | Remaining condition |
|---|---|---|---|---|---|
| | | | | | |

### Target Contract

| Contract | Target owner | Exact rule/shape | Existing consumers affected | Status/evidence |
|---|---|---|---|---|
| Domain/invariant | | | | |
| Persistence/data | | | | |
| Calculation/precision | | | | |
| API/request/response | | | | |
| Failure behavior | | | | |
| Authorization/tenancy | | | | |
| UI/workflow | | | | |
| Reports/export | | | | |
| Integration/runtime | | | | |

### Migration and Compatibility Plan

| Change | Existing data/consumer behavior | Migration/backfill/default | Rollout order | Recovery/rollback | Owner action |
|---|---|---|---|---|---|
| | | | | | |

### Dependency-Ordered Implementation Plan

| Slice | Outcome | Depends on | Applicable phases/packets | Main areas | Completion evidence |
|---|---|---|---|---|---|
| | | | | | |

### Verification Matrix

| Risk/behavior | Source check | Automated check | Runtime/browser/data check | Owner | Completion gate |
|---|---|---|---|---|---|
| | | | | | |

## Cross-cutting currency probe

When the requested change is a currency system, do not start from a generic
multi-currency design. First answer from Sigma evidence: base, transaction and
reporting currency roles; current amount storage assumptions; exchange-rate
source/date/type; precision and rounding owner; original/base amount persistence;
posting/editability rules; opening-balance, journal, customer, supplier and report
effects; revaluation/gain-loss scope when applicable; UI display/selection; and
the default/backfill behavior for existing records.

## Continuous gates

- Existing behavior is inventoried before target design is selected.
- Every ambiguous rule is visible and classified; Uncertain is never implemented.
- One owner exists for each target contract and calculation.
- The plan extends or corrects the current owner when appropriate instead of
  creating a duplicate path by default.
- Options are compared before a material architecture/business decision is frozen.
- Business-policy choices are explicitly decided by the owning human/business
  authority; implementation reviewers do not infer them from convention.
- Historical data, migration, API compatibility, and direct consumers are named.
- Implementation slices are dependency ordered and map back to canonical phases.
- Verification is defined before implementation and distinguishes source review
  from owner-run build, runtime, browser, migration, and database evidence.

## Expected handoff

A `Frozen` plan feeds Phase 0 with exact scope, affected shapes, evidence,
unresolved non-blocking items, and implementation slices. Phase 1 then freezes
the authoritative domain/API contracts consumed by later phases. A `Blocked`
plan does not authorize implementation of the blocked slice.
