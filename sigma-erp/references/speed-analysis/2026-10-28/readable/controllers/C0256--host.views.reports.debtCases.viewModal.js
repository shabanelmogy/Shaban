// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:77237-77281
appModule.controller('host.views.reports.debtCases.viewModal', [
        '$uibModalInstance', 'caseId', 'abp.services.app.case',
        function ($uibModalInstance, caseId, caseService) {
            var vm = this;
            vm.getCaseStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
            };
            vm.getCaseLabelColour = function (labelColour) {
                if (!labelColour)
                    return '';
                if (labelColour == 1)
                    return 'Grey';
                if (labelColour == 2)
                    return 'Red';
                if (labelColour == 3)
                    return 'Yellow';
                if (labelColour == 4)
                    return 'Green';
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            
            function init() {
                vm.loading = true;
                caseService.getCaseForView({
                    id: caseId
                }).success(function (result) {
                    vm.case = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
