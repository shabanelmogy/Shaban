// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:334851-335454
appModule.controller('tenant.views.crs.vouchers.debitNotes.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'debitNoteId', 'abp.services.app.directory', 'abp.services.app.debitNote', 'abp.services.app.vehicle', 'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.agreement', '$filter', 'abp.services.app.chargesSetting', 'abp.services.app.account', 'abp.services.app.allocation',
        function ($scope, $uibModal, $uibModalInstance, debitNoteId, directoryService, debitNoteService, vehicleService, utilities, commonLookupService, appSession, agreementService, $filter, chargesSettingService, accountService, allocationService) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.documents = [];
            var isValid = true;
            vm.closedAgreements = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.DebitNotes");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            // vm.isCustomerFeature = abp.features.isEnabled("CRS.Fines.DubaiPolice")
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForDebitNote");
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes');
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.taxAccepted = false;
            vm.isEnableDueAmount = true;
            vm.supplierPaymentEnableSave = true;
            vm.isCustomer = true;
            vm.debitNote = {
                voucherLines: []
            };
            var chargesInput = {
                agreementCategory: null
            }
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
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

            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;

            vm.agreementChanged = function () {
                chargesInput.agreementCategory = vm.debitNote.agreement.agreementCategory;
                //vm.enabledModule = vm.debitNote.agreement.agreementType == 'Daily' || vm.debitNote.agreement.agreementType == 'Weekly' || vm.debitNote.agreement.agreementType == 'Monthly' ? 1 : 2;
                if (vm.debitNote.agreement.agreementCategory == 1 && (vm.debitNote.agreement.agreementType == 1 || vm.debitNote.agreement.agreementType == 2 || vm.debitNote.agreement.agreementType == 3)) {
                    vm.enabledModule = 1;
                }
                else if (vm.debitNote.agreement.agreementCategory == 2 && vm.debitNote.agreement.agreementType == 4) {
                    vm.enabledModule = 2;
                }
                else if (vm.debitNote.agreement.agreementCategory == 4) {
                    vm.enabledModule = 5;
                }
                getChargesTypes();
            };
            function debitNoteLineObject() {
                var line = new Object();
                line.chargesTypeId = null;
                line.description = '';
                line.debitNote = null;
                line.credit = null;
                line.taxable = false;
                line.module = vm.enabledModule;
                return line;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.amountMinValue = 100;
            vm.customerSettings = function (customer) {
                vm.isCustomer = true;
                if (customer != 2) {
                    vm.isCustomer = false;
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.sumAmount = function (taxEditCheck) {

                if (vm.debitNote == null)
                    return 0;

                if (vm.debitNote.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.debitNote.voucherLines.length; i++) {
                    if (vm.debitNote.voucherLines[i].credit != null && vm.debitNote.voucherLines[i].module == vm.enabledModule) {
                        sum = sum + parseFloat(vm.debitNote.voucherLines[i].credit);


                        if (vm.isCustomer) {
                            if (vm.debitNote.taxPercent > 0) {
                                var tax = 0;

                                // Check if voucherlines include chargesType or Account dropdown, if account  then no need of chargestype code.

                                if (vm.debitNote.voucherLines[i].chargesType.taxable || vm.debitNote.voucherLines[i].taxable) {
                                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                        //equation solved from following formula... 
                                        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                        var chargesWithoutTax = (vm.debitNote.voucherLines[i].credit * 100) / (100 + vm.debitNote.taxPercent);
                                        tax = utilities.round(vm.debitNote.voucherLines[i].credit - chargesWithoutTax, 2);
                                        totalTax += utilities.round(tax, 2);
                                    } else {
                                        //prices are without tax. calculate tax and include in total
                                        tax = utilities.round(vm.debitNote.voucherLines[i].credit * vm.debitNote.taxPercent / 100, 2);
                                        totalTax += utilities.round(tax, 2);

                                        // vm.tripCharges[i].charges += utilities.round(tax,2);

                                    }
                                    vm.debitNote.voucherLines[i].tax = tax;
                                    vm.debitNote.voucherLines[i].taxable = true;
                                }
                                else {
                                    vm.debitNote.voucherLines[i].tax = 0;
                                    vm.debitNote.voucherLines[i].taxable = (vm.debitNote.voucherLines[i].chargesType.taxable || vm.debitNote.voucherLines[i].taxable);
                                }
                            }
                            else {
                                vm.debitNote.voucherLines[i].tax = 0;
                                vm.debitNote.voucherLines[i].taxable = (vm.debitNote.voucherLines[i].chargesType.taxable || vm.debitNote.voucherLines[i].taxable);
                            }
                        }
                        else {

                            //  tax = vm.debitNote.voucherLines[i].tax == null ? 0 : vm.debitNote.voucherLines[i].tax;
                            //  totalTax += utilities.round(tax, 2);





                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.debitNote.voucherLines[i].credit * 100) / (100 + vm.debitNote.taxPercent);
                                tax = utilities.round(vm.debitNote.voucherLines[i].credit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = taxEditCheck == true ? vm.debitNote.voucherLines[i].tax : utilities.round(vm.debitNote.voucherLines[i].credit * vm.debitNote.taxPercent / 100, 2)
                                // tax = utilities.round(vm.debitNote.voucherLines[i].credit * vm.debitNote.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                            }
                            vm.debitNote.voucherLines[i].tax = tax;
                            vm.debitNote.voucherLines[i].taxable = true;

                        }



                    }

                }


                vm.debitNote.amountInWords = '';

                vm.debitNote.tax = totalTax;
                vm.debitNote.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.debitNote.amount = utilities.round(vm.debitNote.amount, 2);
                if (vm.debitNote.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.debitNote.taxPercent = vm.taxPercent;
                else
                    vm.debitNote.taxPercent = 0;
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    line = debitNoteLineObject();

                vm.debitNote.voucherLines.push(line);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.debitNote.voucherLines.indexOf(obj);
                vm.debitNote.voucherLines.splice(index, 1);
                vm.sumAmount();
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal as vm',
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

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            vm.onCustomerSelect = function (customer) {
                vm.debitNote.contactId = customer.id;
                vm.debitNote.contact = customer;
                vm.debitNote.agreement = null;
                vm.debitNote.agreementId = null;
                if (customer.contactType == 3) {
                    getAllocations();
                }
                if (vm.isEditMode && vm.debitNoteTaxPercent > 0) {
                    vm.debitNote.taxPercent = vm.debitNote.contact.isTaxExempted ? 0 : vm.debitNoteTaxPercent;
                    vm.debitNote.isTaxExempted = vm.debitNote.contact.isTaxExempted;
                }
                else {
                    vm.debitNote.taxPercent = vm.debitNote.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.debitNote.isTaxExempted = vm.debitNote.contact.isTaxExempted;
                }
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.debitNote.contact.currencyDto) {
                        vm.currencyCode = vm.debitNote.contact.currencyDto.code;
                        vm.debitNote.currencyId = vm.debitNote.contact.currencyDto.id;
                        vm.debitNote.currencyRate = vm.debitNote.contact.currencyDto.currencyToBaseRate;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }
                vm.sumAmount();
                //getAgreements(customer.id);
            };

            vm.moduleChanged = function () {
                getChargesTypes();
                vm.debitNote.voucherLines = [];
                vm.debitNote.amount = 0;
                vm.debitNote.tax = 0;
                vm.debitNote.amountInWords = null;
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

            //function getAgreements(customerId) {

            //    vm.loading = true;
            //    var agreement = null;
            //    vm.debitNote.agreement = null;
            //    vm.debitNote.agreementId = null;
            //    if (vm.closedAgreements == false) {
            //        agreement = agreementService.getOpenAgreementsOnCustomer({ id: customerId });
            //    }
            //    else {
            //        agreement = agreementService.getClosedAgreementsOnCustomer({ id: customerId });
            //    }
            //    agreement.success(function (data) {
            //        if (data) {
            //            vm.agreements = data.items;
            //            if (vm.agreements.length == 0) {
            //                vm.debitNote.agreement = vm.agreements[0];
            //            }
            //        } else { vm.agreements = null; }

            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                //contactType = vm.isAccountFeatureEnabled == true ? 2 : null;
                return directoryService.search({ keyword: $select.search, activeOnly: true, contactType: 3 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };



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
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
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
                            return 3;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.onCustomerSelect(result);
                    }
                    if (result.contactType == 3) {
                        getAllocations();
                    }
                });
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
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


                //In Payment module total supplier allocations amount is compared with  amount, we dont have amount in debit note thats why below lines are commented.can be Modified according to requirement

                //if (amount > 0 && vm.payment.amount != amount)
                //    vm.supplierPaymentEnableSave = false;
                //else
                //    vm.supplierPaymentEnableSave = true;


                vm.supplierPaymentEnableSave = true;

                return utilities.round(amount, 2);
            };


















            // Saving debitNote
            vm.save = function () {
                vm.isValidForSave = true;
                angular.forEach(vm.debitNote.voucherLines, function (value, key) {
                    if (value.fromDate > value.toDate) {
                        vm.isValidForSave = false;
                        abp.message.info(app.localize('From Date should be less then To Date'));
                    }
                });
                if (vm.isValidForSave) {
                    vm.saving = true;

                    isValid = true;
                    var date = new Date(vm.debitNote.date);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    vm.debitNote.date = date;
                    vm.debitNote.voucherSubTypeId = 9

                    if (vm.debitNote.locationId == null || vm.debitNote.locationId == 0) {
                        if (vm.locations.length == 1)
                            vm.debitNote.locationId = vm.locations[0].id;
                    }




                    if (vm.debitNote.contact.contactType != 3) {
                        angular.forEach(vm.debitNote.voucherLines, function (value, key) {
                            value.id = 0;
                            // value.chargesType = null;
                        });

                        var foundLines = $filter('filter')(vm.debitNote.voucherLines, {
                            module: vm.enabledModule,
                        }, true);
                        vm.debitNote.voucherLines = foundLines;
                    }

                    if (vm.debitNote.contact.contactType == 3) {
                        var allocations = [];
                        angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                            allocations.push({
                                id: allocation.allocationId,
                                allocatedToVoucherLineId: allocation.voucherLineId,
                                amount: allocation.allocatedNow,
                                allocatedList: allocation.allocatedList ? allocation.allocatedList : null,
                                allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                                voucherType: allocation.voucherType,
                            });
                        });
                        var paymentAllocations = {
                            allocations: allocations
                        };
                        vm.debitNote.paymentAllocations = paymentAllocations;

                        vm.debitNote.amount = vm.sumAmountAllocation();

                        // In supplier case voucherLine will be empty from frontEnd Side
                        vm.debitNote.voucherLines = null;
                    }

                    vm.debitNote.voucherDocuments = vm.documents;
                    debitNoteService.createOrUpdateDebitNote({ debitNote: vm.debitNote }
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            function getChargesTypes() {

                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypes({ module: vm.enabledModule }).success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            function getAllocations() {
                allocationService.getAllocationsForEdit({
                    contactId: vm.debitNote.contact.id,
                    voucherCategory: 1,
                    //VoucherId: paymentId,
                    VoucherId: debitNoteId,
                }).success(function (data) {
                    vm.allocationData = data;
                });
            }
         
            function init() {
                getChargesTypes();
                getLocations();
                debitNoteService.getDebitNoteForEdit({ id: debitNoteId }).success(
                    function (result) {
                        if (result.contact != null) {
                            vm.customerSettings(result.contact.contactType)
                        }
                        vm.debitNote = result;
                        vm.documents = vm.debitNote.voucherDocuments;
                        vm.isEditMode = debitNoteId > 0;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.debitNote.contact) {
                                if (vm.debitNote.contact.currency)
                                    vm.currencyCode = vm.debitNote.contact.currency.code;

                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;
                                }
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }
                        if (vm.isEditMode) {
                            vm.debitNoteTaxPercent = vm.debitNote.taxPercent;
                            vm.enabledModule = vm.debitNote.voucherLines[0].module;
                        }
                        else {
                            vm.debitNote.taxPercent = vm.taxPercent;
                            vm.debitNote.locationId = appSession.user.locationId;
                        }
                        //if (vm.debitNote.voucherNo <= 0) {
                        //   // vm.debitNote.voucherNo = null;

                        //}

                        if (vm.debitNote.voucherLines.length == 0)
                            vm.addRow();

                        if (result.contact != null) {
                            if (result.contact.contactType == 3) {
                                getAllocations();
                            }
                        }
                    });
            }
            init();
        }
    ]);
