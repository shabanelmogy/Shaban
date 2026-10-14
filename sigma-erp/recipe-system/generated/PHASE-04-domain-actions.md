<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-04-domain-actions | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-04-domain-actions.template.md -->
# PHASE 4: Domain Actions and State Transitions

Use this packet only when a feature has destructive, risky, or state-dependent
domain transitions. It is not a container for every button click.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:38d22849a6d25f64baa38c14562b4c85f08b29199ca287825471c3cfdacaf0e7
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:8d4f483fc5c4e3c0f84bb76153f0b2c5c70972699a9fa69e4fc7ed6e0667831b
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:685e9463fc13be9a9d9d7ed261ee88f5aee17f3ded08472af4daf0587aa945b1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:40836082dd49994bd2e8b88b6f888b21d1c4eeabf5e09e95eefa9f4fc2725ca5
- ui.7: ## 7. Action button cycle | sha256:62ab02ec6d136911130f189df3b805427a8b4d952cea916799a6a7640badc197
- ui.9: ## 9. Confirm: delete | sha256:b446c09fa7fe12e63f8aa03e99f184ebb14f957fa585576931ddd8f15cb6fd75
- ui.10: ## 10. Confirm: discard | sha256:195cd19d0990a68665612f5d0d9d7f5d9c19f48431edeb1f9de575b30592511e
- ui.11: ## 11. Small modal on top | sha256:766d16df7263c9b35550aa8657b683f39073bb0513063ca7fc3d794bb8798842
- ui.13: ## 13. Modal with tabs | sha256:2862ecf7774b64be9febe9157a8300885dd4a5d1118de84b78ec541c2e486377
- ui.15: ## 15. View mode | sha256:022f00069635b29f668f8ca24b27ef784df55a57a05ae66594c166e74263184c
- ui.22: ## 22. Loading, empty, error, toast | sha256:244bc2d6f185f10764d640c98de0e0ff53650e96bede01d5a1dffdf96f5303ca
- ui.23: ## 23. Translations | sha256:2410720acfe260652c5d9c6e0f801aa3881a21f18a1b1a3de4acc7478bcf1c6e
- ui.24: ## 24. Colors, icons, buttons | sha256:6729bb2594a33b250ebe2be5fd74ea31ff0680c020d4922da72d2009fd58aba1
- ui.25: ## 25. RTL and dark theme | sha256:7239bd7a1b0de149e09f0cf704ddc404e46af34f60e3f1548c293b00fbbf3061
- ui.26: ## 26. Permissions and route access | sha256:468e5ceba58128db01cd338059c6119761123144af55950bfaaf1a2d4866f0ff
- ui.27: ## 27. Focus and keyboard | sha256:73ccaf72760b8799fc815e44b6e1d3c21696dd91f837bfa7a468f9bc8b0e359f
- ui.28: ## 28. Request cancellation and stale responses | sha256:6c7c3c8a71a8681f46e2cef26d7efd5872fdbbaffa991f5e7c9adc592f4b385d
- ui.29: ## 29. Verification expectations | sha256:a8d4e22e935094a158791ace96c9effb34032888fd03fa6eb1c9151b5751a0d5
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:52c019490aab53c0d1d9e73a2e36446e9e66c35d999166bf890219be9cde49cf
- backend.5: ## 5. Step 5 — Interface and service | sha256:f279fac37e5c752a179db6688a4bac1a43073f9635d33787b3838ae35911f9d8
- backend.6: ## 6. Step 6 — Controller | sha256:ef99a6dec8e52b278bc36495c5415bd445b65183e12189e02ecd9e88cee3d75e
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:23f348643a40f97c07438d987af182efc5500e5e20c425c8574dffeb5b58d98a
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:72df618eef97754d2145fd42ce10e3a09b842ec6870bce6a2e7ee3eced51af93
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:1ef93e08a2dc13799842fb2d2eca23d2b3b9f0cc8d89b03e44810c2d50149c9e
- backend.16: ## 16. Pattern 4 — Settings | sha256:f348b0cd16369c066b96ceee3e956d7220eecb7113bb661ca788a547bfe270d2
- backend.18: ## 18. Edge cases | sha256:f7abc5b7753f5dadd9c00017864c17e86a1c71666715799ba4d9f1e21f359daa

Approved confirmation and workflow references:

- `SiGmaAngularFrontEnd/src/app/modules/shared/service/confirmation-dialog.service.ts`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/action-button`
- `SiGmaAngularFrontEnd/src/app/modules/Sales/SalesQuotation/components/list`
- `SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/close-job`

Reference roles: the shared confirmation service owns confirmation-only
interactions; `shared/components/action-button` owns menu rendering;
`Sales/SalesQuotation/components/list` owns the quotation specialization (UI 7);
`Workshop/Job/components/close-job` is the typed action-dialog reference (UI 13
and screen 09). Other domain transitions select their owning feature reference
after its state contract is frozen; do not copy quotation business rules.

The Master Guide and canonical pattern books are authoritative. This packet is
derivative. Stop using a packet that disagrees with canonical sources. Follow
Master block 8: run recipe `-Check` before use; reconcile initial drift or changed
book/template/manifest claims, regenerate affected packets through the generator,
semantically review their source rules and approved-reference roles, then rerun
`-Check` before use or handoff. Record packet IDs and review evidence. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Use canonical sources and report a precise blocker for unresolved conflicts.

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

Before implementation, inventory every public domain action in the approved
reference's backend interface, service and controller, and Angular service and
owning action menu (Master blocks 3 and 4). Classify every action as Supported,
Not Applicable, Missing or Conflicting. An exclusion names the absent domain
state or dependency; absence from a screenshot is not sufficient.

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

### Approved-reference action coverage

| Approved-reference action | Target classification | Evidence or exclusion reason |
|---|---|---|
| | Supported / Not Applicable / Missing / Conflicting | |

Every Supported action records its exact source/target state, response flags,
backend interface/service, controller verb/route/payload, Angular service,
interaction, dependency/concurrency rule, failure recovery and refresh in the
Master block 4 action-state contract. Missing or Conflicting decisions block the
affected slice rather than authorizing an invented transition.

### Action-state matrix

| Action | Owner surface | Visible when | Disabled when | Server permits when | Confirmation/input | Busy guard | Success state | Refresh | Recovery |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

### Authorization comparison

| Action | UI presentation rule | Backend enforcement | Tenant/ownership check | Missing control |
|---|---|---|---|---|
| | | | | |

## Continuous gates

- Every approved-reference public action is classified once, and every Supported
  action has a complete backend-to-UI vertical slice with no blank contract cell.
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
