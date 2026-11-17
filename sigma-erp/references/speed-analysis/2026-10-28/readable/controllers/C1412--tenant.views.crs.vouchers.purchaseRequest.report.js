// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:384772-384852
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.report', ['$scope', 'abp.services.app.purchaseRequest', '$stateParams', 'abp.services.app.commonLookup',
        function ($scope, purchaseRequestService, $stateParams, commonLookupService) {

            var vm = this;
            vm.locationName = '';
        vm.isFMSEnabled = abp.features.isEnabled("FMS");
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
                purchaseRequestService.getPurchaseRequestReport(vm.filters).success(function (data) {
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
