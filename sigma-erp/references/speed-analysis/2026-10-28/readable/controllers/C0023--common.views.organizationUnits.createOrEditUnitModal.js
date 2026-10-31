// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:27701-27758
appModule.controller('common.views.organizationUnits.createOrEditUnitModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.organizationUnit', 'organizationUnit',
        function ($scope, $uibModalInstance, organizationUnitService, organizationUnit) {
            var vm = this;

            vm.organizationUnit = organizationUnit;

            vm.saving = false;
            vm.departmentTypes = [

                { id: 1, name: "Technical" },
                { id: 2, name: "Projects" },
                { id: 3, name: "CustomerCare" },
                { id: 4, name: "Finance" },
                { id: 5, name: "Marketing" },
                { id: 6, name: "Sales" },
                { id: 7, name: "HR and Admin" }
            ];
            vm.taskTypes = [
                
                { id: 1, name: "Development" },
                { id: 2, name: "Implementation" },
                { id: 3, name: "Support" },
                { id: 4, name: "Finance" },
                { id: 5, name: "Marketing" },
                { id: 6, name: "Sales" },
                { id: 7, name: "Admin" }
            ];
            vm.save = function () {
                if (vm.organizationUnit.id) {
                    organizationUnitService
                        .updateOrganizationUnit(vm.organizationUnit)
                        .success(function(result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close(result);
                        });
                } else {
                    organizationUnitService
                        .createOrganizationUnit(vm.organizationUnit)
                        .success(function(result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close(result);
                        });
                }
            };
            vm.getTeamDepartment = function (organizationUnitId) {
                organizationUnitService.getTeamDepartment(organizationUnitId).success(function (result) {
                    vm.organizationUnit.type = result.type;
                    vm.organizationUnit.department = result.department;
                });
            };
            if (organizationUnit.id)
                vm.getTeamDepartment(organizationUnit.id)
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
