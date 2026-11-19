# Individual frontend — current-source contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-02 |
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Customers/Individual` and direct wiring; backend is contract evidence |
| Authority | `F:/My Work/Sigma/AGENTS.md`; Master 1/3/4/5/7; UI screen 03 and owning blocks; backend Pattern 2 |
| Recipe check | Eight packets passed `Generate-SigmaRecipes.ps1 -Check` before review |

## Manifest and boundaries

The user requested review and confirmed fixes. Tier M: existing IndividualPartner list and routed step-form editor, preserving business/API semantics. Existing list paging change, unrelated customer/report/shared-grid/translation changes are user-owned and must remain. Customer-only contact-group selection is committed source. The old `INDIVIDUAL_PARTNER_FEATURE_REVIEW.md` is historical and is not rewritten. No screenshots supplied. Evidence is current source, not visual/runtime acceptance.

UI references: list shell/filter/grid request stream `Workshop/Job/components/list`; step-form record `Customers/Individual/IndividualPartner/components/details` with shared step-form/form-section/validation-summary, EditableRows, partner-editor rows and DocumentUploadTracker. Backend Pattern 2: IndividualPartnerService owns address, billing, documents and cards; PurchaseOrderService is the pattern reference. No backend/schema/accounting change is planned.

## Read contract

| Grid/action need | Frontend | Backend IndividualPartnerListVM |
|---|---|---|
| Actions (shared first column) | id | Id |
| Code | no | No |
| Name | name | Name |
| Contact group | contactGroup | ContactGroup |
| Mobile | mobileNo | MobileNo |
| Contact number (home, otherwise work) | contactNo derived from phoneHome/phoneWork | PhoneHome/PhoneWork |
| Email | email | Email |
| Branch | branch | Branch |
| Status badge | isInactive | IsInactive |
| Group action selection | contactGroupId | ContactGroupId |

All displayed fields sortable except contactNo. `GET IndividualPartner` returns Results<IndividualPartnerListVM>; page defaults 1/10, maximum size 100. `Filters[branchId]` and `Filters[isInactive]` use base property filtering; `Filters[search]` uses declared SearchColumns; `Filters[agreementStatus]` uses AgreementStatusFilter (0 open, 1 closed). Null/empty filters omitted, unchecked inactive-only omitted, 0 preserved. Sort via `Filters[sortField]`/`Filters[sortOrder]`, supported grid fields only. Export fetches every page with the applied filter/sort snapshot, formats the same eight columns with current translations and fails completely on a failed page; no card export.

Search applies draft controls and resets to page 1. Paging, route handoff, action refresh and export retain the applied filters, page and sort. A draft edit without Search must not silently change the displayed query. Delete success on a one-row nonfirst page goes back one page. One switchMap/defer stream cancels stale list reads.

## Detail/write and files

`GET IndividualPartner/GetByWithNavigationsId/{id}` returns Result<IndividualPartnerDetailVM>. POST/PUT IndividualPartner consume the existing Add/Update VMs. Update carries root id and saved child ids; new rows have 0; every document/card is sent as a full snapshot. Omit tenant, No, audit, deleted/active flags and totals. Preserve the existing editable IsInactive payload semantics and unchanged address label/privacy. Detail-only lookup names remain display evidence.

Steps: details/address/profile (0), documents (1), billing/cards (2). Required: BranchId, FirstName, LastName, MobileNo, BirthDate; document Type/Number/Issue/Expiry; card Type/Number/Expiry/CVV/NameOnCard/BankName. Existing API string limits and numeric nonnegative bounds retained. BirthDate cannot be future; document expiry strictly after issue. One default card follows the existing UI contract. Editor cannot save before successful detail load, while upload/cleanup runs, or while any control invalid. Frontend validation must reject blank required strings before payload trimming/API validation. Age is display-only.

Dates reuse shared partnerApiDate/partnerPickerDate and appDatePicker structured masks (DD/MM/YYYY; card expiry MM/YYYY). Documents/Profile use app-file-field with an editor-scoped DocumentUploadTracker. Replacement/removal of saved files cleaned after successful save; discard cleans unsaved files; failed cleanup remains open for cleanup-only retry.

## Actions and integration

| Action | Contract / evidence |
|---|---|
| Create/View/Edit | /IndividualPartner/create, /view/:id, /edit/:id; legacy /details/:id remains compatible; editor exits with applied list query |
| Agreement history | GET IndividualPartner/{id}/agreements; shared agreement-history dialog; read only |
| Change group | PUT IndividualPartner/{id}/contact-group, { contactGroupId: number or null }; null resolves existing backend Customer default; editable only while idle; save/close busy guards and dirty discard |
| Delete | inherited DELETE IndividualPartner?id={id}; shared confirmation, backend tenant/reference blockers and owned-row soft delete |
| Remove child | EditableRows, confirms saved/dirty rows; full snapshot persists absence |
| Approve/post/void/financial transitions | Not Applicable: customer record has no document lifecycle |

AuthGuard is authentication only. Authorization candidates: customer write/delete, group update, sensitive card access. No permissions invented. One AppModule HttpClient/interceptor chain; root services on environment.baseUrl. List/detail/history/inline lookup failures suppress interceptor presentation and show one inline owner; mutations use interceptor feedback and finalize all busy/global loader state. Auxiliary lookups do not use global loading.

No API/DTO/entity/EF/AutoMapper/calculation change; no migration. No build/test/lint/database/browser/commit/push/deployment authorized. Required manual verification remains pending.

## Conformance gate before implementation

| Concern | Book | Actual reference / shared owner | Target comparison |
|---|---|---|---|
| List layout/filter/grid | UI 1/3/4/6 | Job list template; styles.scss, FilterPanelComponent, DataTableComponent | Target uses sigma-route-host/list shell, formGroup/reset, fill=true, 10/20/50/100 options and feature page report; no local CSS |
| Cancellation/error | UI 22/28 | Job bindListQueries; LoadingService/apiErrorMessage | Target switchMap/defer/finalize and skip header match; lookup failure ownership requires audit |
| Steps/form | UI 12/14/18 | Target current reference; shared StepFormComponent/EditableRows/partner-editor-forms | One typed parent and three groups, full-width steps, shared rows/validation/upload cleanup; local date adapter duplicates shared partnerApiDate |
| Group save | UI 11/22/28 | EditorDialogComponent and existing target action | Modal dirty-close contract exists; global save loading and disabling input/action while busy need correction |
| Routes/filter state | UI 10/28 | readListRoute/writeListRoute | Target handoff currently serializes draft controls instead of applied filters; correction is derived from frozen retained-query semantics |

Backend override evidence: UniqueColumns/SearchColumns/ApplyListFilters/MaterializeListAsync declare list/duplicate needs; AddAsync/UpdateAsync resolve Customer group; UpdateCoreAsync validates ownership and reconciles tracked children; RemoveAsync includes owned rows. Controller adds history/group only. Preserve all overrides; frontend task does not alter them.

## Source refinement before implementation (2026-10-02)

The baseline scoped Git diff is a previous `resolveListPaging` correction in Individual list; it is preserved. Customer-only contact-group selection is committed source, while ContactGroupService's optional skip-error argument is a pre-existing unrelated working-tree change and is reused without editing that file. The bounded shared fixes expand the tier to L; `INDIVIDUAL_FRONTEND_MAINTENANCE_EVOLUTION_PLAN.md` is Frozen before code edits. Four optional rental/lease surcharge fields remain nullable, matching their existing API; CreditPeriod/CreditLimit/CustomerWiseDiscount/RentalDarbSurcharge/LeaseDarbSurcharge cannot be cleared to null. CreditPeriod is an integer up to 2147483647. Shared card factory gains nonblank required text validation; FileField forwards its control errors. No wire or business contract changes.

Final discovery amendment: the frozen maintenance plan records source-supported retirement of unused PersonBase/Partner/PartnerAddress UI roots, with no consumers, routes, configuration or backend removal. Existing shared mergeSelectOptions replaces duplicate option merging; collections use the existing complete busy gate. The runtime/API contract above remains Frozen and unchanged.
