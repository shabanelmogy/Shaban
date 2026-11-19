# تسليم صلاحيات محرر إعدادات تكلفة التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | محرر إعداد تكلفة التأجير فقط: Create/View/Edit والبنود والاختيارات وقرار الخروج |
| العقد | LEASE_COST_SETTING_ACCESS_CONTRACT_FREEZE.md |
| مسؤولية التكامل | الجذر؛ لا يثبت هذا التسليم اكتمال وحدة LeaseCostSetting أو هدف الصلاحيات كاملًا |

## الملفات والملكية

عُدلت الملفات:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCostSetting/components/details/details.component.ts`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCostSetting/components/details/details.component.html`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCostSetting/components/details/details.component.spec.ts`

وأضيفت المواصفة المصدرية:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCostSetting/components/details/details-access.spec.ts`

لم تُعدّل الخدمة أو helper الصلاحيات أو القائمة أو المسارات أو النماذج أو
الخلفية أو الدليل أو ملفات الترجمة أو أي مالك مشترك. حُفظت تغييرات الجذر
والعامل الموازي خارج `components/details`.

## المطابقة المصدرية

| الجانب | النتيجة في المصدر |
|---|---|
| العرض | يتطلب `LeaseCostSetting.View` فقط، ويقرأ التفاصيل دون أي lookup تحرير |
| الإنشاء | يتطلب `LeaseCostSetting.Create` و`CarModel.GetMakeAndModelDropdown` و`LeaseCostParameter.Lookup`؛ لا يضيف View |
| التعديل | يتطلب View وUpdate ومصدري الإنشاء؛ Edit من View يعيد تسليح watcher بمتطلب Edit الكامل |
| البنود | Add/Remove/edit تعتمد `canMutate` نفسها ومتطلب كتابة الأب؛ لا منحة طفل مستقلة |
| الاختيارات | CarModel وLeaseCostParameter قراءتان مباشرتان finite؛ لا `ReferenceLookupBindings` أو cache/watch جديد |
| labels الحالية | يحفظ السحب والإعادة لنفس الممثل اختيار الموديل وكل معاملات التكلفة الحالية، ثم يدمجها عند bootstrap فارغ دون تغيير IDs أو payload |
| هوية التفاصيل | القراءة مقيدة بالممثل والجلسة والمعرّف والـsequence؛ ترفض `entity.id` المخالف قبل ترطيب النموذج |
| عمر المسودة | تبديل actor أو استبدال `mode/settingId` ينهي الجلسة ويخفيها ويعطلها دون مسح المسودة أو ترطيب سجل آخر |
| الاستعادة | سحب منح الجلسة نفسها يلغي القراءات ويحتفظ بالمسودة؛ الإعادة تستأنف بعد busy/finalize ولا تعيد فشل HTTP تلقائيًا |
| الحفظ المرسل | Create/Update تستخدم `trackWrite` و`HttpContext` و`CAN_PRESENT_API_OUTCOME`؛ success latch يسبق النشر، ولا replay بعد السحب أو الخروج |
| الخروج | `canDeactivate(): boolean | Observable<boolean>` عام ويخدم Close ووالد القائمة؛ View يلغي القراءة، وبعد dispatch يسمح بالخروج مع بقاء الكتابة مستقلة |
| discard | القرار lazy وقابل للإلغاء؛ discard محلي جديد متاح بعد denial، والقبول terminal فيحجب Save/Add/Remove حتى الإغلاق |
| MockData | يستهلك `mockDataAccessRequirement=requirement` الفعلي؛ المالك المشترك يلغي generation/preview المنتهي الصلاحية |
| الغلاف | `EditorDialog` يستهلك `accessRequirement/accessBlocked`؛ المسودة المركبة hidden/inert، والـsubtitle فارغ عند تبدل الممثل |
| portals/focus | تغلق PrimeNG Select portals عند انتهاء الجلسة، ويُلغى `focusField` بالجلسة والمنحة والتدمير مع actor/key guards |
| العقود العددية | بقيت السنوات أعدادًا صحيحة، وبقيت حدود markup/vehicleCost/rate والتحقق من النطاقات كما كانت دون تغيير تجاري |

## مصادر البيانات والتحميل

| المصدر | التصنيف والعمر |
|---|---|
| `LeaseCostSetting/GetByWithNavigationsId` | قراءة dialog تشغيلية مباشرة؛ قابلة للإلغاء وتتحقق من معرّف الكيان قبل النشر |
| `CarModel/GetMakeAndModel` | lookup تحرير مباشر finite مطلوب؛ لا cache opt-in مثبت |
| `LeaseCostParameter/GetSelect` | lookup تحرير مباشر finite مطلوب و`cacheSelect=false`؛ لا watch أو invalidation محلي |
| POST/PUT للأب | كتابة مستقلة عن denied/destroy، وسياق النشر محروس بالممثل والسجل والوضع والجلسة |

القراءات المباشرة تستخدم loading/error/Retry المحلي الموجود، وتمنع التحرير حتى
نجاح المصدرين. لا طلب لكل صف ولا مصدر مالي أو حسابي جديد. لا يدعي wiring
المصدري قياس زمن الشبكة أو SQL أو ظهور loader/portal فعليًا؛ يظل ذلك قبولًا
تشغيليًا عند المالك.

## المواصفات والفحوص

أضيفت **١٥ مواصفة وصول مصدرية غير منفذة** تغطي View/Create grants، والممثل
والسجل المركب، وإلغاء واستعادة detail، وحفظ labels الحالية، والكتابة المرسلة
وسياق النشر ومنع replay، والخروج بعد dispatch، وterminal discard، والقرار
الملغى عند denial، وإلغاء View، ورفض detail ID المخالف، والمعرّف المشوه،
ومتطلب MockData/Edit الكامل.

استُبدلت smoke spec القديمة بمواصفة تكامل قالبية غير منفذة تستخدم القالب
الحقيقي وتثبت أن `EditorDialog` يستقبل `accessBlocked=true` وsubtitle فارغًا
عند الممثل البديل مع بقاء قيمة المسودة. كُتبت المواصفات قبل تنفيذ الإنتاج،
لكن حدود المشروع منعت تشغيلها؛ لذلك لا يُدعى RED/GREEN.

فُحص TypeScript parsing للمكون والمواصفتين، وAngular template parsing، وحل
imports المحلية، و`git diff --check` وscoped diff لمجلد المحرر. لا مفاتيح
ترجمة جديدة أو مفقودة نتجت عن هذه الشريحة.

هذه الفحوص ليست build أو type checking أو نتائج tests. لم تُنفذ builds/tests/
typecheck/lint/browser/DB/migrations/snapshots/commit/push أو نشر، ولم يُستخدم
وكلاء فرعيون.

## المتبقي عند الجذر والمالك

يتولى الجذر دمج helper والخدمة والـregistry والخلفية والـDTOs والدليل والترجمات
والجرد، ويتولى العامل الآخر القائمة والمسارات. يلزم التدقيق المستقل للمحرر ثم
مصالحة التكامل النهائي. قبول المالك التشغيلي مطلوب للمنح، وCreate-only، وrapid
revoke/regrant، والكتابة المرسلة، والخروج الملغى، وMockData، والـportals،
والـRTL والثيمين والمقاسات. يلزم تشغيل البناء والاختبارات والتحقق النوعي فقط
عند تفويض المالك؛ المصدر الحالي لا يثبت نجاحها.

رسالة commit مقترحة عند دمج الواجهة بواسطة المالك:

`fix(lease): enforce cost setting editor access lifetimes`
