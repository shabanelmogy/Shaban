| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Staff record and scaffold disposition — 2026-10-03

Root reviewed staff_record_ui read-only audit, existing StaffAddVM/StaffUpdateVM, shared CustomerDocumentAddVM, salary response/request and current routes. Canonical screen03 routed step editor + normal paged list. Job list and IndividualPartner step editor are approved references; no supplied screenshots. Source-only acceptance.

List GET Staff generic Results with pageNo/pageSize and Filters search/isInactive; row id/no/firstName/middleName/lastName/email/mobileNo/staffDesignation matches Code/derivedDisplayName/Mobile/Email/Designation. No invented sort. Unchecked inactive checkbox omits filter/all, checked true/inactive; explicit false remains supported for reports. Default15/options10,15,20,50,100; applied filter snapshot, cancellation, route query retention, shared full export.

Create POST Staff editable sponsorship/name/gender/nationality/DOB/contact/address/employment/notes/isInactive/documents/eligibilities and optional salaryPackage. Update same without salaryPackage + root id. Saved child IDs and address identity preserved; new child ID omitted/0, full snapshots remove omitted saved rows under existing protected ownership. No tenant/audit/number/deleted fields.

Address preserves loaded label/isPrimary/inPrivacy and editable address/city/state/zip/country. Documents follow actual shared CustomerDocument VM: type/number/issue/expiry required; path/issuedBy optional max400/max100; number max100; expiry strictly after issue. Reuse shared partner DocumentRow/factory/mapper/upload mechanics, preserve Staff enum choices33..38. Upload folder `staff` retains existing feature policy; do not silently switch to CustomerDocuments. Pending upload cleanup cannot close after failure or repeat a successful save.

Eligibility retains leaveTypeId?/salaryItemType/afterYears/eligibleFor and optional identity; read alias eligiblalityFor hydrates only. Date validation retains DOB<=today/join>=DOB/confirmation>=join. Names max100; contact/notes match VM limits. Exact existing enums preserved, no index-derived IDs.

Salary GET/PUT Staff/{id}/SalaryPackage separate action. Editable inputs applicableFrom,basic,transportationAllowance,houseAllowance,overtimeNormal,overtimeHoliday; gross is server-derived from three components and omitted from writes. Read response retains gross for presentation. Create salary editable; record Edit/View salary read-only. Same-date revision replaces under atomic persisted write; effective date/payroll rate policy preserved. No schema.

Create/View/Edit share four steps Details/Documents/Salary/Eligibility. Successful loaded detail gates Edit/Save/child mutations; lookups edit-only, view uses detail display labels (backend DTO gains only needed labels if absent). Structured shared typeable dates, date validators, shared validation summary/focus/field errors, EditableRows stable identities, shared table/file/sections/shell and fixed footer. Dirty route exit and salary close use canonical confirmation. All in-flight form controls/actions gated, failed saves retain entered data. Standard mutation feedback interceptor, inline reads skip-error header/apiErrorMessage, no duplicate toasts.

Routes /Staff,/Staff/create,/Staff/view/:id,/Staff/edit/:id stay with query state and CanDeactivate. StaffProfileService is a live generic lookup consumer and kept. StaffPartner is retired: exact UI1 dead-product scaffold signature, product columns/no-op actions/invented branch-designation-audit write schema, no domain/menu consumer. Remove its source + root lazy route/LayoutModule provider/import/runtime config. No Staff entity or saved data is deleted. This source retirement supersedes the plan's initial Refactor classification (append amendment required).

File ownership: staff_record_ui owns Staff/ and StaffPartner/ only; root owns routing.ts/LayoutModule/tsconfig/translations/artifacts; staff_backend owns actual APIs/DTOs/profiles/services. Optional StaffService getList/getAllList options supports skipErrorInterceptor; reports call getAllList(filters,{skipErrorInterceptor:true}); inherited getSelectList remains. UI1/3/4/6/8/10/12/14/17/18/19/22/23/27/28 conformance reconciled with final source.

Frozen clarification (2026-10-03): HEAD create initialized ApplicableFrom to today, required it, and always submitted a default salary package with six zero amounts. Preserve that default, while exposing a create-only Include Salary Package checkbox initially checked to reflect the already-optional API contract. Unchecking disables/excludes salary validation and omits salaryPackage; Edit/View keep their existing read-only salary action. This adds no payroll formula, schema, revision transition or new persisted flag. Repeated discard confirmations are gated like other in-flight operations.

## Direct import consumer reconciliation

The existing Administration/DataImport/ImportStaff CSV template is a direct producer of the frozen Staff import contract. Root adds only its required dateOfJoining model/column/date transport plus en/ar header; gender and dateOfBirth columns already exist. Owners must download the updated CSV template. This bounded adapter update does not authorize a general Administration/import-screen rewrite.

## Owner feedback reconciliation — one collection Add action

Owner reported duplicate Add Document / Add Eligibility buttons. Root verified UI14, the actual shared EditableCollectionTable toolbar and the IndividualPartner document reference: the shared table already owns Add when editable/addLabel are set. Removed the two projected section-header Add buttons and bound each table's addRequested to its existing guarded addDocument/addEligibility handler. The enclosing section keeps its title; headingVisible=false hides only the table heading, not its toolbar. No shared component or record workflow change. Source-only verification; owner visual acceptance pending.

## Owner extension — fifth Bank Accounts step

The later screenshot and explicit `ضيفه` authorize extending the earlier four-step contract. STAFF_BANK_ACCOUNTS_CONTRACT_FREEZE.md owns the additive five-field bank collection, DTOs, ownership/snapshot compatibility and new schema; the step order is now Details/Documents/Salary/Bank Accounts/Eligibility. Root extends the same editor and aggregate. This amendment supersedes the earlier four-step/no-schema statements only for this new collection; all existing salary/document/eligibility and upload contracts remain in force.

## Owner amendment — Confirmation strictly after Joining, 2026-10-03

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

The owner requests Date of Confirmation after Date Of Join in Staff. Existing fields are already ordered Joining then Confirmation; the current UI/service validators permit the same day. The revised date-only contract is **Confirmation > Joining when Confirmation is supplied**: the same day and earlier days fail Create/Update. Confirmation remains optional. The existing `confirmation>=join` statement above is historical and superseded only for this comparison. No existing record is changed automatically; an Edit with a same-day historical value requires correction or clearing before Save. View remains available.

Angular retains the typed parent form, local-date helpers, shared picker/mask and validation-summary focus. The Confirmation calendar minimum is the next local calendar day, cached by normalized Joining date, following IndividualPartner's minExpiryDate reference. Manual entry and changing Joining are checked by the group validator. Backend uses the existing DateAfter attribute on both write VMs with a Staff-specific en/ar resource; the duplicate service comparison is removed under BE3. StaffController is ApiController and the generic Create/Update actions enforce model validation. Current Staff import has no Confirmation input, so no alternate supplied-Confirmation writer is introduced. API shape, mappings, salary, children and schema remain unchanged.

## Owner correction — same-day Confirmation allowed, 2026-10-03

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Owner clarification `ممكن يكون نفس اليوم` supersedes the strict-after amendment above. Final date-only rule: supplied Confirmation **>= Joining**; reject only earlier days. Confirmation stays optional. The picker minimum is Joining itself, not the next day. Angular group validation and messages match the inclusive boundary. DateAfter gains an explicit AllowEqual option, default false for compatibility; only Staff Add/Update opt in with the existing Staff message key updated to on-or-after wording. Existing strict document expiry consumers stay strict. No saved data, DTO shape, mapping, schema or payroll formula changes. The prior same-day-record correction requirement is superseded.
