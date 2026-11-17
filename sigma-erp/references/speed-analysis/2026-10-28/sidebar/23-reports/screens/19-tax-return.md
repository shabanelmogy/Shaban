# شاشة: Tax Return

المسار في القائمة: Reports ← Tax Return.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_taxReturnUae`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0413](../../../readable/routes/R0413--tenant-crs-taxreturnuae.js)، والأصل [raw/application.js:4534](../../../raw/application.js#L4534).
- قالب الشاشة: `~/App/tenant/views/crs/reports/taxReturnUae/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.taxReturnUae.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.taxReturnUae.index](../../../readable/controllers/C1076--tenant.views.crs.reports.taxReturnUae.index.js) | 13 | 3 |
| [tenant.views.crs.reports.taxReturnUae.detailLinesModal](../../../readable/controllers/C1075--tenant.views.crs.reports.taxReturnUae.detailLinesModal.js) | 6 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.taxReturnUae.index`: `formatNumber`، `getlocalDate`، `getLocationName`، `CurrencyFormate`، `roundingforView`، `getAgreementLocationName`، `locationPermission`، `getVoucherType`، `getDepositType`، `showDetailLines`، `getTaxReturn`، `exportToExcelDetailed`، `exportToExcel`.
- وحدة `tenant.views.crs.reports.taxReturnUae.detailLinesModal`: `cancel`، `rounding`، `getlocalDateTime`، `CurrencyFormate`، `roundingforView`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L285455) |
| `abp.services.app.taxReturnUae.getTaxReturnViewOne` | POST | api/services/app/taxReturnUae/GetTaxReturnViewOne | [المصدر](../../../raw/application.js#L285505) |
| `abp.services.app.taxReturnUae.exportToExcelDetailedView` | POST | api/services/app/taxReturnUae/ExportToExcelDetailedView | [المصدر](../../../raw/application.js#L285526) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.fromDate` | input |  |  |
| `vm.filters.toDate` | input |  |  |
| `vm.filters.locationId` | select | locationId |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
