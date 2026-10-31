// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:178540-178622
appModule.controller('tenant.views.crs.collectionMovements.closeModal', ['options', '$uibModalInstance', 'abp.services.app.collectionMovement', 'utilities', 'abp.services.app.commonLookup',
        function (options, $uibModalInstance, collectionMovementService, utilities, commonLookupService) {

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
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function saveMovement() {
                vm.saving = true;
                if (moment.utc(vm.collectionMovement.outDetail.dateTime) > moment(vm.collectionMovement.inDetail.dateTime)) {
                    vm.saving = false;
                    abp.message.info(app.localize("Out Date Can Not Less Than In Date"));
                    return;
                }
                if (vm.collectionMovement.outDetail.km > vm.collectionMovement.inDetail.km) {
                    vm.saving = false;
                    abp.message.info(app.localize("In Km can not less than Out Km"));
                    return;
                }

                collectionMovementService.closeCollectionMovement(vm.collectionMovement
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }


            vm.save = function () {
                utilities.confirmKmPopUp(vm.collectionMovement.outDetail.km, vm.collectionMovement.inDetail.km, saveMovement);
            };

            function init() {

                vm.loading = true;
                allFuelLevels();
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                collectionMovementService.getCollectionMovement({ id: options.collectionMovementId }
                ).success(function (result) {
                    vm.collectionMovement = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
