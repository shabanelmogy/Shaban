<!-- Part of UI block 1: see ../01-feature-folders-and-wiring.md. Same status and authority as the block. -->

### Working-branch bootstrap and switch safety
Root CurrentBranchService owns branch state and authenticated-session lifetime;
by default the content outlet waits for its initial read to settle so UI16 defaults exist
before a screen's first query. Read failures remain visible in the topbar with
Retry; they do not invent a preference. Changing a branch commits the returned
selection only after a successful single-flight save, keeps the previous branch
on failure, and ignores an ended/replaced session's response, including logout
and re-login to the same account. It uses the one interceptor-equipped client.

**Explicit branch-independent reads.** Route data may set
`requiresBranchContext: false` only when its real request is independent of
working-branch defaults; Dashboard/Snapshot's ownership/fleetType-only tenant
read is the approved consumer. `showPageLoading: false` additionally chooses
silent page presentation; both policies default to true when omitted. The
Layout reads actual deepest active-route data at initialization/NavigationEnd,
preserves session recovery, and never resets a global loading counter to hide
an overlay. Header branch error/Retry and branch-save/write/inert guards remain.
The existing navigationPolicyGuard enforces branch readiness before activating
dependent targets, including an immediate departure from Dashboard during
branch bootstrap. Reuse CurrentBranchService's finite, coalesced load; its
forkJoin value precedes readiness finalize, so resume activation via the
firstValueFrom Promise continuation after that synchronous completion/finalize,
then recheck write/saving guards. An initial failed attempt still settles under
the existing header recovery contract; do not invent a selected branch.

**Branch auxiliary read motion.** ShellHeader binds the real
CurrentBranchService.loading state (Options/Mine finite forkJoin/finalize) to
PrimeNG Select's public loading input and loadingicon template. Owner2026-10-26
unifies request-loading appearance: UI22's shared ring replaces the earlier
UI24 PendingMotion trigger; keep confirmed labels, disabled
guards, aria-busy, Result/HTTP errors, Retry and save state. Below360px header
width the branch trigger usually hides its dropdown icon; its data-loading
exception shows only that same motion trigger inside the unchanged32px control
until loading ends. Do not hide the indicator behind the compact CSS or add a
second progress owner. Requests remain local auxiliary reads, not global page
loading or newly opted-in reference-cache reads.

The topbar checks currently rendered canonical editor boundaries (routed
sigma-editor-page, step-form, appMockData form roots and PrimeNG dialog portals)
before permitting a switch. Hidden/unmounted surfaces do not block. This is a
UI safety guard, not authorization or a substitute for existing dirty-discard
rules. Close the editor first; switching never discards it. While saving, the
shell wrapper is inert; existing screen values are not rewritten afterward.
New editor shapes must be reconciled with this shared safety boundary. Shared
bilingual UserGuide guidance describes saved defaults, failures and deferred
permissions.

**Stable rendered-editor state (owner NG0100 evidence, 2026-10-20).** Do not
evaluate the live DOM boundary predicate from navbar disabled/title/aria or
conditional template bindings: a routed editor or dialog can mount after the
navbar was checked and change the answer during Angular's verification pass.
CurrentBranchService exposes readonly editorOpen for presentation. Its installed
Angular21 afterEveryRender(read) observer coalesces one deferred microtask, re-reads
the same rendered-boundary predicate, and publishes in NgZone only on change;
DestroyRef prevents a queued publish after teardown. Keep hasOpenEditor() live
at change()/Retry action boundaries so a pending presentation update cannot
permit switching over a newly opened editor. No timer polling, forced
detectChanges, feature-specific Bill guard or weakening of the editor boundary.
Shared EN/AR guidance covers block/re-enable behavior; source-only verification
does not prove the owner's open/close/navigation runtime acceptance.
