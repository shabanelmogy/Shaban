// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:331878-332217
appModule.controller('tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote', [
        '$uibModal', '$uibModalInstance', 'creditNoteId', 'abp.services.app.directory', 'abp.services.app.creditNote', 'utilities', 'abp.services.app.commonLookup', 'appSession',
        function ($uibModal, $uibModalInstance, creditNoteId, directoryService, creditNoteService, utilities, commonLookupService, appSession) {

            var vm = this;
            vm.branchTaxPercentage = null;
            vm.loading = false;
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isReasonEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Reason"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isReasonNoteEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ReasonNote"));
            vm.manualCreditNoteNo = utilities.parseBoolean(abp.setting.get("App.General.ManualCreditNoteNo"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes');
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.saveAndPrint = false;
            vm.taxAccepted = false;
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForCreditNote");

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
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
            vm.setTaxPercentOnTaxCode = function () {
                if (vm.creditNote.contact.taxCodeId > 0) {
                    vm.taxPercent = vm.creditNote.contact.taxCode.taxPercent;
                }
                else {
                    if (vm.branchTaxPercentage)
                        vm.creditNote.taxPercent = vm.creditNote.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                }

            }
            vm.calculateTax = function () {
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                }
                var taxPercentApplied = vm.taxPercent;
                if (!vm.creditNote.contactId) return;
                if (vm.creditNote.isTaxExempted)
                    taxPercentApplied = 0;
                vm.creditNote.voucherLines.forEach(e => {
                    e.tax = vm.rounding(e.debit * (taxPercentApplied / 100));
                });
            }

            vm.onCustomerSelect = function () {
                if (vm.creditNote.contactId != vm.creditNote.contact.id && !vm.creditNote.contact) {
                    vm.creditNote.voucherLines = [];
                    vm.addRow();
                    vm.sumAmount();
                }
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.creditNote.contact.currencyDto) {
                        vm.currencyCode = vm.creditNote.contact.currencyDto.code;
                        vm.creditNote.currencyId = vm.creditNote.contact.currencyDto.id;
                        vm.creditNote.currencyRate = vm.creditNote.contact.currencyDto.currencyToBaseRate;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;
                    }
                }
                vm.creditNote.contactId = vm.creditNote.contact.id;
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                    if (vm.creditNote.voucherLines)
                        vm.calculateTax();
                }
            };

            vm.invoiceSelected = function (voucherLine) {
                voucherLine.parentVoucherLineId = voucherLine.parentVoucherLine.id;
                voucherLine.agreementId = null;
                voucherLine.agreement = null;
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }

            };

            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                /// return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };


            // Searching Contacts
            vm.searchContact = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
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
            var saveAndPrint = function (id) {
                window.open('/Report#/tenant/printModalCreditNote/' + id);
            };

            vm.sumAmount = function () {
                if (!vm.creditNote)
                    return 0;
                if (!vm.creditNote.voucherLines)
                    return 0;

                vm.creditNote.amountInWords = "";
                vm.creditNote.tax = vm.creditNote.voucherLines.filter(e => !e.hidden).reduce((accumulator, current) => accumulator += current.tax, 0);
                vm.creditNote.tax = vm.rounding(vm.creditNote.tax);

                vm.creditNote.amount = vm.creditNote.voucherLines.filter(e => !e.hidden).reduce((accumulator, current) => accumulator += current.debit, 0);
                vm.creditNote.amount += vm.creditNote.tax;
                vm.creditNote.amount = vm.rounding(vm.creditNote.amount);
                if (vm.creditNote.amount > 0)
                    vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount);
                return vm.creditNote.amount;
            }

            vm.searchInvoices = function ($select) { // searching only equipment open Invoices
                if ($select.search == "" || !vm.creditNote.contactId) {
                    vm.invoices = null;
                    return;
                }

                commonLookupService.searchInvoices({ keyword: $select.search, contactId: vm.creditNote.contactId }).then(function (response) {
                    vm.invoices = response.data.items;
                });
            };

            vm.searchDeliveryNotes = function ($select, voucherLine) { // searching only equipment open Invoices
                if ($select.search == "" || !vm.creditNote.contactId || !voucherLine.parentVoucherLineId) {
                    voucherLine.deliveryNotes = null;
                    return;
                }

                commonLookupService.searchDeliveryNotes({ keyword: $select.search, invoiceId: voucherLine.parentVoucherLineId }).then(function (response) {
                    voucherLine.deliveryNotes = response.data.items;

                    if (vm.creditNote.voucherLines) {

                        var selectedDeliveryNotes = vm.creditNote.voucherLines.filter(e => e.agreementId).map(e => e.agreementId);
                        voucherLine.deliveryNotes = voucherLine.deliveryNotes.filter(e => !selectedDeliveryNotes.includes(e.id));
                    }

                });
            };

            vm.getHourlyRate = function (voucherLine) {
                if (!voucherLine.agreementId) return;
                commonLookupService.getInvoiceHourlyRate({ id: voucherLine.parentVoucherLineId,agreementId: voucherLine.agreementId }).then(function (response) {

                    voucherLine.valueField1 = 0;
                    if (response)
                        voucherLine.valueField1 = response.data;
                });
            }
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents = [];
                    vm.documents.push(result);
                });
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            // Saving CreditNode
            vm.save = function () {
                vm.saving = true;
                vm.creditNote.contactId = vm.creditNote.contact.id;
                vm.creditNote.voucherSubTypeId = 23;
                vm.creditNote.voucherDocuments = vm.documents;
                creditNoteService.createOrUpdateCreditNoteOnDelivery({ creditNote: vm.creditNote }).success(function (result) {
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


            function creditNoteLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                return line;
            };

            //Add row
            vm.addRow = function () {
                vm.creditNote.voucherLines.push(creditNoteLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.creditNote.voucherLines.indexOf(obj);
                vm.creditNote.voucherLines.splice(index, 1);
                vm.sumAmountTax();
            };
            function getVoucherReasons() {
                commonLookupService.getVoucherReasons().success(function (result) {
                    vm.voucherReasons = result.items;
                })
            };
            function init() {
                getLocations();
                getVoucherReasons();
                vm.branchTaxCode();
                vm.loading = true;
                creditNoteService.getCreditNoteOnDeliveryForEdit({ id: creditNoteId }).success(
                    function (result) {
                        vm.creditNote = result;
                        vm.documents = vm.creditNote.voucherDocuments;
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
                        if (vm.creditNote.id) {
                            vm.isEditMode = true;
                            vm.creditNote.amount = vm.rounding(vm.creditNote.amount);
                            vm.creditNote.tax = vm.rounding(vm.creditNote.tax);
                            if (vm.creditNote.voucherLines) {
                                vm.creditNote.voucherLines.filter(e => !e.hidden).forEach(voucherLine => {
                                    voucherLine.debit = vm.rounding(voucherLine.debit);
                                    voucherLine.tax = vm.rounding(voucherLine.tax);
                                });
                            }
                        }
                        //vm.creditNote.voucherNo = null;
                        vm.creditNote.locationId = appSession.user.locationId;
                        vm.creditNote.taxPercent = vm.taxPercent;

                        if (vm.creditNote.voucherLines.length == 0)
                            vm.addRow();
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            init();
        }
    ]);
