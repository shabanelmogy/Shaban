// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:223424-223443
appModule.controller('tenant.views.fines.printTrafficFineImage', ['$scope', 'appSession', '$stateParams',
        'abp.services.app.uaeFine', 'abp.services.app.trafficFine',
        function ($scope, appSession, $stateParams, fineService, trafficFineAppService) {
            var vm = this;
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            var trafficFineId = 0;
            trafficFineId = $stateParams.query;
            function init() {
                vm.loading = true;
                trafficFineAppService.getImageForEmail({ id: trafficFineId }).success(
                       function (data) {
                           vm.displayImageWithToken = data;
                       }).finally(function () {
                           vm.loading = false;
                       });
            }
            init();
        }]);
