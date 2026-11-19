# Billing workspace — frozen read handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Authority: AGENTS, Master2/4/5/7, UI20/6/22/23/24/28, BE3/17. UI shape07 read-only sectioned report; backend pattern5 read service/interface/controller over existing BillingInvoice. Report references: shared ReportPage/ReportActions/DataTable/SummaryCards and Customer Statement source; backend DailyServiceLogReport service/controller + Repository.QueryReport. Existing generic BillingInvoice CRUD remains pattern1 compatibility, not the workspace API.

## API and domain

`GET BillingWorkspace?category=0|1|2`; omit category for All. Numeric enum BillingInvoiceCategory: Subscription0, ChangeRequest1, Project2. Invalid numeric/string values rejected with400 by typed validated filter. `[Authorize]`, root interceptor-equipped HttpClient, no anonymous API or manual token header.

Response `Result<BillingWorkspaceDto>`: `entity={outstandingInvoices:BillingWorkspaceInvoiceDto[], clearedInvoices:BillingWorkspaceInvoiceDto[], outstandingTotal:decimal, outstandingCount:int, clearedCount:int, unclassifiedCount:int}`. Arrays contain the **complete** filtered matching live-tenant dataset, descending Date then Id, no server page cap; local table paging may be used. Totals/counts aggregate on the backend over that same filtered population. Empty success returns empty arrays/zero values. Both declared failure and HTTP failure use one inline presentation owner through X-Skip-Error-Interceptor. Never show partial data after failure.

Row: `id:int, invoiceNo:string, category:BillingInvoiceCategory?, date:DateTime, period:string, description:string, amount:decimal, vat:decimal, totalAmount:decimal, status:InvoiceStatus`. Displayed order: invoiceNo(text), category(translated), date(date), period(text), description(wrapped text), amount(money), vat(money), totalAmount(money), status(translated status); no row actions. Identity is needed for stable rows only. This new read DTO carries no tenant/audit flags.

Groups: Outstanding statuses Open0 and OpenOverAllocated2; Cleared Closed1; Voided3 excluded. OutstandingTotal is stored full TotalAmount sum, not an allocation-based amount due. Signed values preserved. Counts include all matching rows, not the visible local page. Nullable Category uses a translated Unclassified label; All includes old null rows, category-specific filters do not invent mappings.

Entity: add `BillingInvoiceCategory? BillingCategory` separately from InvoiceType. Optional field on existing Add/Update/Detail/ListVM contracts. Add missing means null; Update missing/null preserves saved category via property-only conditional mapping. No UI category edit/action and no field clearing workflow introduced. Enum attributes validate explicit unsupported writes. Shared InvoiceType, status lifecycle, amounts, VAT, legacy APIs and unrelated consumers unchanged. No financial/accounting mutation.

## UI and integration

Keep sidebar Billing as independent item after Corrections with `/BillingInvoice`; default route mounts the replacement workspace. Load All on entry. One labelled category dropdown provides All/Subscription/Change Request/Project; changing selection triggers a fresh read. Refresh retries the applied category. Snapshot/cancel overlapping reads so stale success/failure/finalize does not overwrite current output. Block duplicate busy actions; disable controls while a read is pending. Two full-width section tables stacked, with fixed title/filter/summary and bounded internal rows; no page scroll at any breakpoint. Shared summary shows OutstandingTotal and section counts; one visible translated note describes status/full-invoice-value scope. Loading/empty/error/Retry states retained. No Add/Edit/Delete/Pay/Print/export inferred from screenshot.

Guide: dedicated bilingual `billing` module guide topic linked to `/BillingInvoice`, reader registration and one guide menu entry. Cover type filter, refresh, sections/counts, historical unclassified records, stored values, excluded voids and no settlement/generation/partial-balance calculation. Existing shared screen guidance remains.

## Pre-edit conformance

| Concern | Book / actual reference | Shared owner / target match |
|---|---|---|
| Report shell and filters/actions | UI20; Statement list template, ReportPage/ReportActions public declarations | Reuse container-fill/shared panel/filter/action classes; no private shell palette |
| Sections / tables | UI6/20; DataTable component inputs/types | Two typed complete-array grids, nine columns, no actions, bounded scroll and local paging |
| Totals | UI24; SummaryCard / SummaryCards declarations | Backend values only, typed shared cards |
| Request and states | UI2/22/28; Result, apiErrorMessage, takeUntilDestroyed | Root GET-only workspace service with inline error header, cancellable reads |
| Backend report | BE17; DailyServiceLogReport + QueryReport | Dedicated interface/controller, no tracking, DB aggregation, explicit complete response |
| Historical classification | Master2/BE3 | Nullable new category; no relabel/backfill/shared enum mutation |

Phases applied: PLAN00, discovery0/freeze1, read2, integration5, reconciliation6. Editor3 and actions4 not applicable to read-only screenshot workflow; optional legacy field compatibility stays in backend contract scope. No required financial/accounting decision is implemented: there are no settlement or amount mutations. Owner migration/compiler/runtime/visual acceptance pending.

Implementation sizing clarification (same contract, 2026-10-14): select UI20's already documented complete-document alternative: one keyboard-accessible `sigma-report-table-frame` owns scrolling for both full-width sections; each complete-array DataTable uses fill=false/scrollable=false with local paging and the shared default15/choices10,15,20,50,100. This keeps title/filter/slim summary fixed without squeezing two tables at short heights. Per-table pagers flow inside the document, as the canonical document variant permits. Existing public `--sigma-data-table-min-width:1260px` leaves220px for the description after the eight declared column widths; the shared flow variant releases table overflow so the bounded document frame owns horizontal overflow as well. No feature table-internal CSS, palette, viewport calc or new shared capability.

Guide placement clarification: Billing remains a clickable independent root after Corrections. Its guide is one following independent leaf labelled Billing guide, rather than turning Billing into a group that changes the user's specified direct-link behavior. Header guide link and reader directory share the same `/UserGuide/billing` topic. No duplicate operational route is added.

Owner amendment (2026-10-14): «خلى Billing فيها collapse افضل» supersedes the direct-link and separate-guide-leaf decision. Billing is now one root accordion after Corrections with Invoices → `/BillingInvoice` and Billing guide → `/UserGuide/billing`. Set expanded=true (the existing MenuItem group marker, not forced-open state), omit the parent link, and reuse shared SidebarMenuComponent disclosure/search/keyboard/route/default behavior. No feature-specific collapse control or shared disclosure changes. Billing guide and common EN/AR navigation text match this owner amendment.

Owner amendment (2026-10-14): «خليهم tabs افضل» selects Outstanding/Cleared workspace tabs instead of the stacked document sections. UI20/13 owns this presentation: existing shared EditorTabs with typed section keys, translated labels, backend counts, default Outstanding; changing category resets selection to Outstanding, same-filter Refresh retains selection. Selection is local and makes no API request. Both panels remain mounted under a screen-only inactive class, matched stable panel/tab IDs and keyboard focus; tab captions replace on-screen repeated section headings. The result frame becomes an overflow-hidden shrinking flex boundary, each shared DataTable uses fill=true/scrollable=true and retains its own local paginator; tab selection resets public grid scroll without moving focus. No new print/export action or backend/business/schema change. References read before editing: Customer Statement list template/selectTab/panel styles and shared EditorTabs/DataTable public declarations. Billing guide must describe tab navigation rather than scrolling to the second section.
