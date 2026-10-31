# شاشة: Rental Agreements

المسار في القائمة: Administration ← Data Import ← Rental Agreements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.importRentalAgreementsData`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0121](../../../readable/routes/R0121--tenant-importrentalagreementsdata.js)، والأصل [raw/application.js:2348](../../../raw/application.js#L2348).
- قالب الشاشة: `~/App/tenant/views/common/dataImport/agreement/rental/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.importData.agreement.rental.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.importData.agreement.rental.index](../../../readable/controllers/C0342--tenant.views.common.importData.agreement.rental.index.js) | 5 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.importData.agreement.rental.index`: `refresh`، `getlocalDate`، `importFromExcelSample`، `importData`، `resolveBoolValue`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.agreement.getChargesSettings` | POST | api/services/app/agreement/GetChargesSettings | [المصدر](../../../raw/application.js#L89855) |
| `abp.services.app.agreement.openAgreementSampleFile` | POST | api/services/app/agreement/OpenAgreementSampleFile | [المصدر](../../../raw/application.js#L89868) |
| `abp.services.app.agreement.importAgreementsData` | POST | api/services/app/agreement/ImportAgreementsData | [المصدر](../../../raw/application.js#L90085) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
