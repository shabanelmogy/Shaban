// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:39088-39143
appModule.controller('host.views.cbs.projectsDashboard.compleleMarkModal', [
        '$scope', '$uibModalInstance', 'milestoneId', 'utilities', '$filter', '$uibModal', 'abp.services.app.contactGroup', 'abp.services.app.directory', 'abp.services.app.tenant', 'abp.services.app.milestone',
        function ($scope, $uibModalInstance, milestoneId, utilities, $filter, $uibModal, contactGroupService, directoryService, tenantAppService, milestoneService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.documents = [];
            

            vm.milestone = {
                id: milestoneId,
                documents: []
                
            };

            vm.save = function () {
                vm.saving = true;
                milestoneService.completeMarkMilestone(
                    vm.milestone
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/uploadDocumentsModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.uploadDocumentsModal as vm',
                    backdrop: 'static'


                });
                modalInstance.result.then(function (result) {

                    vm.documents.push(result);
                    vm.milestone.documents = vm.documents;
                });
            };
            

            
        }
    ]);
