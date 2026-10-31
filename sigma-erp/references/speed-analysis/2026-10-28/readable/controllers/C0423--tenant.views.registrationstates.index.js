// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:104796-104898
appModule.controller('tenant.views.registrationstates.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.registrationState',
        function ($scope, $uibModal, uiGridConstants, registrationStateService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.States.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.States.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.States.Delete')
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editRegistrationState(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteRegistrationState(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RegistrationStateCode'),
                        field: 'stateCode'
                    },
                    {
                        name: app.localize('RegistrationStateName'),
                        field: 'name'
                    }
                ],
                data: []
            };

            vm.getRegistrationStates = function () {
                vm.loading = true;
                registrationStateService.getRegistrationStates({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditRegistrationStateModal(registrationStateId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/registrationstates/createOrEditModal.cshtml',
                    controller: 'tenant.views.registrationstates.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        registrationStateId: function () {
                            return registrationStateId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getRegistrationStates();
                });
            }

            vm.createRegistrationState = function() {
                openCreateOrEditRegistrationStateModal(null);
            };

            vm.editRegistrationState = function(registrationState) {
                openCreateOrEditRegistrationStateModal(registrationState.id);
            };

            vm.deleteRegistrationState = function (registrationState) {
                abp.message.confirm(
                    app.localize('RegistrationStateDeleteWarningMessage', registrationState.name),
                    function(isConfirmed) {
                        if (isConfirmed) {
                            registrationStateService.deleteRegistrationState({
                                id: registrationState.id
                            }).success(function() {
                                vm.getRegistrationStates();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getRegistrationStates();
        }
    ]);
