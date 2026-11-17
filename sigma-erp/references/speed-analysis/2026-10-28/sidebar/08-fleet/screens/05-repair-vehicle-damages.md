# شاشة: Repair Vehicle Damages

المسار في القائمة: Fleet ← Repair Vehicle Damages.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.mcc_fixmarks`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0241](../../../readable/routes/R0241--tenant-mcc-fixmarks.js)، والأصل [raw/application.js:3228](../../../raw/application.js#L3228).
- قالب الشاشة: `~/App/tenant/views/mcc/fixmarks/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.fixmarks.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.fixmarks.index](../../../readable/controllers/C1626--tenant.views.fixmarks.index.js) | 5 | 2 |
| [tenant.views.mcc.fixMarks.confirmationRepairedMarkWithNotes](../../../readable/controllers/C1625--tenant.views.mcc.fixMarks.confirmationRepairedMarkWithNotes.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.fixmarks.index`: `searchVehicles`، `getMarks`، `fixAllExteriorMarks`، `fixAllInteriorMarks`، `rapairMark`.
- وحدة `tenant.views.mcc.fixMarks.confirmationRepairedMarkWithNotes`: `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L445948) |
| `abp.services.app.vehicle.getVehicleMarks` | POST | api/services/app/vehicle/GetVehicleMarks | [المصدر](../../../raw/application.js#L445961) |
| `abp.services.app.movement.repairAllMarks` | POST | api/services/app/movement/RepairAllMarks | [المصدر](../../../raw/application.js#L445889) |
| `abp.services.app.movement.repairMark` | POST | api/services/app/movement/RepairMark | [المصدر](../../../raw/application.js#L445900) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vehicles.FixMarks.FixAllDamages`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.vehicle` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
