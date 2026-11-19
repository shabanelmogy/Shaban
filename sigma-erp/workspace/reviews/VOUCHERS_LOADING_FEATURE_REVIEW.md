| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-25 |

# تفعيل التحميل المشترك في قيود اليومية وسندات الرواتب

طلب المالك استخدام اللودر الجديد في الشاشتين وفق الوثائق. النطاق تعديل عرض ودورة طلبات فقط، بلا تغيير API أو حالات المستند أو الحسابات. العقد المجمد: UI22 يملك LoadingService ومضيف Layout الوحيد ومظهر StateMessage المشترك؛ طلب الصفحة والتفاصيل والحفظ والحذف والإلغاء وتقرير/تصدير يقرأ بيانات كاملة يقترن start/end واحد في finalize، بما يشمل الإلغاء والتدمير والفشل. تبقى busy/loading/saving المحلية ودلالات accessibility، مع showLoadingIndicator=false للجدول ذي التقدم العام وإزالة StateMessage loading المكرر لنفس الطلب. تبقى lookup bootstraps محلية، وتحديثات الكاش المحتفظة بالبيانات هادئة. dialogs المضافة إلى body تملك مؤشر StateMessage محليًا عندما تحجب طبقة الصفحة؛ لا مضيف عام أو CSS جديد.

الأنماط: قائمة مع محرر routed master-detail لقيود اليومية، وقائمة ومحرر routed بسيط لسندات الرواتب؛ لا نمط خلفية متغير. المرجع UI22، والمالكون الفعليون LoadingService/Layout/DataTable/PrimaryActionButton/EditorDialog/StateMessage، والعقود الحالية المجمدة في تقارير الميزتين. فحص الحزم الثماني نجح قبل الاستخدام. هذا إصلاح محصور لقاعدة عرض قائمة؛ artifact واحد يتضمن الاكتشاف والعقد والمطابقة، دون مراجعة أعمال جديدة. لا صور جديدة أو قرار أعمال مفقود.

الاكتشاف: قائمة قيود اليومية وعملياتها لا تبدأ الخدمة العامة؛ تفاصيلها تبدأها لكنها تعرض رسالة تحميل ثانية. قائمة/تفاصيل سندات الرواتب تبدأ الخدمة في بعض المسارات لكن تفاصيلها تعرض رسالة مكررة والتصدير بلا تقدم عام. لوحة الاعتماد والسجل المشتركتان تملكان start/finalize بالفعل. تخصيص JVs يستخدم StateMessage محليًا لكن جدول السطور يعرض overlay ثانية. lookups والكاش لا تُنقل للتحميل العام.

تقسيم الملكية: الجذر لقيود اليومية والوثائق والحزم والمطابقة؛ عامل مستقل لسندات الرواتب ودليلها فقط بعد تجميد عقد العرض أعلاه. جميع التغييرات السابقة محفوظة، ولا بناء أو اختبار أو متصفح أو قاعدة بيانات أو migration/commit.

## المطابقة النهائية

استكمال عقد الحوار المجمّد: نافذتا حالة الاعتماد والسجل في JVs ملحقتان بـbody؛ تُقرأ بياناتهما بتقدم StateMessage محلي داخل المالك المشترك، لأن طبقة صفحة Layout خلف نافذتهما. إضافة localReadProgress=false اختيارية إلى DocumentApprovalCycle وDocumentActionLog للقراءة فقط، ويختارها موضع الحوار في JVs؛ تبويب الصفحة وسائر المستهلكين يحتفظون بالـdefault وقرارات الحفظ العالمية الحالية. يُلتقط owner عند بداية كل قراءة لضمان pairing حتى لو تغيّر input، ولا تتغير API أو الأحداث أو الأهلية. هذا استعمال حدود page/dialog الموجودة في UI22، لا مظهر أو مضيف جديد.

| المسار الفعلي والعملية | المالك ودورة الطلب | الظهور والانشغال والأخطاء | النتيجة |
|---|---|---|---|
| JournalVoucher قائمة/بحث/ترقيم | requests→switchMap/defer يبدأ LoadingService؛ finalize ينهيه على النجاح/false/error/cancel/destroy | Layout مضيف واحد، loadingList وSearch busy باقيان، showLoadingIndicator=false للجدول | مطابق مصدرًا |
| JournalVoucher حذف/إلغاء | start/finalize لكل HTTP، refresh طلب مستقل يعدّه نفس المالك | confirmations قبل HTTP بلا تحميل، error/Retry/سبب الإلغاء باقية؛ dialog saving يحفظ gate | مطابق مصدرًا؛ قبول overlay/dialog عند المالك |
| JournalVoucher تقرير وتصدير عادي/تفصيلي | start واحد حول pipeline كل الصفحات وتفاصيلها؛ finalize واحد، لا start لكل عنصر | exporting يمنع التكرار؛ فشل أي جزء يلغي المخرج مع feedback | مطابق مصدرًا |
| JournalVoucher تفاصيل وحفظ | أزواج global موجودة ومحفوظة؛ إزالة StateMessage التحميل المكرر؛ aria-busy للمحرر | error/empty/Retry وبوابة الأهلية والمسودة باقية؛ lookupsLoading يعرض مالك الخيارات المحلي | مطابق مصدرًا |
| JournalVoucher تخصيص | القراءة داخل EditorDialog body تستخدم StateMessage الجديد محليًا، وإخفاء overlay الجدول الثاني | loading/saving/confirmation gates والمبالغ وأخطاء Retry باقية؛ لا تغيير عقد التسوية | مطابق مصدرًا |
| JournalVoucher حالة الاعتماد والسجل | localReadProgress=true للقراءة في dialog فقط؛ default false للصفحة | StateMessage الجديد داخل الحوار بدل loader خلف mask؛ start/end global لا ينفذان لهذه القراءة، القرار نفسه ما زال بمالكه الحالي | مطابق مصدرًا؛ لا تغيير API أو أحداث |
| SalaryVoucher المسار الرئيسي | salaryvoucher.routes.ts→PayrollsComponent؛ قراءة القائمة والاعتماد وbeginExport/endExport كانت paired بالفعل | جدول المكوّن الفعلي showLoadingIndicator=false، الروابط الحالية تحافظ على السياسة؛ showPageLoading غير معطل | مطابق مصدرًا، لم تُغيّر أعمال payroll |
| SalaryVoucher/legacy + create/view/edit/details | SalaryVouchersComponent + DetailsComponent؛ أزواج القائمة والحذف والتفاصيل والحفظ محفوظة، وإضافة زوج للتصدير الكامل | إزالة StateMessage loading المكرر بالتفاصيل وaria-busy؛ error/Retry/dirty باقية | مطابق مصدرًا |
| تحديث رابط الصفحة نفسها | LoadingService يقارن new UrlTree(parsed.root).toString للهدف والرابط الحالي في NavigationStart | query/fragment لا يصفران الطلب الجاري؛ اختلاف paths/outlets/matrix يعيد reset الحالي | مطابق مصدرًا، فحص التنقل الفعلي معلق |
| الكاش والخيارات | لا global starts في background watchers أو bootstrap الخيارات | retained refresh silent، lookup أولي محلي، IDs/dirty/calculations لا تتغير | مطابق للعقد المصدرّي السابق |
| Dashboard | showPageLoading=false استثناء صريح في routing.ts | لم يتغير أي ملف Dashboard أو مؤثراته من هذه المهمة | محفوظ |

### سبب الإغفال والتعارض وتصحيحهما

السبب ليس غياب المكوّن الجديد. كان التطبيق غير مكتمل في بعض handlers، مع رسائل تحميل مكررة للتفاصيل. الأهم أن عبارة route change resets في الوثائق لم تميّز تعديل query عن مغادرة path؛ التنفيذ كان يصفر العداد لكل NavigationStart. writeListRoute ينفذ navigate لمعاملات البحث/الصفحة ثم يشترك HTTP؛ حدث التنقل المؤجل يمكنه إخفاء اللودر والطلب ما زال معلقًا. هذا تفسير مصدرّي قابل للتحقق، لا رصد شبكي. أُصلح مالك LoadingService بدل feature timers أو loader جديد. كذلك مراجعة مجلد SalaryVouchers وحده تغفل أن الصفحة الرئيسية تركب PayrollsComponent؛ فحص المسار الفعلي أصبح جزءًا صريحًا من الأدلة. المراجعة السابقة لم تثبت هاتين النقطتين بما يكفي، وهذا الملحق يسجل نقص المراجعة والتنفيذ دون تبريره بالوثائق.

UI22 أصبح يحمل Mandatory loading conformance gate وجدول request/owner/lifetime/host/busy/recovery من البداية، ويزيل عبارة reset الفضفاضة لصالح مسار UrlTree الكامل دون query/fragment. Master5 وتعليمات AGENTS والمهارة تتطلب إثبات producer/consumer الفعلي، واستثناءات Dashboard والكاش والخيارات/dialog reads محددة. templates0/2/3/5/6 تطلب هذه الأدلة صراحة وPhase6 تمنع اكتمالًا بلا مطابقة. أضيف BE7 إلى dependency Phase6 لتوثيق شريحة الأداء اللاحقة. أعيد توليد الحزم الثماني بالمولد فقط، وفحص -Check نجح، والقراءة الدلالية تثبت اتساق request matrix والتنقل والتفريق بين source evidence وruntime؛ الحزم1/4/PLAN-00 تزامنت مع بصمة Master5 دون تغيير نطاقها.

### الملفات والحدود

الواجهة: LoadingService؛ قائمة JVs TS/HTML وتفاصيلها HTML وتخصيصها HTML؛ DocumentApprovalCycle/DocumentActionLog TS/HTML بخيار localReadProgress للقراءة فقط؛ قائمة المراجع القديمة لسندات الرواتب TS/HTML وتفاصيلها HTML؛ قالب قائمة HRM/Payroll/Payrolls المشترك الذي يعرض الصفحة الرئيسية؛ دليل journal-vouchers-topic وsalary-vouchers-topic EN/AR. لم أغير body loader styling أو provider/router registrations أو API/DTO أو حالات المستند أو صلاحيات أو حسابات. كل ملفات الرواتب كانت بها تغييرات من مهمة أخرى قبل هذا الطلب وحُفظت؛ إضافتنا محصورة في التحميل والدليل. السلوك المشترك للمسارات نفسها يرث التصحيح، كما تقتضي ملكية المكوّن.

الوثائق: AGENTS والمهارة، UI22/Master5/BE7/CHANGELOG، templates0/2/3/5/6 وmanifest dependency وgenerated عبر المولد. الخطة المشتركة السابقة لها تعديل Frozen مؤرخ لعمر query navigation، مع حفظ قرار المظهر السابق. شكل backend لا يتغير في إصلاح اللودر؛ شريحة تحسين أداء JVs المباشرة موثقة في الخطة/العقد/المطابقة الأصلية لقيود اليومية.

طبقت اكتشافًا وتجميدًا محصورًا وتكاملًا ومطابقة مصدرية ودليل المستخدم؛ لم أبدأ مراجعة أعمال للرواتب أو إعادة تصميم API أو مظهر عالمي جديد. لا screenshots جديدة ولا قرارات أعمال Missing/Conflicting/Uncertain. مصدر الكاش وتصنيفه كما في مصفوفة JVs السابقة؛ Salary legacy يعتمد enum بلا HTTP lookup، والصفحة الأساسية تبقى قراءات تشغيلية مباشرة.

المراجعة: scoped diff في مستودع الواجهة والوثائق مع حفظ التغييرات السابقة؛ diff --check دون أخطاء (تحذيرات CRLF فقط)، فحص local import paths/merge markers وmanifest JSON وعدم تكرار dependencies ووجود public showLoadingIndicator وUrlTree pattern نفسه الذي يستخدمه navigation interceptor. لا يعد ذلك Angular build أو تشغيلًا.

وكلاء محدودون بعد التجميد: salary_loader بالنموذج الموروث امتلك ملفات legacy ودليلها فقط، cache_docs بالنموذج الموروث امتلك التعليمات والكتب والمهارة فقط، وluna read-only gpt-5.6-luna راجع شريحة أداء backend مع إبقاء الجذر مالك القرار والتكامل. الملكيات لم تتداخل؛ استُخدمت المسارات المتوازية لأنها ملفات مستقلة ولتقليل زمن التنفيذ. أكمل الجذر فحص مسار Payrolls الفعلي وshared lifetime والطلبات الرئيسية والحزم.

### تحقق المالك

راجع تحميل بطيء للقائمة والبحث والترقيم وتغيير المرشحات أثناء الطلب، ثم نجاح/false envelope/error/Retry وإلغاء الطلب ومغادرة المسار؛ تحقق أن query-only لا يخفي المؤشر وأن المغادرة لا تتركه عالقًا. جرّب overlap حذف ثم refresh والتصدير بكل الصفحات، وتفاصيل/حفظ كلا المحررين؛ يجب أن يبقى مؤشر مرئي واحد للطلب مع gates صحيحة. افحص حوار التخصيص/الإلغاء وأخطاء السبب، وRTL/light/dark/narrow/reduced-motion، واستثناء Dashboard وتحديث الكاش المحتفظ بالبيانات. البناء والتشغيل والمتصفح وقياس الشبكة عند المالك.

لا migration لهذا الإصلاح. اقتراح commit للواجهة فقط: `fix voucher loading lifetime and remove duplicate indicators`. وللوثائق: `require routed request loading evidence and clarify query navigation`. لم تنفذ commits/push/deploy أو builds/tests/lint/database/browser/migrations/Graphify/Sigma MCP.

### تعديل المالك: إخفاء مؤشر تحميل مرشحات القيود اليومية — 2026-10-25

طلب المالك إزالة مؤشر التحميل الإضافي أعلى مرشحات قائمة القيود اليومية. تعديل محدود من الفئة S في قالب القائمة: حذف ربط loading من ReferenceLookupStatusComponent، الذي يملك القيمة الافتراضية false؛ يبقى ربط error/retry كما هو. هذا القرار اللاحق يخصص العرض المحلي لخيارات هذه القائمة فقط وفق طلب المالك، ولا يغير قرار تحميل المحرر أو سندات الرواتب أو المالك المشترك. المرجع UI22 وواجهة المكوّن المشترك الفعلية؛ لا شكل خلفية متأثر ولا تعديل للعقد المحاسبي أو الطلبات أو الاستعلامات أو الفهارس.

المطابقة: تبقى lookupsLoading وبوابة إعادة المحاولة وقراءات الفروع والأصول والكاش وwatch/invalidation والقيم المختارة كما في المصفوفة السابقة؛ يبقى لودر الصفحة العام للقائمة. حُدّث دليل القيود اليومية باللغتين في journal-vouchers-topic.ts ضمن دليل القوائم الحالي. روجع فرق القالب الكامل والموضع المعدل في الدليل، مع فحص whitespace؛ لا وكلاء لصغر التعديل ولا أوامر تشغيل محظورة. فحص الحزم الثماني نجح دون انجراف، ولا تعديل للكتب أو الحزم مطلوب لقرار شاشة خاص. لم تتغير سرعة الطلبات بهذا التعديل المرئي؛ تحقق المالك المتبقي: تحميل القائمة ببطء بلا مؤشر إضافي فوق المرشحات، ثم فشل خيارات الفروع أو الأصول وإعادة المحاولة مع بقاء القيم المختارة. التشغيل والمتصفح والبناء معلقون. اقتراح commit للواجهة: `fix jv filter duplicate loading message`؛ لا migration.
