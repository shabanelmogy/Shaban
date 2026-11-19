| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# TripBooking list continuation — 2026-10-09

Bounded ownership covers only `TripBooking/components/list/list.component.ts` and `.html`. Root owns TripBooking details/invoice, shared utilities, translations, guide and integration. Frozen continuation contracts remain authoritative; no financial, workflow, date or API semantics were changed.

## Conformance evidence

| Concern | Canonical block/reference | Final source evidence |
|---|---|---|
| List shell/filter/grid | UI1/4/6; Workshop/Job list | Existing `sigma-route-host`, `appFilterPanel`, `app-data-table [fill]`, typed columns and lazy list retained. Busy guards now include dialog/confirmation/workflow states. |
| Tax/settings lookup | UI16/22; TaxSettingsService.load | Required `load({requireSuccess:true})` is joined with Limousine settings. Plain TaxSettings is not treated as a Results response; `settingsReady` requires Limousine settings success and non-null tax settings. Option lookup failures remain the lookup error owner. |
| Pending workflow state | UI10; shared `freezeFormState`/`freezeFormStates` | Discard, workflow-resource loads and mutations capture disabled control state and restore only when the same live dialog/identity remains. New-dialog initialization retains the existing blanket enable then tax-disabled rule. |
| Stale close decision | UI10/28; StatementOfAccount canDeactivate | `canDeactivate` rechecks subscription, disposed state, dialog/record identity, dirty state and busy flags inside `defer`; cancel restores the captured states. Accepted close does not restore a destroyed/closed surface. |
| Mutation identity/refresh | UI7/10/28; existing list query switchMap | Mutations capture dialog/id; success is accepted only for the same active target. `finalize` clears busy/restores live forms before `refresh(true)`, allowing the post-mutation list request without weakening normal interaction guards. Confirmation rechecks current row identity and delete/NoShow eligibility before starting. |
| Date/filter/paging | UI17/20/28 | Existing local date parsing, route state and capped paging remain. Search/reset/lazy paging/refresh/printTrip/readAll now respect dialog, confirmation and workflow busy states; mutation final refresh is the explicit exception. |
| Dialog/accessibility | UI3/13/27 | `EditorDialog` now opts out of automatic focus (`focusOnShow=false`) while preserving translated title/subtitle, shared shell and keyboard close flow. |
| Paginator translation | UI6/23 | DataTable uses translated key `tripBooking.showingEntries`; EN/AR keys are root-owned pending additions (absent from current tripBooking blocks at handoff). |
| G10 readability | Master5 | Touched guards/effects and newly changed control flow are expanded; remaining historical compact action descriptors are unchanged behavior and should be reviewed by root if broader formatting is desired. |

## Lookup and workflow contract

`loadLookups` still requests the six option lists plus Limousine settings through the existing skip-interceptor forkJoin. Tax settings now uses the required-success shared owner and catches to `null`; it cannot silently leave the default tax rate as a successful readiness signal. Existing settings values, `previewTax`, assignment gate and tax-editability behavior remain server-owned.

The form freeze captures intentionally disabled tax controls and restores them after pending confirmation/resource/mutation work. A successful mutation closes the same active dialog (when applicable), releases busy state and then refreshes. Failed responses preserve the active dialog and form values for retry; the global interceptor remains the failure owner for mutations.

## Source-only checks and handoff

- Parsed the changed TypeScript and Angular template with installed TypeScript and Angular compiler APIs without diagnostics.
- Reviewed exact shared declarations for `focusOnShow`, `showCurrentPageReport`, `freezeFormStates`, `TaxSettingsService.load` and `DataTable` inputs.
- Ran `git diff --check` for the two owned files; no whitespace errors. No build, test, lint, browser/app, database, migration, Graphify, Sigma MCP, commit or push command was run.
- Translation parity must be rerun by root after adding `tripBooking.showingEntries` to both vocabularies.
- Owner acceptance remains pending: required tax/settings failures and retry, delayed close/confirm/mutation identity races, disabled tax preservation, successful refresh, all workflow transitions, route restore, pagination, print/export, Arabic RTL/dark theme, narrow layout and keyboard focus.

Changed files: `src/app/modules/Limousine/TripBooking/components/list/list.component.ts` and `.html`. Suggested commit (do not commit): `fix(limousine): harden trip booking list workflow state`.
