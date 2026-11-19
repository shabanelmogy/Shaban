# Customers profile guide content evidence

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `customer-profile-topics.ts`; IndividualPartner and CompanyPartner only |
| Contract | `reviews/Archive/Completed/2026-10-23/USER_GUIDE_CUSTOMERS_CONTRACT_FREEZE.md` (Frozen, 2026-10-08) |
| Source limit | Claims below are based on Angular source inspection. Build, runtime, browser, API, database and owner acceptance were not performed. |

## Topic and route evidence

| Guide topic | Route | Source evidence | Supported content |
|---|---|---|---|
| `sideMenu.individuals` | `/IndividualPartner` | `src/app/modules/Customers/Individual/IndividualPartner/individualpartner.routes.ts` (`''`, `create`, `view/:id`, `edit/:id`); list and details components | List filters/actions, Create/View/Edit, documents, billing, cards, validation and profile notes |
| `sideMenu.companies` | `/CompanyPartner` | `src/app/modules/Customers/Companies/CompanyPartner/companypartner.routes.ts`; list and details components | List filters/actions, Create/View/Edit, contacts, billing, cards, documents, drivers and validation |

## Individual profile claims

| Claim in guide | Evidence (file / symbol) | Source limit or qualification |
|---|---|---|
| Branch/search/agreement-status/inactive filters, paging/sort and Excel export | `IndividualPartner/components/list/list.component.html`; `IndividualPartnersComponent.filterForm`, `search`, `onLazyLoad`, `exportExcel`, `rowsPerPageOptions` | Export success and actual file contents remain owner/runtime verification. |
| View, Edit, agreement history, contact-group edit and confirmed Delete actions | `IndividualPartnersComponent.actions`; `openEditor`, `openAgreementHistory`, `openContactGroup`, `confirmDelete`, `deleteRecord`; list template history/contact-group dialogs | Delete availability is described as a UI action requiring confirmation; backend deletion semantics are outside this frontend evidence. |
| Three editor steps: details, documents, billing | `IndividualPartner/components/details/details.component.ts`, `DetailsComponent.FORM_STEPS`; details template `@switch` cases | Step navigation and rendering are source-supported; keyboard/RTL/visual acceptance remains pending. |
| Profile, address/contact, document attachments, billing and credit cards | details template; `IndividualPartnerPayload`; `IndividualPartnerDetails`; `documentRows` and `cardRows` | The guide describes fields at user level and does not promise downstream accounting effects. |
| Required branch, first name, last name, mobile and birth date | `DetailsComponent` form controls around lines 199–215 (`Validators.required`) | Exact server-side validation may add constraints; backend validation was not inspected for this content stream. |
| Email format and unique email/mobile checks | `DetailsComponent` email validator and `attachUniqueValidators` | Async result timing/runtime was not exercised. |
| Document expiry after issue; one default card | `DetailsComponent.fieldSpecs`/`collectInvalidFields` (`expiryAfterIssueDate`, `creditCards#oneDefault`); details template expiry min date | Source confirms validation paths; owner should verify localized feedback. |
| View disables editing; dirty close/upload cleanup behavior | details template `[disabled]`/view branches; `isViewMode`, `requestClose`, `DocumentUploadTracker`, `cleanupError` | Confirmation and upload lifecycle require owner acceptance. |

## Company profile claims

| Claim in guide | Evidence (file / symbol) | Source limit or qualification |
|---|---|---|
| Branch/search/agreement-status/inactive filters, paging/sort and Excel export | `CompanyPartner/components/list/list.component.html`; `CompanyPartnersComponent.filterForm`, `search`, `onLazyLoad`, `exportToExcel`, `rowsPerPageOptions` | Export success and actual file contents remain owner/runtime verification. |
| View, Edit, agreement history, contact-group edit and confirmed Delete actions | `CompanyPartnersComponent.actions`; `openEditor`, `openAgreementHistory`, `openContactGroup`, `confirmDelete`, `deleteCompany`; list template dialogs | Delete availability is described as a UI action requiring confirmation; backend deletion semantics are outside this frontend evidence. |
| Five editor steps: company details, contacts, billing, documents, drivers | `CompanyPartner/components/details/details.component.ts`, `DetailsComponent.FORM_STEPS`; details template `@switch` cases | Child driver draft can hold the parent editor busy (`driverDraftOpen`/`busy`). Runtime close behavior remains pending. |
| Contacts, billing/credit cards, documents and drivers | `CompanyPartner/components/details/details.component.html`; `CompanyPartnerPayload`; `CompanyPartnerDetailsDTO`; child components under `detalisForm` | The guide avoids asserting driver licensing or accounting behavior not present in these UI contracts. |
| Required company name, branch and email; email format | `CompanyPartner/utils/company-form.ts` (`companyName`, `branchId`, `email` validators); `DetailsComponent.refreshValidation` | Server validation and localized error display remain owner verification. |
| Company name and VAT uniqueness checks | `CompanyPartner/components/details/details.component.ts`, `attachUniqueValidators` (`CompanyName`, `VAT`) | Async result timing/runtime was not exercised. |
| Document expiry validation and child-driver busy state | `DetailsComponent.refreshValidation` document specs (`expiryAfterIssueDate`), `busy` and `driverDraftOpen`; drivers child components | Source supports the constraints; owner must verify the actual interaction. |
| View is read-only; dirty close and cleanup errors | details template view/cancel branches; `isViewMode`, `requestClose`, `cleanupError`, `retryCleanup` | Confirmation and upload lifecycle require owner acceptance. |

## Boundary and findings

- `Customers/OpeningBalanceCustomer` and `Customers/PDCReceivable` were recognized as legacy/owned elsewhere per the frozen contract and were not included in the authored profile topics.
- The debt-collection follow-up dialog is unrelated to these profile topics and was not duplicated.
- No source-confirmed non-working profile action was identified during this bounded inspection. The evidence does not certify that every action succeeds at runtime.
- Billing, credit limit, discounts and surcharges are documented as profile settings only. The guide makes no promise of payment, invoice, posting, deletion rights beyond the visible confirmed action, or authorization enforcement.

## Verification performed and pending

Performed: scoped source inspection; route and topic identity mapping; bilingual nonempty text review; authored-file shape review against `GuideTopic`; scoped whitespace/merge-marker scan; repository diff review for the two owned files.

Pending for owner: application compile, guide reader registration/integration, opening both routes and deep links, EN/AR/RTL/theme/keyboard/print checks, and representative Create/View/Edit/action workflows.
