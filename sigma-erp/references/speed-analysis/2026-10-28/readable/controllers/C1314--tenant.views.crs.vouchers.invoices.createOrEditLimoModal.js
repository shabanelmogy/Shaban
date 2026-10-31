// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342773-343532
appModule.controller('tenant.views.crs.vouchers.invoices.createOrEditLimoModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'invoiceId', 'abp.services.app.agreement', 'abp.services.app.directory', 'abp.services.app.invoice', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities', 'abp.services.app.chargesSetting', '$filter', 'abp.services.app.limoTrip', 'appSession',
        function ($scope, $uibModal, $uibModalInstance, invoiceId, agreementService, directoryService, invoiceService, commonLookupService, vehicleService, utilities, chargesSettingService, $filter, limoTripService, appSession) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.documents = [];
            var isValid = true;
            vm.closedAgreements = false;
            vm.isEditMode = false;
            vm.tenancyName = appSession.tenant.tenancyName
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.branchTaxPercentage = null;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.canSaveLimoInvoiceWithZeroCharges = utilities.parseBoolean(abp.setting.get("App.General.Trip_CanSaveLimoInvoiceWithZeroCharges"));
            vm.limoCustomField = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField"));
            vm.limoCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField1"));
            vm.manualTripNo = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isInvoiceDateAsGenerationDateForAllInvoices = utilities.parseBoolean(abp.setting.get("App.General.InvoiceDateAsGenerationDateForAllInvoices"));
            vm.manualInvoiceNo = utilities.parseBoolean(abp.setting.get("App.General.ManualInvoiceNo"));
            vm.isInvoiceCommision = utilities.parseBoolean(abp.setting.get("App.General.InvoiceCommission"));
            vm.isLimoDiscountEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoDiscount"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            //vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'limo'; 
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices');
            vm.isBranchWiseTaxEnabled = abp.features.isEnabled('CRS.CustomFeatures.TaxBranchwise');
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isBadDebtProvisionEnabled = abp.features.isEnabled('CRS.Reports.BadDebtProvision');
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForInvoices");
            vm.allowTaxEditingInLimoTrip = utilities.parseBoolean(abp.setting.get("App.General.Limo.AllowTaxEditingInLimoTrip"));


            vm.taxAccepted = false;
            vm.saveAndPrint = false;
            vm.invoice = {
                voucherLines: []
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            function getTariffGroups() {
                vm.loading = true;
                commonLookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            //vm.chargesTypeVoucherLine = function (item) {
            //    if (vm.trips.tripC.length > 1) {
            //        if (item.refNo == vm.invoice.voucherLines[0].refNo)
            //            return true;
            //    }
            //    return false;
            //};
            vm.getColspan = function () {
                if (!vm.trips || vm.trips.length <= 0) return;
                if (!vm.trips[0].tripCharges && vm.trips[0].tripCharges.length <= 0) return;
                return vm.trips[0].tripCharges.length + 2;
            };
            vm.chargesTypeVoucherLineRepeat = function (value) {
                if (vm.invoice.voucherLines.length > 1 && value.chargesTypeId == 24) {
                    return true;
                };
                return false;
            };
            vm.sumPerTrip = function (tripCharges) {
                var sum = 0.0;
                tripCharges.forEach(function (value) {
                    sum = sum + (parseFloat(value.charges));
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
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.editTripChargesModal = function (tripCharges, taxPercentArgument, isPrepaymentRequired) {

                var taxPercent = taxPercentArgument;
                var viewMode = false;
                if (isPrepaymentRequired)
                    viewMode = true;
                //if (vm.isBranchWiseTaxEnabled)
                //    taxPercent = taxPercentArgument;
                //var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                //    refNo: refNo
                //}, true);

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                tripCharges: tripCharges,
                                taxPercent: taxPercent,
                                viewMode: viewMode
                            };
                        }
                    }
                }).result.then(function (result) {
                    vm.sumAmountTax();
                });

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

            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });

            vm.enabledModule = 3;
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
                vm.enabledModule = vm.invoice.agreement.agreementType == 'Daily' || vm.debitNote.agreement.agreementType == 'Weekly' || vm.debitNote.agreement.agreementType == 'Monthly' ? 1 : 2;
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
            vm.calculateTaxPerRow = function (row, taxPercentArgument) {

                var taxPercent = taxPercentArgument;
                //if (vm.isBranchWiseTaxEnabled)
                //    taxPercent = taxPercentArgument;

                if (vm.invoice == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                if (row.charges != null) {

                    if (!vm.allowTaxEditingInLimoTrip) {
                        if (taxPercent > 0) {


                            var tax = 0;
                            if (row.chargesType.taxable || row.taxable) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (row.charges * 100) / (100 + taxPercent);
                                    tax = utilities.round(row.charges - chargesWithoutTax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(row.charges * taxPercent / 100, 2);

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
                    else {

                        if (taxPercent > 0) {


                            var tax = 0;
                            if (row.taxable || row.taxCategory == 1) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (row.charges * 100) / (100 + taxPercent);
                                    tax = utilities.round(row.charges - chargesWithoutTax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(row.charges * taxPercent / 100, 2);

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
                        }

                    }

                }

                vm.sumAmountTax();

            };
            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;
                var totalDiscount = 0.0;
                if (vm.isLimoDiscountEnabled) {
                    vm.trips.forEach(function (trip) {
                        trip.tripCharges.forEach(function (tripCharge) {
                            if (tripCharge.chargesTypeId === 22) {
                                tripCharge.charges = -Math.abs(tripCharge.charges); // Make the charges negative
                                totalDiscount += Math.abs(tripCharge.charges); // Add absolute value

                            }
                        });
                    });
                }
                vm.trips.forEach(function (trip) {
                    var tripTax = 0.0;
                    var tripCharges = 0.0;
                    trip.tripCharges.forEach(function (tripCharge) {
                        {
                            if (tripCharge.charges > 0 || tripCharge.charges < 0) {
                                tripCharges = tripCharges + parseFloat(tripCharge.charges);
                                totalAmount = totalAmount + parseFloat(tripCharge.charges);
                            }
                            if (tripCharge.tax > 0) {
                                totalTax += tripCharge.chargesTypeId == 22 ? utilities.round(-(tripCharge.tax), 2) : utilities.round(tripCharge.tax, 2);
                                tripTax += tripCharge.chargesTypeId == 22 ? utilities.round(-(tripCharge.tax), 2) : utilities.round(tripCharge.tax, 2);
                            }
                            if (tripCharge.tax < 0) {
                                totalTax += utilities.round(tripCharge.tax, 2);
                                tripTax += utilities.round(tripCharge.tax, 2);
                            }
                            trip.charges = tripCharges;
                            trip.tax = tripTax;

                        }
                    });

                });

                vm.invoice.tax = totalTax;
                vm.invoice.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                vm.invoice.discount = utilities.round(totalDiscount, 2);
                if (vm.invoice.amount > 0) {
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.invoice.contact) {
                            vm.currencyCode = vm.invoice.contact.currency ? vm.invoice.contact.currency.code : null;
                            currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                            decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.isMultiCurrencyEnabled && vm.invoice.id > 0) {
                        if (vm.invoice.contact) {

                            vm.currencyCode = vm.invoice.contact.currency ? vm.invoice.contact.currency.code : null;
                            currencyName = vm.invoice.contact.currency ? vm.invoice.contact.currency.name : null;
                            decimalName = vm.invoice.contact.currency ? vm.invoice.contact.currency.decimalName : null;
                            vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);
                        }
                    }
                    if (vm.autoCalculateAmountInWords == "true" && !vm.isMultiCurrencyEnabled)
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

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateTimeFormat;

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
                        vm.trips.push(result);
                        result.tripCharges.forEach(function (row) {
                            vm.calculateTaxPerRow(row, result.taxPercent);

                        });
                        vm.normalizeTripCharges();
                    }
                });
            };

            function validate() {
                errorMessage = '';
                errorMessage = 'Invoice Can Not Be Genrated Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (vm.invoice.toDate != null) {
                    if (moment(vm.invoice.fromDate) > moment(vm.invoice.toDate)) {
                        isValid = false;
                        errorMessage = errorMessage + '\n To Date can not  less than from Date ';
                    }
                }

            }

            vm.searchAndAddMultipleTrips = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/searchandAddMultipleTripsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                contactId: vm.invoice.contactId,
                                limoCustomField: vm.invoice.limoCustomField,
                                limoCustomField1: vm.invoice.limoCustomField1,
                                manualTripNo: vm.invoice.manualTripNo,
                                fromDate: vm.invoice.fromDate,
                                toDate: vm.invoice.toDate,
                            };
                        },
                    }
                }).result.then(function (result) {
                    if (result != null && result.length > 0) {
                        result.forEach(function (trip) {
                            vm.trips.push(trip);

                            trip.tripCharges.forEach(function (chargesRow) {
                                vm.calculateTaxPerRow(chargesRow, trip.taxPercent);
                            });
                        });
                        vm.normalizeTripCharges();
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.invoice.contact.currencyDto) {

                                vm.currencyCode = vm.invoice.contact.currencyDto.code;
                                currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                                decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                                vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);
                            }
                        }
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

            vm.searchTrips = function ($select) {
                if ($select.search == "") return;
                return commonLookupService.searchTripsForInvoice({ contactId: vm.invoice.contactId, tripNo: $select.search, limoCustomField: vm.invoice.limoCustomField, limoCustomField1: vm.invoice.limoCustomField1, manualTripNo: vm.invoice.manualTripNo }).then(function (response) {
                    vm.searchedtrips = response.data.items;
                });
            };
            vm.tripSelected = function () {
                vm.addTripRow = false;
                var newTripRow = angular.copy(vm.tripRow);
                vm.tripRow = null;
                vm.trips.push(newTripRow);
                newTripRow.tripCharges.forEach(function (row) {
                    vm.calculateTaxPerRow(row, newTripRow.taxPercent);
                });
                vm.normalizeTripCharges();
            }

            //Remove Limo Row
            vm.removeLimoRow = function (trip) {
                var foundLines = $filter('filter')(vm.trips, {
                    tripNo: trip.tripNo,
                }, true);
                foundLines.forEach(function (value) {
                    var index = vm.trips.indexOf(value);
                    vm.trips.splice(index, 1);
                });

                vm.sumAmountTax();
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
            vm.setTaxPercentOnTaxCode = function () {
                if (vm.isTaxCodeEnabled) {
                    if (vm.invoice.contact.taxCodeId > 0) {
                        vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.invoice.contact.taxCode.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                    }
                }
            }
            vm.onCustomerSelect = function () {
                if (vm.isEditMode && vm.invoiceTaxPercent > 0) {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.invoiceTaxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.invoice.contact.isTaxExempted) {
                        vm.setTaxPercentOnTaxCode();
                        if (vm.invoice.voucherLines)
                            vm.invoice.voucherLines.forEach(row => {
                                vm.calculateTaxPerRow(row);
                            });
                    }
                }
                else {
                    vm.invoice.taxPercent = vm.invoice.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.invoice.isTaxExempted = vm.invoice.contact.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.invoice.contact.isTaxExempted) {
                        vm.setTaxPercentOnTaxCode();
                        if (vm.invoice.voucherLines)
                            vm.invoice.voucherLines.forEach(row => {
                                vm.calculateTaxPerRow(row);
                            });
                    }
                }
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.invoice.contact.currencyDto) {
                        vm.currencyCode = vm.invoice.contact.currencyDto.code;
                        vm.invoice.currencyId = vm.invoice.contact.currencyDto.id;
                        vm.invoice.currencyRate = vm.invoice.contact.currencyDto.currencyToBaseRate;

                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }

                    if (vm.invoice.id > 0) {
                        currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                        decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);

                    }
                }
            }
            // Saving Invoice
            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/printTemplates/printPreview.cshtml',
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
                vm.saving = true;
                validate();
                if (isValid) {
                    vm.invoice.voucherSubTypeId = 2;
                    //vm.invoice.module = vm.enabledModule;
                    vm.invoice.voucherDocuments = vm.documents;

                    invoiceService.createOrUpdateInvoice({ invoice: vm.invoice, module: 3, trips: vm.trips }
                    ).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.invoice.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.invoice.id);
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

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            // Ensures a trip has a TripCharge row for every chargesTypeId that any
            // other trip in the invoice already has (and vice versa), so table columns
            // stay aligned across all rows.
            vm.normalizeTripCharges = function (trip) {
                if (!vm.trips || vm.trips.length === 0) return;

                // union of all chargesTypeIds used across all trips (including this new one)
                var allTypeIds = [];
                var typeMeta = {};

                vm.trips.forEach(function (t) {
                    t.tripCharges.forEach(function (tc) {
                        if (allTypeIds.indexOf(tc.chargesTypeId) === -1) {
                            allTypeIds.push(tc.chargesTypeId);
                            typeMeta[tc.chargesTypeId] = tc.chargesType; // keep name/meta for header
                        }
                    });
                });

                // now ensure EVERY trip has a row for every id in allTypeIds
                vm.trips.forEach(function (t) {
                    allTypeIds.forEach(function (typeId) {
                        var exists = t.tripCharges.some(function (tc) {
                            return tc.chargesTypeId === typeId;
                        });
                        if (!exists) {
                            t.tripCharges.push({
                                chargesTypeId: typeId,
                                chargesType: typeMeta[typeId],
                                charges: 0,
                                tax: 0,
                                taxable: false,
                                quantity: 0,
                                rate: 0,
                                module: 3
                            });
                        }
                    });

                    // keep a consistent order across all trips (sort by chargesTypeId, or by 'order' if present)
                    t.tripCharges.sort(function (a, b) {
                        return (a.order || a.chargesTypeId) - (b.order || b.chargesTypeId);
                    });
                });
            };


            function init() {
                vm.loading = true;
                vm.branchTaxCode();
                invoiceService.getLimoInvoiceForEdit({ id: invoiceId }).success(
                    function (result) {

                        vm.invoice = result.invoice;
                        vm.trips = result.trips;
                        vm.normalizeTripCharges();
                        vm.documents = vm.invoice.voucherDocuments;
                        vm.loading = false;
                        getLocations();
                        getTariffGroups();
                        if (invoiceId > 0) {
                            vm.isEditMode = true;

                            vm.invoiceTaxPercent = vm.invoice.taxPercent;
                            vm.invoice.customField2 = vm.trips[0].customField2;
                            vm.invoice.customField3 = vm.trips[0].customField3;
                            vm.sumAmountTax();

                            // getChargesTypes();
                        } else {
                            vm.isEditMode = false;
                            vm.invoice.badDebt = 0;
                            vm.invoice.taxPercent = vm.taxPercent;
                            vm.invoice.locationId = appSession.user.locationId;
                        }


                    });
            }

            init();
        }
    ]);
