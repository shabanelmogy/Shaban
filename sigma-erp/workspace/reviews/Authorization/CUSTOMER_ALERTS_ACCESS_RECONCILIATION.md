# مطابقة صلاحيات تنبيهات العملاء — البند ١٥٣

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-12 |
| العقد | [العقد المثبت](CUSTOMER_ALERTS_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | /Alerts وGET Customer/Alerts وفلتر العميل والمخرجات |
| حالة التكامل | تمت المطابقة المصدرية؛ قبول البناء والتشغيل بانتظار المالك |

## تتبع الوظيفة والبيانات

المسار `/Alerts` يستورد Customers/alerts/alerts.routes.ts. تستدعي AlertsService.getAlerts طلب GET `Customer/Alerts` الذي يستقبل CustomerAlertsRequestDto ويعيد Results<CustomerAlertDto>. مفتاحه الموجود `Customer.Alerts`، وليس Customer.View ولا Staff.Alerts. الشاشة قائمة تنبيهات للقراءة فقط: بحث وحالة وبطاقات وصفحات محلية وExcel للمجموعة المفلترة كاملة. لا إنشاء أو تعديل أو حذف أو تجديد أو فتح مرفق في نطاقها.

مصادر المرجع المقروءة: مدخل ودليل Speed بتاريخ ٢٧ أكتوبر في الأطراف والمسؤوليات ووثائق العملاء، ثم `03-customers/screens/06-alerts.md` وR0171 وC0702 بتاريخ ٢٨ أكتوبر. ثبت عرض وثائق العملاء وتصديرها من الكود المؤرخ؛ لم تُشاهد شاشة حية أو صور جديدة. بيانات بطاقات الائتمان المقنّعة المذكورة فيه ليست في API الحالي، وهي فجوة وظيفة مستقلة خارج تبني الصلاحيات. لا غموض في عقد المنحة يحتاج Odoo في هذه الشريحة، ولا ادعاء اكتمال المطابقة الوظيفية للمنتج المرجعي.

أعمدة الشبكة: `srNo / customerName(+type) / agreementNo / company / documentType / documentNo / issuedBy / issueDate / expiryDate / status`. خصائص DTO: `partnerId` لهوية الفلتر، و`srNo / customerName / agreementNo / company / type / documentType / documentNo / issuedBy / issueDate / expiryDate` للعرض. يضيف المكوّن status وdaysUntilExpiry من التاريخ وفق قاعدة العرض الحالية (٣٠ يومًا). لا مسار ملف أو معلومات راتب أو بيانات بطاقة جديدة، ولا تغيير معادلات أو DTO أو AutoMapper.

## مصفوفة الوصول

| السطح | المنحة |
|---|---|
| الدخول والقائمة/البحث/التحديث والبطاقات/الحالة والصفحات وExcel | Customer.Alerts؛ مستقل عن Customer.View |
| اختيار عميل وإرسال CustomerId | Customer.Alerts + Customer.Lookup |
| غياب Lookup | تقرير بلا فلتر عميل؛ لا GET للخيارات أو إرسال معرف محجوب |
| الفروع | استعراض اتفاقيات كاملة ضمن الفروع المسموحة، وليس تسجيلًا أو تقرير أثر جزئي |
| الملفات والملفات التعريفية المرتبطة | لا تفتحها هذه الشاشة ولا تمنح صلاحياتها |

نشر PermissionPrerequisites شرط `customerAlertsCustomerFilterSpecified` من CustomerAlertsRequestDto؛ المرشح والكتالوج يستخدمان المالك نفسه. أضيف وصف شرطه واسم عملية التنبيهات بالعربية والإنجليزية بمفاتيح كاملة ثابتة. سُجل Customer.Alerts في WholeDocumentReads: العملية GET للقراءة الفعلية، ولا تستلزم CanTransact بعد التصحيح. بقيت QueryReport ومرشحات ملكية الاتفاقية الحالية دون IgnoreQueryFilters أو تجاوز tenant/الحذف/كل فروع المستند.

## التحميل والكاش والأعمار

| المصدر | تصنيفه ومالكه |
|---|---|
| GET Customer/Alerts | قراءة تشغيلية مباشرة بلا cache؛ مصدر المجموعة الكاملة للبحث المحلي وExcel؛ قائمة واحدة ومؤشر الصفحة مع error/Retry |
| Customer/GetSelect | opted-in reference cache في CustomerService وReferenceLookupCache؛ bootstrap محدود ثم ReferenceLookupBindings watch؛ كتابة المصدر وإبطال اختياراته تحت المالك القائم |
| البحث والحالة والبطاقات والصفحات | عمليات محلية على المجموعة المحملة؛ لا طلب لكل صف أو بطاقة |

تعتمد شاشة الواجهة على مصدر المفاتيح المشترك customer-alerts-access.ts وسجل المسارات نفسه الذي تستهلكه القائمة والتنقل. تغطي القراءات ختم dataContext وrevision الدلالي والجلسة الثابتة. تبقى trigger حية، وتلغى GET/lookup/الـwatch وتختفي النتائج والـbody selects والتصدير بعد السحب أو انتهاء الجلسة. يعيد المنح في الجلسة الحالية قراءة واحدة، بينما snapshot مطابق يحتفظ بالفلاتر والاختيارات دون طلب جديد. لا يعيد رجوع الممثل السابق فتح سياق انتهى.

عند فقد Lookup تُزال هوية العميل من form وappliedFilters والخيارات، ويستبدل الطلب بقراءة عامة واحدة. يبقى البحث النصي والحالة؛ لا يُرسل customerId محجوب حتى لو كتب في control برمجيًا. عند revision يُعاد bootstrap/watch بالمالك القائم؛ حارس الطلب مستقل عن loading المرئي لمنع تداخل retry أثناء تجديد صامت، ثم يُمكّن selector بعد اكتمال المصدر الحالي. تتعامل الشاشة مع أخطاء HTTP وisSuccess:false برسالة وRetry دون قتل outer stream. يراجع Excel منحة القراءة وختم نشر المجموعة بعد التحضير قبل إنشاء الملف.

يستعمل الجدول والبطاقات والفلاتر وأخطاء الاختيارات مالكي DataTable/SummaryCards/FilterPanel/ReferenceLookupStatus الحاليين. بقي قالب الشبكة mounted مع hidden/inert وفق المالك المشترك، وتبقى templates الثابتة متاحة لتعريف الأعمدة؛ لا wrapper أو CSS منافس. هذه شريحة تبني صلاحيات على شبكة التنبيهات الحالية، وليست تحويلًا لتصميم تقرير محاسبي أو تعديلًا لقاعدة تاريخ الانتهاء.

## الأداء والفهارس

يحمل الاستعلام مستندات العملاء والسائقين المرتبطين باتفاقيات مفتوحة مرئية، ثم يستعلم عن أرقام الاتفاقيات للشركاء الموجودين في النتائج مرة واحدة؛ لا استعلام لكل صف. المصدر كامل ويُقسَّم للعرض محليًا؛ لا يُستبدل Excel بمجرد الصفحة. لم يُغيّر هذا التبني حجم النتيجة أو الطلب أو الحالة/التاريخ. قياس حجم المستندات والاتفاقيات والـpayload وزمن EF/SQL بقي للمالك.

قُرئت CustomerDocumentConfig وAgreementConfig: علاقة PartnerId ومحدودية النصوص موجودة؛ لا فهرس مركب صريح يغطي هذه القراءة في هذين الملفين. لا تُستنتج فهارس قاعدة فعلية من المصدر. لا اقتراح تعديل مخطط الآن قبل plan/cardinality وفحص تغطية فهرس المفتاح الأجنبي والفهارس الفعلية؛ كلفة كتابة ومساحة فهرس مكرر لا يبررها تبني منحة. لا migration أو data backfill.

## الدليل والتحقق

حدث موضوع `/Alerts` في `src/app/modules/UserGuide/content/customer-report-topics.ts` باللغتين، من دليل `/UserGuide/customers` القائم: منحة القراءة واختيار العميل ونطاق الفروع والتصدير وعدم منح تحرير الملفات أو قراءة مرفقاتها. لا قارئ أو مسار دليل جديد.

كتب الجذر مواصفات CustomerAlertsAccessTests.cs للكتالوج وشرط الفلتر وحارس الخادم وتصنيف الفرع، وcustomer-alerts-access.spec.ts لعزل منح المسار والفلتر. لم تُنفذ. لا بناء أو tests/typecheck/lint/browser/HTTP/DB/migration/snapshot/commit/push/deploy أو Sigma MCP/Graphify؛ قبول التشغيل وEF/SQL والتجربة المرئية عند المالك. لا تغيير schema ولا Add-Migration مطلوب.

فحصت صياغة ٣ ملفات C# مرتبطة و١٠ ملفات TypeScript/Angular مع الاستيرادات المحلية وnamespace/project reference، وفروق النطاق في كل مستودع. لا أخطاء صياغة أو import مفقود في الفحص المسموح؛ git diff --check برمز 0 مع تحذير LF/CRLF فقط، والحزم 8/8 OK في هذه الدفعة. أكملت مراجعة الفروق وملفات المصدر الجديدة دون تغيير عمل البند ١٥١ الموجود. لا يُستنتج نجاح typecheck/build/tests من هذه النتائج.

نفذ عامل gpt-5.6-terra ملفات قائمة التنبيهات الثلاثة فقط بعد التجميد، وراجع الجذر التكامل وصحح ضمانات الخطأ وbootstrap الصامت ثم استلم الملكية. الجذر يملك الخادم والمفاتيح المشتركة والمسارات والترجمة والدليل والمواصفات والتوثيق. كان الفصل بين القائمة وهذه الملفات مستقلًا؛ لم يُنشأ عامل جديد لكل تصحيح.

قبول المالك: افتح بحساب Customer.Alerts فقط دون Customer.View/Lookup، ثم امنح Lookup واختر عميلًا واسحبه أثناء GET، وتأكد من قراءة عامة واحدة وبقاء البحث والحالة. اسحب منحة القراءة أثناء GET وExcel وحوار اختيار مفتوح؛ استعد المنحة وتحقق من fresh read. جرّب تبديل الجلسة ونفس المستخدم مجددًا، وفروع استعراض دون تسجيل وشركة أخرى، وأخطاء HTTP وisSuccess ثم Retry، وتصدير جميع الصفوف المفلترة بعد التنقل. لا تحديث مرفق أو حساب أو حركة ضمن هذه التجارب.

رُقي صف `/Alerts` وحده إلى operation-confirmed بعد هذه المطابقة، فأصبح الجرد 153/263 مؤكدًا، و52 resource-only و54 unknown وبندان للسياق وبندان alias. التالي حسب الترتيب StaffTimesheet بعد تجاوز StaffBalancesSummary المؤكد مسبقًا؛ يبدأ باكتشافه وعقده ولا يرث صلاحيات Customer.Alerts.

رسالتا commit مقترحتان دون تنفيذ: `feat(customer-alerts): apply read and optional filter access` للواجهة، و`fix(customer-alerts): declare filter prerequisites and read branch scope` للخادم.
