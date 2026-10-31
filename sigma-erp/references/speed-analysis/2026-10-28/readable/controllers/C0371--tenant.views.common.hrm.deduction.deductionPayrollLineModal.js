// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:95957-96107
appModule.controller('tenant.views.common.hrm.deduction.deductionPayrollLineModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.deduction', 'deductionId',
        function ($scope, $uibModal, $uibModalInstance, directoryService, deductionService, deductionId) {

            var vm = this;

            vm.deductionId = deductionId;

            vm.voucherNo = null;
            vm.amount = null;
            vm.voucherDate = null;

            vm.voucherFound = false;

            vm.isSearching = false;
            vm.isSaving = false;


            // ---------------------------------------------------------
            // Search Receipt Voucher
            // ---------------------------------------------------------

            vm.searchReceiptVoucher = function () {

                if (!vm.voucherNo ||
                    vm.voucherNo.trim() === '') {

                    abp.message.warn("PleaseEnterReceiptVoucherNo");

                    return;
                }

                vm.isSearching = true;

                vm.voucherFound = false;
                vm.amount = null;
                vm.voucherDate = null;

                deductionService.getReceiptVoucherForDeduction({
                    receiptVoucherNo: vm.voucherNo.trim(),
                    deductionId: vm.deductionId
                }).then(function (result) {

                    if (result.data) {

                        vm.voucherFound = true;
                        vm.voucherNo = result.data.voucherNo;
                        vm.amount = result.data.amount;
                        vm.voucherDate = result.data.voucherDate;
                        vm.voucherId = result.data.voucherId;

                    }
                    else {

                        abp.message.warn("ReceiptVoucherNotFound");

                    }

                }).finally(function () {

                    vm.isSearching = false;

                });
            };


            // ---------------------------------------------------------
            // Enter key
            // ---------------------------------------------------------

            vm.onVoucherKeyPress = function (event) {

                if (event.which === 13) {

                    event.preventDefault();

                    vm.searchReceiptVoucher();
                }
            };

            vm.getlocalDate = function (date) {
                if (date) {
                    return moment(date).format("YYYY-MM-DD");
                }
                return "";
            };
            // ---------------------------------------------------------
            // OK
            // ---------------------------------------------------------

            vm.save = function () {

                if (!vm.voucherFound) {

                    abp.message.warn(
                        vm.l("PleaseSearchReceiptVoucher")
                    );

                    return;
                }

                vm.isSaving = true;

                deductionService.addCashDeductionPayrollLine({

                    deductionId: vm.deductionId,
                    receiptVoucherNo: vm.voucherNo,
                    amount: vm.amount,
                    voucherId: vm.voucherId

                }).then(function (result) {

                    abp.notify.success("CashEMIAddedSuccessfully");

                    /*
                     * Backend has now:
                     *
                     * 1. Validated receipt voucher
                     * 2. Found current payroll
                     * 3. Created PayrollLine
                     * 4. Updated deduction information
                     *
                     * Close modal and return updated data.
                     */

                    $uibModalInstance.close(
                        result.data
                    );

                }).finally(function () {

                    vm.isSaving = false;

                });
            };


            // ---------------------------------------------------------
            // Cancel
            // ---------------------------------------------------------

            vm.cancel = function () {

                $uibModalInstance.dismiss(
                    'cancel'
                );
            };

        }
    ]
    );
