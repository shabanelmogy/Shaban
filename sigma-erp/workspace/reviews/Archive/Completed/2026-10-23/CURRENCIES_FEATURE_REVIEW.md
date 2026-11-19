# Currencies — review and implementation handoff

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Ownership gate | Resolved by owner's explicit continuation approval; preserve other sessions' changes and add currency keys only |

## Review outcome

Owner requested review and documentation-based implementation of src/app/modules/Administration/Currencies. Phase0 discovery and Phase1 contracts were frozen before source edits in CURRENCIES_FULL_STACK_CONTRACT_FREEZE.md. Bounded persistence plan: CURRENCIES_MAINTENANCE_EVOLUTION_PLAN.md. The following handoff records the final source implementation and pending owner acceptance. The initial ownership interruption is retained below as history.

| Confirmed finding | Source | Planned resolution / phase |
|---|---|---|
| Legacy ms-lib table, no explicit server paging/sort or recoverable read errors | Currencies/components/list | Shared Job-style shell/filter/DataTable; cancellable typed queries, applied filters and full-page export (2) |
| Routed form conflicts with fields-only modal shape; no distinct View/Edit workflow | Currencies/currency.routes.ts, components/details | One controlled EditorDialog for Create/View/Edit, list route only after scoped caller reconciliation (3/5) |
| Update sends server-owned subscriptionId/No; any payload/form types | models/create.ts, details.component.ts | Typed form and client-editable inputs+id only (3) |
| Detail/Save/Delete lack transport errors/finalize; duplicate clicks and failed detail not guarded | details.component.ts | Ready/busy guards, request finalization, both failure channels and Retry (3/4) |
| No deletion/discard confirmation | details.component.ts | Shared confirmDelete/confirmDiscard with frozen form and same-session checks (3/4) |
| Name Add250/Update50 disagree with EF100; rate VM permits storage overflow | Currency VMs, CurrencyConfig | Matching explicit required string bounds, precision/rounded rate storage validation (1/3) |
| Current duplicates use repeated literal-English code, no matching unique indexes | CurrencyService, CurrencyConfig | Shared unique validation/writer serialization, EN/AR messages, filtered tenant indexes; owner migration (1) |
| Generic RemoveAsync ignores live inbound references | Service.RemoveAsync, CurrencyService | Currency-scoped RemoveWithChildrenAsync with no owned children (4); known BE backlog31 |
| List/Detail inherit unused tenant/audit/plumbing | CurrencyListVm/CurrencyDetailVm | Exact displayed columns and lean editor shape; caller check before removal (1/2/3) |
| Currencies topic absent | UserGuide/content/administration-guide.ts | Add bilingual purpose/actions/limits/search/export/discard/retry guidance in existing module guide (6) |

No screenshots supplied. All above are source/canonical evidence, not visual acceptance. IsBase, six-place rate rounding, base<=2 ledger compatibility and deferred exchange-system rules remain unchanged. Deferred base-currency deletion/change policy is a separate nonblocking domain concern; no new lifecycle rule selected.

## Ownership interruption

Discovery git status was clean in both repositories. Before the first application edit, git status showed another session working on CustomerRequests, Branches, shared CSV components and navbar. Critically, SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx (required scoped bilingual error owners) were modified by that session at 2026-10-14 04:42:22 UTC. At that checkpoint no task-owned source edits existed. Work paused under Master6 G18. Owner then explicitly approved continuation while preserving other changes and adding currency keys only, and subsequently requested completion. Later Country, import and guide/translation changes were also preserved with surgical currency-only edits to shared files.

## Reconciliation / verification status

Phases0–6 implemented and reconciled in source: discovery/freeze; domain/DTO/index contracts; read/grid; editor/write; confirmed Delete action; routes/service/cache/guide integration; scoped final reconciliation. Conditional children/documents/tabs/approval/posting/activation/report print were skipped because the currency master has no such screen-owned workflow. The separate full exchange-rate plan remains Draft and outside this bounded implementation.

Delegation: currency_backend_final used the inherited model for the bounded backend implementation (Currency service/VM/config and currency-only resource keys); root owned discovery/freeze, frontend, guide/books/skill/packets and complete integration/diff reconciliation. Parallel work reduced wall-clock time because frontend and backend implementation had disjoint source ownership after freeze. An earlier attempted backend dispatch did not persist across steering and produced no edits; the completed backend workstream above is the integrated result. No models were overridden, and no overlapping file ownership was assigned.

Migration required (not generated): `Add-Migration AddCurrencyLiveTenantUniqueIndexes`. The migration name has no existing filename collision. EF changes are only three unique indexes `(SubscriptionId, Code)`, `(SubscriptionId, Name)`, `(SubscriptionId, DecimalName)`, each filtered `[IsDeleted] = 0`. Entity properties, nullability, EF string lengths, decimal scale and model snapshots remain unchanged. Before applying, owner checks existing live-key duplicates under the actual database collation, whitespace/trailing-space behavior and existing invalid string/precision/rate values. Do not automatically rewrite or delete historical data. VM Name length now matches existing EF100 (previous Add250/Update50). Deploy frontend/backend together after owner validation; reads lose unused fields only, lookup and financial-policy shapes remain unchanged.

## Final decisions and contract comparisons

| Decision | Final evidence and business reason |
|---|---|
| Screen shape/routes | Fields only → type01 controlled modal; `/Currency` list remains; no in-source external create/details callers found. Same details component for explicit Create/Edit/View, View read-only/no Save, separate list Edit. CanDeactivate delegates to editor before navigation. |
| Columns and ListVM | Actions; **id, name, code, decimalName, decimalPrecision, currencyToBaseRate, isBase, createdBy, createdAt**. Backend ListVM alongside: **Id, Name, Code, DecimalName, DecimalPrecision, CurrencyToBaseRate, IsBase, CreatedBy, CreatedAt**. ID still opens View through public DataTableColumn.link. Rates use number type to preserve six-place values; base flag uses translated status. No unused list plumbing. |
| Filters/read query | Main name/code/decimalName Contains; advanced id equality, precision/rate decimal equality. Exact property keys through toListParams; empty omitted, zero retained. Integer/finite validators on numeric filters. Search/Reset page1; applied snapshots drive paging/export/mutation refresh and route state. Shared default15, sizes10/15/20/50/100, clamped UI≤100/backend1–100; columns-derived stored sort whitelist/id tie-breaker. |
| Detail/payload | Detail Id + five inputs + IsBase. Add five client inputs; Update same plus Id. No tenant/No/audit/base flag in writes. Required strings100/10/50, precision integer0–6, rate≥0.000001; server rounds6 and rejects rounded storage overflow. First-invalid focus and shared field errors. |
| Duplicate/persistence | Existing independent Code/Name/DecimalName rules centralized in UniqueColumns/InvalidInputAsync and guarded with ExecuteUniqueWriteAsync plus three database indexes. Add two saves atomic under shared UOW transaction; UpdateCore one save under inherited duplicate boundary. Retained tracked currency rows change only necessary scalars/IsBase, without blanket Update on every currency. |
| Base/number policy | Current earliest-live assignment preserved. Actual selected winner is validated before re-election so base precision≤2 remains true. Currency Add/Update/Delete invalidates existing FinancialNumberPolicyService cache; next load reads backend. No new accounting formulas, rates history, conversion/ledger schema or base toggle. |
| Delete | RemoveWithChildrenAsync(id, None) with zero owned children gives404 and live EF FK usage blockers for Supplier/PartnerBillingInfo/Bank/JournalVoucher. Shared named-record danger confirmation; busy guards and global feedback; failed row retained, current applied page refreshed, final-page correction. No new base-delete rule. |
| Mapping | CurrencyProfiler's four explicit one-way maps remain sufficient for scalar DTOs. No ReverseMap/Ignore/ForMember added. List/detail/controller methods stay inherited. |
| Feedback/lifecycle | switchMap/defer cancels stale list reads; detail identity/open/mode checked; every primary request releases global/local loading in finalize. Reads own inline failure+Retry with skip header/apiErrorMessage; export owns composedReadErrorMessage and no partial file. Standard mutation success/failure remains interceptor-only. Save and pending discard freezeFormState, keep draft on failure/cancel, X/Cancel/Escape/navigation share deferred decision. |
| Authentication/permissions | CurrencyService and FinancialNumberPolicyService root HttpClient → AppModule token/error interceptors; environment API URL/Accept-Language retained. No feature provider/manual token. Authorization candidates: POST/PUT/DELETE Currency (master financial configuration); existing AuthGuard/Authorize remain authentication, no invented permission. |

## Service override audit

| Method/member | Reason / inherited scope |
|---|---|
| UniqueColumns | Existing three independent currency keys, shared duplicate validation/serialization. |
| AddAsync / AddCurrencyAsync | Existing two saves and base re-election require shared atomic unique-write boundary. Kept transaction comment records owner. |
| UpdateCoreAsync | Current base assignment and precision/rate validation, retained tracked scalars and one save. Public UpdateAsync inherited to own key lock. |
| RemoveAsync | Dependency-safe shared deletion; no hand-written foreign-key lists. |
| GetMany/Detail/Select/HandleActive/controller | Inherited; no feature-specific list projection needed for scalar rows. Generic activate endpoint remains outside this screen's action contract. |

## Final reference conformance

| Concern / book | Compared producer and consumer / actual values | Source result |
|---|---|---|
| Job list shell / UI1/3/4 | CurrenciesComponent host sigma-route-host; template page/panel/header/table chain; FeatureTitle defaults8px insets/bottom, list table8px inset; FilterPanel stableLayout=true/main3/advanced3, shared control34px/default spacing and Reset | Matches shared list reference; no feature stylesheet or duplicated toolbar markup. |
| Grid / UI5/6/8/28 | Shared DataTable owns one p-table/pager/status/date formatting; Currencies has one fill grid, rows15/API TotalCount, translated currentPageReport, resolveListPaging before writes; typed queries via inherited backend GetMany | Source matched; no direct PrimeNG table, ms-lib, fabricated counts or all-pages list paging. |
| Modal / UI13/15 | CurrencyDetailsComponent → EditorDialog visible/mode/contentPadded=true/width840px; intrinsic flex-fill form/body/scroll chain, two field columns; form disable for View; primaryActionVisible=false in View | Source matched single-section composition;840px selected for five simple fields, no tabs/totals. Shell controls portal bounds/header/footer/trap. |
| Validation/close / UI10/19/27 | FieldError for every validated control, actual IDs match labels/focus order; canDeactivate deferred same session, freezeFormState retains disabled controls; accepted subscriber does not reject its own pending flag | Source matched shared owners; no local confirmation/error CSS or fake focus/permission APIs. |
| CRUD / BE3/4/7/8/13 | Currency VM/EF names100/10/50; exact lean read shapes; existing CurrencyProfiler four maps; custom operations justified above | Source matched. Schema indexes require owner migration; live DB support not claimed. |
| Guide / Master7/UI23 | ADMINISTRATION_GUIDE currencies topic route `/Currency`; GuideReader registered ADMINISTRATION_GUIDE; existing sidebar guide `/UserGuide/administration` and currencies menu `/Currency` | Bilingual purpose/steps/actions/validation/financial bounds/discard/retry/paging/export match final source. Guide reading/RTL/theme/print pending. |

## Responsive/source ownership matrix

| Width / boundary | Expected arrangement and inspected owner | Owner visual status |
|---|---|---|
| ≥1250, e.g.1440 | Main/advanced3 columns via FilterPanel; shared title/actions and filling grid, fixed pager; editor840px/two fields | Pending |
| 1249/1250,1199/1200 and intermediate1100 | Shared filter3-column breakpoint; narrow-screen disclosure below1200; editor1099/1100 shell94vw breakpoint; no local overrides | Pending |
| 1023/1024,991/992,767/768 | Editor grid2 columns through global1024 rule; route/shell991.98 spacing; dialog767 switches viewport width | Pending |
| 719/720/721,699/700/701 | Filter stacks below720 with wrapping actions; editor one field below700; shared grid owns overflow and pager | Pending |
| 649/650/651,619/620/621, e.g.360 | FeatureTitle/PrimaryActionButton650 wrap/compact; dialog620 header/footer behavior; one-column fields and internal scroll, fixed Save/Close | Pending |

Same matrix applies EN/AR, LTR/RTL, light/dark, tall/short content, validation, long strings and loading/error states. Full CSS owners inspected (styles.scss, FeatureTitle/FilterPanel/DataTable/EditorDialog/FormSection); no known feature-local cascade fork remains. Source does not prove visual fit or no runtime page scroll.

## Files and shared ownership

Frontend: Currencies list/details TS+HTML (4), routes (1), models/create/details/list (3), existing Currency/services/currency.service.ts (1), shared FinancialNumberPolicyService (1), currency blocks in en.ts/ar.ts (2), currencies topic only in UserGuide/content/administration-guide.ts (1); obsolete empty list/details SCSS removed (2). No unrelated source changes made; shared files contain other sessions' work that must be staged separately.

Backend: CurrencyService (1), CurrencyConfig (1), CurrencyAddVm/UpdateVm/ListVm/DetailVm (4), seven currency-only resource keys in both GeneralMessage files (2). Currency entity/controller/interface/profiler/FinancialNumberPolicy unchanged. No migration/snapshot changes.

Documentation: existing UI2 gains the owning cache invalidation rule; required skill §6 and revision row plus CHANGELOG synchronized. Existing shared components/helpers reused throughout; no new generic visual owner. The only extended shared capability is the existing policy cache's invalidate() method, owned by the typed currency service and documented from source. Regenerated all eight phase/plan packets through the generator; no generated-file hand edits. Semantic review retained Job as list owner, EditorDialog/UI13 as modal owner and Branch/generic Service as pattern1 owner; UI2 fingerprint/dependency propagation confirmed. Final recipe -Check passed all eight.

## Source verification and remaining risks

Full scoped frontend and backend diffs reviewed separately in their actual Git repositories. `git diff --check` passed, including shared files. TypeScript syntax/import-path inspection and Angular parseTemplate found zero failures (11 directly changed TS files +2 templates); this is syntax evidence only, not type checking/Angular compilation. Standalone named exports and public input/output types were inspected. Exact currency translation consumption and Check-Translations -Block currency passed29/29 keys, zero missing/case differences. Both GeneralMessage XML files parse;7 currency keys exactly once in each. Scoped stale imports/types/legacy libraries/server-owned payload fields/merge-marker searches clean. Root reviewed backend output and added precise transaction ownership comments and user-facing rate bounds.

No required screen contract remains Missing/Conflicting/Uncertain. Deferred domain questions are explicit: deleting an unreferenced base can leave no marked base until a later Create/Edit re-elects earliest live; restricting/changing base currency after accounting activity and a full rate/history system await the existing separate plan. The existing generic usage check is a precheck, not a claim of serialized safety against every future foreign-row writer. Participating Add/Update share a currency key lock; indexes protect actual duplicate keys after migration. Unknown external consumers of removed unused read members and old bookmarked create/details URLs require owner compatibility acceptance. JavaScript number transport at very large rate magnitudes has binary precision limits; authoritative rounding/storage validation remains on the server. Cache invalidation refreshes future policy loads, not already-held caller snapshots.

Builds, tests, lint, migrations/model snapshots, database commands, browser/application verification, commits/push/deploy, Graphify and Sigma MCP were not run.

## Owner handoff

1. Inspect existing live duplicate keys/collation and invalid legacy values; run `Add-Migration AddCurrencyLiveTenantUniqueIndexes`, review/apply through your normal process. No automatic data rewrite is prescribed.
2. Build frontend/backend. Exercise all three duplicate keys on Create/Edit (unchanged self-save succeeds), max string lengths, whitespace/empty values, fractional/out-of-range precision, positive/overflow rates and base<=2. Try simultaneous duplicate writes.
3. Verify Create/View/Edit, detail Retry, failed Save retention, keyboard invalid focus, dirty X/Cancel/Escape/navigation confirmation and cancel restoration; one success/failure feedback owner. Verify authenticated GET/mutation headers without recording token values.
4. Search/Reset with text/zero/numeric filters; page-size change on page1, rapid paging/sort/cancel, last-row deletion and FK-blocked deletion. Excel should include every matching page/current-language displayed columns, with no file on a failed page.
5. Verify policy loads before/after successful currency change, preserved cached policy after failure, base re-election and existing selected-currency consumers. Complete responsive matrix and guide reading/RTL/theme/print acceptance.

Suggested commits (stage currency-only hunks in shared files):

- Frontend: `refactor(currencies): adopt shared list and modal editor`
- Backend: `fix(currencies): validate inputs and protect live currency keys`
- Documentation: `docs(currencies): record screen contracts and policy cache ownership`
