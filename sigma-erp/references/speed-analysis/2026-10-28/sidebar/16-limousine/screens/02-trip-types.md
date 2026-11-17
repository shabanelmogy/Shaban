# شاشة: Trip Types

المسار في القائمة: Limousine ← Trip Types.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_limoTripTypes`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0231](../../../readable/routes/R0231--tenant-crs-limotriptypes.js)، والأصل [raw/application.js:3157](../../../raw/application.js#L3157).
- قالب الشاشة: `~/App/tenant/views/crs/limousine/tripTypes/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.limousine.tripTypes.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.limousine.tripTypes.index](../../../readable/controllers/C0941--tenant.views.crs.limousine.tripTypes.index.js) | 5 | 2 |
| [tenant.views.crs.limousine.tripTypes.createOrEditModal](../../../readable/controllers/C0940--tenant.views.crs.limousine.tripTypes.createOrEditModal.js) | 2 | 2 |
| [tenant.views.crs.limousine.tripTypes.settingsModal](../../../readable/controllers/C0942--tenant.views.crs.limousine.tripTypes.settingsModal.js) | 4 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.limousine.tripTypes.index`: `getTripTypes`، `createTripType`، `openSettings`، `editTripType`، `deleteTripType`.
- وحدة `tenant.views.crs.limousine.tripTypes.createOrEditModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.limousine.tripTypes.settingsModal`: `baseRateTypeSelected`، `corporateRateTypeSelected`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.tripType.getTripTypes` | POST | api/services/app/tripType/GetTripTypes | [المصدر](../../../raw/application.js#L255211) |
| `abp.services.app.tripType.deleteTripType` | POST | api/services/app/tripType/DeleteTripType | [المصدر](../../../raw/application.js#L255265) |
| `abp.services.app.tripType.createOrUpdateTripType` | POST | api/services/app/tripType/CreateOrUpdateTripType | [المصدر](../../../raw/application.js#L255137) |
| `abp.services.app.tripType.getTripTypeForEdit` | POST | api/services/app/tripType/GetTripTypeForEdit | [المصدر](../../../raw/application.js#L255145) |
| `abp.services.app.tripType.updateTripTypeSetting` | POST | api/services/app/tripType/UpdateTripTypeSetting | [المصدر](../../../raw/application.js#L255322) |
| `abp.services.app.chargesSetting.getRateTypes` | POST | api/services/app/chargesSetting/GetRateTypes | [المصدر](../../../raw/application.js#L255338) |
| `abp.services.app.tripType.getTripTypeSettingForEdit` | POST | api/services/app/tripType/GetTripTypeSettingForEdit | [المصدر](../../../raw/application.js#L255348) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Limousine.TripTypes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.TripTypes.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.TripTypes.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.TripTypes.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.TripTypes.TariffSettings`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
