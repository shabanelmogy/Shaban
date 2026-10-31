// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436495-436543
appModule.controller('tenant.views.hrm.department.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.department', 'departmentId', '$uibModal', '$http',
        function ($scope, $uibModalInstance, departmentService, departmentId, $uibModal, $http) {
            var vm = this;

            vm.saving = false;
            vm.department;
            vm.title = "Create Department";

            vm.save = function () {
                debugger;
                vm.saving = true;
                if (departmentId != null) {
                    departmentService.createOrUpdateDepartment(vm.department)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                } else {
                    departmentService.createOrUpdateDepartment(vm.department)
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
                if (departmentId != null) {
                    vm.isEditMod = true;
                    vm.title = "Update Department"
                    departmentService.getDepartmentForEdit(departmentId).then(function (data) {
                        vm.department = data.data;
                    });
                }
                else {
                }
            }
            init();
        }
    ]);
