<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-04-domain-actions | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-04-domain-actions.template.md -->
# PHASE 4: Domain Actions and State Transitions

Use this packet only when a feature has destructive, risky, or state-dependent
domain transitions. It is not a container for every button click.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:3d74ae71fa7ca4d78e3061da8b59c62bf979108fe9529ec4052336a6da002034
- master.1: ## 1. Governance and review principles | sha256:2d7b129595e5d4a952130db10961d2b8c81c0851dbc75fae7d83106e13c8daef
- master.2: ## 2. Screenshot and visual evidence policy | sha256:0b1dbab4b3b5c74d8f98f445aa6401c59248a410eb62069b1a0e970aae83a7c2
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:583605ea6557f568ab23959ef911184ff0864cbc5ee4ab4ca5e7b424dd6d30d0
- ui.0: # Sigma UI Pattern Book — Draft Canonical - preamble | sha256:8ee8fccad52b59f3ee3a04025d65de169c15d3dc986631ebbda114a9f8dc1e95
- ui.7: ## 7. Action button cycle | sha256:7c10bdb0f997b7e95bcee31fcb61c4fa25040a81d859708d580cfc7a1921d678
- ui.9: ## 9. Confirm: delete | sha256:5a86d1c89cac29713709575f30a616cf4d5cab08916d1dbc76c8808ec20dfd87
- ui.10: ## 10. Confirm: discard | sha256:204c1b4ec002309f33183be6ddbb6b1ee2027590cee44973ec33f748288b171a
- ui.11: ## 11. Small modal on top | sha256:36fdc93109f5edde973e9db20655074637ded2a1307d0dfc37b55f678c8571a2
- ui.13: ## 13. Modal with tabs | sha256:7c0dd035e63ae11aef46b513e3bdc67fd7d79d3bd955f974136f7e39c32c1e78
- ui.15: ## 15. View mode | sha256:94a4e740f8a7dd9614f7323aff83787b8217b6b96d95ad4dbba06f33cb43c1a5
- ui.22: ## 22. Loading, empty, error, toast | sha256:895b36e116e8ead97b444e10d6ff9fa7c127a7e6606b18ed80952387b3789974
- ui.23: ## 23. Translations | sha256:86389e84130499283be8d15b8fce15978af3d7d5436ad256e2f6192f3ee903e5
- ui.24: ## 24. Colors, icons, buttons | sha256:3e15f07e224a15d55e17bdb8bcb32251012adebe3aaa39b125b714d89543a20c
- ui.25: ## 25. RTL and dark theme | sha256:e2c1cfb7fc9d0a1b164eda572651154c744b54c155a35d81b71adffad08fddae
- ui.26: ## 26. Permissions and route access | sha256:47b008a60f56f150444a596c25205d1ac35783cad40b4a6abd8c345d176bfeb7
- ui.27: ## 27. Focus and keyboard | sha256:fa8fa60d2e93ddd0753c18b50e11a7bbc4c2bbdb29389641a7965cb6c718b8ed
- ui.28: ## 28. Request cancellation and stale responses | sha256:97c83940b83a1991f363d5acaa7323564458562d67a4f854bf6ac6e83422ff29
- ui.29: ## 29. Verification expectations | sha256:d4d703957f2f11fce5f669412da7e6d216784b7c5430f1a4cac6cfa0f277b326
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.5: ## 5. Step 5 — Interface and service | sha256:b1ece1eb91c7558fbd18e32eea96bc23e9405246e9b5ccb62293bbddd2042bd1
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:25c8c824e257a558545cb1475aa83b0e02ccb83c6cd980bc163c4d0840cfd344
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:a9396a3c5f5907fac7bb3a030a90d7047c660ca3f11ac769baab439f8e3eaa08
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:29e48cfe13a089e1bb1c8568d98a32eaaf16d0621f3521c5a8385e6c74a6fc63
- backend.16: ## 16. Pattern 4 — Settings | sha256:66be4b0b3eab54af0f2d37c4658f255db8e9fe8e4fcaace16627754174ac2c9e
- backend.18: ## 18. Edge cases | sha256:ca231703f8f3eecb2ba71fb505d7d6960d9c84ae8c2a9f3e3a73847bc553c3b8

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

The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Each item names the block that owns its rule; this packet restates no values.

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
