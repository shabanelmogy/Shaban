// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168692-168707
appModule.controller('tenant.views.crs.banking.chequesReceivables.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = 'standard';
                return '~/App/tenant/views/crs/banking/chequesReceivables/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
