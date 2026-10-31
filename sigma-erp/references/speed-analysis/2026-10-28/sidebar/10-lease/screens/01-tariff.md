# شاشة: Tariff

المسار في القائمة: Lease ← Tariff.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_leaseTariff`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0271](../../../readable/routes/R0271--tenant-crs-leasetariff.js)، والأصل [raw/application.js:3466](../../../raw/application.js#L3466).
- قالب الشاشة: `~/App/tenant/views/crs/tariffGroups/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.tariffGroups.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.tariffGroups.index](../../../readable/controllers/C1132--tenant.views.crs.tariffGroups.index.js) | 9 | 3 |
| [tenant.views.crs.tariffGroups.createOrEditModal](../../../readable/controllers/C1131--tenant.views.crs.tariffGroups.createOrEditModal.js) | 3 | 8 |
| [tenant.views.crs.lease.tariff.createOrEditModal](../../../readable/controllers/C0894--tenant.views.crs.lease.tariff.createOrEditModal.js) | 6 | 2 |
| [tenant.views.ers.rental.tariff.createOrEditModal](../../../readable/controllers/C1507--tenant.views.ers.rental.tariff.createOrEditModal.js) | 7 | 2 |
| [tenant.views.ers.lease.tariff.createOrEditModal](../../../readable/controllers/C1482--tenant.views.ers.lease.tariff.createOrEditModal.js) | 9 | 2 |
| [tenant.views.crs.tariffs.createOrEditModal](../../../readable/controllers/C1137--tenant.views.crs.tariffs.createOrEditModal.js) | 10 | 3 |
| [tenant.views.crs.chauffeur.tariffs.createOrEditModal](../../../readable/controllers/C0688--tenant.views.crs.chauffeur.tariffs.createOrEditModal.js) | 8 | 3 |
| [tenant.views.crs.chauffeur.tariffs.locationWiseSettingModal](../../../readable/controllers/C0690--tenant.views.crs.chauffeur.tariffs.locationWiseSettingModal.js) | 4 | 3 |
| [tenant.views.crs.tariffs.locationWiseSettingModal](../../../readable/controllers/C1138--tenant.views.crs.tariffs.locationWiseSettingModal.js) | 4 | 3 |
| [tenant.views.crs.tariffGroups.userWiseSettingModal](../../../readable/controllers/C1133--tenant.views.crs.tariffGroups.userWiseSettingModal.js) | 3 | 2 |
| [tenant.views.crs.tariffGroups.branchWiseUserSettingModal](../../../readable/controllers/C1130--tenant.views.crs.tariffGroups.branchWiseUserSettingModal.js) | 5 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.tariffGroups.index`: `viewtariffGroup`، `getTariffGroup`، `createTariffGroup`، `editTariffGroup`، `deleteTariffGroup`، `defineTariff`، `locationWiseSetting`، `userWiseSetting`، `branchWiseSetting`.
- وحدة `tenant.views.crs.tariffGroups.createOrEditModal`: `cancel`، `uploader.onSuccessItem`، `save`.
- وحدة `tenant.views.crs.lease.tariff.createOrEditModal`: `localize`، `agreementTypeChanged`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`.
- وحدة `tenant.views.ers.rental.tariff.createOrEditModal`: `localize`، `agreementTypeChanged`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`، `tariffCardChanged`.
- وحدة `tenant.views.ers.lease.tariff.createOrEditModal`: `localize`، `agreementTypeChanged`، `startDateChanged`، `endDateChanged`، `vehicleSelected`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`.
- وحدة `tenant.views.crs.tariffs.createOrEditModal`: `getlocalDateTime`، `getDateTariffCard`، `getTariffCards`، `localize`، `agreementTypeChanged`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`، `tariffCardChanged`.
- وحدة `tenant.views.crs.chauffeur.tariffs.createOrEditModal`: `getTariffCards`، `localize`، `agreementTypeChanged`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`، `tariffCardChanged`.
- وحدة `tenant.views.crs.chauffeur.tariffs.locationWiseSettingModal`: `addRow`، `removeRow`، `cancel`، `save`.
- وحدة `tenant.views.crs.tariffs.locationWiseSettingModal`: `addRow`، `removeRow`، `cancel`، `save`.
- وحدة `tenant.views.crs.tariffGroups.userWiseSettingModal`: `cancel`، `save`، `getUsers`.
- وحدة `tenant.views.crs.tariffGroups.branchWiseUserSettingModal`: `cancel`، `save`، `saveAndClose`، `getUsers`، `locationChange`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.tariffGroup.getTariffGroup` | POST | api/services/app/tariffGroup/GetTariffGroup | [المصدر](../../../raw/application.js#L298126) |
| `abp.services.app.tariffGroup.deleteTariffGroup` | POST | api/services/app/tariffGroup/DeleteTariffGroup | [المصدر](../../../raw/application.js#L298167) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L297758) |
| `abp.services.app.tariffGroup.getImageForShow` | POST | api/services/app/tariffGroup/GetImageForShow | [المصدر](../../../raw/application.js#L297971) |
| `abp.services.app.tariffGroup.createOrUpdateTariffGroup` | POST | api/services/app/tariffGroup/CreateOrUpdateTariffGroup | [المصدر](../../../raw/application.js#L297908) |
| `abp.services.app.tariffGroup.getAcrissCategoryTypes` | POST | api/services/app/tariffGroup/GetAcrissCategoryTypes | [المصدر](../../../raw/application.js#L297921) |
| `abp.services.app.tariffGroup.getAcrissTypes` | POST | api/services/app/tariffGroup/GetAcrissTypes | [المصدر](../../../raw/application.js#L297930) |
| `abp.services.app.tariffGroup.getAcrissTransDriveTypes` | POST | api/services/app/tariffGroup/GetAcrissTransDriveTypes | [المصدر](../../../raw/application.js#L297938) |
| `abp.services.app.tariffGroup.getAcrissFuelAcTypes` | POST | api/services/app/tariffGroup/GetAcrissFuelAcTypes | [المصدر](../../../raw/application.js#L297947) |
| `abp.services.app.tariffGroup.getTariffGroupForEdit` | POST | api/services/app/tariffGroup/GetTariffGroupForEdit | [المصدر](../../../raw/application.js#L297961) |
| `abp.services.app.tariff.createOrUpdateTariff` | POST | api/services/app/tariff/CreateOrUpdateTariff | [المصدر](../../../raw/application.js#L178108) |
| `abp.services.app.tariff.getTariffForEdit` | POST | api/services/app/tariff/GetTariffForEdit | [المصدر](../../../raw/application.js#L178132) |
| `abp.services.app.eRSTariff.createOrUpdateTariff` | POST | api/services/app/eRSTariff/CreateOrUpdateTariff | [المصدر](../../../raw/application.js#L405162) |
| `abp.services.app.eRSTariff.getTariffForEdit` | POST | api/services/app/eRSTariff/GetTariffForEdit | [المصدر](../../../raw/application.js#L405183) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L178007) |
| `abp.services.app.locationTariffAdjustment.createOrUpdateLocationTariffAdjustment` | POST | api/services/app/locationTariffAdjustment/CreateOrUpdateLocationTariffAdjustment | [المصدر](../../../raw/application.js#L298823) |
| `abp.services.app.locationTariffAdjustment.getLocationTariffAdjustments` | POST | api/services/app/locationTariffAdjustment/GetLocationTariffAdjustments | [المصدر](../../../raw/application.js#L298836) |
| `abp.services.app.userWiseDiscount.createOrUpdateUserWiseDiscount` | POST | api/services/app/userWiseDiscount/CreateOrUpdateUserWiseDiscount | [المصدر](../../../raw/application.js#L298334) |
| `abp.services.app.userWiseDiscount.getUsers` | POST | api/services/app/userWiseDiscount/GetUsers | [المصدر](../../../raw/application.js#L298348) |
| `abp.services.app.userWiseDiscount.createOrUpdateBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/CreateOrUpdateBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L297784) |
| `abp.services.app.userWiseDiscount.getUsersByLocationId` | POST | api/services/app/userWiseDiscount/GetUsersByLocationId | [المصدر](../../../raw/application.js#L297798) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.TariffGroups`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffGroups.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffGroups.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffGroups.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.DiscountAuthCode`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Tariff`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Tariff`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Lease.Tariff`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffCards`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.filter` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
