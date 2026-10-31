// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:264554-264685
appModule.controller('tenant.views.crs.reports.collectionAndDepositsReports.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.collectionAndDepositReport', 'utilities', 'abp.services.app.billingMethod', 'abp.services.app.commonLookup',
        function ($scope, uiGridConstants, collectionReportAppService, utilities, billingMethodService, commonLookupService) {

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
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };

            vm.filters = {
                fromDate: null,
                toDate: null,
                locationId: null,
                locationId2: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
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

            vm.getAgreementLocationName = function (locationId) {
                var locationAgreementName = null;
                for (var i = 0; i < vm.LocationsForAgreement.length; i++) {
                    if (vm.LocationsForAgreement[i].id == locationId) {
                        locationAgreementName = vm.LocationsForAgreement[i].name;
                        break;
                    }
                }
                return locationAgreementName;

            };
            //Location related code Start ------------
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.getVoucherType = function (type, subType) { 
                return utilities.getVoucherType(type, subType);
            };
            vm.getDepositType = function (string) { 
                return app.localize(string);
            };
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    vm.LocationsForAgreement = data.items;
                });
            };



            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            //Location related code END ---------------

            vm.getCollectionReport = function () {
                
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                collectionReportAppService.getCollectionReport(vm.filters).success(function (result) {
                vm.reportData = result;

                }).finally(function () {

                    vm.loading = false;
                });
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                 collectionReportAppService.exportToExcel(vm.filters) .success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            

            function init() { 
                getLocations();
                vm.getCollectionReport();
            }

            init();
        }
    ]);
