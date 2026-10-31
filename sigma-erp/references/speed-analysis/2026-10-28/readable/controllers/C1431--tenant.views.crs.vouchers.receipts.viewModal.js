// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:393426-394137
appModule.controller('tenant.views.crs.vouchers.receipts.viewModal', [
        '$uibModalInstance', 'abp.services.app.receiptSearch', 'abp.services.app.commonAgreement', 'receiptId', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'agreement',
        'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.allocation', '$filter', 'abp.services.app.account', 'abp.services.app.vehicle', '$uibModal',
        function ($uibModalInstance, receiptSearchService, commonAgreementService, receiptId, directoryService, billingMethodService, agreement, utilities,
            commonLookupService, appSession, allocationService, $filter, accountService, vehicleService, $uibModal) {
            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.oneReceiptOnMultipleAgreement = abp.features.isEnabled("CRS.CustomFeatures.OneReceiptOnMultipleAgreement");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.closedAgreements = false;
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts');
            vm.showTransactionRrnNo = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.NoonPayments');
            vm.allocationPermission = abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations');
            vm.customers = [];
            vm.agreements = [];
            vm.vehicles = [];
            vm.billingMethods = [];
            vm.billingDetails = [];
            vm.receiptTypes = [];
            vm.documents = [];
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForReceipt");
            vm.amountMinValue = 100;
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.manualReceiptNo = utilities.parseBoolean(abp.setting.get("App.General.ManualReceiptNo"));
            vm.receiptOnScreenAllocationWithReceivables = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithReceivables"));
            vm.receiptOnScreenAllocationWithTypesOfCharges = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithTypesOfCharges"));
            vm.isPostDatedChequeDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequeDirectlyToBank"));
            vm.staffFineReceipt = utilities.parseBoolean(abp.setting.get("App.Speed.Common.StaffFineReceipt"));
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isCreditCardCommissionsEnabled = abp.features.isEnabled("CRS.Vouchers.CreditCardCommissions");
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isBankChargesPostingForBankTransferRV = abp.features.isEnabled("CRS.Vouchers.BankChargesPostingForBankTransferRV");
            vm.commissionForBankTransfer = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CommissionForBankTransfer"));
            vm.locations = [];
            vm.allocationData = null;
            var agreementId = null;
            vm.contactCardsList = [];
            vm.hasContactCards = false;
            vm.showGeneralPayment = false;
            vm.isCurrentDateBigger = false;
            vm.currentDate = moment().endOf('day');
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.addVatForCCC = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AddVATamountforCreditCardCommissioninReceipt"));
            vm.isHRMDeductionEnabled = abp.features.isEnabled("HRM.Deductions");

            //changing for debit card
            vm.isDebitCardEnabled = "true";
            //changing for debit card
            vm.billingMethodSelected = function () {
                var isCardPayment = vm.receipt.billingDetail.billingMethod.type == 2 || vm.receipt.billingDetail.billingMethod.type == 3;

                if (isCardPayment && vm.receipt.contact && vm.contactCardsList.length == 0) {
                    commonLookupService.getContactCards({ id: vm.receipt.contact.id })
                        .success(function (result) {
                            vm.contactCardsList = result;
                            vm.hasContactCards = vm.contactCardsList.length > 0;

                            var foundLines = $filter('filter')(vm.contactCardsList, {
                                isDefault: true,
                            }, true);

                            if (foundLines.length > 0) {
                                foundLines[0].default = "Default";
                            }
                        });
                }
            };
            function getAgreementsAllocations() {

                allocationService.getAgreementsAllocations({ voucherId: receiptId }).success(
                    function (data) {

                        vm.agreementAllocations = data.agreementAllocations;

                    }).finally(function () {

                    });
            }
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };
            vm.receiptTypeChanged = function () {
                if (vm.receipt.voucherSubTypeId == 26) {
                    vm.showGeneralPayment = true;
                    vm.receipt.contactId = null;
                    vm.receipt.contact = null;
                    vm.accountCategory = null;
                    vm.receipt.voucherLines = [];
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.receipt.amount = null;
                    vm.receipt.amountInWords = null;
                    vm.receipt.tax = null;
                }
                else {
                    vm.showGeneralPayment = false;
                }
            };

            // Searching Accounts
            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true, accountCategory: vm.accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            function getReceiptTypes() {
                vm.receiptTypes.push({ voucherSubTypeId: 25, name: app.localize('ContactReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 26, name: app.localize('GeneralReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 10, name: app.localize('AdvanceReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 69, name: app.localize('StaffReceipt') });
                if (vm.isAssetsModuleEnabled) {
                    vm.receiptTypes.push({ voucherSubTypeId: 35, name: app.localize('AssetSaleReceipt') });
                }
                if (vm.isHRMDeductionEnabled) {
                    vm.receiptTypes.push({ voucherSubTypeId: 1003, name: app.localize('StaffAdvanceReceipt') });
                    vm.receiptTypes.push({ voucherSubTypeId: 1004, name: app.localize('StaffLoanReceipt') });
                }
            }

            vm.getReceiptTypeName = function (voucherSubTypeId) {
                if (voucherSubTypeId == 25) {
                    return app.localize('ContactReceipt');
                }
                else if (voucherSubTypeId == 26) {
                    return app.localize('GeneralReceipt');
                }
                else if (voucherSubTypeId == 10) {
                    return app.localize('AdvanceReceipt');
                }
                else if (voucherSubTypeId == 35) {
                    return app.localize('AssetSaleReceipt');
                }
                else if (voucherSubTypeId == 69) {
                    return app.localize('StaffReceipt');
                }
                else if (voucherSubTypeId == 72) {
                    return app.localize('AdvanceTaxReceipt');
                }
                else if (voucherSubTypeId == 117) {
                    return app.localize('StaffFineReceipt');
                }
                else if (voucherSubTypeId == 1003) {
                    return app.localize('StaffAdvanceReceipt');
                }
                else if (voucherSubTypeId == 1004) {
                    return app.localize('StaffLoanReceipt');
                }
            }

            //changing for debit card
            vm.contactCardSelected = function () {
                var expiry = vm.contactCard.expiry;
                var last4Digits = vm.contactCard.cardNoLastFourDigits;

                if (vm.receipt.billingDetail.billingMethod.type === 2) { // Credit Card
                    if (!vm.receipt.billingDetail.creditCard) {
                        vm.receipt.billingDetail.creditCard = {
                            expiryDate: expiry,
                            cardNoLastDigits: last4Digits
                        };
                    } else {
                        vm.receipt.billingDetail.creditCard.expiryDate = expiry;
                        vm.receipt.billingDetail.creditCard.cardNoLastDigits = last4Digits;
                    }
                } else if (vm.receipt.billingDetail.billingMethod.type === 3) { // Debit Card
                    if (!vm.receipt.billingDetail.debitCard) {
                        vm.receipt.billingDetail.debitCard = {
                            expiryDate: expiry,
                            cardNoLastDigits: last4Digits
                        };
                    } else {
                        vm.receipt.billingDetail.debitCard.expiryDate = expiry;
                        vm.receipt.billingDetail.debitCard.cardNoLastDigits = last4Digits;
                    }
                }

                vm.showContactCardDropDown = false;
            };

            vm.localize = function (key) {
                if (key == null)
                    return '';
                return app.localize(key);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.amountChanged = function () {
                if (vm.receipt.amount == 0 || angular.isUndefined(vm.receipt.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount);

            };

            vm.sumAmountAllocationCharges = function () {
                if (vm.receipt == null)
                    return 0;

                if (vm.receipt.receiptChargesAllocationForShow.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.receipt.receiptChargesAllocationForShow, function (value, key) {

                    if (value.amount > 0)
                        amount = amount + value.amount;
                });
                return utilities.round(amount, 2);
            };

            vm.sumTotalWithAllocation = function () {

                var chargesAllocationAmount = vm.receiptOnScreenAllocationWithTypesOfCharges == true ? vm.sumAmountAllocationCharges() : 0;
                var allocationAmount = vm.receiptOnScreenAllocationWithReceivables == true ? vm.sumAmount() : 0;
                if (!vm.receiptOnScreenAllocationWithReceivables && !vm.receiptOnScreenAllocationWithTypesOfCharges)
                    return false;
                if (vm.receiptOnScreenAllocationWithReceivables && vm.receiptOnScreenAllocationWithTypesOfCharges)
                    //return !(vm.receipt.amount == (chargesAllocationAmount + allocationAmount));
                    return !(vm.receipt.amount == chargesAllocationAmount) || (vm.allocationData.allocations.length > 0 && !(vm.receipt.amount == (allocationAmount)));
                if (vm.receiptOnScreenAllocationWithReceivables)
                    return vm.allocationData.allocations.length > 0 && !(vm.receipt.amount == (allocationAmount));
                if (vm.receiptOnScreenAllocationWithTypesOfCharges)
                    return !(vm.receipt.amount == (chargesAllocationAmount));

                return true;
            };

            vm.calculateGeneralReceiptAmount = function () {
                vm.totalGeneralReceiptAmount = 0;
                vm.totalDebit = 0;
                vm.totalCredit = 0;

                vm.receipt.voucherLines.forEach(function (line) {

                    if (!line.hidden) {
                        vm.totalDebit = vm.totalDebit + parseFloat(line.debit ? line.debit : 0);
                        vm.totalCredit = vm.totalCredit + parseFloat(line.credit ? line.credit : 0);
                    }

                    //
                });
                vm.totalGeneralReceiptAmount = vm.receipt.amount; //(vm.totalCredit - vm.totalDebit);
                vm.totalGeneralReceiptAmountInWords = utilities.toWords(vm.totalGeneralReceiptAmount);
                //alert(vm.totalCredit); alert(vm.totalDebit);
            }

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

            vm.searchCustomers = function ($select) {
                var typeOfContact = null;
                // in case Asset Sale Receipt is selected
                if (vm.receipt.voucherSubTypeId == 35) {
                    typeOfContact = 2;
                }
                //any contact (staff, customer, supplier)
                return directoryService.search({ keyword: $select.search, contactType: typeOfContact, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // Searching Contacts
            vm.searchContactGeneralPayment = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
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
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            // Vehicle Search
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            //function getCurrencies() {
            //    commonLookupService.getCurrencies({}).success(function (data) {
            //        vm.currencies = data.items;
            //    });
            //};

            function getAllocationData() {

                if (vm.receiptOnScreenAllocationWithReceivables) {
                    vm.loading = true;

                    if (vm.isAllocationWithChargesTypeEnabled && vm.receipt.voucherSubTypeId != 35) {
                        allocationService.getAllocationsForEdit2({ contactId: vm.receipt.contactId, voucherCategory: 2, VoucherId: receiptId, agreementId: agreementId }).success(
                            function (data) {

                                vm.allocationData = data;

                            }).finally(function () {
                                vm.loading = false;
                            });
                    } else {
                        allocationService.getAllocationsForEdit({ contactId: vm.receipt.contactId, voucherCategory: 2, VoucherId: receiptId, agreementId: agreementId }).success(
                            function (data) {

                                vm.allocationData = data;

                            }).finally(function () {
                                vm.loading = false;
                            });

                    }



                }
                getAgreementsAllocations();
            };

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            }

            vm.onCustomerSelect = function (customer) {
                agreementId = null;
                vm.receipt.contactId = customer.id;
                vm.receipt.contact = customer;
                getAllocationData();
                vm.contactCardsList = [];
                vm.billingMethodSelected();
            };

            vm.sumReceiptAmount = function () {

                if (vm.receipt == null)
                    return 0;

                if (vm.receipt.voucherLines == null)
                    return 0;
                var sum = 0;
                var debitSum = 0;
                var creditSum = 0;
                for (var i = 0; i < vm.receipt.voucherLines.length; i++) {
                    if (vm.receipt.voucherLines[i].debit != null && !vm.receipt.voucherLines[i].hidden)
                        debitSum = debitSum + utilities.round(vm.receipt.voucherLines[i].debit, 2);
                    if (vm.receipt.voucherLines[i].taxDebit && !vm.receipt.voucherLines[i].hidden) {
                        debitSum = debitSum + utilities.round(vm.receipt.voucherLines[i].taxDebit, 2);
                        vm.receipt.voucherLines[i].tax = vm.receipt.voucherLines[i].taxDebit;
                    }
                    debitSum = utilities.round(debitSum, 2);

                    if (vm.receipt.voucherLines[i].credit != null && !vm.receipt.voucherLines[i].hidden)
                        creditSum = creditSum + utilities.round(vm.receipt.voucherLines[i].credit, 2);
                    if (vm.receipt.voucherLines[i].taxCredit && !vm.receipt.voucherLines[i].hidden) {
                        creditSum = creditSum + utilities.round(vm.receipt.voucherLines[i].taxCredit, 2);
                        vm.receipt.voucherLines[i].tax = vm.receipt.voucherLines[i].taxCredit;
                    }
                    creditSum = utilities.round(creditSum, 2);
                }
                sum = creditSum - debitSum;


                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = utilities.toWords(sum);
                } else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = '';
                }

                //vm.receipt.amount = sum; //commented to show actual amount saved in voucher
                vm.receipt.debit = debitSum;
                vm.receipt.credit = creditSum;
            };

            vm.sumAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {

                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });

                return utilities.round(amount, 2);
            };

            vm.accountChangedGeneralPayment = function (line) {
                line.contact = null;
                if ((line.account.accountCategory == 4 || line.account.accountCategory == 5) && vm.taxPercent > 0 && !vm.isTaxInclusive) {
                    line.showTax = true;
                    if (line.debit > 0)
                        line.showDebitField = true;
                    else if (line.credit > 0)
                        line.showCreditField = true;
                }
                else {
                    line.showTax = false;
                }
                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory == 4 || line.account.accountCategory == 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }

                if (line.account.contactGroup != null) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null,
                        line.vehicle = null;
                    line.account.contactGroupId = null;
                    line.accountId = line.account.id;
                    if (!line.account.contactGroup.isDefault)
                        line.account.contactGroupId = line.account.contactGroup.id;
                    if (line.account.contactGroup.contactType == 1) {
                        line.showContactMessage = "Please Select Staff";
                    }
                    if (line.account.contactGroup.contactType == 2) {
                        line.showContactMessage = "Please Select Customer";
                    }
                    if (line.account.contactGroup.contactType == 3) {
                        line.showContactMessage = "Please Select Supplier";
                    }
                }
                else {
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                }
                line.taxCredit = 0;
                line.taxDebit = 0;
                vm.sumReceiptAmount();
            };

            vm.openprintModal = function (id) {
                commonLookupService.validateCheque(receipt.id).success(function (data) {
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
                                    return id;
                                }
                            }
                        });
                    }
                });
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            function getModuleNameById(id) {
                switch (id) {
                    case 1: return 'Rental';
                    case 2: return 'Lease';
                    case 3: return 'Limousine';
                    case 4: return 'Transportation';
                    case 5: return 'Chauffeur';
                    case 6: return 'Workshop';
                    case 7: return 'Equipment';
                    case 8: return 'Accessories Rental';
                    case 9: return 'Sales';
                    default: return 'Unknown';
                }
            }
            function init() {
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

                vm.loading = true;
                receiptSearchService.getReceiptForEdit({
                    id: receiptId
                }).success(function (result) {
                    vm.receipt = result;
                    if (vm.receipt && vm.receipt.voucherLines && vm.receipt.voucherLines.length > 0) {
                        // Get the moduleId from the first voucher line that has a module
                        var lineWithModule = vm.receipt.voucherLines.find(function (v) { return v.module != null; });
                        var moduleId = lineWithModule ? lineWithModule.module : null;

                        if (moduleId) {
                            // Keep only that module in the modules array for display
                            vm.modules = [{
                                id: moduleId,
                                name: getModuleNameById(moduleId) // you should have a function to get module name by id
                            }];

                            // Set it as selected
                            vm.enabledModule = moduleId;
                        }
                    } else {
                        // fallback in case there are no voucher lines
                        vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;
                    }

                    vm.documents = vm.receipt.voucherDocuments;

                    if (!receiptId) {
                        vm.receipt.voucherSubTypeId = 25; // by default contact receipt selection
                    }
                    if (vm.manualReceiptNo)
                        vm.receipt.voucherNo = parseInt(vm.receipt.voucherNo);
                    if (vm.receipt.contactId) {
                        getAllocationData();
                    }
                    if (vm.receipt.billingDetail.billingMethodId == 0)
                        vm.receipt.billingDetail.billingMethodId = null;
                    if (vm.receipt.voucherNo <= 0)
                        vm.receipt.voucherNo = null;
                    if (vm.receipt.billingDetail.bankAccountId && vm.receipt.billingDetail.cheque != null)
                        vm.isCurrentDateBigger = true;
                    if (vm.receipt.id > 0) {
                        vm.isEditMod = true;
                        if (vm.isMultiCurrencyEnabled) {
                            commonLookupService.getCurrenciesAll().success(function (data) {
                                vm.currencies = data.items;
                            });
                        }
                        vm.receipt.billingDetail.billingMethod.name = app.localize(vm.receipt.billingDetail.billingMethod.name);
                        if (vm.isCreditCardCommissionsEnabled && vm.receipt.creditCardCommission > 0) {
                            vm.receipt.amountWithoutCommission = vm.receipt.amount - vm.receipt.creditCardCommission;
                            if (vm.addVatForCCC) {
                                vm.receipt.amountWithoutCommission = vm.receipt.amountWithoutCommission - vm.receipt.creditCardCommissionVatAmount;
                                
                            }
                        }
                        vm.billingMethodSelected();
                        if (vm.receipt.voucherSubTypeId == 26) {
                            vm.receiptType = app.localize('GeneralReceipt');
                            vm.showGeneralPayment = true;
                            vm.contactTypeLabel = app.localize("Customer");
                            vm.contactType = 2;
                            vm.accountCategory = null;
                            angular.forEach(vm.receipt.voucherLines, function (value, key) {
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0) {
                                    value.contactShow = true;

                                }

                                if (!value.contactId)
                                    vm.accountChangedGeneralPayment(value);
                                if (!value.hidden) {
                                    if (value.debit > 0)
                                        value.taxDebit = value.tax;
                                    if (value.credit > 0)
                                        value.taxCredit = value.tax;
                                }
                                vm.sumAmount();
                            })
                            vm.calculateGeneralReceiptAmount();
                        }
                    }
                    else {
                        vm.receipt.locationId = appSession.user.locationId;
                    }
                    if (agreement) {
                        vm.loading = true;
                        commonAgreementService.getAgreement({
                            id: agreement.id,
                            includeCustomer: true
                        }).success(function (data) {
                            vm.receipt.agreement = data;
                            vm.receipt.agreement.locationId = data.locationId;
                            vm.receipt.contact = data.customer;
                            vm.receipt.agreementId = data.id;
                            vm.receipt.contactId = vm.receipt.contact.id;
                            vm.disableCustomer = true;
                            vm.disableAgreement = true;
                            vm.showAgreement = true;
                            agreementId = agreement.id;
                            getAllocationData();
                        }).finally(function () {
                            vm.loading = false;
                        })
                    }

                    if (vm.receipt.id > 0) {
                        vm.isEditMod = true;

                    } else {
                        vm.isEditMod = false;
                    }
                }).finally(function () {
                    //vm.loading = false;
                });
            }





            vm.checkCurrentDate = function () {
                if (vm.currentDate >= vm.receipt.billingDetail.cheque.chequeDate) {
                    vm.isCurrentDateBigger = true;
                } else {
                    vm.isCurrentDateBigger = false;
                }
            };

            function initializeFilters() {
                getBillingMethods();
                getLocations();
                //getCurrencies();
                  
                if (vm.isAccountsEnabled)
                    getBankAccounts();
            }

            init();
            initializeFilters();
            getReceiptTypes();
        }
    ]);
