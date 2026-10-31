// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:388617-390046
appModule.controller('tenant.views.crs.vouchers.receipts.createOrEditModal2', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.receipt', 'abp.services.app.receiptSearch', 'abp.services.app.commonAgreement', 'receiptId', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'agreement',
        'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.allocation', '$filter', 'abp.services.app.account', 'abp.services.app.vehicle', 'invoice', 'abp.services.app.job', 'abp.services.app.receiptChargesAllocation', 'abp.services.app.chargesSetting',
        function ($uibModal, $uibModalInstance, receiptService, receiptSearchService, commonAgreementService, receiptId, directoryService, billingMethodService, agreement, utilities,
            commonLookupService, appSession, allocationService, $filter, accountService, vehicleService, invoice, jobAppService, receiptChargesAllocationService, chargesSettingService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.closedAgreements = false;
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts');
            vm.allocationPermission = abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations');
            vm.canChangeDate = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.CanChangeDate');
            vm.oneReceiptOnMultipleAgreement = abp.features.isEnabled("CRS.CustomFeatures.OneReceiptOnMultipleAgreement");
            vm.customers = [];
            vm.agreements = [];
            vm.agreementAllocations = [];
            vm.generateAdvanceTaxInvoiceFromAdvanceTaxReceipt = utilities.parseBoolean(abp.setting.get("App.General.GenerateAdvanceTaxInvoiceFromAdvanceTaxReceipt"));
            vm.vehicles = [];
            vm.billingMethods = [];
            vm.billingDetails = [];
            vm.isCreditCardCommissionsEnabled = abp.features.isEnabled("CRS.Vouchers.CreditCardCommissions");
            vm.receiptTypes = [];
            vm.amountMinValue = 100;
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.autoCreditCardCommission = utilities.parseBoolean(abp.setting.get("App.General.AutoCreditCardCommission"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.manualReceiptNo = utilities.parseBoolean(abp.setting.get("App.General.ManualReceiptNo"));
            vm.receiptOnScreenAllocationWithReceivables = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithReceivables"));
            vm.receiptOnScreenAllocationWithTypesOfCharges = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithTypesOfCharges"));
            vm.fixedCreditCardCommissionInReceipt = utilities.parseBoolean(abp.setting.get("App.Speed.Common.FixedCreditCardCommissionInReceipt"));
            var agreementCategory = null;
            vm.makeCreditCardInfoRequiredInReceipt = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeCreditCardInfoRequiredInReceipt"));
            vm.isPostDatedChequeDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequeDirectlyToBank"));
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.allowReceiptOnScreenAllocationPartially = utilities.parseBoolean(abp.setting.get('App.Speed.Common.AllowReceiptOnScreenAllocationPartially'));
            vm.doNotAllowReceiptCreationWithoutAgreement = utilities.parseBoolean(abp.setting.get('App.Speed.Common.DoNotAllowReceiptCreationWithoutAgreement'));
            vm.receiptChargesTypeAllocationAgreementWise = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ChargesTypeWiseAllocationBasedOnDueAmounts"));
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isHRMDeductionEnabled = abp.features.isEnabled("HRM.Deductions");
            var includeChargesTypesSetting = true; //get from setting
            var currencyName = null;
            var decimalName = null;
            vm.chargesTypeAllocationAgreementWise = vm.doNotAllowReceiptCreationWithoutAgreement && vm.receiptChargesTypeAllocationAgreementWise;
            vm.chargesTypeAllocationAgreementWise = vm.doNotAlloweceiptCreationWithoutAgreement && vm.receiptChargesTypeAllocationAgreementWise;
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForReceipt");
            vm.documents = [];
            vm.isBankChargesPostingForBankTransferRV = abp.features.isEnabled("CRS.Vouchers.BankChargesPostingForBankTransferRV");
            vm.filters = {
                customerId: null,
                module: null
            };
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

            vm.locations = [];
            vm.saveAndPrint = false;
            vm.allocationData = null;
            var agreementId = null;
            vm.agreementId = null;
            if (agreement)
                agreementId = agreement.id;
            if (agreement)
                vm.agreementId = agreement.id;
            vm.contactCardsList = [];
            vm.hasContactCards = false;
            vm.showGeneralPayment = false;
            vm.isCurrentDateBigger = false;
            vm.showAdvanceOrLoanReceipt = false;
            vm.currentDate = moment().endOf('day');
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
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
            vm.billingMethodSelected = function () {

                /*if (vm.receipt.billingDetail.billingMethod.type == 2) {
                    billingMethodService.getDefaultCreditCard({ id: vm.receipt.contactId })
                        .success(function (result) {
                            if (!vm.isEditMod && result)
                                vm.receipt.billingDetail.creditCard = result;
                        });

                    if (vm.receipt.contact && vm.contactCardsList.length == 0) {
                        commonLookupService.getContactCards({ id: vm.receipt.contact.id })
                            .success(function (result) {
                                vm.contactCardsList = result;
                                vm.hasContactCards = vm.contactCardsList.length > 0;
                                var foundLines = $filter('filter')(vm.contactCardsList, {
                                    isDefault: true,
                                }, true);
                                if (foundLines.length > 0)
                                    foundLines[0].default = "Default";
                            });
                    }
                }*/
                if (vm.receipt.billingDetail.billingMethod.type != null) {
                    vm.receipt.amountWithoutCommission = vm.receipt.amount - vm.receipt.creditCardCommission;
                    if (vm.receipt.billingDetail.billingMethod.type == 2) {
                        billingMethodService.getDefaultCreditCard({ id: vm.receipt.contactId })
                            .success(function (result) {
                                if (!vm.isEditMod && result)
                                    vm.receipt.billingDetail.creditCard = result;
                            });

                        if (vm.receipt.contact && vm.contactCardsList.length == 0) {
                            commonLookupService.getContactCards({ id: vm.receipt.contact.id })
                                .success(function (result) {
                                    vm.contactCardsList = result;
                                    vm.hasContactCards = vm.contactCardsList.length > 0;
                                    var foundLines = $filter('filter')(vm.contactCardsList, {
                                        isDefault: true,
                                    }, true);
                                    if (foundLines.length > 0)
                                        foundLines[0].default = "Default";
                                });
                        }
                    }
                }
            };

            vm.onBillingMethodChange = function () {
                if (vm.receipt.billingDetail.billingMethod) {
                    vm.receipt.billingDetail.billingMethodId = vm.receipt.billingDetail.billingMethod.id;
                    if (vm.receipt.billingDetail.billingMethod.type === 2) {
                        vm.receipt.creditCardCommissionPercentage = vm.receipt.billingDetail.billingMethod.commissionPercent || 0;
                        vm.calculateCreditCardCommission();
                    }
                }
            };

            vm.receiptTypeChanged = function () {
                if (vm.receipt.voucherSubTypeId == 26) {
                    vm.showGeneralPayment = true;
                    vm.showAdvanceOrLoanReceipt = false;
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
                else if (vm.receipt.voucherSubTypeId == 69) {
                    vm.showGeneralPayment = false;
                    vm.showAdvanceOrLoanReceipt = false;
                    vm.receipt.contactId = null;
                    vm.receipt.contact = null;
                    vm.accountCategory = null;
                    vm.receipt.voucherLines = [];
                    vm.allocationData = null;

                    vm.receipt.amount = null;
                    vm.receipt.amountInWords = null;
                    vm.receipt.tax = null;

                }
                else if (vm.receipt.voucherSubTypeId == 1003 || vm.receipt.voucherSubTypeId == 1004) {
                    vm.showGeneralPayment = false;
                    vm.showAdvanceOrLoanReceipt = true;
                    vm.receipt.contactId = null;
                    vm.receipt.contact = null;
                    vm.accountCategory = null;
                    vm.receipt.voucherLines = [];
                    vm.allocationData = null;

                    vm.receipt.amount = null;
                    vm.receipt.amountInWords = null;
                    vm.receipt.tax = null;

                }
                else if (vm.receipt.voucherSubTypeId == 25) {
                    vm.showGeneralPayment = false;
                    vm.showAdvanceOrLoanReceipt = false;
                    vm.receipt.contactId = null;
                    vm.receipt.contact = null;
                    vm.accountCategory = null;
                    vm.receipt.voucherLines = [];
                    vm.allocationData = null;

                    vm.receipt.amount = null;
                    vm.receipt.amountInWords = null;
                    vm.receipt.tax = null;

                }
                else if (vm.receipt.voucherSubTypeId == 10) {
                    vm.showGeneralPayment = false;
                    vm.showAdvanceOrLoanReceipt = false;
                    vm.receipt.contactId = null;
                    vm.receipt.contact = null;
                    vm.accountCategory = null;
                    vm.receipt.voucherLines = [];
                    vm.allocationData = null;

                    vm.receipt.amount = null;
                    vm.receipt.amountInWords = null;
                    vm.receipt.tax = null;

                }
                else if (vm.receipt.voucherSubTypeId == 35) {
                    vm.showGeneralPayment = false;
                    vm.showAdvanceOrLoanReceipt = false;
                    vm.receipt.contactId = null;
                    vm.receipt.contact = null;
                    vm.accountCategory = null;
                    vm.receipt.voucherLines = [];
                    vm.allocationData = null;

                    vm.receipt.amount = null;
                    vm.receipt.amountInWords = null;
                    vm.receipt.tax = null;

                }
                else {
                    vm.showGeneralPayment = false;
                }
                if (vm.receipt.contact)
                    getAllocationData();
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

            function receiptLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                return line;
            }

            //Add row
            vm.addRow = function () {
                vm.receipt.voucherLines.push(receiptLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.receipt.voucherLines.indexOf(obj);
                vm.receipt.voucherLines.splice(index, 1);
                vm.calculateGeneralReceiptAmount();
            };

            function getReceiptTypes() {
                if (!vm.doNotAllowReceiptCreationWithoutAgreement || agreement) {
                    vm.receiptTypes.push({ voucherSubTypeId: 25, name: app.localize('ContactReceipt') });
                    vm.receiptTypes.push({ voucherSubTypeId: 10, name: app.localize('AdvanceReceipt') });
                }
                vm.receiptTypes.push({ voucherSubTypeId: 26, name: app.localize('GeneralReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 69, name: app.localize('StaffReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 72, name: app.localize('AdvanceTaxReceipt') });

                if (vm.isAssetsModuleEnabled) {
                    vm.receiptTypes.push({ voucherSubTypeId: 35, name: app.localize('AssetSaleReceipt') });
                }
                if (vm.isHRMDeductionEnabled) {
                    vm.receiptTypes.push({ voucherSubTypeId: 1003, name: app.localize('StaffAdvanceReceipt') });
                    vm.receiptTypes.push({ voucherSubTypeId: 1004, name: app.localize('StaffLoanReceipt') });
                }
            }

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

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
                else if (voucherSubTypeId == 1003) {
                    return app.localize('StaffAdvanceReceipt');
                }
                else if (voucherSubTypeId == 1004) {
                    return app.localize('StaffLoanReceipt');
                }
            }

            vm.amountWithoutCommissionChanged = () => {
                //if (vm.receipt) {
                //    vm.receipt.creditCardCommissionPercentage = 0;
                //    vm.receipt.creditCardCommission = 0;
                //}

                vm.receipt.amount = vm.receipt.amountWithoutCommission;

                vm.calculateCreditCardCommission();
                vm.amountChanged();
            }

            vm.contactCardSelected = function () {
                if (!vm.receipt.billingDetail.creditCard) {
                    vm.receipt.billingDetail.creditCard = {
                        expiryDate: vm.contactCard.expiry,
                        cardNoLastDigits: vm.contactCard.cardNoLastFourDigits
                    };
                }
                else {
                    vm.receipt.billingDetail.creditCard.expiryDate = vm.contactCard.expiry;
                    vm.receipt.billingDetail.creditCard.cardNoLastDigits = vm.contactCard.cardNoLastFourDigits;
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
            vm.agreementAmountChanged = function (agreementRow) {
                if (!vm.receipt.id) {
                    if (vm.receipt.amount > 0) {
                        var amountForAllocation = agreementRow.amount;
                        if (vm.allocationData) {


                            angular.forEach(vm.allocationData.allocations, function (line) {
                                if (agreementRow.agreementId == line.agreementId) {
                                    angular.forEach(line.subAllocations, function (subline) {

                                        if (subline.chargesTypeId == 22) {
                                            let sublineAllocated = subline.amount - subline.alreadyAllocated;
                                            if (sublineAllocated > 0) {
                                                subline.allocatedNow = sublineAllocated;
                                                amountForAllocation = amountForAllocation - subline.allocatedNow;
                                            }

                                            vm.addInHeadRow(subline, line)
                                        }

                                    });
                                    angular.forEach(line.subAllocations, function (subline) {

                                        if (subline.chargesTypeId != 22) {
                                            if (amountForAllocation > 0) {
                                                let sublineAllocated = subline.amount - subline.alreadyAllocated;
                                                if (sublineAllocated > 0) {
                                                    subline.allocatedNow = sublineAllocated;
                                                    if (subline.allocatedNow > amountForAllocation) {
                                                        subline.allocatedNow = amountForAllocation;
                                                        amountForAllocation = 0;

                                                    } else {
                                                        amountForAllocation = amountForAllocation - subline.allocatedNow;
                                                    }
                                                }
                                            } else {
                                                subline.allocatedNow = 0;

                                            }
                                            vm.addInHeadRow(subline, line);
                                        }

                                    });

                                }

                            });
                        }
                    }
                }

            }
            vm.amountChanged = function () {


                if (vm.receipt.amount == 0 || angular.isUndefined(vm.receipt.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = '';
                    return;
                }
                vm.receipt.amount = utilities.round(vm.receipt.amount, 2);
                if (vm.autoCalculateAmountInWords == "true") {
                    if (vm.isMultiCurrencyEnabled && vm.receipt.contact) {
                        currencyName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.name : null;
                        decimalName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.decimalName : null;
                    }
                    vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount, currencyName, decimalName);
                }

                vm.autoAllocation();
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

                //vm.receiptAmount = receiptAmount
                //vm.total = amount;
                //vm.remaining = receiptAmount - amount;

                return utilities.round(amount, 2);
            };


            vm.sumAmountAllocationChargesAgreement = function () {
                if (vm.receipt == null)
                    return 0;

                if (vm.receipt.receiptAllocationAgreementChargesForSave && vm.receipt.receiptAllocationAgreementChargesForSave.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.receipt.receiptAllocationAgreementChargesForSave, function (value) {

                    if (value.amount > 0)
                        amount = amount + value.amount;
                });

                //vm.receiptAmount = receiptAmount
                //vm.total = amount;
                //vm.remaining = receiptAmount - amount;

                return utilities.round(amount, 2);
            };



            vm.calculateCreditCardCommission = () => {
                if (isNaN(vm.receipt.amount)) {
                    vm.receipt.amount = 0;
                }
                if (isNaN(vm.receipt.amountWithoutCommission)) {
                    vm.receipt.amountWithoutCommission = 0;
                }
                if (isNaN(vm.receipt.creditCardCommissionPercentage)) {
                    vm.receipt.creditCardCommissionPercentage = 0;
                }
                if (isNaN(vm.receipt.creditCardCommission)) {
                    vm.receipt.creditCardCommission = 0;
                }

                if (vm.receipt.amountWithoutCommission >= 0 && vm.receipt.creditCardCommissionPercentage >= 0) {
                    if (!vm.showGeneralPayment) {
                        //vm.receipt.amount = vm.receipt.amount - vm.receipt.creditCardCommission;
                        vm.receipt.creditCardCommission = parseFloat(vm.receipt.creditCardCommissionPercentage) * (vm.receipt.amountWithoutCommission / 100);
                        vm.receipt.amount = vm.receipt.amountWithoutCommission + vm.receipt.creditCardCommission;
                    } /*else {
                        vm.totalGeneralReceiptAmount = vm.totalGeneralReceiptAmount - vm.receipt.creditCardCommission;
                        vm.receipt.creditCardCommission = parseFloat(vm.receipt.creditCardCommissionPercentage) * (vm.totalGeneralReceiptAmount / 100);
                        vm.totalGeneralReceiptAmount += vm.receipt.creditCardCommission;
                    }*/

                    vm.amountChanged();
                }
            }

            vm.isAgreementAllocationAmount = function () {
                var agreementTtotal = 0.0;
                vm.isEnableforAgAlo = false;
                angular.forEach(vm.agreementAllocations, function (agreementRow) {
                    agreementRow.allocatedNow = 0;

                    if (agreementRow.amount > 0)
                        agreementTtotal = agreementTtotal + agreementRow.amount;
                    angular.forEach(vm.allocationData.allocations, function (value, key) {

                        if (agreementRow.agreementId == value.agreementId) {
                            agreementRow.allocatedNow = agreementRow.allocatedNow + value.allocatedNow;
                        }

                    });
                    if (agreementRow.allocatedNow > agreementRow.amount)
                        vm.isEnableforAgAlo = true;
                    if (agreementTtotal > vm.receipt.amount)
                        vm.isEnableforAgAlo = true;



                });
                return false;
            }
            vm.sumTotalWithAllocation = function () {
                vm.isAgreementAllocationAmount();
                var amountToMatch = vm.receipt.amount + vm.receipt.tds;
                var chargesAllocationAmount = 0;
                if (vm.receiptOnScreenAllocationWithTypesOfCharges && !vm.chargesTypeAllocationAgreementWise)
                    chargesAllocationAmount = vm.sumAmountAllocationCharges();
                if (vm.receiptOnScreenAllocationWithTypesOfCharges && vm.chargesTypeAllocationAgreementWise)
                    chargesAllocationAmount = vm.sumAmountAllocationChargesAgreement();


                var allocationAmount = vm.receiptOnScreenAllocationWithReceivables == true ? vm.sumAmount() : 0;
                if (!vm.receiptOnScreenAllocationWithReceivables && !vm.receiptOnScreenAllocationWithTypesOfCharges)
                    return false;
                if (vm.receiptOnScreenAllocationWithReceivables && vm.receiptOnScreenAllocationWithTypesOfCharges)
                    //return !(vm.receipt.amount == (chargesAllocationAmount + allocationAmount));
                    return !(amountToMatch == chargesAllocationAmount) || vm.isEnableforAgAlo || (vm.allocationData.allocations.length > 0 && !(amountToMatch == (allocationAmount)));
                if (vm.receiptOnScreenAllocationWithReceivables)
                    return vm.allocationData.allocations.length > 0 && !(amountToMatch == (allocationAmount)) || vm.isEnableforAgAlo;
                if (vm.receiptOnScreenAllocationWithTypesOfCharges)
                    return !(amountToMatch == (chargesAllocationAmount)) || vm.isEnableforAgAlo;

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
                vm.totalGeneralReceiptAmount = utilities.round(vm.totalCredit - vm.totalDebit, 2);
                vm.autoAllocation();
                vm.amountChanged();
                vm.totalGeneralReceiptAmountInWords = utilities.toWords(vm.totalGeneralReceiptAmount, currencyName, decimalName);
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
                if (!$select.search)
                    return;

                var typeOfContact = null;
                // in case Asset Sale Receipt is selected
                if (vm.receipt && vm.receipt.voucherSubTypeId == 35) {
                    typeOfContact = 2;
                }
                // in case staff Receipt is selected
                if (vm.receipt && (vm.receipt.voucherSubTypeId == 69 || vm.receipt.voucherSubTypeId == 1003 || vm.receipt.voucherSubTypeId == 1004)) {
                    typeOfContact = 1;
                }
                //any contact (staff, customer, supplier)
                return directoryService.search({ keyword: $select.search, contactType: typeOfContact, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            function getChargesTypes() {
                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypesDistinct().success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
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
                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
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


            vm.addAgreement = function () {

                var line = new Object();
                line.agreementId = null;
                line.agreement = null;
                line.amount = 0;

                vm.agreementAllocations.push(line);
            }
            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {
                if ($select.search == '') return;
                vm.agreements = [];
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: vm.receipt.contact.id, agreementCategory: vm.enabledModule === 5 ? 4 : vm.enabledModule }).then(function (response) {
                    angular.forEach(response.data.items, function (subline) {
                        if (vm.agreementAllocations.some(e => e.agreementId == subline.id)) {
                        } else {
                            vm.agreements.push(subline);
                        }
                    });

                });
            };
            function getAgreementsAllocations() {

                allocationService.getAgreementsAllocations({ contactId: vm.receipt.contactId, voucherCategory: 2, VoucherId: receiptId, agreementId: null, IncludeChargesTypes: includeChargesTypesSetting }).success(
                    function (data) {

                        vm.agreementAllocations = data.agreementAllocations;

                    }).finally(function () {

                    });
            }
            function getAllocationData() {

                
                if (vm.receiptOnScreenAllocationWithReceivables && vm.receipt.voucherSubTypeId != 35 && vm.receipt.voucherSubTypeId != 69) {
                    vm.loading = true;
                    allocationService.getAllocationsForEdit2({ contactId: vm.receipt.contactId, voucherCategory: 2, VoucherId: receiptId, agreementId: vm.agreementId, IncludeChargesTypes: includeChargesTypesSetting, module: vm.filters.module}).success(
                        function (data) {

                            vm.allocationData = data;
                            vm.allocationDataOriginal = angular.copy(data);
                            if (!vm.agreementAllocations) {
                                vm.agreementAllocations = [];
                            }
                            if (invoice) {
                                var invoices = vm.allocationData.allocations.filter(e => e.voucherId == invoice.id);
                                if (invoices.length > 0) {
                                    invoices[0].allocatedNow = invoice.amount;
                                }
                            }
                            vm.autoAllocation();
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

                if (vm.receiptOnScreenAllocationWithReceivables && (vm.receipt.voucherSubTypeId == 35 || vm.receipt.voucherSubTypeId == 69)) {
                    vm.loading = true;
                    allocationService.getAllocationsForEdit({ contactId: vm.receipt.contactId, voucherCategory: 2, VoucherId: receiptId, agreementId: agreementId, IncludeChargesTypes: includeChargesTypesSetting, module: vm.filters.module }).success(
                        function (data) {

                            vm.allocationData = data;
                            if (invoice) {
                                var invoices = vm.allocationData.allocations.filter(e => e.voucherId == invoice.id);
                                if (invoices.length > 0) {
                                    invoices[0].allocatedNow = invoice.amount;
                                }
                            }

                        }).finally(function () {
                            vm.loading = false;
                        });
                }


                getAgreementsAllocations();
            };
            vm.autoAllocation = function () {
                if (vm.receipt.voucherSubTypeId == 72) {
                    vm.allocationData = angular.copy(vm.allocationDataOriginal);
                } else {
                    if (!(vm.oneReceiptOnMultipleAgreement && !(agreementId > 0))) {
                        if (!vm.receipt.id) {
                            if (vm.receipt.amount > 0) {
                                var amountForAllocation = vm.receipt.amount;
                                if (vm.allocationData) {
                                    angular.forEach(vm.allocationData.allocations, function (line) {
                                        angular.forEach(line.subAllocations, function (subline) {
                                            if (subline.chargesTypeId == 22) {
                                                let sublineAllocated = subline.amount - subline.alreadyAllocated;
                                                if (sublineAllocated > 0) {
                                                    subline.allocatedNow = sublineAllocated;
                                                    amountForAllocation = amountForAllocation - subline.allocatedNow;
                                                }

                                                vm.addInHeadRow(subline, line)
                                            }

                                        });

                                        angular.forEach(line.subAllocations, function (subline) {
                                            if (subline.chargesTypeId != 22) {
                                                if (amountForAllocation > 0) {
                                                    let sublineAllocated = subline.amount - subline.alreadyAllocated;
                                                    if (sublineAllocated > 0) {
                                                        subline.allocatedNow = sublineAllocated;
                                                        if (subline.allocatedNow > amountForAllocation) {
                                                            subline.allocatedNow = amountForAllocation;
                                                            amountForAllocation = 0;

                                                        } else {
                                                            amountForAllocation = amountForAllocation - subline.allocatedNow;
                                                        }
                                                    }
                                                } else {
                                                    subline.allocatedNow = 0;

                                                }
                                                vm.addInHeadRow(subline, line);
                                            }
                                        });
                                        if (line.voucherTypeId == 3) {
                                            if (amountForAllocation > 0) {
                                                let sublineAllocatedd = line.amount - line.alreadyAllocated;
                                                if (sublineAllocatedd > 0) {
                                                    line.allocatedNow = sublineAllocatedd;
                                                    if (line.allocatedNow > amountForAllocation) {
                                                        line.allocatedNow = amountForAllocation;
                                                        amountForAllocation = 0;

                                                    } else {
                                                        amountForAllocation = amountForAllocation - line.allocatedNow;
                                                    }
                                                }
                                            } else {
                                                line.allocatedNow = 0;

                                            }
                                        }

                                    });
                                }
                            }
                        }
                    }
                }


            }

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                });
            }
            vm.addInHeadRow = function (subAllocation, allocation) {
                allocation.allocatedNow = 0;
                angular.forEach(allocation.subAllocations, function (value, key) {
                    if (!value.allocatedNow)
                        value.allocatedNow = 0;


                    allocation.allocatedNow = allocation.allocatedNow + value.allocatedNow;
                });


                vm.isAgreementAllocationAmount();


            }
            vm.moduleChanged = function () {

                // Feature must be enabled
                if (!vm.moduleWiseReceivables) {
                    return;
                }

                // must have customer selected
                vm.filters.customerId = vm.receipt.customerId || vm.receipt.contactId;
                if (!vm.filters.customerId) {
                    abp.notify.warn("Please select customer first.");
                    return;
                }

                // agreement category from dropdown
                vm.filters.module = vm.enabledModule || null;
                vm.receipt.module = vm.enabledModule || null;

                // Call backend
                commonAgreementService.getAllAgreementsOnCustomer(vm.filters).then(function (result) {
                    if (!result || !result.data) {
                        vm.agreements = [];
                        return;
                    }

                    vm.agreements = result.data.items || result.data || [];
                });
                getAllocationData();
            };

            vm.addChargesType = function (allocation) {
                var line = new Object();
                line.chargesTypeId = null;
                line.amount = 0;
                if (allocation.subAllocations) {
                    allocation.subAllocations.push(line);
                } else {
                    allocation.subAllocations = [];
                    allocation.subAllocations.push(line);
                }

            }
            vm.onCustomerSelect = function (customer) {
                agreementId = null;
                vm.receipt.contactId = customer.id;
                vm.receipt.contact = customer;
                getAllocationData();
                vm.contactCardsList = [];
                vm.billingMethodSelected();
                //
                //if (vm.receipt.id > 0) {
                //    allocationService.deleteVoucherAllocations({ id: vm.receipt.id }).success(function () {
                //        getAllocationData();
                //    })
                //}
                //else getAllocationData();

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
                    if (vm.autoCalculateAmountInWords == "true") {
                        if (vm.isMultiCurrencyEnabled && vm.receipt.contact) {
                            currencyName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.name : null;
                            decimalName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.decimalName : null;
                        }
                        vm.receipt.amountInWords = utilities.toWords(sum, currencyName, decimalName);
                    }

                } else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = '';
                }

                vm.receipt.amount = sum;
                vm.receipt.debit = debitSum;
                vm.receipt.credit = creditSum;
            };

            vm.sumAmount = function () {
                vm.isAgreementAllocationAmount();
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


            //all contacts customers, suppliers, staff
            vm.searchCustomerPopoup = function () {

                if (vm.receipt && (vm.receipt.voucherSubTypeId == 69 || vm.receipt.voucherSubTypeId == 1003 || vm.receipt.voucherSubTypeId == 1004)) {
                    typeOfContact = 1;
                } else
                    typeOfContact = null;

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return typeOfContact;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {

                        vm.onCustomerSelect(result);
                    }
                });
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

                    // line.vehicleShow = false;
                    // line.vehicleId = null,
                    // line.vehicle = null;
                }

                line.taxCredit = 0;
                line.taxDebit = 0;
                // line.tax = 0;
                vm.sumReceiptAmount();
            };

            function getReceiptChargesForAllocationAgreement() {
                receiptChargesAllocationService
                    .getReceiptChargesAllocationsForAgreementEdit({ agreementId: agreement.id }).success(function (data) {
                        vm.receipt.receiptAllocationAgreementChargesForSave = data.allocations.items;
                    });
            }
            vm.dateNullOrNot = function () {
                if (vm.receipt.billingDetail.creditCard.expiryDate == false) {
                    vm.receipt.billingDetail.creditCard.expiryDate = "";
                }

            }
            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            function init() {
                vm.loading = true;
                console.log(" {{vm.makeCreditCardInfoRequiredInReceipt}}", vm.makeCreditCardInfoRequiredInReceipt);
                receiptSearchService.getReceiptForEdit({
                    id: receiptId
                }).success(function (result) {
                    vm.receipt = result;
                    vm.documents = vm.receipt.voucherDocuments;

                    if (!vm.agreementId)
                        vm.agreementId = vm.receipt.agreementId;

                    if (!receiptId) {
                        vm.receipt.voucherSubTypeId = 25; // by default contact receipt selection
                        if (vm.receiptOnScreenAllocationWithTypesOfCharges && vm.chargesTypeAllocationAgreementWise)
                            getReceiptChargesForAllocationAgreement();
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
                        vm.receipt.billingDetail.billingMethod.name = app.localize(vm.receipt.billingDetail.billingMethod.name);
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

                            if (agreement.due)
                                vm.receipt.amount = agreement.due;
                            vm.amountChanged();

                            getAllocationData();

                        }).finally(function () {
                            vm.loading = false;
                        })
                    }

                    if (vm.receipt.id > 0) {
                        vm.isEditMod = true;

                    } else {

                        if (invoice) {
                            vm.receipt.contact = invoice.contact;
                            vm.receipt.amount = invoice.dueAmount;

                            if (vm.isMultiCurrencyEnabled && vm.invoice.contact) {
                                currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                                decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                            }
                            vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount, currencyName, decimalName);

                            vm.receipt.contactId = invoice.contact.id;
                            vm.disableCustomer = true;
                            getAllocationData();
                        }
                        vm.isEditMod = false;
                    }
                }).finally(function () {
                    //vm.loading = false;
                });


            }
            vm.openAdvanceTaxInvoiceModal = function (invoiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateAdvanceTaxModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        advanceReceiptData: function () {
                            return {
                                customer: vm.receipt.contact,
                                details: vm.receipt.notes,
                                amount: vm.receipt.amount,
                                receiptId: vm.receipt.id,
                                agreementId: vm.receipt.agreementId
                            }
                        }
                    }
                });

            };
            vm.save = function () {



                if (vm.receipt.locationId == null || vm.receipt.locationId == 0) {
                    if (appSession.user.locationId != null)
                        vm.receipt.locationId = appSession.user.locationId;
                    else if (vm.locations.length == 1)
                        vm.receipt.locationId = vm.locations[0].id;
                }

                var dateReceipt = new Date(vm.receipt.date);
                dateReceipt.setHours(0);
                dateReceipt.setMinutes(0);
                dateReceipt.setSeconds(0);
                vm.receipt.date = dateReceipt;

                //For saving allocation
                if (vm.allocationData) {
                    var allocations = [];
                    angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                        allocations.push({
                            id: allocation.allocationId,
                            allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                            allocatedToVoucherLineId: allocation.voucherLineId,
                            amount: allocation.allocatedNow,
                            subAllocations: allocation.subAllocations
                        });
                    });

                    var anyNegativeDueAmount = utilities.checkNegativeDueAmounts(vm.allocationData.allocations);
                    if (anyNegativeDueAmount) {
                        abp.message.info("One or more due Amounts contain less than zero amount");
                        return;
                    }
                }

                var receiptAllocations = {
                    allocations: allocations,
                    agreementAllocations: vm.agreementAllocations
                };
                vm.receipt.receiptAllocations = receiptAllocations;
                vm.receipt.receiptChargesAllocationForSave = vm.receipt.receiptChargesAllocationForShow;
                if (vm.receipt.voucherSubTypeId == 72) {
                    vm.receipt.receiptAllocations = [];
                    vm.receipt.receiptChargesAllocationForSave = [];
                }

                vm.saving = true;
                if (vm.receipt.billingDetail.billingMethod.type == 2) {
                    vm.receipt.billingDetail.cheque = null;
                    vm.receipt.billingDetail.bankAccountId = null;
                    //vm.receipt.billingDetail.creditCard.expiryDate = moment(vm.receipt.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                    if (vm.makeCreditCardInfoRequiredInReceipt) {
                        vm.receipt.billingDetail.creditCard.expiryDate = moment(vm.receipt.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                    }
                }
                else if (vm.receipt.billingDetail.billingMethod.type == 4) {
                    vm.receipt.billingDetail.creditCard = null;
                    if (vm.isPostDatedChequeDirectlyToBankEnabled && vm.isCurrentDateBigger)
                        vm.receipt.billingDetail.bankAccountId = vm.receipt.billingDetail.bankAccount.id;
                    else
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
                vm.receipt.voucherDocuments = vm.documents;
                receiptService.createOrUpdateReceipt({
                    receipt: vm.receipt,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.receipt.id = result;
                    vm.receipt.printObj = {
                        id: vm.receipt.id,
                        printHeader: false
                    };
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.receipt);
                    $uibModalInstance.close();
                    if (vm.generateAdvanceTaxInvoiceFromAdvanceTaxReceipt) {
                        if (vm.receipt.voucherSubTypeId == 72) {
                            if (!(receiptId > 0)) {

                                vm.openAdvanceTaxInvoiceModal(null);
                            }
                        }
                    }
                }).finally(function () {
                    vm.saving = false;
                });


            };
            var saveAndPrint = function (r) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receipt: function () {
                            return r;
                        }
                    }
                });
            };

            vm.saveGeneralReceipt = function () {
                if (vm.locations.length == 1)
                    vm.receipt.locationId = vm.locations[0].id;

                vm.saving = true;
                var allocations = [];


                var paymentAllocations = {
                    allocations: allocations
                };

                vm.receipt.paymentAllocations = paymentAllocations;
                // CreditCard = 2,Cheque = 4,BankTransfer = 5,
                if (vm.receipt.billingDetail.billingMethod.type == 2) {
                    vm.receipt.billingDetail.cheque = null;
                    vm.receipt.billingDetail.bankAccountId = null;
                    //vm.receipt.billingDetail.creditCard.expiryDate = moment(vm.receipt.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                    if (vm.makeCreditCardInfoRequiredInReceipt) {
                        vm.receipt.billingDetail.creditCard.expiryDate = moment(vm.receipt.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                    }
                    //else {
                    //    vm.receipt.billingDetail.creditCard.expiryDate = "";
                    //}
                }
                else if (vm.receipt.billingDetail.billingMethod.type == 4) {
                    if (vm.isPostDatedChequeDirectlyToBankEnabled && vm.isCurrentDateBigger)
                        vm.receipt.billingDetail.bankAccountId = vm.receipt.billingDetail.bankAccount.id;
                    else
                        vm.receipt.billingDetail.bankAccountId = null;
                    //vm.receipt.billingDetail.bankAccountId = null;
                    vm.receipt.billingDetail.creditCard = null;
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
                    vm.receipt.billingDetail.bankAccountId = null;
                    vm.receipt.billingDetail.cheque = null;
                    vm.receipt.billingDetail.creditCard = null;
                }

                vm.receipt.voucherDocuments = vm.documents;
                receiptService.createOrUpdateReceiptPayment({ receipt: vm.receipt }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.receipt.id = result;
                    vm.receipt.printObj = {
                        id: vm.receipt.id,
                        printHeader: false
                    };
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.receipt);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

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
                if (vm.isAccountsEnabled)
                    getBankAccounts();
            }

            init();

            getChargesTypes();
            initializeFilters();
            getReceiptTypes();
        }
    ]);
