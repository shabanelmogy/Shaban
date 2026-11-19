| البند | القيمة |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| تاريخ المراجعة | 2026-10-02 — Africa/Cairo |
| النطاق | منطق Repository وUnitOfWork، والعقود والمستهلكون والاعتمادات المباشرة اللازمة لإثباته |
| طبيعة العمل | قراءة فقط؛ التقرير هو الملف الجديد الوحيد |
| حدود الإثبات | تحليل المصدر والمسارات الفعلية؛ لم تُشغّل اختبارات أو طلبات API أو استعلامات قاعدة البيانات |

# مراجعة منطق Repository وUnitOfWork

هذا هو تقرير المنطق المطلوب بعد تصحيح النطاق. التقرير السابق `REPOS_PROJECT_FEATURE_REVIEW.md` يخص إعدادات المشروع، ولا يمثل مراجعة منطق Repository وUnitOfWork.

إغلاق التقرير يعني اكتمال مراجعة المصدر، وليس تنفيذ الإصلاحات أو التحقق منها أثناء التشغيل. الأمثلة أدناه مبنية على كيانات وخدمات موجودة بالمشروع. الأرقام وأسماء السجلات توضيحية، وليست بيانات مستخرجة من قاعدة البيانات أو وقائع تشغيل مثبتة.

## 1. أهم النتائج

| # | الأولوية | المشكلة | شرط الأثر |
|---|---|---|---|
| L1 | عالية | ترقيم Company يعتمد على عدد Customer | تفعيل الترقيم الآلي ووجود إعدادات |
| L2 | عالية | المرقّم يقرأ إعدادات أي Subscription | وجود إعدادات مختلفة لأكثر من اشتراك |
| L3 | عالية عند تركيب القراءة والكتابة | القراءة العميقة تفصل كل ChangeTracker | وجود تغييرات أخرى في نفس UnitOfWork |
| L4 | عالية عند استخدام الدفعات | ترقيم دفعة من النوع نفسه يعيد الرقم نفسه | نوع يستخدم Count + 1، أكثر من صف قبل الحفظ |
| L5 | متوسطة | القراءة العميقة تقطع علاقات Account المتكررة | شجرة حسابات من أكثر من مستوى أو حساب له Parent |
| L6 | متوسطة | تحميل العلاقات يعيد أبناء محذوفين | أب حي له ابن محذوف منطقيًا |
| L7 | متوسطة ومشروطة | غياب Subscription صالح لا يوقف كل المسارات | claim مفقود/غير رقمي أو استخدام دون HttpContext |
| L8 | منخفضة إلى متوسطة | اختلاف معنى IsDeleted=null بين القراءات | وجود صفوف قديمة/مستوردة بالقيمة null |
| L9 | منخفضة | CancellationToken لا يصل إلى تجهيز الأرقام | إلغاء الطلب قبل أو أثناء تجهيز صفوف Added |
| D1 | عالية — اعتماد مباشر | OnConfiguring يفرض اتصالًا ثابتًا | اختلاف اتصال البيئة عن الاتصال المكتوب داخل Context |

L1–L2 وL4 تخص اعتماد الترقيم الذي تستدعيه طبقة الحفظ. D1 تخص DbContext الذي تنفذ عليه الطبقة. لا تُنسب هذه العيوب إلى ملف csproj نفسه.

## 2. الملاحظات بأمثلة من المشروع

### L1 — Company يعدّ سجلات Customer بدل Company

**الدليل:** [CodeCreateService.cs:65](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/HelperServices/CodeCreateService.cs:65>) يمرر `nameof(Customer)` في فرع `nameof(Company)`. [CompanyConfig.cs:9](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/CompanyConfig.cs:9>) و[CustomerConfig.cs:7](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/CustomerConfig.cs:7>) يربطان النوعين بجدولين مختلفين. Company يرث Partner، وCustomer يرث PersonBase.

**المسار الفعلي:** `POST /Company` → [CompanyService.AddAsync](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Customers/CompanyService.cs:52>) → `base.AddAsync` → [Repository.AddAsync](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:142>) → المرقّم → الحفظ.

**مثال واقعي من هذا المسار:** إعدادات الترقيم الآلي للشركات تستخدم prefix `COMP` وطول 4، وجدول Customer فيه 10 سجلات. إضافة الشركة A تولد `COMP-0011`. حفظ A يزيد Company/Partner، لكنه لا يزيد Customer. إضافة الشركة B بعد انتهاء الطلب الأول تولد `COMP-0011` مرة أخرى. لا تحتاج الحالة طلبين متزامنين، وقفل Company لا يصلح اختيار الجدول الخطأ.

**الأثر:** تكرار رقم الشركة. وجود/غياب قيد فريد مطبق فعليًا يحدد هل تُحفظ الأرقام المكررة أم يفشل الحفظ؛ لم تُفحص schema الحالية.

**أبسط إصلاح:** تصحيح نوع العد إلى Company فورًا. هذا يصلح العيب المحدد، لكنه لا يصلح عيوب Count + 1 العامة في L4. لا حاجة إلى transaction إضافية لحل هذا الخطأ تحديدًا.

### L2 — إعدادات الترقيم غير معزولة بالـ Subscription

**الدليل:** [CodeCreateService.cs:33](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/HelperServices/CodeCreateService.cs:33>) يستخدم `FirstOrDefaultAsync()` بلا شرط Subscription أو soft-delete أو ترتيب. [SettingsDocumentNumberModel.cs:3](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Settings/SettingsDocumentNumberModel.cs:3>) يرث EntityBase، وبالتالي الإعدادات تخص اشتراكًا. في المقابل، [SettingsDocumentNumberModelService.cs:28](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AdministrationsServices/SettingsDocumentNumberModelService.cs:28>) يقرأ إعدادات الاشتراك نفسه في `GetMySettingAsync`.

**مثال من Companies:** الاشتراك 1 له `CustomersCompanyCodePrefix = COMP`، والاشتراك 2 له `CO2`. مستخدم الاشتراك 2 يرى `CO2` عند قراءة إعداداته، ثم يضيف Company. المرقّم قد يختار صف الاشتراك 1 ويولد prefix `COMP`. لو `CustomersIsManual` مختلف، يتغير أيضًا قرار الترقيم الآلي. عدم وجود ترتيب لا يضمن اختيار الصف نفسه دائمًا.

**الأثر:** اختلاف الرقم الناتج عن الإعدادات التي يراها المستخدم، وتطبيق قواعد اشتراك آخر. المصدر يثبت غياب الفلتر؛ وجود أكثر من اشتراك بإعدادات مختلفة لم يُتحقق منه في DB.

**أبسط إصلاح:** قراءة الإعدادات بالاشتراك الموثوق وفلتر المحذوف. معالجة تعدد صفوف الإعدادات تتبع خطة settings القائمة؛ لا نختار آخر صف عشوائيًا أو نضيف خدمة إعدادات موازية. مثال اختيار الإعدادات الصحيح موجود في [JobEstimationService.cs:960](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/JobEstimationService.cs:960>) عبر Repository.Query؛ هذه مقارنة مصدر، وليست توصية لتعديل JobEstimation.

### L3 — GetByIdDeepAsync يفرغ tracking لكل UnitOfWork

**الدليل:** [Repository.cs:499](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:499>) يعمل Attach للجذر بعد AsNoTracking، ثم [السطر 508](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:508>) يفصل كل `ChangeTracker.Entries()` في finally. [UnitOfWork.cs:22](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/UnitOfWork/UnitOfWork.cs:22>) يستخدم Repository على Context نفسه، وليس Context قراءة منفصلًا.

**المستهلك الفعلي:** [Service.DetailWithNavigationsAsync:1230](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:1230>)، ومنها endpoint الحسابات `GET /Account/GetByWithNavigationsId/{id}`. تعليق العقد يصف القراءة بأنها read-only، لكن التنفيذ يغير tracker المشترك.

**مثال باستخدام كيانات المشروع داخل نفس UnitOfWork:**

```csharp
var account = await uow.Repository.FindByIdAsync<Account>(accountId);
account!.Notes = "تعديل لم يحفظ بعد";
await uow.Repository.GetByIdDeepAsync<Company>(companyId);
await uow.SaveChangesAsync();
```

إذا وُجدت Company المطلوبة، قراءة Company تفصل Account أيضًا؛ تعديل Notes لا يصل للحفظ، وقد يرجع SaveChangesAsync نجاحًا لأنه لم يعد هناك تعديل متتبع. مثال آخر: قراءة Account tracked ثم استدعاء القراءة العميقة لنفس ID؛ Attach لنسخة ثانية من المفتاح نفسه يمكن أن يسبب تعارض tracking. [وثائق EF عن هوية الكيان المتتبع](https://learn.microsoft.com/en-us/ef/core/change-tracking/identity-resolution) تشرح قيد النسخة الواحدة للمفتاح.

**حد الإثبات:** هذا أثر مؤكد لتركيب الاستدعاءات في المصدر. لم أجد في المستهلكين المحدودين endpoint قائمًا يجمع المثال الأول كاملًا، ولا أدعي أنه سبب حادثة فقدان بيانات حدثت بالفعل.

**أبسط إصلاح:** القراءة المطلوبة بـ Include/Select وAsNoTracking بدون Attach على Context الكتابة. إذا بقي loader عام، يعزل في Context قراءة مستقل. فصل الكيانات التي أضافها loader فقط يقلل الضرر، لكنه لا يحل وحده تعارض Attach.

### L4 — الصفوف المتعددة قبل الحفظ تحصل على الرقم نفسه

**الدليل:** [Repository.AddRangeAsync:196](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:196>) يرقم كل صف قبل حفظ الدفعة. [UnitOfWork.PrepareAddedNumbersAsync:109](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/UnitOfWork/UnitOfWork.cs:109>) يفعل الأمر نفسه للصفوف Added بدون No. [CodeCreateService.cs:126](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/HelperServices/CodeCreateService.cs:126>) يحسب عدد صفوف DB فقط، ثم يرجع العدد + 1.

**مثال من خدمة موجودة:** [SupplierService.cs:11](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SupplierServices/SupplierService.cs:11>) يرث عقد وخدمة AddListAsync. [Service.cs:63](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:63>) يحول المدخلات إلى قائمة ثم يمررها إلى AddRangeAsync ويحفظ مرة واحدة. مع 10 موردين محفوظين، و`SuppliersIsManual=false` وprefix `SUP` وطول 4، إضافة موردين في الدفعة تعطي الأول `SUP-0011` والثاني `SUP-0011`: لم يُحفظ الأول حين عُدّت الصفوف للثاني.

**حد الإثبات:** مسار الخدمة وعقد الدفعات موجودان. لم أجد في Controller العام endpoint لـ AddListAsync، ولم أثبت أن شاشة الموردين الحالية تستخدم هذا العقد. المثال يثبت خلل عملية الدفعات المتاحة في الطبقة، وليس حادثة من زر في الواجهة. التحفظ نفسه ينطبق على وجود عدة صفوف من نوع آلي واحد يرقمها UOW قبل save.

**الأثر:** تكرار No حتى داخل طلب واحد. applock لا يحجز أرقام الصفوف غير المحفوظة. المشكلة العامة معروفة في Backend backlog #14؛ إضافة هذه المراجعة هي توضيح حالة الدفعة داخل الطلب الواحد.

**أبسط إصلاح صحيح:** تطبيق خطة الترقيم المشتركة القائمة بحجز قيم متتابعة من counter ذري، مع قيد فريد للـ scope المعتمد. لا نضيف offset داخل كل شاشة، ولا نعمل SaveChanges لكل صف بغرض الترقيم. المشروع يحتوي بالفعل على [DocumentNumberCounter](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/DocumentNumberCounter.cs:3>) وقيده [SubscriptionId + DocumentType](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/DocumentNumberCounterConfig.cs:8>)؛ يلزم توسيع المالك القائم وفق [خطة الترقيم](<F:/My Work/Sigma/reviews/Deferred/DOCUMENT_NUMBERING_MAINTENANCE_EVOLUTION_PLAN.md>).

**حد مهم:** الحذف العادي هنا soft-delete ولا يقلل Count؛ لذلك لا أقول إن كل حذف يعيد الرقم. تصادم Count بعد تقليل العدد يتطلب حذفًا فعليًا أو تغييرًا مشابهًا. كذلك JobEstimation ومسارات JournalVoucher المخصصة ليست دليلًا على استخدام المرقّم القديم؛ لها مسارات أخرى.

### L5 — منع الدوران بالنوع يقطع تفاصيل شجرة Account

**الدليل:** [Repository.cs:541](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:541>) يعتبر نوع inverse navigation visited بمجرد زيارة أي سجل من هذا النوع. [السطر 544](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:544>) يتجاوز المرجع، و[السطر 586](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:586>) يمنع التعمق في الأبناء. توجد بالفعل مجموعة visited بهوية النوع وID، لكن شرط النوع الإضافي يوقف المرور قبل الاستفادة منها.

**المسار الفعلي:** AccountController يرث endpoint التفاصيل بالعلاقات، وAccountService لا يغير DetailWithNavigationsAsync؛ override DetailAsync يخص endpoint آخر. [AccountConfig.cs:46](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/AccountConfig.cs:46>) يربط Parent وChildren. [AccountDetailVm.cs:21](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Account/AccountDetailVm.cs:21>) يعرض ParentName، و[السطر 33](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Account/AccountDetailVm.cs:33>) يعرض Children.

**مثال فعلي للهيكل:** حساب Assets A، تحته Vehicles B، تحته Vehicle C. طلب `/Account/GetByWithNavigationsId/A` يحمل B، ثم يتوقف عن تحميل C لأن Account type visited. طلب تفاصيل B يتجاوز Parent A لنفس السبب رغم اختلاف ID. النتيجة شجرة ناقصة، وقد يبقى ParentName فارغًا إذا لم يملأه relationship fixup لسبب آخر.

**أبسط إصلاح:** منع إعادة زيارة السجل نفسه بالمفتاح، مع تحديد اتجاهات القراءة المطلوبة. لتفاصيل Account، projection أو Includes محددة أبسط وأوضح من استكشاف كل العلاقات تلقائيًا. مسار TreeList الخاص منفصل، ولا يُنسب إليه هذا العيب تلقائيًا.

### L6 — فلترة root لا تمنع ظهور الأبناء المحذوفين في navigation

**الدليل:** [Repository.GetAllWithNavigationsAsync:413](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:413>) يفلتر الجذر، ثم [السطر 419](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:419>) يعمل Include لكل علاقة بلا child filter. الأمر نفسه موجود في FindAllByAsync ونسخة GetAllWithNavigations المتزامنة. الفحص المحدود لـ OnModelCreating/configurations لم يظهر global HasQueryFilter.

**مثال قابل للحدوث عبر كود المشروع:** حساب أب A وابن B بلا استخدام يمنع الحذف. [AccountService.RemoveAsync:439](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AccountServices/AccountService.cs:439>) يحذف B عبر Repository.Delete، ولا يمسح ParentId. [HandleAudit:465](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs:465>) يحول الحذف إلى `IsDeleted=true`. طلب `/Account/GetAllWithNavigations` يستبعد B كجذر، لكنه يحمله داخل `A.Children`. [AccountListVm.cs:27](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Account/AccountListVm.cs:27>) وAccountProfiler يرسلان المجموعة في النتيجة.

**الأثر:** السجل المحذوف قد يعود للعميل كابن لسجل حي، وتختلف النتيجة عن القارئ العميق الذي يفلتر collections. ليست هذه مشكلة Cascade SQL تقليدية؛ الصف ما زال موجودًا بسبب الحذف المنطقي.

**أبسط إصلاح:** فلتر صريح للأبناء الذين يجب أن يكونوا أحياء، مع تحميل العلاقات المطلوبة فقط. تطبيق global filters حل أشمل، لكنه يحتاج مراجعة التقارير وincludeDeleted والسجل التاريخي قبل اعتماده. إخفاء reference تاريخي محذوف قرار مستقل عن إخفاء أبناء aggregate المحذوفين.

**حد عزل الاشتراكات في العلاقات:** التحميل نفسه لا يضيف tenant filter لكل navigation. مثال من نفس AccountConfig: لو كان A للاشتراك 1 وParentId يشير إلى P للاشتراك 2 نتيجة بيانات قديمة أو كتابة خارج الفحص، تحميل Parent أو Children غير المفلتر يمكن أن يعبر الرابط. لم أثبت وجود رابط كهذا أو endpoint يسمح بإنشائه؛ هذه حدود حماية مشروطة، وليست تسريبًا مثبتًا. حماية SubscriptionId في UPDATE لا تتحقق تلقائيًا من كل FK عند القراءة.

### L7 — SubscriptionId غير الصالح لا يرفض كل عمليات Repository

**الدليل:** [Repository.cs:23](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:23>) يترك الاشتراك 0 عند غياب claim أو فشل int.TryParse. Query/Find تقرأ الاشتراك 0 بدل الرفض. [AddAsync:139](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:139>) وUpdate/Delete يطبقون حماية الملكية فقط إذا كانت القيمة موجبة. في المقابل، [QueryReport:70](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:70>) يرجع فارغًا عند غياب الاشتراك، و[ExecuteUniqueWriteAsync:67](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/UnitOfWork/UnitOfWork.cs:67>) يرفض بـ401.

**مثال من Branch:** BranchService.AddAsync يستدعي Exists ثم base.AddAsync، ولا يعلن UniqueColumns في المصدر المراجع، وبالتالي لا يمر تلقائيًا بحارس ExecuteUniqueWriteAsync. إذا وصل طلب authenticated بدون claim رقمي، فإن Exists يقرأ tenant 0 وRepository.AddAsync لا يفرض اشتراكًا. HandleAudit أيضًا لا يفرض tenant عند القيمة 0. يمكن أن يحاول حفظ Branch تحت tenant 0 إذا بقية القيود تسمح. القراءة قد تصل إلى صفوف tenant 0 إن وجدت، ولا تعني الوصول العشوائي لكل الاشتراكات.

**حد الإثبات:** Controller عليه Authorize، لكن [السياسة الافتراضية](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Extensions/DependencyResolver.cs:77>) تطلب مستخدمًا authenticated فقط. لم أثبت أن issuer الحالي يصدر token ناقصًا. المشكلة تظهر مع تغير عقد auth أو استدعاء خدمة دون سياق HTTP؛ ليست تجاوزًا مثبتًا لتوثيق المستخدم الحالي.

**أبسط إصلاح:** حد واحد واضح يرفض عمليات tenant-scoped بدون tenant صالح، مع سياق tenant صريح للمهام الخلفية المعتمدة إن وجدت. لا تُحوّل القيمة إلى 1 افتراضيًا. fragility استخدام NameIdentifier نفسها معروفة في backlog #11؛ هذه الملاحظة تحدد اختلاف التعامل مع القيمة غير الصالحة بين مسارات الطبقة.

### L8 — IsDeleted=null حي في مسار ومختفٍ في مسار آخر

**الدليل:** [EntityBase.cs:8](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/EntityBases/EntityBase.cs:8>) يعرّف bool? IsDeleted. [FindByAsync:301](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:301>) يستخدم `== false`، بينما Query وFindById وFindFirstByAsync وDropdown تستخدم `!= true`. [Service.ListQuery:840](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:840>) يعيد تضييق فلتر القائمة إلى `== false` أيضًا.

**مثال من Account:** صف قديم يحمل IsDeleted=null. `GET /Account/GetById/{id}` يقدر يجده، وGetSelect/قراءة Repository.Query تعتبره غير محذوف. لكن `POST /Account/handleActivate` يصل إلى [HandleActiveAsync:906](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:906>) الذي يستخدم FindByAsync؛ لا يجده ويرجع ActivationRecordsNotFound. كذلك لا يصح القول إنه يظهر في كل القوائم: القائمة العامة نفسها تضيف شرط false الصريح.

**حد الإثبات:** اختلاف المعنى مثبت من المصدر. وجود صفوف null حاليًا غير مثبت. القيمة الافتراضية false عند إنشاء كائن جديد لا تصلح صفًا قديمًا يحمل null.

**أبسط إصلاح:** توحيد الشرط وفق السياسة القائمة `!= true` في Repository ومستهلك ListQuery. تحويل العمود إلى non-nullable وتنظيف البيانات قرار schema منفصل، وليس شرطًا للإصلاح المحدد.

### L9 — إلغاء الطلب لا يوقف مرحلة ترقيم Added

**الدليل:** [UnitOfWork.SaveChangesAsync:49](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/UnitOfWork/UnitOfWork.cs:49>) يستدعي PrepareAddedNumbersAsync بلا token. [ICodeCreateService.cs](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Helpers/ICodeCreateService.cs>) لا يقبل token. قراءة settings لا تقبل token، و[CodeCreateService.cs:128](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/HelperServices/CodeCreateService.cs:128>) يستخدم CancellationToken.None للعد.

**مثال من Company:** طلب إضافة Company فيه Driver/Contact وصفوف وثائق جديدة. بعد ترقيم الجذر مبكرًا في AddAsync، تبقى صفوف الأطفال Added بلا No. إذا أُلغي الطلب قبل SaveChangesAsync، يظل UOW يمر على هؤلاء الصفوف ويستعلم عن settings لتوليد أرقامهم؛ حتى يصل إلى Context.SaveChangesAsync(token) الذي يرى الإلغاء. الأنواع غير الموجودة في switch تستخدم ticks، لكنها تستعلم عن settings أولًا أيضًا.

**الأثر:** استعلامات وعمل زائد بعد الإلغاء؛ ليس إثباتًا أن بيانات الطلب الملغى تُحفظ. لا يوجد قياس أداء هنا.

**أبسط إصلاح:** تمرير CancellationToken عبر واجهة المرقّم ومرحلة التجهيز ثم استعلاماتها، مع فحص الإلغاء قبل البدء. يتوافق مع backlog #27؛ لا نضيف واجهة إلغاء مختلفة لكل شاشة.

### D1 — DbContext يفرض اتصالًا ثابتًا بدل اتصال البيئة

**الموضع خارج Repos لكنه اعتماد مباشر:** [SiGmaDbContext.cs:21](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs:21>) يستدعي UseSqlServer بقيمة اتصال مكتوبة في المصدر دون حارس IsConfigured فعال. [Program.cs:25](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Program.cs:25>) يهيئ Context من `GetConnectionString("ConnStr")`.

**مثال من تشغيل المشروع:** المالك يضبط ConnStr على قاعدة تطوير أو قاعدة اختبار مخصصة، ثم يشغل ServerAPI ويستدعي `PUT /Company`. تهيئة Context تعيد اختيار الاتصال المكتوب داخل OnConfiguring، وبالتالي Repository/UnitOfWork قد تقرأ وتحفظ في قاعدة مختلفة عن التي اختارها المالك. ما لم يكن الاتصالان متطابقين، تعديل ConnStr وحده لا يضمن نقل وجهة الحفظ. لم أفتح أي اتصال للتحقق من الوجهة الفعلية.

**الأثر:** اختيار قاعدة غير مقصودة، إضافة إلى وجود بيانات اعتماد في المصدر. التقرير لا ينسخ قيمة الاتصال أو بياناته الحساسة.

**أبسط إصلاح:** ملكية إعداد الاتصال في DI/configuration؛ حذف الاتصال المضمن، أو إبقاء fallback معتمد لا يعمل عندما options مهيأة بالفعل. [وثائق Microsoft](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/#dbcontextoptions) تؤكد أن OnConfiguring يُستدعى حتى عند استخدام AddDbContext. مراجعة صلاحية بيانات الاعتماد وتدويرها إجراء مالك إذا كانت ما زالت مستخدمة.

## 3. سلوك الحفظ والـ transactions الذي وجدته صحيحًا

| المسار | النتيجة من المصدر |
|---|---|
| SaveChanges / SaveChangesAsync بدون تعديلات | يرجعان true عند اكتمال الحفظ؛ عدد الصفوف صفر ليس فشلًا. إصلاح no-change update موجود ولا أوصي بإرجاع المقارنة `> 0` |
| ترقيم سجل محفوظ | PrepareAddedNumbers يقتصر على Added وNo الفارغ؛ لا يعيد ترقيم Modified |
| الترقيم المبكر والمتأخر | AddAsync يرقم الجذر مبكرًا للتوافق، وUOW يكمل الصفوف الجديدة؛ No غير الفارغ يمنع إعادة توليد رقم الجذر. تكرار نقطة الاستدعاء لا يعني توليد الرقم مرتين |
| Update/Delete مع tenant موجب | Repository يثبت OriginalValue للـ SubscriptionId على الاشتراك، وContext يعرّفه concurrency token؛ التعديل المقترح لا يشمل إزالة هذه الحماية |
| نقل سجل موجود بين الاشتراكات | HandleAudit يمنع تعديل SubscriptionId، ويتركه غير Modified |
| خطأ ownership أثناء الحفظ | UOW يميز DbUpdateConcurrencyException المرتبط باختلاف tenant؛ غيره يظل exception، وليس نجاحًا مزيفًا |
| ExecuteUniqueWriteAsync | transaction عادي ReadCommitted إذا لا يوجد outer transaction؛ applock parameterized بحسب النوع والاشتراك؛ نتائج القفل السلبية معالجة؛ commit عند نجاح Result فقط |
| outer transaction | UOW لا يعمل commit لها لأنها مملوكة للمستدعي |
| aggregate بحفظ واحد | EF implicit transaction مناسبة؛ وجود navigation properties وحده لا يفرض transaction إضافية |
| soft-delete | Delete/Remove يمر عبر HandleAudit ليحول Deleted إلى Modified ويكتب IsDeleted ومعلومات الحذف |

**مثال transaction من Companies:** CompanyService.UpdateCoreAsync يعدل الشركة وصفوفها المتتبعة ثم SaveUpdateAsync؛ قفل uniqueness الحالي يحتاج transaction ليحتفظ بـ applock حتى الحفظ. هذه حاجة القفل، لا مجرد وجود Drivers/Documents. لا أوصي بإضافة transaction داخل Repository.Update فوق هذا المسار.

**حدود صحيحة يجب الاحتفاظ بها:** applock يحمي الكتابات المشاركة التي تستدعيه، ولا يغطي تلقائيًا كتابة SQL خارج التطبيق أو عقد AddList/UpdateList الذي يتجاوز مسار uniqueness. أيضًا rollback لا يعيد tracker تلقائيًا إلى snapshot ما قبل العملية. لم يثبت مستهلك في النطاق يعيد استخدام UnitOfWork بعد failure على نحو يسبب كتابة لاحقة، فلا أرفع ذلك كعطل قائم.

## 4. تغطية المراجعة والعقود القائمة

| المجموعة | ما فُحص | الحكم |
|---|---|---|
| Query / FindById / FindFirst / Exists | tenant، soft-delete، tracking، النتيجة الفارغة | فلاتر الجذر موجودة؛ L7/L8 وحدود navigation |
| FindBy / FindByAsync / FindAllByAsync | paging/order/nullable parameters/includes | null paging parameters محمية؛ ID tie-break موجود في paging؛ L6/L8 |
| QueryReport | metadata، tenant/global، bool وbool?، unmapped types | tenant-scoped مع tenant غير صالح يرجع فارغًا؛ Global marker استثناء مقصود. report type بلا Subscription property يحتاج مصدرًا يضمن العزل |
| Add / AddAsync / AddRange | tenant للصفوف Added، وقت الترقيم | L1/L2/L4/L7/L9 |
| Update / UpdateRange | graph state وOriginalValue للملكية | حماية tenant الحالية فعالة بشروطها؛ reconciliation business ليست مسؤولية DbContext.Update وحده |
| Delete / DeleteRange | Remove ثم soft-delete، الملكية وaudit | تحويل soft-delete موجود؛ حذف الأب لا يعني سياسة حذف الأبناء أو usage check تلقائيًا |
| GetAll/FindAll with navigations | root filter وInclude لجميع العلاقات | L6، تحميل واسع غير موجه |
| GetByIdWithNavigations | explicit loads وchild soft-delete | يستخدم Context tracked؛ لا يمثل snapshot جديدة إذا الجذر متتبع بالفعل |
| GetByIdDeep | Attach، التنظيف، cycle guard، navigation load | L3/L5/L6 |
| GetDropdown | تحميل، projection، reflection، selectors | يحمل full entities قبل إنشاء DropdownDto؛ تكلفة محتملة دون قياس. nameSelector يتجاهل في الأنواع الخاصة، لكن لم يُثبت consumer يطلب قيمة مختلفة؛ لم تُرفع كمشكلة عملية مستقلة |
| SaveChanges وPrepareAddedNumbers | no-change، Added، exception، cancellation | no-change صحيح؛ L4/L9 |
| ExecuteUniqueWrite | ownership، transaction scope، lock، failure | البناء الحالي صحيح في النطاق؛ حدود مشاركة الكتابات المذكورة أعلاه |

**حد Update العام:** [Service.cs:123](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:123>) يربط graph منشأة من mapping قبل تحميل العلاقات، ثم يعيد mapping من temporary children. هذا معروف في Backend backlog #32، ولا يجوز اعتباره فحصًا كاملًا لكل aggregate. Company/Individual لهما UpdateCore متتبع خاص؛ لا تنسب عيوب المسار العام لهما تلقائيًا. أي تغيير reconciliation العام يحتاج مقارنة payload omission ومعنى حذف الأطفال لكل مستهلك، وليس مجرد تبديل Update إلى AutoMapper.

## 5. اقتراح ترتيب الإصلاح

1. D1: تأكيد مالك اتصال DB وإزالة override غير المقصود قبل الاعتماد على تجارب الحفظ.
2. L1 وL2: إصلاح counted type للشركات وعزل إعدادات المرقّم؛ تغييران محددان في اعتماد قائم.
3. L3 وL5: قراءة تفاصيل موجهة بلا تخريب tracker، ثم تصحيح مرور شجرة Account.
4. L4: تنفيذ خطة الترقيم المشتركة القائمة، بما يشمل دفعات الصفوف والتزامن. لا counter جديد موازٍ.
5. L6 وL7: توحيد عزل/حذف graph حسب نوع القراءة، ورفض tenant غير الصالح. قواعد المراجع التاريخية والمهام الخلفية تسجل قبل التنفيذ.
6. L8 ثم L9: توحيد soft-delete وتمرير cancellation عبر المسار القائم.

هذا ترتيب توصيات، وليس موافقة على تنفيذها أو تغيير العقود في هذه المهمة. Index وحده لا يصلح counted type أو إعدادات الاشتراك، وtransaction وحدها لا تجعل Count + 1 يحجز أرقامًا مختلفة للدفعة.

## 6. تحقق المالك المطلوب — لم يُنفذ

| الحالة | الإجراء والنتيجة المطلوبة |
|---|---|
| شركتان متتاليتان | مع automatic numbering، تختلف أرقام الشركتين ولا تعتمد على Customer count |
| إعدادات اشتراكين | prefix/manual rule لكل طلب يتبع settings اشتراكه |
| دفعة موردين | استدعاء عقد الخدمة/عملية الدفعات المعتمدة، رقمان مختلفان داخل دفعة واحدة |
| tracker محفوظ | تعديل Account ثم قراءة تفاصيل مختلفة في نفس UOW؛ التعديل يبقى قابلًا للحفظ |
| نفس المفتاح | قراءة tracked ثم قراءة read-only لنفس ID بدون Attach conflict |
| Account A→B→C | تفاصيل العقدة تعرض الاتجاهات المطلوبة دون قطعها أو دوران |
| ابن محذوف | GetAllWithNavigations لا يعيد الطفل المحذوف في المجموعة الحية |
| tenant غير صالح | عمليات tenant-scoped ترفض بوضوح ولا تحفظ صفوف tenant 0 |
| IsDeleted=null | التفاصيل/القائمة/select/activate تتبع معنى واحدًا |
| cancellation | توقف تجهيز الأرقام عند إلغاء الطلب، دون استكمال استعلاماته |
| ConnStr للبيئة | Context يستخدم قاعدة البيئة المقصودة؛ التحقق من الإعداد الفعال لا يحتاج كشف بيانات الاعتماد |
| عدم تغيير البيانات | استمرار نجاح الحفظ بلا تغييرات في Company/Individual والشاشات العامة |

## 7. المصالحة النهائية

- **الملفات:** أُضيف هذا التقرير فقط؛ لا تغيير في source أو configuration أو Guide/skill أو migrations أو snapshots. التقرير التاريخي لإعدادات المشروع بقي كما هو.
- **المراحل:** discovery وتتبع read/write/actions/integration ومصالحة المصدر أُجريت للمكتبة المشتركة. مراحل implementation وشاشات Angular وعقود grid/screenshots غير منطبقة؛ لا واجهة مستخدم جديدة في النطاق.
- **القرارات:** المراجعة منطق بنية تحتية، لا CRUD screen. العقود الحالية لم تتغير؛ لا AutoMapper أو حسابات domain عُدلت. لم يُفترض قرار business جديد لإخفاء reference تاريخي أو لتغيير scope ترقيم المستندات.
- **المرجعية:** Master blocks 1/5/7، Backend preamble وblocks 5/8/11/14/17/19، skill sigma-screen-refactor كملخص تشغيلي. recipe drift check السابق في هذه المهمة كشف قدم الحزم الثماني؛ المرجع الكتب الأصلية. regeneration والمراجعة الدلالية pending للمالك.
- **الملاحظات المعروفة:** Count numbering #14، claim convention #11، cancellation #27، legacy Update #32 أُميزت عن الحالات المحددة الجديدة؛ عبارة backlog «أي حذف» لا تنطبق على soft-delete الحالي الذي لا يقلل العدد.
- **فحص المصدر:** scoped Git status/diff/diff --check داخل `F:\My Work\Sigma\SigmaBackend` لنطاق Repos والاعتمادات الأساسية المراجعة لم يظهر تغييرات أو whitespace errors. لا repository في workspace root لحفظ review artifact؛ الملف المحلي غير versioned حاليًا.
- **Delegation:** مساران read-only مستقلان: تدقيق الاستعلامات/navigation وRepository، وتدقيق الحفظ/الترقيم/transaction في UnitOfWork. agentان بالنموذج الموروث؛ بلا ملفات كتابة، لتقليل وقت القراءة المتوازية. root طابق النتائج مع المصدر والمستهلكين ودمج التقرير.
- **Compile/runtime:** لا ادعاء بنجاح build أو API أو schema الحالي. أرقام الأمثلة توضيحية والحالات المشروطة مسماة صراحة.
- **Migration:** لا migration مطلوبة لهذا التقرير. إضافة unique indexes/counter scope أو تغيير nullability عند التنفيذ قد تتطلب owner-run Add-Migration بعد تجميد التصميم ومراجعة التكرارات الحالية.
- **Commit:** لا commit للكود لأن المصدر لم يتغير. إذا أرشف المالك التقرير في مستودع الوثائق: `docs: review repository and unit of work logic with project examples`.
- **المحظورات:** لم تُشغل builds أو tests أو lint أو migrations أو DB commands أو browser automation أو Graphify أو Sigma MCP؛ لا commits/push/deploy، ولا full-solution scan.

## 8. متابعة تنفيذ الملاحظة الأولى — 2026-10-02

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| تفويض المالك | «طبق الملاحظة» بعد مناقشة L1 تحديدًا |
| النطاق المنفذ | فرع Company في CodeCreateService فقط |

استُبدل `nameof(Customer)` بـ `nameof(Company)` كمدخل العد في فرع ترقيم الشركات. بيانات الإعدادات والبادئة والطول والتعامل مع الأرقام الحالية ومسار الحفظ لم تتغير. بقيت نتائج المراجعة أعلاه سجلًا للحالة قبل الإصلاح؛ بقية الملاحظات ليست منفذة بهذا الطلب.

- **الدليل:** فحص الفرق في مستودع SigmaBackend أظهر تعديل وسيط واحد في سطر فرع Company؛ `git diff --check` للنطاق خالٍ من أخطاء whitespace.
- **القرار:** إصلاح محدد داخل اعتماد الترقيم القائم، وفق Master وBE 11 والـ skill؛ لا pattern جديد أو تعديل frontend أو DTO أو AutoMapper أو schema.
- **التحقق المتبقي:** مع إعدادات آلية مناسبة، إضافة شركتين بالتتابع والتأكد أن الرقم الثاني يزيد وفق Company count. لم يُشغّل build أو test أو API أو DB command. لا migration مطلوبة.
- **حدود الإصلاح:** يوقف استخدام جدول Customer في عد الشركات؛ قيود Count + 1 والتزامن والدفعات وفلتر إعدادات الاشتراك ما زالت قائمة. الأرقام السابقة لم تُعدل.
- **recipe drift:** الفحص أعيد وأظهر قدم الحزم الثماني؛ استُخدمت الكتب الأصلية، وتجديد الحزم ومراجعتها الدلالية pending للمالك.
- **التفويض:** لا subagents لهذه المتابعة الصغيرة ذات السطر الواحد؛ لا commits أو pushes.
- **رسالة commit مقترحة لمستودع backend:** `fix: count company rows when generating company numbers`.

## 9. متابعة تنفيذ الملاحظة الثانية — 2026-10-02

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| تفويض المالك | «تمام ظبط الملاحظة» بعد شرح L2 |
| النطاق المنفذ | قراءة إعدادات الترقيم في CodeCreateService |

أصبحت الخدمة تستقبل IHttpContextAccessor من DI، وتقرأ الاشتراك من claim NameIdentifier وفق العقد الحالي في Repository وخدمة الإعدادات. استعلام الإعدادات يطلب SubscriptionId الحالي الموجب ويستبعد IsDeleted=true. اشتراك غير صالح لا يقرأ صف إعدادات tenant 0 ولا صف اشتراك آخر؛ يظل fallback الموجود عند غياب الإعدادات، ولا يمثل هذا تنفيذًا لرفض كل عمليات tenant غير الصالح في L7.

- **التوافق:** constructor تغير من Context فقط إلى Context وIHttpContextAccessor. فحص المراجع المباشرة لم يجد `new CodeCreateService(...)`. ServerAPI يسجل HttpContextAccessor بالفعل ويكتشف الخدمة عبر assembly scanning بعمر scoped؛ لا تعديل تسجيل أو interface أو frontend مطلوب.
- **الحدود:** لا سياسة جديدة لاختيار أحدث صف عند تعدد الإعدادات، ولا تغيير للترقيم Count + 1 أو الأرقام السابقة أو JobEstimation. إصلاح L1 السابق محفوظ.
- **التحقق:** مراجعة scoped diff و`git diff --check` تمت؛ بقي التحقق التشغيلي للمالك: اشتراكان ببادئات/أطوال مختلفة، وإعدادات محذوفة أو غائبة، والتأكد أن كل رقم يأخذ إعدادات اشتراكه. لم تُشغل builds/tests/API/DB، ولا migrations/commits/pushes أو أدوات محظورة.
- **المراحل والقرارات:** تصحيح backend مشترك داخل مسار قائم وفق Master/BE 11 والـ skill؛ لا تغيير DTO أو AutoMapper أو schema أو domain calculation. لا migration مطلوبة. لا subagents لتعديل محدود متسلسل.
- **recipe drift:** الحزم الثماني لا تزال قديمة؛ استُخدمت الكتب الأصلية، regeneration والsemantic review pending للمالك.
- **رسالة commit مقترحة لمستودع backend:** `fix: scope document numbering settings to the current subscription`.

## 10. متابعة تنفيذ الملاحظة الثالثة — 2026-10-02

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| تفويض المالك | «ظبط الحل» بعد شرح L3 |
| النطاق المنفذ | عزل Context القراءة العميقة عن Context الحفظ |

**القرار:** الحفاظ على عقد GetByIdDeepAsync العام لتحميل العلاقات، مع تنفيذ القراءة داخل DI scope مستقل. هذا يعيد استخدام تسجيل TContext القائم، ولا ينشئ DbContext يدويًا أو يكرر connection configuration أو يضيف factory خاصة أو endpoint جديدًا. التفاصيل التي تقرأ بعد تغييرات غير محفوظة تعرض البيانات المحفوظة في DB، لا pending changes في Context الكتابة؛ هذا هو عقد القراءة المستقلة.

**تغييرات المصدر:**

- Repository يستقبل IServiceScopeFactory؛ GetByIdDeepAsync ينشئ CreateAsyncScope ويحل TContext منه، ثم يحمّل الجذر والعلاقات داخل readContext فقط. لا Attach على Context الكتابة ولا detach/clear لمدخلاته.
- await using يتخلص من scope وContext القراءة عند النجاح أو root غير موجود أو cancellation أو exception. لا SaveChanges داخل القراءة، ولا تعديل ownership/transaction tracker الخاص بالحفظ.
- helper التحميل أصبح static ويستقبل readContext صراحة في كل recursion وEntry/Model operation. آلية cycle guard الحالية وfilters لم تتغير؛ L5 وباقي حدود navigation ما زالت خارج الإصلاح.
- UnitOfWork يمرر IServiceScopeFactory إلى Repository؛ signature واجهة GetByIdDeepAsync وDTOs ومسار Service.DetailWithNavigationsAsync لم تتغير. تعليق IRepository يصف Context القراءة المنفصل بدل ادعاء AsNoTracking على كل العمليات.

**التوافق والحدود:** DI يوفر IServiceScopeFactory بالفعل؛ ServerAPI يسجل TContext بـAddDbContext وUOW بـscoped. المراجعة المحدودة لمراجع إنشاء Repository/UnitOfWork وجدت استدعاء Repository داخل UnitOfWork فقط، وتم تحديثه. Microsoft.Extensions.DependencyInjection.Abstractions موجودة في dependencies الحالية؛ لا package أو csproj edit. أي مستهلك خارجي ينشئ constructor يدويًا يلزمه الوسيط الجديد. Context القراءة لا يشترك في local transaction الخاصة بContext الكتابة، ولذلك لا يصلح استخدامه بدل tracked load في تحديث aggregate. قد يسبب انتظارًا إذا استُخدم داخل write transaction تقفل نفس الصفوف؛ المستهلكون الحاليون المراجعون يستخدمونه للتفاصيل، وليس كأسلوب قراءة كتابة داخل transaction.

**مثال التحقق:** تعديل Account.Notes ثم قراءة Company أو Account نفسه عميقًا في UOW واحد؛ tracker الكتابة يحتفظ بالسجل وتعديل Notes، والقراءة تعيد كائنًا منفصلًا بلا تعارض مفتاح. إضافة صف جديد قبل القراءة تبقى Added. تُكرر الحالة مع root مفقود ومع cancellation/خطأ تحميل. هذه خطوات تحقق للمالك ولم تُنفذ كتجربة.

**التوثيق:** أضيفت قاعدة عدم تغيير tracker الكتابة في BE block 5 والـ skill §8.2 مع revision-history row، وفق learning protocol. تغييرات المالك السابقة في block 5 محفوظة. لا تغيير frontend/AutoMapper/domain calculation/schema؛ لا migration مطلوبة.

**المصالحة:** روجع scoped diff لجميع ملفات Repos الثلاثة وbook block 5؛ `git diff --check` نظيف. الحزم المولدة قديمة كما أظهر -Check؛ يُستخدم canonical source. لم يُشغّل Check-BookReferences العام لأنه يفهرس كود الحل كله؛ root AGENTS يحظر full-solution scanning، فتم فحص المراجع المضافة وحدها وترك الفحص العام للمالك. لا build/test/lint/API/DB/migration/browser/Graphify/commit/push. لا agents لهذا التعديل المحدود المتسلسل.

**رسائل commit مقترحة:** backend: `fix: isolate deep detail reads from the write context`؛ docs: `docs: document isolated context for deep detail reads`. الـ skill/report خارج مستودع backend حاليًا وفق سياسة نقل instruction layer.

## 11. متابعة تنفيذ الملاحظة الرابعة — 2026-10-02

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| العقد | REPOS_NUMBERING_L4_CONTRACT_FREEZE.md — Frozen |
| تفويض المالك | «ظبط التعديل» بعد اعتماد فكرة counter لكل اشتراك ونوع وحفظه مع graph |

**المنفذ:** Count + 1 أزيل من مسار الأرقام الآلية المهيأة في CodeCreateService. الخدمة تستخدم DocumentNumberCounter الموجود بمفتاح SubscriptionId + DocumentType. تبحث في Local أولًا، ثم DB؛ كل صف في الدفعة يزيد counter المتتبع ذاته، فلا يعيد الصف الثاني قيمة الصف الأول. إنشاء counter يبدأ من أكبر trailing numeric suffix لنفس النوع/الاشتراك، شامل الصفوف المحذوفة والأرقام المهيأة لصفوف Added. counter المحذوف منطقيًا يعاد استخدامه بدل إعادة البداية. لا تغيير لأرقام محفوظة.

**التزامن والحفظ:** CurrentValue أصبح EF concurrency token؛ SQL UPDATE يقارن بالقيمة الأصلية. عند تعديل مستخدمين للcounter نفسه، الطلب المتأخر لا يستطيع overwrite للقيمة: DbUpdateConcurrencyException يوقف save كله وتترجمه middleware الحالية إلى409. عند إنشاء counter لأول مرة متزامنًا، القيد الفريد الموجود يرفض أحد الإنشاءين ويعود409 أيضًا. EF implicit transaction أو transaction المالك تحفظ graph والcounter معًا؛ لا counter-only save ولا per-row save ولا transaction جديدة. بعد تعارض، إعادة المحاولة تكون بطلب جديد، لا reuse أعمى للـ context الفاشل.

**التحقق من أول الإنشاء:** config وModelSnapshot الموجودان يحتويان بالفعل unique (SubscriptionId, DocumentType). لم يُعدّل snapshot أو migration ولم يُفحص DB فعليًا؛ يجب على المالك التأكد أن قيد DB مطبق. CurrentValue token تغير metadata الخاصة بـEF، وليس نوع العمود أو schema. enum members الجديدة في النهاية ولا تغير IDs الحالية. لا migration schema جديدة لازمة لهذا التغيير؛ إذا أراد المالك مزامنة snapshot عبر سير migrations عنده، اسم مقترح `MarkDocumentNumberCounterConcurrency`، ويتوقع مراجعة أي فرق بدل تطبيق تغييرات غير مرتبطة.

**التوافق:** البادئات والفواصل والطول وأجزاء branch/type/date وmanual settings الحالية محفوظة. absent-settings/unknown-type ticks fallback مستمر، فلا يوصف بأنه مسار counter. ticks تاريخية تنتهي بأرقام قابلة للتحليل قد تجعل seed كبيرًا؛ الأرقام لا تقص ولا يعاد ترقيمها. أخطاء mapping لمحفوظات generic Update ما زالت مستقلة.

**JV:** الخدمة العامة تترك No فارغًا لـJournalVoucher ليملأه المولد القائم قبل حفظه؛ JournalVoucherResolver.SaveCoreAsync وOpeningBalanceJournalVoucherHelper ينفذان ذلك بالفعل. عُدّل تعليق كل منهما فقط. هذا يمنع حجزًا عامًا ثم حجزًا ثانيًا بالمولد المختص؛ صيغة JV ومنطق إصداره وإجراءاته المحاسبية لم تعاد كتابتها. JobEstimationService لم يتغير؛ concurrency metadata للcounter المشترك تنطبق على الجميع.

**cancel:** optional CancellationToken أضيف إلى واجهتي ICodeCreateService والتنفيذ؛ مرّر في Repository async Add/Range، وUOW async save preparation، وbase AddCore. المقصود حماية queries/reservation الجديدة، دون تغيير IService العام أو عمليات update/detail المؤجلة. هذا ينفذ أيضًا جزء L9 الخاص بـUOW preparation؛ مسارات أخرى لا تستقبل token ما زالت حسب backlog27.

**الملفات التي تغيرت في backend:** CodeCreateService، ICodeCreateService، DocumentType enum، DocumentNumberCounterConfig، Repository، UnitOfWork، Service.AddCore token forwarding، وتعليق واحد في كل من JournalVoucherResolver وOpeningBalanceJournalVoucherHelper. لا routes/DTOs/frontend/translations جديدة؛ رسائل concurrency409 الحالية موجودة بالعربية والإنجليزية.

**القيد الفريد للأرقام:** لا No index جديد بين كل Partner-derived types؛ هذا يغير نطاق uniqueness بسبب TPT وقد يرفض بادئات تشترك بين أنواع مختلفة. حماية الحجز هنا في unique counter + CurrentValue CAS. قيود No القائمة باقية؛ قيود الأرقام لكتاب SQL/import/custom bypasses وتدقيق تكرارات البيانات السابقة تتبع الخطة الأوسع، ولا تدعي المهمة أنها تصحح أرقامًا مكررة سابقة أو تحمي كل كاتب خارجي.

**الأدلة:** مراجعة المصدر والdiff لجميع الملفات Scoped؛ mapping يغطي الحالات الآلية الموجودة، No غير الفارغ محفوظ، counters لا تملك DTO جديدًا أو dependency circle، middleware409 wired في Program. final focused review بواسطة agent UnitOfWork لم يجد blocker من المصدر؛ أكد CAS/first-create/batch/atomic-save/JV ownership. لا tests أو build أو DB/schema execution، فلا ادعاء بنجاح التزامن أثناء التشغيل.

**التوثيق:** BE11 والbacklog14 والـskill تم تحديثها مع سجل مراجعة؛ خطة الترقيم الأصلية أضيف لها historical partial-execution note مع إبقاء broader Draft. عقد منفصل Frozen يسجل boundaries والقرارات؛ لا pattern موازٍ. تغييرات المالك السابقة محفوظة. الحزم الثماني ما زالت قديمة؛ استخدمنا canonical books. فحص book references العام deferred لأنه يفهرس الحل كله؛ فُحصت المراجع المضافة فقط.

**تحقق المالك:** دفعة من موردين -> رقمان مختلفان؛ اشتراكان -> counters مستقلة؛ حذف منطقي -> أعلى رقم يظل في seed؛ أول counter في طلبين -> واحد success والآخر409؛ counter قائم في طلبين -> لا duplicated committed No؛ فشل حفظ graph -> counter DB لا يزيد؛ JV -> المولد المختص فقط؛ no-change update -> نجاح. فحص snapshot/index/data seed للبيانات القديمة مطلوب. لا commits/push/deploy/migrations/browser/Graphify/SigmaMCP أو full-solution scan.

## 12. متابعة L7 / R2 — 2026-10-03

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

اعتمد المالك رفض الاشتراك غير الصالح بعبارة «تمام نفذ التعديل». نفذت guards لقراءة/كتابة Repository العادية وUOW قبل الترقيم وDbContext قبل الحفظ المباشر في كل overload، مع استثناء محدد إلى Result/401. بقي عقد QueryReport empty fail-closed/global، والـclaim القائم، والحفظ بلا تغيير. العقد والمطابقة والأدلة والحدود وحالات قبول المالك في [متابعة R2](<F:/My Work/Sigma/reviews/REPOS_COMPREHENSIVE_FEATURE_REVIEW.md:222>). لا تعديل لملاحظات المراجعة التاريخية؛ لا schema أو migrations أو tests/builds.

## 13. متابعة الحذف المنطقي / R1 — 2026-10-03

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

اعتمد المالك إصلاح الجزء المتبقي من R1 بـ«تمام». HandleAudit يعيد scalar current values للصف Deleted إلى الأصل، ثم يعلّم حقول الحذف الثلاثة فقط للتحديث؛ original tenant/concurrency values وتعديلات كيانات أخرى محفوظة. تفاصيل التفويض والمطابقة وقبول المالك في [متابعة الحذف](<F:/My Work/Sigma/reviews/REPOS_COMPREHENSIVE_FEATURE_REVIEW.md:273>). لا إعادة كتابة للمراجعة التاريخية ولا تعديل التفعيل أو R2 أو بقية الملاحظات، ولا schema/migration أو اختبارات/builds.

**رسائل commit مقترحة:** backend `fix: reserve batch document numbers with tenant-scoped counters`؛ docs `docs: record shared counter reservation and concurrency rules`. التقرير والعقد والskill محلية خارج repo حتى نقل instruction layer المعتمد.
