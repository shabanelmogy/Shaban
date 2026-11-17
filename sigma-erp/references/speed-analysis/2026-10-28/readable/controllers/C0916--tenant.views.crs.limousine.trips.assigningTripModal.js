// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247839-247991
appModule.controller('tenant.views.crs.limousine.trips.assigningTripModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.vehicle', 'abp.services.app.limoTrip', 'utilities', 'tripId',
        function ($scope, $uibModal, $uibModalInstance, directoryService, vehicleService, limoTripsService, utilities, tripId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            var previousDriverId = null;
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.otherGroupsVehiclePermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanSelectOtherGroupsVehicleOnDispatchment');
            vm.searchOtherGroupsVehicle = false;
            vm.whileDispatchingTripAllowOnlySelect = parseInt(abp.setting.get("App.General.Trip_WhileDispatchingTripAllowOnlySelect"));

            vm.isAttachVehicleWithAppPermanentlyEnabled = abp.features.isEnabled('CRS.Limousine.AttachVehicleWithAppPermanently');
            vm.isDispatchingThroughChauffeurQueueEnabled = abp.features.isEnabled('CRS.Limousine.DispatchingThroughChauffeurQueue');
            vm.separateDateAndTime = utilities.parseBoolean(abp.setting.get("App.General.Limo.SeparateDateAndTime"));
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.trip.tariffGroupId }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.searchDrivers = function ($select) {
                if (!vm.whileDispatchingTripAllowOnlySelect > 0)
                    vm.whileDispatchingTripAllowOnlySelect = null;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.searchStaff({ keyword: $select.search, designationId: vm.whileDispatchingTripAllowOnlySelect }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            //vm.save = function () {
            //    vm.saving = true; 
            //    if (previousDriverId == vm.trip.driverId )
            //    limoTripsService.dispatchTrip({
            //        trip: vm.trip,
            //    }).success(function () {
            //        abp.notify.info(app.localize('SavedSuccessfully'));
            //        $uibModalInstance.close();
            //    }).finally(function () {
            //        vm.saving = false;
            //    });
            //};

            vm.vehicleSelected = function () {
                getStaffShiftByVehicleOrDriver({ vehicleId: vm.trip.vehicle.id });
            };
            vm.driverSelected = function () {
                getStaffShiftByVehicleOrDriver({ staffId: vm.trip.driver.id });
            };

            function getStaffShiftByVehicleOrDriver(input) {
                if (vm.isAttachVehicleWithAppPermanentlyEnabled) {
                    limoTripsService.getStaffShiftByVehicleOrDriver(input).success(function (result) {
                        if (result) {
                            vm.trip.driver = result.driver;
                            vm.trip.driverId = result.driver.id;
                            vm.trip.vehicle = result.vehicle;
                            vm.trip.vehicleId = result.vehicle.id;
                            if (result.vehicle.tariffGroup) {
                                vm.trip.tariffGroup = result.vehicle.tariffGroup;
                                vm.trip.tariffGroupId = result.vehicle.tariffGroup.id;
                            }
                        }
                    });
                }
            }

            vm.selectChauffeurPopup = function () {
                openSelectChauffeurModal();
            };
            function openSelectChauffeurModal() {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/selectChauffeurModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.selectChauffeurModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.trip.driver = result;
                        vm.trip.driverId = result.id;
                    }
                });
            }

            vm.save = function () {
                if (vm.separateDateAndTime)
                {
                    const pickupDateObj = moment.utc(vm.trip.pickupDateTime, 'YYYY-MM-DD HH:mm:ss');
                    const dropOffDateObj = moment.utc(vm.trip.dropOffDateTime, 'YYYY-MM-DD HH:mm:ss');
                    const pickuphours = pickupDateObj.hours();
                    const pickupminutes = pickupDateObj.minutes();
                    const dropoffhours = dropOffDateObj.hours();
                    const dropoffminutes = dropOffDateObj.minutes();
                    //const timeZoneId = app.settings.get("App.Speed.Common.TimeZone"); // Replace with your method to fetch the time zone ID
                    const timeZoneOffset = new Date().getTimezoneOffset(); // Offset in minutes (negative for UTC+ zones)
                    const targetHour = ((24 * 60 )+ timeZoneOffset) / 60; // Calculate the target hour

                    if ((pickuphours === targetHour && pickupminutes === 0))
                    {
                        abp.message.error(app.localize('PleaseAddPickupTimeFirst'));
                        return;
                    }
                }
                if (previousDriverId == vm.trip.driverId && vm.trip.tripStatus == 8) {
                    abp.message.confirm(
                        app.localize('SavingConformationMessageForRejectedDriver'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.saving = true;
                                limoTripsService.assignTrip({
                                    trip: vm.trip,
                                }).success(function () {
                                    abp.notify.info(app.localize('SavedSuccessfully'));
                                    $uibModalInstance.close();
                                }).finally(function () {
                                    vm.saving = false;
                                });
                            }
                        }
                    );
                }
                else {
                    vm.saving = true;
                    limoTripsService.assignTrip({
                        trip: vm.trip,
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };
            function init() {

                limoTripsService.getTripForEdit({ id: tripId }).success(function (data) {
                    vm.trip = data;
                    previousDriverId = vm.trip.driverId
                }).finally(function () {
                    vm.loading = false;
                });

            }
            init();

        }
    ]);
