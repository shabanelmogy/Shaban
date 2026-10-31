// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:161542-161726
appModule.controller('tenant.views.crs.assets.assets.viewModal', [
        '$uibModalInstance', 'abp.services.app.asset', 'assetId', 'utilities', '$uibModal', 'abp.services.app.commonLookup',
        function ($uibModalInstance, assetService, assetId, utilities, $uibModal, lookupService) {

            var vm = this;
            vm.locationName = '';
            vm.documents = [];
            vm.totalOfChildAssetsPrice = 0;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.documentsForAssetsDisposalEnabled = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForAssetsDisposal");
            vm.aseetIdForDepreciation = assetId;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.salePriceSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.EstimateOrSetAssetPrice")) || (parseFloat(abp.setting.get("App.General.ProfitMarginOnBookValue")) > 0);
            vm.canChangeSalePrice = utilities.parseBoolean(abp.setting.get("App.General.EstimateOrSetAssetPrice")) && abp.features.isEnabled("Pages.Tenant.Assets.CanSetAssetSalePrice");
            vm.isDealershipDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.DiscountOnAssetFromDealership");
            vm.isVehicleFittingsEnabled = abp.features.isEnabled("CRS.Accounts.Assets.VehicleFittings");
            vm.discountOnAssetForDisposal = abp.features.isEnabled("CRS.CustomFeatures.DiscountOnAssetForDisposal");

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.deprPercentageSum = 0.0;
            vm.assetDisposalDocs = [];
            vm.assetDisposalImages = [];

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
            vm.locations = [];
            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getLocationName = function () {
                if (!vm.locations)
                    return null;
                angular.forEach(vm.locations, function (value, key) {

                    vm.locationName = value.name;
                    return;

                });
            };
            vm.getLocationNameTwo = function (id) {
                var loc = vm.locations.find(x => x.id === id);
                return loc ? loc.name : '';
            };
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };

            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) == -1);
            };

            vm.getCostCenterGroup = function (id) {
                if (id == 1)
                    return app.localize("CostCenterGroup1");
                else if (id == 2)
                    return app.localize("CostCenterGroup2");

            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.depreciationPopUp = function () {
                var obj = {
                    assetId: vm.aseetIdForDepreciation,
                    openingDepreciation: vm.asset.openingDepr,
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
            }


            vm.viewAsset = function (id) {
                openViewAssetModal(id);
            };

            function openViewAssetModal(assetId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/viewModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return assetId;
                        }

                    }
                });
            }


            function init() {
                vm.loading = true;
                getLocations();
                assetService.getAssetForView({
                    id: assetId
                }).success(function (result) {
                    vm.asset = result;
                    vm.asset.netAmount = vm.asset.salePriceWODiscount - vm.asset.discount;

                    vm.asset.childAssets.forEach(e => {
                        if (e.isPermanentAttachment)
                            vm.totalOfChildAssetsPrice += e.purchseCost;
                    });

                    vm.documents = vm.asset.documents;
                    if (vm.asset.documents) {
                        vm.asset.documents.forEach(doc => {
                            doc.thumb = doc.url;
                            doc.img = doc.url;

                            if (vm.isDocument(doc))
                                vm.assetDisposalDocs.push(doc);
                            else
                                vm.assetDisposalImages.push(doc);

                        });
                    }

                    vm.asset.anualDeprRates.forEach(e => {
                        vm.deprPercentageSum += e.percentage / 1;
                    });
                    vm.deprPercentageSum = sum;
                    vm.asset.disposalType = app.localize(vm.asset.disposalType);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
