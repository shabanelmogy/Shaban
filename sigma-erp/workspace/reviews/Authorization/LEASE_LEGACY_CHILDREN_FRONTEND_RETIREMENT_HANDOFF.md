# تسليم تقاعد واجهة أطفال التأجير القديمة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | جذرا Angular القديمان Clause وPreTerminationRule ونقطتا ربطهما في routing/layout فقط |
| العقد | LEASE_LEGACY_CHILDREN_RETIREMENT_CONTRACT_FREEZE.md |
| مسؤولية التكامل | الجذر؛ الخلفية والدليل والجرد والـmetadata خارج هذا التسليم |

## الحذف والملكية

حُذف الجذران بالكامل:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/Clause/`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Agreements Dashboard 2/PreTerminationRule/`

كان كل جذر يحوي 13 ملفًا متتبعًا، ولم يظهر `git status` أو `git diff` أي
تعديل tracked أو untracked داخله قبل الحذف. حُل المساران إلى مسارين مطلقين
داخل مستودع الواجهة قبل التنفيذ. رفضت أداة الأوامر محاولة الحذف recursive
قبل تشغيلها؛ لذلك حُذفت الملفات الـ26 صراحةً عبر patch قابل للمراجعة والاستعادة
من Git، ثم أزيلت الأدلة الفارغة فقط بعد فحص فراغ كل دليل. لم يعد أي من
المسارين موجودًا على القرص.

عُدل الملفان المشتركان فقط لإزالة روابط الوحدتين:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/pages/routing.ts`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/layout/layout.module.ts`

أزيل مسارا الجذر `Clause` و`PreTerminationRule` واستيرادا خدمتيهما وكل
تسجيلاتهما المكررة في providers. لم يُضف alias أو تحويل child ID إلى parent
ID. حُفظت التغييرات السابقة الموجودة في الملفين، ومنها route الوصول وحراس
الجلسة ومسارات العملات وحذف منافذ أخرى؛ لم تُكتب أو تُرجع هذه التغييرات.

## الحدود الوظيفية

يبقى `Lease/LeaseClause` مالك قوالب البنود الفعلية، وتبقى مجموعتا البنود
وقواعد الإنهاء داخل `LeaseAgreement` ولقطات الأب. لم تُعدل ملفات هذين
المسارين في هذه المهمة، ولم تُحذف entities أو DTOs أو services الداخلية
للخلفية أو بيانات الأطفال. لا schema أو migration أو reset أو backfill.

لم تُعدّل ملفات guide أو vocabs أو registry أو backend أو جرد التوثيق أو
metadata؛ يملكها الجذر. لا طلبات أو cache أو loading أو query أو index جديدة.

## الفحوص المصدرية

- ثبت غياب مساري import القديمين من `src/app`.
- ثبت غياب الرمزين المستقلين `ClauseService` و`PreTerminationRuleService`.
- ثبت غياب route paths الجذرية `Clause` و`PreTerminationRule`.
- بقي `LeaseClause_Routes` ومسار `Lease/LeaseClause` موجودين؛ لا يُعامل
  تطابق substring `Clause_Routes` داخله كالمسار المتقاعد.
- حلل TypeScript parser الملفين المشتركين، وحُلّت جميع imports فيهما.
- مر `git diff --check` للنطاق، وروجع scoped diff مع deletions الـ26.

هذه الفحوص لا تثبت HTTP 404 أو التنقل أو runtime أو اكتمال parent workflows.
لم تُنفذ builds/tests/typecheck/lint/browser/DB/migrations/snapshots/commit/
push أو نشر، ولم يُستخدم وكلاء فرعيون.

## المتبقي عند الجذر والمالك

يتولى الجذر تعطيل MVC discovery والكتالوج الخلفي وتحديث الدليل والترجمات
والجرد والـmetadata، ثم المصالحة والتدقيق المستقل. يلزم قبول المالك النهائي
لـHTTP 404، وعدم ظهور الروابط، وبقاء شاشات ClauseType وLeaseAgreement
وعمليات الأب سليمة. الملفات المحذوفة قابلة للاستعادة من Git حتى الدمج.

رسالة commit مقترحة عند دمج الواجهة بواسطة المالك:

`refactor(lease): retire legacy child CRUD frontends`
