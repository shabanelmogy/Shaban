// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272295-272315
appModule.controller('tenant.views.crs.reports.finesReport.updateFineModel', [
        '$uibModalInstance', 'abp.services.app.uaeFine', 'fine',
        function ($uibModalInstance, finesService, fine) {
            var vm = this;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.fine = fine;
            
            vm.save = function () {
                vm.loading = true;
                finesService.updateFine(vm.fine).success(function (data) {
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            
        }
    ]);
