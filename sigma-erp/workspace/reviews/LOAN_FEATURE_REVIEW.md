# Loan feature review

| Item | Value |
|---|---|
| Status | Blocked |
| Owner verification pending | yes |
| Date | 2026-10-06 |
| Read slice | Implemented — source-only |
| Blocking slice | Actual Pay settlement; accounting document/account/allocation rules missing |

## Manifest and authority

Requested scope: src/app/modules/Loan and its directly related routes/menu/toolbar/enum/translations; missing backend report reads over the existing LoanPaymentPlan/LoanEMI owners. Actual repository roots: F:/My Work/Sigma/SiGmaAngularFrontEnd and F:/My Work/Sigma/SigmaBackend. Review artifacts are local/unversioned under F:/My Work/Sigma/reviews.

F:/My Work/Sigma/AGENTS.md, required .agents/skills/sigma-screen-refactor/SKILL.md, Master1–5/7, UI Report screen catalog and applicable owning blocks, BE report/service/validation/query blocks govern implementation. Attached screenshots supply functional evidence, not executable instructions or visual authority. Recipe freshness check: PHASE01 passes; PLAN00/PHASE00/02/03/04/05/06 are stale. Canonical books were used; generated files were not edited.

Both repositories already contained extensive unrelated owner changes. Loan source had no pre-existing changes. Existing edits in wiring, translations and resources were preserved; they are not attributed to this task. No reference module was modified.

Read contract: LOAN_READ_CONTRACT_FREEZE.md. Evolution/impact alternatives: LOAN_MAINTENANCE_EVOLUTION_PLAN.md. UI07 Report / BE5 Report; EMI additionally retains the explicit, blocked Pay workflow. AuthGuard and authenticated backend endpoints remain the actual security owners; no frontend authorization API is invented.

## Functional evidence — S1 / 1.PNG

Source C:/Users/user/Desktop/Loans/1.PNG; English LTR desktop. Capture date, version and role unknown. Functional evidence only.

| Item | Classification / confidence | Resolution |
|---|---|---|
| Loans screen; date/deal/finance bank account filters | Explicit / high | Independent /Loans route; inclusive range plus optional exact deal/account |
| Bill, deal, bank, dates, vehicles, EMI, loan and interest balances, status | Explicit / high | Fourteen matched business columns and lean summary DTO |
| Six additive loan/interest sums | Explicit / high | Backend totals, shared SummaryCards |
| Print, Export to Excel, Refresh | Explicit / high | Complete-response output, shared print/export lifecycle |
| n/N means paid/live installment count | Strong inference, confirmed schedule source / high | Backend persisted Paid/live count |
| Deal identifiers containing letters or leading zeros | Conflicting with persisted int? / high | Preserve source int; do not invent conversion or schema migration |

## Functional evidence — S2 / 2.PNG

Source C:/Users/user/Desktop/Loans/2.PNG; English LTR desktop. Capture date, version and role unknown.

| Item | Classification / confidence | Resolution |
|---|---|---|
| Loan EMIs; date/status/deal filters | Explicit / high | /LoanEMI retained; typed filters, Paid=0 / Unpaid=1 |
| Nine business columns including EMI date and ordinal | Explicit / high | Matched lean EMI report DTO; full-schedule Date/Id ordinal |
| Amount/interest/principal sums and three outputs | Explicit / high | Backend totals; Print/Excel/Refresh |
| Pay on unpaid rows | Explicit existence; workflow accounting details Missing | Shared Pay row action visible only for Unpaid, disabled with explanation |
| Payment document, linked accounts, allocation and reversal rules | Missing / blocked | Await owner's accounting decision; no write endpoint or fake Save |

## Functional evidence — S3 / 3.PNG

Source C:/Users/user/Desktop/Loans/3.PNG; English LTR desktop. Capture date, version and role unknown.

| Item | Classification / confidence | Resolution |
|---|---|---|
| Loan Details; date/deal filters | Explicit / high | Independent /LoanDetails read route without finance lookup |
| Same fourteen columns and six totals as Loans | Explicit / high | Same confirmed summary reader, separate route mode |
| Print/Excel/Refresh | Explicit / high | All matching business rows, not only local page |
| Different details entity/editor or payment workflow | Not evidenced | No new entity/editor invented |

## Column and filter contracts

Every listed business column is displayed and exported in order; no speculative sorting is introduced. All are Explicit screenshot evidence. Id and BillId are the only extra row identities; no audit/tenant/flags/child payloads enter the row DTO.

| Summary grid column | Frontend property / backend property | Display and source |
|---|---|---|
| Bill No | billNo / BillNo | Text; existing Bill/details/{billId} link only for nonblank number |
| Deal No | dealNo / DealNo | Nullable signed integer |
| Finance Bank | financeBank / FinanceBank | Live Account.Name, absent label empty |
| Start Date | startDate / StartDate | Plan.FirstEMIDate; shared date |
| End Date | endDate / EndDate | Last live schedule date, nullable |
| Vehicles | vehicles / Vehicles | Distinct live vehicle plates through BillDetail |
| EMI | emi / EMI | First live schedule amount, nullable; shared money |
| Loan | loan / Loan | Stored plan LoanAmount; shared money |
| Loan Paid | loanPaid / LoanPaid | Sum of Paid schedule principal |
| Loan Due | loanDue / LoanDue | Stored loan less paid schedule principal |
| Interest | interest / Interest | Stored plan interest |
| Interest Paid | interestPaid / InterestPaid | Sum of Paid schedule interest |
| Interest Due | interestDue / InterestDue | Stored interest less paid schedule interest |
| Status | status / Status | Literal paid/live ratio in shared status badge; raw export |

Summary DTO property list beside grid: Id, BillId, BillNo, DealNo, FinanceBank, StartDate, EndDate, Vehicles, EMI, Loan, LoanPaid, LoanDue, Interest, InterestPaid, InterestDue, Status. Totals: Loan, LoanPaid, LoanDue, Interest, InterestPaid, InterestDue.

| EMI grid column | Frontend property / backend property | Display and source |
|---|---|---|
| Bill No | billNo / BillNo | Same nullable-label link guard |
| Deal No | dealNo / DealNo | Nullable signed integer |
| Finance Bank | financeBank / FinanceBank | Live account name |
| EMI No | emiNo / EMINo | Full live schedule ordinal, Date then Id before filters |
| EMI Date | emiDate / EMIDate | LoanEMI.Date; shared date |
| Amount | amount / Amount | Persisted EMI amount; shared money |
| Interest | interest / Interest | Persisted schedule interest |
| Principal | principal / Principal | Persisted schedule principal |
| Status | status / Status | Numeric Paid=0 / Unpaid=1, current-language enum label |

EMI DTO property list beside grid: Id, BillId, BillNo, DealNo, FinanceBank, EMINo, EMIDate, Amount, Interest, Principal, Status. Totals: Amount, Interest, Principal. Shared Actions/Pay is UI state only, omitted from print/export.

| Filter | Contract / evidence |
|---|---|
| Date range | Required ordered valid calendar days; current month; shared dateRangeValidator plus guarded parsing; inclusive last day via backend next-day boundary |
| Summary/details date basis | Reviewer decision (owner standing rule): Bill.Date selects originating loan documents; schedule start/end remain separate |
| EMI date basis | LoanEMI.Date, as shown by EMI Date |
| Deal No | Optional exact Int32, including zero and negatives; source writer has no positive constraint; no invalid-text-to-absence coercion |
| Finance Bank Account | Loans only; optional positive live account id, lookup from loan-referenced live accounts |
| Status | EMI only; optional numeric enum, null=both, zero is retained during serialization |
| Search / Refresh / Reset | Explicit Search; Refresh reissues current valid filters; edits invalidate output; Reset restores current month and not-run/page1 |
| Paging / output | Complete response, local shared15 paging; isComplete plus count equality required before acceptance; Print/Excel all rows |

## Frozen API and decisions taken

Authenticated GET LoanReport/loans, /details, /emis return Result of the matching report; /finance-banks returns Results<DropdownDto>. Required dates and optional filters use the existing Filters dictionary convention and shared serializer; reports return rows/totalCount/isComplete/totals, without Skip/Take.

| Decision | Evidence / resulting implementation |
|---|---|
| Domain owner and compatibility | Bill owns plan/generated schedule. Existing entities, EF, DTOs/maps and writers retained; old LoanEMI frontend had no matching backend reader |
| Screen shape | UI07 report; one typed mode-based Loan family lifecycle/template over canonical visual owners |
| Missing read API | Dedicated interface/service/controller, lean projections, existing assembly DI scan |
| Calculation ownership | Backend only; financial totals aggregate in SQL; due values subtract persisted paid-schedule totals from stored plan headers |
| Paid meaning | Persisted Paid schedule status, not reconciled bank/ledger settlement; no new accounting effect |
| Tenant / live rows | QueryReport on every plan, bill, EMI, account, BillDetail and vehicle owner; live tenant parent joins and Bill.IsLoan required |
| Nullable relationships | Left account join; nullable end/EMI/bill labels remain empty; no invented names or zero installment amounts |
| Numbering | Full-schedule Date/Id ordinal; generic entity No and filtered row index rejected |
| AutoMapper | No map needed for explicit new report projection; existing profiles untouched |
| Transactions | Read-only; no SaveChanges, write transaction or journal |
| Actions / permissions | Bill navigation; shared Pay unavailable only for Unpaid; no custom permission model, no editor/delete/approval |
| Wiring | Three lazy routes and menu links; suppress duplicate toolbar title only for Loan report routes; existing /LoanEMI compatibility |
| Interceptors / failure | Existing HttpClient provider; X-Skip-Error-Interceptor true for one inline failure owner; both declared and transport failure paths |
| Shared extraction gate | Reuse existing ReportPage/Actions, FeatureTitle, DataTable, SummaryCards, DatePicker/FieldError, status badge, query/date/enum/error/print/export utilities. No new generic owner or copied private component CSS |
| Persistence / migrations | No entity/configuration/snapshot/schema change; Add-Migration not required |

## Reference conformance reconciled

| Concern / book | Actual reference / shared owner | Final source match |
|---|---|---|
| Shell/title UI1/3/20 | StatementComponent; ReportPage/global report panel; TrialBalance family shell | Fill/print route host, one primary report panel/title; toolbar duplicate suppressed |
| Filters/actions UI17/20 | Accounts report family; DatePicker/dateRangeValidator; ReportActions | Stable shared strip, one typed form/submit, conditional controls in same form, explicit feedback and actions |
| Grid/data UI5/6/20 + BE17 | Statement typed DataTable; QueryReport | Full typed arrays, local15/fill, shared formats; flag/count proof before outputs |
| States UI22/28 | StateMessage/apiErrorMessage; switchMap/finalize lifecycle | Declared/HTTP errors, lookup Retry, no duplicate toast, not-run/empty separation, destroy cancellation |
| Print/export UI8/21 | ReportPrintService session; dataTableExportRows | All rows, form disabled while printing, pager/scroll release, page retained, Actions omitted, click-time labels |
| Summary UI24 | Shared SummaryCards | Backend-owned figures, dense/row public sizing and 12px host-to-grid separation; no client sums |
| Literal status UI5/6 | Typed cellTemplate/shared sigma-status-badge | n/N rendered literally, export raw field; EMI translated status keys remain separate |
| Backend BE10/17 | Actual DailyServiceLogReportService/controller and DI Scan | Explicit lean report service; live tenant owner joins, SQL aggregates, all async reads cancellable |

Runtime/visual comparison remains pending; class-name similarity alone is not claimed as visual acceptance. No new reusable rule required documentation-book changes.

## Files changed by this task

Frontend root F:/My Work/Sigma/SiGmaAngularFrontEnd:

- src/app/modules/Loan/Loan EMI's/LoanEMI/components/list/list.component.ts
- src/app/modules/Loan/Loan EMI's/LoanEMI/components/list/list.component.html
- src/app/modules/Loan/Loan EMI's/LoanEMI/components/list/list.component.scss — deleted empty file and stale style reference
- src/app/modules/Loan/Loan EMI's/LoanEMI/components/list/list.component.spec.ts — deleted copied widget-only fixture, which tested a different feature
- src/app/modules/Loan/Loan EMI's/LoanEMI/models/list.ts
- src/app/modules/Loan/Loan EMI's/LoanEMI/models/resultsLoanEMI.ts
- src/app/modules/Loan/Loan EMI's/LoanEMI/services/loanemi.service.ts
- src/app/modules/Loan/Loan EMI's/LoanEMI/loanemi.routes.ts
- src/app/_metronic/shared/enums/loanEMIStatus.ts
- src/app/pages/routing.ts — scoped Loan route additions
- src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts — scoped Loan links
- src/app/_metronic/layout/components/toolbar/toolbar.component.ts — scoped Loan title suppression
- src/app/modules/i18n/vocabs/en.ts — Loan keys only
- src/app/modules/i18n/vocabs/ar.ts — Loan keys and missing Loan menu keys only

Backend root F:/My Work/Sigma/SigmaBackend:

- SiGma.Helpers/Dtos/LoanReport/LoanSummaryReportDto.cs
- SiGma.Helpers/Dtos/LoanReport/LoanSummaryReportRowDto.cs
- SiGma.Helpers/Dtos/LoanReport/LoanSummaryReportTotalsDto.cs
- SiGma.Helpers/Dtos/LoanReport/LoanEMIReportDto.cs
- SiGma.Helpers/Dtos/LoanReport/LoanEMIReportRowDto.cs
- SiGma.Helpers/Dtos/LoanReport/LoanEMIReportTotalsDto.cs
- SiGma.ViewModels/ViewModels/LoanReport/LoanReportFilterVM.cs
- SiGma.Business/IServices/ILoanReportService.cs
- SiGma.Business/Services/LoanReportService.cs
- SiGma.ServerAPI/Controller/LoanReportController.cs
- SiGma.Helpers/Localization/Shared/GeneralMessage.resx — two scoped validation keys
- SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx — same two keys

Coordination artifacts: LOAN_MAINTENANCE_EVOLUTION_PLAN.md, LOAN_READ_CONTRACT_FREEZE.md, this LOAN_FEATURE_REVIEW.md. No unrelated Git changes are included in this ownership list.

## Final reconciliation and verification

| Phase | Result |
|---|---|
| PLAN / 0 | Discovery/evidence/impact complete; missing payment and conflicting deal text explicitly recorded |
| 1 | Reader DTO/filter/endpoint/calculation/wiring contract Frozen |
| 2 | Three reports, complete readers, filters, columns, backend totals and output implemented — source-only |
| 3 | No report editor required; payment form blocked rather than made into a fake financial Save |
| 4 | Actual settlement Blocked; no transition/write performed |
| 5 | Routes/menu/toolbar, API wrappers, numeric enum, translations and DI integration source-reviewed |
| 6 | Scoped source/diffs reconciled separately per repo; owner execution/visual acceptance pending; overall status Blocked only for missing payment decision |

Source review covers every Loan-owned frontend diff, all new backend files, scoped shared wiring/translation/resource hunks, references, DTO/enum identities, stale imports, no local financial formulas and no merge markers. Git diff --check passes scoped tracked changes (only configured LF-to-CRLF notices). The agent checked whitespace for new backend files. Read-only translation parity: loanEMI + loanReports contain 50 keys each in EN/AR, zero missing and zero case-only drift. XML resources parse; both new keys occur exactly once per language. No build/test outcome is claimed.

Final root check also found no new-file trailing whitespace or scoped merge markers. sideMenu.loans parity: three keys in each language, zero missing/case drift.

Independent agent audit found signed-deal restriction, absent date control validator, blank BillNo links, and literal status passed to a translation-key API. Root repaired each. Root also preserved disabled Pay through shared actions and excluded actions while printing. Final source review verified those repairs.

A dormant out-of-scope Assets/depreciationDetail goToPay method targets /LoanEMI/create; no template currently calls it. It was not changed or revived.

## Remaining uncertainty, risks and owner steps

1. Actual Pay requires the payment document, principal/interest account mapping, allocation link, partial-payment policy, reversal/idempotency/concurrency rules. No answer has supplied those semantics. Skill rule7 states: “Still wait for the user on data destruction, access restrictions and accounting effects.” This is an explicit boundary, not an inferred approval requirement.
2. Deal No text/leading-zero preservation is impossible in the existing nullable int storage. No conversion/backfill was assumed.
3. The summary date choice is a source-supported reviewer decision, not a screenshot-proven accounting policy; owner should confirm Bill.Date is the desired report date.
4. Paid/due figures are scheduled-status summaries. Existing BillService.LoanPaymentPlanDetailAsync still has a hardcoded paid-zero footer; Bill edits rebuild the schedule. Those writer/detail behaviors are outside this reader task and must be considered before enabling settlement.
5. Owner should compile the affected Angular/backend repositories, then verify authenticated endpoints, default camel-case acronym JSON fields, EF SQL translation and report numbers against actual stored schedules. Build/runtime/SQL performance was not executed.
6. Use zero/negative Int32 deals, Paid=0, same-day/month-end ranges, partial/reversed dates, no schedule, missing labels, deleted/other-tenant relationships, and both failure channels. Check bank lookup failure/Retry and stale-output invalidation.
7. Verify over100 matching rows: local page2 and nondefault size, Print/Excel include all business rows and totals, print excludes Actions, cancel/finish restores page and filter state. Switch AR/EN before export; verify RTL/light/dark/narrow layout and exactly one table scroll owner. No browser acceptance has been claimed.
8. Multiple report statements do not promise a transactionally frozen snapshot under concurrent writers. The completion flag/count proves cardinality, not cross-query transaction isolation. Owner should validate concurrency expectations before combining settlement with these readers.
9. No Add-Migration is required. Deploy backend and frontend together because the newly confirmed read API replaces previously unmatched frontend assumptions.

Illustrative source reasoning, not executed tests: for stored principal1000/interest100 with two scheduled installments of principal500/interest50, no Paid rows yields paid0/due1000 and interest due100/status0/2; first Paid yields paid500/due500 and interest paid50/due50/status1/2; both Paid yields zero dues/status2/2. Actual figures remain the backend response.

## Agent utilization and handoff

Root owned discovery, contract freeze, frontend and shared scoped hunks, cross-layer decisions and final reconciliation. One bounded agent loan_backend used gpt-5.6-sol with high reasoning as allowed by Sigma AGENTS routing. It owned only the ten new backend read files and the two resource keys after freeze; later read-only frontend audits reduced independent-review risk without overlapping edits. Root reviewed/integrated the entire output and repaired audit findings. Parallel frontend/backend implementation reduced serial waiting; no uncontrolled agent work was used.

Suggested frontend commit: feat(loan): adopt shared loan reports and separate routes
Suggested backend commit: feat(loan): add loan schedule and balance report readers

These are suggestions only. No builds, tests, lint, browser/app verification, database commands, migrations/snapshot edits, commits, pushes, deployment, Graphify or Sigma MCP were run.

## Owner follow-up — remove startup instruction

2026-10-06: removed only the loanReports.notRun StateMessage branch from the shared list.component.html at the owner's explicit request. It applies to Loans, Loan EMIs and Loan Details. Error feedback and internal hasSearched gating remain. Source diff and whitespace reviewed; no runtime/build commands. No subagent needed for this small template change. Suggested frontend commit: fix(loan): remove report startup instruction.

## Owner follow-up — filter action alignment and menu icons

2026-10-06: the owner reported buttons below the filter level and Loan sidebar leaves without icons. Updated the same shared Loan list.component.html to UI20's existing inline/stable grid, counting two fields for Details and three for Loans/EMIs. Shared sigma-report-filter-field--actions plus an invisible aria-hidden caption aligns action controls to input controls; the shared action group retains wrapping and common34px height. Added existing sidebar-library icons and shared tones only to the three Loan leaves in sidebar-menu-data.ts: coins/blue, calendar/amber, invoice/teal. Actual reference: Accounts report-family inline action wrapper and global src/styles.scss, plus existing Banking sidebar leaves/icon renderer. No new styles or reusable rule; backend, validators, busy guards, search and output semantics unchanged. Source diff/whitespace reviewed; browser visual acceptance remains pending under source-only boundary. No subagent needed for this bounded presentation fix. Suggested frontend commit: fix(loan): align report actions and add sidebar icons.

## Owner follow-up — application loader

2026-10-06: reviewed UI22 and skill Two-Tier Loading rule, root LoadingService, BaseComponentService, app-content subscriber/backdrop, scoped providers, and the report reference. Documentation clearly requires global loading for screen data and local signals for control state; auxiliary lookups normally remain local. All three Loan report Search/Refresh modes were already globally bound. The opening finance-bank read was local only. Following the owner's explicit request, loadBanks now uses the same application loader with finalize cleanup, including Retry, and the separate local loading banner was removed. loadingBanks now contributes to form busy; local state still guards controls. This feature-specific lookup exception is recorded in the contract; no general documentation rewrite or unrelated shell change is justified. EMI/Details opening performs no API read; report loading remains on Search/Refresh, without artificial spinners or an unrequested auto-search change. Source-only review covers success/declared failure/HTTP failure/destroy paths; runtime visibility is not asserted. Changed list.component.ts and list.component.html only, plus existing review records; no new agent needed. Suggested frontend commit: fix(loan): use application loader for finance bank loading. No prohibited commands run.
