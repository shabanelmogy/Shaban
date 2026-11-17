// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:263146-263279
appModule.controller('tenant.views.crs.reports.amortizationReport.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.amortizationReport', 'abp.services.app.amortizationReportFY', 'utilities', 'abp.services.app.commonLookup','utilities',
        function ($scope, uiGridConstants, amortizationReportAppService, amortizationReportFYService, utilities, commonLookupService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.linkedPrepaidAccounts = [];
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
                locationId2: null,
                prepaidAccountId: null,
                prepaidAccount: null,
                account: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.clearModel = function () {
                vm.filters.account = null;
                vm.filters.prepaidAccountId = null;
            };
            //vm.dateRangeModel = {
            //    startDate: null,
            //    endDate: null,
            //};
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('month'),
                    endDate: moment().endOf('month'),
                };
            }
            vm.getLinkedPrepaid = function ($select) {
                //linkedPrepaidExpenseService.getLinkedPrepaidExpense().success(function (data) {
                //    vm.linkedPrepaid = data.items;
                //}).finally(function () {
                //    vm.loading = false;
                //});
                if ($select.search == "") { vm.linkedPrepaid = null; return null; }
                return amortizationReportAppService.searchPrepaidAccounts({ filter: $select.search }).then(function (result) {
                    vm.linkedPrepaidAccounts = result.data.items;
                });
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
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

            vm.round = function (amount) {
                if (amount == null) return null;
                return utilities.round(amount, 2);
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
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.LocationsForAgreement = data.items;
                });
            };

            vm.getAmortizationReport = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.account)
                    vm.filters.prepaidAccountId = vm.filters.account.prepaidAccountId;
                amortizationReportAppService.getAmortizationReport(vm.filters).success(function (result) {
                    vm.reportData = result;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                amortizationReportAppService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                initDate();
                getLocations();
                vm.getAmortizationReport();
            }

            init();
        }
    ]);
