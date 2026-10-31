## 28. Request cancellation and stale responses

> **Status: Canonical**

### Context revisions and deferred actions (source-only,2026-10-30)

The existing data-free scope notification also fences reviewed operational
sessions: clear prior-context rows/labels/counts, cancel reads (including whole
composed export/report reads), and keep the outer query trigger alive for a
fresh request. A pending confirmation captures its context revision before it
opens; matching an ID alone cannot authorize its callback after a reset, because
different contexts may reuse that ID. Invalidate editors/action sessions until
reopened with current data. Never cancel or automatically repeat an independent
write already sent; its old-session callback must not mutate current-session
state. Preserve finalization and busy/exit safety. UI21 owns cancelling pending
print preparation; UI2 owns reference-cache eligibility, watches and clearing.
Equipment Rental's source audit applies these rules to its actual consumers;
this is not a new cache opt-in, permission model or runtime proof.

### Routed API read cancellation (owner2026-10-22)

The shared navigationActivityInterceptor supplements component teardown for
Sigma API page reads. Capture the subscribed request's current navigation ID,
or last successful navigation ID, using Angular21's Router signals, and its
parsed target/current URL path. Cancel its subscription only after a different
NavigationEnd with a different page path. Keep path, matrix and outlet identity;
ignore query parameters and fragments. Serialize a new UrlTree with the parsed
root and default empty query/fragment; UrlSegmentGroup.toString alone omits child
outlet segments and is not a page key. Lists synchronize search/paging in the URL
while retaining the same page and its bootstrap lookups. Cancelling those reads
can complete a forkJoin without a value and leave action readiness false (Individual
Edit contact group regression,2026-10-22). Same-page request replacement remains
owned by the existing switchMap/identity checks, not navigation IDs alone.
A rejected navigation must
not cancel the current page read, and a read begun for the target navigation
must survive that same navigation's end. No mutation is cancelled on navigation.
This aborts a pending client HTTP request where supported; it never proves the
server stopped work or rolled back. Keep local identity/switchMap/teardown guards
for same-page races and deferred work.

Use KEEP_READ_ON_NAVIGATION only for genuinely session-owned reads: CurrentBranch
options/current value, runtime localization and its language options, and shared
mock-data preferences. Preserve their session-version/cancellation owners.
NAVIGATION_READ_ONLY explicitly classifies a read-only POST; do not guess from
an endpoint name. Third-party/auth-server/assets requests retain the established
Sigma API-origin boundary and are not intercepted by this policy.

Every subscription is torn down with `takeUntilDestroyed`, which is the app-wide
pattern:

```ts
this.service.getList(query)
  .pipe(
    takeUntilDestroyed(this.destroyRef),
    finalize(() => this.loading.endLoading()),
  )
  .subscribe({ … });
```

**Independent editor bootstrap reads (2026-10-17).** When opening an editor
requires both a navigation-identity snapshot and fresh detail, independent
HTTP requests may join through forkJoin rather than waiting sequentially.
Validate both envelopes and record/source identity before opening. Carry the
fresh initial detail through a typed parent/child session and hydrate once;
Retry/navigation/Reset still use authoritative detail reads. Freeze the key
snapshot and preserve limits, membership, cancellation, errors and busy gates.
Never substitute stale list data for fresh detail. Separate HTTP scopes may
overlap; do not parallelize EF queries on the same backend DbContext. Evidence:
Languages text-editor bootstrap; actual latency remains owner-measured.

`destroyRef` is `inject(DestroyRef)` in newer components and a constructor
parameter (`private destroy$: DestroyRef`) in older ones such as the Company
editor. Either is fine — match the file you are editing.

**Deferred UI work follows the same lifetime.** Inspect the installed Angular
declarations, not a newer online API or an assumed property. The current
Angular21 `DestroyRef` exposes both `onDestroy` and `destroyed`. Use
`takeUntilDestroyed` for observable cancellation; use `destroyed` only for a
narrow deferred-callback guard when the edited source needs that check. A
deferred print after detail rendering can reuse the existing RxJS cancellation
owner:

```ts
import { timer } from 'rxjs';

timer(0)
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(() => this.print()); // print checks loaded detail/readiness
```

This preserves one deferred turn and unsubscribes before execution when the
component is destroyed. If retaining an existing native timer or animation
frame, register its `clearTimeout`/`cancelAnimationFrame` through
`DestroyRef.onDestroy` instead. Keep the feature's loaded-record/identity
checks; cancelling HTTP alone does not cancel a separately scheduled callback.
Do not upgrade Angular or add a cancellation framework for this local fix.
LeaseQuotation and LeaseMasterAgreement auto-print are the repair examples;
source evidence is the installed `@angular/core/index.d.ts` plus the consumer
subscriptions, and owner compilation/runtime acceptance remains pending.

Teardown handles destroy. It does **not** handle a slower earlier response
landing after a newer one. Two request cases to guard:

**Rapid re-search, paging and refresh.** Disabling Search prevents a second Search
click, but it does not prevent a lazy-page or Refresh event from overlapping the
current request. Drive list queries through `switchMap` so the previous HTTP
request is cancelled before the next one starts. Reference: `Workshop/Job/components/list`
(`bindListQueries`); its load error is shown inline, so the request sends
`X-Skip-Error-Interceptor` and reads the message with `apiErrorMessage` (block 22). The snippet
below shows the same shape on Company:

```ts
private readonly listQuery$ = new Subject<CompanyPartnerListQuery>();

ngOnInit(): void {
  this.listQuery$
    .pipe(
      switchMap((query) =>
        defer(() => {
          this.searching.set(true);
          this.loading.startLoading();
          return this.service.getList(query).pipe(
            catchError(() => {
              this.showError('companyPartners.loadError');
              return EMPTY; // keep listQuery$ alive for the next attempt
            }),
            finalize(() => {
              this.searching.set(false);
              this.loading.endLoading();
            }),
          );
        }),
      ),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((response) => this.applyListResponse(response));
}

private requestList(query: CompanyPartnerListQuery): void {
  this.listQuery$.next(query);
}
```

`defer` is important: when a new query arrives, `switchMap` first unsubscribes
the previous request (running its `finalize`), then starts the new loading cycle.
The shared `LoadingService` is a reference counter (block 22), so the cancelled request's
`finalize` and the new request's start keep the spinner correct.

**Row/dialog detail requests.** Discard a late response by identity as well as
tearing it down on destroy:

```ts
openRevise(item: StaffGridRow): void {
  this.reviseStaff.set(item);
  this.service.getSalaryRevision(item.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        // Ignore a response for a row the user has already moved away from.
        if (!this.reviseVisible() || this.reviseStaff()?.id !== item.id) return;
        …
      },
    });
}
```

**Dialog closed mid-flight.** Check the dialog is still open before patching its
form, as above.

Do not introduce NgRx, an application-wide request-sequence service, or a custom
cancellation framework for this. A local trigger stream plus `switchMap`, and an
identity/open-state check for dialogs, are enough.

**Dependent lookups follow the same rule.** A lookup triggered by a field change (vehicle →
vehicle card, customer → contracts) goes through a `Subject` + `switchMap`: the previous request is
cancelled, the card is cleared while loading, an error shows a message, and saved-record
fallbacks apply only while the saved value is still selected (reference: Job editor vehicle card,
2026-09-30).

**Check:** every subscription has `takeUntilDestroyed` · the trigger is disabled
while its request runs · list refresh/paging uses `switchMap` · late dialog
responses discarded by row id or open-state check · `finalize` releases loading
on success, failure and cancellation · no new state framework added · field-triggered lookups use `Subject` + `switchMap` with an error message.

---
