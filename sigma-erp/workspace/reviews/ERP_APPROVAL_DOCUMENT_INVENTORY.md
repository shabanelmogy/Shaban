# ERP approval document inventory

## خط أساس الجرد وتحديث البند١ — ١٥ نوفمبر ٢٠٢٦

الجرد الأصلي يحفظ ترتيب ٧٧ بندًا. بعد تنفيذ البند١، يرسل مصدر Settings عدد ٧٦ نوعًا. يربط [تقرير المراجعة المحدث](ERP_APPROVAL_ALL_ITEMS_SOURCE_REVIEW_20261115.md) الأسماء الإنجليزية بالشاشات ومفاتيح المستندات ومسارات الموافقة. الجدول أدناه يوثق خط الأساس السابق. القبول التشغيلي والتأكد من خيارات الخادم الفعلي معلقان.

**متابعة نقص قائمة الأنواع الذي أبلغ عنه المالك:** المطابقة أدناه تخص٧٧ نوعًا
مسجلًا فقط، ولا تقرر أن جميع شاشات التعاملات جرى حصرها أو أن استجابة الخادم
الجاري تعرضها. روجع الكود الحالي: لا ترشيح أو تقطيع لمصفوفة documents في
واجهة الإعدادات، والمصدر يرجع الكتالوج كله. نسخة الخادم الجارية من مجلد
ServerAPI/bin/Debug/net10.0 بدأت بعد وقت تجميعها؛ لا يوجد دليل كافٍ للجزم
بأن المشكلة نسخة قديمة. طلب عدد documents/استجابتها وأسماء الأنواع المفقودة
للتمييز بين نقص الكتالوج ونقص الاستجابة/العرض؛ لم ينفذ HTTP أو متصفح.

مرشح إضافي للمرحلة١: مسار `/Loans` في `src/app/pages/routing.ts:1341`
يرتبط بـLoans_Routes، ولا يوجد نوع Loan في الكتالوج الحالي. وجود المسار
يثبت وجوب تصنيفه ومطابقة مستنده، ولا يقرر تلقائيًا إضافة Approval له أو
لأطفاله `/LoanEMI` و`/LoanDetails`. لا تُغلق شمولية Settings بمطابقة الكتالوج
بنفسه؛ يلزم مقارنة مستقلة بقائمة الشاشات المرشحة وقرار الانطباق.

هذا جدول بدء المراجعة، ويكمل الجرد التاريخي أدناه. الحالة Draft، والتحقق التشغيلي معلق. كل صف نوع مستند في الكتالوج، وليس بالضرورة شاشة مستقلة؛ قد تشترك الأنواع في شاشة أو تكون صفحة عملية تنتج مستندًا. وجود النوع لا يعني تفعيل سياسة له أو اكتمال الأثر أو واجهته.

المطابقة المصدرية: DocumentApprovalCatalog.Entries ← DocumentApprovalSource.GetDocumentTypes ← DocumentApprovalService.WorkspaceAsync.Documents ← ApprovalsComponent.catalog.documents ← options الخاصة بقائمة نوع المستند. المسار يمرر كل الأنواع دون قائمة انتقائية في الواجهة. لا يثبت ذلك استجابة الخادم الجاري أو خيارات قاعدة بيانات بعينها؛ لم ينفذ HTTP أو متصفح.

عمود المسار يثبت وجود اسم مطابق في ملف التنقل الجذري فقط؛ لا يثبت مسار المحرر أو مطابقته لنوع المستند. يحتاج النوع غير المطابق إلى ربط صريح بالشاشة/العملية/النوع الفرعي. عمود البوابة يثبت ذكر الاسم في NativeSources فقط؛ ما زال تتبع الأفعال والمرشح والخدمة والتأثير مطلوبًا، خصوصًا الوراثة والفواتير متعددة الأنواع.

| رقم | الوحدة | اسم المستند | مفتاح النوع | ضمن مصدر قائمة Settings | مرشح مسار مطابق | الاسم في NativeSources | المراجعة التفصيلية |
|---|---|---|---|---|---|---|---|
| 1 | rental | الاتفاقيات العامة — General Agreements | `Agreement` | استُبعد بالتنفيذ | قراءة مشتركة لفاتورة النقل | غير مسجل | نُفذت المعالجة والقبول التشغيلي معلق |
| 2 | finance | فواتير الدفعات الضريبية | `TaxAdvanceInvoice` | نعم — مصدريًا | `/Invoice/tax-advance` | إجراء Invoice.Approve يخص Rental؛ قرار A002 للأثر | مراجعة مصدرية مع ملاحظات؛ المتابعة في السجل |
| 3 | rental | الحجوزات | `Booking` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 4 | rental | اتفاقيات التأجير | `RentalAgreement` | نعم — مصدريًا | `/RentalAgreement` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 5 | lease | اتفاقيات التأجير الطويل | `LeaseAgreement` | نعم — مصدريًا | `/LeaseAgreement` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 6 | sales | اتفاقيات البيع | `SalesAgreement` | نعم — مصدريًا | `/SalesAgreement` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 7 | transportation | اتفاقيات النقل | `TransportationAgreement` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 8 | limousine | حجوزات الرحلات | `TripBooking` | نعم — مصدريًا | `/TripBooking` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 9 | procurement | طلبات الشراء | `PurchaseRequest` | نعم — مصدريًا | `/PurchaseRequest` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 10 | procurement | أوامر الشراء | `PurchaseOrder` | نعم — مصدريًا | `/PurchaseOrder` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 11 | procurement | سندات استلام البضاعة | `GoodsReceivedNote` | نعم — مصدريًا | `/GoodsReceivedNote` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 12 | procurement | مرتجعات المشتريات | `PurchaseReturn` | نعم — مصدريًا | `/PurchaseReturn` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 13 | finance | فواتير الموردين | `Bill` | نعم — مصدريًا | `/Bill` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 14 | finance | الإشعارات الدائنة | `CreditNote` | نعم — مصدريًا | `/CreditNote` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 15 | finance | الإشعارات المدينة | `DebitNote` | نعم — مصدريًا | `/DebitNote` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 16 | finance | دفعات الاستحقاق | `Accruals` | نعم — مصدريًا | `/Accruals` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 17 | finance | دفعات الإطفاء | `Amortization` | نعم — مصدريًا | `/Amortization` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 18 | finance | الفواتير | `Invoice` | نعم — مصدريًا | `/Invoice` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 19 | finance | فواتير المطالبة | `BillingInvoice` | نعم — مصدريًا | `/BillingInvoice` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 20 | finance | الفواتير المتنوعة | `MiscellaneousInvoice` | نعم — مصدريًا | `/MiscellaneousInvoice` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 21 | finance | فواتير النقل | `TransportationInvoice` | نعم — مصدريًا | `/TransportationInvoice` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 22 | finance | فواتير الليموزين | `LimousineInvoice` | نعم — مصدريًا | `/LimousineInvoice` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 23 | finance | فواتير تأجير المعدات | `EquipmentRentalInvoice` | نعم — مصدريًا | `/EquipmentRentalInvoice` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 24 | finance | سندات القبض | `Receipt` | نعم — مصدريًا | `/Receipt` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 25 | finance | سندات الصرف | `Payment` | نعم — مصدريًا | `/Payment` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 26 | finance | القيود اليومية | `JournalVoucher` | نعم — مصدريًا | `/JournalVoucher` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 27 | sales | أوامر البيع | `SaleOrder` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 28 | banking | الإيداعات النقدية | `CashDeposit` | نعم — مصدريًا | `/CashDeposit` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 29 | banking | تحويلات البطاقات للبنوك | `CardTransactionBankTransfer` | نعم — مصدريًا | `/CardTransactionBankTransfer` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 30 | banking | ودائع العملاء | `CustomerDeposit` | نعم — مصدريًا | `/CustomerDeposit` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 31 | banking | الشيكات الواردة | `PDCReceivable` | نعم — مصدريًا | `/PDCReceivable` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 32 | banking | الشيكات الصادرة | `PDCPayable` | نعم — مصدريًا | `/PDCPayable` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 33 | inventory | تحويلات المخزون | `StockTransfer` | نعم — مصدريًا | `/StockTransfer` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 34 | inventory | سندات صرف المخزون | `ItemIssue` | نعم — مصدريًا | `/ItemIssue` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 35 | inventory | سندات مرتجع المخزون | `ItemReturn` | نعم — مصدريًا | `/ItemReturn` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 36 | delivery | سندات التسليم | `DeliveryNote` | نعم — مصدريًا | `/DeliveryNote` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 37 | delivery | حركات التسليم | `DeliveryMovement` | نعم — مصدريًا | `/DeliveryMovement` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 38 | fleet | الحركات خارج التأجير | `NonRentalMovement` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 39 | workshop | حركات الورشة | `WorkshopMovement` | نعم — مصدريًا | `/WorkshopMovement` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 40 | assets | الأصول | `Asset` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 41 | assets | تجهيزات بيع المعدات | `EquipmentSalePreparation` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 42 | contracts | اتفاقيات المعدات الرئيسية | `EquipmentMasterAgreement` | نعم — مصدريًا | `/EquipmentMasterAgreement` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 43 | contracts | اتفاقيات التأجير الطويل الرئيسية | `LeaseMasterAgreement` | نعم — مصدريًا | `/LeaseMasterAgreement` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 44 | contracts | اتفاقيات التأجير الرئيسية | `RentalMasterAgreement` | نعم — مصدريًا | تحتاج ربطًا صريحًا | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 45 | commercial | عروض أسعار المعدات | `Quotation` | نعم — مصدريًا | تحتاج ربطًا صريحًا | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 46 | commercial | عروض أسعار البيع | `SalesQuotation` | نعم — مصدريًا | `/SalesQuotation` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 47 | commercial | عروض التأجير الطويل | `LeaseQuotation` | نعم — مصدريًا | `/LeaseQuotation` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 48 | commercial | عروض التأجير | `RentalQuotation` | نعم — مصدريًا | `/RentalQuotation` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 49 | commercial | عروض الليموزين | `LimoQuotation` | نعم — مصدريًا | `/LimoQuotation` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 50 | fleet | مصروفات المركبات | `VehicleExpense` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 51 | fleet | حجوزات صيانة المركبات | `VehicleServiceBooking` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 52 | fleet | بلاغات الحوادث | `Accident` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 53 | workshop | بطاقات الأعمال | `Job` | نعم — مصدريًا | `/Job` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 54 | workshop | أوامر العمل | `WorkOrder` | نعم — مصدريًا | `/WorkOrder` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 55 | workshop | تقديرات الأعمال | `JobEstimation` | نعم — مصدريًا | `/JobEstimation` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 56 | staff | جداول ساعات المعدات | `TimeSheet` | نعم — مصدريًا | `/TimeSheet` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 57 | staff | سجلات الحضور | `Attendance` | نعم — مصدريًا | `/Attendance` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 58 | staff | سجلات العمل الإضافي | `Overtime` | نعم — مصدريًا | `/Overtime` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 59 | staff | طلبات الإجازة | `Leave` | نعم — مصدريًا | `/Leave` | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 60 | staff | دفعات الرواتب | `PayrollRuns` | نعم — مصدريًا | تحتاج ربطًا صريحًا | مذكور؛ الأفعال تحتاج تتبعًا | لم تبدأ |
| 61 | customer-service | طلبات العملاء | `CustomerRequest` | نعم — مصدريًا | `/CustomerRequest` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 62 | fleet-movement | حركات الاستلام | `CollectionMovement` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 63 | fleet-movement | حركات العهدة | `CustodyMovement` | نعم — مصدريًا | `/CustodyMovement` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 64 | staff-payroll | الاستقطاعات | `Deduction` | نعم — مصدريًا | `/Deduction` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 65 | assets | قيود الإهلاك | `DepreciationEntry` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 66 | fleet-staff | جداول ساعات السائقين | `DriverTimeSheet` | نعم — مصدريًا | `/DriverTimeSheet` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 67 | inventory | طلبات المخزون | `ItemRequisition` | نعم — مصدريًا | `/ItemRequisition` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 68 | lease | استفسارات التأجير الطويل | `LeaseInquiry` | نعم — مصدريًا | `/LeaseInquiry` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 69 | fleet-movement | الحركات غير الإيرادية | `NRM` | نعم — مصدريًا | `/NRM` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 70 | finance | المخصصات | `Provision` | نعم — مصدريًا | `/Provision` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 71 | staff-payroll | سندات الرواتب | `SalaryVoucher` | نعم — مصدريًا | `/SalaryVoucher` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 72 | staff | جداول ساعات الموظفين | `StaffTimesheet` | نعم — مصدريًا | `/StaffTimesheet` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 73 | support | طلبات الدعم | `SupportRequest` | نعم — مصدريًا | `/SupportRequest` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 74 | fleet | المخالفات المرورية | `TrafficFine` | نعم — مصدريًا | `/TrafficFine` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 75 | finance | المعاملات | `Transaction` | نعم — مصدريًا | `/Transaction` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 76 | operations | طلبات تصحيح البيانات | `DataEntryCorrection` | نعم — مصدريًا | `/DataEntryCorrection` | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |
| 77 | support | طلبات التغيير | `ChangeRequestModel` | نعم — مصدريًا | تحتاج ربطًا صريحًا | غير مذكور بهذا الاسم؛ يلزم التصنيف | لم تبدأ |

الملخص: 77 نوعًا، و31 اسمًا في سجل البوابة الأصلية، و60 مسارًا جذريًا مطابق الاسم. لا توجد شاشة مغلقة المراجعة بهذه المطابقة الآلية وحدها.

أعمدة التوسعة الإلزامية عند مراجعة كل صف: مسار الشاشة والمحرر والملف/الرمز؛ نوعه وعلاقته بالواجهة المركزية؛ الحكم في انطباق الموافقة؛ قرار التوقيت؛ GET/POST والعملية؛ مفتاح المنحة ومتطلباته والفرع المحفوظ؛ السياسة والخطوة واللقطة؛ أثر الحفظ والاعتماد والرفض والإلغاء؛ القراء والتقارير والمستندات المولدة؛ الاختبارات والبناء وHTTP/SQL والمتصفح؛ رابط العقد والدليل؛ الحالة والفجوة والقرار المطلوب.

لا يُضاف تعريف أو تقرير أو طفل مستند لمجرد وجود شاشة له. ويجب جرد شاشات العمليات المستبعدة السابقة (مثل MonthlyPosting وPayrollDisbursement وDepreciation) باعتبارها عمليات/مستهلكين وربطها بمستنداتها الفعلية بدل إسقاطها من خريطة الأثر أو إنشاء نوع موافقة مكرر.

الخطة الشاملة التي تحكم إغلاق هذه الصفوف: [خطة مراجعة الموافقات](ERP_APPROVAL_MAINTENANCE_EVOLUTION_PLAN.md). يحتفظ القسم التالي بالجرد السابق وأدلته التاريخية، ولا يمثل قبولًا تشغيليًا حاليًا.

## Status table

| Section | Status | Authority/evidence |
|---|---|---|
| Authoritative executable catalog | Historical baseline: 77 entries. Current source: 76. | `SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs` |
| Native approval signatures | Current discovery | `SigmaBackend/SiGma.Business/IServices/*.cs` |
| Earlier root/method discovery sections | Historical discovery; non-authoritative | Preserved for audit trail; superseded by executable catalog |

Status: Implemented — source-only inventory reconciliation. Application source implementation is recorded in the final reconciliation; no runtime verification was performed. Catalog expanded to non-approval business roots; approval applicability remains a separate native-action question.

Evidence roots:

- `SigmaBackend/SiGma.ServerAPI/Controller/*.cs`
- `SigmaBackend/SiGma.Business/IServices/*.cs`
- `SigmaBackend/SiGma.ViewModels/ViewModels/*Approval*Decision*.cs`
- `SigmaBackend/SiGma.Helpers/Models/**/*.cs`

## Historical discovery: document roots (superseded by executable catalog)

| Module | Controller | Service | CLR root type | Native identifier/status |
|---|---|---|---|---|
| Procurement | PurchaseRequestController | IPurchaseRequestService | SiGma.Helpers.Models.Purchases.PurchaseRequest | `int id`; ApprovalStatus |
| Procurement | PurchaseOrderController | IPurchaseOrderService | SiGma.Helpers.Models.Purchases.PurchaseOrder | `int id`; ApprovalStatus |
| Procurement | GoodsReceivedNoteController | IGoodsReceivedNoteService | SiGma.Helpers.Models.Purchases.GoodsReceivedNote | `int id`; ApprovalStatus |
| Procurement | PurchaseReturnController | IPurchaseReturnService | SiGma.Helpers.Models.Purchases.PurchaseReturn | `int id`; ApprovalStatus |
| Procurement | BillController | IBillService | SiGma.Helpers.Models.Vouchers.Bill | `int id`; ApprovalStatus |
| Inventory | StockTransferController | IStockTransferService | SiGma.Helpers.Models.Stocks.StockTransfer | `int id`; ApprovalStatus |
| Inventory | ItemIssueController | IItemIssueService | SiGma.Helpers.Models.Stocks.ItemIssue | `int id`; ApprovalStatus |
| Inventory | ItemReturnController | IItemReturnService | SiGma.Helpers.Models.Stocks.ItemReturn | `int id`; ApprovalStatus |
| Inventory | CreditNoteController | ICreditNoteService | SiGma.Helpers.Models.Vouchers.CreditNote | `int id`; ApprovalStatus |
| Inventory | DebitNoteController | IDebitNoteService | SiGma.Helpers.Models.Vouchers.DebitNote | `int id`; ApprovalStatus |
| Finance | ReceiptController | IReceiptService | SiGma.Helpers.Models.Vouchers.Receipt | `int id`; ApprovalStatus |
| Finance | PaymentController | IPaymentService | SiGma.Helpers.Models.Vouchers.Payment | `int id`; ApprovalStatus |
| Finance | JournalVoucherController | IJournalVoucherService | SiGma.Helpers.Models.Vouchers.JournalVoucher | `int id`; ApprovalStatus |
| Finance | InvoiceController | IInvoiceService/IInvoiceActionService | SiGma.Helpers.Models.Vouchers.Invoice | `int invoiceId`; approval/posting state |
| Finance | EquipmentRentalInvoiceController | IEquipmentRentalInvoiceService | SiGma.Helpers.Models.Vouchers.EquipmentRentalInvoice | `int id`; ApprovalStatus |
| Finance | CashDepositController | ICashDepositService | SiGma.Helpers.Models.Banking.CashDeposit | `int id`; ApprovalStatus |
| Finance | CardTransactionBankTransferController | ICardTransactionBankTransferService | SiGma.Helpers.Models.Banking.CardTransactionBankTransfer | `int id`; ApprovalStatus |
| Finance | AccrualsController | IAccrualsService | SiGma.Helpers.Models.Vouchers.AccrualRun | `int id`; ApprovalStatus |
| Finance | AmortizationController | IAmortizationService | SiGma.Helpers.Models.Vouchers.AmortizationRun | `int id`; ApprovalStatus |
| Commercial | QuotationController | IQuotationService | SiGma.DataAccess.Models.Quotation | `int id`; InternalApprovalEnum/CustomerApprovalEnum |
| Commercial | SalesQuotationController | ISalesQuotationService | SiGma.Helpers.Models.Sales.SalesQuotation | `int id`; InternalApprovalEnum/CustomerApprovalEnum |
| Commercial | RentalQuotationController | IRentalQuotationService | SiGma.Helpers.Models.Agreements.Rentals.RentalQuotation | `int id`; InternalApprovalEnum/CustomerApprovalEnum |
| Commercial | LeaseQuotationController | ILeaseQuotationService | SiGma.Helpers.Models.Agreements.Leases.LeaseQuotation | `int id`; InternalApprovalEnum/CustomerApprovalEnum |
| Commercial | LimoQuotationController | ILimoQuotationService | SiGma.Helpers.Models.Limousines.LimoQuotation | `int id`; internal/customer axes |
| Contracts | EquipmentMasterAgreementController | IEquipmentMasterAgreementService | SiGma.Helpers.Models.Agreements.Equipment.EquipmentMasterAgreement | `int id`; ApprovalStatus |
| Contracts | LeaseMasterAgreementController | ILeaseMasterAgreementService | SiGma.Helpers.Models.Agreements.Leases.LeaseMasterAgreement | `int id`; ApprovalStatus |
| Contracts | RentalMasterAgreementController | IRentalMasterAgreementService | SiGma.Helpers.Models.Agreements.Rentals.RentalMasterAgreement | `int id`; ApprovalStatus |
| Operations/HR | TimeSheetController | ITimeSheetService | SiGma.Helpers.Models.Staffs.TimeSheet | `int id`; ApprovalStatus |
| Operations/HR | LeaveController | ILeaveService | SiGma.Helpers.Models.Staffs.Leave | `int id`; leave approval state |
| Operations/HR | PayrollRunsController | IPayrollRunService | SiGma.Helpers.Models.Staffs.PayrollRun | `int id`; payroll state |
| Operations | JobEstimationController | IJobEstimationService | SiGma.Helpers.Models.Workshops.JobEstimations.JobEstimation | `int id`; ApprovalStatus |
| Operations | WorkOrderController | IWorkOrderService | SiGma.Helpers.Models.Workshops.WorkOrders.WorkOrder | `int id`; AcceptanceStatus (not approval) |

## Historical discovery: native approval decision methods

All methods below return `Task<Result>` unless a result type is shown. All cancellation parameters are `CancellationToken` unless noted.

- Accruals: `GetApprovalAsync(int id, CancellationToken ct=default)`; `DecideAsync(int id, AccrualDecisionVM vm, CancellationToken ct=default)`.
- Amortization: `GetApprovalAsync(int id, CancellationToken ct=default)`; `DecideAsync(int id, AmortizationDecisionVM vm, CancellationToken ct=default)`.
- Bill: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, BillApprovalDecisionVM vm, CancellationToken cancellationToken=default)`; `ApproveAsync(int id, CancellationToken cancellationToken=default)`; `UnapproveAsync(int id, CancellationToken cancellationToken=default, string? reason=null)`.
- Goods received note: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, GoodsReceivedNoteApprovalDecisionVM vm, CancellationToken cancellationToken=default)`.
- Item issue: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, ItemIssueApprovalDecisionVM vm, CancellationToken cancellationToken=default)`.
- Item return: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, ItemReturnApprovalDecisionVM vm, CancellationToken cancellationToken=default)`.
- Journal voucher: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, JournalVoucherApprovalDecisionVM vm, CancellationToken cancellationToken=default)`; `ApproveAsync(int id, CancellationToken cancellationToken=default)`; `UnApproveAsync(int id, JournalVoucherApprovalDecisionVM vm, CancellationToken cancellationToken=default)`. Source XML states approve means post and unapprove means unpost.
- Payment: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, PaymentDecisionVM vm, CancellationToken cancellationToken=default)`.
- Purchase order: `ToggleApprovalStatusAsync(int id, CancellationToken cancellationToken=default)`; `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, PurchaseOrderApprovalDecisionVM vm, CancellationToken cancellationToken=default)`.
- Purchase request: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, PurchaseRequestApprovalDecisionVM vm, CancellationToken cancellationToken=default)`.
- Purchase return: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, PurchaseReturnApprovalDecisionVM vm, CancellationToken cancellationToken=default)`.
- Receipt: `ToggleApprovalStatusAsync(int id, CancellationToken cancellationToken=default)`; `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, ReceiptDecisionVM request, CancellationToken cancellationToken=default)`.
- Stock transfer: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideApprovalAsync(int id, StockTransferApprovalDecisionVM vm, CancellationToken cancellationToken=default)`.
- Time sheet: `GetApprovalAsync(int id, CancellationToken cancellationToken=default)`; `DecideAsync(int id, TimeSheetDecisionVM vm, CancellationToken cancellationToken=default)`.
- Card transfer, cash deposit, credit note, debit note: `ToggleApprovalStatusAsync(int id, CancellationToken cancellationToken=default)`.
- Invoice: `ApproveAsync(int invoiceId, CancellationToken cancellationToken=default)`; `UnApproveAsync(int invoiceId, CancellationToken cancellationToken=default)`.
- Equipment/lease/rental master agreements: `ApproveAsync(int id, CancellationToken cancellationToken=default)`.
- Job estimation: `ChangeApprovalStatusAsync(int id, ApprovalStatus approvalStatus)` (no cancellation token).
- Payroll: `ApproveAsync(int id, PayrollApproveVm request, CancellationToken cancellationToken=default)`.
- Leave: `ApproveAsync(int id, LeaveApproveVM request, CancellationToken cancellationToken=default)` and `RejectAsync(int id, LeaveRejectVM request, CancellationToken cancellationToken=default)`, returning `Result<LeaveDetailVM>`.
- Work order: `RejectAsync(int id, CancellationToken cancellationToken=default)`; this changes AcceptanceStatus, not ApprovalStatus.

## Multi-axis native actions

- Quotation: internal approve/reject, customer approve/reject, unapprove; all `(int id, CancellationToken)`.
- Lease/Rental/Sales quotation: internal approve `(id, CT)`, internal reject `(id, string reason, CT)`, customer approve `(id, CT)`, customer reject `(id, string reason, CT)`, unapprove `(id, CT)`.
- Limo quotation: internal approve/reject and customer approve/reject; all `(id, CT)`, with no reason parameter.

These are backed by separate internal/customer approval axes and must not be collapsed into one ApprovalStatus.

## DTO status/reason findings

Decision DTOs with status and reason: Accrual, Amortization, Bill, GoodsReceivedNote, JournalVoucher, Payment, PurchaseOrder, PurchaseRequest, PurchaseReturn, Receipt, TimeSheet. ItemIssue, ItemReturn and StockTransfer decision DTOs expose ApprovalStatus but no Reason was observed. Status is nullable in most DTOs; JournalVoucher, Payment, Receipt and TimeSheet use non-nullable status. Several reason fields have a 500-character cap; no explicit cap was observed in Bill, Payment or PurchaseOrder DTOs.

## Exclusions and unresolved facts

ApprovalLevelController and SettingsApprovalModelController are settings/reference, not document roots. FiscalYear verification and MonthClose actions are period controls. Reports, reconciliation reads and child rows are excluded. Approval logs, transaction locks, route permissions and tenant scope must be confirmed in service implementations; this inventory does not infer them.

## Historical discovery: machine-usable all-document root catalog

Format: `controllerKey|fullyQualifiedClrType|module`. These are root business documents/entities exposed by controllers; settings, references, reports and child-row controllers are omitted. A root can have no approval action today.

```text
Booking|SiGma.Helpers.Models.Agreements.Rentals.Booking|rental
RentalAgreement|SiGma.Helpers.Models.Agreements.Rentals.RentalAgreement|rental
LeaseAgreement|SiGma.Helpers.Models.Agreements.Leases.LeaseAgreement|lease
SalesAgreement|SiGma.Helpers.Models.Sales.SalesAgreement|sales
TransportationAgreement|SiGma.Helpers.Models.Agreements.Transportations.TransportationAgreement|transportation
TripBooking|SiGma.Helpers.Models.Limousines.TripBooking|limousine
PurchaseRequest|SiGma.Helpers.Models.Purchases.PurchaseRequest|procurement
PurchaseOrder|SiGma.Helpers.Models.Purchases.PurchaseOrder|procurement
GoodsReceivedNote|SiGma.Helpers.Models.Purchases.GoodsReceivedNote|procurement
PurchaseReturn|SiGma.Helpers.Models.Purchases.PurchaseReturn|procurement
Bill|SiGma.Helpers.Models.Vouchers.Bill|finance
Invoice|SiGma.Helpers.Models.Vouchers.Invoice|finance
BillingInvoice|SiGma.Helpers.Models.Vouchers.BillingInvoice|finance
MiscellaneousInvoice|SiGma.Helpers.Models.Vouchers.MiscellaneousInvoice|finance
TransportationInvoice|SiGma.Helpers.Models.Vouchers.TransportationInvoice|finance
LimousineInvoice|SiGma.Helpers.Models.Vouchers.LimousineInvoice|finance
EquipmentRentalInvoice|SiGma.Helpers.Models.Vouchers.EquipmentRentalInvoice|finance
Receipt|SiGma.Helpers.Models.Vouchers.Receipt|finance
Payment|SiGma.Helpers.Models.Vouchers.Payment|finance
JournalVoucher|SiGma.Helpers.Models.Vouchers.JournalVoucher|finance
SaleOrder|SiGma.Helpers.Models.Vouchers.SaleOrder|sales
StockTransfer|SiGma.Helpers.Models.Stocks.StockTransfer|inventory
ItemIssue|SiGma.Helpers.Models.Stocks.ItemIssue|inventory
ItemReturn|SiGma.Helpers.Models.Stocks.ItemReturn|inventory
DeliveryNote|SiGma.Helpers.Models.DeliveryNote|delivery
DeliveryMovement|SiGma.Helpers.Models.Movements.DeliveryMovement|delivery
NonRentalMovement|SiGma.Helpers.Models.Movements.NonRentalMovement|fleet
WorkshopMovement|SiGma.Helpers.Models.Movements.WorkshopMovement|workshop
CustomerRequest|SiGma.Helpers.Models.Administrations.CustomerRequest|customer-service
CustomerDeposit|SiGma.Helpers.Models.Banking.CustomerDeposit|banking
PDCReceivable|SiGma.Helpers.Models.Banking.PDCReceivable|banking
PDCPayable|SiGma.Helpers.Models.Banking.PDCPayable|banking
Asset|SiGma.Helpers.Models.Assets.Asset|assets
EquipmentSalePreparation|SiGma.Helpers.Models.Assets.EquipmentSalePreparation|assets
VehicleExpense|SiGma.Helpers.Models.Vehicles.VehicleExpense|fleet
VehicleService|SiGma.Helpers.Models.ServicesModels.VehicleService|fleet
VehicleServiceBooking|SiGma.Helpers.Models.ServicesModels.VehicleServiceBooking|fleet
Accident|SiGma.Helpers.Models.Accident|fleet
Warranty|SiGma.Helpers.Models.Warranty|assets
Job|SiGma.Helpers.Models.Workshops.Jobs.Job|workshop
Workshop|SiGma.Helpers.Models.Workshops.WorkShops.Workshop|workshop
WorkOrder|SiGma.Helpers.Models.Workshops.WorkOrders.WorkOrder|workshop
JobEstimation|SiGma.Helpers.Models.Workshops.JobEstimations.JobEstimation|workshop
TimeSheet|SiGma.Helpers.Models.Staffs.TimeSheet|staff
Attendance|SiGma.Helpers.Models.Staffs.Attendance|staff
Overtime|SiGma.Helpers.Models.Staffs.Overtime|staff
Leave|SiGma.Helpers.Models.Staffs.Leave|staff
PayrollRun|SiGma.Helpers.Models.Staffs.PayrollRun|staff
```

The following controller keys are intentionally not promoted to roots here: `*Settings`, `*Report`, `*Item`, `*Detail`, `*Line`, `*Part`, `*Document`, `*Requirement`, lookup/reference masters, authorization/security, and dashboard/report transport controllers. Their exact relationship is either configuration/reference or a child of one of the roots above.

## Historical discovery: final machine catalog with proof paths (superseded)

The lines below are the consumable form (`key|fullyQualifiedType|module|model declaration path`). Every type in this section was confirmed by a `class` declaration and its first `namespace` declaration in the listed file.

```text
Booking|SiGma.Helpers.Models.Agreements.Rentals.Booking|rental|SiGma.Helpers/Models/Agreements/Rentals/Booking.cs
RentalAgreement|SiGma.Helpers.Models.Agreements.Rentals.RentalAgreement|rental|SiGma.Helpers/Models/Agreements/Rentals/RentalAgreement.cs
LeaseAgreement|SiGma.Helpers.Models.Agreements.Leases.LeaseAgreement|lease|SiGma.Helpers/Models/Agreements/Leases/LeaseAgreement.cs
SalesAgreement|SiGma.Helpers.Models.Sales.SalesAgreement|sales|SiGma.Helpers/Models/Sales/SalesAgreement.cs
TransportationAgreement|SiGma.Helpers.Models.Agreements.Transportations.TransportationAgreement|transportation|SiGma.Helpers/Models/Agreements/Transportations/TransportationAgreement.cs
TripBooking|SiGma.Helpers.Models.Limousines.TripBooking|limousine|SiGma.Helpers/Models/Limousines/TripBooking.cs
PurchaseRequest|SiGma.Helpers.Models.Purchases.PurchaseRequest|procurement|SiGma.Helpers/Models/Purchases/PurchaseRequest.cs
PurchaseOrder|SiGma.Helpers.Models.Purchases.PurchaseOrder|procurement|SiGma.Helpers/Models/Purchases/PurchaseOrder.cs
GoodsReceivedNote|SiGma.Helpers.Models.Purchases.GoodsReceivedNote|procurement|SiGma.Helpers/Models/Purchases/GoodsReceivedNote.cs
PurchaseReturn|SiGma.Helpers.Models.Purchases.PurchaseReturn|procurement|SiGma.Helpers/Models/Purchases/PurchaseReturn.cs
Bill|SiGma.Helpers.Models.Vouchers.Bill|finance|SiGma.Helpers/Models/Vouchers/Bill.cs
CreditNote|SiGma.Helpers.Models.Vouchers.CreditNote|finance|SiGma.Helpers/Models/Vouchers/CreditNote.cs
DebitNote|SiGma.Helpers.Models.Vouchers.DebitNote|finance|SiGma.Helpers/Models/Vouchers/DebitNote.cs
Accruals|SiGma.Helpers.Models.Vouchers.AccrualRun|finance|SiGma.Helpers/Models/Vouchers/AccrualRun.cs
Amortization|SiGma.Helpers.Models.Vouchers.AmortizationRun|finance|SiGma.Helpers/Models/Vouchers/AmortizationRun.cs
Invoice|SiGma.Helpers.Models.Vouchers.Invoice|finance|SiGma.Helpers/Models/Vouchers/Invoice.cs
BillingInvoice|SiGma.Helpers.Models.Vouchers.BillingInvoice|finance|SiGma.Helpers/Models/Vouchers/BillingInvoice.cs
MiscellaneousInvoice|SiGma.Helpers.Models.Vouchers.MiscellaneousInvoice|finance|SiGma.Helpers/Models/Vouchers/MiscellaneousInvoice.cs
TransportationInvoice|SiGma.Helpers.Models.Vouchers.TransportationInvoice|finance|SiGma.Helpers/Models/Vouchers/TransportationInvoice.cs
LimousineInvoice|SiGma.Helpers.Models.Vouchers.LimousineInvoice|finance|SiGma.Helpers/Models/Vouchers/LimousineInvoice.cs
EquipmentRentalInvoice|SiGma.Helpers.Models.Vouchers.EquipmentRentalInvoice|finance|SiGma.Helpers/Models/Vouchers/EquipmentRentalInvoice.cs
Receipt|SiGma.Helpers.Models.Vouchers.Receipt|finance|SiGma.Helpers/Models/Vouchers/Receipt.cs
Payment|SiGma.Helpers.Models.Vouchers.Payment|finance|SiGma.Helpers/Models/Vouchers/Payment.cs
JournalVoucher|SiGma.Helpers.Models.Vouchers.JournalVoucher|finance|SiGma.Helpers/Models/Vouchers/JournalVoucher.cs
SaleOrder|SiGma.Helpers.Models.Vouchers.SaleOrder|sales|SiGma.Helpers/Models/Vouchers/SaleOrder.cs
CashDeposit|SiGma.Helpers.Models.Banking.CashDeposit|banking|SiGma.Helpers/Models/Banking/CashDeposit.cs
CardTransactionBankTransfer|SiGma.Helpers.Models.Banking.CardTransactionBankTransfer|banking|SiGma.Helpers/Models/Banking/CardTransactionBankTransfer.cs
CustomerDeposit|SiGma.Helpers.Models.Banking.CustomerDeposit|banking|SiGma.Helpers/Models/Banking/CustomerDeposit.cs
PDCReceivable|SiGma.Helpers.Models.Banking.PDCReceivable|banking|SiGma.Helpers/Models/Banking/PDCReceivable.cs
PDCPayable|SiGma.Helpers.Models.Banking.PDCPayable|banking|SiGma.Helpers/Models/Banking/PDCPayable.cs
StockTransfer|SiGma.Helpers.Models.Stocks.StockTransfer|inventory|SiGma.Helpers/Models/Stocks/StockTransfer.cs
ItemIssue|SiGma.Helpers.Models.Stocks.ItemIssue|inventory|SiGma.Helpers/Models/Stocks/ItemIssue.cs
ItemReturn|SiGma.Helpers.Models.Stocks.ItemReturn|inventory|SiGma.Helpers/Models/Stocks/ItemReturn.cs
DeliveryNote|SiGma.Helpers.Models.DeliveryNote|delivery|SiGma.Helpers/Models/DeliveryNote.cs
DeliveryMovement|SiGma.Helpers.Models.Movements.DeliveryMovement|delivery|SiGma.Helpers/Models/Movements/DeliveryMovement.cs
NonRentalMovement|SiGma.Helpers.Models.Movements.NonRentalMovement|fleet|SiGma.Helpers/Models/Movements/NonRentalMovement.cs
WorkshopMovement|SiGma.Helpers.Models.Movements.WorkshopMovement|workshop|SiGma.Helpers/Models/Movements/WorkshopMovement.cs
Asset|SiGma.Helpers.Models.Assets.Asset|assets|SiGma.Helpers/Models/Assets/Asset.cs
EquipmentSalePreparation|SiGma.Helpers.Models.Assets.EquipmentSalePreparation|assets|SiGma.Helpers/Models/Assets/EquipmentSalePreparation.cs
EquipmentMasterAgreement|SiGma.Helpers.Models.Agreements.Equipment.EquipmentMasterAgreement|contracts|SiGma.Helpers/Models/Agreements/Equipment/EquipmentMasterAgreement.cs
LeaseMasterAgreement|SiGma.Helpers.Models.Agreements.Leases.LeaseMasterAgreement|contracts|SiGma.Helpers/Models/Agreements/Leases/LeaseMasterAgreement.cs
RentalMasterAgreement|SiGma.Helpers.Models.Agreements.Rentals.RentalMasterAgreement|contracts|SiGma.Helpers/Models/Agreements/Rentals/RentalMasterAgreement.cs
Quotation|SiGma.DataAccess.Models.Quotation|commercial|SiGma.Helpers/Models/Quotation.cs
SalesQuotation|SiGma.Helpers.Models.Sales.SalesQuotation|commercial|SiGma.Helpers/Models/Sales/SalesQuotation.cs
LeaseQuotation|SiGma.Helpers.Models.Agreements.Leases.LeaseQuotation|commercial|SiGma.Helpers/Models/Agreements/Leases/LeaseQuotation.cs
RentalQuotation|SiGma.Helpers.Models.Agreements.Rentals.RentalQuotation|commercial|SiGma.Helpers/Models/Agreements/Rentals/RentalQuotation.cs
LimoQuotation|SiGma.Helpers.Models.Limousines.LimoQuotation|commercial|SiGma.Helpers/Models/Limousines/LimoQuotation.cs
VehicleExpense|SiGma.Helpers.Models.Vehicles.VehicleExpense|fleet|SiGma.Helpers/Models/Vehicles/VehicleExpense.cs
VehicleService|SiGma.Helpers.Models.ServicesModels.VehicleService|fleet|SiGma.Helpers/Models/ServicesModels/VehicleService.cs
VehicleServiceBooking|SiGma.Helpers.Models.ServicesModels.VehicleServiceBooking|fleet|SiGma.Helpers/Models/ServicesModels/VehicleServiceBooking.cs
Accident|SiGma.Helpers.Models.Accident|fleet|SiGma.Helpers/Models/Accident.cs
Warranty|SiGma.Helpers.Models.Warranty|assets|SiGma.Helpers/Models/Warranty.cs
Job|SiGma.Helpers.Models.Workshops.Jobs.Job|workshop|SiGma.Helpers/Models/Workshops/Jobs/Job.cs
Workshop|SiGma.Helpers.Models.Workshops.WorkShops.Workshop|workshop|SiGma.Helpers/Models/Workshops/WorkShops/Workshop.cs
WorkOrder|SiGma.Helpers.Models.Workshops.WorkOrders.WorkOrder|workshop|SiGma.Helpers/Models/Workshops/WorkOrders/WorkOrder.cs
JobEstimation|SiGma.Helpers.Models.Workshops.JobEstimations.JobEstimation|workshop|SiGma.Helpers/Models/Workshops/JobEstimations/JobEstimation.cs
TimeSheet|SiGma.Helpers.Models.Staffs.TimeSheet|staff|SiGma.Helpers/Models/Staffs/TimeSheet.cs
Attendance|SiGma.Helpers.Models.Staffs.Attendance|staff|SiGma.Helpers/Models/Staffs/Attendance.cs
Overtime|SiGma.Helpers.Models.Staffs.Overtime|staff|SiGma.Helpers/Models/Staffs/Overtime.cs
Leave|SiGma.Helpers.Models.Staffs.Leave|staff|SiGma.Helpers/Models/Staffs/Leave.cs
PayrollRun|SiGma.Helpers.Models.Staffs.PayrollRun|staff|SiGma.Helpers/Models/Staffs/PayrollRun.cs
CustomerRequest|SiGma.Helpers.Models.Administrations.CustomerRequest|customer-service|SiGma.Helpers/Models/Administrations/CustomerRequest.cs
Project|SiGma.Helpers.Models.Project|project|SiGma.Helpers/Models/Project.cs
```

## Historical catalog baseline (77 entries)

Format: `key|fullyQualifiedType|module|proof path`. Keys, CLR types and modules are copied from the executable catalog; the proof path is the catalog source (which binds each CLR type with `typeof`). Model declaration paths are retained where they were established by the prior targeted reads.

```text
+Agreement|SiGma.Helpers.Models.Agreements.Agreement|rental|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
TaxAdvanceInvoice|SiGma.Helpers.Models.Vouchers.TaxAdvanceInvoice|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Booking|SiGma.Helpers.Models.Agreements.Rentals.Booking|rental|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
RentalAgreement|SiGma.Helpers.Models.Agreements.Rentals.RentalAgreement|rental|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
LeaseAgreement|SiGma.Helpers.Models.Agreements.Leases.LeaseAgreement|lease|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
SalesAgreement|SiGma.Helpers.Models.Sales.SalesAgreement|sales|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
TransportationAgreement|SiGma.Helpers.Models.Agreements.Transportations.TransportationAgreement|transportation|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
TripBooking|SiGma.Helpers.Models.Limousines.TripBooking|limousine|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
PurchaseRequest|SiGma.Helpers.Models.Purchases.PurchaseRequest|procurement|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
PurchaseOrder|SiGma.Helpers.Models.Purchases.PurchaseOrder|procurement|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
GoodsReceivedNote|SiGma.Helpers.Models.Purchases.GoodsReceivedNote|procurement|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
PurchaseReturn|SiGma.Helpers.Models.Purchases.PurchaseReturn|procurement|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Bill|SiGma.Helpers.Models.Vouchers.Bill|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
CreditNote|SiGma.Helpers.Models.Vouchers.CreditNote|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
DebitNote|SiGma.Helpers.Models.Vouchers.DebitNote|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Accruals|SiGma.Helpers.Models.Vouchers.AccrualRun|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Amortization|SiGma.Helpers.Models.Vouchers.AmortizationRun|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Invoice|SiGma.Helpers.Models.Vouchers.Invoice|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
BillingInvoice|SiGma.Helpers.Models.Vouchers.BillingInvoice|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
MiscellaneousInvoice|SiGma.Helpers.Models.Vouchers.MiscellaneousInvoice|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
TransportationInvoice|SiGma.Helpers.Models.Vouchers.TransportationInvoice|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
LimousineInvoice|SiGma.Helpers.Models.Vouchers.LimousineInvoice|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
EquipmentRentalInvoice|SiGma.Helpers.Models.Vouchers.EquipmentRentalInvoice|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Receipt|SiGma.Helpers.Models.Vouchers.Receipt|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Payment|SiGma.Helpers.Models.Vouchers.Payment|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
JournalVoucher|SiGma.Helpers.Models.Vouchers.JournalVoucher|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
SaleOrder|SiGma.Helpers.Models.Vouchers.SaleOrder|sales|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
CashDeposit|SiGma.Helpers.Models.Banking.CashDeposit|banking|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
CardTransactionBankTransfer|SiGma.Helpers.Models.Banking.CardTransactionBankTransfer|banking|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
CustomerDeposit|SiGma.Helpers.Models.Banking.CustomerDeposit|banking|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
PDCReceivable|SiGma.Helpers.Models.Banking.PDCReceivable|banking|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
PDCPayable|SiGma.Helpers.Models.Banking.PDCPayable|banking|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
StockTransfer|SiGma.Helpers.Models.Stocks.StockTransfer|inventory|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
ItemIssue|SiGma.Helpers.Models.Stocks.ItemIssue|inventory|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
ItemReturn|SiGma.Helpers.Models.Stocks.ItemReturn|inventory|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
DeliveryNote|SiGma.Helpers.Models.DeliveryNote|delivery|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
DeliveryMovement|SiGma.Helpers.Models.Movements.DeliveryMovement|delivery|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
NonRentalMovement|SiGma.Helpers.Models.Movements.NonRentalMovement|fleet|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
WorkshopMovement|SiGma.Helpers.Models.Movements.WorkshopMovement|workshop|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Asset|SiGma.Helpers.Models.Assets.Asset|assets|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
EquipmentSalePreparation|SiGma.Helpers.Models.Assets.EquipmentSalePreparation|assets|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
EquipmentMasterAgreement|SiGma.Helpers.Models.Agreements.Equipment.EquipmentMasterAgreement|contracts|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
LeaseMasterAgreement|SiGma.Helpers.Models.Agreements.Leases.LeaseMasterAgreement|contracts|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
RentalMasterAgreement|SiGma.Helpers.Models.Agreements.Rentals.RentalMasterAgreement|contracts|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Quotation|SiGma.DataAccess.Models.Quotation|commercial|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
SalesQuotation|SiGma.Helpers.Models.Sales.SalesQuotation|commercial|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
LeaseQuotation|SiGma.Helpers.Models.Agreements.Leases.LeaseQuotation|commercial|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
RentalQuotation|SiGma.Helpers.Models.Agreements.Rentals.RentalQuotation|commercial|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
LimoQuotation|SiGma.Helpers.Models.Limousines.LimoQuotation|commercial|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
VehicleExpense|SiGma.Helpers.Models.Vehicles.VehicleExpense|fleet|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
VehicleServiceBooking|SiGma.Helpers.Models.ServicesModels.VehicleServiceBooking|fleet|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Accident|SiGma.Helpers.Models.Accident|fleet|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Job|SiGma.Helpers.Models.Workshops.Jobs.Job|workshop|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
WorkOrder|SiGma.Helpers.Models.Workshops.WorkOrders.WorkOrder|workshop|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
JobEstimation|SiGma.Helpers.Models.Workshops.JobEstimations.JobEstimation|workshop|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
TimeSheet|SiGma.Helpers.Models.Staffs.TimeSheet|staff|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Attendance|SiGma.Helpers.Models.Staffs.Attendance|staff|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Overtime|SiGma.Helpers.Models.Staffs.Overtime|staff|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Leave|SiGma.Helpers.Models.Staffs.Leave|staff|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
PayrollRuns|SiGma.Helpers.Models.Staffs.PayrollRun|staff|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
CustomerRequest|SiGma.Helpers.Models.Administrations.CustomerRequest|customer-service|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
CollectionMovement|SiGma.Helpers.Models.Movements.CollectionMovement|fleet-movement|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
CustodyMovement|SiGma.Helpers.Models.Movements.CustodyMovement|fleet-movement|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Deduction|SiGma.Helpers.Models.Staffs.Deduction|staff-payroll|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
DepreciationEntry|SiGma.Helpers.Models.Assets.DepreciationEntry|assets|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
DriverTimeSheet|SiGma.Helpers.Models.DriverTimeSheet|fleet-staff|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
ItemRequisition|SiGma.Helpers.Models.Stocks.ItemRequisition|inventory|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
LeaseInquiry|SiGma.Helpers.Models.Agreements.Leases.LeaseInquiry|lease|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
NRM|SiGma.Helpers.Models.Movements.NRM|fleet-movement|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Provision|SiGma.Helpers.Models.Provision|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
SalaryVoucher|SiGma.Helpers.Models.SalaryVoucher|staff-payroll|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
StaffTimesheet|SiGma.Helpers.Models.Staffs.StaffTimesheet|staff|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
SupportRequest|SiGma.Helpers.Models.SupportRequest|support|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
TrafficFine|SiGma.Helpers.Models.Vouchers.TrafficFine|fleet|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
Transaction|SiGma.Helpers.Models.Transaction|finance|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
DataEntryCorrection|SiGma.Helpers.Models.DataEntryCorrection|operations|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
ChangeRequestModel|SiGma.Helpers.Models.ChangeRequestModel|support|SigmaBackend/SiGma.Helpers/Approvals/DocumentApprovalCatalog.cs
```

## Bounded omission pass

The following requested controllers were checked against their controller actions and model declarations:

```text
CollectionMovement|SiGma.Helpers.Models.Movements.CollectionMovement|fleet-movement|SiGma.Helpers/Models/Movements/CollectionMovement.cs
CustodyMovement|SiGma.Helpers.Models.Movements.CustodyMovement|fleet-movement|SiGma.Helpers/Models/Movements/CustodyMovement.cs
Deduction|SiGma.Helpers.Models.Staffs.Deduction|staff-payroll|SiGma.Helpers/Models/Staffs/Deduction.cs
DepreciationEntry|SiGma.Helpers.Models.Assets.DepreciationEntry|assets|SiGma.Helpers/Models/Assets/DepreciationEntry.cs
DriverTimeSheet|SiGma.Helpers.Models.DriverTimeSheet|fleet-staff|SiGma.Helpers/Models/DriverTimeSheet.cs
ItemRequisition|SiGma.Helpers.Models.Stocks.ItemRequisition|inventory|SiGma.Helpers/Models/Stocks/ItemRequisition.cs
LeaseInquiry|SiGma.Helpers.Models.Agreements.Leases.LeaseInquiry|lease|SiGma.Helpers/Models/Agreements/Leases/LeaseInquiry.cs
NRM|SiGma.Helpers.Models.Movements.NRM|fleet-movement|SiGma.Helpers/Models/Movements/NRM.cs
Provision|SiGma.Helpers.Models.Provision|finance|SiGma.Helpers/Models/Provision.cs
SalaryVoucher|SiGma.Helpers.Models.SalaryVoucher|staff-payroll|SiGma.Helpers/Models/SalaryVoucher.cs
StaffTimesheet|SiGma.Helpers.Models.Staffs.StaffTimesheet|staff|SiGma.Helpers/Models/Staffs/StaffTimesheet.cs
SupportRequest|SiGma.Helpers.Models.SupportRequest|support|SiGma.Helpers/Models/SupportRequest.cs
TrafficFine|SiGma.Helpers.Models.Vouchers.TrafficFine|fleet|SiGma.Helpers/Models/Vouchers/TrafficFine.cs
Transaction|SiGma.Helpers.Models.Transaction|finance|SiGma.Helpers/Models/Transaction.cs
DataEntryCorrection|SiGma.Helpers.Models.DataEntryCorrection|operations|SiGma.Helpers/Models/DataEntryCorrection.cs
```

Explicit exclusions from this pass: `DDAController` is a Settings model; `MonthlyPostingController` is a posting process with prepare/post endpoints and no declared root model in the targeted model scan; `RentalBillingChargeController` is an agreement charge child/read-write helper; `PayrollDisbursementController` is a PayrollRun payment/disbursement child process; `PaySlipsController` is a payroll projection/read surface; `SupportRequestModelController` is a support template/settings model; `VehicleStatusCorrectionController` is a Vehicle command/read helper, not a separate root; `WorkshopActivityController` is a workshop activity/reference owner. `DepreciationController` is a prepare/save process; its persisted root is represented by `DepreciationEntry`, so it is not added as a second type. `VehicleStatusCorrection`, `MonthlyPosting`, `RentalBillingCharge`, `PayrollDisbursement`, `PaySlips`, `SupportRequestModel`, `DDA`, and `WorkshopActivity` are therefore not approval document roots.
