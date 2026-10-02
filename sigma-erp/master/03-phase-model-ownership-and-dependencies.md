## 3. Phase model, ownership, and dependencies

Use only the phases applicable to the feature, but never omit Phases 0 and 6 for
a broad review or implementation.

When the request meets the Maintenance / Evolution Plan trigger in block 1, run
`PLAN-00-maintenance-evolution` first. Phase 0 consumes the Frozen plan; it does
not reopen its target decisions unless new source evidence creates a conflict.

| Phase | Name | Primary purpose | Depends on |
|---|---|---|---|
| 0 | Discovery and Evidence | Establish scope, evidence, shapes, and initial contracts | Requirements and source |
| 1 | Domain, Persistence, and API | Establish server invariants and authoritative contracts | Phase 0 |
| 2 | Read Path and Grid | Verify filter-to-query-to-row behavior | Phase 0 and Phase 1 read contracts |
| 3 | Detail and Write Path | Verify detail, form, payload, persistence, and exit behavior | Phase 0 and Phase 1 write contracts |
| 4 | Domain Actions and State Transitions | Verify risky or stateful actions across layers | Phase 1 and owning UI phase |
| 5 | Integration and Runtime Wiring | Verify routes, providers, interceptors, events, and async lifecycle | Phases 1 through 4 as applicable |
| 6 | Final Reconciliation | Prove cross-phase consistency and review the scoped diff | Every applicable prior phase |

### Phase 0 — Discovery and Evidence

Owns requirements, screenshot extraction, scope, shape selection, references,
action inventory, and the initial contract map. It does not implement fixes or
make unsupported business decisions.

### Phase 1 — Domain, Persistence, and API

Owns entities, EF configuration, tenant isolation, DTOs, mappings, validation,
transactions, calculations, endpoint semantics, error contracts, uploads, and
migration impact. It excludes UI layout and component selection.

### Phase 2 — Read Path and Grid

Owns headers and filters that affect the read path, exact query keys, paging,
sorting, ListVM scope, Grid columns, row rendering, read loading/error/empty
states, cancellation, export, refresh/page retention, and query performance. It
adopts the shared list pieces (UI blocks 1, 4, 6, 8; backend `ApplyListFilters`). It does not own
Add/Update payloads or editor validation.

### Phase 3 — Detail and Write Path

Owns editor shape and mode behavior, Detail/Add/Update contracts, typed forms,
validation parity, Save, Cancel, dirty-state handling, child collections,
documents, uploads, typed nested dialogs, reconciliation, and write recovery. It
adopts the shared editor pieces (editor shell, `EditableRows`, `app-field-error`,
`DocumentUploadTracker`; the block 13 modal-or-page rule). It does not own list paging or
independent domain transitions.

Stepper, modal tabs, documents, and child collections are conditional shapes,
not requirements for every editor.

### Phase 4 — Domain Actions and State Transitions

Owns Delete, activate/deactivate, approve/unapprove, post/unpost, void,
finalize, remove-child, and comparable transitions. It verifies visibility,
server authorization, state preconditions, confirmation or typed input, busy
protection, concurrency, idempotency, recovery, and refresh. A posted financial document is
voided or credited, never deleted (backend block 15, decision J-1 pending).

Before implementing Phase 4, inventory **every public domain action** exposed by
the approved reference across its interface, service, controller, Angular
service, and owning action menu. Classify every row as Supported, Not Applicable,
Missing, or Conflicting with evidence. A reference action may be excluded when
the target domain genuinely lacks its state or dependency, but it must never be
silently overlooked. Phase 4 is not complete until each Supported row has a
single end-to-end vertical slice and every excluded row has a recorded reason.

This phase is conditional. Ordinary Save stays in Phase 3. Search, paging, and
Export stay in Phase 2. Their owning phases still apply the shared lifecycle
rules.

### Phase 5 — Integration and Runtime Wiring

Owns lazy routes, mode data, providers, interceptor-enabled clients,
authentication headers, standalone imports, shared dialog registration,
translations, parent/child events, cancellation, cleanup, deep links, and
compatibility with existing consumers.

### Phase 6 — Final Reconciliation

Owns the final contract comparisons, full scoped diff review, outstanding
decision register, verification status, risks, migration instruction, and final
report. Frontend reconciliation must also enforce the UI Pattern Book's
application-wide visual consistency invariant: repeated controls of the same UI
role must use their canonical shared component/appearance/tokens, and a scoped
feature cannot close with a feature-local visual fork for tabs, dropdowns,
buttons, inputs, filters, tables, dialogs, confirmations, loading/error states,
RTL, or dark-theme treatment unless the UI Pattern Book names a deliberate
shape-specific exception. It must not introduce unrelated refactors.

### Parallel review

Phases 2 and 3 may run in parallel only after Phase 1 freezes their consumed
contracts. A phase reviewer may report a contract defect to its owner but may
not silently redefine the contract.

### Split frontend/backend review workflow

For a broad feature whose frontend and backend have non-overlapping file
ownership, use this canonical split-review sequence:

The workflow call name is **Contract-First Split Review**.

```text
Shared discovery
    ↓
Freeze API contract
    ↓
Backend review  +  Frontend review
    ↓
Combined final reconciliation
```

The stages map to the phase model as follows:

| Stage | Required work and output |
|---|---|
| Shared discovery | Complete Phase 0 once for both layers. Produce one Feature Review Manifest, evidence classification, scoped file list, workflow/action inventory, approved shape selections, and unresolved-requirement list. |
| Freeze API contract | Complete the applicable Phase 1 decisions before either layer reviews implementation. Produce one Frontend/Backend Contract Handoff containing the exact routes and methods, request and response fields, nullability, validation and error behavior, action-state rules, calculation ownership, and runtime or migration impact. |
| Backend review | Review the entity, EF configuration, DTOs, mapping, service, controller, validation, ownership, state transitions, persistence, and domain calculations against the frozen handoff. |
| Frontend review | Review routes, providers, services, TypeScript models, grids, forms, payloads, loading and error handling, translations, accessibility, RTL, theme, and responsive behavior against the same frozen handoff. |
| Combined final reconciliation | Complete Phase 6 across both outputs. Reconcile every field, route, action, validation rule, calculation, and integration point; neither layer may declare the overall feature complete independently. |

The Frontend/Backend Contract Handoff must contain at least:

| Contract item | Required content |
|---|---|
| Status | `Frozen`, or `Blocked` with the exact missing decision. |
| API operations | Exact route, HTTP method, and purpose for every list, detail, write, select, export, and domain-action operation in scope. |
| Request contracts | DTO name, client-editable fields, types, nullability, validation, and omitted server-owned fields. |
| Response contracts | DTO name, returned fields, types, nullability, list/grid use, and action-state properties. |
| Failure behavior | Business-failure response, HTTP-error behavior, and validation message ownership. |
| Domain ownership | Backend-owned calculations, state transitions, child reconciliation, tenancy/ownership checks, and duplicate rules. |
| Integration impact | Route/provider/interceptor requirements and whether an entity/configuration change requires an owner-created migration. |

Backend and frontend reviews may run concurrently only while this handoff is
`Frozen`. If either review finds that the contract is missing, conflicting, or
incorrect, stop the affected work, reopen Phase 1, refreeze the handoff, mark
dependent findings or changes stale, and rerun their checks. Reviewers must not
invent different layer-specific contracts.

---

