// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:444139-445089
appModule.controller('tenant.views.hrm.staffTimeSheet.updateStaffTimeSheetModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.staffTimeSheet', 'abp.services.app.tariffGroup', 'uiGridConstants', 'options', 'utilities',
            function ($scope, $uibModal, $uibModalInstance, directoryService, staffTimeSheetService, tariffGroupService, uiGridConstants, options, utilities) {

                var vm = this;
                vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
                vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
                var _minOTRaw = abp.setting.get("App.Speed.Hrm.MinimumOvertimeMinutesPerDay");
                var _minOTMinutes = (_minOTRaw && parseInt(_minOTRaw, 10) > 0) ? parseInt(_minOTRaw, 10) : null;
                vm.timeFormat = "HH";
                vm.dateOfMonthFormat = "DD ddd";
                vm.staffTimeSheetEntries = [];
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.saving = false;
                vm.isEligibleForOT = false;

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
                    monthYear: new Date(),
                    staffId: null,
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
                vm.getlocalTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.timeFormat);
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
                vm.clearStaff = function () {
                    vm.filters.staff = null;
                    vm.filters.staffId = null;
                    vm.gridOptions.data = null;
                    vm.isEligibleForOT = false;
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
                vm.getlocalDay = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('dddd');
                    }
                    else {
                        return "";
                    }
                };
                vm.removeLog = function (row, index) {
                    if (index === 0) return; // safety guard

                    row.attendanceLogs.splice(index, 1);
                    vm.calculateOvertime(row);
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
                vm.isHoliday = function (row) {
                    var dayToCheck = vm.getlocalDay(row.date);
                    var isDateInHolidays = false;
                    if (row.holidays.length > 0) {

                        isDateInHolidays = row.holidays.some(holiday => vm.getlocalDateOfMonth(holiday.date) === vm.getlocalDateOfMonth(row.date));
                    }
                    var mappedWeekendDays = row.shift.weekendDays.map(function (weekendDay) {
                        return {
                            dayOfWeek: weekendDay.dayOfWeek,
                            dayValue: mapNumberToDay(weekendDay.dayOfWeek),
                        };
                    });
                    row.shift.weekendDays = mappedWeekendDays;
                    const dayExists = row.shift.weekendDays.some(day => day.dayValue === dayToCheck);
                    if (dayExists || isDateInHolidays) {
                        row.isHolidayOT = true;
                        return true;
                    }
                    else {
                        return false;
                    }
                };
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
                vm.searchStaff = function ($select) {
                    //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                    return directoryService.search({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                        vm.staffs = response.data.items;
                    });
                };

                vm.getRowSpan = function (row) {
                    return (row.attendanceLogs && row.attendanceLogs.length)
                        ? row.attendanceLogs.length
                        : 1;
                };

                vm.searchstaffTimeSheet = function () {
                    vm.loading = true;
                    if (vm.filters.staff != null) {
                        vm.filters.staffId = vm.filters.staff.id;
                    }
                    return staffTimeSheetService.getStaffTimeSheetForUpdate(vm.filters)
                        .then(function (response) {
                            vm.gridOptions.totalItems = response.data.totalCount;
                            vm.gridOptions.data = response.data.items;

                            (vm.gridOptions.data || []).forEach(function (row) {
                                /* row.attendanceLogs = row.attendanceLogs || [];*/
                                row.attendanceLogs = Array.isArray(row.attendanceLogs)
                                    ? row.attendanceLogs
                                    : [];

                                if (row.attendanceLogs.length === 0) {
                                    row.attendanceLogs.push({
                                        checkInTime: null,
                                        checkOutTime: null,
                                    });
                                }

                                // Assign a unique uiId to each log
                                (row.attendanceLogs || []).forEach(function (log) {
                                    if (!log.uiId) {
                                        log.uiId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                                    }
                                });
                            });

                            //Check if eligible for overtime from shift

                            if (vm.gridOptions.data.length > 0 && vm.gridOptions.data[0].shift) {
                                vm.isEligibleForOT = vm.gridOptions.data[0].shift.isEligibleForOverTime;
                            }

                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                vm.updatestaffTimeSheet = function () {
                    vm.saving = true;
                    //vm.staffTimeSheetEntries = vm.gridOptions.data;

                    // deep copy so UI is not affected
                    vm.staffTimeSheetEntries = angular.copy(vm.gridOptions.data);
                    vm.staffTimeSheetEntries.forEach(row => {

                        vm.normalizeAttendanceLogDates(row);

                        if (row.isAbsent) {

                            // FORCE ABSENT STATE FOR DB
                            row.workingHours = 0;
                            row.overtime = 0;
                            row.overtimeFixed = 0;
                            row.overtimeNormal = 0;
                            row.overtimeHoliday = 0;

                            if (row.attendanceLogs && row.attendanceLogs.length) {

                                row.attendanceLogs.forEach(log => {

                                    log.checkInTime = null;
                                    log.checkOutTime = null;
                                });
                            }
                        }

                        if (!(row.overtime > 0 && row.isHolidayOT)) {
                            row.isHolidayOT = false;
                        }

                        // store overtime breakup in description
                        row.description = JSON.stringify({
                            overtime: row.overtime,
                            overtimeFixed: row.overtimeFixed,
                            overtimeNormal: row.overtimeNormal,
                            overtimeHoliday: row.overtimeHoliday
                        });

                    });
                    staffTimeSheetService.updateStaffTimeSheet({
                        staffTimeSheetViewLists: vm.staffTimeSheetEntries
                        //, staffTimeSheetDate: vm.staffTimeSheet.date
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
                //vm.calculateOvertime = function (row) {
                //    // Assuming row.shift.totalHours contains the total working hours for the shift

                //    // Parse time strings to minutes
                //    var checkInTime = parseTimeString(row.checkInTime);
                //    var checkOutTime = parseTimeString(row.checkOutTime);
                //    var checkInTime2 = parseTimeString(row.checkInTime2);
                //    var checkOutTime2 = parseTimeString(row.checkOutTime2);

                //    // Sum of both check-in and check-out times in minutes
                //    var workingMinutes = calculateDuration(checkInTime, checkOutTime) + calculateDuration(checkInTime2, checkOutTime2);

                //    // Convert working minutes to hours
                //    var workingHours = workingMinutes / 60;

                //    // Update working hours in the row
                //    row.workingHours = workingHours;

                //    // Calculate overtime
                //    var overtime = 0;
                //    if (vm.isEligibleForOT) {
                //        overtime = workingHours - row.shift.totalHours;
                //        if (vm.isHoliday(row)) {
                //            overtime = workingHours;
                //        }
                //        if (overtime < 0) {
                //            overtime = 0;
                //        }
                //    }
                //    else {
                //        if (row.workingHours >= row.shift.totalHours)
                //            row.workingHours = row.shift.totalHours;
                //    }

                //    if (row.workingHours < 0)
                //        row.workingHours = 0;

                //    row.workingHours = row.workingHours.toFixed(2);

                //    // Update overtime in the row
                //    row.overtime = overtime.toFixed(2);
                //};

                //vm.calculateOvertime = function (row) {
                //   /* if (row.checkInTime && row.checkOutTime) {*/
                //        var totalShiftDuration = 0;
                //        var workedDuration = 0;
                //        if (!row.shift.isFlexible) {
                //            var startTime = parseTimeString(row.shift.startTime);
                //            var endTime = parseTimeString(row.shift.endTime);
                //            totalShiftDuration = calculateDuration(startTime, endTime);
                //        }
                //        else {
                //            totalShiftDuration = row.shift.totalHours;
                //        }
                //        var checkInTime = parseTimeString(row.checkInTime);
                //        var checkOutTime = parseTimeString(row.checkOutTime);


                //        workedDuration = calculateDuration(checkInTime, checkOutTime);

                //        if (row.shift.isFlexible && row.checkInTime2 && row.checkOutTime2) {
                //            var checkInTime2 = parseTimeString(row.checkInTime2);
                //            var checkOutTime2 = parseTimeString(row.checkOutTime2);

                //            workedDuration += calculateDuration(checkInTime2, checkOutTime2);
                //        }

                //        if (workedDuration > totalShiftDuration) {
                //            var overtimeDuration = workedDuration - totalShiftDuration;
                //            var overtimeHours = Math.floor(overtimeDuration / 60);
                //            var overtimeMinutes = overtimeDuration % 60;

                //            // Update the overtime field
                //            row.overtime = String(overtimeHours).padStart(2, '0') + ':' + String(overtimeMinutes).padStart(2, '0');
                //        } else {
                //            // No overtime if worked duration is within the shift hours
                //            row.overtime = "00:00";
                //        }
                //    //} else {
                //    //    // Handle the case where either check-in or check-out time is missing
                //    //    row.overtime = "00:00";
                //    //}
                //};

                // Helper function to parse time string and convert it to minutes
                function parseTimeString(timeString) {
                    var date = new Date(timeString);
                    return date.getUTCHours() * 60 + date.getUTCMinutes();
                }

                // Helper function to calculate duration in minutes between two time values
                function calculateDuration(startTime, endTime) {
                    return endTime - startTime;
                }

                //vm.calculateOvertime = function (row) {
                //    if (row.checkInTime && row.checkOutTime) {
                //        var totalShiftDuration = 0;
                //        var workedDuration = 0;
                //        if (!row.shift.isFlexible) {
                //            var startTime = moment(row.shift.startTime, 'HH:mm');
                //            var endTime = moment(row.shift.endTime, 'HH:mm');
                //            startTime.set({ 'year': 2000, 'month': 0, 'date': 1 });
                //            endTime.set({ 'year': 2000, 'month': 0, 'date': 1 });
                //            totalShiftDuration = moment.duration(endTime.diff(startTime));
                //        }
                //        else {
                //            totalShiftDuration = row.shift.totalHours;
                //        }
                //        var checkInTime = moment(row.checkInTime, 'HH:mm');
                //        var checkOutTime = moment(row.checkOutTime, 'HH:mm');
                //        checkInTime.set({ 'year': 2000, 'month': 0, 'date': 1 });
                //        checkOutTime.set({ 'year': 2000, 'month': 0, 'date': 1 });
                //        workedDuration = moment.duration(checkOutTime.diff(checkInTime));

                //        if (row.shift.isFlexible && row.checkInTime2 && row.checkOutTime2) {
                //            var checkInTime2 = moment(row.checkInTime2, 'HH:mm');
                //            var checkOutTime2 = moment(row.checkOutTime2, 'HH:mm');
                //            workedDuration.add(moment.duration(checkOutTime2.diff(checkInTime2)));
                //        }

                //        if (workedDuration.asMinutes() > totalShiftDuration.asMinutes()) {
                //            var overtimeDuration = workedDuration.subtract(totalShiftDuration);
                //            var overtimeHours = Math.floor(overtimeDuration.asHours());
                //            var overtimeMinutes = overtimeDuration.minutes();

                //            // Update the overtime field
                //            row.overtime = String(overtimeHours).padStart(2, '0') + ':' + String(overtimeMinutes).padStart(2, '0');
                //        } else {
                //            // No overtime if worked duration is within the shift hours
                //            row.overtime = "00:00";
                //        }
                //    } else {
                //        // Handle the case where either check-in or check-out time is missing
                //        row.overtime = "00:00";
                //    }
                //};

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

                    // Apply minimum OT per day threshold if configured.
                    if (_minOTMinutes !== null) {
                        let totalOTMinutes = fixedOTMinutes + normalOTMinutes + holidayOTMinutes;
                        if (totalOTMinutes < _minOTMinutes) {
                            totalOT = 0;
                        }
                    }

                    row.workingHours = workingHours.toFixed(2);
                    row.overtime = totalOT.toFixed(2);

                    // optional debug fields
                    row.overtimeNormal = normalOT.toFixed(2);
                    row.overtimeFixed = fixedOT.toFixed(2);
                    row.overtimeHoliday = holidayOT.toFixed(2);

                };

                //vm.calculateOvertime = function (row) {

                //    let totalMinutes = 0;
                //    let overtime = 0;
                //    let fixSlotOT = 0;
                //    let shift = row.shift || {};
                //    let shiftHours = shift.totalHours || 0;

                //    let isOTSlot = shift.isTimeSlotAlwaysCalcOT;
                //    let isEligibleForOT = shift.isEligibleForOverTime;

                //    let otStart = shift.otSlotStartTime ? moment(shift.otSlotStartTime) : null;
                //    let otEnd = shift.otSlotEndTime ? moment(shift.otSlotEndTime) : null;

                //    (row.attendanceLogs || []).forEach(function (l) {

                //        if (l.checkInTime && l.checkOutTime) {

                //            let inTime = moment(l.checkInTime);
                //            let outTime = moment(l.checkOutTime);

                //            // =========================================
                //            // 1. WORKING HOURS (your original logic)
                //            // =========================================
                //            let inMinutes = inTime.hours() * 60 + inTime.minutes();
                //            let outMinutes = outTime.hours() * 60 + outTime.minutes();

                //            let diff = outMinutes - inMinutes;

                //            if (diff < 0) diff += 24 * 60;

                //            totalMinutes += diff;

                //            // =========================================
                //            // 2. OT SLOT ADDITION (NEW LOGIC)
                //            // =========================================
                //            if (isEligibleForOT && isOTSlot && otStart && otEnd) {

                //                let inM = inTime.hours() * 60 + inTime.minutes();
                //                let outM = outTime.hours() * 60 + outTime.minutes();

                //                let otS = otStart.hours() * 60 + otStart.minutes();
                //                let otE = otEnd.hours() * 60 + otEnd.minutes();

                //                if (otE < otS) otE += 24 * 60;

                //                if (outM < inM) outM += 24 * 60;

                //                let start = Math.max(inM, otS);
                //                let end = Math.min(outM, otE);

                //                let otDiff = end - start;

                //                if (otDiff > 0) {
                //                    fixSlotOT += otDiff / 60;
                //                }
                //            }
                //        }
                //    });

                //    // =========================================
                //    // 3. WORKING HOURS
                //    // =========================================
                //    let workingHours = totalMinutes / 60;

                //    if (workingHours < 0) workingHours = 0;

                //    // =========================================
                //    // 4. NORMAL OVERTIME LOGIC (UNCHANGED)
                //    // =========================================
                //    if (vm.isEligibleForOT) {

                //        overtime += (workingHours - shiftHours);

                //        if (vm.isHoliday(row)) {
                //            overtime = workingHours;
                //        }

                //        if (overtime < 0) overtime = 0;

                //    } else {

                //        if (workingHours >= shiftHours) {
                //            workingHours = shiftHours;
                //        }
                //    }

                //    if (workingHours < 0) workingHours = 0;
                //    if (overtime < 0) overtime = 0;

                //    row.workingHours = workingHours.toFixed(2);
                //    row.overtime = overtime + fixSlotOT;
                //    row.overtime = overtime.toFixed(2);
                //};


                //vm.calculateOvertime = function (row) {

                //    let totalMinutes = 0;
                //    (row.attendanceLogs || []).forEach(function (l) {

                //        if (l.checkInTime && l.checkOutTime) {

                //            let inTime = moment(l.checkInTime);
                //            let outTime = moment(l.checkOutTime);

                //            let inMinutes = inTime.hours() * 60 + inTime.minutes();
                //            let outMinutes = outTime.hours() * 60 + outTime.minutes();

                //            let diff = outMinutes - inMinutes;

                //            if (diff < 0) {
                //                diff += 24 * 60;
                //            }

                //            totalMinutes += diff;
                //        }
                //    });

                //    let workingHours = totalMinutes / 60;
                //    if (workingHours < 0) workingHours = 0;

                //    let overtime = 0;
                //    let shiftHours = (row.shift && row.shift.totalHours) ? row.shift.totalHours : 0;

                //    if (vm.isEligibleForOT) {

                //        overtime = workingHours - shiftHours;

                //        if (vm.isHoliday(row)) {
                //            overtime = workingHours;
                //        }

                //        if (overtime < 0) {
                //            overtime = 0;
                //        }

                //    } else {

                //        if (workingHours >= shiftHours) {
                //            workingHours = shiftHours;
                //        }
                //    }

                //    row.workingHours = workingHours.toFixed(2);
                //    row.overtime = overtime.toFixed(2);
                //};
                //vm.getContactsList = function (contact) {
                //    var contactList = '';
                //    if (contact != null) {

                //        if (contact.contactNo != null)
                //            contactList = contact.contactNo;

                //        if (contact.contactNo2 != null)
                //            contactList = contactList + ', ' + contact.contactNo2;
                //        return contactList;
                //    }
                //    else {
                //        return "";
                //    }
                //};
                vm.toggleAbsent = function (row) {

                    if (row.isAbsent) {

                        row._backupWorkingHours = row.workingHours;
                        row._backupOvertime = row.overtime;

                        angular.forEach(row.attendanceLogs, function (log) {

                            // preserve original values
                            log._hiddenCheckInTime = log.checkInTime;
                            log._hiddenCheckOutTime = log.checkOutTime;

                            // dummy empty values ONLY for UI
                            log._dummyCheckIn = null;
                            log._dummyCheckOut = null;
                        });

                        row.workingHours = 0;
                        row.overtime = 0;
                    }
                    else {

                        angular.forEach(row.attendanceLogs, function (log) {

                            // restore visually
                            log._dummyCheckIn = null;
                            log._dummyCheckOut = null;
                        });

                        row.workingHours = row._backupWorkingHours || 0;
                        row.overtime = row._backupOvertime || 0;

                        vm.calculateOvertime(row);
                    }
                };
                function initDate() {
                    vm.filters.monthYear = moment().startOf('month');
                }
                vm.getNameWithCode = function (contact) {
                    var namewithcode = '';
                    if (contact.code != null)
                        namewithcode = contact.name + '   (' + contact.code + ')';
                    else
                        namewithcode = contact.name;

                    return namewithcode;
                };
                function init() {
                    initDate();
                    //vm.searchContacts();
                    //vm.searchstaffTimeSheet();
                }
                init();


            }]);
