// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:150675-150712
appModule.controller('tenant.views.agreements.printFines', ['$scope', 'appSession', '$stateParams', 'abp.services.app.uaeFine',
        function ($scope, appSession, $stateParams, fineService) {
            var vm = this;
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            var agreementId = 0;
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    return "";
                }
            };

            if (!isNaN($stateParams.query)) {
                agreementId = $stateParams.query;
                init();
            }

            function getFines() {
                vm.loading = true;
                fineService.getFines({
                    agreementId: agreementId, downloadPendingfines: false
                }).success(function (result) {
                    vm.finesData = result.fines;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function init() {
                getFines();
            }

        }]);
