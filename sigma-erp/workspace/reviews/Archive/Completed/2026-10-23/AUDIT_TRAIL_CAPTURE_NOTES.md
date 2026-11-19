# Audit Trail capture handoff

| Item | Value |
|---|---|
| Status | Implemented source-only |
| Contract | `AUDIT_TRAIL_FULL_STACK_CONTRACT_FREEZE.md` |
| Recipe drift check | Passed on 2026-10-14 before packet use |
| Runtime verification | Pending owner build, migration and replay |

## Implemented persistence boundary

- `AuditTrailEntry` is a standalone metadata entity. It does not derive from `EntityBase`, has no source navigation or foreign key, and therefore cannot recursively audit itself.
- The sealed EF configuration is discovered by the existing `ApplyConfigurationsFromAssembly(... type => type.IsSealed)` convention. It keeps captured `Username` and `RecordNo` unbounded because the actor claim and base `No` have no universal storage limit; it bounds only the stable CLR type/action labels and defines a tenant/date/id index.
- `AuditTrailCaptureService.Capture<TEntity>` accepts an `EntityEntry<TEntity>` constrained to `EntityBase`. It captures only Created, effective Modified and Deleted events for the authenticated subscription. A false/null to true `IsDeleted` transition is Deleted, including the transition made by the existing `SiGmaDbContext.HandleAudit`; a physical Deleted state is also supported.
- Record metadata comes from the final tracked values: source `GUID`, nullable `No`, and the first mapped date property in the frozen `Date`, `DateOf`, `DateAndTime`, `JobDate` whitelist. An absent date stays null. Generated integer IDs, old/new values, navigations and secrets are not captured.
- The scoped `AuditTrailSaveChangesInterceptor` runs after the context-owned `HandleAudit`, takes the actor from `ClaimTypes.Name` with `System` fallback, and uses the existing `ClaimTypes.NameIdentifier` subscription boundary. It stages audit rows in the same base `SaveChanges` call and transaction; it never calls SaveChanges, starts a transaction, or commits one.
- On success, failure or cancellation, only rows staged by this interceptor are detached. Failed/cancelled saves therefore leave no staged audit rows to duplicate on a caller retry. Capture enumeration finishes before any audit entity is attached, and a local catch detaches every audit object if `AddRange` attaches partially and throws. A subsequent save also begins by cleaning a prior staged batch in case an exception path did not emit EF's failure callback. Successful cleanup preserves `SaveChanges(false)` business-entry state. The success result subtracts staged audit rows so existing callers continue to observe the business save count.

## Capture limits

The configured `SiGmaDbContext` interceptor captures tracked `EntityBase` writes, including tracked aggregate children. `EntityBaseWithoutSubscription`, raw SQL, `ExecuteUpdate`, `ExecuteDelete`, authentication stores outside this context, and writes through any context without this interceptor remain outside the boundary. The new table starts empty; there is no invented backfill or retention deletion.

## Schema and migration handoff

The schema adds `AuditTrailEntry` with `Id` (`int` identity primary key), `SubscriptionId` (`int`), `DateTime` (`datetime2`), `Username` (`nvarchar(max)`), `RecordType` (`nvarchar(256)`), `RecordGuid` (`uniqueidentifier`), nullable `RecordNo` (`nvarchar(max)`), `RecordAction` (`nvarchar(16)`), and nullable `RecordDate` (`datetime2`). It adds one non-unique index on `SubscriptionId`, `DateTime`, and `Id`; there is no source foreign key. No migration or model snapshot was created or changed in this workstream. The owner must check the migration name and run `Add-Migration AddAuditTrailEntries`, then inspect the generated table, column bounds and index before applying it.

## Source-only verification and risk

The scoped diff was inspected against the frozen persistence contract. Build, tests, database migration/application and runtime replay were prohibited for this task and remain pending. The material deployment risk is schema ordering: enabling the interceptor before the `AuditTrailEntry` table exists will cause tracked tenant saves to fail atomically rather than silently omit audit history.
