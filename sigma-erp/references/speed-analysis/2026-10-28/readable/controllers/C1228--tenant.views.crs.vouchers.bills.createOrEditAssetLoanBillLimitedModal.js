// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:320693-322394
appModule.controller('tenant.views.crs.vouchers.bills.createOrEditAssetLoanBillLimitedModal', ['$uibModal', 'options', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.linkedAccount', 'abp.services.app.directory', 'abp.services.app.commonLookup',
        'abp.services.app.bill', 'abp.services.app.expenseType', 'utilities', 'abp.services.app.account', 'appSession', 'abp.services.app.costCenter',
        'abp.services.app.item', 'abp.services.app.unitOfMeasure', 'abp.services.app.purchaseOrder', 'abp.services.app.grn', 'abp.services.app.job', 'abp.services.app.asset', "FileUploader",
        'abp.services.app.tenantSettings', 'abp.services.app.leaseMasterAgreement', 'abp.services.app.vehicleModel', 'abp.services.app.agreement',
        function ($uibModal, options, $uibModalInstance, vehicleService, linkedAccountService, directoryService, commonLookupService,
            billService, expenseTypeService, utilities, accountService, appSession, costCenterService, itemAppService, unitOfMeasureAppService, purchaseOrdersService, grnAppService, jobAppService, assetService, fileUploader,
            tenantSettingsService, leaseMasterAgreementService, vehicleModelService, agreementAppService) {
            var vm = this;
            vm.branchTaxPercentage = null;
            vm.isClone = options.isClone;
            vm.loading = false;
            vm.vehicles = [];
            vm.suppliers = [];
            vm.linkedPrepaidExpense = [];
            vm.billingMethods = [];
            vm.showBillVoucherLines = false;
            vm.locations = [];
            vm.documents = [];
            vm.expenseTypes = [];
            var selectedGrns = [];
            vm.allowAssetLoanBillEdit = utilities.parseBoolean(abp.setting.get("App.General.AllowAssetLoanBillEdit"));
            vm.paymentPlan = {
                installments: []
            };
            vm.saveAndPrint = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.allSelected = false;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            if (vm.isPostTaxInclusive)
                vm.isTaxInclusive = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.manualBillNo = utilities.parseBoolean(abp.setting.get("App.General.ManualBillNo"));
            vm.isAllowGeneralBillOnCustomerEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowGeneralBillOnCustomer"));
            vm.taxPercentageInBillAndJvImport = utilities.parseBoolean(abp.setting.get("App.Speed.Common.TaxPercentageInBillAndJvImport"));
            vm.generalBillItemQuantityWise = utilities.parseBoolean(abp.setting.get("App.Speed.Common.GeneralBillItemQuantityWise"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.AllActionsOnOtherBranchBills');
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.taxCategoryChangeableInBill = abp.features.isEnabled('CRS.Vouchers.Bills.TaxCategoryChangeableInBill');
            vm.documentsForBillEnable = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForBills");
            vm.addMasterAgreementInVouchers = abp.features.isEnabled("CRS.CustomFeatures.MasterAgreementInVouchers");
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.setBillDateAsCurrentDate = utilities.parseBoolean(abp.setting.get("App.General.SetBillDateAsCurrentDate"));
            vm.isAgreementNoFieldInGeneralBill = utilities.parseBoolean(abp.setting.get("App.General.AgreementNoFieldInGeneralBill"));
            vm.isShowPaidTo = utilities.parseBoolean(abp.setting.get("App.General.PaidToInBills"));
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isLoanEnabled = abp.features.isEnabled("CRS.Accounts.Loan");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            //vm.isCostCenterRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCostCenterForBillRequired"));
            vm.isCustomFieldOneIsMandotoryInBill = utilities.parseBoolean(abp.setting.get("App.General.IsCustomFieldOneIsMandotoryInBill"));
            //new settings
            vm.importAndAtatchPOInBill = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ImportAndAttachPOInBill"));
            vm.importVoucherLinesWithTax = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ImportVoucherLinesWithTax"));
            vm.costCenterGroup1Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup1Required"));
            vm.costCenterGroup2Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup2Required"));
            vm.isImportVoucherLinesEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportVoucherLines");
            vm.grnAsFinancialVoucher = utilities.parseBoolean(abp.setting.get("App.General.GrnAsFinancialVoucher"));
            var selectedExpenseAccountIdsFromSettings = null;
            vm.isSaleInventoryVehicleEnabled = abp.features.isEnabled("CRS.Accounts.SaleInventoryVehicle");
            vm.showLoanForGeneralBill = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowLoanForGeneralBill"));
            vm.assignVehicleBranchInVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AssignVehicleBranchInVoucherLine"));
            vm.filters = {
                name: '',
                makeId: null
            };
            function getExpenseAccountsAdvanceSetting() {
                tenantSettingsService.getExpenseAccountsAdvanceSetting()
                    .success(function (result) {
                        selectedExpenseAccountIdsFromSettings = result;
                        if (vm.vehicleExpensesAccounts)
                            vm.vehicleExpensesAccounts.filter(e => selectedExpenseAccountIdsFromSettings.includes(e.id)).forEach(e => e.isChecked = true);
                    });
            }
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.IsEnableOPtionalLookUp = false;
            // Searching Contacts
            vm.bill = {};
            vm.bill.amountAfterDiscount = 0;

            if (vm.isWorkshopEnabled && vm.isCostCenterEnabled)
                vm.bothAreEnabled = true;
            else if (vm.isWorkshopEnabled || vm.isCostCenterEnabled)
                vm.oneIsEnabled = true;
            else if (!vm.isWorkshopEnabled && !vm.isCostCenterEnabled)
                vm.noneIsEnabled = true;

            vm.bill.voucherSubTypeId = 41; //stock bill        
            vm.searchContactGeneralPayment = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.taxCategories = [
                {
                    id: 0, name: " "
                },
                {
                    id: 1, name: app.localize("Standard")
                },
                {
                    id: 2, name: app.localize("TaxExempted")
                },
                {
                    id: 3, name: app.localize("ZeroRated")
                },

            ];

            vm.taxCategoryChanged = function (line) {
                if (line.taxCategory == 2 || line.taxCategory == 3) {
                    vm.bill.taxPercent = 0;
                }
                if (line.taxCategory == 1) {
                    vm.bill.taxPercent = vm.taxPercent;
                }
                vm.calculateTaxPerRow(line);

            }

            function getAssetTypes() {

                vm.loading = true;
                assetService.getAssetType({}).success(function (data) {
                    vm.assetTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function billLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.vehicleModelId = null;
                line.quantity = vm.bill.isPaymentPlanDefined ? 1 : null;

                line.item = {};
                line.itemQuantity = 0;
                line.amount = 0;
                line.tax = 0;
                line.textField1 = '';


                return line;
            }

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            }

            // On The Change Of Account In GeneralPayment

            vm.accountChanged = function (line) {
                line.contact = null;
                if (line.account.accountCategory == 4 || line.account.accountCategory == 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }
                else if (line.account.contactGroup != null) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null,
                        line.vehicle = null;
                    line.costCenterId = null;
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
                    line.vehicleShow = false;
                    line.contactShow = false;
                    line.vehicleId = null,
                        line.vehicle = null;
                    line.costCenterId = null;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                }


                if (line.contactShow == null) {
                    line.contactShow = false;
                }
                if (line.vehicleShow == null) {
                    line.vehicleShow = false;
                }
                if (line.showDate == null) {
                    line.showDate = false;
                }
                if (line.contactShow == false && line.vehicleShow == false && line.showDate == false) {
                    vm.IsEnableOPtionalLookUp = true;
                }

                vm.vehicleRequired = false;
                if (selectedExpenseAccountIdsFromSettings.some(e => e == line.accountId))
                    vm.vehicleRequired = true;

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


            vm.onCustomerSelect = function (assignToEmployee) {
                if (vm.bill.assignToEmployee) {
                    vm.bill.assignToEmployeeId = assignToEmployee.id;
                }
            };


            vm.searchContact = function ($select, contactType) {
                return directoryService.search({ keyword: $select.search, contactType: contactType, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchAssignToEmployeePopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return vm.contactType;
                        }
                    }
                }).result.then(function (assignToEmployee) {
                    vm.bill.assignToEmployee = assignToEmployee;
                    vm.bill.assignToEmployeeId = assignToEmployee.id;
                    vm.onCustomerSelect(assignToEmployee);
                });
            };

            vm.searchAdditionalDriverPopoup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (requestedBy) {
                    vm.bill.requestedBy = requestedBy;
                    vm.bill.requestedById = requestedBy.id;
                });
            };

            function getLoanPrepaidExpenseAccount() {
                vm.loading = true;
                linkedAccountService.getLoanPrepaidExpenseAccount().success(function (data) {
                    vm.loanPrepaidExpenseAccount = data;
                    addInterestRow();
                }).finally(function () {
                    vm.loading = false;
                })
            }
            vm.calculateCreditAndTax = (row) => {

                if (vm.bill == null)
                    return 0;
                if (row == null)
                    return 0;
                if (row.debit != null) {
                    if (vm.bill.taxPercent > 0) {
                        var tax = 0;

                        if (!vm.bill.contact.isTaxExempted) {

                            row.debit = parseFloat(row.amount) * (100 / (100 + vm.bill.taxPercent));
                            row.tax = parseFloat(row.amount) - row.debit;
                        }

                        else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                            vm.bill.taxPercent = 0;
                        }

                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.taxable);
                    }

                    row.amount = row.debit + row.tax;
                }
                /////////
                vm.sumAmountTax();


            }

            vm.onSupplierSelect = function () {
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.bill.contact.currencyDto) {
                        vm.currencyCode = vm.bill.contact.currencyDto.code;
                        vm.bill.currencyId = vm.bill.contact.currencyDto.id;
                        vm.bill.currencyRate = vm.bill.contact.currencyDto.currencyToBaseRate;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }
            }

            vm.calculateCreditAndTaxFromExcel = (row) => {
                if (vm.bill == null)
                    return 0;
                if (row == null)
                    return 0;
                if (row.debit != null) {
                    if (!vm.importVoucherLinesWithTax) {
                        if (vm.bill.taxPercent > 0) {
                            var tax = 0;

                            if (!vm.bill.contact.isTaxExempted) {

                                row.debit = parseFloat(row.amount) * (100 / (100 + vm.bill.taxPercent));
                                row.tax = parseFloat(row.amount) - row.debit;
                            }

                            else {
                                row.tax = 0;
                                row.taxable = (row.taxable);
                                vm.bill.taxPercent = 0;
                            }

                        }
                        else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                        }

                    }
                    row.amount = row.debit + row.tax;

                }
                /////////
                vm.sumAmountTax();
            }
            function addInterestRow() {
                var billLineObj = billLineObject();
                billLineObj.debit = vm.paymentPlan.interest;
                billLineObj.accountId = vm.loanPrepaidExpenseAccount.id;
                billLineObj.account = vm.loanPrepaidExpenseAccount;
                billLineObj.isLoanRow = true;
                billLineObj.description = "Interest";
                vm.bill.voucherLines.push(billLineObj);
                vm.sumAmountTax();
            }

            function removeLoanRow() {
                var loanRow = vm.bill.voucherLines.find(e => e.isLoanRow);
                if (loanRow) {
                    var indexOfLoanRow = vm.bill.voucherLines.indexOf(loanRow);
                    vm.bill.voucherLines.splice(indexOfLoanRow, 1);
                }
            }

            vm.openLoanPaymentModal = function () {

                removeLoanRow();
                vm.sumAmountTax();
                if (vm.allowAssetLoanBillEdit) {
                    if (!(vm.bill.id > 0)) {
                        vm.bill.paymentPlan = {
                            installments: []
                        }
                    }
                }

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/loanPaymentModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.loanPaymentModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        totalBillAmount: function () {
                            return vm.bill.amount;
                        },
                        paymentPlan: function () {
                            return vm.allowAssetLoanBillEdit ? vm.bill.paymentPlan : vm.paymentPlan
                        },
                        isAssetLoanBill: function () {
                            return vm.bill.voucherSubTypeId == 43;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.paymentPlan = result;
                    //getLoanPrepaidExpenseAccount();
                });
            };


            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.bill.taxPercent = vm.taxPercent;
                else
                    vm.bill.taxPercent = 0;
            };

            vm.searchAgreements = function ($select) {
                if ($select.search == "") { vm.agreements = null; return null; }
                agreementAppService.searchAgreementForVoucherLines({ agreementNo: $select.search, manualAgreementNo: $select.search }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            }

            vm.considerTaxAsTaxPercentage = function (row) {
                if (vm.taxPercentageInBillAndJvImport) {
                    row.amount = row.debit;
                    row.tax = (row.tax / 100) * row.amount;
                    row.amount = row.amount + row.tax //considering value.tax as tax Percentage
                    vm.sumAmountTax();
                }
            }

            vm.calculateTaxPerRowForImport = function (row) {
                if (vm.bill == null)
                    return 0;

                if (row == null)
                    return 0;

                if (row.debit)
                    row.debit = vm.rounding(row.debit);
                var sum = 0;
                var totalTax = 0.0;

                if (row.debit != null) {
                    if (!vm.importVoucherLinesWithTax) {
                        if (vm.bill.taxPercent > 0) {
                            var tax = 0;

                            if (!vm.bill.contact.isTaxExempted) {

                                if (row.taxable || !row.taxable) {
                                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                        //equation solved from following formula... 
                                        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                        var chargesWithoutTax = (row.debit * 100) / (100 + vm.bill.taxPercent);
                                        tax = utilities.round(row.debit - chargesWithoutTax, 2);
                                    } else {
                                        //prices are without tax. calculate tax and include in total
                                        tax = utilities.round(row.debit * vm.bill.taxPercent / 100, 2);
                                        // vm.tripCharges[i].charges += utilities.round(tax,2);

                                    }
                                    row.tax = tax;
                                    row.taxable = true;
                                }
                                else {
                                    row.tax = 0;
                                    row.taxable = (row.taxable);
                                }


                            }

                            else {
                                row.tax = 0;
                                row.taxable = (row.taxable);
                                vm.bill.taxPercent = 0;
                            }
                        }
                        else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                        }
                    }

                    row.amount = row.debit + row.tax;
                }

                vm.sumAmountTax();
                //vm.sumAmount();

            };


            vm.branchTaxCode = function () {
                var userLocationId = appSession.user.locationId;
                if (userLocationId) {
                    commonLookupService.getLocationById({ id: userLocationId })
                        .success(function (data) {
                            var userLocation = data;
                            if (userLocation.taxCode) {
                                vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                            }
                        })
                }
            }
            vm.changeTaxOnSupplier = function () {
                vm.bill.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                if (vm.isTaxCodeEnabled && vm.bill.contact) {
                    if (vm.bill.contact.taxCodeId > 0 && vm.bill.contact.taxCode && !vm.bill.contact.isTaxExempted) {
                        vm.bill.taxPercent = vm.bill.contact.taxCode.taxPercent;

                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.bill.taxPercent = vm.bill.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                    }
                }

                vm.bill.voucherLines.forEach(row => {
                    vm.calculateTaxPerRow(row);
                });
            };

            vm.calculateTaxPerRow = function (row) {
                if (vm.isTaxCodeEnabled) {
                    if (vm.bill.contact.taxCodeId > 0 && !vm.bill.contact.isTaxExempted) {
                        vm.bill.taxPercent = vm.bill.contact.taxCode.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.bill.taxPercent = vm.bill.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                    }
                }
                if (vm.bill == null)
                    return 0;

                if (row == null)
                    return 0;

                if (row.debit)
                    row.debit = vm.rounding(row.debit);
                var sum = 0;
                var totalTax = 0.0;

                if (row.debit != null) {
                    if (vm.bill.taxPercent > 0) {
                        var tax = 0;

                        if (!vm.bill.contact.isTaxExempted) {

                            if (row.taxable || !row.taxable) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (row.debit * 100) / (100 + vm.bill.taxPercent);
                                    tax = utilities.round(row.debit - chargesWithoutTax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(row.debit * vm.bill.taxPercent / 100, 2);
                                    // vm.tripCharges[i].charges += utilities.round(tax,2);

                                }
                                row.tax = tax;
                                row.taxable = true;
                            }
                            else {
                                row.tax = 0;
                                row.taxable = (row.taxable);
                            }


                        }

                        else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                            vm.bill.taxPercent = 0;
                        }
                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.taxable);
                    }


                    row.amount = row.debit + row.tax;
                }

                vm.sumAmountTax();
                //vm.sumAmount();

            };

            vm.sumAmount = function () {

                if (vm.bill == null)
                    return 0;

                if (vm.bill.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.bill.voucherLines.length; i++) {
                    if (vm.bill.voucherLines[i].debit != null) {
                        sum = sum + parseFloat(vm.bill.voucherLines[i].debit);

                        if (vm.bill.taxPercent > 0) {
                            var tax = 0;
                            if (!vm.bill.contact.isTaxExempted) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (vm.bill.voucherLines[i].debit * 100) / (100 + vm.bill.taxPercent);
                                    tax = utilities.round(vm.bill.voucherLines[i].debit - chargesWithoutTax, 2);
                                    totalTax += utilities.round(tax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(vm.bill.voucherLines[i].debit * vm.bill.taxPercent / 100, 2);
                                    totalTax += utilities.round(tax, 2);
                                    // vm.tripCharges[i].charges += utilities.round(tax,2);

                                }
                                vm.bill.voucherLines[i].tax = tax;
                                if (tax > 0)
                                    vm.bill.voucherLines[i].taxable = true;
                                //}
                                //else {
                                //    vm.bill.voucherLines[i].tax = 0;
                                //    vm.bill.voucherLines[i].taxable = false;
                                //}
                            }
                            else {
                                vm.bill.voucherLines[i].tax = 0;
                                vm.bill.voucherLines[i].taxable = false;
                            }
                        }
                        else {
                            vm.bill.voucherLines[i].tax = 0;
                            vm.bill.voucherLines[i].taxable = false;
                        }
                    }

                }

                vm.bill.amountInWords = '';

                vm.bill.tax = totalTax;
                vm.bill.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                vm.bill.amount = utilities.round(vm.bill.amount, 2);
                if (vm.bill.discount != null) {
                    vm.bill.amount = vm.bill.amount - vm.bill.discount;
                }
                if (vm.bill.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true") {

                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount);

                    }
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };


            vm.sumAmountExcel = function () {

                if (vm.bill == null)
                    return 0;

                if (vm.bill.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.bill.voucherLines.length; i++) {
                    if (vm.bill.voucherLines[i].debit != null) {
                        sum = sum + parseFloat(vm.bill.voucherLines[i].debit);
                        if (!vm.importVoucherLinesWithTax) {
                            if (vm.bill.taxPercent > 0) {
                                var tax = 0;
                                if (!vm.bill.contact.isTaxExempted) {
                                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                        //equation solved from following formula... 
                                        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                        var chargesWithoutTax = (vm.bill.voucherLines[i].debit * 100) / (100 + vm.bill.taxPercent);
                                        tax = utilities.round(vm.bill.voucherLines[i].debit - chargesWithoutTax, 2);
                                        totalTax += utilities.round(tax, 2);
                                    } else {
                                        //prices are without tax. calculate tax and include in total
                                        tax = utilities.round(vm.bill.voucherLines[i].debit * vm.bill.taxPercent / 100, 2);
                                        totalTax += utilities.round(tax, 2);
                                        // vm.tripCharges[i].charges += utilities.round(tax,2);

                                    }
                                    vm.bill.voucherLines[i].tax = tax;
                                    if (tax > 0)
                                        vm.bill.voucherLines[i].taxable = true;
                                    //}
                                    //else {
                                    //    vm.bill.voucherLines[i].tax = 0;
                                    //    vm.bill.voucherLines[i].taxable = false;
                                    //}
                                }
                                else {
                                    vm.bill.voucherLines[i].tax = 0;
                                    vm.bill.voucherLines[i].taxable = false;
                                }
                            }
                            else {
                                vm.bill.voucherLines[i].tax = 0;
                                vm.bill.voucherLines[i].taxable = false;
                            }
                        } else {

                            if (!vm.bill.contact.isTaxExempted) {
                                totalTax += utilities.round(vm.bill.voucherLines[i].tax, 2);
                                vm.bill.voucherLines[i].taxable = true;

                            }
                            else
                                vm.bill.voucherLines[i].tax = 0;

                        }
                    }

                }

                vm.bill.amountInWords = '';

                vm.bill.tax = totalTax;
                var grossAmount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                var discount = vm.bill.discount ? parseFloat(vm.bill.discount) : 0;
                vm.withoutDiscountAmount = grossAmount;
                vm.bill.amount = utilities.round(grossAmount - discount, 2);
                vm.bill.amount = utilities.round(vm.bill.amount, 2);
                if (vm.bill.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.sumAmountTax = function () {
                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.bill.voucherLines.forEach(function (value) {
                    if (value.tax)
                        value.tax = vm.rounding(value.tax);
                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;
                    value.amount = value.debit + value.tax;
                });
                vm.bill.tax = totalTax;
                vm.withoutDiscountAmount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.withoutDiscountAmount = utilities.round(vm.withoutDiscountAmount, 2);
                if (vm.bill.discount != null) {
                    vm.bill.amount = vm.withoutDiscountAmount - vm.bill.discount;
                }
                else {
                    vm.bill.amount = vm.withoutDiscountAmount;
                }
                if (vm.bill.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.bill.contact.currencyDto ? vm.bill.contact.currencyDto.name : null;
                        decimalName = vm.bill.contact.currencyDto ? vm.bill.contact.currencyDto.decimalName : null;
                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);

                    }
                    if (vm.isMultiCurrencyEnabled && vm.bill.id > 0) {
                        currencyName = vm.bill.contact.currency ? vm.bill.contact.currency.name : null;
                        decimalName = vm.bill.contact.currency ? vm.bill.contact.currency.decimalName : null;
                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);

                    }
                    if (vm.isMultiCurrencyEnabled && options.purchaseOrder) {
                        currencyName = options.purchaseOrder.customerCurrency ? options.purchaseOrder.customerCurrency.name : null;
                        decimalName = options.purchaseOrder.customerCurrency ? options.purchaseOrder.customerCurrency.decimalName : null;
                        vm.bill.amountInWords = utilities.toWords(options.purchaseOrder.amount, currencyName, decimalName);

                    }
                    if (vm.isMultiCurrencyEnabled && options.grnId) {
                        currencyName = vm.bill.contact.currency ? vm.bill.contact.currency.name : null;
                        decimalName = vm.bill.contact.currency ? vm.bill.contact.currency.decimalName : null;
                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);

                    }

                }
            };

            vm.sumAmountGrn = function () {
                if (vm.bill == null || vm.grns == null)
                    return 0;
                vm.bill.amountInWords = "";
                vm.bill.amount = 0;
                vm.bill.tax = 0;
                vm.selectedgrns = vm.grns.filter(e => e.selected);
                vm.selectedgrns.forEach(function (value) {
                    for (var i = 0; i < value.voucherLines.length; i++) {
                        vm.bill.amount += parseFloat(value.voucherLines[i].debit + value.voucherLines[i].tax);
                        //vm.bill.tax += parseFloat(value.voucherLines[i].tax);
                    }
                });

                if (vm.bill.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.bill.contact.currencyDto ? vm.bill.contact.currencyDto.name : null;
                        decimalName = vm.bill.contact.currencyDto ? vm.bill.contact.currencyDto.decimalName : null;
                        vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);

                    }
                }
            }
            // Searching Accounts
            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchPrepaidExpense = function (voucherLine, accountId) {
                return billService.getexpenseaccounts({ id: accountId }).then(function (result) {
                    voucherLine.showDate = result.data;
                    voucherLine.showVehicleMessage = "Please Select Vehicle";
                    loadCostCenterInLine(voucherLine);

                });
            };



            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                if (vm.bill.voucherSubTypeId == 41 && vm.isAllowGeneralBillOnCustomerEnabled) {
                    return directoryService.search({ keyword: $select.search, includeSupplierAndCustomer: true }).then(function (response) {
                        vm.suppliers = response.data.items;
                    });
                } else {
                    return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                        vm.suppliers = response.data.items;
                    });
                }
            };


            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };


            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.searchResults = null; return null; }

                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            vm.onItemSelected = function (voucherLine) {
                if (voucherLine) {

                    if (voucherLine.job) {

                        voucherLine.vehicleId = voucherLine.job.vehicleId;
                        voucherLine.vehicle = voucherLine.job.vehicle;
                    }
                }
            };


            vm.searchMasterAgreement = function ($select) {
                if ($select.search == "") { vm.masterAgreement = null; return null; }
                leaseMasterAgreementService.searchMasterAgreementsForVouchers({ keyword: $select.search }).then(function (response) {
                    vm.masterAgreement = response.data.items;
                });
            };

            // extended search using search contact popup
            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.bill.contact = supplier;
                        if (vm.isTaxCodeEnabled && vm.bill.contact) {
                            if (vm.bill.contact.taxCodeId > 0 && vm.bill.contact.taxCode && !vm.bill.contact.isTaxExempted) {
                                vm.bill.taxPercent = vm.bill.contact.taxCode.taxPercent;

                            }
                            else {
                                if (vm.branchTaxPercentage)
                                    vm.bill.taxPercent = vm.bill.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                            }
                            vm.bill.voucherLines.forEach(row => {
                                vm.calculateTaxPerRow(row);
                            });
                        }

                    }
                });
            };

            vm.searchSupplierAndCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return -1;
                        },
                        type: function () {
                            return -1;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.bill.contact = supplier;
                        if (vm.isTaxCodeEnabled && vm.bill.contact) {
                            if (vm.bill.contact.taxCodeId > 0 && vm.bill.contact.taxCode && !vm.bill.contact.isTaxExempted) {
                                vm.bill.taxPercent = vm.bill.contact.taxCode.taxPercent;

                            }
                            else {
                                if (vm.branchTaxPercentage)
                                    vm.bill.taxPercent = vm.bill.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                            }
                            vm.bill.voucherLines.forEach(row => {
                                vm.calculateTaxPerRow(row);
                            });
                        }
                    }
                });
            };

            vm.searchVehiclePopup = function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroup: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.bill.vehicle = result;
                    }
                });
            };

            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            function getExpenses() {
                expenseTypeService.getExpenseTypes().success(function (data) {
                    vm.expenseTypes = data.items;
                });
            }

            vm.getStockGrnBySupplierId = function () {
                vm.loading = true;
                vm.showBillVoucherLines = false;
                var billVoucherNo = vm.bill.voucherNo || null;
                grnAppService.getStockGrnBySupplierId({ id: vm.bill.contact.id }, billVoucherNo).success(function (result) {
                    vm.grns = result.items;
                    if (vm.bill.id)
                        markSelectedGrns();
                    else
                        vm.sumAmountGrn();
                })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            function markSelectedGrns() {
                if (!vm.bill.additionalInfo || !vm.grns) return;
                var selectedIds = JSON.parse(vm.bill.additionalInfo).map(function (g) { return g.id; });
                vm.grns.forEach(function (row) {
                    row.selected = selectedIds.indexOf(row.id) !== -1;
                });
                vm.sumAmountGrn();
            }

            vm.getAssetGrnBySupplierId = function () {
                vm.loading = true;
                grnAppService.getAssetGrnBySupplierId({ id: vm.bill.contact.id }).success(function (result) {
                    vm.grns = result.items;
                })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            vm.applyChangeToAll = function () {
                angular.forEach(vm.grns, function (row) {
                    row.selected = vm.allSelected;
                });
                vm.sumAmountGrn();
            };

            vm.applyChange = function (row) {
                vm.sumAmountGrn();
            };
            //Add row
            vm.addRow = function () {
                if (vm.taxCategoryChangeableInBill) {
                    vm.bill.taxPercent = vm.taxPercent;
                }
                vm.bill.voucherLines.push(billLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.bill.voucherLines.indexOf(obj);
                vm.bill.voucherLines.splice(index, 1);
                vm.sumAmountTax();
            };

            vm.clearBill = function () {
                vm.bill.discount = 0;
                vm.bill.amountInWords = "";
                vm.bill.amount = 0;
                vm.bill.taxPercent = vm.taxPercent;
                vm.withoutDiscountAmount = 0;
                vm.bill.tax = 0;
                vm.bill.voucherLines = [];
                vm.bill.date = new Date(Date.now());
                vm.addRow();
            };
            vm.onVehicleChange = function (voucherLine) {
                if (voucherLine && voucherLine.vehicle) {
                    voucherLine.vehicleId = voucherLine.vehicle.id;
                    if (voucherLine.vehicle) {
                        voucherLine.textField1 = voucherLine.vehicle.chassisNo;
                    }
                }
            };


            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.loanOptionSelected = function () {
                if (vm.bill.isPaymentPlanDefined)
                    vm.bill.voucherLines.forEach(e => e.quantity = 1);
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.calculateItemPrice = function (voucherLine) {

                if (voucherLine.quantity > -1) {
                    voucherLine.debit = voucherLine.price * voucherLine.quantity;
                }

                if (voucherLine.discount > -1 && voucherLine.discount <= voucherLine.debit) {
                    voucherLine.debit = voucherLine.debit - voucherLine.discount;
                }
            };

            vm.getUnitOfMeasures = function () {
                vm.loading = true;
                unitOfMeasureAppService.getUnitOfMeasures()
                    .success(function (result) {
                        vm.unitOfMeasures = result.items;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            function loadCostCenterInLine(line) {
                line.showCostCenter = false;
                line.costCenters = [];
                if (line.account.accountCategory === 4 || line.account.accountCategory === 5 || line.showDate) {
                    line.showCostCenter = true;
                }
                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 3) {
                    line.disableCostCenter = true;
                    if (line.showDate)
                        line.disableCostCenter = false;
                }
                else if (line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                    line.disableCostCenter = false;
                }
            }

            // Import Code
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                vm.bill.voucherLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    billService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.bill.voucherLines = result;

                            angular.forEach(vm.bill.voucherLines, function (value, key) {

                                if (vm.isPostTaxInclusive) {
                                    value.amount = value.debit;

                                    vm.calculateCreditAndTaxFromExcel(value);
                                }

                                vm.considerTaxAsTaxPercentage(value);

                                /*vm.calculateCreditAndTax(value);*/

                                if (vm.bill.voucherLines && vm.bill.voucherLines.length > 0) {
                                    let firstLine = vm.bill.voucherLines[0];

                                    if (firstLine.poNo) {
                                        vm.bill.parentVoucherId = firstLine.poNo.id;
                                        vm.poNo = firstLine.poNo;
                                    }
                                }


                                if (value.fromDate && value.toDate)
                                    value.showDate = true;
                                if (vm.bill.fromDate === "0001-01-01T00:00:00")
                                    vm.bill.fromDate = null;
                                if (value.vehicleId !== null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId !== null && value.contactId > 0)
                                    value.contactShow = true;

                            });

                            if (vm.bill.voucherLines.length == 0)
                                vm.addRow();

                            /*vm.sumAmount();*/
                            vm.sumAmountExcel();

                        })
                        .finally(function () { vm.loading = false; });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            vm.uploaderAssetBillRows = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploaderAssetBillRows.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                vm.bill.voucherLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    billService.assetBillImportFromExcel(fileName)
                        .success(function (result) {
                            vm.bill.voucherLines = result;

                            angular.forEach(vm.bill.voucherLines, function (value, key) {

                                if (vm.isPostTaxInclusive) {
                                    value.amount = value.debit;
                                    /*  vm.calculateCreditAndTax(value);*/
                                    vm.calculateCreditAndTaxFromExcel(value);
                                }



                                if (value.fromDate && value.toDate)
                                    value.showDate = true;
                                if (vm.bill.fromDate === "0001-01-01T00:00:00")
                                    vm.bill.fromDate = null;
                                if (value.vehicleId !== null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId !== null && value.contactId > 0)
                                    value.contactShow = true;

                                vm.calculateItemPrice(value);
                                vm.calculateTaxPerRowForImport(value);
                                vm.considerTaxAsTaxPercentage(value);
                            });

                            if (vm.bill.voucherLines.length == 0)
                                vm.addRow();

                            /* vm.sumAmount();*/
                            vm.sumAmountExcel();

                        })
                        .finally(function () { vm.loading = false; });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploaderAssetBillRows.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            vm.saveGrnBill = function () {
                vm.saving = true;

                if (vm.grns) {
                    vm.selectedGrns = vm.grns.filter(e => e.selected).map(e => {
                        return {
                            id: e.id,
                            voucherNo: e.voucherNo
                        }
                    });
                }

                if (vm.selectedGrns)
                    vm.bill.additionalInfo = JSON.stringify(vm.selectedGrns);

                vm.bill.voucherDocuments = vm.documents;
                billService.createOrUpdateGrnBill({ bill: vm.bill, paymentPlan: vm.paymentPlan }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.bill.id = result;
                    vm.bill.printObj = {
                        id: vm.bill.id,
                        printHeader: false
                    };
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.bill);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            vm.save = function () {
                var voucherLines = [];
                //vm.paymentPlan = {
                //    installments: []
                //};
                vm.bill.contactId = vm.bill.contact.id;
                if (vm.locations.length == 1) vm.bill.locationId = vm.locations[0].id;

                vm.saving = true;

                vm.bill.voucherLines.forEach(function (value) {
                    if (!value.hidden) {

                        if (value.fromDate != null) value.fromDate = moment(value.fromDate).startOf('day');
                        if (value.toDate != null) value.toDate = moment(value.toDate).startOf('day');
                        voucherLines.push(value);
                    }
                });
                vm.bill.voucherLines = voucherLines;

                vm.bill.voucherDocuments = vm.documents;
                vm.paymentPlan.totalAmount = vm.bill.voucherLines.filter(e => !e.isLoanRow).reduce((p, c) => p + c.debit + c.tax, 0);
                if (!vm.isLoanEnabled) {
                    if (vm.bill.voucherSubTypeId != 43 || !vm.paymentPlan.installments || vm.paymentPlan.installments.length < 1) {
                        vm.paymentPlan = null;
                    }
                }
                else {
                    if (!vm.showLoanForGeneralBill && vm.bill.voucherSubTypeId != 41 && !vm.paymentPlan.installments && vm.paymentPlan.installments.length < 1) {
                        vm.paymentPlan = null;
                    }
                }
                /* vm.bill.parentVoucher = null;*/
                if (options.isClone) {
                    vm.bill.id = null;
                }
                if (vm.assignVehicleBranchInVoucherLine) {
                    vm.bill.voucherLines.forEach(function (line) {
                        if (line.vehicle && !line.locationId) {
                            line.locationId = line.vehicle.locationId;
                        }
                    });

                }

                billService.createOrUpdateBill({ bill: vm.bill, paymentPlan: vm.paymentPlan }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.bill.id = result;
                    vm.bill.printObj = {
                        id: vm.bill.id,
                        printHeader: false
                    };
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.bill);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            var saveAndPrint = function (b) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bill: function () {
                            return b;
                        }
                    }
                });
            };
            function init() {

                vm.loading = true;
                vm.disableSelection = false;
                getLocations();
                getExpenses();
                getCostCenters();
                vm.branchTaxCode();
                if (vm.isAccountsEnabled)
                    getExpenseAccountsAdvanceSetting();

                if (vm.isAssetsEnabled)
                    getAssetTypes();
                if (options.grnId) {
                    grnAppService.getGrnForEdit({ id: options.grnId }).success(
                        function (result) {
                            vm.bill = result;
                            if (options.currencyId) {
                                vm.bill.currencyId = options.currencyId;
                                vm.bill.currencyRate = options.currencyRate;
                            }
                            vm.bill.refNo = result.refNo2;
                            if (vm.setBillDateAsCurrentDate)
                                vm.bill.date = new Date(Date.now());
                            vm.disableSelection = true;
                            vm.bill.voucherSubTypeId = vm.bill.voucherSubTypeId == 48 ? 42 : vm.bill.voucherSubTypeId == 101 ? 102 : 43;
                            vm.withoutDiscountAmount = vm.bill.amount + vm.bill.discount;
                            vm.bill.id = 0;
                            vm.bill.parentVoucherId = options.grnId;
                            angular.forEach(vm.bill.voucherLines, function (voucherLine) {
                                if (vm.bill.voucherSubTypeId == 42) {
                                    voucherLine.product.unitOfMeasure = voucherLine.unitOfMeasure;
                                    voucherLine.product.unitOfMeasureId = voucherLine.unitOfMeasureId;
                                }
                                voucherLine.id = 0;
                                vm.calculateTaxPerRow(voucherLine);
                            });
                            vm.sumAmountTax();
                            if (vm.isMultiCurrencyEnabled || options) {
                                if (vm.bill.contact.currency) {
                                    vm.currencyCode = vm.bill.contact.currency.code;
                                }
                                currencyName = vm.bill.contact.currency ? vm.bill.contact.currency.name : null;
                                decimalName = vm.bill.contact.currency ? vm.bill.contact.currency.decimalName : null;
                                vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);

                            }

                        });
                }
                else if (options.assetOrStockPoId) {
                    purchaseOrdersService.getPurchaseOrderForEdit({ id: options.assetOrStockPoId }).success(function (result) {
                        vm.bill = result;
                        vm.disableSelection = true;
                        vm.bill.voucherSubTypeId = vm.bill.voucherSubTypeId == 39 ? 42 : 43;
                        vm.withoutDiscountAmount = vm.bill.amount + vm.bill.discount;
                        vm.bill.id = 0;
                        vm.bill.parentVoucherId = options.assetOrStockPoId;

                        angular.forEach(vm.bill.voucherLines, function (voucherLine) {
                            if (vm.bill.voucherSubTypeId == 42) {
                                voucherLine.product.unitOfMeasure = voucherLine.unitOfMeasure;
                                voucherLine.product.unitOfMeasureId = voucherLine.unitOfMeasureId;
                            }

                            voucherLine.id = 0;
                            vm.calculateTaxPerRow(voucherLine);
                        });
                        vm.sumAmountTax();
                    });
                }
                else {
                    billService.getBillForEdit({ id: options.billId }).success(
                        function (result) {

                            vm.bill = result;
                            vm.showBillVoucherLines = false;

                            if (vm.bill.id && vm.bill.voucherSubTypeId == 61 && vm.bill.contact)
                                vm.getStockGrnBySupplierId();

                            if (vm.isMultiCurrencyEnabled && vm.bill.id > 0) {

                                if (vm.bill.contact.currency) {
                                    vm.currencyCode = vm.bill.contact.currency.code;
                                    currencyName = vm.bill.contact.currency ? vm.bill.contact.currency.name : null;
                                    decimalName = vm.bill.contact.currency ? vm.bill.contact.currency.decimalName : null;
                                    vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);
                                }
                            }
                            if (vm.isPostTaxInclusive) {
                                if (vm.bill) {
                                    if (vm.bill.voucherLines.length > 0) {
                                        vm.bill.voucherLines.forEach(function (value) {
                                            value.amount = value.debit + value.tax;
                                        });
                                    }
                                }
                            }
                            vm.documents = vm.bill.voucherDocuments;
                            if (vm.bill.id < 1) {
                                vm.isEditMode = false;
                                vm.bill.voucherNo = null;
                                vm.bill.locationId = appSession.user.locationId;
                                vm.bill.fromDate = null;
                                vm.bill.taxPercent = vm.taxPercent;
                                vm.bill.voucherSubTypeId = 41;
                                vm.bill.contact = {};
                            } else {
                                vm.isEditMode = true;
                                vm.bill.notes = result.notes;

                                angular.forEach(vm.bill.voucherLines, function (value, key) {
                                    if (vm.bill.voucherSubTypeId === 42) {
                                        value.product.unitOfMeasure = value.unitOfMeasure;
                                        value.product.unitOfMeasureId = value.unitOfMeasureId;
                                    }

                                    if (value.fromDate && value.toDate)
                                        value.showDate = true;
                                    if (vm.bill.fromDate === "0001-01-01T00:00:00")
                                        vm.bill.fromDate = null;
                                    if (value.vehicleId !== null && value.vehicleId > 0)
                                        value.vehicleShow = true;
                                    if (value.contactId !== null && value.contactId > 0)
                                        value.contactShow = true;

                                });
                            }
                            if (vm.bill.voucherLines.length === 0)
                                vm.addRow();
                            vm.bill.voucherLines = vm.bill.voucherLines.filter(e => !e.hidden);
                            if (options.purchaseOrder && !vm.isEditMode) {

                                vm.bill.discount = options.purchaseOrder.discount;
                                var purchaseOrder = angular.copy(options.purchaseOrder);

                                vm.bill.contactId = purchaseOrder.contact.id;
                                vm.bill.contact = purchaseOrder.contact;
                                vm.bill.parentVoucherId = purchaseOrder.id;
                                vm.bill.voucherLines = [];
                                if (vm.isTaxCodeEnabled) {
                                    vm.bill.taxPercent = purchaseOrder.taxPercent;
                                }
                                else {
                                    vm.bill.taxPercent = vm.taxPercent;
                                }


                                angular.forEach(purchaseOrder.voucherLines, function (purchaseOrderline) {
                                    if (purchaseOrderline.debit > 0) {
                                        var billine = billLineObject();

                                        billine.description = purchaseOrderline.description;
                                        billine.vehicleId = purchaseOrderline.vehicleId;
                                        billine.vehicle = purchaseOrderline.vehicle;
                                        billine.vehicleModelId = purchaseOrderline.vehicleModelId;
                                        billine.vehicleModel = purchaseOrderline.vehicleModel;
                                        billine.debit = purchaseOrderline.debit;
                                        billine.job = purchaseOrderline.job;
                                        billine.jobId = purchaseOrderline.jobId;
                                        billine.quantity = purchaseOrderline.quantity;
                                        billine.price = purchaseOrderline.price;
                                        billine.textField1 = purchaseOrderline.textField1;
                                        vm.bill.voucherLines.push(billine);
                                    }
                                });

                                vm.sumAmount();
                                if (vm.isMultiCurrencyEnabled) {
                                    if (options.purchaseOrder.contact) {
                                        if (options.purchaseOrder.customerCurrency) {


                                            vm.currencyCode = options.purchaseOrder.customerCurrency.code;
                                            currencyName = options.purchaseOrder.customerCurrency ? options.purchaseOrder.customerCurrency.name : null;
                                            decimalName = options.purchaseOrder.customerCurrency ? options.purchaseOrder.customerCurrency.decimalName : null;
                                            vm.bill.amountInWords = utilities.toWords(options.purchaseOrder.amount, currencyName, decimalName);
                                            vm.bill.currencyId = options.purchaseOrder.customerCurrency.id;
                                            vm.bill.currencyRate = options.purchaseOrder.customerCurrency.currencyToBaseRate;
                                        }
                                        else if (vm.bill.contact) {
                                            if (vm.bill.contact.currency) {
                                                vm.currencyCode = vm.bill.contact.currency.code;
                                                currencyName = vm.bill.contact.currency ? vm.bill.contact.currency.name : null;
                                                decimalName = vm.bill.contact.currency ? vm.bill.contact.currency.decimalName : null;
                                                vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);
                                            }

                                        }
                                        else {
                                            vm.currencyCode = vm.defaultCurrencyCode;
                                        }
                                    }
                                    else {
                                        vm.currencyCode = vm.defaultCurrencyCode;
                                    }
                                }
                            }
                        }).finally(function () {
                            vm.loading = false;
                        });

                }

            }
            vm.getUnitOfMeasures();
            init();
        }]);
