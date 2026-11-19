| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Frozen frontend/API handoff — 2026-10-06

Scope: ChequesReceivables frontend and directly related PDC backend boundary. UI: list reference Workshop/Job/list; record editor uses routed shared editor because its lifecycle posts receipts/JVs (UI13 D4-2); action dialogs reference Workshop/Job/close-job + EditorDialog. Ordinary Add/Update is backend pattern1, stateful financial transitions retain existing pattern3 service/resolver. Fields only record has no aggregate child reconciliation or tax calculations.

## Grid/read

Actions first. Columns/FE properties/BE properties in order: receiptNo/ReceiptNo, chequeNo/ChequeNo, chequeDate/ChequeDate(date), maturityDate/MaturityDate(date), bankName/BankName, customer/Customer, agreementNo/AgreementNo, amount/Amount(money), status/Status(status), notes/Notes, paymentMethod/PaymentMethod(enum), createdBy/CreatedBy, createdAt/CreatedAt(dateTime). id/Id is the action identity. Customer label falls back to Contact.Name for contact-owned PDCs. Preserve currently displayed payment/audit fields not visible in screenshots. No nested Customer/Bank/PaymentMethod objects, GUID, subscription/flags, customerCode/customerId/agreementId/receiptId in the grid DTO. No/No is displayed by the maturity picker as Voucher No (separate PDC pending rows use same list with optional No support; show No as grid column too to keep ListVM consumed).

Filters: receiptNo, chequeNo, status(0 Pending/1 Cleared/2 Bounced/3 Cancelled), paymentMethod(0 Cheque/1 PDCReceivable), customerId, branchId, agreementNo, fromDate, toDate, dateMode(chequeDate/creationDate). Query uses Filters[key]; zero retained, empty/null omitted. Current month range; dateMode chequeDate. Main six: receiptNo, chequeNo, status, paymentMethod, dateRange, customerId; advanced: branchId, agreementNo, dateMode. Paged GET PDCReceivable returns Results<Row> with actual TotalCount/TotalPages, pageNo>=1/pageSize1–100, stable Id descending; no speculative sort inputs. Export/print fetchAllPages on frozen applied filters, translated columns, failures produce no partial file.

## Record writes/detail

Add/Update editable fields only: customerId/contactId/agreementId/branchId:number|null; paymentMethod:0|1|null; chequeNo:string|null(max100); chequeDate/maturityDate:string|null(yyyy-MM-dd); bankName:string|null(max200); amount:number>0 (18,2 source storage); onAgreement:boolean; notes:string|null(max1000); batchNo:string|null(max100). Update adds id:number. Detail has same fields plus id/no/status and customer/contact/agreementNo/branch labels, receiptNo; no tenant/flags. Existing null optional inputs remain optional. OnAgreement true requires agreementId; chosen relation must exist, current DTO field preserved. View saved labels do not depend on successful lookups; Edit Pending only. Routes list/create/view/:id/edit/:id; old details/:id redirects to view. Dirty exit via shared confirmation and route guard; save retains inputs on both failure channels.

## Actions

| Action | Exact contract | Source → target | UI |
|---|---|---|---|
| Mature single | POST Mature/{id}: maturityDate, bankId, notes|null | Pending → Cleared, existing receipt/JV service | date/bank typed dialog |
| Mature bulk | POST MatureBulk: pdcReceivableIds:number[], maturityDate, bankId, branchId|null, notes|null | all selected Pending → Cleared | pending paged grid, page-only selection, date/bank typed dialog |
| Return | POST ReturnCheque/{id}: bounceDate, reason|null(max1000) | Cleared → Bounced, existing reversal | read chequeNo/date/amount + date/reason |
| Resubmit | POST Resubmit/{id}: newChequeDate, newMaturityDate|null, newChequeNo|null, notes|null | Bounced → Pending | typed existing-service form |
| Delete | DELETE ?id | Pending/Cancelled → removed | shared confirmation, keep existing backend rules |
| View/Edit | existing GET GetById/{id}, POST/PUT | Edit Pending only | one routed editor |
| Print / Report | no new accounting API | existing row/all applied rows | shared read-only print preview |

All dialog saves guard duplicates, keep drafts on failure; standard interceptor owns errors/success unless explicitly skipped for inline reads/import. Parent refresh retains applied filters/page. Bank dropdown is Bank/GetSelect ID, NOT ledger Account ID (existing resolver owns conversion). No new accounting semantics/concurrency mechanism; existing transaction/state behavior remains, residual races reported.

## Import

CSV headers in order: contactCode, contactName, paymentMethod, chequeNo, chequeDate, batchNo, bankName, amount, notes. Preview adds rowNo/status/message. Date strict shared DMY/ISO parser; payment numeric0/1 or named Cheque/PDCReceivable/PDC REC only, amount finite >0 max decimal18,2, text lengths match source. Required contactCode/payment/chequeNo/date/amount for useful import rows; no contact creation. POST PDCReceivable/Import body {rows:[{rowNo:number,contactCode:string,contactName:string|null,paymentMethod:number,chequeNo:string,chequeDate:string,batchNo:string|null,bankName:string|null,amount:number,notes:string|null}]} max1000. Returns Result<{rows:[{rowNo,isSuccess,message,id:number|null}]}>; atomic validation failure contains row diagnostics in entity despite isSuccess:false; frontend sends skip-error/success headers and owns one inline result. All valid rows create Pending records in one SaveChanges; no receipt/JV. Retry server-declared validation errors only; transport ambiguity requires reconciliation. CSV is local parse, no raw upload/storage. BatchNo schema null for existing rows.

## Reference conformance gate before edits

| Concern | Book | Actual reference/shared symbol | Target decision |
|---|---|---|---|
| List/filter/scroll | UI1/3/4/6 | JobsComponent + list.html, FilterPanel stableLayout, DataTable.fill | sigma-route-host/page/panel/table, six main filters, reserve date feedback, fixed paginator; no SCSS |
| Read cancellation/paging/export | UI2/8/28 | JobsComponent.bindListQueries; resolveListPaging; fetchAllPages; dataTableExportRows | same switchMap/defer/finalize and exact TotalCount |
| Routed editor | UI1/13/19 | Job editor shared sigma-editor-form/body/scroll/footer; BaseComponentService | single form, one inner scroll, fixed footer, typed validators |
| Dialog workflow | UI13/17/22 | JobCloseComponent, EditorDialog public title/subtitle/contentPadded/focusOnShow | translated title plus identifier subtitle; one controlled dirty-close |
| Print | UI21 | ReportPrintService.createSession, sigma-report-print-dialog | complete read-only preview, inverse printing paginator/scroll |
| Import | UI18/22 | ImportCsvComponent, CsvRecord, DataTable | reuse local CSV parser and template; typed mapping, atomic diagnostics |

No implementation source was changed before this freeze. Root owns models/service/routes/translations/list/report and final reconciliation; isolated agents may own details, actions/import, backend after this handoff.

## Integration clarifications — 2026-10-06

These record source-supported refinements; the preceding freeze remains the historical handoff.

- Canonical inherited `Service.GetManyAsync` preserves an unpaged response when both paging inputs are absent. With paging supplied, it clamps pageNo >= 1 and pageSize 1–100, defaulting to10 if size is absent. This refines the general paged-GET wording above for existing callers. This screen always sends explicit15; full output always sends100 and follows actual metadata.
- `createdAt` is nullable in the existing domain and remains nullable in the lean frontend/backend list contract. `no` is explicitly consumed by both main list and pending picker.
- `Contact.No` and `Contact.Name` have no declared persisted length limits. Import does not invent100/200-character limits for them. Dates must contain a four-digit year before the shared CSV parser is called. Decimal CSV input must survive the existing numeric transport exactly to cents; values losing precision are rejected rather than rounded.
- Import validation rejection must contain complete row diagnostics, all `isSuccess:false` and `id:null`. Confirmed success must contain one unique positive saved ID per submitted row. Missing, partial, mixed or malformed diagnostics, or transport/persistence ambiguity, lock CSV replacement/reset/save and require reconciliation. Closing that preview refreshes the list. This implements the original no-blind-retry contract; no backend idempotency promise was added.
- API model validation needs localization before the host's automatic rejection. A scoped public `PDCReceivableValidationMessages` resource accessor supplies DataAnnotation messages from the existing GeneralMessage resource pair without altering the host or generated Designer.
- Existing `Bank` / `PaymentMethod` frontend interfaces imported by CardTransactionBankTransfer remain as compatibility exports. They are not PDC response members, navigation payloads or new lookup contracts.

No accounting formula, state transition, access restriction, existing-data rewrite or migration boundary changed during integration.

## Owner amendment — modal editor and date intent — 2026-10-06

User explicitly requests «خلى الشاشة modal لانها صغيرة» and Mature Cheque dates opening only on click. This supersedes the earlier routed-editor presentation decision: Create/View/Edit now use the shared EditorDialog over the retained list. Existing URLs remain compatible through child routes under that list; the existing editor CanDeactivate guard continues to own dirty navigation. No API, field, state or accounting contract changes.

Before edits, reference gate:

| Concern | Authority / actual source read | Frozen amendment |
|---|---|---|
| Modal presentation | UI13 content-sized alternative; EditorDialog TS/HTML/SCSS | Shared shell, width860px for two field columns, contentPadded=true, focusOnShow=false; auto content height capped90dvh; flex-fill on form/body/scroll, one scroll owner; no local styles |
| Modes / exits | UI10/13/15; current details guard; EditorDialog mode-aware footer | One editor create/view/edit; X/Cancel/Escape route through requestClose then guard; View Edit only for Pending; saved close refreshes retained applied-filter list once |
| Deep links | Current PDC routes/list route-state helper | Parent list + child editor routes preserve create/view/edit/details redirect, query state; list does not rewrite child URL during initial load |
| Picker behavior | UI17; DatePickerDirective.open and focusField | Remove shown→focusField (it synthesizes a click and opens overlay). Keep shared click-only date directive, no lifecycle calendar focus; validation focus uses openOverlay=false in action dialog |

Actual VehicleService reference now uses a routed editor, so it is not evidence for modal geometry. The shared EditorDialog source and UI13 content-sized rule own this amendment. UI1's normal modal has only a list URL; retaining the previously frozen editor URLs as child routes is an explicit compatibility exception for this existing feature. These routes render only the modal over the list, not a second editor implementation. No new shared convention is established.

## Owner amendment — Resubmit height — 2026-10-06

User requests a slightly taller Resubmit dialog to avoid its normal-height scroll. Freeze Resubmit height560px (formerly480px), keeping the shared EditorDialog maximum `calc(100dvh - 24px)` and internal scroll fallback on short viewports. UI13 owns the public height input; actual EditorDialog height/maxHeight producer and Actions template consumer inspected before edit. Bulk650px and other actions480px retained. No workflow/API/schema change.

## Owner amendment — Create PDC Payable presentation — 2026-10-06

User explicitly requests Create Receivable formatting like Create PDC Payable. Read actual ChequesPayables/details HTML/TS and empty SCSS, shared EditorDialog producers and shared grid values before edits. UI13 named-modal-reference rule permits the requested reference for presentation only; PDC Receivable fields and write contracts remain authoritative.

| Concern | Named reference / shared producer | Frozen target |
|---|---|---|
| Shell | Payable omits width/height; EditorDialog width1040px, maxHeight90dvh from reference; padded=true/focus=false | Same default1040px, auto height/90dvh cap, receipt icon, create subtitle and shared footer hint |
| Field geometry | Payable direct sigma-editor-grid; shared default4 columns,2 below1024px,1 below700px; gap7px16px | Remove inner FormSection card/heading and two-column override; shared direct grid, no feature CSS |
| Body chain | Payable outer sigma-editor-form + form/body/scroll flex-fill | Match content-sized chain/body spacing; one internal scroll owner and fixed shared footer |
| Content | Payable parties→branch→payment→cheque/date→bank/amount/batch→notes; Notes full width,3 rows | Receivable customer/contact/branch/payment→chequeNo/chequeDate/maturityDate/bankName→amount/batchNo plus retained OnAgreement/AgreementId→saved identity/status if present→full-width Notes. No SupplierId/BankId or payable validation copied |
| Modes | One shared Create/Edit/View shell | Same presentation for shared Receivable editor; existing view labels, Pending-only Edit and dirty route guard retained |

This supersedes the previous860px/two-column/FormSection presentation. Payable source remains read-only and no stylesheet is imported from it. No API/accounting/schema/route change or new general guide rule.
