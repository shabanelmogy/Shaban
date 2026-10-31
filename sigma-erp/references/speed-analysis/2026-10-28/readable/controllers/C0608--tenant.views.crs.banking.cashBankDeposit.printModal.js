// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:164598-164657
appModule.controller('tenant.views.crs.banking.cashBankDeposit.printModal', [
        '$scope', 'appSession', '$stateParams', 'utilities', 'abp.services.app.cashBankDeposit', 'abp.services.app.commonLookup',
        function ($scope, appSession, $stateParams, utilities, cashDepositService, commonLookupService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.userName = appSession.user.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            var cashDepositId = 0;

            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.cashDepositId)
                    cashDepositId = $scope.$parent.vmMain.cashDepositId;
            }

            //if through url print
            if (cashDepositId == 0 && !isNaN($stateParams.query)) {
                cashDepositId = $stateParams.query;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY-MM-DD';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };

            function getUserName(userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            function init() {
                vm.loading = true;
                cashDepositService.getCashDepositForPrint({ id: cashDepositId })
                   .success(function (result) {
                       vm.cashDeposit = result;
                       getUserName(vm.cashDeposit.creatorUserId);
                   }).finally(function () {
                       vm.loading = false;
                   });
            }

            init();
        }
    ]);
