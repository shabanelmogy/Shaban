// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:373077-374766
appModule.controller('tenant.views.crs.vouchers.payments.createOrEditPdcPaymentsModal', ['$scope', '$uibModal', 'paymentId', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.directory',
        'abp.services.app.billingMethod', 'abp.services.app.commonLookup', 'abp.services.app.payment', 'abp.services.app.expenseType', 'abp.services.app.agreement', 'abp.services.app.account',
        '$filter', 'abp.services.app.allocation', 'agreement', 'utilities', 'appSession', 'abp.services.app.bankAccount', 'abp.services.app.job', 'abp.services.app.costCenter', 'abp.services.app.item', 'abp.services.app.unitOfMeasure',
        'abp.services.app.tenantSettings', 'FileUploader', 'abp.services.app.jV',
        function ($scope, $uibModal, paymentId, $uibModalInstance, vehicleService, directoryService, billingMethodService, commonLookupService,
            paymentService, expenseTypeService, agreementService, accountService, $filter, allocationService, agreement, utilities, appSession, bankAccountService, jobAppService, costCenterService, itemAppService, unitOfMeasureAppService,
            tenantSettingsService, fileUploader, JVService) {
            var vm = this;
            vm.vehicles = [];
            vm.customers = [];
            vm.billingMethods = [];
            vm.locations = [];
            vm.expenseTypes = [];
            vm.documents = [];
            vm.cheques = [];
            vm.billingMethodForCheque = null;
            vm.saveAndPrint = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.contactTypeLabel = app.localize('Contact');
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isBillFeatureEnabled = abp.features.isEnabled("CRS.Vouchers.Bills");
            vm.documentsForExpensePayment = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForExpensePayment");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isPostDatedChequeDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequeDirectlyToBank"));
            vm.isPostDatedChequePayableDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequePayableDirectlyToBank"));
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
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
            vm.disablePaymentMethod = false;
            vm.currentDate = moment().endOf('day');
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            //vm.isCostCenterRequired = utilities.parseBoolean(abp.setting.get("App.General.IsCostCenterForPaymentRequired"));
            //new settings
            vm.costCenterGroup1Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup1Required"));
            vm.costCenterGroup2Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup2Required"));
            vm.payment = [];
            vm.payment.voucherSubTypeId = null;
            var tenancyName = appSession.tenant.tenancyName.toLowerCase();

            var selectedExpenseAccountIdsFromSettings = [];

            function getExpenseAccountsAdvanceSetting() {
                tenantSettingsService.getExpenseAccountsAdvanceSetting()
                    .success(function (result) {
                        selectedExpenseAccountIdsFromSettings = result;
                        if (vm.vehicleExpensesAccounts)
                            vm.vehicleExpensesAccounts.filter(e => selectedExpenseAccountIdsFromSettings.includes(e.id)).forEach(e => e.isChecked = true);
                    });
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
                jobAppService.searchJobDetails({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
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
            // Import JV Code
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
                vm.payment.voucherLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    paymentService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.payment.voucherLines = result;

                            angular.forEach(vm.payment.voucherLines, function (value, key) {
                                if (value.fromDate != null && value.toDate != null)
                                    value.showDate = true;
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0)
                                    value.contactShow = true;

                                if (!value.contactId)

                                    if (vm.showGeneralPayment) {
                                        vm.accountChangedGeneralPayment(value);

                                    }

                                if (!value.hidden) {
                                    if (value.debit > 0)
                                        value.taxDebit = value.tax;
                                    if (value.credit > 0)
                                        value.taxCredit = value.tax;
                                }
                                vm.sumAmount();
                            });
                            if (vm.payment.voucherLines.length == 0)
                                vm.addRow();
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
                if (parseFloat(allocation.allocatedNowShow) == 0) {
                    allocation.allocatedNowShow = vm.rounding(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNowShow);
                }
                vm.sumAmountAllocation2();
            };

            function getPaymentTypes() {
                vm.paymentTypes.push({ voucherSubTypeId: 3, name: app.localize('CustomerPayment') });



                if (vm.isBillFeatureEnabled)
                    vm.paymentTypes.push({ voucherSubTypeId: 4, name: app.localize('SupplierPayment') });
                if (vm.isAccountFeatureEnabled) {
                    vm.paymentTypes.push({ voucherSubTypeId: 5, name: app.localize('StaffPayment') });

                    if (!(tenancyName == 'autobahn' || tenancyName == 'autobahnws'))
                        vm.paymentTypes.push({ voucherSubTypeId: 6, name: app.localize('PettyCashExpensePayment') });
                    vm.paymentTypes.push({ voucherSubTypeId: 21, name: app.localize('GeneralPayment') });
                }
                else
                    vm.paymentTypes.push({ voucherSubTypeId: 6, name: app.localize('ExpensePayment') });
                if (vm.isWorkshopEnabled)
                    vm.paymentTypes.push({ voucherSubTypeId: 59, name: app.localize('StockPurchasePayment(ForJob)') });
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
                if (vm.payment.voucherSubTypeId == 3) { //customer payment
                    vm.showAgreement = true;
                    vm.showStaff = false;
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
                else if (vm.payment.voucherSubTypeId == 4) { //supplier payment
                    vm.showSupplier = true;
                    vm.showStaff = false;
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
                    vm.showSupplier = false;
                    vm.showstockpayment = false;
                    vm.showGeneralPayment = false;
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
                    vm.showstockpayment = false;
                    vm.showAgreement = false;
                    vm.showExpensePayment = false;
                    vm.showGeneralPayment = true;
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

                if (vm.payment.voucherLines.length == 0)
                    vm.addRow();
            };

            // account changed other than general payment 
            vm.accountChanged = function (line) {
                debugger;
                line.accountId = line.account.id;

                line.contactId = null;
                line.vehicleId = null;
                line.contact = null;
                line.vehicle = null;

                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.itemShow = false;
                    line.product = null;
                    line.productId = null;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }

                if (line.account.contactGroup) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null;
                    line.vehicle = null;
                    line.costCenterId = null;
                    line.itemShow = false;
                    line.product = null;
                    line.productId = null;
                    line.account.contactGroupId = null;
                    line.accountId = line.account.id;

                    if (!line.account.contactGroup.isDefault)
                        line.account.contactGroupId = line.account.contactGroup.id;
                    if (line.account.contactGroup.contactType === 1) {
                        line.showContactMessage = "Please Select Staff ";
                    }
                    if (line.account.contactGroup.contactType === 2) {
                        line.showContactMessage = "Please Select Customer";
                    }
                    if (line.account.contactGroup.contactType === 3) {
                        line.showContactMessage = "Please Select Supplier";
                    }
                } else {
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                }

                vm.searchPrepaidExpense(line, line.account.id);

                vm.vehicleRequired = false;
                if (selectedExpenseAccountIdsFromSettings.some(e => e == line.accountId))
                    vm.vehicleRequired = true;

            };

            vm.accountChangedForImport = function (line) {
                debugger;
                line.accountId = line.account.id;



                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.itemShow = false;
                    line.product = null;
                    line.productId = null;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }

                if (line.account.contactGroup) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null;
                    line.vehicle = null;
                    line.costCenterId = null;
                    line.itemShow = false;
                    line.product = null;
                    line.productId = null;
                    line.account.contactGroupId = null;
                    line.accountId = line.account.id;

                    if (!line.account.contactGroup.isDefault)
                        line.account.contactGroupId = line.account.contactGroup.id;
                    if (line.account.contactGroup.contactType === 1) {
                        line.showContactMessage = "Please Select Staff ";
                    }
                    if (line.account.contactGroup.contactType === 2) {
                        line.showContactMessage = "Please Select Customer";
                    }
                    if (line.account.contactGroup.contactType === 3) {
                        line.showContactMessage = "Please Select Supplier";
                    }
                } else {
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;

                    line.accountId = line.account.id;
                }

                vm.searchPrepaidExpense(line, line.account.id);

                vm.vehicleRequired = false;
                if (selectedExpenseAccountIdsFromSettings.some(e => e == line.accountId))
                    vm.vehicleRequired = true;

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
                vm.loadCostCenterInLine(line);

                vm.vehicleRequired = false;
                if (selectedExpenseAccountIdsFromSettings.some(e => e == line.accountId))
                    vm.vehicleRequired = true;

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

                vm.vehicleRequired = false;
                if (selectedExpenseAccountIdsFromSettings.some(e => e == line.accountId))
                    vm.vehicleRequired = true;

                line.taxCredit = 0;
                line.taxDebit = 0;
                // line.tax = 0;
                vm.sumAmount();
            };

            // on The Change Of Contact
            vm.onContactChange = function () {
                //vm.payment.refNo = null;
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

            // Searching Contacts
            vm.searchContactForSubLookUp = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
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
                            vm.payment.amountInWords = utilities.toWords(sum);
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
                
                
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                vm.totalAllocatedA = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNowShow > 0)
                        amount = utilities.round(amount + value.allocatedNowShow, 2);
                    
                });

                var paymentAmountToMatch = vm.payment.amount + vm.payment.tds;
                if (amount > 0 && paymentAmountToMatch != amount)
                    vm.supplierPaymentEnableSave = false;
                else
                    vm.supplierPaymentEnableSave = true;
                vm.totalAllocatedA = utilities.round(amount, 2);
                return utilities.round(amount, 2);
            };
            vm.sumAmountAllocation2 = function () {

                vm.isEnableDueAmount = false;
                
                var amount = 0;
                vm.totalAllocatedA = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNowShow > 0)
                        amount = utilities.round(amount + value.allocatedNowShow, 2);
                    if (value.due < 0) {
                        vm.isEnableDueAmount = true;
                    }
                });

                var paymentAmountToMatch = vm.payment.amount + vm.payment.tds;
                if (amount > 0 && paymentAmountToMatch != amount)
                    vm.supplierPaymentEnableSave = false;
                else
                    vm.supplierPaymentEnableSave = true;
                    vm.supplierPaymentEnableSave = true;
                vm.totalAllocatedA = utilities.round(amount, 2);
                if (vm.totalAllocatedA > vm.totalPaymentAmount)
                    vm.valida = true;
                else
                    vm.valida = false;
                
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
                    //vm.billingMethods = data.items;
                    var billingMethods = data.items;
                    var selectedChequeMethod = billingMethods.filter(function (method) {
                        return method.name == "Cheque";
                    });
                    var chequeMethods = billingMethods.filter(function (method) {
                        return method.type == 4;
                    });
                    vm.billingMethods = chequeMethods.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId));
                    vm.billingMethodForCheque = selectedChequeMethod[0];
                }).finally(function () {
                    //    vm.loading = false;
                });
            }

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
            vm.removeRow = function (obj) {
                var index = vm.payment.voucherLines.indexOf(obj);
                vm.payment.voucherLines.splice(index, 1);
                if (vm.showExpensePayment)
                    vm.sumAmountTax();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.setAutoAllocationNowAount = function () {
                vm.paymentsTotal = 0.0;
                for (var i = 0; i < vm.cheques.length; i++) {
                    vm.cheques[i].amount = parseFloat(vm.cheques[i].amount);
                    vm.paymentsTotal = vm.paymentsTotal + vm.cheques[i].amount;

                }
                angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                    allocation.allocatedNowShow = 0;

                });
                angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                    if (vm.paymentsTotal > 0) {
                        allocation.dueAmount = allocation.amount - allocation.alreadyAllocated;
                        if (vm.paymentsTotal >= allocation.dueAmount) {
                            allocation.allocatedNowShow = allocation.dueAmount;
                            vm.paymentsTotal = vm.paymentsTotal - allocation.allocatedNowShow;

                        } else {
                            allocation.allocatedNowShow = vm.paymentsTotal;
                            vm.paymentsTotal = 0;

                        }

                    }

                });
            }
            vm.setAllocation = function () {
                vm.paymentsTotal = 0.0;
                for (var i = 0; i < vm.cheques.length; i++) {
                    vm.cheques[i].amount = parseFloat(vm.cheques[i].amount);
                    vm.paymentsTotal = vm.paymentsTotal + vm.cheques[i].amount;
                    vm.cheques[i].dueForAllocation = vm.cheques[i].amount;
                }

                for (var i = 0; i < vm.cheques.length; i++) {
                    var allocations = [];
                    angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                        allocation.dueAmount = allocation.allocatedNowShow;
                        if (allocation.dueAmount >= vm.cheques[i].dueForAllocation && allocation.dueAmount > 0) {
                            allocation.allocatedNow = vm.cheques[i].dueForAllocation;
                            allocation.allocatedNowShow = allocation.allocatedNowShow - allocation.allocatedNow;
                            allocation.alreadyAllocated = allocation.alreadyAllocated + allocation.allocatedNow;
                            vm.cheques[i].dueForAllocation = 0;
                            allocations.push({
                                id: allocation.allocationId,
                                allocatedToVoucherLineId: allocation.voucherLineId,
                                amount: allocation.allocatedNow,
                                allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId
                            });

                        } else if (allocation.allocatedNowShow > 0) {
                            allocation.allocatedNow = allocation.allocatedNowShow;
                            vm.cheques[i].dueForAllocation = vm.cheques[i].dueForAllocation - allocation.allocatedNowShow;
                            allocation.alreadyAllocated = allocation.alreadyAllocated + allocation.allocatedNow;
                            allocation.allocatedNowShow = 0;
                            allocations.push({
                                id: allocation.allocationId,
                                allocatedToVoucherLineId: allocation.voucherLineId,
                                amount: allocation.allocatedNow,
                                allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId
                            });

                        }

                    });
                    var paymentAllocations = {
                        allocations: allocations
                    };

                    vm.cheques[i].paymentAllocations = paymentAllocations;
                }

            }
            vm.save = function () {
                vm.setAllocation();
                if (vm.payment.contact == null && vm.payment.voucherSubTypeId == 6) {
                    vm.payment.contactId = null;
                }

                else if (!vm.showGeneralPayment)
                    vm.payment.contactId = vm.payment.contact.id;
                if (vm.locations.length == 1)
                    vm.payment.locationId = vm.locations[0].id;

                vm.saving = true;
                var allocations = [];
                //if (vm.payment.voucherSubTypeId == 4) { //supplier payment
                //    var allocatedAmount = vm.sumAmountAllocation();
                //    var paymentAmountToMatch = vm.payment.amount + vm.payment.tds;
                //    if (allocatedAmount > 0 && paymentAmountToMatch != allocatedAmount) {
                //        abp.notify.info(app.localize('AppliedAmountShouldEqualToAllocatedAmount.'));
                //        vm.saving = false;
                //        return;
                //    }
                //    //vm.payment.amount = vm.sumAmountAllocation();
                //    angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                //        allocations.push({
                //            id: allocation.allocationId,
                //            allocatedToVoucherLineId: allocation.voucherLineId,
                //            amount: allocation.allocatedNow,
                //            allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId
                //        });
                //    });
                //}


                var paymentAllocations = {
                    allocations: allocations
                };

                vm.payment.paymentAllocations = paymentAllocations;
                // CreditCard = 2,Cheque = 4,BankTransfer = 5,
                if (vm.payment.billingDetail.billingMethod.type == 2 || vm.payment.billingDetail.billingMethod.type == 7) {
                    vm.payment.billingDetail.cheque = null;
                    vm.payment.billingDetail.bankAccountId = null;
                    vm.payment.billingDetail.creditCard.expiryDate = moment(vm.payment.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                }
                else if (vm.payment.billingDetail.billingMethod.type == 4) {
                    if (vm.isPostDatedChequePayableDirectlyToBankEnabled && vm.isCurrentDateBigger)
                        vm.payment.billingDetail.bankAccountId = vm.payment.billingDetail.bankAccount.id;
                    else
                        vm.payment.billingDetail.bankAccountId = null;
                    vm.payment.billingDetail.creditCard = null;
                    vm.payment.billingDetail.cheque.chequeDate = moment(vm.payment.billingDetail.cheque.chequeDate).startOf('day');
                    vm.payment.billingDetail.cheque.status = 1;
                }
                else if (vm.payment.billingDetail.billingMethod.type == 5) {
                    vm.payment.billingDetail.creditCard = null;
                    vm.payment.billingDetail.cheque = null;
                    if (!vm.isAccountFeatureEnabled)
                        vm.payment.billingDetail.bankAccountId = null;
                }
                else {
                    vm.payment.billingDetail.bankAccountId = null;
                    vm.payment.billingDetail.cheque = null;
                    vm.payment.billingDetail.creditCard = null;
                }
                vm.payment.voucherDocuments = vm.documents;

                if (vm.payment.voucherLines)
                    vm.payment.voucherLines.forEach(e => e.job = null);
                //adding cheques information into the object of payment which is payment.cheque
                vm.payment.cheques = vm.cheques;
                vm.payment.billingDetail.billingMethodId = vm.payment.billingDetail.billingMethod.id;

                //paymentService.createOrUpdatePayment({ payment: vm.payment }).success(function (result) {
                paymentService.createOrUpdatePdcPayment({ payment: vm.payment }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.payment.id = result;
                    vm.payment.printObj = {
                        id: vm.payment.id,
                        printHeader: false
                    };
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.payment);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });


            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            var saveAndPrint = function (p) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        payment: function () {
                            return p;
                        }
                    }
                });
            };
            function getAllocations() {
                allocationService.getAllocationsForEdit({
                    contactId: vm.payment.contact.id,
                    voucherCategory: 1,
                    VoucherId: paymentId,
                }).success(function (data) {
                    vm.allocationData = data;
                });
            }

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
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
            function chequeLineObject() {
                var line = new Object();
                line.chequeNo = null;
                line.date = moment().format(abp.setting.get("App.General.DateFormat"));
                line.amount = null;
                return line;
            }

            vm.addChequeRow = function (line) {
                if (line == undefined)
                    line = chequeLineObject();

                if (vm.newRowAgreement) {
                    line.agreement = vm.newRowAgreement;
                    line.agreementId = vm.newRowAgreement.id;
                }
                vm.cheques.push(line);
            };
            vm.removeChequeRow = function (obj) {
                var index = vm.cheques.indexOf(obj);
                vm.cheques.splice(index, 1);
                //vm.sumAmount();
            };

            vm.getkeys = function (event) {
                if (!vm.cheques) {
                    vm.cheques = [];
                }

                let removeRows = [];
                removeRows = vm.cheques.filter(x => {
                    return true; // !x.chequeNo
                });

                if (removeRows.length > 0) {
                    for (let i = 0; i < removeRows.length; i++) {
                        vm.cheques.splice(vm.cheques.indexOf(removeRows[i]), 1);
                    }
                }


                let len = parseInt(vm.payment.noOfEMIs == "" ? "0" : vm.payment.noOfEMIs) - vm.cheques.length;
                if (len > 0)
                    for (let i = 0; i < len; i++) {
                        vm.addChequeRow(null);
                    }
            }

            vm.processChequeNo = function (event, index) {
                if (index == 0) {
                    if (!vm.cheques[0].chequeNo) return;
                    let chequeNo = parseInt(vm.cheques[0].chequeNo);

                    //this is the first row.
                    for (var i = 1; i < vm.cheques.length; i++) {
                        chequeNo++;
                        let row = vm.cheques[i];
                        row.chequeNo = chequeNo;

                    }
                }
            }

            vm.chequeDateChanged = function (index) {
                if (index == 0) {
                    for (var i = 1; i < vm.cheques.length; i++) {
                        vm.cheques[i].date = moment(vm.cheques[i - 1].date).add('month', 1);
                    }
                }
            }

            vm.chequeAmountChanged = function (index) {
                vm.totalPaymentAmount = 0;
                if (index == 0) {
                    for (var i = 1; i < vm.cheques.length; i++) {
                        vm.cheques[i].amount = vm.cheques[0].amount;
                    }
                    
                }
                for (var i = 0; i < vm.cheques.length; i++) {
                    vm.totalPaymentAmount = vm.totalPaymentAmount + vm.cheques[i].amount;
                }
                vm.setAutoAllocationNowAount();
                vm.sumAmountAllocation2();
            }

            function init() {
                getPaymentTypes();
                getBillingMethods();
                getLocations();
                getExpenses();
                getBankAccounts();
                getCostCenters();
                //if (vm.isAccountFeatureEnabled)
                //    getExpenseAccountsAdvanceSetting();
                vm.loading = true;
                paymentService.getPaymentForEdit({ id: paymentId }).success(
                    function (result) {
                        vm.payment = result;
                        vm.documents = vm.payment.voucherDocuments;
                        if (vm.payment.id < 1) {
                            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.AllActionsOnOtherBranchPayments');
                            vm.payment.locationId = appSession.user.locationId;
                            vm.isEditedMode = false;
                        }
                        if (agreement) {
                            vm.showAgreement = true;
                            vm.showStaff = false;
                            vm.showExpensePayment = false;
                            vm.showSupplier = false;
                            vm.contactTypeLabel = app.localize("Customer");
                            vm.contactType = 2;
                            vm.accountCategory = null;
                            vm.payment.agreement = agreement;
                            vm.payment.agreementId = agreement.id;
                            vm.payment.contact = agreement.customer;
                            //vm.payment.locationId = agreement.location.id;
                            vm.payment.locationId = agreement.locationId;
                            vm.payment.voucherSubTypeId = 3;
                            vm.payment.type = 3;
                            vm.payment.amount = -agreement.dueAmount;
                            vm.payment.amountInWords = utilities.toWords(vm.payment.amount);

                            vm.disableCustomer = true;
                            vm.disableAgreement = true;
                            vm.disablePaymentType = true;
                            vm.disableLocation = true;
                        }

                        if (vm.payment.id > 0) {
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
                                vm.showAgreement = false;
                                vm.showExpensePayment = true;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Contact");
                                vm.contactType = null;
                                vm.accountCategory = null;

                                angular.forEach(vm.payment.voucherLines, function (voucherLine) {
                                    voucherLine.totalAmountTax = vm.rounding(voucherLine.tax / 1 + voucherLine.debit / 1);
                                    if (voucherLine.fromDate != null && voucherLine.toDate != null)
                                        voucherLine.showDate = true;
                                    if (voucherLine.vehicleId != null && voucherLine.vehicleId > 0)
                                        voucherLine.vehicleShow = true;
                                    if (voucherLine.contactId != null && voucherLine.contactId > 0)
                                        voucherLine.contactShow = true;
                                });

                            }
                            if (vm.payment.voucherSubTypeId == 3) {
                                vm.paymentType = app.localize('CustomerPayment');
                                vm.showAgreement = true;
                                vm.showStaff = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Customer");
                                vm.contactType = 2;
                                vm.accountCategory = null;
                            }
                            if (vm.payment.voucherSubTypeId == 4) {
                                vm.paymentType = app.localize('SupplierPayment');
                                vm.showStaff = false;
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
                                vm.showAgreement = false;
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Staff");
                                vm.contactType = 1;
                                vm.accountCategory = null;
                                getStaffAccounts();
                            }
                            if (vm.payment.voucherSubTypeId == 15) {
                                vm.paymentType = app.localize('DepositRefund');
                            }
                            if (vm.payment.voucherSubTypeId == 21) {
                                vm.paymentType = app.localize('GeneralPayment');
                                vm.showAgreement = false;
                                vm.showStaff = false;
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
                                vm.showExpensePayment = false;
                                vm.showSupplier = false;
                                vm.showGeneralPayment = false;
                                vm.contactTypeLabel = app.localize("Customer");
                                vm.contactType = 2;
                                vm.accountCategory = null;
                            }
                            vm.payment.voucherLines = vm.payment.voucherLines.filter(e => !e.hidden);
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
                        });
                        vm.payment.voucherSubTypeId = 4;
                        //vm.payment.billingDetail = [];
                        vm.payment.billingDetail = {
                            billingMethod: vm.billingMethodForCheque
                        };
                        vm.isEditedMode = true;
                        vm.paymentTypeChanged();
                    }).finally(function () {
                        vm.loading = false;
                    });
                //if (vm.payment) {
                //    debugger;
                //    angular.forEach(vm.payment.voucherLines, function (value, key) {


                //        vm.accountChangedGeneralPayment(value);
                //        if (!value.hidden) {
                //            if (value.debit > 0){
                //                value.taxDebit = value.tax;
                //                value.showDebitField = true;
                //                value.showTax = true;
                //            }
                //            if (value.credit > 0){
                //                value.taxCredit = value.tax;
                //                value.showCreditField = true;

                //            }
                //            if (value.tax > 0)
                //            { 
                //                value.showTax = true;
                //            }
                //        }
                //        vm.sumAmount();
                //    })
                //}
            }

            init();

        }]);
