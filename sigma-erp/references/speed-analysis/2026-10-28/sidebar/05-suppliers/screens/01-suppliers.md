# شاشة: Suppliers

المسار في القائمة: Suppliers ← Suppliers.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_suppliers`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0259](../../../readable/routes/R0259--tenant-crs-suppliers.js)، والأصل [raw/application.js:3367](../../../raw/application.js#L3367).
- قالب الشاشة: `~/App/tenant/views/crs/suppliers/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.suppliers.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.suppliers.index](../../../readable/controllers/C1127--tenant.views.crs.suppliers.index.js) | 6 | 3 |
| [tenant.views.crs.suppliers.createOrEditModal](../../../readable/controllers/C1126--tenant.views.crs.suppliers.createOrEditModal.js) | 10 | 8 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.suppliers.index`: `getSuppliers`، `exportToExcel`، `createSupplier`، `editSupplier`، `viewSupplier`، `deleteSupplier`.
- وحدة `tenant.views.crs.suppliers.createOrEditModal`: `save`، `cancel`، `searchCountries`، `addMandatoryDesignations`، `doesIdentityDoucmentExist`، `openUploadDocument`، `removeIndentityDocument`، `getIdentificationDocumentType`، `addIndentityDocument`، `getAdvanceSettings`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.supplier.getSuppliers` | POST | api/services/app/supplier/GetSuppliers | [المصدر](../../../raw/application.js#L297441) |
| `abp.services.app.supplier.exportToExcel` | POST | api/services/app/supplier/ExportToExcel | [المصدر](../../../raw/application.js#L297451) |
| `abp.services.app.supplier.deleteSupplier` | POST | api/services/app/supplier/DeleteSupplier | [المصدر](../../../raw/application.js#L297508) |
| `abp.services.app.supplier.createOrUpdateSupplier` | POST | api/services/app/supplier/CreateOrUpdateSupplier | [المصدر](../../../raw/application.js#L297070) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L297089) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L297094) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L297116) |
| `abp.services.app.supplier.getSupplierForEdit` | POST | api/services/app/supplier/GetSupplierForEdit | [المصدر](../../../raw/application.js#L297125) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L297155) |
| `abp.services.app.supplier.getAdvanceSettings` | POST | api/services/app/supplier/GetAdvanceSettings | [المصدر](../../../raw/application.js#L297317) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Suppliers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Suppliers.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Suppliers.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Suppliers.Export`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Suppliers.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Suppliers.Documents`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.filter` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
