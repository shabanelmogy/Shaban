// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:194385-194438
appModule.controller('tenant.views.taskAssignment.createOrEditModal', ['$uibModal', '$timeout', '$scope', '$uibModalInstance', 'abp.services.app.cRMCampaign', 'assignmentId', 'editFlag', 'viewFlag',
        function ($uibModal, $timeout, $scope, $uibModalInstance, taskAssignmentService, assignmentId, editFlag, viewFlag) {
            var vm = this;
            vm.assignmentId = assignmentId || null;
            vm.editFlag = editFlag || false;
            vm.viewFlag = viewFlag || false;
            vm.assignment = {
                id: null,
                task: null,
                taskDescription: null,
                users: [],
                resourceId: null,
                additionalNotes: null,
                dueDateTime: null
            };
            vm.tasks = [{ name: 'Prepare Report' }, { name: 'Fix Bug' }, { name: 'Team Meeting' }]; // Dummy data
            vm.users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]; // Dummy data

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                if (vm.assignmentId) {
                    taskAssignmentService.updateAssignment(vm.assignment).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    taskAssignmentService.createAssignment(vm.assignment).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            function init() {
                if (vm.assignmentId) {
                    vm.loading = true;
                    taskAssignmentService.getAssignmentForEdit(vm.assignmentId).success(function (data) {
                        vm.assignment = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            init();
        }
    ]);
