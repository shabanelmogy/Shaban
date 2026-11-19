<!-- Part of UI block 22: see ../22-loading-empty-error-toast.md. Same status and authority as the block. -->

### Error and success feedback

**Error presentation — single owner.** The global `errorInterceptor` presents
**every** failure of a Sigma API request — a `Result` with `isSuccess: false` (any
status) and every HTTP error — through `ApiErrorDialogService`, and handles `401`
(logout). It does not release request-owned loading counts. A feature therefore
does **not** show its own toast or dialog for the same failure; it restores its
own state (busy flags off, entered data kept, dialog stays open). The only
exception is a message that belongs inside the screen (a report filter error, an
inline lookup warning): that request sends `X-Skip-Error-Interceptor` and the
feature shows the message itself. Existing feature error toasts are removed when
their screen is reviewed (backlog 40).

**Reading an API error.** For that inline case use
`apiErrorMessage(error, fallbackKey)` from `shared/utils/api-error.ts`: it returns
the backend `Result.message` from the error body when present, otherwise the
translation key. Do not copy a private `extractErrorMessage` into features, and do
not read `error.message` of an `HttpErrorResponse`. An action that returns nothing
to act on (for example an export with zero rows while the grid has rows) shows its
error instead of doing nothing. Composed reads (`fetchAllPages`, grouped selects)
that throw an ordinary `Error` with a declared safe business message use
`composedReadErrorMessage` from the same file; it delegates HTTP Result
bodies/fallbacks to `apiErrorMessage`. Do not copy the Error-versus-
HttpErrorResponse branch into features or expose arbitrary exception diagnostics.

**Lookup failures stay visible.** A required Create/Edit option list that fails
shows its error; never hide it by returning empty options or by making a
protected endpoint anonymous. Diagnose by HTTP status before changing the UI:
`401` authentication (token missing, expired, or signed by a different auth
server; also check that the URL is built from `environment.baseUrl`, block 1),
`403` authorization, `404` route mismatch, `0` transport/CORS, `5xx` server. Never
copy bearer tokens into logs, screenshots, or messages.

**Settings in lookup batches.** When Common settings are required by an inline
lookup batch, use `CommonSettingsService.getMySetting<T>({ skipErrorInterceptor:
true })` (block 2), handle Result and HTTP failures in that batch, and keep
explicit Retry and entered values; other consumers keep global feedback, and
auxiliary settings reads use local busy state rather than the global loader.
Required settings used by a calculation or transition join the lookup batch with
the other `Result` reads: declared failure and HTTP failure both set the lookup
error, preserve the form, and Retry repeats the request. A plain successful
settings value is handled separately from `Result` wrappers.

**Customer CSV imports.** Use the shared CSV component and the shared list
title/fill table shell. Construct typed write DTOs only after validating nonempty
boolean/numeric cells and DMY/ISO date text; never replace malformed values with
0/false or ambiguous month-first dates. One inline feedback owner handles row
errors, Result.message, ordinary HTTP failures and network fallback, with an
inflight guard and finalize for the loader. Partial success keeps both saved
counts and failed-row diagnostics. Long diagnostics use `ul.sigma-alert-list`,
whose bounded internal scroll is owned by `src/styles.scss`; they never move
scrolling to the route. A View reads saved lookup labels without edit-only
lookups; Edit merges saved selections with fetched options.

**CSV preview lifetime.** Preview consumers reuse `ImportCsvComponent.parsingChanged`
and `fileFailed`: clear the previous preview when selection begins, freeze the
selected input context and block submission until parsing ends, and keep a
failed replacement file unsubmittable. `reset()` clears parser feedback when the
consumer clears its preview. The shared parser owns parsing/error presentation,
disables repeat file selection and ignores completion after destruction. A
controlled dialog remounts its parser per session so an old file/error cannot
populate a reopened draft. No consumer parser fork or partial valid subset;
import atomicity and replacement rules stay feature-owned.

**Success toast — single owner.** The global `errorInterceptor` owns the one
success toast for standard `POST`, `PUT`, `PATCH`, and `DELETE` responses whose
result has `isSuccess: true` and a non-empty `message`. The feature subscription
owns its local state, close event, and refresh only; it must not inject
`MessageService` to add another success toast for the same response. This applies
equally to close, void, approve, post and delete.

**Duplicate-success prevention gate.** For every mutation, decide the toast owner
before writing the subscription:

- **standard mutation:** the interceptor owns success; the feature must not call
  `messageService.add({ severity: 'success', ... })`, `showSuccess(...)`, a
  success SweetAlert, or another success surface for that response;
- **composite workflow:** the feature owns the final success only after all
  required follow-up work succeeds; the mutation request carries
  `X-Skip-Success-Toast` so the interceptor stays silent;
- **no response message / deliberately silent mutation:** do not manufacture a
  second generic success because the request returned 2xx unless the workflow
  explicitly owns that feedback.

Dependency cleanup follows the actual feedback owner, not a blanket removal of
`MessageService`. An informational action that sends no API request (for example
Agreement's unavailable-email notice) may keep its one `info` toast with key
`global` and an explicit injection. Search remaining class-member uses before
removing the dependency (block 1).

A manual feature success toast immediately after a standard successful mutation
is a duplication defect unless that request demonstrably suppresses the
interceptor toast. Registering `errorInterceptor` in more than one active
`HttpClient` chain is invalid; there is one interceptor execution path per request.

A composite Save differs when the user-visible operation is not complete at the
mutation response. If a successful mutation must be followed by required
row/state/detail reloads before the screen can represent the committed result,
success belongs to the **complete workflow**: suppress the mutation toast with
`X-Skip-Success-Toast` and emit exactly one feature success toast after all
required refreshes succeed and loading has ended. Do not use a timer or network
delay to reorder feedback. `BaseService.addSettingList` exposes the approved
option:

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
message and do not show success, because the screen cannot yet represent the
committed state reliably.

```ts
next: (result) => {
  if (!result.isSuccess) return; // shown by the interceptor
  this.form.markAsPristine();
  this.closed.emit(true);
}
```

Handle **both** failure channels. `isSuccess: false` is a business failure and
`error:` is a transport failure — neither may pass silently, and in both the
interceptor has already shown the message, so the feature restores its state:

```ts
.subscribe({
  next: (response) => {
    if (!response.isSuccess) return;       // message shown by the interceptor; form kept
    …
  },
  error: () => this.saveFailed.set(true), // restore state; never `() => undefined`
});
```

`error: () => undefined` is never acceptable; treat any occurrence found during a
review as a current defect and replace it with the feature's declared
business/transport failure handling.
