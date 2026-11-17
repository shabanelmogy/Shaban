// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94295-94345
appModule.controller('tenant.views.common.designations.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.designation', 'designationId',
        function ($scope, $uibModalInstance, designationService, designationId) {

            var vm = this;
            vm.isHrmEnabled = abp.features.isEnabled("HRM");

            vm.saving = false;
            vm.itemType = null;
            vm.loading = false;

            //vm.isCrsEnabled = abp.features.isEnabled("WorkShop");

            vm.staffCategories = [
                { name: "Top Management", id: 1 },
                { name: "Manager", id: 2 },
                { name: "General", id: 3 }
            ];

            vm.save = function () {
                
                vm.saving = true;
                designationService.createOrUpdateDesignation({
                    designation: vm.designation
                }).success(function () {
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
                designationService.getDesignationForEdit({
                    id: designationId
                }).success(function (result) {
                    vm.designation = result;
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
