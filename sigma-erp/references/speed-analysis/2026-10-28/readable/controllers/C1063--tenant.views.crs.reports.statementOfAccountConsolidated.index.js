// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:282805-283419
appModule.controller('tenant.views.crs.reports.statementOfAccountConsolidated.index', [
        '$scope', '$rootScope', '$uibModal', 'appSession', 'uiGridConstants', 'abp.services.app.statementOfAccounts', 'abp.services.app.directory', 'utilities', '$stateParams', 'abp.services.app.receivableAgeAnalysisReport', 'abp.services.app.payableAgeAnalysisReport', 'abp.services.app.linkedAccount', 'abp.services.app.commonLookup',
        function ($scope, $rootScope, $uibModal, appSession, uiGridConstants, statementOfAccountsService, directoryService, utilities, $stateParams, receivableAgeAnalysisReportService, payableAgeAnalysisReportService, linkedAccountService, commonLookupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.agreementDashboardFilters = null;
            if ($stateParams.filters) {
                vm.agreementDashboardFilters = $stateParams.filters;
            }
            $rootScope.options = { includeUnApproved: true };
            vm.loading = false;
            vm.statementOfAccount = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.accountEnables = abp.features.isEnabled("CRS.Accounts");
            vm.consolidatedSOAEnabled = abp.features.isEnabled("CRS.Receivables.StatementOfAccountConsolidated");
            vm.isPdcReceivableEnabled = abp.features.isEnabled("CRS.CustomFeatures.PdcReceivableWithoutFinancialEffect");
            vm.contactType = $stateParams.contactType;
            vm.customerFilters = $stateParams.filters;
            vm.customers = [];
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            var isCurrentBranchCustomersOnlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.GetSOAofOnlyCurrentBranchCustomers"));
            vm.isCustomerSeleted = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isAllocationInSOAsettingEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAllocationsInStatementOfAccount"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isPdfReportBtnEnabled = abp.auth.hasPermission("Pages.Tenant.Reports.StatementOfAccounts.PDFReport");
            vm.isExportToExcelBtnEnabled = abp.auth.hasPermission("Pages.Tenant.Reports.StatementOfAccounts.ExportToExcel");
            vm.isAllowInvoiceingOnCorpurateDriver = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowInvoiceingOnCorpurateDriver"));
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
                isConsolidatedStatementOfAccount: false,
                statementOfAccountSearchFilter: 1,
                enableDateRange: true//,
                //printingWithoutLogo: false
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

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

            vm.getContactType = function () {
                if (!$stateParams.contactType && $stateParams.contactType == '')
                    return null;
                if ($stateParams.contactType == 1)
                    return app.localize('Staff');
                if ($stateParams.contactType == 2)
                    return app.localize('Customer');
                if ($stateParams.contactType == 3)
                    return app.localize('Supplier');
                return null
            };

            vm.checkVoucherTypesForPrint = function (voucherType) {
                if (voucherType == 2 || voucherType == 1 || voucherType == 5 || voucherType == 8 || voucherType == 9 || voucherType == 3 || voucherType == 6)
                    return true;
                else
                    return false;
            }

            vm.openprintModal = function (row) {
                row.printObj = {
                    id: row.voucher ? row.voucher.id : row.voucherId,
                    printHeader: vm.filters.printingWithoutLogo
                }
                if (row.type == 2) { // Receipts
                    commonLookupService.validateCheque(!row.voucher ? row.voucherId : row.voucher.id).success(function (data) {
                        if (data)
                            abp.notify.error(app.localize('ChequeIsBounced'));
                        else {
                            var modalInstance = $uibModal.open({
                                templateUrl: '~/App/tenant/views/crs/vouchers/receipts/printtemplates/printPreview.cshtml',
                                controller: 'tenant.views.crs.vouchers.receipts.printTemplates.printPreview as vmMain',
                                backdrop: 'static',
                                size: 'lg',
                                resolve: {
                                    receiptId: function () {
                                        return !row.voucher ? row.voucherId : row.voucher.id;
                                    }
                                }
                            });
                        }
                    });
                }
                else if (row.type == 1) { // Invoices
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                        controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            filters: function () {
                                return row.printObj;
                            },
                            previewVoucher: null,
                            exportWord: false,
                            exportPrintToWord: false,
                            isArabic: function () {
                                return false; // or true, or logic to detect locale
                            }
                        }
                    });
                } else if (row.type == 5) { // Bills
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/bills/printtemplates/printPreview.cshtml',
                        controller: 'tenant.views.crs.vouchers.bills.printTemplates.printPreview as vmMain',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            billId: function () {
                                return !row.voucher ? row.voucherId : row.voucher.id;
                            }
                        }
                    });
                }
                else if (row.type == 8) { // Credit Notes
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/printtemplates/printPreview.cshtml',
                        controller: 'tenant.views.crs.vouchers.creditNotes.printTemplates.printPreview as vmMain',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            creditNoteId: function () {
                                return !row.voucher ? row.voucherId : row.voucher.id;
                            }
                        }
                    });
                } else if (row.type == 9) { // Debit Notes
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/printtemplates/printPreview.cshtml',
                        controller: 'tenant.views.crs.vouchers.debitNotes.printTemplates.printPreview as vmMain',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            debitNoteId: function () {
                                return !row.voucher ? row.voucherId : row.voucher.id;
                            }
                        }
                    });
                } else if (row.type == 3) { // Payments
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/payments/printtemplates/printPreview.cshtml',
                        controller: 'tenant.views.crs.vouchers.payments.printTemplates.printPreview as vmMain',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            paymentId: function () {
                                return !row.voucher ? row.voucherId : row.voucher.id;
                            }
                        }
                    });
                }
                else if (row.type == 6) { // JVs
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/jvs/printtemplates/printPreview.cshtml',
                        controller: 'tenant.views.crs.vouchers.jvs.printTemplates.printPreview as vmMain',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            JVId: function () {
                                return !row.voucher ? row.voucherId : row.voucher.id;
                            }
                        }
                    });
                }
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            //vm.formatNumber = function (amount) {
            //    if (amount == null) return null;
            //    return amount.toLocaleString('en');
            //};




            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };

            // search from dropdown
            vm.searchCustomers = function ($select) {
                let contactType = [];
                if ($stateParams.contactType)
                    contactType.push($stateParams.contactType);

                if (vm.isAllowInvoiceingOnCorpurateDriver)
                    contactType.push(6);
                var filterLocationId = isCurrentBranchCustomersOnlyEnabled ? appSession.user.locationId : null;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, locationId: filterLocationId, includeUnApproved: true, isSoAConsolidatedSearch: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                let contactType = [$stateParams.contactType];
                if (vm.isAllowInvoiceingOnCorpurateDriver) {
                    contactType == undefined ? [] : contactType;
                    contactType.push(6);
                }
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return contactType;
                        },
                        options: {
                            isSoAConsolidatedSearch: true
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };




            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return utilities.currencyAndRounding(amount);
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
                        if (value.debit !== 0)
                            vm.debitSum += value.debit;

                        if (value.credit !== 0)
                            vm.creditSum += value.credit;

                    });
                }
            };
            vm.getReceivableAgeAnalysisReport = function () {
                vm.loading = true;
                receivableAgeAnalysisReportService.getAgeAnalysisReport({ asOfDate: moment().endOf('day'), customerId: vm.filters.customer.id }).success(function (data) {
                    vm.data = data.list;
                    vm.result = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getPayableAgeAnalysisReport = function () {
                vm.loading = true;
                payableAgeAnalysisReportService.getAgeAnalysisReport({ asOfDate: moment().endOf('day'), supplierId: vm.filters.customer.id }).success(function (data) {
                    //vm.payableAgeAnalysisdata = data.list;
                    //vm.payableAgeAnalysisresult = data;
                    vm.data = data.list;
                    vm.result = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.getStatementOfAccounts = function () {

                vm.loading = true;
                //if (vm.filters.enableDateRange) {
                //    if (vm.filters.customer) {
                //        vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //        vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //    }
                //    else {
                //        vm.filters.fromDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).subtract(30, 'days').add(-1, 'milliseconds').utc();
                //        vm.filters.toDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //    }
                //}
                //else {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                if (!angular.isUndefined(vm.filters.customer)) {
                    vm.filters.contactId = vm.filters.customer.id;
                }
                if (vm.filters.statementOfAccountSearchFilter == 2 && vm.contactType == 2) {

                    statementOfAccountsService.getOutStandingInvoices(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;

                        if (appSession.tenant.tenancyName.toLowerCase() == 'advanced') {

                            vm.statementOfAccount.statement = vm.statementOfAccount.statement.filter(e => e.type == 1 || (e.description && e.description.includes('Invoice')));

                            vm.statementOfAccount.statement.forEach((value, index) => {
                                var balance = value.debit - value.credit;
                                if (index == 0)
                                    value.runningBalance = balance;
                                if (index > 0) {

                                    if (vm.filters.contactType == 3)
                                        balance = value.credit - value.debit;

                                    value.runningBalance = vm.statementOfAccount.statement[index - 1].runningBalance + balance;
                                }

                            });


                        }

                        vm.getdebitAndCredit();
                        vm.getReceivableAgeAnalysisReport();

                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        //vm.statementOfAccount.statement.forEach(function (value) {
                        //    value.printObj = {
                        //        id: value.voucherId,
                        //        printHeader: vm.filters.printingWithoutLogo
                        //    };
                        //});
                        vm.loading = false;
                    });
                }
                else if (vm.filters.statementOfAccountSearchFilter == 2 && vm.contactType == 3) {

                    statementOfAccountsService.getBills(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getPayableAgeAnalysisReport();
                        vm.getdebitAndCredit();
                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.loading = false;
                    });
                }
                else if (vm.filters.statementOfAccountSearchFilter == 2 && vm.contactType == 1) {

                    statementOfAccountsService.getOutStandings(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();
                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.loading = false;
                    });
                }
                else {
                    if (vm.consolidatedSOAEnabled)
                        vm.filters.isConsolidatedStatementOfAccount = true;
                    statementOfAccountsService.getStatementOfAccounts(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();

                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.getPendingPdcs();
                        //vm.statementOfAccount.statement.forEach(function (value) {
                        //    value.printObj = {
                        //        id: value.voucher.id,
                        //        printHeader: vm.filters.printingWithoutLogo
                        //    };
                        //});
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
                    statementOfAccountsService.getDepositsOnCustomer(vm.filters).success(function (result) {
                        vm.depositsOnCustomerData = result;
                        vm.depositSum = 0;
                        vm.depositSum = vm.depositsOnCustomerData.filter(e => e.voucherSubTypeId != 11).reduce(function (previous, current) {
                            return previous + (current.amount - current.alreadyAllocated - current.refunded);
                        }, 0);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            vm.getPendingPdcs = function () {
                if (vm.filters.contactId) {
                    statementOfAccountsService.getPendingPdcs(vm.filters).success(function (result) {
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
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }


                if (!angular.isUndefined(vm.filters.customer)) {
                    vm.filters.contactId = vm.filters.customer.id;
                }
                if (vm.filters.statementOfAccountSearchFilter == 2 && vm.contactType == 2) {

                    statementOfAccountsService.exportToExcelOutStandingInvoices(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (vm.filters.statementOfAccountSearchFilter == 2 && vm.contactType == 3) {

                    statementOfAccountsService.exportToExcelOutStandingBills(vm.filters)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else {
                    statementOfAccountsService.exportToExcelLedger(vm.filters)
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
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                statementOfAccountsService.emailStatementOfAccountDetails(vm.filters)
                    .success(function (result) {

                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.StatementOfAccountPrintModal = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/statementOfAccountConsolidated/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.reports.statementOfAccountConsolidated.printtemplates.printPreview as vmMain',
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

            function init() {
                vm.loading = true;
                statementOfAccountsService.getLinkedAccountsForEdit().success(function (data) {
                    vm.linkAccounts = data.items;
                    //vm.getStatementOfAccounts();
                    vm.filters.contactType = vm.contactType;
                }).finally(function () {
                    vm.loading = false;
                });


                if (vm.agreementDashboardFilters) {
                    vm.filters.customer = vm.agreementDashboardFilters.customer;
                    if (vm.filters.enableDateRange) {
                        vm.dateRangeModel.startDate = moment(moment().format('YYYY-MM-DD')).utc();
                        vm.dateRangeModel.endDate = moment(moment().format('YYYY-MM-DD')).add(1, 'month').add(-1, 'milliseconds').utc();
                    }

                    vm.dateRangeModelChanged()
                    vm.getStatementOfAccounts();
                }
            }

            init();
        }
    ]);
