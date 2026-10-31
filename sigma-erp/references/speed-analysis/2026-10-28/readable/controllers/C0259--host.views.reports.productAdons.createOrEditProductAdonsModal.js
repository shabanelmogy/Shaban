// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:77790-77854
appModule.controller('host.views.reports.productAdons.createOrEditProductAdonsModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.hostProduct', 'abp.services.app.regions', 'abp.services.app.country', 'abp.services.app.productAdon','productAdonId',
        function ($scope, $uibModal, $uibModalInstance, productService, regionsAppService, countryService, productAdonService, productAdonId) {

            var vm = this;
            vm.loading = false;
            vm.productAdonId = productAdonId;
            vm.filters = {
                name: ''
            };
            vm.save = function () {
                debugger
                vm.saving = true;
                productAdonService.createOrUpdate({
                    productAdon: vm.productAdon
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {
                vm.getProducts();
                vm.getRegions();
                if (productAdonId != null) {
                    
                    productAdonService.getProductAdonForEdit(productAdonId).then(function (data) {
                        debugger
                        vm.productAdon = data.data;
                        vm.selectedCountry = data.data.country;
                    });
                }
            }
            vm.getProducts = function () {
                vm.loading = true;
                productService.getProducts().success(function (data) {
                    
                    vm.products = data;
                    vm.loading = false;
                });
            };
            vm.getRegions = function () {
                vm.loading = true;
                regionsAppService.getRegions().success(function (data) {
                    vm.regions = data;
                    vm.loading = false;
                });
            };
            vm.searchCountries = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });
            };
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            init();
        }
    ]);
