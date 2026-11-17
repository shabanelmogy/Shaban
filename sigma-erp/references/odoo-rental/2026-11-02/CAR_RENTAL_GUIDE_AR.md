# دليل قراءة دورة تأجير السيارات من Odoo

هذا دليل مكمل عند نقص الشرح في **سبيد بالدليل والكود**؛ راجع
[سياسة الأولوية](../REFERENCE_POLICY.md). يصف المصادر المثبتة، لا سلوك سيجما
المقبول تلقائيًا. كل رابط محلي أدناه يحيل إلى النص الأصلي الكامل.

## ١. فصل المركبة عن الصنف المؤجر

توثق [المنتجات المادية](originals/content/applications/sales/rental/configure_products/products.rst)
صنفًا مؤجرًا وأسعاره ورقمه المسلسل وحركته. وتوثق
[مركبة الأسطول](originals/content/applications/hr/fleet/new_vehicle.rst) اللوحة
والشاسيه والسائق والعداد ومعلومات الاقتناء. **لا تثبت الصفحات رابطًا مباشرًا
بين الكيانين**. يحتاج تصميم سيجما إلى ربط صريح موثق؛ لا نفترضه من تشابه الاسم.

## ٢. بيانات العميل ومصدر الإعدادات

تشرح [جهات الاتصال](originals/content/applications/essentials/contacts.rst)
الأفراد والشركات والعناوين والروابط التجارية وبعض إعدادات البيع والفوترة.
نطابق خيارات سيجما من [مرجع العميل](../../customer-billing/README.md) أولًا
مع سبيد، ثم نرجع إلى Odoo للنقاط غير الواضحة. ليست كل هوية أو رخصة قيادة
محددة في جهة اتصال عامة متطلبًا مثبتًا لتأجير سيارة.

## ٣. إعداد المنتج والتعريفة والمدة

يشرح [نوع المنتج](originals/content/applications/sales/rental/configure_products/product_type.rst)
أنواع التأجير وإعداداته، وتشرح صفحة المنتجات المادية أسعار الفترات وقوائم
الأسعار. المدخل [Rental](originals/content/applications/sales/rental.rst)
يوضح اختيار سطر سعر واحد وفق حسابه. هذا مثال لفهم فصل المدة عن السعر، وليس
اعتمادًا لنفس الخوارزمية في سيجما. شرائح اليوم/الأسبوع/الشهر والتدوير والمهلة
تراجع في سبيد وعقد سيجما قبل أي تغيير مالي.

## ٤. العرض ثم الحجز

تحدد [صفحة إنشاء الطلب](originals/content/applications/sales/rental/rental_orders/create_rental_order.rst)
عميلًا وفترة بداية/نهاية ومنتجًا، ثم إرسال العرض وتأكيده. توثق فترة واحدة
للطلب وإعادة حساب السعر عند تعديلها. تشرح
[قوالب العروض](originals/content/applications/sales/sales/sales_quotations/quote_template.rst)
التجهيزات المتكررة، والتوقيع/الدفع الاختياريان موثقان في فرع العروض المجمع.
لا تستبدل هذه الحالات حالات عقد أو حجز سيجما المختلفة.

## ٥. الإتاحة والتخطيط

توضح [لوحة التأجير](originals/content/applications/sales/rental/rental_orders/rental_order_dashboard.rst)
العروض والحجوزات والتسليم والإرجاع والمتأخر والمرشحات وطرق العرض.
توضح [المنتجات المادية](originals/content/applications/sales/rental/configure_products/products.rst)
وقت الفصل بين الحجوزات وبعض حدود الحجز عبر المتجر. لا تثبت هذه الصفحات
وحدها حماية تزامن حجزين أو منع الصيانة من الإتاحة أو تبديل السيارة أثناء العقد.

## ٦. التسليم والإرجاع وتتبع الوحدة

تشرح [التسليم والإرجاع](originals/content/applications/sales/rental/rental_orders/pickup_return.rst)
الكميات والحالات والأرقام المسلسلة وإيصالات التسليم والإرجاع. وتشرح
[الأرقام التسلسلية](originals/content/applications/inventory_and_mrp/inventory/product_management/product_tracking/serial_numbers.rst)
تتبع الوحدة في المخزون. لا تساوي هذه الإيصالات نموذج فحص سيارة بالصور
والوقود والعداد والأضرار وإقرار السائق؛ المرجع الأساسي لهذه التفاصيل سبيد.

## ٧. التأخير والتمديد

تذكر إعدادات المنتجات رسوم الساعة/اليوم والمهلة والفصل بين الحجوزات. لا
تحسم الصفحات المقروءة كل معادلات جمع الرسوم أو أولوية الساعة واليوم أو
المنطقة الزمنية. تُفصل هنا «وجود إعداد» عن «خوارزمية مثبتة». يبدأ فحص
سيجما من شرح وكود سبيد وعقوده ثم تُستخدم Odoo لسؤال محدد بقي ناقصًا.

## ٨. التأمين المسترد والمقدم والحجز المصرفي

هذه ثلاث عمليات مختلفة في المصادر:

- [وديعة التأجير](originals/content/applications/sales/rental/rental_orders/manage_deposits.rst):
  منتج خدمة للضمان واسترداد بإشعار دائن وفق الدورة الموثقة.
- [الدفعة المقدمة](originals/content/applications/sales/sales/invoicing/down_payment.rst):
  مبلغ ثابت/نسبي يخصم ضمن مسار فوترة أمر البيع.
- [الحجز والتحصيل اليدوي](originals/content/applications/finance/payment_providers.rst):
  حجز أموال وتحصيلها أو تحريرها بحسب دعم مزود الدفع وحدود المدة والتحصيل الجزئي.

نستخدم التمييز لفهم السؤال، لا لنقل القيد المحاسبي أو سياسة احتجاز الضمان
إلى سيجما. المخالفات اللاحقة والاستقطاع وتحمل التأمين تحتاج عقدها الخاص.

## ٩. الفاتورة والسداد والاسترداد والضريبة

ترتبط دورة الطلب بمسودة فاتورة واعتماد وسداد. جُمعت فروع
[فواتير العملاء](originals/content/applications/finance/accounting/customer_invoices.rst)،
[المدفوعات](originals/content/applications/finance/accounting/payments.rst)،
[الضرائب](originals/content/applications/finance/accounting/taxes.rst)،
و[فواتير الموردين](originals/content/applications/finance/accounting/vendor_bills.rst)،
بما فيها شروط الدفع والإشعارات الدائنة والتقريب والعملات والفروع المتاحة في
الفهرس. مصدر الحساب والاعتماد والصلاحيات في سيجما يبقى مالكه الفعلي؛ لا نساوي
حالة Odoo بحالة قيد سيجما أو نعتمد حكم ضريبة محليًا من وثيقة عامة.

## ١٠. الأسطول والصيانة والحوادث والتكلفة

توثق صفحات Fleet الست
[الطرازات](originals/content/applications/hr/fleet/models.rst)،
[المركبات](originals/content/applications/hr/fleet/new_vehicle.rst)،
[الخدمات](originals/content/applications/hr/fleet/service.rst)،
[الحوادث](originals/content/applications/hr/fleet/accidents.rst)،
[التكلفة](originals/content/applications/hr/fleet/cost_analysis.rst)،
و[العدادات](originals/content/applications/hr/fleet/odometers.rst).
الحوادث موثقة كطريقة إعداد بخدمات وملاحظات ومرفقات، وليست دورة مطالبة تأمين.
عقود Fleet تخص اقتناء/استئجار المركبة للأسطول وتكاليفها؛ لا تثبت عقد تأجير
العميل. فرع [الصيانة](originals/content/applications/inventory_and_mrp/maintenance.rst)
مساند عام؛ لا يفترض مزامنة تلقائية مع الإتاحة أو الورشة في سيجما.

## ١١. المستندات والتوقيع

تشرح [المستندات](originals/content/applications/productivity/documents.rst)
الملفات والربط والطلبات والتنظيم، وتشرح
[طلبات التوقيع](originals/content/applications/productivity/sign/request_signatures.rst)
الأطراف والقوالب والإكمال. حدود التوثيق والأمان والصلاحية موجودة في فرع Sign
المجمع؛ لا يثبت ذلك قبول جهة قانونية محلية أو صلاحية رخصة السائق أو وجود
قيد برمجي مانع للتسليم دون توقيع.

## ١٢. ما لا نعتبره مثبتًا هنا

فحص سيارة قبل/بعد، مستوى الوقود، الكيلومترات المجانية والزائدة، رخصة السائق
وإضافيه، المخالفات وسالك ودرب، استبدال السيارة، تحميل التلفيات على العميل،
التحمل والتغطية التأمينية، خوارزمية إشغال/ربحية سيارات كاملة والتزامن المحاسبي
لا تُستنتج من الوظائف العامة السابقة. راجع لها سبيد ومصدر سيجما أولًا؛ ثم
حدد السؤال الباقي قبل توسيع البحث في Odoo أو تثبيت عقد التنفيذ.

للتطبيق العملي استخدم [المصفوفة](COMPARISON_MATRIX.md). النصوص والصور الأصلية
والترخيص محفوظة، ولم تُختبر هذه السيناريوهات داخل Odoo أو سيجما ضمن الجمع.
