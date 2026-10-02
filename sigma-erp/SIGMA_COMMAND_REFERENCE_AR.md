# Sigma — مرجع أوامر العمل

هذا الملف هو المرجع السريع للأوامر التي يمكن استخدامها لبدء التخطيط، المراجعة،
التنفيذ، التحقق، أو إغلاق أي Feature داخل Sigma.

> الفكرة الأساسية: لا تحتاج إلى شرح الـ workflow كل مرة. استخدم الأمر المناسب،
> ثم تُطبَّق القواعد والـ guides والـ packets المعتمدة تلقائيًا.

---

## 1. الأوامر الأساسية المختصرة

| الأمر | الاستخدام |
|---|---|
| `Plan <feature>` | تخطيط قبل التنفيذ، خصوصًا لو الـ logic غامض أو التغيير كبير |
| `Review <feature>` | مراجعة read-only للموجود وتحديد المشاكل والـ drift |
| `Implement <feature>` | تنفيذ الخطة أو العقود المجمدة |
| `Verify <feature>` | تحقق source-only بعد التنفيذ؛ التشغيل والاختبارات تحتاج تفويضًا صريحًا |
| `Close <feature>` | Final Reconciliation وإغلاق العمل |

> **ملاحظات ملزمة من الجذر `F:\My Work\Sigma\AGENTS.md`** — المرجع ده سريع فقط
> والجذر هو canonical:
>
> - `Review` و `Feature Review end-to-end` **read-only على مصدر التطبيق**:
>   ممنوع تعديل أي ملف مصدر أو إعداد أو ملف تعليمات. إنشاء الـ artifacts تحت
>   `F:\My Work\Sigma\reviews\` مسموح ومتوقع، لأنه جزء من مخرج المراجعة.
> - `Verify` = **source-only**. الـ build والـ test والـ runtime والـ database
>   والـ browser تفضل pending لحد تفويض صريح للمهمة الحالية.
> - التنفيذ لا يبدأ إلا بصيغة صريحة: `Implement <feature>` / `نفذ <الميزة>`،
>   أو `ونفذ الإصلاحات المؤكدة`، أو `run review and refactor direct`، أو طلب
>   مباشر بـ refactor / fix / implement — ومع عقد Frozen.
> - للشاشات: الـ skill `sigma-screen-refactor` ملخص تشغيلي للكتب؛ كل قاعدة
>   فيها بتشاور على الـ block المالك لها في الكتاب، والكتاب هو اللي بيكسب عند
>   أي اختلاف.

المعنى العملي:

```text
Plan → Review → Implement → Verify → Close
```

ليس مطلوبًا استخدام كل خطوة دائمًا؛ يتم اختيار ما يناسب نوع التغيير.

---

## 2. Feature جديدة وواضحة

استخدم:

```text
ابدأ Feature Review لـ <اسم الميزة> end-to-end
```

مثال:

```text
ابدأ Feature Review لـ Vehicle Reservations end-to-end
```

يبدأ العمل من Phase 0 وينتهي بـ Phase 6 حسب المراحل المطلوبة فعليًا.

> **read-only:** الأمر ده لا يفوّض تعديل مصدر التطبيق. التنفيذ يحتاج صيغة
> `راجع ... ونفذ الإصلاحات المؤكدة` (بند 8) مع عقد Frozen.

---

## 3. تطوير كبير أو Logic غامض أو تكملة الموجود

استخدم:

```text
اعمل Maintenance / Evolution Plan لـ <الموضوع> قبل التنفيذ
```

مثال العملات:

```text
اعمل Maintenance / Evolution Plan لنظام العملات قبل التنفيذ
```

هذا الأمر يعني:

- مراجعة الموجود end-to-end.
- تحديد الـ logic الغامض أو المتعارض أو المفقود.
- عمل Impact Map.
- تحديد هل كل جزء يحتاج Keep / Extend / Refactor / Replace / Create / Remove.
- مقارنة البدائل والـ trade-offs.
- مناقشة القرارات التي تغيّر Business Semantics قبل Freeze.
- تحديد migration / compatibility / rollout / verification.
- منع التنفيذ حتى تصبح الخطة قابلة للـ Freeze.

---

## 4. مناقشة الخطة قبل اعتمادها

```text
راجع الخطة وناقش معايا القرارات المفتوحة قبل Freeze
```

لو تريد التركيز فقط على القرارات التي تحتاج رأيك:

```text
اعرض فقط الـ business decisions المفتوحة والبدائل والـ trade-offs
```

لا يتم حسم قرار Business غامض بالاختيار التقني الأسهل.

---

## 5. تجميد الخطة والاستعداد للتنفيذ

```text
اقفل الخطة كـ Frozen وجهز مراحل التنفيذ
```

لو ما زال قرار أساسي Missing / Conflicting / Uncertain، تظل الخطة Blocked بدل
تجميدها شكليًا.

---

## 6. بدء التنفيذ بعد الخطة

```text
ابدأ تنفيذ الخطة الـ Frozen حسب المراحل
```

أو لتنفيذ أول جزء فقط:

```text
ابدأ أول Implementation Slice
```

أو للاستمرار حتى النهاية:

```text
كمل التنفيذ حتى Phase 6 والإغلاق، وتوقف فقط عند business decision غير محسوم
```

---

## 7. مراجعة Feature موجودة بدون تعديل

```text
راجع <المسار أو الميزة> end-to-end read-only
```

مثال:

```text
راجع src\app\modules\Movements\logsMovement end-to-end read-only
```

---

## 8. مراجعة Feature وتنفيذ الإصلاحات المؤكدة

```text
راجع <الميزة> end-to-end ونفذ الإصلاحات المؤكدة
```

المقصود تنفيذ الإصلاحات المدعومة بالعقود والقواعد فقط، بدون اختراع business
logic جديد.

---

## 9. مراجعة UI فقط

Read-only:

```text
راجع UI الخاص بـ <الميزة> حسب SIGMA_UI_PATTERNS read-only
```

مع التنفيذ:

```text
راجع UI الخاص بـ <الميزة> حسب SIGMA_UI_PATTERNS ونفذ الـ drift
```

للشاشات المحاسبية:

```text
راجع الشاشة حسب Accounting UI patterns وOpening Balances reference
```

---

## 10. مراجعة Backend فقط

```text
راجع Backend الخاص بـ <الميزة> حسب SIGMA_BACKEND_PATTERNS end-to-end
```

---

## 11. مراجعة Frontend + Backend معًا

```text
اعمل Contract-First Split Review لـ <الميزة>
```

يستخدم عندما يكون المطلوب تجميد API/domain contract أولًا ثم مراجعة Frontend
وBackend ضد نفس العقد.

---

## 12. مراجعة Business Logic فقط

```text
راجع business logic الخاص بـ <الميزة> وحدد الغامض والمتعارض والمفقود بدون تنفيذ
```

---

## 13. معرفة الموجود قبل إنشاء شيء جديد

```text
اعمل Existing-State Audit لـ <الموضوع> وحدد الموجود والناقص وما يجب تكملته بدل إنشاء بديل
```

مفيد قبل إنشاء service/entity/workflow جديد قد يكون له owner موجود بالفعل.

---

## 14. تحليل تأثير تعديل

```text
اعمل Impact Analysis للتعديل التالي: <التعديل>
```

المراجعة تشمل عند الحاجة:

- Domain / Entities.
- Writers / Readers.
- Database / EF / migrations.
- API contracts.
- Angular consumers.
- Reports / exports.
- Authorization / tenancy.
- Integrations / runtime wiring.
- Existing data and backward compatibility.

---

## 15. مقارنة تصميمات أو بدائل

```text
اعرض البدائل الممكنة لـ <المشكلة> مع trade-offs ولا تختار business decision من نفسك
```

---

## 16. منع Duplicate Logic

```text
راجع ownership قبل التنفيذ وتأكد إننا بنكمل الـ owner الحالي بدل إنشاء parallel implementation
```

---

## 17. مراجعة Report

```text
راجع <التقرير> end-to-end حسب report pattern وتأكد إن الحسابات backend-owned
```

---

## 18. مشكلة Token / Authorization / HttpClient

```text
راجع HttpClient/provider/interceptor path للميزة وتأكد إن Authorization بيتبعت
```

القاعدة: UI block 1، قسم *One `HttpClient`*.

---

## 19. تكرار Success Toast

```text
راجع success-feedback ownership وتأكد إن كل mutation ليها success toast واحد فقط
```

القاعدة: UI block 22 (صاحب رسالة النجاح والخطأ واحد).

---

## 20. Scroll / Layout

```text
راجع scroll ownership للشاشة وتأكد إن مفيش nested page scroll مخالف للـ guide
```

---

## 21. Final Reconciliation

```text
اعمل Phase 6 Final Reconciliation للميزة
```

دي خطوة الإغلاق الفعلية قبل اعتبار Feature مكتملة.

---

## 22. إغلاق Phase معينة

```text
راجع حالة Phase <رقم> وقفلها لو كل gates متحققة
```

مثال:

```text
راجع حالة Phase 5 وقفلها لو كل gates متحققة
```

---

## 23. مراجعة Documentation System

```text
راجع SIGMA documentation system بالكامل للـ drift والتعارضات
```

---

## 24. تثبيت Pattern جديد في الـ Guide

```text
ثبت التعديل ده كـ canonical pattern في الـ guide وحدث الـ recipes التابعة له
```

---

## 25. معرفة الخطوة التالية

```text
ايه الخطوة الجاية حسب الـ plan الحالية؟
```

---

## 26. الاستمرار بدون أسئلة متكررة

```text
كمل حسب الخطة والـ canonical patterns لحد أول decision محتاج business input
```

أو:

```text
كمل التنفيذ حتى Phase 6 والإغلاق، وتوقف فقط عند business decision غير محسوم
```

---

## 27. الأمر المقترح لإضافة نظام العملات مستقبلًا

الخطة المؤجلة موجودة بالفعل: `reviews/Deferred/CURRENCY_EXCHANGE_RATE_MAINTENANCE_EVOLUTION_PLAN.md`.
لما تقرر تبدأ، استخدم هذا النص:

```text
اعمل Maintenance / Evolution Plan لنظام العملات.
راجع الموجود end-to-end، وحدد الـ logic الغامض والمتعارض والمفقود، واعمل Impact Map،
وحدد ما يجب Keep / Extend / Refactor / Replace / Create / Remove.
اعرض البدائل والـ trade-offs، وناقش معايا أي business decision قبل Freeze.
حدد تأثير التعديل على البيانات الحالية والمحاسبة والقيود والأرصدة الافتتاحية والعملاء
والموردين والتقارير والـ API والـ UI والمigrations.
ممنوع التنفيذ قبل اعتماد الخطة كـ Frozen.
```

---

## 28. قاعدة اختيار الأمر بسرعة

لو السؤال هو:

**"هنبني حاجة جديدة لكن مش متأكد الموجود عامل إزاي؟"**

```text
Maintenance / Evolution Plan
```

**"الميزة واضحة وعايز أراجعها من البداية للنهاية؟"**

```text
Feature Review end-to-end
```

**"عايز أعرف المشاكل فقط؟"**

```text
Review ... read-only
```

**"عايز أصلح المشاكل المؤكدة؟"**

```text
Review ... and implement confirmed fixes
```

**"خلصنا التنفيذ وعايز أتأكد إنه اتقفل صح؟"**

```text
Phase 6 Final Reconciliation
```

**"بعدّل شاشة قديمة ومعايا صورة فيها بيزنس ناقص؟"**

```text
البند 30
```

---

## 30. Refactor شاشة قديمة من صورة وإكمال البيزنس الناقص

القاعدة في Master block 2، قسم "Screenshot-backed scope from the user request".

```text
run review and refactor direct لـ <المسار أو الميزة>
الصور المرفقة: <أسماء الصور> — الحالة: <list / create / edit / view>
كمّل البيزنس الناقص الظاهر في الصور للشاشة دي بس، واعرض شكلها بنوع الشاشة المناسب من ui/screens/00-catalog.md.
أي تفصيلة ماتظهرش في الصورة: قرر بالأقرب الصحيح وسجّل القرار، إلا مسح بيانات أو صلاحيات أو أثر محاسبي.
```

إيه اللي الطلب ده بيعتمده؟

- **معتمد:** وجود الحقول والأعمدة والفلاتر والأكشن الظاهرة بوضوح في الصورة،
  وأسماءها، ومكانها في الـ workflow. الـ agent يصمم الـ contract في Phase 1
  وينفذه.
- **الـ agent بيقرر ويسجّل (قرارك الدائم، Master block 2 قاعدة 6):** نوع البيانات، والطول،
  وrequired، والـ validation، ومصدر الـ lookup، والحسابات، وانتقالات الحالة، والترقيم:
  يختار الأقرب الصحيح من الكود الموجود أو يعمل أصغر عنصر جديد، ويكتبه كـ
  *Reviewer decision* في الـ artifact.
- **مستني ردك:** مسح أو تعديل بيانات موجودة، والصلاحيات، والأثر المحاسبي.
- **مش داخل في النطاق:** أي حاجة مستنتجة أو مش واضحة في الصورة، إلا لو
  ذكرتها بالاسم.
- **بيتحافظ عليه:** أي حقل أو أكشن موجود في الشاشة الحالية ومش ظاهر في
  الصورة. الحذف محتاج طلب صريح منك.
- **شكل الصورة مش بيحدد التصميم:** نوع الشاشة والمكوّنات من الـ guide، والصورة
  بتحدد المحتوى والبيزنس بس.
- أي حقل جديد بيتخزن في الداتابيز معناه إنك هتشغّل `Add-Migration` بنفسك.

`approve reviewer assumptions` مش محتاجه هنا: القرار الدائم بيغطي نفس الحالات.
الأثر المحاسبي ومسح البيانات والصلاحيات لازم ترد عليهم بنفسك.

---

## 29. نقطة الدخول للمنظومة

للتفاصيل الكاملة ارجع إلى:

- `README.md`
- `SIGMA_FEATURE_REVIEW_MASTER.md`
- `SIGMA_UI_PATTERNS.md`
- `SIGMA_BACKEND_PATTERNS.md`
- `ui/screens/00-catalog.md` — اختيار نوع الشاشة والـ blocks المطلوبة ليه
- `recipe-system/generated/PLAN-00-maintenance-evolution.md`
- `recipe-system/generated/PHASE-00-discovery-evidence.md` إلى
  `PHASE-06-final-reconciliation.md`

هذا الملف مرجع أوامر سريع فقط؛ الـ canonical rules تظل في الـ Master Guide
والـ UI/Backend Pattern Books.
