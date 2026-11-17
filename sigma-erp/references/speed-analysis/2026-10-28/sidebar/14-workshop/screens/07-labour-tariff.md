# شاشة: Labour Tariff

المسار في القائمة: Workshop ← Labour Tariff.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_LabourTariff`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0553](../../../readable/routes/R0553--tenant-crs-labourtariff.js)، والأصل [raw/application.js:5713](../../../raw/application.js#L5713).
- قالب الشاشة: `~/App/tenant/views/workshop/labourTariff/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.workshop.labourTariff.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.workshop.labourTariff.index](../../../readable/controllers/C1820--tenant.views.workshop.labourTariff.index.js) | 7 | 7 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.workshop.labourTariff.index`: `addRow`، `removeRow`، `addRowVehicleType`، `removeRowVehicleType`، `getTariffGroups`، `getLabourTariffByVehicleType`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L496526) |
| `abp.services.app.labourActivity.getLabourActivities` | POST | api/services/app/labourActivity/GetLabourActivities | [المصدر](../../../raw/application.js#L496539) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L496552) |
| `abp.services.app.labourTariff.getLabourTariffForEdit` | POST | api/services/app/labourTariff/GetLabourTariffForEdit | [المصدر](../../../raw/application.js#L496592) |
| `abp.services.app.labourTariff.createOrUpdateLabourTariff` | POST | api/services/app/labourTariff/CreateOrUpdateLabourTariff | [المصدر](../../../raw/application.js#L496572) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `line.designationId` | select |  | ng-options=designation.id as designation.name for designation in vm.designations |
| `line.activityId` | select |  | ng-options=activity.id as activity.name for activity in vm.labourActivities |
| `line.minutes` | text | minutes |  |
| `line.cost` | text | cost |  |
| `vm.tariffGroup` | ui-select |  | ng-required=true |
| `line.designationId` | select |  | ng-options=designation.id as designation.name for designation in vm.designations |
| `line.activityId` | select |  | ng-options=activity.id as activity.name for activity in vm.labourActivities |
| `line.minutes` | text | minutes |  |
| `line.cost` | text | cost |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
