## 10. Confirm: discard

> **Status: Canonical**

Cancelled result subscriptions use UI9's shared confirmation teardown: close
only their own unresolved dialog without accepting discard. Retain the existing
identity/context checks, frozen-form restoration and independent write safety.
A cancelled CanDeactivate confirmation returns false. For a decision stream
cancelled with takeUntil, apply defaultIfEmpty(false) after the cancellation
operators and before any cleanup or write starts (UI28).

Commit the focused edit before evaluating `form.dirty` in an editable
form with `updateOn: 'blur'`. An initial edit can still be pending when
Escape or a route guard runs. Check Escape and navigation with the first
changed field still focused. Confirm that cancelling discard keeps the value.

### Shared shell navigation policy
NavigationPolicyService is the common fallback for registered reactive editor
forms. The existing appMockData form owner registers its actual FormGroup through
a lazy getter and its DestroyRef; registration does not depend on the generated
data feature being enabled. Ignore pristine/disabled/hidden/disconnected forms
and appFilterPanel; native View/disabled presentation does not become a draft.
Do not infer every legacy editor is registered: adopt this owner or the existing
feature guard during its screen review.

LayoutModule keeps one shell CanDeactivate with runGuardsAndResolvers=always.
Angular21 reruns this exit hook for reused shell routes, including child/query/
parameter changes; canActivateChild checks writes only. This gives the fallback
one decision per transition, rather than replay caches across nested guards.
Where a departing feature CanDeactivate will run, retain its richer dirty/
attachment/business decision and do not prompt again. Query-only transitions
without a feature guard rerun still use the shared fallback. Menu, shortcuts,
imperative Router navigation and browser Back share the actual route guard.

Defer one shared confirmation, capture form identities/lifetimes, freeze each
registered root subtree once with the existing form-state helper, and recheck
write state/identity/new drafts before acceptance. Cancel keeps values/dirty state
and restores intentionally disabled controls; a still-live form made pristine
while waiting also restores its controls. Never enable a destroyed/replaced
form. Pending frozen forms still count for beforeunload. Browsers own the generic
reload/close warning text. Successful save remains the feature's existing
pristine/save-completed exit contract, not a global markAsPristine shortcut.

Any editable form that can be left with unsaved data needs this. References: routed editor
`Workshop/Job/components/editor` (`requestClose()`), dialog editor
`Fleet/Vehicle/components/details` (`requestClose()`); the Company editor uses the same shape.

```ts
cancel() {
  if (this.isViewMode() || !this.companyPartnerForm.dirty) {
    this.leave();
    return;
  }

  this.confirmationDialog
    .confirm({
      severity: 'warning',
      title:   { key: 'companyForm.discardTitle' },
      message: { key: 'companyForm.discardMessage' },
      icon: 'bi bi-exclamation-triangle',
      confirmLabel: { key: 'companyForm.discard' },
      cancelLabel:  { key: 'general.cancel' },
      confirmIcon: 'bi bi-x-circle',
    })
    .pipe(takeUntilDestroyed(this.destroy$))
    .subscribe((confirmed) => {
      if (confirmed) this.leave();
    });
}

private leave(): void {
  this.router.navigate(['/CompanyPartner']);
}
```

Keys per feature: `<feature>.discardTitle`, `.discardMessage`, `.discard`.

**Return to the list as the user left it.** A routed editor goes back with the list's state.
The list passes its filters, page and sort as query parameters when it opens the editor
(`returnQueryParams()`), and the editor navigates back with them:

```ts
private close(): void {
  void this.router.navigate(['/Job'], { queryParams: this.route.snapshot.queryParams });
}
```

The list restores its form and page from those parameters on load. A hard-coded
`router.navigate(['/Feature'])` loses the user's filters — a defect (found in the Company
reference snippet above, kept for the dirty-check shape only).

When Search applies draft filters explicitly, serialize the applied filter snapshot for
paging and editor return. Successful row actions refresh that snapshot too; a draft control
edit without Search must not silently change the query during an action or editor handoff.

For a dialog editor, do not rely on two-way `visible` binding or `(onHide)` to
decide whether closing is allowed: by then PrimeNG has already hidden the
surface. Use the controlled-visibility pattern in block 13. Its X, Cancel and
scoped Escape handler call `requestClose()`; its mask close is disabled. If a
screen must support mask-to-close, the mask intent must be intercepted before
visibility changes and routed through the same method.

**Presets.** `confirmation.confirmDiscard('<feature>')` uses the three feature keys. The list
keeps its state with `readListRoute(route)` / `writeListRoute(router, route, params)`
(`shared/utils/list-route-state.ts`): `number`, `text`, `flag` and `paging()` read it back.

### Pending discard decision

When `canDeactivate()` returns an Observable, open the confirmation inside `defer`,
after checking the captured editor identity, visibility and busy state again.
An obsolete or duplicate subscription returns `of(false)` without opening another
dialog. Calling the guard without subscribing must not open a dialog or leave a
pending flag behind. Keep the same gate for route, X, Cancel and Escape exits.

Freeze editable reactive controls with `disable({ emitEvent: false })` during the
decision. Release the pending flag in `finalize` and restore the previous editable
state only for the same still-visible editor, with no save or upload cleanup in
progress. Cancel retains values and dirty state; a stale decision cannot enable,
reset or close a replacement record. Preserve intentionally disabled controls.
Use the existing confirmation service and local editor identity; no new state
framework is needed. Source examples: Movements Collection, Delivery and Custody
editors (2026-10-07). Compiler, interaction and navigation acceptance remain pending.

Lease follow-up (2026-10-09) extracts temporary control-state capture into
`shared/utils/form-state.ts` → `freezeFormState(form, destroyRef)`. It disables
without emitting value changes and returns an idempotent restoration callback
that retains originally disabled subtrees and skips a destroyed editor. The
consumer still owns record identity, pending state and save/upload cleanup gates;
it must not restore controls during committed attachment cleanup. Reuse this
owner for reviewed pending discard/removal decisions instead of copying a
control traversal. Lease routed exits use one deferred CanDeactivate decision,
while successful Save bypasses discard. This is source-only; owner interaction
and compilation acceptance remain pending.

**Check:** returns to the list with its query parameters · view mode leaves silently · pristine form leaves silently · dirty
form always prompts · Cancel, X and Escape use one method · mask closing is
either disabled or goes through that method before the dialog hides · pending
confirmation freezes controls · deferred guard rechecks identity/busy state ·
Cancel restores the same values and dirty state.

**Accepted decision ordering.** RxJS delivers the confirmation's
accepted value before its `finalize` releases `closeConfirmationPending`.
The accepted X/Cancel/Escape subscriber therefore checks the same visible
session and independent save/load/parsing gates, without treating that
confirmation's still-pending flag as a new blocker. Otherwise Confirm does
nothing and the user must close again. Keep duplicate subscriptions blocked
at the deferred entry and keep cancellation restoration in `finalize`.
Deduction record/import dialogs adopt this source correction; other consumers
are reviewed within their own scope. Keyboard and interaction acceptance is
owner-pending.

---


### Limousine multi-form pending reads and decisions
A routed editor or dialog that freezes separate draft, filter, or contextual forms uses the shared `freezeFormState`/`freezeFormStates` snapshot. Capture at the deferred decision or request boundary, re-check identity, mode, disposed state and other pending work at subscription and before dependent work, and restore only the same active surface after cancellation or a failed request. A successful navigation/save may close the surface without restoring its old controls. Source-only evidence: Limousine TripBooking and LimousineInvoice continuation.
