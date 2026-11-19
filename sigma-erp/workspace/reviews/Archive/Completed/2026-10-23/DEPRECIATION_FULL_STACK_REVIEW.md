| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Depreciation full-stack review — 2026-10-06

The requested monthly report now prepares an authoritative server snapshot, saves positive unsaved depreciation entries and posts one linked balanced journal atomically. Implementation follows the frozen [contract](<DEPRECIATION_FULL_STACK_CONTRACT_FREEZE.md>), including its dated integration clarification. This is source completion, not build, database or visual acceptance.

## Manifest, scope and evidence

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Backend repository: `F:/My Work/Sigma/SigmaBackend`. Documentation repository: `F:/My Work/Shaban Documents/Shaban`. Review and skill records remain outside the application Git repositories under `F:/My Work/Sigma`.

User evidence: `C:/Users/user/Desktop/Assets/5.PNG`, request to conform `src/app/modules/Assets/depreciation` to the documentation, explicit instruction to save depreciation and create an accounting journal, and delegated suitable decisions from available source. Attached content is functional evidence, not operational instructions. Authority is AGENTS.md, Master and applicable canonical books; the screenshot does not prescribe styles.

| Evidence | Classification | Implementation / boundary |
|---|---|---|
| Depreciation title | Explicit | Shared FeatureTitle inside report panel; toolbar suppresses only this route's duplicate title |
| Month | Explicit | Required typed month picker; current local month; exact API month-start transport |
| Run Depreciation For Disposed Asset | Explicit label, source meaning limited | Preserves inclusion of life-expired assets, with visible explanation when selected; source has no disposal date/state |
| Prepare / Export to Excel | Explicit | Explicit prepare; all report rows and all grouped subfields exported |
| Asset / Formula / Book Value / Prev Detail / Depreciation | Explicit logical groups | Five shared DataTable columns retain current-source subfields |
| Sum | Explicit | Server response total; shared money summary card |
| Save | Explicit plus owner clarification | Save and Post confirmation, backend batch and generated posted journal |
| Layout/colors/spacing | Screenshot illustration only | Canonical shared report/table/control owners |
| Declining balance/production calculation | Missing implementation/data in current source | Visible review state, posting blocked; no invented formula or production input |
| Actual disposal filtering | Missing source contract | Documented limitation; separate lifecycle/data extension needed for actual disposal |

Phases 0, 1, 2, 4, 5 and 6 applied. Phase 3 is not applicable: there is no CRUD editor, child-edit payload, upload or media workflow. Planning/maintenance decisions are frozen in the contract's narrow maintenance section: dedicated batch API extends the persisted monthly entry owner, retains the legacy report endpoint, and replaces only the depreciation screen. Other Assets reports, asset editors, account rules and lifecycle workflows are excluded.

Recipe `Generate-SigmaRecipes.ps1 -Check` found Phase 01 current and PLAN/other phase packets stale. Canonical sources were used. Derivative packets require regeneration and semantic review by their owner; none were edited manually.

## Decisions and final contracts

| Master 4 decision | Choice and concrete evidence |
|---|---|
| Reference/editor/routes | TrialBalance → Accounts shared report-family is the report reference; no record editor. Existing `/depreciation` route remains; correct actual `Assets` directory casing |
| Backend shape | BE17 feature report read plus BE15 confirmed posting transition. Existing DepreciationEntry owns monthly history; dedicated IDepreciationService owns batch calculation/posting |
| Entity/duplicates | Existing tenant EntityBase; live `(SubscriptionId, AssetId, Period)` unique key. Saved monthly snapshot cannot be edited/deleted through generic entry CRUD |
| Write/detail scope | Save request contains only month, rerunDisposed and 64-character hex preparationToken. No row amounts, totals, account IDs, tenant or audit values; no Detail/Add/Update screen |
| Style/shared owners | ReportPage, FeatureTitle, report filter/actions, DataTable, SummaryCards, PrimaryActionButton, shared footer; no feature SCSS. Summary host placement preserves reference 12px grid separation |
| Confirmation/discard | Shared confirmation only for Save and Post. Filters are report inputs, not unsaved business records; dirty-discard dialog is not applicable |
| Filters/paging | Required month normalizes to `yyyy-MM-01`; boolean false is explicitly sent. Complete unpaged response, lazy=false, paginator=false; paging metadata/CountAsync not applicable |
| Money | Backend cumulative straight-line schedule includes opening depreciation, full first month, final remainder, residual floor and zero after life. Shared currency precision guard and FinancialNumberPolicy own rounding; no VAT |
| Account/period references | Asset accounts are NotMapped; use persisted AssetType expense/accumulated account IDs. Resolver validates tenant/active/leaf accounts, cost centers, fiscal/month availability; no Asset branch field exists |
| Registration/feedback | Frontend root BaseService uses interceptor-enabled HttpClient/environment URL; backend existing assembly scan binds interface scoped. Inline error header plus apiErrorMessage; shared success interceptor owns one save toast |
| Mapping | New read DTOs in Helpers/Dtos, editable request in ViewModels. Calculated projection and entry construction stay backend-owned; no new AutoMapper maps, Ignore or ReverseMap |
| Migration | Nullable JournalVoucherId/FK, monetary precision and unique filtered index require owner migration; no model snapshot or migration written |
| Authorization | Root AuthGuard and controller Authorize exist. Save/Post is an authorization candidate; app has no permission mechanism and no role API was invented |
| Shared extraction | Added monthValueValidator over existing parser; compared optional-empty and invalid-date semantics with Accounts report-family and Staff Timesheet local implementations. Two remaining consumers are deferred to their own reviews in UI30/39 |

### Grid / row DTO reconciliation

The DTO is a report shape, not a CRUD ListVM. Backend PascalCase properties serialize to the listed frontend camelCase properties.

| Ordered DataTableColumn.field (type) | Frontend properties rendered | Backend read DTO properties |
|---|---|---|
| assetName (text template, 32%) | assetId, assetName, cost, residual, purchaseDate, chassisNo | AssetId, AssetName, Cost, Residual, PurchaseDate, ChassisNo |
| formula (translated text template, 16%) | formula, life, supported | Formula, Life, Supported |
| bookValueFy (money template, 18%) | bookValueFy, bookValuePrev | BookValueFy, BookValuePrev |
| prevDepreciation (money template, 18%) | depreciationStart, prevDepreciation | DepreciationStart, PrevDepreciation |
| currentDepreciation (money template, 16%) | currentDepreciation, isSaved | CurrentDepreciation, IsSaved |

Formula has both translated template and `value` fallback. Date under Previous Detail is the real depreciationStart, correcting the former money-under-date binding. BookValueFy names the historical transport member; UI labels it as book value after this month. No row Actions column: the transition applies to a complete prepared batch. Export expands every row field, dates, money, saved/ready states and server total. New DTO excludes legacy TypeName and friendly formatted-value fields; old DepreciationDTO and Asset/DepreciationReport remain for their existing consumers.

| Filter control | Typed value/default | GET query / POST member | Backend parser / invalid case |
|---|---|---|---|
| month | Date|string|null, currentMonthRange()[0] | month / Month | parseMonthValue then `-01`; server exact yyyy-MM-dd with Day=1; absent/partial/invalid rejected |
| rerunDisposed | boolean, false | rerunDisposed / RerunDisposed | bool; false explicitly sent, GET omission defaults false |
| prepared token | response-only state | PreparationToken, POST only | required length64 and hex validation, service validation, SHA256 recomputation; no client financial state |

### Actions and state

| Reference action | Target classification | Reason |
|---|---|---|
| Report Search/Prepare | Supported | Computes complete requested month |
| Reset | Supported | Clears prepared state and restores current month/false |
| Print | Supported | Shared print session releases grid bounds and restores state |
| Excel | Supported | Complete response rows, all grouped values and authoritative total |
| TrialBalance open Ledger / hierarchy actions | Not Applicable | Batch rows identify assets; no account hierarchy or ledger-target account in this report contract |
| Financial save/post | Supported by owner instruction | One confirmed immutable monthly batch |
| CRUD View/Add/Edit/Delete/Activate | Not Applicable on UI | No editable monthly document; generated snapshots must not bypass posting ownership |
| Approval/unpost/void | Not Applicable | No approval/reversal workflow requested or persisted batch header/state |

| Action / exact source state | Target / flag | Complete vertical slice | Failure / refresh |
|---|---|---|---|
| Prepare, valid form and !busy | Prepared report + token + canSave | component.prepare → service.prepare → GET Depreciation/prepare → IDepreciationService.PrepareAsync → BuildReportAsync | Result and HTTP failure inline; report/token cleared; finalize restores controls; success stores response |
| Save/Post, applied snapshot, canSave=true, !busy | Positive unsaved rows become IsSaved=true; linked posted DepreciationJV | shared confirmation → component.save → service.save → POST Depreciation/save {month,rerunDisposed,preparationToken} → SaveAsync → tenant write lock + serializable source reads → resolver.SaveAndPostJVAsync → persisted entries | Stale/duplicate/configuration/period failure rolls back and clears client snapshot for Prepare recovery; success returns refreshed persisted report with one interceptor toast |
| Filter change or Reset | No prepared rows/token/total | valueChanges/reset → invalidate | No stale data can be submitted/exported |
| Print/Excel, prepared rows and !busy | Same business state | shared printSession/dataTableExportRows | Print releases busy on completion/teardown; export has translated headers and complete fields |

Posting creates expense debit and accumulated credit for each positive row at month end, using AssetType accounts and Asset CostCenter on both lines. Branch is null because the Asset model has no branch. Valid calculations remain visible with missing account mapping, but an unsaved invalid/unready row blocks the batch. Previously saved legacy rows do not block remaining rows if source mappings changed. Expired assets included by the checkbox have zero new depreciation; final scheduled month receives the rounding remainder. Backend revalidates all inputs and token within the same transaction as journal and entries. A unique tenant lock serializes participating batch saves; SERIALIZABLE reads hold stable source/range locks through the write boundary, and session isolation returns to READ COMMITTED. No client total, retry, overwrite or historical journal fabrication.

### Override audit

DepreciationController/DepreciationService have no generic CRUD overrides. DepreciationEntryService preserves generic reads and overrides only the six mutation methods below.

| Override | Feature-specific reason |
|---|---|
| AddAsync / AddListAsync | Prevent client-supplied calculated entries without the owning batch calculation/journal |
| UpdateAsync / UpdateListAsync | Protect persisted posted/legacy monthly snapshots from trusted client amount rewrites |
| RemoveAsync | Protect monthly history and journal linkage; no reversal workflow exists here |
| HandleActiveAsync | Prevent generic activation mutations to immutable entry state |

These return a localized batch-only failure. No inherited read/select/list method is duplicated. Existing generic entry write endpoints become intentionally unavailable; this compatibility change is part of the frozen ownership decision.

## Reference conformance and final reconciliation

| Concern / book | Reference symbol and values | Final target proof / limitation |
|---|---|---|
| Report layout UI1/3/20 | AccountReportPageComponent template uses report fill/panel, shared title/filter/actions; global direct report grid has zero list inset | DepreciationComponent host sigma-route-host, section appReportPage fill, same panel and sigma-list-table; no feature height/palette/table styles; toolbar excludes /depreciation only |
| Month UI17/19 | AccountReportPage month case: view=month, mm/yy, mask, typed values, shared date feedback; DatePickerDirective defaults body overlay/panel/button bar | Depreciation filterForm + monthValueValidator + same picker/FieldError; no toISOString/native date/manual parser |
| Grid UI5/6 | Shared DataTable fill and column templates; static ViewChild and initColumns | Five typed fields in frozen order/percentages, complete rows, filltrue/lazyfalse/paginatorfalse, internal rows scroll; money/date owners shared |
| Totals UI24 | SummaryCards public slim/row/min140/max80, reference 12px host separation | summaryCards uses response.totalDepreciation; exact public sizing and margin-block-end12; no financial preview or card-internal styling |
| Export/print UI8/21 | dataTableExportRows/formatDisplayDate + ReportPrintService.createSession | exportColumns expands all15 row fields and total; printing signal controls grid scroll; teardown managed by session |
| Busy/error UI22/28 | LoadingService/finalize/takeUntilDestroyed and inline apiErrorMessage | loadingReport/saving/confirming/printing share busy; form disable without emitted changes; handlers cover both failure channels; no duplicate error toast |
| Read BE17 | QueryReport<T> applies tenant/live/untracked scope | BuildReportAsync uses scoped Asset and DepreciationEntry reads, deterministic ID order; token includes displayed/calculation/account/config/saved inputs |
| Posting BE15 | JournalVoucherResolver SaveAndPostJVAsync + unique multi-save transaction owner | SaveAsync uses existing journal number/period/account/precision engine, one balanced generated batch, link entries; same transaction covers every save |
| API/types/mapping | New read DTO/request separation, Result wrapper | Helpers DepreciationRow/PreparedReport ↔ TypeScript prepared-report; VM save editable inputs only; local Dtos imports verified |
| Feedback/auth/routes | Root service/client scan and existing interceptors/guards | scoped API Authorize, FE route case corrected, no extra client/provider/role registration; one success owner |
| Styles/RTL/theme/viewport | Shared owners define geometry and tokens | No feature SCSS; logical spacing and shared components. Actual narrow/RTL/light/dark/print acceptance remains pending |

Contract fields, screenshot functions, five grouped grid columns, filters, mutation states, override reasons, translations, wiring, financial calculations, and migration impact have been reconciled against source. No additional required Missing business decision blocks the chosen scoped implementation. Actual disposal and other methods remain explicitly limited capabilities, not claims of completed lifecycle/formula support.

## Files changed by this task

Under `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Assets/depreciation/components/list/list.component.ts`, `.html`, `.spec.ts` (existing stale component import/type corrected only); obsolete `.scss` removed.
- `src/app/modules/Assets/depreciation/models/prepared-report.ts` and `services/depreciation.service.ts` added. Legacy `models/list.ts` retained.
- `src/app/modules/shared/utils/date-utils.ts`: shared month validator only.
- `src/app/pages/routing.ts`: depreciation import casing only.
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`: depreciation duplicate-title exclusion only.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: depreciationRun block only.

Under `F:/My Work/Sigma/SigmaBackend`:

- Added `SiGma.Business/IServices/IDepreciationService.cs`, `SiGma.Business/Services/AssetsServices/DepreciationService.cs`, `SiGma.ServerAPI/Controller/DepreciationController.cs`.
- Added `SiGma.Helpers/Dtos/DepreciationRow.cs`, `DepreciationPreparedReport.cs` and `SiGma.ViewModels/ViewModels/Depreciation/DepreciationSaveRequest.cs`.
- Modified `SiGma.Helpers/Models/Assets/DepreciationEntry.cs`, `SiGma.DataAccess/Configuration/DepreciationEntryConfig.cs`, `SiGma.Business/Services/AssetsServices/DepreciationEntryService.cs`.
- Added eight localized keys to `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `.ar-SA.resx`.

Documentation: `F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/{17-dates,00-preamble,30-backlog-by-priority}.md`, `CHANGELOG.md`; `F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md` synchronized for shared month validation. This review and contract are under `F:/My Work/Sigma/reviews`.

Other ongoing Asset/AssetType/DepreciationDetail/Summary/FY and unrelated shared/document changes pre-existed or belong to peer chats. They were retained, excluded from this task's ownership and must not be staged with its suggested commits merely because common-file diffs contain them.

## Verification and owner handoff

Performed source-only: separate scoped application diffs including all new files; direct producer/consumer/import/route/interface/DI review; reference comparison; override and payload audit; whitespace/merge-marker checks; translation parity (35 English, 35 Arabic, zero missing/case differences); resource XML validation. Initial integration review corrected first-month selection, post-life calculation, saved-row gating, account-readiness preview, source isolation, token bounds, DTO placement/imports and summary spacing. No compilation or executable financial tests were run.

Schema inventory: new nullable JournalVoucherId and navigation; Restrict journal FK and explicit Asset FK relationship; three amounts use named StoragePrecision/LedgerAmountStorageDecimalPlaces (18,2); live filtered unique SubscriptionId/AssetId/Period index. No property/column removed, length tightened or column made required. Suggested migration name was checked against migration filenames and has no existing match:

`Add-Migration LinkDepreciationEntriesToJournalVouchers`

Owner must inspect legacy live duplicate asset/month entries, non-month-start Period values, orphan Asset references, and monetary scale/range before generating/applying it. Retain legacy nullable journal links without inventing historical accounting effects. Saving the new feature requires the coordinated schema deployment.

Owner verification steps:

1. Compile frontend/backend under the project's normal workflow, including the current explicit TypeScript runtime roots only if the compiler reports a missing file. The old smoke spec import is corrected; its dependency setup was not certified or executed.
2. Prepare an asset starting mid-month: full first installment; first month's previous depreciation includes opening balance. Check rounding with small non-even bases, final remainder, residual floor and later-month zero with expired inclusion selected. Compare cumulative schedule semantics with the intended accounting policy before production use.
3. Save a month in an open period: one posted generated DepreciationJV, expense Dr/accumulated Cr, equal amounts, correct costcenter/date and linked entries. Reprepare/repeat Save and concurrent attempts must never create another asset/month or journal.
4. Change asset cost/type/accounts/costcenter after Prepare: Save must reject stale token and require Prepare. Check an existing saved row whose mapping has since changed does not prevent posting other valid rows.
5. Check missing mapping, invalid inputs, unsupported method, wrong-tenant/inactive/non-leaf accounts, closed fiscal/month, missing auth and injected persistence failure: clear failure and complete rollback. Check duplicate legacy rows fail preparation clearly.
6. Check initial/no-data/error/cancelled confirmation/retry/navigation during requests, month partial typing and reset, disabled snapshot controls, Arabic/English, RTL/theme/narrow internal scrolling; Excel all subfields/total and print all rows/restore.
7. Regenerate stale recipes and review their semantics through their owner tooling after documentation acceptance.

Risks pending owner verification: SQL Server serializable read/range lock contention/deadlocks on large asset batches (no automatic financial retry); complete-response payload size; coordinated schema availability; posting engine/accounting-period data; actual Angular calendar/form/print behavior. New generated entries have no reversal UI in this scope. Saved values are protected while current asset descriptors remain current-source values. Source review does not establish production readiness.

Suggested commits (stage only task-owned files/hunks):

- SiGmaAngularFrontEnd: `feat(depreciation): prepare and post monthly depreciation`
- SigmaBackend: `feat(depreciation): save monthly entries with posted journal`
- Shaban documentation: `docs(ui-book): document shared month validation`

Agent utilization: frozen contracts preceded delegation. Primary agent owned frontend, shared month extraction, documentation and final integration. `/root/backend_posting` used gpt-5.6-sol for the isolated backend workstream and owned the backend files listed above; no overlapping feature ownership. Parallel backend implementation reduced sequential handoff time while the primary reviewed all producer/consumer source and corrected integration findings. No new agents were spawned during the continuation.

No builds, tests, lint, browser/app automation, database commands, migrations/model-snapshot edits, commits, pushes, deployment, Sigma MCP or Graphify were run.

## Owner compiler follow-up — Assets import casing

The owner's pasted compiler output (`C:/Users/user/.codex/attachments/98075719-b1bd-4cdb-9cda-f4ba8578b3ee/Pasted text.txt`) contains eleven TS1149 diagnostics. Source discovery identifies six remaining lowercase `modules/assets/` roots: AssetType lazy route, AssetTypeService in shared LayoutModule, and the same service in PurchaseOrder, Bill, GoodsReceivedNote and PurchaseRequest details. Relative imports in Asset and depreciation reports are downstream consumers, not separate path defects.

Before edits: UI1 wiring and UI29 stale-import/compile boundaries own this repair. Actual source/Git reference is `src/app/modules/Assets/assetType/assettype.routes.ts` and `services/assettype.service.ts`, with capital `Assets`. Match all six producer/import roots to that tracked spelling. No folder rename, business/DTO/layout/provider change, compiler-option relaxation or new explicit runtime entry is required. Existing LayoutModule removal of AssetService and other route changes are peer-owned and retained.

Applicable phases: 5 integration and 6 source reconciliation; discovery is limited to the compiler evidence and exact Assets import symbol. No new domain/API/grid/action contract or schema change. No subagents: this is a small sequential repair. Recipe check still reports stale PLAN and phases00/02–06; use canonical sources and leave packet regeneration to its owner.

Final reconciliation: all six imports now use the tracked capital `Assets` spelling. Scoped Assets-path search finds zero remaining lowercase import roots; all six changed source files contain zero conflict markers, and scoped `git diff --check` passes. The complete six-file diff was reviewed, preserving the earlier LayoutModule provider removal and route fixes. No backend, AutoMapper, calculation, translation, compiler-option or migration change is part of this follow-up. Suggested isolated frontend commit: `fix(assets): unify import path casing`. Owner should restart the Angular development compiler and compile again to verify all eleven TS1149 diagnostics disappear; no build/test/lint was run by the agent.
