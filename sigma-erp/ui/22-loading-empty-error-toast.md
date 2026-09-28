## 22. Loading, empty, error, toast

> **Status: Canonical**

**Page loading** — `LoadingService` drives the global spinner. Always pair
start with `finalize`:

```ts
this.loading.startLoading();
this.service.getList(query)
  .pipe(
    takeUntilDestroyed(this.destroyRef),
    finalize(() => {
      this.searching.set(false);
      this.loading.endLoading();
    }),
  )
  .subscribe({ next: …, error: … });
```

**What drives the global loader.** Use it for screen-level data loads and page
fetches, destructive or domain row actions (accept, reject, delete, void),
editor detail loading, and editor save. `LoadingService` is a single boolean
(backlog 27), so any `endLoading()` hides the spinner for everyone. Auxiliary
lookups that run at the same time as the primary load (for example
`loadLookups()` next to `loadData()` in `ngOnInit()`) therefore **must not**
call `startLoading()` / `endLoading()`. Otherwise the lookup finishing first
dismisses the loader while the grid is still fetching.

**Local busy flags** for per-action state: `searching`, `saving`, `revising`,
`contactGroupSaving`, `loadingList`. Bind them to the control they describe:
`[loading]="loadingList()"` on `app-data-table` and on the Search button
(`app-primary-action-button` takes `[loading]`, not `[busy]`), and
`[saving]="saving()"` on `app-editor-dialog`. Skip a table request when page
number and page size have not changed.

**Lookup failures stay visible.** A required Create/Edit option list that fails
shows its error; never hide it by returning empty options or by making a
protected endpoint anonymous. Diagnose by HTTP status before changing the UI:
`401` authentication (token missing, expired, or signed by a different auth
server; also check that the service resolves from the interceptor-equipped
`LayoutModule` injector, block 1), `403` authorization, `404` route mismatch,
`0` transport/CORS, `5xx` server. Never copy bearer tokens into logs,
screenshots, or messages.

**Success toast — single owner.** The global `errorInterceptor` owns the one
success toast for standard `POST`, `PUT`, `PATCH`, and `DELETE` responses whose result has
`isSuccess: true` and a non-empty `message`. The feature subscription owns its
local state, close event, and refresh only; it must not inject `MessageService`
and add another success toast for the same response. This applies equally to
state-changing actions such as close, void, approve, post, and delete.

**Duplicate-success prevention gate.** For every mutation, decide the toast owner
before writing the subscription:

- **standard mutation:** interceptor owns success; the feature must not call
  `messageService.add({ severity: 'success', ... })`, `showSuccess(...)`, a
  success SweetAlert, or another success surface for that same response;
- **composite workflow:** feature owns the final success only after all required
  follow-up work succeeds; the mutation request must carry
  `X-Skip-Success-Toast` so the interceptor stays silent;
- **no response message / deliberately silent mutation:** do not manufacture a
  second generic success merely because the request returned 2xx unless the
  workflow explicitly owns that feedback.

A source review that finds a manual feature success toast immediately after a
standard successful mutation must treat it as a duplication defect unless that
request demonstrably suppresses the interceptor toast. Registering
`errorInterceptor` in more than one active `HttpClient` chain is also invalid;
there must be one interceptor execution path per request.

A composite Save is different when the user-visible operation is not complete at
the mutation response. If a successful mutation must be followed by required
row/state/detail reloads before the screen can safely represent the committed
result, the success message belongs to the **complete workflow**, not the first
HTTP response. Suppress the mutation interceptor toast with the existing
`X-Skip-Success-Toast` request header and emit exactly one feature success toast
after all required refreshes succeed and loading has ended. Do not use a timer or
network delay to reorder feedback.

`BaseService.addSettingList` exposes the approved convenience option for this
case:

```ts
let saveSuccessMessage: string | null = null;
this.saving.set(true);
this.loading.startLoading();
this.service
  .addSettingList<Result<unknown>>(
    payload,
    { skipSuccessToast: true },
  )
  .pipe(
    switchMap((result) => {
      if (!result.isSuccess) {
        this.showBusinessFailure(result.message);
        return EMPTY;
      }
      saveSuccessMessage = result.message;
      return forkJoin({
        rows: this.service.get<Results<Row>>(),
        state: this.stateService.load(true),
      });
    }),
    finalize(() => {
      this.saving.set(false);
      this.loading.endLoading();
      if (saveSuccessMessage) this.showSaveSuccess(saveSuccessMessage);
    }),
  )
  .subscribe({
    next: ({ rows, state }) => {
      const failed = [rows, state].find((response) => !response.isSuccess);
      if (failed) {
        saveSuccessMessage = null;
        this.showBusinessFailure(failed.message);
        return;
      }
      this.replaceRows(rows.entities ?? []);
    },
    error: (error) => {
      saveSuccessMessage = null;
      this.showTransportFailure(error);
    },
  });
```

If the mutation succeeds but a required refresh fails, clear the pending success
message and do not show success because the current screen cannot yet represent
the committed state reliably.

```ts
next: (result) => {
  if (!result.isSuccess) { this.showError(result.message); return; }
  this.form.markAsPristine();
  this.closed.emit(true);
}
```

**Error toast** — same shape, `severity: 'error'`, longer life:

```ts
private showError(message?: string): void {
  const detail = message?.startsWith('companyPartners.')
    ? this.translate.instant(message)
    : message || this.translate.instant('companyPartners.operationError');
  this.messageService.add({
    key: 'global',
    severity: 'error',
    summary: this.translate.instant('companyPartners.errorTitle'),
    detail,
    life: 5000,
  });
}
```

Handle **both** failure channels. `isSuccess: false` is a business failure and
`error:` is a transport failure — neither may pass silently:

```ts
.subscribe({
  next: (response) => {
    if (!response.isSuccess) { this.showError(response.message); return; }
    …
  },
  error: () => this.showError(),
});
```

`error: () => undefined` is never acceptable. Treat any occurrence found during
a feature review as a current defect and replace it with the feature's declared
business/transport failure handling.

**Dialog states** — loading, empty and content are explicit:

```html
@if (agreementsLoading()) {
  <div class="individual-dialog-state">
    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    {{ 'Please wait...' | translate }}
  </div>
} @else if (agreements().length === 0) {
  <div class="individual-dialog-state is-empty">
    <i class="bi bi-journal-x" aria-hidden="true"></i>
    <strong>{{ 'companyPartners.noAgreements' | translate }}</strong>
  </div>
} @else {
  … table …
}
```

**Check:** every request has `finalize` releasing loading · composite saves suppress an early interceptor toast and show success only after required refreshes complete · `isSuccess` and
`error` both handled · no silent `undefined` handler · exactly one success
toast owner per mutation · a standard mutation has no feature-level success
toast/SweetAlert helper · a feature-owned composite success uses
`X-Skip-Success-Toast` on its mutation · the interceptor is not duplicated across
active HTTP chains · manual toast key is `'global'` when a non-standard workflow
genuinely needs one · dialogs show loading and empty states · entered data
survives a failed save.

---

