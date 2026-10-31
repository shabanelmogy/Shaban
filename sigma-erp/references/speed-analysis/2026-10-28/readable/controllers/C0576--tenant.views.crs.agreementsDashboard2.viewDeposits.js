// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:157614-158038
appModule.controller('tenant.views.crs.agreementsDashboard2.viewDeposits', ['$scope', '$uibModal', '$stateParams', 'abp.services.app.commonAgreement',
        '$stateParams', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.deposit',
        function ($scope, $uibModal, $stateParams, commonAgreementService, $stateParams, commonLookupService, utilities, depositService) {

            var vm = this;
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));

            vm.filters = null;
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Delete'),
                'view': abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.View'),
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Print'),
                allocation: abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations'),
                // depositChargesAllocation: abp.features.isEnabled('CRS.Vouchers.Deposits.DepositChargesAllocation'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.AllActionsOnOtherBranchDeposits'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.ViewOtherBranchDeposit'),
                extensionOfDeposits: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.ExtensionOfDeposits')
            };
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            vm.getType = function (type) {
                if (type == 2) {
                    return app.localize("Receipt");
                } else if (type == 3) {
                    return app.localize("Payment");
                } else if (type == 7) {
                    return app.localize("OpeningBalance");
                } else {
                    return "";
                }

            };
            var vm = this;
            vm.saving = false;
            vm.total = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.agreementDetail = vm.filters.agreementForReceviced;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.rounding = (value) => {
                return utilities.round(value, 2);
            }

            vm.openViewDepositModal = function (depositId) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        depositId: function () {
                            return depositId;
                        },
                        agreement: function () {
                            return vm.agreementDetail;
                        }
                    }
                });
            };

            vm.getType = function (type) {
                if (type == 10) {
                    return app.localize("Deposit");
                } else if (type == 3) {
                    return app.localize("Payment");
                } else if (type == 7) {
                    return app.localize("OpeningBalance");
                } else if (type == 20) {
                    return app.localize("UsedDeposit");
                } else {
                    return "";
                }

            };
            var getType = function (voucherSubTypeId) {
                if (voucherSubTypeId == 11)
                    return app.localize("PreAuthorizationDeposit");
                else if (voucherSubTypeId == 13)
                    return app.localize("ChequeDeposit");
                else
                    return "";
            }
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.useDeposit = function (deposit) {
                if (vm.isAllocationWithChargesTypeEnabled) {
                    openUseDepositModal2(deposit);
                }
                else {
                    openUseDepositModal(deposit);
                }

            };
            function openUseDepositModal(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/allocationForDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.allocationForDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            function openUseDepositModal2(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/allocationForDeposit2.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.allocationForDeposit2 as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            vm.depositRefund = function (deposit) {

                openDepositRefund(deposit);
            };
            vm.openRenewExpiry = function (deposit) {
                openRenewExpiryModal(deposit.id);
            };
            function openDepositRefund(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/depositRefund.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.depositRefund as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            function openRenewExpiryModal(depositId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/renewExpiry.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.renewExpiry as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        depositId: function () {
                            return depositId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            vm.returnDeposit = function (deposit) {
                abp.message.confirm(
                    //   app.localize('DeleteWarningMessage', deposit.voucherNo),
                    app.localize('ReturnCheckMessage', deposit.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            depositService.returnDeposit({
                                id: deposit.id
                            }).success(function () {
                                vm.getDeposits();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };
            vm.extendHoldDays = function (deposit) {
                extendHoldDaysModal(deposit.id);
            };
            vm.transferDeposit = function (deposit) {
                transferDepositModal(deposit);
            }

            function transferDepositModal(deposit) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/transferDepositModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.transferDepositModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        depositId: function () {
                            return deposit.id;
                        },
                        customerId: function () {
                            return deposit.contactId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            function openEditDepositModal(deposit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/editDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.editDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                deposit: deposit,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            vm.isInHold = function (statusString) {
                if (statusString == "In-Hold")
                    return true
                else
                    return false


            }
            vm.openprintModal = function (d) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return d;
                        }
                    }
                });
            };
            vm.deleteDeposit = function (deposit) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', deposit.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            depositService.deleteDeposit({
                                id: deposit.id
                            }).success(function () {
                                vm.getDeposits();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };
            vm.editDeposit = function (deposit) {
                openEditDepositModal(deposit);
            };
            function extendHoldDaysModal(depositId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/extendHoldDaysModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.extendHoldDaysModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        depositId: function () {
                            return depositId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }
            vm.getTypeById = function (row) {

                if (row.voucherSubTypeId == 12) {
                    return row.billingDetail != null ? row.billingDetail.billingMethod ? row.billingDetail.billingMethod.name : null : null;
                    //return row.billingDetail.billingMethod.name;
                }
                else {
                    return getType(row.voucherSubTypeId);
                }

            };
            vm.getExpiryOrDays = function (fromdate, todate, voucherSubTypeId) {

                if (voucherSubTypeId == 11) {
                    if (todate != null) {
                        var localTime = moment.utc(todate).toDate();
                        return moment(localTime).format(vm.dateFormat);
                    }
                    else
                        return "";
                }
                else {
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var firstDate = new Date(fromdate);
                    var secondDate = new Date(todate);
                    if (fromdate != null && todate != null) {
                        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                        return diffDays;
                    }
                    else
                        return "";
                }
            };
            vm.totalAmountPreAuth = 0;
            vm.totalUsedPreAuth = 0;
            vm.totalRefundPreAuth = 0;
            vm.totalBalancePreAuth = 0;

            vm.totalAmountOther = 0;
            vm.totalUsedOther = 0;
            vm.totalRefundOther = 0;
            vm.totalBalanceOther = 0;

            vm.getDeposits = function () {
                vm.loading = true;

                vm.totalAmountPreAuth = 0;
                vm.totalUsedPreAuth = 0;
                vm.totalRefundPreAuth = 0;
                vm.totalBalancePreAuth = 0;

                vm.totalAmountOther = 0;
                vm.totalUsedOther = 0;
                vm.totalRefundOther = 0;
                vm.totalBalanceOther = 0;


                //vm.totalAmount = 0.0;
                //vm.totalUsed = 0.0;
                //vm.totalRefund = 0.0;
                //vm.totalBalance = 0.0;

                depositService.getDeposits({
                    agreementId: vm.filters.agreementForReceviced.id,
                    doNotPaginate: true

                }).success(function (result) {
                    vm.loading = false;
                    vm.receipts = result.items;
                    angular.forEach(vm.receipts, function (receipt) {
                        if (receipt.voucherSubTypeId == 11) {
                            vm.totalAmountPreAuth += receipt.amount;
                            vm.totalUsedPreAuth += receipt.amountUsed;
                            vm.totalRefundPreAuth += receipt.amountRefunded;
                            vm.totalBalancePreAuth += receipt.balance;
                        } else {
                            vm.totalAmountOther += receipt.amount;
                            vm.totalUsedOther += receipt.amountUsed;
                            vm.totalRefundOther += receipt.amountRefunded;
                            vm.totalBalanceOther += receipt.balance;
                        }

                        //vm.totalAmount = vm.totalAmount + receipt.amount;
                        //vm.totalUsed = vm.totalUsed + receipt.amountUsed;
                        //vm.totalRefund = vm.totalRefund + receipt.amountRefunded;
                        //vm.totalBalance = vm.totalBalance + receipt.balance;

                    });


                });
            }

            function init() {
                vm.getDeposits();
            }

            init();
        }]);
