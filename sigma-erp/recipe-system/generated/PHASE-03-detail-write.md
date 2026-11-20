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

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:3d74ae71fa7ca4d78e3061da8b59c62bf979108fe9529ec4052336a6da002034
- master.1: ## 1. Governance and review principles | sha256:ee76565b87a3e1818f4ae0b77f0d10041f5dcbb4141a72e5bae32d07adedb420
- master.2: ## 2. Screenshot and visual evidence policy | sha256:721d81476614305b2a1e7e426b54c3b64048b8efb8462f3573760af392758fda
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:90dac99897883d0a9d4e973f60b38f549c45b3511dfd83bd5fe3e389da1eeb04
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.1: ## 1. Feature folders and wiring | sha256:3a4d6de0177450689846d43c0d9181ca007645ea4ed37bce1650a4d25b68ab25
- ui.2: ## 2. Service and response wrappers | sha256:3b648464835e13b2c1e982dd87e8d21a51eb8e0a0bb2ddf9b0aa26f79d56de97
- ui.7: ## 7. Action button cycle | sha256:7c10bdb0f997b7e95bcee31fcb61c4fa25040a81d859708d580cfc7a1921d678
- ui.9: ## 9. Confirm: delete | sha256:5a86d1c89cac29713709575f30a616cf4d5cab08916d1dbc76c8808ec20dfd87
- ui.10: ## 10. Confirm: discard | sha256:9d7b4e3b61a158c12105800fa71c6b20c2bb9d7138d3c2cba6612da36b4ce747
- ui.11: ## 11. Small modal on top | sha256:36fdc93109f5edde973e9db20655074637ded2a1307d0dfc37b55f678c8571a2
- ui.12: ## 12. Step form | sha256:aeca622906c7ec315baa055edc522f397bf3c49eb1ad0cf21fa2642fd8f13289
- ui.13: ## 13. Modal with tabs | sha256:7c0dd035e63ae11aef46b513e3bdc67fd7d79d3bd955f974136f7e39c32c1e78
- ui.14: ## 14. Editable collection table | sha256:23dce981d47c89c8ae4495dc6d8307c0daf83df95b87d2820949c022a4b08a7a
- ui.15: ## 15. View mode | sha256:94a4e740f8a7dd9614f7323aff83787b8217b6b96d95ad4dbba06f33cb43c1a5
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:467408e883c55ec485dd0e6998cf8481cf5c9e660b067ff6eb24acc057a7a102
- ui.17: ## 17. Dates | sha256:091b41901b811471ba30e616f1bde917b92b48ea65bd4c74de67e351f40a0401
- ui.18: ## 18. Documents and upload | sha256:c1423b8e0068409bc3d9f739913a9d7c6978a2d351530ee2954600ffdb2d405b
- ui.19: ## 19. Validation messages | sha256:6479ef1233a6517ec265a9f102b313abc8f626a15e89dca5f5265ffff267c8ac
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:7460a1db2589334955d4a482c50409c1d406038456aeed8a5c8a172a3e3cc771
- ui.24: ## 24. Colors, icons, buttons | sha256:3e15f07e224a15d55e17bdb8bcb32251012adebe3aaa39b125b714d89543a20c
- ui.25: ## 25. RTL and dark theme | sha256:e2c1cfb7fc9d0a1b164eda572651154c744b54c155a35d81b71adffad08fddae
- ui.26: ## 26. Permissions and route access | sha256:c596611d06131eccb93219ef991100aea97a6e054678b78e350983d0c5be627f
- ui.27: ## 27. Focus and keyboard | sha256:05fab3e975ee897d37f63406d7d61e39ff6b161ae174429a7834ff9a8ab387e6
- ui.28: ## 28. Request cancellation and stale responses | sha256:74ae9fdcdf9daa83fd23f5f6d2c92c906cd9ef0ed7a78f75c01fdf9243fcfa2e
- ui.29: ## 29. Verification expectations | sha256:52e0b1f24fb7514abf8c9b14cf83b0b6099b24db1ea46c90614f92705f8d67e0
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.2: ## 2. Step 2 — EF configuration | sha256:cf4f75793ea80c2bd92d2b51a51aa3b0d57240be85e4bd11f928737190874460
- backend.7: ## 7. ListVM scope rule | sha256:a32c3c557eec2057ea19e2c4233176c5c701135a7c02173f650fa242b9a69091
- backend.3: ## 3. Step 3 — ViewModels | sha256:933970f27dabf7974427031b8da025a0bda06fa7c341134c8f666665299bc4a6
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:2756fc24a8a3aff7b061c8bd51716403d7c353bdfc79bd1573223eac9d5381ba
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:25c8c824e257a558545cb1475aa83b0e02ccb83c6cd980bc163c4d0840cfd344
- backend.10: ## 10. Select and dropdowns | sha256:5492c310ca8d128504e1e223600fba3d8bdfaaacd7ef8907446d57a536edcc06
- backend.12: ## 12. Activate and deactivate | sha256:9f0e81c5f9c502123092dbd91de4e11b7886c0575d38a8c715fadece39f252c3
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:b3b6cf30cbd6bfab549f516d75cc31f5abaa64e43d53ae0f1ba906d57b80dc33
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:9aa937b534848693453be58682e411e089a6de631363ffa72ab529b3abebe432
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:99a22dc9b24695edc30eef7ed5b7ff1241576830b4f86fd3d1424af7a06e6465
- backend.16: ## 16. Pattern 4 — Settings | sha256:66be4b0b3eab54af0f2d37c4658f255db8e9fe8e4fcaace16627754174ac2c9e
- backend.18: ## 18. Edge cases | sha256:ca231703f8f3eecb2ba71fb505d7d6960d9c84ae8c2a9f3e3a73847bc553c3b8

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
