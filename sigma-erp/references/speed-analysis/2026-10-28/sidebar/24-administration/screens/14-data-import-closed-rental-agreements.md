# شاشة: Closed Rental Agreements

المسار في القائمة: Administration ← Data Import ← Closed Rental Agreements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.importRentalClosedAgreementsData`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0122](../../../readable/routes/R0122--tenant-importrentalclosedagreementsdata.js)، والأصل [raw/application.js:2357](../../../raw/application.js#L2357).
- قالب الشاشة: `~/App/tenant/views/common/dataImport/agreement/rental/closedAgreements.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.importData.agreement.rental.closedAgreements as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.importData.agreement.rental.closedAgreements](../../../readable/controllers/C0341--tenant.views.common.importData.agreement.rental.closedAgreements.js) | 6 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.importData.agreement.rental.closedAgreements`: `refresh`، `getlocalDate`، `exportToExcelSample`، `localize`، `importData`، `resolveBoolValue`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.agreement.getChargesSettings` | POST | api/services/app/agreement/GetChargesSettings | [المصدر](../../../raw/application.js#L89463) |
| `abp.services.app.agreement.agreementClosedSampleFile` | POST | api/services/app/agreement/AgreementClosedSampleFile | [المصدر](../../../raw/application.js#L89493) |
| `abp.services.app.agreement.importClosedAgreementsData` | POST | api/services/app/agreement/ImportClosedAgreementsData | [المصدر](../../../raw/application.js#L89756) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
