// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:325722-325867
appModule.controller('tenant.views.crs.vouchers.bills.installmentBreakdownModal', ['$uibModalInstance', 'options', 'abp.services.app.allocation', 'utilities',
        function ($uibModalInstance,options, allocationService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);

            vm.bill = options.bill;
            vm.installment = options.installment;
            vm.rate = options.rate;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.localize = function (key) {
                return app.localize(key);
            };

            vm.round = function (value) {
                return utilities.round(value, 2);
            };

            vm.sumAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });

                return vm.rounding(amount);
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.interestChanged = function (installment) {
                installment.principal = installment.amount - installment.interest;
                adjustLastInstallment();
            };

            vm.emiChanged = function (emi, index) {
               
                    var currentRow = vm.installment.assetInstallments[index];

                    currentRow.principal = vm.round((currentRow.amount * 100) / (100 + vm.rate / 1));
                    currentRow.interest = vm.round(currentRow.amount - currentRow.principal);
                    
            };

            function adjustLastInstallment() {

                var length = vm.installment.assetInstallments.length - 2;
                var sumOfprincipalAmountExceptLast = vm.installment.assetInstallments
                    .filter((e, i) => i <= length)
                    .map(e => e.principal)
                    .reduce((acc, curr) => acc + curr, 0);


                var lastInstallment = vm.installment.assetInstallments[vm.installment.assetInstallments.length - 1];

                var principalAmount = vm.installment.amount - sumOfprincipalAmountExceptLast;
                var interest = principalAmount * (vm.rate / 100);
                var totalAmount = principalAmount + interest;

                lastInstallment.amount = vm.round(totalAmount);
                lastInstallment.principal = vm.round(principalAmount);
                lastInstallment.interest = vm.round(interest);
            }

            vm.save = function () {

                var anyNegativeDueAmount = utilities.checkNegativeDueAmounts(vm.allocationData.allocations);
                if (anyNegativeDueAmount) {
                    abp.message.info("One or more due Amounts contain less than zero amount");
                    return;
                }

                vm.saving = true;

                var allocations = [];
                angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                    allocations.push({
                        id: allocation.allocationId,
                        allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                        allocatedToVoucherLineId: allocation.voucherLineId,
                        amount: allocation.allocatedNow
                    });
                });

                allocationService.saveAllocations({ allocations: allocations })
                    .success(function (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            function init() {
                vm.loading = true;

                if (vm.installment.assetInstallments && vm.installment.assetInstallments.length > 0) {
                    
                    vm.bill.voucherLines.forEach(line => {
                        var currentInstallment = vm.installment.assetInstallments.find(e => e.assetLineId == line.id);
                        //var obj = {
                        //    assetType: line.assetType.name,
                        //    description: line.description,
                        //    principal: eachRowAmount - eachRowInterest,
                        //    amount: eachRowAmount,
                        //    interest: eachRowInterest,
                        //    //assetLineId: line.id
                        //};
                        if (currentInstallment) {
                            currentInstallment.assetType = line.assetType.name;
                            currentInstallment.description = line.description;
                        }
                        //vm.installment.assetInstallments.push(obj);
                    });
                }
                vm.loading = false;

            }

            init();
        }]);
