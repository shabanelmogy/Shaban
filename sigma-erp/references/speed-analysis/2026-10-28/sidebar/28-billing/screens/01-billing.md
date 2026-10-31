# شاشة: Billing

المسار في القائمة: Billing.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.Billing`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0108](../../../readable/routes/R0108--tenant-billing.js)، والأصل [raw/application.js:2221](../../../raw/application.js#L2221).
- قالب الشاشة: `~/App/tenant/views/crs/billing/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.billing.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.billing.index](../../../readable/controllers/C0651--tenant.views.crs.billing.index.js) | 6 | 2 |
| [tenant.views.crs.billing.invoicePrintTemplate](../../../readable/controllers/C0653--tenant.views.crs.billing.invoicePrintTemplate.js) | 7 | 1 |
| [tenant.views.crs.billing.paymentDetailModal](../../../readable/controllers/C0654--tenant.views.crs.billing.paymentDetailModal.js) | 6 | 1 |
| [tenant.views.crs.billing.invoicePaymentModal](../../../readable/controllers/C0652--tenant.views.crs.billing.invoicePaymentModal.js) | 5 | 2 |
| [tenant.views.crs.billing.receiptPrintTemplate](../../../readable/controllers/C0655--tenant.views.crs.billing.receiptPrintTemplate.js) | 6 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.billing.index`: `filteredOutstandingInvoices`، `getOpenInvoices`، `getCloseInvoices`، `print`، `invoiceStatus`، `paymentDetail`.
- وحدة `tenant.views.crs.billing.invoicePrintTemplate`: `multilineStringToHTMLWordBreak`، `cancel`، `changeLogo`، `getSubscriptionInvoiceById`، `redirectToCheckout`، `paymentModal`، `getStatusName`.
- وحدة `tenant.views.crs.billing.paymentDetailModal`: `sumAmount`، `rounding`، `getType`، `getReceiptsByInvoice`، `receipt`، `cancel`.
- وحدة `tenant.views.crs.billing.invoicePaymentModal`: `cancel`، `save`، `cardType`، `getlocalDate`، `init`.
- وحدة `tenant.views.crs.billing.receiptPrintTemplate`: `getlocalDateTime`، `multilineStringToHTMLWordBreak`، `cancel`، `changeLogo`، `getReceiptById`، `getStatusName`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.customerCareTenant.openInvoices` | POST | api/services/app/customerCareTenant/OpenInvoices | [المصدر](../../../raw/application.js#L170176) |
| `abp.services.app.customerCareTenant.closeInvoices` | POST | api/services/app/customerCareTenant/CloseInvoices | [المصدر](../../../raw/application.js#L170202) |
| `abp.services.app.customerCareTenant.getInvoiceById` | POST | [object Object] | [المصدر](../../../raw/application.js#L170425) |
| `abp.services.app.customerCareTenant.getReceiptsByInvoiceId` | POST | api/services/app/customerCareTenant/GetReceiptsByInvoiceId | [المصدر](../../../raw/application.js#L170519) |
| `abp.services.app.customerCareTenant.invoiceSilentPayment` | POST | api/services/app/customerCareTenant/InvoiceSilentPayment | [المصدر](../../../raw/application.js#L170287) |
| `abp.services.app.customerCareTenant.getTenantCardById` | POST | api/services/app/customerCareTenant/GetTenantCardById | [المصدر](../../../raw/application.js#L170335) |
| `abp.services.app.customerCareTenant.getReceiptForPrint` | POST | api/services/app/customerCareTenant/GetReceiptForPrint | [المصدر](../../../raw/application.js#L170634) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.invoiceType` | select |  | ng-options=type.id as type.name for type in vm.invoiceTypes |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
