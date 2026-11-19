# Legacy Invoice tables — bounded ms-lib removal

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-15 |
| Parent contract | `MS_LIB_REMOVAL_MAINTENANCE_EVOLUTION_PLAN.md` — Frozen |

## Scope and preservation

Owned only the five `Vouchers/Invoices/Invoice/components` folders below. Each changed its existing `.component.ts` and `.component.html`, and gained one `table-row.ts`. SCSS/spec files, shared owners, routes, guides, translations, configuration, services and backend were not edited by this worker. Existing user/peer changes elsewhere were preserved.

| Component folder | Retained ordered table fields / matching presentation model properties |
|---|---|
| equipment-rental-details | masterAgreementNo, deliveryNoteNo, equipmentDetail, customer, startDate, invoicingRule, period, invoiceDate, invoiceNo |
| lease-details | agreement, customer, startDate, invoicingRule, period, invoiceNo |
| limousine-bulk-details | customer, tripNo, pickUpDate, driver, amount, tax, amtAndTax, invoiceNo |
| rental-details | agreement, customer, project, plateNo, rate, startDate, invoicingRule, period, invoiceNo |
| transportation-details | agreement, customer, startDate, period, invoiceNo |

Each presentation model adds only optional stable identity `id` to the fields above. These are local read/display contracts for existing legacy loose rows, not new backend DTOs or generation/write payloads. The earlier InvoiceCreateDTO did not declare several fields already rendered by these tables. Missing historical source values stay blank; no calculation or fabricated value is introduced. Amount/rate cells retain text display, so this removal adds no rounding or accounting change. Root's final frozen conformance amendment selects canonical UI5 shared `type: 'date'` display (`dd/MM/yyyy`) in place of the legacy month-name formatter. Original date values and date-only granularity are preserved; unused feature DatePipe imports/providers/injections are removed, with no query serialization use found in these five components.

Each legacy TableList becomes one direct typed DataTable with its existing local result population. The existing caption's case-insensitive contains search is preserved through a typed local keyword FilterPanel. Search does not send a new API filter or make a request. Existing editor filter forms, keys, dropdown lookups and search/service calls are unchanged. Table paging/sorting remains local to loaded rows; this does not establish that the API returned its complete matching dataset. No full-result export/print claim is made.

Create/update multi-selection remains available through public selectable/selection/selectionChange. Shared page-only select-all remains the owner; selection clears on local filtering, paging/sort offset changes and replacing the result. View-only single selection had no external output/business consumer and the old body did not bind a selectable-row directive, so no row activation is invented. Existing Save, Delete, Cancel, Update modes, destinations and payloads remain owned by their original handlers.

EquipmentRentalDetails now extends the application's existing BaseComponentService. Direct comparison confirmed the used protected loading/router/activatedRoute members exist, with destroyRef remaining locally declared and all subscriptions using takeUntilDestroyed.

## Conformance and verification

| Concern | Owning block / inspected source | Final target match |
|---|---|---|
| Typed grid, local search/paging, selection | UI6; `shared/components/data-table/data-table.component.ts`, `.format.ts`; `shared/utils/list-query.ts`; Workshop/Job list template | Direct DataTableColumn<Row>, same 37 ordered field/header pairs, shared date formatting without feature callbacks, public selectable gate/output, resolveListPaging receives `{first, rows: event.pageSize}`, shared default page size |
| Embedded editor bounds | UI6/13/14; actual five existing editor parents | `fill=false`, `scrollable=true` keeps the shared bounded 288px row viewport without claiming a fill parent; no table/pager/theme CSS added; broader legacy editor shell remains unchanged under this table-only slice |
| Local search presentation | UI4/6; actual FilterPanel declarations | FormGroup-owned keyword field, shared FilterPanel inline actions/reset, reactive teardown; no library or copied wrapper |
| Error/loading/lifetime | UI22/28; BaseService and actual global errorInterceptor | Each request finalizes its existing global loading start; HTTP and declared failures set requestFailed and hide misleading empty feedback; central interceptor remains the only error-dialog owner. Candidate reads cancel their earlier subscription before replacement |
| Integration ownership | Frozen parent plan; Master5/7 | Root owns common guides, route/reachability classification, configuration removal and final reconciliation |

Reviewed complete scoped tracked diffs separately in the actual frontend repository and read the five new presentation models. Programmatic source comparison confirms all original field/header order and existing initForm bodies were retained. Ten TypeScript source files and five Angular templates parse with no diagnostics. Stale library import/selector/type search is empty inside the five owned folders. Source parser and diff checks are not type checking or application compilation.

## Existing limitations and handoff

These five components retain legacy unfinished business: Save sends an empty-string payload, selected rows are not mapped into generation requests, and GetById stores the invoice without populating candidate table data. Those were present before removal and are not fixed or represented as working generation flows by this task. Some routes redirect to newer owners (root handles exact route classification). No new endpoint or generation contract was inferred.

Owner compilation, route/reachability checks and any representative available selection/search/paging behavior remain pending, including Arabic/English, themes and narrow/short layouts. The fixed row viewport belongs to the shared table; this worker does not certify the wider legacy editor shell geometry. Backend, AutoMapper, domain calculations and schema are unchanged; no Add-Migration required. No build, test, lint, browser, DB command, migration, commit, push or deployment was run. Suggested frontend commit is owned by the parent change (`refactor(ui): remove legacy ms-lib dependency`).
