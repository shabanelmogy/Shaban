// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:411346-411524
appModule.controller('tenant.views.ers.rental.tariff.createOrEditModal', [
        '$filter', 'utilities',  '$uibModalInstance', 'abp.services.app.eRSTariff', 'tariffGroup', 'tariffGroupId',
        function ($filter, utilities, $uibModalInstance, ersTariffService, tariffGroup, tariffGroupId) {

            var vm = this;

            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");

            vm.agreementCategory = 7;

            vm.tariffGroup = tariffGroup;
            vm.saving = false;
            vm.isEditMod = false;
            vm.halfDayLineAdded = false;
            vm.agreementType = 1;
            vm.saved = false;

            vm.filters = {
                tariffGroupId: tariffGroupId,
                agreementCategory: vm.agreementCategory
            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

          

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
                init();
            };



            //add rental tariff line
            vm.addTariffLine = function (chargesTypeId, rateTypeId, weekEnd, agreementType) {
                var foundLines = $filter('filter')(vm.tariffLines, {
                    chargesTypeId: chargesTypeId,
                    rateTypeId: rateTypeId,
                    agreementType: vm.agreementType,
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
                        tariffGroupId: tariffGroupId,
                        agreementType: agreementType,
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
                ersTariffService.createOrUpdateTariff({
                    tariffGroupId: tariffGroupId,
                    tariffLines: vm.tariffLines,
                    agreementCategory: vm.agreementCategory,
                    agreementType: vm.agreementType,
                    tariffCardId: tariffCardId
                }).success(function (result) { // 1 for Rental agreement
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
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

            function init() {
                vm.loading = true;

                vm.filters.agreementType = vm.agreementType;
                ersTariffService.getTariffForEdit(vm.filters).success(function (result) {
                    vm.tariffLines = result.tariffLines.items;
                    vm.saved = result.saved;

                    //check if half day price line is already added. then disable adding new row
                    var foundLines = $filter('filter')(vm.tariffLines, {
                        chargesTypeId: chargesTypes.rent,
                        rateTypeId: rateTypes.PerHalfDay
                    }, true);

                    vm.showProtectionsDaily = vm.tariffLines.some(tariffLine => tariffLine.chargesType.chargesCategory == 2 && tariffLine.rateTypeId != 2 && tariffLine.rateTypeId != 3)
                    vm.showProtectionsWeekly = vm.tariffLines.some(tariffLine => tariffLine.chargesType.chargesCategory == 2 && tariffLine.rateTypeId == 2);
                    vm.showProtectionsMonthly = vm.tariffLines.some(tariffLine => tariffLine.chargesType.chargesCategory == 2 && tariffLine.rateTypeId == 3);

                    if (foundLines.length > 0)
                        vm.halfDayLineAdded = true;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
            
        }
    ]);
