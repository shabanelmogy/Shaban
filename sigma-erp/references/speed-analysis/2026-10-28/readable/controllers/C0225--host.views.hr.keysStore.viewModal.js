// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71607-71636
appModule.controller('host.views.hr.keysStore.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.secretKey', 'secretKeyId', 'abp.services.app.user',
        function ($scope, $uibModalInstance, secretKeyService, secretKeyId, userService) {
            var vm = this;
            vm.keyStore = {};
            vm.saving = false;
            vm.authorizedUser = "";

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.twoFactorAuthenticationTypes = [
                { id: 1, value: 'SMS' },
                { id: 2, value: 'Email' },
                { id: 3, value: 'Google Authenticator' }
            ];

            function init() {
                secretKeyService.getForView({ id: secretKeyId })
                    .success(function (r) {
                        vm.keyStore = r;
                        vm.authorizedUser = r.assignedToUser.userName;
                        vm.keyStore.twoFactorAuthenticationType = vm.twoFactorAuthenticationTypes.find(x => x.id == vm.keyStore.twoFactorAuthenticationType).value;
                    });
            }

            init();
        }
    ]);
