# Transportation Transaction / TransactionItem — bounded implementation review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-07 |
| Handoff | TRANSPORTATION_FRONTEND_CONTRACT_FREEZE.md, Frozen |
| Source ownership | Only Transportation/Transaction and Transportation/TransactionItem |

## Implemented contract

Both field-only slices use UI type01, one list-owned controlled EditorDialog for Create/View/Edit. The actual generic backend remains read-only. No screenshots were supplied. Source files are the exact feature controllers/services/VMs/entities/profiles, generic Service/SiGmaControllerBase, pages/routing.ts and the original feature components; no new business rule is inferred.

Transaction grid and local ListDTO match: id, poType, date, supplierQuotationNo, supplierId, notes, discount, createdAt. TransactionItem grid and local ListDTO match: id, description, purchaseOrderId, vehicleId, quantity, uom, unitPrice, tax, createdAt. GUIId is editor/detail data; server ListVM extra inherited/collection properties remain a producer finding.

Transaction Add is guiId/poType/date/supplierQuotationNo/supplierId/notes/discount; TransactionItem Add is guiId/purchaseOrderId/description/vehicleId/quantity/uom/unitPrice/tax. Update adds integer id. Server tenant/audit/No/state properties are omitted. Proper JSON casing is poType/uom/guiId. Opaque Guid values are visible and copied/preserved through shared guidValueValidator; Guid.Empty is valid and provides the existing .NET default for a new record. No integer lookup is falsely converted into a GUID.

Nonnullable GUID/date/number transport controls reject absent or malformed values; text fields retain empty-string support. Signed quantities, price, tax and discount retain valid finite decimals without invented nonnegative rules, rounding, length caps or precision. Every validated editor field has shared FieldError and invalid Save focuses the first field. Native number controls use step=any and forms novalidate, so browser integer stepping rules cannot reject valid fractional contracts. Quantity uses appQuantityInput, the exact standalone directive and InputNumberModule.

Filters are only actually supported generic property filters. Transaction: id/poType/date/supplierQuotationNo/notes/discount. TransactionItem: id/description/quantity/uom/unitPrice/tax. Text Contains, number equality and single-date day equality are preserved. No ignored GUID/search/range filter appears. Saved date hydration uses toPickerDate; manual text uses dateValueValidator/parseDateValue. FilterPanel owns stable geometry and mandatory Reset; controls retain reserved date/number feedback. Server-paged lists start with shared15 rows, cap user/export requests at100, preserve actual response page/size/count and deterministic stored-column sorting.

Latest queries use Subject/switchMap/defer with balanced loading/finalize. Paging/Refresh/Excel operate on applied filter snapshots. Excel uses shared fetchAllPages and dataTableExportRows with the same typed columns and translated headers, fails the whole output on any page failure, and contains no local loop/CSV. Failed reads and writes handle both Result failure and HTTP error, with scoped X-Skip-Error-Interceptor; normal mutation success remains interceptor-owned.

Legacy details/:id is View. Create/view/edit compatibility URLs enter the list-owned modal; route guards protect pending writes, confirmation, export and dirty editors. Same-route record-id changes preserve the accepted route alias, confirm dirty exit and reject stale asynchronous exit decisions before remounting. Closing cancels detail reads and removes the instance. Beforeunload guards active editor Save/dirty state and list Delete. Delete uses the shared danger confirmation, current-row identity recheck, busy gates and one-page-back reconciliation when removing the last visible row.

Long notes/description use shared textareas, including readonly View; opaque GUIDs use copyable readonly inputs in View. Money uses MoneyPipe/DataTable money formatting. No page, filter, table, dialog, validation or theme CSS is copied. The prior unused empty SCSS files remain empty/unreferenced.

## Conformance reconciliation

| Concern | Canonical owner/reference inspected | Final source evidence |
|---|---|---|
| List shell/header/filter/table | UI1/3/4/5/6; actual Workshop/Job list; FeatureTitle/FilterPanel/DataTable | Both list metadata use sigma-route-host; shared page/panel/header classes, stable six-field filter rows, Reset and fill table, typed exact columns |
| Modal shell/body sizing | UI13/15; actual EditorDialog/FormSection public declarations and styles | Controlled mode/visible/events, contentPadded=true, focusOnShow=true, translated screen title and record subtitle; content-sized sigma-editor-scroll flex-fill uses UI13 intrinsic sizing alternative, one scroll owner |
| Validation/input | UI17/19/27; DatePicker/date-utils/scalar-validators/FieldError/Quantity | Actual standalone imports, complete date transport/local hydration, shared GUID/finite-number rules, signed decimals and preserved text semantics, focus and accessible labels |
| Lifetime/errors/output | UI2/8/9/10/22/28; Job bindListQueries, list-query/list-route-state, ConfirmationDialog/api-error | switchMap/defer/finalize, identity/cancellation, applied snapshots, all-page column-matched Excel, both error channels, shared delete/discard and busy/navigation guards |
| Wiring/translation | UI1/23/26; actual routes and public exports/inputs | Int identity and all five route aliases, no new authorization/menu/lifecycle; EN/AR payload supplied to root |

The catalog VehicleService reference is currently routed, so its modal reference drift is not copied. Root owns documentation promotion/shared extraction and translations merging.

## Source-only verification

The 18 changed runtime source/model/service/route/template files across these two directories were compared with their original source and scoped Git diff. TypeScript parser:14 runtime files; Angular template parser:4 templates; no syntax findings. Exact local named import exports, used shared standalone registration, actual BaseComponent member use and current public bound input names/types were checked. Scoped removed-type/consumer search found no stale references. Scoped git diff --check passes. No ms-lib, TypeScript any, fake audit fields, console/no-op business actions, native date inputs, toISOString, custom errors or unsupported ES2019 APIs remain in runtime source. Parser/export checks are not application compilation or visual acceptance.

Translation artifact: TRANSACTIONS_20261007_TRANSLATIONS.json supplies EN/AR transportTransaction and transportTransactionItem blocks, dynamic field labels/title modes, pagination placeholders, confirmations and failure messages. Root owns merge and vocabulary reconciliation.

## Boundaries, risks and owner checks

Backend APIs and entity/EF schema are unchanged; no migration is required. Transaction.Items is absent from current write/current UI contracts and is not turned into a child workflow. The entity-only Amount/AmountWithTax getters are not returned by VMs and no client authoritative total is invented. Tax remains the current entered amount, not an invented rate/settings calculation; a financial tax-policy redesign requires a producer/domain contract. Generic activation exists but is not added to the UI. Parent-item GUID linkage semantics, missing reference validation and generic deletion/oversized VM/reverse-mapping issues remain backend follow-ups.

Owner checks pending: application build; Create/Edit/View and old/new deep links; valid zero/negative/fractional numeric values and GUID.Empty, malformed GUID/date/number rejection; saved date rehydration; failure/Retry paths; rapid paging/search and same-route id changes; dirty Close/Escape/navigation/reload, pending Save/Delete; full matching Excel across multiple pages; last-row deletion; EN/AR, RTL, dark theme, narrow-height dialog body, readonly text and keyboard focus. Prior Equipment Rental and peer Transportation work is preserved. No build/test/lint/browser/database/migration/snapshot/commit/push/deploy or generated packet edit was run.

Phases applied: discovery/frozen producer contract consumed; Phase02 grid/filter/paging/output, Phase03 scalar details/write, Phase04 existing Delete mechanics only, Phase05 guarded route integration, Phase06 bounded source reconciliation. Financial actions, new aggregate children, backend repairs/schema and owner runtime verification are skipped for the stated boundaries. Suggested frontend commit message for this bounded slice: `fix(transportation): align transaction screens with scalar API contracts` (suggestion only).
