// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:330331-330959
appModule.controller('tenant.views.crs.vouchers.creditNotes.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'creditNoteId', 'agreement', 'abp.services.app.directory', 'abp.services.app.creditNote', 'utilities', 'abp.services.app.allocation', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.commonAgreement',
        function ($uibModal, $uibModalInstance, creditNoteId, agreement, directoryService, creditNoteService, utilities, allocationService, commonLookupService, appSession, commonAgreementService) {
            var vm = this;
            vm.loading = false;
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isReasonEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Reason"));
            vm.isReasonNoteEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ReasonNote"));
            vm.manualCreditNoteNo = utilities.parseBoolean(abp.setting.get("App.General.ManualCreditNoteNo"));
            vm.isShowAgreementInPayments = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAgreementInPayment"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes');
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.isAssetSalesInvoiceOnlyFeatureEnabled = abp.features.isEnabled("CRS.Vouchers.AssetSalesInvoiceOnly");
            vm.isAssetSalesInvoiceOnly = false;
            vm.assetSalesInvoiceModeInitialized = false;
            vm.assetSalesInvoiceEditTargetId = null;
            vm.documents = [];
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForCreditNote");
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.saveAndPrint = false;
            vm.taxAccepted = false;
            vm.isCustomer = true;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.localize = function (input) {
                return app.localize(input);
            };
            var module = null;
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
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            // ... Converting Amount To Amount In Words ... ///

            vm.amountMinValue = 100;
            vm.customerSettings = function (customer) {
                vm.isCustomer = true;
                if (customer != 2) {
                    vm.isCustomer = false;
                }
            };
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            // American Numbering System
            var th = ['', 'thousand', 'million', 'billion', 'trillion'];
            // uncomment this line for English Number System
            // var th = ['','thousand','million','milliard','billion'];
            var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
            var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

            function toWords(s) {
                s = s + '';
                s = s.replace(/[\, ]/g, '');
                if (s != parseFloat(s)) return 'not a number';
                var x = s.indexOf('.');
                if (x == -1) x = s.length;
                if (x > 15) return 'too big';
                var n = s.split('');
                var str = '';
                var sk = 0;
                for (var i = 0; i < x; i++) {
                    if ((x - i) % 3 == 2) {
                        if (n[i] == '1') {
                            str += tn[Number(n[i + 1])] + ' ';
                            i++;
                            sk = 1;
                        } else if (n[i] != 0) {
                            str += tw[n[i] - 2] + ' ';
                            sk = 1;
                        }
                    } else if (n[i] != 0) {
                        str += dg[n[i]] + ' ';
                        if ((x - i) % 3 == 0) str += 'hundred ';
                        sk = 1;
                    }
                    if ((x - i) % 3 == 1) {
                        if (sk) str += th[(x - i - 1) / 3] + ' ';
                        sk = 0;
                    }
                }
                if (x != s.length) {
                    var y = s.length;
                    str += 'point ';
                    for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
                }
                return str.replace(/\s+/g, ' ') + 'only';
            }
            vm.getAmountInWords = function (amount) {
                if (amount != null && amount > 0) {
                    return utilities.toWords(vm.rounding(amount));
                }
            };

            vm.moduleChanged = function () {
                if (vm.moduleWiseReceivables) {
                    module = vm.enabledModule || null;
                }
                getAllocations();
            };

            vm.isCounterReceivableCreditNote = function () {
                return !vm.creditNote || !vm.creditNote.id || vm.creditNote.voucherSubTypeId === 22;
            };
            vm.isAssetSaleInvoice = function (allocation) {
                return allocation.voucherTypeId == 1 && allocation.voucherSubTypeId == 17;
            };
            vm.showAllocation = function (allocation) {
                if (!(vm.isAssetSalesInvoiceOnlyFeatureEnabled && vm.isCounterReceivableCreditNote()))
                    return !(allocation.voucherTypeId == 1 && allocation.voucherSubTypeId == 17);
                var isAssetSale = vm.isAssetSaleInvoice(allocation);
                var rows = (vm.allocationData && vm.allocationData.allocations) || [];
                if (vm.isAssetSalesInvoiceEdit())
                    return isAssetSale && allocation.voucherLineId === vm.assetSalesInvoiceEditTargetId;
                var selectedAsset = rows.filter(function (row) { return vm.isAssetSaleInvoice(row) && row.allocatedNow > 0; })[0];
                return isAssetSale
                    ? vm.isAssetSalesInvoiceOnly && (!selectedAsset || selectedAsset === allocation)
                    : !vm.isAssetSalesInvoiceOnly && !selectedAsset;
            };
            vm.onAllocationAmountChanged = function (allocation) {
                if (!(vm.isAssetSalesInvoiceOnlyFeatureEnabled && vm.isCounterReceivableCreditNote())) return;
                var isAssetSale = vm.isAssetSaleInvoice(allocation);
                if (isAssetSale && allocation.allocatedNow > 0) {
                    vm.isAssetSalesInvoiceOnly = true;
                    vm.allocationData.allocations.forEach(function (row) { if (row !== allocation) row.allocatedNow = 0; });
                } else if (!isAssetSale && allocation.allocatedNow > 0) {
                    vm.isAssetSalesInvoiceOnly = false;
                    vm.allocationData.allocations.forEach(function (row) { if (vm.isAssetSaleInvoice(row)) row.allocatedNow = 0; });
                }
            };
            vm.canEditAllocatedAmount = function (allocation) {
                var isAssetSale = vm.isAssetSaleInvoice(allocation);
                if (vm.isAssetSalesInvoiceOnlyFeatureEnabled && vm.isCounterReceivableCreditNote() && isAssetSale) return true;
                return !((allocation.manuallyAllocatedCharges && allocation.manuallyAllocatedCharges.length > 0) || vm.isEditedMode || vm.isAllocationWithChargesTypeEnabled);
            };
            vm.onAssetSalesInvoiceOnlyChanged = function () {
                if (!(vm.isAssetSalesInvoiceOnlyFeatureEnabled && vm.isCounterReceivableCreditNote())) return;
                if (vm.allocationData && vm.allocationData.allocations) {
                    vm.allocationData.allocations.forEach(function (row) {
                        var isAssetSale = vm.isAssetSaleInvoice(row);
                        if ((vm.isAssetSalesInvoiceOnly && !isAssetSale) || (!vm.isAssetSalesInvoiceOnly && isAssetSale)) row.allocatedNow = 0;
                    });
                }
                getAllocations();
            };
            vm.isAssetSalesInvoiceEdit = function () {
                return vm.isAssetSalesInvoiceOnlyFeatureEnabled && vm.creditNote && vm.creditNote.id
                    && vm.isCounterReceivableCreditNote() && vm.isAssetSalesInvoiceOnly;
            };

            vm.sumAmountAllocation = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;

                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0) {
                        value.allocatedNow = vm.rounding(value.allocatedNow)
                        amount = amount + value.allocatedNow;
                    }

                });
                if (amount <= 0)
                    vm.creditNote.amountInWords = '';
                if (amount > 0)
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.name : null;
                        decimalName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.decimalName : null;
                        vm.creditNote.amountInWords = utilities.toWords(amount, currencyName, decimalName);

                    }
                    else {

                        vm.creditNote.amountInWords = vm.getAmountInWords(amount);
                    }
                return amount;
            };

            vm.onCustomerSelect = function () {
                vm.creditNote.agreementId = null;
                vm.creditNote.agreement = null;
                vm.creditNote.contactId = vm.creditNote.contact.id;
                if (vm.isShowAgreementInPayments) {
                    getAgreements(vm.creditNote.contact.id);
                }
                if (vm.isEditMode && vm.creditNoteTaxPercent > 0) {
                    vm.creditNote.taxPercent = vm.creditNote.contact.isTaxExempted ? 0 : vm.creditNoteTaxPercent;
                    vm.creditNote.isTaxExempted = vm.creditNote.contact.isTaxExempted;
                }
                else {
                    vm.creditNote.taxPercent = vm.creditNote.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.creditNote.isTaxExempted = vm.creditNote.contact.isTaxExempted;
                }
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.creditNote.contact.currencyDto) {
                        vm.currencyCode = vm.creditNote.contact.currencyDto.code;
                        vm.creditNote.currencyId = vm.creditNote.contact.currencyDto.id;
                        vm.creditNote.currencyRate = vm.creditNote.contact.currencyDto.currencyToBaseRate;
                        vm.creditNote.amountInWords = vm.getAmountInWords(vm.creditNote.amount);
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;
                        currencyName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.name : null;
                        decimalName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.decimalName : null;
                        vm.creditNote.amountInWords = vm.getAmountInWords(vm.creditNote.amount);

                    }
                }

                getAllocations();
            };


            vm.onCustomerSelectForAgreement = function (customer) {

                vm.creditNote.contactId = customer.id;

                getAgreements(customer.id);

                if (vm.isMultiCurrencyEnabled) {
                    if (vm.creditNote.contact.currencyDto) {
                        vm.currencyCode = vm.creditNote.contact.currencyDto.code;
                        vm.creditNote.currencyId = vm.creditNote.contact.currencyDto.id;
                        vm.creditNote.currencyRate = vm.creditNote.contact.currencyDto.currencyToBaseRate;
                        vm.creditNote.amountInWords = vm.getAmountInWords(vm.creditNote.amount);
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;
                        currencyName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.name : null;
                        decimalName = vm.creditNote.contact.currencyDto ? vm.creditNote.contact.currencyDto.decimalName : null;
                        vm.creditNote.amountInWords = vm.getAmountInWords(vm.creditNote.amount);

                    }
                }
            };

            function getAgreements(customerId) {
                var agreement = null;
                if (vm.isShowAgreementInPayments) {
                    vm.loading = true;
                    agreement = commonAgreementService.getAllAgreementsOnCustomer({ id: customerId })
                    agreement.success(function (data) {

                        vm.agreementsList = data.items;


                    }).finally(function () {
                        vm.loading = false;
                    });
                }

            };

            vm.onAgreementSelect = function () {

                if (vm.creditNote.agreement) {

                    vm.creditNote.agreementId = vm.creditNote.agreement.id;

                    vm.allocationData.allocations = vm.originalAllocations.filter(function (x) {
                        return x.agreementId == vm.creditNote.agreementId;
                    });

                } else {

                    vm.creditNote.agreementId = null;

                    vm.allocationData.allocations = angular.copy(vm.originalAllocations);
                }
            };


            function getVoucherReasons() {
                commonLookupService.getVoucherReasons().success(function (result) {
                    vm.voucherReasons = result.items;
                })
            };
            function getAllocations() {
                vm.saving = true;
                var voucherTypesFilter = [
                    1, // Invoice,
                    7 // opening Balance
                ]
                var agreementId = null;
                if (vm.creditNote.agreement) {
                    agreementId = vm.creditNote.agreement.id;
                } else if (agreement) {
                    agreementId = agreement.id;

                } else {
                    agreementId = null;
                }
                if (vm.enableModule) {
                    module = vm.enableModule;
                }
                if (vm.isAllocationWithChargesTypeEnabled) {
                    allocationService.getAllocationsForEdit2({ contactId: vm.creditNote.contactId, voucherCategory: 2, VoucherId: creditNoteId, voucherTypesFilter: voucherTypesFilter, agreementId: agreementId, module: module }).success(
                        function (data) {

                            vm.allocationData = data;
                            if (creditNoteId && !vm.assetSalesInvoiceModeInitialized) {
                                var firstAllocated = data.allocations.filter(function (row) { return row.allocatedNow > 0; })[0];
                                vm.isAssetSalesInvoiceOnly = vm.isAssetSalesInvoiceOnlyFeatureEnabled
                                    && vm.isCounterReceivableCreditNote()
                                    && !!firstAllocated && vm.isAssetSaleInvoice(firstAllocated);
                                vm.assetSalesInvoiceEditTargetId = vm.isAssetSalesInvoiceOnly ? firstAllocated.voucherLineId : null;
                                vm.assetSalesInvoiceModeInitialized = true;
                            }

                        }).finally(function () {
                            vm.loading = false;
                            vm.saving = false;
                        });
                } else {
                    allocationService.getAllocationsForEdit({
                        contactId: vm.creditNote.contact.id,
                        agreementId: agreementId,
                        voucherCategory: 2,
                        VoucherId: creditNoteId,
                        voucherTypesFilter: voucherTypesFilter,
                        module: module
                    }).success(function (data) {
                        vm.allocationData = data;
                        if (creditNoteId && !vm.assetSalesInvoiceModeInitialized) {
                            var firstAllocated = data.allocations.filter(function (row) { return row.allocatedNow > 0; })[0];
                            vm.isAssetSalesInvoiceOnly = vm.isAssetSalesInvoiceOnlyFeatureEnabled
                                && vm.isCounterReceivableCreditNote()
                                && !!firstAllocated && vm.isAssetSaleInvoice(firstAllocated);
                            vm.assetSalesInvoiceEditTargetId = vm.isAssetSalesInvoiceOnly ? firstAllocated.voucherLineId : null;
                            vm.assetSalesInvoiceModeInitialized = true;
                        }
                        vm.originalAllocations = angular.copy(data.allocations);
                    }).finally(function () {
                        vm.saving = false;
                        vm.loading = false;
                    });
                }

            }
            vm.getAllocations = getAllocations;
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function getAllLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locationsAll = data.items;
                });
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };
            vm.allocatedNowForOpeningBalance = function (allocation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/allocatedNowForOpeningBalanceModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        allocation: function () {
                            return allocation;
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });
            };
            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
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
                        vm.creditNote.contact = result;
                        vm.onCustomerSelect(result);
                    }
                });
            };

            vm.manuallyAllocatedPopup = function (allocation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/allocatedNowOnChargesTypeModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        allocation: function () {
                            return angular.copy(allocation);
                        },
                        creditNoteId: function () {
                            return vm.isEditedMode ? vm.creditNote.id : null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    allocation.manuallyAllocatedCharges = result;

                    var sumAllocated = 0.0;
                    //if (allocation.manuallyAllocatedCharges.length > 0) {
                    //    allocation.allocateFieldDisable = true;
                    //}

                    angular.forEach(allocation.manuallyAllocatedCharges, function (value, key) {
                        sumAllocated += value.allocateAmountWithTax ? utilities.round(value.allocateAmountWithTax, 2) : 0.0;
                    });

                    allocation.allocatedNow = utilities.round(sumAllocated, 2);

                    var dueAmount = utilities.round(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNow, 2);
                    if (dueAmount < 0) {
                        vm.btnDisable = true;
                    } else {
                        vm.btnDisable = false;
                    }
                });
            };

            var saveAndPrint = function (id) {
                window.open('/Report#/tenant/printModalCreditNote/' + id);
            }
            // Saving CreditNode
            vm.save = function () {
                vm.saving = true;
                var allocations = [];
                vm.creditNote.amount = vm.sumAmountAllocation();
                vm.creditNote.amount = vm.rounding(vm.creditNote.amount);
                if (agreement)
                    vm.creditNote.agreementId = agreement.id;
                if (vm.locations.length == 1) vm.creditNote.locationId = vm.locations[0].id;
                if (vm.allocationData && vm.allocationData.allocations) {
                    angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                        allocations.push({
                            id: allocation.allocationId,
                            allocatedToVoucherLineId: allocation.voucherLineId,
                            amount: allocation.allocatedNow,
                            allocatedList: allocation.allocatedList ? allocation.allocatedList : null,
                            allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                            voucherType: allocation.voucherType,
                            description: allocation.description,
                            notes: allocation.notes,
                            manuallyAllocatedCharges: allocation.manuallyAllocatedCharges
                        });
                    });
                }
                var anyNegativeDueAmount = utilities.checkNegativeDueAmounts(vm.allocationData.allocations);
                if (anyNegativeDueAmount) {
                    vm.saving = false;
                    abp.message.info("One or more due Amounts contain less than zero amount");
                    return;
                }
                //vm.payment.allocations = allocations;
                var creditNoteAllocations = {
                    allocations: allocations,
                    assetSalesInvoiceOnly: vm.isAssetSalesInvoiceOnlyFeatureEnabled
                        && vm.isCounterReceivableCreditNote() && vm.isAssetSalesInvoiceOnly
                }
                if (!creditNoteAllocations.allocations || creditNoteAllocations.allocations.length === 0) {
                    vm.saving = false;
                    abp.message.info("CN can't be created without Invoice allocation");
                    return;
                }

                vm.creditNote.creditNoteAllocations = creditNoteAllocations;
                vm.creditNote.voucherDocuments = vm.documents;
                vm.creditNote.module = module;
                vm.creditNote.agreement = null;
                creditNoteService.createOrUpdateCreditNote({ creditNote: vm.creditNote }
                ).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.creditNote.id = result;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.creditNote.id);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };
            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                getLocations();
                getAllLocations();
                vm.loading = true;
                getVoucherReasons();
                creditNoteService.getCreditNoteForEdit({ id: creditNoteId }).success(
                    function (result) {
                        if (result.contact != null) {
                            vm.customerSettings(result.contact.contactType)
                        }
                        vm.creditNote = result;
                        vm.isAssetSalesInvoiceOnly = false;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.creditNote.contact) {
                                if (vm.creditNote.contact.currency)
                                    vm.currencyCode = vm.creditNote.contact.currency.code;

                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;
                                }
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }
                        vm.documents = vm.creditNote.voucherDocuments;
                        if (vm.creditNote.id > 0) {
                            vm.isEditedMode = true;
                            vm.creditNoteTaxPercent = vm.creditNote.taxPercent;
                            if (vm.creditNote.voucherLines && vm.creditNote.voucherLines.length > 0) {
                                vm.enabledModule = vm.creditNote.voucherLines[0].module;
                            }
                            getAllocations();

                            if (vm.isShowAgreementInPayments && vm.creditNote.agreement) {
                                vm.loading = true;
                                commonAgreementService.getAgreement({
                                    id: vm.creditNote.agreement.id,
                                    includeCustomer: true
                                }).success(function (data) {
                                    vm.creditNote.agreement = data;
                                    vm.creditNote.agreement.locationId = data.locationId;
                                    vm.creditNote.contact = data.customer;
                                    vm.creditNote.contact.currencyDto = data.customer.currency;
                                    vm.creditNote.agreementId = data.id;
                                    vm.creditNote.contactId = vm.creditNote.contact.id;
                                    vm.onCustomerSelectForAgreement(vm.creditNote.contact)
                                }).finally(function () {
                                    vm.loading = false;
                                })
                            }

                        }

                        if (vm.creditNote.id <= 0) {
                            vm.creditNote.voucherNo = null;
                            vm.creditNote.locationId = appSession.user.locationId;
                            vm.creditNote.taxPercent = vm.taxPercent;
                        }
                        if (agreement) {
                            vm.creditNote.contactId = agreement.customerId;
                            vm.creditNote.contact = agreement.customer;
                            getAllocations();
                        }

                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            init();
        }
    ]);
