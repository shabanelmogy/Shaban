# شاشة: Item Returns

المسار في القائمة: Stock ← Item Returns.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_Returns`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0569](../../../readable/routes/R0569--tenant-crs-returns.js)، والأصل [raw/application.js:5851](../../../raw/application.js#L5851).
- قالب الشاشة: `~/App/tenant/views/stock/itemReturns/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.itemReturns.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.itemReturns.index](../../../readable/controllers/C1682--tenant.views.stock.itemReturns.index.js) | 12 | 4 |
| [tenant.views.stock.itemReturns.createOrEditModal](../../../readable/controllers/C1681--tenant.views.stock.itemReturns.createOrEditModal.js) | 11 | 5 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.itemReturns.index`: `dateRangeModelChanged`، `dateRangeCheck`، `getlocalDateTime`، `getJobType`، `openCreateOrEditModel`، `openViewModal`، `searchJobs`، `clearJob`، `deleteItem`، `getItemReturns`، `exportToExcel`، `report`.
- وحدة `tenant.views.stock.itemReturns.createOrEditModal`: `cancel`، `jobSelected`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L465470) |
| `abp.services.app.itemReturn.deleteItemReturn` | POST | api/services/app/itemReturn/DeleteItemReturn | [المصدر](../../../raw/application.js#L465484) |
| `abp.services.app.itemReturn.getItemReturns` | POST | api/services/app/itemReturn/GetItemReturns | [المصدر](../../../raw/application.js#L465504) |
| `abp.services.app.itemReturn.exportToExcel` | POST | api/services/app/itemReturn/ExportToExcel | [المصدر](../../../raw/application.js#L465522) |
| `abp.services.app.job.getItemReturnRows` | POST | api/services/app/job/GetItemReturnRows | [المصدر](../../../raw/application.js#L465122) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L465189) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L465196) |
| `abp.services.app.itemReturn.createOrUpdateItemReturn` | POST | api/services/app/itemReturn/CreateOrUpdateItemReturn | [المصدر](../../../raw/application.js#L465227) |
| `abp.services.app.itemReturn.getItemReturnForEdit` | POST | api/services/app/itemReturn/GetItemReturnForEdit | [المصدر](../../../raw/application.js#L465243) |

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
