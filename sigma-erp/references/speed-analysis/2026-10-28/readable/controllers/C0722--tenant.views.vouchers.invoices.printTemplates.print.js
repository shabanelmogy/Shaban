// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:187184-187229
appModule.controller('tenant.views.vouchers.invoices.printTemplates.print', [
        '$stateParams', '$scope', 'appSession',
        function ($stateParams, $scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            debugger;
            vm.invoiceIds = [];


            if ($stateParams.filters) {
                if (!isNaN($stateParams.filters.id)) {
                    vm.invoiceIds.push({ id: $stateParams.filters.id, printHeader: $stateParams.filters.printHeader });
                } else {
                    var printHeader = $stateParams.filters.printHeader;
                    var invoiceIds = $stateParams.filters.ids;
                    invoiceIds.forEach(function (value) {
                        vm.invoiceIds.push({ id: value, printHeader: printHeader });
                    });
                    //in case of only one id
                    if (vm.invoiceIds.length == 2) {
                        if (vm.invoiceIds[1] == "")
                            vm.invoiceIds.splice(1, 1);
                    }

                }
            }

            vm.getTemplateUrl = function () {
                
                var template = abp.features.getValue('CRS.Vouchers.Invoices.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/invoices/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
