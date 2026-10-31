# شاشة: Contact Groups

المسار في القائمة: Administration ← Contact Groups.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.contactGroups`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0156](../../../readable/routes/R0156--tenant-contactgroups.js)، والأصل [raw/application.js:2626](../../../raw/application.js#L2626).
- قالب الشاشة: `~/App/tenant/views/common/contactGroups/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.contactGroups.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.contactGroups.index](../../../readable/controllers/C0319--tenant.views.common.contactGroups.index.js) | 7 | 2 |
| [tenant.views.common.contactGroups.createOrEditModal](../../../readable/controllers/C0318--tenant.views.common.contactGroups.createOrEditModal.js) | 3 | 3 |
| [tenant.views.common.contactGroups.viewModal](../../../readable/controllers/C0320--tenant.views.common.contactGroups.viewModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.contactGroups.index`: `getContactType`، `contactTypeChanged`، `getContactGroups`، `createContactGroup`، `editContactGroup`، `viewContactGroup`، `deleteContactGroup`.
- وحدة `tenant.views.common.contactGroups.createOrEditModal`: `save`، `getCostCenters`، `cancel`.
- وحدة `tenant.views.common.contactGroups.viewModal`: `cancel`، `getCostCenters`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L86585) |
| `abp.services.app.contactGroup.deleteContactGroup` | POST | api/services/app/contactGroup/DeleteContactGroup | [المصدر](../../../raw/application.js#L86644) |
| `abp.services.app.contactGroup.createOrUpdateContactGroup` | POST | api/services/app/contactGroup/CreateOrUpdateContactGroup | [المصدر](../../../raw/application.js#L86465) |
| `abp.services.app.costCenter.getCostCenters` | POST | api/services/app/costCenter/GetCostCenters | [المصدر](../../../raw/application.js#L86692) |
| `abp.services.app.contactGroup.getContactGroupForEdit` | POST | api/services/app/contactGroup/GetContactGroupForEdit | [المصدر](../../../raw/application.js#L86699) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.ContactGroups`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ContactGroups.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ContactGroups.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ContactGroups.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.contactType` | select |  | ng-options=item.id as item.name for item in vm.contactTypes |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
