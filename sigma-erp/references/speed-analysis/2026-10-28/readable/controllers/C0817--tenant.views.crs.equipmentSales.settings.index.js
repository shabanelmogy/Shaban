// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:219931-220460
appModule.controller('tenant.views.crs.equipmentSales.settings.index', [
        '$scope', 'abp.services.app.tenantSettings', 'appSession', 'abp.services.app.directory', 'abp.services.app.expenseType', 'abp.services.app.commonLookup',
        function ($scope, tenantSettingsService, appSession, directoryService, expenseTypeService, commonLookupService) {
            var vm = this;
            vm.isSalesModuleEnabled = abp.features.isEnabled("CRS.SalesModule");
            vm.documentTypes = [{ name: app.localize("IndividualCustomer"), id: "AdvanceSettings.FormAndFields.IndividualCustomer" },
            { name: app.localize("CompanyCustomer"), id: "AdvanceSettings.FormAndFields.CompanyCustomer" },
            { name: app.localize("Supplier"), id: "AdvanceSettings.FormAndFields.Supplier" },
            { name: app.localize("CompanyDriver"), id: "AdvanceSettings.FormAndFields.CompanyDriver" },
            { name: app.localize("Vehicle"), id: "AdvanceSettings.FormAndFields.Vehicle" },
            { name: app.localize("Job"), id: "AdvanceSettings.FormAndFields.Job" }];
            vm.tenancyName = appSession.tenant.tenancyName;
            var isValid = true;
            vm.modules = [];
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });
           
            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;
            vm.numericLengths = [3, 4, 5, 6];
            vm.invoiceNumericLengths = [3, 4, 5, 6];
            vm.numericLengthsAccount = [4, 5, 6, 7, 8];
            vm.driverMobileAcceptOrReject =
                [
                    {
                        id: 0,
                        Name: 'None'
                    },
                    {
                        id: 1,
                        Name: 'Accept'
                    },
                    {
                        id: 2,
                        Name: 'Reject'
                    },


                ];

            vm.getTenantLinkedCustomer = function (data) {
                vm.tenantLinkedCustomers = [];
                return directoryService.getLinkedCustomerInfo({ contanctId: data }).then(function (result) {
                    vm.tenantLinkedCustomer = result.data;
                    vm.tenantLinkedCustomers.push(vm.tenantLinkedCustomer);
                });
            };
            vm.posDefaultCustomerselect = function (data) {
                return directoryService.getContactInfo({ id: data }).then(function (response) {
                    vm.customer = response.data;
                });
            };
            vm.getExpenses = function () {
                expenseTypeService.getExpenseTypes().success(function (data) {
                    vm.expenseTypes = data.items;
                });
            };
            function getLocations() {
                vm.loading = true;
                commonLookupService.getLocations().success(function (result) {
                    vm.locations = result.items;

                    if (vm.islinkCrsToWorkShopEnabled && vm.islinkWorkShopToCrsTenantNameHasValue)
                        getCRSsuppliersAndWScontactsLinkings();
                }).finally(function () {
                    vm.loading = false;

                });


            }
            function getCRSsuppliersAndWScontactsLinkings() {
                vm.branchSuppliersLinkings = [];
                var linkings = JSON.parse(vm.settings.speedCommon.tenantLinkedSuppliers);
                vm.locations.forEach(e => {
                    var linkingObj = null;
                    if (Array.isArray(linkings)) {
                        linkingObj = linkings.find(b => b.branchId == e.id);
                        if (linkingObj)
                            linkingObj.supplier = { id: linkingObj.supplierId, name: linkingObj.supplierName };
                    }
                    if (!linkingObj) {
                        vm.branchSuppliersLinkings.push({
                            branchId: e.id,
                            branchName: e.name,
                            supplierId: null,
                            supplierName: null
                        });
                    }
                    else
                        vm.branchSuppliersLinkings.push(linkingObj);

                });
            };
            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };


            vm.searchTenantLinkedCustomer = function ($select) {
                return directoryService.searchLinkedCustomer({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.tenantLinkedCustomers = response.data.items;
                });
            };
            vm.selectDefaultDriverForEquipmentAgreement = function ($select) {
                return directoryService.search({ keyword: $select.search }).then(function (response) {
                    vm.defaultDrivers = response.data.items;

                });
            };


            vm.getExpenseType = function (data) {

                return expenseTypeService.getExpenseTypeForEdit({ id: data }).then(function (response) {
                    vm.expenseType = response.data;
                });
            };
            vm.getDefaultDriver = function (data) {
                vm.defaultDrivers = [];
                return directoryService.getContactInfo({ id: data }).then(function (result) {
                    vm.defaultDriverForEquipmentAgreement = result.data;
                    if (vm.defaultDriverForEquipmentAgreement) {
                        if (!vm.defaultDriverForEquipmentAgreement.name) {
                            vm.defaultDriverForEquipmentAgreement.name = vm.defaultDriverForEquipmentAgreement.firstName + ' ' + vm.defaultDriverForEquipmentAgreement.lastName;
                        }
                        vm.defaultDrivers.push(vm.defaultDriverForEquipmentAgreement);
                    }
                });
            };

            vm.getSettings = function () {
                vm.loading = true;

                tenantSettingsService.getAllSettings()

                    .success(function (result) {
                        vm.settings = result;
                        console.log(vm.settings);
                        vm.settings.speedCommon.weekEndDay1 = parseInt(vm.settings.speedCommon.weekEndDay1);
                        if (!vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod)
                            vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod = 0;
                        if (!vm.settings.speedCommon.specialBranchwithnoFinancialeffects)
                            vm.settings.speedCommon.specialBranchwithnoFinancialeffects = 0;

                        vm.settings.speedCommon.weekEndDay2 = parseInt(vm.settings.speedCommon.weekEndDay2);
                        vm.settings.speedCommon.tollsSurChargeType = parseInt(vm.settings.speedCommon.tollsSurChargeType);
                        vm.settings.speedCommon.fineSurchargeType = parseInt(vm.settings.speedCommon.fineSurchargeType);
                        vm.settings.speedCommon.parkingSurchargeType = parseInt(vm.settings.speedCommon.parkingSurchargeType);
                        vm.settings.speedCommon.brokerContactGroupId = parseInt(vm.settings.speedCommon.brokerContactGroupId);
                        vm.settings.speedCommon.vehicleRepairForLedgerAccountId = parseInt(vm.settings.speedCommon.vehicleRepairForLedgerAccountId);
                        vm.settings.speedCommon.halfDaySlab1From = parseInt(vm.settings.speedCommon.halfDaySlab1From);
                        vm.settings.speedCommon.halfDaySlab1To = parseInt(vm.settings.speedCommon.halfDaySlab1To);
                        vm.settings.speedCommon.halfDaySlab2From = parseInt(vm.settings.speedCommon.halfDaySlab2From);
                        vm.settings.speedCommon.halfDaySlab2To = parseInt(vm.settings.speedCommon.halfDaySlab2To);
                        vm.settings.speedCommon.invoicingRuleIndividual = parseInt(vm.settings.speedCommon.invoicingRuleIndividual);
                        vm.settings.speedCommon.invoicingTypeIndividual = parseInt(vm.settings.speedCommon.invoicingTypeIndividual);
                        vm.settings.speedCommon.invoicingRuleCorporate = parseInt(vm.settings.speedCommon.invoicingRuleCorporate);
                        vm.settings.speedCommon.invoicingTypeCorporate = parseInt(vm.settings.speedCommon.invoicingTypeCorporate);

                        vm.settings.speedCommon.accessoriesInvoicingRuleIndividual = parseInt(vm.settings.speedCommon.accessoriesInvoicingRuleIndividual);
                        vm.settings.speedCommon.accessoriesInvoicingTypeIndividual = parseInt(vm.settings.speedCommon.accessoriesInvoicingTypeIndividual);
                        vm.settings.speedCommon.accessoriesInvoicingRuleCorporate = parseInt(vm.settings.speedCommon.accessoriesInvoicingRuleCorporate);
                        vm.settings.speedCommon.accessoriesInvoicingTypeCorporate = parseInt(vm.settings.speedCommon.accessoriesInvoicingTypeCorporate);

                        vm.settings.speedCommon.defaultInvoicingRuleforWeeklyInvoicesIndividual = parseInt(vm.settings.speedCommon.defaultInvoicingRuleforWeeklyInvoicesIndividual);
                        vm.settings.speedCommon.defaultInvoicingRuleforWeeklyInvoicesCompany = parseInt(vm.settings.speedCommon.defaultInvoicingRuleforWeeklyInvoicesCompany);


                        vm.settings.speedCommon.leaseInvoicingRuleIndividual = parseInt(vm.settings.speedCommon.leaseInvoicingRuleIndividual);
                        vm.settings.speedCommon.leaseInvoicingTypeIndividual = parseInt(vm.settings.speedCommon.leaseInvoicingTypeIndividual);
                        vm.settings.speedCommon.leaseInvoicingRuleCorporate = parseInt(vm.settings.speedCommon.leaseInvoicingRuleCorporate);
                        vm.settings.speedCommon.leaseInvoicingTypeCorporate = parseInt(vm.settings.speedCommon.leaseInvoicingTypeCorporate);

                        vm.settings.speedCommon.excessKMsInvoicingRuleRental = parseInt(vm.settings.speedCommon.excessKMsInvoicingRuleRental);
                        vm.settings.speedCommon.accessoriesExcessKMsInvoicingRuleRental = parseInt(vm.settings.speedCommon.accessoriesExcessKMsInvoicingRuleRental);
                        vm.settings.speedCommon.excessKMsInvoicingRuleLease = parseInt(vm.settings.speedCommon.excessKMsInvoicingRuleLease);

                        vm.settings.speedCommon.assetDisposalPostingOptions = parseInt(vm.settings.speedCommon.assetDisposalPostingOptions);
                        vm.settings.speedCommon.profitMarginOnBookValue = parseFloat(vm.settings.speedCommon.profitMarginOnBookValue);

                        vm.settings.speedCommon.dueDefleetVehiclesReportsKMs = parseInt(vm.settings.speedCommon.dueDefleetVehiclesReportsKMs);
                        vm.settings.speedCommon.dueDefleetVehiclesReportsPeriod = parseFloat(vm.settings.speedCommon.dueDefleetVehiclesReportsPeriod);
                        vm.settings.speedCommon.stripeReceiptPaymentMethod = parseInt(vm.settings.speedCommon.stripeReceiptPaymentMethod);
                        vm.settings.speedCommon.taxPercentage = parseFloat(vm.settings.speedCommon.taxPercentage);
                        vm.settings.speedCommon.currentFuelPrice = parseFloat(vm.settings.speedCommon.currentFuelPrice);
                        vm.settings.speedCommon.salesPersonDesignation = parseInt(vm.settings.speedCommon.salesPersonDesignation);

                        vm.getTenantLinkedCustomer(vm.settings.speedCommon.tenantLinkedCustomer);
                        vm.getDefaultDriver(vm.settings.speedCommon.defaultDriverIdForEquipmentAgreement);

                        //vm.getTenantLinkedSupplier(vm.settings.speedCommon.tenantLinkedSupplier);
                        //pos get setting
                        vm.posDefaultCustomerselect(vm.settings.speedCommon.posDefaultCustomer);

                        vm.settings.speedCommon.expenseTypeCanBeCreatedWithName = parseInt(vm.settings.speedCommon.expenseTypeCanBeCreatedWithName);
                        if (vm.isExpenseTypeEnabled)
                            vm.getExpenseType(vm.settings.speedCommon.expenseTypeCanBeCreatedWithName);
                       
                     
                        vm.settings.documentNos.couponNumericPartLength = parseInt(vm.settings.documentNos.couponNumericPartLength);
                        vm.settings.documentNos.nummericPartLength = parseInt(vm.settings.documentNos.nummericPartLength);
                        vm.settings.documentNos.bookingNummericPartLength = parseInt(vm.settings.documentNos.bookingNummericPartLength);
                        vm.settings.documentNos.supplierAgreementNumericPartLength = parseInt(vm.settings.documentNos.supplierAgreementNumericPartLength);
                        vm.settings.documentNos.externalDriverAgreementNumericPartLength = parseInt(vm.settings.documentNos.externalDriverAgreementNumericPartLength);
                        vm.settings.documentNos.coA_SubAccountLength = parseInt(vm.settings.documentNos.coA_SubAccountLength);
                        vm.settings.documentNos.invoiceNummericPartLength = parseInt(vm.settings.documentNos.invoiceNummericPartLength);
                        vm.settings.documentNos.receiptNummericPartLength = parseInt(vm.settings.documentNos.receiptNummericPartLength);
                        vm.settings.documentNos.masterAgreementNummericPartLength = parseInt(vm.settings.documentNos.masterAgreementNummericPartLength);
                        vm.settings.documentNos.equipmentDeliveryNummericPartLength = parseInt(vm.settings.documentNos.equipmentDeliveryNummericPartLength);
                        vm.settings.documentNos.quotationNummericPartLength = parseInt(vm.settings.documentNos.quotationNummericPartLength);
                        vm.settings.documentNos.debitNoteNummericPartLength = parseInt(vm.settings.documentNos.debitNoteNummericPartLength);
                        vm.settings.documentNos.customerDepositNummericPartLength = parseInt(vm.settings.documentNos.customerDepositNummericPartLength);
                        vm.settings.documentNos.depreciationNummericPartLength = parseInt(vm.settings.documentNos.depreciationNummericPartLength);
                        vm.settings.documentNos.amortizationNummericPartLength = parseInt(vm.settings.documentNos.amortizationNummericPartLength);
                        vm.settings.documentNos.purchaseOrderNummericPartLength = parseInt(vm.settings.documentNos.purchaseOrderNummericPartLength);
                        vm.settings.documentNos.purchaseRequestNummericPartLength = parseInt(vm.settings.documentNos.purchaseRequestNummericPartLength);
                        vm.settings.documentNos.saleOrderNummericPartLength = parseInt(vm.settings.documentNos.saleOrderNummericPartLength);
                        vm.settings.documentNos.provisionNummericPartLength = parseInt(vm.settings.documentNos.provisionNummericPartLength);
                        vm.settings.documentNos.matureChequePayableNummericPartLength = parseInt(vm.settings.documentNos.matureChequePayableNummericPartLength);
                        vm.settings.documentNos.matureChequeReceivableNummericPartLength = parseInt(vm.settings.documentNos.matureChequeReceivableNummericPartLength);
                        vm.settings.documentNos.cashBankDepositNummericPartLength = parseInt(vm.settings.documentNos.cashBankDepositNummericPartLength);
                        vm.settings.documentNos.creditCardTransactionsBankTransferNummericPartLength = parseInt(vm.settings.documentNos.creditCardTransactionsBankTransferNummericPartLength);
                        vm.settings.documentNos.openingBalanceNummericPartLength = parseInt(vm.settings.documentNos.openingBalanceNummericPartLength);
                        vm.settings.documentNos.jvNummericPartLength = parseInt(vm.settings.documentNos.jvNummericPartLength);
                        vm.settings.documentNos.creditNoteNummericPartLength = parseInt(vm.settings.documentNos.creditNoteNummericPartLength);
                        vm.settings.documentNos.paymentNummericPartLength = parseInt(vm.settings.documentNos.paymentNummericPartLength);
                        vm.settings.documentNos.billNummericPartLength = parseInt(vm.settings.documentNos.billNummericPartLength);
                        vm.settings.documentNos.jvNummericPartLength = parseInt(vm.settings.documentNos.jvNummericPartLength);
                        vm.settings.speedCommon.taxPercentage = parseFloat(vm.settings.speedCommon.taxPercentage);
                        vm.settings.documentNos.rateCardForWebBookingPlugin = parseInt(vm.settings.documentNos.rateCardForWebBookingPlugin);

                        vm.settings.documentNos.customerCodeNumericPart = parseInt(vm.settings.documentNos.customerCodeNumericPart);
                        vm.settings.documentNos.supplierCodeNumericPart = parseInt(vm.settings.documentNos.supplierCodeNumericPart);
                        vm.settings.documentNos.staffCodeNumericPart = parseInt(vm.settings.documentNos.staffCodeNumericPart);

                        vm.settings.documentNos.leaseInquiryCodeNumericPart = parseInt(vm.settings.documentNos.leaseInquiryCodeNumericPart);
                        vm.settings.documentNos.leaseQuotationCodeNumericPart = parseInt(vm.settings.documentNos.leaseQuotationCodeNumericPart);

                        vm.settings.documentNos.cancelChequePayableNummericPartLength = parseInt(vm.settings.documentNos.cancelChequePayableNummericPartLength);
                        vm.settings.documentNos.returnChequeReceivableNummericPartLength = parseInt(vm.settings.documentNos.returnChequeReceivableNummericPartLength);


                        vm.settings.documentNos.jobNummericPartLength = parseInt(vm.settings.documentNos.jobNummericPartLength);
                        vm.settings.documentNos.jobEstimationNummericPartLength = parseInt(vm.settings.documentNos.jobEstimationNummericPartLength);


                        vm.settings.documentNos.jobNummericPartLength = parseInt(vm.settings.documentNos.jobNummericPartLength);
                        vm.settings.documentNos.jobEstimationNummericPartLength = parseInt(vm.settings.documentNos.jobEstimationNummericPartLength);
                        if (vm.settings.agreementDocument.agreementDocuments)
                            vm.settings.agreementDocument.agreementDocuments = JSON.parse(vm.settings.agreementDocument.agreementDocuments);
                        else
                            vm.settings.agreementDocument.agreementDocuments = [];

                        vm.settings.documentNos.rentalQuotationCodeNumericPart = parseInt(vm.settings.documentNos.rentalQuotationCodeNumericPart);
                        vm.settings.documentNos.salesAgreementCodeNumericPart = parseInt(vm.settings.documentNos.salesAgreementCodeNumericPart);
                        vm.settings.documentNos.salesQuotationCodeNumericPart = parseInt(vm.settings.documentNos.salesQuotationCodeNumericPart);


                        vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod = parseInt(vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod);
                        vm.settings.speedCommon.specialBranchwithnoFinancialeffects = parseInt(vm.settings.speedCommon.specialBranchwithnoFinancialeffects);
                        vm.settings.speedCommon.whileDispatchingTripAllowOnlySelect = parseInt(vm.settings.speedCommon.whileDispatchingTripAllowOnlySelect);
                        vm.settings.speedCommon.ddaReceiptsPaymentMethod = parseInt(vm.settings.speedCommon.ddaReceiptsPaymentMethod);
                        //vm.settings.documentNos.daily = parseInt(vm.settings.documentNos.daily);
                        //vm.settings.documentNos.monthly = parseInt(vm.settings.documentNos.monthly);
                        //vm.settings.documentNos.weekly = parseInt(vm.settings.documentNos.weekly);
                        //vm.settings.speedCommon.weekEndDay2.id = vm.settings.speedCommon.weekEndDay2;
                        //vm.settings.speedCommon.weekEndDay1.Id = vm.settings.speedCommon.weekEndDay1;
                     
                    }).finally(function () {
                        vm.loading = false;
                        vm.getNotificationAdvanceSetting();
                    });



            };


            vm.saveEquipmentSettings = function () {
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateEquipmentSettings(
                    vm.settings.equipment
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };


            vm.saveDocumentNosSettings = function () {
                vm.saving = true;
                vm.loading = true;
                tenantSettingsService.updateDocumentNosSettings(
                    vm.settings.documentNos
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function ValidatingSettings(settingDetail) {
                var weekEndDayValidate = {};
                errorMessage = '';
                errorMessage = 'Setting Can Not Be Updated Due To Following Issues: \n';

                if (isValid == false) {
                    isValid = true;
                }
                if (settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (settingDetail.speedCommon.weekEndDay2 == 0) {
                            weekEndDayValidate = 7;
                        }
                        else {
                            weekEndDayValidate = settingDetail.speedCommon.weekEndDay2;
                        }


                    }

                }

                if (settingDetail.speedCommon.weekEndDay1 == null || isNaN(settingDetail.speedCommon.weekEndDay1)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n WeekEnd Day1 Can Not Be Empty';

                }


                if (isValid == true && settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (weekEndDayValidate != (settingDetail.speedCommon.weekEndDay1 + 1)) {
                            isValid = false;
                            errorMessage = errorMessage + '\n WeekEnd Days Must Be Consecutive ';
                        }
                    }
                }

                //Validating for Email
                var errorFieldCount = 0;
                if (!settingDetail.email.defaultFromAddress) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.defaultFromDisplayName) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpHost) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpPort && settingDetail.email.smtpPort <= 0) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpUseDefaultCredentials) {
                    if (!settingDetail.email.smtpUserName) {
                        errorFieldCount++;
                    }
                    if (!settingDetail.email.smtpPassword) {
                        errorFieldCount++;
                    }
                }

                if (errorFieldCount == 0) {
                    //valid for saving
                }
                else if (!settingDetail.email.smtpUseDefaultCredentials && errorFieldCount == 6) {
                    //skip email info saving
                }
                else if (settingDetail.email.smtpUseDefaultCredentials && errorFieldCount == 4) {
                    //skip email info saving
                }
                else {
                    isValid = false;
                    errorMessage = errorMessage + '\nEmail information is incomplete';
                }

            }
            function validatingCommonSettings(settingDetail) {
                var weekEndDayValidate = {};
                errorMessage = '';
                errorMessage = 'Setting Can Not Be Updated Due To Following Issues: \n';

                if (isValid == false) {
                    isValid = true;
                }
                if (settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (settingDetail.speedCommon.weekEndDay2 == 0) {
                            weekEndDayValidate = 7;
                        }
                        else {
                            weekEndDayValidate = settingDetail.speedCommon.weekEndDay2;
                        }


                    }

                }

                if (settingDetail.speedCommon.weekEndDay1 == null || isNaN(settingDetail.speedCommon.weekEndDay1)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n WeekEnd Day1 Can Not Be Empty';

                }


                if (isValid == true && settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (weekEndDayValidate != (settingDetail.speedCommon.weekEndDay1 + 1)) {
                            isValid = false;
                            errorMessage = errorMessage + '\n WeekEnd Days Must Be Consecutive ';
                        }
                    }
                }

            }
            vm.saveAll = function () {

                ValidatingSettings(vm.settings);
                if (vm.settings.speedCommon.tollsCutOffDate)
                    vm.settings.speedCommon.tollsCutOffDate = moment(vm.settings.speedCommon.tollsCutOffDate).startOf('day');
                if (!vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect)
                    vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect = 0;
                if (isValid) {
                    tenantSettingsService.updateAllSettings(
                        vm.settings
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };
            vm.saveCommonSettings = function () {
                vm.saving = true;
                validatingCommonSettings(vm.settings);
                if (vm.settings.speedCommon.invoicingStartDate)
                    vm.settings.speedCommon.invoicingStartDate = moment(vm.settings.speedCommon.invoicingStartDate).startOf('day');

                
           
              
                if (vm.islinkCrsToWorkShopEnabled && vm.islinkWorkShopToCrsTenantNameHasValue && vm.branchSuppliersLinkings) {
                    var branchSuppliersLinkingsTemp = vm.branchSuppliersLinkings.map(e => {
                        return {
                            branchId: e.branchId,
                            branchName: e.branchName,
                            supplierId: e.supplier ? e.supplier.id : null,
                            supplierName: e.supplier ? e.supplier.name : null
                        };
                    });

                    vm.settings.speedCommon.tenantLinkedSuppliers = JSON.stringify(branchSuppliersLinkingsTemp);
                }


                if (isValid) {
                    vm.loading = true;
                    if (!vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod)
                        vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod = 0;
                    if (!vm.settings.speedCommon.specialBranchwithnoFinancialeffects)
                        vm.settings.speedCommon.specialBranchwithnoFinancialeffects = 0;
                    if (!vm.settings.speedCommon.salesPersonDesignation)
                        vm.settings.speedCommon.salesPersonDesignation = 0;

                    tenantSettingsService.updateCommonSettings(
                        vm.settings.speedCommon

                    ).success(function () {
                        vm.loading = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                        vm.loading = false;
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };

            vm.advanceSettingDcoumentsRowChanged = function (item) {

                //var docs = $filter('filter')(vm.settings.formsAndFields.documentType, {
                //    identityDocumentType: item.identityDocumentType
                //}, true);
                var targetIdentityDocumentType = item.identityDocumentType; // Store the target value for comparison

                var docs = vm.settings.formsAndFields.documentType.filter(function (item) {
                    return item.identityDocumentType === targetIdentityDocumentType;
                });
                if (docs.length > 1) {
                    //item =
                    //    {
                    //        documentNo: "",
                    //        identityDocumentType: null,
                    //        issuedBy: "",
                    //        issueDate: null,
                    //        expiryDate: null,
                    //        images: []
                    //    };
                    item.identityDocumentType = null;
                    abp.notify.warn(app.localize('AlreadyExist'));
                }
                vm.isinvalidFormsAndFieldsTableFunc();
            };

            function init() {
                getLocations();
            }

            vm.getSettings();
            init();
        }
    ]);
