# مراجعة صلاحيات طلبات الأصناف — البند ١٦١

| البند | القيمة |
|---|---|
| التاريخ | 2026-11-13 |
| الحالة | عولجت الملاحظات التسع في المصدر؛ نجح البناء وفحص تجميع المواصفات، والقبول السلوكي وSQL معلّق |
| النطاق | `ItemRequisition`، القائمة والإنشاء والتعديل والصرف وطلب الشراء والتقرير وExcel، وتكامل اعتماد إذن الصرف الناتج |
| أساس تحديد البند | ملف المطابقة الحالي وصف ١٦١ في التغطية يسميان طلبات الأصناف. تسليم أقدم يسمي ١٦١ أنواع الأصناف ويؤخر الطلبات إلى ١٦٢. اعتمدت تسمية ملف المطابقة الأحدث لهذه المراجعة. |
| العقود | [عقد صلاحيات طلبات الأصناف](ITEM_REQUISITION_ACCESS_CONTRACT_FREEZE.md) · [مطابقة التنفيذ](ITEM_REQUISITION_ACCESS_RECONCILIATION.md) |
| الجرد وقت المراجعة | 160 عملية مؤكدة من أصل 263، و47 محدد المورد و50 غير محسوم وبندان للسياق و4 روابط تحويل |


## سجل معالجة ملاحظات المراجعة — ١٣ نوفمبر ٢٠٢٦

هذا السجل يخص الملاحظات التسع الأصلية المحفوظة أدناه لتتبع الإصلاح.
التحقق السلوكي والتكامل مع SQL Server منفصلان عن مراجعة المصدر والبناء.

| الملاحظة | المعالجة في المصدر | دليل التحقق أو المتبقي |
|---|---|---|
| ١ — اعتماد الصرف من مصدر للقراءة فقط | بعد إثبات المصدر وكل بنوده وتطابق أمر العمل، يقرأ الاعتماد مرجع أمر العمل المحفوظ على مستوى الشركة مع استمرار قيد الشركة والحذف المنطقي. يظل التسجيل على فرع الإذن، والإنشاء المستقل لا يأخذ هذا الاستثناء. | مواصفة تصل في الاعتماد إلى فحص نقص المخزون بدل رفض أمر العمل، وأخرى ترفض أمر عمل لا يطابق المصدر. دورة إنشاء ثم اعتماد ناجح تحتاج SQL. |
| ٢ — فقد المسودات | تحديث أهلية المصدر مستقل عن تهيئة النموذج. تبقى قيم المستخدم وهوية صفوفه وحالة التعديل؛ وتتحدث حدود الكميات المتبقية في الصرف والشراء دون حذف المدخلات. | مواصفات السحب والاستعادة في المحررات الثلاثة، وانخفاض المتبقي أو اختفاء بند المصدر. |
| ٣ — عرض وطباعة طلب الشراء | ملكية قراءة المستند المحفوظ تشمل منحته الخاصة والسياق والجلسة وإصدار الوصول. إلغاء القراءة والإطار المنتظر وإعادة الفحص قبل الطباعة؛ سحب المنحة يمسح المستند. | مواصفات سحب `PurchaseRequests.View`، رفض الرد المتأخر، وفحص إطار الطباعة النهائي. |
| ٤ — هوية التقرير والطباعة المفتوحة | تتضمن نسخة الصفوف إصدار الوصول وجلسة الدخول. يُلغى الإطار المنتظر، وتؤجل إعادة القراءة إلى `afterPrint` ما دام الوصول قائمًا؛ الرفض الفعلي يمسح البيانات الخاصة. | مواصفات إصدار جديد بنفس المنح، ورد قديم، وطباعة منتظرة مقابل طباعة يملكها المتصفح. |
| ٥ — الإنشاء فقط | الإغلاق بعد الحفظ أو التجاهل ينتقل مرة واحدة إلى القائمة لمن يملك العرض، وإلا إلى وجهة مسموحة من سجل المسارات. | مواصفة مستخدم الإنشاء فقط مع منع تكرار الانتقال. |
| ٦ — نتائج الكتابة | شرط الإشعار يحفظ منحة العملية وإصدارها وجلسة الدخول والسياق. تبقى الطلبات المرسلة مستقلة عن إلغاء القراءة، وتستقر المسودة الأصلية دون إعادة POST أو نشر نتيجة في جلسة جديدة. | مواصفات سحب العملية واستعادتها، وتجديد التوكن داخل نفس الجلسة مقابل تسجيل دخول جديد، وانتهاء المكوّن بعد إرسال الطلب. |
| ٧ — فلتر النتيجة الفارغة | يُحلل فلتر الجدول المشترك ويُفحص مخططه قبل اختصار النتيجة الفارغة، بلا استعلام إضافي. | مواصفات حقل غير مسموح وJSON تالف وقيمة عددية غير صالحة مع مرشح أولي لا يطابق سجلات. |
| ٨ — صحة المواصفات | تهيئة مستقلة عن المستخدم المقيد، اختيار المورد والمفتاح في الكتالوج، اعتماد صرف الاستهلاك المخفي، تصحيح بدائل المصادر وتهيئة العملة وحارس الخروج أثناء الإرسال. | أربع حالات حفظ معلّمة `Skip` بسبب اعتمادها على معاملات وأقفال SQL؛ لم تُستبدل بحدود حفظ إنتاجية وهمية. تشغيل المواصفات نفسها معلّق. |
| ٩ — توثيق العقد | تصحيح GET الجذر وDELETE بمعامل `id` واسم المرشّح، وتمييز رفض المستخدم العادي 403 عن نتيجة الخدمة 405 للمدير، وفصل طرائق الخدمة الداخلية عن المنافذ. | حُدّث الاكتشاف والعقد والمطابقة والدليل داخل التطبيق. لا تغيير في الترقيم التاريخي أو تعداد الجرد. |

### قرارات وحدود هذا الإصلاح

- القرارات المعتمدة A1/A2/A3 ثابتة. لا منح جديدة ولا توسيع عرض فروع المصدر.
- الاستثناء خاص بمرجع أمر العمل المثبت في إذن مولد من طلب أصناف؛ يظل فحص
  المصدر والفرع والنشاط والمخزون والكميات في مواضعه.
- لا تعديل على أعمدة الجدول أو ListVM أو الحسابات المالية أو AutoMapper؛
  لا مخطط جديد ولا هجرة ولا فهرس مطلوب لهذا الإصلاح.
- لا نداء HTTP أو SQL إضافي عند فحص فلتر النتيجة الفارغة؛ القراءة المحدودة
  لمرجع أمر العمل تستبدل التحقق السابق. القياس الفعلي للزمن والاستعلامات معلّق.
- دليل التطبيق: موضوع طلبات الأصناف في
  `src/app/modules/UserGuide/content/stock-guide.ts` داخل دليل المخزون القائم.
- جرى تقسيم التنفيذ بين محررات الطلب/الصرف/التقرير، ومحرر طلب الشراء،
  ومواصفات الخادم؛ تولى الوكيل الرئيسي الخادم ودمج العقود والمراجعة والبناء
  والوثائق. الملكية منفصلة لتقليل تداخل التعديلات؛ لم تُمس التغييرات الأخرى.
- رسائل التثبيت المقترحة فقط:
  للخادم `fix: align requisition issue approval scope and filter validation`،
  وللواجهة `fix: preserve requisition drafts and fence access lifetimes`.

### قبول المالك المتبقي

١. طلب مصدره فرع للقراءة فقط، إنشاء صرف في وجهة قابلة للتسجيل ثم اعتماده
برصيد كافٍ ومنحة اعتماد، مع رفض أمر عمل مزور ووجهة غير مسموحة.
٢. تعديل مسودة في كل محرر، سحب المنحة ثم استعادتها؛ بقاء المدخلات مع منع
كمية تجاوزت المتبقي المحدث. تأكيد تجاهل بدأ قبل تغيير الصلاحية ينتهي بالرفض،
ويمكن بدء تجاهل محلي جديد بعد المنع.
٣. سحب عرض طلب الشراء قبل وصول القراءة وقبل إطار الطباعة، وتغيير المنح
أثناء طباعة مفتوحة. لا ينشر رد قديم ولا يعاد طبع مستند بلا منحة.
٤. حفظ أو حذف مرسل ثم سحب منحته أو تبديل جلسة الدخول؛ لا إعادة إرسال،
ولا إشعار قديم أو انتقال تلقائي في الجلسة الجديدة. تنظيف الملفات لا يعمل
بهوية مستخدم جديد.
٥. خروج مستخدم الإنشاء فقط، ثم فلتر جدول غير صالح مع بحث بلا نتائج.


### التحقق المنفذ بعد الإصلاح

- نجح بناء `tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj`
  بواسطة `dotnet build --no-restore -m:1 --disable-build-servers --verbosity quiet`:
  رمز خروج 0، صفر أخطاء، ٣٧ تحذيرًا في ملفات خارج تعديل هذا البند،
  زمن 00:01:12.36. يشمل تجميع تطبيق الخادم ومواصفاته؛ لم يُشغّل test runner.
- نجح `npm run build`: رمز خروج 0، اكتمال حزمة التطبيق في 152.868 ثانية؛
  ستة تحذيرات ميزانية حجم الحزمة وملفات SCSS خارج هذا التعديل.
- نجح `tsc --noEmit` بإعداد مؤقت يرث `tsconfig.spec.json` ويشمل ملفات
  مواصفات `ItemRequisition` الستة فقط: رمز خروج 0، دون أخطاء. أزيل الملف
  المؤقت، ولم تتغير إعدادات المشروع. هذا فحص تجميع وليس تشغيل اختبارات.
- فُحصت فروق الملفات المحصورة والملفات الجديدة للمسافات وعلامات الدمج،
  ومطابقة الأنواع والاستيرادات والعقد. فحص الوصفات الحالي 8/8 مطابق.
- لم تُشغّل اختبارات أو lint أو متصفح أو HTTP أو أوامر قاعدة بيانات أو هجرة،
  ولم يحدث commit أو push أو نشر.

## الملاحظات الأصلية (محفوظة لتتبع الإصلاح)

1. **P2 — إنشاء إذن من فرع مصدر للقراءة فقط ينجح ثم يتعطل اعتماده للمستخدم نفسه.** عقد A1/A2 يسمح بقراءة الطلب في فرع والعمل على فرع وجهة آخر قابل للتسجيل. `IssueAsync` يقرأ المصدر بنطاق العرض وينشئ الإذن في الوجهة. عند اعتماد الإذن، يُثبت المصدر على مستوى الشركة ثم يفحص `ItemIssue.ValidateAsync` أمر الشغل باستعلام فروع التسجيل. إذا كان فرع أمر الشغل للقراءة فقط فإنه يختفي ويرجع `ItemIssueInvalidJob` رغم وجود منحة الاعتماد ورصيد كافٍ في الوجهة. اقرأ مرجع أمر الشغل بحدود مقصودة بعد إثبات مصدر الإذن وصلاحية الفرع المحفوظ، وغطِّ دورة الإنشاء ثم الاعتماد في نفس نطاق المستخدم. [قراءة المصدر](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs:685>) · [إنشاء الإذن](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs:697>) · [فحص أمر الشغل عند الاعتماد](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs:378>) · [استدعاء التحقق](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs:584>)

2. **P2 — استعادة العرض قد تستبدل مسودة المستخدم دون موافقته.** محرر الطلب يفرغ `details` عند سحب العرض ثم يعيد `loadDetails` عند عودته. الرد يعيد النموذج والصفوف ويضعها كغير معدلة دون فحص `form.dirty`. نافذة الصرف وصفحة طلب الشراء تتبعان المسار نفسه وتستبدلان أسطر الكميات والأسعار والوصف. احتفظ بالمسودة وهوية السجل، واجعل تحديث أهلية المصدر مستقلاً عن استبدال المدخلات المعدلة. غطِّ السحب ثم الاستعادة مع تعديل قائم في كل سطح. [سحب العرض واستعادته في المحرر](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/details/details.component.ts:181>) · [استبدال النموذج](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/details/details.component.ts:502>) · [استعادة نافذة الصرف](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/issue/issue.component.ts:165>) · [استبدال بنود الصرف](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/issue/issue.component.ts:259>) · [استعادة طلب الشراء](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts:338>) · [استبدال بنود طلب الشراء](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts:390>)

3. **P2 — طلب الشراء المحفوظ يظل معروضًا وقابلاً للطباعة بعد سحب منحة عرضه.** بعد تحميل المستند، القالب يرتبط بوجود `savedDocument` وحالة عرض طلب الأصناف. سحب `PurchaseRequests.View` لا يفرغ المستند ولا يلغي الطباعة المنتظرة، و`printSaved()` لا يعيد فحص المنحة. الطباعة التلقائية بعد الحفظ تُرسل كذلك دون `canPrint` أو إشارة إلغاء. اربط البيانات المحفوظة بمنحة المستند وجلسة القراءة، وألغِ إطار الطباعة عند انتهائهما، وأعد الفحص في الإطار النهائي. [نشر المستند والطباعة التلقائية](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts:528>) · [طباعة المستند المحفوظ](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts:539>) · [قالب المستند](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.html:39>) · [دورة تغيّر الصلاحيات](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts:291>)

4. **P2 — التقرير لا يربط الصفوف بإصدار الوصول وقد يستبدلها أثناء طباعة مفتوحة.** `rowsVersion` يحفظ سياق البيانات والاستعلام وحق اختيار أمر الشغل، ويغفل إصدار الصلاحيات. تغيّر الإصدار مع بقاء تلك القيم يسمح باستخدام الصفوف القديمة. كما أن سحب اختيار أمر الشغل بعد فتح طباعة المتصفح يستدعي `clearLoadedState` ثم `load(true)`، وهذا المسار يتجاوز فحص `printing` ويغيّر المحتوى أثناء امتلاك المتصفح دورة الطباعة. ثبّت إصدار القراءة مع الصفوف، وأجّل إعادة التحميل إلى انتهاء الطباعة إذا ظل الوصول مسموحًا. [هوية الصفوف](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/report/report.component.ts:19>) · [تغيّر المنح](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/report/report.component.ts:93>) · [إعادة التشغيل](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/report/report.component.ts:132>) · [فحص نسخة الطباعة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/report/report.component.ts:238>)

5. **P2 — مستخدم الإنشاء فقط يصل إلى صفحة فارغة بعد الحفظ أو الإغلاق.** `/ItemRequisition/create` يفتح بالحزمة المستقلة دون العرض. عند إغلاق المحرر يخفيه الوالد ثم يعود دون انتقال إذا كان المستخدم يفتقد العرض. القائمة مخفية دائمًا في مسار الإنشاء، فتختفي كل وظائف الشاشة ويظل المسار نفسه. انتقل إلى وجهة مسموحة من سجل المسارات مع معالجة نجاح الإنشاء مرة واحدة. [إغلاق محرر الإنشاء](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/list/list.component.ts:337>) · [إخفاء القائمة في مسار الإنشاء](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/list/list.component.html:4>)

6. **P2 — عرض نتيجة الكتابة لا يفحص سحب منحة العملية.** دالة `CAN_PRESENT_API_OUTCOME` في الحفظ والحذف والصرف وطلب الشراء تقارن سياق البيانات فقط. سحب منحة العملية مع بقاء المستخدم والشركة والفروع يجعلها ترجع true وتسمح بعرض نتيجة متقادمة. لا تحمل هذه المقارنة هوية جلسة دخول مستقلة أيضًا. اربط الإشعار بمنحة الطلب وإصدارها وجلسة الدخول الأصلية، مع إبقاء تسوية نجاح الطلب ومسودته مستقلة. [نتيجة حفظ الطلب](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/details/details.component.ts:408>) · [نتيجة الصرف](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/issue/issue.component.ts:297>) · [نتيجة طلب الشراء](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts:481>) · [نتيجة الحذف](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/list/list.component.ts:413>) · [تكوين سياق البيانات](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/authorization/access-view-policy.service.ts:13>)

7. **P2 — صلاحية فلتر الجدول تتوقف على وجود نتائج أولية.** القائمة ترجع نجاحًا مبكرًا عند عدم وجود معرفات مرشحة، قبل تحليل `grid` والتحقق من حقوله وأنواعه. طلب بنفس المرشح المتقدم غير المقبول قد يرجع 400 عندما توجد بيانات و200 فارغًا عندما تغيب. تحقّق من مخطط الفلتر قبل اختصار النتيجة الفارغة، وغطِّ حالة رفض مستقلة مع مرشحات أولية لا تطابق سجلات. [الرجوع المبكر](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs:425>) · [موضع تطبيق الفلتر المتأخر](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemRequisitionService.cs:439>)

8. **P2 — مواصفات التحقق لا تصل لعدة حالات تدّعي تغطيتها.** تهيئة الخادم تستخدم `SiGmaDbContext.SaveChangesAsync` الحقيقي مع مزود InMemory وبيانات عملة وطلب شراء، ما يصل إلى حدود معاملات وقفل SQL Server. `SingleOption` يفترض أن الكتالوج يحتوي موردًا واحدًا رغم إضافة موارد الاعتماد العامة. إذن الصرف المستخدم لإثبات الاستهلاك في فرع مخفي يبقى بحالته الافتراضية غير المعتمدة. وفي الواجهة، اختبار طلب الشراء يمسح القالب دون تهيئة `currencySnapshot` ويستدعي الحفظ، فيرفض قبل POST. اختبارات الصرف وطلب الشراء تطلب خروجًا ناجحًا بينما `saving` ما زالت true، خلاف حارس الخروج. كما أن بدائل المراجع في اختبار طلب الشراء تفتقد دوال المصدر المستخدمة فعليًا. صحّح بيانات التهيئة والمزود وحدود الاستبدال ثم نفذ الحالات تحت التفويض المناسب، مع بقاء منع الخروج أثناء الطلب المرسل. [تهيئة الخادم](<F:/My Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionAccessContractTests.cs:254>) · [نوع قاعدة التهيئة](<F:/My Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionAccessContractTests.cs:67>) · [اختيار الكتالوج](<F:/My Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionAccessContractTests.cs:758>) · [حالة إذن الصرف الاختباري](<F:/My Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionAccessContractTests.cs:222>) · [حارس العملة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.ts:460>) · [محاولة الحفظ دون عملة في المواصفة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/purchase-request/purchase-request.component.spec.ts:203>) · [الخروج أثناء الصرف](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/issue/issue.component.spec.ts:176>) · [حارس الخروج](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisition/components/issue/issue.component.ts:326>)

9. **P3 — توثيق المسارات ونتائج الرفض يحمل أسماء لا تطابق المصدر.** المطابقة تذكر `GET ItemRequisition/GetList` و`GetManyWithNavigations` و`DELETE ItemRequisition/{id}` ومرشّحين باسمَي `CurrentPermissionFilter` و`PermissionPrerequisiteFilter`. المتحكم الأساسي يعرّف القائمة على GET الجذر والحذف على DELETE الجذر بمعامل `id`، والخادم يستعمل `PermissionAuthorizationFilter`. التفويض إلى قائمة التنقل يوجد داخل الخدمة. كذلك يُرفض المستخدم العادي بـ403 على المنافذ خارج الكتالوج، بينما يصل المدير إلى نتيجة 405 من الخدمة. صحّح جداول الاكتشاف والمطابقة والتسليم مع الإبقاء على تاريخ الترقيم واضحًا. [المتحكم الأساسي](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/SiGmaControllerBase.cs:39>) · [متحكم إجراءات الطلب](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/ItemRequisitionController.cs:12>) · [مرشّح الخادم](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionAuthorizationFilter.cs:88>) · [جدول المطابقة](ITEM_REQUISITION_ACCESS_RECONCILIATION.md)

## تحسين الوثائق بعد المراجعة

أضيفت حالات مطابقة العملية المنتجة للمستند مع مستهلكها التالي، وفحص بقاء
المسودة عند سحب المنحة واستعادتها، ودليل وصول مواصفات التحقق للشرط المقصود
إلى Master5/7 وقوالب التنفيذ والتسليم. حُدّث
[البرومبت القابل لإعادة الاستخدام](AUTHORIZATION_AGENT_PROMPT.md).
تظل حالة إصلاح الملاحظات مرتبطة بأدلة التنفيذ اللاحقة.

## ما ثبت وحدود التحقق

- نطاق الطلب وبنوده يتبع فرع أمر الشغل، وتستند مراجعة المرجع والنشاط إلى الحزمة المعتمدة. حساب الاستهلاك والارتباط عبر الشركة وفصل منح `Issue` و`CreatePurchaseRequest` عن إنشاء المستندات المستقلة موجود في المصدر. خدمة البنود المباشرة تقفل القراءة والكتابة المتقاعدة، والتحويل الأمامي يتبع الوجهة.
- قرأت العقد وملف المطابقة والاكتشاف ومسارات Angular والخادم وأصحاب النوافذ والطباعة والتحميل. راجعت شرح سبيد ودليل الورشة S113 وروابط دورة الطلب في C1706/C1707. مرجع Odoo المحلي لم يحسم أي تغيير في عقد صلاحيات المخزون لهذه المراجعة.
- نجح تحليل صياغة 23 ملف TypeScript/قالب و6 ملفات C#، وفحص فروق Git المحصورة وفحص الوصفات 8/8. هذه الفحوص مستقلة عن أدلة البناء التاريخية في ملف المطابقة.
- المراجعة مصدرية. تشغيل الاختبارات، وتجربة المتصفح، وترجمة الاستعلامات وسلوك الأقفال على SQL Server متبقية للقبول. الجرد وقت المراجعة 160/263.
