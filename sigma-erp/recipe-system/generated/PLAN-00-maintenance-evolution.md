<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: plan-00-maintenance-evolution | Status: canonical-planning -->
<!-- Source: recipe-manifest.json + templates/PLAN-00-maintenance-evolution.template.md -->
# PLAN 0: Maintenance / Evolution Planning

Use this packet before implementation when an existing Sigma capability is being
extended, corrected, replaced, or made cross-cutting and the target behavior is
not already frozen. It turns the current system into a reviewable change plan;
it does not authorize source edits.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:a56c86bda3deb92b3f1892bfb6e323ae991d0aa315ba1183a531303dbf88bd06
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:8e602319017e268b923ed2bb8b7a8d21a1a3252640f23a986d99821842ea0c6f
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:db683d8cd9d81f554a0a9711335795c930c8e0846d9bc73fcf40f1da6084171f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.7: ## 7. End-to-end reconciliation and final report | sha256:2b8f1fba057c9e4a3f8e7a06476c13d2f010addbd786693fda0e418a1519d760
- master.8: ## 8. Packet generation and governance | sha256:83984057ab3271c0800beed7d7db3fa2c7c3ca9f6b27a80babbf35938feb329c
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.29: ## 29. Verification expectations | sha256:857fd2de21235042c2d3c3d8af841d8bed3580a97bed2ff1680f6a3c2c291f04
- ui.30: ## 30. Backlog, by priority | sha256:154cf976b06e9031b4063231c1f0893ff034c7b7e3c89f1bbee564712d37cf7e
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.18: ## 18. Edge cases | sha256:13d0548154a54a05fda8d1276d7d19529ee31b2b79d7945ab1363e7f18abb6f0
- backend.19: ## 19. Backlog | sha256:82bdfe247692ed298743d856e1dd6ac186a81e264d6197fdae04427f3a5de14b

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
- Master2 analysis-guide review: relevant chapters and original screen
  explanations from the documentation's `references/speed-analysis/README.md`,
  plus the applicable dated sidebar/code cycle slice, compared with actual Sigma
  source/contracts/user-guide topics when present.
- Known production/data constraints when available.
- Existing working-tree changes in the affected scope.

## Procedure

Apply Master2's reference-product functional detail target and Master4's scoped
coverage rows: map reference fields/groups, filters, actions/dialogs, states,
validations, document links, charges/calculations and outputs to actual Sigma
source/guide. Plan partial/missing details rather than treating current minimal
behavior as the target ceiling. Record exact decision blockers and explicit
owner exclusions; preserve task authorization and unknown server/financial rules.

1. Define the requested outcome, non-goals, affected workflows, and success
   conditions.
2. Audit the current capability end to end: domain/entity/configuration,
   persistence, writers, readers, calculations, API, Angular, reports,
   permissions/tenancy, integrations, migrations, and documentation.
   Before selecting/freezing the target, apply Master2's analysis-guide gate:
   record sources actually read, applicability, accepted evidence, exclusions
   and gaps in this plan. Keep Speed descriptions/proposals distinct from Sigma
   contracts; a supported Not applicable outcome is valid, and tier S only
   covers the changed element. Existing execution permissions stay unchanged.
   Map the relevant sidebar section/screen/state to source controllers, dialogs,
   service declarations and predecessor/successor documents; record the dated
   file:line/hash evidence and Master4's cycle comparison. Keep documented facts,
   frontend declarations, inferred sequence and unknown server rules distinct;
   no collection scripts/external login/domain calls are authorized by this step.
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

Record the analysis-guide review beside the current-state evidence. For each
screen/mode name the guide chapter and original source ID/link, known date or
version, relevant behavior, Sigma comparison and decision/gap. Do not mark a
video link as watched or import a reference calculation without confirmation.
Include the applicable sidebar/code cycle rows from Master4, with accepted,
excluded or unresolved differences against Sigma; a literal proxy method is
not evidence of a server invariant or financial posting effect.

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
