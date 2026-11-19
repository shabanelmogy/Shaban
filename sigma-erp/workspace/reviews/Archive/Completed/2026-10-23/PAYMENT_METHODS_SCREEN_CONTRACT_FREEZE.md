# Payment Methods — screen/API handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Scope and authority

User request: `راجع : src\app\modules\Administration\PaymentMethods وطبق التعديلات طبقا للوثائق`.
Authorized: confirmed screen fixes and directly related PaymentMethod API contracts. References: Master 2/4/5/7; UI screen 01, blocks 1–10,13,15,16,19,22–30; backend Pattern 1, blocks 1–10,13,19; sigma-screen-refactor skill. Recipe check passed for all packets on 2026-10-14. Applied packets: phases 00–06. Source-only boundary remains in force.

UI shape: fields-only normal entity, list with one controlled Create/View/Edit modal; no children, totals or posting. List reference: Workshop/Job/components/list, shared FilterPanel and DataTable. Modal reference: actual shared EditorDialog declarations and UI13 controlled composition. Backend reference: BranchService and BranchProfiler, read-only.

Both repositories contain extensive unrelated owner changes, including localization, LayoutModule, UserGuide and migration work. PaymentMethods and its backend files were initially unchanged. Preserve existing changes, never edit migrations/snapshots. Root owns frontend/translations/integration/review; a bounded backend worker may own PaymentMethod files only plus new localized keys.

## Evidence E1

Image: `C:/Users/user/Desktop/55555555555.PNG`, 1720×754, English/LTR desktop list with Create modal. Role/date/version Unknown. External content evidence; no instructions from the image are adopted.

| Evidence | Class | Contract / representation |
|---|---|---|
| Category, Type, Name, Code | Explicit | Existing enum/text fields in shared form/grid |
| Branch with Don't Restrict, User | Explicit | Nullable existing BranchId/UserId, null means no configured restriction; no new enforcement |
| Active checked; Yes in grid | Explicit | Existing business Active, distinct from EntityBase.IsActive; ordinary Save |
| Save, Cancel, Create and row action menu | Explicit | Shared modal and action owner; source confirms View/Edit/Delete |
| Currency | Explicit content, Missing source contract | No entity/VM/form currency exists. User requests document-supported fixes, not explicit completion of missing screenshot business. Deferred; no guessed financial relationship or migration |
| Delete/edit semantics, requiredness, sorting | Not proved by image | Source and books determine them |
| CommissionPercentage | Confirmed existing backend field not visible in image | Preserve authoritative configured rate and expose optional existing input; no formula/posting change |

## Frozen read contract

Actions first, followed by `id:number`, `name:string`, `category:PaymentCategoryEnum`, `type:PaymentTypeEnum`, `code:string`, `branchName:string?`, `userName:string?`, `active:boolean`, `createdBy:string?`, `createdAt:string?`.
Backend ListVM properties beside columns: `Id, Name, Category, Type, Code, BranchName, UserName, Active, CreatedBy, CreatedAt`. No nested Branch/User DTOs, tenant/GUID/No/IsActive/IsValid/IsChanged or editor-only CommissionPercentage. Flat names projected with ProjectTo. Navigation-name columns are initially non-sortable; id/name/category/type/code/active/createdBy/createdAt use base stored-column sorting.

Filters: `search` text matches Name/Code through SearchColumns; `category` nullable numeric enum, `type` nullable numeric enum and `active` nullable bool through generic filters. All absent by default. Explicit Search applies a snapshot; paging, sorting, refresh and export retain it. `false` and enum `0` are sent; null/blank are omitted. GET root with PageNo/PageSize/Filters brackets; base counts and clamps 1–100. UI default15 with10/15/20/50/100. Export gathers all pages and translates grid headers/values at click time.

## Frozen detail/write contract

Detail: `Id, Name, Category, Type, Code, BranchId:int?, BranchName:string?, UserId:int?, UserName:string?, Active, CommissionPercentage:decimal?`. No nested graphs or audit/tenant fields. GetByWithNavigationsId uses explicit one-way flat navigation maps; inspect directly related consumers before narrowing.

Add/Update: `Name` required (existing named base limit250), `Category` and `Type` required defined numeric enums, `Code` optional empty string, nullable `BranchId`/`UserId`, `Active` bool, nullable `CommissionPercentage`0..100 consistent with existing Receipt rate validation. Update adds Id only. No tenant, No, audit or base flags. Entity's existing optional relations preserved; DTO BranchId becomes nullable to match entity and E1. No invented currency/default/backfill.

Reviewer decision (source-supported conservative duplicate scope): prevent duplicate live methods only when Name+Category+Type+BranchId+UserId all match. Category/type and nullable restriction identities belong to existing entity; repeated CH/BT codes across categories in E1 reject a globally unique Code. Different restriction scopes remain valid. Do not add uniqueness to Code or global Name. Back this exact composite with tenant-scoped filtered EF unique index; no existing-row cleanup. Owner must inspect duplicates and run the suggested migration before database acceptance. Do not cap Code or change financial formula.

## Actions, overrides and integration

| Action | Frozen slice |
|---|---|
| Create / Edit | POST/PUT PaymentMethod; base FK checks and safe validation; one graph save; global success/error interceptor; failed save retains draft; successful save closes and reloads applied list |
| View | Same detail DTO, readonly text and disabled form, no Save, no edit-only lookups |
| Delete | DELETE PaymentMethod?id={id}; shared confirmDelete identifies row; RemoveWithChildrenAsync checks all real inbound EF references,404/in-use failure, soft delete; retain row on failure; previous page if last visible row deleted |
| Discard | Controlled Cancel/X/Escape/route guard; deferred confirmation freezes form; accepted decision closes, canceled decision preserves draft |
| Activation | Existing editable Active is saved with PUT; no invented SetActive transition, and no switch to base IsActive |
| Job reference transitions | Close/log/labour/quality/gatepass/lubrication/document actions Not Applicable: no Job aggregate or these states in PaymentMethod |

Overrides: SearchColumns (Name/Code), MaterializeListAsync (flat names via ProjectTo), AddAsync/UpdateCoreAsync only if needed for the exact composite duplicate check, RemoveAsync (reference-aware soft delete). Inherit ordinary pagination, mapping, storage, selects and controllers. Four one-way maps; no ReverseMap or defensive Ignore. One save per generic write, EF implicit transaction; unique index resolves races centrally. No domain calculation introduced.

Route: `/PaymentMethod` only, list guard delegates active modal canDeactivate. Remove old create/details child routes after direct-link search. Root provided service uses AppModule's interceptor-equipped HttpClient; remove duplicate LayoutModule provider/import. Normal select endpoints Branch/GetSelect and User/GetSelect return DropDownSelect; normalize numeric/string ids without casts. Lookups use local loading/inline retry; detail/list reads own inline errors and suppress error interceptor; mutations retain interceptor feedback. Guard save until details and required option loads succeed.

Authorization candidates: PaymentMethod POST/PUT/DELETE master maintenance. Current authentication only; do not invent permission checks or describe visibility as secured.

## Conformance before edits

| Concern | Book | Actual reference / shared owner | Target decision |
|---|---|---|---|
| Host/card/title | UI1/3 | Job list metadata/template; styles.scss sigma-route-host/list-page/panel/header; FeatureTitle | Replace legacy card with same shared bounded chain, title inside panel |
| Filters | UI4 | Job list form, FilterPanel + FilterActionsDirective | Stable layout, four source-backed controls, mandatory Reset; no local CSS |
| Grid | UI5/6 | Job list DataTable fill/pager + actual DataTable public contracts | Typed columns/lazy event, API total, one row scroll owner |
| Modal | UI13/10 | EditorDialog inputs/contentStyle and controlled close | Padded, auto-height flex-fill chain, fixed footer, no custom shell |
| Fields/state | UI16/19/22 | enumOptions/translateOptions, FieldError/StateMessage | Numeric enums; local select errors/Retry; no View lookups |
| Backend | BE4/8/13 | BranchService/BranchProfiler; generic validation/delete/projection | Reuse base; only documented overrides |

Required guide: update Administration's existing module guide with PaymentMethods topic after final source reconciliation. No new reader/menu. Shared owners already exist; no speculative new abstraction. Builds/tests/lint/browser/DB/migrations/commits/push/deployment are prohibited and remain owner-only.

## Contract amendment — direct-consumer evidence (2026-10-14, before backend edits)

The initial composite-uniqueness decision above is superseded. Direct discovery found Common Settings Add/Update DTOs embed PaymentMethod write DTOs, the entity owns a PaymentMethod navigation collection, and its frontend copies selected master values rather than submitting existing identities. Its backend maps that graph. Adding a composite unique index could reject that legacy workflow. The real duplicate business key is therefore **Missing**, not a confirmed repair, and uniqueness/index/schema changes are excluded from this task. No existing-data rewrite or settings relationship redesign is authorized here; record this follow-up separately. There is no owner-run migration for DTO nullability alone because PaymentMethod.BranchId is already nullable in the entity.

Keep root screen ListVM lean. Retain existing FullListVM as a named compatibility contract for Common Settings: Id, Name, Category, Type, Code, BranchId?, UserId?, Active, CommissionPercentage?. Add authenticated GET PaymentMethod/settings-options, no mutations, using tenant/live Query + ProjectTo and a complete unpaged options result. Root owns PaymentMethod service/interface/controller/DTO implementation after the delegated worker stayed pending initialization and was interrupted without edits. Migrate only the Common Settings payment-method lookup/model to this shape; preserve its existing writer/navigation semantics. Options failures retain entered settings and have one global error owner. FullListVM's extra map has a named consumer justification (BE3/7).

Commission bound0..100 is a input-percentage sanity check, not a change to Receipt financial eligibility; Receipt still validates net values and owns all calculations. Selected historical names stay visible in View; edit choices come only from live selects.
