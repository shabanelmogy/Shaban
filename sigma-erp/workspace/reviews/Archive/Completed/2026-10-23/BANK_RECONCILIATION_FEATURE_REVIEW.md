# Bank Reconciliation — feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-05 |

## Manifest

Implement the confirmed Guide fixes and restore source-backed screenshot workflow. Scope is the frontend Bank Reconciliation root and its direct AccountReports reconciliation API; ReconciliationReport and other banking/voucher screens excluded. No Maintenance/Evolution Plan needed: existing entity, endpoints, net calculation and persistence workflow are retained. Contract: BANK_RECONCILIATION_FRONTEND_BACKEND_CONTRACT_FREEZE.md. Packets PHASE00–06 passed Generate-SigmaRecipes.ps1 -Check. Applicable phases0/1/2/3(header/action input)/4/5/6; ordinary CRUD editor not applicable. Existing unrelated user changes are extensive; target frontend root clean at start, EN/AR and toolbar/backend service premodified, preserve them.

## Screenshot E1

`C:/Users/user/Desktop/Banking/BankReconciliation/1.PNG`: English/LTR, desktop1691x567, working session; role/date/version/current acceptance unknown. Screenshot is functional evidence only; no embedded instruction treated as user authority.

| Evidence | Classification | Behavior / owning phase / approved implementation |
|---|---|---|
| Bank, statement balance/date, payment method | Explicit | typed shared filters, scalar selects and single date; phases1/2/3 |
| Last reconciliation date/balance | Explicit | source session response, read-only context; phase2 |
| Reconciled balance and difference | Explicit | shared summary cards, labelled selected preview; phases1/3 |
| Checkbox + voucher no/type/date/description/debit/credit | Explicit | typed complete DataTable with stable detail identity and all-loaded selection; phase2 |
| Clear/Refresh/Print/Excel/Reconcile | Explicit | existing read/complete API with shared controls/output/confirmation; phases2/4 |
| Screenshot sample date/balance/bank value | Explicit sample content | never seed real user data |
| Completing requires exact match; opening/cumulative treatment | Uncertain from image | exact-zero selected-net rule confirmed by current backend; no new accounting formula |

## Initial findings

Broken `formGroup]` markup, controls outside parent group, obsolete ms-lib table/base, any contracts, object bank selection, range date for single cutoff, nonexistent generic API route, missing payment/history/selection/output/complete action, editable derived fields, invalid unfiltered Clear request, missing loading-finalize/error/cancellation, untranslated missing AR actions, no dirty-exit protection. Backend Complete does not enforce claimed GL ownership/cutoff/FK constraints; preserve domain formula and fix source invariants before exposing it.

## Reference conformance gate — before edits

| Concern | Book / inspected reference symbol | Shared owner | Target plan |
|---|---|---|---|
| Workspace bounds/title/footer | UI1/3/14; OpeningBalances DetailsComponent and Workshop Job editor shell | src/styles.scss / FeatureTitle | container-fill editor workspace, no local styling; title suppressed in toolbar |
| Header filters / validation | UI4/16/17/19; Job list filterForm/template | FilterPanel, DatePicker, FieldError | stableLayout true, 4 fields, 34px shared controls/reserved feedback, no fake editable derived fields |
| Immutable selected rows | UI5/6; Job list + DataTableComponent selection API | DataTable | financial shape adaptation: selectable journal rows, no editing/Add/Remove; fill true, complete collection without paging (root refinement in frozen contract) |
| Summary | UI14/24; OpeningBalances financial contract / SummaryCards | SummaryCards/Money formatting | typed slim row cards, historical values/selected previews remain distinct |
| Confirmation/exit | UI10/22/28; OpeningBalances canDeactivate + ConfirmationDialogService | shared confirmation/guard | protect pending selection, freeze on confirmation, both failures retained |
| Output | UI8/21; dataTableExportRows / ReportPrintService.createSession | shared output owners | full loaded array, current translations, applied snapshot context, release all bounded layers |
| Backend aggregate | BE8/14/17; existing AccountReportsService + BankReconciliation.Recalculate | repository/resolver/domain/index | required FK/account/date/live-parent checks; server selected net, one graph save, no new journal |

## Final source reconciliation

The root reviewed the feature diffs and all new files in the frontend and backend repositories separately. Already modified shared files were reconciled by the scoped reconciliation/translation/title hunks; unrelated accounting, stock, workshop and banking work was preserved. Documentation belongs to the `F:/My Work/Shaban Documents/Shaban` repository; review/skill artifacts are owned by the Sigma coordination workspace.

| Concern | Actual producer/consumer and compared values | Result |
|---|---|---|
| Bounded workspace | Component host `sigma-route-host`; section/panel/form each `sigma-print-flow`; panel `sigma-editor-panel--workspace`, direct FeatureTitle; shared styles supply height100%, min-height0, hidden overflow, padding6px12px, gap0.45rem; title/filter inline0 | Matched source; viewport acceptance pending |
| Internal row owner | Direct DataTable inside `sigma-editor-form` flex1/min-height0; `fill=true`, `lazy=false`, `paginator=false`, `scrollable=!printing` | Matched complete immutable collection; no local scrolling CSS |
| Header controls | `searchForm` four typed required controls; FilterPanel mainColumns4/stableLayout=true; dropdown value/id; shared masked single calendar; FieldError reserveMessage; native numeric appNumericFocus/step0.01 | Matched UI4/16/17/19/27; theme/RTL/narrow acceptance pending |
| Row projection | AccountReports GET SQL-projected seven-field BankReconciliationLineVm; filters eligibility, orders Date/Id, calls ToListAsync without Skip/Take; TS line and column definitions agree | Confirmed complete source array; volume/SQL acceptance pending |
| State/output gate | `currentSession` compares all four raw header values to `appliedFilters`; `busy` includes read/save/dialog/print/lookups; actionFailed retains draft and requires Refresh | Matched stale-header and mutation gates |
| Preview and summary | `summaryCards` uses authoritative history/ledger and selected previews, slim/row/min140/max80; shared roundMoney2; no derived values in POST | Matched ownership; selected net retained |
| Print/Excel | `ReportPrintService.createSession`; non-scroll table while printing, no pagination/selection column, every bounded route ancestor print-flow; printContext applied four fields; dataTableExportRows full array/current translator/same six columns | Matched source; exported file/print visual acceptance pending |
| Feedback/lifetime | forkJoin lookups opt out of global errors; GET switchMap/defer, apiErrorMessage and business failure inline; POST global error/success owner, local recovery state; paired loader finalize and takeUntilDestroyed | Matched both failure channels; no duplicate POST feedback |
| Transition | `reconcile()` freezes captured header/detail IDs before shared dialog; service revalidates live FK/account/date/posted/nonvoid and reserved IDs, exact zero, domain Recalculate, one graph save | Matched boundary invariants; concurrency limitations below |
| Exit/title | Route CanDeactivateFn calls component canDeactivate/confirmDiscard; toolbar exact /BankReconciliation suppression; Reset confirms dirty state and never sends unfiltered GET | Matched scoped wiring |

## Decisions taken (Master4)

| # | Decision / evidence |
|---|---|
| 1 | UI financial collection/action workspace screen05, with immutable DataTable selection (UI6); OpeningBalances shell/financial references and Job filters/table read before edits. Backend uses existing AccountReports session + aggregate action; PurchaseOrder aggregate save/repository/UoW inspected by worker. |
| 2 | Keep routed financial workspace: selection has totals and persisted completion; screenshot and existing route/domain support it. No parallel modal/editor. |
| 3 | One `/BankReconciliation` working route; generic list/create/view/edit modes do not represent this session action. |
| 4 | Selection first; voucherNo text, voucherType text, date date, description text/wrap, debit money, credit money. No row-action column: no target row mutations. |
| 5 | LineVM properties beside columns: JournalVoucherDetailId identity; VoucherNo/VoucherType/Date/Description/Debit/Credit. No extra row properties or removed compatibility fields. |
| 6 | Complete payload only bankId/paymentMethodId/statementDate/statementBalance/reconciledDetailIds. Server amounts, tenant, audit, totals and IsReconciled omitted. |
| 7 | Session context bankId/name, ledgerBalance, lastDate/balance, initial net/difference and complete lines; consumed by header context/summary. No CRUD detail fetch. |
| 8 | Shared workspace/FeatureTitle/FilterPanel/DataTable/SummaryCards/footer/buttons and tokens; empty feature SCSS deleted. No shared-component or approved-reference edits. |
| 9 | Shared confirm before persistence, with screen title, bank subtitle, date/count and exclusion warning. No custom modal or confirmation for ordinary successful reads. |
| 10 | Dirty header/selection exit and Clear confirmed; Refresh confirms replacing a nonempty selection; busy dialog/save/print blocks navigation. |
| 11 | Existing AccountReportsService GET/POST retained; complete graph save via existing repository/UoW, no new generic CRUD hierarchy. |
| 12 | Existing BankReconciliation/Line EntityBase tenant/audit ownership retained; repository assigns added graph subscription. No new entity. |
| 13 | Existing unique JournalVoucherDetailId index reserves a detail irrespective of bank or soft delete; read/save reservation queries align with it. Nonempty unique positive IDs validated. |
| 14 | Live tenant bank/method/account required; selected details must belong to linked GL account, live posted nonvoid parent, inclusive cutoff. Delete/reference lifecycle elsewhere remains excluded. |
| 15 | Unpaged session keys bankId/paymentMethodId/statementDate/statementBalance retained; query parser supports same keys. Missing/blank values rejected; supplied zero balance retained; date normalized to day. No count/page clamp for complete collection. |
| 16 | Feature and neutral voucherTypeNames EN/AR keys match (62 each combined). Backend 10 localized messages in EN/ar-SA. |
| 17 | Root frontend BaseService/root HttpClient/environment.baseUrl; API existing DI IAccountReportsService plus IStringLocalizer<GeneralMessage>. Existing AuthGuard/[Authorize] retained. |
| 18 | No entity/configuration/schema change; Add-Migration not required. No migrations/snapshots touched. |
| 19 | Search/Reset/selection/save/print/Excel/exit supported. Reference Add/Edit/View/Delete/Activate/tabs/Add row/Remove row/post/void/receipt/attachments not applicable: preexisting immutable journal rows and reconciliation snapshot, with lifecycle owned elsewhere. |
| 20 | No service/controller virtual overrides added; existing custom report/action methods own eligibility and calculation. Frontend inherited generic get replaced with typed session/complete adapters. |
| 21 | Bounded existing-feature repair; no new schema/workflow or broad behavior replacement. Shared pure voucher translator extraction follows Master5, not a new cross-cutting platform; no PLAN00 implementation needed. |
| 22 | Request sends the full selected-ID snapshot; backend re-resolves and constructs fresh snapshot children. Missing selection IDs are unincluded transactions, not deleted saved reconciliation lines; no editing/removing historical sessions. |
| 23 | Preserve domain sum(debit-credit), difference=statement-selected net, exact0. History balance is context only, not cumulative opening balance. Signed balance/scale2 as existing decimal18,2. UI rounding preview only; no VAT/new journal/allocation/posting effects. |
| 24 | Complete POST is a future authorization candidate, GET bank/ledger session contains financial data. App has authentication only; UI disabled state is not authorization. No permission mechanism invented. |
| 25 | Ineligible or reused rows must not enter a completed financial snapshot; backend guards account/date/live state and duplicate reservation, while user previews cannot authorize persistence. Uncertain screenshot cumulative semantics resolved conservatively to current domain; no accounting-rule invention. |

## Filter/wire parity

| UI control | Typed form value | Query key → server parser | POST field / default |
|---|---|---|---|
| Bank | bankId number/null | Filters[bankId] → GetInt bankId | bankId; empty required live positive tenant ID |
| Payment Method | paymentMethodId number/null | Filters[paymentMethodId] → GetInt paymentMethodId | paymentMethodId; empty required live positive tenant ID |
| Statement balance | bankStatementBalance number/null | Filters[statementBalance] → GetDecimal statementBalance | statementBalance; empty required, supplied zero/negative valid within decimal18,2 |
| Statement day | bankStatementDate Date/string/null | Filters[statementDate] yyyy-MM-dd → GetDate statementDate | statementDate; today UI default, valid required date normalized to day |

No false/enum/multi-select filter exists. Empty values are never submitted by validated Refresh. Complete DTO uses JsonRequired for balance/date, retains nullable legacy method wire type while making it operationally required. Requests omitting it were already unable to resolve a GL account; POST now rejects them explicitly. DTO names/namespaces and historical report members remain compatible after splitting the bundled file.

## Changed-file inventory

Frontend root `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Banking/Bank Reconciliation/BankReconciliation.routes.ts`: exit guard.
- `components/list/list.component.ts` and `.html`: replaced broken legacy screen with complete typed working session, state and shared UI.
- `components/list/list.component.scss`: removed empty file; `.spec.ts`: repaired stale component import only, no new test/run.
- `models/list.ts` and `models/create.ts`: new explicit row/session/header/action contracts.
- `services/BankReconciliation.service.ts`: real GET/POST, shared query serializer and inline GET error ownership.
- `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`: two scoped additions suppress duplicate reconciliation title; existing concurrent changes retained.
- `src/app/modules/shared/utils/voucher-type-text.ts`: new pure shared known-source translation mapping; unknown names retained and null empty.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: scoped feature and neutral source labels; unrelated vocabulary unchanged.

Backend root `F:/My Work/Sigma/SigmaBackend`:

- `SiGma.Business/Services/AccountServices/AccountReportsService.cs`: reconciliation region and localizer constructor/field only; unrelated report edits preserved.
- `SiGma.Business/IServices/IAccountReportsService.cs`: required-header comment synchronized.
- `SiGma.ViewModels/ViewModels/AccountReports/BankReconciliationVm.cs`: bundled file removed; existing six named classes split into BankReconciliationSessionRequestDto, CompleteReconciliationRequestDto, ReconciliationReportRequestDto, BankReconciliationSessionVm, BankReconciliationLineVm and ReconciliationReportLineVm `.cs` files. Historical report shape unchanged.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `.ar-SA.resx`: 10 reconciliation result/validation messages, unrelated messages preserved.
- `SiGma.ServerAPI/Documentation/AccountReportsController.xml`: required method/supplied signed amount/date/eligible rows/complete collection and real query request documentation corrected; unrelated report docs untouched.

Guidance/artifacts: UI00 v1.84, UI16 enum-string helper paragraph, UI23 neutral label ownership row, CHANGELOG1.84 and screen skill rule/history row synchronized. Contract/report under `reviews`. Pure helper extraction is adopted here only; existing CustomerStatement local mapping remains documented backlog39 and is not refactored out of scope. No feature-local copy of styles/components/output utilities was introduced.

## Phases, verification and limits

Phases0/1 discovery/evidence/freeze, 2 complete read/grid/output, 3 typed header/action inputs, 4 completion transition, 5 route/provider/interceptor/lifetime integration and 6 root source reconciliation applied. Ordinary Create/Edit/View/Delete/approval/posting/upload/numbering phases not applicable. AutoMapper unchanged: explicit read projections and explicitly constructed snapshot graph are the existing owner; no Ignore/ReverseMap needed. Domain Recalculate remains authoritative.

Source evidence on 2026-10-05: TypeScript parser inspected 9 scoped/new/vocabulary files with zero syntax diagnostics and resolved direct source imports; Angular parseTemplate reported zero syntax errors. This is parsing only, not typechecking or compilation. Check-Translations: en62/ar62, missing0/case-only0. Scoped git diff --check passed both application repositories (line-ending notices only). API/resource XML parsed, scoped keys and DTO duplicates checked. New files read explicitly because untracked files are absent from git diff. No merge markers or stale ms-lib/any/generic BankReconciliation API references remain in the feature.

Recipe check passed all8 at discovery. Learning promotion modifies canonical UI00/16/23, so final -Check reports drift in PLAN00 and PHASE00/02/03/04/05/06; PHASE01 remains OK. Canonical sources governed final reconciliation; generated files were not edited. Owner must regenerate and semantically review these derivative packets.

No source-known contract mismatch remains. Build/type/template typecheck, DI construction, HTTP behavior, EF SQL translation, real Excel/print, viewport/keyboard/RTL/themes and database verification remain pending. Existing unique index arbitrates concurrent duplicate completion; no new lock/token/schema policy is introduced. The existing read-then-save boundary does not lock concurrent journal account/state edits between eligibility validation and persistence. This residual lifecycle race requires owner concurrency acceptance; the full graph's implicit transaction ensures atomic writes but does not claim to close that race. Large complete arrays and JavaScript upper decimal18,2 precision also need volume/money acceptance; server validates amounts authoritatively.

## Owner verification and suggested commits

1. Build frontend/backend and typecheck the template/DI separately; retained scaffold spec is not a newly supplied feature test.
2. Load real bank/method with linked live GL account; verify current-day inclusive transactions, empty session, historical context, deterministic row ordering, and a collection above15/200 rows. Pick nonadjacent rows and all-loaded selection.
3. Check missing/invalid choices/date/balance, zero/negative balances, >2 fraction digits, deleted tenant references, wrong account/date, void/unposted/deleted parents, duplicate/unknown/already reserved IDs and difference !=0 via API.
4. Complete a matching selection; confirm one snapshot graph, authoritative totals and excluded rows on refresh. Repeat concurrently and verify duplicate index feedback/recovery. Assess concurrent journal edit/void behavior at validation/save boundary.
5. Exercise lookup/read/POST business and network failures, retry, dirty Refresh/Reset/exit, cancel confirmation, busy double clicks and header edits that disable stale selection/output. Cancelled POST response may be unknown; Refresh before retry.
6. Verify EN/AR labels/current-language voucher names, LTR/RTL, light/dark, keyboard labels/focus, desktop/narrow bounds, single row scroll owner/fixed footer, print all rows/context/cards, and Excel all rows/translated columns.
7. Regenerate and semantically review stale guide packets. No migration needed.

Suggested frontend commit: `Refactor bank reconciliation workspace and wire session actions`.
Suggested backend commit: `Validate bank reconciliation inputs and eligible transaction snapshots`.
Suggested documentation commit: `Document shared voucher source labels and reconciliation conformance`.

Agent utilization: root owned evidence/contract/frontend/shared pure utility/guidance/integration/final review. One `sol_worker` (`/root/backend_reconciliation`, inherited parent model because full-history fork) owned isolated backend reconciliation service/DTOs/localized messages after freeze. Independent files allowed parallel frontend/backend progress and avoided duplicate investigation. Root reviewed and integrated its output, including API docs. No further agents needed.

No builds, tests, lint, migrations, database commands, browser/application verification, commits, pushes, deployment, Sigma MCP or Graphify were run. Owner verification pending: yes; this artifact is not Closed.
