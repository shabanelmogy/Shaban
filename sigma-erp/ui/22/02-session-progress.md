<!-- Part of UI block 22: see ../22-loading-empty-error-toast.md. Same status and authority as the block. -->

### Sign-in progress and session publication

The authentication form owns a typed, nonnullable credential form and one
pending gate spanning the credential request and its router promise. Check the
gate in the submit handler as well as disabling the button. Distinguish checking
credentials from opening the workspace with translated status text. Pause the
credential controls during the attempt so displayed inputs match the submitted
snapshot; re-enable them with their values on pre-session failure. Validate
Result success/entity and required session fields before using them. Persist
credential, user and subscription before publishing currentUser (root
subscribers can start authenticated branch reads synchronously). Handle failed
storage without publishing the new user; restore prior values on partial writes
where storage permits. Never print credentials or token-bearing responses. If
authentication succeeded but navigation returns false or rejects, release the
gate and offer opening Retry using that session without another login POST;
keep the authenticated form disabled. Request failure keeps editable inputs. Use
component-lifetime teardown/finalize; auth-service HTTP busy ends on HTTP
completion while the form's pending state also covers navigation. Keep
auth-origin interception, tenant/branch/default semantics and dashboard
freshness unchanged (UI1/2/26/28/29).


### Sign-out transition and session cleanup

AuthService owns one in-flight sign-out promise and readonly pending/error state.
Ordinary sign-out first navigates through the shell and feature guards; only a
successful departure clears stored token, user and subscription and publishes the
ended session. A refused or failed navigation keeps the session/draft and offers
translated Retry through the existing shell/state/action owners. Login does not
auto-open the workspace or submit while sign-out is entering its route. The
shell pauses navigation during that attempt; guards are not bypassed.

An unauthorized Sigma API response hands its actual request credential to the
same session owner. Clear immediately only when it still matches the current
credential; a late response from an old session must not end a replacement.
Coalesce concurrent failures/departures, preserve the observable error channel,
and do not race routing with an unconditional document reload. If expired-session
departure is blocked, expose the ended-session state and Retry outside the
account popover, including the explicit logout route. Do not retry uncertain
writes or treat client cancellation as server rollback (UI28).

TranslationService.endSession cancels the runtime read, restores only overridden
built-in dictionaries and removes tenant-only languages, preserving immutable
originals, default/fallback language, RTL and next-session isolation. Repeated
cleanup after session publication and shell destruction is a no-op. Do not clone
or republish unaffected dictionaries on each call.

**Cached background revalidation.** Refreshing reference data when a successful
snapshot exists must not start a page loader, disable the form or render the
shared lookup loading panel. Keep retained data visible; ReferenceLookupBindings
exposes loading only when `state.loading` is true and `state.value` is null. An
empty successful list is retained data. Preserve initial loading without a
snapshot and error/Retry after a failed refresh. ReferenceLookupState still
reports the real request state; this is presentation, not hidden requests or
cached failures. Page bootstraps and writes keep their own loading contracts.

**Shared background refresh badge.** The root cache exposes readonly
`backgroundRefreshing` from actual loading entries that retain a successful
snapshot. ShellHeaderComponent alone shows a small translated status after 500ms
of continuous activity and hides it when the last refresh settles, fails,
cancels or resets context. Initial loads, fresh cache hits, idle invalidation,
queued refresh timers and writes do not qualify. Do not start HTTP to show the
badge or delay requests/results for its animation. Reserve its header slot to
avoid movement; compact to an icon with accessible text on narrow containers;
reuse Sigma theme tokens, polite status and reduced-motion support. Cancel the
delay on state change/header destruction. The badge is activity, not a
success/failure notification or permission gate.
