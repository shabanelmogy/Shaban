// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:35826-36034
appModule.controller('host.views.cbs.meetings.index', ['$scope', '$uibModal', 'uiGridConstants',
        'abp.services.app.directory', 'abp.services.app.meeting',
        function ($scope, $uibModal, uiGridConstants, directoryService, meetingService) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.CBS.Meetings'),
                create: abp.auth.hasPermission('Pages.CBS.Meetings.AddNew'),
                edit: abp.auth.hasPermission('Pages.CBS.Meetings.Edit'),
                'delete': abp.auth.hasPermission('Pages.CBS.Meetings.Delete')
            };

            vm.filters = {
                title: '',
                tenantId: '',
                companyId: null,
                fromDate: null,
                toDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

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



            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY HH:mm');
                }
                else {
                    return "";
                }
            };
            vm.createMeeting = function () {
                openCreateOrEditMeetingModal(null);
            };


            function openCreateOrEditMeetingModal(meetingId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/meetings/createOrEditMeetingModal.cshtml',
                    controller: 'host.views.cbs.meetings.createOrEditMeetingModal as vm',
                    backdrop: 'static',
                    resolve: {
                        meetingId: function () {
                            return meetingId;
                        }
                    },
                    size: 'xl'
                });

                modalInstance.result.then(function (result) {
                    vm.getMeetings();
                });
            }

            vm.getMeetings = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                meetingService.getMeetings(vm.filters).success(function (data) {
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
                            //'      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewProject(row.entity)">' + app.localize('View') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editProject(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteProject(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.openMinutesOfMeetingModal(row.entity)"> ' + app.localize('View') + '</a></li>' +
                        '      <li><a  target="_blank" href="/Report#/printModalMeeting/{{row.entity.id}}" >' + app.localize('Print') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Meeting Id',
                        field: 'id',
                        width: '10%',
                    },
                    {
                        name: 'Title',
                        field: 'title',
                        width: '25%'
                    },
                    {
                        name: 'DateAndTime',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getlocalDateTime(row.entity.creationTime)}}</div>',
                        width: '15%'
                    },
                    {
                        name: 'Tenant',
                        field: 'project.tenant.tenancyName',
                        width: '20%',

                    },
                    {
                        name: 'Company',
                        field: 'project.company.companyName',
                        width: '25%',
                    },
                     {
                         name: 'Project',
                         field: 'project.title',
                         width: '25%',
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

                        vm.getMeetings();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getMeetings();
                    });
                },
                data: []
            };

            vm.openMinutesOfMeetingModal = function (meeting) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/meetings/minutesOfMeetingsViewModel.cshtml',
                    controller: 'host.views.cbs.meetings.minutesOfMeetingViewModel as vm',
                    backdrop: 'static',
                    resolve: {
                        meeting: function () {
                            return meeting;
                        }
                    },
                    size: 'md'
                });

                modalInstance.result.then(function (result) {
                    vm.getMeetings();
                });
            }
        }
    ]);
