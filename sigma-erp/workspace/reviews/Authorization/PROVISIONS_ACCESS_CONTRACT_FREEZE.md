# عقد تبني صلاحيات المخصصات وروابط بنودها القديمة

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | قائمة ومحرر Provision وحركاته وطباعة السجل وتصدير القائمة، ومصير ProvisionDetail القديم والمتكرر |
| حدود التجميد | المنح وواجهة القراءة/الكتابة وتقاعد المسارات القديمة مجمدة؛ ملكية الفرع لتعريف المخصص تنتظر قرار المالك ولا يُغيرها العامل بالحدس |
| الحدود | Source-only، لا build/tests/typecheck/lint/browser/DB/migrations/snapshots/commit/push/deploy |

## المصدر والمرجع

قُرئت الخطة وعقد PROVISIONS_DOMAIN_API_CONTRACT_FREEZE والمطابقة السابقة
وآخر متابعة الترحيل الشهري. النوع UI02 وBE14: تعريف متوازن بسطور وجدولة
دون قيد عند الحفظ؛ MonthlyPosting مستقل سبق قصره على مدير الشركة لأنه
ينشئ قيدًا بلا فرع. لا إعادة قرار محاسبي أو معادلة schedule أو تخصيص
مبالغ هنا. يُحفظ العقد السابق وDTOs/precision/financial policy وقيود
lease/history وتاريخ child ownership، وجميع البيانات الحالية تجريبية.

قُرئ sidebar Vouchers لقطة٢٨أكتوبر، شاشة16-provisions-provisions، وC1389
المستخرج. يثبت Create/View/Edit/Delete/Transactions/Export وأعمدة الفلاتر
والعرض وروابط تخصيص قديمة؛ لا تثبت grants سبيد JVs نفس مفاتيح Sigma.
فهرس الشرح الأصلي لم يُظهر صفحة مستقلة باسم Provision؛ تبقى screenshots
المصنفة في العقد السابق ودليل Sigma وC1389 أدلة الوظيفة المتاحة، دون
اختراع تفسير مالي من عنوان. Odoo collection مكمل معروف، ولا يحسم سياسة
ملكية فرع لهذا القالب الخاص؛ القرار المرسل للمالك هو المالك.

## المنح المجمدة

| السطح | المتطلب |
|---|---|
| /Provision القائمة/البحث/reset/paging/sort/grid/Excel كامل | Provision.View |
| /Provision/create | Provision.Create + Account.GetPostingSelect + Currency.GetFinancialNumberPolicy |
| /Provision/view/:id وdetails/:id→view | Provision.View فقط؛ لا طلب lookups تحرير |
| /Provision/edit/:id وحفظ PUT | View+Update + Account.GetPostingSelect + Currency.GetFinancialNumberPolicy؛ canEdit الخلفية شرط إضافي |
| حذف صف | View+Delete وcanDelete وهوية object من القائمة الحالية والتأكيد المشترك |
| حركات التعريف | View+Provision.GetTransactions؛ reader read-only صريح، لا Edit لازم |
| طباعة سجل محفوظ | View والسجل المحمل نفسه؛ لا endpoint أو grant Print مصدرية مستقلة حاليًا؛ read/print cancellation وReportPrintSession |
| حفظ وطباعة | متطلب الحفظ، ثم View لاستعادة السجل وطباعته؛ Save بلا View يبقى ممكنًا ويعود لوجهة مسموحة، لا POST replay |
| جهة الاتصال/Customer | Customer.Lookup اختيارية مع متطلب الشاشة؛ لا طلب أو watch دونها |
| جهة الاتصال/Supplier | Supplier.Lookup اختيارية مستقلة؛ يمكن تحميل أحد المصدرين فقط |
| أمر الشغل | Job.Lookup اختيارية في المحرر؛ القيمة المحفوظة تُعرض من detail، ولا تسقط من payload لأن grant الخيار غابت |

الاختيارات الاختيارية لا تمنح فتح شاشتها. الحساب والسياسة المالية required
لتحرير نموذج مالي؛ تعطيلها يمنع بدء/حفظ الكتابة لكنه يحتفظ بالمسودة. لا
إضافة View للإنشاء وحده. النموذج يرسل client fields المثبتة فقط؛ لا audit/
tenant أو first/last/totals أو حالة اكتمال مخترعة.

## العمر والتحميل والكاش

يُراجع كل handler وportal والنقل الفعلي. read cancellation على كل read
ومراقبة الكاش والفلاتر والـexport المركب؛ context/sequence/loaded identity
تمنع النتائج القديمة. watcher بعد completion يلتقط rapid revoke/regrant؛
recoveryPending مستقلة تنتظر busy دون failure retry loop. editor mounted
hidden/inert مع draft وسطورها، ولا route reuse يمحو dirty أو sent mutation.

الكتابات المرسلة مستقلة عن destroy/denied، بـtrackWrite/HttpContext/
CAN_PRESENT_API_OUTCOME وlatch success قبل mayPublish؛ لا إعادة كتابة
عبر Retry أو إحياء draft بعد accepted discard. lazy/cancellable decisions
وlocal discard بعد denial، canRemove/confirm cancel للسطور، deferred
focus/navigation/autoprint محكومة بالممثل والمسار والهوية. Create-only
يخرج إلى وجهة مسموحة أو /access حين لا توجد قائمة مسموحة.

المصادر المباشرة list/detail/transactions/account/policy operational؛ لا
cache جديد. Customer/Supplier/Job مصادر مرجعية opted-in بمالكيها الحاليين:
bootstrap ناجح محدود ثم watch منفصلة، clear على context/grant expiry،
preserve IDs/labels، recovery/Retry/teardown ولا refresh overwrites draft.
required bootstrap يساهم في page loader وفق تصحيح UI22 الأحدث؛ dialogs
حركات uses localReadProgress تحت DocumentJournal. لا spinner ثانٍ، مع
busy/aria/error/Retry. استثناء إخفاء الرسالة الإضافية القديم لا يلغي ملكية
page الأساسية للقراءة الجديدة؛ لا تعديل shared loading contracts هنا.

الخدمة Angular تضيف HttpContext اختياريًا إلى createProvision/
updateProvision/deleteProvision دون تغيير callers القائمة. root يملك
الخدمة والعقود المشتركة والـregistry والتوثيق والدليل؛ العامل لا يعدلها
متزامنًا. API generic مفاتيحه من resolver، وGetTransactions من reviewed
allow-list. لا فهرس أو schema أو financial-number-policy جديدة ضمن المنح.

## مصير المسارات القديمة — جزء مستقل مجمد

شجرة routing.ts تكرر Provision مرتين بنفس producer؛ الأولى الفعالة
والثانية shadow. ProvisionDetail له root أول من Agreements Dashboard2
وثانٍ shadow من Vouchers. كلاهما بلا menu وبأعمدة منتجات ومحرر audit
وPOST غير مالك؛ الخادم ProvisionDetailController يعتمد واجهة بلا تنفيذ
أو DI registration. رأس Provision الحالي هو مالك child add/update/delete
والتحقق والتوازن/history؛ لا سبب لإعادة إحياء CRUD مستقل للبنود.

وفق Master5 G12 يزال root القديم وduplicate root declaration، وimports/
providers الخاصة به وfolders الواجهة الميتة. لا alias يفسر child id كأنه
parent id؛ الرابط القديم يصبح غير موجود، ولا يرجع إلى سجل آخر. يزال
ProvisionDetailController وIProvisionDetailService scaffold غير المنفذ؛
تبقى entity/config/DTOs/mapping المستهلكة من parent aggregate، ولا schema
أو حذف بيانات. تزال guide topics الوهمية فقط ولا ترجمات مشتركة مستخدمة
من parent. صفا ProvisionDetail في الجرد يوثقان retired قبل أي ترقية،
ولا ينقص routeCount أو تتغير counts بلا سياسة reconciliation صريحة.
root يقرر ترقية صفّي Provision المكررين بعد إقفال parent كاملًا؛ لا
تعتبر تنظيف الميت إقفالًا للتعريف.

## القرار المعلق

ApplyProvisionFilters يسمح للعادي حاليًا فقط بتعريف رأسه مرتبط بـJV
يملك فروعه؛ التعريف المستقل الجديد بلا JV يُحجب بعد إنشائه. لا يجوز
معالجة ذلك بتجاوز query filters عام أو تخمين فرع Job. أُرسل للمالك سؤال
تعريف مشترك حسب grants وحركات حسب فروع القيود، مقابل فرع تعريف إلزامي.
تنتظر فقط تغييرات branch/entity/read/write المالي هذا الجواب؛ بقية تبني
المنح وتنظيف المسارات مستقلان. قبول SQL/عرض الحركات الكاملة/الطبعات
وبقية runtime والجرد لا يدّعى قبله.

## الإقفال

نطابق كل surface والمصادر/VM/payload/routes/الحقول مع guide ثنائي اللغة
في provisions-topic.ts ومساره /UserGuide/vouchers-journals، ثم scoped diff
ومواصفات غير منفذة/parsing/import/XML/recipe checks. نثبت أداء count/page/
projection/child joins/transactions/index evidence دون اختراع قياس.
لا ترقية لوحدة parent وفيها قرار branch مادي أو action غير محمي.

## ملحق المالك المشترك — قارئ الحركات

فحص source الحالي أثبت أن DocumentJournal يفتقد inputي accessRequirement
وlocalReadProgress المذكورين في خطة الاستهلاك؛ قارئ dialog فقط مع مؤشر
محلي فعلي. يوسعه root في مالكه القائم، دون wrapper جديد: requirement
اختيارية لإبقاء المستهلكين غير المتبنين على عقدهم، localReadProgress=true
افتراضية تحفظ مؤشر dialog الحالي. finite read/callback/Retry/focus تتبع
هوية السجل والممثل؛ explicit expiry يلغي القراءة ويمسح النتائج ويغلق
القارئ disposable، وإعادة الفتح تنشئ سياقًا جديدًا. لا draft أو write هنا.
يدعم false فقط لاستعمال page progress ملتقط في بداية الاشتراك، مع
finalize واحد. قوالب EditorDialog تستهلك requirement وblocked الحقيقيين.
تُكتب مواصفات مصدرية ويحدث UI22/المهارة والحزم معًا قبل تسليم الشريحة؛
لا API أو مبلغ/دقة/جدول/منحة جديدة ولا ترقية لباقي consumers بلا مراجعتها.

## قرار المالك وتطبيق النطاق — ١٠ نوفمبر ٢٠٢٦

فوّض المالك اختيار الأنسب وتطبيقه بعد السؤال المرسل. يُعتمد التعريف
المستقل مشتركًا داخل الشركة حسب grants لأنه قالب متوازن لا ينشئ قيدًا
عند الحفظ؛ لا BranchId جديد. هذا يحل القرار المعلق أعلاه ويسبق وصفه
التاريخي دون محوه. الترحيل الشهري يظل للمدير حسب العقد السابق.

تعريفات LeaseAgreement التابعة تبقى تحت tenant ونطاق الاتفاقية المالكة؛
ليست مبررًا لكشف اتفاقيات فروع أخرى. التعديل والحذف منها يبقيان مغلقين
بcanEdit/canDelete وIsLeaseOwned في خدمة Provision، ويملكها محرر الاتفاقية.
بنود التعريف وجدول مواعيده يتبعان نفس الأب. لا label/Job فرع مخمن ولا
IgnoreQueryFilters لتوسيع القراءة. النتائج الخاصة بحركات JV تتبع
WholeDocumentReads لكل قيد؛ المستخدم يرى جميع سطور القيد المسموح كاملًا
أو لا يراه، ولا يتاح قيد غير مثبت الفرع للعادي. لا يغيّر التعريف المشترك
فرع JV تاريخيًا أو يمنح تسجيل حركات ضمنيًا.

تُزال حراسة Provision العامة التي تستنتج فرع القالب من JournalVoucher؛
ويُعالج مسار SaveChanges/set-based الفعلي حتى يستطيع العادي ذو Create/
Update/Delete حفظ تعريف مستقل بلا JV دون null journal denial. تبقى
حراسة tenant والأب وهوية البنود/تبديل الأب ووجوده؛ JV موجودة تُحرس
بصلاحيات فروعها المعتادة ولا يجوز تجاوزها. لا تُضعف validator العامة
للـnull journal على باقي المصادر. لا علاقة جديدة أو migration/snapshot/
backfill، ولا تغيير schedule/money/financial state.

مواصفات مصدرية مطلوبة: standalone بلا JV ظاهر للعادي ونطاق tenant/live،
lease-owned يتبع الأب، children تتبع parent، create/update/delete standalone
بلا حظر فرع وهمي مع حفظ tenant/concurrency، الحركات عبر قيد مسموح وقيد
غير مسموح ومتعدد الفروع لا يعرض جزئيًا. قبول SQL/runtime عند المالك.

تُعرض حالة اكتمال غير معروفة إذا كان موعد مرتبط بقيد لا يمكن قراءة
دليله في النطاق الحالي؛ لا نحول غياب navigation المحجوبة إلى ادعاء أن
القيد غير مرحل، ولا نفتح قيده لمجرد إظهار status. يبقى جدول المواعيد
وهوياته الداخلية للحراسة، ولا تُصدر أرقام قيود غير مسموحة في DTO.

سياسة الجرد عند الإقفال: صف Provision الأول يمثل route الفعالة ويُرقى
وحده عند اكتمالها. الصف الثاني يسجل duplicate root الذي أزيل، ويُوسم
retired-source-only وتُزال candidate keys منه مع بقاء status التاريخية
resource-only وrouteCount=263. لا نزيد operation-confirmed مرتين لنفس
المستهلك. صفا ProvisionDetail يظلان متقاعدين كذلك؛ يُعد كل tombstone
ضمن retiredSourceOnlyCount المستقل، ولا يعني ذلك شاشة أو grant نشطة.
