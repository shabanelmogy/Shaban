// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:401992-402217
appModule.controller('tenant.views.ers.deliveries.replaceEquipmentModal', ['abp.services.app.vehicle', 'options', '$uibModal',
        'abp.services.app.equipmentAgreementReplacement', 'abp.services.app.commonAgreement', '$uibModalInstance', 'abp.services.app.commonLookup',
        function (vehicleService, options, $uibModal, equipmentAgreementReplacementService, commonAgreementService, $uibModalInstance, commonLookupService) {

            var vm = this;
            vm.loading = false;
            vm.agreement = null;
            vm.inMovement = null;
            vm.outMovement = null;
            vm.locations = [];
            var isValid = true;
            var errorMessage = {};

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                var subStatuses = [1, 7];//1: Avialable, 7: Ready To Go
                return vehicleService.searchVehicles({
                    plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses,
                    ownership: vm.outMovement.vehicle.ownership
                }).then(function (response) {
                    vm.vehicles = response.data.items;
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
                    errorMessage = errorMessage + '\n Replace Equipment Out Date can not be less than In Date ';
                }
            }

            vm.save = function () {
                vm.saving = true;

                validate();
                if (isValid) {
                    if (vm.locations.length == 1)
                        vm.inMovement.inDetail_LocationId = vm.locations[0].id;

                    vm.inMovement.outDetail.fuelLevel = 0;
                    equipmentAgreementReplacementService.replaceEquipment({
                        agreementId: vm.agreement.id,
                        inMovement: vm.inMovement,
                        outMovement: vm.outMovement,
                        deliveryMovementId: vm.deliveryMovementId,
                        isPermanentVehicle: vm.isPermanentVehicle,
                        isReplacementForService: vm.isReplacementForService
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
                                tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
                                statusId: 'IDL',
                                subStatuses: [1, 7], //1: Available, 7: Ready to go
                                source: 'openagreement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.vehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

            vm.addExternalEquipmentPopup = function () {
                openAddExternalEquipmentModal();
            };

            function openAddExternalEquipmentModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/addExternalVehicle.cshtml',
                    controller: 'tenant.views.crs.vehicles.addExternalVehicle as vm',
                    backdrop: 'static',
                    size: 'sm'
                });
                modalInstance.result.then(function (vehicle) {
                    vm.outMovement.vehicle = vehicle;
                    vm.outMovement.vehicle.ownership = 2; // External vehicle
                });
            }

            function getReplacementReasons() {
                commonLookupService.getReplacementReasons().success(function (result) {
                    vm.replacementReasons = result.items;
                })
            };

            function init() {
                vm.loading = true;
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

                    vm.agreement = result;
                    vm.inMovement = vm.agreement.movements.filter(row => !row.isComplete)[0];
                    //vm.inMovement = vm.agreement.movements[vm.agreement.movements.length - 1];
                    vm.isLeaseAgreement = vm.agreement.agreementCategory == 2;
                    vm.isMonthlyAgreement = vm.agreement.agreementType == 3;
                    //initialize new out movement
                    vm.outMovement = angular.copy(vm.inMovement);
                    vm.outMovement.id = 0;
                    vm.outMovement.outDetail.dateTime = null;
                    vm.outMovement.outDetail.fuelLevel = 0;
                    vm.outMovement.inDetail.fuelLevel = 0;
                    vm.outMovement.outDetail.km = null;
                    vm.outMovement.vehicle = { ownership: 1 };
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
