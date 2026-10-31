// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:185539-185767
appModule.controller('tenant.views.crs.coupons.allocationForCoupon', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.allocation', 'abp.services.app.coupon',
        function ($scope, $uibModal, $uibModalInstance, directoryService, billingMethodService, utilities, commonLookupService, appSession, allocationService, couponService) {

            var vm = this;
            var depositId = 0;
            vm.saving = false;
            vm.couponsData = [];
            vm.coupons = [];
            vm.allocationForCouponRedeem = {};
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.manualReceiptNo = utilities.parseBoolean(abp.setting.get("App.General.ManualReceiptNo"));
            vm.allocationForDepositPostAllocation = utilities.parseBoolean(abp.setting.get("App.General.ReceiptPostAllocation"));
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.allocationData = null;
            vm.amountChanged = function () {
                if (vm.allocationForCouponRedeem.amount == 0 || angular.isUndefined(vm.allocationForCouponRedeem.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.allocationForCouponRedeem.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.allocationForCouponRedeem.amountInWords = utilities.toWords(vm.amount);

            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.searchCustomers = function ($select) {
                //any contact (staff, customer, supplier)
                return directoryService.search({ keyword: $select.search }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };



            vm.onCustomerSelect = function (customer) {

                vm.allocationForCouponRedeem.customerId = customer.id;
                vm.allocationForCouponRedeem.customer = customer;

                getCouponsData();
                getAllocatedToDeposit();
            };

            vm.sumAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                vm.amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        vm.amount = vm.amount + value.allocatedNow;
                });

                return vm.rounding(vm.amount);
            };
            vm.sumCouponsAmount = function () {
                if (vm.couponsData == null)
                    return 0;

                if (vm.couponsData.length == 0)
                    return 0;

                vm.couponsAmount = 0;
                angular.forEach(vm.couponsData, function (value, key) {
                    if (value.redeemNow > 0)
                        vm.couponsAmount = vm.couponsAmount + value.redeemNow;
                });

                return vm.rounding(vm.couponsAmount);
            };

            function getCouponsData() {
                vm.couponsData = [];
                couponService.getCouponsByCustomerId({
                    id: vm.allocationForCouponRedeem.customerId
                }).success(
                    function (data) {
                        // vm.couponsData = data;
                        vm.allocationForCouponRedeem.agreement = data[0].agreement;
                        vm.allocationForCouponRedeem.agreementId = data[0].agreementId;
                        angular.forEach(data, function (value, key) {
                            if (value) {
                                vm.coupon = value;
                                vm.coupon.redeemAmount = value.alreadyRedeemed;
                                vm.coupon.dueToRedeem = 0;
                                vm.coupon.redeemNowChecked = false;
                                vm.couponsData.push(vm.coupon)
                            }
                        });
                    });
            }

            vm.redeemNowChanged = function (row) {
                if (!row.redeemNowChecked)
                    row.redeemNow = 0;
            }
            //all contacts customers, suppliers, staff
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return null;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {

                        vm.onCustomerSelect(result);
                    }
                });
            };
            vm.searchContacts = function ($select) {
                return directoryService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };
            vm.customerChanged = function () {
                vm.allocationForCouponRedeem.customerId = vm.allocationForCouponRedeem.customer.id
                getCouponsData();
                getAllocatedToDeposit();
            }

            function getSettledAmount() {
                vm.loading = true;

                depositService.getAllocatedAmountOnDeposit(depositId)
                    .success(function (result) {
                        vm.previousSettledAmount = result;
                        vm.totalAmount = vm.allocationForCouponRedeem.amount;
                        vm.availableAmount = vm.rounding(vm.allocationForCouponRedeem.amount - vm.previousSettledAmount);
                        vm.allocationForCouponRedeem.amount = vm.availableAmount;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            function init() {
            }
            vm.save = function () {
                debugger;

                if (vm.couponsData.some(e => (e.alreadyRedeemed + e.redeemNow) > e.amount)) {
                    abp.message.info("Redeem Now value should be less than or equal to Amount");
                    return;
                }
                vm.saving = true;
                vm.loading = true;
                vm.coupons = {
                    customer: vm.allocationForCouponRedeem.customer,
                    redeemVouchers: vm.couponsData.filter(x => x.redeemNowChecked).map(e => {
                        return {
                            couponId: e.id,
                            amount: e.redeemNow
                        }
                    })
                }

                var invoicesToBeAllocated = vm.allocationData.allocations.filter(e => e.allocatedNow > 0);
                couponService.allocateInvoicesToCouponRedeemedInvoice({ allocations: invoicesToBeAllocated, allocatingVoucherAmount: vm.amount, coupons: vm.coupons })
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                        vm.loading = false;
                    });
            };
            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            };
            function getAllocatedToDeposit() {
                vm.allocationData = null;
                allocationService.getAllocationsForEdit({ contactId: vm.allocationForCouponRedeem.customerId, voucherCategory: 'Creditor' }).success(
                    function (data) {
                        vm.allocationData = data;
                    });
            }
            function initializeFilters() {
                //getBillingMethods();
                //getLocations();
                //getBankAccounts();
            }

            init();
            initializeFilters();
        }
    ]);
