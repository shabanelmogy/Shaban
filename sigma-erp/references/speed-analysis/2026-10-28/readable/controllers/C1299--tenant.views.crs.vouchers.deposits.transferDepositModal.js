// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:340926-340969
appModule.controller('tenant.views.crs.vouchers.deposits.transferDepositModal', [
        '$uibModalInstance', 'depositId', 'customerId', 'abp.services.app.deposit', 'utilities',
        function ($uibModalInstance, depositId, customerId, depositService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchAgreement = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return depositService.searchAgreementForDeposit({ keyword: $select.search, customerId: customerId }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };
       
            vm.save = function () {
                
                vm.saving = true;
                depositService.transferDepositToAgreement(vm.deposit).success(function () {
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
                     }).finally(function () {
                         vm.loading = false;
                     });
            }

            init();
        }
    ]);
