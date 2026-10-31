// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:339666-339719
appModule.controller('tenant.views.crs.vouchers.deposits.extendHoldDaysModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'depositId', 'abp.services.app.deposit', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, depositId, depositService, utilities) {

            var vm = this;
            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getDaysFromDates(fromdate, todate) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date(fromdate);
                var secondDate = new Date(todate);
                if (fromdate != null && todate != null) {
                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    return diffDays;
                }
                else
                    return "";
            }
       
            vm.save = function () {
                
                vm.saving = true;
                vm.deposit.toDate = moment(vm.deposit.fromDate).add(vm.deposit.newholdForDays, 'day');
                depositService.createOrUpdateDeposit({
                    deposit: vm.deposit,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });


            };
            function init() {
                vm.loading = true;
                depositService.getDepositForEdit({ id: depositId }).success(
                     function (result) {
                         vm.deposit = result;
                         vm.deposit.holdForDays = getDaysFromDates(vm.deposit.fromDate, vm.deposit.toDate);
                     }).finally(function () {
                         vm.loading = false;
                     });
            }

            init();
        }
    ]);
