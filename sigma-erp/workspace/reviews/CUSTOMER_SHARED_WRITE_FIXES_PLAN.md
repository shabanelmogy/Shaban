# Customer shared write fixes

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner: implement the five reviewed notes, then review Individual and Company comprehensively |
| Shape | Existing backend Pattern 2; customer UI/API contracts preserved |

## Contract and decisions

1. Replace Company Serializable with a shared SQL Server Exclusive application lock per
   entity/tenant inside a ReadCommitted transaction. UnitOfWork owns the reusable boundary;
   the base applies it only when UniqueColumns exists. Base Update exposes a protected core
   hook so Company keeps its aggregate logic inside the same boundary. Both customer import
   chunks use that boundary and recheck their live keys. Resource uses the repository's
   authenticated subscription, never input; timeout 10 seconds; negative lock outcomes
   stop the write; commit success only; no retries. Reuse an existing outer transaction if
   present, without committing it. Existing localized 409 middleware remains.
2. CustomerGroupIdAsync on the existing contact-group service resolves a default for absence
   and validates a supplied Customer group. Reject a missing authenticated subscription
   before any default-group save. Call it before tracked mutation in the six
   customer CRUD/group-action paths and before customer import attachment. Invalid selection
   fails rather than silently selecting a default.
3. UnitOfWork prepares Added EntityBase rows with empty No before sync/async saves. Reuse
   the generator without overwriting nonempty numbers, and remove Company's Drivers-only call.
   CodeCreateService numbers only the current entity, without walking saved navigations.
   Compatibility exception: Repository.AddAsync/AddRangeAsync still number their new root
   immediately because CustodyMovement, NRM and WorkshopMovement copy No before saving.
   This root assignment is empty-only and the save preparation skips it. Child numbering
   shares the final save boundary for Add/Update. No new counter, format or schema; the
   deferred CountAsync/sequence redesign is not part of these five notes.
4. Individual Add/Update BirthDate gets NotFutureDate; remove the redundant document-date
   service checks/helper. Individual import checks its birth date explicitly because its
   custom validation bypasses normal write VMs. Existing frontend already has maxDate=today.
5. Extract private Company OwnsEveryRow; base RemoveDroppedAsync preserving InUse/owned rows
   and soft delete; base SaveUpdateAsync preserving save/result semantics. No extra saves.

The root-number compatibility exception and reuse of existing number-generation policy are
reviewer decisions based on actual producer/consumer reads. No new customer fields, frontend
layout, mapper, accounting, permission or schema contract is introduced. Relational EF package
reference may be needed in Repos for transaction/connection APIs; use the existing EF version.

## Implementation and review scope

UnitOfWork/repository contracts, base service, Company/Individual/Driver services, contact-group
service, CodeCreateService, Individual VMs, customer imports, and owning guide/skill blocks.
Preserve current unrelated changes. No builds, tests, SQL execution, migrations or snapshots.

After implementation: source-only comprehensive read-only review of Individual/Companies
routes, lists, editors/drafts, payloads, validation, uploads, translations, shared persistence,
mapping, imports and error handling. New findings are reported with priority; they are not
automatically added to the five-fix implementation scope.

## Reconciliation

### Five-note implementation

| Note | Source outcome |
|---|---|
| 1. Duplicate-write protection | Base Add/Update dispatch through UnitOfWork only for declared UniqueColumns; Company protected UpdateCoreAsync retains its tracked reconciliation. Both customer import chunks use the same entity/tenant resource, recheck live keys, and preserve partial-chunk behavior. No Serializable remains in these paths. |
| 2. Contact group | One CustomerGroupIdAsync on the existing service; six CRUD/group-action callers and both import writers adopt it. Supplied type/existence/tenant checks remain distinct from default resolution. Missing subscription returns null before a saving helper. |
| 3. Added-row numbering | Sync/async UnitOfWork saves number Added EntityBase rows with empty No. Generator traversal and Drivers-only call removed. Immediate async repository root assignment retained for the three documented consumers. This does not repair the legacy generic update's detached mapping of saved children. |
| 4. Dates | Individual Add/Update BirthDate uses NotFutureDate; custom import checks future birth dates. Redundant service document-date checks/helper removed; existing shared DateAfter still validates API writes. |
| 5. Smaller update | Company private OwnsEveryRow plus base RemoveDroppedAsync and SaveUpdateAsync; Company, Individual contact-group action and Driver reuse the save result helper. Existing usage checks, soft delete and one aggregate save retained. |

### Changed files (this task)

Backend repository: UnitOfWork interface/implementation; repository interface/tenant accessor;
Repos EF Relational 10.0.9 package reference; base Service; Company/Individual/Driver services;
PartnerRules; IContactGroupAccountService/ContactGroupAccountService; CodeCreateService and its
interface; customer sections of ImportDataService; Individual Add/Update VMs; CompanyConfig
comment. Older working-tree changes in these files were preserved; existing EF/schema changes
from prior tasks are not newly introduced by this task.

Canonical guide: backend blocks 0, 3, 5, 8, 11, 14, 19 and CHANGELOG (Backend 0.67), plus
Sigma skill §8.4 and its history row. No frontend application source changed in this task.

### Source verification and limits

Reviewed the complete scoped backend diff, interfaces, type constraints, DI assembly scanning,
message resources, API model-validation boundary, root-number consumers, and stale-symbol
references. Scoped backend and documentation `git diff --check` passed. Final
`Check-BookReferences.ps1` passed: every checked reference resolves, including the skill.
Both reviewer artifacts and the combined comprehensive review are complete; owner runtime
verification and the additional findings remain open.

All eight generated packets remain stale; canonical books used. No generated packet edits.
Regeneration and semantic packet review remain pending. Migration for these five fixes: none.
Suggested backend commit: `refactor(customers): centralize write guards and aggregate helpers`.
Suggested documentation commit: `docs(sigma): document shared customer write boundaries`.

Phases: discovery/contract freeze, backend detail/write and integration/source reconciliation
applied; frontend implementation skipped because these five fixes preserve the UI/API shape;
comprehensive frontend/backend review follows read-only. Screenshot work and domain actions
are not part of these five fixes. No new mapping/profile, domain calculation or financial
effect. No unresolved business decision blocks these implemented source changes.

Owner verification remains required: package restore/build; concurrent customer CRUD versus
import (same/different tenants and entity types); lock timeout/deadlock/cancellation and
rollback; supplied wrong-type group; future birth date; Added drivers/contacts/documents/cards
on Add and Update; saved/manual No preservation; the three early-root consumers. The global
CountAsync generator remains deferred, including duplicate root numbers in a bulk chunk.

Comprehensive review findings beyond these five notes remain unfixed and prioritized in the
separate frontend/backend reports. In particular, generic Individual Update still requires
its own repair for one-to-one ownership and saved-child metadata mapping; Added-row numbering
must not be described as fixing that legacy mapping.

No builds, tests, lint, SQL execution, migrations/snapshots, browser runs, commits or pushes.
Owner verification pending: **yes**.
