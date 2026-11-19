# Sales pilot — authored guide content

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Sales guide content only: nine lifecycle stages, four existing menu topics and six FAQs |
| Contract | USER_GUIDE_MAINTENANCE_EVOLUTION_PLAN.md, Frozen Sales-only amendment and current GuideSection/GuideStep/GuideTopic/GuideQuestion model |
| Source file | F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/sales-guide.ts |

## Authority and content decision

Read the full canonical AGENTS.md, required sigma-screen-refactor skill entry/invariants and translation/verification sections, UI23 translation ownership, UI29 source-only acceptance and UI30 known translation/authorization backlog. Root owns the recipe check, reader/reference conformance, integration and final acceptance. This isolated writer owns no rendering, routing, vocabulary or business code. The frozen contract distinguishes authored bilingual document text from translated UI chrome; every authored text property has explicit English and Arabic values. Existing navigation keys remain identity only. No HTML, tax example, new permission, accounting policy or financial formula is added.

The existing SALES_CLIENT_WALKTHROUGH_AR.md and SALES_2026_10_08_FEATURE_REVIEW.md supplied narrative context. Claims below were cross-checked against the current scoped source, rather than copying the narrative as independent authority.

## Menu-topic identity and evidence

Paths below are relative to the named actual repository roots. All four topics are available and retain USER_GUIDE_MENU_INVENTORY.json identities and order.

| Topic identity / route | Frontend source read | Directly owning backend source read | Supported content |
|---|---|---|---|
| sideMenu.saless.fleet / /Fleet | Sales/Fleet/fleet.routes.ts; components/list/list.component.ts; components/details/details.component.html | SiGma.Business/Services/SalesAgreementService.cs PrepareAsync, InvoiceCoreAsync | Active-first filtering, plate/chassis/model/status and advanced filters; year/purchase information, documents/warranties; agreement selection requires active available model/chassis and no open rental; invoice requires positive purchase cost |
| sideMenu.saless.salesQuotation / /SalesQuotation | Sales/SalesQuotation/salesquotation.routes.ts; components/list/list.component.ts actions/openAgreement/openReceipt; components/details/details.component.ts; models/quotation-state.ts | SiGma.Business/Services/SalesQuotationService.cs ApplyItemTaxAsync, InternallyApproveAsync, CustomerApproveAsync, ReviseAsync, UnapproveCoreAsync, receipt preparation; SalesAgreementService.cs PrepareAsync | Model/quantity-based offer; separate internal/customer approval; expiry; reason-based rejection; revise/unapprove gates; receipt preparation does not collect; linked agreement prices/quantities/terms and stored rate; customer-rejected current list has no revise/edit/delete |
| sideMenu.saless.saleAgreements / /SalesAgreement | Sales/SalesAgreement/salesagreement.routes.ts; components/list/list.component.ts; components/details/details.component.ts; components/action-dialog/action-dialog.component.ts; models/agreement-state.ts | SiGma.Business/Services/SalesAgreementService.cs AddCoreAsync, PrepareAsync, UpdateCoreAsync, InvoiceCoreAsync, DeliverCoreAsync, CloseCoreAsync, Allocate, LiveReceiptsOf; VouchersServices/ReceiptService.cs ResolveSalesAgreementAsync, ReopenClosedAgreementAsync | Direct or quoted contract; actual unit reservation; due dates/cheques/banks/documents; receipt-derived balance including linked quote; outstanding cap; down-payment-first allocation; financial lock; accounting setup/period; invoice and delivery date boundaries; zero-balance post-delivery closure |
| sideMenu.saless.dueInstallments / /DueInstallments | Sales/DueInstallments/due-installments.routes.ts; components/list/list.component.ts and .html | SiGma.Business/Services/SalesAgreementService.cs GetDueInstallmentsAsync | Required due-date range, optional customer/agreement, current-month and unsettled default; amounts/status/overdue/cheque/bank columns; complete filtered totals; all-page print/Excel; new collection takes place from Agreement, not report |

Frontend root: F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules. Backend root: F:/My Work/Sigma/SigmaBackend.

## Lifecycle and FAQ evidence

| Content | Current source symbol / constraint |
|---|---|
| Stages1–4 fleet → offer → approvals → contract | PrepareAsync validates fleet/quotation; quotation approval functions and UI visibility; AddCoreAsync marks Open/Reserved and linked quotation Converted |
| Stage5 collection and FAQ agreed-versus-paid | ResolveSalesAgreementAsync compares amount with TotalCharges minus live receipts, including quotation-linked receipt; receipt preparation returns readiness only; no payment implied by schedule/cheque fields |
| Stage6 invoice and FAQ invoice-versus-receipt | InvoiceCoreAsync resolves account mappings and open period, writes sales invoice and posted JV, sets Invoiced/Sold/IsActive=false; paid balance separately comes from LiveReceiptsOf |
| Stage7 delivery and FAQ delivery-before-full-payment | DeliverCoreAsync requires Invoiced and valid invoice/posting/unit state, creates one SalesDeliveryNote per unit and sets Delivered; it contains no zero-balance condition |
| Stage8 due follow-up | GetDueInstallmentsAsync aggregates allocation over complete agreement schedule before date filtering; totals before paging; frontend output fetchAllPages uses appliedQuery |
| Stage9 and FAQ closure | CloseCoreAsync requires Delivered and no outstanding amount; UI canCloseAgreement requires Delivered and outstandingAmount===0; ReopenClosedAgreementAsync returns Closed to Delivered when void/reduction exposes a balance |
| FAQ direct agreement | PrepareAsync branches between linked-quotation terms and direct customer/prices; route provides create without quotation |
| FAQ cancellation | CancelCoreAsync requires Open, records reason and releases units. HasAgreementReceiptsAsync checks live receipts linked directly to SalesAgreementId; do not incorrectly extend this cancellation gate to all quotation receipts. Invoice state has no Cancel UI action. |

## Source-only verification and handoff

Content is static and makes no API calls or state changes. Four topic identities/routes exactly match the frozen Sales menu inventory. Nine GuideStep entries provide title, description and Bootstrap icon; six GuideQuestion entries provide question/answer; every authored document string is bilingual. Root integrates imports and shared UI chrome and performs the full frontend diff/source reconciliation. No existing business files, models, vocabulary or routes were modified by this writer.

Writer checks: TypeScript AST parse returned zero syntax diagnostics; literal-data inspection verified9 stages,4 exact ordered menu identities,6 FAQs and70 nonempty bilingual text pairs. The complete new authored source was inspected, and scoped git diff --no-index --check reported no whitespace defects. These checks are source-only and do not imply TypeScript type checking.

No build, tests, lint, browser/application verification, database commands, migrations, snapshots, commits, pushes, deployment, Graphify or Sigma MCP were run. Source parsing/diff checks do not certify compilation or business runtime. Owner checks should cover reading all three guide tabs in English/Arabic and comparing a demo sale against the documented lifecycle, receipt cap and post-delivery closure. There are no unresolved material content decisions; the known cancellation receipt distinction and stored quotation tax rate are preserved explicitly.

Suggested frontend commit, by owner only: feat(sales): add bilingual sales workflow guide.
