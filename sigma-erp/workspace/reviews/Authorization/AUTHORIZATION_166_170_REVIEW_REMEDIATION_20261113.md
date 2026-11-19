# مراجعة ومعالجة صلاحيات البنود 166–170 — 13 نوفمبر 2026

**النطاق:** `/User` (166)، `/VehicleNotReadyReason` (167)، `/VoucherReason` (168)، `/Settings` (169)، `/Account` (170). جرى الرجوع إلى جرد المسارات الحالي وقواعد Sigma والمهارة والعقود المجمدة والتطبيق؛ قرئت أدلة Speed وشفرة الإعدادات المقابلة كل على حدة. تصف الإحالات أدناه حالة المصدر **بعد الإصلاح**.

## الملاحظات بترتيب الخطورة

| الخطورة | البند وموضع السبب | الأثر الذي ثبت من المصدر | المعالجة والطبقة |
|---|---|---|---|
| عالية — عولجت في المصدر، قبول HTTP الحي معلق | 169: `SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs:25-28`، `SettingsWorkspaceAdminEndpointRules.cs:10-79`، و`PermissionAuthorizationFilter.cs:56-65,91-97` | منحة مورد مستقلة كانت كافية لتجاوز حارس `/Settings` عبر HTTP مباشرة لعمليات إدارة الإعدادات، ومنها `ChargeSettings.Update` و`DocumentApproval.SavePolicy` وكتابات CRUD | فرض شرط `TenantAdmin` على controller/action إداري محدد في resolver/filter والكتالوج؛ الإبقاء على القراءات والإجراءات التشغيلية المشتركة دون تعميم الحظر |
| عالية — عولجت في المصدر، قبول HTTP الحي معلق | 169: `SettingsCommonModelController.cs:18-30` و`SettingsCommonModelDetailVm.cs:35-39` | `GET GetMySetting` المشترك مع شاشات البيع والتأجير كان يرجع `WebBookingApiKey` و`GoogleApiKey` لمستخدم عادي يحمل منحة القراءة | حجب المفتاحين عن غير المدير داخل استجابة GET، مع الإبقاء على الضريبة والإعدادات التشغيلية؛ منع تفاصيل `PaymentGateway/Mine` و`ApiKeySetting/Mine` للمستخدم العادي |
| عالية — عولجت | 170: `SiGma.Business/Validators/Accounts/AccountValidator.cs:451-458,488-496` و`Services/AccountServices/AccountService.cs:204-214,301-308` | كان فلتر فرع المشاهد يحجب وجود قيد يخص الحساب في فرع آخر من الاشتراك، مما يضعف منع حذفه/تغييره | فحص وجود القيود على مستوى الاشتراك بمسندَي `SubscriptionId` و`IsDeleted` الصريحين، دون كشف تفاصيل فرع مخفي؛ اختبار `AccountHiddenJournalScopeTests` ناجح |
| متوسطة — عولجت | 169: `Administration/Settings/components/common/common.component.ts:685-718,800-841` و`models`/خادم `SettingsCommonModelService.cs:22-47` | كانت طرق الدفع المحفوظة كائنات بينما الـMultiSelect ينتظر IDs، وكان الفراغ الأول في الاشتراك يُعامل كفشل لا يسمح بإنشاء إعداد | تحويل IDs، والتحقق من الخيارات الحديثة، وإرجاع `IsSuccess=true, Entity=null` قبل الإنشاء الأول؛ اختبار `SettingsCommonEmptyTenantTests` ناجح |
| متوسطة — عولجت | 169: `Administration/Settings/components/common/common.component.ts` و`components/charges/charges.component.ts` | كانت المسودات تُمحى عند عودة المنحة، ويتوقف التوجيه عند سحب الوصول خلال تأكيد تجاهل مفتوح، ولا تلتقط مراقبة `take(1)` السحب الثاني | حفظ المسودة في إعادة المنحة، مراقبة مستمرة، إلغاء التأكيد القديم وإعادة طلب الخروج بعد تسويته، وفصل الكتابة المرسلة عن القراءة والصفحة |
| متوسطة — عولجت | 169: `common.component.ts` و`Settings/services/common.service.ts` | كان زر إنشاء مفتاح API يستعمل عنوان الإنتاج أثناء التطوير ويُلغى بإنهاء المكون؛ وكانت خيارات الدفع لا تُجدد عند إعادة المنحة | استخدام `environment` النشط، و`HttpContext` لحماية نشر النتيجة، وإعادة `PaymentMethod/settings-options` والتحقق من معرفات الاختيارات قبل حفظ metadata |
| متوسطة — عولجت | 169: `SettingsCommonModelService.cs:22-64` | لم يتطابق إنشاء إعدادات الشركة لأول مرة مع تحديثها في رفض نسبة ضريبة خارج 0–100، وكان GET الفارغ يمنع الإنشاء | نجاح قراءة صف فارغ، ورفض نسبة ضريبة غير صالحة قبل `POST`؛ اختبار خدمة مع قاعدة InMemory معزولة |
| متوسطة — عولجت | 167: `SiGma.Business/Services/VehicleNotReadyReasonService.cs:12-69` و168: `VoucherReasonService.cs:11-52` | كان generic list يقبل فرزًا وحقول تصفية غير منشورة؛ وكان قارئ navigations الموروث يتخطى منع المحذوف | قائمة بيضاء لمرشحات/فرز حقول الشاشة، وقصر Grid على إسقاط 167 المعروض؛ 168 Grid مقصور طبيعيًا على `Id/Reason` في DTO؛ توحيد قراءة navigations مع قائمة غير المحذوف؛ 9 اختبارات رفض ناجحة |
| منخفضة — عولجت | 167–168: `Administration/VehicleNotReadyReasons/components/details/details.component.ts:167-185` و`VoucherReasons/components/details/details.component.ts:185-203` | كان سحب المنحة خلال تأكيد تجاهل قد يترك قرارًا قديمًا مفتوحًا | يُلغى التأكيد القديم عند السحب ويظل طلب تجاهل محلي جديد ممكنًا؛ الكتابة المرسلة لا تُعاد تلقائيًا |

## المطابقة حسب البند

| البند | تصنيف الجرد الذي أُبقي | أثر التنفيذ |
|---|---|---|
| 166 `/User` | `operation-confirmed`, `admin-only` | لا تعديل مصدري جديد؛ مصدر HTTP `/User` وعمليات الهوية يخضع لـ`TenantAdmin` وفحوص المنح/الفروع؛ نجحت 9 اختبارات خدمة لإعداد المستخدم وفروعه، وتظل هجرتا StaffLink وIdentityLastLogin وقبول التفويض في المتصفح معلقة |
| 167 `/VehicleNotReadyReason` | `operation-confirmed` | حصر Filter/Grid/Sort والتصدير وفق القائمة؛ حماية تأكيد إغلاق المسودة |
| 168 `/VoucherReason` | `operation-confirmed` | حصر Filter/Grid/Sort والتصدير وفق القائمة؛ حماية تأكيد إغلاق المسودة |
| 169 `/Settings` | `kind: admin-only`، وإثبات `status` مستقل | قرر المالك نهائيًا حصر جميع تبويبات `/Settings` في `TenantAdmin` دون تفويض للمستخدم العادي؛ قاعدة التنقل صريحة، وأُصلحت دورة الحفظ/المسودات لثمانية تبويبات. تراجع عمليات إدارة HTTP على حدة مع الإبقاء على القراءات التشغيلية المشتركة، ولا يُرقّى إثبات العملية بمجرد القرار |
| 170 `/Account` | `operation-confirmed` | إصلاح وجود القيود في الفروع المخفية، وحراسة شجرة الحسابات ومحررها في سحب/عودة المنح والكتابات المرسلة |

**الفرع والمخزون:** إدارة المستخدمين تتطلب الفرع الفعّال والمنحة المرتبطة به، والحسابات لا يجوز تحريرها اعتمادًا على قيود الفرع المرئي فقط. أما معادلات رصيد الأصناف تحت قفل مخزون، والاستثناء الخاص بسطر النقل غير النشط، واعتماد/إبطال التحويلات، فلا تُنشئها مسارات التعريفات والإعدادات والحسابات الخمسة موضوع هذه الجولة. لا يُعمّم سلوك وحدات المخزون السابقة عليها.

**القائمة والتقرير:** 167 و168 تستعملان list GET وتصدير Excel من المرشح والفرز المطبقين على النتائج المتاحة. لا ينفذ Tab `/Settings/common` تقرير Excel أو Print، ودليل الحسابات شجرة قراءة، وليس تقرير أرصدة. رفض الوصول أولًا من `RouteAccessPolicyRegistry` للمسار، ثم من مرشحات الخادم ومنح HTTP عند تجاوز التنقل، ويليها تحقق الخدمة للأهلية وقيد بيانات الاشتراك.

## دليل التحقق وحدوده

نتائج البناء والاختبارات التالية تخص **جولة الإصلاح السابقة** قبل حسم `TenantAdmin` في 169. لا تُقدّم كدليل نجاح لاختبارات HTTP الجديدة:

| التحقق | النتيجة |
|---|---|
| وصفات Sigma المرجعية | `Generate-SigmaRecipes.ps1 -Check`: ناجح عند بدء الجولة |
| Backend | `dotnet build SiGma.Business/SiGma.Business.csproj --no-restore -v quiet`: ناجح، **0 أخطاء**، تحذيرا CS0114 قديمان في JobService وBillService خارج النطاق |
| Frontend | `npm run ng -- build --configuration=development`: ناجح، يتضمن Angular templates |
| الاختبارات | `dotnet test ... --filter` لأربع مجموعات: **20 ناجحًا، 0 فشل، 0 تخطٍّ** (9 UserRegistration، 9 AdministrativeReasonFilter، 1 AccountHiddenJournalScope، 1 SettingsCommonEmptyTenant) |
| الفروق | `git diff --check` نجح لكلا مستودعي المصدر؛ لا commit أو push |

**تحقق قرار البند 169 بعد الحسم:** نجح `tsc --noEmit --project tsconfig.app.json`، وفحص JSON للجرد (`263` صفًا و`4` صفوف `admin-only`)، وفحص الوصفات `Generate-SigmaRecipes.ps1 -Check`، و`git diff --check` لكل من frontend وbackend. نجح `dotnet build SiGma.ServerAPI/SiGma.ServerAPI.csproj --no-restore -v quiet` (صفر أخطاء، 13 تحذيرًا قائمًا خارج التعديل)، و`dotnet build tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj --no-restore -v quiet` (صفر أخطاء، 22 تحذيرًا قائمًا خارج التعديل)، ونجح `dotnet test tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj --no-restore --filter "FullyQualifiedName~SettingsWorkspaceAdminEndpointTests" -v quiet` بنتيجة **70/70** دون فشل أو تخطٍّ. شملت الاختبارات قيد HTTP عند منح مورد مستقل وقبول المدير وسلامة القراءات التشغيلية وحجب مفاتيح Common. فشلت أول محاولة لبناء Angular بسبب نقص ذاكرة Windows الافتراضية في `esbuild` (`VirtualAlloc errno=1455`) عند البناء بالتوازي، ثم **نجحت إعادة البناء كاملةً** مع `GOMAXPROCS=2` و`NG_BUILD_MAX_WORKERS=2` عبر `npm run ng -- build --configuration=development` (`exit code 0`، `2026-11-13T21:41:34.128Z`). لم يحدث قبول HTTP حي أو قاعدة بيانات أو متصفح أو commit/push.

**حد قبول المالك:** اختبارات الخدمة لا تثبت استجابات HTTP الحقيقية أو جدولة SQL ولا العمل عبر عدة مستخدمين، ولا تثبت إصدار الطباعة/Excel تحت سحب المنحة أثناء التنفيذ ولا جودة العرض RTL/الهاتف. لم تُشغّل أي قاعدة تطوير خارجية أو هجرة أو متصفح على بيانات مستخدم فعلية. تبقى تجارب endpoint وقواعد بيانات SQL Server والقبول التشغيلي معلقة. اختبار الحالة المقصودة يبدأ بإنشاء صلاحيات وفرع صحيحين، ثم سحب منحة العرض أو الإجراء على حدة، وملاحظة الرفض عند الطبقة التي تملك الشرط.

## ملفات المطابقة والدليل

- البند 166: `USERS_COMPLETION_FINAL_RECONCILIATION.md`، ودليل المستخدمين في `UserGuide/content/administration-guide.ts`.
- البنود 167–168: `ADMINISTRATIVE_DEFINITIONS_ACCESS_ADOPTION_FINAL_RECONCILIATION.md`، ودليلا `vehicle-not-ready-reasons-topic.ts` و`voucher-reasons-topic.ts`.
- البند 169: `SETTINGS_WORKSPACE_169_ACCESS_CONTRACT_FREEZE.md` و`SETTINGS_WORKSPACE_169_FINAL_RECONCILIATION.md`، ودليل `settings-topics.ts`.
- البند 170: `ACCOUNT_CHART_ACCESS_ADOPTION_FINAL_RECONCILIATION.md` ودليل `accounts-guide.ts`.
