// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:281710-281826
appModule.controller('tenant.views.crs.reports.salesPersonInvoicesReport.report', ['$scope', '$stateParams', 'abp.services.app.saleReport', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, saleReportService, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = null;

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
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }
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
            function init() {
                vm.loading = true;
                
                saleReportService.getSalesPersonInvoiceView(vm.filters).success(function (result) {
                    vm.report = result;
                }).finally(function () {
                    vm.loading = false;
                });;
            };
            getLocations();

            init();

        }]);
