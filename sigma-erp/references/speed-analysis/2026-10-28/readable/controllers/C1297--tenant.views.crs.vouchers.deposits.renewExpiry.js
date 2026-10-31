// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:340761-340807
appModule.controller('tenant.views.crs.vouchers.deposits.renewExpiry', [
        '$scope', '$uibModal', '$uibModalInstance', 'depositId',  'abp.services.app.deposit', 
        function ($scope, $uibModal, $uibModalInstance, depositId, depositService) {

            var vm = this;
            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

       
            vm.save = function () {
                
                vm.saving = true;
                //vm.deposit.toDate.moment().endOf('day').utc();
                moment(vm.deposit.toDate.endOf('day')).utc()
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
                         console.log(vm.deposit);
                         vm.mydate = vm.deposit.toDate;
                         vm.deposit.toDate = null;
                     
                     }).finally(function () {
                         vm.loading = false;
                     });
            }

            init();
        }
    ]);
