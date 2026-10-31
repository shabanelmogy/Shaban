// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:265042-265217
appModule.controller('tenant.views.crs.reports.collectionReport.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.collectionReport', 'utilities', 'abp.services.app.user', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($scope, uiGridConstants, collectionReportAppService, utilities, userService, commonLookupService, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
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
                createdById: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };


           

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
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

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };

            vm.searchSalePersons = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.salePersons = response.data.items;
                });
            };


            vm.searchUsers = function ($select) {
                return userService.searchUsersOptimized({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
                });
            };


            vm.clearCreatedBy = function () {
                vm.filters.createdBy = null;
                vm.filters.createdById = null;
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


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };

            //Location related code END ---------------

            vm.getCollectionReport = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
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
                collectionReportAppService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };


            function init() {
                getLocations();
                vm.getCollectionReport();
                vm.searchUsersWithDesignation();
            }

            init();
        }
    ]);
