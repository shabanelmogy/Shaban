# PHASE 4: Domain Actions and State Transitions

Use this packet only when a feature has destructive, risky, or state-dependent
domain transitions. It is not a container for every button click.

## Canonical provenance

{{SOURCE_FINGERPRINTS}}

Approved confirmation and workflow references:

{{APPROVED_REFERENCES}}

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
