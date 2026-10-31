// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:385245-386825
appModule.controller('tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.receipt', 'abp.services.app.receiptSearch', 'abp.services.app.commonAgreement', 'receiptId', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'agreement',
        'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.allocation', '$filter', 'abp.services.app.account', 'abp.services.app.vehicle', 'invoice', 'abp.services.app.job', 'abp.services.app.receiptChargesAllocation',
        'abp.services.app.stripeBilling', 'abp.services.app.currency',
        function ($scope, $uibModal, $uibModalInstance, receiptService, receiptSearchService, commonAgreementService, receiptId, directoryService, billingMethodService, agreement, utilities,
            commonLookupService, appSession, allocationService, $filter, accountService, vehicleService, invoice, jobAppService, receiptChargesAllocationService, stripeBillingService, currencyAppService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.closedAgreements = false;
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts');
            vm.allocationPermission = abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations');
            vm.canChangeDate = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.CanChangeDate');
            vm.customers = [];
            vm.agreements = [];
            vm.vehicles = [];
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName.toLowerCase();
            vm.tenantId = appSession.tenant.id;
            vm.currencyDecimals = parseInt(abp.setting.get("App.General.CurrencyDecimals"));
            vm.addVatForCCC = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AddVATamountforCreditCardCommissioninReceipt"));
            vm.vatPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.generateAdvanceTaxInvoiceFromAdvanceTaxReceipt = utilities.parseBoolean(abp.setting.get("App.General.GenerateAdvanceTaxInvoiceFromAdvanceTaxReceipt"));
            vm.billingMethods = [];
            vm.billingDetails = [];
            vm.receiptTypes = [];
            vm.amountMinValue = 100;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.manualReceiptNo = utilities.parseBoolean(abp.setting.get("App.General.ManualReceiptNo"));
            vm.receiptOnScreenAllocationWithReceivables = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithReceivables"));
            vm.receiptOnScreenAllocationWithTypesOfCharges = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithTypesOfCharges"));
            vm.makeCreditCardInfoRequiredInReceipt = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeCreditCardInfoRequiredInReceipt"));
            vm.isPostDatedChequeDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequeDirectlyToBank"));
            vm.isNoDuplicationOfChequeNumberInReceiptsPayments = utilities.parseBoolean(abp.setting.get("App.Speed.Common.NoDuplicationOfChequeNumberInReceiptsPayments"));
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isCreditCardCommissionsEnabled = abp.features.isEnabled("CRS.Vouchers.CreditCardCommissions");
            vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isChargeCardEnabled = abp.features.isEnabled("OnlinePayments.Customer.ChargeCard");
            var agreementCategory;
            vm.isBankChargesPostingForBankTransferRV = abp.features.isEnabled("CRS.Vouchers.BankChargesPostingForBankTransferRV");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.allowReceiptOnScreenAllocationPartially = utilities.parseBoolean(abp.setting.get('App.Speed.Common.AllowReceiptOnScreenAllocationPartially'));
            vm.doNotAllowReceiptCreationWithoutAgreement = utilities.parseBoolean(abp.setting.get('App.Speed.Common.DoNotAllowReceiptCreationWithoutAgreement'));
            vm.receiptChargesTypeAllocationAgreementWise = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ChargesTypeWiseAllocationBasedOnDueAmounts"));
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            var includeChargesTypesSetting = true; //get from setting
            var currencyName = null;
            var decimalName = null;
            vm.chargesTypeAllocationAgreementWise = vm.doNotAllowReceiptCreationWithoutAgreement && vm.receiptChargesTypeAllocationAgreementWise;
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
            vm.filters = {
                customerId: null,
                module: null
            };
            vm.locations = [];
            vm.baseCurrency = null;
            vm.saveAndPrint = false;
            vm.allocationData = null;
            var agreementId = null;
            vm.contactCardsList = [];
            vm.hasContactCards = false;
            vm.showGeneralPayment = false;
            vm.isCurrentDateBigger = false;
            vm.currentDate = moment().endOf('day');
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");

            vm.isImportAllocations = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ImportAllocations');
            vm.allowFileSelection = false;
            vm.allowImport = false;
            vm.selectedFile = null;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;
            vm.isAmountConfirmed = false;
            vm.allowAutoAllocationOnReceipts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowAutoAllocationOnReceipts"));

            $scope.loadFile = function (files) {
                vm.allowImport = false;
                if (files.length > 0) {
                    $scope.$apply(function () {
                        vm.totalRecordsCount = 0;
                        vm.successRecordsCount = 0;
                        vm.failRecordsCount = 0;
                        vm.errorRecords = null;
                        vm.showCount = false;
                        vm.selectedFile = files[0];
                        readFileData();
                    });
                } else {
                    vm.refresh();
                    $scope.$apply();
                }
            };

            vm.refresh = function () {
                vm.fileDataList = [];
                angular.element('#dataFile').val(null);
                vm.selectedFile = null;
                vm.allowImport = false;
                vm.totalRecordsCount = 0;
                vm.successRecordsCount = 0;
                vm.failRecordsCount = 0;
                vm.errorRecords = null;
                vm.showCount = false;
                vm.bankAccount = null;
                vm.allowFileSelection = false;
            };

            function readFileData() {

                vm.fileDataList = [];
                let file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    let reader = new FileReader();
                    vm.loading = true;

                    reader.onload = function (e) {
                        vm.match = 0;
                        vm.notMatch = 0;

                        let data = e.target.result;
                        let workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        let first_sheet_name = workbook.SheetNames[0];
                        let dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });
                        const getValue = (obj, fieldName) => {
                            const value = obj[fieldName];
                            if (value && typeof value === 'string') {
                                return value.trim();
                            }
                            return value;
                        }
                        if (dataObjects.length > 0) {

                            let checkForDuplication = true;

                            for (let i = 0; i < dataObjects.length; i++) {

                                let value = dataObjects[i];
                                debugger;
                                let invoiceNumber = getValue(value, "Invoice  Number");
                                //if (!invoiceNumber) {
                                //    abp.message.error('Invoice Number field is missing at record' + (i + 1) + '.', 'Error');
                                //    vm.fileDataList = [];
                                //    break;
                                //}
                                let invoiceType = getValue(value, "Invoice Type");
                                let bookingId = getValue(value, 'booking id');
                                //if (!bookingId) {
                                //    abp.message.error("Booking ID field is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}
                                let agreementNo = getValue(value, 'Agreement No');
                                let agreementType = getValue(value, 'Agreement Type');
                                let invoiceDate = getValue(value, 'Invoice Date');
                                let invoiceAmount = getValue(value, 'Invoice Amount');
                                let alreadyAllocated = getValue(value, 'Already Allocated');
                                let nowAllocated = getValue(value, 'Now Allocated');
                                let dueAmount = getValue(value, 'Due Amount');
                                let item = {
                                    serialNo: i + 1,
                                    invoiceNumber,
                                    invoiceType,
                                    bookingId,
                                    agreementNo,
                                    agreementType,
                                    invoiceDate,
                                    invoiceAmount,
                                    alreadyAllocated,
                                    nowAllocated,
                                    dueAmount
                                };
                                updateImportItem(item);
                                vm.fileDataList.push(item);
                            }

                            if (checkForDuplication && vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateFields();
                            }

                        } else {
                            abp.message.error("Something Wrong Or File is empty !", "Error");
                        }

                        vm.loading = false;
                        $scope.$apply();
                    };

                    reader.onerror = function (ex) {
                        vm.loading = false;
                        abp.message.warn(
                            app.localize(ex),
                            'Unknown File'
                        );
                    };
                    reader.readAsBinaryString(file);
                } else {
                    abp.message.error("Please select Valid file to upload !", "Unknown File");
                    vm.loading = false;
                }
            }

            //function getItem(item) {
            //    if (item.invoiceNumber) {
            //        return vm.allocationData.allocations.find(x => x.voucherNo === item.invoiceNumber);
            //    }
            //    if (item.bookingId) {
            //        return vm.allocationData.allocations.find(x => x.manualAgreementNo === item.bookingId);
            //    }
            //    return null;
            //}

            function updateImportItem(item) {
                debugger;
                if (item.invoiceNumber) {
                    let findItem = vm.allocationData.allocations.find(x => x.voucherNo === item.invoiceNumber);
                    if (findItem) {
                        item.importStatus = 'match';
                        vm.match += 1;
                        findItem.allocatedNow = item.nowAllocated;
                        item.remainingDue = findItem.amount - (findItem.alreadyAllocated + item.nowAllocated);
                    } else {
                        item.importStatus = 'not match';
                        vm.notMatch += 1;
                    }
                }
                else if (item.bookingId) {
                    let nowAllocated = item.nowAllocated;
                    let totalAmount = 0;
                    let totalAlreadyAllocated = 0;
                    let findItems = vm.allocationData.allocations.filter(x => x.manualAgreementNo === item.bookingId);

                    if (findItems && findItems.length > 0) {
                        item.importStatus = 'match';
                        vm.match += 1;
                        for (let i = 0; i < findItems.length; i++) {
                            let findItem = findItems[i];
                            totalAmount += findItem.amount;
                            totalAlreadyAllocated += findItem.alreadyAllocated;
                            if (nowAllocated > 0) {
                                if (i === findItems.length - 1) {
                                    findItem.allocatedNow = nowAllocated;
                                } else {
                                    if (nowAllocated >= findItem.dueToAllocate) {
                                        findItem.allocatedNow = findItem.dueToAllocate;
                                        nowAllocated -= findItem.allocatedNow;
                                    } else {
                                        findItem.allocatedNow = nowAllocated;
                                        nowAllocated -= findItem.allocatedNow;
                                    }
                                }
                            }
                        }
                        item.remainingDue = totalAmount - (totalAlreadyAllocated + item.nowAllocated);
                    } else {
                        item.importStatus = 'not match';
                        vm.notMatch += 1;
                    }
                }
            }

            //vm.import = () => {
            //    vm.fileDataList.forEach(x => {
            //        updateItemFromImport(x);
            //    });
            //}

            //function updateItemFromImport(item) {
            //    let findItem = getItem(item);
            //    if (findItem) {
            //        findItem.allocatedNow = item.actualAllocated
            //    }
            //}

            vm.export = () => {
                debugger
                // Convert the list of objects to an array of arrays
                const dataArray = vm.fileDataList.map(obj => [obj.invoiceNumber, obj.invoiceType, obj.bookingId, obj.agreementNo, obj.agreementType, obj.invoiceDate, obj.invoiceAmount, obj.alreadyAllocated, obj.nowAllocated, obj.dueAmount, obj.importStatus, obj.remainingDue]);

                // Create a worksheet
                const ws = XLSX.utils.aoa_to_sheet([['Invoice Number', 'Invoice Type', 'Booking Id', 'Agreement No', 'Agreement Type', 'Invoice Date', 'Invoice Amount', 'Already Allocated', 'Now Allocated', 'Due Amount', 'Status', 'Remaining Due'], ...dataArray]);

                // Create a workbook and add the worksheet
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

                // Specify the Excel file path
                const excelFilePath = 'allocations.xlsx';

                // Write the workbook to an Excel file
                XLSX.writeFile(wb, excelFilePath);

                console.log(`Excel file '${excelFilePath}' has been created.`);
            }

            function hasDuplicateFields() {
                var result = false;

                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {
                        //    if (moment(vm.fileDataList[a].date).format('DD-MM-YYYY') === moment(vm.fileDataList[j].date).format('DD-MM-YYYY') && vm.fileDataList[a].description === vm.fileDataList[j].description && vm.fileDataList[a].credit === vm.fileDataList[j].credit) {
                        //        abp.message.error("Duplicate records found at " + (a + 1) + " and " + (j + 1) + ".", "Error");
                        //        result = true;
                        //        a = j = vm.fileDataList.length;
                        //        break;
                        //    }
                    }
                }
                return result;
            }

            vm.isEnabled = (feature) => {
                return abp.features.isEnabled(feature);
            }

            vm.onBillingMethodChange = function () {
                if (vm.receipt.billingDetail.billingMethod) {
                    vm.receipt.billingDetail.billingMethodId = vm.receipt.billingDetail.billingMethod.id;
                    // Reset commission-related fields first
                    vm.receipt.creditCardCommission = 0;
                    vm.receipt.creditCardCommissionVatAmount = 0;  
                    vm.receipt.amountWithoutCommission = 0;

                    if (vm.receipt.billingDetail.billingMethod.type === 2 || vm.receipt.billingDetail.billingMethod.type === 3) {
                        vm.receipt.creditCardCommissionPercentage = vm.receipt.billingDetail.billingMethod.commissionPercent || 0;
                        vm.calculateCreditCardCommission();
                    }
                    if (vm.receipt.billingDetail.billingMethod.type === 5) {
                        vm.calculateBankTransferCommission();
                    }
                }
            };

            vm.billingMethodSelected = function () {
                console.log(vm.receipt.billingDetail);
                vm.receipt.amountWithoutCommission = utilities.round(vm.receipt.amount - vm.receipt.creditCardCommission);
                if (vm.addVatForCCC) {
                    vm.receipt.amountWithoutCommission = utilities.round(vm.receipt.amountWithoutCommission - vm.receipt.creditCardCommissionVatAmount);
                }
                if (vm.receipt.billingDetail && vm.receipt.billingDetail.billingMethod && vm.receipt.billingDetail.billingMethod.type == 2) {
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
                } else {
                    vm.receipt.creditCardCommissionPercentage = 0;
                    vm.receipt.creditCardCommissionVatAmount = 0;
                    if (vm.isEditMod) {
                        if (vm.receipt.billingDetail && vm.receipt.billingDetail.billingMethod && vm.receipt.billingDetail.billingMethod.type !== 5) {
                            vm.receipt.creditCardCommission = 0;
                        }
                    } else {
                        vm.receipt.creditCardCommission = 0;
                    }
                    if (vm.receipt.billingDetail && vm.receipt.billingDetail.billingMethod && vm.receipt.billingDetail.billingMethod.type !== 5) {
                        vm.calculateCreditCardCommission();
                    }
                    else {
                        vm.calculateBankTransferCommission();
                    }
                }
            };

            vm.calculateBankTransferCommission = () => {
                if (!vm.isCreateReceiptFromSalesAgreement && !vm.isCreateReceiptFromDueInstallment) {
                    vm.receipt.amount = vm.receipt.amountWithoutCommission;
                }
                if (isNaN(vm.receipt.amount)) {
                    vm.receipt.amount = 0;
                }
                if (isNaN(vm.receipt.amountWithoutCommission)) {
                    vm.receipt.amountWithoutCommission = 0;
                }
                if (isNaN(vm.receipt.creditCardCommission)) {
                    vm.receipt.creditCardCommission = 0;
                }
                if (vm.receipt.amountWithoutCommission >= 0) {
                    if (!vm.showGeneralPayment && !vm.isCreateReceiptFromSalesAgreement && !vm.isCreateReceiptFromDueInstallment) {
                        vm.receipt.amount = utilities.round(vm.receipt.amountWithoutCommission + vm.receipt.creditCardCommission);
                    }

                    vm.amountChanged();
                }
            }

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

            vm.dateNullOrNot = function () {
                if (vm.receipt.billingDetail.creditCard.expiryDate == false) {
                    vm.receipt.billingDetail.creditCard.expiryDate = "";
                }

            }
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
            }

            vm.contactCardSelected = function () {
                if (!vm.receipt.billingDetail.creditCard) {
                    vm.receipt.billingDetail.creditCard = {
                        expiryDate: vm.contactCard.expiry,
                        cardNoLastDigits: vm.contactCard.cardNoLastFourDigits
                    };
                }
                else {
                    console.log(vm.contactCard);
                    vm.receipt.billingDetail.creditCard.expiryDate = vm.contactCard.expiry;
                    vm.receipt.billingDetail.creditCard.cardNoLastDigits = vm.contactCard.cardNoLastFourDigits;
                    vm.receipt.billingDetail.creditCard.externalSource = vm.contactCard.externalSource;
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
                vm.receipt.amount = utilities.round(vm.receipt.amount, 2);
                vm.receipt.amountWithoutCommission = vm.rounding(vm.receipt.amountWithoutCommission);
                //vm.receipt.creditCardCommissionPercentage = vm.rounding(vm.receipt.creditCardCommissionPercentage);
                vm.receipt.creditCardCommission = vm.rounding(vm.receipt.creditCardCommission);
                vm.receipt.creditCardCommissionVatAmount = vm.rounding(vm.receipt.creditCardCommissionVatAmount);

                if (vm.autoCalculateAmountInWords == "true") {
                    if (vm.isMultiCurrencyEnabled && vm.receipt.contact) {
                        currencyName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.name : null;
                        decimalName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.decimalName : null;
                    }
                    vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount, currencyName, decimalName);
                }
                vm.autoAllocation();
            };

            vm.amountWithoutCommissionChanged = () => {
                //if (vm.receipt) {
                //    vm.receipt.creditCardCommissionPercentage = 0;
                //    vm.receipt.creditCardCommission = 0;
                //}

                vm.receipt.amount = utilities.round(vm.receipt.amountWithoutCommission);

                vm.calculateCreditCardCommission();
                vm.amountChanged();
            }

            vm.sumAmountAllocationCharges = function () {
                if (vm.receipt == null)
                    return 0;

                if (vm.receipt.receiptChargesAllocationForShow.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.receipt.receiptChargesAllocationForShow, function (value, key) {
                    if (value.allocatedNow > 0)
                        value.allocatedNow = vm.rounding(value.allocatedNow)
                    if (value.amount > 0)
                        amount = amount + value.amount;

                });

                //vm.receiptAmount = receiptAmount
                //vm.total = amount;
                //vm.remaining = receiptAmount - amount;

                return utilities.round(amount, 2);
            };
            vm.insertDueAmountOnClick = function (allocation) {
                if (parseFloat(allocation.allocatedNow) == 0) {
                    allocation.allocatedNow = vm.rounding(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNow);
                }
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

            vm.sumTotalWithAllocation = function () {

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
                    return !(amountToMatch == chargesAllocationAmount) || (vm.allocationData.allocations.length > 0 && !(amountToMatch == (allocationAmount)));
                if (vm.receiptOnScreenAllocationWithReceivables)
                    return vm.allocationData.allocations.length > 0 && !(amountToMatch == (allocationAmount));
                if (vm.receiptOnScreenAllocationWithTypesOfCharges)
                    return !(amountToMatch == (chargesAllocationAmount));

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
                if (vm.receipt && vm.receipt.voucherSubTypeId == 69) {
                    typeOfContact = 1;
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

                if (isNaN(vm.receipt.creditCardCommissionVatAmount)) {
                    vm.receipt.creditCardCommissionVatAmount = 0;
                }

                if (vm.receipt.amountWithoutCommission >= 0 && vm.receipt.creditCardCommissionPercentage >= 0) {
                    if (!vm.showGeneralPayment) {
                        //vm.receipt.amount = vm.receipt.amount - vm.receipt.creditCardCommission;
                        vm.receipt.creditCardCommission = utilities.round(parseFloat(vm.receipt.creditCardCommissionPercentage) * (vm.receipt.amountWithoutCommission / 100));
                        vm.receipt.amount = utilities.round(vm.receipt.amountWithoutCommission + vm.receipt.creditCardCommission);
                        if (vm.addVatForCCC) {
                            vm.receipt.creditCardCommissionVatAmount = utilities.round(
                                ((parseFloat(vm.vatPercent) || 0) / 100) * vm.receipt.creditCardCommission,
                                2
                            );

                            vm.receipt.amount = utilities.round(vm.receipt.amount + vm.receipt.creditCardCommissionVatAmount);
                        }
                    } /*else {
                        vm.totalGeneralReceiptAmount = vm.totalGeneralReceiptAmount - vm.receipt.creditCardCommission;
                        vm.receipt.creditCardCommission = parseFloat(vm.receipt.creditCardCommissionPercentage) * (vm.totalGeneralReceiptAmount / 100);
                        vm.totalGeneralReceiptAmount += vm.receipt.creditCardCommission;
                    }*/

                    vm.amountChanged();
                }
                vm.receipt.amountWithoutCommission = vm.rounding(vm.receipt.amountWithoutCommission);
                //vm.receipt.creditCardCommissionPercentage = vm.rounding(vm.receipt.creditCardCommissionPercentage);
                vm.receipt.creditCardCommission = vm.rounding(vm.receipt.creditCardCommission);
                vm.receipt.creditCardCommissionVatAmount = vm.rounding(vm.receipt.creditCardCommissionVatAmount);
            }
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
            function getAllCurrencies() {
                currencyAppService.getCurrencies().then(function (response) {
                    vm.allCurrencies = response.data.items;
                    vm.baseCurrencyId = response.data.items.filter(p => p.isBase)[0].id;
                    vm.baseCurrency = response.data.items.filter(p => p.isBase);
                });
            };
            function getCurrencies() {
                commonLookupService.getCurrencies({}).success(function (data) {
                    vm.currencies = data.items;
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

            function getAllocationData() {

                if (vm.receiptOnScreenAllocationWithReceivables && vm.receipt.voucherSubTypeId != 35) {
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
            };
            vm.autoAllocation = function () {

                if (vm.allowAutoAllocationOnReceipts && vm.isAmountConfirmed)       //here is setting 
                {
                    if (vm.receipt.voucherSubTypeId == 72) {
                        vm.allocationData = angular.copy(vm.allocationDataOriginal);
                    } else {
                        if (!vm.receipt.id) {
                            if (vm.receipt.amount > 0) {
                                var amountForAllocation = vm.receipt.amount;
                                if (vm.allocationData) {
                                    angular.forEach(vm.allocationData.allocations, function (line) {
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

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.onCustomerSelect = function (customer) {
                agreementId = null;
                vm.receipt.contactId = customer.id;
                if (vm.receipt.contact) {
                    if (vm.isMultiCurrencyEnabled) {
                        if (!vm.receipt.contact.currencyDto) {
                            vm.receipt.contact.currencyDto = vm.baseCurrency[0];
                        }
                        if (vm.receipt.contact.currencyDto) {
                            vm.receipt.currencyId = vm.receipt.contact.currencyDto.id;
                            if (customer.currencyDto?.id && vm.isMultiCurrencyEnabled) {
                                vm.selectedCurrency = customer.currencyDto;
                                vm.receipt.inputCurrencyId = customer.currencyDto.id;
                            }
                        }
                    }
                }

                //if (customer.contactType == 2 && !customer.currencyDto?.id && vm.isMultiCurrencyEnabled) {
                //    abp.message.info("Attach Currency With Customer");
                //}
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

            vm.conversionRateChanged = function () {
                vm.selectedCurrencyToBase = vm.receipt.inputAmount * vm.receipt.currencyRate;
                vm.baseToContactCurrency = vm.selectedCurrencyToBase * (1 / vm.receipt.contact.currencyDto.currencyToBaseRate);
                vm.receipt.amount = utilities.round(vm.baseToContactCurrency, 2);
                if (vm.isMultiCurrencyEnabled && vm.receipt.contact) {
                    currencyName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.name : null;
                    decimalName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.decimalName : null;
                }
                vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount, currencyName, decimalName);
            };

            vm.customerCurrencyChanged = function () {
                if (vm.receipt.contact) {
                    if (vm.receipt.contact.currencyDto) {
                        if (vm.receipt.inputCurrencyId != vm.receipt.contact.currencyDto.id) {
                            vm.receipt.customerCurrency = vm.receipt.contact.currencyDto.name;

                            vm.receipt.currencyId = vm.receipt.contact.currencyDto.id;
                            vm.selectedCurrency = vm.allCurrencies.find(e => e.id == vm.receipt.inputCurrencyId);
                            vm.selectedCurrencyToBase = vm.receipt.inputAmount * vm.selectedCurrency.currencyToBaseRate;
                            vm.baseToContactCurrency = vm.selectedCurrencyToBase * (1 / vm.receipt.contact.currencyDto.currencyToBaseRate);
                            vm.receipt.amount = utilities.round(vm.baseToContactCurrency, 2);
                            vm.receipt.currencyRate = vm.selectedCurrency.currencyToBaseRate;
                        }
                        else if (vm.receipt.inputCurrencyId == vm.receipt.contact.currencyDto.id) {
                            vm.selectedCurrency = vm.allCurrencies.find(e => e.id == vm.receipt.inputCurrencyId);

                        }


                        if (vm.isMultiCurrencyEnabled && vm.receipt.contact) {
                            currencyName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.name : null;
                            decimalName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.decimalName : null;
                        }
                        vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount, currencyName, decimalName);
                    }
                }
            };
            vm.customerCurrencyChangedForEdit = function () {
                if (vm.receipt.contact) {
                    if (vm.receipt.contact.currencyDto) {
                        if (vm.receipt.inputCurrencyId != vm.receipt.contact.currencyDto.id) {
                            vm.receipt.customerCurrency = vm.receipt.contact.currencyDto.name;

                            vm.receipt.currencyId = vm.receipt.contact.currencyDto.id;
                            vm.selectedCurrency = vm.allCurrencies.find(e => e.id == vm.receipt.inputCurrencyId);
                            vm.selectedCurrencyToBase = vm.receipt.inputAmount * vm.selectedCurrency.currencyToBaseRate;
                            vm.baseToContactCurrency = vm.selectedCurrencyToBase * (1 / vm.receipt.contact.currencyDto.currencyToBaseRate);
                        }
                        else if (vm.receipt.inputCurrencyId == vm.receipt.contact.currencyDto.id) {
                            vm.selectedCurrency = vm.allCurrencies.find(e => e.id == vm.receipt.inputCurrencyId);

                        }


                        if (vm.isMultiCurrencyEnabled && vm.receipt.contact) {
                            currencyName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.name : null;
                            decimalName = vm.receipt.contact.currencyDto ? vm.receipt.contact.currencyDto.decimalName : null;
                        }
                        vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount, currencyName, decimalName);
                    }
                }
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
                if (vm.receipt && vm.receipt.voucherSubTypeId == 69) {
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
                            return null;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.receipt.contact = result;
                        vm.receipt.contact.currencyDto = vm.receipt.contact.currency;
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
                    if (vm.tenantId == 6161) {
                        if (line.account.contactGroup.isDefault)
                            line.account.contactGroupId = line.account.contactGroup.id;
                    }
                    else {
                        if (!line.account.contactGroup.isDefault)
                            line.account.contactGroupId = line.account.contactGroup.id;
                    }
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
            vm.moduleChanged = function () {

                // Feature must be enabled
                if (!vm.moduleWiseReceivables) {
                    return;
                }

                // must have customer selected
                var customerId = vm.receipt.contactId;
                if (!customerId) {
                    abp.notify.warn("Please select customer first.");
                    return;
                }

                // agreement category from dropdown
                vm.filters.module= vm.enabledModule || null;
                vm.receipt.module = vm.enabledModule || null;

                // Call backend
                commonAgreementService.getAllAgreementsOnCustomer({
                    customerId: customerId,
                    module: vm.filters.module
                }).then(function (result) {
                    if (!result || !result.data) {
                        vm.agreements = [];
                        return;
                    }

                    vm.agreements = result.data.items || result.data || [];
                });
                getAllocationData();
            };

            function init() {
                vm.loading = true;

                receiptSearchService.getReceiptForEdit({
                    id: receiptId
                }).success(function (result) {
                    vm.receipt = result;
                    if (!receiptId) {
                        vm.receipt.voucherSubTypeId = 25; // by default contact receipt selection
                        if (vm.receiptOnScreenAllocationWithTypesOfCharges && vm.chargesTypeAllocationAgreementWise)
                            getReceiptChargesForAllocationAgreement();
                    }
                    //if (agreement)
                    //{
                    //    if (agreement.isBooking) {
                    //        vm.receipt.voucherSubTypeId = 72;
                    //    }
                    //}

                    if (vm.manualReceiptNo)
                        vm.receipt.voucherNo = parseInt(vm.receipt.voucherNo);
                    if (vm.receipt.contactId) {

                        vm.receipt.contact.currencyDto = vm.receipt.contact.currency;
                        if (vm.receipt.id > 0) {

                            vm.receipt.contact.currencyDto = vm.receipt.currency;

                            //vm.selectedCurrency = {};
                            //vm.selectedCurrency = vm.receipt.contact.currency;
                            vm.customerCurrencyChangedForEdit();

                        }
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
                        vm.receipt.amountWithoutCommission = utilities.round(vm.receipt.amount - vm.receipt.creditCardCommission);
                        if (vm.addVatForCCC) {
                            vm.receipt.amountWithoutCommission = utilities.round(vm.receipt.amountWithoutCommission - vm.receipt.creditCardCommissionVatAmount);
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
                            vm.receipt.contact.currencyDto = data.customer.currency;
                            vm.receipt.agreementId = data.id;
                            vm.receipt.contactId = vm.receipt.contact.id;
                            vm.disableCustomer = true;
                            vm.disableAgreement = true;
                            vm.showAgreement = true;
                            agreementId = agreement.id;

                            if (agreement.due)
                                vm.receipt.amount = vm.rounding(agreement.due);
                            vm.amountChanged();
                            vm.onCustomerSelect(vm.receipt.contact)
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
                            vm.receipt.amount = vm.rounding(invoice.dueAmount);

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
                                receiptId: vm.receipt.id
                            }
                        }
                    }
                });

            };
            vm.save = function (isCharge = false) {

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
                            amount: allocation.allocatedNow
                        });
                    });

                    var anyNegativeDueAmount = utilities.checkNegativeDueAmounts(vm.allocationData.allocations);
                    if (anyNegativeDueAmount) {
                        abp.message.info("One or more due Amounts contain less than zero amount");
                        return;
                    }
                }

                var receiptAllocations = {
                    allocations: allocations
                };
                vm.receipt.receiptAllocations = receiptAllocations;
                vm.receipt.receiptChargesAllocationForSave = vm.receipt.receiptChargesAllocationForShow;
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

                if (!isCharge) {
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.receipt.inputAmount == null) {
                            vm.receipt.inputAmount = vm.receipt.amount;
                        }
                    }
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
                        if (invoice && invoice.createFromFines)
                            $uibModalInstance.close(vm.receipt.id);
                        else
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
                } else {
                    receiptService.createOrUpdateReceiptWithCharge({
                        receipt: vm.receipt,
                        charge: {
                            amount: vm.receipt.amount,
                            stripeCustomerId: vm.receipt.contact.externalId,
                            paymentMethodId: vm.receipt.billingDetail.creditCard.externalId
                        }
                    }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.receipt.id = result.receiptId;
                        vm.receipt.printObj = {
                            id: vm.receipt.id,
                            printHeader: false
                        };
                        vm.receipt.billingDetail.creditCard.transactionId = result.paymentId;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.receipt);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }


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
                //debugger;
                //if (vm.receipt.voucherSubTypeId == 26) {
                //    for (var i = 0; i < vm.receipt.length; i++) {

                //        if (vm.receipt[i].credit) {
                //            vm.receipt[i].credit = vm.rounding(vm.receipt[i].credit);
                //        }
                //        if (vm.receipt[i].debit) {
                //            vm.receipt[i].debit = vm.rounding(vm.receipt[i].debit);
                //        }
                //    }
                //}

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
                if (vm.isMultiCurrencyEnabled) {
                    getCurrencies();
                    getAllCurrencies();
                }

                if (vm.isAccountsEnabled)
                    getBankAccounts();
            }

            init();
            initializeFilters();
            getReceiptTypes();
        }
    ]);
