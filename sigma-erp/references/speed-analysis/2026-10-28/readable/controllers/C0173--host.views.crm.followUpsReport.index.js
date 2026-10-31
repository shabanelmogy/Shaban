// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64608-64760
appModule.controller('host.views.crm.followUpsReport.index', [
            '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.user', 'appSession', 'abp.services.app.deal',
            function ($scope, $uibModal, uiGridConstants, userService, appSession, dealService) {
                var vm = this;

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });

                vm.loading = false;
                vm.dateRangeOptions = app.createDateRangePickerOptions();
                vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

                vm.filters = {
                    skipCount: 0,
                    maxResultCount: app.consts.grid.defaultPageSize,
                    salesPersonUser: appSession.user,
                    salesPersonUserId: appSession.user.id,

                };
                vm.searchUsers = function ($select) {
                    if ($select.search == "")
                        return null;
                    userService.searchUsers({ keyword: $select.search }).then(function (response) {
                        vm.users = response.data.items;
                    });
                };
                vm.clearSalesPersonUser = function () {
                    vm.filters.salesPersonUserId = null;
                    vm.filters.salesPersonUser = null;
                };
                vm.dateRangeModel = {
                    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
                };
                vm.getFollowUpsReport = function () {
                    vm.loading = true;
                    //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                    //if null then get as following
                    //fromDate: get local date with time 00:00:00 and then convert to utc
                    //toDate: get local date of max time of night and then convert to utc
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    dealService.getFollowUpsReport(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });

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
                };
                vm.getlocalDate = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('YYYY-MM-DD ');
                    }
                    else {
                        return "";
                    }
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
                         //
                             name: 'Follow Up Date',
                             //field: 'creationTime',
                             cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.creationTime)}}<span title="Late Hours" ng-show="row.entity.hoursDifference>0"  class="label label-warning" style="margin-left:8px">{{row.entity.hoursDifference}} hrs</span></div>' +
                             //'<span>'+'{{row.entity.hoursDifference}}'+'</span>' +
                             '</div>'
                         },
                        {
                         name: 'By User',
                         field: 'deal.salesPersonUser.name'
                        },
                        {
                              name: 'Notes',
                              field: 'notes'
                       },
                     {
                         name: 'Company',
                         field: 'deal.company.companyName'
                     },
                       {
                           name: 'Title',
                           field: 'deal.title'
                       },
                     {
                         name: 'Edition',
                         field: 'deal.edition.displayName'
                     },
                       {
                           name: 'Next Follow Up Date',
                           field: 'nextFollowupDate',
                           cellTemplate:
                           '<div class=\"ui-grid-cell\">' +
                           '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.nextFollowupDate)}}</div>' +
                           '</div>'
                       },
                      {
                          name: 'Status',
                          field: 'dealStatus',
                          //cellTemplate:
                          //'<div class=\"ui-grid-cell\">' +
                          //'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDealStatus(row.entity.status)}}</div>' +
                          //'</div>'
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

                            vm.getFollowUpsReport();
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                            vm.filters.skipCount = (pageNumber - 1) * pageSize;
                            vm.filters.maxResultCount = pageSize;

                            vm.getFollowUpsReport();
                        });
                    },
                    data: []
                };

                vm.getFollowUpsReport();
            }
    ]);
