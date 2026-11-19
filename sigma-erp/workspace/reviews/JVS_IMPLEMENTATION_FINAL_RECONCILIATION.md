| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-25 |

# تنفيذ إصلاحات قيود اليومية والمطابقة

السلطة: طلب المالك «طبق التعديلات المطلوبة»، ثم توضيحه أن تعديل القيود التلقائية وحذفها وإلغاءها النهائي من المستند الأصلي، مع مراجعة الإجراءات الممكنة من شاشة القيود. الخطة `JVS_MAINTENANCE_EVOLUTION_PLAN.md` والعقد `JVS_DOMAIN_API_CONTRACT_FREEZE.md` وملحقاهما يحكمان هذا التنفيذ. تقرير المراجعة الأول محفوظ كسجل للعيوب السابقة ولا يعاد تأريخه ليبدو تنفيذًا.

## القرارات والنتيجة

| الجانب | النتيجة المصدرية | المالك/الدليل |
|---|---|---|
| القائمة والترقيم | طلب typed عبر toListParams، مرشحات applied ثابتة في التنقل/التصدير، CountAsync/TotalCount، حد صفحة1..100 وترتيب مسموح مع tie Id؛ نطاق اليوم الأخير حصري لليوم التالي | JVs list/service؛ JournalVoucherService.GetManyAsync |
| أعمدة القائمة ونموذجها | Actions، no،date،voucherSubType،jobNos،amount،branchName،approvalStatus،isVoided. JobNos متعددة من سطور القيد وغير قابلة لفرز/menu scalar. ListVM مستقل بالحقول المذكورة وهوية/أعلام الإجراءات وsourceKind/sourceId؛ بلا تفاصيل أو مرفقات أو plumbing موروث | models/list،JournalVoucherListVm؛ explicit list/grid projections |
| المرشحات | رقم/فرع/نطاق تاريخ/مجموعة ترحيل/اعتماد/نوع، وإضافي minAmount/assetId/voidedOnly؛ 0/false لا تسقط، IsVoided الحقيقي بدل خلط المسودات بالملغى؛ grid قبل count/page | FilterPanel،ListQuery،GetManyAsync/ApplyGridFilters |
| إنشاء وتعديل | typed form وEditableRows؛ إضافة السطور متاحة، Results.entities، لقطة كاملة للسطور والأبعاد والمرفقات، IDs باقية، لا tenant/audit/type/currency/status client inputs؛ النوع الجديد JournalVoucher/JV خادمي؛ المحفوظ يحتفظ subtype | details component،create/detail DTO،Add/Update/ReconcileDetails/ReconcileDocuments |
| الحساب | جهة موجبة واحدة في السطر، عدم السالب ودقة سياسة العملة واتزان؛ المعاينة فقط في المحرر، والسيرفر يعيد التحقق بما فيه محفوظ السطور عند Post؛ إجماليا المحفوظ من backend | FinancialNumberPolicy،Resolver.PostAsync،summaryCards |
| أوضاع الصفحة | create/view/edit صريحة وdetails legacy view، حارس خروج ومسودة/cleanup، matching loaded ID وread error gate، إلغاء قراءات سابقة وguard قبل تبديل id أثناء reuse، حفظ query params عند العودة | JV_Routes،details canDeactivate/activateRoute/loadDetails |
| المكونات والمظهر | FeatureTitle،shared editor shell/tabs/FormSection/EditableCollectionTable/FieldError/SummaryCards،fixed footer وملكية row scroll؛ لا palette جديدة. print يستخدم DataTable مقروءة مستقلة من saved DTO وكامل السطور والوثائق بلا قيود تبويب/scroll | UI1/3/13/14/19/21/24؛ Job reference وشيفرة المكونات العامة |
| المرفقات | نفس CustomerDocument snapshot وcreateDocumentRow/documentPayload،FileField/Tracker،تأكيد حذف محفوظ،تنظيف بعد نجاح الحفظ فقط وRetry دون تكراره؛ نوع المستند بأرقام enum الحقيقية | Documents tab والمالكون المشتركون |
| CSV | قالب UTF8 قابل للتنزيل بأسماء حقول السطر، quoted cells،معرّفات من الاختيارات،دقة السياسة،حد2MB/5000 سطر والتحقق الكامل قبل consent،Apply للمسودة دون حفظ تلقائي؛ تجميد أثناء القراءة/التأكيد واستبعاد القراءة القديمة | تفاصيل JVs importCsv/downloadCsvTemplate |
| الاعتماد | GET/POST{id}/approval سياق واحد للنافذة والتبويب؛0 Approved/1 Pending/2 Rejected؛ Pending→Approved/Rejected،Approved→Pending بضوابط؛Rejected نهائي؛ reason trim1..500 للتراجع/الرفض؛append-only previous/new/actor/time/reason | JournalVoucherService.Approval،ApprovalVM/DecisionVM/HistoryVM،JournalVoucherApprovalLog/config |
| الأثر والفترة | اعتماد ينشر نفس القيد،إلغاء اعتماد يفك ترحيله،فحص الفترة المفتوحة والسنة المحفوظة والأشهر وملكية المصدر/المراجع والتخصيص؛أعلام القراءة والكتابة متوافقة. أعوام/أشهر القائمة تجلب batch،لا إعداد سياسة متعددة الخطوات مصنوع | OriginalPeriodOpenAsync/IdsAsync،Post/Unpost،ExecuteUniqueWrite allocation lock |
| حذف/إلغاء | حذف مسودة يدوية غير مستخدمة وبلا تاريخ فقط مع الأطفال؛Void لقيد يدوي approved posted مؤهل بسبب ومنفذ خادمي،مع احتفاظ IsPosted/الرقم/السطور دون reversal؛رفض نهائي محمي على update/delete/decision | RemoveJournalCoreAsync/VoidCoreAsync/DecideApprovalAsync |
| القيود التلقائية | view/print/export/source/log؛ لا edit/delete/approval-change/void/active من هنا. يُفحص IsGenerated والنوع والافتتاحي وكل FK مباشرة من source حتى historical deleted references؛ لا استنتاج ملكية من الرقم | HasExternalDocumentReferenceAsync،GetExternalDocumentReferenceIdsAsync،IsManualOwner |
| فتح المصدر | ملاحة موجودة من resolver batch الحالي وhelper allowlist،لا إعادة كتابة لهما. المصدر المفقود/المحذوف/المتعدد/غير المدعوم لا يُخمن؛يبقى القيد المقروء متاحًا | JournalReportSourceResolver،journalOriginalSourcePath |
| التخصيص | مسارات رأس/سطر مؤهلة؛posted Approved nonvoid/nonopening وسطر طرف له سعة،مصدر معاكس بنفس account/partner/effective branch/currency مع إعادة تحقق تحت نفس القفل. لا manual-only blanket يمنع مستهلك Staff والقيود المولدة المؤهلة؛التخصيص مستقل عن تحرير القيد | Allocation-lines/sources/Allocate والكاتب الداخلي القائم |
| نموذج التخصيص | اختيار سطر ثم مصادر typed،إدخال مبلغ ضمن source+target capacity،نوع المصدر ظاهر،dirty discard/Back/Retry وتجميد؛retained unavailable amount يبقى مع إنذار ويمنع الحفظ حتى يصحح | JVs/components/allocation |
| التقرير/Excel | كامل نتائج applied search بواسطة fetchAllPages؛العادي أعمدة الجدول،التفصيلي كل سطور التفاصيل بأبعادها،فشل أي صفحة/تفصيل يلغي الملف؛report shared dialog/print session | JVs list export/openReport؛ReportPrintService |
| السجل | GET{id}/log يثبت root tenant ويربط GUID الأطفال المملوكين فقط؛shared DocumentActionLog،قراءة فقط بلا مصدر مالك آخر أو تاريخ قرار مصطنع؛الكتابات الخارجية/القديمة غير الملتقطة لا يعاد صنعها | IAuditTrailService.GetRecordAsync،GetLogAsync |
| الأخطاء | flags/error+Retry ظاهرة،Result:false وtransport error،إلغاء switchMap،حفظ المسودة وإغلاق pending،global mutation success مرة واحدة؛الخدمة تطلب تخطي global error عند feedback محلي | JVService/components/shared owners |
| المصادقة | Root HttpClient/interceptors باقية،AuthGuard وAuthorize؛لا permission API أو client bearer مصطنع | app.config/app.routes/SiGmaControllerBase inspected |

## الملفات والتكامل

المراحل المطبقة: التخطيط والتصنيف، ثم الاكتشاف والأدلة، وتجميد المجال وواجهة الخدمة، والقائمة، والمحرر، والإجراءات، والتكامل، والمطابقة النهائية. لا مرحلة وظيفية مطلوبة متروكة؛ التنفيذ التشغيلي والبناء وقاعدة البيانات مستبعدة بتعليمات مساحة العمل، وتبقى عند المالك.

تصنيف الصور الخمس محفوظ في تقرير المراجعة الأول: أدلة وظيفية ومحتوى للقائمة ومرشحاتها وقائمة الإجراءات، واختيار سطر التخصيص، وعرض اليومية، والإنشاء والسطور والمرفقات. ليست دليلًا على التصميم أو الصلاحيات أو قواعد محاسبية غير ظاهرة. حُسمت التفاصيل الناقصة بالمصدر والسياسة الحالية والعقد المجمّد؛ لا قرار أعمال مفتوح يمنع الإصلاحات المنفذة. المصدر الغامض أو غير المدعوم لا يمنح إجراءً غير مثبت.

الواجهة: ملفات قائمة وتفاصيل JVs ونماذج create/details/list/grid-row وخدمتها ومساراتها،ومكوّن allocation جديد وmodels/allocation. أضيفت ثلاثة runtime entries فقط إلى tsconfig.app.json: allocation component/model وjournal-vouchers-topic؛ لا include واسع ولا إدخال specs في compile التطبيق. أضيفت مفاتيح journalVoucher المطابقة EN/AR دون إعادة كتابة تغييرات القواميس السابقة.

الخلفية: IJournalVoucherService،JournalVoucherProfiler،JournalVoucherService ومعه partial Approval،JournalVoucherResolver.PostAsync للتحقق عند الاعتماد،JournalVoucher entity/ApprovalLog/config،JournalVoucherController،Add/Update/List/Detail/Void وApproval/Decision/History VMs. كل نوع مسمى جديد في ملفه. config sealed يكتشفه ApplyConfigurationsFromAssembly؛namespaces وglobal imports ومراجع مشاريع SDK راجعت من المصدر. لا registration service موازٍ أو تغيير provider.

الخرائط اتجاهية بلا ReverseMap. Ignore الأطفال في Update مبرر بالمصالحة الصريحة،وIgnore enriched read flags/totals/source fields مبرر بأنها تعبأ من المالك بعد الإسقاط. القائمة تستخدم إسقاط scalar خادمي قبل menu/count وتجمع jobNos للصفحة لاحقًا. لا AutoMapper تجاهل بديل لتصحيح snapshot ناقصة.

الدليل: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/journal-vouchers-topic.ts` ومسجل بدل الموضوع العام في record-list-topics. المالك الحالي `INVOICE_GUIDE` ضمن مجموعة «القيود والتسويات»،يربط /JournalVoucher ويشرح المرشحات والسطور/المرفقات/CSV/المسودة/الموافقة/التخصيص/الفترة/مصدر التلقائي/الحذف/Void/الطباعة/التصدير/السجل وحالات Retry باللغتين. reader/menu الحاليان دون fork.

## مراجعة المصدر والقيود

راجعت scoped diffs في مستودعي `SiGmaAngularFrontEnd` و`SigmaBackend` منفصلين،بما فيها ملفات untracked الجديدة. تغييرات المشتريات والمدفوعات/الموارد/الدليل/tsconfig والمهاجرات الموجودة قبل المهمة محفوظة. لم ألمس migration أو snapshot. فحص diff --check للنطاق،المراجع المحلية،أنواع DTO والمسارات وأسماء الدوال،خصائص المكونات العامة،مفاتيح النص والقواميس،XML الموارد وأسماء الأنواع ومراجع SDK؛هذا فحص مصدر وليس build أو قياس runtime.

استكمال المطابقة: تتطابق مفاتيح الترجمة البالغ عددها142 بين اللغتين وكل المراجع الثابتة في الميزة؛ مسارات الاستيراد المحلية وتسجيل ملفات التشغيل الثلاثة وملفا الموارد دون مفاتيح مكررة سليمة مصدريًا. ترشيح السطور والمرفقات الحية التابعة لنفس الشركة صريح في الإسقاط والمحرر، لأن مرشح المستودع يخص جذر الاستعلام ولا يرشح الملاحة تلقائيًا. مبلغ القائمة والبحث والفرز والسياق مشتق من السطور الحية نفسها. يظل أي تاريخ قرار محفوظ مانعًا للحذف حتى لو وُسم محذوفًا. فحص مصادر التخصيص يطابق رأس الفرع كما يطابق السطور. إذا فقد القيد أهلية التعديل أثناء الاحتفاظ بمسودة، تُجمّد المسودة برسالة وإعادة محاولة بدل خلطها بعرض القيد أو مسحها.

تطبيقات الدروس الحالية لا تستدعي قاعدة عامة جديدة في الكتب/المهارة: إعادة استخدام المالكين وسياسة التلقائي ولقطة الأطفال والفترة موجودة بالفعل. لم تتغير canonical/templates/manifest؛فحص الحزم الثماني نجح قبل الاستخدام وعند التسليم،ولم تعدل packets يدويًا أو تستلزم regeneration.

وكلاء محدودون: sol_backend وsol_editor بالنموذج gpt-5.6-sol وبملكية ملفات منفصلة بعد التجميد،ومدقق luna_explorer بالنموذج gpt-5.6-luna لقراءة القائمة/التخصيص. الجذر أصلح تعارضات الدمج والقوالب/الدقة/الطباعة/نهايات pending والأنواع والاعتماد النهائي. توقفت جولات متابعة بعض الوكلاء بسبب حد الاستخدام؛الجذر أكمل العمل المحلي والمطابقة ولم يسلّم النواقص للمالك بسبب ذلك.

### مطلوب عند المالك قبل التشغيل

يلزم إنشاء ومراجعة وتطبيق ترحيل باسم مقترح:

```text
AddJournalVoucherApprovalHistory
```

السبب: جدول JournalVoucherApprovalLog وعلاقته وفهرسه. لا backfill لتاريخ قرارات أو تصحيح تلقائي للقيود المصنفة خطأ قديمًا. القيود غير المثبتة/المتعارضة تبقى محمية وتحتاج فحص بيانات يقره المالك. غياب هذا الجدول قبل نشر API يعطل القراءات التي تستهلك التاريخ؛schema يسبق تفعيل النسخة.

التحقق المتبقي: build Angular/.NET،ترجمة استعلامات EF فعليًا،tenant isolation/concurrency/period-close والتخصيص المتزامن،rollback فشل القرار،تاريخ التدقيق،التنقل وحفظ المسودة وcleanup،RTL/light/dark/narrow/short views،الطباعة/Excel لجميع الصفحات. قالب المستندات يحتفظ بالخيارات الرقمية المعروفة تاريخيًا؛أي قيمة DocumentType أحدث من catalog المشترك تظهر ضمن خياراتها المحفوظة برقمها وتُحفظ به دون اختراع اسم؛تحقق المالك من وجودها عند بياناته. فتح المصدر متاح للعائلات التي يدعمها resolver الحالي فقط ولا يعد بوجهة لروابط غامضة أو غير مدعومة.

خطوات تحقق المالك بعد إنشاء الترحيل ومراجعته وتطبيقه والبناء:

1. أنشئ قيدًا متزنًا مع الأبعاد والمرفقات، ثم عدّل لقطة السطور وتحقق من بقاء المعرّفات والقيم؛ جرّب استيراد ملف صحيح وآخر مرفوض دون حفظ تلقائي.
2. اعتمد مسودة، ثم ألغِ اعتمادها بسبب؛ تحقق من فك الترحيل والتاريخ والمنفذ. ارفض مسودة أخرى وتحقق من نهائية الرفض وعدم قابلية التعديل أو الحذف.
3. أغلق الفترة الأصلية أو اربط تخصيصًا فعالًا، وتحقق من منع التراجع والإلغاء. اختبر تعارض طلبين وفشل حفظ القرار دون حفظ جزئي.
4. افتح قيدًا مولدًا، واختبر رفض استدعاءات التعديل والحذف والاعتماد والإلغاء المباشرة، مع عمل العرض والطباعة والسجل وفتح المصدر المعروف.
5. خصص مبلغًا من مصدر مؤهل ثم كرر الطلب بسعة متجاوزة وبشركة أو فرع أو عملة مختلفة؛ تحقق من منع التجاوز وإعادة التحقق تحت القفل.
6. انتقل بين الصفحات وغيّر الفلاتر ورتب الأعمدة، ثم تحقق من العدد والتصدير العادي والتفصيلي والطباعة الكاملة، ومن استبعاد السطور المحذوفة.
7. جرّب فشل الشبكة وخيارات المرجع وتنظيف المرفقات، وتبديل معرّف الصفحة ومسودة متسخة، وفقد أهلية التعديل، ثم راجع دليل الشاشة واللغتين والمظهرين والعرض الضيق والطباعة.

اقتراحا commit فقط،دون تنفيذهما:

```text
frontend: refactor journal vouchers with typed drafts, approval and source actions
backend: enforce journal voucher lifecycle, source ownership and approval history
```

لم تُشغّل builds/tests/lint/database/browser/migrations/Graphify/Sigma MCP/commit/push/deploy. الحالة Implemented — source-only ولا تدعي صحة تشغيل لم يُنفذ.

## ملحق مطابقة الكاش وتوضيح الوثائق — 2026-10-25

طلب المالك التحقق من الكاش وفق الوثائق، ثم تحسين وضوحها لمنع إغفال المتطلبات. كان الربط الأساسي موجودًا، لكن المطابقة كشفت نواقص مؤكدة: ربط المراقبة رغم فشل envelope أولي لبعض المصادر، وتسميات طرف محفوظة خارج مصفوفات الربط لا يمسحها تبديل السياق، وإعادة استخدام نتيجة سياسة دقة العملة عند Retry، ونقص إبطال مصدر العملاء التجميعي بعد بعض كتابات منتجيه. أُصلحت هذه النواقص؛ لا يصح وصف التنفيذ السابق بأنه اجتاز بوابة الكاش كاملة. الملحق الحالي يصالح النتيجة دون محو التقرير السابق.

تسبق المسارات التالية قاعدة API الفعلية من environment، والمعاملات المشفرة تحفظ كما يرسلها المصدر:

| المسار والغلاف | التصنيف والأدلة | مالك المصدر والكتابات والإشعار | القراءة والمراقبة | الفشل والسياق والمسودة | نتيجة المصدر والتحقق المتبقي |
|---|---|---|---|---|---|
| Branch/GetSelect؛ Results<DropDownSelect> | مرجع مشترك opted-in | BranchService: createBranch/updateBranch/inherited delete وكتابات Base؛ lookup-branches→Branch | قائمة JVs ومحررها: finite getSelectList ثم binding واحد بعد نجاح مصدر الفرع؛ DestroyRef teardown | feedback inline نفسه، selected branch IDs/options getters، retain empty-success labels؛ null reset يمسح الخيارات | مطابق مصدرًا؛ الشبكة/TTL/الجلسة عند المالك |
| Job/GetSelect؛ Results<DropDownSelect> | هويات وتسميات عادية، لا إغلاق أو سعة عمل | JobService: typed add/update/close/cancel→invalidateSelectOnSuccess؛ lookup-jobs→Job | محرر JVs: finite bootstrap ثم jobs watch بعد نجاحه فقط | retains selected job labels دون patch للسطور أو تغيير المسودة؛ error/Retry مشتركان | مطابق مصدرًا؛ runtime عند المالك |
| Supplier/GetSelect؛ Results<DropDownSelect> | مرجع مشترك opted-in | SupplierService وBase writers/import المورد القائمة؛ اعتماد ContactGroup الحالي محفوظ؛ lookup-suppliers | getSelectList ثم suppliers binding بعد نجاحه | IDs/current options getter؛ التسميات المختارة المنقولة من محفوظ الرأس تحت ملكية binding نفسها؛ context reset لا يعيد تسميات قديمة | مطابق مصدرًا؛ الإشعار/Retry عند المالك |
| Customer/GetSelect؛ Results<DropDownSelect> | مصدر تجميعي قائم opted-in، أثبت backend CustomerService.SelectAsync أنه هوية/اسم Company وIndividualPartner فقط | CustomerService/Base، واعتماد Customer الصريح في CompanyPartnerService وIndividualPartnerService؛ إنشاء/تعديل/مجموعة اتصال والكتابات الموروثة؛ ImportData/Companies وImportData/IndividualPartner عند savedRows>0؛ lookup-customers مسجل للعائلتين | finite source read ثم customers binding بعد نجاحه فقط؛ لا bypass HTTP في JVs | يحتفظ بالتسميات المختارة في مصفوفة binding؛ reset يمسحها دون تغيير partnerId أو dirty؛ source writes تبطل قبل callbacks، والفشل/zero savedRows لا يبطل | مطابق مصدرًا بعد إصلاح كتابات المصدر؛ قبول concurrency/notifications عند المالك |
| Account/PostingSelect?usage=0؛ Results<DropDownSelect> | اختيار حساب ترحيل تشغيلي مستثنى من الكاش | AccountService.getPostingSelect، الخادم يثبت الأهلية | طلب مباشر في bootstrap؛ لا watch ولا كاش محلي | error/Retry، احتفاظ تاريخي بالاسم لا يثبت صلاحية الترحيل | مطابق لعقد مباشر |
| Asset/GetSelect؛ Results<DropDownSelect> | مصدر خيارات غير opted-in حاليًا؛ الاسم GetSelect لا يمنح أهلية كاش | AssetService/Base direct | القائمة والمحرر finite direct؛ لا watch | inline failure/Retry؛ labels المحفوظة للمحرر merge أولي فقط | مطابق للاستثناء المصدرّي؛ لا تفعيل مصدر جديد |
| CostCenter/GetSelect؛ Results<DropDownSelect> | مصدر خيارات غير opted-in حاليًا | CostCenterService/Base direct | المحرر finite direct؛ لا watch | inline failure/Retry وselected saved names؛ السيرفر يتحقق الأهلية | مطابق للاستثناء المصدرّي |
| Currency/GetFinancialNumberPolicy؛ Result<FinancialNumberPolicy> | عقد مالي مباشر، ليس ReferenceLookupCache | FinancialNumberPolicyService؛ invalidate الحالي بعد كتابات Currency الناجحة محفوظ | JVs وallocation يطلبان load(true,{skipErrorInterceptor:true}) عند التحميل/Retry؛ لا مراقبة تغير دقة مسودة مفتوحة | لا replay لفشل قديم أو سياسة سياق سابق في JVs؛ routeVersion/teardown يمنع تطبيق المتأخر؛ خيارات feedback الاختيارية تفصل الطلب ذي المالك المحلي عن العالمي | مطابق مصدرًا؛ لم تتغير الدقة أو الحسابات؛ قبول الشبكة عند المالك |
| JournalVoucher وGetById/{id} و{id}/approval و{id}/log؛ Results/Result | بيانات تشغيلية مباشرة | JVService: save/delete/decision/void ثم refresh الحالي | HTTP مباشر؛ لا shared/local cache | كلا الفشلين، cancellation/identity guards وRetry؛ لا اعتماد على snapshot للأهلية | مطابق مصدرًا |
| {id}/allocation-lines و{id}/allocation-sources/{detailId}؛ Result<array> | سعة وتوافق مالي آني، مستثنى | JVService والخادم يعيدان التحقق عند Allocate تحت القفل | طلب مباشر عند الفتح/الاختيار/Refresh؛ لا cache/read replay | يحتفظ بالمبالغ المدخلة للمصادر المفقودة ويمنع الحفظ حتى تصحيحها؛ scope/response version fence | مطابق مصدرًا؛ concurrency عند المالك |
| الأنواع وحالات الاعتماد ومجموعات الترحيل وأنواع المرفقات | ثوابت enum، لا HTTP source | models/list وPartnerDocumentType | لا طلب أو cache/watch مطلوب | أرقام wire صريحة، تسميات مترجمة والمحـفوظ غير المعروف يحتفظ برقمـه | لا ينطبق كاش الشبكة |

المالك المشترك الحالي مسؤول عن TTL خمس دقائق وحد64 للمدخلات الخاملة وpending coalescing/clones و150ms invalidation وscope/session/language/branch fences وhidden→visible/rejoin. راجعت هذه المداخل المصدرية وموضوعات realtime المعروفة؛ لم أغيّر هذه الآلية أو أضف socket/storage/cache محليًا. تظل تجربتها التشغيلية عند المالك. متغيرات partner labels المحلية تُنقل للمصفوفات المراقبة قبل التخلص من retainedPartners؛ callback reset لا يقرأ data() ليعيد الأسماء القديمة. Refresh الناجح لا يغير قيمة form أو dirty أو الحسابات.

أصلحت operator الإبطال الموجود في BaseService حتى يعمل اعتماد صريح ولو كان الكاتب لا يخزن GetSelect الخاص به؛ العائلتان Company/IndividualPartner لا تصبحان مصدرَي cache جديدين. الاستيرادان المدعومان يستدعيان CustomerService.refreshSelectList على savedRows موجب، وليس isSuccess وحده. قرأت backend SelectAsync ومساري ImportData وعائلتَي الموضوع لتثبيت المنتج؛ لم أغيّر API أو قاعدة البيانات. النقل القديم غير المثبت لاستيراد عملاء من مسار مختلف ليس دليلًا لاختراع API أو نتيجة persisted.

تغييرات الاستكمال: تفاصيل وقائمة وتخصيص JVs، وخدمة FinancialNumberPolicyService بخيار feedback اختياري مع حفظ التوقيع السابق، وBaseService success-only dependency operator، وخدمتا CompanyPartner/IndividualPartner، وخدمتا استيرادهما المدعومتان. لا ملفات forms أو أعمال العملاء تغيرت. دليل JVs ثنائي اللغة يشرح مصادر الخيارات التي تتحدث خلفيًا، والاحتفاظ بالمسودة، والمسح عند تبديل السياق، وإعادة المحاولة، واستثناء الحسابات/الأصول/مراكز التكلفة/السعة/الدقة من المراقبة.

توضيح التعليمات: بوابة Mandatory screen cache gate أصبحت قرب مدخل AGENTS والمهارة وUI2، ويثبت Master5 أن ذكر أسماء مشتركة لا يكفي للمطابقة. جدول الأدلة موجود قبل التنفيذ وعند التسليم؛ المصدر غير opted-in يحتفظ بعقده المباشر ولا يستدعي إضافة كاش. حدّثت templates للحزم0/2/3/5/6 وdependencies UI2/UI22 للحزمتين0/6. أُعيد توليد الحزم الثماني عبر المولد فقط؛ الحزم1/4/PLAN-00 تتجدد لفهرس Master5 دون تغيير نطاقها. راجعت دلاليًا أن0 يحمل التصنيف و2/3 يستهلكانه و5 يفحص wiring و6 يمنع ادعاء الاكتمال بلا أدلة، وأن الاستثناءات والحدود المصدرية متوافقة. تغييرات الكتب/الحزم السابقة محفوظة.

وكيل الوثائق cache_docs بالنموذج الموروث تولى AGENTS/المهارة/UI2/Master5/CHANGELOG بملكية منفصلة عن source إصلاحات الجذر لتقليل زمن المهمة؛ الجذر راجع النص وأكمل contract/matrix وtemplates/generator وshared dependency rule والمطابقة. لا يعلن الوكيل اكتمال الميزة.

التحقق: diff المصدر في الواجهة ومستودع الوثائق، ومطابقة الاستيرادات/توقيعات الواجهات/مفاتيح المسارات وJSON manifest ونتيجة generator -Check. لا build/test/lint/database/browser أو migrations/commit. لا schema جديدة لهذا الملحق؛ متطلب ترحيل تاريخ الاعتماد في التنفيذ الأصلي ما زال قائمًا.

تحقق المالك الإضافي: افتح المحرر ثم غيّر تسمية فرع/عميل/مورد/أمر عمل من جلسة أخرى، واختبر TTL وإعادة الاتصال دون تغيير المسودة؛ جرّب empty success وfalse envelope وHTTP failure وRetry ثم تبديل الشركة/اللغة/الجلسة، وتأكد من اختفاء الخيارات القديمة؛ جرّب استيراد عميل بنتيجة جزئية موجبة وآخر صفرية وفشل حفظ؛ واختبر سياسة الدقة مع فشل ثم Retry بلا toast خطأ مكرر. المصدر-only لا يثبت هذه النتائج تشغيلًا.

اقتراح commit إضافي للواجهة: `fix journal voucher lookup coherence and dependent customer invalidation`، وللوثائق: `make screen cache evidence mandatory from discovery through handoff`. اقتراح فقط دون تنفيذ.

## ملحق التحميل وأداء القائمة — 2026-10-25

طلب المالك استخدام اللودر الجديد وتصحيح الوثائق ثم أبلغ عن بطء صفحة القيود. إصلاح التحميل ومصفوفة المسارات ودليل الشاشتين في VOUCHERS_LOADING_FEATURE_REVIEW؛ خطة المالك المشترك لها تعديل Frozen لعمر query-only navigation. يستعمل GetMany نفس العقد السابق، مع تحسينات الاستعلام المحصورة المجمدة في JVS_MAINTENANCE_EVOLUTION_PLAN والعقد: فحوص مراجع المصدر24 تحفظ جميع الأنواع وincludeDeleted:true وRepository tenant predicates، لكنها تجمع IQueryable<int?> عبر23 Concat ثم Distinct وToListAsync واحد. حالة PayrollPaymentVoid غير nullable تصير cast خادميًا إلى int?. لا full-entity loads ولا EF parallel أو SQL خام.

سعة التخصيص تجمع هويات مرشحي الصفحة وتقرأ partner lines مرة وWhereLedgerEffective allocations مرة. Dictionary يجمع كل طرف مع عدم احتساب السجل مرتين إن اتحد الطرفان، وهي نفس دلالة OR السابقة. تستعمل التفاصيل helper نفسه مع معرّف واحد. actionCandidateIds يستبعد CanAllocate من فحص المصدر لأن هذا الفحص لا يغيّر التخصيص أصلًا؛ تبقى قيود المصدر المولدة قابلة للتخصيص حيث السعة والحالة تسمحان، ولا تُمنح edit/delete/void. شروط الفترة مجمعة مسبقًا وتبقى. الصفحة الفارغة تعاد بنفس total metadata دون queries إغناء فارغة.

الفرق العددي المثبت من المصدر يخص هذين المسارين فقط:24+2N تنفيذ قراءة كان يمكن أن يحدث عندما تكون N صفوف مؤهلة، فأصبح واحدًا للمراجع واثنين بحد أقصى للسعة لكل الصفحة، مع تخطي كل جزء إذا لم يكن له مرشح. لا يعني ذلك أن endpoint كله صار3 استعلامات؛ count/page/jobs/allocation refs/period والـsource-navigation resolver الحالي باقية. الأخير له10 قراءات متتابعة page-batched؛ حُفظ المرجع ولم أختزل غموض المصدر أو أحذف حارسًا لادعاء سرعة. القياس الفعلي للـHTTP/SQL والزمن وخطة التنفيذ عند المالك؛ لا أرقام زمنية مختلقة أو وعد أن كل أسباب البطء زالت.

الفحص المصدرّي المستقل من luna بعد التحرير لم يجد اختلافًا دلاليًا مؤكدًا في early-empty/count أو generated allocation أو ledger/tenant/history أو الأنواع24. الجذر راجع scoped diff والاستيرادات والـConcat scalar shapes وعدد materializations؛ لا نجاح بناء أو SQL translation مثبت هنا. يلزم تشغيل ومقارنة before/after عدد الرحلات والمدة، وحالات مصادر محذوفة/متعددة وتخصيص من كلا الطرفين وسعة مستنفدة وفرع/عملة/فترة وشركة مختلفة. تحقق endpoint approval/detail أيضًا لأنه يعيد استخدام فحص المصدر الموحد.

ملف backend المعدل في هذه الشريحة JournalVoucherService.cs فقط، لا migrations أو snapshot أو view/index جديد؛ المصدر الآخر والملاحة لم يتغيرا. BE7 والمهارة وسجل التغييرات يوثقان batch page-state وعدم parallel EF أو cache للأهلية، وحزم التنفيذ تجددت بالمولد ونجح Check. دليل JVs EN/AR يشرح التحميل والبحث والترقيم، دون تفاصيل تنفيذ داخل تدفق المستخدم. جميع الفحوص تشغيلية والبناء عند المالك، ولا schema إضافية لشريحة الأداء. اقتراح commit: `batch journal voucher action eligibility and source-reference reads` دون تنفيذه.

## متابعة خطأ تاريخ سجل الاعتماد — ٢٠٢٦/١٠/٢٥

وردت من المالك رسالة خطأ تحويل التاريخ في إسقاط سجل الاعتماد، ومعها أخطاء دوال غير موجودة في متحكم قيود اليومية. عولجت كتعديل محدود من المستوى الصغير؛ لم تُفتح دورة أعمال أو مرحلة تنفيذ جديدة.

التعديل الوحيد في مصدر التطبيق: خاصية تاريخ الحالة في نموذج تاريخ الاعتماد أصبحت تقبل القيمة الفارغة، بما يطابق تاريخ الإنشاء الموروث من الكيان وعقد سجل الاعتماد المشترك في الواجهة. يحتفظ الإسقاط بالقيمة المسجلة، ولا يختلق وقتًا حاليًا أو تاريخًا افتراضيًا للسجلات الناقصة. لا تغيير في الكيان أو إعدادات قاعدة البيانات أو الخرائط أو منطق الاعتماد، ولا يلزم ترحيل لهذه المتابعة. لا تغيير لدليل المستخدم لأن العرض المشترك يدعم التاريخ الفارغ أصلًا.

الملف المعدل:

```text
SigmaBackend/SiGma.ViewModels/ViewModels/JournalVoucher/JournalVoucherApprovalHistoryVM.cs
StatusDate: DateTime → DateTime?
```

راجعت تعريف واجهة خدمة القيود وتطبيقها الجزئي واستدعاءات المتحكم: دوال سياق الاعتماد والسجل وقرار الاعتماد ومصادر التخصيص موجودة فعلًا، وكذلك توقيع إلغاء الاعتماد الذي يقبل المعرّف ونموذج القرار ورمز الإلغاء. مراجع مشروعي الخدمة والخادم صحيحة، وتستخدم الأجزاء الجزئية مساحة الأسماء نفسها؛ مشروع النماذج يضم الملف تلقائيًا وفق إعدادات المشروع الحالية. لذلك لم أضف دوال مكررة ولم أغير المتحكم الصحيح لمعالجة أخطاء قد تكون تابعة لفشل بناء مشروع الخدمة أو مرجعه السابق. لا يمكن تأكيد زوال رسائل المترجم دون إعادة البناء عند المالك.

نجح فحص الحزم الثماني قبل الاستخدام، وراجعت المصدر والتغيير المحدود وفحص المسافات. لم أشغّل بناءً أو اختبارات أو قاعدة بيانات أو ترحيلات أو متصفحًا، ولم أستخدم وكلاء فرعيين لأن تعديل النوع محدود ومتتابع. تبقى إعادة بناء الحل والتحقق من عرض سجل بتاريخ مفقود عند المالك. اقتراح حفظ التعديل في المستودع:

```text
fix(journal-vouchers): preserve nullable approval history dates
```

### توحيد اسم إجراء التخصيص — 2026-10-25

طلب المالك اختصار اسم إجراء القيود اليومية إلى Allocation. تعديل من الفئة S وفق UI7/UI23: أصبح journalVoucher.allocation.title يعرض Allocation بالإنجليزية والتخصيص بالعربية؛ يشترك الإجراء وعنوان حواره في المفتاح نفسه، دون تعديل أهلية الإجراء أو تنفيذه. حُدّث دليل الشاشة الموجود باللغتين لذكر الإجراء كما يظهر. المرجع الفعلي ActionList في قائمة القيود اليومية وEditorDialog في التخصيص، مع حفظ عقود الخلفية والكاش والتحميل والاستعلامات؛ لا أثر للأداء أو الفهارس ولا migration. فحص الحزم الثماني ناجح، وفُحص الفرق المحصور وwhitespace مصدرًا؛ التشغيل والتحقق البصري عند المالك. لم تستخدم وكلاء لصغر التعديل، ولم تنفذ أوامر بناء أو اختبار أو متصفح أو قاعدة بيانات أو commit. اقتراح commit للواجهة: rename jv allocation action consistently.

### مراجعة سؤال المالك: ضيق محرر القيد وبطء فتحه — 2026-10-25

نطاق هذا الملحق تشخيص مصدرّي فقط لسؤال «ليه الشاشة بتفتح مش بكامل عرض الشاشة وبتاخد وقت كبير فى الفتح». الصورة دليل وظيفي على مساحة محرر ضيقة وفراغ كبير بجانبها، وليست قياسًا للزمن. شكل الواجهة محرر مالي موجّه بتبويبات؛ الخلفية قراءة تفاصيل وسياق اعتماد، وليست مشكلة قائمة البحث التي حُسّنت سابقًا. فحص الحزم الثماني ناجح. لا تغييرات تطبيق أو كتب أو حزم أو تشغيل.

سبب العرض المؤكد مصدرًا: details.component.scss يكرر :host مع display:flex باتجاه row الافتراضي، فيتغلب على display:block في sigma-route-host المشترك. عنصر section.sigma-editor-page المباشر لا يملك flex-grow أو عرضًا صريحًا، فلا يتمدد داخل المضيف؛ قواعد Layout تمتد أصلًا بعرض المساحة المتاحة. المرجع UI1 وstyles.scss:3629/3652 وقالب محرر JVs:1. الإصلاح المقترح إزالة تكرار :host والاعتماد على المالك المشترك؛ لا حد عرض متعمد ولا حاجة لتغيير عرض التنقل العام.

أدلة التأخير: loadDetails يحجب النموذج حتى انتهاء GetById؛ DetailAsync في JournalVoucherService.cs:248 يجلب التفاصيل ثم ينتظر تباعًا التخصيصات وتاريخ الاعتماد والمراجع الخارجية وإعادة قراءة رأس القيد وفحص الفترة وحل المصدر، ثم سعة التخصيص عند الأهلية. حل المصدر نفسه يجمع نتائج عشرة أنواع مستندات بطلبات متسلسلة. بعد ظهور النموذج يُنشأ DocumentApprovalCycle حتى حين يخفي تبويبه hidden؛ ngOnChanges يقرأ approval فورًا ويعيد عمليات فحص التخصيصات والمراجع والفترة، ويبدأ اللودر العام. قراءة سياسة الدقة تبدأ بعد التفاصيل أيضًا، وهي سياسة تشغيلية مباشرة ولا تُحوّل إلى كاش مراجع. وضع العرض لا يحمّل قوائم التحرير الثماني، فلا تنسب المشكلة إليها. المقترحات: إنشاء قارئ الاعتماد عند أول فتح للتبويب مع حفظ سياق تغييره، وتقليل/شرطية فحوص أهلية القراءة حسب نوع القيد دون تخفيف حراس الكتابة أو tenant/history، ومراجعة حل المصدر وقراءة الرأس المتكررة. لا تشغيل EF متوازٍ على السياق نفسه.

هذه أسباب بنيوية مرشحة للبطء وليست قياسًا يثبت حصة كل طلب. تحقق المالك: قياس GetById وapproval والسياسة والتصيير كلٌّ على حدة في ظروف ثابتة قبل/بعد. لا اقتراح فهرس محدد جديد من هذه الأدلة وحدها: يلزم شكل SQL الفعلي والفهارس الحالية وخطة التنفيذ لتحديد أعمدة مرتبة وتغطية/تكلفة؛ لا schema/migration أو أوامر DB. لم يستخدم وكلاء لصغر النطاق، ولم تنفذ أوامر محظورة. لا تعني هذه المراجعة أن النقطتين صُلحتا؛ تعديل المصدر ينتظر طلب التنفيذ.

## مطابقة تنفيذ تحسين عرض المحرر ووقت فتحه — 2026-10-25

| البند | النتيجة |
|---|---|
| الحالة | Implemented — source-only |
| تحقق المالك معلق | yes |
| السلطة والنطاق | طلب تنفيذ التحسينات وقواعد عامة؛ الملحق المجمد في عقد JVs؛ UI1/UI13/UI22/UI28/UI29 وBE7/18 |
| الأنماط | محرر مالي موجّه بتبويبات وقراءة تفاصيل/سياق اعتماد؛ شكل API الحالي كما هو |

هذا الملحق ينفذ التشخيص السابق ولا يمحو سجله التاريخي. طبقت مراحل الاكتشاف/تحديث العقد والقراءة والتفاصيل والتكامل والمطابقة؛ لا عمل حالات/حفظ جديد ولا تغيير شبكة routes أو DTO أو mapping أو حسابات أو schema. الصورة تثبت ضيق العرض وتبويب الاعتمادات فقط؛ لا تستنتج زمنًا منها. لا قرار Missing/Conflicting/Uncertain داخل شريحة التنفيذ.

### أدلة المطابقة النهائية

| الاهتمام | الكتاب والمالك الفعلي | القرار والتنفيذ |
|---|---|---|
| عرض مساحة العمل | UI1؛ sigma-route-host وsigma-editor-page في styles.scss؛ مرجع Workshop/Job/editor | حذف :host المحلي من تفاصيل JVs؛ display:block المشترك يمدد القسم تلقائيًا، دون width ثابت أو viewport calc أو CSS عام جديد. تبقى tab panels والتمرير والطباعة |
| تبويب الاعتمادات | UI13/UI22؛ EditorTabs وDocumentApprovalCycle | approvalVisited يبدأ false ويُضبط من أول اختيار أو رابط tab=approval؛ @if يؤخر إنشاء القارئ حتى الزيارة؛ [hidden] يحفظ المثيل عند تبديل التبويب. resetForRoute يصفر الزيارة، وloadingData يعيد إنشاء القارئ بعد تحديث/قرار، مع بقاء pending/Retry/teardown |
| سياسة الدقة في العرض | UI2/UI28؛ FinancialNumberPolicyService.load(true) | تبدأ قراءة مباشرة مستقلة بجانب التفاصيل بدل انتظارها؛ لا كاش مراجع أو watch جديد. تبقى version/unsubscribe fences. الطباعة التلقائية تنتظر تفاصيل الهوية الصحيحة والسياسة ونجاح القراءة، ويُحجب callback الإطار القديم عند تغير routeVersion/ID أو التدمير |
| فحوص قراءة التفاصيل | BE7/18؛ DetailAsync وOriginalPeriodOpenAsync | حساب مرشحي اليدوي pending/approved أولًا، ثم التخصيص والتاريخ والمراجع والفترة فقط حين يمكن أن تؤثر في can*. وجود تخصيص يمنع الفحوص اللاحقة غير المؤثرة، ووجود مرجع يمنع فحص فترة غير مؤثر. إزالة استعلام الرأس واستخدام Date/FiscalYearId من الإسقاط مع نفس helper؛ السعة فقط للحالة القابلة للتخصيص |
| سياق الاعتماد | BE7/18؛ GetApprovalAsync | Generated وغير اليدوي/غير القابل للقرار لا ينفذ فحوص أهلية لا يمكنها تغيير can*. تظل السطور والمبلغ والتاريخ والحالات في الرد نفسه، وتبقى حراس الكتابة وإعادة التحقق |
| حل مستند المصدر | BE7؛ JournalReportSourceResolver المستخدم فعليًا من JVs وبقية قرائه | الفروع العشرة تجمع بتسع Concat ثم ToListAsync واحد بدل عشر materializations متتابعة. الإسقاط ثلاث قيم int ثم فك رمز النوع بعد القراءة. كل أنواع الفواتير وترتيب اختيارها وtenant/live filtering محفوظة؛ kind=0 يبقى مرشحًا null. لا Distinct على المرشحين: count==1 كما كان يمنع التخمين/الغموض |
| كاش الشاشة | UI2؛ مصفوفة JVs الموجودة | لا تغيير لتصنيف المصادر أو URL أو writers/import invalidation أو watches/notification أو bootstrap/labels/draft/context/error/Retry/teardown. وضع العرض لا يجلب قوائم التحرير؛ السياسة مباشرة، وسياق الاعتماد عملي غير مخزن |

### الأداء والفهارس وحدود الإثبات

التغييرات المثبتة مصدرًا: صفر طلب approval عند فتح تبويب أساسي حتى أول زيارة، وواحد عند أول فتح مع عدم إعادة القراءة لمجرد تبديل تبويب في السجل نفسه؛ السياسة والتفاصيل مستقلتان في وضع العرض؛ مصدر المستند ينتقل من عشرة مواقع materialization متتابعة إلى واحد؛ حذف إعادة تحميل رأس القيد وتقليل الفحوص بحسب الحالة. لا تمثل هذه الأعداد أوامر SQL مقاسة أو نسبة تحسن زمني، خصوصًا EF split queries/includes. يبقى قبول ترجمة UNION ALL مع وراثة InvoiceBase وخطة SQL وزمن الشبكة/التصيير عند المالك.

قرار الفهارس في هذه الشريحة: لا فهرس جديد مؤكد أو مطبق. إعدادات Receipt/Payment/InvoiceBase تعرف FK إلى JournalVoucherId، وJournalVoucherApprovalLogConfig يتضمن بالفعل (SubscriptionId, JournalVoucherId, CreatedAt, Id). هذه أدلة إعداد مصدر وليست جرد فهارس قاعدة التشغيل. العائق المثبت هو عدد القراءات وتسلسلها؛ لا تضف فهرسًا مركبًا مكررًا أو فهرس live-only لقراءات تشمل التاريخ قبل مراجعة SQL والخطة والتغطية/التداخل وكلفة الكتابة والمساحة وفق BE2. لا migration لهذا التعديل ولا تعديل snapshot أو ملفات migration الموجودة.

### الوثائق والدليل والتحقق

أضيفت قواعد عامة في UI1 (التمدد والمالك المشترك)، UI13 (hidden لا يؤخر الإنشاء/الشبكة؛ أول تفعيل مع الاحتفاظ وإعادة الضبط)، BE7 (مرشح الإجراء قبل القراءة وإعادة استخدام حقائق الرأس وحفظ تعدد/غموض المصدر) والمهارة مع revision row وCHANGELOG. روجعت الصياغة دلاليًا لتجنب نقيض lazy loading وللتفريق بين Concat الذي يحفظ التعدد وDistinct غير المسموح عندما تحكمه uniqueness. أضيفت بوابات صريحة إلى قالب Phase3 وقالب Phase6، وUI1/UI13 إلى dependencies Phase6؛ أعيد توليد PLAN-00 وPHASE-00..06 بالمولد فقط، ونجح -Check للحزم الثماني. المراجعة الدلالية تثبت ربط أحكام القالب بكتلها الحالية وبصماتها، دون تحرير generated يدويًا.

دليل المستخدم: journal-vouchers-topic.ts باللغتين، مسجل في record-list-topics.ts ودليل قوائم وحدة السندات الموجود؛ يشرح الآن أول قراءة للاعتمادات والاحتفاظ عند تبديل التبويب والتحديث عند إعادة فتح القيد. موضعه ومساره الحاليان لم يتغيرا.

فُحصت الفروق المحصورة في مستودعي التطبيق ومستودع الوثائق؛ diff --check دون أخطاء (تحذيرات نهايات الأسطر فقط)، وأسماء signals/template/imports والـnamespace/global imports وإدراج ملفات C# بالمشروع الحالي. لا نوع مسمى جديد أو تغيير DTO/AutoMapper/سياسة مالية. عامل خلفية sol_worker بالنموذج gpt-5.6-sol امتلك ثلاثة ملفات خدمة فقط ثم أجرى تدقيقًا قرائيًا مستقلًا للواجهة؛ عامل وثائق luna_explorer بالنموذج gpt-5.6-luna امتلك ثلاث كتل وCHANGELOG والمهارة. الملكيات منفصلة والتجميد سبق العمل؛ الجذر امتلك الواجهة والتكامل والحزم والمطابقة. لم يجد التدقيق المستقل تراجعًا دلاليًا ملموسًا؛ SQL/runtime غير مثبتين. استُخدم المساران المستقلان لتقليل زمن التنفيذ مع مراجعة الجذر للتكامل.

تحقق المالك المطلوب: مقارنة cold/warm تحت نفس الشركة/القيد/الشبكة/device/build وبعينات متكررة، مع فصل GetById والسياسة وapproval ووقت الظهور الأول والاستقرار. افتح قيدًا يدويًا ومولدًا وافتتاحيًا وحالة مع تخصيصات/فترة مغلقة، ثم رابط approval مباشر وتبديل تبويب والرجوع وسجل آخر وRetry/فشل/إلغاء؛ قارن can* بالمخرجات السابقة. تحقق من عرض كامل المساحة المتاحة مع sidebar في EN/AR/light/dark ونوافذ ضيقة، ومن حفظ المسودة والطباعة وSave-and-print عندما تسبق السياسة التفاصيل والعكس، وعدم الطباعة بعد مغادرة الهوية. راجع المستند ذا المصدر الوحيد والغائب والمجهول والمتعدد. البناء والتشغيل والمتصفح وقاعدة البيانات والقياس عند المالك؛ لم تنفذ builds/tests/lint/database/browser/migrations/commits/push/deploy/Graphify/Sigma MCP.

اقتراحات commit فقط: للواجهة fix jv editor width and lazy approval loading؛ للخلفية optimize jv detail reads and source resolution؛ للوثائق document routed editor fill and deferred tab read gates. لا إجراءات نشر أو schema مطلوبة في هذه الشريحة.

## مطابقة إجراء اليومية المستقل — 2026-10-25

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | طلب المالك تحويل Journal من View إلى نافذة مثل Bill؛ مراجعة Allocation منفصلة في JVS_ALLOCATION_FEATURE_REVIEW.md ولا تفوض تعديلها |

العقد المجمد في ملحق JVS_DOMAIN_API_CONTRACT_FREEZE والخطة الموافقان. الشكل UI09 action read dialog لوثيقة BE15؛ BillJournal مرجع للمحتوى والحجم والفعل فقط، وقد بقي ملفه بلا تعديل. نُفذت قراءة جديدة وربط الإجراء وواجهة مشتركة ودليل المستخدم والمطابقة؛ لا تنفيذ حفظ/حالات/تخصيص جديد ولا تغيير قواعد مالية/AutoMapper/schema. لا قرار Missing/Conflicting لليومية؛ تعارض OpeningBalance يخص تقرير التخصيص فقط.

### المنتج والمستهلك والمالك

| الاهتمام | مصدر العقد والمالك الفعلي | النتيجة النهائية |
|---|---|---|
| المسار | IJournalVoucherService.GetJournalAsync → JournalVoucherService.Journal.cs → JournalVoucherController GET {id:int}/journal → JVService.getJournal | عقد Result<VoucherJournalLineDto[]> القائم؛2 مواقع materialization (الرأس والسطور)؛ cancellation و404؛ لا قراءة Details كاملة أو source resolver أو lookups/policy |
| أعمدة العرض مقابل DTO | Date / Account / Contact / Type / VoucherNo / Description / Debit / Credit | date؛ accountCode+accountName؛ contact؛ type؛ voucherNo؛ description؛ debit؛ credit، بلا خصائص زائدة في DTO. backend Type هو VoucherSubType.ToString ويترجمه JVs من JV_SUBTYPES باللغتين |
| حالة القيد | هوية JV نفسها وRepository.Query tenant/live للقراءة | كل حالات القراءة السابقة باقية، بما فيها pending/voided؛ ترتيب السطور Id ثابت؛ left joins يحفظ السطر عند تعذر تسمية الحساب أو الطرف. لا inference من رقم ولا قيد source ownership خاص بالكتابة يضاف إلى القراءة |
| المكوّن المشترك | UI13؛ DocumentJournalComponent وVoucherJournalLine؛ EditorDialog/DataTable/SummaryCards/StateMessage/focusField | recordId + loadJournal required؛ title مفتاح ترجمة وsubtitle نص عرض وtypeLabel اختياري وclosed output. dialog view1250×700 مع max/breakpoints المشتركة؛ جدول واحد يتمرر وملخصا مدين/دائن، بلا Save أو CSS جديد |
| التحميل والكاش | UI2/UI22/UI28؛ loader محلي داخل body dialog، API تشغيلي مباشر غير مخزن | StateMessage واحد؛ showLoadingIndicator=false للجدول وaria-busy؛ false envelope/HTTP error/Retry؛ rows=null تخفي المجاميع حتى النجاح و[] تعرض empty صحيح. close يلغي القراءة ويطلق closed؛ ID/version/closing وDestroyRef تمنع الاستجابات القديمة. لا invalidation/watch/tenant notification لكاش مراجع لأنه ليس مصدرًا معتمدًا للكاش |
| القائمة والتكامل | JournalVouchersComponent journalRecord/loadJournal/journalTypeLabel | إجراء Journal يفتح dialog ويحفظ البحث/الصفحة؛ busy وonLazyLoad يراعيان النافذة. View ورابط الرقم والطباعة باقية بمساراتها؛ أزيل معامل journal الذي كان يضيف tab=details. التسجيل standalone صحيح والمكوّن الجديد مضاف إلى tsconfig.app.json ملفات التطبيق الفعلية |
| الدليل والترجمات | UserGuide/content/journal-vouchers-topic.ts المسجل في record-list-topics.ts ودليل القوائم الحالي | دليل باللغتين يميز Journal dialog من View وPrint؛ block documentJournal في en/ar لكل الأعمدة والمجاميع وempty/error، دون تعديل stubs |

### استخراج مشترك وحدود المرجع والوثائق

قالب عرض اليومية ودورة قراءتها يتكرران مع Bill؛ استُخرج عارض محايد بدل نسخة feature جديدة وفق Master5. استهلكه النطاق الحالي JVs مباشرة، وبقيت الخدمة والنوع والأهلية مع feature. Bill مرجع خارج نطاق التحرير؛ سُجلت نسخته الباقية في UI30#39 لترحيلها عند مراجعتها، وفق قاعدة الاستخراج التي تسمح بتسجيل النسخ خارج النطاق، بلا إنشاء wrapper فوق Bill أو تغيير API خاص به. لا منطق تخصيص/ترحيل داخل العارض.

وُثق عقد العرض في UI13 والمهارة وrevision row وCHANGELOG وUI30. روجع source conformance مقابل public inputs والأنماط والحجم والحقول، ثم أُعيد توليد الحزم الثماني بالمولد فقط؛ -Check ناجح، وبصمات UI13/UI30 الحالية مثبتة في الحزم التابعة. الكتاب يفرق title key من subtitle display text وموضع loader داخل dialog، ويحافظ على ملكية View/Print.

### التحقق والأداء والتسليم

راجع الجذر الفروق المحصورة في مستودعي الواجهة والخلفية ومستودع الوثائق، بما فيها الملف الجديد كاملًا، controller/interface وAPI callback/model/template وimports/types والتسجيل والترجمات. diff --check بلا أخطاء (تحذيرات LF/CRLF فقط)؛ JSON الخاص بتسجيل التطبيق صالح. GlobalUsing والمراجع الحالية تغطي EF/entities/Result وusing DTO صريح؛ ملف الخدمة الجزئي يدرج عبر SDK compile glob. عامل sol_worker بالنموذج gpt-5.6-sol امتلك backend المحدد ثم راجع الواجهة قراءةً، وعامل docs بالنموذج gpt-5.6-luna امتلك UI13/UI30/skill/CHANGELOG؛ الجذر امتلك UI/العقد/الحزم/الأدلة والتكامل. لا تداخل ملفات ولا ملاحظة دلالية ملموسة في التدقيق المستقل؛ لا ادعاء compilation من فحص المصدر.

التحسين المثبت هو عدم تحميل المحرر وقراءات أهلية الأفعال من إجراء اليومية، وقراءة محدودة للرأس والسطور. لا قياس زمني أو نسبة تسريع. لا فهرس جديد مطلوب مصدرًا لهذه الشريحة: القراءة بالهوية وعلاقة JournalVoucherId القائمة؛ لا دليل خطة على نقص فهرس، وتقييم الفهارس الفعلية عند المالك إن أثبت القياس حاجة. لا migration أو تغيير DTO/EF/mapping/حساب/حالة.

تحقق المالك: افتح Journal من قائمة مطبّق عليها البحث وتأكد بقاء الرابط/الصفحة؛ طابق السطور والحساب/الطرف والنوع والمجاميع مع القيد المحفوظ في manual/generated/pending/voided. اختبر استجابة فارغة و404/false/error وRetry وإغلاق الطلب البطيء وإعادة الفتح لقيد آخر؛ يجب ألا تظهر سطور أو totals قديمة أو loader وراء mask. تحقق EN/AR/light/dark/narrow والتمرير/footer/focus/Escape/Cancel، ثم تأكد أن View وPrint يعملان كما قبل. البناء والتشغيل/المتصفح/SQL/قياس الزمن عند المالك. لم تنفذ builds/tests/lint/database/browser/migrations/commits/push/deploy/Graphify/Sigma MCP.

اقتراح commit للواجهة: open jv journal in shared read dialog. للخلفية: expose lightweight journal voucher journal read. للوثائق: document shared journal dialog ownership. اقتراحات فقط ولم تُنفذ.
