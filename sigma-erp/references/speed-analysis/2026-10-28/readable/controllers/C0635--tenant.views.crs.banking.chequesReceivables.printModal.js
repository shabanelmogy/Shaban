// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168439-168499
appModule.controller('tenant.views.crs.banking.chequesReceivables.printModal', [
        '$scope', 'appSession', '$stateParams', 'utilities', 'abp.services.app.chequesReceivables', 'abp.services.app.commonLookup',
        function ($scope, appSession, $stateParams, utilities, chequesReceivablesService, commonLookupService) {

            var vm = this;
            var chequeReceivableId = 0;
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            //if pop-up print
            if ($scope.$parent) {
               
                if ($scope.$parent.chequeReceivableId.id) {
                    chequeReceivableId = $scope.$parent.chequeReceivableId.id;
                }
            }

            //if through url print
            if (chequeReceivableId == 0 && !isNaN($stateParams.query)) {
                chequeReceivableId = $stateParams.query;
            }

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };


            vm.getUserName = function (userId) {

                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };
            //vm.matureChequeReceivable = $stateParams.filters;


            function init() {
                vm.loading = true;
                chequesReceivablesService.getDepositSlipForPrint({ id: chequeReceivableId }).success(function (result) {

                    vm.matureChequeReceivable = result;
                    vm.getUserName(vm.matureChequeReceivable.creatorUserId);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
