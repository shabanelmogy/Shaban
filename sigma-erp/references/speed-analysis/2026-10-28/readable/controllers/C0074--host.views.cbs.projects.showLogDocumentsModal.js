// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:38650-38666
appModule.controller('host.views.cbs.projects.showLogDocumentsModal', [
        '$scope', 'projectLog','$uibModalInstance',
        function ($scope, projectLog, $uibModalInstance) {

            var vm = this;
            vm.projectLog = projectLog;

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();;
            }
        }
    ]);
