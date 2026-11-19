# Billing screenshot workspace — maintenance/evolution plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

Owner clarification: menu should open the screen in Billings.jpg, not the legacy list. Existing navigation-only decision is superseded by this screenshot-backed read workspace. No invoice generation, payment, settlement mutation, posting, automatic correction billing or database/build action is authorized.

| Existing owner | Behavior / gap | Classification | Target |
|---|---|---|---|
| BillingInvoice entity, generic CRUD service/controller | Stored invoice/date/period/description/amount/VAT/total/status; no commercial category, allocation or payment link | Keep + Extend | Add nullable independent BillingCategory; preserve shared InvoiceType/document enum and historical records |
| Legacy BillingInvoice list | Copied unrelated columns/actions and broken Create links | Replace | Read-only Billing workspace at the same list destination |
| Existing BillingInvoice detail/write APIs | Generic compatibility clients | Keep | Existing public routes remain; optional category supports new producers without reclassifying missing values |
| Sidebar | Existing independent Billing after Corrections | Keep | Same link/order; add one module guide entry through the same sidebar owner |
| Report/data-table/summary/guide owners | Canonical UI20/6/24 and Master7 | Reuse | No private grid/card/filter palette |

Options: (A) relabel shared InvoiceType values as Subscription/ChangeRequest/Project — rejected, changes accounting semantics across unrelated consumers; (B) infer commercial type from free text — rejected, unreliable and rewrites meaning; (C) nullable dedicated BillingInvoiceCategory plus tenant-scoped read workspace — selected, smallest correct addition, historical null remains unclassified; (D) new parallel invoice/payment domain — rejected, screenshot does not establish it.

Reviewer decisions under Master2 rule6: Category values Subscription0/ChangeRequest1/Project2, nullable on existing rows; default filter All so historical null remains visible; Open0 and OpenOverAllocated2 form Outstanding, Closed1 forms Cleared, Voided3 excluded. These are stored status groups, not new settlement rules. Outstanding total is the signed sum of stored TotalAmount for open groups across the filtered dataset; no partial-payment remaining amount is inferred. Display a translated note clarifying this limit. Amount/VAT/TotalAmount remain stored authoritative values with no new formula or writes. These choices introduce no financial transaction or accounting effect.

Source evidence: BillingInvoice, InvoiceType/InvoiceStatus enums, BillingInvoiceListVM, generic service/controller, QueryReport tenant/live-row behavior, screenshot sections/columns/categories. B1 English/LTR empty wide screen; capture date/version/role Unknown. Explicit: both sections, nine columns, type choices, refresh, outstanding total. Strong inference: service/subscription commercial purpose. Uncertain and excluded: generation, pay button, partial allocations, currency conversion, automatic correction charge.

Impact: additive nullable column/optional category contracts; new read endpoint and DI binding; same frontend route/menu destination, replacement list, bilingual guide/keys. Existing generic CRUD remains compatible. Owner migration `AddBillingInvoiceCategory` adds nullable field, no default/backfill. Frontend/backend rollout follows reviewed migration; no migrations/snapshots are edited/run. Existing unclassified rows are visible under All only until a legitimate producer classifies them.

Implementation slices: freeze domain/read API first; root implements backend read + optional category compatibility; one bounded frontend agent implements screenshot workspace over frozen API in exclusive files; root integrates menu/guide/DI, full scoped diff and final report. No build/test/lint/DB/commit/push/deploy. Browser inspection of sidebar was authorized but unavailable; no live business mutation is authorized.

Verification: query tenancy/live rows, category/status zero handling, database aggregate scope, complete-row projection, all-size internal scroll, cancellation/failure/loading states, bilingual labels, guide, route/menu, compatibility and source diffs. Owner acceptance covers migration/compiler/API/visual behavior.
