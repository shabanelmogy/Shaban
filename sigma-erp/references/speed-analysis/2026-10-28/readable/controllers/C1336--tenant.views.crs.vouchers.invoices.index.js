// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:357391-359734
appModule.controller('tenant.views.crs.vouchers.invoices.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.invoice', 'abp.services.app.invoiceSearch', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.vehicle', 'abp.services.app.contactGroup', 'abp.services.app.invoiceEmail', 'abp.services.app.invoiceSMS', '$rootScope', 'abp.services.app.depreciationSummary', '$stateParams', 'abp.services.app.saleOrigin', 'abp.services.app.agreementGroup', 'abp.services.app.customerProject', 'abp.services.app.joFotaraIntegration',
        function ($scope, $uibModal, uiGridConstants, invoiceService, invoiceSearchService, directoryService, appSession, commonLookupService, utilities, vehicleService, contactGroupService, invoiceEmailAppService, invoiceSMSAppService, $rootScope, depreciationSummaryService, $stateParams, saleOriginService, agreementGroupService, customerProjectService) {
            var vm = this;
            var invoiceId = null;
            vm.loading = false;
            vm.agreementDashboardFilters = null;
            if ($stateParams.filters) {
                vm.agreementDashboardFilters = $stateParams.filters;
            }
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 }
            ];
            vm.agreementStatus = [{ id: null, name: 'All' }, { id: 1, name: 'Open' }, { id: 2, name: 'Closed' }];
            vm.invoiceDueDate = [{ id: null, name: '' }, { id: 1, name: 'Due Date' }, { id: 2, name: 'Over Due' }];
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isRentalEnabled = abp.features.isEnabled("CRS.Rental");
            vm.isEquipmentRentalEnabled = abp.features.isEnabled("ERS");
            vm.isEquipmentLeaseEnabled = abp.features.isEnabled("ERS.Lease");
            vm.isFmsEnable = abp.features.isEnabled("FMS");
            vm.invoicePrintToWordExport = abp.features.isEnabled("CRS.Vouchers.Invoices.InvoicePrintToWordExport");
            vm.isLimoEnabled = abp.features.isEnabled("CRS.Limo");
            vm.limoCustomField = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField"));
            vm.limoCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField1"));
            vm.recoveryAndChauffeurMiscInvoice = abp.features.isEnabled("CRS.Vouchers.Invoices.RecoveryAndChauffeurMiscInvoice");
            vm.invoiceToExport = abp.features.isEnabled("CRS.Vouchers.Invoices.InvoiceToExport");
            vm.printInvoicewWithArabic = abp.features.isEnabled("CRS.Vouchers.Invoices.InvoicePrintWithArabic");
            vm.isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
            vm.isAssetEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isTransportationEnabled = abp.features.isEnabled("CRS.Transportation");
            vm.stockSaleInvoice = abp.features.isEnabled("CRS.CustomFeatures.StockSaleInvoice");
            vm.isChauffeurEnabled = abp.features.isEnabled("CRS.Chauffeur");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isRentalProjectEnabled = abp.features.isEnabled("CRS.CustomFeatures.RentalCustomerProject");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik"); //&& abp.setting.get("App.General.TollsInvoice") == 2;
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking"); //&& abp.setting.get("App.General.ParkingInvoice") == 2;
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");// && abp.setting.get("App.General.DarbTollsInvoice") == 2;
            vm.isFineModeEnabled = (abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar") || abp.features.isEnabled("CRS.Fines")); //abp.setting.get("App.General.TrafficFineInvoice") == 2
            vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isAccessoriesEnabled = abp.features.isEnabled("CRS.AccessoriesRental");
            vm.isAgreementGroups = abp.auth.hasPermission('Pages.Tenant.AgreementGroups');
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Invoices");
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.fusionIntengration = abp.features.isEnabled('Core.Integration.Fusion');
            vm.generateFuelInvoiceEnabled = abp.features.isEnabled('CRS.CustomFeatures.FuelInvoice');
            vm.isEInvoicingUAEEnabled = abp.features.isEnabled("Core.Integration.EInvoicingUAE");
            vm.isCustomerCutoffDateForInvoicePrint = abp.features.isEnabled("Core.Integration.EInvoicingUAE.CustomerCutoffDateForInvoicePrint");

            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isChargeCardEnabled = abp.features.isEnabled("OnlinePayments.Customer.ChargeCard");
            vm.isRequestPaymentAfterCreationEnabled = abp.features.isEnabled("OnlinePayments.Invoice.RequestPaymentAfterCreation");
            vm.oneTimePaymentAfterCardAdd = abp.features.isEnabled("OnlinePayments.Invoice.OneTimePaymentAfterCardAdd");

            vm.isERSLeaseEnabled = abp.features.isEnabled("ERS.Lease");
            vm.isERSRentalInvoiceEnabled = abp.features.isEnabled("ERS.Rental");
            vm.isAccidentModuleEnabled = abp.features.isEnabled("CRS.Accident");
            vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.agreementAdditionalCharges = abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges');
            vm.agreementAdditionalChargesAfterClosing = abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalChargesAfterClosing');
            vm.vehicle_EnableMortgage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Mortgage"));
            vm.vehicle_EnableLeaseToOwn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseToOwn"));
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");

            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.IsInvoiceCommision = utilities.parseBoolean(abp.setting.get("App.General.InvoiceCommission"));
            vm.makeReceiptOptionalInAdvanceTaxInvoice = utilities.parseBoolean(abp.setting.get("App.General.MakeReceiptOptionalInAdvanceTaxInvoice"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.contactCategories = [{ id: 1, name: app.localize('Individuals') }, { id: 2, name: app.localize('Companies') }];
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.allowPrintingOfVoidedVouchers = abp.setting.getBoolean("App.General.AllowPrintingOfVoidedVouchers");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isTaxEnabled = abp.features.isEnabled('CRS.Tax');
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.Invoices");
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.isOutOfScopeInvoiceEnabled = abp.features.isEnabled("CRS.Vouchers.Invoices.OutOfScopeInvoice");
            vm.isAgreementEnabled = abp.features.isEnabled("CRS.Rental")
                || abp.features.isEnabled("FMS")
                || abp.features.isEnabled("CRS.Transportation")
                || abp.features.isEnabled("CRS.Lease");

            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isAllowQuatityAndPriceForMiscVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowQuatityAndPriceForMiscVoucherLine"));

            vm.invoiceTypes = [];
            vm.locations = [];
            vm.customerContactGroup = [];
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: 'Accessories Rental', id: 8 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });
            vm.isEmailLinkToCharge = abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.EmailLinkToCharge');
            vm.isChargeCard = abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ChargeCard');
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.showOnlyDueInvoices = abp.setting.getBoolean("App.Speed.Common.ShowOnlyDueInvoices");
            vm.advancedFiltersAreShown = false;
            function getInvoiceTypes() {
                if (vm.isRentalEnabled)
                    vm.invoiceTypes.push({ name: app.localize("RentalInvoice"), id: 1 });
                if (vm.isSalikModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("SalikInvoice"), id: 8 });
                if (vm.isDarbModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("DarbTollInvoice"), id: 63 });
                if (vm.isERSRentalInvoiceEnabled)
                    vm.invoiceTypes.push({ name: app.localize("EquipmentInvoice"), id: 46 });
                if (vm.isFineModeEnabled)
                    vm.invoiceTypes.push({ name: app.localize("FineInvoice"), id: 7 });
                if (vm.isLimoEnabled)
                    vm.invoiceTypes.push({ name: app.localize("LimousineInvoice"), id: 2 });
                if (vm.isLeaseEnabled) {
                    vm.invoiceTypes.push({ name: app.localize("LeaseInvoice"), id: 14 });
                    if (vm.stockSaleInvoice)
                        vm.invoiceTypes.push({ name: app.localize("StockSaleInvoice"), id: 67 });
                    if (vm.agreementAdditionalCharges || vm.agreementAdditionalChargesAfterClosing)
                        vm.invoiceTypes.push({ name: app.localize("AdditionalChargesInvoice"), id: 24 });
                }
                if (vm.isOutOfScopeInvoiceEnabled)
                    vm.invoiceTypes.push({ name: app.localize("OutOfScopeInvoice"), id: 121 });
                //if (vm.isERSLeaseEnabled)
                //    vm.invoiceTypes.push({ name: app.localize("EquipmentLeaseInvoice"), id: 47 });
                if (vm.isTransportationEnabled)
                    vm.invoiceTypes.push({ name: app.localize("TransportationInvoice"), id: 16 });
                if (vm.isAssetsModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("AssetSaleInvoice"), id: 17 });

                if (vm.isRentalEnabled || vm.isLeaseEnabled)
                    vm.invoiceTypes.push({ name: app.localize("FuelInvoice"), id: 29 });
                if (vm.isChauffeurEnabled)
                    vm.invoiceTypes.push({ name: app.localize("ChauffeurInvoice"), id: 34 });
                if (vm.isWorkshopEnabled)
                    vm.invoiceTypes.push({ name: app.localize("WorkshopInvoice"), id: 37 });
                if (vm.isAccessoriesEnabled)
                    vm.invoiceTypes.push({ name: app.localize("AccessoriesInvoice"), id: 55 });
                if (vm.isAccidentModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("ExcessChargesInvoice"), id: 57 });
                if (vm.isExcessKMsInvoiceEnabled)
                    vm.invoiceTypes.push({ name: app.localize("ExcessKMsInvoice"), id: 60 });
                if (vm.isAccountsEnabled && vm.isTaxEnabled)
                    vm.invoiceTypes.push({ name: app.localize("AdvanceTaxInvoice"), id: 65 });

                vm.invoiceTypes.push({ name: app.localize("MiscellaneousInvoice"), id: 9 });
                vm.invoiceTypes.push({ name: app.localize("RecoveryInvoice"), id: 74 });
                vm.invoiceTypes.push({ name: app.localize("ChaufferInvoice"), id: 75 });
                vm.invoiceTypes.push({ name: app.localize("DamageInvoice"), id: 30 });
                vm.invoiceTypes.push({ name: app.localize("FleetAssignmentInvoice"), id: 33 });
                vm.invoiceTypes.push({ name: app.localize("CDWInvoice"), id: 76 });
                vm.invoiceTypes.push({ name: app.localize("PAIInvoice"), id: 77 });
                vm.invoiceTypes.push({ name: app.localize("MileageInvoice"), id: 78 });
                vm.invoiceTypes.push({ name: app.localize("AdditionalDriverInvoice"), id: 79 });
                vm.invoiceTypes.push({ name: app.localize("BabySeatInvoice"), id: 80 });
                vm.invoiceTypes.push({ name: app.localize("DamageChargesInvoice"), id: 81 });
                vm.invoiceTypes.push({ name: app.localize("DeliveryChargesInvoice"), id: 82 });
                vm.invoiceTypes.push({ name: app.localize("CollectionChargesInvoice"), id: 83 });
                vm.invoiceTypes.push({ name: app.localize("PreTerminationPenaltyInvoice"), id: 84 });
                vm.invoiceTypes.push({ name: app.localize("ExcessInsuranceChargesInvoice"), id: 85 });
                vm.invoiceTypes.push({ name: app.localize("TyreInsuranceChargesInvoice"), id: 86 });
                vm.invoiceTypes.push({ name: app.localize("WindScreenInsuranceInvoice"), id: 87 });
                vm.invoiceTypes.push({ name: app.localize("RoadSideAssistanceInvoice"), id: 88 });
                vm.invoiceTypes.push({ name: app.localize("ExtraHoursChargesInvoice"), id: 89 });
                vm.invoiceTypes.push({ name: app.localize("WaitingChargesInvoice"), id: 90 });
                vm.invoiceTypes.push({ name: app.localize("Extra2Charges"), id: 91 });
                vm.invoiceTypes.push({ name: app.localize("Extra3Charges"), id: 92 });
                vm.invoiceTypes.push({ name: app.localize("Extra1Charges"), id: 93 });
                vm.invoiceTypes.push({ name: app.localize("Extra4Charges"), id: 94 });
                vm.invoiceTypes.push({ name: app.localize("ParkingInvoice"), id: 95 });
                vm.invoiceTypes.push({ name: app.localize("DriverChargesInvoice"), id: 96 });
                vm.invoiceTypes.push({ name: app.localize("OthersInvoice"), id: 97 });
                vm.invoiceTypes.push({ name: app.localize("SalesAgreementInvoice"), id: 98 });
                vm.invoiceTypes.push({ name: app.localize("SalesMiscInvoice"), id: 104 });
                vm.invoiceTypes.push({ name: app.localize("AirPortParkingInvoice"), id: 118 });
                vm.invoiceTypes.push({ name: app.localize("RecoveryTowingChargesInvoice"), id: 119 });
                vm.invoiceTypes.push({ name: app.localize("SmokingChargesInvoice"), id: 120 });
            };

            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("SalikInvoice");
                else if (voucherSubTypeId == 7) return app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) return app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) return app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) return app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) return app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) return app.localize("MiscellaneousInvoice");
                else if (voucherSubTypeId == 74) return app.localize("RecoveryInvoice");
                else if (voucherSubTypeId == 75) return app.localize("ChaufferInvoice");
                else if (voucherSubTypeId == 24) return app.localize("AdditionalChargesInvoice");
                else if (voucherSubTypeId == 29) return app.localize("FuelInvoice");
                else if (voucherSubTypeId == 30) return app.localize("DamageInvoice");
                else if (voucherSubTypeId == 33) return app.localize("FleetAssignmentInvoice");
                else if (voucherSubTypeId == 34) return app.localize("ChauffeurInvoice");
                else if (voucherSubTypeId == 37) return app.localize("WorkshopInvoice");
                else if (voucherSubTypeId == 46) return app.localize("EquipmentInvoice");
                else if (voucherSubTypeId == 55) return app.localize("AccessoriesInvoice");
                else if (voucherSubTypeId == 57) return app.localize("ExcessChargesInvoice");
                else if (voucherSubTypeId == 60) return app.localize("ExcessKMsInvoice");
                else if (voucherSubTypeId == 63) return app.localize('DarbTollInvoice');
                else if (voucherSubTypeId == 65) return app.localize('AdvanceTaxInvoice');
                else if (voucherSubTypeId == 67) return app.localize('StockSaleInvoice');
                else if (voucherSubTypeId == 76) return app.localize('CDWInvoice');
                else if (voucherSubTypeId == 77) return app.localize('PAIInvoice');
                else if (voucherSubTypeId == 78) return app.localize('MileageInvoice');
                else if (voucherSubTypeId == 79) return app.localize('AdditionalDriverInvoice');
                else if (voucherSubTypeId == 80) return app.localize('BabySeatInvoice');
                else if (voucherSubTypeId == 81) return app.localize('DamageChargesInvoice');
                else if (voucherSubTypeId == 82) return app.localize('DeliveryChargesInvoice');
                else if (voucherSubTypeId == 83) return app.localize('CollectionChargesInvoice');
                else if (voucherSubTypeId == 84) return app.localize('PreTerminationPenaltyInvoice');
                else if (voucherSubTypeId == 85) return app.localize('ExcessInsuranceChargesInvoice');
                else if (voucherSubTypeId == 86) return app.localize('TyreInsuranceChargesInvoice');
                else if (voucherSubTypeId == 87) return app.localize('WindScreenInsuranceInvoice');
                else if (voucherSubTypeId == 88) return app.localize('RoadSideAssistanceInvoice');
                else if (voucherSubTypeId == 89) return app.localize('ExtraHoursChargesInvoice');
                else if (voucherSubTypeId == 90) return app.localize('WaitingChargesInvoice');
                else if (voucherSubTypeId == 91) return app.localize('Extra2Charges');
                else if (voucherSubTypeId == 92) return app.localize('Extra3Charges');
                else if (voucherSubTypeId == 93) return app.localize('Extra1Charges');
                else if (voucherSubTypeId == 94) return app.localize('Extra4Charges');
                else if (voucherSubTypeId == 95) return app.localize('ParkingInvoice');
                else if (voucherSubTypeId == 96) return app.localize('DriverChargesInvoice');
                else if (voucherSubTypeId == 97) return app.localize('OthersInvoice');
                else if (voucherSubTypeId == 98) return app.localize('SalesAgreementInvoice');
                else if (voucherSubTypeId == 104) return app.localize('SaleMiscInvoice');
                // else if (voucherSubTypeId == 47) return app.localize("EquipmentLeaseInvoice");
                else if (voucherSubTypeId == 118) return app.localize('AirPortParkingInvoice');
                else if (voucherSubTypeId == 119) return app.localize('RecoveryTowingChargesInvoice');
                else if (voucherSubTypeId == 120) return app.localize('SmokingChargesInvoice');
                else if (voucherSubTypeId == 121) return app.localize('OutOfScopeInvoice');
                else return "";
            };

            vm.changePrintingWithoutLogo = function () {
                vm.gridOptions.data.forEach(function (value) {
                    value.printObj.printHeader = vm.filters.printingWithoutLogo;
                });
                vm.printIds.printHeader = vm.filters.printingWithoutLogo;
            };

            vm.changePrintingWithoutTollsDarb = function () {
                vm.gridOptions.data.forEach(function (value) {
                    value.printObj.printDetails = vm.filters.printingWithoutTollsDarb;
                });
                vm.printIds.printDetails = vm.filters.printingWithoutTollsDarb;
            };
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];
            vm.approveAllEnableBotton = false;
            vm.filters = {
                enableDateRange: true,
                name: "",
                status: null,
                agreementStatus: null,
                invoiceDueDate: null,
                dueFromDate: null,
                dueToDate: null,
                insuranceCompany: null,
                insuranceClaimNo: '',
                DontPaginate: false,
                manualAgreementNo: null,
                creditInvoice: false,
                agreementNo: null,
                voucherNo: null,
                customerId: null,
                projectName: null,
                projectId: null,
                fromDate: null,
                salesPerson: null,
                toDate: null,
                amount: null,
                //invoiceType: null,
                invoiceType: [],
                customerContact: [],
                contactType: [],
                locationId: '',
                skipCount: 0,
                vehicleId: null,
                vehicle: null,
                printingWithoutLogo: false,
                printingWithoutTollsDarb: false,
                maxResultCount: app.consts.grid.defaultPageSize,
                vehicleOwnership: null,
                saleOrigin: null,
                agreementGroup: null,
                agreementGroupId: null,
                customProject: "",
                limoCustomField1: "",
                dueDateRange: false,
                module: null
            };
            vm.rentalAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 },
                { key: 'Buy Back', value: 3 }
            ];

            vm.vipCustomer = [
                { key: 'Vip', value: 1 },
                { key: 'Non Vip', value: 0 }
            ];

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            };
            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };


            vm.getAssetSearch = function ($select) {
                if ($select.search == "") return;
                depreciationSummaryService.getAssetSearch({ title: $select.search, isDisposed: true }).success(function (data) {
                    vm.assets = data.items;
                }).finally(function () {

                });
            };

            vm.clearAsset = function () {
                vm.filters.assetId = null;
                vm.filters.asset = null;
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            //vm.dateRangeModel = {
            //    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
            //    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            //};

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Edit'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Approve'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.CanApproveOtherBranchInvoices'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.UnApprove'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Delete'),
                void: vm.isVoidingEnabled ? abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Void') : false,
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ExportToExcel'),
                exportToWord: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ExportToWord'),
                exportPrintToWord: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ExportPrintToWord'),
                exportToExcelChargesWise: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ChargesWiseExportToExcel'),
                exportToExcelInvoiceReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ExportToExcelInvoiceReceipt'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ViewOtherBranchInvoices'),
                emailInvoice: abp.features.isEnabled("Notifications.EmailTrafficFineInvoice"),
                emailInvoiceManual: abp.features.isEnabled("Notifications.EmailInvoiceManual"),
                SendFineSMS: abp.features.isEnabled("Notifications.FinesSMS"),
                WhatsAppSMSInvoiceManual: abp.features.isEnabled("Notifications.WhatsAppSMSInvoiceManual"),
                createReceiptFromInvoice: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.CreateReceiptFromInvoice'),
                markDisputed: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.MarkDisputed'),
                unMarkDisputed: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.UnmarkDisputed'),

            };
            vm.isEnabled = (feature) => {
                return abp.features.isEnabled(feature);
            }
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            // loading Customers


            vm.allBranchPermission = function (row) {
                if (row.locationId) {
                    if (vm.permissions.approved && !vm.permissions.canApprovedOther && (row.locationId === appSession.user.locationId)) {
                        return true;
                    }
                    if (vm.permissions.canApprovedOther && !vm.permissions.approved && ((row.locationId != appSession.user.locationId) || (row.locationId === appSession.user.locationId))) {
                        return true;
                    }
                    if (vm.permissions.canApprovedOther && vm.permissions.approved && ((row.locationId != appSession.user.locationId) || (row.locationId === appSession.user.locationId))) {
                        return true;
                    }

                }
                return false;
            };

            vm.getCustomerContactGroups = function () {
                vm.loading = true;
                //contactType:2   Because we only need Customers
                contactGroupService.getContactGroupsOnContactType({ contactType: 2 }).success(function (data) {
                    vm.customerContactGroup = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchSaleOrigin = function ($select) {
                if (!$select.search) return;
                return saleOriginService.getSaleOrigins({ keyword: $select.search }).then(function (response) {
                    vm.saleOrigins = response.data.items;
                });
            };

            vm.searchAgreementGroup = function () {

                return agreementGroupService.getAgreementGroups().then(function (response) {
                    vm.agreementGroups = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchSupplierContact = function ($select) {
                // Only contact Suppliers=3 is required
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchProjects = function ($select) {
                if (!$select.search) return;
                return customerProjectService.getCustomerProject({ keyword: $select.search }).then(function (response) {
                    vm.projects = response.data.items;
                });
            };

            vm.clearInsuranceCompany = function () {
                vm.filters.insuranceCompany = null;
                vm.filters.insuranceCompanyId = null;
            };

            vm.clearSaleOrigin = function () {
                vm.filters.saleOrigin = null;
                vm.filters.saleOriginId = null;
            };

            vm.clearProject = function () {
                vm.filters.projectName = null;
                vm.filters.projectId = null;
            };

            vm.clearAgreementGroups = function () {
                vm.filters.agreementGroup = null;
                vm.filters.agreementGroupId = null;
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
                    }
                });
            };

            vm.searchUsers = function ($select) {

                return directoryService.search({
                    keyword: $select.search, contactType: 1
                }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };
            vm.searchSalesPersonPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.company.salesPerson = result;

                    }
                });
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.searchvehicleOwners = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.vehicleOwners = response.data.items;
                });
            };

            vm.searchvehicleOwnersPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return null;
                        }
                    }
                }).result.then(function (owner) {
                    if (!owner) {
                        vm.filters.vehicleOwner = owner;
                        vm.filters.vehicleOwnerId = owner.id;
                    }
                });
            };
            vm.clearVehicleOwner = function () {
                vm.filters.vehicleOwner = null;
                vm.filters.vehicleOwnerId = null;
            };

            // CreateOrEdit Modal
            //function openCreateOrEditInvoiceModal(invoiceId) {
            //    var modalInstance = $uibModal.open(
            //        {
            //            templateUrl: '~/App/tenant/views/crs/invoices/createOrEditModal.cshtml',
            //            controller: 'tenant.views.crs.invoices.createOrEditModal as vm',
            //            backdrop: 'static',
            //            size: 'lg',
            //            resolve: {
            //                invoiceId: function () {
            //                    return invoiceId;
            //                }
            //            }
            //        });
            //}

            // Opening  ViewRecieptModal 
            function openViewInvoiceModal(invoiceId, agreement) {
                var templateUrl = "";
                var controller = "";
                if (abp.features.isEnabled("POS") === true) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/posInvoiceviewModel.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.posInvoiceviewModal as vm';
                }
                else {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.viewModal as vm';

                }

                $uibModal.open({
                    templateUrl: templateUrl,
                    controller: controller,

                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });

            }
            function openViewInvoiceModalQuatityAndPriceMisc(invoiceId, agreement) {
                var templateUrl = "";
                var controller = "";
                if (abp.features.isEnabled("POS") === true) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/posInvoiceviewModel.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.posInvoiceviewModal as vm';
                } else if (vm.isAllowQuatityAndPriceForMiscVoucherLine) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/viewModalQuatityAndPriceMisc.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.viewModal as vm';
                }


                else {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.viewModal as vm';

                }

                $uibModal.open({
                    templateUrl: templateUrl,
                    controller: controller,

                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });

            }
            vm.openViewInvoiceModalSalesAgreement = function (invoiceId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewModalSalesAgreementInvoice.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.viewModalSalesAgreementInvoice as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
            };




            function openCreateOrEditInvoiceModal(invoiceId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var templateUrl = "";
                var controller = "";
                if (abp.features.isEnabled("POS") === true) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/posInvoicecreateOrEditModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.posInvoicecreateOrEditModal as vm';
                } else {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm';

                }
                var modalInstance = $uibModal.open({
                    templateUrl: templateUrl,
                    controller: controller,
                    //templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
                    //controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            }
            function openCreateOrEditInvoiceModalQuatityAndPriceMisc(invoiceId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var templateUrl = "";
                var controller = "";
                if (abp.features.isEnabled("POS") === true) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/posInvoicecreateOrEditModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.posInvoicecreateOrEditModal as vm';
                }
                else if (vm.isAllowQuatityAndPriceForMiscVoucherLine) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/createOrEditModalQuatityAndPriceMisc.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm';

                }
                else {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm';

                }
                var modalSize = vm.isAllowQuatityAndPriceForMiscVoucherLine ? 'full' : 'xl';
                var modalInstance = $uibModal.open({
                    templateUrl: templateUrl,
                    controller: controller,
                    //templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
                    //controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                    backdrop: 'static',
                    size: modalSize,
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            }
            function openEditSalesAgreementInvoiceModal(invoiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateSalesAgreementModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateSalesAgreementModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        installmentInvoice: function () {
                            return null;
                        },
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            }
            function openCreateOrEditLimoInvoiceModal(invoiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditLimoModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditLimoModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            }
            function openCreateOrEditStockSaleInvoiceModal(invoiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateStockSaleInvoice.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateStockSaleInvoice as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            }

            function openViewLimoInvoiceModal(invoiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewLimoModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditLimoModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                });
            }

            vm.createInvoice = function () {
                openCreateOrEditInvoiceModal(null, null);
            };

            vm.editInvoice = function (invoice) {
                if (invoice.voucherSubTypeId == 9) {
                    openCreateOrEditInvoiceModalQuatityAndPriceMisc(invoice.id, null);
                }
                else if (invoice.voucherSubTypeId == 98 || invoice.voucherSubTypeId == 104) {
                    openEditSalesAgreementInvoiceModal(invoice.id, null);
                }
                else {
                    openCreateOrEditInvoiceModal(invoice.id, null);

                }
            };

            vm.editStockSaleInvoice = function (invoice) {
                openCreateOrEditStockSaleInvoiceModal(invoice.id, null);
            };

            vm.editLimoInvoice = function (invoice) {
                openCreateOrEditLimoInvoiceModal(invoice.id);
            };

            vm.editAdvanceTaxInvoice = function (invoice) {
                vm.generateAdvanceTaxInvoices(invoice.id);
            };
            // Viewing Invoice

            vm.viewInvoice = function (invoice) {
                if (invoice.voucherSubTypeId == 9) {
                    openViewInvoiceModalQuatityAndPriceMisc(invoice.id, null);
                }
                else if (invoice.voucherSubTypeId == 98 || invoice.voucherSubTypeId == 104) {
                    vm.openViewInvoiceModalSalesAgreement(invoice.id)
                }
                else {
                    openViewInvoiceModal(invoice.id, null);
                }
            };

            vm.viewLimoInvoice = function (invoice) {
                openViewLimoInvoiceModal(invoice.id, null);
            };

            vm.generateInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                agreement: null
                            }
                        }
                    }
                });
                //modalInstance.result.then(function (result) {
                //    vm.getInvoices();
                //});
            };
            vm.generateAccessoriesInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateAccessoriesModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateAccessoriesModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                agreement: null
                            }
                        }
                    }
                });
                //modalInstance.result.then(function (result) {
                //    vm.getInvoices();
                //});
            };
            vm.generateEquipmentRentalInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateEquipmentRentalModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateEquipmentRentalModal as vm',
                    backdrop: 'static',
                    size: 'full'
                });
                //modalInstance.result.then(function (result) {
                //    vm.getInvoices();
                //});
            };

            vm.generateFmsInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateFmsInvoiceModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateFmsInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'xl'
                });
            };

            vm.generateParkingInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateParkingModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateParkingModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    keyboard: false
                });

            };

            vm.generateSalikInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateSalikModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateSalikModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    keyboard: false
                });

            };

            vm.generateDarbSalikInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateDarbSalikModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateDarbSalikModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    keyboard: false
                });

            };

            vm.generateFineInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateFineModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateFineModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    keyboard: false,
                    resolve: {
                        options: function () {
                            return null;
                        }
                    }
                });

            };

            vm.generateLimoInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateLimoModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateLimoModal as vm',
                    backdrop: 'static',
                    size: 'xl'
                });
                //modalInstance.result.then(function (result) {
                //    vm.getInvoices();
                //});
            };

            vm.generateLeaseInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateLeaseModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateLeaseModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                agreement: null
                            }
                        }
                    }
                });
            };

            vm.generateExcessKMsInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateExcessKMsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateExcessKMsModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                agreement: null
                            }
                        }
                    }
                });
            };

            vm.generateEquipmentLeaseInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateEquipmentLeaseModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateEquipmentLeaseModal as vm',
                    backdrop: 'static',
                    size: 'xl'
                });
            };

            vm.generateTransportationInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateTransportationModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateTransportationModal as vm',
                    backdrop: 'static',
                    size: 'xl'
                });
            };

            vm.generateChauffeurInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateChauffeurModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateChauffeurModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
            };

            vm.generateAdvanceTaxInvoices = function (invoiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateAdvanceTaxModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        advanceReceiptData: function () {
                            return;

                        }
                    }
                });
            };

            vm.generateMiscInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
            };
            vm.generateOutOfScopeInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateOutOfScopeInvoiceModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateOutOfScopeInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
            };
            vm.generateQuatityAndPriceMiscInvoices = function () {
                var modalSize = vm.isAllowQuatityAndPriceForMiscVoucherLine ? 'full' : 'xl';

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModalQuatityAndPriceMisc.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                    backdrop: 'static',
                    size: modalSize, // Dynamically setting the modal size based on the setting
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
            };
            vm.generateFuelInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateFuelInvoiceModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateFuelInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
            };
            vm.generateRecoveryInvoices = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return 74;
                        }
                    }
                });
            };
            vm.generateChaufferInvoices = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return 75;
                        }
                    }
                });
            };

            vm.generateStockSaleInvoice = function () {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateStockSaleInvoice.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateStockSaleInvoice as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
            };

            vm.generateRentalClubInvoices = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditModalRentalClub.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditModalRentalClub as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
            };

            vm.generateLimoInvoice = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditLimoModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditLimoModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            };


            // Define a function to update fromDate and toDate filters based on the selected dueDate option
            vm.dueDateFilter = function () {
                if (vm.filters.invoiceDueDate != null) {
                    vm.filters.dueFromDate = moment().startOf('day').utc();
                    vm.filters.dueToDate = moment().endOf('day').utc();
                }
                else {
                    vm.filters.dueFromDate = null;
                    vm.filters.dueToDate = null;
                }
            };



            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                //vm.changeInvoiceRange();
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }

                if (vm.filters.vip != null) {
                    vm.filters.isVipCustomer = vm.filters.vip;
                } else {
                    vm.filters.isVipCustomer = null;
                }
                vm.filters.invoiceTypeArray = [];
                vm.filters.contactGroups = []; //ids only

                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }

                if (vm.filters.customerContact.length > 0) {
                    angular.forEach(vm.filters.customerContact, function (value) {
                        vm.filters.contactGroups.push(value.id);
                    });
                }


                invoiceSearchService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.invoiceReceiptExportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                //vm.changeInvoiceRange();
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                if (vm.filters.vip != null) {
                    vm.filters.isVipCustomer = vm.filters.vip;
                } else {
                    vm.filters.isVipCustomer = null;
                }
                vm.filters.invoiceTypeArray = [];
                vm.filters.contactGroups = []; //ids only

                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }

                if (vm.filters.customerContact.length > 0) {
                    angular.forEach(vm.filters.customerContact, function (value) {
                        vm.filters.contactGroups.push(value.id);
                    });
                }


                invoiceSearchService.invoiceReceiptExportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.chargesWiseExportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                //vm.changeInvoiceRange();
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                if (vm.filters.vip != null) {
                    vm.filters.isVipCustomer = vm.filters.vip;
                } else {
                    vm.filters.isVipCustomer = null;
                }
                vm.filters.invoiceTypeArray = [];
                vm.filters.contactGroups = []; //ids only

                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }

                if (vm.filters.customerContact.length > 0) {
                    angular.forEach(vm.filters.customerContact, function (value) {
                        vm.filters.contactGroups.push(value.id);
                    });
                }


                invoiceSearchService.chargesWiseExportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.deleteInvoice = function (invoice) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', invoice.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceService.deleteInvoice({
                                id: invoice.id
                            }).success(function () {
                                vm.getInvoices();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.voidInvoice = function (invoice) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', invoice.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            invoiceService.voidInvoice({
                                id: invoice.id
                            }).success(function () {
                                vm.getInvoices();
                                abp.notify.success(app.localize('SuccessfullyVoided'));
                            }).error(function (data) {
                                if (data) {
                                    setTimeout(() => abp.message.info(data.message), 300);
                                }

                            }).finally(function () { vm.loading = false; });
                        }
                    }
                );
            };

            vm.changeInvoiceRange = function () {
                if (!vm.filters.invoiceRange) {
                    vm.filters.invoiceTo = null;
                    vm.filters.invoiceFrom = null;
                }
                if (vm.filters.invoiceRange) {
                    vm.filters.voucherNo = null;
                }

            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.getInvoices = function () {
                vm.loading = true;
                vm.changeInvoiceRange();

                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }

                if (vm.filters.saleOrigin != null) {
                    vm.filters.saleOriginId = vm.filters.saleOrigin.id;
                }
                if (vm.filters.projectName != null) {
                    vm.filters.projectId = vm.filters.projectName.id;
                }

                if (vm.filters.agreementGroup != null) {
                    vm.filters.agreementGroupId = vm.filters.agreementGroup.id;
                }

                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.vip != null) {
                    vm.filters.isVipCustomer = vm.filters.vip;
                } else {
                    vm.filters.isVipCustomer = null;
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                vm.filters.invoiceTypeArray = [];
                vm.filters.contactGroups = []; //ids only


                //vm.filters.taskStatuses = [];
                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }

                if (vm.filters.customerContact.length > 0) {
                    angular.forEach(vm.filters.customerContact, function (value) {
                        vm.filters.contactGroups.push(value.id);
                    });
                }
                invoiceSearchService.getInvoices(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.data.forEach(function (value) {
                        value.printObj = {
                            id: value.id,
                            voucherNo: value.voucherNo,
                            printHeader: vm.filters.printingWithoutLogo,
                            printDetails: vm.filters.printingWithoutTollsDarb
                        };
                    });

                    vm.printAll(null);
                }).finally(function () {
                    vm.loading = false;
                });

            };
            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
            };
            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getInvoices();
                    eventOnKeyPress.preventDefault();
                }
            }

            
            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };

            //getPrintRequesURL = function (ids) {
            //    var searchRequest = $resource('/Report#/tenant/printModalInvoice/', {}, {
            //        'get': { method: 'GET', isArray: true }
            //    });
            //    searchRequest.get({ 'ids[]': ids });
            //};

            vm.ids = [];
            vm.printAll = function (id) {
                vm.ids = [];
                if (id) {
                    vm.ids.push(id);
                }
                else {
                    angular.forEach(vm.gridOptions.data, function (invoice) {
                        vm.ids.push(invoice.id);
                    });
                    vm.printIds = {
                        ids: vm.ids,
                        printHeader: vm.filters.printingWithoutLogo,
                        printDetails: vm.filters.printingWithoutTollsDarb
                    };
                }
                //location.href = "/Report#/tenant/printModalInvoice/{" + vm.ids + "}";
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: ' ', //app.localize('Actions'),
                        width: 50,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i><span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="row.entity.voucherSubTypeId!=2" ng-click="grid.appScope.viewInvoice(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="row.entity.voucherSubTypeId==2" ng-click="grid.appScope.viewLimoInvoice(row.entity)">' + app.localize('View') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==67 && row.entity.voucherSubTypeId!=2"   ng-click="grid.appScope.editStockSaleInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==2"   ng-click="grid.appScope.editLimoInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isEInvoicingUAEEnabled && grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.edit && !(row.entity.isShared && grid.appScope.fusionIntengration) && !(grid.appScope.isAllocationWithChargesTypeEnabled && row.entity.voucherSubTypeId==24) && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId!=17 && row.entity.voucherSubTypeId!=60 && row.entity.voucherSubTypeId!=2 && row.entity.voucherSubTypeId!=65 && row.entity.voucherSubTypeId!=67&& row.entity.status != 5" ng-click="grid.appScope.editInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isEInvoicingUAEEnabled && !grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.edit && !(row.entity.isShared && grid.appScope.fusionIntengration) && !(grid.appScope.isAllocationWithChargesTypeEnabled && row.entity.voucherSubTypeId==24) && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId!=17 && row.entity.voucherSubTypeId!=60 && row.entity.voucherSubTypeId!=2 && row.entity.voucherSubTypeId!=65 &&  row.entity.voucherSubTypeId!=67 && row.entity.status != 5" ng-click="grid.appScope.editInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isEInvoicingUAEEnabled && grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.edit && !(row.entity.isShared && grid.appScope.fusionIntengration) && !(grid.appScope.isAllocationWithChargesTypeEnabled && row.entity.voucherSubTypeId==24) && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==65 &&  row.entity.voucherSubTypeId!=67 && row.entity.status != 5" ng-click="grid.appScope.editAdvanceTaxInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isEInvoicingUAEEnabled && !grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.edit && !(row.entity.isShared && grid.appScope.fusionIntengration) && !(grid.appScope.isAllocationWithChargesTypeEnabled && row.entity.voucherSubTypeId==24) && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==65 &&  row.entity.voucherSubTypeId!=67 && row.entity.status != 5" ng-click="grid.appScope.editAdvanceTaxInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isEInvoicingUAEEnabled && grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.edit && !(row.entity.isShared && grid.appScope.fusionIntengration) && !(grid.appScope.isAllocationWithChargesTypeEnabled && row.entity.voucherSubTypeId==24) && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==2 &&  row.entity.voucherSubTypeId!=67 && row.entity.status != 5" ng-click="grid.appScope.editLimoInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isEInvoicingUAEEnabled && !grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.edit  && !(row.entity.isShared && grid.appScope.fusionIntengration) && !(grid.appScope.isAllocationWithChargesTypeEnabled && row.entity.voucherSubTypeId==24) && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==2 && row.entity.voucherSubTypeId!=67 && row.entity.status != 5" ng-click="grid.appScope.editLimoInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId!=17 && row.entity.voucherSubTypeId!=2"   ng-click="grid.appScope.editInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==2"   ng-click="grid.appScope.editLimoInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==2"   ng-click="grid.appScope.editLimoInvoice(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.isPrintEnabled(row.entity) && ( row.entity.status != 5 || grid.appScope.allowPrintingOfVoidedVouchers && row.entity.status == 5) && (!grid.appScope.isEInvoicingUAEEnabled || row.entity.isPostedToASP)" ng-click="grid.appScope.openprintModal(row.entity.printObj)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.isPrintEnabled(row.entity) && ( row.entity.status != 5 || grid.appScope.allowPrintingOfVoidedVouchers && row.entity.status == 5) && grid.appScope.isEInvoicingUAEEnabled && grid.appScope.isCustomerCutoffDateForInvoicePrint && !row.entity.isAuthorized" ng-click="grid.appScope.openprintModal(row.entity.printObj)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.printInvoicewWithArabic && (!grid.appScope.isEInvoicingUAEEnabled || row.entity.isPostedToASP)" ng-click="grid.appScope.openArabicPrintModal(row.entity.printObj)">' + app.localize('PrintWithArabic') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.invoiceToExport" ng-if="grid.appScope.permissions.exportToWord && row.entity.isAuthorized" ng-click="grid.appScope.openExportWordModal(row.entity.printObj)">' + app.localize('ExportToWord') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.invoicePrintToWordExport" ng-if="grid.appScope.permissions.exportPrintToWord && row.entity.isAuthorized" ng-click="grid.appScope.openExportPrintToWordModal(row.entity.printObj)">' + app.localize('ExportToWordPrint') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.markDisputed && (!row.entity.isClosed) && !row.entity.isDisputed"  ng-click="grid.appScope.markUnmarkDisputedWithReson(row.entity,true) ">' + app.localize('MarkDisputed') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unMarkDisputed && (!row.entity.isClosed) && row.entity.isDisputed"  ng-click="grid.appScope.markUnmarkDisputedWithReson(row.entity,false)">' + app.localize('UnmarkDisputed') + '</a></li>' +
                            '      <li><a ng-if="row.entity.voucherSubTypeId == 65 && row.entity.status != 5 && row.entity.parentVoucherId " ng-click="grid.appScope.allocateAdvanceTaxInvoice(row.entity)">' + app.localize('Allocate') + '</a></li>' +
                            '      <li><a ng-if="!grid.appScope.isEInvoicingUAEEnabled && grid.appScope.permissions.void && row.entity.isAuthorized && row.entity.status != 5 && row.entity.voucherSubTypeId != 65 && grid.appScope.isAccountsEnabled" ng-click="grid.appScope.voidInvoice(row.entity)">' + app.localize('Void') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" href="/Report#/tenant/printModalInvoice/{{row.entity.printObj}}" >' + app.localize('Print Old') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" href="/Report#/tenant/printModalInvoice/{id:{{row.entity.id}}}" >' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.emailInvoice && row.entity.voucherSubTypeId==7" ng-click="grid.appScope.emailInvoice(row.entity.id)">' + app.localize('Email') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.emailInvoiceManual && row.entity.voucherSubTypeId!=7" ng-click="grid.appScope.emailForOtherInvoice(row.entity)">' + app.localize('Email') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.makeReceiptOptionalInAdvanceTaxInvoice && row.entity.voucherSubTypeId==65 && row.entity.parentVoucherId==null" ng-click="grid.appScope.attachReceiptModal(row.entity.id)">' + app.localize('AttachReceipt') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.createReceiptFromInvoice && row.entity.voucherSubTypeId==37 && row.entity.dueAmount > 0" ng-click="grid.appScope.createRecieptFromInvoice(row.entity)">' + app.localize('OpenReceiptforInvoice') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.SendFineSMS && row.entity.voucherSubTypeId==7" ng-click="grid.appScope.SendFineSMS(row.entity)">' + app.localize('SMS') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.WhatsAppSMSInvoiceManual" ng-click="grid.appScope.whatsAppSMSInvoiceManual(row.entity)">' + app.localize('WhatsAppSMS') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized" ng-click="grid.appScope.approveInvoices(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="!grid.appScope.isEInvoicingUAEEnabled && grid.appScope.permissions.unapproved && row.entity.isAuthorized && row.entity.status != 5" ng-click="grid.appScope.unapproveInvoices(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !(row.entity.isShared && grid.appScope.fusionIntengration) && !(grid.appScope.isAllocationWithChargesTypeEnabled && row.entity.voucherSubTypeId==24) && grid.appScope.locationPermission(row.entity) && (!grid.appScope.isApprovedEnabled ||(grid.appScope.isApprovedEnabled && !row.entity.isAuthorized))  && row.entity.status != 5 && !grid.appScope.isEInvoicingUAEEnabled" ng-click="grid.appScope.deleteInvoice(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isOnlinePaymentsEnabled && grid.appScope.isRequestPaymentAfterCreationEnabled && grid.appScope.isEmailLinkToCharge && (!row.entity.contact.hasCard || grid.appScope.oneTimePaymentAfterCardAdd) && row.entity.dueAmount > 0 && (row.entity.statusText != \'Closed\' && row.entity.statusText != \'Voided\')"><a ng-click="grid.appScope.emailLinkToCharge(row.entity)">' + app.localize('EmailLinkToCharge') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isOnlinePaymentsEnabled && grid.appScope.isRequestPaymentAfterCreationEnabled && grid.appScope.isChargeCardEnabled && grid.appScope.isChargeCard && row.entity.contact.hasCard && row.entity.dueAmount > 0 && (row.entity.statusText != \'Closed\' && row.entity.statusText != \'Voided\')"><a ng-click="grid.appScope.openSilentPaymentModal(row.entity)">' + app.localize('ChargeCard') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isAuthorized && grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'

                    },
                    //{{row.entity.voucherSubTypeId}}
                    {
                        name: app.localize('InvoiceNo'),
                        width: 230,
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="!row.entity.isAuthorized" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            ' <span  ng-show="row.entity.isPaymentEmailSent" class="label label-success">' + app.localize('Link Sent') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PoNo'),
                        width: 90,
                        field: 'agreement.poNo',

                    },
                    {
                        name: app.localize('SageX3No'),
                        width: 170,
                        visible: vm.isSageX3Enabled,
                        field: 'externalCode'
                    },
                    {
                        name: app.localize('InvoiceType'),
                        width: 150,
                        //   field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getInvoiceTypeById(row.entity.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('Card'),
                    //    field: 'customer.hasCard',
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.contact.hasCard" class="label label-success">CC</span><span ng-if="!row.entity.contact.hasCard" class="label label-danger">No CC</span></div>' +
                    //        '</div>',
                    //    width: 100
                    //},
                    {
                        name: app.localize('Customer'),
                        width: 200,
                        field: 'contact.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            //'<div class=\"ui-grid-cell-contents\"><span style="color:red;" ng-if="grid.appScope.isVipCustomer && row.entity.contact.isVip">' + app.localize("VIPCustomer") + ' </span><span>{{row.entity.contact.name}}</span></div>' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.contact.hasCard" class="label label-warning">CC</span><span>{{row.entity.contact.name}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerCode'),
                        width: 200,
                        field: 'contact.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            //'<div class=\"ui-grid-cell-contents\"><span style="color:red;" ng-if="grid.appScope.isVipCustomer && row.entity.contact.isVip">' + app.localize("VIPCustomer") + ' </span><span>{{row.entity.contact.name}}</span></div>' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.contact.hasCard" class="label label-warning">CC</span><span>{{row.entity.contact.code}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNoWithDelivery'),
                        width: 150,
                        visible: vm.isAgreementEnabled,
                        field: 'agreement.agreementNo'
                    },
                    {
                        name: app.localize('MasterAgreementNo'),
                        visible: vm.isEquipmentRentalEnabled,
                        width: 150,
                        field: 'masterAgreementNo.agreementNo'
                    },
                    {
                        name: app.localize('JobNo'),
                        width: 150,
                        visible: vm.isWorkshopEnabled,
                        field: 'jobNo'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        type: 'number',
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell pull-right\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled&&row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.CurrencyFormate(grid.appScope.roundingforView(row.entity.amount))}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DueAmount'),
                        field: 'dueAmount',
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell pull-right\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(grid.appScope.roundingforView(row.entity.dueAmount))}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.statusText}}</div>' +
                            '</div>'
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getInvoices();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getInvoices();
                    });
                },
                data: []
            };

            vm.createRecieptFromInvoice = function (invoice) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoice: function () {
                            return invoice;
                        },

                        quotationId: function () {
                            return null;
                        },
                        customer: function () {
                            return null;
                        },

                        downPayment: function () {
                            return null;
                        },
                        receiptId: null,
                        agreement: null,
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            };

            vm.openprintModal = function (filters) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return filters;
                        },
                        previewVoucher: null,
                        exportWord: false,
                        exportPrintToWord: false,
                        isArabic: function () {
                            return false;
                        }
                    }
                });
            };

            vm.openArabicPrintModal = function (filters) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return filters;
                        },
                        previewVoucher: null,
                        exportWord: false,
                        exportPrintToWord: false,
                        isArabic: function () {
                            return true;
                        }
                    }
                });
            };

            vm.openExportWordModal = function (filters) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return filters;
                        },
                        previewVoucher: null,
                        exportWord: true,
                        exportPrintToWord: false,
                        isArabic: function () {
                            return false; // or true, or logic to detect locale
                        }
                    }
                });
            };

            vm.openExportPrintToWordModal = function (filters) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return filters;
                        },
                        previewVoucher: null,
                        exportWord: false,
                        exportPrintToWord: true,
                        isArabic: function () {
                            return false; // or true, or logic to detect locale
                        }
                    }
                });
            };

            vm.attachReceiptModal = function (invoiceId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/attachReceiptModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.attachReceiptModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            };

            vm.emailInvoice = function (invoiceId) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceEmailAppService.emailTrafficFineNotice({
                                id: invoiceId,
                            }).success(function () {
                                abp.notify.success('Successfully Sent Email');
                            });
                        }
                    }
                );
            };

            vm.emailForOtherInvoice = function (invoice) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceEmailAppService.emailInvoice({
                                invoiceId: invoice.id,
                                customerId: invoice.contact.id
                            }).success(function () {
                                abp.notify.success('Successfully Sent Email');
                            });
                        }
                    }
                );
            };

            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (invoice) {
                    if (!invoice.isAuthorized) {
                        vm.ids.push(invoice.id);
                    }
                });
                invoiceService.approveInvoices(vm.ids).success(function () {
                    vm.getInvoices();
                    abp.notify.success(app.localize('SuccessfullyAuthorizeInvoice'));
                });
            };

            vm.emailLinkToCharge = (entity) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/emailLinkToCharge.cshtml',
                    controller: 'tenant.views.common.payments.emailLinkToCharge as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        data: () => {
                            return {
                                source: 'invoice',
                                voucherId: entity.id,
                                voucherNo: entity.voucherNo,
                                customerId: entity.contact.id,
                                customerName: entity.contact.name,
                                customerEmail: entity.contact.email,
                                dueAmount: entity.dueAmount,
                                hasCard: entity.contact.hasCard,
                                isPaymentEmailSent: entity.isPaymentEmailSent,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            }

            vm.openJournalViewModal = function (invoice) {
                openJournalViewModal(invoice);
            }

            openJournalViewModal = function (invoice) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return invoice.id;
                        },
                        voucherNo: function () {
                            return invoice.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getInvoices();
                });
            }

            vm.openSilentPaymentModal = (invoice) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/silentPayment.cshtml',
                    controller: 'tenant.views.common.payments.silentPayment as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        data: () => {
                            return {
                                voucherId: invoice.id,
                                customerId: invoice.contact.id,
                                dueAmount: invoice.dueAmount,
                                source: 'invoice'
                            }
                        }
                    }
                });
                modalInstance.result.then(result => {

                });
            }

            vm.SendFineSMS = function (invoice) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceSMSAppService.sMSTrafficFineNotice({
                                id: invoice.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.whatsAppSMSInvoiceManual = function (invoice) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceSMSAppService.sMSWhatsAppManualNotice({
                                id: invoice.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };

            vm.approveInvoices = function (invoice) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToApproveInvoice'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceService.approveInvoice({
                                id: invoice.id,
                            }).success(function () {
                                vm.getInvoices();
                                abp.notify.success(app.localize('SuccessfullyAuthorizedInvoice'));
                            });
                        }
                    }
                );
            };
            vm.unapproveInvoices = function (invoice) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToUnApproveInvoice'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceService.unApproveInvoice({
                                id: invoice.id,
                            }).success(function () {
                                vm.getInvoices();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedInvoice'));
                            });
                        }
                    }
                );
            };


            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.getStatus = function (id) {
                return utilities.getVoucherStatuses(id);
            };
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Open") },
                    { id: 2, name: app.localize("Closed") },
                    { id: 3, name: app.localize("Open (Over Allocated)") },
                    { id: 5, name: app.localize("Voided") }
                ];
            };

            vm.allocateAdvanceTaxInvoice = function (invoice) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/advanceTaxAllocationModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.advanceTaxAllocationModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoice: function () {
                            return invoice;
                        }

                    }
                });
            };

            vm.report = function () {
                vm.changeInvoiceRange();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/invoices/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.taxReport2 = function () {
                vm.changeInvoiceRange();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/invoices/taxReport2.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.taxReport = function () {
                vm.changeInvoiceRange();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/invoices/taxReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.report2 = function () {
                vm.changeInvoiceRange();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/invoices/report2.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.report3 = function () {
                vm.changeInvoiceRange();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/invoices/report3.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.report4 = function () {
                vm.changeInvoiceRange();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/invoices/report4.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getReportUrl = function () {

                vm.filters.invoiceTypeArray = [];
                vm.filters.contactGroups = [];
                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }
                if (vm.filters.customerContact.length > 0) {
                    angular.forEach(vm.filters.customerContact, function (value) {
                        vm.filters.contactGroups.push(value.id);
                    });
                }


                vm.encodedFilters = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/invoicesReport/" + vm.encodedFilters;
            };
            vm.getReportUrlTwo = function () {
                vm.filters.invoiceTypeArray = [];
                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }
                vm.encodedFilters2 = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/invoicesReport2/" + vm.encodedFilters2;
            };
            vm.getReportUrlThree = function () {
                vm.filters.invoiceTypeArray = [];
                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }
                vm.encodedFilters3 = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/invoicesReport3/" + vm.encodedFilters3;
            };

            vm.openDisputed = function (row, isMarked) {

                invoiceService.markUnmarkDisputed({ name: row.id, value: isMarked })
                    .success(function () {
                        vm.getInvoices();
                    });

            };


            vm.markUnmarkDisputedWithReson = function (invoice, isMarked) {
                if (isMarked) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                        controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            message: function () {
                                return app.localize('MarkDisputedDetail');
                            },
                            title: function () {
                                return app.localize('MarkDisputed');
                            }

                        }
                    });

                    modalInstance.result.then(function (result) {
                        invoice.isDisputed = true;
                        invoice.rejectionReason = result;
                        invoiceService.markUnmarkDisputed(invoice)
                            .success(function () {
                                vm.getInvoices();
                            });
                    });
                }
                else {
                    abp.message.okConfirm(
                        '', app.localize("UnmarkDisputedDetail"),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                invoice.isDisputed = false;
                                invoiceService.rejectionReason = '';
                                invoiceService.markUnmarkDisputed(invoice)
                                    .success(function () {
                                        vm.getInvoices();
                                    });
                            }
                        });
                }
            };

            function init() {
                initDate();

                if (vm.agreementDashboardFilters) {
                    vm.filters.agreementNo = vm.agreementDashboardFilters.agreementNo;
                    vm.filters.customer = vm.agreementDashboardFilters.customer;
                    vm.filters.customer.id = vm.agreementDashboardFilters.customerId;
                    vm.filters.enableDateRange = false;
                }

                if (vm.isAgreementGroups) {
                    vm.searchAgreementGroup();
                }

                vm.getInvoices();
                vm.searchUsersWithDesignation();
                getInvoiceTypes();
                getLocationsActiveAndInActive();
                getStatuses();
                vm.getCustomerContactGroups();
                if (vm.vehicle_EnableMortgage) {
                    vm.rentalAgreementOwnerships.push({ key: 'Mortgage', value: 8 })
                }
                if (vm.vehicle_EnableLeaseToOwn) {
                    vm.rentalAgreementOwnerships.push({ key: 'Lease To Own', value: 9 })
                }
            }
            init();
        }]);
