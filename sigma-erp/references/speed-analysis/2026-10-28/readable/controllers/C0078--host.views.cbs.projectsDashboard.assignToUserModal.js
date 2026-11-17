// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:38833-38855
appModule.controller('host.views.cbs.projectsDashboard.assignToUserModal', [
        '$uibModalInstance', 'task', 'abp.services.app.user',
        function ($uibModalInstance, task, userService) {
            var vm = this;
            vm.task = task;

            vm.searchAssignedToUserName = function ($select) {
                if (!$select.search)
                    return null;
                userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                    vm.assignedToUserNames = response.data.items;
                });
            };

            vm.save = function () {
                $uibModalInstance.close(vm.assignedToUserName);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
