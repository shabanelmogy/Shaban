# Vehicle profit/loss source manifest

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-11 |

الملفات أدناه نطاق عمل الميزة؛ بعض الملفات المشتركة تحتوي تعديلات سابقة محفوظة وليست كلها من هذه المهمة.

## SigmaBackend — 37 files

- `SiGma.Business/IServices/IVehicleReportsService.cs`
- `SiGma.Business/MapperConfig/JournalVoucherDetailProfiler.cs`
- `SiGma.Business/Resolver/JournalVoucherResolver.cs`
- `SiGma.Business/Services/VehicleProfitLossLedgerRow.cs`
- `SiGma.Business/Services/VehicleReportsService.ProfitLoss.cs`
- `SiGma.Business/Services/VehicleReportsService.cs`
- `SiGma.Business/Services/VouchersServices/BillService.cs`
- `SiGma.Business/Services/VouchersServices/InvoiceAccountingService.cs`
- `SiGma.Business/Services/VouchersServices/InvoiceActionService.cs`
- `SiGma.Business/Services/VouchersServices/JournalVoucherService.cs`
- `SiGma.Business/Services/VouchersServices/MonthlyPostingJournalLineState.cs`
- `SiGma.Business/Services/VouchersServices/MonthlyPostingService.Prepare.cs`
- `SiGma.Business/Services/VouchersServices/RentalInvoiceGenerationService.cs`
- `SiGma.DataAccess/Configuration/JournalVoucherDetailConfig.cs`
- `SiGma.DataAccess/Configuration/RentalInvoiceItemConfig.cs`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx`
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
- `SiGma.Helpers/Models/Vouchers/JournalVoucherDetail.cs`
- `SiGma.Helpers/Models/Vouchers/RentalInvoiceItem.cs`
- `SiGma.ServerAPI/Authorization/BranchOperationRules.cs`
- `SiGma.ServerAPI/Authorization/PermissionPrerequisites.cs`
- `SiGma.ServerAPI/Controller/VehicleReportsController.cs`
- `SiGma.ViewModels/ViewModels/JournalVoucherDetail/JournalVoucherDetailAddVm.cs`
- `SiGma.ViewModels/ViewModels/JournalVoucherDetail/JournalVoucherDetailDetailVm.cs`
- `SiGma.ViewModels/ViewModels/JournalVoucherDetail/JournalVoucherDetailUpdateVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitAndLossDetailReportVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitAndLossDetailRowVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitAndLossReportVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitAndLossRowVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitAndLossWithSellingDetailReportVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitAndLossWithSellingDetailRowVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitLossOptionVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitLossOptionsVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitLossReportBaseVm.cs`
- `SiGma.ViewModels/ViewModels/VehicleReports/VhicleProfitLoss/VehicleProfitLossSearchVm.cs`
- `tests/SiGma.BranchAccess.Tests/JournalVehicleAttributionTests.cs`
- `tests/SiGma.BranchAccess.Tests/VehicleProfitLossPermissionTests.cs`

## SiGmaAngularFrontEnd — 28 files

- `src/app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/components/vehicle-profit-and-loss-detail.component.html`
- `src/app/modules/Reports/VehicleProfitAndLoss/components/vehicle-profit-and-loss-detail.component.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/components/vehicle-profit-and-loss.component.html`
- `src/app/modules/Reports/VehicleProfitAndLoss/components/vehicle-profit-and-loss.component.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/models/vehicle-profit-and-loss.model.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/services/vehicle-profit-and-loss.service.spec.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/services/vehicle-profit-and-loss.service.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/vehicle-profit-loss-access.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/vehicle-profit-loss-presentation.spec.ts`
- `src/app/modules/Reports/VehicleProfitAndLoss/vehicle-profit-loss-presentation.ts`
- `src/app/modules/Reports/reports.routes.ts`
- `src/app/modules/UserGuide/components/reader/guide-reader.component.ts`
- `src/app/modules/UserGuide/content/journal-vouchers-topic.ts`
- `src/app/modules/UserGuide/content/reports-guide.ts`
- `src/app/modules/UserGuide/content/vehicle-profit-loss-topic.ts`
- `src/app/modules/Vouchers/JVs/components/details/details.component.html`
- `src/app/modules/Vouchers/JVs/components/details/details.component.spec.ts`
- `src/app/modules/Vouchers/JVs/components/details/details.component.ts`
- `src/app/modules/Vouchers/JVs/models/create.ts`
- `src/app/modules/Vouchers/JVs/models/details.ts`
- `src/app/modules/i18n/vocabs/ar.ts`
- `src/app/modules/i18n/vocabs/authorization.ts`
- `src/app/modules/i18n/vocabs/en.ts`
- `src/app/modules/shared/authorization/permission-dependencies.ts`
- `src/app/modules/shared/authorization/route-access-policy.ts`
- `src/app/modules/shared/components/permission-tree/permission-tree.component.ts`
- `tsconfig.app.json`
