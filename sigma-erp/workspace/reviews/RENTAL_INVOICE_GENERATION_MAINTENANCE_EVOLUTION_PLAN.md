# Rental invoice generation — source review and proposed evolution

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-12 |
| Scope | Rental1.png / Rental2.png, customer-rule and manual consolidation; source-read-only |

## Manifest and boundary

Owner requests review of each invoice type, starting with Rental, and comparison with Odoo/SAP. This artifact records current behavior and a proposed generation workflow; it does not freeze new financial semantics or authorize source changes. Existing invoice/action/editor work and unrelated user changes are preserved. Application repositories: SigmaBackend and SiGmaAngularFrontEnd. No application files changed during this review.

Governance: AGENTS.md; sigma-screen-refactor skill; Master4/5; BE5/18; UI screen catalog. PLAN-00 applies to existing ambiguous generation behavior. Recipe -Check previously in this conversation confirmed all eight packets current. Phases00/01 discovery and proposal only; implementation/reconciliation of a new generator are pending. No subagents: bounded sequential trace.

Proposed UI shape: dedicated routed generation workspace with filters, candidate grid, group preview and fixed Generate footer using shared FilterPanel/DataTable/SummaryCards/PrimaryActionButton. This is a domain workflow, not generic invoice CRUD. Final shape/reference and API/write contracts must be frozen before implementation; do not reuse the current single-item core editor as the batch generator. Existing Core View/Edit remain separate.

## Screenshot evidence

| Evidence | Classification | Meaning |
|---|---|---|
| Rental1/Rental2: As of Date, Customer Type, Customer, Sales Person, Master Agreement No, Agreement No, Agreement Type | Explicit | Candidate discovery filters |
| Customer Rule / Merge Manually radio options | Explicit | Alternative grouping modes |
| Agreement, Customer, Project, Plate No, Rate, Start Date, Invoicing Rule, Period | Explicit | Candidate columns, distinct from saved invoice hub columns |
| Count, Invoices, Generated; Search, Generate, Close | Explicit | Preview/count/generation workflow |
| Header checkbox appears in Customer Rule screenshot | Explicit | Selection affordance; exact selection/group semantics unproven with empty grid |
| Manual screenshot shows Include Fines | Explicit, deferred | Preserve record of requirement; owner previously defers Fines/Darb/Salik, so exclude from current implementation |
| Manual mode lets user assign particular agreements to a group | Reviewer proposal | Empty screenshot does not prove exact interaction |
| As of Date determines unbilled periods | Reviewer proposal | Date-to-period/cutoff rules require agreement billing owner definition |

## Current verified source

| Concern | Evidence | Finding |
|---|---|---|
| Saved company preference | `SiGma.Helpers/Models/Companies/Company.cs:18`, enum `InvoiceGenerationMethods.cs`; Company Add/Update/Detail VMs and CompanyProfiler | Nullable InvoiceGenerationMethods supports only MergeByProject=0 |
| Company UI | `CompanyPartner/components/detalisForm/detail/detail.component.html:33`, TS enum/options, company-form/payload | Invoice Generation option is displayed and transported; zero is a valid method, not missing |
| Billing dates/timing | PartnerBillingInfo.InvoicingRule/LeaseInvoicingRule and InvoicingType/LeaseInvoicingType | Period rules and Advance/Post timing are separate from grouping |
| ClubInvoicingCharges | PartnerBillingInfo plus Company/Individual billing form | Saved flag exists; current Rental generator does not read it. It cannot be assumed to mean merge agreements |
| Customer Rule generation | InvoiceService.BuildInvoicesFromRequestsAsync, lines1013–1076 | CustomerRule requests enter individual path; company method and BillingInfo are not read here |
| Manual generation | Same method | Rental Manual grouped by CustomerId, AgreementNo, ProjectId, Rate, AgreementType, InvoicingRule, Period, PlateNo. Different agreements/vehicles/rates never join even for the same customer/project |
| Manual totals | Same method | Amount summed; first values copied; dates min/max. There are no persisted Rental invoice source lines in Invoice/InvoiceBase |
| Repeat billing | ValidateGenerateInvoicesRequestAsync line971 and GenerateInvoicesCoreAsync | Any existing invoice with AgreementNo blocks new generation; first generation calls MarkInvoiced. Monthly installment billing is not implemented by this invariant |
| Routed Create | invoice.routes.ts + core-editor | /Invoice/rental/create currently points to a single-request form. mergeType defaults CustomerRule with no radio UI; generate([request]) sends a single row. No candidate/group preview workflow |
| Legacy screen | rental-details files | Radio controls exist in legacy unused component; Search loads invoice list, Save uses empty payload. It is not a working candidate generator/reference |
| Current API | IInvoiceService/InvoiceController | GenerateInvoices accepts client dates/rate/amount; scoped interface contains only TaxAdvance candidate read, not Rental candidate preview |

Important: grouping by AgreementNo currently prevents the multi-agreement data loss that would occur if that key were simply removed. Changing only GroupBy is unsafe because header AgreementNo/PlateNo/Rate/Period hold one value. Existing rate/amount inputs also do not implement server-owned agreement pricing for batch generation.

## External primary evidence

- [Odoo19 POS invoice documentation](https://www.odoo.com/documentation/19.0/applications/sales/point_of_sale/receipts_invoices.html): Consolidated Billing creates a customer invoice from selected not-yet-invoiced orders; turning it off produces individual invoices. This is a comparable concept in POS, not proof of a rental feature or customer master grouping setting.
- [Odoo19 official sales source](https://github.com/odoo/odoo/blob/19.0/addons/sale/models/sale_order.py): `_get_invoice_grouping_keys` uses company_id, partner_id, partner_shipping_id, currency_id, fiscal_position_id; `_create_invoices` combines invoice lines and source origins. These are version-specific grouping keys, not a universal rule for Sigma.
- [SAP S/4HANA billing split/convergence](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/ed84b70c199d4470ae2e5ccb93b2e45b/e8ff2732c8bd412a9d52f5b64e75a8f9.html): multiple source documents can converge; differing copied header values force splits, with an individual-document option.
- [SAP collective billing](https://help.sap.com/docs/SAP_CUSTOMER_RELATIONSHIP_MANAGEMENT/4d3bf2e571af41f39c6a85bdecf988a0/4655084c91441ca4e10000000a155369.html?version=7.0.2.21): payer, billing date/type/unit/payment terms are example split criteria and split analysis explains separation. This page is CRM-specific, not a claim all SAP editions have identical settings.

## Recommended scenario (proposal, not current behavior)

1. Search uses As of Date and optional customer/agreement filters to return eligible unbilled Rental source periods. Backend computes dates, rates, amounts and taxes from persisted source and policy; the UI selects identities only.
2. Customer Rule resolves the persisted company's MergeByProject. For customer C with A1/A2 in projectP1 and A3 inP2: two proposed invoices, P1 containing A1/A2 and P2 containing A3. Missing preference conservatively proposes separate source invoices until an explicit default is frozen. Individual customers currently have no corresponding company-level method.
3. Manual grouping lets the operator assign selected eligible items to groups; saved preference is not changed. The same mandatory compatibility checks apply to automatic/manual groups. Selecting everything does not authorize mixing different customers or incompatible financial headers.
4. Preview presents proposed groups, member agreements/vehicles/periods, authoritative totals and split reasons. Counts are eligible source rows, proposed invoice groups and successfully generated documents.
5. Generate re-resolves/reprices/revalidates sources, unbilled periods and grouping under the proper transaction/concurrency guard; duplicate-click/retry must not bill a source period twice. Snapshot/preview staleness must be surfaced.
6. Persist one invoice header per group with source detail lines/links for each agreement/vehicle/period/price/tax treatment. View/print/list/filter and agreement billing status must use those real links. Do not write one arbitrarily chosen agreement into a multi-agreement header.

Compatibility dimensions should be frozen from actual domain owners: tenant/legal company, billed customer, actual billing currency, invoice date/type, billing identity/tax treatment, payment terms, and branch policy if required. These are recommendations, not a declaration that current InvoiceBase stores all those fields. Different rates/plates/agreements belong on lines and need not alone force a split. Tax rates can differ by line if the authoritative tax model supports that; never blindly require the same rate or blindly sum client amounts.

## Alternatives and impact map

| Area | Classification | Proposal/reason |
|---|---|---|
| Company preference | Keep/Extend | Reuse MergeByProject, add separate/other scopes only if approved; preserve enum0 |
| BillingInfo period/timing rules | Keep | Separate schedule/pricing responsibility from consolidation |
| GenerateInvoices public API | Keep for compatibility / Refactor internals | Retain callers; add dedicated source-based Rental workflow rather than trusting batch client totals |
| InvoiceService | Refactor | Focused Rental billing service owns candidates/periods/grouping/generation, existing facade delegates |
| Rental invoice persistence | Extend/Create | Source lines or links required for true multi-agreement invoice and repeat periods; schema migration likely, owner-run only after frozen design |
| Rental Create UI | Replace | Dedicated candidate/generation workspace; keep existing saved View/Edit routes |
| Manual group selection | Create | Explicit group assignment plus server split validation; exact control interaction not proven by images |
| Header/list/print/allocations/reports | Extend | Render all member sources, reconcile totals and preserve financial settlement identity |
| Agreement fully-billed flag | Refactor | Unbilled-period tracking distinct from fully invoiced; contract needed before changing current one-invoice lock |
| Fines/Darb/Salik | Keep deferred | No Include Fines calculation introduced |

Option A: preserve one invoice per agreement, merely batch-create them. Smallest schema impact but cannot satisfy true multi-agreement MergeByProject.
Option B (recommended): invoice header plus preserved source lines, with automatic customer policy and manual grouping using one compatibility engine. Larger but correct foundation for maintenance, printing and recurring periods.
Option C: combine already-issued invoices into one document. Different accounting workflow, not established by generation screenshots; excluded from this proposal.

## Logic ambiguity / contract gate

Confirmed: both grouping modes exist in evidence; company MergeByProject persisted; current CustomerRule does not consume it; current Manual is restrictive; Fines/Darb/Salik deferred.

Pending before implementation: precise period eligibility/pricing and cutoff semantics; null customer policy/default for individuals; whether manual grouping can cross projects; source-line schema and historical single-source compatibility; mandatory header split dimensions; invoice date vs cutoff; recurring invoice uniqueness/fully-billed flag; edit/void behavior for grouped sources. Proposal defaults above are clearly labelled and do not freeze unresolved accounting effects.

No migrations/build/tests/lint/browser/database/commit/push or runtime financial operations performed. Runtime/date/rounding/concurrency/customer-policy validation remains owner-pending. No new compilation risk introduced because this review changes no application source. No commit or Add-Migration is needed for this review artifact; if OptionB is later implemented, report the actual schema delta and suggested migration name then.

## Screen-fit decision — owner asks reviewer to choose the appropriate scenario

2026-10-12: select OptionB as the design recommendation for Rental1/Rental2. This selects the UX/architecture; it does not silently freeze unresolved period pricing or introduce a financial mutation. Application source remains unchanged in this review.

Additional source found in the owning agreement service: `RentalAgreementService.GetRentalAgreementAsync` (line849) and `RentalAgreementController.GetRentalAgreement` (line35) already provide a candidate-like read. Extend the appropriate existing owner/compatibility boundary instead of claiming there is no Rental candidate API or creating a parallel arbitrary search. Earlier statement remains specific to IInvoiceService. Existing candidate method returns nonvoided/uninvoiced agreements, requires a customer for Manual (otherwise silent empty success), applies AsOfDate to agreement start, maps MasterAgreementNo filter to PONo, hardcodes InvoicingRule="Per Rental", sets Rate to sum of charge totals and derives Amount/Tax from TotalCharges-minus-Discount. Agreement.TotalCharges already includes discount/tax in RecalculateTotals, so this projection is not safe authoritative pricing for a new generator. It also has no source-period allocation/history model. These are findings to resolve, not formulas to copy.

| Screen concern | Selected recommendation |
|---|---|
| Layout | Preserve the pictured filters/column order and two grouping modes in a dedicated shared routed generation workspace; saved View/Edit stay separate |
| As of Date | Cutoff for candidate discovery, distinct from each displayed invoice period. Do not assume every period simply ends on this date or equate it to invoice date; timing owner must resolve Advance/Post behavior |
| Customer Rule (default mode) | Allow multiple customers in Search; propose groups by each customer's saved policy. MergeByProject groups by customer plus a real project. Missing policy or missing project proposes separate agreement invoices, with a visible explanation |
| Manual mode | Require one Customer before Search and show validation instead of silent empty success. Keep optional agreement filters. Select eligible rows, use a group action to form one or more proposed invoices; show group members and permit ungrouping before Generate |
| Cross-project manual grouping | Recommend allowing an explicit group within the same billed customer when financial headers are compatible; retain project on each source line. This is a proposal, not current source behavior. Same compatibility engine applies to both modes |
| Cross-customer grouping | Reject; a customer filter/selection is not an accounting compatibility override |
| Group visibility | Add a functional preview/group identity to the candidate presentation through shared table capabilities, preserving all original source columns. Rates/periods remain per source line |
| Count / Invoices / Generated | Label clearly as source items selected for this run / proposed invoice documents / documents actually created. Changing selection/grouping updates preview; successful result supplies generated ids/numbers |
| Generate | Enabled only for nonempty valid preview; revalidate persisted sources and prevent duplicate source-period billing. Editing filters invalidates the preview until Search, not a stale Generate |
| Invoice persistence | One header and preserved source lines. Do not merge already-issued invoices, discard member identities or concatenate agreement numbers as the only relationship |
| Deferred content | Include Fines remains recorded but excluded while Fines/Darb/Salik are deferred |

Architecture recommendation: focused Rental generation service owns eligible source periods, grouping preview and generation, using existing agreement/accounting owners for source pricing and posting. It is used through the existing invoice facade where compatibility requires; no large parallel generic invoice service. Current customers preference is retained. Selected design requires a subsequent concrete schema/API/pricing contract and owner-run migration for actual entity additions; no migration executed or generated now. Recipe -Check rerun: all eight packets current.

## Implemented evolution — supersedes the historical Draft gate

The owner authorized Option B implementation and explicitly approved customer-based Advance/Post timing and saved-contract charge/discount allocation with the contract total preserved. The frozen authority is `RENTAL_INVOICE_GENERATION_API_CONTRACT_FREEZE.md`; the complete final source reconciliation is `RENTAL_INVOICE_GENERATION_FINAL_RECONCILIATION.md`. Historical discovery/proposals above remain evidence of the starting state, not current blockers.

Target slices implemented: authoritative eligible periods; customer-rule and manual grouping; server preview and stale-source guard; atomic invoice/source/JV persistence; compatible facade and old routes; source-aware detail/print/hub filters and contract edit/lifecycle protection; bilingual in-app guide. The existing Invoiced flag keeps its has-an-invoice meaning; persisted period consumption owns remaining billing. Current source status: Implemented — source-only. Owner verification pending: yes. Owner-run `Add-Migration RentalInvoiceSourcePeriods` is required; no migration, build, test, database or browser command was run.
