// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:37278-37611
appModule.controller('host.views.cbs.projects.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.project', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, projectService, directoryService) {

            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.CBS.Projects'),
                create: abp.auth.hasPermission('Pages.CBS.Projects.AddNew'),
                edit: abp.auth.hasPermission('Pages.CBS.Projects.Edit'),
                complete: abp.auth.hasPermission('Pages.CBS.Projects.Complete'),
                scope: abp.auth.hasPermission('Pages.CBS.Projects.Scope'),
                'delete': abp.auth.hasPermission('Pages.CBS.Projects.Delete'),
                'print': abp.auth.hasPermission('Pages.Tenant.Projects.Print')
            };


            vm.statuses = [
            { id: 1, name: 'Open' },
            { id: 2, name: 'Closed' },
            { id: 3, name: 'On Hold' },
            { id: 4, name: 'Cancelled' },
            { id: 5, name: 'Completed' },
            ];

            vm.filters = {
                projectNo: null,
                title: '',
                tenantId: '',
                status: 1,
                companyId: null,
                fromDate: null,
                toDate: null,
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
                if (status == 3)
                    return 'On Hold';
                if (status == 4)
                    return 'Cancelled';
                if (status == 5)
                    return 'Completed';
            };

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewProject(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editProject(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteProject(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.scope" ng-click="grid.appScope.openScopeProjectModal(row.entity)">' + app.localize('Scope') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.projectLogsModal(row.entity)">Project Log</a></li>' +
                            '      <li><a ng-click="grid.appScope.openProjectTasksModal(row.entity)" target="_blank"  >' + 'Tasks' + '</a></li>' +
                            '      <li><a  target="_blank" ng-href="/Report#/host/printProject/{{ { id:row.entity.id}  }}" >' + app.localize('Print') + '</a></li>' +
                            '      <li ng-if="row.entity.status == 1"><a   ng-click="grid.appScope.closeProject(row.entity.id)" >' + app.localize('CloseProject') + '</a></li>' +
                            '      <li ng-if="row.entity.status == 1 && grid.appScope.permissions.complete"><a ng-click="grid.appScope.completeProject(row.entity.id)">' + app.localize('MarkAsCompleted') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Project No',
                        field: 'projectNo',
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

                        vm.getProjects();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getProjects();
                    });
                },


                data: []
            };

            vm.projectLogsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/createOrShowProjectLogsModal.cshtml',
                    controller: 'host.views.cbs.projects.createOrShowProjectLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        project: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //
                });
            };
            vm.openProjectTasksModal = function (project) {
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
                        prepareRelease: true,
                        releaseId: 0,
                        workspaceId: null,
                        isInitiateFromCase: null
                    }
                });
            }

            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };
            vm.getProjects = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                // Make sure projectNo is included in the request to the server
                projectService.getProjects(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            function openCreateOrEditProjectModal(projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/createOrEditProjectModal.cshtml',
                    controller: 'host.views.cbs.projects.createOrEditProjectModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }
                    },
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.getProjects();
                });
            }

            function openViewProjectModal(projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/viewModal.cshtml',
                    controller: 'host.views.cbs.projects.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }

                    },

                    size:'lg'
                });

            }

            vm.createProject = function () {
                openCreateOrEditProjectModal(null);
            };

            vm.viewProject = function (project) {
                openViewProjectModal(project.id);
            };

            vm.editProject = function (project) {
                openCreateOrEditProjectModal(project.id);
            };

            vm.deleteProject = function (deal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.deleteProject({
                                id: deal.id
                            }).success(function () {
                                vm.getProjects();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.openScopeProjectModal = function (row) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/projectScopeModal.cshtml',
                    controller: 'host.views.cbs.projects.projectScopeModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return row;
                        },
                    }
                });
            };

            vm.closeProject = function (id) {
                abp.message.confirm(
                    app.localize('CloseProjectWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.closeProject({
                                id: id
                            }).success(function () {
                                vm.getProjects();
                                abp.notify.success(app.localize('SuccessfullyClosed'));
                            });
                        }
                    }
                );
            };

            vm.completeProject = function (id) {
                abp.message.confirm(
                    app.localize('WantToMarkProjectAsCompleted?'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.completeProject({
                                id: id
                            }).success(function () {
                                vm.getProjects();
                                abp.notify.success(app.localize('SuccessfullyCompleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.getProjects();
            }
            init();
        }
    ]);
