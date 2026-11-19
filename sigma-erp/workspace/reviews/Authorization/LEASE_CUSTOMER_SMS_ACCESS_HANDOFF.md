# تسليم صلاحيات محاكاة رسائل عملاء التأجير

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | `LEASE_CUSTOMER_SMS_ACCESS_CONTRACT_FREEZE.md` و`LEASE_CUSTOMER_SMS_CONTRACT_FREEZE.md` |
| النطاق | `SiGmaAngularFrontEnd/src/app/modules/Lease/LeaseCustomerSms/**` فقط؛ التكامل والدليل والترجمات والخلفية عند الجذر |

## التنفيذ ومطابقة العقد

تستهلك الشاشة المنحتين الفعليتين فقط:

- `LeaseCustomerSms.Search` للمسار والقائمة والبحث والمسح ومرشحات الجدول
  والصفحات والترتيب وإعادة المحاولة.
- `LeaseCustomerSms.Search + LeaseCustomerSms.Simulate` للاختيار ونص الرسالة
  والمحاكاة والنتيجة.

يبقى المضيف مركبًا لكنه `hidden` و`inert` عند فقد البحث، بينما يصبح الجدول
قابلًا للتخلص لإغلاق منافذ المرشحات. نموذج الرسالة نفسه يبقى مركبًا ومخفيًا/
خاملًا عند فقد المحاكاة، لذلك تبقى مسودة الرسالة لنفس الممثل. تُمسح القائمة
والعدد والاختيار والنتيجة المحمية فور انتهاء البحث، ويُبقي مراقب مستقل نفسه
مسلحًا بعد اكتمال الطلب وبعد دورات السحب/الإعادة السريعة. الاسترداد يطلب
القائمة مرة واحدة فقط بعد عودة المنحة، ولا يعيد فشل HTTP أو business envelope
تلقائيًا.

كل اختيار يطابق عضوية **نفس كائن الصف الحالي** داخل `data()`؛ النسخة ذات
المعرّف نفسه لا تُقبل. البحث والمرشحات والصفحات والترتيب تستخدم لقطة البحث
المطبقة، وتمسح الاختيار والنتيجة قبل الطلب الجديد. نجاح المحاكاة وحده يمسح
الاختيار والرسالة؛ الفشل يحتفظ بهما. لا يعيد regrant اختيارًا قديمًا ولا POST.

تبديل الممثل/المستأجر/سياق الفروع يمسح القائمة والعدد والاختيار والرسالة
والبحث الخام والمطبق ومرشحات الجدول والترتيب والنتيجة، ثم يبدأ قراءة جديدة
للمالك الحالي. أرقام sequence والمالك الملتقط تمنع نشر أي استجابة قديمة.
تركيز الرسالة المؤجل يستعمل `focusField` مع المنحة والسياق و`DestroyRef`، ولا
تحييه إعادة سريعة بعد إلغائه.

## الطلب والتحميل ومصادر البيانات

تستخدم القائمة والمحاكاة مالك تحميل الصفحة الواحد مع `startLoading/finalize`،
وحالة busy ورسالة خطأ وRetry، ويعلن المسار `showPageLoading: true`. يبقى مؤشر
الجدول المحلي مخفيًا لأن المضيف العام هو المالك المرئي. `GET LeaseCustomerSms`
قراءة تشغيلية مباشرة بصفحات وترتيب ومرشحات خادم؛ و`POST .../simulate` قراءة
خالصة تحمل:

- `X-Skip-Error-Interceptor: true`
- `X-Skip-Success-Toast: true`
- `NAVIGATION_READ_ONLY: true`

رأس إسكات النجاح يمنع الـinterceptor من اعتبار POST القراءة mutation وإظهار
toast ثانٍ بجانب `resultSummary` المحلية؛ تبقى نتيجة المحاكاة هي مالك النجاح
الوحيد.

لا يوجد `trackWrite` أو `CAN_PRESENT_API_OUTCOME` أو منحة كتابة أو عمر domain
write. لا مصدر lookup اختياري أو cache خاص بالشاشة، ولا invalidation/watch
جديد؛ تفضيلات MockData تظل مع مالكها المشترك ولا تُقرأ دون منحها المستقلة.
لا schema أو AutoMapper أو حساب مالي أو اقتراح index جديد. قياس الزمن وعدد
الاستعلامات وخطة SQL والظهور التشغيلي ما زالت عند المالك.

## الملفات والمواصفات

عُدلت داخل مستودع الواجهة:

`src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.ts`

`src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.html`

`src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.spec.ts`

`src/app/modules/Lease/LeaseCustomerSms/lease-customer-sms.routes.ts`

`src/app/modules/Lease/LeaseCustomerSms/services/lease-customer-sms.service.ts`

وأضيفت:

`src/app/modules/Lease/LeaseCustomerSms/lease-customer-sms-access.ts`

`src/app/modules/Lease/LeaseCustomerSms/components/list/list-access.spec.ts`

`src/app/modules/Lease/LeaseCustomerSms/services/lease-customer-sms.service.spec.ts`

أضيفت **٢٢ مواصفة مصدرية غير منفذة**: ١٩ لعمر الصلاحيات والقائمة والمحاكاة،
و٢ لعقد HTTP، و١ للقالب المركب المرفوض. تغطي غياب Search، وضع Search-only،
العضوية الكائنية الدقيقة ورفض clone، revoke/regrant للقائمة، المراقب بعد
completion، دورتين سريعتين لمراقب المحاكاة، تبديل actor، الاستجابة القديمة،
إلغاء المحاكاة، فشلي business/transport، النجاح، البحث المطبق والمرشحات/
الصفحات/الترتيب، الأعداد الدقيقة، إلغاء التركيز، والهيدر وسياق POST.

## التحقق والحدود

نجح فحص اتساق الحزم الثماني قبل الاستخدام. نجح تحليل TypeScript النحوي فقط
لثمانية ملفات داخل الملكية، وتحليل قالب Angular، ووجود الاستيرادات المحلية،
والبحث عن merge markers ورموز الكتابة المحظورة، و`git diff --check` للملكية.
رُوجعت مفاتيح EN/AR المستهلكة في المصدر الحالي دون تعديلها. تحذيرات Git كانت
عن تحويل LF إلى CRLF مستقبلًا فقط، وليست أخطاء whitespace.

لم تُشغّل builds أو tests أو دورة TDD red/green أو typecheck أو lint أو browser
أو DB أو migrations/snapshots أو commits/push/deploy. قبول المالك المعلق يشمل
compile وتشغيل المواصفات، منح Search/Simulate الحقيقية، سحب/إعادة المنح السريع،
تبديل الممثل، الإلغاء والـRetry، عدّ الصفحة، loader المرئي، RTL/theme والنطاقات
الضيقة، وقياس API/SQL.

يبقى الإرسال الفعلي ومزود الرسائل والرصيد والقالب وسجل الإرسال وقواعد الهاتف
والتقسيم وإعادة المحاولة، وكذلك خيار الاتفاقية المفتوحة المرجعي، خارج هذه
الشريحة ومحجوبًا بالقرارات المسجلة. لا تدعي الشاشة إرسالًا أو حفظًا أو رسومًا.

لم ينشئ العامل وكلاء إضافيين؛ نفذ ملكية واحدة متماسكة تحت توزيع الجذر
المحدد وفق بوابة التفويض في تعليمات Sigma.
اقتراح رسالة commit دون تنفيذ:

`fix(lease): secure customer SMS simulation access lifecycle`
