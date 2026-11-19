# تسليم صلاحيات حوارات اتفاقية الإيجار الداعمة

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| النطاق | الرسوم الإضافية والخصومات وتعليمات الدفع والإبطال وتاريخ التسليم واستبدال السائق وسجل الفوترة وسجل الإجراءات فقط |

## العقد والمراجع

طُبق العقد المجمد في
`LEASE_AGREEMENT_ACCESS_CONTRACT_FREEZE.md`، ونتائج
`LEASE_AGREEMENT_DIALOGS_INDEPENDENT_AUDIT.md`، وكتل UI13/26/28/27/22/2.
قُرئت قواعد مساحة العمل الحية ومهارة Sigma، ومدخل وثائق Sigma وفهرس المراجعات،
ومدخل Speed وقسم Lease المؤرخ ٢٨ أكتوبر. تفاصيل Agreement الوظيفية وشرح Speed
وكوده وOdoo19 سبق تثبيتها داخل العقد المجمد ولم تُغيّر هذه الشريحة أي عقد أعمال
أو سياسة مالية أو منحة. الشكل UI09 action/supporting dialog؛ لا تغيير خلفي أو
schema أو دليل شاشة أو جرد وحدة في ملكية هذا العامل.

## المنح والملفات

| الحوار | القراءة | الكتابة |
|---|---|---|
| Additional Charges | `LeaseAgreement.View + GetAdditionalCharges` | `UpdateAdditionalCharges` |
| Discounts | `LeaseAgreement.View + GetDiscounts` | `UpdateDiscounts` |
| Payment Instructions | `LeaseAgreement.View + GetPaymentInstructions` | `UpdatePaymentInstructions` |
| Void | `LeaseAgreement.View + Void` | `Void` |
| Delivery Date | `LeaseAgreement.View + GetDeliveryDateContext` | `UpdateDeliveryDate` |
| Driver Replacement | `LeaseAgreement.View + GetDriverReplacementContext` | `ReplaceDriver` |
| Billing History | `LeaseAgreement.View + GetBillingHistory` | لا توجد |
| Logs | `LeaseAgreement.View + GetLogs` | لا توجد |

عُدلت ملفات المكوّن والقالب داخل المجلدات الثمانية فقط، وأضيفت مواصفة
`logs-dialog-access.spec.ts`. لم يُلمس helper أو الحوارات المستثناة أو القائمة
أو الخدمة أو السجل أو الدليل.

## العمر والاستعادة والنشر

- أصبحت كل قراءة مرتبطة بـ`readCancelled$()` و`takeUntilDestroyed`، وتتحقق من
  هوية المستند ونسخة الطلب و`canPresent(true)` قبل نشر DTO أو الصفوف أو الخطأ.
- تملك المكونات مراقب منع قراءة مستمرًا مستقلًا عن notifier الطلب المحدود، لذلك
  لا تضيع دورة revoke/regrant ثانية بعد الاستعادة الأولى، ولا يبدأ أي load من
  Retry أو recovery قبل إعادة فحص `canRead()`.
- صار `finalize` يحرر تحميل الحوار للنسخة الحالية فقط. تبقى القراءات محلية،
  وتبقى الكتابات على مالك التحميل العام، ولا يعتمد عمر الكتابة المرسلة على destroy.
- مُرر `Injector` إلى كل session، فأصبحت استعادة initial-denied أو revoke/regrant
  لنفس الممثل فعالة. latch الانقطاع لا يضيع إذا حدثت الاستعادة أثناء حفظ أو قرار؛
  يُستهلك مرة بعد نهاية busy tail ولا يعيد قراءة بعد success latch.
- الاستعادة تحدث مرة عند الحاجة. الرد القديم وخطؤه لا ينشران، والتبديل A→B→A
  أو تغير هوية المستند يظل terminal من مالك session.
- عند وجود dirty draft تُحدّث contract/options/context اللازمة فقط ولا يعاد patch
  قيم الرسوم أو الخصومات أو الشيكات أو تاريخ التسليم أو اختيار السائق.
- سحب write وحده يبقي DTO/read-only display والمسودة، ويغلق عناصر التحرير. عودة
  write تعيد إتاحة نفس المسودة دون إعادة hydration؛ effect محدود بمراجعة الوصول
  يعطّل Reactive Form نفسه عند المنع ويعيد تمكينه عند عودة الكتابة، لا القالب فقط.

## البوابات والتركيز والكتابة

- أضيفت ملكية `viewChildren(Select/DatePicker)` للحـوارات التي تستخدم
  `appendTo="body"`، وتُغلق البوابات عند فقد القراءة أو الكتابة عبر `hide()` و
  `hideOverlay()`.
- حُرست microtasks الخاصة بالتركيز قبل DOM query، مع notifier عمر الكتابة.
- أخطاء الكتابة المتأخرة لا تُنشر إلا عند `canPresent()`؛ success يثبت
  `markCommitted()` قبل publication fence. لا توجد `takeUntilDestroyed` على
  الكتابات المرسلة، وسياق `CAN_PRESENT_API_OUTCOME` يأتي من session.
- MockData يبقى مربوطًا بمتطلب الكتابة ودالة النشر وإشارة الإلغاء. تجاهل Void
  صار lazy عبر `defer`، ويبقى التجاهل المحلي متاحًا بعد المنع دون منحة كتابة.

## المصادر والأداء والكاش

قراءات الحوارات الثمانية direct operational/document reads وليست مصادر lookup
مؤهلة لكاش UI2؛ لم يُنشأ cache أو watch موازٍ. لا توجد query/index أو API جديدة،
ولا ادعاء تحسين سرعة مقاس. القياس التشغيلي وتوقيت الشبكة عند المالك. القراءة
المحلية والكتابة العامة تطابقان UI22، مع Retry والحالة الحاليةين.

## المواصفات والتحقق

أضيفت مواصفات مصدرية غير منفذة لسجل الإجراءات تغطي initial-denied ثم regrant
مرة واحدة، إلغاء الرد القديم ونشر recovered response فقط، وانتهاء A→B→A.
كما تغطي بقاء مراقبة revoke/regrant فعالة لدورة لاحقة بعد الاستعادة الأولى.
بقية أعمار الكتابة وsuccess latch وMockData مغطاة بمواصفات helper/الخدمة القائمة؛
تظل مواصفات هذه الشريحة والـbuild/typecheck/lint/runtime/browser غير منفذة وفق
الحد المصدرّي.

فحص الوصفات الثماني أعاد `OK` لكل الحزم. فحص `git diff --check` المحدد لمجلدات
الحوارات لم يسجل أخطاء whitespace؛ ظهرت تحذيرات تحويل LF/CRLF فقط. روجع diff
المحدد مع الحفاظ على تغييرات الزملاء. لا هجرة ولا `ModelSnapshot` ولا تشغيل قاعدة
بيانات ولا commit/push/deploy. لا يعلن هذا التسليم اكتمال وحدة LeaseAgreement أو
تطبيق الصلاحيات كله.
