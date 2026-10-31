# شاشة: Data Entry Corrections

المسار في القائمة: Data Entry Corrections.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.dataEntryCorrections`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0127](../../../readable/routes/R0127--tenant-dataentrycorrections.js)، والأصل [raw/application.js:2407](../../../raw/application.js#L2407).
- قالب الشاشة: `~/App/tenant/views/common/dataEntryCorrections/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.dataEntryCorrections.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.dataEntryCorrections.index](../../../readable/controllers/C0338--tenant.views.common.dataEntryCorrections.index.js) | 9 | 2 |
| [tenant.views.common.dataEntryCorrections.createOrEditModal](../../../readable/controllers/C0336--tenant.views.common.dataEntryCorrections.createOrEditModal.js) | 8 | 3 |
| [tenant.views.dataEntryCorrections.createOrShowDataEntryLogsModal](../../../readable/controllers/C0337--tenant.views.dataEntryCorrections.createOrShowDataEntryLogsModal.js) | 7 | 2 |
| [tenant.views.common.supportRequests.uploadDocumentsModal](../../../readable/controllers/C0438--tenant.views.common.supportRequests.uploadDocumentsModal.js) | 3 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.dataEntryCorrections.index`: `getStatus`، `getlocalDate`، `getPriority`، `getlocalDateTime`، `getDataEntryCorrections`، `openDataEntryCorrectionsLogModal`، `exportToExcel`، `createSupportRequest`، `editSupportRequest`.
- وحدة `tenant.views.common.dataEntryCorrections.createOrEditModal`: `getStatus`، `getlocalDateTime`، `save`، `cancel`، `uploadDocument`، `getOriginalName`، `slaSelected`، `validate`.
- وحدة `tenant.views.dataEntryCorrections.createOrShowDataEntryLogsModal`: `getStatus`، `cancel`، `uploadDocument`، `getlocalDateTime`، `save`، `getOriginalName`، `getDataEntryLogs`.
- وحدة `tenant.views.common.supportRequests.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.customerCareTenant.getOpenDataEntryCorrections` | POST | api/services/app/customerCareTenant/GetOpenDataEntryCorrections | [المصدر](../../../raw/application.js#L88639) |
| `abp.services.app.customerCareTenant.getRecentClosedDataEntryCorrections` | POST | api/services/app/customerCareTenant/GetRecentClosedDataEntryCorrections | [المصدر](../../../raw/application.js#L88645) |
| `abp.services.app.customerCareTenant.createOrUpdateDataEntryCorrection` | POST | api/services/app/customerCareTenant/CreateOrUpdateDataEntryCorrection | [المصدر](../../../raw/application.js#L88386) |
| `abp.services.app.customerCareTenant.getSLAsByTenantId` | POST | api/services/app/customerCareTenant/GetSLAsByTenantId | [المصدر](../../../raw/application.js#L88425) |
| `abp.services.app.customerCareTenant.getDataEntryCorrectionForEdit` | POST | api/services/app/customerCareTenant/GetDataEntryCorrectionForEdit | [المصدر](../../../raw/application.js#L88477) |
| `abp.services.app.customerCareTenant.saveDataEntryCorrectionLog` | POST | api/services/app/customerCareTenant/SaveDataEntryCorrectionLog | [المصدر](../../../raw/application.js#L88550) |
| `abp.services.app.customerCareTenant.getDataEntryCorrectionLogs` | POST | api/services/app/customerCareTenant/GetDataEntryCorrectionLogs | [المصدر](../../../raw/application.js#L88570) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
