# مطابقة صلاحيات إعدادات تكلفة التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | LEASE_COST_SETTING_ACCESS_CONTRACT_FREEZE.md — Frozen |
| الحدود | Source-only؛ لا build/tests/typecheck/lint/browser/DB/migration/snapshot/commit/push/deploy |

## المصدر الخلفي والتكامل

تعريف tenant-shared بلا BranchId أو قيد مالي، كما العقد السابق. تستهلك
الواجهة leaseCostSettingAccess بentry =View أوCreate مع مصدري CarModel
custom lookup وLeaseCostParameter.Lookup. registry يملك menu/route وfirst
allowed route؛ لا create/details alias حية. الخدمة تحمل optional HttpContext
لثلاث writes مع نفس URL/body/inline error headers ومالك toast الحالي.

الأعمدة MakeAndModelName وMarkUpPercent تقابل ListVM نفسها مع Id للهوية.
DetailVM الأب والطفل أصبحا LeanDetailBaseVm؛ لا audit/tenant/GUID/hidden
activation افتراضية، وبقيت كل قيم التفاصيل المعروضة وIds. controller/
service generic constraints هي class للتفاصيل، والمراجع/SDK inclusion
الحالية تحمل النوع نفسه؛ لا تغيير project أو Mapper. الإسقاط الدقيق
والـtenant/live وفحص أطفال parent والـFKs والتحقق/التزامن المعتمد باقية.

أُغلقت activation الموروثة غير المملوكة في الأب والطفل ب405. رفض child
Add/Update/Delete السابق صار405 صريحًا، وresolver يمنع assignability
للكتابات الأربع المستقلة؛ stale grants لا تعيد فتحها للمستخدم العادي،
والمدير يصل للخدمة الرافضة نفسها. بقيت child reads القائمة، وكتابات
الأطفال تُدار من parent validated aggregate. لا schema أو AutoMapper/
financial calculation جديدة، ولا حفظ بيانات تجريبية/backfill مختلق.

مواصفات root غير المنفذة:١٢حالة endpoint/catalog/DTO، وخمس حالات خدمة
لقراءة tenant/live وchildren ورفض activation/standalone writes؛ ومواصفة
HTTP لسياق writes وحالة registry للاستقلال والـlookups والروابط المغلقة.
انتهى التدقيق المستقل للخلفية والقائمة/المسار بعد إقفال finding الحذف أدناه،
ثم سلّم المحرر وأُكمل تدقيقه المستقل بلا findings مؤكدة متبقية.

كشف التدقيق أن Include أطفال كاملًا قبل Repository.Delete(parent) قد
يُدخل طفلًا foreign-tenant أو محذوفًا إلى tracked graph، وعلاقة shadow FK
الاختيارية قد تفصله عبر relationship fixup. أُصلح Remove فقط بـfiltered
Include على SubscriptionId الموثق من Repository والأطفال live. لا تُحمّل
بيانات الشركة الأخرى إلى graph الحذف أصلًا؛ لا backfill أو تعديل shared
أو قواعد cascade. المواصفة الخامسة تتحقق بسياق مستقل من حذف الأب وطفله
الحي مع audit، وبقاء tenant/audit/flags/LeaseCostSettingId للأجنبي والمحذوف
كما هي. أعيد التدقيق بلا finding متبقية؛ المصدر لا يثبت تنفيذ المواصفة.

## مصادر البيانات والتحميل والأداء

| المصدر | التصنيف والعمر | حالة التحقق |
|---|---|---|
| LeaseCostSetting GET | operational مباشر، grid/paging/count، page owner | سلّمت القائمة١٨مواصفة مصدرية وانتهى تدقيقها بلا finding مؤكدة |
| Detail navigation GET | fresh operational، dialog local owner، id/actor/permission fence | مكتمل؛ لا lookup في View، ورفض entity.id المخالف قبل patch؛ expiry يلغي ولا يرطب مسودة actor أو سجل آخر |
| CarModel/GetMakeAndModel | direct custom projection بلا opt-in، required write lookup | مكتمل؛ finite forkJoin وreadiness/error/Retry؛ labels الحالية محفوظة بعد same-actor revoke/regrant |
| LeaseCostParameter/GetSelect | direct؛ خدمة المصدر cacheSelect=false، required write lookup | مكتمل؛ لا كاش أو invalidation/watch بيانات جديد؛ watch الوصول المحلي يبقى مستقلًا بعد completion |
| POST/PUT/DELETE | مستقل sent-write، context outcome/terminal latch، page owner | مكتمل؛ grants وهوية الممثل والسجل وcontext callback للنشر، والنجاح terminal قبل mayPublish، فلا replay أو refresh قديم |

القائمة Count ثم page، order ثابت Id وclamp<=200، بلا per-row enrichment
أو query لكل بند. التفاصيل projection واحدة للرأس والأطفال دون deep graph
عام. عدد SQL commands والتوقيت/الـoverlay progress بحاجة قياس المالك؛
لا سرعة مقاسة مدعاة. config الأب والطفل ToTable فقط مع FK conventions؛
unique parent الطبيعي tenant+MakeAndModelId محروس بـExecuteUniqueWriteAsync
وخدمة Exists. لا index جديد في هذه الشريحة؛ مقارنة plan لـ(SubscriptionId,
IsDeleted,Id) للقائمة و(SubscriptionId,MakeAndModelId) للـuniqueness مع
فهارسها الفعلية مؤجلة للمالك حسب الحجم/seek/filter، وكلفة الكتابة/storage
والتداخل. لا يُنفذ unique أو filtered index ولا يُفترض أن null غير حية.

## المرجع والدليل والقبول

Speed S242 وC0864/C0863 مطابقان في الأفعال والرأس والبنود؛ UI grant
ManageVehicleCost والتعبئة المسبقة للصفوف موثقتان بقرارهما في العقد،
ولا تعني صلاحيات Sigma التشغيلية تكافؤ كل التفاصيل المرجعية أو سرية حقل.
الكتاب/المالكون الحاليون يملكون loading/dialog/cache/exit/focus/MockData؛
لا extraction جديدة أو تعديل approved shared/reference. الدليل القائم
lease-guide.ts تحت /UserGuide/lease طُبق وطُابق بعد تسليم المصدر النهائي.

## إقفال الواجهة والدليل والفحوص

القائمة/المسار١٨مواصفة مصدرية غير منفذة، والمحرر١٥access+١rendered؛
والجذر HTTP+registry. لا تعني هذه الأعداد test execution أو RED/GREEN.
التدقيق المستقل راجع exact row object، Create-only بلا GET، read watcher
بعدcompletion وrapid recovery وبusy tail، confirmation expiry، وsent delete
tombstone قبل mayPublish. حارس المسار يستهلك public canDeactivate للطفل
بقرار الخروج نفسه ولا ينشئ قرارًا موازيًا؛ sent writes تسمح بالمغادرة.

المحرر يحجب body/portals/subtitle عند expiry أو actor/input replacement
ويبقي المسودة والقيم. required lookups قابلة للإعادة دون حلقة فشل، وcurrent
labels وIDs ثابتة عند bootstrap فارغة. MockData يأخذ requirement الفعلي،
والصفوف/القرارات/focus تلغي deferred work المنتهي. local discard بعد denial
متاح، وقبوله terminal يمنع إحياء المسودة لو تعثرت المغادرة. committed latch
يثبت نجاح كتابة قديمة قبل النشر، ولا Save يعاد بعد regrant أو destroy.
استُبدلت smoke spec القديمة بقالب حقيقي محمي مع HTTP providers وteardown؛
يبقى تشغيله عند المالك. رُوجع scoped diff لكل مستودع وملفات untracked
مباشرة؛ لا تناقض parent/child API أو imports/project inclusion مثبت مصدرًا.

حُدث موضوع إعدادات تكلفة التأجير في lease-guide.ts تحت /UserGuide/lease
وentry الدليل الموجودة في قائمة التأجير؛ يشرح grants المستقلة ومصادر
الاختيار وملكية البنود والمسودة/discard والكتابة المرسلة، مع قواعد التكلفة
والنطاقات الفعلية باللغتين، دون workflow تفعيل أو صفحة مستقلة للطفل.
فحوص parser/import existence لـ١٨ملفًا/قالبًا و٥٠مفتاح ترجمة حقيقيًا
(بما فيها أسماء ChargeRateTypeEnum الخمسة) بلا problems؛٥مشاريع XML
سليمة، وscoped diff --check نظيف مع تحذيرات EOL فقط، وrecipe Check الثماني
OK. ليست type checking أو نتائج builds/tests أو سرعة/SQL/visibility مقاسة.

رُقي صف LeaseCostSetting وحده بعد إقفال list/editor/actions/guide والتدقيق؛
الجرد١٢٥/٧٦/٥٨/٢/٢=٢٦٣ وretired=5. القبول التشغيلي للممثلين والمنح والفروع
والـread cancellation/rapid regrant/sent outcomes/discard/failures/portals/
RTL/themes/viewport والـquery plans مجمع للنهاية. لم تُنفذ أوامر محظورة.

لا هجرة مطلوبة. اقتراحا commit دون تنفيذ: الواجهة
`fix(lease): enforce cost setting workspace access lifetimes`؛ الخلفية
`fix(auth): isolate cost setting child writes and deletion graph`.
