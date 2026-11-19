# ms-lib removal — non-Voucher ordinary lists worker

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-15 |
| Owned workstream | Ten non-Voucher ordinary lists, component TS/HTML and feature model additions only |

## Boundaries and preservation

Read canonical Sigma AGENTS, the required skill's relevant UI1/3/4/5/6/7/22/28 rules, frozen removal plan, actual Workshop Job list, shared DataTable/column/format/filter/title/button declarations, BaseService and legacy TableList implementation. Root owns packet drift/freeze, user guides, translations, shared integration, backend boundaries and final reconciliation. No subagents spawned by this worker.

All ten old table-list imports/selectors and metadata replaced directly with typed DataTable columns, shared list shell/FeatureTitle/FilterPanel/PrimaryActionButton. Existing component class/selector/route identity stays unchanged; no new wrapper, component, service or config root. Empty feature SCSS files stay unchanged. Default local paging uses15 rows and shared choices; first/pageSize stay synchronized with pagination and reset on local filter/read changes.

Nine services retain the exact no-argument get() read. Users retains get(filters) with these exact server keys: id, name, surname, emailAddress, userName, contact.name, currentBranch.name, branchAccess, active, createdBy, createdAt. Safe local form names contactName/currentBranchName map explicitly to the dotted server keys, so the existing shared advanced-filter counter reads ordinary form keys. Date remains a Date/null control before the existing BaseService query serializer; no API/date-filter transport redesign. All service files and endpoint paths are untouched. Search on the other nine lists reloads their existing read; their old column search forms emitted unbound events and had no server implementation to preserve.

Local keyboard contains-search and status controls remain for every list. Legacy status predicates read isActive===true/false and uppercase Deleted===true, matching actual ms-lib source. They do not reinterpret isDeleted or Users.active. Models add optional presentation-only Deleted, and optional isActive for User/Role whose declared DTO lacks it. Users/Roles status subsets can therefore be empty exactly as their old contract allowed. Column-based text search retains raw createdAt transport text (the old global filter source) and uses explicit name projections for nested User contact/currentBranch. Status selection is language-independent instead of matching English innerText.

Read lifetimes use Subject/switchMap/defer, takeUntilDestroyed and finalize. Both declared Result failure and HTTP failure clear stale rows/set loadFailed; global interceptor remains the sole request-error presenter, and the table suppresses its no-data statement on failure. Search/Create controls use read busy gates; Reset cancels/replaces through switchMap. There are no API success/error toasts added.

## Grid and route reconciliation

Eight generated lists (BillSettings, BillDetail, ServiceChecklistItem1, PreTerminationRule, ProvisionDetail, OpeningBalanceCustomer, PDCReceivable, Clause) preserve this exact displayed order: name, sku, categoryName, createdBy, createdAt. Their original DTOs omit name/sku/categoryName. Each feature adds its own ListRow extending its DTO with those optional presentation properties; no value is manufactured, no entity/schema/API contract changes. The pre-existing product-field mismatch remains unresolved and needs a separate business review if those columns should be redesigned. Existing relative details/id and absolute /menu/products/details/id links and each existing inventory/<Feature>/create navigation string remain unchanged, including any pre-existing application route mismatch.

Users preserves id, name, surname, emailAddress, userName, contact.name, currentBranch.name, branchAccess, active, createdBy, createdAt. The two nested values now have typed value functions. Roles preserves id, name, isDefault, createdBy, createdAt. ID links retain details/id. Boolean active/isDefault had link metadata with no path; they now render their same raw boolean text without manufacturing a navigation destination. Creation stays User/create and Role/create. Final conformance amendment: all createdAt columns use shared type:'date', so UI5/DataTable owns dd/MM/yyyy rendering. This supersedes preservation of the legacy dd/MMMM/yyyy display; feature formatDate/LOCALE_ID/helper copies were removed. Date filter objects/query serialization remain unchanged.

All moreActions in these files were console-only placeholders and not rendered for default single-selection library mode. They are omitted; no Delete/Activate/Loyalty/Tags implementation was invented.

## Conformance evidence

| Concern | Owning block / compared source | Outcome |
|---|---|---|
| Page bounds/title | UI1/3, Workshop Job list | sigma-route-host > sigma-list-page/panel/header, shared feature title inside panel, no feature CSS |
| Filters | UI4, Workshop Job list and actual FilterPanel declarations | one typed reactive form, stableLayout, labelled controls, mandatory Reset, actual directives registered; Users advanced projection |
| Columns/table/pager | UI5/6 and exact DataTable/format exports | readonly typed columns, direct DataTable per list, lazy=false, fill=true, controlled first/rows and shared pager |
| Actions | UI7 and old method bodies | existing Create/detail destinations retained; no no-op domain actions |
| Read failures/lifetime | UI22/28 and BaseService/interceptor ownership | both failure channels, switchMap cancellation and teardown, balanced global loader |

## Verification

- Source parser script: C:/Users/user/AppData/Local/Temp/sigma-ms-other-lists-source-check.cjs.
- Parsed20 TypeScript files and10 Angular templates: zero syntax diagnostics.
- Checked local imports against exact files/named top-level exports: zero missing paths/exports.
- Checked all30 changed files: no ms-lib, table-list, ListCol, ColType, TableListComponent or console.log tokens remain.
- Scoped git diff/check in actual frontend repository: no whitespace errors. Reviewed the scoped changes for service call shape, unchanged create/detail destinations, displayed field ordering and typed model additions. Existing route files retain their component imports unchanged.
- Source parsing/export checks do not establish TypeScript assignability, Angular template type-checking, build output or runtime/visual correctness.
- No builds, tests, lint, browser/app automation, DB, migrations, commits, pushes or deployment were run.
- Root must complete translations for legacyLists.{billSettings,billDetail,serviceChecklistItem1,preTerminationRule,provisionDetail,openingBalanceCustomer,pdcReceivable,clause,users,roles} and existing in-app user-guide integration.

## Owner verification pending

Compile the frontend; verify Users server keys/date/nested filters; representative loaded-array keyword/status/paging and detail/Create navigation; both failure channels and destroy/Reset cancellation; short/narrow layout, EN/AR, RTL and themes. Existing backend paging/default population is untouched and should not be described as loading every server record. No migration required by this frontend-only work.

## Owned changed files

- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Fleet/ServiceChecklistItem1/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Fleet/ServiceChecklistItem1/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Fleet/ServiceChecklistItem1/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Billing/BillSettings/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Billing/BillSettings/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Billing/BillSettings/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Billing/BillDetail/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Billing/BillDetail/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Billing/BillDetail/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/PreTerminationRule/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/PreTerminationRule/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/PreTerminationRule/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/ProvisionDetail/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/ProvisionDetail/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/ProvisionDetail/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/OpeningBalanceCustomer/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/OpeningBalanceCustomer/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/OpeningBalanceCustomer/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/PDCReceivable/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/PDCReceivable/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/PDCReceivable/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/Clause/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/Clause/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/Clause/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Users/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Users/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Users/models/list.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Roles/components/list/list.component.ts`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Roles/components/list/list.component.html`
- `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/Roles/models/list.ts`
