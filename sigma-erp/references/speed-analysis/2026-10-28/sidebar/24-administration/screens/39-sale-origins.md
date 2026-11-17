# شاشة: Sale Origins

المسار في القائمة: Administration ← Sale Origins.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.saleOrigins`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0104](../../../readable/routes/R0104--tenant-saleorigins.js)، والأصل [raw/application.js:2176](../../../raw/application.js#L2176).
- قالب الشاشة: `~/App/tenant/views/crs/saleOrigins/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.saleOrigins.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.saleOrigins.index](../../../readable/controllers/C1110--tenant.views.crs.saleOrigins.index.js) | 4 | 2 |
| [tenant.views.crs.saleOrigins.createOrEditSaleOriginModal](../../../readable/controllers/C1109--tenant.views.crs.saleOrigins.createOrEditSaleOriginModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.saleOrigins.index`: `getSaleOrigins`، `createSaleOrigins`، `editSaleOrigins`، `deleteSaleOrigin`.
- وحدة `tenant.views.crs.saleOrigins.createOrEditSaleOriginModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.saleOrigin.getSaleOrigins` | POST | api/services/app/saleOrigin/GetSaleOrigins | [المصدر](../../../raw/application.js#L292717) |
| `abp.services.app.saleOrigin.deleteSaleOrigin` | POST | api/services/app/saleOrigin/DeleteSaleOrigin | [المصدر](../../../raw/application.js#L292738) |
| `abp.services.app.saleOrigin.createOrUpdateSaleOrigin` | POST | api/services/app/saleOrigin/CreateOrUpdateSaleOrigin | [المصدر](../../../raw/application.js#L292614) |
| `abp.services.app.saleOrigin.getSaleOriginForEdit` | POST | api/services/app/saleOrigin/GetSaleOriginForEdit | [المصدر](../../../raw/application.js#L292627) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.SaleOrigins.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SaleOrigins.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SaleOrigins.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
