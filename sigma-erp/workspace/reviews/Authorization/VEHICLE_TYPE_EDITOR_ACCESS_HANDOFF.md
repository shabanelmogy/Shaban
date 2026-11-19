# Vehicle Type editor access handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `Fleet/VehicleType/components/details/**` |

The mounted editor uses `administrativeDefinitionAccess.FleetVehicleType` for
independent View/Create/Update requirements and captures its opening actor.
The dialog receives `accessBlocked` and `accessRequirement`; revoked access
hides the dialog surface while retaining the draft and closing Select portals.

Detail reads are direct operational `GetById` requests under the current editor
requirement. They cancel on denial, validate numeric id/entity identity, and
never overwrite a dirty draft. A failed read remains in its Retry state; busy
finalization does not bootstrap another read. The body-appended editor owns the
local detail-read state through `loadingDetails` and its rendered
`StateMessage`/`aria-busy`; `loadDetails` does not start the page loader. Save
continues to use the global page loader as its existing write owner.

| Operation | Visible owner |
|---|---|
| Dialog `GetById` detail read | Local `loadingDetails` with `StateMessage` and `aria-busy` inside the body-appended editor |
| Create/update write | Existing global page loader, plus the dialog's save state |

The image field receives the current editor requirement. Its existing
`DocumentUploadTracker` owns media operations with
`Media.UploadMedia` plus `Media.DeleteMedia` for uploads and
`Media.DeleteMedia` for each new cleanup DELETE. Sent save/cleanup lifetimes
are not cancelled on revocation; a new cleanup is not started for a stale
actor, failures remain retryable, and successful-save publication is fenced
through the shared HTTP context.

`canDeactivate()` owns dirty discard confirmation and is used by close. A
confirmed discard starts the tracker cleanup and resolves navigation only after
that cleanup succeeds. The decision captures its requirement, cancels on
denial/context change, and leaves independent sent writes alone. A same-actor
revocation may still clean pending media with the current Media delete grant;
a replacement actor cannot start a new delete. A replacement actor's explicit
confirmed local discard may leave the mounted draft without a DELETE; the
pending media is an existing-server-owner orphan and is not claimed as cleaned
cross-account. The sent cleanup observable is retained independently of a
destroyed UI subscription, while its late result cannot publish an error,
navigation decision, or finish action after the owner/context has changed.
Deferred focus uses guarded timer lifecycle work.

Source regression specifications cover independent grants and the stable
failed-detail Retry ownership. No build, test, lint, browser, database,
migration, or runtime acceptance was run under the source-only boundary.
