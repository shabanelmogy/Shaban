// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:451142-451183
appModule.controller('tenant.views.staff.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.staff', 'utilities','staffId', 
        function ($scope, $uibModalInstance, staffService, utilities, staffId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.isCodeManual = utilities.parseBoolean(abp.setting.get("App.DocumentNos.ManualStaffCode"));

            vm.save = function () {
                vm.saving = true;
                //vm.staff.documentType = 3;  //3 for national id
                staffService.createOrUpdateStaff({
                    staff: vm.staff,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
           
            function init() {
                staffService.getStaffForEdit({
                    id: staffId
                }).success(function (result) {
                    vm.staff = result;
                    if (vm.staff.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                });
            }

            init();
        }
    ]);
