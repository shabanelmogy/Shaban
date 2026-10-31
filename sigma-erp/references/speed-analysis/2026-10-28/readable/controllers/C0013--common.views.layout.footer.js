// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:26256-26292
appModule.controller('common.views.layout.footer', [
        '$rootScope', 'appSession',
        function ($scope, appSession) {
            var vm = this;

            $scope.$on('$includeContentLoaded', function () {
                Layout.initFooter(); // init footer
            });

            vm.getProductNameWithEdition = function() {
                var productName = 'Speed';


                var fullUrl = window.location.host;
                //window.location.host is subdomain.domain.com
                var urlParts = fullUrl.split('.');
                
                var subDomainName = urlParts[1];
                if (subDomainName != null) {
                    if (subDomainName.toLowerCase() == 'carlet') {
                        productName = 'Carlet - Powered by Speed Auto Systems';
                    }
                    else {
                        productName = 'Speed';
                    }
                }
                else {
                    productName = 'Speed';
                }
                if (appSession.tenant && appSession.tenant.editionDisplayName) {
                    productName = productName + ' ' + appSession.tenant.editionDisplayName;
                }

                return productName;
            }
        }
    ]);
