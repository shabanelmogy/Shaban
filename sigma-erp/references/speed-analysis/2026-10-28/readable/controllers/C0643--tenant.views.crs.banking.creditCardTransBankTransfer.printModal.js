// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:169481-169552
appModule.controller('tenant.views.crs.banking.creditCardTransBankTransfer.printModal', [
        '$scope', 'appSession', '$stateParams', 'utilities', 'abp.services.app.creditCardTransBankTransfer', 'abp.services.app.commonLookup',
        function ($scope, appSession, $stateParams, utilities, creditCardTransTransferService, commonLookupService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.userName = appSession.user.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            var creditCardTransBankTransferId = 0;

            if (!isNaN($stateParams.query)) {
                creditCardTransBankTransferId = $stateParams.query;
            }

            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.creditCardTransBankTransferId)
                    creditCardTransBankTransferId = $scope.$parent.vmMain.creditCardTransBankTransferId;
            }

            //if through url print
            if (creditCardTransBankTransferId == 0 && !isNaN($stateParams.query)) {
                creditCardTransBankTransferId = $stateParams.query;
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
                creditCardTransTransferService.getCreditCardTransBankTransferForPrint({ id: creditCardTransBankTransferId })
                   .success(function (result) {
                       vm.totalDebit = 0.0;
                       vm.totalCredit = 0.0;
                       vm.creditCardTransBankTransfer = result;
                        
                       angular.forEach(vm.creditCardTransBankTransfer.voucherLines, function (value) {

                           vm.totalDebit = vm.totalDebit + value.debit;
                           vm.totalCredit = vm.totalCredit + value.credit;
                       });
                       getUserName(vm.creditCardTransBankTransfer.creatorUserId);
                   }).finally(function () {
                       vm.loading = false;
                   });
            }

            init();
        }
    ]);
