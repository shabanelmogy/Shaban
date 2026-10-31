// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76701-76722
appModule.controller('host.views.reports.debtCases.closeCaseModal', [
        '$scope', '$uibModalInstance', 'caseId', 'abp.services.app.case',
        function ($scope, $uibModalInstance, caseId, caseService) {
            var vm = this;
            vm.caseId = caseId;
            vm.case = { detail: '' };

            vm.save = function () {
                caseService.closeCase({
                    Id: vm.caseId,
                    Detail: vm.case.detail
                }).success(function () {
                    abp.notify.success('Debt Case closed successfully');
                    $uibModalInstance.close();
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
