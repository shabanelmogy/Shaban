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
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:685e9463fc13be9a9d9d7ed261ee88f5aee17f3ded08472af4daf0587aa945b1
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:1ee143e6e852683c791622ef3af32d881d057bf39cd40e075837d578707c646b
- ui.7: ## 7. Action button cycle | sha256:62ab02ec6d136911130f189df3b805427a8b4d952cea916799a6a7640badc197
- ui.9: ## 9. Confirm: delete | sha256:b446c09fa7fe12e63f8aa03e99f184ebb14f957fa585576931ddd8f15cb6fd75
- ui.10: ## 10. Confirm: discard | sha256:b1a5d0751bbabca3c5d652cfd6ad8fa729f1d6f59bbf6f0e9d7409e0cdd257e4
- ui.11: ## 11. Small modal on top | sha256:766d16df7263c9b35550aa8657b683f39073bb0513063ca7fc3d794bb8798842
- ui.13: ## 13. Modal with tabs | sha256:c5f2a7595698bd32d40a68d95c7c60eecd3faf8f658c8c1db594aec6f6e62f76
- ui.15: ## 15. View mode | sha256:022f00069635b29f668f8ca24b27ef784df55a57a05ae66594c166e74263184c
- ui.22: ## 22. Loading, empty, error, toast | sha256:244bc2d6f185f10764d640c98de0e0ff53650e96bede01d5a1dffdf96f5303ca
- ui.23: ## 23. Translations | sha256:2410720acfe260652c5d9c6e0f801aa3881a21f18a1b1a3de4acc7478bcf1c6e
- ui.24: ## 24. Colors, icons, buttons | sha256:ceab92354823f68c9c61a452f587607f287bcf4ae402b5b569b55ea2b7ec80e6
- ui.25: ## 25. RTL and dark theme | sha256:7239bd7a1b0de149e09f0cf704ddc404e46af34f60e3f1548c293b00fbbf3061
- ui.26: ## 26. Permissions and route access | sha256:468e5ceba58128db01cd338059c6119761123144af55950bfaaf1a2d4866f0ff
- ui.27: ## 27. Focus and keyboard | sha256:73ccaf72760b8799fc815e44b6e1d3c21696dd91f837bfa7a468f9bc8b0e359f
- ui.28: ## 28. Request cancellation and stale responses | sha256:6c7c3c8a71a8681f46e2cef26d7efd5872fdbbaffa991f5e7c9adc592f4b385d
- ui.29: ## 29. Verification expectations | sha256:e167960f8e5261f686e1f814e7b72c810aa26533fe5b419607c8f709429be865
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:8a1b6fc2fa0bedff7a3245f9b349945a955c10cfa4a4fc4c76896841aab53cdc
- backend.5: ## 5. Step 5 — Interface and service | sha256:b8ac558806ca55c63d2eb1b8ca229fd5f51b6b6784833f6d68268d12489f5b26
- backend.6: ## 6. Step 6 — Controller | sha256:ef99a6dec8e52b278bc36495c5415bd445b65183e12189e02ecd9e88cee3d75e
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:c2e52bf2108b49cd64e5d0c27c34e572bf1182418d777ef56fb96732e3bf82a3
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:72df618eef97754d2145fd42ce10e3a09b842ec6870bce6a2e7ee3eced51af93
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:5e5d2a09422f7ebdf641b142f491d189a67884a605d8990acd51a974f5889991
- backend.16: ## 16. Pattern 4 — Settings | sha256:f2379884db393f76c984b88a487c4ec4cbad1e492a69a48302d9761d6fa2339e
- backend.18: ## 18. Edge cases | sha256:ac57e18f32891be679ab03e00c127257a4f54d2fbae1fa05863723837b0edc77

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
