// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:433995-434047
appModule.controller('tenant.views.fuel.dataSharing.createOrEditSharingMapping', [
        'utilities', '$scope', 'appSession', '$uibModalInstance', 'mapping', 'abp.services.app.dataSharingMapping',
        function (utilities, $scope, appSession, $uibModalInstance, mapping, dataSharingMappingService) {

            var vm = this;
            vm.saving = false;

            vm.tenant = appSession.tenant;
          //  vm.isEnableApplicableDate = abp.setting.get("App.DarbVehiclePlateNoMapped.EnableApplicableDate") === "True";
       //     vm.isInputFielEnabled = vm.tenant.tenancyName == 'SalikFines' || vm.tenant.tenancyName == 'Hertz' || vm.tenant.tenancyName == 'HertzUAE';
       //     vm.isArencoEnabled = abp.features.getValue("TMS.ShareTolls_FileFormat") == "CustomArenco";

            vm.cancel = function () {
                debugger;
                $uibModalInstance.dismiss();
            };

            vm.mapping = {
                id: mapping.id,
                dataType: mapping.dataType,
                field: mapping.field,
                inputValue: mapping.inputValue,
                outputValue: mapping.outputValue,
                parentValue: mapping.parentValue,
                applicableDate: mapping.applicableDate
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
