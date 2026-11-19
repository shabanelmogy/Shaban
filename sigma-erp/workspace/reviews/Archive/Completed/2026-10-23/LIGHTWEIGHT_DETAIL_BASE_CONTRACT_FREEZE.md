| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-08 |

# Lightweight detail base — frozen technical contract

Owner explicitly approved creating and using lightweight bases after discussing repeated Id/No in SalesQuotationDetailVM, and explicitly requested documentation updates. This supersedes BE3's explicit-only recommendation for repeated identity, without authorizing larger detail responses.

Scope: existing SiGma.Helpers/ViewModelsBases/Detail and the 48 standalone DetailVM classes below in SiGma.ViewModels. Discovery is limited to those DTOs and their shared mapping/serialization declarations, not full-solution business refactoring. Existing dirty Supplier DTO changes are preserved. New bases: abstract LeanDetailBaseVm contains public int Id { get; set; } only; abstract NumberedDetailBaseVm : LeanDetailBaseVm contains public string? No { get; set; } only. One named class per file, same existing namespace. Adopt numbered base only when nullable/default/attributes exactly match; otherwise adopt identity base and keep feature No as-is. TaxAdvanceDetailVm retains its nonnullable initialized No. No Name/tenant/audit/GUID/flags on either base.

Each existing class retains its concrete name, namespace, sealed modifier, fields, types/nullability, defaults, collections and formulas. Replace only a matching local Id/No declaration with inherited identical public properties; no shadow/new properties. Generic IService/Service/controller constraints remain TDetailVm : class. No JsonPolymorphic/JsonDerivedType metadata or discriminator; no mapping/service/controller/entity/configuration/Add/Update/List/Delete change. Existing heavy DetailBaseVm hierarchy remains compatible and unchanged. JSON member order is not an application contract; exact property names/types/nullability/defaults remain. SDK projects automatically include new source files and ViewModels already references Helpers.

Pre-edit conformance: BE3 owns lean detail responses; BE4 convention maps public members (actual BranchProfiler reference). Current SalesQuotationDetailVM explicitly declares Id/nullable No; SupplierDetailVM has the same pair and SupplierAddressDetailVM Id only. Existing Helpers DetailBaseVm additionally carries unused tenant/audit/flags. Use the owner-approved lean bases instead of adding those inherited fields. Helpers ObjectExtensions and LocalizationHelper use GetProperties without DeclaredOnly; no DeclaredOnly or polymorphic JSON annotations found in the scoped Helpers/ViewModels sources. Source-only verification will compare all properties after flattening the new inheritance against the pre-edit snapshot.

Frozen consumers (17 numbered, 31 identity):

- `SiGma.ViewModels/ViewModels/Accident/AccidentDamageChargeDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Accident/AccidentImageDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Bank/BankDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/CardTransactionBankTransfer/CardTransactionBankTransferDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/CardTransactionBankTransferDetail/CardTransactionBankTransferDetailDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/CashDeposit/CashDepositDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/CashDepositDetail/CashDepositDetailDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Equipment/EquipmentDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Item/ItemDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/ItemIssue/ItemIssueLineDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/ItemRequisition/ItemRequisitionLineDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/ItemReturn/ItemReturnDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/ItemReturn/ItemReturnLineDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/ItemTypes/ItemTypeDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/LeaseAgreement/LeaseAgreementBookingChargeDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/LeaseAgreement/LeaseAgreementClauseDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/LeaseAgreement/LeaseAgreementPreTerminationRuleDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/LeaseAgreement/LeaseAgreementProvisionDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/LimoQuotation/LimoQuotationDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/LimousineInvoice/LimousineInvoiceDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Location/LocationDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/PDCPayable/PDCPayableDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/PDCReceivable/PDCReceivableDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/SalesAgreement/SalesAgreementDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/SalesAgreementItem/SalesAgreementItemDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/SalesAgreementPayment/SalesAgreementPaymentDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/SalesQuotation/SalesQuotationDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/SalesQuotationItem/SalesQuotationItemDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Staff/StaffDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/StaffBankAccount/StaffBankAccountDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/StaffDesignation/StaffDesignationDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/StaffTimesheet/StaffTimesheetDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/StockTransfer/StockTransferDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/StockTransfer/StockTransferLineDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Supplier/SupplierAddressDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Supplier/SupplierDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Tariff/TariffExtraChargeItemDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Tariff/TariffMileageItemDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Tariff/TariffProtectionItemDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/Tariff/TariffRentalRateItemDetailVM.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/TaxAdvanceInvoice/TaxAdvanceDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/TripBooking/TripBookingDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/TripBooking/TripBookingDocumentDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/TripGridCustomization/TripGridCustomizationDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/TripType/TripTypeDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/UnitsOfMeasures/UnitsOfMeasuresDetailVm.cs` → LeanDetailBaseVm.
- `SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderDetailVm.cs` → NumberedDetailBaseVm.
- `SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderLineDetailVM.cs` → LeanDetailBaseVm.

Canonical authority: SIGMA_FEATURE_REVIEW_MASTER, BE3/4 and required sigma-screen-refactor skill. Owner authorizes correcting their explicit-only recommendation in the same task; update BE3, preamble/version/change log and skill rule/history, not generated packets. Initial recipe check: PLAN00 and Phase00–05 stale, Phase06 current; canonical blocks govern. Owner packet regeneration/semantic review pending.

No screenshot/business/API ambiguity, no financial calculations/persistence changes and no migration required. This is one sequential shared-contract extraction; no agent delegation needed. No build/test/lint/typecheck/runtime/browser/DB/migration/commit/push/deploy permitted. Guides keep their existing user behavior and fields; no new screen/topic is created by this technical change.
