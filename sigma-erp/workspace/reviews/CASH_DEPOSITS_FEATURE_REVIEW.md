# Cash Deposits — implementation and final reconciliation

| Item | Value |
|---|---|
| Status | Blocked |
| Owner verification pending | yes |
| Date | 2026-10-05 |
| Requested outcome | Review `src/app/modules/Banking/Cash Deposits` and apply approved-document changes |
| Implemented boundary | Existing CashDeposit aggregate, owned lines, list/editor/actions and directly related integration |
| Safe-slice implementation | Implemented — source-only |
| Full accounting closure | Blocked by the coordinated F5/J-1 lifecycle gaps and missing Round off contract described below |

This review reconciles the frozen contract and maintenance plan, rather than declaring the entire accounting workflow complete. Attachments supply functional/content evidence; their text and styling do not override the user's request or canonical books.

## Manifest and authority

- Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`; feature `src/app/modules/Banking/Cash Deposits`. Backend repository: `F:/My Work/Sigma/SigmaBackend`; CashDeposit service/controller/DTO/profile/domain detail and direct localization resources.
- Initial CashDeposit feature files were clean. Both repositories already contained extensive unrelated changes; shared routing/layout/toolbar/EN/AR were already modified. Initial source snapshots and incremental diffs distinguish this task from those changes. No reference module was edited.
- Authority: `F:/My Work/Sigma/AGENTS.md`, Master 2/4/5/7, applicable UI/backend blocks, mandatory screen-refactor skill. Selected UI screen 08: shared list plus routed financial editor (totals/approval). References: Workshop Job list/editor; DataTable, FilterPanel, EditableCollectionTable/EditableRows, FormSection, SummaryCards, ConfirmationDialog and ReportPrint owners. Backend pattern 3: Invoice financial boundary and PurchaseOrder tracked-child helpers.
- Phases 0–6 applied within the frozen safe slice. PLAN00 applied to existing behavior. Upload/storage is Not Applicable: CashDeposit has no document/media collection. Card settlement and Movement Check Card were excluded because they have separate aggregate owners.
- Initial recipe drift check: eight packets OK. Continuation: PHASE02/03/04/05 drift; canonical books used for those phases. Generated packets were not edited. Documentation owner regeneration and semantic review remain pending.
- Authentication is the existing AuthGuard plus interceptor-enabled HttpClient. No authorization mechanism exists. Add/update/delete/approve/unapprove/void/unvoid are authorization candidates; hidden actions are presentation gates only.
- Routes: `/CashDeposit`, `/CashDeposit/create`, `/CashDeposit/view/:id`, `/CashDeposit/edit/:id`; `details/:id` redirects to View. Route data owns mode. `CanDeactivateFn` delegates typed dirty confirmation. Obsolete independent child route/providers/scaffold removed after parent adoption.

## Functional evidence

| Evidence | Explicit visible content | Classification and final treatment |
|---|---|---|
| 1.PNG | Cash Deposits title, Create; No/Date Range/Account/Branch; Actions/No/Date/Ref/Description/Amount; View/Edit/Print/Delete; Report/Excel/Search; pagination | Explicit, implemented through canonical shared list; retained existing Bank/CreatedBy/CreatedAt plus action-state status |
| 2.PNG | Date, Bank, Ref, Detail, Payment Method and refresh, Amount; selectable source rows with Date/Voucher/No/Description/Amount/Deposited/Due/Deposited Now | Explicit; implemented as routed header and owned voucher grid; Amount derived read-only; source types/IDs validated by backend |
| 3.PNG | Total, Round off, Net Total; Cancel/Save/Save and Print | Explicit; server total and preview distinguished; saved detail reloaded before printing; Round off pending text, no invented numeric value or write field |
| 2/3 negative payments | Negative payment amounts | Conflicting with current Payment source's positive sum; preserved factual source semantics pending coordinated accounting correction |
| 4/5.PNG | Card Transactions Bank Transfers list and commission/tax settlement | Explicit, outside named Cash Deposits scope; not implemented here |
| q.PNG | Movement Check Card Documents, identity documents and supporting uploads | Explicit, separate Movement owner; not implemented here |
| All images | Layout/colors, exact calculation/permissions/numbering/rounding/ledger reversal | Layout owned by books; unseen business details Missing or source-supported reviewer decisions, never inferred as accounting approval |

## Grid, filter and API contract comparison

Actions occupy the shared first column. Exact configured fields in order:

| Grid field/type or action need | Angular property | Backend ListVM property |
|---|---|---|
| No/link | no | No |
| Date/date | date | Date |
| Ref No/text | refNo | RefNo |
| Description/text | description | Description |
| Amount/money | amount | Amount |
| Bank/text | bankName | BankName |
| Created By/text | createdBy | CreatedBy |
| Created At/dateTime | createdAt | CreatedAt (nullable, matching entity) |
| Status/status | approvalStatus | ApprovalStatus |
| Identity and action flags | id, isPosted, isVoided | Id, IsPosted, IsVoided |

ListVM removed editor-only BankId, BranchId/BranchName, PaymentMethodId/PaymentMethodName and JournalVoucherId, plus inherited unused SubscriptionId/IsActive/IsValid/IsChanged/GUID. Detail removed unused journal/base metadata. Owned write DTOs removed parent ID and every source snapshot/derived amount; only source selection and DepositedNow are editable.

| UI control | Filter/query key | Backend owner/parser | Default/absence behavior |
|---|---|---|---|
| No | `Filters[no]` | normalized trimmed scalar Contains | empty/null omitted |
| Typeable dual-month range | `Filters[dateFrom]`, `Filters[dateTo]` | ApplyListFilters, inclusive local date days | current month; clear means unbounded; incomplete/reversed range invalid |
| Account (Bank) | `Filters[bankId]` | generic positive-ID scalar predicate | null/invalid UI ID omitted |
| Branch | `Filters[branchId]` | generic positive-ID scalar predicate | null/invalid UI ID omitted |
| Sort | `Filters[sortField]`, `Filters[sortOrder]` | inherited order + stable identity tie-breaker | date descending; only sortable entity scalar fields selected; bankName not sortable |
| Pager | pageNo, pageSize | inherited CountAsync before Skip/Take, clamp1..100 | UI15; route page preserved; full output requests100 and fetches all pages |

`toListParams` omits null/undefined/empty, retains nonempty false/zero generically; this feature exposes neither Boolean nor multi-select filters. UI lookup IDs normalize nonpositive/noninteger IDs to null. Backend generic malformed scalar-filter compatibility is retained (ignored); direct writes require live tenant FKs.

| Endpoint | Response / caller |
|---|---|
| GET CashDeposit | Results<CashDepositListRow>, paged list and complete Excel/report traversal |
| GET CashDeposit/GetByWithNavigationsId/{id} | Result<CashDepositDetails>, inherited isolated deep read and profile |
| GET CashDeposit/GetById/{id} | Result detail, lean shallow projection with required navigation labels |
| GET CashDeposit/GetUndepositedVouchers?excludeCashDepositId | Results<UndepositedVoucher>; validates edit exclusion; composite Receipt/Payment identity |
| POST/PUT CashDeposit | Result saved Id; typed header/selected-owned-row snapshot |
| DELETE CashDeposit?id | Result; draft-only owned child/JV soft deletion |
| POST CashDeposit/ToggleApproval/{id}, ToggleVoid/{id} | Result; existing resolver and compatibility state transitions |

## Detail, writes and persistence

Header form: Date `Date|string|null`, required valid date; Bank/PaymentMethod `number|null`, required positive IDs; optional Branch positive ID; RefNo100 and Description500. Saved View renders server names and status/posted/voided state. Backend FK/input validation and open-period checks own the final decision.

Add sends `date, bankId, paymentMethodId, branchId, refNo, description, cashDepositDetails`. Update adds root `id`; saved selected children carry their IDs, new rows use0. Children send only `sourceType, sourceReceiptId, sourcePaymentId, depositedNow` and update identity. Tenant/audit/number/status/totals/source date/number/amount/deposited/due are excluded. Full selected snapshot omission removes saved allocations. Saved deselection uses shared confirmation; unavailable saved choices stay visible until deliberately removed.

The backend reloads eligible cash receipts/payments in batches, rejects unknown type/exclusive-ID violations, duplicates, foreign saved IDs, zero/overprecision/out-of-range input, sign mismatch and amounts exceeding persisted capacity. Receipt amount comes from its source; Payment amount from live PaymentDetails sum. Prior deposits require live/nonvoided parents and exclude the edited document. Exact validated sums own header Amount and line DueAmount; invalid input is rejected, never clamped. UI preview is not posted. Currency configured precision and existing decimal(18,2) storage limit both apply; frontend2-decimal preview may still receive stricter currency-policy rejection.

All participating CashDeposit writers use `ExecuteUniqueWriteAsync<CashDeposit>` before reads/mutations. Its existing tenant lock transaction owns every dependent save; nested transaction removed. Update maps scalar inputs, uses OwnsAll/RemoveDroppedAsync/ReconcileOwned and calculates only live lines. Removed lines keep historical parent FKs through soft deletion. Delete explicitly cleans both line collections and draft JV. Bulk AddList/UpdateList refuse unsupported aggregate bypass paths. Failure Results do not commit; transaction disposal rolls back. Source Receipt/Payment writers do not share this lock, so broader race protection is not claimed.

Write AutoMapper maps have no ReverseMap. Update ignores only CashDepositDetails because the tracked service owns reconciliation. Source snapshots are supplied by service, not AutoMapper input. Deep detail and list have explicit lean DTOs; no schema property/configuration change. Source-number restoration after numbering preserves blank source numbers inside the same transaction; no shared numbering rule was changed.

## Action-state and coverage comparison

| Action / UI | Exact source → target | Backend / payload | Guards, failure and refresh |
|---|---|---|---|
| View / row number | saved state unchanged | GET detail, view route | read errors inline/retry; authoritative snapshot |
| Print / Save and Print | saved state unchanged | view route with print query; shared session | saved detail reload; complete saved line print table; no unsaved preview printed |
| Edit / Save | not Approved, not posted, not voided → saved draft | PUT full selected snapshot | ownership/FK/source/capacity/period/allocation checks; failures retain inputs; success View route |
| Create / Save | new → saved draft | POST typed inputs | same validation; draft JV; saved Id returned |
| Delete | editable draft → soft-deleted header/lines/JV | DELETE id | shared confirmation; state/allocations/period checks; refresh applied list, previous page if last row deleted |
| Approve | (NotApproved1,false,false) → (Approved0,true,false) | ToggleApproval, empty body | shared risk confirmation; consistent root/JV tuple; resolver Post; applied list refresh |
| Unapprove | (Approved0,true,false) → (NotApproved1,false,false) | same endpoint | allocations/open-period checks; resolver Unpost; applied list refresh |
| Void | saved nonvoided → same approval/posting flags, voidedtrue | ToggleVoid, empty body | current Boolean compatibility only; allocations/period checks; capacity released; refresh |
| Unvoid | voided → same approval/posting flags, voidedfalse | same endpoint | re-read source/capacity inside lock before restoring; refuse conflicts; refresh |
| Dirty Cancel/navigation | dirty editable → leave only after confirmation | local reusable confirmation + guard | saving/pending row-confirmation blocks exit; View/pristine leave directly |
| Report/Excel | applied filter/sort snapshot → all matching rows | all paged GETs, no new endpoint | any failed page aborts output; cancellable report; shared isolated print |

Job-specific Close/Invoice Customer/Gate Pass/Labour Time/Lubrication and Job creation are Not Applicable: CashDeposit lacks those domain owners. Invoice customer/credit/other allocation workflows are Not Applicable; only current linked-JV allocation guards apply. Reference Create/View/Edit/Delete/Search/Reset/Export/Print/dirty-discard are Supported. No CashDeposit rejection/revision transition exists. Global interceptor is the single mutation success/error message owner; read failures opt out and use inline states. Both business and transport failures clear busy flags and retain retryable data.

## Override audit

| Override | Exact reason |
|---|---|
| ApplyListFilters | date range has no direct scalar entity property |
| MaterializeListAsync | lean ProjectTo list includes displayed BankName navigation |
| GetManyAsync | trim each supplied case-insensitive No key before private base predicate; base still owns paging/filter/count |
| DetailAsync | shallow endpoint needs explicit lean navigation labels/live rows |
| AddAsync | authoritative owned sources, multi-save JV, shared transaction |
| UpdateAsync/UpdateCoreAsync | serialized tracked aggregate reconciliation and JV rebuild |
| RemoveAsync | state/dependency-aware owned soft-delete cleanup |
| AddListAsync/UpdateListAsync | prevent generic bulk bypass of aggregate rules |

GetList/DetailWithNavigations and other ordinary operations remain inherited. Approval/void are feature extras, not generic overrides. Controller inherits generic CRUD and owns only three real feature endpoints.

## Final reference conformance and reconciliation

| Concern | Final symbols / compared owner | Result |
|---|---|---|
| Shell/title | CashDepositsComponent host sigma-route-host; shared list-page/panel/header + FeatureTitle; toolbar exclusion | same Job list container-fill/title ownership; local list chrome absent |
| Filters/grid | appFilterPanel stableLayout/mainColumns4; DatePicker range2 + reserved error; DataTable fill/lazy/controlled pager | same approved shared controls and row-scroll owner; visual pending |
| Routed editor | DetailsComponent, shared editor-page/panel/form/body/footer; FormSection header and lines | one master/lines composition appropriate to this aggregate; only section host bounds local |
| Rows/numerics | typed FormArray/VoucherRow, EditableRows, EditableCollectionTable; numeric:true plus shared highlighted value spans | stable FormGroup identity and shared read badges; no private cell styles |
| Totals | SummaryCards slim/row/min140/max80 | compared public shared owner values; saved authoritative vs preview distinguished |
| Print | ReportPrint session; report dialog class/body isolation; saved DataTable projection with no paging/scroll; sigma-print-flow | entire saved/complete output uses existing owners; browser acceptance pending |
| Reads/writes | switchMap/destroy cancellation, typed models/service/DTOs and error channels | compatible frozen contracts; no manual bearer/client pipeline |
| Translation | scoped EN/AR block and literal complete keys | source audit/parity results recorded below |
| Mapping/schema | profile/DTO/domain diff | calculated fields excluded from writes; only calculation method changed, no migration |
| Existing work | source snapshots vs incremental shared-file diffs | unrelated prior changes preserved; reference modules untouched |
| Accounting scope | F5/J-1/Round off | unresolved below; no full accounting-conformance claim |

No shared extraction qualified: existing owners already support the list, rows, totals, confirmations, print, dates and errors. Local adapters contain CashDeposit-specific source selection and state only. No new reusable rule was verified, so no book/skill rule was added solely for this feature.

## Remaining requirements and owner verification

| Item | Status | Required resolution |
|---|---|---|
| Round off formula/account | Missing | Owner supplies posting/formula contract; current display is pending text, excluded from write/print calculations |
| F5 source-account clearing | Confirmed finding; coordinated slice pending | Receipt historical debit account is available, but PaymentService creates no JV and draft receipt eligibility/payment sign remain unresolved; complete V3 through owning source writers before account substitution |
| J-1 reversing void | Confirmed approved policy; coordinated lifecycle pending | Shared resolver has proportional reversal but no full source void/unvoid primitive, reversal linkage/date/restoration contract; current Boolean effect remains compatibility finding |
| Screenshot payment signs | Conflicting | Resolve in coordinated accounting slice; no silent sign inversion |
| Cross-service source updates | Uncertain under races | Bind all participating source writers in coordinated plan; current lock only serializes CashDeposit writers |
| Legacy backend child controller | Compatibility risk | No ICashDepositDetailService implementation found; obsolete standalone UI removed, no new independent child service introduced |
| Visual/runtime/build | Pending | Owner checks below; syntax parsing is not compilation or acceptance |

No Add-Migration is required by this change: entity properties, nullability, lengths, EF/index/relationship configuration and schema columns are unchanged; only CashDepositDetail.Recalculate behavior changed. No migration/snapshot was created or edited.

Owner verification: build frontend/backend; exercise Create→saved View→Edit with retained/new/omitted lines, tampered snapshots, foreign child IDs, duplicate/type/ID/zero/sign/precision/due-bound cases; test rollback after journal failure and simultaneous same-source deposits; test approval/unapproval and allocations/closed periods; Void→another deposit→Unvoid conflict; saved-only Print, cancelled Print, full multi-page Excel/report and failed intermediate page; preserve applied query on return; dirty exits; read/lookup/mutation failure recovery; Arabic/English, RTL/LTR, light/dark, desktop/narrow layouts and print paper. Accounting gaps above must be resolved before ledger acceptance.

Suggested scoped commits (suggestions only, never executed):

- SiGmaAngularFrontEnd: `feat(cash-deposits): complete routed deposit editor and list actions`
- SigmaBackend: `fix(cash-deposits): validate sources and reconcile owned deposits`

Agent utilization: initial list/editor/backend workers used gpt-5.6-sol and stopped at a usage limit with partial source. Continuation reused bounded list/editor/backend completion roles with inherited model. Ownership remained disjoint: list component files; editor component files; backend CashDeposit files/localization. Root owned models/service/routes/providers/translations, contract clarifications and final reconciliation. Parallel work reduced independent UI/backend wall time after freeze; root inspected cross-layer outputs. Workstream reports are local review evidence.

No builds, tests, lint, migrations, database commands, application/browser verification, commits, pushes or deployment were run. Verification performed: source/API/reference comparisons, TypeScript and Angular template parsing, translation key/parity inspection, dead symbol checks, scoped diff and whitespace inspection.

## Final source-only verification results

- Root and workers inspected the complete scoped source/diffs separately in the two actual repositories; final scoped `git diff --check` passed in both. Git emitted only configured LF-to-CRLF normalization warnings.
- `CASH_DEPOSITS_SOURCE_AUDIT.json`: 12 current TypeScript/template/integration sources parsed; 126 used literal translation keys resolved in both dictionaries; no syntax, unresolved in-scope source import or missing-key findings. This is parsing and public-contract inspection, not type compilation.
- Translation parity script:119 CashDeposit keys in EN and AR; missing EN0, missing AR0, case-only differences0. Backend resources:22 CashDeposit keys each, XML valid, duplicate names0, missing CashDeposit service message keys0.
- Dead child-symbol search across frontend app: no remaining standalone child-service/route/component references. Removed13 unchanged dead child files after comparing each against the initial snapshot; removed2 obsolete spec scaffolds. Merge-marker/legacy-library/untyped-payload/direct-print/unsupported ES2019 API searches in current scoped source had no matches.
- Shared-file incremental comparisons from the initial task snapshot show only CashDeposit route removal, scoped provider removal, toolbar single-title exclusion and the feature vocabulary addition; prior unrelated changes remain. Initial snapshots and `CASH_DEPOSITS_DIFF_INDEX.json` retain review evidence; resource changes were separately reviewed by the backend worker and root.
- Editor/list workstream reports were reconciled with root-owned models, nullable historical labels, translations, routes, services and final source. Source-only financial/UI implementation is delivered; the overall status remains Blocked for the enumerated accounting requirements, rather than marking them complete through documentation.

## Changed application files

### Owner-reported empty Deposit Information — 2026-10-06

User reported the Deposit Information card appearing empty. Source inspection found the header host used `flex: 0 1 auto` while its projected `sigma-editor-scroll` uses `flex: 1 1 0` and the fill content permits zero minimum height. The automatic host basis therefore did not reserve usable height for the scroll content; a maximum of45% alone does not allocate that space. Changed only the feature header composition to `flex: 0 1 45%`, retaining the approved45% upper bound, internal header scroll, remaining-height voucher table, fixed totals/footer and shared print-flow release. Fields, bindings, payloads and shared component styles are unchanged.

Authority/reference: UI1/13 shared routed editor and actual Job bounded pane/form-section composition. Current recipe check passes all8 packets (the earlier drift finding above remains historical). Reviewed the one-line source correction and scoped whitespace check; no build/test/browser was run. Owner visual verification of header fields in Create/Edit/View at narrow and wide sizes remains pending. This bounded follow-up did not require delegation or a new business contract. No new reusable rule was established; existing bounded-region guidance applies.

### Branch in first header row — 2026-10-06

Owner requested Branch in the first row. Moved the existing Branch field before Payment Method in the template. The shared four-column desktop grid now orders Date, Bank, Ref No, Branch on its first row; shared two/one-column responsive breakpoints remain. No field, validation, payload or styling change. Reviewed the source move and whitespace; no prohibited execution or new tests needed for this reversible layout change.

### All header fields except notes in first row — 2026-10-06

Owner extended the layout request to every header item except notes. The existing shared `--sigma-editor-columns` input now selects5 columns for Create (Date, Bank, Ref No, Branch, Payment Method), or8 for saved Edit/View (the same fields plus Status, Posted and Voided). Description retains `sigma-field--full` and therefore occupies the next full-width row. Shared responsive2/1-column rules remain; no copied grid CSS, form or API change. Source/template parsing and scoped whitespace inspection passed; visual acceptance remains owner-pending. This supersedes the preceding four-column desktop arrangement.

### Vertical centering and checkbox state — 2026-10-06

Owner reported noncentered elements and a checkbox that did not retain its visual selection. The checkbox click handler cancelled native activation with preventDefault, allowing the browser to restore the previous checked appearance after the handler changed the row. It now handles native change, captures the requested state, restores the accepted row state immediately and invokes the existing guarded selection transition. New selections update the FormGroup and preview; saved deselections keep their accepted visual state during confirmation, and only confirmed removal changes it. Blocked/cancelled interactions retain the accepted state. Mouse and Space use the same native change event; browser verification remains pending.

Per the explicit user centering instruction, existing Bootstrap utilities center the header grid within its bounded scroll pane and its fields vertically; all projected voucher cells use align-middle. A flex wrapper centers the checkbox without the shared standalone-checkbox top offset. This is an owner-authorized presentation adjustment from the shared default top alignment, scoped to this feature; no shared style, business validation, source availability, amount or payload rule changed. TS/template parsing and whitespace inspection passed; no build/test/browser execution. Owner checks: vertical placement on wide/narrow layouts, checkbox select/unselect via click/Space, saved-removal confirm/cancel and disabled/loading states.

### Return to list after ordinary Save — 2026-10-06

Owner reported Save remained in detail instead of returning to the main feature page. The success branch now navigates to `/CashDeposit` after ordinary Create/Update Save, carrying the existing applied filter/page/sort query. The newly mounted list reloads its applied query. Only Save and Print navigates to saved View with print=true for authoritative reload/printing. Failure behavior and saved/pristine dirty-guard release remain unchanged. This supersedes the earlier ordinary Save-to-View report rows and is recorded in the frozen contract addendum. Source/template parsing and scoped whitespace inspection passed; builds/tests/browser were not run. Owner verifies ordinary Create/Update return, list refresh, failed-save retention and Save and Print.

### View details read/display — 2026-10-06

Owner reports missing View details. Source trace established the caller used inherited generic deep navigation loading instead of CashDepositService.DetailAsync's complete, explicit lean projection. Changed getDetails to the already-existing GetById endpoint; controller→DetailAsync yields the exact required header/labels/state and ordered live CashDepositDetails. This avoids unrelated recursive graph loading without inventing a fallback endpoint or changing shared repository behavior. Read-only screen rows now render the saved response array directly through the existing shared DataTable (lazy=false, paginator=false, fill=true); Create/Edit retain typed editable rows. The existing table-area host now explicitly displays flex/column to give the shared fill table its bounded row viewport. Read failures remain inline with retry; saved print data remains authoritative.

No runtime response/browser trace was available, so the original runtime cause is not asserted as proven. Source/template/import/translation parsing and scoped whitespace checks passed. Owner must reopen View with a saved deposit containing lines, compare all header/source/amount values, confirm only the row viewport scrolls, retry a failed read, and exercise Edit and saved print. No build/test/browser/database operation, schema or shared-reference change; no delegation required for this bounded correction.

| File (absolute path) | Task change |
|---|---|
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/cashdeposit.routes.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.html | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.scss | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.spec.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/list/list.component.html | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/list/list.component.spec.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/list/list.component.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/models/create.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/models/details.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/models/list.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/services/cashdeposit.service.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/cashdepositdetail.routes.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/details/details.component.html | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/details/details.component.scss | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/details/details.component.spec.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/details/details.component.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/list/list.component.html | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/list/list.component.scss | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/list/list.component.spec.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/components/list/list.component.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/models/create.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/models/details.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/models/list.ts | removed |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDepositDetail/services/cashdepositdetail.service.ts | removed |
| F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CashDeposit/CashDepositAddVm.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CashDeposit/CashDepositDetailVm.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CashDeposit/CashDepositListVm.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CashDeposit/CashDepositUpdateVm.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CashDepositDetail/CashDepositDetailAddVm.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CashDepositDetail/CashDepositDetailDetailVm.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CashDepositDetail/CashDepositDetailUpdateVm.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/BanksServices/CashDepositService.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/CashDepositProfiler.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/CashDepositController.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.Business/IServices/ICashDepositService.cs | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Banking/CashDepositDetail.cs | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/pages/routing.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/layout.module.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/toolbar/toolbar.component.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts | modified |
| F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts | modified |
| F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx | 22 feature message entries added |
| F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx | 22 feature message entries added |
