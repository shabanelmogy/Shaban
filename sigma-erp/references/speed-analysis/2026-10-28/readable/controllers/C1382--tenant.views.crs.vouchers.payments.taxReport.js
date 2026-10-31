// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:376522-376654
appModule.controller('tenant.views.crs.vouchers.payments.taxReport',
        ['$scope', '$stateParams', 'abp.services.app.payment', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, paymentService, commonLookupService, utilities) {
            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Invoices");
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
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
            if (vm.filters.voucherNo) {
                vm.filters.locationId = null;
                vm.filters.customer = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.paymentType = null;
            }
            
            if (!vm.isApprovedEnabled) {
                vm.filters.approvedById = null;
                vm.filters.createdById = null;
                vm.filters.approvedType = null;
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
            vm.getPaymentType = function (type) {
                if (type == 6) {
                    if (vm.isAccountFeatureEnabled)
                        return app.localize('PettyCashExpensePayment')
                    else
                        return app.localize('ExpensePayment')
                }
                if (type == 3)
                    return app.localize('CustomerPayment');
                if (type == 4)
                    return app.localize('SupplierPayment');
                if (type == 5)
                    return app.localize('StaffPayment');
                if (type == 59)
                    return app.localize('StockPurchasePayment');
                if (type == 71)
                    return app.localize('AdvancePayment');
                if (type == 114)
                    return app.localize('SalaryPayment');
                if (type == 1001)
                    return app.localize('StaffAdvancePayment');
                if (type == 1002)
                    return app.localize('StaffLoanPayment');
                return '';
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                paymentService.getTaxReport(vm.filters).success(function (data) {
                    vm.invoiceReportData = data.items;
                    vm.totalTax = vm.invoiceReportData.reduce((accu, curr) => accu += curr.tax, 0);
                    vm.totalVatableAmount = vm.invoiceReportData.reduce((accu, curr) => accu += curr.vatableAmount, 0);
                    vm.totalNonVatableAmount = vm.invoiceReportData.reduce((accu, curr) => accu += curr.nonVatableAmount, 0);
                    vm.totalAmount = vm.invoiceReportData.reduce((accu, curr) => accu += curr.amount, 0);
                   
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
