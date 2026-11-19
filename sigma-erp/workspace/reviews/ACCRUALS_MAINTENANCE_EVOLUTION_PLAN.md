# Accruals — maintenance / evolution plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |
| Scope | New rental revenue-accrual screen from three supplied screenshots; source discovery and requested comparable-system research |
| Tier | L — new persisted financial feature |
| Implementation authorization | Owner's «كمل» approves the concrete draft/approval/paired-reversal proposal; initial decision history is retained below |
| Current handoff | Frozen domain/API handoff; implementation and source-only reconciliation in ACCRUALS_FULL_STACK_REVIEW.md |

## Request and decision history

**Amendment2026-10-25:** Owner replied «كمل» after the concrete financial proposal and approval question. The proposed draft/approval/paired-next-month-reversal workflow is approved. [Frozen handoff](ACCRUALS_DOMAIN_API_CONTRACT_FREEZE.md) resolves source-supported implementation details and explicitly excludes guessed charge attribution; initial discovery/blocker narrative below is retained as historical evidence.

- Owner: «انشئ الشاشة واتبع الوثائق» with Accurals.PNG, Accurals2.PNG and Accurals1.PNG.
- Asked what Save should do: save a monthly review snapshot or draft followed by approval/posting/reversal.
- Owner: «انا مش عارف ايه وظيفة الشاشة اوى».
- Explained the apparent purpose; offered a saved review-only snapshot.
- Owner: «شوف المتبع فى الانظمة الشبيهة». This authorizes research; it does not itself choose either accounting treatment or approve posting effects.
- Current recommendation: Prepare → saved Pending draft → explicit Approve creates month-end unbilled-revenue accounting and a linked next-period reversal. This is a proposal, not a frozen policy.

## Authority and navigation

Read workspace AGENTS.md, sigma-screen-refactor/SKILL.md, documentation README, Master1–5 and7 relevant discovery/contract/performance/handoff sections, UI screen catalog and types05/07/08, backend pattern index, BE2 index evidence and BE17 read-model guidance; inspected actual source owners below. Recipe generator `-Check` returned OK for PLAN-00 and all seven phase packets on2026-10-25. PLAN-00 used for this unresolved new capability. No generated files edited and no regeneration needed.

Proposed accounting option selects UI type08 (financial document; header/month, derived lines, totals and journal), not a CRUD modal or plain report. Approved shell reference: Workshop/Job/components/editor; backend pattern3 reference: InvoiceService, with its historical Save-posting behavior explicitly not copied. If owner chooses snapshot-only, select type02 + backend pattern2 instead. Final shape and exact reference conformance must be frozen before implementation. No subagents used: shared accounting/read contracts are unresolved, so the delegation gate is not met.

## Functional evidence

All screenshots are desktop English/LTR. Capture date, role, product version and provenance are Unknown. They are functional evidence, not layout authority. Request dated2026-10-25 approves their Explicit items.

### Evidence E1 — Accurals.PNG

| Evidence | Classification | Required behavior | Phase | Representation |
|---|---|---|---|---|
| Month, shown2026-10 | Explicit | Monthly context | 1/2 | Shared month control; proposed yyyy-MM contract |
| Prepare | Explicit | Calculate/display candidates | 1/2 | Read operation; no persistence inferred |
| Export to Excel | Explicit | Export the prepared dataset | 2 | Shared export owner; same applied context |
| Agreement No, Start Date, End Date, Status, Charges Type, Accrual | Explicit | Preserve six displayed business fields | 1/2 | Typed shared table; Actions first under canonical convention |
| Question-mark row action | Explicit, meaning corroborated by E3 | Inspect calculation | 2/3 | Shared read-only dialog |
| Open status and blank end dates | Explicit captured values | Represent live contract state and optional actual end | 1/2 | Distinguish scheduled return from actual close; do not label scheduled return as actual end without evidence |

### Evidence E2 — Accurals2.PNG

| Evidence | Classification | Required behavior | Phase | Representation |
|---|---|---|---|---|
| Save | Explicit existence; effect Uncertain | Persist or post the prepared result | 1/3/4 | Await owner decision; image does not prove journal creation |
| Same agreement repeated for Rent/GPS/BabySeat/DriverCharges | Explicit | Charge-level rows, not only agreement totals | 1/2 | Requires historical charge attribution |
| Negative accrual (-19.00) | Explicit | Signed output can occur | 1/2 | Do not clamp to zero; accounting handling needs frozen policy |

### Evidence E3 — Accurals1.PNG

| Evidence | Classification | Required behavior | Phase | Representation |
|---|---|---|---|---|
| Calculation Detail; Estimated300; Already Invoiced0; Accrual Reversal0; final300 | Explicit | Explain each component | 1/2/3 | Backend-derived detail and translated labels |
| Estimated - Already Invoiced - Accrual Reversal | Explicit text; scope/sign semantics Uncertain | Reconcile calculation operands | 1 | Cannot combine blindly with full next-month reversal: a second subtraction may double-count |
| OK | Explicit | Close read-only detail | 3 | Shared dialog close; no mutation |

## Existing-state inventory and impact map

Paths below are relative to the applicable repository under F:/My Work/Sigma.

| Area | Actual owner/evidence | Current behavior / gap | Classification | Impact / phase |
|---|---|---|---|---|
| Navigation | Frontend src/app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts, accruals item | Currently links to /Bill, a different feature; pages/routing.ts has no Accruals route | Replace target link; Extend routing | Route must point to real implemented component, not a placeholder; phase5 |
| Rental source | Backend SiGma.Helpers/Models/Agreements/{Agreement.cs,Rentals/RentalAgreement.cs}; Models/BookingCharge.cs | Saved selected charge rates/totals, interval, close/void/complimentary state | Keep; read through new owner | Preserve tenant, history and contract prices; phases1/2 |
| Rental invoice pricing | SiGma.Business/Services/VouchersServices/RentalInvoiceSourceService.cs | Due invoice periods from saved charge totals; recurring vs one-off distinction; discounts; excludes deferred fines/tolls;1000agreement/10000period bounds | Keep existing behavior | Reuse verified concepts, not the unbilled-only result as total earned revenue; accruals must still account for already invoiced contracts |
| Historical invoices | SiGma.Helpers/Models/Vouchers/{Invoice.cs,InvoiceBase.cs,RentalInvoiceItem.cs}; RentalInvoiceGenerationService.BuildInvoice | One historical net amount per contract period; no charge-type/BookingCharge breakdown on RentalInvoiceItem | Extend only after contract freeze | New charge snapshots/provenance may be required; old amounts must not be guessed/backfilled from mutable current charges; phases1/3 |
| Accounting | InvoiceAccountingService; JournalVoucherResolver; LinkAccounts | Existing invoice revenue/customer/VAT journal pipeline; not a rental accrual/reversal lifecycle | Keep existing; Create accrual owner | Separate earned-unbilled accounting from invoicing and customer payments; phases1/4 |
| Accrual history | No dedicated rental Accruals entity/service/controller discovered in scoped sources | No monthly snapshot, source reconciliation or prior accrual reversal linkage | Create | Needs persisted root/lines and concurrency/idempotency rules; owner-run migration only |
| UI shared owners | Catalog type08, FeatureTitle/DataTable/EditorDialog/StateMessage/shared loading, translation and export owners | Suitable existing owners; exact contracts to inspect before implementation | Keep/adopt | No feature palette, wrappers or alternative progress host |
| User guide | Existing UserGuide module; sidebar /UserGuide/vouchers-journals | Accrual topic required after implementation | Extend | Explain final calculation, actions, exclusions and financial effects bilingually; Master7 gate |

Existing working trees contain extensive unrelated modifications, including routing, vocabularies, accounting, Amortization, shared loading and migrations/snapshot. None were changed, reverted, normalized or attributed to this task. Full status inspected independently in both repositories; workspace root is not a Git repository. Reference modules remain read-only.

## Comparable systems — primary sources, accessed2026-10-25

| Source | Verified behavior | Limit of evidence |
|---|---|---|
| [InTempo equipment-rental accounting](https://www.intemposoftware.com/blog/accounting-equipment-rental-business) | Earned-not-billed reporting and month/year-end accrual processing that creates GL batches | Vendor overview; does not establish exact Save behavior of the supplied screenshots |
| [Oracle PeopleSoft: Using Unbilled Revenue Accrual](https://docs.oracle.com/cd/E13228_01/fscm9pbr0/eng/psbooks/sbil/htm/sbil22.htm) | Uninvoiced activity can be accrued in the current period; journal generation/posts are separate; linked automatic reversal in the next period prevents revenue duplication | Older documented product version; supports a concrete design option, not a universal requirement |
| [Oracle Fusion: Receivables accrual entries](https://docs.oracle.com/en/cloud/saas/financials/25d/faofc/receivables-accrual-accounting-entries.html) | Arrears example debits unbilled receivables/credits revenue before invoicing, then clears unbilled on invoicing | Alternative to periodic auto-reversal; not to be combined indiscriminately with it |
| [Microsoft Dynamics365: Unbilled revenue](https://learn.microsoft.com/en-us/dynamics365/finance/accounts-receivable/sb-unbilled-revenue) | Configurable unbilled/offset accounts, explicit journal creation, and subsequent invoice processing | Whole-schedule/deferral model differs from this monthly earned-unbilled screenshot |

No public authoritative explanation of the pictured Speed-style Save action was found. No external application login, browser automation or data mutation was performed. Do not claim reproduction of that system's hidden accounting behavior.

## Options and proposed decision

| Option | Behavior | Trade-off | Disposition |
|---|---|---|---|
| Review-only snapshot | Prepare, inspect, export, save monthly evidence; no ledger impact | Useful report, but does not perform accounting month-end accrual | Offered; not approved or rejected explicitly |
| Period-end accrual with next-period reversal | Prepare, save Pending draft; separate approval posts earned-unbilled at month end and creates a linked reversal for the next period | Fits documented month-end pattern; requires account mapping, exact periods, duplicate/concurrency and provenance guards | Recommended for owner approval |
| Clear accrual directly when invoiced | Persist earned-unbilled and reduce it through invoice-linked accounting | Also documented, but changes the invoice posting chain and correction lifecycle more broadly | Alternative; not recommended as the first scope |

Proposed monthly illustration: an October-only rental service earned300, invoiced0. Approve an October31 accrual: debit accrued/unbilled revenue asset300, credit rental revenue300. A linked November1 reversal debits rental revenue300 and credits that asset300. A later invoice follows the existing invoice accounting flow; the reversal prevents counting the same300 again. Example assumes a single currency, no tax or other charges; it is a design illustration, not an approved posting instruction. Scheduled accrual reversal is distinct from cancellation/Void; Sigma's flag-only Void policy is retained.

## Contract/ambiguity register — not frozen

| Decision | Status | Proposed resolution / required evidence |
|---|---|---|
| Snapshot-only vs accounting document | Missing owner decision | Approve or reject the recommended financial workflow; original create request and research request do not settle accounting effects |
| Prepare/Save/Approve | Proposed | Prepare reads; Save persists a Pending draft only; Approve owns accounting. No posting during Prepare or ordinary Save |
| Month, lines, numbers | Proposed | yyyy-MM context; immutable server-derived amounts; input DTO cannot accept estimated/invoiced/reversal/accrual totals |
| Earned cutoff and charge pricing | Uncertain | Design cumulative earned-to-cutoff from actual saved service intervals and charge rules, not entire contract total. Freeze recurring/one-off eligibility, actual closed dates, discounts and rounding with source evidence |
| Invoiced attribution by charge | Missing history | Existing RentalInvoiceItem cannot prove charge breakdown. Preserve as unresolved/excluded with visible reason unless immutable source attribution exists; never invent zeros or proportional historical amounts |
| Prior accrual/reversal operand | Missing | Define signed ledger-effective opening balance and its link to the chosen method. Existing auto-reversed prior entries are not subtracted twice |
| Negative result | Uncertain accounting effect | Preserve signed display; freeze overbilling/deferred-revenue treatment before posting a negative amount |
| Account mapping | Missing | Explicit posting-eligible unbilled asset mapping plus verified revenue source mapping; never substitute customer control account or auto-select accounts by name |
| Tax, currency, historical eligibility | Uncertain | Do not copy invoice tax or mix currencies by arithmetic; freeze supported scope; visible exclusions for legacy/unsupported records |
| Reversal timing | Proposed | First day of following month, linked to original; fiscal-open checks for both dates, atomic failure when either cannot post; exact implementation awaits accounting approval/source verification |
| Idempotency/concurrency | Proposed | One effective approved monthly scope, source fingerprint revalidation, no duplicate posting on retry; immutable approved history |
| Other lifecycle actions | Pending | Freeze Approve/UnApprove/Reject/Void eligibility and full dependency/period/log history; no buttons based on guessed state |
| Permissions | Confirmed platform boundary | Authentication exists; no invented permission API or claim that hidden UI is secured |

### Candidate column contract

These names are proposed only. No endpoint or VM currently supplies the screen.

| Grid display/action | Candidate frontend / backend field | Source / status | Transform | Column filter/sort/export |
|---|---|---|---|---|
| Actions first | stable line identity | New accrual line, pending | Calculation detail action | No filter/export; action only |
| Agreement No | agreementNo / AgreementNo | Agreement.No, Confirmed source | Text | To freeze; export business value proposed |
| Start Date | startDate / StartDate | Agreement.DateAndTime, Confirmed source | Shared datetime | To freeze |
| End Date | endDate / EndDate | Actual closed endpoint needs trace; scheduled ReturnDateAndTime alone insufficient | Optional datetime | To freeze |
| Status | status / Status | IsClosed/IsVoided real states, derivation to freeze | Translated status | To freeze |
| Charges Type | chargeType / ChargeType | BookingCharge.ChargeType exists; invoice-history attribution Missing | Shared translated enum | To freeze |
| Accrual | accrual / Accrual | New server-derived signed result, pending calculation contract | Policy-driven currency | To freeze |

## Loading, cache and performance gates

No Accruals route/request is implemented yet; therefore no adoption or performance pass is claimed.

- Planned Prepare/saved-month/detail/export/save/approve reads and writes use UI22's global page progress owner, with subscribed start and finalize release on all result/error/cancel/destroy paths. Calculation details should use the already prepared immutable row and avoid an extra per-row request; a necessary read behind a body-appended dialog instead uses its one shared local StateMessage. Busy/disabled/aria-busy, retained errors and Retry remain. Final tracing must include actual showPageLoading metadata, shell host and query-only navigation behavior.
- Monthly operational results, source fingerprints, invoice attribution and journal state remain direct operational reads, not reference cache entries. Reference lookups such as mapping/account/context sources must be individually inventoried by actual URL/service and eligibility before implementation; no list of guessed URLs or blanket cache exemption. UI2 bootstrap/watch/invalidation/tenant/context/failure/teardown reconciliation remains required for any eligible adopted source.
- Existing invoice source materializes bounded agreements with charge/customer/vehicle/project navigations and then bounded consumed periods; it is not an accrual endpoint. A new accrual read must project only consumed scalars, batch invoice/charge/history reads and avoid per-agreement queries or parallel EF on one DbContext. Do not call invoice candidate reads once per agreement or calculate earned revenue only from unbilled candidates.
- Existing RentalInvoiceItemConfig declares unique active (SubscriptionId,RentalAgreementId,FromDate,ToDate). Agreement/RentalAgreement and InvoiceBase/Invoice use base/derived table mappings; a cross-table composite index cannot be proposed as though these were one physical table. Exact accrual predicates, posted/voided invoice states and cutoff query are not frozen, so no new source index is justified at this stage. Re-evaluate actual join/range/order coverage, include/filter/null-live semantics and write/storage costs when the query is concrete; deployed plans/indexes remain Unknown.
- No timing measurements exist. Owner acceptance after implementation: fixed tenant/branch/month and representative small/large/legacy data; cold/warm Prepare, saved-month reopen, details, export and repeated approval attempts; record request count/payload/SQL commands/reads/plan and p50/p95 timing under comparable conditions. No measured speed claim follows source call counts.

## Implementation sequence after the decision

1. Freeze the chosen plan and consumed domain/API/accounting contracts, including the above source gaps; do not delegate before then.
2. Phase1: entities/configurations/typed DTOs/service/controller and historical provenance design. No guessed legacy backfill. Report owner-run migration, never create it.
3. Phases2/3: typed monthly workspace, shared controls/table/dialog, complete export scope, snapshot read/write, dirty recovery, matching English/Arabic keys.
4. Conditional phase4: approved model-owned accounting/actions, linked reversal, periods, history, idempotency and concurrency. Snapshot-only option skips financial actions.
5. Phase5: dedicated route and corrected menu target, root client/interceptors, cancellation/loading/cache source gates. Do not leave a live route pointing at an unfinished workflow.
6. Write the bilingual Accruals topic in the existing vouchers-journals guide; reconcile final source and scoped diff per repository; complete phase6.

## Discovery-stage handoff (historical; superseded by the approved amendment)

Discovery and comparable-system research are complete for this decision. Creation remains blocked on financial workflow approval; no screen/API implementation is claimed. No application source, configuration, entity, generated packet, migration or model snapshot was changed. Therefore no migration or application commit is currently required. Future schema names/commit messages must reflect the frozen implementation, not be presented as already necessary. Suggested documentation commit only: `docs(accruals): record discovery and accounting options` (owner only).

No builds, tests, lint, database commands, migrations, browser automation, commits, pushes or deployment were run. No external credentials/data were accessed. Runtime, schema, source conformance of future code, accounting validation and timing remain pending. No reusable new implementation guidance was established, so no canonical book/skill promotion or packet regeneration was needed.
