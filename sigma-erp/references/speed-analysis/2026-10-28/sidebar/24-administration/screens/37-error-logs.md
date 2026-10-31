# شاشة: Error logs

المسار في القائمة: Administration ← Error logs.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_auditLogs`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0020](../../../readable/routes/R0020--tenant-crs-auditlogs.js)، والأصل [raw/application.js:1537](../../../raw/application.js#L1537).
- قالب الشاشة: `~/App/common/views/auditLogs/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `common.views.auditLogs.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [common.views.auditLogs.index](../../../readable/controllers/C0003--common.views.auditLogs.index.js) | 3 | 2 |
| [common.views.auditLogs.detailModal](../../../readable/controllers/C0002--common.views.auditLogs.detailModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `common.views.auditLogs.index`: `getAuditLogs`، `exportToExcel`، `showDetails`.
- وحدة `common.views.auditLogs.detailModal`: `getExecutionTime`، `getDurationAsMs`، `getFormattedParameters`، `close`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.auditLog.getAuditLogs` | POST | api/services/app/auditLog/GetAuditLogs | [المصدر](../../../raw/application.js#L24786) |
| `abp.services.app.auditLog.getAuditLogsToExcel` | POST | api/services/app/auditLog/GetAuditLogsToExcel | [المصدر](../../../raw/application.js#L24796) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.requestParams.userName` | text |  |  |
| `vm.requestParams.serviceName` | text |  |  |
| `vm.requestParams.minExecutionDuration` | number |  | min=0; max=86400000 |
| `vm.requestParams.maxExecutionDuration` | number |  | min=0; max=86400000 |
| `vm.requestParams.methodName` | text |  |  |
| `vm.requestParams.hasException` | select |  |  |
| `vm.requestParams.browserInfo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
