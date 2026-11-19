# مطابقة تقاعد منافذ البنود وقواعد الإنهاء القديمة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | LEASE_LEGACY_CHILDREN_RETIREMENT_CONTRACT_FREEZE.md — Frozen |
| الحدود | Source-only؛ لا builds/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## القرار والنتيجة المصدرية

قوالب Clause تُدار من ClauseType في /LeaseClause، وبنود الاتفاقية وقواعد
الإنهاء مجموعتان داخل LeaseAgreement ومحررها وتمديد فترة السعر. القديمة
كانت CRUD بلا parent identity أو سياق الفرع، وأعمدتها name/sku/category
لا تمثل نموذج المجال. لذلك تقاعدت منافذها بدل منح صلاحيات مستقلة تتجاوز
الأب؛ لا تغيير لقواعد حساب الاتفاقية أو منحة جديدة أو alias خاطئ.

حُذف٢٦ملفًا pristine من مجلدي Agreements Dashboard 2/Clause وPreTerminationRule،
وأزيل الجذران من routing.ts واستيرادا الخدمة وكل provider لهما من layout.
حُفظت التعديلات السابقة للزملاء في الملفين المشتركين؛ الحذف صريح قابل
للاستعادة من Git، ولم يشمل أي بيانات تطبيق أو مخطط. بحث المستهلكين
المحدد يثبت عدم بقاء imports/route/service references حية لهذه الواجهتين.
بقي /LeaseClause و/LeaseAgreement وبياناتهما ومالكا entity/mapping/EF/DTOs.

عُلم ClauseController وPreTerminationRuleController بـNonController؛
MVC discovery الفعلي لا ينشئ endpoints لهما، فيغيبان عن catalogue ذي
IActionDescriptorCollectionProvider أيضًا، حتى لو بقيت grants تاريخية في
بيانات التجربة. لا حذف grants أو DB cleanup ولا ادعاء تجربة HTTP404.
المواصفة المصدرية تستخدم MVC ControllerFeatureProvider نفسه للتحقق من
غياب الاثنين وبقاء ClauseTypeController وLeaseAgreementController؛ لم
تُنفذ. أضيفت حالة registry لمنع ordinary stale resource grants من إعادة
فتح أي root/create/details قديم، ولا authorization من عنوان/اسم الدور.

## الدليل والمرجع والحدود

أزيل موضوعا record-list ورابطاهما ومفتاحا ترجمتهما الخاصان باللغتين.
حُدث موضوع البنود القائم في lease-guide.ts تحت /UserGuide/lease لتوضيح
ملكية النوع والاتفاقية وقواعد إنهائها، دون route/menu أو viewer جديد.
القواميس الوظيفية المشتركة باقية، ولا إزالة اسم حقل تستهلكه الاتفاقية.

Speed S183/S206 وشرحاهما بتاريخ٢٧أكتوبر يدعمان template type/parent
agreement؛ وكود C0858/شرائح C0845 وsidebar08/07 بتاريخ٢٨أكتوبر يطابق
دورة add/remove تحت الأب. فرق الـCRUD القديم تقاعد؛ لا استنتاج قواعد
server/branches/financial من الكود المرجعي، ولا ادعاء إقفال تبني صلاحيات
LeaseAgreement كله. Odoo العام لا يضيف قرارًا مطلوبًا لهذه الشريحة.

لا source/cache/loading/query/index جديد؛ الطلبات القديمة أزيلت، ومصادر
الأب لم تتغير. لا benchmark أو SQL plan أو visual/runtime acceptance
مدعاة. لا schema أو هجرة ولا backfill/compatibility لحفظ بيانات تجريبية.

التسليم الأمامي مستقل بملكية non-overlapping عن root backend/guide/docs؛
انتهت المراجعتان المستقلتان للخلفية والواجهة بلا findings مؤكدة متبقية،
وأقفل الجذر التكامل والدليل. parser/import existence لثمانية
ملفات مشتركة بلا problems، وفحوص الغياب وscoped diff --check سليمة؛ هذه
ليست typecheck أو compilation/tests. رُوجعت ملفات untracked المضافة مباشرة.

عند الإقفال ثبت عدّ الجرد١٢٥/٧٦/٥٨/٢/٢=٢٦٣، ووُسم صفا Clause/PreTerminationRule
التاريخيان retirementStatus=retired-source-only وأُفرغت candidate keys؛
retired=7 دون ترقية operation-confirmed أو حذف baseline. recipe Check
الثماني سليمة، وXML مشروع المواصفة ومراجعة namespace/FrameworkReference
وSDK inclusion سليمة. لم تُنفذ مواصفة discovery أو registry ولم تُختبر
HTTP404. المالك يجرب الروابط القديمة وHTTP discovery والـcatalogue
وصلاحيات قوالب البنود والاتفاقية بالنهاية؛ بقية التطبيق قيد الاستكمال.

اقتراحا commit دون تنفيذ: الواجهة `refactor(lease): retire parentless child screens`؛
الخلفية `fix(auth): remove standalone lease child HTTP endpoints`.
