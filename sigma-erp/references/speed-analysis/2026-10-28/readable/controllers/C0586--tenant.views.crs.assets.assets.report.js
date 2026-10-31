// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:161353-161462
appModule.controller('tenant.views.crs.assets.assets.report', ['$scope', '$stateParams', 'abp.services.app.asset', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, assetService, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            //vm.totalAmount = 0;
            vm.totalDeprAmount = 0;
            vm.totalbookAmount = 0;
            vm.salePrice = 0;
            vm.claimCharges = 0;
            vm.netProfitLossValue = 0;
            vm.purchseCost = 0;
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            if (vm.filters.assetNo) {
                vm.filters.title = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.assetTypeId = null;
                vm.filters.chassisNo = null;
            }
            else if (vm.filters.title && vm.filters.title != '') {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.assetTypeId = null;
                vm.filters.chassisNo = null;
            }
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }
            vm.getAssetStatus = function (value) {
                return value == 1 ? 'Disposed' : 'Active';
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                amount = utilities.round(amount, 0);
                return amount.toLocaleString('en');
            };
            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            vm.getLocationNameTwo = function (id) {
                var loc = vm.locations.find(x => x.id === id);
                return loc ? loc.name : '';
            };

            function init() {
                vm.loading = true;
                getLocations();
                assetService.getAssetsReport(vm.filters).success(function (data) {
                    vm.assetReportData = data.items;
                    angular.forEach(vm.assetReportData, function (value, key) {
                        vm.totalDeprAmount += value.depreciation;
                    });
                    angular.forEach(vm.assetReportData, function (value, key) {
                        vm.totalbookAmount += value.bookValue;
                    });
                    angular.forEach(vm.assetReportData, function (value, key) {
                        vm.claimCharges += value.asset.claimCharges;
                    });
                    angular.forEach(vm.assetReportData, function (value, key) {
                        vm.salePrice += value.asset.salePrice;
                    });
                    angular.forEach(vm.assetReportData, function (value, key) {
                        vm.purchseCost += value.asset.purchseCost;
                    });
                    angular.forEach(vm.assetReportData, function (value, key) {
                        vm.profitLoss = (value.claimCharges + value.salePrice) - value.bookValue;
                        if (!value.isDisposed) {
                            vm.profitLoss = 0;
                        }
                        vm.netProfitLossValue += vm.profitLoss;
                    });                   
                  
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
