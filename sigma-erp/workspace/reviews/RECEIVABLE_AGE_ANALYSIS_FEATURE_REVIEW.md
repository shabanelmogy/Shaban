# Customer Receivable Age Analysis — Feature Review

## Owner follow-up: filter row spacing and card accents — 2026-10-03

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner requests more space between ReceivableAgeAnalysis rows and different colors for neighboring cards. |
| Scope | Existing report filter-form row gap and seven aging-period SummaryCard accents only. |

Before-edit conformance/frozen choices: UI20 TrialBalance report template and actual shared sigma-report-filter-panel own the report filter strip (current gap5px/8px). Increase only this form's vertical spacing to1rem using the existing row-gap-4 utility; keep horizontal gap, fields/order, controls and responsive wrapping. UI24/25 actual SummaryCard model/shared SCSS and Dashboard app-summary-cards reference own the cards. The existing seven period cards all use info; map stable p1…p7 IDs to primary/info/success/warning/credit/neutral/danger through a typed accent record. Preserve the first five financial card accents and all twelve IDs/labels/backend totals/money formatting/order, dense/row/min140/max180 and12px host-to-grid separation. Colors are presentation only, independent of values; no new palette or shared-card CSS.

All eight recipe checks passed before PHASE02. Focused presentation and source reconciliation only; no backend/API/grid/DTO/calculation/route/schema/migration/translation change. No screenshot or unresolved business decision. The two target files were clean before this follow-up; unrelated dirty frontend changes remain outside scope. Root handles this small coupled change without subagents. Build/test/lint/browser/runtime/database/migrations/commits/push/deployment remain prohibited. No reusable guidance is established: this is a feature-specific choice through existing public capabilities.

Final source reconciliation: list.component.html adds row-gap-4 only to the existing report filter form. The installed Bootstrap row-gap utility and src/assets/css/style.rtl.css define1rem!important, overriding the shared5px row gap while preserving8px horizontal spacing. list.component.ts imports the existing SummaryCardAccent type and maps all seven period IDs through periodCardAccents; summaryCards uses that lookup instead of uniform info. Seven distinct approved accent names confirmed. Existing shared component resolves their Sigma/Bootstrap themed colors, retaining its geometry and print-neutral treatment; no shared or feature CSS changed. All labels, values, first five accents and report behavior remain.

Changed source files: F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/ReceivableAgeAnalysis/components/list/list.component.html and .ts. Both TypeScript/template source parsers report0 syntax errors; complete scoped frontend diff reviewed and diff--check passed. No prohibited commands run. Owner visual acceptance remains pending: compare filter rows and all twelve cards at wide/narrow widths in Arabic/English and light/dark; confirm customized periods and existing print readability. No migration needed. Suggested frontend commit only: `style(receivable-aging): space filter rows and vary period card accents`.

## Owner follow-up: title and filter card width — 2026-10-02

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Owner extends StatementOfAccount's documented title/filter width alignment to ReceivableAgeAnalysis. |
| Scope | One presentation rule; existing report contracts and prior working-tree edits remain. |

Before-edit decision: use shared `sigma-report-panel--aligned-title`, with title `margin-inline: 0` matching the existing filter strip. Keep current panel padding and title block spacing; adopt the capability in both requested report templates without feature-local overrides or changing other reports.

| Concern | Owning block | Actual reference/value | Shared owner and target comparison |
|---|---|---|---|
| Report title/filter edges | UI 3/20 | TrailBalance title SCSS -8px -6px 16px; shared `.sigma-report-filter-panel` margin 0 0 6px | `src/styles.scss` currently extends title 6px on each side; ReceivableAgeAnalysis title and form are direct children of the same panel. Owner authorizes zero inline title margins so both stretch to its content width. |
| Responsive/RTL/themes | UI 1/20/25 | Shared report panel padding 16px 14px 14px; 12px 10px below 620px | Logical inline margins remain zero through either padding rule; the modifier changes no surface, colors, height or scroll ownership. |
| Data and controls | Master 4/7 | Existing list template's typed form, conditional periods, grid, totals and print bindings | No filter/DTO/column/paging/calculation/action/translation/route/provider changes; prior accounting and full report verification remain separately owned. |

Phases: focused Phase 2 layout correction and Phase 6 source reconciliation; backend/write/domain-action/runtime phases not applicable. No screenshot or unresolved business decision. Repeated alignment is shared globally and adopted in both requested consumers. No migration/mapping/backend change. No subagents: this is one small rule with shared file ownership. Implementation and final source checks pending.

## Financial and maintenance corrections — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner: "عدل حميع الملاحظات"; implement all in-scope findings and maintenance notes from the latest review |
| Shape / scope | Read-only report / BE Pattern 5; RAA-10/11/12 plus feedback, scaling, dormant enum fallback and unrelated scaffold spec. Existing cross-cutting currency/authorization plans remain separately owned. |
| Evidence | Customer Statement signed remaining logic at CustomerService:1049-1063; two-sided allocations; receipt AR credit writer; header-level JV allocation producer; current report row/filter contracts. Master 4/5 and UI 20/22, BE 17; all eight packet checks OK. |

Frozen financial contract (reviewer choice supported by current Statement/ledger, owner-authorized correction):

- Valid report lines are tenant/live customer AR details on live posted, non-voided journals dated through the inclusive as-of day. Missing AR mapping returns a translated configuration failure; never broaden the account predicate. Ignore deleted agreement rows in this report's status subquery.
- Eligible allocations are live tenant rows dated through that same day whose target and actual source are within the report's partner/AR/posted/live/cutoff line set. Explicit source detail links win. Receipt/CreditNote/DebitNote/header JV links resolve their actual source journal; distribute header amounts over its opposite-signed AR lines in unique detail-ID order with capacity guards. This extends the existing header-level producer coherently without discarding additional credit lines. Matching removes equal magnitude from both sides, never changes ledger net.
- Bucket values and BadDebt use remaining signed line amounts at asOfDate (BadDebt retains existing credit-period rule and zero floor). SubTotal remains raw debit-credit ledger net. Allocated is the amount actually matched, informational only. UnAllocated is the signed net of remaining debit and unapplied credit lines; Balance equals that net, which must equal SubTotal. This minimal correction preserves existing SubTotal meaning and uses Statement's signed DueAmount; do not redefine it as gross invoices. Update DTO comments accordingly. No saved journal/receipt/allocation is changed.
- Pre-index details and source capacities; group lines by customer once. Do not rescan the full ledger per partner. Preserve all 19 columns and 12 full-set totals.
- Final conformance clarification before query-entry edits: adopt existing Repository.QueryReport for this method's read roots, retaining explicit tenant/live-parent predicates on joins. Retain the existing materialized report architecture for deterministic per-line capacity reconciliation; this is a feature-specific deviation from BE 17's ordinary SQL aggregation rule, not a claimed database-aggregation match or a new global exemption.
- Add optional request `IncludeAllRows` (false by default) on the existing GET. False preserves size clamp 200 and stable Name/CustomerId paging; true returns all matching rows once with consistent totalCount/totalPages=1 for nonempty/pageNumber=1/pageSize metadata. Angular report explicitly opts in and directly handles both Result and HTTP failures, removing the repeated page-fetch adapter and its lost Error message path. Request/response shape remains typed; existing paged clients remain compatible.
- Match numeric contactType fallbacks to the confirmed 0=Individual/1=Company enum. Remove the unrelated widgets-examples scaffold spec rather than presenting a trivial creation test as report coverage; owner runtime/meaningful testing stays pending. Existing language/busy/date/lookup behavior and scoped styling remain intact.

Owning files: root owns CustomerService.GetReceivableAgeAnalysisAsync, report DTO, feature vocabulary additions, canonical BE 17/preamble/history, skill/history and this review; isolated frontend work owns component/service and stale spec removal. No source/reference changes to Statement or financial writers. No EF, AutoMapper, migration or mutation. Exact column formulas remain here and in the DTO. The reusable two-sided/cutoff/account-scope checks and explicit complete-response preference were promoted to BE 17 and the skill under the learning protocol; packets were regenerated through their generator.

### Final source reconciliation

| Concern | Owning source / reference | Final result |
|---|---|---|
| RAA-10 / double deduction, outstanding buckets and BadDebt | CustomerService.GetReceivableAgeAnalysisAsync / ApplyAllocation; unchanged Statement signed DueAmount consumer; BE 17 | Resolved in source: capacity-bounded matching reduces both signed AR sides equally. SubTotal remains raw ledger net; remaining amounts feed all buckets, UnAllocated, Balance and credit-period BadDebt. Allocated is informational. |
| RAA-11 / historical cutoff | AllocationDate predicate and loaded-line eligibility in the same report; Statement cutoff reference; BE 17 | Resolved in source: an allocation and both actual journal sides must qualify through the inclusive as-of day. No future source capacity is available to the matcher. |
| RAA-12 / absent AR account mapping | customerGroupIdsQuery, arAccountIds and strict membership predicate; unchanged Receipt AR writer; BE 17 | Resolved in source: no broad-account fallback. Missing AR links return receivableAgeAnalysis.missingReceivableAccounts; both dictionaries supply the message. |
| Live-parent and scope checks | QueryReport roots, journal parent predicates, source document predicates and agreement status query | Direct in-scope joins reject deleted parent journals/documents and deleted agreements. Actual target/source AR line sets enforce tenant/customer/account/cutoff eligibility. This does not close the unrelated global soft-delete backlog. |
| Source links and malformed excess | Explicit source ID; actual Receipt/CN/DN/header JV ID; ordered opposite-sign source queues | Explicit detail takes priority. Header capacity can span multiple lines in detail-ID order. Missing/wrong-partner/same-sign source or exhausted capacity cannot reduce remaining amounts below their original side. No writes or repair of malformed saved allocations. |
| Scaling note | Detail dictionaries, source queues, linesByPartner lookup; IncludeAllRows request/response | Resolved source structure: one complete-response request from the screen, no repeated page adapter and no ledger rescan per customer. No measured latency/memory or database snapshot isolation claim. |
| Declared/HTTP failure feedback | Component search; service X-Skip-Error-Interceptor; UI 22, shared apiErrorMessage | Resolved: direct unsuccessful Result/missing Entity keeps response.message inline; HTTP failure uses the existing extractor. Both clear stale rows/totals and finalize loading/form state. |
| Numeric enum fallback | CustomerType in models/list.ts and contactType column | Resolved: 0=Individual / 1=Company, while retaining API enum-name labels. |
| Unrelated scaffold test | components/list/list.component.spec.ts | Removed the spec importing widgets-examples ListsComponent. No replacement trivial test and no executed test coverage claimed. |
| Earlier RAA-01–09 | Existing form/template, applied boundaries, busy/cancellation, date mask, lookup skip headers and stable sort | Preserved and rechecked against final source; complete-response collection supersedes fetchAllPages while keeping the prior full-output requirement. |

Transport contract: existing GET Customer/ReceivableAgeAnalysis binds the typed request via FromQuery and returns the existing Result<RowResponse>. IncludeAllRows=false (default) keeps clamp 1–200, stable Name/CustomerId ordering and server paging. True returns every matching row once, PageNumber=1, PageSize=max(1, TotalCount), TotalPages=1 for nonempty and 0 for empty. All twelve totals cover the full filtered set in either mode. The screen explicitly sends true, locally pages the complete array, prints after disabling the paginator for a preparation frame, and exports that complete array using current columns. Empty early returns use the same response builder and consistent metadata. No mutation or route/permission change.

Grid order remains 19: name, contactGroup, contactType, branch, code, creditPeriod, creditLimit, p1_0_30, p2_31_60, p3_61_90, p4_91_120, p5_121_150, p6_151_180, p7_181_Plus, subTotal, allocated, unAllocated, balance, badDebt. Frontend Row and backend RowDto keep those exact properties plus customerId identity; no ListVM or mapping is needed. Existing filter keys and effective custom boundaries are preserved. Currency still filters customer billing currency, not conversion; the separate currency and authorization plans are not part of these findings.

BE 17 conformance: read roots now use the existing QueryReport no-tracking/fail-closed owner, with explicit joined-parent scope. Backend totals remain authoritative and complete before paging. Justified feature-specific deviation, recorded before query-entry edits: the prior materialized report architecture is retained to reconcile deterministic per-line capacities before buckets/totals. A plain SQL Sum/GroupBy on raw lines would reproduce RAA-10; this implementation is not presented as SQL aggregation. Existing shared Customer service/controller/DTO placement is retained for API compatibility; no new parallel service or named local DTO was introduced.

Source arithmetic traces (manual reasoning from the final implementation; not executed tests or actual customer data):

| Inputs within cutoff, unless stated | Applied matching | Expected final source result |
|---|---|---|
| Debit 1,000; receipt AR credit 400; allocation 400 | Debit remainder 600; credit remainder 0 | SubTotal=UnAllocated=Balance=600; Allocated=400; the 600 remainder ages with its invoice. |
| Old debit 1,000; current credit 1,000; allocation 1,000 | Both remainders 0 | All buckets and BadDebt=0; Balance=0; Allocated=1,000. |
| Debit 1,000 before cutoff; receipt/its allocation 400 after cutoff | Future source unavailable; future allocation excluded | Balance=1,000; Allocated=0; the invoice remains outstanding at the historical cutoff. |
| Debit 1,000 and credit 400 before cutoff, allocation after cutoff | No effective matching at cutoff | Balance=600; Allocated=0; signed unapplied credit remains in its own age bucket. |
| Debit 1,000; header source AR credits 150 and 250; allocation 400 | Consume both source lines in ID order | Balance=600; Allocated=400; no arbitrary first-credit limitation. |
| Debit 1,000; source credit 400; malformed allocation 700 | Matching capped at 400 | Debit remains 600, credit 0; Balance=600; Allocated=400. |

Documentation: BE version 0.72 records the reusable financial-aging invariants and complete-response preference, with skill §6.1 and both history rows. All eight generated packets pass Generate-SigmaRecipes.ps1 -Check after regeneration. Check-BookReferences.ps1 reports every checked reference resolves. Full scoped feature source and direct report diff were reviewed; scoped diff --check passes, and no direct-feature conflict markers/stale adapter/spec references remain. Unrelated dirty changes in shared vocabulary files and adjacent backend methods were preserved.

Agent utilization: one bounded frontend worker (terra role, inherited parent model because the mapped terra model was unavailable) owned component/service/stale-spec removal after contract freeze. Root owned accounting/API/doc changes and final integration. Two non-overlapping slices ran concurrently to reduce elapsed time without concurrent file edits. Root reviewed the integrated owned-file diffs and retained responsibility for reconciliation.

Phases: 0/1 discovery/freeze, 2 read/report correction, 5 typed transport/error integration, 6 source reconciliation. Editor/write and domain-action phases 3/4 are inapplicable to this read-only report. No screenshot was supplied, so visual/RTL/theme/print-layout acceptance remains Uncertain until owner verification. No build, tests, lint, app/browser run, DB commands, migrations, commits, pushes or deployment were run. No Add-Migration is required because only report queries, transport options and documentation changed.

Owner verification remains: compile both applications; verify the arithmetic cases against known posted journals/allocations, including explicit and header source links; verify more than 200 customers, totals/local pagination/full print/Excel; verify false Result and HTTP/configuration failures, lookups/retry, custom periods, delayed cancellation and Arabic/English/narrow/light/dark/RTL presentation. Multiple database reads use the existing normal read context; this task does not promise transaction-level snapshot consistency or measured performance.

Suggested commits (suggest only): frontend `fix(customers): load complete aging report with direct inline feedback`; backend `fix(reports): reconcile receivable aging allocations at cutoff`; documentation `docs(reports): record allocation aging and complete-response invariants`.

---
## Post-repair full report source review — 2026-10-02

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Authorization | Owner: "راجع التقرير مرة اخرى"; source-read-only review of ReceivableAgeAnalysis after the repairs |
| Result | RAA-01 through RAA-09 remain resolved in source. Three additional accounting read-path defects confirmed: RAA-10/11/12. No compile, runtime or visual pass claimed. |
| Scope | Feature component/template/styles/service/models/route; ContactGroup lookup extension; direct report API/request/service; shared table/paging/error/date owners; allocation effective-query helper and model; exact Receipt journal writer and existing Customer Statement allocation consumer |
| Guides / packets | Required sigma-screen-refactor skill; Master 4/5, UI 6/8/17/20/21/22/23/28/29 and BE 17. All eight generated packets pass -Check. Focused read-only Phase 0/1/2/5/6 comparisons; editor/write/domain-action implementation inapplicable. |
| Evidence | No screenshot supplied. Formula/query consequences are inferred directly from inspected source; examples below are hypothetical arithmetic traces, not executed cases or observed customer balances. |

This was the read-only snapshot before the owner-authorized correction above; its line numbers and open findings describe that earlier source state. Earlier source closures applied to the named repairs and did not establish the correctness of the unchanged accounting formulas. Historical contracts and implementation evidence remain below. That review itself edited only this artifact; the later authorized implementation and current closure are recorded at the top.

### Confirmed actionable findings

Backend source paths below are relative to F:/My Work/Sigma/SigmaBackend. All three primary findings are existing behavior retained by the previous repairs, not new regressions from the custom-period validation, sort tie-breaker or lookup headers.

| Finding | Actual evidence / trigger | Consequence / recommended correction |
|---|---|---|
| RAA-10 / P1 — allocation is subtracted twice from net receivable | SiGma.Business/Services/Customers/CustomerService.cs:1704-1722 builds buckets from every qualifying line's Debit-Credit, sums them as subTotal, then computes balance=subTotal-allocated. ReceiptService.cs:475-479 already creates a credit to the customer's AR account for the receipt amount; WhereLedgerEffective restricts the matching allocation to posted source documents. | Hypothetical posted invoice 1,000 and posted receipt 400, fully allocated against it and both before cutoff: jvLines net=600, allocated=400, reported Balance=200; actual ledger net is 600. Keep ledger balance independent of matching allocations and, when showing outstanding aging, apply allocation to each target/source line before bucketing using the established Statement consumer at CustomerService.cs:1049-1063. Freeze how SubTotal/Allocated/UnAllocated relate before changing the financial read contract. |
| RAA-11 / P1 — allocation scope ignores report cutoff | CustomerService.cs:1657-1665 restricts ledger lines to journal date <= asOfDate. The allocation query at 1678-1692 has no AllocationDate/asOfDate predicate, no date limit on the joined target journal and no date limit on the allocating source. JournalVoucherAllocationQueryExtensions.cs:11-32 checks posted/non-voided state only, not dates. JournalVoucherAllocation has an actual AllocationDate field. Existing Statement at CustomerService.cs:939-956 explicitly constrains AllocationDate<=toDateInclusive. | A receipt posted/allocated after a historical cutoff contributes to Allocated even though its ledger credit is excluded. Example invoice 1,000 on 01-Sep, receipt/400 allocation on 01-Oct, asOfDate=30-Sep: the later allocation changes historical output. Apply the same cutoff, account/partner scope and applicable target/source journal dates to allocation eligibility. A fix to RAA-10 alone does not correct Allocated or historical bucket settlement. |
| RAA-12 / P1 — missing customer AR links widens the account scope | CustomerService.cs:1544-1558 resolves customer AR accounts, but predicate at 1661 is arAccountIds.Count==0 OR arAccountIds.Contains(...). It therefore matches every account whenever no valid customer links are configured. The actual same-service Statement query at 856-863 always requires membership in the resolved AR set; the Receipt writer at ReceiptService.cs:456-458 refuses a missing customer control account. | Missing configuration can include bank, deposit or other customer-associated ledger lines as receivables and produce wrong aging/balance totals. Require confirmed AR account membership; on missing mapping use a clear configuration error or the confirmed empty-report contract, never all customer accounts. Keep tenant filtering and existing accounts intact. |

Related consequence within RAA-10: bucket and BadDebt calculations use raw, pre-matching ledger lines at 1704-1726. For an old invoice 1,000 fully paid by a current receipt 1,000, the old bucket retains +1,000 and the current bucket gets -1,000; BadDebt can still report 1,000 when the credit period is exceeded. The existing outstanding Statement applies allocations on both debit and credit sides before computing remaining signed amounts. This reinforces the need to reconcile the financial definitions rather than merely deleting the final subtraction.

### Previous repair verification / report evidence

| Concern | Current producer/consumer comparison | Result |
|---|---|---|
| Conditional form | HTML form owns fields through its closing tag at 232, including all six period controls at 156-183; TS defines those controls at 238-243 | RAA-01 remains resolved |
| Dataset / page / totals / output | TS:348-382 maps nested rows/page metadata into shared fetchAllPages; only its reduced full array is published at 394. API clamp remains 200 with Name.ThenBy(CustomerId) at 1758-1785; all 12 totals cover matching rows. HTML local paging uses array count; TS:461-481 prints/exports all loaded rows | RAA-02/08 remain resolved for stable source data; snapshot changes between requests and measured performance unverified. Completeness does not prove correct monetary formulas (RAA-10/11/12) |
| Filter lifetime / busy | TS:251-259 clears stale outputs; 340/385-389 disables, cancels on emitted changes and re-enables through finalize | RAA-03 remains resolved |
| Applied periods | TS:331-336 defaults off state; freezeAppliedPeriods/columns/summary/export share the successful applied boundaries. API:1515-1534 uses defaults off and checks supplied positive ordered integer ends on | RAA-04/05 remain resolved |
| Error ownership / lookup recovery | Report service carries X-Skip-Error-Interceptor. TS:484-524 opts every lookup out and guards duplicate loads; ContactGroupService:20-30 implements the optional header. The interceptor suppresses its dialog for both failure channels; screen inline flag/retry remains | RAA-06/09 remain resolved |
| Date / language | Mask and dd/mm/yyyy placeholder remain; search validates the control and shared date parse. Translated options/columns depend on language changes; required en/ar keys and route/tsconfig entries exist | RAA-07 remains resolved; no runtime acceptance claimed |
| Layout / print | Shared fill/flow bindings, full-array export and print signal/callback restore remain; local SCSS contains responsive geometry and public table width only | Source owners preserved. Narrow viewport, theme/RTL and printed layout remain Uncertain pending actual visual verification |

Grid order (19): name, contactGroup, contactType, branch, code, creditPeriod, creditLimit, p1_0_30, p2_31_60, p3_61_90, p4_91_120, p5_121_150, p6_151_180, p7_181_Plus, subTotal, allocated, unAllocated, balance, badDebt. Frontend Row model and backend RowDto expose the same properties plus customerId identity. Filter keys and paged Result wrapper remain compatible; current currency filter means customer billing currency per DTO, not currency conversion (already deferred in BE backlog 18). No ListVM, CRUD actions, mapping or entity change is implied by this report review.

### Additional limits / follow-up evidence

- Declared-failure feedback: fetchAllPages turns unsuccessful Results into Error(message), whereas apiErrorMessage reads error.error.message. If a failure is delivered as a 2xx unsuccessful Result, the specific message is reduced to the generic load error at TS:415-421. Current CustomerController always returns BadRequest for unsuccessful results, so its ordinary HTTP path retains the API message; this is a dormant compatibility gap, not an observed failure of the present controller.
- Scaling: each page request reloads and computes the whole report in CustomerService before slicing, and foreach scans jvLines for each partner at 1699. Complete collection now multiplies that existing work by the number of pages. No timing/benchmark was run; do not claim a measured slowdown. A future optimization must preserve counts/totals, filter semantics and complete outputs.
- Numeric contactType fallbacks in TS:174/177 assume 1=Individual and 2=Company while the filter enum is 0/1. The actual backend producer at 1738 emits enum names, which are mapped correctly, so the mismatched fallback is dormant under this source contract.
- Existing stale spec targets widgets-examples ListsComponent and does not verify this feature; no tests were run. Parent soft-delete and cross-cutting accounting concerns remain governed by the existing BE backlog, not silently declared fixed by this review.

Separate frontend/backend Git roots and complete scoped diffs reviewed. Scoped diff --check passes; no feature/direct report conflict markers. Prior submitted and implemented changes preserved. No builds, tests, lint, app/browser verification, database commands, migrations, commits/pushes or deployment. No subagents because this focused interdependent verification does not meet the delegation gate. No migration or commit suggestion for source changes: none were made in this review.

Owner acceptance cases, after an authorized financial repair: partially allocated invoice/receipt before cutoff (Balance matches ledger); fully settled old invoice (no false outstanding/BadDebt); allocation and receipt after cutoff (historical report excludes them); missing AR links (no unrelated accounts); then more than 200 customers with name ties, all-row print/export, delayed/failing pages/lookups, and Arabic/English/narrow/light/dark/RTL display. Exact financial definitions need to be frozen from the existing Statement/ledger contract before implementation; this review does not authorize accounting changes.

---
## Remaining findings repair — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Authorization | Owner: "عالج الملاحظات"; repair RAA-04, RAA-05, RAA-08 and RAA-09 |
| Shape / references | UI report / backend Pattern 5; UI 20/22 and BE 17. Inline lookup option follows BaseService.getSelectList and StatementOfAccount.loadCustomers. |
| Owned source | Backend CustomerService.GetReceivableAgeAnalysisAsync; frontend ReceivableAgeAnalysisComponent.loadDropdowns; ContactGroupService.getSelectByType |
| Working tree | Feature component is already modified by submitted repairs; preserve them. ContactGroup service and direct backend report file were clean before this patch. |
| Packets / phases | All eight -Check results OK. Focused Phases 0/1 evidence/freeze, 2 read/lookup implementation, 5 feedback integration and 6 reconciliation. No editor, write, mutation or migration phases. |

Frozen targets before code edits:

- `customizePeriods` absent or false uses the existing 30/60/90/120/150/180 ends and ignores hidden custom values. True enables custom ends. Missing individual end fields retain their existing defaults for compatibility; every explicitly supplied custom value must parse as a positive integer, and the complete effective sequence must strictly increase. Reject malformed, empty, fractional, non-positive or reversed supplied custom ends before querying. API returns the existing standard unsuccessful Result / controller BadRequest, with the already translated `receivableAgeAnalysis.invalidPeriods` message key. Existing screen alert translates it in either language.
- Preserve the paged response, page-size clamp 200, all 19 grid properties plus identity, all 12 backend totals and current formulas. Sort by Name and then unique CustomerId before Skip/Take so separate page requests have deterministic ties.
- Inline retry owns all five lookup failures. Four inherited getSelectList calls opt out via the existing `skipErrorInterceptor` option. The type-specific contact-group method gains the same optional option and preserves global feedback when omitted, so other consumers keep their contract. Guard the lookup loader against duplicate execution.
- No entity/DTO/EF/AutoMapper or accounting changes; no Add-Migration. No new reusable rule is needed: owning books/skill already state these contracts. Check packets for drift; do not rewrite unchanged books or generated packets. Update this feature review with final source evidence.

### Final repair reconciliation

| Finding | Source result | Actual evidence |
|---|---|---|
| RAA-04 | Resolved — source-only | CustomerService.cs:1515-1534 initializes confirmed default ends and reads supplied custom ends only when FilterHelper.GetBool(customizePeriods) is true. Frontend search off/default payload and applied headings already agree. |
| RAA-05 | Resolved — source-only | CustomerService.cs:1522-1531 rejects malformed supplied integers, zero/negative values and a non-increasing effective sequence before the first database query at 1544. Existing CustomerController returns unsuccessful Result as BadRequest; apiErrorMessage and the screen's translate pipe consume the existing en/ar invalidPeriods key. |
| RAA-08 | Resolved — source-only | CustomerService.cs:1762 adds ThenBy(CustomerId) after Name and before Skip/Take. Unique customer identity resolves name ties; all full-set totals and clamp/metadata remain unchanged. Existing fetchAllPages adapter still consumes every response page before publication. |
| RAA-09 | Resolved — source-only | Component loadDropdowns at 484-524 guards repeated loading and passes skipErrorInterceptor:true to every one of its five calls. ContactGroupService.getSelectByType at 20-30 implements the optional header branch using the inherited BaseService contract. Default omitted options keep other consumers' global owner. Both Result failure and HTTP error still set one inline retry flag and finalize local loading. |

The first five original source resolutions remain intact: custom FormGroup ownership, full page collection, filter invalidation/reactive busy lifecycle, report inline header and shared date validity. The seven original findings plus RAA-08/09 are now resolved at the source level. This statement supersedes the historical open/partial findings below and does not certify runtime/visual behavior.

Changed in this repair: backend SiGma.Business/Services/Customers/CustomerService.cs; frontend src/app/modules/Customers/ReceivableAgeAnalysis/components/list/list.component.ts and src/app/modules/Administration/ContactGroups/services/contactgroup.service.ts; this existing review. Preserved all prior screen/translation changes. No style, grid column, row/filter/response DTO, total formula, AutoMapper, registration or schema changes. Same typed Result response and controller; no Add-Migration required. The only shared signature extension is an optional lookup-feedback option, preserving existing calls.

Source verification: inspected the complete scoped backend diff and the ContactGroupService extension; reconciled the current component against the complete previously inspected scoped feature diff and new loader source. Separate Git roots confirmed. Scoped diff --check passes in both repositories; relevant source has no conflict markers. Four inherited lookup services actually use BaseService.getSelectList and its approved option. API message key exists in both feature vocabularies; no new translation key is needed. All eight generated packets checked OK before implementation; no book/skill rule changed or new reusable rule established, so regeneration is unnecessary. Source-only Phases 0/1/2/5/6 applied; editor, mutation, mapping, persistence and migration work skipped as inapplicable.

Owner runtime acceptance pending: custom P1=15 labels followed by turning customization off; direct custom API requests with reversed/zero/negative/fractional/empty ends must fail, omitted ends retain valid defaults; more than 200 customers with duplicate names around the page boundary and print/Excel identity/count match; each lookup failure produces one inline retry without the global dialog, retry recovers and loading ends. Compilation, actual HTTP execution, printed layout and narrow/light/dark/RTL acceptance were not performed.

No build/test/lint/browser/app/DB/migration/commit/push/deployment commands were run. No subagents: the focused interdependent patch did not meet the delegation gate. No unrelated files were modified. Suggested commits (not created): backend `fix(customers): validate aging periods and stabilize report paging`; frontend `fix(customers): use inline feedback for aging report lookups`.

---

## Owner repair verification — 2026-10-02

| Field | Value |
|---|---|
| Status | Draft — source verification complete; remaining findings recorded |
| Owner verification pending | yes |
| Authorization | Owner: "المفروض ان الاخطاء اتحلت اتأكد تانى"; verify current repairs, source-read-only |
| Result | Five original findings resolved in source; RAA-04/05 partially resolved; two additional findings from the repaired paths |
| Scope | Current feature TS/HTML/SCSS/service, model and route; relevant en/ar changes; direct Customer controller/request/report service, FilterHelper and shared paging/date/grid/export/error consumers |
| Evidence | Master 5; UI 6/8/17/20/21/22/23/28/29; BE 17; required skill and Phase-02/06 evidence. All eight generated packets checked OK. No screenshot supplied; visual/runtime acceptance Uncertain/pending |

This is the current verification. The earlier "Resolution of Confirmed Findings" section is the submitted repair narrative, not proof that all findings were closed. The documentation follow-up and original review below remain historical. No application source was changed during this verification.

### Original finding reconciliation

Frontend paths below are relative to F:/My Work/Sigma/SiGmaAngularFrontEnd; backend paths to F:/My Work/Sigma/SigmaBackend. TS/HTML abbreviations refer to src/app/modules/Customers/ReceivableAgeAnalysis/components/list/list.component.ts/.html.

| Finding | Verified status | Actual consumer/producer evidence |
|---|---|---|
| RAA-01 | Resolved — source-only | HTML:8-10 owns the form; conditional period controls at 156-183 now precede its closing tag at 232. All six formControlName values have typed controls in TS:238-243. |
| RAA-02 | Original first-page cap defect resolved — source-only | TS:348-382 adapts entity.rows/count/pages/pageNumber/pageSize into Results and calls shared fetchAllPages; list-query.ts:81-100 follows metadata and rejects any failed page before reduce emits. Backend CustomerService.cs:1738-1765 still clamps at 200, slices rows and totals the entire filtered set. TS:394-410 publishes collected rows with page-one full-set totals only after successful collection; HTML:312-320 local-paginates this collection. TS:461-481 and HTML:315-316 use it for print and Excel. Stable ordering remains a separate RAA-08 finding below. |
| RAA-03 | Resolved — source-only | TS:251-259 invalidates rows/totals and resets paging/search/error on filter edits; TS:340/385-389 disables the reactive form without emission, cancels on emitted edits and re-enables in finalize. Print/export are rows/busy/printing-gated. |
| RAA-04 | Partially resolved | TS:331-336 sends confirmed default ends when off; freezeAppliedPeriods at 525-541 supplies applied labels after successful collection; columns at 187-193, summary HTML:273-298 and export columns() at 479 share them. Backend CustomerService.cs:1516-1521 still reads custom ends unconditionally, ignoring customizePeriods. UI behavior is repaired; the API off/default contract remains open. |
| RAA-05 | Partially resolved | TS:299-318 rejects non-positive, non-integer and non-increasing ends when custom is on. Backend CustomerService.cs:1516-1521/1690-1696 has no corresponding validation. FilterHelper.GetInt (Filters/FilterHelper.cs:7-8) silently returns null for invalid integers and the report substitutes defaults; reversed/negative integers remain accepted. |
| RAA-06 | Resolved for report reads — source-only | services/receivable-age-analysis.service.ts:34-37 sends X-Skip-Error-Interceptor; shared error.interceptor.ts:41/82 skips its dialog in both failure channels. TS:415-423 and HTML:234-239 retain inline report feedback. The newly added lookup alert has a separate RAA-09 issue below. |
| RAA-07 | Resolved — source-only | HTML:18-20 uses shared picker mask and dd/mm/yyyy placeholder; TS:281-296 checks control validity and parsed date. DatePickerDirective.validate at shared/directives/date-picker.directive.ts:54-64 rejects partial/invalid masked text. |

### Remaining actionable findings

| Finding | Evidence / trigger | Consequence and required repair |
|---|---|---|
| RAA-04 / P2 — API ignores disabled custom periods | CustomerService.cs:1516-1521 consumes p1Days-p6Days without reading customizePeriods; the DTO explicitly declares the checkbox. A direct request with customizePeriods=false and p1Days=15 still uses 15. | Preserve the confirmed 30/60/90/120/150/180 defaults at the API when off. Do not rely on this Angular consumer to define server semantics. The normal repaired UI already sends defaults. |
| RAA-05 / P2 — API accepts invalid boundaries | Same service block and bucket else-if at 1690-1696; no validation in ReceivableAgeAnalysisRequestDto. p1=60,p2=30 creates an unreachable second bucket; negative integers are accepted, and fractional/non-numeric values silently fall back via GetInt. | Validate supplied effective custom ends as positive strictly increasing integers and return a standard unsuccessful Result for invalid input before querying; do not silently substitute malformed supplied custom values. No accounting redesign needed. |
| RAA-08 / P2 — paging order lacks a unique tie-breaker | partnerQ.Select(...).ToListAsync at CustomerService.cs:1571-1578 is unordered; paging at 1742 uses only rows.OrderBy(r => r.Name).Skip(...).Take(...). The repair now makes separate requests for every page at TS:351/382. | If equal customer names straddle a page boundary and source order differs between requests, rows can repeat or be omitted. This is a source contract defect; no actual duplicate was claimed or observed at runtime. Add a stable unique tie-breaker (CustomerId) before Skip/Take, as BE 17 requires. |
| RAA-09 / P2 — lookup failures have two feedback owners | TS:488-497 calls inherited getSelectList without skipErrorInterceptor; BaseService.getSelectList at shared/service/base-service.service.ts:81-85 suppresses global feedback only when explicitly requested. ContactGroupService.getSelectByType at Administration/ContactGroups/services/contactgroup.service.ts:20-23 also sends no skip header. TS:510/520 sets lookupsFailed and HTML:241-246 presents an inline failure/retry. | The same failed lookup triggers the global dialog and the added inline alert. Apply the established inline lookup opt-out to all affected requests, including the type-specific group request, or keep one global feedback owner. RAA-06's report header does not affect these independent calls. |

### Required report evidence / final source comparison

| Concern | Match / limit |
|---|---|
| Dataset/totals/output scope | First-page-only publication repaired with the shared metadata adapter; all page failures prevent publishing a partial collection. All 12 totals retain backend full-set scope. Unique order remains RAA-08; above-200 completeness needs owner runtime verification. |
| Conditional controls | All six custom number fields are within the actual FormGroup. Layout uses the shared field class and local responsive geometry; screenshot conformance remains pending. |
| Applied-filter lifetime | User edits clear outputs; report reads freeze a filter object and disable/re-enable form controls. Applied bucket headings feed grid, summary and Excel; print uses those same rendered columns. |
| Conditional/date/language meaning | Required date recipe and UI custom validation implemented; custom labels and computed customer/status labels respond correctly at the source level. API semantics/validation remain RAA-04/05. Backend returns contactType by enum name; the recognized name strings are translated by columns.value. |
| Busy/failure/recovery | Report finalize/cancellation and single feedback header are present; failed lookup Results and HTTP failures now show retry. Their feedback owner remains RAA-09. |
| Empty/layout/print | Distinct searchPrompt/noData keys exist in en/ar and HTML. Shared report fill/flow/table owners replace feature palette. Twelve totals plus wrapped filters may consume the small-screen row viewport; visual check is still pending. |

Grid fields (19): name, contactGroup, contactType, branch, code, creditPeriod, creditLimit, p1_0_30, p2_31_60, p3_61_90, p4_91_120, p5_121_150, p6_151_180, p7_181_Plus, subTotal, allocated, unAllocated, balance, badDebt. ReceivableAgeAnalysisRow and backend RowDto expose the same 19 fields plus customerId identity. Transport keeps Result<ReceivableAgeAnalysisResult> with nested rows/page metadata; adapting it for fetchAllPages does not change the API contract. No CRUD actions, entity, AutoMapper, domain formula or schema changes are needed for this verification. No Add-Migration required.

Maintenance improvements confirmed: language-dependent computed options/columns, result-aware lookup failure/retry and distinct initial/empty messages. The existing spec still imports widgets-examples ListsComponent; it supplies no feature assurance and was neither edited nor run. Unrelated translation edits/BOMs were preserved; relevant feature translations exist in both languages.

Phase 2 source evidence and Phase 6 reconciliation applied proportionally. Implementation phases skipped because only verification was requested. Separate frontend/backend Git roots confirmed; complete scoped diffs inspected (direct backend files have no diff). Scoped diff --check passes; no merge markers in feature/direct report service. Only this existing review artifact was updated by this verification; source changes listed above belong to the submitted repairs. No subagents: this small interdependent verification does not meet the delegation gate. No build/test/lint/browser/app/DB/migration/commit/push/deployment commands were run; no source-only review is a compile or runtime pass.

Owner acceptance still pending: more than 200 matches with equal names around a page boundary, print/Excel row identity and count versus API totals; p1=15 labels then switching customization off; rejected reversed/negative/fractional API ends; partial dates/filter edits/delayed requests; later-page and lookup failure/retry; Arabic/English, light/dark and narrow viewport grid/paginator visibility.

---

## Documentation prevention follow-up — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner asks to improve documentation so the reviewed failures do not recur |
| Scope | Master 5 evidence gate; UI 6/8/20/29 and report catalog; BE 17; their version/history rows; skill digest/history; PHASE-02/06 templates and exact report dependencies; generated packets through the generator |
| Boundary | Documentation only; RAA-01 through RAA-07 remain application findings, no source fix or runtime verification authorized by this follow-up |

| Concern | Existing owner / inspected evidence | Frozen documentation target |
|---|---|---|
| False conformance | Master 5 already rejects class-only evidence; previous review declared all concerns matched | Require actual consumer/producer symbols and distinguish matched source, missing evidence and pending runtime acceptance; scope-specific report evidence table in Phase 2, reconciled in Phase 6. |
| Incomplete local dataset | UI 6/8/20, BE 17; frontend page 1/200 vs CustomerService slicing/full-set totals | Clarify unpaged report default versus existing paged report API; wrapper name is not completeness evidence. Record limits/counts/totals/output scopes and preserve declared contracts. |
| Filter structure and lifecycle | UI 20; conditional periods outside form; no invalidation/disable; UI 17 owns date mask | Require tracing every conditional control to its FormGroup, applied-filter lifetime, validity and busy state; explicitly check existing mask recipe. |
| Conditional financial meaning | UI 20 and BE 17; always-sent thresholds, unused checkbox and static headings | Declare off/default behavior and validated effective boundaries; same applied boundaries label screen/summary/print/Excel. Do not promote this report's exact values or formulas into a universal rule. |
| Feedback / acceptance | UI 22 already owns skip-header rule; UI 29 owns execution boundary | Explicit report proof includes error owner/header, both failure channels, lookup recovery and date recipe; acceptance covers above-cap data, conditional controls, stale filters and narrow layouts without requiring unauthorized commands. |

All eight packets checked OK before edits. Small coherent documentation change, no subagents; no application change implied by documenting the defects.

Final reconciliation: Master 5 now rejects class/import-only conformance with actual symbol/value evidence; UI 20 owns six required report comparisons. UI 6/8 and the catalog distinguish complete documents from existing paged transport, and BE 17 owns conditional aging/API semantics. UI 29's above-cap/conditional/stale-filter cases remain owner acceptance, not unauthorized execution. Skill digest/history and three book version histories reconciled (Master 1.26, UI 1.42, Backend 0.71). Phase-02 avoids applying list Actions/ListVM/server-paging rules to reports, supplies the report evidence output, and Phase-06 reconciles it. Both packet manifests fingerprint UI 20/21; all eight packets regenerated through the generator, check mode all OK. Semantic review preserves list server paging, complete unpaged reports, shared owners and execution boundaries. Scoped documentation diffs/whitespace/conflict checks pass; Check-BookReferences reports every checked reference resolves. Earlier unrelated documentation/application changes preserved.

| Reviewed finding | Required gate now exposes it | Application status |
|---|---|---|
| RAA-01 | UI 20 conditional formControlName-to-FormGroup evidence | Open; no source fix |
| RAA-02 | UI 6/8/20 + BE 17 request/clamp/slicing/count/totals/output comparison; above-cap UI 29 acceptance | Open; no source fix |
| RAA-03 | UI 20 applied filter snapshot, reactive disable/enable and output invalidation | Open; no source fix |
| RAA-04/05 | UI 20 + BE 17 toggle-off/default, validated effective boundaries and consistent applied labels | Open; no source fix |
| RAA-06 | UI 20 explicitly checks UI 22 feedback owner and header for both failure channels | Open; no source fix |
| RAA-07 | UI 20 explicitly checks existing UI 17 single-date mask/placeholder/control validity recipe | Open; no source fix |

The new evidence rows were checked against these already-inspected failure paths as a source-only documentation pilot. They detect missing contracts without certifying application behavior. No build/test/lint/browser/DB/migration/commit/push/deployment; no app, API, mapping, accounting or schema changes. Suggested documentation commit: docs(sigma): require report contract evidence before conformance (not created).

## Resolution of Confirmed Findings — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `src\app\modules\Customers\ReceivableAgeAnalysis`, full screen resolution of confirmed findings RAA-01 through RAA-07 |

### Reconciliation of Findings

| ID | Status | Implementation Details |
|---|---|---|
| **RAA-01** | Implemented | Moved the conditional `.receivable-age-periods` block inside `<form [formGroup]="form">`, eliminating NG01050 and restoring the single formGroup hierarchy. |
| **RAA-02** | Implemented | Integrated `fetchAllPages` from `shared/utils/list-query` with a `Results<ReceivableAgeAnalysisRow>` adapter mapping `Result<ReceivableAgeAnalysisResult>`, capturing full server-side totals on page 1 and collecting all pages before local presentation, export, and print. |
| **RAA-03** | Implemented | Implemented reactive form `valueChanges` invalidation in `ngOnInit` (clearing rows, totals, error message, and resetting page) and wrapping requests with `this.form.disable({ emitEvent: false })` and `this.form.enable({ emitEvent: false })` in `finalize`, plus `takeUntil(this.form.valueChanges)`. |
| **RAA-04** | Implemented | Bound `appliedPeriods` signal updated upon query execution: uses default keys when customization is off and dynamic range labels (`0 - 15`, `16 - 30`, etc.) when on, uniformly reflected across grid columns, summary bar totals, and Excel export headers. Sends default values (30, 60, 90, 120, 150, 180) when customizePeriods is false. |
| **RAA-05** | Implemented | Added validation for custom periods requiring positive integers and strictly increasing cutoffs (`p1 < p2 < p3 < p4 < p5 < p6`), rejecting invalid inputs with inline error message (`receivableAgeAnalysis.invalidPeriods`). |
| **RAA-06** | Implemented | Added `headers: { 'X-Skip-Error-Interceptor': 'true' }` to `ReceivableAgeAnalysisService.getReceivableAgeAnalysis` to prevent duplicate global dialog error presentation while preserving the report's inline alert owner. |
| **RAA-07** | Implemented | Added `[dateInputMask]="true"` and `placeholder="dd/mm/yyyy"` to `asOfDate` calendar, and added validation in `search()` rejecting invalid control states. |
| **Maintenance** | Implemented | Added `langChange` signal dependency to `customerTypes`, `agreementStatuses`, and `columns` for dynamic re-evaluation on language switch; added translation for `contactType` in column formatting; added `isSuccess` checks on `forkJoin` lookups with `lookupsFailed` signal and inline retry; differentiated not-run (`searchPrompt`) and empty (`noData`) messages. |

## Re-review of owner changes — 2026-10-02

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Authorization | Owner asks to review the modified ReceivableAgeAnalysis again; source-read-only |
| Review result | Source review complete; confirmed findings remain unimplemented |
| Scope | Four changed frontend files, unchanged row/filter/result model and route; direct API paging/custom-period contract, translations, shared table/date/error/print owners and approved report references |
| Shape | Financial read-only report with a paged backend response; local presentation paging does not make that response complete |
| Evidence / packets | No screenshot supplied. Master 5/7, UI 6/8/16/17/20/21/22/23/25/28/29, BE 17; PHASE-02 and PHASE-06. All eight generated packets checked OK; no regeneration needed |

This section is the current review. The implementation narrative below is retained as historical evidence; its claims that local paging exports the full dataset and that every concern matches the canonical contract are superseded by this re-review. Findings distinguish new regressions from existing issues retained by the refactor.

### Confirmed findings

| ID / priority | Source evidence | Trigger and consequence | Recommendation / provenance |
|---|---|---|---|
| RAA-01 / P1 | list.component.html:209 closes the only formGroup; conditional period block begins at 211 and p1Days formControlName at 215, with five siblings | Enabling Customize Periods creates controls with no FormGroup ancestor. Angular FormControlName rejects this parent and raises NG01050; the customization path cannot work. New regression: these fields were inside the form in HEAD. | Move the block inside the existing form or bind its existing FormGroup explicitly. Keep one form/submit contract (UI 20). Do not create independent period controls. |
| RAA-02 / P1 | list.component.ts:267 always requests page 1/200; HTML:313-318 uses lazy=false and rows.length as total; export at 361 and print use only rows. CustomerService.cs:1738-1765 clamps size to 200, slices Rows, computes totals from all rows and returns actual TotalCount/TotalPages | With 250 matching customers only 200 are reachable, printed and exported, while totals include 250. The new local paginator reports 200 as the full count and never fetches server page 2. The page-1 limit existed before; local paging retains it and introduces a misleading complete-count presentation. | Respect the actual paged contract: server paging with response counts and all-pages print/export, or explicitly collect every response page before local paging and publication. Existing fetchAllPages requires a Results<T> adapter because this endpoint wraps rows/counts inside Result.entity; do not merely increase pageSize beyond 200 or copy a private paging loop (UI 6/8/20/21, BE 17). |
| RAA-03 / P2 | TS:230-314 reads form once, never disables/enables it and has no valueChanges invalidation; HTML binds loadingReport disabled directly on reactive controls, customize checkbox has no busy gate; output guards check rows/busy only | After a successful report, changing customer/date/periods leaves old rows/totals printable and exportable under the new filter display. During a request, mutable controls can also diverge from the snapshot sent. Existing stale-result problem remains; the reviewed refactor does not implement the report filter invariant. | Use form.disable/enable with emitEvent=false around requests and invalidate successful output when filters change, or retain an explicit applied-filter snapshot. StatementOfAccount valueChanges/disable/enable is the actual source reference (UI 20/28). |
| RAA-04 / P2 | TS:128-134 and summary labels use fixed p1-p7 keys; en/ar values are 0-30, 31-60, etc. TS always submits p1Days-p6Days; CustomerService.cs:1516-1521 reads them regardless of customizePeriods | Once the broken period controls are repaired, changing P1 to 15 calculates 0-15 but screen/print/Excel still label the column 0-30. Unchecking Customize Periods hides the fields yet still sends the saved custom thresholds; backend does not consult the checkbox. Existing contract issue retained by new typed columns. | Freeze effective thresholds for the applied query; use defaults when customization is off and matching labels across grid, summary, print and export when on. Enforce the same checkbox meaning at the backend boundary. This is the directly consumed period contract, not authorization to redesign accounting (UI 8/20, BE 17). |
| RAA-05 / P2 | TS:233-235 checks date only; period controls have no ordered-integer group validation; backend reads d1-d6 and applies them in else-if order | Reversed, fractional or invalid boundaries are not rejected by the report request path. Native min=1 alone does not enforce strictly increasing integer cutoffs, and search does not check form.invalid. This can silently create empty/misleading aging buckets. Existing validation gap. | Require positive integer, strictly increasing boundaries when customization applies; show inline filter errors and enforce the confirmed rule on the API too. Keep defaults when customization is off. |
| RAA-06 / P2 | Service getReceivableAgeAnalysis sends only params; TS:299-313 and HTML:240 show inline errors. Shared error.interceptor.ts presents unsuccessful Results and HTTP errors unless X-Skip-Error-Interceptor exists | A report load failure is presented both by the global dialog and the inline alert. Existing duplication remains after switching the local reader to apiErrorMessage. | Retain the report's inline owner and send X-Skip-Error-Interceptor on this request (UI 22). Lookup/global failures are a separate owner. |
| RAA-07 / P2 | HTML:17-23 uses appDatePicker but omits dateInputMask and a matching date placeholder; shared directive dateInputMask defaults false | The required reviewed single-date recipe is incomplete: numeric character filtering is present, but structured DD/MM/YYYY editing and its complete-date validator are not enabled. Search also ignores control.invalid. New shared-picker adoption missed the standing recipe. | Bind dateInputMask=true, show dd/mm/yyyy and reject invalid asOfDate control in Search (UI 17). Do not add a private mask. |

### Smaller maintenance and acceptance notes

- TS:191-214 translates customer-type and agreement-status labels once in ngOnInit. A later language change updates translated template/header text but retains old dropdown labels. contactType also displays the raw backend PartnerType string. Existing issue; reuse translated enum/value mapping with current-language evaluation (UI 16/23).
- TS:370-393 forkJoin lookup subscription handles only next and never checks isSuccess for its five responses. An HTTP failure still has the global interceptor as feedback owner, but local recovery is absent; an unsuccessful Result can become silent empty options after the dialog closes. Add explicit result/error state and retry without duplicating global feedback (UI 16/22). This is not a claim that the interceptor is missing.
- HTML:322 uses the same noData key in both hasSearched branches, so not-run and empty are indistinguishable after Reset. Existing automatic first search remains; reset introduces a reachable not-run state. Shared error-empty visibility also deserves attention while inline error is shown.
- The untouched list.component.spec.ts creates widgets-examples ListsComponent rather than this feature. It is no evidence that this refactor works; no tests were run.
- The panel now fixes all filters and 12 summary cards above the only row viewport. At narrow widths the shared summary becomes six rows and the filters also wrap. Verify that controls/cards do not exhaust the shell and hide the grid/paginator; this is pending visual acceptance, not a claimed runtime failure. Period fields also sit outside the shared filter-control boundary, so they cannot inherit all report-strip styling until RAA-01/layout placement is corrected.

### Source conformance and contracts

| Concern | Owning blocks / inspected actual reference | Shared owner / current result |
|---|---|---|
| Shell, title, actions, theme | UI 20/24/25; TrailBalance HTML/actions; StatementOfAccount HTML; styles.scss | ReportPage/ReportActions/FeatureTitle and global report classes are reused; no feature palette, viewport subtraction or deep table override remains. Neutral export variant inherited. Narrow layout acceptance pending. |
| Filter/date lifetime | UI 17/20/28; StatementOfAccount ngOnInit/search; DatePickerDirective | Group ownership fails for custom controls (RAA-01); reactive busy/invalidation and required mask incomplete (RAA-03/07). |
| Grid/paging | UI 6/20; shared DataTable TS/HTML; resolveListPaging | Typed columns and local page/size comparison are correctly reused. Full-array premise fails against API paging (RAA-02). No invented sorting/actions/selection. |
| Print/export | UI 8/21; DataTable flow branch and ReportPrintService integration | Local pager/scroll disabled for print with one preparation frame, cleanup callback/failure return and destroy cancellation; export translates headers at click time and keeps column order. Both cover every loaded row but not every matching backend row (RAA-02). |
| Totals/model | BE 17/UI 20; ReceivableAgeAnalysisResponseDto and CustomerService | Totals remain backend-owned; no frontend re-summing. Their full-set scope does not match the displayed/exported page. |
| Wiring / language | UI 1/23; pages/routing.ts, feature routes, LayoutModule, tsconfig.app.json, en/ar | Route/feature entry and lookup services registered; showingEntries exists in both languages with correct placeholders. Static dropdown/raw type labels remain a smaller issue. |

Grid columns (19): name, contactGroup, contactType, branch, code, creditPeriod, creditLimit, p1_0_30, p2_31_60, p3_61_90, p4_91_120, p5_121_150, p6_151_180, p7_181_Plus, subTotal, allocated, unAllocated, balance, badDebt. Row DTO/model has exactly those fields plus customerId identity. Response has rows, 12 totals and totalCount/totalPages/pageNumber/pageSize; frontend currently ignores the last four. Filter members match the DTO's Filters keys; special mismatch is the unused customizePeriods meaning, not key casing. No API/permission/AutoMapper/calculation/schema contract was changed in this review. The full backend accounting derivation is outside this frontend-change review.

### Re-review verification / handoff

Complete scoped frontend diffs reviewed in the actual frontend Git repository; direct backend paging/threshold source inspected in its own repository. Scoped whitespace and conflict checks pass (Git reports only line-ending normalization notices). Existing owner changes retained. Only this review artifact was updated; no source, documentation books, skill, generated packet or instruction edits. No build, tests, lint, browser/app/DB command, migrations, commits, pushes or deployment. No subagents: this is a compact dependent source/API audit with shared contracts, so delegation overhead would exceed the useful independent work.

Owner acceptance after fixes: enable/customize/disable periods; verify increasing integer validation and actual bucket headings; inspect more than 200 matching customers and compare displayed count/Excel/print against full-set totals; change a filter after success and during a delayed request; induce report/lookup failures and verify one feedback owner; type partial dates, switch language/theme and inspect narrow layouts. Source review does not claim these passed. No migration required by this review. No commit suggested for application repositories because no implementation was performed.

---

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-02 |
| Scope | `src\app\modules\Customers\ReceivableAgeAnalysis`, full screen canonical refactor |
| Repository / branch | `SiGmaAngularFrontEnd` (`review-movements`) |
| Guides | `SIGMA_FEATURE_REVIEW_MASTER.md`; UI blocks 1, 3, 4, 5, 6, 8, 16, 17, 20, 21, 22, 23, 24, 25, 27, 28; Backend pattern 5; `sigma-screen-refactor` skill §6.1 |

## 1. Feature Review Manifest

- **Screen Name:** Receivable Age Analysis (`Customers/ReceivableAgeAnalysis`)
- **Route:** `/ReceivableAgeAnalysis` (lazy-loaded in `src/app/pages/routing.ts`)
- **Screen Type:** 07 Financial Report (Read-only financial aging report)
- **Backend API:** `GET Customer/ReceivableAgeAnalysis` (`ReceivableAgeAnalysisRequestDto` -> `ReceivableAgeAnalysisResponseDto`)
- **Service:** `ReceivableAgeAnalysisService.getReceivableAgeAnalysis(filters, pageNumber, pageSize)`

## 2. Conformance Table

| Concern | Book block | Reference file / symbol | Shared owner | Target match |
|---|---|---|---|---|
| Page shell & host | UI 1, 20 | `Customers/StatementOfAccount` | `.sigma-route-host.sigma-print-flow`, `.sigma-report-page--fill`, `.sigma-report-panel` | Matched; host class set, no page scroll, container-fill, print release |
| Header & title | UI 3 | `Customers/StatementOfAccount` | `app-feature-title` | Matched; inside primary panel, 8px alignment, `bi bi-graph-up` icon |
| Filter panel | UI 4, 20 | `Customers/StatementOfAccount` | `form.sigma-filter-form.sigma-report-filter-panel` | Matched; compact 34px controls, `sigma-report-filter-field`, `sigma-report-action-group` |
| As-of date filter | UI 17, 20 | `shared/directives/date-picker.directive` | `p-calendar[appDatePicker]` | Matched; `dd/mm/yy`, `[keepInvalid]="true"`, `parseDateValue()` normalisation |
| Dropdown lookups | UI 16 | `Customers/StatementOfAccount` | `p-dropdown` with `[options]`, `[showClear]`, `[loading]` | Matched; 6 lookups (branch, customer, group, type, status, sales, currency) |
| Grid & pagination | UI 6, 20 | `Customers/StatementOfAccount` | `app-data-table [fill]="true"` | Matched; `[lazy]="false"`, `[paginator]="!printing()"`, `[scrollable]="!printing()"` |
| Paginator report | UI 6 | UI block 6, backlog 37 | `currentPageReport` format | Matched; `showingEntries` set to `{first}`, `{last}`, `{totalRecords}` in en/ar |
| Summary totals bar | UI 20, styles.scss | `Customers/StatementOfAccount` | `.sigma-report-summary-bar` | Matched; themed, responsive summary bar displaying backend response totals with `\| money` |
| Print flow | UI 21 | `Customers/StatementOfAccount` | `ReportPrintService.print({ afterPrint })` | Matched; `printing` signal toggles pagination/scroll, scheduled frame cleanup on destroy |
| Excel export | UI 8, 20 | `Customers/StatementOfAccount` | `dataTableExportRows` + `onExportToExcel` | Matched; exports full dataset from typed column contracts with click-time translation |
| Failure handling | UI 22 | `Customers/StatementOfAccount` | `apiErrorMessage()`, `LoadingService` | Matched; two-tier loading with `finalize(() => this.loading.endLoading())` |
| SCSS & tokens | UI 24, 25 | `styles.scss` | Canonical `--sigma-*` tokens | Matched; 495 lines of bespoke SCSS eliminated; 0 rogue colors |

## 3. Transformations

1. **Page & Shell Architecture:**
   - Removed legacy `app-receivable-age-analysis { height: calc(100dvh - ...); }` and custom outer container padding.
   - Replaced with canonical `host: { class: 'sigma-route-host sigma-print-flow' }`, `<section appReportPage class="sigma-report-page--fill sigma-print-flow">`, and `<div class="sigma-report-panel sigma-print-flow">`.
2. **Filter Strip (`form.sigma-report-filter-panel`):**
   - Replaced bespoke `.receivable-age-filter-grid` with canonical `form.sigma-filter-form.sigma-report-filter-panel`.
   - Used `p-calendar[appDatePicker]` for `asOfDate`, eliminating private date formatters in favor of shared `parseDateValue()`.
   - Used canonical `p-dropdown` controls for lookups with `DropDownSelect` from `shared/models/dropdown-select`.
   - Placed action buttons inside `div[appReportActions].sigma-report-filter-actions` > `.sigma-report-action-group` (Search, Refresh, Reset, Print, Export to Excel).
   - Replaced custom periods container with responsive `.receivable-age-periods.no-print`.
3. **Data Table (`app-data-table`):**
   - Replaced hand-built HTML `<table>`, `<colgroup>`, and custom scroll wrappers with `<app-data-table>`.
   - Configured `[fill]="true"`, `[scrollable]="!printing()"`, and `[paginator]="!printing()"` for bottom-pinned paginator and flowing print output.
   - Defined 19 typed columns (`ReadonlyArray<DataTableColumn<ReceivableAgeAnalysisRow>>`) with `type: 'money'` and `headerClass: 'text-end'` for numeric alignment.
   - Integrated client-side pagination via `resolveListPaging` and `DEFAULT_PAGE_SIZE = 20`.
   - Bound `currentPageReport="receivableAgeAnalysis.showingEntries"`.
4. **Totals Summary Bar (`.sigma-report-summary-bar`):**
   - Replaced hand-built `<tfoot>` table with `.sigma-report-summary-bar` and `.sigma-report-totals`.
   - Formatted all 12 response totals (P1–P7, SubTotal, Allocated, Unallocated, Balance, BadDebt) with `| money`.
5. **Print & Export:**
   - Aligned print flow with `ReportPrintService.print({ afterPrint: () => this.printing.set(false) })` and scheduled frame cleanup on `destroyRef`.
   - Export dispatches via `dataTableExportRows(this.rows(), this.columns, translate)` to `onExportToExcel()`.
6. **Styles (`list.component.scss`):**
   - Eliminated 495 lines of bespoke SCSS, removing hardcoded `--raa-*` palette (`#21aaa7`, `#268ac5`, `#bd4551`, `#dce4eb`, etc.), custom table widths, and duplicate dark theme blocks.
   - Retained only 30 lines of scoped structural layout rules for `.receivable-age-periods`, `.receivable-age-table`, and `.receivable-age-frame`.
7. **Service Refactor:**
   - Refactored `ReceivableAgeAnalysisService` to serialize query parameters using shared `toFilterParams(filters)` from `shared/utils/list-query`.

## 4. Column & Filter Contracts

### Table Columns (19 Columns)
| Field | Header Key | Type / Alignment |
|---|---|---|
| `name` | `receivableAgeAnalysis.name` | text / start |
| `contactGroup` | `receivableAgeAnalysis.contactGroup` | text / start |
| `contactType` | `receivableAgeAnalysis.contactType` | text / start |
| `branch` | `receivableAgeAnalysis.branch` | text / start |
| `code` | `receivableAgeAnalysis.code` | text / start |
| `creditPeriod` | `receivableAgeAnalysis.creditPeriod` | `number` / `text-end` |
| `creditLimit` | `receivableAgeAnalysis.creditLimit` | `money` / `text-end` |
| `p1_0_30` | `receivableAgeAnalysis.p1` | `money` / `text-end` |
| `p2_31_60` | `receivableAgeAnalysis.p2` | `money` / `text-end` |
| `p3_61_90` | `receivableAgeAnalysis.p3` | `money` / `text-end` |
| `p4_91_120` | `receivableAgeAnalysis.p4` | `money` / `text-end` |
| `p5_121_150` | `receivableAgeAnalysis.p5` | `money` / `text-end` |
| `p6_151_180` | `receivableAgeAnalysis.p6` | `money` / `text-end` |
| `p7_181_Plus` | `receivableAgeAnalysis.p7` | `money` / `text-end` |
| `subTotal` | `receivableAgeAnalysis.subTotal` | `money` / `text-end` |
| `allocated` | `receivableAgeAnalysis.allocated` | `money` / `text-end` |
| `unAllocated` | `receivableAgeAnalysis.unAllocated` | `money` / `text-end` |
| `balance` | `receivableAgeAnalysis.balance` | `money` / `text-end` |
| `badDebt` | `receivableAgeAnalysis.badDebt` | `money` / `text-end` |

## 5. Verification & Safety

- **Source-Only Verification:**
  - `git status` and `git diff` reviewed across all touched files.
  - Net diff: -429 lines across 7 files.
  - Runtime files declared in `tsconfig.app.json` `files` array.
  - Added `showingEntries` with exact parity to `en.ts` and `ar.ts`.
- **Pre-existing Working Tree Preservation:**
  - 11 pre-existing uncommitted files (`CompanyPartner`, `IndividualPartner`, `StatementOfAccount`, `data-table`, `editor-tabs`) were preserved untouched.
- **Prohibited Commands:**
  - Zero build, test, lint, migrations, database commands, or git commits/pushes were run.
- **Pending Verification for Owner:**
  - Browser verification (light and dark theme).
  - Print dialog verification via browser print flow.
  - Excel export verification.
