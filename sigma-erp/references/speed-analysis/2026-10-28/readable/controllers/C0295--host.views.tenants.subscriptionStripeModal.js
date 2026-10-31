// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:84120-84309
appModule.controller('host.views.tenants.subscriptionStripeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.hostStripe', 'tenant',
        function ($scope, $uibModalInstance, hostStripeAppService, tenant) {
            var vm = this;
            vm.tenant = tenant;
            vm.products = {};
            vm.plans = [];
            vm.loading = false;
            vm.saving = false;
            vm.trailDays = 10;
            vm.newSubscription = [
                { product: null, plan: null }
            ];
            vm.createNewSubscription = false;
            vm.showOldSubscription = false;

         
            


            vm.getStripeProductPlans = function (selectedProduct) {
                if (selectedProduct) {
                    vm.loading = true;
                    hostStripeAppService.getProductStripePlans(selectedProduct.product.id)
                        .success(function (result) {
                            selectedProduct.plans = result.data;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
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

            vm.calculateTotalPrice = function (perUnitAmount, quantity) {
                return perUnitAmount / 100 * quantity;
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.addRow = function () {
                vm.newSubscription.push({ product: {}, plan: {} });
            };

            vm.removeRow = function (obj) {
                var index = vm.newSubscription.indexOf(obj);
                vm.newSubscription.splice(index, 1);
            };

            function validateSubscription(newSubscription) {
                debugger
                var products = [];
                var plans = [];
                angular.forEach(newSubscription, function (item) { products.push(item.product); plans.push(item.plan); });

                //is same product found
                var sameProductFound = false;
                for (var x = 0; x < products.length; x++) {
                    var productIndex = x;
                    for (var y = productIndex + 1; y < products.length; y++) {
                        if (products[productIndex].id === products[y].id) {
                            sameProductFound = true;
                            break;
                        }
                    }
                }
                if (sameProductFound === true) {
                    abp.message.error("Same product is used more than once.");
                    return false;
                }

                //has plan same currency
                var dontHasSameCurrency = false;
                for (var i = 0; i < plans.length; i++) {
                    var planIndex = i;
                    for (var j = planIndex + 1; j < plans.length; j++) {
                        if (plans[planIndex].currency !== plans[j].currency) {
                            dontHasSameCurrency = true;
                            break;
                        }
                    }
                }
                if (dontHasSameCurrency === true) {
                    abp.message.error("Plans must have same currency.");
                    return false;
                }

                // is invervals dont match
                var intervalDontMatch = false;
                for (var a = 0; a < plans.length; a++) {
                    var intervalIndex = a;
                    for (var b = intervalIndex + 1; b < plans.length; b++) {
                        if (plans[intervalIndex].interval !== plans[b].interval) {
                            intervalDontMatch = true;
                            break;
                        }
                    }
                }
                if (intervalDontMatch === true) {
                    abp.message.error("Products must have same intervals.");
                    return false;
                }

                return true;
            }

            vm.save = function () {
                if (validateSubscription(vm.newSubscription) === true) {
                    debugger
                    var input = {
                        tenantId: vm.tenant.id,
                        planDetails: [],
                        trailDays: vm.trailDays
                    };

                    for (var i = 0; i < vm.newSubscription.length; i++) {
                        var planDetail = { id: vm.newSubscription[i].plan.id, quantity: vm.newSubscription[i].plan.quantity };
                        input.planDetails.push(planDetail);
                    }

                    vm.saving = true;
                    hostStripeAppService.subscribeCustomer(input)
                        .success(function (result) {

                            if (result) {
                                abp.notify.info('Subscription created');
                            } else {
                                abp.notify.error('Failed to create Subscription');
                            }

                        }).finally(function () {
                            vm.saving = false;
                            $uibModalInstance.close();
                        });
                }
            };

            function getStrpeProducts() {
                vm.loading = true;
                hostStripeAppService.getStripeProducts()
                    .success(function (result) {
                        vm.createNewSubscription = true;
                        vm.products = result.data;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            function getStripeCustomer() {
                vm.loading = true;
                hostStripeAppService.getStripeCustomer(vm.tenant.id)
                    .success(function (result) {
                        debugger;
                        if (result) {
                            vm.customer = result;
                            if (vm.customer.subscriptions.total_count > 0) {
                                vm.showOldSubscription = true;
                                vm.loading = false;
                            } else {
                                getStrpeProducts();
                            }

                        } else {
                            getStrpeProducts();
                        }

                    }).error(function () {
                        vm.loading = false;
                    });
            }

            function init() {
                getStripeCustomer();
            }

            init();
        }
    ]);
