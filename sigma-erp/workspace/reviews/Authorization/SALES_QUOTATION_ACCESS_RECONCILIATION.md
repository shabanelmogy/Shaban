# مطابقة صلاحيات عروض أسعار البيع — البند 151

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-12 |
| النطاق | وحدة `SalesQuotation` النشطة: المسارات والقائمة والتصدير والمحرر والقرارات والسند والعقد والـAPI |
| العقد | [العقد المجمد](SALES_QUOTATION_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](SALES_QUOTATION_ACCESS_DISCOVERY.md) |

## الوظائف والعقود

| العملية | المنح المطلوبة | أصل التنفيذ |
|---|---|---|
| القائمة والبحث والقراءة والطباعة والتصدير | `SalesQuotation.View` | `SalesQuotationService.GetManyAsync`, `GetDetailAsync` |
| فلتر العميل وأعمدة العميل | `SalesQuotation.View`, `Customer.Lookup` | مصدر العملاء المختار واستعلام القائمة المشروط |
| إنشاء مستقل عن عرض القائمة | `SalesQuotation.Create`, `Customer.Lookup`, `CarModel.Lookup` | `SalesQuotationService.AddAsync` |
| تعديل | `SalesQuotation.View`, `SalesQuotation.Update`, `Customer.Lookup`, `CarModel.Lookup` | `SalesQuotationService.UpdateAsync` |
| حذف | `SalesQuotation.View`, `SalesQuotation.Delete` | `SalesQuotationService.RemoveAsync` |
| اعتماد/رفض داخلي، اعتماد/رفض عميل، إعادة مراجعة، إلغاء اعتماد | `SalesQuotation.View` وكل من مفاتيح `SalesQuotation.InternallyApprove`, `InternallyReject`, `CustomerApprove`, `CustomerReject`, `Revise`, `Unapprove` بصورة مستقلة | نقاط POST المسماة في `SalesQuotationController` |
| تهيئة سند المقدم | `SalesQuotation.View`, `SalesQuotation.GenerateDownPaymentReceipt` | `POST /SalesQuotation/{id}/generate-down-payment-receipt` |
| إنشاء سند المقدم الفعلي | إضافة إلى السابقة: `Receipt.Create`, `Receipt.QuotationContext` | محرر الإيصال المشترك |
| فتح عقد مرتبط أو إنشاء عقد جديد | `SalesAgreement.View` أو حزمة `SalesAgreement.Create` ومصادرها كل بحسب الفعل | مسارات العقد المستقلة |
| نسبة الضريبة للمعاينة | `SettingsCommonModel.GetMySetting` اختياريًا | `TaxSettingsService`; المعاينة الافتراضية عند الغياب |

أُلحقت [معالجة ملاحظات المصدر F1–F3](AUTHORIZATION_151_P2_REMEDIATION_20261112.md): التجديد المطابق لا يمسح حوارات السبب والإيصال، والسحب المؤقت يحجبها مع الاحتفاظ بالمسودة. نسبة المعاينة لا تتحول إلى اختيار ملزم؛ `TaxPercentage = null` في Add/Update يطلب النسبة الحالية من سياسة الخادم، بينما `0` يظل اختيارًا صريحًا مشروطًا بسماح السياسة. عند انتهاء actor/session/branch context يظل تجاهل المسودة محليًا متاحًا للمغادرة، دون إعادة استخدام صلاحية السياق القديم. التقرير الأصلي قراءة فقط محفوظ كدليل تاريخي، والقبول التشغيلي لهذه المعالجة معلق.

## دليل الوظيفة والشكل

استُخدم دليل التحليل المرجعي وشرح شاشة المبيعات، ثم تعريف المسار R0365 والكود C0812 المؤرخ 2026-10-28 لشاشة Sales Quotation. وجود الاعتمادات والموافقات والفلاتر وروابط العقد والسند في Speed دليل وظيفي؛ عقد الخادم والصلاحيات هو المعتمد في Sigma. شكل الشاشة 02: قائمة مع محرر مستند بمسارات مستقلة وتبويبات البنود وشروط السداد. لم تستدعِ هذه الشريحة استنتاج سياسة مالية جديدة من Odoo.

## حدود التنفيذ والمطابقة

طُبقت منح المصدر الفعلية في القائمة والمسارات والمحرر، وحُرست قراءات GET وExcel من سحب الوصول أو تغيير الممثل والجلسة ومراجعة المنح. يعيد المحرر تحميل البيانات عند إعادة المنحة مع الحفاظ على المسودة؛ لا تخرج نتائج الحفظ/القرارات المرسلة إلى سياق آخر ولا تُلغى كتابة أُرسلت بالفعل. يحجب المحرر الطباعة المعلقة إذا سُحب View قبل وصول الطلب إلى نافذة المتصفح، ويُوجّه مستخدم الإنشاء فقط إلى مسار آخر متاح عند الخروج. تقيّد واجهة العميل خياراته ومخرجاته بمنح `Customer.Lookup` وفق العقد. دليل المستخدم ثنائي اللغة في `UserGuide/content/sales-guide.ts`.

الأصل التجاري `SalesQuotation` مشترك على مستوى اشتراك الشركة، بينما إسقاطات العميل تعتمد نطاق `VisibleCustomers()` وفروع القراءة. أضاف `PermissionPrerequisites` طلب `Customer.Lookup` الشرطي عند مرشح العميل أو فرز اسمه/كوده أو أعمدته داخل Grid، بما يشمل الطلبات المباشرة عبر API. حسّن `GetManyAsync` حد التاريخ إلى نطاق مفهرس وتجاوز `DateTime.MaxValue` وحمى ترقيم الصفحات الفارغة؛ استُخدمت `Query<SalesQuotation>` المعزولة بالمستأجر، و405 لمسارات الـCRUD غير المدعومة. يرد غير الموجود/المحجوب 404 في مساري حالة Unapprove وتجهيز الإيصال.

في سياق سند المقدم عبر `ReceiptService.Context.cs` يُرفض كشف `CustomerId/Name` أو مبلغ العرض إن لم يُسمح فرع العميل، قبل اختبار الأهلية وتفاصيل المبلغ. يُفحص وجود إيصال حي لنفس العرض عبر الاستعلام الخام مع تثبيت `SubscriptionId` والحذف المنطقي وحالة الإبطال، فلا يتجاهل إيصالًا حيًا محفوظًا في فرع آخر ولا يُكشف ذلك الفرع أو معرّف السند. بقيت سياقات الإيصالات الأخرى مستقلة عن تعديل الشريحة 151.

تقاس سرعة القائمة وترجمة تعبيرات EF/SQL وخطة الفهارس ونتائج التزامن في قبول المالك لاحقًا؛ لا نتائج قياس تشغيلية من فحص المصدر وحده.

## حدود التحقق

هذا تسليم مصدرّي فقط. تحققت سلامة فروق الملفات المعدلة بـ`git diff --check` داخل مستودعي Angular والـBackend، ونجح فحص اتساق الحزم الثماني. أضيفت مواصفات مصدر لحالات سحب View أثناء GET/Excel، وبقاء الكتابة المرسلة، وإنشاء المسار دون View؛ لم تُنفذ. لم تُشغّل build/tests/typecheck/lint/browser/HTTP/DB/migrations/snapshots/commit/push/deploy. تبقى تجربة الفروع وسحب/استرجاع المنح والتزامن والحفظ المرسل وقياس SQL وخطة الأداء والقبول البصري في التطبيق مسؤولية القبول التشغيلي.
