// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:435693-436291
appModule.controller('tenant.views.hrm.attendance.updateAttendanceModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.attendance', 'abp.services.app.tariffGroup', 'uiGridConstants', 'options', 'utilities',
            function ($scope, $uibModal, $uibModalInstance, directoryService, attendanceService, tariffGroupService, uiGridConstants, options, utilities) {

                var vm = this;
                vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
                vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
                vm.timeFormat = "HH";
                vm.attendanceEntries = [];
                //vm.filters = {
                //    keyword: '',
                //    contactType: options.type,
                //    activeOnly: true,
                //    isOnlyCorporate: options.isOnlyCorporate,
                //    companyId: options.companyId,
                //    contactCategory: options.category,
                //    skipCount: 0,
                //    maxResultCount: app.consts.grid.defaultPageSize,
                //};
                vm.filters = {
                    //enableDateRange: true,
                    //startDate: null,
                    //endDate: null,
                    staffId: null,
                    date: moment().startOf('day'),
                    //skipCount: 0,
                    //maxResultCount: app.consts.grid.defaultPageSize,
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

                vm.addLog = function (row) {

                    if (!row.attendanceLogs) {
                        row.attendanceLogs = [];
                    }

                    row.attendanceLogs.push({
                        checkInTime: null,
                        checkOutTime: null,
                        uiId: Date.now().toString(36) + Math.random().toString(36).substr(2, 5) // unique ID

                    });

                    // DO NOT recalc yet
                };
                vm.removeLog = function (row, index) {
                    row.attendanceLogs.splice(index, 1);

                    vm.calculateOvertime(row); // ?? recalc
                };
                vm.getlocalTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.timeFormat);
                    }
                    else {
                        return "";
                    }
                };
                vm.clearStaff = function () {
                    vm.filters.staff = null;
                    vm.filters.staffId = null;
                };
                vm.searchContacts = function () {
                    vm.loading = true;
                    return directoryService.searchDirectoryPaged(vm.filters)
                        .then(function (response) {
                            vm.gridOptions.totalItems = response.data.totalCount;
                            vm.gridOptions.data = response.data.items;
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };
                vm.searchAttendance = function () {
                    vm.loading = true;
                    if (vm.filters.staff != null) {
                        vm.filters.staffId = vm.filters.staff.id;
                    }
                    return attendanceService.getAttendanceForUpdate(vm.filters)
                        .then(function (response) {
                            vm.gridOptions.totalItems = response.data.totalCount;
                            vm.gridOptions.data = response.data.items;

                            (vm.gridOptions.data || []).forEach(function (row) {
                                (row.attendanceLogs || []).forEach(function (log) {
                                    if (!log.uiId) {
                                        log.uiId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                                    }
                                });
                            });

                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };
                vm.onLogChange = function (row) {
                    vm.calculateOvertime(row);
                };

                vm.isAbsentChanged = function (row) {

                    if (row.isAbsent) {
                        // Save a backup of logs as hours/minutes (local time)
                        row._backupLogs = (row.attendanceLogs || []).map(function (log) {
                            return {
                                checkInTime: log.checkInTime ? moment(log.checkInTime).format("HH:mm") : null,
                                checkOutTime: log.checkOutTime ? moment(log.checkOutTime).format("HH:mm") : null,
                                uiId: log.uiId || (Date.now().toString(36) + Math.random().toString(36).substr(2, 5))
                            };
                        });

                        // Clear logs for absent
                        row.attendanceLogs = [];
                    } else {
                        // Restore logs from backup using today's date + stored time
                        row.attendanceLogs = (row._backupLogs || []).map(function (log) {
                            function makeDateFromTime(timeStr) {
                                if (!timeStr) return null;
                                let now = new Date(); // today
                                let parts = timeStr.split(":");
                                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(parts[0]), parseInt(parts[1]));
                            }

                            return {
                                checkInTime: makeDateFromTime(log.checkInTime),
                                checkOutTime: makeDateFromTime(log.checkOutTime),
                                uiId: log.uiId || (Date.now().toString(36) + Math.random().toString(36).substr(2, 5))
                            };
                        });

                        // If no logs exist after restore, create one empty log
                        if (row.attendanceLogs.length === 0) {
                            row.attendanceLogs.push({
                                checkInTime: null,
                                checkOutTime: null,
                                uiId: Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
                            });
                        }

                        // Clean up backup
                        delete row._backupLogs;
                    }

                    // Recalculate working hours & overtime
                    vm.calculateOvertime(row);
                };
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                vm.calculateOvertime = function (row) {

                    let shift = row.shift || {};
                    let shiftHours = shift.totalHours || 0;

                    let isOTSlot = shift.isTimeSlotAlwaysCalcOT;
                    let isEligibleForOT = shift.isEligibleForOverTime;

                    let otStart = shift.otSlotStartTime ? moment(shift.otSlotStartTime) : null;
                    let otEnd = shift.otSlotEndTime ? moment(shift.otSlotEndTime) : null;

                    let totalWorkMinutes = 0;
                    let fixedOTMinutes = 0;

                    // =========================
                    // STEP 1: LOOP LOGS
                    // =========================
                    (row.attendanceLogs || []).forEach(function (l) {

                        if (!l.checkInTime || !l.checkOutTime) return;

                        let inTime = moment(l.checkInTime);
                        let outTime = moment(l.checkOutTime);

                        let inM = inTime.hours() * 60 + inTime.minutes();
                        let outM = outTime.hours() * 60 + outTime.minutes();

                        // handle cross midnight
                        if (outM < inM) outM += 24 * 60;

                        let workMinutes = outM - inM;

                        totalWorkMinutes += workMinutes;

                        // =========================
                        // STEP 2: FIXED OT CALCULATION
                        // =========================
                        if (isOTSlot && otStart && otEnd) {

                            let otS = otStart.hours() * 60 + otStart.minutes();
                            let otE = otEnd.hours() * 60 + otEnd.minutes();

                            // cross midnight slot
                            if (otE < otS) otE += 24 * 60;

                            let start = Math.max(inM, otS);
                            let end = Math.min(outM, otE);

                            let overlap = end - start;

                            if (overlap > 0) {
                                fixedOTMinutes += overlap;
                            }
                        }
                    });

                    // =========================
                    // STEP 3: WORKING HOURS (REAL)
                    // =========================
                    let workingHours = totalWorkMinutes / 60;

                    // =========================
                    // STEP 4: NORMAL OT CALCULATION
                    // =========================

                    // remove fixed OT from normal flow
                    let remainingMinutes = totalWorkMinutes - fixedOTMinutes;

                    if (remainingMinutes < 0) remainingMinutes = 0;

                    let normalOTMinutes = 0;
                    let holidayOTMinutes = 0;

                    if (isEligibleForOT) {

                        if (vm.isHoliday(row)) {
                            //normalOTMinutes = remainingMinutes;
                            holidayOTMinutes = remainingMinutes;
                        } else {

                            let extraAfterShift = remainingMinutes - ((shiftHours || 0) * 60);
                            if (extraAfterShift > 0) {
                                normalOTMinutes = extraAfterShift;
                            }
                        }
                    }

                    // =========================
                    // STEP 5: FINAL VALUES
                    // =========================
                    let fixedOT = fixedOTMinutes / 60;
                    let normalOT = normalOTMinutes / 60;
                    let holidayOT = holidayOTMinutes / 60;

                    let totalOT = fixedOT + normalOT + holidayOT;

                    row.workingHours = workingHours.toFixed(2);
                    row.overtime = totalOT.toFixed(2);

                    // optional debug fields
                    row.overtimeNormal = normalOT.toFixed(2);
                    row.overtimeFixed = fixedOT.toFixed(2);
                    row.overtimeHoliday = holidayOT.toFixed(2);


                };
                vm.normalizeAttendanceLogDates = function (row) {

                    if (!row.date || !row.attendanceLogs)
                        return;

                    const attendanceDate = moment(row.date);

                    angular.forEach(row.attendanceLogs, function (log) {

                        let checkInDate = null;

                        // CHECK-IN
                        if (log.checkInTime) {

                            const checkIn = moment(log.checkInTime);

                            checkInDate = attendanceDate.clone()
                                .hour(checkIn.hour())
                                .minute(checkIn.minute())
                                .second(0)
                                .millisecond(0);

                            log.checkInTime = checkInDate.toDate();
                        }

                        // CHECK-OUT
                        if (log.checkOutTime) {

                            const checkOut = moment(log.checkOutTime);

                            const checkOutDate = attendanceDate.clone()
                                .hour(checkOut.hour())
                                .minute(checkOut.minute())
                                .second(0)
                                .millisecond(0);

                            // CROSS MIDNIGHT
                            if (checkInDate && checkOutDate.isBefore(checkInDate)) {
                                checkOutDate.add(1, 'day');
                            }

                            log.checkOutTime = checkOutDate.toDate();
                        }

                    });
                };
                vm.isHoliday = function (row) {

                    if (!row) return false;

                    var dayToCheck = vm.getlocalDay(row.date);

                    var holidays = row.holidays || [];
                    var shift = row.shift || {};
                    var weekendDays = shift.weekendDays || [];

                    var isDateInHolidays = holidays.some(function (holiday) {
                        return vm.getlocalDateOfMonth(holiday.date) === vm.getlocalDateOfMonth(row.date);
                    });

                    var mappedWeekendDays = weekendDays.map(function (weekendDay) {
                        return {
                            dayOfWeek: weekendDay.dayOfWeek,
                            dayValue: mapNumberToDay(weekendDay.dayOfWeek),
                        };
                    });

                    shift.weekendDays = mappedWeekendDays;
                    row.shift = shift;

                    var dayExists = mappedWeekendDays.some(function (day) {
                        return day.dayValue === dayToCheck;
                    });

                    if (dayExists || isDateInHolidays) {
                        row.isHolidayOT = true;
                        return true;
                    }

                    return false;
                };
                vm.getlocalDay = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('dddd');
                    }
                    else {
                        return "";
                    }
                };
                vm.getlocalDateOfMonth = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.dateOfMonthFormat);
                    }
                    else {
                        return "";
                    }
                };
                function mapNumberToDay(number) {
                    switch (number) {
                        case 1:
                            return 'Monday';
                        case 2:
                            return 'Tuesday';
                        case 3:
                            return 'Wednesday';
                        case 4:
                            return 'Thursday';
                        case 5:
                            return 'Friday';
                        case 6:
                            return 'Saturday';
                        case 7:
                            return 'Sunday';
                        default:
                            return 'Unknown Day';
                    }
                }

                vm.updateAttendance = function () {
                    vm.saving = true;
                    vm.attendanceEntries = vm.gridOptions.data;

                    angular.forEach(vm.attendanceEntries, function (row) {
                        vm.normalizeAttendanceLogDates(row); // set attendance log dates according to date

                        row.description = JSON.stringify({
                            overtime: row.overtime,
                            overtimeFixed: row.overtimeFixed,
                            overtimeNormal: row.overtimeNormal,
                            overtimeHoliday: row.overtimeHoliday
                        });

                    });

                    attendanceService.updateStaffAttendance({
                        attendanceViewLists: vm.attendanceEntries, attendanceDate: vm.filters.date
                    }
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });

                };

                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                    'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete')
                };

                vm.gridOptions = {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: app.consts.grid.defaultPageSize,
                    useExternalPagination: true,
                    appScopeProvider: vm,
                    columnDefs: [
                        //{
                        //    name: app.localize('Actions'),
                        //    enableSorting: false,
                        //    width: 100,
                        //    cellTemplate:
                        //        '<div class=\"ui-grid-cell-contents\">' +
                        //        '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                        //        '    <button class="btn btn-xs btn-primary blue"  aria-haspopup="true" ng-click="grid.appScope.contactSelected(row.entity)" ><i class="fa fa-check"></i></button>' +
                        //        '    <button  ng-if="row.entity.contactType ==2 && row.entity.contactCategory == 1" class="btn btn-xs btn-default"  aria-haspopup="true" ng-click="grid.appScope.contactEdit(row.entity)" ><i class="fa fa-edit"></i></button>' +
                        //        '  </div>' +
                        //        '</div>'
                        //},
                        {
                            name: app.localize('CheckInTime'),
                            field: 'checkInTime',
                            cellTemplate:
                                '<div class="ui-grid-cell">' +
                                '   <div class="form-group">' +
                                '       <input class="form-control" datetimepicker options="{format: \'DD/MM/YYYY HH:mm\'}" ng-model="row.entity.checkInTime" />' +
                                '   </div>' +
                                '</div>'


                        },
                        {
                            name: app.localize('CheckOutTime'),
                            field: 'checkOutTime',
                            cellTemplate:
                                '<div class="ui-grid-cell">' +
                                '   <div class="form-group">' +
                                '       <input class="form-control" datetimepicker options="{format: \'DD/MM/YYYY HH:mm\'}" ng-model="row.entity.checkOutTime" />' +
                                '   </div>' +
                                '</div>'
                        },
                        {
                            name: app.localize('Name'),
                            field: 'name',
                            width: 200,
                            cellTemplate:
                                '<div class=\"ui-grid-cell\">' +
                                '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getNameWithCode(row.entity)}} <span  style="color:red;" ng-show="grid.appScope.isVipCustomer && row.entity.isVip">*</span></div>' +
                                '</div>'
                        },
                        {
                            name: app.localize('MobileNo'),
                            field: 'mobileNo'
                        },

                        {
                            name: app.localize('ContactNo'),
                            field: 'contactNo',
                            cellTemplate:
                                '<div class=\"ui-grid-cell\">' +
                                '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getContactsList(row.entity)}}</div>' +
                                '</div>'
                        },

                    ],
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;
                        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                            if (!sortColumns.length || !sortColumns[0].field) {
                                vm.filters.sorting = "id desc";
                            } else {
                                vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                            }
                            vm.searchContacts();
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                            vm.filters.skipCount = (pageNumber - 1) * pageSize;
                            vm.filters.maxResultCount = pageSize;
                            vm.searchContacts();
                        });
                    },
                    data: []
                };
                vm.searchStaff = function ($select) {
                    //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                    return directoryService.search({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                        vm.staffs = response.data.items;
                    });
                };
                vm.showAddContact = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/contacts/createOrEditModal.cshtml',
                        controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            personId: function () {
                                return null;
                            },
                            isFromSearchScreen: function () {
                                return true;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {

                        var fullName = result.firstName;
                        if (result.middleName) fullName += ' ' + result.middleName;
                        fullName += ' ' + result.lastName;
                        vm.filters.keyword = fullName;
                        vm.searchContacts();
                    });
                };

                vm.contactSelected = function (contact) {
                    $uibModalInstance.close(contact);
                };

                vm.contactEdit = function (contact) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/contacts/createOrEditModal.cshtml',
                        controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            personId: function () {
                                return contact.id;
                            },
                            isFromSearchScreen: function () {
                                return false;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        vm.searchContacts();
                    });
                };

                vm.getContactsList = function (contact) {
                    var contactList = '';
                    if (contact != null) {

                        if (contact.contactNo != null)
                            contactList = contact.contactNo;

                        if (contact.contactNo2 != null)
                            contactList = contactList + ', ' + contact.contactNo2;
                        return contactList;
                    }
                    else {
                        return "";
                    }
                };
                vm.getNameWithCode = function (contact) {
                    var namewithcode = '';
                    if (contact.code != null)
                        namewithcode = contact.name + '   (' + contact.code + ')';
                    else
                        namewithcode = contact.name;

                    return namewithcode;
                };

                //vm.searchContacts();
                //vm.searchAttendance();

            }]);
