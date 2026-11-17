// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:179021-179080
appModule.controller('tenant.views.crs.collectionMovements.viewModal', [
        '$uibModal', '$uibModalInstance', 'utilities', 'movementId', 'abp.services.app.collectionMovement',
        function ($uibModal, $uibModalInstance, utilities, movementId, collectionMovementService) {

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
            vm.getMovemntType = function (type) {
                if (type == 11)
                    return app.localize("AgreementCollection");
                if (type == 11)
                    return app.localize("ReplacementCollection");
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.save = function () {
                utilities.confirmKmPopUp(vm.collectionMovement.outDetail.km, vm.collectionMovement.inDetail.km, saveMovement);
            };

            function init() {

                vm.loading = true;
                allFuelLevels();
                collectionMovementService.getCollectionMovement({ id: movementId }
                ).success(function (result) {
                    vm.collectionMovement = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }

    ]);
