// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272274-272291
appModule.controller('tenant.views.crs.reports.finesReport.updateFineDescription',
        [
            '$scope', 'Fine', 'abp.services.app.uaeFine', '$uibModalInstance',
            function ($scope, fine, finesService, $uibModalInstance) {
                var vm = this;
                vm.fine = fine;

                vm.cancel = function () {
                    $uibModalInstance.close();
                };

                vm.save = function () {
                    finesService.updateFineDetail(vm.fine).success(function() {
                        $uibModalInstance.close();
                    });
                }
            }
        ]);
