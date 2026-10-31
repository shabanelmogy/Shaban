// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:364089-364281
appModule.controller('tenant.views.crs.vouchers.invoices.reportTwo', ['$scope', '$stateParams', 'abp.services.app.invoiceCustomReport', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, invoiceCustomReportService, $stateParams, commonLookupService, utilities) {
            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            //vm.filters = $stateParams.filters;
            if (vm.filters.voucherNo) {
                vm.filters.agreementNo = null;
                vm.filters.locationId = null;
                vm.filters.invoiceType = null;
                vm.filters.customer = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
            else if (vm.filters.agreementNo) {
                vm.filters.locationId = null;
                vm.filters.invoiceType = null;
                vm.filters.customer = null;
                //vm.filters.fromDate = null;
                //vm.filters.toDate = null;
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getStatuses = function (id) {
                if (id == 1) return app.localize("Open");
                if (id == 2) return app.localize("Closed");
            };

            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1)
                    return app.localize("Rental");
                if (voucherSubTypeId == 8)
                    return app.localize("Salik");
                if (voucherSubTypeId == 7)
                    return app.localize("Fines");
                if (voucherSubTypeId == 2)
                    return app.localize("Limousine");
                if (voucherSubTypeId == 9)
                    return app.localize("Miscellaneous");
                if (voucherSubTypeId == 16)
                    return app.localize("TransportationInvoice");
                if (voucherSubTypeId == 14)
                    return app.localize("LeaseInvoice");
                if (voucherSubTypeId == 17)
                    return app.localize("AssetSaleInvoice");

            };
            function getInvoiceType(voucherSubTypeId) {
                if (voucherSubTypeId == 1)
                    vm.invoiceType = app.localize("Rental");
                if (voucherSubTypeId == 8)
                    vm.invoiceType = app.localize("Salik");
                if (voucherSubTypeId == 7)
                    vm.invoiceType = app.localize("Fines");
                if (voucherSubTypeId == 2)
                    vm.invoiceType = app.localize("Limousine");
                if (voucherSubTypeId == 9)
                    vm.invoiceType = app.localize("Miscellaneous");
                if (voucherSubTypeId == 16)
                    vm.invoiceType = app.localize("TransportationInvoice");
                if (voucherSubTypeId == 14)
                    vm.invoiceType = app.localize("LeaseInvoice");
                if (voucherSubTypeId == 17)
                    vm.invoiceType = app.localize("AssetSaleInvoice");
            }
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            };
            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            vm.getStatus = function (id) {
                return utilities.getVoucherStatuses(id);
            };

            vm.exportToExcel = function (tableId) {
                vm.loading = true;
                invoiceCustomReportService.exportToExcelLimoInvoices(vm.filters)
                                    .success(function (result) {
                                        app.downloadTempFile(result);
                                    }).finally(function () {
                                        vm.loading = false;
                                    });

            }

            //function b64toBlob(b64Data, contentType, sliceSize) {
            //    contentType = contentType || '';
            //    sliceSize = sliceSize || 512;

            //    var byteCharacters = atob(b64Data);
            //    var byteArrays = [];

            //    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            //        var slice = byteCharacters.slice(offset, offset + sliceSize);

            //        var byteNumbers = new Array(slice.length);
            //        for (var i = 0; i < slice.length; i++) {
            //            byteNumbers[i] = slice.charCodeAt(i);
            //        }

            //        var byteArray = new Uint8Array(byteNumbers);

            //        byteArrays.push(byteArray);
            //    }

            //    var blob = new Blob(byteArrays, { type: contentType });
            //    return blob;
            //}
            function init() {
                vm.loading = true;
                getLocations();
                if (vm.filters.vehicle) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                if (vm.filters.invoiceType)
                    getInvoiceType(vm.filters.invoiceType)
                vm.filters.dontPaginate = true;
                invoiceCustomReportService.getInvoices2(vm.filters).success(function (data) {
                    vm.invoiceReportData = data.items;
                    vm.totalCount = data.totalCount;

                    vm.sumLimoFare = 0;
                    vm.sumWaitingCharges = 0;
                    vm.sumTax = 0;
                    vm.sumOtherCharges = 0;
                    vm.sumAmount = 0;

                    angular.forEach(vm.invoiceReportData, function (value, key) {
                        //value.waitingCharges = utilities.round(value.waitingCharges, 2);
                        //value.additionalCharges = utilities.round(value.additionalCharges, 2);
                        //value.tax = utilities.round(value.tax, 2);
                        //value.amount = utilities.round(value.amount, 2);

                        vm.sumLimoFare += value.limoFare;
                        vm.sumWaitingCharges += value.waitingCharges;
                        vm.sumTax += value.tax;
                        vm.sumOtherCharges += value.otherCharges;
                        vm.sumAmount += value.amount;
                    });

                    vm.sumLimoFare = utilities.round(vm.sumLimoFare, 2);
                    vm.sumWaitingCharges = utilities.round(vm.sumWaitingCharges, 2);
                    vm.sumTax = utilities.round(vm.sumTax, 2);
                    vm.sumOtherCharges = utilities.round(vm.sumOtherCharges, 2);
                    vm.sumAmount = utilities.round(vm.sumAmount, 2);

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();

        }]);
