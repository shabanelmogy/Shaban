// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:399852-399932
appModule.controller('tenant.views.ers.deliveries.changeClosingDateModal', [
        '$uibModalInstance',  'tariffHelperERS', 'abp.services.app.equipmentDelivery',
        'options',
        function ($uibModalInstance, tariffHelperERS, equipmentDeliveryService,
             options) {

            var vm = this;
            var agreementId = options.agreementId;
            vm.loading = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;

            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            vm.includeMobilization = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.localize = function (input) {
                return app.localize(input);
            };

            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff && endDateLoaded)
                    tariffHelperERS.applyTariff(vm.agreement);
                endDateLoaded = true;
            };

            vm.save = function () {
                vm.saving = true;
               // vm.agreement.startDate = moment(vm.agreement.startDate).endOf('day');
                //vm.agreement.movements[0].inDetail.dateTime = moment(vm.agreement.movements[0].inDetail.dateTime).endOf('day').add(-3, 'ms');
                vm.agreement.movements[0].inDetail.dateTime = vm.agreement.movements[0].inDetail.dateTime.endOf('day').add(-3, 'ms');

                equipmentDeliveryService.changeDeliveryClosingDate({
                    agreement: vm.agreement
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            

            function init() {
                vm.loading = true;
                equipmentDeliveryService.getEquipmentDeliveryForEdit({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result.equipmentDelivery;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();


        }
    ]);
