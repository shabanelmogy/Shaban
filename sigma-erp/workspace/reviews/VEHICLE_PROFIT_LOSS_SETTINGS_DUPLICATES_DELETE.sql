-- Owner explicitly confirmed old experimental data is not needed, 2026-11-16.
-- Remove only the 22 duplicates already identified; keep settings 23 and all payment methods.
SET XACT_ABORT ON;
IF DB_NAME() <> N'db_a82a9c_sigmaoperations1' THROW 50001, 'Unexpected database.', 1;
BEGIN TRANSACTION;
DECLARE @lockResult int;
EXEC @lockResult=sys.sp_getapplock
    @Resource=N'Unique:SiGma.Helpers.Models.Settings.SettingsCommonModel:1007',
    @LockMode='Exclusive', @LockOwner='Transaction', @LockTimeout=10000;
IF @lockResult<0 THROW 50002, 'Settings write lock unavailable.', 1;
IF (SELECT COUNT(*) FROM dbo.SettingsCommonModel WITH(UPDLOCK,HOLDLOCK)
    WHERE SubscriptionId=1007 AND Id BETWEEN 1 AND 22 AND IsDeleted=1
      AND DeletedBy=N'Codex: report settings repair')<>22
    THROW 50003, 'Duplicate set changed.', 1;
IF NOT EXISTS(SELECT 1 FROM dbo.SettingsCommonModel WHERE Id=23 AND SubscriptionId=1007
    AND (IsDeleted=0 OR IsDeleted IS NULL) AND VehicleProfitLossExcludedAccounts=N'[]')
    THROW 50004, 'Canonical settings changed.', 1;

-- This optional FK is membership in the obsolete row's DDA configuration.
-- Removing that membership leaves the payment method and its financial references intact.
UPDATE dbo.PaymentMethod SET SettingsCommonModelId=NULL
WHERE SubscriptionId=1007 AND SettingsCommonModelId BETWEEN 1 AND 22;
DECLARE @clearedMemberships int=@@ROWCOUNT;
IF @clearedMemberships<>1 THROW 50005, 'Payment-method membership changed.', 1;
DELETE FROM dbo.SettingsCommonModel
WHERE SubscriptionId=1007 AND Id BETWEEN 1 AND 22 AND IsDeleted=1
  AND DeletedBy=N'Codex: report settings repair';
IF @@ROWCOUNT<>22 THROW 50006, 'Unexpected duplicate deletion count.', 1;
IF (SELECT COUNT(*) FROM dbo.SettingsCommonModel WHERE SubscriptionId=1007)<>1
    THROW 50007, 'Singleton verification failed.', 1;
COMMIT TRANSACTION;
SELECT Id AS RetainedSettingsId, SubscriptionId, VehicleProfitLossExcludedAccounts,
       @clearedMemberships AS ClearedObsoleteDdaMemberships
FROM dbo.SettingsCommonModel WHERE SubscriptionId=1007;
