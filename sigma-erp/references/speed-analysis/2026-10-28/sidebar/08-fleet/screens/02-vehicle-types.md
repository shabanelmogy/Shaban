# شاشة: Vehicle Types

المسار في القائمة: Fleet ← Vehicle Types.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_vehicleTypes`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0341](../../../readable/routes/R0341--tenant-crs-vehicletypes.js)، والأصل [raw/application.js:3990](../../../raw/application.js#L3990).
- قالب الشاشة: `~/App/tenant/views/crs/vehicles/vehicleTypes/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vehicles.vehicleTypes.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vehicles.vehicleTypes.index](../../../readable/controllers/C1217--tenant.views.crs.vehicles.vehicleTypes.index.js) | 9 | 3 |
| [tenant.views.crs.vehicles.vehicleTypes.createOrEditModal](../../../readable/controllers/C1216--tenant.views.crs.vehicles.vehicleTypes.createOrEditModal.js) | 13 | 11 |
| [tenant.views.crs.vehicles.vehicleTypes.manageGroups](../../../readable/controllers/C1218--tenant.views.crs.vehicles.vehicleTypes.manageGroups.js) | 4 | 2 |
| [tenant.views.crs.lease.tariff.createOrEditModal](../../../readable/controllers/C0894--tenant.views.crs.lease.tariff.createOrEditModal.js) | 6 | 2 |
| [tenant.views.crs.tariffs.createOrEditModal](../../../readable/controllers/C1137--tenant.views.crs.tariffs.createOrEditModal.js) | 10 | 3 |
| [tenant.views.crs.tariffs.locationWiseSettingModal](../../../readable/controllers/C1138--tenant.views.crs.tariffs.locationWiseSettingModal.js) | 4 | 3 |
| [tenant.views.crs.tariffGroups.userWiseSettingModal](../../../readable/controllers/C1133--tenant.views.crs.tariffGroups.userWiseSettingModal.js) | 3 | 2 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.vehicle.vehicleTypes.checklist.createOrEditModal](../../../readable/controllers/C1219--tenant.views.vehicle.vehicleTypes.checklist.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vehicles.vehicleTypes.index`: `viewtariffGroup`، `getTariffGroup`، `manageGroups`، `createTariffGroup`، `editTariffGroup`، `deleteTariffGroup`، `defineTariff`، `locationWiseSetting`، `userWiseSetting`.
- وحدة `tenant.views.crs.vehicles.vehicleTypes.createOrEditModal`: `cancel`، `uploader.onSuccessItem`، `openUploadDocumentModel`، `removeImage`، `isDocument`، `isDocumentSepr`، `save`، `getAccrissCode`، `getChecklist`، `createChecklistItem`، `editChecklistItem`، `deleteChecklistItem`، `setActiveTabIndex`.
- وحدة `tenant.views.crs.vehicles.vehicleTypes.manageGroups`: `cancel`، `onBlur`، `updateGroupNo`، `getVehicleForManageGroups`.
- وحدة `tenant.views.crs.lease.tariff.createOrEditModal`: `localize`، `agreementTypeChanged`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`.
- وحدة `tenant.views.crs.tariffs.createOrEditModal`: `getlocalDateTime`، `getDateTariffCard`، `getTariffCards`، `localize`، `agreementTypeChanged`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`، `tariffCardChanged`.
- وحدة `tenant.views.crs.tariffs.locationWiseSettingModal`: `addRow`، `removeRow`، `cancel`، `save`.
- وحدة `tenant.views.crs.tariffGroups.userWiseSettingModal`: `cancel`، `save`، `getUsers`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.vehicle.vehicleTypes.checklist.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.tariffGroup.getTariffGroup` | POST | api/services/app/tariffGroup/GetTariffGroup | [المصدر](../../../raw/application.js#L319127) |
| `abp.services.app.tariffGroup.deleteTariffGroup` | POST | api/services/app/tariffGroup/DeleteTariffGroup | [المصدر](../../../raw/application.js#L319189) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L298813) |
| `abp.services.app.tariffGroup.getImageForShow` | POST | api/services/app/tariffGroup/GetImageForShow | [المصدر](../../../raw/application.js#L318808) |
| `abp.services.app.safetyCheckTemplate.searchTemplates` | POST | api/services/app/safetyCheckTemplate/SearchTemplates | [المصدر](../../../raw/application.js#L318629) |
| `abp.services.app.tariffGroup.createOrUpdateTariffGroup` | POST | api/services/app/tariffGroup/CreateOrUpdateTariffGroup | [المصدر](../../../raw/application.js#L318665) |
| `abp.services.app.tariffGroup.getAcrissCategoryTypes` | POST | api/services/app/tariffGroup/GetAcrissCategoryTypes | [المصدر](../../../raw/application.js#L318679) |
| `abp.services.app.tariffGroup.getAcrissTypes` | POST | api/services/app/tariffGroup/GetAcrissTypes | [المصدر](../../../raw/application.js#L318702) |
| `abp.services.app.tariffGroup.getAcrissTransDriveTypes` | POST | api/services/app/tariffGroup/GetAcrissTransDriveTypes | [المصدر](../../../raw/application.js#L318726) |
| `abp.services.app.tariffGroup.getAcrissFuelAcTypes` | POST | api/services/app/tariffGroup/GetAcrissFuelAcTypes | [المصدر](../../../raw/application.js#L318741) |
| `abp.services.app.tariffGroup.getTariffGroupForEdit` | POST | api/services/app/tariffGroup/GetTariffGroupForEdit | [المصدر](../../../raw/application.js#L318797) |
| `abp.services.app.checkList.getVehicleTypeWiseCheckList` | POST | api/services/app/checkList/GetVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L318916) |
| `abp.services.app.checkList.deleteCheckList` | POST | api/services/app/checkList/DeleteCheckList | [المصدر](../../../raw/application.js#L318962) |
| `abp.services.app.tariffGroup.updateGroupNo` | POST | api/services/app/tariffGroup/UpdateGroupNo | [المصدر](../../../raw/application.js#L319275) |
| `abp.services.app.tariffGroup.getVehicleForManageGroups` | POST | api/services/app/tariffGroup/GetVehicleForManageGroups | [المصدر](../../../raw/application.js#L319288) |
| `abp.services.app.tariff.createOrUpdateTariff` | POST | api/services/app/tariff/CreateOrUpdateTariff | [المصدر](../../../raw/application.js#L298731) |
| `abp.services.app.tariff.getTariffForEdit` | POST | api/services/app/tariff/GetTariffForEdit | [المصدر](../../../raw/application.js#L298755) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L298630) |
| `abp.services.app.locationTariffAdjustment.createOrUpdateLocationTariffAdjustment` | POST | api/services/app/locationTariffAdjustment/CreateOrUpdateLocationTariffAdjustment | [المصدر](../../../raw/application.js#L298823) |
| `abp.services.app.locationTariffAdjustment.getLocationTariffAdjustments` | POST | api/services/app/locationTariffAdjustment/GetLocationTariffAdjustments | [المصدر](../../../raw/application.js#L298836) |
| `abp.services.app.userWiseDiscount.createOrUpdateUserWiseDiscount` | POST | api/services/app/userWiseDiscount/CreateOrUpdateUserWiseDiscount | [المصدر](../../../raw/application.js#L298334) |
| `abp.services.app.userWiseDiscount.getUsers` | POST | api/services/app/userWiseDiscount/GetUsers | [المصدر](../../../raw/application.js#L298348) |
| `abp.services.app.checkList.createOrUpdateVehicleTypeWiseCheckList` | POST | api/services/app/checkList/CreateOrUpdateVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L319319) |
| `abp.services.app.checkList.getCheckListForEdit` | POST | api/services/app/checkList/GetCheckListForEdit | [المصدر](../../../raw/application.js#L319339) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.VehicleTypes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VehicleTypes.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VehicleTypes.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VehicleTypes.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.DiscountAuthCode`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Checklist.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIWorkshop.Checklist.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIGeneric.Checklist.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Checklist.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIWorkshop.Checklist.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIGeneric.Checklist.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Checklist.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIWorkshop.Checklist.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIGeneric.Checklist.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffCards`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.filter` | text |  |  |
| `vm.filters.inActive` | checkbox | Vehicle_Inactive |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
