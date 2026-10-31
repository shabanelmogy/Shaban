// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436940-437211
appModule.controller('tenant.views.common.hrm.holiday.index', [
        '$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.holiday',
        function ($scope, $uibModal, directoryService, uiGridConstants,  holidayService) {

            var vm = this;

            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.HRM.CalendarHoliday.View'),
                create: abp.auth.hasPermission('Pages.HRM.CalendarHoliday.AddNew'),
                edit: abp.auth.hasPermission('Pages.HRM.CalendarHoliday.Edit'),
                delete: abp.auth.hasPermission('Pages.HRM.CalendarHoliday.Delete')
            };

            vm.filters = {
                enableDateRange: true,
                startDate: null,
                endDate: null,
                staffId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.statuses = null;
            vm.types = null;
            vm.staffs = [];

            //functions
            vm.getHolidays = function () {
                vm.loading = true;

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.staff != null) {
                    vm.filters.staffId = vm.filters.staff.id;
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                holidayService.getHolidays(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.clearStaff = function () {
                vm.filters.staff = null;
                vm.filters.staffId = null;
            };

            vm.searchStaff = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffs = response.data.items;
                });
            };

            vm.searchStaffPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 1;
                        }
                    }
                }).result.then(function (staff) {
                    if (staff != null) {
                        vm.filters.staff = staff;
                    }
                });
            };

            vm.createHoliday = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/holiday/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.holiday.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                id: null
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getHolidays();
                });
            };

            vm.editHoliday = function (holiday) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/holiday/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.holiday.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                id: holiday.id
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getHolidays();
                });
            };

            vm.viewHoliday = function (holiday) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/holiday/viewModal.cshtml',
                    controller: 'tenant.views.hrm.holiday.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                id: holiday.id
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getHolidays();
                });
            };

            vm.deleteHoliday = function (holiday) {
                abp.message.confirm(
                    app.localize('DeleteHolidayMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            holidayService.deleteHoliday({
                                id: holiday.id
                            }).success(function () {
                                vm.getHolidays();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getStatus = function (status) {
                if (status == 0) {
                    return app.localize("Not Completed");
                } else if (status == 1) {
                    return app.localize("Completed");
                } else {
                    return "";
                }
            };

          

            //init
            function init() {
                initDate();
                vm.getHolidays();
            }

            init();

            //grid 
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
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewHoliday(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit"  ng-click="grid.appScope.editHoliday(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteHoliday(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name',
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getHolidays();
                    });
                },
                data: []
            };
        }
    ]);
