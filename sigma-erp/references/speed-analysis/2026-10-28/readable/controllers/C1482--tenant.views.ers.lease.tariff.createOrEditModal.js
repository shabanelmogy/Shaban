// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:405008-405206
appModule.controller('tenant.views.ers.lease.tariff.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.eRSTariff', 'tariffGroup', 'tariffGroupId',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, ersTariffService, tariffGroup, tariffGroupId) {

            var vm = this;

            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));

            vm.tariffGroup = tariffGroup;
            vm.saving = false;
            vm.isEditMod = false;
            vm.halfDayLineAdded = false;
            vm.agreementCategory = 8
            vm.filters = {
                tariffGroupId: tariffGroupId,
                agreementCategory: vm.agreementCategory
            };
            
            vm.agreementTypes = [
               { type: "Lease", id: 4 },
               { type: "LeaseToOwn", id: 5 },
            ];
            
            var chargesTypes = {
                rent: 1
            };

            vm.agreementType = 4; // for lease agreement by default

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

            vm.startDateChanged = function () {
                if (vm.agreement.noOfMonths)
                    vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M');
                if (!vm.isEditMod) {
                    if (isTariffEnabled)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else
                    startDateLoaded = true;
            };

            vm.endDateChanged = function () {
                if (!vm.isEditMod) {
                    if (isTariffEnabled)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else
                    endDateLoaded = true;
            };

            vm.vehicleSelected = function () {
                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;
                vm.agreement.movements[0].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;

                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;

                if (isTariffEnabled && !vm.isEditMod) {
                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, agreementCategory, function () {
                        tariffHelper.applyTariff(vm.agreement);
                    });
                }
            };


            //add rental tariff line
            vm.addTariffLine = function (chargesTypeId, rateTypeId, weekEnd, agreementType) {
                

                var foundLines = $filter('filter')(vm.tariffLines, {
                    chargesTypeId: chargesTypeId,
                    rateTypeId: rateTypeId,
                    weekEnd: weekEnd,
                    agreementType: agreementType
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
                        from: 0,
                        to: 0,
                        weekEnd: weekEnd,
                        rate: 0,
                        rateNewDriver: 0,
                        included: false,
                        limit: 0,
                        agreementType: agreementType,
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
                ersTariffService.createOrUpdateTariff({
                    tariffGroupId: tariffGroupId,
                    tariffLines: vm.tariffLines,
                    agreementCategory: vm.agreementCategory,
                    agreementType: vm.agreementType
                }).success(function (result) { 
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

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

                    vm.showProtections = vm.tariffLines.some(tariffLine => tariffLine.chargesType.chargesCategory == 2 && tariffLine.rateTypeId == 3);

                    if (foundLines.length > 0)
                        vm.halfDayLineAdded = true;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
