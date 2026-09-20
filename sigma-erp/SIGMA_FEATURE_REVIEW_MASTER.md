# Sigma Feature Review Master Guide — Canonical

| | |
|---|---|
| Status | **Canonical.** Binding for Sigma feature review and implementation orchestration |
| Version | 1.5 |
| Last verified against documentation system | 2026-08-16 |
| Verification | Documentation structure and source inspection only |

This guide defines how a Sigma feature is scoped, reviewed, implemented, and
reconciled across Angular and .NET. It owns global review rules and contract
invariants. It does not duplicate platform implementation recipes.

The following canonical pattern books are incorporated into authority level 1:

- `SIGMA_UI_PATTERNS.md` — Angular implementation patterns.
- `SIGMA_BACKEND_PATTERNS.md` — .NET, persistence, and API patterns.

When this guide states a global invariant and a pattern book supplies the
implementation, both apply. Generated phase and task packets are derivative
artifacts selected from these authorities.

## Authority order

Use this order for every decision:

1. This Master Guide and the applicable canonical pattern-book blocks.
2. The applicable generated phase or task packet.
3. The approved project reference named for the specific UI or backend shape.
4. Screenshots, for functional requirements and visible content only.
5. Reviewer inference, only when labelled and supported by evidence.

If a generated packet conflicts with a canonical source, stop using the packet,
report drift, and use the canonical source. If a canonical snippet conflicts
with current source, current source wins for factual behavior; report the guide
drift instead of silently changing the rule.

## Document roles

| Document | Role | May define new authority? |
|---|---|---|
| This Master Guide | Global review process and contract invariants | Yes |
| UI and backend pattern books | Platform implementation patterns | Yes |
| Generated phase packets | Bounded review procedures and required outputs | No |
| Generated task recipes | Linear implementation procedures for a task shape | No |
| Approved project references | Concrete examples of an approved pattern | No |
| Screenshots and videos | Functional evidence | No |
| Review artifacts | Feature-specific decisions and traceability | No |

## Contents

1. [Governance and review principles](#1-governance-and-review-principles)
2. [Screenshot and visual evidence policy](#2-screenshot-and-visual-evidence-policy)
3. [Phase model, ownership, and dependencies](#3-phase-model-ownership-and-dependencies)
4. [Required decisions, artifacts, and contract invariants](#4-required-decisions-artifacts-and-contract-invariants)
5. [Continuous quality gates](#5-continuous-quality-gates)
6. [Human and AI review protocol](#6-human-and-ai-review-protocol)
7. [End-to-end reconciliation and final report](#7-end-to-end-reconciliation-and-final-report)
8. [Packet generation and governance](#8-packet-generation-and-governance)

---

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

## 2. Screenshot and visual evidence policy

Screenshots may be used only as a source of functional and content requirements.

### Permitted evidence

Use screenshots to identify:

- visible data fields;
- screenshot-visible values missing from the current Grid contract;
- filters and search inputs;
- form fields;
- tabs and logical business sections;
- available actions in the captured state;
- statuses and clearly demonstrated state-dependent behavior;
- labels, business terminology, and information hierarchy;
- user workflows clearly demonstrated by a sequence of screenshots.

### External rental simulation reference — Speed Auto Systems

Sigma Rental features simulate the demonstrated business workflows of Speed
Auto Systems. Use the following demo tenant as an external functional reference
when a Rental requirement asks to reproduce, compare, or complete a workflow:

| Item | Demo access |
|---|---|
| Application | `https://app.speedautosystems.com` |
| Booking workflow | `https://app.speedautosystems.com/Application#/tenant/crs/bookings` |
| Username | `info.kew.office@gmail.com` |
| Password | `Test@123` |
| Data classification | Demo account; no real production data |

Treat the application as behavioral evidence for visible fields, terminology,
filters, actions, state-dependent workflows, calculations, reports, and
accounting outcomes. Inspect the complete relevant workflow and its alternate
states when the requested feature depends on them. Use read-only inspection by
default; do not create, change, or delete external demo data unless the user
explicitly places that mutation in scope.

Speed Auto Systems is not implementation authority. Sigma must simulate the
confirmed business behavior through the canonical Sigma Angular and .NET
patterns, current source contracts, reusable controls, validation, RTL/theme
rules, and Sigma accounting architecture. Do not copy its page layout, source
architecture, API contracts, permissions, database design, or journal-entry
structure without confirming each requirement against Sigma source and the
applicable canonical guides. If the reference conflicts with Sigma authority,
preserve the confirmed business requirement using the approved Sigma pattern
and record the conflict or inference in the feature evidence table.

### Screenshots are not implementation authority

Screenshots must not override the Master Guide, canonical pattern books, or the
applicable packet for:

- layout structure;
- component selection;
- Grid implementation;
- form architecture;
- dialog structure;
- buttons and icons;
- colors and spacing;
- typography;
- loading and error states;
- pagination;
- validation presentation;
- responsive behavior;
- accessibility;
- RTL and theme behavior.

A screenshot may prove that three logical groups exist. It does not decide
whether the approved implementation uses tabs, steps, sections, accordions, or
routed children.

### Screenshots do not prove completeness

A screenshot proves only what was visible in one captured state. It does not
prove that:

- every field, column, or action is visible;
- an absent source column should be removed;
- an action is available to every role;
- a disabled action is permission-controlled;
- a field is required;
- a column is filterable, sortable, or exported;
- the captured screen is the current product version.

Treat visible actions and fields as minimum evidence for the captured state, not
as an exhaustive contract.

### Conflicts

When a screenshot conflicts with an authoritative guide:

1. Follow the guide for design and implementation.
2. Preserve the business requirement demonstrated by the screenshot.
3. Explain how that requirement is represented using the approved pattern.

### Evidence classifications

Classify every extracted item:

| Classification | Meaning | Implementation rule |
|---|---|---|
| Explicit | Directly visible or demonstrated | May be implemented after its contract is confirmed |
| Strong inference | Necessary to support clearly visible behavior | May be proposed; evidence and reasoning are required |
| Uncertain | Plausible but not sufficiently demonstrated | Do not implement automatically; record it as unresolved |

A static screenshot provides weak evidence for transitions. Classify
state-dependent behavior as Explicit only when multiple states, a visible
status/action relationship, or supporting workflow evidence demonstrates it.

### Screenshot metadata

Record, when known:

- evidence ID and file name;
- feature and screen;
- create, edit, view, list, report, or workflow state;
- locale and text direction;
- approximate viewport or device class;
- user role;
- capture date or product version;
- current acceptance reference versus historical behavior;
- related screenshots, video, or written notes.

Unknown metadata must be marked Unknown, not inferred.

### Functional Evidence Table

Produce one table per screenshot. Add an Evidence ID column when several
screenshots are used.

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| | | | | |

### Column Contract Table

For Grid screenshots, also produce:

| Visible label | Proposed field | Source DTO field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

`Proposed field` is a candidate binding, not a confirmed contract. Record one of
these values with the row:

- Confirmed — a source model and API property exist.
- Derived — the value can be deterministically derived from confirmed fields;
  name the derivation owner.
- Missing — no confirmed source contract exists.
- Conflicting — screenshot, frontend, and backend disagree.

Filterable, Sortable, and Exported must be confirmed by source, an authoritative
rule, or explicit interaction evidence. A visible column alone is insufficient.

### Missing screenshot contracts

Never invent a backend field because a value appears in a screenshot.

When no confirmed API or DTO field exists:

1. Mark the source contract Missing.
2. State whether the value could be derived from existing fields.
3. Identify the exact entity, DTO, endpoint, or business decision required.
4. Do not silently add the value to a model or payload.

---

## 3. Phase model, ownership, and dependencies

Use only the phases applicable to the feature, but never omit Phases 0 and 6 for
a broad review or implementation.

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
does not own Add/Update payloads or editor validation.

### Phase 3 — Detail and Write Path

Owns editor shape and mode behavior, Detail/Add/Update contracts, typed forms,
validation parity, Save, Cancel, dirty-state handling, child collections,
documents, uploads, typed nested dialogs, reconciliation, and write recovery. It
does not own list paging or independent domain transitions.

Stepper, modal tabs, documents, and child collections are conditional shapes,
not requirements for every editor.

### Phase 4 — Domain Actions and State Transitions

Owns Delete, activate/deactivate, approve/unapprove, post/unpost, void,
finalize, remove-child, and comparable transitions. It verifies visibility,
server authorization, state preconditions, confirmation or typed input, busy
protection, concurrency, idempotency, recovery, and refresh.

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

## 4. Required decisions, artifacts, and contract invariants

### Feature Review Manifest

Create a manifest before detailed review with:

- feature name and requested outcome;
- source directories and directly related contracts;
- existing working-tree changes and their owner when known;
- screenshots, videos, notes, and evidence IDs;
- selected UI shapes and backend pattern;
- approved reference per shape;
- routes and modes;
- endpoints and response wrappers;
- action inventory;
- known permission mechanism;
- applicable phases and packets;
- explicit exclusions;
- unresolved requirements and required source of truth.

### Required decisions

Make every applicable decision before writing code. Record its evidence.

| # | Decision | Rule |
|---|---|---|
| 1 | Canonical reference | Select per UI or backend shape, never one reference per whole feature |
| 2 | Editor shape | Decide from business groups, child collections, and parent-context needs, never field count |
| 3 | Route count | Routed editors have list/create/view/edit modes; dialog editors keep the list route only |
| 4 | Grid columns | Record exact `colName` order with Actions first |
| 5 | ListVM scope | Displayed columns plus identity and real row-action state only |
| 6 | Add/Update scope | Client-editable inputs only; server-owned fields are excluded |
| 7 | Detail scope | Data rendered by the details UI only |
| 8 | Style ownership | Feature-owned prefix and structural/semantic tokens; shared global primary tokens; no cross-feature style dependency |
| 9 | Confirmation | Destructive or risky operations only |
| 10 | Dirty discard | Required for editable state; view and pristine state leave silently |
| 11 | Backend pattern | Choose the simplest valid pattern |
| 12 | Entity base class | Select the base matching persistence and subscription behavior |
| 13 | Duplicate key | Use the real business key, update excluding self, and a matching unique index |
| 14 | FK and delete checks | Validate every required FK and inventory every inbound delete reference |
| 15 | Filter contract | Exact key casing, clamped page size, `CountAsync` total |
| 16 | Translations | Matching keys in English and Arabic |
| 17 | Service registration | Requests must use the interceptor-enabled `HttpClient` scope |
| 18 | Migration | Entity or EF changes require owner-run migration; reviewers never generate it automatically |
| 19 | Reference action coverage | Inventory every reference action and explicitly classify it; no silent omissions |
| 20 | Override audit | List every target-service override and its feature-specific reason; inherit when no reason exists |

### Grid and ListVM contract

Write the lists beside each other:

| Grid column or action need | Frontend property | Backend ListVM property | Contract status |
|---|---|---|---|
| Identity/action target | `id` | `Id` | |
| | | | |

Name every field removed from an oversized ListVM. Do not include tenant, audit,
delete, approval, calculated-write, editor-only, dropdown-only, or compatibility
fields unless a displayed row or action genuinely consumes them.

### Filter contract

| UI control | Angular filter property | Serialized query key | Backend lookup key | Parser/type | Default behavior |
|---|---|---|---|---|---|
| | | | | | |

Key casing is contractual. Verify absence, false, zero, empty string, date, enum,
and multi-select behavior explicitly.

### Detail and write contract

| UI control or view field | Form control type | Detail DTO | Add DTO | Update DTO | Server-owned? | Validation owner |
|---|---|---|---|---|---|---|
| | | | | | | |

The client must not send subscription, document number, audit, delete, approval,
or calculated total fields unless an explicit contract says the user owns them.

### Action-state contract

Complete both tables before Phase 4 implementation. Do not infer coverage from
method names or from one screenshot menu.

| Approved-reference action | Target status | Evidence or exclusion reason |
|---|---|---|
| | Supported / Not Applicable / Missing / Conflicting | |

Every public action in the approved reference must appear once. `Not Applicable`
requires a domain reason such as a missing down-payment or receipt aggregate;
"not in the screenshot" is insufficient when written requirements or current
source demonstrate the action.

| Action | Exact source state | Exact target state | ListVM status/flag | Backend interface/service | Controller verb/route/payload | Angular service | UI interaction | Dependency/concurrency rule | Failure and refresh |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

For split state fields, write the complete tuple on both sides, for example
`Internal=Approved, Customer=Pending`; never document or validate one axis while
leaving the other implicit. A Supported row is incomplete if any vertical-slice
cell is blank.

### Override-justification contract

| Inherited virtual method | Override in target? | Exact feature-specific reason | Inherited behavior if not overridden |
|---|---|---|---|
| | Yes / No | Validation, aggregate reconciliation, dependency-aware delete, projection, or confirmed transition need | |

An override whose body only calls `base`, delegates to another override, or
returns the same inherited behavior is prohibited. The scoped reconciliation
must search the target service and controller for `override` and remove every
row without a recorded reason. Do not copy redundant overrides from a reference.

### Quotation/action failure-prevention register

| Failure seen in review | Root cause | Mandatory prevention |
|---|---|---|
| Customer approve/reject or Revise is absent | Reference inspected partially or only the screenshot menu was copied | Complete the reference-action inventory across backend and Angular before implementation |
| Action exists in one layer only | No vertical-slice reconciliation | Require every Supported action to fill every action-state contract column |
| Redundant `DetailAsync`/`GetManyWithNavigationsAsync` or controller override | Reference methods copied for symmetry | Complete the override-justification table and inherit any row without distinct behavior |
| Action appears in the wrong state | One status field was checked while another approval axis was implicit | Freeze and validate the complete source and target state tuples |
| Backend explains a blocked transition but UI shows a generic error | Non-2xx `Result` body was ignored | Recover safe `error.message` from the HTTP error payload before the translated fallback |
| Unapprove passes a dependency pre-check while a dependent record is created concurrently | Separate dependency query was assumed atomic with the update | Record an isolation/invariant strategy or disclose the residual race |
| Sales-only downstream action is copied into another quotation | Reference parity was confused with domain parity | Classify the action Not Applicable with concrete missing-domain evidence; never add a no-op |

Visibility is not authorization. If the app has no authorization mechanism, do
not invent one and do not describe a hidden control as secured.

### Route and integration contract

| Route or dialog | Mode source | Detail requirement | Exit behavior | Provider/interceptor path | Parent refresh |
|---|---|---|---|---|---|
| | | | | | |

### Contract status

Use these statuses consistently:

- Confirmed — supported by authoritative source.
- Derived — deterministic and owned; the derivation is named.
- Not Applicable — a reference behavior is understood but the target lacks its
  required domain state or dependency; the concrete evidence is recorded.
- Missing — required behavior has no contract.
- Conflicting — authoritative consumers disagree.
- Uncertain — evidence is insufficient; do not implement automatically.

---

## 5. Continuous quality gates

These gates apply during every phase and are audited again in Phase 6. They are
not a late cosmetic review.

### Type and contract safety

- No `any` for feature contracts, forms, dialog results, or payloads.
- Models, services, forms, templates, and endpoints agree on nullability and
  enum representation.
- Server-owned values are not trusted from the client.
- Response wrappers are typed and both failure channels are handled.
- A non-2xx response carrying the standard `Result` preserves its safe business
  message instead of being reduced to a generic transport error.

### Error and async behavior

- Handle `isSuccess: false` and the HTTP `error` callback.
- Preserve actionable server messages when safe.
- Do not use silent error handlers.
- Prevent double execution.
- Cancel or ignore stale reads.
- End loading state on success, declared failure, transport failure, and cancel.
- Define recovery and retained user state.

### Security and authorization

- Authentication headers come from the correct interceptor-enabled client.
- Backend boundaries validate tenant ownership, existence, authorization,
  state transitions, and business invariants.
- UI visibility is presentation only.
- Validate upload type, size, path handling, replacement, and abandoned files.

### Translation and terminology

- Add every new key to English and Arabic in the matching feature block.
- Use exact template casing.
- Preserve business terminology from evidence while implementing it with the
  approved component pattern.
- Localize user-facing validation, loading, empty, and error content.

### Accessibility and focus

- Use labels, semantic controls, and meaningful accessible names.
- Support keyboard operation and visible focus.
- Manage initial focus and return focus for dialogs.
- Use correct tab, dialog, table, and validation semantics.
- Do not encode meaning using color alone.

### RTL, theme, and responsive behavior

- Prefer logical CSS properties unless a physical placement is an explicit
  product requirement.
- Verify both directions and supported themes in source.
- Feature styles own their prefix and structural/semantic tokens; the global
  Sigma primary action tokens are consumed rather than redeclared.
- Body-appended overlays receive appropriately scoped global styling.
- Responsive behavior is defined by the guide/reference, not copied from a
  fixed screenshot viewport.

### Performance and data behavior

- Project only required read fields.
- Avoid N+1 queries and unnecessary detail payloads.
- Use stable ordering with paging.
- Define large child-collection behavior.
- Do not load all pages merely to simulate server paging.

### Compatibility and change discipline

- Check all direct consumers before narrowing a shared contract.
- Keep Transitional behavior only where the pattern book requires current
  architecture compatibility.
- Never copy Legacy patterns.
- Report schema migration and API compatibility effects.

---

## 6. Human and AI review protocol

### Packet input contract

Every phase task must receive:

- the Feature Review Manifest;
- applicable evidence rows;
- confirmed upstream contract artifacts;
- files in scope;
- the applicable generated packet;
- approved reference paths;
- unresolved requirements;
- explicit permissions to review or implement.

A weak model must not be expected to discover rules owned only by another packet.
Each packet therefore repeats a compact authority capsule, required upstream
artifacts, continuous gates, and escalation conditions.

### Reviewer boundaries

A phase reviewer may:

- inspect directly related producers and consumers;
- identify a cross-phase mismatch;
- propose a contract change to the owning phase;
- implement an authorized change inside its scope.

A phase reviewer may not:

- invent a missing API or field;
- silently change an upstream contract;
- infer authorization from visibility;
- mark a feature complete;
- implement an Uncertain requirement;
- modify an approved reference outside scope.

### Finding format

Every material finding records:

| Field | Required content |
|---|---|
| Finding | Concrete defect or contract mismatch |
| Evidence | Source path, contract row, evidence ID, or authoritative rule |
| Owner | Primary phase responsible for resolution |
| Consumers | Phases or files affected downstream |
| Severity | Correctness, security, contract, behavior, accessibility, or consistency impact |
| Confidence | Confirmed, strong inference, or uncertain |
| Resolution | Required change or exact unresolved decision |

### Handoff rules

- Phase outputs are artifacts, not prose-only summaries.
- Downstream reviewers consume frozen tables rather than rediscovering fields.
- A changed upstream contract invalidates affected downstream reviews.
- Mark the affected artifacts stale and rerun their checks.
- Contradictions go to Phase 6; they are not resolved by whichever reviewer ran
  last.

### Calling the Contract-First Split Review

Use one of the following invocation methods. Replace the placeholders and state
whether the task is `review only` or `review and implement confirmed changes`.

#### One-task orchestration

Use this when one accountable reviewer will coordinate the complete workflow:

```text
Run a Contract-First Split Review for <Feature>.

Scope:
- Frontend: <Angular feature path>
- Backend: <directly related .NET feature paths>
- Mode: <review only | review and implement confirmed changes>

1. Perform shared Phase 0 discovery once and produce the Feature Review
   Manifest, evidence tables, scoped files, approved shapes, and unresolved
   requirements.
2. Complete Phase 1 and freeze one Frontend/Backend Contract Handoff before
   splitting the review.
3. Review the backend and frontend independently against that frozen handoff.
   Parallelize only when ownership is non-overlapping and the guide's delegation
   gate is satisfied.
4. If either side finds a contract conflict, reopen Phase 1 and refreeze before
   continuing affected work.
5. Run one combined Phase 6 reconciliation and provide the required final
   report. Neither layer may be declared complete by itself.
```

The short form is:

```text
Run a Contract-First Split Review for <Feature> in <review only | review and
implement confirmed changes> mode. Frontend: <path>. Backend: <paths>.
```

#### Separate-task orchestration

Use four ordered tasks when frontend and backend reviews must be performed in
separate conversations or assigned to separate owners. Do not start Tasks 2 and
3 until Task 1 returns a `Frozen` handoff.

**Task 1 — shared discovery and contract freeze**

```text
For <Feature>, run shared Phase 0 discovery and Phase 1 contract freeze only.
Scope frontend <path> and backend <paths>. Produce the Feature Review Manifest,
evidence tables, approved shape selections, unresolved requirements, and one
Frontend/Backend Contract Handoff. Mark it Frozen or Blocked. Do not start the
layer implementation reviews.
```

**Task 2 — backend review**

```text
Review <or review and implement> the backend of <Feature> at <paths> against the
attached Frozen Frontend/Backend Contract Handoff. Own backend files only. Do
not redefine the contract; report any conflict that requires Phase 1 to reopen.
Return backend findings, changes, risks, and the contract checks needed by final
reconciliation.
```

**Task 3 — frontend review**

```text
Review <or review and implement> the frontend of <Feature> at <path> against the
attached Frozen Frontend/Backend Contract Handoff. Own frontend files only. Do
not redefine the contract; report any conflict that requires Phase 1 to reopen.
Return frontend findings, changes, risks, and the contract checks needed by
final reconciliation.
```

**Task 4 — combined final reconciliation**

```text
Run Phase 6 combined final reconciliation for <Feature> using the Frozen
Frontend/Backend Contract Handoff and the completed backend and frontend
outputs. Resolve or classify every mismatch, review the complete scoped diff,
and provide the Master Guide final report. Do not treat either layer's report as
overall completion.
```

### Human review

Human reviewers may combine phases, but they must still produce the same
contract artifacts and final reconciliation. Combining attention does not remove
ownership or evidence requirements.

---

## 7. End-to-end reconciliation and final report

Phase 6 compares every applicable path.

### Mandatory comparisons

- Screenshot evidence ↔ implemented functional behavior.
- Grid columns and action needs ↔ frontend list model ↔ backend ListVM.
- Filter controls ↔ serialized keys ↔ backend exact lookup keys.
- Page request ↔ `CountAsync` total ↔ response metadata ↔ Grid pager state.
- View fields ↔ Detail DTO.
- Form controls ↔ Add/Update DTOs ↔ server ownership rules.
- Save flow ↔ validation ↔ transaction ↔ response ↔ close/refresh.
- Actions ↔ backend authorization/state rules ↔ confirmation/input ↔ recovery.
- Approved-reference action inventory ↔ target classification ↔ complete
  backend-to-UI vertical slice for every Supported action.
- Override-justification table ↔ every scoped service/controller `override`.
- UI visibility ↔ actual authorization mechanism.
- Service error behavior ↔ component failure behavior.
- Routes/modes ↔ editor shape and exit behavior.
- Upload UI ↔ Media/API/storage/cleanup contract.
- Translation keys ↔ English and Arabic.
- Feature styles ↔ local ownership, RTL, theme, overlay, and responsive rules.
- Providers ↔ interceptor-enabled client and authentication header path.

### Source-only diff review

Before completion:

- review the complete scoped diff;
- check stale imports, types, routes, providers, and translations;
- check frontend/backend contract mismatches;
- check inappropriate mappings and server-owned payload fields;
- search scoped service/controller source for `override` and reconcile every
  match with the override-justification table;
- prove that every approved-reference action is classified and every Supported
  action has its route, payload, flag/status, UI interaction, translation,
  failure handling, and refresh path;
- check merge markers and whitespace errors;
- preserve unrelated changes;
- distinguish source verification from build, runtime, browser, and database
  verification.

### Final report

Report proportionally:

- files changed;
- phases applied and skipped, with reasons;
- evidence classifications and unresolved requirements;
- decisions taken and their evidence;
- contract tables or their final comparisons;
- frontend, backend, mapping, and calculation decisions;
- action and refresh behavior;
- migration requirement;
- possible compile/runtime risks;
- verification performed and verification pending;
- prohibited or owner-only commands not run.

Do not claim full feature completion while a Missing, Conflicting, or Uncertain
contract blocks required behavior.

---

## 8. Packet generation and governance

Generated packets live under `recipe-system/generated/`. Their templates and
source dependencies live in `recipe-system/templates/` and
`recipe-manifest.json`.

### Packet rules

- Generated packets are never edited directly.
- Each packet declares exact canonical source-block dependencies.
- Each packet carries source fingerprints.
- Run `Generate-SigmaRecipes.ps1 -Check` before using a packet.
- If check mode reports drift, use canonical sources and report the stale packet.
- Regeneration is followed by semantic review; a matching hash proves
  synchronization, not correctness.
- Packet templates contain process and required outputs, not competing
  architectural authority.

### Packet families

- `PHASE-*` packets guide bounded review phases.
- `RECIPE-*` packets guide implementation for a known task shape.

A feature may require several phase packets and one implementation recipe. Phase
packets establish and reconcile contracts; task recipes implement an approved
shape.

### Evolution procedure

1. Change the applicable canonical source.
2. Update dependencies or templates when semantics change.
3. Regenerate affected packets.
4. Run check mode.
5. Pilot material boundary changes on a simple list/modal feature, a routed
   aggregate editor, and a state-transition feature.
6. Compare missed, duplicate, and cross-phase findings.
7. Promote the change only after the master, canonical books, templates,
   generated packets, and workspace instructions agree.
