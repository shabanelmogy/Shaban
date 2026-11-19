| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-16 |
| Scope | Role/user permission configuration only; source implementation authorized |
| Owner evidence | «تمام طبق التنفيذ» followed by «اجل الجزء ده الوقتى» for identity/login/tenant integration |

# Configuration implementation handoff

This isolates the confirmed configuration slice from the Blocked identity design. Identity login, issuer claims, token validation, subscription linkage/lifecycle, personal sessions, bootstrap, authentication credentials and enforcement on ERP operations remain deferred. No claim that saved configuration secures the application. The current authenticated tenant boundary is retained unchanged; it does not establish a new per-user tenant-administrator authorization policy. Only the existing tenant-admin login is confirmed by the owner. Per-user administrative enforcement must ship with the deferred identity work before production authorization activation.

## Contract

- Multiple roles plus multiple direct grants; union, no Deny. Do not activate automatic IsDefault assignment.
- Role header expands its entities, entity header expands operation checkboxes, selection is separate from disclosure, partial selection is indeterminate. Several sections may stay open.
- All saved IDs are int; permission keys are stable strings from a server-owned catalogue, unknown/unreviewed keys rejected. Frontend never sends SubscriptionId/audit/secret fields in access requests.
- Catalogue reflects actual generic controller operations: List/Detail/Deep -> View, Add -> Create, Update -> Update, Delete -> Delete, GetSelect -> Lookup, CheckUnique -> Validate. Existing custom operations appear as unreviewed candidates unless explicitly classified; candidates cannot be granted. PurchaseRequest.Search is explicitly View. Activation is a candidate unless reviewed for its resource.
- Catalogue resource identifier is the existing API controller route owner, with explicit PurchaseRequest -> PurchaseRequests alias. It is not inferred from a database table or tenant input. Aliases of an operation share the key. This classification configures grants only, not enforcement.
- Configuration APIs use existing [Authorize] plus current repository tenant/soft-delete guards. Do not interpret localStorage or introduce an unverified actor/admin bypass. Do not modify Security, SubscriptionAPI, token extraction, AuthService or login routes in this slice.
- All new persisted rows carry the existing SubscriptionId. FK pairs include it and Restrict deletion. Preserve User.Roles legacy navigation/relationship; add an explicit UserRoleAssignment for the new configuration, do not infer or migrate the old relationship. Old grants are not activated or copied automatically.
- Extend Permission with nullable Key (legacy rows retained); extend RolePermission with nullable RoleId/PermissionId (legacy Module/Action/Label retained). New rows have both relation IDs and canonical metadata. Only well-formed known links participate.
- Role has AccessVersion Guid concurrency token. User access uses a separate UserAccessRevision (one per tenant/user, Guid version concurrency token), avoiding changes to the existing generic User writer. First absent user revision is Guid.Empty.
- One save/implicit EF transaction per role or user access command; validate every reference and entire snapshot before mutation. Expected version mismatch or competing first insert -> 409; unknown keys ->400; foreign/missing target ->404; absent tenant/auth ->401. No partial subset save.
- Role deletion must reject live new user-role assignments as well as existing source references. No destructive changes to legacy data, migrations or snapshots.

## Wire contract — property names are lower camel case in JSON

All types live individually under `SiGma.ViewModels/ViewModels/Authorization/`, interfaces under Business/IServices/Authorization and shared catalogue interface there. Envelopes retain Result<T>/Results<T>.

| Type | Exact properties |
|---|---|
| PermissionOptionVM | key:string, action:string, isAssignable:bool |
| PermissionEntityVM | entity:string, name:string, permissions:PermissionOptionVM[] |
| RoleAccessVM | id:int, name:string, isDefault:bool, isActive:bool, version:Guid, permissionKeys:string[] |
| AuthorizationWorkspaceVM | entities:PermissionEntityVM[], roles:RoleAccessVM[], enforcementEnabled:bool=false |
| RoleConfigurationSaveVM | name:string(required/max100), isDefault:bool, permissionKeys:string[](required), expectedVersion:Guid |
| UserAccessSaveVM | roleIds:int[](required), directPermissionKeys:string[](required), expectedVersion:Guid |
| EffectivePermissionVM | key:string, roleIds:int[], isDirect:bool |
| UserAccessVM | userId:int, roleIds:int[], directPermissionKeys:string[], effectivePermissions:EffectivePermissionVM[], version:Guid |

| Method/route | Request | Response |
|---|---|---|
| GET /Authorization/workspace | none | Result<AuthorizationWorkspaceVM> (complete configuration workspace, not fake paged data) |
| POST /Authorization/roles | RoleConfigurationSaveVM; expectedVersion ignored for new | Result<RoleAccessVM> |
| PUT /Authorization/roles/{id:int} | RoleConfigurationSaveVM | Result<RoleAccessVM> |
| DELETE /Authorization/roles/{id:int} | none | Result; dependency-aware soft delete |
| GET /Authorization/users/{id:int}/access | none | Result<UserAccessVM> |
| PUT /Authorization/users/{id:int}/access | UserAccessSaveVM complete snapshot | Result<UserAccessVM> |

IAuthorizationCatalog.GetEntities(): IReadOnlyList<PermissionEntityVM>. IAuthorizationConfigurationService methods: GetWorkspaceAsync(CancellationToken), CreateRoleAsync(RoleConfigurationSaveVM,CancellationToken), UpdateRoleAsync(int,RoleConfigurationSaveVM,CancellationToken), DeleteRoleAsync(int,CancellationToken), GetUserAccessAsync(int,CancellationToken), SaveUserAccessAsync(int,UserAccessSaveVM,CancellationToken), using the responses above.

The API-owned catalogue implementation enumerates MVC descriptors (no ServerAPI reference from Business); register its interface explicitly. The service uses the catalogue without calling protected CRUD recursively. Effective access is a configuration preview for the selected local user, not /Me access and not a verified session capability.

## UI/integration and ownership

- Roles: replace the list surface with the owner-requested accordion configuration workspace at /Role. Create/edit/view definition via shared EditorDialog, same component/mode; legacy create/details deep links redirect to Role with an explicit query intent if needed. No console-only Save. Existing IsDefault field is retained as metadata with no automatic grant behavior.
- Shared PermissionTreeComponent under shared/components/permission-tree, with model `PermissionEntity`/`PermissionOption` matching the catalogue; inputs `entities`, `selectedKeys`, `disabled`, `idPrefix`; output `selectedKeysChange`. Pure presentation, no HTTP, user IDs or login reads. Known candidate rows disabled. Leaf keys immutable and duplicate-free.
- Shared AuthorizationConfigurationService under shared/service, plus shared/models/authorization.ts with the above frontend interfaces; root HttpClient and environment.baseUrl only. Methods workspace(), createRole(payload), updateRole(id,payload), deleteRole(id), userAccess(id), saveUserAccess(id,payload).
- UserAccessEditorComponent under Administration/Users/components/access-editor; inputs userId:number and readOnly:boolean. Own catalogue/workspace plus user-access reads, full snapshot save, role selection separate from role disclosure, direct grant tree, effective origins. Expose `hasPendingChanges():boolean`, `busy():boolean` to parent; parent discard/navigation honors both. No credential/reset/session controls. A new unsaved user sees Save-user-first until an int ID exists.
- Shared FormSection may gain opt-in collapsible behavior preserving defaults if needed; use existing shared visual owners and tokens. Do not copy editor/card chrome into every permission entity. Native accessible details are acceptable for the domain hierarchy, shared styling only.
- Role workspace and UserAccessEditor show translated configuration-only/enforcement-deferred notice. They handle isSuccess:false and HTTP errors, retry, loading, read-only/busy and dirty discard. Page never scrolls; one internal workspace body scroll, fixed header/actions. Selection persists across collapse and respects RTL/themes.
- Translation keys use `authorization.*`; root owns adding a shared EN/AR vocabulary and existing Administration guide topics. Other workers provide all needed key suffixes. Root owns the final integration, docs and source diff review.

## Reference conformance before implementation

| Concern | Book | Source reference inspected | Target |
|---|---|---|---|
| Workspace bounds/header | UI1/3 | Workshop/Job list/editor shell; FeatureTitle | Shared shell + explicit owner accordion exception |
| Modal/actions | UI13/10/24 | EditorDialog/EditorTabs declarations and confirmation service | Controlled mode and dirty-close, no copied chrome |
| Permission hierarchy | UI13/24/27 | FormSection declarations; native details precedent in ImportCsv | One shared tree, keyboard disclosure, indeterminate inputs |
| Grants/snapshots | BE2/3/5/8 | BranchService; current RoleService and UserService, Repository and DbContext tenant writer | Explicit tracked reconciliation and tenant constraints |
| Wiring | UI1/2/26 | Current Role/User lazy routes, root HTTP owner, actual API base | No auth/session changes; preview/configuration only |

Initial packet drift check passed all eight packets. Phases 0/1 applied for this isolated slice; read/write/actions/integration/reconciliation follow after this freeze. Builds/tests/lint/browser/DB/migrations/Git writes remain prohibited. Owner migration needed after source changes, proposed name AddAuthorizationConfiguration.
