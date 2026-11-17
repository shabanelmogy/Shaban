// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:442588-442762
appModule.controller('tenant.views.hrm.shift.createOrEditModal', [
        '$uibModalInstance', '$uibModal', 'abp.services.app.directory', 'abp.services.app.designation', 'abp.services.app.shift', 'abp.services.app.commonLookup', 'abp.services.app.department', 'options',
        function ($uibModalInstance, $uibModal, directoryService, designationService, shiftService, commonLookupService, staffDepartmentService, options) {


            var vm = this;
            vm.loading = false;
            vm.shiftTypes = [];
            vm.locations = [];
            vm.isDesignationFeatureEnabled = abp.features.isEnabled("Core.Staff.Designations");
            var shiftId = options.id;
            //vm.weekendDays = [               
            //    { dayOfWeek: 'Monday' },
            //    { dayOfWeek: 'Tuesday' },
            //    { dayOfWeek: 'Wednesday' },
            //    { dayOfWeek: 'Thursday' },
            //    { dayOfWeek: 'Friday' },
            //    { dayOfWeek: 'Saturday' },
            //    { dayOfWeek: 'Sunday' },
            //];
            vm.weekendDays = [
                { dayOfWeek: 1, dayValue: 'Monday' },
                { dayOfWeek: 2, dayValue: 'Tuesday' },
                { dayOfWeek: 3, dayValue: 'Wednesday' },
                { dayOfWeek: 4, dayValue: 'Thursday' },
                { dayOfWeek: 5, dayValue: 'Friday' },
                { dayOfWeek: 6, dayValue: 'Saturday' },
                { dayOfWeek: 7, dayValue: 'Sunday' },
            ];
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
            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function getLocations() {

                commonLookupService.getLocations({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };
            function getStaffDepartments() {
                staffDepartmentService.getDepartment({}).success(function (data) {
                    vm.staffDepartments = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            var designationDetails = function () {
                designationService.getDesignations().success(function (result) {
                    vm.designationDetails = result.items;
                    //console.log(test);
                });
            };
            vm.searchStaff = function ($select) {
                //whereas contactType: 1 (staff) 
                return directoryService.search({ keyword: $select.search, activeOnly: true, contactType: 1 }).then(function (response) {
                    vm.customers = response.data.items;
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
                }).result.then(function (result) {
                    if (result != null) {
                        vm.onStaffSelect(result);
                    }
                });
            };

            vm.onStaffSelect = function (customer) {
                vm.shift.staffId = customer.id;
                vm.shift.staff = customer;
            };
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
            vm.save = function () {
                vm.saving = true;
                shiftService.createOrUpdateShift({ shift: vm.shift }
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            //init 
            function init() {
                //getLocations();
                //getStaffDepartments();
                //if (vm.isDesignationFeatureEnabled)
                //    designationDetails();
                if (shiftId != null && shiftId != '' && shiftId != undefined) {
                    vm.loading = true;
                    shiftService.getShiftForEdit({ id: shiftId }).success(
                        function (result) {
                            vm.shift = result;
                            var mappedWeekendDays = vm.shift.weekendDays.map(function (weekendDay) {
                                return {
                                    dayOfWeek: weekendDay.dayOfWeek,
                                    dayValue: mapNumberToDay(weekendDay.dayOfWeek),
                                };
                            });
                            console.log(mappedWeekendDays);
                            vm.shift.weekendDays = mappedWeekendDays;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

            }

            init();
        }
    ]);
