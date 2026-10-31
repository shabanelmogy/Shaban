// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:264018-264178
appModule.controller('tenant.views.crs.reports.castleLimoDailyRevenueReport.report', ['$scope', '$stateParams', 'appSession', 'abp.services.app.saleReport', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams,appSession, saleReportService, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.filters = {
                fromDate: null,
                toDate: null
            };
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            //getstatus
            vm.getStatus = function (x) { // Agreement Status Name
                if (x == 1) {
                    return app.localize('Open');
                } else if (x == 2) {
                    return app.localize('Closed');
                }
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getAgreementType = function (id) {
                if (id != null) {
                    if (id == 1)
                        return app.localize("Daily")
                    if (id == 2)
                        return app.localize("Weekly")
                    if (id == 3)
                        return app.localize("Monthly")
                    if (id == 4)
                        return app.localize("Lease")
                }
                else {
                    return "";
                }
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.roundWithSerators = function (amount) {
                if (amount == null) return null;

                // Check if the amount is a whole number (no decimal places)
                const isWholeNumber = amount === Math.floor(amount);

                const formattedAmount = new Intl.NumberFormat('en', {
                    style: 'decimal',
                    minimumFractionDigits: isWholeNumber ? 2 : 2,
                    maximumFractionDigits: 2
                }).format(amount);

                return formattedAmount;
            };
            
            vm.getContactCategory = function (id) {
                if (id != null) {
                    if (id == 1)
                        return app.localize("Individual")
                    if (id == 2)
                        return app.localize("Company")
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
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }
            vm.getLimoDailyRevenueReport = function () {
                vm.loading = true;

                saleReportService.getDailyRevenueReport(vm.filters).success(function (result) {
                    vm.report = result;

                    vm.sumLimoDaily = 0.0;
                    vm.sumLimoMTD = 0.0;
                    vm.sumRental_LeaseDaily = 0.0;
                    vm.sumRental_LeaseMTD = 0.0;
                    vm.grandTotal = 0.0;

                    vm.sumLimoDaily = vm.report.map(item => item.limoDaily).reduce((acc, limoDaily) => acc + limoDaily, 0);
                    vm.sumLimoMTD = vm.report.map(item => item.limoMTD).reduce((acc, limoMTD) => acc + limoMTD, 0);
                    vm.sumRental_LeaseDaily = vm.report.map(item => item.rental_LeaseDaily).reduce((acc, rental_LeaseDaily) => acc + rental_LeaseDaily, 0);
                    vm.sumRental_LeaseMTD = vm.report.map(item => item.rental_LeaseMTD).reduce((acc, rental_LeaseMTD) => acc + rental_LeaseMTD, 0);
                    vm.grandTotal = vm.sumLimoMTD + vm.sumRental_LeaseMTD;

                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getLimoDailyRevenueReport();
            };
            getLocations();

            init();

        }]);
