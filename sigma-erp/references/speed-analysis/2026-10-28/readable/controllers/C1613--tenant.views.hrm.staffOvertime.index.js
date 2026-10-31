// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:443323-443433
appModule.controller('tenant.views.hrm.staffOvertime.index', [
            'abp.services.app.employeeOvertime', 'utilities', '$stateParams', '$uibModal', 'abp.services.app.directory',
        function (employeeOvertimeService, utilities, $stateParams, $uibModal, directoryService) {
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

            //vm.getlocalDateTime = function (date) {
            //    if (date != null) {
            //        var localTime = moment.utc(date).toDate();
            //        return moment(localTime).format(vm.dateFormat);
            //    }
            //    else {
            //        return "";
            //    }
            //};

            //vm.getlocalTime = function (date) {
            //    if (date != null) {
            //        var localTime = moment.utc(date).toDate();
            //        return moment(localTime).format('HH:mm');
            //    }
            //    else {
            //        return "";
            //    }
            //};

            //$scope.onFocusChange = function ($event) {
            //    setTimeout(function () {
            //        $event.target.select();
            //    }, 200);
            //}

            vm.changeAmountandMinutes = function () {
                vm.invalidForm = false;
                angular.forEach(vm.employStaffOvertime.overtimes, function (elem, index) {
                    if (!(elem.overtimeMinutes == null || elem.overtimeMinutes == '') && (elem.amount == null || elem.amount == '')) {
                        vm.invalidForm = true;
                    }
                    //if (!(elem.amount == null || elem.amount == '') && (elem.overtimeMinutes == null || elem.overtimeMinutes == '')) {
                    //    vm.invalidForm = true;
                    //}
                });
            };

            vm.changeEmptyToNull = function () {
                angular.forEach(vm.employStaffOvertime.overtimes, function (elem, index) {
                    if (elem.overtimeMinutes == '') {
                        elem.overtimeMinutes = null;
                    }
                    if (elem.amount == '') {
                        elem.amount = null;
                    }
                });
            };

            vm.save = function () {
                vm.loading = true;
                vm.changeEmptyToNull();
                employeeOvertimeService.saveEmployeeOvertime(vm.employStaffOvertime).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getStaffOvertime = function () {
                vm.loading = true;
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day');
                vm.filters.employeeId = vm.employee.id;
                employeeOvertimeService.getStaffOvertime(vm.filters).success(function (data) {
                    vm.employStaffOvertime = data;
                    vm.changeAmountandMinutes();
                }).finally(function () {
                    vm.loading = false;
                });
            };
        }
    ]);
