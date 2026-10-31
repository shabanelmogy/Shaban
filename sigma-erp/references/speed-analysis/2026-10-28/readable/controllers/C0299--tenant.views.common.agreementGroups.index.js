// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:84557-84697
appModule.controller('tenant.views.common.agreementGroups.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.agreementGroup',
        function ($scope, $uibModal, uiGridConstants, agreementGroupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
           /* vm.filters = {
                contactType: 2
            };
*/
            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.AgreementGroups.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.AgreementGroups.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.AgreementGroups.View'),
                'delete': abp.auth.hasPermission('Pages.Tenant.AgreementGroups.Delete'),
            }

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAgreementGroup(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editAgreementGroup(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.isDefault" ng-click="grid.appScope.deleteAgreementGroup(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Name'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.name}}' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('IsDefault'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            ' <span class="label label-success" style="margin:4px;background-color:#44B6AE" ng-show="row.entity.isDefault">' + 'Yes' + '</span>' +
                            ' <span class="label label-success" style="margin:4px;background-color:#D3D3D3" ng-show="!row.entity.isDefault">' + 'No' + '</span>' +
                            '</div>'
                    },

                ],
                data: []
            };

            vm.getAgreementGroups = function () {
                vm.loading = true;
                agreementGroupService.getAgreementGroups(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditAgreementGroupModal(agreementGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/agreementGroups/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.agreementGroups.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        agreementGroupId: function () {
                            return agreementGroupId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getAgreementGroups();
                });
            }

            function openViewAgreementGroupModal(agreementGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/agreementGroups/viewModal.cshtml',
                    controller: 'tenant.views.common.agreementGroups.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        agreementGroupId: function () {
                            return agreementGroupId;
                        }
                    }
                });


            }

            vm.createAgreementGroup = function () {
                openCreateOrEditAgreementGroupModal(null);
            };

            vm.editAgreementGroup = function (agreementGroup) {
                openCreateOrEditAgreementGroupModal(agreementGroup.id);
            };

            vm.viewAgreementGroup = function (agreementGroup) {
                openViewAgreementGroupModal(agreementGroup.id);
            };

            vm.deleteAgreementGroup = function (location) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', location.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementGroupService.deleteAgreementGroup({
                                id: location.id
                            }).success(function () {
                                vm.getAgreementGroups();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.getAgreementGroups();
            }
            init();
        }
    ]);
