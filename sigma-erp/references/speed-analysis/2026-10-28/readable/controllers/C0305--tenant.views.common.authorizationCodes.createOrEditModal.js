// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85137-85205
appModule.controller('tenant.views.common.authorizationCodes.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.authorizationCode', 'authorizationCodeId', 'abp.services.app.user',
        function ($scope, $uibModalInstance, authorizationCodeService, authorizationCodeId, userService) {

            var vm = this;
            vm.saving = false;
            vm.authorizationCode = null;
            vm.isEditMod = false;
            vm.isCodeDisabledDefaut = true;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.validHours =
                [
                    1, 2, 3

                ];
            vm.authCodeTypes = [
               // { id: 1, name: app.localize("Discount") },
                { id: 2, name: app.localize("AllowAgreementIfCreditLimitExceeded") }
            ];

            vm.validityType =
                {
                    "Hours": 1,
                    "Days": 2
                }

            vm.save = function () {
                vm.saving = true;
                vm.authorizationCode.createdForUserId = vm.authorizationCode.createdForUser ? vm.authorizationCode.createdForUser.id : null;
                if (vm.validForDays && vm.authorizationCode.validForHours == null)
                    vm.authorizationCode.validForHours = vm.validForDays * 24;
                authorizationCodeService.createOrUpdateAuthorizationCode({
                    authorizationCode: vm.authorizationCode
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            vm.preventfloat = function ($event) {
                if ($event.which == '46' || $event.which == '190')
                    event.preventDefault();
            };

            vm.searchUsers = function ($select) {

                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            function init() {
                vm.loading = true;
                authorizationCodeService.getAuthorizationCodeForEdit({ id: authorizationCodeId }).success(function (data) {
                    vm.authorizationCode = data;
                    vm.authorizationCode.usesLimit = 1;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
