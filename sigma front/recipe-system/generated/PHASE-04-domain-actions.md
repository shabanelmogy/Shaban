<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-04-domain-actions | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-04-domain-actions.template.md -->
# PHASE 4: Domain Actions and State Transitions

Use this packet only when a feature has destructive, risky, or state-dependent
domain transitions. It is not a container for every button click.

## Canonical provenance

- master.1: ## 1. Governance and review principles | sha256:defaefeff17c467afb2b3e953ac2eaf53d67fdc9b35b8eee12451c586bf41f33
- master.2: ## 2. Screenshot and visual evidence policy | sha256:82edca7271355f11049971f73e80f31d1f54e108c5a00906e5c0e4f9124f04ab
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:714c5d1c919cb6f602abb0c15cb8c3689a83f34ec41b041b63957dd765ec8934
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:60b490244a3ad6a1ae6870eb0e8fcd0c6ea2b984f5f7af86a667ef05ac4305f2
- master.5: ## 5. Continuous quality gates | sha256:9e86071c1e6bbb5b2d7dba6270ea2a8a57b71c4750d11ac8ce4da4bfb373befb
- master.6: ## 6. Human and AI review protocol | sha256:d08192101c921bc5679d61b77c428a570961e73cbf82ef3f8807b12b036b4cd3
- ui.7: ## 7. Action button cycle | sha256:32128e41e13fdd7165ee34ab7aebdd4376d490e08fb721153e8e0bde44d7fafb
- ui.9: ## 9. Confirm: delete | sha256:2b7c7f35fcf489ae8bf36a257ffaf1fecffa6774bec9cc9eea12463759ee35dc
- ui.10: ## 10. Confirm: discard | sha256:46ad7f8f6a61b7ca1b8d53b43574f70e84057c0486cb1756e09d8ae588f62f9f
- ui.11: ## 11. Small modal on top | sha256:227974d714e69fb0e735de80fe0e6052cac762b7f01e16721c254e0dd499c3d8
- ui.15: ## 15. View mode | sha256:62c1f5e1f1d2dae4c234f216682ceb1c8b5bb7cef86494cc816afea457a42f3e
- ui.22: ## 22. Loading, empty, error, toast | sha256:aaf83a5b0cad482ec27a4f32ed1eb874ef2b92a05dd5071080077e4db731a1e5
- ui.23: ## 23. Translations | sha256:1d159b39ed046537db86c6edffcdcd8ca30809f35761b5f19845d57e51896101
- ui.24: ## 24. Colors, icons, buttons | sha256:e659faf7e9598e13c637837dbce1e1a2809d60e055f786804e3edcd3c43b8f0d
- ui.25: ## 25. RTL and dark theme | sha256:f92ca138a5baa0869aadf56be29ba537125b90cd162ed7b96848b2d53d5e9ffc
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:c277d98ba2241885c3f0daa8c301208b9dda7d3cb6b78a0f87505cededd5abb9
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:b99e32e1615baff70816067504b9b429ef018cbbd3b01ba210dad38d7502903e
- backend.5: ## 5. Step 5 — Interface and service | sha256:46effe8a80e3a97586b936e66b90b193a0dae4b4ec6a926e9968eb4381bc001e
- backend.6: ## 6. Step 6 — Controller | sha256:8921eeb99b61fc8c994fac1338bcddc91be4a1dc21d4e39e29282ae0c07166a9
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:1867a46fe28a599591510a456bdccfecbd6fd81240756eac7d5133caee428632
- backend.12: ## 12. Activate and deactivate | sha256:9b94917f07ae34b895ef07fcf62ad039cbaf1a00786bdd05fb91e078beb0dd32
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:a6d2fb7af604c71307dc1e5a74eba407f6eb6d0921b9cb6b917a7d93bd8606c1
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:5eb0a7349115ba1e14322cd7b4b2b1a4bca860e0bcc7ec57e250775bd4372a08
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:ff9ae19d4ddb6083bdf7fcb90ca7d49a2883eedc081c47182a09d1f36b930ac0
- backend.16: ## 16. Pattern 4 — Settings | sha256:08d3b98aa3eb5c00484338c2bb6bb32f38ad9ab87a6226d3650549456392dc75
- backend.18: ## 18. Edge cases | sha256:b78409883a1ffe3d4016644ed8b5afc92b3d48b47395c8f3c75a8117c49e69ef

Approved confirmation and workflow references:

- `SiGmaAngularFrontEnd/src/app/modules/shared/service/confirmation-dialog.service.ts`
- `SiGmaAngularFrontEnd/src/app/modules/Fleet/Vehicle`

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop and report drift when they disagree.

## Purpose

- Verify an action from visibility through backend state change and recovery.
- Keep UI visibility separate from server authorization.
- Make refresh, pagination, and action availability deterministic after success.

## Included concerns

- Delete and remove.
- Activate/deactivate.
- Approve/unapprove.
- Post/unpost.
- Void and finalize.
- Remove-child and comparable custom transitions.
- State and ownership preconditions.
- Confirmation-only versus typed reason/note/date dialogs.
- Double-execution protection, concurrency, and idempotency.
- Success state, failure recovery, and owning-surface refresh.

## Explicit exclusions

- Ordinary Save, owned by Phase 3.
- Search, paging, and Export, owned by Phase 2.
- Button styling beyond applying continuous UI gates.
- Treating hidden controls as authorization.

## Dependencies and input gate

Required:

- Phase 0 action inventory.
- Phase 1 endpoint, authorization, and state-transition contracts.
- Phase 2 or Phase 3 owning-surface refresh contract.

If the backend transition does not exist, record a Missing contract. Do not
simulate authorization or state rules only in Angular.

## Procedure

1. List every domain action and its owner surface.
2. Define visible, disabled, and server-permitted states separately.
3. Verify tenant, ownership, existence, references, and state at the backend.
4. Select confirmation only for a yes/no destructive or risky decision.
5. Use a typed form dialog when input is collected.
6. Prevent double confirmation and double execution.
7. Define concurrency and idempotency behavior where replay matters.
8. Handle declared and transport failures without losing recoverable user state.
9. Define exact refresh target, page retention, and updated action availability.

## Required outputs

### Action-state matrix

| Action | Owner surface | Visible when | Disabled when | Server permits when | Confirmation/input | Busy guard | Success state | Refresh | Recovery |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

### Authorization comparison

| Action | UI presentation rule | Backend enforcement | Tenant/ownership check | Missing control |
|---|---|---|---|---|
| | | | | |

## Continuous gates

- UI visibility is never described as security.
- Confirmation is not used for Save, Next, Search, Export, or Print.
- Confirmation services are shared; typed workflows remain typed forms.
- Buttons swap to a busy state and reject repeat execution.
- Errors preserve actionable server messages and define recovery.
- Refresh behavior respects the owning Grid page or editor state.
- Action labels, focus, keyboard behavior, RTL, and themes are checked now.

## Expected handoff

Phase 5 receives action event and provider dependencies. Phase 6 receives the
final action-state and authorization matrices.
