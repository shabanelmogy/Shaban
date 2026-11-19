# CompanyService — read-only assessment

Date: 2026-10-01  
Target: F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Customers/CompanyService.cs  
Scope: current 226-line service and only its direct persistence, validation, mapping, API and frontend consumers.  
Source SHA256: 3150C08A22037D7C13DE9B34C54032FCE7AF1D945E040311FA0C75CFF6535A77  
Mode: source read-only; this review artifact is the only file created. No application code, configuration, skill or guide was changed.

## Assessment

The structure is good: ordinary list behavior uses the base, business search has SearchColumns, SQL projection supplies contact-group names, nested ownership is checked before scalar mapping, and the five owned collections are reconciled on tracked entities. AsSplitQuery avoids one huge collection join. Shared partner and agreement-history helpers reduce duplication.

Persistence correctness still has one high-priority issue and several medium-priority gaps. The use of shared helpers does not alone prove that a whole business operation has one save boundary.

## Findings, in priority order

### F1 — P1: a helper can persist removed children before the Company update finishes

Location: CompanyService.cs:98–113 (especially the default-group call at line 113).

Evidence:

- Update calls MarkRemovedAsync on omitted drivers and contacts at lines 101/108.
- Service.cs:1068–1087 loads their owned rows and marks them Deleted in the shared context.
- Only after that, line 113 invokes GetOrCreateDefaultGroupIdAsync when ContactGroupId is null.
- ContactGroupAccountService, DefaultContactGroupProvider and CompanyService use scoped IUnitOfWork<SiGmaDbContext> / the same scoped DbContext (DependencyResolver.cs:139–147, Program.cs:25).
- DefaultContactGroupProvider.cs:36/48/60 can call SaveChangesAsync; account setup can also save via LinkAccountsAutoLinkService.cs:217.
- UnitOfWork.SaveChangesAsync saves the whole context; SiGmaDbContext.HandleAudit turns these Deleted rows into persisted soft deletions.

Trigger: omit an existing driver/contact, set ContactGroupId to null, and encounter a default-group creation/account-link path that saves. If the later Company map/save fails, those child deletions can already be committed while the Company edit fails.

Recommendation: resolve reusable default-group master data before any aggregate mutation, and keep deletion/child mapping/final Company save inside the aggregate's intended persistence boundary. Pure dependency checks can precede resolution. This agrees with BE14's resolve-before-mutation ordering; the problem is the placement of the helper call, not the existence of reusable default master data.

Confidence: strong source-level control-flow evidence; runtime reproduction not run.

### F2 — P2: duplicate CompanyName/VAT checks are race-prone

Location: CompanyService.cs:32–33.

UniqueColumns makes InvalidInputAsync query whether the value is taken. CompanyConfig.cs:51–52 declares ordinary lookup indexes, with no unique database invariant. Two concurrent requests with the same normalized name or VAT can both pass the check and both commit under the current EF model. TPT schema constraints are a real design limitation, not proof of uniqueness.

Recommendation: select a tenant-scoped, live-row uniqueness strategy with the owner and enforce it at persistence level. A schema change may require owner-run migration; no schema change is proposed as silently approved by this read-only review.

Confidence: current service + EF configuration; actual deployed index state not inspected.

### F3 — P2: ContactGroup existence does not prove it is a Customer group

Location: CompanyService.cs:70 and 182–186; Add also relies on base validation.

InvalidInputAsync validates an existing tenant-scoped ContactGroupId. It does not inspect ContactGroup.Type. The UI explicitly loads Customer groups in both editor and action dialog, and the default path passes ContactType.Customer. A direct API request can supply a Supplier/Driver group from the same tenant and persist it.

Impact: a Company customer can be associated with an incompatible group, inconsistent with the customer grouping and group-account model. This review does not assert that a particular invoice posting path has already misposted.

Recommendation: validate the supplied group's business type on Add, Update and UpdateContactGroupAsync using one source-supported shared rule.

Confidence: source-confirmed mismatch between selectable UI contract and backend validation.

### F4 — P2: a new nested Driver created during Company PUT bypasses numbering

Location: CompanyService.cs:121–127.

Service.ReconcileOwned creates a new Driver and appends it to the tracked collection for Id=0 (Service.cs:1145–1154). It does not call Repository.AddAsync. Number generation runs in Repository.AddAsync:139–143, whereas SiGmaDbContext.HandleAudit only stamps tenant/audit fields. DriverUpdateVM contains no No input; EntityBase.No defaults to null.

Impact: a Driver added while editing a Company can persist with No=null, while Driver POST follows the existing numbering pipeline. No is displayed in the standalone Driver list.

Recommendation: use the future numbering owner's safe single-entity path; do not run the legacy graph-wide generator on an already tracked Company graph. BE11 marks that generator as legacy and records overwrite risks.

Confidence: source-confirmed current create path; no runtime save executed.

### F5 — P2: zero FK values bypass validation and reach persistence

Location: CompanyService.cs:61/70/182; dependency Service.cs:234–244.

MissingReferenceAsync deliberately skips referenceId==0. CompanyAddVM and CompanyUpdateVM declare BranchId as int? with Required only; Required accepts a numeric zero. CustomerContactGroupUpdateVM also allows ContactGroupId=0. The default-group fallback uses ??= / ??, so zero is not converted to the default.

Example: BranchId=0 or ContactGroupId=0 can pass the generic existence gate, then fail the database FK rather than returning a meaningful field validation error. Optional nested country/currency/tariff IDs have the same shared-helper issue if zero is submitted.

Recommendation: enforce positive IDs for supplied references, with null representing an optional unselected value. This is a shared validation-owner issue consumed by CompanyService.

Confidence: request attributes + base helper + actual FK configuration; exact middleware HTTP response not asserted.

### F6 — P2: billing lower bounds are enforced by the UI only

Location: CompanyService.cs:117 / validation at line 70.

The Company billing form uses Validators.min(0) for credit period/limit, surcharge values and customer discount. PartnerBillingInfoAddVM/UpdateVM have numeric properties without matching lower-bound attributes; InvalidInputAsync checks duplicates/FKs, and DateRuleProblem checks dates. None of those rules reject negative billing values before ReconcileReference maps them.

Impact: a direct API write can store negative values that the ordinary Company editor rejects. This is a validation-contract gap; whether the business should allow any exceptional negative value must be decided explicitly.

Recommendation: reconcile backend bounds with the accepted business/UI rules in shared billing request validation.

Confidence: source-confirmed validation mismatch; database constraints were not inspected beyond EF configuration.

## Other observations

- Update is a complete snapshot with no record version: simultaneous editors can overwrite/remove one another's collections. SubscriptionId concurrency protects tenant ownership, not user-edit conflicts. This is a residual business/concurrency decision, not counted as an additional confirmed defect.
- Automatic FK checks currently issue one existence request per supplied nested reference, including repeated country IDs. Large driver collections can cause many round trips. Performance was not measured.
- RemoveAsync marks nested rows before checking the Company itself. With the usual request-scoped UoW and no subsequent save on failure those marks are discarded; callers that reuse the context after a failed delete need care. No partial database deletion was inferred from this path alone.
- Trimming is centrally registered via TrimIncomingStrings in Program.cs; absence of local Trim in CompanyService is not a defect for HTTP JSON requests.
- Contact/card/default-group behavior and approval/accounting workflows were not changed during this review.

## Scope and contracts inspected

Backend Pattern 2, no financial effect. Applicable canonical blocks: BE2, 3, 4, 5, 8, 9, 11, 13, 14; Master4/7 and project screen-refactor skill. Generate-SigmaRecipes -Check passed all eight packets for the current documentation state.

| Operation | Assessment |
|---|---|
| List | Base generic entity filters/paging/sort + SearchColumns and AgreementStatusFilter; ProjectTo for scalar navigation name. |
| Add | Date rules then reusable default group then base Add validation/map/save. |
| Update | Tracked filtered split query; input/date checks; full nested ownership; omitted child checks/mutation; default group; map/reconcile/save. F1 applies. |
| Remove | Actual EF-model reference checks and explicit owned-row soft deletion through shared helpers. |
| Agreement history | Shared rental/lease reader, existence check, typed Results. |
| Contact-group change | Tenant existence validation and default resolution; F3/F5 apply. |

List columns: No, CompanyName, ContactGroup, ContactNo (Phone1/Phone2 fallback), Website, Email, IsInactive. CompanyListVM exposes identity, those scalar inputs and ContactGroupId for the action. ContactNo is non-sortable in the current frontend; no computed sort override is missing.

Override audit:

- UniqueColumns: Company-specific duplicate keys.
- SearchColumns: Company search inputs.
- ApplyListFilters: actual agreement-status business filter.
- MaterializeListAsync: SQL contact-group-name projection.
- AddAsync: date rules and default customer group.
- UpdateAsync: grandchildren and tracked snapshot ownership.
- RemoveAsync: dependent children that own their own rows.

Mapping: Company/Driver update maps ignore owned navigations and CompanyService explicitly reconciles them; this matches the tracked approach. No new calculated totals or journal effects belong to this customer-master review.

No screenshots supplied. No new domain assumption was frozen or implemented. Prior review files are historical; this assessment uses the current 226-line source.

## Verification and deliverables

Read-only source/related diff inspected; no build, tests, lint, browser, database command, migration, snapshot edit, commit, push, deployment or source mutation was performed. No agents were used: one service with tightly linked dependencies does not justify independent implementation workstreams.

No migration or commit is required by this assessment itself. F2's future solution may have schema effects, to be planned and named if implementation is requested.

Owner verification scenarios (not executed):

1. Removed driver/contact + null group + new/default-account setup + induced final Company failure; check whether removed rows survived the failed edit.
2. Concurrent Add with identical name/VAT.
3. Assign a non-Customer group through each Company write entry.
4. Add a Driver through Company PUT and inspect its No.
5. Submit zero required/optional FK IDs.
6. Submit negative billing values through the API.

