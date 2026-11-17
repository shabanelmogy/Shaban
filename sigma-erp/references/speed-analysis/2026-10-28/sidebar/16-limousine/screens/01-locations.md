# شاشة: Locations

المسار في القائمة: Limousine ← Locations.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_tripLocations`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0218](../../../readable/routes/R0218--tenant-crs-triplocations.js)، والأصل [raw/application.js:3062](../../../raw/application.js#L3062).
- قالب الشاشة: `~/App/tenant/views/crs/limousine/tripLocations/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.limousine.tripLocations.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.limousine.tripLocations.index](../../../readable/controllers/C0915--tenant.views.crs.limousine.tripLocations.index.js) | 5 | 2 |
| [tenant.views.crs.limousine.tripLocations.createOrEditModal](../../../readable/controllers/C0914--tenant.views.crs.limousine.tripLocations.createOrEditModal.js) | 5 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.limousine.tripLocations.index`: `addNewTripLocation`، `viewTripLocation`، `editTripLocation`، `deleteTripLocation`، `getTripLocations`.
- وحدة `tenant.views.crs.limousine.tripLocations.createOrEditModal`: `cancel`، `searchLocations`، `locationSelected`، `trustSrc`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.tripLocation.deleteTripLocation` | POST | api/services/app/tripLocation/DeleteTripLocation | [المصدر](../../../raw/application.js#L247811) |
| `abp.services.app.tripLocation.getTripLocations` | POST | api/services/app/tripLocation/GetTripLocations | [المصدر](../../../raw/application.js#L247823) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L247629) |
| `abp.services.app.googleMapAPI.getMap` | POST | api/services/app/googleMapAPI/GetMap | [المصدر](../../../raw/application.js#L247645) |
| `abp.services.app.tripLocation.createOrUpdateTrip` | POST | api/services/app/tripLocation/CreateOrUpdateTrip | [المصدر](../../../raw/application.js#L247656) |
| `abp.services.app.tripLocation.getTripLocationForEdit` | POST | api/services/app/tripLocation/GetTripLocationForEdit | [المصدر](../../../raw/application.js#L247668) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Limousine.TripLocations.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.TripLocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.TripLocations.Edit`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.keyword` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
