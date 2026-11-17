// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85612-85761
appModule.controller('tenant.views.billingMethods.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.billingMethod', 'billingMethodId', 'category', 'abp.services.app.location', 'abp.services.app.commonLookup', 'abp.services.app.currency',
        function ($scope, $uibModalInstance, billingMethodService, billingMethodId, category, locationService, commonLookupService, currencyService) {

            var vm = this;
            vm.saving = false;
            vm.billingMethod = null;
            vm.baseCurrencyId = null;
            vm.isMulticurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.category = category;
            //if (vm.category == 1) {// Receipts
            //    vm.paymentType = [
            //        { id: 1, name: app.localize('Cash') },
            //        { id: 2, name: app.localize('CreditCard') },
            //        { id: 3, name: app.localize('DebitCard') },
            //        { id: 4, name: app.localize('Cheque') },
            //        { id: 5, name: app.localize('BankTransfer') },
            //        { id: 6, name: app.localize('Other') }
            //    ];
            //}
            /*if (vm.category == 2) {//Payments*/
            vm.paymentType = [
                { id: 1, name: app.localize('Cash') },
                { id: 2, name: app.localize('CreditCard') },
                { id: 3, name: app.localize('DebitCard') },
                { id: 4, name: app.localize('Cheque') },
                { id: 5, name: app.localize('BankTransfer') },
                { id: 7, name: app.localize('CardRefund') },
                { id: 6, name: app.localize('Other') }
            ];
            /* }*/

            function getCurrencies() {
                currencyService.getCurrencies().success(function (result) {
                    vm.currencies = result.items;
                    //vm.baseCurrencyId = vm.currencies.filter(p => p.isBase)[0].id;
                    //if (vm.billingMethod.id == 0)
                    //    vm.billingMethod.currencyId = result.items.filter(p => p.isBase)[0].id;
                    //if (vm.billingMethod.id > 0 && !vm.billingMethod.currencyId) {
                    //    vm.billingMethod.currencyId = vm.baseCurrencyId;
                    //}
                }).finally(function () { vm.loading = false; });
            }

            vm.getBillingMethodCategoryForFilter = [
                { id: 1, name: app.localize('Receipts') },
                { id: 2, name: app.localize('Payments') },
                { id: 3, name: app.localize('BothReceiptsAndPayments') },
            ];
            /*   vm.categorySelected = vm.getBillingMethodCategoryForFilter[1];*/

            vm.save = function () {
                debugger;
                vm.saving = true;
                //if (vm.isMulticurrencyEnabled) {
                //    if (vm.billingMethod.currencyId == vm.baseCurrencyId) {
                //        vm.billingMethod.currencyId = null;
                //    }
                //}
                if (vm.billingMethod.category == 3) {
                    vm.billingMethod.category = 0;
                }
                //vm.billingMethod.category = category;
                if (!((vm.billingMethod.category == 1 && vm.billingMethod.type == 2) || (vm.billingMethod.category == 2 && vm.billingMethod.type == 7))) {
                    vm.billingMethod.commissionPercent = 0;
                }

                vm.billingMethod.user = null;
                billingMethodService.createOrUpdateBillingMethod({

                    billingMethod: vm.billingMethod,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;

                commonLookupService.searchUsers({ keyword: $select.search })
                    .success(r => {
                        vm.users = [{ id: -1, name: "Don't Restrict" }, ...r.items];
                    });
            };


            vm.applyCommissionPercentage = function () {
                if ((vm.billingMethod.category == 1 && vm.billingMethod.type == 2) || (vm.billingMethod.category == 2 && vm.billingMethod.type == 7)) {
                    return true;
                }
                return false;
            }
            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.billingMethod.user = result;

                });
            };
            function init() {
                vm.loading = true;
                billingMethodService.getBillingMethodForEdit({
                    id: billingMethodId
                }).success(function (result) {
                    vm.billingMethod = result;
                    if (vm.isMulticurrencyEnabled) {
                        getCurrencies();
                    }
                    if (!vm.billingMethod.id) {
                        vm.billingMethod.isActive = true;
                        vm.billingMethod.category = 3;
                    }
                    if (vm.billingMethod.id > 0) {
                        //vm.billingMethod.isActive = true;
                        if (vm.billingMethod.category == 0) {
                            vm.billingMethod.category = 3;
                        }

                    }
                    if (!vm.billingMethod.locationId) {
                        vm.billingMethod.locationId = -1;
                    }
                    if (vm.billingMethod.userId > 0) {
                        vm.getUserName(vm.billingMethod.userId);
                    }



                    vm.loading = false;
                });


                commonLookupService.getLocations()
                    .success(r => {
                        vm.locations = [{ id: -1, name: "Don't Restrict" }, ...r.items];
                    });
            }

            init();
        }
    ]);
