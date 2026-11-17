// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:56076-56174
appModule.controller('host.views.cbs.workspace.createOrEditWorkspaceModal', [
        '$scope', '$uibModalInstance', 'workspaceId', 'abp.services.app.workspace', 'abp.services.app.user',
        function ($scope, $uibModalInstance, workspaceId, workspaceService, userService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.resources = [];
            
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.clearUser = function () {
                vm.ownerUser = null;
                vm.workspace.ownerId = null;
            };

            vm.workspaceTypes = [
                { id: 1, name: 'Development' },
                { id: 2, name: 'Implementation' },
                { id: 3, name: 'Support' },
                { id: 4, name: 'Finance' },
                { id: 5, name: 'Marketing' },
                { id: 6, name: 'Sales' },
                { id: 7, name: 'Admin' },
                { id: 8, name: 'Other' }
            ];

            vm.resourcesChanged = function () {
                vm.workspace.resourcesIds = [];
                vm.resources.forEach(function (resource) {
                    vm.workspace.resourcesIds.push(resource.id);
                });
                vm.users = [];
            };
            vm.workspaceStatuses = [
                { id: 1, name: "Open" },
                { id: 2, name: "Closed" }
            ];
           
            vm.save = function () {
                debugger
                vm.saving = true;
                workspaceService.createOrUpdate({
                    workspace: vm.workspace
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            

          

            function getWorkspaceDetailForEdit() {
                vm.loading = true;
                workspaceService.getWorkspaceForEdit(workspaceId).success(function (result) {
                    userService.getHostUserAccounts().success(function (hostUser) {
                        vm.users = hostUser.items;
                        vm.workspace = result;
                        if (vm.workspace.ownerId != null) {
                            vm.ownerUser = vm.users.filter(function (user) {
                                return user.userId == vm.workspace.ownerId;
                            })[0].user;
                        }
                        vm.resources = [];
                        if (vm.workspace.resourcesIds.length > 0) {
                            vm.workspace.resourcesIds.forEach(function (resourcesId) {
                                let resource = vm.users.filter(function (user) {
                                    return user.userId == resourcesId;
                                })[0];
                                if (resource != undefined)
                                    vm.resources.push(resource.user);
                            });
                        }
                        vm.users = [];
                    });
                    vm.loading = false;
                });
            }

            function init() {
                if (workspaceId)
                    getWorkspaceDetailForEdit();
            }
            init();
        }
    ]);
