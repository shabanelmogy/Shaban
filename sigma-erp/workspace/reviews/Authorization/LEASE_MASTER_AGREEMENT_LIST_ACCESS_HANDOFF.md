# تسليم صلاحيات قائمة الاتفاقيات الرئيسية للتأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | LeaseMasterAgreement/components/list/** فقط |
| العقد | LEASE_MASTER_AGREEMENT_ACCESS_CONTRACT_FREEZE.md — Frozen |
| إقفال الوحدة | ينتظر التدقيق المستقل وتكامل الجذر؛ لا ترقية للجرد من هذا التسليم |

## الملكية والمراجع

عُدل list.component.ts وlist.component.html، وأُضيف list-access.spec.ts.
بقي ملف SCSS الفارغ ومواصفة الإنشاء السابقة كما هما. لم تُعدل الخدمة أو
النماذج أو helper أو الخلفية أو المسارات أو المحرر أو المصادر التابعة أو
المالكون المشتركون أو الترجمة أو الدليل. يملك الجذر تكاملها؛ استُهلك
approve(id, context?) من خدمته بعد مطابقة توقيعها.

قُرئ العقد المجمد وhelper، وكتل UI2/7/22/26/28 الحالية وشكل UI02،
ومرجع Job list الفعلي لقراءة switchMap والبحث المطبق والفرز والعودة
بحالة القائمة. فحص وصفات التنفيذ أعاد ثماني نتائج OK. مهارة Sigma
والقواعد الحية ومهارات التنفيذ والتحقق المتناسبة مكمّلة للعقد، مع أولوية
الفحص المصدري ومنع التشغيل. لم تُنشأ وكلاء فرعية إضافية.

دليل Speed وشرحه S269/41eb2f187c26cb7b بتاريخ٢٧أكتوبر، ثم قسم
06-master-agreements ودورة C0886 بتاريخ٢٨أكتوبر، أدلة جُمّدت بواسطة
الجذر واستهلكتها الشريحة من العقد. لا أدعي إعادة قراءة المرجع الخارجي
في هذه الملكية. Odoo لا يبدل قواعد فتح البند أو كمياته أو مالية العقد
المعتمدة؛ لا صور جديدة أو قرار تجاري جديد من العامل.

## مصالحة العقد والوظائف

| الجانب | النتيجة المصدرية |
|---|---|
| القائمة والبحث والتحديث والإعادة والصفحات والفرز وإكسل | LeaseMasterAgreement.View صريحة، دون فرض منح كتابة أو عميل |
| فتح التفاصيل والطباعة | View مع exact current row object وهوية موجبة ومالك الجلسة الحالي وnonbusy؛ query العودة من applied filters |
| الاعتماد | View+ManageApproval الفعلية من helper، مع CanApprove وexact row وفحص الهوية قبل القرار وبعده |
| قرار الاعتماد | defer lazy، قابل للإلغاء عند denial/context/destroy، ويعيد false عند إلغاء القرار دون إرسال |
| الاعتماد المرسل | HttpContext/CAN_PRESENT_API_OUTCOME، ومراقب expiry قبل dispatch؛ لا takeUntilDestroyed/denied على POST المرسل |
| نجاح الاعتماد | exact-row WeakSet يثبت قبل mayPublish؛ لا replay أو feedback/refresh من سياق منتهٍ، وتُخفى نسخة الإجراء المكتملة |
| إخفاق الاعتماد | يدعم envelope وHTTP failure، يحتفظ بالصف ويتيح Retry صريحًا؛ no automatic write retry |
| الاسترجاع | watcher وصول مستقل يبقى بعد اكتمال القراءة، وإشارة interruption تعيد تسليحه بعد rapid revoke/regrant؛ recoveryPending ينتظر sent approval/confirmation/export busy tail |
| تبدل الحساب أو فرع الوصول | تُحجب النتائج وتُمسح query الخام والمطبقة والاختيارات والفرز عند اختلاف dataContext، مع إعادة قراءة السياق الحالي |
| مرشح العميل | Customer.Lookup اختيارية بجانب View؛ لا bootstrap/watch عند غيابها ولا تفشل قائمة العمليات بسببها |
| اختيار العميل وتسميته | finite successful bootstrap ثم watch منفصل؛ احتفاظ بأحدث تسمية للاختيار الحالي، مع clear عند السياق وسحب المنحة وإعادة bootstrap/Retry |
| البيانات المحجوبة | sigma-list-page hidden+inert تحت مالك CSS المشترك، والجدول disposable وvisibleRows فارغة؛ StateMessage للرفض خارج الغلاف |
| المنافذ | Select/DatePicker overlays تُغلق عند انتهاء المنحة/السياق والتدمير |
| الخروج | public canDeactivate يحجب confirmation/export فقط؛ يسمح بمغادرة الصفحة مع إبقاء الاعتماد المرسل مستقلاً |
| التوليد | لا appMockData على نموذج المرشحات في baseline؛ أُزيل import غير مستخدم فقط، ولم يُضف توليد بيانات إلى الفلاتر |

أعمدة القائمة المحفوظة: No،ApprovalStatus،Date،CustomerName،
CustomerCode،QuotationNo. وخصائص ListDTO هي Id وهذه الأعمدة وCanApprove
فقط؛ لا حقول غير معروضة جديدة. خيارات الحالة تحافظ القيمة الصفرية
Approved=0 بلا إسقاطها من URL/query، والمرشح يحافظ قيمة false في grid.
لا Create/Edit/Delete جديدة ولا انتقال حالة أو مالية أو كمية مخترع.

البحث يتحقق من dateRange الخام ويطبق snapshot جديدة فقط إذا كانت صحيحة.
الصفحات والفرز والتحديث والتصدير تستخدم applied filters؛ تعديل غير مرسل،
حتى لو كان نطاقًا غير صحيح، لا يبدل البحث المطبق ولا يمنع تصديره. تغيير
الفرز أو grid يعيد الصفحة الأولى، والطلب الأحدث يلغي القراءة الأقدم.
التصدير يلتقط filters/sort ويقرأ الصفحات الكاملة بحد٢٠٠، دون خروج بيانات
بعد انتهاء View. هذه صيانة لعمر query، وليست تغييرًا في العقد التجاري.

## تحميل وذاكرة وأداء

| المصدر/الطلب | التصنيف والمالك | العمر |
|---|---|---|
| GET LeaseMasterAgreement عبر getList | operational direct؛ page LoadingService | start داخل defer وrelease في finalize؛ switchMap وowner/sequence/denied/destroy؛ إظهار خطأ وRefresh دون loop |
| كل صفحات إكسل | operational composed direct؛ مالك الصفحة | snapshot من البحث المطبق، finalize واحد، إلغاء قبل إخراج الملف |
| POST /{id}/approve | independent write؛ مالك الصفحة | expiry watcher قبل dispatch وcontext للنشر فقط، نهائي قبل output، release عند اكتمال النتيجة |
| GET Customer/GetSelect عبر خدمة الماستر | opted-in CustomerService | bootstrap finite؛ ReferenceLookupStatus page scope؛ لا عداد global آخر في قراءة العميل |
| watchCustomers | ReferenceLookupBindings مع المصدر نفسه | retained refresh صامت، retention للاختيار الحالي، clear/Retry/teardown وسحب المنحة |
| مرجع العميل المشترك | cacheSelect=true وBaseService invalidation | source writes/import refresh وlookup-customers topic تحت مالكيها القائمين؛ لا cache للماستر أو تعديل خدمة مشترك هنا |

لا طلبات لكل صف أو N+1 في الشريحة، ولا GET قبل تحقق المنحة.
الترتيب والفلترة والعدد والصفحات عند الخادم كما الخدمة السابقة. لم تُغير
predicates أو joins أو schema؛ لا اقتراح فهرس جديد بلا SQL-plan evidence.
تظل قياسات cold/warm والسرعة وخطط SQL والفهارس عند قبول المالك؛ لا
يُستنتج قياس أداء من عدد أقل من الاستدعاءات أو تبني loader/cache.

## الفحوص الفعلية

كُتبت ٣٤ حالة مصدرية غير مشغلة. تشمل المنح المستقلة، exact rows والهوية
المتغيرة وCanApprove، القرار القابل للإلغاء وإعادة الفحص، pending/completed
read recovery وbusy tail، إخفاقات envelope/HTTP/empty completion، حفظ البحث
المطبق والتاريخ والصفر وfalse والصفحات والفرز، العميل الاختياري وwatch
وأحدث تسمية، actor A→B→A، استقلال POST بعد denial/destroy وsuccess latch،
والمضيف الحقيقي للرفض دون طلبات أو جدول.

فحص TypeScript AST للمكون والمواصفة أظهر صفر parse diagnostics، وAngular
parseTemplate أظهر صفر أخطاء في القالب. حُلّت imports المحلية دون missing
أو possible-unused imports. رُوجع كامل scoped diff في مستودع الواجهة،
وملف المواصفات الجديد مباشرة. نجح diff --check ولم يُعثر على merge markers في الملفات المملوكة.
لا يُدعى أن هذه الفحوص تكافئ build أو typecheck أو اختبار.

لم تُشغل builds/tests/typecheck/lint/browser/database/migrations/snapshots/
commit/push/deployment. لم يُستخدم Sigma MCP أو Graphify أو فحص الحل كله.
لا AutoMapper أو حساب مجال أو هجرة لازمة لهذه القائمة.

## المتبقي للجذر والمالك

يتولى مالك المسارات ربط canDeactivate للقائمة وshowPageLoading=true؛
أُبلغ الجذر بالتوقيع. الجذر يملك دليل التطبيق وregistry/backend والمحرر
والفتح التابع والتكامل النهائي والتدقيق المستقل والجرد. لا تُرقى الوحدة
قبل إقفال هذه التوابع. لا قرار مادي جديد معلق من القائمة.

قبول المالك المجمع: تشغيل البناء والمواصفات عند التفويض، وتجربة View-only
ومستخدم ManageApproval+View ومدير الشركة، وسحب وإعادة المنحة أثناء
القراءة والقرار والاعتماد، وتبدل الحساب/الفرع، والمرشحات وURL والصفحات
والتصدير والخروج أثناء الطلب المرسل، وظهور تحميل الصفحة وRTL والثيمين
والمقاسات والمنافذ. دليل الوحدة يحدّثه الجذر ولا يكتب العامل دليلًا موازيًا.

رسالة commit مقترحة فقط لمستودع الواجهة:

feat(authorization): guard lease master agreement list and approval
