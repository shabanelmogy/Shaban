// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:100696-100764
appModule.controller('tenant.views.common.hrm.paySlips.report', ['$scope', 'abp.services.app.salaryVoucher', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, salaryVoucherService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.totalAmount = 0;
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            if (vm.filters.voucherNo) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.roundAmount = function (amount) {
                return utilities.round(amount, 2);
            }

            vm.salaryVoucherTypes = function (value) {
                if (value === 111) {
                    return 'Payroll';
                }
                else if (value === 112) {
                    return 'Leave Salary';
                }
                else {
                    return 'Final Settlement';
                }
            };

            function init() {
                vm.loading = true;

                salaryVoucherService.getSalaryVouchersReport(vm.filters).success(function (data) {
                    vm.salaryVoucherReportData = data.items;
                    angular.forEach(vm.salaryVoucherReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                    vm.totalAmount = vm.totalAmount.toFixed(2);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }]);
