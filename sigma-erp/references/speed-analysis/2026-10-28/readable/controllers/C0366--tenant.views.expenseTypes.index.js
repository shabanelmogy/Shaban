// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94951-95051
appModule.controller('tenant.views.expenseTypes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.expenseType',
        function ($scope, $uibModal, uiGridConstants, expenseTypeService) {
            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.ExpenseTypes.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.ExpenseTypes.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.ExpenseTypes.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editExpenseType(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteExpenseType(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                   
                    {
                        name: app.localize('ExpenseType'),
                        field: 'name'
                    }
                ],
                data: []
            };

            vm.getExpenseTypes = function () {
                
                vm.loading = true;
                expenseTypeService.getExpenseTypes({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditExpenseTypeModal(expenseTypeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/expenseTypes/createOrEditModal.cshtml',
                    controller: 'tenant.views.expenseTypes.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        expenseTypeId: function () {
                            return expenseTypeId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getExpenseTypes();
                });
            }

            vm.createExpenseType = function() {
                openCreateOrEditExpenseTypeModal(null);
            };

            vm.editExpenseType = function (expenseType) {
                openCreateOrEditExpenseTypeModal(expenseType.id);
            };

            vm.deleteExpenseType = function(expenseType) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', expenseType.name),
                    function(isConfirmed) {
                        if (isConfirmed) {
                            expenseTypeService.deleteExpenseType({
                                id: expenseType.id
                            }).success(function() {
                                vm.getExpenseTypes();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getExpenseTypes();
        }
    ]);
