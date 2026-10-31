// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:96975-97700
appModule.controller('tenant.views.common.hrm.finalSettlement.index', [
        '$scope', '$uibModal', 'abp.services.app.directory', 'abp.services.app.leaveSalaryPayroll', 'abp.services.app.payroll', 'abp.services.app.staff', 'abp.services.app.designation', 'abp.services.app.businessUnit',
        function ($scope, $uibModal, directoryService, leaveSalaryPayrollService, payrollService, staffService, designationService, businessUnitService) {

            var vm = this;
            vm.isBusinessUnitWisePayrollProcess = abp.setting.getBoolean("App.Speed.Hrm.IsBusinessUnitsWisePayrollProcess");

            vm.loading = false;
            vm.isPayFullTicketPriceAndAdjustInSalary = false
            vm.leaveDetails = null;
            vm.lastWorkingDay = null;
            vm.firstWorkingDay = null;
            vm.serviceTenureDescription = '';
            vm.totalPayable = 0;
            vm.additional = 0;
            vm.airTicketPrice = 0;
            vm.leaveSalaryPayroll = {
                /*ticketPrice: 0,*/
                eligible: 0,
                payableValue: 0
            };
            //vm.startDate = new Date(date);
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isGranted = (permission) => {
                return abp.auth.isGranted(permission);
            }
            var designationDetails = function () {
                designationService.getDesignations().success(function (result) {
                    vm.designationDetails = result.items;
                    //console.log(test);
                });
            };
            vm.clearStaff = function () {
                vm.staff = null;
                vm.staffId = null;
                vm.leave = null;
                vm.payroll = null;
                vm.lastWorkingDay = null;

            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };
            vm.calculateTotal = (pd, ticketPrize) => {
                if (!pd) return 0;
                vm.totalPayable = (parseFloat(pd.netPay) || 0) + (parseFloat(ticketPrize) || 0) + (parseFloat(pd.leaveSalary) || 0) + (parseFloat(pd.gratuity) || 0);
                return vm.totalPayable;
            };
            vm.calculateTicket = (count, prize) => {

                const countValue = parseFloat(count);
                const prizeValue = parseFloat(prize);

                if (isNaN(countValue) || isNaN(prizeValue)) return 0;

                return countValue * prizeValue;
            };

            vm.searchStaff = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.searchStaffForHrm({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffs = response.data.items;
                });
            };

            vm.searchStaffPopoup = async function () {
                try {
                    vm.loading = true;
                    vm.isProcess = true;
                    if (vm.staff) {
                        vm.businessUnitId = vm.staff.businessUnitId;
                    }
                    vm.filters.isCalculateGratuity = true; // Calculate gratuity
                    // Fetch staff details
                    const staffResponse = await staffService.getStaffForEdit({ id: vm.staff.id });
                    vm.staffs = staffResponse.data.items;
                    vm.staff = staffResponse.data;
                    // First working day
                    if (vm.staff != null && vm.staff.dateOfJoining != null) {
                        vm.firstWorkingDay = vm.staff.dateOfJoining;
                    }
                    vm.airTicket = vm.staff.staffWiseEligibilities.find(x => x.salaryItemTypeId == 41);

                    // Fetch recent leave details
                    await vm.getStaffRecentLeaveDetails(vm.staff.id, vm.filters.isCalculateGratuity);

                    // Fetch recent ticket details
                    await vm.getStaffRecentTicketDetails(vm.staff.id);
                    vm.processReferesh();
                } catch (error) {
                    vm.isProcess = false;
                    return;
                }
                finally {
                    vm.loading = false;
                    /*vm.isProcess = false;*/
                }
            };


            vm.getStaffRecentLeaveDetails = async function (staffId, isCalculateGratuity) {
                try {
                    const response = await leaveSalaryPayrollService.getStaffRecentLeaveDetails(staffId, isCalculateGratuity);
                    vm.leave = response.data;
                    vm.leaveDetails = vm.leave;
                    //vm.leaveTicketStartDate = vm.leave?.leaveType?.leaveStartFrom;
                    if (vm.leave && vm.leave.leaveType) {
                        vm.leaveTicketStartDate = vm.leave.leaveType.leaveStartFrom;
                    }

                    if (vm.leave && vm.leave.fromDate && vm.leave.toDate) {
                        let startDate = moment(vm.leave.fromDate);
                        let endDate = moment(vm.leave.toDate);

                        if (startDate.isValid() && endDate.isValid()) {
                            vm.filters.approvedAnnualLeaves = endDate.diff(startDate, 'days') + 1;
                        } else {

                            vm.filters.approvedAnnualLeaves = 0;
                        }
                    } else {

                        vm.filters.approvedAnnualLeaves = 0;
                    }
                } catch (error) {
                    vm.isProcess = false;
                    $scope.$apply();
                    throw error;
                }
                finally {
                    vm.loading = false;
                    /* vm.isProcess = false;*/
                }
            };

            vm.getStaffRecentTicketDetails = async function (staffId) {
                try {
                    const response = await leaveSalaryPayrollService.getStaffRecentTicketDetails(staffId);
                    vm.lastTicketPayrollDetails = response.data;

                    if (vm.lastTicketPayrollDetails && vm.lastTicketPayrollDetails.ticketIssuanceDate /*!== vm.leave.fromDate*/) { // check coment for final settlement
                        // Check for same date in case of cancel reprocess
                        /*if (vm.lastTicketPayrollDetails.ticketIssuanceDate !== vm.leave.fromDate)*/
                        vm.lastTicketDate = vm.lastTicketPayrollDetails.ticketIssuanceDate;
                    } else if (vm.staff != null && vm.staff.dateOfJoining != null) {
                        let date;
                        date = vm.staff.dateOfJoining;
                        //if (vm.leave.leaveType.leaveStartFrom == 1) {
                        //    date = vm.staff.dateOfJoining;
                        //} else if (vm.leave.leaveType.leaveStartFrom == 2) {
                        //    date = vm.staff.dateOfConfirmation;
                        //}
                        vm.lastTicketDate = new Date(date);
                        /*vm.lastTicketDate = new Date('2024-01-22T00:00:00Z');*/

                    }
                    $scope.$apply();
                } catch (error) {
                    console.error('Error in getStaffRecentTicketDetails:', error);
                }
            };
            //vm.calculateEligibleValue = function () {

            //    //vm.calculateEligibleValue = function () {
            //    var currentDate = new Date();
            //    var startDate;
            //    if (vm.lastTicketPayrollDetails) {
            //        startDate = new Date(vm.lastTicketPayrollDetails.toDate);
            //    }
            //    else {
            //        var date;
            //        if (vm.leave.leaveType.leaveStartFrom == 1) {
            //            date = vm.staff.dateOfJoining
            //        }
            //        else if (vm.leave.leaveType.leaveStartFrom == 2) {
            //            date = vm.staff.dateOfConfirmation
            //        }
            //        startDate = new Date(date);
            //    }

            //    // Calculate the difference in milliseconds
            //    var dateDifference = currentDate - startDate;

            //    // Convert milliseconds to years
            //    var yearsDifference = dateDifference / (365.25 * 24 * 60 * 60 * 1000);

            //    // Round the result to get the whole years
            //    //var roundedYearsDifference = Math.floor(yearsDifference);

            //    if (yearsDifference >= 1) {
            //        if (yearsDifference >= vm.airTicket.afterYears) {
            //            vm.leaveSalaryPayroll.eligibleValue = vm.leaveSalaryPayroll.fullTicketValue * vm.airTicket.eligibleFor
            //        }
            //        else {
            //            vm.leaveSalaryPayroll.eligibleValue = Math.floor(((vm.leaveSalaryPayroll.fullTicketValue * (yearsDifference / vm.airTicket.afterYears)) * vm.airTicket.eligibleFor));
            //        }
            //        vm.leaveSalaryPayroll.approvedValue = vm.leaveSalaryPayroll.eligibleValue
            //        vm.leaveSalaryPayroll.receivableFromEmployee = vm.leaveSalaryPayroll.approvedValue - vm.leaveSalaryPayroll.eligibleValue
            //    }
            //    else {
            //        vm.leaveSalaryPayroll.eligibleValue = 0;
            //        vm.leaveSalaryPayroll.approvedValue = 0;
            //        vm.leaveSalaryPayroll.receivableFromEmployee = 0;
            //    }
            //}




            vm.calculateEligibleValue = function () {
                if (!vm.lastTicketDate || !moment(vm.lastTicketDate).isValid()) {
                    console.error('Invalid last ticket date');
                    return;
                }

                if (vm.leaveSalaryPayroll.ticketPrice <= 0 || vm.airTicket.eligibleFor <= 0) {
                    console.error('Invalid ticket price or eligibility');
                    return;
                }

                // Change this line to calculate ticket price in final settlement dont take current date

                var ticketDate = vm.lastWorkingDay;
                var dateDifference = ticketDate.diff(moment(vm.lastTicketDate), 'days') + 1; // Include both dates
                // replace below line with above one
                //var currentDate = moment(new Date());
                //var dateDifference = currentDate.diff(moment(vm.lastTicketDate), 'days') + 1; // Include both dates

                // Define the thresholds
                var oneYearInDays = 365.25;
                /*var eligibleDays = Math.floor(dateDifference);*/
                var eligibleDays = Math.floor(Math.abs(dateDifference)); // take positive value


                if (eligibleDays > oneYearInDays) {
                    var eligibleYears = Math.floor(eligibleDays / oneYearInDays);
                    var remainingDays = eligibleDays % oneYearInDays;

                    vm.leaveSalaryPayroll.payableValue = eligibleYears * vm.airTicket.eligibleFor * vm.leaveSalaryPayroll.ticketPrice;

                    if (remainingDays > 0) {
                        var additionalMonths = remainingDays / 30; // Approximate to months
                        var proRatedValue = (additionalMonths / 12) * vm.airTicket.eligibleFor * vm.leaveSalaryPayroll.ticketPrice;
                        vm.leaveSalaryPayroll.payableValue += Math.floor(proRatedValue);
                    }

                    vm.leaveSalaryPayroll.eligible = 100; // Eligible for full amount
                } else {
                    vm.isTicketForFirstTime = vm.checkAirTicketForFirstTime();// Check get air ticket for first time
                    if (!vm.isTicketForFirstTime) {
                        vm.leaveSalaryPayroll.payableValue = Math.floor((eligibleDays / oneYearInDays) * vm.airTicket.eligibleFor * vm.leaveSalaryPayroll.ticketPrice);
                        vm.leaveSalaryPayroll.eligible = (eligibleDays / oneYearInDays) * 100;
                    }
                    else {
                        vm.leaveSalaryPayroll.payableValue = 0;
                        vm.leaveSalaryPayroll.eligible = 0;
                    }
                }

                vm.leaveSalaryPayroll.ticketQuota = vm.airTicket.eligibleFor;
                vm.leaveSalaryPayroll.receivableFromEmployee = vm.leaveSalaryPayroll.payableValue - vm.leaveSalaryPayroll.ticketQuota;

                // Dont show advanve amount option in air tick for gratuity
                //if (vm.leaveSalaryPayroll.payableValue < vm.leaveSalaryPayroll.ticketPrice && !vm.isTicketForFirstTime) {
                //    vm.isAdvanceTicketAmount = true;
                //    vm.leaveSalaryPayroll.ticketPayable = vm.leaveSalaryPayroll.ticketPrice;
                //    vm.leaveSalaryPayroll.amountAsAdvance = vm.leaveSalaryPayroll.ticketPrice - vm.leaveSalaryPayroll.payableValue;
                //} else {
                //    vm.isAdvanceTicketAmount = false;
                //}
            };

            // Check air ticket for first time
            vm.checkAirTicketForFirstTime = function () {

                if (vm.staff != null && vm.staff.dateOfJoining != null && vm.staff.dateOfConfirmation != null) {
                    if (vm.lastTicketDate != null) {
                        if (moment(vm.lastTicketDate).isSame(moment(vm.staff.dateOfJoining)) ||
                            moment(vm.lastTicketDate).isSame(moment(vm.staff.dateOfConfirmation))) {
                            return true;
                        }
                    }
                }
                return false;
            }

            vm.ontTicketPriceChange = function () {
                vm.leaveSalaryPayroll.receivableFromEmployee = vm.leaveSalaryPayroll.ticketQuota - vm.leaveSalaryPayroll.payableValue;
            }


            vm.process = () => {
                vm.filters.staffId = vm.staff.id;
                // check here for exception on receivableFromEmployee
                /*vm.filters.receivableFromEmployee = vm.leaveSalaryPayroll.receivableFromEmployee;*/
                vm.filters.payableValue = vm.leaveSalaryPayroll.payableValue;

                vm.filters.skipCount = vm.skipCount;
                vm.filters.annualLeavesStartDate = moment(vm.leave.fromDate);
                /*vm.filters.noOfAnnualLeaves = vm.leave.leaveType?.noOfLeaves;*/
                /*vm.filters.noOfAnnualLeaves = vm.leave?.fullPaidDays;*/ // Get no of paid days 
                vm.filters.noOfAnnualLeaves = vm.leave?.fullPaidDays || 0;

                /*vm.filters.isCalculateAsLeaveSalary = vm.leave?.leaveType?.calculateAsLeaveSalary;*/
                vm.loading = false;
                //Get Re-joining Date
                if (vm.staff != null) {
                    leaveSalaryPayrollService.getReJoiningDate(vm.staff.id).then(function (response) {
                        vm.lastReJoiningDate = response.data;
                        vm.leaveDuration = vm.filters.approvedAnnualLeaves;
                        vm.noOfAnnualLeaves = vm.filters.noOfAnnualLeaves;
                    });
                }
                // Calculate staff service days for gratuity
                var result = vm.calculateTenureAndCompletedYears();

                // Assign values to vm.filters
                vm.filters.serviceYearsForGratuity = result.completedYearsDecimal; // Number of completed years
                vm.serviceTenureDescription = result.tenure;

                payrollService.processLeaveTicket(vm.filters)
                    .success((r) => {
                        let payroll = r.payroll;
                        vm.totalCount = r.totalCount;
                        payroll.payrollDetails.forEach(pd => {
                            pd.payrollLines.forEach(pl => {
                                if (pl.type === 1 && !vm.additionHeaders.find(ah => ah.name === pl.name)) {
                                    vm.additionHeaders.push({ name: pl.name, order: pl.order });
                                }
                                else if (pl.type === 2 && !vm.deductionHeaders.find(dh => dh.name === pl.name)) {
                                    vm.deductionHeaders.push({ name: pl.name, order: pl.order });
                                }
                            });

                            additionAndDeductionValues(pd);
                            //payrollCalculation(pd);

                            pd.getSalaryItemAmount = (name) => {
                                let salaryItem = pd.payrollLines.find(pl => pl.name === name);
                                return salaryItem ? salaryItem.amount : 0;
                            }
                        });

                        if (!vm.payroll) {
                            vm.payroll = payroll;
                            // Get Ticket Value In Case Of Cancel Re-Process
                            /*vm.airTicketPrice = vm.payroll.payrollDetails[0].airTicket || 0;*/
                            vm.airTicketPrice = (vm.payroll && vm.payroll.payrollDetails && vm.payroll.payrollDetails.length > 0 && vm.payroll.payrollDetails[0].airTicket) || 0;

                            if (vm.airTicketPrice > 0) {
                                vm.leaveSalaryPayroll.payableValue = vm.airTicketPrice;
                                vm.leaveSalaryPayroll.ticketPrice = vm.payroll.payrollDetails[0].oneTicketPrice;
                                vm.leaveSalaryPayroll.eligible = vm.payroll.payrollDetails[0].eligibilityPercentage;
                                vm.isPayFullTicketPriceAndAdjustInSalary = vm.payroll.payrollDetails[0].isPayFullTicketPrice;
                            }
                            else {
                                vm.leaveSalaryPayroll.payableValue = 0;
                                /*vm.leaveSalaryPayroll.ticketPrice = 0;*/
                                vm.leaveSalaryPayroll.eligible = 0;
                                vm.isPayFullTicketPriceAndAdjustInSalary = false;
                            }
                        }
                        else {
                            payroll.payrollDetails.forEach(pd => {
                                vm.payroll.payrollDetails.push(pd);
                            });
                        }
                        vm.payroll.payrollDetails.sort((pd1, pd2) => pd1.netPay < pd2.netPay ? 1 : -1);

                        // Comment batchwise processing work 
                        //vm.skipCount = vm.skipCount + vm.batchSize;
                        //if (vm.skipCount < vm.totalCount)
                        //    vm.process();
                        //else {
                        //    vm.isProcess = false;
                        //    if (vm.state === 2 && !vm.filters.isReprocess) {
                        //        vm.isPayrollForSave = false;
                        //        vm.isPayrollForApprove = true;
                        //    }
                        //    else if (vm.state === 2 && vm.filters.isReprocess) {
                        //        vm.isPayrollForSave = true;
                        //        vm.isPayrollForApprove = false;
                        //        vm.isSaved = false;
                        //    }
                        //    else {
                        //        vm.isPayrollForSave = true;

                        //    }
                        //    vm.isProcessEnabled = false;
                        //}

                        vm.isProcess = false;
                        if (vm.state === 2 && !vm.filters.isReprocess) {
                            vm.isPayrollForSave = false;
                            vm.isPayrollForApprove = true;
                        }
                        else if (vm.state === 2 && vm.filters.isReprocess) {
                            vm.isPayrollForSave = true;
                            vm.isPayrollForApprove = false;
                            vm.isSaved = false;
                        }
                        else {
                            vm.isPayrollForSave = true;

                        }
                        vm.isProcessEnabled = false;
                    })
                    .finally(() => {
                        vm.isProcess = false;
                    });
            }
            function additionAndDeductionValues(pd) {
                pd.additionValues = [];
                pd.deductionValues = [];
                vm.additionHeaders.forEach(h => {
                    let v = pd.additionValues.find(x => x.name === h.name);
                    if (!v) {
                        let pl = pd.payrollLines.find(x => x.name === h.name);
                        pd.additionValues.push({ name: h.name, order: h.order, amount: pl ? pl.amount : 0 });
                    }

                });
                vm.deductionHeaders.forEach(h => {
                    let v = pd.deductionValues.find(x => x.name === h.name);
                    if (!v) {
                        let pl = pd.payrollLines.find(x => x.name === h.name);
                        pd.deductionValues.push({ name: h.name, order: h.order, amount: pl ? pl.amount : 0 });
                    }
                });
            }

            vm.processReferesh = () => {

                // Set default values if vm.leave is null
                const fromDate1 = vm.leave ? vm.leave.fromDate : new Date(); // Use current date as default
                const toDate1 = vm.leave ? vm.leave.toDate : new Date(); // Use current date as default

                vm.payroll = null;
                vm.skipCount = 0;

                /*vm.filters.fromDate = moment(vm.leave.fromDate).startOf('month').startOf('day');*/
                vm.filters.fromDate = moment(vm.lastWorkingDay).startOf('month').startOf('day');
                //vm.filters.toDate = moment(vm.leave.toDate);
                // Assuming vm.leave.toDate is a date string or a date object
                vm.filters.toDate = moment(vm.lastWorkingDay)/*.subtract(1, 'days')*/; // month duration include last working day
                /* vm.filters.toDate = moment(vm.leave.fromDate).subtract(1, 'days');*/
                vm.filters.staffId = vm.staff.id;
                vm.filters.businessUnitId = vm.businessUnitId; // Setting base payroll processing
                //var fromDateMoment = moment(vm.leave.fromDate);
                //vm.filters.toDate = fromDateMoment.subtract(1, 'day');
                //vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');


                vm.isProcess = true;
                payrollService.leaveProcessState(vm.filters)
                    .success((s) => {
                        vm.state = s;
                        if (s === 3) {
                            abp.message.warn('Unable to reprocess this month ,final settlement for this staff is already Processed and Approved.');
                            vm.isProcess = false;
                        }
                        else if (s === 2) {
                            vm.isProcess = true;
                            vm.isPayrollForSave = false;

                            abp.message.confirm(
                                'You want to Reprocess the final settlement? Previously saved final settlement for this month will be discarded',
                                'Are you sure?',
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        vm.filters.isReprocess = true;
                                        vm.leaveSalaryPayroll.ticketPrice = 0; //In Re-Processing
                                        vm.leaveSalaryPayroll.eligible = 0; //In Re-Processing
                                        vm.process();
                                    }
                                    else {
                                        vm.filters.isReprocess = false;
                                        vm.process();
                                    }
                                }
                            );
                        }
                        else {
                            vm.isProcess = true;
                            vm.isPayrollForSave = false;
                            vm.filters.isReprocess = false;

                            vm.process();
                        }
                    })
            }

            vm.approved = () => {
                vm.isApproving = true;

                payrollService.approved(vm.payroll.id)
                    .success(() => {
                        abp.notify.success("Successfully approved payroll.");
                    })
                    .finally(() => {
                        vm.isApproving = false;
                        vm.isPayrollForApprove = false;
                        vm.isApproved = true;
                    });
            }

            vm.rounding = (value) => {
                if (value === null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }


            vm.calculateTenureAndCompletedYears = function () {
                if (vm.lastWorkingDay != null && vm.firstWorkingDay != null) {
                    var lastWorkingDay = new Date(vm.lastWorkingDay);
                    var dateOfJoining = new Date(vm.firstWorkingDay);

                    if (lastWorkingDay.getTime() === dateOfJoining.getTime()) {
                        return {
                            tenure: "0 years, 0 months, 0 days",
                            completedYears: 0,
                            completedYearsDecimal: 0
                        };
                    }

                    // Check if the anniversary date is after the last working day
                    if (dateOfJoining > lastWorkingDay) {
                        return {
                            tenure: "Tenure information is not available.",
                            completedYears: 0,
                            completedYearsDecimal: 0
                        };
                    }

                    var years = lastWorkingDay.getFullYear() - dateOfJoining.getFullYear();
                    var months = lastWorkingDay.getMonth() - dateOfJoining.getMonth();
                    var days = lastWorkingDay.getDate() - dateOfJoining.getDate();

                    if (days < 0) {
                        months--;
                        var prevMonth = new Date(lastWorkingDay.getFullYear(), lastWorkingDay.getMonth(), 0);
                        days += prevMonth.getDate();
                    }

                    if (months < 0) {
                        years--;
                        months += 12;
                    }

                    var completedYears = years >= 0 ? years : 0; // Ensure no negative years

                    // Calculate completed years in decimal
                    var totalMonths = completedYears * 12 + months + (days / 30.44); // Average days in a month
                    var completedYearsDecimal = totalMonths / 12;

                    return {
                        tenure: `${years} years, ${months} months, ${days} days`,
                        completedYears: completedYears,
                        completedYearsDecimal: completedYearsDecimal.toFixed(3) // Format to 3 decimal places
                    };
                } else {
                    return {
                        tenure: "Tenure information is not available.",
                        completedYears: 0,
                        completedYearsDecimal: 0
                    };
                }
            };


            //vm.calculateTenureAndCompletedYears = function () {
            //    if (vm.lastWorkingDay != null && vm.firstWorkingDay != null) {
            //        var lastWorkingDay = new Date(vm.lastWorkingDay);
            //        var dateOfJoining = new Date(vm.firstWorkingDay);
            //        if (lastWorkingDay.getTime() === dateOfJoining.getTime()) {
            //            return {
            //                tenure: "0 years, 0 months, 0 days",
            //                completedYears: 0
            //            };
            //        }

            //        // Check if the anniversary date is after the last working day
            //        if (dateOfJoining > lastWorkingDay) {
            //            return {
            //                tenure: "Tenure information is not available.",
            //                completedYears: 0
            //            };
            //        }

            //        var years = lastWorkingDay.getFullYear() - dateOfJoining.getFullYear();
            //        var months = lastWorkingDay.getMonth() - dateOfJoining.getMonth();
            //        var days = lastWorkingDay.getDate() - dateOfJoining.getDate();

            //        if (days < 0) {
            //            months--;
            //            var prevMonth = new Date(lastWorkingDay.getFullYear(), lastWorkingDay.getMonth(), 0);
            //            days += prevMonth.getDate();
            //        }

            //        if (months < 0) {
            //            years--;
            //            months += 12;
            //        }

            //        var completedYears = years >= 0 ? years : 0; // Ensure no negative years

            //        return {
            //            tenure: `${years} years, ${months} months, ${days} days`,
            //            completedYears: completedYears
            //        };
            //    } else {
            //        return {
            //            tenure: "Tenure information is not available.",
            //            completedYears: 0
            //        };
            //    }
            //};

            vm.save = () => {
                vm.isSaving = true;

                // Update Ticket Value 
                if (vm.payroll && vm.payroll.payrollDetails) {
                    vm.payroll.payrollDetails.forEach(detail => {
                        if (vm.totalPayable > 0 && vm.leaveSalaryPayroll.ticketPrice > 0) {
                            // Perform updates on payrollDetail
                            detail.totalPayable = vm.totalPayable;
                            detail.oneTicketPrice = vm.leaveSalaryPayroll.ticketPrice;
                            detail.eligibilityPercentage = vm.leaveSalaryPayroll.eligible;
                            detail.isPayFullTicketPrice = vm.isPayFullTicketPriceAndAdjustInSalary;

                            //if (vm.leave && vm.leave.fromDate) {
                            //    detail.ticketIssuanceDate = vm.leave.fromDate;
                            //}
                            detail.ticketIssuanceDate = vm.lastWorkingDay; // Service end date is ticket issueance date

                            const ticketAmount = vm.isAdvanceTicketAmount && vm.isPayFullTicketPriceAndAdjustInSalary
                                ? vm.leaveSalaryPayroll.ticketPayable
                                : vm.leaveSalaryPayroll.payableValue;

                            detail.airTicket = ticketAmount;
                            detail.netSalary = detail.netSalary + ticketAmount; // Add ticket amount in net salary

                            // Check if ticket payrollLine exist and update the relevant line
                            if (detail.payrollLines) {
                                detail.payrollLines.forEach(line => {
                                    if (line.salaryItemId === 41) {
                                        line.amount = ticketAmount;
                                    }
                                    // Add advance loan in payroll line
                                    if (vm.isAdvanceTicketAmount && vm.isPayFullTicketPriceAndAdjustInSalary) {
                                        if (line.salaryItemId === 51) {
                                            line.amount = vm.leaveSalaryPayroll.amountAsAdvance;
                                        }
                                    }
                                });
                            }
                        }
                        detail.lastWorkingDay = vm.lastWorkingDay; // Save last working day
                    });
                }
                payrollService.save({
                    fromDate: vm.filters.fromDate,
                    toDate: vm.filters.toDate,
                    payroll: vm.payroll
                })
                    .success((id) => {
                        vm.payroll.id = id;
                        vm.isPayrollForApprove = true;
                        vm.isSaved = true;
                        abp.notify.success("Successfully saved payroll.");
                    })
                    .finally(() => {
                        vm.isSaving = false;
                        vm.isPayrollForSave = false;
                    });
            }

            vm.getAllBusinessUnits = () => {
                vm.loading = true;
                businessUnitService.getBusinessUnits({}).success(function (data) {
                    vm.businessUnits = data;
                }).finally(function () {

                });
            }

            init();

            function init() {
                // Get business units if setting is enabled
                if (vm.isBusinessUnitWisePayrollProcess)
                    vm.getAllBusinessUnits();

                designationDetails();
                vm.additionHeaders = [];
                vm.deductionHeaders = [];
                vm.isProcessEnabled = false;
                vm.isProcess = false;
                vm.isAdvanceTicketAmount = false;
                vm.isPayrollForSave = false;
                vm.isSaving = false;
                vm.isPayrollForApprove = false;
                vm.isApproving = false;
                vm.skipCount = 0;
                vm.batchSize = 1000;
                vm.totalCount = 0;
                vm.isSaved = false;
                vm.isApproved = false;
                vm.state = 1;
                vm.filters = {
                    skipCount: 0,
                    maxResultCount: vm.batchSize,
                    approvedAnnualLeaves: 0,
                    isCalculateGratuity: false
                    /*  isCalculateAsLeaveSalary: false,*/
                };
            }
        }
    ]);
