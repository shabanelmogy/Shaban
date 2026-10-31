// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:351275-351589
appModule.controller('tenant.views.crs.vouchers.invoices.generateLimoModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.limoTrip', '$filter', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, tripService, $filter, directoryService, commonLookupService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.generatedInvoices = null;
            vm.canChangeCharges = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ChangeCharges');
            vm.viewOtherBranch = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips');
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips');
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.limoCustomField = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField"));
            vm.limoCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField1"));
            vm.manualTripNo = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.rateAndQunatityInLimo = utilities.parseBoolean(abp.setting.get("App.General.Limo.QuantityAndRateInLimo"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isBranchWiseTaxEnabled = abp.features.isEnabled('CRS.CustomFeatures.TaxBranchwise');
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.localize = function (input) {
                if (input == null)
                    return "";
                return app.localize(input);
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.chargesChanged = function (trip) {
                var totalCharges = 0.0;
                var totalTax = 0.0;

                trip.tripCharges.forEach(function (value) {
                    var charges = parseFloat(value.charges) || 0;

                    // Discount hamesha negative honi chahiye
                    if (value.chargesTypeId == 22 && charges > 0) {
                        charges = -charges;
                    }
                    value.charges = charges;

                    var tax = 0;
                    if (value.taxable && trip.taxPercent > 0) {
                        if (vm.isTaxInclusive) {
                            var chargesWithoutTax = (charges * 100) / (100 + trip.taxPercent);
                            tax = utilities.round(charges - chargesWithoutTax, 2);
                        } else {
                            tax = utilities.round(charges * trip.taxPercent / 100, 2);
                        }
                    }
                    value.tax = tax;

                    totalCharges += charges;
                    totalTax += tax;
                });

                trip.tax = utilities.round(totalTax, 2);
                trip.charges = vm.isTaxInclusive
                    ? utilities.round(totalCharges, 2)
                    : utilities.round(totalCharges + totalTax, 2);
            };

            vm.filters = {
                customerId: null,
                limoCustomField: null,
                limoCustomField1: null,
                manualTripNo: null,
                asOfDate: moment().utc()
            };

            vm.selectUnselect = function (row) {
                if (row.generate) {
                    var foundLines = $filter('filter')(vm.data, {
                        customerId: row.customerId,
                        invoiceNo: null,
                        enableDateAndLocation: true,
                    }, true);

                    if (foundLines.length == 0) {
                        row.enableDateAndLocation = true;
                        row.invoiceDate = angular.copy(vm.filters.asOfDate.toJSON());
                        row.invoiceLocationId = row.locationId;
                    }
                    else {
                        row.enableDateAndLocation = false;
                        row.invoiceDate = null;
                        row.invoiceLocationId = null;
                    }
                }
                else {
                    row.enableDateAndLocation = false;
                    row.invoiceDate = null;
                    row.invoiceLocationId = null;
                }

            };

            vm.allBoxTicked = function () {
                if (vm.data == null) return;

                angular.forEach(vm.data, function (invoiceDue) {
                    if (invoiceDue.invoiceNo == null) {
                        invoiceDue.generate = vm.all;
                        invoiceDue.enableDateAndLocation = false;
                        invoiceDue.invoiceDate = null;
                        invoiceDue.invoiceLocationId = null;
                    }

                });
                angular.forEach(vm.data, function (invoiceDue) {
                    if (invoiceDue.invoiceNo == null)
                        vm.selectUnselect(invoiceDue);
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.generate = function () {
                var invoicesToGenerate = [];
                if (!vm.data) return;
                if (vm.data.length == 0) return;

                var zeroAmountCheckedTrips = $filter('filter')(vm.data, {
                    charges: 0,
                    generate: true,
                }, true);

                if (zeroAmountCheckedTrips.length >= 1) return;

                angular.forEach(vm.data, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null && invoiceDue.charges > 0)
                        invoicesToGenerate.push(invoiceDue);
                });

                if (invoicesToGenerate.length == 0) return;

                vm.saving = true;
                invoiceService.generateLimoInvoices({ asOfDate: vm.filters.asOfDate.endOf('day'), trips: invoicesToGenerate }).success(function (data) {
                    vm.generatedInvoices = data;

                    angular.forEach(vm.generatedInvoices, function (generatedInvoice) {

                        var foundLines = $filter('filter')(vm.data, {
                            id: generatedInvoice.tripId,
                        }, true);

                        if (foundLines.length) {
                            foundLines[0].invoiceId = generatedInvoice.invoiceId;
                            foundLines[0].invoiceNo = generatedInvoice.invoiceNo;
                            foundLines[0].error = generatedInvoice.error;
                        }
                    });

                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search customer popup
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
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.customerId = customer.id;
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };
            vm.viewTrip = function (tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/viewTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.viewTripModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        tripId: function () {
                            return tripId;
                        }
                    }
                });
            };
            vm.logTrip = function (tripId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/logTripModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.logTripModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                tripId: tripId
                            };
                        }
                    }
                });
            };
            vm.getTripsToInvoice = function () {
                vm.generatedInvoices = [];
                vm.loading = true;
                vm.showDiscountColumn = false;

                tripService.getTripsDueToInvoice({ customerId: vm.filters.customerId, limoCustomField: vm.filters.limoCustomField, limoCustomField1: vm.filters.limoCustomField1, manualTripNo: vm.filters.manualTripNo, asOfDate: vm.filters.asOfDate, locationId: vm.filters.locationId }).success(
                    function (result) {
                        vm.data = result.items;
                        vm.data.forEach(function (value) {
                            value.enableDateAndLocation = false;
                            value.invoiceNo = null;
                            value.generate = false;

                            var totalCharges = 0;
                            var totalDiscount = 0;
                            var totalTax = 0;

                            if (value.tripCharges && value.tripCharges.length > 0) {

                                value.tripCharges.forEach(function (charge) {

                                    var charges = parseFloat(charge.charges) || 0;
                                    var tax = parseFloat(charge.tax) || 0;

                                    if (vm.rateAndQunatityInLimo) {
                                        charge.taxable = charge.taxCategory == 1;
                                    }

                                    if (charge.chargesTypeId === 22) {
                                        // Discount hamesha negative
                                        charges = -Math.abs(charges);
                                        tax = -Math.abs(tax);
                                        charge.charges = charges;
                                        charge.tax = tax;

                                        totalDiscount += charges;
                                        vm.showDiscountColumn = true;
                                    }
                                    else {
                                        totalCharges += charges;
                                    }

                                    // Tax har row (discount included) ka total tax me jaana chahiye
                                    totalTax += tax;
                                });
                            }

                            value.discount = totalDiscount;
                            value.tax = utilities.round(totalTax, 2);

                            // charges field = gross (tax-inclusive) amount, jaisa baaki jagah convention hai
                            value.charges = vm.isTaxInclusive
                                ? utilities.round(totalCharges + totalDiscount, 2)
                                : utilities.round(totalCharges + totalDiscount + totalTax, 2);
                        });
                    }).finally(function () {
                        vm.loading = false;
                        vm.all = false;
                    });
            };
            function init() {
                getLocations();

            }
            init();
        }
    ]);
