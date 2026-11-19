BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [CustodyMovement] DROP CONSTRAINT [FK_CustodyMovement_Branch_BranchId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [CustodyMovement] DROP CONSTRAINT [FK_CustodyMovement_Vehicle_VehicleId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] DROP CONSTRAINT [FK_DeliveryMovement_Agreement_AgreementId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] DROP CONSTRAINT [FK_DeliveryMovement_Branch_BranchOutId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] DROP CONSTRAINT [FK_DeliveryMovement_Driver_DriverId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] DROP CONSTRAINT [FK_DeliveryMovement_Partner_CustomerId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [NRM] DROP CONSTRAINT [FK_NRM_Branch_BranchId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [NRM] DROP CONSTRAINT [FK_NRM_Staff_StaffId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [NRM] DROP CONSTRAINT [FK_NRM_Vehicle_VehicleId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [RentalInvoiceItem] ADD [VehicleId] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [JournalVoucherDetail] ADD [VehicleId] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    DECLARE @var nvarchar(max);
    SELECT @var = QUOTENAME([d].[name])
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeliveryMovement]') AND [c].[name] = N'KMs');
    IF @var IS NOT NULL EXEC(N'ALTER TABLE [DeliveryMovement] DROP CONSTRAINT ' + @var + ';');
    ALTER TABLE [DeliveryMovement] ALTER COLUMN [KMs] nvarchar(50) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    DECLARE @var1 nvarchar(max);
    SELECT @var1 = QUOTENAME([d].[name])
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustodyMovement]') AND [c].[name] = N'Notes');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [CustodyMovement] DROP CONSTRAINT ' + @var1 + ';');
    ALTER TABLE [CustodyMovement] ALTER COLUMN [Notes] nvarchar(2000) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    DECLARE @var2 nvarchar(max);
    SELECT @var2 = QUOTENAME([d].[name])
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustodyMovement]') AND [c].[name] = N'CustodyMovementNo');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [CustodyMovement] DROP CONSTRAINT ' + @var2 + ';');
    ALTER TABLE [CustodyMovement] ALTER COLUMN [CustodyMovementNo] nvarchar(50) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    DECLARE @var3 nvarchar(max);
    SELECT @var3 = QUOTENAME([d].[name])
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustodyMovement]') AND [c].[name] = N'AgreementId');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [CustodyMovement] DROP CONSTRAINT ' + @var3 + ';');
    ALTER TABLE [CustodyMovement] ALTER COLUMN [AgreementId] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [CustodyMovement] ADD [EmployeeId] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN

    UPDATE movement
    SET AgreementId = NULL
    FROM dbo.CustodyMovement AS movement
    WHERE movement.AgreementId <= 0 OR NOT EXISTS (
        SELECT 1
        FROM dbo.RentalAgreement AS rental
        INNER JOIN dbo.Agreement AS agreement ON agreement.Id = rental.Id
        WHERE rental.Id = movement.AgreementId
          AND agreement.SubscriptionId = movement.SubscriptionId
    );

    UPDATE movement
    SET EmployeeId = employee.Id
    FROM dbo.CustodyMovement AS movement
    CROSS APPLY (
        SELECT TOP (1) staff.Id
        FROM dbo.Staff AS staff
        INNER JOIN dbo.MemberPartner AS member ON member.Id = staff.Id
        INNER JOIN dbo.Partner AS partner ON partner.Id = member.Id
        WHERE partner.SubscriptionId = movement.SubscriptionId
          AND ISNULL(partner.IsDeleted, 0) = 0
          AND partner.IsActive = 1 AND partner.IsInactive = 0
        ORDER BY CASE WHEN partner.BranchId = movement.BranchId THEN 0 ELSE 1 END, staff.Id
    ) AS employee
    WHERE movement.EmployeeId IS NULL;

    UPDATE movement
    SET BranchOutId = branch.Id
    FROM dbo.DeliveryMovement AS movement
    CROSS APPLY (
        SELECT TOP (1) source.Id
        FROM dbo.Branch AS source
        WHERE source.SubscriptionId = movement.SubscriptionId
          AND ISNULL(source.IsDeleted, 0) = 0 AND source.IsActive = 1
        ORDER BY source.Id
    ) AS branch
    WHERE movement.BranchOutId IS NULL;

    UPDATE movement
    SET BranchId = branch.Id
    FROM dbo.NRM AS movement
    CROSS APPLY (
        SELECT TOP (1) source.Id
        FROM dbo.Branch AS source
        WHERE source.SubscriptionId = movement.SubscriptionId
          AND ISNULL(source.IsDeleted, 0) = 0 AND source.IsActive = 1
        ORDER BY source.Id
    ) AS branch
    WHERE movement.BranchId IS NULL;

    IF EXISTS (SELECT 1 FROM dbo.CustodyMovement WHERE EmployeeId IS NULL)
        THROW 51001, 'Custody movements require a real active employee in their tenant.', 1;
    IF EXISTS (SELECT 1 FROM dbo.DeliveryMovement WHERE BranchOutId IS NULL)
        THROW 51002, 'Delivery movements require a real active branch in their tenant.', 1;
    IF EXISTS (SELECT 1 FROM dbo.NRM WHERE BranchId IS NULL)
        THROW 51003, 'NRM movements require a real active branch in their tenant.', 1;

END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    DECLARE @var4 nvarchar(max);
    SELECT @var4 = QUOTENAME([d].[name])
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustodyMovement]') AND [c].[name] = N'EmployeeId');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [CustodyMovement] DROP CONSTRAINT ' + @var4 + ';');
    ALTER TABLE [CustodyMovement] ALTER COLUMN [EmployeeId] int NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_RentalInvoiceItem_VehicleId] ON [RentalInvoiceItem] ([VehicleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_NRM_SubscriptionId_BranchId_DateAndTime_Id] ON [NRM] ([SubscriptionId], [BranchId], [DateAndTime] DESC, [Id] DESC) INCLUDE ([Type], [IsDeleted], [StaffId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_JournalVoucherDetail_VehicleId] ON [JournalVoucherDetail] ([VehicleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_DeliveryMovement_SubscriptionId_AgreementId_DateAndTime] ON [DeliveryMovement] ([SubscriptionId], [AgreementId], [DateAndTime]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_DeliveryMovement_SubscriptionId_BranchOutId_DateAndTime_Id] ON [DeliveryMovement] ([SubscriptionId], [BranchOutId], [DateAndTime], [Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_DeliveryMovement_SubscriptionId_VehicleId_DateAndTime] ON [DeliveryMovement] ([SubscriptionId], [VehicleId], [DateAndTime]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_CustodyMovement_AgreementId] ON [CustodyMovement] ([AgreementId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_CustodyMovement_EmployeeId] ON [CustodyMovement] ([EmployeeId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_CustodyMovement_SubscriptionId_BranchId_MovementDate_Id] ON [CustodyMovement] ([SubscriptionId], [BranchId], [MovementDate], [Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_CustodyMovement_SubscriptionId_EmployeeId_MovementDate] ON [CustodyMovement] ([SubscriptionId], [EmployeeId], [MovementDate]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    CREATE INDEX [IX_CustodyMovement_SubscriptionId_VehicleId_MovementDate] ON [CustodyMovement] ([SubscriptionId], [VehicleId], [MovementDate]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [CustodyMovement] ADD CONSTRAINT [FK_CustodyMovement_Branch_BranchId] FOREIGN KEY ([BranchId]) REFERENCES [Branch] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [CustodyMovement] ADD CONSTRAINT [FK_CustodyMovement_RentalAgreement_AgreementId] FOREIGN KEY ([AgreementId]) REFERENCES [RentalAgreement] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [CustodyMovement] ADD CONSTRAINT [FK_CustodyMovement_Staff_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Staff] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [CustodyMovement] ADD CONSTRAINT [FK_CustodyMovement_Vehicle_VehicleId] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicle] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] ADD CONSTRAINT [FK_DeliveryMovement_Agreement_AgreementId] FOREIGN KEY ([AgreementId]) REFERENCES [Agreement] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] ADD CONSTRAINT [FK_DeliveryMovement_Branch_BranchOutId] FOREIGN KEY ([BranchOutId]) REFERENCES [Branch] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] ADD CONSTRAINT [FK_DeliveryMovement_Driver_DriverId] FOREIGN KEY ([DriverId]) REFERENCES [Driver] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [DeliveryMovement] ADD CONSTRAINT [FK_DeliveryMovement_Partner_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [Partner] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [JournalVoucherDetail] ADD CONSTRAINT [FK_JournalVoucherDetail_Vehicle_VehicleId] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicle] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [NRM] ADD CONSTRAINT [FK_NRM_Branch_BranchId] FOREIGN KEY ([BranchId]) REFERENCES [Branch] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [NRM] ADD CONSTRAINT [FK_NRM_Staff_StaffId] FOREIGN KEY ([StaffId]) REFERENCES [Staff] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [NRM] ADD CONSTRAINT [FK_NRM_Vehicle_VehicleId] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicle] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    ALTER TABLE [RentalInvoiceItem] ADD CONSTRAINT [FK_RentalInvoiceItem_Vehicle_VehicleId] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicle] ([Id]) ON DELETE NO ACTION;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261111193031_MovementPermissionsScope20261111'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261111193031_MovementPermissionsScope20261111', N'10.0.13');
END;

COMMIT;
GO

