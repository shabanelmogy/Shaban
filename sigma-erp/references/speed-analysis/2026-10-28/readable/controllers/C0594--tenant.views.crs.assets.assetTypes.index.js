// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:162156-162368
appModule.controller('tenant.views.crs.assets.assetTypes.index', [
        '$scope', '$uibModal', 'abp.services.app.account', 'abp.services.app.linkedAccount', 'abp.services.app.assetType', 'abp.services.app.asset',
        function ($scope, $uibModal, accountService, linkedAccountService, assetTypeService, assetService) {
            var vm = this;
            vm.loading = false;
            vm.currentDepreciationMethodsSearchValue = '';
            vm.isVehicleFittingsEnabled = abp.features.isEnabled("CRS.Accounts.Assets.VehicleFittings");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.searchAccounts = function ($select, accountCategory) {
                if ($select.search == "") { vm.accounts = null; return null; }
                return accountService.searchAccounts({ filter: $select.search, isLeaf: true, accountCategory: accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.searchDepreciationMethods = function ($select) {
                if (!vm.originalDepreciationMethods) {
                    vm.originalDepreciationMethods = [...vm.depreciationMethods];
                }

                const newSearchValue = $select.search.trim();

                if (vm.currentDepreciationMethodsSearchValue !== newSearchValue) {
                    vm.currentDepreciationMethodsSearchValue = newSearchValue;

                    if (vm.currentDepreciationMethodsSearchValue === '') {
                        vm.depreciationMethods = [...vm.originalDepreciationMethods];
                        return;
                    }
                }

                vm.depreciationMethods = vm.originalDepreciationMethods.filter(x =>
                    x.name.toLowerCase().includes(vm.currentDepreciationMethodsSearchValue.toLowerCase())
                );
            };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.viewModal = function (assetTypeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assetTypes/viewModal.cshtml',
                    controller: 'tenant.views.crs.assets.assetTypes.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetTypeId: function () {
                            return assetTypeId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });
            };



            vm.createOrEditAssetTypeModal = function (assetTypeId) {
                if (assetTypeId) {
                    openAssetTypeModal(assetTypeId);

                }
                else {
                    openAssetTypeModal(null);
                    

                }

            };

            openAssetTypeModal = function (assetTypeId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assetTypes/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.assets.assetTypes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetTypeId: function () {
                            return assetTypeId;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    
                    vm.getAssetType();
                });

            };

            vm.deleteAssetType = function (assetTypeId) {
                abp.message.confirm(
                    app.localize('Do You Want To Delete Asset Type'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            assetTypeService.deleteAssetType({ id: assetTypeId })
                                .success(function (data) {
                                    abp.notify.info(app.localize('DeletedSuccessfully'));
                                    vm.getAssetType();
                                });
                        }
                    }
                );
            };


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

            vm.assetCategories = [
                { id: 10, name: app.localize("Other") },
                { id: 1, name: app.localize("Vehicle") }
            ];

            vm.isVehicleFittingsEnabled ? vm.assetCategories.push({ id: 2, name: app.localize("Fittings") }) : null;

            vm.assetCategoryChanged = function (assetType) {
                if (assetType.category == 10)
                    assetType.isVehicleAsset = false;
                else if (assetType.category == 1)
                    assetType.isVehicleAsset = true;
                else if (assetType.category == 2)
                    assetType.isVehicleAsset = false;
            };

            vm.removeRow = function (obj) {

                var index = vm.assetType.indexOf(obj);
                vm.assetType.splice(index, 1);
                assetTypeService.deleteAssetType(obj);

            };

            vm.addRow = function () {
                vm.assetType.push(assetTypeLineObject());

            };

            function assetTypeLineObject() {
                var line = new Object();
                line.contactId = 12,
                    line.staffGroupId = 2;
                return line;
            }


            vm.save = function () {

                vm.saving = true;
                assetTypeService.createOrUpdateAssetType({
                    assetType: vm.assetType
                }).success(function (data) {

                    abp.notify.info(app.localize('SavedSuccessfully'));
                    init();
                }).finally(function () {
                    vm.saving = false;
                });
            };


            vm.getAssetType = function () {
                vm.loading = true;
                assetTypeService.getAssetType().success(function (data) {

                    vm.assetType = data.items;
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

            function init() {
                vm.loading = true;
                getDepreciationMethod();
                vm.getAssetType();
            }

            init();

        }
    ]);
