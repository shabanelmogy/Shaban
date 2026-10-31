// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:195219-195352
appModule.controller('tenant.views.crs.custodyMovements.closeModal', ['custodyMovementId', '$uibModalInstance', 'abp.services.app.custody', 'abp.services.app.commonLookup',
        '$uibModal', 'utilities' , 'abp.services.app.vehicle',
        function (custodyMovementId, $uibModalInstance, custodyService, commonLookupService, $uibModal, utilities, vehicleService) {

            var vm = this;
            vm.loading = false;
            vm.movementOut = null;
            vm.locations = [];

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
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
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
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
                        vm.custody.newVehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

            vm.vehicleSelected = function () {
                vm.custody.fuelLevel = vm.custody.newVehicle.fuelLevel;
                vm.custody.kMs = vm.custody.newVehicle.kMs;
                vm.custody.vehicleId = vm.custody.newVehicle.id;
                vm.custody.locationId = vm.custody.newVehicle.locationId;
            };

            vm.changeReplaceVehicleCheckBox = function () {
                if (!vm.isReplaceVehicle) {
                    vm.custody.vehicleId = null;
                    vm.custody.newVehicle = null;
                    vm.custody.fuelLevel = null;
                    vm.custody.kMs = null;
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                if (moment(vm.custodyList.inMovement.inDetail.dateTime) > moment(vm.custody.date)) {
                    vm.saving = false;
                    abp.message.info(app.localize("Out Date Can Not Less Than In Date"));
                    return;
                }

                if (vm.custodyList.inMovement.inDetail.km > vm.custody.kMs && !vm.custody.vehicleId) {
                    vm.saving = false;
                    abp.message.info(app.localize("Out Km can not less than In Km"));
                    return;
                }

                custodyService.closeCustody({
                    custodyList: vm.custodyList,
                    custody: vm.custody
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                getLocations();
                allFuelLevels();
                vm.loading = true;
                custodyService.getCustodyForEdit({ id: custodyMovementId }
                ).success(function (result) {
                    vm.custodyList = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
