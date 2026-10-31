// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:148052-148321
appModule.controller('tenant.views.crs.agreements.replaceVehicleModal', ['abp.services.app.vehicle', 'options', 'abp.services.app.agreement',
        '$scope', '$uibModal','abp.services.app.agreementReplacement', 'abp.services.app.commonAgreement', '$uibModalInstance', 'abp.services.app.movement', 'abp.services.app.commonLookup', 'abp.services.app.replacementReason', 'utilities','$q',
        function (vehicleService, options, agreementService, $scope, $uibModal, agreementReplacementService, commonAgreementService, $uibModalInstance, movementService, commonLookupService, replacementReasonService, utilities,$q) {

            var vm = this;
            var IsOnlyFMSModuleEnabled = false;
            vm.loading = false;


            //vm.showFinesOnVehicleReplacement = abp.auth.hasPermission('Pages.Tenant.ShowFinesOnReplacement');
            vm.showFinesOnVehicleReplacement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.GenerateFineOnVehicleReplacement"));
            
            

            if (abp.features.isEnabled("FMS")
                && (!abp.features.isEnabled("CRS.Rental.Agreements") && !abp.features.isEnabled("CRS.Lease.Agreements")))
            {
                IsOnlyFMSModuleEnabled = true;
            }
            vm.canChangeKMOut = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeKMOut') || abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeKMOut');
            vm.canChangeFuelOut = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeFuelOut') || abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeFuelOut');

            if (IsOnlyFMSModuleEnabled) {
                vm.canChangeKMOut = true;
                vm.canChangeFuelOut = true;
            }

            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.isVehicleSelectionByTypeInAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableVehicleSelectionByTypeInAgreements"));
            vm.agreement = null;
            vm.inMovement = null;
            vm.outMovement = null;
            vm.locations = [];
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            var isValid = true;
            var errorMessage = {};

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                var subStatuses = [1, 7]; //1: Available, 7: Ready To Go

                if (vm.isVehicleSelectionByTypeInAgreements) {

                    var extraType = null;
                    if (vm.isLeaseAgreement) {
                        extraType = 'Lease';
                    } else if (vm.agreement.agreementCategory === 1) {
                        extraType = 'Rental';
                    }

                    var replacementCall = vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', vehicleType: 'Replacement', subStatuses: subStatuses });

                    if (extraType) {
                        var extraCall = vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', vehicleType: extraType, subStatuses: subStatuses });

                        return $q.all([replacementCall, extraCall]).then(function (responses) {
                            vm.vehicles = responses[0].data.items.concat(responses[1].data.items);
                        });
                    } else {
                        return replacementCall.then(function (response) {
                            vm.vehicles = response.data.items;
                        });
                    }
                }
                else {
                    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }
            };

            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                commonLookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };
            vm.getAgreementTypeName = function (agreementType) {
                if (agreementType == null)
                    return "";

                if (agreementType == 1) {
                    return "Daily";
                } else if (agreementType == 2) {
                    return "Weekly";
                } else if (agreementType == 3) {
                    return "Monthly";
                } else {
                    return "";
                }
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.vehicleSelected = function () {
                vm.outMovement.vehicleId = vm.outMovement.vehicle.id;
                vm.outMovement.outDetail.fuelLevel = vm.outMovement.vehicle.fuelLevel;
                vm.outMovement.outDetail.km = vm.outMovement.vehicle.kMs;
                vm.outMovement.outDetail_LocationId = vm.outMovement.vehicle.locationId;
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function validate() {
                errorMessage = '';
                errorMessage = 'Replacement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }

                var localTime = moment.utc(vm.inMovement.outDetail.dateTime).toDate();
                var dateOutLocal = moment(localTime);

                if (dateOutLocal > moment(vm.inMovement.inDetail.dateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n In Date can not be less than Out Date ';
                }

                if (vm.inMovement.outDetail.km > vm.inMovement.inDetail.km) {
                    isValid = false;
                    errorMessage = errorMessage + '\n ODO IN can not be less than ODO OUT ';
                }

                //if (vm.getlocalDateTime(vm.inMovement.inDetail.dateTime) > vm.getlocalDateTime(vm.outMovement.outDetail.dateTime)) {
                if (moment(vm.inMovement.inDetail.dateTime) > moment(vm.outMovement.outDetail.dateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n ReplaceVehicle Out Date can not be less than In Date ';
                }
            }

            var save = function () {
                vm.saving = true;
                validate();
                if (isValid) {
                    if (vm.locations.length == 1)
                        vm.inMovement.inDetail_LocationId = vm.locations[0].id;

                    agreementReplacementService.replaceVehicle({
                        agreementId: vm.agreement.id,
                        inMovement: vm.inMovement,
                        outMovement: vm.outMovement,
                        deliveryMovementId: vm.deliveryMovementId,
                        isPermanentVehicle: vm.isPermanentVehicle,
                        isReplacementForService: vm.isReplacementForService,
                        isReplacementForCollection: vm.isReplacementForCollection
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        if (vm.showFinesOnVehicleReplacement) { // If Permission Is True Then Fine Generation Pop-Up For The Previous Vehicle Will Be Generated
                            vm.generateFineInvoices();
                        }
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            }

            vm.save = function () {
                utilities.confirmKmPopUp(vm.inMovement.outDetail.km, vm.inMovement.inDetail.km, save);
            };

            function getReplacementReasons() {
                //replacementReasonService.getReplacementReasons().success(function (result) {
                //    vm.replacementReasons = result.items;
                //})

                commonLookupService.getReplacementReasons().success(function (result) {
                    vm.replacementReasons = result.items;
                })
            };

            vm.generateFineInvoices = function () {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateFineModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateFineModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    keyboard: false,
                    resolve: {
                        options: function () {
                            return {
                                vehicle: vm.agreement.vehicle,
                                plateNo: vm.agreement.vehicle.plateNo,
                                agreementStartDate: vm.agreement.startDate,
                                agreementEndDate: vm.agreement.endDate,
                                inMovement: vm.inMovement,
                            }

                        }
                    }
                });

            };

            
            function init() {
                vm.loading = true;
                allFuelLevels();
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
                commonAgreementService.getAgreement({
                    id: options.agreementId,
                    includeMovements: true,
                    includeVehicle: true,
                    isMobile: false
                }).success(function (result) {
                    vm.deliveryMovementId = options.deliveryMovementId;
                    console.log(result);
                    vm.agreement = result;
                    vm.inMovement = vm.agreement.movements.filter(row => !row.isComplete)[0];
                    //vm.inMovement = vm.agreement.movements[vm.agreement.movements.length - 1];
                    vm.isLeaseAgreement = vm.agreement.agreementCategory == 2;
                    vm.isMonthlyAgreement = vm.agreement.agreementType == 3;
                    vm.isVehicleAssignment = options.isVehicleAssignment;
                    //initialize new out movement
                    vm.outMovement = angular.copy(vm.inMovement);
                    vm.outMovement.id = 0;
                    vm.outMovement.outDetail.dateTime = null;
                    vm.outMovement.outDetail.fuelLevel = null;
                    vm.outMovement.outDetail.km = null;
                    vm.outMovement.vehicle = null;
                    vm.outMovement.vehicleId = null;
                    vm.outMovement.outDetail_LocationId = null;
                    vm.outMovement.outDetail_Location = null;
                    vm.outMovement.contact = null;
                    if (vm.deliveryMovementId) {
                        vm.outMovement.vehicle = options.vehicle;
                        vm.outMovement.vehicleId = options.vehicle.id;
                        vm.outMovement.outDetail_LocationId = options.vehicle.locationId;
                    }
                    getReplacementReasons();

                    

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
