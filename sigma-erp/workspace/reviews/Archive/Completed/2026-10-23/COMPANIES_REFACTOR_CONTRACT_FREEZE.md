# Companies screen refactor — 2026-10-01

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | `SiGmaAngularFrontEnd/src/app/modules/Customers/Companies` and directly related Company, Driver and CompanyContactPerson API contracts |
| Authority | Root AGENTS; Master 1–7; UI screen catalog types 01 and 03; BE patterns 1 and 2 |
| Packets | PLAN-00 discovery of existing owners; phases 0–6 as applicable; `Generate-SigmaRecipes.ps1 -Check` passed |

## Manifest and existing-state decisions

No screenshots supplied for this request. Current source is functional evidence; the canonical books own presentation. Frontend scope was clean at discovery. Backend contained four untracked user-owned customer helpers/DTOs: CustomerDeleteReferences, PartnerDocumentRules, CustomerAgreementHistoryVM and CustomerContactGroupUpdateVM; preserve and reuse compatible capabilities, do not overwrite them.

| Area | Existing owner/evidence | Decision and reason |
|---|---|---|
| CompanyPartner | Company API, Company entity, five steps | Refactor to type 03, same five business groups, shared editor shell; several child collections require a routed editor |
| Company | Same Company API, obsolete unrelated product columns and incomplete company form | Replace duplicate implementation with compatibility aliases/wrappers to CompanyPartner. There is one Company entity and one correct aggregate editor |
| CompanyContactPerson | CompanyContactPerson API/entity; designation/name/contact/email fields | Type 01 list + one controlled Add/View/Edit modal; normal entity, no owned collections |
| CompanyDriver | Service already calls Driver API; name-only write is incompatible with DriverAddVM | Type 01 list + modal using actual Driver first/middle/last name, gender, nationality, contact, birth date, notes, address and one document collection |
| Company drivers | Company.Drivers owns Driver rows and their documents/address | Keep isolated nested draft: parent changes only on draft Save. Root Save sends complete snapshot |
| Company contacts | Company.Contacts owns Contact rows, not CompanyContactPerson | Preserve this distinction; no new relationship/schema invented |
| Financial behavior | Customer billing preferences only; save creates no invoice/journal | BE pattern 2 Company/Driver, pattern 1 CompanyContactPerson; no new accounting action or approval lifecycle |

## Target read and filter contracts

All grids: Actions first, `app-data-table [fill]`, API total, page default 10 and size 1–100; stable allowlisted sort inside `Filters`; one switchMap list stream. `toListParams`/`fetchAllPages` own transport. Filters use `appFilterPanel`, mandatory Reset. Navigation round trips preserve list query state.

| Grid | Visible columns in order | Required API members |
|---|---|---|
| Companies | no, companyName, contactGroup, contactNo (phone1/phone2 fallback), website, email, inActive | Id, No, CompanyName, ContactGroup, ContactGroupId (action), Phone1, Phone2, Website, Email, InActive |
| Contact people | designation, firstName, lastName, contactNo, email | Id and matching scalar fields |
| Drivers | no, firstName, middleName, lastName, mobileNo, email | Id and matching scalar fields; retain legacy Driver read members when direct consumers still need them |

Company filters retain `branchId`, trimmed `search`, `agreementStatus` (0 open/1 closed), `isInactive`; default active companies (`isInactive=false`, null legacy inactive flag treated as false). Existing external filter keys remain compatible. Company sorts use API fields only. Contact/Driver: trimmed search, applicable existing scalar filters and sort allowlist. No date filter is invented for a customer master.

## Detail/Add/Update contract

The existing backend VMs are authoritative; strict Angular interfaces reproduce their client inputs. Root Update has `id`; child saved rows carry their own `id`, new rows 0. No tenant, number, audit or persistence flags in payloads. Business switches `inActive`, `isBroker`, `isBlacklisted`, `isDefault`, `emailInvoices` stay because their VMs explicitly expose them and the UI edits them.

Company header: companyName (required), branchId (required), email (required email), VAT, website, phone1/phone2, salesPersonId/contactGroupId/debtCollectorId, otherDetail, inActive/isBroker, invoiceGenerationMethods. Address: label/address/city/state/zipCode/countryId/isPrimary/inPrivacy. Billing: creditPeriod/creditLimit/TRN, tariffCardId/currencyId, invoicing and lease rules/types, taxRule, fines/tolls invoice, rental/lease Salik/fine/Darb surcharges, their existing Fixed/Percentage fields, customerWiseDiscount, clubInvoicingCharges/emailInvoices/isBlacklisted. Root lists: contacts/drivers/documents/creditCards, always complete arrays.

Contact row: id, designation/category/type, firstName/lastName/mobileNo/contactNo/email. Hidden category/type/mobile are preserved from detail, default category 0 and Customer type 0 for new rows per existing company payload. Driver: id, firstName (required), middleName (optional), lastName (required), mobileNo (required), optional gender/email/nationality/phoneHome/phoneWork/birthDate/notes, optional address, documents. Document: id, numeric documentType, documentNumber/issuedBy, issueDate/expiryDate, documentPath, isInternational. Card: id, numeric type, cardNumber/expiry/cvv/nameOnCard/bankName/isDefault/activeDate. CVV remains only in the existing editor/API contract; no secrets or unmasked card numbers in export.

Enum IDs follow backend numeric values; Fixed/Percentage remain strings. Dates use shared local-date helpers, not UTC conversion. View keeps all detail values and disables mutation; detail failures must never leave an empty editable form. Dropdown lookups use existing select endpoints; required lookup failure stays visible. Each bill preference remains beside its type in a business section.

## Action and integration contracts

| Action | API/behavior | Recovery |
|---|---|---|
| Company View/Edit/Create | GET Company/GetByWithNavigationsId/{id}, POST/PUT Company | Fixed five-step editor; Save validates all steps, Next validates active step; dirty exits confirmed |
| Delete | Existing DELETE controller?id= | Shared confirmation; backend blocks actual foreign references and soft-deletes owned children; last page falls back one page |
| Agreement history | GET Company/{id}/agreements | Read-only shared dialog/grid; identity check/cancellation, loading/error/empty states |
| Change contact group | PUT Company/{id}/contact-group {contactGroupId} | Typed dialog, validate group, reload list after success; null keeps existing default-group behavior |
| Activate/deactivate | Existing base IsActive endpoint | Not added: Company.InActive is its separate existing business switch edited through the aggregate |
| Approve/post/down payment | No corresponding company-master state/document | Not applicable; no workflow invented |
| Export | Current filters, all server pages; shared export mapping | No fabricated card detail from a lean ListVM; keep CC action via typed export-only endpoint if implemented, with masked number and no CVV |

Routed CompanyPartner keeps list/create/view/edit and legacy details alias. Company aliases retain old URLs without another business implementation. Contact/Driver retain list only with controlled editor modal; legacy deep links are compatibility navigation, not a second editor. Root HttpClient/interceptors only. Standard mutations use interceptor success/error; inline list failures suppress error interceptor and use apiErrorMessage. Form/draft state survives failure.

Upload ownership: editor-scoped DocumentUploadTracker; app-file-field; no unversioned enum cache; uploads removed/replaced only cleaned after successful save, unsaved uploads cleaned on discard. Driver draft cancellation must not delete a parent-owned attachment or discard uploads from another driver.

## Backend, override and migration decisions

Company uses base ApplyListFilters/ApplyListOrder/MaterializeListAsync(ProjectTo), Add/Update validation and tracked snapshot reconciliation, dependency-aware Remove. Every child reference/ownership checked, including nested driver documents. Every required FK exists under tenant scope; optional FKs checked when supplied. Duplicate normalized CompanyName and nonblank VAT retain existing business checks and the legacy global VAT index. TPT tenant-scoped database uniqueness and nested new-driver numbering limitations are documented in COMPANIES_FEATURE_REVIEW.md; no schema policy is silently invented. Do not change numbering/account-group policy. Reuse source-supported customer delete/document helpers.

Driver retains its real API and other screen consumers, adds safe reference/child validation and dependency checks where missing; no company linkage field invented. Contact person retains string Designation and existing optional fields; no unsupported unique name rule. Inherited controller methods retained. Single SaveChanges uses implicit transaction; if default-group creation and aggregate need multiple saves, one owning transaction protects complete path.

Schema effects, if an index/configuration change is needed, are reported for owner-run Add-Migration only. No migration, model snapshot, build, test, lint, database command, commit, push or browser verification is run.

## Ownership and verification

Root: contracts, CompanyPartner aggregate frontend, integration, translations and final review. Independent backend and auxiliary frontend work may be delegated with non-overlapping files after this freeze (AGENTS Controlled multi-agent strategy). Final evidence: complete scoped diffs, stale consumer search, DTO/column/filter matching, upload and child snapshot review, translation parity, whitespace and route checks. Build/runtime/data/browser acceptance remain owner-pending.

Authorization candidates (deferred authorization plan): DELETE Company, Driver, CompanyContactPerson; PUT Company/{id}/contact-group; Company billing/credit/blacklist changes. Existing authentication retained; visibility is not security.
