// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:379666-379734
appModule.controller('tenant.views.crs.vouchers.provisions.transactionsModal', ['$uibModal', 'provision',
        '$uibModalInstance', 'abp.services.app.provision', 'utilities', 'abp.services.app.account', 'abp.services.app.commonLookup', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'appSession', '$filter', 'abp.services.app.item', 'abp.services.app.job', 'abp.services.app.jV',

        function ($uibModal, provision, $uibModalInstance, provisionService, utilities, accountService, commonLookupService, vehicleService, directoryService,
            appSession, $filter, itemAppService, jobAppService, JVService) {

            var vm = this;

            //$scope.$on('$viewContentLoaded', function () {
            //    App.initAjax();
            //});

            vm.loading = false;
            vm.journal = null;
            vm.provision = provision;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            //vm.dateRangeOptions.min = moment().startOf('month').format('YYYY-MM-DD');
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.accounts = [];
            vm.voucherTypes = null;
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
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
                return utilities.round(value, 2);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;

                provisionService.getTransactions({ id: vm.provision.provisionVoucherId }).success(function (result) {
                    vm.journal = result.items;
                    vm.journal.totalDebit = 0;
                    vm.journal.totalCredit = 0;
                    angular.forEach(vm.journal, function (obj) {
                        vm.journal.totalDebit += obj.debit;
                        vm.journal.totalCredit += obj.credit;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }]);
