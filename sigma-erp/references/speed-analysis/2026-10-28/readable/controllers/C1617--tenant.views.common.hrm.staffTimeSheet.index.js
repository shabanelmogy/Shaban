// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:443786-444136
appModule.controller('tenant.views.common.hrm.staffTimeSheet.index', [
        '$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.shift', 'abp.services.app.staffTimeSheet',
        function ($scope, $uibModal, directoryService, uiGridConstants, shiftService, staffTimeSheetService) {

            var vm = this;

            vm.loading = false;
            vm.isBiometricAttendanceEnabled = abp.features.isEnabled('HRM.BiometricAttendance');

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat;
            //'DD/MM/YYYY HH:mm';
            vm.timeFormat = "HH:mm";

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.HRM.StaffTimeSheet.View'),
                create: abp.auth.hasPermission('Pages.HRM.StaffTimeSheet.AddNew'),
                edit: abp.auth.hasPermission('Pages.HRM.StaffTimeSheet.Edit'),
                delete: abp.auth.hasPermission('Pages.HRM.StaffTimeSheet.Delete')
            };

            vm.filters = {
                enableDateRange: true,
                startDate: null,
                endDate: null,
                monthYear: new Date(),
                staffId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.statuses = null;
            vm.types = null;
            vm.staffs = [];

            //functions
            vm.getStaffTimeSheetLines = function () {
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

                staffTimeSheetService.getStaffTimeSheets(vm.filters).success(function (data) {

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

            vm.getlocalDateTime = function (date, format) {

                vm.format = null;
                if (format)
                    vm.format = format;
                if (!vm.format)
                    vm.format = vm.dateFormat;
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.format);
                }
                else {
                    return "";
                }
            };
            //vm.getlocalDateTime = function (date) {
            //    if (date != null) {
            //        var localTime = moment.utc(date).toDate();
            //        return moment(localTime).format(vm.dateTimeFormat);
            //    }
            //    else {
            //        return "";
            //    }
            //};
            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.timeFormat);
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

            function updateStaffTimeSheet(category, type, isOnlyCorporate = false) {
                var companyIdToForward = null;
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/staffTimeSheet/updateStaffTimeSheetModal.cshtml',
                    controller: 'tenant.views.hrm.staffTimeSheet.updateStaffTimeSheetModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: companyIdToForward
                            }
                        }
                    }
                });
                //modalInstance.result.then(function (result) {
                //    vm.getStaffTimeSheetLines();
                //});
            };

            vm.editShift = function (shift) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/shift/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.shift.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                id: shift.id
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStaffTimeSheetLines();
                });
            };

            vm.viewAttendace = function (attendance) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/staffTimeSheet/viewModal.cshtml',
                    controller: 'tenant.views.hrm.staffTimeSheet.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        attendanceId: function () {
                            return attendance.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStaffTimeSheetLines();
                });
            };

            vm.deleteShift = function (shift) {
                abp.message.confirm(
                    app.localize('DeleteShiftMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            shiftService.deleteShift({
                                id: shift.id
                            }).success(function () {
                                vm.getStaffTimeSheetLines();
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
            vm.importBiometricAttendancePopup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/staffTimeSheet/importBiometricAttendanceModal.cshtml',
                    controller: 'tenant.views.hrm.staffTimeSheet.importBiometricAttendanceModal as vm',
                    backdrop: 'static',
                    size: 'md'
                }).result.then(function () {
                    vm.getStaffTimeSheetLines();
                });
            };

            vm.updateStaffTimeSheetPopup = function () {
                var modalInstance = updateStaffTimeSheet(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        //do here
                        vm.agreement.customer = result;
                        //vm.customerSelected();
                    }
                });
            };


            //init
            function init() {
                initDate();

                vm.getStaffTimeSheetLines();
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
                            '      <li><a ng-click="grid.appScope.viewAttendace(row.entity)">' + app.localize('View') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.edit"  ng-click="grid.appScope.editShift(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteShift(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'staff.name',
                    },
                    //{
                    //    name: app.localize('Code'),
                    //    field: 'Code',
                    //},
                    {
                        name: app.localize('Code'),
                        field: 'staff.code',
                    },
                    {
                        name: app.localize('Designation'),
                        field: 'staff.designationName',
                    },
                    {
                        name: app.localize('Shift'),
                        field: 'shift.name',
                    },
                    {
                        name: app.localize('Date'),
                        field: 'Date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },


                    //{
                    //    name: app.localize('Staff'),
                    //    field: 'staff.name',
                    //},
                    //{
                    //    name: app.localize('Designation'),
                    //    field: 'designation.name',
                    //},

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getStaffTimeSheetLines();
                    });
                },
                data: []
            };
        }
    ]);
