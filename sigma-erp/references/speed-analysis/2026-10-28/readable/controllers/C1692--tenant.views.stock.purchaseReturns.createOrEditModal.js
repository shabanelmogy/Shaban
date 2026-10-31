// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:466548-467009
appModule.controller('tenant.views.stock.purchaseReturns.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'purchaseReturnId', 'abp.services.app.directory', 'abp.services.app.purchaseReturn', 'abp.services.app.vehicle', 'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.agreement', '$filter', 'abp.services.app.chargesSetting', 'abp.services.app.account', 'abp.services.app.allocation',
        function ($scope, $uibModal, $uibModalInstance, purchaseReturnId, directoryService, purchaseReturnService, vehicleService, utilities, commonLookupService, appSession, agreementService, $filter, chargesSettingService, accountService, allocationService) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            var isValid = true;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            // vm.isCustomerFeature = abp.features.isEnabled("CRS.Fines.DubaiPolice")
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isMultiBranchStockEnabled = abp.features.isEnabled("Stock_MultiBranch");
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes');
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.taxAccepted = false;
            vm.isEnableDueAmount = true;
            vm.purchaseReturn = {
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
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });

            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });


            vm.getVoucherSubTypeName = function (id) {
                if (id == 42)
                    return app.localize("StockBill");
                else if (id == 61)
                    return app.localize("STOCK") + app.localize("GrnBill");
                else
                    return "";
            };

            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.amountMinValue = 100;

            vm.sumAmount = function (taxEditCheck) {

                if (vm.purchaseReturn == null)
                    return 0;

                if (vm.purchaseReturn.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.purchaseReturn.voucherLines.length; i++) {
                    if (vm.purchaseReturn.voucherLines[i].credit != null && vm.purchaseReturn.voucherLines[i].module == vm.enabledModule) {
                        sum = sum + parseFloat(vm.purchaseReturn.voucherLines[i].credit);


                        if (vm.isCustomer) {
                            if (vm.purchaseReturn.taxPercent > 0) {
                                var tax = 0;

                                // Check if voucherlines include chargesType or Account dropdown, if account  then no need of chargestype code.

                                if (vm.purchaseReturn.voucherLines[i].chargesType.taxable || vm.purchaseReturn.voucherLines[i].taxable) {
                                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                        //equation solved from following formula... 
                                        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                        var chargesWithoutTax = (vm.purchaseReturn.voucherLines[i].credit * 100) / (100 + vm.purchaseReturn.taxPercent);
                                        tax = utilities.round(vm.purchaseReturn.voucherLines[i].credit - chargesWithoutTax, 2);
                                        totalTax += utilities.round(tax, 2);
                                    } else {
                                        //prices are without tax. calculate tax and include in total
                                        tax = utilities.round(vm.purchaseReturn.voucherLines[i].credit * vm.purchaseReturn.taxPercent / 100, 2);
                                        totalTax += utilities.round(tax, 2);

                                        // vm.tripCharges[i].charges += utilities.round(tax,2);

                                    }
                                    vm.purchaseReturn.voucherLines[i].tax = tax;
                                    vm.purchaseReturn.voucherLines[i].taxable = true;
                                }
                                else {
                                    vm.purchaseReturn.voucherLines[i].tax = 0;
                                    vm.purchaseReturn.voucherLines[i].taxable = (vm.purchaseReturn.voucherLines[i].chargesType.taxable || vm.purchaseReturn.voucherLines[i].taxable);
                                }
                            }
                            else {
                                vm.purchaseReturn.voucherLines[i].tax = 0;
                                vm.purchaseReturn.voucherLines[i].taxable = (vm.purchaseReturn.voucherLines[i].chargesType.taxable || vm.purchaseReturn.voucherLines[i].taxable);
                            }
                        }
                        else {

                            //  tax = vm.purchaseReturn.voucherLines[i].tax == null ? 0 : vm.purchaseReturn.voucherLines[i].tax;
                            //  totalTax += utilities.round(tax, 2);





                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.purchaseReturn.voucherLines[i].credit * 100) / (100 + vm.purchaseReturn.taxPercent);
                                tax = utilities.round(vm.purchaseReturn.voucherLines[i].credit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = taxEditCheck == true ? vm.purchaseReturn.voucherLines[i].tax : utilities.round(vm.purchaseReturn.voucherLines[i].credit * vm.purchaseReturn.taxPercent / 100, 2)
                                // tax = utilities.round(vm.purchaseReturn.voucherLines[i].credit * vm.purchaseReturn.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                            }
                            vm.purchaseReturn.voucherLines[i].tax = tax;
                            vm.purchaseReturn.voucherLines[i].taxable = true;

                        }



                    }

                }


                vm.purchaseReturn.amountInWords = '';

                vm.purchaseReturn.tax = totalTax;
                vm.purchaseReturn.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.purchaseReturn.amount = utilities.round(vm.purchaseReturn.amount, 2);
                if (vm.purchaseReturn.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.purchaseReturn.amountInWords = utilities.toWords(vm.purchaseReturn.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };


            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.purchaseReturn.taxPercent = vm.taxPercent;
                else
                    vm.purchaseReturn.taxPercent = 0;
            };

            vm.onSupplierSelect = function () {
                if (!vm.purchaseReturn.contact) return null;

                vm.loading = true;
                vm.purchaseReturn.contactId = vm.purchaseReturn.contact.id;

                if (vm.isMultiCurrencyEnabled) {
                    if (vm.purchaseReturn.contact.currencyDto) {
                        vm.currencyCode = vm.purchaseReturn.contact.currencyDto.code;
                        vm.purchaseReturn.currencyId = vm.purchaseReturn.contact.currencyDto.id;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }
                getAllocations();

                if (vm.isEditMode && vm.purchaseReturnTaxPercent > 0) {
                    vm.purchaseReturn.taxPercent = vm.purchaseReturn.contact.isTaxExempted ? 0 : vm.purchaseReturnTaxPercent;
                    vm.purchaseReturn.isTaxExempted = vm.purchaseReturn.contact.isTaxExempted;
                }
                else {
                    vm.purchaseReturn.taxPercent = vm.purchaseReturn.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.purchaseReturn.isTaxExempted = vm.purchaseReturn.contact.isTaxExempted;
                }
                vm.sumAmount();
                vm.loading = false;
                //getAgreements(customer.id);
            };

            vm.moduleChanged = function () {
                getChargesTypes();
                vm.purchaseReturn.voucherLines = [];
                vm.purchaseReturn.amount = 0;
                vm.purchaseReturn.tax = 0;
                vm.purchaseReturn.amountInWords = null;
            };

            // search from dropdown
            vm.searchSuppliers = function ($select) {
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

            vm.manuallyAllocatedPopup = function (allocation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/purchaseReturns/allocatedNowOnItemModal.cshtml',
                    controller: 'tenant.views.stock.purchaseReturns.allocatedNowOnItemModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        allocation: function () {
                            return angular.copy(allocation);
                        },
                        purchaseReturnId: function () {
                            return purchaseReturnId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    allocation.manuallyAllocatedCharges = result;

                    var sumAllocated = 0.0;
                    //if (allocation.manuallyAllocatedCharges.length > 0) {
                    //    allocation.allocateFieldDisable = true;
                    //}

                    angular.forEach(allocation.manuallyAllocatedCharges, function (value, key) {
                        sumAllocated += value.allocateAmountWithTax ? utilities.round(value.allocateAmountWithTax, 2) : 0.0;
                    });

                    allocation.allocatedNow = utilities.round(sumAllocated, 2);

                    var dueAmount = utilities.round(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNow);
                    if (dueAmount < 0) {
                        vm.btnDisable = true;
                    } else {
                        vm.btnDisable = false;
                    }
                });
            };

            // extended search using search customer popup
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
                }).result.then(function (result) {
                    if (result != null) {
                        vm.onSupplierSelect(result);
                    }
                    getAllocations();
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

            // Saving purchaseReturn
            vm.save = function () {
                vm.saving = true;

                var date = new Date(vm.purchaseReturn.date);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                vm.purchaseReturn.date = date;

                if (vm.purchaseReturn.locationId == null || vm.purchaseReturn.locationId == 0) {
                    if (vm.locations.length == 1)
                        vm.purchaseReturn.locationId = vm.locations[0].id;
                }

                var allocations = [];
                angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                    allocations.push({
                        id: allocation.allocationId,
                        allocatedToVoucherLineId: allocation.voucherLineId,
                        amount: allocation.allocatedNow,
                        allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                        manuallyAllocatedCharges: allocation.manuallyAllocatedCharges
                    });
                });
                var itemAllocations = {
                    allocations: allocations
                };
                vm.purchaseReturn.itemAllocations = itemAllocations;

                vm.purchaseReturn.amount = vm.sumAmountAllocation();

                // In supplier case voucherLine will be empty from frontEnd Side
                vm.purchaseReturn.voucherLines = null;

                purchaseReturnService.createOrUpdatePurchaseReturn({ purchaseReturn: vm.purchaseReturn }
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
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
                var branchId = vm.isMultiBranchStockEnabled ? vm.purchaseReturn.locationId : null;

                allocationService.getAllocationsForEdit({
                    contactId: vm.purchaseReturn.contact.id,
                    voucherCategory: 1,
                    locationId: branchId,
                    //VoucherId: paymentId,
                    VoucherId: purchaseReturnId,
                }).success(function (data) {
                    vm.allocationData = data;
                    vm.allocationData.allocations = vm.allocationData.allocations.filter(e => e.voucherSubTypeId != 41); //exclude service bills
                });
            }

            function init() {
                getChargesTypes();
                getLocations();
                purchaseReturnService.getPurchaseReturnForEdit({ id: purchaseReturnId }).success(
                    function (result) {

                        vm.purchaseReturn = result;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.purchaseReturn.contact) {
                                if (vm.purchaseReturn.contact.currency)
                                    vm.currencyCode = vm.purchaseReturn.contact.currency.code;

                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;
                                }
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }
                        vm.isEditMode = purchaseReturnId > 0;
                        if (vm.isEditMode) {
                            vm.purchaseReturnTaxPercent = vm.purchaseReturn.taxPercent;
                            vm.enabledModule = vm.purchaseReturn.voucherLines[0].module;
                        }
                        else {
                            vm.purchaseReturn.taxPercent = vm.taxPercent;
                            vm.purchaseReturn.locationId = appSession.user.locationId;
                        }
                        //if (vm.purchaseReturn.voucherNo <= 0) {
                        //   // vm.purchaseReturn.voucherNo = null;

                        //}

                        //if (vm.purchaseReturn.voucherLines.length == 0)
                        //    vm.addRow();

                        if (result.contact != null) {
                            getAllocations();
                        }
                    });
            }
            init();
        }
    ]);
