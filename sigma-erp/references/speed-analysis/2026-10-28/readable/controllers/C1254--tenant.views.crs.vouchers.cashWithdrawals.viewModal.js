// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329501-329563
appModule.controller('tenant.views.crs.vouchers.cashWithdrawals.viewModal', [
        'cashWithdrawalId', 'abp.services.app.cashWithdrawalSearch', '$uibModalInstance','utilities',
        function (cashWithdrawalId, cashWithdrawalSearchService, $uibModalInstance,utilities) {

            var vm = this;
            vm.cashWithdrawal = null;
            vm.saving = false;
            vm.isEditMod = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.currentDate = moment().endOf('day');

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function getCurrencies() {
                commonLookupService.getCurrencies({}).success(function (data) {
                    vm.currencies = data.items;
                });
            };

            function init() {
                vm.loading = true;
                cashWithdrawalSearchService.getCashWithdrawalForView({
                    id: cashWithdrawalId
                }).success(function (result) {
                    vm.cashWithdrawal = result;
                    vm.isEditMod = true;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
