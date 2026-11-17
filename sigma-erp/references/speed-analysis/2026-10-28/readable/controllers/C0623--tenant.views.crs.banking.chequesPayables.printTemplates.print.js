// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:166659-166700
appModule.controller('tenant.views.crs.banking.chequesPayables.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.chequeIds = [];

            if ($stateParams.filters) {
                if (!isNaN($stateParams.filters.id)) {
                    vm.chequeIds.push({ id: $stateParams.filters.id });
                } else {
                    var chequeIds = $stateParams.filters.ids;
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
