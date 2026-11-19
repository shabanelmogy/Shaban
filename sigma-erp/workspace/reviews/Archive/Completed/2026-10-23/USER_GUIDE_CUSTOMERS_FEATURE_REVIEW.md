# Customers guide review and integration — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Requested outcome | Review Customers functions and add its in-app instructions menu |
| Frozen handoff | USER_GUIDE_CUSTOMERS_CONTRACT_FREEZE.md |
| Guide | `/UserGuide/customers` — Customers > Customers Guide / العملاء > دليل العملاء |
| Coverage | Eight active screens, seven workflow stages, eight FAQs, 100 nonempty EN/AR text pairs |
| Evidence | USER_GUIDE_CUSTOMERS_PROFILE_CONTENT_EVIDENCE.md; USER_GUIDE_CUSTOMERS_REPORT_CONTENT_EVIDENCE.md; USER_GUIDE_CUSTOMERS_SOURCE_CHECK.json |

## Outcome and scope

The existing UserGuide reader now registers Customers alongside Sales. Customers has one new sidebar entry and authored content for its eight operational destinations, in original menu order. Topics explain prerequisites, filters, record creation/view/edit, child collections, visible actions, validation and financial/report limitations where applicable. The workflow connects registration, document currency, statements, balance comparison, debt ageing, collection notes and activity monitoring. FAQs distinguish account reports, payment promises, deposit/cheque information and output scope.

This is source review for user documentation, not a full business refactor or a certification of customer accounting. No Customers business source was modified. The existing Sales guide, shared reader presentation, route definitions, shell, translations outside the one added menu label, and unrelated dirty work were preserved.

## Files changed by this request

All application files belong to Git root `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- New `src/app/modules/UserGuide/content/customers-guide.ts`: GuideSection, lifecycle/FAQs and topic composition.
- New `src/app/modules/UserGuide/content/customer-profile-topics.ts`: Individual/Company topics.
- New `src/app/modules/UserGuide/content/customer-report-topics.ts`: six report topics.
- `src/app/modules/UserGuide/components/reader/guide-reader.component.ts`: import and register CUSTOMERS_GUIDE; retain SALES_GUIDE.
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`: one guide child beneath Customers.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: one matching `userGuide.customersMenuEntry` key each.

Existing UserGuide files are still untracked from the Sales pilot; the sidebar/vocab files already had unrelated changes. Review scope isolates the additive Customers hunks rather than attributing previous work to this request. Application commits were not created. Review artifacts remain under `F:/My Work/Sigma/reviews` outside the application repositories.

## Final coverage and source conformance

| Topic | Operational route | Evidence / user-facing coverage |
|---|---|---|
| Individuals | /IndividualPartner | List/actions; three Create/View/Edit steps; documents/cards/billing; required identity/contact/birth fields; unique mobile/email; date/default-card rules; dirty close/uploads |
| Companies | /CompanyPartner | List/actions; five editor steps; contacts, billing/cards, documents, drivers; required name/branch/email; name/VAT uniqueness; child draft and close behavior |
| Statement of Account | /StatementOfAccount | Customer and dates; Ledger/Outstanding; inactive customer inclusion; supporting sections; full loaded-report print versus active-tab Excel |
| Balances Summary | /BalancesSummary | Current-month period; customer/business/balance filters; numeric range validation; server pages/total; all-page Excel; row statement dialog |
| Receivable Age Analysis | /ReceivableAgeAnalysis | Today reference date; lookups; standard/custom positive increasing integer boundaries; complete matching data request; local presentation pages; print/Excel |
| Alerts | /Alerts | Document expiry statuses, optional customer/text/status filters, cards, refresh and filtered Excel; no document mutation |
| Debt Collection | /DebtCollection | Today reference date; ageing/credit/follow-up filters; returned-row counters; customer follow-up history/add note/promise/next date; blacklist reason; 100-row scope |
| Follow-up Report | /followUpReport | Current-month dates/user/customer filters; details and summary; user drill-down; distinct customer and promise/upcoming indicators; active-tab Excel |

AST comparison matches all eight original menu identities and routes in order. Each route exists in `src/app/pages/routing.ts` and imports its Customers owner. Child modes/dialogs stay under parent topics. The new menu destination reuses existing `/UserGuide/:sectionId`; stable `tab`/`topic` queries continue to work through the existing reader. No new permission/authorization mechanism is claimed.

| Concern / governing blocks | Target consumer and actual producer | Final comparison |
|---|---|---|
| Typed guide content — Master7/UI23 | CUSTOMERS_GUIDE -> GuideSection; topic constants -> GuideTopic; GuideTextPipe | Same existing fields; 100 authored EN/AR pairs; no HTML injection or content-specific renderer |
| Reader lifecycle — Master7/UI1 | GuideReaderComponent.guides/guide/title/topics/tabs/summary | Registry is [SALES_GUIDE, CUSTOMERS_GUIDE]; id customers; counts derive from content; existing no-guide/no-topic recovery retained |
| Shell/header/scroll — UI1/3/20 | Existing GuideReader template -> ReportPage, FeatureTitle, EditorTabs and sigma-editor-scroll | No HTML/SCSS changes: fill report panel, fixed title/tabs, single internal content scroll retained |
| Topics/cards — UI24/Master5 | GuideTopic -> FormSection; journey -> GuideJourney; summary -> SummaryCards | Existing compact sections and slim/row/min140 cards consume authored data; no duplicated shared owners or palettes |
| Print — UI21 | GuideReaderComponent.print -> ReportPrintService session; all topics/panels sigma-print-flow | Existing complete-guide print lifecycle and bounds release retained; topic selection hides only in screen media |
| Menu/language — UI23 | SIDEBAR_MENU_ITEMS Customers children -> reader; en/ar userGuide block | Exactly one new bi-book/submenu-tone-blue child; 25 matching chrome keys, no missing/case-only differences |

RTL, theme, keyboard, responsive behavior and printing inherit the unchanged approved reader; this is source conformance only, with visual/runtime acceptance pending. No repeated implementation qualified for another shared extraction because only typed content and registration were added.

## Review findings and boundaries

1. Existing Debt Collection limits a search to 100 rows. `DebtCollectionReportService.getReport` requests PageNumber1/PageSize100; `CustomerService.GetDebtCollectionAsync` clamps size to100 and applies Skip/Take, returning no total metadata. Counters/print/Excel operate on the returned array. The guide states this limit; this is the existing recorded F2/O1 in DEBT_COLLECTION_DISCOVERY_CONTRACT_FREEZE, not a new resolved backend defect.
2. `Customers/OpeningBalanceCustomer` is unregistered legacy source. The reachable customer opening-balance editor is owned by Accounts/openingBalances. `Customers/PDCReceivable` is obsolete: `/PDCReceivable` loads Banking/ChequesReceivables. No guide link was added to either obsolete implementation and no files were removed.
3. Payment promise saves a follow-up, not a receipt. `FollowUpReportComponent.saveFollowUp` calls the FollowUp writer, and `FollowUpService.AddAsync` saves only FollowUp. Profile credit/billing values and report output actions are not represented as collection, posting or refund workflows.
4. Report scopes differ. Aging sends IncludeAllRows=true and backend returns ordered.ToList; Balances Excel fetches successive matching pages; Statement and standalone Follow-up Excel export the active section; Debt Collection remains limited. User prose reflects each distinction.
5. Generated packet drift remains: Phase06 current; PLAN00 and Phase00–05 stale. Canonical blocks governed this implementation. Owner regeneration and semantic review remain pending; generated files were not edited.

No Missing/Conflicting guide contract remains. These inherited business limitations are disclosed, not silently fixed within a documentation request. Runtime and backend-data correctness are not certified by the guide.

## Phases and decisions

Phases0/1 applied for bounded source discovery, owner/route classification and content freeze. Phase5 applied for registry/menu/language integration; Phase6 applied for source reconciliation. Phases2/3/4 business implementation skipped: no list/editor/domain-action changes authorized or needed. No new Grid/ListVM, Add/Update/Detail, API, provider/interceptor, mapping, entity, calculation or financial policy contract. Backend files were inspected for evidence only. No Add-Migration required.

Two inherited guide content owners were kept rather than creating a new viewer or website. Root integration corrected Arabic date-order wording, clarified inactive customer inclusion versus journal rows, removed API/internal implementation terms from user prose, and added the nested Add follow-up task. The documentation explains actual visible actions without claiming secured permissions or guaranteed deletion.

## Verification performed and pending

Performed: seven touched TypeScript files parsed without syntax diagnostics; relative imports resolved to existing source; exact8/8 ordered menu/topic/route coverage; one Customers guide child; Sales registry preserved; all100 authored pairs nonempty; no merge markers. `Check-Translations.ps1 -Block userGuide`: en25/ar25, missing0, case differences0. Tracked scoped `git diff --check` passed; new content also checked for whitespace. Full authored content and Customers integration hunks reviewed; existing unrelated vocabulary changes retained. `git status --short -- src/app/modules/Customers` remains empty.

Pending for owner:

1. Compile frontend and open Customers > Customers Guide; verify directory shows Sales and Customers.
2. Read journey, all eight topics and FAQs; follow every Open screen link. Restore `/UserGuide/customers?tab=screens&topic=sideMenu.companies` and another report topic link.
3. Switch EN/AR; verify RTL, dark/light, narrow view, keyboard tabs/links and one internal content scroll.
4. Print/save PDF with one topic selected; check all guide sections/topics appear and the application shell/actions are hidden.
5. Exercise representative instructions against actual customer data, including reversed dates, custom ageing boundaries, inactive customers and follow-up promise; compare export scopes, especially a Debt Collection match set exceeding100.

Builds, tests, lint, browser/runtime/application verification, database commands, migrations/snapshots, commits/push, deployment, Graphify and Sigma MCP were not run.

Suggested frontend commit: `feat(customers): add bilingual in-app user guide`. No backend commit or migration suggestion applies.

## Agent utilization

Two bounded `luna` content streams used selectable `gpt-5.6-luna` after freeze: customer_profile_guide owned profile topics/evidence; customer_report_guide owned report topics/evidence. Independent screen families justified parallel source reading and reduced wall-clock time. Neither modified business or shared files. Root owned freeze, main lifecycle/FAQs, registration/sidebar/vocabs, source review, corrections and final reconciliation; no overlapping writes occurred.

## Compiler-feedback follow-up — 2026-10-08

The owner supplied Angular webpack diagnostics: `customer-report-topics.ts` missing from TypeScript compilation, followed by TS2307 at `customers-guide.ts`'s import. The file exists at the imported path and exports `CUSTOMER_REPORT_TOPICS`. Under UI29 G17 and AGENTS' explicit-files rule, this feedback now authorizes adding exactly that reported runtime file to `tsconfig.app.json.files`. No broad feature include or spec file was added; existing entries/includes/excludes are preserved. This is a Phase5/6 compilation-wiring fix within the frozen guide scope; content, routes, backend, financial rules and guide coverage remain unchanged.

Source verification: parse config with TypeScript's JSONC reader; confirm the entry appears once, exists, is not a spec, and the target's named export/import path matches; inspect complete scoped tsconfig diff and whitespace. Owner must rerun compilation; no build/tests/lint/runtime commands were run. No migration. No agents used for this small sequential fix. Suggested commit: `fix(user-guide): include customer report topics in app compilation`.

Recipe drift check rerun for this follow-up: Phase06 current; PLAN00 and Phase00–05 stale. Canonical UI29 governed the fix; owner regeneration/semantic review remains pending.

## Repeated diagnostics — existing dev-server session

The owner supplied the same diagnostics again. Read-only checks confirm `angular.json` build uses `tsconfig.app.json`; no configuration override selects another config. TypeScript `readConfigFile` / `parseJsonConfigFileContent` reports no config errors and includes the reported file once. `resolveModuleName('./customer-report-topics', customers-guide.ts, options, ts.sys)` resolves the exact existing `.ts` file. This is configuration/module-resolution evidence, not a compilation/type-check pass.

The still-running npm start / `ng serve -o` session was started at 11:24 on 2026-10-08 (Angular PID14296), before the report-topic file was created at12:59. A stale in-process watch/file-resolution state is the likely explanation; a fresh compilation is required to confirm. No speculative rename, duplicate content, broad include, cache deletion or further config mutation was introduced. Owner recovery: stop this application's development-server terminal with Ctrl+C and run `npm start` again from `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Refreshing the browser alone does not create a fresh compiler session. The agent did not stop/restart the server or invoke a build under the standing prohibited-build/runtime boundary.

Follow-up distinct screen icons — 2026-10-08: implemented all eight content-owned Bootstrap icons from the amended USER_GUIDE_CUSTOMERS_CONTRACT_FREEZE. Both reader topic links and topic FormSection titles consume the existing icon property, removing the repeated fallback window glyph for Customers. Changed customer-profile-topics.ts (Individual person, Company building) and customer-report-topics.ts (Statement journal-text, Balances bar-chart, Aging hourglass-split, Alerts bell, Debt Collection cash-coin, Follow-up calendar-check). Guide content itself is the deliverable; existing bilingual wording/routes/topic identity/reader/print/theme owners are preserved. Complete two-file scoped Git diff reviewed, including preserving prior compact-report notes. Source TS parsing, eight-topic icon coverage, unique glyph count, installed CSS existence and scoped diff whitespace checks passed. Phase1 scoped visual contract amended, Phase6 source reconciliation complete; no business phases/backend/API/schema/calculation/migration changes. Owner build and visual/narrow/RTL/theme/print acceptance pending. No subagents for this bounded content edit; prohibited commands not run. Prior generated packet drift remains pending regeneration/semantic review. Suggested frontend commit: style(user-guide): distinguish customer screen icons.
