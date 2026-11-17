// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:376726-378215
appModule.controller('tenant.views.crs.vouchers.payments.viewModal', ['$uibModal', 'paymentId', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.directory',
        'abp.services.app.billingMethod', 'abp.services.app.commonLookup', 'abp.services.app.payment', 'abp.services.app.expenseType', 'abp.services.app.agreement', 'abp.services.app.account',
        '$filter', 'abp.services.app.allocation', 'agreement', 'utilities', 'appSession', 'abp.services.app.bankAccount', 'abp.services.app.job', 'abp.services.app.costCenter', 'abp.services.app.item', 'abp.services.app.unitOfMeasure', 'abp.services.app.currency', 'abp.services.app.department',
        function ($uibModal, paymentId, $uibModalInstance, vehicleService, directoryService, billingMethodService, commonLookupService,
            paymentService, expenseTypeService, agreementService, accountService, $filter, allocationService, agreement, utilities, appSession, bankAccountService, jobAppService, costCenterService, itemAppService, unitOfMeasureAppService, currencyAppService, departmentService) {
            var vm = this;

            //changing for debit card
            vm.isDebitCardEnabledForPayment = "true";
            vm.vehicles = [];
            vm.customers = [];
            vm.billingMethods = [];
            vm.locations = [];
            vm.expenseTypes = [];
            vm.documents = [];
            vm.saveAndPrint = false;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isHeadRowFound = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.contactTypeLabel = app.localize('Contact');
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isBillFeatureEnabled = abp.features.isEnabled("CRS.Vouchers.Bills");
            vm.documentsForExpensePayment = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForExpensePayment");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.isShowAgreementInPayments = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAgreementInPayment"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isPostDatedChequeDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequeDirectlyToBank"));
            vm.isPostDatedChequePayableDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequePayableDirectlyToBank"));
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.fuelAverageforPettyCashPayment = utilities.parseBoolean(abp.setting.get("App.General.FuelAverageUsingPettyCashPayment"));
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isHRMEnabled = abp.features.isEnabled("HRM");
            vm.isHRMDeductionEnabled = abp.features.isEnabled("HRM.Deductions");
            vm.isDepartmentEnabled = abp.features.isEnabled("Core.Departments");
            vm.isDepartmentwiseSalaryPaymentForPayrollEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Hrm.DepartmentwiseSalaryPaymentForPayroll"));

            vm.allActionsOnOtherBranch = false;
            vm.paymentTypes = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.paymentType = "";
            vm.supplierPaymentEnableSave = true;
            vm.selectme = "Select Vehicle";
            vm.showDebitField = true;
            vm.showCreditField = true;
            vm.isEnableDueAmount = true;
            vm.isCurrentDateBigger = false;
            vm.showSalaryPayment = false;
            vm.showStaffAdvancePayment = false;
            vm.showStaffLoanPayment = false;
            vm.disablePaymentMethod = false;
            vm.currentDate = moment().endOf('day');
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isAgreementNoFieldInGeneralAndPettyCashPayments = utilities.parseBoolean(abp.setting.get("App.General.AgreementNoFieldInGeneralAndPettyCashPayments"));
            vm.isShowPaidTo = utilities.parseBoolean(abp.setting.get("App.General.PaidToInPayments"));
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isAllowGeneralBillOnCustomerEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowGeneralBillOnCustomer"));

            vm.currencyCode = abp.setting.get("App.General.CurrencyCode");
            if (vm.isPostTaxInclusive) {
                vm.isTaxInclusive = false;
            }

            // Searching Vehicles
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            // Searching Contacts
            vm.searchContactGeneralPayment = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.localize = function (key) {
                if (key == null)
                    return '';
                return app.localize(key);
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };

            vm.insertDueAmountOnClick = function (allocation) {
                if (parseFloat(allocation.allocatedNow) == 0) {
                    allocation.allocatedNow = vm.rounding(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNow);
                }
            };

            function getPaymentTypes() {
                vm.paymentTypes.push({ voucherSubTypeId: 3, name: app.localize('CustomerPayment') });
                vm.paymentTypes.push({ voucherSubTypeId: 71, name: app.localize('AdvancePayment') });

                if (vm.isBillFeatureEnabled)
                    vm.paymentTypes.push({ voucherSubTypeId: 4, name: app.localize('SupplierPayment') });
                if (vm.isAccountFeatureEnabled) {
                    vm.paymentTypes.push({ voucherSubTypeId: 5, name: app.localize('StaffPayment') });
                    vm.paymentTypes.push({ voucherSubTypeId: 6, name: app.localize('PettyCashExpensePayment') });
                    vm.paymentTypes.push({ voucherSubTypeId: 21, name: app.localize('GeneralPayment') });
                }
                else
                    vm.paymentTypes.push({ voucherSubTypeId: 6, name: app.localize('ExpensePayment') });
                if (vm.isWorkshopEnabled)
                    vm.paymentTypes.push({ voucherSubTypeId: 59, name: app.localize('StockPurchasePayment(ForJob)') });
                if (vm.isHRMEnabled)
                    vm.paymentTypes.push({ voucherSubTypeId: 114, name: app.localize('SalaryPayment') });
                if (vm.isHRMDeductionEnabled) {
                    vm.paymentTypes.push(
                        { voucherSubTypeId: 1001, name: app.localize('StaffAdvancePayment') },
                        { voucherSubTypeId: 1002, name: app.localize('StaffLoanPayment') });
                }
            }

            vm.searchAdditionalDriverPopoup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (requestedBy) {
                    vm.payment.requestedBy = requestedBy;
                    vm.payment.requestedById = requestedBy.id;
                });
            };

            // On the change of payment type
            vm.paymentTypeChanged = function () {
                vm.payment.fromDate = null;
                vm.payment.refNo = null;
                if (vm.payment.voucherSubTypeId == 3 && vm.isAllowGeneralBillOnCustomerEnabled) { //customer payment
                    vm.showAgreement = true;
                    vm.showStaff = false;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showExpensePayment = false;
                    vm.showSupplier = true;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Customer');
                    vm.contactType = 2;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.payment.voucherLines = [];
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.amount = null;
                    vm.payment.tds = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                } else if (vm.payment.voucherSubTypeId == 3 && !vm.isAllowGeneralBillOnCustomerEnabled) { //customer payment
                    vm.showAgreement = true;
                    vm.showStaff = false;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showExpensePayment = false;
                    vm.showSupplier = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Customer');
                    vm.contactType = 2;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.payment.voucherLines = [];
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.amount = null;
                    vm.payment.tds = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                }
                if (vm.payment.voucherSubTypeId == 71) { //Advance payment
                    vm.showAgreement = true;
                    vm.showStaff = false;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showExpensePayment = false;
                    vm.showSupplier = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Supplier');
                    vm.contactType = 3;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.payment.voucherLines = [];
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.amount = null;
                    vm.payment.tds = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                }
                else if (vm.payment.voucherSubTypeId == 4) { //supplier payment

                    vm.showSupplier = true;
                    vm.showStaff = false;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Supplier');
                    vm.contactType = 3;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.payment.voucherLines = [];
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                }
                else if (vm.payment.voucherSubTypeId == 5) { //staff payment
                    vm.showStaff = true;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showSupplier = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Staff');
                    vm.contactType = 1;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.voucherLines = [];
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                    vm.addRow();

                }
                else if (vm.payment.voucherSubTypeId == 6) { //expense payment
                    vm.showExpensePayment = true;
                    vm.showAgreement = false;
                    vm.showStaff = false;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showSupplier = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Contact');
                    vm.contactType = null;
                    vm.accountCategory = null;
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.voucherLines = [];
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                    vm.addRow();
                }
                else if (vm.payment.voucherSubTypeId == 21) { // General Payment
                    vm.showSupplier = false;
                    vm.showStaff = false;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showGeneralPayment = true;
                    vm.showstockpayment = false;
                    //vm.contactTypeLabel = app.localize('Supplier');
                    //vm.contactType = 3;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.payment.voucherLines = [];
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                }
                else if (vm.payment.voucherSubTypeId == 59) { // General Payment
                    vm.showstockpayment = true;
                    vm.showSupplier = false;
                    vm.showStaff = false;
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showGeneralPayment = false;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.payment.voucherLines = [];
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                }
                else if (vm.payment.voucherSubTypeId == 114) { //salaryPayment
                    vm.showSalaryPayment = true;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = false;
                    vm.showStaff = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showSupplier = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Staff');
                    vm.contactType = 1;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.voucherLines = [];
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                    vm.addRow();

                }
                else if (vm.payment.voucherSubTypeId == 1001) { //StaffAdvancePayment
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = true;
                    vm.showStaffLoanPayment = false;
                    vm.showStaff = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showSupplier = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Staff');
                    vm.contactType = 1;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.voucherLines = [];
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                    vm.addRow();
                }
                else if (vm.payment.voucherSubTypeId == 1002) { //StaffLoanPayment
                    vm.showSalaryPayment = false;
                    vm.showStaffAdvancePayment = false;
                    vm.showStaffLoanPayment = true;
                    vm.showStaff = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showSupplier = false;
                    vm.showGeneralPayment = false;
                    vm.showstockpayment = false;
                    vm.contactTypeLabel = app.localize('Staff');
                    vm.contactType = 1;
                    vm.payment.contactId = null;
                    vm.payment.contact = null;
                    vm.accountCategory = null;
                    vm.allocationData = null;
                    vm.closedAgreements = false;
                    vm.payment.voucherLines = [];
                    vm.payment.tds = null;
                    vm.payment.amount = null;
                    vm.payment.amountInWords = null;
                    vm.payment.tax = null;
                    vm.addRow();
                }
                if (vm.payment.voucherLines.length == 0)
                    vm.addRow();
            };

            // On The Change Of Account In GeneralPayment

            vm.accountChangedGeneralPayment = function (line) {
                line.contact = null;
                if ((line.account.accountCategory == 4 || line.account.accountCategory == 5) && vm.taxPercent > 0 && !vm.isTaxInclusive) {
                    line.showTax = true;
                    if (line.debit > 0)
                        line.showDebitField = true;
                    else if (line.credit > 0)
                        line.showCreditField = true;

                } else
                    line.showTax = false;

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
                vm.loadCostCenterInLine(line);

                line.taxCredit = 0;
                line.taxDebit = 0;
                // line.tax = 0;
                vm.sumAmount();
            };

            //Call Only In General Payment EditMode Case
            vm.accountChangedGeneralPaymentEdit = function (line) {
                //line.contact = null;
                if ((line.account.accountCategory == 4 || line.account.accountCategory == 5) && vm.taxPercent > 0 && !vm.isTaxInclusive) {
                    line.showTax = true;
                    if (line.debit > 0)
                        line.showDebitField = true;
                    else if (line.credit > 0)
                        line.showCreditField = true;

                } else
                    line.showTax = false;

                if (line.account.accountCategory == 4 || line.account.accountCategory == 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }
                else if (line.contactId != null && line.contactId > 0) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null,
                        line.vehicle = null;
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
                vm.loadCostCenterInLine(line);
                line.taxCredit = 0;
                line.taxDebit = 0;
                // line.tax = 0;
                vm.sumAmount();
            };

            // on The Change Of Contact
            vm.onContactChange = function () {
                vm.payment.refNo = null;
                vm.payment.fromDate = null;
                if (vm.payment.voucherSubTypeId == 4) //if supplier payment then re get allocations on supplier change
                    getAllocations();
                //if (vm.showStaff) {
                //    vm.payment.voucherLines.forEach(function (value) {
                //        value.account = null;
                //        value.accountId = null;
                //    });
                //    if (vm.payment.contact)
                //        getStaffAccounts();
                //}

            };

            function getAllCurrencies() {
                currencyAppService.getCurrencies().then(function (response) {
                    vm.allCurrencies = response.data.items;
                });
            };

            //function getCurrencies() {
            //    commonLookupService.getCurrencies({}).success(function (data) {
            //        vm.currencies = data.items;
            //    });
            //};

            function getStaffAccounts() {
                vm.loading = true;
                accountService.getStaffAccounts({ id: vm.payment.contact.contactGroupId }).success(function (result) {
                    vm.accountsStaff = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.amountChanged = function () {

                if (vm.payment.amount == 0 || angular.isUndefined(vm.payment.amount)) {
                    vm.payment.amountInWords = '';
                    return;
                }
                vm.payment.amountInWords = utilities.toWords(vm.payment.amount);

            };

            // Searching Contact
            vm.searchContact = function ($select, contactType) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: contactType, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
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

            //Searhing Vehicles
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            function paymentLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.fromDate = null;
                line.toDate = null;
                line.MiscDate = null;
                line.job = null;
                line.jobId = null;
                line.product = null;
                line.productId = null;
                line.unitOfMeasureId = null;
                line.quantity = 0;
                line.price = 0;
                line.amount = 0;
                line.tax = 0;
                return line;
            }

            vm.sumAmountTax = function () {
                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.payment.voucherLines.forEach(function (value) {
                    if (!value.hidden) {
                        if (value.debit > 0)
                            totalAmount = totalAmount + parseFloat(value.debit);
                        if (value.tax > 0) {
                            value.taxable = true;
                            totalTax += utilities.round(value.tax, 2);
                        }
                        else
                            value.taxable = false;
                        value.totalAmountTax = utilities.round((parseFloat(value.tax) + parseFloat(value.debit)), 2);
                    }

                });
                vm.payment.tax = totalTax;
                vm.payment.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.payment.amount = utilities.round(vm.payment.amount, 2);
                if (vm.payment.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.payment.amountInWords = utilities.toWords(vm.payment.amount);
                }
                vm.payment.amountInWords = vm.payment.amount == 0 ? '' : vm.payment.amountInWords;
            };

            vm.searchPrepaidExpense = function (voucherLine, accountId) {
                return paymentService.getexpenseaccounts({ id: accountId }).then(function (result) {
                    voucherLine.showDate = result.data;
                    vm.loadCostCenterInLine(voucherLine);
                });
            };

            function sumAmountExpensePayment() {
                if (vm.payment == null)
                    return 0;

                if (vm.payment.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.payment.voucherLines.length; i++) {
                    if (vm.payment.voucherLines[i].debit != null && !vm.payment.voucherLines[i].hidden) {
                        sum = sum + parseFloat(vm.payment.voucherLines[i].debit);

                        if (vm.payment.taxPercent > 0) {
                            var tax = 0;

                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.payment.voucherLines[i].debit * 100) / (100 + vm.payment.taxPercent);
                                tax = utilities.round(vm.payment.voucherLines[i].debit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(vm.payment.voucherLines[i].debit * vm.payment.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            vm.payment.voucherLines[i].tax = tax;

                            vm.payment.voucherLines[i].totalAmountTax = vm.rounding(vm.payment.voucherLines[i].tax / 1 + vm.payment.voucherLines[i].debit / 1);

                            if (tax > 0)
                                vm.payment.voucherLines[i].taxable = true;
                            //}
                            //else {
                            //    vm.payment.voucherLines[i].tax = 0;
                            //    vm.payment.voucherLines[i].taxable = false;
                            //}
                        }
                        else {
                            vm.payment.voucherLines[i].tax = 0;
                            vm.payment.voucherLines[i].taxable = false;
                        }
                    }

                }


                vm.payment.amountInWords = '';

                vm.payment.tax = totalTax;
                vm.payment.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                vm.payment.amount = utilities.round(vm.payment.amount, 2);
                if (vm.payment.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.payment.amountInWords = utilities.toWords(vm.payment.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };

            }

            ////////////////// Sum amounts Reverse //////////////////
            vm.sumAmountExpensePaymentReverse = function () {
                if (vm.payment == null)
                    return 0;

                if (vm.payment.voucherLines == null)
                    return 0;
                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.payment.voucherLines.length; i++) {
                    if (vm.payment.taxPercent > 0) {
                        var tax = 0;

                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 

                        } else {
                            //prices are without tax. calculate tax and include in total
                            //tax = utilities.round(vm.payment.voucherLines[i].debit * vm.payment.taxPercent / 100, 2);
                            //totalTax += utilities.round(tax, 2);
                            vm.payment.voucherLines[i].debit = utilities.round(((vm.payment.voucherLines[i].totalAmountTax * 100) / (100 + vm.payment.taxPercent)), 2);
                            tax = vm.payment.voucherLines[i].totalAmountTax - vm.payment.voucherLines[i].debit;
                            tax = utilities.round(tax, 2);
                            totalTax += tax;
                        }
                        vm.payment.voucherLines[i].tax = tax;

                        vm.payment.voucherLines[i].totalAmountTax = vm.rounding(vm.payment.voucherLines[i].tax / 1 + vm.payment.voucherLines[i].debit / 1);

                        if (tax > 0)
                            vm.payment.voucherLines[i].taxable = true;
                        //}
                        //else {
                        //    vm.payment.voucherLines[i].tax = 0;
                        //    vm.payment.voucherLines[i].taxable = false;
                        //}
                    }
                    else {
                        vm.payment.voucherLines[i].tax = 0;
                        vm.payment.voucherLines[i].taxable = false;
                    }
                    sum += vm.payment.voucherLines[i].debit;
                }


                vm.payment.amountInWords = '';

                vm.payment.tax = totalTax;
                vm.payment.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                vm.payment.amount = utilities.round(vm.payment.amount, 2);
                if (vm.payment.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.payment.amountInWords = utilities.toWords(vm.payment.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };

            }
            ///////////////// End ///////////////////////////////////


            vm.sumAmount = function () {
                if (vm.showExpensePayment) {
                    sumAmountExpensePayment();
                }
                else {
                    if (vm.payment == null)
                        return 0;

                    if (vm.payment.voucherLines == null)
                        return 0;
                    var sum = 0;
                    var debitSum = 0;
                    var creditSum = 0;
                    for (var i = 0; i < vm.payment.voucherLines.length; i++) {
                        //if (vm.payment.voucherLines[i].debit != null)
                        //    debitSum = debitSum + parseFloat(vm.payment.voucherLines[i].debit);
                        //if (vm.payment.voucherLines[i].credit != null)
                        //    creditSum = creditSum + parseFloat(vm.payment.voucherLines[i].credit);
                        if (vm.payment.voucherLines[i].debit != null && !vm.payment.voucherLines[i].hidden)
                            debitSum = debitSum + utilities.round(vm.payment.voucherLines[i].debit, 2);
                        if (vm.payment.voucherLines[i].taxDebit && !vm.payment.voucherLines[i].hidden) {
                            debitSum = debitSum + utilities.round(vm.payment.voucherLines[i].taxDebit, 2);
                            vm.payment.voucherLines[i].tax = vm.payment.voucherLines[i].taxDebit;
                        }
                        //else
                        //    vm.payment.voucherLines[i].tax = 0

                        debitSum = utilities.round(debitSum, 2);

                        if (vm.payment.voucherLines[i].credit != null && !vm.payment.voucherLines[i].hidden)
                            creditSum = creditSum + utilities.round(vm.payment.voucherLines[i].credit, 2);
                        if (vm.payment.voucherLines[i].taxCredit && !vm.payment.voucherLines[i].hidden) {
                            creditSum = creditSum + utilities.round(vm.payment.voucherLines[i].taxCredit, 2);
                            vm.payment.voucherLines[i].tax = vm.payment.voucherLines[i].taxCredit;
                        }
                        //else
                        //    vm.payment.voucherLines[i].tax = 0

                        creditSum = utilities.round(creditSum, 2);


                        //if (vm.payment.voucherLines[i].debit != null && !vm.payment.voucherLines[i].hidden)
                        //    sum = sum + utilities.round(vm.payment.voucherLines[i].debit, 2);
                        //if (vm.payment.voucherLines[i].taxDebit && !vm.payment.voucherLines[i].hidden) {
                        //    sum = sum + utilities.round(vm.payment.voucherLines[i].taxDebit, 2);
                        //}
                        //sum = utilities.round(sum, 2);
                    }
                    sum = debitSum - creditSum;
                    if (sum > 0) {
                        if (vm.autoCalculateAmountInWords == "true")
                        {
                            // Handling for voucherSubTypeId == 21 (With Currency Logic)
                            if (vm.payment.voucherSubTypeId == 21 && vm.isMultiCurrencyEnabled) {
                                if (vm.payment.billingDetail && vm.payment.billingDetail.billingMethod) {
                                    var currencyId = vm.payment.billingDetail.billingMethod.currencyId;
                                    if (currencyId) {
                                        var selectedCurrency = vm.allCurrencies.find(c => c.id === currencyId);
                                        if (selectedCurrency) {
                                            var currencyName = selectedCurrency.name;
                                            var decimalName = selectedCurrency.decimalName;
                                            vm.currencyCode = vm.payment.billingDetail.billingMethod.currency?.code;
                                            vm.payment.amountInWords = utilities.toWords(sum, currencyName, decimalName);
                                        }
                                    } else {
                                        vm.payment.amountInWords = utilities.toWords(sum);
                                        vm.currencyCode = abp.setting.get("App.General.CurrencyCode");
                                    }
                                }
                            }
                            // Handling for voucherSubTypeId == 5 (Without Currency Logic)
                            else if (vm.payment.voucherSubTypeId == 5) {
                                vm.payment.amountInWords = utilities.toWords(sum);
                                vm.currencyCode = abp.setting.get("App.General.CurrencyCode"); // Default currency code
                            }
                            // Default case
                            else {
                                vm.payment.amountInWords = utilities.toWords(sum);
                            }
                        }
                    } else {
                        if (vm.autoCalculateAmountInWords == "true")
                            vm.payment.amountInWords = '';
                    }


                    vm.payment.amount = sum;
                    vm.payment.debit = debitSum;
                    vm.payment.credit = creditSum;
                    // return sum;
                }

            };


            vm.sumAmountAllocation = function () {
                vm.isEnableDueAmount = true;
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        amount = utilities.round(amount + value.allocatedNow, 2);
                    if (value.due < 0) {
                        vm.isEnableDueAmount = false;
                    }
                });

                var paymentAmountToMatch = vm.payment.amount + vm.payment.tds;
                if (amount > 0 && paymentAmountToMatch != amount)
                    vm.supplierPaymentEnableSave = false;
                else
                    vm.supplierPaymentEnableSave = true;

                return utilities.round(amount, 2);
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
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


            vm.calculateTaxPerRow = function (row) {
                if (vm.payment == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                if (row.debit != null) {
                    if (vm.payment.taxPercent > 0) {
                        var tax = 0;

                        if (!vm.payment.contact.isTaxExempted) {

                            if (row.taxable || !row.taxable) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (row.debit * 100) / (100 + vm.payment.taxPercent);
                                    tax = utilities.round(row.debit - chargesWithoutTax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(row.debit * vm.payment.taxPercent / 100, 2);
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
                            vm.payment.taxPercent = 0;
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

            // extended search using search contact popup
            vm.searchContactPopoup = function () {
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
                }).result.then(function (contact) {
                    if (contact != null) {
                        vm.payment.contact = contact;
                    }
                    if (vm.contactType == 3) {
                        getAllocations();
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
                        vm.payment.vehicle = result;
                    }
                });
            };

            function getBillingMethods() {

                // vm.loading = true;
                billingMethodService.getBillingMethods({ category: 2 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    //    vm.loading = false;
                });
            }

            // Get payroll type
            vm.payrollTypes = function (value) {
                if (value === 1) {
                    return 'Regular';
                }
                else if (value === 2) {
                    return 'Leave Salary';
                }
                else {
                    return 'Final Settlement';
                }
            }
            // Get departments for hrm
            function getDepartments() {
                departmentService.getDepartment({}).success(function (data) {
                    vm.departments = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getDepartmentName = function (departmentId) {
                if (!departmentId || !vm.departments) {
                    return "";
                }

                var department = vm.departments.find(function (d) {
                    return d.id === departmentId;
                });

                return department ? department.name : "";
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

            //Add row
            vm.addRow = function () {
                vm.payment.voucherLines.push(paymentLineObject());
            };

            //Remove row


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };





            function getAllocations() {
                if (vm.payment.voucherSubTypeId == 3 && vm.isAllowGeneralBillOnCustomerEnabled) {
                    if (vm.isHeadRowFound) {
                        allocationService.getAllocationsForEdit({
                            contactId: vm.payment.contact.id,
                            includeBillsOnly: true,
                            voucherCategory: 1,
                            VoucherId: paymentId,
                        }).success(function (data) {
                            vm.allocationData = data;
                        });
                    }
                } else {
                    if (vm.isHeadRowFound) {
                        allocationService.getAllocationsForEdit({
                            contactId: vm.payment.contact.id,
                            voucherCategory: 1,
                            VoucherId: paymentId,
                        }).success(function (data) {
                            vm.allocationData = data;
                        });
                    }
                }
            }

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            }

            vm.checkCurrentDate = function () {
                if (vm.currentDate >= vm.payment.billingDetail.cheque.chequeDate) {
                    vm.isCurrentDateBigger = true;
                } else {
                    vm.isCurrentDateBigger = false;
                }
            };

            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }

            // Open Payroll View Modal
            vm.viewPayrollById = function (payrollId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payrolls/viewModal.cshtml',
                    controller: 'tenant.views.common.hrm.payrolls.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        payrollId: function () {
                            return payrollId;
                        },
                        departmentId: function () {
                            return vm.payment.departmentId;
                        }
                    }
                });
            };

            vm.loadCostCenterInLine = function (line) {
                line.costCenters = [];
                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 3) {
                    line.disableCostCenter = true;
                    if (line.showDate)
                        line.disableCostCenter = false;
                }
                else if (line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                    line.disableCostCenter = false;
                }
            }
            function init() {
                getPaymentTypes();
                getBillingMethods();
                getLocations();
                getExpenses();
                getBankAccounts();
                if (vm.isMultiCurrencyEnabled) {
                    //getCurrencies();
                    getAllCurrencies();
                }
                if (vm.isCostCenterEnabled)
                    getCostCenters();

                if (vm.isHRMEnabled) {
                    getDepartments();
                }
                vm.loading = true;
                paymentService.getPaymentForView({ id: paymentId }).success(
                    function (result) {
                        vm.payment = result;
                        vm.documents = vm.payment.voucherDocuments;
                        if (vm.payment.id > 0) {
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.payment.contact) {
                                    if (vm.payment.contact.currency) {

                                        commonLookupService.getCurrencies({ id: vm.payment.contact.currency.id }).success(function (data) {
                                            vm.currencies = data.items;
                                        });
                                    }
                                    else {
                                        commonLookupService.getCurrenciesAll().success(function (data) {
                                            vm.currencies = data.items;
                                        });
                                    }
                                }
                            }
                            angular.forEach(vm.payment.voucherLines, function (voucherLine) {
                                if (voucherLine.contactId)
                                    vm.isHeadRowFound = true;

                            });
                            if (vm.isMultiCurrencyEnabled && vm.payment.voucherSubTypeId == 3) {
                                vm.payment.contact.currencyDto = vm.payment.contact.currency;
                            }

                            if (vm.payment.billingDetail) {
                                if (vm.payment.billingDetail.billingMethod) {
                                    vm.payment.billingDetail.billingMethod.name = app.localize(vm.payment.billingDetail.billingMethod.name);
                                    if (vm.payment.billingDetail.bankAccountId && vm.payment.billingDetail.cheque != null)
                                        vm.isCurrentDateBigger = true;
                                }
                            }
                            vm.disablePaymentMethod = vm.payment.voucherSubTypeId == 21;
                            vm.isEditedMode = true;
                            if (vm.payment.voucherSubTypeId == 6) {
                                if (vm.isAccountFeatureEnabled) {
                                    vm.paymentType = app.localize('PettyCashExpensePayment');
                                }
                                else {
                                    vm.paymentType = app.localize('ExpensePayment');
                                }
                                vm.showStaff = false;
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = false;
                                vm.showAgreement = false;
                                vm.showExpensePayment = true;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Contact");
                                vm.contactType = null;
                                vm.accountCategory = 5;

                                angular.forEach(vm.payment.voucherLines, function (voucherLine) {

                                    voucherLine.totalAmountTax = vm.rounding(voucherLine.tax / 1 + voucherLine.debit / 1);
                                    if (voucherLine.fromDate != null && voucherLine.toDate != null)
                                        voucherLine.showDate = true;
                                });

                            }
                            if (vm.payment.voucherSubTypeId == 3 && vm.isAllowGeneralBillOnCustomerEnabled) {
                                vm.paymentType = app.localize('CustomerPayment');
                                vm.showAgreement = true;
                                vm.showStaff = false;
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = true;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Customer");
                                vm.contactType = 2;
                                vm.accountCategory = null;
                                getAllocations();
                            } else if (vm.payment.voucherSubTypeId == 3 && !vm.isAllowGeneralBillOnCustomerEnabled) {
                                vm.paymentType = app.localize('CustomerPayment');
                                vm.showAgreement = true;
                                vm.showStaff = false;
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Customer");
                                vm.contactType = 2;
                                vm.accountCategory = null;
                            }
                            if (vm.payment.voucherSubTypeId == 71) {
                                vm.paymentType = app.localize('AdvancePayment');
                                vm.showAgreement = true;
                                vm.showStaff = false;
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Supplier");
                                vm.contactType = 3;
                                vm.accountCategory = null;
                            }
                            if (vm.payment.voucherSubTypeId == 4) {
                                vm.paymentType = app.localize('SupplierPayment');
                                vm.showStaff = false;
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = false;
                                vm.showAgreement = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = true;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Supplier");
                                vm.contactType = 3;
                                vm.accountCategory = null;
                                getAllocations();

                            }
                            if (vm.payment.voucherSubTypeId == 5) {
                                vm.paymentType = app.localize('StaffPayment');
                                vm.showStaff = true;
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = false;
                                vm.showAgreement = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Staff");
                                vm.contactType = 1;
                                vm.accountCategory = null;
                                getStaffAccounts();
                                angular.forEach(vm.payment.voucherLines, function (value, key) {
                                    vm.accountChangedGeneralPaymentEdit(value);
                                    if (!value.hidden) {
                                        if (value.debit > 0) {
                                            value.taxDebit = value.tax;
                                        }
                                        if (value.credit > 0) {
                                            value.taxCredit = value.tax;
                                        }
                                        if (value.tax > 0) {
                                            value.showTax = true;
                                        }
                                    }
                                    vm.sumAmount();
                                });
                            }
                            if (vm.payment.voucherSubTypeId == 114) {
                                vm.paymentType = app.localize('SalaryPayment');
                                vm.showSalaryPayment = true;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = false;
                                vm.showStaff = false;
                                vm.showAgreement = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Staff");
                                vm.contactType = 1;
                                vm.accountCategory = null;
                            }
                            if (vm.payment.voucherSubTypeId == 1001) {
                                vm.paymentType = app.localize('StaffAdvancePayment');
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = true;
                                vm.showStaffLoanPayment = false;
                                vm.showStaff = false;
                                vm.showAgreement = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Staff");
                                vm.contactType = 1;
                                vm.accountCategory = null;
                            }
                            if (vm.payment.voucherSubTypeId == 1002) {
                                vm.paymentType = app.localize('StaffLoanPayment');
                                vm.showSalaryPayment = false;
                                vm.showStaffAdvancePayment = false;
                                vm.showStaffLoanPayment = true;
                                vm.showStaff = false;
                                vm.showAgreement = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Staff");
                                vm.contactType = 1;
                                vm.accountCategory = null;
                            }
                                if (vm.payment.voucherSubTypeId == 15) {
                                    vm.paymentType = app.localize('DepositRefund');
                                    vm.showAgreement = true;
                                }
                                if (vm.payment.voucherSubTypeId == 21) {
                                    vm.paymentType = app.localize('GeneralPayment');
                                    vm.showAgreement = false;
                                    vm.showStaff = false;
                                    vm.showSalaryPayment = false;
                                    vm.showStaffAdvancePayment = false;
                                    vm.showStaffLoanPayment = false;
                                    vm.showExpensePayment = false;
                                    vm.showSupplier = false;
                                    vm.showGeneralPayment = true;
                                    vm.contactTypeLabel = app.localize("Customer");
                                    vm.contactType = 2;
                                    vm.accountCategory = null;


                                    angular.forEach(vm.payment.voucherLines, function (value, key) {
                                        //if (value.vehicleId != null && value.vehicleId > 0)
                                        //    value.vehicleShow = true;
                                        //if (value.contactId != null && value.contactId > 0)
                                        //    value.contactShow = true;
                                        //for edit case, get tax
                                        vm.accountChangedGeneralPaymentEdit(value);
                                        if (!value.hidden) {
                                            if (value.debit > 0) {
                                                value.taxDebit = value.tax;
                                                //  value.showDebitField = true; 
                                            }
                                            if (value.credit > 0) {
                                                value.taxCredit = value.tax;
                                                // value.showCreditField = true;

                                            }
                                            if (value.tax > 0) {
                                                value.showTax = true;
                                            }
                                        }
                                        vm.sumAmount();


                                    });
                                }
                                if (vm.payment.voucherSubTypeId == 59) {
                                    vm.paymentType = app.localize('StockPayment');
                                    vm.showstockpayment = true;
                                    vm.showAgreement = false;
                                    vm.showStaff = false;
                                    vm.showSalaryPayment = false;
                                    vm.showStaffAdvancePayment = false;
                                    vm.showStaffLoanPayment = false;
                                    vm.showExpensePayment = false;
                                    vm.showSupplier = false;
                                    vm.showGeneralPayment = false;
                                    vm.contactTypeLabel = app.localize("Customer");
                                    vm.contactType = 2;
                                    vm.accountCategory = null;
                                }
                            }
                            if (vm.payment.voucherLines.length == 0)
                                vm.addRow();
                            if (!vm.isEditedMode)
                                vm.payment.taxPercent = vm.taxPercent;
                            angular.forEach(vm.payment.voucherLines, function (voucherLine) {
                                if (vm.payment.voucherSubTypeId == 59) {
                                    voucherLine.pirce = voucherLine.product.price;
                                    voucherLine.unitOfMeasure = voucherLine.product.unitOfMeasure;
                                    voucherLine.unitOfMeasureId = voucherLine.product.unitOfMeasureId;
                                }
                            })
                        }).finally(function () {
                            vm.loading = false;
                        });
            }

            init();

        }]);
