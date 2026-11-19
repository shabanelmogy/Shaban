# Customer comprehensive frontend review

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Review date | 2026-10-01 |
| Scope | Source-read-only review after the five backend notes in `CUSTOMER_SHARED_WRITE_FIXES_PLAN.md` |
| Outcome | Confirmed frontend findings remain; no frontend implementation performed |
| Review ownership | Delegated frontend source audit; root owns backend integration and complete repository diff reconciliation |

The five-note contract is Frozen and preserves the frontend API shape. The new backend `NotFutureDate` on Individual BirthDate is present; the editor already supplies `maxDate=today`. The findings below are additional review results, not additions to the five-note implementation scope.

## Manifest and authority

- Repositories: `F:/My Work/Sigma/SiGmaAngularFrontEnd` and, for directly related API evidence, `F:/My Work/Sigma/SigmaBackend`.
- Authority: `F:/My Work/Sigma/AGENTS.md`, the frozen five-note plan, `SIGMA_FEATURE_REVIEW_MASTER.md`, applicable canonical `ui/` and `backend/` blocks, and `.agents/skills/sigma-screen-refactor/SKILL.md`.
- Generated recipes: all eight reported stale by the root's prior read-only check; canonical books used. No generated file changed.
- Selected shapes: IndividualPartner and CompanyPartner are screen type 03, routed step-form records, using UI blocks 1, 12, 14 and 18. Standalone Driver and CompanyContactPerson use screen type 01, list-owned modal editors; Driver has peer detail/document tabs. The nested Company driver is an isolated child draft. Backend aggregate pattern: Pattern 2, no financial posting on customer Save.
- Approved references: Individual step editor plus shared step/form-section/validation components; Job list/shared list shell and filter panel; shared editor-dialog/editor-tabs and the modal reference specified by the catalog; shared partner row factories, EditableRows and DocumentUploadTracker.
- Evidence: current source, canonical books and the frozen plan. No screenshots or videos supplied to this delegated review. No runtime behavior is claimed from visual appearance.
- Source-only translation inspection used the canonical read-only `Check-Translations.ps1`; 299 English and 299 Arabic keys in the eight scoped feature blocks, no missing keys or case differences. Selected shared keys were then checked by the same source parser. No build, test, lint, application/browser/database execution, Git mutation or external-data mutation was performed.
- Sole file changed by this audit: this report. Application, configuration, books and skill files were preserved.

## Prioritized confirmed findings

P1 denotes a source-supported route to loss of existing customer data. P2 denotes incorrect input, API/paging compatibility, attachment lifecycle or error recovery. P3 denotes a confirmed canonical/interaction/translation gap. Runtime reproduction and existing-data prevalence remain owner verification items.

### F01 — P1 — Individual Edit can submit a blank snapshot after detail loading fails

The routed editor renders its form immediately. `loadDetails()` catches a transport failure with `EMPTY` and exposes no loaded/ready/error gate; a non-success Result also leaves the blank form. `save()` checks only mode and saving. If the user refills the required header after a failed Edit load, `buildPayload()` sends the existing route ID with empty document/card arrays and fallback address/billing values because `loaded` is still null. Under the full-snapshot contract, that is a request to remove or replace saved owned data. Company and standalone Driver/Contact already prevent Save after a failed detail load.

Evidence: [detail failure handling](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:442>), [Save guard](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:354>), [route ID and fallback snapshot](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:638>), [initially empty children](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:274>).

Recommendation: gate Edit/View content and Save on a successful detail load, keep a visible retry/error state, and prevent an unloaded snapshot from reaching Update. This preserves existing owned data when the read fails. UI 22/28 and the Master full-snapshot invariant apply.

### F02 — P2 — Individual Save does not enforce the whole form's validity

Save returns only when its summary has an item; it never checks `form.invalid`. Six surcharge controls have `Validators.min(0)` but are absent from the summary specs. A negative rental or lease surcharge therefore makes the Angular form invalid yet still reaches the API. The backend range validators correctly reject it, but the frontend submits despite its own field error and provides no matching summary/focus path.

Evidence: [Save validation](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:354>), [surcharge validators](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:261>), [incomplete billing specs](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:617>), [visible surcharge input/error](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.html:542>), [backend nonnegative rule](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PartnerBillingInfo/PartnerBillingInfoAddVM.cs:28>).

Recommendation: guard with `form.invalid` after touching the form, and declare every validated field in the badge specs. UI 12/19 require Save to validate all fields.

### F03 — P2 — Individual typed dates lack parse/min/max validators

Individual BirthDate, document dates, card expiry and optional active date use only `required`, or no validator for active date. With `keepInvalid=true`, the installed calendar can place invalid typed text in the form and can retain a parsed date outside its selectable range. Required accepts a nonempty string; the payload normalizer then turns malformed text into null. The backend correctly rejects missing/future BirthDate and missing card expiry. However, malformed document dates and optional card active date can be sent as null and accepted by the current nullable API, silently discarding the entered value. The shared partner factory already includes a parse validator, and the Driver birth validator also checks the future bound.

Evidence: [Individual BirthDate control](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:236>), [Individual document/card date controls](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:523>), [null-normalizing payload](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:715>), [calendar keepInvalid input behavior](<F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/primeng/fesm2022/primeng-calendar.mjs:2221>), [shared parse validator](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/partner-editor-forms.ts:8>), [nullable document API](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CustomerDocument/CustomerDocumentAddVM.cs:16>).

Recommendation: adopt shared typed date validators, retain the BirthDate maximum in a form validator as well as the picker, and reject a nonempty value that cannot be normalized. UI 17/19 apply. This is not a regression in the new backend `NotFutureDate` rule.

### F04 — P2 — Individual can Save or leave while upload/cleanup is active

Individual `save()` and `requestClose()` check `saving()` only. They do not check `uploads.uploading()` or `uploads.cleaning()`. The Save button shows cleanup as loading but excludes uploads; Back, Cancel, Next and step navigation also omit these gates. Save snapshots the old file path while an upload is still running; Cancel can discard an empty pending set and close before the upload finishes. An active cleanup also permits another Close action. This creates a source-supported path to omitted attachments, canceled upload tracking and abandoned files.

Evidence: [Save/Close guards](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:354>), [Close while upload active](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:388>), [footer state bindings](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.html:706>), [upload completion writes the control](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/components/file-field/file-field.component.ts:110>).

Recommendation: use one editor busy predicate covering Save, upload and cleanup for all exit/submit paths, while retaining the existing typed form and file tracker. UI 18 requires blocking Save/Close during upload or cleanup.

### F05 — P2 — Shared upload busy state is inaccurate for simultaneous file controls

`DocumentUploadTracker.upload()` stores one row key and any completing request sets it to null. `app-file-field` disables only its own upload input; another file field in the same editor remains available. Two uploads can therefore overlap, and completion of the first clears the editor's busy signal while the second is still in flight. Company's and Driver's otherwise-correct Save/Close guards rely on that signal, so they too can become enabled before all uploads finish.

Evidence: [single key overwritten/cleared](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/service/document-upload-tracker.service.ts:36>), [field-local input disable](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/components/file-field/file-field.component.ts:33>), [Company busy predicate](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.ts:109>), [Driver upload guard](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyDriver/components/details/details.component.ts:76>).

Recommendation: make concurrent upload accounting accurate in the shared tracker, or serialize file selections through the shared field. Keep row status separate from the aggregate busy state. Fixing the shared owner prevents every customer editor from maintaining its own workaround. UI 18 and the Master shared-extraction gate apply.

### F06 — P2 — Whole-row document removals leave saved files untracked in Individual and standalone Driver

The shared FileField marks a replaced or cleared file, but `EditableRows.requestRemove()` only removes a FormArray row. Individual's removal callback only refreshes badges. Standalone Driver does not retain its original saved paths. Their `finishSave()` receives paths of remaining rows, yet the tracker knows only paths explicitly marked removed and pending uploads; it cannot discover a saved file whose entire row disappeared. Company correctly compares original paths, including driver documents, against the successful snapshot. Individual also ignores the failed-path result from `finishSave()` and always closes.

Evidence: [Individual removal callback](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:278>), [Individual cleanup result ignored](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:382>), [Driver populate/cleanup](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyDriver/components/details/details.component.ts:99>), [helper removal has no file lifecycle](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/editable-rows.ts:117>), [tracker cannot infer old saved files](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/service/document-upload-tracker.service.ts:62>), [correct Company comparison](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.ts:147>).

Recommendation: retain original saved paths and mark disappeared paths only for cleanup after persistence succeeds, then surface cleanup failures with a translated recovery state. Failed Save must keep saved attachments. UI 18 applies. Server orphan expiry remains a separate backend evidence item.

### F07 — P2 — The decided shared document rule set is still inconsistent with source

Canonical UI 18 G5 decides one CustomerDocument factory/rule set: type, number, issue and expiry required; issuer optional; folder `CustomerDocuments`. The shared Company/Driver factory and backend Add/Update VMs still allow missing number, issue and expiry. Individual uses its own factories/models, additionally requires issuer, has no shared document length validation, and uploads document rows to `individualPartner`. Its enum IDs are inferred from string-enum positions. Those positions happen to match all current backend values; no current wrong-ID bug is claimed.

Evidence: [decided canonical rules](<F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/18-documents-and-upload.md:111>), [optional shared number/dates](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/partner-editor-forms.ts:30>), [backend Add document rules](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CustomerDocument/CustomerDocumentAddVM.cs:7>), [backend Update document rules](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CustomerDocument/CustomerDocumentUpdateVM.cs:7>), [Individual separate factory](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:523>), [Individual folder](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.html:337>), [index-derived options](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:187>).

Recommendation: reconcile frontend and backend together against the already-decided G5 contract; use the neutral shared row factories, explicit PartnerDocumentType wire values and upload folder. This is a guide/source conflict that predates the five fixes, not permission to change the API inside this read-only audit. Existing incomplete documents need owner data inspection before enforcement.

### F08 — P2 — Individual's required fields exclude records accepted by its API

Individual's frontend requires Email, Gender and NationalityId; its Add/Update VMs allow them to be absent. The frontend also requires two-character names while the API has no matching minimum. A legitimately saved row lacking an API-optional value, or with a one-character name, becomes impossible to save in this editor without adding/changing data. Actual affected existing rows were not queried.

Evidence: [frontend required/minimum fields](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:221>), [optional API fields](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/IndividualPartner/IndividualPartnerAddVM.cs:22>), [detail hydration retains null](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:462>).

Recommendation: freeze a single required/minimum set and align both sides, preserving legitimately optional existing data rather than defaulting an absent choice. Source compatibility is confirmed; the intended business requirement and existing-row impact require reconciliation. UI 19 and Master 4 apply.

### F09 — P2 — Individual URL page size can exceed the backend maximum

Individual restores the shared route reader's page size without an upper bound, and its lazy handler applies only a minimum. A URL such as `?pageSize=200` sends 200 and binds 200 to the grid, while the backend clamps the request to 100. The subscription uses totalCount and rows but does not adopt the returned pageSize. Paging offsets and the report can therefore disagree with the actual server page. Company, Driver and Contact clamp restored sizes to 100.

Evidence: [Individual lazy size](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/list/list.component.ts:176>), [Individual route restoration](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/list/list.component.ts:397>), [shared reader minimum only](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/list-route-state.ts:30>), [backend size clamp](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:716>).

Recommendation: clamp the frontend to the same supported 10–100 range and use consistent route/query/grid state. Normal options already cap the menu at 100; the confirmed trigger is a restored/tampered URL. UI 6 and backend 9 apply.

### F10 — P2 — Company import silently changes values and sends the wrong inactive key

Before submission, the Company CSV frontend converts an unrecognized boolean string to false and a nonnumeric value to zero. For example, `creditLimit="ten"` becomes 0 and `isBlacklisted="yes"` becomes false. The backend receives valid typed values and cannot report the original invalid cells. This can save credit/surcharge or customer-setting data different from the supplied file.

The CSV column and DTO also use `inActive`, while the current backend import VM declares `IsInactive`. The sanitizer handles both spellings if present but never renames `inActive` to `isInactive`; ordinary case-insensitive JSON matching does not equate those different names. The CSV inactive value therefore does not bind to the declared backend field, which remains false by default. This mismatch was cross-reported by the backend reviewer and confirmed in current frontend/backend source; owner request/persistence verification remains pending.

Evidence: [boolean coercion without renaming](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.ts:103>), [nonnumeric fallback to zero](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.ts:124>), [CSV inactive column](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.ts:59>), [frontend inactive DTO](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/models/list.ts:9>), [backend inactive property](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Company/CompanyImportVM.cs:45>), [typed import body](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/services/import-companies.service.ts:14>).

Recommendation: parse recognized formats explicitly and retain row/column errors for invalid values; align the CSV/DTO/mapper's inactive wire key with the backend. Empty optional/default cells can follow the frozen import contract; invalid nonempty cells must not be replaced with plausible values. This is input correctness, independent of the new backend write lock.

### F11 — P2 — Individual import uses the legacy ambiguous date parser

The import passes DateOfBirth through `parseFlexibleDate()`. That helper treats the first slash-delimited part as the month unless it exceeds 12, and can emit a UTC `Z`. Thus `04/05/2000` is sent as April 5 while the canonical customer/editor format and `parseDateValue()` interpret it as May 4. The backend future-date validation cannot detect a valid but wrong birthday.

Evidence: [import normalization](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportIndividualPartner/components/list/list.component.ts:82>), [legacy month-first parser](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/date-utils.ts:57>), [canonical day-first parser](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/utils/date-utils.ts:82>).

Recommendation: document the accepted CSV formats and use the canonical date-only parser, reporting unparseable cells. Preserve local date-only transport. UI 17 applies.

### F12 — P2 — Customer import error suppression leaves ordinary failures without feedback

Both import services send `X-Skip-Error-Interceptor`. Their components show errors only for `failedRecords`, `errorMessages`, ModelState `errors` or `summary`; they do not read a standard backend `message` or provide a fallback for transport/empty errors. A standard middleware failure, including a write-boundary failure, can consequently end loading without explaining what happened. They also release the loader in next/error callbacks rather than `finalize`, so teardown cancellation has no component-owned release. There is no in-flight submission guard.

Evidence: [Company suppression](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/services/import-companies.service.ts:15>), [Company error branches](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.ts:150>), [Individual suppression](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportIndividualPartner/services/import-individual-partner.service.ts:15>), [Individual error branches](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportIndividualPartner/components/list/list.component.ts:102>).

Recommendation: preserve the import-specific failed-row feedback while providing one translated/API-message fallback, use `finalize` for every loader pair, and prevent overlapping submissions. UI 22/28 apply. A repeated request is not claimed to bypass the backend uniqueness lock.

### F13 — P3 — Company step-header navigation skips forward validation

Next validates the current step, but the shared header calls `goToStep()`, which only checks bounds/busy/ready and sets the index. Clicking a later step therefore bypasses the current-step gate. Final Save still correctly checks `form.invalid`; no invalid persistence is claimed for this finding. This remains known G7/UI backlog 42.

Evidence: [header handler](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.ts:111>), [Next gate](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.ts:115>), [header wiring](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.html:30>).

Recommendation: route every forward navigation intent through the same current-step validation and focus behavior; backward/View movement remains available. UI 12 G7 applies.

### F14 — P3 — Company validation specs and row bindings still diverge from G8/G9

Company recursively walks controls to generate badge labels/IDs, rather than declaring `StepFormFieldSpec[]`; the driver draft builds keys from control names. Dormant generated keys such as `mangeDetails.currencyId` have no English/Arabic value, but those controls currently have no validators, so no currently visible raw badge is claimed for them. Company `otherDetail` has maxLength validation without an inline FieldError. Contacts, cards and documents bind the first cell with `[formGroup]` and subsequent cells with `[formControl]`, contrary to the decided one-binding-style rule. No compilation failure is inferred from mixed bindings.

Evidence: [recursive badge generation](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/details/details.component.ts:260>), [draft built keys](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/drivers/driver-draft.component.ts:80>), [otherDetail validator](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/utils/company-form.ts:67>), [textarea without inline error](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/detail/detail.component.html:39>), [mixed document cells](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/documents/documents.component.html:9>), [mixed card cells](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/credit-cards/credit-cards.component.html:7>).

Recommendation: declare existing full label keys and real control IDs, add the missing inline field message, and bind each row once around its cells. UI 12 G8, 14 G9 and 19 apply; this is known backlog 42.

### F15 — P3 — Driver Arabic gender and neutral partner-enum ownership remain incomplete

The driver field explicitly reads `mangeDetails.gender`, which exists in English and is absent in Arabic. Arabic therefore falls back to English for that label. Company billing/cards/documents read `individualForm.enums.*`, and standalone Driver fields read `companyForm.*`; the canonical rule requires shared partner keys in a neutral namespace. The eight feature blocks themselves have clean parity. Old `mangeDetails.inActive` is absent in English, but the active Company editor now uses `general.inActive`, so that old missing key is not reported as a live defect.

Evidence: [visible driver label](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyDriver/components/details/driver-fields.component.html:17>), [English shared label](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/en.ts:7492>), [Arabic shared block](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/ar.ts:1040>), [Company cross-feature options](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/billing-info/billing-info.component.ts:28>), [cross-feature document options](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/documents/documents.component.ts:34>).

Recommendation: add the missing shared Arabic label and move common partner enum/section keys to neutral shared ownership while migrating every in-scope consumer. UI 23 G11 and backlog 42 apply.

### F16 — P3 — Menu-less legacy roots remain routed and registered

The current menu exposes IndividualPartner and CompanyPartner, while Company remains an alias and CompanyDriver/CompanyContactPerson remain standalone routed roots. Canonical Master 5 G12/UI backlog 13 explicitly lists these as dead roots to retire after moving live consumers. Their reconstruction/aliasing remains source drift. The parent specifically asked this audit to inspect those routed surfaces, so they were reviewed; no deletion or route change was made. Retirement must preserve the agreement driver lookup and any established deep-link compatibility decision.

Evidence: [actual customer menu](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts:143>), [registered legacy routes](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/pages/routing.ts:1261>), [Company alias](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Companies/Company/company.routes.ts:5>), [Layout service registrations](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/_metronic/layout/layout.module.ts:566>), [catalogued dead roots](<F:/My Work/Shaban Documents/Shaban/sigma-erp/ui/30-backlog-by-priority.md:47>).

Recommendation: reconcile the already-decided retirement and consumer move against any owner-authorized compatibility exception. Do not create another customer editor owner. This is known G12 debt, not a new failure in the five backend notes.

### F17 — P3 — Customer import pages retain the legacy grid and feedback presentation

Both import pages still import `ms-lib`, define `ListCol[]`, render `table-list` in a raw card and use hard-coded English toast summaries. They have no canonical feature-title/list shell or bounded internal-scroll chain. Source confirms the legacy structure; actual clipping, RTL/theme appearance and viewport behavior were not observed.

Evidence: [Company legacy imports](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.ts:3>), [Company legacy template](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportCompanies/components/list/list.component.html:8>), [Individual legacy imports](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportIndividualPartner/components/list/list.component.ts:3>), [Individual hard-coded feedback](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Administration/DataImport/ImportIndividualPartner/components/list/list.component.ts:96>).

Recommendation: retain the specialized CSV request/result contract and failed-row display, while adopting the shared list/grid/state/translation pieces in the eventual import review. UI 1/6/22/23 apply; ordinary CRUD actions are not appropriate for an import screen.

### F18 — P3 — Individual View remains dependent on edit-only lookups

Individual calls all six lookup services in every mode and represents saved lookup values with disabled dropdowns. Its frontend detail interface omits display names already returned by the backend. If an option request fails or excludes an older saved value, the disabled field has no saved-name fallback. Company merges detail names and skips lookup requests in View; Driver renders read text for country/nationality and also skips its edit lookup in View.

Evidence: [unconditional lookup call](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:330>), [six lookup requests](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:420>), [frontend detail contract](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/models/details.ts:79>), [backend names already available](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/IndividualPartner/IndividualPartnerDetailVM.cs:17>), [View dropdown](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.html:51>).

Recommendation: read the supplied detail names in View and preserve selected saved names while loading Edit options. Request only lookups used by the active mode. UI 15/22 apply.

## Source-correct areas and reconciliation

| Area | Current source comparison | Result |
|---|---|---|
| Routes/modes | Individual and CompanyPartner route to one shared create/view/edit component, with legacy `details` as View. Company routes alias the canonical CompanyPartner components; old Company component fragments are not active route owners. Driver/Contact deep links open their list-owned modal and return to the list. | Correct active mapping; legacy-root policy F16 remains |
| List shell and grids | All four current lists use `sigma-route-host`, shared list panel/title/filter panel/data-table, `[fill]`, feature page-report keys and shared action menus. No feature list SCSS or raw PrimeNG grid in these owners. | Source-correct; import legacy exception F17 |
| Individual columns ↔ ListVM | `no, name, contactGroup, mobileNo, contactNo, email, branch, isInactive`; backend `Id/No/Name/ContactGroup/ContactGroupId/MobileNo/PhoneHome/PhoneWork/Email/Branch/IsInactive`. `contactNo` is frontend Home-or-Work, and ContactGroupId preselects an action. | Match |
| Company columns ↔ ListVM | `no, companyName, contactGroup, contactNo, website, email, isInactive`; backend `Id/No/CompanyName/ContactGroup/ContactGroupId/Phone1/Phone2/Website/Email/IsInactive`. `contactNo` is frontend Phone1-or-Phone2. | Match |
| Driver columns ↔ ListVM | `no, firstName, middleName, lastName, mobileNo, email` plus identity. DriverListVM also carries documented agreement-driver-picker data. | Grid fields match; shared consumer exception, not an unproved oversize defect |
| ContactPeople columns ↔ ListVM | `designation, firstName, lastName, contactNo, email` plus Id. | Match |
| Customer filters | `branchId`, trimmed `search`, nullable 0/1 `agreementStatus`, `isInactive`: checked sends true, unchecked omits it. `toListParams` retains numeric zero and excludes null/empty. Base property filters handle branch/inactive; customer SearchColumns and AgreementStatusFilter handle the special keys. | Match; inactive-only source now correct |
| Agreement filter scope | Current filter selects customers having a matching row in Rental `Agreement`; the history loads rental and lease agreements. | Source contract limitation; whether filter should include leases is a business reconciliation item, not assumed here |
| Driver/Contact filters | Trimmed `search`; explicit service filters match their displayed/name/contact fields. | Match |
| Paging/sorting | switchMap+defer cancels old list requests; totalCount drives the pager; column-derived sort allowlists, base stable Id tie-breaker; Reset/search go to page 1. Last-row delete goes back one page. | Correct normal flows; Individual URL bound F09 |
| Excel | fetchAllPages requests every filtered page and aborts on failed pages. dataTableExportRows resolves headers/statuses at click time and shares grid formatting. | Match |
| Card exports | No routed customer card-export button, list download or endpoint call. Ordinary Excel rows contain no card fields. | Source-correct |
| Write ownership | Routed customer/nested child payloads contain typed editable inputs and saved IDs; no subscriptionId, generated No, audit values, delete flags or calculated totals. Company isInactive/isBroker and preserved Individual isInactive are declared client-write fields in their VMs. | Match; do not misclassify these business inputs as server flags |
| Full snapshot | All aggregate children are mapped from the complete current arrays; saved rows retain IDs, new rows use 0/no saved ID; absent rows intentionally removed by the backend aggregate contract. Company includes driver grandchildren. | Match; makes F01 significant |
| Nested driver draft | Isolated form and DocumentUploadTracker; Cancel discards draft uploads; Save validates then transferTo(owner) and commits the form; aggregate Save alone finalizes attachments. Parent dirty state is marked after commit/remove. | Correct ownership and transfer; F05 affects shared busy accounting |
| Shared row removal | EditableRows confirms saved/edited rows, directly removes untouched new rows, re-resolves identity after confirmation and marks parent dirty. | Correct data-row lifecycle; whole-file lifecycle F06 |
| Company attachment lifecycle | Original company/driver paths compared to payload; replaced/removed saved files cleaned after successful Save; failures preserve editor data; successful save cleanup failures expose Retry/Close. | Source-correct, subject to F05 |
| Detail/save failure recovery | Company and standalone Driver/Contact disable or gate editors until detail reads succeed; mutation failures keep the entered form and restore enabled/busy states. | Correct; Individual F01 |
| BirthDate | Individual picker maximum exists; backend Add/Update carry Required+NotFutureDate after the five fixes. Driver shared validator and backend also reject future DOB. | Backend five-note change reflected; typed input F03 |
| Errors/feedback | Current ordinary lists use skip-error header + inline apiErrorMessage; standard mutations delegate feedback to the root interceptor and do not add duplicate feature toasts; both Result failure and HTTP channels are handled in current CRUD owners. | Source-correct; import F12 |
| Lookup recovery | Company retains/merges saved names; Driver uses names in read-only controls. Required Company branch lookup failure blocks Save. | Correct; Individual View F18 |
| Translations | Feature blocks parity 299/299. Status labels, page reports, shared button text and current inactive-only label exist in both languages. | Correct feature parity; shared/ownership F15 |
| Interceptors/providers | Services use environment.baseUrl; the root AppModule owns provideHttpClient(withInterceptors). Layout registers these services but introduces no separate HttpClient. | Source-correct wiring; real bearer headers pending |
| UX/layout/theme | Current customer owners use shared shell, step/form-section, dialog/tabs, editable tables, file fields, calendars and field-error components. Icons/actions are semantic shared pieces; overlays append to body. | Structural source evidence only; F13–F18 and manual layout checks remain |

## Decisions and boundaries

| Decision | Evidence and business reasoning |
|---|---|
| Preserve API shape during five notes | Frozen shared-write plan; the new backend lock/group/numbering/helpers and BirthDate attribute require no frontend DTO redesign. Additional required-set findings remain review recommendations. |
| Keep whole snapshots | Existing aggregate contract and child ownership checks. Partial child requests would incorrectly remove existing rows; loading failures must never fabricate a replacement snapshot. |
| Keep lookup IDs and saved names separate | IDs are write inputs; names render saved details, including when edit lookup calls fail. The backend already returns those names. |
| Treat uploads as part of the owning editor lifecycle | A file becomes saved only after aggregate persistence. Draft transfers and failed saves must preserve the saved parent's files. |
| No financial calculation/posting on customer Save | Billing settings are input configuration, not invoice line totals. No tax-rate preview or accounting transition is invented for these screens. |
| Do not mask existing card round trips in a write mapper | The current detail/write contract returns and resends complete CardNumber/CVV. Replacing them with masks in the frontend would alter saved data. Backend retention/tokenization/read-access review is needed. The card-export removal alone does not resolve that existing architecture risk. |
| No invented authorization | AuthGuard protects the authenticated layout; no feature permission service exists. Candidate inventory below is for the owner's deferred authorization plan. |
| No automatic legacy-root deletion | G12 is known guide debt, and these surfaces were explicitly assigned for review. Consumer migration and compatibility exceptions must be reconciled before retirement. |
| Shared extraction | No implementation in this audit. Accurate upload activity, shared document rule adoption, complete declared field specs and neutral partner translation keys belong to existing shared owners. No extra frontend framework is recommended. |
| Schema | This audit changes no entity/EF/configuration/source property. No migration is required for the report or the five-note frontend compatibility check. Future schema-affecting fixes require their own owner migration decision. |

The raw card-contract risk is evidenced by [CreditCardInfo entity fields](<F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/CreditCardInfo.cs:14>), [detail CVV](<F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/CreditCardInfo/CreditCardInfoDetailVM.cs:17>) and [Individual mapper resending CVV](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts:727>). No actual card value or credential was read or output.

## Authorization candidates

These are an inventory, not a claim of present feature-level authorization:

| Candidate | Endpoint(s) |
|---|---|
| Delete customer/driver/contact records | `DELETE IndividualPartner?id=…`, `DELETE Company?id=…`, `DELETE Driver?id=…`, `DELETE CompanyContactPerson?id=…` |
| Change customer contact/account group | `PUT IndividualPartner/{id}/contact-group`, `PUT Company/{id}/contact-group`; also group input on ordinary POST/PUT |
| Change credit limits, blacklisting and billing settings | `POST/PUT IndividualPartner`, `POST/PUT Company` |
| Read/change full payment-card details | Customer `GetByWithNavigationsId/{id}` and aggregate POST/PUT |
| Bulk import customer master data | `POST ImportData/IndividualPartner`, `POST ImportData/Companies` |

## Phases and pending evidence

| Phase | Audit treatment |
|---|---|
| 0 discovery | Read current routes, owners, menu, frontend/import models and directly related API source; no supplied screenshots to classify. |
| 1 contract comparison | Compared current wrappers/write DTOs against the Frozen five-note contract; flagged additional required-set conflicts without changing them. |
| 2 read/grid | Reviewed columns, filter keys, backend lookups, paging/sort, refresh/delete-page recovery, errors, exports and URL state. |
| 3 detail/write | Reviewed typed forms, create/view/edit state, summary validation, nested draft transfer, full snapshots, dates, uploads, file cleanup and API mapping. |
| 4 actions | Reviewed delete confirmation, group-change modal and agreement history. No approve/post/void workflow exists on customer Save. |
| 5 wiring | Read routes, menu, service providers, root HttpClient/interceptors, lookup and language-source paths. Runtime headers not executed. |
| 6 reconciliation | Current-source comparisons recorded here. Root owns integration with backend audit and the complete scoped repository diffs. No implementation or feature closure claimed. |

Owner verification remains pending for compilation, tests, browser/runtime behavior, network headers, actual persistence/storage cleanup, existing incomplete records, RTL/light/dark/narrow layouts, dialog focus trap/return, keyboard-only operation and accessibility announcements. The read-only translation checker is source inspection, not a build or application test.

Suggested owner acceptance paths after confirmed fixes are implemented:

1. Make Individual Edit detail loading fail; verify Save stays unavailable and retry preserves the saved aggregate.
2. Enter each negative surcharge and malformed date; verify inline error, complete summary and first-invalid focus without a request; manually type a future birthday.
3. Upload two attachments with unequal completion times; verify Save/Close remain blocked until both finish. Test replacing a file, removing its whole row, failed Save, successful cleanup, failed cleanup/retry and dirty Cancel.
4. Open Company driver draft, upload/edit/cancel, then repeat and Save the draft and aggregate; verify isolated files and saved IDs.
5. Navigate steps using header and Next; verify identical forward gates and backward/View movement.
6. Restore a page-size URL above 100, then filter/sort/page/delete the last row and return from every editor with the prior query state.
7. Export more than 100 matching records after switching languages; fail one export page and confirm no partial file. Confirm no card-export workflow exists.
8. Import invalid numeric/boolean cells, a Company inactive value, an ambiguous day/month DOB, ordinary API failures and transport failures; verify correct inactive persistence, precise feedback and released loader.
9. Verify every current screen/dialog in Arabic and dark theme at the narrowest supported width, with one scroll owner and reachable footer/paginator; verify the gender label and saved lookup names.

No application source changed, so there is no frontend source commit to suggest for this audit. Suggested documentation commit if the owner versions the report: `docs(customers): record comprehensive frontend review`. The repositories' existing unrelated changes were preserved.
