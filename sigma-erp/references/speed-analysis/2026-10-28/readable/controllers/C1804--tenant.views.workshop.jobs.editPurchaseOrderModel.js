// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:493393-493443
appModule.controller('tenant.views.workshop.jobs.editPurchaseOrderModel', [
        '$uibModalInstance', 'abp.services.app.job', 'abp.services.app.jobEstimation', 'abp.services.app.purchaseOrder', 'job', 'utilities',
        function ($uibModalInstance, jobAppService, jobEstimationAppService, purchaseOrdersService, job, utilities) {

            var vm = this;
            vm.lPONo = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.job = job;
            vm.insuranceCompanySumTax = 0;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
          
            vm.save = function () {
                vm.saving = true;
                jobAppService.updatePo(vm.job).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
           
            vm.searchLPONo = function ($select) {
                
                return purchaseOrdersService
                    .searchLPONo({ keyWord: $select.search, voucherSubType: 39, contactId: vm.job.customerId }).then(function (response) {
                        vm.lPONo = response.data;
                    });
            };

            vm.updatePO = function (jobId) {
                vm.loading = true;
                jobAppService.getJobForEdit({ id: jobId })
                    .success(function (result) {
                        vm.job = result;

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };


            vm.updatePO(vm.job.id);

        }]);
