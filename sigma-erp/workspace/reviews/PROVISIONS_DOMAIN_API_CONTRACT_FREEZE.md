# Provisions — domain/API handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

## Manifest and functional evidence

Scope: first `/Provision` item, list/create/view/edit and Transactions. Tier L for extending an incomplete existing capability/schema. Read approved Job list/editor, shared FilterPanel/DataTable/EditableRows/EditorDialog/DocumentJournal, BE14 PurchaseOrder aggregate references. Backend pattern2: definition and owned rows with no save-time financial effect. Authentication only; do not invent permissions. Unrelated extensive working-tree edits exist in both repositories, including shared owners, translations and guide registry: preserve them. No Provision feature files initially modified.

| Evidence | Classification | Frozen consequence |
|---|---|---|
| Provisions1.PNG | Explicit | No, Entry Date, Title, Day Of Month, No Of Months, Is Completed; number/date-range/title/completion/contact filters; View, Transactions, Delete; Create |
| Provisions2.PNG | Explicit | Voucher type, entry date, title, day, months, first/last dates; Account/Sub lookup/Job/Description/Debit/Credit; add/remove; totals; Save/Save and Print/Cancel |
| Provisions3.PNG | Explicit | Transactions identify provision number/title and show actual linked journal lines and debit/credit totals |
| Capture.PNG | Explicit fields; strong workflow inference | Separate Prepare and Post for selected month, due date, amount and posted flag. Save definition has no accounting effect; monthly posting implementation deferred |
| Owner text | Confirmed | Amounts are per month; derive first due date from entry date; explicit implementation authorization |

## API and read contracts

Existing root `/Provision` uses authenticated generic controller routes. `GET /Provision` receives ListSmBase and returns Results<ProvisionListVM> with totalCount/page metadata. Exact row: `id:number, no:string|null, entryDate:string|null, title:string|null, dayOfMonth:number|null, numberOfMonths:number, isCompleted:boolean|null, canEdit:boolean, canDelete:boolean`. Grid columns in order after shared Actions: no, entryDate(date), title(link View), dayOfMonth(number; 0 displays translated end-of-month), numberOfMonths(number), isCompleted(status/boolean). No contact column or child collection in list.

Filters `no`, `title` substring; `dateFrom`, `dateTo` inclusive calendar bounds over EntryDate; `isCompleted` true/false (null is unknown, never false); `contactId` positive Partner identity matching live provision details, or live historical linked journal lines. `grid` uses shared JSON and same SQL projection; action flags excluded from grid filtering. Sort only stored grid scalars no/entryDate/title/dayOfMonth/numberOfMonths; default Id descending. Filters before count/page; no page-local membership filtering. Generic scalar filtering must not duplicate/conflict feature-specific predicates.

`GET /Provision/GetById/{id}` and compatibility `/GetByWithNavigationsId/{id}` return Result<ProvisionDetailVM>: id,no,voucherSubType(number|null),entryDate,title,dayOfMonth,numberOfMonths,firstDate,lastDate,totalDebit,totalCredit,isCompleted,canEdit,canDelete,provisionDetails. Each line: id,accountId,accountName,subLookUp,partnerId,partnerName,jobId,jobNo,description,debit,credit. Optional ids/labels and persisted nullable amounts remain nullable in read models.

`GET /Provision/{id}/Transactions` returns Result<List<VoucherJournalLineDto>> matching shared VoucherJournalLine: date,accountCode,accountName,contact,type,voucherNo,description,debit,credit. Tenant-checked root; combine distinct legacy JournalVoucherId and occurrence JournalVoucherIds; return live posted nonvoid journal lines only; no date/number guessing, no journals synthesized from template rows. Dialog uses shared DocumentJournal with local read progress and Retry.

## Write and schedule contracts

`POST /Provision`, `PUT /Provision`: client inputs only voucherSubType:number (JV=0 or JVProvision=1 for new/edited definitions), entryDate:yyyy-MM-dd, title:string<=200 required, dayOfMonth:int 0..31 required, numberOfMonths:positive int32, provisionDetails full snapshot required min2. Update additionally id; line Update additionally id (0 new). Line input accountId positive required, partnerId/jobId optional positive, subLookUp/description optional strings, debit/credit nonnegative decimals within storage precision. Each line has exactly one positive side; total debit=credit>0; server monetary policy/storage authority validates precision, no silent rounding of user inputs. No subscription/no/audit/flags/status/firstDate/lastDate/totals in writes. No VAT or exchange-rate policy introduced.

Server derives first/last and all occurrence due dates from EntryDate and day; first date on/after EntryDate, day0=end-of-month and days29–31 clamp in shorter months. Months must fit DateTime year9999; reject overflow before graph creation. Monthly amounts repeat without dividing. Add saves template+lines+occurrences once. Update uses tracked owned rows, OwnsAll, retained ids, removes omitted rows, rebuilds only unposted occurrences, saves once. Do not overwrite retained child numbers/audit/tenant. Internal owned occurrences/lines need no independent business number sequence; avoid per-child number/reference reads in shared save preparation.

Existing EntityBase tenant authority remains. New ProvisionOccurrence: Id, ProvisionId, DueDate(DateTime), optional JournalVoucherId/navigation; owned collection Provision.Occurrences. Unique tenant/provision/due-date reservation includes retained history; no financial writer in this task. Add optional ProvisionDetail.PartnerId/Partner, explicit existing ProvisionId/navigation without renaming shadow columns. Existing LeaseAgreementId remains shadow and is checked with EF.Property<int?>. No automatic legacy backfill. Completion is null for no occurrence evidence; otherwise true only when exactly NumberOfMonths valid live occurrences each has a live posted nonvoid JV, false otherwise. Any retained JV reference protects mutation regardless of effective posting state.

## Actions, errors and lifetime

View/Transactions/Print supported. Edit/Delete allowed only no lease parent and no retained legacy/occurrence journal link; writer rechecks, shared confirmation and one mutation success toast. Delete soft-deletes parent/owned rows/occurrences once. Reference PurchaseOrder approve/reject/unapprove/GRN/bill actions N/A: no approval or conversion lifecycle of a definition; Posting belongs second screen. No activation UI. Inherited alternate/batch writes must not bypass validation/history guards. Reuse shared tenant write serialization where required against participating writers; future posting must acquire same lock.

Business failures localized Result; HTTP errors handled inline through existing skip-error header. Preserve draft on failure, Retry reads/lookups. List/detail/save/delete/export fetching use global LoadingService with subscribed defer/finalize and no second indicator. Transactions dialog uses sole local shared loader. Lookups local. Same-path query updates preserve pending global progress through existing LoadingService.

## Cache, routing and conformance baseline

Routes list/create/view/:id/edit/:id with data.mode; preserve details/:id as View compatibility. Shared navigation policy/appMockData for draft exit; own guard if needed; preserve applied URL filters/page/sort/grid on editor return. showPageLoading=true, one root HttpClient.

| URL/source | Classification and owner | Adoption |
|---|---|---|
| Customer/GetSelect; Supplier/GetSelect | Approved cache via respective source services; source writers/invalidation/topics remain owners | finite successful initial read, separate ReferenceLookupBindings once, selected ids/current labels, context clear, retained failures/Retry and teardown |
| Job/GetSelect | Approved source cache JobService | same finite+watch lifecycle; no local replay |
| Account/PostingSelect?usage=0 | Direct operational posting-account selector | fresh read each bootstrap/Retry, correct Account FK and server posting predicate; retain saved labels |
| Currency/GetFinancialNumberPolicy | Explicit direct policy service | inline errors, fresh Retry, no reference watch/recalculation from cache notification |
| Provision list/detail/transactions | Direct operational | no cache opt-in; cancellable reads |

| Concern | Book/reference | Shared owner and target |
|---|---|---|
| Container/header | UI1/3; Job editor/list | sigma-route-host, shared list/editor shells; FeatureTitle inside panel |
| Filters/grid | UI4/6; Job list | FilterPanel/DataTable, server metadata, withGridFilters/applied URL snapshot |
| Child rows/errors | UI13/14/19; Job editor | FormSection/EditableCollectionTable/EditableRows/FieldError; fixed footer and bounded body |
| Transactions | UI13/22; shared DocumentJournal | local read state/error/Retry, record subtitle, cancellation |
| Print | UI21 | ReportPrintSession; saved detail projection and unbounded print table |

Root owns integration/reconciliation and records final producer/consumer evidence in review. No books/skill rule change is currently needed: feature-specific decisions stay here. Owner migration/build/runtime/SQL-plan/performance checks pending; no prohibited commands authorized.

## Source-preservation clarification during implementation

The existing physical `ProvisionDetail.ProvisionId` shadow column and `AccountId` are nullable. Explicit model properties retain that nullability; required account and parent assignment are enforced for this screen's new writes, without requiring historical orphan/null-account cleanup. LeaseAgreementService remains its existing separate owner and is not modified in this first-screen slice. Its historical header-edit behavior and the inactive ProvisionDetailController/IProvisionDetailService scaffold are recorded as future integration concerns, not retroactively made part of this screen's frozen write authority. All first-screen mutation endpoints reject agreement-owned definitions.

## استكمال قرار الترحيل الشهري — ٢٠٢٦/١٠/٢٦

أجاب المالك عن سؤال النطاق المالي بصورة صفحة الترحيل الشهري التي تتضمن التجهيز والتصدير وزر الترحيل وحالة الترحيل. جُمّد هذا المسار في الخطة والعقد المستقلين، ثم نُفذ في المصدر؛ وبذلك انتهى تأجيل الصفحة المذكور أعلاه لهذا النطاق فقط. يبقى حفظ تعريف المخصص دون أثر محاسبي، وتُمنع الجداول المملوكة لعقود الإيجار أو المرتبطة بقيد قديم على رأس التعريف من الترحيل بهذه الصفحة. راجع [عقد الترحيل الشهري](MONTHLY_POSTING_DOMAIN_API_CONTRACT_FREEZE.md) و[مطابقة التنفيذ](MONTHLY_POSTING_FULL_STACK_REVIEW.md) للحالة الحالية؛ تظل الفقرات السابقة سجلًا لحدود التنفيذ وقت كتابتها. البناء والتشغيل وقاعدة البيانات والقياس عند المالك.
