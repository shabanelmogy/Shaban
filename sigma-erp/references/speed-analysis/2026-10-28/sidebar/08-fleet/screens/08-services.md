# شاشة: Services

المسار في القائمة: Fleet ← Services.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_services`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0353](../../../readable/routes/R0353--tenant-crs-services.js)، والأصل [raw/application.js:4066](../../../raw/application.js#L4066).
- قالب الشاشة: `~/App/tenant/views/crs/vehicles/services.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vehicles.services as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vehicles.services](../../../readable/controllers/C1192--tenant.views.crs.vehicles.services.js) | 19 | 10 |
| [tenant.views.crs.vehicles.createOrEditServicesModal](../../../readable/controllers/C1165--tenant.views.crs.vehicles.createOrEditServicesModal.js) | 9 | 5 |
| [tenant.views.crs.vehicles.viewServicesModal](../../../readable/controllers/C1202--tenant.views.crs.vehicles.viewServicesModal.js) | 1 | 3 |
| [tenant.views.crs.vehicles.copyServicesModal](../../../readable/controllers/C1162--tenant.views.crs.vehicles.copyServicesModal.js) | 4 | 3 |
| [tenant.views.crs.vehicles.importServiceModel](../../../readable/controllers/C1172--tenant.views.crs.vehicles.importServiceModel.js) | 4 | 2 |
| [tenant.views.crs.vehicles.serviceItems.serviceItemsSelectorModal](../../../readable/controllers/C1210--tenant.views.crs.vehicles.serviceItems.serviceItemsSelectorModal.js) | 4 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vehicles.services`: `setActiveTabIndex`، `searchMake`، `searchModel`، `copyDefaultServices`، `copyDefaultOrMakeServices`، `createService`، `createModelService`، `editService`، `editModelService`، `editMakeService`، `deleteService`، `deleteModelService`، `deleteMakeService`، `viewService`، `openCopyServicesModal`، `getVehicleServicesByModel`، `getVehicleServicesByMake`، `uploader.onSuccessItem`، `uploader.onErrorItem`.
- وحدة `tenant.views.crs.vehicles.createOrEditServicesModal`: `openServiceItemsSelector`، `searchItems`، `deleteItem`، `save`، `cancel`، `addPartsRow`، `removePartsRow`، `addLabourRow`، `removeLabourRow`.
- وحدة `tenant.views.crs.vehicles.viewServicesModal`: `cancel`.
- وحدة `tenant.views.crs.vehicles.copyServicesModal`: `searchMake`، `searchModel`، `save`، `cancel`.
- وحدة `tenant.views.crs.vehicles.importServiceModel`: `cancel`، `getlocalDateTime`، `generateImportedServiceLogs`، `exportToExcel`.
- وحدة `tenant.views.crs.vehicles.serviceItems.serviceItemsSelectorModal`: `selectionCommit`، `selectAllChange`، `removeSelectedItems`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.make.searchPreUsedMakes` | POST | api/services/app/make/SearchPreUsedMakes | [المصدر](../../../raw/application.js#L314037) |
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L314048) |
| `abp.services.app.vehicleService.copyDefaultServices` | POST | api/services/app/vehicleService/CopyDefaultServices | [المصدر](../../../raw/application.js#L314056) |
| `abp.services.app.vehicleService.copyDefaultOrMakeServices` | POST | api/services/app/vehicleService/CopyDefaultOrMakeServices | [المصدر](../../../raw/application.js#L314068) |
| `abp.services.app.vehicleService.deleteVehicleService` | POST | api/services/app/vehicleService/DeleteVehicleService | [المصدر](../../../raw/application.js#L314295) |
| `abp.services.app.vehicleService.getVehicleServices` | POST | api/services/app/vehicleService/GetVehicleServices | [المصدر](../../../raw/application.js#L314348) |
| `abp.services.app.vehicleService.getVehicleServicesByModel` | POST | api/services/app/vehicleService/GetVehicleServicesByModel | [المصدر](../../../raw/application.js#L314359) |
| `abp.services.app.vehicleService.getVehicleServicesByMake` | POST | api/services/app/vehicleService/GetVehicleServicesByMake | [المصدر](../../../raw/application.js#L314370) |
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L316651) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L308084) |
| `abp.services.app.vehicleService.createOrUpdateService` | POST | api/services/app/vehicleService/CreateOrUpdateService | [المصدر](../../../raw/application.js#L308125) |
| `abp.services.app.serviceItem.getServiceItems` | POST | api/services/app/serviceItem/GetServiceItems | [المصدر](../../../raw/application.js#L317487) |
| `abp.services.app.vehicleService.getVehicleServiceForEdit` | POST | api/services/app/vehicleService/GetVehicleServiceForEdit | [المصدر](../../../raw/application.js#L316665) |
| `abp.services.app.make.searchMakes` | POST | api/services/app/make/SearchMakes | [المصدر](../../../raw/application.js#L306911) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L306921) |
| `abp.services.app.vehicleService.copyServices` | POST | api/services/app/vehicleService/CopyServices | [المصدر](../../../raw/application.js#L306937) |
| `abp.services.app.vehicleService.importServicesFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L309778) |
| `abp.services.app.vehicleServiceLog.generateImportedServiceLogs` | POST | api/services/app/vehicleServiceLog/GenerateImportedServiceLogs | [المصدر](../../../raw/application.js#L309825) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Services.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Services.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Services.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Services.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.make` | ui-select |  |  |
| `vm.model` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
