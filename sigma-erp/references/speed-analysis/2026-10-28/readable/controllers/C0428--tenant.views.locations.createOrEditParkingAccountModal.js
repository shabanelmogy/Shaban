// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:105134-105212
appModule.controller('tenant.views.locations.createOrEditParkingAccountModal', ['$scope', '$uibModalInstance', 'parkingAccount', 'abp.services.app.parkingAccount',
        function ($scope, $uibModalInstance, parkingAccount, parkingAccountService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMode = false;
            vm.ViewOnly = parkingAccount.showMode;

            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking") || abp.features.isEnabled("TMS.Tolls.SalikParkingTolls");

            vm.parkingAccount = {};
   

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                debugger;
               vm.parkingAccount.portal = 1;
                parkingAccountService.createOrUpdateParkingAccount({
                    parkingAccount: vm.parkingAccount
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                if (vm.ViewOnly) {
                    parkingAccountService.getParkingAccountForView({
                        id: parkingAccount.id
                    }).success(function (result) {
                        debugger;
                        vm.parkingAccount = result;
                        if (vm.parkingAccount.id > 0 && !vm.ViewOnly) {
                            vm.isEditMod = true;

                        } else {
                            vm.isEditMod = false;
                        }

                        if (parkingAccount.id === undefined) {
                            vm.parkingAccount = {
                                isActive: true
                            };
                        }
                    });
                }
                else {
                    parkingAccountService.getParkingAccountForEdit({
                        id: parkingAccount.id
                    }).success(function (result) {
                        //result.isActive = true;
                        vm.parkingAccount = result;


                        if (vm.parkingAccount.id > 0 && !vm.ViewOnly) {
                            vm.isEditMod = true;

                        } else {
                            vm.isEditMod = false;
                        }

                        if (parkingAccount.id === undefined) {
                            vm.parkingAccount = {
                                isActive: true
                            };
                        }
                    });
                }
            }

            init();

        }]);
