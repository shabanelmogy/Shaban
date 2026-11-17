// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:294041-294155
appModule.controller('tenant.views.crs.staffMovements.closeStaffMovement', ['abp.services.app.vehicle', 'staffMovementId', '$uibModalInstance', 'abp.services.app.movement', 'abp.services.app.nrm', 'abp.services.app.commonLookup', 'utilities',
        function (vehicleService, staffMovementId, $uibModalInstance, movementService, nrmService, commonLookupService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.movementOut = null;
            var isKmConfirmationEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsKMConfirmationPopupOnCheckInEnabled"));
            vm.SelectToBranchInNRT = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SelectToBranchInNRT"));

            vm.locations = [];
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.getStaffMovementForcloseInput = {
                movementTypeId: 2,
                id: staffMovementId
            };
            vm.locationDetailsInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LocationDetailsInMovements"));

            vm.getMovementSubType = function (movementSubType) {
                return utilities.getMovementSubType(movementSubType);
            };
            // Replace Vehicle Validation
            var isValid = true;
            var errorMessage = {};

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return; }
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL' }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
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
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            }


            function saveMovement() {
                vm.saving = true;
                if (moment.utc(vm.staffMovement.outDetail.dateTime) > moment(vm.staffMovement.inDetail.dateTime)) {
                    vm.saving = false;
                    abp.message.info(app.localize("In Date can not less than Out Date"));
                    return;
                }
                if (vm.staffMovement.outDetail.km > vm.staffMovement.inDetail.km && vm.staffMovement.movementSubType != 7) {
                    vm.saving = false;
                    abp.message.info(app.localize("In Km can not less than Out Km"));
                    return;
                }

                nrmService.closeNRM({
                    nRM: vm.staffMovement,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            vm.save = function () {
                if (vm.staffMovement.movementSubType==7) {
                    saveMovement();
                }
                else {
                    utilities.confirmKmPopUp(vm.staffMovement.outDetail.km, vm.staffMovement.inDetail.km, saveMovement);
                }
            }

            function init() {
                getLocations();
                allFuelLevels();
                vm.loading = true;
                nrmService.getNRMForEdit(vm.getStaffMovementForcloseInput
                ).success(function (result) {
                    vm.staffMovement = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            //function init() {
            //    vm.loading = true;
            //    movementService.getStaffMovementForEdit({
            //        id: staffMovementId
            //    }).success(function (data) {
            //        vm.staffMovement = data;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}
            init();
        }
    ]);
