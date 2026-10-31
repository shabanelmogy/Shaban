// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85535-85566
appModule.controller('tenant.views.common.authorizationCodes.verifyAuthCodeModal', ['$uibModalInstance', 'abp.services.app.authorizationCode', 'validationObj','utilities',
        function ($uibModalInstance, authorizationCodeService, validationObj, utilities) {

            var vm = this;
            vm.loading = false;
            vm.isAuthCodeEnabled = abp.features.isEnabled("Core.AuthorizationCodes");

            vm.validationObj = validationObj;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
            vm.rounding = function (value) {

                return utilities.round(value, 2);
            };
            vm.verify = function () {
                vm.saving = true;

                    authorizationCodeService.verifyCode({
                        code: vm.authCode,
                        type: 2                   // Allow Agreement If Credit Limit Exceeded
                    }).success(function (result) {
                        abp.notify.info(app.localize('CodeValidated'));
                        $uibModalInstance.close(result);
                    }).finally(function () {
                        vm.saving = false;
                    });
            };
        }
    ]);
