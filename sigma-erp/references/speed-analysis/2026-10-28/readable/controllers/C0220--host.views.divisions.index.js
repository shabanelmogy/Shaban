// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71094-71244
appModule.controller('host.views.divisions.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.currency', 'abp.services.app.businessDivision',
        function ($scope, $uibModal,  uiGridConstants, currencyService, businessDivisionService) {
            var vm = this;
            vm.createDivision = function () {
                openCreateOrEditDivisionModal(null);
            };
            vm.editDivision = function (row) {
                openCreateOrEditDivisionModal(row.id);
            }
            vm.filters = {
                name: '',
                currencyId: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Administration.Host.BusinessDivisions.Create'),
                edit: abp.auth.hasPermission('Pages.Administration.Host.BusinessDivisions.Edit'),
                'delete': abp.auth.hasPermission('Pages.Administration.Host.BusinessDivisions.Delete')
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
                        width: 115,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li ng-if="grid.appScope.permissions.edit"><a  ng-click="grid.appScope.editDivision(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-click="grid.appScope.deleteDivision(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +

                            '</div>'
                    },
                    {
                        name: app.localize('Title'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'code'
                    },
                    {
                        name: app.localize('Currency'),
                        field: 'currency.code'
                    },
                    {
                        name: app.localize('Vat (%)'),
                        field: 'vatPercentage'
                    },
                    {
                        name: app.localize('Group'),
                        field: 'groupName'
                    }

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getDivisions();

                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getDivisions();

                    });
                },
                data: []
            };
            vm.deleteDivision = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            businessDivisionService.deleteDivision(row.id)
                                .then(function (data) {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getDivisions();
                                });
                        }
                    }
                );
            };
            function openCreateOrEditDivisionModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/divisions/createOrEditDivisionModal.cshtml',
                    controller: 'host.views.divisions.createOrEditDivisionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        divisionId: function () {
                            return id;
                        }
                     
                    }
                });

                modalInstance.result.then(function () {
                    vm.getDivisions();
                });
            }
            
            vm.getDivisions = function () {
                vm.loading = true;
                businessDivisionService.getDivisions(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getCurrencies();
                vm.getDivisions();
                
            }
            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
