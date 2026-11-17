// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:174807-174855
appModule.controller('tenant.views.crs.carShare.tariff.index', [
        '$scope', 'abp.services.app.tariffGroup',
        function ($scope, tariffGroupService) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.rateTypes = [
            {
                id: 1,
                name: 'Starting'
            },
            {
                id: 2,
                name: '/KM'
            },
            {
                id: 3,
                name: '/Minute'
            },
            {
                id: 4,
                name: 'Minimum'
            }];
            function initBaseTariff() {
                vm.tariffLinesBase = [];
                angular.forEach(vm.tariffGroups, function (tariffGroup) {
                    angular.forEach(vm.rateTypes, function (rateType) {
                        vm.tariffLinesBase.push({ id: null, tariffGroupId: tariffGroup.id, order: 1, customerId: null, rateTypeId: rateType.id, rate: null, tariffGroup: tariffGroup, rateType: rateType });

                    });
                });
            }

            function init() {
                tariffGroupService.getTariffGroup({}).success(function (data) {
                    vm.tariffGroups = data.items;
                    initBaseTariff();
                });

            }

            init();

        }
    ]);
