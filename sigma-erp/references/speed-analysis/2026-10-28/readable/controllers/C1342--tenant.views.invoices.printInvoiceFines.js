// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360563-360613
appModule.controller('tenant.views.invoices.printInvoiceFines', ['appSession', '$stateParams', 'abp.services.app.uaeFine', 'abp.services.app.invoicePrint',
        function (appSession, $stateParams, fineService, invoicePrintService) {
            var vm = this;
            vm.loading = false;
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
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            if (!isNaN($stateParams.query)) {
                invoiceId = $stateParams.query;
                getFines();
                getInvoice();
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
            function getFines() {
                vm.loading = true;
                fineService.getFinesForInvoice({
                    invoiceId: invoiceId,
                }).success(function (result) {
                    vm.finesData = result;
                    vm.totalItems = result.length;
                }).finally(function () {
                    vm.loading = false;
                });
            }


        }]);
