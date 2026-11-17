# شاشة: Payment Methods

المسار في القائمة: Administration ← Payment Methods.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.billingMethods`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0161](../../../readable/routes/R0161--tenant-billingmethods.js)، والأصل [raw/application.js:2669](../../../raw/application.js#L2669).
- قالب الشاشة: `~/App/tenant/views/common/billingMethods/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.billingMethods.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.billingMethods.index](../../../readable/controllers/C0311--tenant.views.billingMethods.index.js) | 9 | 2 |
| [tenant.views.billingMethods.createOrEditModal](../../../readable/controllers/C0310--tenant.views.billingMethods.createOrEditModal.js) | 5 | 6 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.billingMethods.index`: `paymentMethodChanged`، `sortColumn`، `sortClass`، `getBillingMethodCategory`، `getBillingMethodCategoryForFilter`، `getBillingMethodsWithCategory`، `createBillingMethod`، `editBillingMethod`، `deleteBillingMethod`.
- وحدة `tenant.views.billingMethods.createOrEditModal`: `save`، `cancel`، `searchUsers`، `applyCommissionPercentage`، `getUserName`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.billingMethod.getAllTypeBillingMethods` | POST | api/services/app/billingMethod/GetAllTypeBillingMethods | [المصدر](../../../raw/application.js#L85890) |
| `abp.services.app.billingMethod.deleteBillingMethod` | POST | api/services/app/billingMethod/DeleteBillingMethod | [المصدر](../../../raw/application.js#L85941) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L85645) |
| `abp.services.app.billingMethod.createOrUpdateBillingMethod` | POST | api/services/app/billingMethod/CreateOrUpdateBillingMethod | [المصدر](../../../raw/application.js#L85680) |
| `abp.services.app.commonLookup.searchUsers` | POST | api/services/app/commonLookup/SearchUsers | [المصدر](../../../raw/application.js#L85699) |
| `abp.services.app.commonLookup.getUser` | POST | api/services/app/commonLookup/GetUser | [المصدر](../../../raw/application.js#L85713) |
| `abp.services.app.billingMethod.getBillingMethodForEdit` | POST | api/services/app/billingMethod/GetBillingMethodForEdit | [المصدر](../../../raw/application.js#L85722) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L85753) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.BillingMethods.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.BillingMethods.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.BillingMethods.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
