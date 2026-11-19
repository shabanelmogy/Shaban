# مراجعة SiGma.Repos.csproj — قراءة فقط

| البند | القيمة |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| تاريخ المراجعة | 2026-10-02 — Africa/Cairo |
| النطاق | ملف المشروع وإعداداته ومراجع الاعتماد المباشرة |
| التنفيذ | غير مطلوب؛ لم يُعدّل أي كود أو إعداد أو وثيقة قواعد |
| نوع الأدلة | قراءة المصدر، XML، Git، ملفات restore الموجودة، ووثائق Microsoft الرسمية |

إغلاق التقرير يعني انتهاء المراجعة المطلوبة، وليس تنفيذ التوصيات أو إثبات نجاح build/runtime.

## 1. الخلاصة

ملف المشروع صغير وواضح، وXML صالح للقراءة. لم يظهر تعارض بين `net10.0`
وإصدارات EF المشار إليها أو مرجع Helpers. الملاحظة الأهم هي تعطيل وسائل
اكتشاف الأخطاء: إخفاء تحذيرات حساسة على مستوى المشروع، بالتزامن مع تعطيل
تحليل المصدر أثناء البناء وأثناء الكتابة في المحرر.

وجدت **أربع ملاحظات**: واحدة بأولوية عالية لتحسين اكتشاف الأخطاء، اثنتان
متوسطتان، وواحدة بسيطة. لا توجد في هذه المراجعة نتيجة تثبت عطل compilation
حاليًا أو ثغرة أمنية في الحزم. لم أشغّل build أو restore أو فحص ثغرات جديدًا.

## 2. ما تم فحصه

- [SiGma.Repos.csproj](</F:/My Work/Sigma/SigmaBackend/SiGma.Repos/SiGma.Repos.csproj>) بالكامل: 23 سطرًا، ثلاث حزم مباشرة ومرجع مشروع واحد.
- `Repository/Repository.cs` و`UnitOfWork/UnitOfWork.cs` وواجهتاهما لتحديد الاستخدام الفعلي للمراجع. هذه قراءة سياقية للاعتمادات، وليست مراجعة شاملة لكل سلوك الاستعلام والحفظ داخل الكلاسات.
- `SiGma.Helpers/SiGma.Helpers.csproj`، والمراجع المباشرة إلى Repos في ملفات مشاريع Business وSubscriptionAPI، وإعدادات EF في DataAccess.
- ملف الحل للتأكد من وجود المشروع، وملفات السياسات المحتملة في نطاق المشروع وأسلافه: `Directory.Build.props/targets`، `Directory.Packages.props` و`global.json`.
- `SiGma.Repos/obj/project.assets.json` وملف `nuget.dgspec.json` الموجودان؛ لم يتم تجديدهما.
- حالة Git والـ diff وwhitespace لنطاق `SiGma.Repos` فقط.

التصنيف: مراجعة إعدادات مكتبة البنية التحتية المشتركة، وليست شاشة CRUD أو
تقريرًا أو aggregate جديدًا. المرجعية: Master blocks 1/5/7 وBackend preamble/block 5.
فحص recipe drift كشف أن الحزم الثماني المولدة قديمة؛ المرجع هنا الكتب الأصلية.
تجديد الحزم ومراجعتها الدلالية إجراء لاحق للمالك، ولم تُعدّل في هذه المهمة.

## 3. الملاحظات حسب الأولوية

### R1 — إخفاء تحذيرات null وasync على مستوى المشروع — أولوية عالية

**الموضع:** [SiGma.Repos.csproj:10](</F:/My Work/Sigma/SigmaBackend/SiGma.Repos/SiGma.Repos.csproj:10>)، مع تفعيل Nullable في السطر 6.

`NoWarn` يخفي التحذيرات التالية عن كل ملفات المشروع:

| التحذير | نوع المشكلة التي قد تختفي |
|---|---|
| CS8618 | عضو non-nullable لا تتم تهيئته |
| CS8602 | الوصول إلى عضو من مرجع قد يكون null |
| CS8603 | إرجاع قيمة قد تكون null من عقد لا يسمح بذلك |
| CS8629 | قراءة Value من Nullable قد لا يحمل قيمة |
| CS4014 | استدعاء async دون انتظار انتهاء العملية |

**الأثر:** المطور قد لا يرى تنبيهًا مبكرًا لمشكلة تسبب استثناء عند التشغيل أو
تنفيذ خطوات بترتيب غير مقصود. هذا مهم في طبقة EF والحفظ المشتركة. وجود
`Nullable=enable` يظل مفيدًا، لكن إخفاء هذه التحذيرات يقلل فائدته؛ لا يعني
أن كل تحليل nullability متوقف.

**حد الإثبات:** الملاحظة المؤكدة هي سياسة الإخفاء. لم أعد تشغيل compiler
لإحصاء المخالفات، ولا أزعم وجود استدعاء غير منتظر بعينه اعتمادًا على هذا السطر.
كذلك هذه السياسة لا تخفي أخطاء compiler، ولا تفسر وحدها خطأ HTTP سابقًا.

**التوصية الأبسط:** إظهار هذه التحذيرات، خصوصًا CS4014 وتحذيرات null المذكورة،
ومعالجة الملاحظات الفعلية. إذا كان هناك false positive مبرر في موضع محدد،
يكون استثناء محليًا موثقًا. تحويل كل التحذيرات إلى errors فورًا ليس مطلوبًا.
Microsoft توصي بفهم خطر الإخفاء وتفضيل الاستثناء الموجّه عند الحاجة.
[مرجع NoWarn](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-options/errors-warnings#nowarn)،
[مرجع CS4014](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-messages/async-await-errors).

### R2 — تعطيل analyzers في البناء والمحرر بلا شرط — أولوية متوسطة

**الموضع:** [SiGma.Repos.csproj:8](</F:/My Work/Sigma/SigmaBackend/SiGma.Repos/SiGma.Repos.csproj:8>) والسطر 9.

`RunAnalyzersDuringBuild=false` و`RunAnalyzersDuringLiveAnalysis=false` غير
مقيدين بـ Debug/Release أو شرط محلي. ملف restore الموجود يحتوي حزمة
`Microsoft.EntityFrameworkCore.Analyzers/10.0.9` وملف analyzer الخاص بها، لكن
إعداد المشروع يوقف التنفيذ المعتاد للتحليل في هذين المسارين.

**الأثر:** فقدان تنبيهات تحليل المصدر، حتى عند بناء Release وفق هذا الملف.
هذه ملاحظة مستقلة عن R1: compiler warnings وanalyzer diagnostics وسيلتان
مختلفتان، وإصلاح إحداهما وحدها لا يعيد الأخرى. لا أستنتج من هذه الخصائص
تعطيل compilation أو جميع source generators.

**التوصية الأبسط:** إعادة تحليل البناء على الأقل. إذا كان سبب تعطيل التحليل
المباشر بطء المحرر، يمكن الإبقاء على ذلك كاختيار مؤقت واضح، مع تنفيذ التحليل
في مسار البناء. لم أقس الأداء، لذلك لا أدعي أن التحليل لن يؤثر على زمن البناء.
إعدادات command line أو IDE قد تتجاوز الملف؛ لم أقيّم build فعليًا.
[وثائق Microsoft لتحليل المصدر](https://learn.microsoft.com/en-us/visualstudio/code-quality/disable-code-analysis?view=vs-2022).

### R3 — مرجع HTTP يستخدم عقد NuGet أقدم مع مكتبة net10.0 — أولوية متوسطة

**الموضع:** [SiGma.Repos.csproj:14](</F:/My Work/Sigma/SigmaBackend/SiGma.Repos/SiGma.Repos.csproj:14>).

المشروع يشير إلى `Microsoft.AspNetCore.Http.Abstractions 2.3.11`. الاستخدام
حقيقي: `IHttpContextAccessor` في Repository وUnitOfWork، و`StatusCodes` في
UnitOfWork. إذن حذف الاعتماد دون بديل سيزيل أنواعًا مطلوبة.

ملف restore الموجود يثبت استخدام assembly من `lib/netstandard2.0` لهذه
الحزمة، ومعه `Microsoft.AspNetCore.Http.Features/2.3.10`. للمكتبات الحديثة
التي تستخدم ASP.NET Core APIs، المسار الذي تشرحه Microsoft هو
`FrameworkReference` إلى `Microsoft.AspNetCore.App` مع `Microsoft.NET.Sdk`.
[المرجع الرسمي للمكتبات](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/target-aspnetcore?view=aspnetcore-10.0).

**الأثر:** استمرار الاعتماد على عقد HTTP قديم رغم أن المشروع يستهدف net10.0،
ووجود مسار إضافي للحزم يجب تنسيقه مع shared framework في التطبيقات المستهلكة.
هذه فرصة لتوحيد الاعتماد، وليست دليلًا على أن التطبيق يتعطل الآن. رقم 2.3
وحده لا يثبت أن إصدار الحزمة مهجور أو مصاب بثغرة.

**قيد مهم:** Helpers يشير إلى الحزمة نفسها في
`SiGma.Helpers.csproj:14`. تغيير Repos وحده لا يزيل المسار الانتقالي القادم
من Helpers. لذلك أي اعتماد للخيار الحديث يجب أن يكون منسقًا مع هذا المرجع،
ثم التحقق من التطبيقات المستهلكة. FrameworkReference يجعل استخدام المكتبة
مرتبطًا بالـ ASP.NET Core shared framework؛ هذا أثر نشر يجب مراجعته إذا
كان هناك مستهلك مستقل عن تطبيقات الويب.

**التوصية:** اعتماد المرجع الحديث في مراجعة منسقة، بعد التأكد من المستهلكين،
ولا حاجة لإزالة `IHttpContextAccessor` أو بناء abstraction جديدة في هذه الخطوة.
لم يتم تغيير أي مرجع.

### R4 — CS8669 مكرر في NoWarn — أولوية منخفضة

**الموضع:** [SiGma.Repos.csproj:10](</F:/My Work/Sigma/SigmaBackend/SiGma.Repos/SiGma.Repos.csproj:10>).

CS8669 مكتوب مرتين. لا يضيف التكرار سلوكًا مختلفًا، ولا يسبب عطلًا؛ هو ضوضاء
في سياسة التحذيرات. الأفضل حذف التكرار عند تعديل هذه السياسة مستقبلًا.
مراجعة الحاجة إلى بقية الاستثناءات أفضل من نسخ القائمة إلى مشروع جديد.

## 4. نقاط سليمة ينبغي الحفاظ عليها

| العنصر | الحكم والدليل |
|---|---|
| `Microsoft.NET.Sdk` | مناسب لمكتبة؛ لا حاجة لتحويل المشروع إلى Web SDK لمجرد استخدام HTTP APIs |
| `net10.0` | متسق مع Helpers والمشاريع المستهلكة التي تم فحص metadata الخاصة بها؛ ملفات restore الموجودة تستهدف net10.0 |
| `ImplicitUsings=enable` | لا توجد مشكلة ظاهرة تستدعي تعطيله |
| `Nullable=enable` | إعداد جيد؛ الملاحظة على التحذيرات المخفية وليست على تفعيله |
| EF Core وRelational بإصدار `10.0.9` | متطابقان في الملف وفي resolved assets، ومتوافقان في الإصدار مع EF في DataAccess |
| مرجع EF Core مباشر | مطلوب لـ DbContext وLINQ/EF وtracking في المصدر |
| مرجع Relational مباشر | مطلوب لـ BeginTransactionAsync مع IsolationLevel وGetDbConnection وGetDbTransaction في UnitOfWork:70–74؛ ليس حزمة زائدة |
| مرجع Helpers | مطلوب لـ EntityBase وDropdownDto وResult وICodeCreateService والرسائل المشتركة |
| عدم الإشارة إلى Business أو ServerAPI | اتجاه اعتماد سليم؛ لم يظهر cycle في المراجع المباشرة المفحوصة |
| عدم إضافة SqlServer مباشرة إلى Repos | ليس نقصًا بحد ذاته؛ المشروع يستعمل EF relational APIs، وDataAccess يحمل provider؛ وجود sp_getapplock يجعل هذه العملية بعينها خاصة بـ SQL Server |
| الاحتفاظ بـ `$(NoWarn)` | يحافظ على القيم الموروثة؛ المشكلة في محتوى الاستثناءات الإضافية |

لا أوصي بحذف EF Relational، أو إضافة EF Tools/Design للمكتبة، أو إنشاء
نظام مركزي جديد لإدارة ثلاث حزم فقط بغرض تبسيط هذا الملف.

## 5. حدود الأدلة ومخاطر غير مثبتة

- ملف assets الموجود آخر تعديل له `2026-10-01 17:09:55 UTC`، بعد ملف المشروع بثماني ثوانٍ. resolved graph يحتوي 22 مكتبة/مرجعًا؛ هذا عدد وصفي وليس دليل تضخم.
- stored restore لا يحتوي قسم `logs`. إعداداته المسجلة تفعّل NuGet audit، بالمستوى low ولجميع الحزم. ذلك لا يثبت خلو الحزم من الثغرات اليوم؛ لم يُشغّل audit أو restore جديد.
- لم أجد `global.json` أو Directory.Build/Packages policy في نطاق المشروع وأسلافه المفحوصة. يمكن أن يفيد تثبيت SDK في بيئة الفريق، لكن لا يوجد دليل أن اختلاف SDK يسبب مشكلة حاليًا، لذلك ليس finding مستقلًا.
- لم أفحص CI configuration أو إعدادات IDE الخارجية أو جميع المشاريع من ناحية الكود، ولم أقيم MSBuild باستخدام build.
- لم تُراجع business rules أو عزل المستأجر أو deep loading كموضوعات مستقلة؛ قراءة الكلاسات هنا لإثبات احتياج الحزم. هذا التقرير لا يمنح هذه المسارات اعتمادًا وظيفيًا شاملًا.

## 6. ترتيب العمل المقترح عند اعتماد الإصلاح لاحقًا

1. إظهار التحذيرات الحساسة، ومعالجة ما يحدده compiler فعليًا؛ بدءًا من async وnullability.
2. إعادة analyzers أثناء البناء، ومراجعة أي تكلفة أداء بدل تعطيل المسارين بلا شرط.
3. توحيد HTTP reference بالتنسيق مع Helpers والمستهلكين، ثم التحقق من النشر والتشغيل.
4. إزالة CS8669 المكرر ضمن تنظيف سياسة NoWarn.

هذه توصيات فقط؛ لم يُعتمد أو يُنفذ تغيير في هذه المهمة. لا حاجة لmigration.
لا توجد تغييرات API أو DTO أو schema أو AutoMapper أو حسابات مالية.

## 7. تسليم المراجعة والتحقق

- مراحل discovery/context/reconciliation مطبقة كمراجعة مصدر فقط؛ مراحل تعديل الشاشة/domain/actions غير منطبقة.
- Git root: `F:/My Work/Sigma/SigmaBackend`. الحالة والـ diff لنطاق Repos كانا نظيفين أثناء المراجعة، و`git diff --check -- SiGma.Repos` لم يسجل مشكلة whitespace.
- SHA256 لملف csproj: `6BC90ECB8E9D42CDEB38876AF29B7A552BFA1131C828F4EEBDBA0078962EBEF6`.
- الملف الوحيد الذي أُنشئ في هذه المهمة هو هذا التقرير. لم يُعدّل المصدر أو الإعدادات أو skill أو الكتب؛ طلب القراءة فقط يعلو على بروتوكول تحديث القواعد.
- لا subagents: نطاق إعدادات واحد ومراجع متداخلة؛ تكلفة تقسيمه أعلى من الفائدة المتوقعة.
- لم تُشغّل build أو tests أو lint أو restore أو DB/SQL أو migrations أو التطبيق أو browser automation أو commits/push/deploy. فحص recipe `-Check` كان قراءة فقط.
- تحقق المالك لاحقًا عند اعتماد الإصلاح: restore/build مع diagnostics، مراجعة null/async/analyzer warnings، مقارنة resolved dependencies، ثم تشغيل التطبيقات المستهلكة وتجربة الحفظ والـ transactions. لم تُنفّذ هذه الخطوات هنا.
- لا commit مصدر مقترح الآن؛ لا تغييرات مصدر. إذا اختار المالك أرشفة التقرير لاحقًا، رسالة مقترحة: `docs(repos): record read-only project configuration review`.

