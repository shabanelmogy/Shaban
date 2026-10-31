// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94545-94647
appModule.controller('tenant.views.divisions.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.division',
        function ($scope, $uibModal, uiGridConstants, divisionService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Divisions.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Divisions.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Divisions.Delete')
            };

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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editDivision(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteDivision(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('DivisionName'),
                        field: 'name'
                    }
                ],
                data: []
            };

            vm.getDivisions = function () {
                vm.loading = true;
                divisionService.getDivisions(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditDivisionModal(divisionId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/divisions/createOrEditModal.cshtml',
                    controller: 'tenant.views.divisions.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        divisionId: function () {
                            return divisionId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDivisions();
                });
            }

            vm.createDivision = function () {
                openCreateOrEditDivisionModal(null);
            };

            vm.editDivision = function (division) {
                openCreateOrEditDivisionModal(division.id);
            };

            vm.deleteDivision = function (division) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', division.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            divisionService.deleteDivision({
                                id: division.id
                            }).success(function () {
                                vm.loading = false;
                                vm.getDivisions();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getDivisions();
        }
    ]);
