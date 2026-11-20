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

### External functional references

An external system the owner names as a functional reference (for example the Speed Auto Systems
demo for Rental workflows) is behavioural evidence only, never implementation authority. Its
access and usage notes are kept outside the governance book: `reviews/REFERENCE_SPEED_AUTO_SYSTEMS.md`.

### Speed first; Odoo fills missing or unclear concepts
Use the collected **Speed guide, explanations and dated frontend code as the
primary functional reference**. When a scoped concept, workflow or detail is
missing or unclear after reviewing its relevant Speed slice, consult the pinned
official **Odoo documentation as a complementary reference**. This applies to
concepts as well as fields, states, calculations and document relationships; it
does not make Odoo the first reference for merely similar features. The owner's
final instruction supersedes the earlier proposed overlap-based split.

Start at `references/speed-analysis/README.md`; the complementary collection,
scope, provenance, licence and comparison matrix are reached through
`references/odoo-rental/README.md`. Record the exact Speed gap, Odoo version/page,
what it establishes, and the resulting matched/partial/missing/conflicting/
decision-required/excluded row against actual Sigma source, frozen contract and
guide. Absence from one file or the curated collection is not proof of absence
from the external product.

These are functional evidence sources, not implementation authority. Preserve
Sigma's canonical shared owners and frozen contracts. Reference frontend code
alone does not establish server validation, permissions, accounting, concurrency
or complete DTOs; Odoo examples do not fill those contracts automatically. Record
conflicts and precise missing material decisions before dependent changes. Keep
the current scope and source-only/external-access/verification boundaries; a
reference lookup does not authorize implementation or broad collection.

### Reference-product functional detail target
The owner supplies the collected guide, explanations and frontend code of the
reference product because Sigma is being built to reach its functional detail.
For every new or reviewed screen, use the relevant reference slice as the target
for functional coverage, not merely optional inspiration or a list of names.
Inventory its fields and logical groups, filters, actions/dialogs, default row
order, state axes, validations, document links, charges/calculations and outputs,
to the extent the evidence actually establishes them. A default order the evidence
does not establish is recorded as a reviewer choice with its reason. Compare each relevant detail with the real
Sigma producer/consumer and its current guide in Master4's coverage rows.

A detail absent from current Sigma is a target gap to classify and plan. Its
absence, or an older deliberately minimal implementation, is not by itself a
reason to exclude it from the target. Record what is matched, partial, missing,
blocked by a precise decision, or explicitly excluded by the owner with the
reason. Carry accepted gaps into dependency-ordered implementation slices;
do not report reference equivalence while required details remain unaccounted
for. Tier S remains limited to its affected element; this rule does not broaden
an explicitly bounded task or automatically include every linked module.

This establishes the functional comparison target, not authority to copy the
reference's layout, controls or implementation. Sigma's canonical shared owners
still determine those. A frontend declaration does not reveal server validation,
permissions, complete DTOs, accounting or concurrency policy. Identify each
missing material rule and the exact owner decision/evidence needed before its
dependent implementation. Preserve current frozen contracts until explicitly
amended; do not silently replace their financial or operational effects.
Read-only reviews still report/plan gaps without editing application source;
implementation follows the task's authorization and frozen slice. All external
access, source-only execution and migration boundaries remain unchanged.

### Mandatory analysis-guide review before screen contracts
For every new screen and every review, maintenance, fix or refactor of an
existing screen, review the relevant analysis-guide section **before freezing
or changing the affected contracts**. Start at the documentation's
[analysis reference entry](../references/speed-analysis/README.md); select only
the chapters and original screen explanations related to the requested scope.
Do not preload the whole library. For an existing screen, also read its current
feature contract and existing Sigma user-guide topic when available.

The collected guide explains **Speed Auto Systems**, and is an analysis
reference for Sigma work, not a specification of existing Sigma behavior.
Follow a summary claim to its original screen explanation in the local library
or supplied source; record the source ID/link, chapter/topic, known date/version
and applicability. Video links alone are not reviewed video evidence.

In the existing feature review or plan, record the screen/mode, sources actually
read, relevant fields/filters/actions/states/validations and financial/workflow
constraints, then compare them with Sigma's current source and frozen decisions.
Distinguish directly documented behavior, declared features, reviewer proposals
and unresolved decisions; map usable evidence into Master2's classifications.
For a tier S task, a short row covering the changed element is sufficient.
Record a supported Not applicable outcome when no relevant explanation exists;
name missing or inaccessible material and any decision it leaves unresolved.
Missing reference content alone does not block independent source-supported
work; a missing material business/API/financial decision blocks only its
dependent contract under Master4.

This review is mandatory evidence discovery, not permission to implement all
guide features, adopt its proposed data model or copy its layout, API,
permissions or accounting treatment. Canonical Sigma patterns, frozen feature
decisions and explicit owner instructions retain their authority. Do not invent
an unavailable permission mechanism from a reference product. External browser
access, demo mutation, builds, tests and database work retain their existing
authorization boundaries; the local reference can be read without running the
external application. At handoff, reconcile the accepted evidence and exclusions
with the scoped result (Master7); creating/updating Sigma's in-app explanation
after implementation is a separate completion gate.

#### Sidebar and code cycle reference
The same mandatory gate includes the dated sidebar/JavaScript analysis reached
from the analysis reference entry. It complements the original explanations;
neither collection replaces the other. For a new or reviewed screen, identify
the relevant sidebar section, screen/state and business cycle, read that screen's
packet and the applicable cycle explanation, then follow only the code/controller,
dialog and service evidence needed for the affected fields/actions/documents.
For a tier S edit, the affected element is sufficient. Do not preload all sections
or make unrelated screens part of implementation merely because the cycle links them.

Before freezing/changing contracts, compare relevant predecessor/successor document
links, fields, actions, state axes, validations, billing/collection or stock/account
handoffs with actual Sigma owners, frozen decisions and its existing in-app topic.
Record the snapshot date, sidebar breadcrumb/state, screen/controller/service IDs
and source file:line/hash where relied on, evidence kind, applicability, Sigma
comparison, accepted/excluded items and remaining decisions in the existing review
or plan (Master4). IDs are scoped to their dated snapshot, not stable product IDs.
Record a supported Not applicable outcome for an absent/nonmatching slice; absence
alone does not block independent source-supported work. Reconcile the same rows
against the delivered scope at handoff (Master7).

Distinguish original documented behavior, observed frontend declarations/template
bindings, inferred cross-screen sequence and unresolved server rules. A literal
route, permission check, proxy method or local calculation proves its declaration
in that captured frontend; it does not prove runtime reachability, server validation,
permission enforcement, final state transition, DTO completeness, capacity or
accounting correctness. Mark those unsupported contracts Missing/Uncertain rather
than treating a declaration or inferred cycle as approved Sigma business behavior.
Keep duplicate registrations, unmatched calls, disabled/other-product branches and
known capture limitations visible when they affect a conclusion.

Use the local dated reference for routine reviews. This gate does not authorize
running its collection scripts, logging in again, calling domain APIs, copying
credentials, executing captured JavaScript or broadening browser/database/build/test
permissions. The owner request approves relocation and a review step, not automatic
implementation of Speed features, UI patterns, permissions or financial policies.

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

When the user's request explicitly places that item in scope, apply the next
section instead of stopping at Missing.

### Screenshot-backed scope from the user request

A screenshot alone never authorizes a new field, column, filter, action, or
workflow. A screenshot attached to a user request that **explicitly places the
missing business in scope** (for example: "refactor this screen and complete
the missing business shown in the screenshot") is the business decision for
what the screenshot proves, and only for that.

| What the item needs | Provable from the screenshot? | Status and owner |
|---|---|---|
| That the field, column, filter, action, section, or status exists; its business label; where it sits in the workflow | Yes, for Explicit items | **Approved requirement.** Phase 1 designs and freezes its contract (entity, EF configuration, DTOs, endpoint, mapping) through the owning backend pattern; Phases 2–4 implement it through the approved UI pattern |
| Data type, length, precision, required, default, uniqueness, validation, lookup source | No | **Missing** unless confirmed source, the approved reference, or the user supplies it. Phase 1 proposes a value; the user confirms. `approve reviewer assumptions` may accept a proposal only within the low-risk limits of `approve reviewer assumptions` (live companion section 2) |
| Calculation, state transition, edit/delete lock, numbering, accounting effect, access restriction, value for existing rows | No | **Missing** until the user decides. Use PLAN-00 when the decision changes existing behaviour |
| Items classified Strong inference or Uncertain | No | Out of scope unless the user names them |

Rules:

1. **Scope is literal.** "The missing business in the screenshot" covers the
   Explicit items of the attached screenshots, for the named screen and the
   captured states only. It does not extend to other screens, other states, or
   inferred behaviour.
2. **Record the decision.** Each approved item appears in the Functional
   Evidence Table with its screenshot evidence ID and the user request as the
   decision source (quoted, with date).
3. **Persistence.** A new persisted field is a schema change: follow the
   migration boundary in Master7 and record the migration or its proposed name. State the
   default or backfill for existing rows; if the user has not given one, it is
   Missing.
4. **Refactoring an existing screen keeps existing behaviour.** A field, column,
   or action that current source provides but the screenshot does not show is
   kept (see *Screenshots do not prove completeness*). Removal needs an explicit
   user instruction.
5. **The screenshot does not choose the pattern.** Its layout does not select
   the screen type, the editor shape, or the controls; choose the screen type in
   the UI book's `ui/screens/00-catalog.md` and represent every approved item
   through that type's blocks.
6. **Owner standing decision for Missing detail (2026-09-28).** The owner
   ruled: "when business is missing, bring it to the closest correct thing that
   exists, or create a new one", and "answer any question with what you judge
   best". So a Missing item from the two middle rows of the table above does not
   stop the work. The reviewer:
   - chooses the closest correct option that current source supports (an
     existing entity, relation, setting, or reference pattern), or creates the
     minimal new element when none fits;
   - records it in the feature artifact as **Reviewer decision (owner standing
     rule)** with the evidence and the alternatives rejected, and reports it;
   - applies the Master7 migration boundary for a new persisted field and
     records the proposed or explicitly authorized migration.

   The standing rule does **not** cover destroying or rewriting existing data,
   access restrictions, or accounting posting effects. Those still wait for an
   explicit user decision, and so does any action the tooling refuses. A
   derived value with no source at all is shown empty rather than invented
   (Labour Activities Report: Profile and the three time columns stay empty
   until the job labour line records them).

---

