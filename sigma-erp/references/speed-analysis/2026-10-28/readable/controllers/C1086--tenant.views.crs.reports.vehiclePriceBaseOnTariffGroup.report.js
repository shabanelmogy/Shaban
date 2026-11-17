// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:287575-287627
appModule.controller('tenant.views.crs.reports.vehiclePriceBaseOnTariffGroup.report', ['$scope', '$stateParams', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel','abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, vehiclesProfitAndLoss, vehicleService, vehicleModelService, commonLookupService, utilities) {

            var vm = this;

            vm.filters = null;
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            
            function init() {
                vm.loading = true;

                vm.vehicleId = null;
                vm.modelId = null;
                vm.tariffGroupId = null;

                if (vm.filters) {
                    if (vm.filters.vehicle) {
                        vm.vehicleId = vm.filters.vehicle.id;
                    }
                    if (vm.filters.model) {
                        vm.modelId = vm.filters.model.id;
                    }
                    if (vm.filters.tariffGroupId) {
                        vm.tariffGroupId = vm.filters.tariffGroupId;
                    }
                }

                vehiclesProfitAndLoss.getVehiclesTariffGroupReport({
                    vehicleId: vm.vehicleId,
                    tariffGroupId: vm.tariffGroupId,
                    modelId: vm.modelId
                }).success(function (data) {
                    vm.report = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }


            init();
           
        }]);
