// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:338017-338046
appModule.controller('tenant.views.crs.vouchers.debitNotes.printTemplates.printPreview', [
        '$scope', 'appSession', 'debitNote', '$uibModalInstance',
        function ($scope, appSession, debitNote, $uibModalInstance) {

            var vm = this;
            vm.debitNote = debitNote;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.DebitNotes.PrintTemplate').toLowerCase();

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/debitNotes/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/debitNotes/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/debitNotes/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
