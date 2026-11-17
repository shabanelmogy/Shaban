// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:319775-320026
appModule.controller('tenant.views.crs.vouchers.allocations.createAllocation2', ['$uibModalInstance', 'options', 'abp.services.app.allocation', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.chargesSetting',
        function ($uibModalInstance, options, allocationService, commonLookupService, utilities, chargesSettingService) {

            var vm = this;
            vm.loading = false;
            vm.agreementAllocations = [];
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);
            vm.allocationData = null;
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.oneReceiptOnMultipleAgreement = abp.features.isEnabled("CRS.CustomFeatures.OneReceiptOnMultipleAgreement");
            vm.tds = options.tds;
            vm.agreementId = options.agreementId;
            vm.voucherSubTypeId = options.voucherSubTypeId;
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
            vm.addAgreement = function () {

                var line = new Object();
                line.agreementId = null;
                line.agreement = null;
                line.amount = 0;
                line.receiptId = options.voucherId;

                vm.agreementAllocations.push(line);
            }
            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {
                if ($select.search == '') return;
                vm.agreements = [];
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: options.contactId, agreementCategory: vm.enabledModule === 5 ? 4 : vm.enabledModule }).then(function (response) {
                    angular.forEach(response.data.items, function (subline) {
                        if (vm.agreementAllocations.some(e => e.agreementId == subline.id)) {
                        } else {
                            vm.agreements.push(subline);
                        }
                    });

                });
            };
            
            function getAgreementsAllocations() {

                allocationService.getAgreementsAllocations({voucherId: options.voucherId}).success(
                    function (data) {

                        vm.agreementAllocations = data.agreementAllocations;

                    }).finally(function () {

                    });
            }
            function getChargesTypes() {
                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypesDistinct().success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.addInHeadRow = function (subAllocation, allocation) {
                
                allocation.allocatedNow = 0;
                angular.forEach(allocation.subAllocations, function (value, key) {
                    if (!value.allocatedNow)
                        value.allocatedNow = 0;


                    allocation.allocatedNow = allocation.allocatedNow + value.allocatedNow;
                });




                vm.isAgreementAllocationAmount();
            }
            vm.addChargesType = function (allocation) {
                var line = new Object();
                line.chargesTypeId = null;
                line.amount = 0;
                if (allocation.subAllocations) {
                    allocation.subAllocations.push(line);
                } else {
                    allocation.subAllocations = [];
                    allocation.subAllocations.push(line);
                }

            }
            vm.isAgreementAllocationAmount = function () {
                var agreementTtotal = 0.0;
                vm.isEnableforAgAlo = false;
                angular.forEach(vm.agreementAllocations, function (agreementRow) {
                    agreementRow.allocatedNow = 0;

                    if (agreementRow.amount > 0)
                        agreementTtotal = agreementTtotal + agreementRow.amount;
                    angular.forEach(vm.allocationData.allocations, function (value, key) {

                        if (agreementRow.agreementId == value.agreementId) {
                            agreementRow.allocatedNow = agreementRow.allocatedNow + value.allocatedNow;
                        }

                    });
                    if (agreementRow.allocatedNow > agreementRow.amount)
                        vm.isEnableforAgAlo = true;
                    if (agreementTtotal > vm.allocationData.allocatingVoucherAmount)
                        vm.isEnableforAgAlo = true;



                });
                return false;
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
                        amount: allocation.allocatedNow,
                        subAllocations: allocation.subAllocations
                    });
                });

                allocationService.saveAllocations({ allocations: allocations, agreementAllocations: vm.agreementAllocations })
                    .success(function (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            function init() {
                vm.loading = true;
                if (options.voucherSubTypeId != 35)
                {
                    allocationService.getAllocationsForEdit2({ voucherId: options.voucherId, allocatingVoucherLineId: options.allocatingVoucherLineId }).success(
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
                            vm.amounDueToAllocate = vm.allocationData.allocatingVoucherAmount - vm.tds;



                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                
                if (options.voucherSubTypeId == 35)
                {
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
                



                getAgreementsAllocations();
            }

            init();
            getChargesTypes();
        }]);
