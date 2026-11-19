-- Owner-authorized additive hosted Security schema update, 2026-11-06.
-- Run only against SiGma.Security's configured Identity database.
-- Preserves existing Identity accounts, credentials and migration history.
SET NOCOUNT ON;
SET XACT_ABORT ON;

IF OBJECT_ID(N'dbo.AspNetUsers', N'U') IS NULL
    THROW 51000, 'The existing Identity user table is required.', 1;

BEGIN TRY
    BEGIN TRANSACTION;

    IF COL_LENGTH(N'dbo.AspNetUsers', N'ErpUserId') IS NULL
        ALTER TABLE [dbo].[AspNetUsers] ADD [ErpUserId] int NULL;
    IF COL_LENGTH(N'dbo.AspNetUsers', N'IdentityRegistrationId') IS NULL
        ALTER TABLE [dbo].[AspNetUsers] ADD [IdentityRegistrationId] uniqueidentifier NULL;

    IF OBJECT_ID(N'dbo.TenantIdentity', N'U') IS NULL
    BEGIN
        CREATE TABLE [dbo].[TenantIdentity]
        (
            [RegistrationId] uniqueidentifier NOT NULL,
            [PlatformTenantId] int NOT NULL,
            [SubscriptionId] int NOT NULL,
            [SubscriptionCode] nvarchar(64) NOT NULL,
            [AdminUserId] nvarchar(450) NOT NULL,
            [ErpUserId] int NULL,
            [IsActive] bit NOT NULL CONSTRAINT [DF_TenantIdentity_IsActive] DEFAULT (0),
            CONSTRAINT [PK_TenantIdentity] PRIMARY KEY ([RegistrationId]),
            CONSTRAINT [FK_TenantIdentity_AspNetUsers_AdminUserId]
                FOREIGN KEY ([AdminUserId]) REFERENCES [dbo].[AspNetUsers] ([Id])
                ON DELETE NO ACTION
        );
    END;

    -- Separate compilation is required after adding columns in this same batch.
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.AspNetUsers') AND name = N'IX_AspNetUsers_IdentityRegistrationId')
        EXEC(N'CREATE UNIQUE INDEX [IX_AspNetUsers_IdentityRegistrationId] ON [dbo].[AspNetUsers] ([IdentityRegistrationId]) WHERE [IdentityRegistrationId] IS NOT NULL;');
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.AspNetUsers') AND name = N'IX_AspNetUsers_SubscriptionId_ErpUserId')
        EXEC(N'CREATE UNIQUE INDEX [IX_AspNetUsers_SubscriptionId_ErpUserId] ON [dbo].[AspNetUsers] ([SubscriptionId], [ErpUserId]) WHERE [SubscriptionId] IS NOT NULL AND [ErpUserId] IS NOT NULL;');

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.TenantIdentity') AND name = N'IX_TenantIdentity_PlatformTenantId')
        CREATE UNIQUE INDEX [IX_TenantIdentity_PlatformTenantId] ON [dbo].[TenantIdentity] ([PlatformTenantId]);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.TenantIdentity') AND name = N'IX_TenantIdentity_SubscriptionId')
        CREATE UNIQUE INDEX [IX_TenantIdentity_SubscriptionId] ON [dbo].[TenantIdentity] ([SubscriptionId]);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.TenantIdentity') AND name = N'IX_TenantIdentity_SubscriptionCode')
        CREATE UNIQUE INDEX [IX_TenantIdentity_SubscriptionCode] ON [dbo].[TenantIdentity] ([SubscriptionCode]);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.TenantIdentity') AND name = N'IX_TenantIdentity_AdminUserId')
        CREATE UNIQUE INDEX [IX_TenantIdentity_AdminUserId] ON [dbo].[TenantIdentity] ([AdminUserId]);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.TenantIdentity') AND name = N'IX_TenantIdentity_SubscriptionId_ErpUserId')
        EXEC(N'CREATE UNIQUE INDEX [IX_TenantIdentity_SubscriptionId_ErpUserId] ON [dbo].[TenantIdentity] ([SubscriptionId], [ErpUserId]) WHERE [ErpUserId] IS NOT NULL;');

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
