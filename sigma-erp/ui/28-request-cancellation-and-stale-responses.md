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

That handles destroy. It does **not** handle a slower earlier response landing
after a newer one. Two cases to guard:

**Rapid re-search, paging and refresh.** Disabling Search prevents a second Search
click, but it does not prevent a lazy-page or Refresh event from overlapping the
current request. Drive list queries through `switchMap` so the previous HTTP
request is cancelled before the next one starts:

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
The shared `LoadingService` is currently a plain boolean, not a reference
counter, so unrelated concurrent callers can still hide each other's spinner;
that shared defect is backlog 27.

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

**Check:** every subscription has `takeUntilDestroyed` · the trigger is disabled
while its request runs · list refresh/paging uses `switchMap` · late dialog
responses discarded by row id or open-state check · `finalize` releases loading
on success, failure and cancellation · no new state framework added.

---

