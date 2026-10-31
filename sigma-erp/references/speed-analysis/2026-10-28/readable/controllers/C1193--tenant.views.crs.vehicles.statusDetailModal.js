// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:314454-314553
appModule.controller('tenant.views.crs.vehicles.statusDetailModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.movement', 'vehicle',
        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, vehicleService, movementService, vehicle) {

            var vm = this;
            vm.plateNo = vehicle.plateNo;
            vm.statusId = vehicle.statusId;
            vm.deFleetDate = vehicle.deFleetDate;

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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;

                vehicleService.getVehiclesStatusDetail({ id: vehicle.id }).success(function (result) {
                    var statusDetail = [];
                    vm.statusData = result;
                    
                }).finally(function () {
                    vm.loading = false;

                });
            };

            vm.loadSubStatusforNrmandWorkshop = function (vehicle) {
                if (vehicle.status == "OnNRM") {
                    if (vehicle.movementSubType == 4)
                        return vm.localize("NRM_General");
                    if (vehicle.movementSubType == 5)
                        return vm.localize("NRM_StaffCar");
                    if (vehicle.movementSubType == 6)
                        return vm.localize("NRM_SoldCarCustomerMovement");
                    if (vehicle.movementSubType == 7)
                        return vm.localize("NRM_NRT");
                    if (vehicle.movementSubType == 8)
                        return vm.localize("NRM_AgreementDelivery");
                    if (vehicle.movementSubType == 9)
                        return vm.localize("NRM_ReplacementDelivery");
                }
                if (vehicle.status == "InWorkshop") {
                    if (vehicle.movementSubType == 1)
                        return vm.localize("Workshop_Maintenance");
                    if (vehicle.movementSubType == 2)
                        return vm.localize("Workshop_Repair");
                    if (vehicle.movementSubType == 3)
                        return vm.localize("Workshop_AccidentRepair");
                    if (vehicle.movementSubType == 10)
                        return vm.localize("Workshop_Inspection");
                }
            };

            vm.getMakeModelYear = function (vehicle) {
                return vehicle.model.make + ' '
                    + vehicle.model.name + ' '
                    + vehicle.modelYear;
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                vehicleService.exportToExcelDashBoard(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            if (vm.statusId != 'DFL') {
                init();
            }
        }
    ]);
