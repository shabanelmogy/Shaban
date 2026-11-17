// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:114532-114548
appModule.controller('tenant.views.common.supportRequests.showLogDocumentsModal', [
        '$scope', 'logRequest','$uibModalInstance',
        function ($scope, logRequest, $uibModalInstance) {

            var vm = this;
            vm.logRequest = logRequest;

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();;
            }
        }
    ]);
