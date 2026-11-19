# Loan read contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-06 |

Authority: Sigma AGENTS, Master1–5/7, UI1/2/3/5/6/8/16/17/20–29, BE3/6/9/10/17/18. Plan: LOAN_MAINTENANCE_EVOLUTION_PLAN.md. Only the read handoff is frozen; payment is not approved.

## API and wrappers

All endpoints authenticated GETs, using the existing interceptor client/environment.baseUrl and X-Skip-Error-Interceptor for inline feedback.

| Endpoint | Input | Response |
|---|---|---|
| LoanReport/loans | Filters[fromDate,toDate,dealNo,financeBankAccountId] | Result<LoanSummaryReportDto> |
| LoanReport/details | Filters[fromDate,toDate,dealNo] | Result<LoanSummaryReportDto> |
| LoanReport/emis | Filters[fromDate,toDate,dealNo,status] | Result<LoanEMIReportDto> |
| LoanReport/finance-banks | none | Results<DropdownDto> id/value; referenced live finance accounts |

Report payloads: rows (complete ordered array), totalCount (all matching rows), isComplete=true, totals. No Skip/Take; no server paginator. Frontend proves isComplete and matching count before accepting output; uses local paging with shared default 15, print all rows, export all rows. Bank lookup is optional filter data; failure blocks selecting it/Search on loans and offers Retry. EMI/details do not load bank options.

## Filters

| UI | Angular | Query / parser | Meaning / default |
|---|---|---|---|
| Date range | dateRange: Date[] / string / null | fromDate,toDate; FilterHelper.GetDate | Required valid inclusive calendar days; currentMonthRange; summary Bill.Date, EMI LoanEMI.Date |
| Deal No | dealNo: string / null | dealNo; GetInt | Optional exact int, source DealNo is int?; zero is valid, invalid text rejected, never coerced to absence |
| Finance Bank Account | financeBankAccountId: number / null | financeBankAccountId; GetInt | Loans only, positive ID; null omitted |
| Status | status: LoanEMIStatusEnum / null | status; GetInt + IsDefined | EMI only, Paid=0, Unpaid=1; null both; zero serialized |

Same-day boundaries accepted; toDate exclusive-next-day query; DateTime.Min/Max rejected. Deal labels in screenshots contain alphanumerics/leading zeros but source stores int?: preserve current persistence, expose numeric values, record limitation rather than schema/backfill guess.

## Grid alongside DTO

Summary column / frontend property / DTO property (same order): billNo/BillNo (text link to existing Bill/details/{billId}); dealNo/DealNo (number); financeBank/FinanceBank (text); startDate/StartDate (date); endDate/EndDate (date nullable); vehicles/Vehicles (text); emi/EMI (money nullable); loan/Loan; loanPaid/LoanPaid; loanDue/LoanDue; interest/Interest; interestPaid/InterestPaid; interestDue/InterestDue (money); status/Status (paidCount/liveCount string badge). Additional id/Id (plan identity), billId/BillId (existing navigation). No audit/tenant/flags/child DTOs. Totals: loan,loanPaid,loanDue,interest,interestPaid,interestDue.

EMI columns / frontend property / DTO property: billNo/BillNo (link); dealNo/DealNo (number); financeBank/FinanceBank (text); emiNo/EMINo (number); emiDate/EMIDate (date); amount/Amount (money); interest/Interest (money); principal/Principal (money); status/Status (numeric Paid=0/Unpaid=1 badge, current-language label). Additional id/Id, billId/BillId. Totals: amount,interest,principal. Pay is blocked, visibly explained; no enabled financial Save or endpoint.

All business columns exported in the same order with click-time translations/shared formatters; no speculative sorting. Original no/eMINo/eMIDate/bankId frontend mismatch replaced by confirmed new reader DTOs. Old entity VMs remain compatible for Bill consumers.

## Producer / calculations / failure

UnitOfWork.QueryReport for plans, bills, EMI, BillDetail, Vehicle, Account with live tenant owner joins. Never trust a navigation alone to enforce tenancy/soft deletion. Plan rows only when live tenant Bill.IsLoan==true. EMI numbering counts preceding live rows in same plan (Date,Id), before status/date filter. Paid uses persisted status only; due uses stored header minus sums of paid scheduled principal/interest. Summaries include full schedule even when selected by Bill.Date. Vehicles read in one bounded query, no per-row fetch; totals database aggregation over filtered projections. No client financial formula and no journal effects.

No AutoMapper required for new report projection; existing profile untouched. DI assembly scan already registers implemented interfaces. One class per file. API validation/localized safe messages on business failure; HTTP errors restored to inline owner; no duplicate toast. CancellationToken reaches every async read.

Routes: /Loans, /LoanEMI (compatibility), /LoanDetails; shared Loan family presentation with route mode. No new HttpClient provider, permissions, editor or schema. UI edits invalidate response/totals/output; valid Search freezes filters, disables form until finalize; requests cancel on destroy/new trigger. Print uses shared session, disables form, removes local paging/scroll bounds and restores state.

## Integration clarification — 2026-10-06

These points implement the frozen read contract without changing persistence or accounting ownership:

- Exact Deal No accepts the full signed Int32 range, including zero. Existing Add/Update inputs have no positive-number restriction; bank IDs alone require positivity. Frontend pattern/min/max and API GetInt agree.
- Required dateRange also uses the shared dateRangeValidator, so invalid, partial and reversed typed ranges produce inline control feedback before Search.
- BillNo links activate only for a nonblank label; missing labels remain empty.
- Summary n/N is a literal business value. A typed cell template uses the shared sigma-status-badge; export reads the original status field without translation-key coercion. EMI statuses retain translated numeric-enum labels.
- Pay is retained through the shared typed row-action owner, visible for Unpaid only and permanently disabled. The explanatory message remains visible. No mutation, success message or payment endpoint exists. Actions are omitted during print and are not part of business-column Excel export.
- Search is explicit after the current-month default; Reset returns to not-run. SummaryCards host has the required 12px separation from the grid, without private-card or feature SCSS.

## Owner UI amendment — 2026-10-06

The owner explicitly requested removal of “Choose filters and click Search to load the report.” The shared Loan template no longer renders the not-run instruction on any of its three routes. Internal not-run state still prevents premature empty results and output. No filter, API or financial contract changes.

The owner subsequently requested action/filter alignment and sidebar icons. Loan opts into UI20's existing shared inline/stable filter grid: two business fields for Details, three for Loans/EMIs, plus the shared actions field and invisible accessible-caption geometry. Existing action-group wrapping and 34px controls retain global responsive/RTL rules. Loan sidebar leaves receive existing Font Awesome coins/calendar/invoice icons and shared blue/amber/teal tones. No business/API/SCSS change.

## Owner loader follow-up — 2026-10-06

The owner requested the application's loader for Loan page requests. Report Search/Refresh already start BaseComponentService.loading and release it in finalize for all three route modes. The initial Loans finance-bank read now also starts/releases that same root LoadingService, including Retry; local loadingBanks remains for busy/disable guards, with no separate loading StateMessage. Form busy now includes this request. This is a scoped owner-requested departure from UI22's auxiliary-local-lookup default, not a change to the general book rule. No artificial route spinner or new automatic report fetch was added to EMI/Details, which have no opening HTTP read under the existing explicit-Search contract. Visual/runtime acceptance is still pending; source shows one start/finalize-end pair per Loan request and no local provider overriding LoadingService.
