# شاشة: Audit Trail

المسار في القائمة: Administration ← Audit Trail.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_auditTrail`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0023](../../../readable/routes/R0023--tenant-crs-audittrail.js)، والأصل [raw/application.js:1556](../../../raw/application.js#L1556).
- قالب الشاشة: `~/App/common/views/auditTrail/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `common.views.auditTrail.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [common.views.auditTrail.index](../../../readable/controllers/C0004--common.views.auditTrail.index.js) | 6 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `common.views.auditTrail.index`: `getlocalDateTime`، `getlocalDate`، `searchUsers`، `clearUser`، `getAuditTrail`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.auditTrail.searchUsers` | POST | api/services/app/auditTrail/SearchUsers | [المصدر](../../../raw/application.js#L24864) |
| `abp.services.app.auditTrail.getAuditTrailRecords` | POST | api/services/app/auditTrail/GetAuditTrailRecords | [المصدر](../../../raw/application.js#L24893) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.fromDate` | input | fromDate |  |
| `vm.filters.toDate` | input | toDate |  |
| `vm.filters.recordNo` | input |  |  |
| `vm.filters.recordType` | input |  |  |
| `vm.filters.user` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
