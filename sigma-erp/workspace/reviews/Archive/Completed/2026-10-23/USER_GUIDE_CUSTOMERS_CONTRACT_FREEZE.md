# Customers in-app user guide — 2026-10-08

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Request | Review `src/app/modules/Customers` and create its instructions menu |
| Authority | AGENTS.md; sigma-screen-refactor; Master4/5/7; UI20/21/23/29/30 |
| Packet drift | Check already executed for this request: Phase06 current; PLAN00 and Phase00–05 stale. Canonical blocks govern; owner regeneration and semantic review pending |
| Scope amendment | User extends the Sales pilot to Customers. Other modules remain deferred; original frozen Sales scope is retained as historical evidence |

## Manifest and impact decisions

Tier M, additive authored documentation using the existing approved `modules/UserGuide` owner. Extend its registry and the Customers sidebar; create bilingual content. Keep business screens, backend APIs, calculations, permissions, and all existing Sales content. No new viewer, shell, styles, route definition, model shape, data storage, or database changes. Source inspection supports explanation; it does not certify production behavior.

The eight active Customers links are the coverage contract, in their existing order:

| Topic identity | Operational route | Content owner |
|---|---|---|
| sideMenu.individuals | /IndividualPartner | customer-profile-topics.ts |
| sideMenu.companies | /CompanyPartner | customer-profile-topics.ts |
| sideMenu.customerstatementOfAccount | /StatementOfAccount | customer-report-topics.ts |
| sideMenu.balancesSummary | /BalancesSummary | customer-report-topics.ts |
| sideMenu.receivableAgeAnalysis | /ReceivableAgeAnalysis | customer-report-topics.ts |
| sideMenu.alerts | /Alerts | customer-report-topics.ts |
| sideMenu.debtCollection | /DebtCollection | customer-report-topics.ts |
| sideMenu.followUpReport | /followUpReport | customer-report-topics.ts |

Current `src/app/pages/routing.ts` imports these Customers modules. `Customers/OpeningBalanceCustomer` is an unregistered legacy implementation: the reachable opening balance editor is owned by Accounts/openingBalances. `Customers/PDCReceivable` is an obsolete implementation: `/PDCReceivable` loads Banking/ChequesReceivables and is under Banking. Inspect/classify them in review evidence, but do not expose legacy routes or duplicate their owning module guides. The debt-collection follow-up dialog stays within its parent topic; it is distinct from the `/followUpReport` route.

## Frozen implementation contract

- `CUSTOMER_PROFILE_TOPICS: ReadonlyArray<GuideTopic>`: Individual and Company topics only. `CUSTOMER_REPORT_TOPICS: ReadonlyArray<GuideTopic>`: six remaining topics in sidebar order. Existing `GuideText`/`GuideTopic` types; every authored string has nonempty English and Arabic. Content covers purpose, prerequisites, tasks, visible actions, actual state/financial constraints. No implementation internals in user prose.
- Root owns `content/customers-guide.ts`, exports `CUSTOMERS_GUIDE: GuideSection`, id `customers`, titleKey `sideMenu.customers`, title Customers/العملاء. It composes the two topic arrays, a source-backed lifecycle and FAQs.
- Root registers `[SALES_GUIDE, CUSTOMERS_GUIDE]` in the existing reader and appends exactly one Customers child: title `userGuide.customersMenuEntry`, icon `bi bi-book`, existing `submenu-tone-blue`, link `/UserGuide/customers`. Add its label in en.ts/ar.ts only. All original links/identities remain.
- Keep existing `/UserGuide/:sectionId`, `tab` and `topic` queries, parent AuthGuard, EN/AR selection, journey/screens/questions tabs and full-guide print. No new API/authorization claim; backend source may be read only to substantiate money/state explanations.
- Evidence maps claims to actual screen/service symbols; uncertain or missing behavior is described conservatively or recorded as a finding, never invented. Source review does not authorize fixing unrelated business defects.

## Reference conformance before implementation

| Concern | Canonical owner | Actual reference / target comparison |
|---|---|---|
| Guide composition | Master7 completion gate | Existing GuideSection/GuideTopic and SALES_GUIDE; new content has identical field shapes and authored bilingual titles |
| Document shell/title/scroll | UI20; UI1/3 | Existing GuideReader template: appReportPage fill panel, FeatureTitle, fixed EditorTabs, one sigma-editor-scroll; no presentation changes |
| Topic/journey/cards | UI24; Master5/7 | GuideTopic FormSection, GuideJourney, readonly SummaryCard[] slim/row/min140; existing renderer consumes new data only |
| Print | UI21 | Existing ReportPrintService session and sigma-print-flow; all tabs/topics remain rendered for print; no new print owner |
| Sidebar and translations | UI1/23/26 | SIDEBAR_MENU_ITEMS existing Customers group; en/ar userGuide block; add one label/entry using Sales guide entry shape |

## Sequencing and boundaries

Two independent bounded content streams after this freeze: profile author owns customer-profile-topics.ts and its evidence; report author owns customer-report-topics.ts and its evidence. Root owns integration, lifecycle/FAQs, sidebar/vocabs, final full scoped diff and reconciliation. Authors preserve peer/user changes, never edit business screens or shared presentation. Any source conflict is reported to root before affected prose is frozen.

Phases0/1: source discovery/content contract; Phase5: existing-reader integration; Phase6: source reconciliation. Phases2/3/4 business implementation are not authorized or needed. No new grid/ListVM/write/action/API contract. No mappings, domain calculations, schema changes or migration.

Source-only verification: exact eight topic identity/route coverage, nonempty EN/AR text, actual route destinations, syntactic parsing/imports, touched vocabulary parity, whitespace/merge markers, scoped diff preservation. Build/tests/lint/runtime/browser/database/migrations/commits/push/deployment/Graphify/Sigma MCP prohibited. Owner acceptance: compile; open Customers guide and each topic/deep link; switch EN/AR; verify narrow/RTL/theme/keyboard/print and representative user instructions.

Follow-up distinct Customers screen icons — 2026-10-08: owner reports repeated icons on /UserGuide/customers?tab=screens. Frozen presentation-only decision: use existing GuideTopic.icon content property for all eight Customers topics, with person/building/journal-text/bar-chart/hourglass-split/bell/cash-coin/calendar-check mapped respectively to Individual/Company/Statement/Balances/Aging/Alerts/Debt Collection/Follow-up. Evidence: both GuideReader topic links and GuideTopic FormSection currently fall back to bi-window because these topics omit icon; GuideTopic model explicitly accepts Bootstrap icon classes, all eight glyphs exist in installed bootstrap-icons CSS. Master7/UI24 conformance: existing shared renderer, FormSection and topic content remain owners; no renderer/CSS/palette/routes/actions/business prose changes. Actual existing Sales guide and Staff guide use the same content-owned icon mechanism. Scope is two Customers topic content files plus this existing contract/review; no backend/schema/API or workers. Prior recipe drift remains recorded; canonical books govern, owner regeneration/semantic review pending.
