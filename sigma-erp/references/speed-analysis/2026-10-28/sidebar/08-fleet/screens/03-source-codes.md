# شاشة: Source Codes

المسار في القائمة: Fleet ← Source Codes.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_sourceCodes`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0342](../../../readable/routes/R0342--tenant-crs-sourcecodes.js)، والأصل [raw/application.js:3997](../../../raw/application.js#L3997).
- قالب الشاشة: `~/App/tenant/views/crs/vehicles/sourceCodes/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vehicles.sourceCodes.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vehicles.sourceCodes.index](../../../readable/controllers/C1214--tenant.views.crs.vehicles.sourceCodes.index.js) | 5 | 2 |
| [tenant.views.crs.vehicles.sourceCodes.createOrEditModal](../../../readable/controllers/C1213--tenant.views.crs.vehicles.sourceCodes.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vehicles.sourceCodes.index`: `viewSourceCode`، `getSourceCode`، `createSourceCode`، `editSourceCode`، `deleteSourceCode`.
- وحدة `tenant.views.crs.vehicles.sourceCodes.createOrEditModal`: `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.sourceCode.getSourceCode` | POST | api/services/app/sourceCode/GetSourceCode | [المصدر](../../../raw/application.js#L318082) |
| `abp.services.app.sourceCode.deleteSourceCode` | POST | api/services/app/sourceCode/DeleteSourceCode | [المصدر](../../../raw/application.js#L318125) |
| `abp.services.app.sourceCode.createOrUpdateSourceCode` | POST | api/services/app/sourceCode/CreateOrUpdateSourceCode | [المصدر](../../../raw/application.js#L317938) |
| `abp.services.app.sourceCode.getSourceCodeForEdit` | POST | api/services/app/sourceCode/GetSourceCodeForEdit | [المصدر](../../../raw/application.js#L317951) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.SourceCodes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SourceCodes.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SourceCodes.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SourceCodes.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.filter` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
