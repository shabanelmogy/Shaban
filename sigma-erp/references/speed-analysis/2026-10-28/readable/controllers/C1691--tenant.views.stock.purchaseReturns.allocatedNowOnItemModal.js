// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:466486-466545
appModule.controller('tenant.views.stock.purchaseReturns.allocatedNowOnItemModal',
        ['$uibModalInstance', 'abp.services.app.purchaseReturn', 'allocation', 'purchaseReturnId', 'utilities',
            function ($uibModalInstance, purchaseReturnService, allocation, purchaseReturnId, utilities) {
                var vm = this;
                vm.allocation = allocation;
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                vm.voucherSubTypeId = null;

                vm.saveAllocateCharges = function () {

                    if (vm.allocation.manuallyAllocatedCharges && vm.allocation.manuallyAllocatedCharges
                        .some(e => e.returnNow > (e.qunatity - e.alreadyReturned)))
                        abp.message.info("Return Quantity Can not be greater than actual Quantity");
                    else
                        $uibModalInstance.close(vm.allocation.manuallyAllocatedCharges);
                };
                vm.rounding = function (value) {
                    return utilities.round(parseFloat(value), 2);
                };
                vm.changeAllocateAmount = function (row) {
                    if (row.allocateAmount == null || row.allocateAmount == "") {
                        row.allocateAmount = 0.0;
                    }
                    row.debitTax = vm.rounding(row.originalTaxPercentage / 100 * row.allocateAmount);
                    row.allocateAmountWithTax = vm.rounding(row.originalTaxPercentage / 100 * row.allocateAmount) + vm.rounding(row.allocateAmount);
                    vm.sumAllocateAmountWithTax = 0.0;
                    vm.sumAllocateAmountTax = 0.0;
                    vm.sumAllocateAmountWithoutTax = 0.0;
                    angular.forEach(vm.allocation.manuallyAllocatedCharges, function (value, key) {
                        vm.sumAllocateAmountWithTax += value.allocateAmountWithTax;
                        vm.sumAllocateAmountTax += value.debitTax;
                        vm.sumAllocateAmountWithoutTax += value.allocateAmount;
                    });
                }
                var init = function () {
                    vm.loading = true;
                    purchaseReturnService.getItemAllocations({
                        allocatedToVoucherId: vm.allocation.voucherId,
                        purchaseReturnId: purchaseReturnId
                    }).success(function (data) {
                        vm.allocation.manuallyAllocatedCharges = data.items;
                        vm.voucherSubTypeId = vm.allocation.manuallyAllocatedCharges[0].voucherSubTypeId;
                        angular.forEach(vm.allocation.manuallyAllocatedCharges, function (value, key) {
                            vm.changeAllocateAmount(value);
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                if (vm.allocation.manuallyAllocatedCharges == null) {
                    init();
                } else {
                    angular.forEach(vm.allocation.manuallyAllocatedCharges, function (value, key) {
                        vm.changeAllocateAmount(value);
                    });
                }
            }]);
