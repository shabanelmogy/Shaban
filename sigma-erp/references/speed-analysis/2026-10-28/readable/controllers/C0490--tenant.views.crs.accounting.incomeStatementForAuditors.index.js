// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:124382-124457
appModule.controller('tenant.views.crs.accounting.incomeStatementForAuditors.index', [
        '$scope', 'abp.services.app.incomeStatementForAuditors', 'utilities', 'abp.services.app.fiscalYear', 'appSession',
        function ($scope, incomeStatementForAuditorsService, utilities, fiscalYearService, appSession) {

            var vm = this;

            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.incomeStatementForAuditor = null;

            vm.loading = false;
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
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
            vm.rounding = function (value) {
                if (value != null) {
                    return utilities.round(value, 2);
                }
                else {
                    return 0;
                }
            };

            vm.filters = {
                fiscalYear: null
            };
            vm.fiscalYears = [];
            function getFiscalYears() {
                fiscalYearService.getFiscalYears({}).success(function (data) {
                    vm.fiscalYears = data.items;
                    console.log(vm.fiscalYears);
                }).finally(function () {

                });
            };

            vm.getIncomeStatementForAuditors = function () {
                vm.loading = true;

                incomeStatementForAuditorsService.getIncomeStatementReportForAuditors(vm.filters.fiscalYear).success(function (data) {
                    vm.incomeStatementForAuditor = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            getFiscalYears();
        }
    ]);
