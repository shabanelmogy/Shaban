// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:383482-383924
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.createOrEditModalInitial', ['abp.services.app.purchaseRequest', '$uibModal', 'options', '$uibModalInstance', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.item','$scope',
        function (purchaseRequestService, $uibModal, options, $uibModalInstance, vehicleService, directoryService, commonLookupService,
            utilities, itemAppService, $scope) {
            var vm = this;
            vm.vehicles = [];
            vm.suppliers = [];
            vm.locations = [];
            vm.documents = [];
            vm.saveAndPrint = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders');
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.purchaseRequest = {};
            vm.isEnablePoCustomFeild1 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild1"));
            vm.isEnablePoCustomFeild2 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild2"));
            vm.isEnablePoCustomFeild3 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild3"));
            vm.isEnablePoCustomFeild4 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild4"));

            // vm.poType = 2;
            vm.purchaseRequest.voucherSubTypeId = 52; //service purchase order


            $scope.loadFile = function (files) {
                vm.allowImport = false;
                if (files.length > 0) {
                    $scope.$apply(function () {
                        vm.selectedFile = files[0];
                        readFileData();
                    });
                } else {
                    vm.refresh();
                    $scope.$apply();
                }
            };

            function readFileData() {

                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    var reader = new FileReader();
                    vm.loading = true;

                    reader.onload = function (e) {

                        var data = e.target.result;
                        var workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        var first_sheet_name = workbook.SheetNames[0];

                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });

                        if (dataObjects.length > 0) {

                            var checkForDuplication = true;

                            for (var i = 0; i < dataObjects.length; i++) {

                                var value = dataObjects[i];

                                var vehicleNo = value['Description'];
                                if (!vehicleNo) {
                                    abp.message.error("Vehicle_No feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    description: value['Description'].toString().trim(),
                                };

                                vm.fileDataList.push(item);
                            }

                        } else {
                            abp.message.error("Something Wrong Or File is empty !", "Error");
                        }

                        vm.loading = false;

                        vm.purchaseRequest.voucherLines = [];
                        vm.fileDataList.forEach(e => vm.purchaseRequest.voucherLines.push(purchaseOrdersLineObject(e.description)));

                        $scope.$apply();
                    };

                    reader.onerror = function (ex) {
                        vm.loading = false;
                        abp.message.warn(
                            app.localize(ex),
                            'Unknown File'
                        );
                    };

                    reader.readAsBinaryString(file);

                } else {
                    abp.message.error("Please select Valid file to upload !", "Unknown File");
                    vm.loading = false;
                }

            }
            vm.refresh = function () {
                vm.fileDataList = [];
                angular.element('#dataFile').val(null);
                vm.selectedFile = null;
                vm.allowImport = false;
                vm.totalRecordsCount = 0;
                vm.successRecordsCount = 0;
                vm.failRecordsCount = 0;
                vm.errorRecords = null;
                vm.showCount = false;
            };



            function purchaseOrdersLineObject(description) {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = description;
                line.debit = null;
                line.credit = null;
                line.vehicleId = null;

                line.item = {};
                line.itemQuantity = 0;
                line.amount = 0;

                return line;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
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

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
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


            vm.clearOrder = function () {
                vm.purchaseRequest.discount = 0;
                vm.purchaseRequest.amountInWords = "";
                vm.purchaseRequest.amount = 0;
                vm.purchaseRequest.taxPercent = vm.taxPercent;
                vm.withoutDiscountAmount = 0;
                vm.purchaseRequest.tax = 0;

                vm.purchaseRequest.voucherLines = [];

                vm.addRow();
            };

            vm.calculateTaxPerRow = function (row) {

                if (vm.purchaseRequest === null)
                    return 0;

                if (row === null)
                    return 0;

                if (row.debit !== null) {
                    if (vm.purchaseRequest.taxPercent > 0) {
                        var tax = 0;
                        if (row.taxable || !row.taxable) {
                            if (vm.isTaxInclusive) { // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                var chargesWithoutTax = (row.debit * 100) / (100 + vm.purchaseRequest.taxPercent);
                                tax = utilities.round(row.debit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.debit * vm.purchaseRequest.taxPercent / 100, 2);
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
                }
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
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
            };

            vm.save = function () {
                if (vm.locations.length === 1) vm.purchaseRequest.locationId = vm.locations[0].id;
                vm.saving = true;

                vm.purchaseRequest.voucherDocuments = vm.documents;

                purchaseRequestService.createOrUpdatePurchaseRequestInitial({ purchaseRequest: vm.purchaseRequest }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.purchaseRequest.id = result.id;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.purchaseRequest.id);
                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.purchaseRequest.printPreview as vmMain',
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
                getLocations();
                vm.loading = true;
                purchaseRequestService.getPurchaseRequestForEdit({ id: options.purchaseRequestId }).success(
                    function (result) {
                        vm.purchaseRequest = result;
                        vm.documents = vm.purchaseRequest.voucherDocuments;

                        vm.withoutDiscountAmount = vm.purchaseRequest.amount + vm.purchaseRequest.discount;
                        if (vm.purchaseRequest.voucherLines.length === 0)
                            vm.addRow();

                    })
                    .finally(function () {
                        vm.loading = false;
                    });

            }

            

            init();
        }]);
