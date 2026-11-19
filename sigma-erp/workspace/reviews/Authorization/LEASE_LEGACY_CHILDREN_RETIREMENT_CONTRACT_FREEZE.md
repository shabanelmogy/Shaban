# عقد تقاعد منافذ البنود وقواعد الإنهاء القديمة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | جذرا Clause وPreTerminationRule داخل Agreements Dashboard 2 والـAPI المستقل لهما فقط |
| التفويض | هدف استكمال الصلاحيات، وتوجيه المالك الاستمرار بلا أسئلة واختيار الأنسب |
| الحدود | Source-only؛ لا builds/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## القرار ودليله

التعريف الفعلي لقوالب البنود /LeaseClause يكتب ClauseType مع مجموعة البنود
المملوكة، وClauseTypeService.TemplateClauses يستبعد صفوف الاتفاقية بالـshadow
LeaseAgreementId. أما بنود الاتفاقية وقواعد الإنهاء فمجموعتان داخل LeaseAgreement،
يقرأهما ويكتبهما محررها وExtendRatePeriod عبر عقود parent snapshots وتحقيق
ملكية الأطفال. لا parent id في عقود CRUD القديمة أو فحص parent grants/branches؛
المنافذ generic المستقلة ليست تعريفات مشتركة آمنة. لا نضيف صلاحية مستقلة
تسمح بتجاوز الأب أو نخمن parent identity من id للبند.

اختير تقاعد الواجهة القديمة والـAPI المستقلين بالكامل. القوالب تبقى تحت
ClauseType، وبنود الاتفاقية وقواعد إنهائها تبقى داخل الاتفاقية حسب صلاحياتها
وقواعدها، دون تغيير تلك المصادر أو ادعاء اكتمال تبني LeaseAgreement كله.
تعطّل HTTP discovery عبر NonController على ClauseController وPreTerminationRuleController؛
لا وصول حتى للمدير لهذه المسارات، ولا assignable descriptor في الكتالوج
الحي. تبقى entities/EF/DTOs/mapping/services الداخلية والأطفال والبيانات كما هي؛
لا schema أو migration/reset/backfill. لا alias child-id→parent-id غير صحيح.

قراءة المصدر: الجذران في routing.ts، وroute files الثلاثية list/create/details،
وlist/details والخدمة/DTO للقديمين؛ الصفحة تعرض name/sku/category لبيانات
لا تمثل البنود/الأشهر، والمحرر يرسل audit/tenant fields. ملفات المجلدين
pristine في git عند الاكتشاف (١٣لكل واحد). بحث المستهلكين المحدد للمسارات
والـimports في Angular أثبت routing/layout providers وموضوعي record-list
فقط خارج المجلدين، ولا sidebar عامل لهما. بحث رموز IClauseService/
IPreTerminationRuleService في Business/ServerAPI أثبت controller/interface/
service فقط، لا parent writer يستهلكهما. لا full-solution scan.

## المرجع الوظيفي والمطابقة

قُرئ Speed S183 بتاريخ٢٧أكتوبر (1ae9800c677d6c4c) لقوالب البنود؛ ثم
sidebar10-lease/08-clauses وC0858 بتاريخ٢٨أكتوبر: مجموعة بنود تحت النوع
وتعيين الافتراضي، يطابق /LeaseClause الفعلية. وقُرئ S206
(335c15e9155b8f39) الذي يضع clauses/pre-termination داخل الاتفاقية، ثم
07-agreements وشرائح add/remove children من C0845؛ يدعم ملكية الأب، لا
CRUD مستقل لهذه الصفوف. لا API خلفي أو منحة Sigma تُستنتج من أسماء
سبيد. Odoo المكمل عن الشروط العامة لا يحسم منح الأب المتخصصة، ولا حاجة
لتغيير شروط مالية أو سلوك اتفاقية في هذا التقاعد. لا screenshot جديدة.

## التنفيذ والملكية والإقفال

الجذر يملك الخلفية والكتالوج والدليل/الترجمات والجرد والتوثيق والتكامل.
يمكن لعامل واحد ملكية frontend القديمة + routing/layout لإزالة المجلدين
والتسجيلات فقط؛ يحفظ تغييرات المستخدم والزملاء القائمة في ملفات مشتركة.
لا تعديل بقية Lease/ClauseType/LeaseAgreement أو shared/reference.
تُحذف الملفات المتتبعة pristine فقط، بعد التحقق من absolute target داخل
workspace، ولا أوامر حذف مركبة عبر shells. root يملك record-list guide
والترجمتين الخاصتين بالموضوعين، ولا يحذف namespace وظيفيًا مشتركًا.

الإقفال يثبت غياب routes/imports/providers/guide links القديمة وغياب
MVC controller discovery مع بقاء parent workflows وأنواعها. فحوص parsing/
imports/translations/scoped diff وrecipe check وقراءة untracked مباشرة؛
تدقيق مستقل read-only. تبقى صفوف Clause/PreTerminationRule resource-only
في baseline التاريخي مع retirementStatus=retired-source-only وactive candidate keys فارغة،
وretired count يرتفع من٥إلى٧ دون تزوير operation-confirmed أو حذف baseline.
الجرد عند البدء١٢٥/٧٦/٥٨/٢/٢=٢٦٣. HTTP404/التنقل/الـparent screens وتجربة
الأدوار وقبول build/runtime كلها عند المالك بالنهاية، لا source proof لها.
لا طلبات تشغيلية أو كاش/loader/query/index جديدة؛ تُزال منافذ ميتة فقط.
