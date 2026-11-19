## 2. Service and response wrappers

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Mandatory screen cache gate and adoption checklist](02/01-cache-gate-and-checklist.md)
- [Selective reference lookup cache and active revalidation](02/02-reference-lookup-cache.md)
- [Settings reads, currency policy and dashboard snapshot caches](02/03-settings-and-policy-caches.md)
- [Batch-import transport and real-time read invalidation](02/04-import-and-realtime.md)

> **Status: Canonical** — `Result`/`Results` typed (decision D5-4, 2026-10-01)

### Write payloads carry client inputs only

> **Status: Canonical** (owner decision 2026-10-01)

An Add or Update payload contains only the fields the user edits plus `id` on Update. It never
contains:

- `subscriptionId`: the tenant comes from the token;
- the server-owned document `no`;
- audit values (`createdBy`, `createdAt`), `isDeleted`/`isActive` flags;
- approval or posting status;
- calculated totals.

The backend ignores all of them: `UpdateBaseVm` carries `Id` only and no write VM declares a
tenant (backend blocks 3 and 4, 2026-09-30). Sending them breaks nothing, but it keeps dead code
and implies the client owns them.

**Cleanup is part of every screen review, not a bulk change.** When a screen is reviewed,
remove from that screen, in the same change:

1. the `subscriptionId` form control and every `subscriptionId: …` in its payloads, child rows
   and dialogs, including `localStorage.getItem('subscriptionId')` and
   `BaseComponentService.subscriptionId` reads;
2. the server-owned `no` from Add/Update payloads. Keep `no` only where the user types a
   reference number that the backend declares explicitly on the Add and Update VMs (Cash
   Deposit, Card Transaction Bank Transfer and Purchase Return detail rows);
3. those members from the screen's **write** interfaces (Add/Update models). List and Detail
   models keep `subscriptionId`/`no` only when the screen displays them.

Then the owner compiles (`ng build`): the typed forms and write interfaces change together, and a
leftover reference shows up there. Do not bulk-edit other screens or strip the fields centrally
in an interceptor. Tracked as backlog 8 and 19.

**Check:** extends `BaseService` · empty filters dropped, not sent as `''` ·
`isSuccess` checked · payload types are real interfaces, never `unknown` · no `subscriptionId`,
server-owned `no`, audit, delete/active flag, status or calculated total in a write payload or
write interface of the reviewed screen.

---
