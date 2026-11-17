// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:87022-87182
appModule.controller('tenant.views.common.currencies.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.currency',
        function ($scope, $uibModal, uiGridConstants, currencyService) {

            var vm = this;

            //$scope.$on('$viewContentLoaded', function () {
            //    App.initAjax();
            //});
           
            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Currencies'),
                create: abp.auth.hasPermission('Pages.Tenant.Currencies.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Currencies.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Currencies.Delete'),
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewCurrency(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editCurrency(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && !row.entity.isBase" ng-click="grid.appScope.makeBase(row.entity)">' + app.localize('SetAsBase') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.isBase" ng-click="grid.appScope.deleteCurrency(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Code'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.code}}' + '</span>' +
                            ' <span class="label label-success" style="margin:4px;background-color:#44B6AE" ng-show="row.entity.isBase">' + 'Base' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Currency'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.name}}' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CurrencyToBaseRate'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.currencyToBaseRate}}' + '</span>' +
                            '</div>'
                    },

                ],
                data: []
            };

            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditCurrencyModal(currencyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/currencies/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.currencies.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        currencyId: function () {
                            return currencyId;
                        }
                       
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCurrencies();
                });
            }

            function openViewCurrencyModal(currencyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/currencies/viewModal.cshtml',
                    controller: 'tenant.views.common.currencies.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        currencyId: function () {
                            return currencyId;
                        }
                    }
                });


            }

            vm.createCurrency = function () {
                openCreateOrEditCurrencyModal(null);
            };

            vm.editCurrency = function (currency) {
                openCreateOrEditCurrencyModal(currency.id);
            };

            vm.viewCurrency = function (currency) {
                openViewCurrencyModal(currency.id);
            };

            vm.deleteCurrency = function (location) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', location.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            currencyService.deleteCurrency({
                                id: location.id
                            }).success(function () {
                                vm.getCurrencies();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.makeBase = function (location) {
                abp.message.confirm(
                    app.localize('BaseWarningMessage', location.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            currencyService.makeBaseCurrency({
                                id: location.id
                            }).success(function () {
                                vm.getCurrencies();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            function init() {
                vm.getCurrencies();
            }
            init();
        }
    ]);
