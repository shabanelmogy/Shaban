// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:95677-95919
appModule.controller('tenant.views.common.hrm.deduction.createOrEditModal', [
        '$uibModalInstance', '$uibModal', 'abp.services.app.directory', 'abp.services.app.deduction', 'utilities', 'options', 'abp.services.app.salaryItemsSetting', 'staff', 'amount', 'abp.services.app.payment',
        function ($uibModalInstance, $uibModal, directoryService, deductionService, utilities, options, salaryItemsSettingService, staff, amount, paymentService) {

            var vm = this;
            vm.loading = false;
            vm.totalPaidAmount = 0;
            vm.deductionTypes = [];
            if (!vm.deduction) {
                vm.deduction = {};
            }

            var deductionId = options.id;
            vm.deduction.totalAmount = amount || 0;  // Make sure it's a number

            vm.deduction.staff = staff;
            vm.deduction.staffId = staff.id;

            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getLocalize = (name) => {
                return abp.localization.localize(name);
            }


            vm.searchStaff = function ($select) {
                //whereas contactType: 1 (staff) 
                return directoryService.search({ keyword: $select.search, activeOnly: true, contactType: 1 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchVoucher = function ($select) {
                if (!$select.search) {
                    vm.vouchers = [];
                    return;
                }

                return deductionService.getStaffAdvanceOrLoanPayments($select.search)
                    .then(function (response) {
                        vm.vouchers = response.data.items;
                    });
            };
            vm.onVoucherSelect = function (voucher) {

                if (!voucher) {
                    vm.deduction.voucherSelected = false;
                    vm.deduction.voucher = null;

                    return;
                }

                // Store selected voucher
                vm.deduction.voucher = voucher;
                vm.deduction.voucherId = voucher.id;
                // Lock voucher/staff/type/amount fields
                vm.deduction.voucherSelected = true;

                // Auto populate amount
                vm.deduction.totalAmount = voucher.amount;

                // Auto populate staff
                if (voucher.contact) {
                    vm.deduction.staff = voucher.contact;
                    vm.deduction.staffId = voucher.contact.id;
                }

                // Auto populate deduction type
                if (voucher.voucherSubTypeId == 1001) {

                    // Advance Payment -> Advance Deduction
                    vm.deduction.salaryItemId = 51;

                } else if (voucher.voucherSubTypeId == 1002) {

                    // Loan Payment -> Loan Deduction
                    vm.deduction.salaryItemId = 52;

                } else {

                    // Invalid/unexpected subtype
                    vm.deduction.salaryItemId = null;
                }
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.deductionTypesList = [
                {
                    id: 1, name: app.localize("LoanDeduction")
                },
                {
                    id: 2, name: app.localize("AdvanceDeduction")
                },
                {
                    id: 3, name: app.localize("FinesDeduction")
                },
                {
                    id: 4, name: app.localize("ExtraDeduction")
                },
            ];

            vm.getStatusTypes = function (status) {
                if (status == 0) {
                    return app.localize("Pending");
                } else if (status == 1) {
                    return app.localize("Deducted");
                } else if (status == 2) {
                    return app.localize("WaivedOff");
                } else {
                    return "";
                }
            };
            vm.getDeductionEmiStatus = function (status) {
                if (status == 1) {
                    return app.localize("Payroll");
                } else if (status == 2) {
                    return app.localize("Cash");
                } else {
                    return "";
                }
            };
            vm.searchStaffPopoup = function () {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 1;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.onStaffSelect(result);
                    }
                });
            };

            vm.onStaffSelect = function (customer) {
                vm.deduction.staffId = customer.id;
                vm.deduction.staff = customer;
            };

            vm.opendeductionLineModal = function (deductionId) {
                var modalInstance = $uibModal.open({

                    templateUrl: '~/App/tenant/views/common/hrm/deduction/deductionPayrollLineModal.cshtml',
                    controller: 'tenant.views.common.hrm.deduction.deductionPayrollLineModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {

                        deductionId: function () {
                            return deductionId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    if (result === true) {

                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                        // Refresh deduction from server
                        vm.getDeduction();

                    }
                });

            };
            vm.save = function () {
                vm.saving = true;
                deductionService.createOrUpdateDeduction({ deduction: vm.deduction }
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function getSalaryItemTypes() {
                vm.loading = true;
                salaryItemsSettingService.getSalaryItemTypes().success(function (data) {
                    vm.salaryTypes = data;
                    const otherDedutcion = vm.salaryTypes.find(item => item.id === 65);

                    if (otherDedutcion) {

                        otherDedutcion.type = "Extra Deduction";
                    }

                    init();
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getAdvanceOrLoanPayments() {
                vm.loading = true;
                paymentService.getSalaryItemTypes().success(function (data) {
                    vm.salaryTypes = data;
                    const otherDedutcion = vm.salaryTypes.find(item => item.id === 65);

                    if (otherDedutcion) {

                        otherDedutcion.type = "Extra Deduction";
                    }

                    init();
                }).finally(function () {
                    vm.loading = false;
                });
            }
            //init 
            function init() {
                //getDeductionTypes();
                if (deductionId > 0) {
                    vm.loading = true;
                    deductionService.getDeductionForEdit({ id: deductionId }).success(
                        function (result) {
                            vm.deduction = result;
                            if (vm.deduction.deductionDetails && vm.deduction.deductionDetails.length > 0) {
                                vm.totalPaidAmount = vm.deduction.deductionDetails.reduce(function (sum, deduction) {
                                    return sum + deduction.amount;
                                }, 0);
                            }
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            }
            getSalaryItemTypes();

        }
    ]);
