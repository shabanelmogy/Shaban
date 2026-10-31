// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:385065-385242
appModule.controller('tenant.views.crs.receipts.vouchers.chargeTrafficFineModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.receiptSearch', 'abp.services.app.agreement', 'abp.services.app.commonAgreement',
        'abp.services.app.directory', 'abp.services.app.billingMethod', 'abp.services.app.trafficFine', 'fine', 'abp.services.app.bankAccount', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, $uibModalInstance, countryService, receiptSearchService, agreementService, commonAgreementService, directoryService, billingMethodService, trafficFineService, fine, bankAccountService, commonLookupService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.closedAgreements = false;
            vm.canChangeDate = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.CanChangeDate');
            vm.customers = [];
            vm.isShowCustomerInMissingFines = abp.features.isEnabled('CRS.CustomFeatures.ShowCustomerInMissingFines');
            vm.agreements = [];
            vm.billingMethods = [];
            vm.billingDetails = [];
            vm.amountMinValue = 100;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            // American Numbering System
            var th = ['', 'thousand', 'million', 'billion', 'trillion'];
            // uncomment this line for English Number System
            // var th = ['','thousand','million','milliard','billion'];
            var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']; var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']; var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
            function toWords(s) {
                s = s + '';
                s = s.replace(/[\, ]/g, ''); if (s != parseFloat(s)) return 'not a number'; var x = s.indexOf('.'); if (x == -1) x = s.length; if (x > 15) return 'too big'; var n = s.split(''); var str = ''; var sk = 0; for (var i = 0; i < x; i++) { if ((x - i) % 3 == 2) { if (n[i] == '1') { str += tn[Number(n[i + 1])] + ' '; i++; sk = 1; } else if (n[i] != 0) { str += tw[n[i] - 2] + ' '; sk = 1; } } else if (n[i] != 0) { str += dg[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1; } if ((x - i) % 3 == 1) { if (sk) str += th[(x - i - 1) / 3] + ' '; sk = 0; } } if (x != s.length) { var y = s.length; str += 'point '; for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' '; }
                return str.replace(/\s+/g, ' ') + 'only';
            }

            vm.amountChanged = function () {
                if (vm.receipt.amount == 0 || angular.isUndefined(vm.receipt.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.receipt.amountInWords = toWords(vm.receipt.amount);

            };

            vm.save = function () {

                var dateReceipt = new Date(vm.receipt.date);
                dateReceipt.setHours(0);
                dateReceipt.setMinutes(0);
                dateReceipt.setSeconds(0);
                vm.receipt.date = dateReceipt;
                vm.saving = true;

                if (vm.receipt.billingDetail.billingMethod.type == 2) {
                    vm.receipt.billingDetail.cheque = null;
                    vm.receipt.billingDetail.bankAccountId = null;
                    vm.receipt.billingDetail.creditCard.expiryDate = moment(vm.receipt.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                }
                else if (vm.receipt.billingDetail.billingMethod.type == 4) {
                    vm.receipt.billingDetail.creditCard = null;
                    vm.receipt.billingDetail.bankAccountId = null;
                    vm.receipt.billingDetail.cheque.chequeDate = moment(vm.receipt.billingDetail.cheque.chequeDate).startOf('day');
                    vm.receipt.billingDetail.cheque.status = 1;
                }
                else if (vm.receipt.billingDetail.billingMethod.type == 5) {
                    vm.receipt.billingDetail.creditCard = null;
                    vm.receipt.billingDetail.cheque = null;
                    if (!vm.isAccountsEnabled)
                        vm.receipt.billingDetail.bankAccountId = null;
                }
                else {
                    vm.receipt.billingDetail.cheque = null;
                    vm.receipt.billingDetail.creditCard = null;
                    vm.receipt.billingDetail.bankAccountId = null;
                }

                trafficFineService.chargeTrafficFine({
                    fineId: fine.id,
                    receiptEditDto: vm.receipt
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
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


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getAgreements(customerId) {
                vm.loading = true;
                var agreement = null;

                if (vm.closedAgreements == false) {
                    agreement = commonAgreementService.getOpenAgreementsOnCustomer({ id: customerId })
                }
                else {
                    agreement = commonAgreementService.getClosedAgreementsOnCustomer({ id: customerId })
                }
                agreement.success(function (data) {

                    vm.agreementsList = data.items;
                    if (vm.agreementsList.length == 0) {
                        vm.receipt.agreement = vm.agreementsList[0];
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            }
            function init() {
                getBankAccounts();
                receiptSearchService.getReceiptForEdit({
                    id: null
                }).success(function (result) {
                    vm.receipt = result;
                    vm.receipt.date = moment().utc();
                    vm.receipt.notes = 'Fine No: ' + fine.fineNo;
                    vm.receipt.amount = fine.amount;
                    vm.receipt.agreement = fine.agreement;
                    vm.receipt.agreementId = fine.agreementId;
                    if (vm.isShowCustomerInMissingFines) {
                        if (fine.contact) {
                            vm.receipt.contact = fine.contact;
                            vm.receipt.contactId = fine.contactId;
                        }
                        else {
                            vm.receipt.contact = fine.agreement.customer;
                            vm.receipt.contactId = fine.agreement.customerId;
                        }
                    }
                    else {
                        vm.receipt.contact = fine.agreement.customer;
                        vm.receipt.contactId = fine.agreement.customerId;
                    }
                    vm.amountChanged();
                });
            }

            init();
            getBillingMethods();
        }
    ]);
