<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-04-domain-actions | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-04-domain-actions.template.md -->
# PHASE 4: Domain Actions and State Transitions

Use this packet only when a feature has destructive, risky, or state-dependent
domain transitions. It is not a container for every button click.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:bac9708a301e31a0302ab3880f2fbf60269c5b647ef40b6e4b537e6748762e92
- master.1: ## 1. Governance and review principles | sha256:127af0593047619ee010cc42872c85f6fb17822939fc1eb84ddc0448a1bc38d2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:518b4536a222d1c0c8cdd6265af603ede18ef9742a98d423ad525dfcf9f486ec
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:3e4693fe20b130ccadbc096ec295c856ca45b65edce618be94f856736f679a28
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:7f9e01355e77a11d7b6ac6c30e6093397e8df8ada6489488ca1027b7d252fa03
- master.5: ## 5. Continuous quality gates | sha256:20f297601f44c6f54a86681f894a655fcd8cf1f78c852288f0654451830a50c9
- master.6: ## 6. Human and AI review protocol | sha256:4ceaecd1ec28eb3a13b14908b167b8b4c632cbdc403f7f7622324076cd3e6399
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:708ae50816aae4005b03f8b318a4c63de5617cfee5b238586b2a0a883b7df314
- ui.7: ## 7. Action button cycle | sha256:a9541810dbd8de33c49818ca9685d69fc35243278fb8cfcac942757b12a16b83
- ui.9: ## 9. Confirm: delete | sha256:2b7c7f35fcf489ae8bf36a257ffaf1fecffa6774bec9cc9eea12463759ee35dc
- ui.10: ## 10. Confirm: discard | sha256:46ad7f8f6a61b7ca1b8d53b43574f70e84057c0486cb1756e09d8ae588f62f9f
- ui.11: ## 11. Small modal on top | sha256:227974d714e69fb0e735de80fe0e6052cac762b7f01e16721c254e0dd499c3d8
- ui.15: ## 15. View mode | sha256:3b0303e758d2d470405bb73d932d5d6b727ed32d3b5b24fea10b5e549eea8a3b
- ui.22: ## 22. Loading, empty, error, toast | sha256:ca36e24d2210bf4603cb8092cbe49288e0319910304eb16559bb2bef9935b8ca
- ui.23: ## 23. Translations | sha256:fa61d2af66e51390cafeac43c298964d71c1e815236b1e5e66371b885b253893
- ui.24: ## 24. Colors, icons, buttons | sha256:11d9de8679ce66408aed269fc2e00d16ee9ec1d1cb46a9ed8afeb693847fb377
- ui.25: ## 25. RTL and dark theme | sha256:7a7270726f6b206659888dc898340d482f1d7c082bcb437a2d700ff228a026c5
- ui.26: ## 26. Permissions and route access | sha256:33d769df2c69055e37edfd328738ca874edd65b8c285acb6443e5c3930e0f85a
- ui.27: ## 27. Focus and keyboard | sha256:71009763a5b5c6848cda38eaf2bb0fa7ac83d001ab18c649f53f5c22edcb2b03
- ui.28: ## 28. Request cancellation and stale responses | sha256:45d17c01d2519192de3a092e57c7deb97e2ddaf2731be82c57c11f703a36c31f
- ui.29: ## 29. Verification expectations | sha256:9ed644e4850d168082c258bd00fb8826f51fda1ef8a98155baafa41583ad7a19
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:476faa25f2ba4a8a4cc59d4efb0c1798505bf3d241d0808c23ec84f849dbdbc9
- backend.5: ## 5. Step 5 — Interface and service | sha256:46effe8a80e3a97586b936e66b90b193a0dae4b4ec6a926e9968eb4381bc001e
- backend.6: ## 6. Step 6 — Controller | sha256:8921eeb99b61fc8c994fac1338bcddc91be4a1dc21d4e39e29282ae0c07166a9
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:c834c66dc17d92ffca8e74a7f32113de7febbf293507205c32287d375e3bb386
- backend.12: ## 12. Activate and deactivate | sha256:9b94917f07ae34b895ef07fcf62ad039cbaf1a00786bdd05fb91e078beb0dd32
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:a6d2fb7af604c71307dc1e5a74eba407f6eb6d0921b9cb6b917a7d93bd8606c1
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:80805d298438df7141fade3d3c04cd3a8efd6ee44b4738c180623f50bf88b3c9
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:632431c1d33706e030d2c1a56d0a52169d46daa4f69c3c44d910aabcf340eb12
- backend.16: ## 16. Pattern 4 — Settings | sha256:2f54dc0f231a48095318a7f802cb952c1c6aef64770c9cadbdee36007035b65c
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
9. Define the success-feedback owner. A standard successful action uses the
   global mutation interceptor once; do not emit another feature success toast.
10. Define exact refresh target, page retention, and updated action availability.

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
- Every mutation produces at most one success notification. A feature may own a
  composite final success only when the mutation suppresses the interceptor toast.
- Refresh behavior respects the owning Grid page or editor state.
- Action labels, focus, keyboard behavior, RTL, and themes are checked now.

## Expected handoff

Phase 5 receives action event and provider dependencies. Phase 6 receives the
final action-state and authorization matrices.
