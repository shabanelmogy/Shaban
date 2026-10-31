// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329821-330328
appModule.controller('tenant.views.crs.vouchers.creditNotes.createOrEditBulkModal', [
        '$uibModal', '$uibModalInstance', 'creditNoteId', 'agreement', 'abp.services.app.directory', 'abp.services.app.creditNote', 'utilities', 'abp.services.app.allocation', 'abp.services.app.commonLookup', 'abp.services.app.agreementGroup', 'appSession',
        function ($uibModal, $uibModalInstance, creditNoteId, agreement, directoryService, creditNoteService, utilities, allocationService, commonLookupService, agreementGroupService,appSession) {
        var vm = this;
        vm.loading = false;
        vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");
        vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
        vm.isReasonEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Reason"));
        vm.isReasonNoteEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ReasonNote"));
        vm.manualCreditNoteNo = utilities.parseBoolean(abp.setting.get("App.General.ManualCreditNoteNo"));
        vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes');
        vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
        vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
        vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
        vm.btnDisable = true;

        vm.saveAndPrint = false;
        vm.taxAccepted = false;
        vm.isCustomer = true;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

        vm.isRentalEnabled = abp.features.isEnabled("CRS.Rental");
        vm.isEquipmentRentalEnabled = abp.features.isEnabled("ERS");
        vm.isEquipmentLeaseEnabled = abp.features.isEnabled("ERS.Lease");
        vm.isFmsEnable = abp.features.isEnabled("FMS");
        vm.isLimoEnabled = abp.features.isEnabled("CRS.Limo");
        vm.recoveryAndChauffeurMiscInvoice = abp.features.isEnabled("CRS.Vouchers.Invoices.RecoveryAndChauffeurMiscInvoice");
        vm.isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
        vm.isAssetEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
        vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
        vm.isTransportationEnabled = abp.features.isEnabled("CRS.Transportation");
        vm.stockSaleInvoice = abp.features.isEnabled("CRS.CustomFeatures.StockSaleInvoice");
        vm.isChauffeurEnabled = abp.features.isEnabled("CRS.Chauffeur");
        vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
        vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik"); //&& abp.setting.get("App.General.TollsInvoice") == 2;
        vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");// && abp.setting.get("App.General.DarbTollsInvoice") == 2;
        vm.isFineModeEnabled = (abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar") || abp.features.isEnabled("CRS.Fines")); //abp.setting.get("App.General.TrafficFineInvoice") == 2
        vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
        vm.isAccessoriesEnabled = abp.features.isEnabled("CRS.AccessoriesRental");
        vm.isAgreementGroups = abp.features.isEnabled("Core.AgreementGroups");
        vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Invoices");
        vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");

        vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
        vm.isChargeCardEnabled = abp.features.isEnabled("OnlinePayments.Customer.ChargeCard");
        vm.isRequestPaymentAfterCreationEnabled = abp.features.isEnabled("OnlinePayments.Invoice.RequestPaymentAfterCreation");
        vm.oneTimePaymentAfterCardAdd = abp.features.isEnabled("OnlinePayments.Invoice.OneTimePaymentAfterCardAdd");

        vm.isERSLeaseEnabled = abp.features.isEnabled("ERS.Lease");
        vm.isERSRentalInvoiceEnabled = abp.features.isEnabled("ERS.Rental");
        vm.isAccidentModuleEnabled = abp.features.isEnabled("CRS.Accident");
        vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.isAgreementGroups = abp.auth.hasPermission('Pages.Tenant.AgreementGroups');
        vm.agreementAdditionalCharges = abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges');
        vm.agreementAdditionalChargesAfterClosing = abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalChargesAfterClosing');
        vm.vehicle_EnableMortgage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Mortgage"));
        vm.vehicle_EnableLeaseToOwn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseToOwn"));

        vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
        vm.IsInvoiceCommision = utilities.parseBoolean(abp.setting.get("App.General.InvoiceCommission"));
        vm.makeReceiptOptionalInAdvanceTaxInvoice = utilities.parseBoolean(abp.setting.get("App.General.MakeReceiptOptionalInAdvanceTaxInvoice"));
        vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
        vm.contactCategories = [{ id: 1, name: app.localize('Individuals') }, { id: 2, name: app.localize('Companies') }];
        vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
        vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
        vm.allowPrintingOfVoidedVouchers = abp.setting.getBoolean("App.General.AllowPrintingOfVoidedVouchers");
        vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
        vm.isTaxEnabled = abp.features.isEnabled('CRS.Tax');
        vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
        vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
        vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.Invoices");
        vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");

        vm.filters = {
            enableDateRange: true,
            agreementGroup: null,
            agreementGroupId: null
        }
        vm.invoiceTypes = [];

        vm.dateRangeModelChange = function () {
            //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
            //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');

            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
        };

        vm.dateRangeCheck = () => {
            if (!vm.filters.enableDateRange) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            } else {
                vm.dateRangeModelChange();
            }
        }

        vm.searchAgreementGroup = function () {

            return agreementGroupService.getAgreementGroups().then(function (response) {
                vm.agreementGroups = response.data.items;
            });
        };

        vm.localize = function (input) {
            return app.localize(input);
        };
        vm.rounding = function (value) {
            return utilities.round(value, 2);
        };
        // ... Converting Amount To Amount In Words ... ///

        vm.amountMinValue = 100;
        vm.customerSettings = function (customer) {
            vm.isCustomer = true;
            if (customer != 2) {
                vm.isCustomer = false;
            }
        };
        // American Numbering System
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        // uncomment this line for English Number System
        // var th = ['','thousand','million','milliard','billion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        function toWords(s) {
            s = s + '';
            s = s.replace(/[\, ]/g, '');
            if (s != parseFloat(s)) return 'not a number';
            var x = s.indexOf('.');
            if (x == -1) x = s.length;
            if (x > 15) return 'too big';
            var n = s.split('');
            var str = '';
            var sk = 0;
            for (var i = 0; i < x; i++) {
                if ((x - i) % 3 == 2) {
                    if (n[i] == '1') {
                        str += tn[Number(n[i + 1])] + ' ';
                        i++;
                        sk = 1;
                    } else if (n[i] != 0) {
                        str += tw[n[i] - 2] + ' ';
                        sk = 1;
                    }
                } else if (n[i] != 0) {
                    str += dg[n[i]] + ' ';
                    if ((x - i) % 3 == 0) str += 'hundred ';
                    sk = 1;
                }
                if ((x - i) % 3 == 1) {
                    if (sk) str += th[(x - i - 1) / 3] + ' ';
                    sk = 0;
                }
            }
            if (x != s.length) {
                var y = s.length;
                str += 'point ';
                for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
            }
            return str.replace(/\s+/g, ' ') + 'only';
        }

        vm.sumAmountAllocation = function (allocations) {
            if (allocations && allocations.length == 0)
                return 0;

            var amount = 0;
            
            angular.forEach(allocations, function (value, key) {
                if (value.allocatedNow > 0)
                {
                    value.allocatedNow = vm.rounding(value.allocatedNow)
                    amount = amount + value.allocatedNow;
                }
                    
            });
            //if (amount <= 0)
            //    vm.creditNote.amountInWords = '';
            //if (amount > 0)
            //    vm.creditNote.amountInWords = toWords(vm.rounding(amount));
            return amount;
        };

        vm.amountInWords = (amount) => {
            return toWords(vm.rounding(amount));
        }

        vm.getCustomersAllocations = (filters) => {
            vm.customersAllocationsLoading = true;
            var voucherTypesFilter = [
                1, // Invoice,
                7 // opening Balance
            ];
            allocationService.getAllocationsForBulkEdit({
                voucherCategory: 2,
                voucherTypesFilter: voucherTypesFilter,
                ...filters
            }).success(function (data) {
                vm.customersAllocations = data;
            }).finally(function () {
                vm.customersAllocationsLoading = false;
            });
        }

        function getVoucherReasons() {
            vm.voucherReasonsLoading = true;
            commonLookupService.getVoucherReasons().success(function (result) {
                vm.voucherReasons = result.items;
            }).finally(() => {
                vm.voucherReasonsLoading = false;
            })
        };

        function getLocations() {
            vm.locationsLoading = true;
            commonLookupService.getLocations({}).success(function (data) {
                vm.locations = data.items;
            }).finally(() => {
                vm.locationsLoading = false;
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

        function getInvoiceTypes() {
            if (vm.isRentalEnabled)
                vm.invoiceTypes.push({ name: app.localize("RentalInvoice"), id: 1 });
            if (vm.isSalikModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("SalikInvoice"), id: 8 });
            if (vm.isDarbModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("DarbTollInvoice"), id: 63 });
            if (vm.isERSRentalInvoiceEnabled)
                vm.invoiceTypes.push({ name: app.localize("EquipmentInvoice"), id: 46 });
            //if (vm.isFineModeEnabled)
            //    vm.invoiceTypes.push({ name: app.localize("FineInvoice"), id: 7 });
            if (vm.isLimoEnabled)
                vm.invoiceTypes.push({ name: app.localize("LimousineInvoice"), id: 2 });
            if (vm.isLeaseEnabled) {
                vm.invoiceTypes.push({ name: app.localize("LeaseInvoice"), id: 14 });
                if (vm.stockSaleInvoice)
                    vm.invoiceTypes.push({ name: app.localize("StockSaleInvoice"), id: 67 });
                if (vm.agreementAdditionalCharges || vm.agreementAdditionalChargesAfterClosing)
                    vm.invoiceTypes.push({ name: app.localize("AdditionalChargesInvoice"), id: 24 });
            }
            //if (vm.isERSLeaseEnabled)
            //    vm.invoiceTypes.push({ name: app.localize("EquipmentLeaseInvoice"), id: 47 });
            if (vm.isTransportationEnabled)
                vm.invoiceTypes.push({ name: app.localize("TransportationInvoice"), id: 16 });
            if (vm.isAssetsModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("AssetSaleInvoice"), id: 17 });

            if (vm.isRentalEnabled || vm.isLeaseEnabled)
                vm.invoiceTypes.push({ name: app.localize("FuelInvoice"), id: 29 });
            if (vm.isChauffeurEnabled)
                vm.invoiceTypes.push({ name: app.localize("ChauffeurInvoice"), id: 34 });
            if (vm.isWorkshopEnabled)
                vm.invoiceTypes.push({ name: app.localize("WorkshopInvoice"), id: 37 });
            if (vm.isAccessoriesEnabled)
                vm.invoiceTypes.push({ name: app.localize("AccessoriesInvoice"), id: 55 });
            if (vm.isAccidentModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("ExcessChargesInvoice"), id: 57 });
            if (vm.isExcessKMsInvoiceEnabled)
                vm.invoiceTypes.push({ name: app.localize("ExcessKMsInvoice"), id: 60 });
            if (vm.isAccountsEnabled && vm.isTaxEnabled)
                vm.invoiceTypes.push({ name: app.localize("AdvanceTaxInvoice"), id: 65 });

            //vm.invoiceTypes.push({ name: app.localize("MiscellaneousInvoice"), id: 9 });
            //vm.invoiceTypes.push({ name: app.localize("RecoveryInvoice"), id: 74 });
            //vm.invoiceTypes.push({ name: app.localize("ChaufferInvoice"), id: 75 });
            vm.invoiceTypes.push({ name: app.localize("DamageInvoice"), id: 30 });
            vm.invoiceTypes.push({ name: app.localize("FleetAssignmentInvoice"), id: 33 });
        };

        vm.manuallyAllocatedPopup = function (allocation) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/allocatedNowOnChargesTypeModal.cshtml',
                controller: 'tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    allocation: function () {
                        return angular.copy(allocation);
                    },
                    creditNoteId: function () {
                        //return vm.isEditedMode ? vm.creditNote.id : null;
                        return null;
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

                var dueAmount = utilities.round(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNow, 2);
                if (dueAmount < 0) {
                    vm.btnDisable = true;
                } else {
                    vm.btnDisable = false;
                }
            });
        };

        vm.searchAllocationsPopup = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/searchAllocations.cshtml',
                controller: 'tenant.views.crs.vouchers.creditNotes.searchAllocations as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                }
            });
            modalInstance.result.then(function (result) {
                let invoiceTypes = result.invoiceTypes ? result.invoiceTypes.map(x => x.id) : [];
                vm.getCustomersAllocations({ ...result, invoiceTypes });
            });
        };

        vm.searchAllocations = () => {
            let invoiceTypes = vm.filters.invoiceTypes ? vm.filters.invoiceTypes.map(x => x.id) : [];
            vm.getCustomersAllocations({ ...vm.filters, invoiceTypes });
        }

        function getAllLocations() {
            vm.getAllLocationsLoading = true;
            commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                vm.locationsAll = data.items;
            }).finally(() => {
                vm.getAllLocationsLoading = false;
            });
        }

        vm.toggleBtnDisable = () => {
            for (let p in vm.customersAllocations.customersAllocations) {
                if (vm.customersAllocations.customersAllocations.hasOwnProperty(p)) {
                    let allocationsData = vm.customersAllocations.customersAllocations[p];
                    if (allocationsData.length < 1) {
                        continue;
                    }
                    vm.creditNote.amount = vm.rounding(vm.sumAmountAllocation(allocationsData));
                    if (vm.creditNote.amount > 0) {
                        vm.btnDisable = false;
                        break;
                    } else {
                        vm.btnDisable = true;
                    }
                }
            }
        }

        // Saving CreditNode
        vm.save = async function () {
            for (let p in vm.customersAllocations.customersAllocations) {
                if (vm.customersAllocations.customersAllocations.hasOwnProperty(p)) {
                    let allocationsData = vm.customersAllocations.customersAllocations[p];
                    if (allocationsData.length < 1) {
                        continue;
                    }
                    vm.saving = true;
                    var allocations = [];
                    vm.creditNote.id = 0;
                    vm.creditNote.contactId = allocationsData[0].voucherContact.id;
                    //vm.creditNote.amount = vm.sumAmountAllocation(allocationsData);
                    vm.creditNote.amount = vm.rounding(vm.sumAmountAllocation(allocationsData));
                    if (vm.locations.length == 1) vm.creditNote.locationId = vm.locations[0].id;
                    angular.forEach(allocationsData, function (allocation, key) {
                        allocations.push({
                            id: allocation.allocationId,
                            allocatedToVoucherLineId: allocation.voucherLineId,
                            amount: allocation.allocatedNow,
                            allocatedList: allocation.allocatedList ? allocation.allocatedList : null,
                            //allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                            voucherType: allocation.voucherType,
                            description: allocation.description,
                            notes: allocation.notes,
                            manuallyAllocatedCharges: allocation.manuallyAllocatedCharges
                        });
                    });
                    var anyNegativeDueAmount = utilities.checkNegativeDueAmounts(allocationsData);
                    if (anyNegativeDueAmount) {
                        vm.saving = false;
                        abp.message.info("One or more due Amounts contain less than zero amount");
                        return;
                    }
                    //vm.payment.allocations = allocations;
                    var creditNoteAllocations = {
                        allocations: allocations
                    }
                    vm.creditNote.creditNoteAllocations = creditNoteAllocations;
                    //creditNoteService.createOrUpdateCreditNote({ creditNote: vm.creditNote }
                    //).success(function (result) {
                    //    debugger;
                    //    abp.notify.info(app.localize('SavedSuccessfully'));
                    //    vm.creditNote.id = result;
                    //    if (vm.saveAndPrint)
                    //        saveAndPrint(vm.creditNote.id);
                    //    //$uibModalInstance.close();
                    //}).finally(function () {
                    //    vm.saving = false;
                    //});

                    if (vm.creditNote.amount > 0) {
                        try {
                            let result = await creditNoteService.createOrUpdateCreditNote({ creditNote: vm.creditNote });
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            vm.creditNote.id = result;
                            if (vm.saveAndPrint)
                                saveAndPrint(vm.creditNote.id);
                        } catch (e) {
                        } finally {
                            vm.saving = false;
                        }
                    }
                }
            }

            $uibModalInstance.close();
            
            //vm.saving = true;
            //var allocations = [];
            //vm.creditNote.amount = vm.sumAmountAllocation();
            //vm.creditNote.amount = vm.rounding(vm.creditNote.amount);
            //if (agreement)
            //    vm.creditNote.agreementId = agreement.id;
            //if (vm.locations.length == 1) vm.creditNote.locationId = vm.locations[0].id;
            //angular.forEach(vm.allocationData.allocations, function (allocation, key) {
            //    allocations.push({
            //        id: allocation.allocationId,
            //        allocatedToVoucherLineId: allocation.voucherLineId,
            //        amount: allocation.allocatedNow,
            //        allocatedList: allocation.allocatedList ? allocation.allocatedList : null,
            //        allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
            //        voucherType: allocation.voucherType,
            //        description: allocation.description,
            //        notes: allocation.notes,
            //        manuallyAllocatedCharges: allocation.manuallyAllocatedCharges
            //    });
            //});
            //var anyNegativeDueAmount = utilities.checkNegativeDueAmounts(vm.allocationData.allocations);
            //if (anyNegativeDueAmount) {
            //    vm.saving = false;
            //    abp.message.info("One or more due Amounts contain less than zero amount");
            //    return;
            //}
            ////vm.payment.allocations = allocations;
            //var creditNoteAllocations = {
            //    allocations: allocations
            //}
            //vm.creditNote.creditNoteAllocations = creditNoteAllocations;
            //creditNoteService.createOrUpdateCreditNote({ creditNote: vm.creditNote }
            //).success(function (result) {
            //    abp.notify.info(app.localize('SavedSuccessfully'));
            //    vm.creditNote.id = result;
            //    if (vm.saveAndPrint)
            //        saveAndPrint(vm.creditNote.id);
            //    $uibModalInstance.close();
            //}).finally(function () {
            //    vm.saving = false;
            //});
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function init() {
            vm.loading = true;
            getInvoiceTypes();
            getLocations();
            getAllLocations();
            //vm.getCustomersAllocations();
            getVoucherReasons();
            vm.creditNote = {};

            if (vm.isAgreementGroups) {
                vm.searchAgreementGroup();
            }
        }
        init();
    }
    ]);
