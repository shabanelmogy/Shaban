// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:477962-478008
appModule.controller('tenant.views.tms.e-darb.dataSharingMapping.createOrEditModal', [
        '$scope', '$uibModalInstance', 'mapping', 'abp.services.app.dataSharingMapping',
        function ($scope, $uibModalInstance, mapping, dataSharingMappingService) {

            var vm = this;
            vm.saving = false;

            vm.isArencoEnabled = abp.features.getValue("TMS.ShareTolls_FileFormat") == "CustomArenco";
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.mapping = {
                id: mapping.id,
                dataType: mapping.dataType,
                field: mapping.field,
                inputValue: mapping.inputValue,
                outputValue: mapping.outputValue,
                parentValue: mapping.parentValue
            };

            vm.filters = {
                name: ''
            };

            vm.searchPlateCode = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return dataSharingMappingService.getSearchPlateCode(vm.filters).then(function (response) {
                    vm.plateCodes = response.data.items; //string list of plate numbers
                });
            };

            vm.save = function () {
                vm.saving = true;
                
                dataSharingMappingService.createOrEditMapping({
                    mapping: vm.mapping,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
        }
    ]);
