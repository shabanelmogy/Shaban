# شاشة: Amortization

المسار في القائمة: Vouchers ← Amortization.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_amortization`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0479](../../../readable/routes/R0479--tenant-crs-amortization.js)، والأصل [raw/application.js:5071](../../../raw/application.js#L5071).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/amortization/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.amortization.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.amortization.index](../../../readable/controllers/C0473--tenant.views.crs.accounting.amortization.index.js) | 7 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.amortization.index`: `calculationDetail`، `roundingforView`، `saveCustom`، `save`، `getAmmortizationCustom`، `getAmmortization`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.loanAmortization.createAmortizationNew` | POST | api/services/app/loanAmortization/CreateAmortizationNew | [المصدر](../../../raw/application.js#L121233) |
| `abp.services.app.amortization.createAmortization` | POST | api/services/app/amortization/CreateAmortization | [المصدر](../../../raw/application.js#L121251) |
| `abp.services.app.loanAmortization.getAmortizationBatchWise` | POST | api/services/app/loanAmortization/GetAmortizationBatchWise | [المصدر](../../../raw/application.js#L121297) |
| `abp.services.app.amortization.getAmortizationBatchWise` | POST | api/services/app/amortization/GetAmortizationBatchWise | [المصدر](../../../raw/application.js#L121347) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.monthYear` | input | date |  |
| `vm.filters.monthYearForCustom` | input | date |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
