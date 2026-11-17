// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329763-329818
appModule.controller('tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal',
        ['$uibModalInstance', 'abp.services.app.creditNote', 'allocation', 'creditNoteId', 'utilities',
        function ($uibModalInstance, creditNoteService, allocation, creditNoteId, utilities) {
            var vm = this;
            vm.allocation = allocation;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
            vm.saveAllocateCharges = function () {
                angular.forEach(vm.allocation.manuallyAllocatedCharges, function (value, key) {
                    value.allocateAmount = vm.rounding(value.allocateAmount);
                });

                $uibModalInstance.close(vm.allocation.manuallyAllocatedCharges);
            };
            vm.rounding = function (value) {
                return utilities.round(parseFloat(value), 2);
            };
            vm.changeAllocateAmount = function (row) {
                if (row.allocateAmount == null || row.allocateAmount == "") {
                    row.allocateAmount = 0.0;
                }
                row.creditTax = vm.rounding(row.originalTaxPercentage / 100 * row.allocateAmount);
                row.allocateAmountWithTax = vm.rounding(row.originalTaxPercentage / 100 * row.allocateAmount) + vm.rounding(row.allocateAmount);
                vm.sumAllocateAmountWithTax = 0.0;
                angular.forEach(vm.allocation.manuallyAllocatedCharges, function (value, key) {
                    vm.sumAllocateAmountWithTax += value.allocateAmountWithTax;
                });
            }
            var init = function() {
                vm.saving = true;
                creditNoteService.getChargesTypeAllocations({
                    allocatedToVoucherId: vm.allocation.voucherId,
                    creditNoteId: creditNoteId
                }).success(function (data) {
                    vm.allocation.manuallyAllocatedCharges = data.items;
                    angular.forEach(vm.allocation.manuallyAllocatedCharges, function (value, key) {
                        vm.changeAllocateAmount(value);
                    });
                }).finally(function() {
                    vm.saving = false;
                });
            };
            
            if (vm.allocation.manuallyAllocatedCharges == null) {
                init();
            }
            else {
                vm.sumAllocateAmountWithTax = 0.0;                
                angular.forEach(vm.allocation.manuallyAllocatedCharges, function (value, key) {
                    vm.sumAllocateAmountWithTax += value.allocateAmountWithTax;
                });

            }
        }]);
