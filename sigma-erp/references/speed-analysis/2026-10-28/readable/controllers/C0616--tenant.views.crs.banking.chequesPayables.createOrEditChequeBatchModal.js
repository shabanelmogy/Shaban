// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:165221-165500
appModule.controller('tenant.views.crs.banking.chequesPayables.createOrEditChequeBatchModal', [
        '$scope', 'utilities', '$uibModalInstance', 'abp.services.app.bankAccount', '$uibModal', 'abp.services.app.chequesPayables', 'abp.services.app.directory', 'chequeBatchId', 'abp.services.app.billingMethod',
        function ($scope, utilities, $uibModalInstance, bankAccountService, $uibModal, chequesPayablesService, directoryService, chequeBatchId, billingMethodService) {

            var vm = this;
            vm.saving = false;
            vm.loading = false;
            vm.bankAccounts = null;
            vm.billingMethods = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.chequeBatch = {
                id: null,
                batchNo: null,
                date: moment(),
                refNo: null,
                supplierId: null,
                supplier: null,
                noOfCheques: 0,
                cheques: []
            };

            vm.searchCustomers = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 3, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchSupplierPopoup = function () {
                var modalInstance = openSearchContactModel(null, 3);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.chequeBatch.supplier = result;
                        vm.chequeBatch.supplierId = result.id;
                    }
                });
            };

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            // chequeNo ka trailing numeric part nikalta hai, taake auto increment ho sake
            // e.g. "CHQ-0091" -> { prefix: "CHQ-", number: 91, length: 4 }
            function splitChequeNo(chequeNo) {
                var match = /^(.*?)(\d+)$/.exec(chequeNo || '');
                if (!match) {
                    return { prefix: chequeNo || '', number: null, length: 0 };
                }
                return { prefix: match[1], number: parseInt(match[2], 10), length: match[2].length };
            }

            function padNumber(num, length) {
                var str = num.toString();
                while (str.length < length) {
                    str = '0' + str;
                }
                return str;
            }

            // pehli row ka cheque no change hone par baqi rows auto increment hongi
            vm.onFirstChequeNoChanged = function () {
                if (!vm.chequeBatch.cheques.length) return;
                var first = splitChequeNo(vm.chequeBatch.cheques[0].billingDetail.cheque.chequeNo);
                if (first.number === null) return; // numeric part na mile to auto increment skip

                for (var i = 1; i < vm.chequeBatch.cheques.length; i++) {
                    var nextNumber = first.number + i;
                    vm.chequeBatch.cheques[i].billingDetail.cheque.chequeNo = first.prefix + padNumber(nextNumber, first.length);
                }
            };

            // pehli row ka amount change hone par baqi sab rows me wahi amount copy ho jata hai
            vm.onFirstAmountChanged = function () {
                if (!vm.chequeBatch.cheques.length) return;
                var firstAmount = vm.chequeBatch.cheques[0].amount;

                for (var i = 1; i < vm.chequeBatch.cheques.length; i++) {
                    vm.chequeBatch.cheques[i].amount = firstAmount;
                }
            };

            // pehli row ka bank account change hone par baqi sab rows me wahi bank copy ho jata hai
            vm.onFirstBankAccountChanged = function () {
                if (!vm.chequeBatch.cheques.length) return;
                var firstBank = vm.chequeBatch.cheques[0].billingDetail.cheque.bankAccount;
                var firstBankId = vm.chequeBatch.cheques[0].billingDetail.cheque.bankAccountId;

                for (var i = 1; i < vm.chequeBatch.cheques.length; i++) {
                    vm.chequeBatch.cheques[i].billingDetail.cheque.bankAccount = firstBank;
                    vm.chequeBatch.cheques[i].billingDetail.cheque.bankAccountId = firstBankId;
                }
            };

            // pehli row ka payment method change hone par baqi sab rows me wahi method copy ho jata hai
            vm.onFirstBillingMethodChanged = function () {
                if (!vm.chequeBatch.cheques.length) return;
                var firstMethod = vm.chequeBatch.cheques[0].billingDetail.billingMethod;
                var firstMethodId = vm.chequeBatch.cheques[0].billingDetail.billingMethodId;

                for (var i = 1; i < vm.chequeBatch.cheques.length; i++) {
                    vm.chequeBatch.cheques[i].billingDetail.billingMethod = firstMethod;
                    vm.chequeBatch.cheques[i].billingDetail.billingMethodId = firstMethodId;
                }
            };

            // naye rows add hone par (NoOfCheques ya Add button se), agr pehli row already bhari hui hai
            // to naye rows me bhi wahi chequeNo(increment)/amount/bankAccount/paymentMethod copy kr dena
            function applyFirstRowDefaultsToNewRows() {
                if (!vm.chequeBatch.cheques.length) return;
                var first = vm.chequeBatch.cheques[0];
                if (first.billingDetail.cheque.chequeNo) vm.onFirstChequeNoChanged();
                if (first.amount) vm.onFirstAmountChanged();
                if (first.billingDetail.cheque.bankAccountId) vm.onFirstBankAccountChanged();
                if (first.billingDetail.billingMethodId) vm.onFirstBillingMethodChanged();
            }

            // batch date ki base par har row ki chequeDate month-wise increment hoti hai
            function recalculateDates() {
                var baseDate = vm.chequeBatch.date ? moment(vm.chequeBatch.date) : moment();
                angular.forEach(vm.chequeBatch.cheques, function (row, index) {
                    row.billingDetail.cheque.chequeDate = moment(baseDate).add(index, 'months');
                });
            }

            // PdcPayableInput ke shape ke mutabiq nayi row banata hai
            function newRow(index) {
                return {
                    id: null,
                    contactId: null,
                    amount: null,
                    notes: null,
                    batchNo: null,
                    billingDetail: {
                        billingMethodId: null,
                        billingMethod: null,
                        cheque: {
                            chequeNo: null,
                            chequeDate: moment(vm.chequeBatch.date).add(index, 'months'),
                            bankAccountId: null,
                            bankAccount: null
                        }
                    }
                };
            }

            vm.onDateChanged = function () {
                recalculateDates();
            };

            // NoOfCheques number field change hone par rows add/remove hongi
            vm.onNoOfChequesChanged = function () {
                var target = parseInt(vm.chequeBatch.noOfCheques, 10) || 0;
                var current = vm.chequeBatch.cheques.length;

                if (target > current) {
                    for (var i = current; i < target; i++) {
                        vm.chequeBatch.cheques.push(newRow(i));
                    }
                } else if (target < current) {
                    // end se extra rows hata do
                    vm.chequeBatch.cheques.splice(target, current - target);
                }

                recalculateDates();
                applyFirstRowDefaultsToNewRows();
            };

            // "+ Add ChequeNo" button - ek row manually add karta hai aur NoOfCheques ko sync karta hai
            vm.addRow = function () {
                vm.chequeBatch.cheques.push(newRow(vm.chequeBatch.cheques.length));
                vm.chequeBatch.noOfCheques = vm.chequeBatch.cheques.length;

                applyFirstRowDefaultsToNewRows();
            };

            // row ke trash icon se ek row hatati hai aur NoOfCheques ko sync karta hai
            vm.removeRow = function (index) {
                vm.chequeBatch.cheques.splice(index, 1);
                vm.chequeBatch.noOfCheques = vm.chequeBatch.cheques.length;
            };

            vm.getTotalAmount = function () {
                var total = 0;
                angular.forEach(vm.chequeBatch.cheques, function (row) {
                    total += parseFloat(row.amount) || 0;
                });
                return total;
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
            }

            function getChequeBatchForEdit() {
                if (!chequeBatchId) return;

                vm.loading = true;
                chequesPayablesService.getChequeBatchForEdit({ id: chequeBatchId }).success(function (data) {
                    vm.chequeBatch = data;
                    vm.chequeBatch.date = moment(data.date);
                    angular.forEach(vm.chequeBatch.cheques, function (row) {
                        row.billingDetail.cheque.chequeDate = moment(row.billingDetail.cheque.chequeDate);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.save = function () {
                vm.saving = true;

                // vm.chequeBatch ko mutate nahi karna - warna save fail hone par
                // supplier/bankAccount/paymentMethod dropdowns UI me khaali dikhne lagte hain.
                // is liye submission ke liye ek alag copy banate hain.
                var payload = angular.copy(vm.chequeBatch);
                payload.supplier = null;

                angular.forEach(payload.cheques, function (row) {
                    if (row.billingDetail.cheque.bankAccount) {
                        row.billingDetail.cheque.bankAccountId = row.billingDetail.cheque.bankAccount.id;
                        row.billingDetail.cheque.bankAccount = null;
                    }
                    if (row.billingDetail.billingMethod) {
                        row.billingDetail.billingMethodId = row.billingDetail.billingMethod.id;
                        row.billingDetail.billingMethod = null;
                    }
                });

                chequesPayablesService.createOrUpdateChequeBatch(payload)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                getBankAccounts();
                getBillingMethods();
                if (chequeBatchId) {
                    getChequeBatchForEdit();
                }
            }

            init();
        }
    ]);
