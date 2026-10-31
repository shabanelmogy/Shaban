// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:162956-163069
appModule.controller('tenant.views.crs.assets.depreciationSummary.index', [
        '$scope', '$uibModal', 'abp.services.app.asset', 'abp.services.app.depreciationSummary', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, assetService, depreciationSummaryService,lookupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().endOf('year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().endOf('year').format(abp.setting.get("App.General.DateFormat"));

            vm.filters = {
                assetTypeId: null,
                assetId: null,
                fromDate: null,
                locationId: null,
                toDate: null,
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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

            function getAssetType() {
                assetService.getAssetType({}).success(function (data) {
                    vm.assetTypes = data.items;
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
            vm.getAssetSearch = function ($select) {
                if ($select.search == "") return;
                depreciationSummaryService.getAssetSearch({ title: $select.search }).success(function (data) {
                    vm.assets = data.items;
                }).finally(function () {

                });
            };

            vm.clearAsset = function () {
                vm.filters.assetId = null;
                vm.filters.asset = null;
            };

            vm.exportToExcelMethod = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                depreciationSummaryService.exportToExcel(vm.filters).success(function (data) {
                    app.downloadTempFile(data);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getDepreciationSummary = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                depreciationSummaryService.getDepreciationSummary(vm.filters).success(function (result) {
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
