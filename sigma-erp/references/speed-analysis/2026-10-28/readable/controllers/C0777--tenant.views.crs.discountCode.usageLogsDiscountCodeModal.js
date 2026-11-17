// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:202208-202241
appModule.controller('tenant.views.crs.discountCode.usageLogsDiscountCodeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.discountAuthCode', 'discountCode', 'abp.services.app.user',
        function ($scope, $uibModalInstance, discountCodeService, discountCode, userService ) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.discountCode = discountCode;

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
                discountCodeService.getDiscountAuthCodeUsageLog({ id: discountCode.id }).success(function (data) {
                    vm.discountCodeUses = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
