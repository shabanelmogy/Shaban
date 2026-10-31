// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:382254-382344
appModule.controller('tenant.views.crs.vouchers.purchaseOrders.report', ['$scope', 'abp.services.app.purchaseOrder', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, purchaseOrderService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.style1 = vm.isFMSEnabled ? { width: '10%' } : { width: '10%' };
            vm.style2 = vm.isFMSEnabled ? { width: '10%', 'overflow-wrap': 'break-word' } : { width: '10%', 'overflow-wrap': 'break-word' };
            vm.totalAmount = 0;
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            if (vm.filters.voucherNo) {
                vm.filters.locationId = null;
                vm.filters.supplier = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.refNo = null;
                vm.filters.chassisNo = null;
            }
            else if (vm.filters.refNo && vm.filters.refNo != null) {
                vm.filters.locationId = null;
                vm.filters.supplier = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.chassisNo = null;
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
            vm.roundAmount = function (amount) {
                return utilities.round(amount, 2);
            }
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
                if (vm.filters.vehicle)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                purchaseOrderService.getPurchaseOrdersReport(vm.filters).success(function (data) {
                    vm.purchaseOrderReportData = data.items;
                    angular.forEach(vm.purchaseOrderReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                    vm.totalAmount = vm.totalAmount.toFixed(2);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }]);
