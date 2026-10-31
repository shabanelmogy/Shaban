// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360616-360695
appModule.controller('tenant.views.invoices.printInvoiceParkings', ['appSession', '$stateParams', 'abp.services.app.toll', 'abp.services.app.parkingTicket', 'utilities', 'abp.services.app.invoicePrint',
        function (appSession, $stateParams, tollService, parkingTicketService, utilities, invoicePrintService) {
            var vm = this;
            var invoiceId = 0;
            var agreementId = null;
            vm.skipCount = 0;
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
                    return moment(date).utc().local().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getDateFormat = function (date) {
                if (date !== null) {
                    return moment.utc(date).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
           
            if ($stateParams.filters) {
                invoiceId = $stateParams.filters.invoiceId;
                agreementId = $stateParams.filters.agreementId;
                getParkings();
            }
            else if (!isNaN($stateParams.query)) {
                invoiceId = $stateParams.query;
                getParkings();
                getInvoice();
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

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
            function getParkings() {
                vm.loading = true;
                parkingTicketService.getParkingsforInvoice({
                    invoiceId: invoiceId,
                    agreementId: agreementId,
                    maxResultCount: 999,
                    skipCount: 0
                }).success(function (result) {
                    vm.parkingData = result.items;
                    vm.totalItems = result.items.length;
                    vm.total = 0;
                    angular.forEach(vm.parkingData, function (parking) {
                        vm.total += parking.totalAmount;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }

        }]);
