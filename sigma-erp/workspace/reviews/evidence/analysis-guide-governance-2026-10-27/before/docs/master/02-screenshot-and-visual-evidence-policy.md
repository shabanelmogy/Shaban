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
| Data type, length, precision, required, default, uniqueness, validation, lookup source | No | **Missing** unless confirmed source, the approved reference, or the user supplies it. Phase 1 proposes a value; the user confirms. `approve reviewer assumptions` may accept a proposal only within the low-risk limits of `AGENTS.md` |
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
   migration boundary and tell the owner to run `Add-Migration`. State the
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
   - keeps the migration boundary: a new persisted field is proposed with its
     suggested `Add-Migration` name, never run.

   The standing rule does **not** cover destroying or rewriting existing data,
   access restrictions, or accounting posting effects. Those still wait for an
   explicit user decision, and so does any action the tooling refuses. A
   derived value with no source at all is shown empty rather than invented
   (Labour Activities Report: Profile and the three time columns stay empty
   until the job labour line records them).

---

