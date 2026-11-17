// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:166704-166749
appModule.controller('tenant.views.crs.banking.chequesPayables.printtemplates.printPreview', [
        '$scope', 'appSession', 'filters', '$uibModalInstance',
        function ($scope, appSession, filters, $uibModalInstance) {
            var vm = this;
            vm.filters = filters;

            vm.chequeIds = [];
            if (vm.filters) {
                if (!isNaN(vm.filters.id)) {
                    vm.chequeIds.push({ id: vm.filters.id });
                } else {
                    var chequeIds = vm.filters.ids;
                    chequeIds.forEach(function (value) {
                        vm.chequeIds.push({ id: value });
                    });
                    //in case of only one id
                    if (vm.chequeIds.length == 2) {
                        if (vm.chequeIds[1] == "")
                            vm.chequeIds.splice(1, 1);
                    }

                }
            }

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Banking.ChequesPayables.PrintTemplate').toLowerCase();

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/banking/chequesPayables/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else
                    return '~/App/tenant/views/crs/banking/chequesPayables/printTemplates/' + template + '.cshtml';
            };

        }
    ]);
