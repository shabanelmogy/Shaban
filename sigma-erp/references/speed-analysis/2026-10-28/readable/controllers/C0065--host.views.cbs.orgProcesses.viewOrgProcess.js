// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36543-36571
appModule.controller('host.views.cbs.orgProcesses.viewOrgProcess', [
        '$scope', 'processId', '$uibModalInstance', '$uibModal', 'abp.services.app.orgProcess', 'appSession', 'utilities',
        function ($scope, processId, $uibModalInstance, $uibModal, orgProcessesService, appSession, utilities) {
            var vm = this;
            vm.processId = processId;

            vm.multilineStringToHTML = (s) => utilities.multilineStringToHTML(s);
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s)

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                orgProcessesService.getOrgProcessesForView({
                    id: processId
                }).success(function (result) {
                    vm.process = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }


        ]);
