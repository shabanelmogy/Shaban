// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:105217-105307
appModule.controller('tenant.views.locations.createOrEditSalikAccountModal', ['$scope', '$uibModalInstance', 'salikOrDarbAccount', 'salikAccount', 'abp.services.app.salikAccount',
        function ($scope, $uibModalInstance, salikOrDarbAccount, salikAccount, salikAccountService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMode = false;
            vm.ViewOnly = salikAccount.showMode;

            vm.enabledCompanyCodeSalik = abp.setting.getBoolean("App.General.Salik.EnableCompanyCode");
            vm.enabledCompanyCodeDarb = abp.setting.getBoolean("App.General.Darb.EnableCompanyCode");
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking") || abp.features.isEnabled("TMS.Tolls.SalikParkingTolls");

            vm.salikaccount = {};
            vm.tollServer = [
                {
                    id: 1,
                    name: 'Dubai'
                },
                {
                    id: 2,
                    name: 'Abu Dhabi'
                }
            ];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                debugger;
                salikAccountService.createOrUpdateSalikAccount({
                    salikAccount: vm.salikAccount
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                if (vm.ViewOnly) {
                    salikAccountService.getSalikAccountForView({
                        id: salikAccount.id
                    }).success(function (result) {
                        debugger;
                        vm.salikAccount = result;
                        if (vm.salikAccount.id > 0 && !vm.ViewOnly) {
                            vm.isEditMod = true;

                        } else {
                            vm.isEditMod = false;
                        }

                        if (salikAccount.id === undefined) {
                            vm.salikAccount = {
                                server: salikOrDarbAccount,
                                isActive: true
                            };
                        }
                    });
                }
                else {
                    salikAccountService.getSalikAccountForEdit({
                        id: salikAccount.id
                    }).success(function (result) {
                        //result.isActive = true;
                        vm.salikAccount = result;


                        if (vm.salikAccount.id > 0 && !vm.ViewOnly) {
                            vm.isEditMod = true;

                        } else {
                            vm.isEditMod = false;
                        }

                        if (salikAccount.id === undefined) {
                            vm.salikAccount = {
                                server: salikOrDarbAccount,
                                isActive: true
                            };
                        }
                    });
                }
            }

            init();

        }]);
