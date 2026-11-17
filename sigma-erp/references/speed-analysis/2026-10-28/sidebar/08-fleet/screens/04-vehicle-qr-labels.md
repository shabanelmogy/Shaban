# شاشة: Vehicle QR labels

المسار في القائمة: Fleet ← Vehicle QR labels.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.mcc_vehicleqrlabels`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0354](../../../readable/routes/R0354--tenant-mcc-vehicleqrlabels.js)، والأصل [raw/application.js:4074](../../../raw/application.js#L4074).
- قالب الشاشة: `~/App/tenant/views/mcc/vehicleqrlabels/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.vehicleqrlabels.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.vehicleqrlabels.index](../../../readable/controllers/C1642--tenant.views.vehicleqrlabels.index.js) | 6 | 7 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.vehicleqrlabels.index`: `clearVehicle`، `clearModel`، `getVehicles`، `searchVehicles`، `getLabels`، `searchModel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.getBookedVehicles` | POST | api/services/app/vehicle/GetBookedVehicles | [المصدر](../../../raw/application.js#L451391) |
| `abp.services.app.vehicle.getVehicles` | POST | api/services/app/vehicle/GetVehicles | [المصدر](../../../raw/application.js#L451402) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L451420) |
| `abp.services.app.qRLabel.generateQRLabels` | POST | api/services/app/qRLabel/GenerateQRLabels | [المصدر](../../../raw/application.js#L451435) |
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L451446) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L451452) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L451457) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.vehicle` | ui-select |  |  |
| `vm.model` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.modelYear` | text |  |  |
| `vm.filters.tariffGroupId` | select | vehicleType | ng-options=group.id as group.title for group in vm.tariffGroups |
| `vm.labelType` | radio | QRLables_LabelType |  |
| `vm.labelType` | radio | QRLables_LabelType |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
