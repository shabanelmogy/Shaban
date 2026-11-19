# تسليم نطاق فروع تعريفات المخصصات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | آخر ملحق قرار المالك في PROVISIONS_ACCESS_CONTRACT_FREEZE.md |
| النطاق | مرشح Provision وبنوده ومواعيده وحراسة الكتابة المتتبعة وset-based التابعة لها |
| المالك | العامل fleet_alerts_final_audit؛ الجذر يملك Business والواجهة والدليل والتكامل |

## القرار المطبق

التعريف المستقل قالب مشترك داخل الشركة حسب منح العملية؛ لا يُستنتج له
فرع من Job أو JournalVoucher، ولا أُضيف BranchId. تعريف الاتفاقية يتبع
المعرّف الظلي LeaseAgreementId، ووجود الاتفاقية الحية داخل الشركة ونطاق
قراءتها الكامل. البنود ومواعيد الجدولة لا تُقرأ دون الأب الحي نفسه، بما
في ذلك استبعاد orphan أو parent في شركة أخرى. لا توسع الفلاتر قراءة
القيد أو سطوره لمجرد أن القالب مشترك.

## الملفات ومسار التنفيذ

- ملف التسجيل `SigmaBackend/SiGma.DataAccess/Authorization/BranchScopeRegistry.cs`: أزيل مسار Provision→JournalVoucher→BranchId فقط، وأضيفت فلاتر الأب الاختياري والبنود والمواعيد. تبقى مرشحات JV وLeaseAgreement العامة بمالكيها. عُرّفت مفاتيح ملكية القالب والمواعيد كـconcurrency metadata.
- ملف الحراسة `SigmaBackend/SiGma.DataAccess/SiGmaDbContext.BranchAccess.cs`: بقي Provision وProvisionOccurrence ضمن الأنواع المحروسة صراحة بعد إزالة inference العامة. تستدعي حراسة journal-owned القائمة partial الخاصة بالقالب، ومسار set-based يستدعي فحص أصل القالب أو أصل البند/الموعد من المخزن.
- الملف الجديد `SigmaBackend/SiGma.DataAccess/SiGmaDbContext.ProvisionBranchAccess.cs`: يملك إثبات الأصل والحالي، وحراسة الأب والقيد الاختياري وtenant والتبعيات فقط.
- الملف الجديد `SigmaBackend/tests/SiGma.BranchAccess.Tests/ProvisionDefinitionBranchScopeTests.cs`: مواصفات مصدرية غير منفذة لهذا النطاق.

تقرأ الحراسة الملكية الظلية الأصلية من إسقاط مستقل غير متتبع؛ لا تثق
بـOriginalValues التي وضعها مستدعٍ detached. تُثبت SubscriptionId وLeaseAgreementId
وJournalVoucherId الأصلية للقالب، وProvisionId وSubscriptionId للبنود والمواعيد،
ومرجع JV الأصلي للموعد، قبل حفظ EF. يجري إثبات الأب الأصلي والحالي عند
تبديل مرجع؛ لا تحل هذه الحراسة محل قواعد ملكية children المالية في Business.

الكتابة الجديدة داخل aggregate مشروع تحل الأب المضاف من مراجع الكائنات
الفعلية المتتبعة، ولا تطلب أبًا غير محفوظ من قاعدة البيانات. الاتفاقية
الجديدة تحتاج مركبتها وفرعها، والاتفاقية المحفوظة تحتاج مركبتها وجميع
أطراف الاستبدالات الحية الأصلية. يجري فحص tenant ووجود الأب والمركبة،
ولا تُقبل اتفاقية أو مركبة مفقودة أو محذوفة. نطاق الاتفاقية يستعمل
صلاحية تسجيل الفروع للكتابة؛ القالب المستقل لا يكتسب اشتراط التسجيل.

مرجع JV غير الموجود اختياري للقالب وموعده فقط. إذا وجد مرجع موجب، يمر
بحراسة القيود القائمة لجميع سطوره وفروعه. تُفحص مواعيد التعريف وبنوده
المحفوظة دون إخفاء دليل مالي أو tenant مخالف قبل تعديل الأب أو فحص
set-based. لم تُضعف AddJournalOwnerId أو ValidateJournalOwnerIdsAsync
العامة؛ المصادر الافتتاحية وغيرها ما زالت ترفض null journal بعقدها.

## المواصفات غير المنفذة

أضيفت ٢٢ حالة تعريف اختبار: ١٣ Fact و٩ Theory بثمانية عشر InlineData،
أي ٣١ حالة عند توسيع النظريات. تغطي:

- قراءة standalone بلا JV، واستبعاد شركة أخرى والسجلات المحذوفة عبر شرط القراءة والتبعيات الحية.
- إنشاء aggregate مستقل وpreflight والحفظ، والتعديل والحذف المتتبعين دون null journal denial.
- مستخدم بفرع نشط للعرض فقط يستطيع حفظ القالب وفحص set-based؛ لا تغيير لحراسة API العامة للمستخدم بلا فروع.
- tenant الأصلي والمضاف، والملكية الظلية الأصلية الحقيقية بدل OriginalValues المزيفة.
- lease scope القديم والجديد، وكل أطراف الاستبدال، والحفظ تحت أب موجود أو aggregate جديد مشروع.
- الأصل والحالي للبنود والمواعيد عند تبديل الأب، والأب المفقود أو التابع لشركة أخرى حتى للمدير.
- set-based للقالب والبند والموعد، ودليل JV الاختياري الأصلي والحالي، وموعد محفوظ بtenant مخالف.
- بقاء null journal denial للمصدر الافتتاحي، وmetadata concurrency بلا BranchId جديد.
- مواصفة SQLite مصدرية تستعمل نموذج الإنتاج وجداول دنيا لإثبات whole lease parent وchildren، وأن join الحركات لا يعرض قيدًا متعدد الفروع جزئيًا.

الجذر أضاف ProvisionCompletionAccessTests بملكيته لحالة الاكتمال غير
المعروف عند حجب navigation للقيد وحالة عدم الترحيل وtenant/live؛ لم
تكرر هذه المواصفات هنا. الجذر يملك أيضًا إصلاح رابط موعد softdeleted
في GetTransactions وتبعية منحته، ولم يعدل العامل ملف Business.

## المصدر والمرجع والدليل

استُهلك قرار المالك الأخير والعقد المجمد دون إعادة فتح خيار فرع القالب.
العقد يسجل قراءة Speed sidebar16-provisions-provisions وC1389، والشرح
والدليل المتاحين؛ لا يثبت مرجع خارجي قاعدة فرع أو مبلغًا جديدًا. Odoo
لا يحسم ملكية هذا القالب الخاص. لا صور جديدة ولا layout أو frontend
أو ترجمات ضمن هذه الشريحة. الجذر يطابق دليل المخصصات في
`src/app/modules/UserGuide/content/provisions-topic.ts` داخل مسار
`/UserGuide/vouchers-journals` مع هذه القواعد ويملك إقفال الجرد.

## التحقق المصدرّي والحدود

رُوجعت الأجزاء المملوكة من التسجيل ومسارات PrepareBranchAccessWritesAsync
وDemandBranchWriteScopeAsync وValidateJournalOwnedWritesAsync، والـpartial
الجديدة كاملة، والمواصفات. فُحصت namespaces وGlobalUsing.cs ومراجع المشروع:
أنواع Helpers مستوردة عبر GlobalUsing ومرجع Helpers القائم، والـpartial
ضمن مشروع DataAccess بضم SDK الافتراضي، والمواصفات ضمن مشروع الاختبارات
بضم SDK الافتراضي ومراجع DataAccess الانتقالية القائمة. لا محلل C# متاح
لهذا الهدف؛ لا ادعاء compilation أو تشغيل نموذج EF.

ملفا BranchScopeRegistry.cs وSiGmaDbContext.BranchAccess.cs القائمان
untracked مسبقًا في مستودع Backend الحالي، شأن إضافتي هذه الشريحة؛ لذلك
لا ينتج git diff المعتاد baseline لهما. رُوجع المصدر النهائي وأجزاء
التعديل الصريحة بدل ادعاء diff tracked غير موجود. فحص الأسطر للملفات
الأربعة خالٍ من trailing whitespace وmerge markers؛ فحص git diff --check
المقيّد لم يبلغ أخطاء، مع مراعاة أن الملفات untracked.

لا علاقة أو عمود أو جدول أو فهرس جديد؛ concurrency metadata فقط ولا
تحتاج تغيير مخطط مادي. لم يعدل العامل أي migration أو ModelSnapshot.
التوقيت وخطة SQL ونجاح الترجمة SQL وقبول تزامن EF وظهور الأزرار والدليل
وتشغيل المواصفات والبناء كلها pending owner verification.

## التحميل والكاش والأداء

القراءة التشغيلية تظل مباشرة بمرشحات IQueryable: subquery واحدة للأب
الاختياري وتبعيات child/occurrence تحت نفس الأصل؛ لا cache أو loader أو
watch جديد. إثبات الكتابة مقيد بمعرّفات العمليات ومجمّع لكل نوع: أصل
القالب بملكيته الظلية، البنود والمواعيد، الاتفاقيات والمركبات والاستبدالات،
والقيود الموجودة عبر validator القائم. لا استعلام لكل بند، ولا توسيع
IgnoreQueryFilters في بيانات API؛ الاستعمال داخل الحراسة لإثبات الأصل
فقط ويتحقق tenant قبل السماح. لا قياس أداء مدعى، ولا اقتراح index دون
خطة SQL وقياس أو دليل نقص تغطية في هذا التغيير المحدود.

لم يُشغّل build/test/typecheck/lint/browser/DB/migration/commit/push/deploy
أو أي مترجم، ولم ينشأ وكلاء إضافيون. لا يعني هذا التسليم إقفال هدف
الصلاحيات أو نجاح قبول التشغيل؛ تدقيق المصدر المستقل والتكامل عند الجذر.

رسالة commit مقترحة للخلفية دون تنفيذ:
`fix(provisions): separate shared template access from journal branch ownership`
