# Accounts workspace API discovery

| Status | Owner verification pending |
|---|---|
| Draft | yes |

## Scope and evidence

This is a bounded, source-only discovery for the frontend roots `Account`, `Link Accounts`, `FiscalYears`, and `MonthClose` under `SiGmaAngularFrontEnd/src/app/modules/Accounts`, plus directly related backend controllers, services, validators, entities, and view models. No application source, generated packet, migration, database, build, test, lint, browser, or git state was changed. The required recipe check reported `OK` for plan-00 and phases 00–06.

Applicable authority read: `SIGMA_FEATURE_REVIEW_MASTER.md` blocks 4–5; UI blocks 1, 2, 3, 7, 9, 13, 15, 16, 22, 23, 26, 27; backend blocks 3, 5, 6, 7, 8, 9, 10, 12, 13, 16, 18; `sigma-screen-refactor/SKILL.md`; generated phases 00–05. Canonical shape selection remains an owner contract-freeze decision.

## Existing routes and request contracts

### Account hierarchy

Frontend route: `Accounts` module loads `Account_Routes`; `''` renders `Account/components/list/AccountsComponent`, and `details/:id` is also declared, while the list currently opens `DetailsComponent` as an editor dialog. The Angular service calls:

| Operation | Route and request | Response/use |
|---|---|---|
| Tree | `GET Account/TreeList` | `Results<AccountTreeNodeResponse>` mapped to `AccountNode`; node fields are `key`, `label`, `expanded`, `hasTransactions`, `allowChildren`, `children`. |
| Subgroups | `GET Account/SubGroups?category={number}` | `Result<DropDownSelect[]>`. |
| Create | `POST Account` body `{name, notes, parentId, subGroup, allowChildren, costCenterRequired, defaultCostCenterId}` | `Result<number>`; success id refreshes tree. |
| Update | `PUT Account` body `{id, name, notes, parentId, subGroup, allowChildren, costCenterRequired, defaultCostCenterId}` | `Result<number>`; success refreshes tree. |
| Delete | `DELETE Account?id={id}` | `Result<number>`; confirmation then tree refresh. |
| Convert posting account | `POST Account/{id}/ConvertToGroup` body `{name}` | `Result<number>`; server returns new child id and message; confirmation/form validates required max 100 client-side. |

Backend `AccountController` inherits generic CRUD routes and adds `TreeList`, `SubGroups`, `ByParentIdOrContactType`, and `POST {id}/ConvertToGroup`. `AccountService` owns tree projection and conversion. `AccountAddVM`/`AccountUpdateVM` carry only editable fields; `AccountDetailVM` exposes editor fields plus `HasTransactions`/`HasChildren`; `AccountListVM` is materially wider than the tree consumer and is not the tree response. `AccountValidator` confirms: level 1 is fixed; parent is required and cannot change; max depth is 5; parent must allow children and have no transactions; level 5 is always leaf; parent accounts cannot have cost centers; cost-center/default references must exist; level-2 subgroup is required/category-compatible and descendant transactions block subgroup changes; deletes require non-root, no children, and no transactions.

Frontend action guards mirror only part of the invariant: `AccountsComponent.canAddChild` checks level `<5`, `allowChildren`, and no transactions; `canConvertToGroup` checks leaf and level `<5`; `DetailsComponent.canDeleteCurrent` checks no transactions/no children/non-root. Backend remains authoritative for all guards and references. Conversion is a transactional backend transition that changes the old row to a group, creates a posting child, and moves journal/link/opening-balance/budget and related account references, including soft-deleted rows.

### Link Accounts settings

Frontend route: `LinkAccounts_Routes['']` renders `LinkAccounts/.../DetailsComponent` and has a `CanDeactivate` guard for unsaved changes. The service calls:

| Operation | Route and request | Response/use |
|---|---|---|
| Read tab/type | `GET LinkAccounts/by-type/{typeId}` | `Results<LinkAccountsSectionVM>` flattened to `LinkAccountsListVM[]`; server synthesizes required rows and section metadata. |
| Options | `GET LinkAccounts/options` | `Result<LinkAccountsOptionsVM>` containing account types, charge modules, item types, job types, and link sections; cached with `shareReplay`. |
| Save all | `POST LinkAccounts/upsert` body `{replaceTypes:number[], mappings: LinkAccountsUpsertDTO[]}` | `Result<null>`; all tab payloads are combined and `replaceTypes` is every loaded tab. |
| Auto-link preview | `GET LinkAccounts/auto-link/plan` | `Result<LinkAccountsAutoLinkPlanVM>` with item actions `LinkExisting`, `CreateAccount`, or `Manual`, counts, and optional default-group changes. |
| Auto-link apply | `POST LinkAccounts/auto-link/apply` body `{}` | `Result<LinkAccountsAutoLinkPlanVM>`; tabs reload after apply. |

`LinkAccountsController` is `[Authorize]` and exposes exactly those five endpoints. `LinkAccountsService.SaveAsync` requires non-empty `ReplaceTypes`, validates enum values and that each mapping type is declared, normalizes contact/payment dimensions, validates bank/account/workshop references, and reconciles the submitted types by real key `(Type, Value, dimensions, LinkSection)`. Account references must be active posting accounts; prepaid source accounts must also be posting accounts. Bank rows use `SubType=BankId`, `AccountId=GL account`, and no `Value`/`JobType`. The backend service replaces/deletes stored rows in one save operation. UI dirty navigation and auto-link confirmation are present; no authorization beyond authentication is evidenced.

### FiscalYears

Frontend route: `FiscalYears_Routes['']` renders the list; create/view/edit are modal modes in the list component, and close is a separate step dialog. The service contract is:

| Operation | Route and request | Response/use |
|---|---|---|
| List | `GET FiscalYear` query `PageNo`, `PageSize`, `Filters[sortField]`, `Filters[sortOrder]` | `Results<FiscalYearDTO>`; list fields are `id`, `startDate`, `endDate`, `status`, `canClose`. |
| Detail | `GET FiscalYear/GetById/{id}` | `Result<FiscalYearDetailsDTO>` (`id`, dates, status). |
| Select | `GET FiscalYear/GetSelect` | Backend dropdown result; not consumed by the scoped MonthClose list, which requests the paged list with size 200. |
| Create | `POST FiscalYear` body `{startDate:string, endDate:string}` | `Result<null>`. |
| Update | `PUT FiscalYear` body `{id, startDate:string, endDate:string}` | `Result<null>`; UI only allows edit while status is Open. |
| Close checks | `POST FiscalYear/VerfiyValidFiscalYear`, `VerfiyVoucherApprovals`, `VerfiyDataInconsistency`, `CloseFiscalYear`, each body `{id}` | `Result<FiscalYearCloseCheckDTO>` with `isValid`, `message`, `issueCount`; close dialog runs checks in order and confirms final close. |

Backend close eligibility requires the fiscal year to be open, completed by date, and the oldest open year. Voucher approval requires all non-voided vouchers approved and posted. Consistency checks reject missing details, invalid debit/credit lines, or unbalanced totals. Final close runs these checks under a serializable transaction and sets status Closed. Add/update reject invalid dates and overlapping years; closed years cannot update/delete; date changes cannot exclude existing vouchers, opening-balance dates, month-close records, or budgets. `CanClose` is derived for the oldest open year.

### MonthClose

Frontend route: `MonthClose_Routes['']` renders the list. The service calls `GET MonthClose/GetByFiscalYear/{fiscalYearId}` and `POST MonthClose/ToggleStatus/{id}` with a null body. The list displays `month`, `year`, and `status`; action visibility is Open → Close and Closed → Reopen, disabled while loading or another row is updating, and both actions require the shared confirmation dialog.

Backend `MonthCloseService.GetByFiscalYearAsync` is a read endpoint with a write side effect: it builds every calendar month from fiscal-year start through end, auto-creates absent records as Open, skips months claimed by another fiscal year, catches a concurrent insert and reloads, then returns sorted `MonthCloseListVM` rows (`FiscalYearId`, `FiscalYearName`, `Month`, `Year`, `Status`). `ToggleStatusAsync` loads by id and flips Open/Closed. Add/update VMs include fiscal year, month 1–12, year 1900–2100, and status; service checks fiscal-year existence and duplicate month/year within that fiscal year. The UI does not expose generic add/update/delete routes.

## Confirmed guide conformance and fix candidates

| Concern | Owning block | Actual source/symbol | Shared owner | Target finding |
|---|---|---|---|---|
| Container-fill/no page scroll | Master 5; UI 1 | `Account/components/list/list.component.scss` max-height `calc(...)` and `overflow: auto`; responsive rules set `overflow: visible`; `FiscalYears/components/list/list.component.scss` sets `overflow: visible`; `Link Accounts/.../details.component.scss` uses max-height `calc(...)` | Shared shell `sigma-route-host`/`sigma-list-*` | Confirmed mismatch candidate. Refactor review should move scrolling to the owning shared region and remove page-height/visible overflow patterns. Runtime/visual acceptance pending. |
| Shared list shell/grid | UI 1, 6; Master 5 | MonthClose uses `app-feature-title` and `app-data-table`; FiscalYears uses both; Account uses feature title but a PrimeNG tree rather than a data grid; Link Accounts is a settings editor with tabs, not a generic list | `FeatureTitleComponent`, `DataTableComponent`, `EditorDialogComponent` | MonthClose/FiscalYears are close to shared list shape. Account tree and Link Accounts settings require explicit canonical exceptions; do not force them into CRUD grid shape. |
| Loading/error channels | UI 22; Master 5 | Account, FiscalYears, MonthClose and Link Accounts handle `isSuccess:false` and `error`; Link Accounts suppresses/owns save failure display for the composite save; FiscalYear close service suppresses interceptor error to preserve step messages | `BaseComponentService`, interceptor, state-message/data-table owners | Behavior is source-confirmed, but owner should verify one feedback owner per request and shared state-message usage in templates. No silent `error: () => undefined` found in the bounded files. |
| Confirmation/dirty discard | UI 7, 9, 10, 13, 27 | Account delete/discard, FiscalYear close/discard, MonthClose toggle, Link Accounts auto-link/discard/navigation use `ConfirmationDialogService`; Link Accounts route has `CanDeactivate` | shared confirmation/editor dialog | Match candidate; runtime focus/return-focus remains pending. |
| ListVM/detail/write scope | Backend 3, 7; Master 4 | Account `AccountListVM` includes a recursive `Children` and many calculated/display fields, while tree uses dedicated `AccountNestedListVm`; FiscalYear and MonthClose list/detail/write DTOs are lean for their consumers | Generic service/controller plus feature projections | No automatic change. Record Account ListVM as a review concern only if a scoped consumer uses generic list routes; tree contract itself is dedicated and bounded. |
| Settings contract | Backend 16; UI 13/15/16 | Link Accounts settings uses typed enum options, sectioned rows, aggregate save and CanDeactivate | LinkAccountsService/Controller | Canonical settings exception is confirmed. Preserve replace-by-type reconciliation and posting-account validation. |
| Stateful actions/invariants | Backend 8, 12, 18; UI 7 | Account conversion, FiscalYear close, MonthClose toggle, Link Accounts auto-link apply | AccountService, FiscalYearService, MonthCloseService, LinkAccountsAutoLinkService | Action-state contract must be frozen by owner before implementation. Visibility is presentation only; app has authentication but no authorization mechanism. |

## Open owner decisions / risks

1. `MonthClose/GetByFiscalYear` mutates storage during a GET. This is existing behavior and is required to materialize missing months, but it is a contract risk for any generic HTTP/read-pattern refactor. Preserve unless the owner freezes a replacement workflow.
2. Fiscal-year close and month reopen/close have accounting-period consequences. The source provides invariant checks, but no authorization mechanism or concurrency token is exposed in these scoped DTOs. Do not invent permission or concurrency policy.
3. Account conversion has a broad reference-move set and an explicit transaction. Treat as a domain transition, not ordinary Save; preserve closed-month and soft-deleted reference movement.
4. Link Accounts `replaceTypes` is authoritative for deletion/reconciliation. Any UI tab omission or partial-save redesign would change deletion semantics and needs a frozen contract.

## Verification boundary

Source-only discovery is complete. No build, test, lint, browser, database, migration, or runtime verification was run. Owner verification remains pending. Root agent owns contract freeze, any implementation, scoped repository diff review, and final reconciliation.

## Final source resolution

The preceding source findings describe the discovery baseline. `ACCOUNTS_WORKSPACE_CONTRACT_FREEZE.md` freezes the existing period/conversion/settings behavior and records the complete MonthClose fiscal-year lookup amendment. Final source retains those APIs/rules, uses shared lifecycle/presentation owners, and has been reconciled in `ACCOUNTS_FEATURE_REVIEW.md`. Source size200 lookup is replaced with all-page fetchAllPages100 while preserving original range labels. Existing MonthClose GET writes, absence of a new permission/concurrency policy, broad conversion reference moves and full replaceTypes semantics remain explicit retained contracts.
