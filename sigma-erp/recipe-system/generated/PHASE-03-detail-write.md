<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-03-detail-write | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-03-detail-write.template.md -->
# PHASE 3: Detail and Write Path

Use this packet for Create, Edit, and View behavior from detail loading through
Save, discard, and parent refresh. It is a checklist: each item names the block
that owns the rule. Read that block (or its topic file) for the rule itself; this
packet restates no values.

Select the editor with UI13's decision rule (modal or routed editor); ordered
step workflows follow UI12. Create, Edit, and View share that editor with an
explicit mode; a deliberate exception is recorded in the review.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:223e1233ba9b050b21a1052d8210300a3a7bacb57cf9c2a7c66c63b6adc1ecfe
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:817eed9bcf1b6e55bd4e485e0297ade2bec072fb8360fd8fb8db49d918c10256
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:e332beddb8ee63faeea534279ce185f91f103e03d24514943b975a169f4ee748
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:d21cd155e9041bfdac3d153a52d6941147d10be5a89e67c19ab748ba1166caa1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:c4df20098e8e79cd73612e9fb0128bfcb8c75d4390c745a8bc636906e517aa1f
- ui.2: ## 2. Service and response wrappers | sha256:f3a7b69c4ad6f7f09008f0dac6cb67b18d88fd938e2e64c568380e3b7d116bb7
- ui.7: ## 7. Action button cycle | sha256:d761c13f061cd62f22c5216391ce26364f1d2cb427973a2adcfbc9cdce4d770e
- ui.9: ## 9. Confirm: delete | sha256:54b220b80d7129d76c43ee26792787028fb140c1c99b540189776b8ed1c58c20
- ui.10: ## 10. Confirm: discard | sha256:8c3359f9d561eceee78e24a59277c5b5768cd9edb5f5863f7219d52daaf856b1
- ui.11: ## 11. Small modal on top | sha256:36fdc93109f5edde973e9db20655074637ded2a1307d0dfc37b55f678c8571a2
- ui.12: ## 12. Step form | sha256:f53be24965afaa8dcf58477207a84800f70a148fb1dedb881e4370f7e897d56a
- ui.13: ## 13. Modal with tabs | sha256:050c316580fb934435b1ccf4d8cf6dc0e9e1619a2dc1de523eee3c8bf1072b53
- ui.14: ## 14. Editable collection table | sha256:0df2f277edac033e92463ee78bb985bd7e1b68c27c046038170f6e7da25d900f
- ui.15: ## 15. View mode | sha256:d65759cb2f87af8e2c60a44951906befcb022b449bb0fc709f0f8af000ed9911
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:5eb34c7e77a01349c1b686038a34f2ffa32f03f8d570fd884066df37a5a6cfd8
- ui.17: ## 17. Dates | sha256:00b300ae17bfdba44d8725aa56ef62d7ff5aa9e7dde9da893cbaae769fbf4d73
- ui.18: ## 18. Documents and upload | sha256:5ffbb4173fb5789d46a71982c6ab74c8944b1f6d477200b29a99b5bd3210379a
- ui.19: ## 19. Validation messages | sha256:1d09f983bc9bfc10b29408abd84b9ed3933d1d140a1fe20da4ce84b935ecdde6
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:0cf1190b29df3b524017967f0fba1a4611c683b902cb344278193f5e06de1377
- ui.24: ## 24. Colors, icons, buttons | sha256:fbaf5c46def760c9466d4d4082c393dfb56a950b1cf0b489e05336d7a821c378
- ui.25: ## 25. RTL and dark theme | sha256:43a3a8e0348d40c7dabf045d26827de50445cb6ba22441e1a7b9db9cdc8f8179
- ui.26: ## 26. Permissions and route access | sha256:60e127ae103c07e526bcb264058fcd0f5c4060abfcfb3e63572e998edfbd9c31
- ui.27: ## 27. Focus and keyboard | sha256:8f5713225ff4aecd70093f9ac8e6ba96c91003126335ebad80f925e573fa8586
- ui.28: ## 28. Request cancellation and stale responses | sha256:b9ee811088e53d9771459815766c135cee973724042db691a7a4444ab5408325
- ui.29: ## 29. Verification expectations | sha256:6c21866c90433891845de658cac061fb8d3a52a778698f1e9f69686f5846e0cf
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.3: ## 3. Step 3 — ViewModels | sha256:1b2fd3b17c42fc35e1d5878bec1bad25b15edd349871a1957c2c1af9252d3bd2
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:848b38b971e23945d10cb02d95cd2f94c2f3a176fe126e1a2169dca039be816d
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:9ffa9db969ffca5f271d1d047180ffd0fa5e7416eab045c9d3688b79c88c2e12
- backend.10: ## 10. Select and dropdowns | sha256:61f5fb1f28d7992cf7610dfbe5a9e4fc6d08fd656230d72ab36067a6f1c04925
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:6035716962da9804921f58bce9d45abcedb25bc78df3210a790f1eeff1a472f0
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:617d88ab8c71663d9b5dde488440db4ea5d176c266854e28550625b166439ee7
- backend.16: ## 16. Pattern 4 — Settings | sha256:1464b56b0af2c120542e7f5be144c24b4bf268ab01db1613cfd803bd58817a77
- backend.18: ## 18. Edge cases | sha256:13d0548154a54a05fda8d1276d7d19529ee31b2b79d7945ab1363e7f18abb6f0

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
