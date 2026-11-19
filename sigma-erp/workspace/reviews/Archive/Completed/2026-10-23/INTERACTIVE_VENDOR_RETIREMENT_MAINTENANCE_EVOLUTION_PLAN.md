| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-22 |
| Authorization | Owner approves starting the proposed runtime-vendor retirement stage |
| Starting frontend | Clean worktree at1ac404cc update; preserve new owner/peer changes |

# Interactive vendor retirement

## Manifest, existing state and impact

Frontend-only scope: root bootstrap/provider/script/package edges, confirmed direct Bootstrap/ng-bootstrap/Metronic interactive consumers, shared ActionButton, Settings Fines/ESalik/EDarb command cells, profile native tooltip metadata, message-log obsolete focus fallback, and unreachable legacy runtime references only after graph proof. User outcome is removal of vendor interactive runtime while retaining shared component owners and current workflows. Global vendor Sass, utility classes, Bootstrap Icons, data-bs-theme, unrelated screens/reports, API/DTO/backend/permissions/business calculations and database/migrations remain unchanged. No screenshot/business contract change applies. Initial targeted symbol scan finds app.config NgbModule, three Settings dropdowns, legacy builder/toolbar/modals/extras ng-bootstrap/Bootstrap metadata and a messageLogs portal fallback. Source/config/scripts and explicit tsconfig roots must establish reachability before deletion.

UI shape: cross-cutting shared presentation/runtime integration, with existing Settings subpages as compatibility consumers (not a whole settings-workspace rewrite). References: UI7 ActionButton/DataTable action ownership, UI9 ConfirmationDialogService, UI24 shared tokens/PrimeNG internals, UI27 overlay focus, UI28 lifetimes, UI29 verification, and main/app.config/app.routes approved root wiring. No backend shape applies; endpoints/methods/payloads and row IDs remain frozen to existing services. Phases PLAN00/discovery/5/6 plus bounded row-action contract; no new domain or persistence phase.

## Frozen decisions and alternatives

| Area | Classification | Target and evidence |
|---|---|---|
| Settings row commands | Refactor | Existing shared app-action-button accepts optional row input for direct embedded command cells while preserving template export/DataTable contract when row absent. Each row retains local body-appended Prime Menu, translations, keyboard/focus/disabled/current-predicate guards; no per-feature Prime menu copies. |
| Settings Fines/ESalik/EDarb | Replace internals | Replace only three Bootstrap dropdowns with the shared direct-row owner. Preserve all columns, forms, secrets handling, endpoints/payloads/create/save behavior. Edit/Delete receive the actual typed row, not visual index; Fines currently passes id into an index method. Canonical shared delete confirmation, single pending action, real row-identity recheck, and both API failure channels apply to touched Delete paths. No server delete invariant is invented. |
| Root vendor edges | Conditional Remove | Remove NgbModule/script/imports/packages only after direct source/route/module/explicit compiler-root graph shows no active consumer. Rewrite a reachable compatibility wrapper through PrimeNG if required; retire truly unreachable demo leaves with producer/consumer and compile evidence. Do not infer unreachability from folder name alone. |
| Profile hints | Refactor metadata | Native translated title/aria-label and Angular clear handler already own behavior. Retire obsolete Bootstrap tooltip/image-plugin attributes without changing upload/remove payloads or style. |
| MessageLog focus | Refactor | Retire the Bootstrap portal-selector fallback and use shared/publisher-compatible conditional focus ownership; preserve active-element/dialog focus checks. |
| Theme/styles/icons | Keep | Global Sass/vendor CSS and existing native icon/theme selector remain until later layout migration. No package removal may break repository Sass/plugin imports. |
| Legacy ListButtons | Conditional Remove | Delete only after imports/selectors/exports/dynamic entry and compiler graph proof. No new replacement if actually unused. |

Alternative rejected: removing global JS/Ngb immediately while known Settings dropdowns remain. Alternative rejected: duplicating Prime Menu in each Settings page. Selected shared owner keeps future changes uniform; native CSS and titles need no unnecessary Prime widget conversion.

## Implementation ownership and gates

Root owns shared ActionButton extension/tests, profile/message focus adjustments, root provider/script/package integration, docs/guide and final full diff/verification. One isolated worker may own only the Fines/ESalik/EDarb component TS/HTML and their tests. One read-only explorer may trace legacy ng-bootstrap/Bootstrap/ListButtons reachability, package/Sass edges and propose exact safe retirement files; it does not edit. No overlapping writable ownership. All APIs/fields frozen above; conflict stops affected portion and reports to root.

Removal gate requires zero remaining reachable runtime consumers, explicit compiler-root reconciliation and package lock consistency. Preserve current Angular21 root single HttpClient, hash/auth/session routes and the completed read/write/draft navigation policy. Scope does not authorize restoring/rewriting missing business APIs. Existing legacy debt outside touched commands is recorded, not swept.

Verification: existing owner authorization for test/build/lint/browser during this migration persists. Add rendered shared direct-row compatibility/keyboard/focus tests and row-command identity/confirmation/failure checks, run focused then full tests/production and scoped lint, inspect diagnostics and complete scoped diff. Update existing EN/AR owning in-app guide; synchronize books+skill for reusable guidance and regenerate/check packets. No commit/push/deploy/DB/EF migration. All8 recipe checks OK before packet use. Interactive visual acceptance remains distinct from tests/build.

## Reconciliation

Pending implementation and reachability results.

## Reachability gate and integration refinement

Confirmed graph: no external selector/import/dynamic/route/explicit compiler-root consumer exists for the isolated10-file partials/layout/modals subtree; only its three partials/index barrel exports enter. Retire subtree and those exports together. ListButtons has no incoming selector/import/export/dynamic/root edge; retire its TS/HTML leaf. BuilderModule/ExtrasModule have unused NgbTooltipModule imports, so remove those imports while preserving their other legacy code. Further explicit src scans found static demo/test-only Ngb edges in Cards user-list/Card2 and TilesWidget1/WidgetsModule. Preserve those demo classes/specs with native title hints; remove only the TilesWidget1 empty command popup (no commands existed). Chat-inner static tooltip metadata becomes the same native title. These bounded compiler-graph repairs do not reactivate demos or change business workflows.

Live error routes import KT components only to schedule delayed reinitialization after Return Home. The authenticated shell now uses PrimeNG, so remove those obsolete barrel imports/timers while preserving routes, theme subscriptions/background and body cleanup. Popper remains a direct dependency because legacy KT MenuComponent is still reached by HeaderComponent's spec; retaining it avoids sweeping unrelated legacy test/source trees in this stage. It is not claimed retired globally.

Root/test NgbModule registrations and angular.json Bootstrap JS can retire after the three live Settings menus migrate. Preserve vendored Bootstrap Sass under src/assets/sass/vendor/bootstrap and independent bootstrap-icons. Conditional package removal gate for bootstrap, @ng-bootstrap/ng-bootstrap and @types/bootstrap is now supported by zero remaining source Ngb references plus local Sass paths; use npm to update the lockfile consistently. Keep the single HttpClient/router/auth/provider-registry contracts. No new domain/API decision applies.

## Final reconciliation — implemented runtime slice

| Concern | Book / actual reference | Final comparison |
|---|---|---|
| Shared row owner | UI7/24; ActionButton exported row template + DataTable pipeline | Optional direct row input reuses the same94px minimum/25px shared trigger and body Menu. Existing DataTable omits it and keeps export/output/action predicates unchanged; no feature menu copies. |
| Settings actions | UI7/9/22; Fines/ESalik/EDarb existing rows/services, ConfirmationDialogService | Edit/Delete use typed real row identity and current membership. Fines no longer treats an ID as an index. Destructive confirmation is shared, with screen title, translated record-ID subtitle, real record label, pending guards and both failure channels through the existing global interceptor. Columns/forms/secrets/payloads/save endpoints stay unchanged. |
| Focus | UI27; popup id/aria-controls and shared overlay-focus | MessageLog retains the lasting trigger rather than a detached menu. Closing dialog may return focus from its own container without stealing a newly selected external control. Actual publisher keyboard/trigger and rendered direct-row checks pass. |
| Runtime/package edges | UI1/24; main/app.config/angular.json/test.ts and npm lock | Root/test NgbModule and Bootstrap script removed. npm removed bootstrap, ng-bootstrap and bootstrap types only; lock removes49 lines without unrelated version changes. npm ls confirms absence and retained bootstrap-icons/Popper. Built index loads only polyfills/main, with no global Bootstrap script. |
| Retired source | Source/route/selector/barrel/spec/root graph | Isolated10-file Ngb modal subtree plus3 barrel exports and2 ListButtons leaf files retired. No compiler-root broadening. Residual demo Ngb bindings become existing text as native titles; one empty demo menu retired without introducing actions. |
| Error navigation | UI1; actual3 error components | Same Router destinations, theme/background subscriptions and body lifecycle; obsolete delayed KT plugin reinitialization/imports removed. |
| User guide | Master7; Administration guide and existing UserGuide reader | Added EN/AR topics for /Settings/finesSettings, /Settings/eSalik and /Settings/eDarb; existing admin-system group includes these routes. Covers edit/delete confirmation, correct row, busy/failure and keyboard. No new reader or guide route. |
| Documentation | UI1/7/24/27 + skill revision rows | Owning rules and digest synchronized. All8 packets regenerated, semantically reconciled with unchanged phase/reference roles, final generator check all8 OK. |

Verification: focused17/17 passed (3.386s), whole suite **546/546 passed** (71.514s), production **exit0** (196.408s,UTC2026-10-22T19:57:30.661Z), initial **5.57MB** and estimated transfer636.90kB. Logs live in frontend .angular/interactive-vendor-retirement/{targeted-tests,full-suite,production}.log. Same six existing budget warning categories remain, no budget/diagnostic suppression. Full suite has zero Angular component diagnostics/runtime errors and the same150 reactive-disabled warning occurrences as prior runs. Scoped ESLint reports6 constructor-injection errors+2 existing lifecycle warnings; exact rule/severity/message comparison against HEAD for all6 affected files is equal (lint-baseline.log exit0), so no new lint finding is claimed. Whitespace check passes.

Root reviewed the complete current scoped source/config/package diff, new specs and deletion edges; one clean initial frontend worktree at1ac404cc. No backend/API/DTO/accounting/permission/schema/EF migration changes, no database commands, commit/push/deploy or vendor patches. Existing source/config/provider identities not mentioned above remain unchanged. Deferred legacy Settings save/load debt was not included in this row-command slice. Proposed frontend commit: refactor: retire Bootstrap interactive runtime and ng-bootstrap.

Team: bounded gpt-5.6-sol worker owned only3 Settings TS/HTML/spec groups after freeze; gpt-5.6-luna explorer supplied read-only legacy graph and Popper test-root evidence. Root confirmed and extended those results (including residual Cards/Widgets Ngb compiler references), integrated shared/root/package/focus/docs work, reviewed source and ran verification. Parallel work reduced graph/command time without overlapping writable ownership.

Browser verification was attempted but the browser-control kernel failed to initialize (missing kernel assets); no interactive visual/print pass is claimed and no application data was changed. Owner acceptance: restart the development server for angular.json/package changes, then verify Fines/Salik/Darb action menus, cancellation and selected record labels without confirming a real deletion; verify MessageLog dialog focus, Error Return Home and the usual RTL/dark/mobile journeys. Global vendored Bootstrap/Metronic Sass and utility markup remain for later style migration; independent icons/theme selector remain supported. Popper stays until legacy KT spec/source retirement. The _metronic folder is not globally deleted.

| Closure field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Result | Interactive runtime stage implemented, source reconciled,546 tests and production build pass |
| Remaining boundary | Interactive visual/print acceptance; existing budget/lint/disabled-control debt; global vendor Sass/utilities and legacy KT source/spec retirement |
