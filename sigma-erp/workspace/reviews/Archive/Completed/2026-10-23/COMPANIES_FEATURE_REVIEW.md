# Companies refactor — final source reconciliation

## Paging-helper adoption — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner: apply the existing paging helper in Customers/Companies |
| Scope | CompanyPartner/components/list/list.component.ts; existing feature review |

This follow-up preserves the historical refactor report below. Scoped discovery found one server-paged UI handler under Customers/Companies: CompanyPartner list. CompanyDriver contains services/models, and the nested forms do not own another server-paged list handler.

| Concern | Owning block | Actual reference / shared owner | Before / agreed target |
|---|---|---|---|
| Table paging | UI 6; Phase-02 packet | Workshop/Job list onLazyLoad; shared utils/list-query.ts resolveListPaging | Replace local offset/page conversion with the helper against previous pageNo/pageSize before signal writes. A size-only change must fetch; identical page/size/sort skips. |
| Page-size limit | Existing Company list/API query contract | CompanyPartnersComponent onLazyLoad and readListRoute; CompanyPartnerListQuery / toListParams | Preserve existing 10–100 range. Apply the feature's 100-row cap to the event before the helper calculates the page; helper retains its shared 10-row minimum. |
| Sorting and filters | UI 5/6 | Company columns/isSortField/currentQuery | Preserve sortable-column whitelist, current sort-order fallback, activeFilters and the same query serializer. Sort-only changes still request data. |
| Request lifecycle | UI 28/22 | Job bindListQueries; Company bindListRequests/requestList | Existing Subject/switchMap/defer/finalize already matches; retain full-query deduplication, forced Search/refresh and route-state writes. |

All eight generated packets passed Generate-SigmaRecipes.ps1 -Check before implementation. This applies the previously documented rule; no new canonical rule or generated-packet edit is needed. No API, template, model, default page size, editor, or accounting behavior change is authorized or required. No subagent: one small sequential handler change.

Final reconciliation: the only application diff is the CompanyPartner list import and onLazyLoad handler. resolveListPaging reads the previous signal values before writes; sorting is compared separately, the existing 100-row limit is applied before page conversion, and currentQuery/requestList still own the active filters, route state, deduplication and switchMap stream. Source reasoning confirms a page-1 change from 10 to 50 requests again; identical page/size/sort skips; first 100 with rows 50 resolves page 3; sort-only changes still request. These are source traces, not executed tests. Scoped diff/whitespace checks passed. No build, test, lint, browser, database, migration, commit or push was run. Owner acceptance pending for size changes, page navigation, sorting and rapid paging. Suggested frontend commit: `refactor(companies): reuse shared list paging helper`.

---

Date: 2026-10-01  
Status: implemented and source-reviewed; owner compilation, runtime and migration verification pending.  
Scope: Customers/Companies (CompanyPartner, Company compatibility entry, CompanyDriver, CompanyContactPerson), their directly related backend contracts, and necessary shared UI integration.  
Frozen contract: COMPANIES_REFACTOR_CONTRACT_FREEZE.md.

## Result and phases

| Phase | Outcome |
|---|---|
| PLAN-00 / 0 | Existing owners discovered. Company and CompanyPartner use the same Company entity/API; CompanyDriver uses Driver; CompanyContactPerson is distinct from Company.Contacts. No screenshot was supplied for this request. Earlier Workshop screenshots do not define Companies business. |
| 1 | Contract frozen before delegation. Existing fields, billing preferences, collections, and customer actions retained. No approval or accounting workflow invented. |
| 2 | Shared list shells, filter/reset, page state, server pagination/sort, export and lean scalar projections implemented. |
| 3 | Typed aggregate form, five steps, isolated driver draft, complete collection snapshots, ownership validation and tracked writes implemented. |
| 4 | View/Edit/Delete, agreement history, contact-group change and masked card export reconciled with API contracts. |
| 5 | Routes, legacy aliases, toolbar, translations, uploads and shared dialog sizing reconciled in source. |
| 6 | Scoped source review and read-only checks completed. Build, browser, runtime and database acceptance intentionally remain owner-pending under AGENTS. |

## Decisions and evidence

| Area | Decision and source evidence |
|---|---|
| Company screen | Routed five-step aggregate because existing Company owns contacts, billing/cards, documents and drivers. Existing shared StepForm, editor shell, FormSection and editable-table components own presentation. |
| Duplicate Company screen | Old Company URLs now use CompanyPartner implementation; source had one Company API/entity and an incompatible duplicate frontend. Compatibility exports retained. |
| Independent masters | Driver and CompanyContactPerson use controlled list-owned Add/View/Edit dialogs. No CompanyId input invented for their standalone APIs. |
| Driver contract | Actual DriverAddVM/UpdateVM first/last/mobile requirements restored. MiddleName is optional; gender, countries, address, documents and dates match existing domain. Future birth dates rejected in standalone and nested writes. |
| Contacts | Company.Contacts uses Contact numeric designation/category/type; CompanyContactPerson uses its existing string designation. Hidden owned-contact values survive edit. |
| Shared forms | New shared partner models/factories own document/card/address row types and local-date mapping. Parent creates the form graph once; children receive its existing groups/arrays. |
| Lists | Shared list shell provides card/shadow, square outer edges, aligned title/filter/table, fixed paginator and internal row scroll. Default page 10, API totals, allowlisted sort, switchMap and saved query state. |
| Filters | Company active filter maps its existing InActive field, treating null as false. An internal alias avoids generic binding to inherited Partner.IsInactive. Other existing public filters preserved. |
| View failure | Detail failure exposes retry and never leaves an empty editable form. View uses saved display labels instead of unnecessary lookup requests. |
| Uploads | Isolated driver draft tracker transfers pending/removal ownership to aggregate only on draft Save. Draft Cancel affects only its own uploads. Root compares original versus saved paths before cleanup after aggregate persistence. Failed persistence retains saved attachments. Cleanup failure allows retry without submitting Create again. |
| Write snapshots | Saved child IDs retained, new IDs 0, omitted owned rows removed through tracked reconciliation. Duplicate/foreign IDs and nested document/address ownership rejected before mapping. |
| Deletion | Existing soft-delete mechanics retained, actual partner/driver dependencies checked, owned children handled explicitly. No new deletion permission system. |
| Default contact group | Existing group/account creation can reach multiple saves; Company Add/Update/contact-group change own an explicit transaction on that branch. Other single-save tracked writes use implicit EF transaction. |
| Uniqueness | Existing CompanyName/VAT business checks retained. TPT places tenant/deletion fields on a base table; global VAT unique index preserved. Tenant-safe database uniqueness remains a separate schema decision (see residuals). |
| Numbering | Existing numbering policy preserved. No graph-wide renumbering introduced to update existing Company/Driver records. Nested new-driver numbering limitation remains documented. |
| Calculations | This customer-master save creates no invoice/journal. Billing values are preferences, with existing numeric enums and Fixed/Percentage strings. No tax/calculation behavior changed. |
| Permissions | Existing authentication/interceptors retained. No permission API invented; action visibility is presentation only. |

## Grid and API shape reconciliation

| Grid / displayed columns after Actions | ListVM members |
|---|---|
| Companies: no, companyName, contactGroup, contactNo, website, email, inActive | Id, No, CompanyName, ContactGroup, Phone1, Phone2, Website, Email, InActive; ContactGroupId is needed for the existing action. contactNo is the Phone1/Phone2 display fallback. |
| Contact people: designation, firstName, lastName, contactNo, email | Id, Designation, FirstName, LastName, ContactNo, Email. Inherited audit/tenant/navigation payload removed. |
| Drivers: no, firstName, middleName, lastName, mobileNo, email | Matching scalar values plus Id. Existing DriverListVM navigation members remain because agreement pickers consume them; an API-breaking cleanup was rejected. |

Write DTOs contain editable inputs only; root Update carries Id. Complete contacts/drivers/documents/cards snapshots are always supplied. Server-owned tenant/audit/No fields are not in client write payloads. Existing business switches such as InActive, IsBroker and billing/card flags remain editable because their write contracts expose them.

## Actions

| Action | Route and behavior |
|---|---|
| Company detail | GET Company/GetByWithNavigationsId/{id}; five-step shared editor, read-only View. |
| Company create/update | POST / PUT Company; all fields validated on Save, active group validated on Next, failed save keeps draft. |
| Driver create/update/detail | Existing Driver endpoints; typed detail/documents tabs. Nested driver draft makes no standalone API save. |
| Contact-person create/update/detail | Existing CompanyContactPerson endpoints; optional scalar fields and matching lengths/email validation. |
| Delete | Existing DELETE ?id=; shared confirmation, actual dependency checks and last-page fallback. |
| Agreement history | GET Company/{id}/agreements; shared history reader loads rental/lease projections separately before combining, preserving public Company DTO. |
| Change contact group | PUT Company/{id}/contact-group with contactGroupId; tenant-scoped reference validation and existing default-group policy. |
| Ordinary export | Current filters, all server pages, shared export mapping. |
| Credit-card export | New GET Company/credit-card-export with normal list paging/filter contract; masked final four digits only, no CVV. Full card data is not pulled from lean list projection. |

## Backend overrides and AutoMapper

- Company list uses base filtering/paging hooks, with a minimal GetMany alias override for the InActive collision; MaterializeList uses ProjectTo with displayed scalar columns.
- Company/Driver detail use scalar ProjectTo and exclude deleted owned rows.
- Company and Driver Add validate source-supported required fields, enum/date rules and supplied tenant-scoped references before inherited persistence.
- Company and Driver Update need aggregate ownership checks, removal guards and tracked child reconciliation. Their update maps ignore owned navigations, then CustomerAggregateSnapshot maps each validated owned row/reference.
- Company and Driver Remove need real dependency checks and owned-child handling. Generic controller methods remain inherited.
- Contact-person service uses list hooks and normalization; scalar maps retain actual designation/name/contact/email values.
- Agreement-history and card-export DTOs have separate files; no named helper DTO classes nested inside services.
- Existing customer delete/document/history helpers and DTOs were reused without overwriting their contracts.

## Schema / owner migration

Owner must create and review:

`Add-Migration AlignCompanyContactPersonFieldsAndCompanyDetailLength`

Reason: CompanyContactPerson optional fields and EF lengths now agree (designation/name 100, contact number 50, email 254); Company.OtherDetail is bounded to 2000. Review existing data for values exceeding those new limits before applying schema. No migration or ModelSnapshot was created, edited or run.

## Source-only evidence

- Follow-up NG8008 correction: the nested driver draft now supplies required FormValidationSummaryComponent countLabel using existing companyForm.invalidFields translations. All Companies summary usages have the required title/items/countLabel inputs; build remains owner-pending.
- Frontend and backend `git diff --check`: no whitespace errors; only existing line-ending conversion notices.
- All relative imports under Companies resolve to files.
- No active feature SCSS remains; shared styles own all presentation.
- Scoped source searches found no ad hoc HttpClient providers, manual auth, untyped any, ES2018-incompatible flatMap/fromEntries/at, or bare appEditableCollectionRow bindings.
- Six Companies translation namespaces: **196 English / 196 Arabic keys**, no missing/case mismatches. Touched shared keys also reconciled. Unrelated historical mangeDetails parity gaps remain out of scope.
- Company/Driver/Customer GeneralMessage resources parse as XML and scoped keys match.
- Routes and compatibility aliases inspected; toolbar suppresses duplicate titles for all four Companies entries.
- Deleted CompanyContactPersonFullListVM / CompanyActionsVM names have no stale references in related backend layers.
- No real merge markers found; legacy cache comments contain separator text only. Unused historical cache service/spec remain with no active Companies consumers.
- Check-BookReferences: **all checked references resolve**.
- Initial Generate-SigmaRecipes -Check passed before implementation. After canonical documentation promotion, final -Check reports **all eight generated packets stale**; regeneration plus semantic review is required. Generated files were not hand-edited.
- No build, tests, lint, browser/application verification, DB command, migration, snapshot edit, commit, push or deployment was run.

## Documentation and reusable learning

Updated project sigma-screen-refactor skill and corresponding canonical blocks in the same task:

- UI 13: shared bounded dialog flex chain; body/form scroll inside the shell.
- UI 14 / 18: parent-owned typed collection factories, local-date payloads, isolated nested upload ownership transfer and whole-row attachment cleanup.
- BE 14: tracked customer snapshot helper, mapping ownership and shared rental/lease history reads.
- UI preamble version 1.09, BE preamble 0.50 and CHANGELOG rows updated.
- Feature-specific uniqueness/numbering limitations stay in this report rather than becoming universal skill rules.

## Residuals and manual owner acceptance

| Item | Limit / owner verification |
|---|---|
| Compile/runtime | Source checks do not prove compilation or execution. Run frontend/backend builds and exercise all scoped flows. |
| Shared dialog flex | Other EditorDialog consumers share the bounded-height change; inspect large/small screens, Arabic RTL and dark theme. |
| Company uniqueness | Service checks are tenant-scoped but the legacy database VAT constraint remains global. Concurrent CompanyName duplicates are still possible; cross-tenant/recreated VAT restrictions remain. Requires deliberate TPT schema/uniqueness plan. No concurrency-safe claim. |
| New nested Driver No | Company PUT historically does not number a newly added Driver. The generic graph generator can traverse parent back-references and renumber other records, so it was not invoked blindly. A new nested driver may retain an empty No; standalone Driver POST retains existing generation. |
| Existing data | Required Driver first/last/mobile values and new length validation can expose legacy incomplete/oversized rows during edit. Review before migration and provide valid values when editing. |
| Recipes | Regenerate all eight derivative packets with the canonical generator and review their semantics. This source task intentionally reports drift. |

Owner checks:

1. Company create with all five steps; edit adds/updates/removes saved and new contacts, documents, cards and drivers; reload proves IDs/values persisted.
2. Driver draft Cancel leaves parent unchanged; Save changes only the local aggregate until Company Save. Replacing/removing uploads followed by failed Company Save preserves original saved files.
3. View displays billing, enums, saved lookup labels, driver address/documents and company child rows. Failed detail stays read-only with retry.
4. List paging/sort/search/reset/active filter and query-state return; delete last row on final page; confirm dependency failure keeps the list usable.
5. Agreement history and group-change failure/success recovery; ordinary/card export respects filters/all pages and exported card file contains no CVV/full card number.
6. Standalone Driver and Contact-person create/view/edit/delete; legacy Company/Driver/ContactPerson deep links open the canonical owners.
7. Internal scrolling with validation/errors, keyboard focus to invalid fields across steps/tabs, RTL, themes and shared dialog consumers.
8. Compile both repositories, review the owner-created migration, then apply it through the owner's normal workflow.

## Agent utilization

The contract was frozen by root before delegation. Three bounded workstreams used inherited models: companies_backend (backend contracts/services/mapping/EF), companies_auxiliary_frontend (Company compatibility, Driver and ContactPerson), companies_list_frontend (CompanyPartner list/models/service). Root owned main aggregate editor, shared integration, translations, docs and final reconciliation. Separate file ownership reduced implementation wall-clock time; integration was performed by root. Backend follow-up could not resume due its usage limit; root completed the date/history follow-up directly.

## Suggested commits (not executed)

- Frontend: `refactor(customers): unify companies editors and shared list patterns`
- Backend: `refactor(customers): reconcile company aggregates and typed customer contracts`
- Documentation: `docs(sigma): promote typed partner forms and nested upload ownership`

## File inventory

Paths below are repository-relative. M = modified, D = deleted, ?? = added/untracked. Directory entries include the new form utilities detailed above.

### Frontend — F:/My Work/Sigma/SiGmaAngularFrontEnd

- `M` `src/app/_metronic/layout/components/toolbar/toolbar.component.ts`
- `M` `src/app/modules/Customers/Companies/Company/company.routes.ts`
- `M` `src/app/modules/Customers/Companies/Company/components/details/details.component.html`
- `D` `src/app/modules/Customers/Companies/Company/components/details/details.component.scss`
- `M` `src/app/modules/Customers/Companies/Company/components/details/details.component.ts`
- `M` `src/app/modules/Customers/Companies/Company/components/list/list.component.html`
- `D` `src/app/modules/Customers/Companies/Company/components/list/list.component.scss`
- `M` `src/app/modules/Customers/Companies/Company/components/list/list.component.ts`
- `M` `src/app/modules/Customers/Companies/Company/models/create.ts`
- `M` `src/app/modules/Customers/Companies/Company/models/details.ts`
- `M` `src/app/modules/Customers/Companies/Company/models/list.ts`
- `M` `src/app/modules/Customers/Companies/Company/services/company.service.ts`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/companycontactperson.routes.ts`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/components/details/details.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyContactPerson/components/details/details.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/components/details/details.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/components/list/list.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyContactPerson/components/list/list.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/components/list/list.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/models/create.ts`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/models/details.ts`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/models/list.ts`
- `M` `src/app/modules/Customers/Companies/CompanyContactPerson/services/companycontactperson.service.ts`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/companydriver.routes.ts`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/components/details/details.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyDriver/components/details/details.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/components/details/details.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/components/list/list.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyDriver/components/list/list.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/components/list/list.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/models/create.ts`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/models/details.ts`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/models/list.ts`
- `M` `src/app/modules/Customers/Companies/CompanyDriver/services/companydriver.service.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/billing-info/billing-info.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/billing-info/billing-info.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/billing-info/billing-info.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/contact-persons/contact-persons.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/contact-persons/contact-persons.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/contact-persons/contact-persons.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/credit-cards/credit-cards.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/credit-cards/credit-cards.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/credit-cards/credit-cards.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/detail/detail.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/detail/detail.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/detail/detail.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/documents/documents.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/documents/documents.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/documents/documents.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers/drivers.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers/drivers.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers/drivers.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/list/list.component.html`
- `D` `src/app/modules/Customers/Companies/CompanyPartner/components/list/list.component.scss`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/components/list/list.component.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/models/create.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/models/details.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/models/list.ts`
- `M` `src/app/modules/Customers/Companies/CompanyPartner/services/companypartner.service.ts`
- `M` `src/app/modules/i18n/vocabs/ar.ts`
- `M` `src/app/modules/i18n/vocabs/en.ts`
- `M` `src/app/modules/shared/components/editor-dialog/editor-dialog.component.scss`
- `M` `src/app/modules/shared/components/editor-dialog/editor-dialog.component.ts`
- `M` `src/app/modules/shared/service/document-upload-tracker.service.ts`
- `M` `tsconfig.app.json`
- `??` `src/app/_metronic/shared/enums/partnerDocumentType.ts`
- `??` `src/app/modules/Customers/Companies/CompanyDriver/components/details/driver-fields.component.html`
- `??` `src/app/modules/Customers/Companies/CompanyDriver/components/details/driver-fields.component.ts`
- `??` `src/app/modules/Customers/Companies/CompanyDriver/utils/`
- `??` `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers/driver-draft.component.ts`
- `??` `src/app/modules/Customers/Companies/CompanyPartner/utils/`
- `??` `src/app/modules/shared/models/partner-editor.ts`
- `??` `src/app/modules/shared/utils/partner-editor-forms.ts`

### Backend — F:/My Work/Sigma/SigmaBackend

- `M` `SiGma.Business/IServices/ICompanyService.cs`
- `M` `SiGma.Business/MapperConfig/CompanyContactPersonProfiler.cs`
- `M` `SiGma.Business/MapperConfig/CompanyProfiler.cs`
- `M` `SiGma.Business/MapperConfig/DriverProfiler.cs`
- `M` `SiGma.Business/Services/CompanyContactPersonService.cs`
- `M` `SiGma.Business/Services/Customers/CompanyService.cs`
- `M` `SiGma.Business/Services/DriverService.cs`
- `M` `SiGma.DataAccess/Configuration/CompanyConfig.cs`
- `M` `SiGma.DataAccess/Configuration/CompanyContactPersonConfig.cs`
- `M` `SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx`
- `M` `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
- `M` `SiGma.Helpers/Models/CompanyContactPerson.cs`
- `M` `SiGma.ServerAPI/Controller/CompanyController.cs`
- `D` `SiGma.ViewModels/ViewModels/Company/CompanyActionsVM.cs`
- `M` `SiGma.ViewModels/ViewModels/Company/CompanyAddVm.cs`
- `M` `SiGma.ViewModels/ViewModels/Company/CompanyListVm.cs`
- `M` `SiGma.ViewModels/ViewModels/Company/CompanyUpdateVm.cs`
- `M` `SiGma.ViewModels/ViewModels/CompanyContactPerson/CompanyContactPersonAddVM.cs`
- `M` `SiGma.ViewModels/ViewModels/CompanyContactPerson/CompanyContactPersonDetailVM.cs`
- `D` `SiGma.ViewModels/ViewModels/CompanyContactPerson/CompanyContactPersonFullListVm.cs`
- `M` `SiGma.ViewModels/ViewModels/CompanyContactPerson/CompanyContactPersonListVM.cs`
- `M` `SiGma.ViewModels/ViewModels/CompanyContactPerson/CompanyContactPersonUpdateVM.cs`
- `M` `SiGma.ViewModels/ViewModels/Driver/DriverAddVm.cs`
- `M` `SiGma.ViewModels/ViewModels/Driver/DriverUpdateVm.cs`
- `??` `SiGma.Business/Services/Customers/CustomerAggregateSnapshot.cs`
- `??` `SiGma.Business/Services/Customers/DriverDeleteReferences.cs`
- `??` `SiGma.ViewModels/ViewModels/Company/CompanyAgreementHistoryVM.cs`
- `??` `SiGma.ViewModels/ViewModels/Company/CompanyContactGroupUpdateVM.cs`
- `??` `SiGma.ViewModels/ViewModels/Company/CompanyCreditCardExportVM.cs`

Preserved/reused preexisting or concurrently supplied files: CustomerDeleteReferences.cs, PartnerDocumentRules.cs, CustomerAgreementHistory.cs, CustomerAgreementHistoryVM.cs, CustomerContactGroupUpdateVM.cs. IndividualPartnerActionsVM.cs has a working-tree line-ending notice with no semantic diff and was not edited for this Companies task.

### Project/documentation artifacts

- F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/COMPANIES_REFACTOR_CONTRACT_FREEZE.md
- F:/My Work/Sigma/reviews/Archive/Completed/2026-10-23/COMPANIES_FEATURE_REVIEW.md
- F:/My Work/Sigma/reviews/COMPANIES_AUXILIARY_TRANSLATIONS.json (integration handoff; translations already applied)
- F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md
- F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/00-preamble.md
- F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/13-modal-with-tabs.md
- F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/14-editable-collection-table.md
- F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/18-documents-and-upload.md
- F:/My Work/Shaban Documents/Shaban/sigma-erp/backend/00-preamble.md
- F:/My Work/Shaban Documents/Shaban/sigma-erp/backend/14-pattern-2-master-detail-no-financial-effect.md
- F:/My Work/Shaban Documents/Shaban/sigma-erp/CHANGELOG.md

