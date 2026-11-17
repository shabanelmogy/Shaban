// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:159039-159463
appModule.controller('tenant.views.crs.assets.assets.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.asset', 'utilities', 'assetId', 'fiscalYear', 'abp.services.app.costCenter', 'abp.services.app.directory', 'abp.services.app.commonLookup',
        function ($uibModal, $uibModalInstance, assetService, utilities, assetId, fiscalYear, costCenterService, directoryService,lookupService) {

            var vm = this;
            vm.assets = {};
            vm.saving = false;
            vm.isEditMod = false;
            vm.totalOfChildAssetsPrice = 0;
            vm.minResidualValue = 1;
            vm.childAssetToRemove = {};
            vm.showOpeningDepr = false;
            vm.saveAndPrint = false;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isDealershipDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.DiscountOnAssetFromDealership");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.getCostCenterGroup = function (id) {
                if (id == 1)
                    return app.localize("CostCenterGroup1");
                else if (id == 2)
                    return app.localize("CostCenterGroup2");

            };

            vm.zerofyMinValue = function () {
                if (vm.asset.discount == null)
                    vm.asset.discount = 0;
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.deprPercentageSum = 0.0;


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

            vm.depreciationMethodChanged = function () {
                vm.minResidualValue = 1;
                if (vm.asset.depreciationMethodId == 1)
                    vm.minResidualValue = 0;
                vm.asset.annualDeprPercentage = null;
                if (vm.asset.depreciationMethodId == 1 || vm.asset.depreciationMethodId == 100)
                    return;
                //else if (vm.asset.depreciationMethodId == 8) {
                //    prepareCustomDepreciationTable();
                //    return;
                //}
                var perAnum = (vm.asset.purchseCost - vm.asset.residualValue) / vm.asset.assetLifeInYears;
                var percentageValue = 0;
                if (vm.asset.depreciationMethodId == 2)
                    percentageValue = 100;
                else if (vm.asset.depreciationMethodId == 3)
                    percentageValue = 125;
                else if (vm.asset.depreciationMethodId == 4)
                    percentageValue = 150;
                else if (vm.asset.depreciationMethodId == 5)
                    percentageValue = 175;
                else if (vm.asset.depreciationMethodId == 6)
                    percentageValue = 200;
                vm.asset.annualDeprPercentage = perAnum / (vm.asset.purchseCost - vm.asset.residualValue) * percentageValue;
            };
            vm.removeRow = function (row) {
                var index = vm.asset.childAssets.indexOf(row);

                //  assetService.setParentIdAsNullForDeletedRow({ id: vm.asset.childAssets[index].id, });
                assetService.setParentIdAsNullForDeletedRow({
                    id: vm.asset.childAssets[index].id
                }).success(function (result) {
                    vm.asset.childAssets.splice(index, 1);
                    vm.calculateTotalAttachmentCost();
                }).finally(function () {
                    vm.loading = false;
                });


            };
            vm.changeAsset = function (row) {

                row.title = row.asset.title;
                row.purchaseDate = row.asset.purchaseDate;
                row.purchseCost = row.asset.purchseCost;
                row.assetType = row.asset.assetType;
                row.id = row.asset.id;

            }
            vm.calculateTotalAttachmentCost = function () {

                if (vm.asset.childAssets) {
                    vm.asset.extraCost = 0;
                    vm.asset.childAssets.forEach(e => {
                        if (e.isPermanentAttachment)
                            vm.asset.extraCost += e.purchseCost;
                    });
                    if (typeof vm.asset.purchasePrice === 'undefined') {
                        vm.asset.purchseCost = vm.asset.extraCost;
                    } else {
                        vm.asset.purchseCost = vm.asset.extraCost + vm.asset.purchasePrice;
                    }
                }

            };


            vm.prepareCustomDepreciationTable = function () {
                vm.asset.anualDeprRates = [];
                if (vm.asset.depreciationMethodId == 8) {
                    var depStartDate = angular.copy(vm.asset.deprStartDate);

                    for (var i = 1; i <= vm.asset.assetLifeInYears; i++) {
                        var obj = {};
                        obj.year = i;
                        obj.fromDate = angular.copy(depStartDate);
                        obj.toDate = angular.copy(depStartDate.add(1, 'years'));
                        obj.percentage = null;

                        vm.asset.anualDeprRates.push(obj);
                        depStartDate.add({ days: 1 });
                    }
                    vm.sumCustomYearDepreciation();
                }
            }

            vm.sumCustomYearDepreciation = function (row) {
                var sum = 0.0;
                vm.asset.anualDeprRates.forEach(e => {
                    sum += e.percentage / 1;
                });
                if (sum > 100) {
                    abp.message.info("Percentage sum cannot be greater than 100");
                    if (row)
                        row.percentage = null;
                    vm.deprPercentageSum = 0;
                    vm.asset.anualDeprRates.forEach(e => {
                        vm.deprPercentageSum += e.percentage / 1;
                    });
                    return;
                }
                vm.deprPercentageSum = sum;
            };

            vm.addRow = function () {
                vm.asset.childAssets.push(childAccountObject());
            };
            vm.addRowPermanent = function () {
                debugger;
                vm.asset.childAssets.push(childAccountObjectPermanent());
            };

            function childAccountObjectPermanent() {

                var childAccount = new Object();
                childAccount.assetTypeId = null;
                childAccount.parentAssetId = null;
                childAccount.isPermanentAttachment = true;


                return childAccount;
            }
            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            function childAccountObject() {

                var childAccount = new Object();
                childAccount.assetTypeId = null;
                childAccount.parentAssetId = null;



                return childAccount;
            }

            vm.searchAssetsWithNullParentId = function ($select) {
                if (!$select.search) return;

                assetService.searchAssetsWithNullParentId({ keyword: $select.search, category: 2, parentAssetId: vm.asset.parentAssetId }).success(function (data) {
                    vm.assetsWithNullParentId = data.items;

                });
            };

            vm.searchAssetsWithNullParentIdR = function ($select) {
                if (!$select.search) return;

                assetService.searchAssetsWithNullParentId({ keyword: $select.search, category: 2, parentAssetId: vm.asset.parentAssetId }).success(function (data) {
                    vm.assetsWithNullParentIdR = data.items;

                });
            };

            vm.deprStartDateChange = function () {
                if (!vm.asset.deprStartDate) return;
                if (vm.asset.deprStartDate < moment.utc(fiscalYear.startDate).toDate())
                    return vm.showOpeningDepr = true;
                else {
                    //vm.asset.openingDepr = 0;
                    return vm.showOpeningDepr = false;
                }
            };

            var getCostCenters = function () {
                costCenterService.searchCostCenters({ includeInActive: false }).success(function (data) {
                    vm.costCenters = data.items;
                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            };

            var purchaseDateLoaded = false;
            vm.purchaseDateChange = function () {
                if (purchaseDateLoaded || !vm.isEditMod) {
                    vm.asset.inServiceDate = vm.asset.purchaseDate.toJSON();
                    vm.asset.deprStartDate = vm.asset.purchaseDate.toJSON();
                }
                else purchaseDateLoaded = true;
            };

            var inServiceDateLoaded = false;
            vm.inServiceDateChange = function () {
                if (inServiceDateLoaded || !vm.isEditMod)
                    vm.asset.deprStartDate = vm.asset.inServiceDate.toJSON();
                else
                    inServiceDateLoaded = true;
            };

            function getAssetType() {

                vm.loading = true;
                assetService.getAssetType({}).success(function (data) {
                    vm.assetTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getDepreciationMethod() {
                vm.loading = true;
                assetService.getDepreciationMethod({}).success(function (data) {
                    vm.depreciationMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            // extended search using search contact popup
            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.asset.dealer = supplier;
                        vm.asset.dealerId = supplier.id;
                    }
                });
            };

            vm.searchAssets = function ($select) {
                if (!$select.search) return;

                assetService.search({ keyword: $select.search, category: 1 }).success(function (data) {
                    vm.assets = data.items;
                });
            };

            vm.clearParentAsset = function () {
                vm.asset.parentAssetId = null;
                vm.asset.parentAsset = null;
            };

            vm.checkDuplicationOfAttachments = function () {

                const idSet = new Set();
                vm.hasDuplication = false;
                if (vm.asset.childAssets != null) {
                    if (vm.asset.childAssets.length > 0) {
                        for (let i = 0; i < vm.asset.childAssets.length; i++) {
                            const assetId = vm.asset.childAssets[i].id;
                            if (idSet.has(assetId)) {
                                vm.hasDuplication = true;
                                if (vm.hasDuplication) {
                                    abp.message.info("There is same asset in Removable and Permanent Attachments");
                                }
                                break;
                            }
                            idSet.add(assetId);
                        }
                    }
                }

                if (!vm.hasDuplication) {
                    vm.save();
                }

            };

            vm.save = function () {
                vm.saving = true;
                vm.asset.purchaseDate = vm.asset.purchaseDate.startOf('day');
                vm.asset.inServiceDate = vm.asset.inServiceDate.startOf('day');
                vm.asset.deprStartDate = vm.asset.deprStartDate.startOf('day');

                assetService.createOrUpdateAsset({
                    asset: vm.asset,
                }).success(function (asset) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    if (vm.saveAndPrint)
                        saveAndPrint(asset);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            vm.setDepreciationMethods = function (asset) {
                vm.asset.depreciationMethodId = asset.depreciationMethodId;
            }

            vm.setResidualValue = function (residualValue) {
                vm.asset.residualValue = residualValue;
            }

            vm.setAssetLife = function (assetType) {
                vm.asset.assetLifeInYears = assetType.assetLifeInYears;
            }

            vm.setAnnualDeprPercentage = function (assetType) {
                vm.asset.annualDeprPercentage = assetType.annualDeprPercentage;
            }

            vm.setOpeningDepr = function (assetType) {
                vm.asset.openingDepr = assetType.openingDepr;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            var saveAndPrint = function (id) {
                window.open('/Report#/tenant/printAsset/' + id);
            };
            function init() {
                vm.loading = true;
                getLocations();
                if (vm.isCostCenterEnabled)
                    getCostCenters();
                assetService.getAssetForEdit({
                    id: assetId
                }).success(function (result) {

                    vm.asset = result;
                    if (vm.asset) {
                        if (vm.asset.childAssets) {
                            vm.asset.childAssets.forEach(e => {
                                e.asset = {

                                    assetNo: e.assetNo,
                                    title: e.title,

                                };
                            });
                        }
                    }

                    vm.calculateTotalAttachmentCost();

                    if (!assetId) {
                        vm.asset.childAssets = [];
                    }
                    if (moment.utc(vm.asset.deprStartDate).toDate() < moment.utc(fiscalYear.startDate).toDate())
                        vm.showOpeningDepr = true;
                    getAssetType();
                    getDepreciationMethod();
                    if (assetId > 0) {
                        vm.isEditMod = true;
                        vm.asset.assetLifeInYears = vm.rounding(assetLifeInYears);
                        if (vm.asset.depreciationMethodId == 1)
                            vm.minResidualValue = 0;
                        if (vm.asset.depreciationMethodId == 8)
                            vm.sumCustomYearDepreciation();


                    } else {
                        vm.isEditMod = false;
                    }
                }).finally(function () {
                    vm.loading = false;
                });

            }

            init();
        }
    ]);
