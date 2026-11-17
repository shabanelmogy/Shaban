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

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:a56c86bda3deb92b3f1892bfb6e323ae991d0aa315ba1183a531303dbf88bd06
- master.1: ## 1. Governance and review principles | sha256:a2ea89d19643c80d5d6fedef76e1e562333792eee34cf2eaad1e1ada1a4c47e0
- master.2: ## 2. Screenshot and visual evidence policy | sha256:8e602319017e268b923ed2bb8b7a8d21a1a3252640f23a986d99821842ea0c6f
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:2dc0c50abbb9337e62e6ddea88ae341cfff9ff0da0849dca7f58bf304d9544d1
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:368f82a1a1e9ee0e73c3037cd8098b55137b988524ebfb828a99d6d10aeb0c55
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:96f5147de3041c0ab098fbd3b6005bb94b38ccde0ac890395818fdf989ca7868
- ui.2: ## 2. Service and response wrappers | sha256:c2e46bdaf00c1fbee66d6ae2c655f335e348e60efad6a972e6ed6755ea520734
- ui.7: ## 7. Action button cycle | sha256:687c92bb4681fccf5c48878735d7bbe787bf5fc41dbf9bc1296300698f68dbc6
- ui.9: ## 9. Confirm: delete | sha256:54b220b80d7129d76c43ee26792787028fb140c1c99b540189776b8ed1c58c20
- ui.10: ## 10. Confirm: discard | sha256:8c3359f9d561eceee78e24a59277c5b5768cd9edb5f5863f7219d52daaf856b1
- ui.11: ## 11. Small modal on top | sha256:36fdc93109f5edde973e9db20655074637ded2a1307d0dfc37b55f678c8571a2
- ui.12: ## 12. Step form | sha256:f53be24965afaa8dcf58477207a84800f70a148fb1dedb881e4370f7e897d56a
- ui.13: ## 13. Modal with tabs | sha256:cd104e5563bb5ae0af553c6bf03b7b8f89acdd8b80c8eb1df0befaf32e849ff8
- ui.14: ## 14. Editable collection table | sha256:85e6841fb90c89f898a6b2a233a46a8d7a757c42dcfe86381d2b21c10ecf4891
- ui.15: ## 15. View mode | sha256:d65759cb2f87af8e2c60a44951906befcb022b449bb0fc709f0f8af000ed9911
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:a3da0497ac2b3a9f7ec3f25a6f3c0693ab65ddf5e7f4fb0834ca9dcbcb0efd1a
- ui.17: ## 17. Dates | sha256:b83f662c6c700953af3243160c84fdd743629d4749a8d8674bf8d1419721cb5a
- ui.18: ## 18. Documents and upload | sha256:eb265ad8325dc885f5473bc5f1e5cf2541aacc8ded1734b2416c8d2435e44140
- ui.19: ## 19. Validation messages | sha256:6e7f00d5fed6d68fe924aa9d2bf6b64bba9368624df97317680d14ad6f5870d9
- ui.22: ## 22. Loading, empty, error, toast | sha256:8a43d6f6e7adf12e07a82fdb67e8f625158509fc0f88fe8f181f4c8a9c17e4a3
- ui.23: ## 23. Translations | sha256:0cf1190b29df3b524017967f0fba1a4611c683b902cb344278193f5e06de1377
- ui.24: ## 24. Colors, icons, buttons | sha256:762e32970e629fe1c579f7df4da00cfd9439f939d18adae1137849b452383b4c
- ui.25: ## 25. RTL and dark theme | sha256:43a3a8e0348d40c7dabf045d26827de50445cb6ba22441e1a7b9db9cdc8f8179
- ui.26: ## 26. Permissions and route access | sha256:ce3f2c451a72880ac11e264517cb14795d8539ef326b281ce297f75ae5d59223
- ui.27: ## 27. Focus and keyboard | sha256:8f5713225ff4aecd70093f9ac8e6ba96c91003126335ebad80f925e573fa8586
- ui.28: ## 28. Request cancellation and stale responses | sha256:b9ee811088e53d9771459815766c135cee973724042db691a7a4444ab5408325
- ui.29: ## 29. Verification expectations | sha256:1ff1411e4cbc36bb44b06ef153a062ad0ddc7d8ca7728bdc7a3deae3ea99656e
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.3: ## 3. Step 3 — ViewModels | sha256:1b2fd3b17c42fc35e1d5878bec1bad25b15edd349871a1957c2c1af9252d3bd2
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:848b38b971e23945d10cb02d95cd2f94c2f3a176fe126e1a2169dca039be816d
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:6ea7b47108bd89bf68e821373303b7390ed3b42e664fa831ccc3d5a2c3624f33
- backend.10: ## 10. Select and dropdowns | sha256:61f5fb1f28d7992cf7610dfbe5a9e4fc6d08fd656230d72ab36067a6f1c04925
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:a0a4980bbe7adae8b1b5f95016247802b86f664f2f8fa0b43b4f635ab5355659
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:936233bb5efd0ec72cbc63cb7184cf4baaf7e2363296b4f143001917536bb6d0
- backend.16: ## 16. Pattern 4 — Settings | sha256:1464b56b0af2c120542e7f5be144c24b4bf268ab01db1613cfd803bd58817a77
- backend.18: ## 18. Edge cases | sha256:8878697ea5e4b00ab272b14d83fd2091eb9cd129c168a238ab98b88bed22d2a0

Approved references by editor shape:

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editor-dialog`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editor-tabs`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/step-form`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/form-validation-summary`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/form-section`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/editable-collection-table`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/document-approval-cycle`
- `SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/editor`
- `SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers`

Reference ownership is explicit:

- reusable Add/View/Edit shell, with or without projected tabs:
  `shared/components/editor-dialog`;
- reusable accessible editor tablist, keyboard behavior, RTL navigation and
  tab-button styling: `shared/components/editor-tabs`;
- approved document decision/history panel shared by saved Approvals tabs and
  Approval Status dialogs: `shared/components/document-approval-cycle` (UI7/13);
  feature adapters retain their own frozen server state/effect/endpoint contract;
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

For editor options/settings, apply UI2's cache adoption checklist: source
eligibility, finite bootstrap, success-only writer invalidation and one scoped
watch binding that preserves selected IDs, labels and drafts. Revalidation never
recalculates business values. UI22's shared background badge owns activity;
do not add a local cache, permanent replay, spinner or competing socket.

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
   For comparable routed documents, apply UI13's "Routed document editor
   baseline" as one set, with its UI1/3/14/16/24 and BE8 owners. Record each row
   as Match, Not Applicable with a reason, or a governing exception. Do not copy
   the motivating feature's business matrix or deferred workflows.
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

Reconcile Master5/UI29 performance evidence for detail, initial editor bootstrap,
save/action refresh and child/option payload size. Review avoidable request
waterfalls and repeated query work with BE7, preserving drafts/transactions and
business guards. Record BE2's relevant index evidence or no-new-index reason;
measure only when authorized and otherwise supply comparable owner checks.

Reconcile UI22's actual detail/save operation lifecycle and visible owner. Pair
global start/finalize where applicable, remove duplicate loading-only messages
without removing error/empty/Retry or busy/aria-busy. Required routed initial/
filter lookups use the page host via shared lookup leases; dialog lookups stay
local and retained-cache refresh stays silent. A shared import alone
does not demonstrate that the active route displays the current loader.

Carry the UI2 / Master5 screen cache source matrix into this handoff. Reconcile
editor options, settings and direct live reads; include bootstrap success before
watch, selected-label retention, null-context clearing, Retry and draft/financial
preservation. Evidence is actual source behavior, not shared class names alone.

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

For a nested reason or confirmation dialog, check the parent exit guard and
child lifetime on withdrawal of View and of the action grant independently
(UI28). In the write contract, check stored and replacement branch activity
where required and tie retained-reference exceptions to the same saved child
row and value (BE8).

### Child/upload contract

| Item | Client draft state | Persisted by | Validation | Reconciliation/cleanup | Failure recovery |
|---|---|---|---|---|---|
| | | | | | |

### Comparable document presentation reconciliation

When UI13's routed-document baseline applies, record concern, owning block,
actual shared producer/target consumer, adopted value/behavior, source result
and owner runtime/visual verification pending. Include every baseline row;
shared class names alone do not establish conformance. Other editor shapes
record why this baseline is Not Applicable and use their own owning checklist.

## Continuous gates

- Apply UI1's full-available-width ownership steps: actual route/host/page/panel
  selectors, shared block host without local geometry, or the documented
  flex-parent exception with a growing direct child and preserved scroll/print.
  Record empty/loading/error/populated source evidence and UI29's responsive
  acceptance status; no class-name-only layout pass.
- Inventory inactive-tab subscriptions (UI13). Required record reads remain
  immediate; independent expensive tab reads start at first activation, retain
  their instance per record and reset on identity/reload/context with existing
  busy/draft/Retry/teardown and direct-link behavior. CSS hiding is not lazy loading.
- Gate detail/approval action enrichment from existing header facts before
  costly reads (BE7); preserve source-candidate multiplicity/unknown kinds and
  write-time guards. Keep independent HTTP reads separate from prohibited
  parallel EF work on one context; printing waits for its actual prerequisites.
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
- Classify numeric roles and adopt UI14/19's shared quantity/hour/meter profile,
  precision constant and decimal-scale validation. Counts/identities and money
  retain their actual policies; reject excess input precision without rounding.
  Reconcile the paired backend storage/API before accepting fractions (BE18).
- Upload files are validated and abandoned files are recoverable.
- Save produces exactly one success notification; a feature-owned composite
  success explicitly suppresses the mutation interceptor toast.
- Translation, accessibility, RTL, theme, and responsive checks occur now.

## Expected handoff

Phase 4 receives editor actions that represent domain transitions. Phase 5
receives route, dialog, provider, and parent-refresh requirements. Phase 6
receives all final write-path tables.
