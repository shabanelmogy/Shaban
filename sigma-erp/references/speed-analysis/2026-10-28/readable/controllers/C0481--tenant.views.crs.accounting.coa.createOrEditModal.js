// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:122582-122626
appModule.controller('tenant.views.crs.accounting.coa.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.account', 'accountId', 'parentId', 'newAccountCode','utilities',
        function ($scope, $uibModalInstance, accountService, accountId, parentId, newAccountCode, utilities) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.isExternalAccountCodeEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsExternalAccountCodeEnabled"));
            vm.save = function () {
                vm.saving = true;
                
                accountService.createOrUpdateAccount({
                    account: vm.account,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function init() {
                accountService.getAccountForEdit({
                    id: accountId,
                    parentId: parentId
                }).success(function (result) {
                    vm.account = result;

                    if (vm.account.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                        vm.account.accountCode = newAccountCode;
                    }
                });
            }

            init();
        }
    ]);
