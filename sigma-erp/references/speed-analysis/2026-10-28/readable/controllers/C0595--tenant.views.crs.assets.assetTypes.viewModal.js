// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:162371-162436
appModule.controller('tenant.views.crs.assets.assetTypes.viewModal', [
        '$scope', '$uibModalInstance', 'assetTypeId', 'abp.services.app.account', 'abp.services.app.assetType', 'abp.services.app.asset',
        function ($scope, $uibModalInstance, assetTypeId, accountService, assetTypeService, assetService) {
            var vm = this;
            vm.loading = false;
            vm.currentDepreciationMethodsSearchValue = '';
            vm.isVehicleFittingsEnabled = abp.features.isEnabled("CRS.Accounts.Assets.VehicleFittings");

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.assetCategoryChanged = function (assetType) {
                if (assetType.category == 10)
                    assetType.isVehicleAsset = false;
                else if (assetType.category == 1)
                    assetType.isVehicleAsset = true;
                else if (assetType.category == 2)
                    assetType.isVehicleAsset = false;
            };

            vm.assetCategories = [
                { id: 10, name: app.localize("Other") },
                { id: 1, name: app.localize("Vehicle") }
            ];

           
            vm.getAssetCategory = function (id) {
                if (!id) {
                    return "";
                }
                if (id == 1) {
                    return app.localize('Vehicle');
                }
                if (vm.isVehicleFittingsEnabled) {
                    if (id == 2) {
                        return app.localize('Fittings');
                    }
                }
                if (id == 10) {
                    return app.localize('Other')
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function init() {
                vm.loading = true;
                assetTypeService.getAssetTypeForEdit({ id: assetTypeId }).success(
                    function (result) {
                        vm.assetType = result;
                    }).finally(function () {

                    });
            }

            init();

        }
    ]);
