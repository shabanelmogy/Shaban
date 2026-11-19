# تدقيق مستقل لمحرر RentalQuotation

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |  
النطاق: `components/details` فقط: المكوّن، الجلسة، القالب، ومواصفاتهما المصدرية.  
العقد: `RENTAL_QUOTATION_ACCESS_CONTRACT_FREEZE.md`.

## النتيجة

المحرر يطبق أجزاء جوهرية صحيحة من العقد: View يقرأ التفاصيل فقط دون lookups أو
TaxSettings، create مستقل عن View، القراءات مربوطة بإلغاء الجلسة ونسخة التحميل،
المسودة dirty لا تُمسح عند recovery، والكتابة المرسلة لا تُلغى ويثبت نجاحها
`committed/pristine` قبل حارس النشر. كذلك جرى تسييج print/focus/EditableRows/
MockData بالسياق الحالي.

أُعيد التدقيق بعد إصلاحات المحرر. أُغلقت findings التقاط requirement وContact
وfresh-state eligibility وزر Edit ورسالة/portal denial والتحميل الأولي الزائد
وإلغاء تأكيد الخروج، وأضيفت مواصفات integration حقيقية للحالات الأساسية. أُغلق
أيضًا عمر denial لمسار View الذي يبدأ مرفوضًا عبر مالك persistent مستقل عن إلغاء
طلبات HTTP المحدودة.

## Findings

### [CLOSED] اشتراك denial يثبت صلاحيات Create على مسارات View/Edit

في `details.component.ts:237-246` يُنشأ الاشتراك:

`this.session.writeDenied$()`

قبل أن تضبط route subscription قيمة `mode` في الأسطر 247–255. قيمة `mode`
الافتراضية هي `create`. وفي `rental-quotation-editor-session.ts:64-67` تحسب
`writeDenied$` الـrequirement عند استدعاء الدالة، خارج `defer`، فتظل تراقب
`rentalQuotationAccess.create` طوال عمر مكوّن View/Edit.

الأثر:

- مستخدم View أو Edit الصحيح الذي لا يملك Create يتلقى denial زائفًا عند البدء؛
  يُعطل النموذج وتُمسح bindings وتُضبط `recoveryPending`.
- بعد أول تحميل قد ينفذ `consumeRecovery()` تحميلًا ثانيًا غير لازم.
- أي access revision لاحق مع بقاء Create غير ممنوحة يمكنه مسح customer/branch
  watches في محرر Edit. ما دام Edit ظل مقروءًا فلن يصدر `recovered$`، وقد تبقى
  الـbindings مفصولة بلا recovery.
- الاشتراك لا يمثل requirement الفعلي عند سحب/إعادة منح Edit.

أُغلق: `writeDenied$` يحل requirement داخل `defer`، والمكوّن يعيد ربط اشتراكي
read/write بعد تثبيت mode/id و`session.start` في route subscription. لم يعد
الاشتراك الافتراضي للإنشاء يملك View/Edit.

### [CLOSED] سحب Contact لا يحجب البيانات السابقة، وإعادته لا تسترجع القراءة

في `details.component.ts:189-223` يُلغى طلب contact الجاري عبر
`access.denied$(rentalQuotationAccess.contact)`، لكن لا يوجد مالك عند denial يمسح
`contacts` أو يحجب/يعطل control. القالب لا يربط select بصلاحية Contact؛ لذلك
تبقى أسماء الخيارات المحملة ظاهرة وقابلة للاختيار بعد سحب المنحة.

إعادة Contact وحدها لا تجعل `session.recovered$` يصدر لأن requirement الأساسي
لـCreate/Edit ظل مسموحًا، ولا يتغير customer control، ولا يظهر Retry ما لم يوجد
خطأ. وبذلك لا يعاد تحميل الخيارات تلقائيًا.

أُغلق: effect مستقل يراقب أهلية Contact، يغلق portals ويمسح options عند السحب،
ويحتفظ فقط بالخيار المحدد خارج العرض لنفس actor ثم يعيد القراءة عند regrant.
القالب يعطل control عند غياب المنحة، بينما `contactPersonId` يظل اختياريًا ولا
يدخل في requirement الحفظ.

### [CLOSED] المواصفات المصدرية لا تغطي عقد المحرر المجمّد

أُغلق بدليل مصدري ضمن الحدود: `details.component.spec.ts` أصبح fixture integration
فعليًا ويغطي View دون lookups، Edit دون Create، Contact revoke/regrant والطلب
المعلق، فشل lookup مطلوب، dirty recovery السريع وبعد busy tail، false لتأكيد
الخروج، initial denial، واستقلال mutation المرسلة. وتغطي مواصفات الجلسة rapid
revoke/regrant وterminal document وmutation fencing وrequirement الديناميكي.
تبقى هذه مواصفات مكتوبة؛ لم ينفذها runner لإثبات نتيجة التشغيل.

تبقى بعض primitives مغطاة بمواصفات مالكيها المشتركة لا بتكامل هذا الملف، ولم
تُشغل أي مواصفة في هذا التدقيق source-only.

### [CLOSED] recovery للمسودة لا يعيد فحص أهلية حالة المستند

في `initialize` عند `preserveDraft`، يستدعي المحرر `mergeDetailLabels` بدل
`populate`. فحص `canEdit()` ورفض `notEditable` موجود فقط داخل `populate`
(`details.component.ts:501-507`). إذا تغيرت حالة العرض على الخادم أثناء denial،
أُغلق: `mergeDetailLabels` يحدث `quotation` من القراءة الحديثة حتى مع dirty،
و`isEditable` يشترط الآن `canEdit()` في edit mode؛ تبقى المسودة محفوظة لكن
الكتابة تغلق إذا تغيرت حالة المستند.

### [CLOSED] زر Edit يُعرض دون فحص منحة Edit

شرط العرض في `details.component.html` هو `isView() && session.canRead() &&
canEdit()` فقط. لذلك يستطيع مستخدم View بلا Update أو بلا write lookups رؤية زر
Edit، مع أن `edit()` يرفض التنقل لاحقًا عبر `access.allows(rentalQuotationAccess.edit)`.
أُغلق: الزر يمرر `[permission]="permissions.edit"` مع بقاء حارس handler.

### [CLOSED] حالة access denial تستخدم رسالة عامة غير ملائمة للمحرر

فرع `accessBlocked()` في `details.component.html` يعرض مباشرة المفتاح
`authorization.accessDenied`. هذا لا يطابق عرض الحالة المعتمد للمحرر/المسار
أُغلق: القالب يستخدم `authorization.currentAccess.denied`، ويبقي جسم المحرر
mounted لكنه `[hidden]` و`inert`. كما يغلق المكوّن Select/DatePicker portals عند
read/write/contact denial.

### [CLOSED] denial الأولي الزائف يسبب Detail read إضافية في View

أُغلق: الاشتراكات تُربط بعد mode/id؛ View المسموح لا يتلقى denial إنشاء زائفًا.
View المرفوض أوليًا لا يبدأ القراءة، وعند regrant يستهلك recovery مرة واحدة.

### [CLOSED] إلغاء تأكيد الخروج لا يعيد `false` صراحة

في `details.component.ts:432-445` ينتهي قرار `canDeactivate` عبر
`takeUntil(this.session.confirmationCancelled$())`. عند انتهاء السياق أو سحب
المنحة يمكن أن يكمل stream بلا أي emission، ولا توجد `defaultIfEmpty(false)`.
العقد يطلب أن القرار المتقادم يُلغى وأن تكون نتيجة guard الافتراضية false؛ الاعتماد
أُغلق: أضيف `defaultIfEmpty(false)` بعد cancellation، ومواصفة fixture تثبت
emission بالقيمة false عند denial أثناء القرار.

### [CLOSED] View المرفوض أوليًا لا يعيد ربط مالك denial بعد أول regrant

`bindReadDenial()` يستدعي `session.readCancelled$()`. عندما يبدأ View مرفوضًا،
تعيد `readCancelled$` قيمة `of(undefined)` لأن `canRead()` false، فيعمل الحجب
الأولي ثم يكتمل subscription. عند أول regrant يستعيد `readInterrupted` القراءة
ويبدأ detail بصورة صحيحة، لكن `bindReadDenial()` لا يُستدعى ثانية. لذلك revoke
لاحق في جلسة View نفسها لا يمر عبر callback المكوّن الذي يغلق portals ويعطل form
ويثبت `recoveryPending`؛ يعتمد فقط على `accessBlocked` والـsession latch.

القراءة الجارية بعد regrant تملك cancellation الخاص بها، والاسترداد التالي قد
يصدر من session، لكن عقد mounted denial يطلب مالكًا مستمرًا للحجب/portal cleanup.
مواصفة initial denial الحالية لا تنفذ دورة grant → revoke → regrant ثانية، فلا
تكشف هذا الانتهاء المبكر.

أُغلق: أضيف `session.readDenied$()` كـpersistent mounted-owner يستخدم
`defer(merge(cancelled$, access.denied$(current readRequirement)))`، واعتمده
`bindReadDenial` فقط. بقي `readCancelled$` محدودًا لكل HTTP/watch كما ينبغي.
مواصفة fixture تبدأ View مرفوضًا ثم تنفذ grant/revoke دورتين، وتثبت portal cleanup
المتزامن عند كل denial ثم grant ثالث مع ثلاث قراءات detail إجمالًا دون duplicate.

## مطابقة البنود التي لم يظهر فيها finding مصدري

- View: `loadView` يستدعي `getDetail` فقط؛ لا write lookups ولا TaxSettings.
- Create: requirement لا يحتوي View.
- actor/id: `capture/expire` يجعل الجلسة terminal، و`cancelled$` يلغي القراءات؛
  حارس version/id يمنع النشر المتأخر.
- dirty: recovery لا يستدعي `resetForm` أو `populate` عندما يكون النموذج dirty.
- required lookups: finite forkJoin ثم customer/branch watch مع selected-label
  preservation، وتُفصل ثم تعاد بعد regrant عبر الاشتراكات الديناميكية.
- mutations: لا `takeUntilDestroyed` أو denied على HTTP mutation؛ `HttpContext`
  يحمل `CAN_PRESENT_API_OUTCOME`، والنجاح يثبت committed/pristine قبل الحارس.
- print: frame يعيد فحص View والجلسة والنسخة والهوية.
- focus وEditableRows: يستخدمان cancellation وallowed/canMutate وعضوية row
  الفعلية بعد التأكيد.
- MockData: requirement/publication/cancellation تأتي من session الحالية.

## حدود التحقق

هذا تدقيق مصدر فقط. لم تُشغل tests أو build أو typecheck أو lint أو browser، ولم
يُعدل أي ملف تطبيق أو ملكية عامل آخر. قبول runtime والـloader/keyboard/RTL والـA→B→A
الفعلي باقٍ عند المالك بعد إغلاق findings وإضافة المواصفات المصدرية.

## ملاحظة الإغلاق النهائية

- الطباعة المؤجلة تملك `printSequence` مستقلًا؛ `cancelScheduledPrint` يزيده ويلغي
  الإطار المسجل عند read denial وعند destruction. كلا callback الإطار الأول
  والثاني يعيدان فحص sequence والجلسة، لذلك rapid deny/regrant لا يستطيع نشر
  print قديم حتى لو استدعى الاختبار callbacks الملغاة يدويًا. المواصفة المصدرية
  تغطي هذا التسلسل.
- `consumeRecovery` يتوقف عند `session.committed()`. لذلك نجاح mutation المرسل
  الذي يُحجب ناتجه يثبت committed/pristine، ولا يعيد bootstrap بعد regrant ولا
  يسمح save ثانيًا. مواصفة المصدر تثبت ثبات عددي update/detail بعد إعادة المنحة.

لا finding مصدري مفتوح بعد هاتين الإضافتين؛ تبقى owner runtime verification
معلقة كما هو مسجل في رأس التقرير.
