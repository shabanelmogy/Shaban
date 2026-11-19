# مصالحة صلاحيات إقفال الشهور — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | MONTH_CLOSE_ACCESS_ADOPTION_CONTRACT_FREEZE.md، بقراري المالك الأخيرين |
| الهدف العام | active؛ لا اكتمال لكل الشاشات أو قبول تشغيل |

## القرار والتنفيذ

إقفال الشهر وإعادة فتحه وفحوصه لمدير الشركة فقط، في حراس الواجهة وفي فلتر API
بعد إثبات actor وفي الخدمة قبل أية معاملة. لا تكفي منحة دور عادي. تغطي البوابة
كذلك Update/ToggleStatus اللذين يستدعيان تغيير الحالة نفسه؛ رفض403 محفوظ عبر
LegacyResult وToActionResult. Add يسمح Open فقط وRemove يرفض Closed؛ لم تتوسع
هذه الدفعة إلى إنشاء إدارة CRUD جديدة للشهور.

| المسار/الحدث | المفتاح والعقد المصدرّي |
|---|---|
| دخول الصفحة/قراءة السنوات | FiscalYear.GetList؛ exact /MonthClose بلا prefix عام |
| قراءة الشهور | السابق + MonthClose.GetByFiscalYear؛ ordinary يقرأ المحفوظ فقط |
| تجهيز الناقص | تلقائي في GET لمدير الشركة ذي snapshot موثّق وtenant مطابق فقط، حسب قرار المالك؛ لا endpoint أو grant جديد |
| فتح معالج الإقفال | tenantAdmin مع VerifyValidMonth + VerifyVoucherApprovals + VerifyDataInconsistency + CloseMonth وتبعيتي القراءة |
| إعادة الفتح | tenantAdmin مع ReopenMonth وتبعيتي القراءة؛ تأكيد كسول وإعادة فحص قبل POST |
| فحوص القيود | شركة كاملة، بما فيها historical/null branch؛ IgnoreQueryFilters ضيّق مع tenant/live صريحين للجذر والتفاصيل، لا ReportEffects |
| الحالة المالية | نفس Eligibility وprevious-month/future/fiscal-open وقواعد الاعتماد والاتساق؛ Close يعيدها داخل Serializable |

القائمة تعرض الشهر والسنة والحالة؛ MonthCloseListVM يحتفظ id وfiscalYearId
وmonth/year/status واسم السنة المستهلك، دون DTO أو mapping جديد. فلتر السنة
يرسل fiscalYearId نفسه. تفاصيل الفحص تعرض message/issueCount/issues؛ لا حقول
أو حسابات مالية مشتقة جديدة.

## العمر والمالكون

المضيف وجدوله يحتفظان بالحالة مع hidden/inert ورسالة رفض واضحة. قراءات السنوات
والشهور لهما مالكا إلغاء منفصلان؛ سحب قراءة الشهر لا يلغي lookup السنوات.
أعلام interruption تُضبط في notifier قبل finalize وتحفظ بـ||=؛ regrant لا
يعيد قراءة مكتملة بسبب revision غير متعلق. تبدل الهوية/token/dataContext ينهي
الجلسة فورًا. الأفعال تحتاج كائن الصف الحالي والحالة الصالحة وعدم الانشغال.

شهادات الفحوص١–٣ تبطل مع سحب الوصول، حتى أثناء إرسال٤؛ تبدأ استعادتها من١.
الإقفال وإعادة الفتح المرسلان مستقلان ولا replay عند regrant. بعد فشل٤ دون
شهادات، Retry اليدوية تعيد الفحوص أولًا. نتائج السياق القديم لا تنشر. مغادرة
المسار موصولة بحارس feature لا يتجاوز حوارًا أو كتابة أو قرارًا معلقًا.

تحميل السنوات/الشهور من LoadingService القائم، وفحوص الحوار١–٣ من StateMessage
المحلي، والكتابات من مالكها الحالي. لا كاش source opt-in أو watch جديد. أزيل
catch عام كان يبتلع أي DbUpdateException كتعارض فريد ويعيد success جزئيًا:
التعارض الفريد الحقيقي يتبع middleware409 الحالي، وبقية الفشل لا تتنكر كنجاح.

## الفحص والحدود

قُرئ شرح Speed21/17 ثم الكود C0502 المؤرخ 2026-10-28. يثبت السنة والشهور
والإقفال وإعادة الفتح؛ لا يثبت قاعدة backend أو صلاحيات Sigma. قرار المدير
والتجهيز من المالك، ولا مفهوم غامض احتاج Odoo. شاشات/عمليات مرجعية غير
موجودة لا تُخترع في تبني الصلاحيات.

أضيفت مواصفات مصدرية لقائمة/حوار/route وMonthCloseAdministratorTests/
MonthCloseEndpointAuthorizationTests/BranchOperationRulesTests. تشمل ordinary
بكل المنح،admin،snapshot غير محلول/foreign،company journals،الجذور/الأطفال
المحذوفين أو من شركة أخرى،التجهيز مرة وفشله،وعدم إعادة الكتابة والسحب السريع.
المواصفات لم تُنفذ، ولا بناء أو lint أو DB أو browser أو migration/commit.
فحوص scoped diff وmarkers وتطابق المفاتيح مصدرية فقط؛ قبول compilation،
التشغيل والثيمين وRTL وظهور loader وخطط SQL والسباقات عند المالك.

الفهرس الفريد الحالي للشهور (SubscriptionId,Year,Month) محفوظ. استعلامات
القيود scalar Count/Any/Sum بلا per-row HTTP؛ توسعة نطاقها للشركة مقصودة
للشهادة. لا فهرس جديد دون خطة SQL وقياس،ولا schema/migration/AutoMapper جديد.

الدليل في accounts-guide.ts، عبر /UserGuide/accounts وقائمة دليل الحسابات؛
يشرح المدير فقط وتجهيز الشهور والقراءة العادية والفحوص واستعادة الوصول.
استُخدم عامل للواجهة ثم مراجعة خلفية محدودة، والجذر للتكامل والخدمة والسجل
والدليل؛ ملكيات منفصلة لتقليل الانتظار دون تكرار المسح.

رسالتان مقترحتان، دون تنفيذ commit:

- للواجهة: `feat(accounts): adopt month-close access and guarded lifecycle`
- للخلفية: `fix(accounts): restrict period closing to tenant administrators`
