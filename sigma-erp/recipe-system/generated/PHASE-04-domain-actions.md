<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-04-domain-actions | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-04-domain-actions.template.md -->
# PHASE 4: Domain Actions and State Transitions

Use this packet only when a feature has destructive, risky, or state-dependent
domain transitions. It is not a container for every button click.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:e091f8715bd45438f4c58030c4b56015b25567c6a0541c233340321b522d916a
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:681863fa27d60be8922ee563bd76488b459947d5d0497e478de2ef748bb2abed
- ui.7: ## 7. Action button cycle | sha256:62ab02ec6d136911130f189df3b805427a8b4d952cea916799a6a7640badc197
- ui.9: ## 9. Confirm: delete | sha256:b446c09fa7fe12e63f8aa03e99f184ebb14f957fa585576931ddd8f15cb6fd75
- ui.10: ## 10. Confirm: discard | sha256:b687d2e0d4baa6c392a7bb78b6842e876ff362f2fd42fdc310f82eb72a3c7e5f
- ui.11: ## 11. Small modal on top | sha256:766d16df7263c9b35550aa8657b683f39073bb0513063ca7fc3d794bb8798842
- ui.15: ## 15. View mode | sha256:022f00069635b29f668f8ca24b27ef784df55a57a05ae66594c166e74263184c
- ui.22: ## 22. Loading, empty, error, toast | sha256:eb29f7481ec7434ae7f60d0039b643c2249dbd343d4b6eb608c9a619791521f0
- ui.23: ## 23. Translations | sha256:3600856df82f27c6eb0710076d8755979f2038a625ddf573a0079197d0b8248c
- ui.24: ## 24. Colors, icons, buttons | sha256:341892ba07b97a6084675228946bfdfcf7fc5165142949f6e30769d35a1cfde6
- ui.25: ## 25. RTL and dark theme | sha256:7239bd7a1b0de149e09f0cf704ddc404e46af34f60e3f1548c293b00fbbf3061
- ui.26: ## 26. Permissions and route access | sha256:468e5ceba58128db01cd338059c6119761123144af55950bfaaf1a2d4866f0ff
- ui.27: ## 27. Focus and keyboard | sha256:333d07eb2a8f10db1439820d9fa2fa5c940157fc64745f70d9620141d98569e3
- ui.28: ## 28. Request cancellation and stale responses | sha256:a5e48de60c3679102dda13ec7edd9d7cd0840d7f7301508f0e3c5a6736055d32
- ui.29: ## 29. Verification expectations | sha256:e167960f8e5261f686e1f814e7b72c810aa26533fe5b419607c8f709429be865
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:73c6e842f2a188bb1fc2ca3391756683ac7fca9cd64c805e229c02ae7ce03bb5
- backend.5: ## 5. Step 5 — Interface and service | sha256:d8ab105a1462baaa5dee9c089419a7783ede54cdb09d075a51805970fef624f9
- backend.6: ## 6. Step 6 — Controller | sha256:ef99a6dec8e52b278bc36495c5415bd445b65183e12189e02ecd9e88cee3d75e
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:1798ea5f97d741d74fdb69fb8555447c0a2d04fabc40b88895e17d22b8588e36
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:72df618eef97754d2145fd42ce10e3a09b842ec6870bce6a2e7ee3eced51af93
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:7e2d36c3ce382f62e903e3c14d8cc74023eb1e28cadc8913c5cc0e37aceb62d7
- backend.16: ## 16. Pattern 4 — Settings | sha256:f2379884db393f76c984b88a487c4ec4cbad1e492a69a48302d9761d6fa2339e
- backend.18: ## 18. Edge cases | sha256:a485f6c78402f9f0717d03164ce3fcccd4a7ea449c0352b381fd6aa77e88c108

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
