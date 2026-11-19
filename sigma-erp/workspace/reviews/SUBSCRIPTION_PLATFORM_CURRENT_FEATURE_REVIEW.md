# مراجعة الوضع الحالي لمنصة الاشتراكات

| البند | الحالة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| نوع العمل | مراجعة مصدرية للوضع الحالي فقط |
| النطاق | `SiGma.SubscriptionAPI` و`SiGma.CustomerMVC` والعقود المباشرة بينهما |
| التنفيذ | لم تُعدّل ملفات التطبيق |

## ١. المطلوب والنطاق الفعلي

المطلوب هو مراجعة برنامج الاشتراكات كما هو موجود الآن. لذلك شملت المراجعة
بوابة MVC العامة ولوحة الإدارة وعميل HTTP، وخدمة SubscriptionAPI ومتحكماتها
وخدمات التسجيل والتجهيز ودورة الاشتراك والفوترة والدفع والاقتباسات والاستخدام
والتقارير، مع الكيانات وواجهات العرض والإعدادات اللازمة لإثبات العقد.

لم أغيّر التطبيق أو عقد API أو إعدادات الأمان أو المخطط. لم أدخل في اختيار
تقنية واجهة أخرى؛ القرار الحالي هنا هو وصف الوضع الموجود وتحديد ما يجب ضبطه
قبل الاعتماد عليه.

## ٢. طريقة المراجعة والمصادر

قُرئت تعليمات مساحة العمل والرفيق الحي وقواعد Sigma ومهارة
`sigma-screen-refactor` وكتل الخلفية الخاصة بالكيانات وEF والعقود والخدمات
والتحقق والحذف والتقارير. فحص التبعيات وخريطة الطلبات تم من المصدر التالي:

- `F:\My Work\Sigma\SigmaBackend\SiGma.SubscriptionAPI\Program.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.SubscriptionAPI\Controllers\SubscriptionPlatformControllers.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.SubscriptionAPI\Services\SubscriptionPlatformServices.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.SubscriptionAPI\Jobs\SubscriptionPlatformJobs.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.SubscriptionAPI\DataAccess\SiGmaSubscriptionDbContext.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.SubscriptionAPI\DataAccess\Configurations\SubscriptionPlatformConfigurations.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.CustomerMVC\Controllers\HomeController.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.CustomerMVC\Controllers\AdminController.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.CustomerMVC\Services\SubscriptionApiClient.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.CustomerMVC\Services\SubscriptionResourceRegistry.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.CustomerMVC\ViewModels\Admin\SubscriptionAdminViewModels.cs`
- `F:\My Work\Sigma\SigmaBackend\SiGma.CustomerMVC\Views\Home\Index.cshtml`
- `F:\My Work\Sigma\SigmaBackend\SiGma.CustomerMVC\Views\Admin\Resource.cshtml`

فُحص دليل Speed وشرحاته وفهرس كوده بشكل انتقائي. وُجد عنوان عام متعلق
بالاشتراكات والفوترة في فهرس المكتبة، لكن لم يوجد مسار شاشة مطابق لدورة
SubscriptionAPI الحالية يمكنه إثبات قواعد Sigma. لذلك لم تُستخدم مادة Speed
لإثبات قواعد التسعير أو الدفع أو التجهيز. مرجع Odoo المحلي خاص بدورة تأجير
السيارات ولا يثبت عقد الاشتراكات الحالي، فاعتُبر غير منطبق. فحص حزم الوصفات
الثماني اجتاز التحقق قبل المراجعة.

## ٣. خريطة الوضع الحالي

بوابة `CustomerMVC` تعمل كواجهة MVC عامة ولوحة إدارة. الصفحة العامة تستدعي
الخطط العامة، وترسل طلب عرض سعر أو تسجيل مستأجر وتجربة. لوحة الإدارة محمية
بكوكي MVC محلي، وتستدعي عميل HTTP واحدًا لعرض التقارير وتنفيذ CRUD انعكاسي
للموارد المسجلة في `SubscriptionResourceRegistry`.

خدمة `SubscriptionAPI` تحفظ منصة الاشتراكات في قاعدة مستقلة عبر
`SiGmaSubscriptionDbContext`. تحتوي المنصة على المنتجات والإصدارات والوحدات
والميزات والخطط والمستأجرين والاشتراكات وخطوات التجهيز والفواتير والمدفوعات
والاستردادات والاقتباسات والاستخدام وسجل التدقيق. يوجد Security محلي منفصل،
لكن SubscriptionAPI لا يستهلك عقده حاليًا.

المسارات الأساسية الحالية:

| المسار | الطلب | المالك | الحالة المصدرية |
|---|---|---|---|
| الصفحة العامة | `GET /Home/Index` ثم `GET api/subscription/plans/public` | MVC ثم API | موجود |
| عرض السعر | `POST /Home/SubmitQuote` ثم `POST api/subscription/quotes/submit` | MVC ثم API | موجود، لكن السعر تقديري ثابت |
| التسجيل التجريبي | `POST /Home/StartTrial` ثم `POST api/subscription/tenants/register` | MVC ثم API | موجود، لكن لا ينشئ هوية أو مستخدمًا |
| لوحة المؤشرات | `GET /Admin/Index` ثم أربعة تقارير | MVC ثم API | موجود، طلبات متسلسلة |
| موارد الإدارة | `GET/POST/PUT/DELETE api/subscription/*` | MVC ثم API | CRUD عام انعكاسي |
| إجراءات الدورة | `start-trial`, `activate`, `upgrade`, `downgrade`, `renew`, `cancel`, `suspend` | API | موجودة بلا آلة حالات مكتملة |
| التجهيز | `progress/{tenantId}` و`retry/{stepId}` | API | قراءة/إعادة ضبط فقط؛ لا عامل منفذ |

## ٤. النتائج الحرجة

### P0 — لا توجد مصادقة أو عزل مستأجر في SubscriptionAPI

`Program.cs:10-11,22-42` يسجل المتحكمات ويستدعي `UseAuthorization` فقط؛ لا
يوجد `AddAuthentication` أو `UseAuthentication` أو سياسة افتراضية. كما أن
`SubscriptionPlatformControllers.cs:9-50,105-145,189-225` لا يحتوي حراس
`Authorize`.

الخدمات العامة في `SubscriptionPlatformServices.cs:34-143` تقرأ وتعدل وتحذف
بالـ`Id` فقط. الكيانات ترث `EntityBaseWithoutSubscription`، لكن هذا لا يثبت
سياق المستأجر ولا يمنع الطلب المجهول. Security يصدر معرف المستخدم ومعرف
الاشتراك بعقد منفصل، بينما لا يوجد محول أو حارس في SubscriptionAPI.

السيناريو: أي مستدعٍ يصل إلى عنوان API يستطيع قراءة أو تعديل خطة أو مستأجر أو
دفع أو سجل استخدام بالمعرف، أو يمرر معرف مستأجر آخر. هذه نتيجة مباشرة من
المصدر وليست مجرد توصية نشر.

المالك المطلوب قبل أي اعتماد: تجميد معنى `Tenant.Id` مقابل
`Security SubscriptionId`، تسجيل مصادقة API، تحديد أدوار منصة مستقلة، ثم
إضافة حارس ملكية لكل قراءة وكتابة وإجراء. لا يجوز اعتبار حماية صفحات MVC
بالكوكي حماية للـAPI.

### P1 — دورة الاشتراك لا تفرض انتقالات أو دفعًا أو تزامنًا

`SubscriptionLifecycleService` ينفذ تغييرات مباشرة:

- `StartTrialAsync` في `Services:369-393` يتحقق من وجود المستأجر والخطة فقط؛ لا
  يتحقق من نشر الخطة أو كونها عامة أو نشطة أو من تاريخها، ولا يمنع سباقي
  التسجيل قبل الحفظ.
- `ChangeStatusAsync` في `Services:464-472` لا يتحقق من الحالة السابقة. لذلك
  يمكن تفعيل اشتراك ملغى أو منتهي، أو إلغاء اشتراك مسودة، أو إيقافه بلا سبب
  صالح.
- `UpgradeAsync` في `399-410` يغير الخطة والفترة بلا فاتورة أو إعادة حساب مدة
  أو تحقق من أهلية الخطة.
- `DowngradeAsync` في `412-424` يفحص المستخدمين والمركبات فقط؛ يتجاهل الفروع
  والسائقين والتخزين وبقية المقاييس، ويطبق التغيير فورًا ولا يحدّث الفترة.
- `RenewAsync` في `426-435` يعامل كل ما ليس سنويًا كشهر واحد، فيخالف الربع
  السنوي والنصف سنوي والـ`Custom`، ولا يتحقق من الدفع أو الحالة أو التجديد
  التلقائي.
- `CancelAsync` و`SuspendAsync` في `438-462` يغيران حالة المستأجر مباشرة حتى
  لو وُجد اشتراك آخر له.
- لا توجد `rowversion` أو آلية انتقال شرطي في كيان الاشتراك أو نماذج الإجراءات؛
  يمكن لطلبين متزامنين فقد آخر تغيير.

المطلوب هو جدول حالات معتمد، وحارس انتقال واحد، وملكية مستأجر، وتزامن
تفاؤلي، وقواعد صريحة للتاريخ والفاتورة والدفع والإلغاء الفوري أو المؤجل.

### P1 — التسجيل والتجهيز غير منفذين

`TenantService.RegisterAsync` في `Services:271-305` ينشئ المستأجر وخطوات
كل أنواع التجهيز بحالة `Pending` ثم يحفظها. لا ينشئ حساب Identity للمدير ولا
مستخدم ERP، ولا ينفذ `CreateTenantInstance` أو `CreateAdminUser` أو
`LaunchDashboard`.

يوجد خلل تاريخي في نفس المقطع: `EndDate` يستخدم 12 شهرًا للسنة وشهرًا واحدًا
لكل الفترات الأخرى، بينما `NextBillingDate` يساوي تاريخ التجربة حتى عند عدم
بدء التجربة. لذلك الخطط الربع سنوية والنصف سنوية والمخصصة لا تحصل على مدتها
الصحيحة.

`TenantProvisioningService:325-353` يقرأ التقدم ويعيد الخطوة إلى `Pending`
بلا تحقق من أن الخطوة فاشلة أو أنها تخص المستأجر المتوقع، ولا يرسل مهمة
تنفيذ. كل وظائف `SubscriptionPlatformJobs.cs:24-71` تسجل رسالة placeholder
وتعيد `Task.CompletedTask`، و`DependencyResolver.cs:24-34` يسجلها Scoped فقط
دون scheduler أو `HostedService`.

النتيجة العملية: التسجيل قد يرجع نجاحًا مع بقاء كل الآثار التشغيلية معلقة.
يجب فصل إنشاء الطلب عن تنفيذ التجهيز، إضافة outbox أو queue موثوقة، عامل
مجدول، قفل/claim للخطوة، retry policy، ومصالحة حالة المستأجر.

### P1 — الحصص والاستخدام ليست إنفاذًا فعليًا

`CheckLimitAsync` في `Services:629-651` يعيد قرارًا حسابيًا فقط. لا توجد عملية
حجز أو زيادة ذرية مرتبطة بإنشاء المستخدم/المركبة/الفرع، لذا يمكن لطلبين
متزامنين تجاوز الحد. المقاييس `ApiCalls` و`Trips` و`Invoices` موجودة في enum
لكنها لا تملك حقول حدود في الخطة؛ الفرع الافتراضي يعيد `(0, null)` ويعتبر
الطلب مسموحًا. كما أن `StorageGB` يُحوّل إلى `int` ويفقد الكسور.

`CalculateTenantUsageAsync` في `654-665` لا يحسب أي مصدر؛ ينشئ سجلًا أو يحدّث
`LastCalculatedAt` فقط. وظائف snapshot وviolation إما placeholder أو CRUD عام،
ولا توجد عملية اكتشاف أو معالجة مخالفة.

يجب تعريف مصدر كل مقياس، وحقول حدوده أو استبعاده بقرار صريح، وحساب usage من
مصدر موثوق، ثم تطبيق check-and-reserve أو قفل ذري داخل عملية الكتابة.

### P1 — تحويل عرض السعر ليس تحويلًا

`QuoteRequestService.CreateAsync` في `Services:593-600` يحسب السعر بصيغة
ثابتة من عدد المستخدمين والمركبات والفروع، ويتجاهل فترة الفوترة والدعم وأسعار
الخطة والوحدات. لا يتحقق من `ModuleIds` أو تكرارها.

`UpdateStatusAsync` في `603-611` يقبل أي انتقال حالة، و`ConvertAsync` في
`614-620` يضع `Converted` فقط. لا ينشئ مستأجرًا أو اشتراكًا أو فاتورة أو خطوة
تجهيز رغم أن الرسالة توحي ببدء التسجيل يدويًا.

المطلوب قرار تجاري يحدد مالك السعر، انتقالات العرض، وما إذا كان التحويل
ينشئ دورة كاملة أم مجرد حالة CRM؛ بعد ذلك يملك التنفيذ خدمة تطبيقية واحدة
تضمن المعاملة والآثار التابعة.

## ٥. نتائج الفوترة والدفع والتقارير

- `BillingService.GenerateInvoiceAsync` في `Services:492-522` يضيف رسوم
  الإعداد إلى الإجمالي، بينما سطر الفاتورة يحتوي السعر الأساسي فقط. الضريبة
  صفر دائمًا، ورقم الفاتورة مبني على الثانية والمعرف دون عقد uniqueness أو
  idempotency.
- `PaymentService.ConfirmAsync` في `540-554` لا يتحقق من قيمة الدفع مقابل
  الرصيد، ولا يمنع التأكيد المكرر، ويجعل الاشتراك والمستأجر نشطين بمجرد تغيير
  حالة الدفع. لا توجد معاملة أو قفل لتسوية الفاتورة.
- `MockPayAsync` في `566-580` ينشئ دفعة بالقيمة الكاملة ويؤكدها مباشرة؛ يجب أن
  يبقى مسارًا تجريبيًا واضحًا وغير متاح في بيئة الاعتماد.
- `SubscriptionReportService.DashboardAsync` في `684-701` يحسب `MRR` من مجموع
  كل الفواتير المدفوعة مقسومًا على 12، و`ARR` من نفس المجموع التاريخي؛ هذا لا
  يثبت إيرادًا شهريًا أو سنويًا متكررًا.
- `RevenueAsync` في `704-713` يتجاهل paging/filter الوارد، ويجعل صافي الإيراد
  مساويًا للمحصل قبل معالجة الاستردادات. `PlanDistributionAsync` في `715-726`
  يستخدم استعلامات فرعية لكل خطة، والتقارير كلها بلا نطاق زمني أو tenant scope.

هذه ليست ملاحظات واجهة؛ يجب تجميد السياسات المالية ومصدر التاريخ قبل تعديل
الحسابات. القياس وخطط SQL والفهارس ما زالت قبول مالك، ولم تُشغّل قاعدة بيانات.

## ٦. نتائج بوابة MVC الحالية

### P1 — فشل API يظهر نجاحًا

`SubscriptionApiClient.SendJsonAsync` في `Services/SubscriptionApiClient.cs:80-97`
لا يستدعي `EnsureSuccessStatusCode` ويعيد JSON لأي status. في المقابل،
`AdminController.Create/Edit/Delete/RunAction` في `Controllers/AdminController.cs:92-106,143-206`
لا يفحص `IsSuccess` للعمليات العامة؛ بمجرد عودة JSON يُحفظ نجاح في TempData وتتم
إعادة التوجيه. لذلك 400 أو 404 من API قد تظهر للمستخدم كإنشاء أو حذف ناجح.

نفس الخلل في `HomeController:36-76`: فشل quote أو trial يوضع في
`StatusMessage`، و`Views/Home/Index.cshtml` يعرضه كتنبيه نجاح أخضر.

العقد المطلوب هو نتيجة typed تحمل status و`Result.Errors`، مع فرع خطأ واضح في
العميل ووحدات تحكم MVC، ورسائل عامة للمستخدم وتسجيل داخلي للتفاصيل.

### P2 — العرض العام قد يعرض بيانات تجريبية مضللة

`HomeController:84-102` لا يتحقق من `IsSuccess` للخطط. إذا فشل API تصبح
القائمة فارغة، و`Views/Home/Index.cshtml:4-11` يعرض بطاقات خطط محلية تجريبية.
لكن قائمة اختيار الخطة في النموذج تستخدم `Model.Plans` في `156-164`، فتكون
فارغة. قد يرى الزائر أسعارًا وأزرارًا ثم لا يجد خطة قابلة للاختيار. يجب إما
إظهار حالة عدم التوفر بوضوح أو فصل demo mode عن الإنتاج.

### P2 — الإدارة العامة انعكاسية أكثر من اللازم

`SubscriptionResourceRegistry.cs:12-59` يسجل ما يقارب عشرين موردًا، و
`AdminController` يبني payload من `IFormCollection` في `209-240`. لا يوجد
تحقق ModelState أو نطاق أو enum/date/decimal موحد؛ القيمة الخاطئة تُرسل كنص
خام، والـ`required` في HTML قابل للتجاوز.

`Resource.cshtml:4-9,57-85` يأخذ أول عشرة أعمدة، ويولّد Create/Edit/Delete لكل
الموارد، بما فيها audit وusage وprovisioning. لا يوجد filter أو paging أو
عرض `TotalPages` رغم أن API يعتمد `ListSmBase` بحجم افتراضي 20. لا توجد نافذة
تأكيد قبل Delete أو الإجراءات الحساسة، و`site.js` مجرد placeholder.

سجل التدقيق يظهر كـCRUD في `ResourceRegistry:57-58`؛ هذا يسمح بتعديل أو حذف
السجل الذي يفترض أن يكون server-owned. يلزم جعل audit قراءة فقط أو endpoint
مخصصًا بصلاحيات واضحة.

### P2 — أخطاء الإدخال والتواريخ والإلغاء

`JsonElementTableMapper.ToRow` في `SubscriptionAdminViewModels.cs:100-123`
يترك التاريخ كسلسلة ISO كاملة، بينما `Views/Admin/Form.cshtml:61-72` يضعها
مباشرة في `input type=date`؛ قد يظهر الحقل فارغًا عند التعديل. كما لا توجد
رسائل field-level أو summary كافية ولا حماية من تكرار الإرسال.

`HomeController:43-45,70-72,97-100` و`AdminController:35-37,62-65,98-105`
تعرض `ex.Message` للمستخدم، وقد يحتوي اسم مضيف أو SQL أو تفاصيل داخلية. كما
أن catches تلتقط الإلغاء والمهلة كأنها عطل API.

### P2 — كوكي الإدارة لا يثبت دورًا

`AdminController` عليه `[Authorize]` فقط في `Controllers/AdminController.cs:9`.
رغم أن `AccountController` يضع claim باسم `SubscriptionAdmin`، لا توجد
`[Authorize(Roles = "SubscriptionAdmin")]`. الحماية الحالية تعتمد على أن نقطة
إصدار الكوكي الوحيدة هي login محلي، وليست سياسة دور مستقلة.

الاعتماد المحلي الافتراضي في `appsettings.json` وfallback داخل
`AccountController:33-34` يحتاج إزالة قبل أي نشر. هذا خارج إصلاحات الدورة، لكنه
حاجز قبول واضح.

## ٧. عقد البيانات والملكية

الـFK موجود في `SubscriptionPlatformConfigurations.cs`، لكن generic Add/Update
لا يتحقق من وجود المرجع أو انتمائه إلى المنتج/المستأجر الصحيح. يمكن مثلًا
إرسال `SubscriptionPlanId` لخطة من منتج آخر، أو تغيير `TenantId` في خطوة تجهيز
أو usage عبر PUT؛ `SubscriptionCrudService.UpdateAsync` في `46-59` ينسخ نموذج
التحديث كاملًا قبل الحفظ.

الفهارس الفريدة وحذف soft-delete موجودة، لكن إعادة استخدام subdomain/domain أو
سجل usage بعد الحذف تحتاج قرارًا وفهرسًا/قيدًا متوافقًا؛ لا يجوز افتراض ذلك
من دون migration وفحص بيانات.

## ٨. الأداء والطلبات والـcache

لا يوجد cache أو watcher في MVC؛ كل تنقل يعيد الطلبات. صفحة الإدارة تطلب
Dashboard وPlanDistribution وFailedPayments وTenantUsage تسلسليًا في
`AdminController:28-34`، ثم تقطع النتائج في الذاكرة داخل العرض. لم تُقاس
الزمنيات ولا حجم البيانات.

المسارات العامة صغيرة نسبيًا، لكن CRUD يقرأ page واحدة فقط بلا filter أو paging
في الواجهة. المطلوب قبل أي تحسين هو قياس TTFB وحجم JSON وعدد الصفوف واستعلامات
كل تقرير، ثم endpoint dashboard محدود أو طلبات متوازية مع بقاء حدود المصدر.
لا يوجد اقتراح فهرس معتمد قبل SQL plan وحجم البيانات؛ لا migration ضمن هذه
المراجعة.

## ٩. مصفوفة التغطية الحالية

| المجال | الوضع الحالي | الحكم |
|---|---|---|
| عرض الخطط العامة | endpoint وواجهة موجودان | جزئي؛ fallback مضلل عند الفشل |
| quote submit | endpoint وواجهة موجودان | جزئي؛ صيغة سعر ثابتة ورسالة فشل خاطئة |
| tenant registration | endpoint وواجهة موجودان | ناقص؛ لا هوية أو provisioning فعلي |
| subdomain | خدمة تحقق موجودة | جزئي؛ غير مستخدمة كـpreflight في الصفحة |
| product/edition/module/feature | CRUD عام | غير محمي وغير متحقق من الملكية |
| plan/add-on/coupon | CRUD عام | لا contract لحالة النشر والأهلية |
| lifecycle | سبع عمليات موجودة | بلا state graph/payment/concurrency |
| invoice/payment/refund | CRUD وإجراءات موجودة | الحساب والتسوية غير مكتملين |
| provisioning | progress/retry موجودان | placeholder بلا worker أو side effects |
| usage/limits | check وcalculate موجودان | check-only ومقاييس ناقصة وplaceholder |
| reports | خمسة تقارير موجودة | totals تاريخية، غير scoped وغير paged |
| audit | كيان وCRUD موجودان | قابل للتعديل من generic portal |
| MVC error contract | typed public results جزئيًا | generic JSON لا يحترم HTTP/envelope |
| auth/tenant boundary | MVC cookie فقط | API مكشوف وغير مربوط بـSecurity |

## ١٠. القرارات المطلوبة قبل الإصلاح

1. تثبيت عقد الهوية: هل `Tenant.Id` في منصة الاشتراكات يساوي `SubscriptionId`
   في Security أم توجد خريطة مستقلة؟ السجل المعتمد للتصميم يفصل بينهما، لذلك
   لا ينبغي التخمين.
2. تحديد أدوار platform admin وtenant admin وقرارات كل endpoint، مع owner لكل
   قراءة وكتابة.
3. اعتماد آلة حالات الاشتراك وقواعد الدفع والتجديد والإلغاء المؤجل والاشتراكات
   المتعددة للمستأجر.
4. اعتماد مدة كل `BillingPeriod` وسياسة السعر والضريبة والاسترداد وMRR/ARR.
5. تحديد ما ينفذه quote conversion وما إذا كان ينشئ admin Security وERP user.
6. تحديد مصادر usage وحدود المقاييس الخمسة الإضافية، وطريقة الحجز الذري.
7. اعتماد عامل provisioning والـretry والـoutbox والـidempotency.
8. تحديد ما يبقى CRUD في بوابة الإدارة وما يتحول إلى أوامر typed لا تسمح بتعديل
   الحالة أو الحقول server-owned.

## ١١. ترتيب الإصلاح المقترح

### المرحلة الأولى — حماية العقد والعزل

تجميد خريطة الهوية، إضافة مصادقة API وسياسات الأدوار وعزل المستأجر، إلغاء
generic writes للحقول server-owned، وجعل audit قراءة فقط. هذه المرحلة تمنع
القراءة أو الكتابة العابرة للمستأجر قبل توسيع الوظائف.

### المرحلة الثانية — دورة التسجيل والتجهيز

فصل `Register` عن `Provision`, إنشاء outbox/worker، تنفيذ إنشاء tenant/admin
بـidempotency، وإظهار حالة صريحة في MVC بدل رسالة نجاح بعد إنشاء صفوف Pending.

### المرحلة الثالثة — lifecycle والفوترة والدفع

تجميد state graph، التواريخ والفترات، الفاتورة والسعر والضريبة، ثم تنفيذ
تغييرات typed بمعاملة وتزامن وتسجيل old/new values.

### المرحلة الرابعة — usage والتقارير

تحديد مصادر القياس والحصص، حجز ذري، snapshots ومخالفات فعلية، ثم إعادة بناء
التقارير بنطاق زمني وtenant scope وpaging وقياس SQL.

### المرحلة الخامسة — بوابة MVC

استبدال reflection writes بعقود typed للموارد الحساسة، توحيد نتيجة HTTP،
إظهار أخطاء الخادم، إضافة filter/paging/confirmation، وتقليل التقارير
المتسلسلة بعد قياسها. تُنفذ الصفحة العامة بلا fallback إنتاجي مضلل.

## ١٢. القرار الحالي

الوضع الحالي مناسب كنموذج تجريبي لعرض شكل المنصة وربط MVC بخدمة الاشتراكات،
لكنه غير جاهز كدورة اشتراكات فعلية. أكبر عائق ليس شكل الواجهة؛ بل المصادقة
وعزل المستأجر، ثم التجهيز والدورة المالية والحصص.

لا أوصي ببدء إعادة كتابة واجهة قبل إغلاق المرحلة الأولى وتجميد عقود الهوية
والدورة. أي واجهة فوق API الحالي ستعرض نفس نتائج النجاح الوهمي، والتجهيز
المعلق، وتغييرات الحالات غير المحمية.

## ١٣. حدود التحقق والقبول عند المالك

هذه مراجعة مصدرية. لم أشغّل build أوtest أوlint أوHTTP أوbrowser أوdatabase أو
migration أوcommit أوpush أوdeployment. لم أعدّل ملفات التطبيق أو snapshot.

قبول المالك المطلوب لاحقًا، بعد تنفيذ الإصلاحات، يشمل: استدعاء مجهول ومستخدم
من مستأجر آخر، سباق lifecycle، تسجيل وتجهيز كامل، retry حقيقي، quote conversion،
حدود كل مقياس، فاتورة وضريبة واسترداد، أخطاء 400/401/404 في MVC، paging/filter،
تأكيد الحذف، ثم قياس التقارير والطلبات تحت بيانات واقعية.

الحالة الحالية للنتائج: `Draft` و`Owner verification pending: yes`.


## ١٤. الشريحة الأولية المطلوبة — إنشاء Tenant ومدير وتفعيلها

طلب المالك بدء دورة صغيرة قابلة للمراجعة المتتابعة: إنشاء Tenant، إنشاء مدير
له، ثم جعل الـTenant والاشتراك فعالين. الحالة الحالية للمصدر لا تنفذ هذه الدورة
كعملية واحدة:

1. واجهة التسجيل العامة هي `Views/Home/Index.cshtml` داخل القسم `#create`؛ النموذج
   يرسل `TrialRegistration` إلى `HomeController.StartTrial`، ولا يحتوي username أو
   password للمدير.
2. `HomeController.StartTrial` يستدعي فقط
   `POST api/subscription/tenants/register` عبر `SubscriptionApiClient`.
3. `TenantService.RegisterAsync` ينشئ Tenant وSubscription وخطوات `Pending` فقط؛
   لا يستدعي Security ولا ينشئ Identity admin ولا يفعّل الاشتراك فعليًا.
4. إنشاء Admin الحالي في Security موجود خلف
   `POST /api/Authenticate/register-admin`، ويتطلب bearer لمستخدم SuperAdmin،
   و`RegisterVm` يحتاج username وemail وpassword و`SubscriptionId`.
5. تفعيل الاشتراك الحالي منفصل في
   `POST api/subscription/subscriptions/activate` ويقبل SubscriptionId فقط؛ لا
   يربط إنشاء هوية المدير أو provisioning.

### التصميم المقترح قبل التنفيذ

الشريحة الموصى بها تكون شاشة إدارية typed داخل CustomerMVC باسم إنشاء Tenant
ومديره، بدل توسيع محرر الموارد الانعكاسي. ترسل الشاشة عقدًا واحدًا إلى عملية
orchestration مملوكة للـAPI/الخدمة، وتعرض رقم Tenant وSubscription وIdentity
والحالة النهائية لكل خطوة. يجب أن تكون العملية قابلة لإعادة المحاولة، وتكتب
حالة فشل واضحة بدل إعلان نجاح جزئي.

التسلسل المقترح:

1. التحقق من subdomain والخطة المنشورة وصلاحية بيانات المدير.
2. إنشاء Tenant واشتراكه في حالة انتقالية، مع معرف ارتباط واحد.
3. إنشاء هوية المدير في Security بدور `Admin` ومعرف الاشتراك المطابق.
4. تسجيل نجاح إنشاء الهوية وربطها بالـTenant، ثم تنفيذ provisioning المطلوب.
5. تفعيل الاشتراك والـTenant فقط بعد اكتمال الخطوات المطلوبة، ثم إرجاع نتيجة
   typed للواجهة.
6. عند الفشل، حفظ `Failed` وسبب آمن وretry قابل للتتبع؛ لا نعتبر حذف Tenant أو
   Identity تعويضًا تلقائيًا قبل تثبيت عقد الحدود بين قاعدتي البيانات.

### قرار مطلوب من المالك قبل تثبيت العقد

بيانات كلمة مرور مدير الـTenant غير موجودة في النموذج الحالي. نحتاج اختيارًا
واحدًا قبل كتابة API أو واجهة:

- **الخيار الموصى به:** الشاشة تستقبل username/email فقط، وSecurity يولد دعوة
  أو رابط تعيين كلمة مرور لمرة واحدة. هذا يحتاج عقد دعوة مؤقتة جديدًا.
- **خيار التجربة المحلية:** الشاشة الإدارية تستقبل كلمة مرور مؤقتة وتُرسلها
  عبر TLS إلى Security، ولا تُحفظ في SubscriptionAPI أو سجل الملاحظات. يجب
  تغييرها عند أول دخول.

لا يجوز أن نضع كلمة مرور ثابتة أو ننشئ مديرًا بكلمة مرور افتراضية. هذا القرار
هو البوابة الوحيدة المتبقية قبل تجميد عقد الشريحة؛ باقي مسار الطلب والملكية
موثق أعلاه.

### حالة العقد بعد تغيير اختيار كلمة المرور

اختار المالك البدء بالتسجيل المباشر للبيانات وتأجيل الدعوة لمرة لاحقة. قبل
تجميد التنفيذ ظهرت نقطتان ماديتان لا يجوز تخمينهما:

- Security يربط الدخول بكود خارجي مثل `101007` إلى `SubscriptionId` داخلي مثل
  `1007`، بينما Tenant الجديد في SubscriptionAPI يحصل على `Tenant.Id` مستقل؛ لا
  يوجد حاليًا مخزن مشترك أو حقل يحدد كود Tenant الجديد.
- MVC الحالي يملك كوكي محليًا مستقلًا ولا يحمل bearer SuperAdmin، لذلك لا يستطيع
  استدعاء endpoint إنشاء Admin المحمي في Security دون عقد تفويض خدمة أو تغيير
  مسار تسجيل دخول MVC.

اعتمد المالك إنشاء كود و`SubscriptionId` جديدين لكل Tenant، واتصال خدمة داخلي
بين SubscriptionAPI وSecurity. في هذه الشريحة تُرسل كلمة المرور مباشرة عبر
الاتصال الداخلي المشفر، ولا تُحفظ في SubscriptionAPI أو سجل الملاحظات. الدعوة
ذات الرمز لمرة واحدة مؤجلة ولا تدخل في عقد هذه الشريحة.

التصحيح عند تجميد العقد: معرف Tenant في المنصة ومعرف سجل الاشتراك ومعرف شركة
الهوية ثلاثة معرفات منفصلة؛ لا نستخدم Subscription.Id كهوية شركة. يولد
Security معرف الشركة وكودها ويحفظ SubscriptionAPI الربط الصريح. يحافظ النظام
على الكود القديم101007→1007. العقد الجاري هو
`SUBSCRIPTION_TENANT_DIRECT_REGISTRATION_CONTRACT_FREEZE.md`؛ ما سبقه عن الدعوة
والحاجة لقرار كلمة المرور سجل تاريخي تجاوزه طلب التسجيل المباشر.
