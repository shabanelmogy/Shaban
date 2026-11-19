# تسليم صلاحيات قائمة المخصصات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | PROVISIONS_ACCESS_CONTRACT_FREEZE.md، Frozen |
| النطاق | Provision/components/list فقط؛ المنح والفلاتر والاختيارات والحركات والتصدير وحذف الصف |
| قرار الفرع | معلق عند المالك، ولا يغيره هذا التنفيذ أو يثبت اكتمال الوحدة |
| التكامل | عند الجذر؛ لا ترقية للجرد أو هدف الصلاحيات بواسطة هذا العامل |

## الملفات والملكية

تغيّرت TS وHTML ومواصفة smoke القديمة في:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Vouchers/Provisions/Provision/components/list/`

وأضيف `list-access.spec.ts`. بقي SCSS دون تعديل. لم يُعدّل العامل service أو
access keys أو registry أو route أو shared أو vocabularies أو guide أو backend.
حُفظت تغييرات الجذر والزملاء. Root جهز HttpContext لحذف المخصص، ومدخلي
DocumentJournal.accessRequirement/localReadProgress وسياج القراءة/التركيز،
ووافق على بقاء contactId كرقم مرشح دون كشف label أو طلب مصدر غير ممنوح.
أضيفت ترجمة provisionScreen.contactSelectionUnavailable في ملكية الجذر.

## المنح والأفعال والقرارات

| السطح | المطابقة المصدرية |
|---|---|
| القائمة والبحث/reset/paging/sort/grid/Excel | Provision.View؛ كل handler يعيد الفحص، shell mounted hidden/inert وvisibleRows مقيدة بممثل النتائج |
| الإنشاء | زر القائمة يحتاج View وCreate+Account.GetPostingSelect+Currency.GetFinancialNumberPolicy؛ استقلال route Create-only عند الجذر |
| العرض | View مع exact row object membership والهوية الموجبة؛ لا navigation لصورة clone تحمل المعرف نفسه |
| التعديل | View+Update+المصادر المطلوبة وrow.canEdit؛ لا grant من اسم الدور أو أهلية backend وحدها |
| الحذف | View+Delete+canDelete وعضوية الصف؛ تأكيد مشترك lazy/cancellable، مع إعادة فحص الممثل/المنحة/الهوية/الأهلية قبل إرسال DELETE |
| عمر الحذف المرسل | trackWrite/HttpContext/CAN_PRESENT_API_OUTCOME؛ لا denied أو destroy بعد الإرسال. latch actor/id قبل mayPublish، فلا تعاد كتابة نجحت من stale regranted results |
| ما بعد الحذف | recoveryPending تنتظر finalize/deleting=false ثم تقرأ مرة؛ تصحيح الصفحة الفارغة يحافظ على Count الخادم ولا يطلب داخل next مشغول |
| فشل الحذف | envelope/HTTP feedback محلي، ومحاولة مستخدم صريحة دون replay/refresh loop |
| حركات التعريف | View+Provision.GetTransactions مستقلة عن Update؛ row identity +journalOwner، wrapper يلغي GET، watcher يغلق الحوار فور expiry حتى بعد اكتمال الرد |
| الحركات المشتركة | DocumentJournal accessRequirement وlocalReadProgress=true من مالكه الذي جهزه الجذر؛ لا reader موازٍ أو تحويل مالي |
| المغادرة | canDeactivate():boolean يمنع المغادرة أثناء قرار الحذف/الكتابة/Excel. أُبلغ الجذر لربطه بمسار القائمة في ملكيته |
| الـportals والتركيز | select/date overlays تغلق عند expiry/context/destroy، وDataTable وحدها تفك عند رفض View لإنهاء filter portals مع بقاء shell mounted. focusField لخطأ التاريخ محكوم grant/owner/destroy |

## الفلاتر والقيم والمصادر

تبقى أعمدة القائمة الستة: No/EntryDate/Title/DayOfMonth/NumberOfMonths/
IsCompleted. DTO الحالي يضيف Id وcanEdit/canDelete اللازمة للأفعال؛ لا تغيير
VM أو مالي أو حالة اكتمال من عامل القائمة. التوازن والجدولة وprecision
والعلاقة مع JV وملكية الفرع لم تتغير.

يحفظ no/title/date range/contactId/isCompleted وgrid، مع فصل applied عن raw
draft. يقرأ state من URL ويعيد applied عند paging/navigation/export. false
لا يسقط، وsort مقيد بالأعمدة القابلة له ويعيد الصفحة الأولى مثل grid جديد.
تستعمل القائمة pageNo/pageSize وCount الخادم دون local filter على صفحة
مبتورة؛ pagination request bounded حتى١٠٠ كما النقل القائم. تصحيح صفحة
أصبحت خارج العدد ينتظر finalize ويشمل total=0، ولا يخفي عددًا جديدًا.

| المصدر | التصنيف والعمر |
|---|---|
| Provision GET/getList | operational مباشر، page loader +owner/sequence وdenied/destroy cancellation |
| Provision getAllList | كل صفحات Excel من مالك fetchAllPages الحالي، query applied مثبتة، cancel مركب وpage loader؛ لا cap جديد أو row GET |
| Customer/GetSelect | cacheSelect opt-in مثبت في CustomerService؛ فقط مع View+Customer.Lookup |
| Supplier/GetSelect | cacheSelect opt-in مثبت في SupplierService؛ مستقل مع View+Supplier.Lookup |
| كل اختيار مسموح | bootstrap محدود ناجح ثم ReferenceLookupBindings watch منفصلة؛ invalidation بمالك المصدر، selected ID/label retention عند refresh، clear/unbind على انتهاء الوصول/السياق وRetry/teardown |
| مصدر اختيار فاشل | خطأ مستقل لا يمحو نجاح الآخر ولا يمنع قائمة المخصصات؛ لا watch قبل نجاح bootstrap، ولا error retry loop |
| GET Transactions | قراءة تشغيلية محلية للحوار، لا reference cache جديد؛ نطاق الفرع/الحركات الخلفي عند الجذر والعقد المعتمد |

إذا لا يوجد مصدر Customer/Supplier ممنوح، لا GET ولا watch ولا label
مخترقة/مختلقة. يبقى contactId الرقم القادم من URL أو المرشح السابق
raw/applied/URL كما وافق الجذر؛ picker disabled ورسالة تطلب إعادة الاختيار
عند الحاجة، وReset يمسحه. عند سحب مصدر تُمسح خياراته فورًا حتى لو الآخر
بقي متاحًا. الاختيارات لا تمنح فتح شاشة العميل/المورد.

مصادر الاختيارات مستقلة بدل forkJoin شامل؛ فشل Supplier لا يخسر Customer.
النجاح يحتفظ بالتسمية المختارة عبر ReferenceLookupBindings، والمصدر الجديد
لا يمسح اختيارات المستخدم أو applied query. بقاء primitive ID لا يمنح قراءة
label عبر endpoint محجوب، ولا يغيّر شروط backend للفلترة التشغيلية.

## انتهاء الوصول والاستعادة والتحميل

watcher القائمة يبقى بعد انتهاء GET، وvisibleRows تغلق فور تغير owner أو
View قبل effect. تمسح expiry النتائج وتغلق الحركات والـportals. actor/context
جديد يمسح raw/applied/grid/sort/page وquery URL القديم قبل bootstrap جديد.
rapid revoke/regrant تستخدم interrupted، وrecoveryPending مستقلة تنتظر
انتهاء delete/export/list/dialog busy ثم تستهلك قراءة واحدة؛ لا HTTP loop.
watcher مستقل لكل مصدر اختياري يلتقط نفس الحالة حتى بعد bootstrap مكتملة.
لكل مصدر اختياري recoveryPending مستقلة كذلك؛ تسجل الاستعادة قبل محاولة
التحميل وتنتظر تحرير busy للقراءة القديمة، فلا تضيع regrant بين إشعار expiry
وfinalize. تُستهلك المحاولة قبل GET، ولا يعيد فشلها تسليحها عند busy لاحقة.

list/export/initial optional lookup GET كل منها يملك startLoading واحدًا
وfinalize مطابقًا في مالك الصفحة؛ بقي table.showLoadingIndicator=false
ولا loading StateMessage منافسة. ReferenceLookupStatus يعرض الأخطاء/Retry،
وتحديث lookup cache المحتفظ ببياناته صامت عبر المالك المشترك. حركات الحوار
تستخدم local progress. هذه مطابقة wiring فقط، ولا تدعي الظهور/التوقيت runtime.

## التحقق والأدلة والحدود

قُرئ العقد المجمد كاملًا ومصدر القائمة ونقل Provision الحالي وDTO القائمة
ومالكو Customer/Supplier/ReferenceLookupBindings/DocumentJournal والأفعال/
الوصول/التركيز/التحميل. تعليمات Sigma ومهارته وAngular وUI2/UI10/UI14/UI22/
UI28 ذات الصلة استُهلكت؛ دليل سبيد/شرح غيابه المستقل وأكواد C1389 وأولوية
Odoo مسجلة بعقد الجذر؛ لا قرار فرع أو صيغة مالية استُنبطت من frontend مرجعي.

أضيفت٢٩مواصفة وصول مصدرية وعدلت smoke إلى denied no-request؛ **المجموع٣٠
مواصفة غير منفذة**. تغطي grants/row eligibility/identity، المصادر الاختيارية
والـwatch الجزئي والحرمان، URL contactId بدون طلب، actor clearing، read
cancel/regrant/HTTP failure، applied export cancellation، false/grid/sort/
paging/count، transaction expiry، lazy decision cancellation، sent latch/
outcome/no replay/refresh بعدfinalize، exit safety، selected-label retention
والتركيز المؤجل. لا نتائج tests أو RED/GREEN مدعاة.

فُحص TS/Angular HTML parsing ووجود local imports لأربعة ملفات، problems=[]؛
وروجع scoped diff كاملًا في مستودع الواجهة وملف المواصفات الجديد مباشرة
لأنه untracked. diff --check نظيف، ولا merge markers. namespaces C# لا
تتغير في الملكية؛ symbols/model/service public signatures المتاحة فُحصت.
هذا لا يثبت type checking/build أو SQL أو متصفح.

لا قياس سرعة أو SQL/IO من التنفيذ. لا cache/فهرس/schema/migration جديد.
عدد الاستعلامات/حجم كامل Excel ومقارنة cold/warm ومخطط الخادم وفهارسه
عند الجذر/المالك؛ إزالة قراءة محجوبة لا تثبت تحسنًا مقاسًا. guide/registry/
routes والجرد والمطابقة النهائية ملكية الجذر. **قرار ملكية فرع Provision
معلق ولا تُغلق وحدة parent بسببه من هذا التسليم.**

لم تُنفذ builds/tests/typecheck/lint/browser/DB/migrations/snapshots/commits/
push/deploy أو Graphify/Sigma MCP/full-solution scan، ولم تُنشأ agents جديدة.
القبول المعلق: البناء والمواصفات والمنح/السياقات السريعة والـlookups والجدول/
الأحمال وExcel والحركات الكاملة وSQL/RTL/themes/mobile عند المالك بالنهاية.

شملت مراجعة الجذر المرحلية فجوة استعادة اختيار مشغول قبل finalize؛ أصلحت
بمالك recoveryPending مستقل لكل مصدر، وأضيفت حالات pending async regrant،
وانتظار تحرير busy، وفشل recovered lookup دون loop. فُصلت حراس التحميل
والأفعال وcallbacks متعددة الخطوات إلى أسطر مقروءة وفق G10 قبل التسليم.

رسالة commit مقترحة عند دمج المالك:

`fix(provisions): enforce list access and independent action lifetimes`
