# تبني صلاحيات الأرصدة الافتتاحية

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | /OpeningBalances، parent وثمانية محررات ومالكها الحالي وخدمات حالتها، ومفاتيح API والتصنيف والدليل |
| التحقق | source-only؛ لا build/test/lint/browser/DB/migration/snapshot/commit |

## الاكتشاف والقرار

المصدر الفعلي هو openingBalances.routes إلى details ثم switch للمحرر النشط؛
هذا UI05 financial collection editor وهو نفسه المرجع المعتمد، وbackend pattern3.
تبقى المحاسبة وfull replacement وexpectedVersion والـJV المولد والأقفال كما
هي في OPENING_BALANCES_FEATURE_REVIEW؛ هذه دفعة تفويض لا تغيير دقة/حساب/DTO.
يجب أن يكون كل طلب تحت منحة فعله الفعلي؛ AddList هو الحفظ/الإضافة/إزالة صف
المجموعة، ولا يُخترع CRUD من Generic Create/Update/Delete المرفوضة في base.

قرئ Speed21/04 ثم C0517 المؤرخ2026-10-28 بصورة منفصلة. يثبت التبويبات والإضافة
والتعديل والحذف والفلاتر والتصدير/import وقروضًا ومقدمات أوسع. مصدر Sigma
الحالي يستهلك٨مجموعات فقط؛ التصدير/import/القروض/التخصيص غير الموجودة لا
تخترع ضمن صلاحيات أحداث غير موجودة. تبقى فجوات مقارنة مرجعية في التقرير
السابق، لا مساواة مرجعية كاملة. لا شرح أصلي مطابق في catalog؛ الفصل المالي
في Guide.md يذكر الأرصدة إجمالًا. لا مفهوم غامض يتطلب Odoo لهذه الدفعة.

## مفاتيح الطلبات الثابتة

المشترك: OpeningBalanceBatch.Get وOpeningBalanceState.Get وCurrency.GetFinancialNumberPolicy.
قراءة المصدر GET من SiGmaControllerBase/override GetList تعطي View، وليس
GetList literal. حفظ POST AddList يعطي المصدر.AddList حرفيًا.

| التبويب | المصدر | مصادر الاختيارات الإلزامية للقراءة الحالية |
|---|---|---|
| الحسابات | OpeningBalanceAccount | Account.Lookup،Branch.Lookup،CostCenter.Lookup |
| مراكز التكلفة | OpeningBalanceCostCenter | Account.Lookup،Branch.Lookup،CostCenterGroup.Lookup،CostCenter.GetSelectByGroup |
| العملاء | OpeningBalanceCustomer | Customer.Lookup |
| الموردون | OpeningBalanceSupplier | Supplier.Lookup |
| الموظفون | OpeningBalanceStaff | Staff.Lookup |
| المخزون | OpeningBalanceStock | Item.Lookup |
| المدفوع مقدمًا | OpeningBalancePrepaid | Account.Lookup،Vehicle.Lookup |
| التأمينات | OpeningBalanceDeposit | Customer.Lookup |

متطلب كل تبويب allOf للمشترك+المصدر.View+مصادره، ومتطلب الكتابة يضيف
المصدر.AddList. تبقى العرض/الصفوف/الفلاتر/local totals readable دون الكتابة،
لكن كل تعديل/MockData/Add/Remove/Save يحتاج الكتابة. لا lookup محظور في
bootstrap. CostCenter dependent requests تقبل مجموعات الصفوف الحالية فقط.
Route requirement المشترك+anyOf للمصادر.View؛ parent يختار أول تبويب مؤهل
فعليًا بمتطلبه الكامل. عدم اكتمال lookup grants يظهر رفضًا بلا HTTP، وليس
محاولة طلب محظور. لا prefix عام.

تعديل المالك بتاريخ٧نوفمبر٢٠٢٦ على القرار المعلق السابق:
«التهيئة لمدير الشركة فقط». التعديل التالي يحل محل انتظار قرار scope ولا
يغيّر منح تبويبات الأرصدة أو عقودها المالية.

OpeningBalanceBatch.Configure هو PUT حقيقي قد يغير تاريخ قيود الشركة، ولذلك
يُقصر على مدير الشركة (`tenantAdmin`) مع فحص مستقل في فلتر الصلاحيات وخدمة
الأعمال، حتى مع وجود منحة العملية. لا تتحول قراءة GET إلى منحة Configure
ضمنية. المستخدم العادي يرى حالة الحاجة إلى التهيئة ولا يحصل على زرها أو
مسارها؛ بعد التهيئة تبقى التبويبات وحفظها خاضعة لمنحها المستقلة، دون تعطيل
بقية دورة الأرصدة.

## عمر القراءات والكتابات

المضيف والتبويب يبقيان mounted hidden/inert عند السحب، مع draft محفوظ في
السياق نفسه وإغلاق Select/DatePicker portals. انتهاء actor/token/dataContext
نهائي للجلسة حتى إذا عاد قبلeffect؛ تصفر rows/lookups/filter/cache/version
ولا تنشر نتيجة قديمة. required lookups/full reads قابلة للإلغاء والاستعادة
مرة على regrant؛ لا HTTP بسبب revision غير متعلق، ولا overwrite draft متسخة.
الأثر/الفلتر/السطر الحالي حراس إضافية لا تُستبدل بالمنحة.

POST AddList مستقل بعد الإرسال: لا takeUntil(access/context). يحفظ نجاحه
ومنع التكرار عبر refreshRequired حتى لو سُحبت القراءة. القراءة بعد الحفظ
مستقلة cancellable/Retry؛ regrant يستعيد القراءة وحدها ولا يعيد POST. نتيجتها
تحل محل المسودة التي التُزم بها فقط. prior-session messages/results محجوبة.
الرفض409 يفتح قرار reload كسولًا قابلًا للإلغاء؛ لا auto replay أو silent discard.

الـEditableRows الحالي يملك إزالة الصف وتأكيدها. confirmationCancelled$ يصل
إلى notifier الكتابة/السياق، وتبقى حراسة exact row وإعادة الفحص. تؤجل confirmation
نفسها حتى يبدأ notifier، وتحتفظ استعادة النموذج بقرار المنحة الحالية. الخروج
والتبديل يحتاجان lazy shared discard وdefault false عند الإلغاء؛ fresh local
discard أثناء denial يبقى ممكنًا، ولا انتقال إلى tab محظور أو أثناء sent write.

## واجهة المالك المشترك المجمدة

يمتد OpeningBalanceEditorBase نفسه ولا يُنشأ إطار منافس. تستهلك المحررات:

- دالة initializeEditorAccess(form, reload, clear, supplementaryForms?) داخل ngOnInit قبل reload؛ clear يصفر rows/options/filter الخاصة بالمحرر فقط.
- دالة canRead() وcanWrite() وaccessBlocked() ومتطلبا readRequirement/writeRequirement الحاليان من sourceKey.
- دالة readInSession<T>(request, recovery?:'editor'|'local') للـGET/lookup/aggregate فقط؛ editor default يثبت interruption قبل finalize، local لا يعيد كل المسودة.
- دالة commitEditor<T>(mutation, refreshFactory, acceptRefresh, savingSignal, form)؛ mutation Result<unknown>، refresh typed، acceptRefresh يرجع boolean بعد فحص envelopes وتطبيق rows/state. المالك يفصل POST عن refresh ويملك busy/feedback/409/session.
- دالة decisionsCancelled$ للاشتراك في إلغاء row/exit decisions،captureSession()/isSessionCurrent(snapshot) للحراس الخاصة التابعة عند الحاجة.
- دالة freezeDiscardDecision() تعيد restore idempotent؛ يستهلكها الأب عند قرار مغادرة أو تبديل التبويب، مع قفل حفظ وتعديل الصفوف حتى القرار والتحقق من الجلسة والمنحة قبل استعادة النموذج.
- دالة canRequestEditorLoad() قبل reload، تسمح refreshRequired recovery وتمنع duplicate/dirty overwrite؛ فحوص tab الخاصة تبقى.

المحررات تحافظ على factories والvalidators والحسابات وDTOs، وتستبدل فقط subscription
العمر المتكرر بالمالك. تستخدم readInSession للـforkJoin bootstrap، وcommitEditor
للكتابة والتحديث، وconfirmed row utility كما هو. لا ترحيل form إلى إطار جديد.

## تحميل/كاش/أداء وملكية

required initial lookups والصفوف/state تحت مالك صفحة واحد begin/endEditorLoad.
CostCenter local dependent reads تحت مالكها الحالي، مع errors/Retry. Financial
policy singleton صريح؛ choices الحالية direct reference بلا cache opt-in،والصفوف
operational direct؛ state memo feature-owned يُعزل بالسياق ويُلغى/يُبطل عبر source
write/context ولا يحتفظ بفشل/EMPTY. لا index/schema جديد بلا evidence/ownermigration.
القياسات وSQL plans والـDOM/runtime معلقة؛ fewer requests لا تثبت السرعة.

الجذر يملك contracts/registry/parent/details وbackend والـguide/docs. عامل أول
يملك shared base وservices/state وshared EditableRows إن احتاج تصحيح lazy open،
وعاملان يملكان٤tab components لكل منهما فقط بعد هذا التجميد. لا تداخل ملكية،
والجذر يدمج ويراجع. source specs تسبق الإصلاح حيث أمكن؛ لا تشغيلها.

توضيح تكامل٧نوفمبر: تبقى saving=true طوال الكتابة وقراءتها التالية؛ بعد
فشل/إلغاء refresh تتحرر بينما refreshRequired يفرض Retry قبل الحفظ ولا يحبس
المغادرة. رد409 بعد قبول discard يمسح dirty ويعيد القراءة مرة، ولا يعيد POST.
تهيئة batch الأولى تستخدم زرًا صريحًا للمدير، version/description المقروءين
فقط، وتنتظر نتيجتها المستقلة حتى مع سحب المنحة أو هدم المضيف؛ لا تهيئة تلقائية
ولا إعادة إرسال عند إعادة المنح.
