# Complete vendor retirement — final reconciliation

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Started | 2026-10-22 |
| Reconciled | 2026-10-23, Africa/Cairo |
| Scope | Frontend Metronic / Bootstrap component, styling and direct-consumer retirement |
| Frozen contract | COMPLETE_VENDOR_RETIREMENT_MAINTENANCE_EVOLUTION_PLAN.md, including D1–D4 |
| Branch | upgrade/angular-21-validation |
| Closure level | Source retirement and authorized automated verification complete; owner visual/data/print acceptance pending |

## Delivered source

- Moved 191 live files before deleting the old tree: current Sigma shell/sidebar/appbar/footer into `src/app/layout`; theme service and retained tests into the same shared owner;165 domain enum/pipe files into `src/app/modules/shared/enums`; Excel/form helper into `src/app/modules/shared/utils/form-export.ts`. Updated all known external imports, root lazy route, tests and explicit compile roots. No re-export shim recreates `_metronic`.
- Deleted old `_metronic` components, KT source, old header/aside/toolbar/widgets/demo modules and unused `pages/builder`, their obsolete specs,288 retired Sass source files, Keenicon demo/font assets and the unused Webpack `assets/css/style.js` output. Removed empty retired directories too. Current shell and its tests were moved, not discarded.
- Replaced active vendor styling with independent Sigma base/status/native-control/utility modules. Updated exact template class tokens, conditional classes, TS presentation properties/icons/host classes, DOM selectors and associated SCSS/tests. Semantic HTML tags, ARIA roles and domain property names remain semantic. Native fields and secondary/danger actions use PrimeNG directives registered in their actual owners; StockReport consumers receive ButtonModule through `STOCK_REPORT_IMPORTS`.
- Converged the final eleven raw primary actions on existing `PrimaryActionButtonComponent`, with the original click/submit handlers, disabled/loading guards and native IDs. Deleted the temporary parallel primary paint rules. Forgot Password uses its existing loading stream with that shared owner. No new endpoint or write workflow.
- Routed Receipt fills its route container and follows available width instead of fixed historical header/sidebar offsets. Its embedded/dialog sizing and financial/form/allocation contracts remain with their existing owners. Removed the now-unused measured-header bridge and dimension tokens.
- Removed unused Bootstrap/ng-bootstrap/Popper, KT-only object-path/Prism/icon/animation packages and the orphan ApexCharts bridge and SweetAlert2 providers/packages. Retained independent Bootstrap Icons and Font Awesome because current screens use their glyphs. Kept `data-bs-theme` and existing stored theme preference keys as application compatibility contracts. Theme image/transition/event hooks are Sigma-owned.
- Preserved cover/center/no-repeat for theme-specific error-page backgrounds through the rendered native error-host scope. The scope releases on departure without old body helper classes or KT lifecycle hooks.
- Regenerated the RTL asset from native logical styles. Final source asset:30,049 bytes, deterministic LF and byte-identical to the production copy. No physical end-inset workaround or vendor Sass dependency remains.

The initial relocation touched437 TypeScript consumers/files; the first presentation pass touched430 files, followed by explicit metadata, primary-action, report-column/icon and conformance corrections. These are source-file counts, not a count of distinct screens. Exact local manifests are in frontend `.angular/vendor-retirement/{relocation,presentation-edits,presentation-map}.json`.

## Contract reconciliation and scoped diff review

| Concern / owning standard | Actual producer → consumer evidence | Result |
|---|---|---|
| Root integration, UI1/phase5 | `main.ts` → `app.config.ts` (one interceptor-equipped HttpClient/hash router) → `app.routes.ts` → `layout/layout.module.ts`, behind existing AuthGuard | Preserved; no feature/root client fork introduced |
| Domain/API identity |165 moved enum/pipe files and Excel/form helper compared token-wise to original Git source after normalizing line endings/import locations |166/166 identical bodies; no enum values/helper behavior changed |
| Shared controls and actions, UI6/7/13/14/18/24/27 | Existing FilterPanel/DataTable/EditorDialog/EditorTabs/EditableCollectionTable/FileField/Buttons/PrimaryActionButton owners remain; their field/event/paging contracts are retained | Matched by source and retained regressions; current primary actions have one paint/behavior owner |
| Legacy consumers | Exact actual-class audit against former compiled CSS, including external/inline templates, host/column classes and conditional bindings; extra TS literal scan finds only the ordinary English word “rounded” in guide prose | No active legacy presentation class consumer remains; semantic states such as active/disabled/required are application/publisher state hooks |
| Native control geometry | New real PrimeNG/native harness verifies editable value/submit, disabled retention,34px controls, full-width Select label track, both directions/themes | Automated coverage added; subjective visual acceptance remains pending |
| Shell and Receipt, UI1/25/29 | Native frame retains its280px navigation and responsive Drawer; actual linked RTL geometry regression; Receipt resized640→320px in both directions and checked embedded state | Internal bounds and source ownership matched; no old layout offset dependency |
| Palette/theme | Sigma semantic status tokens checked against approved light/dark values; native fields/cards/actions consume shared tokens | Independent of removed vendor variables; no diagnostic suppression |
| RTL, UI25 | `style.rtl.scss` → `scripts/build-rtl.mjs` → copied `assets/css/style.rtl.css`; logical end placement tested with actual linked asset | Deterministic generation/check and rendered geometry; actual screen/print acceptance pending |
| Direct dependency closure | Root route/provider trace, absent vendor trees, no old source/package/lock imports; independent icon font distinguished from the Bootstrap framework | Retired; no new compatibility barrel |
| Feature payloads and state | Scoped changes are imports/presentation/owner registration, theme hooks, routed Receipt layout and existing busy presentation. Backend/DTO/persistence contracts are outside the change | No backend migration required; existing business writers retained |

The root reviewed the scoped source through relocation/dependency manifests, semantic class/selector audits, moved domain-token comparisons, focused diffs for shared styles/actions/route/Receipt/auth/errors and complete whitespace/conflict checks. The bounded peer audits found rounding/responsive typography differences and missing/native modifier contracts; those were corrected, or proven original no-op markers were removed. Semantic-tag/ARIA selector conversion mistakes in tests were corrected rather than suppressing assertions. Final error-page shared imports were explicitly registered. The error-background test disposes the host as RouterOutlet does because TestBed retains its root container after fixture destruction. The final suite ran after all application-source edits and these test corrections finished.

Prior stages' pre-existing user/agent work remains integrated.24 obsolete component spec files (25 cases) retired with their unused subjects; four live spec files were moved. Seven new native-presentation/Receipt/error-background cases explain547→522→529 total cases. No active feature test was intentionally dropped to obtain a green result.

## In-app guide gate

Updated bilingual common presentation guidance in `modules/UserGuide/content/shared-screen-guidance.ts`, consumed by `GuideReaderComponent.sharedScreenGuidance` in the existing reader. Updated Receipt's existing topic in `record-list-topics.ts`, reused by `INVOICE_GUIDE` and the focused Receipts/Payments voucher group. Routes remain `UserGuide/:sectionId`; existing sidebar guide entries and reader registration remain. The common guidance describes fields/actions/keyboard/direction/theme, and the Receipt note describes responsive route versus embedded behavior without inventing accounting rules.

## Documentation and packets

Owning UI1/24/25 blocks and the skill rule plus revision-history row were synchronized. PROJECT_MAP's active root/layout/shared paths now match the standalone configuration and moved owners. The phase5 template's retired `.app-content` wording now refers to the current native shell/route hierarchy and single internal scroll ownership, matching UI1. All eight generated packets were regenerated through the generator and checked. Semantic review: current root/provider references remain `main.ts/app.config.ts/app.routes.ts`; layout references now name the native owner; primary-role ownership and logical RTL source agree with final code; no backend/action-policy rule was introduced by derivative packets.

## Verification evidence

All logs below are local frontend `.angular/vendor-retirement/` evidence. Build/test/browser authorization persists from the owner's explicit development authorization.

| Check | Evidence / result |
|---|---|
| Production build | `final-build.log`: succeeded;87.571s; UTC2026-10-22T21:26:43.344Z; initial3.80MB, styles350.26KB, transfer532.88KB; no errors |
| Full regression | `verified-suite.log`:529/529 SUCCESS;51.075s total; final source including primary owners/error background/Receipt/native controls |
| Focused actual geometry | `final-targeted.log`:15/15; native controls/Select, linked RTL shell and Receipt resize/embedded |
| Scoped lint | `lint.log`, `lint-final.log`, `lint-closure.log`: passed for new/shared shell/theme/native harness, changed shared/auth templates and the final error-background test |
| Contract proof | `domain-contract-proof.json`:166 compared,0 mismatches |
| Class/dependency closure | `remaining-classes.json`:[]; dynamic scan has only guide-prose false positive; source and lock have no retired runtime packages |
| RTL reproducibility | `rtl:check` pass; source30,049 bytes; `closure-proof.json`: built copy matches exactly, no CR bytes |
| Recipe drift | All8 packets current after canonical/template regeneration |
| Whitespace/conflicts | Scoped Git diff check passed; no source conflict markers; retired paths/direct packages/lock entries all absent in `closure-proof.json` |
| Browser/visual/print | Pending: current CUA inventory has no application browser; explicit IAB creation returns `Browser is not available: iab`. No native/other-browser bypass or visual-pass claim |

The six existing budget-warning categories remain: initial bundle and Auth, DataTable, FilterPanel, EditableCollectionTable, Receipt component styles. No warning suppression or budget increase was used. The initial bundle fell from5.44MB before complete style retirement to3.80MB; these warnings are not compilation failures. Historical intermediate failing logs are superseded only by the named final verification runs.

## Owner acceptance and remaining limits

No unresolved source/API/business contract blocks retirement. Actual end-to-end data/visual/print acceptance is still required for Company, Individual, PurchaseRequest, PurchaseOrder, Receipt (with navigation shown/hidden and embedded) and Settings, in Arabic/English, light/dark, narrow/intermediate/desktop widths and short heights. Check field/select text and search/clear icons, input/quantity editing, row menus and modal focus, Save/Cancel/discard/navigation, fixed grid paginator/internal scroll and a real report/receipt print preview. Previously tested screens need this final visual smoke after the shared theme change.

This closes vendor component/dependency retirement, not an assertion that every legacy business screen has undergone a full domain/financial refactor or that all historical Angular compatibility code is eliminated. Build/test and source evidence do not establish production data or subjective visual correctness. No database/migration, deployment, commit/push, destructive business action or external message was performed.
