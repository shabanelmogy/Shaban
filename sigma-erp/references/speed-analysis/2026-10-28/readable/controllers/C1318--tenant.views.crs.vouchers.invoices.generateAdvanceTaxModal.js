// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:346113-346973
appModule.controller('tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal', [
        '$uibModal', '$uibModalInstance', 'invoiceId', '$q', 'abp.services.app.account', 'abp.services.app.commonAgreement', 'abp.services.app.directory', 'abp.services.app.invoice', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities', 'abp.services.app.chargesSetting', '$filter',
        'abp.services.app.limoTrip', 'appSession', '$rootScope', 'abp.services.app.item', 'abp.services.app.costCenter', 'abp.services.app.receipt', 'advanceReceiptData', 'abp.services.app.salesAgreement', 'abp.services.app.salesQuotation', 'abp.services.app.vehicleModel',
        function ($uibModal, $uibModalInstance, invoiceId, $q, accountService, commonAgreementService, directoryService, invoiceService, commonLookupService, vehicleService, utilities, chargesSettingService, $filter, limoTripService, appSession, $rootScope, itemAppService, costCenterService, receiptService, advanceReceiptData, salesAgreementService, salesQuotationService, vehicleModelService) {

            var vm = this;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.isGargashERL = vm.tenancyName && vm.tenancyName.toLowerCase() === 'gargasherl';
            vm.branchTaxPercentage = null;
            vm.loading = false;
            vm.lockAmountFields = false;
            vm.chargesTypes = [];
            vm.documents = [];
            vm.canGenerateDownpayentReceipt = abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt');
            vm.canGenerateDownpaymentReceiptFromQuotation = abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt');
            if (vm.canGenerateDownpayentReceipt) {
                if (advanceReceiptData) {
                    vm.salesAgreementId = advanceReceiptData.agreementId;
                }
            }
            if (vm.canGenerateDownpaymentReceiptFromQuotation) {
                if (advanceReceiptData) {
                    vm.salesQuotationId = advanceReceiptData.quotationId;
                }
            }
            var isValid = true;
            vm.closedAgreements = false;
            vm.makeReceiptOptionalInAdvanceTaxInvoice = utilities.parseBoolean(abp.setting.get("App.General.MakeReceiptOptionalInAdvanceTaxInvoice"));
            vm.isEditMode = false;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isDepositInATIEnabled = abp.features.isEnabled("CRS.CustomFeatures.DepositInAdvanceTaxInvoice")
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForInvoices");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.generateAdvanceTaxInvoiceFromAdvanceTaxReceipt = utilities.parseBoolean(abp.setting.get("App.General.GenerateAdvanceTaxInvoiceFromAdvanceTaxReceipt"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isInvoiceDateAsGenerationDateForAllInvoices = utilities.parseBoolean(abp.setting.get("App.General.InvoiceDateAsGenerationDateForAllInvoices"));

            vm.manualInvoiceNo = utilities.parseBoolean(abp.setting.get("App.General.ManualInvoiceNo"));
            vm.isInvoiceTnCNotesEnabled = utilities.parseBoolean(abp.setting.get("App.General.InvoiceTermsAndConditionsNotes"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.tenantId = appSession.tenant.id;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isBadDebtProvisionEnabled = abp.features.isEnabled('CRS.Reports.BadDebtProvision');
            if (vm.isPostTaxInclusive)
                vm.isTaxInclusive = false;

            vm.isMergedRentalInvoice = false;
            //vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'limo'; 
            vm.taxAccepted = false;
            vm.saveAndPrint = false;
            vm.invoice = {
                voucherLines: []
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.chargesTypeVoucherLine = function (item) {
                if (vm.invoice.voucherLines.length > 1) {
                    if (item.refNo == vm.invoice.voucherLines[0].refNo)
                        return true;
                }
                return false;
            };
            vm.getColspan = function () {
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: vm.invoice.voucherLines[0].refNo
                }, true).length + 2;
                return foundLines;
            };
            vm.chargesTypeVoucherLineRepeat = function (value) {
                if (vm.invoice.voucherLines.length > 1 && value.chargesTypeId == 24) {


                    return true;
                };
                return false;
            };


            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {
                if ($select.search == '') return;
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: contactId, agreementCategory: vm.enabledModule === 5 ? 4 : vm.enabledModule }).then(function (response) {
                    vm.agreements = response.data.items;
                });
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

            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.amountMinValue = 100;

            vm.depositSelected = function () {
                if (vm.isDepositInATIEnabled && vm.invoice.parentVoucher.type == 10) {
                    vm.invoice.voucherLines[0].amount = vm.invoice.parentVoucher.amount;
                    vm.invoice.voucherLines[0].credit = utilities.round((vm.invoice.voucherLines[0].amount * 100) / (100 + vm.invoice.taxPercent));
                    vm.invoice.voucherLines[0].tax = utilities.round(vm.invoice.voucherLines[0].amount - vm.invoice.voucherLines[0].credit, 2);
                    vm.lockAmountFields = true;
                    vm.invoice.tax = vm.invoice.voucherLines[0].tax;
                    vm.invoice.amount = vm.invoice.voucherLines[0].amount;
                }
            }

            vm.amountChanged = function () {
                if (vm.invoice.amount > 0) {
                    var currencyName = null;
                    var decimalName = null;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.invoice.contact) {
                            currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                            decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);
                }
            };

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY-MM-DD HH:mm';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
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
            vm.onCustomerSelect = function () {
                vm.invoice.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                if (vm.isEditMode && vm.invoiceTaxPercent > 0) {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.invoiceTaxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.invoice.contact.isTaxExempted) {
                        if (vm.invoice.contact.taxCodeId > 0) {
                            vm.invoice.taxPercent = vm.invoice.contact.taxCode.taxPercent;
                            vm.taxPercent = vm.invoice.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                            vm.taxPercent = vm.invoice.taxPercent;

                        }
                    }
                }
                else {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.invoice.contact.isTaxExempted) {
                        if (vm.invoice.contact.taxCodeId > 0) {
                            vm.invoice.taxPercent = vm.invoice.contact.taxCode.taxPercent;
                            vm.taxPercent = vm.invoice.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                            vm.taxPercent = vm.invoice.taxPercent;

                        }
                    }
                }
                vm.invoice.parentVoucher = null;
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.invoice.contact.currencyDto) {
                        vm.currencyCode = vm.invoice.contact.currencyDto.code;
                        vm.invoice.currencyId = vm.invoice.contact.currencyDto.id;
                        currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                        decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        vm.invoice.amountInWords = " ";


                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }


                vm.invoice.voucherLines[0].credit = 0;
                vm.invoice.voucherLines[0].tax = 0;
                vm.invoice.voucherLines[0].amount = 0;
                vm.invoice.tax = 0;
                vm.invoice.amount = 0;
                vm.lockAmountFields = false;
            };

            function getAdvanceReceipts(contactId, voucherNo) {
                receiptService.getAdvanceReceipts({ contactId, voucherNo })
                    .success(result => {
                        vm.advanceReceipts = result;
                    });
            }

            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            function getAdvanceTaxReceipt(receiptId) {
                receiptService.getAdvanceTaxReceipt(receiptId)
                    .success(result => {
                        vm.invoice.parentVoucher = result;
                    });
            }

            vm.searchAdvanceReceipts = ($select) => {
                getAdvanceReceipts(vm.invoice.contactId, $select.search);
            }

            // Searching Accounts
            vm.searchAccounts = function ($select) {

                if ($select.search == "") { vm.accounts = null; return null; }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.invoice.contact = result;
                        vm.invoice.contactId = vm.invoice.contact.id;
                        vm.onCustomerSelect();
                    }
                });
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.uploadDocumentsModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (result) {
                    if (!vm.documents) {
                        vm.documents = [];
                    }
                    vm.documents.push(result);
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };


            // Saving Invoice
            vm.save = function () {

                if (!vm.isEditMode) {
                    var date = new Date(vm.invoice.date);

                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    //date.setMilliseconds(0);

                    vm.invoice.date = date;
                }
                vm.invoice.voucherSubTypeId = 65; // tax advance invoice
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    module: vm.enabledModule,
                }, true);

                vm.invoice.voucherLines = foundLines;
                vm.saving = true;
                if (isValid) {
                    //vm.invoice.module = vm.enabledModule;
                    vm.invoice.voucherDocuments = vm.documents;
                    invoiceService.createOrUpdateAdvanceTaxInvoice({ invoice: vm.invoice }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.invoice.id = result;
                        if (vm.saveAndPrint) {
                            var printHeaderCheck = $rootScope.headerPrintCheck;
                            saveAndPrint(vm.invoice.id, printHeaderCheck);
                        }
                        //printHeaderCheck passed from index.js 
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }


            };

            function invoiceLineObject() {
                var line = new Object();
                line.chargesTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.taxable = false;
                line.module = vm.enabledModule;
                return line;
            }

            vm.calculateCreditAndTax = (voucherLine) => {
                if (voucherLine.taxable || (voucherLine.chargesType && voucherLine.chargesType.taxable) || voucherLine.accountId) {
                    voucherLine.credit = parseFloat(voucherLine.amount) * (100 / (100 + vm.invoice.taxPercent));
                    voucherLine.tax = parseFloat(voucherLine.amount) - voucherLine.credit;
                }
                else {
                    voucherLine.credit = parseFloat(voucherLine.amount);
                    voucherLine.tax = 0;
                }
                voucherLine.credit = vm.rounding(voucherLine.credit);
                voucherLine.tax = vm.rounding(voucherLine.tax);
                vm.sumAmountTax();
            }

            vm.amountMinValue = 100;

            vm.sumAmount = function () {
                if (vm.invoice == null)
                    return 0;

                if (vm.invoice.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.invoice.voucherLines.length; i++) {
                    if (vm.invoice.voucherLines[i].credit != null && vm.invoice.voucherLines[i].module == vm.enabledModule) {
                        sum = sum + parseFloat(vm.invoice.voucherLines[i].credit);

                        if (vm.invoice.taxPercent > 0) {
                            var tax = 0;
                            if (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (vm.invoice.voucherLines[i].credit * 100) / (100 + vm.invoice.taxPercent);
                                    tax = utilities.round(vm.invoice.voucherLines[i].credit - chargesWithoutTax, 2);
                                    totalTax += utilities.round(tax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(vm.invoice.voucherLines[i].credit * vm.invoice.taxPercent / 100, 2);
                                    totalTax += utilities.round(tax, 2);
                                    // vm.tripCharges[i].charges += utilities.round(tax,2);

                                }
                                vm.invoice.voucherLines[i].tax = tax;
                                vm.invoice.voucherLines[i].taxable = true;
                            }
                            else {
                                vm.invoice.voucherLines[i].tax = 0;
                                vm.invoice.voucherLines[i].taxable = (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable);
                            }

                        }
                        else {
                            vm.invoice.voucherLines[i].tax = 0;
                            vm.invoice.voucherLines[i].taxable = (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable);
                        }
                    }
                    return utilities.round(tax, 2);
                };

                vm.rounding = function (value) {
                    return utilities.round(value, 2);
                };

                vm.invoice.amountInWords = '';

                vm.invoice.tax = totalTax;
                vm.invoice.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    var currencyName = null;
                    var decimalName = null;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.invoice.contact) {
                            currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                            decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.setTaxPercentOnTaxCode = function () {
                if (vm.invoice.contact.isTaxExempted)
                    vm.invoice.taxPercent = 0;
                if (vm.isTaxCodeEnabled && !vm.invoice.contact.isTaxExempted) {
                    if (vm.invoice.contact.taxCodeId > 0) {
                        vm.invoice.taxPercent = vm.invoice.contact.taxCode.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;

                    }
                }
            }

            vm.calculateTaxPerRow = function (row) {
                if (vm.invoice == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                //if (row.credit != null && row.module == vm.enabledModule) {
                //    if (vm.invoice.taxPercent > 0) {
                //        var tax = 0;
                //        if (row.accountId) {
                //            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                //                //equation solved from following formula... 
                //                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                //                var chargesWithoutTax = (row.credit * 100) / (100 + vm.invoice.taxPercent);
                //                tax = utilities.round(row.credit - chargesWithoutTax, 2);
                //            } else {
                //                //prices are without tax. calculate tax and include in total
                //                tax = utilities.round(row.credit * vm.invoice.taxPercent / 100, 2);
                //                // vm.tripCharges[i].charges += utilities.round(tax,2);

                //            }
                //            row.tax = tax;
                //            row.taxable = true;
                //        }

                //    }
                //    else {
                //        row.tax = 0;
                //        row.taxable = (row.chargesType ? row.chargesType.taxable : false) || row.taxable;
                //    }
                //}

                if (row.credit != null && row.module == vm.enabledModule) {
                    if (vm.invoice.taxPercent > 0) {
                        var tax = 0;
                        if (row.chargesType && (row.chargesType.taxable || row.taxable)) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (row.credit * 100) / (100 + vm.invoice.taxPercent);
                                tax = utilities.round(row.credit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.credit * vm.invoice.taxPercent / 100, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            row.tax = tax;
                            row.taxable = true;
                        }
                        else if (row.accountId) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (row.credit * 100) / (100 + vm.invoice.taxPercent);
                                tax = utilities.round(row.credit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.credit * vm.invoice.taxPercent / 100, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            row.tax = tax;
                            row.taxable = true;
                        }
                        //else {
                        //    row.tax = 0;
                        //    row.taxable = (row.chargesType.taxable || row.taxable);
                        //}

                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.chargesType ? row.chargesType.taxable : false) || row.taxable;
                    }
                }

                vm.sumAmountTax();
                row.amount = vm.rounding(row.credit + row.tax);


            };



            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.invoice.voucherLines.forEach(function (value) {
                    if (value.credit > 0 || value.credit < 0)
                        totalAmount = totalAmount + parseFloat(value.credit);
                    if (value.tax > 0 || value.tax < 0) {
                        //value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    //else
                    //value.taxable = false;
                    value.amount = value.credit + value.tax;
                });
                vm.invoice.tax = totalTax;
                vm.invoice.amount = !vm.isTaxInclusive ? (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1 : utilities.round(totalAmount, 2);
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    var currencyName = null;
                    var decimalName = null;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.invoice.contact) {
                            currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                            decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.isMultiCurrencyEnabled && vm.invoice.id > 0) {
                        if (vm.invoice.contact) {
                            currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                            decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);
                }
                //return utilities.round(tax, 2);
            };



            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    line = invoiceLineObject();

                vm.invoice.voucherLines.push(line);
            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            vm.getVehicleMakeName = function (vehicleModel) {
                // Returns a promise
                return vehicleModelService.getVehicleModels({
                    name: vehicleModel.name,
                    makeId: vehicleModel.makeId
                }).then(function (response) {
                    if (response.data.items && response.data.items.length > 0) {
                        var model = response.data.items[0];
                        return model.make + " " + model.name;
                    }
                    return vehicleModel.name; // fallback if not found
                });
            };

            function init() {
                vm.loading = true;

                vm.branchTaxCode();
                invoiceService.getInvoiceForEdit({ id: invoiceId }).success(
                    function (result) {
                        vm.invoice = result;
                        vm.documents = vm.invoice.voucherDocuments;
                        if (vm.canGenerateDownpayentReceipt && vm.salesAgreementId) {

                            vm.loading = true;

                            salesAgreementService.getSalesAgreementForEdit({ id: vm.salesAgreementId })
                                .then(function (result) {

                                    vm.salesAgreement = result.data.agreement;

                                    if (vm.salesAgreement && vm.salesAgreement.agreementVehicles) {

                                        var vehicles = vm.salesAgreement.agreementVehicles;

                                        vm.invoice.voucherLines = vm.invoice.voucherLines || [];
                                        if (vm.invoice.voucherLines.length === 0) {
                                            vm.invoice.voucherLines.push({});
                                        }

                                        var fullDescription = "";

                                        if (vm.isGargashERL) {
                                            //  NEW FORMAT (comma separated)
                                            if (vehicles.length > 0) {

                                                var modelName = vehicles[0].vehicle.model.make.name + " " + vehicles[0].vehicle.model.name;

                                                var chassisList = vehicles
                                                    .map(v => v.vehicle.chassisNo)
                                                    .filter(c => c)
                                                    .join(", ");

                                                fullDescription = "Down Payment for " + modelName +
                                                    (chassisList ? " (ChassisNo: " + chassisList + ")" : "");
                                            }
                                        } else {
                                            // ❌ OLD FORMAT (keep existing behavior)
                                            var descParts = vehicles.map(function (v) {
                                                return "Down Payment for "
                                                    + v.vehicle.model.make.name + " "
                                                    + v.vehicle.model.name
                                                    + " (ChassisNo: " + v.vehicle.chassisNo + ")";
                                            });

                                            fullDescription = descParts.join(" | ");
                                        }

                                        //  prevent overwrite in edit
                                        if (!vm.isEditMode && !vm.invoice.voucherLines[0].description) {
                                            vm.invoice.voucherLines[0].description = fullDescription;
                                        }
                                    }

                                })
                                .finally(function () {
                                    vm.loading = false;
                                });
                        }
                        else if (vm.canGenerateDownpaymentReceiptFromQuotation && vm.salesQuotationId) {

                            vm.loading = true;

                            salesQuotationService.getQuotationForEdit({ id: vm.salesQuotationId })
                                .then(function (result) {

                                    vm.salesQuotation = result.data;

                                    if (vm.salesQuotation && vm.salesQuotation.quotationLines) {

                                        var lines = vm.salesQuotation.quotationLines;

                                        vm.invoice.voucherLines = vm.invoice.voucherLines || [];
                                        if (vm.invoice.voucherLines.length === 0) {
                                            vm.invoice.voucherLines.push({});
                                        }

                                        var fullDescription = "";

                                        if (vm.isGargashERL) {
                                            //  NEW FORMAT
                                            if (lines.length > 0) {

                                                var modelName = lines[0].vehicleModel.make.name + " " + lines[0].vehicleModel.name;

                                                var chassisList = lines
                                                    .map(q => q.chassisNo)
                                                    .filter(c => c)
                                                    .join(", ");

                                                fullDescription = "Down Payment for " + modelName +
                                                    (chassisList ? " (ChassisNo: " + chassisList + ")" : "");
                                            }
                                        } else {
                                            // ❌ OLD FORMAT
                                            var descParts = lines.map(function (q) {
                                                return "Down Payment for "
                                                    + q.vehicleModel.make.name + " "
                                                    + q.vehicleModel.name
                                                    + (q.chassisNo ? " (ChassisNo: " + q.chassisNo + ")" : "");
                                            });

                                            fullDescription = descParts.join(" | ");
                                        }

                                        //  prevent overwrite
                                        if (!vm.isEditMode && !vm.invoice.voucherLines[0].description) {
                                            vm.invoice.voucherLines[0].description = fullDescription;
                                        }
                                    }

                                })
                                .finally(function () {
                                    vm.loading = false;
                                });

                        }
                        else {

                            vm.loading = false;
                        }
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.invoice.contact) {
                                if (vm.invoice.contact.currencyDto)
                                    vm.currencyCode = vm.invoice.contact.currencyDto.code;
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }
                        if (invoiceId > 0) {

                            vm.isEditMode = true;
                            vm.invoiceTaxPercent = vm.invoice.taxPercent;

                        }

                        else {
                            vm.isEditMode = false;
                            vm.invoice.badDebt = 0;
                            vm.invoice.taxPercent = vm.taxPercent;
                            vm.invoice.locationId = appSession.user.locationId; //by default assign user branch. later rules are implemented on server side

                            // 
                            vm.addRow();
                            var firstLine = vm.invoice.voucherLines[0];

                            accountService.getAccount({ generalType: 37 }).success(function (result) {
                                var account = result;
                                firstLine.account = account;
                                firstLine.accountId = account.id;
                                firstLine.isDisabled = true;
                                if (vm.generateAdvanceTaxInvoiceFromAdvanceTaxReceipt) {
                                    if (advanceReceiptData) {
                                        vm.lockReceiptAndCustomer = true;
                                    }
                                    vm.invoice.contact = advanceReceiptData.customer;
                                    vm.invoice.contactId = advanceReceiptData.customer.id;
                                    vm.invoice.notes = advanceReceiptData.details;
                                    vm.invoice.receiptId = advanceReceiptData.receiptId;
                                    vm.invoice.parentVoucherId = vm.invoice.receiptId;
                                    vm.invoice.agreementId = advanceReceiptData.agreementId;
                                    if (vm.isTaxCodeEnabled && !advanceReceiptData.customer.isTaxExempted) {
                                        if (!advanceReceiptData.customer.isTaxExempted && advanceReceiptData.customer.taxCode) {

                                            vm.invoice.taxPercent = advanceReceiptData.customer.taxCode.taxPercent;
                                            vm.taxPercent = advanceReceiptData.customer.taxCode.taxPercent;

                                        }
                                        else {
                                            if (vm.branchTaxPercentage) {
                                                vm.invoice.taxPercent = vm.branchTaxPercentage;
                                                vm.taxPercent = vm.branchTaxPercentage;
                                            }
                                        }
                                    }
                                    if (advanceReceiptData.customer.isTaxExempted) {
                                        vm.invoice.taxPercent = 0;
                                        vm.taxPercent = 0;
                                    }



                                    if (vm.invoice.receiptId > 0) {
                                        getAdvanceTaxReceipt(vm.invoice.receiptId);
                                    }
                                    vm.invoice.voucherLines.forEach(vl => {
                                        if (vm.generateAdvanceTaxInvoiceFromAdvanceTaxReceipt) {

                                            vl.credit = utilities.round((advanceReceiptData.amount * 100) / (100 + vm.taxPercent), 2);
                                            vl.tax = utilities.round(advanceReceiptData.amount - vl.credit, 2);
                                            vl.amount = utilities.round(vl.credit + vl.tax, 2);
                                            vm.calculateTaxPerRow(vl);
                                        }
                                    });
                                }

                            }).finally(function () {
                            });

                        }


                        vm.invoice.voucherLines.forEach(vl => {
                            vl.amount = utilities.round(vl.credit + vl.tax, 2);

                        });




                    });
            }

            init();
        }
    ]);
