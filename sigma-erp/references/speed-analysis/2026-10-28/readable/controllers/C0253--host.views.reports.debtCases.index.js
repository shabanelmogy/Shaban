// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76837-77145
appModule.controller('host.views.reports.debtCases.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tenant','abp.services.app.case','abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, tenantService, caseService, directoryService) {

            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenants.Report.DebtCases'),
                create: abp.auth.hasPermission('Pages.Tenants.Report.DebtCases.AddNew'),
                edit: abp.auth.hasPermission('Pages.Tenants.Report.DebtCases.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenants.Report.DebtCases.Delete'),
            };


            vm.statuses = [
                { id: 1, name: 'Open' },
                { id: 2, name: 'Closed' },
                //{ id: 3, name: 'On Hold' },
                //{ id: 4, name: 'Cancelled' },
            ];

            vm.filters = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.getDealStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
               /* if (status == 3)
                    return 'On Hold';
                if (status == 4)
                    return 'Cancelled';*/
            };

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            vm.searchCaseNos = function ($select) {
                if ($select.search == "")
                    return null;
                caseService.searchCases({ caseNo: $select.search }).then(function (response) {
                    vm.caseNos = response.data.items;
                });
            };

            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };
            vm.getCases = function () {
                vm.loading = true;

                caseService.getCases(vm.filters).success(function (data) {
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewCase(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status == 1" ng-click="grid.appScope.editCase(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status == 1" ng-click="grid.appScope.deleteCase(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.caseLogsModal(row.entity)">Case Log</a></li>' +
                            //'      <li><a ng-click="grid.appScope.openCaseTasksModal(row.entity)" target="_blank"  >' + 'Tasks' + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == 1" ng-click="grid.appScope.closeCase(row.entity.id)" >Close Case</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Case No',
                        field: 'caseNo',
                        width: '10%',
                    },
                    {
                        name: 'Title',
                        field: 'title',
                        width: '25%'
                    },
                    {
                        name: 'Company',
                        field: 'company.companyName',
                        width: '25%',
                    },
                    {
                        name: 'Tenant',
                        field: 'tenant.tenancyName',
                        width: '20%',

                    },
                    {
                        name: 'Status',
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDealStatus(row.entity.status)}}</div>' +
                            '</div>',
                        width: '20%',
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

                        vm.getCases();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCases();
                    });
                },


                data: []
            };

            vm.caseLogsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/caseDetailLogModal.cshtml',
                    controller: 'host.views.reports.debtCases.caseDetailLogModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        caseObj: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //
                });
            };
            vm.openCaseTasksModal = function (project) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return {
                                id: project.id,
                                company: project.company.companyName,
                                tasks: [],
                                crHours: project.crHours
                            };
                        },
                        prepareRelease: null,
                        releaseId: 0,
                        workspaceId: null,
                        isInitiateFromCase: true
                    }
                });
            }

            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };
            vm.clearTenant = function () {
                vm.filters.tenantId = null;
                vm.filters.tenant = null;
            };
            vm.clearCaseNo = function () {
                vm.filters.caseId = null;
                vm.filters.case = null;
            };
           

            function openCreateOrEditCaseModal(caseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/createOrEditCaseModal.cshtml',
                    controller: 'host.views.reports.debtCases.createOrEditCaseModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseId: function () {
                            return caseId;
                        }
                    },
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.getCases();
                });
            }

            function openViewCaseModal(caseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/viewModal.cshtml',
                    controller: 'host.views.reports.debtCases.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseId: function () {
                            return caseId;
                        }

                    },

                    size: 'lg'
                });

            }

            vm.createCase = function () {
                openCreateOrEditCaseModal(null);
            };

            vm.viewCase = function (cases) {
                openViewCaseModal(cases.id);
            };

            vm.editCase = function (cases) {
                openCreateOrEditCaseModal(cases.id);
            };

            vm.deleteCase = function (deal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            caseService.deleteCase({
                                id: deal.id
                            }).success(function () {
                                vm.getCases();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.closeCase = function (caseObj) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/closeCaseModal.cshtml',
                    controller: 'host.views.reports.debtCases.closeCaseModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseId: function () {
                            return caseObj;
                        }
                    },
                    size: 'md'
                });

                modalInstance.result.then(function () {
                    vm.getCases();
                });
            };

            function init() {
                vm.getCases();
            }
            init();
        }
    ]);
