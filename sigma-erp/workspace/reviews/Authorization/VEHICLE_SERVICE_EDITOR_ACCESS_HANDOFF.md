# Vehicle Service editor access handoff

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

The editor uses `administrativeDefinitionAccess.FleetVehicleService`: View
opens saved details without editor lookups; create/edit require the frozen
`ServiceItem.Lookup` and `Item.Lookup` requirements alongside the CRUD grant.
Reads and lookup bootstrap are cancelled by the active requirement; an access
loss hides/inerts the mounted editor, closes Select portals and the picker, and
retains a dirty draft. Sent create/update writes use `trackWrite` HTTP context,
remain independent of teardown, and latch successful completion before fenced
publication.

`ServiceItem` stays a direct finite lookup. `Item` performs its finite bootstrap
through its existing source-owned cache, then binds the existing Item watch so
invalidation refreshes retained selected labels without a feature cache. Row and
picker confirmations expire with the active editor requirement and recheck the
current row/mutation state before committing. No API, schema or grant was
added. The Speed evidence frozen by the contract is `S229`, screen
`08-fleet/08-services` and controller `C1165`; it supports the
editor/children shape only.

The source-level behavioural specifications cover view-without-editor-lookups,
denied edit mutation/save, an expired discard decision retaining its draft, and
a confirmed picker removal, an expired picker decision, a child-removal pending
state that blocks save, and a sent create finishing after revocation without
navigation publication. The
scoped `git diff --check` completed without diagnostics. The worker did not
resolve the TypeScript parser during its handoff. Root integration subsequently
parsed 32 scoped TypeScript/template files using the checkout's installed
TypeScript and Angular compiler parsers: no syntax errors or missing local
imports were found. This was not type checking or test execution. Root also
kept required routed lookup bootstrap/watch retries under the page loading
owner, removed the duplicate inline detail spinner, and added the exact edit
permission to the view-mode Edit button. No build, test, lint, browser or
database execution occurred. Owner
runtime acceptance remains required for revoke/regrant, lookup watch/cache,
picker and remove decisions, draft discard and sent save outcomes.
