// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:364486-364669
appModule.controller('tenant.views.crs.vouchers.invoices.report4', ['$scope', '$stateParams', 'abp.services.app.invoiceSearch', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, invoiceSearchService, $stateParams, commonLookupService, utilities) {
            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Invoices");
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

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
                vm.filters.invoiceType = null;
                vm.filters.customer = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.approvedType = null;
            }
            else if (vm.filters.agreementNo) {
                vm.filters.locationId = null;
                vm.filters.invoiceType = null;
                vm.filters.customer = null;
                //vm.filters.fromDate = null;
                //vm.filters.toDate = null;
            }
            if (!vm.isApprovedEnabled) {
                vm.filters.approvedById = null;
                vm.filters.createdById = null;
                vm.filters.approvedType = null;
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

            function getInvoiceType(voucherSubTypeId) {
                var types = "";
                angular.forEach(voucherSubTypeId, function (invoiceType) {

                    if (invoiceType.Id == 1) types = types + ' ' + app.localize("RentalInvoice");
                    else if (invoiceType.id == 8) types = types + ' ' + app.localize("TollInvoice");
                    else if (invoiceType.id == 7) types = types + ' ' + app.localize("FineInvoice");
                    else if (invoiceType.id == 2) types = types + ' ' + app.localize("LimousineInvoice");
                    else if (invoiceType.id == 14) types = types + ' ' + app.localize("LeaseInvoice");
                    else if (invoiceType.id == 16) types = types + ' ' + app.localize('TransportationInvoice');
                    else if (invoiceType.id == 17) types = types + ' ' + app.localize("AssetSaleInvoice");
                    else if (invoiceType.id == 9) types = types + ' ' + app.localize("MiscellaneousInvoice");
                    else if (invoiceType.id == 24) types = types + ' ' + app.localize("AdditionalChargesInvoice");
                    else if (invoiceType.id == 29) types = types + ' ' + app.localize("FuelInvoice");
                    else if (invoiceType.id == 30) types = types + ' ' + app.localize("DamageInvoice");
                    else if (invoiceType.id == 33) types = types + ' ' + app.localize("FleetAssignmentInvoice");
                    else if (invoiceType.id == 34) types = types + ' ' + app.localize("ChauffeurInvoice");
                    else if (invoiceType.id == 76) types = types + ' ' + app.localize("CDWInvoice");
                    else if (invoiceType.id == 77) types = types + ' ' + app.localize("PAIInvoice");
                    else if (invoiceType.id == 78) types = types + ' ' + app.localize("MileageInvoice");
                    else if (invoiceType.id == 79) types = types + ' ' + app.localize("AdditionalDriverInvoice");
                    else if (invoiceType.id == 80) types = types + ' ' + app.localize("BabySeatInvoice");
                    else if (invoiceType.id == 81) types = types + ' ' + app.localize("DamageChargesInvoice");
                    else if (invoiceType.id == 82) types = types + ' ' + app.localize("DeliveryChargesInvoice");
                    else if (invoiceType.id == 83) types = types + ' ' + app.localize("CollectionChargesInvoice");
                    else if (invoiceType.id == 84) types = types + ' ' + app.localize("PreTerminationPenaltyInvoice");
                    else if (invoiceType.id == 85) types = types + ' ' + app.localize("ExcessInsuranceChargesInvoice");
                    else if (invoiceType.id == 86) types = types + ' ' + app.localize("TyreInsuranceChargesInvoice");
                    else if (invoiceType.id == 87) types = types + ' ' + app.localize("WindScreenInsuranceInvoice");
                    else if (invoiceType.id == 88) types = types + ' ' + app.localize("RoadSideAssistanceInvoice");
                    else if (invoiceType.id == 89) types = types + ' ' + app.localize("ExtraHoursChargesInvoice");
                    else if (invoiceType.id == 90) types = types + ' ' + app.localize("WaitingChargesInvoice");
                    else if (invoiceType.id == 91) types = types + ' ' + app.localize("Extra2Charges");
                    else if (invoiceType.id == 92) types = types + ' ' + app.localize("Extra3Charges");
                    else if (invoiceType.id == 93) types = types + ' ' + app.localize("Extra1Charges");
                    else if (invoiceType.id == 94) types = types + ' ' + app.localize("Extra4Charges");
                    else if (invoiceType.id == 95) types = types + ' ' + app.localize("ParkingInvoice");
                    else if (invoiceType.id == 96) types = types + ' ' + app.localize("DriverChargesInvoice");
                    else if (invoiceType.id == 97) types = types + ' ' + app.localize("OthersInvoice");
                    else if (invoiceType.id  == 118) types = types + ' ' + app.localize('AirPortParkingInvoice');
                    else if (invoiceType.id  == 119) types = types + ' ' + app.localize('RecoveryTowingChargesInvoice');
                    else if (invoiceType.id  == 120) types = types + ' ' + app.localize('SmokingChargesInvoice');
                });
                return types;
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
                if (vm.filters.invoiceType) {
                    vm.invoiceType = getInvoiceType(vm.filters.invoiceType);
                }
                    
                vm.filters.dontPaginate = true;
                invoiceSearchService.getReportWithCommision(vm.filters).success(function (data) {

                    vm.invoiceReportData = data.items;

                    vm.totalCommision = 0;
                    vm.totalAmount = 0;
                    vm.totalNetAmount = 0;

                    angular.forEach(vm.invoiceReportData, function (value, key) {
                        vm.totalCommision += value.commision;
                        vm.totalAmount += value.amount;
                        vm.totalNetAmount += value.netAmount;
                    });

                    vm.totalCommision = utilities.round(vm.totalCommision, 2);
                    vm.totalAmount = utilities.round(vm.totalAmount, 2);
                    vm.totalNetAmount = utilities.round(vm.totalNetAmount, 2);

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
