// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360095-360202
appModule.controller('tenant.views.crs.vouchers.invoices.posInvoiceviewModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'invoiceId', 'abp.services.app.agreement',
        'abp.services.app.directory', 'abp.services.app.invoice','utilities',
        '$filter','abp.services.app.limoTrip','appSession','abp.services.app.posInvoice',
        function ($scope, $uibModal, $uibModalInstance, invoiceId, agreementService,
            directoryService, invoiceService, utilities, $filter, limoTripService,
            appSession, posInvoiceService) {
            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.invoice = null;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.autoCalculateAmountInWords = utilities.parseBoolean(abp.setting.get("App.General.AutoCalculateAmountInWords"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() === 'eastcoast';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMergedRentalInvoice = false;
            //vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'limo';
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
                    if (item.refNo === vm.invoice.voucherLines[0].refNo)
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
            function getTrips(invoiceId) {
                vm.loading = true;
                limoTripService.getInvoiceTrips({
                    id: invoiceId,
                }).success(function (result) {
                    vm.trips = result.items;
                    vm.invoice.voucherLines.forEach(function (value) {
                        if (value.chargesTypeId === 24) {
                            var refNoInt = parseInt(value.refNo);
                            var foundLines = $filter('filter')(vm.trips, {
                                tripNo: refNoInt,
                            }, true);
                            if (foundLines.length === 1) {
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



            function init() {
                vm.loading = true;
                posInvoiceService.getPosInvoiceForView({ id: invoiceId }).success(
                    function (result) {
                        vm.invoice = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
              
            }

            init();
        }
    ]);
