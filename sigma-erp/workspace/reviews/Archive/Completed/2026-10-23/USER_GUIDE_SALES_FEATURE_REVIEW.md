# Sales user guide pilot — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Sales only, following the user's "طبق على sales ونشوف الناتج" amendment |
| Contract | USER_GUIDE_MAINTENANCE_EVOLUTION_PLAN.md, Frozen Sales amendment |
| Repository | F:/My Work/Sigma/SiGmaAngularFrontEnd |
| Application entry | Sales → Sales Guide / دليل المبيعات; /UserGuide/sales |

## Result

Added a Sales sidebar guide entry and a reusable routed documentation reader. Its three workspace tabs contain nine numbered sales lifecycle stages, the four existing menu screens with purpose/action steps/constraints and links to their operational routes, and six common questions. All document content is bilingual (70 text pairs); UI chrome has 24 keys in each vocabulary. Content remains saved in source and selected tab/topic lives in the URL, supporting reload and shared links. The directory exposes only the implemented Sales guide. Invalid guide/topic links have translated empty feedback and a recovery link.

The screen uses the existing shared document shell, FeatureTitle, EditorTabs, SummaryCards, FormSection and StateMessage. Journey and topic rendering are separate reusable components; content and rendering are independent. Cards use shared compact sizing, while semantic text/grid styles use the feature namespace and Sigma tokens. Two columns become one below the reader's 800px container width. The title and tab strip remain outside the one internal content scroll; the page uses container fill. Print/save PDF delegates to ReportPrintService's preparation session and prints all three sections and all four topics independently of the current selection. Shared print flow releases all bounded hosts, and Bootstrap's existing print utility hides navigation/actions.

## Decisions and evidence

| Concern | Decision / evidence |
|---|---|
| Scope | Only Sales implemented; other inventory entries deferred by the latest explicit user instruction |
| Owning UI shape | Static read-only document workspace; shared bounded report/document shell (UI20/21), accessible workspace tabs (UI13/27), shared compact content sections; no grid, filters or editable record |
| Content | Current Sales source, independently verified by the content writer; see USER_GUIDE_SALES_CONTENT_EVIDENCE.md |
| Menu coverage | Exact four original identities/routes and their order: sideMenu.saless.fleet /Fleet; salesQuotation /SalesQuotation; saleAgreements /SalesAgreement; dueInstallments /DueInstallments |
| Advance/payment | An agreed advance is not paid until its live linked receipt is saved; collection cap and quotation-linked receipts follow existing source |
| Invoice/delivery/closure | Invoice and receipt have distinct meanings; delivery does not require full payment; closure requires delivery plus zero balance; returned balance reopens a closed agreement according to the existing receipt service |
| Cancellation | Documented Open-only cancellation and the direct-agreement receipt gate precisely, without extending it to all quotation receipts |
| Tax | Description follows configured tax policy and stored quotation rate; no fixed tax percentage or new calculation |
| Data/API contract | New local readonly GuideText/GuideStep/GuideTopic/GuideQuestion/GuideSection models only; no endpoint, DTO, persistence, business writer or HTTP request |
| Routes/auth | pages Routing → lazy USER_GUIDE_ROUTES → reader, under existing Layout/AuthGuard; no invented authorization. /UserGuide directory and /UserGuide/:sectionId, optional tab/topic query parameters |
| Catalog compatibility | Append one Sales child using the existing tree/catalog/search/pin machinery; retain all original paths and group/leaf identities. Existing Sales group shortcuts naturally include the newly added child |
| Translation | Authored document text has EN/AR pairs; shared UI controls use complete userGuide.* and general.actions keys. English fallback matches the existing project language contract |
| Loading/failures | Local static content has no remote loading/failure lifecycle; invalid guide/topic IDs use StateMessage; no artificial async state |
| Print | Shared ReportPage/ReportActions, ReportPrintService.createSession(DestroyRef), sigma-print-flow on route/page/panel/content/FormSection; inactive content hidden only in screen media |
| Existing changes | Dirty Sales business files, other vocabulary namespaces and earlier toolbar changes retained; only userGuide namespace and UserGuide toolbar exclusion added by this pilot |

No screenshot was supplied for this Sales guide. The earlier rental screenshot is outside this pilot. No material content or policy decision remains Missing/Conflicting/Uncertain. Visual/runtime acceptance remains pending, not inferred from source.

## Final reference conformance

| Concern | Owning block / actual reference | Final target comparison |
|---|---|---|
| Shell and aligned edges | UI1/3/20; Customers/StatementOfAccount/components/list/list.component.html; src/styles.scss report shell | GuideReader uses sigma-route-host, section[appReportPage].sigma-report-page--fill, sigma-report-panel, one shared sigma-editor-scroll; no viewport subtraction or local panel/card palette. Static prose is a documented report-data exception |
| Title/action | FeatureTitle public title/subtitle/icon; ReportActions ariaLabel; PrimaryActionButton public label/icon/disabled/pressed | Registered direct standalone imports; title inside panel, translated action and subtitle, matching inputs. Toolbar excludes UserGuide only |
| Tabs/accessibility | UI13/27; EditorTabsComponent<T> public tabs/activeTab/idPrefix/ariaLabel/appearance and activeTabChange | Three typed GuideTab entries; workspace appearance; user-guide-tab-* / panel-* matching identifiers; tabindex0 panels; shared keyboard/RTL navigation retained |
| Summary | UI24; SummaryCardsComponent public API and SummaryCard model | readonly computed SummaryCard[]; slim, row, minCardWidth140; no card internals or calculations copied |
| Content sections | FormSectionComponent public title/icon/density and projection | Compact sections, authored bilingual string headings, existing form-section-actions projection; no private selectors/overrides |
| Theme/RTL | UI24/25; Sigma tokens and shared component owners | Logical padding/margins, inherited theme, Bootstrap icons and existing badge/secondary-button owners. New CSS limited to prose and document column/visibility layout |
| Print | UI21; ReportPrintService, ReportPage/ReportActions, src/styles.scss shared print reset and Bootstrap display utility | Complete content retained in DOM; sigma-print-flow on all bounded layers including route host; d-print-none actions/navigation; no window.print/afterprint/body-class copy |

## Files changed

New frontend files under `src/app/modules/UserGuide/`:

- models/user-guide.model.ts
- pipes/guide-text.pipe.ts
- content/sales-guide.ts
- components/reader/guide-reader.component.ts, .html, .scss
- components/journey/guide-journey.component.ts, .html
- components/topic/guide-topic.component.ts, .html
- user-guide-content.scss
- user-guide.routes.ts

Existing frontend files extended:

- src/app/pages/routing.ts
- src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts
- src/app/_metronic/layout/components/toolbar/toolbar.component.ts
- src/app/modules/i18n/vocabs/en.ts
- src/app/modules/i18n/vocabs/ar.ts

Reviews: the Frozen plan and inventory record the earlier discovery and subsequent Sales scope amendment; the content evidence and this final review record the implementation. All reviews remain local/unversioned according to AGENTS.md.

## Verification and phase reconciliation

| Phase | Result |
|---|---|
| PLAN00 / Phase0 | Inventory and existing-owner discovery completed; latest Sales-only scope recorded. Recipe Check found Phase01 current, PLAN00/Phase00/02–06 stale; canonical books govern; owner regeneration and semantic review pending |
| Phase1 | Static content/model, route/auth and reader contracts Frozen before isolated content delegation |
| Phase2 | Grid/read transport not applicable; local document coverage and source-backed content reconciled |
| Phase3 | Read-only reader/content components implemented; no create/edit/save form |
| Phase4 | No business action implemented; documentation links open existing operational screens |
| Phase5 | Lazy route, standalone imports, existing authenticated shell, sidebar/catalog, locale and print integration reviewed |
| Phase6 | Complete in-scope source and changed-file diffs inspected; pre-existing changes distinguished and preserved; source checks passed |

Source checks: seven new TS files and three templates parsed without syntax errors; relative imports and named exports resolved; five modified integration/vocabulary files also parsed without syntax errors; new resources exist; 12 new source files have no merge markers or trailing whitespace. Literal content inspection confirmed 9 stages, 4 exact ordered menu routes, 6 FAQs and 70 nonempty bilingual pairs. Check-Translations -Block userGuide reports24 keys in each language, zero missing keys and zero case mismatches. Scoped tracked git diff --check passed. These are source-only checks, not a type check, build or application acceptance.

Backend changes, AutoMapper, domain calculations, ListVM/grid contracts and schema migrations: not applicable. No owner Add-Migration required. Authorization candidates: none introduced; guide navigation is read-only and keeps existing guards.

Owner acceptance: compile the frontend; open Sales → Sales Guide; read each tab, select one screen, follow its operational link, use Back and reload/deep-link restoration, and recover from invalid IDs. Check keyboard tabs/Home/End/arrows, focus, narrow/RTL/light/dark layouts, one content scrollbar, and full PDF output from each active tab/topic. Compare a demo sale against the documented receipt cap, linked advance, invoice/delivery and zero-balance closure. If compiler feedback names a missing runtime root, add that exact entry under the existing tsconfig.app.json files pattern; no preemptive roots were added.

One isolated content worker used the inherited parent model after contract freeze, owning only sales-guide.ts and its evidence artifact. Root owned presentation, shared wiring, vocabulary and final reconciliation; this allowed source-backed authoring and UI composition to proceed independently without overlapping edits. Integration succeeded.

No builds, tests, lint, browser/application verification, database commands, migrations, snapshots, commits, pushes, deployment, Graphify or Sigma MCP were run. Build/template type/runtime/visual/print acceptance remains pending for the owner. Suggested frontend commit by the owner: `feat(sales): add bilingual in-app sales guide`.
