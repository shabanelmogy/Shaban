## 28. Request cancellation and stale responses

> **Status: Canonical**

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

`destroyRef` is `inject(DestroyRef)` in newer components and a constructor
parameter (`private destroy$: DestroyRef`) in older ones such as the Company
editor. Either is fine — match the file you are editing.

**Deferred UI work follows the same lifetime.** Inspect the installed Angular
declarations, not a newer online API or an assumed property. Sigma's current
Angular17.3.12 `DestroyRef` exposes `onDestroy`, but not `destroyed`; do not read
`destroyRef.destroyed`. A deferred print after detail rendering can reuse the
existing RxJS cancellation owner:

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
