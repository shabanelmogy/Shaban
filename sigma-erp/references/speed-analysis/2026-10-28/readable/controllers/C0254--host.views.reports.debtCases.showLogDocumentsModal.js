// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:77148-77164
appModule.controller('host.views.reports.debtCases.showLogDocumentsModal', [
        '$scope', 'caseLog','$uibModalInstance',
        function ($scope, caseLog, $uibModalInstance) {

            var vm = this;
            vm.caseLog = caseLog;

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();;
            }
        }
    ]);
