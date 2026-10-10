# PLAN 0: Maintenance / Evolution Planning

Use this packet before implementation when an existing Sigma capability is being
extended, corrected, replaced, or made cross-cutting and the target behavior is
not already frozen. It turns the current system into a reviewable change plan;
it does not authorize source edits.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references are selected only after the affected UI/backend shapes are
known:

{{APPROVED_REFERENCES}}

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
