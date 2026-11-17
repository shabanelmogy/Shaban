// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:83756-84117
appModule.controller('host.views.tenants.subscriptionModal', [
        '$scope', 'utilities', '$uibModalInstance', 'abp.services.app.subscription', 'abp.services.app.packages', 'abp.services.app.hostProduct', 'abp.services.app.productVariant', 'abp.services.app.currency', 'tenant', 'subscriptionId', 'abp.services.app.businessDivision',
        function ($scope, utilities, $uibModalInstance, subscriptionService, packagesAppService, productService, productVariantService, currencyService, tenant, subscriptionId, businessDivisionService) {
            var vm = this;
            vm.seletedProductId;
            vm.seletedVariantId;
            vm.tenant = tenant;
            vm.currency;
            vm.products = [];
            vm.totalOTC = 0;
            vm.totalSubscriptionCharges = 0;
            vm.subscription = {
                tenantId: vm.tenant.id,
                type: 2,
                autoRenewal: false,
                subscriptionPackages:[]
            };


            vm.getCharges = function () {
                vm.totalOTC = 0;
                vm.totalSubscriptionCharges = 0;
                vm.subscription.subscriptionPackages.forEach(x => {
                    vm.totalOTC += x.oneTimeCharges;
                    vm.totalSubscriptionCharges += x.subscriptionCharges;
                });
                vm.subscription.amount = vm.totalSubscriptionCharges;
                vm.subscription.SetupCharges = vm.totalOTC;
            }
            vm.businessName = utilities.divisionName();
            //vm.businessName = [
            //    { id: 1, name: "Karzansoft (UAE)", currency: "AED", tax: 5 },
            //    { id: 3, name: "D1 (UAE)", currency: "AED", tax: 5 },
            //    { id: 4, name: "D2 (UK)", currency: "GBP", tax: 0 },
            //    { id: 2, name: "D3 (USA)", currency: "USD", tax: 0 }
            //];

            vm.billingStatuses = [
                { id: 1, name: "On" },
                { id: 2, name: "Off" },
                { id: 3, name: "Paused" },
                { id: 4, name: "Canceled"}
            ];

            
            vm.getBusinessName = function (id) {
                if (id == 1) {
                    return "Karzan Soft";
                }
                else if (id == 3) {
                    return "Speed Auto System";
                }
                else if (id == 2) {
                    return "Speed Auto Systems (UAE)";
                }
                else if (id == 4) {
                    return "Speed Auto Systems (UK)";
                }
            }
            vm.subscriptionValueTypesName = [
                { id: 1, name: "Fixed" },
                { id: 2, name: "Variable" },

            ];
            vm.getsubscriptionValueTypesName = function (id) {
                if (id == 1) {
                    return "Fixed";
                }
                else if (id == 2) {
                    return "Variable";
                }

            }
            vm.calculateAmountVat = function () {
                debugger
                if (vm.subscription.amount !== "" && vm.subscription.vatPercent !== "" && vm.subscription.amount !== undefined && vm.subscription.vatPercent !== undefined) {
                    var amount = parseFloat(vm.subscription.amount);
                    var vatPercent = parseFloat(vm.subscription.vatPercent);
                    vm.subscription.amountVat = amount + (amount * vatPercent / 100);
                } else {
                    vm.subscription.amountVat = 0;
                }
            };
            vm.paymentMethodName = [
                { id: 1, name: "Cash" },
                { id: 2, name: "DirectDebit" },
                { id: 3, name: "Cheque" },
                { id: 4, name: "CreditCard" },
                { id: 5, name: "GoCardless" },
                { id: 6, name: "Stripe" },
                { id: 7, name: "PayPal" },

            ];
            vm.getpaymentMethodName = function (id) {
                if (id == 1) {
                    return "Cash";
                }
                else if (id == 2) {
                    return "DirectDebit";
                }
                else if (id == 3) {
                    return "Cheque";
                }
                else if (id == 4) {
                    return "CreditCard";
                }
                else if (id == 5) {
                    return "GoCardless";
                }
                else if (id == 6) {
                    return "Stripe";
                }
                else if (id == 7) {
                    return "PayPal";
                }

            }
            vm.subscriptionTypes = [
                { id: 2, name: "Monthly" },
                { id: 1, name: "Yearly" },
                { id: 3, name: "Quarterly" },
                //{ id: 4, name: "6 Monthly" }
            ];
            vm.getSubscriptionTypeName = function (type) {
                if (type == 1) {
                    return "Yearly";
                }
                else if (type == 2) {
                    return "Monthly";
                }
                else if (type == 3) {
                    return "Quarterly";
                }
               /* else if (type == 4) {
                    return "6 Monthly";
                }*/
            }
            vm.businessCurrency = '';
            vm.businessNameChagned = function () {
                if (!vm.currency.id) {
                    vm.businessCurrency = "";
                }
                else {

                vm.businessCurrency = vm.currencies.find(x => x.id == vm.currency.id).code;
                }
            };
            vm.save = function () {
                vm.saving = true;
                var selectedCurrencyId = vm.currency.id;
                vm.subscription.currencyId = selectedCurrencyId;
                var selectedCurrency = vm.currencies.find(function (currency) {
                    return currency.id === selectedCurrencyId;
                });
                if (selectedCurrency) {
                    vm.package.code = selectedCurrency.code;
                }
                if (vm.subscription.autoRenewal == null) {
                    vm.subscription.autoRenewal = false
                }
                vm.subscription.packageId = vm.package.packageId;
               
                subscriptionService.saveSubscription({ subscription: vm.subscription })
                    .success(function (result) {
                        abp.notify.info('Subscription Saved');
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDateTime = function (date) {

                if (date) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };
            vm.getProducts = function () {
                productService.getProducts({}).success(function (data) {
                    //console.log(data);
                    //vm.products = [];
                    vm.products = data.items;
                    vm.loading = false;
                });
            };
            vm.filterProductId = function (productId) {
                vm.seletedProductId = productId;
                vm.loading = true;
                productVariantService.getProductVariants({ id: productId }).success(function (result) {
                    vm.productVariants = [];
                    vm.productVariants = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.removePackageRow = function (row) {
                var index = vm.subscription.subscriptionPackages.indexOf(row);
                vm.subscription.subscriptionPackages.splice(index, 1);
                vm.getCharges();
            };

            vm.addPackageRow = function () {
                vm.subscription.subscriptionPackages.push(
                    {
                        oneTimeCharges: 0,
                        subscriptionCharges: 0,
                        packageId: null,
                        package: { productId: 0, variantId:0}
                    });
                vm.getCharges();
            };
            vm.adjustCharges = function (row) {
                var package = row.packages.filter(obj => obj.id === row.packageId)[0];
                row.oneTimeCharges = package.oneTimeCharges;
                if (vm.subscription.type == 1) {
                row.subscriptionCharges = package.rate*12;

                }
                else if (vm.subscription.type == 2) {
                row.subscriptionCharges = package.rate;

                }
                else if (vm.subscription.type == 3) {

                row.subscriptionCharges = package.rate*3;
                }
                else if (vm.subscription.type == 4) {
                row.subscriptionCharges = package.rate*6;

                }
                vm.getCharges();
                vm.calculateAmountVat();
            }
            vm.filterRowProductId = function (productId,row) {
                row.seletedProductId = productId;
                vm.loading = true;
                productVariantService.getProductVariants({ id: productId }).success(function (result) {
                    row.productVariants = [];
                    row.productVariants = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.filterRowVariantId = function (variantId,row) {
                row.packages = [];
                row.seletedVariantId = variantId;
                vm.loading = true;
                packagesAppService.getPackages({ ProductId: row.seletedProductId, ProductVariantId: row.seletedVariantId, sorting: "title asc" }).success(function (result) {
                    row.packages = result.items.filter(obj => obj.currencyId === vm.currency.id);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.filterVariantId = function (variantId) {
                console.log(variantId)
                vm.packages = [];
                vm.seletedVariantId = variantId;
                vm.loading = true;
                packagesAppService.getPackages({ ProductId: vm.seletedProductId, ProductVariantId: vm.seletedVariantId, sorting: "title asc" }).success(function (result) {
                    vm.packages = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.filterPackageId = function (packageId) {
                vm.selectedPackage = vm.packages.find(function (package) {
                    return package.id === packageId;
                });
                vm.subscription.amount = vm.selectedPackage.rate
                vm.package.code = vm.selectedPackage.code
                vm.currency = []
                vm.currency = vm.selectedPackage.currency
                vm.currency.id = vm.selectedPackage.currencyId
            }
            vm.getCurrencies = function () {
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getPackages = function () {
                packagesAppService.getPackages().success(function (data) {
                    vm.packages = [];
                    vm.packages = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            //vm.filterCurrency(vm.subscription.business.currency)
            vm.filterCurrency = function (id) {
                var a = vm.businessDivisions.find(x => x.id === id);
                vm.currency.id = a.currencyId;
                //vm.businessNameChagned();
                vm.subscription.vatPercent = a.vatPercentage;
            }

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            

            function init() {
                vm.getProducts();
                vm.getbusinessDivisions();
                //vm.subscription.autoRenewal = false
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
                vm.package = []
                vm.currency = []
                if (subscriptionId != null) {

                    vm.loading = true;
                    subscriptionService.getSubscriptionForEdit({ id: subscriptionId, tenantId: vm.tenant.id })
                        .success(function (result) {
                            vm.isEditMod = true;

                            if (!result || result == null) {
                                vm.subscription = {
                                    tenantId: vm.tenant.id,
                                    type: 1,
                                    autoRenewal: false
                                };
                            }
                            else {
                                vm.subscription = result;
                                vm.currency.id = vm.subscription.currencyId;
                                vm.businessNameChagned();
                                if (vm.subscription.package != null) {
                                    vm.productVariants = [vm.subscription.package.productVariant]
                                    vm.packages = [vm.subscription.package]
                                    vm.package.productId = vm.subscription.package.product.id
                                    vm.package.variantId = vm.subscription.package.productVariant.id
                                    vm.package.packageId = vm.subscription.packageId
                                }
                            }
                            vm.getCharges();
                            vm.calculateAmountVat();
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            }
            init();
        }
    ]);
