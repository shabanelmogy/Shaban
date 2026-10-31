# شاشة: Fiscal Years

المسار في القائمة: Accounts ← Fiscal Years.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_fiscalYear`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0498](../../../readable/routes/R0498--tenant-crs-fiscalyear.js)، والأصل [raw/application.js:5229](../../../raw/application.js#L5229).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/fiscalYear/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.fiscalYear.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.fiscalYear.index](../../../readable/controllers/C0485--tenant.views.crs.accounting.fiscalYear.index.js) | 8 | 2 |
| [tenant.views.crs.accounting.fiscalYear.closeFiscalYearModal](../../../readable/controllers/C0483--tenant.views.crs.accounting.fiscalYear.closeFiscalYearModal.js) | 14 | 4 |
| [tenant.views.crs.accounting.fiscalYear.createOrEditModal](../../../readable/controllers/C0484--tenant.views.crs.accounting.fiscalYear.createOrEditModal.js) | 3 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.fiscalYear.index`: `getlocalDate`، `getFiscalYears`، `monthStatus`، `closeFiscalYear`، `viewFiscalYear`، `createFiscalYear`، `editFiscalYear`، `deleteFiscalYear`.
- وحدة `tenant.views.crs.accounting.fiscalYear.closeFiscalYearModal`: `getlocalDateTime`، `allBoxTicked`، `nextValidFiscalYear`، `nextVoucherApprovals`، `previousVoucherApprovals`، `nextDataInconsistency`، `previousDataInconsistency`، `previousCloseFiscalYear`، `finishInvoice`، `cancel`، `verfiyValidFiscalYear`، `verfiyVoucherApprovals`، `verfiyDataInconsistency`، `closeFiscalYear`.
- وحدة `tenant.views.crs.accounting.fiscalYear.createOrEditModal`: `localize`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getFiscalYears` | POST | api/services/app/fiscalYear/GetFiscalYears | [المصدر](../../../raw/application.js#L123180) |
| `abp.services.app.fiscalYear.deleteFiscalYear` | POST | api/services/app/fiscalYear/DeleteFiscalYear | [المصدر](../../../raw/application.js#L123359) |
| `abp.services.app.fiscalYear.verfiyValidFiscalYear` | POST | api/services/app/fiscalYear/VerfiyValidFiscalYear | [المصدر](../../../raw/application.js#L123026) |
| `abp.services.app.fiscalYear.verfiyVoucherApprovals` | POST | api/services/app/fiscalYear/VerfiyVoucherApprovals | [المصدر](../../../raw/application.js#L123037) |
| `abp.services.app.fiscalYear.verfiyDataInconsistency` | POST | api/services/app/fiscalYear/VerfiyDataInconsistency | [المصدر](../../../raw/application.js#L123048) |
| `abp.services.app.fiscalYear.closeFiscalYear` | POST | api/services/app/fiscalYear/CloseFiscalYear | [المصدر](../../../raw/application.js#L123073) |
| `abp.services.app.fiscalYear.createOrUpdateFiscalYear` | POST | api/services/app/fiscalYear/CreateOrUpdateFiscalYear | [المصدر](../../../raw/application.js#L123118) |
| `abp.services.app.fiscalYear.getFiscalYearForEdit` | POST | api/services/app/fiscalYear/GetFiscalYearForEdit | [المصدر](../../../raw/application.js#L123134) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.FiscalYear.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accounts.FiscalYear.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accounts.FiscalYear.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accounts.FiscalYear.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
