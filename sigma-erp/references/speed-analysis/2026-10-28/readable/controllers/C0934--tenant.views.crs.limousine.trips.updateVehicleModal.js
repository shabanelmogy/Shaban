// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:254050-254115
appModule.controller('tenant.views.crs.limousine.trips.updateVehicleModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleModel', 'abp.services.app.directory', 'abp.services.app.googleMapAPI', '$sce',
        'abp.services.app.commonLookup', 'abp.services.app.limoTrip', 'abp.services.app.tripType', 'abp.services.app.vehicle', 'utilities', 'abp.services.app.invoice', 'appSession', 'trip',
        function ($scope, $uibModal, $uibModalInstance, vehicleModelService, directoryService,
            mapService, $sce, commonLookupService, tripService, tripTypeService, vehicleService, utilities, invoiceService, appSession, trip) {

            var vm = this;
            vm.trip = trip;
            vm.vehicle = trip.vehicle;
            vm.saving = false;

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, tariffGroupId: trip.tariffGroupId }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchVehiclePopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                tariffGroupId: trip.tariffGroupId,
                                allSelectable: true
                            };
                        }
                    }
                }).result.then(function (vehicle) {
                    if (vehicle != null) {
                        vm.vehicle = vehicle;
                    }
                });
            };

            vm.clearVehicle = () => {
                vm.vehicle = null;
            }

            vm.save = () => {
                vm.saving = true;
                tripService
                    .updateVehicle({ tripId: trip.id, vehicleId: vm.vehicle.id })
                    .success(() => {
                        $uibModalInstance.close({ tripId: trip.id, vehicle: vm.vehicle });
                    })
                    .finally(() => {
                        vm.saving = false;
                    });
            }

            vm.cancel = () => {
                $uibModalInstance.close();
            }

            function init() {
            }

            init();
        }
    ]);
