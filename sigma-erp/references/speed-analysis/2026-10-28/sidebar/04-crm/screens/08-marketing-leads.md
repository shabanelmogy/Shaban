# شاشة: Leads

المسار في القائمة: CRM ← Marketing ← Leads.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_leads`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0250](../../../readable/routes/R0250--tenant-crs-leads.js)، والأصل [raw/application.js:3301](../../../raw/application.js#L3301).
- قالب الشاشة: `~/App/tenant/views/crs/crm/marketing/leads/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.crm.marketing.leads.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.crm.marketing.leads.index](../../../readable/controllers/C0740--tenant.views.crs.crm.marketing.leads.index.js) | 46 | 10 |
| [tenant.views.crs.crm.marketing.leads.createOrEditModal](../../../readable/controllers/C0739--tenant.views.crs.crm.marketing.leads.createOrEditModal.js) | 19 | 12 |
| [tenant.views.crs.crm.marketing.leads.leadLog](../../../readable/controllers/C0741--tenant.views.crs.crm.marketing.leads.leadLog.js) | 6 | 1 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.crm.marketing.leads.createLeadLogModal](../../../readable/controllers/C0738--tenant.views.crs.crm.marketing.leads.createLeadLogModal.js) | 5 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.crm.marketing.leads.index`: `getStageName`، `getBusinessName`، `getDate`، `getStatuses`، `stageChange`، `focusStage`، `focusDivision`، `searchCountries`، `searchUsers`، `searchCompanies`، `clearCompany`، `clearCountry`، `clearSalesPerson`، `getAgreementTypeName`، `getStatusName`، `totalPerStatusValue`، `getVerifyStatusesName`، `getSubscriptionType`، `getLeads`، `exportToExcel`، `createLead`، `editLead`، `viewLead`، `deleteLead`، `getlocalDate`، `verifyLead`، `leadLog`، `createFarm`، `report`، `getStageNameForGroupBy`، `getLeadForReport`، `inputFocus`، `saveFollowUp`، `rowSaved`، `saveAssigned`، `assignUser`، `focsOut`، `focusStatus`، `totalSetupPerStatusValue`، `totalSubscriptionPerStatusValue`، `totalValueChange`، `calculatedValue`، `totalSetupCharges`، `totalSubscriptionCharges`، `totalValue`، `totalStatusCount`.
- وحدة `tenant.views.crs.crm.marketing.leads.createOrEditModal`: `addRow`، `removeRow`، `searchProducts`، `searchCampaigns`، `onVehicleModelChange`، `onVehicleTypeChange`، `searchModel`، `getTariffGroups`، `onProductChanged`، `onCampaignChanged`، `save`، `cancel`، `clearSalesPersonUser`، `searchCompanies`، `searchContactPerson`، `searchUsers`، `getAgreementTypeName`، `searchTenants`، `getTeriffGroups`.
- وحدة `tenant.views.crs.crm.marketing.leads.leadLog`: `getStageName`، `getStatusName`، `getlocalDate`، `getlocalDate2`، `addLeadLog`، `cancel`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.crm.marketing.leads.createLeadLogModal`: `getStatusName`، `cancel`، `stageChange`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L191789) |
| `abp.services.app.searchUser.searchUsers` | POST | api/services/app/searchUser/SearchUsers | [المصدر](../../../raw/application.js#L191798) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L191480) |
| `abp.services.app.cRMLead.getLeads` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L192058) |
| `abp.services.app.person.exportToExcel` | POST | api/services/app/person/ExportToExcel | [المصدر](../../../raw/application.js#L192087) |
| `abp.services.app.cRMLead.deleteCRMLead` | POST | api/services/app/cRMLead/DeleteCRMLead | [المصدر](../../../raw/application.js#L192157) |
| `abp.services.app.cRMLead.verifyLead` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L192184) |
| `abp.services.app.cRMProduct.getCRMProducts` | POST | api/services/app/cRMProduct/GetCRMProducts | [المصدر](../../../raw/application.js#L191458) |
| `abp.services.app.cRMLead.getLeadsForReport` | POST | api/services/app/cRMLead/GetLeadsForReport | [المصدر](../../../raw/application.js#L192303) |
| `abp.services.app.cRMLead.updateCRMLeadInline` | POST | api/services/app/cRMLead/UpdateCRMLeadInline | [المصدر](../../../raw/application.js#L192344) |
| `abp.services.app.cRMProduct.searchCRMProducts` | POST | api/services/app/cRMProduct/SearchCRMProducts | [المصدر](../../../raw/application.js#L191266) |
| `abp.services.app.cRMCampaign.searchCRMCampaigns` | POST | api/services/app/cRMCampaign/SearchCRMCampaigns | [المصدر](../../../raw/application.js#L191275) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L191305) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L191547) |
| `abp.services.app.cRMLead.createOrUpdateCRMLead` | POST | api/services/app/cRMLead/CreateOrUpdateCRMLead | [المصدر](../../../raw/application.js#L191429) |
| `abp.services.app.user.searchUsers` | POST | api/services/app/user/SearchUsers | [المصدر](../../../raw/application.js#L191488) |
| `abp.services.app.tenant.searchTenants` | POST | api/services/app/tenant/SearchTenants | [المصدر](../../../raw/application.js#L191539) |
| `abp.services.app.cRMLead.getCRMLeadForEdit` | POST | api/services/app/cRMLead/GetCRMLeadForEdit | [المصدر](../../../raw/application.js#L191557) |
| `abp.services.app.cRMLead.getCRMLeadLogs` | POST | api/services/app/cRMLead/GetCRMLeadLogs | [المصدر](../../../raw/application.js#L192510) |
| `abp.services.app.cRMLead.createCRMLeadLog` | POST | api/services/app/cRMLead/CreateCRMLeadLog | [المصدر](../../../raw/application.js#L191189) |

## الصلاحيات والحقول

- صلاحية `Pages.Marketing.Leads.AddNew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Marketing.Leads.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Marketing.Leads.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Marketing.Leads.Verify`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.id` | text | no |  |
| `vm.dateRangeModel` | text |  | ng-disabled=!vm.allowDateRange; min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.allowDateRange` | checkbox | AllowDateRange |  |
| `vm.filters.dealDateFilter` | radio | creationDate | ng-disabled=!vm.allowDateRange |
| `vm.filters.dealDateFilter` | radio | closingDate | ng-disabled=!vm.allowDateRange |
| `vm.filters.productId` | select |  | ng-options=product.id as product.name for product in vm.products |
| `vm.filters.salesPersonUser` | ui-select |  |  |
| `vm.filters.state` | text |  |  |
| `vm.filters.user` | ui-select |  |  |
| `vm.filters.countryObj` | ui-select |  |  |
| `vm.filters.company` | ui-select |  |  |
| `vm.filters.status` | select |  | ng-disabled=vm.statuses==null; ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.title` | text | title |  |
| `vm.filters.unassigned` | checkbox | unassigned |  |
| `vm.filters.todayFollowUps` | checkbox | todayFollowUps |  |
| `row.salesPersonUser` | ui-select |  |  |
| `row.stage` | select |  | ng-if=row.isEnabledStage; ng-options=stage.id as stage.name for stage in vm.stages |
| `row.status` | select |  | ng-if=row.isEnabledStatus; ng-options=status.id as status.name for status in row.statuses |
| `row.nextFollowupDate` | input |  |  |
| `row.notes` | textarea |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
