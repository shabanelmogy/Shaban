# شاشة: Campaign Dashboard

المسار في القائمة: CRM ← Marketing ← Campaign Dashboard.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_campaignDashboard`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0248](../../../readable/routes/R0248--tenant-crs-campaigndashboard.js)، والأصل [raw/application.js:3286](../../../raw/application.js#L3286).
- قالب الشاشة: `~/App/tenant/views/crs/crm/marketing/campaignDashboard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.crm.marketing.campaignDashboard.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.crm.marketing.campaignDashboard.index](../../../readable/controllers/C0735--tenant.views.crs.crm.marketing.campaignDashboard.index.js) | 8 | 6 |
| [tenant.views.crs.crm.marketing.campaign.createOrEditModal](../../../readable/controllers/C0731--tenant.views.crs.crm.marketing.campaign.createOrEditModal.js) | 16 | 14 |
| [tenant.views.crs.crm.marketing.campaign.addProspectsModal](../../../readable/controllers/C0730--tenant.views.crs.crm.marketing.campaign.addProspectsModal.js) | 3 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.crm.marketing.campaignDashboard.index`: `searchProjects`، `getCitiesType`، `onProjectSelect`، `editProject`، `getlocalDateTime`، `formatDate`، `getStatusDisplay`، `getStatusClass`.
- وحدة `tenant.views.crs.crm.marketing.campaign.createOrEditModal`: `getlocalizedString`، `searchProperties`، `cancel`، `save`، `getEnums`، `searchUsers`، `clearSalesPersonUser`، `openAddProspectsModal`، `getProspects`، `removeProspect`، `onAudienceTabSelect`، `exportToExcel`، `downloadProspectExcel`، `searchModel`، `getTeriffGroups`، `searchCountries`.
- وحدة `tenant.views.crs.crm.marketing.campaign.addProspectsModal`: `addSelectedProspects`، `cancel`، `getProspects`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.cRMCampaign.searchCRMCampaigns` | POST | api/services/app/cRMCampaign/SearchCRMCampaigns | [المصدر](../../../raw/application.js#L190435) |
| `abp.services.app.cRMCampaign.getCampaignDashboardStatistics` | POST | api/services/app/cRMCampaign/GetCampaignDashboardStatistics | [المصدر](../../../raw/application.js#L190493) |
| `abp.services.app.cRMCampaign.getCampaignPerformance` | POST | api/services/app/cRMCampaign/GetCampaignPerformance | [المصدر](../../../raw/application.js#L190501) |
| `abp.services.app.cRMCampaign.getRecentLeadsFromCampaign` | POST | api/services/app/cRMCampaign/GetRecentLeadsFromCampaign | [المصدر](../../../raw/application.js#L190509) |
| `abp.services.app.cRMCampaign.getDailyLeadGeneration` | POST | api/services/app/cRMCampaign/GetDailyLeadGeneration | [المصدر](../../../raw/application.js#L190516) |
| `abp.services.app.cRMCampaign.getDailyConversions` | POST | api/services/app/cRMCampaign/GetDailyConversions | [المصدر](../../../raw/application.js#L190524) |
| `abp.services.app.cRMCampaign.editCRMCampaign` | POST | api/services/app/cRMCampaign/EditCRMCampaign | [المصدر](../../../raw/application.js#L189288) |
| `abp.services.app.cRMCampaign.addCRMCampaign` | POST | api/services/app/cRMCampaign/AddCRMCampaign | [المصدر](../../../raw/application.js#L189298) |
| `abp.services.app.cRMCampaign.getProducts` | POST | api/services/app/cRMCampaign/GetProducts | [المصدر](../../../raw/application.js#L189324) |
| `abp.services.app.cRMCampaign.getCRMCampaignTypes` | POST | api/services/app/cRMCampaign/GetCRMCampaignTypes | [المصدر](../../../raw/application.js#L189332) |
| `abp.services.app.user.searchUsers` | POST | api/services/app/user/SearchUsers | [المصدر](../../../raw/application.js#L189341) |
| `abp.services.app.cRMCampaign.getCampaignProspects` | POST | api/services/app/cRMCampaign/GetCampaignProspects | [المصدر](../../../raw/application.js#L189465) |
| `abp.services.app.cRMCampaign.removeProspectFromCampaign` | POST | api/services/app/cRMCampaign/RemoveProspectFromCampaign | [المصدر](../../../raw/application.js#L189487) |
| `abp.services.app.cRMCampaign.exportToExcelProspects` | POST | [object Object] | [المصدر](../../../raw/application.js#L189512) |
| `abp.services.app.person.exportProspectsByCampaignId` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L189527) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L189540) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L189549) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L189569) |
| `abp.services.app.cRMCampaign.getCRMCampaignForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L189598) |
| `abp.services.app.cRMCampaign.addProspectToCampaign` | POST | api/services/app/cRMCampaign/AddProspectToCampaign | [المصدر](../../../raw/application.js#L189128) |
| `abp.services.app.person.getPerson` | POST | api/services/app/person/GetPerson | [المصدر](../../../raw/application.js#L189142) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Lease.Inquiry.Stage`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.campaign` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
