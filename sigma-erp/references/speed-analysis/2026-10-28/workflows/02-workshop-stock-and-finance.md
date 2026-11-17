# دليل مراجعة دورة الورشة والمخزون والمستندات والحسابات

هذا دليل قراءة للواجهة المحملة من Speed بتاريخ ٢٨ أكتوبر ٢٠٢٦. يرتب المراجعة حسب القائمة الجانبية المختارة في الأدلة، ثم يربط الشاشات في دورة عمل. التحليل ساكن للملفات والأدلة المحفوظة؛ لم تُنفذ عمليات حفظ أو اعتماد أو ترحيل، ولم تُفحص قاعدة بيانات أو شفرة الخادم. لا يتناول تطبيق Sigma.

## حدود الدليل وطريقة قراءة الإثبات

الملاحظة المثبتة تعني أن شفرة الواجهة تنشئ الإجراء أو تمرر البيانات أو تستدعي الخدمة المذكورة. التسلسل المستنتج هو ترتيب مقترح لمراجعة العمل عبر هذه الروابط؛ لا يثبت أن المرور بكل شاشة إلزامي. القاعدة المجهولة تحتاج شفرة الخادم أو عقد واجهته أو تجربة مأذونة.

تستخدم الإحالات مسارًا نسبيًا من مجلد التحليل، ثم رقم سطر في نسخة التسجيل المقروءة. يحفظ السطر الثاني من كل نسخة موضعها الأصلي في الملف المجمع. مثلًا: `readable/controllers/C1803--tenant.views.workshop.Jobs.createOrEditModal.js:1060`. هذه نسخ خاملة للقراءة وليست وحدات قابلة للتشغيل مستقلة.

مصدر ترتيب القائمة هو `data/active-menu.json`، ووصفه يصرح بأنه تفريغ يدوي لفروع اختيار القائمة مقابل القيم والصلاحيات الملتقطة، وليس مشاهدة فعلية للشاشة. استُكمل ربط القوالب بالمتحكمات في `data/sidebar-screen-map.json`؛ مثلًا سجل `S0097` يثبت تصريح قالب الأعمال بالمتحكم `tenant.views.workshop.jobs.index as vm`. هذا يثبت الربط الساكن داخل القالب المحفوظ؛ ظهور الشاشة وتنفيذ أفعالها ونتائج الخادم يحتاج إثباتًا تشغيليًا منفصلًا.

توجد خرائط تفصيلية للشاشات والنوافذ والخدمات في [قسم الورشة](../sidebar/14-workshop/README.md)، و[قسم المخزون](../sidebar/15-stock/README.md)، و[قسم المستندات](../sidebar/18-vouchers/README.md)، و[قسم الحسابات](../sidebar/21-accounts/README.md). ويكمل [ملف شاشة الأعمال](../sidebar/14-workshop/screens/04-jobs.md) تتبع حقولها ونوافذها؛ السرد التالي يركز على العلاقات بين الأقسام.

## نقطة الدخول: ترتيب القائمة الفعلي

| القسم في القائمة | الشاشات ذات الصلة، بترتيبها | إثبات القائمة |
|---|---|---|
| الورشة | المركبات، أوامر العمل، تقديرات الأعمال، الأعمال، أنشطة العمالة، فئات الأعمال، تعريفة العمالة، تقرير أنشطة العمالة، التقارير | `data/active-menu.json:1064`؛ أوامر العمل:١٠٨٣، التقديرات:١٠٩٣، الأعمال:١١٠٣ |
| المخزون | وحدات القياس، أنواع الأصناف، الأصناف، طلبات الأصناف، صرف الأصناف، مرتجعات الأصناف، التحويل، التقارير | `data/active-menu.json:1204`؛ الطلبات:١٢٤٣، الصرف:١٢٥٣ |
| المستندات | الفواتير، إشعارات الدائن والمدين، المقبوضات، التأمينات، طلبات الشراء، أوامر الشراء، أذون الاستلام، فواتير الموردين، مرتجعات الشراء، المدفوعات، القيود، ثم بقية الإجراءات الدورية | `data/active-menu.json:1774`؛ أوامر الشراء:١٨٤٣، الاستلام:١٨٥٣، فواتير الموردين:١٨٦٣، المدفوعات:١٨٨٣ |
| الحسابات | دليل الحسابات، ربط الحسابات، السنوات المالية، الأرصدة الافتتاحية، القوائم والتقارير، إغلاق الشهر، الأستاذ، اليومية، الموازنة | `data/active-menu.json:2124`؛ الربط:٢١٤٣، إغلاق الشهر:٢٢٩٣، اليومية:٢٣١٣ |

الملاحظة المهمة لتنظيم المراجعة: الاستلام وفواتير الموردين موجودان تحت قسم المستندات في هذه القائمة، مع أن متحكم الاستلام موجود برمجيًا في مجلد المخزون. لذلك يبدأ تصنيف العمل من القائمة ثم يُتبع الرابط البرمجي، وليس من اسم مجلد الشفرة.

| الشاشة | اسم المسار | عنوان الصفحة | موضع تعريفه في `raw/application.js` |
|---|---|---|---|
| أوامر العمل | `tenant.CRS_WorkOrders` | `/crs/workOrders` | 5685 |
| تقديرات الأعمال | `tenant.CRS_jobEstimations` | `/crs/jobEstimations` | 5694 |
| الأعمال | `tenant.CRS_jobs` | `/crs/jobs` | 5704 |
| طلبات الأصناف | `tenant.CRS_Requisitions` | `/crs/requisitions` | 5839 |
| صرف الأصناف | `tenant.CRS_Issues` | `/crs/issues` | 5845 |
| أوامر الشراء | `tenant.crs_purchaseOrders` | `/crs/purchaseOrders` | 3756 |
| أذون الاستلام | `tenant.crs_stockgoodsReceiptNotes` | `/crs/grns` | 5796 |
| فواتير الموردين | `tenant.crs_bills` | `/crs/bills` | 3738 |
| الفواتير | `tenant.crs_invoices` | `/crs/invoices` | 3896 |
| المقبوضات | `tenant.crs_receipts` | `/crs/receipts` | 3705 |
| المدفوعات | `tenant.crs_payments` | `/crs/payments` | 3883 |
| ربط الحسابات | `tenant.crs_linkAccounts` | `/crs/linkAccounts` | 5236 |
| اليومية | `tenant.crs_journal` | `/crs/journal` | 5260 |

## الدورة الأولى: من طلب العمل إلى التنفيذ وقطع الغيار

التسلسل المقترح للمراجعة هو: إعداد المركبة والعميل وأنشطة العمالة ← أمر عمل أو تقدير أو إنشاء عمل مباشر ← تفاصيل العمل ← طلب قطع ثم صرف، أو صرف مباشر ← مرتجع عند الحاجة ← الإغلاق والفوترة. وجود مسارات البدء البديلة مثبت؛ إلزاميتها وتسلسل الاعتماد على الخادم غير مثبتين.

| الخطوة | الملاحظة المثبتة من الواجهة | المتحكم والإجراء والخدمة | إحالة المصدر |
|---|---|---|---|
| حفظ أمر العمل | يرسل نموذج الأمر داخل خاصية `workOrder` | `tenant.views.workshop.workOrders.createOrEditModal`؛ `vm.save` ← `abp.services.app.workOrder.createOrUpdateWorkOrder` | `readable/controllers/C1822--tenant.views.workshop.workOrders.createOrEditModal.js:357` |
| إنشاء عمل من أمر | يفتح محرر الأعمال مع `options.workOrderId` ثم يعيد تحميل قائمة الأوامر عند إتمام الحوار | `tenant.views.workshop.workOrders.index`؛ `vm.createJob` | `readable/controllers/C1823--tenant.views.workshop.workOrders.index.js:593` |
| اعتماد أمر العمل | يوجد إجراء تأكيد ثم استدعاء اعتماد | المتحكم السابق؛ `vm.approveWorkOrder` ← `abp.services.app.workOrder.approveWorkOrder` | الملف السابق:619 |
| إنشاء عمل من تقدير | يفتح المحرر مع `options.jobEstimationId`؛ عند رجوع معرف عمل موجب يستدعي `vm.closeEstimation` | `tenant.views.workshop.jobEstimations.index`؛ `vm.createJob` | `readable/controllers/C1793--tenant.views.workshop.jobEstimations.index.js:483` |
| اعتماد التقدير | إجراء تأكيد يستدعي الخدمة ويجدد القائمة | المتحكم السابق؛ `vm.approveJobEstimation` ← `abp.services.app.jobEstimation.approveJobEstimation` | الملف السابق:520 |
| حفظ العمل | ينقل معرف المركبة والعميل، يضبط `isEstimation=false` ويرسل النموذج؛ يعيد الحوار معرف العمل عند نجاح موجب | `tenant.views.workshop.Jobs.createOrEditModal`؛ `vm.save` ← `abp.services.app.job.createOrUpdateJob` | `readable/controllers/C1803--tenant.views.workshop.Jobs.createOrEditModal.js:600` |
| طلب قطع من العمل | ينسخ تفصيل العمل ويضيف رقم العمل ومعرف طراز المركبة، ثم يفتح محرر الطلبات ويعيد التهيئة بعد الإتمام | المتحكم السابق؛ `vm.openItemRequisition` → `tenant.views.stock.requisitions.createOrEditModal` | الملف السابق:1060 |
| حفظ طلب القطع | يحفظ `jobDetailId` و`jobId` عند إنشائه من العمل؛ يرسل الخاصية المسماة فعليًا `itemRequistion` | `tenant.views.stock.requisitions.createOrEditModal`؛ `vm.save` ← `abp.services.app.itemRequisition.createOrUpdateItemRequisition` | `readable/controllers/C1706--tenant.views.stock.requisitions.createOrEditModal.js:95` و131 |
| صرف طلب موجود | قائمة الطلبات تفتح محرر الصرف مع `itemReqId` | `tenant.views.stock.requisitions.index`؛ `vm.issueItems` | `readable/controllers/C1707--tenant.views.stock.requisitions.index.js:250` |
| تحويل الطلب إلى صرف | يقرأ الطلب، يصفر معرف المستند ومعرفات أسطره، ويحفظ معرف الطلب في `parentVoucherId` | `tenant.views.stock.itemIssues.createOrEditModal`؛ `init` ← `abp.services.app.itemRequisition.getItemRequisitionForEdit` | `readable/controllers/C1678--tenant.views.stock.itemIssues.createOrEditModal.js:140` |
| صرف مباشر من العمل | يفتح المحرر ببيانات التفصيل؛ محرر الصرف يحفظ معرفي العمل والتفصيل مباشرة | محرر الأعمال؛ `vm.openItemIssue`، ثم `init` في محرر الصرف | `readable/controllers/C1803--tenant.views.workshop.Jobs.createOrEditModal.js:1108`؛ ملف الصرف:163 |
| حفظ الصرف | يضبط لكل سطر `credit=product.cost*quantity` و`debit=0` قبل الإرسال | محرر الصرف؛ `vm.save` ← `abp.services.app.itemIssue.createOrUpdateItemIssue` | `readable/controllers/C1678--tenant.views.stock.itemIssues.createOrEditModal.js:117` |
| إرجاع قطع من العمل | يفتح محرر مرتجعات الأصناف ببيانات تفصيل العمل ثم يعيد التهيئة | محرر الأعمال؛ `vm.openItemReturn` → `tenant.views.stock.itemReturns.createOrEditModal` | `readable/controllers/C1803--tenant.views.workshop.Jobs.createOrEditModal.js:1084` |

الملاحظة المحاسبية المقيدة: تعبئة حقلي المدين والدائن في نموذج الصرف تثبت ما ترسله الواجهة فقط؛ لا تثبت الحسابات التي سيختارها الخادم أو القيد النهائي أو طريقة تقييم المخزون. لم يُحلّل هنا حفظ مرتجع الأصناف تفصيليًا، فلا تُنسب إليه آلية عكس للصرف دون دليل إضافي.

المراجعة الوظيفية لهذه الدورة ينبغي أن تتتبع معرف العمل وتفصيله والطلب الأب خلال إنشاء المستندات، ثم تقارن الكميات المطلوبة والمصروفة والمرتجعة والمتبقية. قواعد الصرف الجزئي، ومنع تجاوز المطلوب أو الرصيد، وحجز الكمية، واختيار المستودع، والتكلفة والتزامن تحتاج إثباتًا من الخادم؛ الربط الظاهر لا يحسمها.

## الدورة الثانية: شراء القطع واستلامها وفاتورة المورد وسدادها

التسلسل المقترح هو: أمر شراء ← استلام ← فاتورة مورد ← اعتماد ← سداد وتخصيص ← مراجعة اليومية والأستاذ. يوجد كذلك فرع مباشر من أمر الشراء إلى فاتورة المورد؛ لذا لا يجوز فرض مرور كل فاتورة عبر الاستلام اعتمادًا على الواجهة الحالية.

| الخطوة | الرابط المثبت | المتحكم والإجراء والخدمة | إحالة المصدر |
|---|---|---|---|
| أمر الشراء | الحفظ يرسل `purchaseOrder`، وقائمة الأوامر توفر اعتمادًا وإلغاء اعتماد ورفضًا | `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal`؛ `vm.save` ← `abp.services.app.purchaseOrder.createOrUpdatePurchaseOrder`؛ قائمة الأوامر تستدعي `approvePurchaseOrder` | `readable/controllers/C1396--tenant.views.crs.vouchers.purchaseOrders.createOrEditModal.js:551`؛ `readable/controllers/C1398--tenant.views.crs.vouchers.purchaseOrders.index.js:596` |
| استلام من الأمر | يمرر معرف الأمر ونوعه والعملة وسعرها إلى محرر الاستلام | قائمة أوامر الشراء؛ `vm.createGrnOnPo` → `tenant.views.stock.grns.createOrEditModal` | `readable/controllers/C1398--tenant.views.crs.vouchers.purchaseOrders.index.js:204` |
| تحميل الأمر داخل الاستلام | يقرأ الأمر، يعيد استخدام بياناته ويغيّر نوع المستند؛ النوع ٤٨ افتراضيًا ثم توجد فروع للأصول ونوع آخر | محرر الاستلام؛ `init` ← `abp.services.app.purchaseOrder.getPurchaseOrderForEdit` | `readable/controllers/C1671--tenant.views.stock.grns.createOrEditModal.js:465` |
| حفظ الاستلام | يرسل الوثائق؛ إذا لم يُفعّل تضمين العمل يمحو كائن العمل ومعرفيه قبل الحفظ | محرر الاستلام؛ `vm.save` ← `abp.services.app.grn.createOrUpdateGrn` | الملف السابق:424 |
| فاتورة من الاستلام | يفتح محرر فاتورة المورد مع `grnId` والعملة وسعرها | `tenant.views.stock.grns.index`؛ `vm.createBill` | `readable/controllers/C1672--tenant.views.stock.grns.index.js:359` |
| نقل مرجع الاستلام للفاتورة | يقرأ الاستلام، يصفر معرف الفاتورة وأسطرها، ويضع معرف الاستلام في `parentVoucherId`؛ يحول نوع ٤٨ إلى ٤٢ مع فروع أخرى | `tenant.views.crs.vouchers.bills.createOrEditModal`؛ `init` ← `abp.services.app.grn.getGrnForEdit` | `readable/controllers/C1229--tenant.views.crs.vouchers.bills.createOrEditModal.js:1509` |
| حفظ فاتورة الاستلام | يجمع الاستلامات المختارة، إن وجدت، في `additionalInfo` ويرسل الفاتورة وخطة الدفع | محرر فاتورة المورد؛ `vm.saveGrnBill` ← `abp.services.app.bill.createOrUpdateGrnBill` | الملف السابق:1385 |
| فاتورة مباشرة من الأمر | يفتح محرر الفاتورة مع كائن الأمر ومعرفات تميز فرع المخزون أو الأصل | قائمة أوامر الشراء؛ `vm.createBillOnPO` | `readable/controllers/C1398--tenant.views.crs.vouchers.purchaseOrders.index.js:232` |
| توليد دفعة فواتير من أوامر | يعين حساب السطر، يحفظ مرجع الأمر الأب، يصفر معرف الفاتورة ويرسلها، ثم ينتقل إلى التالية في `finally` | `tenant.views.crs.vouchers.purchaseOrders.generateBills`؛ `vm.save` ← `abp.services.app.bill.createBillForPo` | `readable/controllers/C1397--tenant.views.crs.vouchers.purchaseOrders.generateBills.js:123` |
| اعتماد فاتورة المورد | إجراء تأكيد ثم اعتماد؛ توجد أيضًا دوال إلغاء اعتماد ورفض وحذف وإبطال | `tenant.views.crs.vouchers.bills.index`؛ `vm.approveBills` ← `abp.services.app.bill.approveBill` | `readable/controllers/C1233--tenant.views.crs.vouchers.bills.index.js:705` |
| السداد والتخصيص | لفئة سداد الموردين رقم ٤ يجمع تخصيصات الأسطر ويربط المستند المستهدف؛ يتحقق من مساواة مبلغ السداد مع الاستقطاع للتخصيص وفق خيار السماح بالتخصيص الجزئي | `tenant.views.crs.vouchers.payments.createOrEditModal`؛ `vm.save` | `readable/controllers/C1376--tenant.views.crs.vouchers.payments.createOrEditModal.js:1924` |
| حفظ السداد | يضع التخصيصات في `payment.paymentAllocations` ثم يرسل الدفع | المتحكم السابق؛ `vm.save` ← `abp.services.app.payment.createOrUpdatePayment` | الملف السابق:1974 و2024 |

الملاحظة الخاصة بالتوليد الجماعي: الانتقال إلى الفاتورة التالية موضوع في `finally` وليس في مسار النجاح فقط؛ هذا سبب لفحص نتيجة كل أمر وفشل كل عنصر واستئناف الدفعة. لا يثبت ذلك وحده فقد بيانات أو غياب معاملة على الخادم.

المراجعة الوظيفية ينبغي أن تقارن كمية الأمر بالمستلم والمفوتر، مع فرع الفاتورة المباشرة وتعدد الاستلامات والعملة والخصم والضريبة والمرتجعات. قواعد منع إعادة الفوترة، وحدود الزيادة، وأثر اعتماد المورد، وتوقيت زيادة المخزون أو إثبات الالتزام أو سداد الرصيد غير معروفة من هذه الشفرة.

## الدورة الثالثة: إغلاق العمل وفاتورة العميل أو شركة التأمين والتحصيل

الملاحظة المثبتة أن قائمة الأعمال تعرض الحالات: مفتوح رقم ١، مغلق رقم ٢، ملغى رقم ٣. التعديل والإغلاق والإلغاء والحذف ظاهرون في قالب خلية القائمة عندما تكون الحالة مفتوحة. إنشاء فاتورة للعمل المفتوح يتطلب كذلك ميزة وصلاحية في الواجهة. مصدر ذلك:

- إثبات الحالات: `readable/controllers/C1806--tenant.views.workshop.jobs.index.js:538`.
- إثبات شروط الأفعال: الملف السابق:385–402.
- إثبات فتح نافذة الإغلاق: الملف السابق:691؛ وهي تستخدم `tenant.views.workshop.jobs.closeWorkShop`، لا نافذة `jobClosingModal` المتشابهة في الاسم.

| المرحلة | الملاحظة المثبتة | الإجراء والخدمة | إحالة المصدر |
|---|---|---|---|
| جلب بيانات الإغلاق | يقرأ العمل للإغلاق؛ يرفض في الواجهة غياب الموظف عن مصروف عمالة من النوع ٢؛ ويقارن إجمالي العمل بالفواتير المنشأة في حالة محددة | `tenant.views.workshop.jobs.closeWorkShop`؛ `init` ← `abp.services.app.job.getJobForClosing` | `readable/controllers/C1800--tenant.views.workshop.jobs.closeWorkShop.js:323` |
| إعداد فواتير الإغلاق | يستدعي خدمة تعيد `invoiceOnCustomer` و`invoiceOnInsuranceCompany`، ثم يضبط تواريخهما ويعيد الحساب | المتحكم السابق؛ `vm.generateInvoices` ← `abp.services.app.job.closeWorkShop` | الملف السابق:365 |
| الإغلاق مع فواتير | عند تفعيل إنشاء الفاتورة بالإغلاق يتحقق من مجموع فاتورة العميل والتأمين، ثم يرسل `closingJob` والفواتير ذات المبلغ الموجب | المتحكم السابق؛ `vm.closeJob` ← `abp.services.app.job.closeJob` | الملف السابق:398 |
| الإغلاق دون تمرير فواتير | الفرع الآخر يرسل `closingJob` وحده | الإجراء والخدمة السابقان | الملف السابق:422 |
| فاتورة قبل الإغلاق | يفتح مسارًا منفصلًا من القائمة؛ تحضير الفاتورة يرفض وجود مبلغ لفاتورة شركة التأمين؛ الحفظ يرسل فاتورة العميل فقط مع `invoiceOnInsuranceCompany=null` | `tenant.views.workshop.jobs.createInvoiceOnOpenJob`؛ `vm.generateInvoices` و`vm.createInvoice` ← `abp.services.app.job.closeWorkShop` ثم `createInvoice` | `readable/controllers/C1801--tenant.views.workshop.jobs.createInvoiceOnOpenJob.js:278` و297 |
| اعتماد الفاتورة | قائمة الفواتير توفر اعتمادًا فرديًا وجماعيًا وإلغاء اعتماد | `tenant.views.crs.vouchers.invoices.index`؛ `vm.approveInvoices` ← `abp.services.app.invoice.approveInvoice` | `readable/controllers/C1336--tenant.views.crs.vouchers.invoices.index.js:2048`؛ الجماعي:1930 |
| التحصيل والتخصيص | محرر المقبوضات يقرأ التخصيصات؛ إذا وصلته فاتورة يبحث عن معرفها ضمن النتائج؛ توجد كذلك إمكانية بحث أعمال | `tenant.views.crs.vouchers.receipts.createOrEditModal` ← `abp.services.app.allocation.getAllocationsForEdit` و`abp.services.app.job.searchJobs` | `readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js:669` و711 و303 |
| حفظ المقبوض | يرسل مستند المقبوضات، وتوجد فروع أخرى للمقبوض مع مصروف ولمقبوض عام | المتحكم السابق؛ `vm.save` ← `abp.services.app.receipt.createOrUpdateReceipt` | الملف السابق:1538؛ الفروع الأخرى:1598 و1730 |
| إذن خروج المركبة | قائمة الأعمال تستدعي التحقق قبل فتح الطباعة | `tenant.views.workshop.jobs.index`؛ `vm.openprintModalGatePass` ← `abp.services.app.job.validateGatePass` | `readable/controllers/C1806--tenant.views.workshop.jobs.index.js:622` |

الملاحظة الخاصة بالإغلاق: اسم الخدمة `closeWorkShop` لا يثبت أنه يغلق العمل محاسبيًا؛ الواجهة تستخدم ناتجها لإعداد نموذج فواتير ثم تستدعي `closeJob` أو `createInvoice`. لا يمكن حسم ما إذا كانت الخدمة الأولى خالية من الآثار الجانبية، ولا حسم الذرية بين إغلاق العمل والفواتير أو توقيت ترحيلهما، دون الخادم.

المراجعة الوظيفية تقارن توزيع القطع والعمالة والمصاريف بين العميل وشركة التأمين، والفاتورة المبكرة ثم الإغلاق، والضريبة والتقريب والعملة، والتحصيل المخصص وغير المخصص، وشرط إذن الخروج. وجود إعداد أو تحقق واجهة لا يثبت تطبيق قاعدة مماثلة على الخادم أو حالة تفعيله الفعلية في جلسة المستخدم.

## نقطة الربط بالحسابات: إعدادات ثم مستندات ثم قراءة النتائج

الملاحظة المثبتة في شاشة ربط الحسابات أن عملية حفظ واحدة ترسل ربط الحسابات العام والمصروفات المقدمة والحسابات البنكية وأنواع الأصناف وفئات الأعمال وروابط المخزون وحسابات مصروفات الأعمال. هذا رابط صريح بين نطاق الورشة والمخزون والإعداد المحاسبي، لكنه لا يكشف معادلة توليد القيد.

- إثبات الحفظ: المتحكم `tenant.views.crs.accounting.linkAccounts.index`؛ الإجراء `vm.save` يستدعي `abp.services.app.linkedAccount.createOrUpdateLinkedAccount`، ويرسل `itemType` و`jobCategory` و`stocklinkAccount` و`cRSAccountLinkings` ضمن الحزمة. المصدر: `readable/controllers/C0501--tenant.views.crs.accounting.linkAccounts.index.js:388`.
- إثبات قراءة الروابط: الملف نفسه:423 و431 و439؛ الخدمات `itemType.getItemTypes` و`jobCategory.getJobCategory` و`linkedAccount.getStockLinkAccounts`.
- إثبات إعداد إضافي محتمل: الملف نفسه:14 يقرأ ميزة إنشاء فاتورة مورد في نطاق التأجير عند إغلاق عمل الورشة. هذه قراءة لميزة، وليست إثباتًا لتنفيذ فاتورة مقابلة أو قيد بين كيانين.

الملاحظة المثبتة في اليومية أن شاشة القراءة ترجع إلى المستند الأصلي حسب نوعه. المتحكم هو `tenant.views.crs.accounting.journal.index`، وإجراء الربط هو `vm.openVoucher`. الأرقام التالية هي أرقام المقارنة في هذه الدالة، ولا تعمم على كل حقل نوع أو نوع فرعي في التطبيق:

| نوع المستند في دالة اليومية | وجهة الفتح | المصدر |
|---|---|---|
| نوع ١ | فاتورة، مع فرع خاص لنوع فرعي ٢ | `readable/controllers/C0498--tenant.views.crs.accounting.journal.index.js:418` |
| نوع ٢ | مقبوض | الملف السابق:426 |
| نوع ١٢ | أمر شراء | الملف السابق:443 |
| نوع ٥ | فاتورة مورد | الملف السابق:449 |
| نوع ٣ | دفع | الملف السابق:452 |
| نوع ٦ | قيد يومية | الملف السابق:455 |
| نوع ٣٠ | مرتجع شراء | الملف السابق:479 |
| نوع ٣٥ | تحويل مخزون | الملف السابق:482 |
| نوع ٢٧ | مرتجع أصناف | الملف السابق:485 |
| نوع ٢٦ | صرف أصناف | الملف السابق:488 |

الملاحظة المثبتة أن شاشة اليومية تقرأ من `journalService.getJournalView`، وتستخدم فرع `getJournalViewForMulticurrency` للعملات المتعددة. المصدر: `readable/controllers/C0498--tenant.views.crs.accounting.journal.index.js:554` و568. وجود وجهة لأمر شراء أو صرف داخل اليومية لا يثبت أن كل مستند من هذا النوع يولد قيدًا، أو أن القيد مرحل، أو أنه يتولد عند الحفظ بدل الاعتماد.

الملاحظة المثبتة في قائمة القيود أن اعتماد القيد يتم عبر `abp.services.app.jV.approveJV` ويوجد إلغاء اعتماد. المصدر: `readable/controllers/C1364--tenant.views.crs.vouchers.jvs.index.js:661`. وفي إغلاق الشهر يستخدم المتحكم `tenant.views.crs.monthEndClosing.index` الخدمة `abp.services.app.fiscalMonth.closeFiscalMonth`، مع مسار إعادة فتح مستقل وصلاحية واجهة لإعادة الفتح. المصدر: `readable/controllers/C0502--tenant.views.crs.monthEndClosing.index.js:8` و149 و170. لا يُستنتج من هذين الإجراءين توقيت ترحيل مستندات الورشة والمخزون أو حظر الكتابة بأثر رجعي.

التسلسل المستنتج للمراجعة المحاسبية هو: توثيق الحسابات المرتبطة والإعدادات ← حفظ المستند ← الاعتماد إن كان مساره يتطلبه ← مقارنة صفوف اليومية بالمستند الأصلي ← مقارنة الأستاذ والقوائم ← فحص الإبطال والمرتجع والفترة المغلقة. الصفوف المحاسبية والقيم الفعلية غير متاحة في هذا التحليل؛ شاشة الأستاذ والقوائم تُذكر كنقاط مطابقة لاحقة ولم تُحلّل هنا تفصيليًا.

## عقود طلبات مؤكدة من وكلاء الخدمات

الملاحظة المشتركة أن الطرق أدناه تستخدم طلب `POST` في وكلاء Angular. العناوين نسبية، ولم تُطلب عبر الشبكة. يثبت الوكيل اسم الطلب وشكله الظاهر، ولا يثبت تنفيذ الخادم أو سلامة القيود المحاسبية.

| الخدمة والطريقة | عنوان الطلب النسبي | السطر في `raw/service-proxies-angular.js` |
|---|---|---|
| `workOrder.createOrUpdateWorkOrder` | `api/services/app/workOrder/CreateOrUpdateWorkOrder` | 240 |
| `jobEstimation.createOrUpdateJobEstimation` | `api/services/app/jobEstimation/CreateOrUpdateJobEstimation` | 7793 |
| `job.createOrUpdateJob` | `api/services/app/job/CreateOrUpdateJob` | 21974 |
| `job.getJobForClosing` | `api/services/app/job/GetJobForClosing` | 22158 |
| `job.closeWorkShop` | `api/services/app/job/CloseWorkShop` | 21926 |
| `job.closeJob` | `api/services/app/job/CloseJob` | 22006 |
| `job.createInvoice` | `api/services/app/job/CreateInvoice` | 22014 |
| `itemRequisition.createOrUpdateItemRequisition` | `api/services/app/itemRequisition/CreateOrUpdateItemRequisition` | 13913 |
| `itemIssue.createOrUpdateItemIssue` | `api/services/app/itemIssue/CreateOrUpdateItemIssue` | 13988 |
| `purchaseOrder.createOrUpdatePurchaseOrder` | `api/services/app/purchaseOrder/CreateOrUpdatePurchaseOrder` | 3844 |
| `grn.createOrUpdateGrn` | `api/services/app/grn/CreateOrUpdateGrn` | 14424 |
| `bill.createOrUpdateGrnBill` | `api/services/app/bill/CreateOrUpdateGrnBill` | 6616 |
| `bill.createBillForPo` | `api/services/app/bill/CreateBillForPo` | 6608 |
| `bill.approveBill` | `api/services/app/bill/ApproveBill` | 6656 |
| `invoice.approveInvoice` | `api/services/app/invoice/ApproveInvoice` | 5460 |
| `payment.createOrUpdatePayment` | `api/services/app/payment/CreateOrUpdatePayment` | 4623 |
| `receipt.createOrUpdateReceipt` | `api/services/app/receipt/CreateOrUpdateReceipt` | 4235 |
| `allocation.getAllocationsForEdit` | `api/services/app/allocation/GetAllocationsForEdit` | 6771 |
| `linkedAccount.createOrUpdateLinkedAccount` | `api/services/app/linkedAccount/CreateOrUpdateLinkedAccount` | 37921 |
| `journal.getJournalView` | `api/services/app/journal/GetJournalView` | 39312 |

## أسئلة المراجعة التي تبقى مفتوحة

| مجال القرار | ما يثبته التحليل | ما يلزم استكماله |
|---|---|---|
| التتابع والاعتماد | توجد فروع مباشرة وروابط معرفات واعتمادات منفصلة | شروط الانتقال الفعلية على الخادم، ومنع تجاوز الصلاحيات واستدعاء الطلبات مباشرة |
| الكميات | الطلب والصرف والعمل مرتبطون بمعرفات؛ الاستلام والفاتورة مرتبطان بمرجع أب | الحجز والمتاح والسالب والصرف الجزئي وتكرار الاستلام أو الفوترة والتزامن |
| التقييم والمحاسبة | توجد تكلفة في نموذج الصرف وروابط حسابات وقراءة يومية | طريقة التقييم والحسابات المدينة والدائنة وتوقيت الترحيل وعكس القيود وتوازنها |
| الورشة والتأمين | نموذج الإغلاق يفصل فاتورة العميل عن شركة التأمين | حدود المطالبة والخصومات والتحمل والذرية وقواعد الإغلاق عند وجود فواتير سابقة |
| التسويات | التخصيص يربط أسطر المستندات؛ توجد شروط واجهة للمبالغ | قواعد الرصيد والسماح الجزئي والعملة والاستقطاع عند الخادم وإبطال تسوية سابقة |
| الفترة المالية | توجد طرق إغلاق وإعادة فتح | أثر الإغلاق على كل نوع مستند وتاريخ اعتماد أو إبطال لاحق |
| الشاشة الفعلية | توجد قائمة مستخلصة ومسارات وقوالب؛ خريطة الشاشات تربط القوالب بالمتحكمات ساكنًا | ظهور الأفعال والإعدادات والصلاحيات في جلسة مأذونة، ونتائج العمليات الراجعة من الخادم |

التغطية هنا ممثلة للدورات وليست فحصًا لكل شاشة أو كل تقرير: حُلّلت الروابط الرئيسية للورشة والطلب والصرف والشراء والاستلام وفاتورة المورد والإغلاق والفوترة والتحصيل والسداد والربط واليومية. بقيت تفاصيل المركبات والعمالة والتعريفة والتحويل والمرتجعات وتقارير الربحية وكامل فروع الضرائب والعملات والمستندات الإلكترونية خارج القراءة التفصيلية لهذه الحزمة. تُستكمل كل دورة بهذه الفروع قبل اعتبار مراجعتها الوظيفية والمحاسبية كاملة.
