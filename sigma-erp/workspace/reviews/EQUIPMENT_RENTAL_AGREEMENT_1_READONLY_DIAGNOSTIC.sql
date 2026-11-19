-- Owner explicitly authorized SELECT-only inspection, 2026-10-30.
-- Executed successfully against the running backend's compiled connection source.
-- Result: agreement 1 / subscription 1007 / quotation 3 / Approved / live;
-- zero physical agreement-rate rows; quotation detail 3 / equipment 1 / units 4 / live.
-- Scope: agreement 1 and its source quotation 3, confirmed by the live API response.
-- SELECT only; no prices, customer names, schema changes or data changes.
-- Do not filter child ownership/deletion here: the purpose is to compare those
-- fields with the parent and explain why the application's scoped read is empty.

SELECT TOP (1)
    [Id], [SubscriptionId], [QuotationId], [ApprovalStatus], [IsDeleted]
FROM [EquipmentMasterAgreement]
WHERE [Id] = 1;

SELECT TOP (201)
    [Id], [EquipmentMasterAgreementId], [EquipmentId], [SubscriptionId], [IsDeleted]
FROM [EquipmentAgreementRate]
WHERE [EquipmentMasterAgreementId] = 1
ORDER BY [Id];

SELECT TOP (201)
    [Id], [QuotationId], [EquipmentTypeId], [CarModelId], [Units], [SubscriptionId], [IsDeleted]
FROM [QuotationDetail]
WHERE [QuotationId] = 3
ORDER BY [Id];
