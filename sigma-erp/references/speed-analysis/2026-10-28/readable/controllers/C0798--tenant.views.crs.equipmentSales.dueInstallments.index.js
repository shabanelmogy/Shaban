// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:210486-210797
appModule.controller('tenant.views.crs.equipmentSales.dueInstallments.index', [
        'utilities', '$scope', '$uibModal', 'appSession', 'abp.services.app.salesAgreement', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.chequesReceivables',
        function (utilities, $scope, $uibModal, appSession, salesAgreementService, directoryService, commonLookupService, chequesReceivablesService) {
            var vm = this;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            //vm.dateRangeOptions.startDate = moment().startOf('month');
            //vm.dateRangeOptions.endDate = moment().endOf('month');
            vm.invoicePerInstallment = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CreateInvoicePerInstallment"));
            vm.customers = [];
            vm.filters = {
                enableDateRange: true,   // Enable date range by default
                startDate: null,
                endDate: null,
                customerId: null,
                agreementNo: null,
            };
            vm.isAllowedResubmitOnChequeReceivables = utilities.parseBoolean(abp.setting.get("App.General.AllowResubmitOnChequeReceivables"));
            //vm.allowToEditPaymentMethodInEMIs = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowToEditPaymentMethodInEMIs"));
            vm.allowToEditPaymentMethodInEMIs = true;
            vm.isPdcReceivableEnabled = abp.features.isEnabled("CRS.CustomFeatures.PdcReceivableWithoutFinancialEffect");
            vm.isPdcReceivableEnabled = abp.features.isEnabled("CRS.CustomFeatures.PdcReceivableWithoutFinancialEffect");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.permissions = {

                resubmitCheque: abp.auth.hasPermission('Pages.Tenant.Banking.ChequesReceivables.ResubmitCheque')
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                commonLookupService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.customerId = customer.id;
                    }
                });
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };
            vm.getDueInstallments = () => {
                vm.isLoading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                salesAgreementService.getDueInstallments(vm.filters)
                    .success((response) => {
                        vm.data = response.items;
                    })
                    .finally(() => {
                        vm.isLoading = false;
                    });
            }
            //function initDate() {
            //    vm.dateRangeModel = {
            //        startDate: moment().add(-29, 'days').startOf('day'),
            //        endDate: moment().endOf('day')
            //    };
            //}
            vm.createReceipt = function (agreement) {
                if (!agreement || !agreement.id) {
                    return;
                }
                agreement.isDueInstallment = true;
                openCreateOrEditReceiptModal(null, agreement);

            };
            vm.editPaymentMethod = function (installment) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/dueInstallments/editPaymentMethodModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.dueInstallments.editPaymentMethodModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        installment: function () { return installment; }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getDueInstallments();
                });
            };
            function openCreateOrEditReceiptModal(receiptId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        receiptId: function () { return receiptId; },
                        agreement: function () { return agreement; },
                        quotationId: function () { return null; },
                        customer: function () { return null; },
                        downPayment: function () { return null; },
                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDueInstallments();
                });
            }
            function openMatureChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/matureChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.matureChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDueInstallments();
                });
            }

            function openReturnChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/returnChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.returnChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDueInstallments();
                });
            }

            function openBounceChequeModal(receipt) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/bounceChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.bounceChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return receipt;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDueInstallments();
                });
            }
            function openSaleAgreementInvoiceModal(installmentInvoice) {
                console.log("in main function");
                console.log(installmentInvoice);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateSalesAgreementModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateSalesAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        installmentInvoice: function () {
                            return installmentInvoice;
                        },
                        invoiceId: function () {
                            return null;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDueInstallments();
                });
            }
            vm.convertToCdc = function (row) {
                abp.message.confirm(
                    app.localize(''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            chequesReceivablesService.convertToCdc({
                                id: row.id
                            }).success(function () {
                                //vm.getBookings();
                                vm.getDueInstallments();
                                abp.notify.success(app.localize('SuccessfullyConvertToCDC'));
                            });
                        }
                    }
                );
            };
            vm.resubmitCheque = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/resubmitChequeModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesReceivables.resubmitChequeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        receipt: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChequesReceivables();
                });
            };
            vm.getAgreementIndex = function (row, index) {

                if (index === 0) {
                    return 1;
                }

                var counter = 1;

                for (var i = 0; i < index; i++) {
                    if (vm.data[i].agreementNo === row.agreementNo) {
                        counter++;
                    }
                }

                return counter;
            };
            vm.matureCheque = function (receipt) {
                openMatureChequeModal(receipt);
            };

            vm.returnCheque = function (receipt) {
                openReturnChequeModal(receipt);
            };

            vm.bounceCheque = function (receipt) {
                openBounceChequeModal(receipt);
            };
            vm.createInvoicePerinstallment = function (invoice) {
                openSaleAgreementInvoiceModal(invoice);
            };
            function init() {
                //initDate();
                vm.getDueInstallments();
            }

            init();
        }
    ]);
