// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360806-360845
appModule.controller('tenant.views.invoices.printInvoiceTrips', ['appSession', '$stateParams', 'abp.services.app.limoTrip',
        function (appSession, $stateParams,fineService) {
            var vm = this;
            vm.loading = false;

            vm.trips = [];
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            
            if (!isNaN($stateParams.query)) {
                var invId = $stateParams.query;
                getTrips(invId);
            }

            function getTrips(invoiceId) {
                vm.loading = true;
                fineService.getInvoiceTrips({
                    id: invoiceId,
                }).success(function (result) {
                    
                    vm.trips = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            
            
        }]);
