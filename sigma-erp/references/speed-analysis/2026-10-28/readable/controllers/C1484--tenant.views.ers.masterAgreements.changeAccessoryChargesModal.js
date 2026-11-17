// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:405294-405419
appModule.controller('tenant.views.ers.masterAgreements.changeAccessoryChargesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'scheduleLine', 'utilities', 'abp.services.app.vehicle', 
        function ($scope, $uibModal, $uibModalInstance, scheduleLine, utilities, vehicleService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.viewMode = scheduleLine.viewMode;
            vm.totalSum = 0.0;

            vm.scheduleLine = scheduleLine;
            vm.accessories = scheduleLine.accessories;


            vm.searchVehicles = function ($select, line) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                return vehicleService.searchVehicles({
                    plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses,
                    tariffGroupId: line.vehicleTypeId, modelId: line.vehicleModelId
                }).then(function (response) {
                    vm.vehicles = response.data.items;

                });
            };


            vm.searchVehiclePopup = function (line) {
                openSearchVehicleModal(line);
            };

            function openSearchVehicleModal(line) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                //fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
                                //toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: line.vehicleType,
                                tariffGroupId: line.vehicleTypeId,
                                statusId: 'IDL',
                                subStatuses: [1, 7], //1: Available, 7: Ready to go
                                modelId: line.vehicleModelId,
                                model: line.vehicleModel,
                                // source: 'openagreement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        line.vehicle = result;
                        line.vehicleId = result.id;
                    }
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.calculateSum = function () {
                vm.totalSum = 0.0;
                vm.accessories.forEach(e => {
                    if (e.rate)
                        vm.totalSum += e.rate;
                });
            };
            vm.save = function () {
                vm.saving = true;
                $uibModalInstance.close(vm.totalSum);
                vm.saving = false;
            }

            vm.showCalculationDetail = function (row) {
                var calculationDetail = JSON.parse(row.calcDetail);
            };

            //function init() {
            //    vm.loading = true;
            //    vm.tripCharges = options.trip.tripCharges;
            //    vm.tripCharges.forEach(function (value) {
            //        if (value.chargesTypeId == 24 && value.charges > 0)
            //            vm.limoFareReadOnly = true;
            //    });

            //    vm.limoFareTotal = 0.0;
            //    var limofare = vm.tripCharges.filter(e => e.chargesTypeId == 24)[0];
            //    angular.forEach(limofare.calcDetail, function (item) {
            //        vm.limoFareTotal += item.charges;
            //    });


            //    vm.sumChargesTax();
            //    vm.loading = false;
            //}
            //init();
            vm.calculateSum();
        }
    ]);
