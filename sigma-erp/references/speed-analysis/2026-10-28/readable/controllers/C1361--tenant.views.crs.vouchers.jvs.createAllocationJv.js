// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:366339-366465
appModule.controller('tenant.views.crs.vouchers.jvs.createAllocationJv', ['$uibModalInstance', '$uibModal',  'options', 'abp.services.app.allocation', 'utilities',
        function ($uibModalInstance,$uibModal,options, allocationService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);
            vm.allocationData = null;
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.tds = options.tds;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.localize = function (key) {
                return app.localize(key);
            };

            vm.rounding = function (value) {
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


            vm.insertDueAmountOnClick = function (allocation) {
                if (parseFloat(allocation.allocatedNow) == 0) {
                    allocation.allocatedNow = vm.rounding(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNow);
                }
            };

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
                        openAllocateJvModal(options.JVId);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };
            openAllocateJvModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/allocateJvModalForSelect.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.allocateJvModalForSelect as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        }
                    }
                });

            }
            function init() {
                vm.loading = true;
                allocationService.getAllocationsForEdit({ voucherId: options.voucherId, allocatingVoucherLineId: options.allocatingVoucherLineId }).success(
                    function (data) {
                        vm.allocationData = data;
                        var allocations = [];

                        if (options.voucherSubTypeId == 35) // show only asset type sale invoices if asset sale type receipt is selected
                        {
                            angular.forEach(data.allocations, function (item) {
                                if (item.voucherSubTypeId == 17) {
                                    allocations.push(item);
                                }
                            });
                            vm.allocationData.allocations = allocations;
                        }
                        else
                            vm.allocationData = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }]);
