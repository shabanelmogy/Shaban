// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:223881-223971
appModule.controller('tenant.views.crs.init.index', [
        '$scope', 'abp.services.app.account', 'abp.services.app.linkedAccount', 'abp.services.app.expenseType', 'abp.services.app.init',
    function ($scope, accountService, linkedAccountService, expenseTypeService, initService) {
        var vm = this;
        vm.loading = false;
        vm.disableDefineChartOfAccounts = false;
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });
        vm.searchAccounts = function ($select) {
            if ($select.search == "") { vm.accounts = null; return null; }
            return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                vm.accounts = response.data.items;
            });
        };
        vm.localize = function (input) {
            if (input == null)
                return "";

            return app.localize(input);
        };
        vm.dateRangeModel = {
            startDate: moment().startOf('day'),
            endDate: moment().endOf('day')
        };
        vm.save = function () {
            //vm.saving = true;
            //linkedAccountService.createOrUpdateLinkedAccount({
            //    linkedAccount: vm.linkAccounts
            //}).success(function (data) {
            //    abp.notify.info(app.localize('SavedSuccessfully'));
            //    init();
            //}).finally(function () {
            //    vm.saving = false;
            //});
            vm.saving = true;
            angular.forEach(vm.expenseTypes, function (value, key) {
                value.expenseTypeId = value.id;
            });
            vm.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            vm.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            initService.initialize({
                init: vm.expenseTypes,
                startDate: vm.fromDate,
                endDate: vm.toDate,
                voucherFromId: vm.voucherFromId,
                voucherToId: vm.voucherToId,

            }).success(function (data) {
                abp.notify.info(app.localize('SavedSuccessfully'));
                vm.listOfErrors = data;
                init();

            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.getAccounts = function () {
            vm.loading = true;
            accountService.getAccounts({}).success(function (data) {
                vm.chartofAccounts = data.items;
                if (vm.chartofAccounts.length > 0)
                    vm.disableDefineChartOfAccounts = true;
            }).finally(function () {
                vm.loading = false;
            });
        };
        vm.defineChartOfAccounts = function () {
            vm.loading = true;
            accountService.initializeChartOfAccounts().success(function () {
                vm.getAccounts();
            });
        };
        function init() {
            vm.loading = true;

            expenseTypeService.getExpenseTypes().success(function (data) {
                vm.expenseTypes = data.items;
            }).finally(function () {
                vm.loading = false;
                vm.getAccounts();
            });
        }
        init();

    }
    ]);
