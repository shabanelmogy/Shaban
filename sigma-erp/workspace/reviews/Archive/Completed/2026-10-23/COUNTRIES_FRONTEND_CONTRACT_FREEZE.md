# Countries — frozen screen and API handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

## Manifest and authority

User authorizes review and implementation of `src/app/modules/Administration/Countries` according to the documents. Scope includes its existing `Administration/Country/services/country.service.ts`, Country API/VM/profile/service/config, EN/AR vocabularies and existing Administration UserGuide topic. Both application repositories were clean at discovery. No screenshots/videos supplied. No ambiguous new workflow: PLAN-00 not required.

Authority: `F:/My Work/Sigma/AGENTS.md`; sigma-screen-refactor skill; Master 4/5/7; UI catalog type01 and blocks1–10/13/15/19/22–29; backend normal-entity pattern and blocks2–9/13/19. Recipe -Check passed all eight packets on 2026-10-14; phases00–06 applicable. References are read-only.

## Frozen decisions and evidence

| Concern | Decision and source evidence |
|---|---|
| UI shape | Type01: name-only record, no children/totals/posting → controlled single-section modal Create/View/Edit (UI13). Job list shell/filter/grid; actual shared EditorDialog declaration owns modal, not routed Fleet editor. |
| Backend | Pattern1, existing Country : EntityBaseWithName and generic CountryController retained. |
| Routes | `/Country` list only with CanDeactivate delegating dirty dialog exit. Existing internal create/details routes replaced; scoped consumer search finds only the old Countries components navigating them. Menu/lazy route unchanged. |
| Grid → ListVM | Actions first (synthetic), `id` number → Id int; `name` text → Name string?; `createdBy` text → CreatedBy string?; `createdAt` dateTime → CreatedAt DateTime?. Preserve existing four displayed fields; remove inherited SubscriptionId/No/IsActive/IsValid/IsChanged/GUID from CountryListVM. |
| Filters | `id` optional positive Int32 (existing id filter), `name` trimmed text (existing name filter). `Filters[id]` generic equality and `Filters[name]` generic Contains in Service.BuildFilterPredicate; no new search hook. Empty keys omitted via toListParams; only actual fields serialized. |
| Paging/order | UI default15; 10/15/20/50/100 options; one-based pageNo, clamp backend1–100; TotalCount from filtered CountAsync. Sort id/name/createdBy/createdAt via inherited stored-column order, id descending initial and stable id tie-break. Applied filters (not drafts) govern paging, refresh, export and URL. |
| Detail | Id + Name only; lean read shape, no unused No/SubscriptionId/audit/plumbing. Existing named consumers are Country generic service/interface/controller/profile and Countries editor. GetSelect remains unchanged for customer/agreement lookups. |
| Writes | Add `{name}`; Update `{id,name}`. Required trimmed nonempty name with max250 on both. Existing AddBaseVmWithName max250 is retained; feature Update VM changes from inherited max50 to explicit max250 (known BE backlog4 scoped correction). No server-owned fields. |
| Duplicate key | Name is the only editable business identity. Reject duplicate live names in same tenant, excluding self on Update, DB collation comparison. Declare UniqueColumns with localized CountryNameExists; shared base owns check/write lock. Add filtered unique `(SubscriptionId,Name)` index, `[IsDeleted] = 0`. Country is a standalone table per current snapshot; no TPT split-key exception needed. |
| Persistence | Country Name HasMaxLength250, matching Add/Update. Owner must inspect existing >250 names and live duplicate names per tenant before migration; no automatic data repair/deletion. Suggested migration `ChangeCountryNameContractAndAddUniqueIndex` subject to collision check. |
| Delete | Confirm with shared preset and record name/id. Country has no owned children: scoped RemoveAsync uses RemoveWithChildrenAsync(id,CancellationToken.None) to validate every EF inbound reference before soft delete. Replaces partial manual nationality/address list; includes mapped LeaseAgreementVehicleReplacement.CollectionCountry. BookingCharge DeliveryCountryId/CollectionCountryId are scalar ids without EF navigation/config; do not invent relationships. Inventory and residual scalar-id risk recorded. |
| Feedback | Inline list/detail load/export failures use skip-error header + apiErrorMessage/StateMessage with Retry. Standard Save/Delete retain interceptor success/error owner, preserve draft/row and finalize busy on both failure channels. |
| Close | View/pristine close silently. Dirty X/Cancel/Escape/navigation delegate deferred shared confirmDiscard; freezeFormState retains controls and dirty values on Cancel. Pending read/save/confirmation blocks duplicate mutation/exit. |
| Auth | Existing AuthGuard/authenticated API only. Authorization candidates: POST/PUT/DELETE Country; no invented permission controls. |
| Guide | Extend ADMINISTRATION_GUIDE with bilingual `/Country` topic, existing `/UserGuide/administration` reader and menu. No extra reader/menu. |
| Calculations/uploads/state transitions | Not applicable; Country has none. No activate action added without existing screen requirement. |

## Action inventory

Job approved list actions: Create/View/Edit/Delete/Excel Supported via the Country generic routes. Lubrication Job, labour time, customer invoice, Close, Cancel job, quality check, log, estimation, gate pass and print gate pass Not Applicable: Country is not a workshop aggregate and has no corresponding workflow. No placeholder actions.

| Action | Endpoint/payload | UI/recovery |
|---|---|---|
| Create | POST Country `{name}` | Modal; Save validates; success closes and refreshes applied page; failure retains draft. |
| View/Edit | GET Country/GetById/{id}; PUT Country `{id,name}` | Same modal; disabled View controls; successful edit closes/refreshes; failed load blocks Save and offers Retry. |
| Delete | DELETE Country?id=… | Shared named destructive confirmation, inflight guard, soft delete with EF usage checks; failed row retained; successful last-row delete steps back one page. |
| Excel | GET Country pages size100, same applied filters/sort | fetchAllPages + dataTableExportRows; translated current headers; no partial file on failure. |

## Override audit and transactions

Only feature overrides: UniqueColumns (business identity) and RemoveAsync (dependency-aware deletion; inherited RemoveAsync does not check usages, BE backlog31). Inherit Add/Update/Detail/GetMany/order/select/controller methods; no unnecessary overrides. Shared UniqueColumns serializes participating writes inside existing unit-of-work transaction, one save; duplicate index is database invariant. Delete helper uses existing one-save owner. Four explicit one-way AutoMapper maps; no ReverseMap/Ignore.

## Pre-edit reference conformance

| Concern | Book | Actual reference symbol | Shared owner | Target |
|---|---|---|---|---|
| Container-fill/8px edges | UI1/3/6 | JobsComponent host and list HTML sigma-list-* | src/styles.scss/FeatureTitle/DataTable | adopt exact classes, fill=true; no feature CSS |
| Filter labels/reset/34px | UI4 | Job form[appFilterPanel], exact directive exports | FilterPanel/PrimaryActionButton | stableLayout=true, typed id/name, mandatory Reset |
| Request replacement | UI28 | JobsComponent.bindListQueries | Subject/switchMap/defer/list-query helpers | cancel prior page read, balanced finalize |
| Modal | UI13/15 | EditorDialogComponent inputs/template | shared EditorDialog | controlled visibility/mode, contentPadded, content-sized flex-fill chain, default viewport bounds |
| Validation/confirmation | UI9/10/19 | ConfirmationDialogService presets; freezeFormState; FieldError | existing shared owners | required/max250, first-invalid focus; unified discard |
| Mapping/validation | BE4/8/13 | BranchProfiler four maps; Service.UniqueColumns/RemoveWithChildrenAsync | generic backend service/UoW | lean Country VMs, no custom CRUD query/save |

Implementation evidence and responsive matrix will be reconciled in COUNTRIES_FEATURE_REVIEW.md. Runtime/visual/compiler/database acceptance remains pending.
