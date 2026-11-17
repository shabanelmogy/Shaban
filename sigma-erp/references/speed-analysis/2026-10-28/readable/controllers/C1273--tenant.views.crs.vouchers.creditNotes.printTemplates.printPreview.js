// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:334417-334444
appModule.controller('tenant.views.crs.vouchers.creditNotes.printTemplates.printPreview', [
        '$scope', 'appSession', 'creditNote', '$uibModalInstance',
        function ($scope, appSession, creditNote, $uibModalInstance) {

            var vm = this;
            vm.creditNote = creditNote;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.CreditNotes.PrintTemplate');
                if (template == undefined || template == '')
                    template = 'standard';
                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/creditNotes/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/creditNotes/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/creditNotes/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
