# شاشة: Voucher Reasons

المسار في القائمة: Administration ← Voucher Reasons.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.voucherReasons`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0509](../../../readable/routes/R0509--tenant-voucherreasons.js)، والأصل [raw/application.js:5309](../../../raw/application.js#L5309).
- قالب الشاشة: `~/App/tenant/views/common/voucherReasons/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.voucherReasons.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.voucherReasons.index](../../../readable/controllers/C0447--tenant.views.voucherReasons.index.js) | 4 | 2 |
| [tenant.views.voucherReasons.createOrEditModal](../../../readable/controllers/C0446--tenant.views.voucherReasons.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.voucherReasons.index`: `getVoucherReasons`، `createVoucherReason`، `editVoucherReason`، `deleteVoucherReason`.
- وحدة `tenant.views.voucherReasons.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.voucherReason.getVoucherReasons` | POST | api/services/app/voucherReason/GetVoucherReasons | [المصدر](../../../raw/application.js#L115646) |
| `abp.services.app.voucherReason.deleteVoucherReason` | POST | api/services/app/voucherReason/DeleteVoucherReason | [المصدر](../../../raw/application.js#L115683) |
| `abp.services.app.voucherReason.createOrUpdateVoucherReason` | POST | api/services/app/voucherReason/CreateOrUpdateVoucherReason | [المصدر](../../../raw/application.js#L115572) |
| `abp.services.app.voucherReason.getVoucherReasonForEdit` | POST | api/services/app/voucherReason/GetVoucherReasonForEdit | [المصدر](../../../raw/application.js#L115587) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.VoucherReasons.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VoucherReasons.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VoucherReasons.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
