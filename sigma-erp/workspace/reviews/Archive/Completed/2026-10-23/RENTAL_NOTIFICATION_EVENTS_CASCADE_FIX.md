# RentalNotificationEvents cascade-path fix

## Problem

Applying a new database migration failed while creating
`RentalNotificationEvents` with SQL Server error 1785:

> Introducing FOREIGN KEY constraint ... may cause cycles or multiple cascade paths.

The entity has nine required references to `BookingNotificationFlags`. EF Core
conventions generated `ON DELETE CASCADE` for all nine foreign keys. SQL Server
does not allow those parallel cascade paths from the same principal table to
the same dependent table.

## Source change

The fix is in:

`F:\Sigma\SigmaBackend\SiGma.DataAccess\Configuration\RentalNotificationEventsConfig.cs`

Each notification-flag relationship now explicitly uses:

```csharp
.OnDelete(DeleteBehavior.NoAction)
```

The affected relationships are:

- `CreatedByAdminId`
- `CreatedByCustomerId`
- `ModifiedByAdminId`
- `ModifiedByCustomerId`
- `CancelledByAdminId`
- `CancelledByCustomerId`
- `NoShowId`
- `ClosedAgreementCreatedId`
- `ConfirmedId`

This preserves the notification event when a flag record is deleted and removes
the SQL Server cascade-path conflict. It also follows the canonical backend
rule that relationship delete behavior must be explicit.

## Reapplying the database change

Do not edit the generated migration by hand. If the failed migration has not
been applied to any database, recreate that migration after the source
configuration change, then apply it to the new database. If it has already
been applied to another database, create a normal follow-up migration through
the owner's approved migration workflow instead.

This source change does not require a new entity or a model snapshot edit from
the implementation side; the owner must generate the appropriate migration
artifact as part of the database workflow.

## If the same error appears again

If the generated SQL still shows `ON DELETE CASCADE` for the nine
`RentalNotificationEvents` foreign keys, the application is executing an old
migration generated before this configuration change. There are no additional
relationships in the supplied error. Confirm that the migration was recreated
after the configuration change; do not edit the generated migration manually.

## IndividualPartner debt collector cascade-path fix

The same database recreation also exposed a second SQL Server 1785 conflict:

```sql
ALTER TABLE [IndividualPartner]
ADD CONSTRAINT [FK_IndividualPartner_Staff_DebtCollectorId]
FOREIGN KEY ([DebtCollectorId]) REFERENCES [Staff] ([Id]) ON DELETE SET NULL;
```

`Staff` and `IndividualPartner` both inherit from `MemberPartner`. Therefore,
deleting the shared `MemberPartner` row can reach `IndividualPartner` directly
through its inheritance foreign key and indirectly through `Staff` and
`DebtCollectorId`. SQL Server rejects the parallel path even though the second
relationship uses `SET NULL`.

The source fix is in:

`F:\Sigma\SigmaBackend\SiGma.DataAccess\Configuration\IndividualPartnerConfig.cs`

`DebtCollectorId` now uses:

```csharp
.OnDelete(DeleteBehavior.Restrict)
```

This matches the existing `CompanyConfig` debt-collector relationship and
keeps an assigned staff member from being physically deleted while it is still
referenced. The application already uses soft-delete fields for normal entity
deletion; the nullable field can be cleared explicitly before a permitted
physical deletion if that workflow is later required.

After this source change, recreate the not-yet-applied database migration so
it no longer emits `ON DELETE SET NULL` for this foreign key. Do not modify the
generated migration or model snapshot manually.
