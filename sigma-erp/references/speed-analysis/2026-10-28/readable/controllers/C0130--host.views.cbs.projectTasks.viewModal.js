// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:54991-55022
appModule.controller('host.views.cbs.projectTasks.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.projectTask', 'options',
        function ($scope, $uibModalInstance, projectTaskService, options) {

            var vm = this;
            vm.loading = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'Urgent';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
            };

            function init() {
                vm.loading = true;
                projectTaskService.getProjectTaskForEdit({
                    id: options.projectTaskId
                }).success(function (result) {
                    vm.projectTask = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
