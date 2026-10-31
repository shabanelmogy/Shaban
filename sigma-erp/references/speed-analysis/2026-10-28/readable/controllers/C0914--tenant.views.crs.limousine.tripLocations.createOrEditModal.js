// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247615-247682
appModule.controller('tenant.views.crs.limousine.tripLocations.createOrEditModal', [
        '$uibModalInstance','abp.services.app.googleMapAPI', '$sce', 'tripLocationId',
        'abp.services.app.tripLocation', 'abp.services.app.commonLookup',
    function ($uibModalInstance,
        mapService, $sce, tripLocationId, tripLocationService, commonLookupService) {
        var vm = this;
        vm.isEditMode = false;
        
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        // Searching Places Google MapApi
        vm.searchLocations = function($select) {
            return commonLookupService.searchGooglePlaces({ keyWord: $select.search }).then(function(response) {
                vm.pickUpLocations = response.data.items;
            });
        };
        
        vm.locationSelected = function () {
            vm.geoLocation.shortName = vm.geoLocation.title;
            vm.geoLocation.detail = vm.geoLocation.title;
            drawLocation(vm.geoLocation);
        };
        
        vm.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        function drawLocation(location) {
            mapService.getMap({
                placeId: location.webID,
                PlaceName: location.title
            }).success(function (data) {
                vm.src = data.mapSrc;
            });
        }

        vm.save = function () {
            vm.saving = true;
            vm.geoLocation.title = vm.geoLocation.shortName;
            tripLocationService.createOrUpdateTrip({
                geoLocation: vm.geoLocation,
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        function init() {
            vm.loading = true;
            tripLocationService.getTripLocationForEdit({ id: tripLocationId }).success(function (data) {
                vm.geoLocation = data;
                if (tripLocationId > 0) {
                    vm.isEditMode = true;
                    vm.geoLocation.shortName = vm.geoLocation.title;
                    drawLocation(vm.geoLocation);
                }
            }).finally(function () {
                vm.loading = false;
            });

        }
        init();
    }
    ]);
