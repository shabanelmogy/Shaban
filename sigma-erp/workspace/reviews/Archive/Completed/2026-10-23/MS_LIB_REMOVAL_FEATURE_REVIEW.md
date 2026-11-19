# ms-lib removal — final source reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-15 |

## Outcome and scope

All40 original feature consumers now use direct shared DataTableComponent and typed columns. GridTableSearchClearDirective was unused outside its own source and has been deleted. Its248 lines of dedicated table-list global theme/search/paginator CSS were removed; existing shared table/clear owners remain. Final scoped search finds no ms-lib imports, old table-list selector or ListCol/ColType/TableListComponent definitions/usages in source or application/package/compiler configuration. There is no local compatibility wrapper or vendored library.

Package.json and package-lock.json already had no ms-lib dependency, so neither was rewritten and no npm install/uninstall/prune was executed. An extraneous installed node_modules copy can remain until the owner's next clean dependency install; it is no longer referenced by application source. Angular/PrimeNG/TypeScript versions were not changed.

Authorizing request: «نقدر نتخلص مبدئيا من ms-lib». Frozen scope/decisions: MS_LIB_REMOVAL_MAINTENANCE_EVOLUTION_PLAN.md. Source manifest41 includes40 feature consumers plus the deleted directive. No screenshot evidence was used. Applied discovery/freeze/read presentation/integration/reconciliation; backend, schema migration, editor redesign and domain-action implementation phases skipped because the dependency removal retains existing service/write contracts.

## Files and ownership

-23 ordinary Voucher lists: in-place components/list TS/HTML plus imported feature models/grid-row.ts. Full list and per-screen columns are in MS_LIB_VOUCHER_LISTS_WORKER.md.
-10 ordinary lists in Billing, Administration, Customers, Fleet and Agreements Dashboard2: in-place TS/HTML plus feature models/list.ts presentation declarations. Full paths are in MS_LIB_OTHER_LISTS_WORKER.md.
-Five legacy Invoice candidate/detail components: equipment-rental-details, lease-details, limousine-bulk-details, rental-details and transportation-details TS/HTML plus local table-row.ts. EquipmentRentalDetails now extends the existing application BaseComponentService rather than the library base. Full scope is in MS_LIB_INVOICE_TABLES_WORKER.md.
-Root: HolidaysSetting and VehicleRentalDetails status table TS/HTML, toolbar exact-list title suppression, shared grid-row-values.ts, obsolete directive deletion and styles.scss cleanup, en/ar vocabularies, shared screen guidance and the seven owning guide content files.
-New authored guide content record-list-topics.ts and table-workspace-topics.ts; existing guide reader/routes/entries retained. Route evidence is MS_LIB_REMOVAL_GUIDE_ROUTE_EVIDENCE.json.
-Instruction learning: canonical UI5, UI preamble1.100 and CHANGELOG, skill §4.3/history, generator-produced affected packets. No hand edits to generated packets.

Actual source repository: F:/My Work/Sigma/SiGmaAngularFrontEnd. Backend was not modified by this task. Review artifacts remain local under reviews. New imported feature-row files were read/parsed directly; root source checks and worker full scoped-diff reviews cover every consumer, with root integration diffs separately reviewed.

## Decisions and final conformance

| Concern | Governing source / actual producer-consumer comparison | Final source result |
|---|---|---|
| Grid replacement | UI5/6 and shared DataTable declarations; Workshop Job list shell |40 direct shared grids; typed field keys, existing labels/order/links/templates/actions retained; no extra p-table |
| Column contract | Old colName/displayName metadata versus new field/header metadata, feature projection models and original response DTOs |All236 original displayed data columns retained in order across40 consumers; original bare id header normalized to general.id. Shared actions replace old action-template columns |
| List layout | UI1/3/4/6; Workshop Job, FeatureTitle, FilterPanel, PrimaryActionButton |33 ordinary lists use bounded shared page/panel/header/filter/grid shell with fill=true. Exact scoped route roots suppress duplicate toolbar title; existing editor/detail routes unaffected |
| Embedded table ownership | UI6; existing Settings/Invoice/report containers |Holidays/status/legacy Invoice tables retain their embedded containers and shared internal row viewport. No general layout rewrite of the untouched dynamic report/editor shell is claimed |
| Search and dataset | Existing library getNestedValue/onGlobalFilter/filterItems/custom filters and actual BaseService.get serialization |Local keyboard/status/sort/page behavior applies only to the returned arrays, lazy=false; source server keys and lookup owners retained. No new server paging, total-count/completeness guarantee, column-based search API or financial formula |
| Dates | UI5 shared DataTable type date |Source values/date-only scope retained; shared dd/MM/yyyy replaces textual-month legacy rendering. Search Date objects/aliases unchanged |
| Selection | Shared selectable/selectionChange and mode conditions in five legacy Invoice components |Create/update multi-selection retained; paging/filter/reload clears stale selection. View-only old single highlight had no external business consumer. Selection does not change save payloads |
| Actions | Existing working GRN/PO/PR and Holidays handlers; shared ActionList/ActionButton |Real actions retain current endpoints/routes; console-only loyalty/tag/delete placeholders omitted. No new payment/generation/delete business rule. Existing mutation validation/confirmation/editor debt is not certified by a grid-only migration |
| Error/lifetime | UI22/28; global error interceptor, Subject/switchMap or cancelled Subscription, finalize/takeUntilDestroyed |Both read-failure channels clear/suppress stale empty output and restore loading; central interceptor owns API messages, no duplicate inline API dialog. Working list delete refresh waits for successful response |
| Typed projection reuse | UI5; original23 identical readers versus shared grid-row-values.ts |Reader bodies extracted unchanged; path/fallback choices remain in feature mappers, missing values stay empty, booleans are not coerced and no domain aliases invented |
| Guides | Master7; existing GuideTopic/reader and current route source |33 list topics plus Holidays/status topics in owning module guides, common keyboard/paging/scroll/action explanation; unique topic identities prevent shared-reader tracking collisions |

Guide grid column/property details are retained in the worker reports and MS_LIB_REMOVAL_COLUMN_EVIDENCE.json. Voucher GridRows intersect existing DTOs and add exactly the retained scalar display paths plus identity/status needed for old local filters/actions; ordinary non-Voucher rows retain DTOs with optional existing product-style display fields where the response model lacks them. These presentation declarations are not claims that missing backend fields now exist, and no backend ListVM was changed.

## Preserved existing limitations

-Several generated lists still reference name/sku/categoryName although their original DTOs do not declare those fields. Missing payload paths stay blank; no guessed business columns introduced. Existing inventory/* Create and /menu/products/details destinations remain unchanged even where old routing is incomplete.
-Local status filters retain exact source isActive and capitalized Deleted semantics, without aliasing active/isDeleted. Some older DTOs do not supply those properties.
-PurchaseReturn retains three differently labelled columns reading purchaseReturnDate; duplicate date search controls are consolidated to one actual query key. DebitNote's old contactName/supplierName query mismatch is retained rather than silently redefining its API contract.
-Four list sources have no distinct reachable navigation route: two shadowed duplicate routes for Voucher BillDetail/ProvisionDetail and older Customers OpeningBalanceCustomer/PDCReceivable sources. New guide topics mark them unavailable and do not add routes or navigation entries. Existing modern PDC navigation remains separate.
-The five old Invoice subcomponents are not mounted by the current Invoice route table, which uses core/feature-owned editors and redirects. Their old Save empty-string payload and GetById-not-populating-table limitations remain; no new generation workflow is asserted.
-VehicleRentalDetails retains its independent status request and existing dynamic report producer. Its initial undefined searchData read was repaired by reading the already initialized form when no explicit search payload is supplied; no summary/detail formula or linkage added. Full dynamic-report layout/payload modernization is outside this task.

## Verification and owner handoff

Root source inspection script Audit-MsLibRemoval.cjs produces MS_LIB_REMOVAL_SOURCE_AUDIT.json and COLUMN_EVIDENCE.json:92 scoped TypeScript files and41 templates parsed with zero syntax diagnostics;810 direct source named imports resolved;510 shared input bindings matched public declarations;191 rendered translation keys exist in EN/AR;40 consumers/236 data columns match original order and labels. These are source-parser/contract checks, not TypeScript semantic compilation or runtime validation.

Owner reported TS1117 after a duplicate Arabic purchaseRequest.supplierCode entry was introduced during translation completion. The newly inserted duplicate was removed, preserving the original existing property. Root audit now compares duplicate object-property occurrences with repository baseline in both complete vocabularies and finds no newly introduced duplicate. This source correction still needs owner compile confirmation.

Read-only Check-Translations was run for changed blocks. Newly added legacyLists/recordListsGuide and scoped rendered keys are bilingual. The wider original general/sideMenu/user/role/purchaseRequest blocks still contain pre-existing gaps outside these rendered keys (147 missing Arabic and5 missing English in the broad report, zero case-only mismatches); those unrelated translations were not bulk rewritten. This is separate from the fixed duplicate and zero missing rendered keys in the scoped audit.

All eight recipe checks pass after regenerating derivative packets from UI0/UI5 changes; semantic review retains shared typed-grid ownership and feature-owned mappings, with no business/API rule in generated packets. Scoped whitespace checks pass. No package/compiler workaround or Angular upgrade was made.

Owner verification: run npm run build in the frontend, then inspect representative User/Role, generated Billing, live PurchaseRequest/PO/GRN/CreditNote, Holidays and VehicleRentalDetails routes. Check Search/Reset/lookup failures, local keyboard/status/sort/paging, exact create/detail destinations, existing row action behavior, empty/HTTP failure, footer/row scroll, Arabic/English, RTL/themes and narrow/short heights. Dormant sources require source/compiler validation, not fabricated operational navigation. Package/lock no longer needs ms-lib for source compilation; independent library/version/legacy business defects can still surface during the owner build.

No Add-Migration needed: no entity/EF/schema/backend change. No builds/tests/lint/browser/database commands/migrations/commits/pushes/deployments were executed. Suggested frontend commit: `refactor(ui): replace ms-lib consumers with shared data tables`. Suggested instruction-layer commit: `docs(ui): document shared grid projection readers`.

Agent use: three bounded workers with inherited parent model handled disjoint23 Voucher lists,10 other lists and5 Invoice subcomponents after the shared freeze. They read required authority/references, preserved shared-tree changes and returned source/diff reports. Root owned shared utilities/styles/config/guide/translations/root tables, audited integration and removed23 duplicated reader implementations. Parallel ownership reduced repeated sequential migration time without overlapping writes. Overall status remains Implemented — source-only, with owner compile/runtime/visual verification pending.
