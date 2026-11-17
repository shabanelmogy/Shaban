// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71639-71692
appModule.controller('host.views.hr.staffRequests.closeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.staffRequest', 'staffRequestId', 'utilities',
        function ($scope, $uibModalInstance, staffRequestService, staffRequestId, utilities) {

            var vm = this;

            vm.closingList = [
                "Yes",
                "No"
            ];

            vm.closingListSelected = "";
            vm.msg = "";

            vm.save = function () {
                vm.saving = true;

                

                staffRequestService.closeRequest(
                    staffRequestId
                    
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.loading = true;
                staffRequestService.getStaffRequestForEdit(staffRequestId)
                    .success(function (result) {
                        vm.supportRequest = result;
                        if (vm.supportRequest.tier > 1) {
                            if (vm.supportRequest.tier === 2)
                                vm.msg = "Was this Request related to " + app.localize("Tier1") + " instead of " + app.localize("Tier2") + "?";
                            else if (vm.supportRequest.tier === 3)
                                vm.msg = "Was this Request related to " + app.localize("Tier2") + " instead of " + app.localize("Tier3") + "?";
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            init();
        }
    ]);
