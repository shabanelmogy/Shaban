// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:485764-485795
appModule.controller('tenant.views.vmiWorkshop.dashboard.index', [
        '$scope', '$uibModal', 'abp.services.app.garage',
        function ($scope, $uibModal, garageService) {
            var vm = this;
            vm.vehiclesSummary = null;
            vm.masterFilters = {
                ownership: null,
                vehicleType: null
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getMovementSummary = function () {
                garageService.getMovementsSummary(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                        ownership: vm.masterFilters.ownership,
                        vehicleType: vm.masterFilters.vehicleType,
                    }).success(function (result) {
                        vm.movementSummary = result;
                    });
            };

            function init() {
                vm.getMovementSummary();
            };
            init();
        }
    ]);
