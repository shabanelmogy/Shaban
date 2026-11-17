// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:200852-200931
appModule.controller('tenant.views.crs.deliveries.closeModal', ['options', '$uibModalInstance', 'abp.services.app.delivery', 'utilities',
        function (options, $uibModalInstance, deliveryService, utilities) {

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
                if (type == 8)
                    return app.localize("AgreementDelivery");
                else if (type == 9) return app.localize("ReplacementDelivery");
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function saveMovement() {
                vm.saving = true;
                if (moment.utc(vm.deliveryMovement.outDetail.dateTime) > moment(vm.deliveryMovement.inDetail.dateTime)) {
                    vm.saving = false;
                    abp.message.info(app.localize("Out Date Can Not Less Than In Date"));
                    return;
                }
                if (vm.deliveryMovement.outDetail.km > vm.deliveryMovement.inDetail.km) {
                    vm.saving = false;
                    abp.message.info(app.localize("In Km can not less than Out Km"));
                    return;
                }

                deliveryService.closeDeliveryMovement(vm.deliveryMovement
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }


            vm.save = function () {
                utilities.confirmKmPopUp(vm.deliveryMovement.outDetail.km, vm.deliveryMovement.inDetail.km, saveMovement);
            };

            function init() {

                vm.loading = true;
                allFuelLevels();
                deliveryService.getDelivery({ id: options.deliveryMovementId }
                ).success(function (result) {
                    vm.deliveryMovement = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
