// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:219682-219693
appModule.controller('tenant.views.crs.equipmentSales.salesQuotation.viewCalculationDetail', ['$uibModalInstance',  'quotationLine',
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
