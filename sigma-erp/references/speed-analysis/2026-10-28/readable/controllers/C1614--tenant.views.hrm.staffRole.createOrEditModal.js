// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:443436-443485
appModule.controller('tenant.views.hrm.staffRole.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.staffRole', 'staffRoleId', '$uibModal', '$http',
        function ($scope, $uibModalInstance, staffRoleService, staffRoleId, $uibModal, $http) {
            var vm = this;

            vm.saving = false;
            vm.staffRole;
            vm.title = "Create Staff Role";


            vm.save = function () {
                debugger;
                vm.saving = true;
                if (staffRoleId != null) {
                    staffRoleService.createOrUpdateStaffRole(vm.staffRole)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                } else {
                    staffRoleService.createOrUpdateStaffRole(vm.staffRole)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                }
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                if (staffRoleId != null) {
                    vm.isEditMod = true;
                    vm.title = "Update StaffRole"
                    staffRoleService.getStaffRoleForEdit(staffRoleId).then(function (data) {
                        vm.staffRole = data.data;
                    });
                }
                else {
                }
            }
            init();
        }
    ]);
