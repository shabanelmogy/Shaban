// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:88125-88141
appModule.controller('tenant.views.common.customization.showLogDocumentsModal', [
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
