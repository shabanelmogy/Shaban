// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:78839-79117
appModule.controller('host.views.reports.sales.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.salesHost', 'abp.services.app.directory', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, uiGridConstants, salesService, directoryService, businessDivisionService) {

            var vm = this;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                addSale: abp.auth.hasPermission('Pages.Tenants.HostReports.Sales.AddNew'),
                editSale: abp.auth.hasPermission('Pages.Tenants.HostReports.Sales.Edit'),
                deleteSale: abp.auth.hasPermission('Pages.Tenants.HostReports.Sales.Delete'),
                viewSale: abp.auth.hasPermission('Pages.Tenants.HostReports.Sales.View'),
            };

            vm.filters = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                businessDivisionId: null,
                companyId: null,
                creatorUserId: null,
                enableCreationDateRange: false,
                enableSaleDateRange: false,
                creationFromDate: null,
                creationToDate: null,
                saleFromDate: null,
                saleToDate: null
            };


            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                    endDate: moment(moment().format('YYYY-MM-DD')).utc()
                    //endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
                };
            }

            vm.creationDateRangeChanged = function () {
                vm.filters.creationFromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                vm.filters.creationToDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.saleDateRangeChanged = function () {
                vm.filters.saleFromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                vm.filters.saleToDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.creationDateRangeCheck = function () {
                if (vm.filters.enableCreationDateRange) {
                    vm.filters.creationFromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.creationToDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                } else {
                    vm.filters.creationFromDate = null;
                    vm.filters.creationToDate = null;
                }
            };

            vm.saleDateRangeCheck = function () {
                if (vm.filters.enableSaleDateRange) {
                    vm.filters.saleFromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.saleToDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                } else {
                    vm.filters.saleFromDate = null;
                    vm.filters.saleToDate = null;
                }
            };

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };

            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {

                    return date.replace('Z', '');

                }
                else {
                    return "";
                }
            };

            vm.createSale = function () {
                openCreateOrEditSaleModal(null);
            };

            vm.viewSale = function (sale) {
                openViewSaleModal(sale.id);
            };

            vm.editSale = function (sale) {
                openCreateOrEditSaleModal(sale.id);
            };

            function openCreateOrEditSaleModal(saleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/sales/createOrEditSaleModal.cshtml',
                    controller: 'host.views.reports.sales.createOrEditSaleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        saleId: function () {
                            return saleId;
                        }
                    },
                    size: 'xl',

                });
                modalInstance.result.then(function (result) {
                    vm.getSales();
                })
            };

            function openViewSaleModal(saleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/sales/viewSaleModal.cshtml',
                    controller: 'host.views.reports.sales.viewSaleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        saleId: function () {
                            return saleId;
                        }
                    },
                    size: 'xl',

                });
                /*modalInstance.result.then(function (result) {
                    vm.getSales();
                })*/
            };

            vm.deleteSale = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            salesService.deleteSale({
                                id: row.id
                            }).success(function () {
                                vm.getSales();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getSales = function () {
                vm.loading = true;
                if (vm.filters.enableCreationDateRange) {
                    vm.filters.creationFromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.creationToDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (vm.filters.enableSaleDateRange) {
                    vm.filters.saleFromDate == vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.saleToDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                if (!vm.filters.enableCreationDateRange) {
                    vm.filters.creationFromDate = null;
                    vm.filters.creationToDate = null;
                }
                if (!vm.filters.enableSaleDateRange) {
                    vm.filters.saleFromDate = null;
                    vm.filters.saleToDate = null;
                }
                salesService.getSales(vm.filters ).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
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
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 60,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.viewSale" ng-click="grid.appScope.viewSale(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.editSale" ng-click="grid.appScope.editSale(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.deleteSale" ng-click="grid.appScope.deleteSale(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Sale Date',
                        field: 'saleDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{grid.appScope.getlocalDateTime(row.entity.saleDate) | date:"dd-MMM-yy"}}</span>' +
                            '</div>',
                    },
                    {
                        name: 'Division',
                        field: 'businessDivision.name',
                    },
                    {
                        name: 'Company',
                        field: 'company.companyName',
                    },
                    {
                        name: 'Created By',
                        field: 'creatorUserName',
                    },
                    {
                        name: 'Creation Date',
                        field: 'creationDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{grid.appScope.getlocalDateTime(row.entity.creationDate) | date:"dd-MMM-yy"}}</span>' +
                            '</div>',
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

                        vm.getSales();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSales();
                    });
                },


                data: []
            };

            function init() {
                initDate();
                vm.getSales();
                vm.getbusinessDivisions();
            }
            init();
        }
    ]);
