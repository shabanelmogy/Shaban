# شاشة: Staff Roles

المسار في القائمة: HRM ← Administration ← Staff Roles.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_staffRole`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0138](../../../readable/routes/R0138--tenant-hrm-staffrole.js)، والأصل [raw/application.js:2491](../../../raw/application.js#L2491).
- قالب الشاشة: `~/App/tenant/views/hrm/staffRole/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.hrm.staffRole.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.hrm.staffRole.index](../../../readable/controllers/C1615--tenant.views.hrm.staffRole.index.js) | 7 | 3 |
| [tenant.views.hrm.staffRole.createOrEditModal](../../../readable/controllers/C1614--tenant.views.hrm.staffRole.createOrEditModal.js) | 2 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.hrm.staffRole.index`: `searchButtonCLick`، `searchItems`، `getStaffRoles`، `addStaffRole`، `viewStaffRole`، `editStaffRole`، `DeleteStaffRole`.
- وحدة `tenant.views.hrm.staffRole.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.staffRole.getStaffRole` | POST | api/services/app/staffRole/GetStaffRole | [المصدر](../../../raw/application.js#L443613) |
| `abp.services.app.staffRole.deleteStaffRole` | POST | [object Object] | [المصدر](../../../raw/application.js#L443683) |
| `abp.services.app.staffRole.createOrUpdateStaffRole` | POST | api/services/app/staffRole/CreateOrUpdateStaffRole | [المصدر](../../../raw/application.js#L443459) |
| `abp.services.app.staffRole.getStaffRoleForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L443476) |

## الصلاحيات والحقول

- صلاحية `Pages.HRM.StaffRole.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.StaffRole.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.StaffRole.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.StaffRole.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.staffRoleName` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
