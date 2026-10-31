// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:416381-416776
appModule.controller('tenant.views.externalLogin.statementOfAccounts.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.statementOfAccountExternal', 'abp.services.app.directory', 'utilities', '$stateParams', 'abp.services.app.receivableAgeAnalysisReport', 'abp.services.app.linkedAccount','$stateParams',
        function ($scope, $uibModal, $window, uiGridConstants, statementOfAccountsExternalService, directoryService, utilities, $stateParams, receivableAgeAnalysisReportService, linkedAccountService, $stateParams) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.agreementDashboardFilters = null;
            if ($stateParams.filters) {
                vm.agreementDashboardFilters = $stateParams.filters;
            }
            vm.loading = false;
            vm.statementOfAccount = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.accountEnables = abp.features.isEnabled("CRS.Accounts");
            vm.isPdcReceivableEnabled = abp.features.isEnabled("CRS.CustomFeatures.PdcReceivableWithoutFinancialEffect");
            vm.contactType = 2;
            vm.customerFilters = $stateParams.filters;
            vm.isCustomerSeleted = false;
            vm.customerDetail = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            };
            vm.formatBalance = function (balance) {
                if (balance != 0) {
                    return balance > 0 ? 'Dr ' + vm.CurrencyFormate(balance) : 'Cr ' + (vm.CurrencyFormate(-balance));
                }
                return balance;
            };
            vm.filters = {
                contactId: null,
                contactType: $stateParams.contactType,
                fromDate: null,
                toDate: null,
                contactType: null,
                statementOfAccountSearchFilter: 1,
                enableDateRange: true
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            //vm.dateRangeModel = {
            //    startDate: moment().add(-29, 'days').startOf('day'),
            //    endDate: moment().endOf('day')
            //};
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate;
                vm.filters.endDate = vm.dateRangeModel.endDate;
            };

            vm.radioButtonValueChanged = function () {
                if (vm.filters.statementOfAccountSearchFilter == 2)
                    vm.filters.enableDateRange = false;
                else if (vm.filters.statementOfAccountSearchFilter == 1)
                    vm.filters.enableDateRange = true;

                if (vm.filters.customer) {
                    vm.getStatementOfAccounts();
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };




            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }

            vm.formatBalanceAsDrCr = function (balance) {
                if (balance > 0)
                    return 'Dr ' + vm.CurrencyFormate(utilities.round(balance, 2));
                else if (balance < 0)
                    return 'Cr ' + vm.CurrencyFormate(utilities.round(-balance, 2));
                else
                    return "0";
            };
            vm.getdebitAndCredit = function () {

                vm.debitSum = 0;
                vm.creditSum = 0;
                if (vm.statementOfAccount.statement) {
                    angular.forEach(vm.statementOfAccount.statement, function (value) {
                        if (value.debit > 0)
                            vm.debitSum += value.debit;
                        if (value.credit > 0)
                            vm.creditSum += value.credit;
                    });
                }
            };
            vm.getAgeAnalysisReport = function () {
                vm.loading = true;
                receivableAgeAnalysisReportService.getAgeAnalysisReport({ asOfDate: moment().endOf('day'), customerId: vm.filters.customer.id }).success(function (data) {
                    vm.data = data.list;
                    vm.result = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getStatementOfAccounts = function () {

                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                if (!angular.isUndefined(vm.filters.customer)) {
                    vm.filters.contactId = vm.filters.customer.id;
                }
                if (vm.filters.statementOfAccountSearchFilter == 2 && vm.contactType == 2) {

                    statementOfAccountsExternalService.getOutStandingInvoices(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();
                        vm.getAgeAnalysisReport();
                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.loading = false;
                    });
                }
                else {
                    statementOfAccountsExternalService.getStatementOfAccounts(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();

                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.getPendingPdcs();
                        vm.loading = false;
                    });
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
            vm.getTypeById = function (row) {

                if (row.voucherSubTypeId == 12) {
                    if (row.billingDetail)
                        return row.billingDetail.billingMethod.name;
                    else
                        return null;
                }
                else
                    return getType(row.voucherSubTypeId);

            };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };
            vm.getDepositsOnCustomerData = function () {
                if (vm.filters.contactId) {
                    statementOfAccountsExternalService.getDepositsOnCustomer(vm.filters).success(function (result) {
                        vm.depositsOnCustomerData = result;
                        vm.depositSum = 0;
                        vm.depositSum = vm.depositsOnCustomerData.reduce(function (previous, current) {
                            return previous + (current.amount - current.alreadyAllocated - current.refunded);
                        }, 0);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            vm.getPendingPdcs = function () {
                if (vm.filters.contactId) {
                    statementOfAccountsExternalService.getPendingPdcs(vm.filters).success(function (result) {
                        vm.pendingPdcOnCustomerData = result;
                        vm.totalCustomerPdc = 0;
                        vm.pendingPdcOnCustomerData.forEach(function (value) {
                            vm.totalCustomerPdc = value.amount + vm.totalCustomerPdc;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            vm.contactGroupStaffFilter = function (item) {
                if (item.contactGroupId != null && item.contactGroupId > 0 && item.contactGroup.contactType == 1) {
                    return true;
                }
                return false;
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }


                if (!angular.isUndefined(vm.filters.customer)) {
                    vm.filters.contactId = vm.filters.customer.id;
                }
                if (vm.filters.statementOfAccountSearchFilter == 2 && vm.contactType == 2) {

                    statementOfAccountsExternalService.exportToExcelOutStandingInvoices(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else {
                    statementOfAccountsExternalService.exportToExcelLedger(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            };

            vm.emailStatementOfAccount = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                statementOfAccountsExternalService.emailStatementOfAccountDetails(vm.filters)
                    .success(function (result) {

                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.StatementOfAccountPrintModal = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/statementOfAccount/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.externalLogin.statementOfAccounts.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });

            };

            vm.voucherCheck = function (voucherType) {
                return voucherType == 1 || voucherType == 2 || voucherType == 3 || voucherType == 5 || voucherType == 8 || voucherType == 9 ? true : false;
            }

            voucherTypeString = function (voucherTypeId) {
                return voucherTypeId == 1 ? 'invoice' : voucherTypeId == 2 ? 'receipt' : voucherTypeId == 3 ? 'payment' : voucherTypeId == 5 ? 'bill' : voucherTypeId == 8 ? 'creditNote' : voucherTypeId == 9 ? 'debitNote' : '';
            }

            vm.openPrintModal = function (voucher) {
                voucher.printObj = {
                    id: voucher.id,
                    printHeader: false // false for printing logo, true for without logo.
                };
                let resolveObj;
                if (voucher.type == 1) {
                    resolveObj = {
                        filters: function () {
                            return voucher.printObj;
                        }
                    }
                } else if (voucher.type == 2) {
                    resolveObj = {
                        receipt: function () {
                            return voucher;
                        }
                    }
                }else if (voucher.type == 3) {
                    resolveObj = {
                        payment: function () {
                            return voucher;
                        }
                    }
                }else if (voucher.type == 5) {
                    resolveObj = {
                        bill: function () {
                            return voucher;
                        }
                    }
                }else if (voucher.type == 8) {
                    resolveObj = {
                        creditNote: function () {
                            return voucher;
                        }
                    }
                }else if (voucher.type == 9) {
                    resolveObj = {
                        debitNote: function () {
                            return voucher;
                        }
                    }
                }
                $uibModal.open({
                    templateUrl: `~/App/tenant/views/crs/vouchers/${voucherTypeString(voucher.type)}s/printtemplates/printPreview.cshtml`,
                    controller: `tenant.views.crs.vouchers.${voucherTypeString(voucher.type)}s.printTemplates.printPreview as vmMain`,
                    backdrop: 'static',
                     size: 'lg',
                     resolve: resolveObj
                });
            }

            function init() {
                vm.loading = true;
                statementOfAccountsExternalService.getLinkedAccountsForEdit().success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null) {
                        initDate();
                    }
                    vm.linkAccounts = data.linkAccounts;
                    //vm.getStatementOfAccounts();
                    vm.filters.contactType = vm.contactType;
                    vm.customerDetail = data.customer;
                    vm.filters.customer = vm.customerDetail.contact;
                }).finally(function () {
                    vm.loading = false;
                    });


                if (vm.agreementDashboardFilters || true) {
                    //vm.filters.customer = vm.agreementDashboardFilters.customer;
                    if (vm.filters.enableDateRange) {
                        vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                        vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                    }

                    vm.dateRangeModelChanged()
                    vm.getStatementOfAccounts();
                }
            }

            initDate();
            init();
        }
    ]);
