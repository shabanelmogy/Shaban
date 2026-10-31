// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298781-298849
appModule.controller('tenant.views.crs.tariffs.locationWiseSettingModal', [
        '$scope', '$uibModalInstance','abp.services.app.commonLookup', 'abp.services.app.locationTariffAdjustment',
        function ($scope, $uibModalInstance,commonLookupService, locationTariffAdjustmentService) {

            var vm = this;
            vm.saving = false;
            vm.locationTariffAdjustments = [];
            function locationTariffAdjustmentObject() {
                var line = new Object();
                line.locationId = null;
                line.adjustmentPercentage = '';

                return line;
            }
            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    line = locationTariffAdjustmentObject();
                vm.locationTariffAdjustments.push(line);
            };

            // Remove Row
            vm.removeRow = function (obj) {
                var index = vm.locationTariffAdjustments.indexOf(obj);
                vm.locationTariffAdjustments.splice(index, 1);
            };
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.save = function () {
                vm.saving = true;
                if (vm.locationTariffAdjustments.length == 0) {
                    vm.saving = false;
                    return;
                }
                locationTariffAdjustmentService.createOrUpdateLocationTariffAdjustment({
                    locationTariffAdjustments: vm.locationTariffAdjustments
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };
            function init() {
                vm.loading = true;
                getLocations();
                locationTariffAdjustmentService.getLocationTariffAdjustments().success(function (data) {
                    vm.locationTariffAdjustments = data.items;
                    if(vm.locationTariffAdjustments.length==0)
                        vm.addRow();
               }).finally(function () {
                    vm.loading = false;
                })
               
            }


            init();
        }
    ]);
