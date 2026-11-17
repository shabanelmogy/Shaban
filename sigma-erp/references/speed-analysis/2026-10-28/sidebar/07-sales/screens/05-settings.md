# شاشة: Settings

المسار في القائمة: Sales ← Settings.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_salesSettings`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0370](../../../readable/routes/R0370--tenant-crs-salessettings.js)، والأصل [raw/application.js:4195](../../../raw/application.js#L4195).
- قالب الشاشة: `~/App/tenant/views/crs/equipmentSales/settings/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.equipmentSales.settings.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.equipmentSales.settings.index](../../../readable/controllers/C0817--tenant.views.crs.equipmentSales.settings.index.js) | 14 | 14 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.equipmentSales.settings.index`: `getTenantLinkedCustomer`، `posDefaultCustomerselect`، `getExpenses`، `searchSupplier`، `searchTenantLinkedCustomer`، `selectDefaultDriverForEquipmentAgreement`، `getExpenseType`، `getDefaultDriver`، `getSettings`، `saveEquipmentSettings`، `saveDocumentNosSettings`، `saveAll`، `saveCommonSettings`، `advanceSettingDcoumentsRowChanged`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.getLinkedCustomerInfo` | POST | api/services/app/directory/GetLinkedCustomerInfo | [المصدر](../../../raw/application.js#L219974) |
| `abp.services.app.directory.getContactInfo` | POST | api/services/app/directory/GetContactInfo | [المصدر](../../../raw/application.js#L220055) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L219985) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L219991) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L220040) |
| `abp.services.app.directory.searchLinkedCustomer` | POST | api/services/app/directory/SearchLinkedCustomer | [المصدر](../../../raw/application.js#L220035) |
| `abp.services.app.expenseType.getExpenseTypeForEdit` | POST | api/services/app/expenseType/GetExpenseTypeForEdit | [المصدر](../../../raw/application.js#L220049) |
| `abp.services.app.tenantSettings.getAllSettings` | POST | api/services/app/tenantSettings/GetAllSettings | [المصدر](../../../raw/application.js#L220069) |
| `abp.services.app.tenantSettings.updateEquipmentSettings` | POST | api/services/app/tenantSettings/UpdateEquipmentSettings | [المصدر](../../../raw/application.js#L220217) |
| `abp.services.app.tenantSettings.updateDocumentNosSettings` | POST | api/services/app/tenantSettings/UpdateDocumentNosSettings | [المصدر](../../../raw/application.js#L220233) |
| `abp.services.app.tenantSettings.updateAllSettings` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L220367) |
| `abp.services.app.tenantSettings.updateCommonSettings` | POST | api/services/app/tenantSettings/UpdateCommonSettings | [المصدر](../../../raw/application.js#L220410) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.settings.documentNos.salesAgreementBranchCode` | checkbox | SalesAgreementBranchCode |  |
| `vm.settings.documentNos.salesAgreementBranchCode2` | checkbox | SalesAgreementBranchCode2 |  |
| `vm.settings.documentNos.salesAgreementCodePrefix` | text |  | maxlength=5 |
| `vm.settings.documentNos.salesAgreementYear` | checkbox |  |  |
| `vm.settings.documentNos.salesAgreementMonth` | checkbox |  |  |
| `vm.settings.documentNos.salesAgreementCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.salesQuotationBranchCode` | checkbox | SalesQuotationBranchCode |  |
| `vm.settings.documentNos.salesQuotationBranchCode2` | checkbox | SalesQuotationBranchCode2 |  |
| `vm.settings.documentNos.salesQuotationCodePrefix` | text |  | maxlength=5 |
| `vm.settings.documentNos.salesQuotationYear` | checkbox |  |  |
| `vm.settings.documentNos.salesQuotationMonth` | checkbox |  |  |
| `vm.settings.documentNos.salesQuotationCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.speedCommon.createInvoicePerInstallment` | checkbox | createInvoicePerInstallment |  |
| `vm.settings.speedCommon.allowToEditPaymentMethodInEMIs` | checkbox | allowToEditPaymentMethodInEMIs |  |
| `vm.settings.speedCommon.operationVehicleShowInSalesModule` | checkbox | OperationVehicleShowInSalesModule |  |
| `vm.settings.speedCommon.showSalesVehicleInVouchers` | checkbox | ShowSalesVehicleInVouchers |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
