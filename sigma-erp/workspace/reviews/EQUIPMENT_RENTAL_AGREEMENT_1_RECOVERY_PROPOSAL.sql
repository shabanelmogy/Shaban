-- Owner approved this conditional recovery on 2026-10-30.
-- Executed once with @Apply overridden to 1 in memory after that approval.
-- All dependency guards passed. Committed result: Id1 / Subscription1007 /
-- Quotation3 / ApprovalStatus1 (NotApproved). No rate rows were created.
-- Retained @Apply=0 below for safe review. Do not rerun: approved-state guard
-- intentionally fails now. This is a historical recovery artifact, not an app feature.
-- Target: the experimentally created, approved agreement 1 with no physical rates.
-- Effect if approved: change ApprovalStatus from Approved (0) to NotApproved (1).
-- No equipment, price, currency, tax, quotation, or document data is created/deleted.
-- Then use the existing editor to select actual equipment and prices and approve again.
-- Keep @Apply = 0 for review; set to 1 only after explicit owner authorization.
SET NOCOUNT ON;
SET XACT_ABORT ON;
DECLARE @Apply bit = 0;

BEGIN TRY
    BEGIN TRANSACTION;

    IF NOT EXISTS (
        SELECT 1 FROM [EquipmentMasterAgreement] WITH (UPDLOCK, HOLDLOCK)
        WHERE [Id] = 1 AND [SubscriptionId] = 1007 AND [QuotationId] = 3
          AND [ApprovalStatus] = 0 AND ISNULL([IsDeleted], 0) = 0
          AND [IsClosed] = 0
    )
        THROW 51000, 'Agreement identity/state changed; recovery aborted.', 1;

    -- Check all physical dependent rows, including deleted/history rows.
    -- Any dependency requires a separate recovery decision; never bypass it.
    IF EXISTS (SELECT 1 FROM [EquipmentAgreementRate] WITH (UPDLOCK, HOLDLOCK)
               WHERE [EquipmentMasterAgreementId] = 1)
       OR EXISTS (SELECT 1 FROM [SaleOrder] WITH (UPDLOCK, HOLDLOCK)
                  WHERE [EquipmentMasterAgreementId] = 1)
       OR EXISTS (SELECT 1 FROM [DeliveryNote] WITH (UPDLOCK, HOLDLOCK)
                  WHERE [MasterAgreementId] = 1)
       OR EXISTS (SELECT 1 FROM [TimeSheet] WITH (UPDLOCK, HOLDLOCK)
                  WHERE [MasterAgreementId] = 1)
       OR EXISTS (SELECT 1 FROM [EquipmentAgreementFinancialLog] WITH (UPDLOCK, HOLDLOCK)
                  WHERE [EquipmentMasterAgreementId] = 1)
        THROW 51001, 'Agreement has dependent rows; recovery aborted without changes.', 1;

    IF @Apply = 0
    BEGIN
        SELECT 1 AS [AgreementId], 0 AS [OldApprovalStatus],
               1 AS [ProposedApprovalStatus], 'Preview only; no change' AS [Outcome];
        ROLLBACK TRANSACTION;
        RETURN;
    END;

    UPDATE [EquipmentMasterAgreement]
    SET [ApprovalStatus] = 1
    WHERE [Id] = 1 AND [SubscriptionId] = 1007 AND [QuotationId] = 3
      AND [ApprovalStatus] = 0 AND ISNULL([IsDeleted], 0) = 0 AND [IsClosed] = 0;

    IF @@ROWCOUNT <> 1
        THROW 51002, 'Expected exactly one agreement; recovery aborted.', 1;

    COMMIT TRANSACTION;
    SELECT [Id], [SubscriptionId], [QuotationId], [ApprovalStatus]
    FROM [EquipmentMasterAgreement] WHERE [Id] = 1 AND [SubscriptionId] = 1007;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
