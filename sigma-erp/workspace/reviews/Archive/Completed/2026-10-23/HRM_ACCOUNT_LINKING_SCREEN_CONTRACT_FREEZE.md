# HRM Account Linking — screen contract

| Gate | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Scope | HRM Administration Account Linking and its direct API/wiring/guide |

This freeze records the repaired contract after provisional edits in the preceding turn. Those edits preceded the required artifact gate; they do not count as historical conformance evidence. The continuation reviews and replaces them against this contract before handoff.

## Authority and evidence

AGENTS.md, sigma-screen-refactor skill, Master 2/4/5/7, backend 3/4/5/6/8/10/16, UI screen 06 and blocks 1/3/10/14/16/19/22–29 apply. Initial generated recipe check passed all eight packets; phases 00/01/02/03/05/06 apply. Phase 04 is inapplicable: ordinary settings Save has no accounting/state transition. Source-only verification; no builds, tests, lint, browser, database, migrations, commits or pushes.

| Supplied evidence | Classification | Result |
|---|---|---|
| 6.PNG, named salary rows, three ledgers, Save All | Confirmed functional/content evidence | Implement settings matrix using canonical owners |
| 6.PNG, grey versus white cells | Confirmed interaction clue | Server owns editable slots below; grey cells stay disabled |
| 6.PNG, two unlabelled leading rows | Uncertain content | No named business item can be proved; omit blank rows |
| 7.PNG / 8.PNG pay structure | Confirmed separate screen content | HRM Settings is outside the explicitly named directory; no formulas inferred |
| 9.PNG Common | Confirmed separate screen content | No account-linking mode, attendance or WPS contracts invented in this screen |
| Payroll posting from saved links | Not proved; no existing consumer | Configuration storage only; no journal or payroll calculation change |

## Frozen read, edit and save

UI shape: one routed settings workspace, no artificial CRUD, tabs, paging, filters, Add/Delete or export. Columns: salary item type, staff ledger account, expense ledger account, provision ledger account. A dedicated compact HRM row VM contains `value`, `settingKey`, `editableRoles`, `staffAccountId`, `expenseAccountId`, `provisionAccountId`; these exactly supply the four columns and disabled state.

Use the existing tenant-owned LinkAccounts table. Append `LinkAccountsType.Hrm = 8` without changing original values. `Value` is a new screenshot-specific salary-item enum 1–18, `SubType` is Staff=1/Expense=2/Provision=3, `JobType=null`, `LinkSection=Default`. These are configuration keys, not replacements for SalaryComponentType or SalaryItemType calculation enums. Existing EF logical-key index already covers these keys; no schema/configuration or migration change.

Read: `GET LinkAccounts/hrm` returns `Results<HrmAccountLinkRowVM>` in screenshot order. Reads never insert. Latest physical row wins including intentional null. Account references must be tenant-visible, active, not deleted and posting (`AllowChildren=false`); stale references display null without a read mutation. Lookup reuses Account/GetSelect's matching predicate.

Save: existing `POST LinkAccounts/upsert`, request exactly `replaceTypes:[8]` and mappings with only editable keys. HRM and generic types cannot be mixed in a single request. Validate both tuple key enums and slot eligibility, fixed dimensions and supplied account references before tracking changes. Request duplicate keys follow canonical last-wins rule. Use `IServiceHelper.UpsertByKeyAsync`, scoped exclusively to Hrm, then one SaveChangesAsync. Omitted keys/legacy duplicates are preserved. Null explicitly unlinks. No delete or auto-create-account action. Original general-account persistence remains outside scope and unchanged; generic option lists and auto-link discovery exclude Hrm to prevent cross-surface side effects.

| Salary key | Staff | Expense | Provision |
|---|---|---|---|
| Basic, HouseAllowance, TransportationAllowance | disabled | editable | disabled |
| Gross | disabled | disabled | disabled |
| OvertimeNormal, OvertimeHoliday | disabled | editable | disabled |
| AirTicket | disabled | editable | editable |
| LeaveEncashment, Insurance | disabled | editable | disabled |
| LeaveSalary | disabled | editable | editable |
| AdvanceDeduction, LoanDeduction | editable | disabled | disabled |
| AbsentDeduction, UnpaidLeaveDeduction | disabled | editable | disabled |
| FinesDeduction | editable | disabled | disabled |
| ExtraDeduction, HalfpaidLeaveDeduction | disabled | editable | disabled |
| Gratuity | disabled | editable | editable |

Reactive typed row controls retain disabled roles and stable row identity. One atomic read loads settings and lookup; a failure hides editable content and exposes Retry. No Save before successful read/lookup, while reading/saving/confirmation, or for an unchanged snapshot. Freeze controls on Save and discard; preserve draft on failure. One global success-toast owner; inline errors own both failure channels. CanDeactivate uses shared confirmation, deferred gates, and cancellation restores original disabled states. EN/AR labels and per-row accessible input identifiers apply. Page title inside panel; shared table frame owns the single scroll viewport, sticky header and fixed column widths.

## Reference conformance before continuation edits

| Concern | Book | Actual reference / shared owner | Target decision |
|---|---|---|---|
| Workspace/title/Save | UI1/3, screen06 | Accounts LinkAccounts details; FeatureTitle/PrimaryActionButton | One panel, no duplicate toolbar; no tabs because only one set |
| Editable rows | UI14/16 | EditableCollectionTableComponent/RowDirective | Public fillHeight/stickyHeader; 25% columns, minimum 68rem; no copied frame CSS |
| Lookup | UI16, BE16 | AccountService.GetSelectAsync; BaseService.getSelectList | Matching active posting-account predicate |
| Discard | UI10 | shared ConfirmationDialogService and freezeFormState; Accounts details.canDeactivate | Deferred guard, typed controls, pending freeze |
| Persistence | BE16 | ServiceHelper.UpsertByKeyAsync; notifications settings pattern | Tuple key, HRM scope, one save, no omission deletes |
| Mapping | BE4 | LinkAccountsProfiler mapping editable mapping VM to entity | Reuse one-way map; no audit/identity input and no ReverseMap |
| Routes/errors/guide | UI1/22/23, Master7 | AuthGuard shell; StateMessage; UserGuide hrm-guide | AccountLinking lazy route, guard, typed local errors and HRM guide topic |

No permissions are inferred: existing shell authentication only. The storage/configuration extension is the minimal source-supported resolution permitted by Master2. Accounting effects, access changes and data destruction are not part of it. Final source comparisons and owner acceptance are recorded in the feature review.

Continuation integration note: salary keys are explicitly persisted in screenshot order: Basic=1 through ExtraDeduction=16, Gratuity=17 and HalfpaidLeaveDeduction=18. The isolated worker's provisional reversal of the final two keys was corrected before any runtime execution. HRM validation and success feedback use bilingual server resources. There was no schema or business-contract expansion.

## Amendment — 2026-10-11: shared loading and Complete Missing Links

Status: Frozen. Owner verification pending: yes.
User instruction: use the loader used throughout the application and add Complete Missing like Link Accounts. This supersedes the earlier no-auto-link action boundary for this screen only.

- LoadingService is the single global loading owner for initial load, Retry, Save and post-Apply refresh; every start is paired with finalize/end. Local busy/error flags remain.
- Reuse the existing LinkAccountsAutoLinkComponent unchanged through a component-scoped LinkAccountsService alias to HrmAccountLinkingService. No new HttpClient/interceptor chain. Existing general Accounts UI remains unchanged.
- GET LinkAccounts/hrm/auto-link/plan and POST LinkAccounts/hrm/auto-link/apply return Result<LinkAccountsAutoLinkPlanVM>. No client plan payload: Apply rebuilds the plan. Only type Hrm, the catalog's eligible salary/ledger keys, JobType=null and LinkSection=Default participate. General auto-link and payroll ApplySlot remain excluded from HRM.
- Preview has no writes. Apply explicitly confirms planned links/account creation in the existing modal, runs transactionally, uses AccountService for posting-account creation and ILinkAccountsService.SaveAsync (IServiceHelper) for HRM persistence. Tenant/live/active posting predicates match HRM Save. Existing valid links are preserved; unavailable/stale targets count as missing; omissions never delete.
- Source-supported conservative parent rules: Expense uses Expense/AdministrativeExpense, Admin Salaries or Administrative Expenses; Advance/Loan Staff uses Asset/CurrentAssets Staff Advances; Fines Staff uses Liability/CurrentLiabilities Staff Deductions. AirTicket/LeaveSalary Provision uses Liability/CurrentLiabilities only a specifically named Staff Provisions/Employee Benefits group; Gratuity Provision uses Liability/LongTermLiabilities only a specifically named Staff Provisions/Employee Benefits group. Never fall back to unrelated loan/customer/tax groups. Missing or ambiguous suitable parent/account stays Manual. This preserves accounting classifications without inventing defaults. Item labels and account names identify both salary item and role.
- Opening the dialog requires screen readiness and no load/save/confirmation. Dirty drafts require the shared discard confirmation; cancel preserves the draft. The form is frozen during the modal; Save/navigation are gated. After Apply and close, reload both mappings and account options; show one composite success only after reload succeeds and loading ends. Mutation suppresses interceptor success.
- Source evidence: UI22 LoadingService/finalize and composite feedback; UI11 shared confirmation above modal; BE16 settings through helper/no omission deletion; Accounts LinkAccountsAutoLinkComponent and AutoLinkService transaction/preview; SeedDataService named chart groups. No journals, migrations, schema, permission or HRM Settings changes.
- Conformance: modal/columns/count cards/confirmation exactly reuse LinkAccountsAutoLinkComponent; loading reuses shared LoadingService; HRM existing matrix and typed payload retain their approved owners. Source-only verification under PHASE01/04/05/06; runtime/build remains owner-pending.

Shared dialog wording amendment: keep the reference dialog source unchanged. Its existing EN/AR rule translation now describes matching posting accounts, the parent shown in preview, and Manual for unsuitable/ambiguous matches, accurately covering both existing Accounts and the new HRM consumer without presenting Accounts-only group rules to HRM. No general Accounts behavior changed.
