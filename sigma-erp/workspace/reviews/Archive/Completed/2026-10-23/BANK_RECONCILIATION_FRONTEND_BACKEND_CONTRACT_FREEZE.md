# Bank Reconciliation — frontend/backend handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-05 |
| Authorization | User: “راجع : src\app\modules\Banking\Bank Reconciliation وطبق كل التعديلات وفقا ل Guide” |

## Scope and shapes

Frontend route `/BankReconciliation`, its component/service/models, EN/AR feature vocabulary, directly related toolbar title suppression. Backend: the two reconciliation methods of AccountReportsService and their DTOs only. Preserve pre-existing changes in both repositories; backend AccountReportsService and vocabularies are already modified by other work.

UI: financial collection/action workspace (UI1/14, screen05), with shared DataTable selection (UI6) because journal rows are immutable and only their inclusion is edited; no editable-row/Add/Delete controls or source/type tabs. Editor shell/title/filter/summary/footer follow OpeningBalances and Workshop Job; no screenshot layout copy. Backend exception: existing report/session read (pattern5) plus persisted master-detail action with no new journal or allocation (pattern2 aggregate invariant). Existing AccountReports endpoints stay the owner; no parallel CRUD controller.

## API contract

| Operation | Route / request | Response / rules |
|---|---|---|
| Read session | GET `AccountReports/BankReconciliation`; `Filters[bankId]`, `Filters[statementDate]` yyyy-MM-dd, `Filters[statementBalance]` signed decimal, `Filters[paymentMethodId]` | `Result<BankReconciliationSessionVm>.entity`; complete `unreconciledLines`, no Skip/Take/page clamp. Bank and payment method must be live tenant references; payment method supplies GL account through the existing resolver. Payment method is operationally required despite nullable legacy DTO. |
| Complete | POST same route; `bankId:number`, `paymentMethodId:number`, `statementDate:string`, `statementBalance:number`, `reconciledDetailIds:number[]` | `Result`, no derived balances/tenant/audit/source amounts. Require nonempty unique positive detail IDs, live tenant bank/payment method/account, posted nonvoid live parent, selected GL account, date <= inclusive statement day, no already reconciled line. Recompute selected debit-credit net; exact difference zero; one graph SaveChanges. Existing unique JournalVoucherDetailId index arbitrates duplicate completions. |
| Choices | GET `Bank/GetSelect`, `PaymentMethod/GetSelect` | `Results<DropDownSelect>.entities`; scalar optionValue=id, optionLabel=value. |

Existing signed net formula is preserved: reconciledBalance=sum(selected debit-credit), difference=statementBalance-reconciledBalance. LastReconciledBalance is historical context, **not added** to this formula; screenshot alone does not authorize a cumulative accounting change. EF stores money at (18,2); frontend monetary previews reuse shared rounding at that scale, backend remains authoritative. No bank-to-payment-method restriction is invented: existing source resolves by selected payment method, and does not establish that relationship.

## Read and grid contract

Selection column first, then `voucherNo:text`, `voucherType:text` (enum translation at display/export), `date:date`, `description:text`, `debit:money`, `credit:money`. Row identity `journalVoucherDetailId:number`. Backend row properties beside columns: JournalVoucherDetailId, VoucherNo, VoucherType, Date, Description, Debit, Credit — no audit/editor fields. No per-column filters or sortable flags; API's deterministic date/id ordering is retained. Complete session array uses `lazy=false`, `paginator=false`, `fill=true` and one internal row viewport; arbitrary loaded rows remain selectable together. Header checkbox selects all loaded rows. Print/Excel cover the **complete loaded session**; print includes applied bank/payment method/date/balance context and current preview totals. The root refinement below records why the initial pager proposal was superseded before final integration.

Server-only session fields: bankId/bankName, ledgerBalance, lastReconciliationDate nullable, lastReconciledBalance, initial reconciledBalance/difference. Selected previews are labelled preview and never sent. Missing data before a successful read stays empty. Header input date is single Date|string|null, required shared masked date validator; balance number|null required finite with two-decimal scale, allows signed balances. Bank/payment method positive IDs required. Default date today, balances and choices empty; Clear restores these and clears results without an unfiltered request.

## Actions, state and exits

| Action | Source → target | Interaction / recovery |
|---|---|---|
| Refresh | valid header → loaded complete session | shared filter submit, required feedback/focus, one switchMap stream; confirms discarding selection; failures clear result and show one inline message/retry; finalize releases loaders |
| Clear | draft → empty defaults | shared mandatory Reset invokes discard confirmation when dirty; no invalid API call |
| Select | loaded current header → selected stable IDs | DataTable accessible checkboxes; gates during busy/confirmation/print or changed header |
| Reconcile | loaded current header, nonempty selection, preview difference0 → completed persisted session | shared confirmation dialog naming bank/date/count; freeze header and selection while pending/saving; backend revalidates all rows; preserve draft on failure, clear/refresh on success |
| Print/Excel | successful current loaded snapshot → output | shared print session/dataTableExportRows; no mutation or all-pages loop |
| Leave | pristine → leave; dirty → confirmation | shared canDeactivate/confirmDiscard; pending mutation/confirmation blocks exit |

No ordinary CRUD Create/Edit/View/Delete/Activate/Approve/Post/Void actions: journal entries already exist and are immutable in this workspace; their lifecycle is owned elsewhere. No new permission API; existing AuthGuard/[Authorize] and root interceptor-equipped HttpClient. Root feature service providedIn=root, environment.baseUrl. Inline read/lookups opt out of global errors, use apiErrorMessage; POST keeps global error and success owner, failures retain draft and require refresh for conflicts. No schema, AutoMapper, numbering or posting change; no migration required.

## Reviewer decisions (owner standing rule)

1. Bind the existing AccountReports GET/POST, rather than the nonexistent BankReconciliation CRUD path; source controller and DTO prove the contract.
2. Require Payment Method because current resolver cannot find a GL account without it; reject arbitrary bank-account inference or invented bank/payment relationship.
3. Preserve selected-net calculation and allow negative statement balances; source domain permits signed ledger net. Reject screenshot-value seeding and cumulative last-balance arithmetic.
4. Use read-only DataTable selection inside the financial workspace; adding editable journal controls would violate the source action contract.
5. Preserve current endpoints and DTO JSON fields. Backend may split named DTOs into individual files under the existing namespace, without changing report contracts.

## Implementation handoff

### Root refinement after shared selection inspection (2026-10-05)

The complete immutable session uses `paginator=false`, `lazy=false`, `fill=true` with one internal row viewport. This supersedes the earlier local-pager paragraph: reconciliation must select an arbitrary set of loaded rows without losing selections on page replacement. The financial-collection shape and screenshot both support an unpaginated collection. The header checkbox selects all **loaded** rows, whose completeness is established in AccountReportsService; no server all-matching action or page fetching is invented. Search/reset/success still clear the selected identities only after the applicable discard decision. Full print/export remain complete. Frontend amount-scale validation is shared; decimal(18,2) magnitude is validated authoritatively by the backend because JavaScript numbers cannot exactly represent its upper decimal bound.

Frozen independent workstreams: root frontend/UI/artifacts; backend worker owns only reconciliation DTO files and reconciliation region in AccountReportsService (plus minimal required localized failure resources). Root permitted the service's localizer constructor injection; root owns the matching API/interface documentation. Shared extraction is the pure voucherTypeText helper plus neutral translations, documented in UI16/23/skill; no reference/shared-component, entity/configuration/migration/snapshot changes. Source-only final reconciliation; builds/tests/lint/database/browser/commit/push/deploy prohibited.

Final handoff: implementation and source reconciliation recorded in BANK_RECONCILIATION_FEATURE_REVIEW.md. Operationally required method and supplied balance/date strengthen validation; wire names and historical report shapes remain unchanged. Runtime/visual/SQL/concurrency verification remains pending for the owner.
