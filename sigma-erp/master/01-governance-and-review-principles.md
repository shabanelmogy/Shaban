## 1. Governance and review principles

### Opening disclosure and reference sequence (owner clarification, 2026-11-05; tier-scaled 2026-11-19)

Before investigating application source, give a short task-specific opening
scaled to the tier. **Tier S:** one line stating scope/mode, the owning block and
the verification boundary; name the references below only when the change
touches a screen contract. **Tiers M/L:** state the scope and authorization
mode, the Master Guide and applicable UI/backend books, and the following items
explicitly:

- **Speed guide and original explanations:** the relevant local chapter and
  screen explanations to inspect under Master2.
- **Speed code:** the dated sidebar/screen cycle and its linked controller,
  dialog and service evidence. Keep this a separate step from reading the guide.
- **Odoo documentation, when available:** identify the pinned local collection
  through `references/odoo-rental/README.md`; consult the relevant documents for
  scoped gaps or ambiguity remaining after Speed. State when no complementary
  source applies or is available, with the reason. Do not treat Odoo as an
  alternative starting point or expand scope to unrelated features.
- **Skills:** name the Sigma screen skill and relevant available process skills.
  Check Superpowers availability; when installed and its relevant skills are
  available, read and use them within the existing authorization. If unavailable
  or inapplicable, state that and the evidence or reason. A name in an instruction
  is not proof of installation, and absence from the session list alone does not
  prove absence from the machine. Do not install a skill as part of this check.
- **Verification boundary:** state source checks, applicable scoped local builds,
  and any separately authorized execution. Skills and reference documents grant
  no extra permission.

After scoped discovery, name the selected screen/backend shapes and exact
reference slices. Compare the Speed guide, Speed code and applicable Odoo
evidence with actual Sigma source, accepted contracts and its user guide before
changing or freezing contracts. Record matched, partial, missing, decision-blocked
and owner-excluded details under Master2/4/7. Distinguish intended reading from
completed reading; the handoff names sources actually read and availability gaps.
The opening is a concise disclosure, not a new approval or a separate plan
artifact. Keep tier S limited to its affected element.

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
- Action path: visibility → actual authentication/authorization boundary and state checks → confirmation
  or typed input → execution → busy protection → result → recovery and refresh.

A component-only or service-only finding is incomplete when correctness depends
on another layer.

Inspect the mechanism that actually exists. Sigma currently has authentication
but no application permission mechanism (UI26); this path does not authorize
inventing one or treating a hidden control as secured.

### Business correctness first

> Owner rule (2026-10-01): "انا عايز بشكل عام تقديم الاصح فى البيزنس عن السهل او اللى موجود".

When a decision has a business- or accounting-correct answer and an easier one, the review
recommends and the implementation applies the **correct** one. The current code, the number
of documents that already behave one way, or a lower implementation cost are never the reason
for a rule: existing behaviour is evidence of what *is*, not of what is *right*. State the
business reasoning first; migration cost is a separate note. When correctness depends on law
or accounting treatment the reviewer cannot confirm (tax authority, auditor), say so and name
who must confirm, instead of defaulting to current behaviour. Example: VAT is rounded once per
tax rate on the document (D4-4), although most documents rounded per line.

### Experimental data and clean-start design (owner instruction, 2026-11-09; clarified 2026-11-16)

All current Sigma application data, including local and hosted development/test
databases, is experimental. This is a project-wide baseline, not a rule limited
to numeric values or permission fixtures. Prefer the correct business model,
required relationships and permission boundaries for a clean start. Do not add
compatibility paths, fallback behavior, parallel writers/readers or weakened
relationships/validation solely to preserve old experimental rows. Correct the
owning implementation and scoped data instead of carrying invalid experimental
records through a second application path.

When a correct change needs schema preparation, document the required migration
and clean-start steps under the scoped experimental migration rule. Scoped
experimental-data repair follows the standing permission below; do not invent
historical assignments or hide invalid records behind fallback calculations.
Preserve unrelated source work and data. If the owner later explicitly designates
a production environment, freeze its data-preservation requirements separately
before changing its data.

### Standing access to Sigma experimental databases (owner instruction, 2026-11-16)

Within the requested Sigma task, agents may directly inspect/read and write the
project's experimental local or hosted development/test databases, including
scoped data repairs and deletion of experimental duplicates, without repeated
permission requests. This permission covers necessary in-scope database work;
it does not expand a review/plan into implementation or change the requested
feature scope. Experimental-data cleanup supports the correct clean-start model
instead of application compatibility paths for old experimental rows.

Before executing, confirm the actual server/database/environment and bound the
operation to the intended tenant, records and selection rule. Preserve financial
correctness, references, permissions and unrelated data. Record the actual
operation, affected row counts and resulting integrity checks under Master7;
distinguish executed changes from proposed commands and unresolved schema work.

This standing permission does not authorize production or out-of-project
databases, a full data reset or dropping a database. Scoped tests and lint follow
Master5; browser/application execution, commits, pushes and deployments retain
their existing authorization requirements. The rule adds no recurring approval step for the scoped
experimental-database operations it already authorizes.

### Required experimental migrations (owner instruction, 2026-11-17)

An authorized Sigma implementation includes creating and applying its required
EF migration on the verified Sigma experimental database. Master7 owns target,
baseline, SQL review, scoped execution and result evidence. Keep unrelated
pending migrations outside the operation. Review-only, plan-only and
named-phase limits still apply. Production, out-of-project targets, full resets
and database drops retain their separate authorization boundaries.

### Proportional process (owner decision D4-5, 2026-10-01)

The artifacts follow the size of the change, not a fixed list:

| Tier | Scope | Required |
|---|---|---|
| **S** | One element or one rule in one screen (a label, a validator, a button state) | The fix, the scoped diff review, and a short report (files, decision, owner check). No contract-freeze file |
| **M** | One screen or one feature end to end | Contract freeze (only the contracts the screen has), the scoped diff review, and a reconciliation section in the review artifact |
| **L** | A new feature, a module, or a cross-cutting change (shared component, base class, policy) | The Maintenance / Evolution Plan, then the full artifact set of block 4 |

When in doubt, take the larger tier. A change that grows during the work moves up a tier, and the missing artifacts are added.

Select the tier before copying a review/planning template. For tier S, record the
small report and applicable decision in the existing review; do not require a
separate freeze file. Tier M fills only contracts actually consumed by that
screen. Tier L uses the plan and applicable phases. This is the entry for both
new-screen implementation and existing-state review; it changes neither the
user's authorization mode nor any required business decision.

### Whole-application review order

The screen-by-screen review of the application follows this order. Each screen is reviewed once, against the books as they are when it is reached:

1. **Vouchers and journals first.** Payments (F1), receipts, credit and debit notes, deposits and card settlements, then the journal voucher screens. Use `reviews/JOURNAL_ENTRIES_DECISION_SHEET.md`.
2. **Sales and purchase documents.** Invoices, bills, purchase orders, GRNs, purchase returns and requests: screen type 08 or 02, VAT per tax rate (D4-4).
3. **Settings left outside `IServiceHelper`.** Cost Centers, API Key, Common, Document Number and Charge Settings.
4. **Operational modules, one module at a time.** Workshop (Job is the reference), Rental, Lease, Limousine, Transportation, Equipment Rental, Fleet, Customers and suppliers, Staff and HRM, Stock, Assets.
5. **Reports.** Within each module, after its documents.

**Per-screen checklist:**
1. Pick the screen type (`ui/screens/00-catalog.md`) and the tier (above).
2. Review the relevant analysis guide and original screen explanation under
   Master2's mandatory analysis-guide gate, including the applicable sidebar/code
   cycle slice; compare any existing Sigma source, contract and user-guide topic,
   record accepted/excluded evidence and gaps, then freeze the contracts the type lists.
   Apply Master2's reference-product functional detail target: map the scoped
   reference details to actual Sigma coverage and plan missing details rather
   than treating the current minimal implementation as the target's ceiling.
3. Adopt every shared piece the type's blocks name (UI backlog 39 and 40, backend backlog 21–24), and remove the feature copies.
4. Remove the server-owned fields from the payloads (UI block 2).
5. Record the actual route and operation permission contract and any adoption gaps (UI26, Master4).
6. Apply *Business correctness first* to every decision.
7. Record the review, with the owner-run checks.

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
   Apply Master2's analysis-guide gate before selecting the target: read the
   relevant guide chapter and original screen explanation, record applicability
   and conflicts, and keep reference proposals distinct from Sigma contracts.
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

