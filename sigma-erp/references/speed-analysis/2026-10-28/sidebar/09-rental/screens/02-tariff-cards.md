# شاشة: Tariff Cards

المسار في القائمة: Rental ← Tariff Cards.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_tariffCards`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0270](../../../readable/routes/R0270--tenant-crs-tariffcards.js)، والأصل [raw/application.js:3458](../../../raw/application.js#L3458).
- قالب الشاشة: `~/App/tenant/views/crs/tariffCards/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.tariff.tariffCards.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.tariff.tariffCards.index](../../../readable/controllers/C1129--tenant.views.crs.tariff.tariffCards.index.js) | 7 | 2 |
| [tenant.views.crs.tariffCards.createOrEditModal](../../../readable/controllers/C1128--tenant.views.crs.tariffCards.createOrEditModal.js) | 4 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.tariff.tariffCards.index`: `currencyAndRoundingWithThree`، `roundingforView`، `getlocalDateTime`، `getTariffCards`، `createTariffCard`، `editTariffCard`، `deleteTariffCard`.
- وحدة `tenant.views.crs.tariffCards.createOrEditModal`: `applicableForPeriodOnlyChanged`، `paymentDiscountOnDefaultPeriodChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L297692) |
| `abp.services.app.tariffCard.deleteTariffCard` | POST | api/services/app/tariffCard/DeleteTariffCard | [المصدر](../../../raw/application.js#L297730) |
| `abp.services.app.tariffCard.getTariffCard` | POST | api/services/app/tariffCard/GetTariffCard | [المصدر](../../../raw/application.js#L297535) |
| `abp.services.app.tariffCard.createOrUpdateTariffCard` | POST | api/services/app/tariffCard/CreateOrUpdateTariffCard | [المصدر](../../../raw/application.js#L297576) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
