// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:466049-466112
appModule.controller('tenant.views.stock.items.report', ['$scope', 'abp.services.app.item', '$stateParams', 'abp.services.app.commonLookup','abp.services.app.itemType',
        function ($scope, itemService, $stateParams, commonLookupService, itemTypeAppService) {

            var vm = this;


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            debugger;
            vm.filters = null;
            vm.itemTypes = [];

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;
            if (vm.filters.itemNo) {
                vm.filters.itemName = null;
                vm.filters.itemTypeId = null;
                vm.filters.model = null;
                vm.filters.supplierItemCode = null;
            }

            function getItemTypeName() {
                if (!vm.filters.itemTypeId)
                    return null;
                angular.forEach(vm.itemTypes, function (value, key) {
                    if (value.id == vm.filters.itemTypeId) {
                        vm.filters.itemTypeName = value.name;
                        return;
                    }
                });
            };

            vm.getItemTypes = function () {
                    vm.loading = true;
                    itemTypeAppService.getItemTypes()
                        .success(function (result) {
                            vm.itemTypes = result.items;
                            getItemTypeName();
                        });
                
            };

            function init() {

            vm.loading = true;

                if (vm.filters.itemTypeId)
                vm.getItemTypes();

                itemService.getReport(vm.filters).success(function (data) {
                   // alert(JSON.stringify(data));
                vm.reportData = data;

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
