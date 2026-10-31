// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:27183-27474
appModule.controller('common.views.messageLogs.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.messageLog',
        function ($scope, $uibModal, uiGridConstants, messageLogService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.filters = {
                enableDateRange: true,
                status: null,
                type: null,
                subject: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            function dateRangeCheck() {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            }

            vm.getMessageType = function(type) {
                if (type == 1) {
                    return app.localize("Email");
                } else {
                    return app.localize("Sms");
                }      
            };
            vm.getMessageStatus = function (type) {
                if (type == 1) {
                    return app.localize("Delivered");
                } else if (type == 2) {
                    return app.localize("Rejected");
                }      
            };
            function getTypes() {
                vm.types = [
                    { id: 1, name: app.localize("Email") },
                    { id: 2, name: app.localize("Sms") }
                ];
            };
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Delivered") },
                    { id: 2, name: app.localize("Rejected") }
                ];
            };
            function getSubjects() {
                vm.subjects = [
                    { id: "SMS", name: "SMS" },
                    { id: "Birthday SMS Alert", name: "Birthday SMS Alert" },
                    { id: "Promotion SMS Alert", name: "Promotion SMS Alert" },
                    { id: "New Fine SMS Alert", name: "New Fine SMS Alert" },
                    { id: "New Invoice SMS Alert", name: "New Invoice SMS Alert" },
                    { id: "Traffic Fine SMS Alert", name: "Traffic Fine SMS Alert" },
                    { id: "New Traffic Fine Invoice SMS Alert", name: "New Traffic Fine Invoice SMS Alert" },
                    { id: "Send OTP to driver for login", name: "Send OTP to driver for login" },
                    { id: "Send OTP to customer for Login", name: "Send OTP to customer for Login" },
                    { id: "Agreement Opening SMS Alert", name: "Agreement Opening SMS Alert" },
                    { id: "Agreement Closing SMS Alert", name: "Agreement Closing SMS Alert" },
                ];
            };
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
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
                        name: ' ',
                        width: "4%",
                        enableSorting: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.detail(row.entity)">' + app.localize('Detail') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        width: "10%",
                        field: 'type',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.getMessageType(row.entity.type)}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Subject'),
                        field: 'subject',
                        width: "30%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.subject}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactName'),
                        field: 'contactName',
                        width: "20%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.contactName}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DateTime'),
                        width: "20%",
                        field: 'creationTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.creationTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('From'),
                        field: 'from',
                        width: "30%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.from}}' +
                            '</div>'
                    },
                    {
                        name: app.localize('To'),
                        width: "30%",
                        field: 'to',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.to}}' +
                            '</div>'
                    },
                    {
                        name: app.localize('Cc'),
                        field: 'cc',
                        width: "30%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.cc}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getMessageStatus(row.entity.status)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MessageError'),
                        field: 'error',
                        width: "30%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.error}}</div>' +
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
                        vm.getMeassageLog();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getMeassageLog();
                    });
                },
                data: []
            };

            vm.getMeassageLog = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.loading = true;
                messageLogService.getMessageLog(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate === null && !vm.dateRangeModel.startDate === null))
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.detail = function (row) {
                abp.message.info(
                    app.localize(row.detail, 'Detail')
                );
            };
            vm.report = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/common/views/messageLogs/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                messageLogService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            initDate();
            getTypes();
            getStatuses();
            getSubjects();
            vm.getMeassageLog();

        }
    ]);
