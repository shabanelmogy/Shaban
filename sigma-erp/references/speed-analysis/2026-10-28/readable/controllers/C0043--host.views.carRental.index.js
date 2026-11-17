// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:30387-30636
appModule.controller('host.views.carRental.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.carRental',
        function ($scope, $uibModal, uiGridConstants, directoryService, carRentalService) {
            var vm = this;
            vm.IsFeaturedOptions = [
                { name: 'false', id: 0 },
                { name: 'true', id: 1 }
            ];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.CarRental.Dashboard.CreateCompany'),
                edit: abp.auth.hasPermission('Pages.CarRental.Dashboard.EditCompany'),
                delete: abp.auth.hasPermission('Pages.CarRental.Dashboard.DeleteCompany'),
            };
            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: "name asc"
            };
            vm.filters = {
                isFeatured: false,
            };
            vm.tenantGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                enableColumnResizing: true,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader}"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 115,
                        enableColumnResizing: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editCompany(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.DeleteCompany(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('CompanyName'),
                        width: 240,
                        field: 'name'
                    },
                    {
                        name: app.localize('PhoneNumber'),
                        width: 180,
                        field: 'phone'
                    },
                    {
                        name: app.localize('Address'),
                        width: 180,
                        field: 'address'
                    },
                    {
                        name: app.localize('Tagline'),
                        width: 200,
                        field: 'tagline'
                    },
                    {
                        name: app.localize('EmailAddress'),
                        field: 'email'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            requestParams.sorting = null;
                            console.log(sortColumns);
                        } else {
                            requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                            console.log("Else Condition Sort :" + sortColumns[0].field +"Direction  :"+ sortColumns[0].sort.direction +"Sort Length :"+ sortColumns[0].length );
                            console.log("Sorting params :" + requestParams.sorting);
                        }
                        vm.getCompany();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        requestParams.skipCount = (pageNumber - 1) * pageSize;
                        requestParams.maxResultCount = pageSize;
                        if (vm.filters != null) {
                            vm.searchItems(requestParams.skipCount, requestParams.maxResultCount);
                        }
                    });
                },
                data: []
            };
            vm.searchButtonCLick = function () {
                requestParams.skipCount = 0;
                requestParams.maxResultCount = 10;
                vm.tenantGridOptions.paginationCurrentPage = 1;
                vm.tenantGridOptions.paginationPageSize = 10;

                vm.searchItems();
            }
            vm.searchItems = function () {
                vm.loading = true;
                if (vm.filters == null) {
                    vm.filters = { isFeatured :false};
                }
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "name asc"
                }
                carRentalService.searchCompany({
                    Name: vm.filters.companyName, Email: vm.filters.companyEmail, isFeatured: vm.filters.isFeatured,
                    pageNumber: requestParams.skipCount, pageSize: requestParams.maxResultCount, sorting: requestParams.sorting
                }).then(function (data) {
                    if (data.data != null) {
                        vm.tenantGridOptions.totalItems = data.data.totalCount;
                        let datas = data.data.data
                        let modifiedData = [];
                        for (let i = 0; i < data.data.data.length; i++) {
                            modifiedData.push(data.data.data[i]);
                        }
                        vm.tenantGridOptions.data = modifiedData;
                    }
                    else {
                        vm.tenantGridOptions.data = [];

                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getCompany = function () {
                vm.loading = true;
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "name asc"
                }
                carRentalService.getCompany({ pageNumber: requestParams.skipCount, pageSize: requestParams.maxResultCount, sorting: requestParams.sorting }).then(function (data) {
                    vm.tenantGridOptions.totalItems = data.data.totalCount;
                    let datas = data.data.data
                    let modifiedData = [];
                    for (let i = 0; i < data.data.data.length; i++) {
                        modifiedData.push(data.data.data[i]);
                    }
                    vm.tenantGridOptions.data = modifiedData;

                }).finally(function () {
                    vm.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            };
            vm.addCompany = function (company) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/carRental/createOrEditModal.cshtml',
                    controller: 'host.views.carRental.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        companyId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompany();
                });
            };
            vm.editCompany = function (company) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/carRental/createOrEditModal.cshtml',
                    controller: 'host.views.carRental.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        companyId: function () {
                            return company._id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompany();
                });
            };
            vm.DeleteCompany = function (company) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            carRentalService.deleteCompany(company._id)
                                .then(function (data) {
                                    if (data.data[0].speedId) {
                                        directoryService.updatePublishedEntity(data.data[0].speedId, "".toString())
                                        abp.notify.info(app.localize('RecordDeleted.'));
                                    }
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getCompany();
                                });
                        }
                    }
                );
            };
            vm.searchAddContacts = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/carRental/searchAddContacts.cshtml',
                    controller: 'host.views.carRental.searchAddContacts as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompany();
                });
            };
            function openCreateOrEditExpenseTypeModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/mergeContacts/searchAddContacts.cshtml',
                    controller: 'common.views.mergeContacts.searchAddContacts as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result.length > 0) {
                        result.forEach(function (value) {
                            var foundLines = $filter('filter')(vm.mergeContactData, {
                                id: value.id,
                            }, true);
                            if (foundLines.length == 0) {
                                vm.mergeContactData.push(value);
                            }
                        });
                    }
                });
            }
            vm.getCompany();
            function init() {
            }
            init();
        }
    ]);
