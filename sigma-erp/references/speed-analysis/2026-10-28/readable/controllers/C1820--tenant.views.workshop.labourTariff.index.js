// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:496481-496605
appModule.controller('tenant.views.workshop.labourTariff.index', [
        '$scope', 'abp.services.app.commonLookup', 'abp.services.app.designation', 'abp.services.app.vehicleModel', 'abp.services.app.labourTariff', 'abp.services.app.labourActivity',
        function ($scope, commonLookupService, designationAppService, vehicleModelService, labourTariffService, labourActivityService) {

            var vm = this;
            vm.saving = false;
            vm.labourTariffLines = [];
            vm.labourTariffLinesVehicleType = [];
            function labourTariffLineObject() {
                var line = new Object();
                line.designationId = null;
                line.activityId = null;
                line.cost = null;
                line.minutes = null;

                return line;
            }

            //Add row
            vm.addRow = function (line) {
                if (line === undefined)
                    line = labourTariffLineObject();
                vm.labourTariffLines.push(line);
            };

            // Remove Row
            vm.removeRow = function (obj) {
                var index = vm.labourTariffLines.indexOf(obj);
                vm.labourTariffLines.splice(index, 1);
            };
            //Add row vehicle type
            vm.addRowVehicleType = function (line) {
                if (line === undefined)
                    line = labourTariffLineObject();
                vm.labourTariffLinesVehicleType.push(line);
            };

            // Remove Row
            vm.removeRowVehicleType = function (obj) {
                var index = vm.labourTariffLinesVehicleType.indexOf(obj);
                vm.labourTariffLinesVehicleType.splice(index, 1);
            };

            function getDesignations() {
                vm.loading = true;
                designationAppService.getDesignations()
                    .success(function (result) {
                        vm.designations = result.items;
                        vm.loading = false;

                    })
                    .error(function () {
                        vm.loading = false;
                    });
            }

            function getLabourActivities() {
                vm.loading = true;
                labourActivityService.getLabourActivities()
                    .success(function (result) {
                        vm.labourActivities = result.items;
                        vm.loading = false;

                    })
                    .error(function () {
                        vm.loading = false;
                    });
            }

            vm.getTariffGroups = function () {
                //vm.loading = true;
                commonLookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };

            vm.getLabourTariffByVehicleType = function () {
                //vm.loading = true;
                labourTariffService.getLabourTariffForEdit({ vehicleTypeId: vm.tariffGroup.id }).success(function (data) {
                    vm.labourTariffLinesVehicleType = data.items;
                });
            };

            vm.save = function (vehicleType) {
                vm.saving = true;
                var listToPass = vm.labourTariffLines;
                if (vehicleType) {
                    vm.labourTariffLinesVehicleType.forEach(e => e.vehicleTypeId = vehicleType.id);
                    listToPass = vm.labourTariffLinesVehicleType;
                }

                labourTariffService.createOrUpdateLabourTariff({
                    labourTariffLines: listToPass
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    if (vehicleType)
                        vm.getLabourTariffByVehicleType();
                    else {
                        labourTariffService.getLabourTariffForEdit({ vehicleTypeId: null }).success(function (result) {
                            vm.labourTariffLines = result.items;
                        }).finally(function () {
                            vm.saving = false;
                        });
                    }
                }).finally(function () {
                    vm.saving = false;
                });

            };
            function init() {
                vm.loading = true;
                labourTariffService.getLabourTariffForEdit({ vehicleTypeId: null }).success(function (result) {
                    vm.labourTariffLines = result.items;
                }).finally(function () {
                    vm.saving = false;
                });
                getDesignations();
                getLabourActivities();
                vm.getTariffGroups();
            }


            init();
        }
    ]);
