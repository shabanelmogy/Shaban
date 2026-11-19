| Status | Owner verification pending |
|---|---|
| Draft | yes |

## نتيجة المراجعة

نتيجة مراجعة whole-document مقابل report-line:
- JournalVoucherService.DetailAsync (`SigmaBackend/SiGma.Business/Services/VouchersServices/JournalVoucherService.cs:262-296`) يقرأ الرأس عبر `Query<JournalVoucher>(Id)` ثم `ProjectTo<JournalVoucherDetailVM>`. خريطة `JournalVoucherProfiler.cs:10-16` تضم كل `JournalVoucherDetails` غير المحذوفة فقط، بلا تصفية فرع؛ والجمع/العرض في `JournalVoucherService.cs:108-180` و`JournalVoucherProfiler.cs:42-46` يعتمد كل السطور. لأن `JournalVoucherDetail.BranchId` قد يختلف عن الرأس، السماح بالهيدر وحده أو OR (أي فرع مسموح) يعرّض السطور والمجاميع المختلطة.
- `GetJournalAsync` (`.../JournalVoucherService.Journal.cs:7-41`) و`InvoiceService.GetVoucherDetailsAsync` (`.../InvoiceService.cs:947-964`) يقرآن كل السطور التابعة للرأس، لذلك نفس قاعدة all-edges مطلوبة للعرض الكامل/رابط اليومية.
- شاشات المستندات الكاملة تُسقط الأطفال وتجمعهم بلا branch predicate: `BillService.ReadBillDetailsAsync` (`BillService.cs:2195-2203`) مع `BillProfiler.cs:53-59`؛ `PurchaseOrderService.ReadDetailAsync` (`PurchaseOrderService.cs:596-601`) و`PurchaseOrderProfiler.cs:47-49,60-65`؛ `GoodsReceivedNoteService.ReadDetailAsync` (`GoodsReceivedNoteService.cs:612-617`) و`GoodsReceivedNoteProfiler.cs:43-49,67-69`؛ `InvoiceService.DetailAsync` (`InvoiceService.cs:569-600`) يضيف `RentalInvoiceItem` مباشرة (`:582-595`) حيث للعنصر BranchId مستقل (`Helpers/Models/Vouchers/RentalInvoiceItem.cs:22-23`). هذه ليست report-line reads.
- التقرير المحاسبي مختلف: `AccountReportHelper.BuildJournalQuery` (`SigmaBackend/SiGma.Business/Services/AccountServices/AccountReportHelper.cs:348-368`) يحدد الفرع الفعلي لكل سطر بـ`d.BranchId ?? d.JournalVoucher.BranchId` ثم يجمع عبر `AggregatePerAccountAsync/FetchBalancesAsync`. هنا يمكن تصفية كل سطر إلى `ReadBranchIds` والحفاظ على totals داخل النطاق؛ لا يجوز استخدام هذا OR لتحديد أهلية عرض المستند الكامل.
التوصية المحافظة للعقد/registry: نوعا حارس منفصلان: `WholeDocumentRead` = الرأس + كل child-owner/effective branches يجب أن تكون non-null ومسموحة (all-of, أي فرع غير مسموح => NotFound/Forbidden)، ويمنع حساب total من subset؛ `ReportLineRead` = كل line يُعرض/يُجمع فقط إذا effective branch مسموح، مع preserving report semantics. لا تجعل `OR any allowed branch` قاعدة عامة للوثيقة الكاملة، ولا تُخفي السطر غير المسموح مع بقاء إجمالي الرأس.
Child registry paths القريبة: `BillDetail -> Bill.BranchId` (provenance GoodsReceivedNote/PurchaseOrderDetail إضافي)، `PurchaseOrderDetail -> PurchaseOrder.BranchId` أو `PurchaseRequestDetail -> PurchaseRequest.BranchId` عند المصدر، `GoodsReceivedNoteDetail -> GoodsReceivedNote.BranchId` مع `PurchaseOrderDetail -> PurchaseOrder.BranchId` provenance، `PaymentDetail -> Payment.BranchId`, `ReceiptAllocationDetail -> Receipt.BranchId`, `CreditNoteDetail -> CreditNote.BranchId`, `DebitNoteDetail -> DebitNote.BranchId`, `JournalVoucherApprovalLog/JournalVoucherAllocation -> JournalVoucher.BranchId`, و`RentalInvoiceItem.BranchId` مباشر مستقل. المصدر: `Helpers/Models/Vouchers/*` وخرائط الخدمات أعلاه.

## حدود الاستنتاج

هذا ملحق مصدرّي للعقد المجمد، وليس قرارًا تجاريًا جديدًا. لم تُعدّل ملفات
التطبيق، ولم تُشغّل عملية بناء أو اختبار أو قاعدة بيانات أو متصفح. قاعدة
`WholeDocumentRead` المقترحة تمنع تسريب السطور والمجاميع، لكنها تحتاج اعتماد
المالك إذا أراد المنتج عرض مستند مختلط الفروع عند امتلاك فرع واحد. أما
`ReportLineRead` فمؤيد مباشرة بمصادر التقارير التي تصفي السطر أو تجمعه حسب
الفرع الفعلي؛ لا يُفترض تعميمها على إسقاطات المستند الكامل.
