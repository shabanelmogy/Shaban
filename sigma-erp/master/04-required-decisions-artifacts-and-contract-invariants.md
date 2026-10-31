## 4. Required decisions, artifacts, and contract invariants

### Feature Review Manifest

Create a manifest before detailed review with:

- feature name and requested outcome;
- source directories and directly related contracts;
- existing working-tree changes and their owner when known;
- screenshots, videos, notes, and evidence IDs;
- analysis-guide and original screen-explanation review (Master2): exact
  chapter/source IDs plus applicable dated sidebar/state/controller/service
  evidence, cycle/document links, Sigma comparison, accepted/excluded evidence
  and gaps, or a supported Not applicable outcome for the requested scope;
- selected UI shapes and backend pattern;
- approved reference per shape;
- routes and modes;
- endpoints and response wrappers;
- action inventory;
- known permission mechanism;
- applicable phases and packets;
- explicit exclusions;
- unresolved requirements and required source of truth.

### Reference-cycle comparison (Master2)

Keep the applicable comparison in the existing feature review/plan before
freezing or changing contracts; tier S needs only the changed element. Trace only
the relevant document chain and mark linked work outside scope explicitly. No
new standalone artifact or imported reference-product contract is required.

| Cycle step/document or affected element | Sidebar/screen/state and dated source | Evidence kind and file:line/hash | Reference claim | Actual Sigma owner/contract/topic | Accepted / Excluded / Missing / Conflicting / Uncertain / Not applicable | Decision or gap and reason | Owning phase and final disposition |
|---|---|---|---|---|---|---|---|
| | | Documented / frontend declaration / inferred sequence / unknown server rule | | | | | |

Snapshot-local screen/controller/service IDs are navigation aids, not substitutes
for reading their source. A positive comparison does not authorize importing a
financial, authorization or API rule absent from the frozen Sigma contract.

Apply Master2's reference-product functional detail target (owner2026-10-30).
Use the same review/plan to account for every relevant detail, at the requested
scope's granularity. Existing Sigma behavior is evidence of current coverage,
not a reason to discard a missing target capability. The owner must be able to
see what will reach equivalence and what still requires a decision:

| Reference field/group/filter/action/state/validation/link/charge/output | Dated source and evidence kind | Actual Sigma producer/consumer and guide | Coverage: matched / partial / missing / decision-blocked / owner-excluded | Required change or exact missing rule | Dependency-ordered slice / owner exclusion and reason | Final source disposition |
|---|---|---|---|---|---|---|
| | | | | | | |

These coverage labels supplement the contract-evidence statuses below; they do
not approve an unknown server or financial rule. Reuse existing rows when they
already contain these facts; no duplicate standalone artifact is required.

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
| 26 | Approval presentation and policy ownership | For a model with a real approval contract, freeze its steps, state/history source, eligible actions, tab and status-modal surfaces, and future Settings policy boundary (UI blocks 7 and 13). Do not infer approval for a model that lacks it |
| 27 | Document action log adoption | For a model exposing Log, record tracked/untracked write coverage, semantic action/reason ownership, tenant-checked root and related-child identities, view endpoint, shared read-only viewer, and historical-detail limits (BE18; UI7). The log does not authorize transitions or replace decision history |

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

**Downstream consumption is a separate status axis (owner 2026-10-22).** For each
source document, freeze the exact eligible source lines, downstream link, live/deleted
rules and capacity unit before showing Open, Partially Used, Closed and a percentage.
If the document has no positive eligible quantity, show No Quantity with no
percentage rather than a misleading Open. The server derives status from current
linked rows; it does not accept a status or percentage from a write DTO. A
cross-UOM document must not divide summed heterogeneous quantities; use a
documented line-wise measure. Filters execute before count, page and export.
Approval, source consumption and billing are independent: a fully converted
Purchase Request is not thereby invoiced. Billing labels Not Billed, Partially
Billed and Billed require a separately frozen posted-invoice linkage and
denominator for the owning model; do not infer them from a source conversion or
rename an existing bill-status enum without that contract. Purchase Request is
the first quantity-based example (BE14, BE9; UI4/5).

**Rejected downstream documents (owner 2026-10-22).** Freeze the consuming
approval states as part of each source-use contract. For Purchase Request →
Purchase Order, non-deleted Pending and Approved orders consume source quantity;
Rejected orders remain linked for history but release quantity and their
allocated source discount. Apply this one condition to the picker, remaining
capacity, saved status/percentage, filters and conversion write recheck. The
owner's 2026-10-24 unified lifecycle supersedes direct Approved-to-Rejected:
first perform guarded UnApprove, then reject the Pending order with a reason.
Rejection does not delete the source or order. Other
document chains must decide their own effective states before copying this rule.

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

For an approval-enabled model, record the current server-owned step/status and
history contract once. The saved editor's Approval tab and the list's separate
Approval Status modal, when both are requested, must read the same contract and
apply the same server eligibility to Approve/UnApprove/Reject controls. The modal is a
status and decision surface, not a second approval policy. Record the exact
step completion criteria, transition route, refresh behavior and any missing
legacy provenance. Future configurable approval rules belong to Settings **per
model**; the current UI must not imply that such a policy already exists. A
model without a persisted approval lifecycle does not acquire one merely to
match another screen's presentation.

Owner scope update (2026-10-21): target eventual approval coverage is **all ERP
documents**, including documents with no financial effect. Inventory each
document family and freeze its current operational effects before migration.
For a financial document, Save remains a draft and Approve owns the journal's
first posting; Void removes its effective ledger impact by marking the retained
source-owned journal voided, without a reversing journal, subject to period,
allocation and downstream-use guards. For a nonfinancial document, Approve is
a validated state transition. A separate Void is justified only when approval
created a real operational effect that must be canceled with an audit trail;
otherwise use the model's ordinary reject/cancel lifecycle, with no Void action.
Neither action invents a journal. Some documents may
need approval before stock, service, scheduling or downstream writes; determine
that boundary per model rather than assuming all effects are financial. Per-
model Settings rules are a future policy source, not a reason to expose unsafe
actions or change existing posting timing before the model's transition and
effect contract is complete. A broad rollout requires the PLAN-00 impact map
and phased, source-supported migration of each document family.

Owner vocabulary decision (2026-10-22): use Pending, Approved and Rejected
consistently when an ERP document adopts approval. Approve means an eligible
Pending document becomes Approved and releases its model-owned effect;
UnApprove means an eligible Approved document returns to Pending; Reject means
an eligible Pending document becomes Rejected. Owner clarification2026-10-24:
the unified adoption graph makes Rejected terminal and removes the former
Approved-to-Rejected correction shortcut; no reopening a rejected document.
Reject/UnApprove require a saved nonblank reason≤500, with previous/new status,
actor and time retained. This supersedes earlier PO correction examples, not
their historical artifacts. Freeze eligibility,
required reason, dependency/period guards, effect removal, saved history and
legacy provenance per document before exposing any button. A financial invoice
cannot be unapproved merely by changing its status while its journal or
settlement remains effective. An operational document cannot be unapproved by
status change alone while its stock or downstream effect remains effective.
Where undo is impossible, use the frozen Void/Cancel path instead. Approval
Status modal and tab share the server state and actions; the separate read-only
Log displays recorded writes. Future Settings policy remains per model.
The shared labels do not silently rename legacy persisted enum values;
each model documents its mapping and historical-row behavior.

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

