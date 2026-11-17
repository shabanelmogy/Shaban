// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342253-342280
appModule.controller('tenant.views.crs.vouchers.fineMonthEndPosting.showUnIdentifiedFines', [
    '$uibModalInstance',  'unIdentifiedFines', 'utilities',
    function ( $uibModalInstance, unIdentifiedFines, utilities) {

        var vm = this;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.unIdentifiedFines = unIdentifiedFines;
        vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.rounding = function (amount) {
            return utilities.round(amount, 2);
        };

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };

    }
    ]);
