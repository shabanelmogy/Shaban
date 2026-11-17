// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360698-360803
appModule.controller('tenant.views.invoices.printInvoiceTolls', ['appSession', '$stateParams', 'abp.services.app.toll', 'utilities', 'abp.services.app.invoicePrint',
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
            vm.showTaxColumnInTollPrint = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTaxColumnInTollPrint"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));

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
            }
            else if (!isNaN($stateParams.query)) {
                invoiceId = $stateParams.query;
                getTolls();
                getInvoice();
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
                    server: 1 // for Dubai TOlls
                }).success(function (result) {

                    vm.tollsData = result;
                    vm.totalItems = result.length;
                    vm.total = 0;
                    vm.totalAmount = 0;
                    vm.totalSurcharge = 0;
                    vm.totalTax = 0;
                    vm.totalAmountWithTax = 0;

                    angular.forEach(vm.tollsData, function (toll) {
                        if (vm.showTaxColumnInTollPrint) {

                            var surcharge = Number(toll.surcharge) || 0;
                            var amountWithSurcharge = Number(toll.amountWithSurcharge) || 0;

                            toll.taxAmount = surcharge * vm.taxPercent / 100;
                            toll.amountWithTax = amountWithSurcharge + toll.taxAmount;

                            vm.totalAmount += toll.amount;
                            vm.totalSurcharge += toll.surcharge;
                            vm.totalTax += toll.taxAmount;
                            vm.totalAmountWithTax += toll.amountWithTax;
                        
                        }
                        else {
                            vm.total += toll.amountWithSurcharge;
                            vm.totalAmount += toll.amount;
                            vm.totalSurcharge += toll.surcharge;
                        }
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }

        }]);
