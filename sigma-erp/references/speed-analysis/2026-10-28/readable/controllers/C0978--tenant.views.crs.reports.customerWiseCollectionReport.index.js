// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:265221-265357
appModule.controller('tenant.views.crs.reports.customerWiseCollectionReport.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.customerWiseCollectionReport', 'utilities', 'abp.services.app.billingMethod', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($scope, uiGridConstants, customerWiseCollectionReportAppService, utilities, billingMehtodService, commonLookupService, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.reportData = null;

            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };

            vm.filters = {
                fromDate: null,
                toDate: null,
                locationId: null,
                customerType: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.getCustomerType = function (id) {
                if (id !== null) {
                    if (id === 1)
                        return app.localize("Individual");
                    if (id === 2)
                        return app.localize("Company");
                }
                else {
                    return "";
                }
            };

            vm.customerTypes = [
                { name: "Individual", id: 1 },
                { name: "Company", id: 2 }
            ];

            vm.dateRangeModel = {
                startDate: null,
                endDate: null
            };
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getLocationName = function (locationId) {
                var locationName = null;
                for (var i = 0; i < vm.locations.length; i++) {
                    if (vm.locations[i].id == locationId) {
                        locationName = vm.locations[i].name;
                        break;
                    }
                }
                return locationName;

            };

            //Location related code Start ------------
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    vm.LocationsForAgreement = data.items;
                });
            };

            vm.getCustomerWiseCollectionReport = function () {

                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();


                customerWiseCollectionReportAppService.getCustomerWiseCollectionReport(vm.filters).success(function (result) {
                    vm.reportData = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                customerWiseCollectionReportAppService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                getLocations();
                vm.getCustomerWiseCollectionReport();
            }

            init();
        }
    ]);
