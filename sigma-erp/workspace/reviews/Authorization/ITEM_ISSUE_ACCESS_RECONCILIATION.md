# مطابقة صلاحيات صرف الأصناف — البند ١٥٩ (`/ItemIssue`)

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | 2026-11-13 |
| العقد | [العقد المجمد](ITEM_ISSUE_ACCESS_CONTRACT_FREEZE.md) |
| الاكتشاف | [تتبع المصدر والشكل](ITEM_ISSUE_ACCESS_DISCOVERY.md) |
| العقود المرجعية السابقة | `reviews/ITEM_ISSUE_DOMAIN_API_CONTRACT_FREEZE.md` · `reviews/GRN_ITEM_ISSUE_APPROVAL_CONTRACT_FREEZE.md` · `reviews/STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md` |
| النطاق | البند ١٥٩ — صرف الأصناف `ItemIssue` (`/ItemIssue` و`/ItemIssue/create` و`/ItemIssue/details/:id`)، المحرر، دورة الاعتماد والإلغاء، التقرير، التصدير، وواجهات الخادم |
| الحالة الحالية | نُفّذت المتطلبات في المصدر وبُنيت حزم الخادم والواجهة والاختبارات المحصورة. الجرد `159/263`. لا هجرة مطلوبة. تشغيل الاختبارات وتجربة الشاشة معلّقان |

## ١. المرجع الوظيفي والشكل والأعمدة

- **مصادر المرجع المقروءة**: وفق `Master 1/2/4/7` وتوثيق الاكتشاف [ITEM_ISSUE_ACCESS_DISCOVERY.md](ITEM_ISSUE_ACCESS_DISCOVERY.md)، رُوجِع كتالوج Speed المحلي بتاريخ `2026-10-27` (`references/speed-analysis/2026-10-27/library/catalog.csv` و`Speed_Analysis_Guide.md:281` دون صفحة دليل مستقلة لأذون صرف الأصناف) ثم حزمة القائمة والكود بتاريخ `2026-10-28` (`references/speed-analysis/2026-10-28/data/sidebar-screen-map.csv:111`، `sidebar/15-stock/screens/05-item-issues.md`، `workflows/02-workshop-stock-and-finance.md`، والمحركان `C1679` و`C1678`). تبيّن تطابق مرشحات الرقم والفترة وأمر الشغل وأعمدة القائمة وأفعال الإنشاء والتعديل والحذف والتقرير والتصدير، مع تحكّم العقود المجمدة في Sigma (`ITEM_ISSUE_DOMAIN_API_CONTRACT_FREEZE.md`، `GRN_ITEM_ISSUE_APPROVAL_CONTRACT_FREEZE.md`، `STOCK_BRANCH_BALANCE_CONTRACT_FREEZE.md`) في ربط فرع المخزون `BranchId` ودورة الاعتماد والإلغاء (`Approve` / `Reject` / `Void`). مرجع Odoo المكمل (`references/odoo-rental/README.md`) خاص بالتأجير والأسطول ولا يغيّر قواعد أذون صرف المخزون. يظل هذا الإثبات مصدرّيًا دون تشغيل حي.
- **الشكل والمالكون (`UI Type 01` + `Backend Pattern 2`)**: قائمة مع محرر حواري مجمّع لرأس المستند وبنوده (`app-editor-dialog` + `app-editable-collection-table`) وتقرير مستقل (`app-item-issue-report`) ودورة موافقات مدمجة/حوارية (`app-item-issue-approval-cycle`)، دون أوراق أنماط محلية.
- **أعمدة الجدول مقابل `ItemIssueListVM`**:
  - أعمدة الواجهة ([list.component.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/components/list/list.component.ts#L127-L137)): `no`، `dateAndTime`، `jobName` (قابل للفرز والفلترة فقط عند توافر `Job.Lookup`)، `branchName`، `approvalStatus` (وتمرّر القائمة الأعمدة نفسها إلى التقرير والتصدير).
  - خصائص [ItemIssueListVm.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/ItemIssue/ItemIssueListVm.cs#L3-L19): `Id`، `No`، `DateAndTime`، `JobName`، `BranchId`، `BranchName`، `ApprovalStatus`، `IsLegacyUnproven`، `IsVoided`، `CanEdit`، `CanDelete`، `CanApprove`، `CanReject`، `CanVoid` — مع استبعاد `Id` و`BranchId` وأعلام الأفعال الخمسة (`ExcludedGridFields`) من `GridFilter` في [ItemIssueService.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs#L26-L35).

## ٢. عقد الصلاحيات والمتطلبات ونطاق الفروع (`A1` و`A2`)

- **مصدر الواجهة الموحّد ([item-issue-access.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/item-issue-access.ts#L3-L27))**:
  - `view`: `'ItemIssue.View'`
  - `create`: `['ItemIssue.Create', 'Job.Lookup', 'Branch.Lookup', 'Item.Lookup']`
  - `edit`: `['ItemIssue.View', 'ItemIssue.Update', 'Job.Lookup', 'Branch.Lookup', 'Item.Lookup']`
  - `delete`: `['ItemIssue.View', 'ItemIssue.Delete']`
  - `manageApproval`: `['ItemIssue.View', 'ItemIssue.ManageApproval']`
  - `void`: `['ItemIssue.View', 'ItemIssue.Void']`
  - `lookups`: `job: 'Job.Lookup'`، `branch: 'Branch.Lookup'`، `item: 'Item.Lookup'`
- **الخادم والكتالوج والمتطلبات (`SigmaBackend`)**:
  - في [ItemIssueController.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/ItemIssueController.cs#L7-L28): يرث `GetListAsync` (`GET /api/ItemIssue`) و`GetByIdAsync` و`GetByIdWithNavigationsAsync` بمنحة `ItemIssue.View`، و`AddAsync` (`POST /api/ItemIssue`) بمنحة `ItemIssue.Create`، و`UpdateAsync` (`PUT /api/ItemIssue`) بمنحة `ItemIssue.Update`، و`RemoveAsync` (`DELETE /api/ItemIssue`) بمنحة `ItemIssue.Delete`؛ ويُعلن `ApprovalAsync` (`GET /api/ItemIssue/{id:int}/approval`) بـ`[PermissionCatalogAction("View")]` (المسجّل قراءةً في `BranchOperationRules.WholeDocumentReads` بالسطر `99`)، و`DecideApprovalAsync` (`POST /api/ItemIssue/{id:int}/approval`) بـ`[PermissionCatalogAction("ManageApproval")]`، و`VoidAsync` (`POST /api/ItemIssue/{id:int}/void`) بـ`[PermissionCatalogAction("Void")]` (**قرار المالك `A1`**).
  - يستبعد [PermissionEndpointResolver.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs#L85-L87) المنافذ الموروثة غير المستخدمة (`HandleActivate`، `CheckUnique`، `GetSelect`، `GetAllWithNavigations`) من كتالوج الإسناد، وترجع [ItemIssueService.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs#L307-L335) (وكذلك `AddListAsync` و`UpdateListAsync` و`HandleActiveAsync` في الأسطر `402-403` و`451-455`) حالة `405 ItemIssueOperationNotSupported` لأي استدعاء مباشر.
  - مسجّل في [PermissionPrerequisites.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs#L471-L474) و[PermissionPrerequisites.ItemIssue.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.ServerAPI/Authorization/PermissionPrerequisites.ItemIssue.cs#L9-L43):
    - `("ItemIssue", "Create")` -> ثابت `[Job.Lookup, Branch.Lookup, Item.Lookup]`.
    - `("ItemIssue", "Update")` -> ثابت `[ItemIssue.View, Job.Lookup, Branch.Lookup, Item.Lookup]` (**قرار المالك `A2`**).
    - `("ItemIssue", "Delete" or "ManageApproval" or "Void")` -> ثابت `[ItemIssue.View]`.
    - `("ItemIssue", "View")` -> شرطي `itemIssueJobFilterSpecified` (`Job.Lookup` عند إرسال `jobId` غير فارغ أو `sortField=jobName` أو عمود `grid` يستهدف `jobName` أو `jobId` أو `job.*`، مع الإغلاق الآمن عند JSON تالف أو يتجاوز `16384` حرفًا).
  - نُشر مفتاح الشرط `itemIssueJobFilterSpecified` في [permission-dependencies.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/authorization/permission-dependencies.ts#L26) و[authorization.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/authorization.ts#L42) (والسطر `323` بالعربية)، وأُضيفت رسالة `ItemIssueOperationNotSupported` في [GeneralMessage.resx](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.resx#L3398) و[GeneralMessage.ar-SA.resx](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx#L3398).
- **نطاق الفروع والمراجع النشطة (`BE8`)**:
  - تتحقق [ItemIssueService.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs#L55-L72) من `DemandRequestScope()` في جميع نقاط الدخول، وتفرض `DemandBranchWrite(...)` على الفرع المختار في `AddAsync` (`L395`)، وعلى الفرع المحفوظ والفرع الجديد معًا في `UpdateCoreAsync` (`L424` و`L435` — **قرار المالك `A2`**)، وعلى الفرع المحفوظ في `DecideApprovalCoreAsync` (`L549`) و`VoidCoreAsync` (`L755`) و`RemoveAsync` (`L843`)، مع رفض أي سجل يفتقر إلى `BranchId` موجب عبر `BranchAccessDeniedException`.
  - تتحقق `ValidateAsync` (`L358-L385`) من كون الفرع نشطًا (`IsActive != false`) وأمر الشغل والأصناف نشطةً عند الإنشاء أو التغيير مع السماح بالاحتفاظ بأمر الشغل أو الأصناف المحفوظة غير المعدّلة أثناء تحديث المسودة أو اعتمادها.
  - تُسقط `ProjectList` (`L74-L106`) و`ProjectDetail` (`L108-L166`) و`GetApprovalAsync` (`L464-L495`) اسم أمر الشغل عبر `UnitOfWork.Repository.Query<Job>().AsNoTracking()`، فيبقى السجل مرئيًا لمالك فرع إذن الصرف مع إرجاع `JobName = null` إذا كان أمر الشغل خارج فروع القراءة المسموحة أو محذوفًا.

## ٣. سلوك الواجهة ودورة الجلسة ودليل المستخدم

- **المسارات ([route-access-policy.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/authorization/route-access-policy.ts#L372-L374) و[itemissue.routes.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/itemissue.routes.ts#L10-L14))**: سُجّلت المسارات `/itemissue` (`itemIssueAccess.view`) و`/itemissue/create` (`itemIssueAccess.create`) و`/itemissue/details` (`itemIssueAccess.view`)، وأُضيفت `'/ItemIssue'` و`'/ItemIssue/create'` في `firstAllowedRoute` (`L405`). يفتح `/ItemIssue/create` المحرر مباشرةً في وضع الإنشاء (`isCreateRoute`) دون استدعاء `GET /api/ItemIssue` أو `Job/GetSelect`.
- **القائمة والتقرير ([list.component.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/components/list/list.component.ts) و[report.component.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/components/report/report.component.ts))**:
  - يقتصر تحميل `JobService.getSelectList` وفرز/فلترة عمود `jobName` على من يحمل `Job.Lookup` (`canLookupJob()`)؛ وعند غيابها أو سحبها تُصفَّر خيارات ومرشحات أمر الشغل وتُزال مفاتيح `jobName`/`jobId`/`job.*` من `grid` والفرز وتُغلق القوائم المنبثقة (`dateRangePicker` و`jobFilterSelect`) مع بقاء البحث بالرقم والفترة فاعلًا حتى لو تعذّر تحميل قائمة أوامر الشغل.
  - تقترن أفعال الصف للتعديل والحذف بـ`canEdit()`/`canDelete()` مع `canWriteBranch(row.branchId)` (`canTransact`)، ويُعاد التحقق بعد نافذة تأكيد الحذف (`defaultIfEmpty(false)` بعد `takeUntil`) مع تمرير `CAN_PRESENT_API_OUTCOME` وتحديث القائمة عبر `canReconcileList()` طالما بقيت `ItemIssue.View`.
  - في [report.component.html](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/components/report/report.component.html#L8-L29) فُصلت كتلتا `@if (canView())` لتفادي تحذير `NG8011` وضمان إسقاط شريط الطباعة داخل `[editorDialogHint]`، مع إلغاء الطباعة المجدولة وفحص `canPrint` في إطار الطباعة النهائي.
- **المحرر ودورة الموافقات ([details.component.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/components/details/details.component.ts) و[approval-cycle.component.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Stock/ItemIssue/components/approval-cycle/approval-cycle.component.ts))**:
  - ترشّح `branchesOptions` (`L144-L152`) الفروع القابلة للتسجيل (`canTransact`) وتُبقي الفرع المحفوظ غير القابل للتسجيل معطّلًا للعرض فقط، ويُقفل التعديل والحفظ (`editLocked` و`canMutate`) إذا لم يكن فرع السجل قابلًا للتسجيل.
  - يحفظ المحرر المسودة المعدّلة عند تغيّر إصدار الصلاحيات دون استبدالها بقراءة خلفية، ويطلب تأكيد التجاهل المحلي (`confirmDiscard('itemIssue')`) عند محاولة مغادرة مسودة معدّلة حتى بعد سحب المنحة، ويثبّت نجاح الحفظ المرسل عبر `saveCommitted` و`ownsDraft` مع قصر عرض الإشعار على `CAN_PRESENT_API_OUTCOME`.
  - يفصل مكون الموافقات بين العرض (`ItemIssue.View`) وقرارات الاعتماد/الرفض (`ItemIssue.ManageApproval` + `canWriteBranch`) وإلغاء الإذن المعتمد (`ItemIssue.Void` + `canWriteBranch`)، ويحمي مسودة سبب الإلغاء بتأكيد التجاهل.
- **دليل المستخدم**: حُدّث موضوع `sideMenu.stocks.itemIssues` (`/ItemIssue`) في [stock-guide.ts](file:///F:/My%20Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/stock-guide.ts#L180-L196) باللغتين الإنجليزية والعربية.

## ٤. الفلاتر (`BE9`) والأداء والفهارس والتحقق

- **حصر فلاتر القائمة والفرز ([ItemIssueService.cs](file:///F:/My%20Work/Sigma/SigmaBackend/SiGma.Business/Services/StocksServices/ItemIssueService.cs#L20-L35))**: قبول المفاتيح `no` و`dateFrom` و`dateTo` و`jobId` و`grid` و`sortField` و`sortOrder` فقط (`400 GridFilterUnsupportedField` لأي مفتاح آخر)، وقيم `sortField` (`id`، `no`، `dateandtime`، `jobname`، `branchname`، `approvalstatus`)، والتحقق من `jobId > 0` وصحة التاريخين و`sortOrder` (`1 | -1`، وإلا `400 GridFilterInvalidValue`)، وتطبيق `GridFilter` على الأعمدة المسموحة فقط قبل الترقيم.
- **الفهارس والهجرة**: الفهارس القائمة في `ItemIssueConfig` تغطي `(SubscriptionId, BranchId)` و`(SubscriptionId, ApprovalStatus, IsVoided, ApprovedAt)`. لا حاجة لأي تعديل مخطط أو هجرة (`No migration required`).
- **الفحوص المنفذة**:
  - `dotnet build "F:\My Work\Sigma\SigmaBackend\tests\SiGma.BranchAccess.Tests\SiGma.BranchAccess.Tests.csproj" --no-restore -m:1 --disable-build-servers`: نجح (`Build succeeded. 0 Warning(s), 0 Error(s)`) شاملًا `SiGma.ServerAPI` و`SiGma.Business` و`ItemIssueAccessContractTests.cs`.
  - `npm run build` في `F:\My Work\Sigma\SiGmaAngularFrontEnd`: نجح برمز خروج `0` (`dist/sigma`) دون أخطاء أو تحذيرات قوالب في `ItemIssue` (مع تحذيرات ميزانية الحجم والـSCSS العامة السابقة فقط).
  - `npx tsc --noEmit -p tsconfig.spec.json` في `F:\My Work\Sigma\SiGmaAngularFrontEnd`: `0` أخطاء في جميع ملفات ومواصفات `ItemIssue` و`permission-dependencies.spec.ts` و`route-access-policy.spec.ts` (مع بقاء أخطاء الأنواع السابقة في وحدات أخرى غير مرتبطة مثل `BalanceSheet` و`TimeSheet` و`Accidents` و`ServiceBookings` و`ServiceLog` و`StaffTimesheet` و`PurchaseOrder` و`PurchaseRequest`).
  - `git diff --check` في المستودعين: رمز خروج `0` (`BE_DIFF_CHECK=0 FE_DIFF_CHECK=0`).
  - `Generate-SigmaRecipes.ps1 -Check`: `8/8 OK`.
  - يظل تشغيل `dotnet test` و`ng test` و`ng lint` والتحقق التشغيلي والمرئي وخطط SQL معلّقًا لمراجعة وقبول المالك.
- **حالة الجرد**: رُقي صف `ItemIssue` في [ROUTE_PERMISSION_ADOPTION_INVENTORY.json](file:///F:/My%20Work/Sigma/reviews/Authorization/ROUTE_PERMISSION_ADOPTION_INVENTORY.json) إلى `operation-confirmed` ليصبح الإجمالي `159` `operation-confirmed` و`48` `resource-only` و`51` `unknown` و`2` `context-only` و`3` `alias` من أصل `263`. البند التالي في الجرد هو `ItemRequisition` (البند `162` بعد `160 ItemIssueItem` المحوّل و`161 ItemTypes` المؤكد سابقًا).

تجد تفاصيل المعالجة اللاحقة وحالة التحقق في [تقرير مراجعة البند ١٥٩](AUTHORIZATION_159_SOURCE_REVIEW_20261113.md).

## ٥. رسائل Commit المقترحة (للاقتراح فقط)

- **الواجهة (`SiGmaAngularFrontEnd`)**: `feat(item-issue): adopt operation permissions, writable branch guards, and void/approval separation`
- **الخلفية (`SigmaBackend`)**: `feat(item-issue): enforce Void action, branch write guards, BE9 allow-lists, and 405 handlers`
