// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:56017-56073
appModule.controller('host.views.cbs.workspace.createOrEditBoardModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.workspace', 'abp.services.app.user', 'workspaceId', 'boardId', 'abp.services.app.project','workspaceType',
        function ($scope, $uibModalInstance, workspaceService, userService, workspaceId, boardId, projectService, workspaceType) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.boardId = boardId;
            vm.project = {
                boardType : workspaceType
            }
            //vm.project = { 'workspaceId': workspaceId };
            vm.save = function () {
                vm.saving = true;
                vm.project.workspaceId = workspaceId;
                workspaceService.createOrEditBoard({
                    project: vm.project
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(vm.project);
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.boardTypes = [
                { id: 1, name: 'Development' },
                { id: 2, name: 'Implementation' },
                { id: 3, name: 'Support' },
                { id: 4, name: 'Finance' },
                { id: 5, name: 'Marketing' },
                { id: 6, name: 'Sales' },
                { id: 7, name: 'Admin' },
                { id: 8, name: 'Other' }
            ];
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                projectService.getProjectForEdit({
                    id: boardId
                }).success(function (result) {
                    vm.project = result;
                }).finally(function () {
                    vm.loading = false;
                });

            }
            if (boardId)
                init();




        }
    ]);
