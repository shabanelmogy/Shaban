// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:240636-240773
appModule.controller('tenant.views.lease.leaseQuotations.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.commonLookup', 'utilities','abp.services.app.leaseQuotation',
        function ($scope, appSession, $stateParams, commonLookupService, utilities, leaseQuotationService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.userName = '';
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.receiptOnScreenAllocationWithTypesOfCharges = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithTypesOfCharges"));
            vm.receiptOnScreenAllocationWithReceivables = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithReceivables"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.receiptAllocationData = null;
            vm.filteredAllocations = [];
            var agreementId = null;
            var leaseQuotationId = 0;
            vm.showGeneralPayment = false;
            vm.billingMethods = [];

            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.leaseQuotationId)
                    leaseQuotationId = $scope.$parent.vmMain.leaseQuotationId;
            }

            //if through url print
            if (leaseQuotationId == 0 && !isNaN($stateParams.query)) {
                leaseQuotationId = $stateParams.query;
            }


            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.filteringAllocations = function (item) {
                if (item.allocatedNow > 0)
                    return true;
                else
                    return false;
            };
            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };

            vm.rounding = function (value) {
                
                return utilities.round(value, 2);
            };


            vm.getlocalDateTimeYearMonth = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY/MM';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };
            vm.sumAllocatedAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData, function (value, key) {
                    if (value.amount > 0)
                        amount = amount + value.amount;
                });

                return amount;
            };
            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            function init() {
                vm.loading = true;
                leaseQuotationService.getLeaseQuotationForPrint({ id: leaseQuotationId }).success(function (data) {
                    vm.leaseQuotation = data.leaseQuotationDto;
                    vm.contactName = data.creatorUserName;
                    vm.contactDesignation = data.creatorUserDesignation;
                    vm.contactNumber = data.creatorContactNumber;
                    vm.contactEmail = data.creatorUserEmail;
                    vm.oneYearLeaseValue = 0;
                    vm.twoYearLeaseValue = 0;
                    vm.threeYearLeaseValue = 0;
                    vm.fourYearLeaseValue = 0;
                    vm.fiveYearLeaseValue = 0;
                    angular.forEach(vm.leaseQuotation.quotationLines, function (row) {
                        vm.oneYearLeaseValue += row.amount1Year;
                        vm.twoYearLeaseValue += row.amount2Year;
                        vm.threeYearLeaseValue += row.amount3Year;
                        vm.fourYearLeaseValue += row.amount4Year;
                        vm.fiveYearLeaseValue += row.amount5Year;
                    });


                }).finally(function () {
                    vm.loading = false;
                });

            }
            init();


        }
    ]);
