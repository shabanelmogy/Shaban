# شاشة: Email Templates

المسار في القائمة: Administration ← Email Templates.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.emailTemplates`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0162](../../../readable/routes/R0162--tenant-emailtemplates.js)، والأصل [raw/application.js:2677](../../../raw/application.js#L2677).
- قالب الشاشة: `~/App/tenant/views/common/emailTemplates/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.emailTemplates.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.emailTemplates.index](../../../readable/controllers/C0364--tenant.views.common.emailTemplates.index.js) | 2 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.emailTemplates.index`: `emailTemplateChanged`، `upload`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L94845) |
| `abp.services.app.tenantSettings.getMultipleEmailSendersAdvanceSetting` | POST | api/services/app/tenantSettings/GetMultipleEmailSendersAdvanceSetting | [المصدر](../../../raw/application.js#L94849) |
| `abp.services.app.emailTemplate.uploadEmailTemplate` | POST | api/services/app/emailTemplate/UploadEmailTemplate | [المصدر](../../../raw/application.js#L94882) |
| `abp.services.app.emailTemplate.downloadEmailTemplate` | POST | api/services/app/emailTemplate/DownloadEmailTemplate | [المصدر](../../../raw/application.js#L94892) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.selectedItem` | select |  | ng-options=item as item.name for item in vm.emailTemplates |
| `vm.uploadTemplateInput.subject` | textarea |  |  |
| `vm.uploadTemplateInput.emailCC` | textarea |  |  |
| `vm.uploadTemplateInput.emailBCC` | textarea |  |  |
| `vm.uploadTemplateInput.emailSenderType` | select |  | ng-options=item as item for item in vm.emailSenderCategory |
| `vm.uploadTemplateInput.designationId` | select |  | ng-options=designation.id as designation.name for designation in vm.designations |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
