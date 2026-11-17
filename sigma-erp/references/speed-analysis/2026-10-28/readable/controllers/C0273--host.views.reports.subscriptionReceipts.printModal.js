// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:80458-80542
appModule.controller('host.views.reports.subscriptionReceipts.printModal', [
        '$scope', 'utilities','receiptId', '$uibModalInstance', 'abp.services.app.subscriptionInvoices',
        function ($scope, utilities, receiptId, $uibModalInstance, subscriptionInvoicesAppService) {

            var vm = this;
            vm.loading = false;
            vm.receiptId = receiptId;
            vm.logos = [{ id: 1, name: 'Speed Auto Systems' }, { id: 2, name: 'karzansoft' }];
            vm.currencies = [
                { id: 1, name: "USD"},
                { id: 2, name: "AED"},
                { id: 3, name: "GBP"},
                { id: 4, name: "SAR"}
            ];

            vm.dateNow = new Date();
            vm.businessName = [
                { id: 1, name: "Karzansoft (UAE)", currency: "AED"},
                { id: 2, name: "Speed Auto Systems ", currency: "AED"},
                { id: 3, name: "Speed Auto Systems (UAE)", currency: "USD"},
                { id: 4, name: "Speed Auto Systems (UK)", currency: "GBP"},
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
                    else if (vm.data.businessDivision.code == "D1R" || vm.data.businessDivision.code == "D1C" || vm.data.businessDivision.code == "D1S" || vm.data.businessDivision.code == "D1M") {

                        vm.logo = "/App/host/views/customization/headerLogos/SpeedAutoSystems.jpg";

                    }
                    else if (vm.data.businessDivision.code == "D3R" || vm.data.businessDivision.code == "D3C" || vm.data.businessDivision.code == "D3S" || vm.data.businessDivision.code == "D3M") {
                        vm.logo = "/App/host/views/customization/headerLogos/speedautosystems.png";

                    }
                    else if (vm.data.businessDivision.code == "D2C" || vm.data.businessDivision.code == "D2R" || vm.data.businessDivision.code == "D2A" || vm.data.businessDivision.code == "D2S" || vm.data.businessDivision.code == "D2M") {
                        vm.logo = "/App/host/views/customization/headerLogos/Speed-Header-uk.jpg";

                    }
                }


            };

            vm.getReceiptById = function () {
                if (vm.receiptId > 0) {
                    vm.loading = true;
                    subscriptionInvoicesAppService.getReceiptForPrint(vm.receiptId).success(function (result) {
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
