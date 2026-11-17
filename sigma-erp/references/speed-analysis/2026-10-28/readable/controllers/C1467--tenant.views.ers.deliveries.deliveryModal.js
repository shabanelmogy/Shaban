// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:400753-400876
appModule.controller('tenant.views.ers.deliveries.deliveryModal', [
        '$uibModal', '$uibModalInstance', 'tariffHelperERS', 'abp.services.app.equipmentDelivery', 'options',
        function ($uibModal, $uibModalInstance, tariffHelperERS, equipmentDeliveryService, options) {

            var vm = this;
            var agreementId = options.agreementId;
            vm.loading = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;

            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            vm.includeMobilization = false;

            var agreementCategory = 7; //ERS Rental


            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

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

                var mobilizationRow = vm.agreement.charges.find(e => e.chargesTypeId == 26);
                if (mobilizationRow) {
                    mobilizationRow.accepted = vm.includeMobilization;
                    mobilizationRow.rate = vm.includeMobilization ? mobilizationRow.rate : 0;
                }

                vm.agreement.startDate = moment(vm.agreement.startDate).startOf('day');
                vm.agreement.movements[0].outDetail.dateTime = moment(vm.agreement.movements[0].outDetail.dateTime).startOf('day');

                equipmentDeliveryService.deliverEquipment({
                    agreement: vm.agreement
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            var saveAndPrint = function (id) {
                //window.open('/Report#/tenant/printModalAgreement/' + id);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return id;
                        }
                    }
                });
            };

            function init() {
                vm.loading = true;
                equipmentDeliveryService.getEquipmentDeliveryForEdit({
                    id: agreementId
                }).success(function (result) {

                    vm.agreement = result.equipmentDelivery;
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }

                    if (vm.agreement.id > 0 || vm.agreement.bookingId > 0) {
                        vm.isEditMod = true;
                        vm.tariffGroupId = vm.agreement.tariffGroupId;
                        vm.tariffGroup = vm.agreement.tariffGroup;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        vm.vehicleOwnership = vm.agreement.vehicle.ownership;
                        if (vm.agreement.vehicle)
                            vm.searchOtherGroupsVehicle = vm.agreement.tariffGroupId != vm.agreement.vehicle.tariffGroupId;

                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();


        }
    ]);
