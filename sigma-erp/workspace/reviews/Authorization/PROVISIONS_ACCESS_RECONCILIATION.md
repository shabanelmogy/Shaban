# متابعة مطابقة صلاحيات المخصصات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | [العقد المجمد للمنح والتقاعد](PROVISIONS_ACCESS_CONTRACT_FREEZE.md) |
| حالة الوحدة | اكتمل تبني الوظائف الحالية في المصدر، بما فيها حراسة النطاق والتدقيق المستقل؛ التشغيل عند المالك بالنهاية |
| الحدود | Source-only؛ لا build/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## ما ثبت وما لا يثبت

المصالحة النهائية بأسفل الملف تتقدم على متابعات Draft التاريخية: حُسم
قرار النطاق ونُفذ ودُقق، ورُقي صف Provision الفعال وحده. لا ادعاء تشغيل.

تظل نتيجة الوحدة Draft حتى انتهاء كل العمليات وحسم ملكية تعريف المخصص.
لا تُرقى صفا Provision في الجرد لمجرد وصول الواجهة إلى مفاتيحها. سياسة
الشركة والفروع في الخادم جزء من نفس الإقفال. السؤال المرسل للمالك لا
يمنع تنظيف المسارات الميتة أو حراسة المنح والقراءات والكتابات القائمة.

## العقود المتطابقة حتى الآن

تقرير القائمة يعرض No/EntryDate/Title/DayOfMonth/NumberOfMonths/IsCompleted؛
ProvisionListVM يطابق الستة ويضيف Id/CanEdit/CanDelete للهوية والأفعال فقط.
GetManyAsync يطبق tenant/live والفلاتر وgrid projection قبل Count/Order/
Skip/Take، وMaterializeListAsync يستخدم الإسقاط نفسه؛ لا فلترة على صفحة
محلية ولا cap خفي لـExcel. getAllList يستخدم fetchAllPages بعقده الكامل.

مدخلات الرأس VoucherSubType/EntryDate/Title/DayOfMonth/NumberOfMonths،
والسطور AccountId/PartnerId/SubLookUp/JobId/Description/Debit/Credit؛
Update يضيف هويات parent/child. لا audit/tenant/totals/first/last/status
في payload. الحساب والجدول والتوازن والدقة عند ProvisionService؛ لا
تغيير معادلات. مبلغ كل شهر مستقل عن عدد الشهور، والحفظ لا ينشئ JV.
قواعد canEdit/canDelete مع تاريخ القيود وlease ownership محفوظة.

القراءة Provision.View، والإنشاء Create مع Account.GetPostingSelect و
Currency.GetFinancialNumberPolicy، والتعديل View+Update والمتطلبين؛
Customer.Lookup/Supplier.Lookup/Job.Lookup اختيارية مستقلة. الحذف View+
Delete وcanDelete وتأكيد/هوية object الحالية، والحركات View+GetTransactions.
تصنيف GetTransactions صار WholeDocumentReads؛ لا يختزل سجل قيد متعدد
الفروع إلى سطور قليلة بادعاء أنه تقرير أثر. registry والبداية وsidebar
create تستهلك نفس المفاتيح؛ ولا View مفروض على إنشاء مستقل.

## تقاعد المسارات القديمة

اكتمل تنظيف المصدر في [التسليم المحدد](PROVISION_DETAIL_RETIREMENT_HANDOFF.md):
حذف٢٧ملف واجهة ومجلدي ProvisionDetail، وإزالة routeين ميتين وduplicate
Provision المتأخر وimport/providers/موضوعي دليل وهميين. حُذف controller/
interface scaffold دون implementation أو DI، وبقيت entity/config/DTOs/
mapping البنود المستهلكة من parent. root أزال مرجع الدليل الأخير وراجع
الفروق ومراجع الاستيراد. لا alias يحول child id إلى parent، ولا حذف بيانات.

عُلم صفا ProvisionDetail التاريخيان retirementStatus=retired-source-only
مع الدليل، دون ترقية parent أو تغيير routeCount/أرقام حالات الجرد الحالية
١٢١/٧٨/٦٠/٢/٢. ستصالح سياسة عد التكرارات التاريخية عند إقفال parent؛
الحالة resource-only القديمة لا تعني وجود route نشط أو grant قابلة للإسناد.

## قارئ الحركات المشترك

استُكمل DocumentJournal في مالكه القائم: optional accessRequirement و
localReadProgress=true default تحفظ dialog الحالي. false يلتقط page
lease عند قراءة finite ويحرره في finalize حتى عند تغير المدخل. Host
watch يستمر بعد response ويغلق disposable viewer ويمسح نتائجه عند
expiry/actor replacement؛ callback وRetry وdeferred close focus محكومة
بالسجل والهوية/version، وEditorDialog يستهلك requirement/blocked.

المواصفات الست غير منفذة. دقق عامل مستقل المصدر/specs بلا findings
مؤكدة؛ لا write/draft أو مبلغ أو منحة جديدة في الامتداد. consumer القائمة
يمرر متطلب الحركات وlocalReadProgress=true. حُدث UI22 والمهارة/صف revision
معًا وأعيدت الحزم الثماني بالمولد وCheck=OK. راجع root المعنى: default
المحلي خاص بقارئ الحوار هذا، لا يغير default ActionLog/Approval؛ optional
requirement لا يثبت تبني باقي مستهلكي DocumentJournal.

## التحميل والكاش والأداء

| المصدر | التصنيف والعمر | ما يحتاج المطابقة |
|---|---|---|
| Provision list وExcel | operational direct، page start/finalize، cancel الوصول/context/export بالكامل | counts/filter/sort/URL/applied versus draft طابقت المصدر ودُققت مستقلًا بلا finding مؤكدة |
| Details وSave | operational direct، page؛ sent write مستقل | تسليم المحرر ومراجعة المنح والعمر مصدرية؛ أصلح root finding الخروج من النجاح terminal قبل النشر |
| Transactions | dialog localProgress في DocumentJournal، GET صريح read-only | سؤال مجال عرض الحركات والـbranch metadata لا يُحسم من UI |
| Customer/Supplier/Job options | approved reference caches بمالكيها، finite successful bootstrap ثم watch منفصلة | منع GET/watch بلا grant، clear/context/regrant/Retry/labels وbusy-tail recovery بمواصفات غير منفذة وتدقيق مستقل |
| Posting accounts/FinancialNumberPolicy | direct operational/policy required للكتابة | لا cache opt-in أو financial defaults جديدة |

مصدر القائمة يملك query واحدة للCount ثم projection للصفحة؛ correlated
completion/history predicates مثبتة، ولا per-row HTTP. الحركات تقرأ هوية
المصدر وروابط قيوده ثم join للسطور مع headers المسموحة. يجري ذلك تسلسليًا
على DbContext واحد؛ لا EF queries parallel. التفاصيل تستخدم child projection
ضمن نفس queryshape؛ عدد SQL commands الفعلي وخطة joins غير مقاسين.

الفهارس المقروءة: Provision PK وروابط Details/Occurrences/JV، و
ProvisionOccurrence unique(SubscriptionId,ProvisionId,DueDate) تحفظ reservation
حتى بعد soft delete. لا index مقترح مطبق من هذه الشريحة. مرشح قائمة ممكن
للمقارنة فقط: Provision(SubscriptionId,EntryDate DESC,Id DESC) INCLUDE
(DayOfMonth,NumberOfMonths,IsDeleted) بلا filteredpredicate بسبب nullable
IsDeleted، مع كلفة inserts/storage؛ لا يغطي default Id sort ولا contains
لـTitle/No، ولا يُقترح key لكل عمود. صلاحية الفكرة تتبع قرار branch ثم
cardinality/actual plan/IO/latency؛ الجداول قليلة فلا ندّعي فائدة مقاسة.
فهارس FKs الموجودة/الخطة الفعلية تقارن قبل اختيار child composite آخر.

## سجل القرار والقبول

كان ApplyProvisionFilters يسمح للعادي فقط بتعريف مرتبط برأس JV ضمن
فروعه؛ template مستقل جديد بلا JV يُحجب. لم يتغير source filter أو schema
أو يُستخدم IgnoreQueryFilters لتجاوز المشكلة في مرحلة التجميد. فوّض
المالك لاحقًا اختيار الأنسب وتطبيقه: standalone مشترك حسب المنح، وlease
يتبع الاتفاقية، وحركات JV حسب كل فروع القيد. يجري تنفيذ الخيار وحراسة
الكتابة/set-based والأطفال مع مواصفات؛ لا إقفال قبل تسليمه وتدقيقه.

المخطط السابق ProvisionScheduleAndContacts يبقى مسؤولية مالك القاعدة؛
تقاعد routes/shared access لا يغير schema. أي schema إضافية تعتمد الخيار
المفتوح وتُبلّغ باسم معزول؛ لا migration أو backfill تجريبي ضمن العمل.

التحقق الجاري: source parsing/import existence فقط ومراجعة diff المقيد
في المستودعين؛ لا نتائج tests أو compile/runtime/SQL/RTL/themes/mobile.
دليل التطبيق المستهدف provisions-topic.ts ضمن /UserGuide/vouchers-journals؛
حُدث بعد تسليم المحرر ومطابقة المصدر، بلا وعد branch لم يُعتمد بعد.

## مصالحة المنح والتكامل — ١٠ نوفمبر

استُلم [محرر المخصصات](PROVISIONS_EDITOR_ACCESS_HANDOFF.md)، وربط route
القائمة canDeactivate الفعلية. قُرئت ملفات المصدر والقوالب والمواصفات
الجديدة مباشرة؛ دُققت القائمة مستقلًا بلا findings مؤكدة. دُقق المحرر
مستقلًا وكُشفت finding: نجاح write بعد revoke أو بلا id صالح كان يمنع
إعادة الحفظ لكنه يحبس الخروج. أصلح root تثبيت السماح بالخروج مع committed
قبل فحوص الهوية والنشر؛ auto navigation يبقى خلف mayPublish، ولا تُرسل
كتابة ثانية. يرفض PUT identity مختلفة عن السجل الملتقط قبل View/Print.
أُضيفت حالات مصدرية غير منفذة للهوية المفقودة/المختلفة وactor expiry، مع
warning ثنائي اللغة وخروج محلي آمن. أعاد المدقق المستقل قراءة الإصلاح
والمواصفات وأغلق finding في المصدر دون تنفيذها.

تطابق registry وsidebar/start route المنح المثبتة؛ لا View ضمن Create،
والحساب والسياسة المالية required للكتابة فقط. details alias يحول إلى
عرض parent بنفس id. لا child alias أو endpoint CRUD وهمي بعد التقاعد.
لا schema أو معادلة أو AutoMapper تغيرت في تبني المنح. يُقترح عند دمج
المالك للواجهة: `fix(provisions): enforce operation access and retain safe terminal exit`،
وللخلفية: `fix(provisions): retire orphan detail API and classify transaction reads`.

التحقق النهائي المصدري والحزم والمواصفات لا يحسم قرار branch؛ تبقى الحالة
Draft والجرد١٢١/٧٨/٦٠/٢/٢ من٢٦٣ دون ترقية المخصصات. لا يطلب من المالك
تجربة جزئية؛ قبول التشغيل يجمع عند نهاية هدف الصلاحيات.

أعاد root الفحص بعد الإصلاح: تحليل٢٦ملفًا وقالبًا ووجود الاستيرادات
المحلية، و٧٠مفتاحًا حرفيًا للمخصصات في القاموسين، problems=[]. صياغة XML
لخمسة مشاريع مرتبطة سليمة. scoped diff --check بالمستودعين بلا أخطاء؛
تحذيرات EOL فقط. هذا parsing ومطابقة نصوص، لا typecheck أو تنفيذ
مواصفات أو إثبات namespace compilation. قارئ الحركات ورابط الخدمة
وBranchOperationRulesTests تحت namespaces/projects الفعلية بالمصدر؛ لا
اعتماد على ملف migration أو snapshot جديد. فحص الحزم الثماني OK قبل
الاستعمال؛ لم يتغير كتاب أو قالب منذ آخر توليد.

## متابعة قرار النطاق

تفويض المالك اللاحق باختيار الأنسب حسم السؤال؛ لا قرار مالك مفتوح الآن.
اختير standalone مشتركًا داخل الشركة، وlease-owned تحت الاتفاقية،
وtransactions تحت whole-document JV. تُكتب حراسة DbContext والـset-based
والبنود والمواعيد الآن تحت ملكية مستقلة؛ لا BranchId أو هجرة جديدة.
أضاف root تبعية Provision.View لـGetTransactions في الفلتر الخلفي نفسه،
وأربع حالات endpoint غير منفذة؛ فلا تكفي منحة الحركات وحدها للطلب المباشر.

كشف التدقيق المستقل للخدمة أن مصدر Transaction journal IDs لم يستبعد
Occurrence المحذوفة، بخلاف قراءات الاكتمال. أصلح root predicate بإضافة
IsDeleted!=true قبل استخراج IDs، وأضيفت حالة خدمة غير منفذة لرابط موعد
محذوف مع قيد مرحل ساري؛ لا يعود القيد في الحركات. أعاد المدقق المستقل
قراءة الإصلاح وأغلق finding، بلا tests/build. لا تغير حذفًا أو ترحيلًا.

أصلح root إسقاط حالة الاكتمال في list/detail: وجود موعد مرتبط بقيد غير
متاح navigation يجعل الحالة null بدل false؛ لا تُفتح بيانات القيد
لمعرفة حالة القالب. أضيفت ثلاث حالات خدمة غير منفذة لحالة الدليل المفقود
وقفل التاريخ، pending الصحيح، وtenant/live. حُدث دليل التطبيق وتسمية
Unknown باللغتين. لا تغيّر amount/schedule أو payload/DTO أخرى.

اكتمل تنظيم G10 في محرر المخصصات بعد توقف عامل أول؛ استلم عامل قائم
الملكية، وفصل multi-statement lines دون تغيير tokens. فُحصت١١٥٣٩leaf
tokens قبل/بعد متطابقة؛ parsing سليم، ولم تتغير specs أو route/shared.
القبول الوظيفي السابق محفوظ مصدرّيًا، ولا يعني ذلك typecheck أو تنفيذًا.

أُقفلت SMS المستقلة أثناء انتظار هذا التسليم: الجرد الآن١٢٢/٧٨/٥٩/٢/٢
من٢٦٣، وأربعة retired-source-only. لا تُرقى Provision قبل تسليم/تدقيق
حراسة النطاق ومصالحة صفها الفعال والـduplicate التاريخي صراحة.

## المصالحة النهائية — إقفال الوظائف الحالية في المصدر

استُلمت [حراسة النطاق](PROVISIONS_BRANCH_SCOPE_HANDOFF.md)، وقُرئت
ملفاتها الأربعة مباشرة بما فيها الملفات الجديدة وغير المتتبعة. انتهى
التدقيق المستقل للخدمة/الفلاتر/DataAccess بلا findings متبقية بعد إغلاق
رابط الموعد المحذوف وخروج النجاح terminal. root راجع المصدر والتكامل،
وراجع G10 في المحرر بعد التنظيم المحافظ على tokens.

أزيل inference Provision→JV branch وحده؛ التعريف المستقل يقرأ ويحفظ
داخل tenant بالمنح، والlease-owned يتبع أصل الاتفاقية الحالي وفروع
الاستبدال الكاملة. البنود والمواعيد تتبع نفس الأب الحي. تثبت الكتابة
المتتبعة وset-based أصل tenant والـshadow lease/JV وparent/JV للأطفال
من المخزن، وتتحقق من الأصل والحالي وtenant/وجود الأب، ولا تثق في
OriginalValues detached. الأب الجديد المشروع يحل من مرجع aggregate
المتتبع. null JV اختياري للقالب فقط؛ validator المصادر الأخرى بقيت
على حالها. القيد الموجود وكل سطوره يظلان تحت الحراسة الأصلية للفروع.

أضيفت٣١حالة branch مصدرية غير منفذة، منها View-only branch وحفظ template،
مع أربع حالات completion/service وأربع endpoint View+Transactions؛
و٢٩حالة قائمة+smoke و١٦محرر+smoke وست مشتركة لقارئ الحركات وحالة registry.
العدد لا يعني passing؛ لم يُنفذ runner أو provider أو SQL أو build.
مواصفة SQLite تستعمل نموذج الإنتاج وجداول دنيا لتوثيق expected whole
document read؛ كتابة SQL داخل المواصفة ليست تشغيل قاعدة في هذه الدفعة.

ترجمة ومصادر الواجهة والدليل: provisions-topic.ts داخل دليل
/UserGuide/vouchers-journals، ورابط الإنشاء المستقل في قائمة المخصصات
والـregistry/start route/aliases متطابقة. أعمدة No/EntryDate/Title/
DayOfMonth/NumberOfMonths/IsCompleted تطابق ListVM مع Id/CanEdit/CanDelete
فقط للهوية والأفعال. client fields/child identity/schedule/money policy
ومالك AutoMapper لم تتغير؛ لا BranchId أو جدول أو فهرس جديد ولا migration
مطلوبة لتغيير permissions/concurrency metadata الحالي. مخطط الجدولة
السابق AddProvisionScheduleAndContacts ضمن تجهيز المالك المعتاد.

التحميل والكاش والسرعة طابقت عقود الجداول أعلاه: direct finite reads
والـlookup caches بمالكيها، bootstrap/watch/recovery والـsent writes
والـRetry/teardown. إثبات DataAccess يستخدم مجموعات IDs محددة لقراءة
الأصل/الأطفال/lease+vehicles+replacements/JVs، وليس طلب API لكل صف.
لا قياس زمن أو SQL-plan؛ تكاليف proof والاستعلامات والاقتراح السابق
للفهرس تُقارن بالأحجام والخطط عند المالك، ولا schema index ضمن هذا العمل.

التحقق النهائي: parsing/import existence٢٦ملفًا/قالبًا و٧٠مفتاح ترجمة
حرفيًا في القاموسين بلا problems، وXMLخمسة مشاريع سليم. scoped diff
بالمستودعين نظيف (EOL warnings فقط)، وفحص whitespace/merge markers
للملفات الخلفية غير المتتبعة سليم. namespace/global-using/SDK inclusion
قُرئت مباشرة. الحزم الثماني Check=OK؛ لا canonical تغير بعد توليدها.

رُقي صف Provision الأول فقط، وأصبح duplicate التاريخي retired-source-only
دون مرشحات grants. الجرد النهائي١٢٣operation-confirmed/٧٧resource-only/
٥٩unknown/٢context-only/٢alias من٢٦٣baseline؛ خمسة صفوف متقاعدة منفصلة
عن حالات الجرد، لا routes نشطة إضافية ولا إسناد وهمي لمورد البنود.

قبل القبول النهائي يجرب المالك: admin، View فقط، Create-only مع مصادره،
Edit/Delete/Transactions grants مستقلة، فرع View-only لقالب standalone،
lease ذات فرع غير مسموح/استبدال متعدد، JV متعددة الفروع، tenant مختلف،
السحب/الإعادة وتبديل الحساب، dirty exit، نجاح قديم السياق/هوية مفقودة،
Print/Excel/dialog/RTL/themes/mobile وSQL/concurrency. تجميع التجربة
للنهاية حسب طلبه؛ لا توقف بين الوحدات ولا ادعاء قبول runtime.

التفويض: عامل للقائمة وآخر للمحرر، وتدقيق منفصل لكل منهما؛ root يملك
العقود/shared/registry/الدليل والخدمة والتكامل. عامل قائم نفذ DataAccess
بعد تعذر استئناف عامل آخر، ومدقق مستقل قرأ الخدمة وحراسة النطاق. ملفات
الملكية غير متداخلة؛ root حافظ المصدر السابق. المهام أُغلقت بتسليم
source-only؛ هدف صلاحيات Sigma العام ما زال active.
