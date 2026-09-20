<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-03-detail-write | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-03-detail-write.template.md -->
# PHASE 3: Detail and Write Path

Use this packet for Create, Edit, and View behavior from detail loading through
Save, discard, and parent refresh. Ordinary list-owned CRUD uses one controlled
dialog editor; a routed editor requires confirmed source or a documented
business workflow.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.2: ## 2. Screenshot and visual evidence policy | sha256:518b4536a222d1c0c8cdd6265af603ede18ef9742a98d423ad525dfcf9f486ec
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:cb0e817775ee1e443e9e191621b36169934a1b9efd398086fe06a3c3943d91f4
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:ad0c7c462af621944990cb16fd7bc8047ad6d4916af64faa0db5a191d8d15546
- master.5: ## 5. Continuous quality gates | sha256:7670c6f18eccb6140087efbd98986043b801baad7d2b31c0f8f739392f2228f5
- master.6: ## 6. Human and AI review protocol | sha256:e320d98cc6bfafa91e975d9a71eb6e932983db68f7ad93d378f99f6ddece800f
- ui.1: ## 1. Feature folders and wiring | sha256:892d2ac3ae19a8b65346bc151efcfd78b5a8f0c9b611e55206b92656e37b8aa6
- ui.2: ## 2. Service and response wrappers | sha256:6fa0394abd7f49ea6f19efcbf0f30dca568621f5250ab3b3343b7ba16a7102e9
- ui.9: ## 9. Confirm: delete | sha256:2b7c7f35fcf489ae8bf36a257ffaf1fecffa6774bec9cc9eea12463759ee35dc
- ui.10: ## 10. Confirm: discard | sha256:46ad7f8f6a61b7ca1b8d53b43574f70e84057c0486cb1756e09d8ae588f62f9f
- ui.11: ## 11. Small modal on top | sha256:227974d714e69fb0e735de80fe0e6052cac762b7f01e16721c254e0dd499c3d8
- ui.12: ## 12. Step form | sha256:39909d176aa0fa796015942ba7c7554c71a092d98a1c98ad717d6afac7755bf4
- ui.13: ## 13. Modal with tabs | sha256:8e2b7e64d921446bc1d529e22a59e360cf9cacc5c4b539cf1b316a00c3f45074
- ui.14: ## 14. Editable collection table | sha256:7b960dad8be88186512726a1f86df53a04918d0aa7dd5cc0f7310256072f8372
- ui.15: ## 15. View mode | sha256:47aeb820938ae96bd7305ba9aed8d92077c3f769fd746c73a366782e4435e2dd
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:d79561f8978b204d55d3a35082ec821292b5c35c163b528f9f34356170f4d8b6
- ui.17: ## 17. Dates | sha256:85e388f28d087258e6a2b96a92f7e6bb43f13caed9c81868481f6a7ec8d4d0bf
- ui.18: ## 18. Documents and upload | sha256:cd2781e18d5958511a74fbdb186bdb47b822d6c8ad4c7ca56b5020e59ff3675f
- ui.19: ## 19. Validation messages | sha256:51ac0deaaea47846133542b4f06349ce4201f373f65ac26cc5cdfce4a0e0816a
- ui.22: ## 22. Loading, empty, error, toast | sha256:1e4012005b264f2c0efaf929b30f03ae84b7587138379ebf6c142fa12e43e9e2
- ui.23: ## 23. Translations | sha256:1d159b39ed046537db86c6edffcdcd8ca30809f35761b5f19845d57e51896101
- ui.24: ## 24. Colors, icons, buttons | sha256:4e343afab530c8c08638a07919595ff1169f60f6d0aebe43f1ada3414a535d49
- ui.25: ## 25. RTL and dark theme | sha256:7a7270726f6b206659888dc898340d482f1d7c082bcb437a2d700ff228a026c5
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:71009763a5b5c6848cda38eaf2bb0fa7ac83d001ab18c649f53f5c22edcb2b03
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- backend.3: ## 3. Step 3 — ViewModels | sha256:34e112b5119c6c4e222bd1e984261d3a3385c2b5c82f921d0a9d59b47480f4f9
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:337246e86e0bbc6f3e4910c39f070f7235aa3984a4bad92b6ce70d49fb2e9658
- backend.5: ## 5. Step 5 — Interface and service | sha256:46effe8a80e3a97586b936e66b90b193a0dae4b4ec6a926e9968eb4381bc001e
- backend.6: ## 6. Step 6 — Controller | sha256:8921eeb99b61fc8c994fac1338bcddc91be4a1dc21d4e39e29282ae0c07166a9
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:c834c66dc17d92ffca8e74a7f32113de7febbf293507205c32287d375e3bb386
- backend.10: ## 10. Select and dropdowns | sha256:4f52d4a48672f3a86c04856cf6a3b11e93442d6c062c78effbb56017e965a6da
- backend.12: ## 12. Activate and deactivate | sha256:9b94917f07ae34b895ef07fcf62ad039cbaf1a00786bdd05fb91e078beb0dd32
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:a6d2fb7af604c71307dc1e5a74eba407f6eb6d0921b9cb6b917a7d93bd8606c1
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:80805d298438df7141fade3d3c04cd3a8efd6ee44b4738c180623f50bf88b3c9
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:632431c1d33706e030d2c1a56d0a52169d46daa4f69c3c44d910aabcf340eb12
- backend.16: ## 16. Pattern 4 — Settings | sha256:2f54dc0f231a48095318a7f802cb952c1c6aef64770c9cadbdee36007035b65c
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef

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
   To keep a calendar closed on dialog startup while preserving input-click
   opening, keep `[showOnFocus]="true"` and place `autofocus` on another
   meaningful input. Do not make the date input icon-only by disabling
   `showOnFocus`.
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
- A dialog calendar opens closed by default without disabling normal input
  clicks: a different meaningful control receives initial focus and the
  calendar retains `[showOnFocus]="true"`.
- Date-picker auto-open is opt-in only for a confirmed date-first workflow and
  occurs one microtask after dialog `shown`, with focus moved to the calendar
  input.
- All form and dialog outputs are typed.
- Upload files are validated and abandoned files are recoverable.
- Translation, accessibility, RTL, theme, and responsive checks occur now.

## Expected handoff

Phase 4 receives editor actions that represent domain transitions. Phase 5
receives route, dialog, provider, and parent-refresh requirements. Phase 6
receives all final write-path tables.
