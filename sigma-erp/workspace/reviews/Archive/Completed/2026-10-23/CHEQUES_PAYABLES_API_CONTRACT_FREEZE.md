| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Cheques Payables — API/UI handoff, 2026-10-06

Authority: Sigma AGENTS; Master2/4/5/7; UI screen01+09; BE pattern1 CRUD with existing financial maturity transition (pattern3 exception). Recipe drift check: all packets OK. Maintenance plan frozen; accounting-policy question excludes only bulk account override.

## Grid and read

Grid order: Actions, No, ChequeNo, ChequeDate(date), Bank, PartnerName(Contact), Amount(money), Status(status), Notes, CreatedBy, CreatedAt(dateTime), PaymentMethod(enum). Frontend/backend ListVM: id/Id, no/No, chequeNo/ChequeNo, chequeDate/ChequeDate, bank/Bank, partnerName/PartnerName, amount/Amount, status/Status, notes/Notes, createdBy/CreatedBy, createdAt/CreatedAt, paymentMethod/PaymentMethod, paymentJournalVoucherId/PaymentJournalVoucherId (journal action). Inherited base metadata remains transitional if generic ListVM requires its base; unused declared relationship IDs/PartnerCode/MaturityDate leave the scoped ListVM after consumer search.

GET PDCPayable uses ListSmBase pageNo/pageSize and Filters keys: paymentNo(string on No), chequeNo(string), status(ChequeStatus), paymentMethod(PDCPayablePaymentMethod), supplierId/customerId/contactId(int exact), branchId(int), fromDate/toDate(day inclusive), dateMode(chequeDate default / creationDate), sortField/sortOrder(allowlisted confirmed columns, deterministic Id tie-break). TotalCount from same filtered CountAsync; inherited normalize1–100/default10, Angular shared default15. UI main fields paymentNo/chequeNo/status/paymentMethod/dateRange/contact; advanced branch/dateMode. Null means no filter; enum0 retained; date range current month and shared validators/parsers. Applied filters govern paging/actions/export/print.

## Detail and writes

Detail GET `PDCPayable/GetByWithNavigationsId/{id}`: id,no,supplierId,supplier,customerId,customer,contactId,contact,partnerName,branchId,branch,paymentMethod,chequeNo,chequeDate,maturityDate,bankId,bank,amount,status,notes,batchNo,paymentJournalVoucherId. All displayed or used by state/edit. Create POST /PDCPayable; update PUT /PDCPayable adds id only. Editable fields supplierId/customerId/contactId/branchId/paymentMethod/chequeNo/chequeDate/maturityDate/bankId/amount/notes/batchNo. Omit No, status, journal ID, tenant, audit and flags. Required real chequeDate; amount>=0.01; chequeNo/batchNo<=100, notes<=1000; nullable selections preserve API contract. Pending server-owned initial status. Preserve all three partner references when editing historical rows; do not collapse IDs into a guessed type. Generic contact uses Partner/GetSelect (the same Partner class validated by ContactId); supplier and customer retain own select endpoints.

CSV columns: contactCode,contactName,paymentMethod,chequeNo,chequeDate,batchNo,bank,amount,notes. ContactCode exact unique Partner/GetSelect.no; contactName only validates/displays source label, never creates a contact. Bank exact unique Bank/GetSelect.value (or no), enum accepts defined numeric/name Cheque/PDCPayable only. Required amount/date cannot become zero/default on malformed CSV. New batchNo nullable max100 is the minimal screenshot-backed addition. Ordinary POST is reused per valid unsaved row with error/success interceptors suppressed; importer owns row diagnostics/count. Failed rows retain data; saved rows skipped on retry. Sample download/reset through existing CSV owner. No import endpoint/transaction promised; partial success explicit.

## Actions and transactions

| Action | Source / target | Exact contract | Interaction / recovery |
|---|---|---|---|
| View | any | detail GET | shared editor mode view, no lookup requests; labels from detail |
| Edit | Pending only | PUT inputs+id | same editor; server revalidates |
| Delete | Pending/Cancelled | DELETE PDCPayable?id | shared confirmDelete, keep row on failure, previous page if last row |
| Cancel cheque | Pending→Cancelled | POST Cancel/{id}, no body | shared warning confirmation, refresh same applied page |
| Mature single | Pending→Cleared | POST Mature/{id}: maturityDate required real date, bankAccountId required positive, notes<=1000 | typed action dialog, existing accounting entry untouched; explicit multi-save transaction |
| Mature bulk | Pending→Cleared | POST MatureBulk: pdcPayableIds nonempty positive distinct, maturityDate real, branchId/notes optional | shared page-only selectable pending grid; backend resolves account per bank. Account override remains pending owner answer; atomically reject missing/stale targets |
| Journal | paymentJournalVoucherId present | GET GetVoucherDetails/{id}: Result<VoucherJournalLine[]> | shared view-only dialog grid; no Edit |
| Report/Print All | current complete applied result | all-pages GET PDCPayable | shared print session, all rows, no invented totals |

Add/Update/Delete/Cancel one context/save use implicit transactions. Maturity existing helper saves JV then PDC; retain explicit atomic transaction and backend amount/journal ownership. No new calculation or approval/access policy. Existing concurrency limitations must be disclosed unless resolved in owning service within frozen semantics.

Reference coverage: VehicleService View/Edit/Delete→supported; checklist/parts/profile picker→N/A (no owned collection). Job list labour time/invoice/gate pass/lubrication→N/A (different aggregate); close-job action shell→Mature dialog. Backend Branch generic read hooks→supported; branch-specific fields→N/A. Activation→N/A (no demonstrated feature workflow).

## Integration and feedback

Only list route; editor supplied mode/id inputs and closed(saved:boolean) output. Legacy create/details links may redirect to list with explicit open-mode/id query state; remove redundant provider from LayoutModule, retain lazy pages route and root interceptor-enabled HttpClient. Standard mutations global success/error; read/lookup inline warnings use X-Skip-Error-Interceptor, apiErrorMessage, Retry. Reads switchMap/takeUntilDestroyed; save failures retain draft and finalize loader; dirty close uses shared confirmation preset. No pre-emptive tsconfig files additions.

## Pre-edit conformance evidence

| Concern | Book | Actual reference / shared owner | Target decision |
|---|---|---|---|
| Shell/filter/grid | UI1/3/4/6/28 | Job list sigma-route-host / stableLayout / bindListQueries; shared DataTable fill and resolveListPaging | replace ms-lib, no feature stylesheet, real totals |
| Dialog modes/body/footer | UI13/15 | VehicleService details applyMode/requestClose/save; EditorDialog mode/contentPadded/closeDisabled | controlled list-owned shell, single form, content-sized flex-fill |
| Date/numeric/validation | UI17/19/27 | shared DatePicker/date-utils/FieldError/numeric focus | use owners; no date ISO shifts or tenant/status inputs |
| Enum/lookup | UI16 | enumOptions + TranslateOptionsPipe; owning GetSelect responses | explicit backend enums, null clear values, historical View labels |
| CSV | UI22 | ImportCsvComponent columns/headerAliases/fileImported; customer-import csvNumber | shared sample/parse, typed row diagnostics and ordinary Add |
| Backend read | BE5/7/9/13 | BranchService ApplyListFilters / inherited Service count+paging | no redundant controller/list override |
| Feedback/print | UI21/22 | ReportPrintService createSession / apiErrorMessage / interceptor | complete register, exactly one feedback owner |

Authorization candidates: Add/Update/import, Delete/Cancel, Mature/MatureBulk and journal read. Authentication exists; no per-action authorization invented. No reference-source edits, builds/tests/lint/migrations/database/browser/commits/pushes/deployments.

## Final consumer reconciliation — 2026-10-06

The final editor consumer audit found no use of `paymentJournalVoucherId` in the detail editor. Remove it from both detail DTOs; it remains in ListVM/List DTO as the journal-action gate. This narrowing follows the lean-detail requirement without changing persistence or the journal endpoint. Both read VMs now use explicit properties instead of inherited unused metadata; list `Id` is non-nullable, matching entity identity. The importer uses the `pdcPayable.importDialog` translation namespace; its outer header action uses `pdcPayable.importTitle`. These naming changes do not alter CSV or API contracts.

The user said «كمل» after the optional bulk-account-policy question without choosing a different posting policy. The frozen per-bank resolver therefore remains; the common selected-account alternative is still outside this implementation.

### State/save concurrency refinement — 2026-10-06

The owning EF config will mark the existing status, soft-delete flag, journal link and editable scalar columns as concurrency tokens (original-value comparisons, no new row-version column). This applies BE14's state/dependency concurrency decision and BE15's existing-column token convention. Source evidence: tracked repository reads/Update preserve original values; `UnitOfWork.SaveChangesAsync` rethrows ordinary concurrency conflicts; middleware localizes them as 409; `JournalVoucherResolver.SaveAndPostJVAsync` shares the context and surrounding transaction. An edit, deletion, cancellation or maturity that changes the loaded row before the next write causes that stale write to fail; explicit maturity transaction disposal rolls back its journals. Every action must also reject a false SaveChanges result before committing or returning success. No client version field or accounting-policy change is introduced. Runtime races and concurrent account/configuration changes remain owner-verification concerns; this is not a claim of tested concurrency.

`CreatedAt` remains nullable in ListVM and Angular, matching `EntityBase.CreatedAt`; historical absence displays empty rather than a fabricated default date.
