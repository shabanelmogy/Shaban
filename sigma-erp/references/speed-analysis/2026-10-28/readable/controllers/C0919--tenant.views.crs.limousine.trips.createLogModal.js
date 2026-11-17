// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:248529-248574
appModule.controller('tenant.views.crs.limousine.trips.createLogModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'tripId',
    function ($scope, $uibModal, $uibModalInstance, limoTripsService, tripId) {

        var vm = this;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.saving = false;
        vm.isEditMod = false;
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.tripLog = {
            tripId: tripId,
            notes: '',

        }
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };
        //function init() {
        //    vm.loading = true;
        //    limoTripsService.getTripLogs({ id: tripId }).success(function (result) {
        //        vm.tripLog = result.items;
        //    }).finally(function () {
        //        vm.loading = false;
        //    });
        //}
        //init();
        vm.save = function () {
            vm.saving = true;
            limoTripsService.addTripLog({ tripLog: vm.tripLog }).success(function (result) {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        }
    }
    ]);
