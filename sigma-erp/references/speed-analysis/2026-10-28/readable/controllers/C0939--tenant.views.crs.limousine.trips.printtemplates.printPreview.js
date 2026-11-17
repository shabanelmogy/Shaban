// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255064-255119
appModule.controller('tenant.views.crs.limousine.trips.printtemplates.printPreview', [
        '$scope', 'appSession', '$uibModalInstance', 'filters',
        function ($scope, appSession, $uibModalInstance, filters) {

            var vm = this;
          //  vm.tripId = tripId;
            vm.filters = filters;

            vm.tripIds = [];

            if (vm.filters) {
                if (!isNaN(vm.filters.id)) {
                    vm.tripIds.push({ id: vm.filters.id});
                } else {
                  //  var printHeader = vm.filters.printHeader;
                    var tripIds = vm.filters.ids;
                    tripIds.forEach(function (value) {
                        vm.tripIds.push({ id: value});
                    });
                    //in case of only one id
                    if (vm.tripIds.length == 2) {
                        if (vm.tripIds[1] == "")
                            vm.tripIds.splice(1, 1);
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
                var template = abp.features.getValue('CRS.LimoTrip.PrintTemplate').toLowerCase();
                // Tenancy Name eastcoast
               // var template = '';
                //var template = abp.features.getValue('CRS.Vouchers.Invoices.PrintTemplate').toLowerCase();
                //if (appSession.tenant.tenancyName.toLowerCase() == 'default' || appSession.tenant.tenancyName.toLowerCase() == 'eastcoast')
                //    template = 'custom';
                vm.templatePath = '';
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    vm.templatePath = '~/App/tenant/views/crs/limousine/trips/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    vm.templatePath = '~/App/tenant/views/crs/limousine/trips/printTemplates/englisharabic.cshtml';
                else
                    vm.templatePath = '~/App/tenant/views/crs/limousine/trips/printTemplates/' + template + '.cshtml';
            };

            vm.getTemplateUrl();
        }
    ]);
