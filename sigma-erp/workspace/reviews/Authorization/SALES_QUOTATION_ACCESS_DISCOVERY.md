# اكتشاف SalesQuotation — البند 151 (2026-11-12)

## المرجع

مرجع Speed الأول هو [R0365](../../../shaban/sigma-erp/references/speed-analysis/2026-10-28/readable/routes/R0365--tenant-crs-salesquotation.js) و`C0812` لقائمة Sales Quotation و`C0811` للتحرير و`C0815` للعرض و`C0816` للطباعة، كما فُهرست في `references/speed-analysis/2026-10-28/sidebar/07-sales/screens/02-sales-quotation.md`. المنطق المالي والحالات الفعلية في Sigma يحكمهما Backend الحالي، لا أسماء عمليات Speed القديمة. نمط الشاشة List with routed document editor.

| الاستهلاك | Angular | HTTP وAPI resource | المنحة المقررة |
|---|---|---|---|
| القائمة/البحث/Excel والطباعة | `SalesQuotation/components/list/list.component.ts/html` | GET `/SalesQuotation` | `SalesQuotation.View`; `Customer.Lookup` فقط لفلتر العميل أو grid على أعمدة العميل |
| عرض مباشر | `components/details/details.component.ts` mode=view | GET `/SalesQuotation/GetByWithNavigationsId/{id}` | `SalesQuotation.View` فقط؛ لا GET reference في وضع View |
| إنشاء/تعديل | details + `services/salesquotation.service.ts` | POST/PUT `/SalesQuotation` | Create+Customer.Lookup+CarModel.Lookup مستقل عن View؛ Edit يضيف View+Update؛ `SettingsCommonModel.GetMySetting` اختيارية فقط لمعاينة نسبة الضريبة |
| اعتماد/رفض/مراجعة | list/details | POST `/SalesQuotation/{id}/internally-approve`, `internally-reject`, `customer-approve`, `customer-reject`, `revise`, `unapprove` | ست منح مستقلة `SalesQuotation.*` مع View، وحالة خادمية لا حالة زر فقط |
| سياق سند مقدم | list/details، embedded `Receipt` | POST `/SalesQuotation/{id}/generate-down-payment-receipt` ثم `Receipt.QuotationContext` | `SalesQuotation.GenerateDownPaymentReceipt` + View و`Receipt.Create`+`Receipt.QuotationContext` لفتح الإيصال؛ لا إنشاء إيصال من POST التمهيدي |
| رابط عقد البيع | list/details | `/SalesAgreement/create?salesQuotationId=` أو `/SalesAgreement/view/{id}` | `SalesAgreement.Create` مع prerequisites أو `SalesAgreement.View` مستقلة عن Quotation.View |

**Boundary:** `SalesQuotation` لا يحوي `BranchId` مباشرًا ولا يظهر ضمن `BranchScopeRegistry.Direct`; هو أصل عرض مشترك على مستوى tenant، لكن أسماء ومراجع `Partner`, live `SalesAgreement`, `Receipt` ذات الفروع لا يجوز تسريبها. الاستعلامات المالية مقيدة بtenant و`IsDeleted`. فحوص العمر والمنح والفرع/العميل المتاح للكتابة تتحقق في الخادم ولا تُعوضها شروط Angular.

العمليات الموروثة `GetSelect`, `CheckUnique`, `HandleActivate`, `GetAllWithNavigations` وbulk parent `AddList/UpdateList` ليست جزءًا من عقد العرض المعتمد، ويجب حجبها بـ405/nonassignable بعد مراجعة الاستهلاك. تسليم المواصفات source-only دون تشغيل build/tests/DB/HTTP.

## إصلاح أخطاء توقيع القائمة — 12 نوفمبر 2026

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | أخطاء المرفق في `list.component.ts`، وليس إغلاق البند 151 أو إعلان اكتمال تبني صلاحيات الوحدة |

كشف سجل المالك خمسة مواضع متكررة من ثلاثة تشخيصات: ثلاث callbacks تأخذ
HttpContext بينما confirmAction كان يقبل callback بلا معاملات، واستدعاء خامس
لـwarning لا يقبله التوقيع القديم، واستدعاء stripCustomerFilters بلا تعريف.
كانت استدعاءات الأفعال تحمل grants وسياق الطلب بينما المالك السفلي لم يكتمل ربطه.

أصبحت confirmAction تقبل factory بسياق HttpContext ثم requirement ثم warning
اختياريًا؛ تمرر سياق CAN_PRESENT_API_OUTCOME عبر runAction نفسه، مع فحص المنحة
والصف والسياق بعد التأكيد وقبل الإرسال. جرى توحيد استدعاءي الرفض والحذف في
مالك الكتابة نفسه ليظلا متوافقين مع التوقيع؛ الكتابة المرسلة لا تُلغى بتدمير
المكوّن، وتُحجب نتيجتها المحلية والعامة إذا انتهت ملكيتها. لا تغيير للـendpoint
أو DTO أو مفاتيح المنح أو حالات الأعمال أو الحسابات.

أُضيفت stripCustomerFilters لتصفير العميل وإزالة grid predicates الخاصة به
مع الاحتفاظ ببقية الفلاتر، وإعادة الصفحة الأولى والبحث عند تغير المرشح.
تحميل العملاء ومراقبتهم مربوطان بحق Customer.Lookup ويُفك ارتباط المراقبة
عند انتهاء الوصول/السياق، فلا تعيد الاستجابة القديمة ملء الخيارات المحجوبة.
مصدر الكاش نفسه ودورة bootstrap ثم watch محفوظان، دون طلبات أو cache جديد.

الملفات التطبيقية المعدلة في هذه الشريحة داخل جذر الواجهة
`F:/My Work/Sigma/SiGmaAngularFrontEnd/`:

- ملف القائمة: `src/app/modules/Sales/SalesQuotation/components/list/list.component.ts`.
- مواصفات سلوكية: `src/app/modules/Sales/SalesQuotation/components/list/list-action-contract.spec.ts`.
- الدليل الثنائي: `src/app/modules/UserGuide/content/sales-guide.ts`، موضوع `/SalesQuotation` الحالي؛ لا شاشة دليل أو menu جديد.

الفحص الأخير: AST signatures لكل استدعاءات confirmAction/runAction/stripCustomerFilters
مطابقة لأعداد المعاملات الحالية، وcallback المالك معلن بـHttpContext. تحليل
صياغة TS والاستيرادات المحلية على خمسة ملفات: 55 مسارًا و77 اسمًا، دون issues.
فحص scoped diff والمسافات سليم، مع تحذير LF/CRLF. هذا ليس typecheck أو بناء.
المواصفات الأربع مكتوبة ولم تُنفذ: تمرير السياق والتحذير الخامس، سحب المنحة
أثناء التأكيد، استمرار الكتابة بعد التدمير بلا نشر قديم، وتنظيف مرشح العميل
مع حفظ المرشحات الأخرى. لا ادعاء RED/GREEN.

استُهلك عقد SALES_QUOTATION_ACCESS_CONTRACT_FREEZE الحالي وUI7/26/28
ومهارات Sigma وAngular والتشخيص والتحقق من Superpowers المتاحة، وفق Master1/5/7.
فحص الحزم الثماني OK. قُرئت شريحة سبيد R0365 وشرح القائمة، ثم C0812 منفصلًا؛
لا تقدم هذه الأدلة توقيع TypeScript أو قاعدة صلاحيات إضافية، ولم يحتج الإصلاح
مكمّل أودو. لم تُغير الكتب أو الحزم أو العقد المجمد. العمل محدود بمالك قائمة
واحد؛ لم يستوف تقسيم التنفيذ المستقل الذي يبرر تفويض وكلاء جدد.

لا تغيير EF/AutoMapper/مخطط، ولا هجرة أو فهرس مطلوبان. لا قياس سرعة أو خطة SQL
في هذا الإصلاح. لم تُشغّل builds/tests/typecheck/lint/browser/HTTP/DB/migrations/
snapshots/commit/push/deploy، ولا Sigma MCP أو Graphify. حُفظت تغييرات المستخدم
والزملاء الحالية؛ تحرك Git HEAD أثناء العمل بفعل خارجي ولم ينفذ هذا العامل commit.

قبول المالك: إعادة البناء للتأكد من زوال التشخيصات الخمسة، وتجربة الاعتماد
والمراجعة وإلغاء الاعتماد مع سحب المنحة أثناء التأكيد، والتحقق من تنظيف
مرشح العميل دون مسح بقية البحث. الإغلاق التشغيلي وبقية تبني الوحدة لا يُستنتجان
من هذا الإصلاح المحدود. رسالة commit المقترحة فقط:
`fix(sales-quotation): align row action factories and customer filter cleanup`.
