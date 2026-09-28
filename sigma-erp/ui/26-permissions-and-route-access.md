## 26. Permissions and route access

> **Status: Transitional** — authentication only; no authorization mechanism exists, backlog 20

**Transitional.** State of the app, verified 2026-08-06:

- `app-routing.module.ts` guards the whole layout with
  `canActivate: [AuthGuard]`.
- `AuthGuard` (`modules/auth/services/auth.guard.ts`) is **authentication only**:
  it checks `authService.currentUserValue`, calls `getCurrentUser()` once if
  empty, and logs out when there is still no user.
- There is **no** permission service, no permission directive, no role or claim
  check in `auth.service.ts`, and no per-feature route guard.

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
Tracked in block 30, item 20.

**Check:** no fabricated permission call · restricted actions confirmed as
backend-enforced · `visible`/`disabled` used for row-state rules · no claim that
a hidden control is secure.

---

