# SIGMA FULL REVIEW — Sales Fleet

Review date: 2026-08-02  
Scope: `SiGmaAngularFrontEnd/src/app/modules/Sales/Fleet` and the directly related
`/Equipment` Angular/.NET contracts  
Guides: `SIGMA_FRONTEND_REVIEW_GUIDE` and `SIGMA_BACKEND_REVIEW_GUIDE`  
Workflow: `sigma_implement_frontend_from_reference`, whole-screen,
backend available, source-only owner verification  
Visual references: `C:\Users\user\Desktop\New folder\1.PNG` through `10.PNG`

## Result

All confirmed applicable findings in the authorized Fleet source scope are
implemented. The attached screenshots show legacy Sales Quotation, Sales
Agreement, and Receipt screens rather than a Fleet field contract. They were
therefore used only for Sigma shell, density, control, action, color, and modal
acceptance. Fleet fields, routes, documents, warranties, and domain behavior
were not redesigned into quotation/agreement/receipt workflows.

The existing approved Fleet reference structure remains: a compact server-paged
list and an in-place grouped Create/View/Edit modal with Detail, Documents, and
Warranty tabs. Routes and the already-approved details SCSS required no source
change.

## Implemented changes

| Area | Source result |
|---|---|
| Tenant ownership | Removed `subscriptionId` from Fleet create/update/detail frontend models, form state, validation, payloads, and translations. The authenticated backend/repository remains tenant authority. |
| List VM | `EquipmentListVM` is now a direct projection containing only row identity, displayed status, and fields rendered by the Fleet list. It no longer serializes inherited audit/tenant metadata. |
| Shared list generic | Removed the unused `TListVm : ListBaseVm` constraint from the service interface, base service, and base controller so minimal feature list DTOs are supported without changing other list DTOs. |
| Sorting | Added a typed, whitelisted Angular sort contract and matching backend ordering before projection/paging, with `Id` as the stable tie breaker. |
| Request lifecycle | Obsolete Fleet list subscriptions are cancelled before a replacement request starts, preventing older responses from overwriting newer filters/pages/sorts. |
| Print/export | Every page must return a successful business result; a later failed page now fails the whole print/export operation instead of emitting partial rows. |
| Visual tokens | Fleet list primary, hover, border-focus, and focus-ring colors now use the canonical `#1478b5` Sigma modal palette without changing layout. |
| Accessibility | Repeated document/warranty controls have unique labels and required-error relationships. The missing Make/Model menu now has button-menu semantics, arrow/Home/End/Escape keyboard handling, and managed focus. |
| Nested errors | Make/Model create/reload and document upload failures are displayed inside their active child dialogs. Existing shared upload validation remains the single file-validation implementation. |
| AutoMapper | Equipment update blocks inherited `SubscriptionId` and `No`; `Documents` and `Warranties` remain ignored because the service validates ownership and reconciles them explicitly on the tracked aggregate. |
| Translations | English and Arabic catalog failure text was added; the obsolete Fleet subscription error was removed. |
| Loading/errors | Existing list, details, save, delete, lookup, print, export, catalog, and upload loading/error paths were retained or completed as applicable. |

## Screenshot acceptance

| Screenshots | Applicable Fleet acceptance | Status |
|---|---|---|
| `1.PNG`–`6.PNG` | Compact title/filter/action/table density, status colors, menus, dialog treatment, and Sigma action colors | Source aligned; runtime visual comparison Owner pending |
| `7.PNG` | Full-width creation modal rhythm, grouped fields, persistent Cancel/Save actions and icons | Applicable shell/actions retained; quotation fields/calculations intentionally not copied |
| `8.PNG`–`9.PNG` | Tabbed modal structure, table/editor density, persistent footer | Applicable tab/modal patterns retained; agreement/payment fields intentionally not copied |
| `10.PNG` | Compact form controls, lookup action color, document affordance, Cancel/Save buttons | Applicable control/action patterns retained; receipt fields intentionally not copied |

## Endpoint and contract matrix

| Operation | Contract |
|---|---|
| List | `GET /Equipment?pageNo&pageSize&Filters[...]` supports `plateNo`, `chassisNo`, `branchId`, `interiorColor`, `carModelId`, `vehicleTypeId`, `isActive`, `sortField`, and `sortOrder`. Filtering and count precede ordering, projection, and paging. |
| Full print/export | Repeats paged list requests up to the backend page cap and fails atomically at the observable level if any business response fails. |
| Detail | `GET /Equipment/GetByWithNavigationsId/{id}`; lightweight references plus active Documents/Warranties. |
| Create | `POST /Equipment`; no client tenant field. Backend validates the graph and persists the authenticated tenant. |
| Update | `PUT /Equipment`; loads the existing aggregate, blocks tenant/record-number overwrite, validates child ownership, maps editable scalars, reconciles children, and saves. |
| Delete | `DELETE /Equipment?id={id}`; tenant-scoped behavior and existing Sales Agreement reference protection retained. |
| Upload | Existing shared `FileUploadService` and `/Media` contract retained; validation is not duplicated in Fleet. |

### Exact Equipment list response fields

`Id`, `IsActive`, `PlateNo`, `Make`, `Model`, `VehicleType`,
`InteriorColor`, `Branch`, `ChassisNo`, `EngineCapacity`, `EngineNo`,
`FuelTankCapacity`, and `PurchaseDate`.

`Id` is the row identity used by the displayed Actions column;
`IsActive` is the displayed Status column. No inherited subscription, audit,
soft-delete, GUID, record-number, or detail collection properties are returned.

## Resolved findings

| ID | Severity | Resolution |
|---|---:|---|
| `SIGMA-9346DA8E73` / `FLEET-CONTRACT-001` | High | Removed client tenant ownership across Fleet models, form, payload, details, and translation state; retained required update-map protection. |
| `SIGMA-FBFEA389D9` / `FLEET-MAP-001` | High | Prevented inherited update `No` from clearing the loaded server-owned record number. |
| `FLEET-LIST-001` | High | Made `EquipmentListVM` an exact minimal list projection and relaxed only the unused generic list constraint. |
| `FLEET-LIST-002` / `FLEET-FE-DATA-02` | Medium | Added whitelisted remote sorting through Angular models/components/services and the .NET query. |
| `FLEET-FE-DATA-01` | High | Prevented partial full-list print/export results after a later business failure. |
| `FLEET-FE-BEHAVIOR-03` | Medium | Cancelled obsolete list requests before starting replacements. |
| `FLEET-FE-A11Y-04` | Medium | Added unique accessible labels and required-error references to repeated row editors. |
| `FLEET-FE-ERROR-05` | Medium | Added visible catalog/reload/upload child-dialog error states. |
| `FLEET-FE-A11Y-07` | Low | Added menu semantics, keyboard navigation, and focus management. |
| `FLEET-FE-UI-08` | Low | Aligned list action/focus colors to the canonical Sigma palette. |

## AutoMapper decisions

| Map/member | Source evidence | Decision |
|---|---|---|
| `EquipmentUpdateVM -> Equipment.SubscriptionId` | Matching inherited update property; destination is writable; convention mapping would overwrite authenticated ownership | Ignore required |
| `EquipmentUpdateVM -> Equipment.No` | Matching inherited nullable update property; destination is writable; omitted client value could clear the loaded number | Ignore required |
| `EquipmentUpdateVM -> Equipment.Documents` | Matching update collection; service validates IDs and reconciles the tracked collection explicitly | Ignore required |
| `EquipmentUpdateVM -> Equipment.Warranties` | Matching update collection; service validates IDs and reconciles the tracked collection explicitly | Ignore required |
| Destination-only audit/navigation/calculated members without matching source members | No demonstrated convention or validation requirement | No additional ignores added |

## Source-only verification

- Both Sigma review guides were read before source modification.
- Feature discovery, contract extraction/comparison, finding selection, refactor
  planning, trusted SHA reads, dry-run patches, atomic source patches, and the
  current-diff review were performed through the Sigma MCP workflow.
- The final source-diff review inspected all 16 changed application files.
- Direct source references were checked for removed Fleet `subscriptionId`
  usage and for the complete frontend/backend sort path.
- Generic mapper warnings were resolved by direct/inherited source evidence;
  Equipment update maps onto the loaded entity and child creation remains part
  of the tracked aggregate reconciliation.
- No Graphify, Git command, build, test, lint, migration, database, runtime,
  browser, dependency installation, commit, push, or deployment step was run.
- Compilation and runtime success are not claimed.

## Owner decisions outside this source patch

1. Sensitive files are still served under shared static-file architecture.
   Moving them outside `wwwroot` requires an application-wide authenticated
   download policy.
2. Plate uniqueness remains service-enforced. A normalized database unique
   index requires an owner-approved data policy and migration.
3. Equipment/Media operation-level authorization follows the shared
   authenticated baseline. Separate operation policies require an owner policy
   decision across the application.

## Owner verification pending

1. Angular build, TypeScript compilation, Angular tests, and lint.
2. .NET build and tests.
3. Runtime list filtering, paging, remote sorting, stale-request cancellation,
   last-page deletion, print, and full export.
4. Create/View/Edit, Documents, Warranty, Make, Model, and Upload dialog flows,
   including validation and visible failure states.
5. Desktop/mobile, light/dark, English/Arabic RTL, keyboard focus, overlay
   stacking, and visual comparison with the applicable screenshot patterns.
6. Backend execution, tenant isolation, aggregate child ownership, file
   security, database migration, and database verification.

Documentation conformance follow-up — 2026-10-08: refreshed recipe packets were checked before this pass and all PLAN-00/PHASE-00..06 checks returned OK. Fleet list filters now opt into the shared stable layout; simple catalog/tracker filters use the shared inline action placement; report filters use the stable report strip; all Fleet PrimeNG calendars explicitly preserve invalid typed input with `keepInvalid=true` and editable input with `readonlyInput=false`; VehicleQRLabel list transport now uses `DEFAULT_PAGE_SIZE`. The Sales guide Fleet topic was updated to describe the stable filter/More filters/Search/Reset workflow. No endpoint, DTO, persistence, calculation, permission or blocked-workflow assumption was introduced. Source-only validation and owner visual/build/runtime acceptance remain pending.
