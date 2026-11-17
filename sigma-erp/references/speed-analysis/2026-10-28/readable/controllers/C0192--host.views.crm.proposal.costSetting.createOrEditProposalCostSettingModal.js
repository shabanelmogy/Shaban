// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:67499-67540
appModule.controller('host.views.crm.proposal.costSetting.createOrEditProposalCostSettingModal', [
        '$scope', '$uibModalInstance', 'proposalId', 'abp.services.app.proposal', 'abp.services.app.directory', 'abp.services.app.edition',
        function ($scope, $uibModalInstance, proposalId, proposalService, directoryService, editionService) {

            var vm = this;
            vm.saving = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        
          

         

            function init() {
             //   vm.loading = true;
                //proposalService.getProposalForEdit({ id: proposalId }).success(function (result) {
                //    getEditions();
                //    vm.proposal = result;
                //    if (proposalId > 0) {
                //        vm.isEditMod = true;
                //        vm.searchLicencePlan(null);
                //        vm.searchsupportPlan(null);
                //        vm.proposal.proposalDetail.licenceType = vm.licence.filter(r => r.id == result.proposalDetail.licenceType)[0];
                //        if (vm.proposal.proposalDetail.customization.customizationDescriptionList == null) {
                //            vm.proposal.proposalDetail.customization.customizationDescriptionList = [];
                //            vm.addRow();
                //        }
                //    }
                //    else {
                //        vm.isEditMod = false;
                //        vm.addRow();
                //    }
                //}).finally(function () {
                //    vm.loading = false;
                //});
            }

            init();
        }
    ]);
