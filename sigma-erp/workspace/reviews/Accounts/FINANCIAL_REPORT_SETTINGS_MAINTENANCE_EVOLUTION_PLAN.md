# Financial report settings — dynamic cash-flow evolution

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date: 2026-10-23. Scope: professional Financial Report Settings under Accounts,
starting with dynamic cash-flow definitions and mappings. This is the evolving
design for the owner's current discussion. It does not certify the current
cash-flow calculation or silently approve missing accounting rules. The prior
classification/seeding/report-name amendment remains independently implemented
source-only in ACCOUNT_TYPES_FEATURE_REVIEW.md.

## Manifest and selected owners

- Evidence: owner requests and CF-01 screenshot below. Approved: editable default
  rows rather than a fixed list; actual accounts selected from configured types;
  additional detailed types if genuinely needed. Development-stage preference
  favors clear ownership over speculative legacy-client support.
- UI: canonical screen06 tabbed settings workspace, UI1/13/14/16/19/20/22–29.
  Reference: Accounts/Link Accounts/LinkAccounts/components/details and shared
  EditorTabs/EditorDialog/EditableCollectionTable/FieldError/StateMessage.
- Backend: canonical BE16 Settings through IServiceHelper, one save and no
  delete-by-omission; BE17 report reads/calculations; BE8/10 account lookups.
  New named types live in separate files with explicit namespace/import review.
- Keep current tenant repository, root HTTP client and actual access controls;
  no invented permission API. No build/test/browser/database/migration/commit
  commands authorized. Owner/external migration files must be preserved.
- Do not create a generic all-report formula engine, change posting recognition,
  or copy screenshot styling. AccountSetting owns Group/SubGroup/AccountType;
  report settings reference those definitions without duplicate classification.

## Screenshot CF-01

File: C:/Users/user/Desktop/cashflow.PNG. English/LTR configuration state,
approximately725×838 screenshot pixels. Capture date, product version, user role
and actual viewport are Unknown. The screenshot is functional evidence only;
its example account mappings are not approved accounting defaults.

| Evidence | Classification | Required behavior | Phase | Guide representation |
|---|---|---|---|---|
| Cash Flow Statement Settings heading | Explicit | Cash-flow settings entry | 1/5 | Financial Report Settings route with a cash-flow workspace |
| Operating / Investing / Financing groups | Explicit | Three activity categories | 1/3 | Typed logical sections through shared workspace owners |
| Detail and Account columns | Explicit | Named row with multiple selected accounts | 1/3 | Typed row editor and account multiselect |
| Per-row edit action | Explicit | Edit row mappings | 3 | Shared editor dialog; title screen name, subtitle row name |
| Cancel / Save | Explicit | Retain draft until save; discard behavior | 3 | Canonical dirty guard and shared save/confirmation feedback |
| Depreciation, amortization, receivables, payables, inventory, provisions, interest paid, tax paid | Explicit | Eight initial operating row labels | 1/3 | Default bilingual row definitions; formulas/mappings require their own contract |
| Assets, capital investments, dividends received | Explicit | Three initial investing row labels | 1/3 | Same definition owner |
| Long-term debt, dividends paid | Explicit | Two initial financing row labels | 1/3 | Same definition owner |
| Row formulas, signs, requiredness, periods, cash scope | Uncertain | Not proved by screenshot | 0/1 | Explicit calculation freeze before report implementation |

| Visible column | Proposed field | Existing DTO source | Transformation | Filter/sort/export |
|---|---|---|---|---|
| Detail | name/nameLocalized | Missing; new configuration contract | Current-language saved label | Not proved by image; define in UI contract |
| Account | selected accounts | Missing; current CashFlow has no mapping DTO | Code and name for each selected leaf | Not proved; settings grid export is not an assumed requirement |
| Edit | stable row key | Missing; new configuration identity | Shared row action | Not data |

## Existing-state inventory and impact map

| Area | Source / consumer | Current fact | Change classification / target |
|---|---|---|---|
| Chart classification | AccountTypeDefinition and three AccountSetting tabs | Configurable Group → SubGroup → Type → Account;19 stable semantic roles | Keep; use actual definition IDs for filtered choices |
| Type lookup/save rules | AccountSelectionPolicy and PostingSelect | Active placed valid chain; exact role policy; save recheck | Extend narrowly for configured multi-type membership; no label matching |
| Report API | AccountReportsController/CashFlow, CashFlowVm/LineVm, Angular CashFlowStatement | Complete tenant-wide read response with three sections | Extend response for reconciliation/diagnostics; keep one authoritative response for UI/print/export |
| Row mapping | CashFlowAccountCodes | Hardcoded tenant-specific database identities | Replace after new persisted mapping/engine contract is frozen |
| Calculation | GetCashFlowIndirectAsync | Starts from net income; exact-account debit-credit movement or closing-opening deltas | Refactor; distinguish noncash adjustment, working-capital change and actual cash transaction attribution |
| Live ledger scope | AccountReportHelper.QueryDetails | Tenant-scoped, live account/detail/JV, posted and non-voided | Keep as authority; bound day ranges and opening policy explicitly |
| Opening balances | OpeningBalanceJournalVoucherHelper and QueryDetails | Opening JV posted at first fiscal day; cash-flow baseline currently stops previous day | Correct under explicit baseline policy; never treat brought-forward balances as new cash flow |
| Payments | PaymentService / specialized writers | General Add saves payment without JV; specialized flows vary | Inventory/declare ledger-only scope; writer change is a separately frozen accounting slice |
| Cash definition | No current configuration | No explicit cash/equivalent set or opening/closing reconciliation | Create typed cash-scope configuration and authoritative difference |
| Settings persistence | IServiceHelper, BE16 | Canonical single-row or keyed settings; one save, no omission deletion | Reuse; choose normalized keyed rows/mappings rather than parallel generic CRUD |
| Navigation and guide | Accounts sidebar/routes and Accounts guide | AccountSetting and CashFlowStatement exist | Extend with Financial Report Settings; avoid duplicate settings ownership; bilingual guide required |
| Existing/new data | SeedAccountSetupAsync | Full fresh-chart seed; existing chart classification-only | Extend cash-flow template seed idempotently after exact default mapping is frozen; never use database ID constants |

## Options and decisions

| Option | Correctness / maintainability | Cost / risk | Decision |
|---|---|---|---|
| Fixed thirteen rows, accounts only | Small but cannot express evolving disclosures | Less flexible; still needs correct formulas | Owner rejected as sole design |
| Editable default rows with typed account filters and constrained calculation methods | Extensible with one engine, explicit validation and traceability | Requires formula, overlap and period contracts | Owner-selected direction |
| Arbitrary user expressions / scripts | Hard to validate and explain | High accounting and execution risk | Excluded from proposed scope |
| Infer all cash rows solely from account type | Easy but mixed-purpose accounts can be assigned incorrectly | Type cannot prove paid amount or activity | Rejected; type filters choices, explicit mappings drive report |

## Proposed target and ambiguity register

These proposals are reviewable choices, not silently frozen financial policy.

| Concern | Target proposal / exact outstanding decision | Status / evidence |
|---|---|---|
| Menu | Financial Report Settings under Accounts; cash-flow first. Reuse current classification owner rather than copy its three editors | Confirmed outcome; final route/component composition derived during Phase1 |
| Rows | Thirteen bilingual defaults matching visible labels; add/edit named rows, activity, order, allowed types, actual accounts and constrained method | Confirmed dynamic-row/type-filter direction; exact write shape pending |
| Types | Allowed AccountTypeDefinition IDs, several per row; actual active posting leaves must belong to one selected type and valid placement | Confirmed by owner; use existing semantic Kind variants when adequate; new Kind only for a genuinely different role |
| Extra definitions | Possible detailed names: amortization, interest expense, tax expense/payable, provisions, investments and distributions; each must fit its existing group/report meaning | Proposed; do not add enums simply to reproduce report row labels |
| Parent accounts | Select exact posting leaves only; multiselect supports several accounts. No implicit subtree inclusion | Recommended to preserve write/lookup parity and avoid parent/child double-count |
| Report basis | Retain indirect-method purpose, with explicit noncash adjustments and working-capital changes; actual cash attribution for payment/investment/financing rows | Proposed extension of existing purpose; exact per-row method/sign must be frozen |
| Ambiguous multi-line cash allocation | Automatically include only deterministically attributable cash movements. List unresolved journal amounts separately; no proportional invented split. Report cannot be called reconciled while unresolved | Root recommendation after owner asked which choice is correct; explicit owner acceptance still pending |
| Cash and equivalents | Explicit configured posting-account set, initially proposed from reviewed BankAndCash accounts. Not every bank/clearing/PDC account automatically qualifies | Missing accounting scope decision |
| Opening / closing | Opening JV is baseline, not period flow; use consistent accounting-date day boundaries and exclude internal cash transfers from net flows | Recommended accounting correction; exact baseline/date policy pending freeze |
| Overlap | Reject ordinary duplicate leaf membership in equivalent calculation roles. Intentional net-income/noncash add-back is a named role, not prohibited globally | Proposed; exact role/method overlap matrix pending |
| Cash proof | Return beginning cash, ending cash, net flow, difference and unresolved amounts; never auto-create a balancing row | Recommended invariant: beginning + net flow = ending, subject to explicitly disclosed reconciling items |
| Settings history | Effective dated/versioned configurations so editing current mappings does not silently recast historical reports | Missing decision: restate current configuration or effective-period versions |
| Interest/dividend policy | Activity classification and starting profit measure depend on chosen reporting framework/period; image does not prove compliance | Missing; preserve explicit policy rather than claim universal IAS7/IFRS18 compliance |
| Payment coverage | Report uses posted ledger only; unposted/non-ledger payment records are not declared cash movements | Source-derived boundary; changing writers requires a separate exact contract |

## Accounting evidence

Primary source: IFRS Foundation IAS7 overview explains operating/investing/
financing categories and indirect adjustments:
https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows.html/

IFRS18 effect analysis describes changes to the starting profit measure and
interest/dividend classification; do not fix screenshot choices as universally
valid for every framework/period:
https://www.ifrs.org/content/dam/ifrs/publications/amendments/english/2024/effect-analysis-ifrs18-april2024.pdf

Source inspection establishes that movement in an accrual account does not prove
the corresponding cash payment; the proposed engine must separate these bases.
No standard compliance or accounting acceptance is claimed from source inspection.

## Migration and dependency-ordered execution

| Slice | Depends on | Outcome / packet | Completion evidence |
|---|---|---|---|
| Domain freeze | Outstanding calculation/scope/version choices | Typed settings/mapping entities, row identity, lookup/read/save/delete contracts; PHASE00/01 | Frozen contract and exact per-default-row calculation table |
| Settings persistence and seed | Frozen domain | IServiceHelper owner, tenant/FK/unique constraints, idempotent template initialization; PHASE01/03/04 | Source review; owner migration required, suggested AddFinancialReportCashFlowSettings |
| Settings UI/navigation | Frozen API | Routed shared workspace, row editor, type-filtered multiselect, dirty recovery, EN/AR errors; PHASE03/05 | DTO/form parity and canonical conformance table |
| Engine and diagnostics | Frozen formula/overlap/cash/date policy | Replace literal-ID resolver, authoritative rows/totals/reconciliation and unresolved movements; PHASE02 | Source arithmetic and producer/consumer exact comparison |
| Report UI/print/export | Frozen response | Show reconciliation and diagnostic status consistently; no frontend financial re-summing | Current shared report owner; complete-response parity |
| Reconciliation/guide | All above | In-app bilingual guide and PHASE06 handoff | Scoped diff review; owner runtime/data acceptance pending |

Migration is owner-run only. No changes to existing migration/snapshot files.
No silent migration/backfill of literal IDs; defaults must resolve by approved
semantic configuration or reviewed chart seed references. Reads never seed.
Settings omission cannot delete a row; explicit removal is confirmed and must
respect any chosen effective-period history contract. Default seed is idempotent.

## Verification matrix

| Risk | Source verification | Owner execution needed |
|---|---|---|
| Typed references | Same allowed-type/placement predicate on lookup and Save; tenant-owned IDs | Direct invalid/stale payloads, deactivated types and saved draft recovery |
| Double-count | Duplicate/overlap matrix; exact leaves; deliberate adjustment roles | Mixed accounts, transfer, compound cash/noncash JV and reversal examples |
| Baseline/cutoff | Opening JV treatment and end-exclusive accounting dates | Opening-only year, last-day timestamps, fiscal/as-of boundary cases |
| Cash proof | One backend reconciliation response | Known cash ledger dataset and unresolved-journal correction |
| Seed | Stable semantic template keys and no overwrite of valid settings | Fresh/existing tenant, repeated initialize, rollback and concurrent save |
| Presentation | Shared owners, typed forms, both failure channels, one scroll owner | Arabic/English, themes, mobile, print/Excel and keyboard acceptance |

## Implementation approval and decision amendment — 2026-10-23

The owner now explicitly says start implementation and approves the indirect
method starting at net profit, opening-JV baseline, exclusion of internal cash
transfers, disclosed ambiguous cash allocations and reconciliation difference.
The owner chooses independent settings per fiscal year, then explicitly requires
next-year inheritance with independent subsequent edits. These decisions supersede
the pending status of those proposals above. Exact implementation contracts,
per-method arithmetic, template defaults and safe failure/diagnostic boundaries
are frozen in FINANCIAL_REPORT_SETTINGS_DOMAIN_API_CONTRACT_FREEZE.md.
No claim of IAS7/IFRS18 compliance or automatic cash-payment writer repair is made.
The first implementation slice has no unresolved consumed business decision.

## Prior planning handoff (historical; superseded by amendment)

Planning/discovery only for the new cash-flow evolution. No cash-flow source or
navigation was changed by this plan. Missing material accounting decisions remain
visible above under Master2/4 and AGENTS.md; this plan is not yet Frozen. Bounded
read-only backend ledger audit was delegated to report_rollup; root owns target
decisions and integration. PLAN00 and PHASE00–06 recipe Check passed before use;
new scope will require the applicable Phase1 freeze before implementation agents.
