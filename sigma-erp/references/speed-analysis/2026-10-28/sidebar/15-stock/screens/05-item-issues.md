# شاشة: Item Issues

المسار في القائمة: Stock ← Item Issues.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_Issues`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0568](../../../readable/routes/R0568--tenant-crs-issues.js)، والأصل [raw/application.js:5845](../../../raw/application.js#L5845).
- قالب الشاشة: `~/App/tenant/views/stock/itemIssues/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.itemIssues.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.itemIssues.index](../../../readable/controllers/C1679--tenant.views.stock.itemIssues.index.js) | 12 | 4 |
| [tenant.views.stock.itemIssues.createOrEditModal](../../../readable/controllers/C1678--tenant.views.stock.itemIssues.createOrEditModal.js) | 11 | 5 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.itemIssues.index`: `dateRangeModelChanged`، `dateRangeCheck`، `getlocalDateTime`، `getJobType`، `openCreateOrEditModel`، `openViewModal`، `searchJobs`، `clearJob`، `deleteItem`، `getItemIssues`، `report`، `exportToExcel`.
- وحدة `tenant.views.stock.itemIssues.createOrEditModal`: `jobSelected`، `cancel`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L464948) |
| `abp.services.app.itemIssue.deleteItemIssue` | POST | api/services/app/itemIssue/DeleteItemIssue | [المصدر](../../../raw/application.js#L464962) |
| `abp.services.app.itemIssue.getItemIssues` | POST | api/services/app/itemIssue/GetItemIssues | [المصدر](../../../raw/application.js#L464982) |
| `abp.services.app.itemIssue.exportToExcel` | POST | api/services/app/itemIssue/ExportToExcel | [المصدر](../../../raw/application.js#L465016) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L464645) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L464652) |
| `abp.services.app.itemIssue.createOrUpdateItemIssue` | POST | api/services/app/itemIssue/CreateOrUpdateItemIssue | [المصدر](../../../raw/application.js#L464683) |
| `abp.services.app.itemRequisition.getItemRequisitionForEdit` | POST | api/services/app/itemRequisition/GetItemRequisitionForEdit | [المصدر](../../../raw/application.js#L464699) |
| `abp.services.app.itemIssue.getItemIssueForEdit` | POST | api/services/app/itemIssue/GetItemIssueForEdit | [المصدر](../../../raw/application.js#L464729) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.voucherNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.job` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
