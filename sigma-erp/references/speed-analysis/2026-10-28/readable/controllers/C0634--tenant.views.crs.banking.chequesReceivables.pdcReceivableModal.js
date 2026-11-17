// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168290-168436
appModule.controller('tenant.views.crs.banking.chequesReceivables.pdcReceivableModal', [
        '$uibModalInstance','utilities', 'abp.services.app.bankAccount', '$uibModal', 'abp.services.app.chequesReceivables', 'abp.services.app.billingMethod', 'abp.services.app.directory', 'chequeId', 'abp.services.app.commonAgreement',
        function ($uibModalInstance, utilities, bankAccountService, $uibModal, chequesReceivablesService, billingMethodService, directoryService, chequeId, commonAgreementService) {

            var vm = this;
            vm.saving = false;
            vm.onAgreement = false;
            //  vm.receipt = receipt;
            vm.bankAccounts = null;
            vm.pdcReceivable = {};
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
            vm.searchCustomers = function ($select) {
                //any contact (staff, customer, supplier)
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchAgreements = function ($select) {
                return commonAgreementService.searchAgreementsByAgreementNo({ keyword: $select.search, contanctId: vm.pdcReceivable.contactId }).then(function (response) {
                    vm.agreementsList = response.data.items;
                });
            };
            vm.onAgreementCheckBox = function () {
                if (!vm.onAgreement) {
                    if (vm.pdcReceivable.agreementId > 0) {
                        vm.pdcReceivable.agreementId = null;
                    }
                    if (vm.pdcReceivable.contact) {
                        vm.pdcReceivable.contact = null;
                        vm.pdcReceivable.contactId = null;
                    }
                }
            }

            vm.onAgreementSelection = function (agreement) {
                if (agreement.customer) {
                    vm.pdcReceivable.contact = agreement.customer;
                    vm.pdcReceivable.contactId = agreement.customer.id;
                    vm.pdcReceivable.agreementId = agreement.id;
                }
            }

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
                        vm.pdcReceivable.contact = result;
                        vm.pdcReceivable.contactId = result.id;
                    }
                });
            };
            vm.save = function () {
                var addOrUpdateReceivableEndPoint;


                if (chequeId)
                    addOrUpdateReceivableEndPoint = chequesReceivablesService.updatePdcReceivable(
                        vm.pdcReceivable
                    );
                else
                    addOrUpdateReceivableEndPoint = chequesReceivablesService.createOrUpdatePdcReceivable(
                        vm.pdcReceivable
                    );

                vm.saving = true;
                addOrUpdateReceivableEndPoint.success(function () {
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
                    vm.pdcReceivable = data;

                    if (vm.pdcReceivable && vm.pdcReceivable.agreementId != null) {
                        vm.onAgreement = true;
                    }
                }).finally(function () {
                    vm.loading = false;
                });

            }

            function init() {

                vm.loading = true;
                getBankAccounts();
                vm.loading = false;
                getBillingMethods();
                getPdcReceivableForEdit();
            }

            init();
        }
    ]);
