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
| 2 | Editor shape | UI block 13 decision rule (D4-2): fields only or one small child list without totals → modal; two or more collections, totals or posting → routed page. Then tabs/steps from the business groups, never field count |
| 3 | Route count | Routed editors have list/create/view/edit modes; dialog editors keep the list route only |
| 4 | Grid columns | Record the exact `DataTableColumn.field` order (with `type`), Actions first |
| 5 | ListVM scope | Displayed columns plus identity and real row-action state only |
| 6 | Add/Update scope | Client-editable inputs only; server-owned fields are excluded |
| 7 | Detail scope | Data rendered by the details UI only |
| 8 | Style ownership | Shared shell, components and global `--sigma-*` tokens own the look (UI blocks 1, 24); the feature keeps only its layout and real domain tokens; no cross-feature style dependency |
| 9 | Confirmation | Destructive or risky operations only |
| 10 | Dirty discard | Required for editable state; view and pristine state leave silently |
| 11 | Backend pattern | Choose the simplest valid pattern |
| 12 | Entity base class | Select the base matching persistence and subscription behavior |
| 13 | Duplicate key | Use the real business key, update excluding self, and a matching unique index |
| 14 | FK and delete checks | Validate every required FK and inventory every inbound delete reference |
| 15 | Filter contract | Documented keys (case-insensitive binding), clamped page size, `CountAsync` total; feature keys in `ApplyListFilters` |
| 16 | Translations | Matching keys in English and Arabic |
| 17 | Service registration | `providedIn: 'root'`; API URLs on `environment.baseUrl` (the one interceptor-enabled `HttpClient`, UI block 1) |
| 18 | Migration | Entity or EF changes require owner-run migration; reviewers never generate it automatically |
| 19 | Reference action coverage | Inventory every reference action and explicitly classify it; no silent omissions |
| 20 | Override audit | List every target-service override and its feature-specific reason; inherit when no reason exists |
| 21 | Maintenance/evolution plan | Broad or cross-cutting changes with ambiguous/current behavior must have a Frozen Maintenance / Evolution Plan before implementation; unresolved required decisions remain Blocked |
| 22 | Child collection contract | Full snapshot (D4-3): every row sent, saved rows with their id, missing rows removed |
| 23 | Money and VAT | Server totals; VAT per tax rate on the document, rounded once (D4-4) |
| 24 | Authorization candidates | Actions needing a permission listed with their endpoints (UI block 26) |
| 25 | Business correctness | Every recommended rule states its business reasoning (block 1) |

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

The quotation/action failure-prevention register lives with the quotation action cycle (UI
block 7).

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

### Artifact status and closure (G3, 2026-10-01)

Every artifact starts with the status table: `Status` is one of Draft, Frozen, Blocked,
Implemented — source-only, Closed, and `Owner verification pending` is yes or no. Free text
such as "implemented and source-reviewed" is not a status.

A Frozen contract is a hand-off, not a deliverable. An implementation task closes only with
its review or reconciliation artifact, the block 7 report, the shared-extraction result
(block 5) and the learning-protocol rows. An artifact never cites a file that does not exist
yet; it names the file it will create as *pending*. Source: `reviews/COMPANIES_PARALLEL_IMPLEMENTATION_FEATURE_REVIEW.md` D3.

---

