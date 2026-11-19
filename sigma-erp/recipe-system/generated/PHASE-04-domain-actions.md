<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-04-domain-actions | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-04-domain-actions.template.md -->
# PHASE 4: Domain Actions and State Transitions

Use this packet only when a feature has destructive, risky, or state-dependent
domain transitions. It is not a container for every button click.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:a56c86bda3deb92b3f1892bfb6e323ae991d0aa315ba1183a531303dbf88bd06
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:8e602319017e268b923ed2bb8b7a8d21a1a3252640f23a986d99821842ea0c6f
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:db683d8cd9d81f554a0a9711335795c930c8e0846d9bc73fcf40f1da6084171f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:ad1ffed7bdf0b87f1c739ec1c7146a76c8a7d516f4d50e666cdeef3a7fb98b1c
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.7: ## 7. Action button cycle | sha256:d761c13f061cd62f22c5216391ce26364f1d2cb427973a2adcfbc9cdce4d770e
- ui.9: ## 9. Confirm: delete | sha256:54b220b80d7129d76c43ee26792787028fb140c1c99b540189776b8ed1c58c20
- ui.10: ## 10. Confirm: discard | sha256:8c3359f9d561eceee78e24a59277c5b5768cd9edb5f5863f7219d52daaf856b1
- ui.11: ## 11. Small modal on top | sha256:36fdc93109f5edde973e9db20655074637ded2a1307d0dfc37b55f678c8571a2
- ui.13: ## 13. Modal with tabs | sha256:050c316580fb934435b1ccf4d8cf6dc0e9e1619a2dc1de523eee3c8bf1072b53
- ui.15: ## 15. View mode | sha256:d65759cb2f87af8e2c60a44951906befcb022b449bb0fc709f0f8af000ed9911
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:0cf1190b29df3b524017967f0fba1a4611c683b902cb344278193f5e06de1377
- ui.24: ## 24. Colors, icons, buttons | sha256:fbaf5c46def760c9466d4d4082c393dfb56a950b1cf0b489e05336d7a821c378
- ui.25: ## 25. RTL and dark theme | sha256:43a3a8e0348d40c7dabf045d26827de50445cb6ba22441e1a7b9db9cdc8f8179
- ui.26: ## 26. Permissions and route access | sha256:ce3f2c451a72880ac11e264517cb14795d8539ef326b281ce297f75ae5d59223
- ui.27: ## 27. Focus and keyboard | sha256:8f5713225ff4aecd70093f9ac8e6ba96c91003126335ebad80f925e573fa8586
- ui.28: ## 28. Request cancellation and stale responses | sha256:b9ee811088e53d9771459815766c135cee973724042db691a7a4444ab5408325
- ui.29: ## 29. Verification expectations | sha256:857fd2de21235042c2d3c3d8af841d8bed3580a97bed2ff1680f6a3c2c291f04
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.5: ## 5. Step 5 — Interface and service | sha256:848b38b971e23945d10cb02d95cd2f94c2f3a176fe126e1a2169dca039be816d
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:9ffa9db969ffca5f271d1d047180ffd0fa5e7416eab045c9d3688b79c88c2e12
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:a0a4980bbe7adae8b1b5f95016247802b86f664f2f8fa0b43b4f635ab5355659
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:617d88ab8c71663d9b5dde488440db4ea5d176c266854e28550625b166439ee7
- backend.16: ## 16. Pattern 4 — Settings | sha256:1464b56b0af2c120542e7f5be144c24b4bf268ab01db1613cfd803bd58817a77
- backend.18: ## 18. Edge cases | sha256:13d0548154a54a05fda8d1276d7d19529ee31b2b79d7945ab1363e7f18abb6f0

Approved confirmation and workflow references:

- `SiGmaAngularFrontEnd/src/app/modules/shared/service/confirmation-dialog.service.ts`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/action-button`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/document-approval-cycle`
- `SiGmaAngularFrontEnd/src/app/modules/Sales/SalesQuotation/components/list`
- `SiGmaAngularFrontEnd/src/app/modules/Workshop/Job/components/close-job`

Reference roles: the shared confirmation service owns confirmation-only
interactions; `shared/components/action-button` owns menu rendering;
`shared/components/document-approval-cycle` owns the common decision/history
panel and reason flow for frozen approval models (UI7/13), with typed model
adapters retaining their state/effect/endpoint contracts;
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

| Action | UI rule and post-confirmation recheck | Backend route, grant/policy and prerequisites | Tenant, saved record and branch capability | Source evidence/open finding |
|---|---|---|---|---|
| | | | | |

For an action that validates a balance or source quantity, record both the
actor's authorized target and the business scope needed by the invariant.
Check the complete branch effects or shared-source usage under the existing
write boundary and test with an effective movement outside the actor's document
scope (BE8). Trace a reason portal and its parent's close state through view
loss, action grant loss and sent-write settlement (UI28).

Trace each generated document into the next affected read, approval or reversal
using the actor and branch capabilities permitted by the frozen contract.
Record actual producer and consumer symbols and their query/write modes.
Include withdrawal and restoration on a dirty draft and settlement of a sent
request where applicable. Reconcile the expected values, write count and
exit destination under Master5/7.

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
- Reconcile sent-write settlement, notification and refresh separately. If the
  same session loses write but retains read access, refresh only its current
  authorized projection after success. A replaced session receives no prior
  feature outcome (UI26/28).
- Action labels, focus, keyboard behavior, RTL, and themes are checked now.

## Expected handoff

Phase 5 receives action event and provider dependencies. Phase 6 receives the
final action-state and authorization matrices.
