# شاشة: Vehicles

المسار في القائمة: Workshop ← Vehicles.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_WorkshopVehicles`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0549](../../../readable/routes/R0549--tenant-crs-workshopvehicles.js)، والأصل [raw/application.js:5678](../../../raw/application.js#L5678).
- قالب الشاشة: `~/App/tenant/views/workshop/workshopVehicles/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.workshop.workshopVehicles.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.workshop.workshopVehicles.index](../../../readable/controllers/C1832--tenant.views.workshop.workshopVehicles.index.js) | 18 | 5 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.workshop.workshopVehicles.viewModal](../../../readable/controllers/C1833--tenant.views.workshop.workshopVehicles.viewModal.js) | 10 | 4 |
| [tenant.views.crs.vehicles.printDocumentModel](../../../readable/controllers/C1178--tenant.views.crs.vehicles.printDocumentModel.js) | 1 | 1 |
| [tenant.views.movements.viewModal](../../../readable/controllers/C1636--tenant.views.movements.viewModal.js) | 11 | 5 |
| [tenant.views.movements.uploadDocument](../../../readable/controllers/C1635--tenant.views.movements.uploadDocument.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.workshop.workshopVehicles.index`: `dateRangeModelChanged`، `getlocalDate`، `getFuelLevel`، `disbleDateRange`، `getVehicleValue`، `getOwnershipValue`، `localize`، `statusChanged`، `searchModel`، `locationPermission`، `getMakeAndModel`، `getModelYear`، `getVehicleType`، `getOwnershipName`، `report`، `getVehicles`، `viewVehicle`، `exportToExcel`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.workshop.workshopVehicles.viewModal`: `getlocalDateTime`، `getVehicleExternalType`، `getCostCenterGroup`، `getFuelLevel`، `openPrintModal`، `searchModel`، `getMovementStatus`، `viewMovement`، `searchTariffGroups`، `cancel`.
- وحدة `tenant.views.crs.vehicles.printDocumentModel`: `cancel`.
- وحدة `tenant.views.movements.viewModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `getFieldLabel`، `isCustomFieldExists`.
- وحدة `tenant.views.movements.uploadDocument`: `save`، `cancel`، `uploader.onSuccessItem`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L498954) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L498961) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L499129) |
| `abp.services.app.vehicle.getVehiclesForWorkshop` | POST | api/services/app/vehicle/GetVehiclesForWorkshop | [المصدر](../../../raw/application.js#L499169) |
| `abp.services.app.vehicle.exportToExcel` | POST | api/services/app/vehicle/ExportToExcel | [المصدر](../../../raw/application.js#L499211) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L499309) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L499370) |
| `abp.services.app.vehicle.getVehicleMovements` | POST | [object Object] | [المصدر](../../../raw/application.js#L499413) |
| `abp.services.app.vehicle.getVehicleForViewForWorkshop` | POST | api/services/app/vehicle/GetVehicleForViewForWorkshop | [المصدر](../../../raw/application.js#L499421) |
| `abp.services.app.vehicle.getVehicleForEdit` | POST | api/services/app/vehicle/GetVehicleForEdit | [المصدر](../../../raw/application.js#L312225) |
| `abp.services.app.movement.getSupportingDocuments` | POST | api/services/app/movement/GetSupportingDocuments | [المصدر](../../../raw/application.js#L450453) |
| `abp.services.app.checkList.getVehicleTypeWiseCheckList` | POST | api/services/app/checkList/GetVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L450504) |
| `abp.services.app.checkList.getCheckList` | POST | api/services/app/checkList/GetCheckList | [المصدر](../../../raw/application.js#L450518) |
| `abp.services.app.movement.getMovement` | POST | api/services/app/movement/GetMovement | [المصدر](../../../raw/application.js#L450612) |
| `abp.services.app.movement.addDocument` | POST | api/services/app/movement/AddDocument | [المصدر](../../../raw/application.js#L449951) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vehicles.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.DeFleet`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.OnFleet`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ChangeSubStatus`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.Alerts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.fleetCode` | text |  |  |
| `vm.filters.status` | select |  | ng-options=status as status.name for status in vm.statuses |
| `vm.filters.locationId` | select | locationId |  |
| `vm.vehicle.model` | ui-select |  |  |
| `vm.filters.modelYear` | text |  |  |
| `vm.filters.vehicleType` | select | vehicleType | ng-options=vehicleType.value as vehicleType.key for vehicleType in vm.vehicleTypes |
| `vm.filters.ownership` | select | ownership | ng-options=ownership.value as ownership.key for ownership in vm.vehicleOwnerships |
| `vm.filters.tariffGroupId` | select | vehicleType | ng-options=group.id as group.title for group in vm.tariffGroups |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
