# شاشة: Custody Movements

المسار في القائمة: Movements ← Custody Movements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_custodyMovements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0297](../../../readable/routes/R0297--tenant-crs-custodymovements.js)، والأصل [raw/application.js:3654](../../../raw/application.js#L3654).
- قالب الشاشة: `~/App/tenant/views/crs/custodyMovements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.custodyMovements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.custodyMovements.index](../../../readable/controllers/C0755--tenant.views.custodyMovements.index.js) | 17 | 2 |
| [tenant.views.crs.custodyMovements.printModal](../../../readable/controllers/C0756--tenant.views.crs.custodyMovements.printModal.js) | 3 | 3 |
| [tenant.views.crs.custodyMovements.createOrEditModal](../../../readable/controllers/C0753--tenant.views.crs.custodyMovements.createOrEditModal.js) | 6 | 5 |
| [tenant.views.crs.custodyMovements.closeModal](../../../readable/controllers/C0752--tenant.views.crs.custodyMovements.closeModal.js) | 8 | 4 |
| [tenant.views.crs.custodyMovements.viewModal](../../../readable/controllers/C0757--tenant.views.crs.custodyMovements.viewModal.js) | 3 | 3 |
| [tenant.views.crs.custodyMovements.editModal](../../../readable/controllers/C0754--tenant.views.crs.custodyMovements.editModal.js) | 4 | 3 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.custodyMovements.index`: `statusChanged`، `getFuelLevel`، `locationPermissionClose`، `locationPermissionEditDelete`، `getlocalDateTime`، `getlocalDate`، `getlocalizedString`، `getCustodyMovements`، `getDriverMinutes`، `dateRangeCheck`، `exportToExcel`، `printMethod`، `createCustodyMovement`، `editCustodyMovement`، `closeCustodyMovement`، `viewCustodyMovement`، `editCustodyMovement`.
- وحدة `tenant.views.crs.custodyMovements.printModal`: `getlocalDateTime`، `getFuelLevel`، `cancel`.
- وحدة `tenant.views.crs.custodyMovements.createOrEditModal`: `getlocalDateTime`، `localize`، `searchVehicles`، `searchVehiclePopup`، `save`، `cancel`.
- وحدة `tenant.views.crs.custodyMovements.closeModal`: `getlocalDateTime`، `getFuelLevel`، `searchVehicles`، `searchVehiclePopup`، `vehicleSelected`، `changeReplaceVehicleCheckBox`، `cancel`، `save`.
- وحدة `tenant.views.crs.custodyMovements.viewModal`: `getlocalDateTime`، `getFuelLevel`، `cancel`.
- وحدة `tenant.views.crs.custodyMovements.editModal`: `getlocalDateTime`، `getFuelLevel`، `cancel`، `save`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.custody.getCustodys` | POST | api/services/app/custody/GetCustodys | [المصدر](../../../raw/application.js#L195691) |
| `abp.services.app.custody.exportToExcel` | POST | api/services/app/custody/ExportToExcel | [المصدر](../../../raw/application.js#L195860) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.custody.getCustodyForPrint` | POST | api/services/app/custody/GetCustodyForPrint | [المصدر](../../../raw/application.js#L196047) |
| `abp.services.app.custody.getManualAgreementNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L196110) |
| `abp.services.app.vehicle.searchVehiclesCustodyMovement` | POST | api/services/app/vehicle/SearchVehiclesCustodyMovement | [المصدر](../../../raw/application.js#L195395) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L195411) |
| `abp.services.app.custody.createOrUpdateCustody` | POST | api/services/app/custody/CreateOrUpdateCustody | [المصدر](../../../raw/application.js#L195481) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.custody.closeCustody` | POST | api/services/app/custody/CloseCustody | [المصدر](../../../raw/application.js#L195327) |
| `abp.services.app.custody.getCustodyForEdit` | POST | api/services/app/custody/GetCustodyForEdit | [المصدر](../../../raw/application.js#L195572) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L196089) |
| `abp.services.app.custody.updateCustody` | POST | api/services/app/custody/UpdateCustody | [المصدر](../../../raw/application.js#L195558) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.CustodyMovements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.CustodyMovements.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.CustodyMovements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.CustodyMovements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.CustodyMovements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.movementNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.IsCompleted` | select | outDetail_fuelPercentage |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
