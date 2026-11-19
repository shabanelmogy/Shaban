# عقد التسجيل المباشر للمستأجر ومديره

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| المصدر | طلب إنشاء Tenant ومديره وتفعيله، ثم اختيار كود مستقل واتصال خدمة داخلي، وتعديل المالك إلى التسجيل المباشر وتأجيل الدعوة |
| التفويض | تنفيذ المصدر فقط؛ لا بناء أو اختبار أو قاعدة بيانات أو هجرة أو تشغيل |

## حدود الشريحة

واجهة MVC إدارية typed → SubscriptionAPI orchestration → Security Identity.
التسجيل المباشر بكلمة مرور يدخلها المدير العام؛ لا حفظ لها في المنصة أو logs
أو TempData أو hidden inputs أو ملفات. الدعوة مؤجلة. لا ERP User أوشركة ERP
أوتهيئة قاعدة شركة أوفواتير أوإثبات دفع ضمن هذه الشريحة. التفعيل هنا إجراء
إداري صريح، وليس إثبات سداد. تبقى الملاحظات الأخرى في تقرير الوضع الحالي.

## العقود المشتركة

المجلد `SiGma.ViewModels/ViewModels/SubscriptionPlatform/Onboarding`، نوع واحد
بكل ملف:

- `TenantDirectRegistrationVM`: Guid RegistrationId، CompanyName/CommercialName،
  AdminFullName/AdminEmail/AdminPhone، Subdomain، int SubscriptionPlanId،
  AdminUsername/Password/ConfirmPassword. الخصائص المطلوبة Required والأرقام موجبة
  والمقارنة على ConfirmPassword. RegistrationId موجب غير فارغ يفحصه الخادم.
- `TenantRegistrationResultVM`: Guid RegistrationId، int TenantId، int SubscriptionId
  (سجل الخطة في المنصة)، int? IdentitySubscriptionId (هوية الشركة فيSecurity/ERP)،
  string? SubscriptionCode/AdminUserId، CompanyName/AdminUsername/AdminEmail،
  string Status/Message، bool IsActive. لا كلمات مرور أوتوكنات.
- `TenantIdentityRegistrationVM`: Guid RegistrationId، int TenantId،
  string Username/Email/Password.
- `TenantIdentityResultVM`: int SubscriptionId، string SubscriptionCode/AdminUserId،
  bool IsActive.
- `TenantIdentityActivationVM`: Guid RegistrationId، int TenantId.

العقود HTTP:

- `POST api/subscription/tenant-registration/direct`: request الأول،
  `Result<TenantRegistrationResultVM>`؛ نجاح فقط بعد اكتمال التفعيل.
- `GET api/subscription/tenant-registration/{registrationId:guid}`: نفس الرد
  دون أسرار؛ failure/partial لا يعرض نجاحًا وهميًا.
- `POST internal/tenants/register`: request هوية → `Result<TenantIdentityResultVM>`.
- `POST internal/tenants/activate`: طلب التفعيل → نفس الرد.
- `POST internal/tenants/validate`: Username/Email/Password دون حفظ أوإنشاء؛
  تنفذ password validators الفعلية قبل إنشاء صفوف المنصة. يمكن دمجها فيregister
  إذا حفظت المنصة حالةFailed قابلة للإعادة؛ لا فرق فياتفاق النجاح النهائي.

التفويض: Cookie بدورSubscriptionAdmin فيMVC. مفتاح اتصال خدمة باسم
`PlatformIntegration:ServiceKey` فيكل المضيفين، header `X-Sigma-Service-Key`
من الخادم فقط، مع فشل مغلق إذا لم يضبط. لا SuperAdmin credentials أوJWT ثابت.
العناوين local HTTPS منDevelopment؛ أسرار development فيملف محلي مستبعد منGit
تحت appsettings.Local.json (Development فقط، تُقرأ قبل إعادة env/commandline حتى
تبقى أولوية النشر صحيحة). لا أسرار فيالردود أوالتقرير.

## الهوية والتخزين

يحجز Security جدولTenantIdentity بالـRegistrationId الفريد وPlatformTenantId،
ويولد IdentitySubscriptionId موجبًا لا يتعارض مع الكود القديم أوالمستخدمين
الحاليين، وكودًا جديدًا مستقلًا. لا يساوي Tenant.Id ولا Subscription.Id ضمنيًا.
يربط AdminUserId منIdentity ودورAdmin؛ يحفظ Company identity غير نشطة أولًا.
التكرار بنفسRegistrationId يعيد نفسالهوية ولا يغير كلمة المرور أوينشئ مديرًا
ثانيًا؛ اختلافtenant/username/email يرفض409.

SubscriptionAPI يحفظ TenantOnboarding بالـRegistrationId كمفتاح، TenantId،
SubscriptionId، بصمة مدخلات بلا كلمة المرور، الربط الناتج للهوية، حالةالخطوة
وlease بمفتاح ووقت محدود. يحفظTenant/اشتراكDraft وخطوات الشريحة فيمعاملة محلية؛
لاتوجد معاملة مفتوحة أثناءHTTP. lease يمنع التنفيذ المتزامن، ويقبل retry بعد
فشل أوانتهاءlease؛ الفهرس الفريد يمنع تكرار الطلب.

بعد إنشاءAdmin غيرالنشط: تحفظالمنصة الربط، تفعلSecurity بالطلب نفسه idempotent،
ثم تحفظTenant/Subscription Active وتاريخ نجاح التجهيز محليًا. لا معاملة موزعة؛
الفشل بعدSecurity active يبقى partial وقابلًاللمصالحة بنفسالطلب، ولايدعي النجاح.
لا حذف تعويضي تلقائي. أي كلمة مرور يعادإدخالها عندفشل الاتصال لا تغير الحساب
الذي سبقإنشاؤه. الحساب غيرالنشط لايصدر توكن دخول قبلتفعيل شركته.

resolver الحالي يصير async scoped لقراءة جدولSecurity مع الحفاظعلى mapping
101007→1007. كل المستهلكين Login/Refresh/Token/Admin يتمتحديثهم معًا؛ readonly
resolvers لايمكن أن تتجاهل حالةالتفعيل أوأن تخبئ النتائج بينالمستأجرين.

## الواجهة

مدخل واضح منلوحةالإدارة ومنقائمةTenants إلى `/TenantRegistration/Create`.
قائمةخطط حقيقيةمنالمصدر، بدونsample fallback؛ النموذجRequired ووصفكلمةالمرور
والتحقق الخادمي وأخطاء API. حالةإرسالمرئية وتعطيلالزر بعدنجاحbrowser validation؛
كلمةالمرور لايعادعرضها بعدفشل. عندالنجاح صفحةنتيجةمحميةGET معالكود والهوية
والحالات ورابط العودة. عندpartial يعرضالفشل وإعادةالمحاولة بنفسRegistrationId
وبصمةالمدخلات، لا ينشئ تسجيلًاجديدًا. دليل داخلMVC مرتبطمنالنموذج والنتيجة.

## خطة التنفيذ والتحقق

١. الجذر يكتبDTOs والعقد؛ Security worker يملكSecurity فقط وresolver consumers.
٢. MVC worker يملكController/ViewModels/Views/client/guide الخاصةبالشريحة فقط.
٣. الجذر يملكSubscriptionAPI orchestration/EF/service credential/configuration.
٤. الجذر يراجع التكاملوالفروقوالـnamespaces/JSON/مراجعالأنواعوحدودالأسرار.

حالاتقبول مصدرية مصممة قبلالتنفيذ: نجاحشركةجديدة؛ legacy1007؛ كلمةمرورسيئة؛
بريد/اسممكرر؛ خطةمخفية/غيرنشطة؛ subdomain مكرر؛ POST متزامن؛ timeout بعدإنشاء
الهوية؛ retry لايغيركلمةالمرور؛ تفعيلمكرر؛ خطأAPI لايظهرنجاحًا؛ منعcookie بلا
دورومفتاحخدمةناقص/خاطئ؛ عدموجودسر فيالرابط/الرد/الصفحة؛ failedلايسمحlogin؛
فترةشهري/ربعسنوي/نصفسنوي/سنوي؛ Custom مرفوض فيالشريحة حتىلهعقدمدةصريح.

تغييراتschema مطلوبة فيقاعدتيSubscriptionAPI وSecurity؛ المالك فقط ينشئويطبق
هجرتي `AddTenantDirectOnboarding` و`AddTenantIdentityRegistry` علىالسياقين.
لا EnsureCreated/Migrate تلقائي جديد ولا تعديل migrations/snapshots.
TDD runtime معلق بسببالحدالأعلىsource-only؛ لاادعاءاختباراتناجحة.

## تحديث الربط مع ERP User — ٥ نوفمبر ٢٠٢٦

أضيفت خطوة المصدر التالية إلى التسجيل: بعد إنشاء Identity Admin ينشئ
SubscriptionAPI سجل ERP `User` مرتبطًا بـ`IdentityUserId` و`IdentityRegistrationId`
ضمن `SubscriptionId` نفسه، ثم يرسل `ErpUserId` إلى Security قبل التفعيل. لا توجد
كلمات مرور في ERP. ERP User ينشئ دورًا نظاميًا `TenantAdmin` وإسنادًا أوليًا
للمالك، والدور لا يغني عن claim Admin الموقّع في Security. الحساب ERP يبقى غير
نشط حتى نجاح تفعيل الهوية ثم تفعيله في ERP.

يحتاج ذلك إلى تحديثين مقترحين إضافيين مع المالك:
`LinkIdentityUsersAndProvisionTenantOwner` لسياق ERP، و`AddTenantIdentityRegistry`
لسياق Security يتضمن `ApplicationUser.ErpUserId` و`IdentityTenant.ErpUserId`.
التحقق التشغيلي للـroles/permissions لا يُعلن قبل تنفيذ جسر الهوية وتقييم الخادم.

## متابعة تنفيذ المصدر — ٦ نوفمبر ٢٠٢٦

أضيفت مصالحة المصدر التالية دون تغيير عقد التسجيل المباشر الأصلي:

- يحفظ SubscriptionAPI نتيجة إنشاء هوية Security قبل استدعاء ERP، حتى يظهر
  الفشل الجزئي ويمكن إعادة نفس `RegistrationId` بعد انتهاء الـlease دون إنشاء
  هوية ثانية أو تغيير كلمة المرور.
- يحمي ERP الاسم المحجوز `TenantAdmin` بعلامة `IsSystem`، ويمنع المسار العام
  ومساحة الإعدادات إنشاءه أو إعادة تسميته.
- يربط مستخدم Security العادي بـ`IdentityRegistrationId` ويعيد نفس الحساب عند
  إعادة الطلب المطابق، مع رفض اختلاف الاشتراك أو ERP user أو اسم الدخول.
- يوحّد resolver مفاتيح صلاحيات الـendpoint بين الكتالوج وحارس التنفيذ؛ تظل
  العمليات غير المصنفة مرشحات غير قابلة للإسناد وفق العقد المجمد.

أضيف حقل `ApplicationUser.IdentityRegistrationId` وفهرسه إلى نموذج Security؛
الهجرة المقترحة هي `AddIdentityUserRegistrationCorrelation`. لم تُنشأ أو تُعدل
أو تُشغّل هجرة، ولا يُعتبر الربط مقبولًا تشغيليًا قبل تطبيقها واختبار التكرار.

## ملحق قبول المصدر — ٦ نوفمبر ٢٠٢٦

أصبحت قراءة رابط المالك وقرار ربطه وحفظ IdentityTenant/ApplicationUser داخل
معاملة Serializable؛ لا يستبدل طلب ERP مختلف رابطًا قُبل بالتزامن. يشترط
الربط تطابق RegistrationId والاشتراك وهوية Admin، والتفعيل يثبت الرابط
والإسناد النظامي حتى عند إعادة الطلب. يحفظ سجل التجهيز معرفَي Identity وERP
قبل التفعيل، ويظل الاستكمال بنفس التسجيل دون تغيير كلمة المرور.

تمت مصالحة شريحة المستخدم العادي والأدوار وإنفاذ العمليات المصدرية في
`Authorization/TENANT_ACCESS_FINAL_RECONCILIATION.md`. لم يُشغّل build أو
tests أو DB أو migrations أو browser؛ قبول المخطط والدورة الفعلية عند المالك.
