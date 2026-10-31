// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:333696-333805
appModule.controller('tenant.views.crs.vouchers.creditNotes.report2', ['$scope', 'abp.services.app.creditNote', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, creditNoteService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            vm.totalAmount = 0;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isReasonEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Reason"));
            vm.isReasonNoteEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ReasonNote"));
            vm.isAllocationInCreditNoteSettingEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAllocationsInCreditNote"));
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");

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
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getCreditNoteTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 22) return app.localize("CounterReceiveable");
                else if (voucherSubTypeId == 23) return app.localize("OnAccount");
            };

            vm.getApprovedType = function (type) {
                if (!type) return;
                else if (type == 1) return 'None';
                else if (type == 2) return 'Approved';
                else if (type == 3) return 'Not Approved';

            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.NumFunc = function () {
                var val = vm.CurrencyFormate(parseInt(vm.totalAmount));
                return val;
            }

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
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }
            function init() {
                getLocations();
                vm.loading = true;
                creditNoteService.getCreditNotesReport2(vm.filters).success(function (data) {
                    vm.creditNoteReportData = data.items;
                    angular.forEach(vm.creditNoteReportData, function (value, key) {
                        vm.totalAmount += (value.debit + value.tax);
                    });
                    //vm.totalAmount = vm.totalAmount.toFixed(2);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
