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
| 21 | Maintenance/evolution plan | Broad or cross-cutting changes with ambiguous/current behavior must have a Frozen Maintenance / Evolution Plan before implementation; unresolved required decisions remain Blocked |

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

