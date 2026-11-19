# Link Accounts repair contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

## Domain / API

New authenticated tenant-scoped `GET /LinkAccounts/repair/plan` returns `Result<LinkAccountsAutoLinkPlanVM>`. `POST /LinkAccounts/repair/apply` receives `{planToken:string}` and returns the same wrapper. No client target IDs/types/mappings accepted. Plan gains optional PlanToken; each item gains PreviousAccountId/PreviousAccountCode/PreviousAccountName and IsCorrection. Existing completion consumers remain compatible. Token is an opaque SHA256 digest of the rebuilt plan and retained mapping snapshot, not an authorization credential; apply recomputes inside the transaction and rejects stale/missing token. No target plan supplied by client.

Repair covers invalid retained non-HRM links identified by the existing guard, with one live row per logical key. Build current canonical slots from the existing typed read pipeline. Contacts take current group Type and default section; bank uses BankId in SubType, Value/JobType null and default section; payment takes current branch/category. Valid targets can be retained during metadata-only repair. Invalid targets use the same BuildPlanAsync catalog, role predicate, parent checks, type selection and AccountService writer as ordinary provisioning. Missing canonical source, duplicates, invalid prepaid source, conflicting same-name candidates, unsupported state or missing suitable parent/type remain Manual. No inferred source replacement, row deletion/merge, account reclassification or transaction rewrite.

Apply owns one serializable transaction across account creation and link updates; validates the preview token before any write, creates required leaves through AccountService, validates each final target against AccountSelectionPolicy and canonical source state, updates only the exact existing row belonging to that logical key, normalizes its canonical dimensions, saves once after account creations, and rolls back all on any failure. Unresolved rows and valid unrelated selections unchanged. Repeated successful invocation has no correction work. Existing setup/normal completion preserve selections exactly as before.

## UI / action-state / grid

Source-supported clarification before extension: current prepaid setup already declares four source-code/expense-code pairs in SeedDataService.DefaultChart. Move that unchanged map into LinkAccountsDefaultCatalog and consume it in both new-chart setup and corrective planning. A valid source with one of those known pairs can repair an invalid expense target; an unknown or invalid source stays Manual. Workshop source sections already have different usages in AccountSelectionPolicy: keep Inventory only for Default, choose OperatingRevenue for StockRevenueAccounts and CostOfSales for StockExpenseAccounts in the shared planner. This fixes creation placement to the already established roles without changing the roles or journal behavior. Owner clarification: development setup needs the closest suitable semantic type, not literal account-name equality; reuse catalog and compatible type selection or create a suitable leaf, never retype an unrelated selected GL just to pass validation.

Existing settings header adds Repair Links action; parent reuses dirty-discard, busy and refresh behavior. Existing auto-link dialog gains typed repairMode input. Repair uses its own title/subtitle/rule/confirmation/applied/empty keys. Grid columns: type/slotLabel/action/previousAccountName/accountName; old account rendered code+name; proposed target rendered existing/new parent text. Manual reason remains visible in account column; full reason in its own repair column if needed. Server DTO owns only these displayed fields plus identity, planned type/parent and action diagnostics. Existing normal dialog columns unchanged.

Apply allowed only for loaded unapplied plan with actionable rows; repair additionally requires nonempty planToken. Shared confirmation explicitly states replacement of invalid links, existing journals unchanged. Disable double clicks/close during apply/confirmation; both Result failure and transport error handled. Request body typed; no query mode that changes existing completion semantics. After success close emits the existing refresh event, invalidates account catalog/visited tabs and reloads active section. One deferred success toast as existing flow. Guide updated under /UserGuide/accounts in EN/AR.

## Conformance / scope

Master4/5/7, BE8/10/16, UI06 and UI9/13/22/23/28 own source reference/state/confirmation/errors/cancellation and guide. Existing LinkAccounts settings and auto-link components are actual reference/shared owners. Account code creation remains server-owned, types must fit active group/subgroup and reporting placement. No AutoMapper change (manual minimal DTO construction), permission layer or report recalculation. No schema migration. Source-only verification pending owner compilation/runtime. This freeze explicitly supersedes preservation only for the separately invoked repair action, not default setup.
