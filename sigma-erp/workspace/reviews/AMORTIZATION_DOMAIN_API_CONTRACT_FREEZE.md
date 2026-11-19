| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

# عقد شاشة الإطفاء

هذا عقد التنفيذ الموافق للخطة المجمدة. المالك فوّض اختيار السيناريو؛ الصورة الثانية تثبت تخصيصًا يوميًا وطلبه التابات مؤكد. لا تغيير لرؤية التقريب كحساب خادمي أو إنفاذ شروط المصدر.

## DTO/API المشترك المجمد (JSON camelCase)

كل GET أدناه Result<T> {isSuccess,entity,message,id} وليس Results؛ حدود complete2000rows تُرفض صراحة إن تجاوزت ولاtruncate. month=yyyy-MM regex year1..9999. sourceKind number:0 BillDetail,1 OpeningBalancePrepaid,2 Custom.

- GET /Amortization/sources → Source[]: sourceKind,sourceId:number,no:string|null,date:string,description:string|null,creditAccountId:number,creditAccountName:string,debitAccountId:number|null,debitAccountName:string|null,supplierName:string|null,vehicleNo:string|null,branchId:number|null,amount:number,currencyCode:string|null. لا تعرض غير مصدر eligible أوconfigured حي؛ suppliedsourceid ليس إذنًا ويعاد فحصه عند الحفظ.
- GET /Amortization/schedules → Schedule[]: id:number,sourceKind:number,sourceId:number|null,sourceNo:string|null,description:string|null,creditAccountId:number,creditAccountName:string,debitAccountId:number,debitAccountName:string,supplierName:string|null,vehicleNo:string|null,branchId:number,amount:number,startDate:string,endDate:string,currencyCode:string|null,canDelete:boolean.
- POST /Amortization/schedules ← ScheduleWrite: sourceKind:0|1|2,sourceId?:number|null,debitAccountId?:number|null,creditAccountId?:number|null,amount?:number|null,branchId:number,startDate:string,endDate:string,description?:string|null. Source standard client omits accounts/amount: resolved server-side. custom only accepts explicit accounts/amount. → Result<unknown>+id. NoUpdate: immutable; unused delete+recreate.
- DELETE /Amortization/schedules/{id} → Result<unknown> (no run history; FK/tenant).
- GET /Amortization/prepare?month=&isCustom= → Preview: month:string,isCustom:boolean,rows:PreviewRow[],totalAmount:number,count:number,previewKey:string.
- PreviewRow: scheduleId:number,sourceKind:number,sourceNo:string|null,prepaidAccount:string,expenseAccount:string,supplierName:string|null,description:string|null,vehicleNo:string|null,amount:number,startDate:string,endDate:string,periodStart:string,periodEnd:string,totalDays:number,amortizationDays:number,cumulativeBefore:number,cumulativeAfter:number,expense:number. cumulativeBefore/After are rounded recognized MONEY totals; expense=after-before. periodStart/End are intersected coverage dates inside month (for display). preparedsnapshot rows contains actualsourceprincipal and accounts. Informational '?' dialog uses these values, no extra fetch.
- POST /Amortization/runs ← {month:string,isCustom:boolean,previewKey:string} → Result<unknown>+id. serverrecompute, signature mismatch409; line reservations unique(tenant,schedule,month) where IsReserved=1/live. header no unique month (new schedules can produce additional batch).
- GET /Amortization/runs?month=&isCustom= → Run[]: id:number,no:string|null,month:string,isCustom:boolean,approvalStatus:0|1|2,isVoided:boolean,totalAmount:number,canDelete:boolean,canVoid:boolean.
- GET /Amortization/{id}/approval → existing neutral DocumentApprovalContext shape: recordId,amount,no,approvalStatus,isVoided,canApprove,canUnapprove,canReject,history[{id,approvalStatus,previousStatus,reason,statusDate,user,isVoid?}], optionalisLegacyUnprovenfalse. sourceowner run, audit historysource run. POST sameURL ← {approvalStatus:0|1|2,reason?:string|null} → Result<unknown>. guards/side effects in plan.
- POST /Amortization/{id}/void ← {reason:string} → Result<unknown>. Date/actor server audit, originalperiodchecked, journalvoid/no reversal.
- DELETE /Amortization/runs/{id} → Result<unknown>, pendingnohistory only, historypreserved.
- GET /Amortization/{id}/journal → Result<VoucherJournalLineDto[]> existing shared row date/accountCode/accountName/contact/type/voucherNo/description/debit/credit; Type=Amortization neutral text mapping.
- GET /Amortization/{id}/log → Result<AuditTrailRowDto[]> existing DocumentActionLogEntry frontend contract matches backendAuditTrail.

## Persistence and lock contract

ملحق مطابقة المدخلات: قرار الاعتماد مطلوب صراحة؛ غياب الحقل لا يتحول إلى قيمة enum الافتراضية التي تعني الاعتماد. البيان المدخل حده500حرف، وبيان المصدر المحتفظ به حده1000؛ تجاوز حدود snapshot المعلنة يُرفض دون بتر. توقيع المعاينة يتضمن سياق المستأجر والحسابات والفرع والعملة بالإضافة إلى الشهر والمبالغ والمدد. هذه ضوابط تنفيذ للعقد المجمد ولا توسع أثره المحاسبي.

Helpers.Models.Vouchers: AmortizationSchedule : EntityBase with SourceKind int and nullableBillDetailId+nav /OpeningBalancePrepaidId+nav exclusivity, DebitAccountId+nav,CreditAccountId+nav,BranchId+nav,CurrencyId+nav,Amount,StartDate,EndDate,Description,SourceNo,SupplierName,VehicleNo snapshot. publicsourceId DTO derive fromsourcekind. Run : EntityBase Month(DateTime firstday),IsCustom,ApprovalStatus,IsVoided,TotalAmount,JournalVoucherId/nav,VoidReason,VoidedAt/By,Lines collection,ApprovalLogs collection. Line: runId+nav,scheduleId+nav,Month,IsReserved=true,Expense, source/coverage/daycount/account/branch snapshots as needed for authoritative saved read. ApprovalLog EntityBase runFK,previousStatus,approvalStatus,reason,isVoid bool (voidevent keeps status) tenant/actor timestamp. One named type/file; no migrations/snapshot. Preserveallhistoricalrows.

new enum members appended only: VoucherTypeName.Amortization (existing end afterPurchaseReturn); VoucherSubType.AmortizationJV (afterClosingJV). engine generated JV uses newtype/subtype,headerDate monthend,basecurrency,linespairedperSchedule DebitAccount debitExpense /CreditAccount creditExpense (linebranch scheduled); headerbranchnull for mixed, allsource references valid. Resolver SaveJVAsync persist generateddraft; later PostAsync/UnpostAsync actualfinancialeffect. Run.No = generated JV.No (existingjournal numbering authority) rather than second parallelnumberallocator; Amortization document prefixsettings remain unused reserved configuration, reportexactdecision to owner. no schema in enums. No TaxcreationorFX.

## Root/worker ownership

Backend worker owns new AmortizationSchedule/Run/RunLine/ApprovalLog entityfiles and sealedconfigfiles; new Amortization VM folder, IAmortizationService, AmortizationService partialfiles +Controller. Root owns DbContext DbSet if needed fordiscoverability, DIregistration, enumappend, sourceguards (Bill,OpeningBalance writers/reset), JournalReportSourceResolver/newsourcepath utility and neutraltype translations/voucherTypeText/JVsubtypelist. Frontend worker owns ONLY src/app/modules/Vouchers/Amortization/**, src/app/modules/i18n/vocabs/amortization.ts exporting amortizationEn/amortizationAr objects, src/app/modules/UserGuide/content/amortization-topic.ts; root registersroute,translations,guide,tsconfig. No worker touches sharedrootfiles or otherfeatures.

Frontend mainroutedworkspace fourtabs automatic/custom/schedules/runs withsharedEditorTabs; each one scrollregion inside page. monthly regular/custom each has month control using parseMonthValue/monthValueValidator, Prepare/Excel (lastprepared rows only)/Save(snapshotonly), sourceDataTable columns prepaidAccount/supplierName/description(+sourceNo)/vehicleNo/expense and calculationaction; SummaryCards count+total. Sourceconfigdialog selects source regular or custom pair/amount branch coverage usingtypedform, validatesdates,dirtycancel guarded with sharedconfirmation. List runs supports ApprovalStatus(sharedDocumentApprovalCycle),Journal(sharedDocumentJournal),Log(sharedDocumentActionLog),Delete(sharedconfirmation),Void(reasonformdialog). bodydialogread localprogress; mainrequestpairedglobal. typederror/retry/successrefresh preservemonth&tab. no fake data or stub API. branchcachedread + watch; accountpostingselectandoperationalreadsuncached. financialpolicyfreshforce true forcustommoneyentry, notcacheoptin. Dirtyroute/cancel/close semantics maintained. Addinappguide foractualtabs and sourceconfigdailycumulative math, pendingSave→Approve,duplicatepreventionandboundaries.

## ملحق حماية المصدر أثناء التنفيذ — 2026-10-25

يمتد مصدر بند الفاتورة إلى مساري إشعار المورد الدائن/مرتجع الشراء اللذين يخفضان تكلفته. لذلك يُمنع ربط تخصيص DebitNote/ائتمان أو مرتجع بفاتورة/سطر له جدول إطفاء حي؛ كما تستبعد قراءة مصادر الإطفاء الفواتير ذات الائتمان أو المرتجع المحتفظ الذي لا يثبت صافيًا متاحًا. هذه حواجز مصدر مباشرة ضمن تكامل الميزة، ولا تغير الحسابات الحالية لتلك المستندات. تحديث/إلغاء اعتماد/حذف/إلغاء الفاتورة وفحص أفعالها محميان بالجدول نفسه تحت قفل JournalVoucherAllocation القائم. الأرصدة الافتتاحية تستخدم كامل استبدال؛ تبويب المدفوع مقدمًا كله مقفل عند وجود جدول حي، ويعرض lockReason جديدًا، وتزامن التاريخ ممنوع إن أثر في المصدر. reset الفيزيائي ممنوع حتى مع جدول محذوف محتفظ بسبب FK تاريخي، وليس حذف بياناته خلسة. generic single-write للأرصدة ممنوع أصلًا بالمالك الأساسي. لا تغير ترقيم المستندات أو جداولها الأصلية.
