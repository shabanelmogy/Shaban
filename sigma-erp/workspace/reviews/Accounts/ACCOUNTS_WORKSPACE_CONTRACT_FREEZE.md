# Accounts workspace contract freeze

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Frozen scope

`WORKSPACE_API_DISCOVERY.md` supplies exact producer/consumer contracts for Account, Link Accounts, FiscalYears and MonthClose. The user authorizes all confirmed guide fixes. Preserve every existing route, DTO, business invariant, server state guard, accounting transition and replacement scope described there. Authentication remains the only established access mechanism.

Account is the canonical tree exception (UI screen04); Link Accounts is the typed settings exception (screen06). FiscalYears and MonthClose use canonical list/dialog/action patterns. No generic CRUD redesign. MonthClose GET materialization is existing behavior; no write-policy/API redesign in this conformance pass. Account conversion preserves its existing reference move and transaction. Fiscal-year close retains ordered checks/final confirmation. Link Accounts save retains all loaded types and full per-type reconciliation; never send a partial destructive replaceTypes payload.

## Confirmed implementation concerns

Container-fill host/global page/panel, fixed shared title/filters/actions, one internal scroll owner, shared dialog/tab/control/error/summary owners, typed forms/calls/payloads, shared date parsing and validation/focus, cancellable read ownership, load readiness/retry and both error channels are required. Remove local shell/palette/viewport calculations and deep shared overrides. Preserve dirty forms across failed writes and confirm before discard/navigation. Capture stable record identity and recheck busy/state after every pending confirmation. Standard feedback remains interceptor-owned unless explicitly suppressed for inline/composite ownership. Composite success is emitted after refresh completes, with correct busy cleanup.

| Concern | Book | Actual reference | Shared owner | Target |
|---|---|---|---|---|
| List shell | UI1/3/6 | Workshop/Job list host and sigma-list-panel/table fill | global styles/FeatureTitle/DataTable | FiscalYears/MonthClose match values |
| Tree/settings exception | screen04/06, UI1/13/15 | existing Account tree and LinkAccounts typed settings behavior | shared route/editor shell/tabs | Keep contracts, remove bespoke shell |
| Dialog validation | UI9/13/16/26 | Workshop/Job close-job typed dialog and shared EditorDialog inputs | FieldError/FormValidationSummary/focus/date-utils | Correct control labels/errors/dirty lifecycle |
| Actions | UI7/22 | Sales/SalesQuotation owning list/action-button and supported transitions | ConfirmationDialog/interceptors | Inventory each public action and preserve guards |

## Ownership

The worker owns all files under the four frontend roots only. Root owns related layout/routing/tsconfig/translations integration. Backend changes that alter behavior require returning to root; no independent API/domain policy. Worker must read applicable books and exact reference source before edits, preserve peers/user changes, source-review full owned diff and produce `ACCOUNTS_WORKSPACE_FEATURE_REVIEW.md` with final conformance evidence. Root integration and owner runtime verification remain pending. No builds/tests/lint/browser/database/migrations/commits.

## Source reconciliation amendment — 2026-10-05

MonthClose retains the original paged FiscalYear API and start/end date-range option labels, but materializes all pages through fetchAllPages at pageSize100. A partial first-page size200 read could omit valid years and is not a complete lookup contract. No selection API, backend period policy or GET materialization behavior changes.

Account direct detail-route Save/Delete carries only the existing success message and selection identity in router navigation state to the Account tree. That fresh tree read owns final success feedback, just as embedded editor results do. A user Close carries no success message. This is local refresh/feedback wiring, not an API or business-rule change.

## Owner create-date suggestion amendment — 2026-10-05

Owner requests the next fiscal-year suggestion following the latest existing year, or current calendar year for the first year. Frozen presentation-only decision: on Create, read the existing tenant/live FiscalYear list at page1/size1 with endDate descending (actual producer explicitly supports that ordering with Id tie-breaker). All statuses included, no current-page/filter inference. When a latest year exists, suggest start at its EndDate +1 local calendar day and end one calendar year after that start minus1 day. This preserves contiguous annual periods for calendar/noncalendar fiscal years and handles leap days with local calendar arithmetic. If the latest existing year is a shortened period, the next suggestion is a complete annual period beginning the following day. Empty proven dataset suggests January1 through December31 of the current client-local year. Suggestions remain editable; no creation until Save, no fiscal-year overlap/date validation change.

Read failure or malformed latest-date/metadata does not silently imply first year: block Save, retain load error and Retry. Disable fields while loading; ignore late data after dialog closes; patch pristine defaults once, and do not overwrite Edit/View records. Reuse existing shared dates/local serialization, state message/loader and editor mode owner. No API/schema/backend calculation change, migration, reference module modification or new Guide rule. Root owns FiscalYears details TS only; no overlap with MonthClose frontend worker.
