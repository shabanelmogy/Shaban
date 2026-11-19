## 22. Loading, empty, error, toast

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Loading conformance gate, one visible indicator, page-scope lookup mechanism](22/01-loading-gate-and-owners.md)
- [Sign-in and sign-out progress](22/02-session-progress.md)
- [Shared loading appearance](22/03-loading-appearance.md)
- [Error and success feedback](22/04-error-and-success-feedback.md)

> **Status: Canonical**

Rule history (dated owner clarifications and corrections) is in `CHANGELOG.md`
and `archive/2026-11-19-block-history/`; this block states the current rules.

### Render-safe shared progress publication

A routed child's initialization can start a request after the shell's bindings
were checked. LoadingService keeps its pending-operation count synchronous but
coalesces visual BehaviorSubject publication into one microtask after the
current render verification. The callback reads the latest count and notifies
inside NgZone; its false seed stays synchronous for requireSync consumers. Use
the service's immediate `isLoading` getter for imperative guards, not the last
published visual value. A same-turn start/end must not leave a stale busy state;
reset/new starts resolve from the current count. Destroying the owner prevents
queued publication.

This is a publication boundary, not a feature delay or minimum spinner duration.
Preserve request timing, paired finalize, overlap counting, query-only
navigation lifetime, request-owned finalization, one visible host and
independent write safety. Do not hide aria-busy, force detectChanges or disable
development checks to mask NG0100 (evidence path: Amortization ngOnInit →
LoadingService.startLoading → LayoutComponent aria-busy). The shared report tree
guard uses immediate state; shell, table, button and dialog visuals keep the
observable. Regression cases: checked parent/initializing child, synchronous
complete, overlap, reset/new start, outside-zone calls and navigation.

### Dashboard progressive loading

Dashboard snapshot reads use their local requesting/error/Retry state without
the global LoadingService overlay: cards render before numbers arrive. Render
metadata immediately and pass pending to UI24's SummaryCards/count owners. No
visible Loading text, spinner or page overlay: pending number slots carry only
the shared decorative highlight for the actual request duration, then the
counter on successful data. No invented numbers, completion percentage or
simulated duration. Keep aria-busy and busy guards; do not show table empty
results before a successful snapshot. A same-filter refresh keeps the last
values; filter/session changes clear them (a fresh matching filter cache may
supply its own values). Keep Result/HTTP errors, authenticated authoritative
reads, switchMap cancellation, realtime and periodic reconciliation. The display
snapshot cache is owned by UI2; retained refresh uses the shared header activity
while local busy/error/Retry stay intact. Dashboard's route sets
`requiresBranchContext=false` and `showPageLoading=false` (UI1); the shell
renders it while branch defaults load and suppresses its page overlay without
resetting LoadingService. This policy is scoped to Dashboard.

**Navigation activity.** Ordinary page loading does not disable navigation.
NavigationActivityService tracks subscribed Sigma API writes with an independent
reference count and idempotent release; never derive write safety from
LoadingService or reset writes at NavigationStart. The navigation HTTP
interceptor releases on final response/error/unsubscribe before downstream
callbacks, including business-failure envelopes. Classify non-GET/HEAD/OPTIONS as
writes unless explicitly marked read-only through HttpContext; do not infer
endpoint semantics from names. The shell pauses header and sidebar navigation
with a translated status while writes/branch-save run; body-appended
failure/confirmation surfaces stay usable. Beforeunload warns, and the route
guard covers shortcuts and browser history as well as the menu. Per-feature
busy/confirmation guards remain authoritative. No automatic write retry, server
rollback or new timeout; after an uncertain connection failure inspect saved
state before repeating a mutation.

### Page loading and the request-owned counter

`LoadingService` drives the global spinner. Always pair start with `finalize`:

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

`LoadingService` counts: the spinner stays until every `startLoading()` has had
its `endLoading()`; `endLoading()` never goes below zero. Neither
NavigationStart nor NavigationEnd resets this anonymous counter: NavigationStart
may be followed by a refused guard or navigation error (the current page and its
requests stay alive), and NavigationEnd can arrive after target requests started.
Component teardown and UI28's navigation read cancellation release departing
reads through their own finalize, preserving overlapping target requests.
Same-path query/fragment changes preserve those reads. Explicit reset exists but
is not a routing hook or a substitute for finalization. NavigationActivityService
write safety and feature busy guards are independent.

Pair each subscribed start with exactly one end in `finalize`. Required routed
lookups (for example `loadLookups()` next to `loadData()`) contribute to the one
page loader through ReferenceLookupStatus while keeping local flags/finalize;
the lookup identity lease is separate from request start/end counts. For
switchMap/deferred reads, begin within the subscribed request lifetime and
finalize that same request on replacement/cancel/error/destroy.

The error interceptor never releases an anonymous page count: it did not start
one. Each subscribed owner releases exactly its own start on
success/false/error/unsubscribe; otherwise an uncounted auxiliary error or a
double release can hide another pending read.

**Local busy flags** for per-action state: `searching`, `saving`, `revising`,
`contactGroupSaving`, `loadingList`. Bind them to the control they describe:
`[loading]="loadingList()"` on `app-data-table` and on the Search button
(`app-primary-action-button` takes `[loading]`, not `[busy]`), and
`[saving]="saving()"` on `app-editor-dialog`. Skip a table request when page
number and page size have not changed.

### State messages

**Loading, empty and error states** inside a dialog body, panel or section use
the shared `app-state-message` (`shared/components/state-message`). It owns the
spinner, icon, colour, spacing and `role`, with shared default messages
(`general.loading`, `general.noData`, `apiErrors.unexpectedMessage`):

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

For compact inline feedback, `StateMessage.compact=true` removes the panel's
reserved minimum height and padding, uses start alignment and smaller shared
icon/text sizing, and keeps its alert/status semantics and wrapping. The default
panel presentation is unchanged; loading keeps its normal geometry. Keep one
feedback owner and retry through an existing action (example: the chassis
profit/loss report filter field retries through Refresh or Export).

The public `StateMessageKind` accepts only `loading`, `empty` and `error`;
`warning`/`info` are not supported inputs. A failed detail or lookup uses
`kind="error"` with its declared retry behavior. A genuine non-error advisory
uses the shared `sigma-alert--warning` presentation (block 1) rather than
extending the component contract. Import and register `StateMessageComponent`
wherever used (block 1).

A grid's own empty/loading state stays with `app-data-table` (block 6).
Hand-written state markup (`individual-dialog-state`, `'Please wait...'`) is
replaced in the screen's review.

**Check:** every request has `finalize` releasing loading · one visible progress
owner per surface · composite saves suppress an early interceptor toast and show
success only after required refreshes complete · `isSuccess` and `error` both
handled (state restored) · no feature error toast/dialog on top of the
interceptor unless the request sends `X-Skip-Error-Interceptor` · no silent
`undefined` handler · exactly one success toast owner per mutation · a standard
mutation has no feature-level success toast/SweetAlert helper · a feature-owned
composite success uses `X-Skip-Success-Toast` on its mutation · the interceptor
is not duplicated across active HTTP chains · a manual toast key is `'global'`
when a non-standard workflow genuinely needs one · dialogs and panels show
loading, empty and error states with `app-state-message` · entered data survives
a failed save.
