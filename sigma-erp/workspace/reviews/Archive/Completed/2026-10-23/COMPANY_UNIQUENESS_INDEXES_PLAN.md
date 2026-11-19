# Company uniqueness — direct transactions

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner's final decision: use a transaction as the simplest adequate option; remove CompanyWriteScope |
| Backend shape | Pattern 2; existing Company/Partner TPT |
| Scope | Company Add/Update/import duplicate checks and save; remove wrapper/helper; cancel indexed-view proposal |

## Decision history

1. The owner initially approved preparation of database uniqueness indexes.
2. TPT puts CompanyName/VAT on Company and tenant/delete fields on Partner. A normal composite index cannot cover both tables; a schema-bound indexed-view design was proposed.
3. The owner requested removal of Serializable / CompanyWriteScope.
4. The owner's final instructions were “ده معقد جدا … ابسط حاجة تحقق الهدف” and “يب transaction افضل”. These supersede the index rollout and isolation-removal clauses in the earlier frozen plan.
5. Final contract: direct Serializable transactions, no indexed views, no new transaction wrapper. The prepared SQL definition was removed without execution. The existing filename is retained as the historical decision record.

## Implemented contract

- Preserve Company name and nonempty VAT checks per tenant among live companies (repository IsDeleted != true, including null). Preserve current normalization/collation and field contracts.
- Company Add resolves any saving default-group helper before tracked mutations, checks group type, then starts Serializable before the base duplicate checks and save.
- Company Update resolves that helper first, starts Serializable before loading/checking, reconciles owned rows, saves once and commits only success.
- Each Company import chunk starts Serializable before rechecking name/VAT and group type. Attach/save that chunk once, commit only success; a failed chunk leaves earlier committed chunks intact.
- Dispose the transaction on every exit: validation failures, exceptions and unsuccessful saves cannot commit.
- Keep central localized 409 concurrency/deadlock handling and the import's existing localized failed-chunk error handling. No blind retry.
- CompanyWriteScope and the UpdateSnapshotAsync indirection are removed; Update is directly readable in one method.
- Keep ordinary Company lookup indexes. No indexed views, copied scope columns, EF view entities, API/frontend changes or new migrations.
- Limitation: these transactions protect participating application writers. Direct SQL or a future writer that skips duplicate checks can still create duplicates. Owner concurrency/lock-contention verification remains pending.

## Files and reconciliation

| File | Scoped change |
|---|---|
| SiGma.Business/Services/Customers/CompanyService.cs | Direct transactions in Add/Update; remove wrapper invocation and extra Update method |
| SiGma.Business/Services/AdministrationsServices/ImportDataService.cs | Direct transaction in existing Company chunk persistence method |
| SiGma.Business/Services/Customers/CompanyWriteScope.cs | Removed |
| SiGma.DataAccess/Configuration/CompanyConfig.cs | Explain existing lookup indexes and transactional duplicate enforcement; no schema change in this task |
| .agents/skills/sigma-screen-refactor/SKILL.md | Current decision, transaction rationale and revision row |
| backend/00-preamble.md, backend/08-validation-duplicates-keys-delete.md, backend/14-pattern-2-master-detail-no-financial-effect.md, CHANGELOG.md | Promote the same guidance; Backend version 0.66 |

Phase 0/1: reviewed existing TPT/writers and recorded the amended contract. Phase 3: simplified the Company write paths. Phase 5: checked call sites and existing error boundaries. Phase 6: reviewed source and documentation. Phases 2/4 and UI work skipped: no grid, API, business action or visual contract changes. ListVM/grid columns, mapper, calculation, numbering and permission changes are not applicable.

No shared class was added: the owner explicitly removed the transaction wrapper; the direct transaction statements stay at the three persistence boundaries. Work remained root-owned because these edits depend on the same small transaction contract and overlap source/docs.

## Source checks

- Reviewed scoped backend diff and final write methods; transaction begins before duplicate reads and commits success only.
- git diff --check: passed for the three modified backend files.
- No source references remain to CompanyWriteScope, UpdateSnapshotAsync or the removed indexed-view SQL.
- Check-BookReferences.ps1: passed; every checked reference resolves.
- Recipe drift: all eight generated packets are stale. Canonical books used; owner regeneration and semantic review required. Generated packets were not edited.
- Build, tests, application/database verification and migrations were not run, as required by AGENTS.md.

## Owner verification

- Add and Update: reject duplicate live name/nonempty VAT; allow same keys in different tenants, unchanged self keys, absent VAT and reuse after soft delete.
- Run conflicting Company saves concurrently: at most one duplicate key is committed; localized concurrency failure may occur. Review SQL lock contention with representative data.
- Fail a Company update/import chunk: no partial owned rows; earlier successful import chunks remain committed.
- Verify new drivers still receive their numbers and default-group resolution still precedes Company mutation.

This change adds no migration requirement. Earlier, separately approved entity/EF changes remain outside this task's migration decision.

Suggested backend commit: `refactor(customers): simplify company transactions`.
