# Job — Invoice on Customer

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Scope | Add the screenshot-backed Invoice on Customer action to Workshop/Job |
| Authority | Sigma AGENTS; Master 1–5,7; UI screen 08 and blocks 1,7,13,14,16,17,19,22–29; backend 3,5,6,8,15 |
| Packet check | Generate-SigmaRecipes.ps1 -Check: all packets OK |

## Requested outcome and evidence

The user requested: «اضافة action فى action button والصورة مرجع ليك زى ما احنا ماشيين فى المشروع». Evidence E1 is `C:/Users/user/Desktop/321.PNG`, a customer invoice input surface identified by job number. It proves the action, date/time, fixed customer, details, editable charge/vehicle/description/amount rows, tax and gross previews, Add Row, remove, amount in words and Close/Save. It does not prove another accounting policy, multiple invoicing, permission, insurance billing or a Job closing transition.

Tier M, narrowly extending an existing action. This scoped plan is required because Job delegates to the existing financial-document service. No new accounting capability or schema is introduced.

## Existing-state inventory and impact map

| Owner | Current behavior | Target / consumers | Decision |
|---|---|---|---|
| Job list/actions | View, Edit, Labour Time, Close, Delete; no standalone invoice action | Job rows only; retain mixed-source paging and filters | Extend |
| JobService.GetClosingAsync | Job/customer/vehicle, grouped charges, settings rate, HasInvoice | Existing Close dialog and new invoice editor; add displayed customer code | Keep/Extend |
| JobService.CloseAsync / RaiseWorkshopInvoiceAsync | Creates Workshop MiscellaneousInvoice when none exists, then closes Job | Extract/reuse the existing invoice creation result for a standalone action | Extend; retain Close semantics |
| MiscellaneousInvoiceService.AddAsync | Creates invoice and posted journal across multiple saves in one transaction | New action and Close; reuse outer transaction when caller owns it | Extend transaction participation |
| UnitOfWork.ExecuteUniqueWriteAsync | Authenticated tenant/entity exclusive lock; commits only successful owned writes | Serialize participating Job invoice/close workflows; duplicate recheck inside boundary | Reuse |
| MiscellaneousInvoiceService.PriceChargesAsync | Settings rates, amounts rounded; tax currently rounded per line | Workshop-linked invoices adopt decided D4-4 allocation; other voucher reviews remain separate | Scoped Refactor |
| InvoiceBase.JobNo / existing maps | Existing link and Module=Workshop; no new entity | Existing invoice list, accounting and Close HasInvoice consumer | Keep |

Existing user changes: many unrelated frontend/backend changes; translations, GeneralMessage resources and MiscellaneousInvoiceService already modified. Preserve them, patch only the scoped sections, and review task changes separately from baseline. No Job source changes existed at discovery.

## Options and decisions

| Option | Decision / reason |
|---|---|
| Run Close Job to create invoice | Rejected: standalone invoicing must not change Job.Status or ClosedAt |
| Create another invoice entity/service | Rejected: approved C3–C5 in JOB_ACTIONS_FEATURE_REVIEW already own the document and journal |
| Copy the screenshot modal | Rejected: UI13 D4-2 sends invoices with totals/posting to a routed page |
| Route to unrelated generic invoice with client-selected job/customer | Rejected: the backend must derive the customer, module and JobNo from the selected job |
| New invoice action with existing typed lines and existing posting owner | Selected: smallest complete vertical slice |

Accounting/posting are Confirmed by the owner-approved C3–C5 decisions (2026-09-29); VAT document rounding is Confirmed by D4-4 (2026-10-01). No new accounting decision is taken. Reviewer decisions under the owner's standing rule: action limited to open ordinary Jobs without an invoice; default lines are existing nonzero workshop charge groups, vehicle is the job vehicle, date/time is now, details identify the job. Arbitrary or negative charges are refused. There is no permission mechanism beyond AuthGuard/[Authorize]; invoice issuance is an authorization candidate, not a newly invented policy.

## Target contract / migration

The frozen API/action handoff is recorded in `JOB_INVOICE_CUSTOMER_ACTION_CONTRACT_FREEZE.md`. Existing DTO inputs and mapping are reused. A new grid HasInvoice property is action state only and assigned on both UNION projections. CustomerCode is response-only. No persisted fields, EF configuration, migrations, snapshots, backfill, historical journals or numbering rules change. Owner-run schema migrations already mentioned by earlier Job tasks remain independent.

## Implementation and verification

1. Phase 0/1: evidence and frozen handoff.
2. Phase 2 consumer: add the source-aware row action and HasInvoice visibility without changing columns/filters.
3. Phase 3: routed typed invoice form, shared fields/table/summary, settings-rate tax, dirty discard, busy guards, retained failed draft and list-query restoration.
4. Phase 4: authenticated invoice endpoint and duplicate/state/tenant/FK validation; existing multi-save transaction and journal policy.
5. Phase 5: route and root service wiring.
6. Phase 6: complete scoped diffs, source contract/conformance checks and touched translation parity. Builds/tests/lint/runtime/browser/database remain owner-pending.

Owner acceptance: issue one open Job invoice, check rows and totals against its posted journal; job stays open; action disappears; Close then uses the close-only path; repeated/concurrent create or create-versus-close does not duplicate documents; invalid/cross-tenant references and unconfigured accounts fail without partial save; dirty cancel, failed save/retry, list return state, Arabic, dark theme, narrow viewport, keyboard and fixed totals/footer.

## Pre-edit reference conformance

| Concern | Book | Actual reference / shared owner | Target |
|---|---|---|---|
| Routed invoice shell | UI1/13 | Job editor HTML: sigma-route-host → sigma-editor-page/panel/form/body, footer outside form | Same bounded chain; no height calculation |
| Row controls and mutation | UI14/19 | Job editor EditableRows; shared editable table and field-error | Same helper/row binding and fixed shared column widths |
| State/summary | UI22/24 | StateMessageComponent and SummaryCardsComponent public inputs | Shared state; compact money cards, no feature palette |
| Backend journal | BE15 | InvoiceService / MiscellaneousInvoiceService.AddJournalLines | Existing customer Dr, charges/VAT Cr; server amount/rate/tax |
| Duplicate / transaction | BE8/15 | UnitOfWork.ExecuteUniqueWriteAsync and MiscellaneousInvoiceService.AddAsync | Shared Job lock; repeated invoice read inside lock; one owning transaction |

Final compared consumer/producer symbols and acceptance limits will be reconciled in the feature review. No generated packet is edited.
