# عقد اختيار عملة سند الصرف

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | 2026-11-04 |
| التفويض | استكمال إصلاح اختيار عملة الحركة؛ لا معالجة خاصة للبيانات التجريبية |

## الشريحة والعقود

تستهلك هذه الشريحة عقد CURRENCY_DOCUMENT_SELECTION_CONTRACT_FREEZE والسياسات المجمدة فيه دون فتح الترحيل الأجنبي. الشكل UI08 وBE15؛ التعديل على سند الصرف العام المستقل ومسار الحفظ/القراءة الخاص به. السند المنشأ من قرض أو راتب أو دفعة مقدمة يبقى تحت مالكه. وجود JournalVoucherId يقفل العملة وتاريخ الاعتراف وتجديد اللقطة، حتى بعد إلغاء الاعتماد. الحالة والتخصيص والرفض والإبطال تحت حراس Payment القائمة.

تضاف CurrencyId وCurrencyPreview إلى Add/Update؛ وتضاف CurrencySnapshot وMoneyDecimalPlaces وCurrencySelectionLocked إلى Detail. يعتمد PaymentLineInputVM.Amount محول CurrencyAmountJsonConverter القائم (decimal في الخادم، string في HTTP/Angular)، مع رفض زيادة الكسور قبل التحويل. مال Amount في PaymentDetail يصبح22,6 في EF. التحقق من الدقة والحدود لكل سطر وبمجموع دقيق عبر SumCurrencyAmounts، وفق كسور لقطة الحركة. لا تغيير لعقد قوائم Payment لأنها لا تعرض مبالغ، ولا لعقود القروض/الرواتب/الشيكات.

الجديد: الاختيار الصريح أو افتراضي الطرف للتهيئة فقط. Supplier يرث Partner فعلًا ويشارك هويته، لذا بحث افتراضي المورد ثم BillingInfo للطرف صحيح وليس تعارض هوية. التعديل يحتفظ باختيار الحركة عند تغيير الطرف؛ يزال شرط تطابق الافتراضي الجديد مع العملة المحفوظة. ordinary save لا يعيد تسعيرًا؛ معاينة مقبولة عبر ICurrencyService.ResolveDocumentSelectionAsync تحت CurrencyWriteLock داخل معاملة JournalVoucherAllocation الحالية. أول حفظ يستهلك السعر؛ التغيير المحفوظ ينشئ revision/PreviousUsageId من خلال حارس DbContext خاص بالسند، مع مقارنة الحالة وعدم الإبطال/الحذف/وجود قيد تحت القفل. تفرض فترة الأصل والهدف المفتوحة عند تغيير لقطة محفوظة، وتبقى قيود المصدر قائمة.

اعتماد الأجنبية يبقى مرفوضًا قبل إنشاء الحسابات/القيد، وCanApprove=false؛ الرفض المسموح لا يتوقف على العملة. لا تسوية أو قيد فرق عملة ضمن هذا التغيير. السند الأساسي يحتفظ بحد الدفتر18,2 عند الاعتماد، ويُرفض مبلغ/مجموع غير قابل للترحيل.

## الواجهة

يوصل DocumentCurrencyComponent بنفس العقد: تهيئة بعد اختيار طرف موجب، لقطة محفوظة تسبق الافتراضي، amountTexts هي جميع مبالغ السطور الحالية بالترتيب، selectionChange يطبقها كنصوص دقيقة. تغيير التاريخ يقبل بالعملة الحالية أولًا ثم التحويل. لا يعاد اختيار الافتراضي بعد قبول لقطة. pending يجمد النموذج مع إبقاء أزرار المعاينة/الإلغاء في المالك المشترك؛ فشل التهيئة يترك الطرف/التاريخ قابلين للتصحيح. يحمي الحفظ والخروج والنوافذ/المرفقات من نتيجة متأخرة. تستخدم input text مع inputmode=decimal وfinancialTextValidator من المالك المشترك وفق UI19 وBill؛ لا يوجد MoneyInputComponent في المصدر الحالي، وتصحيح هذا الاسم لا يغير السياسة. لا Number/String(number) للتحويل. الدليل الثنائي اللغة يشرح الاختيار والقفل وحد الترحيل الحالي.

## الدليل المرجعي والبوابات

قُرئ مدخل Speed ودليل شاشة18/11 Payments المؤرخ2026-10-28؛ R0328 وC1376، وخاصة conversionRateChanged/customerCurrencyChanged/customerCurrencyChangedForEdit حول448–530. يثبت وجود اختيار مستقل وتحويل مدخلات؛ الحساب المرجعي double/static-rate/2 places لا يُنسخ؛ سياسة Sigma المجمدة تملك السعر المؤرخ والدقة. لا شرح أصلي مخصص لدورة العملات في catalog؛ S232 يخص الترقيم وليس دليلًا للعملة. لا قرار مالي جديد مطلوب من Odoo هنا بعد عقد المستخدم المعتمد. بقية تفاصيل الدفع والشيكات والتخصيص ليست توسيعًا تلقائيًا لهذه الشريحة.

قراءات lookup القائمة تبقى مع ملاكها؛ Currency/GetSelect كاش معتمد عبر المشترك، ConversionPreview ولقطة السند قراءات تشغيلية بلا cache. التحميل العام للمعاينة وbusy محلي، وتبقى الموافقة محلية. لا فهرس جديد: lookupId/usageId وas-of يستخدمان الفهارس القائمة؛ الأداء وSQL والخطة والسباقات قبول مالك لاحق. التحقق source-only بلا build/tests/lint/browser/DB/migration.

## ملكية التنفيذ

الجذر يملك DbContext.Currency وDbContext cleanup والترجمات والمصالحة والسيناريو. عامل الخلفية يملك PaymentService partials وPayment DTOs وPaymentProfiler وPaymentDetailConfig فقط. عامل الواجهة يملك Payment details/models وpayments-topic فقط. لا تداخل؛ لا تعديل migrations أو ModelSnapshot أو مشتركات بلا تنسيق.

الهجرة المقترحة للمالك: ExtendPaymentCurrencySelection. لا backfill أو ترميم أو تحويل للبيانات القديمة.
