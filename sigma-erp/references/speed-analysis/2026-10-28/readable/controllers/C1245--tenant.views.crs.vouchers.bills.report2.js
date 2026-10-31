// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:327899-328015
appModule.controller('tenant.views.crs.vouchers.bills.report2', ['$scope', 'abp.services.app.bill', '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.billingMethod', 'utilities',
        function ($scope, billService, $stateParams, commonLookupService, billingMethodService, utilities) {

            var vm = this;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isCustomFieldOneIsMandotoryInBill = utilities.parseBoolean(abp.setting.get("App.General.IsCustomFieldOneIsMandotoryInBill"));

            vm.locationName = '';
            // vm.totalAmount = 0;
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.totalDueAmount = 0;
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Bills");
            if (vm.filters.voucherNo) {
                vm.filters.refNo = null;
                vm.filters.locationId = null;
                vm.filters.supplier = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.approvedType = null;
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
            vm.getStatus = function (id) {
                return utilities.getVoucherStatuses(id);
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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


            vm.getApprovedType = function (type) {
                if (!type) return;
                else if (type == 1) return 'None';
                else if (type == 2) return 'Approved';
                else if (type == 3) return 'Not Approved';

            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }
            function init() {
                getLocations();
                vm.loading = true;

                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                vm.filters.pagination = true;
                billService.getBills2(vm.filters).success(function (data) {
                    vm.billReportData = data.items;
                    vm.totalAmount = 0;
                    vm.totalDueAmount = 0;
                    angular.forEach(vm.billReportData, function (value, key) {
                        //vm.totalAmount += value.amount;
                        vm.totalAmount += (value.debit + value.tax);
                    //    vm.totalDueAmount += value.dueAmount;
                    });

                    vm.totalAmount = vm.totalAmount.toFixed(2);
                    //vm.totalDueAmount = vm.totalDueAmount.toFixed(2);

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
