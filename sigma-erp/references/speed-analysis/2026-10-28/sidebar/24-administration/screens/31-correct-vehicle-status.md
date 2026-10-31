# شاشة: Correct Vehicle Status

المسار في القائمة: Administration ← Correct Vehicle Status.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.correctVehcileStatus`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0510](../../../readable/routes/R0510--tenant-correctvehcilestatus.js)، والأصل [raw/application.js:5316](../../../raw/application.js#L5316).
- قالب الشاشة: `~/App/tenant/views/common/correctVehicleStatus/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.correctVehicleStatus.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.correctVehicleStatus.index](../../../readable/controllers/C0321--tenant.views.common.correctVehicleStatus.index.js) | 4 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.correctVehicleStatus.index`: `getlocalDateTime`، `searchVehicles`، `vehicleChanged`، `convertVehicleStatus`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L86746) |
| `abp.services.app.vehicleStatus.getLastMovementAndSuggestedStatus` | POST | api/services/app/vehicleStatus/GetLastMovementAndSuggestedStatus | [المصدر](../../../raw/application.js#L86753) |
| `abp.services.app.vehicleStatus.convertStatus` | POST | api/services/app/vehicleStatus/ConvertStatus | [المصدر](../../../raw/application.js#L86766) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.vehicle` | ui-select |  |  |
| `vm.vehicle.statusId` | text |  |  |
| `vm.movementstatus.movementName` | text |  |  |
| `vm.movementstatus.movementNo` | text |  |  |
| ` vm.getlocalDateTime(vm.movementstatus.date)` | text |  |  |
| `vm.movementstatus.suggestedStatus` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
