import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const Routing: Routes = [
  {
    path: 'UserGuide',
    loadChildren: () =>
      import('../modules/UserGuide/user-guide.routes').then(m => m.USER_GUIDE_ROUTES),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'Clause',
    loadChildren: () =>
      import('./../modules/Agreements Dashboard 2/Clause/clause.routes').then(
        (m) => m.Clause_Routes
      ),
  },
  {
    path: 'PreTerminationRule',
    loadChildren: () =>
      import(
        './../modules/Agreements Dashboard 2/PreTerminationRule/preterminationrule.routes'
      ).then((m) => m.PreTerminationRule_Routes),
  },
  {
    path: 'Provision',
    loadChildren: () =>
      import(
        './../modules/Vouchers/Provisions/Provision/provision.routes'
      ).then((m) => m.Provision_Routes),
  },
  {
    path: 'ProvisionDetail',
    loadChildren: () =>
      import(
        './../modules/Agreements Dashboard 2/ProvisionDetail/provisiondetail.routes'
      ).then((m) => m.ProvisionDetail_Routes),
  },
  {
    path: 'BillDetail',
    loadChildren: () =>
      import('./../modules/Billing/BillDetail/billdetail.routes').then(
        (m) => m.BillDetail_Routes
      ),
  },
  {
    path: 'BillingInvoice',
    loadChildren: () =>
      import('./../modules/Billing/BillingInvoice/billinginvoice.routes').then(
        (m) => m.BillingInvoice_Routes
      ),
  },
  {
    path: 'BillSettings',
    loadChildren: () =>
      import('./../modules/Billing/BillSettings/billsettings.routes').then(
        (m) => m.BillSettings_Routes
      ),
  },
  {
    path: 'DataEntryCorrection',
    loadChildren: () =>
      import(
        './../modules/Data Entry Corrections/DataEntryCorrection/dataentrycorrection.routes'
      ).then((m) => m.DataEntryCorrection_Routes),
  },
  {
    path: 'DataEntryCorrectionModel',
    loadChildren: () =>
      import(
        './../modules/Data Entry Corrections/DataEntryCorrectionModel/dataentrycorrectionmodel.routes'
      ).then((m) => m.DataEntryCorrectionModel_Routes),
  },
  {
    path: 'DeliveryNote',
    loadChildren: () =>
      import(
        './../modules/Equipment Rental/DeliveryNote/deliverynote.routes'
      ).then((m) => m.DeliveryNoteRoutes),
  },
  {
    path: 'Equipment',
    loadChildren: () =>
      import('./../modules/Equipment Rental/Equipment/equipment.routes').then(
        (m) => m.Equipment_Routes
      ),
  },
  {
    path: 'Fleet',
    loadChildren: () =>
      import('./../modules/Sales/Fleet/fleet.routes').then(
        (m) => m.Fleet_Routes
      ),
  },
  {
    path: 'EquipmentRentalInvoice',
    loadChildren: () =>
      import(
        './../modules/Equipment Rental/EquipmentRentalInvoice/equipmentrentalinvoice.routes'
      ).then((m) => m.EquipmentRentalInvoice_Routes),
  },
  {
    path: 'TimeSheet',
    loadChildren: () =>
      import('./../modules/Equipment Rental/TimeSheet/timesheet.routes').then(
        (m) => m.TimeSheet_Routes
      ),
  },

  {
    path: 'ServiceChecklistItem1',
    loadChildren: () =>
      import(
        './../modules/Fleet/ServiceChecklistItem1/servicechecklistitem1.routes'
      ).then((m) => m.ServiceChecklistItem1_Routes),
  },
  {
    path: 'ServiceItem',
    loadChildren: () =>
      import('./../modules/Fleet/ServiceItem/serviceitem.routes').then(
        (m) => m.ServiceItem_Routes
      ),
  },
  {
    path: 'SourceCode',
    loadChildren: () =>
      import('./../modules/Fleet/SourceCode/sourcecode.routes').then(
        (m) => m.SourceCode_Routes
      ),
  },
  {
    path: 'FleetVehicle',
    loadChildren: () =>
      import('../modules/Fleet/Vehicle/fleet-vehicle.routes').then(
        (m) => m.FleetVehicle_Routes
      ),
  },
  {
    path: 'FleetVehicleType',
    loadChildren: () =>
      import('../modules/Fleet/VehicleType/fleet-vehicle-types.routes').then(
        (m) => m.FleetVehicleTypes_Routes
      ),
  },
  {
    path: 'VehicleQRLabel',
    loadChildren: () =>
      import('./../modules/Fleet/VehicleQRLabel/vehicleqrlabel.routes').then(
        (m) => m.VehicleQRLabel_Routes
      ),
  },
  {
    path: 'RepairVehicleDamages',
    loadChildren: () =>
      import(
        './../modules/Fleet/RepairVehicleDamages/fleet-repair-vehicle-damages.routes'
      ).then((m) => m.FleetRepairVehicleDamages_Routes),
  },
  {
    path: 'RepairedDamagesHistory',
    loadChildren: () =>
      import(
        './../modules/Fleet/RepairedDamagesHistory/repaired-damages-history.routes'
      ).then((m) => m.RepairedDamagesHistory_Routes),
  },
  {
    path: 'FleetVehicleService',
    loadChildren: () =>
      import(
        './../modules/Fleet/VehicleService/fleet-vehicle-service.routes'
      ).then((m) => m.FleetVehicleService_Routes),
  },
  {
    path: 'FleetAlerts',
    loadChildren: () =>
      import('./../modules/Fleet/Alerts/fleet-alerts.routes').then(
        (m) => m.FleetAlerts_Routes
      ),
  },
  {
    path: 'FleetServiceLog',
    loadChildren: () =>
      import('./../modules/Fleet/ServiceLog/fleet-servicelog.routes').then(
        (m) => m.FLEET_SERVICE_LOG_ROUTES
      ),
  },
  {
    path: 'FleetServiceBookings',
    loadChildren: () =>
      import(
        './../modules/Fleet/ServiceBookings/fleet-service-bookings.routes'
      ).then((m) => m.FLEET_SERVICE_BOOKINGS_ROUTES),
  },
  {
    path: 'FleetAccidents',
    loadChildren: () =>
      import('./../modules/Fleet/Accidents/fleet-accidents.routes').then(
        (m) => m.FLEET_ACCIDENTS_ROUTES
      ),
  },
  {
    path: 'FleetDailyServiceLogs',
    loadChildren: () =>
      import(
        './../modules/Fleet/DailyServiceLogs/fleet-daily-service-logs.routes'
      ).then((m) => m.FLEET_DAILY_SERVICE_LOGS_ROUTES),
  },
  {
    path: 'FleetDownloadProcessFines',
    loadChildren: () =>
      import(
        './../modules/Fleet/DownloadProcessFines/fleet-download-process-fines.routes'
      ).then((m) => m.FleetDownloadProcessFines_Routes),
  },
  {
    path: 'FleetDownloadProcessTolls',
    loadChildren: () =>
      import(
        './../modules/Fleet/DownloadProcessTolls/fleet-download-process-tolls.routes'
      ).then((m) => m.FleetDownloadProcessTolls_Routes),
  },
  {
    path: 'FleetDownloadProcessDarbTolls',
    loadChildren: () =>
      import(
        './../modules/Fleet/DownloadProcessDarbTolls/fleet-download-process-darb-tolls.routes'
      ).then((m) => m.FleetDownloadProcessDarbTolls_Routes),
  },
  {
    path: 'FleetVehicleTracker',
    loadChildren: () =>
      import(
        './../modules/Fleet/vehicle-tracker/fleet-vehicle-tracker.routes'
      ).then((m) => m.FleetVehicleTracker_Routes),
  },
  {
    path: 'LeaseAgreement',
    loadChildren: () =>
      import('./../modules/Lease/LeaseAgreement/leaseagreement.routes').then(
        (m) => m.LeaseAgreement_Routes
      ),
  },
  {
    path: 'LeaseCustomerSms',
    loadChildren: () =>
      import('./../modules/Lease/LeaseCustomerSms/lease-customer-sms.routes').then(
        (m) => m.LeaseCustomerSms_Routes
      ),
  },
  {
    path: 'LeaseMasterAgreement',
    loadChildren: () =>
      import(
        './../modules/Lease/LeaseMasterAgreement/leasemasteragreement.routes'
      ).then((m) => m.leaseMasterAgreementRoutes),
  },
  {
    path: 'LeaseClause',
    loadChildren: () =>
      import('./../modules/Lease/LeaseClause/leaseclause.routes').then(
        (m) => m.LeaseClause_Routes
      ),
  },
  {
    path: 'LeaseCostParameter',
    loadChildren: () =>
      import(
        './../modules/Lease/LeaseCostParameter/leasecostparameter.routes'
      ).then((m) => m.LeaseCostParameter_Routes),
  },
  {
    path: 'LeaseCostSetting',
    loadChildren: () =>
      import(
        './../modules/Lease/LeaseCostSetting/leasecostsetting.routes'
      ).then((m) => m.LeaseCostSetting_Routes),
  },
  {
    path: 'LeaseInquiry',
    loadChildren: () =>
      import('./../modules/Lease/LeaseInquiry/leaseinquiry.routes').then(
        (m) => m.LeaseInquiry_Routes
      ),
  },
  {
    path: 'LeaseQuotation',
    loadChildren: () =>
      import('./../modules/Lease/LeaseQuotation/leasequotation.routes').then(
        (m) => m.LeaseQuotation_Routes
      ),
  },
  {
    path: 'LeaseTariff',
    loadChildren: () =>
      import('./../modules/Lease/LeaseTariff/leasetariff.routes').then(
        (m) => m.LeaseTariff_Routes
      ),
  },

  {
    path: 'LimoQuotation',
    loadChildren: () =>
      import('./../modules/Limousine/LimoQuotation/limoquotation.routes').then(
        (m) => m.LimoQuotation_Routes
      ),
  },
  {
    path: 'DriversTracker',
    loadChildren: () =>
      import(
        './../modules/Limousine/DriversTracker/fleet-drivers-tracker.routes'
      ).then((m) => m.FleetDriversTracker_Routes),
  },
  {
    path: 'LimousineInvoice',
    loadChildren: () =>
      import(
        './../modules/Limousine/LimousineInvoice/limousineinvoice.routes'
      ).then((m) => m.LimousineInvoice_Routes),
  },
  {
    path: 'Location',
    loadChildren: () =>
      import('./../modules/Limousine/Location/location.routes').then(
        (m) => m.Location_Routes
      ),
  },
  {
    path: 'LimousineTariff',
    loadChildren: () =>
      import(
        './../modules/Limousine/limousineTariff/LimousineTariff.routes'
      ).then((m) => m.LimousineTariff_Routes),
  },
  {
    path: 'LimousineTariffReport',
    loadChildren: () =>
      import(
        './../modules/Limousine/limousineTariffReport/limousineTariffReport.routes'
      ).then((m) => m.LimousineTariffReport_Routes),
  },
  {
    path: 'LimousineUtilizationReport',
    loadChildren: () =>
      import(
        './../modules/Limousine/UtilizationReport/utilization-report.routes'
      ).then((m) => m.LimousineUtilizationReportRoutes),
  },
  {
    path: 'ChauffeurForcedAllocationsReport',
    loadChildren: () =>
      import(
        './../modules/Limousine/ChauffeurForcedAllocationsReport/chauffeur-forced-allocations-report.routes'
      ).then((m) => m.ChauffeurForcedAllocationsReportRoutes),
  },
  {
    path: 'TripType',
    loadChildren: () =>
      import('./../modules/Limousine/TripTypes/trip-type.routes').then(
        (m) => m.TripType_Routes
      ),
  },
  {
    path: 'TripBooking',
    loadChildren: () =>
      import('./../modules/Limousine/TripBooking/tripbooking.routes').then(
        (m) => m.TripBooking_Routes
      ),
  },
  {
    path: 'TripGridCustomization',
    loadChildren: () =>
      import(
        './../modules/Limousine/TripGridCustomization/tripgridcustomization.routes'
      ).then((m) => m.TripGridCustomization_Routes),
  },
  {
    path: 'CustodyMovement',
    loadChildren: () =>
      import(
        './../modules/Movements/CustodyMovement/custodymovement.routes'
      ).then((m) => m.CustodyMovement_Routes),
  },
  {
    path: 'DeliveryMovement',
    loadChildren: () =>
      import(
        './../modules/Movements/DeliveryMovement/deliverymovement.routes'
      ).then((m) => m.DeliveryMovement_Routes),
  },
  {
    path: 'NRM',
    loadChildren: () =>
      import('./../modules/Movements/NRM/nrm.routes').then((m) => m.NRM_Routes),
  },
  {
    path: 'Workshop',
    loadChildren: () =>
      import('./../modules/Movements/Workshop/workshop.routes').then(
        (m) => m.Workshop_Routes
      ),
  },
  {
    path: 'WorkshopMovement',
    loadChildren: () =>
      import(
        './../modules/Movements/WorkshopMovement/workshopmovement.routes'
      ).then((m) => m.WorkshopMovement_Routes),
  },
  {
    path: 'collectionMovement',
    loadChildren: () =>
      import(
        './../modules/Movements/collectionMovement/collection-movement.routes'
      ).then((m) => m.CollectionMovement_Routes),
  },
  {
    path: 'logsMovement',
    loadChildren: () =>
      import('./../modules/Movements/logsMovement/logs-movement-routes').then(
        (m) => m.LogsMovement_Routes
      ),
  },

  {
    path: 'RentalAgreement',
    loadChildren: () =>
      import('./../modules/Rental/Agreement/agreement.routes').then(
        (m) => m.Agreement_Routes
      ),
  },
  {
    path: 'DriverTimeSheet',
    loadChildren: () =>
      import(
        './../modules/Rental/DriverTimeSheet/driver-time-sheet.routes'
      ).then((m) => m.driverTimeSheetRoutes),
  },
  {
    path: 'RentalBooking',
    loadChildren: () =>
      import('./../modules/Rental/Booking/booking.routes').then(
        (m) => m.RentalBooking_Routes
      ),
  },
  {
    path: 'RentalTariff',
    loadChildren: () =>
      import('./../modules/Rental/RentalTariff/tariff.routes').then(
        (m) => m.RentalTariff_Routes
      ),
  },
  {
    path: 'TariffCard',
    loadChildren: () =>
      import('./../modules/Rental/TariffCard/tariffcard.routes').then(
        (m) => m.TariffCards_Routes
      ),
  },
  {
    path: 'RentalQuotation',
    loadChildren: () =>
      import('./../modules/Rental/RentalQuotation/rentalquotation.routes').then(
        (m) => m.RentalQuotation_Routes
      ),
  },
  {
    path: 'EquipmentQuotation',
    loadChildren: () =>
      import(
        './../modules/Equipment Rental/EquipmentQuotation/equipmentrental.routes'
      ).then((m) => m.EquipmentQuotation_Routes),
  },
  {
    path: 'EquipmentMasterAgreement',
    loadChildren: () =>
      import(
        './../modules/Equipment Rental/EquipmentMasterAgreement/equipmentmasteragreement.routes'
      ).then((m) => m.EquipmentMasterAgreementRoutes),
  },
  {
    path: 'MasterAgreement',
    loadChildren: () =>
      import('./../modules/Rental/MasterAgreement/masteragreement.routes').then(
        (m) => m.MasterAgreementRoutes
      ),
  },
  {
    path: 'RentalPlanner',
    loadChildren: () =>
      import('./../modules/Rental/RentalPlanner/rental-planner.routes').then(
        (m) => m.rentalPlannerRoutes
      ),
  },
  {
    path: 'SalesAgreement',
    loadChildren: () =>
      import('./../modules/Sales/SalesAgreement/salesagreement.routes').then(
        (m) => m.SalesAgreement_Routes
      ),
  },
  {
    path: 'DueInstallments',
    loadChildren: () =>
      import(
        './../modules/Sales/DueInstallments/due-installments.routes'
      ).then((m) => m.dueInstallmentsRoutes),
  },
  {
    path: 'SalesQuotation',
    loadChildren: () =>
      import('./../modules/Sales/SalesQuotation/salesquotation.routes').then(
        (m) => m.SalesQuotation_Routes
      ),
  },
  {
    path: 'Staff',
    loadChildren: () =>
      import('./../modules/Staff/Staff/staff.routes').then(
        (m) => m.Staff_Routes
      ),
  },
  {
    path: 'StaffStatement',
    loadChildren: () =>
      import(
        './../modules/Staff/StaffStatementOfAccount/staffstatementofaccount.routes'
      ).then((m) => m.StaffStatementRoutes),
  },
  {
    path: 'Alerts',
    loadChildren: () =>
      import(
        './../modules/Customers/alerts/alerts.routes'
      ).then((m) => m.Alerts_Routes),
  },
  {
    path: 'StaffBalancesSummary',
    loadChildren: () =>
      import(
        './../modules/Staff/StaffBalancesSummary/staff-balances-summary.routes'
      ).then((m) => m.StaffBalancesSummaryRoutes),
  },
  {
    path: 'StaffTimesheet',
    loadChildren: () =>
      import('./../modules/Staff/StaffTimesheet/stafftimesheet.routes').then(
        (m) => m.StaffTimesheet_Routes
      ),
  },
  {
    path: 'StaffOverTime',
    loadChildren: () =>
      import('./../modules/Staff/StaffOverTime/staffovertime.routes').then(
        (m) => m.StaffOverTime_Routes
      ),
  },
  {
    path: 'StaffDutySchedule',
    loadChildren: () =>
      import(
        './../modules/Staff/StaffDutySchedule/staffdutyschedule.routes'
      ).then((m) => m.StaffDutySchedule_Routes),
  },
  {
    path: 'Item',
    loadChildren: () =>
      import('./../modules/Stock/Item/item.routes').then((m) => m.Item_Routes),
  },
  {
    path: 'UnitsOfMeasures',
    loadChildren: () =>
      import(
        './../modules/Stock/UnitsOfMeasures/units-of-measures.routes'
      ).then((m) => m.UnitsOfMeasures_Routes),
  },
  {
    path: 'ItemIssue',
    loadChildren: () =>
      import('./../modules/Stock/ItemIssue/itemissue.routes').then(
        (m) => m.ItemIssue_Routes
      ),
  },
  {
    path: 'ItemTypes',
    loadChildren: () =>
      import('./../modules/Stock/ItemType/item-types.routes').then(
        (m) => m.ItemTypes_Routes
      ),
  },
  {
    path: 'ItemIssueItem',
    loadChildren: () =>
      import('./../modules/Stock/ItemIssueItem/itemissueitem.routes').then(
        (m) => m.ItemIssueItem_Routes
      ),
  },
  {
    path: 'ItemRequisition',
    loadChildren: () =>
      import('./../modules/Stock/ItemRequisition/itemrequisition.routes').then(
        (m) => m.ItemRequisition_Routes
      ),
  },
  {
    path: 'ItemRequisitionItem',
    loadChildren: () =>
      import(
        './../modules/Stock/ItemRequisitionItem/itemrequisitionitem.routes'
      ).then((m) => m.ItemRequisitionItem_Routes),
  },
  {
    path: 'ItemReturn',
    loadChildren: () =>
      import('./../modules/Stock/ItemReturn/itemreturn.routes').then(
        (m) => m.ItemReturn_Routes
      ),
  },
  {
    path: 'ItemReturnItem',
    loadChildren: () =>
      import('./../modules/Stock/ItemReturnItem/itemreturnitem.routes').then(
        (m) => m.ItemReturnItem_Routes
      ),
  },
  {
    path: 'StockTransfer',
    loadChildren: () =>
      import('./../modules/Stock/StockTransfer/stocktransfer.routes').then(
        (m) => m.StockTransfer_Routes
      ),
  },
  {
    path: 'StockTransferItem',
    loadChildren: () =>
      import(
        './../modules/Stock/StockTransferItem/stocktransferitem.routes'
      ).then((m) => m.StockTransferItem_Routes),
  },
  {
    path: 'PurchaseOrdersDetailReport',
    loadChildren: () =>
      import(
        '../modules/stockReports/purchaseOrdersDetailReport/purchaseOrdersDetailReport.routes'
      ).then((m) => m.PurchaseOrdersDetailReport_Routes),
  },
  {
    path: 'GrnPendingReport',
    loadChildren: () =>
      import(
        '../modules/stockReports/GetGrnPendingReport/GetGrnPendingReport.routes'
      ).then((m) => m.GetGrnPendingReport_Routes),
  },
  {
    path: 'ItemsReturnReport',
    loadChildren: () =>
      import(
        '../modules/stockReports/itemsReturnReport/itemsReturnReport.routes'
      ).then((m) => m.ItemsReturnReport_Routes),
  },
  {
    path: 'DetailedStockReport',
    loadChildren: () =>
      import(
        './../modules/stockReports/DetailedStockReport/DetailedStockReport.routes'
      ).then((m) => m.DetailedStockReportComponent_Routes),
  },
  {
    path: 'StockSummary',
    loadChildren: () =>
      import('../modules/stockReports/StockSummary/StockSummary.routes').then(
        (m) => m.StockSummary_Routes
      ),
  },
   {
    path: 'PartsMovingReport',
    loadChildren: () =>
      import('../modules/stockReports/GetPartsMovingReport/GetPartsMovingReport.routes').then(
        (m) => m.GetPartsMovingReport_Routes
      ),
  },
  {
    path: 'ItemIssueReport',
    loadChildren: () =>
      import(
        '../modules/stockReports/itemsIssueReport/itemsIssueReport.routes'
      ).then((m) => m.ItemsIssueReport_Routes),
  },
  {
    path: 'PurchaseDetailsReport',
    loadChildren: () =>
      import(
        '../modules/stockReports/purchaseDetailsReport/purchaseDetailsReport.routes'
      ).then((m) => m.PurchaseDetailsReport_Routes),
  },
  {
    path: 'Supplier',
    loadChildren: () =>
      import('./../modules/Suppliers/Supplier/supplier.routes').then(
        (m) => m.Supplier_Routes
      ),
  },
  {
    path: 'SupplierStatement',
    loadChildren: () =>
      import(
        './../modules/Suppliers/SupplierStatementOfAccount/supplierstatementofaccount.routes'
      ).then((m) => m.SupplierStatementRoutes),
  },
  {
    path: 'SupplierBalancesSummary',
    loadChildren: () =>
      import(
        './../modules/Suppliers/SupplierBalancesSummary/supplier-balances-summary.routes'
      ).then((m) => m.supplierBalancesSummaryRoutes),
  },
  {
    path: 'PayableAgeAnalysis',
    loadChildren: () =>
      import(
        './../modules/Suppliers/PayableAgeAnalysis/payable-age-analysis.routes'
      ).then((m) => m.payableAgeAnalysisRoutes),
  },
  {
    path: 'Transaction',
    loadChildren: () =>
      import('./../modules/Transportation/Transaction/transaction.routes').then(
        (m) => m.Transaction_Routes
      ),
  },
  {
    path: 'TransactionItem',
    loadChildren: () =>
      import(
        './../modules/Transportation/TransactionItem/transactionitem.routes'
      ).then((m) => m.TransactionItem_Routes),
  },
  {
    path: 'TransportationAgreements',
    loadChildren: () =>
      import(
        './../modules/Transportation/TransportationAgreement/transportationagreement.routes'
      ).then((m) => m.TransportationAgreement_Routes),
  },
  {
    path: 'TransportationAgreementItem',
    loadChildren: () =>
      import(
        './../modules/Transportation/TransportationAgreementItem/transportationagreementitem.routes'
      ).then((m) => m.TransportationAgreementItem_Routes),
  },
  {
    path: 'TransportationTripSheets',
    loadChildren: () =>
      import('./../modules/Transportation/TripSheet/tripsheet.routes').then(
        (m) => m.TransportationTripSheets_Routes
      ),
  },
  {
    path: 'TransportationTrips',
    loadChildren: () =>
      import('./../modules/Transportation/Trips/trips.routes').then(
        (m) => m.TransportationTrips_Routes
      ),
  },
  {
    path: 'TransportationInvoice',
    loadChildren: () =>
      import(
        './../modules/Transportation/TransportationInvoice/transportationinvoice.routes'
      ).then((m) => m.TransportationInvoice_Routes),
  },
  {
    path: 'Job',
    loadChildren: () =>
      import('./../modules/Workshop/Job/job.routes').then((m) => m.Job_Routes),
  },
  {
    path: 'JobEstimation',
    loadChildren: () =>
      import('./../modules/Workshop/JobEstimation/jobestimation.routes').then(
        (m) => m.JobEstimation_Routes,
      ),
  },
  {
    path: 'LubricationJob',
    loadChildren: () =>
      import('./../modules/Workshop/LubricationJob/lubricationjob.routes').then(
        (m) => m.LubricationJob_Routes,
      ),
  },
  {
    path: 'JobCategory',
    loadChildren: () =>
      import('./../modules/Workshop/JobCategory/jobcategory.routes').then(
        (m) => m.JobCategory_Routes
      ),
  },
  {
    path: 'LabourTariff',
    loadChildren: () =>
      import('./../modules/Workshop/LabourTariff/labourtariff.routes').then(
        (m) => m.LabourTariff_Routes
      ),
  },
  {
    path: 'LabourActivities',
    loadChildren: () =>
      import(
        './../modules/Workshop/LabourActivities/labouractivities.routes'
      ).then((m) => m.LabourActivities_Routes),
  },
  {
    path: 'LabourActivitiesReport',
    loadChildren: () =>
      import(
        './../modules/Workshop/LabourActivitiesReport/labour-activities-report.routes'
      ).then((m) => m.LabourActivitiesReport_Routes),
  },
  {
    path: 'WorkOrder',
    loadChildren: () =>
      import('./../modules/Workshop/WorkOrder/workorder.routes').then(
        (m) => m.WorkOrder_Routes
      ),
  },
  {
    path: 'workshopVehicles',
    loadChildren: () =>
      import('./../modules/Workshop/workshopVehicles/workshopVehicles.routes').then(
        (m) => m.workshopVehicles_Routes
      ),
  },
  {
    path: 'Journal',
    loadChildren: () =>
      import(
        './../modules/Accounts/Journal/journal.routes'
      ).then((m) => m.Journal_Routes),
  },
  {
    path: 'LinkAccounts',
    loadChildren: () =>
      import(
        './../modules/Accounts/Link Accounts/LinkAccounts/linkaccounts.routes'
      ).then((m) => m.LinkAccounts_Routes),
  },
  // Administration Data Import
  {
    path: 'ImportVehicles',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportVehicles/import-vehicle.routes'
      ).then((m) => m.ImportVehicle_Routes),
  },
  {
    path: 'EmailTemplates',
    loadChildren: () =>
      import(
        './../modules/Administration/emailTemplates/emailTemplates.routes'
      ).then((m) => m.EmailTemplates_Routes),
  },
  {
    path: 'CorrectVehicleStatus',
    loadChildren: () =>
      import(
        './../modules/Administration/correctVehicleStatus/correctVehicleStatus.routes'
      ).then((m) => m.correctVehicleStatus_Routes),
  },
  {
    path: 'ImportSalikTolls',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportSalik/import-salik.routes'
      ).then((m) => m.ImportSalik_Routes),
  },
  {
    path: 'ImportDarbTolls',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportDarb/import-darb.routes'
      ).then((m) => m.ImportDarb_Routes),
  },
  {
    path: 'ImportFines',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportFines/import-fines.routes'
      ).then((m) => m.ImportFine_Routes),
  },
  {
    path: 'ImportStaff',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportStaff/import-staff.routes'
      ).then((m) => m.ImportStaff_Routes),
  },
  {
    path: 'ImportSuppliers',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportSuppliers/import-suppliers.routes'
      ).then((m) => m.ImportSupplier_Routes),
  },
  {
    path: 'ImportIndividualPartner',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportIndividualPartner/import-individual-partner.routes'
      ).then((m) => m.ImportIndividualPartner_Routes),
  },
  {
    path: 'ImportCompanies',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportCompanies/import-companies.routes'
      ).then((m) => m.ImportCompanies_Routes),
  },
  {
    path: 'ImportCustomers',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportCustomers/import-customers.routes'
      ).then((m) => m.ImportCustomer_Routes),
  },
  {
    path: 'ImportAssets',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportAssets/import-assets.routes'
      ).then((m) => m.ImportAsset_Routes),
  },
  {
    path: 'ImportItems',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportItems/import-items.routes'
      ).then((m) => m.ImportItem_Routes),
  },
  {
    path: 'ImportRentalAgreements',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportRentalAgreements/import-rental-agreements.routes'
      ).then((m) => m.ImportRentalAgreement_Routes),
  },
  {
    path: 'ImportClosedRentalAgreements',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportClosedRentalAgreements/import-closed-rental-agreements.routes'
      ).then((m) => m.ImportClosedRentalAgreement_Routes),
  },
  {
    path: 'ImportLeaseAgreements',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportLeaseAgreements/import-lease-agreements.routes'
      ).then((m) => m.ImportLeaseAgreement_Routes),
  },
  {
    path: 'ImportClosedLeaseAgreements',
    loadChildren: () =>
      import(
        './../modules/Administration/DataImport/ImportClosedLeaseAgreements/import-closed-lease-agreements.routes'
      ).then((m) => m.ImportClosedLeaseAgreement_Routes),
  },
  {
    path: 'Branch',
    loadChildren: () =>
      import('./../modules/Administration/Branches/branch.routes').then(
        (m) => m.Branch_Routes
      ),
  },
  {
    path: 'ChecklistItem',
    loadChildren: () =>
      import(
        './../modules/Administration/ChecklistItem/checklistitem.routes'
      ).then((m) => m.ChecklistItem_Routes),
  },
  {
    path: 'ChangeVoucherNo',
    loadChildren: () =>
      import(
        './../modules/Administration/changeVoucherNo/changeVoucherNo.routes'
      ).then((m) => m.ChangeVoucherNo_Routes),
  },
  {
    path: 'ContactGroup',
    loadChildren: () =>
      import(
        './../modules/Administration/ContactGroups/contactgroup.routes'
      ).then((m) => m.ContactGroup_Routes),
  },
  {
    path: 'CostCenter',
    loadChildren: () =>
      import('./../modules/Administration/CostCenters/costcenter.routes').then(
        (m) => m.CostCenter_Routes
      ),
  },
  {
    path: 'Currency',
    loadChildren: () =>
      import('./../modules/Administration/Currencies/currency.routes').then(
        (m) => m.Currency_Routes
      ),
  },
  {
    path: 'Country',
    loadChildren: () =>
      import('./../modules/Administration/Countries/country.routes').then(
        (m) => m.Country_Routes
      ),
  },
  {
    path: 'SponserShip',
    loadChildren: () =>
      import('./../modules/Administration/SponserShips/sponsership.routes').then(
        (m) => m.SponserShip_Routes
      ),
  },
  {
    path: 'CustomerProject',
    loadChildren: () =>
      import(
        './../modules/Administration/CustomerProjects/CustomerProject/customerproject.routes'
      ).then((m) => m.CustomerProject_Routes),
  },
  {
    path: 'CustomerRequest',
    loadChildren: () =>
      import(
        './../modules/Administration/CustomerRequests/customerrequest.routes'
      ).then((m) => m.CustomerRequest_Routes),
  },
  {
    path: 'CustomLookup',
    loadChildren: () =>
      import(
        './../modules/Administration/CustomLookups/customlookup.routes'
      ).then((m) => m.CustomLookup_Routes),
  },
  {
    path: 'Industry',
    loadChildren: () =>
      import('./../modules/Administration/Industries/industry.routes').then(
        (m) => m.Industry_Routes
      ),
  },
  {
    path: 'Language',
    loadChildren: () =>
      import('./../modules/Administration/Languages/language.routes').then(
        (m) => m.Language_Routes
      ),
  },
  {
    path: 'PaymentMethod',
    loadChildren: () =>
      import(
        './../modules/Administration/PaymentMethods/paymentmethod.routes'
      ).then((m) => m.PaymentMethod_Routes),
  },
  {
    path: 'ReplacementReason',
    loadChildren: () =>
      import(
        './../modules/Administration/ReplacementReasons/replacementreason.routes'
      ).then((m) => m.ReplacementReason_Routes),
  },
  {
    path: 'Role',
    loadChildren: () =>
      import('./../modules/Administration/Roles/role.routes').then(
        (m) => m.Role_Routes
      ),
  },
  {
    path: 'SaleOrigin',
    loadChildren: () =>
      import(
        './../modules/Administration/SaleOrigins/SaleOrigin/saleorigin.routes'
      ).then((m) => m.SaleOrigin_Routes),
  },
  {
    path: 'User',
    loadChildren: () =>
      import('./../modules/Administration/Users/user.routes').then(
        (m) => m.User_Routes
      ),
  },
  {
    path: 'VehicleNotReadyReason',
    loadChildren: () =>
      import(
        './../modules/Administration/VehicleNotReadyReasons/vehiclenotreadyreason.routes'
      ).then((m) => m.VehicleNotReadyReason_Routes),
  },
  {
    path: 'VoucherReason',
    loadChildren: () =>
      import(
        './../modules/Administration/VoucherReasons/voucherreason.routes'
      ).then((m) => m.VoucherReason_Routes),
  },
  {
    path: 'Settings',
    loadChildren: () =>
      import('./../modules/Administration/Settings/settings.routes').then(
        (m) => m.Settings_Routes
      ),
  },
  {
    path: 'Account',
    loadChildren: () =>
      import('./../modules/Accounts/Account/account.routes').then(
        (m) => m.Account_Routes
      ),
  },
  {
    path: 'Bank',
    loadChildren: () =>
      import('./../modules/Banking/Bank/bank.routes').then(
        (m) => m.Bank_Routes
      ),
  },
  {
    path: 'PDCReceivable',
    loadChildren: () =>
      import(
        './../modules/Banking/ChequesReceivables/pdc-receivable.routes'
      ).then((m) => m.PDCReceivable_Routes),
  },
  {
    path: 'PDCPayable',
    loadChildren: () =>
      import('./../modules/Banking/ChequesPayables/pdc-payable.routes').then(
        (m) => m.PDCPayable_Routes
      ),
  },
  {
    path: 'CardTransactionBankTransfer',
    loadChildren: () =>
      import(
        './../modules/Banking/Card Transactions Bank Transfers/CardTransactionBankTransfer/cardtransactionbanktransfer.routes'
      ).then((m) => m.CardTransactionBankTransfer_Routes),
  },
  {
    path: 'CardTransactionBankTransferDetail',
    // Legacy child ids are not aggregate ids; retire every old child URL to the list.
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/CardTransactionBankTransfer' },
      { path: '**', redirectTo: '/CardTransactionBankTransfer' },
    ],
  },
  {
    path: 'CashDeposit',
    loadChildren: () =>
      import(
        './../modules/Banking/Cash Deposits/CashDeposit/cashdeposit.routes'
      ).then((m) => m.CashDeposit_Routes),
  },
  {
    path: 'CompanyPartner',
    loadChildren: () =>
      import(
        './../modules/Customers/Companies/CompanyPartner/companypartner.routes'
      ).then((m) => m.CompanyPartner_Routes),
  },
  {
    path: 'IndividualPartner',
    loadChildren: () =>
      import(
        './../modules/Customers/Individual/IndividualPartner/individualpartner.routes'
      ).then((m) => m.IndividualPartner_Routes),
  },
  {
    path: 'DebtCollection',
    loadChildren: () =>
      import(
        './../modules/Customers/debtCollection/debtCollection.routes'
      ).then((m) => m.DebtCollection_Routes),
  },
  {
    path: 'followUpReport',
    loadChildren: () =>
      import(
        './../modules/Customers/followUpReport/followUpReport.routes'
      ).then((m) => m.FollowUpReport_Routes),
  },
  {
    path: 'BalancesSummary',
    loadChildren: () =>
      import(
        './../modules/Customers/BalancesSummary/balances-summary.routes'
      ).then((m) => m.balancesSummaryRoutes),
  },
  {
    path: 'ReceivableAgeAnalysis',
    loadChildren: () =>
      import(
        './../modules/Customers/ReceivableAgeAnalysis/receivable-age-analysis.routes'
      ).then((m) => m.receivableAgeAnalysisRoutes),
  },
  {
    path: 'StatementOfAccount',
    loadChildren: () =>
      import(
        './../modules/Customers/StatementOfAccount/statementofaccount.routes'
      ).then((m) => m.CustomerStatementRoutes),
  },
  {
    path: 'ProcessPayroll',
    loadChildren: () =>
      import('../modules/HRM/Payroll/PayrollProcess/payroll-process.routes').then(m => m.PayrollProcess_Routes),
  },
  {
    path: 'ProcessedPayrolls',
    loadChildren: () =>
      import('../modules/HRM/Payroll/Payrolls/payrolls.routes').then(m => m.Payrolls_Routes),
  },
  {
    path: 'ProcessLeaveSalary',
    loadChildren: () =>
      import('../modules/HRM/Payroll/leaveSalaryPayrollProcess/leave-salary-payroll-process.routes')
        .then(m => m.LeaveSalaryPayrollProcess_Routes),
  },
  {
    path: 'Attendance',
    loadChildren: () =>
      import('./../modules/HRM/Attendances/Attendance/attendance.routes').then(
        (m) => m.Attendance_Routes
      ),
  },
  {
    path: 'Deduction',
    loadChildren: () =>
      import('./../modules/HRM/Deductions/Deduction/deduction.routes').then(
        (m) => m.Deduction_Routes
      ),
  },
  {
    path: 'Holiday',
    loadChildren: () =>
      import('./../modules/HRM/Holidays/Holiday/holiday.routes').then(
        (m) => m.Holiday_Routes
      ),
  },
  {
    path: 'Leave',
    loadChildren: () =>
      import('./../modules/HRM/Leaves/Leave/leave.routes').then(
        (m) => m.Leave_Routes
      ),
  },
  {
    path: 'LeaveType',
    loadChildren: () =>
      import('./../modules/HRM/Leaves/LeaveType/leavetype.routes').then(
        (m) => m.LeaveType_Routes
      ),
  },
  {
    path: 'Overtime',
    loadChildren: () =>
      import('./../modules/HRM/Overtimes/Overtime/overtime.routes').then(
        (m) => m.Overtime_Routes
      ),
  },
  {
    path: 'Shift',
    loadChildren: () =>
      import('./../modules/HRM/Shifts/Shift/shift.routes').then(
        (m) => m.Shift_Routes
      ),
  },
  {
    path: 'StaffTimesheets',
    loadChildren: () =>
      import(
        './../modules/HRM/StaffTimesheets/StaffTimesheet/stafftimesheet.routes'
      ).then((m) => m.StaffTimesheet_Routes),
  },
  {
    path: 'LoanEMI',
    loadChildren: () =>
      import("./../modules/Loan/Loan EMI's/LoanEMI/loanemi.routes").then(
        (m) => m.LoanEMI_Routes
      ),
  },
  {
    path: 'Loans',
    loadChildren: () =>
      import("./../modules/Loan/Loan EMI's/LoanEMI/loanemi.routes").then(
        (m) => m.Loans_Routes
      ),
  },
  {
    path: 'LoanDetails',
    loadChildren: () =>
      import("./../modules/Loan/Loan EMI's/LoanEMI/loanemi.routes").then(
        (m) => m.LoanDetails_Routes
      ),
  },
  {
    path: 'Bill',
    loadChildren: () =>
      import('./../modules/Vouchers/Bills/Bill/bill.routes').then(
        (m) => m.Bill_Routes
      ),
  },
  {
    path: 'JournalVoucher',
    loadChildren: () =>
      import('./../modules/Vouchers/JVs/journal-voucher.routes').then(
        (m) => m.JV_Routes
      ),
  },
  {
    path: 'BillDetail',
    loadChildren: () =>
      import('./../modules/Vouchers/Bills/BillDetail/billdetail.routes').then(
        (m) => m.BillDetail_Routes
      ),
  },
  {
    path: 'CreditNote',
    loadChildren: () =>
      import('./../modules/Vouchers/CreditNote/creditnote.routes').then(
        (m) => m.CreditNote_Routes
      ),
  },
  {
    path: 'DebitNote',
    loadChildren: () =>
      import(
        './../modules/Vouchers/DebitNotes/DebitNote/debitnote.routes'
      ).then((m) => m.DebitNote_Routes),
  },
  {
    path: 'GoodsReceivedNote',
    loadChildren: () =>
      import(
        './../modules/Vouchers/GRNs/GoodsReceivedNote/goodsreceivednote.routes'
      ).then((m) => m.GRN_Routes),
  },
  {
    path: 'GoodsReceivedNoteDetail',
    loadChildren: () =>
      import(
        './../modules/Vouchers/GRNs/GoodsReceivedNoteDetail/goodsreceivednotedetail.routes'
      ).then((m) => m.GoodsReceivedNoteDetail_Routes),
  },
  {
    path: 'Invoice',
    loadChildren: () =>
      import('./../modules/Vouchers/Invoices/Invoice/invoice.routes').then(
        (m) => m.Invoice_Routes
      ),
  },
  {
    path: 'InvoiceBase',
    loadChildren: () =>
      import(
        './../modules/Vouchers/Invoices/InvoiceBase/invoicebase.routes'
      ).then((m) => m.InvoiceBase_Routes),
  },
  {
    path: 'MiscellaneousInvoice',
    loadChildren: () =>
      import(
        './../modules/Vouchers/Invoices/MiscellaneousInvoice/miscellaneousinvoice.routes'
      ).then((m) => m.MiscellaneousInvoice_Routes),
  },
  {
    path: 'MiscInvoiceItem',
    loadChildren: () =>
      import(
        './../modules/Vouchers/Invoices/MiscInvoiceItem/miscinvoiceitem.routes'
      ).then((m) => m.MiscInvoiceItem_Routes),
  },
  {
    path: 'Payment',
    loadChildren: () =>
      import('./../modules/Vouchers/Payments/Payment/payment.routes').then(
        (m) => m.Payment_Routes
      ),
  },
  {
    path: 'PaymentDetail',
    loadChildren: () =>
      import(
        './../modules/Vouchers/Payments/PaymentDetail/paymentdetail.routes'
      ).then((m) => m.PaymentDetail_Routes),
  },
  {
    path: 'Provision',
    loadChildren: () =>
      import(
        './../modules/Vouchers/Provisions/Provision/provision.routes'
      ).then((m) => m.Provision_Routes),
  },
  {
    path: 'ProvisionDetail',
    loadChildren: () =>
      import(
        './../modules/Vouchers/Provisions/ProvisionDetail/provisiondetail.routes'
      ).then((m) => m.ProvisionDetail_Routes),
  },
  {
    path: 'PurchaseOrder',
    loadChildren: () =>
      import(
        './../modules/Vouchers/PurchaseOrders/PurchaseOrder/purchaseorder.routes'
      ).then((m) => m.PurchaseOrder_Routes),
  },
  {
    path: 'PurchaseOrderDetail',
    loadChildren: () =>
      import(
        './../modules/Vouchers/PurchaseOrders/PurchaseOrderDetail/purchaseorderdetail.routes'
      ).then((m) => m.PurchaseOrderDetail_Routes),
  },
  {
    path: 'PurchaseRequest',
    loadChildren: () =>
      import(
        './../modules/Vouchers/PurchaseRequests/PurchaseRequest/purchaserequest.routes'
      ).then((m) => m.PurchaseRequest_Routes),
  },
  {
    path: 'PurchaseRequestDetail',
    loadChildren: () =>
      import(
        './../modules/Vouchers/PurchaseRequests/PurchaseRequestDetail/purchaserequestdetail.routes'
      ).then((m) => m.PurchaseRequestDetail_Routes),
  },
  {
    path: 'PurchaseReturn',
    loadChildren: () =>
      import(
        './../modules/Vouchers/PurchaseReturns/PurchaseReturn/purchasereturn.routes'
      ).then((m) => m.PurchaseReturn_Routes),
  },
  {
    path: 'PurchaseReturnDetail',
    loadChildren: () =>
      import(
        './../modules/Vouchers/PurchaseReturns/PurchaseReturnDetail/purchasereturndetail.routes'
      ).then((m) => m.PurchaseReturnDetail_Routes),
  },
  {
    path: 'Receipt',
    loadChildren: () =>
      import('./../modules/Vouchers/Receipts/Receipt/receipt.routes').then(
        (m) => m.Receipt_Routes
      ),
  },
  {
    path: 'SalaryVoucher',
    loadChildren: () =>
      import(
        './../modules/Vouchers/SalaryVouchers/SalaryVoucher/salaryvoucher.routes'
      ).then((m) => m.SalaryVoucher_Routes),
  },
  {
    path: 'TrafficFine',
    loadChildren: () =>
      import(
        './../modules/Vouchers/TrafficFines/TrafficFine/trafficfine.routes'
      ).then((m) => m.TrafficFine_Routes),
  },
  {
    path: 'CashFlowStatement',
    loadChildren: () =>
      import(
        './../modules/Accounts/CashFlowStatement/cash-flow-statement.routes'
      ).then((m) => m.CashFlowStatement_Routes),
  },
  {
    path: 'BalanceSheet',
    loadChildren: () =>
      import('./../modules/Accounts/BalanceSheet/balance-sheet.routes').then(
        (m) => m.BalanceSheet_Routes
      ),
  },
  {
    path: 'BalanceSheetMonthWise',
    loadChildren: () =>
      import(
        './../modules/Accounts/BalanceSheetMonthWise/balance-sheet-month-wise.routes'
      ).then((m) => m.BalanceSheetMonthWise_Routes),
  },
  {
    path: 'IncomeStatement',
    loadChildren: () =>
      import(
        './../modules/Accounts/IncomeStatement/income-statement.routes'
      ).then((m) => m.IncomeStatement_Routes),
  },
  {
    path: 'VehicleIncomeStatement',
    loadChildren: () =>
      import(
        './../modules/Accounts/VehicleIncomeStatement/vehicle-income-statement.routes'
      ).then((m) => m.VehicleIncomeStatement_Routes),
  },
  {
    path: 'IncomeComparison',
    loadChildren: () =>
      import(
        './../modules/Accounts/IncomeComparison/income-comparison.routes'
      ).then((m) => m.IncomeComparison_Routes),
  },
  {
    path: 'IncomeStatement2',
    loadChildren: () =>
      import(
        './../modules/Accounts/IncomeStatement2/income-statement2.routes'
      ).then((m) => m.IncomeStatement2_Routes),
  },
  {
    path: 'IncomeStatementYtd',
    loadChildren: () =>
      import(
        './../modules/Accounts/IncomeStatementYtd/income-statement-ytd.routes'
      ).then((m) => m.IncomeStatementYtd_Routes),
  },
  {
    path: 'IncomeStatementYtd2',
    loadChildren: () =>
      import(
        './../modules/Accounts/IncomeStatementYtd2/income-statement-ytd2.routes'
      ).then((m) => m.IncomeStatementYtd2_Routes),
  },
  {
    path: 'IncomeStatementFy',
    loadChildren: () =>
      import(
        './../modules/Accounts/IncomeStatementFy/income-statement-fy.routes'
      ).then((m) => m.IncomeStatementFy_Routes),
  },
  {
    path: 'IncomeStatementFy2',
    loadChildren: () =>
      import(
        './../modules/Accounts/IncomeStatementFy2/income-statement-fy2.routes'
      ).then((m) => m.IncomeStatementFy2_Routes),
  },
  {
    path: 'Ledger',
    loadChildren: () =>
      import(
        './../modules/Accounts/Ledger/ledger.routes'
      ).then((m) => m.Ledger_Routes),
  },
  {
    path: 'Department',
    loadChildren: () =>
      import(
        './../modules/HRM/Administration/Departments/Department/department.routes'
      ).then((m) => m.Department_Routes),
  },
  {
    path: 'HrmSetting',
    loadChildren: () =>
      import(
        './../modules/HRM/Administration/Settings/HrmSetting/hrmsetting.routes'
      ).then((m) => m.HrmSetting_Routes),
  },
  {
    path: 'StaffRole',
    loadChildren: () =>
      import(
        './../modules/HRM/Administration/Staff Roles/StaffRole/staffrole.routes'
      ).then((m) => m.StaffRole_Routes),
  },
  {
    path: 'FiscalYear',
    loadChildren: () =>
      import('./../modules/Accounts/FiscalYears/fiscalYear.routes').then(
        (m) => m.FiscalYears_Routes
      ),
  },
  {
    path: 'MonthClose',
    loadChildren: () =>
      import('./../modules/Accounts/MonthClose/month-close.routes').then(
        (m) => m.MonthClose_Routes
      ),
  },
  {
    path: 'asset',
    loadChildren: () =>
      import('../modules/Assets/asset/asset.routes').then(
        (m) => m.Asset_Routes
      ),
  },
  {
    path: 'assetType',
    loadChildren: () =>
      import('../modules/Assets/assetType/assettype.routes').then(
        (m) => m.AssetType_Routes
      ),
  },
  {
    path: 'depreciation',
    loadChildren: () =>
      import('../modules/Assets/depreciation/depreciation.routes').then(
        (m) => m.depreciation_Routes
      ),
  },
  {
    path: 'depreciationSummary',
    loadChildren: () =>
      import(
        '../modules/Assets/depreciationSummary/depreciation-summary.routes'
      ).then((m) => m.DepreciationSummary_Routes),
  },
  {
    path: 'depreciationDetail',
    loadChildren: () =>
      import(
        '../modules/Assets/depreciationDetail/depreciation-detail.routes'
      ).then((m) => m.DepreciationDetail_Routes),
  },
  {
    path: 'depreciationReportFy',
    loadChildren: () =>
      import(
        '../modules/Assets/depreciationReportFy/depreciation-report-fy.routes'
      ).then((m) => m.DepreciationReportFy_Routes),
  },
  {
    path: 'Reports',
    loadChildren: () =>
      import('./../modules/Reports/reports.routes').then(
        (m) => m.Reports_Routes
      ),
  },
  {
    path: 'openingBalances',
    loadChildren: () =>
      import(
        './../modules/Accounts/openingBalances/openingBalances.routes'
      ).then((m) => m.OpeningBalances_Routes),
  },
  {
    path: 'Designations',
    loadChildren: () =>
      import('./../modules/Staff/designations/designation.routes').then(
        (m) => m.designation_Routes
      ),
  },
  {
    path: 'auditTrail',
    loadChildren: () =>
      import('./../modules/Administration/auditTrail/audittrail.routes').then(
        (m) => m.auditTrail_Routes
      ),
  },
  {
    path: 'closedLeaseAgreements',
    loadChildren: () =>
      import(
        './../modules/Lease/closedLeaseAgreements/closedLeaseAgreements.routes'
      ).then((m) => m.closedLeaseAgreements),
  },
  {
    path: 'messageLogs',
    loadChildren: () =>
      import('./../modules/Administration/messageLogs/messageLogs.routes').then(
        (m) => m.messageLogs_Routes
      ),
  },
  {
    path: 'errorLogs',
    loadChildren: () =>
      import('./../modules/Administration/ErrorLogs/errorLogs.routes').then(
        (m) => m.errorLogsRoutes
      ),
  },
  {
    path: 'staffAlerts',
    loadChildren: () =>
      import('./../modules/Staff/alerts/alerts.routes').then(
        (m) => m.alerts_Routes
      ),
  },
  {
    path: 'BankReconciliation',
    loadChildren: () =>
      import(
        './../modules/Banking/Bank Reconciliation/BankReconciliation.routes'
      ).then((m) => m.BankReconciliation_Routes),
  },
  {
    path: 'reconciliationReport',
    loadChildren: () =>
      import(
        './../modules/Banking/ReconciliationReport/ReconciliationReport.routes'
      ).then((m) => m.BankReconciliation_Routes),
  },
  {
    path: 'Budget',
    loadChildren: () =>
      import('./../modules/Accounts/Budget/budget.routes').then(
        (m) => m.Budget_Routes
      ),
  },
  {
    path: 'BudgetVariance',
    loadChildren: () =>
      import('./../modules/Accounts/BudgetVariance/budget-variance.routes').then(
        (m) => m.BudgetVariance_Routes
      ),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];
