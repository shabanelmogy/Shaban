// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:462901-463488
appModule.controller('tenant.views.stock.grns.createOrEditModal',
        ['$uibModal', 'options', '$uibModalInstance',
            'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities', 'appSession', 'abp.services.app.item', 'abp.services.app.purchaseOrder', 'abp.services.app.grn',
            'abp.services.app.unitOfMeasure', 'abp.services.app.asset', 'abp.services.app.job', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel',
            function ($uibModal, options, $uibModalInstance, directoryService, commonLookupService,
                utilities, appSession, itemAppService, purchaseOrdersService, grnService, unitOfMeasureAppService, assetService, jobAppService, vehicleService, vehicleModelService) {
                var vm = this;

                vm.suppliers = [];
                vm.locations = [];
                vm.grnsOnPo = [];
                vm.lPONo = [];
                vm.documents = [];
                vm.grn = {};
                vm.saveAndPrint = false;
                vm.includeJob = false;
                vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
                vm.currencyCode = '';
                vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
                vm.isIssueToJobInGrn = utilities.parseBoolean(abp.setting.get("App.General.IssueToJobInGrn"));
                vm.isFMSEnabled = abp.features.isEnabled("FMS");
                vm.isStockEnabled = abp.features.isEnabled("STOCK");
                vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
                vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForGRN");
                vm.manualGrnNo = true;
                vm.grn.voucherSubTypeId == 48;
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.grnAsFinancialVoucher = utilities.parseBoolean(abp.setting.get("App.General.GrnAsFinancialVoucher"));
                vm.isSaleInventoryVehicleEnabled = abp.features.isEnabled("CRS.Accounts.SaleInventoryVehicle");
                vm.filters = {
                    name: '',
                    makeId: null
                };
                vm.searchModel = function ($select) {
                    vm.filters.name = $select.search;
                    if (vm.filters.name == '')
                        vm.filters.name = "~";  //to avoid default suggestions 

                    return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                        vm.models = response.data.items;
                    });
                };
                vm.searchVehicles = function ($select) {
                    if ($select.search === "") {
                        vm.vehicles = null;
                        return null;
                    }
                    return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                        console.log(response.data.items);
                        vm.vehicles = response.data.items;
                    });
                };
                function grnLineObject() {

                    var line = new Object();
                    line.voucherId = null;
                    line.productId = null;
                    line.unitOfMeasureId = null;
                    line.product = {};
                    line.price = 0;
                    line.quantity = 0;
                    line.quantityOrdered = 0;
                    line.quantityAlreadyReceived = 0;
                    line.debit = 0;

                    return line;
                }

                vm.rounding = function (value) {
                    return utilities.round(value, 2);
                };

                vm.roundingforView = function (value) {
                    var roundedValue = utilities.roundforView(value, 2);
                    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };

                vm.searchSupplier = function ($select) {
                    //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                    return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                        vm.suppliers = response.data.items;
                    });
                };

                vm.supplierChanged = function () {
                    vm.grn.contactId = vm.grn.contact.id;
                    vm.grn.parentVoucher = null;
                    vm.grn.parentVoucherId = null;
                    vm.grn.voucherLines = [];
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.grn.contact.currencyDto) {
                            vm.currencyCode = vm.grn.contact.currencyDto.code;
                            vm.grn.currencyId = vm.grn.contact.currencyDto.id;
                            vm.grn.currencyRate = vm.grn.contact.currencyDto.currencyToBaseRate;
                        }
                        else {
                            vm.currencyCode = vm.defaultCurrencyCode;

                        }
                    }
                };

                vm.searchLPONo = function ($select) {
                    var poType = 39;
                    if (vm.grn.voucherSubTypeId == 49)
                        poType = 40;
                    if (vm.grn.voucherSubTypeId == 101)
                        poType = 100;

                    return purchaseOrdersService
                        .searchLPONo({ keyWord: $select.search, voucherSubType: poType, contactId: vm.grn.contactId }).then(function (response) {
                            vm.lPONo = response.data;
                        });
                };

                function getAssetTypes() {

                    vm.loading = true;
                    assetService.getAssetType({}).success(function (data) {
                        vm.assetTypes = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                vm.poSelected = function () {
                    vm.loading = true;
                    grnService.getGrnLinesByParentVoucherId({ id: vm.grn.parentVoucherId }).success(
                        function (result) {
                            vm.grn.voucherLines = result;
                            vm.grn.voucherLines.forEach(e => {
                                e.id = null;
                                e.voucherId = null;
                            });
                            vm.grn.voucherLines.forEach(function (value) {

                                vm.calculatePriceAndTax(value);

                            });
                            vm.sumAmountTax();
                        }).finally(function () {
                            vm.loading = false;
                        });
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

                vm.searchSupplierPopoup = function () {
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
                    }).result.then(function (supplier) {
                        if (supplier !== null) {
                            vm.purchaseOrder.contact = supplier;
                            vm.purchaseOrder.contactId = supplier.id;
                        }
                    });
                };

                function getLocations() {
                    commonLookupService.getLocations({}).success(function (data) {
                        vm.locations = data.items;
                    });
                }


                vm.uploadDocument = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/stock/grns/uploadDocumentsModal.cshtml',
                        controller: 'tenant.views.stock.grns.uploadDocumentsModal as vm',
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
                vm.searchItems = function ($select) {
                    var name = $select.search;
                    if (name === '')
                        name = "~";  //to avoid default suggestions 

                    return itemAppService.searchItems({ name: name }).then(function (response) {
                        vm.items = response.data.items;
                    });
                };

                vm.addRow = function () {
                    vm.grn.voucherLines.push(grnLineObject());
                };

                vm.removeRow = function (obj) {
                    var index = vm.grn.voucherLines.indexOf(obj);
                    vm.grn.voucherLines.splice(index, 1);
                    vm.sumAmount();
                };

                vm.sumAmount = function () {

                    if (vm.grn === null)
                        return 0;

                    if (vm.grn.voucherLines === null)
                        return 0;

                    var sum = 0;

                    for (var i = 0; i < vm.grn.voucherLines.length; i++) {
                        if (vm.grn.voucherLines[i].debit !== null) {
                            sum = sum + parseFloat(vm.grn.voucherLines[i].debit);

                        }

                        vm.grn.amountInWords = '';

                        vm.grn.amount = utilities.round(sum, 2);
                        vm.grn.amount = utilities.round(vm.grn.amount, 2);
                        if (vm.grn.amount > 0) {
                            if (vm.autoCalculateAmountInWords === "true")
                                vm.grn.amountInWords = utilities.toWords(vm.grn.amount);
                            if (vm.isMultiCurrencyEnabled) {
                                currencyName = vm.grn.contact.currencyDto ? vm.grn.contact.currencyDto.name : null;
                                decimalName = vm.grn.contact.currencyDto ? vm.grn.contact.currencyDto.decimalName : null;
                                vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);

                            }
                            if (vm.isMultiCurrencyEnabled && vm.grn.id > 0) {
                                currencyName = vm.grn.contact.currencyDto ? vm.grn.contact.currencyDto.name : null;
                                decimalName = vm.grn.contact.currencyDto ? vm.grn.contact.currencyDto.decimalName : null;
                                vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);

                            }
                            if (vm.isMultiCurrencyEnabled || options) {
                                currencyName = vm.grn.contact.currency ? vm.grn.contact.currency.name : null;
                                decimalName = vm.grn.contact.currency ? vm.grn.contact.currency.decimalName : null;
                                vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);

                            }
                        }

                        // return { totalCharges: utilities.round(sum, 2) };
                    };
                    vm.sumAmountTax();
                };

                vm.sumAmountTax = function () {
                    var totalAmount = 0.0;
                    var totalTax = 0.0;

                    vm.grn.voucherLines.forEach(function (value) {
                        if (value.debit > 0)
                            totalAmount = totalAmount + parseFloat(value.debit);
                        if (value.tax > 0) {
                            value.taxable = true;
                            totalTax += utilities.round(value.tax, 2);
                        }
                        else
                            value.taxable = false;

                    });

                    vm.grn.tax = totalTax;
                    vm.grn.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                    vm.grn.amount = utilities.round(vm.grn.amount, 2);

                    if (vm.grn.amount > 0) {
                        if (vm.autoCalculateAmountInWords === "true")
                            vm.grn.amountInWords = utilities.toWords(vm.grn.amount);
                        if (vm.isMultiCurrencyEnabled) {
                            currencyName = vm.grn.contact.currencyDto ? vm.grn.contact.currencyDto.name : null;
                            decimalName = vm.grn.contact.currencyDto ? vm.grn.contact.currencyDto.decimalName : null;
                            vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);

                        }
                        if (vm.isMultiCurrencyEnabled && options.grnId) {
                            currencyName = vm.grn.contact.currency ? vm.grn.contact.currency.name : null;
                            decimalName = vm.grn.contact.currency ? vm.grn.contact.currency.decimalName : null;
                            vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);

                        }
                    }
                };

                vm.calculateTaxPerRow = function (row) {
                    if (vm.grn === null)
                        return 0;

                    if (row === null)
                        return 0;

                    if (row.debit !== null) {
                        if (vm.grn.taxPercent > 0) {
                            var tax = 0;
                            if (row.taxable || !row.taxable) {
                                if (vm.isTaxInclusive) { // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    var chargesWithoutTax = (row.debit * 100) / (100 + vm.grn.taxPercent);
                                    tax = utilities.round(row.debit - chargesWithoutTax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(row.debit * vm.grn.taxPercent / 100, 2);
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
                    if (vm.grn.contact) {
                        if (vm.grn.contact.isTaxExempted) {
                            row.tax = 0;
                            row.taxable = false;

                        }
                    }
                    vm.sumAmountTax();
                };

                vm.calculateQtyAlreadyReceived = function (VoucherLine, value = 0) {
                    vm.loading = true;
                    vm.qtyAlreadyReceived = [];
                    grnService.getGrnByParentVoucherId({ id: vm.grn.parentVoucherId }).success(function (result) {
                        vm.qtyAlreadyReceived = result;
                        vm.qtyAlreadyReceived.forEach(function (voucher) {
                            voucher.voucherLines.forEach(function (voucherline) {
                                if (voucherline.productId === VoucherLine.productId) {
                                    if (!VoucherLine.quantityAlreadyReceived)
                                        VoucherLine.quantityAlreadyReceived = 0;
                                    VoucherLine.quantityAlreadyReceived += voucherline.quantity;
                                };
                            });
                        });

                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                vm.calculateQtyOrdered = function (VoucherLine, value = 0) {
                    vm.loading = true;
                    vm.qtyOrdered = [];
                    purchaseOrdersService.getPOById(vm.grn.parentVoucherId).success(function (result) {
                        vm.parentVoucher = result;
                    }).finally(function () {
                        VoucherLine.quantityOrdered = 0;
                        vm.parentVoucher.voucherLines.forEach(function (voucherline) {
                            if (voucherline.productId === VoucherLine.productId) {
                                VoucherLine.quantityOrdered += voucherline.quantity;
                            };
                        });
                        if (value === 0)
                            vm.loading = false;
                    });

                }

                vm.calculateItemPrice = function (voucherLine) {
                    voucherLine.debit = 0;
                    voucherLine.debit += voucherLine.price * voucherLine.quantity;
                };
                vm.dateChanged = function () {
                    if (vm.grn.date == false) {
                        vm.grn.date = null;
                    }

                }

                vm.calculatePriceAndTax = function (row) {
                    vm.calculateItemPrice(row);
                    vm.calculateTaxPerRow(row);
                    vm.sumAmount();
                };

                vm.searchJobs = function ($select) {
                    if ($select.search == "") { vm.jobs = null; return null; }
                    jobAppService.searchJobDetails({ jobNo: $select.search }).then(function (response) {
                        vm.jobs = response.data;
                    });
                };


                vm.save = function () {
                    if (vm.locations.length === 1) vm.grn.locationId = vm.locations[0].id;
                    vm.saving = true;

                    var contactName = `${vm.grn.contact.name} (${vm.grn.contact.code})`;

                    vm.grn.notes = `${vm.grn.contact.name}(${vm.grn.contact.code})  ${vm.grn.notes}`;

                    vm.grn.voucherLines.forEach(e => e.description = `${e.description} ${contactName}`);

                    vm.grn.voucherDocuments = vm.documents;

                    if (!vm.includeJob) {
                        vm.grn.job = null;
                        vm.grn.jobId = null;
                        vm.grn.jobDetailId = null;
                    }
                    grnService.createOrUpdateGrn({ grn: vm.grn }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.grn.id = result.id;
                        //if (vm.saveAndPrint)
                        //    saveAndPrint(vm.grn.id);
                        $uibModalInstance.close(result);
                    }).finally(function () {
                        vm.saving = false;
                        vm.loading = false;
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                function init() {
                    getLocations();
                    if (vm.isAssetsEnabled)
                        getAssetTypes();
                    vm.getUnitOfMeasures();
                    vm.includeJob = false;
                    vm.loading = true;
                    vm.disableSelection = false;
                    if (options.stockPoId) {
                        purchaseOrdersService.getPurchaseOrderForEdit({ id: options.stockPoId }).success(
                            function (result) {
                                vm.grn = result;
                                if (vm.isMultiCurrencyEnabled || options.stockPoId) {
                                    if (vm.grn.contact) {
                                        if (vm.grn.contact.currency) {
                                            vm.currencyCode = vm.grn.contact.currency.code;
                                            currencyName = vm.grn.contact.currency ? vm.grn.contact.currency.name : null;
                                            decimalName = vm.grn.contact.currency ? vm.grn.contact.currency.decimalName : null;
                                            vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);
                                        }
                                        else {
                                            vm.currencyCode = vm.defaultCurrencyCode;
                                        }
                                    }
                                    else {
                                        vm.currencyCode = vm.defaultCurrencyCode;
                                    }
                                }
                                if (options.currencyId) {
                                    vm.grn.currencyId = options.currencyId;
                                    vm.grn.currencyRate = options.currencyRate;
                                }

                                //vm.currencyCode = vm.grn.contact.currency.code;
                                //currencyName = vm.grn.contact.currency ? vm.grn.contact.currency.name : null;
                                //decimalName = vm.grn.contact.currency ? vm.grn.contact.currency.decimalName : null;
                                //vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);
                                vm.grn.refNo2 = angular.copy(vm.grn.refNo);
                                vm.grn.refNo = null;
                                vm.disableSelection = true;
                                vm.grn.voucherSubTypeId = 48;
                                if (options.type == 40)
                                    vm.grn.voucherSubTypeId = 49;
                                if (options.type == 100)
                                    vm.grn.voucherSubTypeId = 101;

                                vm.grn.parentVoucher = angular.copy(result);
                                vm.grn.id = 0;
                                if (vm.grnAsFinancialVoucher)
                                    vm.grn.refNo = null;
                                vm.grn.parentVoucherId = options.stockPoId;
                                vm.poSelected();

                                //angular.forEach(vm.grn.voucherLines, function (voucherLine) {
                                //    if (options.type == 39) {
                                //        voucherLine.product.unitOfMeasure = voucherLine.unitOfMeasure;
                                //        voucherLine.product.unitOfMeasureId = voucherLine.unitOfMeasureId;
                                //    }
                                //    voucherLine.quantityOrdered = voucherLine.quantity;
                                //    voucherLine.id = 0;

                                //    vm.calculateItemPrice(vm.grn.voucherLines[vm.grn.voucherLines.length - 1]);
                                //    vm.calculateTaxPerRow(vm.grn.voucherLines[vm.grn.voucherLines.length - 1]);

                                //});
                            });
                        // vm.sumAmount();
                    }
                    else {
                        grnService.getGrnForEdit({ id: options.grnId }).success(
                            function (result) {
                                vm.grn = result;
                                if (vm.isMultiCurrencyEnabled || options.grnId) {
                                    if (vm.grn.contact) {
                                        if (vm.grn.contact.currency) {

                                            vm.currencyCode = vm.grn.contact.currency.code;
                                            currencyName = vm.grn.contact.currency ? vm.grn.contact.currency.name : null;
                                            decimalName = vm.grn.contact.currency ? vm.grn.contact.currency.decimalName : null;
                                            vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);
                                        }
                                        else {
                                            vm.currencyCode = vm.defaultCurrencyCode;
                                        }
                                    }
                                    else {
                                        vm.currencyCode = vm.defaultCurrencyCode;
                                    }
                                }
                                vm.documents = vm.grn.voucherDocuments;
                                if (vm.grn.id < 1) {
                                    vm.isEditMode = false;
                                    vm.grn.voucherNo = null;
                                    vm.grn.locationId = appSession.user.locationId;
                                    vm.grn.taxPercent = vm.taxPercent;
                                    vm.sumAmount();
                                    if (vm.isStockEnabled)
                                        vm.grn.voucherSubTypeId = 48;
                                    else if (!vm.isStockEnabled)
                                        if (vm.isSaleInventoryVehicleEnabled)
                                            vm.grn.voucherSubTypeId = 101;
                                        else
                                            vm.grn.voucherSubTypeId = 49;
                                } else {
                                    vm.isEditMode = true;
                                    angular.forEach(vm.grn.voucherLines, function (line) {
                                        if (line.product) {
                                            line.product.unitOfMeasure = line.unitOfMeasure;
                                            line.product.unitOfMeasureId = line.unitOfMeasureId;
                                        }
                                        line.quantityAlreadyReceived = 0;
                                        line.quantityOrdered = 0;
                                        vm.calculateQtyAlreadyReceived(line, 1);
                                        vm.calculateQtyOrdered(line, 1);
                                    });

                                    if (vm.grn.jobId != null) {
                                        vm.includeJob = true;
                                    }
                                }
                                if (vm.grn.voucherLines.length === 0)
                                    vm.addRow();
                            })
                            .finally(function () {

                                vm.loading = false;
                            });
                    }


                }

                init();
            }]);
