// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:438889-439262
appModule.controller('tenant.views.hrm.leaves.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.leave', 'abp.services.app.leaveType', 'abp.services.app.directory', 'abp.services.app.staffRole', 'abp.services.app.designation', 'abp.services.app.department', 'leaveId', '$uibModal', '$http',
        function ($scope, $uibModalInstance, leaveService, leaveTypeService, directoryService, staffRoleService, designationService, departmentService, leaveId, $uibModal, $http) {
            var vm = this;
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            //vm.minDate = moment().utc();
            var haveLeaveBalance = false;
            vm.minDate = null;
            vm.maxDate = null;
            vm.saving = false;
            vm.isAnnualLeave = false;
            vm.appliedDays = 0;
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
            };
            vm.totalNoOfLeaves = 0;
            vm.maxLeavesCount = 0;
            vm.lastJoiningDate = null;

            //vm.title = "Create Leave";
            //vm.minDateFromDate = new Date('2000-01-01');
            //vm.maxDateFromDate = new Date();
            //vm.currentDate = new Date();
            //vm.maxDate = moment().add(100, 'days');
            ////vm.contactBranchRows = [];
            //vm.contactPersons = [];
            //vm.leaveTypeApprovalSettings = [];
            ////enums
            //vm.enumApproverTypes = [
            //    { name: "ReportingTo", id: 1 },
            //    { name: "Having Designation", id: 2 },
            //    //{ name: "Department", id: 3 },
            //    { name: "Staff", id: 3 },
            //    { name: "Having Role", id: 4 }
            //];
            //vm.enumGenders = [
            //    { name: "Male", id: 1 },
            //    { name: "Female", id: 2 }
            //];
            //vm.enumMartialStatus = [
            //    { name: "Married", id: 1 },
            //    { name: "Single", id: 2 }
            //];
            //vm.enumLeaveCategories = [
            //    { name: "Short Leave", id: 1 },
            //    { name: "Long Leave", id: 2 }
            //];
            //vm.enumLeaveQuotaTypes = [
            //    { name: "Monthly", id: 1 },
            //    { name: "Quarterly", id: 2 },
            //    { name: "Yearly", id: 3 },
            //    { name: "TwoYearly", id: 4 },
            //    { name: "Occasional", id: 5 }
            //];
            //vm.enumLeavePeriodTypes = [
            //    { name: "None", id: 0 },
            //    { name: "DateToDate", id: 1 },
            //    { name: "CalendarMonthOrYear", id: 2 }
            //];
            //vm.enumLeaveQuotaRules = [
            //    { name: "StartOfPeriod", id: 1 },
            //    { name: "EndOfPeriod", id: 2 },
            //    { name: "OccasionalForStaff", id: 3 }
            //];
            //vm.enumLeaveStartFromOptions = [
            //    { name: "DateOfJoining", id: 1 },
            //    { name: "DateOfConfirmation", id: 2 }
            //];


            //vm.resetTotalHours = function () {
            //    if (vm.shift.isFlexible) {
            //        vm.shift.startTime = null;
            //        vm.shift.endTime = null;
            //        vm.shift.totalHours = null;
            //    }
            //    else {
            //        vm.shift.totalHours = null;

            //    }
            //}
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };

            //vm.calculateTotalHours = function () {
            //    // Check if both start and end time are defined
            //    if (vm.shift.startTime && vm.shift.endTime) {
            //        // Calculate the time difference in milliseconds
            //        var timeDiff = vm.shift.endTime - vm.shift.startTime;

            //        // Convert the time difference to hours
            //        var totalHours = Math.round(timeDiff / (1000 * 60 * 60) * 100) / 100;
            //        //timeDiff / (1000 * 60 * 60);

            //        // Update vm.shift.totalHours
            //        vm.shift.totalHours = totalHours;
            //    } else {
            //        // If start or end time is not defined, set totalHours to null
            //        vm.shift.totalHours = null;
            //    }
            //}

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
            //vm.setToDateLimit = function () {
            //    if (haveLeaveBalance) {
            //        var fromDate = angular.copy(vm.leave.fromDate);
            //        vm.minDate = fromDate; // Set minimum selectable date to fromDate
            //        console.log("test date");
            //        console.log(vm.minDate);

            //         Default to 100 days if maxLeaves is less than 1
            //        if (vm.leaveBalance.leaveType.maxLeaves < 1) {
            //            vm.leaveBalance.leaveType.maxLeaves = 100;
            //        }

            //         Calculate maxDate based on canAvailedInHours
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


            vm.getData = function () {
                if (vm.leave.leaveTypeId && vm.leave) {
                    vm.leaveType = vm.leaveTypes.find(v => v.id === vm.leave.leaveTypeId);

                    // if (vm.leave.staff != null) {
                    vm.getLeaveBalance().then(function () {
                        if (vm.leaveBalance) {
                            // check annual leaves
                            if (vm.leaveBalance.leaveType?.isRejoingRequired && vm.leaveBalance.leaveType?.calculateAsLeaveSalary) {
                                vm.isAnnualLeave = vm.leaveBalance.leaveType.calculateAsLeaveSalary;
                            }
                            else if (vm.leaveBalance.leaveType?.isRejoingRequired && !vm.leaveBalance.leaveType?.calculateAsLeaveSalary) { // Check medical leave
                                vm.isMedicalLeave = true;
                            }
                            getLeaveStatus(vm.leave.staff, vm.leave.leaveTypeId, vm.leaveBalance.startDate, vm.leaveBalance.endDate);
                        }
                    });
                    //}
                }
            };

            vm.getLeaveBalance = function () {
                vm.leaveBalance = null;

                return leaveService.getLeaveBalanceForView({ StaffId: vm.leave.staffId, LeaveTypeId: vm.leave.leaveTypeId })
                    .then(function (data) {
                        vm.leaveBalance = data.data;
                        haveLeaveBalance = true;
                        vm.leaveBalance.currentlyBookedLeaves = 0;
                        /*vm.leaveBalance.remainingBalance = vm.leaveBalance.remainingBalance;*/

                        vm.leave.staffId = vm.leave.staff;
                        vm.checkPreviouslyBooked = vm.appliedDays + vm.leaveBalance.remainingBalance; // Check previously booked
                        if (vm.checkPreviouslyBooked === vm.leaveBalance.noOfLeaves) {
                            vm.leaveBalance.previouslyBooked = 0; // First time
                        }
                        else {
                            vm.leaveBalance.previouslyBooked = vm.leaveBalance.booked;
                        }

                        if (vm.leave != null) {
                            //var fromDate1 = vm.leave.fromDate;
                            //var toDate1 = vm.leave.toDate;
                            //var leaveDay = Math.abs(moment(fromDate1).diff(moment(toDate1), 'days')) + 1;
                            /*var leaveDay = Math.round(moment.duration(toDate1.diff(fromDate1.startOf('day'))).asDays()) + 1;*/

                            /* vm.leaveBalance.currentlyBookedLeaves = leaveDay;*/ // for currently booked leaves
                            /*vm.leaveBalance.remainingBalance = vm.leaveBalance.remainingBalance + vm.appliedDays;*/

                            vm.leaveBalance.remainingBalance = vm.leaveBalance.remainingBalance;
                            //vm.leaveBalance.previouslyBooked = vm.leaveBalance.booked - vm.appliedDays; //Comment due to edical leave error
                            vm.leaveBalance.booked = vm.leaveBalance.booked - vm.appliedDays;
                            if (vm.leave && vm.leave.leaveType) {
                                if (vm.isAnnualLeave) {
                                    vm.totalNoOfLeaves = vm.leave.leaveType.noOfLeaves || 0;
                                    vm.maxLeavesCount = vm.leave.leaveType.maxLeaves || 0;
                                }
                                else {
                                    //Non annual leaves
                                    vm.totalNoOfLeaves = vm.leaveBalance.noOfLeaves;
                                    vm.maxLeavesCount = vm.leave.leaveType.maxLeaves || 0;
                                }
                            }

                        }
                    })
                    .catch(function (error) {

                    });
            };

            async function getLeaveTypes() {
                try {
                    vm.loading = true;
                    const response = await leaveTypeService.getLeaveType({});
                    vm.leaveTypes = response.data.items;
                } catch (error) {

                }
            }


            function getLeaveStatus(staff, leavetypeId, startDate, endDate) {
                leaveService.getLeaveStatus(leavetypeId, staff.id, startDate, endDate).success(function (data) {
                    vm.leaveStatus = data
                    if (leaveId == null) {
                        vm.leave.fullPaidDays = 0
                        vm.leave.halfPaidDays = 0
                        vm.leave.unPaidDays = 0
                    }
                    else {
                        vm.leaveStatus.fullPaidDays += vm.editLeaveStatus.fullPaidDays
                        vm.leaveStatus.halfPaidDays += vm.editLeaveStatus.halfPaidDays
                        vm.leaveStatus.unPaidDays -= vm.editLeaveStatus.unPaidDays
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            async function init() {
                try {
                    await getLeaveTypes();
                    vm.loading = true;

                    if (leaveId != null) {
                        const response = await leaveService.getLeavesForEdit(leaveId);
                        vm.leave = response.data;


                        if (vm.leave.fromDate != null && vm.leave.toDate != null) {
                            const fromDate2 = moment(vm.leave.fromDate);
                            const toDate2 = moment(vm.leave.toDate);
                            vm.appliedDays = Math.floor(moment.duration(toDate2.diff(fromDate2.startOf('day'))).asDays()) + 1;
                        }

                        //// Update leave status
                        //vm.leaveStatus.fullPaidDays = vm.leave.fullPaidDays;
                        //vm.leaveStatus.halfPaidDays = vm.leave.halfPaidDays;
                        //vm.leaveStatus.unPaidDays = vm.leave.unPaidDays;
                        //vm.editLeaveStatus.fullPaidDays = vm.leave.fullPaidDays;
                        //vm.editLeaveStatus.halfPaidDays = vm.leave.halfPaidDays;
                        //vm.editLeaveStatus.unPaidDays = vm.leave.unPaidDays;

                        //if (vm.leave.staffId) {
                        //    vm.leave.staffId.id = vm.leave.staffId;
                        //    // Alternatively: vm.leave.staffId = vm.leave.staffId ? vm.leave.staffId.id : null;
                        //}

                        // Call methods that depend on getLeaveTypes()
                        if (vm.leave != null) {
                            if (vm.leave?.rejoiningDate != null) {
                                vm.lastJoiningDate = vm.leave.rejoiningDate
                            }
                            else {
                                if (vm.leave?.staff != null) {
                                    vm.lastJoiningDate = vm.leave.staff.dateOfJoining
                                }
                            }
                            vm.getData();
                        }

                        /*vm.leaveBalance.currentlyBookedLeaves = appliedDays;*/
                        /*vm.getCurrentlyBookedLeaves();*/
                    }
                } catch (error) {

                } finally {
                    vm.loading = false;
                }
            }

            //function init() {
            //    getLeaveTypesfunction();
            //    vm.loading = true;
            //    //getLeaveStatus();

            //    if (leaveId != null) {
            //        vm.isEditMod = true;
            //        vm.title = "Update Leave"
            //        leaveService.getLeavesForEdit(leaveId).then(function (data) {
            //            vm.leave = data.data;
            //            if (vm.leave.fromDate != null && vm.leave.toDate != null) {
            //                var fromDate2 = moment(vm.leave.fromDate);
            //                var toDate2 = moment(vm.leave.toDate);
            //                vm.appliedDays = Math.round(moment.duration(toDate2.diff(fromDate2.startOf('day'))).asDays()) + 1;
            //            }
            //            //vm.leaveStatus = data
            //            vm.leaveStatus.fullPaidDays = vm.leave.fullPaidDays
            //            vm.leaveStatus.halfPaidDays = vm.leave.halfPaidDays
            //            vm.leaveStatus.unPaidDays = vm.leave.unPaidDays
            //            vm.editLeaveStatus.fullPaidDays = vm.leave.fullPaidDays
            //            vm.editLeaveStatus.halfPaidDays = vm.leave.halfPaidDays
            //            vm.editLeaveStatus.unPaidDays = vm.leave.unPaidDays

            //            if (vm.leave.staffId) {
            //                vm.leave.staffId.id = vm.leave.staffId
            //                // vm.leave.staffId = vm.leave.staffId ? vm.leave.staffId.id : null;
            //            }
            //            vm.getData();
            //            vm.getCurrentlyBookedLeaves();
            //        });
            //    }
            //    else {
            //    }
            //}

            init();
        }
    ]);
