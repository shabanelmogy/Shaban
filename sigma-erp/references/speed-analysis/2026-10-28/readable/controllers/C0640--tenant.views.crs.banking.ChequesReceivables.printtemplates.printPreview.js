// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168711-168749
appModule.controller('tenant.views.crs.banking.ChequesReceivables.printtemplates.printPreview', [
        '$scope', 'appSession', 'filters', '$uibModalInstance',
        function ($scope, appSession, filters, $uibModalInstance) {

            var vm = this;
            vm.filters = filters;

            vm.chequesReceivablesIds = [];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            if (vm.filters) {
                if (!isNaN(vm.filters.id)) {
                    vm.chequesReceivablesIds.push({ id: vm.filters.id, printHeader: vm.filters.printHeader });
                } else {
                    var printHeader = vm.filters.printHeader;
                    var chequesReceivablesIds = vm.filters.ids;
                    chequesReceivablesIds.forEach(function (value) {
                        vm.chequesReceivablesIds.push({ id: value, printHeader: printHeader });
                    });
                    if (vm.chequesReceivablesIds.length == 2) {
                        if (vm.chequesReceivablesIds[1] == "")
                            vm.chequesReceivablesIds.splice(1, 1);
                    }

                }
            }

            vm.getTemplateUrl = function () {
                var template = 'standard';
                return '~/App/tenant/views/crs/banking/chequesReceivables/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
