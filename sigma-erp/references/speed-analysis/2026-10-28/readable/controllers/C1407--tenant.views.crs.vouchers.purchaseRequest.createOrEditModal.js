// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:382650-383479
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.createOrEditModal', ['abp.services.app.purchaseRequest', '$uibModal', 'options', '$uibModalInstance', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities', 'appSession', 'abp.services.app.item', 'abp.services.app.unitOfMeasure', 'abp.services.app.asset',
        'abp.services.app.leaseQuotation', 'abp.services.app.assetType', 'abp.services.app.itemRequisition', 'FileUploader', 'abp.services.app.job', 'abp.services.app.vehicleModel',
        function (purchaseRequestService, $uibModal, options, $uibModalInstance, vehicleService, directoryService, commonLookupService,
            utilities, appSession, itemAppService, unitOfMeasureAppService, assetService, leaseQuotationService, assetTypeService, itemRequisitionService, fileUploader, jobAppService, vehicleModelService) {
            var vm = this;
            vm.branchTaxPercentage = null;
            vm.contact = {};
            vm.vehicles = [];
            vm.suppliers = [];
            vm.locations = [];
            vm.documents = [];
            vm.saveAndPrint = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.externalWorkShopChargesInJC = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ExternalWorkshopChargesInJC"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.forwardVehicleDetailsFromStockIRToPR = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ForwardVehicleDetailsFromStockPRToPOLines"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders');
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isSaleInventoryVehicleEnabled = abp.features.isEnabled("CRS.Accounts.SaleInventoryVehicle");
            vm.isMultiLevelApprovalEnabled = abp.features.isEnabled("CRS.Approval.PurchaseRequests");

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.purchaseRequest = {};
            vm.isEnablePoCustomFeild1 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild1"));
            vm.isEnablePoCustomFeild2 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild2"));
            vm.isEnablePoCustomFeild3 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild3"));
            vm.isEnablePoCustomFeild4 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild4"));
            vm.permissions = {
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.Approve'),
            };
            // vm.poType = 2;
            vm.purchaseRequest.voucherSubTypeId = 52; //service purchase order
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

                return line;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                        vm.purchaseRequest.contact = supplier;
                        vm.purchaseRequest.contactId = supplier.id;
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
                    vm.purchaseRequest.requestedBy = requestedBy;
                    vm.purchaseRequest.requestedById = requestedBy.id;
                });
            };

            vm.onSupplierSelect = function () {
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.purchaseRequest.contact.currencyDto) {
                        vm.currencyCode = vm.purchaseRequest.contact.currencyDto.code;
                        vm.purchaseRequest.currencyId = vm.purchaseRequest.contact.currencyDto.id;
                        vm.purchaseRequest.currencyRate = vm.purchaseRequest.contact.currencyDto.currencyToBaseRate;
                        currencyName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.name : null;
                        decimalName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.decimalName : null;
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount);

                    }



                }
            }

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.searchResults = null; return null; }

                jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.onJobSelectedForVoucherline = function (voucherLine) {
                if (voucherLine) {
                    if (voucherLine.job) {
                        voucherLine.vehicleId = voucherLine.job.vehicleId;
                        voucherLine.vehicle = voucherLine.job.vehicle;

                    }
                }
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
                            return vm.purchaseRequest.job;
                        },
                    }
                });
            }



            //Add row
            vm.addRow = function () {
                vm.purchaseRequest.voucherLines.push(purchaseOrdersLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.purchaseRequest.voucherLines.indexOf(obj);
                vm.purchaseRequest.voucherLines.splice(index, 1);
                vm.sumAmountTax();
            };


            //vm.clearOrder = function () {
            //    vm.purchaseRequest.discount = 0;
            //    vm.purchaseRequest.amountInWords = "";
            //    vm.purchaseRequest.amount = 0;
            //    vm.purchaseRequest.taxPercent = vm.taxPercent;
            //    vm.withoutDiscountAmount = 0;
            //    vm.purchaseRequest.tax = 0;

            //    vm.purchaseRequest.voucherLines = [];

            //    vm.addRow();
            //};

            vm.changeTaxOnSupplier = function () {
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                    vm.purchaseRequest.voucherLines.forEach(row => {
                        vm.calculateTaxPerRow(row);
                    });
                }
            };

            vm.calculateTaxPerRow = function (row) {
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                }
                if (vm.purchaseRequest === null)
                    return 0;

                if (row === null)
                    return 0;

                if (row.debit !== null) {

                    if (vm.taxPercent > 0) {
                        var tax = 0;
                        if (row.taxable || !row.taxable) {
                            if (vm.isTaxInclusive) { // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                var chargesWithoutTax = (row.debit * 100) / (100 + vm.taxPercent);
                                tax = utilities.round(row.debit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.debit * vm.taxPercent / 100, 2);
                            }
                            row.tax = tax;
                            row.taxable = true;
                        } else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                        }
                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.taxable);
                    }
                }
                if (vm.purchaseRequest.contact) {
                    if (vm.purchaseRequest.contact.isTaxExempted) {
                        row.tax = 0;
                        row.taxable = false;

                    }
                }
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
            vm.setTaxPercentOnTaxCode = function () {
                if (vm.isTaxCodeEnabled && !vm.purchaseRequest.contact.isTaxExempted) {
                    if (vm.purchaseRequest.contact.taxCodeId > 0) {
                        vm.purchaseRequest.taxPercent = vm.purchaseRequest.contact.taxCode.taxPercent;
                        vm.taxPercent = vm.purchaseRequest.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.purchaseRequest.taxPercent = vm.purchaseRequest.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                        vm.taxPercent = vm.purchaseRequest.taxPercent;
                    }
                }
            }

            vm.sumAmount = function () {

                if (vm.purchaseRequest === null)
                    return 0;

                if (vm.purchaseRequest.voucherLines === null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.purchaseRequest.voucherLines.length; i++) {
                    if (vm.purchaseRequest.voucherLines[i].debit !== null) {
                        sum = sum + parseFloat(vm.purchaseRequest.voucherLines[i].debit);

                        if (vm.purchaseRequest.taxPercent > 0) {
                            var tax = 0;

                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.purchaseRequest.voucherLines[i].debit * 100) / (100 + vm.purchaseRequest.taxPercent);
                                tax = utilities.round(vm.purchaseRequest.voucherLines[i].debit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(vm.purchaseRequest.voucherLines[i].debit * vm.purchaseRequest.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            vm.purchaseRequest.voucherLines[i].tax = tax;
                            if (tax > 0)
                                vm.purchaseRequest.voucherLines[i].taxable = true;
                        }

                        else {
                            vm.purchaseRequest.voucherLines[i].tax = 0;
                            vm.purchaseRequest.voucherLines[i].taxable = false;
                        }
                    }
                }

                vm.purchaseRequest.amountInWords = '';

                vm.purchaseRequest.tax = totalTax;
                vm.purchaseRequest.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                vm.purchaseRequest.amount = utilities.round(vm.purchaseRequest.amount, 2);
                if (vm.purchaseRequest.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.name : null;
                        decimalName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.decimalName : null;
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
                    }
                    if (vm.isMultiCurrencyEnabled && vm.purchaseRequest.id > 0) {
                        currencyName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.name : null;
                        decimalName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.decimalName : null;
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
                    }
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;

                vm.purchaseRequest.voucherLines.forEach(function (value) {

                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;

                });

                vm.purchaseRequest.tax = totalTax;
                vm.withoutDiscountAmount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.withoutDiscountAmount = utilities.round(vm.withoutDiscountAmount, 2);
                if (vm.purchaseRequest.discount !== null) {
                    vm.purchaseRequest.amount = vm.withoutDiscountAmount - vm.purchaseRequest.discount;
                }
                else {
                    vm.purchaseRequest.amount = vm.withoutDiscountAmount;
                }
                if (vm.purchaseRequest.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.name : null;
                        decimalName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.decimalName : null;
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);

                    }
                    if (vm.isMultiCurrencyEnabled && vm.purchaseRequest.id > 0) {
                        currencyName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.name : null;
                        decimalName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.decimalName : null;
                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
                    }

                }
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.multiLevelApprovePurchaseRequest = function () {
                var row = vm.purchaseRequest;
                if (!vm.purchaseRequest.contact.name)
                    vm.purchaseRequest.contact = vm.contact;

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/approval/approvalModal.cshtml',
                    controller: 'tenant.views.common.approval.approvalModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        approvalId: function () {
                            return row.approvalId;
                        },
                        form: function () {
                            return 3;
                        },
                        recordId: function () {
                            return row.id;
                        },
                        formValue: function () {
                            return row;
                        }
                    }
                })
                modalInstance.result.then(function (result) {
                });
            };

            vm.approvePurchaseRequest = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/approvalModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.approvalModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        purchaseRequest: function () {
                            return vm.purchaseRequest;
                        }
                    }
                })
                modalInstance.result.then(function (result) {
                });
            };

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });
            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;

                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    debugger;
                    purchaseRequestService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.purchaseRequest.voucherLines = result;

                            angular.forEach(vm.purchaseRequest.voucherLines, function (value, key) {

                                if (value.vehicleId != null && value.vehicleId > 0)

                                    value.vehicleShow = true;

                                if (value.product)
                                    value.price = value.product.price;




                                debugger;

                                if (value.quantity) {

                                    vm.calculateItemPrice(value);
                                }
                                vm.calculateTaxPerRow(value);
                                vm.sumAmount();
                            });
                            if (vm.purchaseRequest.voucherLines.length == 0)
                                vm.addRow();
                        })
                        .finally(function () { vm.loading = false; });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };
            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
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

            vm.calculateItemPrice = function (voucherLine) {

                if (voucherLine.quantity > -1) {
                    voucherLine.debit = voucherLine.price * voucherLine.quantity;
                }

                if (voucherLine.discount > -1 && voucherLine.discount <= voucherLine.debit) {
                    voucherLine.debit = voucherLine.debit - voucherLine.discount;
                }
                if (vm.isMultiCurrencyEnabled) {
                    currencyName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.name : null;
                    decimalName = vm.purchaseRequest.contact.currencyDto ? vm.purchaseRequest.contact.currencyDto.decimalName : null;
                    vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
                }
                if (vm.isMultiCurrencyEnabled && vm.purchaseRequest.id > 0) {
                    currencyName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.name : null;
                    decimalName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.decimalName : null;
                    vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
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

            vm.save = function () {
                vm.disableSaveButton = true;
                angular.forEach(vm.purchaseRequest.voucherLines, function (purchaseRequestLine) {
                    if (purchaseRequestLine.job) {
                        if (purchaseRequestLine.job.status == 2) {
                            vm.disableSaveButton = false;
                        }
                    }

                });

                if (vm.disableSaveButton) {
                    if (vm.locations.length === 1) vm.purchaseRequest.locationId = vm.locations[0].id;
                    vm.saving = true;
                    vm.purchaseRequest.job = null;
                    vm.purchaseRequest.voucherDocuments = vm.documents;
                    purchaseRequestService.createOrUpdatePurchaseRequest({
                        purchaseRequest: vm.purchaseRequest,
                        requisitionID: options.itemRequistionId
                    }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.purchaseRequest.id = result.id;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.purchaseRequest.id);
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
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseRequestId: function () {
                            return id;
                        }
                    }
                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.disableSelection = false;
                vm.branchTaxCode();
                getLocations();
                if (vm.isAssetsEnabled)
                    getAssetTypes();


                if (options.itemRequistionId) {
                    vm.loading = true;
                    vm.prFromRequistion = true;


                    itemRequisitionService.getItemRequisitionToCreatePR({ id: options.itemRequistionId }).success(function (result) {
                        vm.disableSelection = true;
                        //    vm.module = 4;
                        vm.purchaseRequest = result;
                        if (!vm.forwardVehicleDetailsFromStockIRToPR) {
                            vm.purchaseRequest.jobId = null;
                        }
                        vm.purchaseRequest.voucherSubTypeId = 53;  // stock purchase request
                        vm.purchaseRequest.id = 0;

                        angular.forEach(result.voucherLines, function (voucherLine) {

                            vm.calculateItemPrice(voucherLine);
                            vm.calculateTaxPerRow(voucherLine);

                        });
                        vm.sumAmount();

                    }).finally(function () {
                        vm.loading = false;
                    });

                }

                else if (options.leaseQuotationId) {
                    vm.loading = true;
                    leaseQuotationService.getLeaseQuotationToCreatePO({ id: options.leaseQuotationId }).success(function (result) {
                        vm.disableSelection = true;
                        vm.purchaseRequest = result;
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
                    purchaseRequestService.getPurchaseRequestForEdit({ id: options.purchaseRequestId }).success(
                        function (result) {
                            vm.purchaseRequest = result;
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.purchaseRequest.contact) {
                                    if (vm.purchaseRequest.contact.currency) {
                                        vm.currencyCode = vm.purchaseRequest.contact.currency.code;
                                        currencyName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.name : null;
                                        decimalName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.decimalName : null;
                                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
                                    }
                                    else {
                                        vm.currencyCode = vm.defaultCurrencyCode;
                                        vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount);

                                    }
                                }
                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;
                                }
                            }
                            vm.documents = vm.purchaseRequest.voucherDocuments;
                            vm.contact = angular.copy(vm.purchaseRequest.contact);
                            vm.withoutDiscountAmount = vm.purchaseRequest.amount + vm.purchaseRequest.discount;

                            if (options.contact) {
                                vm.purchaseRequest.contact = options.contact;
                                vm.purchaseRequest.contactId = options.contact.id;
                            }
                            if (options.serviceItems) {
                                options.serviceItems.forEach(function (value) {
                                    vm.purchaseRequest.voucherLines.push({
                                        expenseTypeId: null,
                                        description: value.name,
                                        debit: null,
                                        credit: null,
                                        vehicleId: options.vehicle.id,
                                        vehicle: options.vehicle
                                    });
                                });
                            }

                            if (vm.purchaseRequest.id < 1) {
                                vm.isEditMode = false;
                                vm.purchaseRequest.voucherNo = null;
                                vm.purchaseRequest.locationId = appSession.user.locationId;
                                vm.purchaseRequest.taxPercent = vm.taxPercent;
                                vm.purchaseRequest.voucherSubTypeId = 52;
                            } else {
                                vm.isEditMode = true;
                                vm.purchaseRequest.voucherSubTypeId = vm.purchaseRequest.voucherSubTypeId || 52;
                            }

                            if (vm.purchaseRequest.voucherLines.length === 0)
                                vm.addRow();

                            if (options.purchaseRequest && !vm.isEditMode) {

                                var purchaseRequest = angular.copy(options.purchaseRequest);

                                vm.bill.contactId = purchaseRequest.contact.id;
                                vm.bill.contact = purchaseRequest.contact;
                                vm.bill.parentVoucherId = purchaseRequest.id;
                                vm.bill.voucherLines = [];
                                vm.bill.taxPercent = vm.taxPercent;

                                angular.forEach(purchaseRequest.voucherLines, function (purchaseOrderline) {

                                    if (purchaseOrderline.debit > 0) {
                                        var billine = billLineObject();

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
                            vm.loading = false;
                        });
                }
            }

            vm.getUnitOfMeasures();

            init();
        }]);
