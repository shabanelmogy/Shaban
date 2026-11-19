# Companies — review of the parallel implementation (2026-10-01)

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Uncommitted Companies work written by another tool on 2026-10-01 between 13:58 and 14:27, in `SiGmaAngularFrontEnd` (68 files, +2340/−7390) and `SigmaBackend` (24 tracked files, +777/−436, plus 10 untracked) |
| Kind | Read-only source review. No build, test, browser or database check was run |
| Inputs | `reviews/Archive/Completed/2026-10-23/COMPANIES_REFACTOR_CONTRACT_FREEZE.md` (theirs), `git diff` of both repositories, the Individual reference (type 03) |
| Purpose | List the defects, and the rules the guides must state explicitly so the next tool cannot repeat them |

## 1. What the other tool did

| Area | Result |
|---|---|
| Contract | `COMPANIES_REFACTOR_CONTRACT_FREEZE.md`, marked Frozen. It cites `COMPANIES_FEATURE_REVIEW.md`, which does not exist. There is no final reconciliation, migration notice or report |
| Company backend | `CompanyService` rewritten (list hooks, ProjectTo detail, server-side masked card export, ownership checks, tracked snapshot reconciliation, delete blockers). New `CustomerAggregateSnapshot`, `DriverDeleteReferences`, `CompanyCreditCardExportVM`, 39 resx keys |
| Driver / CompanyContactPerson backend | Both services rewritten (list hooks, validation, snapshot update, delete blockers). Entity and VM nullability and max lengths changed |
| Company editor | Five steps on the shared editor shell. Driver editor became an isolated draft dialog with its own upload tracker (`DocumentUploadTracker.transferTo`) |
| Shared frontend | `shared/models/partner-editor.ts`, `shared/utils/partner-editor-forms.ts`, `PartnerDocumentType` enum. `EditorDialogComponent` content becomes a flex column |
| Legacy roots | `Company/` kept as re-export aliases of CompanyPartner. `CompanyDriver/` and `CompanyContactPerson/` kept and rebuilt as type 01 list + modal |
| Other | `toolbar.component.ts` regex for four routes; 12 entries added to `tsconfig.app.json` `files` |

Good work that should become the rule (see §4): server-side masked card export, ownership checks on every child id, explicit delete blockers for drivers, the isolated driver draft with upload transfer, and the detail read by `ProjectTo`.

## 2. Defects (fix before the owner accepts the work)

| # | Severity | Finding | Evidence |
|---|---|---|---|
| D1 | High — business | **Inactive uses the wrong flag.** The screen edits and filters `Company.InActive`. Agreements and bookings block inactive customers through `Partner.IsInactive` (`RentalAgreementService.cs:964`, `LeaseAgreementService.cs:2304`, `BookingService.cs:554`). A company marked inactive here can still be used everywhere | `CompanyService.cs:31,47`; contract §Action "Company.InActive is its separate existing business switch" |
| D2 | Resolved after this review | **Schema change.** `CompanyConfig` adds `OtherDetail` max length 2000; `CompanyContactPerson` makes five columns nullable and adds max lengths. *Correction:* the other tool's `COMPANIES_FEATURE_REVIEW.md` (written at 15:29, after the first version of this review) names `Add-Migration AlignCompanyContactPersonFieldsAndCompanyDetailLength` | `CompanyConfig.cs`, `CompanyContactPersonConfig.cs`; their review §Schema |
| D3 | Low — process | **Closure arrived late and in free text.** *Correction:* the final review exists (15:29), and UI 1.09, Backend 0.50 and the skill were updated (14:54). Its status is free text ("implemented and source-reviewed"), not the required status table (`Status` / `Owner verification pending`). The contract named that file before it existed | `reviews/Archive/Completed/2026-10-23/COMPANIES_FEATURE_REVIEW.md` header |
| D4 | Medium — data | **The client sends server-owned contact fields.** It sends `category`, and `type` defaults to `0`. The contract says "Customer type 0", but `ContactType` 0 is **Staff**; Customer is 2 | `company-form.ts:12,14`; `ContactType.cs` |
| D5 | Medium — consistency | **Two rule sets for one document entity.** Company rows (`partner-editor-forms.ts`) make `documentNumber`, `issuedBy`, `issueDate` and `expiryDate` optional. Individual rows make all four required, and the upload folder differs (`CustomerDocuments` vs `individualPartner`) | `partner-editor-forms.ts:34-38`; Individual `details.component.ts:523-536` |
| D6 | Medium — consistency | **Opposite filter meaning on sibling lists.** On Companies an unchecked "Inactive only" means *active only*; on Individuals it means *all* | `CompanyService.cs:47`; Individual `list.component.ts` `search()` |
| D7 | Medium — UX | **Clicking a step header skips validation.** It moves forward without validating; only *Next* validates. Individual validates both | `details.component.ts:111` |
| D8 | Medium — i18n | **Badge labels are built by reflection.** They come from `'mangeDetails.' + controlName`. Six labels do not exist (`contactGroupId`, `debtCollectorId`, `countryId`, `tariffCardId`, `currencyId`, and `inActive` in English). `mangeDetails.inActive` is missing in en and `mangeDetails.gender` in ar | `details.component.ts:259-285`; key check script |
| D9 | Low — UI | **Check boxes don't follow the shared pattern.** Two of them sit inside one label in one field, not `sigma-field--check`. The document table mixes `[formGroup]` on one cell with `[formControl]` on the others | `detail.component.html:42-43`; `documents.component.html` |
| D10 | Low — readability | **Very dense code.** Several statements per line, compressed `switch` arms, and one-line `if {…}` blocks (`CompanyService`, `DriverService`, the editor). This is unlike the surrounding code and the Individual reference | whole diff |
| D11 | Low — scope | **The `tsconfig.app.json` entries were added pre-emptively.** AGENTS allows an entry only after the compiler reports a runtime file missing | `tsconfig.app.json` |
| D12 | Low — duplication | **Several things now exist twice:** <br>• `CompanyAgreementHistoryVM` duplicates `CustomerAgreementHistoryVM`, and the service maps between them. <br>• `CompanyContactGroupUpdateVM` duplicates `CustomerContactGroupUpdateVM` (now unused). <br>• Driver validation is written in both `CompanyService` and `DriverService`. <br>• The `PartnerDocumentType` enum duplicates `DocumentTypeEnum`. <br>• Company uses `individualForm.enums.*` keys | listed files |
| D13 | Low — dead code | **Legacy roots were rebuilt instead of removed.** UI backlog 13 says `Company`, `CompanyDriver` and `CompanyContactPerson` are dead roots with no menu entry. They are now aliases or new screens. `CompanyPartner/components/cashe/cache.service.ts` stays, unused | UI `30-backlog-by-priority.md` row 13 |
| D14 | Info | **Individual was not touched.** It still lacks child-ownership checks, builds its card export in the browser from full numbers and CVV, and has no grandchild reconciliation. The new shared pieces are used only by Companies | `IndividualPartnerService.cs`, Individual list `exportCreditCards` |

## 3. Owner decisions the work assumed without asking

| # | Decision | What the tool assumed | Recommendation |
|---|---|---|---|
| O1 | One inactive flag for partners | Keep both `Partner.IsInactive` and `Company.InActive`; the screen uses the second | Use `Partner.IsInactive` only. Copy the data in a migration (`RemoveCompanyInActive`), then drop `Company.InActive` |
| O2 | Contact persons | Keep both `Company.Contacts` (`Contact`) and the separate `CompanyContactPerson` entity and screen | One owner. `Company.Contacts` is the aggregate's; retire the standalone `CompanyContactPerson` root if nothing else uses it |
| O3 | Company VAT vs billing TRN | Both stay editable | Same number in UAE. Keep one and derive the other |
| O4 | Customer-list default | Active only (Companies) vs all (Individuals) | Pick one rule for every customer list |

## 4. Rules to add to the guides explicitly

Each rule names the block that should own it (learning protocol: book block + skill row + changelog).

| # | Rule to state | Owning block | Why (finding) |
|---|---|---|---|
| G1 | **Status flags:** an entity has one active/inactive flag, the one the consumers read. Before using a status column, search its readers (agreement, booking, select lists). A duplicate legacy column is reported for removal, never edited | Backend 1 (entity), 18 (edge cases) | D1 |
| G2 | **Schema impact check:** any change to an entity property, nullability or EF configuration (`HasMaxLength`, `IsRequired`, index) appears in the report as "owner runs `Add-Migration <Name>`". The task cannot close without it | Master 7; Backend 2 | D2 |
| G3 | **Closure gate:** a Frozen contract is not a deliverable. The task ends only with the review or reconciliation artifact, the Master 7 report, the shared-extraction result and the learning-protocol rows. An artifact may not cite a file that does not exist | Master 4, 7 | D3 |
| G4 | **Server-owned values:** a value the user does not edit (category, type, status, numbering, tenant) is not in the Add/Update payload; the backend sets it. Enum defaults are written by name, never as a bare `0` | Backend 3, 5; UI 2 | D4 |
| G5 | **One child entity, one rule set:** a child entity shared by several screens (`CustomerDocument`, `CreditCardInfo`, `PartnerAddress`) has one row factory, one validator set, one upload folder and one payload mapper in `shared/utils/partner-editor-forms.ts`. Every screen adopts it; a second variant is a defect | UI 14, 18; Master 5 | D5, D12, D14 |
| G6 | **Status filter meaning:** the "inactive only" check box narrows to inactive rows when checked and shows all rows when unchecked. A list that hides inactive rows by default says so in its contract and uses the same rule for every sibling list | UI 4 | D6 |
| G7 | **Step navigation:** moving forward by step header or *Next* validates the current step; moving back never does | UI 12 | D7 |
| G8 | **Validation badges are declared, not derived:** `StepFormFieldSpec[]` lists each watched field with an existing label key. Building labels or ids from control names (`'mangeDetails.' + name`) is not allowed. Every key used is checked in en and ar before closure | UI 12, 20 | D8 |
| G9 | **Check-box markup:** every boolean field is its own `sigma-field sigma-field--check`. One row table uses one binding style (`[formGroup]="row"` on the row, `formControlName` in the cells) | UI 15, 14 | D9 |
| G10 | **Code style:** one statement per line, one `switch` arm per line, braces on their own lines as in the surrounding code. Brevity never beats the reference's readability | Master 5 (cross-cutting); Backend 5; UI 1 | D10 |
| G11 | **Shared messages and DTOs:** a rule shared by several customers uses a neutral key (`Partner…`, `Customer…`) and one DTO (`CustomerAgreementHistoryVM`, `CustomerContactGroupUpdateVM`). A feature-prefixed copy is a defect. A key namespace belongs to one feature: another screen does not read `individualForm.*` | Backend 5, 8; UI 20 | D12 |
| G12 | **Dead roots:** a root listed as dead in the backlog is removed with its routes, providers and translations. Live consumers move to the canonical owner first (for example, Rental Agreement moves to the shared `DriverService`). It is not rebuilt or aliased unless the owner asks | UI 30 row 13; Master 3 | D13 |
| G13 | **Backend enum input:** System.Text.Json accepts undefined numeric enum values, so every enum in an Add/Update VM carries `[EnumDataType(typeof(T))]`. A per-service `Enum.IsDefined` chain is not used. `[Required]` on the VM is not repeated by hand in the service | Backend 3, 8 | CompanyService `ValidateInputsAsync` |
| G14 | **Aggregate updates with grandchildren:** the base `UpdateAsync` reconciles one level only. AutoMapper maps entity to the same entity type by reference, so it copies nothing. An aggregate with grandchildren (Company → Drivers → Documents), or whose children must be ownership-checked, uses one canonical engine. Promote `CustomerAggregateSnapshot.HasOwnedIds` and `Reconcile` to the base service, and every child id must belong to the aggregate | Backend 5, 14 | Company good practice; D14 |
| G15 | **Card data:** card exports are built by the backend with a masked number and no CVV, through an export-only VM. The browser never receives a full card list | Backend 18; UI 8; backlog 28 | Company good practice; D14 |
| G16 | **Default contact group and transactions:** `GetOrCreateDefaultGroupIdAsync` saves by itself. State once whether the caller wraps it in the aggregate's transaction (Company does, Individual does not), and apply the same answer everywhere | Backend 14 (transactions) | `CompanyService.cs:137`, `IndividualPartnerService.cs:94` |
| G17 | **`tsconfig.app.json`:** add a `files` entry only after the compiler reports that runtime file missing | UI 29 (verification) | D11 |
| G18 | **Parallel tools:** before editing, check `git status` and file times in the scoped folders. If another tool changed them since discovery, stop and report; never overwrite or continue on top. Two tools never own the same feature at once | AGENTS "Controlled multi-agent strategy"; Master 6 (handoffs) | This session |

## 4a. Overengineering

| # | Where | What is excessive | Simpler correct form |
|---|---|---|---|
| X1 | Legacy roots | `CompanyDriver` and `CompanyContactPerson` were rebuilt as full screens and `Company` became aliases, plus a toolbar regex. Nothing in the menu reaches them | Remove them (G12). Move Rental Agreement to the shared `DriverService` |
| X2 | `CompanyService.ApplyListFilters` | Eight filters the screen never sends: `phone`, `salesPersonId`, `driver`, `companyName`, `email`, `vat`, `id`, `isBroker` | Only the contract keys: `branchId`, `search`, `agreementStatus`, `isInactive` |
| X3 | `CopyCompanyFilters` | Renames `isInactive` to `companyInactive` to get around the generic filter. It exists only because of D1 | Disappears once `Partner.IsInactive` is used |
| X4 | `ValidateInputsAsync` (≈50 lines) | Re-checks by hand what `[Required]` already checks. Chains `Enum.IsDefined` for ten enums. Checks `DateTime.MinValue`. Maps contacts and cards to entities only to validate them | `[EnumDataType]` and `[Required]` on the VM (G13). The service keeps only the business rules: duplicates, references, document dates |
| X5 | `TrackedCompany` | 13 `Include`s, including the documents, cards, address and billing of every contact and the cards and billing of every driver. The screen creates none of these, and there is no `AsSplitQuery`, so it is a large cartesian query | Load only what the aggregate edits: contacts, drivers with their documents and address, and the company's own documents, cards, address and billing |
| X6 | Contact removal | Each removed contact person runs the 13 customer delete checks (agreements, invoices…). A contact person is never a customer | Check the one real reference (`Receipt.ContactId`) or none |
| X7 | `DriverDeleteReferences` | Adds the 13 customer checks to the 11 driver checks: 24 queries per driver, and N × 24 when a company is deleted | Driver checks only. Soft delete already protects history |
| X8 | Default contact group | An explicit transaction in Add, Update and contact-group update (three places). The default group is reusable master data; a group left after a failed save is not an inconsistency. Individual does not do this | One rule in the book (G16). The simpler answer is no transaction |
| X9 | Company editor | `requiredLookupError`, `cleanupError` with retry that switches the screen to view mode, `mergeSavedOption`, view mode without lookups, `busy()` built from five signals | Follow Individual: one lookup warning; after save, close; the shared tracker handles cleanup |

Justified, not overengineering: the ownership checks on child ids, the server-side masked card export, the snapshot reconciliation (the base update cannot handle grandchildren), and the isolated driver draft with its own upload tracker (cancelling it must not delete the parent's files).

**Rule to add — G19 (Master 5, Backend 5, UI 1): proportional implementation.** Build only what the frozen contract and the screen use: no speculative filters, guards, retries or rebuilt dead code. Each extra mechanism names the defect it prevents in a comment or the contract, otherwise it is removed in review.

## 5. Suggested order of work

1. **Owner decisions.** Get O1–O4.
2. **Fix the defects** D1, D2, D4 to D9 and D12 to D13 in one pass. That includes adopting the shared partner editor in Individual (D5, D14).
3. **Add G1–G18** to the books and the skill, then regenerate the packets.
4. **Owner checks.** Run the build, then `Add-Migration`, then a browser check of Companies and Individuals.

## 6. Files touched by this review session

| File | Action |
|---|---|
| `SigmaBackend/SiGma.Business/Services/Customers/CustomerAgreementHistory.cs` | Written by this session before the parallel work was noticed. The other tool now calls it from `CompanyService` |
| `SigmaBackend/SiGma.ViewModels/ViewModels/IndividualPartner/IndividualPartnerActionsVM.cs` | Deleted by mistake, then restored to the committed version (`git checkout`); no diff remains |
| This report | Created |

Prohibited commands (build, test, lint, migration, database, commit, push) were not run.
