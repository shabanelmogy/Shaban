# Sales Fleet evidence — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Sales/Fleet and owning Equipment service/contracts; shared owners, translations and approved references read-only |
| Authority | AGENTS.md; sigma-screen-refactor; Master5; UI1/10/13/14/15/16/17/18/19/22/27/28; BE5/8/9/13/14; frozen Sales cycle/fixes and 2026-10-08 review |

## Baseline correction and frozen routes

Actual source already renders Fleet Create/Edit/View as routed `sigma-editor-page` and the list navigates to those routes. Modal imports and embedded state remain in TypeScript, but no aggregate modal remains in its template. This task completes the current routed adoption; it does not claim a new modal migration. Documents and Warranties require type02 under UI13 D4-2. Freeze `create`, `view/:id`, `edit/:id` with explicit route `data.mode`; legacy `details/:id` redirects to View. Preserve list applied filters/page/sort on editor return, typed full child snapshots, existing Equipment endpoints and server-owned saleStatus. Make/Model remain the existing small shared dialogs. Attachment folder remains current `CustomerDocuments`; no storage migration is authorized.

## Pre-edit reference conformance

| Concern | Block | Actual reference / symbol | Shared owner | Target evidence / planned repair |
|---|---|---|---|---|
| Routed shell + routes | UI1/13 | Workshop/Job `editor.component.html` section/panel/form/body/footer; `Job_Routes` data.mode/legacy redirect | styles.scss sigma-editor-*; FeatureTitle | Fleet shell exists, but form/body classes are on the wrong DOM links and stale embedded inputs have no consumers; align hierarchy and mode routes |
| List | UI1/4/6/8/28 | Job list shared shell/filter/data-table and switchMap reads | FilterPanel/DataTable/list-route-state | Fleet uses same shell, fill grid, applied snapshot + switchMap; retain returned page clamp and all-page print/export |
| Owned rows + confirm | UI10/14/18 | Job EditableRows; actual shared EditableRows.confirmationPending/canMutate and DocumentUploadTracker.finishSave/discard | EditableRows/ConfirmationDialog/DocumentUploadTracker | Fleet lacks row-confirmation gates and freezes neither discard form nor standalone inactive checkbox; repair snapshot gates, cleanup-only retry preserved |
| Enum labels + View | UI15/16 | IndividualPartner enumOptions(PartnerDocumentType), mergeSelectOptions; current shared enumOptions/translateOptions | enum-options/select-options/TranslateOptions | Fleet EnumToArrayPipe assigns index IDs and raw untranslated labels; reuse explicit 0–38 document IDs and numeric Warranty/Period values, View reads saved names without dropdown lookups |
| Controls and feedback | UI17/19/22/27 | Job/Individual DatePicker, FieldError, StateMessage and focusField | DatePickerDirective/FieldError/StateMessage/focusField | Fleet repeats state markup, calendar icons and native invalid focus, omits warranty numeric messages; use owners and preserve field contracts |
| Backend list exception | BE9/13 | Branch list hooks; base NormalizePaging/ApplyListOrder; Individual ProjectTo materialization | Service | Equipment custom list currently default5 and repeats filter/order. Frozen external-delete last-page clamp cannot be expressed by base GetMany; retain that narrow exception while using shared paging/query/order/projection |
| Tracked child update | BE5/8/14 | PurchaseOrder aggregate reference; IndividualPartner.UpdateCoreAsync and shared OwnsAll/ReconcileOwned | Service/UnitOfWork | Equipment tracked update checks positive IDs only, locally removes child collections before soft-delete and repeats reconciliation; use shared ownership/reconciliation, one save, preserve tenant sales/equipment locks |
| Validation/localization | BE5/8 | shared CustomerDocumentAdd/Update annotations and global trim; Branch BusinessFailure | VM annotations/Service/localizer | CustomerDocument already requires number/dates and strict expiry; remove divergent child date rule. Equipment English failure literals become localized keys; no new business rules |

No screenshot evidence supplied for Sales. Authentication remains the existing parent AuthGuard; no permissions are introduced. Unit state, purchase-cost lock and in-use deletion remain backend-owned. Source-only conformance and pending owner runtime/visual acceptance are separate.

## Final root reconciliation

Routed shell/mode/legacy alias, bounded section/table ownership, actual enum IDs/translations, historical View labels, saved option merge on Edit, required whitespace validation, warranty numeric bounds/feedback, NumericFocus appearance and first-invalid focus are implemented. Busy gates include lookup/read/save/child confirmation/upload/cleanup/catalog workflows. Dirty-route discard is deferred and freezes the form; Cancel restores mode-specific locks. A standalone inactive checkbox also observes busy/state locks. Existing cleanup-only retry and frozen destination are retained.

Catalog make/model creation now uses typed FleetService wrappers over the same existing POST routes with only X-Skip-Success-Toast. The editor shows one success after the saved option becomes selectable. A successful POST followed by a failed read retains a refresh-only retry, with bilingual fleet.errors.catalogReload feedback; the successful write is not repeated. Error interception remains active on the write, and skipped read errors have one inline owner.

Equipment update remains inside the existing SalesAgreement/Equipment locks, calls InvalidInputAsync, OwnsAll and RemoveDroppedAsync, maps scalars then ReconcileOwned on tracked children and saves once. Negative, duplicated and foreign child IDs are refused. Marking only the root Modified preserves child Deleted states until soft-delete save and still checks sales concurrency tokens. Sold/Delivered cost and activation locks are preserved. Structural annotation checks are not repeated by the API service. Obsolete No/SubscriptionId ignores were removed; child ignores remain required for tracked reconciliation. Explicit EquipmentDetailVM keeps Id/IsActive and displayed/editor fields, references and owned children, dropping unused inherited metadata after consumer trace.

The pre-edit table's query/order target is reconciled as follows: shared NormalizePaging uses default10; root reused ListQuery over the original eight validated filter keys; existing ProjectTo selects exact grid fields. GetManyAsync remains the frozen last-page clamp adapter. ApplySorting remains a compatibility exception for the existing direction-dependent Id tie-breaker/fallback; no generic order behavior was claimed. Root reviewed actual Service.ListQuery/NormalizePaging/ApplyListOrder before adjudication. No new filter, endpoint, write policy or schema change.

Grid/ListVM match: plateNo,make,model,vehicleType,interiorColor,isActive,saleStatus,branch,chassisNo,engineNo,purchaseDate,purchaseCost plus minimum id. Filters remain plateNo,chassisNo,carModelId,isActive,saleStatus,interiorColor,vehicleTypeId,branchId. Explicit routes preserve query state. No permissions, new attachment folder or migration introduced.

Final changed files: frontend details.component.ts/html/scss, fleet.routes.ts, services/fleet.service.ts; backend EquipmentService.cs, EquipmentProfiler.cs, EquipmentDetailVm.cs; root owns en/ar Fleet vocab and the9 Equipment resource keys. Exact repository-relative paths and final checks are in SALES_2026_10_08_FEATURE_REVIEW.md. Root reviewed complete scoped differences and final additions;32 runtime Sales TS/9 templates parse with no diagnostics, scoped imports resolve,346 translations present in both languages, RESX keys valid and diff --check clean. No prohibited command ran.

Owner acceptance pending: EN/AR/RTL/theme/narrow/large-row bounds; catalogs save-then-read-failure/retry; upload/discard cleanup; child soft-delete history/ownership; sold-cost/activation refusal and stale writes. Existing Sales migrations require owner history verification; this slice creates no schema migration. Suggested commits: frontend fix(sales): complete fleet routed editor; backend fix(sales): reconcile fleet children and feedback. No shared extraction or learning-rule change was introduced.
