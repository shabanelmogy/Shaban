// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:161465-161539
appModule.controller('tenant.views.crs.assets.assets.salePriceModal', [
        '$uibModalInstance', 'abp.services.app.asset', 'assetId', 'utilities', '$uibModal',
        function ($uibModalInstance, assetService, assetId, utilities, $uibModal) {

            var vm = this;
            vm.locationName = '';
            vm.aseetIdForDepreciation = assetId;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.salePriceSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.EstimateOrSetAssetPrice")) || (parseFloat(abp.setting.get("App.General.ProfitMarginOnBookValue")) > 0);
            vm.canChangeSalePrice = utilities.parseBoolean(abp.setting.get("App.General.EstimateOrSetAssetPrice")) && abp.features.isEnabled("Pages.Tenant.Assets.CanSetAssetSalePrice");
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.getCostCenterGroup = function (id) {
                if (id === 1)
                    return app.localize("CostCenterGroup1");
                else if (id === 2)
                    return app.localize("CostCenterGroup2");

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.depreciationPopUp = function () {
                var obj = {
                    assetId: vm.aseetIdForDepreciation,
                    openingDepreciation: vm.asset.openingDepr
                };

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/depreciationDetailModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.depreciationDetailModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return obj;
                        }
                    }   
                });
            };

            vm.changeSalePriceByUser = function () {
                vm.loading = true;
                assetService.changeSalePriceByUser({
                    id: assetId,
                    salePrice: vm.asset.salePrice
                }).success(function (result) {
                    vm.isSetSalePrice = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    init();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.loading = true;
                assetService.getAssetForView({
                    id: assetId
                }).success(function (result) {
                    vm.asset = result;
                    vm.asset.disposalType = app.localize(vm.asset.disposalType);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
