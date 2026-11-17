// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:283670-284324
appModule.controller('tenant.views.crs.reports.statementOfAccounts.index', [
        '$scope', '$uibModal', 'appSession', 'uiGridConstants', 'abp.services.app.statementOfAccounts', 'abp.services.app.directory', 'utilities', '$stateParams', 'abp.services.app.receivableAgeAnalysisReport', 'abp.services.app.payableAgeAnalysisReport', 'abp.services.app.linkedAccount', 'abp.services.app.commonLookup', 'abp.services.app.commonAgreement',
        function ($scope, $uibModal, appSession, uiGridConstants, statementOfAccountsService, directoryService, utilities, $stateParams, receivableAgeAnalysisReportService, payableAgeAnalysisReportService, linkedAccountService, commonLookupService, commonAgreementService) {

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
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.isEmailSOAEnabled = abp.features.isEnabled("Notifications.EmailSOA");
            vm.isWhatsAppSmsSOAEnabled = abp.features.isEnabled("Notifications.WhatsAppSmsSOA");
            vm.isStatementOfAccountChargesTypewiseEnabled = abp.features.isEnabled("CRS.Receivables.StatementOfAccountChargesTypeWise");
            vm.isCustomersAllowSOAExport = abp.auth.hasPermission('Pages.Tenants.Customers.StatementOfExport');
            vm.isCustomersAllowEmailSOA = abp.auth.hasPermission('Pages.Tenants.Customers.StatementOfAccountsEmail');
            vm.isSuppliersAllowEmailSOA = abp.auth.hasPermission('Pages.Tenants.Suppliers.StatementOfAccountsEmail');
            vm.allowReAllocationOfAllocated = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.AllowReAllocationOfAllocated'),
                vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.accountEnables = abp.features.isEnabled("CRS.Accounts");
            vm.isPdcReceivableEnabled = abp.features.isEnabled("CRS.CustomFeatures.PdcReceivableWithoutFinancialEffect");
            vm.contactType = $stateParams.contactType;
            vm.customerFilters = $stateParams.filters;
            vm.isShowAgreementInPayments = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAgreementInPayment"));
            vm.showVoucherDetailDescriptionInSOA = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowVoucherDetailDescriptionInSOA"));
            vm.showVoucherDescriptionInSupplierOutStandingSOA = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowVoucherDescriptionInSupplierOutStandingSOA"));
            vm.customers = [];
            vm.allowAllocations = abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations');
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            var isCurrentBranchCustomersOnlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.GetSOAofOnlyCurrentBranchCustomers"));
            vm.isCustomerSeleted = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isAllocationInSOAsettingEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAllocationsInStatementOfAccount"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            };
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: 'Accessories Rental', id: 8 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });

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
                agreementNo: null,
                contactType: null,
                statementOfAccountSearchFilter: 1,
                enableDateRange: true,
                module: null,
                voucherWithoutAgreementNo: false
            };


            vm.filterAgreements = function (search) {
                return function (agreement) {
                    if (!search) return true;
                    var term = search.toLowerCase();
                    return (agreement.agreementNo && agreement.agreementNo.toLowerCase().indexOf(term) > -1) ||
                        (agreement.manualAgreementNo && agreement.manualAgreementNo.toLowerCase().indexOf(term) > -1);
                };
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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDateNew = function (date) {
                if (date != null) {
                    return moment.utc(date).format('DD-MM-YYYY');
                } else {
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
                var filterLocationId = isCurrentBranchCustomersOnlyEnabled ? appSession.user.locationId : null;
                var inActiveOnly = vm.filters.inActive === true;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: $stateParams.contactType, locationId: filterLocationId, inActiveOnly: inActiveOnly }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            function getAgreements(customerId) {
                if (vm.isShowAgreementInPayments) {
                    vm.loading = true;
                    commonAgreementService.getAllAgreementsOnCustomer({ id: customerId })
                        .success(function (data) {
                            vm.agreementsList = data.items;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            }

            vm.onCustomerSelect = function () {
                vm.filters.agreement = null;
                vm.filters.agreementNo = null;
                vm.agreementsList = [];

                if (vm.filters.customer) {
                    getAgreements(vm.filters.customer.id);
                }
            };

            vm.onAgreementSelect = function ($select) {
                vm.filters.agreementNo = $select.selected != null ? $select.selected.agreementNo : null;
            };

            vm.clearAgreementFilter = function () {
                vm.filters.agreement = null;
                vm.filters.agreementNo = null;
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchInActiveContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return $stateParams.contactType;
                        },
                        inActive: function () {
                            return vm.filters.inActive; // pass checkbox state to modal
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
                        if (value.debit != null && value.debit !== 0) {
                            vm.debitSum += value.debit;
                        }

                        if (value.credit != null && value.credit !== 0) {
                            vm.creditSum += value.credit;
                        }
                    });
                }
            };
            vm.getReceivableAgeAnalysisReport = function () {
                vm.loading = true;
                receivableAgeAnalysisReportService.getAgeAnalysisReport({ asOfDate: moment().endOf('day'), customerId: vm.filters.customer.id, module: vm.filters.module}).success(function (data) {
                    vm.data = data.list;
                    vm.result = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getPayableAgeAnalysisReport = function () {
                vm.loading = true;
                payableAgeAnalysisReportService.getAgeAnalysisReport({ asOfDate: moment().endOf('day'), supplierId: vm.filters.customer.id, module: vm.filters.module }).success(function (data) {
                    //vm.payableAgeAnalysisdata = data.list;
                    //vm.payableAgeAnalysisresult = data;
                    vm.data = data.list;
                    vm.result = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getStatementOfAccounts = function () {

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
                    statementOfAccountsService.getStatementOfAccounts(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();

                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.getPendingPdcs();
                        vm.getAdvanceTaxInvoice();
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
                        vm.depositSum = vm.depositsOnCustomerData.filter(e => e.voucherSubTypeId != 11 && e.voucherSubTypeId != 13).reduce(function (previous, current) {
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
            vm.getAdvanceTaxInvoice = function () {
                if (vm.filters.contactId) {
                    statementOfAccountsService.getAdvanceTaxInvoice(vm.filters).success(function (result) {
                        vm.advanceTaxInvoice = result.statement;
                        vm.advanceTaxInvoice.forEach((value, index) => {
                            var balance = value.debit - value.credit;
                            if (index == 0)
                                value.runningBalance = balance;
                            if (index > 0) {
                                if (vm.filters.contactType == 3)
                                    balance = value.credit - value.debit;
                                value.runningBalance = vm.advanceTaxInvoice[index - 1].runningBalance + balance;
                            }
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

            vm.exportToExcelChargesTypewise = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                statementOfAccountsService.exportToExcelDueInvoices(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
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
            vm.whatsAppSmsStatementOfAccount = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                statementOfAccountsService.whatsAppSmsStatementOfAccountDetails(vm.filters)
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
                    templateUrl: '~/App/tenant/views/crs/reports/statementOfAccounts/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.reports.statementOfAccounts.printtemplates.printPreview as vmMain',
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

            vm.createAllocation = function (voucher) {
                commonLookupService.validateCheque(voucher.id).success(function (data) {
                    if (data)
                        abp.notify.error(app.localize('ChequeIsBounced'));
                    else {
                        if (vm.isAllocationWithChargesTypeEnabled)
                            openCreateAllocationModal2(voucher);
                        else
                            openCreateAllocationModal(voucher);
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            // Opening Create Allocation Modal
            function openCreateAllocationModal(voucher) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/allocations/createAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.allocations.createAllocation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucher.voucherId,
                                agreementId: voucher.agreementId,
                                voucherSubTypeId: voucher.voucherSubTypeId,
                                tds: voucher.tds
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStatementOfAccounts();
                });
            }
            function openCreateAllocationModal2(voucher) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/allocations/createAllocation2.cshtml',
                    controller: 'tenant.views.crs.vouchers.allocations.createAllocation2 as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucher.voucherId,
                                agreementId: voucher.agreementId,
                                contactId: voucher.contactId,
                                voucherSubTypeId: voucher.voucherSubTypeId,
                                tds: voucher.tds
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStatementOfAccounts();
                });
            }

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
                    if (vm.filters.customer) {
                        getAgreements(vm.filters.customer.id);
                    }
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
