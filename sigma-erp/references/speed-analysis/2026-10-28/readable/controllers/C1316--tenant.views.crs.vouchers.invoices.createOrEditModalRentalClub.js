// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:344889-345560
appModule.controller('tenant.views.crs.vouchers.invoices.createOrEditModalRentalClub', [
        '$scope', '$uibModal', '$uibModalInstance', 'invoiceId', 'abp.services.app.agreement', 'abp.services.app.commonAgreement', 'abp.services.app.directory', 'abp.services.app.invoice', 'abp.services.app.commonLookup',
        'abp.services.app.vehicle', 'utilities', 'abp.services.app.chargesSetting', '$filter', 'abp.services.app.limoTrip', 'appSession',
        function ($scope, $uibModal, $uibModalInstance, invoiceId, agreementService, commonAgreementService, directoryService, invoiceService, commonLookupService, vehicleService, utilities, chargesSettingService, $filter, limoTripService, appSession) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            var isValid = true;
            vm.closedAgreements = false;
            vm.isEditMode = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isInvoiceDateAsGenerationDateForAllInvoices = utilities.parseBoolean(abp.setting.get("App.General.InvoiceDateAsGenerationDateForAllInvoices"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualInvoiceNo = utilities.parseBoolean(abp.setting.get("App.General.ManualInvoiceNo"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
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
            vm.sumPerTrip = function (refNo) {
                var sum = 0.0;
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);
                foundLines.forEach(function (value) {
                    //+parseFloat(value.tax)
                    sum = sum + (parseFloat(value.credit));
                });
                return utilities.round(sum, 2);
            };

            vm.sumTaxPerTrip = function (refNo) {
                var tax = 0.0;
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);
                foundLines.forEach(function (value) {
                    //+parseFloat(value.tax)
                    tax = tax + (parseFloat(value.tax));
                });
                return utilities.round(tax, 2);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.editTripChargesModal = function (refNo) {

                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'md',

                    resolve: {
                        options: function () {
                            return {
                                tripCharges: foundLines,
                                taxPercent: vm.invoice.taxPercent
                            };
                        }
                    }
                }).result.then(function (result) {
                    vm.sumAmountTax();
                });

            };

            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {
                if ($select.search == '') return;
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: contactId, agreementCategory: vm.enabledModule }).then(function (response) {
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

            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;
            vm.moduleChanged = function () {
                getChargesTypes();
                vm.invoice.voucherLines = [];
                vm.invoice.amount = 0;
                vm.invoice.tax = 0;
                vm.invoice.amountInWords = null;

            };
            var moduleFilter = {
                module: 0 //all enabled modules
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.agreementChanged = function () {
                //agreementCategory: 1 = Rental, 2 = Lease
                //module: 1 = Rental, 2 = Lease, 3 = Limousing, 4 = Transportation
                moduleFilter.module = vm.invoice.agreement.agreementCategory;
                //vm.enabledModule = vm.invoice.agreement.agreementType == 'Daily' || vm.debitNote.agreement.agreementType == 'Weekly' || vm.debitNote.agreement.agreementType == 'Monthly' ? 1 : 2;
                if (vm.invoice.agreement.agreementCategory == 1) {
                    vm.enabledModule = 1;
                }
                else if (vm.invoice.agreement.agreementCategory == 2) {
                    vm.enabledModule = 2;
                }
                else if (vm.invoice.agreement.agreementCategory == 4) {
                    vm.enabledModule = 5;
                }
                getChargesTypes();
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

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

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

                }

                vm.invoice.amountInWords = '';

                vm.invoice.tax = totalTax;
                vm.invoice.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.calculateTaxPerRow = function (row) {
                if (vm.invoice == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                if (row.credit != null && row.module == vm.enabledModule) {
                    if (vm.invoice.taxPercent > 0) {
                        var tax = 0;
                        if (row.chargesType.taxable || row.taxable) {
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
                        else {
                            row.tax = 0;
                            row.taxable = (row.chargesType.taxable || row.taxable);
                        }

                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.chargesType.taxable || row.taxable);
                    }
                }

                vm.sumAmountTax();

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

                });
                vm.invoice.tax = totalTax;
                vm.invoice.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount);
                }
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.invoice.taxPercent = vm.taxPercent;
                else
                    vm.invoice.taxPercent = 0;
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    line = invoiceLineObject();

                vm.invoice.voucherLines.push(line);
            };


            // Adding Row Limo
            vm.addRowlimo = function (refNo) {

                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo,
                }, true);
                var srNo = Math.max.apply(Math, foundLines.map(function (line) { return line.srNo; }))
                //function invoiceLineObject() {
                //    var line = new Object();
                //    line.chargesTypeId = null;
                //    line.description = '';
                //    line.debit = null;
                //    line.credit = null;
                //    line.taxable = false;

                //    return line;
                //}
                vm.invoice.voucherLines.push(
                    {
                        chargesTypeId: null,
                        description: '',
                        debit: null,
                        credit: null,
                        refNo: refNo,
                        srNo: srNo + 1
                    });

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
            vm.addLimoRow = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/searchTripModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.searchTripModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        contactId: function () {
                            return vm.invoice.contactId;
                        },

                    }
                }).result.then(function (result) {
                    if (result != null) {
                        var serialNo = vm.invoice.voucherLines[vm.invoice.voucherLines.length - 1].srNo;
                        result.tripCharges.forEach(function (value) {
                            vm.invoice.voucherLines.push(
                                {
                                    module: vm.enabledModule,
                                    chargesTypeId: value.chargesTypeId,
                                    chargesType: value.chargesType,
                                    taxable: value.taxable,
                                    tax: value.tax,
                                    description: value.chargesTypeId == 24 ? 'Trip No: ' + result.tripNo + ', Date: ' + vm.getlocalDateTime(result.pickupDateTime) : '',
                                    tripDescription: value.chargesTypeId == 24 ? result.notes : '',
                                    debit: 0,
                                    credit: value.charges,
                                    refNo: result.tripNo,
                                    srNo: ++serialNo,
                                    vehicle: result.vehicle,
                                    vehicleId: result.vehicleId,

                                });
                        });
                        vm.sumAmount();
                    }
                });
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.invoice.voucherLines.indexOf(obj);
                vm.invoice.voucherLines.splice(index, 1);
                //vm.sumAmount();
                vm.sumAmountTax();
            };

            //Remove Limo Row
            vm.removeLimoRow = function (obj) {

                //var index = vm.invoice.voucherLines.indexOf(obj);
                //vm.invoice.voucherLines.splice(index, 1);
                //vm.sumAmount();
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: obj.refNo,
                }, true);

                foundLines.forEach(function (value) {
                    var index = vm.invoice.voucherLines.indexOf(value);
                    vm.invoice.voucherLines.splice(index, 1);
                });

                vm.sumAmountTax();
            };


            vm.onCustomerSelect = function () {
                vm.invoice.agreement = null;
                vm.invoice.agreementId = null;
                if (vm.isEditMode && vm.invoiceTaxPercent > 0) {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.invoiceTaxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                }
                else {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                }
                vm.sumAmount();
                vm.agreements = null;
                //if (vm.enabledModule == 1 || vm.enabledModule == 2)
                //    getAgreements(vm.invoice.contactId);
            };

            vm.onClosedAgreementChange = function () {
                getAgreements(vm.invoice.contactId);
            };

            function getAgreements(customerId) {


                vm.loading = true;
                var agreement = null;
                vm.invoice.agreement = null;
                vm.invoice.agreementId = null;
                if (vm.closedAgreements == false) {
                    agreement = commonAgreementService.getOpenAgreementsOnCustomer({ id: customerId });
                }
                else {
                    agreement = commonAgreementService.getClosedAgreementsOnCustomer({ id: customerId });
                }
                agreement.success(function (data) {
                    if (data) {
                        vm.agreements = data.items;
                        if (vm.agreements.length == 0) {
                            vm.invoice.agreement = vm.agreements[0];
                        }
                    } else { vm.agreements = null; }

                }).finally(function () {
                    vm.loading = false;
                });
            };
            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
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
            // Saving Invoice
            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return {
                                id: id,
                            };
                        },
                        previewVoucher: null,
                        exportWord: false,
                        exportPrintToWord: false,
                        isArabic: function () {
                            return false; // or true, or logic to detect locale
                        }
                    }
                });
            };
            // Saving Invoice
            vm.save = function () {

                isValid = true;
                var date = new Date(vm.invoice.date);
                var fromDate = new Date(vm.invoice.fromDate);
                var toDate = new Date(vm.invoice.toDate);

                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                //date.setMilliseconds(0);

                fromDate.setHours(0);
                fromDate.setMinutes(0);
                fromDate.setSeconds(0);
                //fromDate.setMilliseconds(0);

                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setSeconds(59);
                //toDate.setMilliseconds(999);

                vm.invoice.fromDate = fromDate;
                vm.invoice.toDate = toDate;
                vm.invoice.date = date;
                if (vm.invoice.voucherSubTypeId != 2)
                    vm.invoice.voucherSubTypeId = 9
                //angular.forEach(vm.invoice.voucherLines, function (value, key) {
                //    value.id = 0;
                //    //  value.chargesType = null;
                //});

                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    module: vm.enabledModule,
                }, true);

                vm.invoice.voucherLines = foundLines;
                vm.saving = true;
                //vm.invoice.module = vm.enabledModule;
                invoiceService.createOrUpdateInvoice({ invoice: vm.invoice, module: vm.enabledModule }
                ).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.invoice.id = result;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.invoice.id);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

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

            function getTrips(invoiceId) {
                vm.loading = true;
                limoTripService.getInvoiceTrips({
                    id: invoiceId,
                }).success(function (result) {
                    vm.trips = result.items;
                    vm.invoice.voucherLines.forEach(function (value) {
                        if (value.chargesTypeId == 24) {
                            var refNoInt = parseInt(value.refNo);
                            var foundLines = $filter('filter')(vm.trips, {
                                tripNo: refNoInt,
                            }, true);
                            if (foundLines.length == 1) {
                                value.tripDescription = foundLines[0].notes;
                            }
                        }
                    });
                    vm.invoice.customField2 = vm.trips[0].customField2;
                    vm.invoice.customField3 = vm.trips[0].customField3;
                    //if (vm.trips) {
                    //    var refNoInt = parseInt(value.refNo);
                    //    var foundLines = $filter('filter')(vm.trips, {
                    //        tripNo: refNoInt,
                    //    }, true);
                    //    if (foundLines.length == 1) {
                    //        value.description = foundLines[0].notes;
                    //    }
                    //}
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                vm.loading = true;
                invoiceService.getInvoiceForEdit({ id: invoiceId }).success(
                    function (result) {
                        vm.invoice = result;
                        vm.loading = false;
                        getLocations();
                        if (invoiceId > 0) {

                            vm.isEditMode = true;
                            vm.invoiceTaxPercent = vm.invoice.taxPercent;
                            vm.enabledModule = vm.invoice.voucherLines[0].module;
                            if (vm.invoice.voucherSubTypeId == 1) //rental invoice
                                moduleFilter.module = 1;
                            else if (vm.invoice.voucherSubTypeId == 14) //Lease invoice
                                moduleFilter.module = 2;
                            else if (vm.invoice.voucherSubTypeId == 2) //limo invoice
                                moduleFilter.module = 3;
                            else if (vm.invoice.voucherSubTypeId == 16) //transportation
                                moduleFilter.module = 4;
                            else
                                moduleFilter.module = 0;
                            if (vm.invoice.voucherSubTypeId == 2)
                                getTrips(invoiceId)
                            getChargesTypes();
                        } else {
                            vm.isEditMode = false;
                            moduleFilter.module = 0;
                            vm.invoice.taxPercent = vm.taxPercent;
                            getChargesTypes();
                        }

                        if (!vm.isEditMode && vm.invoice.contactId)
                            getAgreements(vm.invoice.contactId);

                        //if (vm.invoice.voucherNo <= 0)
                        //    vm.invoice.voucherNo = null;

                        if (vm.invoice.voucherLines.length == 0)
                            vm.addRow();
                    });
            }

            init();
        }
    ]);
