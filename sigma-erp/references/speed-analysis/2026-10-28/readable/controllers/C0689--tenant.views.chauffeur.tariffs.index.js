// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:178157-178354
appModule.controller('tenant.views.chauffeur.tariffs.index', [
        '$scope', '$filter', 'utilities', '$uibModal', 'abp.services.app.tariff', 'abp.services.app.tariffCard', 'abp.services.app.tariffGroup',
        function ($scope, $filter, utilities, $uibModal, tariffService, tariffCardService, tariffGroupService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");

            // vm.tariffGroup = tariffGroup;
            vm.tariffGroup = 'Sample';
            vm.saving = false;
            vm.isEditMod = false;
            vm.halfDayLineAdded = false;
            vm.agreementType = 1;
            vm.saved = false;
            vm.tariffGroupId = null;

            vm.filters = {
                //tariffGroupId: 5,
                tariffGroupId: vm.tariffGroupId,
                agreementCategory: 4
            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.tariffCards = [];
            vm.tariffCard = null;

            vm.getTariffCards = function () {
                vm.loading = true;
                tariffCardService.getTariffCards({}).success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            var chargesTypes = {
                rent: 1
            };

            var rateTypes = {
                perDay: 1,
                perHour: 7,
                PerHalfDay: 8,
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.agreementTypeChanged = function () {

            };



            //add rental tariff line
            vm.addTariffLine = function (chargesTypeId, rateTypeId, weekEnd) {
                var foundLines = $filter('filter')(vm.tariffLines, {
                    chargesTypeId: chargesTypeId,
                    rateTypeId: rateTypeId,
                    weekEnd: weekEnd
                }, true);

                var order = 1.0;
                var subOrder = 1;
                var chargesType = null;
                var rateType = null;

                if (foundLines.length > 0) {
                    order = foundLines[0].order;
                    subOrder = foundLines.length + 1;
                    chargesType = angular.copy(foundLines[0].chargesType);
                    rateType = angular.copy(foundLines[0].rateType);
                }

                vm.tariffLines.push(
                    {
                        chargesTypeId: chargesTypeId,
                        chargesType: chargesType,
                        order: order,
                        subOrder: subOrder,
                        rateTypeId: rateTypeId,
                        rateType: rateType,
                        tariffGroupId: vm.tariffGroupId,
                        //tariffGroupId: 5,
                        from: 0,
                        to: 0,
                        weekEnd: weekEnd,
                        rate: 0,
                        rateNewDriver: 0,
                        included: false,
                        limit: 0,
                        excessRate: 0,
                        maxUnits: 0
                    });

                if (chargesTypeId == chargesTypes.rent && rateTypeId == rateTypes.PerHalfDay)
                    vm.halfDayLineAdded = true;
            };

            vm.removeTariffLine = function (tariffLine) {
                var chargesTypeId = tariffLine.chargesTypeId;
                var rateTypeId = tariffLine.rateTypeId;
                var weekEnd = tariffLine.weekEnd;

                var index = vm.tariffLines.indexOf(tariffLine);
                vm.tariffLines.splice(index, 1);

                var otherSimilarLines = $filter('filter')(vm.tariffLines, {
                    chargesTypeId: chargesTypeId,
                    rateTypeId: rateTypeId,
                    weekEnd: weekEnd
                }, true);

                var subOrder = 1;
                for (var i = 0; i < otherSimilarLines.length; i++) {
                    otherSimilarLines[i].subOrder = subOrder;
                    subOrder += 1;
                }

                if (chargesTypeId == chargesTypes.rent && rateTypeId == rateTypes.PerHalfDay)
                    vm.halfDayLineAdded = false;
            };

            vm.save = function () {
                vm.saving = true;
                var tariffCardId = null;
                if (vm.tariffCard) {
                    tariffCardId = vm.tariffCard;
                }
                tariffService.createOrUpdateTariff({ tariffGroupId: vm.tariffGroupId/*tariffGroupId: 5*/, tariffLines: vm.tariffLines, agreementCategory: 4, tariffCardId: tariffCardId }).success(function (result) { // 1 for Rental agreement
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.tariffCardChanged = function () {
                init();
            }

            function getTariffGroup () {
                vm.loading = true;
                tariffGroupService.getTariffGroupForChauffeur().success(function (data) {
                    vm.tariffGroup = data;
                    vm.tariffGroupId = data.id;
                    vm.filters.tariffGroupId = vm.tariffGroupId;
                }).finally(function () {
                    init();
                });
            };

            function init() {
                vm.loading = true;

                vm.filters.tariffCardId = null;
                if (vm.tariffCard) {
                    vm.filters.tariffCardId = vm.tariffCard;
                }
                tariffService.getTariffForEdit(vm.filters).success(function (result) {
                    vm.tariffLines = result.tariffLines.items;
                    vm.saved = result.saved;
                    //check if half day price line is already added. then disable adding new row
                    var foundLines = $filter('filter')(vm.tariffLines, {
                        chargesTypeId: chargesTypes.rent,
                        rateTypeId: rateTypes.PerHalfDay
                    }, true);

                    if (foundLines.length > 0)
                        vm.halfDayLineAdded = true;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            //init();
            getTariffGroup();

            if (abp.auth.hasPermission('Pages.Tenant.TariffCards')) {
                vm.getTariffCards();
            }
        }
    ]);
