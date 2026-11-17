// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:395248-395739
appModule.controller('tenant.views.crs.vouchers.saleOrders.createOrEditModal', ['abp.services.app.saleOrder', '$uibModal', 'options', '$uibModalInstance',
        'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities', 'appSession', 'abp.services.app.rentalQuotation', 'abp.services.app.leaseQuotation',
        function (saleOrdersService, $uibModal, options, $uibModalInstance, vehicleService, directoryService, commonLookupService,
            utilities, appSession, rentalQuotationService, leaseQuotationService) {
            var vm = this;
            vm.branchTaxPercentage = null;
            vm.vehicles = [];
            vm.suppliers = [];
            vm.locations = [];
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.documents = [];
            vm.quotations = [];
            vm.quotationId = options.quotationId;
            vm.saveAndPrint = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.disableQuotationSelection = false;

            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders');
            vm.documentsForSaleOrderEnable = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForSaleOrder");
            vm.isQuotationFeatureEnabled = abp.features.isEnabled("CRS.Rental.Quotations");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            function saleOrdersLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                return line;
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    console.log(response.data.items);
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchQuotations = function ($select) {
                return rentalQuotationService.searchQuotations({ quotationNo: $select.search }).then(function (response) {
                    vm.quotations = response.data.items;
                });
            };

            vm.searchContacts = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            }

            // extended search using search contact popup
            vm.searchContactsPopoup = function () {
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
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.saleOrder.contact = supplier;
                        vm.saleOrder.contactId = supplier.id;
                    }
                });
            };

            vm.onCustomerSelect = function () {
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.saleOrder.contact.currencyDto) {
                        vm.currencyCode = vm.saleOrder.contact.currencyDto.code;
                        vm.saleOrder.currencyId = vm.saleOrder.contact.currencyDto.id;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }
            }

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            //Add row
            vm.addRow = function () {
                vm.saleOrder.voucherLines.push(saleOrdersLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.saleOrder.voucherLines.indexOf(obj);
                vm.saleOrder.voucherLines.splice(index, 1);
                vm.sumAmountTax();
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
                if (vm.isTaxCodeEnabled && vm.saleOrder.contact.isTaxExempted) {
                    vm.saleOrder.taxPercent = 0;
                }
                if (vm.isTaxCodeEnabled)
                {
                    vm.setTaxPercentOnTaxCode();
                }

                vm.saleOrder.voucherLines.forEach(row => {
                    vm.calculateTaxPerRow(row);
                });
            };
            vm.setTaxPercentOnTaxCode = function () {
                if (vm.saleOrder.contact) {
                    if (!vm.saleOrder.contact.isTaxExempted)
                        vm.saleOrder.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                    if (vm.saleOrder.contact.taxCodeId > 0 && !vm.saleOrder.contact.isTaxExempted) {
                        vm.saleOrder.taxPercent = vm.saleOrder.contact.taxCode.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.saleOrder.taxPercent = vm.saleOrder.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                    }
                }
            }
            vm.calculateTaxPerRow = function (row) {
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                }
                if (vm.saleOrder == null)
                    return 0;

                if (row == null)
                    return 0;

                if (row.debit != null) {
                    if (vm.saleOrder.taxPercent > 0) {
                        var tax = 0;
                        if (row.taxable || !row.taxable) {
                            if (vm.isTaxInclusive) { // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                var chargesWithoutTax = (row.debit * 100) / (100 + vm.saleOrder.taxPercent);
                                tax = utilities.round(row.debit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.debit * vm.saleOrder.taxPercent / 100, 2);
                            }
                            row.tax = tax;
                            row.taxable = true;
                        } else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                        }
                    } else {
                        row.tax = 0;
                        row.taxable = (row.taxable);
                    }
                }
                vm.sumAmountTax();
            };

            vm.sumAmount = function () {

                if (vm.saleOrder == null)
                    return 0;

                if (vm.saleOrder.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.saleOrder.voucherLines.length; i++) {
                    if (vm.saleOrder.voucherLines[i].debit != null) {
                        sum = sum + parseFloat(vm.saleOrder.voucherLines[i].debit);

                        if (vm.saleOrder.taxPercent > 0) {
                            var tax = 0;

                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.saleOrder.voucherLines[i].debit * 100) / (100 + vm.saleOrder.taxPercent);
                                tax = utilities.round(vm.saleOrder.voucherLines[i].debit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(vm.saleOrder.voucherLines[i].debit * vm.saleOrder.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            vm.saleOrder.voucherLines[i].tax = tax;
                            if (tax > 0)
                                vm.saleOrder.voucherLines[i].taxable = true;
                        }
                        else {
                            vm.saleOrder.voucherLines[i].tax = 0;
                            vm.saleOrder.voucherLines[i].taxable = false;
                        }
                    }
                }

                vm.saleOrder.amountInWords = '';

                vm.saleOrder.tax = totalTax;
                vm.saleOrder.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                vm.saleOrder.amount = utilities.round(vm.saleOrder.amount, 2);
                if (vm.saleOrder.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.saleOrder.amountInWords = utilities.toWords(vm.saleOrder.amount);
                }
                if (vm.isMultiCurrencyEnabled) {
                    currencyName = vm.saleOrder.contact.currencyDto ? vm.saleOrder.contact.currencyDto.name : null;
                    decimalName = vm.saleOrder.contact.currencyDto ? vm.saleOrder.contact.currencyDto.decimalName : null;
                    vm.saleOrder.amountInWords = utilities.toWords(vm.saleOrder.amount, currencyName, decimalName);

                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;

                vm.saleOrder.voucherLines.forEach(function (value) {

                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;

                });

                vm.saleOrder.tax = totalTax;
                vm.saleOrder.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.saleOrder.amount = utilities.round(vm.saleOrder.amount, 2);
                if (vm.saleOrder.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.saleOrder.amountInWords = utilities.toWords(vm.saleOrder.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.saleOrder.contact.currencyDto ? vm.saleOrder.contact.currencyDto.name : null;
                        decimalName = vm.saleOrder.contact.currencyDto ? vm.saleOrder.contact.currencyDto.decimalName : null;
                        vm.saleOrder.amountInWords = utilities.toWords(vm.saleOrder.amount, currencyName, decimalName);

                    }
                    if (vm.isMultiCurrencyEnabled && vm.saleOrder.id>0) {
                        currencyName = vm.saleOrder.contact.currency ? vm.saleOrder.contact.currency.name : null;
                        decimalName = vm.saleOrder.contact.currency ? vm.saleOrder.contact.currency.decimalName : null;
                        vm.saleOrder.amountInWords = utilities.toWords(vm.saleOrder.amount, currencyName, decimalName);

                    }
                }
            };

            vm.save = function () {
                if (vm.locations.length == 1) vm.saleOrder.locationId = vm.locations[0].id;
                vm.saving = true;
                vm.saleOrder.voucherDocuments = vm.documents;
                vm.saleOrder.saleOrderType = options.type;
                saleOrdersService.createOrUpdateSaleOrder({ saleOrder: vm.saleOrder }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.saleOrder.id = result.id;

                    if (vm.saveAndPrint)
                        saveAndPrint(vm.saleOrder.id);
                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/saleOrders/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.saleOrders.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseOrderId: function () {
                            return id;
                        }
                    }
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/saleOrders/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.saleOrders.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            }

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            function init() {
                getLocations();
                vm.branchTaxCode();
                vm.loading = true;

                saleOrdersService.getSaleOrderForEdit({ id: options.saleOrderId }).success(
                    function (result) {
                        vm.saleOrder = result;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.saleOrder.contact) {
                                if (vm.saleOrder.contact.currency)
                                    vm.currencyCode = vm.saleOrder.contact.currency.code;

                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;
                                }
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }
                        vm.documents = vm.saleOrder.voucherDocuments;
                        if (options.contact) {
                            vm.saleOrder.contact = options.contact;
                            vm.saleOrder.contactId = options.contact.id;
                        }
                        if (options.serviceItems) {
                            options.serviceItems.forEach(function (value) {

                                vm.saleOrder.voucherLines.push({
                                    expenseTypeId: null,
                                    description: value.name,
                                    debit: null,
                                    credit: null,
                                    vehicleId: options.vehicle.id,
                                    vehicle: options.vehicle,
                                });

                            });
                        }

                        if (vm.saleOrder.id < 1) {
                            vm.isEditMode = false;
                            vm.saleOrder.voucherNo = null;
                            vm.saleOrder.locationId = appSession.user.locationId;
                            vm.saleOrder.taxPercent = vm.taxPercent;
                        } else {
                            vm.isEditMode = true;
                        }
                        if (vm.saleOrder.voucherLines.length == 0)
                            vm.addRow();



                        if (options.purchaseOrder && !vm.isEditMode) {

                            var purchaseOrder = angular.copy(options.purchaseOrder);

                            vm.bill.contactId = purchaseOrder.contact.id;
                            vm.bill.contact = purchaseOrder.contact;
                            vm.bill.parentVoucherId = purchaseOrder.id;
                            vm.bill.voucherLines = [];
                            vm.bill.taxPercent = vm.taxPercent;

                            angular.forEach(purchaseOrder.voucherLines, function (saleOrderline) {

                                if (saleOrderline.debit > 0) {
                                    var billine = billLineObject();

                                    billine.description = saleOrderline.description;
                                    billine.vehicleId = saleOrderline.vehicleId;
                                    billine.vehicle = saleOrderline.vehicle;
                                    billine.debit = saleOrderline.debit;
                                    vm.bill.voucherLines.push(billine);
                                }
                            });

                            vm.sumAmount();
                        }
                        if (vm.quotationId && !vm.isEditMode) {
                            vm.disableQuotationSelection = true;
                            vm.getQuotation();
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            vm.quotationChanged = function () {
                vm.saleOrder.quotationId = vm.saleOrder.quotation.id;
                vm.quotationId = vm.saleOrder.quotation.id;
                vm.getQuotation();
            }

            vm.getQuotation = function () {
                vm.loading = true;
                if (options.type == 'lease') {

                    leaseQuotationService.getLeaseQuotationForEdit({ id: vm.quotationId }).success(function (result) {
                        vm.quotation = result;
                        vm.saleOrder.quotation = vm.quotation;
                        vm.saleOrder.quotationId = vm.quotation.id;
                        vm.saleOrder.contact = vm.quotation.customer;
                        vm.saleOrder.contactId = vm.quotation.customer.id;
                        vm.saleOrder.voucherLines = [];
                        vm.quotation.quotationLines.forEach(function (e, i) {
                            vm.addRow();
                            var desc = "Make and Model: " + e.vehicleModel.make.name + " " + e.vehicleModel.name + ", " + e.quantity + " Vehicle";
                            vm.saleOrder.voucherLines[i].description = desc;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    rentalQuotationService.getQuotationForEdit({ id: vm.quotationId }).success(function (result) {
                        vm.quotation = result;
                        vm.saleOrder.quotation = vm.quotation;
                        vm.saleOrder.quotationId = vm.quotation.id;
                        vm.saleOrder.contact = vm.quotation.customer;
                        vm.saleOrder.contactId = vm.quotation.customer.id;
                        vm.saleOrder.voucherLines = [];
                        vm.quotation.quotationLines.forEach(function (e, i) {
                            vm.addRow();
                            var desc = e.vehicleModel.make.name + " " + e.vehicleModel.name + ", " + " " + e.vehicleType.title + "," + " " + e.description + "," + " " + e.quantity + (e.quantity > 1 ? " Units" : " Unit");
                            vm.saleOrder.voucherLines[i].description = desc;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });


                }

            }
            init();
        }]);
