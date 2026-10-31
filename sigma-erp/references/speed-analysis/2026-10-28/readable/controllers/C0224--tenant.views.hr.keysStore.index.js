// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71505-71604
appModule.controller('tenant.views.hr.keysStore.index', [
        '$scope', '$uibModal', 'abp.services.app.secretKey',
        function ($scope, $uibModal, secretKeyService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.secretKeyItems = [];

            vm.filters = {
                title: ''
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Page.HR.KeysStore'),
                create: abp.auth.hasPermission('Page.HR.KeysStore.Add'),
                edit: abp.auth.hasPermission('Page.HR.KeysStore.Edit'),
                'delete': abp.auth.hasPermission('Page.HR.KeysStore.Delete'),
                canViewAllKeys: abp.auth.hasPermission('Page.HR.KeysStore.CanViewAllKeys')
            };

            vm.createKeysStore = function () {
                openCreateOrEditKeysStoreModal(null);
            };

            function openCreateOrEditKeysStoreModal(secretKeyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/keysStore/createOrEditModal.cshtml',
                    controller: 'host.views.hr.keysStore.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        secretKeyId: function () {
                            return secretKeyId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.refresh();
                });
            }

            vm.refresh = function () {
                secretKeyService.getAll(vm.filters)
                    .success(function (r) {
                        vm.secretKeyItems = r.items;
                    });
            };

            vm.validate = function (row) {
                return vm.permissions.canViewAllKeys || row.assignedToUserId === abp.session.userId;
            };

            vm.viewKeyStore = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/keysStore/viewModal.cshtml',
                    controller: 'host.views.hr.keysStore.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        secretKeyId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            };

            vm.updateKeyStore = function (id) {
                openCreateOrEditKeysStoreModal(id);
            };

            vm.delete = function (key) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            secretKeyService.delete({ id: key.id }).success(function () {
                                abp.notify.info('Deleted Successfully');
                            }).finally(function () {
                                vm.refresh();
                            });
                        }
                    }
                );
            };

            function init() {
                vm.refresh();
            }

            init();
        }
    ]);
