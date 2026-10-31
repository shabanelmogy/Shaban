// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170352-170474
appModule.controller('tenant.views.crs.billing.invoicePrintTemplate', [
        '$scope', '$uibModal', 'utilities', 'filters', '$uibModalInstance', 'abp.services.app.billing', 'abp.services.app.customerCareTenant',
        function ($scope, $uibModal, utilities, filters, $uibModalInstance, billingService, customerCareTenantService) {

            var vm = this;
            vm.loading = false;
            vm.subscriptionInvoiceId = filters;
            vm.dateNow = new Date();
            vm.logos = [{ id: 1, name: 'Speed Auto Systems' }, { id: 2, name: 'karzansoft' }];
            vm.currencies = [
                { id: 1, name: "USD", rate: 1 },
                { id: 2, name: "AED", rate: 3.67 },
                { id: 3, name: "GBP", rate: 0.84 },
                { id: 4, name: "SAR", rate: 3.75 }
            ];

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
                /* if (vm.logoId>0)
                 {
                     if (vm.logoId == 1) {
                         vm.logo = "/App/host/views/customization/headerLogos/speedautosystems.png";
                     }
                     else
                     {
                         if (vm.logoId == 2) {
                             vm.logo = "/App/host/views/customization/headerLogos/Karzansoft4.png";
                         }
                     }
                 }*/
                //vm.logoId = vm.businessName.find(obj => obj.name === vm.data.subscription.business).id;
                if (vm.data.businessDivision != null) {
                    if (vm.data.businessDivision.code == "KZN") {
                        vm.logo = "/App/host/views/customization/headerLogos/KarzansoftUAE.png";
                    }
                    else if (vm.data.businessDivision.code == "D1R" || vm.data.businessDivision.code == "D1C" || vm.data.businessDivision.code == "D1M" || vm.data.businessDivision.code == "D1S") {

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

            vm.getSubscriptionInvoiceById = function () {
                if (vm.subscriptionInvoiceId > 0) {
                    vm.loading = true;
                    customerCareTenantService.getInvoiceById(vm.subscriptionInvoiceId).success(function (result) {
                        vm.data = result;
                        vm.changeLogo();
                        vm.data.amountInWords = utilities.toWords(vm.data.totalAmount, vm.data.currency.name, vm.data.currency.decimalName);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };
            vm.redirectToCheckout = function () {
                
                let url = `/StripePayment/CheckoutSession?id=${vm.data.id}`;

                // Redirect to the constructed URL
                window.location.href = url;
            };

            vm.paymentModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/billing/invoicePaymentModal.cshtml',
                    controller: 'tenant.views.crs.billing.invoicePaymentModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        invoice: function () {
                            return vm.data;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    $uibModalInstance.close();
                });
                
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
                vm.getSubscriptionInvoiceById();
            }
            init();
        }
    ]);
