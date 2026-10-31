// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:294160-294420
appModule.controller('tenant.views.crs.staffMovement.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.vehicleAlerts', 'abp.services.app.directory', 'abp.services.app.movement', 'staffMovementId', 'abp.services.app.nrm', 'abp.services.app.commonLookup', 'utilities',
        function ($uibModal, $uibModalInstance, vehicleService, vehicleAlertsService, directoryService, movementService, staffMovementId, nrmService, commonLookupService, utilities) {

            var vm = this;
            vm.loading = false;
            //vm.showToBranch = true;
            vm.vehicles = [];
            vm.customers = [];
            vm.vehicleRegistrationExpiryPopupOnAgreementSaving = utilities.parseBoolean(abp.setting.get("App.General.VehicleRegistrationExpiryPopupOnAgreementSaving"));
            vm.drivers = [];
            vm.movementSubTypes = utilities.getMovementSubTypesArray();
            vm.locationDetailsInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LocationDetailsInMovements"));
            vm.SelectToBranchInNRT = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SelectToBranchInNRT"));
            vm.allowMomentsForSaleVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowMomentsForSaleVehicle"));

            vm.isEditMode = staffMovementId > 0;
            vm.getMovementSubType = function (movementSubType) {
                return utilities.getMovementSubType(movementSubType);
            };

            vm.getStaffMovementForEditInput = {
                movementTypeId: 2,
                id: staffMovementId
            };
            vm.movementSubTypeChanged = function () {
                if (vm.staffMovement.movementSubType == 4 || vm.staffMovement.movementSubType == 7)
                    vm.showToBranch = true;
                else
                    vm.showToBranch = false;
            };

            vm.permissions = {
                canChangeKMOut: abp.auth.hasPermission('Pages.Tenant.StaffMovements.CanChangeKMOut'),
                canChangeFuelOut: abp.auth.hasPermission('Pages.Tenant.StaffMovements.CanChangeFuelOut'),
            };

            var isValid = true;
            var errorMessage = {};

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.localize = function (input) {
                return app.localize(input);
            };


            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = vm.staffMovement.movementSubType == 6 ? [3] : [1, 8, 7];
                if (vm.allowMomentsForSaleVehicle) {
                    return vehicleService.searchWithAccessoriesVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'opennrm', isGetSaleVehicle: true }).then(function (response) {
                        vm.vehicles = response.data.items;

                    });
                }
                else {
                    return vehicleService.searchWithAccessoriesVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'opennrm' }).then(function (response) {
                        vm.vehicles = response.data.items;

                    });
                }
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                if ($select.search == '') return;
                var contactType = vm.staffMovement.movementSubType == 6 || vm.staffMovement.movementSubType == 13 ? 2 : 1;
                return directoryService.search({ keyword: $select.search, contactType: contactType, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var contactType = vm.staffMovement.movementSubType == 6 || vm.staffMovement.movementSubType == 13 ? 2 : 1;
                var modalInstance = openSearchContactModel(null, contactType);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.staffMovement.contact = result;
                    }
                });
            };

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };
            vm.vehicleSelected = function () {
                vm.staffMovement.outDetail.fuelLevel = vm.staffMovement.vehicle.fuelLevel;
                vm.staffMovement.outDetail.km = vm.staffMovement.vehicle.kMs;
                vm.staffMovement.inDetail_LocationId = vm.staffMovement.vehicle.locationId;
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {
                var subStatuses = vm.staffMovement.movementSubType == 6 ? [3] : [1, 7, 8];
                var modalInstance = $uibModal.open({

                    templateUrl: '~/App/tenant/views/crs/vehicles/searchWithAccessoriesVehicles.cshtml',

                    controller: 'tenant.views.crs.vehicles.searchWithAccessoriesVehicles as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                //vm.staffMovement.inDetail.dateTime ? vm.staffMovement.inDetail.dateTime :
                                fromDateTime: moment(vm.staffMovement.outDetail.dateTime ? vm.staffMovement.outDetail.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(moment().endOf('day')).utc(),
                                tariffGroup: null,
                                statusId: 'IDL',
                                subStatuses: subStatuses,
                                source: 'opennrm',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.staffMovement.vehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            vm.save = function () {
                //update ids for selected records
                vm.staffMovement.vehicleId = vm.staffMovement.vehicle.id;
                vm.staffMovement.contactId = vm.staffMovement.contact.id;
                vm.staffMovement.movementTypeId = 2;
                if (vm.locations.length == 1)
                    vm.staffMovement.inDetail_LocationId = vm.locations[0].id;
                if (vm.vehicleRegistrationExpiryPopupOnAgreementSaving) {
                    if (vm.staffMovement.vehicle.nextRegistrationDate) {
                        vm.currentDate = new Date();
                        vm.formattedNextRegistrationDate = new Date(vm.staffMovement.vehicle.nextRegistrationDate)
                        var timeDifference = vm.formattedNextRegistrationDate.getTime() - vm.currentDate.getTime();
                        var daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

                        if (daysRemaining < 0) {
                            abp.message.confirm(
                                'Registration is Expired.',
                                'Do you want to continue?',
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        vm.saving = true;
                                        getDueService();
                                    }
                                }
                            );
                        }
                        else {
                            vm.saving = true;
                            getDueService();
                        }
                    }
                    else {
                        vm.saving = true;
                        getDueService();
                    }
                }
                else {
                    vm.saving = true;
                    nrmService.createOrUpdateNRM({
                        nRM: vm.staffMovement,
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }



            };

            function createOrUpdateNRM() {
                nrmService.createOrUpdateNRM({
                    nRM: vm.staffMovement,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            async function getDueService() {
                const vehicleService = await vehicleAlertsService.getServiceAlertForVehicle(vm.staffMovement.vehicle);
                vm.vehicleAlertsRegistration = vehicleService.data.items;
                if (vm.vehicleAlertsRegistration.length > 0) {
                    var message = vm.vehicleAlertsRegistration[0].dueService.name + ', Due Kms:' + ' ' + vm.vehicleAlertsRegistration[0].dueKms + ', Reason:' + ' ' + vm.vehicleAlertsRegistration[0].dueReason;
                    abp.message.confirm(
                        message,
                        'Do you want to continue?',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.saving = true;
                                createOrUpdateNRM();
                            }

                        }
                    );
                }
                else {
                    vm.saving = true;
                    createOrUpdateNRM();
                }

            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                allFuelLevels();
                getLocations();
                nrmService.getNRMForEdit(vm.getStaffMovementForEditInput
                ).success(function (result) {
                    vm.staffMovement = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
