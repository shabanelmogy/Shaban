# شاشة: Download/Process Fines

المسار في القائمة: Fleet ← Download/Process Fines.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_downloadAndProcessFines`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0029](../../../readable/routes/R0029--tenant-crs-downloadandprocessfines.js)، والأصل [raw/application.js:1597](../../../raw/application.js#L1597).
- قالب الشاشة: `~/App/tenant/views/common/fines/downloadAndProcessFines.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.tfms.downloadAndProcessFines as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.tfms.downloadAndProcessFines](../../../readable/controllers/C0367--tenant.views.tfms.downloadAndProcessFines.js) | 14 | 6 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.tfms.downloadAndProcessFines`: `getlocalDateTime`، `selectFilesOnly`، `downloadFines`، `downloadFinesV3`، `callbackOnComplete`، `focusWindow`، `showError`، `sendCaptcha`، `cancelAll`، `downloadConfiscationCharges`، `refreshProcessing`، `whatsAppSMSManual`، `emailManual`، `processFines`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.trafficFile.getTrafficFiles` | POST | api/services/app/trafficFile/GetTrafficFiles | [المصدر](../../../raw/application.js#L95119) |
| `abp.services.app.uaeFine.getFinesForConfiscationDownloading` | POST | api/services/app/uaeFine/GetFinesForConfiscationDownloading | [المصدر](../../../raw/application.js#L95317) |
| `abp.services.app.uaeFine.downloadConfiscationCharges` | POST | api/services/app/uaeFine/DownloadConfiscationCharges | [المصدر](../../../raw/application.js#L95335) |
| `abp.services.app.uaeFine.whatsAppProcessFines` | POST | api/services/app/uaeFine/WhatsAppProcessFines | [المصدر](../../../raw/application.js#L95430) |
| `abp.services.app.uaeFine.emailFines` | POST | api/services/app/uaeFine/EmailFines | [المصدر](../../../raw/application.js#L95445) |
| `abp.services.app.uaeFine.processFinesInBulk` | POST | api/services/app/uaeFine/ProcessFinesInBulk | [المصدر](../../../raw/application.js#L95457) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.selected` | radio | radio1 |  |
| `vm.selected` | radio | radio1 |  |
| `vm.selected` | radio | radio3 |  |
| `vm.selected` | radio | radio4 |  |
| `vm.selectedTrafficFiles` | ui-select |  |  |
| `row.captchaTxt` | input |  |  |
| `vm.filters.fromDate` | input | date |  |
| `vm.filters.toDate` | input | date |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
