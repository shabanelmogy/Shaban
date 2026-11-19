# Lease Master Agreement delete-scope repair

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-10 |
| Reopening reason | The completed Lease master unit used a branch-filtered child query for a structural delete invariant, discovered while repairing the analogous Rental master path. |
| Scope | `LeaseMasterAgreementService.RemoveAsync` and one bounded source specification only |

## Confirmed source defect

- `LeaseMasterAgreementService.RemoveAsync` used `Repository.ExistsAsync<LeaseAgreement>` to decide whether a master has live child contracts.
- `LeaseAgreement` derives from `Agreement`. `BranchScopeRegistry.ApplyAgreementAggregateFilters` applies a global query filter that requires an ordinary user's readable Vehicle branch.
- Repository tenant/live predicates do not remove EF global filters. A live same-tenant LeaseAgreement linked to the master but assigned to an unreadable vehicle branch could therefore be absent from `ExistsAsync`, allowing deletion of a structurally referenced master.

## Repair

- The delete blocker now queries `Context.Set<LeaseAgreement>().IgnoreQueryFilters()` only for boolean existence evidence.
- The bypass is narrowed by explicit predicates for the authenticated `SubscriptionId`, `IsDeleted != true`, and the requested `LeaseMasterAgreementId`.
- No child details are returned or disclosed. Lease master header, quotation, reference, registry, permission, DTO, mapping, calculation, and schema behavior are unchanged.
- `LeaseMasterAgreementReadAccessTests` now includes a source-written case where a live same-tenant LeaseAgreement uses a Vehicle in branch 99 while the actor can read branch 10; deletion must fail and the master must remain.

## Verification and boundaries

- Recipe drift check: all eight generated packets reported `OK` before the repair.
- Source-only checks cover the scoped diff, merge markers, and whitespace.
- The specification was written before the production repair but was not executed under the standing project boundary. RED/GREEN, compilation, relational translation, runtime, database, and HTTP acceptance remain pending for the owner.
- No build, test, lint, database command, migration, snapshot edit, browser run, commit, push, or deployment command was run.

No `Add-Migration` is required. Suggested backend commit message:

`fix(lease-master-agreement): preserve hidden child delete blocker`
