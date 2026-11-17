// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:364777-365014
appModule.controller('tenant.views.crs.vouchers.invoices.taxReport',
        ['$scope', '$stateParams', 'abp.services.app.invoiceSearch', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, invoiceSearchService, commonLookupService, utilities) {
            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Invoices");
            vm.isGroupTRNEnabled = abp.features.isEnabled("CRS.CustomFeatures.GroupTRNAsTaxRuleInCustomer");
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            //vm.filters = $stateParams.filters;
            if (vm.filters.voucherNo) {
                vm.filters.agreementNo = null;
                vm.filters.locationId = null;
                vm.filters.invoiceType = [];
                vm.filters.customer = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.approvedType = null;
            }
            else if (vm.filters.agreementNo) {
                vm.filters.locationId = null;
                vm.filters.invoiceType = [];
                vm.filters.customer = null;
                //vm.filters.fromDate = null;
                //vm.filters.toDate = null;
            }
            if (!vm.isApprovedEnabled) {
                vm.filters.approvedById = null;
                vm.filters.createdById = null;
                vm.filters.approvedType = null;
            }
            if (vm.filters.vip != null) {
                vm.filters.isVipCustomer = vm.filters.vip;
            } else {
                vm.filters.isVipCustomer = null;
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getStatuses = function (id) {
                if (id == 1) return app.localize("Open");
                if (id == 2) return app.localize("Closed");
            };
            vm.getApprovedType = function (type) {
                if (!type) return;
                else if (type == 1) return 'None';
                else if (type == 2) return 'Approved';
                else if (type == 3) return 'Not Approved';

            };

            vm.taxRules = function () {
                var rules = [
                    { id: 1, name: app.localize('StandardRated') },
                    { id: 2, name: app.localize('ZeroRated') },
                    { id: 3, name: app.localize('Exempted') }
                ];

                if (vm.isGroupTRNEnabled) {
                    rules.push({ id: 5, name: app.localize('GroupTRN') });
                }

                return rules;
            };

            vm.getTaxRuleName = function (id) {
                var rule = vm.taxRules().find(function (r) {
                    return r.id === id;
                });

                return rule ? rule.name : ''; 
            };


            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("TollInvoice");
                else if (voucherSubTypeId == 7) return app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) return app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) return app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) return app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) return app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) return app.localize("MiscellaneousInvoice");
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
                else if (voucherSubTypeId == 74) return app.localize('RecoveryInvoice');
                else if (voucherSubTypeId == 75) return app.localize('ChaufferInvoice');
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
                else if (voucherSubTypeId == 118) return app.localize('AirPortParkingInvoice');
                else if (voucherSubTypeId == 119) return app.localize('RecoveryTowingChargesInvoice');
                else if (voucherSubTypeId == 120) return app.localize('SmokingChargesInvoice');
                else return "";
            };

            function getInvoiceType(voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) vm.invoiceType = app.localize("TollInvoice");
                else if (voucherSubTypeId == 7) vm.invoiceType =  app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) vm.invoiceType =  app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) vm.invoiceType =  app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) vm.invoiceType =  app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) vm.invoiceType =  app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) vm.invoiceType =  app.localize("MiscellaneousInvoice");
                else if (voucherSubTypeId == 24) vm.invoiceType =  app.localize("AdditionalChargesInvoice");
                else if (voucherSubTypeId == 29) vm.invoiceType =  app.localize("FuelInvoice");
                else if (voucherSubTypeId == 30) vm.invoiceType =  app.localize("DamageInvoice");
                else if (voucherSubTypeId == 33) vm.invoiceType =  app.localize("FleetAssignmentInvoice");
                else if (voucherSubTypeId == 34) vm.invoiceType = app.localize("ChauffeurInvoice");
                else if (voucherSubTypeId == 37) return app.localize("WorkshopInvoice");
                else if (voucherSubTypeId == 118) vm.invoiceType = app.localize('AirPortParkingInvoice');
                else if (voucherSubTypeId == 119) vm.invoiceType = app.localize('RecoveryTowingChargesInvoice');
                else if (voucherSubTypeId == 120) vm.invoiceType = app.localize('SmokingChargesInvoice');
            }
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            };
            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            vm.getStatus = function (id) {
                return utilities.getVoucherStatuses(id);
            };
            function init() {
                vm.loading = true;
                getLocations();
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                if (vm.filters.invoiceType)
                    getInvoiceType(vm.filters.invoiceType)

                vm.filters.dontPaginate = true;
                invoiceSearchService.getTaxReport(vm.filters).success(function (data) {
                    vm.invoiceReportData = data.items;
                    //angular.forEach(vm.invoiceReportData, function (value, key) {
                    //    value.credit = utilities.round(value.credit, 2);
                    //    value.debit = utilities.round(value.debit, 2);
                    //    value.dueAmount = utilities.round(value.dueAmount, 2);
                    //    vm.totalCreditAmount += value.allocatedAmount;
                    //    vm.totalDebitAmount += value.amount;
                    //    vm.totalDueAmount += value.dueAmount;
                    //});
                    vm.totalStandardRatedSupplies = vm.invoiceReportData.reduce((accu, curr) => accu += curr.standardRatedSupplies, 0);
                    vm.totalZeroRatedSupplies = vm.invoiceReportData.reduce((accu, curr) => accu += curr.zeroRatedSupplies, 0);
                    vm.totalExcemptedSupplies = vm.invoiceReportData.reduce((accu, curr) => accu += curr.excemptedSupplies, 0);
                    vm.totalOutSideScopeSupplies = vm.invoiceReportData.reduce((accu, curr) => accu += curr.outSideScopeSupplies, 0);
                    vm.totalGroupTRNSupplies = vm.invoiceReportData.reduce((accu, curr) => accu += curr.groupTRNSupplies, 0);
                    vm.totalTax = vm.invoiceReportData.reduce((accu, curr) => accu += curr.tax, 0);
                    vm.totalVatableAmount = vm.invoiceReportData.reduce((accu, curr) => accu += curr.vatableAmount, 0);
                    vm.totalNonVatableAmount = vm.invoiceReportData.reduce((accu, curr) => accu += curr.nonVatableAmount, 0);
                    vm.totalAmount = vm.invoiceReportData.reduce((accu, curr) => accu += curr.amount, 0);
                   
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
