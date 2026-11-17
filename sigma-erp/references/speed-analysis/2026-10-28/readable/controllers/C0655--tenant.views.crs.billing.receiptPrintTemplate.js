// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170561-170659
appModule.controller('tenant.views.crs.billing.receiptPrintTemplate', [
        '$scope', 'utilities', 'invoiceDetail', 'filters', '$uibModalInstance', 'abp.services.app.billing', 'abp.services.app.customerCareTenant',
        function ($scope, utilities, invoiceDetail, filters, $uibModalInstance, billingService, customerCareTenantService) {

            var vm = this;
            vm.loading = false;
            vm.receiptId = filters;
            vm.invoiceDetail = invoiceDetail;
            vm.dateNow = new Date();
            vm.logos = [{ id: 1, name: 'Speed Auto Systems' }, { id: 2, name: 'karzansoft' }];
            vm.currencies = [
                { id: 1, name: "USD", rate: 1 },
                { id: 2, name: "AED", rate: 3.67 },
                { id: 3, name: "GBP", rate: 0.84 },
                { id: 4, name: "SAR", rate: 3.75 }
            ];

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.dateNow = new Date();
            vm.businessName = [
                { id: 1, name: "Karzansoft (UAE)", currency: "AED", tax: 0 },
                { id: 2, name: "Speed Auto Systems ", currency: "AED", tax: 0 },
                { id: 3, name: "Speed Auto Systems (UAE)", currency: "USD", tax: 0 },
                { id: 4, name: "Speed Auto Systems (UK)", currency: "GBP", tax: 0 },
            ];
            vm.voucherStatus = [
                { id: 1, name: "Open" },
                { id: 2, name: "Closed" }
            ];
            vm.logoId = 0;
            vm.logo = null;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.changeLogo = function () {
                if (vm.data.businessDivision != null) {
                    if (vm.data.businessDivision.code == "KZN") {
                        vm.logo = "/App/host/views/customization/headerLogos/KarzansoftUAE.png";
                    }
                    else if (vm.data.businessDivision.code == "D1R" || vm.data.businessDivision.code == "D1C") {

                        vm.logo = "/App/host/views/customization/headerLogos/SpeedAutoSystems.jpg";

                    }
                    else if (vm.data.businessDivision.code == "D3R") {
                        vm.logo = "/App/host/views/customization/headerLogos/speedautosystems.png";

                    }
                    else if (vm.data.businessDivision.code == "D2C" || vm.data.businessDivision.code == "D2R" || vm.data.businessDivision.code == "D2A") {
                        vm.logo = "/App/host/views/customization/headerLogos/Speed-Header-uk.jpg";

                    }
                }



            };

            vm.getReceiptById = function () {
                debugger
                if (vm.receiptId > 0) {
                    vm.loading = true;
                    customerCareTenantService.getReceiptForPrint({ Id: vm.receiptId }).success(function (result) {
                        debugger
                        vm.data = result;
                        vm.changeLogo();
                        vm.data.amountInWords = utilities.toWords(vm.data.totalAmount, vm.data.currency.name, vm.data.currency.decimalName);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };

            vm.getStatusName = function (id) {
                if (id == 1) {
                    return "Open";
                }
                else if (id == 2) {
                    return "Closed";
                }
            }

            function init() {
                vm.getReceiptById();
            }
            init();
        }
    ]);
