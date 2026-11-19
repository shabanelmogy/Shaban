-- Owner-authorized experimental-data repair, 2026-11-16.
-- Retains settings 23 for subscription 1007. No physical deletion or account/journal changes.
SET XACT_ABORT ON;
IF DB_NAME() <> N'db_a82a9c_sigmaoperations1'
    THROW 50001, 'Unexpected database. No repair applied.', 1;
BEGIN TRANSACTION;
DECLARE @lockResult int;
EXEC @lockResult = sys.sp_getapplock
    @Resource=N'Unique:SiGma.Helpers.Models.Settings.SettingsCommonModel:1007',
    @LockMode='Exclusive', @LockOwner='Transaction', @LockTimeout=10000;
IF @lockResult < 0 THROW 50002, 'Settings write lock unavailable.', 1;

IF (SELECT COUNT(*) FROM dbo.SettingsCommonModel WITH (UPDLOCK,HOLDLOCK)
    WHERE SubscriptionId=1007 AND (IsDeleted=0 OR IsDeleted IS NULL)) <> 23
    THROW 50003, 'Settings count changed. Reconcile before repair.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.SettingsCommonModel
    WHERE Id=23 AND SubscriptionId=1007 AND (IsDeleted=0 OR IsDeleted IS NULL)
      AND VehicleProfitLossExcludedAccounts=N'[]')
    THROW 50004, 'Canonical settings changed. No repair applied.', 1;

UPDATE dbo.SettingsCommonModel
SET IsDeleted=1, DeletedAt=SYSUTCDATETIME(), DeletedBy=N'Codex: report settings repair'
WHERE SubscriptionId=1007 AND Id BETWEEN 1 AND 22 AND (IsDeleted=0 OR IsDeleted IS NULL);
IF @@ROWCOUNT <> 22 THROW 50005, 'Unexpected affected count.', 1;
IF (SELECT COUNT(*) FROM dbo.SettingsCommonModel
    WHERE SubscriptionId=1007 AND (IsDeleted=0 OR IsDeleted IS NULL)) <> 1
    THROW 50006, 'Singleton verification failed.', 1;
COMMIT TRANSACTION;

SELECT SubscriptionId, Id AS RetainedSettingsId, VehicleProfitLossExcludedAccounts,
       (SELECT COUNT(*) FROM dbo.SettingsCommonModel WHERE SubscriptionId=1007 AND IsDeleted=1
           AND DeletedBy=N'Codex: report settings repair') AS ArchivedRows
FROM dbo.SettingsCommonModel
WHERE SubscriptionId=1007 AND (IsDeleted=0 OR IsDeleted IS NULL);
