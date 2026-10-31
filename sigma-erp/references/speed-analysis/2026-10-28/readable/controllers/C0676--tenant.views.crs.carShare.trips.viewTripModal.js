// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:175135-175229
appModule.controller('tenant.views.crs.carShare.trips.viewTripModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.googleMapAPI', '$sce', 'trip', 'abp.services.app.tripType',
    function ($scope, $uibModal, $uibModalInstance,
        mapService, $sce, trip, tripTypeService) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.customers = [];
        vm.trip = null;
        vm.getTripStatus = function (status) {
            if (status == 1)
                return app.localize("New");
            if (status == 2)
                return app.localize("Dispatched");
            if (status == 3)
                return app.localize("Started");
            if (status == 4)
                return app.localize("Finished");
            if (status == 5)
                return app.localize("Canceled");
            if (status == 6)
                return app.localize("NoShow");
            return '';
        }
        vm.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD HH:mm');
            }
            else {
                return "";
            }
        };
        vm.getlocalTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('HH:mm');
            }
            else {
                return "";
            }
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        // Getting Distance Map Between Two Places 
        drawMap = function () {
            mapService.getETA({ fromLocationId: vm.limo.pickupLocation.webID, fromLocation: vm.limo.pickupLocation.title, toLocationId: vm.limo.dropOffLocation.webID, toLocation: vm.limo.dropOffLocation.title }).success(function (data) {
                vm.src = data.mapSrc;
            });
        }
        function getTripTypes() {
            tripTypeService.getTripTypes().success(function (data) {
                vm.tripTypes = data.items;
            });
        }
        vm.viewCharges = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/limousine/trips/changeChargesModal.cshtml',
                controller: 'tenant.views.crs.limousine.trips.changeChargesModal as vm',
                backdrop: 'static',
                resolve: {
                    options: function () {
                        return {
                            trip: vm.limo,
                            viewMode:true
                        };
                    }
                }
            });

        };
        function init() {
           
            vm.limo = trip;
            drawMap();
           // getTripTypes();
            //limoTripsService.getTripForEdit({ id: tripId }).success(function (data) {
            //    vm.limo = data;
            //    if (vm.limo.id > 0)
            //        drawMap();
            //}).finally(function () {
            //    vm.loading = false;
            //});

        }
        init();
    }
    ]);
