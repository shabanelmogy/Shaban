// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:224377-224388
appModule.controller('tenant.views.crs.integrations.eInvoicing.viewInvoiceJsonModal', [
        '$scope', '$uibModalInstance', '$uibModal', 'options',
        function ($scope, $uibModalInstance, $uibModal, options) {

            var vm = this;
            vm.eInvoicePosting = options.eInvoicePosting;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
