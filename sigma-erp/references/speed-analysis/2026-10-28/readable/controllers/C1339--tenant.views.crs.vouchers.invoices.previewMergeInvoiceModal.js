// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360205-360346
appModule.controller('tenant.views.crs.vouchers.invoices.previewMergeInvoiceModal', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.invoiceSearch', 'utilities', '$filter', 'abp.services.app.invoice', 'appSession',  'options',
        function ($uibModal, $uibModalInstance, invoiceSearchService, utilities, $filter, invoiceService, appSession, options) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.invoice = null;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.autoCalculateAmountInWords = utilities.parseBoolean(abp.setting.get("App.General.AutoCalculateAmountInWords"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMergedInvoice = false;
            //vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'limo';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
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

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            //vm.getDueAmount = function () {
            //    if (vm.invoice == null) return 0;

            //    if (vm.invoice && vm.invoice.allocatedAmount && vm.invoice.allocatedAmount > 0) {
            //        return vm.invoice.amount - vm.invoice.allocatedAmount;
            //    } else {
            //        return 0;
            //    }
            //};

            vm.calculateRentWithOperator = function (agreementId) {

                if (!agreementId)
                    return;
                return vm.invoice.voucherLines.filter(e => e.agreementId == agreementId && (e.chargesTypeId == 1 || e.chargesTypeId == 70)).reduce((a, c) => a += c.credit, 0);
            }

            vm.calculateTaxWithOperator = function (agreementId) {

                if (!agreementId)
                    return;
                return vm.invoice.voucherLines.filter(e => e.agreementId == agreementId && (e.chargesTypeId == 1 || e.chargesTypeId == 70)).reduce((a, c) => a += c.tax, 0);
            }

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

            vm.generateMergeInvoice = function () {
                $uibModalInstance.close(vm.invoice);
                
            }
            function init() {
                vm.loading = true;
                if (options.invoicesToGenerate) {
                    invoiceService.previewEquipmentMergeInvoice({
                        invoicesDue: options.invoicesToGenerate,
                        IsMerge: vm.merge
                    }).success(function (data) {
                        vm.invoice = data;
                        vm.masterAgreementNo = options.invoicesToGenerate[0].masterAgreementNo;

                        //openViewInvoiceModal(mergeInvoicePreview);
                    vm.isMergedInvoice = vm.invoice.voucherSubTypeId == 46 && !vm.invoice.agreementId;
                    }).error(function (response) {
                        abp.message.error(response.error);
                        vm.saving = false;

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                //else {
                //    invoiceSearchService.getInvoiceForView({ id: invoiceId }).success(
                //        function (result) {
                //            vm.invoice = result;
                //            if (vm.invoice.voucherSubTypeId == 17) {
                //                angular.forEach(vm.invoice.voucherLines, function (value) {
                //                    if (value.assetId)
                //                        vm.assetId = value.assetId;
                //                });

                //                if (abp.auth.hasPermission("Pages.Tenant.Assets.Assets"))
                //                    getAssets(vm.assetId);
                //            };
                //            vm.isMergedRentalInvoice = vm.invoice.voucherSubTypeId == 1 && !vm.invoice.agreementId;
                //            vm.isMergedTollInvoice = vm.invoice.voucherSubTypeId == 8 && !vm.invoice.agreementId;
                //            if (vm.invoice.voucherSubTypeId == 2)
                //                getTrips(invoiceId)
                //        }).finally(function () {
                //            vm.loading = false;
                //        });
                //}
            }

            init();

        }]);
