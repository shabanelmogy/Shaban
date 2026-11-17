// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86226-86265
appModule.controller('tenant.views.admin.business.units.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'businessUnitsEdit', 'utilities', 'abp.services.app.businessUnit', '$filter',
        function ($scope, $uibModal, $uibModalInstance, businessUnitsEdit, utilities, businessUnits, $filter) {

            var vm = this;


            vm.saving = false;
            vm.businessUnit = businessUnitsEdit;
            vm.isEditMod = false;


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                businessUnits.createOrUpdateBusinessUnits(vm.businessUnits).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };



            function init() {

                if (vm.businessUnit != null) {
                    vm.businessUnits = { id: vm.businessUnit.id, name: vm.businessUnit.name, code: vm.businessUnit.code, inActive: vm.businessUnit.inActive, groupName: vm.businessUnit.groupName, employerMolNumber: vm.businessUnit.employerMolNumber, employerBankRoutingCode: vm.businessUnit.employerBankRoutingCode };
                }

            }

            init();
        }
    ]);
