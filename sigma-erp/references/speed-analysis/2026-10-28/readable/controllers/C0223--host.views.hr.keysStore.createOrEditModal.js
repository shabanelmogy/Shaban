// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71401-71502
appModule.controller('host.views.hr.keysStore.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.secretKey', 'secretKeyId', 'abp.services.app.user',
        function ($scope, $uibModal, $uibModalInstance, secretKeyService, secretKeyId, userService) {
            var vm = this;
            vm.keyStore = {};
            vm.saving = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            var passwordEncripted = '';
            var passwordNormal = '';
            vm.passwordShown = false;

            function setPassword() {
                if (!vm.passwordShown) {
                    vm.keyStore.password = passwordNormal;
                    document.getElementById('keyPassword').type = "text";
                    vm.passwordShown = true;
                }
                else {
                    vm.keyStore.password = passwordEncripted;
                    document.getElementById('keyPassword').type = "password";
                    vm.passwordShown = false;
                }
            }

            vm.showPassword = function (keyStoreId) {
                if (!passwordNormal)
                    secretKeyService.getForView({ id: keyStoreId })
                        .success(function (r) {
                            passwordNormal = r.password;
                            setPassword();
                        });
                else
                    setPassword();


            };

            vm.save = function () {
                vm.saving = true;

                if (vm.keyStore.assignedToUser)
                    vm.keyStore.assignedToUserId = vm.keyStore.assignedToUser.id;

                //if (vm.keyStore.id && !vm.passwordShown)
                //vm.keyStore.password = passwordEncripted;

                secretKeyService.createOrUpdateSecretKey({ secretKey: vm.keyStore })
                    .success(function () {
                        abp.notify.info('Saved Successfully');
                        $uibModalInstance.close();
                    })
                    .finally(function () {
                        vm.saving = false;
                        vm.loading = false;
                    });
            };

            vm.twoFactorAuthenticationTypes = [
                { id: 1, value: 'SMS' },
                { id: 2, value: 'Email' },
                { id: 3, value: 'Google Authenticator' },
                { id: 4, value: 'Other' }
            ];

            vm.refresh = function () {
                secretKeyService.getSecretKeyForEdit({ id: secretKeyId })
                    .success(function (r) {
                        vm.keyStore = r;
                        passwordEncripted = vm.keyStore.password;

                        if (!r)
                            vm.keyStore.securityQuestions = [{ question: '', answer: '' }];
                    });
            };

            function init() {
                vm.refresh();
            }

            vm.keyStore.assignedToUser = null;
            vm.clearUser = function () {
                vm.keyStore.assignedToUser = null;
                vm.keyStore.assignedToUserId = null;
            };

            vm.users = [];
            vm.searchUsers = function ($select) {
                if ($select.search === "")
                    return null;
                userService.searchUsers({ keyword: $select.search })
                    .then(function (response) {
                        vm.users = response.data.items;
                    });
            };

            init();
        }
    ]);
