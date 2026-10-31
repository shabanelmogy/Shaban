// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:437245-438079
appModule.controller('tenant.views.hrm.leaves.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.leave', 'abp.services.app.leaveType', 'abp.services.app.directory', 'abp.services.app.staffRole', 'abp.services.app.designation', 'abp.services.app.department', 'leaveId', '$uibModal', '$http', 'appSession', 'abp.services.app.shift',
        function ($scope, $uibModalInstance, leaveService, leaveTypeService, directoryService, staffRoleService, designationService, departmentService, leaveId, $uibModal, $http, appSession, shiftService) {
            var vm = this;
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            //vm.minDate = moment().utc();
            var haveLeaveBalance = false;
            vm.minDate = null;
            vm.maxDate = null;
            vm.saving = false;
            vm.isAnnualLeave = false;
            vm.isMedicalLeave = false;
            vm.isValidDateRange = false;
            /* vm.appliedDays = 0;*/
            vm.leaveStatus = {
                fullPaidDays: 0,
                halfPaidDays: 0,
                unPaidDays: 0,
            };
            vm.leaveType = {};
            vm.leave = {};
            vm.editLeaveStatus = {};
            vm.leaveBalance = {
                approvedLeaveCount: 0,
                notApprovedLeaveCount: 0,
                rejectedLeaveCount: 0,
                remainingBalance: 0,
                currentlyBookedLeaves: 0,
                previouslyBooked: 0,
                leaveType: {
                    noOfLeaves: 0,
                    maxLeaves: 0,
                },
            };
            var originalLeaveDays = 0;
            var initCallCount = 0; // Count how many times getData is called during init
            var totalInitCalls = 2; 
            vm.isStaffLocked = false; 
            vm.title = "Create Leave";
            vm.minDateFromDate = new Date('2000-01-01');
            vm.maxDateFromDate = new Date();
            vm.currentDate = new Date();
            vm.maxDate = moment().add(100, 'days');
            vm.createOtherStaffLeave = abp.auth.hasPermission('Pages.HRM.Leaves.AllStaff');
            //vm.contactBranchRows = [];
            vm.contactPersons = [];
            vm.leaveTypeApprovalSettings = [];
            //enums
            vm.enumApproverTypes = [
                { name: "ReportingTo", id: 1 },
                { name: "Having Designation", id: 2 },
                //{ name: "Department", id: 3 },
                { name: "Staff", id: 3 },
                { name: "Having Role", id: 4 }
            ];
            vm.enumGenders = [
                { name: "Male", id: 1 },
                { name: "Female", id: 2 }
            ];
            vm.enumMartialStatus = [
                { name: "Married", id: 1 },
                { name: "Single", id: 2 }
            ];
            vm.enumLeaveCategories = [
                { name: "Short Leave", id: 1 },
                { name: "Long Leave", id: 2 }
            ];
            vm.enumLeaveQuotaTypes = [
                { name: "Monthly", id: 1 },
                { name: "Quarterly", id: 2 },
                { name: "Yearly", id: 3 },
                { name: "TwoYearly", id: 4 },
                { name: "Occasional", id: 5 }
            ];
            vm.enumLeavePeriodTypes = [
                { name: "None", id: 0 },
                { name: "DateToDate", id: 1 },
                { name: "CalendarMonthOrYear", id: 2 }
            ];
            vm.enumLeaveQuotaRules = [
                { name: "StartOfPeriod", id: 1 },
                { name: "EndOfPeriod", id: 2 },
                { name: "OccasionalForStaff", id: 3 }
            ];
            vm.enumLeaveStartFromOptions = [
                { name: "DateOfJoining", id: 1 },
                { name: "DateOfConfirmation", id: 2 }
            ];


            vm.resetTotalHours = function () {
                if (vm.shift.isFlexible) {
                    vm.shift.startTime = null;
                    vm.shift.endTime = null;
                    vm.shift.totalHours = null;
                }
                else {
                    vm.shift.totalHours = null;

                }
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };

            vm.calculateTotalHours = function () {
                // Check if both start and end time are defined
                if (vm.shift.startTime && vm.shift.endTime) {
                    // Calculate the time difference in milliseconds
                    var timeDiff = vm.shift.endTime - vm.shift.startTime;

                    // Convert the time difference to hours
                    var totalHours = Math.round(timeDiff / (1000 * 60 * 60) * 100) / 100;
                    //timeDiff / (1000 * 60 * 60);

                    // Update vm.shift.totalHours
                    vm.shift.totalHours = totalHours;
                } else {
                    // If start or end time is not defined, set totalHours to null
                    vm.shift.totalHours = null;
                }
            }

            //vm.setToDateLimit = function () {
            //    if (haveLeaveBalance == true) {
            //        //vm.minDate = vm.leave.fromDate;
            //        var fromDate = angular.copy(vm.leave.fromDate);
            //        vm.minDate = fromDate;
            //        if (vm.leaveBalance.leaveType.maxLeaves < 1) { vm.leaveBalance.leaveType.maxLeaves = 100; }
            //        if (vm.leaveBalance.leaveType.canAvailedInHours != true) {
            //            vm.maxDate = fromDate.add('days', vm.leaveBalance.leaveType.maxLeaves-1).utc();
            //        }
            //        else if (vm.leaveBalance.leaveType.canAvailedInHours == true) {
            //            vm.maxDate = fromDate.add('hours', 3);
            //        }
            //    }
            //    else {
            //        //vm.minDate = vm.leave.fromDate;
            //        var fromDate = angular.copy(vm.leave.fromDate);
            //        vm.maxDate = fromDate.add('days', 100).utc();
            //    }
            //}  

            vm.setToDateLimit = function () {

                if (!vm.leave.fromDate || !vm.leaveBalance || !vm.leaveType) {
                    return;
                }

                if (haveLeaveBalance) {

                    var fromDate = angular.copy(vm.leave.fromDate).startOf('day');

                    /*var fromDate = moment(angular.copy(vm.leave.fromDate));*/
                    vm.minDate = fromDate; // Set minimum selectable date to fromDate

                    // Default to 100 days if maxLeaves is less than 1
                    if (vm.leaveBalance.leaveType.maxLeaves < 1) {
                        vm.leaveBalance.leaveType.maxLeaves = 100;
                    }

                    // Check if it is annual leave and adjust maxDate accordingly
                    if (vm.isAnnualLeave) {
                        // Extend the maxDate limit significantly if it is annual leave
                        vm.maxDate = fromDate.clone().add(365, 'days').utc(); // Example: 1 year from the fromDate
                    } else if (vm.leaveBalance.leaveType.canAvailedInHours) {
                        vm.maxDate = fromDate.clone().add(3, 'hours').utc(); // 3 hours from the fromDate
                    } else {
                        vm.maxDate = fromDate.clone().add(vm.leaveBalance.leaveType.maxLeaves - 1, 'days'); // maxLeaves days from the fromDate and remove utc function
                    }
                } else {
                    var fromDate = angular.copy(vm.leave.fromDate).startOf('day');
                    vm.minDate = fromDate; // Set minimum selectable date to fromDate

                    // Check if it is annual leave and adjust maxDate accordingly
                    if (vm.isAnnualLeave) {
                        vm.maxDate = fromDate.clone().add(365, 'days').utc(); // Example: 1 year from the fromDate
                    } else {
                        vm.maxDate = fromDate.clone().add(100, 'days').utc(); // 100 days from the fromDate if no leave balance
                    }
                }
                if (vm.leave.toDate != null) {
                    vm.getCurrentlyBookedLeaves();
                }
            };

            //vm.setToDateLimit = function () {
            //    if (haveLeaveBalance) {
            //        var fromDate = angular.copy(vm.leave.fromDate);
            //        vm.minDate = fromDate; // Set minimum selectable date to fromDate

            //        // Default to 100 days if maxLeaves is less than 1
            //        if (vm.leaveBalance.leaveType.maxLeaves < 1) {
            //            vm.leaveBalance.leaveType.maxLeaves = 100;
            //        }

            //        // Calculate maxDate based on canAvailedInHours
            //        if (vm.leaveBalance.leaveType.canAvailedInHours) {
            //            vm.maxDate = fromDate.clone().add(3, 'hours').utc(); // 3 hours from the fromDate
            //        } else {
            //            vm.maxDate = fromDate.clone().add(vm.leaveBalance.leaveType.maxLeaves - 1, 'days').utc(); // maxLeaves days from the fromDate
            //        }
            //    } else {
            //        var fromDate = angular.copy(vm.leave.fromDate);
            //        vm.minDate = fromDate; // Set minimum selectable date to fromDate
            //        vm.maxDate = fromDate.clone().add(100, 'days').utc(); // 100 days from the fromDate if no leave balance
            //    }
            //};


            ////remove max date check
            //vm.setToDateLimit = function () {
            //    // Set minimum date based on the 'fromDate'
            //    vm.minDate = vm.leave.fromDate;

            //    // Remove max date logic - No restriction on the 'toDate'
            //    // The 'fromDate' can be any date without an upper limit

            //    // Optionally clear the maxDate if you have been setting it previously
            //    // vm.maxDate = null; // Uncomment this if you need to explicitly clear maxDate
            //}

            vm.getCurrentlyBookedLeaves = function () {
                var toDate = moment(vm.leave.toDate).startOf('day');
                var fromDate = moment(vm.leave.fromDate).startOf('day');

                if (haveLeaveBalance == true) {
                    if (fromDate <= toDate) {
                        if (vm.leaveBalance.leaveType.canAvailedInHours != true) {

                            var result = vm.calculateLeaveDays(fromDate, toDate, vm.holidays || []);

                            // Update leave balance
                            vm.leaveBalance.currentlyBookedLeaves = result.workingDays;
                            vm.leaveBalance.remainingBalance =
                                vm.leaveBalance.leaveType.noOfLeaves
                                - vm.leaveBalance.booked
                                - result.workingDays;

                            // Update paid days on leave
                            vm.leave.fullPaidDays = result.fullPaidDays;
                            vm.leave.halfPaidDays = result.halfPaidDays;
                            vm.leave.unPaidDays = result.unPaidDays;

                        } else if (vm.leaveBalance.leaveType.canAvailedInHours == true) {
                            // Hours based leave — keep your existing hours logic
                            var minutes = Math.round(moment.duration(toDate.diff(fromDate)).asMinutes());
                            var hours = minutes / 60;

                            if (hours <= vm.leaveBalance.remainingBalance) {
                                vm.leaveBalance.remainingBalance =
                                    vm.leaveBalance.leaveType.noOfLeaves
                                    - vm.leaveBalance.booked
                                    - hours;
                                vm.leaveBalance.currentlyBookedLeaves = hours;
                            }
                        }
                    }
                }
            };

            //vm.onLeaveTypeChange = function () {
            //    // Update staffId
            //    if (vm.leave.staffId) {
            //        if (typeof vm.leave.staffId === 'object' && vm.leave.staffId !== null) {
            //            vm.leave.staff.id = vm.leave.staffId.id;
            //        } else {
            //            vm.leave.staff.id = vm.leave.staffId;
            //        }
            //        vm.leave.staffId = vm.leave.staff.id;
            //        vm.leave.fromDate = null;
            //    }
            //    vm.getData();
            //};

            vm.clearOnChange = function () {
                vm.leave.fromDate = null;
                vm.leave.toDate = null;
                haveLeaveBalance = false;
                vm.leaveBalance.leaveType.noOfLeaves = 0;
                vm.leaveBalance.leaveType.maxLeaves = 0;
                vm.leaveBalance.remainingBalance = 0;
                vm.leave.fullPaidDays = 0;
                vm.leave.halfPaidDays = 0;
                vm.leave.unPaidDays = 0;
                vm.leaveBalance.previouslyBooked = 0;
                vm.leaveBalance.currentlyBookedLeaves = 0;
                vm.leaveBalance.lastJoiningDate = null;

                $('[name="fromDate_dateTime"]').data('DateTimePicker').date(null);
                $('[name="toDate_dateTime"]').data('DateTimePicker').date(null);
            };

            vm.onLeaveTypeChange = function () {
                if (vm.createOtherStaffLeave)
                {
                    vm.leave.staff = null;
                    vm.leave.staffId = null;
                }               
                vm.isAnnualLeave = false;
                vm.clearOnChange();
            };
            vm.validateDates = function () {
                var fromDate = moment(angular.copy(vm.leave.fromDate)).startOf('day'); // only calculate days duration
                var toDate = moment(angular.copy(vm.leave.toDate)).startOf('day');
                if (toDate.isBefore(fromDate)) {
                    return false;
                }
                return true;
            };


            vm.onStaffChange = function () {
                vm.leave.staff = vm.leave.staff;
                vm.leave.staffId = vm.leave.staff.id;
                vm.clearOnChange();
                // Load weekends for selected staff
                loadStaffShiftWeekends(vm.leave.staff.id);
            };

            vm.getData = function () {

                if (vm.leave.leaveTypeId && vm.leave && vm.leave.fromDate) {

                    //  Reset toDate when fromDate changes (even in edit mode)
                    if (vm.isEditMod && initCallCount >= totalInitCalls) {
                        vm.leave.toDate = null;
                        $('[name="toDate_dateTime"]').data('DateTimePicker').date(null);
                        vm.leaveBalance.currentlyBookedLeaves = 0;
                    }
                    if (vm.isEditMod && initCallCount < totalInitCalls) {
                        initCallCount++; // increment until we've consumed all init calls
                    }
                    vm.leaveType = vm.leaveTypes.find(v => v.id === vm.leave.leaveTypeId);
                    if (vm.leave.staffId) {
                        vm.getLeaveBalance().then(function () {
                            if (vm.leaveBalance) {
                                // check annual leave
                                if (vm.leaveBalance.leaveType?.isRejoingRequired && vm.leaveBalance.leaveType?.calculateAsLeaveSalary) {
                                    vm.isAnnualLeave = vm.leaveBalance.leaveType.calculateAsLeaveSalary;
                                }
                                else if (vm.leaveBalance.leaveType?.isRejoingRequired && !vm.leaveBalance.leaveType?.calculateAsLeaveSalary) { // Check medical leave
                                    vm.isMedicalLeave = true;
                                }
                                getLeaveStatus(vm.leave.staff, vm.leave.leaveTypeId, vm.leaveBalance.startDate, vm.leaveBalance.endDate);
                            }
                        });
                    }
                }
            };

            vm.clearLeaveBalanceData = function () {
                if (!vm.leaveBalance)
                    return;

                vm.leaveBalance.currentlyBookedLeaves = 0;
                vm.leaveBalance.remainingBalance = 0;
                vm.leaveBalance.previouslyBooked = 0;
                vm.leaveBalance.currentlyBookedLeaves = 0;
                vm.leaveBalance.booked = 0;
            };

            vm.getLeaveBalance = function () {
                vm.leaveBalance = null;
                vm.loading = true;
                vm.clearLeaveBalanceData();
                // Comment its done on ng-change function 
                //if (leaveId == null) {
                //    if (vm.leave) {

                //        vm.leave.staff = vm.leave.staffId;
                //        vm.leave.staffId = vm.leave.staff.id;
                //        // vm.leave.staffId = vm.leave.staffId ? vm.leave.staffId.id : null;

                //    }
                //}
                return leaveService.getLeaveBalance({ StaffId: vm.leave.staff.id, LeaveTypeId: vm.leave.leaveTypeId, FromDate: vm.leave.fromDate })
                    .then(function (data) {
                        vm.leaveBalance = data.data;
                        haveLeaveBalance = true;
                        vm.leaveBalance.currentlyBookedLeaves = 0;
                        vm.leaveBalance.remainingBalance = vm.leaveBalance.remainingBalance;
                        vm.leaveBalance.previouslyBooked = vm.leaveBalance.booked;
                        vm.leave.staffId = vm.leave.staff;

                        //if (leaveId != null) {
                        //    var fromDate1 = moment(vm.leave.fromDate);
                        //    var toDate1 = moment(vm.leave.toDate);
                        //    var leaveDay = Math.abs(fromDate1.startOf('day').diff(toDate1.startOf('day'), 'days')) + 1; //Only compare date part
                        //    /*var leaveDay = Math.round(moment.duration(toDate1.diff(fromDate1.startOf('day'))).asDays()) + 1;*/

                        //    vm.leaveBalance.currentlyBookedLeaves = leaveDay;
                        //    /*vm.leaveBalance.remainingBalance = vm.leaveBalance.remainingBalance + leaveDay;*/
                        //    vm.leaveBalance.previouslyBooked = vm.leaveBalance.booked - leaveDay;
                        //    vm.leaveBalance.booked = vm.leaveBalance.booked - leaveDay;
                        //}

                        if (leaveId != null) {
                            // Use the FIXED originalLeaveDays calculated once at init
                            vm.leaveBalance.currentlyBookedLeaves = originalLeaveDays;
                            vm.leaveBalance.previouslyBooked = vm.leaveBalance.booked - originalLeaveDays;
                            vm.leaveBalance.booked = vm.leaveBalance.booked - originalLeaveDays;
                        }
                    })
                    .catch(function (error) {

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.clearStaff = function () {
                vm.filters.staff = null;
                vm.leave.staffId = null;
            };
            async function loadStaffShiftWeekends(staffId) {
                try {
                    const response = await shiftService.getStaffShiftByStaffId(staffId);
                    var shift = response.data;

                    if (shift && shift.weekendDays && shift.weekendDays.length > 0) {
                        // Map DB values (1-7) to JS moment day values (0-6)
                        // Sunday: DB=7 → JS=0, rest map directly
                        vm.staffShiftWeekends = shift.weekendDays.map(function (wd) {
                            return wd.dayOfWeek === 7 ? 0 : wd.dayOfWeek;
                        });
                    } else {
                        vm.staffShiftWeekends = [0, 6]; // default Sat/Sun
                    }
                } catch (error) {
                    vm.staffShiftWeekends = [0, 6];
                    console.warn('Could not load staff shift, using default weekends');
                }
            }
            vm.calculateLeaveDays = function (fromDate, toDate, holidays) {
                var totalDays = 0;
                var workingDays = 0;
                var weekendDays = 0;
                var holidayDays = 0;
                var fullPaidDays = 0;
                var halfPaidDays = 0;
                var unPaidDays = 0;

                var current = moment(fromDate).startOf('day');
                var end = moment(toDate).startOf('day');

                // Use staff shift weekends, fallback to Sat/Sun
                var weekends = (vm.staffShiftWeekends && vm.staffShiftWeekends.length > 0)
                    ? vm.staffShiftWeekends
                    : [0, 6];

                var holidaySet = new Set(
                    (holidays || []).map(h => moment(h).format('YYYY-MM-DD'))
                );

                // Step 1: Count all day types
                while (current <= end) {
                    var dayOfWeek = current.day(); // JS: 0=Sun, 1=Mon ... 6=Sat
                    var dateStr = current.format('YYYY-MM-DD');

                    totalDays++;

                    if (weekends.includes(dayOfWeek)) {
                        weekendDays++;
                    } else if (holidaySet.has(dateStr)) {
                        holidayDays++;
                    } else {
                        workingDays++;
                    }

                    current.add(1, 'days');
                }

                // Step 2: Calculate paid/half-paid/unpaid from working days
                if (vm.leaveStatus) {
                    var availableFullPaid = vm.leaveStatus.fullPaidDays || 0;
                    var availableHalfPaid = vm.leaveStatus.halfPaidDays || 0;
                    var remainingWorkingDays = workingDays;

                    // First consume full paid days
                    if (remainingWorkingDays > 0 && availableFullPaid > 0) {
                        fullPaidDays = Math.min(remainingWorkingDays, availableFullPaid);
                        remainingWorkingDays -= fullPaidDays;
                    }

                    // Then consume half paid days
                    if (remainingWorkingDays > 0 && availableHalfPaid > 0) {
                        halfPaidDays = Math.min(remainingWorkingDays, availableHalfPaid);
                        remainingWorkingDays -= halfPaidDays;
                    }

                    // Remaining are unpaid
                    if (remainingWorkingDays > 0) {
                        unPaidDays = remainingWorkingDays;
                    }
                }

                return {
                    totalDays: totalDays,
                    workingDays: workingDays,
                    weekendDays: weekendDays,
                    holidayDays: holidayDays,
                    fullPaidDays: fullPaidDays,
                    halfPaidDays: halfPaidDays,
                    unPaidDays: unPaidDays
                };
            };
            vm.searchStaff = function ($select) {
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
                        category: function () { return null; },
                        type: function () { return 1; }
                    }
                }).result.then(function (staff) {
                    if (staff != null) {
                        vm.leave.staff = staff;
                        vm.leave.staffId = staff;
                        // Load weekends for selected staff
                        loadStaffShiftWeekends(staff.id);
                        vm.getData();
                    }
                });
            };

            //function getLeaveTypes() {
            //    leaveTypeService.getLeaveType({}).success(function (data) {
            //        vm.leaveTypes = data.items;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}

            async function getLeaveTypes() {
                try {
                    const response = await leaveTypeService.getLeaveType({});
                    vm.leaveTypes = response.data.items;
                } catch (error) {

                }
            }

            function getLeaveStatus(staff, leavetypeId, startDate, endDate) {
                leaveService.getLeaveStatus(leavetypeId, staff.id, startDate, endDate).success(function (data) {
                    vm.leaveStatus = data
                    if (vm.isAnnualLeave) {
                        vm.leaveStatus.fullPaidDays = vm.leaveBalance.remainingBalance;
                        if (leaveId == null) {
                            vm.leave.fullPaidDays = 0;
                            vm.leave.halfPaidDays = 0
                            vm.leave.unPaidDays = 0;
                        }
                        else {
                            vm.leaveStatus.fullPaidDays += vm.leaveBalance.remainingBalance;
                            /*vm.leaveStatus.halfPaidDays += vm.editLeaveStatus.halfPaidDays*/
                            vm.leaveStatus.unPaidDays -= vm.editLeaveStatus.unPaidDays;
                        }
                    }
                    else {
                        if (leaveId == null) {
                            vm.leave.fullPaidDays = 0;
                            vm.leave.halfPaidDays = 0;
                            vm.leave.unPaidDays = 0;
                        }
                        else {
                            vm.leaveStatus.fullPaidDays += vm.editLeaveStatus.fullPaidDays;
                            vm.leaveStatus.halfPaidDays += vm.editLeaveStatus.halfPaidDays;
                            vm.leaveStatus.unPaidDays -= vm.editLeaveStatus.unPaidDays;
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.updateRejoiningDate = function () {
                vm.leaveRecord = angular.copy(vm.leave); //Copy leave in leaveRecord to handle in case of error
                if (vm.leave?.toDate && vm.leave?.rejoiningDate) {
                    if (vm.leave?.leaveType?.isRejoingRequired && !vm.leave?.leaveType?.calculateAsLeaveSalary) {
                        const { isEarlierRejoining, earlierDays } = checkRejoiningDate(vm.leave.toDate, vm.leave.rejoiningDate);
                        vm.leave.isEarlierRejoining = isEarlierRejoining;
                        vm.leave.earlierDays = earlierDays;
                        if (isEarlierRejoining && earlierDays > 0) {
                            vm.leave = updateLeaveRecord(vm.leave, earlierDays);
                        }
                    }
                }
                leaveService.updateJoiningDate(vm.leave)
                    .then(function (result) {
                        if (vm.leave && vm.leave.isEarlierRejoining && vm.leave.earlierDays > 0) {
                            vm.leaveBalance.earlierDays = vm.leave.earlierDays;
                            vm.leaveBalance.isEarlierRejoining = vm.leave.isEarlierRejoining;
                            vm.leaveBalance.leaveUnpaidDays = vm.leaveRecord.unPaidDays;
                            leaveService.updateLeaveBalance(vm.leaveBalance).success(function (data) {
                                vm.saving = false;
                            }).finally(function () {
                                vm.loading = false;
                                vm.leaveBalance.isEarlierRejoining = false;
                            });
                        }
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .catch(function (error) {
                        vm.leave = vm.leaveRecord; //Restore leave 
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            }

            function checkRejoiningDate(toDate, rejoiningDate) {
                const toDateObj = new Date(toDate);
                const rejoiningDateObj = new Date(rejoiningDate);

                const toDateOnly = toDateObj.toLocaleDateString();  // Get date part in local timezone
                const rejoiningDateOnly = rejoiningDateObj.toLocaleDateString();  // Get date part in local timezone

                const expectedRejoiningDateObj = new Date(toDateObj);
                expectedRejoiningDateObj.setDate(toDateObj.getDate() + 1);
                const expectedRejoiningDate = expectedRejoiningDateObj.toLocaleDateString();

                let isEarlierRejoining = 0;
                let earlierDays = 0;

                if (rejoiningDateOnly === expectedRejoiningDate) {
                    isEarlierRejoining = 0;
                    earlierDays = 0;
                } else if (rejoiningDateOnly === toDateOnly) {
                    isEarlierRejoining = 1;
                    earlierDays = 1;
                } else if (rejoiningDateObj < expectedRejoiningDateObj) {
                    isEarlierRejoining = 1;
                    expectedRejoiningDateObj.setHours(0, 0, 0, 0);
                    rejoiningDateObj.setHours(0, 0, 0, 0);
                    earlierDays = Math.floor((expectedRejoiningDateObj - rejoiningDateObj) / (1000 * 60 * 60 * 24)); // Convert ms to days
                }
                return {
                    isEarlierRejoining: isEarlierRejoining,
                    earlierDays: earlierDays
                };
            }

            function updateLeaveRecord(leaveRecord, earlierDays) {
                if (earlierDays > 0) {
                    // Step 1: Subtract earlierDays from UnPaidDays
                    if (leaveRecord.unPaidDays > 0) {
                        const subtractFromUnPaid = Math.min(leaveRecord.unPaidDays, earlierDays);
                        leaveRecord.unPaidDays -= subtractFromUnPaid;
                        earlierDays -= subtractFromUnPaid;
                    }

                    // Step 2: If there are still earlierDays left, subtract from HalfPaidDays
                    if (earlierDays > 0 && leaveRecord.halfPaidDays > 0) {
                        const subtractFromHalfPaid = Math.min(leaveRecord.halfPaidDays, earlierDays);
                        leaveRecord.halfPaidDays -= subtractFromHalfPaid;
                        earlierDays -= subtractFromHalfPaid;
                    }

                    // Step 3: If there are still earlierDays left, subtract from FullPaidDays
                    if (earlierDays > 0 && leaveRecord.fullPaidDays > 0) {
                        const subtractFromFullPaid = Math.min(leaveRecord.fullPaidDays, earlierDays);
                        leaveRecord.fullPaidDays -= subtractFromFullPaid;
                        earlierDays -= subtractFromFullPaid;
                    }
                }
                return leaveRecord;
            }

            vm.save = function () {
                vm.isValidDateRange = vm.validateDates();
                if (!vm.isValidDateRange) {
                    abp.message.warn(app.localize('ToDate Cannot Be Earlier Than From Date'));
                    return;
                }
                vm.saving = true;

                if (vm.leave.staffId) {
                    vm.leave.staff = vm.leave.staffId
                    vm.leave.staffId = vm.leave.staffId.id
                    //vm.leave.staffId = vm.leave.staffId ? vm.leave.staffId.id : null;

                    var originalStaff = vm.leave.staff ? vm.leave.staff : null;
                }
                //vm.leave.fullPaidDays = vm.leaveStatus.fullPaidDays
                //vm.leave.halfPaidDays = vm.leaveStatus.halfPaidDays
                //vm.leave.unPaidDays = vm.leaveStatus.unPaidDays
                if (vm.leave.staff != null) {
                    vm.leave.remainingLeaves = vm.leaveBalance.remainingBalance;
                    vm.leave.currentlyBookedLeaves = vm.leaveBalance.currentlyBookedLeaves;
                }

                //vm.leave.remainingLeaves1 = vm.leaveBalance.remainingBalance - vm.leaveBalance.currentlyBookedLeaves ;
                if (leaveId != null) {
                    leaveService.createOrUpdateLeave(vm.leave)
                        .then(function (result) {
                            vm.leaveBalance.booked = vm.leaveBalance.booked + vm.leaveBalance.currentlyBookedLeaves

                            leaveService.updateLeaveBalance(vm.leaveBalance).success(function (data) {
                                vm.saving = false;
                            }).finally(function () {
                                vm.loading = false;
                            });
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .catch(function () {
                            vm.leave.staffId = originalStaff;
                        })
                        .finally(function () {

                            vm.saving = false;
                        });
                } else {
                    leaveService.createOrUpdateLeave(vm.leave)
                        .then(function (result) {
                            vm.leaveBalance.booked = vm.leaveBalance.booked + vm.leaveBalance.currentlyBookedLeaves

                            leaveService.updateLeaveBalance(vm.leaveBalance).success(function (data) {
                                vm.saving = false;
                            }).finally(function () {
                                vm.loading = false;
                            });
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .catch(function () {
                            vm.leave.staffId = originalStaff;
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            async function loadStaffFromSession() {
                try {
                    
                    // Get contact linked to current ABP user
                    const response = await directoryService.getStaffByIdForHrm({
                        contanctId: appSession.user.contactId,  
                        contactType: 1,
                        activeOnly: true
                    });

                    if (response.data.items && response.data.items.length > 0) {
                        var currentStaff = response.data.items[0];
                        vm.leave.staff = currentStaff;
                        vm.leave.staffId = currentStaff;
                        vm.isStaffLocked = true; 
                    }
                } catch (error) {
                    abp.notify.error('Could not load staff information');
                }
            }
            async function init() {
                try {
                    await getLeaveTypes();
                    vm.loading = true;

                    if (leaveId != null) {
                        vm.isEditMod = true;
                        vm.title = "Update Leave";

                        const response = await leaveService.getLeavesForEdit(leaveId);
                        vm.leave = response.data;

                        // Update leave status
                        vm.leaveStatus.fullPaidDays = vm.leave.fullPaidDays;
                        vm.leaveStatus.halfPaidDays = vm.leave.halfPaidDays;
                        vm.leaveStatus.unPaidDays = vm.leave.unPaidDays;
                        vm.editLeaveStatus.fullPaidDays = vm.leave.fullPaidDays;
                        vm.editLeaveStatus.halfPaidDays = vm.leave.halfPaidDays;
                        vm.editLeaveStatus.unPaidDays = vm.leave.unPaidDays;

                        if (vm.leave.staffId) {
                            vm.leave.staff.id = vm.leave.staffId;
                        }

                        // Calculate original leave days
                        if (vm.leave.fromDate != null && vm.leave.toDate != null) {
                            var fromDate2 = moment(vm.leave.fromDate).startOf('day');
                            var toDate2 = moment(vm.leave.toDate).startOf('day');
                            originalLeaveDays = Math.abs(fromDate2.diff(toDate2, 'days')) + 1;
                        }

                        // Load staff shift weekends before calculating days
                        if (vm.leave.staff && vm.leave.staff.id) {
                            await loadStaffShiftWeekends(vm.leave.staff.id);
                        }

                        vm.getData();
                        vm.getCurrentlyBookedLeaves();

                    } else {
                        if (!vm.createOtherStaffLeave) {
                            await loadStaffFromSession();
                            // Load shift weekends after loading staff from session
                            if (vm.leave.staff && vm.leave.staff.id) {
                                await loadStaffShiftWeekends(vm.leave.staff.id);
                            }
                        }
                    }

                } catch (error) {
                } finally {
                    vm.loading = false;
                    $scope.$apply();
                }
            }


            init();
        }
    ]);
