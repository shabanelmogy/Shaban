// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:195356-195501
appModule.controller('tenant.views.crs.custodyMovements.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.vehicle', 'abp.services.app.vehicleAlerts' ,'options', 'abp.services.app.custody', 'abp.services.app.commonLookup',
        function ($uibModal, $uibModalInstance, utilities, vehicleService, vehicleAlertsService, options, custodyMovementService, commonLookupService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.vehicleRegistrationExpiryPopupOnAgreementSaving = utilities.parseBoolean(abp.setting.get("App.General.VehicleRegistrationExpiryPopupOnAgreementSaving"));
            vm.loading = false;
            vm.custodyMovement = {
                vehicleId: null,
                locationId: null,
                kMs: null,
                fuelLevel: null,
                date: moment().format(abp.setting.get(vm.dateTimeFormat)),

            };
            vm.vehicles = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehiclesCustodyMovement({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            async function getDueService() {
                const vehicleService = await vehicleAlertsService.getServiceAlertForVehicle(vm.custodyMovement.vehicle);
                vm.vehicleAlertsRegistration = vehicleService.data.items;
                if (vm.vehicleAlertsRegistration.length > 0) {
                    var message = vm.vehicleAlertsRegistration[0].dueService.name + ', Due Kms:' + ' ' + vm.vehicleAlertsRegistration[0].dueKms + ', Reason:' + ' ' + vm.vehicleAlertsRegistration[0].dueReason;
                    abp.message.confirm(
                        message,
                        'Do you want to continue?',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.saving = true;
                                createOrUpdateCustodyMovement();
                            }

                        }
                    );
                }
                else {
                    createOrUpdateCustodyMovement();
                }

            }

            function createOrUpdateCustodyMovement() {
                custodyMovementService.createOrUpdateCustody({
                    custody: vm.custodyMovement,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            vm.save = function () {
                var agreementStartDate = moment(vm.custodyMovement.vehicle.agreement.startDate);

                vm.saving = true;

                if (vm.locations.length == 1)
                    vm.custodyMovement.locationId = vm.locations[0].id;

                if (vm.vehicleRegistrationExpiryPopupOnAgreementSaving) {
                    if (vm.custodyMovement.vehicle.nextRegistrationDate) {
                        vm.currentDate = new Date();
                        vm.formattedNextRegistrationDate = new Date(vm.custodyMovement.vehicle.nextRegistrationDate)
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

                    custodyMovementService.createOrUpdateCustody({
                        custody: vm.custodyMovement,
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

            getLocations();
            allFuelLevels();

        }
    ]);
