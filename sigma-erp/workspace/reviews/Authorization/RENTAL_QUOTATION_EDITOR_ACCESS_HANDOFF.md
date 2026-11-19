# تسليم صلاحيات محرر عرض الإيجار

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-10 |
| النطاق | `RentalQuotation/components/details` فقط |
| القبول التشغيلي | معلق للمالك |

## ما نُفذ

- أضيف owner محلي لعمر محرر العرض يثبت actor وdocument key وينهي الجلسة عند
  route reuse أو A→B→A، ويفصل إلغاء القراءات عن عمر mutation المرسل، ويمرر
  `CAN_PRESENT_API_OUTCOME` ويحفظ success latch قبل حراسة النشر.
- تبنى المحرر متطلبات create/view/edit المجمدة؛ create مستقل عن View، وView
  يقرأ DTO labels وحدها دون lookups أو TaxSettings.
- قراءات create/edit الإلزامية وتفاصيل edit و
  `TaxSettings.load({ requireSuccess: true })` تعمل تحت page loader، مع
  cancellation/version/document/publication fences. الاستعادة بعد denial تحتفظ
  بالـdirty draft والـselected labels وتنتظر busy tail.
- Contact اختياري؛ غياب منحته لا يمنع حفظ `null`. قراءته تلغى عند فقد grant أو
  document lifetime ولا تنشر نتيجة متقادمة. سحب Contact يمسح labels ويغلق
  portals ويعطل selector مع حفظ id/label المختار داخليًا لنفس actor، وإعادته
  وحدها تعيد القراءة دون reset للمسودة.
- رُبطت `EditableRows` وMockData والتأكيدات والتركيز المؤجل والطباعة بعمر
  الجلسة، وأصبحت إعادة تمكين النموذج تابعة لـwrite grant وحالة المحرر.
- أضيفت مواصفات تكامل مصدرية فعلية بـ`TestBed` وfixture/spies تغطي View-only
  دون editor lookups، واستقلال Edit عن Create، وسحب/إعادة Contact، وفشل
  Staff الإلزامي، واستعادة dirty draft، وinitial-denied recovery، واستقلال
  mutation المرسل. تبقى مواصفات owner المنفصلة لعمر route/actor وoutcome fencing.
- اشتراكات denial تُربط بعد تثبيت mode/id لكل route emission، وجسم النموذج يبقى
  mounted عند denial لكنه hidden/inert. dirty regrant يحدّث الحالة السلطوية؛
  إذا لم يعد العرض قابلًا للتعديل يبقى draft محفوظًا ومعطلًا ولا يسمح Save.
- أُدرجت نتيجة `getSalesPersons()` ضمن نجاح lookups الإلزامية المطابق لمنحة
  `Staff.Lookup`، وأصبح إلغاء تأكيد الخروج بسبب denial يُصدر `false` بدل إكمال
  stream بلا قرار.
- أضيف read-interruption latch متزامن في owner الجلسة: persistent denial watcher
  يثبت فقد القراءة فورًا، ثم signal تفاعلية توقظ recovery مرة واحدة حتى إذا حدث
  revoke→regrant في tick واحد بعد اكتمال القراءة؛ ويبقى التنفيذ مؤجلًا إلى
  finalize عند وجود busy tail.
- أضيف Contact-only interruption latch مماثل داخل المكوّن: يلغي الطلب المعلق
  ويمسح labels ويغلق portals فورًا، ويحفظ selected label لنفس actor من اتحاد
  retained/current، ثم يعيد قراءة Contact مرة عند regrant في tick نفسه. لا
  يبدأ direct refresh عند full editor denial لأن `initialize()` يملك bootstrap.

## اعتماد على ملكية الجذر

يستهلك المحرر التوقيعين التاليين كما جمّده العقد، وهما ضمن ملكية الجذر:

```ts
create(payload: RentalQuotationCreateDTO, context?: HttpContext)
update(payload: RentalQuotationUpdateDTO, context?: HttpContext)
```

## ما لم يُشغّل

لم تُشغّل build أو tests أو typecheck أو lint أو browser أو DB أو migrations.
يلزم المالك قبول compilation/runtime، initial denial/regrant، route reuse،
late mutation success، loader visibility، keyboard/RTL والطباعة.

## دمج الجذر الأخير

فُصل readDenied المستمر عن readCancelled المحدود، وأضيف إلغاء دائم للطباعة
المؤجلة وتوقف recovery بعد committed. أعاد العامل المستقل قراءة التصحيحات
والمواصفات وأغلق الملاحظات المصدرية؛ التنفيذ والقبول التشغيلي باقيان للمالك.
