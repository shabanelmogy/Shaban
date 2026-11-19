# مراجعة InvoiceService

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| تاريخ المراجعة | 2026-10-12 |
| النطاق | `SigmaBackend/SiGma.Business/Services/VouchersServices/InvoiceService.cs` والملفات المرتبطة مباشرة به |
| نوع العمل | مراجعة ثم تنفيذ source-only؛ لا build/test/migration |
| الأدلة | المصدر الحالي، النماذج، الـ mappings، الـ controllers، والخدمات المرتبطة |
| الحوكمة | Master Guide، Backend blocks 1/3/4/5/8/14/15/18، وحزمة `PHASE-01-domain-api.md` |

## الحكم المعماري

`InvoiceBase` مناسب كجذر مشترك للحقول العامة ورابط القيد المحاسبي؛ لا أوصي بتفكيك الكيانات إلى كيانات مستقلة لمجرد اختلاف نوع الفاتورة. أوصي بفصل **الخدمات وحالات الاستخدام** مع إبقاء الجذر المشترك، وبالإبقاء على `InvoiceService.GenerateInvoices` كواجهة توافقية مؤقتة حتى لا يتغير العقد الحالي الخاص بالفوترة الجزئية في Limousine.

الهدف المقترح هو أن يصبح `InvoiceService` façade/coordinator صغيرًا، بينما تملك خدمات أو handlers مستقلة قواعد كل نوع، ويملك مكوّن محاسبي واحد بناء وإعادة بناء القيد. يجب ألا ينشأ Journal Builder ثانٍ داخل Limousine أو Tax Advance.

## أهم النتائج

| الأولوية | النتيجة | الدليل | الأثر |
|---|---|---|---|
| P0 | `InvoiceType` قابل للتغيير من العميل أثناء التعديل، رغم أنه يحدد السلوك والكيان. يمكن لتعديل فاتورة `Invoice` أن يحول discriminator إلى `AdvanceTax` أو `LimousineBulk` من دون تحويل النوع الفعلي أو تطبيق قواعد المصدر المناسبة. | `InvoiceUpdateVM.InvoiceType`، و`InvoiceService.cs:284-341`، و`InvoiceProfiler.cs:39-42` | قيد أو حساب خاطئ، ومسار تحديث لا يطابق نوع الكيان. |
| P1 | فحص الوجود الجماعي يستخدم `ExistsAsync` مع `Contains`، وهو يثبت وجود عنصر واحد فقط بدل كل العناصر. هذا يسمح بمرور batch يحتوي Customer/Agreement/Receipt مفقودًا. | `InvoiceService.cs:1457-1475` | إنشاء جزئي أو رسائل نجاح/فشل غير صحيحة، خاصة مع batch متعدد الأنواع. |
| P1 | بعض التحققات المحاسبية والمراجع تتم بعد حفظ الفواتير العادية أول مرة؛ التحقق المسبق الكامل موجود عمليًا لـ Limousine وTax Advance فقط. | `InvoiceService.cs:113-159`، مع غياب `ValidateForeignKeysAsync` لكل الفواتير قبل أول save | يخالف حدود Pattern 3 ويزيد احتمالات فشل متأخر وتعقيد rollback. |
| P1 | مسار الإنشاء العادي لا يأخذ lock خاصًا بالفاتورة/الاتفاقية؛ الـ lock يضاف فقط عند وجود Limousine أو Tax Advance. | `InvoiceService.cs:36-46` | طلبان متزامنان قد يمران من duplicate check ثم ينشئان نفس فاتورة الاتفاقية. |
| P1 | التجميع اليدوي يجمع حسب `CustomerId` فقط، ثم يأخذ `AgreementNo/ProjectId/Rate` من أول عنصر بينما يجمع مبالغ كل العناصر. | `InvoiceService.cs:1519-1546` | فاتورة واحدة قد تحمل اتفاقية أول عنصر ومبلغ عناصر اتفاقيات مختلفة. |
| P1 | الملف يجمع أربعة حدود أعمال: Rental/Lease، Limousine billing، Tax Advance recognition/allocation، وJV posting/rebuild، إضافة إلى list/delete/dispute. حجمه 1648 سطرًا وواجهة واحدة تجمع كل العمليات. | `InvoiceService.cs:18-1648`، `IInvoiceService.cs:12-20` | كل نوع جديد يضيف switch وif ومابنجات إلى نفس المسار، ويزيد خطر regression. |
| P1 | يوجد مساران للخدمة الخاصة بـ Limousine: `LimousineInvoiceService` و`InvoiceService`؛ الخدمة الخاصة تفوض الإنشاء والتعديل والحذف للخدمة العامة مع nesting لنفس أقفال الكتابة. | `LimousineInvoiceService.cs:103-177`، `InvoiceService.cs:183-202,583-589` | ownership غير واضح وlock/transaction nesting يصعب اختباره وصيانته. |
| P1 | `InvoiceBaseService` و`InvoiceBaseController` يقدمان CRUD عامًا على نوع abstract، بينما مسارات الفواتير الفعلية typed ومشتقة. | `SiGma.Business/Services/VouchersServices/InvoiceBaseService.cs`، `InvoiceBaseController.cs` | مدخل عام لا يملك قواعد نوع أو accounting lifecycle، ويمكنه تجاوز الحدود المقصودة. |
| P2 | `InvoiceProfiler` يعتمد على `ReverseMap()` ومابنجات `GenerateInvoiceRequest` إلى عدة أنواع و`InvoiceBase`. | `InvoiceProfiler.cs:30-42` | يفتح مسارات كتابة غير مراجعة ويخفي الحقول server-owned؛ يخالف قاعدة one-way maps. |
| P2 | يوجد N+1 في تحديث flags والـ JV والحفظ داخل loop، وكذلك تحقق متكرر للمراجع. | `InvoiceService.cs:117-159,383-410,1460-1469` | أداء وصعوبة تتبع transaction boundary عند زيادة حجم الـ batch. |
| P2 | رسائل كثيرة literal، وبعض المسارات تعيد `ex.Message` للعميل؛ catch filters تجعل استثناءات مسار Limousine تمر كـ 500. | `InvoiceService.cs:164-171,471-475,669-676` | عقد أخطاء غير موحّد وتسريب تفاصيل داخلية، وعدم توافق مع localized business failures. |
| P2 | `GenerateInvoiceRequest` و`InvoiceUpdateVM` يحملان حقول كل الأنواع في DTO واحد nullable/غير متجانس. | `GenerateInvoiceRequest.cs`، `InvoiceUpdateVM.cs` | حالات غير صالحة كثيرة، وvalidation موزع داخل switch بدل contract typed. |

## ما هو جيد ويجب الحفاظ عليه

- استخدام `InvoiceBase` مع TPT والأنواع المشتقة يعزل الحقول الخاصة بالنوع مع إبقاء الاستعلامات المشتركة ممكنة.
- بناء القيد يمر عبر `JournalVoucherResolver`، ويستخدم حساب العميل والإيراد والضريبة مع فحص التوازن.
- الفواتير Limousine الجزئية تستخدم pricing owner و`LimousineTotalAmount`، وهو متسق مع العقد المجمد في `LIMOUSINE_INVOICE_CONTRACT_FREEZE.md`.
- `UpdateInvoiceCoreAsync` و`RemoveInvoiceCoreAsync` يبحثان عن الـ JV من `JournalVoucherId`، ولا يعتمدان على وصف السطر.
- مسارات الإنشاء/التعديل متعددة الحفظ تستخدم transaction صريحة عندما تكون هناك فواتير وJV وflags مترابطة؛ لا ينبغي إزالة ذلك.
- Tax Advance يتحقق من مصدر Receipt وallocation والـ ledger قبل إنشاء المستند؛ هذه قواعد domain يجب أن تبقى داخل خدمة Tax Advance مستقلة.

## الأساس المقترح

### 1. طبقة مشتركة صغيرة

- `InvoiceBase` يبقى aggregate root للحقول المشتركة، `JournalVoucherId`، totals، وdispute state.
- `InvoiceAccountingService` أو `InvoiceJournalService` يملك فقط:
  - resolve accounts؛
  - بناء سطور JV؛
  - validate balance/fiscal period؛
  - save/post/rebuild/remove JV.
- لا يقرر هذا المكوّن صحة Agreement أو Trip أو Receipt، ولا يقرأ DTO خاصًا بشاشة.

### 2. خدمات حالات الاستخدام

- `RentalLeaseInvoiceService`: إنشاء/تعديل/حذف Rental وLease وقواعد Agreement وmerge.
- `LimousineInvoiceService`: candidates، pricing، partial billing، Trip flags، وتحديث/حذف Limousine. يبقى الكاتب المحاسبي المشترك نفسه.
- `TaxAdvanceService`: candidates، generate من Receipt، detail، allocate/reconcile. يخرج من `IInvoiceService` إلى interface مستقل.
- `InvoiceQueryService`: القائمة المشتركة، detail المشترك، voucher details، وربما dispute إذا كان فعلًا عامًا لكل الأنواع.

يمكن أن يبقى `InvoiceService` مؤقتًا كـ façade يوجّه حسب command إلى الخدمات السابقة، ويحافظ على endpoints الحالية. بعد ترحيل المستهلكين يمكن تقليصه أو تسميته `InvoiceCoordinator`.

### 3. Commands typed بدل DTO شامل

استخدم عقودًا منفصلة مثل:

- `CreateRentalInvoiceCommand` و`CreateLeaseInvoiceCommand`؛
- `GenerateLimousineInvoiceCommand`؛
- `GenerateTaxAdvanceInvoiceCommand`؛
- `UpdateRentalInvoiceCommand` و`UpdateLimousineInvoiceCommand`.

إذا كان endpoint القديم يحتاج `GenerateInvoiceRequest`، يبقى adapter عند حدود الـ API فقط، ويحوّله إلى command typed. `InvoiceType` يكون discriminator للـ routing أو server-owned value، ولا يُسمح بتغييره أثناء Update؛ يجب رفض mismatch بين command والنوع الفعلي للصف.

### 4. Strategy/handler عند زيادة الأنواع

بدل switch موزع في كل method، عرّف handler لكل نوع يحتاج سلوكًا خاصًا، مثل `IInvoiceTypeHandler` مع عمليات محدودة: validate request، build entity، apply source data، resolve accounting metadata. لا تستخدم handler إذا كان النوع يطابق Rental/Lease تمامًا؛ يمكن جمعهما في handler واحد.

### 5. transaction وlock

- افتح transaction/tenant lock قبل أول mutation.
- نفذ كل فحوص Agreement/Trip/Receipt وFK وaccount/fiscal period قبل أول save.
- اجعل كل writers المشاركين في نفس نوع الفاتورة يستعملون owner lock واحدًا، خصوصًا Rental/Lease وLimousine partial billing.
- لا تضف transaction داخل transaction عند تفويض `LimousineInvoiceService` إلى coordinator؛ اجعل طبقة واحدة تملك lock والـ transaction.
- حافظ على atomicity بين invoice وJV وallocation وflags.

## ترتيب التنفيذ المقترح

1. **حماية العقد الحالي (أولوية P0/P1):** اجعل النوع immutable أثناء Update، صحح `AllExist` الجماعي، وأضف lock موحدًا لمسار Rental/Lease. لا تغير endpoints أو جداول.
2. **استخراج accounting component:** انقل بناء/إعادة بناء JV إلى خدمة واحدة، مع بقاء `JournalVoucherResolver` هو posting engine، وأبقِ `InvoiceService.GenerateInvoices` adapter مؤقتًا.
3. **فصل Tax Advance:** انقل endpoints والـ allocation إلى `ITaxAdvanceService`/خدمة مستقلة، مع الحفاظ على route compatibility إن كان مستخدمًا.
4. **توحيد Limousine writer:** اجعل `LimousineInvoiceService` يملك workflow والـ lock، ويستدعي coordinator محاسبي واحدًا؛ أزل nesting والـ delegation المتبادل تدريجيًا.
5. **تقليص Rental/Lease:** اجعل `InvoiceService` أو اسمه الجديد مسؤولًا عن Rental/Lease فقط، مع query service منفصل إن بقيت القائمة mixed.
6. **تنظيف DTO/maps:** استبدل `ReverseMap` بمابات one-way typed، وأوقف mappings إلى `InvoiceBase` كعقد كتابة عام. بعد نقل المستهلكين، عطّل `InvoiceBaseController`/الخدمة العامة لأنها abstract boundary.
7. **تحسين batch:** حمّل الاتفاقيات والمراجع دفعة واحدة، ابنِ كل JVs بعد نجاح preflight، وقلل `SaveChangesAsync` داخل loops دون تغيير حدود transaction.

## قرارات لم تُحسم من المصدر

- هل Rental/Lease يسمحان بأكثر من فاتورة لنفس Agreement، أم أن Agreement يُغلق بالفاتورة الأولى؟ التعليق أعلى `InvoiceService` يثبت أن القرار ما زال مفتوحًا.
- هل merge اليدوي مقصود أن يضم أكثر من Agreement لنفس العميل؟ المصدر لا يثبت ذلك؛ لا ينبغي الإبقاء على grouping حسب العميل وحده قبل قرار صريح.
- هل `InvoiceBaseController` مستخدم خارجيًا؟ يلزم consumer search قبل تعطيله؛ لا يُحذف مباشرة.

## التحقق المطلوب قبل التنفيذ

- مراجعة كل consumers لعقود `IInvoiceService` و`InvoiceBaseController` و`GenerateInvoiceRequest`.
- إضافة اختبارات حدودية لاحقًا (بعد تفويض التنفيذ): discriminator mismatch، batch فيه عنصر مفقود، طلبان متزامنان لنفس Agreement، merge لعقدين مختلفين، وفشل JV بعد حفظ أولي.
- فحص migration فقط إذا تقرر تغيير schema؛ الاقتراح الحالي service-only ولا يحتاج migration.

## التحقق المنفذ في هذه المراجعة

- تم تشغيل فحص recipe drift: كل `plan-00` و`phase-00` إلى `phase-06` رجعت `OK`.
- تمت مراجعة حالة Git في `F:\My Work\Sigma\SigmaBackend` قبل التنفيذ، ثم حُصر التغيير في عقود وخدمات ومسارات الفواتير ذات الصلة.
- لم يتم تشغيل build أو tests أو lint أو migrations أو database أو browser أو commit/push، وفق حدود التنفيذ في تعليمات المشروع.
- تغيّر/وجود ملفات أخرى غير مرتبطة في working tree محفوظ كما هو ولم يُلمس.

## ما تم تنفيذه

- استخراج بناء ونشر قيود الفواتير إلى `IInvoiceAccountingService`/`InvoiceAccountingService` مع إبقاء `JournalVoucherResolver` هو محرك الحفظ والنشر الوحيد.
- استخراج Tax Advance إلى `ITaxAdvanceService`/`TaxAdvanceService`، مع delegates داخل `InvoiceService` حتى تبقى `IInvoiceService` و`InvoiceController` والمسارات القديمة كما هي.
- إضافة lock موحد لمسار توليد كل أنواع `InvoiceBase`، مع الإبقاء على lock Limousine الخارجي المطلوب لتزامن `TripBooking`.
- جعل `InvoiceType` immutable في update، وتحويل خرائط Invoice إلى one-way مع تجاهل `InvoiceType` في خرائط التعديل.
- تصحيح فحص batch للمراجع ليقارن عدد العناصر الفريدة الموجودة، وتقييد manual merge بهوية المصدر الكاملة، وتوحيد فشل الحفظ إلى رسالة محلية.
- إزالة الأقفال الخارجية المكررة من مسارات Limousine المفردة؛ ظل batch update يملك حدّه الذري.

## حدود التنفيذ

- لم يتغير `InvoiceBase` أو TPT أو أي schema/migration.
- لم تُنقل بعد قواعد Rental/Lease إلى خدمة مستقلة؛ بقيت داخل `InvoiceService` كـ coordinator للحفاظ على سلوك CRUD والعقد القديم، بينما فُصلت الحدود الأعلى خطورة (accounting وTax Advance) الآن.
- يلزم build/test لاحقًا في بيئة تسمح بهما؛ التحقق الحالي source-level ومراجعة consumers وDI registration.
