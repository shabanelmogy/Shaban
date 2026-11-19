# مراجعة شاملة لمشروع SiGma.Repos — 2026-10-02

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| طلب المالك | مراجعة شاملة لكل محتويات SiGma.Repos.csproj؛ قراءة فقط |
| مرجع المصدر | آخر commit يمس Repos عند المراجعة: `12f3958d` |
| المستودع | `F:\My Work\Sigma\SigmaBackend` |
| حدود النتيجة | فحص المصدر والمسارات المباشرة؛ لا بناء أو اختبارات أو اتصال بقاعدة البيانات |
| التغييرات | إنشاء هذا التقرير فقط؛ لا تعديل مصدر أو إعدادات أو تعليمات |

## نطاق المراجعة وتغطية الملفات

تمت قراءة الملفات الخمسة الموجودة في المشروع بالكامل. لم تقتصر المراجعة على إعدادات csproj. فُحصت مسارات القراءة، التتبع، الكتابة، الحذف المنطقي، العزل بالاشتراك، العلاقات، الترقيم، الأقفال، المعاملات، الإلغاء، والنتائج؛ ثم رُبطت بالمستهلكين المباشرين في Business وServerAPI وDbContext والكيانات والمابنج اللازمة لإثبات الأمثلة.

| الملف | ما تمت مراجعته |
|---|---|
| `SiGma.Repos.csproj` | target framework، الحزم المباشرة، ProjectReference، nullable، analyzers وNoWarn؛ لا custom compile includes/targets داخل الملف |
| `IRepository/IRepository.cs` | جميع العقود، القيود العامة، خيارات الحذف والترتيب والصفحات والتتبع والإلغاء |
| `Repository/Repository.cs` | جميع الدوال العامة والمساعدة، بما فيها معالجة الملكية وreflection والقراءة العميقة وdropdown |
| `UnitOfWork/IUnitOfWork.cs` | مشاركة Context، نتيجة الحفظ، عقد الكتابة المحمية |
| `UnitOfWork/UnitOfWork.cs` | الحفظ المتزامن وغير المتزامن، ترقيم Added، تعارض الملكية، applock، امتلاك transaction |

النمط المختار: بنية persistence مشتركة تخدم أنماط Backend 1–5، وليست شاشة CRUD مستقلة. تمت مراجعة Master ومقاطع Backend 5، 8، 9، 11، 14، 17–19 والـ skill. فحص recipes أعاد أن الحزم الثماني قديمة؛ استُخدمت الكتب الأصلية. المراحل 0 و1 و2 و3 و4 و5 و6 طُبقت كمراجعة للمسارات المناسبة، دون تنفيذ. عقود UI/screenshots/translations وعمليات deployment غير منطبقة. لا قرار schema أو workflow جديد مجمّد بهذا التقرير.

## النتائج الأساسية بالأولوية

### R1 — التفعيل والحذف يمكن أن يكتبا قيمًا قديمة في أعمدة لم يطلب المستخدم تغييرها

**الأولوية:** عالية، P1. **الثقة:** مؤكدة من تركيب المصدر، ويتطلب المثال تزامن طلبين. **المالك:** مسار mutation المشترك وDbContext audit.

**الدليل:** [Repository.UpdateRange:230](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:230>) يستدعي `Context.UpdateRange`، و[Update:164](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:164>) يفعل الشيء نفسه للسجل المفرد. المستهلك الفعلي [Service.HandleActiveAsync:906](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:906>) يقرأ السجلات tracked، يعدل IsActive فقط، ثم يستدعي UpdateRange. هذا يجعل بقية الأعمدة القابلة للتحديث Modified أيضًا. حماية SubscriptionId في [DbContext:45](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs:45>) تتحقق من الاشتراك، وليست version للسجل.

**مثال من المشروع:** طلب `POST /Branch/handleActivate` يقرأ فرعًا اسمه «القاهرة». قبل حفظ التفعيل، طلب آخر يعدل اسم الفرع إلى «القاهرة الجديدة» وينجح. الطلب الأول يحفظ snapshot الاسم القديم مع IsActive، فيرجع الاسم إلى «القاهرة». المستخدم طلب تفعيلًا فقط. Branch يرث HandleActiveAsync؛ [الـ route:49](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/SiGmaControllerBase.cs:49>) موجود. لا يدّعي التقرير حدوث هذه الواقعة فعليًا.

**مسار مماثل في الحذف:** [Repository.Delete:154](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:154>) يصل إلى [HandleAudit:465](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs:465>) الذي يحول Deleted إلى Modified على مستوى السجل، ثم يستثني فقط SubscriptionId وحقول الإنشاء. لذلك حذف Account بعد قراءته في [AccountService:431](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AccountServices/AccountService.cs:431>) يمكن أن يكتب Notes قديمة لو تغيرت بين القراءة والحفظ. الأثر يبقى في بيانات السجل المؤرشف.

**التعديل المقترح:** في العمليات على سجل tracked، حفظ الخصائص المعدلة فقط. HandleActive لا يحتاج فرض UpdateRange على كل الأعمدة. عند تحويل الحذف إلى soft-delete، تعيين حقول الحذف وحدها Modified مع الحفاظ على حماية tenant. الاحتفاظ بعقد detached Update عند الحاجة وعدم تغيير جميع المستهلكين بلا تمييز. حماية تضارب تعديل نفس الحقل قرار مستقل قد يحتاج version. Transaction عادية وحدها لا تمنع كتابة snapshot قديمة.

هذا يتسق مع [تتبع التعديلات في EF Core](https://learn.microsoft.com/en-us/ef/core/saving/disconnected-entities/): التغيير على كائن tracked يكفي للحفظ؛ فرض حالة Update يوسع نطاق الكتابة.

### R2 — غياب اشتراك صالح لا يمنع كل عمليات Repository

**الأولوية:** عالية، P1 مشروطة بوصول الطلب دون claim صالح. **الثقة:** مؤكدة من المصدر؛ لا إثبات أن issuer الحالي يصدر token بهذه الحالة. **المالك:** حد tenant في persistence/auth.

**الدليل:** [constructor:27](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:27>) يترك SubscriptionId صفرًا عند غياب أو فشل قراءة claim. [Query:40](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:40>) وFind تقرأ tenant 0. [AddAsync:143](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:143>) وUpdate/Delete تتجاوز حماية الملكية إذا كانت القيمة غير موجبة. [HandleAudit:443](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs:443>) لا يفرض tenant عند هذه الحالة. بالمقابل QueryReport يرجع فارغًا وExecuteUniqueWriteAsync يرجع401.

**مثال من المشروع:** مسار [BranchService.AddAsync:32](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/BranchService.cs:32>) لا يعلن UniqueColumns، فيستطيع الوصول إلى base.Add دون حارس applock. مستخدم authenticated يحمل NameIdentifier غير رقمي يمر من [السياسة الحالية:77](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Extensions/DependencyResolver.cs:77>) التي تطلب التوثيق فقط. يمكن أن يحاول إنشاء Branch للاشتراك0 إذا سمحت بقية قيود DB. لا تعني هذه الحالة أن Query يرجع كل الاشتراكات؛ هو يقرأ0 تحديدًا.

**التعديل المقترح:** رفض موحد للقراءة والكتابة tenant-scoped عندما لا يوجد اشتراك موجب موثوق، مع استثناء صريح للكيانات العالمية وسياق tenant معتمد لأي أعمال خلفية. لا tenant افتراضي1. استخدام NameIdentifier نفسه مسجل سابقًا في backlog11؛ هذه الملاحظة تخص عدم اتساق التعامل مع قيمته غير الصالحة.

### R3 — القراءة العميقة تتوقف بسبب تكرار النوع رغم اختلاف السجل

**الأولوية:** متوسطة، P2. **الثقة:** مؤكدة. **المالك:** deep loader وعقد التفاصيل.

**الدليل:** [Repository:536](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:536>) يختبر هل زار أي كيان من نوع inverse navigation؛ عند نعم يتجاوز reference أو يمنع recursion للأبناء في [581](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:581>). توجد visited بالمفتاح `(Type, Id)`، لكن شرط النوع يوقف القراءة قبل استخدامها.

**مثال من المشروع:** [Account.Parent/Children](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Accounts/Account.cs:13>) و[ربطهما](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/AccountConfig.cs:46>): A «الأصول» ثم B «السيارات» ثم C «السيارة الأولى». `GET /Account/GetByWithNavigationsId/A` يحمل B، ولا يتعمق إلى C. تفاصيل B تتجاوز Parent A أيضًا، فيمكن أن تكون ParentName فارغة. [AccountDetailVM](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Account/AccountDetailVm.cs:20>) يطلب ParentName وChildren، و[المابنج](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/AccountProfiler.cs:10>) لا يعوض النقص. المسار يصل عبر [Service:1230](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:1230>)؛ endpoint TreeList له تنفيذ آخر ولا يُنسب إليه هذا العيب.

**التعديل المقترح:** منع إعادة زيارة نفس الهوية، وتحديد اتجاهات/علاقات التفاصيل المطلوبة. لا إزالة عمياء لكل الحواجز تؤدي إلى تحميل graph كامل؛ projection أو include paths محددة لعقد التفاصيل أكثر قابلية للمراجعة.

### R4 — الأبناء المحذوفون يعودون عبر العلاقات غير المفلترة

**الأولوية:** متوسطة، P2. **الثقة:** مؤكدة في المصدر؛ البيانات الفعلية لم تفحص. **المالك:** queries/navigation contract.

**الدليل:** [GetAllWithNavigationsAsync:414](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:414>) يفلتر الجذر ثم Include لكل navigation بلا فلترة الأبناء. كذلك النسخة المتزامنة وFindAllByAsync وInclude المرسل إلى Query/FindBy. لم يظهر HasQueryFilter في SiGmaDbContext أو configurations الخاصة به. GetByIdWithNavigations يفلتر collections فقط، أما references في [479](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:479>) وdeep references في [592](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:592>) فتحمل بلا سياسة مماثلة.

**مثال من المشروع:** حذف Account B الذي ParentId له يشير إلى A عبر [AccountService.RemoveAsync:423](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AccountServices/AccountService.cs:423>) يبقي ParentId ويغير IsDeleted فقط. `GET /Account/GetAllWithNavigations` يستبعد B من جذور النتيجة لكنه يعيده في A.Children، التي يعرضها [AccountListVM:27](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Account/AccountListVm.cs:27>).

**حد العزل:** هذه العلاقات أيضًا بلا فلتر tenant إضافي. رابط FK قديم أو مكتوب خارجيًا بين اشتراكين يمكن أن يعبره loader؛ لم يُثبت وجود هذا الرابط أو endpoint حالي يسمح بإنشائه. هذا خطر مشروط، وليس تسريبًا مثبتًا.

**التعديل المقترح:** فلترة الأبناء المملوكين الأحياء حسب عقد القراءة والاشتراك. المراجع التاريخية المحذوفة لها قرار عرض مستقل. أي global query filters تحتاج مراجعة includeDeleted والتقارير والعمليات التاريخية. ومع tracking لا تكفي filtered Include وحدها إذا كانت عناصر غير مناسبة متتبعة مسبقًا؛ [توثيق navigation fixup](https://learn.microsoft.com/en-us/ef/core/querying/related-data/eager/) يشرح ذلك.

### R5 — IsDeleted=null له معنيان مختلفان

**الأولوية:** متوسطة، P2. **الثقة:** مؤكدة؛ ظهور العيب مشروط بوجود صفوف null. **المالك:** فلترة الحذف المشتركة.

**الدليل:** [EntityBase:8](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/EntityBases/EntityBase.cs:8>) يعرف `bool? IsDeleted`. [FindByAsync:305](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:305>) يستخدم `== false`، بينما أغلب القراءات تستخدم `!= true`. [Service.ListQuery:840](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:840>) يعيد التضييق إلى false حتى بعد Query الصحيح.

**مثال من المشروع:** Account قديم يحمل null يظهر في FindById، لكن `POST /Account/handleActivate` لا يجده لأن [HandleActiveAsync:906](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:906>) يستخدم FindByAsync، فيرجع ActivationRecordsNotFound. القائمة العامة نفسها قد تخفيه أيضًا بسبب ListQuery. الافتراضي false عند إنشاء كائن لا يعالج بيانات قديمة null.

**التعديل المقترح:** توحيد شرط «غير محذوف» حسب السياسة الحالية `!= true` في Repository وListQuery. تغيير العمود إلى non-nullable وتنظيف البيانات تحسين schema مستقل.

### R6 — تحميل كل العلاقات في استعلام قائمة واحد يضخم البيانات

**الأولوية:** متوسطة، P2 عند كبر البيانات. **الثقة:** شكل الاستعلام مؤكد؛ زمن التنفيذ وحجم الإنتاج غير مقاسين. **المالك:** query shape.

**الدليل:** [FindAllByAsync:341](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:341>) و[GetAllWithNavigationsAsync:419](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:419>) يضيفان كل العلاقات من EF metadata، بلا اختيار لعلاقات DTO أو AsSplitQuery. مسار GetAll لا يضع حدًا لعدد الجذور. لم يظهر إعداد UseQuerySplittingBehavior في تسجيل Context المباشر.

**مثال من المشروع:** `GET /Company/GetAllWithNavigations` يصل إلى الخدمة العامة. Company يملك Contacts وDrivers، وPartner يملك Documents وCreditCards. لشركة واحدة فيها 5 contacts و10 drivers و4 documents وبطاقتان، وصل مجموعات مستقلة قد ينتج نحو `5 × 10 × 4 × 2 = 400` صف SQL قبل تجميعها في كيانات. هذه أعداد توضيحية وليست قياسًا لقاعدة المستخدم. مراجعة Company DTO لا تبرر تلقائيًا تحميل كل تلك الكيانات كاملة.

**التعديل المقترح:** تحديد projection والعلاقات حسب المستهلك؛ إن كانت عدة مجموعات كاملة مطلوبة، تقييم AsSplitQuery وحدود القراءة. لا تشغيل split عالمي بلا مراجعة الاتساق وعدد round trips. [توثيق Microsoft](https://learn.microsoft.com/en-us/ef/core/querying/single-split-queries/) يوضح أثر وصل المجموعات الشقيقة.

## ملاحظات العقود والتحسينات الأقل أولوية

### C1 — nameSelector لا يأخذ الأولوية دائمًا

**الأولوية:** P3، خلل عقد مثبت دون شاشة مكسورة مثبتة. [GetDropdownAsync:621](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:621>) يحوّل selector إلى delegate، لكنه لا يستعمله في حالات Vehicle/Staff/Driver/Contact/IndividualPartner/MemberPartner/Provision/Location. [VehicleStatusCorrectionService:34](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/VehicleStatusCorrectionService.cs:34>) يمرر PlateNo، وهو يصادف السلوك المضمن، لذلك يعمل حاليًا. لو طلب نفس المستهلك `v => v.No`، يظل الاسم PlateNo رغم الوسيط. الحل إعطاء selector الصريح الأولوية ثم fallback النوع. كذلك materialization الكامل قبل DTO يزيد الذاكرة والتتبع؛ projection للحقول اللازمة أفضل عندما يقبله العقد.

### C2 — حدود paging والحساب العددي غير محمية بالكامل

**الأولوية:** P3. [FindBy:292](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:292>) وFindByAsync:325 وFindAllByAsync:363 تضرب أعداد int بلا تحقق. normalizers في service تحمي الأرقام السالبة المعتادة، لذلك لا أزعم أن `PageNo=0` يكسر القوائم العامة حاليًا. لكنها لا تضع حدًا أعلى لـPageNo؛ [المسار العام:854](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:854>) يعيد الحساب نفسه. مثال `GET /Account?PageNo=2147483647&PageSize=100` يتجاوز سعة int وقد ينتج offset سالبًا بدل صفحة فارغة. لم ينفذ الطلب. المطلوب حساب آمن بـlong وفحص النطاق قبل Skip وسياسة واضحة للقيم غير الصالحة؛ لا تكرار clamp مختلف في كل service.

### C3 — GetManyDeletedAsync يعيد صفوفًا حية

**الأولوية:** P3، مسار كامن خارج Repos مباشرة. [Service:474](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:474>) يستدعي FindByAsync الذي يستبعد المحذوفين، دون predicate للمحذوفين. مثال استدعاء الدالة الموروثة في SupplierService سيعيد الموردين الأحياء، لا المحذوفين. بحث الرمز المحدد في Business وController لم يجد caller أو route؛ لذلك لا يوجد endpoint «قائمة المحذوفين» مثبت أنه مكسور. يحدد المالك هل العقد مطلوب: عند نعم، استخدام Query(includeDeleted:true) ثم IsDeleted==true مع paging الصحيح؛ وإلا إزالة الجذر غير المستعمل في مهمة مصرح بها.

### C4 — الإلغاء لا يصل من بعض endpoints إلى القراءات

**الأولوية:** P3، معروف في backlog27. [FindFirstByAsync:370](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:370>) لا يقبل token أصلًا. مثال `GET /Branch/GetById/{id}` يمر عبر Service.DetailAsync:461 فلا يمكنه إيقاف query بتوقيع العقد الحالي. القراءات العميقة تقبل token في Repository لكن [Service:1230](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:1230>) لا يمرره. المطلوب تحديث السلسلة المشتركة مرة واحدة؛ لا حاجة إلى workaround لكل شاشة. ترقيم UOW أصبح يمرر token بالفعل، فلا يصح إعادة L9 القديمة كعيب قائم.

## اعتماد مباشر عالي الأثر خارج مجلد Repos

### D1 — OnConfiguring يفرض اتصالًا مكتوبًا في المصدر

**الأولوية:** P1، ملاحظة سابقة ما زالت قائمة من المصدر. [SiGmaDbContext:21](<F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs:21>) ينفذ UseSqlServer دون حارس IsConfigured فعال، رغم أن [Program:25](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Program.cs:25>) يمرر ConnStr من إعدادات البيئة.

**مثال فعلي للمسار:** ضبط ConnStr على DB اختبار ثم تشغيل `PUT /Company` لا يضمن اختيارها لأن Context يعيد تهيئة الاتصال من المصدر. ينطبق ذلك على Context القراءة المستقل الجديد أيضًا. لا يُنسخ الاتصال أو بيانات الاعتماد في التقرير، ولم يجر اتصال للتحقق من الوجهة الفعلية. الحل جعل إعداد البيئة/DI صاحب القرار، ومعالجة بيانات الاعتماد المضمنة وفق حالتها الفعلية. [وثائق DbContext](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/) تؤكد أن OnConfiguring يُستدعى حتى مع AddDbContext.

## ما وجدته صحيحًا وما لا أوصي بتغييره لمجرد التبسيط

| العقد | النتيجة |
|---|---|
| الحفظ دون تعديل | SaveChanges وSaveChangesAsync يرجعان true عند اكتمال الحفظ، وهذا صحيح؛ لا إعادة affectedRows>0 |
| مشاركة Context | Repository وUOW يشتركان في Context الكتابة؛ لا يلزم transaction إضافي بسبب وجود navigation properties فقط |
| الحفظ الواحد | EF يحفظ graph والعدّاد في transaction ضمنية واحدة؛ explicit transaction مطلوبة عند تعدد حدود الحفظ أو حماية check/save، لا لكل شاشة |
| tenant token | SubscriptionId في شرط UPDATE/DELETE يمنع الكتابة على صف اشتراك آخر في المسارات المحمية؛ لا يمثل حماية lost-update بين مستخدمين من نفس الاشتراك |
| تعارضات UOW | تعارض ملكية مثبت من database values يرجع false؛ تعارض نفس الاشتراك يعاد رميه إلى middleware409، ولا يتحول إلى نجاح |
| QueryReport | AsNoTracking، fail-closed للأنواع tenant-scoped دون claim، يدعم nullable/nonnullable metadata؛ global reference entities مستثناة عمدًا |
| QueryReport للـ views | نوع بلا metadata للـtenant لا يمكن استنتاج فلتره تلقائيًا؛ guide يحمّل المستهلك مسؤولية فلتر view صراحة |
| ExecuteUniqueWriteAsync | قفل معاملاتي باسم النوع والاشتراك، SQL parameter للresource، ReadCommitted، commit عند success فقط إذا كانت الدالة مالكة transaction |
| transaction قائمة | لا commit من helper للtransaction المملوكة للمستدعي؛ على المالك rollback عند failure؛ لا دليل في العينة على مخالفة هذا العقد |
| ترقيم Added | فارغ فقط، concrete EF type، لا يعاد ترقيم Modified؛ early root assignment وsave preparation متوافقان |
| batch counter | البحث في Local يعيد استخدام counter نفسه للدفعة؛ CAS وunique counter index موجودان في المصدر؛ التحقق من DB والتزامن pending |
| القراءة العميقة | Context مستقل disposed بنهاية await using؛ لا Clear أو Detach في tracker الكتابة؛ إصلاح L3 قائم رغم بقاء R3/R4 |
| signatures | لم يظهر عدم تطابق بين IRepository/IUnitOfWork والتنفيذ في الملفات الحالية |
| الترتيب داخل FindBy paged | tie-breaker بالـId موجود؛ لا أبلغ عن ترتيب غير ثابت في هذه الدوال عند paging |

حدود المعاملات السابقة مبنية على [سلوك EF للمعاملات](https://learn.microsoft.com/en-us/ef/core/saving/transactions/) وعلى المصدر. لا يوجد اختبار تزامن منفذ في هذه المراجعة.

## مراجعة csproj وملاحظات الصيانة

المشروع يستهدف net10.0، وImplicitUsings/Nullable مفعّلان. مراجع EF Core وRelational كلاهما10.0.9، والمرجع الداخلي Helpers. لا تبديل framework أو حزم مقترح بلا مبرر وظيفي. لم ينفذ restore/build أو تدقيق ثغرات الحزم، ولا ادعاء بأن الحزم خالية من الثغرات أو معطوبة.

الملاحظات التالية مسجلة مسبقًا في [قسم production](<F:/My Work/Shaban Documents/Shaban/sigma-erp/master/05-continuous-quality-gates.md:132>)، وتبقى أقل أولوية من منطق الحفظ والقراءة:

- PROD-01: NoWarn يخفي مجموعة واسعة من nullable/async warnings؛ لا يعني ذلك أن كل موضع محمي ناقص أو أن جعل كل الخصائص nullable يعالج المنطق.
- PROD-02: analyzers معطلة للبناء والتحرير؛ لم تُقَس تكلفة تشغيلها أو توجد نتيجة analyzer جديدة في هذه المراجعة.
- PROD-03: Http.Abstractions2.3.11 موجودة هنا وفي Helpers؛ أي انتقال إلى FrameworkReference يحتاج مراجعة المستهلكين معًا. رقم النسخة وحده لا يثبت فشل توافق أو ثغرة.
- PROD-04: CS8669 مكرر؛ تكراره لا يغير السلوك.

تحسينات صيانة: code مكرر بين read methods وownership traversals؛ reflection على كل الخصائص بدل navigations الفعلية؛ اختيار Where reflection بأول overload مطابق جزئيًا؛ FindFirstBy المتزامنة تعمل First بعد AsEnumerable؛ sync Save ينتظر تجهيزًا async. لم أثبت failure حاليًا لهذه المواضع، فلا تُرفع إلى أخطاء وظيفية أو تُستخدم مبررًا لإعادة بناء الطبقة كاملة. عند صيانة loader يفضل اختيار signatures صراحة وEF metadata، مع الحفاظ على العقود.

## إعادة تقييم الملاحظات السابقة

التقرير السابق [REPOS_UNIT_OF_WORK_LOGIC_FEATURE_REVIEW.md](<F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/REPOS_UNIT_OF_WORK_LOGIC_FEATURE_REVIEW.md>) محفوظ كسجل تاريخي؛ أرقام أسطره السابقة لا تمثل المصدر الحالي بالضرورة.

| السابقة | الحالة الحالية من المصدر |
|---|---|
| L1 Company يعد Customer | أصلح؛ Count أزيل لاحقًا من المسار المهيأ كله وأصبح النوع Company في counter mapping |
| L2 settings دون tenant | أصلح؛ tenant الموثوق وIsDeleted!=true موجودان |
| L3 تفريغ write tracker | أصلح؛ read context منفصل |
| L4 دفعة بأرقام متطابقة | أصلح للمسارات الآلية المهيأة بـcounter؛ fallback ticks وخطة formatting ما زالت مستقلة |
| L5 منع recursion بالنوع | ما زال R3 |
| L6 navigation غير مفلترة | ما زال R4 |
| L7 tenant غير صالح | ما زال R2 |
| L8 nullable soft-delete | ما زال R5 |
| L9 token في ترقيم UOW | أصلح ضمن L4؛ فجوات العقود العامة متبقية في C4 |
| D1 اتصال المصدر | ما زال D1 |

## خطوات تحقق المالك وترتيب العمل المقترح

1. على DB اختبار مقصودة، مراجعة D1 أولًا للتأكد من وجهة التشغيل.
2. تنسيق طلب تفعيل Branch وطلب تعديل الاسم بين القراءة والحفظ؛ الاسم الجديد يجب ألا يضيع. تكرار الحالة لحذف Account وNotes.
3. إنشاء/اختيار Account tree بثلاثة مستويات وتجربة endpoint التفاصيل بالعلاقات، ثم مقارنة ParentName وChildren مع المسار المتخصص TreeList.
4. حذف ابن بلا usages مانعة وقراءة GetAllWithNavigations؛ التأكد أنه لا يعود داخل الأب.
5. التحقق من سلوك tenant مفقود/غير رقمي دون الاعتماد على مجرد authenticated، ومن ثبات حماية اشتراك آخر.
6. اختبار بيانات IsDeleted=null إن كانت موجودة، عبر detail/list/activation.
7. قياس استعلام Company بعدد علاقات واقعي قبل قرار projection/split؛ لا تعتمد أعداد المثال كقياس أداء.
8. إعادة تحقق batch counter/first creation/concurrent save/rollback والقيد الفريد في DB، لأن الإصلاح السابق لم يختبر تشغيليًا هنا.

## المصالحة النهائية

- تغييرات التطبيق والـfrontend والـDTOs والمابنج والحسابات: لا شيء. لا migration مطلوبة لهذه المراجعة ولا commit مصدر مقترح.
- artifact الجديد محلي خارج مستودع backend وفق وضع مجلد reviews الحالي. اقتراح commit عند نقله لمستودع الوثائق: `docs: review repository and unit of work behavior`.
- ملفات Repos كانت نظيفة من Git عند البداية، وscoped diff/check لم يظهر تغيير مصدر أثناء المراجعة.
- استخدم مساران مستقلان للتدقيق وفق AGENTS: `repos_query_audit` على gpt-5.6-luna للقراءات، و`repos_writes_audit` على gpt-5.6-sol للكتابة والمعاملات. root راجع الأدلة وغيّر تصنيف المخاطر المبالغ فيه، وتولى recursive loading والتكامل والتقرير. لا agents تعدل ملفات؛ التفويض قلل تداخل فحص ملفات المشروع المشتركة.
- لم تنفذ builds/tests/lint/DB commands/migrations/browser/Graphify/Sigma MCP/commits/pushes/deployment. البحث خارج المشروع اقتصر على رموز المستهلكين والاعتمادات المباشرة؛ لا مراجعة أو مسح كامل للحل.
- guide/skill/source بقيت دون تعديل. drift الخاصة بالrecipes وملاحظات العقود محفوظة في هذا التقرير؛ تحديث التعليمات أو تنفيذ الإصلاحات يحتاج طلبًا مستقلًا.

## متابعة R1 — عقد إصلاح التفعيل والتعطيل — 2026-10-02

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التفويض | «تمام عدل» بعد شرح حفظ IsActive فقط |
| النطاق | Service.HandleActiveAsync؛ جزء التفعيل من R1 |

القرار: FindByAsync يعيد صفوفًا tracked في Context الكتابة الحالي. بعد التحقق من كل IDs وتعديل IsActive، يُستدعى UOW.SaveChangesAsync مباشرة دون فرض UpdateRange. ذلك يحافظ على اكتشاف التغيير في الحقل المطلوب وعلى SubscriptionId الأصلي الذي قرأته query tenant-scoped ويستخدمه EF concurrency predicate. إذا كانت الحالة المطلوبة مساوية للحالة الحالية، فالحفظ ينجح حسب عقد no-change الموجود. قواعد null/empty/duplicates/كل IDs/الرسائل وعقد endpoint وActiveVm تبقى كما هي.

التعديل يعالج فعل التفعيل المحدد؛ مسار تحويل Deleted إلى Modified في DbContext مسجل كجزء باقٍ من R1، ولم يشمله شرح الحل الأخير أو التفويض المحدد. لا تغيير Repository.UpdateRange العام أو mapping أو الترقيم أو query filters. لا API/frontend/schema migration جديدة. قرار concurrent writes لنفس IsActive هو السلوك الحالي؛ لا version أو قفل جديد.

### مصالحة تنفيذ عقد التفعيل

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| تغيير المصدر | Service.cs:911 — حذف استدعاء UpdateRange وإضافة تعليق يوضح field-level tracking |
| حالة R1 | جزء التفعيل أصلح في المصدر؛ جزء soft-delete في DbContext ما زال مفتوحًا |

**المراجعة:** FindByAsync يستخدم Set<TEntity> وToListAsync دون AsNoTracking؛ تسجيل Context المباشر لا يضبط NoTracking افتراضيًا. لذلك الكائنات المحملة تحتفظ بقيمها الأصلية ويكشف SaveChanges تغيير IsActive فقط. HandleAudit للصف Modified لا يفرض حالة Modified لكل الأعمدة ولا يغير الاسم/الملاحظات. SubscriptionId concurrency token باقٍ وقيمته الأصلية من التحميل tenant-scoped، فلا يحتاج هذا المسار إلى التطبيع الذي كان UpdateRange يستدعيه. عند مساواة الحالة المطلوبة بالحالية قد لا يصدر UPDATE، وUOW يرجع true؛ لا عودة لعيب الحفظ دون تغيير.

**التوثيق:** أضيفت القاعدة إلى Backend12 والـskill §8.2(10) مع revision row. تعديلات المالك الموجودة مسبقًا في Backend12 محفوظة؛ scoped diff الكامل في backend والكتاب راجعناه وgit diff --check نظيف. recipes ما زالت قديمة وفق -Check؛ regeneration/semantic review pending. Check-BookReferences العام لم ينفذ لأنه يفهرس الحل كله؛ فُحصت مراجع BE12/BE5 وService/Repository/UOW/DbContext المضافة مباشرة.

**التحقق المتبقي للمالك:** تعطيل/تفعيل صحيح؛ حالة لم تتغير؛ IDs مكررة؛ ID مفقود/محذوف/اشتراك آخر مع ID صالح يجب أن يرفض الجميع قبل التعديل؛ تعديل Branch.Name بين قراءة التفعيل وحفظه يجب أن يبقى. لم تنفذ build أو test أو API أو DB أو browser verification.

**النطاق والمراحل:** discovery/contract ثم إصلاح action المشترك ومصالحة المصدر؛ لا frontend/DTO/route/AutoMapper/domain calculation/schema changes، ولا migration لازمة. لا subagents لأن التعديل صغير ومتسلسل. لم تنفذ أي أدوات أو أوامر محظورة أو commits/pushes. اقتراح backend commit: `fix: preserve unrelated fields during bulk activation`؛ docs commit: `docs: require field-only saves for tracked activation`.

## متابعة R2 — رفض سياق الاشتراك غير الصالح — 2026-10-03

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التفويض | «تمام نفذ التعديل» بعد شرح رفض tenant غير الصالح عند القراءة والكتابة |
| النطاق | Repository للكيانات EntityBase، UOW قبل الترقيم، DbContext عند الحفظ، ومعالجة الاستثناء في middleware القائمة |

**القرار قبل التنفيذ:** غياب NameIdentifier أو فشل تحويله أو قيمة <= 0 يرفض عمليات Repository العادية قبل الاستعلام/تغيير tracker. الاستثناء المحدد يعاد كـ Result محلي برسالة FailToAuth وHTTP401 من middleware الحالية. لا رفض في constructor: إنشاء خدمات التوثيق أو الوصول للكيانات العالمية لا يحتاج اشتراكًا. QueryReport يحتفظ بعقد BE17: tenant-scoped فارغ عند الاشتراك غير الصالح، والكيانات العالمية مستثناة. العقد القائم لمفتاح claim محفوظ؛ نقله إلى claim مستقل في backlog11 خارج النطاق.

عند وجود Added/Modified/Deleted من EntityBase، UOW يرفض الاشتراك غير الصالح قبل الترقيم، وDbContext يرفضه قبل audit/SQL حتى للكتابة المباشرة؛ الحفظ بلا تغيير أو لكيانات عالمية فقط لا يفترض tenant. تغطى نسخ SaveChanges المتزامنة وغير المتزامنة، بما فيها acceptAllChangesOnSuccess، دون تكرار audit. لا fallback إلى SubscriptionId من payload/entity، ولا اشتراك افتراضي، ولا bypass باسم System. لم يظهر hosted/background writer في البحث المحدد؛ SeedDataController مؤمّن ويستخدم Repository أولًا. Login يمرر التوثيق للخدمة الخارجية ولا يقرأ Repository؛ RegisterMobileAsync غير مستهلك في ServerAPI الحالي ويحتوي Add محليًا بلا save، ولا يمنح استثناء tenant جديدًا.

### جدول المطابقة قبل التنفيذ

| Concern | Book | Reference / shared owner | Target contract |
|---|---|---|---|
| Missing tenant | BE18، BE8؛ توجيه المالك R2 | UOW.ExecuteUniqueWriteAsync: <=0 → FailToAuth/401 | Repository tenant reads/writes ترفض الحالة نفسها قبل عملها |
| Save boundary | BE5، BE18 | UOW.PrepareAddedNumbersAsync؛ DbContext.HandleAudit | حارس قبل الترقيم وقبل أي حفظ tenant متتبع |
| Failure shape | BE5، Master5 | AccountingConfigurationExceptionMiddleware.WriteResultAsync | الاستثناء المحدد → Result/401، باستخدام مفتاح الرسالة الموجود |
| Report/global exception | BE17، BE18 | Repository.QueryReport metadata + EntityBaseWithoutSubscription | حفظ empty fail-closed/global policy؛ لا حارس constructor |
| Existing positive tenant | BE18 | Repository graph ownership؛ DbContext SubscriptionId token | حفظ stamping/immutability/ownership conflicts كما هي |

**حدود التنفيذ:** لا UI/DTO/routes/schema/migration، ولا build/tests/API/DB. الحزم الثماني نجحت في Generate-SigmaRecipes -Check عند بداية هذه المتابعة؛ سيعاد قياس drift بعد تعديل الكتب. Repos/DbContext/middleware/Exceptions نظيفة قبل العمل؛ تعديلات المالك الأخرى، خصوصًا migrations/snapshot/resx/Suppliers/Customer reports، خارج النطاق. المراجعة scoped ومتصلة فلا subagents.

### مصالحة تنفيذ R2

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Schema | لا تغيير؛ لا migration مطلوبة |

| العقد / المنتج والمستهلك | دليل المصدر النهائي | النتيجة |
|---|---|---|
| Repository reads → RequireSubscription | 12 موضع قراءة تستخدم TenantSet؛ FindFirstBy يفوض FindBy؛ GetByIdDeepAsync يحرس قبل إنشاء read scope | مطابق في المصدر: لا query على tenant0 |
| Repository mutations → RequireSubscription | Add/AddAsync/AddRange/AddRangeAsync/Update/UpdateRange/Delete/DeleteRange تحرس قبل stamping أو numbering أو tracking | مطابق في المصدر: أزيلت فروع السماح عند <=0؛ حماية graph للاشتراك الصحيح باقية |
| UOW saves → PrepareAddedNumbersAsync | DetectChanges ثم حارس pending EntityBase writes قبل أي استدعاء CodeCreateService | مطابق في المصدر؛ save بلا تغيير يبقى نجاحًا |
| DbContext direct saves → HandleAudit | الحارس يسبق audit؛ save الافتراضي يفوض bool overload، وكل bool overload يشغل audit مرة واحدة قبل base | مطابق في المصدر: sync/async وacceptAllChangesOnSuccess مشمولة |
| Exception → API Result | SubscriptionRequiredException مستقل في Helpers؛ middleware تلتقط النوع قبل بقية catches وتستخدم WriteResultAsync(401, localization[FailToAuth]) | مطابق في المصدر؛ المفتاح موجود en/ar ولم تعدّل resx المالك |
| QueryReport + globals | QueryReport لم يتغير؛ guards/Entry traversal تخص EntityBase فقط؛ لا constructor guard | مطابق للعقد BE17؛ keyless/view predicates مسؤولية المستهلك كما كانت |
| Positive tenant | stamping root/Added graph، immutable existing SubscriptionId، token، numbering/cancellation وownership-conflict handling محفوظة | مطابق في scoped diff؛ runtime pending |

**الملفات:** Repository.cs، UnitOfWork.cs، SiGmaDbContext.cs، AccountingConfigurationExceptionMiddleware.cs، وSubscriptionRequiredException.cs الجديدة. المشاريع SDK تضم المصدر الجديد تلقائيًا؛ Helpers يفعّل implicit usings ويملك Reference مباشرًا لدى Repos وDataAccess. Program يسجل middleware قبل auth/endpoints، فيغطي الاستثناءات الصاعدة من الخدمات. لم تتغير interfaces أو DTOs أو frontend أو الترقيم أو R1/R3–R6.

**التوثيق والتحقق:** راجعت scoped diff الكامل وgit diff --check في backend والكتب بلا whitespace errors. حدّثت BE5/BE8/BE18 والـskill §8.2(5) وrevision؛ صححت اسم helper القديم غير الموجود في BE8 ليتطابق مع المنتج الفعلي. فحص recipes نجح قبل تعديل الكتب ثم أعلن الحزم الثماني stale بعدها؛ regeneration والمراجعة الدلالية pending، ولم تعدل generated files. استُخدمت الكتب الأصلية. لم ينفذ Check-BookReferences العام لأنه يفهرس الحل كله؛ فُحصت أسماء المراجع الجديدة مباشرة. كل قبول هنا source-only، بلا build/tests/API/DB/browser/Graphify/SigmaMCP أو commits/pushes/deployment/migrations.

**تحقق المالك المتبقي:** NameIdentifier غائب، غير رقمي، 0، سالب، خارج int → القراءة العادية/الإضافة/التعديل/الحذف والدفعات تفشل قبل repository work؛ طلب يصل للحارس يرجع401 بالرسالة المحلية. مثبت أن Save مباشر أو UOW مع pending tenant entries يرفض الحالة نفسها قبل SQL/numbering؛ يلزم تجربته sync/async ومع acceptAllChangesOnSuccess=false. اشتراك صحيح → CRUD/children/counters كما هي؛ حفظ بلا تغييرات → نجاح؛ report tenant بلا claim → فارغ؛ global-only save/read → لا حارس tenant. يلزم تأكيد runtime مع إعداد المصادقة الفعلي؛ لا ادعاء أن issuer يصدر token ناقصًا أو أن بيانات tenant0 كانت موجودة.

**اقتراحات commits:** Backend: `fix: reject invalid subscription contexts before persistence`. Documentation: `docs: define tenant guards for repository and save boundaries`.

## متابعة R1 — حفظ حقول الحذف المنطقي فقط — 2026-10-03

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التفويض | «تمام» بعد شرح تعديل HandleAudit ليحفظ IsDeleted/DeletedBy/DeletedAt فقط |
| النطاق | فرع EntityState.Deleted في SiGmaDbContext.HandleAudit؛ الجزء المتبقي من R1 |

**القرار قبل التنفيذ:** الحذف المعلّم عبر Repository.Delete/DeleteRange أو Context.Remove يصبح تحديثًا لحقول الحذف الثلاثة فقط. تُستعاد scalar current values للسجل المحذوف من OriginalValues قبل تغيير حالته إلى Unchanged ثم تعيين حقول الحذف وIsModified لها صراحةً. ذلك يمنع DetectChanges التالي من إعادة إدخال تعديلات أخرى سبقت Remove على السجل نفسه. لا تغيير للقيم الأصلية أو tokens؛ تحفظ OriginalValue الخاصة بـSubscriptionId وباقي concurrency tokens في شرط الكتابة. لا تعديل أو Clear للـtracker كله، ولا إسقاط تعديلات كيانات أخرى. scalar edits غير المحفوظة على الصف المختار للحذف ليست جزءًا من أمر الحذف؛ تحفظ العمليات التي تقصد تعديلًا آخر على كيان مختلف، مثل Account.Parent.AllowChildren، كالمعتاد.

| Concern | Book | Reference / shared owner | Match المطلوب |
|---|---|---|---|
| حدود أمر الحذف | BE8، BE18؛ توجيه المالك R1 | HandleAudit.Deleted؛ Repository.Delete/DeleteRange | تحديث حقول الحذف فقط بدل فرض Modified لكل الأعمدة |
| حفظ graph والعمليات التابعة | BE5، BE8 | Service.MarkRemovedAsync/RemoveWithChildrenAsync؛ AccountService.RemoveAsync | كل صف Deleted يعالج منفردًا؛ بقية صفوف Modified/Added كما هي |
| حماية الاشتراك | BE18 | Repository.ProtectTenantOwnershipForWriteGraph؛ DbContext.HandleAudit/OnModelCreating | positive-tenant guard، immutability، original concurrency predicate محفوظة |
| الحفظ | BE5 | SaveChanges sync/async وكل bool overload → HandleAudit | نفس إصلاح audit لكل حدود الحفظ دون transaction/save إضافي |

**المطابقة الفنية:** مراجعة مصدر EF Core 10.0.9 الخاص بـ[EntityEntry.State](https://github.com/dotnet/efcore/blob/v10.0.9/src/EFCore/ChangeTracking/EntityEntry.cs) و[InternalEntryBase](https://github.com/dotnet/efcore/blob/v10.0.9/src/EFCore/ChangeTracking/Internal/InternalEntryBase.cs) توضح أن Deleted → Unchanged وحدها تمسح modified flags دون ضمان إرجاع scalar differences إلى الأصل؛ لذلك إعادة CurrentValues للأصل جزء مقصود من الحل، باستخدام public API فقط. هذه قراءة مصدر وليست اختبار SQL/تزامن.

**الحدود والبداية:** DbContext نظيف في Git قبل هذه المتابعة (SHA256 08EC4485BCF58DAE7BC4CAE29BE090BEC36150FE110F03B62ABD089F7C1C968F). تغييرات R2 في BE5/BE8/BE18 والـskill محفوظة. recipes الثماني stale؛ نستخدم الكتب الأصلية، ولا نعدل generated. النمط shared persistence/action، UI/DTO/route/mapping/calculation/schema غير منطبقة؛ لا migration. لا subagents لصغر الإصلاح وترابطه، ولا build/tests/API/DB/migrations أو full-solution scan.

### مصالحة إصلاح الحذف

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| المصدر | SiGmaDbContext.cs:477 — فرع Deleted فقط |
| حالة R1 | إصلاحا التفعيل والحذف موجودان في المصدر؛ قبول التزامن التشغيلي ما زال pending |

| المنتج / المستهلك | المقارنة النهائية | النتيجة |
|---|---|---|
| Repository.Delete/DeleteRange → HandleAudit.Deleted | Remove يحافظ على حارس الاشتراك وoriginal tenant token؛ audit يستعيد scalar baseline ثم يعلّم حقول الحذف الثلاثة | مطابق في scoped source؛ SQL runtime pending |
| EF DetectChanges → الحفظ | CurrentValues.SetValues(OriginalValues) لا يستبدل original snapshot؛ لا تبقى scalar differences غير حقول الحذف لتوسيع التحديث | مطابق حسب المصدر المقروء؛ لا disable للتتبع ولا AcceptAllChanges قبل save |
| Service.MarkRemovedAsync/RemoveWithChildrenAsync → الحفظ | كل root/owned entry بحالة Deleted يعالج بالفرع نفسه، وModified/Added يستخدمان الفرعين السابقين | مطابق في المصدر؛ ملكية/usage checks والمخرجات لم تتغير |
| AccountService.RemoveAsync → parent update | تعديل parent.AllowChildren على كيان آخر يبقى Modified؛ استعادة baseline تخص الصف المحذوف فقط | مطابق في المصدر؛ لا Clear/Detach/إعادة ضبط entries أخرى |
| جميع حدود SaveChanges | sync/async وbool overloads تفوض HandleAudit الموجودة من R2 | مطابق؛ no-change-success وinvalid-tenant rejection محفوظان |

**المراجعة:** scoped diff الكامل في backend يتضمن فرع Deleted وحده (7 إضافات/4 حذف)، وgit diff --check نظيف. BE8 وBE18 راجعنا diff الكامل لهما مع الحفاظ على تغييرات R2 السابقة؛ الـskill أضيف لها §8.2(11) وrevision. source types/tokens/overload signatures لم تتغير. لا helper أو service أو class أو transaction/save جديد، ولا تغييرات frontend/API/DTO/maps/domain/schema/migrations. لا subagents لأن الملفات والقانون متصلان ولا مساران مستقلان.

**اختبارات المالك المتبقية، لم تنفذ:** حذف Account صالح مع بقاء No/Notes/CreatedAt/CreatedBy؛ طلب آخر يعدّل Notes بين تحميل الحذف وحفظه فتظل القيمة الجديدة بعد soft delete؛ تغيير scalar ثم Remove في context واحد يحفظ حقول الحذف فقط؛ تعديل صف آخر في الحفظ نفسه يظل محفوظًا (مثل الحساب الأب). حذف detached stub وDeleteRange، وحذف Company/owned children تحت mapping الحقيقي، مع تأكيد absence of hard DELETE وعدم تحديث أعمدة derived غير المطلوبة. تجربة رفض tenant آخر أو claim غير صالح، وتعارض tokens القائمة، وsync/async/acceptAllChangesOnSuccess=false. No-change Update يبقى نجاحًا. كل نتيجة هنا source-only وليست SQL أو compile أو runtime pass.

**التوثيق والحزم:** Generate-SigmaRecipes -Check أعاد stale للحزم الثماني في بداية المتابعة ونهايتها؛ تستخدم الكتب الأصلية، وregeneration/semantic review pending. لا تعديل generated packets أو تشغيل Check-BookReferences الذي يفهرس الحل؛ تمت مراجعة أسماء المنتج/المستهلك المحددة أعلاه. لم تنفذ build/test/lint/API/DB/browser/Graphify/Sigma MCP/migration/commit/push/deploy أو full-solution scan.

**اقتراحات commits:** Backend: `fix: update only audit fields during soft delete`. Documentation: `docs: require field-only soft deletion`.

## توضيح نطاق R3 — 2026-10-03

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| التفويض | سؤال توضيحي: دليل الحسابات له method خاصة؛ هل المشكلة تتكرر في مكان آخر؟ قراءة فقط |

تأكيد المالك صحيح: قائمة شجرة الحسابات في Angular تستخدم AccountService.getTreeList → GET /Account/TreeList → AccountService.GetAccountNestedListAsync. هذا المسار يقرأ Accounts باستعلام projection ويبني الشجرة من ParentId، ولا يستدعي GetByIdDeepAsync. كذلك نموذج تفاصيل الحساب الحالي يستخدم BaseService.getById → GET /Account/GetById، لا endpoint العلاقات العام في مثال R3. المثال السابق يخص endpoint الموروث /Account/GetByWithNavigationsId تحديدًا، ولا يثبت عيبًا ظاهرًا في شجرة الحسابات الحالية.

العيب في شرط النوع داخل Repository.LoadNavigationsRecursiveAsync مشترك؛ أي مسار يستعمله قد يتوقف عن التعمق عندما يكون inverse declaring type قد زير، ولو كانت الهوية الجديدة مختلفة. يوجد مستهلك فعلي آخر: CompanyPartnerService.getDetails → GET /Company/GetByWithNavigationsId → Service.DetailWithNavigationsAsync → GetByIdDeepAsync (CompanyService بلا override لهذا العضو). Driver endpoint يستخدم العقد العام أيضًا. وجود المستهلك وحده لا يثبت نقص بيانات لازمة للواجهة: CompanyDetailVM يطلب Drivers/Documents/Contacts، ويجب إثبات علاقة مطلوبة بعينها تتأثر بالشرط قبل تغيير التحميل العام. لم تُثبت شاشة أخرى ناقصة فعليًا في هذه القراءة، ولم تنفذ API/runtime أو تعديل مصدر/دليل/skill. لذلك يبقى إصلاح R3 مقترحًا، ولا نزيل حواجز النوع عشوائيًا لمجرد المثال؛ العلاقات المطلوبة وأثر حجم graph بحاجة إلى تحديد ضمن عقد التنفيذ.

### قرار تأجيل R3 — 2026-10-03

المالك: «تخطاها الوقتى وممكن نعمل ملف حالات مشكوك فيها فى documentation».
أُجّل تنفيذ R3، وسُجلت كـ SUS-001 في
[سجل الحالات التي تحتاج دليلًا إضافيًا](<F:/My Work/Shaban Documents/Shaban/sigma-erp/UNCERTAIN_CASES.md>)
مع الفرق بين شرط المصدر المؤكد والأثر غير المثبت في الشاشة، وتصحيح مثال TreeList،
والدليل المطلوب للعودة. أُضيف رابط في README الخاص بالتوثيق.
لا تعديل application source أو skill، ولا اختبارات/builds/API/DB أو commits.
الـskill يحتفظ بالقواعد المثبتة؛ الاشتباه الحالي محفوظ في سجل المتابعة.

## توضيح موضع ظهور R4 — 2026-10-03

سؤال المالك «ممكن تظهر فين» فُحص من المصدر فقط. المثال المحدد القابل للتحقق
هو GET /Account/GetAllWithNavigations، وليس /Account/TreeList الذي تستخدمه
شاشة دليل الحسابات الحالية. AccountController يرث route العام، وAccountService
لا يجاوز GetAllWithNavigationsAsync؛ Service يمرر Repository output إلى
AccountListVM الذي يحتوي Children، وAccountProfiler لا يفلترها. Repository
GetAllWithNavigationsAsync يطبق IsDeleted != true على الجذور ثم Include غير
مفلتر على Children. AccountConfig لا يضيف HasQueryFilter، والحذف يبقي ParentId.
لذلك عند وجود ابن محذوف منطقيًا لأب حي يمكن أن يرجع داخل children للأب رغم
غيابه كصف مستقل في entities. البيانات الفعلية والاستجابة التشغيلية لم تُفحص.

التحميل العميق لتفاصيل Company مختلف: collections فيه لديها شرط IsDeleted
!= true، فلا نستنتج من مسار GetAll أن drivers/documents المحذوفة تظهر في
الشاشة الحالية. لم يظهر استخدام GetAllWithNavigation في نطاق Angular
Account/Companies المفحوص. مثال endpoint مثبت من المصدر؛ ظهور عيب مرئي في
واجهة أخرى ما زال يحتاج ربط مستهلك محدد وتجربة بيانات، ولا تعديل مصدر في
هذه المتابعة. لا build/tests/API/DB/browser أو full-solution scan.

### مثال R4 خارج TreeList — Clause Type في Closed Lease Agreements

استجابة لسؤال المالك عن مسار غير شجري، ثبت الربط التالي من المصدر:

- route `closedLeaseAgreements/create` و`details/:id` موجود في `src/app/pages/routing.ts:1723` وملف routes الخاص بالميزة.
- `details.component.ts:322` يستدعي `ClauseService.GetAllWithNavigation`، أي `GET /Clause/GetAllWithNavigations`. عند `:373` يبني خيارات Clause Type من `item.clauseType?.name` و`item.clauseTypeId`؛ القالب `details.component.html:225` يعرضها كخيارات قابلة للاختيار.
- ClauseController وClauseService يستخدمان العقد العام دون override لهذا العضو. `Service.GetAllWithNavigationsAsync:1219` يمرر ناتج Repository إلى ClauseListVM؛ ClauseProfiler لا يفلتر ClauseType. `Repository.GetAllWithNavigationsAsync:379` يفلتر Clause الجذر فقط ثم Include غير مفلتر لعلاقة ClauseType. إعدادات Clause/ClauseType لا تضيف query filter.
- `LeaseAgreementService.AddAsync:199` ينشئ Clause مستقلًا داخل agreement.Clauses ويحفظ ClauseTypeId. `ClauseTypeService.RemoveAsync:165` يحذف النوع وقوالبه فقط؛ `TemplateClauses:188` يشترط `LeaseAgreementId == null`، فيبقى بند العقد المرتبط بهذا النوع حيًا بعد حذف النوع.

المثال الشرطي المحدد: نوع «الصيانة» استُخدم في عقد، ثم حُذف النوع. البند داخل العقد يبقى حيًا، فيرجع مع ClauseType المحذوف عبر endpoint العام؛ واجهة Closed Lease Agreements تستخدم اسمه لبناء dropdown، فيمكن أن يظهر النوع المحذوف ضمن الخيارات الحالية. هذا reference navigation وليس شجرة أو children hierarchy. ظهور الاسم في مستند قديم قد يكون مطلوبًا لحفظ التاريخ؛ محل الأثر هنا استعمال العلاقة المحذوفة في قائمة اختيار حالية. لم يُتحقق من وجود هذه البيانات في DB، ولا من تشغيل endpoint؛ النتيجة استنتاج من مسار المصدر المنتج والمستهلك، وليست حادثة تشغيلية مثبتة.

Sales Agreement يستخدم GetAllWithNavigation أيضًا، لكن قائمة CarModel تعرض `name` لا `Make.Name`؛ لذلك لا يُستخدم كدليل على ظهور Make محذوف في dropdown. لا تعديل application source أو guide/skill؛ لا build/tests/API/DB/browser أو delegation في هذا التوضيح.

## عقد إصلاح قائمة Clause Type — 2026-10-03

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التفويض | «تمام» ثم «كمل» بعد شرح مصدر dropdown وحفظ عرض النوع في العقد القديم |
| النطاق | lookup واسم النوع في تفاصيل Closed Lease Agreements؛ لا إصلاح عام للـ Repository |

**القرار:** Create/Edit يقرأ `GET /ClauseType/GetSelect` عبر LeaseClauseService القائمة وBaseService.getSelectList، باستخدام Results<DropDownSelect> وoptionLabel=value/optionValue=id. لا استخراج خيارات من بنود العقود ولا إعادة الأنواع المحذوفة إلى الخيارات الحالية. View يعرض اسم النوع من تفاصيل البند، ولا يطلب lookup الأنواع؛ استجابة LeaseAgreement الحالية لا تحمل الاسم، لذلك يضاف ClauseTypeName nullable إلى Detail VM وprojection داخل DetailCoreAsync فقط. المصدر ClauseType المرتبط بالبند يشترط الاشتراك نفسه، ويسمح بحذفه منطقيًا لهذا العرض التاريخي. لا إعادة بناء تاريخ الاسم وقت إنشاء العقد ولا تخزين snapshot جديد. غياب علاقة صالحة يعرض «—» ولا يخترع اسمًا. الحفظ يتحقق كما هو من الأنواع الحية، ولا يتغير قبول عقد قديم يحمل نوعًا محذوفًا أثناء Update.

**الشكل:** إصلاح lookup في محرر routed/steps قائم؛ backend عقد قراءة قائم لعقد مالي، وإعادة استعمال lookup entity العادي. ليس refactor كاملًا للشاشة. لا تعديل الحسابات/المحاسبة/الترقيم/lifecycle/الأفعال/الـRepository/كيانات أو EF. لا migration. scoped files نظيفة قبل التعديل؛ تغيرات المالك الأخرى محفوظة. Generate-SigmaRecipes -Check أعاد OK للحزم الثماني. يطبق الجزء المطلوب من PHASE-03 مع integration وsource reconciliation؛ لا grid/action/schema phases أو agents لأن العمل صغير ومتسلسل.

| Concern | Owning block | Reference / shared owner | Target match |
|---|---|---|---|
| Lookup API and binding | UI2/16، BE10 | BaseService.getSelectList؛ LeaseClauseService constructor=ClauseType؛ base SelectAsync/GetDropdownAsync | id/value/no لا navigation graph، tenant/live predicate قائم |
| Historic display | UI15، BE3، Master4 | sigma-field__read؛ LeaseAgreement DetailCoreAsync projection | ClauseTypeName من العلاقة بنفس الاشتراك؛ خارج write payload والخيارات |
| Request lifetime / errors | UI22/28 | interceptor الحالي؛ takeUntilDestroyed/finalize؛ Company reference lookup consumers | local lookup loading؛ cleanup في كل مخرج؛ errorInterceptor يملك الرسالة مرة واحدة |
| Shared extraction / learning | Master5، UI16، skill6 | getSelectList وsigma-field__read موجودان | لا shared component جديد؛ توضيح فصل selectable IDs عن أسماء العلاقات التاريخية في UI16 والـskill |

### مصالحة التنفيذ — قائمة Clause Type

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| R4 العام | ما زال مسجلًا؛ أصلح المستهلك المحدد فقط، دون تغيير سياسة Repository العامة |

**الملفات:** Angular details.component.ts/html وmodels/details.ts؛ Backend LeaseAgreementService.cs وLeaseAgreementClauseDetailVm.cs؛ UI16 والـskill §6/revision؛ هذا التقرير. ملفات المصدر الخمسة كانت نظيفة قبل التعديل، وراجعت diff الكامل في كل repository مع الحفاظ على بقية تعديلات المالك.

**مطابقة العقد:** LeaseClauseService الجاهزة تستخدم ClauseType؛ getSelectList يطلب GetSelect؛ base SelectAsync يقرأ GetDropdownAsync الذي يفلتر الاشتراك وIsDeleted != true. Dropdown يربط value/id مباشرة، وCreate يطلب الخيارات؛ View لا يطلب lookup Clause Type، ويقرأ ClauseTypeName من تفاصيل البند. Edit يستدعي lookup عند الضغط Update، ولا يدمج أسماء الأنواع المحذوفة في الخيارات الحالية. نوع موجود بلا أي قالب يظهر أيضًا لأنه النوع نفسه هو مصدر الاختيارات. نجاح lookup فارغ يبقى نجاحًا؛ كلا failure channels يفرغان الخيارات، وinterceptor القائم يعرض الرسالة مرة واحدة، وfinalize يعيد local loading في النجاح والفشل والإلغاء. takeUntilDestroyed موجود. لا إعادة كتابة طلب GET في خدمة ولا خدمة/DTO للـlookup جديدة.

**الاسم التاريخي:** أضيف string? ClauseTypeName إلى response VM، وDetailCoreAsync يختار Name من ClauseType المرتبط بنفس اشتراك العقد دون استبعاد soft-deleted reference. الشرط على Clause الجذر داخل المجموعة يبقى live ونفس الاشتراك؛ لا رجوع لبند محذوف. Angular read model يحمل string|null optional ويعرض الاسم في View أو «—» عند غيابه. الاسم لا يدخل form/write payload. Add/Delete للبنود معطلان في View لحفظ ترتيب العرض للصفوف المحملة؛ Create/Edit يحتفظان بالأفعال. GetExtendRatePeriodContextAsync يشارك نوع VM لكنه لا يعرض الاسم هنا، فالقيمة الجديدة optional/null في هذا المسار ولا تعديل طلبه أو قواعده. لا snapshots أو EF/entity changes أو migration. لا AutoMapper/calculation changes، فالقراءة projection مباشرة. التحميلات والـpayloads القديمة الأخرى في الشاشة خارج إصلاح lookup الضيق؛ لا ادعاء بمطابقة الشاشة كاملة أو إصلاحها كاملة.

**حدود البيزنس:** عرض اسم النوع بعد soft delete يعتمد على علاقة النوع الموجودة؛ ليس snapshot للاسم وقت إنشاء العقد. Write validation الحالي يرفض نوعًا محذوفًا، بما في ذلك Update لعقد يحتفظ بهذا النوع؛ لم يُخفف ذلك ولم تُخترع قاعدة حفظ للمراجع القديمة. TreeLists ومسارات Accounts/JobEstimation دون تغيير.

**التحقق:** scoped git diff --check نظيف في frontend/backend/docs، لا merge markers في ملفات التطبيق الخمسة؛ تعريف PrimeNG Dropdown.loading موجود في المكتبة المحلية. لا imports باقية لـClauseService/GetAllWithNavigation في المستهلك. controller/routes/inherited GET checked، ولا provider أو interceptor جديد. القوالب تستخدم عنوان clauseType وترجمات موجودة، وsigma-field__read مشتركة دون SCSS جديد. Scope صغير متسلسل، فلا subagents. لم تنفذ build/tests/lint/browser/API/DB/migration/Graphify/Sigma MCP/full-solution scan/commit/push/deploy. -Check كان OK قبل تحديث UI16؛ الحزم الثماني أصبحت stale بعده، regeneration وsemantic review pending للمالك، ولا تعديل generated files.

**تجربة المالك المتبقية:** Create يعرض الأنواع الحية مرة لكل نوع حتى بلا قالب؛ النوع المحذوف لا يظهر. View لعقد يحتفظ بالنوع المحذوف يعرض الاسم من التفاصيل ولا يرسل ClauseType/GetSelect. Edit يطلب الأنواع الحية؛ Save بنوع حي يمر، وبمحذوف يبقى مرفوضًا بالتحقق الحالي. اختبر lookup فارغ وفشل HTTP وإلغاء التنقل، وغياب/اختلاف اشتراك علاقة النوع يعرض «—»؛ تحقق اللغتين وعرض picker المنقول إلى body.

**اقتراحات commits:** Frontend `fix(lease): use live clause types for agreement choices`؛ Backend `fix(lease): return historical clause type names in details`؛ Documentation `docs(ui-book): separate live choices from historical labels`.

### تصحيح دليل wiring أثناء المصالحة

آخر فحص للخدمة المحلية كشف أن constructor في closedLeaseAgreements.service.ts يستخدم `closedLeaseAgreementss`؛ لا Controller أو alias بهذا الاسم في ServerAPI المفحوص. لذلك الإشارة السابقة إلى كون GET التفاصيل متصلًا بـLeaseAgreement لم تكن مثبتة. مسار خيارات Clause/GetAllWithNavigations كان موجودًا فعلًا وبقي دليل ظهور الاختيار، لكن عرض العقد القديم يحتاج تصحيح قراءة التفاصيل أيضًا.

قبل تعديل wiring: تقرر تمديد النطاق بالقراءة المحددة فقط إلى endpoint الـaggregate القائم `GET /LeaseAgreement/GetByWithNavigationsId/{id}`، حتى يستهلك View الاسم الجديد. أضيف `getAgreementDetails(id)` typed إلى الخدمة المحلية ويستخدم HttpClient الموروث وenvironment.baseUrl وencodeURIComponent؛ المستهلك يستدعيه بدل القراءة على controller غير موجود. لا تغيير constructor أو get/POST/PUT/DELETE الأخرى، لأن إعادة توجيهها تغير نطاق القائمة وعملياتها وهي خارج إصلاح lookup/العرض المصرح به. هذا ليس إثباتًا لصلاحية CRUD القديم للشاشة؛ يبقى عملًا منفصلًا. المرجع موجود في LeaseAgreementService الأصلية getDetails وLeaseAgreementController الموروث؛ الخدمة الأصلية route-provided وليست root فلا أضفت provider أو service موازية لمجرد هذا الطلب.

ملف frontend رابع ضمن النطاق: `closedLeaseAgreements/services/closedLeaseAgreements.service.ts`، نظيف قبل التعديل. المطابقة النهائية للقراءة أصبحت: getAgreementDetails → LeaseAgreementController.GetByIdWithNavigationsAsync → LeaseAgreementService.DetailWithNavigationsAsync → DetailCoreAsync → ClauseTypeName. مصدر الاختيارات مستقل: LeaseClauseService → ClauseType/GetSelect. لا mutation routing جديد ولا migration؛ runtime لكلا الطلبين pending للمالك.

## قرار متابعة R6 مع مراجعات القوائم — 2026-10-03

المالك: «ممكن تذكرها فى الملاحظات انا طبيعى براجع كل القوائم».
سُجلت الملاحظة كـ SUS-002 في
[سجل المتابعة](<F:/My Work/Shaban Documents/Shaban/sigma-erp/UNCERTAIN_CASES.md>)
لمراجعة الاستعلام والعلاقات المطلوبة مع كل قائمة. يبدأ التحقق من endpoint
الذي تستدعيه الشاشة، ثم مطابقة البيانات المحملة مع ListVM وأعمدة القائمة.
المثال العام لـCompany لا يثبت بطء الشاشة الحالية: MaterializeListAsync
يستخدم بالفعل ProjectTo. تحميل العلاقات العامة مؤكد من المصدر؛ أثر الأداء
على شاشة محددة غير مقاس. لا تعميم لـAsSplitQuery أو تعديل Repository في هذه
المتابعة؛ التغيير توثيقي فقط، دون تعديل التطبيق أو تشغيل اختبارات أو API/DB.
