// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168502-168577
appModule.controller('tenant.views.crs.banking.chequesReceivables.report', ['$scope', 'utilities',  'abp.services.app.chequesReceivables', '$stateParams',
        function ($scope, utilities, chequesReceivablesService, $stateParams) {
            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.mandatoryBatchNoCR = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MandatoryBatchNoCR"));
            vm.additionalBatchNoCR = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AdditionalBatchNoCR"));
            vm.filters = null;

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

            vm.getChequeType = function (type) {
                if (type == 23)
                    return app.localize('PdcReceivable');
                else if (type == 25)
                    return app.localize('CDC');
                else return "";
            }

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getStatuses = function (id) {
                if (id == 1) return app.localize("Open");
                if (id == 2) return app.localize("Closed");
            };
            function init() {
                vm.loading = true;
                vm.totalAmount = 0;
                chequesReceivablesService.getChequesReceivablesForPrint(vm.filters).success(function (data) {
                    vm.chequesReceivables = data;
                    vm.chequesReceivables.forEach(function (value) {
                        vm.totalAmount += value.amount;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
