// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436766-436892
appModule.controller('tenant.views.hrm.employeeDutySchedule.index', [
            '$scope', 'abp.services.app.employeeDutySchedule', 'utilities', 'appSession', '$stateParams', '$uibModal', 'abp.services.app.directory',
        function ($scope, employeeDutyScheduleService, utilities, appSession, $stateParams, $uibModal, directoryService) {
            var vm = this;
            vm.invalidForm = false;
            
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get staff
                return directoryService.searchStaff({ keyword: $select.search, contactType: $stateParams.contactType }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactStaffModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactStaffModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return $stateParams.contactType;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.employee = customer;
                    }
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            
            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };

            $scope.onFocusChange = function ($event) {
                setTimeout(function () {
                    $event.target.select();
                }, 200);
            }

            vm.changeTime = function () {
                vm.invalidForm = false;
                angular.forEach(vm.employDutySchedule.schedules, function(elem, index) {
                    if (!(elem.in1 == null || elem.in1 == '') && (elem.out1 == null || elem.out1 == '')) {
                        vm.invalidForm = true;
                    }
                    if (!(elem.in2 == null || elem.in2 == '') && (elem.out2 == null || elem.out2 == '')) {
                        vm.invalidForm = true;
                    }
                    //if (!(elem.in1 == null || elem.in1 == '') && !(elem.out1 == null || elem.out1 == '')) {
                    //    if (elem.out1 > elem.in1) {
                    //        elem.editableSecondInOut = false;
                    //    }
                    //    else {
                    //        elem.editableSecondInOut = true;
                    //    }
                    //} else {
                    //    elem.editableSecondInOut = true;
                    //}
                });
            };

            vm.changeEmptyToNull = function() {
                angular.forEach(vm.employDutySchedule.schedules, function(elem, index) {
                    if (elem.in1 == '') {
                        elem.in1 = null;
                    }
                    if (elem.out1 == '') {
                        elem.out1 = null;
                    }
                    if (elem.out2 == '') {
                        elem.out2 = null;
                    }
                    if (elem.in2 == '') {
                        elem.in2 = null;
                    }
                });
            };

            vm.save = function() {
                vm.loading = true;
                vm.changeEmptyToNull();
                employeeDutyScheduleService.saveSchedule(vm.employDutySchedule).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function() {
                    vm.loading = false;
                });
            };
            
            vm.getEmployDutySchedule = function () {
                vm.loading = true;
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day');
                vm.filters.employeeId = vm.employee.id;
                employeeDutyScheduleService.getScheduleForEdit(vm.filters).success(function (data) {
                    vm.employDutySchedule = data;
                    vm.changeTime();
                }).finally(function () {
                    vm.loading = false;
                });
            };
        }
    ]);
