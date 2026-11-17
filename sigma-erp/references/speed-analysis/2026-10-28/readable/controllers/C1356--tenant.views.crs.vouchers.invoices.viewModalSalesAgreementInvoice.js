// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:365390-365658
appModule.controller('tenant.views.crs.vouchers.invoices.viewModalSalesAgreementInvoice', [
        '$uibModal', '$uibModalInstance', 'invoiceId', 'abp.services.app.invoiceSearch', 'utilities', '$filter', 'abp.services.app.limoTrip', 'appSession', 'abp.services.app.asset', 'abp.services.app.costCenter', 'abp.services.app.commonLookup',
        function ($uibModal, $uibModalInstance, invoiceId, invoiceSearchService, utilities, $filter, limoTripService, appSession, assetService, costCenterService, commonLookupService) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.documents = [];
            vm.invoice = null;
            vm.agreementVehicles = '';
            vm.discountOnAssetForDisposal = abp.features.isEnabled("CRS.CustomFeatures.DiscountOnAssetForDisposal");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.autoCalculateAmountInWords = utilities.parseBoolean(abp.setting.get("App.General.AutoCalculateAmountInWords"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMergedRentalInvoice = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.currencyCode = '';
            vm.selectChargesTypeInMiscInvoice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SelectChargesTypeInMiscInvoice"));
            //vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'limo';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForInvoices");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isInvoiceTnCNotesEnabled = utilities.parseBoolean(abp.setting.get("App.General.InvoiceTermsAndConditionsNotes"));
            vm.markDisputed = abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.MarkDisputed');
            vm.unMarkDisputed = abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.UnmarkDisputed');
            vm.isEquipmentRentalEnabled = abp.features.isEnabled("ERS");
            var isCustomizeCurrencyDecimalsEnabled = abp.features.isEnabled("Core.CustomizeCurrencyDecimals");
            vm.currencyDecimals = parseInt(abp.setting.get("App.General.CurrencyDecimals"));
            vm.isAllowQuatityAndPriceForMiscVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowQuatityAndPriceForMiscVoucherLine"));

            vm.locations = [];
            if (vm.isPostTaxInclusive) {
                vm.isTaxInclusive = false;
            }
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
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
                }, true).length + 3;
                return foundLines;
            };
            vm.chargesTypeVoucherLineRepeat = function (value) {
                if (vm.invoice.voucherLines.length > 1 && value.chargesTypeId == 24) {
                    return true;
                };
                return false;
            };
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;
                return utilities.round(value, 2);

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
            vm.modules = [];

            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });


            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;
            vm.moduleChanged = function () {
                getChargesTypes();
                vm.invoice.voucherLines = [];
                vm.invoice.amount = 0;
                vm.invoice.tax = 0;
                vm.invoice.amountInWords = null;

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
            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }
            function getAssets(assetId) {
                vm.loading = true;
                assetService.getAssetForEdit({ id: vm.assetId }).success(function (result) {
                    vm.asset = result;

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
                }).finally(function () {
                    vm.loading = false;
                });
            }

            //vm.getDueAmount = function () {
            //    if (vm.invoice == null) return 0;

            //    if (vm.invoice && vm.invoice.allocatedAmount && vm.invoice.allocatedAmount > 0) {
            //        return vm.invoice.amount - vm.invoice.allocatedAmount;
            //    } else {
            //        return 0;
            //    }
            //};

            vm.openViewAllocationsModal = function (invoiceId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/allocationsViewModel.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.allocationsViewModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });
            };

            function init() {
                vm.loading = true;
                getLocations();
                if (vm.isCostCenterEnabled)
                    getCostCenters();
                invoiceSearchService.getSalesAgreementInvoiceForView({ id: invoiceId }).success(
                    function (result) {
                        vm.invoice = result;
                        if (vm.invoice.agreement.agreementVehicles.length > 0) {
                            vm.agreementVehicles = vm.invoice.agreement.agreementVehicles.map(v => v.vehicle.plateNo).join(", ");
                        }
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.invoice.contact.currency) {
                                vm.currencyCode = vm.invoice.contact.currency.code;
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.invoice.contact) {
                                    currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                                    decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                                }
                            }
                            if (vm.autoCalculateAmountInWords == "true")
                                vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);

                            if (vm.invoice.contact) {
                                currencyName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.name : null;
                                decimalName = vm.invoice.contact.currencyDto ? vm.invoice.contact.currencyDto.decimalName : null;
                            }

                            if (vm.autoCalculateAmountInWords == "true")
                                vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount, currencyName, decimalName);

                        }

                        vm.documents = vm.invoice.voucherDocuments;
                        if (vm.isEquipmentRentalEnabled) {
                            if (!(vm.invoice.fromDate && vm.invoice.toDate))
                                vm.oneTime = true;
                        }
                        var costCenterInVoucherLines = vm.invoice.voucherLines.find(e => e.costCenter2Id != null);
                        if (costCenterInVoucherLines)
                            vm.costCenter2Id = costCenterInVoucherLines.costCenter2Id;
                        if (vm.invoice.voucherSubTypeId == 17) {
                            angular.forEach(vm.invoice.voucherLines, function (value) {
                                if (value.assetId)
                                    vm.assetId = value.assetId;
                            });

                            if (abp.auth.hasPermission("Pages.Tenant.Assets.Assets"))
                                getAssets(vm.assetId);
                        };
                        vm.isMergedRentalInvoice = vm.invoice.voucherSubTypeId == 1 && !vm.invoice.agreementId;
                        vm.isMergedEquipmentInvoice = vm.invoice.voucherSubTypeId == 46 && !vm.invoice.agreementId;
                        vm.isMergedTollInvoice = vm.invoice.voucherSubTypeId == 8 && !vm.invoice.agreementId;
                        if (vm.invoice.voucherSubTypeId == 2)
                            getTrips(invoiceId)
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();

        }]);
