# شاشة: SMS to Lease Customer

المسار في القائمة: Lease ← SMS to Lease Customer.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_smsToLeaseCustomer`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0380](../../../readable/routes/R0380--tenant-crs-smstoleasecustomer.js)، والأصل [raw/application.js:4272](../../../raw/application.js#L4272).
- قالب الشاشة: `~/App/tenant/views/crs/lease/smsToLeaseCustomer/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.lease.smsToLeaseCustomer.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.lease.smsToLeaseCustomer.index](../../../readable/controllers/C0893--tenant.views.crs.lease.smsToLeaseCustomer.index.js) | 8 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.lease.smsToLeaseCustomer.index`: `getlocalDateTime`، `allBoxTicked`، `checkCheckeditems`، `getAllPersons`، `getSmsBalance`، `SelectedPeopleCount`، `loadTemplate`، `sendPromotions`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.sMSToLeaseCustomer.getAllPersons` | POST | api/services/app/sMSToLeaseCustomer/GetAllPersons | [المصدر](../../../raw/application.js#L243060) |
| `abp.services.app.sMSToLeaseCustomer.getSmsBalance` | POST | api/services/app/sMSToLeaseCustomer/GetSmsBalance | [المصدر](../../../raw/application.js#L243068) |
| `abp.services.app.sMSToLeaseCustomer.getSmsTemplate` | POST | api/services/app/sMSToLeaseCustomer/GetSmsTemplate | [المصدر](../../../raw/application.js#L243090) |
| `abp.services.app.sMSToLeaseCustomer.sendPromotions` | POST | api/services/app/sMSToLeaseCustomer/SendPromotions | [المصدر](../../../raw/application.js#L243141) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.messageBody` | textarea |  |  |
| `vm.filters.filter` | text |  |  |
| `vm.filters.customersHavingOpenAgreement` | checkbox | customersHavingOpenAgreement |  |
| `vm.tickAllBox` | checkbox | Persons |  |
| `row.generate` | checkbox | generate | ng-disabled=!row.mobileNo \|\| row.smsStatus |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
