<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-03-detail-write | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-03-detail-write.template.md -->
# PHASE 3: Detail and Write Path

Use this packet for routed or dialog Create, Edit, and View behavior from detail
loading through Save, discard, and parent refresh.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.2: ## 2. Screenshot and visual evidence policy | sha256:82edca7271355f11049971f73e80f31d1f54e108c5a00906e5c0e4f9124f04ab
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:714c5d1c919cb6f602abb0c15cb8c3689a83f34ec41b041b63957dd765ec8934
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:60b490244a3ad6a1ae6870eb0e8fcd0c6ea2b984f5f7af86a667ef05ac4305f2
- master.5: ## 5. Continuous quality gates | sha256:9e86071c1e6bbb5b2d7dba6270ea2a8a57b71c4750d11ac8ce4da4bfb373befb
- master.6: ## 6. Human and AI review protocol | sha256:d08192101c921bc5679d61b77c428a570961e73cbf82ef3f8807b12b036b4cd3
- ui.1: ## 1. Feature folders and wiring | sha256:16219dc5f603162eb05ef14a5e4a36d99adf9af0b8530d73108c6c8a6c92979a
- ui.2: ## 2. Service and response wrappers | sha256:6fa0394abd7f49ea6f19efcbf0f30dca568621f5250ab3b3343b7ba16a7102e9
- ui.9: ## 9. Confirm: delete | sha256:2b7c7f35fcf489ae8bf36a257ffaf1fecffa6774bec9cc9eea12463759ee35dc
- ui.10: ## 10. Confirm: discard | sha256:46ad7f8f6a61b7ca1b8d53b43574f70e84057c0486cb1756e09d8ae588f62f9f
- ui.11: ## 11. Small modal on top | sha256:227974d714e69fb0e735de80fe0e6052cac762b7f01e16721c254e0dd499c3d8
- ui.12: ## 12. Step form | sha256:5d1ea3bd08f834c6ae45619bcd375fc755f7990a1193853147fc223fccba4e60
- ui.13: ## 13. Modal with tabs | sha256:a0519e2e3fdada22ad18128d00b8b3ebda207d5709dd974a71e1a29f7f03ce51
- ui.14: ## 14. Child collection table | sha256:458cfa1678c7fdc5fd5a4db1d06f8de089f82e755f76ae8244d7aa2487f73021
- ui.15: ## 15. View mode | sha256:62c1f5e1f1d2dae4c234f216682ceb1c8b5bb7cef86494cc816afea457a42f3e
- ui.16: ## 16. Dropdowns, lookups, enums | sha256:533436af43344a59cae4d26e9d3fb20c3c9b4503cdeb601fa55a5dad74cd2a0a
- ui.17: ## 17. Dates | sha256:feb99fec04d0e411e81b4f39df691d86891670cd20fd952ab4ff3cf617d14404
- ui.18: ## 18. Documents and upload | sha256:cd2781e18d5958511a74fbdb186bdb47b822d6c8ad4c7ca56b5020e59ff3675f
- ui.19: ## 19. Validation messages | sha256:42c78f95c1977fd63970cf9ce76e3f81b1cb416d8c4cbe7cd23ef0ca74f066dc
- ui.22: ## 22. Loading, empty, error, toast | sha256:aaf83a5b0cad482ec27a4f32ed1eb874ef2b92a05dd5071080077e4db731a1e5
- ui.23: ## 23. Translations | sha256:1d159b39ed046537db86c6edffcdcd8ca30809f35761b5f19845d57e51896101
- ui.24: ## 24. Colors, icons, buttons | sha256:e659faf7e9598e13c637837dbce1e1a2809d60e055f786804e3edcd3c43b8f0d
- ui.25: ## 25. RTL and dark theme | sha256:f92ca138a5baa0869aadf56be29ba537125b90cd162ed7b96848b2d53d5e9ffc
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:c277d98ba2241885c3f0daa8c301208b9dda7d3cb6b78a0f87505cededd5abb9
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- backend.3: ## 3. Step 3 — ViewModels | sha256:79f9d8c5c33521014de44f46fc92f499dd5dc55a5a6285457c645ec9f05c48fa
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:6c391e0baff28f36ee71120ade8c4b4fac56071722b3e2affbd6a40d71ebd941
- backend.5: ## 5. Step 5 — Interface and service | sha256:46effe8a80e3a97586b936e66b90b193a0dae4b4ec6a926e9968eb4381bc001e
- backend.6: ## 6. Step 6 — Controller | sha256:8921eeb99b61fc8c994fac1338bcddc91be4a1dc21d4e39e29282ae0c07166a9
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:1867a46fe28a599591510a456bdccfecbd6fd81240756eac7d5133caee428632
- backend.10: ## 10. Select and dropdowns | sha256:bd8ecba0fc462392ca6d51bc3f8666a122b3f4590f149e75abaf5992bba77089
- backend.12: ## 12. Activate and deactivate | sha256:9b94917f07ae34b895ef07fcf62ad039cbaf1a00786bdd05fb91e078beb0dd32
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:a6d2fb7af604c71307dc1e5a74eba407f6eb6d0921b9cb6b917a7d93bd8606c1
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:5eb0a7349115ba1e14322cd7b4b2b1a4bca860e0bcc7ec57e250775bd4372a08
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:ff9ae19d4ddb6083bdf7fcb90ca7d49a2883eedc081c47182a09d1f36b930ac0
- backend.16: ## 16. Pattern 4 — Settings | sha256:08d3b98aa3eb5c00484338c2bb6bb32f38ad9ab87a6226d3650549456392dc75
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef

Approved references by editor shape:

- `SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet/components/details`
- `SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers`

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
