## 1. Governance and review principles

### One feature, several review paths

A phase is a review boundary, not an independent feature. No phase result may
silently redefine a contract owned by another phase, and no individual phase
completion means the feature is complete.

Every feature review must have:

- one explicit scope;
- one Feature Review Manifest;
- one owner for each contract;
- one consumer list for each cross-phase contract;
- evidence for every implemented requirement;
- a final reconciliation pass.

### Review the path, not only the layer

Review end-to-end paths:

- Read path: filter control → Angular query → API binding → backend query →
  response wrapper → grid row → pager or export.
- Write path: editor mode → detail response → typed form → payload → backend
  validation → transaction or save → success/failure → close and refresh.
- Action path: visibility → server authorization and state checks → confirmation
  or typed input → execution → busy protection → result → recovery and refresh.

A component-only or service-only finding is incomplete when correctness depends
on another layer.

### Scope and change discipline

- Review only the requested feature and directly related contracts and wiring.
- Preserve unrelated user changes.
- Inspect approved references but do not modify them unless explicitly scoped.
- Implement confirmed changes when implementation is requested.
- Do not implement uncertain screenshot requirements or invent missing APIs.
- Name the exact unresolved contract and the source file or business decision
  needed to resolve it.
- Keep existing architecture and business behavior unless an authoritative rule
  or explicit requirement demands a scoped change.

### Maintenance and evolution planning before implementation

Use a **Maintenance / Evolution Plan** before implementation when work changes or
extends an existing business capability instead of merely completing an already
frozen feature contract. The plan is mandatory when any of these are true:

- the requested behavior crosses more than one established feature or module;
- current business logic is incomplete, ambiguous, contradictory, or spread
  across several writers/readers;
- the change introduces a new shared concept such as currency, tax, numbering,
  approvals, pricing, inventory valuation, posting, or another cross-cutting
  domain rule;
- persistence/schema, historical data, migration, compatibility, or rollout
  behavior may change;
- a shared Angular/.NET contract, interceptor, service, component, or report
  calculation must change for several consumers;
- there is a meaningful choice between extending the existing design, refactoring
  it, replacing it, or creating a missing capability.

The planning sequence is:

1. **Define the requested outcome and boundaries.** Record the business result,
   explicit non-goals, affected user roles/workflows, and why the change is needed.
2. **Audit the existing state end to end.** Trace current entities/configuration,
   writers, readers, calculations, endpoints, Angular consumers, reports,
   permissions, tenancy, integrations, migrations, and related documentation.
   Record what already works and what is only partial or legacy.
3. **Create a Logic Ambiguity Register.** Every unclear rule is marked Confirmed,
   Derived, Missing, Conflicting, or Uncertain with the source/owner needed to
   resolve it. Implementation must never silently choose an Uncertain rule.
4. **Build the impact map.** Identify producers, consumers, persisted data,
   calculations, shared contracts, reports, background/integration paths, and
   deployment/data-migration effects that can be changed by the new capability.
5. **Classify each gap.** For every affected area choose `Keep`, `Extend`,
   `Refactor`, `Replace`, `Create`, or `Remove`, with evidence and a reason. Do
   not create a parallel path when extending or correcting the existing owner is
   the cleaner contract.
6. **Compare viable design options.** Record the alternatives that materially
   differ, their effect on business correctness, maintainability, compatibility,
   migration/data risk, complexity, and future extension. Select the target only
   after the trade-offs are reviewable.
   When an option changes business semantics rather than implementation shape,
   present the alternatives and consequences to the business/system owner and
   record the explicit decision; technical reviewers must not choose that policy
   by convenience or convention.
7. **Freeze the target contracts.** Define domain ownership, invariants,
   persistence, calculations/precision/rounding, API contracts, failure behavior,
   authorization/tenancy, UI workflow, reporting effects, and integration
   boundaries. Reuse the existing canonical patterns for implementation shape.
8. **Define migration and compatibility.** State how existing records behave,
   default/backfill rules, schema/API compatibility, rollout order, and any
   owner-run migration or data-correction step. Never assume old data is safely
   compatible merely because new fields are nullable.
9. **Split implementation into dependency-ordered slices.** Map each slice to
   Phases 0–6 and the owning contracts. Earlier slices must establish contracts
   needed by later consumers; no phase may invent a missing upstream decision.
10. **Define verification before coding.** Specify source checks, tests, runtime
    journeys, browser/UI checks, data/migration verification, reconciliation, and
    rollback/recovery evidence appropriate to the risk.
11. **Freeze or block the plan.** A plan is `Frozen` only when all decisions needed
    for the first implementation slice are Confirmed/Derived and its downstream
    impact is understood. Otherwise mark it `Blocked` with the exact decision or
    evidence still required.

The plan must produce an Existing-State Inventory, Logic Ambiguity Register,
Impact Map, Gap Decision Table, Option/Decision Matrix, Target Contract, Migration
and Compatibility Plan, dependency-ordered Implementation Plan, Verification
Matrix, Decision Review record, and Open Decisions Register. The generated `PLAN-00-maintenance-evolution`
packet and `MAINTENANCE-EVOLUTION-ARTIFACT.template.md` provide the reusable
workflow and document shape.

**Cross-cutting example — introducing currencies.** The plan must first discover
what Sigma already assumes about amounts before deciding implementation: base,
transaction and reporting currency roles; where currency is stored today; rate
source/date/type; decimal precision and rounding owner; whether original and base
amounts are persisted or derived; posting and document immutability rules;
opening-balance/JV/customer/supplier/report impact; revaluation and gain/loss
scope when applicable; UI selection/display; and the migration/default for
existing records. These are questions to resolve from Sigma's actual business
contracts, not preselected answers.

### Ownership is mandatory

Every concern must have one primary phase owner. Other phases may consume or
verify the contract, but they must not create competing rules.

| Concern | Primary owner | Required consumers |
|---|---|---|
| Entity, invariants, persistence, endpoint | Phase 1 | Phases 2, 3, 4, 5, 6 |
| Filter keys, paging, sorting, ListVM | Phase 2 | Phases 1 and 6 |
| Detail/Add/Update contracts and Save | Phase 3 | Phases 1 and 6 |
| Domain transition lifecycle | Phase 4 | Owning UI phase, Phase 1, Phase 6 |
| Routes, providers, interceptors, event wiring | Phase 5 | Phases 2, 3, 4, 6 |
| Screenshot evidence and unresolved requirements | Phase 0 | Every later phase |
| Cross-phase consistency and final status | Phase 6 | All phases |

Unclear ownership is a defect. Resolve it before implementation continues.

---

