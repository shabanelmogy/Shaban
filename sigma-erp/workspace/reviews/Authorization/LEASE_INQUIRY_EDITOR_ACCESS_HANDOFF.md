# تسليم صلاحيات محرر استفسارات التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | محرر استفسار التأجير فقط: العرض والإنشاء والتعديل والبنود والاختيارات وقرار الخروج |
| العقد | LEASE_INQUIRY_ACCESS_CONTRACT_FREEZE.md |
| مسؤولية التكامل | الجذر؛ لا يثبت هذا التسليم اكتمال وحدة LeaseInquiry أو هدف الصلاحيات كاملًا |

## الملفات والملكية

عُدّل الملفان:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseInquiry/components/details/details.component.ts`

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseInquiry/components/details/details.component.html`

وأضيفت المواصفة المصدرية:

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseInquiry/components/details/details-access.spec.ts`

بقي `details.component.scss` و`details.component.spec.ts` دون تعديل. لم تُعدّل
خدمة الميزة أو helper الصلاحيات أو registry أو القائمة أو stage أو logs أو
المسارات أو نماذج الواجهة أو الخلفية أو الدليل أو ملفات الترجمة. حُفظت تغييرات
الجذر والزملاء القائمة خارج الملكية.

## المطابقة المصدرية

| الجانب | النتيجة في المصدر |
|---|---|
| العرض | يتطلب `LeaseInquiry.View` فقط، ويقرأ التفاصيل دون اختيارات تحرير |
| الإنشاء | يتطلب `LeaseInquiry.Create` مع `CarModel.GetMakeAndModelDropdown` و`Staff.Lookup` و`Customer.Lookup` و`VehicleType.Lookup`؛ لا يضيف View |
| التعديل | يتطلب View وUpdate ومصادر الإنشاء الأربعة؛ لا يُفعّل Save قبل نجاحها |
| جهة الاتصال | `Contact.GetSelectByCompany` اختيارية؛ لا طلب عند غيابها، ويُعطل الحقل مع حفظ ID والتسمية والقيمة في payload الخام |
| كاش العميل | bootstrap ناجح محدود ثم watch مستقل عبر `ReferenceLookupBindings`؛ السحب والإعادة السريعان يعيدان bootstrap/watch |
| هوية التفاصيل | الطلب مقيد بالممثل والجلسة والمعرّف والـsequence، وتُرفض استجابة ناجحة إذا كان `entity.id` مختلفًا قبل ترطيب النموذج |
| عمر المسودة | تغيير الممثل أو استبدال `mode/inquiryId` على المثيل المركب ينهي الجلسة ويخفيها ويجعلها خاملة دون مسح المسودة أو ترطيب سجل بديل |
| الاستعادة | سحب منح الجلسة نفسها يلغي القراءات ويحفظ القيم المختارة؛ الإعادة تستأنف بعد نهاية busy دون حلقة إعادة لفشل HTTP |
| الحفظ المرسل | يستخدم `trackWrite` و`HttpContext` و`CAN_PRESENT_API_OUTCOME`، وهو مستقل عن الإغلاق/السحب؛ success latch يسبق فحص النشر ولا يعاد POST/PUT |
| الخروج | `canDeactivate(): boolean | Observable<boolean>` عام ويخدم Close نفسه؛ القرار lazy وقابل للإلغاء، وdiscard المحلي متاح بعد denial |
| القراءات المؤجلة | إغلاق الحوار أو View يلغي قراءة التفاصيل، وتُغلق overlays عند الإلغاء أو انتهاء الجلسة |
| الواجهة | `EditorDialog` يستهلك `accessRequirement/accessBlocked` فيحجب المحتوى المركب ويجعله inert؛ زر Edit في View لا يظهر دون عقد Edit كامل |
| الأعداد | بقي `quantity` و`periodYears` عددين صحيحين بحدود Int32؛ لا تغيير لعقد الدقة |

## مصادر البيانات والتحميل

| المصدر | التصنيف والعمر |
|---|---|
| `LeaseInquiry/GetByWithNavigationsId/{id}` عبر `getDetails` | قراءة dialog مباشرة، مرة لكل هوية سليمة؛ قابلة للإلغاء وتتحقق من معرّف الكيان قبل النشر |
| `CarModel/GetMakeAndModel` | اختيار تحرير مباشر مطلوب؛ لا كاش جديد |
| `Staff/GetSelect` | اختيار تحرير مباشر مطلوب؛ لا كاش جديد |
| `Customer/GetSelect` | bootstrap مطلوب من مالك الخدمة ثم watch cache مستقل مع Retry/clear وحفظ الاختيار الحالي |
| `VehicleType/GetSelect` | اختيار تحرير مباشر مطلوب؛ لا كاش جديد |
| `Contact/GetSelectByCompany` | قراءة اختيارية مرتبطة بالعميل والمنحة؛ watcher وصول مستمر بعد اكتمال القراءة |
| POST/PUT | كتابة مستقلة مع سياق نشر محروس بهوية الممثل والسجل والوضع والجلسة |

القراءات المطلوبة تستخدم التقدم المحلي الموجود وتمنع التحرير حتى نجاحها.
فشل جهة الاتصال الاختيارية لا يمنع حفظ بقية البيانات. لا يدعي wiring المصدر
قياس سرعة أو تحقق ظهور loader/portal فعليًا؛ يظل ذلك قبولًا تشغيليًا معلقًا.

## الأدلة والفحوص

استهلك التنفيذ عقد الصلاحيات المجمد ومهارة Sigma ومراجع Angular المحددة،
واستفاد من نمط العمر المجمد في محرر Provisions ومن ملاك
`AccessViewPolicyService` و`AdministrativeDefinitionSession` و`EditorDialog`
و`ReferenceLookupBindings` و`EditableRows` و`focusField`.

فُحص parsing لملفي TypeScript المعدل والمواصفة الجديدة عبر TypeScript parser،
وفُحص قالب Angular عبر `parseTemplate`، وفُحص حل جميع imports في الملفين،
وفُحص `git diff --check` وscoped diff لمجلد المحرر. النتيجة المصدرية بلا
مشكلات في هذه الفحوص.

أضيفت **١٨ مواصفة مصدرية غير منفذة** تغطي منح View/Create/Edit، ومصادر
التحرير الدقيقة، ومسودة الممثل والسجل، وكاش العميل، وجهة الاتصال الاختيارية،
والسحب/الإعادة السريعة، والكتابة المرسلة ونجاحها المحجوب، وقرار discard،
وإلغاء View، ومعرّف استجابة التفاصيل المخالف، والمعرّف المشوه. لا مفاتيح
ترجمة جديدة أو مفقودة نتجت عن هذه الشريحة.

## ملحق متابعة تدقيق المحرر

عولجت findings التدقيق الأربعة داخل ملكية `components/details` فقط:

- أصبح قبول discard حالة نهائية reactive مستقلة؛ يعطل النموذج ويحجب Save
  وAdd وRemove حتى يغلق الحوار، حتى إذا أُلغي الانتقال بعد قبول القرار.
- تحفظ دورة السحب/الإعادة لنفس الممثل labels وIDs المختارة حاليًا للعملاء
  والموظفين والموديلات والأنواع وجهة الاتصال. تبقى الخيارات الجديدة عند
  bootstrap فارغ وتصل القيم نفسها إلى payload؛ تفاصيل الأصل لا تستبدل label
  أحدث للاختيار الحالي.
- يمرر `appMockData` متطلب Create/Edit الفعلي عبر
  `mockDataAccessRequirement`، فيلغي المالك المشترك generation/preview عند
  سحب Update ولو بقيت View ومنح MockData.
- أصبح subtitle مشتقًا من جلسة غير محجوبة ومن `details.id` المطابق لهوية
  الحوار المركبة؛ لا يبقى رقم السجل ظاهرًا عند منع الوصول أو تبدل الممثل.

أضيفت مواصفات الانحدار الثلاث الجديدة للحالة النهائية بعد discard، وحفظ كل
الاختيارات الحالية عبر rapid revoke/regrant مع bootstrap فارغ وpayload،
وبقاء متطلب Edit كاملًا عند سحب Update. توسعت مواصفة الممثل القائمة لتثبت
حجب subtitle. أُعيدت فحوص TypeScript parser وAngular template parser وحل
imports و`git diff --check` بعد المتابعة؛ بقيت حدود التشغيل كما هي بلا
build/tests/typecheck/lint/browser أو ادعاء نتائج تشغيلية.

هذه الفحوص ليست type checking أو build أو نتائج tests، ولا يُدعى RED/GREEN.
لم تُنفذ builds/tests/typecheck/lint/browser/DB/migrations/snapshots/commit/
push أو نشر، ولم يُستخدم وكلاء فرعيون.

## المتبقي عند الجذر والمالك

يتولى الجذر دمج helper والخدمة والقائمة وstage/logs والمسارات والـregistry
والخلفية والدليل والترجمات، ثم المطابقة النهائية والتدقيق المستقل. يلزم قبول
تشغيلي لصلاحيات الممثل، والفتح والإغلاق السريع، وrapid revoke/regrant، ومنع
إعادة الكتابة، والـRTL والثيمين والمقاسات والـportals. يلزم تشغيل البناء
والاختبارات والتحقق النوعي فقط عند تفويض المالك؛ المصدر الحالي لا يثبت نجاحها.

رسالة commit مقترحة عند دمج الواجهة بواسطة المالك:

`fix(lease): enforce inquiry editor access lifetimes`
