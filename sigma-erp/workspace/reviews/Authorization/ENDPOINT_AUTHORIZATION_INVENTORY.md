| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-11-06 |
| Scope | Source-only endpoint authorization inventory for `SigmaBackend/SiGma.ServerAPI` |
| Runtime verification | Not performed; build/tests/lint/browser/database are outside the authorized boundary |

# Endpoint authorization inventory

## Snapshot الجرد الأولي — تاريخي

يحفظ هذا القسم نتيجة الاستخراج الأول قبل إضافة allow-list الثابتة وإصلاح
التفعيل الديناميكي. أرقامه **تاريخية وليست عدادات runtime أو وصفًا للحالة
الحالية**. كان المفتاح **Confirmed** يعني أن resolver القديم يحله من القالب
العام أو `PermissionCatalogAction` أو `DocumentApprovalEndpointRules`، وكان
**Proposed** اقتراحًا مطابقًا لاسم العملية، و**Pending** قرارًا لم يُحسم وقتها.
ملحق المصالحة الحالي أدناه هو المرجع للحالة المصدرية المنفذة الآن.

| Metric | Count | Source meaning |
|---|---:|---|
| Concrete controllers | 343 | public, non-abstract controller classes parsed from `Controller/*.cs` |
| Generic controllers | 285 | inherit `SiGmaControllerBase<,,,,>` directly or through a local base |
| Effective endpoints | 3,555 | overridden actions replace their base action; overloads with distinct signatures remain separate |
| Resolver-classified endpoints | 2,668 | resolver returns `Assignable=true`; includes four parameterized `DocumentApproval` routes with the mismatch below |
| Resolver-unreviewed / outside catalogue | 887 | candidate or deliberately non-domain operations |
| Confirmed | 2,664 | aligned source key and boundary |
| Proposed | 591 | final initial ledger: the original 574 plus 17 actions after their controller authorization boundary was added |
| Pending | 289 | historical only: 285 activation candidates and 4 approval-key mismatches before their later fixes |
| Not assignable | 11 | 6 authorization configuration, 3 current-branch session, 2 internal service-key actions |

صيغة تغطية snapshot الأول هي:

`285 generic resources × 10 inherited actions + 705 custom/effective actions = 3,555 endpoints`.

## المصادر وطريقة القراءة

| Source | Consumed contract |
|---|---|
| `Authorization/PermissionEndpointResolver.cs` | resource alias, `Async` normalization, explicit/approval/generic precedence, candidate-key shape |
| `Authorization/ReviewedPermissionOperations.cs` | current fixed reviewed-operation allow-list sourced from this inventory |
| `Authorization/ApiPermissionCatalog.cs` | anonymous and `AuthorizationController` exclusions, authenticated/custom discovery, document-source additions |
| `Authorization/PermissionAuthorizationFilter.cs` | current source grant lookup; unreviewed operations now fail closed for non-admin actors |
| `Services/Approvals/DocumentApprovalEndpointRules.cs` | reviewed native approval action names and source allow-list |
| `Services/Approvals/DocumentApprovalActionFilter.cs` | native source decision/read authorization and workflow gate |
| `Controller/SiGmaControllerBase.cs` | inherited routes, verbs, action names and generic resolver mappings |
| `Controller/*.cs` | declared routes, verbs, method names and `Authorize`/`AllowAnonymous`/policy/filter metadata |
| `Helpers/Approvals/DocumentApprovalCatalog.cs` | 77 document types, 73 distinct permission resources, three source operations per resource |

المسارات أدناه هي تركيب مصدرّي لسمات route. لا يدعي هذا الجرد أنه بديل
لـMVC action-descriptor runtime. احتفظت أسماء الإجراءات الفعلية كما في المصدر،
مع حذف لاحقة `Async` فقط عند عرض action التي يستهلكها resolver.

## قالب endpoints العام في snapshot الأول

ينطبق الجدول التالي على كل مورد في سجل الموارد generic أدناه. `{resource}` هو
اسم controller بلا اللاحقة `Controller`، عدا `PurchaseRequest` الذي يملكه
resolver باسم `PurchaseRequests`.

| Verb | Declared path | Actual method | Resolver action | Decision |
|---|---|---|---|---|
| POST | `/{controller}` | `AddAsync` | `Create` | Confirmed `{resource}.Create` |
| POST | `/{controller}/CheckUnique` | `CheckUniqueAsync` | `Validate` | Confirmed `{resource}.Validate` |
| PUT | `/{controller}` | `UpdateAsync` | `Update` | Confirmed `{resource}.Update` |
| DELETE | `/{controller}?id=...` | `RemoveAsync` | `Delete` | Confirmed `{resource}.Delete` |
| GET | `/{controller}/GetById/{id}` | `GetByIdAsync` | `View` | Confirmed `{resource}.View` |
| GET | `/{controller}` | `GetListAsync` | `View` | Confirmed `{resource}.View` |
| POST | `/{controller}/handleActivate` | `HandleActivateAsync` | candidate `Activate` | Pending `{resource}.Unreviewed.Activate`; العقد يمنع تعميم Activate بلا مراجعة المورد |
| GET | `/{controller}/GetAllWithNavigations` | `GetAllWithNavigationsAsync` | `View` | Confirmed `{resource}.View` |
| GET | `/{controller}/GetByWithNavigationsId/{id}` | `GetByIdWithNavigationsAsync` | `View` | Confirmed `{resource}.View` |
| GET | `/{controller}/GetSelect` | `GetSelectAsync` | `Lookup` | Confirmed `{resource}.Lookup` |

تكرار مفاتيح `View` هنا مقصود: عدة route aliases تشترك في المفتاح نفسه وفق
العقد المجمد. override يحل محل عملية القالب ولا يضيف endpoint ثانية؛ overload
مستقلة تظهر في مصفوفة العمليات المخصصة.

## حدود لا تتحول إلى صلاحية مجال

| Boundary | Endpoints | Decision |
|---|---|---|
| `AuthorizationController` + `TenantAdmin` | 6 | Not assignable: configuration surface excluded from `ApiPermissionCatalog` |
| `CurrentBranchController` | 3 | Not assignable: signed-in user's working-branch/session context |
| `InternalTenantUserController` + `AllowAnonymous` + `ServiceKeyAuthorizationFilter` | 2 | Not assignable: internal service channel; correctly excluded from catalogue |

تحديث H3 بتاريخ ١١ نوفمبر ٢٠٢٦: يَستبعد الكتالوج العمليات الموسومة
`[TenantAdminOnly]`. يشمل ذلك ٤ إجراءات لإقفال السنة وفحوصه، و٧ لإقفال الشهر
وإعادة فتحه وتغيير حالته وتعديله وفحوصه، وتهيئة دفعة الأرصدة الافتتاحية.
صفوف اللقطة التاريخية أدناه تحتفظ بالتصنيف وقت استخراجها. راجع
[مصالحة H3](AUTHORIZATION_COMPREHENSIVE_REVIEW_20261110.md#h3--عالية-منح-تظهر-في-الكتالوج-ولا-تعمل-أبدًا)
للتصنيف الحالي ونتيجة المراجعة المصدرية.

## فجوات snapshot الأول — تاريخية

القائمة التالية تحفظ سبب القرارات التي استهلكها التنفيذ اللاحق. لا تُقرأ
كقائمة فجوات حالية؛ حالة كل بند مصالحة في الملحق التالي.

1. **Historical — resolved:** كانت `ApiPermissionCatalog` تستبعد إجراءات `DocumentApproval.Documents/Context/Start/Decide`
   ثم تضيف مفاتيح per-source من `DocumentApprovalCatalog`، بينما كان الفلتر
   العام يحل الطلبات الأربعة إلى `DocumentApproval.View/SubmitApproval/ManageApproval`؛
   كان يلزم قرار dynamic resource أو استثناء منظم من الفلتر العام.
2. **Historical — no name mismatch found:** يحمي `TenantAdmin` خمسة controllers ويطلب claim للدور `Admin` أو
   `SuperAdmin`. يثبت المصدر أن `TenantIdentityService.RegisterAsync` يسند
   Identity role باسم `Admin`، بينما دور ERP المحلي المحجوز `TenantAdmin`
   علامة نظامية مستقلة للربط؛ لا يوجد تعارض اسم مثبت. يبقى وصول claim وربط
   الهوية/ERP قبولًا تشغيليًا معلقًا، لا فجوة resolver في هذا الجرد.
3. **Historical — resolved with exclusions:** كان عدد 285 من `HandleActivate` candidates؛ صنف التنفيذ الحالي العملية generic وأبقى 14 موردًا فقط في `UnsupportedActivation`.
4. **Historical — resolved:** كانت توجد 17 عملية مخصصة بلا `Authorize` فعلي في snapshot الاستخراج الأول.
   أثناء إعداد الجرد أضاف الجذر `Authorize` إلى controllers الستة المالكة؛ لذلك
   انتقلت هذه العمليات إلى Proposed وأصبح final initial ledger عدد 591. يحتفظ الجدول
   التاريخي أدناه بالـ17 لتدقيق الانتقال، وليس بوصفها فجوة حالية.
5. **Historical — resolved source-wise:** يمنع `LegacyAuthorizationWriteBlockFilter` الكتابة في `Permission` و
   `RolePermission` بكود 410، بينما كان القالب/الكتالوج يعرض مفاتيح الكتابة
   العامة لهما؛ كان يلزم إخفاؤها أو وسمها، وهو ما ينفذه الاستبعاد الحالي.
6. **Historical — resolved by fixed allow-list:** لم تكن أسطر Proposed ينفذها الفلتر granular؛ أصبحت الآن مملوكة لـ`ReviewedPermissionOperations`.

## مصالحة المصدر الحالي بعد التنفيذ — ٦ نوفمبر ٢٠٢٦

### نتيجة allow-list والتطبيع

| Check | Source result |
|---|---|
| Inventory reviewed keys | 591 unique keys from the tables below |
| `ReviewedPermissionOperations` | 591 unique entries |
| Missing from allow-list | 0 |
| Extra in allow-list | 0 |
| Duplicate allow-list entries | 0 |
| Normalization | exact terminal `Async` removal only; every normalized inventory key matches the fixed set |
| Comparison | ordinal, case-sensitive controller + operation identity |

ترتيب resolver الحالي هو: `PermissionCatalogAction` ثم قاعدة الموافقة ثم
generic mapping ثم `ReviewedPermissionOperations`. يزيل لاحقة `Async` النهائية
مرة واحدة قبل هذه المراحل. لذلك لا يوجد خطأ mapping آلي بين جدول الـ591
والـallow-list الحالية، ولا يعتمد التطابق على verb أو route أو تخمين `GET=View`.

### الفئات الحالية المتبقية

| Category | Current source status |
|---|---|
| Reviewed custom operations | مفاتيح الـ591 أصبحت assignable من allow-list الثابتة، مع بقاء السياسات الأعلى مثل `TenantAdmin` نافذة |
| Activation | `HandleActivate` أصبح `Activate` generic، عدا allow-list سلبية ثابتة من 14 موردًا في `UnsupportedActivation`; هذه تبقى candidates غير قابلة للإسناد |
| Dynamic document approval | الفلتر يتحقق من `documentType` المسجل ثم يمرره إلى resolver؛ المورد يتحول إلى `PermissionResource` للمصدر وتُستخدم مفاتيح per-source نفسها التي يعرضها الكتالوج |
| Unknown future custom action | `Assignable=false`; المستخدم غير الإداري يُمنع، بينما `Admin`/`SuperAdmin` يحتفظان بالتجاوز الصريح |
| Legacy authorization writes | `Role` و`Permission` و`RolePermission` writes مستبعدة من الكتالوج ويرد مسار الحظر بكود 410 |
| Current-branch actor context | مستبعد من كتالوج المجال ويُمرر فقط بعد إثبات principal وهوية ERP النشطة المرتبطة |
| Authorization configuration | `AuthorizationController` يبقى خارج كتالوج المجال وتعلوه سياسة `TenantAdmin` |
| Internal provisioning | `InternalTenantUserController` يبقى قناة `ServiceKey` ولا يتحول إلى صلاحية مجال |

لا تدعي هذه المصالحة عدد endpoints تشغيليًا أو نجاح action-descriptor discovery؛
هي مقارنة نصية للمصادر الحالية فقط، ولم يُشغّل build أو tests أو runtime.

### مخاطر التصنيف التي تحتاج قبول المالك

لا يوجد mismatch آلي في allow-list، لكن الإدخالات التالية عالية الأثر أصبحت
grantable بأسمائها المستقلة وتستحق مراجعة مقصودة قبل منحها لدور غير إداري:

- عمليات `DatabaseReset.*`، وبالأخص `ResetAll` و`ResetGoLive` و`ResetTables`.
- عمليات إنشاء/تهيئة البيانات `MockData.Generate` و`SeedData.CreateDefault`.
- عائلة `ImportData.*` الكتابية.
- `User.ProvisionIdentity` و`ApiKeySetting.GetMapApiKey` لارتباطهما بالهوية أو إعداد المفتاح.
- `Location.SearchPlacesTest` لأن الاسم يصرح بأنه endpoint اختبارية.

هذه ليست أخطاء set أو normalization مثبتة؛ هي مخاطر تصنيف وظيفي من أسماء
العمليات وحدود HTTP الحالية. لم أوسع القراءة إلى الخدمات أو آثار قاعدة البيانات.

## مصفوفة الموارد والعمليات

تبقى تسمية `Proposed` في الجداول التالية جزءًا من سجل الاستخراج الأول. في
المصدر الحالي تطابق هذه المفاتيح allow-list الثابتة وأصبحت `Reviewed` كما تثبت
المصالحة أعلاه؛ لم تُعد كتابة 591 صفًا حتى يظل الأثر التاريخي قابلًا للمقارنة.

الاختصارات: `A` = authenticated، `TA` = `TenantAdmin`، `SK` = service key،
`N` = لا توجد سمة مصادقة فعالة، `C` = Confirmed، `P` = Proposed،
`?` = Pending، `X` = Not assignable. مصدر السطر هو
`SiGma.ServerAPI/Controller/<file>:<line>`.

## العمليات التي كانت بلا Authorize في snapshot الأول

هذه هي القائمة الكاملة وعددها 17 في snapshot الأول. أضاف التكامل المتزامن
`Authorize` إلى controllers المالكة، ولذلك تظهر العمليات نفسها أيضًا ضمن
Proposed الحالية البالغ عددها 591. لم يُنفذ build أو runtime لإثبات الحدود.

| Verb/path | Controller.Method | Current candidate | Source |
|---|---|---|---|
| `GET /CostCenterSettings` | `CostCenterSettings.GetSettings` | `CostCenterSettings.Unreviewed.GetSettings` | `Controller/CostCenterSettingsController.cs:25` |
| `POST /CostCenterSettings` | `CostCenterSettings.UpdateSettings` | `CostCenterSettings.Unreviewed.UpdateSettings` | `Controller/CostCenterSettingsController.cs:18` |
| `POST /Dashboard/Agreements2` | `Dashboard.Agreements2` | `Dashboard.Unreviewed.Agreements2` | `Controller/DashboardController.cs:29` |
| `GET /EquipmentSettings` | `EquipmentSettings.GetSettings` | `EquipmentSettings.Unreviewed.GetSettings` | `Controller/EquipmentSettingsController.cs:25` |
| `POST /EquipmentSettings` | `EquipmentSettings.SetTimeSheetMandatory` | `EquipmentSettings.Unreviewed.SetTimeSheetMandatory` | `Controller/EquipmentSettingsController.cs:18` |
| `POST /ImportData/Assets` | `ImportData.AssetsImportData` | `ImportData.Unreviewed.AssetsImportData` | `Controller/ImportDataController.cs:56` |
| `POST /ImportData/Closed LeaseAgreements` | `ImportData.ClosedLeaseAgreementsData` | `ImportData.Unreviewed.ClosedLeaseAgreementsData` | `Controller/ImportDataController.cs:96` |
| `POST /ImportData/Closed RentalAgreement` | `ImportData.ClosedRentalAgreementImportData` | `ImportData.Unreviewed.ClosedRentalAgreementImportData` | `Controller/ImportDataController.cs:80` |
| `POST /ImportData/Items` | `ImportData.ItemsImportData` | `ImportData.Unreviewed.ItemsImportData` | `Controller/ImportDataController.cs:64` |
| `POST /ImportData/LeaseAgreements` | `ImportData.LeaseAgreementsData` | `ImportData.Unreviewed.LeaseAgreementsData` | `Controller/ImportDataController.cs:88` |
| `POST /ImportData/RentalAgreement` | `ImportData.RentalAgreementImportData` | `ImportData.Unreviewed.RentalAgreementImportData` | `Controller/ImportDataController.cs:72` |
| `POST /ImportData/Supplier` | `ImportData.SupplierImportData` | `ImportData.Unreviewed.SupplierImportData` | `Controller/ImportDataController.cs:39` |
| `POST /ImportData/Vehicles` | `ImportData.VehiclesImportData` | `ImportData.Unreviewed.VehiclesImportData` | `Controller/ImportDataController.cs:22` |
| `GET /MasterDarbSettings` | `MasterDarbSettings.GetSettings` | `MasterDarbSettings.Unreviewed.GetSettings` | `Controller/MasterDarbSettingsController.cs:25` |
| `POST /MasterDarbSettings` | `MasterDarbSettings.UpdateSettings` | `MasterDarbSettings.Unreviewed.UpdateSettings` | `Controller/MasterDarbSettingsController.cs:18` |
| `GET /MasterSalikSettings` | `MasterSalikSettings.GetSettings` | `MasterSalikSettings.Unreviewed.GetSettings` | `Controller/MasterSalikSettingsController.cs:25` |
| `POST /MasterSalikSettings` | `MasterSalikSettings.UpdateSettings` | `MasterSalikSettings.Unreviewed.UpdateSettings` | `Controller/MasterSalikSettingsController.cs:18` |

### Proposed custom operations — A-D (179)

| Verb/path | Controller.Method | Boundary | Proposed key | Current candidate | Source |
|---|---|---|---|---|---|
| `GET /Accident/AgreementVehicleOptions` | `Accident.AgreementVehicleOptionsAsync` | A | `Accident.AgreementVehicleOptions` | `Accident.Unreviewed.AgreementVehicleOptions` | `Controller/AccidentController.cs:28` |
| `GET /Accident/Options` | `Accident.OptionsAsync` | A | `Accident.Options` | `Accident.Unreviewed.Options` | `Controller/AccidentController.cs:24` |
| `GET /Accident/Report` | `Accident.ReportAsync` | A | `Accident.Report` | `Accident.Unreviewed.Report` | `Controller/AccidentController.cs:14` |
| `GET /Accident/ResolveMovement` | `Accident.ResolveMovementAsync` | A | `Accident.ResolveMovement` | `Accident.Unreviewed.ResolveMovement` | `Controller/AccidentController.cs:36` |
| `POST /Account/{id:int}/ConvertToGroup` | `Account.ConvertToGroup` | A | `Account.ConvertToGroup` | `Account.Unreviewed.ConvertToGroup` | `Controller/AccountController.cs:41` |
| `GET /Account/ByParentIdOrContactType` | `Account.GetAccountsByParentId` | A | `Account.GetAccountsByParentId` | `Account.Unreviewed.GetAccountsByParentId` | `Controller/AccountController.cs:27` |
| `GET /Account/PostingSelect` | `Account.GetPostingSelect` | A | `Account.GetPostingSelect` | `Account.Unreviewed.GetPostingSelect` | `Controller/AccountController.cs:34` |
| `GET /Account/SubGroups` | `Account.GetStatementSubGroups` | A | `Account.GetStatementSubGroups` | `Account.Unreviewed.GetStatementSubGroups` | `Controller/AccountController.cs:20` |
| `GET /Account/TreeList` | `Account.GetAccountNestedList` | A | `Account.GetAccountNestedList` | `Account.Unreviewed.GetAccountNestedList` | `Controller/AccountController.cs:13` |
| `GET /AccountGroupDefinition/Options` | `AccountGroupDefinition.GetOptionsAsync` | A | `AccountGroupDefinition.GetOptions` | `AccountGroupDefinition.Unreviewed.GetOptions` | `Controller/AccountGroupDefinitionController.cs:14` |
| `GET /AccountGroupDefinition/ReportOptions` | `AccountGroupDefinition.GetReportOptionsAsync` | A | `AccountGroupDefinition.GetReportOptions` | `AccountGroupDefinition.Unreviewed.GetReportOptions` | `Controller/AccountGroupDefinitionController.cs:18` |
| `GET /AccountReports/BalanceSheet` | `AccountReports.GetBalanceSheet` | A | `AccountReports.GetBalanceSheet` | `AccountReports.Unreviewed.GetBalanceSheet` | `Controller/AccountReportsController.cs:24` |
| `GET /AccountReports/BalanceSheetMonthwise` | `AccountReports.GetBalanceSheetMonthwise` | A | `AccountReports.GetBalanceSheetMonthwise` | `AccountReports.Unreviewed.GetBalanceSheetMonthwise` | `Controller/AccountReportsController.cs:54` |
| `GET /AccountReports/BankReconciliation` | `AccountReports.GetBankReconciliationSession` | A | `AccountReports.GetBankReconciliationSession` | `AccountReports.Unreviewed.GetBankReconciliationSession` | `Controller/AccountReportsController.cs:184` |
| `POST /AccountReports/BankReconciliation` | `AccountReports.CompleteReconciliation` | A | `AccountReports.CompleteReconciliation` | `AccountReports.Unreviewed.CompleteReconciliation` | `Controller/AccountReportsController.cs:194` |
| `POST /AccountReports/BankReconciliation/{id:int}/Void` | `AccountReports.VoidReconciliation` | A | `AccountReports.VoidReconciliation` | `AccountReports.Unreviewed.VoidReconciliation` | `Controller/AccountReportsController.cs:211` |
| `GET /AccountReports/Budget` | `AccountReports.GetBudget` | A | `AccountReports.GetBudget` | `AccountReports.Unreviewed.GetBudget` | `Controller/AccountReportsController.cs:154` |
| `POST /AccountReports/Budget` | `AccountReports.SaveBudget` | A | `AccountReports.SaveBudget` | `AccountReports.Unreviewed.SaveBudget` | `Controller/AccountReportsController.cs:164` |
| `GET /AccountReports/BudgetVariance` | `AccountReports.GetBudgetVariance` | A | `AccountReports.GetBudgetVariance` | `AccountReports.Unreviewed.GetBudgetVariance` | `Controller/AccountReportsController.cs:174` |
| `GET /AccountReports/CashFlow` | `AccountReports.GetCashFlow` | A | `AccountReports.GetCashFlow` | `AccountReports.Unreviewed.GetCashFlow` | `Controller/AccountReportsController.cs:34` |
| `GET /AccountReports/IncomeComparison` | `AccountReports.GetIncomeComparison` | A | `AccountReports.GetIncomeComparison` | `AccountReports.Unreviewed.GetIncomeComparison` | `Controller/AccountReportsController.cs:74` |
| `GET /AccountReports/IncomeStatement` | `AccountReports.GetIncomeStatement` | A | `AccountReports.GetIncomeStatement` | `AccountReports.Unreviewed.GetIncomeStatement` | `Controller/AccountReportsController.cs:14` |
| `GET /AccountReports/IncomeStatement2` | `AccountReports.GetIncomeStatement2` | A | `AccountReports.GetIncomeStatement2` | `AccountReports.Unreviewed.GetIncomeStatement2` | `Controller/AccountReportsController.cs:84` |
| `GET /AccountReports/IncomeStatementFy` | `AccountReports.GetIncomeStatementFy` | A | `AccountReports.GetIncomeStatementFy` | `AccountReports.Unreviewed.GetIncomeStatementFy` | `Controller/AccountReportsController.cs:114` |
| `GET /AccountReports/IncomeStatementFy2` | `AccountReports.GetIncomeStatementFy2` | A | `AccountReports.GetIncomeStatementFy2` | `AccountReports.Unreviewed.GetIncomeStatementFy2` | `Controller/AccountReportsController.cs:124` |
| `GET /AccountReports/IncomeStatementYtd` | `AccountReports.GetIncomeStatementYtd` | A | `AccountReports.GetIncomeStatementYtd` | `AccountReports.Unreviewed.GetIncomeStatementYtd` | `Controller/AccountReportsController.cs:94` |
| `GET /AccountReports/IncomeStatementYtd2` | `AccountReports.GetIncomeStatementYtd2` | A | `AccountReports.GetIncomeStatementYtd2` | `AccountReports.Unreviewed.GetIncomeStatementYtd2` | `Controller/AccountReportsController.cs:104` |
| `GET /AccountReports/Journals` | `AccountReports.GetJournals` | A | `AccountReports.GetJournals` | `AccountReports.Unreviewed.GetJournals` | `Controller/AccountReportsController.cs:144` |
| `GET /AccountReports/Ledger` | `AccountReports.GetLedger` | A | `AccountReports.GetLedger` | `AccountReports.Unreviewed.GetLedger` | `Controller/AccountReportsController.cs:134` |
| `GET /AccountReports/ReconciliationReport` | `AccountReports.GetReconciliationReport` | A | `AccountReports.GetReconciliationReport` | `AccountReports.Unreviewed.GetReconciliationReport` | `Controller/AccountReportsController.cs:220` |
| `GET /AccountReports/TrialBalance` | `AccountReports.GetTrialBalance` | A | `AccountReports.GetTrialBalance` | `AccountReports.Unreviewed.GetTrialBalance` | `Controller/AccountReportsController.cs:44` |
| `GET /AccountReports/VehicleIncomeStatement` | `AccountReports.GetVehicleIncomeStatement` | A | `AccountReports.GetVehicleIncomeStatement` | `AccountReports.Unreviewed.GetVehicleIncomeStatement` | `Controller/AccountReportsController.cs:64` |
| `GET /AccountSubGroupDefinition/Options` | `AccountSubGroupDefinition.GetOptionsAsync` | A | `AccountSubGroupDefinition.GetOptions` | `AccountSubGroupDefinition.Unreviewed.GetOptions` | `Controller/AccountSubGroupDefinitionController.cs:15` |
| `GET /AccountSubGroupDefinition/ReportKeys` | `AccountSubGroupDefinition.GetReportKeysAsync` | A | `AccountSubGroupDefinition.GetReportKeys` | `AccountSubGroupDefinition.Unreviewed.GetReportKeys` | `Controller/AccountSubGroupDefinitionController.cs:21` |
| `POST /AccountTypeDefinition/Initialize` | `AccountTypeDefinition.InitializeAsync` | A | `AccountTypeDefinition.Initialize` | `AccountTypeDefinition.Unreviewed.Initialize` | `Controller/AccountTypeDefinitionController.cs:27` |
| `GET /AccountTypeDefinition/Kinds` | `AccountTypeDefinition.GetKindsAsync` | A | `AccountTypeDefinition.GetKinds` | `AccountTypeDefinition.Unreviewed.GetKinds` | `Controller/AccountTypeDefinitionController.cs:23` |
| `GET /AccountTypeDefinition/Options` | `AccountTypeDefinition.GetOptionsAsync` | A | `AccountTypeDefinition.GetOptions` | `AccountTypeDefinition.Unreviewed.GetOptions` | `Controller/AccountTypeDefinitionController.cs:15` |
| `DELETE /Accruals` | `Accruals.DeleteAsync` | A | `Accruals.Delete` | `Accruals.Unreviewed.Delete` | `Controller/AccrualsController.cs:30` |
| `GET /Accruals` | `Accruals.DetailAsync` | A | `Accruals.Detail` | `Accruals.Unreviewed.Detail` | `Controller/AccrualsController.cs:22` |
| `GET /Accruals` | `Accruals.JournalAsync` | A | `Accruals.Journal` | `Accruals.Unreviewed.Journal` | `Controller/AccrualsController.cs:46` |
| `GET /Accruals` | `Accruals.LogAsync` | A | `Accruals.Log` | `Accruals.Unreviewed.Log` | `Controller/AccrualsController.cs:50` |
| `POST /Accruals` | `Accruals.VoidAsync` | A | `Accruals.Void` | `Accruals.Unreviewed.Void` | `Controller/AccrualsController.cs:42` |
| `GET /Accruals/prepare` | `Accruals.PrepareAsync` | A | `Accruals.Prepare` | `Accruals.Unreviewed.Prepare` | `Controller/AccrualsController.cs:14` |
| `GET /Accruals/runs` | `Accruals.RunsAsync` | A | `Accruals.Runs` | `Accruals.Unreviewed.Runs` | `Controller/AccrualsController.cs:18` |
| `POST /Accruals/runs` | `Accruals.SaveAsync` | A | `Accruals.Save` | `Accruals.Unreviewed.Save` | `Controller/AccrualsController.cs:26` |
| `GET /Alert/open-agreements/{customerId}` | `Alert.GetCustomerDocumentsWithOpenAgreements` | A | `Alert.GetCustomerDocumentsWithOpenAgreements` | `Alert.Unreviewed.GetCustomerDocumentsWithOpenAgreements` | `Controller/AlertController.cs:22` |
| `GET /Amortization/{id:int}/journal` | `Amortization.JournalAsync` | A | `Amortization.Journal` | `Amortization.Unreviewed.Journal` | `Controller/AmortizationController.cs:54` |
| `GET /Amortization/{id:int}/log` | `Amortization.LogAsync` | A | `Amortization.Log` | `Amortization.Unreviewed.Log` | `Controller/AmortizationController.cs:57` |
| `POST /Amortization/{id:int}/void` | `Amortization.VoidAsync` | A | `Amortization.Void` | `Amortization.Unreviewed.Void` | `Controller/AmortizationController.cs:47` |
| `GET /Amortization/prepare` | `Amortization.PrepareAsync` | A | `Amortization.Prepare` | `Amortization.Unreviewed.Prepare` | `Controller/AmortizationController.cs:28` |
| `GET /Amortization/runs` | `Amortization.RunsAsync` | A | `Amortization.Runs` | `Amortization.Unreviewed.Runs` | `Controller/AmortizationController.cs:36` |
| `POST /Amortization/runs` | `Amortization.SaveRunAsync` | A | `Amortization.SaveRun` | `Amortization.Unreviewed.SaveRun` | `Controller/AmortizationController.cs:32` |
| `DELETE /Amortization/runs/{id:int}` | `Amortization.DeleteRunAsync` | A | `Amortization.DeleteRun` | `Amortization.Unreviewed.DeleteRun` | `Controller/AmortizationController.cs:51` |
| `GET /Amortization/schedules` | `Amortization.SchedulesAsync` | A | `Amortization.Schedules` | `Amortization.Unreviewed.Schedules` | `Controller/AmortizationController.cs:17` |
| `POST /Amortization/schedules` | `Amortization.AddScheduleAsync` | A | `Amortization.AddSchedule` | `Amortization.Unreviewed.AddSchedule` | `Controller/AmortizationController.cs:20` |
| `DELETE /Amortization/schedules/{id:int}` | `Amortization.DeleteScheduleAsync` | A | `Amortization.DeleteSchedule` | `Amortization.Unreviewed.DeleteSchedule` | `Controller/AmortizationController.cs:24` |
| `GET /Amortization/sources` | `Amortization.SourcesAsync` | A | `Amortization.Sources` | `Amortization.Unreviewed.Sources` | `Controller/AmortizationController.cs:14` |
| `GET /ApiKeySetting/GetMapApiKey` | `ApiKeySetting.GetMapApiKey` | A | `ApiKeySetting.GetMapApiKey` | `ApiKeySetting.Unreviewed.GetMapApiKey` | `Controller/ApiKeySettingController.cs:14` |
| `GET /ApiKeySetting/Mine` | `ApiKeySetting.GetMineAsync` | A | `ApiKeySetting.GetMine` | `ApiKeySetting.Unreviewed.GetMine` | `Controller/SingleRowSettingsControllerBase.cs:25` |
| `PUT /ApiKeySetting/Mine` | `ApiKeySetting.SaveMineAsync` | A | `ApiKeySetting.SaveMine` | `ApiKeySetting.Unreviewed.SaveMine` | `Controller/SingleRowSettingsControllerBase.cs:29` |
| `POST /ApprovalLevel/AddList` | `ApprovalLevel.AddListAsync` | A | `ApprovalLevel.AddList` | `ApprovalLevel.Unreviewed.AddList` | `Controller/ApprovalLevelController.cs:14` |
| `GET /Asset/DepreciationReport` | `Asset.GetDepreciationReport` | A | `Asset.GetDepreciationReport` | `Asset.Unreviewed.GetDepreciationReport` | `Controller/AssetController.cs:23` |
| `GET /Asset/DepreciationReportFY` | `Asset.GetDepreciationReportFY` | A | `Asset.GetDepreciationReportFY` | `Asset.Unreviewed.GetDepreciationReportFY` | `Controller/AssetController.cs:63` |
| `GET /Asset/detail` | `Asset.GetDepreciationDetail` | A | `Asset.GetDepreciationDetail` | `Asset.Unreviewed.GetDepreciationDetail` | `Controller/AssetController.cs:41` |
| `GET /Asset/detail-report` | `Asset.GetDepreciationDetailReport` | A | `Asset.GetDepreciationDetailReport` | `Asset.Unreviewed.GetDepreciationDetailReport` | `Controller/AssetController.cs:55` |
| `GET /Asset/GetDepreciationSummary` | `Asset.GetDepreciationSummary` | A | `Asset.GetDepreciationSummary` | `Asset.Unreviewed.GetDepreciationSummary` | `Controller/AssetController.cs:27` |
| `GET /Attendance/StaffDutySchedule` | `Attendance.StaffDutySchedule` | A | `Attendance.StaffDutySchedule` | `Attendance.Unreviewed.StaffDutySchedule` | `Controller/AttendanceController.cs:14` |
| `GET /audittrail` | `AuditTrail.GetAsync` | A | `AuditTrail.Get` | `AuditTrail.Unreviewed.Get` | `Controller/AuditTrailController.cs:22` |
| `GET /audittrail/GetUsers` | `AuditTrail.GetUsersAsync` | A | `AuditTrail.GetUsers` | `AuditTrail.Unreviewed.GetUsers` | `Controller/AuditTrailController.cs:30` |
| `GET /Bank/{id}/ChequePrintingSettings` | `Bank.GetChequePrintingSettingsAsync` | A | `Bank.GetChequePrintingSettings` | `Bank.Unreviewed.GetChequePrintingSettings` | `Controller/BankController.cs:12` |
| `PUT /Bank/{id}/ChequePrintingSettings` | `Bank.SaveChequePrintingSettingsAsync` | A | `Bank.SaveChequePrintingSettings` | `Bank.Unreviewed.SaveChequePrintingSettings` | `Controller/BankController.cs:16` |
| `POST /Bill/{billId:int}/installments/{installmentId:int}/pay` | `Bill.PayInstallmentAsync` | A | `Bill.PayInstallment` | `Bill.Unreviewed.PayInstallment` | `Controller/BillController.cs:152` |
| `GET /Bill/{billId:int}/loan-payment-plan` | `Bill.LoanPaymentPlanDetailAsync` | A | `Bill.LoanPaymentPlanDetail` | `Bill.Unreviewed.LoanPaymentPlanDetail` | `Controller/BillController.cs:124` |
| `POST /Bill/{billId:int}/loan/down-payment` | `Bill.PayDownPaymentAsync` | A | `Bill.PayDownPayment` | `Bill.Unreviewed.PayDownPayment` | `Controller/BillController.cs:157` |
| `POST /Bill/{billId:int}/loan/reschedule` | `Bill.RescheduleLoanAsync` | A | `Bill.RescheduleLoan` | `Bill.Unreviewed.RescheduleLoan` | `Controller/BillController.cs:143` |
| `POST /Bill/{billId:int}/loan/reschedule/preview` | `Bill.PreviewLoanRescheduleAsync` | A | `Bill.PreviewLoanReschedule` | `Bill.Unreviewed.PreviewLoanReschedule` | `Controller/BillController.cs:133` |
| `POST /Bill/{billId:int}/loan/settlement` | `Bill.SettleLoanEarlyAsync` | A | `Bill.SettleLoanEarly` | `Bill.Unreviewed.SettleLoanEarly` | `Controller/BillController.cs:148` |
| `POST /Bill/{billId:int}/loan/settlement/preview` | `Bill.PreviewLoanSettlementAsync` | A | `Bill.PreviewLoanSettlement` | `Bill.Unreviewed.PreviewLoanSettlement` | `Controller/BillController.cs:138` |
| `GET /Bill/{id:int}/allocation` | `Bill.GetAllocationAsync` | A | `Bill.GetAllocation` | `Bill.Unreviewed.GetAllocation` | `Controller/BillController.cs:53` |
| `POST /Bill/{id:int}/allocation` | `Bill.AllocateAsync` | A | `Bill.Allocate` | `Bill.Unreviewed.Allocate` | `Controller/BillController.cs:57` |
| `GET /Bill/{id:int}/journal` | `Bill.GetJournalAsync` | A | `Bill.GetJournal` | `Bill.Unreviewed.GetJournal` | `Controller/BillController.cs:48` |
| `GET /Bill/{id:int}/supplier-debits` | `Bill.GetSupplierDebitsAsync` | A | `Bill.GetSupplierDebits` | `Bill.Unreviewed.GetSupplierDebits` | `Controller/BillController.cs:62` |
| `POST /Bill/{id:int}/supplier-debits/{sourceDetailId:int}/allocation` | `Bill.AllocateSupplierDebitAsync` | A | `Bill.AllocateSupplierDebit` | `Bill.Unreviewed.AllocateSupplierDebit` | `Controller/BillController.cs:72` |
| `GET /Bill/{id:int}/supplier-debits/{sourceDetailId:int}/targets` | `Bill.GetSupplierDebitTargetsAsync` | A | `Bill.GetSupplierDebitTargets` | `Bill.Unreviewed.GetSupplierDebitTargets` | `Controller/BillController.cs:67` |
| `POST /Bill/{id:int}/void` | `Bill.VoidAsync` | A | `Bill.Void` | `Bill.Unreviewed.Void` | `Controller/BillController.cs:43` |
| `GET /Bill/goods-received-notes` | `Bill.GetGoodsReceivedNotesAsync` | A | `Bill.GetGoodsReceivedNotes` | `Bill.Unreviewed.GetGoodsReceivedNotes` | `Controller/BillController.cs:95` |
| `POST /Bill/preview` | `Bill.PreviewAsync` | A | `Bill.Preview` | `Bill.Unreviewed.Preview` | `Controller/BillController.cs:105` |
| `GET /Bill/purchase-order-draft/{id:int}` | `Bill.GetPurchaseOrderDraftAsync` | A | `Bill.GetPurchaseOrderDraft` | `Bill.Unreviewed.GetPurchaseOrderDraft` | `Controller/BillController.cs:111` |
| `GET /Bill/purchase-orders` | `Bill.GetPurchaseOrdersAsync` | A | `Bill.GetPurchaseOrders` | `Bill.Unreviewed.GetPurchaseOrders` | `Controller/BillController.cs:116` |
| `POST /Bill/search` | `Bill.SearchAsync` | A | `Bill.Search` | `Bill.Unreviewed.Search` | `Controller/BillController.cs:87` |
| `GET /Bill/tax-report` | `Bill.GetTaxReportAsync` | A | `Bill.GetTaxReport` | `Bill.Unreviewed.GetTaxReport` | `Controller/BillController.cs:81` |
| `GET /BillingWorkspace` | `BillingWorkspace.GetAsync` | A | `BillingWorkspace.Get` | `BillingWorkspace.Unreviewed.Get` | `Controller/BillingWorkspaceController.cs:19` |
| `POST /Booking/{id:int}/cancel` | `Booking.CancelAsync` | A | `Booking.Cancel` | `Booking.Unreviewed.Cancel` | `Controller/BookingController.cs:17` |
| `POST /Booking/{id:int}/confirm` | `Booking.ConfirmAsync` | A | `Booking.Confirm` | `Booking.Unreviewed.Confirm` | `Controller/BookingController.cs:13` |
| `POST /Booking/{id:int}/deposit` | `Booking.AddDepositAsync` | A | `Booking.AddDeposit` | `Booking.Unreviewed.AddDeposit` | `Controller/BookingController.cs:25` |
| `GET /Booking/{id:int}/history` | `Booking.HistoryAsync` | A | `Booking.History` | `Booking.Unreviewed.History` | `Controller/BookingController.cs:37` |
| `GET /Booking/{id:int}/journal` | `Booking.JournalAsync` | A | `Booking.Journal` | `Booking.Unreviewed.Journal` | `Controller/BookingController.cs:41` |
| `POST /Booking/{id:int}/no-show` | `Booking.NoShowAsync` | A | `Booking.NoShow` | `Booking.Unreviewed.NoShow` | `Controller/BookingController.cs:21` |
| `GET /Booking/GenerateReport` | `Booking.Report` | A | `Booking.Report` | `Booking.Unreviewed.Report` | `Controller/BookingController.cs:45` |
| `GET /Booking/options` | `Booking.OptionsAsync` | A | `Booking.Options` | `Booking.Unreviewed.Options` | `Controller/BookingController.cs:32` |
| `GET /BrokerSetting/Mine` | `BrokerSetting.GetMineAsync` | A | `BrokerSetting.GetMine` | `BrokerSetting.Unreviewed.GetMine` | `Controller/SingleRowSettingsControllerBase.cs:25` |
| `PUT /BrokerSetting/Mine` | `BrokerSetting.SaveMineAsync` | A | `BrokerSetting.SaveMine` | `BrokerSetting.Unreviewed.SaveMine` | `Controller/SingleRowSettingsControllerBase.cs:29` |
| `GET /BusinessReports/ProfitLossBranchesReport` | `BusinessReports.ProfitLossBranchesReport` | A | `BusinessReports.ProfitLossBranchesReport` | `BusinessReports.Unreviewed.ProfitLossBranchesReport` | `Controller/BusinessReportsController.cs:20` |
| `GET /CardTransactionBankTransfer/EditorOptions` | `CardTransactionBankTransfer.GetEditorOptionsAsync` | A | `CardTransactionBankTransfer.GetEditorOptions` | `CardTransactionBankTransfer.Unreviewed.GetEditorOptions` | `Controller/CardTransactionBankTransferController.cs:27` |
| `GET /CardTransactionBankTransfer/GetPendingCardTransactions` | `CardTransactionBankTransfer.GetPendingCardTransactionsAsync` | A | `CardTransactionBankTransfer.GetPendingCardTransactions` | `CardTransactionBankTransfer.Unreviewed.GetPendingCardTransactions` | `Controller/CardTransactionBankTransferController.cs:23` |
| `POST /CardTransactionBankTransfer/ToggleVoid/{id}` | `CardTransactionBankTransfer.ToggleVoidAsync` | A | `CardTransactionBankTransfer.ToggleVoid` | `CardTransactionBankTransfer.Unreviewed.ToggleVoid` | `Controller/CardTransactionBankTransferController.cs:48` |
| `GET /CarModel/GetMakeAndModel` | `CarModel.GetMakeAndModelDropdownAsync` | A | `CarModel.GetMakeAndModelDropdown` | `CarModel.Unreviewed.GetMakeAndModelDropdown` | `Controller/CarModelController.cs:19` |
| `GET /CashDeposit/GetUndepositedVouchers` | `CashDeposit.GetUndepositedVouchersAsync` | A | `CashDeposit.GetUndepositedVouchers` | `CashDeposit.Unreviewed.GetUndepositedVouchers` | `Controller/CashDepositController.cs:21` |
| `POST /CashDeposit/ToggleVoid/{id}` | `CashDeposit.ToggleVoidAsync` | A | `CashDeposit.ToggleVoid` | `CashDeposit.Unreviewed.ToggleVoid` | `Controller/CashDepositController.cs:42` |
| `GET /ChargeSettings` | `ChargeSettings.Get` | A | `ChargeSettings.Get` | `ChargeSettings.Unreviewed.Get` | `Controller/ChargeSettingsController.cs:20` |
| `POST /ChargeSettings` | `ChargeSettings.Update` | A | `ChargeSettings.Update` | `ChargeSettings.Unreviewed.Update` | `Controller/ChargeSettingsController.cs:24` |
| `GET /CollectionMovement/GetMovements` | `CollectionMovement.GetMovementsAsync` | A | `CollectionMovement.GetMovements` | `CollectionMovement.Unreviewed.GetMovements` | `Controller/CollectionMovementController.cs:17` |
| `GET /Company/{id:int}/agreements` | `Company.GetAgreementHistoryAsync` | A | `Company.GetAgreementHistory` | `Company.Unreviewed.GetAgreementHistory` | `Controller/CompanyController.cs:15` |
| `PUT /Company/{id:int}/contact-group` | `Company.UpdateContactGroupAsync` | A | `Company.UpdateContactGroup` | `Company.Unreviewed.UpdateContactGroup` | `Controller/CompanyController.cs:21` |
| `GET /Contact/GetSelectByCompany/{companyId:int}` | `Contact.GetSelectByCompanyAsync` | A | `Contact.GetSelectByCompany` | `Contact.Unreviewed.GetSelectByCompany` | `Controller/ContactController.cs:13` |
| `POST /ContactGroup/{id:int}/SetDefault` | `ContactGroup.SetDefaultAsync` | A | `ContactGroup.SetDefault` | `ContactGroup.Unreviewed.SetDefault` | `Controller/ContactGroupController.cs:21` |
| `GET /ContactGroup/GetSelectByType/{type}` | `ContactGroup.GetSelectByTypeAsync` | A | `ContactGroup.GetSelectByType` | `ContactGroup.Unreviewed.GetSelectByType` | `Controller/ContactGroupController.cs:14` |
| `GET /CostCenter/GetSelectByGroup/{costCenterGroupId:int}` | `CostCenter.GetSelectByGroupAsync` | A | `CostCenter.GetSelectByGroup` | `CostCenter.Unreviewed.GetSelectByGroup` | `Controller/CostCenterController.cs:13` |
| `GET /CostCenterSettings` | `CostCenterSettings.GetSettings` | A | `CostCenterSettings.GetSettings` | `CostCenterSettings.Unreviewed.GetSettings` | `Controller/CostCenterSettingsController.cs:27` |
| `POST /CostCenterSettings` | `CostCenterSettings.UpdateSettings` | A | `CostCenterSettings.UpdateSettings` | `CostCenterSettings.Unreviewed.UpdateSettings` | `Controller/CostCenterSettingsController.cs:20` |
| `GET /CreditNote/GetInvoices/{customerId}` | `CreditNote.GetInvoices` | A | `CreditNote.GetInvoices` | `CreditNote.Unreviewed.GetInvoices` | `Controller/CreditNoteController.cs:27` |
| `GET /CreditNote/GetVoucherDetails/{id}` | `CreditNote.GetVoucherDetails` | A | `CreditNote.GetVoucherDetails` | `CreditNote.Unreviewed.GetVoucherDetails` | `Controller/CreditNoteController.cs:31` |
| `POST /CreditNote/ToggleVoidStatus/{id}` | `CreditNote.ToggleVoidStatus` | A | `CreditNote.ToggleVoidStatus` | `CreditNote.Unreviewed.ToggleVoidStatus` | `Controller/CreditNoteController.cs:39` |
| `GET /Currency/{currencyId:int}/Rate` | `Currency.GetRateAsync` | A | `Currency.GetRate` | `Currency.Unreviewed.GetRate` | `Controller/CurrencyController.cs:41` |
| `GET /Currency/{currencyId:int}/Rates` | `Currency.GetRatesAsync` | A | `Currency.GetRates` | `Currency.Unreviewed.GetRates` | `Controller/CurrencyController.cs:21` |
| `POST /Currency/{currencyId:int}/Rates` | `Currency.AddRateAsync` | A | `Currency.AddRate` | `Currency.Unreviewed.AddRate` | `Controller/CurrencyController.cs:26` |
| `DELETE /Currency/{currencyId:int}/Rates/{rateId:int}` | `Currency.RemoveRateAsync` | A | `Currency.RemoveRate` | `Currency.Unreviewed.RemoveRate` | `Controller/CurrencyController.cs:36` |
| `PUT /Currency/{currencyId:int}/Rates/{rateId:int}` | `Currency.UpdateRateAsync` | A | `Currency.UpdateRate` | `Currency.Unreviewed.UpdateRate` | `Controller/CurrencyController.cs:31` |
| `POST /Currency/ConversionPreview` | `Currency.PreviewConversionAsync` | A | `Currency.PreviewConversion` | `Currency.Unreviewed.PreviewConversion` | `Controller/CurrencyController.cs:16` |
| `GET /Currency/GetFinancialNumberPolicy` | `Currency.GetFinancialNumberPolicyAsync` | A | `Currency.GetFinancialNumberPolicy` | `Currency.Unreviewed.GetFinancialNumberPolicy` | `Controller/CurrencyController.cs:12` |
| `GET /CurrencyRevaluation` | `CurrencyRevaluation.List` | A | `CurrencyRevaluation.List` | `CurrencyRevaluation.Unreviewed.List` | `Controller/CurrencyRevaluationController.cs:26` |
| `POST /CurrencyRevaluation` | `CurrencyRevaluation.Add` | A | `CurrencyRevaluation.Add` | `CurrencyRevaluation.Unreviewed.Add` | `Controller/CurrencyRevaluationController.cs:19` |
| `GET /CurrencyRevaluation/{id:int}` | `CurrencyRevaluation.Detail` | A | `CurrencyRevaluation.Detail` | `CurrencyRevaluation.Unreviewed.Detail` | `Controller/CurrencyRevaluationController.cs:33` |
| `POST /CurrencyRevaluation/{id:int}/Void` | `CurrencyRevaluation.Void` | A | `CurrencyRevaluation.Void` | `CurrencyRevaluation.Unreviewed.Void` | `Controller/CurrencyRevaluationController.cs:40` |
| `POST /CurrencyRevaluation/Preview` | `CurrencyRevaluation.Preview` | A | `CurrencyRevaluation.Preview` | `CurrencyRevaluation.Unreviewed.Preview` | `Controller/CurrencyRevaluationController.cs:12` |
| `GET /Customer/Alerts` | `Customer.Alerts` | A | `Customer.Alerts` | `Customer.Unreviewed.Alerts` | `Controller/CustomerController.cs:16` |
| `GET /Customer/BalancesSummary` | `Customer.GetCustomerBalancesSummary` | A | `Customer.GetCustomerBalancesSummary` | `Customer.Unreviewed.GetCustomerBalancesSummary` | `Controller/CustomerController.cs:54` |
| `GET /Customer/DebtCollection` | `Customer.GetDebtCollection` | A | `Customer.GetDebtCollection` | `Customer.Unreviewed.GetDebtCollection` | `Controller/CustomerController.cs:26` |
| `GET /Customer/FollowUpReport` | `Customer.GetFollowUpReport` | A | `Customer.GetFollowUpReport` | `Customer.Unreviewed.GetFollowUpReport` | `Controller/CustomerController.cs:34` |
| `GET /Customer/ReceivableAgeAnalysis` | `Customer.GetReceivableAgeAnalysis` | A | `Customer.GetReceivableAgeAnalysis` | `Customer.Unreviewed.GetReceivableAgeAnalysis` | `Controller/CustomerController.cs:66` |
| `GET /Customer/Statement` | `Customer.GetCustomerStatement` | A | `Customer.GetCustomerStatement` | `Customer.Unreviewed.GetCustomerStatement` | `Controller/CustomerController.cs:42` |
| `GET /CustomerDeposit/ActionContext/{depositId}` | `CustomerDeposit.GetActionContext` | A | `CustomerDeposit.GetActionContext` | `CustomerDeposit.Unreviewed.GetActionContext` | `Controller/CustomerDepositController.cs:24` |
| `POST /CustomerDeposit/Extend/{depositId}` | `CustomerDeposit.ExtendDeposit` | A | `CustomerDeposit.ExtendDeposit` | `CustomerDeposit.Unreviewed.ExtendDeposit` | `Controller/CustomerDepositController.cs:62` |
| `GET /CustomerDeposit/GetOutstandingInvoices/{customerId}` | `CustomerDeposit.GetOutstandingInvoices` | A | `CustomerDeposit.GetOutstandingInvoices` | `CustomerDeposit.Unreviewed.GetOutstandingInvoices` | `Controller/CustomerDepositController.cs:91` |
| `GET /CustomerDeposit/GetVoucherDetails/{depositId}` | `CustomerDeposit.GetVoucherDetails` | A | `CustomerDeposit.GetVoucherDetails` | `CustomerDeposit.Unreviewed.GetVoucherDetails` | `Controller/CustomerDepositController.cs:84` |
| `POST /CustomerDeposit/Refund/{depositId}` | `CustomerDeposit.RefundDeposit` | A | `CustomerDeposit.RefundDeposit` | `CustomerDeposit.Unreviewed.RefundDeposit` | `Controller/CustomerDepositController.cs:73` |
| `GET /CustomerDeposit/Search` | `CustomerDeposit.SearchDeposits` | A | `CustomerDeposit.SearchDeposits` | `CustomerDeposit.Unreviewed.SearchDeposits` | `Controller/CustomerDepositController.cs:13` |
| `POST /CustomerDeposit/Transfer/{depositId}` | `CustomerDeposit.TransferDeposit` | A | `CustomerDeposit.TransferDeposit` | `CustomerDeposit.Unreviewed.TransferDeposit` | `Controller/CustomerDepositController.cs:51` |
| `GET /CustomerDeposit/TransferAgreements/{depositId}` | `CustomerDeposit.GetTransferAgreements` | A | `CustomerDeposit.GetTransferAgreements` | `CustomerDeposit.Unreviewed.GetTransferAgreements` | `Controller/CustomerDepositController.cs:31` |
| `GET /CustomerDeposit/Types` | `CustomerDeposit.GetTypes` | A | `CustomerDeposit.GetTypes` | `CustomerDeposit.Unreviewed.GetTypes` | `Controller/CustomerDepositController.cs:19` |
| `POST /CustomerDeposit/Use/{depositId}` | `CustomerDeposit.UseDeposit` | A | `CustomerDeposit.UseDeposit` | `CustomerDeposit.Unreviewed.UseDeposit` | `Controller/CustomerDepositController.cs:40` |
| `POST /CustomerRequest/{id:int}/Close` | `CustomerRequest.CloseAsync` | A | `CustomerRequest.Close` | `CustomerRequest.Unreviewed.Close` | `Controller/CustomerRequestController.cs:12` |
| `GET /DailyServiceLogReport` | `DailyServiceLogReport.GetAsync` | A | `DailyServiceLogReport.Get` | `DailyServiceLogReport.Unreviewed.Get` | `Controller/DailyServiceLogReportController.cs:19` |
| `POST /Dashboard/Agreements2` | `Dashboard.Agreements2` | A | `Dashboard.Agreements2` | `Dashboard.Unreviewed.Agreements2` | `Controller/DashboardController.cs:30` |
| `GET /Dashboard/Snapshot` | `Dashboard.Snapshot` | A | `Dashboard.Snapshot` | `Dashboard.Unreviewed.Snapshot` | `Controller/DashboardController.cs:21` |
| `POST /DatabaseReset/All` | `DatabaseReset.ResetAllAsync` | A | `DatabaseReset.ResetAll` | `DatabaseReset.Unreviewed.ResetAll` | `Controller/DatabaseResetController.cs:78` |
| `POST /DatabaseReset/GoLive` | `DatabaseReset.ResetGoLiveAsync` | A | `DatabaseReset.ResetGoLive` | `DatabaseReset.Unreviewed.ResetGoLive` | `Controller/DatabaseResetController.cs:67` |
| `POST /DatabaseReset/OpeningBalances` | `DatabaseReset.ResetOpeningBalancesAsync` | A | `DatabaseReset.ResetOpeningBalances` | `DatabaseReset.Unreviewed.ResetOpeningBalances` | `Controller/DatabaseResetController.cs:33` |
| `GET /DatabaseReset/Preview` | `DatabaseReset.PreviewAsync` | A | `DatabaseReset.Preview` | `DatabaseReset.Unreviewed.Preview` | `Controller/DatabaseResetController.cs:24` |
| `POST /DatabaseReset/Scope/{scope}` | `DatabaseReset.ResetScopeAsync` | A | `DatabaseReset.ResetScope` | `DatabaseReset.Unreviewed.ResetScope` | `Controller/DatabaseResetController.cs:55` |
| `POST /DatabaseReset/Tables` | `DatabaseReset.ResetTablesAsync` | A | `DatabaseReset.ResetTables` | `DatabaseReset.Unreviewed.ResetTables` | `Controller/DatabaseResetController.cs:44` |
| `POST /DataEntryCorrection/{id:int}/Close` | `DataEntryCorrection.CloseAsync` | A | `DataEntryCorrection.Close` | `DataEntryCorrection.Unreviewed.Close` | `Controller/DataEntryCorrectionController.cs:12` |
| `GET /DebitNote/GetBills/{supplierId}` | `DebitNote.GetBillsBySupplier` | A | `DebitNote.GetBillsBySupplier` | `DebitNote.Unreviewed.GetBillsBySupplier` | `Controller/DebitNoteController.cs:37` |
| `GET /DebitNote/GetVoucherDetails/{id}` | `DebitNote.GetVoucherDetails` | A | `DebitNote.GetVoucherDetails` | `DebitNote.Unreviewed.GetVoucherDetails` | `Controller/DebitNoteController.cs:42` |
| `POST /DebitNote/ToggleVoidStatus/{id}` | `DebitNote.ToggleVoidStatus` | A | `DebitNote.ToggleVoidStatus` | `DebitNote.Unreviewed.ToggleVoidStatus` | `Controller/DebitNoteController.cs:52` |
| `POST /Deduction/Import` | `Deduction.ImportAsync` | A | `Deduction.Import` | `Deduction.Unreviewed.Import` | `Controller/DeductionController.cs:8` |
| `GET /DeliveryNote/{id:int}` | `DeliveryNote.GetDetailByIdAsync` | A | `DeliveryNote.GetDetailById` | `DeliveryNote.Unreviewed.GetDetailById` | `Controller/DeliveryNoteController.cs:20` |
| `GET /DeliveryNote/OperationalSources` | `DeliveryNote.OperationalSourcesAsync` | A | `DeliveryNote.OperationalSources` | `DeliveryNote.Unreviewed.OperationalSources` | `Controller/DeliveryNoteController.cs:24` |
| `GET /Depreciation/prepare` | `Depreciation.Prepare` | A | `Depreciation.Prepare` | `Depreciation.Unreviewed.Prepare` | `Controller/DepreciationController.cs:11` |
| `POST /Depreciation/save` | `Depreciation.Save` | A | `Depreciation.Save` | `Depreciation.Unreviewed.Save` | `Controller/DepreciationController.cs:21` |
| `GET /DepreciationReportFy` | `DepreciationReportFy.GetAsync` | A | `DepreciationReportFy.Get` | `DepreciationReportFy.Unreviewed.Get` | `Controller/DepreciationReportFyController.cs:19` |
| `GET /DirectDebitAuthorizationSetting/Mine` | `DirectDebitAuthorizationSetting.GetMineAsync` | A | `DirectDebitAuthorizationSetting.GetMine` | `DirectDebitAuthorizationSetting.Unreviewed.GetMine` | `Controller/SingleRowSettingsControllerBase.cs:25` |
| `PUT /DirectDebitAuthorizationSetting/Mine` | `DirectDebitAuthorizationSetting.SaveMineAsync` | A | `DirectDebitAuthorizationSetting.SaveMine` | `DirectDebitAuthorizationSetting.Unreviewed.SaveMine` | `Controller/SingleRowSettingsControllerBase.cs:29` |
| `POST /DriverTimeSheet/AddList` | `DriverTimeSheet.AddListAsync` | A | `DriverTimeSheet.AddList` | `DriverTimeSheet.Unreviewed.AddList` | `Controller/DriverTimeSheetController.cs:29` |
| `GET /DriverTimeSheet/agreements` | `DriverTimeSheet.GetAgreementOptionsAsync` | A | `DriverTimeSheet.GetAgreementOptions` | `DriverTimeSheet.Unreviewed.GetAgreementOptions` | `Controller/DriverTimeSheetController.cs:19` |
| `PUT /DriverTimeSheet/EditList` | `DriverTimeSheet.UpdateListAsync` | A | `DriverTimeSheet.UpdateList` | `DriverTimeSheet.Unreviewed.UpdateList` | `Controller/DriverTimeSheetController.cs:34` |
| `GET /DriverTimeSheet/GetDriverTimeSheetsByAgreement/{id}` | `DriverTimeSheet.GetDriverTimeSheetsByAgreementAsync` | A | `DriverTimeSheet.GetDriverTimeSheetsByAgreement` | `DriverTimeSheet.Unreviewed.GetDriverTimeSheetsByAgreement` | `Controller/DriverTimeSheetController.cs:23` |
| `GET /DriverTimeSheetReport` | `DriverTimeSheetReport.GetAsync` | A | `DriverTimeSheetReport.Get` | `DriverTimeSheetReport.Unreviewed.Get` | `Controller/DriverTimeSheetReportController.cs:19` |
| `GET /DriverTimeSheetReport/options` | `DriverTimeSheetReport.GetOptionsAsync` | A | `DriverTimeSheetReport.GetOptions` | `DriverTimeSheetReport.Unreviewed.GetOptions` | `Controller/DriverTimeSheetReportController.cs:30` |

### Proposed custom operations — E-H (60)

| Verb/path | Controller.Method | Boundary | Proposed key | Current candidate | Source |
|---|---|---|---|---|---|
| `POST /EmailTemplates` | `EmailTemplates.UpdateEmailTemplate` | A | `EmailTemplates.UpdateEmailTemplate` | `EmailTemplates.Unreviewed.UpdateEmailTemplate` | `Controller/EmailTemplatesController.cs:26` |
| `GET /EmailTemplates/{templateType}` | `EmailTemplates.GetEmailTemplate` | A | `EmailTemplates.GetEmailTemplate` | `EmailTemplates.Unreviewed.GetEmailTemplate` | `Controller/EmailTemplatesController.cs:37` |
| `GET /EmailTemplates/Options` | `EmailTemplates.GetOptions` | A | `EmailTemplates.GetOptions` | `EmailTemplates.Unreviewed.GetOptions` | `Controller/EmailTemplatesController.cs:33` |
| `GET /EquipmentMasterAgreement/{id:int}` | `EquipmentMasterAgreement.GetDetailByIdAsync` | A | `EquipmentMasterAgreement.GetDetailById` | `EquipmentMasterAgreement.Unreviewed.GetDetailById` | `Controller/EquipmentMasterAgreementController.cs:18` |
| `POST /EquipmentMasterAgreement/{id:int}/close` | `EquipmentMasterAgreement.Close` | A | `EquipmentMasterAgreement.Close` | `EquipmentMasterAgreement.Unreviewed.Close` | `Controller/EquipmentMasterAgreementController.cs:38` |
| `GET /EquipmentMasterAgreement/{id:int}/financial-status` | `EquipmentMasterAgreement.FinancialStatus` | A | `EquipmentMasterAgreement.FinancialStatus` | `EquipmentMasterAgreement.Unreviewed.FinancialStatus` | `Controller/EquipmentMasterAgreementController.cs:34` |
| `POST /EquipmentMasterAgreement/{id:int}/reopen` | `EquipmentMasterAgreement.Reopen` | A | `EquipmentMasterAgreement.Reopen` | `EquipmentMasterAgreement.Unreviewed.Reopen` | `Controller/EquipmentMasterAgreementController.cs:42` |
| `GET /EquipmentMasterAgreement/{id:int}/sale-orders` | `EquipmentMasterAgreement.GetSaleOrdersAsync` | A | `EquipmentMasterAgreement.GetSaleOrders` | `EquipmentMasterAgreement.Unreviewed.GetSaleOrders` | `Controller/EquipmentMasterAgreementController.cs:28` |
| `PUT /EquipmentMasterAgreement/{id:int}/sale-orders` | `EquipmentMasterAgreement.UpdateSaleOrdersAsync` | A | `EquipmentMasterAgreement.UpdateSaleOrders` | `EquipmentMasterAgreement.Unreviewed.UpdateSaleOrders` | `Controller/EquipmentMasterAgreementController.cs:46` |
| `GET /EquipmentRentalInvoice/{id:int}/finance` | `EquipmentRentalInvoice.Finance` | A | `EquipmentRentalInvoice.Finance` | `EquipmentRentalInvoice.Unreviewed.Finance` | `Controller/EquipmentRentalInvoiceController.cs:17` |
| `POST /EquipmentRentalInvoice/{id:int}/void` | `EquipmentRentalInvoice.Void` | A | `EquipmentRentalInvoice.Void` | `EquipmentRentalInvoice.Unreviewed.Void` | `Controller/EquipmentRentalInvoiceController.cs:25` |
| `POST /EquipmentRentalInvoice/generate` | `EquipmentRentalInvoice.Generate` | A | `EquipmentRentalInvoice.Generate` | `EquipmentRentalInvoice.Unreviewed.Generate` | `Controller/EquipmentRentalInvoiceController.cs:13` |
| `POST /EquipmentRentalInvoice/preview` | `EquipmentRentalInvoice.Preview` | A | `EquipmentRentalInvoice.Preview` | `EquipmentRentalInvoice.Unreviewed.Preview` | `Controller/EquipmentRentalInvoiceController.cs:9` |
| `GET /EquipmentSalePreparation/{equipmentId:int}` | `EquipmentSalePreparation.Get` | A | `EquipmentSalePreparation.Get` | `EquipmentSalePreparation.Unreviewed.Get` | `Controller/EquipmentSalePreparationController.cs:32` |
| `GET /EquipmentSalePreparation/assets` | `EquipmentSalePreparation.Assets` | A | `EquipmentSalePreparation.Assets` | `EquipmentSalePreparation.Unreviewed.Assets` | `Controller/EquipmentSalePreparationController.cs:11` |
| `POST /EquipmentSalePreparation/confirm` | `EquipmentSalePreparation.Confirm` | A | `EquipmentSalePreparation.Confirm` | `EquipmentSalePreparation.Unreviewed.Confirm` | `Controller/EquipmentSalePreparationController.cs:25` |
| `POST /EquipmentSalePreparation/preview` | `EquipmentSalePreparation.Preview` | A | `EquipmentSalePreparation.Preview` | `EquipmentSalePreparation.Unreviewed.Preview` | `Controller/EquipmentSalePreparationController.cs:18` |
| `GET /EquipmentSettings` | `EquipmentSettings.GetSettings` | A | `EquipmentSettings.GetSettings` | `EquipmentSettings.Unreviewed.GetSettings` | `Controller/EquipmentSettingsController.cs:27` |
| `POST /EquipmentSettings` | `EquipmentSettings.SetTimeSheetMandatory` | A | `EquipmentSettings.SetTimeSheetMandatory` | `EquipmentSettings.Unreviewed.SetTimeSheetMandatory` | `Controller/EquipmentSettingsController.cs:20` |
| `GET /errorLogs` | `ErrorLogs.GetAsync` | A | `ErrorLogs.Get` | `ErrorLogs.Unreviewed.Get` | `Controller/ErrorLogsController.cs:14` |
| `GET /errorLogs/GetById/{id:int}` | `ErrorLogs.GetByIdAsync` | A | `ErrorLogs.GetById` | `ErrorLogs.Unreviewed.GetById` | `Controller/ErrorLogsController.cs:21` |
| `GET /FieldsSettings` | `FieldsSettings.Get` | A | `FieldsSettings.Get` | `FieldsSettings.Unreviewed.Get` | `Controller/FieldsSettingsController.cs:21` |
| `POST /FieldsSettings` | `FieldsSettings.Update` | A | `FieldsSettings.Update` | `FieldsSettings.Unreviewed.Update` | `Controller/FieldsSettingsController.cs:25` |
| `GET /FinancialReportSettings` | `FinancialReportSettings.GetAsync` | A | `FinancialReportSettings.Get` | `FinancialReportSettings.Unreviewed.Get` | `Controller/FinancialReportSettingsController.cs:19` |
| `PUT /FinancialReportSettings` | `FinancialReportSettings.SaveAsync` | A | `FinancialReportSettings.Save` | `FinancialReportSettings.Unreviewed.Save` | `Controller/FinancialReportSettingsController.cs:24` |
| `POST /FinancialReportSettings/Initialize` | `FinancialReportSettings.InitializeAsync` | A | `FinancialReportSettings.Initialize` | `FinancialReportSettings.Unreviewed.Initialize` | `Controller/FinancialReportSettingsController.cs:40` |
| `GET /FinancialReportSettings/Options` | `FinancialReportSettings.GetOptionsAsync` | A | `FinancialReportSettings.GetOptions` | `FinancialReportSettings.Unreviewed.GetOptions` | `Controller/FinancialReportSettingsController.cs:30` |
| `DELETE /FinancialReportSettings/Rows/{key}` | `FinancialReportSettings.DeleteRowAsync` | A | `FinancialReportSettings.DeleteRow` | `FinancialReportSettings.Unreviewed.DeleteRow` | `Controller/FinancialReportSettingsController.cs:34` |
| `GET /FinancialReportSettings/Statements/{kind:int}` | `FinancialReportSettings.GetStatementAsync` | A | `FinancialReportSettings.GetStatement` | `FinancialReportSettings.Unreviewed.GetStatement` | `Controller/FinancialReportSettingsController.cs:49` |
| `PUT /FinancialReportSettings/Statements/{kind:int}` | `FinancialReportSettings.SaveStatementAsync` | A | `FinancialReportSettings.SaveStatement` | `FinancialReportSettings.Unreviewed.SaveStatement` | `Controller/FinancialReportSettingsController.cs:53` |
| `DELETE /FinancialReportSettings/Statements/{kind:int}/Rows/{key}` | `FinancialReportSettings.DeleteStatementRowAsync` | A | `FinancialReportSettings.DeleteStatementRow` | `FinancialReportSettings.Unreviewed.DeleteStatementRow` | `Controller/FinancialReportSettingsController.cs:58` |
| `GET /FinancialReportSettings/Statements/Options` | `FinancialReportSettings.GetStatementOptionsAsync` | A | `FinancialReportSettings.GetStatementOptions` | `FinancialReportSettings.Unreviewed.GetStatementOptions` | `Controller/FinancialReportSettingsController.cs:45` |
| `GET /FiscalYear` | `FiscalYear.GetList` | A | `FiscalYear.GetList` | `FiscalYear.Unreviewed.GetList` | `Controller/FiscalYearController.cs:11` |
| `POST /FiscalYear` | `FiscalYear.Add` | A | `FiscalYear.Add` | `FiscalYear.Unreviewed.Add` | `Controller/FiscalYearController.cs:23` |
| `PUT /FiscalYear` | `FiscalYear.Update` | A | `FiscalYear.Update` | `FiscalYear.Unreviewed.Update` | `Controller/FiscalYearController.cs:29` |
| `POST /FiscalYear/CloseFiscalYear` | `FiscalYear.CloseFiscalYear` | A | `FiscalYear.CloseFiscalYear` | `FiscalYear.Unreviewed.CloseFiscalYear` | `Controller/FiscalYearController.cs:55` |
| `GET /FiscalYear/GetById/{id}` | `FiscalYear.GetById` | A | `FiscalYear.GetById` | `FiscalYear.Unreviewed.GetById` | `Controller/FiscalYearController.cs:15` |
| `GET /FiscalYear/GetSelect` | `FiscalYear.GetSelect` | A | `FiscalYear.GetSelect` | `FiscalYear.Unreviewed.GetSelect` | `Controller/FiscalYearController.cs:19` |
| `GET /FiscalYear/IsHaveFiscal` | `FiscalYear.IsHaveFiscal` | A | `FiscalYear.IsHaveFiscal` | `FiscalYear.Unreviewed.IsHaveFiscal` | `Controller/FiscalYearController.cs:33` |
| `POST /FiscalYear/VerfiyDataInconsistency` | `FiscalYear.VerifyDataInconsistency` | A | `FiscalYear.VerifyDataInconsistency` | `FiscalYear.Unreviewed.VerifyDataInconsistency` | `Controller/FiscalYearController.cs:49` |
| `POST /FiscalYear/VerfiyValidFiscalYear` | `FiscalYear.VerifyValidFiscalYear` | A | `FiscalYear.VerifyValidFiscalYear` | `FiscalYear.Unreviewed.VerifyValidFiscalYear` | `Controller/FiscalYearController.cs:37` |
| `POST /FiscalYear/VerfiyVoucherApprovals` | `FiscalYear.VerifyVoucherApprovals` | A | `FiscalYear.VerifyVoucherApprovals` | `FiscalYear.Unreviewed.VerifyVoucherApprovals` | `Controller/FiscalYearController.cs:43` |
| `GET /FleetAlerts/filter-options` | `FleetAlerts.GetFilterOptionsAsync` | A | `FleetAlerts.GetFilterOptions` | `FleetAlerts.Unreviewed.GetFilterOptions` | `Controller/FleetAlertsController.cs:51` |
| `GET /FleetAlerts/insurance` | `FleetAlerts.SearchInsuranceAsync` | A | `FleetAlerts.SearchInsurance` | `FleetAlerts.Unreviewed.SearchInsurance` | `Controller/FleetAlertsController.cs:21` |
| `PUT /FleetAlerts/insurance/renew` | `FleetAlerts.RenewInsuranceAsync` | A | `FleetAlerts.RenewInsurance` | `FleetAlerts.Unreviewed.RenewInsurance` | `Controller/FleetAlertsController.cs:55` |
| `GET /FleetAlerts/mileage` | `FleetAlerts.SearchMileageAsync` | A | `FleetAlerts.SearchMileage` | `FleetAlerts.Unreviewed.SearchMileage` | `Controller/FleetAlertsController.cs:33` |
| `GET /FleetAlerts/registration` | `FleetAlerts.SearchRegistrationAsync` | A | `FleetAlerts.SearchRegistration` | `FleetAlerts.Unreviewed.SearchRegistration` | `Controller/FleetAlertsController.cs:27` |
| `GET /FleetAlerts/services` | `FleetAlerts.SearchServicesAsync` | A | `FleetAlerts.SearchServices` | `FleetAlerts.Unreviewed.SearchServices` | `Controller/FleetAlertsController.cs:45` |
| `POST /FleetAlerts/services/complete` | `FleetAlerts.CompleteVehicleServiceAsync` | A | `FleetAlerts.CompleteVehicleService` | `FleetAlerts.Unreviewed.CompleteVehicleService` | `Controller/FleetAlertsController.cs:61` |
| `POST /FleetAlerts/services/reminders` | `FleetAlerts.SendServiceRemindersAsync` | A | `FleetAlerts.SendServiceReminders` | `FleetAlerts.Unreviewed.SendServiceReminders` | `Controller/FleetAlertsController.cs:67` |
| `GET /FleetAlerts/warranty` | `FleetAlerts.SearchWarrantyAsync` | A | `FleetAlerts.SearchWarranty` | `FleetAlerts.Unreviewed.SearchWarranty` | `Controller/FleetAlertsController.cs:39` |
| `GET /FollowUp/Customer/{customerId}` | `FollowUp.GetByCustomerId` | A | `FollowUp.GetByCustomerId` | `FollowUp.Unreviewed.GetByCustomerId` | `Controller/FollowUpController.cs:9` |
| `GET /FormConfiguration/GetByType/{type}` | `FormConfiguration.GetByType` | A | `FormConfiguration.GetByType` | `FormConfiguration.Unreviewed.GetByType` | `Controller/FormConfigurationController.cs:14` |
| `GET /GoodsReceivedNote/purchase-order-draft/{id:int}` | `GoodsReceivedNote.GetPurchaseOrderDraftAsync` | A | `GoodsReceivedNote.GetPurchaseOrderDraft` | `GoodsReceivedNote.Unreviewed.GetPurchaseOrderDraft` | `Controller/GoodsReceivedNoteController.cs:29` |
| `GET /GoodsReceivedNote/purchase-orders` | `GoodsReceivedNote.GetPurchaseOrdersAsync` | A | `GoodsReceivedNote.GetPurchaseOrders` | `GoodsReceivedNote.Unreviewed.GetPurchaseOrders` | `Controller/GoodsReceivedNoteController.cs:24` |
| `POST /GoodsReceivedNote/search` | `GoodsReceivedNote.SearchAsync` | A | `GoodsReceivedNote.Search` | `GoodsReceivedNote.Unreviewed.Search` | `Controller/GoodsReceivedNoteController.cs:19` |
| `GET /GoodsReceivedNote/tax-report` | `GoodsReceivedNote.GetTaxReportAsync` | A | `GoodsReceivedNote.GetTaxReport` | `GoodsReceivedNote.Unreviewed.GetTaxReport` | `Controller/GoodsReceivedNoteController.cs:68` |
| `GET /HrmSetting/Mine` | `HrmSetting.GetMineAsync` | A | `HrmSetting.GetMine` | `HrmSetting.Unreviewed.GetMine` | `Controller/SingleRowSettingsControllerBase.cs:25` |
| `PUT /HrmSetting/Mine` | `HrmSetting.SaveMineAsync` | A | `HrmSetting.SaveMine` | `HrmSetting.Unreviewed.SaveMine` | `Controller/SingleRowSettingsControllerBase.cs:29` |
| `GET /HrmSetting/options` | `HrmSetting.GetOptionsAsync` | A | `HrmSetting.GetOptions` | `HrmSetting.Unreviewed.GetOptions` | `Controller/HrmSettingController.cs:13` |

### Proposed custom operations — I-L (127)

| Verb/path | Controller.Method | Boundary | Proposed key | Current candidate | Source |
|---|---|---|---|---|---|
| `POST /ImportData/Assets` | `ImportData.AssetsImportData` | A | `ImportData.AssetsImportData` | `ImportData.Unreviewed.AssetsImportData` | `Controller/ImportDataController.cs:57` |
| `POST /ImportData/Closed LeaseAgreements` | `ImportData.ClosedLeaseAgreementsData` | A | `ImportData.ClosedLeaseAgreementsData` | `ImportData.Unreviewed.ClosedLeaseAgreementsData` | `Controller/ImportDataController.cs:97` |
| `POST /ImportData/Closed RentalAgreement` | `ImportData.ClosedRentalAgreementImportData` | A | `ImportData.ClosedRentalAgreementImportData` | `ImportData.Unreviewed.ClosedRentalAgreementImportData` | `Controller/ImportDataController.cs:81` |
| `POST /ImportData/Companies` | `ImportData.CompaniesImportData` | A | `ImportData.CompaniesImportData` | `ImportData.Unreviewed.CompaniesImportData` | `Controller/ImportDataController.cs:31` |
| `POST /ImportData/IndividualPartner` | `ImportData.IndividualPartnerData` | A | `ImportData.IndividualPartnerData` | `ImportData.Unreviewed.IndividualPartnerData` | `Controller/ImportDataController.cs:48` |
| `POST /ImportData/Items` | `ImportData.ItemsImportData` | A | `ImportData.ItemsImportData` | `ImportData.Unreviewed.ItemsImportData` | `Controller/ImportDataController.cs:65` |
| `POST /ImportData/LeaseAgreements` | `ImportData.LeaseAgreementsData` | A | `ImportData.LeaseAgreementsData` | `ImportData.Unreviewed.LeaseAgreementsData` | `Controller/ImportDataController.cs:89` |
| `POST /ImportData/RentalAgreement` | `ImportData.RentalAgreementImportData` | A | `ImportData.RentalAgreementImportData` | `ImportData.Unreviewed.RentalAgreementImportData` | `Controller/ImportDataController.cs:73` |
| `POST /ImportData/Staff` | `ImportData.StaffsImportData` | A | `ImportData.StaffsImportData` | `ImportData.Unreviewed.StaffsImportData` | `Controller/ImportDataController.cs:14` |
| `POST /ImportData/Supplier` | `ImportData.SupplierImportData` | A | `ImportData.SupplierImportData` | `ImportData.Unreviewed.SupplierImportData` | `Controller/ImportDataController.cs:40` |
| `POST /ImportData/Vehicles` | `ImportData.VehiclesImportData` | A | `ImportData.VehiclesImportData` | `ImportData.Unreviewed.VehiclesImportData` | `Controller/ImportDataController.cs:23` |
| `GET /IndividualPartner/{id:int}/agreements` | `IndividualPartner.GetAgreementHistoryAsync` | A | `IndividualPartner.GetAgreementHistory` | `IndividualPartner.Unreviewed.GetAgreementHistory` | `Controller/IndividualPartnerController.cs:14` |
| `PUT /IndividualPartner/{id:int}/contact-group` | `IndividualPartner.UpdateContactGroupAsync` | A | `IndividualPartner.UpdateContactGroup` | `IndividualPartner.Unreviewed.UpdateContactGroup` | `Controller/IndividualPartnerController.cs:20` |
| `POST /Invoice/AllocateTaxAdvance` | `Invoice.AllocateTaxAdvance` | A | `Invoice.AllocateTaxAdvance` | `Invoice.Unreviewed.AllocateTaxAdvance` | `Controller/InvoiceController.cs:73` |
| `POST /Invoice/GenerateInvoices` | `Invoice.GenerateInvoices` | A | `Invoice.GenerateInvoices` | `Invoice.Unreviewed.GenerateInvoices` | `Controller/InvoiceController.cs:42` |
| `POST /Invoice/GenerateRental` | `Invoice.GenerateRentalAsync` | A | `Invoice.GenerateRental` | `Invoice.Unreviewed.GenerateRental` | `Controller/InvoiceController.cs:21` |
| `POST /Invoice/GenerateTaxAdvance` | `Invoice.GenerateTaxAdvance` | A | `Invoice.GenerateTaxAdvance` | `Invoice.Unreviewed.GenerateTaxAdvance` | `Controller/InvoiceController.cs:95` |
| `GET /Invoice/GetTaxAdvanceAllocationDetails/{id}` | `Invoice.GetTaxAdvanceAllocationDetails` | A | `Invoice.GetTaxAdvanceAllocationDetails` | `Invoice.Unreviewed.GetTaxAdvanceAllocationDetails` | `Controller/InvoiceController.cs:81` |
| `GET /Invoice/GetVoucherDetails/{id}` | `Invoice.GetVoucherDetails` | A | `Invoice.GetVoucherDetails` | `Invoice.Unreviewed.GetVoucherDetails` | `Controller/InvoiceController.cs:58` |
| `POST /Invoice/PreviewRental` | `Invoice.PreviewRentalAsync` | A | `Invoice.PreviewRental` | `Invoice.Unreviewed.PreviewRental` | `Controller/InvoiceController.cs:17` |
| `GET /Invoice/Receipts/{id:int}` | `Invoice.GetReceiptsAsync` | A | `Invoice.GetReceipts` | `Invoice.Unreviewed.GetReceipts` | `Controller/InvoiceController.cs:37` |
| `GET /Invoice/RentalCandidates` | `Invoice.GetRentalCandidatesAsync` | A | `Invoice.GetRentalCandidates` | `Invoice.Unreviewed.GetRentalCandidates` | `Controller/InvoiceController.cs:13` |
| `GET /Invoice/TaxAdvance/{id}` | `Invoice.GetTaxAdvance` | A | `Invoice.GetTaxAdvance` | `Invoice.Unreviewed.GetTaxAdvance` | `Controller/InvoiceController.cs:102` |
| `GET /Invoice/TaxAdvanceCandidates` | `Invoice.GetTaxAdvanceCandidates` | A | `Invoice.GetTaxAdvanceCandidates` | `Invoice.Unreviewed.GetTaxAdvanceCandidates` | `Controller/InvoiceController.cs:88` |
| `POST /Invoice/ToggleDisputeStatus` | `Invoice.ToggleDisputeStatus` | A | `Invoice.ToggleDisputeStatus` | `Invoice.Unreviewed.ToggleDisputeStatus` | `Controller/InvoiceController.cs:50` |
| `POST /Invoice/Void` | `Invoice.VoidAsync` | A | `Invoice.Void` | `Invoice.Unreviewed.Void` | `Controller/InvoiceController.cs:25` |
| `POST /ItemRequisition/{id}/Issue` | `ItemRequisition.IssueAsync` | A | `ItemRequisition.Issue` | `ItemRequisition.Unreviewed.Issue` | `Controller/ItemRequisitionController.cs:12` |
| `POST /ItemRequisition/{id}/PurchaseRequest` | `ItemRequisition.CreatePurchaseRequestAsync` | A | `ItemRequisition.CreatePurchaseRequest` | `ItemRequisition.Unreviewed.CreatePurchaseRequest` | `Controller/ItemRequisitionController.cs:16` |
| `POST /Job/{jobId:int}/cancel` | `Job.CancelAsync` | A | `Job.Cancel` | `Job.Unreviewed.Cancel` | `Controller/JobController.cs:60` |
| `GET /Job/{jobId:int}/logs` | `Job.GetLogsAsync` | A | `Job.GetLogs` | `Job.Unreviewed.GetLogs` | `Controller/JobController.cs:64` |
| `POST /Job/{jobId:int}/logs` | `Job.AddLogAsync` | A | `Job.AddLog` | `Job.Unreviewed.AddLog` | `Controller/JobController.cs:68` |
| `POST /Job/{jobId:int}/quality-check` | `Job.AddQualityCheckAsync` | A | `Job.AddQualityCheck` | `Job.Unreviewed.AddQualityCheck` | `Controller/JobController.cs:72` |
| `POST /Job/close` | `Job.CloseAsync` | A | `Job.Close` | `Job.Unreviewed.Close` | `Controller/JobController.cs:56` |
| `GET /Job/closing/{jobId:int}` | `Job.GetClosingAsync` | A | `Job.GetClosing` | `Job.Unreviewed.GetClosing` | `Controller/JobController.cs:43` |
| `GET /Job/gate-pass/{jobId:int}` | `Job.GetGatePassAsync` | A | `Job.GetGatePass` | `Job.Unreviewed.GetGatePass` | `Controller/JobController.cs:47` |
| `POST /Job/invoice-customer/{jobId:int}` | `Job.InvoiceCustomerAsync` | A | `Job.InvoiceCustomer` | `Job.Unreviewed.InvoiceCustomer` | `Controller/JobController.cs:51` |
| `GET /Job/labour-times/{jobId:int}` | `Job.GetLabourTimesAsync` | A | `Job.GetLabourTimes` | `Job.Unreviewed.GetLabourTimes` | `Controller/JobController.cs:25` |
| `POST /Job/labour-times/logs` | `Job.AddLabourTimeLogAsync` | A | `Job.AddLabourTimeLog` | `Job.Unreviewed.AddLabourTimeLog` | `Controller/JobController.cs:34` |
| `GET /Job/labour-times/logs/{jobLabourId:int}` | `Job.GetLabourTimeLogsAsync` | A | `Job.GetLabourTimeLogs` | `Job.Unreviewed.GetLabourTimeLogs` | `Controller/JobController.cs:30` |
| `DELETE /Job/labour-times/logs/{logId:int}` | `Job.RemoveLabourTimeLogAsync` | A | `Job.RemoveLabourTimeLog` | `Job.Unreviewed.RemoveLabourTimeLog` | `Controller/JobController.cs:38` |
| `GET /Job/options` | `Job.GetOptionsAsync` | A | `Job.GetOptions` | `Job.Unreviewed.GetOptions` | `Controller/JobController.cs:15` |
| `GET /Job/workshop-grid` | `Job.GetWorkshopGridAsync` | A | `Job.GetWorkshopGrid` | `Job.Unreviewed.GetWorkshopGrid` | `Controller/JobController.cs:19` |
| `POST /JobEstimation/{id:int}/create-job` | `JobEstimation.CreateJob` | A | `JobEstimation.CreateJob` | `JobEstimation.Unreviewed.CreateJob` | `Controller/JobEstimationController.cs:44` |
| `GET /JobEstimation/{id:int}/logs` | `JobEstimation.GetLogs` | A | `JobEstimation.GetLogs` | `JobEstimation.Unreviewed.GetLogs` | `Controller/JobEstimationController.cs:36` |
| `POST /JobEstimation/{id:int}/logs` | `JobEstimation.AddLog` | A | `JobEstimation.AddLog` | `JobEstimation.Unreviewed.AddLog` | `Controller/JobEstimationController.cs:40` |
| `GET /JobEstimation/insurance-companies` | `JobEstimation.GetInsuranceCompanies` | A | `JobEstimation.GetInsuranceCompanies` | `JobEstimation.Unreviewed.GetInsuranceCompanies` | `Controller/JobEstimationController.cs:32` |
| `GET /JobEstimation/options` | `JobEstimation.GetOptions` | A | `JobEstimation.GetOptions` | `JobEstimation.Unreviewed.GetOptions` | `Controller/JobEstimationController.cs:28` |
| `POST /JobEstimation/search` | `JobEstimation.Search` | A | `JobEstimation.Search` | `JobEstimation.Unreviewed.Search` | `Controller/JobEstimationController.cs:14` |
| `GET /JournalVoucher/{id:int}` | `JournalVoucher.DetailAsync` | A | `JournalVoucher.Detail` | `JournalVoucher.Unreviewed.Detail` | `Controller/JournalVoucherController.cs:19` |
| `GET /JournalVoucher/{id:int}/allocation-lines` | `JournalVoucher.AllocationLinesAsync` | A | `JournalVoucher.AllocationLines` | `JournalVoucher.Unreviewed.AllocationLines` | `Controller/JournalVoucherController.cs:56` |
| `GET /JournalVoucher/{id:int}/allocation-sources/{detailId:int}` | `JournalVoucher.AllocationSourcesAsync` | A | `JournalVoucher.AllocationSources` | `JournalVoucher.Unreviewed.AllocationSources` | `Controller/JournalVoucherController.cs:60` |
| `GET /JournalVoucher/{id:int}/journal` | `JournalVoucher.JournalAsync` | A | `JournalVoucher.Journal` | `JournalVoucher.Unreviewed.Journal` | `Controller/JournalVoucherController.cs:48` |
| `GET /JournalVoucher/{id:int}/log` | `JournalVoucher.LogAsync` | A | `JournalVoucher.Log` | `JournalVoucher.Unreviewed.Log` | `Controller/JournalVoucherController.cs:44` |
| `POST /JournalVoucher/Allocate` | `JournalVoucher.AllocateAsync` | A | `JournalVoucher.Allocate` | `JournalVoucher.Unreviewed.Allocate` | `Controller/JournalVoucherController.cs:64` |
| `POST /JournalVoucher/CurrencyPreview` | `JournalVoucher.PreviewCurrencyAsync` | A | `JournalVoucher.PreviewCurrency` | `JournalVoucher.Unreviewed.PreviewCurrency` | `Controller/JournalVoucherController.cs:14` |
| `GET /JournalVoucher/details/{id:int}` | `JournalVoucher.LegacyDetailAsync` | A | `JournalVoucher.LegacyDetail` | `JournalVoucher.Unreviewed.LegacyDetail` | `Controller/JournalVoucherController.cs:23` |
| `POST /JournalVoucher/Void` | `JournalVoucher.VoidAsync` | A | `JournalVoucher.Void` | `JournalVoucher.Unreviewed.Void` | `Controller/JournalVoucherController.cs:68` |
| `GET /LabourActivitiesReport` | `LabourActivitiesReport.GetAsync` | A | `LabourActivitiesReport.Get` | `LabourActivitiesReport.Unreviewed.Get` | `Controller/LabourActivitiesReportController.cs:19` |
| `GET /LabourRate/Tariff` | `LabourRate.GetTariff` | A | `LabourRate.GetTariff` | `LabourRate.Unreviewed.GetTariff` | `Controller/LabourRateController.cs:20` |
| `PUT /LabourRate/Tariff` | `LabourRate.SaveTariff` | A | `LabourRate.SaveTariff` | `LabourRate.Unreviewed.SaveTariff` | `Controller/LabourRateController.cs:26` |
| `PUT /Language/Default` | `Language.DefaultAsync` | A | `Language.Default` | `Language.Unreviewed.Default` | `Controller/LanguageController.cs:16` |
| `GET /Language/Options` | `Language.OptionsAsync` | A | `Language.Options` | `Language.Unreviewed.Options` | `Controller/LanguageController.cs:12` |
| `GET /LanguageText` | `LanguageText.List` | A | `LanguageText.List` | `LanguageText.Unreviewed.List` | `Controller/LanguageTextController.cs:12` |
| `PUT /LanguageText` | `LanguageText.Save` | A | `LanguageText.Save` | `LanguageText.Unreviewed.Save` | `Controller/LanguageTextController.cs:33` |
| `GET /LanguageText/Detail` | `LanguageText.Detail` | A | `LanguageText.Detail` | `LanguageText.Unreviewed.Detail` | `Controller/LanguageTextController.cs:26` |
| `GET /LanguageText/Keys` | `LanguageText.Keys` | A | `LanguageText.Keys` | `LanguageText.Unreviewed.Keys` | `Controller/LanguageTextController.cs:19` |
| `DELETE /LanguageText/Override` | `LanguageText.Reset` | A | `LanguageText.Reset` | `LanguageText.Unreviewed.Reset` | `Controller/LanguageTextController.cs:40` |
| `GET /LeaseAgreement/{id:int}/additional-charges` | `LeaseAgreement.GetAdditionalChargesAsync` | A | `LeaseAgreement.GetAdditionalCharges` | `LeaseAgreement.Unreviewed.GetAdditionalCharges` | `Controller/LeaseAgreementController.cs:146` |
| `PUT /LeaseAgreement/{id:int}/additional-charges` | `LeaseAgreement.UpdateAdditionalChargesAsync` | A | `LeaseAgreement.UpdateAdditionalCharges` | `LeaseAgreement.Unreviewed.UpdateAdditionalCharges` | `Controller/LeaseAgreementController.cs:152` |
| `GET /LeaseAgreement/{id:int}/billing-history` | `LeaseAgreement.GetBillingHistoryAsync` | A | `LeaseAgreement.GetBillingHistory` | `LeaseAgreement.Unreviewed.GetBillingHistory` | `Controller/LeaseAgreementController.cs:108` |
| `POST /LeaseAgreement/{id:int}/close` | `LeaseAgreement.CloseAsync` | A | `LeaseAgreement.Close` | `LeaseAgreement.Unreviewed.Close` | `Controller/LeaseAgreementController.cs:75` |
| `GET /LeaseAgreement/{id:int}/close-context` | `LeaseAgreement.GetCloseContextAsync` | A | `LeaseAgreement.GetCloseContext` | `LeaseAgreement.Unreviewed.GetCloseContext` | `Controller/LeaseAgreementController.cs:69` |
| `POST /LeaseAgreement/{id:int}/delivery-date` | `LeaseAgreement.UpdateDeliveryDateAsync` | A | `LeaseAgreement.UpdateDeliveryDate` | `LeaseAgreement.Unreviewed.UpdateDeliveryDate` | `Controller/LeaseAgreementController.cs:95` |
| `GET /LeaseAgreement/{id:int}/delivery-date-context` | `LeaseAgreement.GetDeliveryDateContextAsync` | A | `LeaseAgreement.GetDeliveryDateContext` | `LeaseAgreement.Unreviewed.GetDeliveryDateContext` | `Controller/LeaseAgreementController.cs:89` |
| `POST /LeaseAgreement/{id:int}/deposit` | `LeaseAgreement.AddDepositAsync` | A | `LeaseAgreement.AddDeposit` | `LeaseAgreement.Unreviewed.AddDeposit` | `Controller/LeaseAgreementController.cs:159` |
| `GET /LeaseAgreement/{id:int}/discounts` | `LeaseAgreement.GetDiscountsAsync` | A | `LeaseAgreement.GetDiscounts` | `LeaseAgreement.Unreviewed.GetDiscounts` | `Controller/LeaseAgreementController.cs:133` |
| `PUT /LeaseAgreement/{id:int}/discounts` | `LeaseAgreement.UpdateDiscountsAsync` | A | `LeaseAgreement.UpdateDiscounts` | `LeaseAgreement.Unreviewed.UpdateDiscounts` | `Controller/LeaseAgreementController.cs:139` |
| `GET /LeaseAgreement/{id:int}/documents` | `LeaseAgreement.GetDocumentsAsync` | A | `LeaseAgreement.GetDocuments` | `LeaseAgreement.Unreviewed.GetDocuments` | `Controller/LeaseAgreementController.cs:127` |
| `POST /LeaseAgreement/{id:int}/documents/{agreementDocumentId:int}` | `LeaseAgreement.UploadDocumentAsync` | A | `LeaseAgreement.UploadDocument` | `LeaseAgreement.Unreviewed.UploadDocument` | `Controller/LeaseAgreementController.cs:192` |
| `GET /LeaseAgreement/{id:int}/driver-replacement-context` | `LeaseAgreement.GetDriverReplacementContextAsync` | A | `LeaseAgreement.GetDriverReplacementContext` | `LeaseAgreement.Unreviewed.GetDriverReplacementContext` | `Controller/LeaseAgreementController.cs:166` |
| `POST /LeaseAgreement/{id:int}/driver-replacements` | `LeaseAgreement.ReplaceDriverAsync` | A | `LeaseAgreement.ReplaceDriver` | `LeaseAgreement.Unreviewed.ReplaceDriver` | `Controller/LeaseAgreementController.cs:172` |
| `POST /LeaseAgreement/{id:int}/extend` | `LeaseAgreement.ExtendAsync` | A | `LeaseAgreement.Extend` | `LeaseAgreement.Unreviewed.Extend` | `Controller/LeaseAgreementController.cs:49` |
| `GET /LeaseAgreement/{id:int}/extend-context` | `LeaseAgreement.GetExtendContextAsync` | A | `LeaseAgreement.GetExtendContext` | `LeaseAgreement.Unreviewed.GetExtendContext` | `Controller/LeaseAgreementController.cs:43` |
| `POST /LeaseAgreement/{id:int}/extend-rate-period` | `LeaseAgreement.ExtendRatePeriodAsync` | A | `LeaseAgreement.ExtendRatePeriod` | `LeaseAgreement.Unreviewed.ExtendRatePeriod` | `Controller/LeaseAgreementController.cs:62` |
| `GET /LeaseAgreement/{id:int}/extend-rate-period-context` | `LeaseAgreement.GetExtendRatePeriodContextAsync` | A | `LeaseAgreement.GetExtendRatePeriodContext` | `LeaseAgreement.Unreviewed.GetExtendRatePeriodContext` | `Controller/LeaseAgreementController.cs:56` |
| `GET /LeaseAgreement/{id:int}/logs` | `LeaseAgreement.GetLogsAsync` | A | `LeaseAgreement.GetLogs` | `LeaseAgreement.Unreviewed.GetLogs` | `Controller/LeaseAgreementController.cs:102` |
| `GET /LeaseAgreement/{id:int}/payment-instructions` | `LeaseAgreement.GetPaymentInstructionsAsync` | A | `LeaseAgreement.GetPaymentInstructions` | `LeaseAgreement.Unreviewed.GetPaymentInstructions` | `Controller/LeaseAgreementController.cs:114` |
| `PUT /LeaseAgreement/{id:int}/payment-instructions` | `LeaseAgreement.UpdatePaymentInstructionsAsync` | A | `LeaseAgreement.UpdatePaymentInstructions` | `LeaseAgreement.Unreviewed.UpdatePaymentInstructions` | `Controller/LeaseAgreementController.cs:120` |
| `GET /LeaseAgreement/{id:int}/vehicle-replacement-context` | `LeaseAgreement.GetVehicleReplacementContextAsync` | A | `LeaseAgreement.GetVehicleReplacementContext` | `LeaseAgreement.Unreviewed.GetVehicleReplacementContext` | `Controller/LeaseAgreementController.cs:179` |
| `POST /LeaseAgreement/{id:int}/vehicle-replacements` | `LeaseAgreement.ReplaceVehicleAsync` | A | `LeaseAgreement.ReplaceVehicle` | `LeaseAgreement.Unreviewed.ReplaceVehicle` | `Controller/LeaseAgreementController.cs:185` |
| `POST /LeaseAgreement/{id:int}/void` | `LeaseAgreement.VoidAsync` | A | `LeaseAgreement.Void` | `LeaseAgreement.Unreviewed.Void` | `Controller/LeaseAgreementController.cs:82` |
| `GET /LeaseAgreement/ForInvoicing` | `LeaseAgreement.SearchAsync` | A | `LeaseAgreement.Search` | `LeaseAgreement.Unreviewed.Search` | `Controller/LeaseAgreementController.cs:37` |
| `GET /LeaseCustomerSms` | `LeaseCustomerSms.SearchAsync` | A | `LeaseCustomerSms.Search` | `LeaseCustomerSms.Unreviewed.Search` | `Controller/LeaseCustomerSmsController.cs:21` |
| `POST /LeaseCustomerSms/simulate` | `LeaseCustomerSms.SimulateAsync` | A | `LeaseCustomerSms.Simulate` | `LeaseCustomerSms.Unreviewed.Simulate` | `Controller/LeaseCustomerSmsController.cs:27` |
| `POST /LeaseInquiry/ChangeStage` | `LeaseInquiry.ChangeStageAsync` | A | `LeaseInquiry.ChangeStage` | `LeaseInquiry.Unreviewed.ChangeStage` | `Controller/LeaseInquiryController.cs:14` |
| `GET /LeaseInquiry/GetLogs/{id:int}` | `LeaseInquiry.GetLogsAsync` | A | `LeaseInquiry.GetLogs` | `LeaseInquiry.Unreviewed.GetLogs` | `Controller/LeaseInquiryController.cs:20` |
| `GET /LeaseMasterAgreement/{id:int}/items/{quotationItemId:int}/opening-source` | `LeaseMasterAgreement.GetOpeningSourceAsync` | A | `LeaseMasterAgreement.GetOpeningSource` | `LeaseMasterAgreement.Unreviewed.GetOpeningSource` | `Controller/LeaseMasterAgreementController.cs:23` |
| `GET /LeaseQuotation/{id:int}/purchase-order-source` | `LeaseQuotation.GetPurchaseOrderSourceAsync` | A | `LeaseQuotation.GetPurchaseOrderSource` | `LeaseQuotation.Unreviewed.GetPurchaseOrderSource` | `Controller/LeaseQuotationController.cs:23` |
| `GET /LeaseTariff/GetBookingCharges` | `LeaseTariff.GetBookingChargesAsync` | A | `LeaseTariff.GetBookingCharges` | `LeaseTariff.Unreviewed.GetBookingCharges` | `Controller/LeaseTariffController.cs:19` |
| `GET /LeaseTariff/GetTariffByVehicleTypeId/{id:int}` | `LeaseTariff.GetTariffByVehicleTypeIdAsync` | A | `LeaseTariff.GetTariffByVehicleTypeId` | `LeaseTariff.Unreviewed.GetTariffByVehicleTypeId` | `Controller/LeaseTariffController.cs:13` |
| `GET /Leave/dashboard` | `Leave.DashboardAsync` | A | `Leave.Dashboard` | `Leave.Unreviewed.Dashboard` | `Controller/LeaveController.cs:14` |
| `GET /LimousineInvoice/Candidates` | `LimousineInvoice.CandidatesAsync` | A | `LimousineInvoice.Candidates` | `LimousineInvoice.Unreviewed.Candidates` | `Controller/LimousineInvoiceController.cs:15` |
| `POST /LimousineInvoice/Generate` | `LimousineInvoice.GenerateAsync` | A | `LimousineInvoice.Generate` | `LimousineInvoice.Unreviewed.Generate` | `Controller/LimousineInvoiceController.cs:20` |
| `GET /LimousineSettings/Mine` | `LimousineSettings.GetMineAsync` | A | `LimousineSettings.GetMine` | `LimousineSettings.Unreviewed.GetMine` | `Controller/SingleRowSettingsControllerBase.cs:25` |
| `PUT /LimousineSettings/Mine` | `LimousineSettings.SaveMineAsync` | A | `LimousineSettings.SaveMine` | `LimousineSettings.Unreviewed.SaveMine` | `Controller/SingleRowSettingsControllerBase.cs:29` |
| `POST /LimousineTariff/AddList` | `LimousineTariff.AddListAsync` | A | `LimousineTariff.AddList` | `LimousineTariff.Unreviewed.AddList` | `Controller/LimousineTariffController.cs:58` |
| `PUT /LimousineTariff/EditList` | `LimousineTariff.EditListAsync` | A | `LimousineTariff.EditList` | `LimousineTariff.Unreviewed.EditList` | `Controller/LimousineTariffController.cs:33` |
| `GET /LimousineTariff/effective-rate` | `LimousineTariff.GetEffectiveRateAsync` | A | `LimousineTariff.GetEffectiveRate` | `LimousineTariff.Unreviewed.GetEffectiveRate` | `Controller/LimousineTariffController.cs:70` |
| `GET /LimousineTariff/GenerateReport` | `LimousineTariff.GenerateReportAsync` | A | `LimousineTariff.GenerateReport` | `LimousineTariff.Unreviewed.GenerateReport` | `Controller/LimousineTariffController.cs:47` |
| `GET /LimousineTariff/GetTariffs` | `LimousineTariff.GetTariffsAsync` | A | `LimousineTariff.GetTariffs` | `LimousineTariff.Unreviewed.GetTariffs` | `Controller/LimousineTariffController.cs:17` |
| `POST /LinkAccounts/auto-link/apply` | `LinkAccounts.ApplyAutoLink` | A | `LinkAccounts.ApplyAutoLink` | `LinkAccounts.Unreviewed.ApplyAutoLink` | `Controller/LinkAccountsController.cs:61` |
| `GET /LinkAccounts/auto-link/plan` | `LinkAccounts.GetAutoLinkPlan` | A | `LinkAccounts.GetAutoLinkPlan` | `LinkAccounts.Unreviewed.GetAutoLinkPlan` | `Controller/LinkAccountsController.cs:54` |
| `GET /LinkAccounts/by-type/{type}` | `LinkAccounts.GetByType` | A | `LinkAccounts.GetByType` | `LinkAccounts.Unreviewed.GetByType` | `Controller/LinkAccountsController.cs:24` |
| `GET /LinkAccounts/hrm` | `LinkAccounts.GetHrm` | A | `LinkAccounts.GetHrm` | `LinkAccounts.Unreviewed.GetHrm` | `Controller/LinkAccountsController.cs:32` |
| `POST /LinkAccounts/hrm/auto-link/apply` | `LinkAccounts.ApplyHrmAutoLink` | A | `LinkAccounts.ApplyHrmAutoLink` | `LinkAccounts.Unreviewed.ApplyHrmAutoLink` | `Controller/LinkAccountsController.cs:90` |
| `GET /LinkAccounts/hrm/auto-link/plan` | `LinkAccounts.GetHrmAutoLinkPlan` | A | `LinkAccounts.GetHrmAutoLinkPlan` | `LinkAccounts.Unreviewed.GetHrmAutoLinkPlan` | `Controller/LinkAccountsController.cs:68` |
| `GET /LinkAccounts/options` | `LinkAccounts.GetOptions` | A | `LinkAccounts.GetOptions` | `LinkAccounts.Unreviewed.GetOptions` | `Controller/LinkAccountsController.cs:39` |
| `POST /LinkAccounts/repair/apply` | `LinkAccounts.ApplyRepair` | A | `LinkAccounts.ApplyRepair` | `LinkAccounts.Unreviewed.ApplyRepair` | `Controller/LinkAccountsController.cs:82` |
| `GET /LinkAccounts/repair/plan` | `LinkAccounts.GetRepairPlan` | A | `LinkAccounts.GetRepairPlan` | `LinkAccounts.Unreviewed.GetRepairPlan` | `Controller/LinkAccountsController.cs:75` |
| `GET /LinkAccounts/selection-options` | `LinkAccounts.GetSelectionOptions` | A | `LinkAccounts.GetSelectionOptions` | `LinkAccounts.Unreviewed.GetSelectionOptions` | `Controller/LinkAccountsController.cs:46` |
| `POST /LinkAccounts/upsert` | `LinkAccounts.Save` | A | `LinkAccounts.Save` | `LinkAccounts.Unreviewed.Save` | `Controller/LinkAccountsController.cs:15` |
| `GET /LoanReport/details` | `LoanReport.GetDetailsAsync` | A | `LoanReport.GetDetails` | `LoanReport.Unreviewed.GetDetails` | `Controller/LoanReportController.cs:32` |
| `GET /LoanReport/emis` | `LoanReport.GetEMIsAsync` | A | `LoanReport.GetEMIs` | `LoanReport.Unreviewed.GetEMIs` | `Controller/LoanReportController.cs:45` |
| `GET /LoanReport/finance-banks` | `LoanReport.GetFinanceBanksAsync` | A | `LoanReport.GetFinanceBanks` | `LoanReport.Unreviewed.GetFinanceBanks` | `Controller/LoanReportController.cs:58` |
| `GET /LoanReport/loans` | `LoanReport.GetLoansAsync` | A | `LoanReport.GetLoans` | `LoanReport.Unreviewed.GetLoans` | `Controller/LoanReportController.cs:19` |
| `GET /Localization/Runtime` | `Localization.Runtime` | A | `Localization.Runtime` | `Localization.Unreviewed.Runtime` | `Controller/LocalizationController.cs:11` |
| `GET /Location/SearchPlaces` | `Location.SearchPlacesTest` | A | `Location.SearchPlacesTest` | `Location.Unreviewed.SearchPlacesTest` | `Controller/LocationController.cs:15` |

### Proposed custom operations — M-P (79)

| Verb/path | Controller.Method | Boundary | Proposed key | Current candidate | Source |
|---|---|---|---|---|---|
| `GET /MasterDarbSettings` | `MasterDarbSettings.GetSettings` | A | `MasterDarbSettings.GetSettings` | `MasterDarbSettings.Unreviewed.GetSettings` | `Controller/MasterDarbSettingsController.cs:27` |
| `POST /MasterDarbSettings` | `MasterDarbSettings.UpdateSettings` | A | `MasterDarbSettings.UpdateSettings` | `MasterDarbSettings.Unreviewed.UpdateSettings` | `Controller/MasterDarbSettingsController.cs:20` |
| `GET /MasterSalikSettings` | `MasterSalikSettings.GetSettings` | A | `MasterSalikSettings.GetSettings` | `MasterSalikSettings.Unreviewed.GetSettings` | `Controller/MasterSalikSettingsController.cs:27` |
| `POST /MasterSalikSettings` | `MasterSalikSettings.UpdateSettings` | A | `MasterSalikSettings.UpdateSettings` | `MasterSalikSettings.Unreviewed.UpdateSettings` | `Controller/MasterSalikSettingsController.cs:20` |
| `DELETE /Media` | `Media.DeleteMedia` | A | `Media.DeleteMedia` | `Media.Unreviewed.DeleteMedia` | `Controller/MediaController.cs:38` |
| `POST /Media` | `Media.UploadMedia` | A | `Media.UploadMedia` | `Media.Unreviewed.UploadMedia` | `Controller/MediaController.cs:20` |
| `GET /messageLogs` | `MessageLogs.GetAsync` | A | `MessageLogs.Get` | `MessageLogs.Unreviewed.Get` | `Controller/MessageLogsController.cs:18` |
| `POST /MockData/Generate` | `MockData.Generate` | A | `MockData.Generate` | `MockData.Unreviewed.Generate` | `Controller/MockDataController.cs:23` |
| `GET /MockData/Settings` | `MockData.GetSettings` | A | `MockData.GetSettings` | `MockData.Unreviewed.GetSettings` | `Controller/MockDataController.cs:15` |
| `PUT /MockData/Settings` | `MockData.SaveSettings` | A | `MockData.SaveSettings` | `MockData.Unreviewed.SaveSettings` | `Controller/MockDataController.cs:19` |
| `POST /MonthClose/CloseMonth/{id}` | `MonthClose.CloseMonthAsync` | A | `MonthClose.CloseMonth` | `MonthClose.Unreviewed.CloseMonth` | `Controller/MonthCloseController.cs:46` |
| `GET /MonthClose/GetByFiscalYear/{fiscalYearId}` | `MonthClose.GetByFiscalYearAsync` | A | `MonthClose.GetByFiscalYear` | `MonthClose.Unreviewed.GetByFiscalYear` | `Controller/MonthCloseController.cs:15` |
| `POST /MonthClose/ReopenMonth/{id}` | `MonthClose.ReopenMonthAsync` | A | `MonthClose.ReopenMonth` | `MonthClose.Unreviewed.ReopenMonth` | `Controller/MonthCloseController.cs:50` |
| `POST /MonthClose/ToggleStatus/{id}` | `MonthClose.ToggleStatusAsync` | A | `MonthClose.ToggleStatus` | `MonthClose.Unreviewed.ToggleStatus` | `Controller/MonthCloseController.cs:25` |
| `GET /MonthClose/VerifyDataInconsistency/{id}` | `MonthClose.VerifyDataInconsistencyAsync` | A | `MonthClose.VerifyDataInconsistency` | `MonthClose.Unreviewed.VerifyDataInconsistency` | `Controller/MonthCloseController.cs:42` |
| `GET /MonthClose/VerifyValidMonth/{id}` | `MonthClose.VerifyValidMonthAsync` | A | `MonthClose.VerifyValidMonth` | `MonthClose.Unreviewed.VerifyValidMonth` | `Controller/MonthCloseController.cs:34` |
| `GET /MonthClose/VerifyVoucherApprovals/{id}` | `MonthClose.VerifyVoucherApprovalsAsync` | A | `MonthClose.VerifyVoucherApprovals` | `MonthClose.Unreviewed.VerifyVoucherApprovals` | `Controller/MonthCloseController.cs:38` |
| `POST /MonthlyPosting/post` | `MonthlyPosting.PostAsync` | A | `MonthlyPosting.Post` | `MonthlyPosting.Unreviewed.Post` | `Controller/MonthlyPostingController.cs:20` |
| `GET /MonthlyPosting/prepare` | `MonthlyPosting.PrepareAsync` | A | `MonthlyPosting.Prepare` | `MonthlyPosting.Unreviewed.Prepare` | `Controller/MonthlyPostingController.cs:14` |
| `POST /NationalIdFormatSettingModel/AddList` | `NationalIdFormatSettingModel.AddList` | A | `NationalIdFormatSettingModel.AddList` | `NationalIdFormatSettingModel.Unreviewed.AddList` | `Controller/NationalIdFormatSettingModelController.cs:14` |
| `PUT /NationIDFormat/UpdateList` | `NationIDFormat.UpdateListAsync` | A | `NationIDFormat.UpdateList` | `NationIDFormat.Unreviewed.UpdateList` | `Controller/NationIDFormatController.cs:14` |
| `GET /NotificationsSettingsModel` | `NotificationsSettingsModel.Get` | A | `NotificationsSettingsModel.Get` | `NotificationsSettingsModel.Unreviewed.Get` | `Controller/NotificationsSettingsModelController.cs:20` |
| `POST /NotificationsSettingsModel` | `NotificationsSettingsModel.Update` | A | `NotificationsSettingsModel.Update` | `NotificationsSettingsModel.Unreviewed.Update` | `Controller/NotificationsSettingsModelController.cs:24` |
| `GET /NRM/{id:int}/movement-log-detail` | `NRM.GetMovementLogDetails` | A | `NRM.GetMovementLogDetails` | `NRM.Unreviewed.GetMovementLogDetails` | `Controller/NRMController.cs:15` |
| `POST /OpeningBalanceAccount/AddList` | `OpeningBalanceAccount.AddListAsync` | A | `OpeningBalanceAccount.AddList` | `OpeningBalanceAccount.Unreviewed.AddList` | `Controller/OpeningBalanceAccountController.cs:19` |
| `PUT /OpeningBalanceAccount/Edit` | `OpeningBalanceAccount.GetDriverTimeSheetsByAgreementAsync` | A | `OpeningBalanceAccount.GetDriverTimeSheetsByAgreement` | `OpeningBalanceAccount.Unreviewed.GetDriverTimeSheetsByAgreement` | `Controller/OpeningBalanceAccountController.cs:23` |
| `GET /OpeningBalanceBatch` | `OpeningBalanceBatch.GetAsync` | A | `OpeningBalanceBatch.Get` | `OpeningBalanceBatch.Unreviewed.Get` | `Controller/OpeningBalanceBatchController.cs:20` |
| `PUT /OpeningBalanceBatch` | `OpeningBalanceBatch.ConfigureAsync` | A | `OpeningBalanceBatch.Configure` | `OpeningBalanceBatch.Unreviewed.Configure` | `Controller/OpeningBalanceBatchController.cs:27` |
| `POST /OpeningBalanceCostCenter/AddList` | `OpeningBalanceCostCenter.AddList` | A | `OpeningBalanceCostCenter.AddList` | `OpeningBalanceCostCenter.Unreviewed.AddList` | `Controller/OpeningBalanceCostCenterController.cs:14` |
| `POST /OpeningBalanceCustomer/AddList` | `OpeningBalanceCustomer.AddListAsync` | A | `OpeningBalanceCustomer.AddList` | `OpeningBalanceCustomer.Unreviewed.AddList` | `Controller/OpeningBalanceCustomerController.cs:19` |
| `POST /OpeningBalanceDeposit/AddList` | `OpeningBalanceDeposit.AddListAsync` | A | `OpeningBalanceDeposit.AddList` | `OpeningBalanceDeposit.Unreviewed.AddList` | `Controller/OpeningBalanceDepositController.cs:18` |
| `POST /OpeningBalancePrepaid/AddList` | `OpeningBalancePrepaid.AddListAsync` | A | `OpeningBalancePrepaid.AddList` | `OpeningBalancePrepaid.Unreviewed.AddList` | `Controller/OpeningBalancePrepaidController.cs:18` |
| `POST /OpeningBalanceStaff/AddList` | `OpeningBalanceStaff.AddListAsync` | A | `OpeningBalanceStaff.AddList` | `OpeningBalanceStaff.Unreviewed.AddList` | `Controller/OpeningBalanceStaffController.cs:18` |
| `GET /OpeningBalanceState` | `OpeningBalanceState.GetAsync` | A | `OpeningBalanceState.Get` | `OpeningBalanceState.Unreviewed.Get` | `Controller/OpeningBalanceStateController.cs:19` |
| `POST /OpeningBalanceStock/AddList` | `OpeningBalanceStock.AddListAsync` | A | `OpeningBalanceStock.AddList` | `OpeningBalanceStock.Unreviewed.AddList` | `Controller/OpeningBalanceStockController.cs:20` |
| `PUT /OpeningBalanceStock/Edit` | `OpeningBalanceStock.GetDriverTimeSheetsByAgreementAsync` | A | `OpeningBalanceStock.GetDriverTimeSheetsByAgreement` | `OpeningBalanceStock.Unreviewed.GetDriverTimeSheetsByAgreement` | `Controller/OpeningBalanceStockController.cs:25` |
| `POST /OpeningBalanceSupplier/AddList` | `OpeningBalanceSupplier.AddListAsync` | A | `OpeningBalanceSupplier.AddList` | `OpeningBalanceSupplier.Unreviewed.AddList` | `Controller/OpeningBalanceSupplierController.cs:19` |
| `POST /Overtime/import` | `Overtime.ImportAsync` | A | `Overtime.Import` | `Overtime.Unreviewed.Import` | `Controller/OvertimeController.cs:23` |
| `POST /Overtime/process` | `Overtime.ProcessAsync` | A | `Overtime.Process` | `Overtime.Unreviewed.Process` | `Controller/OvertimeController.cs:19` |
| `GET /Overtime/process-runs` | `Overtime.GetProcessRunsAsync` | A | `Overtime.GetProcessRuns` | `Overtime.Unreviewed.GetProcessRuns` | `Controller/OvertimeController.cs:15` |
| `GET /Partner/GetCurrency/{id:int}` | `Partner.GetCurrencyAsync` | A | `Partner.GetCurrency` | `Partner.Unreviewed.GetCurrency` | `Controller/PartnerController.cs:13` |
| `POST /Payment/{id:int}/void` | `Payment.VoidAsync` | A | `Payment.Void` | `Payment.Unreviewed.Void` | `Controller/PaymentController.cs:31` |
| `GET /PaymentGateway/Mine` | `PaymentGateway.GetMineAsync` | A | `PaymentGateway.GetMine` | `PaymentGateway.Unreviewed.GetMine` | `Controller/SingleRowSettingsControllerBase.cs:25` |
| `PUT /PaymentGateway/Mine` | `PaymentGateway.SaveMineAsync` | A | `PaymentGateway.SaveMine` | `PaymentGateway.Unreviewed.SaveMine` | `Controller/SingleRowSettingsControllerBase.cs:29` |
| `GET /PaymentMethod/settings-options` | `PaymentMethod.GetSettingsOptionsAsync` | A | `PaymentMethod.GetSettingsOptions` | `PaymentMethod.Unreviewed.GetSettingsOptions` | `Controller/PaymentMethodController.cs:14` |
| `GET /PayrollRuns/{runId:int}/payments` | `PayrollDisbursement.Get` | A | `PayrollDisbursement.Get` | `PayrollDisbursement.Unreviewed.Get` | `Controller/PayrollDisbursementController.cs:16` |
| `POST /PayrollRuns/{runId:int}/payments` | `PayrollDisbursement.Pay` | A | `PayrollDisbursement.Pay` | `PayrollDisbursement.Unreviewed.Pay` | `Controller/PayrollDisbursementController.cs:20` |
| `POST /PayrollRuns/{runId:int}/payments/{paymentId:int}/void` | `PayrollDisbursement.Void` | A | `PayrollDisbursement.Void` | `PayrollDisbursement.Unreviewed.Void` | `Controller/PayrollDisbursementController.cs:24` |
| `GET /PayrollRuns` | `PayrollRuns.List` | A | `PayrollRuns.List` | `PayrollRuns.Unreviewed.List` | `Controller/PayrollRunsController.cs:16` |
| `POST /PayrollRuns` | `PayrollRuns.Save` | A | `PayrollRuns.Save` | `PayrollRuns.Unreviewed.Save` | `Controller/PayrollRunsController.cs:40` |
| `GET /PayrollRuns/{id:int}` | `PayrollRuns.Get` | A | `PayrollRuns.Get` | `PayrollRuns.Unreviewed.Get` | `Controller/PayrollRunsController.cs:44` |
| `GET /PayrollRuns/{id:int}/logs` | `PayrollRuns.Logs` | A | `PayrollRuns.Logs` | `PayrollRuns.Unreviewed.Logs` | `Controller/PayrollRunsController.cs:24` |
| `GET /PayrollRuns/{id:int}/revisions` | `PayrollRuns.Revisions` | A | `PayrollRuns.Revisions` | `PayrollRuns.Unreviewed.Revisions` | `Controller/PayrollRunsController.cs:48` |
| `GET /PayrollRuns/{id:int}/revisions/{revisionNumber:int}` | `PayrollRuns.Revision` | A | `PayrollRuns.Revision` | `PayrollRuns.Unreviewed.Revision` | `Controller/PayrollRunsController.cs:52` |
| `POST /PayrollRuns/calculate` | `PayrollRuns.Calculate` | A | `PayrollRuns.Calculate` | `PayrollRuns.Unreviewed.Calculate` | `Controller/PayrollRunsController.cs:28` |
| `GET /PayrollRuns/leave-salary-staff` | `PayrollRuns.LeaveSalaryStaff` | A | `PayrollRuns.LeaveSalaryStaff` | `PayrollRuns.Unreviewed.LeaveSalaryStaff` | `Controller/PayrollRunsController.cs:32` |
| `GET /PayrollRuns/settlement-staff` | `PayrollRuns.SettlementStaff` | A | `PayrollRuns.SettlementStaff` | `PayrollRuns.Unreviewed.SettlementStaff` | `Controller/PayrollRunsController.cs:36` |
| `GET /PayrollsReport` | `PayrollsReport.GetAsync` | A | `PayrollsReport.Get` | `PayrollsReport.Unreviewed.Get` | `Controller/PayrollsReportController.cs:19` |
| `GET /PaySlips` | `PaySlips.List` | A | `PaySlips.List` | `PaySlips.Unreviewed.List` | `Controller/PaySlipsController.cs:15` |
| `GET /PaySlips/{id:int}` | `PaySlips.Get` | A | `PaySlips.Get` | `PaySlips.Unreviewed.Get` | `Controller/PaySlipsController.cs:23` |
| `GET /PaySlips/staff` | `PaySlips.Staff` | A | `PaySlips.Staff` | `PaySlips.Unreviewed.Staff` | `Controller/PaySlipsController.cs:19` |
| `POST /PDCPayable/Cancel/{id}` | `PDCPayable.Cancel` | A | `PDCPayable.Cancel` | `PDCPayable.Unreviewed.Cancel` | `Controller/PDCPayableController.cs:37` |
| `GET /PDCPayable/GetDefaultBankAccountId/{id}` | `PDCPayable.GetDefaultBankAccountId` | A | `PDCPayable.GetDefaultBankAccountId` | `PDCPayable.Unreviewed.GetDefaultBankAccountId` | `Controller/PDCPayableController.cs:53` |
| `GET /PDCPayable/GetVoucherDetails/{id}` | `PDCPayable.GetVoucherDetails` | A | `PDCPayable.GetVoucherDetails` | `PDCPayable.Unreviewed.GetVoucherDetails` | `Controller/PDCPayableController.cs:47` |
| `POST /PDCPayable/Mature/{id}` | `PDCPayable.MatureSingle` | A | `PDCPayable.MatureSingle` | `PDCPayable.Unreviewed.MatureSingle` | `Controller/PDCPayableController.cs:15` |
| `POST /PDCPayable/MatureBulk` | `PDCPayable.MatureBulk` | A | `PDCPayable.MatureBulk` | `PDCPayable.Unreviewed.MatureBulk` | `Controller/PDCPayableController.cs:26` |
| `POST /PDCReceivable/Import` | `PDCReceivable.Import` | A | `PDCReceivable.Import` | `PDCReceivable.Unreviewed.Import` | `Controller/PDCReceivableController.cs:13` |
| `POST /PDCReceivable/Mature/{id}` | `PDCReceivable.MatureSingle` | A | `PDCReceivable.MatureSingle` | `PDCReceivable.Unreviewed.MatureSingle` | `Controller/PDCReceivableController.cs:23` |
| `POST /PDCReceivable/MatureBulk` | `PDCReceivable.MatureBulk` | A | `PDCReceivable.MatureBulk` | `PDCReceivable.Unreviewed.MatureBulk` | `Controller/PDCReceivableController.cs:45` |
| `POST /PDCReceivable/Resubmit/{id}` | `PDCReceivable.Resubmit` | A | `PDCReceivable.Resubmit` | `PDCReceivable.Unreviewed.Resubmit` | `Controller/PDCReceivableController.cs:34` |
| `POST /PDCReceivable/ReturnCheque/{id}` | `PDCReceivable.ReturnCheque` | A | `PDCReceivable.ReturnCheque` | `PDCReceivable.Unreviewed.ReturnCheque` | `Controller/PDCReceivableController.cs:56` |
| `GET /Provision/{id:int}/Transactions` | `Provision.GetTransactionsAsync` | A | `Provision.GetTransactions` | `Provision.Unreviewed.GetTransactions` | `Controller/ProvisionController.cs:14` |
| `PUT /PurchaseOrder/{id:int}/toggle-bill` | `PurchaseOrder.ToggleBillStatusAsync` | A | `PurchaseOrder.ToggleBillStatus` | `PurchaseOrder.Unreviewed.ToggleBillStatus` | `Controller/PurchaseOrderController.cs:62` |
| `POST /PurchaseOrder/search` | `PurchaseOrder.SearchAsync` | A | `PurchaseOrder.Search` | `PurchaseOrder.Unreviewed.Search` | `Controller/PurchaseOrderController.cs:36` |
| `POST /PurchaseReturn/{id:int}/goods-credit` | `PurchaseReturn.CreateGoodsCreditAsync` | A | `PurchaseReturn.CreateGoodsCredit` | `PurchaseReturn.Unreviewed.CreateGoodsCredit` | `Controller/PurchaseReturnController.cs:25` |
| `GET /PurchaseReturn/eligible-movements` | `PurchaseReturn.GetEligibleMovementsAsync` | A | `PurchaseReturn.GetEligibleMovements` | `PurchaseReturn.Unreviewed.GetEligibleMovements` | `Controller/PurchaseReturnController.cs:33` |
| `POST /PurchaseReturn/goods` | `PurchaseReturn.CreateGoodsAsync` | A | `PurchaseReturn.CreateGoods` | `PurchaseReturn.Unreviewed.CreateGoods` | `Controller/PurchaseReturnController.cs:19` |
| `GET /PurchaseReturn/goods-sources` | `PurchaseReturn.GoodsSourcesAsync` | A | `PurchaseReturn.GoodsSources` | `PurchaseReturn.Unreviewed.GoodsSources` | `Controller/PurchaseReturnController.cs:15` |
| `PUT /PurchaseReturn/goods/{id:int}` | `PurchaseReturn.UpdateGoodsAsync` | A | `PurchaseReturn.UpdateGoods` | `PurchaseReturn.Unreviewed.UpdateGoods` | `Controller/PurchaseReturnController.cs:22` |

### Proposed custom operations — Q-T (116)

| Verb/path | Controller.Method | Boundary | Proposed key | Current candidate | Source |
|---|---|---|---|---|---|
| `GET /Receipt/{id:int}/journal` | `Receipt.JournalAsync` | A | `Receipt.Journal` | `Receipt.Unreviewed.Journal` | `Controller/ReceiptController.cs:42` |
| `GET /Receipt/{id:int}/log` | `Receipt.LogAsync` | A | `Receipt.Log` | `Receipt.Unreviewed.Log` | `Controller/ReceiptController.cs:46` |
| `POST /Receipt/{id:int}/void` | `Receipt.VoidAsync` | A | `Receipt.Void` | `Receipt.Unreviewed.Void` | `Controller/ReceiptController.cs:38` |
| `GET /Receipt/GetAllocations/{customerId}` | `Receipt.GetAllocations` | A | `Receipt.GetAllocations` | `Receipt.Unreviewed.GetAllocations` | `Controller/ReceiptController.cs:61` |
| `GET /Receipt/parties` | `Receipt.PartiesAsync` | A | `Receipt.Parties` | `Receipt.Unreviewed.Parties` | `Controller/ReceiptController.cs:21` |
| `GET /Receipt/quotation-context/{id:int}` | `Receipt.QuotationContextAsync` | A | `Receipt.QuotationContext` | `Receipt.Unreviewed.QuotationContext` | `Controller/ReceiptController.cs:13` |
| `GET /Receipt/receivables` | `Receipt.ReceivablesAsync` | A | `Receipt.Receivables` | `Receipt.Unreviewed.Receivables` | `Controller/ReceiptController.cs:25` |
| `GET /Receipt/sales-agreement-context/{id:int}` | `Receipt.SalesAgreementContextAsync` | A | `Receipt.SalesAgreementContext` | `Receipt.Unreviewed.SalesAgreementContext` | `Controller/ReceiptController.cs:17` |
| `POST /Receipt/ToggleVoid/{id}` | `Receipt.ToggleVoidAsync` | A | `Receipt.ToggleVoid` | `Receipt.Unreviewed.ToggleVoid` | `Controller/ReceiptController.cs:74` |
| `GET /RentalAgreement/{id:int}/billing-history` | `RentalAgreement.GetBillingHistoryAsync` | A | `RentalAgreement.GetBillingHistory` | `RentalAgreement.Unreviewed.GetBillingHistory` | `Controller/RentalAgreementController.cs:81` |
| `POST /RentalAgreement/{id:int}/delivery-date` | `RentalAgreement.UpdateDeliveryDateAsync` | A | `RentalAgreement.UpdateDeliveryDate` | `RentalAgreement.Unreviewed.UpdateDeliveryDate` | `Controller/RentalAgreementController.cs:93` |
| `GET /RentalAgreement/{id:int}/delivery-date-context` | `RentalAgreement.GetDeliveryDateContextAsync` | A | `RentalAgreement.GetDeliveryDateContext` | `RentalAgreement.Unreviewed.GetDeliveryDateContext` | `Controller/RentalAgreementController.cs:87` |
| `POST /RentalAgreement/{id:int}/deposit` | `RentalAgreement.AddDepositAsync` | A | `RentalAgreement.AddDeposit` | `RentalAgreement.Unreviewed.AddDeposit` | `Controller/RentalAgreementController.cs:61` |
| `GET /RentalAgreement/{id:int}/discounts` | `RentalAgreement.GetDiscountsAsync` | A | `RentalAgreement.GetDiscounts` | `RentalAgreement.Unreviewed.GetDiscounts` | `Controller/RentalAgreementController.cs:55` |
| `GET /RentalAgreement/{id:int}/documents` | `RentalAgreement.GetDocumentsAsync` | A | `RentalAgreement.GetDocuments` | `RentalAgreement.Unreviewed.GetDocuments` | `Controller/RentalAgreementController.cs:49` |
| `POST /RentalAgreement/{id:int}/documents/{agreementDocumentId:int}` | `RentalAgreement.UploadDocumentAsync` | A | `RentalAgreement.UploadDocument` | `RentalAgreement.Unreviewed.UploadDocument` | `Controller/RentalAgreementController.cs:113` |
| `GET /RentalAgreement/{id:int}/logs` | `RentalAgreement.GetLogsAsync` | A | `RentalAgreement.GetLogs` | `RentalAgreement.Unreviewed.GetLogs` | `Controller/RentalAgreementController.cs:107` |
| `PUT /RentalAgreement/{id:int}/sales-person` | `RentalAgreement.UpdateSalesPersonAsync` | A | `RentalAgreement.UpdateSalesPerson` | `RentalAgreement.Unreviewed.UpdateSalesPerson` | `Controller/RentalAgreementController.cs:100` |
| `POST /RentalAgreement/{id:int}/unclose` | `RentalAgreement.UncloseAsync` | A | `RentalAgreement.Unclose` | `RentalAgreement.Unreviewed.Unclose` | `Controller/RentalAgreementController.cs:68` |
| `POST /RentalAgreement/{id:int}/void` | `RentalAgreement.VoidAsync` | A | `RentalAgreement.Void` | `RentalAgreement.Unreviewed.Void` | `Controller/RentalAgreementController.cs:74` |
| `GET /RentalAgreement/ForInvoicing` | `RentalAgreement.GetRentalAgreement` | A | `RentalAgreement.GetRentalAgreement` | `RentalAgreement.Unreviewed.GetRentalAgreement` | `Controller/RentalAgreementController.cs:42` |
| `GET /RentalAgreement/Projects` | `RentalAgreement.GetProjectsAsync` | A | `RentalAgreement.GetProjects` | `RentalAgreement.Unreviewed.GetProjects` | `Controller/RentalAgreementController.cs:23` |
| `GET /RentalAgreement/VehicleTypes` | `RentalAgreement.GetVehicleTypesAsync` | A | `RentalAgreement.GetVehicleTypes` | `RentalAgreement.Unreviewed.GetVehicleTypes` | `Controller/RentalAgreementController.cs:19` |
| `GET /RentalBillingCharge` | `RentalBillingCharge.GetAsync` | A | `RentalBillingCharge.Get` | `RentalBillingCharge.Unreviewed.Get` | `Controller/RentalBillingChargeController.cs:22` |
| `POST /RentalBillingCharge` | `RentalBillingCharge.AddAsync` | A | `RentalBillingCharge.Add` | `RentalBillingCharge.Unreviewed.Add` | `Controller/RentalBillingChargeController.cs:30` |
| `GET /RentalBillingCharge/Agreements` | `RentalBillingCharge.GetAgreementOptionsAsync` | A | `RentalBillingCharge.GetAgreementOptions` | `RentalBillingCharge.Unreviewed.GetAgreementOptions` | `Controller/RentalBillingChargeController.cs:15` |
| `GET /Invoice/Email/{invoiceId:int}` | `RentalInvoiceEmail.GetAsync` | A | `RentalInvoiceEmail.Get` | `RentalInvoiceEmail.Unreviewed.Get` | `Controller/RentalInvoiceEmailController.cs:10` |
| `POST /Invoice/Email/{invoiceId:int}/Send` | `RentalInvoiceEmail.SendAsync` | A | `RentalInvoiceEmail.Send` | `RentalInvoiceEmail.Unreviewed.Send` | `Controller/RentalInvoiceEmailController.cs:14` |
| `GET /RentalMasterAgreement/{id:int}/view` | `RentalMasterAgreement.GetViewAsync` | A | `RentalMasterAgreement.GetView` | `RentalMasterAgreement.Unreviewed.GetView` | `Controller/RentalMasterAgreementController.cs:25` |
| `GET /RentalPlanner` | `RentalPlanner.GetAsync` | A | `RentalPlanner.Get` | `RentalPlanner.Unreviewed.Get` | `Controller/RentalPlannerController.cs:20` |
| `GET /SaleOrder/equipment-rental` | `SaleOrder.EquipmentRentalOrders` | A | `SaleOrder.EquipmentRentalOrders` | `SaleOrder.Unreviewed.EquipmentRentalOrders` | `Controller/SaleOrderController.cs:15` |
| `POST /SaleOrder/equipment-rental` | `SaleOrder.CreateEquipmentRentalOrder` | A | `SaleOrder.CreateEquipmentRentalOrder` | `SaleOrder.Unreviewed.CreateEquipmentRentalOrder` | `Controller/SaleOrderController.cs:36` |
| `GET /SaleOrder/equipment-rental/{id:int}` | `SaleOrder.EquipmentRentalOrder` | A | `SaleOrder.EquipmentRentalOrder` | `SaleOrder.Unreviewed.EquipmentRentalOrder` | `Controller/SaleOrderController.cs:29` |
| `PUT /SaleOrder/equipment-rental/{id:int}` | `SaleOrder.UpdateEquipmentRentalOrder` | A | `SaleOrder.UpdateEquipmentRentalOrder` | `SaleOrder.Unreviewed.UpdateEquipmentRentalOrder` | `Controller/SaleOrderController.cs:43` |
| `POST /SaleOrder/equipment-rental/{id:int}/cancel-remainder` | `SaleOrder.CancelEquipmentRentalOrderRemainder` | A | `SaleOrder.CancelEquipmentRentalOrderRemainder` | `SaleOrder.Unreviewed.CancelEquipmentRentalOrderRemainder` | `Controller/SaleOrderController.cs:57` |
| `POST /SaleOrder/equipment-rental/{id:int}/confirm` | `SaleOrder.ConfirmEquipmentRentalOrder` | A | `SaleOrder.ConfirmEquipmentRentalOrder` | `SaleOrder.Unreviewed.ConfirmEquipmentRentalOrder` | `Controller/SaleOrderController.cs:50` |
| `GET /SaleOrder/equipment-rental/sources` | `SaleOrder.EquipmentRentalSources` | A | `SaleOrder.EquipmentRentalSources` | `SaleOrder.Unreviewed.EquipmentRentalSources` | `Controller/SaleOrderController.cs:22` |
| `POST /SaleOrder/search` | `SaleOrder.SearchAsync` | A | `SaleOrder.Search` | `SaleOrder.Unreviewed.Search` | `Controller/SaleOrderController.cs:64` |
| `POST /SalesAgreement/{id:int}/cancel` | `SalesAgreement.CancelAsync` | A | `SalesAgreement.Cancel` | `SalesAgreement.Unreviewed.Cancel` | `Controller/SalesAgreementController.cs:43` |
| `POST /SalesAgreement/{id:int}/close` | `SalesAgreement.CloseAsync` | A | `SalesAgreement.Close` | `SalesAgreement.Unreviewed.Close` | `Controller/SalesAgreementController.cs:39` |
| `POST /SalesAgreement/{id:int}/deliver` | `SalesAgreement.DeliverAsync` | A | `SalesAgreement.Deliver` | `SalesAgreement.Unreviewed.Deliver` | `Controller/SalesAgreementController.cs:32` |
| `POST /SalesAgreement/{id:int}/invoice` | `SalesAgreement.InvoiceAsync` | A | `SalesAgreement.Invoice` | `SalesAgreement.Unreviewed.Invoice` | `Controller/SalesAgreementController.cs:25` |
| `GET /SalesAgreement/available-units` | `SalesAgreement.GetAvailableUnitsAsync` | A | `SalesAgreement.GetAvailableUnits` | `SalesAgreement.Unreviewed.GetAvailableUnits` | `Controller/SalesAgreementController.cs:15` |
| `GET /SalesAgreement/due-installments` | `SalesAgreement.GetDueInstallmentsAsync` | A | `SalesAgreement.GetDueInstallments` | `SalesAgreement.Unreviewed.GetDueInstallments` | `Controller/SalesAgreementController.cs:19` |
| `POST /SalesQuotation/{id:int}/generate-down-payment-receipt` | `SalesQuotation.GenerateDownPaymentReceiptAsync` | A | `SalesQuotation.GenerateDownPaymentReceipt` | `SalesQuotation.Unreviewed.GenerateDownPaymentReceipt` | `Controller/SalesQuotationController.cs:47` |
| `GET /SalesReports/SaleReportBaseOnInvoice` | `SalesReports.SaleReportBaseOnInvoice` | A | `SalesReports.SaleReportBaseOnInvoice` | `SalesReports.Unreviewed.SaleReportBaseOnInvoice` | `Controller/SalesReportsController.cs:46` |
| `GET /SalesReports/SalespersonDiscountReport` | `SalesReports.SalespersonDiscountReport` | A | `SalesReports.SalespersonDiscountReport` | `SalesReports.Unreviewed.SalespersonDiscountReport` | `Controller/SalesReportsController.cs:90` |
| `GET /SalesReports/SalesPersonInvoicesReport` | `SalesReports.SalesPersonInvoicesReport` | A | `SalesReports.SalesPersonInvoicesReport` | `SalesReports.Unreviewed.SalesPersonInvoicesReport` | `Controller/SalesReportsController.cs:68` |
| `GET /SalesReports/SalesReport` | `SalesReports.SalesReport` | A | `SalesReports.SalesReport` | `SalesReports.Unreviewed.SalesReport` | `Controller/SalesReportsController.cs:24` |
| `GET /SalesReports/SalesReportExport` | `SalesReports.SalesReportExport` | A | `SalesReports.SalesReportExport` | `SalesReports.Unreviewed.SalesReportExport` | `Controller/SalesReportsController.cs:112` |
| `POST /SeedData/CreateDefaultAccountTree` | `SeedData.CreateDefault` | A | `SeedData.CreateDefault` | `SeedData.Unreviewed.CreateDefault` | `Controller/SeedDataController.cs:22` |
| `GET /ServiceLog` | `ServiceLog.SearchAsync` | A | `ServiceLog.Search` | `ServiceLog.Unreviewed.Search` | `Controller/ServiceLogController.cs:21` |
| `POST /ServiceLog` | `ServiceLog.AddAsync` | A | `ServiceLog.Add` | `ServiceLog.Unreviewed.Add` | `Controller/ServiceLogController.cs:38` |
| `GET /ServiceLog/GetAllWithNavigations` | `ServiceLog.GetAllWithNavigationsAsync` | A | `ServiceLog.GetAllWithNavigations` | `ServiceLog.Unreviewed.GetAllWithNavigations` | `Controller/ServiceLogController.cs:27` |
| `GET /SettingsCommonModel/GetMySetting` | `SettingsCommonModel.GetMySettingAsync` | A | `SettingsCommonModel.GetMySetting` | `SettingsCommonModel.Unreviewed.GetMySetting` | `Controller/SettingsCommonModelController.cs:14` |
| `GET /SettingsDocumentNumberModel/GetSettings` | `SettingsDocumentNumberModel.GetSettings` | A | `SettingsDocumentNumberModel.GetSettings` | `SettingsDocumentNumberModel.Unreviewed.GetSettings` | `Controller/SettingsDocumentNumberModelController.cs:14` |
| `POST /SettingsEmailSmtpModel/SendTestEmail` | `SettingsEmailSmtpModel.SendTestEmail` | A | `SettingsEmailSmtpModel.SendTestEmail` | `SettingsEmailSmtpModel.Unreviewed.SendTestEmail` | `Controller/SettingsEmailSmtpModelController.cs:14` |
| `GET /SettingsFormsAndFieldsModel/GetByType/{id}` | `SettingsFormsAndFieldsModel.GetByType` | A | `SettingsFormsAndFieldsModel.GetByType` | `SettingsFormsAndFieldsModel.Unreviewed.GetByType` | `Controller/SettingsFormsAndFieldsModelController.cs:18` |
| `GET /Staff/{staffId:int}/SalaryPackage` | `Staff.GetSalaryRevision` | A | `Staff.GetSalaryRevision` | `Staff.Unreviewed.GetSalaryRevision` | `Controller/StaffController.cs:154` |
| `PUT /Staff/{staffId:int}/SalaryPackage` | `Staff.ReviseSalary` | A | `Staff.ReviseSalary` | `Staff.Unreviewed.ReviseSalary` | `Controller/StaffController.cs:142` |
| `GET /Staff/Alerts` | `Staff.Alerts` | A | `Staff.Alerts` | `Staff.Unreviewed.Alerts` | `Controller/StaffController.cs:19` |
| `GET /Staff/BalancesSummary` | `Staff.GetStaffBalancesSummary` | A | `Staff.GetStaffBalancesSummary` | `Staff.Unreviewed.GetStaffBalancesSummary` | `Controller/StaffController.cs:83` |
| `GET /Staff/DutySchedule` | `Staff.GetStaffDutySchedule` | A | `Staff.GetStaffDutySchedule` | `Staff.Unreviewed.GetStaffDutySchedule` | `Controller/StaffController.cs:95` |
| `POST /Staff/DutySchedule` | `Staff.SaveStaffDutySchedule` | A | `Staff.SaveStaffDutySchedule` | `Staff.Unreviewed.SaveStaffDutySchedule` | `Controller/StaffController.cs:107` |
| `GET /Staff/Overtime` | `Staff.GetStaffOvertimeData` | A | `Staff.GetStaffOvertimeData` | `Staff.Unreviewed.GetStaffOvertimeData` | `Controller/StaffController.cs:119` |
| `POST /Staff/Overtime` | `Staff.SaveStaffOvertime` | A | `Staff.SaveStaffOvertime` | `Staff.Unreviewed.SaveStaffOvertime` | `Controller/StaffController.cs:131` |
| `GET /Staff/Statement` | `Staff.GetStaffStatement` | A | `Staff.GetStaffStatement` | `Staff.Unreviewed.GetStaffStatement` | `Controller/StaffController.cs:31` |
| `GET /Staff/Statement/Allocation` | `Staff.GetStaffStatementAllocation` | A | `Staff.GetStaffStatementAllocation` | `Staff.Unreviewed.GetStaffStatementAllocation` | `Controller/StaffController.cs:55` |
| `POST /Staff/Statement/Allocation` | `Staff.AllocateStaffStatement` | A | `Staff.AllocateStaffStatement` | `Staff.Unreviewed.AllocateStaffStatement` | `Controller/StaffController.cs:69` |
| `GET /Staff/Statement/SubLedgers` | `Staff.GetStaffStatementSubLedgers` | A | `Staff.GetStaffStatementSubLedgers` | `Staff.Unreviewed.GetStaffStatementSubLedgers` | `Controller/StaffController.cs:42` |
| `GET /StockReports/GetDetailedStockReport` | `StockReports.GetDetailedStockReport` | A | `StockReports.GetDetailedStockReport` | `StockReports.Unreviewed.GetDetailedStockReport` | `Controller/StockReportsController.cs:49` |
| `GET /StockReports/GetGrnPendingReport` | `StockReports.GetGrnPendingReport` | A | `StockReports.GetGrnPendingReport` | `StockReports.Unreviewed.GetGrnPendingReport` | `Controller/StockReportsController.cs:79` |
| `GET /StockReports/GetItemsIssueReport` | `StockReports.GetItemsIssueReport` | A | `StockReports.GetItemsIssueReport` | `StockReports.Unreviewed.GetItemsIssueReport` | `Controller/StockReportsController.cs:59` |
| `GET /StockReports/GetItemsReturnReport` | `StockReports.GetItemsReturnReport` | A | `StockReports.GetItemsReturnReport` | `StockReports.Unreviewed.GetItemsReturnReport` | `Controller/StockReportsController.cs:69` |
| `GET /StockReports/GetPartsMovingReport` | `StockReports.GetPartsMovingReport` | A | `StockReports.GetPartsMovingReport` | `StockReports.Unreviewed.GetPartsMovingReport` | `Controller/StockReportsController.cs:89` |
| `GET /StockReports/GetPurchaseOrdersDetail` | `StockReports.GetPurchaseOrdersDetail` | A | `StockReports.GetPurchaseOrdersDetail` | `StockReports.Unreviewed.GetPurchaseOrdersDetail` | `Controller/StockReportsController.cs:29` |
| `GET /StockReports/GetPurchasesDetailReport` | `StockReports.GetPurchasesDetailReport` | A | `StockReports.GetPurchasesDetailReport` | `StockReports.Unreviewed.GetPurchasesDetailReport` | `Controller/StockReportsController.cs:39` |
| `GET /StockReports/GetStockSummary` | `StockReports.GetStockSummary` | A | `StockReports.GetStockSummary` | `StockReports.Unreviewed.GetStockSummary` | `Controller/StockReportsController.cs:19` |
| `GET /Supplier/BalancesSummary` | `Supplier.GetSupplierBalancesSummary` | A | `Supplier.GetSupplierBalancesSummary` | `Supplier.Unreviewed.GetSupplierBalancesSummary` | `Controller/SupplierController.cs:29` |
| `GET /Supplier/PayableAgeAnalysis` | `Supplier.GetPayableAgeAnalysis` | A | `Supplier.GetPayableAgeAnalysis` | `Supplier.Unreviewed.GetPayableAgeAnalysis` | `Controller/SupplierController.cs:41` |
| `GET /Supplier/Statement` | `Supplier.GetSupplierStatement` | A | `Supplier.GetSupplierStatement` | `Supplier.Unreviewed.GetSupplierStatement` | `Controller/SupplierController.cs:17` |
| `GET /Supplier/TaxRate/{id:int}` | `Supplier.GetTaxRate` | A | `Supplier.GetTaxRate` | `Supplier.Unreviewed.GetTaxRate` | `Controller/SupplierController.cs:53` |
| `POST /SupportRequest/{id:int}/Close` | `SupportRequest.CloseAsync` | A | `SupportRequest.Close` | `SupportRequest.Unreviewed.Close` | `Controller/SupportRequestController.cs:93` |
| `POST /SupportRequest/Create` | `SupportRequest.CreateAsync` | A | `SupportRequest.Create` | `SupportRequest.Unreviewed.Create` | `Controller/SupportRequestController.cs:35` |
| `GET /SupportSlaAgreement/Available` | `SupportSlaAgreement.AvailableAsync` | A | `SupportSlaAgreement.Available` | `SupportSlaAgreement.Unreviewed.Available` | `Controller/SupportSlaAgreementController.cs:14` |
| `GET /Tariff/GetBookingCharges` | `Tariff.GetBookingChargesAsync` | A | `Tariff.GetBookingCharges` | `Tariff.Unreviewed.GetBookingCharges` | `Controller/TariffController.cs:33` |
| `GET /Tariff/GetEditor` | `Tariff.GetEditorAsync` | A | `Tariff.GetEditor` | `Tariff.Unreviewed.GetEditor` | `Controller/TariffController.cs:21` |
| `GET /Tariff/GetTariffByVehicleTypeId/{id:int}` | `Tariff.GetTariffByVehicleTypeIdAsync` | A | `Tariff.GetTariffByVehicleTypeId` | `Tariff.Unreviewed.GetTariffByVehicleTypeId` | `Controller/TariffController.cs:15` |
| `GET /TariffCard/GetEditorOptions` | `TariffCard.GetEditorOptionsAsync` | A | `TariffCard.GetEditorOptions` | `TariffCard.Unreviewed.GetEditorOptions` | `Controller/TariffCardController.cs:13` |
| `GET /TariffSetting` | `TariffSetting.GetAsync` | A | `TariffSetting.Get` | `TariffSetting.Unreviewed.Get` | `Controller/TariffSettingController.cs:20` |
| `PUT /TariffSetting/TariffSettingList` | `TariffSetting.UpdateAsync` | A | `TariffSetting.Update` | `TariffSetting.Unreviewed.Update` | `Controller/TariffSettingController.cs:24` |
| `POST /TimeSheet/batch` | `TimeSheet.SaveBatch` | A | `TimeSheet.SaveBatch` | `TimeSheet.Unreviewed.SaveBatch` | `Controller/TimeSheetController.cs:9` |
| `POST /TrafficFine/search` | `TrafficFine.SearchAsync` | A | `TrafficFine.Search` | `TrafficFine.Unreviewed.Search` | `Controller/TrafficFineController.cs:20` |
| `GET /TrafficFine/vehicle-context/{vehicleId:int}` | `TrafficFine.GetVehicleContextAsync` | A | `TrafficFine.GetVehicleContext` | `TrafficFine.Unreviewed.GetVehicleContext` | `Controller/TrafficFineController.cs:28` |
| `GET /TransportationAgreement/Agreement/Items` | `TransportationAgreement.GetAllItemsInTheAgreement` | A | `TransportationAgreement.GetAllItemsInTheAgreement` | `TransportationAgreement.Unreviewed.GetAllItemsInTheAgreement` | `Controller/TransportationAgreementController.cs:66` |
| `POST /TransportationAgreement/CloseAgreement` | `TransportationAgreement.CloseAgreementAsync` | A | `TransportationAgreement.CloseAgreement` | `TransportationAgreement.Unreviewed.CloseAgreement` | `Controller/TransportationAgreementController.cs:16` |
| `GET /TransportationAgreement/Trips` | `TransportationAgreement.GetAllTrips` | A | `TransportationAgreement.GetAllTrips` | `TransportationAgreement.Unreviewed.GetAllTrips` | `Controller/TransportationAgreementController.cs:20` |
| `GET /TransportationAgreement/TripSheetExtra` | `TransportationAgreement.GetExtraTrips` | A | `TransportationAgreement.GetExtraTrips` | `TransportationAgreement.Unreviewed.GetExtraTrips` | `Controller/TransportationAgreementController.cs:41` |
| `POST /TransportationAgreement/TripSheetExtra` | `TransportationAgreement.AddExtraTrip` | A | `TransportationAgreement.AddExtraTrip` | `TransportationAgreement.Unreviewed.AddExtraTrip` | `Controller/TransportationAgreementController.cs:51` |
| `DELETE /TransportationAgreement/TripSheetExtra/{id}` | `TransportationAgreement.DeleteExtraTrip` | A | `TransportationAgreement.DeleteExtraTrip` | `TransportationAgreement.Unreviewed.DeleteExtraTrip` | `Controller/TransportationAgreementController.cs:58` |
| `GET /TransportationAgreement/TripSheetScheduled` | `TransportationAgreement.GetScheduledTrips` | A | `TransportationAgreement.GetScheduledTrips` | `TransportationAgreement.Unreviewed.GetScheduledTrips` | `Controller/TransportationAgreementController.cs:31` |
| `POST /TransportationInvoice/AddList` | `TransportationInvoice.CreateTrasportationInvoice` | A | `TransportationInvoice.CreateTrasportationInvoice` | `TransportationInvoice.Unreviewed.CreateTrasportationInvoice` | `Controller/TransportationInvoiceController.cs:14` |
| `POST /TripBooking/Assign/{id}` | `TripBooking.AssignAsync` | A | `TripBooking.Assign` | `TripBooking.Unreviewed.Assign` | `Controller/TripBookingController.cs:51` |
| `GET /TripBooking/AvailableResources/{id}` | `TripBooking.GetAvailableResourcesAsync` | A | `TripBooking.GetAvailableResources` | `TripBooking.Unreviewed.GetAvailableResources` | `Controller/TripBookingController.cs:128` |
| `POST /TripBooking/Cancel/{id}` | `TripBooking.CancelAsync` | A | `TripBooking.Cancel` | `TripBooking.Unreviewed.Cancel` | `Controller/TripBookingController.cs:111` |
| `GET /TripBooking/ChauffeurForcedAllocationsReport` | `TripBooking.GetChauffeurForcedAllocationsReportAsync` | A | `TripBooking.GetChauffeurForcedAllocationsReport` | `TripBooking.Unreviewed.GetChauffeurForcedAllocationsReport` | `Controller/TripBookingController.cs:42` |
| `POST /TripBooking/Dispatch/{id}` | `TripBooking.DispatchAsync` | A | `TripBooking.Dispatch` | `TripBooking.Unreviewed.Dispatch` | `Controller/TripBookingController.cs:63` |
| `POST /TripBooking/Finish/{id}` | `TripBooking.FinishAsync` | A | `TripBooking.Finish` | `TripBooking.Unreviewed.Finish` | `Controller/TripBookingController.cs:87` |
| `GET /TripBooking/ForLimoInvoices` | `TripBooking.GetTripBookingsForInvoicingAsync` | A | `TripBooking.GetTripBookingsForInvoicing` | `TripBooking.Unreviewed.GetTripBookingsForInvoicing` | `Controller/TripBookingController.cs:16` |
| `GET /TripBooking/History/{id}` | `TripBooking.GetHistoryAsync` | A | `TripBooking.GetHistory` | `TripBooking.Unreviewed.GetHistory` | `Controller/TripBookingController.cs:123` |
| `POST /TripBooking/NoShow/{id}` | `TripBooking.MarkNoShowAsync` | A | `TripBooking.MarkNoShow` | `TripBooking.Unreviewed.MarkNoShow` | `Controller/TripBookingController.cs:99` |
| `POST /TripBooking/Start/{id}` | `TripBooking.StartAsync` | A | `TripBooking.Start` | `TripBooking.Unreviewed.Start` | `Controller/TripBookingController.cs:75` |
| `GET /TripBooking/UtilizationReport` | `TripBooking.GetUtilizationReportAsync` | A | `TripBooking.GetUtilizationReport` | `TripBooking.Unreviewed.GetUtilizationReport` | `Controller/TripBookingController.cs:24` |
| `GET /TripBooking/UtilizationReportPage` | `TripBooking.GetUtilizationReportPageAsync` | A | `TripBooking.GetUtilizationReportPage` | `TripBooking.Unreviewed.GetUtilizationReportPage` | `Controller/TripBookingController.cs:33` |
| `GET /TripType/{tripTypeId:int}/TariffSettings` | `TripType.GetTariffSettingsAsync` | A | `TripType.GetTariffSettings` | `TripType.Unreviewed.GetTariffSettings` | `Controller/TripTypeController.cs:14` |
| `PUT /TripType/{tripTypeId:int}/TariffSettings` | `TripType.UpdateTariffSettingsAsync` | A | `TripType.UpdateTariffSettings` | `TripType.Unreviewed.UpdateTariffSettings` | `Controller/TripTypeController.cs:20` |

### Proposed custom operations — U-Z (30)

| Verb/path | Controller.Method | Boundary | Proposed key | Current candidate | Source |
|---|---|---|---|---|---|
| `POST /User/{id:int}/provision-identity` | `User.ProvisionIdentity` | TA | `User.ProvisionIdentity` | `User.Unreviewed.ProvisionIdentity` | `Controller/UserController.cs:15` |
| `GET /Vehicle/{id:int}/agreements` | `Vehicle.GetAgreementHistory` | A | `Vehicle.GetAgreementHistory` | `Vehicle.Unreviewed.GetAgreementHistory` | `Controller/VehicleController.cs:17` |
| `GET /Vehicle/{id:int}/status-detail` | `Vehicle.GetStatusDetail` | A | `Vehicle.GetStatusDetail` | `Vehicle.Unreviewed.GetStatusDetail` | `Controller/VehicleController.cs:21` |
| `GET /Vehicle/Search` | `Vehicle.Search` | A | `Vehicle.Search` | `Vehicle.Unreviewed.Search` | `Controller/VehicleController.cs:13` |
| `GET /VehicleQRLabel/FilterOptions` | `VehicleQRLabel.GetFilterOptionsAsync` | A | `VehicleQRLabel.GetFilterOptions` | `VehicleQRLabel.Unreviewed.GetFilterOptions` | `Controller/VehicleQRLabelController.cs:21` |
| `GET /VehicleQRLabel/Generate` | `VehicleQRLabel.GenerateAsync` | A | `VehicleQRLabel.Generate` | `VehicleQRLabel.Unreviewed.Generate` | `Controller/VehicleQRLabelController.cs:15` |
| `GET /VehicleReports/VehiclePriceBasedOnTariffGroup` | `VehicleReports.VehiclePriceBasedOnTariffGroup` | A | `VehicleReports.VehiclePriceBasedOnTariffGroup` | `VehicleReports.Unreviewed.VehiclePriceBasedOnTariffGroup` | `Controller/VehicleReportsController.cs:63` |
| `GET /VehicleReports/VehicleProfitAndLoss` | `VehicleReports.VehicleProfitAndLoss` | A | `VehicleReports.VehicleProfitAndLoss` | `VehicleReports.Unreviewed.VehicleProfitAndLoss` | `Controller/VehicleReportsController.cs:34` |
| `GET /VehicleReports/VehicleProfitAndLossDetail` | `VehicleReports.VehicleProfitAndLossDetail` | A | `VehicleReports.VehicleProfitAndLossDetail` | `VehicleReports.Unreviewed.VehicleProfitAndLossDetail` | `Controller/VehicleReportsController.cs:44` |
| `GET /VehicleReports/VehicleProfitAndLossWithSellingDetail` | `VehicleReports.VehicleProfitAndLossWithSellingDetail` | A | `VehicleReports.VehicleProfitAndLossWithSellingDetail` | `VehicleReports.Unreviewed.VehicleProfitAndLossWithSellingDetail` | `Controller/VehicleReportsController.cs:54` |
| `GET /VehicleReports/VehicleRentalDetails` | `VehicleReports.CreateVehicleRentalDetailsReport` | A | `VehicleReports.CreateVehicleRentalDetailsReport` | `VehicleReports.Unreviewed.CreateVehicleRentalDetailsReport` | `Controller/VehicleReportsController.cs:24` |
| `GET /VehicleReports/VehiclesProfitAndLoseByChassisNo` | `VehicleReports.VehiclesProfitAndLoseByChassisNo` | A | `VehicleReports.VehiclesProfitAndLoseByChassisNo` | `VehicleReports.Unreviewed.VehiclesProfitAndLoseByChassisNo` | `Controller/VehicleReportsController.cs:81` |
| `GET /VehicleReports/VehiclesRevenue` | `VehicleReports.VehiclesRevenue` | A | `VehicleReports.VehiclesRevenue` | `VehicleReports.Unreviewed.VehiclesRevenue` | `Controller/VehicleReportsController.cs:72` |
| `PATCH /VehicleServiceBooking/{id:int}/Close` | `VehicleServiceBooking.CloseAsync` | A | `VehicleServiceBooking.Close` | `VehicleServiceBooking.Unreviewed.Close` | `Controller/VehicleServiceBookingController.cs:37` |
| `PATCH /VehicleServiceBooking/{id:int}/Confirm` | `VehicleServiceBooking.ConfirmAsync` | A | `VehicleServiceBooking.Confirm` | `VehicleServiceBooking.Unreviewed.Confirm` | `Controller/VehicleServiceBookingController.cs:33` |
| `GET /VehicleServiceBooking/{id:int}/History` | `VehicleServiceBooking.HistoryAsync` | A | `VehicleServiceBooking.History` | `VehicleServiceBooking.Unreviewed.History` | `Controller/VehicleServiceBookingController.cs:29` |
| `GET /VehicleServiceBooking/AgreementOptions` | `VehicleServiceBooking.AgreementOptionsAsync` | A | `VehicleServiceBooking.AgreementOptions` | `VehicleServiceBooking.Unreviewed.AgreementOptions` | `Controller/VehicleServiceBookingController.cs:25` |
| `GET /VehicleServiceBooking/Export` | `VehicleServiceBooking.ExportAsync` | A | `VehicleServiceBooking.Export` | `VehicleServiceBooking.Unreviewed.Export` | `Controller/VehicleServiceBookingController.cs:15` |
| `GET /VehicleStatusCorrection/CurrentStatus/{vehicleId:int}` | `VehicleStatusCorrection.GetCurrentStatus` | A | `VehicleStatusCorrection.GetCurrentStatus` | `VehicleStatusCorrection.Unreviewed.GetCurrentStatus` | `Controller/VehicleStatusCorrectionController.cs:27` |
| `GET /VehicleStatusCorrection/GetVehiclesPlatNo` | `VehicleStatusCorrection.GetVehiclesDropdown` | A | `VehicleStatusCorrection.GetVehiclesDropdown` | `VehicleStatusCorrection.Unreviewed.GetVehiclesDropdown` | `Controller/VehicleStatusCorrectionController.cs:20` |
| `POST /VehicleStatusCorrection/Update` | `VehicleStatusCorrection.Update` | A | `VehicleStatusCorrection.Update` | `VehicleStatusCorrection.Unreviewed.Update` | `Controller/VehicleStatusCorrectionController.cs:34` |
| `GET /VehicleType/GetGroups` | `VehicleType.GetGroupsAsync` | A | `VehicleType.GetGroups` | `VehicleType.Unreviewed.GetGroups` | `Controller/VehicleTypeController.cs:13` |
| `PUT /VehicleType/UpdateGroupNo` | `VehicleType.UpdateGroupNoAsync` | A | `VehicleType.UpdateGroupNo` | `VehicleType.Unreviewed.UpdateGroupNo` | `Controller/VehicleTypeController.cs:17` |
| `POST /WorkOrder/{id:int}/accept` | `WorkOrder.Accept` | A | `WorkOrder.Accept` | `WorkOrder.Unreviewed.Accept` | `Controller/WorkOrderController.cs:18` |
| `POST /WorkOrder/{id:int}/reject` | `WorkOrder.Reject` | A | `WorkOrder.Reject` | `WorkOrder.Unreviewed.Reject` | `Controller/WorkOrderController.cs:22` |
| `GET /WorkOrder/options` | `WorkOrder.Options` | A | `WorkOrder.Options` | `WorkOrder.Unreviewed.Options` | `Controller/WorkOrderController.cs:14` |
| `POST /Workshop/vehicles` | `Workshop.SearchVehicles` | A | `Workshop.SearchVehicles` | `Workshop.Unreviewed.SearchVehicles` | `Controller/WorkshopController.cs:19` |
| `GET /Workshop/vehicles/{id:int}` | `Workshop.GetVehicleDetails` | A | `Workshop.GetVehicleDetails` | `Workshop.Unreviewed.GetVehicleDetails` | `Controller/WorkshopController.cs:15` |
| `GET /WorkshopSetting/Mine` | `WorkshopSetting.GetMineAsync` | A | `WorkshopSetting.GetMine` | `WorkshopSetting.Unreviewed.GetMine` | `Controller/SingleRowSettingsControllerBase.cs:25` |
| `PUT /WorkshopSetting/Mine` | `WorkshopSetting.SaveMineAsync` | A | `WorkshopSetting.SaveMine` | `WorkshopSetting.Unreviewed.SaveMine` | `Controller/SingleRowSettingsControllerBase.cs:29` |

