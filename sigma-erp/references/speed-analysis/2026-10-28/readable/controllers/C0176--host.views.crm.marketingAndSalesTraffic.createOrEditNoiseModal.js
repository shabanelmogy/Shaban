// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64913-64961
appModule.controller('host.views.crm.marketingAndSalesTraffic.createOrEditNoiseModal', [
        '$scope', '$uibModalInstance', 'inquiryId', 'abp.services.app.inquiry','statusNotes',
        function ($scope, $uibModalInstance, inquiryId, inquiryService, statusNotes ) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.inquiry = {
                inquiryId: inquiryId,
                statusNotes: statusNotes
            } 
            vm.save = function () {
                debugger
                vm.saving = true;
                inquiryService.updateInquiryType(vm.inquiry).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(vm.project);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.statuses = [
                { id: 1, name: 'Irrelevant' },
                { id: 2, name: 'Test' },
                { id: 3, name: 'Duplicate' }
            ];
            //function init() {
            //    vm.loading = true;
            //    projectService.getProjectForEdit({
            //        id: boardId
            //    }).success(function (result) {
            //        vm.project = result;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });

            //}
            //if (boardId)
            //    init();




        }
    ]);
