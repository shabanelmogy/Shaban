# شاشة: Campaign

المسار في القائمة: CRM ← Marketing ← Campaign.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_campaign`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0247](../../../readable/routes/R0247--tenant-crs-campaign.js)، والأصل [raw/application.js:3279](../../../raw/application.js#L3279).
- قالب الشاشة: `~/App/tenant/views/crs/crm/marketing/campaign/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.crm.marketing.campaign.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.crm.marketing.campaign.index](../../../readable/controllers/C0734--tenant.views.crs.crm.marketing.campaign.index.js) | 18 | 4 |
| [tenant.views.crs.crm.marketing.campaign.createOrEditModal](../../../readable/controllers/C0731--tenant.views.crs.crm.marketing.campaign.createOrEditModal.js) | 16 | 14 |
| [tenant.views.crs.crm.marketing.campaign.detailModal](../../../readable/controllers/C0733--tenant.views.crs.crm.marketing.campaign.detailModal.js) | 5 | 3 |
| [tenant.views.crs.crm.marketing.campaign.cRMCampaignLogsModal](../../../readable/controllers/C0732--tenant.views.crs.crm.marketing.campaign.cRMCampaignLogsModal.js) | 2 | 1 |
| [tenant.views.crs.crm.marketing.campaign.addProspectsModal](../../../readable/controllers/C0730--tenant.views.crs.crm.marketing.campaign.addProspectsModal.js) | 3 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.crm.marketing.campaign.index`: `getCampaignStatus`، `locationPermission`، `getCampaigns`، `exportToExcel`، `viewAgreementsHistoryModal`، `createCampaign`، `editCampaign`، `detailCampaign`، `campaignLogs`، `viewCampaign`، `deleteCampaign`، `openCRMCampaignLogsModal`، `searchUsers`، `onAssignedUserChange`، `clearAssignedUser`، `dateRangeModelChanged`، `dateRangeCheck`، `getlocalDateTime`.
- وحدة `tenant.views.crs.crm.marketing.campaign.createOrEditModal`: `getlocalizedString`، `searchProperties`، `cancel`، `save`، `getEnums`، `searchUsers`، `clearSalesPersonUser`، `openAddProspectsModal`، `getProspects`، `removeProspect`، `onAudienceTabSelect`، `exportToExcel`، `downloadProspectExcel`، `searchModel`، `getTeriffGroups`، `searchCountries`.
- وحدة `tenant.views.crs.crm.marketing.campaign.detailModal`: `getlocalizedString`، `openAddProspectsModal`، `cancel`، `save`، `getProspects`.
- وحدة `tenant.views.crs.crm.marketing.campaign.cRMCampaignLogsModal`: `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.crm.marketing.campaign.addProspectsModal`: `addSelectedProspects`، `cancel`، `getProspects`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.cRMCampaign.getCRMCampaigns` | POST | api/services/app/cRMCampaign/GetCRMCampaigns | [المصدر](../../../raw/application.js#L190178) |
| `abp.services.app.cRMCampaign.exportToExcelTenant` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L190187) |
| `abp.services.app.cRMCampaign.deleteCampaign` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L190287) |
| `abp.services.app.user.searchUsers` | POST | api/services/app/user/SearchUsers | [المصدر](../../../raw/application.js#L189341) |
| `abp.services.app.cRMCampaign.editCRMCampaign` | POST | api/services/app/cRMCampaign/EditCRMCampaign | [المصدر](../../../raw/application.js#L189900) |
| `abp.services.app.cRMCampaign.addCRMCampaign` | POST | api/services/app/cRMCampaign/AddCRMCampaign | [المصدر](../../../raw/application.js#L189910) |
| `abp.services.app.cRMCampaign.getProducts` | POST | api/services/app/cRMCampaign/GetProducts | [المصدر](../../../raw/application.js#L189324) |
| `abp.services.app.cRMCampaign.getCRMCampaignTypes` | POST | api/services/app/cRMCampaign/GetCRMCampaignTypes | [المصدر](../../../raw/application.js#L189332) |
| `abp.services.app.cRMCampaign.getCampaignProspects` | POST | api/services/app/cRMCampaign/GetCampaignProspects | [المصدر](../../../raw/application.js#L189923) |
| `abp.services.app.cRMCampaign.removeProspectFromCampaign` | POST | api/services/app/cRMCampaign/RemoveProspectFromCampaign | [المصدر](../../../raw/application.js#L189487) |
| `abp.services.app.cRMCampaign.exportToExcelProspects` | POST | [object Object] | [المصدر](../../../raw/application.js#L189512) |
| `abp.services.app.person.exportProspectsByCampaignId` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L189527) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L189540) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L189549) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L189569) |
| `abp.services.app.cRMCampaign.getCRMCampaignForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L189598) |
| `abp.services.app.cRMCampaign.getCRMCampaignLogs` | POST | api/services/app/cRMCampaign/GetCRMCampaignLogs | [المصدر](../../../raw/application.js#L189669) |
| `abp.services.app.cRMCampaign.addProspectToCampaign` | POST | api/services/app/cRMCampaign/AddProspectToCampaign | [المصدر](../../../raw/application.js#L189128) |
| `abp.services.app.person.getPerson` | POST | api/services/app/person/GetPerson | [المصدر](../../../raw/application.js#L189142) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Campaigns`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Campaigns.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Campaigns.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Campaigns.LimitedEdit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Campaigns.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Campaigns.Export`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Inquiry.Stage`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Export`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.code` | text |  |  |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.assignedUser` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
