// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:174459-174487
appModule.controller('tenant.views.crs.bookings.printtemplates.printPreview', [
        '$scope', 'appSession', 'bookingId', '$uibModalInstance',
        function ($scope, appSession, bookingId, $uibModalInstance) {

            var vm = this;
            vm.bookingId = bookingId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Bookings.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/bookings/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/bookings/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/bookings/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
