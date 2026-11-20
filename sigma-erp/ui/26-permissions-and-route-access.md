## 26. Permissions and route access

> **Status: Transitional** — current-session access exists for explicitly adopted routes/actions; remaining screen adoption is tracked, and backend authorization remains authoritative

### Current-session access and adoption
The owner subsequently requested and authorized current-session UI permission
consumption: a signed, linked tenant administrator sees available company
functions; ordinary users see their active-role/direct-grant union. The frozen
implementation scope is
`reviews/Authorization/CURRENT_ACCESS_IMPLEMENTATION_CONTRACT_FREEZE.md`, with
actual acceptance and pending adoption in `CURRENT_ACCESS_RUNTIME_ACCEPTANCE.md`.
Adoption is tracked per feature and action. See the adoption evidence below.

- ERP `GET /Authorization/me` reads only the signed-in actor, verifies its
  tenant/link/activity and returns a limited access DTO. It is separate from
  the TenantAdmin administrative workspace and accepts no user/tenant selector.
  A role named Admin in ERP cannot create the signed administrator claim.
- `CurrentAccessService` owns one session-scoped read, lifecycle/generation,
  refresh and ready/error/unlinked states. Shared permission evaluation and
  `AccessViewPolicyService` provide reactive presentation without duplicating
  the HTTP session owner. Explicit requirements fail closed before readiness;
  do not introduce production bypasses to preserve isolated tests.
- `RouteAccessPolicyRegistry` and `currentAccessGuard` consume explicit,
  source-reconciled policies. The same policy filters sidebar navigation,
  search, recent links and shortcuts. Unknown ordinary-user routes stay closed.
  A resource name found in a nearby BaseService is insufficient evidence: trace
  the active route/component/request to its real endpoint and action.
- `AuthGuard` establishes authentication. ERP `PermissionEndpointResolver` and
  `PermissionAuthorizationFilter` enforce reviewed operations for the linked
  actor and share the catalogue resolver. `AuthorizationConfigurationService`
  supplies administrative role/direct-grant snapshots under `TenantAdmin`.
  Use the self-access contract for current-session route and action decisions.
  The backend scope is recorded in
  `reviews/Authorization/PERMISSION_ENDPOINT_ENFORCEMENT_CONTRACT_FREEZE.md`.
- Use `appAuthorize` or explicit permission inputs on existing shared action
  owners; retain row-state visible/disabled checks. See block7. Do not infer
  grants from a translated title, icon, HTTP verb or role display name. An
  unannotated control is not evidence of completed adoption.
- An unlinked/inactive/mismatched actor receives one setup/access state, not
  parallel dashboard/branch/translation failures. Required shell bootstrap
  waits for current access. CurrentBranch and language options/runtime are
  narrowly reviewed actor-context reads; they do not expose language editing
  or grant every business lookup. Mock generation/settings retain their own
  keys and must not be requested merely because a form mounted.
- Keep required read lookups and edit-only lookups separate (UI16). Close
  open body-appended filter selects and date pickers when the owning read
  grant, session or branch context expires. A protected host's hidden/inert
  state only covers descendants. Apply the same ownership rule to editors
  and their overlays (UI13).
- A successful refresh may withdraw route/action access. Hide/inert protected
  content while retaining an existing editor and independent sent-write
  outcomes; preserve dirty-exit guards (UI28). Do not mount initial routed
  business content before its required branch bootstrap (UI22). Reset session
  projections on account/tenant change and reject late responses.
- `AccessViewPolicyService.denied$(requirement)` belongs on the individual
  **read** stream. It emits immediately when the requirement is absent and
  expires a subscribed read when the requirement is withdrawn or its captured
  actor/branch-access context changes. `dataContext()` identifies that read
  context for clearing old outputs. Keep outer search triggers alive so a new
  grant can enable a fresh request; do not apply this notifier to sent writes.
  This is a local lifecycle notification from the same evaluator, with no
  extra permission request or second grant cache.
- For an access-scoped sent mutation, fence its global result notification with
  the same owner callback as its local result. Pass that callback in the
  interceptor-owned `CAN_PRESENT_API_OUTCOME` HTTP context token.
  `AdministrativeDefinitionSession.trackWrite()` prepares the context for
  definition screens. Pass it through the concrete service call. The token
  interceptor also checks this callback before dispatch after asynchronous
  token renewal. Once the request is sent, the callback controls feedback.
  Data invalidation, 401 handling and the 403 access refresh retain their
  existing owners.
  On successful settlement, refresh the affected projection for the original
  auth session if it still has permission to read it, including when a grant
  revision or write revocation suppresses the notification. Scope the fresh
  read to current access. A replaced session receives no old feature result.
  Reconcile local draft consumption independently of notification and refresh
  (UI28).
- Keep access/context invalidation separate from busy/form-state effects. An
  effect which clears output and also reads loading/printing/saving signals
  clears successful output again when the request finalizes. Fence its tracked
  dependencies to the access/context keys; run any bootstrap work untracked or
  through its existing request owner. Regrant must restore required lookups,
  while sent writes and editor drafts keep their existing lifetime. Regression
  acceptance includes request start, response/completion, effect stabilization,
  and revoke/regrant on the same mounted consumer (Assets,2026-11-07).
- Protected mounted hosts which use both `hidden` and `inert` must remain
  visually hidden despite an author `display:flex/block`. The existing shared
  layout stylesheet owns this precedence for `sigma-list-page`, `sigma-list-table`,
  `sigma-editor-page` and `sigma-editor-form`; ReportPage owns it on its own
  host. Reuse those owners instead of copying a rule to each feature. Both
  attributes distinguish access-hidden surfaces from ordinary inactive panels
  whose print visibility follows UI21. Real-template/computed-style source
  specifications retain local inputs across denial/regrant; execution and
  visual acceptance remain pending in this source-only slice (2026-11-07).
- `appAuthorize` destroys its embedded view when denied. Use it for disposable
  controls, not a stateful editor/import workspace that owns a draft or a sent
  mutation. `CsvImportWorkspace.permission` hides/inerts the existing host and
  prevents new imports while preserving its parsed draft and sent result.
  Keep its existing busy/error/finalize behavior and use explicit source keys
  in each adopted import consumer. Recheck a permission after confirmation,
  immediately before starting a new write.
- The shared `MockDataFormComponent` binds its mounted owner to
  `AccessViewPolicyService.dataContext()` for availability, preview and Apply.
  Another actor with the same grants cannot use the old preview. Recheck the
  form/route requirement after its replace confirmation, before generation.
  Generation is a read that produces draft candidates; cancel its decision and
  request through `denied$` when its required grants or actor context expire,
  and release its freeze without applying candidates or retrying automatically.
  Preserve the owning editor's original draft and sent business writes.
  Actor-switch regression specifications are source-written; runtime acceptance
  remains pending (2026-11-09).
- Recheck the session after local access changes, on focus/visibility and a
  bounded active-session interval; one denied API response may refresh policy,
  never automatically replay a rejected write or log out every403. The server
  checks current grants per request; visual refresh can lag. Signed Identity
  admin-claim revocation has its own token lifecycle and is not implemented by
  removing an ERP role.

Track adoption per route/list/editor/action and actual backend key, including
exports, related links and initial lookups. Record source evidence separately
from executed acceptance. For each row action, combine the operation grant,
prerequisites and domain state with the required capability on the saved
branch or branches. Use server-supported scope or eligibility evidence in the
UI and recheck before dispatch after confirmation. The server enforces the
rule on the stored record. For a branch-valued reference on a tenant-shared
definition, follow its documented view or transaction requirement and verify
the scope used by the actual write path (BE8). See the authorization contract
in Master4 and the least-privileged cases in Master7 and BE9.

The coverage record links the latest review and shows source mapping, open
findings and their disposition, schema readiness and runtime acceptance.
Update those entries when newer evidence changes the recorded state.

Field confidentiality and branch/record scopes need
their own backend DTO/query/write contracts; hiding an element does not keep
its JSON/export/Hub payload confidential. Subscription-plan eligibility is a
separate contract, not an implicit role grant.

### Reviewed permission metadata and renewal adoption
The ERP resolver carries endpoint TenantAdminOnly metadata to enforcement and
catalogue exclusion. Keep these financial administration operations out of
assignable role and direct grants. Fiscal-year closing/checks, month closing/
reopening/status/update/checks and opening-balance configuration currently use
this contract. Existing domain checks remain part of execution.

PermissionPrerequisites owns the reviewed ERP operation dependencies. Its
static requiredPermissionKeys and conditionalRequirements are published by the
catalogue and evaluated from that same owner at request time. Preserve request
conditions, tenant, branch and primary-grant checks. Role editors show missing
fixed keys and let the administrator add them to the draft explicitly. A
partial role remains valid because another active role or direct grant can
supply a dependency. User-access previews evaluate the union and show grant
sources. Screen packages use the same Angular requirement objects as routes,
lists and editors. Journal voucher create/edit are the current named packages;
remaining adopted compound route requirements can be inspected from the route
registry. Each later package needs source reconciliation before publication.

**Data capabilities inside an authorized response.** A permission that hides data
within an endpoint the actor may already call (not an endpoint of its own) is an
assignable capability: add it to `CapabilityPermissions.Entries` so the catalogue
lists it, give it a `PermissionPrerequisites` entry (normally the read action), and
translate its action under `authorization` actions. The owning controller evaluates
it from `CurrentAccessService` (tenant admin or granted key; any failure denies)
and passes a boolean to the service, which omits the gated values (null) and
returns a flag such as `CanViewCharges`. The UI follows that server flag for
columns, totals, print and export; never rely on hiding alone. Example:
`TripsWithOvertimeReports.ViewCharges`.

Use complete literal translation keys for conditional rules and requirement
groups. A static map translates each known server condition; use a translated
generic condition for an unknown identifier. The shared API error dialog maps
the prerequisite and three administrator error codes on 403 to the current
language. Keep named-package coverage and runtime acceptance in the feature
review instead of treating every catalogue entry as a complete screen package.

The Angular session owner now renews ordinary credentials before an ERP request
near expiry on the supported HTTPS/Web Locks path. Stateful consumers capture
readAuthSessionKey and observeAuthSession for mounted session ownership.
HTTP and SignalR continue to use readAuthToken, with SignalR observing actual
credential rotation. A renewal retains the session key and draft; a fresh
login, delegation, company or actor change expires old outputs. Keep the
current dataContext and grant checks alongside this key. Session renewal
source adoption has runtime acceptance pending; token lifetime reduction and
live ERP security-stamp verification remain separate pending H1 work.

### Authentication and account routes

- `AuthGuard` (`modules/auth/services/auth.guard.ts`) is **authentication only**:
  it checks `authService.currentUserValue`, calls `getCurrentUser()` once if
  empty, and returns the login UrlTree with an internal returnUrl when no valid
  stored user can be restored. Storage/JSON/shape
  failure is unauthenticated state, not a router exception. Keep explicit logout
  on its existing guarded transition; login opens the internal URL with query
  and fragment preserved. This remains authentication, not permission enforcement.

**Unavailable account actions (2026-11-05).** Until a real registration or
password-reset API contract exists, the existing auth routes show a translated
unavailable state through StateMessage and a RouterLink back to login. Do not
collect credentials, simulate success or invent an endpoint for those routes.
Source: RegistrationComponent and ForgotPasswordComponent; runtime and bilingual
appearance acceptance remain pending.

### Adoption history

See the [historical authorization boundary](../archive/2026-11-13-authorization-boundary-history.md)
for the earlier authentication-only frontend and adoption notes.

---
