// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:496641-497111
appModule.controller('tenant.views.workshop.workOrders.createOrEditModal', ['abp.services.app.workOrder', '$uibModal', 'options', '$uibModalInstance', 'abp.services.app.vehicle',
        'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities', 'appSession', 'abp.services.app.item', 'abp.services.app.unitOfMeasure',
        function (workOrderService, $uibModal, options, $uibModalInstance, vehicleService, directoryService, commonLookupService,
            utilities, appSession, itemAppService, unitOfMeasureAppService) {
            var vm = this;
            vm.vehicles = [];
            vm.customers = [];
            vm.locations = [];
            vm.saveAndPrint = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.duplicateChassisNumberAlertOnJobCard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DuplicateChassisNumberAlertOnJobCard"));
            vm.branchTaxPercentage = null;
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.AllActionsOnOtherBranchWorkOrders');
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.workOrder = {};


            function workOrdersLineObject() {

                var line = new Object();
                line.expenseTypeId = null;
                line.description = '';
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

            vm.searchCustomer = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search contact popup
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
                }).result.then(function (customer) {
                    if (customer !== null) {
                        vm.workOrder.contact = customer;
                        vm.workOrder.contactId = customer.id;
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
                    vm.workOrder.requestedBy = requestedBy;
                    vm.workOrder.requestedById = requestedBy.id;
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            //Add row
            vm.addRow = function () {
                vm.workOrder.voucherLines.push(workOrdersLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.workOrder.voucherLines.indexOf(obj);
                vm.workOrder.voucherLines.splice(index, 1);
                vm.sumAmountTax();
            };


            vm.clearOrder = function () {
                vm.workOrder.discount = 0;
                vm.workOrder.amountInWords = "";
                vm.workOrder.amount = 0;
                vm.workOrder.taxPercent = vm.taxPercent;
                vm.withoutDiscountAmount = 0;
                vm.workOrder.tax = 0;

                vm.workOrder.voucherLines = [];

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


            vm.changeTaxOnSupplier = function () {
                if (vm.workOrder.contact.isTaxExempted) {
                    vm.workOrder.taxPercent = 0;
                    vm.workOrder.voucherLines.forEach(row => {
                        vm.calculateTaxPerRow(row);
                    });
                }
                if (vm.isTaxCodeEnabled && !vm.workOrder.contact.isTaxExempted) {
                    vm.setTaxPercentOnTaxCode();
                    vm.workOrder.voucherLines.forEach(row => {
                        vm.calculateTaxPerRow(row);
                    });
                }
            };
            vm.setTaxPercentOnTaxCode = function () {
                if (vm.isTaxCodeEnabled) {
                    vm.workOrder.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                    if (vm.workOrder.contact.taxCodeId > 0) {
                        vm.workOrder.taxPercent = vm.workOrder.contact.taxCode.taxPercent;
                        vm.taxPercent = vm.workOrder.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.workOrder.taxPercent = vm.branchTaxPercentage;
                    }
                }
            }

            vm.calculateTaxPerRow = function (row) {

                if (vm.workOrder === null)
                    return 0;

                if (row === null)
                    return 0;

                if (row.debit !== null) {
                    if (vm.workOrder.taxPercent > 0) {
                        var tax = 0;
                        if (row.taxable || !row.taxable) {
                            if (vm.isTaxInclusive) { // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                var chargesWithoutTax = (row.debit * 100) / (100 + vm.workOrder.taxPercent);
                                tax = utilities.round(row.debit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.debit * vm.workOrder.taxPercent / 100, 2);
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

                if (vm.workOrder === null)
                    return 0;

                if (vm.workOrder.voucherLines === null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.workOrder.voucherLines.length; i++) {
                    if (vm.workOrder.voucherLines[i].debit !== null) {
                        sum = sum + parseFloat(vm.workOrder.voucherLines[i].debit);

                        if (vm.workOrder.taxPercent > 0) {
                            var tax = 0;

                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.workOrder.voucherLines[i].debit * 100) / (100 + vm.workOrder.taxPercent);
                                tax = utilities.round(vm.workOrder.voucherLines[i].debit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(vm.workOrder.voucherLines[i].debit * vm.workOrder.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            vm.workOrder.voucherLines[i].tax = tax;
                            if (tax > 0)
                                vm.workOrder.voucherLines[i].taxable = true;
                        }
                        else {
                            vm.workOrder.voucherLines[i].tax = 0;
                            vm.workOrder.voucherLines[i].taxable = false;
                        }
                    }
                }

                vm.workOrder.amountInWords = '';

                vm.workOrder.tax = totalTax;
                vm.workOrder.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                vm.workOrder.amount = utilities.round(vm.workOrder.amount, 2);
                if (vm.workOrder.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.workOrder.amountInWords = utilities.toWords(vm.workOrder.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;

                vm.workOrder.voucherLines.forEach(function (value) {

                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;

                });

                vm.workOrder.tax = totalTax;
                vm.withoutDiscountAmount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.withoutDiscountAmount = utilities.round(vm.withoutDiscountAmount, 2);
                if (vm.workOrder.discount !== null) {
                    vm.workOrder.amount = vm.withoutDiscountAmount - vm.workOrder.discount;
                }
                else {
                    vm.workOrder.amount = vm.withoutDiscountAmount;
                }
                if (vm.workOrder.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.workOrder.amountInWords = utilities.toWords(vm.workOrder.amount);
                }
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
            vm.checkChassisNo = function () {
                if (vm.duplicateChassisNumberAlertOnJobCard) {
                    workOrderService.checkDuplicateChassisNo(vm.workOrder.voucherLines[0].vehicle.chassisNo)
                            .then(function (response) {
                                if (response.data) {
                                    if (!vm.isEditMode || vm.originalChassisNo !== vm.workOrder.voucherLines[0].vehicle.chassisNo) {
                                        abp.message.confirm(
                                            app.localize('DuplicateChassisNumber'),
                                            app.localize('DoYouWantToProceed'),
                                            function (isConfirmed) {
                                                if (isConfirmed) {
                                                    vm.save();
                                                }
                                            }
                                        );
                                    } else {
                                        vm.save();
                                    }
                                } else {
                                    vm.save();
                                }
                            });
                }
                else {
                    vm.save();
                }
            };

            vm.save = function () {
                if (vm.locations.length === 1) vm.workOrder.locationId = vm.locations[0].id;
                vm.saving = true;
                workOrderService.createOrUpdateWorkOrder({ workOrder: vm.workOrder }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.workOrder.id = result.id;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.workOrder.id);
                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            var saveAndPrint = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/workOrders/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.workOrders.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        workOrderId: function () {
                            return id;
                        }
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                getLocations();
                vm.branchTaxCode();
                vm.loading = true;
                workOrderService.getWorkOrderForEdit({ id: options.workOrderId }).success(
                    function (result) {
                        vm.workOrder = result;
                        vm.workOrder.date = moment().startOf('day');

                        vm.withoutDiscountAmount = vm.workOrder.amount + vm.workOrder.discount;
                        if (options.contact) {
                            vm.workOrder.contact = options.contact;
                            vm.workOrder.contactId = options.contact.id;
                        }
                        if (options.serviceItems) {
                            options.serviceItems.forEach(function (value) {

                                vm.workOrder.voucherLines.push({
                                    expenseTypeId: null,
                                    description: value.name,
                                    debit: null,
                                    credit: null,
                                    vehicleId: options.vehicle.id,
                                    vehicle: options.vehicle
                                });

                            });
                        }

                        if (vm.workOrder.id < 1) {
                            vm.isEditMode = false;
                            vm.workOrder.voucherNo = null;
                            vm.workOrder.locationId = appSession.user.locationId;
                            vm.workOrder.taxPercent = vm.taxPercent;
                            // vm.workOrder.voucherSubTypeId = 38;
                        } else {
                            vm.isEditMode = true;
                            if (vm.isEditMode && vm.workOrder.voucherLines.length > 0) {
                                vm.originalChassisNo = vm.workOrder.voucherLines[0].vehicle.chassisNo;
                            }
                        }

                        if (vm.workOrder.voucherLines.length === 0)
                            vm.addRow();

                        if (options.workOrder && !vm.isEditMode) {

                            var workOrder = angular.copy(options.workOrder);

                            vm.bill.contactId = workOrder.contact.id;
                            vm.bill.contact = workOrder.contact;
                            vm.bill.parentVoucherId = workOrder.id;
                            vm.bill.voucherLines = [];
                            vm.bill.taxPercent = vm.taxPercent;

                            angular.forEach(workOrder.voucherLines, function (workOrderline) {

                                if (workOrderline.debit > 0) {
                                    var billine = billLineObject();

                                    billine.description = workOrderline.description;
                                    billine.vehicleId = workOrderline.vehicleId;
                                    billine.vehicle = workOrderline.vehicle;
                                    billine.debit = workOrderline.debit;

                                    vm.bill.voucherLines.push(billine);
                                }
                            });

                            vm.sumAmount();
                        }

                    })
                    .finally(function () {
                        //    if (vm.workOrder) {
                        //        vm.sumAmount();
                        //        vm.sumAmountTax();
                        //    }
                        vm.loading = false;
                    });
            }

            vm.getUnitOfMeasures();

            init();
        }]);
