<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-03-detail-write | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-03-detail-write.template.md -->
# PHASE 3: Detail and Write Path

Use this packet for Create, Edit, and View behavior from detail loading through
Save, discard, and parent refresh. Select the editor using UI block 13's D4-2
rule: fields only or one small child list without totals use a controlled modal;
two or more child collections, totals, or approval/posting use a routed editor.
Create, Edit, and View share that editor with an explicit mode. Ordered step
workflows follow UI block 12; deliberate exceptions are recorded in the review.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:38d22849a6d25f64baa38c14562b4c85f08b29199ca287825471c3cfdacaf0e7
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:685e9463fc13be9a9d9d7ed261ee88f5aee17f3ded08472af4daf0587aa945b1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:1ee143e6e852683c791622ef3af32d881d057bf39cd40e075837d578707c646b
- ui.1: ## 1. Feature folders and wiring | sha256:f6595edc4738a78ff11d81e4f2231ee615f9a6b07aa2ab6143a3809dcfbc6769
- ui.2: ## 2. Service and response wrappers | sha256:5da069710db9da03ce125180ce1588fdf1778ddba4db71c52585b54ab0b10e08
- ui.9: ## 9. Confirm: delete | sha256:b446c09fa7fe12e63f8aa03e99f184ebb14f957fa585576931ddd8f15cb6fd75
- ui.10: ## 10. Confirm: discard | sha256:b1a5d0751bbabca3c5d652cfd6ad8fa729f1d6f59bbf6f0e9d7409e0cdd257e4
- ui.11: ## 11. Small modal on top | sha256:766d16df7263c9b35550aa8657b683f39073bb0513063ca7fc3d794bb8798842
- ui.12: ## 12. Step form | sha256:f53be24965afaa8dcf58477207a84800f70a148fb1dedb881e4370f7e897d56a
- ui.13: ## 13. Modal with tabs | sha256:c5f2a7595698bd32d40a68d95c7c60eecd3faf8f658c8c1db594aec6f6e62f76
- ui.14: ## 14. Editable collection table | sha256:4d1beeb856926e31fba4bf377269f5d8763cb968f1dbd5eb833ae74e2b973fde
- ui.15: ## 15. View mode | sha256:022f00069635b29f668f8ca24b27ef784df55a57a05ae66594c166e74263184c
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:ad2f831946e26af101d8c40a4b563c1b3ff24970fdbe53880f68c993b96f4848
- ui.17: ## 17. Dates | sha256:c3c2dcb258d006774350cdda4bcbc0edf2ac31281f34ea2162ed973c0cc55287
- ui.18: ## 18. Documents and upload | sha256:bc1d2cb0f5c9da3afba19b07b24e0dbe8141d2e26dab3fc651c405acbf6d63af
- ui.19: ## 19. Validation messages | sha256:94a516e370c206deb5d4d80c34a2daa9d1898bb15bb0e8a58ec8c687e63e9a14
- ui.22: ## 22. Loading, empty, error, toast | sha256:244bc2d6f185f10764d640c98de0e0ff53650e96bede01d5a1dffdf96f5303ca
- ui.23: ## 23. Translations | sha256:2410720acfe260652c5d9c6e0f801aa3881a21f18a1b1a3de4acc7478bcf1c6e
- ui.24: ## 24. Colors, icons, buttons | sha256:ceab92354823f68c9c61a452f587607f287bcf4ae402b5b569b55ea2b7ec80e6
- ui.25: ## 25. RTL and dark theme | sha256:7239bd7a1b0de149e09f0cf704ddc404e46af34f60e3f1548c293b00fbbf3061
- ui.26: ## 26. Permissions and route access | sha256:468e5ceba58128db01cd338059c6119761123144af55950bfaaf1a2d4866f0ff
- ui.27: ## 27. Focus and keyboard | sha256:73ccaf72760b8799fc815e44b6e1d3c21696dd91f837bfa7a468f9bc8b0e359f
- ui.28: ## 28. Request cancellation and stale responses | sha256:6c7c3c8a71a8681f46e2cef26d7efd5872fdbbaffa991f5e7c9adc592f4b385d
- ui.29: ## 29. Verification expectations | sha256:e167960f8e5261f686e1f814e7b72c810aa26533fe5b419607c8f709429be865
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:8a1b6fc2fa0bedff7a3245f9b349945a955c10cfa4a4fc4c76896841aab53cdc
- backend.3: ## 3. Step 3 — ViewModels | sha256:29ccd92c16af23938da89ef2524a74076ae75ff380d5758319abc14089eba797
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:b8ac558806ca55c63d2eb1b8ca229fd5f51b6b6784833f6d68268d12489f5b26
- backend.6: ## 6. Step 6 — Controller | sha256:ef99a6dec8e52b278bc36495c5415bd445b65183e12189e02ecd9e88cee3d75e
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:c2e52bf2108b49cd64e5d0c27c34e572bf1182418d777ef56fb96732e3bf82a3
- backend.10: ## 10. Select and dropdowns | sha256:700a3fc93df824f337cf2bf5c2fe12f866d8aee46c8be35976a2fccf7fa533cb
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:72df618eef97754d2145fd42ce10e3a09b842ec6870bce6a2e7ee3eced51af93
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:5e5d2a09422f7ebdf641b142f491d189a67884a605d8990acd51a974f5889991
- backend.16: ## 16. Pattern 4 — Settings | sha256:f2379884db393f76c984b88a487c4ec4cbad1e492a69a48302d9761d6fa2339e
- backend.18: ## 18. Edge cases | sha256:ac57e18f32891be679ab03e00c127257a4f54d2fbae1fa05863723837b0edc77

Approved references by editor shape:

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editor-dialog`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editor-tabs`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/step-form`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/form-validation-summary`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/form-section`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editable-collection-table`
- `SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/editor`
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
- ordinary modal integration: UI block 13 controlled composition and the
  shared EditorDialog/EditorTabs declarations; Fleet/VehicleService is routed
  and is not a modal reference;
- routed document editor shell, panes, fixed footer and Create/Edit/View modes:
  `Workshop/Job/components/editor`;
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

Create, View and Edit use the same shape selected by D4-2 and the screen catalog:
the controlled `app-editor-dialog` for a simple record, or the shared routed
editor shell for a document. Do not mix modal Create with routed View/Edit, or
select a shape merely because legacy routes exist. View mode is read-only,
hides Save and exits through Close. Record the selected rule and source evidence.

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop using a packet that disagrees with canonical sources. Follow
Master block 8: run recipe `-Check` before use; reconcile initial drift or changed
book/template/manifest claims, regenerate affected packets through the generator,
semantically review their source rules and approved-reference roles, then rerun
`-Check` before use or handoff. Record packet IDs and review evidence. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Use canonical sources and report a precise blocker for unresolved conflicts.

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

For screenshot-backed missing business explicitly placed in scope by the user,
apply Master block 2's owner standing rule: resolve Missing details using the
closest correct source-supported option or the minimal new element, record the
decision and evidence, and report it. Data destruction, access restrictions and
accounting effects still require the owner's decision. Other genuinely Missing
contracts remain unresolved and are not invented in a payload.

## Procedure

1. Apply UI block 13's D4-2 rule and record the source-supported screen type.
   Simple list records use one `app-editor-dialog` Add/View/Edit surface and a
   list-only route; documents use the shared routed shell in all three modes.
   Use `app-editor-tabs` for custom editor tab navigation; tabs are
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
- Create/View/Edit shares one feature content component and explicit modes in
  the shape selected by UI block 13's D4-2 rule; no mixed routed/modal editor
  survives without a documented governing exception.
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
