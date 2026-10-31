// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:166587-166655
appModule.controller('tenant.views.crs.banking.chequesPayables.report', ['$scope','utilities', 'abp.services.app.chequesPayables', '$stateParams',
        function ($scope, utilities, chequesPayablesService, $stateParams) {
            var vm = this;

            vm.mandatoryBatchNoCP = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MandatoryBatchNoCP"));
            vm.additionalBatchNoCP = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AdditionalBatchNoCP"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = null;
            vm.isChequeBatchEnabled = abp.features.isEnabled("CRS.Vouchers.ChequeBatch");

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getChequeStatus = function (status) {
                if (status == 1)
                    return 'Pending';
                else if (status == 2)
                    return 'Deposited';
                if (status == 3)
                    return 'Cleared';
                if (status == 4)
                    return 'Returned';
                else
                    return "";
            };

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getBankName = function (row) {

                return row.bankAccount.accountNo +
                    " " +
                    row.bankAccount.bankName;
            };

            function init() {
                vm.loading = true;
                vm.totalAmount = 0;
                chequesPayablesService.getChequesPayablesForPrint(vm.filters).success(function (data) {
                    vm.chequesPayables = data;
                    vm.chequesPayables.forEach(function (value) {
                        vm.totalAmount += value.amount;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
