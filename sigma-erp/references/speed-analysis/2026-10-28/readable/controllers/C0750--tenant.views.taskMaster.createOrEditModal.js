// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:194985-195037
appModule.controller('tenant.views.taskMaster.createOrEditModal', ['$uibModal', '$timeout', '$scope', '$uibModalInstance', 'abp.services.app.cRMCampaign', 'taskId', 'editFlag', 'viewFlag',
        function ($uibModal, $timeout, $scope, $uibModalInstance, taskService, taskId, editFlag, viewFlag) {
            var vm = this;
            vm.taskId = taskId || null;
            vm.editFlag = editFlag || false;
            vm.viewFlag = viewFlag || false;
            vm.task = {
                id: null,
                name: null,
                category: null,
                type: null,
                isApprovalRequired: false,
                description: null
            };
            vm.taskCategories = ['General', 'Administrative', 'Development', 'Support']; // Example categories, adjust as needed
            vm.taskTypes = ['Routine', 'Urgent', 'Project', 'Maintenance']; // Example types, adjust as needed

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                if (vm.taskId) {
                    taskService.updateTask(vm.task).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    taskService.createTask(vm.task).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            function init() {
                if (vm.taskId) {
                    vm.loading = true;
                    taskService.getTaskForEdit(vm.taskId).success(function (data) {
                        vm.task = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            init();
        }
    ]);
