# Sidebar user guides — 2026-10-08

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Request | Review every sidebar menu and add its own explanation using organized attractive components inside Sigma |
| Tier | L: shared presentation/content, source-only |
| Authority | AGENTS.md, sigma-screen-refactor, Master1/4/5/7; UI1/3/23/24/25/26/27/29/30 |
| Packets | Check executed: PHASE01 current, PLAN00/PHASE00/02–06 stale; canonical blocks govern; owner regeneration/semantic review pending |

## Existing state, scope and impact

MenuItem/SIDEBAR_MENU_ITEMS own the25 top-level menu entries and292 leaf occurrences, including duplicate destinations and placeholders. MenuCatalogService normalizes icons/identity; SidebarMenuComponent owns search, recent/pins and disclosure. No existing help feature was found in the scoped menu/routes/help filenames. User requires reviewing content for each menu, not a whole-solution business refactor. Only menu-owned routes/list/detail source and directly necessary services may be inspected for documentation. Current Sales, vocabulary and unrelated user changes are preserved.

| Area | Decision | Target owner / impact |
|---|---|---|
| Existing menu/routes/search/pins | Keep/Extend | Add one guide child per group; leaf-only roots get accessible guide entry; original routes/identities retain behavior |
| Business writers/backend/database | Keep | No business/state/calculation/API/schema change; content only describes verified source behavior |
| Guide reader | Create | One authenticated routed read-only workspace with shared FeatureTitle, SummaryCards, FormSection/StateMessage and internal scroll |
| Module/chapter data | Create | Typed versioned bilingual static content, independent from rendering, one topic per menu occurrence |
| Existing Sales client guide | Reuse | Source-confirmed narrative feeds Sales chapter; no external publishing |

## Options and decisions

Separate website was considered in the conversation; user explicitly clarified guides inside each sidebar menu. A modal is unsuitable for long workflows; choose a routed document reader composed from existing shared editor/document primitives. This is a read-only documentation exception, not a paged report or an editable aggregate. No new screen pattern/business rule is implied. Static content requires no new API/DB or authoring permissions; in-app editing and external hosting are outside this request.

## Target contracts and ambiguity register

- `/UserGuide` opens the directory; `/UserGuide/:sectionId` opens its guide, optional `topic` query selects a specific menu topic. Invalid IDs show a translated empty state, never silently open a different guide.
- `GuideText={en,ar}` is authored document content; language selection follows existing TranslateService, with English fallback. UI chrome uses complete `userGuide.*` keys in both standard vocabularies. Catalog title keys remain existing navigation identity.
- `GuideTopic={titleKey,route,purpose,steps,notes,status?}`; `status` is available/unavailable/sharedDestination. `GuideSection={id,titleKey,title,overview,steps,topics}`. Authors own scoped content files only. No HTML content injection/evaluation is used.
- All25 root menu entries have a guide. All292 original leaf occurrences appear in their owning guide, even a repeated route. Source-unsupported or placeholder destinations are explicitly described as unavailable/shared destinations; no nonexistent transaction/report is promised.
- Steps are source-backed user tasks, with additional notes for financial/state constraints only when verified. No guessed policy, automatic posting/refund or permission restriction.
- Ordinary guide chapter navigation changes no records. Opening an operational screen uses its existing route and existing guards. Reading/presentation remains persistent through saved source content and stable links; per-user completion/analytics is not introduced.
- Existing auth parent protects the new route; no invented permission/API/client/interceptor. No HTTP is required, so remote-loading/result failures are not applicable.

| Question | Disposition / evidence |
|---|---|
| Every group or every leaf? | Both: group workflow plus topic for each existing leaf; follows user's every-menu clarification |
| Missing/duplicate destinations | Source classification mandatory; reader shows current limitation; original menu routes stay unchanged |
| Arabic/English | Existing application languages, bilingual authored content and shared chrome |
| Financial policy / new backend | None authorized or needed; explain actual source only |

## Reference conformance before editing

| Concern | Book | Actual reference/shared owner | Target |
|---|---|---|---|
| Fill shell/header | UI1/3 | Job editor shell; Accounts workspace modifier; FeatureTitle | Container-fill host/panel/form/body, title fixed, content owns scroll |
| Chapter/section structure | UI1/24/27 | Existing FormSection and SummaryCards public inputs; editor tabs/native labelled navigation | One reusable reader; no repeated module layouts or custom card palette |
| Theme/RTL | UI24/25 | Shared sigma tokens, logical spacing, native controls | Token-based semantic/structural styles only, print bounds released |
| Catalog integration | UI1/26 | MenuCatalogService prepare/index and existing pages Routing under Layout/AuthGuard | Extend existing owner; original tree/pin/search behavior preserved |
| Document content | UI23/Master5 | Existing bilingual vocabs plus source-owned document text contract | Both languages, no template English/raw HTML, factual evidence retained under reviews |

## Sequencing and verification

Freeze common content/UI/wiring contracts here before bounded content delegation. Root owns reader/models/catalog/sidebar integration/vocabs and final reconciliation. Independent content workers own finance/report, operations, and people/admin files plus their evidence, with no source feature mutations. Source-only check: menu coverage/exact topic identity, status classification, translations, TS/Angular parse and import resolution, complete scoped diff in frontend repository. Build/tests/lint/browser/runtime/DB/migrations/commits/push/deploy/Graphify/Sigma MCP remain prohibited. Owner checks: compile, keyboard, search/topic/deep links, narrow/RTL/theme/print, operational links and representative workflow facts.

No migration/backfill/data risk; all application business behavior is retained. Rollback is removal of new guide route/content/menu links only. No Missing decision blocks this additive read-only contract; unresolved underlying placeholder behavior is documented, not repaired.

## Frozen scope amendment — user instruction 2026-10-08

The user subsequently requested: "طبق على sales ونشوف الناتج". Implement only the Sales pilot now; defer all other menus. The earlier inventory is discovery evidence, not authorization to implement the remaining chapters. Add the guide entry beneath Sales only, keep its four operational links and their identities. The reusable reader opens `/UserGuide/sales`; `/UserGuide` lists only implemented guides. Topic titles are authored bilingual `GuideText`, retaining `titleKey` for menu identity. Add `GuideQuestion={question,answer}` and `GuideSection.questions` for verified FAQs. Scope is four menu topics plus the source-backed sales lifecycle and FAQs. Root owns presentation/wiring and one isolated content worker owns `content/sales-guide.ts` and Sales evidence. No preemptive tsconfig roots (UI29 G17); add only upon compiler feedback. All original non-Sales coverage and delegation targets are deferred.

Presentation contract detail: lifecycle steps use `GuideStep={title:GuideText,description:GuideText,icon:string}`; topic action steps remain `GuideText[]`. This supports meaningful shared section headings without parsing prose or local card styling. Three peer reader tabs (journey, screens, FAQs) use EditorTabs workspace appearance; all three remain rendered for full-guide print, inactive panels hide in screen media only.

Final shell selection (UI20/21, source evidence): use the shared bounded document shell `section[appReportPage].sigma-report-page--fill` / `sigma-report-panel`, preserving the originally frozen single internal content scroll and EditorTabs/FormSection composition. The actual ReportPage/ReportActions and StatementOfAccount reference were inspected. This supplies the shared paper/theme reset and action hiding for complete-document output; the guide has static content, so report filters/API/grid contracts are not applicable. No shared styles are extended and no editor business contract is introduced. The prior editor-shell option remains recorded above as the initial selection, superseded by this source-supported document-shell detail before handoff.
