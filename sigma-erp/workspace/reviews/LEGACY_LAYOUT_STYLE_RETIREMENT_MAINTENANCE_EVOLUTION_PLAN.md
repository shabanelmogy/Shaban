| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-22 |
| Authorization | Owner says continue vendor retirement after interactive runtime closure |

# Legacy layout stylesheet retirement

## Manifest and frozen target

Frontend shared stylesheet/runtime integration scope, not a whole-feature business refactor. Starting frontend HEAD1ac404cc has the prior interactive-retirement changes uncommitted; preserve them. Current PrimeNG LayoutComponent owns flex viewport/chrome/print using sigma-shell classes, while styles.scss -> assets/sass/style.scss still emits core/layout/base/layout and layout/layout geometry, including obsolete header/sidebar/toolbar/aside/sticky/minimize rules. Root layout variables remain used by legacy page-height/Receipt compatibility. Footer still derives container class from the old LayoutService. RTL dynamically loads a committed1499258-byte theme asset; rtl.config.js uses an afterEmit hook that deletes its output directory. No backend/API/DTO/permission/persistence/migration change.

Owning shape is cross-cutting authenticated shell, UI1/24/25/27/29, Master4/5/7/8. Actual references: LayoutComponent/ShellHeader/SidebarMenu native shared shell, FooterComponent, root styles/Sass entry and TranslationService RTL-link API. Applicable packets PLAN00/5/6 after all8 Check OK. No screenshots. No feature controls/actions/fields or routes may change.

| Concern | Decision | Final target / evidence |
|---|---|---|
| Global shell geometry | Remove compiled imports | Replace the two legacy layout aggregators with the minimal existing root variables/reboot/container/print compatibility modules. Drop old header/sidebar/toolbar/aside/wrapper/main/page-loader geometry only after exact selector/route graph audit. Shared Sigma shell keeps its sizing and existing IDs for print/legacy consumers. |
| Basic document/body typography | Keep | Existing reboot owns13px desktop/12px tablet/mobile and body type/reset, required by existing features. Do not silently change rem sizing, backgrounds, link or canvas behavior. |
| Legacy variables/component CSS | Keep | Retain base+custom root variables and repository Bootstrap/component/utilities Sass until screen adoption. Do not claim full Bootstrap CSS removal. |
| Active shell hooks | Refactor | Remove app-content/app-container class coupling from active shell and old ID/flex global overrides only when same behavior is owned explicitly by shell. Preserve fixed chrome, bounded route, legacy-page scroll fallback, dark/RTL/print and measured header variable bridge. |
| Footer | Refactor | Existing Footer renders shared native markup only; stop consulting obsolete layout container config. No duplicate component, changed copy/date/links or per-screen opt-in. |
| RTL producer | Replace build internals | Use deterministic Node Sass+rtlcss script to write only assets/css/style.rtl.css, preserve CSS license comments, no deleting directories/maps/other assets. Retain npm run rtl and TranslationService dynamic href/language/session/direction API. Regenerate RTL from same updated style.scss source and validate parsed CSS except intentional layout retirement, not a hand-edited asset. |
| Verification | Extend | Capture baseline Sass semantic AST before edit; compare emitted CSS against corrected source, checking removed rules belong only to audited layout modules and retained declarations remain equivalent. Rendered shell geometry in directions/themes/mobile/print-equivalent rules, footer and translation tests, full regression and production. No budget suppression. |

Alternative rejected: remove all Bootstrap/Metronic CSS at once while feature utilities and variables still live. Alternative rejected: scope/reload the whole old layout around current shell, leaving duplicate ownership. Selected minimal compatibility imports retire unused compiled chrome while preserving actual consumers. Read-only graph audit may refine safe removed modules; uncertainty keeps that module in compatibility imports rather than guessing.

Root owns plan/freeze, shared source/Sass/RTL producer and generated asset, tests/integration, canonical+skill+in-app guide and final review. One read-only explorer may audit omitted-layout consumers and exact global overrides; it edits nothing. Contracts frozen above before delegation, no shared writable ownership. Existing migration verification authorization persists. Do not commit/push/deploy/DB/migrate. Browser acceptance remains separate if browser tool unavailable.

## Reconciliation

Pending source/semantic/runtime verification.

## Integration refinements and evidence before final checks

Direct source correction to initial discovery: Footer does not inject LayoutService; its obsolete compatibility surface is the optional appFooterContainerCSSClass input. Keep that input, supplied class/links/copy/current year intact, replace only app-container/visually-hidden dependency with native sigma-footer-container and sigma-visually-hidden. No need to remove a public input.

The retired aggregators emitted root dimensions (including sidebar/aside/header/toolbar/footer) outside the retained root modules. Preserve all configured root values in sigma-layout-compat through the existing Sass variable module, without geometry selectors; keep the existing desktop31px toolbar override for legacy calculations and measured actual header bridge. Shared routes retain their no-gutter behavior in LayoutComponent rather than the obsolete app-content selector. Print release selectors now include sigma-shell__content while preserving existing legacy IDs/print contracts.

Read-only explorer confirmed active authenticated/auth/error routing does not use old chrome geometry or layout page-loader; core component loader stays. Root confirmed actual Receipt and source roots independently and retained dimensions conservatively beyond the explorer's initial recommendation. Existing Bootstrap/Metronic component/utility Sass remains. Static legacy component sources/specs do not authorize reactivating the old aggregators.

RTL producer dependency decision: direct source/config search finds Webpack/loader/extract/del dependencies belong only to rtl.config.js. Replace it with scripts/build-rtl.mjs and explicit pinned Sass1.97.3/rtlcss3.5.0. Retire7 obsolete direct dev dependencies via npm;107 packages pruned, no directory/file deletion helper. TranslationService dynamic link is unchanged. Existing RTL asset generated to1337193 bytes (previous1499258), and rtl:check verifies deterministic exact output. This is a build-producer change in the frozen RTL workstream, not a framework/package version upgrade.

Semantic evidence: compile the baseline before edit with a Sass source map. Expanded theme CSS1618043 ->1460477 bytes. Parsed comparison reports0 added declaration signatures and1251 removed unique signatures, mapping to retired layout source modules or their scoped menu/button/scroll mixins. Every retained non-dimension declaration remains an ordered subsequence:19900 entries; configured root dimension values match the full signature comparison exactly. Evidence: .angular/layout-style-retirement/{theme-before.css,theme-before.map.json,theme-after.css,css-semantic-diff.log,css-retained-order.log}. No vendor component/utility palette or typography declaration was changed.

Focused23/23 tests pass, including loaded generated RTL CSS in LTR/RTL and light/dark,280px sidebar geometry, zero shell route padding and stable root font sizing. Package source whitespace check passes. Full tests/production still pending below.

### RTL baseline reconciliation refinement

Comparing the committed RTL asset to the pre-change current Sass source revealed pre-existing serialization/source drift: RGB fractional versus hex output, encoded SVG casing and selector-list order;11 legacy table-token colors differ by at most1 per RGB channel from the currently compiled LTR source. Regeneration aligns RTL to that existing source rather than inventing a palette. The old tree align-items:start/flex-start difference is equivalent for its flex container. An old header transparent override and two old header/wrapper geometry patches retire with those inactive selectors.

One source-supported correction must survive: .end-0 right:unset!important clears the still-loaded LTR right inset after the RTL utility sets left:0. Promote that previously generated-only rule to sigma-rtl-compat under rtlcss ignore directives; style.rtl.scss imports the same style.scss theme plus this explicit direction-only source. Script and tests now use this wrapper. Add a rendered fixed-width RTL utility placement assertion; no hand patch of generated CSS. Current source color/typography ownership is unchanged, and this refinement protects existing directional behavior. Re-run final checks after regenerating the asset.

Rendered RTL placement follow-up: the focused assertion reproduced the remaining issue and CSSOM evidence showed the RTL reset followed by a later global styles.css end-0 right:0!important rule. Qualify the retained reset with html[dir=rtl] so it wins independently of that load order; this is a bounded direction correction, not a global utility rewrite. Evidence: rtl-inset-debug.log (old reset reproduces180px wrong placement), followed by verified test/build logs below. Keep source and digest aligned with this exact selector.

## Final source conformance

| Concern | Owning rule / compared source | Match or bounded deviation |
|---|---|---|
| Authenticated frame | UI1; actual LayoutComponent/ShellHeader/SidebarMenu and prior shell contract | Same280px desktop menu,992px mode switch, fixed chrome, actual header bridge, theme/session/navigation guards and route IDs. Native sigma-shell__content/route replace app-content/app-container; component owns ancestor overflow, padding and bounded-route gutter. |
| Legacy stylesheet boundary | UI1/24; baseline Sass map and retained declaration signatures | Both full layout aggregators omitted. Reboot typography/reset, root theme variables, container/print compatibility and vendor component/utilities remain. sigma-layout-compat retains existing configured dimension values; desktop toolbar31px override remains. No business-feature markup/control change. |
| RTL | UI25; TranslationService href/direction, generated asset and rendered CSSOM | Same dynamic language-link API. Deterministic direct Sass/rtlcss generation through shared theme+direction wrapper, existing end-0 reset promoted to source and direction-qualified against later global utility styles. Scoped LF Git attribute prevents checkout drift. License comment preserved; no vendor patch or manual asset edit. |
| Print and footer | UI1/27; shared Footer and existing report print selectors | IDs/print-body flags retained; print release includes native content selector and resets explicit component overflow. Footer optional input/copy/year/support links remain, with Sigma accessible-hidden text and native wrapper. Direct print/subjective acceptance remains pending. |
| User guidance | Master7; existing SHARED_SCREEN_GUIDANCE/UserGuide readers | Existing EN/AR shared guidance describes fixed title/filter/footer and internal data scrolling in either direction; no new guide route/reader. |
| Documentation packets | Master8; UI1/25 plus skill rules/revision row | Synchronized owning books/digest and all8 generated packets. Reviewed semantics retain legacy compatibility limits, original phase/reference roles and no global Bootstrap-CSS completion claim. |

Application changes in this stage are limited to shared shell/footer HTML/SCSS/spec, global shell compatibility styles, theme entries/compat modules/generated RTL asset, scoped Git attribute, RTL script/package manifest+lock and existing shared guide text. Preserve all prior runtime-retirement edits; backend/API/form/action/provider/router/source payloads are unchanged. No database/EF migration, commit/push/deploy, warning suppression or budget change. Suggested frontend commit: refactor: retire legacy shell CSS and modernize RTL generation.

One gpt-5.6-luna read-only explorer audited independent selector/route consumers after freeze; root independently confirmed live references, retained conservative variable compatibility, and owned all source edits, CSS semantic analysis, integration and checks. No overlapping writers. This avoided repeating broad source scans while root worked on the RTL producer.

## Verified handoff before the owner's broader continuation

Final whole suite **547/547 passed**,71.459s; production **exit0**,151.930s,UTC2026-10-22T20:29:50.711Z, initial5.44MB/estimated transfer631.70kB. Evidence: .angular/layout-style-retirement/full-suite-verified.log and production-verified.log. Same six size-budget warning categories; zero Angular component diagnostics/runtime errors and same150 reactive-disabled warnings. Scoped lint exit0 (lint-verified.log), semantic retained-order/source comparison and deterministic RTL proof pass. Final generated RTL1337245 bytes matches the built asset byte-for-byte, LF-only, with qualified direction reset and copyright preserved. Final diff whitespace and all8 packet checks pass.

| Handoff field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Scope result | Legacy shell geometry removed from compiled theme; RTL producer corrected; current shared frame verified |
| Remaining at this handoff | Interactive visual/print acceptance, old feature component/utility styles and inactive Metronic source tree |

The owner now explicitly expands continuation to the end, including deleting all old components. This historical handoff stays scoped; the later comprehensive vendor-retirement contract will own dependency relocation, remaining component/style migration and removal gates. Browser control remains unavailable from the prior initialization failure; no visual/print pass is claimed. No commit/push/deploy/database/migration action performed.
