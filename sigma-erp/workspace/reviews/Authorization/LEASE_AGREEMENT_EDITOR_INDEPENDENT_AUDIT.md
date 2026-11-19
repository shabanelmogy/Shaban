# تدقيق مستقل لمحرر اتفاقية الإيجار

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | قراءة فقط لـ `LeaseAgreement/components/details/**` والمسارات النشطة والمغلقة |
| التنفيذ | مصدر فقط؛ لم تُشغّل build/tests/typecheck/lint/browser/DB |

## المراجع والمصدر المقروء

- العقد المجمّد:
  `reviews/Authorization/LEASE_AGREEMENT_ACCESS_CONTRACT_FREEZE.md`.
- آخر تسليم للمحرر وملحق المصدر المضمّن:
  `LEASE_AGREEMENT_EDITOR_ACCESS_HANDOFF.md` و
  `LEASE_MASTER_AGREEMENT_LEASE_AGREEMENT_ACCESS_HANDOFF.md`.
- المصدر الحالي الفعلي: `details.component.ts/html`، خدمة العقد، ملف المنح،
  والمساران النشط والمغلق، إضافة إلى مواصفات المصدر الحالية للاستدلال على
  النية فقط. لم تُعامل المواصفات غير المنفذة كدليل نجاح.

## النتيجة

### finding مغلق مصدرّيًا — البدء مرفوضًا لا يستعيد bootstrap بعد إعادة المنحة

أثبتت القراءة الأولى أن تركيب Create أو View أو Edit بينما المتطلب غير مسموح
كان يثبت المالك والمتطلب ويعطّل النموذج دون تسليح recovery، لذلك كان regrant
لنفس الممثل يترك المحرر بلا تفاصيل أو لوكات.

أغلق مالك المحرر finding أثناء التدقيق، ثم أعيدت قراءة المصدر الفعلي مستقلًا:
`initializeSourceAccess()` يضبط الآن pending bootstrap حسب الوضع — لوكات Create،
تفاصيل View، وتفاصيل ولوكات Edit — ويثبت `sourceInterrupted` و
`sourceRecoveryPending` عند المنع الأولي قبل تعطيل النموذج. لذلك يستهلك effect
القائم نفس flags بعد regrant دون طلب أثناء denial أو مسح المسودة.

النتيجة الحالية مصدرّيًا: مسارات Create/View/Edit، بما فيها العرض المغلق الذي
يعيد استخدام المكوّن، تسلّح القراءة المطلوبة عند initial denial وتستعيدها عند
same-actor regrant عبر `recoverSourceAccess()`.

المواضع:

`details.component.ts:583-601, 667-686, 760-792`

أضيفت مواصفات مصدرية من مالك المحرر لحالتي Create وView تبدأان denied ثم تعيدان
نفس الممثل. لم تُشغّل، ولا يزال قبول Edit/runtime ضمن قبول المالك المجمع.

## الحالات التي لم يظهر فيها finding جديد

| الحالة | الدليل المصدرّي |
|---|---|
| View string requirement | `sourceAccessRequirement` يحوّل المصفوفات إلى `allOf` ويُبقي `LeaseAgreement.View` string كما هو، فلا يوجد string spread. |
| المصدر المضمّن بلا متطلب | `sourceRequested && requirement === undefined` يفشل مغلقًا، ولا يرجع إلى متطلبات المسار العام أو broad lookups. |
| هوية الأب/المصدر | تغير `embedded/masterAgreementSource/accessRequirement` أو notifier الأب ينهي الجلسة نهائيًا؛ `sourceKey` يربط master/item أو mode/id. |
| actor/document/route reuse | المالك والمفتاح المثبتان يمنعان A→B→A؛ تغير route id يستدعي expiry بدل إعادة استعمال جلسة المستند القديم. |
| حجب العرض | subtitle وشريط الحالة والنموذج مخفية عند denial، ورسالة الرفض ظاهرة؛ زر الرجوع المحلي يبقى متاحًا ما لم تكن عملية مستقلة busy. |
| الحفظ المرسل | Create/Update يحملان `CAN_PRESENT_API_OUTCOME`؛ الطلب مستقل عن destroy/denial، و`saveCompleted` يثبت قبل أي نشر محلي، بما في المسار العادي. |
| الحراس المباشرة | save/edit/print/retry detail/tariff وتعديلات الصفوف تعيد فحص lock/access أو متطلب الإجراء المناسب؛ مسار الخروج المتسخ يعيد فحص mode/id/source key. |
| الطباعة والتركيز المؤجل | كلاهما مربوط بإلغاء القراءة وبوابة الممثل/المستند؛ print pending يعيد فحص الهوية والمنحة قبل النشر. |
| أعمار HTTP | قراءات التفاصيل/اللوكات/التعريفة قابلة للإلغاء؛ الكتابة المرسلة لا تُربط بعمر component، بينما نتيجة العرض محروسة بالـcontext. |
| المسارات المغلقة | `view/:id` و`details/:id` يملكان `canDeactivate` ويثبتان `mode: view` و`listRoute` المغلق. |

## حدود القبول

هذا تدقيق مصدرّي مستقل ولم يعدّل Angular. لا يثبت الترجمة أو التشغيل أو ظهور
loader/portal أو سباقات المتصفح. بعد إصلاح finding يلزم تشغيل المواصفات وقبول
يدوي مجمع لـ initial-denied→same-actor-regrant، A→B→A، route id reuse، وحفظ
مرسل يعقبه denial؛ تلك الخطوات غير مفوضة في هذه الشريحة.
