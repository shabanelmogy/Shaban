# PHASE 3: Detail and Write Path

Use this packet for routed or dialog Create, Edit, and View behavior from detail
loading through Save, discard, and parent refresh.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved references by editor shape:

{{APPROVED_REFERENCES}}

Reference ownership is explicit:

- routed step form: `Customers/Companies/CompanyPartner/components/details`;
- tabbed modal shell: `Sales/Fleet/components/details`;
- nested child draft mechanics only: `CompanyPartner/components/detalisForm/drivers`.

For a tabbed modal, do not substitute the driver dialog for the Fleet shell.
Combine the Fleet structure with the canonical controlled dirty-close lifecycle;
do not copy a source visibility hook that closes before discard approval.

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop and report drift when they disagree.

## Purpose

- Keep editor fields, typed forms, Detail/Add/Update DTOs, and persistence
  behavior aligned.
- Select editor structure from business shape rather than screenshot layout or
  field count.
- Make Save, discard, child, and upload lifecycles recoverable.

## Included concerns

- Routed editor, tabbed modal, single modal, or small modal selection.
- Create, Edit, and View modes.
- Detail loading and read-only behavior.
- Typed form controls and payload construction.
- Validation parity and focus on invalid state.
- Save, Cancel, close, Escape, and dirty-state handling.
- Conditional stepper behavior.
- Child collections and typed nested form dialogs.
- Documents, images, uploads, replacement, removal, and abandoned-file cleanup.
- Backend transaction and explicit child reconciliation consumed from Phase 1.
- Success, declared failure, transport failure, and recovery.

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

Required screenshot fields with Missing contracts remain unresolved rather than
being added to a payload.

## Procedure

1. Confirm routed versus dialog editor and route count.
2. Freeze Detail, Add, and Update field ownership.
3. Define typed form controls and nullability.
4. Compare frontend and backend validation.
5. Define Create, Edit, and View loading and control state.
6. Define Save without ordinary confirmation.
7. Define dirty discard for every exit path.
8. Define focus, keyboard, tab, and validation semantics.
9. Define explicit child reconciliation and transaction behavior.
10. Define upload, replacement, cleanup, and save-failure behavior.
11. Define parent close and refresh signals.

## Required outputs

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

### Child/upload contract

| Item | Client draft state | Persisted by | Validation | Reconciliation/cleanup | Failure recovery |
|---|---|---|---|---|---|
| | | | | | |

## Continuous gates

- Add and Update contain client-editable inputs only.
- View mode does not depend on disabled controls alone for security.
- Dirty dialogs use controlled visibility; the library must not close first.
- A reason, note, or date workflow uses a typed form dialog, not confirmation.
- All form and dialog outputs are typed.
- Upload files are validated and abandoned files are recoverable.
- Translation, accessibility, RTL, theme, and responsive checks occur now.

## Expected handoff

Phase 4 receives editor actions that represent domain transitions. Phase 5
receives route, dialog, provider, and parent-refresh requirements. Phase 6
receives all final write-path tables.
