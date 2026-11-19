# التدقيق المستقل لحوارات اتفاقية الإيجار

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | إعادة قراءة مصدرية نهائية للـhelper وExtend Period وExtend Rate Period ومواصفات helper |
| التنفيذ | لم تُعدّل ملفات الحوارات؛ التعديلات بقيت عند عاملها |

## المرجع والحدود

طُبق العقد المجمّد
`LEASE_AGREEMENT_ACCESS_CONTRACT_FREEZE.md` مع UI13/26/28/27/22/2.
رُوجع `lease-agreement-dialog-session.ts` وكل حوارات Additional Charges وBilling
History وClosing وDelivery Date وDeposit وDiscounts وDocuments وDriver Replacement
وExtend وExtend Rate Period وLogs وPayment Instructions وVehicle Replacement وVoid.
هذا تدقيق مصدر فقط؛ لم تُشغّل build أو tests أو typecheck أو lint أو متصفح أو
قاعدة بيانات أو migrations أو commit.

## النتائج المؤكدة في إعادة التدقيق

### مغلق — helper والاستعادة والهوية

- يملك `LeaseAgreementDialogSession` الآن Injector صريحًا اختياريًا ويدمر
  `EffectRef` مع owner. `recovered$` و`mockDataCancelled$` حقول ثابتة وليسا
  getters ينشئان observable جديدًا لكل binding.
- توجد مواصفة مصدرية فعلية تنشئ helper بـInjector، تبدأ initial-denied، تشترك في
  `recovered$` ثم تمنح الوصول وتنفذ `TestBed.flushEffects()` وتتحقق من callback
  واحد ومن `canRead/canWrite`. توجد أيضًا تغطية فصل القراءة/الكتابة، A→B→A،
  تغير المستند، local-discard عند initial denial، و`CAN_PRESENT_API_OUTCOME`.
- Extend بنوعيه يملكان pending recovery وbusy-tail consumption، ويحفظان dirty
  draft عند refresh، ويستخدمان entry guards ونسخ الطلب وهوية الاتفاقية قبل نشر
  النجاح. عمليات الكتابة تحرر global loader قبل حراسة local state بعد destroy.
- Extend Rate Period أغلق portals المنقولة إلى body، واستبدل مؤقت التركيز بـ
  `timer(0)` محروس بإلغاء الكتابة وdestroy.

### مفتوح — P1: خطأ لوكات Extend Rate Period غير محروس

في `extend-rate-period.component.ts` داخل `loadLookups()`، الـStaff وClauseType
جزء من متطلب القراءة المجمد، لكن entry/cancellation/publication تستخدم
`canWrite()` و`writeCancelled$()`. لذلك لا تُحمّل الخيارات للمستخدم read-only،
وقد لا تظهر قيم الصفوف المختارة، كما أن write-only revoke يلغي قراءة يملكها
read contract. يلزم `canRead()` و`readCancelled$()` وread publication fence؛
ويبقى effect/form هو مالك منع التحرير. كذلك مسار `error` يكتب `errorMessage`
بلا `lookupVersion` أو access fence، ويمكنه نشر خطأ stale.

### مفتوح — P1: hydration لصفوف Extend Rate Period مشروط بالكتابة

`applyContext()` يستدعي `addProvision(item)` و`addClause(item)` و
`addPreTerminationRule(item)`، لكن كل دالة ترجع فورًا عند `!session.canWrite()`
حتى عندما يكون `item` صفًا محملًا من الخادم. النتيجة أن مستخدم read-only يفقد
الصفوف المحمية بدل عرضها disabled. يجب قصر حارس الكتابة على الإضافة المحلية
`!item`، والسماح دائمًا بهيدرة عناصر السياق المنشور ثم ترك write-state effect
يعطل النموذج.

### مفتوح — P2: freeze recovery يعيد النموذج قبل حراسة الكتابة

في `requestClose()` بكلا `extend-period.component.ts` و
`extend-rate-period.component.ts`، يستدعي `finalize` دالة `restoreForm()` دائمًا
ثم يعطل النموذج إن كانت الكتابة مسحوبة. يلزم استعادة freeze snapshot فقط عندما
`session.canWrite()`؛ وإلا يبقى النموذج معطلًا، ثم يُستهلك pending recovery من
الـtail. هذا يمنع إعادة enable عابرة بعد denial ويحافظ على owner واحد لحالة
الكتابة.

### مفتوح — P2: envelopes للأخطاء غير مكتملة

- مسار `error` لقراءة السياق في Extend بنوعيه يتحقق من `canPresent(true)` فقط،
  ولا يتحقق من `loadVersion` و`agreementId` الملتقطين كما يفعل `next`. يلزم نفس
  envelope حتى لا ينشر خطأ طلب أقدم لنفس الجلسة.

التركيز المؤجل مقفل في النسخة المعاد قراءتها: Extend Period يفحص `canWrite()`
قبل DOM query، وExtend Rate Period يستخدم `timer(0)` مع write cancellation وdestroy
ثم يفحص `canWrite()` قبل الاستعلام.

## التحميل والنشر

- عمليات الكتابة تستخدم مالك الصفحة العام وتحرره في `finalize`؛ هذا مناسب
  للكتابات المرسلة بشرط عدم إعادة enable بعد denial/commit.
- قراءات الحوارات تستخدم حالة محلية، وهو المالك الصحيح للـbody-appended dialog.
  لكن القبول لا يكتمل قبل إضافة cancellation/fencing والاستعادة أعلاه؛ لا يوجد
  ادعاء runtime أو stacking/assistive acceptance.

## قرار التدقيق

الـhelper ومتطلبات recovery المحددة مقفلة مصدرّيًا، لكن Extend بنوعيه يبقيان
findings أعلاه؛ لذلك تبقى الحالة `Blocked` لحين إصلاحها وإعادة قراءة scoped.
بعد الإغلاق يبقى build/tests/typecheck/lint والمتصفح قبولًا معلقًا للمالك.



## إعادة التدقيق النهائية بعد الإصلاح

أعيدت قراءة helper وحوارَي التمديد فعليًا بواسطة العامل المستقل بعد
الإصلاحات الأخيرة. أُغلقت لوكات Staff/ClauseType بعمر القراءة، وصفوف
الخادم للعرض فقط، ونسخ أخطاء السياق واللوكات، واستعادة freeze المشروطة،
ومؤقتات التركيز وbusy tail. لم تبق finding مؤكدة في هذا النطاق.
النتائج المفتوحة أعلاه سجل للمرور السابق، وقد أصبحت مغلقة بهذا الملحق؛
لا تُفسر كحالة حالية. تخزين Observable الخاص بـMockData ثابت، وrecovery
له Injector ومواصفة callback فعلية، دون تشغيل المواصفات.

تغيّرت الملكيات أثناء الإقفال: الجذر أنهى Documents وDeposit، وتدقيق
Documents مستقل في LEASE_AGREEMENT_DOCUMENTS_INDEPENDENT_AUDIT.md،
وتدقيق Deposit أجراه عامل المحرر وأقر إغلاق ملاحظاته بعد قراءة النسخة
الحالية. عامل الخلفية أنهى Closing/VehicleReplacement؛ والثمانية الباقية
لها LEASE_AGREEMENT_SUPPORTING_DIALOGS_INDEPENDENT_AUDIT.md المغلق مصدرًا.
لا build/tests/typecheck/lint/browser/DB؛ التشغيل مجمع للمالك.
