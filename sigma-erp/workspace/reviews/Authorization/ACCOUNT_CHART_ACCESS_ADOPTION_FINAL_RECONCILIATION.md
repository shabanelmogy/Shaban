# مصالحة تبني صلاحيات دليل الحسابات — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | ACCOUNT_CHART_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| الهدف العام | active؛ بقية المسارات والقبول التشغيلي معلق |

## المطابقة

| الجزء | التنفيذ |
|---|---|
| route/tree | سياسة `/Account` exact/prefix تتطلب `Account.GetAccountNestedList`؛ القراءة لا تبدأ عند غيابها |
| شجرة الحسابات | `getTreeList` تحت متطلب القراءة، مع حجب السطح وإلغاء النتيجة المتأخرة عند سحب القراءة |
| محرر التفاصيل | قراءة `Account.View` و`AccountTypeDefinition.GetOptions` و`CostCenter.Lookup`؛ السطح المركب hidden/inert عند الرفض |
| إنشاء/تعديل/حذف | `Account.Create` و`Account.Update` و`Account.Delete` منفصلة، مع إعادة فحص قبل الحدث |
| التحويل | `Account.ConvertToGroup` مستقل، مع confirmation وحالة الحساب واسم المجموعة |
| التهيئة | `AccountTypeDefinition.Initialize` مستقل، مع confirmation ونتيجة التهيئة |
| الدليل | أضيفت خطوة ثنائية اللغة توضح أن كل حدث يحتاج منحة مستقلة وإنفاذ الخادم |

## الأداء والحدود

الشجرة الحالية تحمل بنية الحسابات وتبني العرض المحلي كما هي؛ لا تغيير query أو
schema أو index. لا قياس سرعة أو SQL plan أو قبول بصري ضمن source-only.

## التحقق

أضيف عقد access helper ومواصفة route/source. أُجريت مراجعة مصدرية للمسارات
والطلبات والمفاتيح، وفحص الوصفات والوثائق وJSON و`diff --check` وmerge markers.
لم تُشغّل الاختبارات أو build أو lint أو browser أو DB أو migrations.

رسالة واجهة مقترحة:

`feat(accounts): adopt chart of accounts access guards`

لا هجرة أو DTO/AutoMapper أو تغيير مالي مطلوب. قبول المالك المعلق: مدير/عادي،
كل حدث مع منحة مستقلة، revoke/regrant أثناء القراءة والتأكيد والكتابة، المسودة
والـ409، الثيمين وRTL والموبايل وظهور loader.

## متابعة البند 170 — 13 نوفمبر 2026

**ملاحظة عالية الخطورة أُغلقت في المصدر:** كان فحص القيود التي
تمنع الحذف أو تعديل نوع الحساب يتأثر بمرشح فروع المستخدم؛ فكان
وجود قيد صحيح في فرع مخفي غير مرئي لطبقة التحقق.
يستخدم الآن
SiGma.Business/Validators/Accounts/AccountValidator.cs:451-458,488-496
وSiGma.Business/Services/AccountServices/AccountService.cs:204-214,301-308
استعلام وجود القيود داخل الاشتراك بكامله، مع استبعاد المحذوف،
دون كشف رقم القيد أو تفاصيل الفرع المخفي. يتطابق مؤشر وجود
حركات في الشجرة مع قيد الحفظ والحذف في الخادم.

عالجت واجهة Accounts/Account/components/list/list.component.ts
وdetails/details.component.ts حالات سحب العرض وسحب منح
الأحداث والتأكيدات ومغادرة المسودات، مع تسوية نجاح
Create/Update/Delete/Convert/Initialize المرسل دون إعادة طلب
عند إعادة المنحة لنفس المالك. تظل المنح المستقلة التي سبق
تجميدها مطلوبة حسب الإجراء.

**التحقق:** نجح بناء SiGma.Business وفحص TypeScript.
نجح اختبار AccountHiddenJournalScopeTests (1/1):
يوجد قيد مخفي في الفرع 20 مع إمكانية رؤية الفرع 10
فقط، فيُرفض حذف الحساب المستخدم ويُسمح بحذف حساب غير مستخدم؛
وتُستبعد قيود الاشتراك الآخر والصفوف المحذوفة. هذا اختبار
InMemory لطبقة الخدمة والمدقق؛ لم يحدث قبول SQL/HTTP حي أو
تطبيق Migration أو مراجعة بصرية.
