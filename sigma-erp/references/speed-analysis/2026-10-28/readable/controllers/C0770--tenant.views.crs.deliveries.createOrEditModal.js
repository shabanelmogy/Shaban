// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:200935-201151
appModule.controller('tenant.views.crs.deliveries.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.vehicle', 'options', 'abp.services.app.vehicleAlerts','abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.delivery',
        function ($uibModal, $uibModalInstance, utilities, vehicleService, options, vehicleAlertsService,commonLookupService, directoryService, deliveryService) {

            var vm = this;
            vm.loading = false;
            vm.vehicleRegistrationExpiryPopupOnAgreementSaving = utilities.parseBoolean(abp.setting.get("App.General.VehicleRegistrationExpiryPopupOnAgreementSaving"));
            vm.deliveryMovement = {
                vehicleId: null,
                locationId: null,
                kMs: null,
                fuelLevel: null,
                date: null,
                outDetail: {},
                inDetail: {}
            };
            vm.vehicles = [];

            vm.vehicleSelected = function () {
                vm.deliveryMovement.vehicleId = vm.deliveryMovement.vehicle.id;
                vm.deliveryMovement.outDetail.fuelLevel = vm.deliveryMovement.vehicle.fuelLevel;
                vm.deliveryMovement.outDetail.kM = vm.deliveryMovement.vehicle.kMs;
            };

            vm.movementSubTypes = [
                { type: app.localize("AgreementDelivery"), id: 8 },
                { type: app.localize("ReplacementDelivery"), id: 9 },
            ];

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.agreementSelected = function () {
                vm.deliveryMovement.refNo = vm.deliveryMovement.agreement.agreementNo;
                vm.deliveryMovement.nrmMovAgreementId = vm.deliveryMovement.agreement.id;
                vm.deliveryMovement.outDetail_LocationId = vm.deliveryMovement.agreement.location.id;


                if (vm.deliveryMovement.movementSubType == 8) {
                    vm.deliveryMovement.vehicle = vm.deliveryMovement.agreement.vehicle;
                    vm.deliveryMovement.vehicleId = vm.deliveryMovement.agreement.vehicle.id;
                    vm.deliveryMovement.outDetail.fuelLevel = vm.deliveryMovement.agreement.vehicle.fuelLevel;
                    vm.deliveryMovement.outDetail.kM = vm.deliveryMovement.agreement.vehicle.kMs;
                    vm.deliveryMovement.inDetail.notes = vm.deliveryMovement.agreement.pickupLocationAddress;
                    vm.deliveryMovement.inDetail_GeoLocationId = vm.deliveryMovement.agreement.pickupLocation.id;
                }
            };

            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                commonLookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };

            vm.deliveryTypeChanged = function () {
                vm.deliveryMovement.agreement = null;
                vm.deliveryMovement.agreementId = null;
                vm.agreements = null;
                vm.deliveryMovement.vehicle = null;
                vm.deliveryMovement.vehicleId = null;
            };

            vm.searchAgreements = function ($select) {
                if (!vm.deliveryMovement.movementSubType) return;
                if ($select.search == "") { vm.agreements = null; return null; }
                return deliveryService.searchDeliveryAgreements({ agreementNo: $select.search, movementSubType: vm.deliveryMovement.movementSubType })
                    .then(function (response) {
                        vm.agreements = response.data.items;
                    });
            };
            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                var subStatuses = [1, 7];//1: Avialable, 7: Ready To Go
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.searchAgreementPopup = function () {
                openSearchAgreementModal();
            };

            function openSearchAgreementModal() {
                vm.type = 8;
                if (vm.deliveryMovement.movementSubType)
                    vm.type = vm.deliveryMovement.movementSubType;

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/deliveries/searchDeliveryAgreementModal.cshtml',
                    controller: 'tenant.views.crs.deliveries.searchDeliveryAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                movementSubType: vm.type,
                                returnAll: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.deliveryMovement.agreement = result;
                        vm.agreementSelected();
                    }
                });
            }

            async function getDueService() {
                const vehicleService = await vehicleAlertsService.getServiceAlertForVehicle(vm.deliveryMovement.vehicle);
                vm.vehicleAlertsRegistration = vehicleService.data.items;
                if (vm.vehicleAlertsRegistration.length > 0) {
                    var message = vm.vehicleAlertsRegistration[0].dueService.name + ', Due Kms:' + ' ' + vm.vehicleAlertsRegistration[0].dueKms + ', Reason:' + ' ' + vm.vehicleAlertsRegistration[0].dueReason;
                    abp.message.confirm(
                        message,
                        'Do you want to continue?',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.saving = true;
                                createOrUpdateDelivery();
                            }

                        }
                    );
                }
                else {
                    createOrUpdateDelivery();
                }

            }

            function createOrUpdateDelivery() {

                deliveryService.createOrUpdateDelivery({
                    delivery: vm.deliveryMovement,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            vm.save = function () {
                //vm.saving = true;
                if (vm.vehicleRegistrationExpiryPopupOnAgreementSaving) {
                    if (vm.deliveryMovement.vehicle.nextRegistrationDate) {
                        vm.currentDate = new Date();
                        vm.formattedNextRegistrationDate = new Date(vm.deliveryMovement.vehicle.nextRegistrationDate)
                        var timeDifference = vm.formattedNextRegistrationDate.getTime() - vm.currentDate.getTime();
                        var daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

                        if (daysRemaining < 0) {
                            abp.message.confirm(
                                'Registration is Expired.',
                                'Do you want to continue?',
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        getDueService();
                                    }
                                }
                            );
                        }
                        else {
                            getDueService();
                        }
                        vm.saving = false;
                    }
                    else {
                        getDueService();
                    }
                }
                else {
                    deliveryService.createOrUpdateDelivery({
                        delivery: vm.deliveryMovement,
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });

                }





            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            allFuelLevels();



        }
    ]);
