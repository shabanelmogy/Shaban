# Sigma Feature Review Artifacts: {{Feature}}

Copy this file for one feature review. It records feature-specific evidence and
decisions; it does not create architectural authority.

## Review metadata

| Item | Value |
|---|---|
| Feature | {{Feature}} |
| Requested outcome | |
| Review date | |
| Reviewer | |
| Master version | |
| UI book version | |
| Backend book version | |
| Packet check result | |

## Feature Review Manifest

| Item | Decision or evidence |
|---|---|
| Frontend scope | |
| Backend scope | |
| Direct shared dependencies | |
| Existing user changes | |
| Evidence IDs | |
| UI shapes | |
| Backend pattern | |
| Approved references | |
| Routes and modes | |
| Endpoints | |
| Actions | |
| Permission mechanism | |
| Applicable phases | |
| Skipped phases and reason | |
| Explicit exclusions | |

## Evidence Register

| Evidence ID | File/source | Screen and state | Locale/direction | Viewport | Role | Date/version | Current or historical | Notes |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

## Functional Evidence Tables

Create one group per screenshot or workflow source.

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| | | | | |

## Grid Column Contract

| Evidence ID | Visible label | Proposed field | Frontend property | Backend ListVM property | Display transformation | Filterable | Sortable | Exported | Contract status | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

Fields removed from the ListVM:

| Field | Previous source | Reason removed | Direct consumers checked |
|---|---|---|---|
| | | | |

## Filter Contract

| UI control | Angular property | Serialized query key | Backend lookup key | Parser/type | Default/absence behavior | Contract status |
|---|---|---|---|---|---|---|
| | | | | | | |

## Paging and Refresh Contract

| Event | Requested page | Retain filters | Retain sort | Empty-last-page behavior | Refresh target |
|---|---|---|---|---|---|
| Initial load | | | | | |
| Search | | | | | |
| Page change | | | | | |
| Delete success | | | | | |
| Editor success | | | | | |
| Custom action success | | | | | |

## Detail and Write Contract

| UI field | Form control type | Detail DTO | Add DTO | Update DTO | Server-owned | Validation owner | Contract status |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Mode and Dirty-Exit Contract

| Mode or exit | Source | Loads detail | Editable | Primary action | Pristine behavior | Dirty behavior | Busy behavior |
|---|---|---|---|---|---|---|---|
| Create | | | | | | | |
| Edit | | | | | | | |
| View | | | | | | | |
| Cancel | | | | | | | |
| Close control | | | | | | | |
| Escape | | | | | | | |
| Route/back | | | | | | | |

## Child and Upload Contract

| Item | Client draft state | Backend/API owner | Validation | Transaction/reconciliation | Cleanup | Failure recovery | Contract status |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Action-State Contract

| Action | Owner surface | Visible when | Disabled when | Server permits when | Confirmation/input | Busy guard | Success state | Refresh | Failure recovery |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

## Route, Provider, and Event Contract

| Route/dialog/service | Mode/source | Provider/injector | Interceptor path | Event/result | Consumer | Refresh/exit | Risk |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Unresolved Requirements Register

| Requirement | Evidence | Status | Missing source or decision | Blocked phase | Safe work that may continue | Owner |
|---|---|---|---|---|---|---|
| | | | | | | |

## Findings and Handoffs

| Finding | Evidence | Owner phase | Consumer phases | Severity | Confidence | Resolution/status |
|---|---|---|---|---|---|---|
| | | | | | | |

## Final Reconciliation

| Contract/path | Producer artifact | Consumer artifact | Final source evidence | Status | Required action |
|---|---|---|---|---|---|
| | | | | | |

## Verification and Handoff

| Check | Performed | Evidence or pending owner step |
|---|---|---|
| Complete scoped diff reviewed | | |
| Stale imports/types checked | | |
| Routes/providers/interceptors checked | | |
| Frontend/backend contracts reconciled | | |
| English/Arabic translations checked | | |
| Mapping/server-owned fields checked | | |
| Merge markers/whitespace checked | | |
| Build | | |
| Tests | | |
| Browser/runtime | | |
| Database/migration | | |

