# Sigma Feature Review Artifacts: {{Feature}}

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |

Copy this file for one feature review. It records feature-specific evidence and
decisions; it does not create architectural authority.

Apply Master1's tier before copying: tier S uses a short existing-review entry;
tier M fills only applicable screen contracts; tier L consumes its Frozen plan.
Delete inapplicable empty sections instead of filling repetitive N/A tables.

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
| Maintenance / Evolution Plan | Not required / Frozen / Blocked + artifact path |

## Feature Review Manifest

| Item | Decision or evidence |
|---|---|
| Frontend scope | |
| Backend scope | |
| Direct shared dependencies | |
| Existing user changes | |
| Evidence IDs | |
| Analysis-guide review (Master2/4) | Relevant chapter and original screen-explanation IDs/links actually read, Sigma comparison, accepted/excluded items and gaps, or supported Not applicable |
| Sidebar/code cycle comparison (Master2/4) | Dated section/state/controller/service sources and file:line/hash, relevant document links/actions, evidence kind, actual Sigma owner/contract comparison and accepted/excluded/unresolved disposition; use Master4's rows |
| UI shapes | |
| Backend pattern | |
| Approved references | |
| Routes and modes | |
| Endpoints | |
| Actions | |
| Permission mechanism | Link the actual session/route policy and backend authorization contract (UI26, Master4) |
| Applicable phases | |
| Skipped phases and reason | |
| Explicit exclusions | |
| Maintenance/evolution plan status | |

## Screen user guide completion (Master7)

Complete for authorized frontend/full-stack screen implementation; for other
scopes record the applicable follow-up without expanding source-edit authority.
Create/update the guide after reconciling the screen and before final handoff.

| Screen/topic identity | Content file | Module guide route / sidebar entry | Final source supporting purpose, steps, actions and constraints | EN/AR coverage | Source status / owner verification pending |
|---|---|---|---|---|---|
| | | | | | |

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

For protected lists, record the exact server-approved direct filter, grid and
sort fields, their types and aliases. Reconcile the scoped count, aggregates,
paging and export under the minimum grants (BE9).

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

## Authorization Contract (UI26, Master4)

| Route, surface or action | Method/route and server owner | Permission/policy, assignability and prerequisites | Tenant, record and branch capability | UI condition and post-confirmation recheck | Source evidence and open findings |
|---|---|---|---|---|---|
| | | | | | |

| Sent write scenario | Settlement/draft owner | Result visibility | Refresh owner and still-allowed read scope | Evidence or pending check |
|---|---|---|---|---|
| Same session loses write while read remains | | | | |
| Actor/session changes during the request | | | | |

## Applicable Authorization Scenarios (Master5/7)

Reuse a row already holding this evidence instead of duplicating it. Select
only scenarios relevant to the approved contract and changed paths.

| Scenario and actor/branch capability | Entry path and producer/consumer symbols | Expected values, state and exit | Source evidence or open finding | Executed check or pending acceptance |
|---|---|---|---|---|
| Generated document into its next affected action | | | | |
| View or operation withdrawn then restored on a dirty draft | | | | |
| Sent write resolves during denial or after restoration | | | | |
| Generated-document read grant or print expires | | | | |

## Route, Provider, and Event Contract

| Route/dialog/service | Mode/source | Provider/injector | Interceptor path | Event/result | Consumer | Refresh/exit | Risk |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Success Feedback Contract

| Mutation/workflow | Success owner | Interceptor suppressed | Final success point | Duplicate-notification risk | Evidence/status |
|---|---|---|---|---|---|
| | Global interceptor / Feature composite / Silent by contract | Yes / No | | | |

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
| Protected GET and mutation carry Authorization through the expected interceptor chain | | |
| Exactly one success notification per successful mutation/workflow | | |
| Frontend/backend contracts reconciled | | |
| Least-privileged operation, saved record/branch and filter/sort scope checked across custom and inherited endpoints | | |
| Search survives edit-only lookup failure, expired filter overlays close and cancelled exit guard returns false | | |
| Test signatures, visibility, project inclusion and fixture scope reviewed | | |
| Operation mapping, latest findings, schema readiness and runtime acceptance linked from coverage | | |
| English/Arabic translations checked | | |
| Mapping/server-owned fields checked | | |
| Merge markers/whitespace checked | | |
| Scoped local build including affected test project | | |
| Affected tests and changed-file lint (Master5) | | Command, count, outcome |
| Browser/runtime | | |
| Database/migration (Master7) | | Migration ID, target and history/schema/row checks, or pending owner action |
