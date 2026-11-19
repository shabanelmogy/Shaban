# مصالحة صلاحيات اليومية وقيد اليومية

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠٧ |
| العقد | JOURNAL_ACCESS_ADOPTION_CONTRACT_FREEZE.md |
| الهدف العام | active؛ تفعيل جميع الشاشات والأحداث لم يكتمل |
| حدود التحقق | مصدر فقط؛ لا builds/tests/lint/browser/DB/migrations/commits/deploy |

## النتيجة المصدرية

اكتمل تبني قائمة ومحرر قيد اليومية وحوار التخصيص وتقرير اليومية ضمن
العقد المجمد. استلم الجذر ملكيات العاملين وراجع المصدر الفعلي وأصلح
findings المراجعة، ثم أعاد المراجع المستقل تدقيق القائمة والتخصيص والمحرر
دون عائق إضافي مؤكد. هذه مصالحة مصدرية؛ لا قبول بناء أو اختبار أو تشغيل.

ثبت من controller/resolver أن AccountReports.GetJournals هو مفتاح التقرير،
وGetById للقيد View، وPostingSelect هو Account.GetPostingSelect. الاعتماد
POST يستخدم ManageApproval وGET يستخدم View. بقية المفاتيح في العقد مطابقة
للطلبات. تقرير اليومية ReportEffects خلفيًا، وتفاصيل القيد WholeDocument.
لا تعديل خلفي لازم من هذه المطابقة.

ملاحظة دين مشترك غير حاجزة: Account.GetPostingSelect وسياسة العملة يقعان
تحت ForTransactions في مصنف العمليات العام، لكن مصدرهما Account/Currency
tenant-only بلا مالك فرع أو كتابة. لا أثر filtering خاطئ مثبت هنا؛ لا
يوسع ذلك هذه الدفعة إلى تعديل مصنفات مصادر مرجعية غير مملوكة للفرع.

## سجل التقرير — مصدر مثبت وقبول تشغيل معلق

تطلب search/page/refresh/export منحة التقرير. قراءة اختيار الحساب
اختيارية ولا يرسل المعرف عند سحب Account.Lookup. يُلغى finite report/export
وlookup عند الرفض أو السياق، دون duplicate GET بسبب revision غير متعلق.
working/cache/access context يمسح النتائج والفلاتر والاختيارات، وتغير
auth/token ينهي الجلسة القديمة. الرابط يفحص مصدره الفعلي وعضوية السطر
وسياسة وجهته. يغلق Select/DatePicker portals ويحجب/inert السطح المرفوض.
تُستخدم خدمة الحساب المباشرة الحالية بلا cache opt-in؛ تقدم قراءة الحساب
والتقرير والتصدير من LoadingService الصفحة، وأزيل مؤشر select المكرر.

المواصفات الجديدة في journal.access.spec.ts تستخدم القالب الحقيقي وتغطي
المنح الجزئية والإلغاء وإعادة المنح والسياق وروابط المصدر. لا اختبار
تنزيل فعلي؛ التصدير في حالة pending ملغاة. لم تُشغّل المواصفات أو البناء.

## مطابقة المستهلكين والأحداث

| المسار/العقد | المصدر النهائي والنتيجة |
|---|---|
| قائمة القيد | View للبحث والصفحات والتقرير والتصديرين؛ View مع سياسة الدقة للتفاصيل والطباعة؛ Create/Edit مع مفاتيح bootstrap الفعلية |
| اختيارات القائمة | Branch.Lookup وAsset.Lookup اختياريان؛ يُخفى الفلتر ويُعقم النموذج وapplied/query/URL وReset، وتغلق portals عند السحب |
| الاعتماد | القراءة View؛ القرار View+ManageApproval؛ مالك DocumentApprovalCycle يحتفظ بالسبب والإرسال؛ accessBlocked لانتهاء السياق فقط |
| بقية إجراءات القائمة | View+Log/Journal/Void/Delete بحسب الحدث؛ حالة السطر وعضويته وإعادة فحص grant بعد التأكيد محفوظة |
| المحرر | View+سياسة الدقة للعرض؛ Create أو View+Update مع مصادره التسعة للتحرير؛ يحفظ المسودة عند السحب ويسترد bootstrap الناقصة عند إعادة المنح |
| معاينة العملة | متطلب المحرر+PreviewCurrency؛ حقول الهدف وزر المعاينة وإعادة المحاولة لا تظهر بلا المنحة؛ إلغاء القراءة والتأكيد يغلق portals ويحفظ القيم المقبولة |
| الاستيراد المحلي | CSV/template تحت متطلب المحرر؛ file.text وقرار الإضافة مرتبطان بالنسخة والسياق والوصول، دون مفتاح ImportData مخترع |
| المرفقات | FileField بمتطلب المحرر؛ tracker للرفع Upload+Delete وللتنظيف Delete؛ إزالة صف بملف تحتاج Delete، وmarkRemoved بعد قبول الإزالة فقط |
| التخصيص | View+AllocationLines+AllocationSources+سياسة الدقة للقراءة، ويظهر الحفظ ويرسل فقط مع Allocate؛ المسودة تبقى مع mounted denial |
| روابط المصدر | سياسة الوجهة الفعلية، وإضافة EquipmentSalePreparation.Get لمصدر Fleet الذي يحمل prepareEquipmentId؛ لا فتح عام لمسارات مجهولة |
| المسارات | Journal exact للتقرير؛ JournalVoucher exact للقائمة، وview/details/edit prefixes محددة وcreate exact؛ canDeactivate على القائمة والمحرر، والتخصيص يكشف الحارس للأب |

أعمدة القائمة: no/date/voucherSubType/jobNos/amount/branchName/approvalStatus/isVoided.
ويقابلها ListVM بنفس الحقول، مع id وcanEdit/canDelete/canVoid/canAllocate
وisPosted/isGenerated/sourceKind/sourceId لحالة الإجراءات والمصادر. لم يُضف
حقل إلى DTO أو طلب حفظ. بقيت الأموال نصوصًا عشرية دقيقة وversion ولقطات
العملة؛ لم تتغير الحسابات أو سلطة الخادم أو AutoMapper أو نماذج المجال.

## العمر والتحميل والمطابقة للمالكين

| الاهتمام | الكتاب والمالك الحقيقي | المطابقة المصدرية |
|---|---|---|
| الوصول والأزرار | UI7/26؛ AccessViewPolicyService وRouteAccessPolicyRegistry وActionList | القراءة والكتابة والمصدر منفصلة؛ unknown fail-closed |
| المسودة والقرارات | UI13/28؛ EditableRows وConfirmationDialogService وEditorDialog | التأكيد كسول؛ الملغى false؛ discard محلي جديد بعد denial ممكن؛ لا قطع لتنظيف أُرسل |
| bootstrap والكاش | UI2/22؛ ReferenceLookupBindings وReferenceLookupStatus | clear للربط المنتهي وإعادة bind بعد إعادة المنح؛ لا GET تشغيلي لتعديل grant غير متعلق |
| الإخراج | UI20/21/28؛ ReportPrintService | notifier مباشر للطباعة المؤجلة حتى afterPrint/cancel؛ auto print timer ملغاة عند السحب ولا تعود لمجرد regrant |
| العرض المالي08 والتقرير07 | مالكو FormSection/EditorTabs/EditableCollection/DataTable/ReportPage الحاليون | لا تغيير شكل أو scroll/style أو مالك حسابات؛ قبول المظهر والاتجاه والثيمين معلق |

طلبات القائمة والتقرير والتصدير والتفاصيل وسياسة الدقة ومعاينة العملة
والحفظ والحذف والإبطال تملك LoadingService الصفحة. bootstrap فلاتر القائمة
له start/finalize صريح. bootstrap المحرر يملك loadingLookups الذي يمر من
ReferenceLookupStatus إلى page lookup lease؛ لم يُضف عداد منافس. حوار
التخصيص يملك StateMessage المحلي مع flags، والسجل والاعتماد localReadProgress
داخل EditorDialog، ومتابعة خيارات محتفظة بالبيانات صامتة. query-only
navigation يحفظ أعمار الطلبات وفق المالك المشترك، ولا يثبت الفحص رؤية المؤشر.

القراءة والاختيارات والتقرير والتصدير والتأكيد والملف المحلي تُلغى عند
الرفض/السياق، مع بقاء outer triggers. same-context denial يحفظ reason/draft/
accepted currency؛ تغيير actor/token/tenant/working context ينهي الجلسة
القديمة. cache contextChanges يغطي auth/token والفرع واللغة في المحرر.
sent save/allocate/void/delete/cleanup لا تُلغى بسحب المنحة؛ النتائج والتنقل
المؤجل محروسة بالسياق والنسخة. إعادة المنح أثناء Save ثم فشله تستعيد
bootstrap. إعادة Media.Delete تستأنف تنظيفًا فاشلًا مرة حتى مع حجب المحرر؛
لا إعادة حفظ أو loop بسبب busy/revision غير متعلق. تنظيف سياق قديم لا يُرسل.

## مصفوفة المصادر والكاش

| المصدر الفعلي | التصنيف والمالك |
|---|---|
| Branch/GetSelect وCurrency/GetSelect وCustomer/GetSelect وSupplier/GetSelect وJob/GetSelect | opted-in reference cache؛ BaseService/ReferenceLookupCacheService، finite bootstrap ثم watches منفصلة مع selected IDs وclear عند تغير السياق؛ writers/topics/invalidation تبقى لدى الخدمات المشتركة الحالية |
| Account/GetSelect في التقرير | direct reference بدون opt-in؛ AccountService، لا اختراع watch/cache، يُلغى ويُستعاد وفق Account.Lookup |
| Account/GetPostingSelect وCostCenter/GetSelect وAsset/GetSelect | direct reference حسب الخدمات الحالية؛ bootstrap المحرر أو فلتر الأصل، لا cache جديد |
| Currency/GetFinancialNumberPolicy | direct policy؛ FinancialNumberPolicyService، لا يعامل كمرجع ثابت |
| JournalVoucher GET/GetById/approval/log/journal/allocation-lines/allocation-sources وAccountReports/Journals | direct operational؛ readiness/count/error/Retry محفوظة، بلا cache opt-in |
| JournalVoucher/CurrencyPreview | read-only POST تشغيلي عبر NAVIGATION_READ_ONLY، لا حفظ ضمني ولا cache |
| CSV/FileField/Media | قراءة ملف محلية ورفع/تنظيف عند مالكيها، ليست reference lookups |

متابعة TTL/topics/notification والاحتفاظ بالتسمية وفشل Retry مثبتة من ربط
المصدر ومالكه، وتبقى تجربة الشبكة والفروع الفعلية عند المالك. لا ادعاء بأن
دراسة المصدر قاست سرعة أو أكدت دقة cache runtime.

## الأداء والاستعلام والفهارس

قائمة القيد تحد الصفحة بمئة، وتطبق Count ثم SQL Skip/Take وإثراء وظائف
الصفحة في استعلام مجمع. التصدير/التقرير يقرأ كل الصفحات بحجم100. التصدير
المفصل يبقي قراءة تفاصيل لكل مستند بتوازٍ أقصاه4؛ لم يتغير عقد اكتمال
المخرج أو الفشل الكلي. لا تحميل لكل detail عند عرض القائمة العادية.

وجدت متابعة أداء سابقة غير معدلة: AccountReportsService.GetJournalsAsync
يجلب كل السطور المطابقة إلى الذاكرة قبل فلتر النص/grid ثم التقسيم؛ لذا
صفحة النقل100 لا تحد حجم SQL أو ذاكرته، والتصدير يعيد ذلك لكل صفحة. لم يُعدل
الاستعلام في مهمة إسناد الصلاحيات لأن تغيير تقسيم التقرير/الفلاتر يحتاج
دفعة أداء مخصصة تحافظ على branch effects وcount والتفاصيل المالية.

قُرئت إعدادات JournalVoucherConfig وJournalVoucherDetailConfig؛ لا فهرس
مخصص جديد مقترح في هذه الدفعة: لم تتغير predicates/joins/order، ومشكلة
التقسيم الذاكري لا يحلها index وحده، وتغطية فهارس القاعدة الفعلية وخطة SQL
غير مقروءة. أي اقتراح مفصل لاحق يحتاج قياس الخطط والصفوف والتداخل وتكلفة
الكتابة/التخزين قبل مخطط جديد. لا migration مطلوب لربط الصلاحيات الحالي.

القياس المعلق: نفس tenant/branch scope والفترة وحجم البيانات، cold/warm
network، عدد الطلبات/الصفوف/الزمن والذاكرة وSQL actual plan، مع مقارنة
البحث والصفحات والتصدير الشامل والتفصيلي؛ لم تُسجل أزمنة before/after.

## الأدلة والحدود والتسليم

المراجع المقروءة في التجميد: Speed snapshot28أكتوبر section18/screen12 و
section21/screen19، ثم C1364 وC1362 وC0498 منفصلة؛ S219 لإعداد رقم القيد
فقط. mapping للأحداث الموجودة، مع بقاء clone/approveAll وروابط المرجع
الإضافية فجوات خارج العقد الجاري، دون اختراع endpoint أو permission.
Odoo المحلي متاح لكن لا نقص في مفهوم لازم لربط المفاتيح الحالية. لا
صورة مستخدم جديدة في هذه الدفعة؛ لا ادعاء التكافؤ الكامل مع المرجع.

المواصفات تستخدم القوالب الحقيقية للتقرير والقائمة والمحرر والتخصيص.
تغطي read denial/regrant وwatch rebind وfilter/URL/portals وprint frame/timer
والمعاينة/CSV وdirty exit وAllocate وsent save/cleanup وcontext callbacks.
المواصفات كتبت وفُحصت مصدرًا فقط؛ لم تُشغّل ولا يُدعى RED/GREEN أو قبول DOM.
route registry specs تتأكد من partial grants ومفاتيح bootstrap ومسار البداية.

دليل التطبيق EN/AR محدث في accounts-guide.ts وjournal-vouchers-topic.ts؛
الأول عبر UserGuide/accounts، والثاني عبر record-list-topics ثم
invoice-guide.VOUCHER_GROUP_GUIDES تحت UserGuide/vouchers-journals؛ قارئ
UserGuide/:sectionId وعنصر دليل الوحدة قائمان. توضح الإرشادات منح الأحداث
والاختيارات وعمر السحب وإعادة المنح والمرفقات والمصادر والطباعة والتخصيص.

التنفيذ والمراجعة بأدوار العاملين الحاليين: branch_access_admin للمحرر،
branch_ui_final_review للقائمة والتخصيص، sales_details_adoption لتدقيق
مصدر محدود مستقل؛ النماذج الموروثة دون override جديد. الاستقلال قلل زمن
العمل، والجذر امتلك التجميد والتكامل والإصلاح والمسارات والدليل والجرد.
لم يُنشأ عامل جديد في هذا الاستكمال.

الجرد بعد المصالحة:21operation-confirmed،136resource-only،101unknown،
2context-only و2alias من262بندًا،259اسمًا مميزًا. تُحفظ التكرارات الثلاثة
القديمة خارج هذه الدفعة. الهدف العام active؛ هذه ليست نسبة قبول كل الأحداث.

الفحص النهائي يشمل scoped diff في مستودع الواجهة، والملفات الجديدة مباشرة،
الأنواع/imports وroute/service/DTO/EN-AR وwhitespace/merge markers وفحص
الوصفات. لم تُعدل خلفية في هذه الدفعة؛ راجعت مفاتيح controller/resolver
ومصادر الاستعلام والإعدادات قراءة فقط، فلا namespace/type/mapping جديد.
التغييرات المالية السابقة في الملفات محفوظة ولم تُنسب إلى دفعة الصلاحيات.
لا build/test/lint/browser/DB/migration/snapshot/commit/push/deploy.

فحوص المالك المطلوبة: بناء الواجهة ثم تشغيل المواصفات المركزة، وتجربة
ordinary read/create/edit/preview/approval/allocate/Media منفصلة، سحب وإعادة
المنح أثناء كل قراءة وكتابة وقرار وطباعة، تبديل actor/branch/access context،
وفحص portals/loader والموبايل والاتجاهين والثيمين وHTTP scope والتقارير.

اقتراح commit للواجهة فقط:
`feat(auth): adopt journal report and voucher action access lifetimes`

نتيجة الفحص الأخير المنفذ: git diff --check للنطاق في الواجهة exit0،
علامات الدمج0، والوصفات الثماني OK. أعيدت قراءة JSON:262بندًا و259اسمًا،
وتطابقت metadata مع21/136/101/2/2، واليومية والقيد operation-confirmed.
أضيفت رسالة تغير سياق القيد الناقصة في en.ts وar.ts واستهلكها المحرر
والقائمة والتخصيص. لم يُشغّل أي اختبار أو بناء، وتحذيرات EOL فقط من Git.
