// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:467638-467729
appModule.controller('tenant.views.crs.vouchers.purchaseReturns.report', ['$scope', 'abp.services.app.purchaseReturn', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, purchaseReturnsService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            vm.totalAmount = 0;
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseReturns");
            if (vm.filters.voucherNo) {
                vm.filters.locationId = null;
                vm.filters.supplier = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.approvedById = null;
                vm.filters.createdById = null;
                vm.filters.approvedType = null;
            }
            if (!vm.isApprovedEnabled) {
                vm.filters.approvedById = null;
                vm.filters.createdById = null;
                vm.filters.approvedType = null;
            }

            vm.getApprovedType = function (type) {
                if (!type) return;
                else if (type == 1) return 'None';
                else if (type == 2) return 'Approved';
                else if (type == 3) return 'Not Approved';

            };
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
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }
            function init() {

                getLocations();
                vm.loading = true;
                purchaseReturnsService.getPurchaseReturnsReport(vm.filters).success(function (data) {
                    vm.purchaseReturnsReportData = data.items;
                    angular.forEach(vm.purchaseReturnsReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                    vm.totalAmount = vm.totalAmount.toFixed(2);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
