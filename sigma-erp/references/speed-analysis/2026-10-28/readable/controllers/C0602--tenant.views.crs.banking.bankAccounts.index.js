// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:163197-163389
appModule.controller('tenant.views.crs.banking.bankAccounts.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.bankAccount',
        function ($scope, $uibModal, uiGridConstants, bankAccountService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                accountNo: '',
                bankName: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Banking.BankAccounts'),
                create: abp.auth.hasPermission('Pages.Tenant.Banking.BankAccounts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Banking.BankAccounts.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Banking.BankAccounts.Delete')
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewBankAccount(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editBankAccount(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteBankAccount(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openChequaPrintingSettingModal(row.entity)">' + app.localize('ChequePrintingSetting') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
               
                      {
                          name: app.localize('Name'),
                          field: 'bankName',
                          cellTemplate:
                               '<div class=\"ui-grid-cell\">' +
                               '<div class=\"ui-grid-cell-contents\">{{row.entity.bankName}}</div>' +
                               '</div>'
                      },
                     {
                         name: app.localize('AccountNo'),
                         field: 'accountNo'
                    },
                    {
                        name: app.localize('TaxId'),
                        field: 'taxId'
                    },
                   
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getBankAccount();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getBankAccount();
                    });
                },
                data: []
            };

          
            vm.getBankAccount = function () {
              
                vm.loading = true;
                bankAccountService.getBankAccounts(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
               
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                staffService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditBankAccountModal(bankAccountId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/bankAccounts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.banking.bankAccounts.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        bankAccountId: function () {
                            return bankAccountId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getBankAccount();
                });
            }

            function openViewModal(bankAccountId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/bankAccounts/viewModel.cshtml',
                    controller: 'tenant.views.crs.banking.bankAccounts.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        bankAccountId: function () {
                            return bankAccountId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getBankAccount();
                });
            }

            vm.openChequaPrintingSettingModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/bankAccounts/chequaPrintingSettingModal.cshtml',
                    controller: 'tenant.views.crs.banking.bankAccounts.chequaPrintingSettingModal as vm',
                    backdrop: 'static',
                    resolve: {
                        bankAccount: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getBankAccount();
                });
            };
            vm.createBankAccount = function () {
              
                openCreateOrEditBankAccountModal(null);
            };

            vm.editBankAccount = function (bankAccount) {
                openCreateOrEditBankAccountModal(bankAccount.id);
            };

            vm.viewBankAccount = function (bankAccount) {
                openViewModal(bankAccount.id);
            };

            vm.deleteBankAccount = function (bankAccount) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function(isConfirmed) {
                        if (isConfirmed) {
                            bankAccountService.deleteBankAccount({
                                id: bankAccount.id
                            }).success(function() {
                                vm.getBankAccount();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getBankAccount();
        }
    ]);
