# Companies source review and confirmed fixes — 2026-10-02

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Frontend `src/app/modules/Customers/Companies`; directly related API source inspected as evidence |
| Request | Review Companies and correct confirmed errors |

## Manifest and contract handoff

This is a fresh source review, preserving historical Companies decisions and the current working tree. No screenshots or runtime reproduction were supplied. The current Company list has an existing owner change adopting `resolveListPaging`; preserve it. Other dirty frontend files are outside implementation scope. Record scoped file times before edits; do not overwrite concurrent external changes.

Authority: `F:/My Work/Sigma/AGENTS.md`, required `sigma-screen-refactor` skill, Master 1/3–7, UI screen 03 and applicable UI blocks. Recipe drift check passed for PLAN-00 and phases 00–06. This task corrects existing source behavior without a new business capability or shared API/schema change; PLAN-00 implementation planning is not applicable.

| Shape | Decision/evidence | Reference |
|---|---|---|
| List | Server-paged Company master | `Workshop/Job/components/list`, UI 1/4/6/28 |
| Editor | Screen 03: routed five-step Company aggregate | `Customers/Individual/IndividualPartner/components/details`, shared step-form/form-section/validation-summary; UI 12/14/18 |
| Nested driver | Isolated typed form dialog, one draft tracker | shared editor-dialog and `Fleet/VehicleService/components/details`; UI 11/13/18 |
| Backend | Pattern 2, owned collections with no financial posting | Current `CompanyService.UpdateCoreAsync`, BE 14; backend remains evidence-only unless a directly related confirmed error requires reopening this handoff |

## Frozen API and read contract

| Operation | Method/route | Contract |
|---|---|---|
| List/export pages | GET `Company` | `ListSmBase`: PageNo/PageSize and Filters; `Results<CompanyListVM>` with server total |
| Details | GET `Company/GetByWithNavigationsId/{id}` | `Result<CompanyDetailVM>` |
| Create/update | POST/PUT `Company` | existing CompanyAddVM/CompanyUpdateVM, full owned-row snapshots |
| Delete | DELETE `Company?id={id}` | inherited result and dependency checks |
| History | GET `Company/{id}/agreements` | existing read-only agreement history |
| Contact group | PUT `Company/{id}/contact-group` | `{ contactGroupId: number | null }`; existing default group semantics |

Grid order: Actions, no, companyName, contactGroup, contactNo (phone1 then phone2), website, email, isInactive. API members beside them: Id, No, CompanyName, ContactGroup, Phone1/Phone2, Website, Email, IsInactive; ContactGroupId is additionally required by the action. No extra list member or card export contract is introduced.

Filters: branchId nullable integer, trimmed search, agreementStatus nullable 0/1, isInactive true when checked and omitted when unchecked (all companies). Sorting remains inside Filters with the existing column allowlist; page size 1–100, default 10. Preserve applied query parameters through create/view/edit and return.

## Frozen editor/write contract

Keep CompanyAddVM/CompanyUpdateVM inputs: companyName, branchId, email, vat, website, phone1/phone2, salesPersonId/contactGroupId/debtCollectorId, otherDetail, isInactive/isBroker, invoiceGenerationMethods, partnerAddress, billingInfo, contacts, drivers, creditCards, documents. Update carries identity; new owned rows carry 0, saved rows their identity. No tenant/audit/generated number or calculated fields. Backend VMs own required/max-length/enum/date/numeric rules; typed forms mirror them. No financial calculations or AutoMapper changes are planned.

Five steps remain details/address, contacts, billing/cards, documents, drivers. Header and Next share forward validation; Save validates the full form. Edit requires a loaded snapshot. Read-only View has no write controls. Save failures retain input. Documents use the shared numeric wire enum, required type/number/issue/expiry dates, structured date directive and `CustomerDocuments` folder. A driver draft commits only on draft Save and transfers upload ownership; aggregate persistence alone calls finishSave. Cleanup failure keeps the editor open for cleanup retry.

Actions retain confirmation, busy protection, error-interceptor ownership, recovery and refresh. No new approval/activation/permission system: Company status remains its existing editable IsInactive. Authentication comes from the root HttpClient chain. Authorization candidates remain Company DELETE, contact-group PUT and billing/blacklist writes; no access restriction added.

## Conformance evidence to reconcile

| Concern | Book block | Producer/reference | Target consumer and comparison |
|---|---|---|---|
| List shell/grid | UI 1/4/6 | Job list; shared data-table/filter-panel | CompanyPartners metadata/template: same shared host, fill grid and handled reset |
| Query lifetime | UI 2/28 | Job bindListQueries; shared toListParams | Company listRequests switchMap and CompanyPartnerService query serialization |
| Steps/validation | UI 12/19/27 | Individual details; invalidStepFields/focusField | DetailsComponent goToStep/save and declared specs with actual DOM IDs |
| Collections/draft | UI 14/18 | shared EditableRows/partner-editor-forms/DocumentUploadTracker | Company child forms, driver draft commit/cancel and full-snapshot mapper |
| Lookups/modes | UI 15/16/22/28 | Individual editor and shared typed select services | Company detail snapshot and lookup completion must preserve selected saved values |
| Dates | UI 17 | shared DatePickerDirective | Company/card/driver dates use required structured-date inputs and shared transport |

## Ownership and verification

Root owns editor/children, integration, evidence and final reconciliation. One bounded read-only list reviewer may inspect list/model/service/routes and API read/action source after this freeze, with no source writes or contract changes. Independent list audit and editor audit justify the small team by reducing wall time without overlapping writes. Root integrates all confirmed fixes.

Only source inspection, Git scoped diffs/whitespace, scoped translation parity and contract comparisons are authorized. Builds, tests, lint, browser/database verification, migrations, commits, pushes and deployments remain prohibited. No migration is expected. Final findings, exact file changes and owner checks belong in `COMPANIES_SOURCE_FIXES_FEATURE_REVIEW.md` (pending creation).

## Addendum — confirmed implementation decisions, 2026-10-02

The read-only subagent could not start because its usage allowance was exhausted; root owns that audit too. The Company source timestamps and existing list diff remain unchanged after continuation; new external changes are outside the Companies folder and are preserved. Existing shared FileField/partner-card fixes are evidence-only and are not edited.

Confirmed fixes: prevent document-row removal and driver-tab teardown during uploads/cleanup; refresh driver draft validation on form status/value/language changes; keep saved country/nationality option labels through the shared merge described in the Frozen `COMPANIES_LOOKUP_MAINTENANCE_EVOLUTION_PLAN.md`. Required non-null billing numbers reject clearing; CreditPeriod also mirrors the API int range/integer contract. Inline Company lookup errors use the existing suppression option and an explicit Retry, preventing duplicate global feedback and recovering the blocked required Branch lookup. Editor wiring adopts inherited BaseComponentService members. No API/schema/business-policy change.

Final source reconciliation also confirms that list Branch/Contact Group lookup failures currently combine inline warnings with unsuppressed interceptor dialogs and leave their controls unavailable without retry. Apply the same existing select-call suppression options and one inline Retry; keep individual loading flags so retry cannot overlap either request. Mutations retain interceptor-owned feedback. Expand compressed callbacks/if blocks under Master 5 G10 while preserving the owner's existing resolveListPaging change. Driver validation-summary focus must observe the same tracker busy guard as the tab buttons. No frozen read/write contract changes.
