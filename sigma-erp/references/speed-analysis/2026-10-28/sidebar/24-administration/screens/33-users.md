# شاشة: Users

المسار في القائمة: Administration ← Users.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `users`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0014](../../../readable/routes/R0014--users.js)، والأصل [raw/application.js:1488](../../../raw/application.js#L1488).
- قالب الشاشة: `~/App/common/views/users/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `common.views.users.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [common.views.users.index](../../../readable/controllers/C0035--common.views.users.index.js) | 8 | 4 |
| [common.views.users.permissionsModal](../../../readable/controllers/C0037--common.views.users.permissionsModal.js) | 3 | 3 |
| [common.views.users.createOrEditModal](../../../readable/controllers/C0034--common.views.users.createOrEditModal.js) | 7 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `common.views.users.index`: `getUsers`، `editUser`، `createUser`، `editPermissions`، `impersonate`، `allowReRegisterMFA`، `deleteUser`، `exportToExcel`.
- وحدة `common.views.users.permissionsModal`: `resetPermissions`، `save`، `cancel`.
- وحدة `common.views.users.createOrEditModal`: `save`، `passwordValidation`، `branchAccessChanged`، `searchLocation`، `searchContacts`، `cancel`، `getAssignedRoleCount`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.user.getUsers` | POST | api/services/app/user/GetUsers | [المصدر](../../../raw/application.js#L29133) |
| `abp.services.app.user.reRegisterMFA` | POST | api/services/app/user/ReRegisterMFA | [المصدر](../../../raw/application.js#L29221) |
| `abp.services.app.user.getUsersToExcel` | POST | api/services/app/user/GetUsersToExcel | [المصدر](../../../raw/application.js#L29233) |
| `abp.services.app.user.resetUserSpecificPermissions` | POST | api/services/app/user/ResetUserSpecificPermissions | [المصدر](../../../raw/application.js#L29328) |
| `abp.services.app.user.updateUserPermissions` | POST | api/services/app/user/UpdateUserPermissions | [المصدر](../../../raw/application.js#L29340) |
| `abp.services.app.user.getUserPermissionsForEdit` | POST | api/services/app/user/GetUserPermissionsForEdit | [المصدر](../../../raw/application.js#L29356) |
| `abp.services.app.user.createOrUpdateUser` | POST | api/services/app/user/CreateOrUpdateUser | [المصدر](../../../raw/application.js#L28850) |
| `abp.services.app.commonLookup.getLocationsForSearch` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L28895) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L28902) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L28918) |
| `abp.services.app.user.getUserForEdit` | POST | api/services/app/user/GetUserForEdit | [المصدر](../../../raw/application.js#L28926) |

## الصلاحيات والحقول

- صلاحية `Pages.Administration.Users.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Users.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Users.ChangePermissions`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Users.Impersonation`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Users.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Users.AllowReRegister`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filterText` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
