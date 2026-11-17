// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64763-64804
appModule.controller('host.views.crm.marketingAndSalesTraffic.createInquiryLogModal',
        [
            '$scope', '$uibModal', '$uibModalInstance', 'inquiryId', 'abp.services.app.inquiry',
            function ($scope, $uibModal, $uibModalInstance, inquiryId, inquiryService) {
                var vm = this;

                //vm.filters = {
                //    inquiryId: inquiryId,
                //    notes: null,
                //    nextFollowupDate: null,

                //};


                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.stageChange = function () {
                    getStatuses();
                }

                vm.save = function () {
                    vm.saving = true;

                    vm.inquiryLog.inquiryId = inquiryId;
                    vm.inquiryLog.nextFollowupDate = moment(vm.inquiryLog.nextFollowupDate).startOf('day').utc();
                    console.log(vm.inquiryLog);

                    inquiryService.saveInquiryLogs(vm.inquiryLog).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.close();
                };
            }
        ]);
