// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:70093-70175
appModule.controller('host.views.customization.milestoneInvoiceStatusModal', [
        '$scope', '$uibModalInstance', 'milestone', 'utilities', '$filter', '$uibModal', 'abp.services.app.milestone',
        function ($scope, $uibModalInstance, milestone, utilities, $filter, $uibModal, milestoneService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod =true;
            vm.documents = [];
            vm.milestone = milestone;

            //if (milestone.milestoneStatus == 2)
            //    vm.isEditMod = false;

            vm.milestoneDto = {
                id: milestone.id,
                //milestonePaymentStatus: milestone.milestonePaymentStatus,
                invoiceStatus: milestone.invoiceStatus,
                invoiceRefNo: null
            };

            vm.statusChange = function () {

                if (vm.milestoneDto.milestoneStatus != 2) {
                    //vm.milestoneDto.isInvoice = false;
                    vm.milestoneDto.documents.length = 0;
                }
            };

            vm.milestoneStatuses = [
                { id: 1, name: "Open" },
                { id: 3, name: "Delivered" },
                { id: 2, name: "Complete" }
            ];

            vm.milestonePaymentStatuses = [
                { id: 1, name: "Pending" },
                { id: 2, name: "Received" }
            ];

            vm.invoiceStatuses = [
                { id: 1, name: "Not-Invoiced" },
                { id: 2, name: "Invoiced" }
            ];

            vm.save = function () {
                vm.saving = true;
                milestoneService.updateMilestoneInvoiceStatus(
                    vm.milestoneDto
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

                    vm.milestoneDto.documents.push(result);
                });
            };
            

            
        }
    ]);
