# مطابقة صلاحيات رابط بنود طلب الأصناف — البند ١٦٢

| الحقل | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٣ نوفمبر ٢٠٢٦ |
| المسار | `/ItemRequisitionItem` وجميع امتداداته القديمة |
| العقد | `ITEM_REQUISITION_ACCESS_CONTRACT_FREEZE.md` (البند ١٦١)، وعقد ملكية بنود المستند `reviews/ITEM_REQUISITION_DOMAIN_API_CONTRACT_FREEZE.md` |
| المراجعة السابقة | `AUTHORIZATION_162_SOURCE_REVIEW_20261113.md` |

## سلوك الرابط والواجهة

`SiGmaAngularFrontEnd/src/app/pages/routing.ts:612–616` يحمّل `Stock/ItemRequisitionItem/itemrequisitionitem.routes.ts:4–7`؛ الحارس `canMatch` يعيد رابطًا نظيفًا إلى `/ItemRequisition` مهما كان امتداد الرابط القديم، ولا ينقل معرف سطر أو معاملات استعلام أو نية تحرير. يطبّق `layout/layout.module.ts:214–221` حارس الصلاحيات على الوجهة. يسجل `shared/authorization/route-access-policy.ts` منحة `ItemRequisition.View` للقائمة ويرفض الرابط إن لم يملكها المستخدم العادي، بينما يظل المدير مرتبطًا بحدود الشركة. لا توجد طلبات بيانات أو تحميل أو نوافذ أو تقرير أو Excel مستقلة للـalias؛ جميعها وظائف الطلب الأم. مصدر الصفوف الفعلي `ItemRequisition/components/details/details.component.ts` ويؤكد دليل Speed المؤرخ لدورة ٢٠٢٦-١٠-٢٨ (`C1706/C1707`، شاشة `04-item-requisitions`) ملكية محرر الطلب لصفوفه.

## إغلاق المنافذ المباشرة

المتحكم `SigmaBackend/SiGma.ServerAPI/Controller/ItemRequisitionItemController.cs` موروث من `SiGmaControllerBase`. قبل الإصلاح، كان `POST /ItemRequisitionItem` يسمح بإنشاء سطر مستقل، وكان `handleActivate` يغيّر `IsActive` في سطر مملوك لمستند، وكانت خدمة البند تسمح بتعديل وحذف السطور اليتيمة والقراءات العامة. جميع العمليات المباشرة أصبحت تُرجع **`405 Method Not Allowed`** من `SiGma.Business/Services/ItemRequisitionItemService.cs` قبل أي استعلام أو حفظ:

| الفعل | HTTP / مسار موروث | نتيجة الخدمة |
|---|---|---|
| العرض والقائمة والتفاصيل | `GET /ItemRequisitionItem`، `GET /ItemRequisitionItem/GetById/{id}`، `GET /ItemRequisitionItem/GetByWithNavigationsId/{id}` | 405 |
| قوائم الاختيار والتحميل الكامل | `GET /ItemRequisitionItem/GetSelect`، `GET /ItemRequisitionItem/GetAllWithNavigations` | 405 |
| فحص التفرد | `POST /ItemRequisitionItem/CheckUnique` | 405 |
| إضافة بند | `POST /ItemRequisitionItem` | 405 |
| تعديل أو حذف بند، مرتبط أو يتيم | `PUT /ItemRequisitionItem`، `DELETE /ItemRequisitionItem?id=…` | 405 |
| تفعيل/تعطيل بند | `POST /ItemRequisitionItem/handleActivate` | 405 |
| عمليات مجموعة الخدمة غير المعروضة في المتحكم | `AddList`، `UpdateList`، `GetManyWithNavigations` | 405 عند استدعاء الخدمة مباشرة |

`PermissionEndpointResolver.Resolve` يجعل كل عمليات المورد `ItemRequisitionItem` غير قابلة للإسناد؛ يرفض `PermissionAuthorizationFilter` مستخدمًا عاديًا بـ403 قبل الوصول للخدمة، ويصل مدير الشركة إلى الخدمة التي تعيد 405. لا يعيد فتح أي منحة قديمة هذا المورد. تبقى عمليات إنشاء/تعديل/عرض السطور عبر `ItemRequisition`، حيث تُطبق مرشحات فرع `Job.BranchId` والتحقق من التعديل والكميات والارتباطات على مستوى الشركة ضمن العقد ١٦١.

## المطابقة والتحقق

| البند | النتيجة |
|---|---|
| ملكية المستند/الفرع | تقيد القراءة والكتابة في مسار `ItemRequisition` الأصل وفق العقد المجمد. مسار البنود المباشر متقاعد بالكامل؛ لا يقرأ صفوف فروع أخرى. |
| الكمية المتبقية والنقل والنشاط | لا يوجد حساب ولا نقل على رابط البنود؛ المسار الأم يملك حسابات الشركة وقفل الكتابة وفحص الفرع والمراجع. راجع `ITEM_REQUISITION_ACCESS_RECONCILIATION.md`. |
| القائمة والتقرير وExcel والفلاتر والطباعة | كلها مملوكة للطلب الأم، وبنودها تستهلك الاستعلام نفسه، وسحب `Job.Lookup` مرتبط بنسخة الصفوف المستخدمة للطباعة وفق مطابقة ١٦١. |
| نافذة المسودة وسحب الصلاحيات | لا يوجد محرر بنود مستقل؛ المسودة والتأكيد والإغلاق وتجديد المنحة تتم في محرر `ItemRequisition` الرئيسي. |
| دليل الاستخدام | تحديث `UserGuide/content/stock-guide.ts` بالعربية والإنجليزية للتوجيه إلى جدول بنود الطلب ومنع التعامل المباشر مع الـAPI المتقاعد. |
| الجرد | `ROUTE_PERMISSION_ADOPTION_INVENTORY.json` يصنف البند `alias` بلا منح مستقلة؛ عدد العمليات المؤكدة يبقى تابعًا للبند ١٦١ (`160/263`) ولا يزداد بحساب هذا الرابط. |

### سجل التحقق السابق للبند ١٦٢

اختبرت مواصفة الخادم عدم قابلية إسناد أفعال المتحكم العشرة، وأجرت ١٥ استدعاءً مباشرًا على ١٣ دالة في واجهة الخدمة. أعادت جميع الاستدعاءات 405 من الخدمة. يتضمن العدد حالات بديلة لمعاملات التعديل والحذف. الأمر التالي جزء من سجل التشغيل السابق. [مواصفة الخادم](<F:/My Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionItemRetiredEndpointTests.cs:21>).

```powershell
dotnet test tests/SiGma.BranchAccess.Tests/SiGma.BranchAccess.Tests.csproj --no-restore -m:1 --filter "FullyQualifiedName~ItemRequisitionItemRetiredEndpointTests" --disable-build-servers --logger "console;verbosity=quiet"
```

**النتيجة المسجلة سابقًا:** نجح ١١ اختبارًا، وصفر فشل أو تجاوز، برمز خروج 0. يشمل ذلك اختبارات الكتالوج العشرة واختبارًا واحدًا يجمع استدعاءات الخدمة. اكتمل بناء مشاريع الخادم المتأثرة ومشروع الاختبارات وقتها.

### حالة التحقق من البند الأب ١٦١

صُححت تهيئة مواصفات طلبات الأصناف بفصل تجهيز البيانات عن المستخدم الذي تُختبر صلاحياته. نجح بناء الخادم والواجهة وفحص تجميع المواصفات. تبقى أربع حالات حفظ تتطلب معاملات وأقفال SQL Server، ويظل تشغيل مواصفات البند الأب وقبوله السلوكي معلّقين. [سجل إصلاح البند ١٦١](AUTHORIZATION_161_SOURCE_REVIEW_20261113.md).

يسجل التحقق السابق للبند ١٦٢ أيضًا نجاح فحص TypeScript لتطبيق Angular وفحص فروق الملفات. وفي إعادة المراجعة تطابقت حزم الوصفات الثماني.

يُتابع تشغيل مواصفة الرابط وفحص التنقل الفعلي واستجابات HTTP في حالات القبول أدناه. ينتمي تحقق SQL Server إلى حفظ الطلب الأم واعتماد الصرف الناتج في البند ١٦١.


## إعادة المراجعة المصدرية — ١٣ نوفمبر ٢٠٢٦

| الحقل | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| نطاق المراجعة | الرابط القديم، حارس وجهة الطلب الأم، متحكم البنود وخدمته، كتالوج المنح ومواصفات التحقق |
| النتيجة | التحويل وإغلاق منافذ البنود مطابقان في المصدر. حُدّث التوثيق وتبقى تغطية التحقق من المسار الكامل معلّقة. |

### الملاحظات الحالية

1. **P3 — المواصفات تختبر أجزاء المسار منفصلة.** مواصفة Angular تستدعي حارس المطابقة مباشرة داخل موجه مسارات فارغ. وهي تتحقق من عنوان التحويل، ولا تمر بتسجيل الرابط الكسول وحارس الوجهة في مسار تنقل فعلي. مواصفة الخادم تختبر تصنيف الأفعال العشرة في الكتالوج واستجابات الخدمة باستدعاء مباشر. حالات الرفض عبر مرشّح التطبيق وتحويل نتيجة الخدمة إلى استجابة HTTP تظل خارج التغطية المنفّذة الموثقة. يُستكمل القبول بالتنقل من الرابط الجذري ومن امتداد قديم يحمل حالة، بحساب يملك عرض الطلب وبحساب يفتقده، وبفحص استجابة HTTP للعمليات المتقاعدة حسب طبقة الرفض. ملفا المواصفات موجودان في مساحة العمل ولم يدخلا تتبع Git حتى وقت المراجعة. [مواصفة Angular](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisitionItem/itemrequisitionitem.routes.spec.ts:8>) · [مواصفة الخادم](<F:/My Work/Sigma/SigmaBackend/tests/SiGma.BranchAccess.Tests/ItemRequisitionItemRetiredEndpointTests.cs:21>).
2. **P3 — تحديث التوثيق منجز.** فُصل سجل اختبارات البند ١٦٢ السابق عن نتائج إصلاح البند ١٦١ وعن التحقق التشغيلي المعلّق. وحدد السجل أن مواصفات الخدمة تغطي دوال واجهتها، وأن الدالة العامة الموروثة `GetManyDeletedAsync` خارج واجهة الخدمة ومتحكم HTTP. [واجهة الخدمة](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/IServices/Bases/IService.cs>) · [الدالة الموروثة](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:507>).

### حالات القبول المعلّقة للبند ١٦٢

| الحالة | النتيجة المتوقعة |
|---|---|
| فتح الرابط الجذري أو امتداد قديم يحمل معرّف بند أو حالة، بحساب عادي يملك عرض الطلب | الانتقال إلى قائمة طلبات الأصناف دون نقل حالة الرابط القديم |
| فتح الرابط بحساب عادي يفتقد عرض الطلب | حارس وجهة الطلب يمنع فتح القائمة |
| استدعاء منفذ قديم بحساب عادي صالح | رد 403 من مرشّح الصلاحيات |
| استدعاء منفذ قديم بطلب صالح من مدير يجتاز فحوص الممثل والفرع | رد 405 من الخدمة عبر المتحكم |

### ما ثبت بالمصدر

- رابط Angular يعيد إنشاء عنوان القائمة من الصفر دون نقل معرّف البند أو معاملات الاستعلام أو نية التحرير. تستأنف الوجهة فحص جلسة المستخدم وصلاحية عرض الطلب عبر حارس أبناء التخطيط وسجل المسارات. الرابط نفسه بلا محرر أو نداءات بيانات أو تخزين مؤقت. القراءة والتحميل والكتابة مملوكة لشاشة الطلب الأم حسب البند ١٦١. [التحويل](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemRequisitionItem/itemrequisitionitem.routes.ts:4>) · [حارس الوجهة](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/layout/layout.module.ts:215>) · [سياسة العرض](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/authorization/route-access-policy.ts:376>).
- كل أفعال المتحكم العشرة الموروثة خارج المنح القابلة للإسناد. المستخدم العادي المرتبط يُرفض في المرشّح حتى مع وجود منحة تاريخية. المدير الذي يجتاز المصادقة وفحوص الممثل والفرع ويصل بمدخلات صالحة إلى الخدمة يتلقى 405. تُرجع الخدمة ذلك قبل أي قراءة أو كتابة للبنود، وتبقى قراءة الطلب الأم وتعديل سطوره خاضعين لنطاق الفرع وملكية السطور. [المحلل](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs:90>) · [المرشّح](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionAuthorizationFilter.cs:91>) · [خدمة البنود](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/ItemRequisitionItemService.cs:20>).
- دليل المخزون يوضح الانتقال إلى الطلب الأم والعمل من جدول بنوده بالعربية والإنجليزية. الجرد يصنف الرابط `alias` دون مفاتيح مستقلة. لا يحتاج التحويل إلى استعلام أو فهرس أو هجرة. [دليل المخزون](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/stock-guide.ts:180>) · [الجرد](<F:/My Work/Sigma/reviews/Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json:4811>).

### نطاق الدليل والتحقق

مراجعة محدودة لرابط توافق ومنافذ متقاعدة وفق Master5 وUI26 وBE6 وحزمة
الربط. تمت مطابقة شرح سبيد للورشة S113 مع شاشة طلبات الأصناف المؤرخة
٢٨ أكتوبر ووحدتي C1706/C1707. يدير المرجع صفوفه داخل مستند الطلب.
لم تتبق فجوة وظيفية تحتاج مرجع أودو لهذا الرابط. تطابقت حزم الوصفات الثماني،
وفُحصت فروق الملفات ذات الصلة في مستودعي الواجهة والخادم، بما فيها المواصفات
غير المتتبعة. لم يظهر خطأ مسافات في النطاق. هذه مراجعة مصدرية نفذها وكيل واحد
لصغر النطاق. بقي البناء والاختبارات والمتصفح وHTTP الفعلي وقياس الأداء
خارج التحقق المنفذ في هذه المراجعة. لا تغييرات في كود التطبيق أو البيانات.

