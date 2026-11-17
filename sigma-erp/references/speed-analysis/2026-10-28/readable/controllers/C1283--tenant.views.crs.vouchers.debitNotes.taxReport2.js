// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:337753-337916
appModule.controller('tenant.views.crs.vouchers.debitNotes.taxReport2',
        ['$scope', '$stateParams', 'abp.services.app.debitNote', 'abp.services.app.commonLookup', 'utilities',
            function ($scope, $stateParams, debitNoteService, commonLookupService, utilities) {
                var vm = this;
                vm.locationName = '';
                vm.totalCreditAmount = 0;
                vm.totalDebitAmount = 0;
                vm.totalDueAmount = 0;
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');

                vm.filters = null;

                if ($scope.$parent !== null) {
                    if ($scope.$parent.vmMain !== null)
                        vm.filters = $scope.$parent.vmMain.filters;
                }

                if (vm.filters == null)
                    vm.filters = $stateParams.filters;
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.DebitNotes");
                if (vm.filters.voucherNo) {
                    vm.filters.locationId = null;
                    vm.filters.customer = null;
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                    vm.filters.approvedType = null;
                }
                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                    vm.filters.approvedType = null;
                }

                vm.getApprovedType = function (type) {
                    if (!type) return;
                    else if (type == 1) return 'None';
                    else if (type == 2) return 'Approved';
                    else if (type == 3) return 'Not Approved';

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


                vm.CurrencyFormate = function (amount) {
                    if (amount == null) return null;
                    return amount.toLocaleString('en');
                };

                vm.roundingforView = function (value) {
                    var roundedValue = utilities.roundforView(value, 2);
                    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };

                vm.isAuthorized = function (Id) {
                    if (Id == 1) {
                        return "Yes";
                    } else if (Id == 0) {
                        return "No"
                    }
                    return null;
                }
                vm.getIsClosed = function (id) {
                    if (id == 0) return app.localize("Open");
                    if (id == 1) return app.localize("Closed");
                };
                vm.getStatuses = function (id) {
                    if (id == 1) return app.localize("Open");
                    if (id == 2) return app.localize("Closed");
                };
                vm.getApprovedType = function (type) {
                    if (!type) return;
                    else if (type == 1) return 'None';
                    else if (type == 2) return 'Approved';
                    else if (type == 3) return 'Not Approved';

                };
                vm.getDebitNoteTypeById = function (voucherSubTypeId) {
                    if (voucherSubTypeId == 31) return app.localize("CounterPayable");
                    else if (voucherSubTypeId == 32) return app.localize("OnAccount");
                    else if (voucherSubTypeId == 45) return app.localize("AssetSale");
                };
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

                function init() {
                    vm.loading = true;
                    getLocations();

                    if (vm.filters.vehicle) {
                        vm.filters.vehicleId = vm.filters.vehicle.id;
                    }

                    vm.filters.dontPaginate = true;

                    debitNoteService.getTaxReport2(vm.filters)
                        .success(function (data) {

                            vm.invoiceReportData = data.items || [];

                            vm.totalTax = 0;
                            vm.totalVatableAmount = 0;
                            vm.totalNonVatableAmount = 0;
                            vm.totalAmount = 0;

                            vm.invoiceReportData.forEach(function (line) {

                                line.vatableAmount = 0;
                                line.nonVatableAmount = 0;

                                if (line.tax > 0) {
                                    line.vatableAmount = line.credit || 0;
                                }

                                if (
                                    line.tax === 0 &&
                                    line.chargesTypeId !== 21
                                ) {
                                    line.nonVatableAmount = line.credit || 0;
                                }

                                vm.totalTax += line.tax || 0;
                                vm.totalVatableAmount += line.vatableAmount;
                                vm.totalNonVatableAmount += line.nonVatableAmount;
                                vm.totalAmount += (line.credit || 0) + (line.tax || 0);
                            });
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }
               
                init();
            }]);
