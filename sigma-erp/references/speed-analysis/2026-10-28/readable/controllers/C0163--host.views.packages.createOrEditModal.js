// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:62871-62981
appModule.controller('host.views.packages.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.regions', 'abp.services.app.packages', 'abp.services.app.hostProduct', 'abp.services.app.productVariant', 'abp.services.app.currency', 'packageId', '$uibModal', '$http', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModalInstance, regionsAppService, packagesAppService, productService, productVariantService, currencyService, packageId, $uibModal, $http, utilities, businessDivisionService) {
            var vm = this;
            vm.saving = false;
            vm.package;
            vm.documents = [];
            vm.selectedImage = null;
            vm.selectedCoverPic = null;
            vm.contactPersons = [currency = { id: null }];
            vm.currency = {
                id: null
            }
            vm.title = "Create Package";
            vm.enumLimitType = [
                { name: "FleetSize", id: 0 },
            ];

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.businessName = utilities.divisionName();
            vm.getProducts = function () {
                productService.getProducts().success(function (data) {
                    console.log(data);
                    vm.products = data;
                    vm.loading = false;
                });
            };
            vm.getRegions = function () {
                regionsAppService.getRegions().success(function (data) {
                    console.log(data);
                    vm.regions = data;
                    vm.loading = false;
                });
            };
            vm.getVariantsByProductId = function (productId) {
                console.log(productId)
                productVariantService.getProductVariants({ id: productId }).success(function (result) {
                    vm.productVariants = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.save = function () {
                vm.saving = true;
                var selectedCurrencyId = vm.package.currency.id;
                var selectedCurrency = vm.currencies.find(function (currency) {
                    return currency.id === selectedCurrencyId;
                });
                if (selectedCurrency) {
                    vm.package.code = selectedCurrency.code;
                }
                vm.package.id = packageId;
                vm.package.currencyId = vm.package.currency.id;
                vm.package.regionId = 1;
                if (packageId != null) {
                    packagesAppService.createOrUpdatePackage(vm.package)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                } else {
                    packagesAppService.createOrUpdatePackage({ limit: vm.package.limit, title: vm.package.title, productId: vm.package.productId, code: vm.package.code, rate: vm.package.rate, oneTimeCharges: vm.package.oneTimeCharges, productVariantId: parseInt(vm.package.productVariantId, 10), currencyId: vm.package.currency.id, regionId: 1, businessDivisionId: vm.package.businessDivisionId })
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                }
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.getProducts();
                vm.getRegions();
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
                if (packageId != null) {
                    vm.isEditMod = true;
                    vm.title = "Update Package"
                    packagesAppService.getPackageForEdit(packageId).then(function (data) {
                        let datas = data.data;
                        vm.package = data.data;
                        vm.package.productId = vm.package.product.id;
                        vm.getVariantsByProductId(vm.package.productId)
                        vm.package.productVariantId = vm.package.productVariant.id;
                    });
                }
                else {
                }
            }
            vm.getbusinessDivisions();
            init();
        }
    ]);
