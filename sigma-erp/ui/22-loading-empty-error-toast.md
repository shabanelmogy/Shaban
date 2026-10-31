## 22. Loading, empty, error, toast

> **Status: Canonical**

### Mandatory loading conformance gate (clarification2026-10-25)

**Aggregate lookup failure with a pending tail (2026-10-27).** Shared
ReferenceLookupStatus keeps its one dialog loading StateMessage visible while
any required batch/context read is pending, even if another member has already
failed. Error feedback is independent; Retry is disabled until that pending
batch settles. Page scope still owns only its shell lease, and retained-data
revalidation remains silent. Do not let error-first template branching hide
the sole progress owner or add a separate feature spinner. Lease Inquiry and
Cost Setting dialogs are the source consumers; runtime overlap remains pending.

Apply this gate at discovery and final reconciliation for every new or reviewed
screen. Trace the real menu/route entry to its imported component and request
symbols before deciding that a loader is present. A similarly named folder or
legacy component is not evidence for the active route. For example, the current
SalaryVoucher empty route imports HRM/Payroll/Payrolls' PayrollsComponent; its
`legacy` child uses the older SalaryVoucher list. Inspect both only when in scope,
and attribute their request paths separately.

In the existing review/contract, record one row per request path or coherent
operation with the same lifecycle. Do not create another artifact solely for
loading. Use actual route, producer and consumer symbols:

| Active route and request/operation | Visible progress owner and reason | Start, finalization and cancellation | Route visibility and rendered progress | Busy, error and Retry | Final source evidence and pending verification |
|---|---|---|---|---|---|
| Actual routed component, HTTP service method and user trigger | Global page including required filter bootstrap / local dialog / explicitly silent | One subscribed start and exactly one finalize release, or the shared identity-owned lookup lease driven by finite bootstrap/finalize and consumer destruction; success, false envelope, HTTP error, unsubscribe/destroy and stale-read ownership | Effective showPageLoading metadata; sole shell host or local dialog StateMessage/control; no inline page-filter loader | Local busy/disabled/aria-busy retained; single feedback owner and actionable recovery | Matched/finding/unresolved with actual symbols; browser/network/timing acceptance separate |

Page/list/detail reads, editor Save, domain/destructive actions and a report or
export operation that fetches data use the existing global LoadingService, with
paired start/finalize release. Required routed initial/filter lookup bootstrap
keeps its operation flags but contributes to that same page host through shared
ReferenceLookupStatus; no inline loading indicator appears in the filters
(owner clarification2026-10-26). Dialog lookups stay local. Retained reference-cache revalidation stays silent under UI2; the shared
header badge remains its own presentation owner. Dashboard's explicit local,
silent page policy below is not a general exemption. A body-appended dialog
whose overlay hides the shell loader uses its existing shared local StateMessage
for a dialog-owned read; suppress a second table mask for that request. Do not
add a second global host or a feature spinner/skin to resolve visibility.

For the shared DocumentApprovalCycle and DocumentActionLog readers,
`localReadProgress` defaults false (page-global read progress). A confirmed
body-appended dialog consumer sets it true: the reader uses its existing
StateMessage loading branch locally and suppresses a second table mask. The
read captures its owner before subscription and releases only a started global
count in finalize; changing the input cannot unbalance it. This affects reads
only, preserving approval decisions, events, errors/Retry, busy/close guards and
default consumers. JVs's status/log dialogs adopt true while its saved approval
tab keeps false. Reuse these inputs rather than copying read logic or adding a
feature loader. No API/business/cache contract changes.

**Shared transaction-currency display (source2026-10-26).** DocumentCurrency
feeds its actual base-policy and partner-read flags into ReferenceLookupStatus:
page-default progress and inherited EditorDialog local scope, with host aria-busy.
Replaced supplier/customer input reads unsubscribe before the replacement starts;
retain version fences, DestroyRef finalization, saved supplied-code precedence,
persisted base fallback and partner currency selection. Partner detail failures
use one inline translated error/Retry in this owner and keep the existing fallback;
retry only the failed current partner context. Base policy keeps its optional
fallback/global feedback mode and existing request coalescing. Do not add a
second loader or form mutation. The owner's 2026-10-28 customer-currency display
cache opt-in is UI2's narrow exception: after its finite successful read, mount
the separate shared-source watch. Keep current code while a retained snapshot
refreshes silently, retain busy/aria-busy and errors/Retry, and show progress only
when no successful snapshot is available. Cancel/clear the old identity on a
context reset and show shared field feedback to reselect/reopen; never silently
reuse an old customer ID in a different context. This exception does not cache
supplier details, financial policy or prices and does not change any form amount.
This general shared adoption is inherited by Sales documents and current consumers; source ownership
does not establish runtime visibility, latency or currency/accounting acceptance.

Inspect the effective route's `showPageLoading` value and the actual shell host;
starting a global counter cannot display an overlay on a route that explicitly
suppresses it. Do not copy Dashboard's false value to ordinary lists/editors.
Preserve local busy inputs and duplicate-execution/navigation guards even when
their visible spinner is suppressed. Keep error/empty/Retry rendering; removing
a duplicate loading StateMessage does not remove those states.

Review route-driven lifecycle as well as HTTP pairing. Same-path query/fragment
changes, including `writeListRoute` filter/sort/page updates, must preserve
pending progress. Actual path departure retains the reset defined below. Do
not work around a shared lifecycle mismatch with feature timers or delayed
starts. Missing request/visibility evidence or a known unapproved mismatch is
a finding under Master5, not proof of completion. Source inspection establishes
the wiring only; runtime visibility, overlap, cancellation and timing remain
pending within the current execution boundary.

### Render-safe shared progress publication (2026-10-26)

A routed child's initialization can start a request after the shell's bindings
have already been checked. LoadingService keeps its pending-operation count
synchronous, but coalesces visual BehaviorSubject publication into one microtask
after the current render verification. The callback reads the latest count and
notifies inside NgZone; its false seed remains synchronous for requireSync
consumers. Use the service's immediate isLoading getter for imperative guards,
not the last published visual value. A same-turn start/end must not leave a
stale busy state, and reset/new starts must resolve from the current count.
Destroying the owner prevents queued publication and releases its route watch.

This is a shared publication boundary, not a feature delay or minimum spinner
duration. Preserve request timing, paired finalize, overlap counting, query-only
navigation lifetime, actual-path reset, one visible host and independent write
safety. Do not hide aria-busy, force detectChanges or disable development checks
to mask NG0100. Evidence: Amortization ngOnInit → LoadingService.startLoading →
LayoutComponent aria-busy. The shared report tree guard uses immediate state;
shell, table, button and dialog visual consumers keep the existing observable.
Regression cases include checked parent/initializing child, synchronous complete,
overlap, reset/new start, outside-zone calls and navigation. Runtime visibility,
compilation and test execution remain owner checks under the source-only rule.

### Dashboard progressive loading (owner2026-10-25)

Dashboard snapshot reads use their existing local requesting/error/Retry state
without starting the global LoadingService overlay: the owner explicitly asks
to see the cards before numbers arrive. Render metadata immediately and pass
pending to UI24's shared SummaryCards/count owners. The owner's subsequent
clarification requires no visible Loading text, spinner or page overlay: pending
number slots carry only the shared decorative highlight for the actual duration
of the request, followed by the counter on successful data. No invented numbers,
completion percentage or simulated request duration. Keep aria-busy and actual
busy guards. Do not show table empty results before a successful snapshot.
A same-filter refresh keeps the last values;
filter/session changes clear them (a fresh matching filter cache may then supply
its own values). Keep Result/HTTP errors, authenticated authoritative HTTP reads,
switchMap cancellation, realtime and periodic reconciliation. The owner's
2026-10-26 display snapshot cache opt-in is owned by UI2; retained refresh uses
the existing shared header activity while local busy/error/Retry remain intact.
Dashboard's route explicitly sets requiresBranchContext=false and
showPageLoading=false (UI1); the shell renders it while branch defaults load
and suppresses its page overlay without changing/resetting LoadingService.
This does not change loading policy or cache eligibility for unrelated screens.

**Navigation activity (owner2026-10-22):** ordinary page loading does not disable
navigation. NavigationActivityService tracks subscribed Sigma API writes with an
independent reference count and idempotent release; do not derive write safety
from LoadingService or reset writes at NavigationStart. The navigation HTTP
interceptor releases on final response/error/unsubscribe before downstream
success/failure callbacks, including business-failure envelopes. Conservatively
classify non-GET/HEAD/OPTIONS as writes unless explicitly marked read-only through
HttpContext; do not infer endpoint semantics from names. The shell pauses header
and sidebar navigation with a translated status while writes/branch-save run;
body-appended failure/confirmation surfaces remain usable. Beforeunload warns,
and the route guard covers shortcuts and browser history as well as the menu.
Existing per-feature busy/confirmation guards remain authoritative. No automatic
write retry, server rollback or new timeout duration is implied; after uncertain
connection failure inspect saved state before repeating a mutation.

### Sign-in progress and session publication (source correction, 2026-10-23)

The existing authentication form owns a typed, nonnullable credential form and
one pending gate spanning the credential request and its router promise. Check
the gate in the submit handler as well as disabling the button. Distinguish
checking credentials from opening the workspace with translated status text.
Pause the credential controls during the attempt so displayed inputs match the
submitted snapshot; re-enable them with their values on pre-session failure.
Validate Result success/entity and required session fields before using them.
Persist credential, user and subscription before publishing currentUser: root
subscribers can start authenticated branch reads synchronously. Handle failed
storage without publishing the new user; restore prior values on partial writes
where storage permits. Never print credentials or token-bearing responses.
If authentication succeeded but navigation returns false or rejects, release
the gate and offer opening Retry using that session, without another login POST;
keep the authenticated form disabled. Request failure retains editable inputs.
Use component-lifetime teardown/finalize; auth service HTTP busy ends on HTTP
completion while the form's independent pending state covers navigation too.
Keep auth-origin interception, tenant/branch/default semantics and dashboard
freshness unchanged. Source regression coverage does not measure external
authentication latency or establish browser/runtime success (UI1/2/26/28/29).

### Sign-out transition and session cleanup (owner correction, 2026-10-24)

AuthService owns one in-flight sign-out promise and readonly pending/error state.
Ordinary sign-out first navigates through the existing shell and feature guards;
only successful departure clears stored token, user and subscription and publishes
the ended session. A refused or failed navigation retains the session/draft and
offers translated Retry through the existing shell/state/action owners. Login
does not auto-open the workspace or submit while sign-out is entering its route.
The shell pauses navigation during that attempt; the guards are not bypassed.

An unauthorized Sigma API response hands its actual request credential to the
same session owner. Clear immediately only when it still matches the current
credential; a late response from an old session must not end a replacement.
Coalesce concurrent failures/departures, preserve the observable error channel,
and do not race routing with unconditional document reload. If expired-session
departure is blocked, expose the ended-session state and Retry outside the
account popover, including the explicit logout route. Do not retry uncertain
writes or interpret client cancellation as server rollback (UI28).

TranslationService.endSession cancels the runtime read, restores only overridden
built-in dictionaries and removes tenant-only languages, preserving immutable
originals, default/fallback language, RTL and next-session isolation. Repeated
cleanup after session publication and shell destruction is a no-op. Do not clone
or republish every unaffected dictionary on each call. Source regression evidence
does not establish measured logout latency or runtime acceptance (UI29).

**Cached background revalidation (owner2026-10-24).** Updating reference data
when a successful snapshot exists must not start a page loader, disable the
form or render the shared lookup loading panel. Keep the retained data visible;
ReferenceLookupBindings exposes loading only when state.loading is true and
state.value is null. An empty successful list is still retained data. Preserve
initial loading without a snapshot and error/Retry after a failed refresh.
ReferenceLookupState continues to report the real request state; this is a
presentation decision, not hidden requests or cached failures. Source-owned
ordinary page bootstraps and writes keep their own loading contracts. Do not
introduce a competing loader or change unrelated global counter behavior.

**Shared background refresh badge (owner2026-10-24).** The root cache exposes
readonly backgroundRefreshing from actual loading entries that retain a successful
snapshot. ShellHeaderComponent alone displays a small translated status after
500ms continuous activity and hides it when the last refresh settles, fails,
cancels or resets context. Initial loads, fresh cache hits, idle invalidation,
queued refresh timers and writes do not qualify. Do not start HTTP just to show
the badge or delay requests/results for its animation. Reserve its header slot
to avoid movement; compact to an icon with accessible text on narrow containers,
reuse Sigma theme tokens, polite status and reduced-motion support. Cancel the
delay on state change/header destruction. Keep existing screen error/Retry;
the badge is activity, not a success/failure notification or permission gate.

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
editor detail loading, editor save, and report/export data reads. `LoadingService` counts (2026-09-30): the spinner
stays until every `startLoading()` has had its `endLoading()`, `endLoading()` never goes below
zero. A NavigationStart whose parsed route-path tree differs from the current
router URL resets the count; query/fragment-only changes on that same path do not.
The comparison preserves child, outlet and matrix paths through
`new UrlTree(router.parseUrl(url).root).toString()`, excluding query and fragment,
on both the incoming URL and `router.url`. Do not compare only the primary
segment or reset for every NavigationStart. A filter/sort/page URL update may
arrive after its HTTP read has subscribed; resetting then would hide active
progress. This route distinction changes no NavigationActivityService write
safety or feature busy guard.

Pair each subscribed start with exactly one end in
`finalize`. Required routed lookups (for example `loadLookups()` next to
`loadData()`) now contribute to the one page loader through ReferenceLookupStatus,
while retaining local flags/finalize. Its identity lease is separate from request
start/end counts; dialog lookups remain local. This supersedes the earlier rule
that a slow required lookup never blocks the page.
For switchMap/deferred reads, begin within the corresponding subscribed request
lifetime and finalize that same request on replacement/cancel/error/destroy.
Route reset is not a substitute for the request's finalization. Source review
does not establish runtime duration or successful overlap/cancellation behavior.

**Local busy flags** for per-action state: `searching`, `saving`, `revising`,
`contactGroupSaving`, `loadingList`. Bind them to the control they describe:
`[loading]="loadingList()"` on `app-data-table` and on the Search button
(`app-primary-action-button` takes `[loading]`, not `[busy]`), and
`[saving]="saving()"` on `app-editor-dialog`. Skip a table request when page
number and page size have not changed.

**One visible progress owner (owner clarification, 2026-10-17).** When the
shared application LoadingService is active, shared DataTable hides its
PrimeNG loading overlay, PrimaryActionButton keeps its ordinary icon and
EditorDialog keeps its ordinary Save/Print icon and shows the shared loading
status inside its body while saving (its body-appended mask hides shell progress).
Their loading/saving inputs
continue to own disabled, aria-busy, empty-state and navigation guards.
Angular toSignal observes the existing BehaviorSubject with requireSync and
component-lifetime cleanup, including OnPush buttons. Without global loading,
local-only requests use the same shared ring. A body-appended dialog whose
overlay hides the shell loader retains one shared local loading StateMessage
for its read and suppresses its duplicate table mask. Do not clear busy inputs or
hide loaders through feature CSS. A screen explicitly using global-only
progress must also avoid a second loading StateMessage for that same request;
error/empty messages remain. Languages options/keys and editor refresh use
paired global loading under this owner decision. The single Content loader
host remains unchanged; its appearance is updated by the subsequent owner request
below. Source evidence does not establish
duplicate global hosts or visual acceptance.

### Shared loading appearance (owner request, 2026-10-23)

The owner requested improving Loading generally. Extend the existing
`StateMessageComponent` loading branch and `LayoutComponent` content overlay;
all current consumers inherit the shared appearance without feature opt-in.
This supersedes only the earlier appearance-preservation clause, not the
single-visible-progress or busy/navigation contracts above.

The shared loading state stacks a decorative primary-colored ring above its
translated label, with a 14px gap, 14px medium-weight text and a 36px ring
(3px border, 900ms rotation). The inner decorative ring is shared here too;
empty/error states retain their existing icon/row layout. The shell's existing
single content overlay uses 20px inset padding, surface at 65% opacity and 3px
backdrop blur, containing a card of at most 240px with a 16px radius, Sigma
border/surface/shadow and 28px 24px loading padding. The shell sets the ring
to 44px through `--sigma-state-loading-size`; padding uses
`--sigma-state-loading-padding`. These presentation hooks retain shared
ownership; features do not copy loading markup or palettes.

Consume UI24 theme tokens and UI25 logical sizing. Retain the translated status
and aria-busy semantics and hide decorative rings from assistive technology.
Stop rotation for reduced motion; forced colors use system colors. Bound long
labels/card overflow within the content region and hide the global overlay in
print. LoadingService counts/path-departure reset (query/fragment updates retain
active progress), callers' finalize, local busy guards,
navigation safety and error handling are unchanged. Source conformance was
reviewed; browser/theme/responsive/motion acceptance remains pending (UI29).

### One JV loading primitive from startup onward (owner2026-10-26)

#### Required filter bootstrap belongs to the page (latest owner clarification2026-10-26)

Statement of Account must load **on the page, not inside the filters**. This is
the general default for every routed screen's required initial/filter lookup
bootstrap, including Customers and Suppliers. The same shell indicator remains
until required bootstrap and operational reads both settle; no local-filter
fallback appears if one finishes first. This supersedes earlier local-auxiliary
presentation wording, without changing lookup cache eligibility or HTTP flow.

ReferenceLookupStatus now consumes the existing LoadingService and defaults to
`loadingScope='page'` via LOOKUP_LOADING_SCOPE. On input changes it calls
`setPageLookupLoading(this, loading && loadingScope === 'page')`; destruction
releases only that identity. LoadingService combines its existing subscribed
request count with the Set of live lookup owners, publishing through the same
render-safe coalesced path and the same Layout host. Repeated updates are
idempotent; releasing a lookup never decrements a request count or another
owner. The page-mode template keeps error/Retry, but renders no inline loading
StateMessage. Keep this shared consumer mounted for the pending bootstrap,
outside any condition waiting for that bootstrap to finish.

The existing finite bootstrap's local loading flags/finalize still settle on
success, false envelope, HTTP error and cancellation; the mounted owner observes
that state and ends its lease. Actual view departure destroys the owner; a
query/fragment-only navigation retains it. LoadingService.reset still clears
request-owned counts; live lookup identities follow their mounted component
lifetime and destruction releases departed views. Do not anonymously decrement
page counts, clear another owner's lease, add feature timers or serialize reads.

EditorDialog provides LOOKUP_LOADING_SCOPE='dialog' using **providers**, so its
own view, projected ReferenceLookupStatus and nested driver/editor children
inherit local dialog progress even after the portal moves to body. Do not use
viewProviders, which excludes projected content. An approved nonstandard dialog
can explicitly set loadingScope='dialog' or provide the same token at its owner;
routed screens need no opt-in. Keep one aggregate dialog status, errors/Retry,
save foreground precedence and write safety.

Retained-data cache revalidation stays silent: ReferenceLookupBindings already
exposes no blocking bootstrap loading for retained snapshots, so no page lease
is acquired. The existing header background badge and Dashboard's explicitly
silent operational policy remain scoped as before. Do not turn all GETs into
blocking page work or opt excluded reads into a cache.

Conformance requires source traces for cold/warm initial/filter bootstrap,
failure/Retry, overlapping report and lookup completion in either order,
multiple owners, removal/destruction/query-only navigation, and projected dialog
scope. Runtime visual/timing/DI/assistive acceptance stays explicitly pending
when source-only execution is required. The shared scope mechanism follows
[Angular's providers versus viewProviders contract](https://v20.angular.dev/guide/di/hierarchical-dependency-injection#providers-vs-viewproviders).

#### One visible indicator, not merely one shared appearance (owner correction2026-10-26)

The owner reports two indicators in IndividualPartner and requires one visible
indicator at a time, generally across all pages, with Customers/Suppliers
reconciled afterward. A common ring alone is insufficient: a translucent page
overlay can leave an auxiliary StateMessage visible behind it. This supersedes
any interpretation that independent page and auxiliary requests may show
simultaneous indicators in the same covered content.

The common critical loading stylesheet owns visibility precedence as well as
appearance, automatically for every current consumer, without screen opt-in:

- While the **rendered** sigma-shell__loading host exists, hide loading
  StateMessage hosts and compact loading rings within sigma-shell__route.
  ReferenceLookupStatus page scope contributes to the shell instead of rendering
  an inline message; dialog scope delegates to local StateMessage. Do not key this rule
  on a service count alone: a silent route may intentionally render no page host.
- A body-appended PrimeNG dialog is outside that routed subtree. Keep its local
  StateMessage visible; while it has loading progress, hide background shell
  progress and covered routed local indicators, even if no shell loader exists.
  Inside EditorDialog saving progress, hide loading StateMessages
  covered by its foreground progress overlay. Do not hide the save overlay's
  own StateMessage, an error or an empty state.
- Page progress now remains until required routed bootstrap finishes, even when
  the operational request ends first; never fall back to an inline filter loader
  or clear flags early. Inside a dialog without a foreground save owner, use
  **one aggregate auxiliary status per surface**,
  not one status per dropdown/request. Tables/buttons keep their existing
  shared suppression and dialog-local masks stay suppressed. A routed/dialog
  StateMessage takes precedence over compact inline button/upload rings on the
  same surface, without changing their busy/disabled/accessibility state.

These shared visibility selectors use the real Layout/StateMessage/PrimeNG
portal hierarchy, not feature CSS or a second loader host. Keep request
start/finalize/cancel, busy/disabled/aria-busy, errors/Retry, cache watches and
write/navigation safety unchanged. No new timer, counter, lookup/cache or
request serialization is needed to suppress duplicate presentation.

Every future screen handoff must trace simultaneous page + lookup, lookup-only,
dialog read + background page work, and dialog save + retained lookup state
through the rendered owners. A list/table suppression input alone is not
conformance. Record source evidence and owner-pending runtime/stacking/assistive
acceptance separately; never claim a visual check from CSS syntax validation.

The owner requests the actual JV loading appearance across Customers, Suppliers
and program startup, with other loading skins removed. JV already uses
LoadingService → Layout → StateMessage; it owns no private loading component.
The **single critical stylesheet in `src/index.html` head** now owns
`sigma-loading-indicator`, `sigma-loading-status`, `sigma-loading-card` and
`sigma-loading-overlay`. StateMessage remains the translated semantic
loading/error/empty owner; only its loading presentation moves to this common
source so startup can use it before Angular and without a CSS/JS request.

Preserve the ring/status/card values above. The indicator's inline modifier
scales the same ring to1em/2px border with a2px inner inset; it does not choose a
second glyph/animation. Public CSS hooks retain the existing state size/padding
variables and add `--sigma-loading-color` for contrast (shared solid buttons use
currentColor). Decorative rings are aria-hidden; real status/aria-busy and
busy/disabled guards remain owned by the consuming request/control. Logical
sizing, theme fallback before app styles, reduced-motion, forced-colors and
print hiding are defined once in that critical source. Never copy these
keyframes/ring borders into component or feature styles.

Layout uses the existing one page host with the shared overlay/card classes.
Static startup uses those same classes and a readable label, with a fixed
startup placement modifier only; remove modern-spinner, pulseText and its
independent palette. Angular's body-root bootstrap still owns replacement;
do not add a second splash service/timer. UI29's critical-CSS guidance explains
the inline placement rather than a copied asset stylesheet.

Shared PrimaryActionButton's local loading, DataTable's public loadingicon
template, and header branch/background-refresh indicators render the same ring.
DataTable/PrimaryActionButton still suppress duplicate progress while global
loading is active; global-owned tables explicitly set showLoadingIndicator=false
to prevent transition flashes. PrimaryActionButton's legacy loadingIcon input
remains accepted for compatibility but no longer selects a competing visual.
Ordinary nonloading Refresh/Retry/action icons remain unchanged. Keep the
publisher's real loading input and accessibility when changing only its icon.
Login/Registration's pending controls and FileField's upload control use the
same inline ring with currentColor; retain their existing guards, labels and
request lifetime. Charges uses StateMessage instead of its private rotating
refresh glyph. Remove the now-unused sigma-spinner native skin/keyframes and
charge-settings-spin; this presentation adoption does not change those features'
authentication, financial or upload contracts.

EditorDialog renders one shared StateMessage/card overlay inside its relative
content while saving; Save/Print glyphs stay static, saving/aria-busy and close
guards remain. Keep the caller's paired global write count and independent
NavigationActivityService safety. A **dialog read** instead stays local: capture
its local request state, render one StateMessage and suppress its table/button
spinner, without starting a hidden global count. Preserve errors/Retry, selected
identity, stale fencing, cancellation and teardown. Supplier detail and balances
drill-down follow this rule. Page/routed reads retain their global owner.

Auxiliary bootstrap batches use one ReferenceLookupStatus: required routed
bootstrap uses the page host, dialog bootstrap uses local StateMessage. Remove
duplicate per-select loading icons while retaining their aria-busy/disabled
contracts. Coherent independent sources may share that aggregate status.
Retained-data cache refresh stays silent locally; the existing header badge
keeps its500ms actual-request gate and now uses the same ring. PendingMotion's
decorative **data placeholders/counts** remain separate from request loading;
the header branch no longer uses the three-stroke placeholder animation (UI24).

The error interceptor never releases an anonymous page count: it did not start
one. Each subscribed owner releases exactly its own start in finalize on
success/false/error/unsubscribe. Otherwise an uncounted auxiliary error or a
double release can hide another pending read. Feedback and401 behavior remain
with the interceptor; route-path reset, render-safe publication and write
navigation safety remain unchanged. No request caching or API/business change
follows this appearance correction.

Evidence: SHARED_LOADING_UNIFICATION plan/UI handoff/review; actual JV path,
StateMessage/Layout/controls/index and Customers/Suppliers consumers. Source
conformance and removed duplicate skins are distinct from pending owner
startup/network/overlap/cancel/RTL/theme/motion/visibility acceptance.

Global-only table consumers may additionally pass shared DataTable
`[showLoadingIndicator]="false"` (default true). This binds the installed
PrimeNG public `showLoader` independently from its `loading` state, so a
global counter transition cannot reintroduce a local table mask. Always pass
actual loading through to PrimeNG and keep wrapper behavior guards intact;
never use a false busy flag to hide a visual. Languages list/texts choose this
explicitly under the owner's repeated table-spinner report. Other consumers
retain their default local indicator when global loading is inactive.

**Error presentation — single owner.** The global `errorInterceptor` presents **every**
failure of a Sigma API request: a `Result` with `isSuccess: false` (any status) and every HTTP
error, through `ApiErrorDialogService`, and handles `401` (logout). It does not
release request-owned loading counts; callers finalize those counts themselves.
A feature therefore does **not** show its own toast or dialog for the same failure;
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
