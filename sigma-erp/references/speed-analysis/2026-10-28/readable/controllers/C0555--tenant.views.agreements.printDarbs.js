// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:150627-150672
appModule.controller('tenant.views.agreements.printDarbs', ['$scope', 'appSession', '$stateParams', 'abp.services.app.toll',
        function ($scope, appSession, $stateParams,tollService) {
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

            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }

            function getTolls() {
                vm.loading = true;
                tollService.getTolls({
                    agreementId: agreementId, downloadPendingTolls: false, server:2
                }).success(function (result) {
                    vm.tollsData = result.tolls;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function init() {
                getTolls();
            }
           
        }]);
