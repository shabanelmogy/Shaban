# شاشة: Service Items

المسار في القائمة: Fleet ← Service Items.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_serviceItems`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0352](../../../readable/routes/R0352--tenant-crs-serviceitems.js)، والأصل [raw/application.js:4058](../../../raw/application.js#L4058).
- قالب الشاشة: `~/App/tenant/views/crs/vehicles/serviceItems/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.vehicles.serviceItems.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.vehicles.serviceItems.index](../../../readable/controllers/C1209--tenant.views.vehicles.serviceItems.index.js) | 4 | 2 |
| [tenant.views.vehicles.serviceItems.createOrEditModal](../../../readable/controllers/C1208--tenant.views.vehicles.serviceItems.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.vehicles.serviceItems.index`: `getServiceItems`، `createServiceItem`، `editServiceItem`، `deleteServiceItem`.
- وحدة `tenant.views.vehicles.serviceItems.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.serviceItem.getServiceItems` | POST | api/services/app/serviceItem/GetServiceItems | [المصدر](../../../raw/application.js#L317387) |
| `abp.services.app.serviceItem.deleteServiceItem` | POST | api/services/app/serviceItem/DeleteServiceItem | [المصدر](../../../raw/application.js#L317424) |
| `abp.services.app.serviceItem.createOrUpdateServiceItem` | POST | api/services/app/serviceItem/CreateOrUpdateServiceItem | [المصدر](../../../raw/application.js#L317310) |
| `abp.services.app.serviceItem.getServiceItemForEdit` | POST | api/services/app/serviceItem/GetServiceItemForEdit | [المصدر](../../../raw/application.js#L317325) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.ServiceItems.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ServiceItems.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ServiceItems.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
