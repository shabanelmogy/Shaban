<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: plan-00-maintenance-evolution | Status: canonical-planning -->
<!-- Source: recipe-manifest.json + templates/PLAN-00-maintenance-evolution.template.md -->
# PLAN 0: Maintenance / Evolution Planning

Use this packet before implementation when an existing Sigma capability is being
extended, corrected, replaced, or made cross-cutting and the target behavior is
not already frozen. It turns the current system into a reviewable change plan;
it does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:3d74ae71fa7ca4d78e3061da8b59c62bf979108fe9529ec4052336a6da002034
- master.1: ## 1. Governance and review principles | sha256:2d7b129595e5d4a952130db10961d2b8c81c0851dbc75fae7d83106e13c8daef
- master.2: ## 2. Screenshot and visual evidence policy | sha256:0b1dbab4b3b5c74d8f98f445aa6401c59248a410eb62069b1a0e970aae83a7c2
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:b6729b22bb633b011bd9115edd1468d600b6fc95c85725b939bd93644d7f35ae
- master.8: ## 8. Packet generation and governance | sha256:583605ea6557f568ab23959ef911184ff0864cbc5ee4ab4ca5e7b424dd6d30d0
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.29: ## 29. Verification expectations | sha256:d4d703957f2f11fce5f669412da7e6d216784b7c5430f1a4cac6cfa0f277b326
- ui.30: ## 30. Backlog, by priority | sha256:154cf976b06e9031b4063231c1f0893ff034c7b7e3c89f1bbee564712d37cf7e
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.18: ## 18. Edge cases | sha256:ca231703f8f3eecb2ba71fb505d7d6960d9c84ae8c2a9f3e3a73847bc553c3b8
- backend.19: ## 19. Backlog | sha256:18d15f0bff56e89133a305cda566487d6fcf90c96f67656f59976fd7ed112bac

Approved references are selected only after the affected UI/backend shapes are
known:



The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Planning is owned by Master1 ("Maintenance and evolution planning before
implementation"); each step below names the block that owns its rule.

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
- Master2 analysis-guide inputs: the relevant Speed chapter, original screen
  explanation and dated sidebar/code cycle, then pinned Odoo for remaining gaps.
- Known production/data constraints when available.
- Existing working-tree changes in the affected scope.

## Procedure

Apply Master2's reference-product functional detail target and Master4's
coverage rows (matched/partial/missing/blocked/excluded); current minimal
behavior is not the target ceiling.

1. Define the requested outcome, non-goals, affected workflows, and success
   conditions.
2. Audit the current capability end to end: domain/entity/configuration,
   persistence, writers, readers, calculations, API, Angular, reports,
   permissions/tenancy, integrations, migrations, and documentation.
   Before freezing the target, apply Master2's analysis-guide gate and record
   Master4's reference-cycle rows; frontend declarations never prove server or
   financial rules. Execution permissions are unchanged by this step.
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

Record the analysis-guide and reference-cycle evidence beside the current-state
evidence (Master2, Master4).

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
  from scoped build, test and lint results (Master5), migration evidence
  (Master7), and owner-run runtime, browser and database acceptance.

## Expected handoff

A `Frozen` plan feeds Phase 0 with exact scope, affected shapes, evidence,
unresolved non-blocking items, and implementation slices. Phase 1 then freezes
the authoritative domain/API contracts consumed by later phases. A `Blocked`
plan does not authorize implementation of the blocked slice.
