// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:328358-328970
appModule.controller('tenant.views.crs.vouchers.bills.viewModal', ['$uibModal', 'options', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.linkedPrepaidExpense', 'abp.services.app.directory', 'abp.services.app.commonLookup',
        'abp.services.app.bill', 'abp.services.app.expenseType', 'utilities', 'abp.services.app.account', 'appSession', 'abp.services.app.costCenter',
        'abp.services.app.item', 'abp.services.app.unitOfMeasure', 'abp.services.app.purchaseOrder', 'abp.services.app.grn', 'abp.services.app.job', 'abp.services.app.asset', 'abp.services.app.bankAccount', 'abp.services.app.vehicleModel',
        function ($uibModal, options, $uibModalInstance, vehicleService, linkedPrepaidExpenseService, directoryService, commonLookupService,
            billService, expenseTypeService, utilities, accountService, appSession, costCenterService, itemAppService, unitOfMeasureAppService, purchaseOrdersService, grnAppService, jobAppService, assetService, bankAccountService, vehicleModelService) {
            var vm = this;
            vm.loading = false;
            vm.vehicles = [];
            vm.suppliers = [];
            vm.linkedPrepaidExpense = [];
            vm.billingMethods = [];
            vm.locations = [];
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.documents = [];
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Bills");
            vm.expenseTypes = [];
            vm.saveAndPrint = false;
            vm.generalBillItemQuantityWise = utilities.parseBoolean(abp.setting.get("App.Speed.Common.GeneralBillItemQuantityWise"));
            vm.taxCategoryChangeableInBill = abp.features.isEnabled('CRS.Vouchers.Bills.TaxCategoryChangeableInBill');
            vm.addMasterAgreementInVouchers = abp.features.isEnabled("CRS.CustomFeatures.MasterAgreementInVouchers");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.manualBillNo = utilities.parseBoolean(abp.setting.get("App.General.ManualBillNo"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.AllActionsOnOtherBranchBills');
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.documentsForBillEnable = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForBills");
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isAgreementNoFieldInGeneralBill = utilities.parseBoolean(abp.setting.get("App.General.AgreementNoFieldInGeneralBill"));
            vm.isShowPaidTo = utilities.parseBoolean(abp.setting.get("App.General.PaidToInBills"));
            vm.isCustomFieldOneIsMandotoryInBill = utilities.parseBoolean(abp.setting.get("App.General.IsCustomFieldOneIsMandotoryInBill"));
            vm.grnAsFinancialVoucher = utilities.parseBoolean(abp.setting.get("App.General.GrnAsFinancialVoucher"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.isSaleInventoryVehicleEnabled = abp.features.isEnabled("CRS.Accounts.SaleInventoryVehicle");
            vm.showLoanForGeneralBill = abp.setting.getBoolean("App.Speed.Common.ShowLoanForGeneralBill");
            if (vm.isPostTaxInclusive)
                vm.isTaxInclusive = false;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.IsEnableOPtionalLookUp = false;
            // Searching Contacts
            vm.bill = {};

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

            vm.getTaxCategoryName = function (id) {
                if (id == 1) {
                    return "Standard";
                }
                else if (id == 2) {
                    return "Tax Exempted";
                }
                else if (id == 3) {
                    return "Zero Rated";
                }
                else {
                    return " ";
                }
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

                line.item = {};
                line.itemQuantity = 0;
                line.amount = 0;
                line.tax = 0;

                return line;
            }

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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


            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.invoice.taxPercent = vm.taxPercent;
                else
                    vm.invoice.taxPercent = 0;
            };

            vm.calculateTaxPerRow = function (row) {
                if (vm.bill == null)
                    return 0;

                if (row == null)
                    return 0;

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

                }


                vm.bill.amountInWords = '';

                vm.bill.tax = totalTax;
                vm.bill.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
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
                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;

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
                }
            };

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

                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
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

           

            vm.clearBill = function () {
                vm.bill.discount = 0;
                vm.bill.amountInWords = "";
                vm.bill.amount = 0;
                vm.bill.taxPercent = vm.taxPercent;
                vm.withoutDiscountAmount = 0;
                vm.bill.tax = 0;
                vm.bill.voucherLines = [];

                vm.addRow();
            };


            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
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

            vm.getStockGrnByRefNo = function (voucherNo) {
                vm.loading = true;
                grnAppService.getStockGrnByRefNo(voucherNo).success(function (result) {
                    vm.grns = result.items;
                })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            vm.getAssetGrnByRefNo = function (voucherNo) {
                vm.loading = true;
                grnAppService.getAssetGrnByRefNo(voucherNo).success(function (result) {
                    vm.grns = result.items;
                })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            function getBankAccounts() {
                vm.loading = true;
                bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                    vm.bankAccounts = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.openViewAllocationsModal = function (billId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/allocationsViewModel.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.allocationsViewModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return billId;
                        }
                    }
                });
            };
            function init() {
                vm.loading = true;
                vm.disableSelection = false;
                getLocations();
                getExpenses();
                getBankAccounts();
                if (vm.isCostCenterEnabled)
                    getCostCenters();

                if (vm.isAssetsEnabled)
                    getAssetTypes();

                billService.getBillForEdit({ id: options.billId }).success(
                    function (result) {

                        vm.bill = result;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.bill.contact.currency) {
                                vm.currencyCode = vm.bill.contact.currency.code;
                                currencyName = vm.bill.contact.currency ? vm.bill.contact.currency.name : null;
                                decimalName = vm.bill.contact.currency ? vm.bill.contact.currency.decimalName : null;
                                vm.bill.amountInWords = utilities.toWords(vm.bill.amount, currencyName, decimalName);
                            }
                        }
                        vm.bill.voucherLines.filter(e => e.description && e.description.toLowerCase() == "interest").forEach(e => e.isLoanRow = true);
                        vm.withoutDiscountAmount = vm.bill.amount + vm.bill.discount;
                        vm.documents = vm.bill.voucherDocuments;
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
                        if (vm.bill.voucherSubTypeId == 61 ) {
                            vm.getStockGrnByRefNo(vm.bill.voucherNo);
                        }
                        if (vm.bill.voucherSubTypeId == 62) {
                            vm.getAssetGrnByRefNo(vm.bill.voucherNo);
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            vm.getUnitOfMeasures();
            init();
        }]);
