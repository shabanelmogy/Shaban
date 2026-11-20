# PHASE 3: Detail and Write Path

Use this packet for Create, Edit, and View behavior from detail loading through
Save, discard, and parent refresh. It is a checklist: each item names the block
that owns the rule. Read that block (or its topic file) for the rule itself; this
packet restates no values.

Select the editor with UI13's decision rule (modal or routed editor); ordered
step workflows follow UI12. Create, Edit, and View share that editor with an
explicit mode; a deliberate exception is recorded in the review.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references by editor shape:

{{APPROVED_REFERENCES}}

Shared owners (use their public contracts; the feature keeps its typed forms,
validation, state, payload and persistence):

| Concern | Shared owner | Owning block |
|---|---|---|
| Add/View/Edit modal shell | `shared/components/editor-dialog` | UI13 |
| Accessible editor tabs | `shared/components/editor-tabs` | UI13 topic `13/05` |
| Document approval decision/history panel | `shared/components/document-approval-cycle` | UI7 topic `07/01`, UI13 |
| Routed step navigation | `shared/components/step-form` | UI12 |
| Invalid-field summary | `shared/components/form-validation-summary` | UI12, UI19 |
| Form-section card | `shared/components/form-section` | UI13 |
| Editable child collections | `shared/components/editable-collection-table` | UI14 topics `14/02`, `14/03` |
| Routed document editor shell | `Workshop/Job/components/editor` | UI1 topic `01/02`, UI13 topic `13/06` |
| Routed step-form reference | `Customers/Companies/CompanyPartner/components/details` | UI12 |
| Nested child draft reference | `CompanyPartner/components/detalisForm/drivers` | UI13 topic `13/08` |

Fleet/VehicleService is routed and is not a modal reference.

The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.

## Purpose

- Keep editor fields, typed forms, Detail/Add/Update DTOs, and persistence
  behavior aligned.
- Select editor structure from business shape rather than screenshot layout or
  field count (UI13, Master2).
- Make Save, discard, child, and upload lifecycles recoverable.

## Included concerns and owners

| Concern | Owner |
|---|---|
| Editor shape and modes | UI13, UI12, UI15 |
| Detail loading and read-only behavior | UI15, UI22 |
| Typed form controls and payload construction; client-editable inputs only | UI19, BE3 |
| Validation parity and invalid-field focus | UI19, UI27, BE8 |
| Save, Cancel, close, Escape, dirty exit | UI10, UI13 topic `13/07` |
| Step navigation | UI12 |
| Editable child collections and nested dialogs | UI14, UI13 topic `13/08`, UI11 |
| Documents, images, uploads and cleanup | UI18 |
| Dates and calendars in dialogs | UI17 |
| Numeric roles (quantity/hour/meter, counts, money) | UI14, UI19, BE18 |
| Editor options and settings cache | UI2 topics `02/01`, `02/02`, `02/03` |
| Loading owner, error and success feedback | UI22 topics `22/01`, `22/04` |
| Mock-data assistance on editable forms | UI13 topic `13/02` |
| Backend transaction and child reconciliation from Phase 1 | BE8, BE14 |

## Explicit exclusions

- List paging and export.
- Independent domain transitions such as approve, post, void, and finalize.
- Using screenshot geometry as editor architecture.
- Inventing an upload or child persistence API.

## Dependencies and input gate

Required:

- Phase 0 manifest, evidence rows, and editor-shape decision.
- Phase 1 Detail/Add/Update and aggregate contracts.
- Approved reference for each editor/dialog shape.

Screenshot-backed missing business placed in scope by the user follows Master2
"Screenshot-backed scope from the user request"; other genuinely Missing
contracts remain unresolved and are not invented in a payload.

## Procedure

1. Apply UI13's decision rule and record the screen type; use one shape for all
   three modes. Routed documents apply UI13 topic `13/06` "Routed document editor
   baseline" as one set and record each row as Match, Not Applicable (reason) or
   a governing exception.
2. Freeze Detail, Add, and Update field ownership (BE3).
3. Define typed form controls and nullability (UI19).
4. Compare frontend and backend validation (UI19, BE8).
5. Define Create, Edit, and View loading and control state (UI15, UI22).
6. Define Save without ordinary confirmation (UI10).
7. Define dirty discard for every exit path (UI10, UI13 topic `13/07`).
8. Define focus, keyboard, tab, validation and calendar-open semantics (UI27,
   UI13 topic `13/05`, UI17).
9. For child collections follow UI14 topics `14/02` and `14/03`, then define
   feature-owned rows, removal, dirty state, payload and reconciliation (BE14).
10. Define upload, replacement, cleanup and save-failure behavior (UI18).
11. Define the single Save success-feedback owner (UI22 topic `22/04`).
12. Define parent close and refresh signals.

## Required outputs

Reconcile Master5 topic `05/02` performance evidence (with UI29 and BE7/BE2) for
detail, editor bootstrap, save/action refresh and payload size; measure only when
authorized. Reconcile UI22's detail/save loading owner and UI2's cache source
matrix for editor options and settings. Evidence is actual source behavior, not
shared class names.

### Detail and write contract

| UI field | Form control type | Detail DTO | Add DTO | Update DTO | Server-owned | Validation owner | Status |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Mode contract

| Mode | Route/dialog source | Loads detail | Editable | Primary action | Exit behavior |
|---|---|---|---|---|---|
| Create | | | | | |
| Edit | | | | | |
| View | | | | | |

### Dirty-exit contract

| Exit path | View | Pristine edit | Dirty edit | Busy state |
|---|---|---|---|---|
| Cancel | | | | |
| Close control | | | | |
| Escape | | | | |
| Route/back | | | | |

Nested reason or confirmation dialogs: check the parent exit guard and child
lifetime when View or the action grant is withdrawn (UI28); check branch
activity and retained references in the write contract (BE8).

### Child/upload contract

| Item | Client draft state | Persisted by | Validation | Reconciliation/cleanup | Failure recovery |
|---|---|---|---|---|---|
| | | | | | |

### Comparable document presentation reconciliation

When UI13 topic `13/06` applies, record each baseline row: concern, owning
block, shared producer/target consumer, adopted behavior, source result and
pending owner verification. Other shapes record why it is Not Applicable.

## Continuous gates

Check each against its owner; record match or finding.

- Full available width and one scroll owner; footer visible (UI1 topic `01/02`, UI29).
- Inactive-tab reads start at first activation (UI13 topic `13/05`).
- Detail and approval enrichment gated before costly reads (BE7).
- Add and Update contain client-editable inputs only (BE3).
- View mode does not rely on disabled controls for security (UI15, UI26).
- Controlled dialog visibility for dirty dialogs (UI13 topic `13/07`).
- One content component and explicit modes per UI13's rule.
- Shared tabs, step form, validation summary, form section and editable
  collection are used through their public contracts (table above).
- Reason, note or date workflows use a typed form dialog, not a confirmation (UI10).
- Dialog body padding (UI13 topic `13/08`) and calendar behavior (UI17).
- Typed form and dialog outputs (UI19).
- Numeric roles and precision (UI14, UI19, BE18).
- Upload validation and abandoned-file recovery (UI18).
- One success notification per Save (UI22 topic `22/04`).
- Translation, accessibility, RTL, theme and responsive checks (UI23, UI27, UI25).

## Expected handoff

Phase 4 receives editor actions that represent domain transitions. Phase 5
receives route, dialog, provider, and parent-refresh requirements. Phase 6
receives all final write-path tables.
