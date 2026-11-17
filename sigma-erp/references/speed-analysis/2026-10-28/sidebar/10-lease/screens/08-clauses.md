# شاشة: Clauses

المسار في القائمة: Lease ← Clauses.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_clauses`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0379](../../../readable/routes/R0379--tenant-crs-clauses.js)، والأصل [raw/application.js:4267](../../../raw/application.js#L4267).
- قالب الشاشة: `~/App/tenant/views/crs/lease/clauses/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.lease.clauses.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.lease.clauses.index](../../../readable/controllers/C0860--tenant.views.lease.clauses.index.js) | 5 | 2 |
| [tenant.views.lease.clauses.createOrEditClausesTypeModal](../../../readable/controllers/C0859--tenant.views.lease.clauses.createOrEditClausesTypeModal.js) | 2 | 2 |
| [tenant.views.lease.clauses.createOrEditClausesModal](../../../readable/controllers/C0858--tenant.views.lease.clauses.createOrEditClausesModal.js) | 5 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.lease.clauses.index`: `getLeaseClauseTypes`، `createLeaseClauseType`، `editLeaseClauseType`، `addClauses`، `deleteLocation`.
- وحدة `tenant.views.lease.clauses.createOrEditClausesTypeModal`: `save`، `cancel`.
- وحدة `tenant.views.lease.clauses.createOrEditClausesModal`: `addRow`، `removeRow`، `save`، `cancel`، `UpdatePrimary`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.leaseClause.getLeaseClauseTypes` | POST | api/services/app/leaseClause/GetLeaseClauseTypes | [المصدر](../../../raw/application.js#L235973) |
| `abp.services.app.leaseClause.deleteLocation` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L236035) |
| `abp.services.app.leaseClause.createOrUpdateClauseType` | POST | api/services/app/leaseClause/CreateOrUpdateClauseType | [المصدر](../../../raw/application.js#L235895) |
| `abp.services.app.leaseClause.getClauseTypeForEdit` | POST | api/services/app/leaseClause/GetClauseTypeForEdit | [المصدر](../../../raw/application.js#L235908) |
| `abp.services.app.leaseClause.createOrUpdateClauses` | POST | api/services/app/leaseClause/CreateOrUpdateClauses | [المصدر](../../../raw/application.js#L235852) |
| `abp.services.app.leaseClause.getClausesForEdit` | POST | api/services/app/leaseClause/GetClausesForEdit | [المصدر](../../../raw/application.js#L235872) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Locations.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Locations.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Locations.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
