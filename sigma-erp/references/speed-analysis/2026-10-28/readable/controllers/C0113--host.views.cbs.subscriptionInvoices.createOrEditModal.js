// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:50619-50718
appModule.controller('host.views.cbs.subscriptionInvoices.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.subscriptionInvoices', 'abp.services.app.subscription', 'abp.services.app.currency', 'subscriptionInvoiceId', '$uibModal', '$http',
        function ($scope, $uibModalInstance, subscriptionInvoicesAppService, subscriptionService, currencyService, subscriptionInvoiceId, $uibModal, $http) {
            var vm = this;
            vm.saving = false;
            vm.package;
            vm.contactPersons = [currency = { id: null }];
            vm.currency = {
                id: null
            }
            vm.IsReceivedOptions = [
                { name: "False", id: 0 },
                { name: "True", id: 1 }
            ];
            vm.title = "Create Subscription Invoice";
            //vm.getSubscriptions = function (Id) {
            //    subscriptionService.getSubscriptionForEdit({ id: Id }).success(function (data) {
            //        vm.subscriptions = [data];

            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};
            vm.getCurrencies = function () {
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            //vm.getVariantsByProductId = function (productId) {
            //    console.log(productId)
            //    productVariantService.getProductVariants({ id: productId }).success(function (result) {
            //        vm.productVariants = result;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}
            vm.save = function () {
                vm.saving = true;
                //var selectedCurrencyId = vm.package.currency.id;
                //var selectedCurrency = vm.currencies.find(function (currency) {
                //    return currency.id === selectedCurrencyId;
                //});
                //if (selectedCurrency) {
                //    vm.package.code = selectedCurrency.code;
                //}
                //vm.package.id = subscriptionInvoiceId;
                //vm.package.currencyId = vm.package.currency.id;
                //vm.package.regionId = vm.package.region.id;

                if (subscriptionInvoiceId != null) {
                    subscriptionInvoicesAppService.createOrUpdateSubscriptionInvoices(vm.subscriptionInvoice)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                } else {
                    subscriptionInvoicesAppService.createOrUpdateSubscriptionInvoices(vm.subscriptionInvoice)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                }
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                //vm.getProducts();
                //vm.getRegions();
                
                vm.getCurrencies();
                //vm.getSubscriptions(1);


                if (subscriptionInvoiceId != null) {
                    vm.isEditMod = true;
                    vm.title = "Update SubscriptionInvoice"
                    subscriptionInvoicesAppService.getSubscriptionInvoicesForEdit(subscriptionInvoiceId).then(function (data) {
                        vm.subscriptionInvoice = data.data;
                        vm.IsReceivedOptions = vm.subscriptionInvoice.isReceived
                        //vm.package.productId = vm.package.product.id;
                        //vm.getVariantsByProductId(vm.package.productId)
                        //vm.package.productVariantId = vm.package.productVariant.id;
                    });
                }
                else {
                }
            }

            init();
        }
    ]);
