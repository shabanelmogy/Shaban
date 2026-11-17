// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36292-36316
appModule.controller('host.views.cbs.milestones.viewModal', [
        '$scope', '$uibModalInstance', 'options', 'abp.services.app.milestone',
        function ($scope, $uibModalInstance, options, milestoneService) {

            var vm = this;
            vm.loading = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                milestoneService.getMilestoneForEdit({
                    id: options.milestoneId
                }).success(function (result) {
                    vm.milestone = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
