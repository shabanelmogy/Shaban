<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-03-detail-write | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-03-detail-write.template.md -->
# PHASE 3: Detail and Write Path

Use this packet for Create, Edit, and View behavior from detail loading through
Save, discard, and parent refresh. Ordinary list-owned CRUD uses one controlled
dialog editor; a routed editor requires confirmed source or a documented
business workflow.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:e091f8715bd45438f4c58030c4b56015b25567c6a0541c233340321b522d916a
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:681863fa27d60be8922ee563bd76488b459947d5d0497e478de2ef748bb2abed
- ui.1: ## 1. Feature folders and wiring | sha256:0199f7c682b9dcfd8c3db876787322c06e105cd81f70b6d4ea17f06dcb46e408
- ui.2: ## 2. Service and response wrappers | sha256:f401fd78f48c7eb001ca812c42ea69bc65e828c659fe1396ce6ca415a3721231
- ui.9: ## 9. Confirm: delete | sha256:b446c09fa7fe12e63f8aa03e99f184ebb14f957fa585576931ddd8f15cb6fd75
- ui.10: ## 10. Confirm: discard | sha256:b687d2e0d4baa6c392a7bb78b6842e876ff362f2fd42fdc310f82eb72a3c7e5f
- ui.11: ## 11. Small modal on top | sha256:766d16df7263c9b35550aa8657b683f39073bb0513063ca7fc3d794bb8798842
- ui.12: ## 12. Step form | sha256:ccd240a68cfb769b5eab6bc864c23f8b532b833ecb2353f80a188891ff5085da
- ui.13: ## 13. Modal with tabs | sha256:d56d1336d697d33e86afd79fa5a87171273b2b6e91b7f69a410a033cec526310
- ui.14: ## 14. Editable collection table | sha256:4beda6867941beb4260d5854994bf37931d3b2053b4f92397317701b5458584e
- ui.15: ## 15. View mode | sha256:022f00069635b29f668f8ca24b27ef784df55a57a05ae66594c166e74263184c
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:c2b03fa4a30625613cddace497a177d09eaaa6b39c4cf002efee5e69b484bc0b
- ui.17: ## 17. Dates | sha256:a3ac49f8b648689d708d0ae9be80f4e18eea8c6c7bba15aca14d0adc1a2539b5
- ui.18: ## 18. Documents and upload | sha256:aa5f88a7108ce1bafbad833219c66c83e43e6be731fa0ecda6c544537197b143
- ui.19: ## 19. Validation messages | sha256:685c272c3ad9e689d5796a2d56f127798f8f3fd2ba3d5707c0555ee5066f7bff
- ui.22: ## 22. Loading, empty, error, toast | sha256:eb29f7481ec7434ae7f60d0039b643c2249dbd343d4b6eb608c9a619791521f0
- ui.23: ## 23. Translations | sha256:3600856df82f27c6eb0710076d8755979f2038a625ddf573a0079197d0b8248c
- ui.24: ## 24. Colors, icons, buttons | sha256:341892ba07b97a6084675228946bfdfcf7fc5165142949f6e30769d35a1cfde6
- ui.25: ## 25. RTL and dark theme | sha256:7239bd7a1b0de149e09f0cf704ddc404e46af34f60e3f1548c293b00fbbf3061
- ui.26: ## 26. Permissions and route access | sha256:468e5ceba58128db01cd338059c6119761123144af55950bfaaf1a2d4866f0ff
- ui.27: ## 27. Focus and keyboard | sha256:333d07eb2a8f10db1439820d9fa2fa5c940157fc64745f70d9620141d98569e3
- ui.28: ## 28. Request cancellation and stale responses | sha256:a5e48de60c3679102dda13ec7edd9d7cd0840d7f7301508f0e3c5a6736055d32
- ui.29: ## 29. Verification expectations | sha256:e167960f8e5261f686e1f814e7b72c810aa26533fe5b419607c8f709429be865
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:73c6e842f2a188bb1fc2ca3391756683ac7fca9cd64c805e229c02ae7ce03bb5
- backend.3: ## 3. Step 3 — ViewModels | sha256:4a11c70ca487d4644b26fc5082a6d9244db925d3a6ef8d3f7c174b0548fb48a1
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:d8ab105a1462baaa5dee9c089419a7783ede54cdb09d075a51805970fef624f9
- backend.6: ## 6. Step 6 — Controller | sha256:ef99a6dec8e52b278bc36495c5415bd445b65183e12189e02ecd9e88cee3d75e
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:1798ea5f97d741d74fdb69fb8555447c0a2d04fabc40b88895e17d22b8588e36
- backend.10: ## 10. Select and dropdowns | sha256:700a3fc93df824f337cf2bf5c2fe12f866d8aee46c8be35976a2fccf7fa533cb
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:72df618eef97754d2145fd42ce10e3a09b842ec6870bce6a2e7ee3eced51af93
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:7e2d36c3ce382f62e903e3c14d8cc74023eb1e28cadc8913c5cc0e37aceb62d7
- backend.16: ## 16. Pattern 4 — Settings | sha256:f2379884db393f76c984b88a487c4ec4cbad1e492a69a48302d9761d6fa2339e
- backend.18: ## 18. Edge cases | sha256:a485f6c78402f9f0717d03164ce3fcccd4a7ea449c0352b381fd6aa77e88c108

Approved references by editor shape:

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editor-dialog`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editor-tabs`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/step-form`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/form-section`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editable-collection-table`
- `SiGmaAngularFrontEnd/src/app/modules/Fleet/VehicleService/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers`

Reference ownership is explicit:

- reusable Add/View/Edit shell, with or without projected tabs:
  `shared/components/editor-dialog`;
- reusable accessible editor tablist, keyboard behavior, RTL navigation and
  tab-button styling: `shared/components/editor-tabs`;
- reusable routed step navigation, progress semantics, responsive layout and
  light/dark styling: `shared/components/step-form`;
- reusable accessible invalid-field summary, count and field actions:
  `shared/components/form-validation-summary`;
- reusable translated form-section card, heading, icon, content spacing,
  responsive layout and light/dark styling: `shared/components/form-section`;
- reusable editable child-collection chrome, required headers, Add/default
  Remove or projected actions, empty state, responsive behavior, and table styling:
  `shared/components/editable-collection-table`;
- ordinary modal modes, feature content, dirty lifecycle and persistence:
  `Fleet/VehicleService/components/details`;
- routed step-form state, forward-validation gate, invalid-field discovery and
  focus, content, footer actions and persistence:
  `Customers/Companies/CompanyPartner/components/details`;
- accessible tab content and layout only: `Sales/Fleet/components/details`;
- shared dialog/tab integration plus nested child draft mechanics:
  `CompanyPartner/components/detalisForm/drivers`.

For every new or refactored compact editable child collection, use
`app-editable-collection-table` and project typed row cells with
`appEditableCollectionRow`. The feature still owns its typed collection,
controls, validation, removal confirmation, mutation, dirty state, payload, and
persistence. The projected template emits cells only because the shared
component owns each table row. Project `appEditableCollectionActions` only when
the row needs more than the standard Remove request; the shared component keeps
the action-cell presentation while the feature owns the typed actions.

For every new or refactored routed step form, use `app-step-form` for the
progress navigation and `app-form-validation-summary` beneath it. The feature
owns the typed steps, active index, forward-validation gate, single parent form,
content, invalid-field discovery and navigation, footer actions, dirty exit,
routing, payload and persistence. Do not hand-build another stepper/summary or
announce tab semantics for an ordered workflow.

Use `app-form-section` for repeated form-group cards and project the
feature-owned controls. The shared component owns only the translated heading,
optional description and icon, content spacing, responsive behavior and theme;
the feature retains forms, validation, state and behavior. Do not copy a
feature-local section/header/content shell or depend on feature-specific
section selectors.

For every new or refactored Add/View/Edit modal with tabs, project
`app-editor-tabs`, the matching feature-owned panels, and feature content into
`app-editor-dialog`. Do not substitute the driver dialog, hand-build another
tablist, or copy a feature-specific direct `p-dialog` shell. Combine the shared
shell with the canonical controlled dirty-close lifecycle; do not copy a source
visibility hook that closes before discard approval.

Create, View and Edit for an ordinary CRUD list must open that same controlled
`app-editor-dialog` component with an explicit mode. Do not mix modal Create with routed
View/Edit, or add editor routes merely because legacy routes exist. View mode is
read-only, hides Save and exits through Close. Record the confirmed workflow
evidence before selecting a routed editor instead.

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
- Shared step-form navigation plus feature-owned conditional step behavior.
- Shared editable child collections and typed nested form dialogs.
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

1. Confirm one `app-editor-dialog` Add/View/Edit surface and a list-only route
   for ordinary CRUD, or record the exact evidence that requires routed editor
   URLs. Use `app-editor-tabs` for custom editor tab navigation; tabs are
   projected body content, not a reason for another shell. For a confirmed
   routed step workflow, use `app-step-form` and wrap repeated content groups
   with `app-form-section`; keep the single parent form, forward-validation
   gate and controls in the feature, and render its typed invalid-field list
   through `app-form-validation-summary`.
2. Freeze Detail, Add, and Update field ownership.
3. Define typed form controls and nullability.
4. Compare frontend and backend validation.
5. Define Create, Edit, and View loading and control state.
6. Define Save without ordinary confirmation.
7. Define dirty discard for every exit path.
8. Define focus, keyboard, tab, and validation semantics.
   To keep a calendar closed on dialog startup, bind the shell's
   `[focusOnShow]="false"` and give each calendar `[showOnFocus]="false"` with
   `(click)` opening the overlay, per block 17. Calendars are typeable with
   `[keepInvalid]="true"` and carry no icon.
   When a small date-first dialog must open its picker immediately, wait for
   the shared shell's `shown` output, defer one microtask so projected content
   is settled, focus the calendar input, and call the calendar overlay API
   locally; do not make auto-open global.
9. Use `app-editable-collection-table` for compact editable child collections,
   using `headingVisible="false"` under an existing section heading and an
   explicit `tableMinWidth` when the editable row needs horizontal space. Then
   define feature-owned typed rows, validation, confirmed removal, dirty state,
   payload mapping, explicit child reconciliation, and transaction behavior.
10. Define upload, replacement, cleanup, and save-failure behavior.
11. Define the Save success-feedback owner. Standard successful mutations rely
    on the global interceptor once. A composite Save may own the final success
    only when its mutation explicitly suppresses the interceptor toast and the
    success is emitted after all required follow-up work succeeds.
12. Define parent close and refresh signals.

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
- Ordinary Create/View/Edit uses the shared `app-editor-dialog`, one feature
  content component and an explicit mode; no mixed routed/modal editor survives
  without confirmed evidence.
- A new or refactored tabbed Add/View/Edit modal projects `app-editor-tabs` and
  matching feature-owned panels into `app-editor-dialog`; it owns neither a
  feature-local tab keyboard handler nor a direct `p-dialog` shell.
- A new or refactored routed step form uses `app-step-form` once for ordered
  navigation and progress; it has no feature-local stepper markup or styles and
  does not announce tab semantics.
- Its invalid-field alert uses `app-form-validation-summary`; the feature still
  owns invalid-control discovery, step activation and focus.
- Repeated form groups use `app-form-section`; the feature does not recreate the
  section card/header/content shell or depend on feature-specific section
  selectors for that shell.
- A new or refactored compact editable child collection uses
  `app-editable-collection-table`; its projected row template emits cells only,
  optional custom actions use `appEditableCollectionActions`, duplicate visible
  headings are disabled, wide rows declare `tableMinWidth`, and the feature owns
  validation, confirmed mutation, dirty state, payload, and persistence.
- A reason, note, or date workflow uses a typed form dialog, not confirmation.
- A dialog calendar opens closed by default: the dialog binds
  `[focusOnShow]="false"`, the calendar uses `[showOnFocus]="false"` and opens
  on click, and the input stays typeable.
- The page never scrolls: the form pane or dialog body is the single scroll
  owner and the action footer stays visible, per block 1.
- Every new or refactored `app-editor-dialog` binds `[contentPadded]="true"`
  unless its body is full-bleed by design, and the feature content wrapper has
  no padding of its own, per block 13 *Body padding*.
- Date-picker auto-open is opt-in only for a confirmed date-first workflow and
  occurs one microtask after dialog `shown`, with focus moved to the calendar
  input.
- All form and dialog outputs are typed.
- Upload files are validated and abandoned files are recoverable.
- Save produces exactly one success notification; a feature-owned composite
  success explicitly suppresses the mutation interceptor toast.
- Translation, accessibility, RTL, theme, and responsive checks occur now.

## Expected handoff

Phase 4 receives editor actions that represent domain transitions. Phase 5
receives route, dialog, provider, and parent-refresh requirements. Phase 6
receives all final write-path tables.
