<!-- Part of UI block 22: see ../22-loading-empty-error-toast.md. Same status and authority as the block. -->

### Mandatory loading conformance gate

Apply this gate at discovery and final reconciliation for every new or reviewed
screen. Trace the real menu/route entry to its imported component and request
symbols before deciding that a loader is present. A similarly named folder or
legacy component is not evidence for the active route (example: the SalaryVoucher
empty route imports HRM/Payroll/Payrolls' PayrollsComponent; its `legacy` child
uses the older SalaryVoucher list). Inspect both only when in scope and attribute
their request paths separately.

In the existing review/contract, record one row per request path or coherent
operation with the same lifecycle. Do not create another artifact solely for
loading. Use actual route, producer and consumer symbols:

| Active route and request/operation | Visible progress owner and reason | Start, finalization and cancellation | Route visibility and rendered progress | Busy, error and Retry | Final source evidence and pending verification |
|---|---|---|---|---|---|
| Actual routed component, HTTP service method and user trigger | Global page including required filter bootstrap / local dialog / explicitly silent | One subscribed start and exactly one finalize release, or the shared identity-owned lookup lease driven by finite bootstrap/finalize and consumer destruction; success, false envelope, HTTP error, unsubscribe/destroy and stale-read ownership | Effective showPageLoading metadata; sole shell host or local dialog StateMessage/control; no inline page-filter loader | Local busy/disabled/aria-busy retained; single feedback owner and actionable recovery | Matched/finding/unresolved with actual symbols; browser/network/timing acceptance separate |

**Who owns visible progress.**

- Page/list/detail reads, editor Save, domain/destructive actions and report or
  export data reads use the global LoadingService with paired start/finalize.
- Required routed initial/filter lookup bootstrap keeps its operation flags but
  contributes to the same page host through shared ReferenceLookupStatus; no
  inline loading indicator appears in the filters. The page indicator remains
  until required bootstrap and operational reads both settle.
- Dialog lookups and dialog-owned reads stay local (one StateMessage per dialog
  surface). A body-appended dialog whose overlay hides the shell loader uses its
  shared local StateMessage and suppresses a second table mask.
- Retained reference-cache revalidation is silent (UI2); the header background
  badge is its own presentation owner.
- Dashboard's explicit local, silent page policy (below) is not a general exemption.
- Never add a second global host or a feature spinner/skin to fix visibility.

Inspect the effective route's `showPageLoading` value and the actual shell host;
starting a global counter cannot display an overlay on a route that suppresses
it. Do not copy Dashboard's false value to ordinary lists/editors. Preserve local
busy inputs and duplicate-execution/navigation guards even when their visible
spinner is suppressed. Keep error/empty/Retry rendering; removing a duplicate
loading StateMessage does not remove those states.

Review route-driven lifecycle as well as HTTP pairing. Same-path query/fragment
changes, including `writeListRoute` filter/sort/page updates, preserve pending
progress. Actual path departure releases requests through their finalizers. Do
not work around a shared lifecycle mismatch with feature timers or delayed
starts. Missing request/visibility evidence or a known unapproved mismatch is a
finding under Master5. Source inspection establishes wiring only; runtime
visibility, overlap, cancellation and timing are separate evidence.

**Aggregate lookup failure with a pending tail.** ReferenceLookupStatus keeps its
one dialog loading StateMessage visible while any required batch/context read is
pending, even if another member already failed. Error feedback is independent;
Retry stays disabled until that batch settles. Error-first template branching
must not hide the sole progress owner (examples: Lease Inquiry, Cost Setting).

**Shared document readers.** DocumentApprovalCycle and DocumentActionLog take
`localReadProgress` (default false = page-global read progress). A body-appended
dialog consumer sets it true: the reader uses its StateMessage loading branch and
suppresses a second table mask. The read captures its owner before subscription
and releases only a started global count in finalize; changing the input cannot
unbalance it. This affects reads only (approval decisions, events, errors/Retry,
busy/close guards and default consumers unchanged). Example: JVs status/log
dialogs use true; its saved approval tab keeps false.

`DocumentJournalComponent` defaults to local dialog progress
(`localReadProgress=true`); a deliberate false uses the page count, captured at
read start and released exactly in finalize; its table suppresses a second mask.
Its optional `accessRequirement` uses the session evaluator, the original mounted
actor, record identity and read sequence for Load/Retry/output and deferred
close-button focus. Expiry cancels the read, clears output and closes this
disposable viewer; reopening creates a new context. Pass the requirement and
blocked state into EditorDialog instead of adding a second overlay owner. No
write or draft lifetime is cancelled. Consumers without the requirement keep
their current access contract (example consumer: Provision Transactions).

**Shared transaction-currency display.** DocumentCurrency feeds its actual
base-policy and partner-read flags into ReferenceLookupStatus: page-default
progress and inherited EditorDialog local scope, with host aria-busy. Replaced
supplier/customer input reads unsubscribe before the replacement starts; retain
version fences, DestroyRef finalization, saved supplied-code precedence, persisted
base fallback and partner currency selection. Partner detail failures use one
inline translated error/Retry in this owner, keep the existing fallback and retry
only the failed current partner context. Base policy keeps its optional
fallback/global feedback mode and request coalescing. The customer-currency
display cache is UI2's narrow exception: after its finite successful read, mount
the separate shared-source watch; keep the current code while a retained snapshot
refreshes silently and show progress only when no successful snapshot exists.
Cancel/clear the old identity on a context reset and show shared field feedback
to reselect/reopen; never reuse an old customer ID in a different context. This
exception does not cache supplier details, financial policy or prices, and does
not change any form amount. Sales documents and current consumers inherit it.

**Document-currency conversion preview.** The same owner uses
`LOOKUP_LOADING_SCOPE` for its conversion read. Page scope pairs the subscribed
read's start/finalize with the global loader; dialog scope feeds
`previewReadLoading` into its local ReferenceLookupStatus. That read ends before
the confirmation opens. Keep `previewing`/pending and disabled guards across the
confirmation without showing a request loader while waiting for the user.
Replacement, cancellation, HTTP/business failure and destroy release the
captured read owner. Never cache this quote read or add a feature spinner.


### One visible indicator at a time

Exactly one loading indicator is visible per covered surface, on every page; a
common ring alone is insufficient, because a translucent page overlay can leave
an auxiliary StateMessage visible behind it.

**Control-level suppression.** While the global LoadingService is active, shared
DataTable hides its PrimeNG loading overlay, PrimaryActionButton keeps its
ordinary icon, and EditorDialog keeps its ordinary Save/Print icon and shows the
shared loading status inside its body while saving. Their loading/saving inputs
still own disabled, aria-busy, empty-state and navigation guards; `toSignal`
observes the BehaviorSubject with requireSync and component-lifetime cleanup,
including OnPush buttons. Without global loading, local-only requests use the
same shared ring. Global-only table consumers may pass DataTable
`[showLoadingIndicator]="false"` (default true), which binds PrimeNG's public
`showLoader` independently of `loading`, so a counter transition cannot flash a
table mask; always pass the actual loading through and never use a false busy
flag to hide a visual (example: Languages list/texts). A screen using
global-only progress must not render a second loading StateMessage for the same
request; error/empty messages remain. Never clear busy inputs or hide loaders
through feature CSS.

**Stylesheet visibility precedence** (the critical loading stylesheet, for every
consumer, no opt-in):

- While the **rendered** `sigma-shell__loading` host exists, hide loading
  StateMessage hosts and compact loading rings within `sigma-shell__route`.
  ReferenceLookupStatus page scope contributes to the shell instead of rendering
  an inline message; dialog scope delegates to local StateMessage. Do not key
  this on a service count: a silent route may render no page host.
- A body-appended PrimeNG dialog is outside that routed subtree. Keep its local
  StateMessage visible; while it has loading progress, hide background shell
  progress and covered routed local indicators, even without a shell loader.
  Inside EditorDialog saving progress, hide loading StateMessages covered by its
  foreground overlay; never hide the save overlay's own StateMessage, an error or
  an empty state.
- Inside a dialog without a foreground save owner, use **one aggregate auxiliary
  status per surface**, not one per dropdown/request. Tables/buttons keep their
  shared suppression and dialog-local masks stay suppressed. A routed/dialog
  StateMessage takes precedence over compact inline button/upload rings on the
  same surface without changing their busy/disabled/accessibility state.

These selectors use the real Layout/StateMessage/PrimeNG portal hierarchy, not
feature CSS or a second host. Request start/finalize/cancel, busy/aria-busy,
errors/Retry, cache watches and write/navigation safety are unchanged; no new
timer, counter or request serialization is needed to suppress duplicates.

**Dialog reads and saves.** EditorDialog renders one StateMessage/card overlay
inside its relative content while saving; Save/Print glyphs stay static and
saving/aria-busy and close guards remain; the caller keeps its paired global
write count and NavigationActivityService safety. A **dialog read** stays local:
capture its local request state, render one StateMessage and suppress its
table/button spinner, without starting a hidden global count. Preserve
errors/Retry, selected identity, stale fencing, cancellation and teardown
(examples: Supplier detail, balances drill-down).

**Auxiliary bootstrap batches** use one ReferenceLookupStatus: required routed
bootstrap uses the page host, dialog bootstrap uses local StateMessage. Remove
duplicate per-select loading icons while keeping their aria-busy/disabled
contracts. Coherent independent sources may share that aggregate status.

Every screen handoff traces simultaneous page + lookup, lookup-only, dialog read +
background page work, and dialog save + retained lookup state through the
rendered owners. A list/table suppression input alone is not conformance. Never
claim a visual check from CSS syntax validation.


### Page-scope lookup bootstrap mechanism

ReferenceLookupStatus consumes LoadingService and defaults to
`loadingScope='page'` via `LOOKUP_LOADING_SCOPE`. On input changes it calls
`setPageLookupLoading(this, loading && loadingScope === 'page')`; destruction
releases only that identity. LoadingService combines its subscribed request
count with the Set of live lookup owners and publishes through the same
render-safe path and Layout host. Repeated updates are idempotent; releasing a
lookup never decrements a request count or another owner. The page-mode template
keeps error/Retry but renders no inline loading StateMessage. Keep this consumer
mounted for the pending bootstrap, outside any condition waiting for it.

The finite bootstrap's local loading flags/finalize settle on success, false
envelope, HTTP error and cancellation; the mounted owner observes that state and
ends its lease. View departure destroys the owner; a query/fragment-only
navigation keeps it. `LoadingService.reset` clears request-owned counts; lookup
identities follow their component lifetime. Do not anonymously decrement page
counts, clear another owner's lease, add feature timers or serialize reads.

EditorDialog provides `LOOKUP_LOADING_SCOPE='dialog'` using **providers** (not
viewProviders, which excludes projected content), so its view, projected
ReferenceLookupStatus and nested driver/editor children inherit local dialog
progress after the portal moves to body. An approved nonstandard dialog can set
`loadingScope='dialog'` or provide the token at its owner; routed screens need no
opt-in. Keep one aggregate dialog status, errors/Retry, save foreground
precedence and write safety. Retained-data revalidation acquires no page lease.
Do not turn all GETs into blocking page work or opt excluded reads into a cache.
Conformance traces cover cold/warm bootstrap, failure/Retry, overlapping report
and lookup completion in either order, multiple owners, destruction/query-only
navigation and projected dialog scope ([Angular providers versus
viewProviders](https://v20.angular.dev/guide/di/hierarchical-dependency-injection#providers-vs-viewproviders)).
