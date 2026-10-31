# شاشة: Branches

المسار في القائمة: Administration ← Branches.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.locations`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0154](../../../readable/routes/R0154--tenant-locations.js)، والأصل [raw/application.js:2611](../../../raw/application.js#L2611).
- قالب الشاشة: `~/App/tenant/views/common/locations/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.locations.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.locations.index](../../../readable/controllers/C0399--tenant.views.locations.index.js) | 4 | 2 |
| [tenant.views.locations.createOrEditModal](../../../readable/controllers/C0398--tenant.views.locations.createOrEditModal.js) | 5 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.locations.index`: `getLocations`، `createLocation`، `editLocation`، `deleteLocation`.
- وحدة `tenant.views.locations.createOrEditModal`: `getlocalDateTime`، `addRow`، `removeRow`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.location.getLocations` | POST | api/services/app/location/GetLocations | [المصدر](../../../raw/application.js#L101505) |
| `abp.services.app.location.deleteLocation` | POST | api/services/app/location/DeleteLocation | [المصدر](../../../raw/application.js#L101542) |
| `abp.services.app.location.createOrUpdateLocation` | POST | api/services/app/location/CreateOrUpdateLocation | [المصدر](../../../raw/application.js#L101387) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L101403) |
| `abp.services.app.location.getLocationForEdit` | POST | api/services/app/location/GetLocationForEdit | [المصدر](../../../raw/application.js#L101411) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Locations.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Locations.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Locations.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
