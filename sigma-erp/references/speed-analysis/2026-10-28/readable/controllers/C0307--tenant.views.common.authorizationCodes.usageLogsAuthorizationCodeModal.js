// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85499-85532
appModule.controller('tenant.views.common.authorizationCodes.usageLogsAuthorizationCodeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.authorizationCode', 'authorizationCode', 'abp.services.app.user',
        function ($scope, $uibModalInstance, authorizationCodeService, authorizationCode, userService ) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.authorizationCode = authorizationCode;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function init() {
                vm.loading = true;
                authorizationCodeService.getAuthorizationCodeUsageLog({ id: authorizationCode.id }).success(function (data) {
                    vm.authorizationCodeUses = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
