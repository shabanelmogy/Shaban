| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-05 |
| Baseline | Backend `098ff5bb`; existing concurrent ERP/Angular edits preserved |
| Contract | SECURITY_STRUCTURE_COMPATIBILITY_MAINTENANCE_EVOLUTION_PLAN.md |
| Focused runtime acceptance | Local console login HTTP 200 verified on 2026-11-05 after owner-authorized test-account provisioning; other runtime acceptance remains pending |

# إصلاح بنية خدمة الهوية وتوافق الدخول

## متابعة رفض الدخول المحلي وإنشاء حساب التجربة — ٥ نوفمبر ٢٠٢٦

أبلغ المالك عن401 من POST `https://localhost:7120/auth/consolelogin`، وأرسل بيانات حسابه بنفسه. جُرب الطلب مرة وأعاد401 برسالة الاعتماد العامة دون عرض كلمة مرور أو توكن. بعد تفويض صريح لقراءة قاعدة البيانات، ثبت عدم وجود الحساب بالبريد `string1005@string1005.com` أو اسم string1005 في AspNetUsers بقاعدة Security المضبوطة، وعدم وجود سجل ERP مطابق بالقاعدة المضبوطة لـServerAPI. الرفض قبل التحقق من كلمة المرور بسبب غياب حساب Identity.

تصحيح معلومة سابقة: المقارنة الفعلية باستخدام SqlConnectionStringBuilder وفحص جدولي Identity وERP أثبت أن Security وServerAPI في الإعدادات الحالية يتصلان بخادمين وقاعدتين مختلفتين. قاعدة Security فيها AspNetUsers، وقاعدة ERP فيها User ولا يوجد بها AspNetUsers. المقارنة السابقة التي قالت إنهما نفس القاعدة غير دقيقة؛ هذه المتابعة تصححها. لا ينبغي نقل الاتصال بين المشروعين كإصلاح للدخول.

أضاف المصدر تشخيصًا محددًا في Development داخل IdentityAuthenticationService: عدم وجود الحساب، وعدم تطابق الاشتراك، وكود غير مضبوط، وقفل الحساب، ورفض سياسة الدخول، أو خطأ كلمة المرور. تبقى الرسالة العامة في غير Development؛ يسجل reason code فقط دون البريد أو الكلمة أو التوكن. هذا التعديل لم يُبنَ أو يُشغل من الوكيل، والنجاح التشغيلي التالي تم بالمضيف الذي كان المالك يشغله فعليًا دون الاعتماد على التشخيص الجديد.

وافق المالك صراحة على إنشاء الحساب التجريبي العادي للاشتراك1007 بنفس بياناته المرسلة، دون دور مدير. أُنشئ حساب واحد بمعرف `40a14fce-9c80-493c-9faa-9bd0bb51c457`، واسم وبريد `string1005@string1005.com`، ودور Identity `User` فقط. أُنشئ صف الدور المعروف User لأنه لم يكن موجودًا، داخل نفس معاملة Serializable مع إعادة فحص عدم وجود الحساب. استخدم التجهيز PasswordHasher الحقيقي من ASP.NET Core Identity، وتحقق من توافقه داخليًا دون طباعة أو تخزين كلمة المرور أو الـhash في artifact. كان التجهيز كتابة بيانات محددة بتفويض المالك، دون migration أو تغيير schema أو تجهيز مدير. لم تُعدّل حسابات موجودة أو تُنشأ حسابات ERP أو أدوار إدارية أو تعيينات صلاحيات ERP.

أُعيد طلب الدخول نفسه بعد التجهيز، وكانت الأدلة: HTTP200، وisSuccess=true، وsubscriptionId=1007، وsubscriptionCode=101007، ووجود access/refresh دون عرض قيمهما، وsub مطابق للحساب الجديد، ومعرفا المستأجر الصريح والتوافقي كلاهما1007، والدور User. هذا قبول فعلي لمسار الدخول المحلي من HTTP فقط؛ لا يدعي قبول واجهة Angular أو بقية ERP أو تفعيل ربط المستخدمين والصلاحيات. لم تنفذ build/tests/lint/browser/migrations/commits/push/deploy؛ قاعدة البيانات وطلب الدخول لهذه الشريحة فقط صارا مصرحًا بهما بتفويض صريح خلال المتابعة.

متابعة تشغيل Swagger: بطلب المالك صار ملف `SiGma.Security/Properties/launchSettings.json` يفتح المتصفح على `swagger` عند تشغيل ملفي تعريف http وhttps. كلاهما يستخدم Development، حيث يسجل Program واجهة Swagger بالفعل. فُحص JSON والفرق مصدرّيًا؛ لم يُشغّل المضيف أو المتصفح لهذه المتابعة.

متابعة التشغيل المشترك: أُضيف ملف `SiGma.slnLaunch` بجانب الحل، ببروفايل `Sigma API + Security` يشغّل Security ثمServerAPI بإجراءStart لكليهما. البروفايلان النشطان للمشروعين فيإعدادالمستخدمالحالي هماhttps، ومنافذهما7120و7178 بدونتعارض. اختيرتنسيقMicrosoftالموثق لملفالتشغيلالمشترك، وفُحصJSONووجودالمشروعينفيالحلوالفلتروملفاتهم. لمتُعدلملفاتsuoولايبدأتشغيلأوبناءمنهذاالتعديل؛ يختارالمالكالبروفايلمنVisualStudioويبدأF5. دليلMicrosoft: https://learn.microsoft.com/en-us/visualstudio/ide/how-to-set-multiple-startup-projects

## النتيجة والنطاق

نُفذت شريحة بنية مشروع SiGma.Security وربط دخول Angular والتحقق في ERP من المصدر الحالي الذي اختاره المالك. أكد المالك أن كود الدخول101007 يقابل رقم الاشتراك1007؛ ثُبت الربط في إعداد صريح ولا يُشتق من أرقام الكود. مشروع Security أصبح ضمن فلتر SiGma.ServerAPI.slnf بجانب اعتمادياته الموجودة أصلًا. المصدر قابل للمراجعة؛ تشغيل الدخول والنشر لم يُقبلا بعد.

مرجع التنفيذ [الخطة والعقد](SECURITY_STRUCTURE_COMPATIBILITY_MAINTENANCE_EVOLUTION_PLAN.md)، ومرجع إعداد الخدمة [دليل Security](<F:/My Work/Sigma/SigmaBackend/SiGma.Security/README.md>). التعديلات على source/config مأذونة بطلب إصلاح البنية والتوافق واختيار المالك المشروع المحلي. لم تُلمس migrations أو snapshots أو بيانات منشورة.

## المصالحة مع العقد

| العنصر | المالك النهائي والدليل | الحالة المصدرية |
|---|---|---|
| تنظيم المشروع | Controllers / Contracts / IServices / Services / Authorization / Options / Extensions / Models / DataAccess | نُقلت DTOs والثوابت، وحُذفت الأنواع والـcontroller غير المستهلكة؛ ملف لكل نوع، ولا generic CRUD لIdentity |
| استمرار مخطط الهوية | ApplicationUser/ApplicationDbContext بنفس CLR namespace القديم SiGma.Security.ViewModels | لا تغيير حقول أو EF mapping أو schema؛ نقل مادي فقط مع إزالة Database.Migrate من constructor |
| نقل HTTP | AuthenticateController وAuthController والقاعدة SecurityControllerBase | controllers تستدعي خدمات محددة؛ لم تعد تنشئ users/roles/JWT مباشرة |
| هوية التوكن | IdentityTokenService وIdentityClaimTypes | sub للمستخدم، subscription_id للمستأجر، وNameIdentifier للمستأجر المتطلب من Repository/RealtimeHub؛ Name/Role بعقد واضح |
| الثقة بين الخدمتين | SecurityJwtOptions وAddSecurityHost وAddSigmaIdentityAuthentication | issuer/audience/signature/lifetime strict، MapInboundClaims=false، مفتاح JWT واحد محقون خارجيًا دون fallback ثابت |
| الدخول | IdentityAuthenticationService.ConsoleLoginAsync | حل101007 إلى1007 ثم تطابق اشتراك المستخدم وكلمة مروره؛ Result<UserLoginRm> للمسار auth/consolelogin، والقديم unwrapped لنفس المالك |
| تجديد الجلسة | RefreshAsync ثم IssueAndSaveAsync | يعيد قراءة المستخدم والأدوار، يتحقق من security stamp وrefresh expiry، ويدور token ويحفظه بحارس Identity concurrency قبل رد النجاح |
| إدارة الهوية | IdentityAdministrationService وحراس المستأجر/التدرج | إدارة الأدوار المعروفة فقط، ومنع تصعيد Tenant Admin/انتقال المستأجر؛ معاملات إنشاء/تعيين/تعديل وتحقق IdentityResult |
| أول مدير | IdentityBootstrapCommand مع --provision-superadmin | CLI خاص خارج HTTP، credentials خارجية، رفض وجود SuperAdmin؛ استُبعد السويتش من host configuration args بعد مراجعة مستقلة |
| المسارات العامة | إزالة AutomaticCall، حصر register-public بإدارة المنصة، fallback authenticated | لا bootstrap أثناء الدخول، ولا تسجيل مجهول يمنح Admin أو يأخذ مستأجرًا من العميل |
| كلمة المرور والإبطال | ChangePasswordAsync ذاتي، RevokeAsync ذاتي/إداري مقيد، RevokeAll محصور SuperAdmin | إلغاء refresh من مصدره؛ تغيير الاعتماد/الدور يحدث stamp، والمضيف يتحقق منه للطلبات المصادق عليها |
| الناشر | RabbitMQPublisher lazy، registration بعد commit | الدخول لا يفتح broker؛ فشل الحدث يحذر ويبقي الحساب المحفوظ؛ لا ضمان outbox أو provisioning للـERP |
| الواجهة | environment.ts / environment.prod.ts | local login على7120، وproduction على /identity/ الذي يحتاج proxy في النشر؛ بقي AuthService والـloading/error owners الحاليون |
| فلتر الحل | SiGma.ServerAPI.slnf | سبعة مشاريع: أُضيف Security، واعتماديات Helpers/ViewModels ضمن الفلتر والحل |
| دليل المستخدم | Administration guide / shell account topics | ملاحظة ثنائية اللغة عن كود الشركة وحدود إدارة حساب الدخول |

## الملفات والتغييرات

جذر الخلفية:

`F:\My Work\Sigma\SigmaBackend`

ملفات مشروع Security التي تغيرت أو أنشئت:

- المضيف `SiGma.Security/Program.cs`، والتسجيل `Extensions/SecurityServiceCollectionExtensions.cs`، وخيارات JWT/SubscriptionAccess/Bootstrap كل نوع في Options بملفه.
- الخدمات `IdentityAuthenticationService.cs` و`IdentityAdministrationService.cs` و`IdentityTokenService.cs` و`SubscriptionCodeResolver.cs` و`IdentityBootstrapCommand.cs` و`RabbitMQPublisher.cs`، وعقود IServices الأربعة.
- النقل `Controllers/AuthenticateController.cs` و`AuthController.cs` و`SecurityControllerBase.cs`؛ أُزيل RoleController القديم غير المستخدم.
- التنظيم `Contracts/SecurityResponse.cs` و`TokenModel.cs` و`AssignRoleVm.cs` و`IdentityActorContext.cs` و`AuthenticateUserVM.cs` و`AuthenticateUserResultVM.cs`؛ وثوابت `Authorization/UserRoles.cs` و`SecurityPolicies.cs`.
- الهوية `Models/ApplicationUser.cs` و`DataAccess/ApplicationDbContext.cs` بدل مواضعهما تحت ViewModels مع حفظ namespace الخاص بالمخطط.
- التكوين `appsettings.json` بلا أسرار ثابتة، و`SiGma.Security.csproj` بحذف حزمة OpenApi9 غير المستعملة مع مشروعnet10 القائم، ومثال الطلب `SiGma.Security.http` ودليل `README.md`.
- أُزيلت DTOs المهجورة RoleCreateVM/CreateRoleDataVM/Response وJWTTokenVM القديم الذي يحمل إعداد توقيع ثابتًا. لم تُحذف عقود خارج نطاق المالك.

ملفات التكامل الخلفي:

- المالك المشترك `SiGma.Helpers/Security/IdentityClaimTypes.cs`، ومساعد الاتصال `SiGma.Helpers/Helpers/ApiSecurityHelper.cs`؛ الطلب المجهول يستخدم client منفصلًا دون محو bearer من client الإدارة، وردود فشل الدخول لا تتحول إلى نموذج نجاح فارغ.
- الوسيط `SiGma.Business/Services/Security/SecurityService.cs`؛ LoginConsoleAsync ينادي العقد المحلي بدل الفشل في كل الفروع، وتصحيح عنوان legacy mobile. لم تُغيّر خدمات المال أو الموافقات.
- تسجيل الثقة `SiGma.ServerAPI/Extensions/SigmaIdentityAuthentication.cs` واستدعاؤه في `DependencyResolver.cs` مع إبقاء إضافات الموافقات القائمة في نفس الملف؛ إعداد التطوير يوجه AuthenticationServer إلى7120، وأُفرغ AppSecret القديم غير المستهلك بعد الانتقال إلىJWT:Secret.
- الفلتر `SiGma.ServerAPI.slnf`؛ المشروع موجود أصلًا فيSiGma.sln، فلا حاجة لتغيير الحل نفسه.

جذر الواجهة:

`F:\My Work\Sigma\SiGmaAngularFrontEnd`

تغيرت `src/environments/environment.ts` و`environment.prod.ts` و`src/app/modules/UserGuide/content/administration-guide.ts` (ملاحظة الدخول فقط). التغييرات الموجودة مسبقًا في AuthService والدليل والعملات محفوظة؛ لا تُنسب لهذه الشريحة. لا type/runtime entry جديد فيAngular أو تغيير component/route/interceptor/loader.

## تسجيل المستخدمين والأدوار والصلاحيات

واجهات إنشاء حسابات الدخول محمية وجاهزة مصدرًا داخل Security. يبدأ مشغل المنصة بتجهيز أول مدير من CLI، ثم ينشئ مدير الاشتراك للرقم1007 عبر register-admin، ثم ينشئ مدير الاشتراك مستخدميه عبر register-user/register-tenant-user. الأدوار الإدارية العامة لدى Security، والتدرج الحالي يتيح للمدير إدارة الأدوار التابعة المحددة دون منح Admin/SuperAdmin لنفسه. حساب المنصة بلا مستأجر لا يفتح بيانات ERP عبر توكنه.

شاشة Users الحالية في ERP وأدوار الشاشات **لا تنشئ حساب Identity أو تزامنه بعد**. الحقول الخام للمستخدم القديم لا تُستعمل للدخول الجديد. ربط الإدارة يحتاج معرفًا ثابتًا بين الكيانين وقرار تعافي لحدّي الحفظ؛ لم نخمن المطابقة بالاسم ولم نعتبر رسالة RabbitMQ إثبات نجاح. آلية صلاحيات ERP الحالية ما زالت تعلن EnforcementEnabled=false؛ لم تُفعّل ضمن إصلاح structure/compatibility ولم يُخترع permission API موازٍ. هذا الحد مذكور في العقد ودليل المستخدم وREADME.

الدخول بالرمز المحمول القديم ليس OTP؛ حُفظ المسار للمطابقة لكنه معطل افتراضيًا بخيار AllowLegacyMobileCodeLogin=false حتى عقد اعتماد محمول معتمد. محاولات الدخول والـrefresh لها حد20/دقيقة لكل عنوان مرئي للمضيف، وكلمة المرور تستخدم حارس lockout منIdentity. لا زيادة صلاحيات بمجرد إنشاء دور عميل اعتباطي.

## حدود الجلسة والنشر المطلوبة

يلزم إعداد اتصال قاعدة Identity ومفتاح JWT آمن واحد في Security وERP. تركهما فارغين في المصدر قرار مقصود: startup يفشل برسالة إعداد واضحة عند غياب القيم. لا تكتب قيمة سرية في مراجعة أو مثال أو Git. القيم المنشورة القديمة لم تُغيّر وتحتاج تدويرًا من مالك النشر، وحذف القيمة من المصدر لا ينظف التاريخ.

تتطلب production Angular إعداد proxy لنفس الأصل /identity/ مع إزالةprefix قبل Security. لا يوجد عنوان نشر جديد مختلق أو deployment منفذ. ينبغي التأكد من TLS وforwarded-address عند اعتماد rate limit خلفproxy. التوكنات القديمة من خدمة الدخول الخارجية تحتاج دخولًا جديدًا؛ صلاحية الحسابات في مخزن الهوية المحلي لم تُفحص ولم تُنسخ من خدمة غير متاحة.

انتهاء/إبطال refresh يمنع التجديد، لكنه لا يلغي ERP access token الصادر فورًا؛ حدّه30دقيقة. مضيف Security يفحص security stamp الحالي، بينما ERP يتحقق stateless من التوقيع والمدة والمستأجر. لم ننشئ claim لرقم مستخدم ERP أو فرع غير مثبت. ربط الفرع وأدوارERP يحتاج قبول المالك قبل تمكين إدارة الحسابات منهما.

## فحوص المصدر المنفذة

اجتاز فلتر الحل تحليل JSON ووجود كل مشروع في SiGma.sln وعلى القرص، وصارت قائمته7. اجتاز مشروع Security تحليل XML والتحقق من ProjectReferences، وملفات التكوين الأربعة تحليل JSON. تأكد الربط101007→1007 وفراغ قيم المفتاح/اتصالIdentity/سرbroker المتتبعة دون طباعتها. لا تغييرات schema ولا migrations/snapshots.

اجتازت الفروق المقيدة في مستودعي الخلفية والواجهة `git diff --check` بخروج0. روجعت ملفات العقود والخدمات الجديدة وnamespaces واستيراداتها والإدراج الافتراضي للمشروع؛ لا تعريفان لنفس النوع أو أصناف مساعدة داخل الخدمات. مؤشرات البحث لم تجد Database.Migrate/EnsureCreated أو bootstrap HTTP أو استخدام JWTTokenVM القديم في مصدر Security غير المولد. مصدر إصدار JWT موقع واحد فيIdentityTokenService. هذه أدلة مصدرية لا compilation أو runtime.

اجتاز recipe check الحزم الثماني عند البداية وعند الإقفال دون تعديل packets. قُرئت قواعد Sigma والمهارة والكتل المناسبة ومالكو المصدر الفعليون؛ مراجع Speed ودليله وكوده وOdoo غير منطبقة على تنظيم خدمة هوية دون تغيير عقد شاشة عمل تجارية. لا AutoMapper أو حسابات مالية أو grid/list قرارداد جديدة أو متطلبات صور في الشريحة.

اختبارات TDD التنفيذية متعذرة تحت قاعدة Sigma source-only الأعلى أولوية؛ وُثقت حالات القبول قبل التعديل ولم تُشغّل أو تُختلق نتائجها. لا build/test/lint/database/browser/HTTP أو تشغيلCLI أو migration/commit/push/deploy/Graphify/Sigma MCP.

## الأداء والفهارس

أُزيل اعتماد إنشاء Controller على اتصال broker فعلي، فأصبح broker يفتح عند نشر حدث التسجيل فقط. لا توجد قياسات زمنية تثبت مقدار التسريع. تحقق security stamp يقرأ مستخدم الهوية للطلب المصادق عليه، وقد تتبعه قراءة حارس الإدارة؛ هذا فحص أمني حالي مباشر وليس cache. يستحق المالك قياس زمن الدخول وqueries وحمل محاولات الدخول تحت lockout والـproxy. لا فهرس جديد مقترح دون SQL/خطة تنفيذ؛ تعتمد الاستعلامات على فهارس Identity القائمة للمعرف/اسم المستخدم والبريد. لا تعديلات schema بسبب هذا النقل المادي.

## المراجعة المستقلة والمصالحة

حاول دورا security_host وsecurity_administration التنفيذ باستخدام gpt-5.6-sol/high وفق توجيه المشروع، وأوقفهما عدم توافر الخدمة/حد الاستخدام بعد كتابة أجزاء من الملفات. استكمل الجذر الملفات الناقصة وفحص التغييرات؛ لا ادعاء تسليم مكتمل من الوكيلين. راجع security_final_review بالنموذج الموروث حسب استثناء عدم التوافر؛ التقط تعارض CLI مع command-line configuration، وأُصلح بفلترة flag قبل CreateBuilder. صُولح أيضًا تدرج الأدوار الدنيا مع سياسات الـcontroller، وأعيدت قراءة حراس المستأجر والتوكن والرد. احتفظ الجذر بالتكامل ومراجعة الفروق وحفظ تعديلات النظير.

نُفذت discovery/contract/backend/integration/reconciliation المصدرية. التشغيل ومرحلة قبول البيئة لم تنفذ. لا migration مطلوبة لهذه الشريحة طالما مخطط Identity القائم موجود؛ إن كان غير موجود فتهيئته/هجرته مسؤولية Master7 وفق حالته الحقيقية، دون إنشاء هجرة وهمية لهذه النقلة. رسالة commit مقترحة للخلفية `refactor(security): centralize identity services and align ERP token contracts`، وللواجهة `fix(auth): use the local Sigma identity service`؛ لم ينفذ commit.

## قبول المالك المتبقي

بعد تفويض تشغيل مناسب: build للمشروعين، إعداد الأسرار واتصال الهوية، دخول مستخدم موجود بكود101007 ومقارنة tenant1007، رفض code/password/tenant خاطئ، توقيع/issuer/audience/expiry خاطئ، أول مدير عبرCLI ثم رفض التكرار وغياب HTTPbootstrap، منع tenant escalation/تغيير الدور الإداري/تعديل مستأجر آخر، تغيير كلمة المرور والأدوار ثمrefresh، تعارض طلبَيrefresh، تعطلbroker، UI loading/errors/session وproxy/TLS. راجع هوية مستخدمERP وفرعه قبل وصل إدارة الحسابات أو تطبيق صلاحيات تشغيلية. هذه حالات قبول معلقة، وليست عيوبًا أُخفيت بادعاء نجاح التشغيل.

## إعداد الاختيار المحلي والهوست للدخول — متابعة٥نوفمبر٢٠٢٦

طلب المالك تجربة الدخول بخدمة Security المحلية وإعداد مساري المحلي والهوست مثلAPI. صار في كل ملف environment مفتاح `useLocalSecurityServer` مستقل عن اختيارERP، وعنوانان `localSecurityUrl=https://localhost:7120/` و`remoteSecurityUrl=/identity/`. الاختيار الحالي محلي فيdevelopment وهوست فيproduction؛ يُضبط العنوان المستضاف النهائي عند نشر الخدمة. مسار `auth/consolelogin` يستهلك `environment.baseLoginUrl` نفسه دون تغيير عقد الطلب أو الرد أو معالجة التحميل. تحديث محدود للـconfiguration لا يغيّر شاشة أوcache أوصلاحية.

فحص منافذ الاستماع أثناء المتابعة وجدAngular4200 يعمل، ولم يجدSecurity7120/5055 أوERP7178/5159. لم يُرسل طلب دخول أوتُفحص بيانات مستخدم أوتُشغل خدمة أوبناء؛ تجربة الدخول الفعلية معلقة لتشغيل الخدمة وتوفير الحساب. واجهة المتصفح غير متاحة في أدواتالجلسة؛ جرى اكتشاف التوفر فقط. لا ادعاء بنجاحLogin.

توضيح المالك التالي طلبرابطين صريحين محلي وهوست؛ عُدلتقيمة `remoteSecurityUrl` فيملفيالبيئة إلىعنوانالدخولالسابق `http://hassannla-002-site21.ctempurl.com/` بدلالمسارالنسبي، و`localSecurityUrl` على7120. اختيارdevelopment يبقىمحليًا. عنوانالهوست قابلللتعديل عندنشرالمشروعالحالي، ولايعنيالإعداد إثباتنشرنفسالكودهناك أوتجربةالدخولعليه.

تعديل سابق بطلب المالك للتجربة أعاد اتصالIdentity وقيمJWT إلىالإعدادات المتتبعة ووحدها معERP؛ هذا ينسخ تعليمات فراغ الأسرار المذكورة بتاريخالتنفيذ الأصلي لهذهالبيئة التجريبية فقط. لا تُطبع القيم هنا ولا تثبت صلاحيتها. يظل تحسين تخزين إعداداتالنشر عملًا لاحقًا؛ خوادم الهوية وERP حسبالإعدادات الحالية تشيرلنفسقاعدةالبيانات، دون اتصال بها منالمراجعة.

## فصل فلتر المنصة عن فلتر ERP — ٥ نوفمبر ٢٠٢٦

الحالة: Implemented — source-only. قبول المالك في Visual Studio معلق.

بطلب المالك أُنشئ `SigmaBackend/SiGma.Platform.slnf` على الحل `SiGma.sln`، ويضم مشاريع CustomerMVC وSecurity وSubscriptionAPI مع اعتمادياتها الفعلية Helpers وRepos وViewModels؛ مجموعها ستة مشاريع. لا تحتاج هذه المجموعة إلى Business أوDataAccess حسب ProjectReference الحالي. أُزيل Security من `SiGma.ServerAPI.slnf`، وأصبحت قائمته ستة مشاريع مع اكتمال اعتمادياتها. هذا القرار ينسخ إضافة Security إلى فلتر ERP المسجلة سابقًا، ويحافظ على وجود المشروع في الحل الأساسي.

شريحة صغيرة وفق Master1؛ لا تغيير لشاشة أوعقد API أوصلاحيات أومخطط قاعدة البيانات، ولا حاجة إلى دليل شاشة أوهجرة أوحزمة مولدة. دليل Speed وشرح الشاشات وكود Speed ومراجع Odoo ومهارة شاشة Sigma غير منطبقة على إعداد فلتر الحل. استُخدمت مهارة التحقق قبل الإنهاء، ولم يُستخدم وكلاء لضآلة التعديل.

اجتاز الملفان تحليل JSON ووجود الحل والمشاريع وتسجيلها في الحل وعدم تكرارها واكتمال ProjectReferences. تأكد وجود التطبيقات الثلاثة في فلتر المنصة وغياب Security من فلتر ERP. روجعت فروق الملفين واجتازت فحوص whitespace. لم تُشغّل builds أوtests أوlint أوقواعد بيانات أومتصفح أومigrations أوcommit أوpush أونشر. قبول المالك: فتح كل فلتر والتأكد من قائمة المشاريع؛ فلتر الحل وحده لا يحدد إعداد تشغيل عدة مشاريع. رسالة commit مقترحة للخلفية: `chore(solution): split platform and ERP solution filters`.

## تجهيز تشغيل MVC مع مكونات المنصة — ٥ نوفمبر ٢٠٢٦

الحالة: Implemented — source-only. الإقلاع وقبول Visual Studio معلقان للمالك.

طلب المالك تجهيز CustomerMVC مع بقية مكونات فلتر المنصة. أُضيف بروفايل `Sigma Platform` إلى `SigmaBackend/SiGma.slnLaunch`، ويشغّل SubscriptionAPI ثم Security ثم CustomerMVC، بإجراء Start وهدف https لكل مشروع. ترتيب الإطلاق لا يثبت جاهزية الخدمة السابقة؛ لم يُنفّذ تشغيل. بروفايل التشغيل السابق محفوظ.

أُضيف عنوان SubscriptionAPI المحلي `https://localhost:7142` إلى إعداد Development الخاص بـMVC، وجرى تفعيل فتح Swagger بخدمة الاشتراكات على المسار `Swagger` المطابق لـProgram. صفحة MVC المضبوطة على `https://localhost:7222/` تفتح المتصفح بإعدادها القائم، وSecurity مضبوط على `https://localhost:7120/swagger`. لا تغيير لدخول MVC أوتنفيذ ربط إدارة Security منه؛ يستمر عميل MVC الحالي في استهلاك SubscriptionAPI فقط.

شريحة إعداد صغيرة وفق Master1، دون تغيير شاشة أوAPI أوصلاحيات أومخطط قاعدة البيانات. دليل Speed وشرحه وكود Speed ومراجع Odoo ومهارة الشاشة غير منطبقة. راجع الجذر إعدادات التشغيل والبرامج والعملاء ذات الصلة، واستخدم التحقق المصدري قبل الإنهاء؛ لا تفويض لوكلاء لضآلة المهمة. روجعت أيضًا [وثائق Microsoft للتشغيل المشترك](https://learn.microsoft.com/en-us/visualstudio/ide/how-to-set-multiple-startup-projects?view=visualstudio).

تحقق المصدر: تحليل JSON، وجود المشاريع الثلاثة في الفلتر وعلى القرص، أهداف https ضمن launchSettings، بيئة Development وفتح المتصفح، توافق عنوان اشتراكات MVC، ومنافذ منفصلة للمكونات. روجعت الفروق كاملة؛ لم تظهر أخطاء whitespace، وخروج no-index بقيمة1 يعبّر عن اختلاف الملف الجديد عن الملف الفارغ، لا فشل تشغيل. لا بناء أواختبارات أوlint أوتشغيل خدمات أوقاعدة بيانات أوم migrations أوcommit أوpush أونشر أوتصفح التطبيق. لا هجرة أوتعديل حسابات أوأسرار.

قبول المالك: إعادة فتح `SiGma.Platform.slnf` عند الحاجة، واختيار `Sigma Platform` من قائمة التشغيل ثم F5. التحقق من ظهور MVC وصفحتي Swagger ومن تحميل بيانات الاشتراكات. إعداد SubscriptionAPI القائم `EnsureCreatedOnStartup=true` في Development لم يتغير ولم يُنفّذ هنا؛ لا ادعاء سلامة مخطط قاعدة البيانات أوتنفيذ تهيئة. رسالة commit مقترحة للخلفية: `chore(dev): configure joint MVC security and subscription startup`.
