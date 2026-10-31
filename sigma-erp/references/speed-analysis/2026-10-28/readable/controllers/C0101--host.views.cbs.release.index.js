// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:46052-46338
appModule.controller('host.views.cbs.release.index', [
        '$scope', '$uibModal','uiGridConstants', 'abp.services.app.release', 'appSession', 'utilities',
        function ($scope, $uibModal, uiGridConstants, releaseService, appSession, utilities) {

            var vm = this;
            vm.releases = [];
            //Access Permission
            vm.permissions = {
                release: abp.auth.hasPermission('Pages.CBS.Release')
            };

            vm.allowDateRange = false;
            // vm.filterText = $stateParams.filterText || null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.filters = {
                isReleased: null,
                maxResultCount: app.consts.grid.defaultPageSize,
                searchTerm: "",
            };
            vm.releaseStatuses = [


                { name: "Pending", value: false },
                { name: "Released", value: true }

            ];

            vm.getReleaseApplications = function (releaseApplication) {
                 if (releaseApplication === 1)
                     return "Speed Main";
                else if (releaseApplication === 2)
                     return "Speed Aljazriah";
                else if (releaseApplication === 3)
                     return "Speed KSA";
                else if (releaseApplication === 4)
                     return "Speed EC And UAE";
                else if (releaseApplication === 5)
                     return "CRS Android";
                else if (releaseApplication === 6)
                     return "VMI Android";
            };
         
            vm.loading = false;
            vm.viewReleaseTasks = function (id) {
                var modalInstance=$uibModal.open({
                    templateUrl: '~/App/host/views/cbs/release/viewReleaseTasks.cshtml',
                    controller: 'host.views.cbs.release.viewReleaseTasks as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {

                        releaseId: id

                    }
                });
                modalInstance.result.then(function () {
                    vm.getReleases();

                });
            };

            vm.releasedMark = function (release) {
                vm.loading = true;
                abp.message.confirm(
                    app.localize('Do you want to Mark As Released?',),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            release.isReleased = true;
                            releaseService.editRelease(release).success(function (result) {
                                abp.notify.info(app.localize('Marked Successfully!'));
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.uncloseReleasedMark = function (release) {
                vm.loading = true;
                abp.message.confirm(
                    app.localize('Do you want to Mark Release As Unclosed?',),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            release.isReleased = false;
                            releaseService.editRelease(release).success(function (result) {
                                abp.notify.info(app.localize('Unclosed Successfully!'));
                                vm.loading = false;
                            });
                        }
                    }
                );
            };


            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
               // useExternalSorting: true,
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
                            '      <li><a  ng-click="grid.appScope.viewReleaseTasks(row.entity.id)">View</a></li>' +
                            '      <li><a  ng-click="grid.appScope.openEditReleaseModal(row.entity)">Edit</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.release" target="_blank" ng-href="Application#/host/cbs/releaseNotes/{{ row.entity.id  }}">Release Notes</a></li>' +
                            '      <li><a ng-if="!row.entity.isReleased" ng-click="grid.appScope.releasedMark(row.entity)">Mark As Released</a></li>' +
                            '      <li><a ng-if="row.entity.isReleased" ng-click="grid.appScope.uncloseReleasedMark(row.entity)">Unclose Release</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    
                    {
                        name: 'Id',
                        field: 'id'
                    },
                    {
                        name: 'Application',
                        field: 'releaseApplication',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getReleaseApplications(row.entity.releaseApplication)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Title',
                        field: 'name'
                    },
                    {
                        name: 'Release Date',
                        field: 'releaseDate',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getLocalDate(row.entity.releaseDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Status',
                        field: 'isReleased',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"row.entity.isReleased===true\" class=\"badge badge-success\">Released</span>'+
                            '<span ng-if=\"row.entity.isReleased===false\" class=\"badge badge-warning\">Pending</span></div>' +
                            '</div>'
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

                        vm.getDueTasks();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getReleases();
                    });
                },
                data: []
            };
           
            vm.openCreateReleaseModal = function () {
                
                

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/release/createReleaseModal.cshtml',
                    controller: 'host.views.cbs.release.createOrEditRelease as vm',
                    backdrop: 'static',
                    resolve: {
                        release: { id: 0, name: '', releaseDate: null, releaseApplication: null }
                    }
                    
                });
                modalInstance.result.then(function () {
                    vm.getReleases();

                });
            };
            vm.openEditReleaseModal = function (release) {



                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/release/createReleaseModal.cshtml',
                    controller: 'host.views.cbs.release.createOrEditRelease as vm',
                    backdrop: 'static',
                    resolve: {
                        release: release
                    }

                });
                modalInstance.result.then(function () {
                    vm.getReleases();

                });
            };


            vm.getLocalDate = function (date) {
                console.log("local date");
                console.log(date);
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };


            vm.getReleases = function () {

                vm.loading = true;
                
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                

                releaseService.getReleases(vm.filters).success(function (result) {
                  //  vm.releases = data;
                    
                    vm.gridOptions.data = result.items;
                    vm.gridOptions.totalItems = result.totalCount;


                }).finally(function () {
                    vm.loading = false;
                });
                
                
            };
            $scope.$watch('vm.filters.searchTerm', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (vm.searchTimeout) {
                        clearTimeout(vm.searchTimeout);
                    }
                    vm.searchTimeout = setTimeout(function () {
                        $scope.$apply(function () {
                            vm.getReleases();
                        });
                    },200);
                }
            });
            $scope.$watch('vm.filters.isReleased', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.getReleases();
                }
            });

            function init() {
                
                vm.getReleases();
            }

            init();
        }
    ]);
