// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85569-85609
appModule.controller('tenant.views.common.authorizationCodes.viewAuthCodeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.authorizationCode', 'authorizationCodeId',
        function ($scope, $uibModalInstance, authorizationCodeService, authorizationCodeId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.authCodeTypes = [
                // { id: 1, name: app.localize("Discount") },
                { id: 2, name: app.localize("AllowAgreementIfCreditLimitExceeded") }
            ];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function init() {
                authorizationCodeService.getAuthorizationCodeForView({
                    id: authorizationCodeId
                }).success(function (result) {
                    vm.authorizationCode = result;
                    
                   
                });
            }

            init();
        }
    ]);
