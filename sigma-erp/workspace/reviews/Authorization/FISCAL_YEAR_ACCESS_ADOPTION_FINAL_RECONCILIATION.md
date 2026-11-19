# مصالحة صلاحيات السنوات المالية — ٧ نوفمبر ٢٠٢٦

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | FISCAL_YEAR_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| الهدف العام | active؛ بقية الشاشات والقبول التشغيلي معلق |

## النتيجة

| العملية | التنفيذ المصدرّي |
|---|---|
| القائمة والصفحات وإعادة المحاولة | FiscalYear.GetList، مع mounted access/context/actor/token fencing واستعادة initial-denied/regrant وrow identity |
| التفاصيل | GetList+GetById مع Add أو Update حسب الوضع؛ تفاصيل/اقتراح تواريخ قابلة للإلغاء والاستعادة، dirty draft محفوظة، وlate callbacks محجوبة |
| الإقفال | GetList + VerifyValidFiscalYear + VerifyVoucherApprovals + VerifyDataInconsistency + CloseFiscalYear؛ الفحص/الأزرار/admin gate داخل الخادم والواجهة |
| القرار التجاري | مدير الشركة فقط؛ `BranchAccessSnapshot.IsTenantAdmin` شرط لكل فحوص الإقفال والإجراء النهائي، فوق منح المفاتيح |
| نطاق فحوص الشركة | approval/consistency تستخدم Query<JournalVoucher> مع IgnoreQueryFilters المحدود، وشروط tenant/IsDeleted الصريحة؛ تفاصيل القيود تقيد tenant/live أيضًا. لا ReportEffects أو تجاوز عام |
| تعديل التواريخ | وجود قيد خارج الحدود يستخدم IgnoreQueryFilters محدودًا لنفس tenant/live؛ فروع actor المخفية لا تسمح بإخراج قيد حي من السنة، وforeign/deleted لا تمنع |
| الحفظ والإقفال المرسل | mutations مستقلة ولا replay تلقائي؛ نتائج السياق القديم لا تطبق. discard/confirmation الملغى يعيد false، وlocal discard جديد أثناء denial متاح |
| المعالج | revoke يبطل شهادات الفحوص١–٣، وإعادة المنح تعيد المسار من١؛ لا استعادة تلقائية للكتابة٤. Previous/Next والإرسال يشترطون الشهادات المتسلسلة، والـportals تغلق |
| التصنيف الخلفي | GetList/GetById/GetSelect وVerify* view scope؛ Add/Update/Close transaction scope؛ specs غير منفذة |

## الملفات والحدود

الواجهة: Accounts/FiscalYears list/details/close/service/specs. الخلفية:
FiscalYearService.cs وPermissionAuthorizationFilter.cs وBranchOperationRules.cs ومواصفتي FiscalYearDateBoundaryTests وFiscalYearAdministratorAuthorizationTests
ومواصفات التصنيف. لم يتغير DTO/EF/schema/migration. دليل الحسابات أضاف دورة
السنوات وحالة إقفالها؛ Registry route يبقى /FiscalYear بقائمة GetList، بينما
الإقفال admin-only داخل الصفحة والخادم.

المراجعة المستقلة وجدت وصُححت: حراس actor/token/dataContext الفورية في children،
نشر خطأ حفظ قديم، decision empty، شهادات فحوص قديمة بعد السحب، previous بلا
access، initial-denied list، وتجاهل dirty draft عند denial. وُصل canDeactivate
بمسار السنة الفعلي، لا مجرد method غير مستهلكة؛ مرجع الحجب هو styles المشترك.
المراجع المستقل اللاحق لم يجد عيبًا مصدرّيًا إضافيًا. لم تُشغّل المواصفات أو build.

تُعاد فحوص الاعتماد والاتساق داخل Serializable، باستعلامات scalar تشمل الشركة
كاملة مع tenant/live صريحين للجذر والتفاصيل. فحص تغيير التاريخ يبقى AnyAsync
ضيّقًا. لا index جديد أو قياس أداء مثبت؛ الموجود من FK/index يحتاج خطة SQL
وقياسًا عند المالك قبل اقتراح فهرس إضافي. لا تعديل DTO/AutoMapper أو migration.

## التحقق المتبقي

فحص diff/markers/whitespace مصدرّي فقط. يلزم تشغيل frontend/backend tests وbuild،
ثم تجربة مدير شركة ومستخدم عادي: المستخدم العادي يرى القائمة/التعديل حسب المنح
ولا يرى أو ينفذ close، والمدير يمرر الفحوص الشاملة. تحقق من قيد حي في فرع آخر،
قيد فرع قديم/null، foreign tenant وsoft-delete، وفشل كل check دون إقفال.

رسالة مقترحة:

`feat(fiscal-year): enforce administrator-only close and company-wide checks`
