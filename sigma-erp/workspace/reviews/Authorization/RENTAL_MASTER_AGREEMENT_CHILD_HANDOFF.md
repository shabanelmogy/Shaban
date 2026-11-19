# تسليم صلاحيات طفل عقد الإيجار من الاتفاقية الرئيسية

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ١٠ نوفمبر ٢٠٢٦ |
| العقد | [عقد الوصول المجمّد](RENTAL_MASTER_AGREEMENT_ACCESS_CONTRACT_FREEZE.md) |
| النطاق | محرر `RentalAgreement` المضمّن وخدمة كتابته فقط؛ لا ترقية عامة للوحدة |

## متطلب الفتح ومالكو القراءات

أضيف المتطلب المستقل `rentalAgreementOpeningAccess.open` بالمفاتيح الفعلية:

```text
RentalMasterAgreement.View
RentalAgreement.Create
SettingsCommonModel.GetMySetting
RentalAgreement.GetVehicleTypes
Booking.Options
Customer.Lookup
RentalAgreement.GetProjects
RentalMasterAgreement.Lookup
Country.Lookup
Tariff.GetBookingCharges
```

لا يتضمن المتطلب `RentalAgreement.View` ولا `RentalQuotation.View` ولا
`GetOpeningSource` غير الموجود. يقرأ الطفل مصدر الافتتاح المحفوظ من
`MasterAgreementService.getDetail` تحت `RentalMasterAgreement.View`، ثم
يستعمل مالكي الخيارات الحاليين: إعدادات الضريبة، أنواع المركبات،
`Booking.Options`، العملاء، المشروعات، قائمة الاتفاقيات، البلدان، والتعرفة.
لا cache جديد ولا API صلاحيات أو قراءة مصدر مخترعة.

## عقد الطفل وعمر الجلسة

تبنى المحرر المدخلات الاختيارية نفسها المستعملة في Lease:
`accessRequirement` و`sourcePublicationAllowed` و`sourceCancelled$`.
عند غيابها يبقى سلوك المحرر المستقل كما كان ولا يفرض متطلبًا عامًا جديدًا.
يعرض الطفل للأب `sourceAccessBlocked` و`editorBusy`، ويبقي `dialogBusy()`
غلاف التوافق الحالي.

يُثبت actor وهوية `masterAgreementId/quotationItemId` عند التركيب. تغير
الممثل أو المورد أو مدخل المتطلب أو notifier الأب ينهي الجلسة نهائيًا؛
سحب المنح للممثل نفسه يقطع القراءات مؤقتًا ويغلق select/date-picker portals
والطباعة المؤجلة والتركيز والقرارات وحوار split، ثم يعيد bootstrap عند
عودة المنح. يمرر الطفل نفس عمر الإلغاء ومنحة النشر إلى MockData وإلى
`EditorDialog` الفرعي.

يحجب القالب المحتوى المحمي دون تدمير النموذج. يبقى الإلغاء المحلي لمسودة
dirty متاحًا بعد المنع، ولا يغلق حوارًا فيه كتابة جارية. حفظت إعادة المنحة
قيم المسودة والخيارات المنتقاة غير الموجودة في النتائج الجديدة، ولا تعيد
defaults أو charges أو تعرفة مكتملة. إذا كان طلب التعرفة قيد الانتظار أو
التنفيذ عند السحب يعاد مرة واحدة بعد الاسترداد.

تعيد كل قراءة جديدة للمصدر، بما فيها قراءة الاسترداد، التحقق من أن الاتفاقية
الرئيسية ما زالت `Approved` وأن هوية الماستر والعرض والبند والعميل متطابقة.
فشل هذا التحقق يسجل `openingContextError` ويبقي النموذج معطّلًا والمسودة
المركبة دون استبدال، لذلك لا يمكن حفظ مصدر سُحب اعتماده أثناء الانقطاع.

## الكتابة المرسلة والطباعة

تقبل `createAgreement` و`updateAgreement` الآن `HttpContext` اختياريًا دون
تغيير المستهلكين الحاليين. كتابة المصدر المرسلة لا ترتبط بعمر المكون أو
سحب الوصول؛ تستكمل نتيجتها المستقلة، بينما يحمل الطلب
`CAN_PRESENT_API_OUTCOME` بدالة تصبح false عند السحب أو تغير الممثل/المورد
أو destroy. يثبت نجاح الكتابة أولًا كحالة terminal ويمنع إعادة الحفظ، ثم
يفحص حق النشر قبل إظهار نتيجة أو إغلاق الحوار.

انتقلت الطباعة إلى session مملوكة للمكون من `ReportPrintService.createSession`؛
يلغى frame التحضير عند منع الوصول، ولا توجد دعوة قديمة إلى
`reportPrint.print` في النطاق.

## الملفات والمواصفات

الملفات المعدلة أو المضافة ضمن الملكية:

- `src/app/modules/Rental/Agreement/components/details/details.component.ts`
- `src/app/modules/Rental/Agreement/components/details/details.component.html`
- `src/app/modules/Rental/Agreement/components/details/master-agreement-source-access.spec.ts`
- `src/app/modules/Rental/Agreement/services/agreement.service.ts`
- `src/app/modules/Rental/Agreement/services/agreement-source-access.spec.ts`
- `src/app/modules/Rental/Agreement/rental-agreement-opening-access.ts`

تغطي المواصفات المصدرية القائمة الدقيقة للمفاتيح، عدم اشتراط عرض العقود،
إلغاء القراءة القديمة وإعادة القراءات، حفظ المسودة والخيار المنتقى، عدم
إعادة التعرفة المكتملة، الانتهاء عند تغير actor أو tuple، الإلغاء المحلي
بعد المنع، إلغاء split والطباعة وMockData، استقلال الكتابة المرسلة وسياق
نتيجتها وterminal success، رفض المصدر الذي فقد الاعتماد مع حفظ المسودة،
وبقاء السلوك المستقل. لم تُشغّل المواصفات.

## المراجعة والقبول المعلق

روجعت فروق الملفات المحددة ومراجع Lease، ولم يبق استعمال مباشر للطباعة
القديمة أو `takeUntil(cancelledReads)` خارج سياج المصدر. نجح
`git diff --check` على ملفات النطاق. لم يُشغّل build أو test أو typecheck أو
lint أو browser أو database أو migration التزامًا بمنع التنفيذ؛ القبول
التشغيلي كله معلق للمالك.

يستخدم `tsconfig.app.json` قائمة `files` صريحة، والملف الجديد
`rental-agreement-opening-access.ts` مستورد الآن من محرر الأب. إضافة الملف
إلى القائمة أتمّها الجذر للملفين التشغيليين الجديدين، دون تضمين مواصفات
الاختبارات أو إضافة include واسع. لم يعد هذا البند معلقًا في تكامل المصدر.

راجعت تكامل الأب قراءةً فقط. الربط الثلاثي وحفظ جلسة الطفل والإغلاق أثناء
المنع والكتابة المرسلة وcreate-only access صحيحة. أبلغت مالك الأب والجذر
بضرورة جعل `rentalSourcePublicationAllowed` يعتمد أيضًا على `sourceReady()`
حتى لا يسترد الطفل bootstrap قبل انتهاء إعادة تحقق الأب من اعتماد الماستر
وبقاء البند بعد سحب وإعادة `RentalMasterAgreement.View`. لم أعدل ملفات الأب.

