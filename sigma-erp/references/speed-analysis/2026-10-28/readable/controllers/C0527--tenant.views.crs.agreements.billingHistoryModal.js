// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:135545-135673
appModule.controller('tenant.views.crs.agreements.billingHistoryModal', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.commonAgreement', 'abp.services.app.receiptSearch', 'abp.services.app.refund', 'abp.services.app.openingBalance', 'agreementId', 'chargesCalculator', 'utilities',
        function ($uibModal, $uibModalInstance, commonAgreementService, receiptSearchService, refundService, openingBalanceService, agreementId, chargesCalculator, utilities) {

            var vm = this;
            vm.loading = false;
            vm.agreement = null;
            vm.totalCharges = 0;
            vm.totalReceived = 0;
            vm.totalRefund = 0;
            var refundLoaded = false;
            var receiptLoaded = false;
            var agreementLoaded = false;
            vm.oneReceiptOnMultipleAgreement = abp.features.isEnabled("CRS.CustomFeatures.OneReceiptOnMultipleAgreement");

            vm.canRefund = abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Addnew');

            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function sumReceivedCharges() {
                if (vm.receipts.length != 0) {
                    angular.forEach(vm.receipts, function (receipt, value) {
                        vm.totalReceived += (receipt.amount - receipt.creditCardCommission);
                    });

                }
            }

            function sumRefundCharges() {
                if (vm.refunds.length != 0) {
                    angular.forEach(vm.refunds, function (refund) {
                        vm.totalRefund += refund.amount;
                    });

                }
            };
            vm.rounding = function (value) {

                return utilities.round(value, 2);
            };
            openCreateOrEditPaymentModal = function (paymentId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPayments();
                });
            }
            vm.addCustomerPayment = function () {
                if (vm.agreement) {
                    vm.agreement.dueAmount = vm.totalCharges - vm.totalReceived + vm.totalRefund;
                }
                openCreateOrEditPaymentModal(null, vm.agreement)
            };
            function init() {
                vm.loading = true;

                commonAgreementService.getAgreement({
                    id: agreementId,
                    includeCharges: true,
                    includeMovements: true,
                    includeCustomer: true,
                    isMobile: false
                }).success(function (result) {
                    vm.agreement = result;
                    agreementLoaded = true;
                    if (vm.agreement.status == 1) //if agreement is open then calculate charges
                    {
                        if (vm.agreement.totalCharges == 0) {
                            vm.agreement.endDate = moment();
                            chargesCalculator.calculate(vm.agreement);
                        }
                    }
                    vm.totalCharges = vm.agreement.totalCharges;

                }).finally(function () {
                    if (agreementLoaded && refundLoaded && receiptLoaded)
                        vm.loading = false;
                });

                receiptSearchService.getReceivedVouchersByAgreementId({
                    id: agreementId
                }).success(function (result) {
                    vm.receipts = result.items;
                    sumReceivedCharges();
                    receiptLoaded = true;
                }).finally(function () {
                    if (agreementLoaded && refundLoaded && receiptLoaded)
                        vm.loading = false;
                });

                refundService.getRefundsByAgreementId({
                    id: agreementId
                }).success(function (result) {
                    vm.refunds = result.items;
                    sumRefundCharges();
                    refundLoaded = true;
                }).finally(function () {
                    if (agreementLoaded && refundLoaded && receiptLoaded)
                        vm.loading = false;
                });

            }

            init();
        }
    ]);
