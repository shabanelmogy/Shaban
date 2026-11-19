# ربط حالة الاعتماد في الشاشات التشغيلية

| البيان | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-15 |
| العقد | ERP_APPROVAL_IMPLEMENTATION_CONTRACT_FREEZE.md، استكمال الدورة من الإعدادات إلى إجراء كل شاشة |
| التفويض | طلب المالك استكمال الدورة وإضافة Approval Status في الشاشات الناقصة |

## ما نُفذ

أضيف إجراء `Approval Status` إلى قوائم المستندات التالية باستخدام المالك المشترك `injectApprovalStatusAction`. يحمل كل إجراء نوع المستند الحقيقي ومعرف صفه المحفوظ، ويتحقق عند العرض والتنفيذ من صلاحية القراءة وعضوية الصف في بيانات الشاشة الحالية وحالة الانشغال. فتح النافذة المشتركة والتحميل والتأكيدات والقرارات وسحب الصلاحية يملكها التنفيذ المشترك لدى الجذر.

الجدول يشير إلى ملفات نسبية داخل `SiGmaAngularFrontEnd/src/app/modules/`. تستخدم الصفوف صلاحية `<نوع المستند>.View` لنقطة قراءة الموافقات المركزية، مع بقاء متطلبات قراءة القائمة الحالية شرطًا إضافيًا حيث تملك الشاشة شرط قراءة خاصًا. يستعمل تحضير بيع المعدة صلاحية `EquipmentSalePreparation.Get` المطابقة لقارئه. يستعمل `SaleOrder` صلاحية `SaleOrder.EquipmentRentalOrder` المطابقة لقارئ المستند المحفوظ، مع صلاحية قائمته `SaleOrder.EquipmentRentalOrders`. وُحّدت أسماء القراءة المركزية في مالك الكتالوج لدى الجذر. لا يمنح ظهور المستويات حق اتخاذ القرار.

| نوع المستند | المسار الفعلي | ملف إجراء القائمة | ربط الصف والحالة |
|---|---|---|---|
| Booking | `/RentalBooking` | `Rental/Booking/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions`، صف `BookingListDTO.id` |
| RentalAgreement | `/RentalAgreement` | `Rental/Agreement/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions`، صف العقد الحالي |
| LeaseAgreement | `/LeaseAgreement` و`/closedLeaseAgreements` | `Lease/LeaseAgreement/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions`، يحتفظ العرض المغلق بإجراء العرض وحالة الاعتماد |
| SalesAgreement | `/SalesAgreement` | `Sales/SalesAgreement/components/list/list.component.ts` | `approvalStatusAction` ضمن `actions` |
| TransportationAgreement | `/TransportationAgreements` | `Transportation/TransportationAgreement/components/list/list.component.ts` | `approvalStatusAction` ضمن `actions` |
| TripBooking | `/TripBooking` | `Limousine/TripBooking/components/list/list.component.ts` | صف من `visibleRows` الحالية مع نطاق الجلسة |
| RentalMasterAgreement | `/MasterAgreement` | `Rental/MasterAgreement/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions` |
| LeaseMasterAgreement | `/LeaseMasterAgreement` | `Lease/LeaseMasterAgreement/components/list/list.component.ts` | `approvalStatusAction` ضمن `actions` |
| EquipmentMasterAgreement | `/EquipmentMasterAgreement` | `Equipment Rental/EquipmentMasterAgreement/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions` |
| Quotation | `/EquipmentQuotation` | `Equipment Rental/EquipmentQuotation/components/list/list.component.ts` | نوع السياسة `Quotation`، صف من `quotations` الحالية |
| SalesQuotation | `/SalesQuotation` | `Sales/SalesQuotation/components/list/list.component.ts` | `approvalStatusAction` ضمن `actions` |
| LeaseQuotation | `/LeaseQuotation` | `Lease/LeaseQuotation/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions` |
| RentalQuotation | `/RentalQuotation` | `Rental/RentalQuotation/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions` |
| LimoQuotation | `/LimoQuotation` | `Limousine/LimoQuotation/components/list/list.component.ts` | `approvalStatusAction` ضمن `actions` |
| Job | `/Job` | `Workshop/Job/components/list/list.component.ts` | يظهر للصف الذي يحمل `JobRecordType.Job` فقط، حتى لا يعامل معرف `LubricationJob` كمعرف عمل |
| WorkOrder | `/WorkOrder` | `Workshop/WorkOrder/components/list/list.component.ts` | `approvalStatusAction` ضمن `moreActions` |
| JobEstimation | `/JobEstimation` | `Workshop/JobEstimation/components/list/list.component.ts` | `approvalStatusAction` ضمن `actions` مع شرط الجلسة الإدارية الحالية |
| DeliveryNote | `/DeliveryNote` | `Equipment Rental/DeliveryNote/components/list/list.component.ts` | معرف سند التسليم المحفوظ، والانشغال يشمل نوافذ الفوترة والفاتورة |
| DeliveryMovement | `/DeliveryMovement` | `Movements/DeliveryMovement/components/list/list.component.ts` | معرف الحركة من القائمة الحالية |
| WorkshopMovement | `/WorkshopMovement` | `Movements/WorkshopMovement/components/list/list.component.ts` | معرف الحركة من القائمة الحالية |
| CollectionMovement | `/collectionMovement` | `Movements/collectionMovement/components/list/list.component.ts` | معرف حركة الاستلام من القائمة الحالية |
| CustodyMovement | `/CustodyMovement` | `Movements/CustodyMovement/components/list/list.component.ts` | معرف العهدة من القائمة الحالية |
| NRM | `/NRM` | `Movements/NRM/components/list/list.component.ts` | نوع `NRM` الحقيقي، مستقل عن `NonRentalMovement` |
| LeaseInquiry | `/LeaseInquiry` | `Lease/LeaseInquiry/components/list/list.component.ts` | `approvalStatusAction` ضمن `actions` |
| Transaction | `/Transaction` | `Transportation/Transaction/components/list/list.component.ts` | معرف `TransactionListDTO.id`، ومسار وحدة Transportation الفعلي |
| SaleOrder | `/EquipmentRentalOrder` | `Equipment Rental/EquipmentRentalOrder/components/list/list.component.ts` | القارئ التاريخي يستخدم `SaleOrder/equipment-rental`، ويمرر معرف أمر البيع الحقيقي مع منحة `SaleOrder.EquipmentRentalOrder`. إنشاء/تعديل هذا المسار يتجه إلى DeliveryNote |
| EquipmentSalePreparation | `/Fleet`، نافذة التحضير المحفوظ | `Sales/Fleet/components/sale-preparation/sale-preparation.component.ts` و`.html` | يفتح `approvalStatusAction` بالمعرف `preview.id` بعد الحفظ، ويتحقق من معرف التحضير الحالي وإذن `EquipmentSalePreparation.Get`. لا يستخدم معرف المعدة |

لا يوجد إجراء `Approval Status` أصلي منافس في هذه القوائم عند الفحص. وجود أزرار اعتماد عرض السعر أو قبول أمر العمل سابقًا يصف إجراء المستند الأصلي. أضيف إجراء عرض سير السياسة باستخدام المالك المركزي دون تبديل تلك الأزرار أو إسناد آثارها للمستوى.

## حالة النوع الذي يفتقد شاشة مستقلة

النوع `NonRentalMovement` موجود في كتالوج الموافقات الحالي، ولم يثبت له مسار مستقل في `pages/routing.ts`. شاشة `/NRM` وملفات `Movements/NRM` تستخدم `NRM` مستقلًا. لهذا لم يُمرر معرف `NRM` باسم `NonRentalMovement`. يمكن الوصول للنوع عبر `Approval Documents` بحسب عقد القراءة، ويحتاج تحديد مدخل شاشة حقيقي إذا كان المطلوب إجراء صف مستقل لهذا النوع.

## المراجع والمطابقة

قُرئت نقطة الدخول في دليل Speed، ثم شريحة دورة التأجير بتاريخ ٢٨ أكتوبر ٢٠٢٦ وشروحات الحجوزات وعروض التأجير وعروض التأجير الطويل وحركات الورشة وأوامر العمل وتقديرات الأعمال وعروض الليموزين. قُرئت المقاطع المرتبطة من ملفات المتحكمات على حدة بعد الشرح.

| المرجع | ما يثبته | تطبيق Sigma |
|---|---|---|
| `C0663`، قائمة Bookings، السطور ٦٦٦ و٦٧٦ و٧٧٧ و٨٢٩ | عرض الحجز وتأكيده وإلغاؤه وفتح العقد أفعال منفصلة | ربط نوع `Booking` ومعرف الحجز في قائمته |
| `C0539`، قائمة Agreements، السطور ١٤٧٩ و١٤٨٣ و١٧٨٠ | عرض العقد والفوترة وسجل العقد مداخل مستقلة | ربط `RentalAgreement` وعدم استخدام الاسم العام `Agreement` |
| `C0958`، عروض التأجير، السطور ٦٣٣ و٦٦٠ و٧٥٥ | العرض والاعتماد الداخلي وقرار العميل لها مداخل منفصلة | إضافة حالة سير الموافقة إلى قائمة RentalQuotation |
| `C0878`، عروض التأجير الطويل، السطور ٥٢٢ و٥٤٩ و٥٨٥ | عرض السعر والاعتماد وقرار العميل منفصلة | إضافة حالة السير إلى قائمة LeaseQuotation |
| `C1459`، حركات الورشة، السطور ٤٢٩–٤٤١ | الإنشاء والتعديل والإغلاق والعرض مسارات متميزة | عرض مراحل `WorkshopMovement` بمعرف الحركة |
| `C1823`، أوامر العمل، السطور ٥٣٥–٥٤٣ | أوامر العمل تملك إجراءات الإنشاء والعرض والتعديل | ربط `WorkOrder` الفعلي |
| `C1793`، تقديرات الأعمال، السطور ٤٦٩ و٤٨٣ و٤٩٨ | عرض التقدير وإنشاء العمل وإغلاق التقدير عمليات منفصلة | ربط نوع `JobEstimation` بمعرفه |
| `C0906`، عروض الليموزين، السطور ٣٢٥ و٣٩٤ و٤٨١ | عرض العرض واعتماده وقرار العميل مداخل منفصلة | ربط `LimoQuotation` الفعلي |

هذه أدلة واجهة مرجعية ساكنة. قواعد الموافقة المركزية وصلاحياتها وآثارها تتبع عقد Sigma المجمد وخدماته الفعلية. لم يبق سؤال مرجعي وظيفي لهذا التغيير يستدعي نقل قاعدة إضافية من Odoo. قُرئت نقطة مرجع Odoo المكمل لتثبيت الأولوية.

## الدليل والتحقق

أضيف نص مشترك موجز عن `Approval Status` إلى أسئلة أدلة الوحدات الثماني التالية بواسطة `APPROVAL_STATUS_QUESTION` في `UserGuide/content/approval-status-guide.ts`، مع إبقاء القارئ والمسارات القائمة. الملفات المستهلكة هي `rental-guide.ts` و`lease-guide.ts` و`sales-guide.ts` و`limousine-guide.ts` و`transportation-guide.ts` و`workshop-guide.ts` و`movements-guide.ts` و`equipment-rental-guide.ts`. أضيفت أيضًا خطوة مستقلة في موضوع `DriverTimeSheet` تشرح فتح حالة صف يوم محفوظ بعد حفظ التعديلات.

المطابقة المصدرية تتحقق من إجراء واحد لكل قائمة وهوية نوع/صف صحيحة وشرط عرض وإعادة تحقق وانشغال. فحص الفروق المحصور لا يسجل أخطاء بياض. يجري الجذر فحص التجميع ودمج المالك المشترك. لم يشغّل هذا العامل بناءً أو اختبارات أو متصفحًا أو قاعدة بيانات أو lint أو commit. تبقى تجربة العرض والمستويات وبدء المحاولة وقرار المستخدم/الدور وتغير الشركة والفرع ورفض النسخة القديمة ضمن القبول التشغيلي.

لا توجد قراءة سياسة أو موافقة لكل صف عند تحميل هذه القوائم. تظهر النافذة عند الطلب، والقراءة تشغيلية مباشرة بلا كاش جديد وفق العقد. تبقى مدة الاستجابة وخطة SQL وظهور مؤشر التحميل في النافذة تحققًا منفصلًا لدى الجذر والمالك.
