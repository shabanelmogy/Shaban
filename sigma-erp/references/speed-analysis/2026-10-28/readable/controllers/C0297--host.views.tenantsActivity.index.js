// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:84345-84512
appModule.controller('host.views.tenantsActivity.index', [
        '$scope', '$stateParams', '$uibModal', 'uiGridConstants', 'abp.services.app.tenantActivity', 'abp.services.app.commonLookup', 'lookupModal', 'abp.services.app.vehicle',
        function ($scope, $stateParams, $uibModal, uiGridConstants, tenantActivityService, commonLookupService, lookupModal, vehicleService) {

            var vm = this;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeModel = {
                startDate: todayAsString,
                endDate: todayAsString
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filterText = $stateParams.filterText || null;

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    return "";
                }
            };
            
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenants.Create'),
                edit: abp.auth.hasPermission('Pages.Tenants.Edit'),
                changeFeatures: abp.auth.hasPermission('Pages.Tenants.ChangeFeatures'),
                impersonation: abp.auth.hasPermission('Pages.Tenants.Impersonation'),
                'delete': abp.auth.hasPermission('Pages.Tenants.Delete')
            };

            vm.filters = {
                fromDate: null,
                toDate: null,
                endDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };
            
            vm.tenantGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('TenancyCode'),
                        field: 'tenancyName'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Edition'),
                        field: 'editionDisplayName'
                    },
                    {
                        name: app.localize('CreationTime'),
                        field: 'creationTime',
                        cellTemplate:
                           '<div class=\"ui-grid-cell\">' +
                           '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.creationTime)}}</div>' +
                           '</div>'

                    },
                    {
                        name: app.localize('MovementCount'),
                        field: 'movementCount',
                        maxWidth: 150,
                        enableSorting: false,
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

                        vm.getTenants();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTenants();
                    });
                },
                data: []
            };

            if (!vm.permissions.edit && !vm.permissions.delete) {
                vm.tenantGridOptions.columnDefs.shift();
            }

            vm.exportToExcel = function () {
                vm.loading = true;
                vehicleService.exportToExcel({ fromDate: vm.dateRangeModel.startDate, toDate: vm.dateRangeModel.endDate })
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getTenants = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate;
                vm.filters.toDate = vm.dateRangeModel.endDate;

                tenantActivityService.getTenantsActivity(vm.filters).success(function (data) {
                    vm.tenantGridOptions.totalItems = data.totalCount;
                    vm.tenantGridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.impersonate = function (tenant) {
                lookupModal.open({
                    title: app.localize('SelectAUser'),
                    serviceMethod: commonLookupService.findUsers,
                    extraFilters: {
                        tenantId: tenant.id
                    },
                    callback: function (selectedItem) {
                        abp.ajax({
                            url: abp.appPath + 'Account/Impersonate',
                            data: JSON.stringify({
                                tenantId: tenant.id,
                                userId: selectedItem.value
                            })
                        });
                    }
                });
            };


            vm.editFeatures = function (tenant) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/featuresModal.cshtml',
                    controller: 'host.views.tenants.featuresModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        }
                    }
                });
            };

            vm.getTenants();
        }]);
