// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:162061-162153
appModule.controller('tenant.views.crs.assets.assetTypes.createOrEditModal', [
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

            function getAssetType() {
                vm.loading = true;
                assetTypeService.getAssetType().success(function (data) {

                    vm.assetType = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            vm.assetCategories = [
                { id: 10, name: app.localize("Other") },
                { id: 1, name: app.localize("Vehicle") }
            ];

            vm.isVehicleFittingsEnabled ? vm.assetCategories.push({ id: 2, name: app.localize("Fittings") }) : null;


            vm.save = function () {

                vm.saving = true;
                assetTypeService.createOrUpdateAssetType({
                    assetTypes: vm.assetType
                }).success(function (data) {

                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                    $uibModalInstance.close();
                });
            };

            vm.searchAccounts = function ($select, accountCategory) {
                if ($select.search == "") { vm.accounts = null; return null; }
                return accountService.searchAccounts({ filter: $select.search, isLeaf: true, accountCategory: accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function getDepreciationMethod() {
                vm.loading = true;
                assetService.getDepreciationMethod({}).success(function (data) {
                    vm.depreciationMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.loading = true;
                getDepreciationMethod();
                assetTypeService.getAssetTypeForEdit({ id: assetTypeId }).success(
                    function (result) {
                        vm.assetType = result;
                    }).finally(function () {

                    });
            }

            init();

        }
    ]);
