# دورة الإيجار والتأجير طويل الأجل

هذا الملف يرتب قراءة واجهة «سبيد» بحسب فرعي القائمة الجانبية: الإيجار والتأجير طويل الأجل. الأدلة من نسخة جافاسكربت المستخرجة محلياً في ٢٨ أكتوبر ٢٠٢٦، ومن سجل ربط القوالب البنيوي الذي أعده مسار التحليل الرئيسي. لم يُنفذ جافاسكربت الهدف ضمن هذا التحليل، ولم تُستدعَ خدمات أعماله، ولم يُفحص كود الخادم أو نظام سيجما.

**المشاهَد** أدناه يعني تعريفاً أو شرطاً أو استدعاءً موجوداً في النص الساكن. **المستنتَج** يعني ترتيباً تجارياً ترجحه وصلات الواجهة؛ لا يعني أن مستخدماً نفذه أو أن الخادم يفرضه. روابط المصادر نسبية إلى هذا الملف داخل مجلد التحليل، وتنتهي برقم سطر في النسخة المقروءة؛ رأس كل نسخة يحدد موضع التسجيل في الملف الأصلي.

## خريطة القائمة التي تنظم القراءة

مرجع الترتيب هو [فرع الإيجار](../data/active-menu.json#L708) و[فرع التأجير طويل الأجل](../data/active-menu.json#L798). هذه القائمة نفسها مشتقة من فروع القائمة والقيم الملتقطة للميزات والصلاحيات؛ ليست مشاهدة للشاشة أثناء التشغيل، وفق [وصف مصدر القائمة](../data/active-menu.json#L1).

| البند حسب ترتيب القائمة | الحالة والمسار | نقطة القراءة الأساسية |
|---|---|---|
| الإيجار ← التعريفة | `tenant.crs_rentalTariff` — `/crs/rentalTariff` | صفحة مجموعات التعريفة المشتركة؛ [تعريف المسار](../raw/application.js#L3474)، والمتحكم `tenant.views.crs.tariffGroups.index`، النسخة `C1132` |
| الإيجار ← بطاقات التعريفة | `tenant.crs_tariffCards` — `/crs/tariffCards` | المتحكم `tenant.views.crs.tariff.tariffCards.index`، النسخة `C1129`؛ [تعريف المسار](../raw/application.js#L3458) |
| الإيجار ← العروض | `tenant.crs_rentalQuotation` — `/crs/rental/quotations` | المتحكم `tenant.views.crs.rental.quotations.index`، النسخة `C0958`؛ [تعريف المسار](../raw/application.js#L4212) |
| الإيجار ← العقود الرئيسية | `tenant.crs_rentalMasterAgreements` — `/crs/agreement/masterAgreements` | المتحكم `tenant.views.crs.rental.masterAgreements.index`، النسخة `C0950`؛ [تعريف المسار](../raw/application.js#L4285) |
| الإيجار ← الحجوزات | `tenant.crs_bookings` — `/crs/bookings` | المتحكم **`tenant.views.bookings.index`**، النسخة `C0663`؛ [تعريف المسار](../raw/application.js#L3692) |
| الإيجار ← المخطط | `tenant.crs_rentalPlanner` — `/crs/rentalPlanner` | المتحكم **`tenant.views.rentalplanner.index`**، النسخة `C0964`؛ [تعريف المسار](../raw/application.js#L3676) |
| الإيجار ← العقود | `tenant.crs_agreements` — `/crs/agreements` | المتحكم **`tenant.views.agreements.index`**، النسخة `C0539`؛ [تعريف المسار](../raw/application.js#L3528) |
| الإيجار ← ساعات السائق | `tenant.crs_driverTimeSheetForAgreement` | المتحكم `tenant.views.crs.driverTimeSheetForAgreement.index`، النسخة `C0780`؛ [تعريف المسار](../raw/application.js#L3683) |
| التأجير طويل الأجل ← التعريفة | `tenant.crs_leaseTariff` — `/crs/leaseTariff` | نفس قالب مجموعات التعريفة؛ [تعريف المسار](../raw/application.js#L3466) |
| التأجير طويل الأجل ← معاملات التكلفة | `tenant.crs_costingParameters` | المتحكم `tenant.views.crs.lease.costingParameters.index`، النسخة `C0862` |
| التأجير طويل الأجل ← إعداد التكلفة | `tenant.crs_costingSetup` | المتحكم `tenant.views.crs.lease.costingSetup.index`، النسخة `C0864` |
| التأجير طويل الأجل ← الاستفسارات | `tenant.crs_leaseInquiries` — `/crs/lease/leaseInquiries` | المتحكم `tenant.views.crs.lease.leaseInquiries.index`، النسخة `C0868`؛ [تعريف المسار](../raw/application.js#L4230) |
| التأجير طويل الأجل ← العروض | `tenant.crs_leaseQuotations` — `/crs/lease/leaseQuotations` | المتحكم `tenant.views.crs.lease.leaseQuotations.index`، النسخة `C0878`؛ [تعريف المسار](../raw/application.js#L4203) |
| التأجير طويل الأجل ← العقود الرئيسية | `tenant.crs_masterAgreements` — `/crs/lease/masterAgreements` | المتحكم `tenant.views.crs.lease.masterAgreements.index`، النسخة `C0886`؛ [تعريف المسار](../raw/application.js#L4279) |
| التأجير طويل الأجل ← العقود | `tenant.crs_leaseAgreements` — `/crs/lease/Agreements` | المتحكم **`tenant.views.lease.agreements.index`**، النسخة `C0849`؛ [تعريف المسار](../raw/application.js#L4261) |
| التأجير طويل الأجل ← البنود | `tenant.crs_clauses` — `/crs/clauses` | المتحكم `tenant.views.lease.clauses.index`، النسخة `C0860`؛ [تعريف المسار](../raw/application.js#L4267) |
| التأجير طويل الأجل ← رسائل العملاء | `tenant.crs_smsToLeaseCustomer` | المتحكم `tenant.views.crs.lease.smsToLeaseCustomer.index`، النسخة `C0893` |

المشاهَد أن تعريفات المسارات تشير إلى قوالب خادمية، وكثير منها لا يسمي المتحكم داخل تعريف المسار. جرى تثبيت ربط شاشات القائمة بالمتحكمات من سمات القوالب في [سجل ربط القوالب](../data/template-bindings.json)، الملتقط بواسطة طلبات قراءة موثقة دون تنفيذ أنجولار ودون الاحتفاظ بالنص الخام للقوالب. هذا إثبات للربط البنيوي، وليس لتشغيل سير الأعمال. اختلاف أسماء متحكمات الفهارس عن أسماء مجلدات النوافذ مهم عند البحث.

للتنقل إلى فهارس الإجراءات والخدمات التفصيلية، افتح [ملفات شاشات الإيجار](../sidebar/09-rental/README.md) أو [ملفات شاشات التأجير طويل الأجل](../sidebar/10-lease/README.md). أهم نقاط متابعة الدورة هي [الحجوزات](../sidebar/09-rental/screens/05-bookings.md)، و[عقود الإيجار](../sidebar/09-rental/screens/07-agreements.md)، و[عقود التأجير](../sidebar/10-lease/screens/07-agreements.md)، ثم [الفواتير](../sidebar/18-vouchers/screens/01-invoices.md)، و[الإيصالات](../sidebar/18-vouchers/screens/04-receipts.md)، و[التأمينات](../sidebar/18-vouchers/screens/05-deposits.md).

## أولاً: دورة الإيجار

### تجهيز السعر ثم إصدار عرض

المشاهَد أن بيانات التعريفة وبطاقاتها مدخلات للتسعير؛ محرر العقد يطلب البطاقات الفعالة بحسب الفترة، ويجلب تفاصيل البطاقة المختارة. فهرس مجموعات التعريفة يقرأ نوعه من معاملات الحالة ويستعمل خدمة مجموعات التعريفة، ولذلك لا يصح اعتبار وجود مسارين دليلاً على وجود نظامي تعريفة مستقلين. المصدر: [نوع التعريفة](../readable/controllers/C1132--tenant.views.crs.tariffGroups.index.js#L17)، و[قراءة مجموعاتها](../readable/controllers/C1132--tenant.views.crs.tariffGroups.index.js#L112)، و[بطاقات محرر العقد](../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js#L218).

المشاهَد أن عرض الإيجار يجمع العميل وبنوداً يمكن زيادتها وحذفها، ومجموعة التعريفة والكمية والفترة وبنود الرسوم والخصم والضريبة. في الحساب المحلي، بعض أنواع الرسم تضرب السعر في الكمية، وبعضها يضربه أيضاً في الفترة. عند الحفظ يعيد المحرر حساب البنود ويرسل العرض للخادم، أو يرسل نسخة مراجعة مرتبطة بمعرف العرض السابق. **لا تثبت هذه الحسابات سياسة السعر النهائية على الخادم.** المصدر: [تركيب البند](../readable/controllers/C0957--tenant.views.crs.rental.quotations.createOrEditQuotationModal.js#L422)، و[الحساب والحفظ](../readable/controllers/C0957--tenant.views.crs.rental.quotations.createOrEditQuotationModal.js#L681).

| المرحلة | المتحكم الكامل | الإجراء في الواجهة | الخدمة والطريقة |
|---|---|---|---|
| تحميل العرض أو نسخة المراجعة | `tenant.views.crs.rental.quotations.createOrEditQuotationModal` | `init` | `rentalQuotation.getQuotationForEdit` أو `getQuotationForRevision` |
| حفظ العرض | نفس المتحكم | `save` | `rentalQuotation.createOrUpdateQuotation` أو `reviseQuotation` |
| قراءة قائمة العروض | `tenant.views.crs.rental.quotations.index` | `getRentalQuotations` | `rentalQuotation.getQuotations` |
| الموافقة الداخلية | نفس متحكم القائمة | `approveQuotation` | `rentalQuotation.approveQuotation` |
| الرفض الداخلي | نفس متحكم القائمة | `rejectQuotation` | `rentalQuotation.rejectQuotation` مع سبب الرفض |
| موافقة العميل أو رفضه | نفس متحكم القائمة | `approveQuotationByCustomer` / `rejectQuotationByCustomer` | الطريقتان بالاسم نفسه في `rentalQuotation` |

المشاهَد أن الموافقة الداخلية وموافقة العميل حقلان منفصلان. تتيح الواجهة موافقة العميل بعد الموافقة الداخلية، وتتيح المراجعة عند الموافقة الداخلية مع بقاء قرار العميل معلقاً وتوافر الصلاحية. إنشاء العقد الرئيسي يتطلب موافقة الطرفين، والميزة والصلاحية وعدم وجود عقد رئيسي منشأ. إنشاء أمر بيع له شرط إضافي هو كون العميل شركة. المصدر: [شروط العقد الرئيسي](../readable/controllers/C0958--tenant.views.crs.rental.quotations.index.js#L75)، و[شروط أمر البيع والمراجعة](../readable/controllers/C0958--tenant.views.crs.rental.quotations.index.js#L198)، و[قائمة الإجراءات](../readable/controllers/C0958--tenant.views.crs.rental.quotations.index.js#L230)، و[تنفيذ الموافقات والرفض](../readable/controllers/C0958--tenant.views.crs.rental.quotations.index.js#L660).

### مسار العقد الرئيسي من العرض

المشاهَد أن إجراء إنشاء العقد الرئيسي يمرر معرف العرض ورقمه والعميل والتاريخ إلى نافذة عقد الإيجار الرئيسي. تضع النافذة بداية الفوترة على الوقت الحالي، وتتيح ربط أمر بيع، ثم تستدعي خدمة العقد الرئيسي. المصدر: [الفتح من العرض](../readable/controllers/C0958--tenant.views.crs.rental.quotations.index.js#L378)، و[الربط والحفظ](../readable/controllers/C0949--tenant.views.crs.rental.masterAgreements.createOrEditModal.js#L22).

المشاهَد أن تفاصيل العقد الرئيسي تحتوي جداول بنود، ويمكن فتح محرر عقد تشغيلي من صف في الجدول. تمرر الواجهة العميل، ومعرف العقد الرئيسي، والأسعار، ونوع المركبة وطرازها، وأمر البيع، ومرجع العميل، والضريبة، وخيار تجاوز تحميل التعريفة. بعد نجاح إنشاء العقد تحفظ معرفه في صف الجدول. هذه وصلة صريحة من العرض إلى عقد رئيسي ثم إلى عقود تشغيلية، وليست مجرد تشابه أسماء. المصدر: [إنشاء العقد التابع](../readable/controllers/C0951--tenant.views.crs.rental.masterAgreements.masterAgreementModal.js#L119).

| الغرض | المتحكم الكامل | الإجراء / الخدمة |
|---|---|---|
| إنشاء العقد الرئيسي | `tenant.views.crs.rental.masterAgreements.createOrEditModal` | `save` → `rentalMasterAgreement.createOrUpdateMasterRentalAgreement` |
| قراءة واعتماد العقود الرئيسية | `tenant.views.crs.rental.masterAgreements.index` | `getmasterAgreements` / `approveMasterAgreement` → `rentalMasterAgreement.getMasterRentalAgreements` / `approveMasterAgreement` |
| إنشاء العقد التابع وربط الجدول | `tenant.views.crs.rental.masterAgreements.masterAgreementModal` | `addAgreementUnderMasterAgreement`، ثم `rentalMasterAgreement.updateScheduleLine` |
| حفظ العقد التشغيلي من الرئيسي | `tenant.views.crs.agreements.createOrEditModalForMaster` | `save` → `agreement.createOrUpdateAgreement` |

مرجع حفظ العقد التابع: [محرر العقد من الرئيسي](../readable/controllers/C0531--tenant.views.crs.agreements.createOrEditModalForMaster.js#L3). هذه النافذة تختلف عن محرر العقد العادي، ويجب قراءتهما معاً عند مراجعة دورة العقود الرئيسية.

### مسار الحجز ثم فتح العقد

المشاهَد أن الحجز يمكن إنشاؤه مباشرة، ويمكن أيضاً إدخاله من مخطط المركبات. يجلب المخطط المركبات واتفاقياتها، ويفتح نوافذ عرض عقود الإيجار أو التأجير بحسب الفئة، كما يفتح نافذة حجز لوقت ومركبة مختارين. مصدر المخطط هو [عرض العقود بحسب الفئة](../readable/controllers/C0964--tenant.views.rentalplanner.index.js#L262)، و[إنشاء الحجز](../readable/controllers/C0964--tenant.views.rentalplanner.index.js#L451)، و[تحديث بيانات المخطط](../readable/controllers/C0964--tenant.views.rentalplanner.index.js#L513). لا تثبت قراءة المخطط منع التعارض أو حجز السعة على الخادم.

المشاهَد أن محرر الحجز يعالج العميل والسائق والمركبة وفترة الحجز والتعريفة والرسوم والمستندات والدفعة المقدمة والتأمين، ثم يرسل الحجز. نافذة التأكيد تقرأ الحجز وتتيح اختيار مركبة وتعيد حساب الرسوم ثم تستدعي التأكيد؛ إمكانية جعل لوحة المركبة اختيارية مرتبطة بإعداد. المصدر: [محرر الحجز](../readable/controllers/C0662--tenant.views.crs.bookings.createOrEditModal.js#L3)، و[نافذة التأكيد وإعداد المركبة](../readable/controllers/C0661--tenant.views.crs.bookings.confirmBooking.js#L10)، و[تنفيذ التأكيد](../readable/controllers/C0661--tenant.views.crs.bookings.confirmBooking.js#L85).

| المرحلة | المتحكم الكامل | الإجراء | الخدمة والطريقة |
|---|---|---|---|
| إنشاء أو تعديل الحجز | `tenant.views.crs.bookings.createOrEditModal` | `save` | `booking.createOrUpdateBooking` |
| قراءة الحجز ببيانات المقدَّم | نفس المتحكم | `init` | `booking.getBookingWithAdvanceForEdit` |
| تأكيد الحجز | `tenant.views.crs.bookings.confirmBooking` | `confirm` | `booking.confirmBooking` |
| قائمة الحجوزات | `tenant.views.bookings.index` | `getBookings` | `bookingSearch.getBookings` |
| إلغاء الحجز | نفس متحكم القائمة | `cancelBooking` | `booking.cancelBooking` |
| تسجيل عدم الحضور | نفس متحكم القائمة | `noShowBooking` | `booking.noShowBooking` |
| إغلاق الحجز يدوياً | نفس متحكم القائمة | `markCloseBooking` | `booking.markCloseBooking` |
| فتح عقد من الحجز | نفس متحكم القائمة | `openAgreement` | يفتح محرر العقد العادي؛ لا يستدعي تحويل الحجز مباشرة |

المشاهَد أن قائمة الحجوزات تتيح التعديل للحجز الجديد أو المؤكد، والتأكيد للجديد، وفتح العقد وإضافة إيصال وإغلاق الحجز للحجز المؤكد، مع اختلاف شروط الصلاحية والموقع. تسمح بالإلغاء وعدم الحضور للجديد أو المؤكد، وبالحذف للجديد. المصدر: [شروط إجراءات الحجز](../readable/controllers/C0663--tenant.views.bookings.index.js#L238).

المشاهَد بدقة أن فتح العقد يمرر **معرف الحجز في معامل اسمه معرف العقد** إلى محرر العقد العادي، الذي يقرأ نموذجاً بواسطة خدمة تحرير العقد. الاستدعاء القديم للتحويل المباشر موجود داخل تعليق فقط، فلا يُحسب مساراً منفذاً. نموذج المحرر الراجع قد يحمل مرجع الحجز، لكن كيفية تحويله وحفظ حالة الحجز ملك للخادم وغير متاحة هنا. المصدر: [فتح العقد من الحجز](../readable/controllers/C0663--tenant.views.bookings.index.js#L827)، و[قراءة النموذج](../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js#L2165)، و[التعامل مع مرجع الحجز](../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js#L2255).

**المستنتَج:** توجد طرق دخول اختيارية وليست سلسلة واحدة إلزامية: حجز مباشر ثم تأكيد ثم عقد، أو عرض معتمد ثم عقد رئيسي ثم عقود تابعة، أو إنشاء عقد مباشر من قائمة العقود. لا يظهر من الكود المفحوص ربط إلزامي عام بين عرض الإيجار والحجز. محرر العقد يستطيع تحميل عروض العميل، وتوجد قاعدة واجهة مشروطة تجعل العرض مطلوباً لبعض العملاء الأفراد والفترات؛ لا يعمم ذلك على كل العقود. المصدر: [شرط إلزام العرض](../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js#L183).

### إنشاء العقد وتسليم المركبة

المشاهَد أن حفظ العقد العادي يبدأ بالتحقق المحلي، ثم فحص حد الائتمان عبر الخادم، وقد يفتح نافذة رمز تفويض، ثم يجمع المقدَّم والتأمين بحسب الإعدادات. يرسل العقد والمقدَّم والتأمين ورموز التفويض وبطاقة التعريفة إلى خدمة الحفظ. عند تفعيل الفوترة المقدمة قد يتبع الحفظ استدعاء مستقل لإنشاء فاتورة مقدمة. المصدر: [بداية الحفظ وحد الائتمان](../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js#L1446)، و[الحفظ ثم الفاتورة المقدمة](../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js#L1683).

| المرحلة | المتحكم الكامل | الإجراء / الخدمة |
|---|---|---|
| إنشاء العقد | `tenant.views.crs.agreements.createOrEditModal` | `save` → `commonLookup.validateCreditLimit` ثم `agreement.createOrUpdateAgreement` |
| فاتورة مقدمة اختيارية | نفس المتحكم | `agreement.advanceInvoiceOnCreation` |
| قراءة قائمة العقود | `tenant.views.agreements.index` | `getAgreements` → `rentalAgreementSearch.agreementsGridView` |
| حركة التسليم | `tenant.views.crs.agreements.deliveryModal` | `save` → `agreement.addDeliveryMovement` |
| إضافة رسوم | `tenant.views.crs.agreements.agreementAdditionalCharges` | `saveAdditionalRentalAgreementCharges` في خدمة `agreementAdditionalCharges` |
| ساعات سائق العقد | `tenant.views.crs.driverTimeSheetForAgreement.index` | `searchOpenAgreement` / `getAgreementTimeSheet` / `createOrUpdateDriverTimeSheet` في الخدمة بالاسم نفسه |

المشاهَد أن حركة التسليم واجهة منفصلة، وأن بعض الأوامر التشغيلية تختفي عندما لم يكتمل التسليم. لذلك يجب فحص التسليم إلى جانب إنشاء العقد عند شرح خروج المركبة، ولا تكفي شاشة الحفظ وحدها. المصدر: [فتح نافذة التسليم](../readable/controllers/C0539--tenant.views.agreements.index.js#L1327)، و[حفظ الحركة](../readable/controllers/C0533--tenant.views.crs.agreements.deliveryModal.js#L3)، و[ساعات السائق](../readable/controllers/C0780--tenant.views.crs.driverTimeSheetForAgreement.index.js#L94).

### التمديد والتقصير والاستبدال أثناء العقد

المشاهَد أن التمديد والتقصير يشتركان في محرر واحد يرسل العقد ونوع الإجراء ورمز تفويض الخصم؛ وقد تتبعه فاتورة مقدمة عند تفعيلها. هذا يختلف عن تغيير تاريخ ظاهر فقط. المصدر: [عقد الإجراء وطلب الحفظ](../readable/controllers/C0537--tenant.views.crs.agreements.extendCutShortAgreementModal.js#L377).

المشاهَد أن استبدال المركبة يعالج حركة دخول للمركبة الحالية وحركة خروج للمركبة التالية؛ يتحقق من ترتيب التاريخ والعداد، ويرسل الحركتين مع معرف العقد، ومرجع حركة التسليم، وخيارات المركبة الدائمة والاستبدال للصيانة أو للتحصيل. يمكن فتح توليد فواتير مخالفات بعد الاستبدال بحسب إعداد. المصدر: [تحقق الاستبدال وحفظه](../readable/controllers/C0547--tenant.views.crs.agreements.replaceVehicleModal.js#L129).

| العملية | المتحكم الكامل | الطريقة الأساسية |
|---|---|---|
| تمديد أو تقصير | `tenant.views.crs.agreements.extendCutShortAgreementModal` | `agreement.extendCutShortAgreement` |
| استبدال مركبة | `tenant.views.crs.agreements.replaceVehicleModal` | `agreementReplacement.replaceVehicle` |
| استبدال سائق | `tenant.views.crs.agreements.replaceDriverModal` | يُفتح من فهرس العقود؛ يحتاج قراءة تفاصيله عند مراجعة دورة السائق |

### الإرجاع والإغلاق والتسوية

المشاهَد أن الإغلاق يقرأ نموذجاً مخصصاً للإغلاق، ويحسب رسومه محلياً، ويعالج تاريخ الدخول والعداد والوقود ورسوم المرور والمخالفات والمواقف بحسب الميزات. يفحص ألا يسبق تاريخ الدخول تاريخ الخروج وألا يقل العداد، مع شروط مرتبطة بإعداد تعطيل العدادات، ويمنع تاريخ دخول في يوم مستقبلي. يجمع معرفات الرسوم المشمولة والمستبعدة ويرسلها مع العقد. المصدر: [تحقق الإرجاع](../readable/controllers/C0529--tenant.views.crs.agreements.closeAgreementModal.js#L323)، و[طلب الإغلاق](../readable/controllers/C0529--tenant.views.crs.agreements.closeAgreementModal.js#L411).

المشاهَد أن رسالة النجاح تقول إن الحفظ وتوليد الفاتورة نجحا، لكن هذه رسالة واجهة بعد نجاح خدمة الإغلاق؛ ليست دليلاً على تفاصيل فاتورة أو قيد محاسبي. يمكن إصدار فواتير مخالفات منفصلة عند تفعيل الإعداد المناسب. المصدر: [نجاح الإغلاق وفواتير المخالفات](../readable/controllers/C0529--tenant.views.crs.agreements.closeAgreementModal.js#L488).

| العملية | المتحكم الكامل | القراءة / الكتابة |
|---|---|---|
| الإغلاق التمهيدي | `tenant.views.crs.agreements.preCloseAgreementModal` | `rentalAgreementSearch.getAgreementForPreClosing` → `agreement.preCloseAgreement` |
| الإغلاق النهائي | `tenant.views.crs.agreements.closeAgreementModal` | `rentalAgreementSearch.getAgreementForClosing` → `agreement.closeAgreement` |
| إعادة فتح العقد | `tenant.views.agreements.index` | `unCloseAgreement` → `agreement.uncloseAgreement` |
| الإلغاء أو الحذف | نفس متحكم القائمة | `voidAgreement` / `deleteAgreement` → الطريقتان في `agreement` |

المشاهَد أن شروط القائمة تفرق بين العقد المفتوح والعقد المغلق والإغلاق التمهيدي؛ تتيح الإغلاق للعقد المفتوح أو المغلق تمهيدياً، وإعادة الفتح للمغلق غير المغلق تمهيدياً، مع الصلاحية والموقع وشروط التسليم. توجد أوامر مستقلة للحذف والإلغاء. هذه **شروط إظهار أمامية** وليست مصفوفة انتقالات نهائية للخادم. المصدر: [شروط حالات العقد](../readable/controllers/C0539--tenant.views.agreements.index.js#L496)، و[استدعاء إعادة الفتح](../readable/controllers/C0539--tenant.views.agreements.index.js#L1553).

## ثانياً: دورة التأجير طويل الأجل

### معاملات التكلفة والاستفسار ثم العرض

المشاهَد أن هناك مصدرين لتجهيز التكلفة: معاملات عامة، وإعدادات مرتبطة بطراز المركبة. محرر العرض يستدعي كلا المصدرين، ثم يعمل على بنود تكلفة بحسب المدة والكمية وقيمة المركبة ومكونات التكلفة. وجود هذه الحسابات في الواجهة لا يثبت اعتمادها المحاسبي أو أن الناتج يعاد حسابه على الخادم. المصدر: [المتحكم ومعاملات التكلفة](../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js#L3)، و[حساب بنود العرض](../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js#L235)، و[تحميل تكلفة الطراز](../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js#L377).

المشاهَد أن الاستفسار يجمع العميل وشخص الاتصال والمركبات أو الطرازات والكميات. قائمة الاستفسارات تتيح إنشاء عرض فقط عندما لا توجد علامة تفيد بإنشاء عرض سابق؛ وعند فتح العرض تمرر معرف الاستفسار. يقرأ محرر العرض الاستفسار وينقل العميل وشخص الاتصال وبنود المركبات والكميات ويحفظ مرجعه. هذه وصلة صريحة بين المستندين. المصدر: [شرط إنشاء العرض](../readable/controllers/C0868--tenant.views.crs.lease.leaseInquiries.index.js#L153)، و[فتح العرض من الاستفسار](../readable/controllers/C0868--tenant.views.crs.lease.leaseInquiries.index.js#L331)، و[نقل البيانات](../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js#L507).

| المرحلة | المتحكم الكامل | الإجراء / الخدمة |
|---|---|---|
| معاملات التكلفة | `tenant.views.crs.lease.costingParameters.index` | `costParameter.getcostingParameters`؛ محررها يستعمل `createOrUpdateCostParameter` |
| إعداد التكلفة بالطراز | `tenant.views.crs.lease.costingSetup.createOrEditModal` | `costSetting.getCostSettingForEdit` / `createOrUpdateCostSetting` |
| إنشاء الاستفسار | `tenant.views.crs.lease.leaseInquiries.createOrEditModal` | `save` → `leaseInquiry.createOrUpdateLeaseInquiry` |
| تغيير مرحلة الاستفسار | `tenant.views.crs.lease.leaseInquiries.changeLeaseInquiryStage` | `save` → `leaseInquiry.updateLeaseInquiryStage` |
| إنشاء العرض من الاستفسار | `tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal` | `initFromInquiry` → `leaseInquiry.getLeaseInquiryForEdit` |
| حفظ العرض أو مراجعته | نفس متحكم العرض | `save` → `leaseQuotation.createOrUpdateLeaseQuotation` أو `reviseLeaseQuotation` |

المشاهَد أن محرر العرض الجديد يعرض أسماء أنواع متعددة، لكن مسار الحفظ المفحوص يضبط النوع على التأجير طويل الأجل قبل إرساله. لذلك لا تُستنتج دورة تملك مستقلة من اسم خيار ظاهر وحده. المصدر: [الأنواع](../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js#L45)، و[نوع العرض عند الحفظ](../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js#L569).

### الاعتماد ثم العقد الرئيسي أو أمر شراء المركبة

المشاهَد أن عروض التأجير تتبع موافقة داخلية ثم موافقة العميل، وتسمح بمراجعة العرض بعد الموافقة الداخلية وقبل قرار العميل. تتطلب إنشاء العقد الرئيسي أو أمر الشراء موافقة الطرفين، وعدم وجود المستند منشأ سابقاً، مع شروط صلاحيات كل إجراء كما هي مكتوبة. المصدر: [شروط الاعتماد والمراجعة](../readable/controllers/C0878--tenant.views.crs.lease.leaseQuotations.index.js#L173)، و[قائمة الإجراءات](../readable/controllers/C0878--tenant.views.crs.lease.leaseQuotations.index.js#L232).

المشاهَد أن إنشاء العقد الرئيسي يمرر معرف العرض إلى نافذة الحفظ، بينما إنشاء أمر الشراء يفتح محرر المشتريات مع معرف عرض التأجير. **المستنتَج** أن العرض المعتمد يغذي مسار التعاقد ومسار شراء المركبات؛ لا يثبت الكود المفحوص أن الشراء مطلوب دائماً قبل إصدار العقد، أو أنه اكتمل بمجرد فتح النافذة. المصدر: [العقد الرئيسي وأمر الشراء](../readable/controllers/C0878--tenant.views.crs.lease.leaseQuotations.index.js#L394).

| الغرض | المتحكم الكامل | الخدمة والطريقة |
|---|---|---|
| الموافقة أو الرفض الداخلي | `tenant.views.crs.lease.leaseQuotations.index` | `leaseQuotation.approveLeaseQuotation` / `rejectLeaseQuotation` |
| قرار العميل | نفس متحكم القائمة | `leaseQuotation.approveQuotationByCustomer` / `rejectQuotationByCustomer` |
| إنشاء العقد الرئيسي | `tenant.views.crs.lease.masterAgreements.createOrEditModal` | `leaseMasterAgreement.createOrUpdateMasterLeaseAgreement` |
| قراءة واعتماد العقد الرئيسي | `tenant.views.crs.lease.masterAgreements.index` | `leaseMasterAgreement.getMasterLeaseAgreements` / `approveMasterAgreement` |
| إنشاء أمر الشراء | `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal` | يُفتح بخيار `leaseQuotationId`؛ تفاصيل المشتريات خارج هذا الملف |

المشاهَد أن نافذة إنشاء العقد الرئيسي تضبط تاريخ بدء الفوترة على الوقت الحالي. تفاصيل العقد الرئيسي تفتح عقداً تشغيلياً من صف الجدول، وتمرر العميل وعدد الأشهر وفئة المركبة وطرازها والرسوم، ثم تحفظ معرف العقد في الصف. المصدر: [بداية الفوترة وحفظ الرئيسي](../readable/controllers/C0884--tenant.views.crs.lease.masterAgreements.createOrEditModal.js#L21)، و[إنشاء العقد التابع](../readable/controllers/C0888--tenant.views.crs.lease.masterAgreements.masterAgreementModal.js#L208).

### العقد التشغيلي والبنود والتجديد

المشاهَد أن محرر عقد التأجير يضيف المخصصات والبنود وقواعد الإنهاء المبكر، ويحمّل أنواع البنود ونصوصها، ويتعامل مع عدد الأشهر وبيانات المركبة والعميل والسائق والمقدَّم والتأمين. عند الإنشاء من العقد الرئيسي ينقل مرجعه والعميل والمركبة والفترة، ثم يستدعي خدمة حفظ عقد التأجير. لا تثبت أسماء حقول غرامة الإنهاء كيفية احتسابها الفعلية أو ترحيلها. المصدر: [المحرر وإضافات العقد](../readable/controllers/C0845--tenant.views.crs.lease.agreements.createOrEditModal.js#L3)، و[الحفظ](../readable/controllers/C0845--tenant.views.crs.lease.agreements.createOrEditModal.js#L1077)، و[التهيئة من العقد الرئيسي](../readable/controllers/C0845--tenant.views.crs.lease.agreements.createOrEditModal.js#L1343).

| العملية | المتحكم الكامل | الخدمة والطريقة |
|---|---|---|
| إنشاء أو تعديل العقد | `tenant.views.crs.lease.agreements.createOrEditModal` | `leaseAgreement.getLeaseAgreementWithAdvanceAndDepositForEdit` / `createOrUpdateLeaseAgreement` |
| محرر الخطوات البديل | `tenant.views.crs.lease.agreements.createOrEditWizardModal` | نفس خدمة الحفظ؛ لا يُفترض أنه المسار الافتراضي من الاسم وحده |
| قائمة عقود التأجير | `tenant.views.lease.agreements.index` | `getLeaseAgreements` → `leaseAgreementSearch.getLeaseAgreements` |
| تمديد الفترة | `tenant.views.crs.lease.agreements.extendAgreementModal` | `leaseAgreement.createOrUpdateLeaseAgreement` |
| تمديد السعر والفترة | `tenant.views.crs.lease.agreements.extendLeaseAgreementModal` | `leaseAgreement.getAgreementForExtension` / `extendLeaseAgreement` |

المشاهَد أن القائمة تفصل بين تمديد الفترة وتمديد السعر والفترة. المسار الثاني يجمع نموذج إغلاق ونموذج فتح، ويضع المقدَّم والتأمين في نموذج الفتح، ثم يرسلهما معاً إلى خدمة التمديد. **المستنتَج** أنه تجديد يجمع تسوية الفترة السابقة وشروط الفترة التالية؛ هل ينشئ رقماً جديداً أو يغير العقد نفسه وما أثر ذلك محاسبياً يظل مجهولاً. المصدر: [الإجراءان في القائمة](../readable/controllers/C0849--tenant.views.lease.agreements.index.js#L353)، و[عقد طلب التجديد](../readable/controllers/C0848--tenant.views.crs.lease.agreements.extendLeaseAgreementModal.js#L1027).

المشاهَد أن عقود التأجير تعيد استعمال نافذة استبدال المركبة وحركات التسليم والسجل المالي والمستندات والخصومات التابعة للعقود المشتركة؛ لا توجد هنا دورة أسطول منفصلة لكل نوع عقد. يُتبع الاستدعاء الفعلي من [فهرس التأجير](../readable/controllers/C0849--tenant.views.lease.agreements.index.js#L3) إلى النافذة المعنية، مع بقاء شروط الصلاحية والحالة في الفهرس.

### الإغلاق التمهيدي ثم النهائي

المشاهَد أن التأجير له نافذتا إغلاق تمهيدي ونهائي وخدماته الخاصة. نافذة الإغلاق النهائي تقرأ النموذج المخصص، وتجمع مرور المركبات والمخالفات والمواقف، ثم ترسل العقد ومعرفات الرسوم إلى خدمة الإغلاق. تعرض بعدها رسالة نجاح تتضمن توليد فاتورة. ذلك لا يكشف دفتر الأستاذ أو المعالجة النهائية للمقدَّم والتأمين والغرامات. المصدر: [نافذة الإغلاق](../readable/controllers/C0844--tenant.views.crs.lease.agreements.closeLeaseAgreementModal.js#L3)، و[طلب الإغلاق](../readable/controllers/C0844--tenant.views.crs.lease.agreements.closeLeaseAgreementModal.js#L245).

| العملية | المتحكم الكامل | الخدمة والطريقة |
|---|---|---|
| الإغلاق التمهيدي | `tenant.views.crs.lease.agreements.preCloseAgreementModal` | `leaseAgreement.preCloseAgreement` |
| قراءة الإغلاق | `tenant.views.crs.lease.agreements.closeLeaseAgreementModal` | `leaseAgreementSearch.getLeaseAgreementForClosing` |
| الإغلاق النهائي | نفس متحكم الإغلاق | `leaseAgreement.closeLeaseAgreement` |
| إعادة الفتح أو الإلغاء | `tenant.views.lease.agreements.index` | `agreement.uncloseAgreement` / `agreement.voidAgreement` |
| الحذف | نفس متحكم القائمة | `leaseAgreement.deleteLeaseAgreement` |

المشاهَد أن القائمة تفصل الإغلاق النهائي عن التمهيدي وإعادة الفتح، وتربط بعض الإجراءات بحالة العقد والموقع واكتمال التسليم. لا تُترجم شروط العرض الأمامية إلى صلاحيات خادم مؤكدة. المصدر: [شروط الإغلاق وإعادة الفتح](../readable/controllers/C0849--tenant.views.lease.agreements.index.js#L359).

## الفوترة والتحصيل المشتركان بين الدورتين

المشاهَد أن الفوترة التشغيلية للعقود تقع تحت **السندات ← الفواتير**. تعرض قائمة الفواتير نوافذ مستقلة لتوليد فواتير الإيجار والتأجير والمخالفات والمرور والمواقف والكيلومترات الزائدة. رابط القراءة هو [متحكم الفواتير](../readable/controllers/C1336--tenant.views.crs.vouchers.invoices.index.js#L3)، وليس بند الفوترة العام في آخر القائمة.

| المسار | المتحكم الكامل | الطلب الأساسي |
|---|---|---|
| فواتير الإيجار المستحقة | `tenant.views.crs.vouchers.invoices.generateModal` | `getInvoicesDueToGenerate` → `invoiceDue.getInvoicesDueToGenerate` مع `agreementCategory: 1` |
| فواتير التأجير المستحقة | `tenant.views.crs.vouchers.invoices.generateLeaseModal` | `getLeaseInvoicesDueToGenerate` → نفس الخدمة مع `agreementCategory: 2` |
| توليد الفواتير | المتحكمان السابقان | `generate` / `mergeInvoice` → `invoice.generateInvoices` |
| سجل تحصيل العقد ورد الأموال | `tenant.views.crs.agreements.billingHistoryModal` | `commonAgreement.getAgreement`، و`receiptSearch.getReceivedVouchersByAgreementId`، و`refund.getRefundsByAgreementId` |

المشاهَد أن طلب المستحقات يستخدم تاريخاً نهائياً ورقم العقد أو الرئيسي والعميل ومندوب المبيعات؛ مسار الإيجار يضيف المشروع ونوع العقد أيضاً. يختار المستخدم صفوفاً للتوليد، ويستبعد المسار العادي الصفوف التي لها أرقام فواتير أو أخطاء، ويرسل دفعات محدودة الحجم. يوجد خيار دمج، وقد تحمل الطلبات خيارات تضمين المخالفات والمرور والمواقف. لا يعني ذلك أن الخادم يطبق سياسة واحدة على كل هذه الأنواع. المصدر: [مستحقات الإيجار](../readable/controllers/C1329--tenant.views.crs.vouchers.invoices.generateModal.js#L491)، و[توليد الإيجار](../readable/controllers/C1329--tenant.views.crs.vouchers.invoices.generateModal.js#L320)، و[مستحقات التأجير](../readable/controllers/C1327--tenant.views.crs.vouchers.invoices.generateLeaseModal.js#L437)، و[توليد التأجير](../readable/controllers/C1327--tenant.views.crs.vouchers.invoices.generateLeaseModal.js#L163).

المشاهَد أن سجل التحصيل يجلب بيانات العقد والإيصالات والمبالغ المستردة بصورة منفصلة، ويجمع المقبوض بعد طرح عمولة البطاقة، ويجمع المبالغ المستردة، ويجهز مبلغاً مستحقاً للنافذة التالية. توجد وصلات لإضافة إيصال وتأمين وطلب دفع إلكتروني من قوائم العقود والحجوزات بحسب الصلاحيات والميزات. الحساب الظاهر في سجل التحصيل **عرض محلي**، وليس كشفاً محاسبياً مثبتاً من هذه الملفات. المصدر: [حسابات السجل المالي](../readable/controllers/C0527--tenant.views.crs.agreements.billingHistoryModal.js#L33)، و[مصادر السجل](../readable/controllers/C0527--tenant.views.crs.agreements.billingHistoryModal.js#L79)، و[وصلات التحصيل والتأمين](../readable/controllers/C0539--tenant.views.agreements.index.js#L1404).

**تمييز مؤكد:** بند الفوترة العام يعالج فواتير اشتراكات وطلبات تغيير ومشروعات تخص حساب المنشأة؛ يستخدم خدمة رعاية العميل، فلا يُدمج في دورة فواتير إيجار المركبات. الدليل هو [حقول التصنيف والخدمة](../readable/controllers/C0651--tenant.views.crs.billing.index.js#L3): `customerCareTenant.openInvoices` / `closeInvoices`، والحقول `subscriptionId` / `changeRequestId` / `projectId`.

## ترتيب مقترح لمراجعة دورة كاملة

الترتيب التالي **استنتاج تنظيمي للمراجع** من الوصلات المثبتة، وليس ادعاء بوجود معالج واحد يفرض جميع الخطوات:

1. **دورة الإيجار المباشر:** التعريفة وبطاقاتها ← الحجز أو المخطط ← تأكيد الحجز ← فتح العقد أو إنشاؤه مباشرة ← المقدَّم والتأمين والتسليم ← رسوم دورية وتحركات واستبدال أو تمديد ← مستحقات الفواتير والتحصيل ← إرجاع المركبة ← الإغلاق التمهيدي إن استُخدم ثم النهائي ← مراجعة سجل التحصيل ورد الأموال.
2. **دورة الإيجار من العرض:** عرض متعدد البنود ← موافقة داخلية ثم موافقة العميل ← أمر بيع اختياري بحسب الشروط ← عقد رئيسي ← جداول وعقود تشغيلية تابعة ← بقية دورة العقد السابقة.
3. **دورة التأجير طويل الأجل:** معاملات وإعدادات تكلفة ← استفسار اختياري ← عرض وتكلفة ← موافقة داخلية ثم موافقة العميل ← عقد رئيسي وأمر شراء محتمل ← عقد تشغيلي مع بنود وقواعد إنهاء ← تسليم وفوترة دورية وتحصيل ← استبدال أو تمديد الفترة أو تجديد السعر والفترة ← إغلاق وتسوية.

## حدود الإثبات والأسئلة المتبقية

| المسألة | ما أثبته المصدر | ما لم يُثبت |
|---|---|---|
| حماية الحالات والصلاحيات | شروط إظهار وإرسال أمامية | تحقق الخادم، والحماية من الطلبات المتزامنة، ومصفوفة الانتقالات النهائية |
| تحويل الحجز إلى عقد | فتح محرر العقد بمعرف الحجز وقراءة نموذج تحرير | آلية التحويل داخلياً، وتغيير حالة الحجز، ومنع التحويل المكرر |
| السعر والضريبة والخصومات | مدخلات وحسابات عرض محلية وطلبات حفظ | سياسة الخادم، وإعادة الحساب، وتقريب الأرقام النهائي، وموافقة الخصم المحاسبية |
| توافر المركبة | عمليات بحث بمعايير وتواريخ وحالة ومخطط | منع تداخل الحجز، وحجز السعة، وتحديث الحالة ذرّياً |
| الإغلاق والفواتير | طلب إغلاق ورسالة نجاح وتوليد منفصل للمستحقات | شكل الفاتورة والقيد، ومنع الازدواج، والتسوية مع الفواتير السابقة |
| المقدَّم والتأمين | نماذج منفصلة وبيانات تمرر عند الحفظ | القيود المحاسبية والتخصيص والاسترداد التلقائي وشروط الإفراج |
| الإنهاء المبكر والتجديد | حقول قواعد وطلب فتح وإغلاق للتجديد | تطبيق الغرامة وصيغتها، وتاريخ الأثر، وإنشاء عقد جديد أو استمرار الرقم |
| ربط القوالب بالمتحكمات | مسارات القوالب وسمات ربط صفحات القائمة الملتقطة وتسجيلات المتحكمات وفتح النوافذ | العرض الفعلي وقت التشغيل، ونصوص القوالب الخام، وربط كل قالب نافذة غير تابع لمسارات القائمة |
| تنزيل المرور والمخالفات | استدعاءات وفروع إضافات متصفح وخدمات تنزيل | نجاح التكامل الخارجي ودقة البيانات والتغطية الزمنية |

المشاهَد أيضاً وجود **تسجيلين بالاسم نفسه** لمتحكم تفاصيل العقد الرئيسي للتأجير، في [النسخة الأولى](../readable/controllers/C0887--tenant.views.crs.lease.masterAgreements.masterAgreementModal.js#L3) و[النسخة اللاحقة](../readable/controllers/C0888--tenant.views.crs.lease.masterAgreements.masterAgreementModal.js#L3). بُني شرح الجدول وإنشاء العقد التابع على النسخة اللاحقة، مع الإبقاء على هذه الملاحظة؛ تحديد التسجيل المستخدم فعلياً يحتاج تحقق تحميل/تشغيل، ولا يُسوّى بالاسم وحده.

المشاهَد أن بعض الأسماء التاريخية لا تطابق الاستخدام: فهرس عروض الإيجار يحتوي إجراءات بأسماء عرض التأجير، ومحرر عرض التأجير يستعمل خدمة تعريفة ذات اسم متعلق بالمعدات. المرجع في هذا الملف هو جسم الاستدعاء ومعاملاته والنافذة التي يفتحها، وليس الاسم وحده. لم تُعتبر الاستدعاءات المعطلة داخل التعليقات سلوكاً قائماً.

**نطاق التغطية:** تم تتبع الوصلات الأساسية للعروض والحجوزات والعقود الرئيسية والعقود التشغيلية والتسليم والاستبدال والتمديد والإغلاق والفوترة. فُحصت عناصر التعريفة والتكلفة والسائق والرسائل بوصفها نقاط دخول ومصادر مساندة؛ لا يمثل هذا الملف تدقيقاً تفصيلياً لكل حقولها أو جميع متحكمات الطباعة والتقارير. اكتشاف طرق خدمة في الفهارس استُخدم لتوجيه القراءة فقط، وما نُسب إلى السلوك مبني على المواضع المشار إليها في المصادر.
