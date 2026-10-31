// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:195504-195582
appModule.controller('tenant.views.crs.custodyMovements.editModal', ['custodyMovementId', '$uibModalInstance', 'abp.services.app.custody', 'utilities', 'abp.services.app.commonLookup',
        function (custodyMovementId, $uibModalInstance, custodyMovementService, utilities,commonLookupService) {

            var vm = this;
            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.save = function () {
                vm.saving = true;
                if (vm.custodyList.outMovement != null) {
                    if (moment(vm.custodyList.inMovement.inDetail.dateTime) > moment(vm.custodyList.outMovement.outDetail.dateTime)) {
                        abp.message.info('Custody Out Date can not be less than Custody In Date');
                        vm.saving = false;
                        return;
                    }
                    if (vm.custodyList.inMovement.vehicle.plateNo == vm.custodyList.outMovement.vehicle.plateNo) {
                        if (vm.custodyList.inMovement.inDetail.km > vm.custodyList.outMovement.outDetail.km) {
                            abp.message.info('Custody Out km can not be less than Custody In km');
                            vm.saving = false;
                            return;
                        }
                    }
                }
                
                custodyMovementService.updateCustody(vm.custodyList).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });


            };

            function init() {
                getLocations();
                allFuelLevels();
                vm.loading = true;
                custodyMovementService.getCustodyForEdit({ id: custodyMovementId }
                ).success(function (result) {
                    vm.custodyList = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
