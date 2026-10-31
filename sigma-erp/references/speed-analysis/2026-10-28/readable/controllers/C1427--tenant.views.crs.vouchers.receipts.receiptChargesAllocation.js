// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:392970-393046
appModule.controller('tenant.views.crs.vouchers.receipts.receiptChargesAllocation', ['$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.receiptChargesAllocation', 'receiptId', 'receiptAmount', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, receiptChargesAllocationService, receiptId, receiptAmount, utilities) {

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
            vm.rounding = function (value) {
                debugger;
                return utilities.round(value, 2);
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
                
                receiptChargesAllocationService.createOrUpdateReceiptChargesAllocations({ receiptId: receiptId, receiptChargesAllocations: vm.allocationData })
                    .success(function (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            function init() {
                receiptChargesAllocationService.getReceiptChargesAllocationsForEdit({ voucherId: receiptId }).success(
                    function (data) {
                        debugger;
                        vm.allocationData = data.items;
                        
                    });
                vm.sumAmount();
            }

            init();
        }]);
