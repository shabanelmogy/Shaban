// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360482-360560
appModule.controller('tenant.views.invoices.printInvoiceDarbs', ['appSession', '$stateParams', 'abp.services.app.toll', 'utilities', 'abp.services.app.invoicePrint',
        function (appSession, $stateParams, tollService, utilities, invoicePrintService) {
            var vm = this;
            var invoiceId = 0;
            var agreementId = null;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.tenancyNameLower = appSession.tenant.tenancyName.toLowerCase();
            vm.locationId = appSession.user.locationId;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isCruiserentacar = appSession.tenant.tenancyName.toLowerCase() == 'cruiserentacar';
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    //var localTime = moment.utc(date).toDate();
                    //return moment(localTime).format(vm.dateTimeFormat);
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            if ($stateParams.filters)
            {
                invoiceId = $stateParams.filters.invoiceId;
                agreementId = $stateParams.filters.agreementId;
                getTolls();
                getInvoice();
            }
            else if (!isNaN($stateParams.query)) {
                invoiceId = $stateParams.query;
                getTolls();
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }
            function getInvoice() {
                vm.loading = true;
                invoicePrintService.getInvoiceForPrint({
                    id: invoiceId
                }).success(function (result) {
                    vm.invoice = result.printInvoice;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getTolls() {
                vm.loading = true;
                tollService.getTollsForInvoice({
                    invoiceId: invoiceId,
                    agreementId: agreementId,
                    server:2 // for darbTOlls
                }).success(function (result) {
                    vm.tollsData = result;
                    vm.totalItems = result.length;
                    vm.total = 0;
                    angular.forEach(vm.tollsData, function (toll) {
                        vm.total += toll.amountWithSurcharge;
                    });
                    
                }).finally(function () {
                    vm.loading = false;
                });
            }

        }]);
