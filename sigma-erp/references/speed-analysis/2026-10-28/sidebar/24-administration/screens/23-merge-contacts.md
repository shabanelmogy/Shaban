# شاشة: Merge Contacts

المسار في القائمة: Administration ← Merge Contacts.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.mergeContacts`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0178](../../../readable/routes/R0178--tenant-mergecontacts.js)، والأصل [raw/application.js:2802](../../../raw/application.js#L2802).
- قالب الشاشة: `~/App/tenant/views/common/mergeContacts/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.mergeContacts.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.mergeContacts.index](../../../readable/controllers/C0404--tenant.views.mergeContacts.index.js) | 5 | 1 |
| [tenant.views.mergeContacts.searchAddContacts](../../../readable/controllers/C0405--tenant.views.mergeContacts.searchAddContacts.js) | 4 | 1 |
| [tenant.views.mergeContacts.importMergeContactsModal](../../../readable/controllers/C0403--tenant.views.mergeContacts.importMergeContactsModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.mergeContacts.index`: `removeRow`، `searchAddContacts`، `mergeContacts`، `uploader.onSuccessItem`، `uploader.onErrorItem`.
- وحدة `tenant.views.mergeContacts.searchAddContacts`: `searchContacts`، `cancel`، `changeContactCategory`، `save`.
- وحدة `tenant.views.mergeContacts.importMergeContactsModal`: `cancel`، `mergeImportedContacts`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.mergeContact.mergeContacts` | POST | api/services/app/mergeContact/MergeContacts | [المصدر](../../../raw/application.js#L101896) |
| `abp.services.app.directory.searchContactsForMerging` | POST | api/services/app/directory/SearchContactsForMerging | [المصدر](../../../raw/application.js#L102009) |
| `abp.services.app.mergeContact.mergeContactsByName` | POST | api/services/app/mergeContact/MergeContactsByName | [المصدر](../../../raw/application.js#L101785) |
| `abp.services.app.mergeContact.importContactsFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L101807) |

## الصلاحيات والحقول

- صلاحية `Pages.Administration.MergeContacts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
