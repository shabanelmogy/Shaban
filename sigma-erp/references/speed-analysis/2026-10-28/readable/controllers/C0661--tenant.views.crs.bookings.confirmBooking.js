// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:171457-171585
appModule.controller('tenant.views.crs.bookings.confirmBooking', [
        '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.vehicle', 'abp.services.app.booking', 'chargesCalculator', 'bookingId',
        function ($uibModal, $uibModalInstance, utilities, vehicleService, bookingAppService, chargesCalculator,bookingId) {

            var vm = this;
            vm.loading = false;
            vm.vehicles = [];
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.setPlateNoOptional = utilities.parseBoolean(abp.setting.get("App.General.SetVehicleOptionalInBookingConfirmation"));
            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal(vm.agreement.tariffGroup);
            };

            function openSearchVehicleModal(tariffGroup) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.agreement.startDate ? vm.agreement.startDate : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: tariffGroup,
                                statusId: null,
                                selectable: true
                            };
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    if (result)
                    {
                        vm.agreement.vehicle = result;
                        vm.agreement.tariffGroup = result.tariffGroup;
                        vm.agreement.tariffGroupId = result.tariffGroupId;

                    } else {
                        vm.agreement.tariffGroup = null;
                    }
                });
            }
            
            vm.searchVehicles = function ($select) {
                if ($select.search === "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({
                    plateNo: $select.search,
                    tariffGroupId: vm.agreement.tariffGroupId
                }).then(function (response) {
                    vm.vehicles = response.data.items;
                    if (!vm.agreement.tariffGroup && response.tariffGroup) {
                        vm.agreement.tariffGroup = response.tariffGroup;
                    }
                });
            };

            vm.onVehicleSelect = function (selectedVehicle) {
                if (selectedVehicle) {
                    vm.agreement.tariffGroup = selectedVehicle.tariffGroup;
                    vm.agreement.tariffGroupId = selectedVehicle.tariffGroupId;
                   
                } else {
                    vm.agreement.tariffGroup = null;
                }
            };



            // Calculating Charges On Change In Discount
            vm.calculate = function () {
                return chargesCalculator.calculate(vm.agreement);
            };

            vm.confirm = function () {
                vm.saving = true;
                     //update ids for selected records
                if (vm.agreement.vehicle) {
                    if (vm.agreement.vehicle.id > 0)
                        vm.agreement.vehicleId = vm.agreement.vehicle.id;
                    else
                        vm.agreement.vehicleId = null;
                } else {
                    vm.agreement.vehicleId = null; 
                }
                vm.agreement.bookingId = bookingId;
                bookingAppService.confirmBooking(
                    vm.agreement
                ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function init() {
                vm.loading = true;
                bookingAppService.getBookingForEdit({
                    id: bookingId
                }).success(function (result) {
                    vm.agreement = result;

                    if (vm.agreement.id > 0) {
                        vm.otherPickUpLocation = vm.agreement.pickupLocation != null ? true : false;
                        vm.otherDropoffLocation = vm.agreement.dropoffLocation != null ? true : false;
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
