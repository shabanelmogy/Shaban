// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:334820-334848
appModule.controller('tenant.views.crs.vouchers.darbMonthEndPosting.showUnIdentifiedDarbs', [
        '$uibModalInstance', 'unIdentifiedTolls', 'utilities',
        function ($uibModalInstance, unIdentifiedTolls, utilities) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.limoFareReadOnly = false;
            vm.unIdentifiedTolls = unIdentifiedTolls;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

        }
    ]);
