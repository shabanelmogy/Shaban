# مطابقة صلاحيات شاشة المركبات

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٩ نوفمبر ٢٠٢٦ |
| النطاق | قائمة ومحرر المركبة وعرض details البديل وتعرفة النوع والحالة وتاريخ العقود ووثائق المركبة ومنتج الاستيراد الخلفي |
| العقد | [العقد المجمد](VEHICLE_ACCESS_CONTRACT_FREEZE.md) مع ملحقي الاستبدال والاستيراد |
| النتيجة | اكتملت صلاحيات الشاشة في المصدر؛ لا اكتمال لكل منتج الأسطول أو قبول تشغيل |

## المراجع والقرارات

تطبق المطابقة Master1/2/4/5/7، وUI2/7/14/18/22/26/27/28/29، وBE2/3/4/7/8/12/14.
شكل القائمة UI02، ومحرر الوثيقة ومالكو التعرفة الحاليون، دون تغيير تصميم أو
سياسة مالية. جرى فحص الحزم ثم تصحيح drift مشتق في Phase03 بالمولد؛ أُعيد
توليد الحزم الثماني بعد تحديث UI18/27 وأصبحت Check كلها OK. لم تُعدّل حزمة يدويًا.

قُرئت قبل التجميد شروح Speed الأصلية S038/S055/S091/S096 من لقطة٢٧أكتوبر،
ثم sidebar لقطة٢٨أكتوبر `08-fleet/screens/01-vehicles.md`، وشرائح المنح
والأفعال والطلبات من C1173 وشرائح المدخلات والمستندات والحفظ من C1163.
هذه أدلة وظائف الواجهة، ولا تثبت خادمًا أو محاسبة أو قواعد تفويض Sigma.
قُرئ مدخل Odoo بعد Speed؛ لا فجوة مفهومية لازمة لحسم هذه المنح المحلية.
لم تُقرأ جميع النوافذ المرجعية الـ٥٧، ولا تُدعى المساواة الكاملة مع المرجع.

| التفصيل المرجعي | المقابل الفعلي والنتيجة |
|---|---|
| قائمة/بحث/مرشحات/إخراج | matched للوظائف الحالية؛ Search يملك القائمة والطباعة وExcel، والاختيارات بمنح مصادرها |
| إضافة/تعديل/حذف ومستندات وضمانات | matched نطاق الصلاحيات الحالي؛ مراجعة تجميع صريحة وملكية الأطفال والمرفقات |
| نشاط المركبة | matched بمنحة Activate الفعلية إضافة إلى Update، مع إعادة الفحص داخل القفل |
| حالة وتاريخ عقود | matched قراءتان مستقلتان؛ الروابط المقابلة تحتاج صلاحية الوجهة |
| تعرفة المركبة | matched لمالكها الحالي: تعرفة نوع المركبة، لا نسخة خاصة بمركبة واحدة |
| حجز من صف المركبة | partial؛ التنقل يراجع registry، والوجهة غير المتبناة مغلقة للعادي حتى شريحتها |
| defleet/onfleet والمستثمر والأضرار وتفاصيل مالية/عداد خاصة | missing خارج الوظائف المنفذة؛ تحتاج شرائح منتج وعقودها، ولا تمنح أسماء أفعال وهمية |
| منح مستقلة للملكية/نوع الأسطول/التجديد | missing مقارنة بالمرجع؛ حقول Sigma الحالية تتبع Update، دون اختراع منح حقول أو قرار مالي |

جميع البيانات الحالية تجريبية وفق Master1. لم يُضف توافق لمسارات الوثائق
الثابتة القديمة أو نقل ملفات أو backfill؛ يجهز المالك بيانات ومرفقات نظيفة.
لم يُمسح أو يُعد تعيين أي سجل أو ملف في هذه الدفعة.

## العمليات والمسارات

| السطح الفعلي | الواجهة ↔ الخادم |
|---|---|
| `/FleetVehicle` والبحث والصفحات والفرز والطباعة/Excel | Vehicle.Search؛ ليس View أو Export مخترعًا |
| `view/:id` و`details/:id` | Vehicle.View؛ details alias عرض بنفس الهوية، ولا اختيارات تحرير |
| `create` | Vehicle.Create + Branch.Lookup + CarMake.Lookup + CarModel.View |
| `edit/:id` | View + Update مع مصادر التحرير المطلوبة نفسها |
| تغيير IsActive لموجود | Vehicle.Activate إضافة إلى Update؛ omission يحتفظ بالقيمة الأصلية. يعاد فحص current داخل القفل بعد فلتر الطلب |
| حذف صف | Search + Delete وعضوية كائن الصف الحالي والتسجيل على فرعه؛ قرار قابل للإلغاء وإعادة فحص قبل الإرسال |
| الحالة | Search + Vehicle.GetStatusDetail؛ حوار محلي قابل لإعادة المحاولة |
| تاريخ العقود | Search + Vehicle.GetAgreementHistory؛ لا يمنح فتح عقد مقابل |
| `tariff/:id` | Tariff.GetTariffByVehicleTypeId؛ id هو VehicleTypeId. الحفظ يحتاج Tariff.Update؛ القارئ لا يعدّل |
| إضافة ماركة/موديل من المحرر | منحة المحرر + Create/Lookup المناسبة؛ نجاح POST يُحفظ قبل GET التحديث، ولا يُعاد لفشل التحديث |
| رفع/قراءة/تنظيف الوثائق | Media.UploadMedia / ReadVehicleDocument / DeleteMedia، مع أدلة المركبة والفرع والرافع في الخادم |
| واجهات الأطفال العامة | CustomerDocument/Warranty تتبع shadow VehicleId الفعلي عند ملكية المركبة؛ لا bypass من endpoint طفل |
| المنتج الموازي | ImportData.ImportVehiclesDataAsync يتحقق داخل قفل chunk من الشركة والفرع والتكرار والصانع/الموديل/eTag وترابطهما؛ لا ترقية تلقائية لواجهة الاستيراد |

يحيل المسار والقائمة والبداية إلى `vehicle-access.ts` وRouteAccessPolicyRegistry.
الفحص الفعلي في PermissionEndpointResolver/PermissionAuthorizationFilter
وقواعد الفرع؛ إخفاء عنصر واجهة ليس حد الحماية. صنفت Search والحالة والتاريخ
وقراءة التعرفة والوثيقة WholeDocumentReads، فلا تتحول القراءة إلى اشتراط تسجيل.
Vehicle.BranchId بقي اختياريًا حسب العقد الحالي؛ العادي لا يقرأ/يكتب مركبة
بلا فرع. النقل يحتاج تسجيل الأصل والوجهة وتحويل المصدر ومنحة العملية.

## الحقول والمرشحات والتجميع

أعمدة القائمة والتقرير التفصيلي:
PlateNo، MakeName، ModelName، VehicleTypeName، Color، Status، BranchName،
KMs، Fuel، NextRegistrationDate، NextInsuranceDate، FleetNo، EngineCapacity،
CustomField1. يستهلك الموجز أول سبعة منها. يقابلها VehicleListVM بنفس
الخصائص، ومعها Id وBranchId nullable وVehicleTypeId وHasTariff كأقل هوية
وحالة إجراء. لا بيانات تدقيق أو كامل كيان في ListVM.

مرشحات اللوحة/رقم الأسطول/الشاسيه/ملف المرور/الفرع/مجموعة التعرفة/الصانع/
الموديل/النوع/السنة/نوع الأسطول/الملكية/الحالة/النشاط/تاريخ الشراء وgrid
تطابق VehicleSearchModel وVehicleSearchVM وFilters[grid]. تبقى فترة الشراء
فارغة افتراضيًا. يضبط الخادم PageNo/PageSize/Count/TotalPages، والإخراج
يستعمل نفس المرشح بلا ترقيم. تمسح المعرفات المحجوبة من raw/applied/URL،
ويعاد تنقيحها في handler قبل الطلب دون انتظار effect.

يستهلك عرض المحرر VehicleDetailVM؛ يحمل payload مدخلات المستخدم فقط مع
معرفات الأطفال اللازمة للتحديث. يظل فرع المصدر وIsActive الأصلي والأطفال
مملوكين للخادم. AutoMapper يتجاهل تجميع Documents/Warranties عند mapping
التحديث؛ تملك الخدمة المصالحة الصريحة. ليس هناك حساب مالي جديد أو تغيير
للإهلاك/الرسملة/توزيع الإيراد أو الدقة العددية في هذا النطاق.

## الملكية والتزامن والمرفقات

كل Add/Update/Remove/HandleActive للمركبة يأخذ قفل CustomerDocument ثم
Vehicle ضمن tenant وSerializable من المالك القائم، والاستيراد يلتزم
بالترتيب نفسه. يرفض raw bulk غير المحكوم للمركبة والطفلين. يتتبع التحديث
الطفل الحالي ويمنع unlink/reassign وdetached takeover، ويحفظ shadow VehicleId
كحقل concurrency قائم، دون عمود جديد. بقية الآباء المشتركة تبقى على عقدها.

فحوص التكرار tenant/live evidence دون فلاتر الفروع أو labels لسجل محجوب.
منع الحذف يمشي referencing FKs الخاصة بالمركبة وآبائها ويختبر Any tenant/live
دون فلاتر الفروع، مستثنيًا الطفلين المملوكين للحذف الناعم. لذلك لا يغيب
حادث أو حركة ورشة حية بسبب فرعها. الحذف الناعم للتجميع يمر
RemoveWithChildrenAsync؛ لا افتراض SQL cascade.

أحدث الوقود والحالة يثبت من هوية أحدث مصدر على مستوى الشركة، ثم يُقرأ
payload مسموح لذلك المصدر فقط؛ غياب صلاحية الأحدث لا يرجع لبيانات أقدم.
لا ينتج evidence أسماء أو تفاصيل فرع محجوب.

تحفظ VehicleDocuments الجديدة خارج wwwroot. أسماء uploader/GUID/ext يملكها
PrivateUploadPath؛ يُرفض static alias القديم. يشترط الحفظ وجود الرفع الصحيح
والرافع والشركة وعدم إعادة استعمال path حي، داخل قفل CustomerDocument نفسه
الذي يأخذه التنظيف. الاستبدال يحذف صف CustomerDocument القديم نرمًا وينشئ
صفًا جديدًا بكل metadata، مع بقاء path وVehicleId القديمين دليل تنظيف تاريخي.
المسار الخاص لا يقبل parent مشتركًا آخر.

قراءة المحفوظ تحتاج Vehicle.View واستعراض كل جذوره الحية، والمسودة لرافعها
مع Create/Update. تنظيف المسودة لرافعها دون اشتراط بقاء منحة الأعمال؛ تنظيف
المحفوظ المزال يحتاج عدم وجود رابط حي والتسجيل على كل جذوره التاريخية
وUpdate أو Delete. منحة DeleteMedia تخص حذف الملف الفعلي وليست شرطًا خفيًا
لكل تحديث لتجميع المركبة.

يتبنى FileLink المورد المغلق vehicle-document وblob مصادقًا وReadVehicleDocument؛
JPEG/PNG قابلان للمعاينة وPDF رابط دون img. MIME/no-store/nosniff من الخادم،
والإلغاء وإبطال object URL على path/resource/actor/access من المالك المشترك.
لا توكن في URL أو fallback ثابت.

يتبنى FileField شرط المحرر مستقلًا عن uploadPermission الخاص بكل صف.
يحتاج استبدال مرفق محفوظ Upload وCleanup؛ التفريغ يحتاج Cleanup دون Upload.
تُلغي خسارة أي شرط للاستبدال نشر نتيجة الرفع نهائيًا حتى بعد إعادة المنحة،
ويبقى الأصل كما هو والرفع الجديد pending لدى tracker للتنظيف. لا يعتمد
شرط النشر على busy الذي يسببه الرفع نفسه.

## عمر الوصول والتحميل والكاش

| المصدر الفعلي | التصنيف والمالك والحالة النهائية |
|---|---|
| Vehicle/Search والتفاصيل والحالة والتاريخ وTariff/GetTariffByVehicleTypeId | operational/direct؛ لا cache جديد |
| Branch/GetSelect | opted-in BranchService/BaseService/ReferenceLookupCacheService؛ bootstrap محدود ناجح ثم watch مستقل وRetry/refreshSelectList؛ إبطال الكتابات والإشعار/السياق عند المالك المشترك |
| CarModel/GetMakeAndModel | مباشر اختياري للقائمة بمنحته؛ لا opt-in مثبت |
| CarMake/GetSelect وCarModel/GetAllWithNavigations | مباشران مطلوبان للتحرير، وتحديث صريح بعد إنشاء الكتالوج |
| TariffGroup/GetSelect | مباشر اختياري للقائمة؛ خطأ وRetry منفصلان |
| VehicleType/GetSelect وCostCenterGroup/GetSelect | مباشران اختياريان؛ يحتفظ المحرر بالـFK والتسمية المختارة عند السحب ولا يمحو المسودة |
| Media private read/upload/cleanup | المالكون FileLink/FileField/DocumentUploadTracker/FileUploadService؛ لا قناة نقل أخرى |

القائمة والبحث والتفاصيل والتعرفة والإخراج وbootstrap المطلوب وكتابات
الحفظ والحذف تتبع مالك الصفحة start/finalize، مع busy/error/Retry دون spinner
منافس. status/history وGET تحديث الكتالوج يتبعان الحوار المحلي وStateMessage،
وتحديث Branch المحتفظ ببياناته صامت. المسار import الفعلي يصل للقائمة
والمحرر المذكورين؛ showPageLoading ومضيف shell من المالك المشترك. مصدر
التحميل مطابق؛ ظهوره وتوقيته وتداخل portals يحتاج قبول المالك على التطبيق.

تُلغى القراءات والتأكيدات وfocus والprint المؤجل ومنافذ select/date عند انتهاء
الوصول أو تبدل السياق. trigger البحث يبقى حيًا للاستعادة دون retry loop.
يبقى المحرر mounted ومسودته محجوبة؛ يمنع route reuse غير المقبول bootstrap
فوق مسودة أو كتابة/رفع مرسل. لا تقطع denied$/teardown كتابة مرسلة مستقلة.
تسجل الكتابة نجاحها قبل سياج النشر، ويُضبط CAN_PRESENT_API_OUTCOME للحفظ
والحذف والكتالوج والرفع. لا خطأ قديم أو refresh لحساب بديل.

قرار المغادرة lazy وقابل للإلغاء، وlocal discard جديد بعد الرفض متاح.
قرار إزالة صف التعرفة يدخل busy وحارس المغادرة والحفظ، وتجمد EditableRows
الأب خلال التأكيد. حارس القائمة يحمي قرار الحذف والكتابة فقط، وtombstone
يسجل نجاح الحذف للحساب الثابت قبل النشر فلا يعاد DELETE بعد regrant.
فشل تنظيف المرفق يعاد وحده دون PUT جديد. لا cleanup تلقائي عند اختلاف
actor أو working/branch-access context: قد يكون حفظ قديم قد ربط الملف.
هذا حد أمان موثق، وليس حفظ توافق للبيانات القديمة. tracker ضمن عمر المحرر؛
لا sweeper دائم أو تعافٍ من إغلاق العملية مُدّعى.

## الأداء والمخطط

أُزيل طلب المصادر غير الممنوحة وفصلت إعادة محاولة كل مصدر؛ لم يُضف طلب لكل
صف. تجميع وقود البحث يقرأ قائمة هويات المرشحين ثم ثلاثة مصادر evidence
دفعية، وقد يزداد حجمها في unpaged/grid fuel. لا أزمنة أو SQL plans مقاسة.
يلزم مقارنة نفس البيانات/المرشح/الحساب والحجم قبل/بعد، مع cold/warm cache،
وعدد الطلبات وTTFB وSQL IO/plan والترجمة وحدود parameter/list؛ لا ادعاء
تحسن سرعة من الفحص المصدري.

لا عمود أو nullability أو FK أو EF index جديد في شريحة المركبات؛ shadow
VehicleId موجود أصلًا، وmetadata concurrency لا يضيف عمودًا. لا هجرة لازمة
لتوصيل هذه الشريحة وحدها. اقتراح لاحق عند المالك، بعد فحص أطوال السلاسل
والتكرارات والتغطية الفعلية في deployed indexes: فريد tenant/live على
(SubscriptionId,PlateNo) و(SubscriptionId,FleetNo) و(SubscriptionId,ChassisNo)،
بشرط live الذي يطابق IsDeleted!=true. فائدته حسم التكرار في جميع المنتجين؛
كلفته التخزين وكلفة الكتابة وعرض مفتاح النص، ويجب حسم تداخل الفهرس الحالي
وترتيب أعمدة TPT قبل تقرير مخطط. لا INCLUDE مقترح لفحص Any الضيق.
الاسم الاقتراحي عند اعتماد المخطط: `EnforceVehicleTenantIdentityUniqueness`؛
لا migration أو snapshot أو DB نُفذ.

## التحقق والتسليم

أُعيد تحليل TS/HTML ووجود imports محلية: **٤٦ ملفًا/قالبًا، problems:[]**.
هذا parsing فقط، وليس type checking أو build. قرئت الملفات الجديدة مباشرة
لأن بعض الملاك والمفاتيح والمواصفات untracked. روجعت namespaces وproject
references وSDK source inclusion ونموذج الصف/المسار/المنح وروابط الدليل.
فحص الفروق المحدد لكل مستودع وفحص whitespace مذكوران في checkpoint المحدث.

راجع عاملان مستقلان الواجهة والخلفية بملكية قراءة فقط. أُغلقت findings:
التبعية المخفية عند الحذف، بيانات الاستيراد المطلوبة، race IsActive، انتظار
تأكيد صف التعرفة، fixture entity، واستبدال المرفق بعد سحب Cleanup وتفريغه
بلا Upload. أعاد تدقيق المتابعة قراءة الإصلاحات ولم يجد finding مؤكدة متبقية.
المواصفات المكتوبة للقائمة/المحرر/التعرفة/Media/path/shared والخلفية **غير
منفذة**؛ لا RED/GREEN أو نتيجة تشغيل مدعاة.

تحديث الدليل: `src/app/modules/UserGuide/content/fleet-guide.ts`، موضوع
المركبات تحت `/UserGuide/fleet` ومدخل دليل الأسطول القائم في sidebar.
يشمل منح الأفعال والفرع والنشاط والتعرفة المشتركة والمرفقات والمسودة
والاستعادة بالعربية والإنجليزية. لا قارئ أو قائمة جديدة.

قبول المالك المجمع في نهاية الهدف:

١. حساب Search فقط مقابل View فقط، وروابط view/edit/details/tariff المباشرة.
٢. مدير ومستخدم بفروع عرض/تسجيل/تحويل، وفرع محجوب وVehicle بلا فرع.
٣. سحب/استعادة المنحة أو تبديل الحساب خلال read/decision/save/delete/upload/print.
٤. إنشاء/تعديل الماركة والموديل وفشل GET بعد POST دون POST جديد.
٥. مرفق JPG/PNG/PDF، وstatic alias مرفوض، ومستخدم آخر/شركة أخرى/path حي.
٦. استبدال/تفريغ بلا Upload، وسحب Cleanup أثناء الرفع، وفشل التنظيف ثم Retry.
٧. hidden dependency وduplicate/attach/delete/import/IsActive concurrent، وفحص SQL/locking/reflection.
٨. البناء والمواصفات ثم RTL/light/dark/mobile وظهور loader والـportals.

رسائل commit مقترحة فقط بحسب الملفات المملوكة في هذه المطابقة:

- الواجهة: `fix(vehicles): enforce operation and attachment access lifetimes`
- الخلفية: `fix(vehicles): guard aggregate ownership and private documents`
- الوثائق: `docs(authorization): reconcile vehicle access and upload rules`

لم تُنفذ builds/tests/lint/browser/DB/migrations/snapshots/commit/push/deploy،
ولم يُستخدم Sigma MCP أو Graphify أو مسح للحل كاملًا. هدف الصلاحيات العام
مستمر؛ تُرقى FleetVehicle وحدها إلى operation-confirmed، دون وجهة الحجوزات
أو الاستيراد الأمامي أو فجوات المنتج المرجعية.
