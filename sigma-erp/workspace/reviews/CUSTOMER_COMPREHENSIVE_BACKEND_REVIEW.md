# Customer comprehensive backend review

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Reviewed | 2026-10-01 |
| Scope | Company, Individual, related Driver/owned rows, customer imports, and directly used shared persistence helpers |
| Verification | Source inspection and scoped Git diff review only |
| Frozen implementation contract | `CUSTOMER_SHARED_WRITE_FIXES_PLAN.md` |

## Outcome

The five contracted shared fixes are present in the final source. No confirmed additional defect was found in the new application-lock transaction ownership or Added-row number preparation. The review found the additional issues below in the customer backend. The most urgent is Individual update accepting another customer's address or billing row within the same subscription.

These findings describe current source behavior. They are not build, database, concurrency, or runtime verification results. Several are existing defects outside the five fixes; they are explicitly distinguished from the resolved generator traversal defect.

## Authority, scope, and evidence

- Applied `F:/My Work/Sigma/AGENTS.md`, `.agents/skills/sigma-screen-refactor/SKILL.md`, the frozen shared-write plan, and applicable canonical Backend book blocks 1–14 and 18–19 plus Master blocks 1, 5, and 7. The root reviewer promoted the implementation guidance to Backend version 0.67.
- All eight generated packets were reported stale by the root reviewer. Canonical books were used; no second drift check was run.
- Pattern: shared master/detail service conventions, with Company and Driver using tracked aggregate reconciliation. The frozen contract expressly covers Company drivers and driver documents/address as owned aggregate rows.
- Backend repository: `F:/My Work/Sigma/SigmaBackend`. The workspace root is not its Git repository. Scoped diffs were inspected separately from source; unrelated existing changes were preserved.
- Reviewed Company/Individual/Driver services and controllers; their entity/configuration, write/read/import VMs and profiles; owned address, billing, document, card and contact paths; customer import validation and persistence; shared Service, Repository, UnitOfWork, CodeCreateService; directly relevant authentication and error handling.
- Angular files were read only to establish actual list/import consumers. This is a backend report; the root frontend reviewer owns broader UI findings.
- No screenshots were supplied for this review. Source is contract evidence; no screenshot-derived visual or business requirement was inferred.

All source paths in the findings are absolute. Line numbers refer to the final source inspected during this review.

## Additional confirmed findings

| ID | Priority | Finding | Origin / relationship to five fixes |
|---|---|---|---|
| BE-01 | P1 | Individual update can modify/reuse another customer's address or billing row within the same tenant | Existing ownership gap; additional to Company ownership consolidation |
| BE-02 | P2 | Individual generic update can erase saved child `No` and copy other entity defaults onto retained children | Existing generic mapping defect; separate from resolved recursive generator traversal |
| BE-03 | P2 | Customer import endpoints execute without endpoint authentication | Existing controller gap; anonymous customer persistence now stopped by shared resolver guard |
| BE-04 | P2 | Company import accepts address/country columns but discards them | Existing import mapping gap |
| BE-05 | P2 | Company imports bypass established billing value constraints | Existing alternate writer validation gap |
| BE-06 | P2 | Customer imports accept numeric enum values that are not defined | Existing import enum validation gap |
| BE-07 | P2 | Individual write VMs omit length limits required by persisted columns | Existing write contract gap |
| BE-08 | P2 | Individual import accepts an omitted required birth date as year 0001 | Existing required-date gap; future-date fix alone does not enforce presence |
| BE-09 | P2 | Customer import responses expose raw persistence exception text | Existing client error-safety gap |

### BE-01 — Validate ownership of Individual reference children before attaching the graph

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:120`, `:123`, `:127`, `:301`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/IndividualPartnerProfiler.cs:16`
- `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/IndividualPartner/IndividualPartnerUpdateVM.cs:41`, `:55`
- `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/PartnerConfig.cs:24`, `:29`

`OwnsChildRowsAsync` checks collection navigation IDs only. Individual update maps `PartnerAddress` and `BillingInfo`, including their update-VM IDs, onto a detached root and calls `Repository.Update` on that graph. The generic reference check validates selected foreign references, but does not establish that the nested address/billing ID belongs to this Individual. Repository write protection enforces subscription ownership, not ownership by the parent customer. Both partner reference relationships use `WithMany()`.

Consequently, a request with the ID of a different customer's live address or billing row in the same subscription can attach that row as Modified, alter its scalar values, and associate it with the updating customer. The collection checks do not prevent this. Cross-subscription write protection does not close this same-subscription gap.

**Recommendation:** Load the Individual aggregate with its live owned references and collections, require each positive reference ID to match the currently owned row, and map onto the tracked owned instances. Reuse the existing `OwnsReference`, `ReconcileReference`, and `ReconcileOwned` convention used by Company/Driver. Validate ownership before any tracked mutation.

### BE-02 — Preserve saved child numbers in the entire Individual update sequence

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs:123`, `:127`, `:135`, `:157`, `:180`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/IndividualPartnerProfiler.cs:16`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Repos/UnitOfWork/UnitOfWork.cs:107`

Individual's update VM does not carry server-owned `No`. Its profile maps nested collections before `Repository.Update` attaches the mapped graph. Retained children constructed from the VM therefore lack the stored number. Loading the navigations afterwards cannot recover the stored scalar values of instances already tracked with that key. The later reconciliation additionally creates fresh child entities and maps them entity-to-entity onto retained children, copying default `No` along with other entity defaults.

The new number preparation deliberately visits only Added rows. A retained child is Modified, so it cannot restore the wiped value. Replacing only the final entity-to-entity mapper call is insufficient because the first graph mapping/attachment already discarded the stored value.

**Recommendation:** Reconcile incoming VMs against the existing tracked owned children from the start, preserving fields absent from the write VM. This needs the same full aggregate update correction as BE-01. The new CodeCreateService correctly preserves nonempty numbers and no longer traverses graphs; that resolved defect must not be presented as a complete repair of generic saved-child mapping.

### BE-03 — Authenticate customer import endpoints before service work

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Controller/ImportDataController.cs:7`, `:28`, `:44`
- `F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/Extensions/DependencyResolver.cs:77`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AccountServices/ContactGroupAccountService.cs:25`

ImportDataController derives directly from ControllerBase and has no `[Authorize]`. The configured DefaultPolicy requires authentication when authorization is requested; no applicable FallbackPolicy or global authorization filter supplies it here. Thus an anonymous Company or Individual import reaches service preflight/mapping and receives the action's 400 response instead of being rejected at the endpoint with 401.

**Final-source correction verified:** `CustomerGroupIdAsync` now checks subscription `<= 0` at lines 27–28 before default creation. Both customer chunk writers call it before AddRange, and the unique-write helper also rejects unauthenticated subscriptions. Anonymous customer default-group writes and customer root persistence are therefore stopped in the reviewed source. The residual finding is P2; it does not assert an anonymous customer write exploit.

**Recommendation:** Require authentication on these endpoints through the established authorized controller convention or an equivalent endpoint policy. Specific import role permissions remain an owner contract decision.

### BE-04 — Map Company import address fields to the owned address

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Company/CompanyImportVM.cs:46`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/CompanyProfiler.cs:41`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AdministrationsServices/ImportDataService.cs:236`

The import contract accepts Address, City, State, ZipCode, and Country. The Company import profile maps a billing object but never creates/maps PartnerAddress. The additional mapping delegate resolves branch/staff/group/tariff and billing enums only; it neither maps address text nor resolves Country. A successful Company import therefore discards supplied address columns.

**Recommendation:** Construct the owned PartnerAddress, map its text fields, and resolve/validate the country through the tenant's live lookup before attaching the Company. Return a row error for an invalid supplied country. Keep omitted address behavior consistent with the normal Company writer.

### BE-05 — Apply existing billing constraints to the Company import writer

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Company/CompanyImportVM.cs:17`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AdministrationsServices/ImportDataService.cs:1069`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/CompanyProfiler.cs:57`
- `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/PartnerBillingInfo/PartnerBillingInfoAddVM.cs:6`, `:30`, `:38`, `:54`

Normal billing writes require nonnegative credit/surcharge/discount values and restrict surcharge type strings to Fixed or Percentage. CompanyImportVM has no equivalent annotations, and ValidateCompany does not enforce those constraints. Its convention mapping copies the billing fields directly. For example, a negative CreditLimit or RentalFineSurcharge, or RentalType=`invalid`, is accepted by the alternate import writer even though the normal write contract rejects it.

**Recommendation:** Apply the existing shared billing validation to imported values before mapping. Report invalid values at the row level. Do not invent new financial limits; use the already established normal-writer rules.

### BE-06 — Reject undefined numeric enums in customer imports

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AdministrationsServices/ImportDataService.cs:1092`, `:1220`, `:253`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/IndividualPartnerProfiler.cs:25`

The custom validators use `Enum.TryParse` without checking that the parsed value is defined. Numeric strings such as `999` parse successfully even when the enum has no such member. Company additional mapping and Individual's Enum.Parse then persist that value. Normal write VMs use enum validation, so imports can create values the normal writer rejects and UI enum choices cannot represent.

**Recommendation:** Require both a successful parse and a defined enum value for these non-flags fields, using one shared parse/validation rule for validation and mapping.

### BE-07 — Match Individual string validation to the persisted limits

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/IndividualPartner/IndividualPartnerAddVM.cs:16`, `:37`, `:50`
- `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/IndividualPartner/IndividualPartnerUpdateVM.cs:16`, `:38`, `:51`
- `F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/Configuration/MemberPartnerConfig.cs:8`

FirstName/MiddleName/LastName are stored with maximum length 100; MobileNo and home/work phone values with 50; Notes with 2000. Individual Add/Update VMs omit corresponding maximum-length validation. Inputs longer than the configured columns pass API model validation and reach persistence, producing a database failure instead of a field validation response. UI constraints do not protect direct API clients.

**Recommendation:** Add the persisted maximum lengths to both write VMs and apply the same limits to imports. Preserve the current required/optional field contract.

### BE-08 — Reject an omitted birth date in Individual import

**Locations:**

- `F:/My Work/Sigma/SigmaBackend/SiGma.ViewModels/ViewModels/Customer/IndividualPartnerImportVM.cs:11` — nonnullable DateOfBirth
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AdministrationsServices/ImportDataService.cs:1197`, `:1207`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Business/MapperConfig/IndividualPartnerProfiler.cs:24`
- `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Filters/NotFutureDateAttribute.cs:12`

Normal Individual writes require BirthDate. Import's nonnullable DateOfBirth defaults to DateTime.MinValue when omitted. Its required-field checks cover names/email/mobile only; the new comparison rejects future dates but accepts that default. Mapping then persists the default birth date. `[Required]` on a nonnullable value would also need an explicit default-value check to close this path.

**Recommendation:** Enforce the already established required-date rule in import, treating omission/default as a row validation error. The future-date check remains necessary and is present.

### BE-09 — Return safe customer import persistence errors

**Location:** `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/AdministrationsServices/ImportDataService.cs:1517`

The custom chunk catch returns `ex.Message` plus `ex.InnerException.Message` in ErrorMessages. Only deadlock/concurrency cases are replaced with a safe localized message. SQL truncation/constraint/provider failures can therefore expose table/column names and values to the client. Because the import service catches these exceptions, the central middleware's safe error handling cannot sanitize them.

**Recommendation:** Log detailed exceptions server-side and return localized import/constraint errors. Translate known validation/uniqueness failures to row or chunk messages without embedding raw provider exceptions.

## Reconciliation of the five contracted fixes

| Fix | Final source result | Remaining verification / boundary |
|---|---|---|
| Shared uniqueness write guard | UnitOfWork acquires a transaction-owned Exclusive SQL application lock for entity type plus authenticated subscription. New transactions use ReadCommitted; an existing transaction is reused. The 10-second lock wait is explicit. Negative return values stop the delegate; timeout/cancellation/deadlock outcomes become conflict results. Only successful owned transactions are committed. | SQL Server concurrency behavior, timeouts, rollback and existing-transaction cases require owner runtime verification. Writers outside the reviewed participating paths are not covered by the app lock. |
| CRUD/import guard coverage | Base Add and Update apply the guard when UniqueColumns are declared. Company overrides protected UpdateCore rather than bypassing Update. Customer imports use the same entity/tenant resource and recheck declared live uniqueness inside it before AddRange/save. | Batch root count-number generation is a separate known deferred problem. Generic AddList/UpdateList have no exposed customer endpoint/caller in the reviewed contract, so no hypothetical bypass finding is asserted. |
| Customer group resolution | Company and Individual add, update and group actions, plus both customer imports, call CustomerGroupIdAsync before tracked mutation/attachment. Null selection obtains the Customer default. Supplied selections use live tenant-scoped Customer-group existence. Invalid selection returns null. Authenticated subscription is now checked before default creation. | Default group/account creation uses its existing saves before the customer unique-write transaction. A default may remain when later customer validation fails; the frozen contract deliberately requires this ordering. Role restrictions need owner confirmation. |
| Added-row number preparation | Both UnitOfWork save methods detect Added EntityBase rows with empty No. CodeCreateService handles one row only and preserves nonempty No. Repository AddAsync/AddRange retain early root numbering required by existing pre-save No consumers. Driver-only manual numbering was removed. | Multiple customer child types use the existing type/ticks fallback rather than the count branch. No new same-count Added-child defect was confirmed. BE-02 still affects Modified saved children through generic mapping. |
| Shared date rule | Individual Add/Update use NotFutureDate; custom import checks future DateOfBirth. Duplicate service document-date validation was removed in favor of child DTO validation. | BE-08 is a separate required-date import gap. Calendar-day semantics and server date/time require owner verification. |
| Company deletion/update helper consolidation | Company OwnsEveryRow is private. Dropped drivers/contacts call shared MarkRemoved/InUse/soft-delete policy; aggregate saves use shared SaveUpdateAsync. Company/Driver map scalar fields and reconcile owned tracked rows. | Full usage/FK and audit behavior require a database scenario. Failure results can leave pending tracked changes in a caller-owned DbContext; current customer controller request flow does not save after the failure. Do not reuse a failed aggregate context for unrelated later writes without rollback/clear policy. |

No source-level compilation defect was confirmed in the new helper interfaces, visibility, EF relational dependency, or call sites. This is not a successful compilation claim. No automatic retry was introduced.

## API, list, mapping, and domain decisions

| Decision | Source-supported conclusion |
|---|---|
| Company grid / ListVM | Grid: no, companyName, contactGroup, derived contactNo, website, email, isInactive. ListVM: Id, No, CompanyName, Email, Website, Phone1, Phone2, IsInactive, ContactGroupId, ContactGroup. contactNo derives from phone fields; Id/group ID support actions. No documents/cards are added to the grid contract. |
| Individual grid / ListVM | Grid: no, name, contactGroup, mobileNo, derived contactNo, email, branch, isInactive. Declared ListVM: Name, MobileNo, PhoneHome, PhoneWork, Email, ContactGroupId, ContactGroup, Branch, IsInactive, plus inherited list identity/plumbing. Existing excess ListBaseVM plumbing is a documented backlog item. |
| List behavior | Shared tenant/live filtering, stored-column search/sort, stable paging, projected customer ListVMs and agreement-status filtering are present. No scoped list payload mismatch was confirmed. |
| Owned mapping | Company and Driver update profiles ignore manually reconciled owned navigations. Individual's generic mapping remains unsafe as BE-01/02 describe. Child write profiles map VM-to-entity; server-owned values should be retained through tracked instance reconciliation. |
| Import contract | Imports are alternate writers and must apply normal established constraints. Address loss, enum/value/date gaps and safe errors are additional findings above. Existing Company import UI `inActive` versus backend `IsInactive` must be reconciled in the root frontend/full-stack report. |
| Uniqueness | Company Name/VAT and Individual MobileNo/Email use the declared shared guard. Imported Company email/TRN preflight uniqueness is stricter than the CRUD declaration; its intended policy remains an owner contract decision rather than a newly invented uniqueness rule. |
| Calculations | No new calculations were introduced by the five fixes. Existing billing bounds/type choices are treated as established constraints. Financial policy changes require an owner decision. |
| Authorization | Customer CRUD controllers use the existing authorized base. Customer imports have the residual endpoint gap in BE-03. Import/group/delete/card-read role permissions require the owner's explicit policy. |

## Known risks and deferred items — not new findings

- **Sensitive cards:** full PAN and CVV remain persisted/read in the existing card workflow (Backend backlog 28). Export exposure was previously removed, but persistence/read exposure remains an owner-decision risk. Tokenization/removal, retained-data treatment and migration must be decided by the owner. The five shared fixes do not resolve this item.
- **Legacy numbering:** count-based root generation, count reuse after deletion, cross-tenant/raw count behavior, batch reuse, hardcoded branch prefix and lack of a durable counter are known deferred numbering defects. The current guard serializes participating writes for one tenant/entity; it is not a counter/schema redesign.
- **Generic grandchildren:** broader generic direct-child-only support is a known backlog item. Company implements the explicitly contracted driver grandchildren in its aggregate path.
- **Claim semantics, cancellation, generic service size and ListBaseVM plumbing:** existing book backlog entries remain deferred. They were not expanded into unrelated changes.
- Root-number access before save remains supported for CustodyMovement, NRM and WorkshopMovement; removing early Repository numbering would break those existing readers.

## Changes, phases, and owner handoff

**This reviewer changed only this report.** No application, configuration, instruction, skill, canonical book, or migration file was edited by this reviewer. The root implementation's source changes were inspected as evidence; this report does not claim authorship of them. No frontend implementation or API contract change was made by this reviewer.

Discovery, applicable contract comparison, backend review, scoped diff review and final source reconciliation were performed. Visual/UI execution, builds, tests, lint, browser, database, migrations and concurrency execution were skipped under the source-only authorization. This report is Draft because owner verification remains pending and additional findings require separately authorized correction.

**Migration:** The five shared fixes add no entity/schema redesign and require no migration of their own. Earlier pending Company entity/configuration changes, including legacy InActive removal and index/length changes, have a separate migration/data boundary; the owner must reconcile those with the earlier feature report and existing migration files before deployment. Do not drop legacy inactive data without preserving its meaning. No migration was created or run here.

**Suggested backend commit message for the reviewed implementation:** `refactor(customers): centralize write guards and aggregate helpers`. Suggestion only; no commit was created. This report itself is a local review artifact outside the backend repository.

### Manual owner verification

1. Build the scoped backend and inspect any compile diagnostics when authorized.
2. Concurrently add/update/import the same Company name/VAT and Individual mobile/email within one subscription; verify one accepted writer and the expected localized conflict/duplicate result. Repeat across subscriptions and with lock timeout, cancellation/deadlock, an existing transaction, failed validation, and failed save.
3. Add/update Company drivers and multiple documents/cards/addresses/billing rows; verify every new owned row receives a number, existing numbers remain unchanged in tracked Company/Driver paths, and all rows retain the authenticated subscription. Separately reproduce BE-02 in Individual with retained document/card rows.
4. Attempt same-subscription foreign address/billing IDs on Individual (BE-01), foreign/soft-deleted collections, duplicate child IDs, and foreign customer groups. Verify no persistent mutation occurs on rejected operations.
5. Verify owned-row usage blocks Company/Driver deletion/removal, unused rows are soft-deleted with audit data, and no failed aggregate removal is later flushed by context reuse.
6. Exercise normal/import future dates and omitted import birth date; imported address/country, negative billing values, undefined numeric enums, oversized strings and a database persistence error.
7. Verify anonymous import requests are rejected at the endpoint after BE-03 is corrected. Current source blocks customer persistence through subscription checks but does not provide endpoint 401 behavior.
8. Verify the existing inactive data/import field transition, list projections/actions, customer-group account default behavior and agreed role permissions. Resolve the known card-storage decision before release approval.

**Agent utilization:** This report was produced by the backend reviewer delegated by the root task, with sole write ownership of this artifact. No further agents were spawned. Root owns implementation and combined integration; the separate frontend reviewer owns consumer review. Source findings were sent to root during review; the anonymous default-creation issue was corrected and rechecked before finalization. Delegation allowed backend review to proceed alongside frontend/implementation reconciliation without overlapping file writes.

**Prohibited-command confirmation:** No build, test, lint, runtime/server launch, database command, migration/snapshot generation, package operation, commit or push was run. Read-only file/search/Git inspection and this review artifact creation were the only operations.
