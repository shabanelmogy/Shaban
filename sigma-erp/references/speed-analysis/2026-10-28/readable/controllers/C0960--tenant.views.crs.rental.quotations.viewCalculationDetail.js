// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:259550-259561
appModule.controller('tenant.views.crs.rental.quotations.viewCalculationDetail', ['$uibModalInstance',  'quotationLine',
        function ($uibModalInstance,quotationLine) {
            var vm = this;
            vm.quotationLine = quotationLine;
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }]);
