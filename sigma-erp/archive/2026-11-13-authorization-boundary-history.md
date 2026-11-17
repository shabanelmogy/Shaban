# Authorization boundary before current-session adoption

Historical reference. The active contract is in [UI26](../ui/26-permissions-and-route-access.md).
This record preserves the earlier backend boundary and frontend observations.


### Earlier backend boundary record — 2026-11-06

The owner-authorized tenant identity/authorization feature now adds the real ERP
`PermissionEndpointResolver` and `PermissionAuthorizationFilter`. Catalogue and
enforcement share one resolver; inherited supported operations, explicit
metadata, approved document operations and a fixed reviewed custom-operation
allow-list are grantable. An unknown operation fails closed for an ordinary
linked user. The signed tenant administrator still passes the owning domain
guards. This is source evidence, not build/runtime acceptance.

`AuthorizationConfigurationService` is an administration client for role/direct
grant snapshots, not the current session's permission evaluator. Its APIs use
the server `TenantAdmin` policy. Do not consume another user's administrative
snapshot as route/action authorization or invent a self-permission endpoint.
`AuthGuard` and the current routes still provide authentication only; a denied
API response must remain understandable without claiming a hidden button is
secured. Any later frontend grant consumer needs its own frozen API and route/
action adoption contract. The feature evidence is recorded under
`reviews/Authorization/PERMISSION_ENDPOINT_ENFORCEMENT_CONTRACT_FREEZE.md`.

The targeted 2026-10-23 observations and their temporary instructions below are historical context for that
frontend limitation; the old statement about commented API policies no longer
describes the current backend source.

**Transitional.** State of the app, targeted route check 2026-10-23 (API role policies are commented out; see the deferred plan):

- `src/app/app.routes.ts` guards the authenticated layout with
  `canActivate: [AuthGuard]`.
- `AuthGuard` (`modules/auth/services/auth.guard.ts`) is **authentication only**:
  it checks `authService.currentUserValue`, calls `getCurrentUser()` once if
  empty, and returns the login UrlTree with an internal returnUrl when no valid
  stored user can be restored (source correction2026-11-05). Storage/JSON/shape
  failure is unauthenticated state, not a router exception. Keep explicit logout
  on its existing guarded transition; login opens the internal URL with query
  and fragment preserved. This remains authentication, not permission enforcement.
- There is **no** permission service, no permission directive, no role or claim
  check in `auth.service.ts`, and no per-feature route guard.

**Unavailable account actions (2026-11-05).** Until a real registration or
password-reset API contract exists, the existing auth routes show a translated
unavailable state through StateMessage and a RouterLink back to login. Do not
collect credentials, simulate success or invent an endpoint for those routes.
Source: RegistrationComponent and ForgotPasswordComponent; runtime and bilingual
appearance acceptance remain pending.

So today: every signed-in user can reach every routed feature, and the backend
endpoint is the only real authorization boundary.

What this means when you build a screen:

- do not invent a permission API — none exists to call;
- do not hide a button and call it secured; hiding is cosmetic;
- when an action must be restricted, say so explicitly and confirm the backend
  enforces it;
- when row state rather than permission decides availability, use the
  `ActionList` hooks, which do exist:

```ts
{
  title: 'general.delete',
  icon: 'bi bi-trash',
  visible: (row) => row.canDelete === true,
  disabled: (row) => this.deletingId() === row.id,
  action: (row) => this.confirmDelete(row),
}
```

When a permission mechanism is introduced it belongs in `shared`, applied at the
route and at the action, and this block plus block 7 must be updated together.
Tracked in block 30, item 20; the design is deferred by the owner (2026-10-01) to
`reviews/Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`.

**Authorization candidates.** Until then, every screen review lists, in its review
artifact under *Authorization candidates*, the actions that clearly need a restriction
(delete or void posted data, approve, post, close a period, change settings or accounts),
with the endpoint each one calls. Do not hide or disable them for this reason; the list is
the permission inventory the deferred plan starts from.

**Check:** no fabricated permission call · restricted actions confirmed as
backend-enforced · `visible`/`disabled` used for row-state rules · no claim that
a hidden control is secure · restricted actions listed under *Authorization candidates*
in the review artifact.

---

