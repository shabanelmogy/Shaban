// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:253902-253940
appModule.controller('tenant.views.crs.limousine.trips.startTripModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.limoTrip', 'utilities', 'tripId',
    function ($scope, $uibModalInstance, limoTripsService, utilities, tripId) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));  
        vm.trackMileage = utilities.parseBoolean(abp.setting.get("App.General.Trip_TrackMileage"));

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        vm.save = function () {
            vm.saving = true;
            limoTripsService.startTrip({
                
                trip: vm.trip,
              
            
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };
        function init() {
            limoTripsService.getTripForEdit({ id: tripId }).success(function (data) {
                vm.trip = data;
                vm.trip.startingkms = vm.trip.vehicle.kMs;
                vm.pickUpdate = vm.trip.pickupDateTime;
            }).finally(function () {
                vm.loading = false;
            });
        }
        init();
    }
    ]);
