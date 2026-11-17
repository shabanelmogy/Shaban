// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:379974-380799
appModule.controller('tenant.views.crs.vouchers.purchaseOrders.createOrEditModal', ['abp.services.app.purchaseOrder', '$uibModal', 'options', '$uibModalInstance', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities', 'appSession', 'abp.services.app.item', 'abp.services.app.unitOfMeasure',
        'abp.services.app.asset', 'abp.services.app.commonQuotation', 'abp.services.app.assetType', 'abp.services.app.purchaseRequest', 'abp.services.app.job', 'abp.services.app.leaseMasterAgreement', 'abp.services.app.vehicleModel',
        function (purchaseOrdersService, $uibModal, options, $uibModalInstance, vehicleService, directoryService, commonLookupService,
            utilities, appSession, itemAppService, unitOfMeasureAppService, assetService, leaseQuotationService, assetTypeService, purhaseRequestService, jobAppService, leaseMasterAgreementService, vehicleModelService) {
            var vm = this;
            vm.branchTaxPercentage = null;
            vm.vehicles = [];
            vm.suppliers = [];
            vm.locations = [];
            vm.documents = [];
            vm.saveAndPrint = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.addMasterAgreementInVouchers = abp.features.isEnabled("CRS.CustomFeatures.MasterAgreementInVouchers");
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForPurchaseOrder");
            vm.externalWorkShopChargesInJC = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ExternalWorkshopChargesInJC"));
            vm.allowWorkshopPO = utilities.parseBoolean(abp.setting.get("App.General.AllowWorkshopPO"));
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseOrders");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.purchaseOrderPriceBasedOnLastSupplier = utilities.parseBoolean(abp.setting.get("App.General.PurchaseOrderPriceBasedOnLastSupplier"));
            vm.purchaseAndSalesHistoryInPurchaseOrder = utilities.parseBoolean(abp.setting.get("App.General.PurchaseAndSalesHistoryInPurchaseOrder"));
            vm.poHideDescription = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoHideDescription"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.forwardVehicleDetailsFromStockPRToPO = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ForwardVehicleDetailsFromStockPRToPOLines"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders');
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.branchTaxPercentage = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.purchaseOrder = {};
            vm.doNotAllowDiscount = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotAllowDiscountInPO"));
            vm.isEnablePoCustomFeild1 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild1"));
            vm.isEnablePoCustomFeild2 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild2"));
            vm.isEnablePoCustomFeild3 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild3"));
            vm.isEnablePoCustomFeild4 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild4"));
            vm.isEnablePoCustomFeild5 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild5"));
            vm.isEnablePoCustomFeild6 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild6"));
            vm.isEnablePoCustomFeild7 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild7"));
            vm.isEnablePoCustomDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomDate"));
            vm.customFiedInPoVoucherLines = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeildInVoucherLines"));
            vm.isSaleInventoryVehicleEnabled = abp.features.isEnabled("CRS.Accounts.SaleInventoryVehicle");
            vm.filters = {
                name: '',
                makeId: null
            };
            // vm.poType = 2;
            vm.workTypes = [
                { value: 1, text: "Tyre" },
                { value: 2, text: "Battery" },
                { value: 3, text: "Service" },
                { value: 4, text: "Repair" },
                { value: 30, text: "Other" }
            ];

            vm.getWorkTypeText = function (id) {
                var type = vm.workTypes.find(function (x) {
                    return x.value === id;
                });
                return type ? type.text : "";
            };

            vm.purchaseOrder.voucherSubTypeId = 38; //service purchase order

            vm.supplierSelected = function () {
                vm.purchaseOrder.taxPercent = vm.purchaseOrder.contact.isTaxExempted ? 0 : parseFloat(abp.setting.get("App.General.TaxPercentage"));
                vm.purchaseOrder.voucherLines.forEach((e) => vm.calculateTaxPerRow(e));
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.purchaseOrder.contact.currencyDto) {
                        vm.currencyCode = vm.purchaseOrder.contact.currencyDto.code;
                        vm.purchaseOrder.currencyId = vm.purchaseOrder.contact.currencyDto.id;
                        vm.purchaseOrder.currencyRate = vm.purchaseOrder.contact.currencyDto.currencyToBaseRate;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }
                vm.sumAmountTax();
            }

            function purchaseOrdersLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                line.vehicleModelId = null;
                line.item = {};
                line.itemQuantity = 0;
                line.amount = 0;
                line.workTypeId = null;
                if (vm.purchaseOrder.voucherSubTypeId == 40) {
                    line.customField = 'KINDLY REGISTER THE ABOVE VEHICLE IN THE NAME OF GALADARI RENT A CAR. AS PER YOUR QUOTATION# HYU-DXB-FLF-169-23-SS, DTD 26TH SEP 2024. (CAPEX # 74/2024, DTD 08TH OCT 2024) NVP 1628';
                } else {
                    line.customField = null;
                }
                return line;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.openJobVehicleModal = function () {
                openVehicleDetailModal();
            }

            function openVehicleDetailModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/openJobVehicleDetailModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        vehicleDetail: function () {
                            return vm.purchaseOrder.job;
                        },
                    }
                });
            }

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

            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
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


            vm.purchaseAndSalesHistoryModel = function (productId) {
                openPurchaseAndSalesHistoryModel(productId);
            };

            openPurchaseAndSalesHistoryModel = function (productId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/purchaseAndSalesHistoryModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                productId: productId,
                            }
                        }
                    }
                });
            }

            // extended search using search contact popup
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

            vm.searchAdditionalDriverPopoup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (requestedBy) {
                    vm.purchaseOrder.requestedBy = requestedBy;
                    vm.purchaseOrder.requestedById = requestedBy.id;
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            //Add row
            vm.addRow = function () {
                vm.purchaseOrder.voucherLines.push(purchaseOrdersLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.purchaseOrder.voucherLines.indexOf(obj);
                vm.purchaseOrder.voucherLines.splice(index, 1);
                vm.sumAmountTax();
            };


            vm.clearOrder = function () {
                vm.purchaseOrder.discount = 0;
                vm.purchaseOrder.amountInWords = "";
                vm.purchaseOrder.amount = 0;
                vm.purchaseOrder.taxPercent = vm.taxPercent;
                vm.withoutDiscountAmount = 0;
                vm.purchaseOrder.tax = 0;

                vm.purchaseOrder.voucherLines = [];

                vm.addRow();
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
                if (vm.purchaseOrder.contact.taxCodeId > 0 && !vm.purchaseOrder.contact.isTaxExempted) {
                    vm.purchaseOrder.taxPercent = vm.purchaseOrder.contact.taxCode.taxPercent;
                }
                else {
                    if (vm.branchTaxPercentage)
                        vm.purchaseOrder.taxPercent = vm.purchaseOrder.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                }

            }

            vm.calculateTaxPerRow = function (row) {
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode()
                }
                if (vm.purchaseOrder === null)
                    return 0;

                if (row === null)
                    return 0;

                if (row.debit !== null) {
                    if (vm.purchaseOrder.taxPercent > 0) {
                        var tax = 0;
                        if (row.taxable || !row.taxable) {
                            if (vm.isTaxInclusive) { // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                var chargesWithoutTax = (row.debit * 100) / (100 + vm.purchaseOrder.taxPercent);
                                tax = utilities.round(row.debit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.debit * vm.purchaseOrder.taxPercent / 100, 2);
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
                if (vm.purchaseOrder.contact) {
                    if (vm.purchaseOrder.contact.isTaxExempted) {
                        row.tax = 0;
                        row.taxable = false;

                    }
                }
                vm.sumAmountTax();
            };

            vm.searchMasterAgreement = function ($select) {
                if ($select.search == "") { vm.masterAgreement = null; return null; }
                leaseMasterAgreementService.searchMasterAgreementsForVouchers({ keyword: $select.search }).then(function (response) {
                    vm.masterAgreement = response.data.items;
                });
            };

            vm.sumAmount = function () {

                if (vm.purchaseOrder === null)
                    return 0;

                if (vm.purchaseOrder.voucherLines === null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.purchaseOrder.voucherLines.length; i++) {
                    if (vm.purchaseOrder.voucherLines[i].debit !== null) {
                        sum = sum + parseFloat(vm.purchaseOrder.voucherLines[i].debit);

                        if (vm.purchaseOrder.taxPercent > 0) {
                            var tax = 0;

                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.purchaseOrder.voucherLines[i].debit * 100) / (100 + vm.purchaseOrder.taxPercent);
                                tax = utilities.round(vm.purchaseOrder.voucherLines[i].debit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(vm.purchaseOrder.voucherLines[i].debit * vm.purchaseOrder.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            vm.purchaseOrder.voucherLines[i].tax = tax;
                            if (tax > 0)
                                vm.purchaseOrder.voucherLines[i].taxable = true;
                        }
                        else {
                            vm.purchaseOrder.voucherLines[i].tax = 0;
                            vm.purchaseOrder.voucherLines[i].taxable = false;
                        }
                    }
                }

                vm.purchaseOrder.amountInWords = '';

                vm.purchaseOrder.tax = totalTax;
                vm.purchaseOrder.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                vm.purchaseOrder.amount = utilities.round(vm.purchaseOrder.amount, 2);
                if (vm.purchaseOrder.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.purchaseOrder.contact.currencyDto ? vm.purchaseOrder.contact.currencyDto.name : null;
                        decimalName = vm.purchaseOrder.contact.currencyDto ? vm.purchaseOrder.contact.currencyDto.decimalName : null;
                        vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount, currencyName, decimalName);

                    }
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;

                vm.purchaseOrder.voucherLines.forEach(function (value) {

                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;

                });

                vm.purchaseOrder.tax = totalTax;
                vm.withoutDiscountAmount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.withoutDiscountAmount = utilities.round(vm.withoutDiscountAmount, 2);
                if (vm.purchaseOrder.discount !== null) {
                    vm.purchaseOrder.amount = vm.withoutDiscountAmount - vm.purchaseOrder.discount;
                }
                else {
                    vm.purchaseOrder.amount = vm.withoutDiscountAmount;
                }
                if (vm.purchaseOrder.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.purchaseOrder.contact.currencyDto ? vm.purchaseOrder.contact.currencyDto.name : null;
                        decimalName = vm.purchaseOrder.contact.currencyDto ? vm.purchaseOrder.contact.currencyDto.decimalName : null;
                        vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount, currencyName, decimalName);

                    }
                    if (vm.isMultiCurrencyEnabled && vm.purchaseOrder.id > 0) {
                        currencyName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.name : null;
                        decimalName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.decimalName : null;
                        vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount, currencyName, decimalName);

                    }
                    if (vm.isMultiCurrencyEnabled && options.purchaseOrderId) {
                        currencyName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.name : null;
                        decimalName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.decimalName : null;
                        vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount, currencyName, decimalName);
                        vm.currencyCode = vm.purchaseOrder.contact.currency.code;

                    }
                }
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                    angular.forEach(vm.items, function (item) {
                        item.isEditMode = true;
                    });
                });
            };

            vm.pOUnitPriceBasedOnLastSupplier = function (voucherLine, supplierId) {
                purchaseOrdersService.getPOUnitPriceBasedOnLastSupplier({ itemId: voucherLine.productId, contactId: supplierId }).then(function (response) {
                    voucherLine.price = response.data;
                    vm.calculateItemPrice(voucherLine);
                    vm.calculateTaxPerRow(voucherLine)
                    if (vm.purchaseOrder.amount > 0) {
                        if (vm.autoCalculateAmountInWords === "true")
                            vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount);
                        if (vm.isMultiCurrencyEnabled) {
                            currencyName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.name : null;
                            decimalName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.decimalName : null;
                            vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount, currencyName, decimalName);

                        }
                    }
                    else {
                        vm.purchaseOrder.amountInWords = "";
                    }
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

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.searchResults = null; return null; }
                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            vm.onItemSelected = function (purchaseOrder) {
                debugger;
                if (purchaseOrder && purchaseOrder.job) {
                    angular.forEach(purchaseOrder.voucherLines, function (purchaseOrderline) {
                        purchaseOrderline.vehicleId = purchaseOrder.job.vehicleId;
                        purchaseOrderline.vehicle = purchaseOrder.job.vehicle;
                    });
                }
            };

            vm.onJobSelectedForVoucherline = function (voucherLine) {
                if (voucherLine) {
                    if (voucherLine.job) {
                        voucherLine.vehicleId = voucherLine.job.vehicleId;
                        voucherLine.vehicle = voucherLine.job.vehicle;
                    }
                }
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal as vm',
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


            vm.save = function () {
                vm.disableSaveButton = true;
                angular.forEach(vm.purchaseOrder.voucherLines, function (purchaseOrderline) {
                    if (purchaseOrderline.job) {
                        if (purchaseOrderline.job.status == 2) {
                            vm.disableSaveButton = false;
                        }
                    }

                });

                if (vm.disableSaveButton) {
                    if (vm.locations.length === 1) vm.purchaseOrder.locationId = vm.locations[0].id;
                    vm.purchaseOrder.voucherDocuments = vm.documents;
                    vm.saving = true;
                    purchaseOrdersService.createOrUpdatePurchaseOrder({ purchaseOrder: vm.purchaseOrder }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.purchaseOrder.id = result.id;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.purchaseOrder.id);
                        $uibModalInstance.close(result);
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info("Closed job is selected");
                }
            };

            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview as vmMain',
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
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            function init() {
                vm.disableSelection = false;
                vm.branchTaxCode();
                getLocations();
                if (vm.isAssetsEnabled)
                    getAssetTypes();
                if (options.purchaseRequestId) {
                    vm.loading = true;
                    purhaseRequestService.getPurchaseRequestForEdit({ id: options.purchaseRequestId }).success(function (result) {
                        vm.disableSelection = true;
                        vm.purchaseOrder = result;
                        vm.purchaseOrder.id = 0;
                        vm.purchaseOrder.parentVoucherId = options.purchaseRequestId;

                        if (options.currencyId) {
                            vm.purchaseOrder.currencyId = options.currencyId;
                            vm.purchaseOrder.currencyRate = options.currencyRate;
                        }

                        if (options.type == 52) // service purchseRequest
                            vm.purchaseOrder.voucherSubTypeId = 38;
                        else if (options.type == 53) // stock purchseRequest
                            vm.purchaseOrder.voucherSubTypeId = 39;
                        else if (options.type == 54) // asset purchseRequest
                            vm.purchaseOrder.voucherSubTypeId = 40;
                        else if (options.type == 99) // InventoryVehicle purchseRequest
                            vm.purchaseOrder.voucherSubTypeId = 100;

                        vm.purchaseOrder.voucherLines.forEach(e => e.id = 0);
                        vm.sumAmountTax();
                        if (vm.purchaseOrder.voucherSubTypeId == 40) {
                            assetTypeService.getAssetDefaultType().success(function (data) {

                                vm.assetType = data;

                                angular.forEach(result.voucherLines, function (voucherLine) {

                                    //voucherLine.assetType = vm.assetType;
                                    //voucherLine.assetTypeId = vm.assetType.id;

                                    vm.calculateItemPrice(voucherLine);
                                    vm.calculateTaxPerRow(voucherLine);

                                });
                                vm.sumAmountTax();

                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                        else if (vm.purchaseOrder.voucherSubTypeId == 39) {
                            angular.forEach(result.voucherLines, function (voucherLine) {

                                voucherLine.product.unitOfMeasure = voucherLine.unitOfMeasure;
                                voucherLine.product.unitOfMeasureId = voucherLine.unitOfMeasureId;

                                vm.calculateItemPrice(voucherLine);
                                vm.calculateTaxPerRow(voucherLine);

                            });
                            vm.sumAmountTax();

                        }



                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.leaseQuotationId) {
                    vm.loading = true;
                    leaseQuotationService.getLeaseQuotationToCreatePO({ id: options.leaseQuotationId }).success(function (result) {
                        vm.disableSelection = true;
                        vm.purchaseOrder = result;
                        assetTypeService.getAssetDefaultType().success(function (data) {

                            vm.assetType = data;

                            angular.forEach(result.voucherLines, function (voucherLine) {

                                voucherLine.assetType = vm.assetType;
                                voucherLine.assetTypeId = vm.assetType.id;

                                //voucherLine.debit = voucherLine.price * voucherLine.quantity;
                                vm.calculateItemPrice(voucherLine);
                                vm.calculateTaxPerRow(voucherLine);

                            });
                            vm.sumAmount();

                        }).finally(function () {
                            vm.loading = false;
                        });

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    vm.loading = true;
                    purchaseOrdersService.getPurchaseOrderForEdit({ id: options.purchaseOrderId }).success(
                        function (result) {
                            vm.purchaseOrder = result;
                            vm.documents = vm.purchaseOrder.voucherDocuments;
                            vm.withoutDiscountAmount = vm.purchaseOrder.amount + vm.purchaseOrder.discount;
                            if (vm.isMultiCurrencyEnabled || options) {
                                if (vm.purchaseOrder.contact) {
                                    if (vm.purchaseOrder.contact.currency) {

                                        vm.currencyCode = vm.purchaseOrder.contact.currency.code;
                                        currencyName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.name : null;
                                        decimalName = vm.purchaseOrder.contact.currency ? vm.purchaseOrder.contact.currency.decimalName : null;
                                        vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount, currencyName, decimalName);
                                    }

                                    else {
                                        vm.currencyCode = vm.defaultCurrencyCode;
                                    }
                                }
                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;
                                }
                            }

                            if (options.contact) {
                                vm.purchaseOrder.contact = options.contact;
                                vm.purchaseOrder.contactId = options.contact.id;
                            }
                            if (options.serviceItems) {
                                options.serviceItems.forEach(function (value) {

                                    vm.purchaseOrder.voucherLines.push({
                                        workType: 3,
                                        expenseTypeId: null,
                                        description: value.name,
                                        debit: null,
                                        credit: null,
                                        vehicleId: options.vehicle.id,
                                        vehicle: options.vehicle
                                    });

                                });
                            }

                            if (vm.purchaseOrder.id < 1) {
                                vm.isEditMode = false;
                                vm.purchaseOrder.voucherNo = null;
                                vm.purchaseOrder.locationId = appSession.user.locationId;
                                vm.purchaseOrder.taxPercent = vm.taxPercent;
                                vm.purchaseOrder.voucherSubTypeId = 38;
                            } else {
                                vm.isEditMode = true;
                                vm.disableSelection = true;
                            }
                            if (options.isWorkshopPO) {
                                vm.purchaseOrder.voucherSubTypeId = 116;
                            }
                            if (vm.purchaseOrder.voucherLines.length === 0) {

                                if (options.isMovementSubtypeMaintenance) {
                                    // Add a single voucher line with workType = 3 (Service)
                                    vm.purchaseOrder.voucherLines.push({
                                        workType: 3,
                                        expenseTypeId: null,
                                        description: '',
                                        debit: null,
                                        credit: null,
                                        vehicleId: null,
                                        vehicle: null
                                    });
                                } else {
                                    // If not maintenance, add a normal empty row
                                    vm.addRow();
                                }
                            }

                            if (options.purchaseOrder && !vm.isEditMode) {

                                var purchaseOrder = angular.copy(options.purchaseOrder);

                                vm.bill.contactId = purchaseOrder.contact.id;
                                vm.bill.contact = purchaseOrder.contact;
                                vm.bill.parentVoucherId = purchaseOrder.id;
                                vm.bill.voucherLines = [];
                                vm.bill.taxPercent = vm.taxPercent;

                                angular.forEach(purchaseOrder.voucherLines, function (purchaseOrderline) {

                                    if (purchaseOrderline.debit > 0) {
                                        var billine = billLineObject();
                                        if (options.isMovementSubtypeMaintenance) {
                                            billine.workType = 3;
                                        }
                                        billine.description = purchaseOrderline.description;
                                        billine.vehicleId = purchaseOrderline.vehicleId;
                                        billine.vehicle = purchaseOrderline.vehicle;
                                        billine.vehicleModelId = purchaseOrderline.vehicleModelId;
                                        billine.vehicleModel = purchaseOrderline.vehicleModel;
                                        billine.debit = purchaseOrderline.debit;

                                        vm.bill.voucherLines.push(billine);
                                    }
                                });

                                vm.sumAmount();
                            }

                        })
                        .finally(function () {
                            //    if (vm.purchaseOrder) {
                            //        vm.sumAmount();
                            //        vm.sumAmountTax();
                            //    }
                            vm.loading = false;
                        });
                }
            }

            vm.getUnitOfMeasures();

            init();
        }]);
