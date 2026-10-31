// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:162645-162798
appModule.controller('tenant.views.crs.assets.depreciationDetail.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.asset', 'abp.services.app.depreciationDetail', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, uiGridConstants, assetService, depreciationDetailService,lookupService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().endOf('year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().endOf('year').format(abp.setting.get("App.General.DateFormat"));
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.ConvertToNumFormate = function (number) {
                var val = vm.CurrencyFormate(parseFloat(number));
                return val;
            };
            vm.filters = {
                assetTypeId: null,
                assetId: null,
                fromDate: null,
                locationId: null,
                toDate: null,
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
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

            vm.getlocalDateTimeShort = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };

            function getAssetType() {
                assetService.getAssetType({}).success(function (data) {
                    vm.assetTypes = data.items;
                }).finally(function () {

                });
            };

            vm.getAssetSearch = function ($select) {
                if ($select.search == "") return;
                depreciationDetailService.getAssetSearch({ title: $select.search }).success(function (data) {
                    vm.assets = data.items;
                }).finally(function () {

                });
            };
            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getLocationName = function () {
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
            vm.clearAsset = function () {
                vm.filters.assetId = null;
                vm.filters.asset = null;
            };
            var previousSum = 0;
            vm.sumDep = function (num) {
                //  function sumDep(num) {
                previousSum = previousSum + num;
                previousSum.toFixed(2);
                vm.sumDep1 = previousSum;
            };
            vm.sumOfDepreciation = function (data, assetTypeId) {
                var sum = 0;
                angular.forEach(data, function (value) {
                    if (value.assetType.id == assetTypeId) {
                        sum = sum + value.depreciation;
                    }
                });
                //data.forEach(function (value) {
                //    if (value.assetType.id == assetTypeId) {
                //        sum = sum + value.depreciation;
                //    }
                //});
                
                return utilities.round(sum,2);
            };


            vm.exportToExcelMethod = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                depreciationDetailService.exportToExcel(vm.filters).success(function (data) {
                    app.downloadTempFile(data);
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.getDepreciationDetail = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                depreciationDetailService.getDepreciationDetail(vm.filters).success(function (result) {
                    vm.report = result;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                initDate();
                getAssetType();
                getLocations();
            }
            init();
        }
    ]);
