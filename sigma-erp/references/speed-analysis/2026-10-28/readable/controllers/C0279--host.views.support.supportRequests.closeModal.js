// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81280-81337
appModule.controller('host.views.support.supportRequests.closeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.supportRequestHost', 'supportRequestId', 'utilities',
        function ($scope, $uibModalInstance, supportRequestHostService, supportRequestId, utilities) {

            var vm = this;

            vm.closingList = [
                "Yes",
                "No"
            ];

            vm.closingListSelected = "";
            vm.msg = "";

            vm.save = function () {
                vm.saving = true;

                if (vm.closingListSelected === "Yes")
                    if (vm.supportRequest.tier === 2) //Tier1
                        vm.supportRequest.belongsToTier = 1;
                    else if (vm.supportRequest.tier === 3) //Tier2
                        vm.supportRequest.belongsToTier = 1;

                supportRequestHostService.closeRequest({
                    id: supportRequestId,
                    belongsToTier: vm.supportRequest.belongsToTier
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.loading = true;
                supportRequestHostService.getSupportRequestForEdit({ id: supportRequestId })
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
