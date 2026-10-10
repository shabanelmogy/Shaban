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
editor detail loading, and editor save. `LoadingService` counts (2026-09-30): the spinner
stays until every `startLoading()` has had its `endLoading()`, `endLoading()` never goes below
zero, and a route change resets the count. Pair each start with exactly one end in
`finalize`. Auxiliary lookups (for example `loadLookups()` next to `loadData()`) still do
not drive the global loader; they use local state, so a slow lookup never blocks the page.

**Local busy flags** for per-action state: `searching`, `saving`, `revising`,
`contactGroupSaving`, `loadingList`. Bind them to the control they describe:
`[loading]="loadingList()"` on `app-data-table` and on the Search button
(`app-primary-action-button` takes `[loading]`, not `[busy]`), and
`[saving]="saving()"` on `app-editor-dialog`. Skip a table request when page
number and page size have not changed.

**Error presentation — single owner.** The global `errorInterceptor` presents **every**
failure of a Sigma API request: a `Result` with `isSuccess: false` (any status) and every HTTP
error, through `ApiErrorDialogService`. It also ends the global loader and handles `401`
(logout). A feature therefore does **not** show its own toast or dialog for the same failure;
it restores its own state (busy flags off, entered data kept, dialog stays open). The only
exception is a message that belongs inside the screen (a report filter error, an inline
lookup warning): that request sends `X-Skip-Error-Interceptor` and the feature shows the
message itself. Existing feature error toasts are removed when their screen is reviewed (backlog
40).

**Reading an API error.** For that inline case use `apiErrorMessage(error, fallbackKey)` from
`shared/utils/api-error.ts`: it returns the backend `Result.message`
from the error body when present, otherwise the translation key. Do not copy a private
`extractErrorMessage` into features, and do not read
`error.message` of an `HttpErrorResponse`. An action that returns nothing to act on (for
example an export with zero rows while the grid has rows) shows its error instead of doing
nothing.

**Lookup failures stay visible.** A required Create/Edit option list that fails
shows its error; never hide it by returning empty options or by making a
protected endpoint anonymous. Diagnose by HTTP status before changing the UI:
`401` authentication (token missing, expired, or signed by a different auth
server; also check that the URL is built from `environment.baseUrl`, block 1), `403` authorization, `404` route mismatch,
`0` transport/CORS, `5xx` server. Never copy bearer tokens into logs,
screenshots, or messages.

**Customer CSV imports (2026-10-01).** Use the existing shared CSV component and
the shared list title/fill table shell. Construct typed write DTOs only after validating
nonempty boolean/numeric cells and DMY/ISO date text; do not replace malformed values with
0/false or ambiguous month-first dates. One inline feedback owner handles row errors,
Result.message, ordinary HTTP failures and network fallback, with an inflight guard and
finalize for the loader. Partial success retains both saved counts and failed-row diagnostics.
Long diagnostics use `ul.sigma-alert-list`, whose bounded internal scroll is owned by
`src/styles.scss`; they never transfer scrolling to the route. A View reads saved lookup
labels without edit-only lookups; Edit merges saved selections with fetched options.

**CSV preview lifetime (2026-10-10, Overtime source evidence).** Reviewed preview consumers
reuse `ImportCsvComponent.parsingChanged` and `fileFailed`: clear the previous preview when
selection begins, freeze the selected input context and block submission until parsing ends,
and keep a failed replacement file unsubmitable. `reset()` clears parser feedback when the
consumer explicitly clears its preview. The shared parser owns parsing/error presentation,
disables repeat file selection and ignores completion after destruction. A controlled dialog
remounts its parser per session so an old file/error cannot populate a reopened draft. No
consumer parser fork or partial valid subset. Other consumers retain their existing fileImported
contract; import atomicity and replacement rules remain feature-owned. Source-only acceptance pending.

**Success toast — single owner.** The global `errorInterceptor` owns the one
success toast for standard `POST`, `PUT`, `PATCH`, and `DELETE` responses whose result has
`isSuccess: true` and a non-empty `message`. The feature subscription owns its
local state, close event, and refresh only; it must not inject `MessageService`
and add another success toast for the same response. This applies equally to
state-changing actions such as close, void, approve, post, and delete.

**Duplicate-success prevention gate.** For every mutation, decide the toast owner
before writing the subscription:

Dependency cleanup follows the actual feedback owner, not a blanket removal of
`MessageService`. An existing informational action that sends no API request
(for example Agreement's unavailable-email notice) may retain its one `info`
toast with key `global` and an explicit injection. It is not a mutation success
toast. Search remaining class-member uses before removing the dependency;
ordinary API failure/success rules below remain unchanged (block1).

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
        this.restoreAfterFailure(); // the interceptor showed the message
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
        this.restoreAfterFailure(); // the interceptor showed the message
        return;
      }
      this.replaceRows(rows.entities ?? []);
    },
    error: (error) => {
      saveSuccessMessage = null;
      this.restoreAfterFailure();
    },
  });
```

If the mutation succeeds but a required refresh fails, clear the pending success
message and do not show success because the current screen cannot yet represent
the committed state reliably.

```ts
next: (result) => {
  if (!result.isSuccess) return; // shown by the interceptor
  this.form.markAsPristine();
  this.closed.emit(true);
}
```

Handle **both** failure channels. `isSuccess: false` is a business failure and
`error:` is a transport failure — neither may pass silently, and in both the interceptor has
already shown the message, so the feature restores its state:

```ts
.subscribe({
  next: (response) => {
    if (!response.isSuccess) return;       // message shown by the interceptor; form kept
    …
  },
  error: () => this.saveFailed.set(true), // restore state; never `() => undefined`
});
```

`error: () => undefined` is never acceptable. Treat any occurrence found during
a feature review as a current defect and replace it with the feature's declared
business/transport failure handling.

**Loading, empty and error states** inside a dialog body, panel or section use the shared
`app-state-message` (`shared/components/state-message`, 2026-10-01). It owns the spinner, icon,
colour, spacing and `role`, with shared default messages (`general.loading`,
`general.noData`, `apiErrors.unexpectedMessage`):

```html
@if (agreementsLoading()) {
  <app-state-message kind="loading" />
} @else if (agreementsError()) {
  <app-state-message kind="error" [message]="agreementsError()" />
} @else if (agreements().length === 0) {
  <app-state-message kind="empty" message="companyPartners.noAgreements" icon="bi bi-journal-x" />
} @else {
  … table …
}
```

The public `StateMessageKind` contract currently accepts only `loading`,
`empty` and `error`; `warning`/`info` are not supported inputs. A failed detail
or lookup uses `kind="error"`, with its declared retry behavior. A genuine
non-error advisory uses the existing shared `sigma-alert--warning` presentation
(block1), rather than extending the component contract to silence a consumer
type error. Import and register `StateMessageComponent` wherever used (block1).

A grid's own empty/loading state stays with `app-data-table` (block 6). Hand-written state
markup (`individual-dialog-state`, `'Please wait...'`) is replaced in the screen's review.

**Check:** every request has `finalize` releasing loading · composite saves suppress an early interceptor toast and show success only after required refreshes complete · `isSuccess` and
`error` both handled (state restored) · no feature error toast/dialog on top of the interceptor
unless the request sends `X-Skip-Error-Interceptor` · no silent `undefined` handler · exactly one success
toast owner per mutation · a standard mutation has no feature-level success
toast/SweetAlert helper · a feature-owned composite success uses
`X-Skip-Success-Toast` on its mutation · the interceptor is not duplicated across
active HTTP chains · manual toast key is `'global'` when a non-standard workflow
genuinely needs one · dialogs and panels show loading, empty and error states with `app-state-message` · entered data
survives a failed save.

---

### Composed read failures (2026-10-06; Master 5 shared-extraction gate)

Composed reads such as `fetchAllPages` and grouped selects can throw an ordinary
`Error` containing a declared safe business message. Reviewed consumers use
`composedReadErrorMessage` from `shared/utils/api-error.ts`; it preserves that
message and delegates HTTP Result bodies/fallbacks to `apiErrorMessage`.
Do not copy the Error-versus-HttpErrorResponse branch into each feature, or use
this helper to expose arbitrary exception diagnostics. Card Transactions Bank
Transfers list/export/report consumes it. Other consumers retain their current
behavior until their own screen review. Source-only; owner compilation and
failure-path acceptance remain pending.

### Common settings inline feedback (2026-10-09)

When Common settings are required by an inline lookup batch, use the optional
`CommonSettingsService.getMySetting<T>({ skipErrorInterceptor: true })` contract
(block 2), handle Result and HTTP failures in that batch, and retain explicit
Retry and entered values. Rental Agreement Deposit adopts it for settings-owned
amount wording. Defaults and other consumers keep global feedback; auxiliary
settings reads use local busy state rather than the global loader. Source-only;
owner failure/Retry acceptance remains pending.


### Retryable required settings (2026-10-09)
Required settings used by a calculation or transition join the lookup batch with the other `Result` reads. Declared failure and HTTP failure both set the lookup error, preserve the form, and make Retry repeat the request. A plain successful settings value is handled separately from `Result` wrappers. Source-only evidence: Limousine tax settings adoption.
