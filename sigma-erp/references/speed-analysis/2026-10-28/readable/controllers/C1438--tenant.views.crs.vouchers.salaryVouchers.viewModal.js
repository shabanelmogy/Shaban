// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:395105-395169
appModule.controller('tenant.views.crs.vouchers.salaryVouchers.viewModal', ['abp.services.app.salaryVoucher', '$uibModalInstance', 'utilities', 'salaryVoucherId',
        function (salaryVouchersService, $uibModalInstance, utilities, salaryVoucherId) {

            var vm = this;
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

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
          
            vm.salaryVoucherType = [{ id: 111, name: 'Payroll' }, { id: 112, name: 'Leave Salary' }, { id: 113, name: 'Final Settlement' }];

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getSalaryVoucherForView = function () {

                vm.loading = true;

                salaryVouchersService.getSalaryVoucherForEdit({ Id: salaryVoucherId }).success(function (data) {

                    vm.salaryVoucher = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.loading = true;
                vm.getSalaryVoucherForView();
            }
            init();
        }]);
