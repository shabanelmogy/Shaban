# Send SMS to Lease Customer — Contract Freeze

Date: 2026-08-25  
Status: Recipient read/route and SMS simulation Implemented; real delivery Blocked  
Scope: Add a Lease sidebar route, a canonical tenant-scoped list of customers
who have Lease Agreements, and an explicitly labelled non-persistent SMS
simulation. Do not claim delivery or fabricate provider balances.

## Authority and selected shapes

- Authority: `SIGMA_FEATURE_REVIEW_MASTER.md`; canonical UI feature wiring,
  service wrapper, header, filter, typed columns, shared data table, loading,
  translations, accessibility, RTL/theme, and cancellation blocks; canonical
  backend Pattern 5 derived operational read-model and edge-case blocks.
- Approved UI reference: the canonical `app-feature-title` + filter form +
  `app-data-table` list shape. Fleet Alerts is the approved current-source
  reference for typed operational paging and selection only after an action is
  frozen.
- Approved backend reference: `IFleetAlertsService`, `FleetAlertsService`, and
  `FleetAlertsController` as a read-only reference for an explicit operational
  service/controller over existing aggregates. These reference files are not
  modified.
- Generated phase packets 00–06 are stale. Canonical guides and current source
  own this implementation; generated files are not edited.
- The screenshots are functional/content evidence only. They contain no
  implementation instructions and do not own Sigma layout, table, controls,
  styling, paging, accessibility, RTL, or theme behavior.

## Feature Review Manifest

| Item | Decision/evidence |
|---|---|
| Requested outcome | Add a Lease sidebar item named “Send SMS to Lease Customer”. |
| Frontend scope | Routed Lease feature, typed list/action models and service, current-page checkbox selection, message composer, simulated Send action, page route, last Lease sidebar item, interceptor-enabled provider registration, and English/Arabic translations. |
| Backend scope | Explicit recipient read plus authenticated simulation action interface/service/controller and minimal request/result VMs. |
| Existing source authority | Lease Agreement `CustomerId` links to tenant-scoped `Partner`; individual mobile is `IndividualPartner.MobileNo`, company mobile is `Company.Phone1`, email/code/name/status are Partner-owned. |
| Persistence | No new entity or duplicated log. Recipient rows are derived from existing Partners and Lease Agreements; simulations are not persisted. |
| Authentication/authorization | Existing layout `AuthGuard` and backend `[Authorize]`; no permission API is invented. |
| Existing working tree | Uncommitted Lease Agreement Additional Charges, Charge Settings, translations, two owner-created migrations, and snapshot changes are user-owned and preserved. |
| Lease navigation follow-up | The “Closed Lease Agreements” item is removed from the Lease sidebar only. Its route and the separate closed-lease data-import option remain available and unchanged. |
| Explicit exclusions | No real SMS provider call, delivery claim, provider balance, message log entity, database migration, export, or print. |

## Screenshot evidence

### E1 — `Lease To Customer1.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| “Send SMS to Lease Customer” title | Explicit | Routed Lease screen and sidebar label | 5 | Translated `app-feature-title` and Lease submenu route. |
| Search input | Explicit | Search recipients | 2 | Typed search form; backend searches code, name, mobile, and email. |
| Checkbox column | Explicit | Select recipients for a batch action | 4 | Frozen for current rendered page; selection resets whenever the list context changes. |
| Code, Name, Mobile No, Email, Status | Explicit | Recipient list columns in this order | 2 | Typed `app-data-table` columns. |
| Repeated visible customer values | Uncertain | Screenshot may contain duplicate customer records or agreement-derived repetition | 1 | One row per tenant Partner identity to prevent accidental duplicate recipient identities. |

### E2 — `Lease To Customer2.PNG`

| Evidence | Classification | Required feature behavior | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| SMS message textarea | Explicit | User enters message text | 3/4 | Frozen for simulation as trimmed, non-empty text. No provider segmentation rule is invented. |
| Send with selected count | Explicit | Batch send selected recipients | 4 | Frozen as “Simulate Send”; the UI and result state explicitly state that no SMS was delivered. |
| Marketing SMS balance | Explicit label/value | Show authoritative marketing balance | 1/4 | Blocked: no balance source or unit exists in Sigma source. |
| Transaction SMS balance | Explicit label/value | Show authoritative transaction balance | 1/4 | Blocked: no balance source or unit exists in Sigma source. |
| Selected checkmarks | Explicit | Batch selection state | 4 | Frozen to current rendered page using Partner IDs as stable identities. |

## Frozen recipient read contract

### API

`GET LeaseCustomerSms`

Query parameters:

| Parameter | Type/default | Rule |
|---|---|---|
| `pageNo` | nullable integer, default 1 | Clamp to at least 1. |
| `pageSize` | nullable integer, default 10 | Clamp to 1–200. |
| `search` | nullable string | Trim; search Code, Name, resolved Mobile No, and Email. |
| `sortField` | nullable string, default `code` | Whitelist `code`, `name`, `mobileNo`, `email`, `status`. |
| `sortOrder` | integer, default 1 | `-1` descending; all other values ascending. |

Response: `Results<LeaseCustomerSmsListVm>` with exact backend ordering and
`TotalCount` from the filtered query. Zero rows is success.

### Grid/ListVM parity

| Grid need | Frontend property | Backend ListVM property | Contract status |
|---|---|---|---|
| Stable row identity | `id` | `Id` | Frozen — Partner identity. |
| Code | `code` | `Code` | Frozen — `Partner.No`. |
| Name | `name` | `Name` | Frozen — `Partner.Name`. |
| Mobile No | `mobileNo` | `MobileNo` | Frozen — individual `MobileNo`, company `Phone1`. |
| Email | `email` | `Email` | Frozen — `Partner.Email`. |
| Status | `isInactive` | `IsInactive` | Frozen — frontend renders translated Active/Inactive. |

Recipient scope is one non-deleted tenant Partner per identity, of Individual or
Company type, with at least one non-deleted tenant Lease Agreement. Closed and
invoiced agreements still establish that the Partner is a Lease customer; the
row status describes the customer, not an agreement.

No AutoMapper profile is required: the service owns an explicit minimal query
projection. No domain calculation or schema migration is introduced.

## Frozen frontend/integration contract

- Route path: `/LeaseCustomerSms`, lazy-loaded from
  `modules/Lease/LeaseCustomerSms/lease-customer-sms.routes.ts`.
- Lease submenu item: `sideMenu.leases.sendSmsToLeaseCustomer` with an SMS icon,
  positioned as the last item in the Lease submenu.
- `LeaseCustomerSmsService` is also registered in `LayoutModule.providers` so it
  resolves the interceptor-enabled `HttpClient`.
- The page uses one translated feature title, one real search form, one shared
  `app-data-table`, backend paging/sorting, explicit loading/error/empty states,
  `switchMap` stale-request cancellation, and matching English/Arabic keys.
- The page uses current-page checkbox selection, a typed non-empty message
  composer, a selected-count action, and explicit simulation/result notices.
- Selection clears on search, clear, paging, sorting, reload, or successful
  simulation. Provider balances remain absent because no authoritative source
  exists.

## Frozen simulation action-state contract

`POST LeaseCustomerSms/simulate`

Request: `SimulateLeaseCustomerSmsVm`

| Field | Contract |
|---|---|
| `CustomerIds` | Required non-empty list of positive Partner IDs; duplicates normalize to one identity. |
| `Message` | Required after trimming. No provider-specific maximum, encoding, or segmentation rule is applied. |

The backend reuses the tenant/soft-delete scoped recipient query and requires
every requested identity to remain an eligible Lease customer. Rows with a
non-empty resolved mobile number count as simulated; rows without one are
reported as skipped. If no selected customer has a mobile number, the action
fails safely. The action makes no network call, writes no entity/log, consumes
no balance, and is repeatable without side effects.

Response: `Result<LeaseCustomerSmsSimulationResultVm>` containing
`RequestedCount`, `SimulatedCount`, and `SkippedWithoutMobileCount`. Every
success message and visible result states that this was a simulation and that
no SMS was sent.

| UI state | Action behavior |
|---|---|
| No selected rows | Composer, selected count, validation, and action button are hidden. |
| Blank message | Disabled; attempted submission shows translated message validation. |
| List loading or simulation pending | Selection/action inputs are guarded; duplicate submission is prevented. |
| Success | Show translated counts, clear selection and composer, keep the list. |
| `isSuccess: false` or HTTP error | Keep current selection/message and show one safe inline translated error. |

## Blocked real-delivery contract

| Action | Status | Exact missing decision/source |
|---|---|---|
| Deliver SMS through a provider | Blocked | Provider/gateway and credential/config ownership; marketing vs transaction routing; provider request/response API; authoritative balance endpoint and units; phone normalization/country rules; recipient eligibility and opt-out/compliance; message length/Unicode/segment rules; partial delivery, retry/idempotency and concurrency behavior; persisted delivery/log/status ownership. |

Once supplied, Phase 1 must refreeze the real provider boundary and replace or
extend the simulation deliberately. Customer IDs—not row indexes or phone
numbers—remain the stable request identities unless that contract changes.

## Phase handoff

| Phase | Result |
|---|---|
| 0 — discovery/evidence | Complete. Screenshot fields and current Sigma source traced. |
| 1 — domain/API | Recipient read and simulation action Frozen; real delivery Blocked by the exact decisions above. |
| 2 — read/grid | Implemented against the Frozen recipient contract. |
| 3 — detail/write | Complete: typed simulation composer only; no persistence/upload. |
| 4 — domain action | Complete for authenticated, non-persistent simulation. Real delivery remains Blocked. |
| 5 — integration/runtime | Complete: route/provider retained and menu item is last in Lease. |
| 6 — reconciliation | Complete by source inspection; build, runtime, database, and browser verification remain owner-pending. |
