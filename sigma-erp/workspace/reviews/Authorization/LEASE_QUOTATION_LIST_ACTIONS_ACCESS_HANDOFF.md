# تسليم صلاحيات قائمة عروض التأجير وإجراءاتها

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| الشريحة | القائمة والإجراءات، حوار الرفض، حوار إنشاء الاتفاقية والـroutes |
| العقد | LEASE_QUOTATION_ACCESS_CONTRACT_FREEZE.md |
| العامل | fleet_alerts_final_audit؛ الملكية المحددة من الجذر، دون وكلاء فرعيين جدد |
| إقفال الوحدة | ينتظر تكامل الجذر والتدقيق المستقل ودليل التطبيق؛ لا ترقية للجرد من هذا التقرير |

## الملفات والحدود

عُدلت سبعة ملفات إنتاج ضمن الملكية: قائمة العرض وHTML، حوارا الرفض
والاتفاقية وHTML، وleasequotation.routes.ts. أُضيفت ثلاثة ملفات
list-access.spec.ts وrejection-dialog-access.spec.ts
وmaster-agreement-dialog-access.spec.ts داخل مجلداتها.

لم تُعدل details أو خدمات/helper/registry/backend/models أو PO أو
المكونات المشتركة أو المفردات أو دليل التطبيق؛ يملكها الجذر والزملاء.
حُفظت تغييراتهم المتوافقة، ومنها إزالةCustomerId منListDTO؛ أصبحfixture
القائمة مطابقًا. واجهة الرفض تستخدمquotationId/rejectionType وsaved بدل
write في الأب؛ قائمة العرض هي المستهلك الإنتاجي الوحيد في نطاق الميزة.

## العقد والمصالحة

| السطح | النتيجة المصدرية |
|---|---|
| القائمة والبحث وإعادة التحميل والفلاتر والصفحات والفرز والتصدير والطباعة | View صريح مع actor/current owner؛ الجدول disposable، وباقي host hidden+inert عند المنع |
| الإنشاء | create requirement منhelper، مستقل عنView؛ زر القائمة يتبع المنحة والتنقل المسموح |
| التحرير والحذف | exact row object+current owner+grant+canEdit/canDelete+nonbusy؛ قرار الحذف lazy وقابل للإلغاء ويعيد الفحص قبل الإرسال |
| الموافقات الداخلية/المراجعة/إلغاء الاعتماد | manageApproval مع العلم الحالي؛ لاUpdate مصطنعة |
| موافقة/رفض العميل | manageCustomerApproval مع العلم الحالي؛ لا منح داخلية إضافية |
| الرفض | reason مشذبة٥–٥٠٠، session/id/type ثابتة، write داخل الحوار، نجاح نهائي قبلmayPublish |
| إنشاء الاتفاقية | View+Master.Create، fresh quotation detail وexact entity.id،source/customer canonical؛ لاMaster.View؛ احتفاظ بالتواريخ/الملاحظات عبرregrant |
| إنشاء أمر الشراء | accessRequirement الكامل منhelper يمر إلى المحرر المضمن معcanCreatePurchaseOrder؛ لاPO.View ولاmedia mandatory جديدة |
| التراجع والخروج | public canDeactivate لكل حوار؛ الأب يفوض الطفل الفعال مرة؛ discard محلي متاح بعدdenial وقبوله نهائي |
| تبدل الحساب/السجل | المسودة mounted ومخفية؛ expiry نهائية حتى لو عادactor القديم سريعًا؛ لاhydrate أوoutput من الجلسة السابقة |
| الأفعال المرسلة | trackWrite+HttpContext/CAN_PRESENT_API_OUTCOME، مستقلة عنdenied/destroy؛ success latch قبلmayPublish، لا replay/toast/refresh قديمة |
| استرجاع القائمة | watcher وصول مستقل بعد اكتمال القراءة، يعاد تسليحه للrapid revoke/regrant؛ ينتظرmodal وsent-child busy tail |
| المسارات | root/create/view/edit/details كلهاshowPageLoading=true؛ details alias قراءة فقط كماmode السابق |

الأعمدة هيNo،Date،CustomerName،CustomerCode،internalApproval،
customerApproval. وهي حقولListDTO المعروضة نفسها؛ الباقيId وflags
الأفعال فقط. مرشحCustomerId باقٍ ضمنquery، وليس سببًا لإرجاعه فيListDTO.
لا تغييرapproval tuple أوfinancial policy أوrates أوsource calculations.

المصادر الوظيفية هي التي جُمّدت في العقد: Speed S182/c555b4b275c5325e
وS222/ec4ae78bcbccc986 بتاريخ٢٧أكتوبر، ثمsidebar10-lease/05-quotations
ودورةC0878 بتاريخ٢٨أكتوبر؛ أثبتت الحقول والإجراءات والروابط وحالاتها،
ولم تُتخذfrontend declarations كقاعدةserver أوحسابات. Odoo المكمل
لا يغيرmonthly-rates/source-PO المعتمد. لا screenshot جديدة؛ gaps
الـcalculations/process/log خارج هذه الشريحة كما العقد وليست أفعالًا مختلقة.

## المالكون والتحميل والذاكرة والأداء

| العملية/المصدر | التصنيف والمالك | العمر والنتيجة |
|---|---|---|
| LeaseQuotationService.getList / GET LeaseQuotation | operational direct، page LoadingService | switchMap؛ captured filters/sort/page؛ denied/context/sequence/destroy؛ زوجstart/finalize واحد |
| التصدير الكامل | operational composed paging، page owner | snapshot منapplied query؛ pageSize٢٠٠؛ cancel قبلoutput عندexpiry؛ no raw unsent filter leak |
| CustomerService.GetSelect عبرgetCustomers | opted-in reference cache | finite bootstrap عندView+Customer.Lookup فقط ثمReferenceLookupBindings watch مستقل؛ selected label/draft محفوظة؛ Retry صريح؛ لاfailure loop |
| Customer retained refresh | نفسsource/cache owner | silent؛ shared invalidation/watch contract باقٍ؛ actor reset يمسحالخيار والـquery |
| getDetail للاتفاقية | operational direct fresh source | local StateMessage تحتEditorDialog؛ exact identity؛ initial read وregrant فقط؛ cancel/close/destroy؛ لاcache جديدة |
| الحذف والموافقات والرفض وmaster POST | page LoadingService | start داخلdefer وfinish/finalize، بدونlocal saving overlay ثانٍ؛busy/disabled/aria-busy محفوظة؛ sent outcome مستقل |
| confirmation وdiscard | decision فقط | لاrequest loader أثناء انتظار القرار؛focus/body portals خاضعة للمنحة/session |

لاper-row reads أوطلب تلقائي بلا منحة؛ لاschema أوindex جديد لهذه
الشريحة، لأن predicates/query producers لم تتغير ضمن الملكية.
الأداء الفعلي وSQL plan/index measurement يتبعان تسليمbackend والجذر؛
لم تُقاس سرعة من تقليلcall أوتبنيloader/cache. تجربة المالك لاحقًا تقارن
نفسtenant/filters/page/network وتفحصطلباتdropdown/regrant/export.

## التحقق الفعلي وحدوده

نُفذRecipe -Check في التسليم: الحزم الثمانيOK.
نُفذTypeScript AST parse لسبعةملفات (أربعةإنتاج وثلاثةspec) دون
parse diagnostics، وAngular parseTemplate لثلاثةقوالب دون أخطاء.
طُوبقتimports المحلية عبرmodule resolution دونmissing أوpossible-unused
imports، والbindings الجديدة تقابلinputs/outputs الفعلية.
رُوجعتscoped diffs فيمستودعAngular، ولاmerge markers أوwhitespace
findings منdiff --check. هذه فحوصsource، وليستbuild أوtypecheck.

كُتبت٥٩حالةsource: ٢٥للقائمة،١٦للرفض،١٨للاتفاقية. تغطي المنح المستقلة،
exact rows/flags،approve→revise→approve،قراءاتpending/completed،
rapid revoke/regrant، optional lookup/selected label/failure، applied query،
إلغاءconfirmation،independent sent success/failure/destroy،terminal
discard،مراجعةfresh source،deferred focus،route child guard وdenied
rendered host. لم تُشغلspecs؛ لاclaim بمرورrunner أوcompiler أوbrowser.

لم تُشغل أوامر البناء أو الاختبارات أو فحص الأنواع أو اللنت أو المتصفح أو قاعدة البيانات أو الهجرات أو snapshots أو النشر أو أوامر commit/push.
لم يُستخدم Sigma MCP أو Graphify، ولم يُفحص الحل كاملًا. طُبقت مهارة Sigma والعقد المجمد؛ مهارات Superpowers متاحة مصدريًا وتكمل التنفيذ والمراجعة مع أولوية الفحص المصدري. لا حاجة إلى هجرة من هذه الشريحة، ولا تعديل على AutoMapper أو حسابات المجال.

## المتبقي للجذر والمالك

يُستكمل التدقيق المستقل، ثم إصلاح ملاحظاته إن ظهرت؛ ويتولى الجذر تكامل أمر الشراء المحروس والمحرر والخلفية وسجل المسارات والمفردات ودليل التطبيق وفق الملكيات المحددة. موضوع عروض التأجير في دليل وحدة التأجير يحدّثه الجذر ليشرح المنح والتحويلات الفعلية؛ لم يكتب العامل دليلًا موازيًا. لا يوجد قرار تجاري مادي جديد معلق في هذه الشريحة.

يظل قبول المالك المجمع معلقًا: البناء وتشغيل المواصفات عند التصريح، وتجربة مستخدمي العرض فقط والإنشاء فقط ومنح الموافقات وإنشاء المستند التابع ومدير الشركة. وتشمل التجربة سحب وإعادة المنح بسرعة وتغيير الحساب والفرع أثناء القراءة والقرار والحفظ، والخروج أثناء الطلب المرسل، والنوافذ والتركيز والاتجاه العربي والسمات والصفحات والتصدير. هذا التسليم لا يعلن إقفال صلاحيات التطبيق كله.

رسالة commit مقترحة فقط لمستودع Angular:

feat(authorization): guard lease quotation list and action dialogs

## متابعة تدقيق ربط التوليد — ١٠ نوفمبر

أُضيف الربط الاختياري بمالك توليد البيانات المشترك إلى حواري الرفض
والاتفاقية: callback ثابت يمنع نشر القيم خارج جلسة الحوار أو بعد
نجاح/تجاهل نهائي، ويشترط جاهزية مصدر الاتفاقية. notifier دائم يجمع
تغير هوية الحوار وإلغاء المخرجات، ويبقى مشتركًا بعد اكتمال التوليد
حتى يُلغي المعاينة المنتهية عند سحب المنحة أو تغيير الحساب/المستند.
إشعار سحب المنحة مستقل عن notifier عمر الحساب، فلا يزيل مراقبة
انتهاء المالك. لا يغير ذلك عمر طلب حفظ أُرسل بالفعل.

وحُدّد سبب الرفض بين خمسة وخمسمائة حرف بعد تشذيب المسافات الطرفية،
مطابقًا للتحقق الخلفي في LeaseQuotationService.RejectAsync؛ أُزيل قيد
maxlength الخام من textarea واستُبدل التحقق الخام بالتحقق المشذب.
المواصفة المضافة تثبت قبول خمسمائة حرف مع مسافات طرفية، مع بقاء
الحالات الأقصر والأطول مرفوضة. حالات الربط الجديدة تغطي انقضاء
هوية الحوار وسحب المنحة بعد اكتمال المصدر والنجاح النهائي.
المجموع المصدرّي الآن ٥٩ حالة غير مشغلة؛ فحوص parser/import/template/
diff فقط. يظل تدقيق المالك المشترك والقبول التشغيلي عند الجذر.
