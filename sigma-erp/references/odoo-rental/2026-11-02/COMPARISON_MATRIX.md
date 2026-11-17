# مصفوفة الفحص: سبيد أولًا ثم Odoo ثم مطابقة سيجما

هذه **خريطة مصادر وأعمال مراجعة** وليست تدقيقًا مكتملًا لكل وحدات سيجما.
مصادر سبيد تصل من [مدخل الدليل والكود](../../speed-analysis/README.md) ودورة
[الإيجار والتأجير](../../speed-analysis/2026-10-28/workflows/01-rental-and-lease.md).
لكل صف يبدأ الفحص بسبيد؛ عمود Odoo يحدد ما نرجع إليه فقط إذا بقي نقص أو غموض.

| المفهوم | نقطة الفحص في سبيد/سيجما | مرجع Odoo المكمل | التغطية وحدود القرار |
|---|---|---|---|
| العميل والفرد والشركة | مجموعات العميل وعقد الشاشة؛ [مرجع خيارات الفوترة](../../customer-billing/README.md) | [Contacts](originals/content/applications/essentials/contacts.rst) | عناوين وشروط وقائمة أسعار موثقة؛ لا افتراض أهلية سائق أو هوية إلزامية من جهة اتصال عامة |
| المركبة والطراز والعداد | Fleet وRental/Agreement ومراجع سبيد المقابلة | [Vehicles](originals/content/applications/hr/fleet/new_vehicle.rst)، [Models](originals/content/applications/hr/fleet/models.rst) | بيانات الأسطول موثقة؛ الربط بمنتج Rental غير مثبت هنا |
| العرض والعقد الرئيسي والعقد التشغيلي | RentalQuotation وMasterAgreement وAgreement ودورة سبيد | [إنشاء طلب](originals/content/applications/sales/rental/rental_orders/create_rental_order.rst) | فصل الكيانات والحالات في سيجما يُراجع؛ لا استبدالها بأمر بيع واحد تلقائيًا |
| نوع التعريفة والشرائح | RentalTariff وTariffCalculateService، ثم عقد السعر الحالي | [Rental](originals/content/applications/sales/rental.rst)، [المنتجات](originals/content/applications/sales/rental/configure_products/products.rst) | Odoo يشرح خوارزمية خاصة؛ لا تُنقل إلى سيجما كإصلاح تلقائي |
| الأيام والساعات والتدوير | متحكم سبيد C0530 ودوال التاريخ، ومالكا مدة سيجما في المحرر والخادم | [إنشاء الطلب](originals/content/applications/sales/rental/rental_orders/create_rental_order.rst) | سبيد المقروء يعرض أيامًا وساعات فعلية؛ سيجما الحالي أيام تقويم. فرق يحتاج عقدًا عند تغييره، ولا يُخفى بخلط القاعدتين |
| تعديل عدد الأيام في Rate | توجيه المالك: أيام قابلة للتعديل في نفس خانة Rent، مع تحديث فترة العقد | صفحة الطلب نفسها | اختصار إدخال سيجما يغير الإرجاع بدل حفظ مدة مالية موازية؛ اختيار تنفيذي محافظ، لا ادعاء أنه حقل مطابق في Odoo |
| التوافر والحجز | RentalPlanner وحالات Agreement ودورة سبيد | [لوحة الطلبات](originals/content/applications/sales/rental/rental_orders/rental_order_dashboard.rst) | طرق عرض موثقة؛ حماية التزامن والفحص مع الصيانة تحتاج دليل الخادم الفعلي |
| التسليم والإرجاع والرقم المسلسل | حركات سبيد ومصدر سيجما المقابل، لا اسم الإجراء فقط | [التسليم والعودة](originals/content/applications/sales/rental/rental_orders/pickup_return.rst) | كميات وإيصالات وتسلسل موثقة؛ فحص السيارة التفصيلي غير مثبت في Odoo المقروء |
| الوقود والكيلومترات والزيادات | مراجع سبيد وBookingCharges ومالكي حركة سيجما | [العدادات](originals/content/applications/hr/fleet/odometers.rst) | قراءة عداد Fleet ليست تعريفة كيلومتر زائد أو رسوم نقص وقود |
| وديعة نقدية/مقدم/حجز بطاقة | إجراءات التأمين والقبض في سبيد وسيجما وعقودها | [الودائع](originals/content/applications/sales/rental/rental_orders/manage_deposits.rst)، [المقدم](originals/content/applications/sales/sales/invoicing/down_payment.rst)، [المزود](originals/content/applications/finance/payment_providers.rst) | ثلاث دورات مختلفة؛ لا نسخ قيد أو استقطاع أو انتهاء حجز إلى سيجما من المثال العام |
| مخالفات وسالك ودرب | سبيد ومرجع العميل وعقد سياسة RentalBillingCharge في سيجما | غير مثبت في النصوص المقروءة | سيجما لديه شريحة أحداث موثقة في عقدها؛ غيابها من هذا المرجع ليس إثبات غيابها من سيجما أو Odoo كله |
| أضرار وتأمين وحوادث | فحص العودة/تغطيات سبيد ثم ملاك سيجما | [Accidents](originals/content/applications/hr/fleet/accidents.rst) | إعداد خدمات ومرفقات؛ لا إثبات مطالبة تأمين أو تحمل أو تحميل العميل تلقائيًا |
| الصيانة وحجب المركبة | Workshop/Fleet وحركة الحجز في سيجما ومصدر سبيد | [خدمات Fleet](originals/content/applications/hr/fleet/service.rst)، [Maintenance](originals/content/applications/inventory_and_mrp/maintenance.rst) | دورة الصيانة موثقة عمومًا؛ ربطها بالإتاحة يحتاج فحص المصدر |
| الفواتير والاعتماد والإلغاء | عقود RentalInvoice الحالية ومصدر سيجما ودليل سبيد | [فواتير العملاء](originals/content/applications/finance/accounting/customer_invoices.rst) | يحفظ سيجما هويات وتاريخ استهلاك وفترات وقيدًا؛ لا مساواة أسماء الحالات دون دليل |
| الدفع والائتمان والاسترداد | مرجع العميل ومالكو القبض والتوزيع والرصيد | [Payments](originals/content/applications/finance/accounting/payments.rst)، [Credit notes](originals/content/applications/finance/accounting/customer_invoices/credit_notes.rst) | المستحق والسداد والمطابقة أشياء مختلفة؛ المعالجة المالية والصلاحيات محلية لسيجما |
| الضرائب والتقريب | عقد الميزة و[مرجع الأرقام](../../numeric-policy/README.md) ومصدر سبيد | [Taxes](originals/content/applications/finance/accounting/taxes.rst) | مرجع لفهم الخيارات، وليس حكمًا ضريبيًا أو تغييرًا لمالكي الحساب في سيجما |
| التوقيع والمستندات | وثائق العقد والسائق في سبيد وسيجما | [Documents](originals/content/applications/productivity/documents.rst)، [Sign](originals/content/applications/productivity/sign.rst) | لا يثبت صلاحية رخصة أو إلزام توقيع في حالة لم توثقها القاعدة |
| التقارير والربحية والإشغال | مؤشرات سبيد ومصدر تقرير سيجما وحقوله الفعلية | [Fleet cost](originals/content/applications/hr/fleet/cost_analysis.rst)، لوحة Rental | تكلفة خدمات وعقود وطرق عرض ليست تعريفًا كاملًا لربحية أو إشغال سيارة |

## طريقة فتح شريحة تحسين

١. سمّ المفهوم والفجوة من المصدر الأساسي سبيد، ثم حدد صفحة Odoo المكملة عند
الحاجة. لا تبدأ بنسخ قائمة ميزات عامة على أنها متطلبات كلها.

٢. اذكر رمز المنتج والمستهلك في سيجما والعقد ودليل المستخدم. صنف الأدلة
والاختلافات والقرار الذي ينقص فعلًا، ثم نفذ النطاق المأذون وراجعه حسب الكتب.

٣. سجّل القبول التشغيلي والقياس مستقلين عن القراءة المصدرية. لا تعتبر تنزيل
الوثيقة دليلًا على أن شاشة سيجما تعمل أو أن ميزة مفقودة من كامل المنتج.
