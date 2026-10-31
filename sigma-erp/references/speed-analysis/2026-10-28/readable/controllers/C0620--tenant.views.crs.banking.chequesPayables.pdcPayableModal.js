// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:166263-166383
appModule.controller('tenant.views.crs.banking.chequesPayables.pdcPayableModal', [
        '$scope','utilities', '$uibModalInstance', 'abp.services.app.bankAccount', 'utilities', '$uibModal', 'abp.services.app.chequesPayables', 'abp.services.app.billingMethod', 'abp.services.app.directory', 'chequeId',
        function ($scope, utilities,$uibModalInstance, bankAccountService, utilities, $uibModal, chequesPayablesService, billingMethodService, directoryService, chequeId) {

            var vm = this;
            vm.saving = false;
            //  vm.receipt = receipt;
            vm.bankAccounts = null;
            vm.pdcPayable = {};
            vm.mandatoryBatchNoCP = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MandatoryBatchNoCP"));
            vm.additionalBatchNoCP = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AdditionalBatchNoCP"));
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
                        vm.pdcPayable.contact = result;
                        vm.pdcPayable.contactId = result.id;
                    }
                });
            };
            vm.save = function () {
                vm.saving = true;

                vm.pdcPayable.creditCard = null;
                vm.pdcPayable.billingDetail.cheque.bankName = vm.pdcPayable.billingDetail.cheque.bankAccount.bankName;
                vm.pdcPayable.billingDetail.cheque.bankAccount = null;

                if (chequeId) {
                    chequesPayablesService.updatePdcPayable(
                        vm.pdcPayable
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    chequesPayablesService.createOrUpdatePdcPayable(
                        vm.pdcPayable
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBankAccounts() {
                vm.loading = true;
                bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                    vm.bankAccounts = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 2, type: 4 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            getPdcPayableForEdit = function () {
                if (!chequeId)
                    return;

                vm.loading = true;
                chequesPayablesService.getPdcPayableForEdit({ id: chequeId }).success(function (data) {
                    vm.pdcPayable = data;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            function init() {
                vm.loading = true;
                getBankAccounts();
                vm.loading = false;
                getBillingMethods();
                getPdcPayableForEdit();
            }

            init();
        }
    ]);
