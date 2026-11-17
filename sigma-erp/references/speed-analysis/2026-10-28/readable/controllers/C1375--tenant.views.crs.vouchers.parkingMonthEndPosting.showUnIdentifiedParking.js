// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:370448-370476
appModule.controller('tenant.views.crs.vouchers.parkingMonthEndPosting.showUnIdentifiedParking', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'unIdentifiedParkings', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, limoTripsService, unIdentifiedParkings, utilities) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.limoFareReadOnly = false;
            vm.unIdentifiedParkings = unIdentifiedParkings;
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
