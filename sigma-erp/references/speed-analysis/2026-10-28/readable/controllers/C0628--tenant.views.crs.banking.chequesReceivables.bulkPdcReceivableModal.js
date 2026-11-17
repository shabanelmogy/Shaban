// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:167188-167427
appModule.controller('tenant.views.crs.banking.chequesReceivables.bulkPdcReceivableModal', [
        '$scope','utilities', '$uibModalInstance', 'abp.services.app.bankAccount', '$uibModal', 'abp.services.app.chequesReceivables', 'abp.services.app.billingMethod', 'abp.services.app.directory', 'abp.services.app.commonAgreement',
        function ($scope, utilities, $uibModalInstance, bankAccountService, $uibModal, chequesReceivablesService, billingMethodService, directoryService, commonAgreementService) {

            var vm = this;
            vm.saving = false;
            vm.onAgreement = false;
            //  vm.receipt = receipt;
            vm.bankAccounts = null;
            vm.prepareClicked = false;
            //vm.bulkPdcReceivable = {};
            vm.bulkPdcReceivable = {
                billingDetail: {
                    cheque: {}
                }
            };

            vm.mandatoryBatchNoCR = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MandatoryBatchNoCR"));
            vm.additionalBatchNoCR = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AdditionalBatchNoCR"));


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

            vm.onAgreementCheckBox = function () {
                if (!vm.onAgreement) {
                    if (vm.bulkPdcReceivable.agreementId > 0) {
                        vm.bulkPdcReceivable.agreementId = null;
                    }
                    if (vm.bulkPdcReceivable.contact) {
                        vm.bulkPdcReceivable.contact = null;
                        vm.bulkPdcReceivable.contactId = null;
                    }
                }
            }

            vm.onAgreementSelection = function (agreement) {
                if (agreement.customer) {
                    vm.bulkPdcReceivable.contact = agreement.customer;
                    vm.bulkPdcReceivable.contactId = agreement.customer.id;
                    vm.bulkPdcReceivable.agreementId = agreement.id;
                }
            }

            vm.searchCustomers = function ($select) {
                //any contact (staff, customer, supplier)
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.onCustomerChange = function () {
                vm.bulkPdcReceivable.contactId = vm.bulkPdcReceivable.contact?.id || null;
                vm.bulkPdcReceivable.agreement = null;
            };

            vm.searchAgreements = function ($select) {
                return commonAgreementService.searchAgreementsByAgreementNo({ keyword: $select.search, contanctId: vm.bulkPdcReceivable.contactId }).then(function (response) {
                    vm.agreementsList = response.data.items;
                });
            };
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
                            return null;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.bulkPdcReceivable.contact = result;
                        vm.bulkPdcReceivable.contactId = result.id;
                    }
                });
            };

            vm.pdcRows = [];

            vm.preparePdcRows = function () {
                var count = parseInt(vm.bulkPdcReceivable.noOfPdc, 10);
                if (!count || count <= 0) {
                    abp.message.warn("Please enter a valid number of PDCs.");
                    return;
                }

                const startDate = vm.bulkPdcReceivable.billingDetail.cheque.chequeDate;
                const chequeNoStr = vm.bulkPdcReceivable.billingDetail.cheque.chequeNo;
                const bankName = vm.bulkPdcReceivable.billingDetail.cheque.bankName;
                const amount = parseFloat(vm.bulkPdcReceivable.amount);

                if (!startDate || !chequeNoStr || isNaN(amount) || amount <= 0 || !bankName) {
                    abp.message.warn("Please provide valid First Cheque Date, Cheque No, Amount and Bank Name.");
                    return;
                }

                const prefix = chequeNoStr.replace(/[0-9]/g, '');
                const numericPart = chequeNoStr.replace(/\D/g, '');
                const startChequeNo = parseInt(numericPart, 10);

                if (isNaN(startChequeNo)) {
                    abp.message.warn("Cheque number must end with a valid number for auto-increment.");
                    return;
                }

                vm.pdcRows = [];

                for (var i = 0; i < count; i++) {
                    var chequeDate = moment(startDate).add(i, 'months').toDate();
                    var chequeNo = prefix + (startChequeNo + i);

                    vm.pdcRows.push({
                        chequeDate: chequeDate,
                        chequeNo: chequeNo,
                        bankName: bankName,
                        amount: amount
                    });
                }

                vm.prepareClicked = true;
            };


            vm.save = function () {
                vm.saving = true;

                var bulkReceivableData = {
                    contactId: vm.bulkPdcReceivable.contactId,
                    agreementId: vm.bulkPdcReceivable.agreementId,
                    /*amount: vm.bulkPdcReceivable.amount,*/
                    notes: vm.bulkPdcReceivable.notes,
                    batchNo: vm.bulkPdcReceivable.batchNo,
                    BillingDetails: vm.pdcRows.map(function (row) {
                        return {
                            billingMethodId: vm.bulkPdcReceivable.billingDetail.billingMethodId,
                            chequeAmount: row.amount,
                            cheque: {
                                chequeDate: row.chequeDate,
                                chequeNo: row.chequeNo,
                                bankName: row.bankName,
                            }
                        };
                    })
                };

                var addOrUpdateBulkReceivableEndPoint;

                addOrUpdateBulkReceivableEndPoint = chequesReceivablesService.createBulkPdcReceivables(bulkReceivableData);

                addOrUpdateBulkReceivableEndPoint.success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBankAccounts() {
                vm.loading = true;
                bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1, type: 4 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            getPdcReceivableForEdit = function () {
                if (!chequeId)
                    return;

                vm.loading = true;
                chequesReceivablesService.getPdcReceivableForEdit({ id: chequeId }).success(function (data) {
                    vm.bulkPdcReceivable = data;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            function init() {

                vm.loading = true;
                getBankAccounts();
                vm.loading = false;
                getBillingMethods();
                /*getPdcReceivableForEdit();*/
            }

            init();

            let firstWatchRun = true;

            $scope.$watchGroup([
                'vm.bulkPdcReceivable.noOfPdc',
                'vm.bulkPdcReceivable.billingDetail.cheque.chequeDate',
                'vm.bulkPdcReceivable.billingDetail.cheque.chequeNo',
                'vm.bulkPdcReceivable.billingDetail.cheque.bankName',
                'vm.bulkPdcReceivable.amount',
                'vm.bulkPdcReceivable.billingDetail.billingMethod',
                'vm.bulkPdcReceivable.contact'
            ], function (newValues, oldValues) {
                if (firstWatchRun) {
                    firstWatchRun = false;
                    return;
                }

                if (!angular.equals(newValues, oldValues)) {
                    vm.pdcRows = [];
                    vm.prepareClicked = false;
                }
            });
        }
    ]);
