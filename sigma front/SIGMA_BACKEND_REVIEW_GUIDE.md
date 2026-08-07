# Sigma Backend Review Guide

Use this single guide for every Sigma .NET service, including normal CRUD,
nested children, lookup endpoints, reports, exports, bulk operations, and file
handling.

The goal is a senior, practical review that follows the current
controller/service/ViewModel/mapper/repository/EF pattern. Prefer the smallest
safe fix. Do not introduce a new architecture, validation framework, generic
repository, mediator, event system, or abstraction for one service.

## 1. Review rule

Select review depth and mode independently before tracing source. Review mode
versus implementation mode controls whether code changes; targeted patch
versus full feature pass controls coverage and required artifacts.

1. Trace the real endpoint or endpoint slice required by the selected depth
   from the controller or inherited base controller.
2. For a full feature pass, read the service interface and implementation,
   Add/Update/Detail/List/filter ViewModels, mapper, entity, EF configuration,
   repository/base service, and directly related models. For a targeted patch,
   read the target and only the direct dependencies needed to prove the patch.
3. Compare every custom override with the base method whose behavior it replaces.
4. Build the endpoint and field contracts required by the selected depth before
   writing findings.
5. Review validation, business rules, tenant/permission boundaries, queries,
   database mappings, children, delete references, reports, and files within
   the selected boundary.
6. Recommend or implement the smallest change inside the current pattern.

Review mode is the default when the owner requests a review without authorizing
implementation. Change code only when explicitly requested. Mode does not
select or expand review depth. Do not build, run tests, or generate migrations
when the owner has reserved those steps.

### Review depth: targeted patch versus full feature pass

Review depth controls coverage and artifacts; it does not weaken security,
contract correctness, data-integrity rules, or verification honesty.

| Depth | Select when | Required coverage | Required artifacts |
|---|---|---|---|
| Targeted patch | The owner identifies one bounded backend defect or change, such as one incorrect FK/soft-delete predicate, route mismatch, mapping property, validation rule, compile error, or response field | The named operation/field and its directly affected controller, DTO, validation, service/base behavior, mapper, query/entity/EF rule, client contract, and callers as applicable | Short evidence note, affected endpoint/field slice when applicable, controlled patch in implementation mode, targeted checklist in Section 20.0, scoped diff review, risks, and owner-verification status |
| Full feature pass | The owner requests `full review`, `implement all`, `whole feature`, `refactor <service/feature>` without a narrower issue, or coordinated endpoint/DTO/service/entity/client changes | The entire requested backend feature, every operation and directly related contract, persistence path, state, report/export/file path, and consumer | Service-shape record, complete endpoint and field ledgers, all applicable detailed sections and edge cases, full checklist in Section 20.1, complete scoped diff review, and full handoff |

An explicit `targeted fix only` instruction selects targeted depth unless the
patch cannot be made safely without a named contract, security, ownership, or
data-integrity decision. A bare feature-level review/refactor request selects a
full feature pass. Do not use changed-line count as the primary gate: a one-line
authorization or ownership defect can require high-risk tracing, while a larger
mechanical contract rename may remain bounded.

For a full feature pass, read this guide completely. For a targeted patch, read
this section, every directly applicable detailed section, Section 19, and
Section 20.0; expand reading and tracing when evidence expands the affected
area.

During a targeted patch:

- do not build the complete endpoint ledger, field ledger, edge-case matrix, or
  full checklist unless the target actually changes those areas;
- inspect direct dependencies needed to prove the requested patch is safe;
- apply every security, ownership, validation, transaction, and contract rule
  that affects the target;
- if a separate serious issue is discovered, report it with evidence and do
  not silently expand the requested scope;
- use the targeted report and completion checklist.

During a full feature pass, every applicable detailed section and full
checklist item remains mandatory.

## 2. Files to inspect

For the target service, locate:

- API controller, route, verbs, authorization attributes, and base controller;
- business service interface, service, base service, and UnitOfWork use;
- Add, Update, Detail, List, Select, filter, report, and child ViewModels;
- AutoMapper profile;
- entity, base entity, related entities, and enums;
- EF configuration, relationships, delete behavior, indexes, snapshot, and
  relevant migrations;
- repository/query helpers, tenant and soft-delete behavior;
- Angular service/models or another client contract when available;
- exports, uploads, scheduled jobs, and other consumers.

Do not assume an inherited operation is safe until its current source is read.
For a targeted patch, locate only the target and the direct files needed by the
selected operation or field; do not expand this inventory into a feature-wide
scan unless the evidence requires it.

## 3. Classify the service shape first

For a full feature pass, select the closest service shape before reviewing
implementation. For a targeted patch, classify the shape only when the target
depends on base-service, aggregate, synchronization, voucher, allocation, or
transaction behavior; otherwise record `Not applicable - bounded patch`. Use
these files as navigation references for the existing Sigma pattern:

| Shape | Reference implementation | Use when |
|---|---|---|
| Normal service | `SiGma.Business/Services/BranchService.cs` | One main entity with ordinary Add, Update, Detail, List, Select, and Delete rules |
| Settings/configuration service | `SiGma.Business/Services/AdministrationsServices/ChargeSettingsService.cs` | A screen loads and saves a complete configuration set, commonly synchronized by a logical key |
| Master-detail without voucher | `SiGma.Business/Services/VouchersServices/PurchaseOrderService.cs` | One document header owns detail rows but does not post a journal voucher or allocate balances |
| Master-detail with voucher and allocation | `SiGma.Business/Services/VouchersServices/InvoiceService.cs` | Saving the document also affects journal voucher headers/lines, allocations, accounting state, or related document flags |

These are shape references, not unquestionable copies. Review their current
source and apply the validation, ownership, atomicity, and query rules in this
guide. Never copy an unsafe or incomplete check merely because it exists in a
reference service.

### Approved-reference availability and divergence gate

Before using a shape reference, confirm that its documented path exists and
inspect its current source. If it has been renamed, deleted, partially
migrated, or is unavailable in the supplied workspace:

1. Search only the documented project/module parent and project map for an
   intentional replacement; do not start a full-solution scan.
2. Record `Approved reference unavailable` with the attempted path and evidence.
3. Ask for or report an owner/reference decision when no approved replacement
   is documented. Do not reconstruct the pattern from memory.
4. Continue only with rules confirmed by this guide, the target's current
   architecture, available base/shared services, and authoritative business
   evidence. Mark remaining pattern decisions explicitly.

If approved references disagree on a shared pattern, prefer explicit owner and
business rules, security/data-integrity requirements, and the reference that
matches the target service shape and current shared architecture. Record the
divergence and chosen evidence; do not silently combine patterns or modify a
reference that is outside scope.

A stale reference is a guide-maintenance finding, not permission to invent a
new architecture or abstraction.

Record the selected shape at the top of every backend review. If a service
combines shapes, use the most complex applicable shape only for the operations
that need it; keep ordinary operations simple.

### Normal service pattern

Use `BranchService` to understand the small-service structure:

- inherit the existing generic `Service<...>` implementation;
- override only operations that need feature-specific validation, duplicate
  rules, filters, projections, or delete blockers;
- use a scoped `IQueryable`, filter before count/paging, and project the list;
- validate duplicates on Add and exclude the same record on Update;
- inventory all references before Delete, then call the base Delete when its
  remaining behavior is correct;
- preserve base tenant, soft-delete, server-owned-field, and response behavior
  in every override.

Do not copy an override merely to change a message or formatting preference.

### Settings/configuration service pattern

Use `ChargeSettingsService` to understand the whole-settings-set pattern:

- use the feature interface and explicit Get/Update Settings operations rather
  than forcing configuration into ordinary record CRUD;
- define the logical key used to identify one setting. For Charge Settings it
  is `(ModuleType, ChargeType, RateType)`;
- validate every key enum and every allowed key combination before syncing;
- validate dependent flags and values using the business meaning of the setting;
- define duplicate input behavior explicitly. Reject duplicates when they
  indicate a user error; use deterministic last-wins only when that is the
  approved contract;
- define whether the request is a complete replacement or a partial patch;
- for complete replacement, an omitted existing key means Delete and an empty
  list means delete all only when the API contract explicitly allows it;
- for partial patch, never delete rows merely because they are absent;
- do not use client IDs as ownership or logical-key proof;
- load existing settings inside the current tenant and soft-delete scope;
- ensure the sync helper cannot update or delete another tenant's settings;
- map Add/Update/Delete by the logical key, then call `SaveChangesAsync` once
  when the existing UnitOfWork pattern permits;
- make the synchronization atomic so a validation or save failure leaves the
  previous settings set unchanged;
- return settings in deterministic order for stable UI behavior;
- define missing-settings/default behavior: empty response, seeded defaults,
  or calculated defaults according to the existing feature contract;
- add a tenant-scoped unique database index for the logical key when duplicate
  rows would make behavior ambiguous;
- invalidate a cache only when this feature already uses one; do not introduce
  caching for one settings review.

Inspect `IServiceHelper.SyncByKeyAsync` or the actual helper used by the
service. Confirm its query, delete-by-omission, mapping, tenant scope, and save
behavior match the chosen replacement/patch contract.

### Master-detail without voucher pattern

Use `PurchaseOrderService` to understand the document-plus-lines structure:

- validate the header and require the business-approved minimum detail count;
- validate every header FK and every distinct detail FK before mapping/saving;
- confirm all requested IDs exist; an `Any`/single-match result is not proof
  that every distinct requested ID is valid;
- validate mutually exclusive or dependent detail fields;
- reject duplicate lines according to the document's business key;
- calculate line amounts and document totals on the backend;
- Add the complete graph using the existing EF/UnitOfWork pattern;
- on Update, load the current document with its owned details;
- reject child IDs that do not belong to this document and tenant;
- define whether omitted/empty details mean preserve, clear, or reject;
- define merge/add/update/remove behavior and validate it before saving;
- keep Detail projection complete and List projection lightweight;
- keep approval/billing/custom status transitions in explicit service methods
  with legal source/target-state checks;
- use one transaction when the operation has multiple saves or related side
  effects that must succeed together.

### Master-detail with voucher and allocation pattern

Use `InvoiceService` to understand the accounting document shape. Treat the
business document, its details, journal voucher, allocations, and related flags
as one consistency boundary.

Before save:

- validate the complete request, all document types, all header/detail FKs, and
  all referenced records;
- normalize document numbers before duplicate checks;
- calculate totals on the backend;
- resolve required linked accounts and fiscal period;
- enforce document state locks;
- block Update/Delete when the related voucher is posted, approved, voided
  according to policy, or has active allocations;
- validate all targets before creating any journal voucher or allocation.

Journal voucher rules:

- debit must equal credit;
- each line has a positive debit or credit, never both;
- account, partner, branch, fiscal year, date, description, and document link
  follow the existing resolver pattern;
- Update follows the approved rebuild/reversal policy without orphaning old
  lines or losing the voucher link;
- Delete follows the approved block/void/reverse policy rather than removing
  posted accounting history.

Allocation rules:

- allocation collection is required when the operation requires it;
- every amount is positive and within its target outstanding amount;
- the total does not exceed the source available balance;
- source and every target match required customer, currency, branch, document
  type, and non-voided/open status rules;
- duplicate target rows are rejected or combined explicitly;
- already allocated amounts are calculated from persisted allocations;
- do not silently `continue` when a requested target is invalid;
- allocation voucher and allocation records save atomically.

Transaction rules:

- begin the transaction before the first document/JV/allocation mutation;
- keep all required saves inside that transaction;
- rollback every partial document, voucher, allocation, and related flag change;
- return a safe business message and log the internal exception;
- recompute related agreement/trip/document flags from persisted facts when a
  document changes or is removed.

Query rules:

- derive open/closed/over-allocated state from one consistent allocation rule;
- avoid per-invoice allocation queries and other N+1 loops;
- project list/report results after filters;
- use the same voided/posted/allocation rules in list, detail, report, and export.

### Review focus by shape

| Area | Normal | Settings | Master-detail | Voucher/allocation |
|---|---:|---:|---:|---:|
| Base CRUD parity | Required | Not normally applicable | Required | Required |
| Logical/composite key | When applicable | Required | Detail business key | Document/allocation keys |
| Replacement vs patch semantics | When applicable | Required | Required for details | Required for details/allocations |
| Child ownership/removal | When present | Not applicable | Required | Required |
| Backend recalculation | When computed | Dependent-setting rules | Required | Required |
| Explicit transaction | When multiple dependent saves | Required for sync | When dependent saves exist | Required |
| State transitions | When present | When settings activate behavior | Approval/billing states | Document and voucher states |
| Balanced accounting entries | Not applicable | Not applicable | Not applicable | Required |
| Allocation limits/ownership | Not applicable | Not applicable | Not applicable | Required |
| Related flag restoration | When present | Not normally applicable | When present | Required |

Do not add CRUD, detail, or voucher/allocation complexity to a settings service,
and do not add voucher/allocation complexity to a normal or non-accounting
master-detail service.

## 4. Endpoint contract ledger

For a full feature pass, record every operation. For a targeted patch, record
only the affected operation and direct callers/dependencies unless evidence
shows the broader contract changes:

| Item | Record |
|---|---|
| Review depth | Full: every feature operation; Targeted: the affected operation and direct callers/dependencies only |
| Operation | Add, Update, Delete, Detail, List, Select, custom action, report, export, upload |
| HTTP | Verb, route, route/query parameters, request body |
| Request | Wrapper and ViewModel |
| Response | Result wrapper, entity/list shape, status behavior |
| Service | Interface and implementation method |
| Persistence | Query, mapper, entity/children, transaction/save points |
| Client | Calling URL, parameters, request and response model |

For a full feature pass, record every field in the affected feature contracts.
For a targeted patch, record every field changed by or required to prove the
patch; do not silently sample within the declared slice:

- Add, Update, Detail, List, filter, and child property/type;
- entity/computed source;
- required/optional/null/default behavior;
- length, regex, range, precision, enum, and date rule;
- server-owned, persisted, returned, ignored, or computed direction;
- corresponding client field/type when a frontend exists.

Report frontend fields absent from the backend, backend required fields absent
from the frontend, DTO fields ignored by mapping/service, and response fields
the client expects but the backend does not return.

When frontend source or authoritative client-contract evidence is unavailable,
incomplete, generated externally, or outside the requested scope:

- classify client-parity conclusions as `FRONTEND_UNVERIFIED`;
- do not block backend-only findings that can be proven from backend source;
- do not claim the client sends, displays, validates, or consumes a field;
- list the exact Angular service/model/form/list evidence needed from the owner;
- record any client-dependent contract decision instead of reconstructing the
  frontend from memory.

### ListVM scope

Apply this rule to every reviewed module:

- A `ListVM` contains only properties displayed by the frontend table, plus
  inherited identity fields required for row actions.
- Keep the list query and mapper aligned with the reduced `ListVM`; do not
  include or project navigations solely for properties that no list consumer
  reads.
- Do not add extra properties to a `ListVM` for exports, dropdowns, reports, or
  another screen; use an existing purpose-specific contract or add one when
  that consumer genuinely requires a different response shape.
- When frontend list evidence is unavailable, do not remove `ListVM` properties
  based on assumption. Classify the displayed-field decision
  `FRONTEND_UNVERIFIED` and identify the required list template/model evidence.

## 5. Security and ownership baseline

Verify:

- authentication and operation permission are enforced server-side;
- tenant identity comes from the authenticated principal, not the request;
- tenant, record number, audit values, deletion flags, protected status, and
  calculated totals are server-owned where appropriate;
- targets and foreign keys are filtered by current tenant and soft-delete state;
- child IDs belong to the current parent and tenant;
- another tenant's record existence is not disclosed;
- custom CRUD/bulk/report overrides preserve the base security invariants;
- raw exceptions, SQL, connection data, tokens, and secrets are not returned or
  stored in source configuration.

When the shared global tenant guard is already fixed and the feature does not
bypass it, mark this `Reviewed - covered by shared guard`. Do not repeat the
same resolved global issue as a finding in every service. Raise a feature
finding only when a custom path bypasses or weakens the shared protection.

## 6. Required fields and nullability

For each request field ask:

- Is it required by the business or database?
- Does the C# type allow a missing value?
- Does validation reject `null`, empty, and whitespace when required?
- Does maximum length match EF/database configuration?
- Does Add differ intentionally from Update?
- Do Detail and List return a nullable value safely?
- Does the frontend agree with the same rule?

Use the existing DataAnnotations/service-validation pattern. Do not add a new
validation library for one service.

Typical rules:

- required string: `[Required]`, suitable `[StringLength]`, and service-side
  trim/whitespace handling when DataAnnotations alone is insufficient;
- optional string: maximum length still applies when present;
- email: existing email validation plus a database-compatible maximum length;
- identifier: correct numeric/Guid type and positive/non-empty rule;
- optional date: nullable `DateTime?` or project-equivalent;
- required enum: reject the default/undefined value when it is not meaningful.

## 7. Regex, enums, dates, numbers, and normalization

Regex:

- use it only for a stable, documented syntax such as a controlled code;
- do not use a narrow regex for international names, addresses, or phone numbers;
- anchor full-field patterns and set a reasonable length limit;
- keep the same rule and message in the client when client validation exists;
- backend validation remains authoritative.

Enums:

- reject undefined numeric values with `Enum.IsDefined` or the established
  attribute/service pattern;
- handle nullable enums separately;
- confirm JSON numeric/string serialization matches the client;
- do not silently map an unknown value to the default member.

Dates:

- distinguish date-only business values from timestamps;
- reject default or impossible dates when required;
- validate start/end, issue/expiry, joining/confirmation, and other ordering;
- define whether equality is allowed;
- avoid timezone conversion for date-only values.

Numbers:

- define min/max, sign, precision, scale, and rounding;
- reject NaN/infinity equivalents at input boundaries when relevant;
- totals calculated by the backend must not trust client values.

Normalize once before duplicate checks and mapping:

- trim user-entered strings;
- decide whether empty becomes `null`;
- use the business-approved case comparison;
- normalize phone/code values only when the current project already defines the
  rule;
- do not mutate identifiers into a new undocumented format.

## 8. Foreign keys and relationships

For every request FK:

- require it only when the business relationship is mandatory;
- query it inside the current tenant;
- exclude soft-deleted/inactive values when they are not selectable;
- return the established business failure when missing;
- validate dependent combinations, such as Role belonging to Department;
- prevent self-reference and hierarchy cycles;
- use a null-safe Detail projection for optional relationships.

An ID-only `Find`, unscoped `DbContext.Set<T>()`, or client-supplied navigation
object is not an ownership check.

## 9. Add review

Check:

- required, format, range, enum, date, FK, duplicate, and child validation runs
  before the first save;
- strings are normalized before duplicate detection and persistence;
- duplicate scope matches the real business rule and tenant;
- server-owned values are assigned by backend logic;
- AutoMapper maps each intended field once and does not map protected fields;
- children receive parent/tenant ownership from the server;
- multi-entity saves are atomic when partial data is invalid;
- returned ID/entity follows the established `Result` convention.

Do not add extra saves merely to obtain an ID if the existing EF graph pattern
can save safely in one unit.

## 10. Update review

Check:

- target is current-tenant and non-deleted;
- missing/cross-tenant target fails without disclosure;
- duplicate checks exclude the current record;
- request tenant, number, audit, delete flag, totals, and immutable fields cannot
  overwrite persisted values;
- mapping does not clear omitted optional values accidentally;
- every child ID belongs to this parent and tenant;
- child behavior is explicit: replace, merge, append, update, or remove;
- omitted and empty collections have different behavior only when documented;
- all validation completes before irreversible mutation;
- parent and children save atomically when partial state is unsafe;
- concurrent/lost-update behavior is understood and documented.

For a custom Update/UpdateList override, reproduce every relevant invariant from
the current base method. A secure base method does not protect an override that
does not call it.

## 11. Delete review

Inventory references from the current EF model and business code, not from
memory. Check:

- target tenant and soft-delete scope;
- direct and indirect required references;
- attendance/history/transactions/report rows and other semantic references
  that may not use the obvious property name;
- cascade, restrict, set-null, and soft-delete behavior;
- specific user message for a blocked delete;
- records needed for history or reports are not orphaned or hidden;
- bulk delete validates all targets before mutating any target.

Choose the existing project policy: block, soft-delete, or allowed cascade. Do
not invent a cleanup workflow during a service review.

## 12. Query and pagination review

Prefer this existing EF shape:

1. start with tenant and soft-delete scoped `IQueryable`;
2. apply validated filters and search;
3. compute `CountAsync`;
4. apply deterministic `OrderBy` with a stable tie-breaker;
5. apply bounded `Skip`/`Take`;
6. project only required fields;
7. execute asynchronously, using `AsNoTracking` for read-only queries when
   consistent with the project.

Check:

- page number and size are bounded and invalid values are predictable;
- filters run before count and paging;
- blank search is treated as no search;
- search trims input and uses intended fields/case behavior;
- malformed dates/enums/booleans do not silently become a different filter;
- list query does not load the full navigation graph;
- Detail loads only what the response needs and handles optional navigation;
- no premature `ToList`, in-memory filter, N+1 loop, or per-row database call;
- predicates remain database-translatable;
- `TotalCount` and `TotalPages` are accurate;
- cancellation/timeout follows the existing application pattern.

Enhance a query only for a demonstrated correctness or performance problem.
Do not add caching, specifications, compiled queries, or a new query layer
without evidence.

## 13. Reports and exports

Check:

- authenticated permission, tenant, soft-delete, and business-status filters;
- typed filter contract and predictable invalid-filter response;
- consistent voided/cancelled/posted rules across screen, report, and export;
- aggregation occurs in the database when practical;
- totals, signs, rounding, opening/closing balance, and date boundaries are
  correct;
- ordering is deterministic;
- export uses the same approved filters as the report;
- sensitive columns are excluded;
- row limits and large-result behavior follow the current pattern;
- a failed page/request fails the whole export, not a successful prefix;
- no full-table materialization before filtering.

## 14. Files and sensitive payment data

File endpoints require:

- authentication and operation permission;
- current tenant and parent-record ownership;
- bounded request/file size;
- allowlisted extension plus MIME/signature validation;
- safe server-generated filename;
- canonical path under the configured storage root;
- traversal protection;
- replacement, failure, orphan cleanup, and deletion lifecycle;
- safe not-found response without physical-path disclosure.

Never persist, return, log, route, or export CVV. Secrets, JWT keys, database
credentials, and provider credentials belong in deployment configuration and
must be rotated externally if previously exposed.

## 15. Error and response contract

Follow the current Sigma `Result`/`Results<T>` and HTTP convention:

- validation/business failure is clear and actionable;
- not found and forbidden do not disclose another tenant;
- unexpected exceptions are logged internally and return a safe message;
- no raw stack, SQL, connection string, token, or internal path is returned;
- parent/child operations do not report success after a partial failure;
- client receives enough stable information to display the error without
  parsing exception text.

Do not introduce a new error envelope for one controller.

## 16. EF and database review

Compare DTO, entity, configuration, snapshot, and migrations:

- nullability and maximum length;
- decimal precision/scale;
- FK optionality and delete behavior;
- useful indexes for demonstrated filters/order/uniqueness;
- database unique constraint when duplicate races would corrupt the business
  rule;
- existing data impact before a required/nullability/unique migration;
- concurrency token only when the feature has a real lost-update requirement.

Source review may confirm schema and migration history, but it does not prove
the contents or compatibility of the owner's live database. Unless database
inspection is explicitly authorized, do not query data or infer live-data
safety from source alone. Classify existing-data compatibility for a required,
nullability, uniqueness, precision, or relationship migration as
`Owner verification required`, state the risk, and provide the exact preflight
check or cleanup decision the owner must perform.

List a required migration for the owner; do not generate or apply it when
verification is owner-run.

## 17. Edge-case matrix

For a full feature pass, review every applicable case below. For a targeted
patch, review only the cases that exercise the affected operation, field,
security boundary, persistence behavior, and direct failure paths. Mark
non-applicable targeted cases explicitly when omission could otherwise hide a
risk; do not expand to an unrelated feature-wide matrix.

### Input

- null, omitted, empty, whitespace-only, maximum length, and over-maximum string;
- minimum/maximum/out-of-range number and decimal rounding;
- undefined/default enum;
- invalid/default date, equal boundary, reversed range, leap day, and date-only
  timezone preservation;
- casing, whitespace, and special characters in duplicate/search values.

### Records and relationships

- valid create and update;
- missing, deleted, inactive, and cross-tenant target/FK;
- duplicate create and duplicate update excluding self;
- optional null relationship in Detail/List;
- self-reference and hierarchy cycle;
- omitted, empty, duplicate, invalid, and foreign-owned child collection;
- delete with no references and with each blocking reference.

### Operational

- page 1, last page, page after last-row deletion, zero results, oversized page;
- duplicate submit and concurrent update;
- failure before and during parent/child save;
- unauthorized, forbidden, stale client permission, not found;
- large report/export and one failed export page;
- upload type/size/signature/path/replacement/delete/missing-file cases.

Mark non-applicable cases rather than inventing behavior.

## 18. Simple findings and severity

Use:

- **Critical:** cross-tenant access, privilege bypass, exposed secret, data loss,
  ownership change, or corrupting save.
- **High:** broken required contract, invalid business/FK/delete rule, partial
  save, or broken primary workflow.
- **Medium:** wrong paging/filter/report result, significant inefficient query,
  incomplete error handling, or important edge case.
- **Low:** maintainability, consistency, naming, or documentation issue without
  incorrect business data.

Every finding contains:

- stable ID and severity;
- operation/layer;
- exact file and tight line evidence;
- observed behavior and impact;
- smallest safe fix in the current pattern;
- affected frontend/backend files;
- one owner-run acceptance scenario.

Do not combine unrelated issues or turn preferences into defects. Mark a
reviewed area `Reviewed - no finding`.

## 19. Review output

Keep the report proportional to the selected depth. Do not paste the complete
guide or imply that a targeted patch received a full-feature audit.

Targeted patch report:

```markdown
# <Feature> Backend Targeted Patch

## Requested scope and evidence
## Files changed and exact behavior
## Affected endpoint/field and direct dependency checks
## Security, ownership, transaction, and contract impact
## Risks and owner decisions
## Owner verification pending
## Targeted checklist and scoped diff status
```

Full feature pass report:

```markdown
# <Feature> Backend Review

## Scope and request flow
## Endpoint contract
## Field parity
## Validation and business rules
## Findings by severity
## Query and database observations
## Edge cases and owner-run scenarios
## Contract decisions needed
## Coverage summary
```

## 20. Final checklist

Select the checklist matching the recorded review depth. For a targeted patch,
complete Section 20.0 plus only directly applicable items from Section 20.1.
For a full feature pass, complete all applicable items in Section 20.1. A
checked source-review item does not imply build, runtime, API, database, or
migration verification.

### 20.0 Targeted patch checklist

- [ ] The request identifies one bounded backend issue/operation/field and
      targeted depth is recorded.
- [ ] Exact source evidence and directly affected files, base behavior,
      callers, and persistence/contract dependencies are identified.
- [ ] The affected endpoint and field slice is recorded when applicable; no
      complete feature ledger is implied.
- [ ] Applicable authorization, permission, tenant/ownership, server-owned
      field, validation, transaction, and failure-path rules are checked.
- [ ] Missing frontend evidence is classified `FRONTEND_UNVERIFIED`; live-data
      or migration compatibility is left as owner verification when not proven.
- [ ] Any separate serious issue is reported without silently expanding scope.
- [ ] In implementation mode, the controlled patch and complete scoped diff are
      reviewed for stale contracts, mappings, merge markers, and whitespace.
- [ ] Unperformed build, test, migration, API, runtime, and database checks are
      stated honestly for the owner.

### 20.1 Full feature pass checklist

- [ ] Every endpoint and field is inventoried.
- [ ] Service is classified as normal, settings, master-detail, or voucher/allocation.
- [ ] Frontend and backend Add/Update/Detail/List/filter fields match.
- [ ] Required, whitespace, length, regex, enum, date, range, and precision rules are reviewed.
- [ ] FKs, duplicates, self/cycles, and child ownership are reviewed.
- [ ] Server-owned fields and custom override invariants are protected.
- [ ] Add/Update is atomic where partial data is unsafe.
- [ ] All delete references and EF delete behaviors are reviewed.
- [ ] Filters precede count/paging; ordering and totals are correct.
- [ ] Detail/List queries avoid unnecessary graphs, N+1, and in-memory filtering.
- [ ] Reports, exports, files, errors, secrets, and sensitive data are reviewed.
- [ ] Database mappings/indexes/migration impact are reviewed.
- [ ] Edge cases and owner verification scenarios are listed.
- [ ] Shared global tenant protection is not duplicated as a feature finding unless bypassed.
- [ ] No unnecessary pattern or architecture change is proposed.
- [ ] No unperformed build, test, migration, or runtime result is claimed.
