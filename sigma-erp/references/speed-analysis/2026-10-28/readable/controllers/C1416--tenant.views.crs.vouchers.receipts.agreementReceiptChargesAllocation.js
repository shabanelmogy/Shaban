// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:384988-385062
appModule.controller('tenant.views.crs.vouchers.receipts.agreementReceiptChargesAllocation', ['$uibModalInstance', 'abp.services.app.receiptChargesAllocation', 'receiptId', 'receiptAmount',
        function ( $uibModalInstance, receiptChargesAllocationService, receiptId, receiptAmount) {

            var vm = this;
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.allocationData = null;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.localize = function (key) {
                return app.localize(key);
            };

            vm.total = 0;
            vm.sumAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData, function (value, key) {
                    if (value.amount > 0)
                        amount = amount + value.amount;
                });

                vm.receiptAmount = receiptAmount
                vm.total = amount;
                vm.remaining = receiptAmount - amount;

                return amount;
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };

            vm.save = function () {
                vm.saving = true;

                receiptChargesAllocationService.createOrUpdateReceiptChargesAllocationsOnAgreement({ receiptId: receiptId, receiptChargesAllocations: vm.allocationData })
                    .success(function (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            function init() {
                vm.loading = true;
                receiptChargesAllocationService.getReceiptChargesAllocationsForAgreementEdit({ voucherId: receiptId }).success(
                    function (data) {
                        vm.allocationData = data.allocations.items;
                        vm.agreementNo = data.agreementNo;
                        vm.loading = false;
                    });
                vm.sumAmount();
            }

            init();
        }]);
