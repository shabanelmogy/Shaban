# شاشة: Support

المسار في القائمة: Support.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.support`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0126](../../../readable/routes/R0126--tenant-support.js)، والأصل [raw/application.js:2399](../../../raw/application.js#L2399).
- قالب الشاشة: `~/App/tenant/views/common/supportRequests/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.supportRequests.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.supportRequests.index](../../../readable/controllers/C0436--tenant.views.common.supportRequests.index.js) | 10 | 2 |
| [tenant.views.common.supportRequests.createOrEditModal](../../../readable/controllers/C0434--tenant.views.common.supportRequests.createOrEditModal.js) | 8 | 4 |
| [tenant.views.support.supportRequests.createOrShowRequestLogsModal](../../../readable/controllers/C0435--tenant.views.support.supportRequests.createOrShowRequestLogsModal.js) | 9 | 2 |
| [tenant.views.common.supportRequests.uploadDocumentsModal](../../../readable/controllers/C0438--tenant.views.common.supportRequests.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.common.supportRequests.showLogDocumentsModal](../../../readable/controllers/C0437--tenant.views.common.supportRequests.showLogDocumentsModal.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.supportRequests.index`: `multilineStringToHTMLWordBreak`، `getStatus`، `getPriority`، `getlocalDateTime`، `getlocalDate`، `getSupportRequests`، `exportToExcel`، `openRequestLogModal`، `createSupportRequest`، `editSupportRequest`.
- وحدة `tenant.views.common.supportRequests.createOrEditModal`: `getStatus`، `getlocalDateTime`، `save`، `cancel`، `getOriginalName`، `uploadDocument`، `slaSelected`، `validate`.
- وحدة `tenant.views.support.supportRequests.createOrShowRequestLogsModal`: `multilineStringToHTMLWordBreak`، `getStatus`، `cancel`، `getlocalDateTime`، `uploadDocument`، `openLogDocumentsModal`، `getOriginalName`، `save`، `getRequestLogs`.
- وحدة `tenant.views.common.supportRequests.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.supportRequests.showLogDocumentsModal`: `getOriginalName`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.customerCareTenant.getOpenSupportRequests` | POST | api/services/app/customerCareTenant/GetOpenSupportRequests | [المصدر](../../../raw/application.js#L114428) |
| `abp.services.app.customerCareTenant.getClosedSupportRequests` | POST | api/services/app/customerCareTenant/GetClosedSupportRequests | [المصدر](../../../raw/application.js#L114435) |
| `abp.services.app.customerCareTenant.updateSupportRequest` | POST | api/services/app/customerCareTenant/UpdateSupportRequest | [المصدر](../../../raw/application.js#L114126) |
| `abp.services.app.customerCareTenant.createSupportRequest` | POST | api/services/app/customerCareTenant/CreateSupportRequest | [المصدر](../../../raw/application.js#L114139) |
| `abp.services.app.customerCareTenant.getSLAsByTenantId` | POST | api/services/app/customerCareTenant/GetSLAsByTenantId | [المصدر](../../../raw/application.js#L114173) |
| `abp.services.app.customerCareTenant.getSupportRequestForEdit` | POST | api/services/app/customerCareTenant/GetSupportRequestForEdit | [المصدر](../../../raw/application.js#L114236) |
| `abp.services.app.customerCareTenant.saveRequestLog` | POST | api/services/app/customerCareTenant/SaveRequestLog | [المصدر](../../../raw/application.js#L114328) |
| `abp.services.app.customerCareTenant.getRequestLogs` | POST | api/services/app/customerCareTenant/GetRequestLogs | [المصدر](../../../raw/application.js#L114344) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
