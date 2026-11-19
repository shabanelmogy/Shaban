# مطابقة صلاحيات الأصناف — البند ١٥٨ (`/Item`)

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-13 |
| العقد | [العقد المجمد](ITEM_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [تتبع المصدر والشكل](ITEM_ACCESS_DISCOVERY.md) |
| النطاق | البند ١٥٨ — الأصناف `Item` (`/Item` و`/Item/create` و`/Item/details/:id`)، المحرر والتقرير والتصدير وواجهات الخادم |
| الحالة الحالية | عولجت [ملاحظات المراجعة](AUTHORIZATION_158_SOURCE_REVIEW_20261113.md) في المصدر. الجرد `158/263`. لا هجرة مطلوبة. تشغيل الاختبارات وتجربة الشاشة معلّقان |

## ١. المرجع الوظيفي والشكل والأعمدة

- **مصادر المرجع المقروءة**: وفق `Master 1/2/4/7` وتوثيق الاكتشاف [ITEM_ACCESS_DISCOVERY.md](ITEM_ACCESS_DISCOVERY.md)، رُوجِع كتالوج Speed المحلي بتاريخ `2026-10-27` (`references/speed-analysis/2026-10-27/library/catalog.csv:178` — البند `S179` لـ Service Items دون صفحة دليل مستقلة لأصناف المخزون العامة) ثم حزمة القائمة والكود بتاريخ `2026-10-28` (`references/speed-analysis/2026-10-28/data/sidebar-screen-map.csv:109`، `sidebar/15-stock/screens/03-items.md`، والمحركان `C1685` و`C1684`). تبيّن تطابق أفعال العرض والإنشاء والتعديل والحذف ومرشحات الرقم والاسم والتصنيف وكود المورد والباركود ومحرر الوحدة والفرع والتقرير والتصدير، مع استبعاد `Edit.EditPrice` و`VehicleMake/Model` غير الموجودَين في نموذج `Item` الحالي بـ Sigma. مرجع Odoo المكمل (`references/odoo-rental/README.md`) خاص بالتأجير والأسطول ولا يضيف قاعدة مختلفة لدليل أصناف المخزون. يظل هذا الإثبات مصدرّيًا دون تشغيل حي.
- **الشكل والمالكون (`UI Type 01` + `Backend Pattern 1`)**: قائمة مع حوار تحرير وتقرير مستقل، تستهلك المكونات المشتركة `app-feature-title` و`appFilterPanel` و`app-data-table` و`app-editor-dialog` و`app-state-message` و`app-field-error` و`app-reference-lookup-status` و`ConfirmationDialogService` دون أوراق أنماط أو أغلفة محلية.
- **أعمدة الجدول مقابل `ItemListVM`**:
  - أعمدة الواجهة ([list.component.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/Item/components/list/list.component.ts#L112-L118)): `id`، `no`، `name`، `type`، `supplierItemCode` (وتستعمل شاشة التقرير المصفوفة نفسها).
  - خصائص [ItemListVm.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Item/ItemListVm.cs#L3-L10): `Id`، `No`، `Name`، `Type`، `SupplierItemCode` — تطابق تام، وتعتمد `Service.GridFilterProjection` إسقاط `ItemListVM` لحجب أي فلترة على خصائص خارج القائمة مثل `Price` و`BarCode` و`StockBranch` و`UoM` و`MaximumQuantity` و`Note`.

## ٢. عقد الصلاحيات والمتطلبات ونطاق السجلات

- **مصدر الواجهة الموحّد (`item-access.ts`)**:
  - `view`: `'Item.View'`
  - `create`: `['Item.Create', 'Branch.Lookup']`
  - `edit`: `['Item.View', 'Item.Update', 'Branch.Lookup']`
  - `delete`: `['Item.View', 'Item.Delete']`
  - `validate`: `'Item.Validate'`
  - `lookups`: `item: 'Item.Lookup'`، `branches: 'Branch.Lookup'`، `units: 'UnitsOfMeasures.Lookup'`
  - `saveRequirements(mode, currentUnitId, savedUnitId)`: تُرجع `{ allOf: [...] }` وتضيف `'UnitsOfMeasures.Lookup'` فقط عند تحديد وحدة في الإنشاء (`current !== null`) أو إسناد/تغيير الوحدة في التعديل (`current !== saved`).
- **الخادم والتحقق والمتطلبات (`SigmaBackend`)**:
  - يرث `ItemController` من [SiGmaControllerBase.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/SiGmaControllerBase.cs): `GetListAsync` (`GET /api/Item`) و`GetByIdAsync` (`GET /api/Item/GetById/{id}`) و`GetByIdWithNavigationsAsync` (`GET /api/Item/GetByWithNavigationsId/{id}`) بمنحة `Item.View`؛ `GetSelectAsync` (`GET /api/Item/GetSelect`) بمنحة `Item.Lookup`؛ `CheckUniqueAsync` (`POST /api/Item/CheckUnique`) بمنحة `Item.Validate`؛ `AddAsync` (`POST /api/Item`) بمنحة `Item.Create`؛ `UpdateAsync` (`PUT /api/Item`) بمنحة `Item.Update`؛ `RemoveAsync` (`DELETE /api/Item?id={id}`) بمنحة `Item.Delete`.
  - يستبعد الكتالوج المنفذين الموروثين `HandleActivate` و`GetAllWithNavigations`. يرد المرشح بـ`403` للمستخدم العادي، وترجع الخدمة `405 ItemOperationNotSupported` للمدير الذي يصل إليها. دوال `GetManyWithNavigationsAsync` و`AddListAsync` و`UpdateListAsync` موجودة على مستوى الخدمة. متحكم الأصناف يرث منافذ HTTP المنشورة من المتحكم الأساسي. [المتحكم الأساسي](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/SiGmaControllerBase.cs:26>) · [كتالوج الإسناد](<F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs:78>)
  - مسجّل في [PermissionPrerequisites.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs#L468-L470) و[PermissionPrerequisites.Item.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.Item.cs#L7-L29):
    - `("Item", "Create")` -> ثابت `Branch.Lookup` + شرطي `itemUnitSpecified` (`UnitsOfMeasures.Lookup` عندما `UnitsOfMeasuresId > 0`).
    - `("Item", "Update")` -> ثابت `[Item.View, Branch.Lookup]` + شرطي `itemUnitChanged` (`UnitsOfMeasures.Lookup` عندما يختلف `UnitsOfMeasuresId` عن السجل المحفوظ `ItemBeforeChangeAsync()`, وإذا غاب السجل المحفوظ يُرجع `true` ليرد `ItemService` بـ`404 ItemNotFound`).
    - `("Item", "Delete")` -> ثابت `Item.View`.
  - نُشرت تسميات `itemUnitSpecified` و`itemUnitChanged` في [permission-dependencies.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/authorization/permission-dependencies.ts#L24-L25) و[authorization.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/authorization.ts#L40-L41) (و`320-321` بالعربية)، وأُضيفت مفاتيح `ItemNotFound` و`ItemOperationNotSupported` و`ItemInvalidInput` و`ItemBranchUnavailable` و`ItemUnitUnavailable` في [GeneralMessage.resx](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx#L3396-L3400) و[GeneralMessage.ar-SA.resx](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx#L3396-L3400).
- **نطاق المنشأة والفروع وAutoMapper**:
  - `Item` تعريف مشترك على مستوى الاشتراك (`SubscriptionId` + `IsDeleted != true`)؛ `StockBranchId` يتحقق من فرع نشط مقروء للمستخدم داخل الشركة عبر `Branch.Lookup` دون اشتراط `DemandBranchWrite`؛ و`UnitsOfMeasuresId` اختياري. تُشترط وحدة نشطة عند اختيارها أو تغييرها، ويمكن الاحتفاظ بالوحدة غير النشطة المحفوظة إذا كانت موجودة في نفس الشركة. يقارن الخادم قيمة الوحدة تحت قفل كتابة الصنف. يشترك الحذف والتعديل في هذا القفل، ويفحص الحذف وجود مراجع حية داخل الشركة برسالة استخدام عامة.
  - لم يحتج [ItemProfiler.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/ItemProfiler.cs#L10-L20) إلى أي تعديل أو `Ignore()`/`ReverseMap()` إضافية؛ قراءة التفاصيل في `ItemService.ReadDetailAsync` تستخدم إسقاط `AsNoTracking()` مباشرًا مع تصفية `SubscriptionId` و`IsDeleted != true` للملاحة المرجعية.

## ٣. سلوك الواجهة ودورة الجلسة ودليل المستخدم

- **المسارات (`route-access-policy.ts` و`item.routes.ts`)**: حُفظت المسارات `/item` (`itemAccess.view`) و`/item/create` (`itemAccess.create`) و`/item/details` (`itemAccess.view`)، وأُضيفت `'/Item'` و`'/Item/create'` في `firstAllowedRoute`. يفتح `/Item/create` مضيف المحرر مباشرة في وضع الإنشاء (`isCreateRoute`) دون إطلاق `GET /api/Item`.
- **القائمة والتقرير (`ItemsComponent` و`ItemReportComponent` و`ItemService`)**: اعتماد `AccessViewPolicyService` و`ownerContext`/`ownerSession`/`lastRevision`، وإلغاء القراءات وقرار تأكيد الحذف (`takeUntil` قبل `defaultIfEmpty(false)`)، وإغلاق `#typeFilterSelect?.hide()` عند انتهاء السياق أو سحب العرض، وتقييد أزرار العرض/التعديل/الحذف بـ`canView()`/`canEdit()`/`canDelete()`، وعزل رسائل أثر الحفظ والحذف عبر `CAN_PRESENT_API_OUTCOME` مع مصالحة القائمة عبر `canReconcileList()`. في [item-report.component.html](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/Item/components/report/item-report.component.html#L8-L29) فُصلت كتلتا `@if (canView())` لتفادي تحذير `NG8011` وضمان إسقاط زر الطباعة داخل `[editorDialogHint]`.
- **المحرر (`DetailsComponent`)**:
  - تحميل الفروع إلزامي وله حالته وإعادة محاولته. مصدر وحدات القياس مستقل، ويؤثر تحميله أو فشله أو غياب منحته في حفظ تغيير الوحدة فقط. يحتفظ المحرر بتسمية الوحدة المحفوظة من التفاصيل. يمكن التراجع عن تغيير الوحدة محليًا ثم حفظ بقية الحقول. يعطّل المحرر الفروع والوحدات غير النشطة للخيارات الجديدة باستخدام حالة النشاط من المصدرين الحاليين.
  - يثبّت المحرر إدخال الاسم أو الباركود عند قرار المغادرة. يستهلك نجاح الحفظ مسودة الجلسة الأصلية مرة واحدة ويحدّث القائمة المسموح بقراءتها، حتى لو تغيّر إصدار الصلاحيات قبل وصول الرد. يعمل إخفاء رسالة النتيجة بشكل مستقل. تُلغى الطباعة المجدولة عند انتهاء نطاق التقرير، ويعاد فحصه قبل فتح مربع الطباعة.
  - التحقق الفوري من التكرار `Item.Validate` استشاري وغير معطِّل للحفظ عند غيابه، بينما يواصل الخادم فرض تفرد `Name` و`BarCode` عبر `UniqueColumns`.
  - صُوّبت صيغ `validateRequirement()` و`unitLookupRequirement()` لاستعمال `{ allOf: [...] }` وفق `PermissionRequirement`.
- **دليل المستخدم**: حُدّث موضوع `sideMenu.stocks.items` (`/Item`) في [stock-guide.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/stock-guide.ts#L150-L165) باللغتين الإنجليزية والعربية لتوضيح `/Item/create` وصلاحية الفروع وشرطية `UnitsOfMeasures.Lookup` واستشارية فحص التكرار والحذف.

## ٤. الفلاتر (`BE9`) والأداء والفهارس والتحقق المعلّق

- **حصر فلاتر القائمة والفرز (`ItemService`)**: قبول المفاتيح `no` و`name` و`type` و`supplierItemCode` و`barCode` و`grid` و`sortField` و`sortOrder` فقط (`400 GridFilterUnsupportedField` لأي مفتاح آخر)، وقيم `sortField` (`id`، `no`، `name`، `type`، `supplieritemcode`)، والتحقق من `ItemTypeEnum` للـ`type` و`1 | -1` للـ`sortOrder` (`400 GridFilterInvalidValue` عند مخالفتها). التصفية والتعداد والفرز والترقيم تُنفذ على قاعدة البيانات قبل إسقاط أعمدة القائمة. يستخدم استعلام الأصناف مرشحًا واحدًا لكل حقل ويقبل السجلات التي لا يحمل حقل حذفها القيمة `true`. تُقرأ التفاصيل باستعلام `AsNoTracking()` مفرد.
- **الفهارس والهجرة (`SiGmaDbContextModelSnapshot.cs`)**: الفهارس القائمة على جدول `Item` (الأسطر `26462-26476`) تغطي المفتاح الأساسي `Id` وفهرسَي المفاتيح الأجنبية `StockBranchId` و`UnitsOfMeasuresId` والفهرسَين الفريدَين المرشَّحَين `(SubscriptionId, BarCode)` و`(SubscriptionId, Name)` (`[IsDeleted] = 0`). لا حاجة لأي تعديل مخطط أو هجرة (`No migration required`). إذا ظهر بطء فعلي لاحقًا على جداول ضخمة في القوائم المفلترة بالنوع، يُقترح فقط بعد فحص خطة التنفيذ و`cardinality` تقييم فهرس مغطٍ على `(SubscriptionId, IsDeleted, Type, Id)` مع التنبيه أن عمود `No` نوعه الحالي `nvarchar(max)` ولا يصلح مفتاحًا دون تغيير طوله بقرار مستقل. لم تُقَس أزمنة التشغيل أو خطط SQL حيًّا بعد.
- **مخرجات بناء التسليم الأول والفحص المصدري**. تُراجع نتائج المعالجة اللاحقة في [سجل مراجعة البند ١٥٨](AUTHORIZATION_158_SOURCE_REVIEW_20261113.md).
  - `dotnet build "F:\My Work\Sigma\SigmaBackend\tests\SiGma.BranchAccess.Tests\SiGma.BranchAccess.Tests.csproj" --no-restore -m:1 --disable-build-servers`: نجح بعد آخر تعديل لـ`ItemService.cs` (`Build succeeded. 0 Warning(s), 0 Error(s)` عبر الحزم السبع متضمنةً `SiGma.Business` و`SiGma.ServerAPI` و`SiGma.BranchAccess.Tests`).
  - `npm run build --prefix "F:\My Work\Sigma\SiGmaAngularFrontEnd"`: نجح برمز خروج `0` (`dist/sigma`) دون أخطاء TypeScript أو تحذيرات قالب `Item` (مع التحذيرات السابقة لميزانية CSS والـbundle في مكونات مشتركة).
  - `npx tsc --noEmit -p "F:\My Work\Sigma\SiGmaAngularFrontEnd\tsconfig.spec.json"`: لم يُسجّل أي خطأ ضمن ملفات `Stock/Item` أو `permission-dependencies.spec.ts` أو `route-access-policy.spec.ts` (أخطاء أخرى سابقة في وحدات غير مرتبطة مثل `BalanceSheet` و`PurchaseOrder` و`StaffTimesheet`).
  - يظل تشغيل `dotnet test` و`ng test` و`ng lint` واختبارات الواجهة والطلبات الحية وخطط SQL وأزمنة الاستجابة معلّقًا لمراجعة وقبول المالك.
- **حالة الجرد**: رُقي صف `Item` في [ROUTE_PERMISSION_ADOPTION_INVENTORY.json](file:///F:/My%20Work/Sigma/reviews/Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json) إلى `operation-confirmed` ليصبح الإجمالي `158` `operation-confirmed` و`49` `resource-only` و`52` `unknown` و`2` `context-only` و`2` `alias` من أصل `263`، والتالي في الجرد هو البند `159` `ItemIssue`.

## ٥. رسائل Commit المقترحة (للاقتراح فقط)

- **الواجهة (`SiGmaAngularFrontEnd`)**: `feat(item): adopt operation permissions, create-only route, and conditional unit lookup`
- **الخلفية (`SigmaBackend`)**: `feat(item): enforce permission prerequisites, BE9 filter allow-lists, and 405 guards`
