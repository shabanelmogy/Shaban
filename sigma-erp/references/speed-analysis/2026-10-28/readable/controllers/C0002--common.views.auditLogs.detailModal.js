// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:24616-24640
appModule.controller('common.views.auditLogs.detailModal', [
        '$scope', '$uibModalInstance', 'auditLog',
        function ($scope, $uibModalInstance, auditLog) {
            var vm = this;

            vm.auditLog = auditLog;

            vm.getExecutionTime = function() {
                return moment(vm.auditLog.executionTime).fromNow() + ' (' + moment(vm.auditLog.executionTime).format('YYYY-MM-DD hh:mm:ss') + ')';
            };

            vm.getDurationAsMs = function() {
                return app.localize('Xms', vm.auditLog.executionDuration);
            };

            vm.getFormattedParameters = function() {
                var json = JSON.parse(vm.auditLog.parameters);
                return JSON.stringify(json, null, 4);
            }

            vm.close = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
