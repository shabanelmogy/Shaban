-- Prepared for owner review only. Not executed.
-- Connect to the confirmed Sigma database and supply the current subscription id.
-- Reads only the settings id, exclusion codes and matching account ids/codes.
DECLARE @SubscriptionId int = NULL;
IF @SubscriptionId IS NULL OR @SubscriptionId <= 0
    THROW 50001, 'Confirm the current subscription id before running this diagnostic.', 1;

SELECT Id, VehicleProfitLossExcludedAccounts
FROM SettingsCommonModel
WHERE SubscriptionId = @SubscriptionId AND (IsDeleted = 0 OR IsDeleted IS NULL)
ORDER BY Id;

WITH Exclusions AS (
    SELECT DISTINCT settings.Id AS SettingsId, LTRIM(RTRIM(exclusion.value)) AS ConfiguredCode
    FROM SettingsCommonModel AS settings
    CROSS APPLY OPENJSON(settings.VehicleProfitLossExcludedAccounts) AS exclusion
    WHERE settings.SubscriptionId = @SubscriptionId
      AND (settings.IsDeleted = 0 OR settings.IsDeleted IS NULL)
      AND LTRIM(RTRIM(exclusion.value)) <> ''
)
SELECT exclusion.SettingsId, exclusion.ConfiguredCode,
       COUNT(account.Id) AS LiveMatchingAccounts
FROM Exclusions AS exclusion
LEFT JOIN Account AS account
    ON account.SubscriptionId = @SubscriptionId
   AND (account.IsDeleted = 0 OR account.IsDeleted IS NULL)
   AND account.AccountCode = exclusion.ConfiguredCode
GROUP BY exclusion.SettingsId, exclusion.ConfiguredCode;
